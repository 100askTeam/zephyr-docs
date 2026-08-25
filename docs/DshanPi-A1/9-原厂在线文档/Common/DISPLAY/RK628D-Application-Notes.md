---
sidebar_position: 1
---

# RK628D-Application-Notes

### RK628D应用说明

## 前言

## 概述

本文档主要介绍RK628D的使用注意事项和接口特性。

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK628D |  |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 温定贤 | 2021-04-06 | 初始版本 |
| V1.1.0 | 温定贤 | 2021-05-26 | 1、增加不支持图像旋转说明；2、删除Audio部分MCLK的使用限制；3、修改GVI/HDMI TX同源说明；3、增加对接第三方MCU说明；4、增加输入输出接口特性说明；5、增加典型应用场景性能说明； |
| V1.2.0 | 温定贤 | 2021-07-13 | 增加图像色彩说明 |
| V1.3.0 | 温定贤 | 2021-07-19 | 1、典型应用场景增加HDMI To LVDS说明;2、增加HDMI RX DVI Mode说明； |
| V1.4.0 | 温定贤 | 2021-09-06 | 1、修正BT1120输出典型格式；2、增加轻微色偏解决方案说明； |
| V1.5.0 | 温定贤 | 2022-07-05 | 1、补充BT1120通路图像色彩说明；2、输出接口增加HDMI说明；3、增加HDMI RX支持分辨率频点说明； |

## 1. RK628D使用注意事项


| 功能模块 | 注意事项 |
| --- | --- |
| 所有输入输出接口 | 1、仅支持逐行分辨率，不支持隔行分辨率。2、不支持图像旋转，如输入横屏转输出竖屏等。（注：HDMI To MIPI CSI应用场景可以在接收图像后在AP内部旋转) |
| HDMI RX | 1、HDMI RX支持480P/576P/720P/1080P/4K等CEA标准Timing，如果有特定Timing需求，需要联系RK技术端评估。4K60只支持YUV420格式，其他分辨率无此限制。2、线缆接入HDMI To MIPI CSI应用场景，若需要支持YUV420格式，需要修改代码，当前SDK代码支持YUV422/YUV444/RGB格式，无法支持两者自适应。3、若需要支持HDCP功能，HDCPKey无法固化在RK628上，需要写在外部存储，对接除RKAP外第三方平台时需要注意增加读写HDCPKey的功能支持。4、HDMI RX不支持DVI Mode，已经在EDID配置为不支持DVI Mode，对正常读取EDID的设备使用无影响，对于不读取EDID，强制输出的设备，使用中需要注意。 |
| MIPI CSITX | 1、MIPI CSI TX的图像格式只支持YUV422 8bit，最大支持分辨率4K30，MIPI bitrate1.2Gbps/lane, 4 lane。 |
| GVI/HDMITX | 1、GVI/HDMI TX的应用场景，RK628和输入信号（HDMI/RGB/BT1120 IN）的时钟必须同源，即要求AP提供RK628的时钟源，且时钟频率必须为24MHz。 |
| MIPI DSI | 1、若使用单MIPI屏，必须接在DSI0。 |
| 对接第三方MCU | 1、对接第三方MCU，使用HDMI线缆接入模式，只支持应用场景：HDMI ToRGB/LVDS/MIPI DSI/MIPI CSI。 |
| 1、不同输入输出接口，部分应用场景存在色域空间转换或图像格式的上下采样，图像色彩少量细节可能会有轻微偏差，若对图像色彩要求较高，请提前评估。包含以下通路：HDMI(4K60 YUV420) To GVI(RGB)HDMI(RGB/YUV444) To MIPI CSI(YUV422)HDMI(RGB/YUV444)To BT1120(YUV422)BT1120(YUV422) To LVDS(RGB)图像色彩BT1120(YUV422) To HDMI(RGB/YUV444)BT1120(YUV422) To MIPI DSI(RGB)BT1120(YUV422) To GVI(RGB)2、HDMI To MIPI CSI轻微色偏的解决方案:采用HDMI To MIPI DSI替代HDMI To MIPI CSI，最大支持分辨率1080P60;目前支持接收MIPIDSI的AP：RK1109、RK1126、RK3566、RK3568、RK3588;不支持接收MIPIDSI的AP：RK3288、RK3326、RK3368、RK3399等早期芯片。 |  |

## 2. 输入接口特性


| Inputinterface | TypicalResolution | Typical Format | Max bit rate perlane |
| --- | --- | --- | --- |
| HDMI | 4K 60Hz | YUV420/YUV422/YUV444/RGB888(4K60只支持YUV420格式，其他分辨率无限制) | 3Gbps |
| BT1120 | 1080P 60Hz | YUV422 8bit | NA |
| RGB | 1080P 60Hz | RGB888 | NA |

## 3. 输出接口特性


| Output interface | Typical Resolution | Typical Format | Max bit rate per lane |
| --- | --- | --- | --- |
| GVI | 4K 60Hz | RGB888 | 3.75Gbps |
| Dual MIPI DSI | 2.5K 60Hz | RGB888 | 1.2Gbps |
| MIPI DSI | 1080P 60Hz | RGB888 | 1.2Gbps |
| Dual LVDS | 1080P 60Hz | RGB888 | 1 Gbps |
| LVDS | 720P 60Hz | RGB888 | 1 Gbps |
| MIPI CSI | 4K 30Hz | YUV422 8bit | 1.2Gbps |
| BT1120 | 1080P 60Hz | YUV422 8bit | NA |
| RGB | 1080P 60Hz | RGB888 | NA |
| HDMI | 1080P 60Hz | RGB888/YUV444/YUV422 | 1.5Gbps |

## 4. 典型应用场景性能


| 应用场景 | 最高性能 |
| --- | --- |
| HDMI To GVI | 4K 60Hz |
| HDMI To MIPI CSI | 4K 30Hz |
| HDMI To MIPI DSI | Dual MIPI DSI: 2.5K 60HzSingle MIPI DSI: 1080P 60Hz |
| HDMI To LVDS | Dual LVDS: 1080P 60HzLVDS: 720P 60Hz |

## 5. HDMI RX支持分辨率频点

HDMI RX支持以下分辨率频点，单位KHz：

```csv
25175, 27000, 33750, 40000, 59400, 65000, 68250,
74250, 75000, 83500, 85500, 88750, 928125,
101000, 102250, 108000, 118800, 119000, 135000,
148500, 150000, 162000, 165000, 297000
```

HDMI RX分辨率频点需要满足以上要求，HDMI线缆模式接入时一般能在以上支持列表中找到对应的频点。若应用在HDMI To MIPI DSI或HDMI To LVDS等点屏场景，在支持列表中找不到对应的频点时，则需要在不影响屏正常显示的情况下，调试修改屏的Timings适配到相近的频点，相关修改有可能会影响屏的刷新率。

举个例子：

pix\_clk = htotal \* vtotal \*fps   

屏的参数：htotal:1354, vtotal:816, fps:60   

pix\_clk = 1354 \* 816 \* 60 = 66300KHz   

66300KHz不在我们的支持列表中，找到相近的频点：65000KHz。   

计算可得：   

fps = 65000KHz / (1354 \* 816) = 59Hz   

刷新率由60Hz变成了59Hz
