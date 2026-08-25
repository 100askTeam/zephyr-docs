---
sidebar_position: 1
---

# Linux-USB-PHY

## 前言

## 概述

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| 所有芯片(包括29系列、30系列、31系列、32系列、33系列、PX系列、1108、 1126/1109) | 所有内核版 本 |

读者对象

本文档（本指南）主要适用于以下工程师：

软件工程师

硬件工程师

技术支持工程师

修订记录


| 日期 | 版本 | 作者 | 修改说明 |
| --- | --- | --- | --- |
| 2018-05-21 | V1.0 | 吴良峰 | 初始版本 |
| 2019-01-09 | V1.1 | 吴良峰 | 使用 markdownlint 修订格式 |
| 2020-02-19 | V1.11 | 吴良峰 | 增加免责声明，商标声明，以及版权声明，修改文档规范 |
| 2020-06-10 | V1.2.0 | 任家宁吴良峰 | 增加章节 NaNeng USB 2.0 PHY |
| 2021-01-29 | V1.3.0 | 吴良峰 | 修正 NaNeng USB 2.0 PHY 的寄存器说明 |
| 2022-05-26 | V1.3.1 | 吴良峰 | 修改文件标识和文档规范 |

## 1. USB PHY 支持列表

Rockchip 采用的 USB PHY 主要有如下四种：

USB2.0 PHY [Vendor: Innosilicon]

USB3.0 PHY [Vendor: Innosilicon]

USB2.0 PHY [Vendor: Synopsys]

Type-C PHY [Vendor: Cadence]

如下表 1-1 为各芯片采用的 USB PHY，其中 [1 × port] 表示一个 PHY 支持一个 USB port，[2 × ports] 表示一个 PHY 支持两个 USB port。

表 1-1 Rockchip 平台 USB PHY 支持列表


| 芯片/PHY | USB2 PHY[Inno] | USB3 PHY[Inno] | USB2 PHY[Synopsys] | USB2 PHY[NaNeng] | Type-C PHY[Cadence] |
| --- | --- | --- | --- | --- | --- |
| RK3066RK3188RK3288 | N | N | Y[1 × port] | N | N |
| RK302X | Y[1 × port] | N | N | N | N |
| RK303XRK312XRK322XRK3308RK3326RK3368PX30 | Y[2 × ports] | N | N | N | N |
| RK3228HRK3328 | Y | Y | N | N | N |
| RK3399 | Y | N | N | N | Y |
| RV1126RV1109 | N | N | N | Y[1 × ports] | N |

## 2. USB2.0 PHY

### 2.1 Innosilicon USB2.0 PHY

#### 2.1.1 PHY 的硬件框架

Innosilicon USB2.0 PHY 的硬件框架如下图 2-1 所示，主要包括五个子模块：Transceiver block，PLLclock multiplier，digital UTMI+ core，automatic test functionality，OTG Circuitry（optional）。



图 2-1 Block Diagram of Inno USB 2.0 PHY

#### 2.1.2 主要寄存器说明

表 2-1 Inno USB2.0 PHY Port0 主要寄存器


| Bit | Reset Value | Description |
| --- | --- | --- |
| 2:0 | 3'b000 | HS eye diagram adjust, open HS pre-emphasize function to increase HSslew rate, only used when large cap loading is attached.001:open pre-emphasize in sof or eop state010: open pre-emphasize in chirp state100: open pre-emphasize in non-chirp state111: always open pre-emphasize该寄存器用于HS眼图预加重的调整，建议设置为3'b100see Note2 |
| 115, 4:3 | 3'b011 | Hs slew rate tuning bits, more one represents larger slew rate , 111 themaximum and 001 the minimum, 000 will shut down the high speed driveroutput该寄存器用于 HS 眼图的 slew rate 调整。但作用很小。 |
| 16:13        4'b1100 | A port squelch trigger point configure4b'0000:112.5mv4b'0001:150mv4b'0010:87.5mv4b'0011:162.5mv4b'0100:100mv4b'0101:137.5mv4b'0110:75mv4b'0111:150mv4b'1000:125mv4b'1001:162.5mv4b'1010:100mv4b'1011:175mv4b'1100:150mv(default)4b'1101:187.5mv4b'1110:125mv4b'1111:200mv该寄存器用于噪声阈值调整，建议用默认值150mv。通过调整噪声阈值，可以解决USB外设异常断开的问题，参考：4.2通过调整噪声阈值解决USB HS 设备枚举失败的问题 |  |
| 36:29 | 8'b0011_1111 | HS eye height tuning ,more zeros represent bigger eye, more ones representsmaller eye该寄存器用于调整HS 眼图的高度。只有在 bit[43:42] = 2'b11，即进入bypass状态后，才能生效。该寄存器可以调节的范围很大，但因为bypass 状态下，USB PHY会失去自动调整的能力，容易引起兼容性的问题。所以，不建议设置该寄存器。 |
| 41:37 | 5'b10111 | HS/FS driver strength tuning该寄存器用于调整HS眼图的驱动强度。只有在[42] =1'b1，并且[57] = 1'b0 时，即 bypass ODT，才能生效。默认值为 5b'10111, 最高位必须为1,[41],[40],[39],[38],[37]权重分别为16,8,4,2,1。权重越大,驱动强度越小，5b'11111对应的驱动强度最小，5b'10000对应的驱动强度最大。因为 bypass ODT可能引起兼容性问题，所以，建议尽量不要设置该寄存器。see Note3 |
| 43:42 | 2'b00 | auto compensation bypass , “11” will bypass current and ODTcompensation, customers can set the driver strength and current manually.For larger HS eye height, customer can give more “0" for bit [36:29] ;For larger HS/FS/LS slew rate, give more “1" for bit[41:37].该寄存器用于bypass 电流和电阻的自动调节电路，可明显提高USB眼图的软件 tuning 范围。但 bypass 后，USB PHY 会失去自动调节的能力，可能引起兼容性问题，所以，不建议设置该寄存器。如果确实需要 bypass，建议设置 [43:42] = 2’b01，[57] = 1b'0 即 bypass comp电路中的电阻自动调节电路，保留电流自动调节电路，在该配置下，可以设置[41:37]，不能设置[36:29] |
| 49:47 | 3'b000 | ODT Compensation voltage reference3'b000 : 268mV(default)3'b001 : 262mV3'b010:250mV3'b011 :237.5mV3'b100:275mV3'b101:281mV3'b110:293mV3'b111 : 300mV调高电阻校准点，可以提高USB眼图的幅度（推荐优先尝试100/101，最大为 3b'111）。see Note4 |
| 52:50 | 3'b000 | bias current tuning reference3'b000: 200mV(default)3'b001 : 212.5mV3'b010:225mV3'b011 :237.5mV3'b100:250mV3'b101:187.5mV3'b110:175mV3'b111 :162.5mV内部 current buffer参考点，对眼图的影响很小，建议用默认值即可。 |
| 55:53 | 3'b000 | compensation current tuning reference3'b000: 400mV(default)3'b001 : 362.5mV3'b010: 375mV3'b011: 387.5mV3'b100 : 412.5mV3'b101:425mV3'b110 : 437.5mV3'b111 :450mV调高电流校准点，可以提高USB眼图的幅度（推荐优先尝试100/101，最大为 3b'111)see Note4 |
| 57 | 1'b1 | A port ODT auto refresh bypass, active low该寄存器只有在[42] = 1'b1 时，才有效。在 bypass ODT 的模式下，才可以设置[41:37]，调整眼图的驱动强度。 |
| 98 | 1'b1 | Turn off differential receiver in suspend mode to save power, active low.该寄存器用于PHY的低功耗控制。参考2.1.4.2 PHY的功耗管理 |
| 100 | 1'b0 | force output B_sessionvalid asserted, active high该寄存器可以设置 B_sessionvalid 为高，解决芯片端 otg_det pin 没有连接到 USB 接口的 VBUS pin，导致 VBUS 检测失效的问题。 |
| 108:106 | 3'b000 | B_sessionvalid reference tuning该寄存器用于调整B sessionvalid 的参考阈值，参考4.4 通过 B sessionvalid reference tuning 解决 ADB 连接问题 |
| 126:123 | 4'b1101 | HOST disconnect detection trigger point configure, only used in HOSTmode0000:575mV0001:600mV1001:625mV1101: 650mV(default)该寄存器用于调整 Host mode 的断开检测阈值，参考4.3 通过调整断开检测阈值解决USB 异常断开的问题 |
| 127 | 1'b0 | vbus voltage level detection function power down该寄存器用于使能 Device mode 的 vbus detect，只有使能该 bit 位，GRF（USB_GRF）寄存器中的 bvalid状态检测才有效果。 |

Note1：表 1-2 只给出了 Inno USB2 PHY Port0 的主要寄存器说明。Port1 的寄存器与 Port0 基本一致，只是 Bit 位置不同，请参考 PHY 的手册即可。

Note3：如果通过调整 bit[2:0]，bit[115]，bit[4:3]，bit[55:53]，bit[49:47] 这些寄存器，USB 眼图指标测试仍无法 PASS，可以考虑设置 bit[41:37]。设置方法是：首先，设置 [42] =1'b1，[57] = 1'b0，bypass comp 电路中的电阻自动调节电路，但仍然保留电流自动调节电路（避免引起兼容性问题）。然后，再根据 USB 眼图的测试结果，动态调整 [41:37] ，找到最佳的配置。更详细的设置方法，请参考 2.1.6 PHY tuning 流程

Note4：[49:47] 和 [55:53] 需要在打开校准模式后，才能生效，并且对同一个 PHY 的 port0 和 port1同时生效。不同的 PHY 版本，校准模式的控制寄存器可能不同，比如 :

RK3399 打开校准模式为 [199] = 1'b1

$$

\mathrm  R K 3 3 2 8 / R K 3 2 2 8 H / P X 3 0 / R K 3 3 2 6 / R K 3 3 0 8 / R V 1 1 0 8 \ \mathrm &#123; f &#125; \mathrm  &#123; \mathcal &#123; I &#125; &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm &#123; \# &#125; \mathrm  \# \up

$$

[186:184] = 3b’000（以默认的电流校准方式）

[186:184] = 3b’100（以 Port0 的电流校准方式）

[186:184] = 3b’101（以 Port1 的电流校准方式）

#### 2.1.3 参考电阻 USBRBIAS 说明

1. 阻值越小则输出强度越大，出来的波形整体放大，但对摆率（slew rate）没有影响；

2. 阻值允许的修改范围为 ±10%，超过该范围可能会存在兼容性问题；

3. 阻值会影响到同一个 PHY 的两个 port，所以修改阻值后，一定要重新测试 PHY 的两个 port 的眼图，避免因幅度过大而触发 disconnect 信号，造成 device 频繁 disconnect/reconnect；

#### 2.1.4 PHY 的供电及功耗管理

##### 2.1.4.1 PHY 的供电

PHY 的供电有三路 3.3V，1.8V 和 1.0V，如下表 2-2 所示。如果实际电路中，这三路电压值超过规定的最大值或者低于规定的最小值，都可能会导致 USB 连接异常。

表 2-2 Inno USB2.0 PHY power supplies


| Supply Voltage | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- |
| USB_AVDD_3V3 | 3.0 | 3.3 | 3.6 | V |
| USB_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| USB_AVDD_1V0 | 0.9 | 1.0 | 1.1 | V |

一个典型的出错现象是，VCCCORE1P0 的电压超过了规定的最大值 1.1V，导致 USB ADB 连接失败。解决方法请参考4.4 通过 B\_sessionvalid reference tuning 解决 ADB 连接问题

##### 2.1.4.2 PHY 的功耗管理

### 运行时的 PHY 功耗管理

系统运行时，如果 USB2.0 port 没有工作，则可以通过 GRF（或 USB\_GRF）寄存器中的 utmi\_sel，utmi\_suspend\_n，utmi\_opmode，utmi\_xcvrselect，utmi\_termselect，utmi\_dppulldown 以及utmi\_dmpulldown 来控制 USB2.0 PHY 进入 suspend。当检测到有 USB 连接时，需要先 resume PHY，才能开始 USB 枚举。详细的控制流程可以参考 USB2.0 PHY 的驱动（drivers/phy/rockchip/phy-rockchip-inno-usb2.c）。

表 2-3 运行时的 Inno USB2.0 PHY 功耗管理寄存器


| Bit | ResetValue | SuspendValue | Description |
| --- | --- | --- | --- |
| 8 | 1&#x27;b0 | 1&#x27;b1 | utmi_dmpulldown0 : DM 15 KOhm pull down disabled1: DM 15 Kohm pull down enable |
| 7 | 1&#x27;b0 | 1&#x27;b1 | utmi_dppulldown0 : DP 15 KOhm pull down disabled1 : DP 15 Kohm pull down enable |
| 6 | 1&#x27;b1 | 1′b1 | utmi_termselectGRF termination select between FS/HS speed1 : Full-speed terminations are enabled.0 : High-speed terminations are enabled. |
| 5:4 | 2&#x27;b01 | 2&#x27;b01 | utmi_xcvrselectGRF transceiver select between FS/LS/HS speed11 : Sends an LS packet on an FS bus or receives an LS packet.10 :LS Transceiver01 : FS Transceiver00: HS Transceiver |
| 3:2 | 2&#x27;b00 | 2&#x27;b00 | utmi_opmodeGRF operational mode selection11 : Normal operation without SYNC or EOP generation. If theXCVRSEL bus is not set to 00 while OPMODE[1:0] is set to 11, USBPHY behavior is undefined.10 : Disable bit stuffing and NRZI encoding.01 : Non-Driving00 : Normal |
| 1 | 1&#x27;b1 | 1&#x27;b0 | utmi_suspend_nGRF suspend mode1&#x27;b0 : suspend1&#x27;b1 : normal |
| 0 | 1&#x27;b0 | 1&#x27;b1 | utmi_sel1&#x27;b0 : select otg controller utmi interface to phy1&#x27;b1 : select GRF utmi interface to phy |

### 待机时的 PHY 功耗管理

待机时的 PHY 功耗管理有如下两种方法，推荐使用方法 2。

方法 1：关闭 PHY 的供电

关闭 PHY 的供电是最直接的节省功耗的方法，但有两个限制：

1. PHY 的三路供电 3.3V，1.8V ，1.0V 以及 VDD\_logic 要同时关闭，否则会导致这四路电之间的漏电。

2. 关闭 PHY 的供电，则不支持 USB 唤醒系统（Remote wakeup）的功能。

### 方法 2：设置 PHY 进入低功耗模式

该方法是通过 GRF（USB\_GRF）寄存器来控制 PHY 进入低功耗模式。

一级低功耗配置：

表 2-4 Inno USB2.0 PHY 一级低功耗寄存器配置


| Bit | ResetValue | SuspendValue | Description |
| --- | --- | --- | --- |
| 98 | 1&#x27;b1 | 1&#x27;b0 | Turn off differential receiver in suspend mode to save power,active low |

二级低功耗配置：

表 2-5 Inno USB2.0 PHY 二级低功耗寄存器配置


| Bit | ResetValue | SuspendValue | Description |
| --- | --- | --- | --- |
| 46 | 1&#x27;b0 | 1&#x27;b1 | Battery charging related register |
| 127 | 1&#x27;b0 | 1&#x27;b1 | vbus voltage level detection function power down, activehigh |

Note：在二级低功耗的配置下，linestate 和 bvalid 中断都会失效，只有 id 中断起作用。

表 2-6 Inno USB2.0 PHY 低功耗数据 （以 PX30/RK3326 实测数据为例）


| 供电电源 | 运行时低功耗 | 待机一级低功耗 | 待机二级低功耗 |
| --- | --- | --- | --- |
| USB_AVDD_1V0 | 0.27 mA | 0.27 mA | 0.006 mA |
| USB_AVDD_1V8 | 0.73 mA | 0.1 mA | 0.02 mA |
| USB_AVDD_3V3 | 0 mA | 0 mA | 0 mA |

#### 2.1.5 PHY clk 管理

PHY 输出给 USB 控制器的时钟主要有 480 MHz clk 和 utmi clk，这两个时钟如果没有管理好，会导致USB 控制器工作异常。对于这两个时钟的管理，需要注意以下两点：

## 480 MHz clk 的管理

对于 Inno USB2.0 PHY 2 x ports，两个 ports 共同使用 一个 480 MHz clk，由 GRF 寄存器的 suspend assert和 COMMONONN 联合控制。控制方法如下：

两个 port，如果有一个没有进入 suspend，则不会关闭 480 MHz clk。两个 port，如果都进入 suspend，但COMMONONN 为 0，也不会关闭 480 MHz clk。

### utmi clk 的管理

对于 Inno USB2.0 PHY 2 x ports，每个 port 有 自 己对应的 utmi clk，并且，只由 port 自 己的 suspend assert控制。当 port 进入 suspend，utmi clk 会被关闭。

当 port 退出 suspend，utmi clk 会被重新开启，但需要等待 1.5 \~ 2ms，utmi clk 才能稳定。

#### 2.1.6 PHY tuning 流程

Inno USB2.0 PHY (2 x ports) tuning 的流程图如下:



以 RK3399 USB2.0 PHY HS tuning 为例（RK3399 具有两个 USB2.0 PHY，每个 PHY 有 2 个 port），tuning 流程如下 Stage1 ～ stage5。

Stage1. Port0 & Port1 pre-emphasize & slew rate tuning

Port0 tuning：

[2:0] = 3'b100; (open Port0 pre-emphasize in non-chirp state)

```
{[115],[4:3]} = 3'b101 (设置 Port0 slew-rate 最大，注意：3'b101 强度最大，而不是 3'b111)
```

### Port1 tuning：

```lisp
[210:208] = 3'b100; (open Port1 pre-emphasize in non-chirp state)
```

```
{[323],[212:211]} = 3'b101; (设置 Port1 slew-rate 最大，注意：3'b101 强度最大，而不是 3'b111)
```

### Stage2. 打开校准模式，调整电压/电流校准点

注意：如下寄存器的调整对 Port0 和 Port1 同时生效。

[199] = 1'b1; (变换校准模式（这一位寄存器只存在于 port0 上，但对 port0 和 port1 同时有作用），这是一个备用的校准模式，通常是不开放的。在新的校准模式下，调节 [55:53]，[49:47]才能有效。)

如果通过 Stage1 的 tuning，眼图仍不能得到明显改善，可在此基础上尝试调高下面的电流校准点和电阻校准点：

[55:53] = 3'b101(default); (调高电流校准点(推荐优先尝试 100/101，最大为 3b’111)

[49:47] = 3'b101(default); (调高电阻校准点(推荐优先尝试 100/101, 最大为 3b’111)

此外，还可以调整[52:50] (内部 current buffer 参考点)，但作用 比较小。

### Stage3. 调整预加重强度

[194:192] = 3'b011; (调节 Port0 HS driver 预加重强度，“111”强度最大。其中[194]，[193]，[192]的权重依次为 1，2，4)

[402:400] = 3'b011; (调节 Port1 HS driver 预加重强度，“111”强度最大)

### Stage4. Bypass ODT & driver strength tuning

如果通过 Stage1～stage3 的常规 PHY tuning 方法，眼图测试仍然无法 pass，可以考虑 bypass ODT，需要注意的是，Port0 和 Port1 可以分开 bypass ODT 和 调整驱动强度。

### Port0 bypass ODT & driver strength tuning：

[57] = 1'b0; (Port0 ODT auto refresh bypass)

### Port1 bypass ODT & driver strength tuning：

[265] = 1'b0; (Port1 ODT auto refresh bypass，类似 bit [57] 设置 Port0 的作用）

[249:245] (Port1 驱动强度调整，类似 bit [41:37] 设置 Port0 的作用)

### Stage5. 调整参考电阻 RBIAS 的阻值

如果软件 tuning PHY，仍然无法保证眼图测试 pass，最后只能考虑调整参考电阻的方法，请参考2.1.3 参考电阻 USBRBIAS 说明

### 2.2 Synopsys USB2.0 PHY

考虑到 Synopsys USB2.0 PHY 只用于较早的几款芯片（RK3066/RK3188/RK3288），当前的主流芯片和后续的芯片 USB2.0 PHY 都是采用 Innosilicon 提供的 IP，所以本章节只作简单介绍。

#### 2.2.1 PHY 的硬件框架

Synopsys USB2.0 PHY 的硬件框架如下图 2-2 所示，主要包括三个子模块：Common block，Transceiverblock，OTG block。各模块的具体作用在 PHY 手册中有详细说明，这里不再赘述。

需要注意的是，Rockchip 平台的 Synopsys USB2.0 PHY 都是只支持一个 Port，不像 Inno USB2.0 PHY 可以支持两个 Ports。



图 2-2 Synopsys USB 2.0 picoPHY One-Port Functional Block Diagram

#### 2.2.2 主要寄存器说明

表 2-7 Synopsys USB2.0 PHY 主要寄存器


| Signal | I/O | Description |
| --- | --- | --- |
| COMPDISTUNE[2:0] | I | Disconnect Threshold AdjustmentFunction: This bus adjusts the voltage level for the thresholdused to detect a disconnect event at the host.111: + 4.5%110: + 3%101: + 1.5%100: Design default011: - 1.5%010:-3%001:-4.5%000:-6% |
| OTGTUNE[2:0] | I | VBUS Valid Threshold AdjustmentFunction: This bus adjusts the voltage level for the VBUS Validthreshold.111: + 9%110: + 6%101: + 3%100: Design default011:-3%010:- 6%001:-9%000: – 12% |
| : + 6% |  |  |
| SQRXTUNE[2:0] | I | Squelch Threshold AdjustmentFunction: This bus adjusts the voltage level for the thresholdused to detect valid high-speed data.111:-20%110:–15%101:-10%100:-5%011: Design default010: + 5%001: + 10% |
| Signal | I/0 | Description |
| TXFSLSTUNE[3:0] | I | FS/LS Source Impedance Adjustment |
| Function: This bus adjusts the low- and full-speed single-ended |  |  |
| source impedance while driving high. The following adjustment |  |  |
| values are based on nominal process, voltage, and temperature. |  |  |
| 1111:-5% 0111:-2.5% |  |  |
|  | Transmitter pre-emphasis current is defined in terms of unit defined as 1X pre-emphasis current. I | 0011: Design default 0001: + 2.5% |
| 0000: + 5% |  |  |
| HS Transmitter Pre-Emphasis Current Control |  |  |
| Function: This signal controls the amount of current sourced to DP0 and DM0 after a J-to-K or K-to-J transition. The HS |  |  |
|  |  |  |
|  |  |  |
| amounts. One unit amount is approximately 600 μA and is |  |  |
|  |  | 11: HS Transmitter pre-emphasis circuit sources 3X pre- emphasis current. |
| 10: HS Transmitter pre-emphasis circuit sources 2X pre- emphasis current. |  |  |
| 01 (design default): HS Transmitter pre-emphasis circuit sources |  |  |
| 1X pre-emphasis current. 00: HS Transmitter pre-emphasis is disabled. |  |  |
|  |  |  |
| HS Transmitter Pre-Emphasis Duration Control |  |  |
|  |  |  |
| TXPREEMPPULSETUNE | I | Function: This signal controls the duration for which the HS |
| pre-emphasis current is sourced onto DP0 or DM0. The HS |  |  |
| Transmitter pre-emphasis duration is defined in terms of unit |  |  |
| amounts. One unit of pre-emphasis duration is approximately |  |  |
| 580 ps and is defined as 1X pre-emphasis duration. This signal |  |  |
| is valid only if either TXPREEMPAMPTUNE0[1] or |  |  |
| TXPREEMPAMPTUNE0[0] is set to 1'b1. |  |  |
| TXRISETUNE[1:0] | I | 1: 1X, short pre-emphasis current duration 0 (design default): 2X, long pre-emphasis current duration |
| HS Transmitter Rise/Fall Time Adjustment |  |  |
| Function: This bus adjusts the rise/fall times of the high-speed |  |  |
| waveform. 11:-20% |  |  |
| 10:-15% |  |  |
| 01: Design default |  |  |
| 00: + 10% |  |  |
| TXVREFTUNE[3:0] | I | HS DC Voltage Level Adjustment Function: This bus adjusts the high-speed DC level voltage. |
|  |  | Transmitter High-Speed Crossover Adjustment |
|  |  |  |
| TXHSXVTUNE[1:0] | I | Function: This bus adjusts the voltage at which the DP0 and |
| DM0 signals cross while transmitting in HS mode. |  |  |
| Signal | I/O | Description |
| TXRESTUNE[1:0] | I | USB Source Impedance Adjustment Function: In some applications, there can be significant series resistance on the D+ and D- paths between the transceiver and cable. This bus adjusts the driver source impedance to compensate for added series resistance on the USB. Note: Any setting other than the default can result in source impedance variation across process, voltage, and temperature conditions that does not meet USB 2.0 specification limits. 11: Source impedance is decreased by approximately 4 Ω. 10: Source impedance is decreased by approximately 2 Ω. 01: Design default |

#### 2.2.3 参考电阻 REXT 说明

表 2-8 Synopsys USB2.0 PHY REXT


| 芯片 | 参考电阻 REXT |
| --- | --- |
| RK3066/RK3188 | 43.2 Ω (± 1%) |
| RK3288 | 200Ω |

#### 2.2.4 PHY 的供电及功耗管理

##### 2.2.4.1 PHY 的供电

根据 PHY 手册的设计要求，RK3066/RK3188/RK3288 的供电如下表 2-9 所示。

表 2-9 Synopsys USB2.0 PHY power supplies


| 芯片 | Analog power supplies | Digital power supply |
| --- | --- | --- |
| RK3066/RK3188 | 3.3 V (+ 10%, – 7%)2.5 V (+ 10%, − 7%) | 1.1 V (+ 10%, – 7%) |
| RK3288 | 3.3 V (± 10%)1.8 V (± 10%) | 1.0 V (± 10%) |

##### 2.2.4.2 PHY 的功耗管理

### 运行时的 PHY 功耗管理

### 待机时的 PHY 功耗管理

表 2-10 Synopsys USB2.0 PHY 待机低功耗配置


| Bit | Reset Value | Suspend Value | Description |
| --- | --- | --- | --- |
| SIDDQ | 1&#x27;b0 | 1&#x27;b1 | Function: This test signal enables you to perform IDDQ testing by powering down all analog blocks. Before asserting SIDDQ, ensure that VDATSRCENB0, VDATDETENB0, DCDENB0 BYPASSSEL0, ADPPRBENB0, and TESTBURNIN are set to 1&#x27;b0. 1: The analog blocks are powered down. 0: The analog blocks are powered up. Note：如果有使能Bypass Uart的功能，在待机时，需要关闭 Bypass 功能（BYPASSSEL0 = 1&#x27;b0），否则会增加 PHY 的功 耗。 |

#### 2.2.5 PHY clk 管理

Synopsys USB2.0 PHY 的 clk 管理与 Inno USB2.0 PHY 类似，也是通过 GRF 寄存器的 suspend assert 和COMMONONN 联合控制。请参考 2.1.5 PHY clk 管理

#### 2.2.6 PHY tuning 流程

### 2.3 NaNeng USB2.0 PHY

#### 2.3.1 PHY 的硬件框架

NaNeng USB2.0 PHY的硬件框架如下图 2-3 所示



图 2-3 Block Diagram of NaNeng USB 2.0 PHY  

Phase locked loop(PLL) and clock divider

通过获取 12MHz 参考时钟输入并使用频率合成，PLL 模块生成一个 480MHz 高速时钟用于 USB 数据发送和接收。 同时，它产生不同的分频时钟，包括 CLK\_480，以用于后续功能。

### IO Transceiver (XCVR)

### USB Transmitter

### USB Receiver

同时，实现了接收器状态机，用于 UTMI 接收器协议处理，有关此状态机的详细信息，请参阅 UTMI 接口规范。

高速 DLL 和全速 DLL 分别用于 HS 和 FS 模式下的 CDR 时钟相位跟踪和相位调整。DLL 相位校准是自动执行的，不需要任何外部校准过程。

为了补偿高速模式下 USB 发送器和 USB 接收器之间的频率偏移，USB 接收器还实现了一个弹性缓冲器。 可以通过监视 UTMI 接口信号 RXERROR 来观察缓冲区的上溢或下溢状态。

### Bandgap reference

带隙模块是一个内部参考发生器，用于为 IP 上的所有电路提供参考电压/电流。带隙模块在不同的工艺，电源电压和温度条件下变化很小，并且不需要任何外部组件即可完成工作。

### Termination Resister Calibration

校准模块使用外部电阻作为参考，以在任何 PVT 下获得准确的 45Ω 端接，校准将在加电并打开带隙参考后开始，耗时约300us。

### Charge Detector

充电检测支持 BC1.2，当 USB 2.0 PHY 用作便携式设备时，它可以检测包括 CDP，DCP 和 SDP 的充电端口。 当 USB 2.0用作主机或 OTG 设备时，可以将其配置为 SDP 或 CDP。

#### 2.3.2 主要寄存器说明

### 表 2-11 NaNeng USB2.0 PHY 主要寄存器


| Bit | Field Name | ResetValue | Description |
| --- | --- | --- | --- |
| FC_REG00[5] | cfg_hs_strg | 1'b1 | HS TX strong power mode正常使用时，该bit 必须置1。特殊用法：在 chirp K 阶段设置该 bit 为 0，大约可 以提高 chirp K 幅值 10mV |
| FC_REG00[6] | cfg_sel_strength | 1'b0 | HS TX stronger edge driver enable signal该寄存器用于 HS 眼图的 Slew rate 调整置 1 可以改善眼图的 Slew rate，但无法提高幅值。 |
| FC_REG00[7] | cfg_sel_pw | 1'b0 | HS TX edge delay select signalBypass signal of VDDA detect function:0: normal mode1: bypass mode, VDDA detect function isdisable该寄存器用于 HS 眼图的 Slew rate 调整置1 可以改善眼图的 Slew rate，但可能会导致眼图过冲。所以使用时，请务必测试眼图确认效果。 |
| FC_REG02[4:3] | cfg_rref[1:0] | 2'b00 | Reference resister select signal00: 200 ohm01: 390 ohm10: 1K ohm11: 2Kohm默认使用 200 ohm 外部参考电阻 |
| FC_REG04[2] | cfg_rcal_sel_voff | 1'b1 | Calibration code select signal, default value:4'b10: select calibration code1: select cfg_rcal_voff[3:0]如果设置为0就会触发一次电阻自校准RV1126/RV1109 PHY 驱动在初始化阶段会触发一次电阻自校准功能，并把校准值rcal_out[3:0]写入 cfg_rcal_voff[3:0]，然后关闭电阻校准功能。 |
| FC_REG04[6:3] | cfg_rcal_voff[3:0] | 4'b0111 | Register code for termination resister该寄存器用于HS眼图的幅值调整该寄存器只有在 FC_REG04[2] 为1 时生效理论上，cfg_rcal_voff 值越大，对应的内部45Ω电阻越小，对应的眼图幅值越大设置为 4′b1111，内部 45Ω 电阻最小，对应眼图幅值最大设置为 4'b0001，内部 45Ω 电阻最大，对应眼图幅值最小设置为 4‘b0000，无效 |
| FC_REG06[0] | LS_PAR_EN | 1'b1 | LS mode with parallel enable作Host时，为了识别低速设备必须将该bit位置1 |
| FC_REG08[4] | cfg_swcal_byps | 1'b0 | Bypass signal of TX swing calibration function0: normal mode1: bypass mode当PHY的供电电压不是标准的 0.8V，1.8V 和3.3V时，触发电压自校准电压校准只有在 chirp K 的前 500us 生效；如果已做过一次电压校准，即使 bypass tx 电压校准，校准过的电流源仍然会保持住；从bypass 切换到 normal，可以强制触发一次电压校准，但最好是在 chirpk 前 500us 让 phy自己去判断校准 |
| FC_REG08[5] | cfg_byps_charge | 1'b0 | Bypass signal of charge detection0: normal mode1: bypass mode在系统进入待机时，通过 bypass 充电检测功能可以降低 phy 的休眠功耗 |
| FC_REG0D[4] | rcal_trim_done | RO | 电阻校准的状态（只读)为1表示电阻校准完成正常情况，电阻校准耗时约为 300us，也即cfg_rcal_sel_voff 设置为0后，等待 200 -300us 该bit 位会置1，表示校准完成更多信息，请参考2.3.3参考电阻RREF电阻的说明 |
| FC_REG0D[3:0] | rcal_out | RO | 电阻自校准得到的电阻 Code，只有在FC_REG02[2] cfg_rcal_sel_voff 设置为 0 时生效理论上，外部参考电阻越小，对应的电阻Code 值越大，眼图幅值也越大 |

#### 2.3.3 参考电阻RREF电阻的说明

参考电阻 RREF 在 PHY 手册中规定有四种阻值，由寄存器 FC\_REG02[4:3] 控制，默认为 200Ω。具体参考2.3.2 主要寄存器说明。

Note:

1. 参考电阻只有在 FC\_REG02[2] cfg\_rcal\_sel\_voff 为 0，才能生效。具体参考 2.3.2 主要寄存器说明；

2. 参考电阻的取值为标准值的 ±10%（45Ω 内部电阻的 PVT 偏差）；

4. RREF 200 Ω的电阻建议用 1% 的精密电阻，在 PCB 上放置离管脚越近越好；

#### 2.3.4 PHY 的供电及功耗管理

##### 2.3.4.1 PHY 的供电

PHY 的供电有三路 3.3V，1.8V 和 0.8V，如下表 2-12 所示。

表 2-12 NaNeng USB2.0 PHY power supplies


| Supply Voltage | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- |
| USB_VDDA | 0.72 | 0.80 | 0.88 | V |
| USB_VCCA18 | 1.62 | 1.80 | 1.98 | V |
| USB_VCCA33 | 2.97 | 3.30 | 3.63 | V |

##### 2.3.4.2 PHY 的功耗管理

### 运行时的 PHY 功耗管理

Note: 与 Inno USB 2.0 PHY 不同的是，NaNeng USB2.0 PHY 在进入 suspend 时，需要将utmi\_opmode 设置为2'b01 non-driving

### 待机时的 PHY 功耗管理

待机时的 PHY 功耗管理有如下两种方法，推荐使用方法 2。

### 方法 1：关闭 PHY 的供电

关闭 PHY 的供电是最直接的节省功耗的方法，但有两个限制：

1. PHY 的三路供电 3.3V，1.8V ，0.8V 以及 VDD\_logic 要同时关闭，否则会导致这四路电之间的漏电。

2. 关闭 PHY 的供电，则不支持 USB 唤醒系统（Remote wakeup）的功能。

### 方法 2：设置 PHY 进入低功耗模式 （suspend mode）

该方法是通过 GRF 寄存器来控制 PHY 进入低功耗模式。

### normal mode

High-speed operation: 设置 SUSPENDM = 1, OPMODE[1:0] = 00, XCVRSELECT = 0, TERMSELECT = 0

Full-speed operation: 设置 SUSPENDM = 1, OPMODE[1:0] = 00, XCVRSELECT = 1, TERMSELECT = 1

系统正常运行，并且 USB 正常工作时，PHY 进入 normal mode

PLL-only mode

设置 SUSPENDM = 0, PLL\_EN = 1

系统正常运行，并且 USB 不工作，只需保持 480 MHz clock给系统其它模块使用，PHY 进入PLL-only mode

suspend mode

设置 OPMODE[1:0] = 01, SUSPENDM = 0, PLL\_EN = 0

系统进入待机时，PHY 进入 suspend mode

表 2-13 NaNeng USB2.0 PHY 功耗数据 （以 RV1126 实测数据为例）


| 供电电源 | normol mode (hs) | PLL-only mode | suspend mode |
| --- | --- | --- | --- |
| USB_AVDD_0V8 | 5.65 mA | 0.5436 mA | 12.90 uA |
| USB_AVCC_1V8 | 9.54 mA | 1.75 mA | 165.00 uA |
| USB_AVCC_3V3 | 0.56 mA | 0.1504 mA | 10.85 uA |

#### 2.3.5 PHY clk 管理

以 RV1126/RV1109 为例，PHY 的 REFCLK 为 12MHz，有两路可以选择：

xin\_osc0\_usbphyref 和 clk\_gpll\_mux。默认选择 xin\_osc0\_usbphyref。

PHY 输出给 USB 控制器的时钟主要有 480 MHz clk 和 utmi clk，这两个时钟如果没有管理好，会导致USB 控制器工作异常。对于这两个时钟的管理，需要注意以下两点：

## 480 MHz clk 的管理

只受 GRF 寄存器的 PLL\_EN 控制，当 PLL\_EN 设置为 1 时，CLK480M 开启，要等待 200～500us 时钟才会稳定；反之当 PLL\_EN 设置为 0 时，CLK480M 关闭。

### utmi clk 的管理

只受 SUSPENDM（对应 GRF 寄存器 suspend\_n）控制，当 PHY 进入 suspend，utmi clk 会被关闭。

当 PHY 退出 suspend，utmi clk 会被重新开启，PHY手册上介绍需要等待 500us， utmi clk 才能稳定。但在 RV1126 / RV1109 实际测试中，只有延时不低于 2.5ms 后，PHY 才可以正常工作

#### 2.3.6 PHY tuning 流程

#### 2.3.7 VBUS 输入电压的要求

建议该管脚上的分压电阻使用精度为 1% 的精密电阻，因为该管脚电压会影响到其他部分电路的功能。

#### 2.3.8 OTG PHY 的联动控制

OTG PHY 是指 PHY 可以支持动态切换 Device/Host 的功能。

与其他 USB 2.0 PHY 不同的是，NaNeng OTG PHY 需要软件设置，才能支持动态切换 Device/Host 的功能。

PHY IP 设计时，通过 OTG\_SUSPENDM、LS\_PAR\_EN、IDDIG 的联动机制，来实现 OTG PHYDevice/Host 的动态切换，这三者的硬件关系如下：

1. OTG\_SUSPENDM 受 IDDIG 控制。规则如下：

当 IDDIG 为 1，则 OTG\_SUSPENDM 为 0；

当 IDDIG 为 0，则 OTG\_SUSPENDM 为 1；

2. LS\_PAR\_EN 受 OTG\_SUSPENDM 控制。规则如下：

当 OTG 作 HOST 时，OTG\_SUSPENDM 为 1，对应 LS\_PAR\_EN 也为 1，支持 HS/FS/LS;

当 OTG 作 Device 时，OTG\_SUSPENDM 为 0，对应 LS\_PAR\_EN 也为 0，仅支持 HS/FS，不支持LS;

当插入 OTG cable 时，cable 会将 ID pin 拉低到地，触发 PHY 内部的联动机制，硬件 自动切换 PHY 作Host 功能。

## 3. USB3.0 PHY

### 3.1 Innosilicon USB3.0 PHY

Inno USB3.0 PHY 只支持 Super-speed，没有向下兼容 High-Speed，所以需要和 Inno USB2.0 PHY 组成一个 Combo PHY。如下图 3-1 是一个典型的 USB3.0 OTG 架构图。



图 3-1 USB3.0 OTG Block Diagram

#### 3.1.1 PHY 的硬件框架

Innosilicon USB3.0 PHY 的硬件框架如下图 3-2 所示，主要包括：Data serialization and de-serialization，8b/10b encoding，analog buffers，elastic buffers and receiver detection。



图 3-2 Inno USB3.0 PHY Block Diagram

#### 3.1.2 主要寄存器说明

USB3 PHY 寄存器的说明，请参考 Inno USB3.0 PHY 手册 “Table 6.1 USB3.0 Registers”章节。一些重要的寄存器及配置说明，将再后续的章节中，分别介绍。

#### 3.1.3 参考电阻说明

根据 Inno USB3.0 PHY 手册的设计要求，PHY 的参考电阻 RBIAS 如下表 3-1，在电路设计中，请严格按照参考阻值的要求进行设计。

表 3-1 Inno USB3.0 PHY 参考电阻 RBIAS


| 芯片 | 参考电阻 RBIAS |
| --- | --- |
| RK3228H/RK3328 | $2 K \pm 1 \%$  external resistance bias to ground |

#### 3.1.4 PHY 的供电及功耗管理

##### 3.1.4.1 PHY 的供电

根据 Inno USB3.0 PHY 手册的设计要求，PHY 的供电如下表 3-2 所示。

表 3-2 Inno USB3.0 PHY power supplies


| 芯片 | Parameter | Notes | Min | Typical | Max |
| --- | --- | --- | --- | --- | --- |
| RK3228H/RK3328 | VCCA1P8 | 1.8 V analog supply voltage forCDR | 1.62 | 1.8 | 1.98 |
| RK322H/RK3328 | PareBeter | 1.0 V analogNuly voltage for | Mi | Typiçal | Max |
|  |  | PLL, CDR and clock tree power |  |  |  |

##### 3.1.4.2 PHY 的功耗管理

表 3-3 Inno USB3.0 PHY 功耗


| Power State | 理论功耗 | 实际功耗（RK3228H） |
| --- | --- | --- |
| PO | 60 mW | 120 mWVCCA1P8:47.9 mAVCCD1P0 :35 mA |
| P1 | 40 mW | N.A |
| P2 | 20 mW | 76 mWVCCA1P8:32.7 mAVCCD1P0 :18.1 mA |
| P3 | 1.1 mW | &lt; 1 mW |

### Note：

理论功耗的测试条件是：VCCA1P8 = 1.8 V，VCCD1P0 = 1.0 V，VoltageSwing = 1000 mVdiffpp；

实际功耗的测试条件是：

P0 ：连接 USB3.0 Disk，并播放 Disk 中的视频；

P2 ：静态桌面，USB3.0 未连接外设；

P3 ：系统进入 deepsleep；

USB3 PHY P3 state 低功耗的控制流程，请参考驱动：

drivers/phy/rockchip/phy-rockchip-inno-usb3.c

表 3-4 P3 state 的 USB3 GRF 寄存器配置


| Signal | I/O | Description |
| --- | --- | --- |
| pipe_pd_i[1:0] | I | PIPE Power Up/Down |
| Power states for USB 3.0 mode: |  |  |
| 2’b00: P0, normal operation |  |  |
| 2’b01: P1 , low recovery time latency, power saving state |  |  |
| 2’b10: P2 , longer recovery time latency, lower power state 2’b11: P3, lowest power state. |  |  |

表 3-5 P3 state 的 USB3 PHY 寄存器低功耗配置


| Offset | Bit | Default | Suspend | Description |
| --- | --- | --- | --- | --- |
| 0x1a8 | 4 | 1&#x27;b0 | 1b1 | ldo power down control |
| 0x44 | 4 | 1b0 | 1b1 | Band-gap power down control |
| 0x150 | 6 | 1&#x27;b1 | 1&#x27;b 0 | tx bias enable |
| 0x80 | 2 | 1&#x27;b0 | 1&#x27;b1 | tx cm power down control |
| 0xc0 | 4:3 | 1&#x27;b 11 | 2&#x27;b 00 | bit3: tx obs enablebit4: rx cm enable |

#### 3.1.5 PHY reset 和 recover 时序要求

##### 3.1.5.1 PHY reset 时序

表 3-6 Inno USB3.0 PHY reset（RK3228H）


| Reset Signal | Description |
| --- | --- |
| usb3phy_otg_psrstn_req | UTMI APB reset |
| usb3phy_pipe_psrstn_req | PIPE APB reset |
| usb3otg_utmi_srst_req (utmi_reset) | UTMI MAC reset |
| usb3phy_pipe_srstn_req (pipe_rsn) | PIPE MAC reset |
| usb3phy_u2_srstn_req (por_reset) | USB2 power on reset |
| usb3phy_u3_srstn_req (por_n) | USB3 power on reset |

reset 的时序如下图 3-3 所示。



图 3-3 Inno USB3.0 PHY reset sequence

##### 3.1.5.2 PHY recover 时序

表 3-6 Inno USB3.0 PHY recovery time


| Recovery time | U1 | U2 | U3 |
| --- | --- | --- | --- |
| Entry from U0 | 25 ns | 2.5 μs | 6 μs |
| Exit to U0 | 25 ns | 2 μs | 100 μs |

### Note:

U0: normal operation

U1: low recovery time latency, power saving state

U2: longer recovery time (64us max) latency, lower power state

U3: lowest power state, internal clocks can be turned off. The PIPE interface is in asynchronous mode

#### 3.1.6 PHY tuning 流程

由于一个完整的 USB3.0 PHY，实际上是由 USB2.0 PHY 和 USB3.0 PHY 组成的 combo PHY，所以 PHY的 tuning 包括 USB2.0 PHY 和 USB3.0 PHY 两部分。其中，USB2.0 PHY tuning 流程，请参考 2.1.6 PHYtuning 流程 。USB3 PHY 的 tuning，Inno 提供的文档中没有给出详细的调试方法，因此， 目前只有 Rxtuning for compliance RJTL test（可用于 Rx 信号一致性测试）和 bias current for the PHY（可用于调整信号幅度）的调整方法。参考驱动 drivers/phy/rockchip/phy-rockchip-inno-usb3.c 的函数rk3328\_u3phy\_tuning 。

### 3.2 Cadence Type-C PHY

#### 3.2.1 PHY 的硬件框架

Cadence Type-C PHY 的硬件框架如下图 3-4 所示，支持 USB SuperSpeed 和 DisplayPort through 4 lanes。  

Type-C PHY 各个子模块的详细说明，请参考文档《Cadence Type-C Subsystem Integration Guide》。

Type-C PHY 可以支持如下三种工作模式：

4-lane DisplayPort

2-lane DisplayPort + USB SuperSpeed (one port)

USB Superspeed only (one port)



图 3-4 CDNS-TYPE-C Reference HW Architecture  

Type-C PHY USB3.0 Tx/Rx 和 Lanes 的对应关系如下图 3-5 所示。

USB3.0 Tx1 --&gt; Lane0

USB3.0 Rx1 --&gt; Lane1

USB3.0 Rx2 --&gt; Lane2

USB3.0 Tx2 --&gt; Lane3



图 3-5 Type-C implementation configuration with straight cable

#### 3.2.2 主要寄存器说明

主要寄存器的说明，请参考文档《USB3-DP Driver Capability》，该文档提供了 USB3.0 和 DP tuning 的寄存器配置方法。对于 USB3.0 Tx，常用的寄存器是 TX\_DIAG\_TX\_DRV 和

Type-C PHY 的寄存器偏移地址计算方法比较复杂，需要遵循两个规则：

每条 lane 都有自 己对应的寄存器偏移地址

通过查表得到的寄存器偏移地址为 16bit，需要再左移 2 bits，才是最终的偏移地址。

以 lane3 (对应 USB3.0 Tx2)寄存器 TX\_DIAG\_TX\_DRV 的偏移地址计算为例：

1. 通过查表，得到 TX\_DIAG\_TX\_DRV 的寄存器地址为 01\_m\_nnnn : 1111 : 00001

其中，m = multi-write，nnnn = lane number   

lane0 Tx1 nnnn = 0x0   

lane1 Rx1 nnnn = 0x1   

lane2 Rx2 nnnn = 0x2   

lane3 Tx2 nnnn = 0x3

2. 计算 lane3 TX\_DIAG\_TX\_DRV 寄存器的偏移地址

$$

\mathrm &#123; l a n e 3 - T X \_ D I A G \_ T X \_ D R V &#125; = 0 1 \_ 0 \_ 0 0 1 1 : 1 1 1 1 : 0 0 0 0 1 = 0 \mathrm &#123; x &#125; 4 7 \mathrm &#123; E &#125; 1

$$

3. 左移 2 bits，获得最终的偏移地址

$$

\mathrm &#123; l a n e 3 – T X \_ D I A G \_ T X \_ D R V &#125; = 0 \mathrm &#123; x &#125; 4 7 \mathrm &#123; E &#125; 1 \ll 2 = 0 \mathrm &#123; x &#125; 1 1 \mathrm &#123; F &#125; 8 4

$$

#### 3.2.3 参考电阻说明

根据文档《USB Type-C with DisplayPort Transmit PHY Specification》，Type-C 外部参考电阻如下表 3-7所示。

表 3-7 Type-C PHY 参考电阻


| Name | Min | Typ | Max | Unit | Descriptions |
| --- | --- | --- | --- | --- | --- |
| rext | 497.5 | 500 | 502.5 | Ω | There needs to be an external resistorcomponent that needs to be connected at rextball while internal resistor or current is gettingcalibrated. Package routing from rext ball toits respective bump should not contributemore than 0.05Ω. |
| aux_pullup |  | 100k |  | Ω | AUX port pull-up resistance |
| aux_pulldown |  | 100k |  | Ω | AUX port pull-down resistance |

Note: RK3399 EVB 的 Type-C REXT 采用的电阻为 499 ± 1% Ω

#### 3.2.4 PHY 的供电及功耗管理

##### 3.2.4.1 PHY 的供电

根据文档《USB Type-C with DisplayPort Transmit PHY Specification》，Type-C PHY 的供电要求如下：

Analog Supply Voltage：0.9 V，1.8 V，and 3.3 V （± 10%）

Digital Supply Voltage：0.9 V （± 10%）

##### 3.2.4.2 PHY 的功耗管理

Type-C PHY 的功耗控制可以通过两个途径：

1. Assert Type-C PHY 相关的 reset 信号；

2. 关闭 Type- C PHY 的 power domain；

#### 3.2.5 PHY reset

RK3399 Type-C PHY 的 reset 信号有 3 个：phy reset，pipe reset 和 apb reset。

表 3-8 Type-C PHY reset （RK3399）


| Reset Signal | Description |
| --- | --- |
| resetn_uphy1_req | Type-C1 phy reset |
| resetn_uphy1_pipe_100_req | Type-C1 pipe reset |
| resetn_uphy1_tcphy_req | Type-C1 apb reset |
| resetn_uphy0_req | Type-C0 phy reset |
| resetn_uphy0_pipe_100_req | Type-C0 pipe reset |
| resetn_uphy0_tcphy_req | Type-C0 apb reset |

根据 RK3399 datasheet “7.5.1 Start-up sequence”，reset 的时序要求如下：

USB Start-up Sequence:

Select external PSM clock (see Chapter GRF)

Set select Type-C PHY0 or Type-C PHY1 used for DPTX

Release apb\_preset\_n

Configurate Type-C PHY normal or flipped orientation

Configurate PHY and PMA for the selected mode of operation

Release phy\_reset\_n

Wait for CMN ready indication (assertion) by polling bit 0 of PHY\_PMA\_CNN\_CTRL1 of PHY

Release pipe\_reset\_n

Wait for the de-assertion of pipe\_phy\_status, then Type-C PHY for USB operation is ready.

#### 3.2.6 PHY tuning 流程

Type-C PHY 的 tuning，请参考文档《USB3-DP Driver Capability》，该文档提供了 USB3.0 和 DP tuning的寄存器配置方法。对于 USB3.0 Tx tuning，常用的寄存器是 TX\_DIAG\_TX\_DRV 和

TX\_TXCC\_CAL\_SCLR\_MULT，这两个寄存器可以用于调整 Tx 的驱动强度和幅值。对于 USB3.0 Rxtuning，常用的寄存器是 RX\_DIAG\_RXFE\_TM2，TX\_DIAG\_TX\_DRV 和

TX\_TXCC\_CAL\_SCLR\_MULT，配置方法请参考补丁 RK3399 Chrome 平台的补丁 “CHROMIUM: phy:rockchip-typec: tuning phy for usb3 Rx flip” 和 “CHROMIUM: phy: rockchip-typec: tuning phy for usb3 Tx”。

## 4. PHY 常见问题总结

##

2. 解决由于 USB 信号质量问题或者 PHY 供电压差问题引起的 USB 枚举失败、异常断开等问题；

### 4.2 通过调整噪声阈值解决 USB HS 设备枚举失败的问题

1. 现象：使用质量较差、阻抗较大的 USB cable 连接 HS 外设，无法枚举 HS 设备。使用这类 USBcable 来测试眼图，结果一般很差，幅度较低，如图 4-1 所示。



图 4-1 幅值低于噪声阈值的 USB 眼图

2. 原因：USB PHY 的噪声阈值默认设置为 150 mV，但当使用阻抗较大的 USB cable 时，USB 正常信号的幅值会衰减得很厉害，甚至低于 150 mV 的，因此正常信号会被当作噪声处理了。

### 4.3 通过调整断开检测阈值解决 USB 异常断开的问题

1. 现象：USB Host 连接外设，在使用过程中，外设异常 disconnect，没有其他报错信息。

2. 原因：可能是 USB 差分信号幅值太大，触发了 PHY 的 disconnect 阈值，导致 PHY 误检测到设备拔出。

### 4.4 通过 B\_sessionvalid reference tuning 解决 ADB 连接问题

1. 现象：PC 无法识别 ADB，或者识别到 ADB 后又断开。

3. 解决方法：可以通过调整 Inno USB2.0 PHY 寄存器的 B\_sessionvalid reference tuning 解决。参考2.1.2 主要寄存器说明中的寄存器[108:106]，默认值为 3'b000，建议改为 3'b111 或 3'b101。

### 4.5 Innosilicon LS/FS 信号问题

2. LS Rise/Fall time test fail 的解决方法

[Inno reply]:

3. 如果软件无法 workaround，LS Rise/Fall time test fail 是否会影响 usb 实际使用的兼容性？

[Inno reply]:

### 4.6 RK312x/RK3368 HS 握手失败问题

### 4.7 RK3228H/RK3328 USB3.0 PHY 若干问题

1. 3238H USB IP 问题总结：

USB3.0 Port U2 眼图中有 6 根离散的线；

USB3.0 PHY 的 RX 指标测试 Fail，需要软件 tuning phy；

USB3.0 PHY 的 1.0V VDD 在上电期间有 1A 以上的大电流；

USB3.0 PHY 无法检测到外设拔出的 disconnect；

2. 3238H MPW 改版 USB IP 修正：

修改 switch MOS 尺寸

解决了 USB3.0 Port U2 的眼图中有 6 根离散的线，导致指标临界的问题。

增加寄存器调节范围，细化步长

解决了 USB3.0 PHY 的 RX 指标测试和部分 U 盘不识别的问题；

RX jitter tolerance 有一定的改善；

修改 clamp RC 常数

解决了 USB3.0 PHY 的 1.0V VDD 上电期间的大电流问题。

修改逻辑，增加 back up 方案

解决了当 USB3.0 的 device 拔出后，USB 控制器检测不到 disconnect。原因是 USB3 PHY 的检测电路中滤毛刺电路的 bug，导致 PHY 不能回到初始状态。

修改 USB2 host/otg combo PHY 的 ESD，解决 RK3228H 的版本 HMB ESD 指标测试 Fail 的问题

3. 3238H USB PHY 遗留问题

USB3.0 PHY 在 P3 state， link training 失败，导致无法识别外设。
