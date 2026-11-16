---
title: 第 6 课：HC-SR04 超声波测距
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 6 课：HC-SR04 超声波测距

在 `HPM6E70` 完整工程包中编译并烧录 `applications/hc_sr04_demo`，在底板 **M6** 插座上每秒触发一次 HC-SR04 超声波测距，并在串口打印精确到 `0.01 cm` 的距离读数。

## 硬件准备与接线

<KitExplorer focus="m6" />

将 HC-SR04 超声波模块插入模块化底板的 **M6** 插座：

| 模块引脚 | 底板插座 M6 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | :---: | :---: | --- | --- |
| VCC | 1 | — | 3.3V / 电源 | 模块供电 |
| Trig | 2 | 4 | **PB05** | 触发信号（与 M12 SPI5 CS 复用） |
| Echo / INT | 3 | 5 | **PE01** | 回波脉宽信号（与 M12 INT 复用） |
| GND | 4 | — | GND | 公共地 |

:::danger[重要互斥：与 M12（W25Q64 Flash）互斥，注意模块电平]
1. **互斥引脚**：**M6（HC-SR04）** 与 **M12（W25Q64 SPI Flash）** 共用 `PB05` / `PE01` 引脚，**两个模块不能同时插在底板上使用**（第 12～14 课插 W25Q64 前需先拔掉本模块）。
2. **电平提示**：标准 HC-SR04 为 5V 器件，若自行外接不兼容 3.3V 的模块版本，需确认底板插座实际电路已做好分压/电平转换或使用宽压兼容版模块。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\hc_sr04_demo -d build\hc_sr04_demo
.\.venv\Scripts\python.exe -m west flash -d build\hc_sr04_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`），并将探头正前方对准平整墙面或硬纸板移动测试：

1. **核心板心跳灯**：板载绿色 LED（`PC22`）每秒翻转一次；
2. **测距输出**：在探头正前方 5～150 cm 移动手掌或书本，串口每秒实时刷新一次厘米数；若正前方无有效反射面或超出量程/角度过大，会打印无回波提示；
3. **串口日志示例**：

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
| 一直打印 `distance: (no echo, target out of range)` | 1. 确认 **M12 插座为空**（未插 W25Q64 抢占 `PB05`）；<br/>2. 检查模块是否插紧在 **M6**；<br/>3. 被测物距离太近（小于约 2～3 cm 盲区）、表面太软吸声或斜角太大导致声波未反射回探头，换硬质书本正对 30 cm 左右再试 |
| 读数偶尔跳变 | 声波多次反射或多路径干扰属正常物理现象，保持探头与被测面大致垂直且避开杂物边缘 |
| 串口无任何输出 | 确认 `USB-HiSpeed-SERIAL-B` 与 `115200 8-N-1`，烧录后按一次核心板 RESET 键 |

:::tip[想继续了解背后的驱动与设备树吗？]
本例使用的 `dshan,hc-sr04` 自研驱动正是 **二期教程** 的主线教学案例。完成本课验证后，可进入 [二期：从 example-application 认识标准工程](../p2-01-从example-application认识标准工程/README.md) 深入学习设备树、Binding、Kconfig/CMake 与驱动编码。
:::

---

[上一课：DS18B20 单总线测温](../p1-05-DS18B20单总线测温/README.md) · [下一课：MPU6050 六轴姿态采集](../p1-07-MPU6050六轴姿态采集/README.md) · [课程目录](../README.md)
