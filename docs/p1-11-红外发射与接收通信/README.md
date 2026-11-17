---
title: 第 11 课：红外发射与接收通信
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 11 课：红外发射与接收通信

本课下载预编译固件 [`11_ir_tx_rx_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/11_ir_tx_rx_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，同时使用底板 **M4（红外发射）** 与 **M8（红外接收）** 快速体验 38 kHz 红外自发自收通信与解码显示。

## 硬件准备与接线

<KitExplorer focus="ir_tx_rx" />

本实验需要**同时插上两个模块**（均使用 3.3V）：

| 模块与插座 | 底板信号名 | HPM6E70 引脚 | 使用方式 |
| --- | --- | --- | --- |
| **M4** 红外发射管 | `PA8 DAT` | **PF26** | `PWM3` 通道 2 输出 38 kHz 载波 |
| **M8** 红外接收头 | `PB10 OUT/INT` | **PA09** | GPIO 输入解调脉冲（低电平有效） |

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留 M1 屏幕可实时查看 `TX/RX` 最近一次指令帧（`PING / VALUE_UP / VALUE_DOWN`）、当前累计值 `VAL` 与成功帧数 `OK`；未插屏时自动降级为仅串口输出。
:::

:::danger[重要互斥与光路摆放要求]
1. **必须拔掉 M9 蜂鸣器**：**M4（红外发射）** 与第 3 课使用的 **M9（蜂鸣器）** 共用 `PF26` 引脚，运行本课前**务必拔掉 M9 蜂鸣器**！（M4 与 M8 可以同时插着用）
2. **光路对准**：将 **M4 发射管** 正面对准 **M8 接收头**；如果插座朝向不方便直接对射，可在模块前方几厘米处斜放一张**白色纸张**，将红外光漫反射回 M8 接收窗口。同时注意尽量避开强阳光直射、日光灯闪烁或电视遥控器干扰。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`11_ir_tx_rx_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/11_ir_tx_rx_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `11_ir_tx_rx_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 22 课：红外发射与接收通信开发](../p2-22-红外发射与接收通信开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **M1 OLED 收发监控**：顶部黄区显示 `M4/8` 与链路状态 `IR LINK OK` / `IR WAITING`，底部蓝区分别刷新最近一次 `TX` 发送指令、`RX` 解码指令（未收到时提示 `Reflect 5-15cm`），左下角反白徽章显示当前累计 `VAL:+/-N` 与右侧成功次数 `OK:N`；
2. **核心板心跳灯**：主线程控制的绿色 LED（`PC22`）周期闪烁；
3. **双线程收发结果**：发送线程依次轮流发出 `PING (0x01)`、`VALUE_UP (0x02)`、`VALUE_DOWN (0x03)` 三条教学协议指令；当 M8 完整收到并校验反码通过时，接收线程立即打印解码动作与示例数值 `value` 的增减；
4. **串口日志示例（收发正常）**：

```text
IR command demo: two drivers, two worker threads
SDRAM quick check PASSED (32 MiB)
devices ready: TX=ir-transmitter, RX=ir-receiver, receiver active=0 (expected 0)
Main: both driver clients started; PC22 LED is the heartbeat.
[TX] send #1: PING       command=0x01 check=0xFE
[RX] recv #1: PING       -> link OK, value=0
[TX] send #2: VALUE_UP   command=0x02 check=0xFD
[RX] recv #2: VALUE_UP   -> value=1
[TX] send #3: VALUE_DOWN command=0x03 check=0xFC
[RX] recv #3: VALUE_DOWN -> value=0
```

若连续 5 秒未收到完整合法帧，接收线程会打印诊断统计方便定位光路状态：

```text
[RX] waiting: valid=0 invalid=0 dropped=0 edges=5 active=0
```

- `edges`：M8 累计检测到的下降沿次数（用于判断是否接收到红外光）；
- `invalid`：已检测到引导码但脉宽或校验反码不完整的帧数；
- `valid`：校验通过并成功递交应用的完整帧数；
- `active`：打印瞬间接收脚是否处于低电平有效态（空闲时应为 `0`）。

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| `edges` 一直为 `0` | M8 完全未检测到红外光：确认 **M9 蜂鸣器已拔掉**、M4/M8 均插在正确插座且面对面或白纸近距离对准 |
| `edges` 缓慢增长但 `valid=0` | 只偶发收到零散边沿，调整 M4 发射灯头角度、缩短距离或用白纸近距反射改善光路 |
| `invalid` 持续增加 | 已收到连续波形但存在干扰或遮挡，调整光路位置并避开强日光灯/太阳光/其他遥控器 |
| 自购发射模块有效电平相反 | 自购模块触发电平相反时，可在 [二期第 22 课：红外发射与接收通信开发](../p2-22-红外发射与接收通信开发/README.md) 中修改发射极性并重新编译 |

---

[上一课：红外对管避障检测](../p1-10-红外对管避障检测/README.md) · [下一课：W25Q64 轮询读写](../p1-12-W25Q64轮询读写/README.md) · [课程目录](../README.md)
