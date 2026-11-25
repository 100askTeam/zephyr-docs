---
title: 第 13 课：RGB 全彩 LED 调色开发
---

# 第 13 课：RGB 全彩 LED 调色开发

本课从开发者视角拆解 `rgb_led_demo` 的源码工程：确认源码目录位置、理解 `pwm-leds` 设备树写法与 Zephyr 标准 PWM API 调色逻辑，并使用 `west build` 编译与 `west flash` 烧录验证（如需零编译直接烧录体验，见 [一期第 2 课：RGB 全彩 LED 调色](../p1-02-RGB全彩LED调色/README.md)）。

## 源码位置与文件结构

本示例位于 `HPM6E70` 工程根目录的 `applications/rgb_led_demo/`，复用 Zephyr 内置 PWM 子系统与 HPMicro PWM 适配驱动，**不需要编写任何自定义驱动源码**：

```text
HPM6E70/
├─ applications/rgb_led_demo/
│  ├─ CMakeLists.txt                   # 应用构建入口，绑定 src/main.c
│  ├─ prj.conf                         # 开启 GPIO、PWM 与 SDRAM 自检所需 Kconfig
│  ├─ boards/dshanmcu_hpm6e70.overlay  # 使能 pwm0/pwm1，定义 rgb-led 与别名
│  └─ src/main.c                       # 核心板自检 + PWM 三通道调色逻辑
└─ sdk_glue/drivers/pwm/pwm_hpmicro.c  # 底层 HPM PWM 控制器驱动
```

## 配置与设备树解析

### 1. `prj.conf` 关键配置

```ini
CONFIG_GPIO=y
CONFIG_PWM=y
CONFIG_DSHANMCU_HPM6E70_SDRAM=y
CONFIG_INIT_EXT_RAM=y
CONFIG_BUILD_OUTPUT_HEX=y
```

- `CONFIG_PWM=y`：启用 Zephyr PWM 子系统并自动编入 HPMicro PWM 驱动；
- `CONFIG_BUILD_OUTPUT_HEX=y`：编译时同步输出 `zephyr.hex`，供 `west flash` 烧录使用。

### 2. `boards/dshanmcu_hpm6e70.overlay` 设备树

底板 **M3** 的三色灯分别接到两颗不同 PWM 控制器（红 `PB09` → `PWM1_P_1`，绿 `PF01` → `PWM0_P_1`，蓝 `PF00` → `PWM0_P_0`），overlay 同时开启 `&pwm0` 和 `&pwm1`，再通过 `pwm-leds` 子节点与 `aliases` 暴露给应用：

```dts
&pwm0 {
	status = "okay";
	pinctrl-0 = <&pinmux_pwm0>;
	pinctrl-names = "default";
};

&pwm1 {
	status = "okay";
	pinctrl-0 = <&pinmux_pwm1>;
	pinctrl-names = "default";
};

/ {
	rgb_led: rgb-led {
		compatible = "pwm-leds";
		rgb_red: rgb_red {
			pwms = <&pwm1 1 1000000 PWM_POLARITY_NORMAL>;
		};
		rgb_green: rgb_green {
			pwms = <&pwm0 1 1000000 PWM_POLARITY_NORMAL>;
		};
		rgb_blue: rgb_blue {
			pwms = <&pwm0 0 1000000 PWM_POLARITY_NORMAL>;
		};
	};

	aliases {
		red-pwm-led = &rgb_red;
		green-pwm-led = &rgb_green;
		blue-pwm-led = &rgb_blue;
	};
};
```

- `1000000` 表示 PWM 周期 `1,000,000 ns`（即 `1 kHz` 刷新率，肉眼无闪烁）；
- **硬件极性切换点**：默认使用 `PWM_POLARITY_NORMAL`（高电平点亮）。若使用**共阳极模块**（表现为颜色变成补色），只需把三路 `pwms` 末尾改为 `PWM_POLARITY_INVERTED` 并加 `-p always` 重建即可，C 代码无需改动。

## 源码解析（`src/main.c`）

`applications/rgb_led_demo/src/main.c` 分为“核心板基础设施自检（SDRAM + 心跳灯）”和“PWM 多控制器三色调色”两部分。

### 1. 绕过 L1 D-Cache 的外部 SDRAM 快速自检（`quick_sdram_check`）

核心板已在内核启动前的板级初始化阶段完成 32 MiB 外部 SDRAM（`&dram`）初始化。应用启动后首先执行一次不依赖完整扫描的快速互补字校验（后续所有二期示例均复用同一套模板）：

```c
static int quick_sdram_check(void)
{
	static const uint32_t values[] = {
		0x00000000U, 0xFFFFFFFFU, 0xA55A5AA5U, 0x5AA5A55AU
	};
	volatile uint32_t *mem = (volatile uint32_t *)SDRAM_BASE;
	bool dcache_was_enabled;
	bool ok = true;
	int init_status;

	init_status = dshanmcu_hpm6e70_get_sdram_init_status();
	if (init_status != 0) {
		printk("FAIL [pre-kernel init] status=%d\n", init_status);
		return 1;
	}

	dcache_was_enabled = l1c_dc_is_enabled();
	if (dcache_was_enabled) {
		l1c_dc_writeback_all();
		l1c_dc_disable();
	}

	for (size_t i = 0; i < ARRAY_SIZE(values); ++i) {
		mem[i] = values[i];
	}
	for (size_t i = 0; i < ARRAY_SIZE(values); ++i) {
		if (mem[i] != values[i]) {
			ok = false;
			break;
		}
	}

	if (dcache_was_enabled) {
		l1c_dc_invalidate_all();
		l1c_dc_enable();
	}
	return ok ? 0 : 1;
}
```

- **为什么要临时关闭 D-Cache**：如果开着 L1 D-Cache 做四字测试，读写很可能只命中 CPU 缓存而没有真正经 FEMC 控制器落到外部 SDRAM 颗粒，起不到检验硬件通路的作用；
- **写回与失效成对调用**：关闭前 `l1c_dc_writeback_all()` 防止关 Cache 后丢失尚未刷入主存的脏数据，重新启用前 `l1c_dc_invalidate_all()` 则避免重新打开后命中过期缓存行。

### 2. 跨 PWM 控制器的设备树句柄提取与就绪检查（`rgb_init`）

```c
static const struct pwm_dt_spec pwm_red =
	PWM_DT_SPEC_GET(DT_ALIAS(red_pwm_led));
static const struct pwm_dt_spec pwm_green =
	PWM_DT_SPEC_GET(DT_ALIAS(green_pwm_led));
static const struct pwm_dt_spec pwm_blue =
	PWM_DT_SPEC_GET(DT_ALIAS(blue_pwm_led));

static int rgb_init(void)
{
	if (!pwm_is_ready_dt(&pwm_red) || !pwm_is_ready_dt(&pwm_green) ||
	    !pwm_is_ready_dt(&pwm_blue)) {
		printk("ERROR: rgb pwm device not ready\n");
		return -ENODEV;
	}
	printk("pwm: %s/%s/%s ready (period=%uns)\n",
	       pwm_red.dev->name, pwm_green.dev->name, pwm_blue.dev->name,
	       pwm_red.period);
	return 0;
}
```

- 红灯在 `pwm1` 通道 1（`PB09`），绿/蓝灯在 `pwm0` 通道 1/0（`PF01`/`PF00`），`PWM_DT_SPEC_GET()` 在编译期就把控制器 `struct device *`、通道号 `channel`、周期 `period` 与极性 `flags` 打包成只读结构体，无需应用代码逐个硬编码外设基址。

### 3. 表驱动调色板与 64 位防溢出占空比换算（`palette` & `set_channel`）

```c
static const struct rgb_color {
	uint8_t r, g, b;
	const char *name;
} palette[] = {
	{100,   0,   0, "red    "},
	{  0, 100,   0, "green  "},
	{  0,   0, 100, "blue   "},
	{100, 100,   0, "yellow "},
	{  0, 100, 100, "cyan   "},
	{100,   0, 100, "magenta"},
	{100, 100, 100, "white  "},
	{  0,   0,   0, "off    "},
};

static int set_channel(const struct pwm_dt_spec *spec, uint8_t percent)
{
	uint64_t pulse = ((uint64_t)spec->period * percent) / 100U;

	return pwm_set_dt(spec, spec->period, (uint32_t)pulse);
}
```

在 `main()` 的主循环中依次取出 `palette[i]` 并调用三次 `set_channel()`：
- **防 32 位乘法溢出**：先强转为 `(uint64_t)` 再乘 `percent`，防止当 PWM 周期设定为数十毫秒以上（超过 `42,949,672 ns`）时 `period * 100` 发生 32 位整数截断；
- **二次开发提示**：修改 `palette[]` 里的 RGB 百分比（0～100）可实现任意混色；把 `k_sleep(K_SECONDS(1))` 改小（例如 `20 ms`）并按正弦/三角波更新 `r/g/b`，即可做出呼吸灯或柔和渐变过渡。

## 编译步骤（`west build`）

确认已按 [获取源码与编译烧录](../start-04-获取源码与编译烧录/README.md) 检查完 `HPM6E70` 工程根目录环境后，执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\rgb_led_demo -d build\rgb_led_demo
```

- 仅修改 `src/main.c` 时可省略 `-p always` 做增量编译；修改过 `prj.conf` 或 `.overlay` 后建议保留 `-p always`。
- 构建完成后可执行镜像位于 `build\rgb_led_demo\zephyr\zephyr.hex`。

## 烧录步骤与串口验证（`west flash`）

确认 JTAG 与串口按 [连接调试器与串口](../start-01-连接调试器与串口/README.md) 接好且板卡已上电，将 RGB LED 模块插到底板 **M3** 插座，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\rgb_led_demo
```

看到 OpenOCD 输出 `wrote ... bytes` 与 `verified ... bytes` 并复位后，在串口终端（`115200 8-N-1`）确认类似输出：

```text
RGB LED demo: coreboard + pwm rgb led
SDRAM quick check PASSED (32 MiB)
pwm: pwm@f0040000/pwm@f0044000/pwm@f0044000 ready (period=1000000ns)
Init complete. LED blinking, color cycling every second.
color: red     (R=100% G=0% B=0%)
```

---

[上一课：OLED 双色屏显示开发](../p2-12-OLED双色屏显示开发/README.md) · [下一课：有源/无源蜂鸣器开发](../p2-14-有源无源蜂鸣器开发/README.md) · [课程目录](../README.md)
