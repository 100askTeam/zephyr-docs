---
title: 第 7 课：MPU6050 六轴姿态采集
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 7 课：MPU6050 六轴姿态采集

本课下载预编译固件 [`07_mpu6050_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/07_mpu6050_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M11** 插座上的 MPU6050 六轴加速度、角速度与片内温度采集。

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

:::tip[与 M1 OLED 共插共用 I2C1，解锁 2D 电子水平仪联动]
M11（MPU6050，`0x68`）与第 1 课的 M1（OLED，`0x3C`）共用 I2C1 总线但地址不同，**可以同时插在底板上互不冲突**。本课固件以 5 Hz 频率实时在 M1 屏幕上绘制三轴数值与 2D 电子水平仪方框；如果未插 M1 屏幕，会自动降级为仅串口输出。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`07_mpu6050_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/07_mpu6050_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `07_mpu6050_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 18 课：MPU6050 六轴姿态采集开发](../p2-18-MPU6050六轴姿态采集开发/README.md)**。

## 预期现象与串口日志

烧录后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **M1 OLED 2D 电子水平仪（5 Hz）**：顶部黄区显示 `M11 MPU6050`，底部蓝区左侧实时刷新 `AX/AY/AZ` 三轴加速度与芯片温度 / Z 轴角速度，右侧 **2D 十字靶框电子水平仪** 内的亮块会随底板前后左右倾斜实时移动；
2. **核心板心跳灯**：板载绿色 LED（`PC22`）每秒翻转一次；
3. **平放静止测试**：将开发板平放在桌面静止不动时，Z 轴加速度应接近重力加速度 `9.8 m/s²`（日志以千分之一为刻度，约在 `9815` 上下），水平仪亮块停在中心小方框附近；
4. **倾斜与旋转测试**：晃动或倾斜开发板，可立即在 OLED 水平仪和每秒一次的串口日志中看到三轴数值与倾角响应；
5. **串口日志示例**：

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
