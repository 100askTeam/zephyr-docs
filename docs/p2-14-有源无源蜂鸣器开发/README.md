---
title: 第 14 课：有源/无源蜂鸣器开发
---

# 第 14 课：有源/无源蜂鸣器开发

本课拆解 `buzzer_demo` 的源码结构。与直接调用底层 `pwm_set_dt()` 的 RGB 示例不同，本工程为蜂鸣器专门实现了一套**自定义子系统驱动（`<dshan/buzzer.h>` + `buzzer_pwm.c`）**，应用仅调用 `buzzer_beep()` 等高级语义接口，在独立工作线程中发声（快速体验见 [一期第 3 课：有源/无源蜂鸣器](../p1-03-有源无源蜂鸣器/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/buzzer_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 CONFIG_PWM 与 CONFIG_DSHAN_PWM_BUZZER
│  ├─ boards/dshanmcu_hpm6e70.overlay  # PF26 pinmux + dshan,pwm-buzzer 节点
│  └─ src/main.c                       # 创建 buzzer_thread，阻塞播放三段测试音
└─ platform/
   ├─ include/dshan/buzzer.h           # 公共子系统 API（tone_start / stop / beep）
   ├─ dts/bindings/misc/dshan,pwm-buzzer.yaml
   └─ drivers/buzzer/
      ├─ Kconfig                       # 定义 CONFIG_DSHAN_PWM_BUZZER
      ├─ CMakeLists.txt
      └─ buzzer_pwm.c                  # PWM 蜂鸣器驱动实现
```

## 配置与设备树解析

### 1. `prj.conf` 与自研驱动 Kconfig

`applications/buzzer_demo/prj.conf` 中打开：

```ini
CONFIG_PWM=y
CONFIG_DSHAN_PWM_BUZZER=y
CONFIG_MAIN_STACK_SIZE=4096
CONFIG_SYSTEM_WORKQUEUE_STACK_SIZE=2048
CONFIG_THREAD_NAME=y
```

`platform/drivers/buzzer/Kconfig` 中 `DSHAN_PWM_BUZZER` 依赖 `DT_HAS_DSHAN_PWM_BUZZER_ENABLED` 并自动 `select PWM`。`CONFIG_THREAD_NAME=y` 用于给自定义线程命名为 `"buzzer"` 便于调试追踪。

### 2. `boards/dshanmcu_hpm6e70.overlay` 设备树

底板 **M9** 信号 `PA8` 连接到核心板 **PF26**，复用功能为 `PWM3_P_2`（`alt = 16`）：

```dts
&pinctrl {
	buzzer_pwm_pin: buzzer_pwm_pin {
		group0 {
			pinmux = <HPMICRO_PINMUX(HPMICRO_PIN(HPMICRO_PORTF, 26),
						 IOC_TYPE_IOC, 0, 16)>;
		};
	};
};

&pwm3 {
	status = "okay";
	pinctrl-0 = <&buzzer_pwm_pin>;
	pinctrl-names = "default";
};

/ {
	buzzer: buzzer {
		compatible = "dshan,pwm-buzzer";
		status = "okay";
		pwms = <&pwm3 2 500000 PWM_POLARITY_NORMAL>;
		min-frequency-hz = <100>;
		max-frequency-hz = <5000>;
		duty-cycle-percent = <50>;
	};
};
```

- `min-frequency-hz` / `max-frequency-hz` 与 `duty-cycle-percent` 由 `platform/drivers/buzzer/buzzer_pwm.c` 编译期通过 `BUILD_ASSERT` 校验范围，并在运行期约束音调频率。
- 若使用低电平有效蜂鸣器模块，把 `PWM_POLARITY_NORMAL` 改为 `PWM_POLARITY_INVERTED` 后重新编译即可。

## 源码解析

### 1. 自定义驱动子系统接口设计（`platform/include/dshan/buzzer.h`）

为了让应用彻底脱离底层的 `PF26` 引脚与 `PWM3` 细节，`platform/include/dshan/buzzer.h` 定义了独立的 `buzzer` 子系统虚表与内联封装函数：

```c
__subsystem struct buzzer_driver_api {
	int (*tone_start)(const struct device *dev, uint32_t frequency_hz);
	int (*stop)(const struct device *dev);
	int (*beep)(const struct device *dev, uint32_t frequency_hz,
		    uint32_t duration_ms);
};

static inline int buzzer_tone_start(const struct device *dev,
				    uint32_t frequency_hz)
{
	const struct buzzer_driver_api *api =
		(const struct buzzer_driver_api *)dev->api;

	return api->tone_start(dev, frequency_hz);
}

static inline int buzzer_stop(const struct device *dev)
{
	const struct buzzer_driver_api *api =
		(const struct buzzer_driver_api *)dev->api;

	return api->stop(dev);
}

static inline int buzzer_beep(const struct device *dev, uint32_t frequency_hz,
			      uint32_t duration_ms)
{
	const struct buzzer_driver_api *api =
		(const struct buzzer_driver_api *)dev->api;

	return api->beep(dev, frequency_hz, duration_ms);
}
```

应用层只需引用 `dev->api`，未来哪怕把蜂鸣器换成 I2C/定时器芯片实现，也只需新增一份 `.c` 实现相同的 `buzzer_driver_api`，上层代码无需改动一行。

### 2. PWM 蜂鸣器驱动实现与编译期约束（`platform/drivers/buzzer/buzzer_pwm.c`）

```c
static int buzzer_apply_tone(const struct device *dev, uint32_t frequency_hz)
{
	const struct buzzer_config *config = dev->config;
	uint64_t period_ns;
	uint64_t pulse_ns;

	if (frequency_hz < config->min_frequency_hz ||
	    frequency_hz > config->max_frequency_hz) {
		return -ERANGE;
	}

	period_ns = NSEC_PER_SEC / frequency_hz;
	pulse_ns = period_ns * config->duty_cycle_percent / 100U;

	return pwm_set(config->pwm.dev, config->pwm.channel,
		       (uint32_t)period_ns, (uint32_t)pulse_ns,
		       config->pwm.flags);
}

static int buzzer_beep_impl(const struct device *dev, uint32_t frequency_hz,
			    uint32_t duration_ms)
{
	struct buzzer_data *data = dev->data;
	int ret;

	if (duration_ms == 0U) {
		return -EINVAL;
	}

	k_mutex_lock(&data->lock, K_FOREVER);
	ret = buzzer_apply_tone(dev, frequency_hz);
	if (ret == 0) {
		k_sleep(K_MSEC(duration_ms));
		ret = buzzer_apply_stop(dev);
	}
	k_mutex_unlock(&data->lock);

	return ret;
}
```

- **并发互锁**：`struct buzzer_data` 内置 `struct k_mutex lock`，确保多个线程同时调用 `buzzer_beep()` / `buzzer_tone_start()` / `buzzer_stop()` 时不会把半截音符打断；
- **编译期安全断言**：`BUZZER_DEFINE(inst)` 展开时通过 `BUILD_ASSERT` 在编译阶段检查设备树的 `min-frequency-hz > 0`、`max >= min` 以及 `1..99` 的占空比区间，非法设备树属性在编译期就会直接报错拦下，最后经 `DEVICE_DT_INST_DEFINE(..., &buzzer_api)` 注册实例。

### 3. 应用层独立发声线程与主线程解耦（`applications/buzzer_demo/src/main.c`）

由于 `buzzer_beep()` 会在驱动内部执行 `k_sleep(K_MSEC(duration_ms))` 阻塞等待发声结束，示例通过 `K_THREAD_STACK_DEFINE` 创建了独立的工作线程来播放音阶，把 `main()` 留给心跳灯（或主业务）：

```c
#define BUZZER_STACK_SIZE      1536
#define BUZZER_THREAD_PRIORITY 5

static const struct tone_step test_pattern[] = {
	{ 2000U, 150U, "LOW" },
	{ 2500U, 150U, "MIDDLE" },
	{ 3000U, 400U, "HIGH" },
};

K_THREAD_STACK_DEFINE(buzzer_stack, BUZZER_STACK_SIZE);
static struct k_thread buzzer_thread_data;

static void buzzer_thread(void *p1, void *p2, void *p3)
{
	uint32_t pattern_count = 0U;
	ARG_UNUSED(p1); ARG_UNUSED(p2); ARG_UNUSED(p3);

	while (true) {
		pattern_count++;
		printk("\nM9 pattern #%u: three PWM tones\n", pattern_count);

		for (size_t i = 0; i < ARRAY_SIZE(test_pattern); ++i) {
			const struct tone_step *step = &test_pattern[i];
			int ret = buzzer_beep(buzzer, step->frequency_hz,
					      step->duration_ms);
			if (ret < 0) {
				printk("ERROR: buzzer beep failed: %d\n", ret);
				break;
			}
			k_sleep(K_MSEC(150));
		}
		k_sleep(K_SECONDS(2));
	}
}
```

- 在 `main()` 中通过 `k_thread_create()` 与 `k_thread_name_set(buzzer_tid, "buzzer")` 启动该线程后，`main()` 自身的 `while (true)` 只需每 `500 ms` 执行一次 `gpio_pin_toggle_dt(&led)`，两条线程各自休眠、互不干扰；
- **二次开发提示**：修改 `test_pattern[]` 可编写告警音或乐谱序列；如果在中断或 UI 主线程里需要“按下发声、松开停音”，可以直接改用非阻塞的 `buzzer_tone_start()` 与 `buzzer_stop()`。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\buzzer_demo -d build\buzzer_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M9** 已插入蜂鸣器且 **M4（红外发射）已拔除**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\buzzer_demo
```

烧录并校验完成后，在串口终端（`115200 8-N-1`）观察驱动就绪与音阶播报：

```text
buzzer demo: devicetree plus driver plus application
SDRAM quick check PASSED (32 MiB)
M9 buzzer driver ready: PF26 / PWM3 channel 2
M9 pattern #1: three PWM tones
[BUZZER] LOW    tone 2000 Hz for 150 ms
```

---

[上一课：RGB 全彩 LED 调色开发](../p2-13-RGB全彩LED调色开发/README.md) · [下一课：DHT11 温湿度采集开发](../p2-15-DHT11温湿度采集开发/README.md) · [课程目录](../README.md)
