---
sidebar_position: 1
---

# Rockchip USB SQ 测试指南

## 前言

## 概述

本文档提供 Rockchip 平台 USB 2.0/3.0 信号完整性测试的方法。

本文档提供的测试方法适用于 Agilent、Tektronix、LeCroy 示波器和 USB 测试夹具。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| 所有芯片(包括29系列、30系列、31系列、32系列、33系列、35系列、PX系列、 RV系列、Sofia、MCU) | 所有内核 版本 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

硬件工程师

软件工程师

技术支持工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0 | 吴良峰 | 2017-12-12 | 初始版本 |
| V1.1 | 吴良峰 | 2018-03-07 | 增加 rk3399 Type-C 反面测试命令 |
| V1.2 | 吴良峰 | 2018-03-30 | 增加 RK3229/RK3326/PX30测试命令 |
| V1.3 | 吴良峰 | 2018-05-21 | 修正 USB3.0 测试方法 |
| V1.4 | 吴良峰 | 2019-01-09 | 使用 markdownlint 修订格式 |
| V1.5 | 吴良峰 | 2019-01-15 | 增加RK1808测试命令、修正文档缩进、修正USB3.0测试命令 |
| V1.6 | 吴良峰 | 2019-06-26 | 增加无法进入 Compliance Test 的解决方法 |
| V1.6.1 | 吴良峰 | 2019-10-21 | 增加 RK2108/RK2206 测试命令 |
| V1.6.2 | 吴良峰 | 2020-02-19 | 增加免责声明，商标声明以及版权声明 |
| V1.6.3 | 任家宁 | 2020-12-08 | 增加 RK3566/RK3568 测试命令 |
| V1.7.0 | 王明成 | 2020-12-16 | 增加 RK625 测试命令 |
| V1.8.0 | 吴良峰 | 2021-12-22 | 增加 RK3588/RK3588S/RK3308B-S/RK3308H-S/PX30S/RK3326S 测试命令，增加 RK3588 USB 3.1 测试注意事项 |
| V1.9.0 | 吴良峰 | 2022-04-16 | 增加 RV1103/RV1106 测试命令；增加 USB SQ Tool 说明及下载地址 |
| V2.0.0 | 吴良峰 | 2022-06-14 | 增加 USB 2.0 Rx 测试说明、更新 USB 3.0 测试说明、更新 USB HUB测试说明、修订表格和图片格式 |
| V2.1.0 | 吴良峰 | 2022-12-04 | 增加 RK3528 测试命令 |
| V2.2.0 | 吴良峰 | 2023-01-15 | 增加 RK3562 测试命令 |
| V2.3.0 | 吴良峰 | 2024-04-23 | 增加 RK3576/RK2118 测试命令 |
| V2.4.0 | 吴良峰 | 2024-08-06 | 增加 RK3506/RV1103B 测试命令 |

## 1. USB 2.0 Compliance Test

### 1.1 USB 2.0 一致性测试内容

USB 2.0 Tx Signal Quality 测试内容

眼图测试

信号速率

包尾宽度

交叉电压范围(用于低速和全速)

JK 抖动、KJ 抖动

连续抖动

单调性测试(用于高速)

上升下降时间

USB 2.0 Rx Receiver Sensitivity 测试内容

接收灵敏度

噪声阈值

最小 SYNC Field

### 1.2 USB 2.0 Tx 测试命令和测试工具

对于 Rockchip 平台的 USB 2.0 Device 和 USB 2.0 Host 接口，设置 USB 控制器进入 Test Packet Mode 的方法有所不同：

USB 2.0 Device，可以使用测试命令或者测试工具设置 USB 控制器进入 Test Packet Mode

USB 2.0 Host，只能使用测试命令设置 USB 控制器进入 Test Packet Mode

#### 1.2.1 USB 2.0 Device Tx 测试命令和测试工具

USB 2.0 Device SQ 测试命令

测试命令如下表 1 所示，可以通过串口或者 ADB 执行命令。

表 1 USB 2.0 Device SQ 测试命令


| 芯片名称 | DWC2_0 OTG 2.0Device | DWC3_0 OTG 2.0 device | DWC3_1 OTG 2.0 device |
| --- | --- | --- | --- |
| RK1808 | N.A | io -4 0xfd00c7040x8c000a08 | N.A |
| RK2108 | io -4 0x41300804 0x40 | N.A | N.A |
| RK2118 | io -4 0x50040804 0x40 | N.A | N.A |
| RK2206 | io -4 0x43040804 0x40 | N.A | N.A |
| RK29XXRK30XXRK31XX | io -4 0x10180804 0x40 | N.A | N.A |
| RK3228RK3229 | io -4 0x30040804 0x40 | N.A | N.A |
| RK3288RK3228HRK3328RK3368 | io -4 0xff580804 0x40 | N.A | N.A |
| RK3308RK3308B-SRK3308H-S | io -4 0xff400804 0x40 | N.A | N.A |
| RK3326RK3326SPX30PX30S | io -4 0xff300804 0x40 | N.A | N.A |
| RV1103RV1106 | N.A | io -4 0xffb0c7040x8c000a08 | N.A |
| RV1103B | N.A | io -4 0x20b0c7040x8c000a08 | N.A |
| RV1108 | io -4 0x30180804 0x40 | N.A | N.A |
| RV1126RV1109 | N.A | io -4 0xffd0c7040x8c000a08 | N.A |
| SOFIA-3GR | io -4 0xe2100804 0x40 | N.A | N.A |
| RK3366 | io -4 0xff4c0804 0x40 | io -4 0xff50c7040x8c000a08 | N.A |
| RK3399 | N.A | io -4 0xfe80c7040x8c000a08 | io -4 0xfe90c7040x8c000a08 |
| RK3506 | io -4 0xff740804 0x40 | N.A | N.A |
| RK3528 | N.A | io -4 0xfe50c7040x8c000a08 | N.A |
| RK3562 | N.A | io -4 0xfe50c7040x8c000a08 | N.A |
| RK3576 | N.A | io -4 0x2300c7040x8c000a08 | io -4 0x2340c7040x8c000a08 |
| RK3566RK3568 | N.A | io -4 0xfcc0c7040x8c000a08 | N.A |
| RK625 | io -4 0x40180804 0x40 | N.A | N.A |
| RK3588RK3588S | N.A | io -4 0xfc00c7040x8c000a08 | io -4 0xfc40c7040x8c000a08 |

### Note:

RK3506 OTG1 Device 测试命令：io -4 0xff780804 0x40

### USB 2.0 Device 测试工具

Rockchip 平台的 USB 2.0 Device SQ 测试，除了可以使用上述的测试命令外，还可以使用 USB-IF 官方组织提供的 USB HSET 测试工具，下载工具 "USBHSET for EHCI" 或者 "USBHSET for XHCI"。

下载地址如下:

USB 2.0 HOST (EHCI)：

32 bit： https://www.usb.org/document-library/usbhset-ehci-32-bi

64 bit： https://www.usb.org/document-library/usbhset-ehci-64-bit

USB 3.0 HOST (xHCI)：

32 bit： https://www.usb.org/document-library/xhsett-x32

64 bit： https://www.usb.org/document-library/xhsett-x64e

测试工具的简单使用步骤如下：

1. 将待测试的 USB device 口通过 USB 线连接到 PC

2. 打开测试工具，选择“Device”,然后点击“TEST”按钮，如下图 1 所示



1 选择测试类型



图 2 选择测试设备和测试命令  



图 3 测试波形

#### 1.2.2 USB 2.0 Host Tx 测试命令

USB 2.0 Host SQ 测试，只能使用测试命令，没有专门的测试工具。测试命令如表 2，表 3，表 4 所示，测试命令可以通过 ADB 或者串口执行。

表 2 USB 2.0 Host SQ 测试命令(a)


| 芯片名称 | DWC2_0 OTG Host 2.0 | DWC2_1 Host 2.0 | EHCI_0 Host 2.0 |
| --- | --- | --- | --- |
| RK1808 | N.A | N.A | io -4 0xffd80054 0x40000 |
| RK2118 | io -4 0x50040440 0x8000 | N.A | N.A |
| RK2206 | io -4 0x43040440 0x8000 | N.A | N.A |
| RK29XXRK30XXRK3188 | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | N.A |
| RK312X | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | io -4 0x101c0054 0x40000 |
| RK3228RK3229 | io -4 0x30040440 0x8000 | N.A | io -4 0x30080054 0x40000 |
| RK3288 | io -4 0xff580440 0x8000 | io -4 0xff540440 0x8000 | io -4 0xff500054 0x40000 |
| RK3308RK3308B-SRK3308H-S | io -4 0xff400440 0x8000 | N.A | io -4 0xff440054 0x40000 |
| RK3326RK3326S | io -4 0xff300440 0x8000 | N.A | N.A |
| PX30PX30S | io -4 0xff300440 0x8000 | N.A | io -4 0xff340054 0x40000 |
| RK3228HRK3328 | io -4 0xff580440 0x8000 | N.A | io -4 0xff5c0054 0x40000 |
| RK3366 | io -4 0xff4c0440 0x8000 | N.A | io -4 0xff480054 0x40000 |
| RK3368 | io -4 0xff580440 0x8000 | N.A | io -4 0xff500054 0x40000 |
| RV1108 | io -4 0x30180440 0x8000 | N.A | io -4 0x30140054 0x40000 |
| RV1126RV1109 | N.A | N.A | io -4 0xffe00054 0x40000 |
| SOFIA-3GR | io -4 0xe2100440 0x8000 | N.A | N.A |
| RK3399 | N.A | N.A | io -4 0xfe380054 0x40000 |
| RK3506 | io -4 0xff740440 0x8000 | io -4 0xff780440 0x8000 | N.A |
| RK3528 | N.A | N.A | io -4 0xff100054 0x40000 |
| RK3562 | N.A | N.A | io -4 0xfed00054 0x40000 |
| RK3566RK3568 | N.A | N.A | io -4 0xfd800054 0x40000 |
| RK3588RK3588S | N.A | N.A | io -4 0xfc800054 0x40000 |
| 芯片名称 | EHCI_1 Host 2.0 | EHCI_2 Host 2.0 | EHCI_HSIC Host 2.0 |
| RK3168RK3188 | N.A | N.A | io -4 0x10240054 0x40000 |
| RK3288 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3228RK3229 | io -4 0x300c0054 0x40000 | io -4 0x30100054 0x40000 | N.A |
| RK3368 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3399 | io -4 0xfe3c0054 0x40000 | N.A | io -4 0xfe340054 0x40000 |
| RK3566RK3568 | io -4 0xfd880054 0x40000 | N.A | N.A |
| RK3588RK3588S | io -4 0xfc880054 0x40000 | N.A | N.A |

表 3 USB 2.0 Host SQ 测试命令(b)

表 4 USB 2.0 Host SQ 测试命令(c)


| 芯片名称 | DWC3_0 OTG Host 2.0 | DWC3_1 OTG Host 2.0 |
| --- | --- | --- |
| RK1808 | io -4 0xfd000424 0x40000000 | N.A |
| RK3228H | io -4 0xff600424 0x40000000 | N.A |
| RK3366 | io -4 0xff500424 0x40000000 | N.A |
| RK3399 | io -4 0xfe800424 0x40000000 | io -4 0xfe900424 0x40000000 |
| RV1103RV1106 | io -4 0xffb00424 0x40000000 | N.A |
| RV1103B | io -4 0x20b00424 0x40000000 | N.A |
| RV1126RV1109 | io -4 0xffd00424 0x40000000 | N.A |
| RK3528 | io -4 0xfe500424 0x40000000 | N.A |
| RK3562 | io -4 0xfe500424 0x40000000 | N.A |
| RK3566RK3568 | io -4 0xfcc00424 0x40000000 | io -4 0xfd000424 0x40000000 |
| RK3576 | io -4 0x23000424 0x40000000 | io -4 0x23400424 0x40000000 |
| RK3588RK3588S | io -4 0xfc000424 0x40000000 | io -4 0xfc400424 0x40000000 |

### 1.3 USB 2.0 Tx 测试环境

MSO9254A 示波器，安装 USB 2.0 测试软件 N5416A

113xA 差分有源探头

E2678A 差分探头前端

E2649-66401 device 夹具和 E2649-66402 host 夹具

USB 2.0 cable

### 1.4 USB 2.0 Tx 测试步骤

1. 搭建测试环境

如果使用的是 Agilent 的测试套件，测试环境的搭建和示波器的设置方法，请参考如下的文档：

《Agilent N5416A USB 2.0 Compliance Test Option》

《Agilent USB2.0 High Speed Device SQ Test》



图 4 Agilent USB 2.0 SQ 测试环境

## 2. 设置 USB 进入测试模式[Test Packet Mode]

设置 USB 控制器进入 Test Mode 前，需要先确认 USB 已经可以正常通信。

如果测试 USB 2.0 Host 接口，不同的示波器和测试夹具，设置 USB 控制器进入测试模式的方法有所不同，下面分别对使用 Agilent 测试套件和使用 Tektronix 测试套件的设置方法做简要说明：

### 2.1 Agilent 测试套件

先将待测的 Host 口连接到测试夹具的测试接口一端，然后将高速设备（如 U 盘）连接到夹具的另一端接口，如下图 5，再执行测试命令，设置 USB 进测试模式。



图 5 Agilent USB 2.0 SQ 测试夹具连接方法

### 2.2 Tektronix 测试套件

Note：测试 USB 2.0 Host 接口，必须在 Host 口上接一个高速 USB 设备(如 U 盘)，不能接鼠标<sub>、</sub>键盘等全速或者低速的 USB 设备<sub>。</sub>

## 3. USB 自动化测试软件分析波形



图 6 USB 2.0 信号质量分析界面

### 1.5 USB 2.0 眼图分析

#### 1.5.1 USB 2.0 标准眼图分析

USB 2.0 眼图模板有两种不同的标准：近端（Near End）和远端（Far End）。在 High Speed SignalQuality 测试中，若待测 USB 的端口直接通过小于 10cm 的线缆与测试夹具相连，则采用 Near End 眼图模板。若待测的 USB 端口通过大于 10cm 的线缆与测试夹具相连，则采用 Far End 眼图模板。在Rockchip 平台的 USB 2.0 眼图测试中，为保证 USB 2.0 信号质量的可靠性，建议统一采用更为严格的Near End 眼图模块作为参考标准。图 7 和图 8 分别是使用 Near End 和 Far End 眼图模板的标准 USB 眼图。



图 7 USB 2.0 High-speed Near End SQ Eye Diagram





图 8 USB 2.0 High-speed Far End SQ Eye Diagram

#### 1.5.2 USB 2.0 眼图测试问题分析

1. 示波器无法检测到眼图测试的触发信号

## 2. 测试的眼图严重失真

测试的眼图严重失真，比如幅度失真、信号塌陷，一般是因为测试的操作方法有误。

如图 9 所示，USB 眼图的信号幅度比标准的大一倍，如果使用的是 Agilent 测试套件，一般是因为测试夹具的 D+和 D-没有挂上 50 欧的终端 SMA 电阻。

如图 10 所示，USB 眼图的信号中间有明显的塌陷，如果使用的是 Agilent 测试套件，一般是因为没有将测试夹具的开关切到 ON 档。



图 9 USB 眼图幅度失真  



图 10 USB 眼图信号塌陷失真

## 3. USB 眼图没有张开



图 11 USB 眼图没有张开

## 4. USB 眼图模糊甚至布满血丝

如图 12 所示，USB 眼图的轮廓线条模糊，说明 USB 的串扰十分严重，还可能存在阻抗不匹配、噪声干扰的问题。首先，检查 USB 的 DP 和 DM 线上是否连接了内部电容较大的 ESD 或者电子开关，如果有，可以去掉这些器件再测试。然后，检查测试使用的 USB 线缆是否存在阻抗不匹配的问题，或者换条 USB 线缆重新测试。最后，检查 USB 的 PCB 走线、USB 的 24MHz 时钟源、USBPHY 的供电电源纹波。



图 12 USB 眼图模糊

### 1.6 USB 2.0 Rx Compliance Test

#### 1.6.1 USB 2.0 Receiver Sensitivity 测试原理

根据测试规范《USB 2.0 Electrical Compliance Test Specification Version 1.07》，USB 2.0 Rx 的测试项目包括如下三项：

EL\_16 Receiver Sensitivity Test @ Squelch

EL\_17 Receiver Sensitivity Test

EL\_18 Receiver Sensitivity Test - Minimum SYNC Field

测试原理：

EL\_16 从高幅值往低幅值扫，如果信号发生器低于 100mv，DUT还有反馈说明接收太灵敏，fail。

EL\_17 从低幅值往高幅值扫，如果信号发生器高于 200mv，DUT还未有稳定的反馈说明接收太迟钝，fail。

Note：

EL\_17 的指标，USB Spec 最早规定是150mv，后面 ECN 更改为 200mv

根据测试规范，信号发生器模拟 USB HOST 的行为，所以 DUT 只能是 Device 或者 HUB Upstreamport，HOST 不支持接收灵敏度测试

NAK packet的码型是固定的：32bit sync 包头（31bit “0” + 1bit“1”） + 8bit （10100101）NAK PID编码

#### 1.6.2 USB 2.0 Rx 测试命令

表 5 USB 2.0 Test SE0\_NAK 命令


| 芯片名称 | USB 2.0 Test SE0_NAK 命令 |
| --- | --- |
| RK1808 | io -4 0xfd00c704 0x8c000a06 |
| RK2108 | io -4 0x41300804 0x30 |
| RK2206 | io -4 0x43040804 0x30 |
| RK29XX |  |
| RK30XX | io -4 0x10180804 0x30 |
| RK31XX |  |
| RK3228 | io -4 0x30040804 0x30 |
| RK3229 |  |
| RK3288 |  |
| RK3228H | io -4 0xff580804 0x30 |
| RK3328 |  |
| RK3368 |  |
| RK3308 |  |
| RK3308B-S | io -4 0xff400804 0x30 |
| RK3308H-S |  |
| RK3326 |  |
| RK3326S |  |
| PX30 | io -4 0xff300804 0x30 |
| PX30S |  |
| RV1103 |  |
| RV1106 | io -4 0xffb0c704 0x8c000a06 |
| RV1108 | io -4 0x30180804 0x30 |
| RV1126 | io -4 0xffd0c704 0x8c000a06 |
| RV1109 |  |
| RK3399 | io -4 0xfe80c704 0x8c000a06 |
| RK3566 RK3568 | io -4 0xfcc0c704 0x8c000a06 |
| RK625 | io -4 0x40180804 0x30 |
| RK3588 |  |
| RK3588S | io -4 0xfc00c704 0x8c000a06 |

#### 1.6.3 USB 2.0 Rx 测试方法

测试时，需要先将 DUT 通过测试夹具连接到 PC Host，避免 USB Device PHY 进入 suspend mode 而影响测试，再输入测试命令；

测试时，需要通过串口输入 Test SE0\_NAK 命令，让 DUT USB 控制器进入Test\_SE0\_NAK mode；

测试 EL\_18 Receiver Sensitivity Test - Minimum SYNC Field 过程中，当 Tektronix 的信号发生器在切换 32bit SYNC 为 12 bit SYNC 时，需要对调信号发生器的通道极性。

##### 1.6.3.2 USB 2.0 Rx 测试步骤

1. 按照下图 13 所示，将 DUT 通过 Device Sensitivity 夹具与 Tektronix 的信号发生器、示波器连接起来。



图 13 Tektronix USB 2.0 Rx 测试连接



图 14 Tektronix 信号发生器



图 15 USB2.0 Rx Device Sensitivity 夹具

2. 将 USB 2.0 Rx Device Sensitivity 夹具的拨码开关切换到 ON，然后连接测试夹具与 PC Host 接口

3. 查表 5 USB 2.0 Test SE0\_NAK 命令，并通过串口输入命令，使 DUT 进入 SE0\_NAK mode

4. 将 USB 2.0 Rx Device Sensitivity 夹具的拨码开关切换到 OFF

5. 设置 Tektronix 信号发生器输出测试码型，按照测试流程依次完成 EL\_16/EL\_17/EL\_18 测试项

##### 1.6.3.3 USB 2.0 Rx 测试结果分析

如下图 16 所示，Tektronix 示波器实时采样并测试信号发生器发出的 IN packet 波形以及 DUT 反馈的NAK packet 波形，最后生成图所示的测试报告。



图 16 USB 2.0 Rx 测试信号



图 17 USB 2.0 Rx 测试报告

当发现测试结果 EL\_16/EL\_17 fail 时，可以尝试通过调整 USB 2.0 PHY 的 Squelch 参数来解决。具体方法请参考章节 Rockchip USB SQ Tool。

## 2. USB 2.0 HUB SQ Test

### 方法 1-命令测试

该测试方法使用的测试命令与 “USB 2.0 Host 测试命令” 一样，测试步骤如下：

确定 HUB 连接的 USB HOST 控制器，然后查表 2，表 3，表 4，找到 HOST 控制器对应的测试命令

参考 “USB 2.0 测试步骤”，完成 HUB 的所有 downstream ports 的 SQ 测试

Note：不同的 HUB downstream ports，测试命令和测试方法都是一样的<sub>。</sub>

### 方法 2-脚本测试

相比方法 1-命令测试，方法 2-脚本测试比较复杂，需要编译和运行脚本，但更具有通用性，可以测试所有类型的 HUB，包括 USB 2.0 HUB 和 HSIC HUB。

## 1. 下载并编译测试脚本

脚本源码下载地址：https://redmine.rockchip.com.cn/documents/113

文件：USB\_HUB\_Compliance\_Test\_Script

## 2. 执行测试脚本

将编译生成的可执行文件 linux-eye 拷贝到系统的 data 目录下，并执行命令

chmod 777 linux-eye

执行测试脚本 linux-eye，然后，根据脚本的提示，输入测试命令，参考如下：

[root@hari LinuxEye]# ./linuxEye   

LinuxEye - select one of the following hub for testing.   

[ 0] 4-port Full-Speed hub at tier 2 of Bus 3   

(VID: 0451, PID: 1446, Address: 3)   

[ 1] 4-port High-Speed hub at tier 2 of Bus 1   

(VID: 1A40, PID: 0101, Address: 15)   

[ 2] 4-port High-Speed hub at tier 2 of Bus 1   

(VID: 1A40, PID: 0101, Address: 10)   

[ 3] 7-port High-Speed hub at tier 3 of Bus 1   

(VID: 1A40, PID: 0201, Address: 50)   

Please enter [0 \~ 3] to select a hub or 'q' to quit: 2 （表示共有4个HUB， 测试   

HUB[2]）   

[ 1] is connected to Low-Speed device   

[ 2] is open   

[ 3] is connected to High-Speed device   

[ 4] is connected to Low-Speed device   

Please enter [1 \~ 4] to select a port or 'q' to quit: 2 （表示测试HUB的第2个port）   

LinuxEye - Start testing port 2 of device 10 on bus 1   

Type 'q' to stop the test: q (退出测试脚本)   

[root@hari LinuxEye]#

## 3. USB 3.0 Compliance Test



图 18 USB 3.0 总线架构

### 3.1 USB 3.0 新增测试规范

一致性校准和测试在一致性通道末端进行

一致性通道用来表征测试 TX 和 RX 时最差的互连通道情况

Host：3 米电缆+5 英寸的走线

Device：3 米电缆+11 英寸走线

TX 测试允许使用通道嵌入,选择黄金 S 参数做嵌入测试

需要计算基于 10e-12 误码率的 DJ，RJ 和 TJ增加了 10MHz，20MHz 和 33MHz 一致性 Pj 测试频点

Device 接收端眼图幅度校准标准为 145mVp-p

Host 接收端眼图幅度标准为 180mVpp

USB 3.0 的电气性能测试分为发送信号测试(Tx)、接收容限测试(Rx Tolerance Compliance Test)以及电缆/连接器的测试。

### 3.2 USB 3.0 Tx Compliance Test

#### 3.2.1 USB 3.0 Tx 测试要求

首先，由于 USB3.0 SuperSpeed 的信号速率达到 5Gbps，同时信号的幅度更小，因此测试中需要12GHz以上带宽的示波器，同时要示波器的底噪声更低才能保证准确的测量。

其次， USB 3.0 发送端测试，不是用夹具直接连接 DUT，其定义的被测点是“一致性通道 ( ComplianceChannel)” 的末端。一致性通道模拟 PCB 走线和电缆对信号的影响。对于 HOST 的测试，它模拟的是 3m长电缆＋5 英寸 PCB 走线的影响；对于 Device 的测试，它模拟的是 3m 长电缆＋11 英寸 PCB 走线的影响。USB3.0 的测试规范里会以 S 参数文件的形式提供一致性通道的模型。在真正测试时是用测试夹具直接连接 DUT，然后用示波器的 S 参数嵌入的方式加入通道影响。如图 19 Tx 测试模型，TP1 为示波器的测试点。



图 19 USB 3.0 Tx 测试模型



Table 6-12. Normative Transmitter Eye Mask at Test Point TP1


| Signal Characteristic | Minimal | Nominal | Maximum | Units | Note |
| --- | --- | --- | --- | --- | --- |
| Eye Height | 100 |  | 1200 | mV | 2.4 |
| Dj |  |  | 0.43 | UI | 1,2,3 |
| Rj |  |  | 0.23 | UI | 1,2,3,5 |
| Tj |  |  | 0.66 | UI | 1,2,3 |

图 20 USB 3.0 Tx 测试眼图要求

Table 6-10. Transmitter Normative Electrical Parameters


| Symbol | Parameter | 5.0 GT/s | Units | Comments |
| --- | --- | --- | --- | --- |
| UI | Unit Interval | 199.94 (min)200.06 (max) | ps | The specified UI is equivalent to a tolerance of±300 ppm for each device. Period does not accountfor SSC induced variations. |
| VTX-DIFF-PP | Differential p-pTx voltage swing | 0.8 (min)1.2 (max) | v | Nominal is 1 V p-p |
| VTX-DIFF-PP-LOW | Low-PowerDifferential p-pTx voltage swing | 0.4 (min)1.2 (max) | v | Refer to Section 6.7.2. There is no de-emphasisrequirement in this mode. De-emphasis isimplementation specific for this mode. |
| VTX-DE-RATIO | Tx de-emphasis | 3.0 (min)4.0 (max) | dB | Nominal is 3.5 dB |

图 21 USB 3.0 Tx 测试电气参数要求

#### 3.2.2 USB 3.0 Tx 测试项目

LFPS(近端)

SSC(近端)

Tx(近端/远端）：眼图；Tj， Rj， Dj；幅度；



图 22 Agilent USB 3.0 Tx 测试选项

#### 3.2.3 USB 3.0 Tx 测试模式



图 23 USB 3.0 进入 Compliance Mode 的流程

#### 3.2.4 USB 3.0 Tx 测试环境

### Agilent USB 3.0 Tx 测试套件

对于 USB 3.0 Tx 信号的测试，Agilent 推荐使用 90000 系列示波器(提供高达 13GHz 的带宽)， 配上自动的一致性测试软件 U7243A 和测试夹具 U7242A 来完成 USB 3.0 规范要求的发送端测试和验证。



图 24 Agilent USB 3.0 Tx 测试环境  



图 25 Agilent USB 3.0 Tx 测试夹具 U7242



图 26 Agilent USB 3.0 Type-C 测试夹具 N7015A  

Tektronix USB 3.0 Tx 测试套件

Tektronix 的 Tx 测试连接示意图如图 27 所示，Tektronix USB 3.0 发射机测量（选项 USB-Tx）适用于DPO/MSO70000 系列示波器，提供了自动 USB 3.0 发射机解决方案。

具体测试方案请参考：



图 27 Tektronix USB 3.0 Tx 测试示意图

#### 3.2.5 USB 3.0 Device Tx 测试命令

表 6 USB 3.0 Device Tx 测试命令


| 芯片名称 | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 |
| --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc | N.A |
| RK3228HRK3328 | io -4 0xff478408 0xc | N.A |

#### 3.2.6 USB 3.0 Device Tx 测试方法

##### 3.2.6.1 USB 3.0 Device Tx 测试注意事项

测试 USB 3.0 Device Tx 时，请先查表 6，确认是否需要输入测试命令。

如果不用输入测试命令，则只要按照示波器测试软件提示的测试步骤操作，将待测试的 Device USB口连接到测试夹具，USB 3.0 控制器就会自动进入 Compliance mode。

测试 USB 3.0 Device Tx 时，VBus 5V 不能自供电<sub>，</sub>否则会导致 USB 3.0 控制器无法进入Compliance mode。

VBus 的供电需要由测试夹具 U7242A 提供，可以通过 USB 线将测试夹具的 USB 供电口与示波器或者 PC 的 USB 口连接，实现 VBus 5V 的供电。

##### 3.2.6.2 USB 3.0 Device Tx 测试步骤

1. 自动化测试软件设置



图 28 USB 3.0 Device Tx 测试软件设置界面

Note:



图 29 USB 3.0 Device Tx 测试软件中 Channel 的设置方法

## 2. 选择测试项目

勾选 All USB3 Tests，可选择全部 USB 3.0 Tx 一致性测试项目。



图 30 USB 3.0 Device Tx 测试项的设置

## 3. 配置测试条件

将 Automate Test Pattern Change 设置为 Auto，其余使用默认配置即可。



图 31 USB 3.0 Device Tx 测试条件设置

## 4. 连接示波器<sub>、</sub>夹具和待测 USB 设备

按照示波器的提示进行连接，如下图所示。VBus 5V 供电也要连接。



图 32 USB 3.0 Device Tx 测试连接示意图

## 5. 开始 Tx 测试

5.1. 测试过程中，自动化软件提示测试 LFPS 的操作方法



图 33 LFPS 测试界面  

Note：进行 LFPS 测试前，要先断开 USB3.0 夹具和被测件，然后点击“OK”，再重新连接到夹具



图 34 USB 3.0 Device Tx LFPS 参考波形  

5.2. LFPS 测试完成后，开始 SSC 测试，自动化软件提示更改示波器、夹具和被测件的连接



图 35 USB 3.0 Device Tx SSC 测试

5.3. SSC 测试完成后， 开始眼图/抖动测试，自动化软件提示更改示波器、夹具和被测件的连接。



图 36 USB 3.0 Device Tx 眼图及抖动测试

5.4. 测试完成，自动生成测试报告，查看测试报告


| Pass | #Failed | #Trials | Test Name | Worst Actual | WorstMargin | Pass Limits |
| --- | --- | --- | --- | --- | --- | --- |
|  | 0 | 2 | 5G LFPS Peak-Peak Differential OutputVoltage | 897.4 mV | 24.4 % | 800.0 mV &lt;= VALUE &lt;= 1.2000 V |
|  | 0 | 2 | 5G LFPS Period (tPeriod) | 41.6532 ns | 27.1 % | 20.0000 ns &lt;= VALUE &lt;= 100.0000 ns |
|  | 0 | 2 | 5G LFPS Burst Width (tBurst) | 939.4 ns | 42.4 % | 600,0 ns &lt;= VALUE &lt;= 1.4000 μs |
|  | 0 | 2 | 5G LFPS Repeat Time Interval (tRepeat) | 10.0303 μs | 49.6 % | 6.0000 μs &lt;= VALUE &lt;= 14.0000 μs |
|  | 0 | 2 | 5G LFPS Rise Time | 320.2 ps | 92.0 % | VALUE &lt;= 4,0000 ns |
|  | 0 | 2 | 5G LFPS Fall Time | 326.4 ps | 91.8 % | VALUE &lt;= 4.0000 ns |
|  | 0 | 2 | 5G LFPS Duly cycle | 51.3539 % | 43.2 % | 40.0000 % &lt;= VALUE &lt;= 60.0000 % |
|  | 0 | 2 | 5G LFPS AC Common Mode Vollage | 42.6 mV | 57.4 % | VALUE &lt;= 100.0 mV |
|  | 0 | 1 | 5G TSSC-Freq-Dev-Min | -5.014726kppm | 17.8 % | -5.300000 kppm &lt;= VALUE &lt;= -3.700000kppm |
|  | 0 | 1 | 5G TSSC-Freq-Dev-Max | 25,001 ppm | 45.8 % | TSSCMin ppm &lt;= VALUE &lt;= TSSCMaxppm |
|  | 0 | 1 | 5G SSC Modulation Rate | 31,500990kHz | 50.0 % | 30.000000 kHz &lt;= VALUE &lt;= 33,000000kHz |
|  | 0 | 1 | 5G SSC SJew Rate                       5.350 | ms | 46.5 % | VALUE &lt;= 10.000 ms |
|  | 0 | 1 | 5G Short Channel Random Jitter | 70 mUI | 69.6 % | VALUE &lt;= 230 mUI |
|  | 0 | 1 | 5G Short Channel Maximum DeterministicJitter | 221 mUI | 48.6 % | VALUE &lt;= 430 mUI |
|  | 0 | 1 | 5G Short Channel Tolal Jitter al BER-12 | 291 mUI | 55.9 % | VALUE &lt;= 660 mUI |
|  | 0 | 1 | 5G Short Channel Template Test | 0.000 | 100.0 %   V | ALUE = 0.000 |
|  | 0 | 1 | 5G Short Channel Differential Output Voltage | 166.3 mV | 6.0 % | 100,0 mV &lt;= VALUE &lt;= 1,2000 V |
|  | 0 | 1 | 5G Far End Random Jitter (CTLE ON)      69 | mUI | 70.0 % | VALUE &lt;= 230 mUI |
|  | 0 | 1 | 5G Far End Maximum Deterministic Jitter211(CTLE ON) | mUI | 50.9 % | VALUE &lt;= 430 mUI |
|  | 0 | 1 | 5G Far End Total Jitter at BER-12 (CTLE ON) | 280 mUI | 57.6 % | VALUE &lt;= 660 mUI |
|  | 0 | 1 | 5G Far End Template Test (CTLE ON) | 0.000 | 100.0 %   V | ALUE = 0.000 |
|  | 0 | 1 | 5G Far End Differential Output Voltage (CTLEON) | 113.7 mV | 1.2 % | 100,0 mV &lt;= VALUE &lt;= 1,2000 V |

图 37 USB 3.0 Device Tx 测试报告



图 38 USB 3.0 Device Tx LFPS Burst Width



图 39 USB 3.0 Device Tx LFPS Repeat Time Interval

Trial 1: Non-Transition Eye Diagram  





图 40 USB 3.0 Device Tx Short Channel Eye Diagram

Trial 1: Non-Transition Eye Diagram  





图 41 USB 3.0 Device Tx Far End Eye Diagram

#### 3.2.7 USB 3.0 Host Tx 测试命令

表 7 USB 3.0 Host Tx 测试命令


| 芯片名称 | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 | DWC3_2 Host 3.0 |
| --- | --- | --- | --- |
| RK1808 | io -4 0xff384008 0xcio -4 0xfd0004300x0a010340 | N.A | N.A |
| RK3228HRK3328 | io -4 0xff478408 0xcio -4 0xff6004300x0a010340 | N.A | N.A |
| RK3366 | io -4 0xff5004300x0a010340 | N.A | N.A |
| RK3399 | io -4 0xfe8004300x0a010340 | io -4 0xfe9004300x0a010340 | N.A |
| RK3528 | io -4 0xfe5004300x0a010340 | N.A | N.A |
| RK3562 | io -4 0xfe5004300x0a010340 | N.A | N.A |
| RK3566RK3568 | io -4 0xfcc004300x0a010340 | io -4 0xfd0004300x0a010340 | N.A |
| RK3576 | io -4 0x230004300x0a010340 | io -4 0x234004300x0a010340 | N.A |
| RK3588RK3588S | io -4 0xfc0004300x0a010340 | io -4 0xfc4004300x0a010340 | io -4 0xfcd004300x0a010340 |

Note：  

RK1808/RK3228H/RK3328 需要执行两条测试命令，其中第一个命令（即写 ”0xc“）是为了手动触发CP1 test pattern<sub>。</sub>一般情况下，测试时，两条命令可以同时输入，但如果出现 CP0 或 CP1 testpattern 切换异常时，请先不要执行第一个命令（即写 ”0xc“），首先，在开始测试前，输入写值“0x0a010340” 的命令，然后，在测试过程中，等待示波器弹出 CP1 pattern 测试的提示窗口时，再输入写值 “0xc” 的命令  

io 命令适用于所有芯片和内核版本

Linux-3.10/4.4 内核版本还支持通过写内核设备节点的方式，测试 RK3399 Type-C USB，具体方法请参考章节[RK3399 USB 3.0 测试问题](#RK3399 USB 3.0 测试问题)

#### 3.2.8 USB 3.0 Host Tx 测试方法

开始测试前，需要先根据待测芯片平台和 USB 接口，查表 7 的测试命令，并输入相应的测试命令，再开始测试，才能触发 USB 3.0 控制器进入 Host Tx 测试模式；

待测试的 USB 接口的 VBUS 需要对外输出 5v 供电，而测试夹具 U7242A 则不需要 5V 供电(这与Device Tx 测试恰好相反)；

测试流程中，Type-A 接口和 Type-C 接口输入测试命令的时序有所不同，具体请参考下面的测试步骤描述；

##### 3.2.8.2 USB 3.0 Host Tx 测试步骤

2. 先将测试夹具的一端连接到示波器，测试夹具的另外一端暂时不要连接到待测设备的 USB 3.0Host 接口；

3. 设置示波器进入 USB 3.0 的 LFPS 测试项，示波器会提示断开测试夹具与待测的 USB 3.0 Host 接口的连接；

4. 根据待测芯片平台和 USB 接口，查表 7 USB 3.0 Host Tx 测试命令；

5. 如果测试的 USB 接口为 Type-A，则先输入步骤 4 的测试命令，再连接测试夹具与待测的 USB 3.0接口；

如果测试的 USB 接口为 Type-C，则先连接 Type-C 测试夹具与待测的 USB 3.0 接口，等 USB 驱动软件自动切换到 Host mode (等待 2\~3 秒)，再输入步骤 4 的测试命令；

6. 连接测试夹具与待测试的 USB 3.0 Host port，则 USB 3.0 控制器会自动进入测试模式；

7. 根据示波器的操作提示，完成所有的测试项；

#### 3.2.9 USB 3.0 Tx Compliance mode 查询

### Device Tx Compliance mode 查询方法

cat /sys/kernel/debug/usb/xxxx/link_state （"xxxx" 表示待测试的 usb 控制器的节点名称，根据实测平台填写）

返回值为：Compliance，表示已进入 Device Tx 测试模式

Host Tx Compliance mode 查询方法

(1) Linux-4.19 及更早的内核版本

比如，RK3399 USB 3.0 Host0 的 PORTSC 寄存器地址为 0xfe800430 , USB 3.0 Host1 的 PORTSC 寄存器地址为 0xfe900430。

(2) Linux-5.10 及更新的内核版本



图 42 USB 3.0 进入 Loopback mode 的流程

Linux-5.10 及更新的内核版本提供了portsc节点，可以更加方便直观地查询 Host Tx Compliancemode 的状态，节点路径如下：

cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc （"xxxx" 表示待测试的 xHCI

控制器的节点名称，根据实测平台填写）

返回值为：Link:Compliance mode，表示已进入 Host Tx 测试模式

### 3.3 USB 3.0 Rx Compliance Test

本文档只简单说明进入 Loopback mode 的原理，以及确认进入 Loopback mode 的方法。

#### 3.3.1 USB 3.0 Rx 测试方法

进入 Loopback mode 的流程

USB 3.0 控制器在 link training 的 Polling.Configuration 阶段，如果检测到测试仪器发送的 T2 pattern 中Loopback bit 位，就会自动配置 USB 3.0 PHY 进入 Loopback mode。如下图 42 所示。

Receiver Jitter Tolerance Test

接收抖动容忍度测试的方法，请参考文档 Electrical Compliance Test Specification for SuperSpeed USB Rev. 1.0a

TD.1.5 Receiver Jitter Tolerance Test 章节详细说明了接收抖动容忍度的测试步骤。

#### 3.3.2 USB 3.0 Rx Loopback mode 查询

Device Rx Loopback mode 查询方法

cat /sys/kernel/debug/usb/xxxx/link_state （"xxxx" 表示待测试的 usb 控制器的节点名

称，根据实测平台填写）

返回值为：Loopback，表示已进入 Device Rx 测试模式

Host Rx Loopback mode 查询方法

### (1) Linux-4.19 及更早的内核版本

通过 io 命令读 USB 3.0 xHCI 控制器的寄存器 PORTSC，bit[8:5] Port Link State (PLS) ，如果PORTSC.PLS = 11(十进制)，则表示已经处于 Loopback mode。不同芯片，PORTSC 寄存器的基地址可能不同，请查芯片的 TRM，寄存器的偏移地址固定为 0x430。

比如，RK3399 USB 3.0 Host0 的 PORTSC 寄存器地址为 0xfe800430 , USB 3.0 Host1 的 PORTSC 寄存器地址为 0xfe900430。

### (2) Linux-5.10 及更新的内核版本

Linux-5.10 及更新的内核版本提供了portsc节点，可以更加方便直观地查询 Host Rx Loopback mode的状态，节点路径如下：

cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc （"xxxx" 表示待测试的 xHCI控制器的节点名称，根据实测平台填写）

返回值为：Link:Test mode，表示已进入 Host Rx 测试模式

### 3.4 USB 3.0 Compliance Test 常见问题及解决方法

#### 3.4.1 USB 3.0 Device Tx 无法进入测试模式的问题

正常情况下，USB 3.0 Device 不需要输入测试命令，就可以自动进入 Tx 测试模式。如果无法进入测试模式，建议先测试 VBUS 的电压。按照 USB 3.0 Device Tx Compliance test 的规范，USB 3.0 Device 的VBUS 5V 不能自供电，否则会导致 USB 3.0 控制器无法自动进入 Compliance mode。VBUS 的供电必须由测试夹具提供，可以通过 USB 线将测试夹具的 USB 供电口与示波器或者 PC 的 USB 口连接，实现VBUS 5V 的供电。

#### 3.4.2 RK3399 USB 3.0 测试问题

1. RK3399 Type-A USB 3.0 Host 无法进入 Tx 测试模式

测试 RK3399 Type-A USB 3.0 Host 时，需要增加一个步骤，即在测试前，先将 USB 3.0 Disk 插入待测试的 USB 3.0 接口，详细操作见USB 3.0 Host Tx 测试方法 —— USB 3.0 Host Tx 测试注意事项，否则，Type-A USB 3.0 可能无法进入测试模式。  

除了上述方法，还可以通过修改软件解决。具体方法是，删除 DTS 中 usbdrd\_dwc3\_0 和  

usbdrd\_dwc3\_1 节点的如下属性：  

snps,usb3-warm-reset-on-resume-quirk

## 2. RK3399 Type-C USB 3.0 Host 无法进入 Tx 测试模式

正常情况，RK3399 Type-C USB 3.0 Host 只要参考USB 3.0 Host Tx 测试方法，就可以进入 Tx 测试模式。如果无法进入 Tx 测试模式，建议先测试 VBus 的电压，如果 VBus 为常供电，可能会导致无法进入 Tx 测试模式。有两种解决方法：

方法 1：将 VBus 供电配置为软件可控的方式，也即默认不输出 5V，当插入 Type-C 转 Type-A 线时，才输出 5V；

方法 2：将 DTS 对应的 dr\_mode 属性配置为"host"；

## 3. RK3399 Type-A USB 3.0 Host 无法进入 Rx Loopback mode

4. RK3399 平台 Linux-3.10/4.4 内核的 USB 3.0 Host Tx 测试方法

注：仅适用于 RK3399 芯片

1. RK3399 平台 Linux-3.10/早期 Linux-4.4 版本

Type-C0 USB 正面：

```shell
echo test_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
```

Type-C0 USB 反面：

```
echo test_flip_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
```

Type-C1 USB 正面：

```shell
echo test_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
```

Type-C1 USB 反面：

```
echo test_flip_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
```

## 2. RK3399 平台最新 Linux-4.4 版本

Type-C0 USB 正面：

```shell
echo test_u3 > /sys/devices/platform/usb0/host_testmode
```

Type-C0 USB 反面：

```shell
echo test_flip_u3 > /sys/devices/platform/usb0/host_testmode
```

Type-C1 USB 正面：

```shell
echo test_u3 > /sys/devices/platform/usb1/host_testmode
```

Type-C1 USB 反面：

```shell
echo test_flip_u3 > /sys/devices/platform/usb1/host_testmode
```

可以执行如下的命令，查看 USB 是否进入测试模式：

cat /sys/kernel/debug/usb3 控制器节点/host_testmode

返回的结果如下：

U2: test\_packet // means that U2 in test mode

U3: compliance mode // means that U3 in test mode

(如果返回的是 U3: UNKNOWN， 表示 USB 没有进入测试模式)

#### 3.4.3 RK1808 USB 3.0 测试问题

## 1. RK1808 Type-A USB 3.0 Host 无法进入 Rx Loopback mode

通过修改软件，disable hub autosuspend 功能，修改参考如下：

```diff
diff --git a/drivers/usb/core/usb.c b/drivers/usb/core/usb.c
index 36e5098..0b2930d 100644
--- a/drivers/usb/core/usb.c
+++ b/drivers/usb/core/usb.c
@@ -66,7 +66,7 @@ int usb_disabled(void)
EXPORT_SYMBOL_GPL(usb_disabled);
#ifdef CONFIG_PM
-static int usb_autosuspend_delay = 2; /* Default delay value,
+static int usb_autosuspend_delay = -1; /* Default delay value,
```

#### 3.4.4 RK3588 USB 3.0 测试问题

RK3588 USB 3.0 的 Tx/Rx 测试，基于 Linux-5.10 内核，注意点如下：

1. 测试 Type-C0 接口的 USB 3.0 Device mode 时，需要先关闭控制器的 autosuspend 功能，命令如下：

```
echo on > /sys/devices/platform/usbdrd3_0/fc000000.usb/power/control
```

2. 测试 Type-C 接口的 USB 3.0 Host mode 时，需要先连接 Type-C 测试夹具与待测的 USB 3.0 接口，等 USB 驱动软件自动切换到 Host mode (等待 2\~3 秒)，，再输入表 7 的 Host 测试命令。

3. 测试 USB 3.0 Rx 功能时，如果无法自动进入 loopback mode，需要修改 DTS 的 DWC3 控制器配置，增加

```csv
snps,dis_u3_susphy_quirk;
```

4. 确认 Type-C0 USB 3.0 Device mode Tx 进入测试模式的方法

cat /sys/kernel/debug/usb/fc000000.usb/link_state

返回值为：Compliance，表示已进入 Device Tx 测试模式

5. 确认 Type-C0 USB 3.0 Device mode Rx 进入测试模式的方法

cat /sys/kernel/debug/usb/fc000000.usb/link_state

返回值为：Loopback，表示已进入 Device Rx 测试模式

6. 确认 USB 3.0 Host mode Tx 进入测试模式的方法

以 Type-C1 USB 3.0 Host 为例：

cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc

返回值为：Link:Compliance mode，表示已进入 Host Tx 测试模式

7. 确认 USB 3.0 Host mode Rx 进入测试模式的方法

以 Type-C1 USB 3.0 Host 为例：

cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc

返回值为：Link:Test mode，表示已进入 Host Rx 测试模式

## 4. USB 3.0 HUB Compliance Test

USB3.0 HUB 的 Compliance test 包括了 upstream ports 和 downstream ports，但实际应用中，我们一般只需测试提供给用户使用的 downstream ports。因此，本文档只提供了测试 USB3.0 HUB downstream ports 的Compliance test 测试方法。

常见的 USB3.0 HUB 芯片型号主要有：GL352x 系列、VL812、VL813、USB5734、RTS5411、CYPRESSHX3 系列等。与 USB2.0 HUB 的测试方法不同，Rockchip 平台的 USB3.0 HUB Compliance Test 只能使用脚本测试方法。

1. 下载并编译测试脚本：

脚本源码下载地址：https://redmine.rockchip.com.cn/documents/113

文件：USB\_HUB\_Compliance\_Test\_Script

2. 执行测试脚本：

以 RK3399 平台测试 GL3523 HUB 为例，测试步骤如下：

(1) 使用adb push 脚本到Android系统

```batch
adb push C:\Users\user\Desktop\linux-eye /data
```

(2) 修改 linux-eye 的权限

root@rk3399:/data # chmod 777 linux-eye

(3) 执行脚本，设置 USB3 HUB port 进入测试模式

(3.1) 根据 kernel log 确定待测试的 USB3.0 HUB 信息

139.427845] usb 6-1: new SuperSpeed USB device number 2 using xhci-hcd   

[ 139.445641] usb 6-1: New USB device found, idVendor=05e3, idProduct=0612   

[ 139.445708] usb 6-1: New USB device strings: Mfr=1, Product=2,   

SerialNumber=0   

139.445738] usb 6-1: Product: USB3.0 Hub   

139.445763] usb 6-1: Manufacturer: GenesysLogic   

[ 139.452409] usb 5-1: new high-speed USB device number 2 using xhci-hcd   

[ 139.463572] hub 6-1:1.0: USB hub found   

[ 139.465861] hub 6-1:1.0: 4 ports detected   

[ 139.589854] usb 5-1: New USB device found, idVendor=05e3, idProduct=0610   

[ 139.589920] usb 5-1: New USB device strings: Mfr=1, Product=2,   

SerialNumber=0   

[ 139.589950] usb 5-1: Product: USB2.0 Hub   

[ 139.589975] usb 5-1: Manufacturer: GenesysLogic   

[ 139.607244] hub 5-1:1.0: USB hub found   

[ 139.609146] hub 5-1:1.0: 4 ports detected

### (3.2) 执行测试脚本

root@rk3399:/ # ./data/linux-eye   

LinuxEye - select one of the following hub for testing.   

[ 0] 4-port Super-Speed hub at tier 2 of Bus 6   

(VID: 05E3, PID: 0612, Address: 2)   

[ 1] 4-port High-Speed hub at tier 2 of Bus 5   

(VID: 05E3, PID: 0610, Address: 2)   

Please enter [0 \~ 1] to select a hub or 'q' to quit: 0 （输入0，表示测试   

super-speed）   

[ 1] is open   

[ 2] is open   

[ 3] is open   

[ 4] is open   

Please enter [1 \~ 4] to select a port or 'q' to quit: 1 （输入1，表示测试   

USB3 HUB port1，如果测试port2，则输入2，以此类推）   

device file /dev/bus/usb/006/002 opened successfully   

Port (1) Status: 02A0   

LinuxEye - Start testing port 1 of device 2 on bus 6 （开始测试）   

Type 'q' to stop the test: q （测试结束，输入q，   

退出）

(3.3) 重复上述步骤，测试其他 USB3.0 HUB downstream ports

## 5. Rockchip USB SQ Tool

Rockchip USB SQ Tool 是 Rockchip 自研的 USB PHY 信号完整性调试工具，可以支持 USB 信号测试命令的查询和 USB PHY 信号的动态调整，还可以根据 PHY Tuning 的结果，自动生成对应的 PHY 驱动代码。关于 USB SQ Tool 的详细说明，请参考文档 《Rockchip\_Introduction\_USB\_SQ\_Tool\_CN》。

USB SQ Tool 下载地址：https://redmine.rockchip.com.cn/documents/113

## 6. 参考文档

1. 《USB 2.0 Specification》

2. 《USB 3.1 Specification》

3. 《Agilent N5416A USB 2.0 Compliance Test Option》

4. 《Agilent USB2.0 High Speed Device SQ Test》》

5. 《Keysight N7015A-16A Type-C Test Kit》

6. 《USB 2.0 Electrical Compliance Test Specification Version 1.07》

7. 《Electrical Compliance Test Specification for SuperSpeed USB Rev. 1.0a》
