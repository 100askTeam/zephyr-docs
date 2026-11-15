---
title: 第 3 课：OLED 双色屏显示
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 3 课：OLED 双色屏显示

在 `HPM6E70` 完整工程包中编译并烧录 `applications/oled_demo`，通过 I2C1 总线在底板 **M1** 插座的 0.96 寸 128×64 黄蓝双色 OLED（SSD1306）上居中显示两行文字 `HPM ZEPHYR` 与 `100ask.net`。

## 硬件准备与接线

<KitExplorer focus="m1" />

将 0.96 寸 OLED 模块（I2C 地址 `0x3C`，板载复位电路、无独立 RST 脚）插入底板 **M1** 插座：

| 模块引脚 | 底板 M1 插座 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | --- | --- | --- | --- |
| VCC | 3.3V | — | 3.3V | 模块供电 |
| GND | GND | — | GND | 公共地 |
| SCL | I2C1_SCL | 7 | **PF13** | I2C1 时钟 |
| SDA | I2C1_SDA | 6 | **PF12** | I2C1 数据 |

:::tip[可与 MPU6050 共插共用 I2C1]
M1（OLED，`0x3C`）与第 7 课的 M11（MPU6050，`0x68`）共用 I2C1 总线，两者的 I2C 从机地址不同，**可以同时插在底板上互不冲突**。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\oled_demo -d build\oled_demo
.\.venv\Scripts\python.exe -m west flash -d build\oled_demo
```

## 预期现象与串口日志

烧录并复位后，观察 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **屏幕显示**：0.96 寸黄蓝双色屏顶部 16 行物理像素为黄区、下方 48 行为蓝区，程序启动后在屏幕上水平居中静态显示两行文字：
   - 第 1 行（黄区）：`HPM ZEPHYR`
   - 第 2 行（蓝区）：`100ask.net`
2. **心跳灯**：核心板绿色 LED（`PC22`）每秒翻转一次，表示系统正常运行；
3. **串口日志示例**：

```text
OLED demo: coreboard + ssd1306 display
SDRAM quick check PASSED (32 MiB)
display: ssd1306@3c 128x64, font 10x16
displayed: "HPM ZEPHYR"(title, y=0) / "100ask.net"(sub, y=32)
Init complete. LED blinking.
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 串口报错 `ERROR: display not ready: ssd1306@3c` | 1. 确认 OLED 插在 **M1** 且接触良好、引脚未错位；<br/>2. 若使用第三方 SSD1306 屏，核对背面电阻配置的地址是否为 `0x3C`（部分屏出厂为 `0x3D`） |
| 屏幕完全黑屏且串口无任何打印 | 检查是否已正常烧录成功；按一次核心板 RESET 键并重新核对串口连接 |
| 文字位置偏移或上下截断 | 确认屏幕分辨率为 `128x64` 的 SSD1306 模块（非 SH1106 1.3 寸屏）；1.3 寸 SH1106 与 0.96 寸 SSD1306 列偏移不同 |

---

[上一课：有源/无源蜂鸣器](../p1-02-有源无源蜂鸣器/README.md) · [下一课：DHT11 温湿度采集](../p1-04-DHT11温湿度采集/README.md) · [课程目录](../README.md)
