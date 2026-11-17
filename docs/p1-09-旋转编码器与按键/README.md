---
title: 第 9 课：旋转编码器与按键
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 9 课：旋转编码器与按键

本课下载预编译固件 [`09_rotary_encoder_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/09_rotary_encoder_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M13** 插座上旋转编码器的顺/逆时针计数与按压开关事件输出。

## 硬件准备与接线

<KitExplorer focus="m13" />

将旋转编码器模块直接插入模块化底板的 **M13** 插座：

| 模块功能 | 底板 M13 引脚 | 底板网络名 | HPM6E70 引脚 | 对应 input 事件 |
| --- | :---: | --- | --- | --- |
| `VCC` | 1 | `VCC_+5V` | 5V 电源 | — |
| `KEY / SW` | 2 | `PB1` | **PB10** | 按键 `INPUT_KEY_0` |
| `S2 / DT` | 3 | `PB0` | **PC00** | B 相 |
| `S1 / CLK` | 4 | `PB12` | **PA23** | A 相 |
| `GND` | 5 | `GND` | `GND` | — |

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留 M1 屏幕可直接在屏上实时查看正反转步数、`CW / CCW` 方向、按键状态与双向刻度条；未插屏时自动降级为仅串口输出。
:::

:::note[供电与默认模式说明]
1. **关于 M13 5V 供电**：底板 M13-1 接入经过限流保护的 `VCC_+5V`，配套编码器模块可直接插在 M13 插座运行正反转与按键检测，无需改线。若后续用于长期量产并严格要求 GPIO 仅承受 3.3V 电平，可将模块改接 3.3V 或增加 5V→3.3V 电平转换。
2. **默认采样方式**：本体验固件使用每 `1000 us` 轮询方式读取正交编码与按键消抖（`steps-per-detent = 4`）。如需修改分频或切换中断模式，见 [二期第 20 课：旋转编码器与按键开发](../p2-20-旋转编码器与按键开发/README.md)。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`09_rotary_encoder_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/09_rotary_encoder_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `09_rotary_encoder_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 20 课：旋转编码器与按键开发](../p2-20-旋转编码器与按键开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`），拧动旋钮并按压轴键：

1. **M1 OLED 实时计步面板**：顶部黄区在按下轴键时切换为 `EC11 [DOWN]`，底部蓝区大字号居中显示带符号步数（如 `+0012` / `-0005`）、下方显示旋转方向 `DIR: CW >>` / `DIR: << CCW` 与按键状态 `BTN:UP/DOWN`，最底排为居中零点 `±20` 格双向刻度条；
2. **核心板心跳灯**：板载绿色 LED（`PC22`）每 500 ms 翻转一次；
3. **旋钮与按键事件**：顺时针转动打印 `CW` 且 `position` 递增，逆时针打印 `CCW` 且递减；按下/松开轴键分别打印 `PRESSED` / `RELEASED`；
4. **串口日志示例**：

```text
rotary encoder demo: Zephyr input driver
SDRAM quick check PASSED (32 MiB)
Input ready: turn the knob or press it; LED is the firmware heartbeat.
rotate: delta=+1 position=1 direction=CW
rotate: delta=-1 position=0 direction=CCW
button: PRESSED
button: RELEASED
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 顺时针旋转时日志显示成 `CCW` | 不同批次模块 A/B 相线序可能相反，如须对调可在 [二期第 20 课](../p2-20-旋转编码器与按键开发/README.md) 中交换源码配置 |
| 每转一格报错两次或转两格才报一次 | 不同规格旋钮每格脉冲数不同，可在 [二期第 20 课](../p2-20-旋转编码器与按键开发/README.md) 中调整步数参数 |
| 快速拧动时轮询偶发丢格 | 属于高转速下轮询采样间隔限制，如需切换为中断模式请参考 [二期第 20 课](../p2-20-旋转编码器与按键开发/README.md) |
| 完全没有任何事件输出 | 检查模块是否插紧在 **M13**，核对 `CLK / DT / SW / GND` 接触是否正常 |

---

[上一课：光敏电阻亮度采集](../p1-08-光敏电阻亮度采集/README.md) · [下一课：红外对管避障检测](../p1-10-红外对管避障检测/README.md) · [课程目录](../README.md)
