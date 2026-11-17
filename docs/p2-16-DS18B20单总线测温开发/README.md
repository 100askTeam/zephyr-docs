---
title: 第 16 课：DS18B20 单总线测温开发
---

# 第 16 课：DS18B20 单总线测温开发

本课解析 `ds18b20_demo` 的源码实现。Zephyr 将 1-Wire（`w1`）拆分为“**1-Wire 总线控制器驱动 + DS18B20 从设备传感器驱动**”两层模型，应用只需面向标准 `<zephyr/drivers/sensor.h>` 读取温度，并通过 `k_work_delayable` 维持独立心跳灯（快速体验见 [一期第 5 课：DS18B20 单总线测温](../p1-05-DS18B20单总线测温/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/ds18b20_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 W1、DS18B20 与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # w1-gpio (PC06) + i2c1 ssd1306@3c
│  └─ src/main.c                       # delayable work 心跳 + 测温 + OLED 温度条
├─ platform/drivers/display/oled_ui.c  # 共享 128x64 仪表盘 UI
└─ zephyr/drivers/
   ├─ w1/w1_zephyr_gpio.c              # Zephyr GPIO 位模拟 1-Wire 主机驱动
   └─ sensor/maxim/ds18b20/ds18b20.c   # Zephyr DS18B20 温度传感器驱动
```

## 配置与设备树解析

### 1. `prj.conf` 关键配置

```ini
CONFIG_W1=y
CONFIG_W1_ZEPHYR_GPIO=y
CONFIG_W1_ZEPHYR_GPIO_TIME_CRITICAL=y
CONFIG_SENSOR=y
CONFIG_DS18B20=y

CONFIG_LOG=y
CONFIG_W1_LOG_LEVEL_INF=y
CONFIG_SENSOR_LOG_LEVEL_INF=y

# M1 OLED 联动显示
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
```

- `CONFIG_W1_ZEPHYR_GPIO_TIME_CRITICAL=y`：在关键的 1-Wire 复位/读写微秒时隙内关闭中断，避免时序漂移引发 CRC 失败；
- 同时启用了 `LOG` 模块信息级日志，便于在总线无应答或 CRC 校验错误时定位具体阶段；overlay 中同时声明 `chosen { zephyr,display = &ssd1306; };` 与 `&i2c1` 挂载 `ssd1306@3c`（与 `PC06` 无复用关系）。

### 2. `boards/dshanmcu_hpm6e70.overlay` 设备树

```dts
/ {
	w1_0: w1 {
		compatible = "zephyr,w1-gpio";
		status = "okay";
		#address-cells = <1>;
		#size-cells = <0>;

		gpios = <&gpioc 6 (GPIO_ACTIVE_HIGH | GPIO_OPEN_DRAIN | GPIO_PULL_UP)>;

		ds18b20: temperature-sensor {
			compatible = "maxim,ds18b20";
			status = "okay";
			family-code = <0x28>;
			resolution = <12>;
		};
	};
};
```

- 总线节点 `zephyr,w1-gpio` 声明使用 `PC06` 且要求 `GPIO_ACTIVE_HIGH | GPIO_OPEN_DRAIN | GPIO_PULL_UP`（空闲拉高、读写拉低开漏线与）；
- 子节点 `ds18b20` 指定家族码 `0x28` 与 `12` 位转换分辨率（最小步进 `0.0625 ℃`，每次转换约 `750 ms`；若改为 `9` 位可加速采样但分辨率降为 `0.5 ℃`）。

## 源码解析（`src/main.c`）

### 1. Zephyr 两层 1-Wire 驱动协作过程

虽然应用代码 `applications/ds18b20_demo/src/main.c` 同样只调用 `sensor_sample_fetch(temperature_sensor)` 与 `sensor_channel_get(..., SENSOR_CHAN_AMBIENT_TEMP, &temperature)`，但背后分成两层完成工作：
1. **上层从设备驱动（`zephyr/drivers/sensor/maxim/ds18b20/ds18b20.c`）**：负责发送 DS18B20 协议指令——先写 Skip ROM（`0xCC`）+ Start Conversion（`0x44`），然后按当前分辨率对应的转换时间（12 位约 `750 ms`）调用 **`k_sleep()` 主动让出 CPU**，醒来后再发 Read Scratchpad（`0xBE`）读回 9 字节暂存器并做 CRC8 校验；
2. **底层主机控制器（`zephyr/drivers/w1/w1_zephyr_gpio.c`）**：把每一个 1-Wire 复位脉冲、写 0/写 1/读时隙转换成对 `PC06` 开漏引脚的微秒级切换（并在开启 `CONFIG_W1_ZEPHYR_GPIO_TIME_CRITICAL=y` 时临时关中断保时序精度）。

### 2. 利用延迟工作项解耦长耗时采样与心跳灯（`k_work_delayable`）

因为 12 位测温转换会阻塞主线程约 `750 ms`（加上 `k_sleep(K_SECONDS(2))` 总计 ~2.75 s 周期），如果在 `while (true)` 里直接翻转 LED，心跳灯就会忽快忽慢甚至出错卡住。本例改由内核系统工作队列独立调度 `heartbeat_work`：

```c
static void heartbeat_handler(struct k_work *work);
K_WORK_DELAYABLE_DEFINE(heartbeat_work, heartbeat_handler);

static void heartbeat_handler(struct k_work *work)
{
	ARG_UNUSED(work);
	(void)gpio_pin_toggle_dt(&led);
	(void)k_work_reschedule(&heartbeat_work, K_MSEC(500));
}

static int coreboard_init(void)
{
	/* ... SDRAM check & LED configure ... */
	(void)k_work_reschedule(&heartbeat_work, K_MSEC(500));
	return 0;
}
```

- 在 `ds18b20.c` 执行 `750 ms` 睡眠等待温度转换、以及 `main()` 休眠 `2 s` 期间，系统工作队列线程（`sysworkq`）每隔精准的 `500 ms` 仍会按时唤醒执行一次 `heartbeat_handler()`，保持心跳灯完全不受传感器耗时波动影响。

### 3. 定点毫摄氏度换算、负温防坑与 OLED 渲染

```c
static void print_temperature(const struct sensor_value *temperature)
{
	int32_t milli_c = (int32_t)sensor_value_to_milli(temperature);
	int32_t magnitude = milli_c < 0 ? -milli_c : milli_c;

	printk("temperature: %s%d.%03d C\n",
	       milli_c < 0 ? "-" : "", magnitude / 1000, magnitude % 1000);
}

static void render_ds18b20_oled(bool ok, int32_t milli_c, uint32_t tick)
{
	if (!oled_ui_is_ready()) {
		return;
	}

	oled_ui_clear();
	oled_ui_header("M2", "DS18B20", tick);
	oled_ui_card(0, 17, 128, 47);

	if (!ok) {
		(void)oled_ui_badge(35, 22, "NO SENSOR");
		oled_ui_text_center(38, "Check M2 socket", false);
		oled_ui_text_center(50, "Unplug M10 DHT11", false);
		(void)oled_ui_present();
		return;
	}

	char val_buf[16];
	char fine_buf[24];
	int32_t mag = milli_c < 0 ? -milli_c : milli_c;

	snprintf(val_buf, sizeof(val_buf), "%s%d.%02d",
		 milli_c < 0 ? "-" : "", (int)(mag / 1000), (int)((mag % 1000) / 10));
	snprintf(fine_buf, sizeof(fine_buf), "12-bit: %s%d.%03d C",
		 milli_c < 0 ? "-" : "", (int)(mag / 1000), (int)(mag % 1000));

	int len = (int)strlen(val_buf);
	int total_w = len * 12 + 17; /* 数值宽度 + degree(6) + 'C'(11) */
	int sx = (OLED_UI_WIDTH > total_w) ? (OLED_UI_WIDTH - total_w) / 2 : 2;

	oled_ui_big_text(sx, 20, val_buf);
	oled_ui_degree(sx + len * 12 + 1, 20);
	oled_ui_big_text(sx + len * 12 + 7, 20, "C");
	oled_ui_text_center(39, fine_buf, false);

	/* 0..50 C 进度条映射 */
	int permille = (milli_c <= 0) ? 0 : (milli_c >= 50000 ? 1000 : (int)(milli_c / 50));
	oled_ui_bar(8, 51, 112, 8, permille);

	(void)oled_ui_present();
}
```

- **规避零下小数 `-0.xxx ℃` 打印大坑**：在 Zephyr 中，`-0.5 ℃` 表示为 `val1 = 0, val2 = -500000`。若像普通正数那样直接写 `printk("%d.%06d", val1, val2)`，就会错印成 `0.-500000` 或丢掉负号；先用官方 `sensor_value_to_milli()` 合并成带符号整毫度，再独立提取符号和绝对值 `mag`，串口和 OLED 大字号显示在零下区间都能保证绝对正确；
- **高精度双显示**：蓝区顶部用 `oled_ui_degree()` 拼接出 `°C` 符号显示两位小数，中间展示完整三位小数的 `12-bit` 读数（12 位步进 `0.0625 ℃`），底部进度条按 `0..50 ℃`（每毫度 `1/50` 千分比）缩放。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\ds18b20_demo -d build\ds18b20_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 DS18B20 插在 **M2**、**M10（DHT11）已拔除**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\ds18b20_demo
```

烧录校验完成后，串口（`115200 8-N-1`）每 2 秒打印实时摄氏温度：

```text
DS18B20 demo: Zephyr 1-Wire and sensor API
SDRAM quick check PASSED (32 MiB)
sensor: temperature-sensor ready, 12-bit conversion every 2 s
temperature: 25.062 C
```

---

[上一课：DHT11 温湿度采集开发](../p2-15-DHT11温湿度采集开发/README.md) · [下一课：HC-SR04 超声波测距开发](../p2-17-HC-SR04超声波测距开发/README.md) · [课程目录](../README.md)
