---
title: 认识实验套件
---

import KitExplorer from '@site/src/components/KitExplorer';

# 认识实验套件

开始一期**外设模块快速体验**前，先确认 **DshanMCU-HPM6E70 实验套件** 底板上的 **13 路外设插座（`M1`–`M13`）** 与中央 **HPM6E70 核心板** 的位置、供电、信号引脚及共用引脚关系。本阶段直接下载预编译固件压缩包（解压得 `.hex` 镜像）配合 `DshanPI USBToolBox` 上位机烧录体验，无需搭建编译环境或输入命令行。

<KitExplorer mode="explorer" />

## 引脚复用与互斥插拔总表

由于底板将多种传感器集中引出至同一颗 HPM6E70 核心板，少数插座共用了相同的 MCU 引脚。在对应实验切换模块时，只需拔除冲突模块即可，无需拆装核心板：

| 本课使用插座 | 冲突插座 | 共用引脚 | 处理方式 |
| --- | --- | --- | --- |
| **M4** 红外发射 | **M9** 蜂鸣器 | `PF26 (PWM3_P_2)` | 做第 11 课（红外通信）前拔掉 M9；做第 3 课（蜂鸣器）前拔掉 M4 |
| **M2** DS18B20 | **M10** DHT11 | `PC06 (单总线)` | 做第 5 课（DS18B20）前拔掉 M10；做第 4 课（DHT11）前拔掉 M2 |
| **M6** HC-SR04 超声波 | **M12** W25Q64 Flash | `PB05 (Trig / SPI5_CS)` | **单向输入共线（非强冲突）**：两边外设在 `PB05` 上均为高阻输入；第 6 课保留 M12 可正常测距，第 12~14 课建议顺手拔掉 M6 以免片选翻转连带触发超声波耗电 |
| **M1** OLED 双色屏 | **M11** MPU6050 | `PF12/PF13 (I2C1)` | **无冲突**（从机地址分别为 `0x3C` 与 `0x68`，可同时插在底板上联动使用） |

:::tip[建议将 M1 OLED 常驻插在底板上]
**M1（0.96 寸 OLED）与底板所有其他外设插座均无引脚冲突**：第 1 课插上点亮后即可**全程保留在底板上**，后续第 4～14 课的体验固件都会自动驱动该屏幕实时显示传感器数值、状态徽章与进度条（如果未插 M1 屏幕，固件也会自动平滑降级为仅串口输出，不会卡死）。另外，底板右下内圈预留的电机驱动接口未纳入一期 14 节体验。
:::

## 预编译体验固件下载（14 课汇总）

下表列出全套 14 节快速体验所需的固件压缩包，也可一次性打包下载全套固件合集 [`00_hpm6e70_firmware_all.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/00_hpm6e70_firmware_all.zip)（或打开[预编译固件下载目录](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/)统一获取）；如果你希望查看源码并使用 `west build` / `west flash` 开发调试，可从右侧链接进入对应的二期开发章节。

| 课次 | 模块与插座 | 直接下载固件压缩包（`.zip`，内含 `.hex`） | 开发者源码章节（二期） |
| --- | --- | --- | --- |
| 第 1 课 | OLED 双色屏（M1） | [`03_oled_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/03_oled_demo.zip) | [源码与开发](../p2-12-OLED双色屏显示开发/README.md) |
| 第 2 课 | RGB 全彩 LED（M3） | [`01_rgb_led_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/01_rgb_led_demo.zip) | [源码与开发](../p2-13-RGB全彩LED调色开发/README.md) |
| 第 3 课 | 有源/无源蜂鸣器（M9） | [`02_buzzer_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/02_buzzer_demo.zip) | [源码与开发](../p2-14-有源无源蜂鸣器开发/README.md) |
| 第 4 课 | DHT11 温湿度（M10，支持 M1 OLED 联动） | [`04_dht11_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/04_dht11_demo.zip) | [源码与开发](../p2-15-DHT11温湿度采集开发/README.md) |
| 第 5 课 | DS18B20 测温（M2，支持 M1 OLED 联动） | [`05_ds18b20_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/05_ds18b20_demo.zip) | [源码与开发](../p2-16-DS18B20单总线测温开发/README.md) |
| 第 6 课 | HC-SR04 超声波测距（M6，支持 M1 OLED 联动） | [`06_hc_sr04_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/06_hc_sr04_demo.zip) | [源码与开发](../p2-17-HC-SR04超声波测距开发/README.md) |
| 第 7 课 | MPU6050 六轴姿态（M11，支持 M1 水平仪联动） | [`07_mpu6050_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/07_mpu6050_demo.zip) | [源码与开发](../p2-18-MPU6050六轴姿态采集开发/README.md) |
| 第 8 课 | 光敏电阻亮度（M7，支持 M1 OLED 联动） | [`08_light_sensor_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/08_light_sensor_demo.zip) | [源码与开发](../p2-19-光敏电阻亮度采集开发/README.md) |
| 第 9 课 | EC11 旋转编码器与按键（M13，支持 M1 OLED 联动） | [`09_rotary_encoder_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/09_rotary_encoder_demo.zip) | [源码与开发](../p2-20-旋转编码器与按键开发/README.md) |
| 第 10 课 | 红外对管避障（M5，支持 M1 OLED 联动） | [`10_ir_obstacle_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/10_ir_obstacle_demo.zip) | [源码与开发](../p2-21-红外对管避障检测开发/README.md) |
| 第 11 课 | 红外发射与接收通信（M4 + M8，支持 M1 OLED 联动） | [`11_ir_tx_rx_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/11_ir_tx_rx_demo.zip) | [源码与开发](../p2-22-红外发射与接收通信开发/README.md) |
| 第 12 课 | W25Q64 Flash 轮询读写（M12，支持 M1 OLED 联动） | [`12_w25q64_polling_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/12_w25q64_polling_demo.zip) | [源码与开发](../p2-23-W25Q64轮询读写开发/README.md) |
| 第 13 课 | W25Q64 Flash 中断读写（M12，支持 M1 OLED 联动） | [`13_w25q64_interrupt_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/13_w25q64_interrupt_demo.zip) | [源码与开发](../p2-24-W25Q64中断读写开发/README.md) |
| 第 14 课 | W25Q64 Flash DMA 读写（M12，支持 M1 OLED 联动） | [`14_w25q64_dma_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/14_w25q64_dma_demo.zip) | [源码与开发](../p2-25-W25Q64-DMA读写开发/README.md) |

> 提示：下载 `.zip` 压缩包后请**先解压出里面的 `.hex` 文件**，再在 `DshanPI USBToolBox` 中导入该 `.hex` 文件烧录（不要直接选择未解压的 `.zip`）。

## 使用 USBToolBox 图形化烧录方式

一期全部快速体验统一使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录 `.hex` 固件，按图中的 `①`～`⑥` 顺序操作即可：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](./images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已插好 USB，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧菜单点击 **`JTAG/SWD 工具`**，顶部保留在 **`固件烧录`**；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 选择体验固件**：点击 **`选择文件`**，导入对应课程解压得到的 `.hex` 文件（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并开始烧录**：可先点 **`检测连接`**（底部日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动启动运行。

---

[上一篇：烧录第一个闪灯程序](../start-03-烧录第一个闪灯程序/README.md) · [下一课：OLED 双色屏显示](../p1-01-OLED双色屏显示/README.md) · [课程目录](../README.md)
