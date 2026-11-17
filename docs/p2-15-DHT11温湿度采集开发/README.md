---
title: 第 15 课：DHT11 温湿度采集开发
---

# 第 15 课：DHT11 温湿度采集开发

本课解析 `dht11_demo` 的源码工程。示例直接复用 Zephyr 内置的 `aosong,dht` 驱动与标准 Sensor API，重点演示单总线（`PC06`）起始脉冲极性配置与中断保护开关（快速体验见 [一期第 4 课：DHT11 温湿度采集](../p1-04-DHT11温湿度采集/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/dht11_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 DHT / I2C / SSD1306 / DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # aosong,dht (PC06) + i2c1 ssd1306@3c
│  └─ src/main.c                       # 每 2 秒采集温湿度并联动刷新 M1 OLED 双卡片
├─ platform/drivers/display/oled_ui.c  # 共享 128x64 仪表盘 UI（未插屏自动降级）
└─ zephyr/drivers/sensor/aosong/dht/
   ├─ dht.h
   └─ dht.c                            # Zephyr 内置 DHT11/DHT22 驱动
```

## 配置与设备树解析

### 1. `prj.conf` 关键配置

```ini
CONFIG_SENSOR=y
CONFIG_DHT=y
CONFIG_DHT_LOCK_IRQS=y

# M1 OLED 联动显示（未插屏时平滑降级为仅串口输出）
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
```

- `CONFIG_DHT_LOCK_IRQS=y` 非常关键：DHT11 使用约几十微秒级别的脉冲宽度区分 `0` / `1`，开启采样时锁中断可防止其它中断抢占导致位宽测量偏差、频繁报错 `-5`（`-EIO`）。

### 2. `boards/dshanmcu_hpm6e70.overlay` 设备树

```dts
/ {
	chosen {
		zephyr,display = &ssd1306;
	};

	dht11: dht11 {
		compatible = "aosong,dht";
		status = "okay";
		dio-gpios = <&gpioc 6 GPIO_ACTIVE_LOW>;
	};
};

&i2c1 {
	status = "okay";
	pinctrl-0 = <&pinmux_i2c1>;
	pinctrl-names = "default";

	ssd1306: ssd1306@3c {
		compatible = "solomon,ssd1306fb";
		reg = <0x3c>;
		width = <128>;
		height = <64>;
		/* 其余 SSD1306 扫描与偏移参数同 oled_demo */
	};
};
```

- **为什么必须是 `GPIO_ACTIVE_LOW`**：阅读 `zephyr/drivers/sensor/aosong/dht/dht.c` 可见，驱动启动采样时先调用 `gpio_pin_set_dt(..., 1)` 发送“拉低 18 ms”的起始信号。只有配置 `GPIO_ACTIVE_LOW`，逻辑 `1` 才会真正把物理引脚拉低；若误填 `GPIO_ACTIVE_HIGH`，驱动波形完全反相，读取必然失败。
- `PC06` 的输入缓冲区使能与上拉已在板级 `pinmux_gpioc` 中开启；如更换为 **DHT22 / AM2302**，只需在 `dht11` 节点下追加一行 `dht22;` 属性后加 `-p always` 重建即可。

## 源码解析（`src/main.c`）

### 1. 外设初始化顺序与首屏提示（`oled_ui_init` + `sensor_init`）

```c
#define DHT11_NODE        DT_NODELABEL(dht11)
#define SAMPLE_INTERVAL_S 2

static const struct device *sensor_init(void)
{
	const struct device *dev = DEVICE_DT_GET(DHT11_NODE);

	if (!device_is_ready(dev)) {
		printk("ERROR: dht11 device not ready: %s\n", dev->name);
		return NULL;
	}
	printk("sensor: %s ready\n", dev->name);
	return dev;
}

static void render_dht11_boot(void)
{
	if (!oled_ui_is_ready()) {
		return;
	}
	oled_ui_clear();
	oled_ui_header("M10", "DHT11 ENV", 0U);
	oled_ui_card(0, 17, 128, 47);
	oled_ui_text_center(29, "Sampling DHT11...", false);
	oled_ui_text_center(43, "Wait 2s (PC06)", false);
	(void)oled_ui_present();
}
```

- 在 `main()` 中，完成核心板自检后先调用 `(void)oled_ui_init()` 忽略返回值（未插 M1 屏时继续串口输出），接着立刻画一张 `"Sampling DHT11..."` 启动过渡屏，避免在上电等待 DHT11 第一次采样周期期间出现整块黑屏。

### 2. 标准 Sensor 三步读取与底层单总线锁中断原理

```c
	while (true) {
		struct sensor_value humidity;
		struct sensor_value temp;

		led_state = !led_state;
		(void)gpio_pin_set_dt(&led, led_state);

		/* 标准三步: fetch 采样 -> channel_get 取值 -> 打印与刷新 OLED */
		ret = sensor_sample_fetch(sensor);
		if (ret != 0) {
			printk("read failed: %d (module not plugged or bus timing error)\n", ret);
			render_dht11_oled(false, NULL, NULL, tick);
			goto sleep;
		}

		(void)sensor_channel_get(sensor, SENSOR_CHAN_HUMIDITY, &humidity);
		(void)sensor_channel_get(sensor, SENSOR_CHAN_AMBIENT_TEMP, &temp);

		printk("temp: %d.%06d C, RH: %d.%06d %%\n",
		       temp.val1, temp.val2, humidity.val1, humidity.val2);
		render_dht11_oled(true, &temp, &humidity, tick);

sleep:
		tick++;
		k_sleep(K_SECONDS(SAMPLE_INTERVAL_S));
	}
```

- **Zephyr 内置 `dht.c` 的一次 `sensor_sample_fetch()` 内部流程**：
  1. 主机通过 `gpio_pin_set_dt(..., 1)`（配合 `GPIO_ACTIVE_LOW` 物理拉低）保持 `18 ms` 起始脉冲并切换回输入态；
  2. 打开 `CONFIG_DHT_LOCK_IRQS=y` 后调用 `irq_lock()` 关闭全局中断，再依次测量传感器回传的 80 µs 应答与后续 40 bit 脉宽（26～28 µs 高电平表示 `0`，70 µs 高电平表示 `1`），全部收完后立刻 `irq_unlock()` 并校验第 5 字节累加和；
  3. 取值时应用通过 `struct sensor_value` 获取解析结果（`val1` 为整数部分、`val2` 为百万分之一 `10^-6` 小数部分），周期 `SAMPLE_INTERVAL_S = 2` 确保两次采样间距大于 DHT11 手册要求的 1 秒冷却期。

### 3. 左右双卡片布局与千分比进度条换算（`render_dht11_oled`）

```c
static void render_dht11_oled(bool ok, const struct sensor_value *temp,
			      const struct sensor_value *humidity, uint32_t tick)
{
	if (!oled_ui_is_ready()) {
		return;
	}

	oled_ui_clear();
	oled_ui_header("M10", "DHT11 ENV", tick);

	if (!ok) {
		oled_ui_card(0, 17, 128, 47);
		(void)oled_ui_badge(28, 22, "READ FAILED");
		oled_ui_text_center(38, "Check M10 socket", false);
		oled_ui_text_center(50, "Unplug M2 DS18B20", false);
		(void)oled_ui_present();
		return;
	}

	char tbuf[12], hbuf[12];
	int32_t t_dec = (temp->val2 >= 0 ? temp->val2 : -temp->val2) / 100000;
	int32_t h_dec = (humidity->val2 >= 0 ? humidity->val2 : -humidity->val2) / 100000;
	int32_t t_abs = temp->val1 < 0 ? -temp->val1 : temp->val1;

	snprintf(tbuf, sizeof(tbuf), "%s%d.%d", temp->val1 < 0 ? "-" : "", (int)t_abs, (int)t_dec);
	snprintf(hbuf, sizeof(hbuf), "%d.%d", (int)humidity->val1, (int)h_dec);

	int tw = (int)strlen(tbuf) * 12 - 2;
	int hw = (int)strlen(hbuf) * 12 - 2;
	int tx = (62 > tw) ? (62 - tw) / 2 : 2;
	int hx = 66 + ((62 > hw) ? (62 - hw) / 2 : 2);

	/* 左卡（x=0, w=62）：温度 0..50 C -> 进度条 0..1000 permille */
	oled_ui_card(0, 17, 62, 47);
	oled_ui_text(4, 20, "TEMP", false);
	oled_ui_degree(46, 20);
	oled_ui_text(52, 20, "C", false);
	oled_ui_big_text(tx, 31, tbuf);
	oled_ui_bar(4, 52, 54, 7, clamp_int((int)(temp->val1 * 20), 0, 1000));

	/* 右卡（x=66, w=62）：湿度 0..100 %RH -> 进度条 0..1000 permille */
	oled_ui_card(66, 17, 62, 47);
	oled_ui_text(70, 20, "HUMI", false);
	oled_ui_text_right(124, 20, "%RH", false);
	oled_ui_big_text(hx, 31, hbuf);
	oled_ui_bar(70, 52, 54, 7, clamp_int((int)(humidity->val1 * 10), 0, 1000));

	(void)oled_ui_present();
}
```

- `val2 / 100000` 只保留 1 位小数以便在 62 px 宽的小卡里用 `12×16` 大字号自适应居中（`tx` / `hx`）；一旦与 `M2`（DS18B20）同时插着导致 `PC06` 总线拉死，立刻切出 `"READ FAILED"` + `"Unplug M2 DS18B20"` 提示卡。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\dht11_demo -d build\dht11_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 DHT11 插在 **M10**、**M2（DS18B20）已拔除**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\dht11_demo
```

烧录校验完成后，在串口终端（`115200 8-N-1`）查看输出：

```text
DHT11 demo: coreboard + temp/humidity sensor
SDRAM quick check PASSED (32 MiB)
sensor: dht11 ready
Init complete. LED blinking, sampling every 2 s.
temp: 28.000000 C, RH: 65.000000 %
```

---

[上一课：有源/无源蜂鸣器开发](../p2-14-有源无源蜂鸣器开发/README.md) · [下一课：DS18B20 单总线测温开发](../p2-16-DS18B20单总线测温开发/README.md) · [课程目录](../README.md)
