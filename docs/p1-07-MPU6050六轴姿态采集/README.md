---
title: 第 7 课：MPU6050 六轴姿态采集
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 7 课：MPU6050 六轴姿态采集

在 `HPM6E70` 完整工程包中编译并烧录 `applications/mpu6050_demo`，通过 I2C1 总线从底板 **M11** 插座上的 MPU6050 模块每秒读取三轴加速度、三轴角速度和芯片内部温度，并在串口以毫单位整数形式输出。

## 硬件准备与接线

<KitExplorer focus="m11" />

将 MPU6050 模块插入模块化底板的 **M11** 插座（3.3V）：

| 模块引脚 | 底板插座 M11 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | --- | :---: | --- | --- |
| VCC | 3.3V | — | 3.3V | 模块供电 |
| GND | GND | — | GND | 公共地 |
| SCL | `I2C1_SCL` | 7 | **PF13** | I2C1 时钟 |
| SDA | `I2C1_SDA` | 6 | **PF12** | I2C1 数据 |
| INT | 陀螺仪 INT | 8 | `PF06` | 本例使用轮询模式，暂未使用 |
| AD0 | 地址选择 | — | — | 默认接地，I2C 地址 `0x68`（若接高电平则为 `0x69`） |

:::tip[可与 M1（OLED）共插共用 I2C1]
M11（MPU6050，`0x68`）与第 3 课的 M1（OLED，`0x3C`）共用 I2C1 总线但地址不同，**两个模块可同时插在底板上，互不影响**。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\mpu6050_demo -d build\mpu6050_demo
.\.venv\Scripts\python.exe -m west flash -d build\mpu6050_demo
```

## 预期现象与串口日志

烧录后打开串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：板载绿色 LED（`PC22`）每秒翻转一次；
2. **平放静止测试**：将开发板平放在桌面静止不动时，Z 轴加速度应接近重力加速度 `9.8 m/s²`（日志以千分之一为刻度，约在 `9815` 上下），三轴角速度接近 `0`；
3. **倾斜与旋转测试**：晃动或倾斜开发板，可立即在下一秒的日志中看到三轴加速度和角速度数值明显变化；
4. **串口日志示例**：

```text
MPU6050 demo: coreboard + 6-axis motion sensor
SDRAM quick check PASSED (32 MiB)
sensor: mpu6050@68 ready
Init complete. LED blinking, sampling every second.
accel[m/s^2 e-3]: 1234 -567 9815 | gyro[rad/s e-3]: -12 34 -5 | temp[mC]: 36420
```

> 注：`temp[mC]` 为毫摄氏度，如 `36420` 表示约 `36.42 ℃`（芯片内部结温，略高于室温属正常现象）。

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 报错 `ERROR: mpu6050 device not ready: mpu6050@68` | 1. 确认模块插紧在 **M11** 且方向正确；<br/>2. 确认模块的 `AD0` 引脚默认接低电平（对应地址 `0x68`；若自购模块将 AD0 上拉，则地址为 `0x69`） |
| 串口中途打印 `ERROR: sample fetch failed` | I2C 总线受到拔插抖动或接触不良，断电重新插紧模块后复位运行 |
| Z 轴数值非 +9800 而是约 -9800 或出现在 X/Y 轴 | 属于模块在底板上的芯片丝印安装朝向差异，只需观察平放时某一轴接近 `±9800` 即可验证加速度计工作正常 |

---

[上一课：HC-SR04 超声波测距](../p1-06-HC-SR04超声波测距/README.md) · [下一课：光敏电阻亮度采集](../p1-08-光敏电阻亮度采集/README.md) · [课程目录](../README.md)
