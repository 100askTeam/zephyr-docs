---
title: 第 17 课：HC-SR04 超声波测距开发
---

# 第 17 课：HC-SR04 超声波测距开发

本课对应工程第一个自研 Sensor 驱动示范 `hc_sr04_demo`。在 [第 4～10 课](../p2-04-认识Zephyr驱动结构/README.md) 中我们从零逐步拆解了该驱动的 Binding、Kconfig 与驱动编码；本节把应用工程与底层的源码位置、构建烧录步骤集中整理供开发对照（快速体验见 [一期第 6 课：HC-SR04 超声波测距](../p1-06-HC-SR04超声波测距/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/hc_sr04_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 SENSOR / DSHAN_HC_SR04 / DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # hc-sr04 (PB05/PE01) + i2c1 ssd1306@3c
│  └─ src/main.c                       # 每 500 ms 测距并联动刷新 OLED 声纳进度条
└─ platform/
   ├─ dts/bindings/sensor/dshan,hc-sr04.yaml
   ├─ drivers/display/oled_ui.c        # 共享 128x64 仪表盘 UI
   └─ drivers/sensor/hc_sr04/
      ├─ Kconfig                       # 定义 DSHAN_HC_SR04
      ├─ CMakeLists.txt
      └─ hc_sr04.c                     # 触发测距脉冲并计算距离（米/微米）
```

## 配置与设备树解析

### 1. `prj.conf` 与 Kconfig

```ini
CONFIG_SENSOR=y
CONFIG_DSHAN_HC_SR04=y
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
```

`platform/drivers/sensor/hc_sr04/Kconfig` 依赖 `DT_HAS_DSHAN_HC_SR04_ENABLED`，当应用 overlay 使能了 `compatible = "dshan,hc-sr04"` 节点时，该驱动会自动编入固件；overlay 同步挂上 `i2c1` `ssd1306@3c` 与 `chosen { zephyr,display = &ssd1306; };` 供主程序每 `500 ms` 刷新厘米距离与 `0～100 cm` 声纳条。

### 2. `boards/dshanmcu_hpm6e70.overlay` 设备树

```dts
/ {
	hc_sr04_sensor: hc-sr04 {
		compatible = "dshan,hc-sr04";
		status = "okay";
		trig-gpios = <&gpiob 5 GPIO_ACTIVE_HIGH>;
		echo-gpios = <&gpioe 1 GPIO_ACTIVE_HIGH>;
	};
};

&pinctrl {
	hc_sr04_pins: hc_sr04_pins {
		group0 {
			pinmux = <HPMICRO_PINMUX(HPMICRO_PIN(HPMICRO_PORTB, 5), IOC_TYPE_IOC, 0, 0)>,
				 <HPMICRO_PINMUX(HPMICRO_PIN(HPMICRO_PORTE, 1), IOC_TYPE_IOC, 0, 0)>;
		};
	};
};
```

并分别绑定到 `&gpiob` 与 `&gpioe` 的 `pinctrl-0`。注意板级 DTS 已经给 `&gpiob`/`&gpioe` 配置为默认 GPIO，这里通过显式 `hc_sr04_pins` 将 `PB05`/`PE01` 配为普通 IO 功能。

## 源码解析

### 1. 自研驱动核心采样与防溢出换算（`platform/drivers/sensor/hc_sr04/hc_sr04.c`）

```c
#define HC_SR04_ECHO_TIMEOUT_US 30000U
#define HC_SR04_WAIT_TIMEOUT_US 30000U

static int hc_sr04_sample_fetch(const struct device *dev,
				enum sensor_channel chan)
{
	const struct hc_sr04_config *cfg = dev->config;
	struct hc_sr04_data *data = dev->data;
	uint32_t wait_us = 0;
	uint32_t echo_us = 0;

	if (chan != SENSOR_CHAN_ALL && chan != SENSOR_CHAN_DISTANCE) {
		return -ENOTSUP;
	}

	/* 1. TRIG 输出 >=10us 高电平（取 20us 留足余量） */
	gpio_pin_set_dt(&cfg->trig, 1);
	k_busy_wait(20);
	gpio_pin_set_dt(&cfg->trig, 0);

	/* 2. 等待 ECHO 拉高，超时说明无回波或未插模块 -> -EAGAIN */
	while (gpio_pin_get_dt(&cfg->echo) == 0) {
		if (++wait_us > HC_SR04_WAIT_TIMEOUT_US) {
			return -EAGAIN;
		}
		k_busy_wait(1);
	}

	/* 3. 测量 ECHO 高电平脉宽，若一直卡高电平说明异常 -> -EIO */
	while (gpio_pin_get_dt(&cfg->echo) == 1) {
		if (++echo_us > HC_SR04_ECHO_TIMEOUT_US) {
			return -EIO;
		}
		k_busy_wait(1);
	}

	data->echo_us = echo_us;
	return 0;
}

static int hc_sr04_channel_get(const struct device *dev,
			       enum sensor_channel chan,
			       struct sensor_value *val)
{
	struct hc_sr04_data *data = dev->data;

	if (chan != SENSOR_CHAN_DISTANCE) {
		return -ENOTSUP;
	}

	/* 声速 343 m/s = 343 um/us，往返距离除以 2 */
	uint64_t distance_um = (uint64_t)data->echo_us * 343ULL / 2ULL;

	val->val1 = (int32_t)(distance_um / 1000000ULL);
	val->val2 = (int32_t)(distance_um % 1000000ULL);
	return 0;
}
```

- **两类超时错误码区分**：等待回波上升沿超时说明目标太远/角度偏斜/模块未接，返回可恢复的 `-EAGAIN`；等待回波下降沿超时意味着 `PE01` 一直被拉高卡死（例如硬件故障），返回 `-EIO` 便于上层精准排查；
- **64 位防溢出整数运算**：先在 `sample_fetch()` 只记录原始微秒 `data->echo_us` 减小测量开销，把耗时计算推迟到 `channel_get()`，用 `(uint64_t)` 按声速 `343 um/us` 折算为微米再拆分米（`val1`）与微米余数（`val2`）。

### 2. 应用层错误码区分与 `0.01 cm` 定点换算（`applications/hc_sr04_demo/src/main.c`）

```c
	while (true) {
		struct sensor_value distance;

		led_state = !led_state;
		(void)gpio_pin_set_dt(&led, led_state);

		ret = sensor_sample_fetch(sensor);
		if (ret == -EAGAIN) {
			printk("distance: (no echo, target out of range)\n");
			render_hcsr04_oled(false, 0, tick);
			goto sleep;
		} else if (ret != 0) {
			printk("ERROR: sample fetch failed: %d\n", ret);
			render_hcsr04_oled(false, 0, tick);
			goto sleep;
		}

		ret = sensor_channel_get(sensor, SENSOR_CHAN_DISTANCE, &distance);
		if (ret != 0) {
			printk("ERROR: channel get failed: %d\n", ret);
			render_hcsr04_oled(false, 0, tick);
			goto sleep;
		}

		/* val1=米，val2=微米 -> 合并为总微米后再除以 100，得到 0.01 cm 定点数 */
		int32_t total_um = (int32_t)distance.val1 * 1000000 + distance.val2;
		int32_t cm_x100 = total_um / 100;

		printk("distance: %d.%02d cm\n", cm_x100 / 100, cm_x100 % 100);
		render_hcsr04_oled(true, cm_x100, tick);

sleep:
		tick++;
		k_sleep(K_MSEC(500));
	}
```

### 3. 声纳进度条与超量程反白徽章（`render_hcsr04_oled`）

```c
static void render_hcsr04_oled(bool ok, int32_t cm_x100, uint32_t tick)
{
	if (!oled_ui_is_ready()) {
		return;
	}

	oled_ui_clear();
	oled_ui_header("M6", "HC-SR04", tick);
	oled_ui_card(0, 17, 128, 47);

	if (!ok) {
		(void)oled_ui_badge(25, 22, "OUT OF RANGE");
		oled_ui_text_center(38, "Target 2 - 400 cm", false);
		oled_ui_bar(6, 50, 116, 9, 0);
		(void)oled_ui_present();
		return;
	}

	char dist_buf[20];
	int permille = cm_x100 / 10; /* 0..100.00 cm (cm_x100 = 0..10000) -> 0..1000 */

	if (permille < 0) {
		permille = 0;
	}
	if (permille > 1000) {
		permille = 1000;
	}

	snprintf(dist_buf, sizeof(dist_buf), "%d.%02dcm",
		 (int)(cm_x100 / 100), (int)(cm_x100 % 100));

	oled_ui_big_text_center(20, dist_buf);
	oled_ui_text(6, 39, "0cm", false);
	oled_ui_text_center(39, "SONAR", false);
	oled_ui_text_right(122, 39, "100cm", false);
	oled_ui_bar(6, 50, 116, 9, permille);

	(void)oled_ui_present();
}
```

- 进度条刻度按常用的桌面近距 `0..100 cm` 线性映射到 `0..1000` 千分比（`1 cm = 10 permille`），超出 1 米后条满格但上方大字号数值仍继续向上刷新（最高约 4 米）；
- **完整开发推导**：如需深入了解每一步如何从零编写 Binding 和驱动注册宏，回看 [第 5 课：描述模块与设备树节点](../p2-05-描述模块与设备树节点/README.md) ～ [第 9 课：从应用调用驱动](../p2-09-从应用调用驱动/README.md)。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\hc_sr04_demo -d build\hc_sr04_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M6** 已插好超声波模块（`PB05` 虽与 M12 W25Q64 片选共线，但本例未启用 `SPI5`，保留 M12 不影响测距），执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\hc_sr04_demo
```

烧录校验完成后，在串口终端（`115200 8-N-1`）确认距离实时刷新：

```text
HC-SR04 demo: coreboard + ultrasonic sensor
SDRAM quick check PASSED (32 MiB)
sensor: hc-sr04 ready
distance: 30.68 cm
```

---

[上一课：DS18B20 单总线测温开发](../p2-16-DS18B20单总线测温开发/README.md) · [下一课：MPU6050 六轴姿态采集开发](../p2-18-MPU6050六轴姿态采集开发/README.md) · [课程目录](../README.md)
