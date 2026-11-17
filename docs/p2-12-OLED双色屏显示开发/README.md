---
title: 第 12 课：OLED 双色屏显示开发
---

# 第 12 课：OLED 双色屏显示开发

本课解析 `oled_demo` 以及平台共享黄蓝双色仪表盘库 `<dshan/oled_ui.h>` 的源码结构。底层复用 Zephyr 标准 SSD1306 显示驱动（`solomon,ssd1306fb`），上层通过零堆分配的 `oled_ui` 轻量图形库按黄（上 16 行）/ 蓝（下 48 行）物理分区绘制徽章、去锯齿 2× 大字号文字与动态进度条（快速体验见 [一期第 1 课：OLED 双色屏显示](../p1-01-OLED双色屏显示/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/oled_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 I2C、DISPLAY、SSD1306 与 CONFIG_DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # chosen zephyr,display + I2C1 ssd1306@3c
│  └─ src/main.c                       # 5 Hz 刷新仪表盘卡片、扫描条与运行计时
├─ platform/
│  ├─ boards/hpmicro/dshanmcu_hpm6e70/
│  │  └─ dshanmcu_hpm6e70-pinctrl.dtsi # pinmux_i2c1 启用开漏与内部上拉（防未插屏总线悬空）
│  ├─ include/dshan/oled_ui.h          # 共享 128x64 仪表盘绘制 API
│  └─ drivers/display/oled_ui.c        # 静态 1 KiB VTILED 帧缓冲 + 6x8/2x 字库 + 控件
├─ sdk_glue/drivers/i2c/i2c_hpmicro.c  # HPM I2C1 控制器驱动
└─ zephyr/drivers/display/ssd1306.c    # Zephyr 内置 SSD1306 驱动
```

## 配置与设备树解析

### 1. `prj.conf` 关键配置

```ini
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
```

- `CONFIG_DSHAN_OLED_UI=y`：启用 `platform/drivers/display/oled_ui.c`；它使用静态 `1024 B` BSS 帧缓冲 `s_fb`，**不再需要 `CONFIG_CHARACTER_FRAMEBUFFER=y` 和 `CONFIG_HEAP_MEM_POOL_SIZE`** 堆内存。

### 2. 板级上拉与应用 Overlay

1. **板级 `pinmux_i2c1` 防挂起配置**（`dshanmcu_hpm6e70-pinctrl.dtsi`）：
   - `PF13`（`I2C1_SCL`）与 `PF12`（`I2C1_SDA`）同时开启 `drive-open-drain;`、`bias-pull-up;` 与 `input-enable;`。这样即使后续实验（第 4～14 课 Demo）运行时没有插 M1 屏，总线也能保持空闲高电平并迅速收到 NACK（`-ENXIO`），平滑降级为仅串口输出而不会卡死。
2. **应用 `boards/dshanmcu_hpm6e70.overlay`**：
   - 在 `&i2c1` 下挂载从机地址 `0x3c` 的 `ssd1306` 节点，并在 `/chosen` 里指定 `zephyr,display = &ssd1306;`：

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

	ssd1306: ssd1306@3c {
		compatible = "solomon,ssd1306fb";
		reg = <0x3c>;
		width = <128>;
		height = <64>;
		segment-offset = <0>;
		page-offset = <0>;
		display-offset = <0>;
		multiplex-ratio = <63>;
		segment-remap;
		com-invdir;
		prechargep = <0x22>;
	};
};
```

- 如果画面上下或左右颠倒，可调整 `segment-remap;` / `com-invdir;`；若第三方模块 I2C 地址为 `0x3D`，改 `reg = <0x3d>` 后加 `-p always` 重建即可。

## 源码解析

### 1. 显存布局与像素位运算（`s_fb` 与 VTILED 映射）

SSD1306 单色屏内部 GDDRAM 按 8 页（Page 0～7，每页高 8 像素、宽 128 列）纵向排列字节，与 Zephyr 的 `SCREEN_INFO_MONO_VTILED` 布局完全一致。`platform/drivers/display/oled_ui.c` 在 BSS 段静态分配了一块与物理显存一一对应的 `1024 B` 帧缓冲，不占用任何 `k_malloc` 动态堆：

```c
#define DISPLAY_NODE  DT_CHOSEN(zephyr_display)
#define FB_SIZE_BYTES (OLED_UI_WIDTH * OLED_UI_HEIGHT / 8) /* 128 * 64 / 8 = 1024 B */

static uint8_t s_fb[FB_SIZE_BYTES];
static const struct device *s_disp;
static bool s_ready;
static K_MUTEX_DEFINE(s_oled_lock);

void oled_ui_pixel(int x, int y, bool on)
{
	if ((unsigned)x >= OLED_UI_WIDTH || (unsigned)y >= OLED_UI_HEIGHT) {
		return;
	}

	size_t idx = (size_t)((y >> 3) * OLED_UI_WIDTH + x);
	uint8_t mask = (uint8_t)(1U << (y & 7));

	if (on) {
		s_fb[idx] |= mask;
	} else {
		s_fb[idx] &= (uint8_t)~mask;
	}
}

void oled_ui_invert_rect(int x, int y, int w, int h)
{
	for (int dy = 0; dy < h; dy++) {
		int py = y + dy;
		if ((unsigned)py >= OLED_UI_HEIGHT) {
			continue;
		}
		for (int dx = 0; dx < w; dx++) {
			int px = x + dx;
			if ((unsigned)px >= OLED_UI_WIDTH) {
				continue;
			}
			size_t idx = (size_t)((py >> 3) * OLED_UI_WIDTH + px);
			s_fb[idx] ^= (uint8_t)(1U << (py & 7));
		}
	}
}
```

- **物理黄蓝分区对齐**：`y >> 3` 决定字节所在 Page。`y = 0..15` 对应 Page 0～1（物理黄色顶栏），`oled_ui_header()` 专门写在该区并用 `oled_ui_pixel(x, 14, true)` 绘制点状分割线；`y = 16..63` 对应 Page 2～7（物理蓝色主区域），用于放置卡片与数值；
- **边界裁剪**：将 `x`、`y` 强转为 `(unsigned)` 后判断，一条指令同时拦截负数和越界正坐标，避免绘制大框或动画时写穿 `s_fb`。

### 2. I2C 400 kHz 提速与未插屏平滑降级（`oled_ui_init`）

```c
bool oled_ui_init(void)
{
	s_ready = false;
	s_disp = NULL;

#if DT_NODE_HAS_STATUS(DT_NODELABEL(i2c1), okay)
	const struct device *i2c_dev = DEVICE_DT_GET(DT_NODELABEL(i2c1));

	if (device_is_ready(i2c_dev)) {
		(void)i2c_configure(i2c_dev,
				    I2C_SPEED_SET(I2C_SPEED_FAST) | I2C_MODE_CONTROLLER);
	}
#endif

#if DT_HAS_CHOSEN(zephyr_display)
	const struct device *dev = DEVICE_DT_GET_OR_NULL(DISPLAY_NODE);

	if (dev == NULL || !device_is_ready(dev)) {
		printk("oled: M1 (ssd1306@3c) not detected, UART log only\n");
		return false;
	}

	/* 确保黑底亮像素（PIXEL_FORMAT_MONO01 为正常白/黄蓝前景，非整屏反白） */
	if (display_set_pixel_format(dev, PIXEL_FORMAT_MONO01) != 0) {
		(void)display_set_pixel_format(dev, PIXEL_FORMAT_MONO10);
	}
	(void)display_set_contrast(dev, 0xFF);

	s_disp = dev;
	s_ready = true;
	oled_ui_clear();
	(void)oled_ui_present();
	(void)display_blanking_off(dev);
	printk("oled: M1 (ssd1306@3c) ready (128x64 UI)\n");
#else
	printk("oled: zephyr,display chosen node not defined\n");
#endif

	return s_ready;
}
```

- **动态将 I2C1 切到 400 kHz（`I2C_SPEED_FAST`）**：默认 100 kHz 下整帧刷新 `1024 B` 需要 ~100 ms，在高频传感器采样循环里会拖慢周期；切到 `I2C_SPEED_FAST` 后单帧推流压缩到 ~25 ms；
- **非致命降级**：`ssd1306` 在内核启动 `POST_KERNEL` 阶段尝试与 `0x3c` 通信；因为板级 `pinmux_i2c1` 打开了内部上拉，未插 M1 屏时会立刻收到 NACK（`-ENXIO`）并标记为未就绪，此时 `device_is_ready(dev)` 直接返回 `false`，`oled_ui_init()` 跟着返回 `false`，让第 15～25 课示例无感降级为仅串口输出。

### 3. 2× 大字号斜角去锯齿算法（`draw_big_char_12x16`）

为了避免再单独嵌入一套占据数 KB ROM 的 12×16 点阵表，`oled_ui.c` 直接复用 `5×7` ASCII 字模（步距 `6×8`），在 2× 放大至 `10×14`（步距 `12×16`）时加入了正交邻接像素插值：

```c
static void draw_big_char_12x16(int x, int y, char c)
{
	for (int gy = 0; gy < 7; gy++) {
		for (int gx = 0; gx < 5; gx++) {
			bool center = font_bit(c, gx, gy);

			for (int sy = 0; sy < 2; sy++) {
				for (int sx = 0; sx < 2; sx++) {
					bool on = center;

					if (!on) {
						int nx = gx + (sx ? 1 : -1);
						int ny = gy + (sy ? 1 : -1);

						if (font_bit(c, nx, gy) &&
						    font_bit(c, gx, ny) &&
						    !font_bit(c, nx, ny)) {
							on = true;
						}
					}
					if (on) {
						oled_ui_pixel(x + gx * 2 + sx,
							      y + gy * 2 + sy, true);
					}
				}
			}
		}
	}
}
```

- **原理说明**：单纯 2× 最近邻放大会把 `0`、`2`、`A`、`C`、`S` 的斜线拉成明显的 2×2 阶梯锯齿；当一个空白像素 `(gx, gy)` 的某象限 `(sx, sy)` 紧邻两个正交方向都有笔画（`font_bit(c, nx, gy) && font_bit(c, gx, ny)`）且对角位置为空（`!font_bit(c, nx, ny)`）时，说明此处正是“台阶内角”，补点后斜边和圆角立刻平滑，而横向/纵向直边外角因为不满足对角条件仍保持绝对锐利。

### 4. 互斥锁推帧与 5 Hz 动态仪表盘（`oled_ui_present` & `main.c`）

```c
int oled_ui_present(void)
{
	struct display_buffer_descriptor desc = {
		.buf_size = sizeof(s_fb),
		.width = OLED_UI_WIDTH,
		.height = OLED_UI_HEIGHT,
		.pitch = OLED_UI_WIDTH,
	};
	int ret;

	if (!s_ready || s_disp == NULL) {
		return 0;
	}

	k_mutex_lock(&s_oled_lock, K_FOREVER);
	ret = display_write(s_disp, 0, 0, &desc, s_fb);
	k_mutex_unlock(&s_oled_lock);

	return ret;
}
```

`applications/oled_demo/src/main.c` 先完成 SDRAM 与 LED 自检，再每 `200 ms`（5 Hz）绘制一帧动态界面：

```c
static void render_oled_frame(uint32_t tick)
{
	uint32_t sec = tick / 5U;
	uint32_t phase = (tick * 40U) % 2000U;
	int permille = (int)((phase <= 1000U) ? phase : (2000U - phase));
	char up_buf[16];

	snprintf(up_buf, sizeof(up_buf), "%02u:%02u",
		 (unsigned)(sec / 60U), (unsigned)(sec % 60U));

	oled_ui_clear();
	oled_ui_header("M1", "HPM6E70 OLED", tick);

	oled_ui_card(0, 17, 128, 47);
	oled_ui_big_text_center(21, "100ASK.NET");
	oled_ui_text(5, 38, "RISC-V 600M", false);
	oled_ui_text_right(123, 38, "RAM:32M", false);

	oled_ui_bar(5, 49, 82, 9, permille);
	oled_ui_text_right(123, 50, up_buf, false);

	(void)oled_ui_present();
}
```

- `phase` 在 `0..2000` 之间循环并折叠为 `0..1000` 的三角波千分比 `permille`，喂给 `oled_ui_bar()` 形成平滑往复的扫描条；同时主循环每 5 帧（`(tick % 5U) == 0U`，即每 1 秒）翻转一次 `PC22` 心跳灯。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\oled_demo -d build\oled_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M1** 插座已插好 OLED 模块后执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\oled_demo
```

烧录校验完成后，OLED 黄/蓝双区显示 5 Hz 刷新的仪表盘画面，串口（`115200 8-N-1`）打印初始化日志：

```text
OLED demo: coreboard + ssd1306 dashboard
SDRAM quick check PASSED (32 MiB)
oled: M1 (ssd1306@3c) ready (128x64 UI)
display: ssd1306@3c 128x64 dashboard active
Init complete. LED blinking, OLED refreshing at 5 Hz.
```

---

[上一课：复用 Zephyr 已有驱动](../p2-11-复用Zephyr已有驱动/README.md) · [下一课：RGB 全彩 LED 调色开发](../p2-13-RGB全彩LED调色开发/README.md) · [课程目录](../README.md)
