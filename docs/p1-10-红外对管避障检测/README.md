---
title: 第 10 课：红外对管避障检测
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 10 课：红外对管避障检测

在 `HPM6E70` 完整工程包中编译并烧录 `applications/ir_obstacle_demo`，在底板 **M5** 插座上实时检测红外避障探头前方是否有物体遮挡，并在状态变化时通过串口打印 `DETECTED` 与 `CLEAR`。

## 硬件准备与接线

<KitExplorer focus="m5" />

将红外对管避障模块插入模块化底板的 **M5** 插座（3.3V）：

| M5 引脚 | 底板标注 | HPM6E70 实际引脚 | 作用 |
| ---: | --- | --- | --- |
| 1 | `VCC_+3.3V` | `3.3V` | 模块供电 |
| 2 | `GND` | `GND` | 公共地 |
| 3 | `PB13 OUT/INT`（底板网络名） | **PA21** | 数字避障检测输出 |

:::note[默认运行模式与有效电平]
- 当前 `applications/ir_obstacle_demo/boards/dshanmcu_hpm6e70.overlay` 默认启用 `polling-mode;`（每 100 ms 轮询一次，仅在遮挡状态改变时打印日志）。若删掉 `polling-mode;` 并加 `-p always` 重建，可切换为 GPIO 中断触发模式。
- 常见红外避障模块检测到障碍物时输出低电平，因此 overlay 默认配置 `GPIO_ACTIVE_LOW`。若你的模块现象刚好相反，把 `GPIO_ACTIVE_LOW` 改为 `GPIO_ACTIVE_HIGH` 并加 `-p always` 重建即可。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\ir_obstacle_demo -d build\ir_obstacle_demo
.\.venv\Scripts\python.exe -m west flash -d build\ir_obstacle_demo
```

## 预期现象与串口日志

烧录后打开串口终端（`115200 8-N-1`），用手掌在红外对管探头前方靠近与移开：

1. **核心板心跳灯**：绿色 LED（`PC22`）每 500 ms 翻转一次；
2. **避障触发反馈**：探头前无遮挡时状态为 `CLEAR (prox=0)`；手掌或白纸靠近探头触发阈值时，模块板载指示灯亮起且串口打印 `DETECTED (prox=1)`，移开后恢复 `CLEAR (prox=0)`；
3. **串口日志示例**：

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
| 遮挡时打印 `CLEAR`，无遮挡时反而打印 `DETECTED` | 将 `applications/ir_obstacle_demo/boards/dshanmcu_hpm6e70.overlay` 中的 `GPIO_ACTIVE_LOW` 改为 `GPIO_ACTIVE_HIGH` 后加 `-p always` 重建 |
| 探头无反应且模块电源灯未亮 | 检查模块是否插在 **M5** 且方向正确 |

---

[上一课：旋转编码器与按键](../p1-09-旋转编码器与按键/README.md) · [下一课：红外发射与接收通信](../p1-11-红外发射与接收通信/README.md) · [课程目录](../README.md)
