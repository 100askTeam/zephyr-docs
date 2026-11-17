---
title: 第 1 课：OLED 双色屏显示
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 1 课：OLED 双色屏显示

本课下载预编译固件 [`03_oled_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/03_oled_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速点亮底板 **M1** 插座上的 0.96 寸 128×64 黄蓝双色 OLED（SSD1306），展示分区仪表盘界面（顶部黄区模块徽章 + 动态指示，底部蓝区圆角卡片、大字号标题与实时进度条）。

:::tip[建议全程保留 M1 OLED 在底板上]
**M1（OLED）与底板所有其他外设模块均无引脚冲突**：第 1 课插上验证之后无需拔下，**第 4～14 课的体验固件也会自动驱动这块屏幕实时显示传感器数值、电子水平仪或校验状态**，实验效果比只看串口日志更加直观。
:::

## 硬件准备与接线

<KitExplorer focus="m1" />

将 0.96 寸 OLED 模块（I2C 地址 `0x3C`，板载复位电路、无独立 RST 脚）插入底板 **M1** 插座：

| 模块引脚 | 底板 M1 插座 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | --- | --- | --- | --- |
| VCC | 3.3V | — | 3.3V | 模块供电 |
| GND | GND | — | GND | 公共地 |
| SCL | I2C1_SCL | 7 | **PF13** | I2C1 时钟 |
| SDA | I2C1_SDA | 6 | **PF12** | I2C1 数据 |

:::tip[可与第 7 课 MPU6050 共插共用 I2C1]
M1（OLED，`0x3C`）与第 7 课的 M11（MPU6050，`0x68`）共用 I2C1 总线，两者的 I2C 从机地址不同，**可以同时插在底板上实现 2D 电子水平仪同屏联动**。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`03_oled_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/03_oled_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `03_oled_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、了解黄蓝双色仪表盘 UI 库源码并使用 `west build` / `west flash` 开发，请见 **[二期第 12 课：OLED 双色屏显示开发](../p2-12-OLED双色屏显示开发/README.md)**。

## 预期现象与串口日志

烧录并复位后，观察 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **OLED 仪表盘效果**：0.96 寸黄蓝双色屏按物理颜色分区清晰排版，并以 5 Hz 频率流畅刷新：
   - **顶部黄区（上 16 行）**：左侧反白圆角徽章 **`M1`** + 标题 **`HPM6E70 OLED`** + 右上角 4 帧动态旋转指示器，底部带细点虚线分隔；
   - **底部蓝区（下 48 行）**：全宽切角圆角卡片内部居中大字号（去锯齿 2× 字体）显示 **`100ASK.NET`**，中排左右对齐显示 **`RISC-V 600M`** 与 **`RAM:32M`**，底排为往复平滑扫描进度条与 **`MM:SS`** 实时运行计时；
2. **心跳灯**：核心板绿色 LED（`PC22`）每秒翻转一次，表示系统正常运行；
3. **串口日志示例**：

```text
OLED demo: coreboard + ssd1306 dashboard
SDRAM quick check PASSED (32 MiB)
oled: M1 (ssd1306@3c) ready (128x64 UI)
display: ssd1306@3c 128x64 dashboard active
Init complete. LED blinking, OLED refreshing at 5 Hz.
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 串口打印 `oled: M1 (ssd1306@3c) not detected, UART log only` 及 `ERROR: M1 OLED display not ready` | 1. 确认 OLED 插在 **M1** 且排针顺序正确（`GND/VCC/SCL/SDA` 切勿反插）；<br/>2. 若使用第三方 SSD1306 屏，核对背面电阻配置的地址是否为 `0x3C`（部分屏出厂为 `0x3D`） |
| 屏幕完全黑屏且串口无任何打印 | 检查是否已正常烧录成功；按一次核心板 RESET 键并重新核对串口连接 |
| 画面横向偏移或出现花屏条纹 | 确认屏幕为 0.96 寸 `128x64` SSD1306 模块（而非 1.3 寸 SH1106 屏；两者列起始偏移不同） |

---

[上一课：认识实验套件](../p1-00-认识实验套件/README.md) · [下一课：RGB 全彩 LED 调色](../p1-02-RGB全彩LED调色/README.md) · [课程目录](../README.md)
