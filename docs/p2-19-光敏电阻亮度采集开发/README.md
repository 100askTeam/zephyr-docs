---
title: 第 19 课：光敏电阻亮度采集开发
---

# 第 19 课：光敏电阻亮度采集开发

本课解析 `light_sensor_demo` 的源码工程。示例同时使用片上 16 位高精度 `ADC0`（读取光敏电阻 `AO` 模拟电压）与 `GPIO` 输入（读取模块电位器比较输出 `DO`），重点展示 `/zephyr,user` 设备树节点与 HPM ADC16 时钟源配置要点（快速体验见 [一期第 8 课：光敏电阻亮度采集](../p1-08-光敏电阻亮度采集/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/light_sensor_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 CONFIG_GPIO / ADC / SSD1306 / DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # zephyr,user、adc0 (PF07) + i2c1 ssd1306@3c
│  └─ src/main.c                       # adc_read_dt() + GPIO 读取 + M1 OLED 联动
├─ platform/drivers/display/oled_ui.c  # 共享 128x64 仪表盘 UI
└─ sdk_glue/drivers/adc/adc_hpmicro_adc16.c  # HPMicro ADC16 Zephyr 适配驱动
```

## 配置与设备树解析

### 1. `prj.conf` 与设备树

`applications/light_sensor_demo/prj.conf` 开启 `CONFIG_ADC=y`，并配置 `CONFIG_I2C=y`、`CONFIG_DISPLAY=y`、`CONFIG_SSD1306=y`、`CONFIG_DSHAN_OLED_UI=y` 与 `CONFIG_MAIN_STACK_SIZE=4096`。

`applications/light_sensor_demo/boards/dshanmcu_hpm6e70.overlay` 中有三个关键设计：

```dts
/ {
	zephyr,user {
		io-channels = <&adc0 15>;
		light-do-gpios = <&gpiob 2 GPIO_ACTIVE_HIGH>;
	};
};

&adc0 {
	status = "okay";
	clocks = <&clk CLOCK_ADC0 CLK_ADC_SRC_AHB0 1>,
		 <&clk CLOCK_ANA0 CLK_SRC_PLL1_CLK0 4>;
	pinctrl-0 = <&light_ao_pins>;
	pinctrl-names = "default";
	#address-cells = <1>;
	#size-cells = <0>;

	channel@f {
		reg = <15>;
		zephyr,gain = "ADC_GAIN_1";
		zephyr,reference = "ADC_REF_EXTERNAL0";
		zephyr,acquisition-time = <ADC_ACQ_TIME_DEFAULT>;
		zephyr,vref-mv = <3300>;
		zephyr,resolution = <16>;
	};
};
```

- **必须显式配置 `clocks` 选 `CLK_ADC_SRC_AHB0`**：板级默认 SoC dtsi 对 ADC0 默认选 `ANA0`，若未切回 `AHB0`，HPM ADC16 驱动初始化首次访问寄存器时会卡死；这里覆盖为 `AHB0` 后即可稳定启动；
- **模拟模式引脚 `PF07`**：在 `&pinctrl` 中必须使用 `HPMICRO_PINMUX(HPMICRO_PIN(HPMICRO_PORTF, 7), IOC_TYPE_IOC, 1, 0)`（第 3 参数 `is_analog = 1` 打开模拟通路）；
- **统一由 `/zephyr,user` 声明连接**：应用通过 `io-channels` 和 `light-do-gpios` 取硬件描述，不在 C 代码里硬编码通道号和引脚。

## 源码解析（`src/main.c`）

### 1. 编译期设备树属性校验与双接口初始化（`light_sensor_init`）

```c
#define LIGHT_SENSOR_NODE DT_PATH(zephyr_user)

#if !DT_NODE_HAS_PROP(LIGHT_SENSOR_NODE, io_channels) || \
	!DT_NODE_HAS_PROP(LIGHT_SENSOR_NODE, light_do_gpios)
#error "light sensor ADC/GPIO description is missing from the board overlay"
#endif

static const struct adc_dt_spec light_ao =
	ADC_DT_SPEC_GET_BY_IDX(LIGHT_SENSOR_NODE, 0);
static const struct gpio_dt_spec light_do =
	GPIO_DT_SPEC_GET(LIGHT_SENSOR_NODE, light_do_gpios);

static int light_sensor_init(void)
{
	int ret;

	if (!adc_is_ready_dt(&light_ao)) {
		printk("ERROR: ADC controller is not ready: %s\n", light_ao.dev->name);
		return -ENODEV;
	}

	ret = adc_channel_setup_dt(&light_ao);
	if (ret != 0) {
		printk("ERROR: adc channel setup failed: %d\n", ret);
		return ret;
	}
	if (!gpio_is_ready_dt(&light_do)) {
		return -ENODEV;
	}
	return gpio_pin_configure_dt(&light_do, GPIO_INPUT);
}
```

- 在预编译期用 `#if !DT_NODE_HAS_PROP(...) #error` 断言检查 `/zephyr,user` 属性完整性；
- `ADC_DT_SPEC_GET_BY_IDX(DT_PATH(zephyr_user), 0)` 不仅拿到了 `&adc0` 设备和通道号 `15`，还自动提取了 `channel@f` 子节点中声明的 `resolution = 16`、`vref_mv = 3300` 与 `gain`；调用 `adc_channel_setup_dt(&light_ao)` 即可把这些参数下发给底层 HPM ADC16 驱动。

### 2. `adc_sequence` 采样序列与毫伏换算（`main` 循环）

```c
	uint16_t sample = 0;
	struct adc_sequence sequence = {
		.buffer = &sample,
		.buffer_size = sizeof(sample),
	};

	ret = adc_sequence_init_dt(&light_ao, &sequence);
	/* ... */

	while (true) {
		/* ... LED toggle ... */
		ret = adc_read_dt(&light_ao, &sequence);
		if (ret != 0) {
			goto sleep;
		}

		int32_t mv = sample;
		int do_level = gpio_pin_get_dt(&light_do);
		ret = adc_raw_to_millivolts_dt(&light_ao, &mv);
		if (ret != 0 || do_level < 0) {
			goto sleep;
		}

		printk("light: raw=%5u (%ld mV) DO=%d\n",
		       sample, (long)mv, do_level);
		render_light_oled(sample, mv, do_level, tick);
sleep:
		tick++;
		k_sleep(K_MSEC(500));
	}
```

- **注意接收缓冲区类型匹配**：16 位无符号单端采样的原始值范围是 `0..65535`，`sample` 必须定义为 `uint16_t`（2 字节）才能避免被 `adc_read_dt()` 截断或踩坏相邻栈变量；而 `adc_raw_to_millivolts_dt(&light_ao, &mv)` 原地修改的参数类型是 `int32_t *`，因此需先拷贝到有符号 32 位 `mv` 再参与换算（避免 65535 × 3300 mV 超过 16 位及有符号边界）。

### 3. 电压读数、`DO` 阈值状态与满量程光强条渲染（`render_light_oled`）

```c
static void render_light_oled(uint16_t raw, int32_t mv, int do_level, uint32_t tick)
{
	if (!oled_ui_is_ready()) {
		return;
	}

	char vbuf[16];
	char rbuf[20];
	int permille = (mv <= 0) ? 0 : (mv >= 3300 ? 1000 : (int)((mv * 1000L) / 3300L));

	snprintf(vbuf, sizeof(vbuf), "%ld mV", (long)mv);
	snprintf(rbuf, sizeof(rbuf), "RAW:%u", (unsigned)raw);

	oled_ui_clear();
	oled_ui_header("M7", do_level ? "LIGHT [DO:1]" : "LIGHT [DO:0]", tick);

	oled_ui_card(0, 17, 128, 47);
	oled_ui_big_text_center(20, vbuf);
	oled_ui_text(6, 39, rbuf, false);
	oled_ui_text_right(122, 39, "VREF:3.3V", false);
	oled_ui_bar(6, 50, 116, 9, permille);

	(void)oled_ui_present();
}
```

- 顶部黄区标题直接把比较器数字输出 `DO` 拼入状态文本（`"LIGHT [DO:1]"` / `"LIGHT [DO:0]"`），顺/逆时针拧动模块上的蓝色电位器就能在屏幕上直观观察 `DO` 翻转临界电压对应的 `mV` 与原始 ADC 码值 `RAW`。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\light_sensor_demo -d build\light_sensor_demo
```

## 烧录步骤与串口验证（`west flash`）

确认光敏电阻模块已插入底板 **M7**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\light_sensor_demo
```

烧录校验完成后，串口（`115200 8-N-1`）每 `500 ms` 输出原始采样、换算电压及数字状态：

```text
light sensor demo: coreboard + adc + gpio
SDRAM quick check PASSED (32 MiB)
adc: adc@f0100000 ch15, 16-bit, vref=3300 mV ready
light: raw=52122 (2624 mV) DO=1
```

---

[上一课：MPU6050 六轴姿态采集开发](../p2-18-MPU6050六轴姿态采集开发/README.md) · [下一课：旋转编码器与按键开发](../p2-20-旋转编码器与按键开发/README.md) · [课程目录](../README.md)
