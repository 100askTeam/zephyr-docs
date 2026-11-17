---
title: 第 10 课：红外对管避障检测
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 10 课：红外对管避障检测

本课下载预编译固件 [`10_ir_obstacle_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/10_ir_obstacle_demo.zip)（解压得 `10_ir_obstacle_demo.hex`） 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M5** 插座上红外对管避障模块遮挡检测与状态打印。

## 硬件准备与接线

<KitExplorer focus="m5" />

将红外对管避障模块插入模块化底板的 **M5** 插座（3.3V）：

| M5 引脚 | 底板标注 | HPM6E70 实际引脚 | 作用 |
| ---: | --- | --- | --- |
| 1 | `VCC_+3.3V` | `3.3V` | 模块供电 |
| 2 | `GND` | `GND` | 公共地 |
| 3 | `PB13 OUT/INT`（底板网络名） | **PA21** | 数字避障检测输出 |

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留 M1 屏幕会在触发遮挡时立即亮出反白 **`DETECTED`** 横幅并累计 `Hits` 次数，移开后恢复线框 **`CLEAR`**；未插屏时自动降级为仅串口输出。
:::

:::note[默认运行模式与有效电平]
- 本体验固件默认每 `100 ms` 轮询采样一次，仅在遮挡状态改变时打印日志，且按常见模块的“遮挡时输出低电平”逻辑配置。
- 如果需要调整轮询/中断模式或反转有效电平，请参考 [二期第 21 课：红外对管避障检测开发](../p2-21-红外对管避障检测开发/README.md)。
:::

## 下载并烧录体验固件

1. **下载并解压预编译固件**：点击下载 [`10_ir_obstacle_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/10_ir_obstacle_demo.zip)，解压得到 `10_ir_obstacle_demo.hex` 烧录文件；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入解压得到的 `10_ir_obstacle_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 21 课：红外对管避障检测开发](../p2-21-红外对管避障检测开发/README.md)**。

## 预期现象与串口日志

烧录后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`），用手掌在红外对管探头前方靠近与移开：

1. **M1 OLED 状态横幅与触发计数**：顶部黄区显示 `M5 IR OBSTACLE`，无遮挡时蓝区线框大字显示 **`CLEAR`**；手掌或物体靠近触发遮挡时立即切换为反白醒目横幅 **`DETECTED`**，右下角 `Hits:XXX` 触发次数随之累加；
2. **核心板心跳灯**：绿色 LED（`PC22`）每 500 ms 翻转一次；
3. **避障触发反馈**：探头前无遮挡时串口打印 `CLEAR (prox=0)`，靠近触发时模块板载指示灯亮起且串口打印 `DETECTED (prox=1)`；
4. **串口日志示例**：

```text
infrared obstacle demo: Zephyr sensor driver
SDRAM quick check PASSED (32 MiB)
obstacle: CLEAR (prox=0)
Mode: polling every 100 ms; LED is the firmware heartbeat.
obstacle: DETECTED (prox=1)
obstacle: CLEAR (prox=0)
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 靠近/移开时串口状态始终不变 | 用螺丝刀调节模块上的灵敏度电位器，观察模块自身输出指示灯是否能随遮挡熄灭/点亮 |
| 遮挡时打印 `CLEAR`，无遮挡时反而打印 `DETECTED` | 模块输出有效电平与默认极性相反；需要修改有效电平时请参考 [二期第 21 课：红外对管避障检测开发](../p2-21-红外对管避障检测开发/README.md) |
| 探头无反应且模块电源灯未亮 | 检查模块是否插在 **M5** 且方向正确 |

---

[上一课：旋转编码器与按键](../p1-09-旋转编码器与按键/README.md) · [下一课：红外发射与接收通信](../p1-11-红外发射与接收通信/README.md) · [课程目录](../README.md)
