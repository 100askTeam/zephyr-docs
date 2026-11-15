---
title: 第 11 课：红外发射与接收通信
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 11 课：红外发射与接收通信

在 `HPM6E70` 完整工程包中编译并烧录 `applications/ir_tx_rx_demo`，同时使用底板 **M4（红外发射）** 与 **M8（红外接收）** 进行近距离自发自收通信，通过发射 38 kHz 载波指令帧并由接收端实时解码校验。

## 硬件准备与接线

<KitExplorer focus="ir_tx_rx" />

本实验需要**同时插上两个模块**（均使用 3.3V）：

| 模块与插座 | 底板信号名 | HPM6E70 引脚 | 使用方式 |
| --- | --- | --- | --- |
| **M4** 红外发射管 | `PA8 DAT` | **PF26** | `PWM3` 通道 2 输出 38 kHz 载波 |
| **M8** 红外接收头 | `PB10 OUT/INT` | **PA09** | GPIO 输入解调脉冲（低电平有效） |

:::danger[重要互斥与光路摆放要求]
1. **必须拔掉 M9 蜂鸣器**：**M4（红外发射）** 与第 2 课使用的 **M9（蜂鸣器）** 共用 `PF26` 引脚，运行本课前**务必拔掉 M9 蜂鸣器**！（M4 与 M8 可以同时插着用）
2. **光路对准**：将 **M4 发射管** 正面对准 **M8 接收头**；如果插座朝向不方便直接对射，可在模块前方几厘米处斜放一张**白色纸张**，将红外光漫反射回 M8 接收窗口。同时注意尽量避开强阳光直射、日光灯闪烁或电视遥控器干扰。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\ir_tx_rx_demo -d build\ir_tx_rx_demo
.\.venv\Scripts\python.exe -m west flash -d build\ir_tx_rx_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：主线程控制的绿色 LED（`PC22`）周期闪烁；
2. **双线程收发结果**：发送线程依次轮流发出 `PING (0x01)`、`VALUE_UP (0x02)`、`VALUE_DOWN (0x03)` 三条教学协议指令；当 M8 完整收到并校验反码通过时，接收线程立即打印解码动作与示例数值 `value` 的增减；
3. **串口日志示例（收发正常）**：

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
| 自购发射模块有效电平相反 | 把 `applications/ir_tx_rx_demo/boards/dshanmcu_hpm6e70.overlay` 中发射节点 `pwms` 的 `PWM_POLARITY_NORMAL` 改为 `PWM_POLARITY_INVERTED` 后加 `-p always` 重建测试 |

---

[上一课：红外对管避障检测](../p1-10-红外对管避障检测/README.md) · [下一课：W25Q64 轮询读写](../p1-12-W25Q64轮询读写/README.md) · [课程目录](../README.md)
