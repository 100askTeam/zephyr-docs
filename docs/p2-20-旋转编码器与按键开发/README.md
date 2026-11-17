---
title: 第 20 课：旋转编码器与按键开发
---

# 第 20 课：旋转编码器与按键开发

本课解析 `rotary_encoder_demo` 的源码实现。该示例不仅使用模块驱动，还将其接入了 **Zephyr 标准 `input` 子系统**——自定义驱动在后台解码正交 AB 相格雷码跳变与按键消抖，通过 `input_report_rel` / `input_report_key` 统一向应用投递标准事件（快速体验见 [一期第 9 课：旋转编码器与按键](../p1-09-旋转编码器与按键/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/rotary_encoder_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 CONFIG_INPUT / 独立线程与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # PA23/PC00/PB10 编码器 + i2c1 ssd1306@3c
│  └─ src/main.c                       # 回调仅更新状态+发信号量，主线程刷新 OLED
└─ platform/
   ├─ dts/bindings/input/dshan,rotary-encoder.yaml
   ├─ drivers/display/oled_ui.c        # 共享 128x64 仪表盘 UI
   └─ drivers/input/rotary_encoder/
      ├─ Kconfig                       # 定义 CONFIG_INPUT_DSHAN_ROTARY_ENCODER
      ├─ CMakeLists.txt
      └─ rotary_encoder.c              # 格雷码查表解码 + 轮询/单边沿重装中断双模式
```

## 配置与设备树解析

### 1. `prj.conf` 关键配置

```ini
CONFIG_INPUT=y
CONFIG_INPUT_MODE_THREAD=y
CONFIG_INPUT_DSHAN_ROTARY_ENCODER=y
CONFIG_INPUT_THREAD_STACK_SIZE=2048
CONFIG_INPUT_QUEUE_MAX_MSGS=32

# M1 OLED 联动显示
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
```

- `CONFIG_INPUT_MODE_THREAD=y`：由 Zephyr `input` 子系统单独开一条线程派发事件队列，因此驱动可以在定时器回调或 GPIO ISR 中以 `K_NO_WAIT` 安全投递事件，应用回调则在独立线程上下文里安全打印日志；overlay 同步配置了 `&i2c1` + `ssd1306@3c`。

### 2. `boards/dshanmcu_hpm6e70.overlay` 设备树

```dts
/ {
	rotary_encoder: rotary-encoder {
		compatible = "dshan,rotary-encoder";
		status = "okay";
		a-gpios = <&gpioa 23 GPIO_ACTIVE_HIGH>;
		b-gpios = <&gpioc 0 GPIO_ACTIVE_HIGH>;
		button-gpios = <&gpiob 10 GPIO_ACTIVE_LOW>;
		zephyr,axis = <INPUT_REL_DIAL>;
		zephyr,code = <INPUT_KEY_0>;
		steps-per-detent = <4>;
		polling-mode;
		poll-interval-us = <1000>;
		debounce-interval-ms = <20>;
	};
};
```

- **引脚与输入使能**：在 `&pinctrl` 中务必给 `PA23`、`PC00`、`PB10` 打开 `input-enable;` 与 `bias-pull-up;`（机械编码器触点需要上拉）；注意 `&gpioc` 要保留板级 LED 组：`pinctrl-0 = <&pinmux_gpioc &rotary_encoder_pins>;`，否则会覆盖板载 `PC22` 心跳灯配置；
- **轮询 vs 中断切换**：默认带 `polling-mode;`（每 `1000 us` 定时器采样）。若删掉 `polling-mode;`，驱动自动切为“每次中断动态重装反向单边沿”的兼容中断模式（以绕开当前 HPM GPIO 适配层不支持 `GPIO_INT_EDGE_BOTH` 的限制）；
- **方向与齿距调优**：顺/逆时针反了可对调 `a-gpios` 与 `b-gpios`；一格跳两次或两格跳一次可在 `2` / `4` 间修改 `steps-per-detent`。

## 源码解析

### 1. 正交格雷码查表解码与抖动自抵消（`platform/drivers/input/rotary_encoder/rotary_encoder.c`）

机械 EC11 编码器旋转时，A/B 两相触点按 2 位格雷码规律切换（`11 -> 01 -> 00 -> 10 -> 11`），每次只有 1 个比特翻转；如果出现机械抖动，也只是在相邻两个状态之间来回跳转：

```c
/* 状态位按 A:B 拼接：A 领先 B 记 +1，反之记 -1，非法或静止记 0 */
static const int8_t transition_table[16] = {
	 0, -1,  1,  0,
	 1,  0,  0, -1,
	-1,  0,  0,  1,
	 0,  1, -1,  0,
};

static void rotary_decode_sample(const struct device *dev)
{
	const struct rotary_encoder_config *config = dev->config;
	struct rotary_encoder_data *data = dev->data;
	uint8_t phase;
	int8_t delta;
	int ret;

	ret = rotary_read_phase(config, &phase);
	if (ret < 0 || phase == data->previous_phase) {
		return;
	}

	delta = transition_table[(data->previous_phase << 2) | phase];

	/* 对角线跳变(两位同时翻转，异或为 0x03)说明中间漏采了一拍，清零防误判 */
	if ((data->previous_phase ^ phase) == 0x03U) {
		data->phase_accumulator = 0;
	} else {
		data->phase_accumulator += delta;
	}
	data->previous_phase = phase;

	if (abs(data->phase_accumulator) >= config->steps_per_detent) {
		int32_t report = data->phase_accumulator / config->steps_per_detent;

		data->phase_accumulator -= report * config->steps_per_detent;
		ret = input_report_rel(dev, config->axis_code, report, true, K_NO_WAIT);
		if (ret < 0) {
			LOG_WRN("rotation event dropped: %d", ret);
		}
	}
}
```

- **天然去抖设计**：假设旋钮刚进入某稳定格点时发生接触弹跳（如 `11 -> 01 -> 11 -> 01`），查表会先后累加 `-1 + 1 - 1 = -1`，再配合 `steps_per_detent = 4`（转动一整物理棘爪定位齿才累计 4 个四分之一相变），微弱弹跳永远不会攒够一格去触发 `input_report_rel()`；
- **`K_NO_WAIT` 非阻塞投递**：无论是 `1000 us` 定时器（`rotary_poll_timer`）还是 GPIO ISR 都在中断/定时器上下文调用 `rotary_decode_sample()`，因此发送事件给 `input` 队列时必须传 `K_NO_WAIT` 防止在原子上下文休眠报错。

### 2. 轮询定时器 vs 单边沿交替重装中断与按键消抖

```c
static int rotary_arm_next_edge(const struct gpio_dt_spec *gpio)
{
	int active = gpio_pin_get_dt(gpio);

	if (active < 0) {
		return active;
	}

	return gpio_pin_interrupt_configure_dt(
		gpio, active ? GPIO_INT_EDGE_TO_INACTIVE : GPIO_INT_EDGE_TO_ACTIVE);
}

static void rotary_phase_a_isr(const struct device *port, struct gpio_callback *cb,
			       gpio_port_pins_t pins)
{
	struct rotary_encoder_data *data =
		CONTAINER_OF(cb, struct rotary_encoder_data, phase_a_cb);
	const struct rotary_encoder_config *config = data->dev->config;

	ARG_UNUSED(port); ARG_UNUSED(pins);

	rotary_decode_sample(data->dev);
	(void)rotary_arm_next_edge(&config->phase_a);
}

static void rotary_button_work(struct k_work *work)
{
	struct k_work_delayable *delayable = k_work_delayable_from_work(work);
	struct rotary_encoder_data *data =
		CONTAINER_OF(delayable, struct rotary_encoder_data, button_work);
	const struct rotary_encoder_config *config = data->dev->config;
	int pressed = gpio_pin_get_dt(&config->button);

	if (pressed >= 0 && pressed != data->button_state) {
		data->button_state = pressed;
		(void)input_report_key(data->dev, config->button_code, pressed, true,
				       K_FOREVER);
	}

	(void)rotary_arm_next_edge(&config->button);
}

static void rotary_button_isr(const struct device *port, struct gpio_callback *cb,
			      gpio_port_pins_t pins)
{
	struct rotary_encoder_data *data =
		CONTAINER_OF(cb, struct rotary_encoder_data, button_cb);
	const struct rotary_encoder_config *config = data->dev->config;

	ARG_UNUSED(port); ARG_UNUSED(pins);

	(void)gpio_pin_interrupt_configure_dt(&config->button, GPIO_INT_DISABLE);
	(void)k_work_reschedule(&data->button_work,
				K_USEC(config->debounce_interval_us));
}
```

- **绕开双边沿硬件限制**：当前 HPM GPIO 适配层不支持 `GPIO_INT_EDGE_BOTH`，因此关闭 `polling-mode;` 后，驱动每次读当前电平，动态把下一次中断配成“相反逻辑边沿”（高电平期间布防下跳、低电平期间布防上跳），从而实现等效双边沿响应；
- **按键先关中断后延迟消抖**：按键按下瞬间的机械弹跳可能在几十微秒内连发多次中断，ISR 先调用 `GPIO_INT_DISABLE` 屏蔽该脚中断并丢进 `k_work_delayable`，等 `20 ms` 消抖期满在线程上下文确认真实稳定电平后再 `input_report_key()` 并重新开启反相沿中断。

### 3. 应用层 Input 回调与信号量异步刷屏（`applications/rotary_encoder_demo/src/main.c`）

```c
static K_SEM_DEFINE(ui_sem, 0, 1);
static volatile int32_t g_position;
static volatile int8_t g_last_dir;
static volatile bool g_pressed;

static void encoder_input_cb(struct input_event *evt)
{
	if (evt->type == INPUT_EV_REL && evt->code == INPUT_REL_DIAL && evt->value != 0) {
		int32_t next_pos = g_position + evt->value;

		g_position = next_pos;
		g_last_dir = (evt->value > 0) ? 1 : -1;
		printk("rotate: delta=%+ld position=%ld direction=%s\n",
		       (long)evt->value, (long)next_pos,
		       evt->value > 0 ? "CW" : "CCW");
		k_sem_give(&ui_sem);
		return;
	}

	if (evt->type == INPUT_EV_KEY && evt->code == INPUT_KEY_0) {
		g_pressed = (evt->value != 0);
		printk("button: %s\n", evt->value ? "PRESSED" : "RELEASED");
		k_sem_give(&ui_sem);
	}
}

INPUT_CALLBACK_DEFINE(DEVICE_DT_GET(ENCODER_NODE), encoder_input_cb);
```

`main()` 主循环不再无脑定时刷屏，而是通过信号量合并快速连续旋转的多帧事件：

```c
	while (true) {
		int sem_ret = k_sem_take(&ui_sem, K_MSEC(200));
		uint32_t now_ms = k_uptime_get_32();
		bool refresh = (sem_ret == 0);

		if ((now_ms - last_led_ms) >= 500U) {
			last_led_ms = now_ms;
			(void)gpio_pin_toggle_dt(&led);
			tick++;
			refresh = true;
		}

		if (refresh) {
			render_encoder_oled(g_position, g_last_dir, g_pressed, tick);
		}
	}
```

- **为什么不能在 `encoder_input_cb()` 里直接调用 OLED 刷屏**：I2C 刷新整帧 `1024 B` 大约需要 `25 ms`，若直接在 `input` 回调里刷屏，快速甩拧旋钮时会阻塞系统唯一的 `input` 派发线程导致后续脉冲积压甚至丢包；改用上限为 `1` 的二值信号量 `ui_sem` 唤醒主线程，即使在刷屏 25 ms 期间拧过 3 格，信号量也只置位一次，主线程紧接着就能一把渲染最新的最终计数值 `g_position`，配合 `oled_ui_center_bar()` 完成 `±20` 格双向指针显示。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\rotary_encoder_demo -d build\rotary_encoder_demo
```

:::info[编译链接看到 `LOAD segment with RWX permissions` 告警属正常现象]
构建期间链接器会对 `zephyr_pre0.elf` 与 `zephyr.elf` 各打印一条 `LOAD segment with RWX permissions` 警告。这是由于启用了 `CONFIG_INPUT`，Zephyr 将 input 静态线程的数据段与代码段合并到同一可读写执行段所致，**属于上游已知预期告警，不影响任何运行功能**。
:::

## 烧录步骤与串口验证（`west flash`）

确认旋转编码器插在底板 **M13**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\rotary_encoder_demo
```

烧录校验完成后，打开串口（`115200 8-N-1`）转动和按下旋钮确认事件输出：

```text
rotary encoder demo: Zephyr input driver
SDRAM quick check PASSED (32 MiB)
Input ready: turn the knob or press it; LED is the firmware heartbeat.
rotate: delta=+1 position=1 direction=CW
button: PRESSED
```

---

[上一课：光敏电阻亮度采集开发](../p2-19-光敏电阻亮度采集开发/README.md) · [下一课：红外对管避障检测开发](../p2-21-红外对管避障检测开发/README.md) · [课程目录](../README.md)
