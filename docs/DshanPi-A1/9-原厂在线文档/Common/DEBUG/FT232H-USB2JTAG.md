---
sidebar_position: 1
---

# FT232H USB2JTAG

## 前言

概述

本文主要介绍 Rockchip FT232H USB 转 JTAG 小板的使用

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| all |  |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 洪慧斌 | 2020-06-03 | 初始版本 |
| V2.0.0 | 洪慧斌 | 2021-06-10 | 修改原有章节，并增加Jlink使用说明 |

## 1. FT232H芯片

FT232H 是“Future Technology Devices International Ltd”的一款芯片，USB 转各种接口，这里主要使用USB 转 JTAG/SWD 功能。



2. Rockchip FT232H 小板



FT232H 小板：

LED 指示灯，LED1：电源指示灯；LED2: 灭：未连接，闪：连接；LED3：暂时未定义；

USB 接口：有 TYPEC 接口和 mini USB 接口两种

ARM 20PIN JTAG 接口

拨码开关

SWD 模式， 1、3、5 off，2、4、6 on

JTAG 模式， 1、3、5 on，2、4、6 off

排针，VCC、TCS、TCK、GND，可以和板子飞线连接

排针，3.3V 、VCCIO、1.8V，可以用跳冒连接VCCIO到3.3V或1.8V，这个一定要接，不然JTAG通讯会失败

## 3. 驱动安装

### 3.1 Windows 驱动替换

不同的软件在使用 FT232H 时，驱动是不一样的，那么就需要根据需求来修改 FT232H 的 USB 驱动。以下以 OpenOCD 使用 FT232H 为例：

#### 3.1.1 运行 RK\tools\zadig-2.5.exe

点击Options，选择List All Devices



#### 3.1.2 将 FT232H 默认驱动改为 WinUSB 驱动

1 选择Single RS232-HS这个设备

3 确认USB ID是0403 6014

4 选择WinUSB驱动

5 安装驱动



#### 3.1.3 安装成功





#### 3.1.4 用openocd测试驱动是否安装成功

表示没插入JTAG适配器

C:\Users\hhb&gt;

### 选择命令提示符

C:\Users\hhb&gt;F:\software\0PENOCD\Windows境\openocd\_ec1ipse\RK\Open0CD\bin\openocd. exe -r rk3568 Open 0n-Chip Debugger 0.10.0+dev-01525-g642e7fbbc-dirty (2021-05-25-15:44) Licensed under GNU GPL v2 执行该命令



说明：安装时，请保持设备插入状态，如果安装成功后无法使用，请重新拔插。  

注意：安装完WinUSB驱动后，想要用FT\_Prog.exe来配置的话，需要在设备管理器里将该设备的驱动卸载。

## 4. Windows 环境下配置 FT232H EEPROM 信息（可选）

### 4.1 安装 EEPROM 编程工具 FT\_Prog\_v3.8.128.448 Installer.exe

解压 openocd\_eclipse.zip，安装 RK\tools\FTDI\FT\_Prog\_v3.8.128.448 Installer.exe或者网络下载：

https://www.ftdichip.com/Support/Utilities.htm#FT\_PROG

### 4.2 运行 FT\_Prog.exe


| FTDI - FT Prog - Device: 0 [Loc ID:0x1631] |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| EEPROM | 4W FLASH ROM |  |  |  |  |  |
|  | FILE | EVICES HELP |  |  |  |  |
|  |  | Scan and Parse F5 |  | Property Value |  |  |
| Device 主 → | Ctrl+P Program Device: 0 [Loc ID:0x1631] 1 ⇒FTEEPROM |  |  |  |  |  |
| Chip Details → USB Device Descriptor +→ USB Config Descriptor +→ USB String Descriptors +→Hardware Specific | Vendor ID: 0x0403 Product ID: 0x6014 Product Desc: &#x27;USB &lt;-&gt; Serial Converter Serial Number: FT5IX2N5 Manufacturer Desc: &#x27;FTDI&#x27; Location ID: 0x1631 EEPROM Type: 93C56 EEPROM |  |  |  |  |  |
|  |  |  |  |  |  |  |
| Property FTDI Device |  |  |  |  |  |  |
| The connected FTDI device, the treeview gives a representation of the EEPROM contents. Expand for more detail. |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| Device: 0 [Loc ID:0xl631] |  |  |  |  |  |  |
| 0000: 0000 0403 6014 0900 3280 0008 0011 0AA0 0008: 32AA 12DC 0000 0000 0000 0000 0000 0056 0010: 0000 0000 0000 0000 0000 0000 0018: 0000 0000 0000 0000 0000 0000 0020: 0000 0000 0000 0000 0000 0000 0000 0028: 0000 0000 0000 0000 0000 0000 Ready | 0000 0000 0000 0000 0000 0000 0000 |  |  |  |  |  |

1 点击 DEVICES 菜单

2 扫描设备

### 4.3 配置驱动属性

3 扫描结果


| FTDI - FT Prog - Device: 0 [Loc ID:0x1631] |  |  |  |
| --- | --- | --- | --- |
| w EEPROM FLASH ROM FILE DEVICES HELP |  |  |  |
| 3 0 |  |  |  |
| Device Tree Device: 0 [Loc ID:0x1631] →FTEEPROM | Property Value D2XX Direct Vitual COM Port |  |  |
| +→Chip Details +→ USB Device Descriptor +→ USB Config Descriptor +→ USB String Descriptors →Hardware Specific →Suspend ACBus7 →Port A +→Hardware 3 +→ Driver |  |  |  |
| +→FT1248 Settings +→IO Controls +→IO Pins | Property Virtual COM Port/ D2XX |  |  |
| by selecting Virtual COM Port or D2XX Direct option. | The driver that is installed and used by each channel can be set |  |  |
| Device Output Device: 0 [Loc ID:0xl631] |  |  |  |
| Word MSB 0000: 0000 0403 6014 0900 3280 0008 0011 0AA0 0008: 32AA 12DC 0000 0000 0000 0000 0000 0056 |  |  |  |
| 0010: 0000 0000 0000 0000 0000 0000 0000 0000 0018: 0000 0000 0000 0000 0000 0000 0000 0000 0020: 0000 0000 0000 0000 0000 0000 0000 0000 |  |  |  |
| 0028: 0000 0000 0000 0000 0000 0000 0000 0000 |  |  |  |
| Ready |  |  |  |

1 点击并打开 Hardware Specific

2 点击并打开 Port A

3 选中 Driver

4 选择 D2XX Direct

### 4.4 配置 JTAG/SWD 驱动强度



1 点开 IO Pins

2 选中 Group AD

### 4.5 开始编程

3 Drive 选择 8mA，这可以改善 TCK 30MHz 波形



## 5. Windows上Jlink适用OpenOCD









注意：如果其他软件要用JLink需要回退WinUSB驱动。
