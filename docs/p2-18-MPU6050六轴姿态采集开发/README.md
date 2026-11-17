---
title: 第 18 课：MPU6050 六轴姿态采集开发
---

# 第 18 课：MPU6050 六轴姿态采集开发

本课解析 `mpu6050_demo` 的源码与配置。本示例全部 work 均在配置与设备树层面完成，**零自研驱动代码**即可复用 Zephyr 内置 `invensense,mpu6050` 驱动同时采集三轴加速度、三轴陀螺仪与片内温度（前置复用推导过程见 [第 11 课：复用 Zephyr 已有驱动](../p2-11-复用Zephyr已有驱动/README.md)，快速体验见 [一期第 7 课：MPU6050 六轴姿态采集](../p1-07-MPU6050六轴姿态采集/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/mpu6050_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 I2C、SENSOR、MPU6050 与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # 在同一条 &i2c1 下挂载 mpu6050@68 与 ssd1306@3c
│  └─ src/main.c                       # 5 Hz 采样驱动 2D 电子水平仪，1 Hz 打印串口日志
├─ platform/drivers/display/oled_ui.c  # 共享 128x64 仪表盘 UI
├─ sdk_glue/drivers/i2c/i2c_hpmicro.c  # 底层 HPM I2C1 驱动
└─ zephyr/drivers/sensor/tdk/mpu6050/  # Zephyr 内置 MPU6050 驱动
```

## 配置与设备树解析

### 1. `prj.conf` 与设备树

`applications/mpu6050_demo/prj.conf` 核心配置：

```ini
CONFIG_I2C=y
CONFIG_SENSOR=y
CONFIG_MPU6050=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
```

`applications/mpu6050_demo/boards/dshanmcu_hpm6e70.overlay` 同时利用 I2C 地址互不冲突的特性，在 `&i2c1` 下并列挂载 `mpu6050@68` 与 `ssd1306@3c`：

```dts
/ {
	chosen {
		zephyr,display = &ssd1306;
	};
};

&i2c1 {
	status = "okay";
	pinctrl-0 = <&pinmux_i2c1>;
	pinctrl-names = "default";

	mpu6050: mpu6050@68 {
		compatible = "invensense,mpu6050";
		reg = <0x68>;
		status = "okay";
	};

	ssd1306: ssd1306@3c {
		compatible = "solomon,ssd1306fb";
		reg = <0x3c>;
		width = <128>;
		height = <64>;
		/* 其余 SSD1306 参数同 oled_demo */
	};
};
```

- `oled_ui_init()` 内部已将 `&i2c1` 配为 `400 kHz` Fast 模式，供同总线上的 `MPU6050` 采样与 `SSD1306` 刷新高速共用；未插 M1 屏时仍可正常工作。

## 源码解析（`src/main.c`）

### 1. `I2C1` 双从机分时复用与六轴数据批量抓取

```c
	while (true) {
		struct sensor_value accel[3];
		struct sensor_value gyro[3];
		struct sensor_value temp;

		/* 每 5 次采样(1 秒)翻转一次 LED 并打印一次串口日志，保持串口节奏清晰 */
		if ((tick % 5U) == 0U) {
			led_state = !led_state;
			(void)gpio_pin_set_dt(&led, led_state);
		}

		ret = sensor_sample_fetch(sensor);
		if (ret != 0) {
			if ((tick % 5U) == 0U) {
				printk("ERROR: sample fetch failed: %d\n", ret);
			}
			render_mpu6050_oled(false, NULL, NULL, NULL, tick);
			goto sleep;
		}

		(void)sensor_channel_get(sensor, SENSOR_CHAN_ACCEL_XYZ, accel);
		(void)sensor_channel_get(sensor, SENSOR_CHAN_GYRO_XYZ, gyro);
		(void)sensor_channel_get(sensor, SENSOR_CHAN_DIE_TEMP, &temp);

		render_mpu6050_oled(true, accel, gyro, &temp, tick);

		if ((tick % 5U) == 0U) {
			printk("accel[m/s^2 e-3]: %d %d %d | gyro[rad/s e-3]: %d %d %d | temp[mC]: %d\n",
			       to_milli(&accel[0]), to_milli(&accel[1]), to_milli(&accel[2]),
			       to_milli(&gyro[0]), to_milli(&gyro[1]), to_milli(&gyro[2]),
			       to_milli(&temp));
		}

sleep:
		tick++;
		k_sleep(K_MSEC(200));
	}
```

- **单总线并发保护机制**：`M11 (mpu6050@68)` 与 `M1 (ssd1306@3c)` 共用 `I2C1`（`PF12/PF13`）。Zephyr I2C 子系统与 HPM 驱动内部自带传输互斥锁，`sensor_sample_fetch()` 突发性连读 MPU6050 14 字节测量寄存器释放总线后，`oled_ui_present()` 再紧接着把 `1024 B` 帧缓冲推向 OLED，两者同一线程顺序切换、无需额外手工仲裁；
- **UI 5 Hz vs 串口 1 Hz 双频节流**：200 ms 的高刷新率保证屏幕水平气泡丝滑跟手，而 `(tick % 5U) == 0U` 让串口终端每秒只打一行数据，避免高频刷屏淹没关键信息。

### 2. 64 位微单位转毫单位辅助函数（`to_milli` & `fmt_axis_milli`）

```c
static int32_t to_milli(const struct sensor_value *v)
{
	int64_t micro = (int64_t)v->val1 * 1000000 + v->val2;

	return (int32_t)(micro / 1000);
}

static void fmt_axis_milli(char *buf, size_t sz, const char *name, int32_t milli)
{
	char sign = (milli < 0) ? '-' : '+';
	int32_t mag = (milli < 0) ? -milli : milli;

	snprintf(buf, sz, "%s:%c%d.%02dm/s",
		 name, sign, (int)(mag / 1000), (int)((mag % 1000) / 10));
}
```

- Zephyr `SENSOR_CHAN_ACCEL_XYZ` 采用国际单位制 `m/s²`（板卡水平静止时重力加速度主要落在 Z 轴，`to_milli(&accel[2])` 接近 `+9815` 毫单位，即 `+9.81 m/s²`），陀螺仪 `SENSOR_CHAN_GYRO_XYZ` 采用 `rad/s`，片内温度 `SENSOR_CHAN_DIE_TEMP` 采用 `℃`。

### 3. 2D 电子水平仪坐标映射与绘制（`render_mpu6050_oled`）

```c
static void render_mpu6050_oled(bool ok, const struct sensor_value accel[3],
				const struct sensor_value gyro[3],
				const struct sensor_value *temp, uint32_t tick)
{
	/* ... 省略 !ok 故障卡片 ... */
	int32_t ax = to_milli(&accel[0]);
	int32_t ay = to_milli(&accel[1]);
	int32_t az = to_milli(&accel[2]);
	int32_t gz = to_milli(&gyro[2]);
	int32_t tc = to_milli(temp);

	/* 左侧 0..80 px：三轴加速度与温度/Z 轴角速度 */
	oled_ui_text(0, 19, l1, false);
	oled_ui_text(0, 29, l2, false);
	oled_ui_text(0, 39, l3, false);
	oled_ui_text(0, 51, l4, false);

	/* 右侧 2D 水平仪靶框 (x=82, y=18, w=44, h=44)，中心点 (104, 40) */
	oled_ui_card(82, 18, 44, 44);
	oled_ui_hline(85, 40, 4, true);
	oled_ui_hline(119, 40, 4, true);
	oled_ui_vline(104, 21, 4, true);
	oled_ui_vline(104, 55, 4, true);
	oled_ui_rect(98, 34, 13, 13, true);

	int dx = clamp_int((int)(ax / 600), -16, 16);
	int dy = clamp_int((int)(ay / 600), -16, 16);
	oled_ui_fill_rect(104 + dx - 2, 40 + dy - 2, 5, 5, true);

	(void)oled_ui_present();
}
```

- **倾角比例缩放**：当板卡倾斜使 X/Y 方向重力分量达到 `±9600` 毫单位（约 `1g` / 直立 90°）时，`ax / 600` 恰好落在 `[-16, +16]` 像素，加上 `5×5` 气泡块的 2 px 半宽后总范围 `(104 ± 18)` 刚好紧贴 `x = 82..125` 卡片内框不越界。若在桌面观察小角度微倾，可将除数 `600` 调小（如 `250`）以提高灵敏度。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\mpu6050_demo -d build\mpu6050_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M11** 插好 MPU6050 模块，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\mpu6050_demo
```

烧录校验完成后，在串口终端（`115200 8-N-1`）平放和倾斜板卡观察数值变化：

```text
MPU6050 demo: coreboard + 6-axis motion sensor
SDRAM quick check PASSED (32 MiB)
sensor: mpu6050@68 ready
accel[m/s^2 e-3]: 1234 -567 9815 | gyro[rad/s e-3]: -12 34 -5 | temp[mC]: 36420
```

---

[上一课：HC-SR04 超声波测距开发](../p2-17-HC-SR04超声波测距开发/README.md) · [下一课：光敏电阻亮度采集开发](../p2-19-光敏电阻亮度采集开发/README.md) · [课程目录](../README.md)
