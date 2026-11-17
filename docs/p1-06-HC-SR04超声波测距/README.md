---
title: 第 6 课：HC-SR04 超声波测距
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 6 课：HC-SR04 超声波测距

本课下载预编译固件 [`06_hc_sr04_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/06_hc_sr04_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M6** 插座上的 HC-SR04 超声波测距效果与串口实时输出。

## 硬件准备与接线

<KitExplorer focus="m6" />

将 HC-SR04 超声波模块插入模块化底板的 **M6** 插座：

| 模块引脚 | 底板插座 M6 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | :---: | :---: | --- | --- |
| VCC | 1 | — | 3.3V / 电源 | 模块供电 |
| Trig | 2 | 4 | **PB05** | 触发信号（与 M12 SPI5 CS 复用） |
| Echo | 3 | 5 | **PE01** | 回波脉宽信号（W25Q64 未使用此脚） |
| GND | 4 | — | GND | 公共地 |

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留 M1 屏幕可直接在屏上以 0.5 秒节拍实时查看厘米距离、声纳进度条或越界徽章；未插屏时自动降级为仅串口输出。
:::

:::note[引脚共线与模块电平说明]
1. **`PB05` 共线说明（无需拔除 M12）**：**M6（HC-SR04）** 的 `Trig` 与 **M12（W25Q64 SPI Flash）** 的片选 `/CS` 共用 `PB05`，但 W25Q64 的 `/CS` 为高阻输入且本课固件未开启 `SPI5` 时钟（`PE01` 回波脚也未被 W25Q64 占用），因此**保留 M12 在底板上不会影响超声波测距**。
2. **电平提示**：标准 HC-SR04 为 5V 器件，若自行外接不兼容 3.3V 的模块版本，需确认底板插座实际电路已做好分压/电平转换或使用宽压兼容版模块。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`06_hc_sr04_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/06_hc_sr04_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `06_hc_sr04_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 17 课：HC-SR04 超声波测距开发](../p2-17-HC-SR04超声波测距开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`），并将探头正前方对准平整墙面或硬纸板移动测试：

1. **M1 OLED 声纳测距面板**：顶部黄区显示 `M6 HC-SR04`，底部蓝区每 0.5 秒大字号刷新精确到两位小数的厘米距离（如 `18.45cm`）及 `0cm～100cm` 声纳进度条；超出量程无回波时自动弹出 `OUT OF RANGE` 反白徽章；
2. **核心板心跳灯**：板载绿色 LED（`PC22`）每 500 ms 翻转一次；
3. **测距输出**：在探头正前方 5～150 cm 移动手掌或书本，串口实时刷新厘米数；若正前方无有效反射面或超出量程/角度过大，会打印无回波提示；
4. **串口日志示例**：

```text
HC-SR04 demo: coreboard + ultrasonic sensor
SDRAM quick check PASSED (32 MiB)
sensor: hc-sr04 ready
Init complete. LED blinking, ranging every second.
distance: 30.68 cm
distance: 31.05 cm
distance: (no echo, target out of range)
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 一直打印 `distance: (no echo, target out of range)` | 1. 检查模块是否插紧在 **M6**；<br/>2. 被测物距离太近（小于约 2～3 cm 盲区）、表面太软吸声或斜角太大导致声波未反射回探头，换硬质书本正对 30 cm 左右再试 |
| 读数偶尔跳变 | 声波多次反射或多路径干扰属正常物理现象，保持探头与被测面大致垂直且避开杂物边缘 |
| 串口无任何输出 | 确认 `DshanPI USBToolBox UART1` 端口与 `115200 8-N-1`，烧录后按一次核心板 RESET 键 |

:::tip[想继续了解背后的驱动与设备树吗？]
本例使用的 `dshan,hc-sr04` 自研驱动正是 **二期教程** 的主线教学案例。完成本课验证后，可进入 [二期：从 example-application 认识标准工程](../p2-01-从example-application认识标准工程/README.md) 深入学习设备树、Binding、Kconfig/CMake 与驱动编码。
:::

---

[上一课：DS18B20 单总线测温](../p1-05-DS18B20单总线测温/README.md) · [下一课：MPU6050 六轴姿态采集](../p1-07-MPU6050六轴姿态采集/README.md) · [课程目录](../README.md)
