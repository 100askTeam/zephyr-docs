---
title: 第 2 课：RGB 全彩 LED 调色
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 2 课：RGB 全彩 LED 调色

本课使用预编译固件 [`01_rgb_led_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/01_rgb_led_demo.hex) 配合 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 图形化烧录，通过底板 **M3** 插座上的全彩 LED 模块快速体验红、绿、蓝、黄、青、品红、白、灭 8 种颜色循环切换与串口调色日志（无需搭建编译环境）。

:::tip[开始本课前先确认]
1. 已按 [连接并验证 JTAG](../common-04-连接JTAG与OpenOCD/README.md) 接好 JTAG 烧录调试接口并确认驱动正常；
2. 已按 [连接串口并查看日志](../common-05-连接串口并查看日志/README.md) 接好 UART0 串口线，并在终端打开烧录器串口 1（`DshanPI USBToolBox UART1`）对应的 COM 端口（参数 `115200`、`8-N-1`、`无流控`）；
3. 已下载安装 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 上位机软件，准备直接烧录本课 `.hex` 体验固件。
:::

## 硬件准备与接线

<KitExplorer focus="m3" />

将配套的**全彩 LED 模块**插入模块化底板的 **M3** 插座（注意丝印方向，切勿反插）。该模块由核心板两路 PWM 控制器共同驱动：

| 颜色通道 | 底板 M3 插座信号 | 核心板说明 | HPM6E70 引脚 | PWM 控制器与通道 |
| --- | --- | --- | --- | --- |
| 红（R） | `PA2` 网络 | 丝印“全彩LED R/舵机定时器” | **PB09** | `pwm1` 通道 1（`PWM1_P_1`） |
| 绿（G） | `PA15` 网络 | 丝印“全彩LED G/舵机定时器” | **PF01** | `pwm0` 通道 1（`PWM0_P_1`） |
| 蓝（B） | `PB3` 网络 | 丝印“全彩LED B/舵机定时器” | **PF00** | `pwm0` 通道 0（`PWM0_P_0`） |
| 供电/地 | `3.3V` / `GND` | 模块供电 | — | — |

:::note[极性与丝印说明]
- 核心板在 `PB09` 旁的早期丝印 `PWM0-P-4` 属于设计笔误，芯片实际复用为 `PWM1_P_1`，本体验固件已按实际引脚适配完毕。
- 本体验固件默认按高电平点亮（`PWM_POLARITY_NORMAL`）构建；如手中是**共阳极模块**（主色显示为补色，如红色显示成青色），可在完成快速体验后参考 [二期第 13 课：RGB 全彩 LED 调色开发](../p2-13-RGB全彩LED调色开发/README.md) 修改极性并自行构建。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`01_rgb_led_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/01_rgb_led_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `01_rgb_led_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 13 课：RGB 全彩 LED 调色开发](../p2-13-RGB全彩LED调色开发/README.md)**。

## 预期现象与串口日志

烧录完成后，观察开发板与串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：核心板绿色 LED（`PC22`）每秒翻转一次；
2. **M3 全彩 LED 模块**：每秒依次循环显示 **红 → 绿 → 蓝 → 黄 → 青 → 品红 → 白 → 灭** 8 种状态；
3. **串口日志示例**：

```text
RGB LED demo: coreboard + pwm rgb led
SDRAM quick check PASSED (32 MiB)
pwm: pwm@f0040000/pwm@f0044000/pwm@f0044000 ready (period=1000000ns)
Init complete. LED blinking, color cycling every second.
color: red     (R=100% G=0% B=0%)
color: green   (R=0% G=100% B=0%)
color: blue    (R=0% G=0% B=100%)
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 颜色变成补色（如红亮成青、绿亮成品红） | 手中模块极性与默认高电平有效配置相反；属于硬件模块版本差异，需要修改源码配置时请查看 [二期第 13 课：RGB 全彩 LED 调色开发](../p2-13-RGB全彩LED调色开发/README.md) |
| 串口日志正常打印，但 M3 模块不亮 | 检查模块是否插紧在 **M3** 插座、引脚顺序是否反插 |
| 无任何串口输出且 `PC22` 绿灯不闪 | 先确认 `USBToolBox` 烧录日志提示校验成功，按一次核心板 **RESET** 键再观察；如串口仍无输出，回查 [连接串口并查看日志](../common-05-连接串口并查看日志/README.md) |

---

[上一课：OLED 双色屏显示](../p1-01-OLED双色屏显示/README.md) · [下一课：有源/无源蜂鸣器](../p1-03-有源无源蜂鸣器/README.md) · [课程目录](../README.md)
