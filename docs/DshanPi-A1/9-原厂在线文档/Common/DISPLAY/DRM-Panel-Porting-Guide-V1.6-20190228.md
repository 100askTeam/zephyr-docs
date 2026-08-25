---
sidebar_position: 1
---

# Rockchip\_DRM\_Panel\_Porting\_Guide

### 版 本 历 史

### 1.1 Display Pipe



1）Rockchip 平台的 LCD Controller 称为 VOP（Video Output Processor），芯片中一般集成 1\~2 个 VOP。只有支持两个 VOP 的芯片，才能支持双屏异显。在进行显示路由配置时，应该选择哪个 VOP 作为输入的依据主要是 VOP 支持的最大分辨率，以 RK3399 为例，RK3399 有两个 VOP，分别为 VOPB（4096x2160），VOPL（2560x1600），所以对于分辨率大于 2560x1600 的应用，只能选择 VOPB 作为输入。

## 2 Panel

### 2.1 Documentation and Source Code

Kernel (develop-4.4)

drivers/gpu/drm/panel/panel-simple.c

Documentation/devicetree/bindings/display/panel/simple-panel.txt

U-Boot (next-dev)

drivers/video/drm/rockchip\_panel.c

U-Boot (rkdevelop)

drivers/video/rockchip\_panel.c

drivers/video/rockchip\_dsi\_panel.c

### 2.2 DT Bindings

### 1) simple-panel（LVDS/RGB/eDP）



2) simple-panel-dsi (MIPI-DSI)



这里只列出通用配置，其他与特定显示接口相关的配置在各个显示接口章节中单独说明。


| Property | Value | Comment |
| --- | --- | --- |
| compatible | simple-panel     orsimple-panel-dsi |  |
| backlight |  | 背光节点引用 |
| power-supply |  | 可选，Regulator配置。 |
| reset-gpios |  | 可选，Reset GPIO 配置。 |
| enable-gpios |  | 可选，Enable GPIO配置。 |
| prepare-delay-ms |  | 可选，具体时序参考屏驱动。 |
| reset-delay-ms |  | 可选，具体时序参考屏驱动。 |
| init-delay-ms |  | 可选，具体时序参考屏驱动。 |
| enable-delay-ms |  | 可选，具体时序参考屏驱动。 |
| unprepare-delay-ms |  | 可选，具体时序参考屏驱动。 |
| disable-delay-ms |  | 可选，具体时序参考屏驱动。 |
| display-timings |  | LCD时序参数，按屏规格书填写。 |
| width-mm |  | LCD物理宽度，按屏规格书填写。 |
| height-mm |  | LCD物理高度，按屏规格书填写。 |

### 2.3 常见问题

3. Simple-panel只是一个通用驱动，只能满足一般需求，如果代码不支持，可以考虑对现有驱

动进行扩展或者单独写一个特定的驱动。

## 3 MIPI-DSI

1）rk3128/rk3326/px30/rk3368 (1\~4lanes, 1Gbps per lane)

2）rk3288/rk3399 (1\~8lanes, 1.5Gbps per lane)

### 3.1 Documentation and Source Code

Kernel (develop-4.4)

drivers/gpu/drm/rockchip/dw-mipi-dsi.c

drivers/phy/rockchip/phy-rockchip-inno-video-combo-phy.c

Documentation/devicetree/bindings/display/rockchip/dw\_mipi\_dsi\_rockchip.txt

Documentation/devicetree/bindings/phy/phy-rockchip-inno-video-combo-phy.txt

U-Boot (next-dev)

drivers/video/drm/dw\_mipi\_dsi.c

drivers/video/drm/inno\_video\_combo\_phy.c

U-boot (rkdevelop)

drivers/video/rockchip-dw-mipi-dsi.c

drivers/video/rockchip-inno-mipi-dphy.c

### 3.2 DT Bindings

3.2.1 Host

1）Single-channel





2）Dual-channel (RK3288/RK3399)



① 标准的 dual-channel 接口 MIPI 屏；  





3）Dual-link (RK3399)





$$

```
\vert \frac { 1 } { 2 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 } \vert \frac { 1 } { 3 }
```

$$


| Property | Value | Comment |
| --- | --- | --- |
| rockchip,lane-rate | 0~1500 | 指定 DATA_LANE的速率，单位为mbps/lane，CLK_LANE的频率为该值的一半，比如配置为400Mbps，相应的 CLK 频率为 200MHz。如果没有配置该属性，驱动会自动计算lane-rate。 |
| rockchip,dual-channel |  | 对于 Dual-channel mode，该属性必须配置。 |

#### 3.2.2 PHY

```dts
&video_phy {
status = "okay";
};
```

NOTE: 对于有单独 PHY 节点的芯片(rk3128/px30/rk3326/rk3368)，需要使能该节点。

#### 3.2.3 VOP Routing

```dts
&dsi_in_vopb {
status = "okay";
};
&dsi_in_vopl {
status = "disabled"
};
```

#### 3.2.4 Logo

```dts
&route_dsi {
connect = <&vopb_out_dsi>;
status = "okay";
};
```

#### 3.2.5 Panel

### 1）Single-channel



### 2) Dual-channel

子模式①和 Single-channel 的主要区别是 dsi,lanes 的值大于 4。


| Property | Value | Comment |
| --- | --- | --- |
| compatible | simple-panel-dsi |  |
| reg | 0 | virtual channel |
| dsi,flags | (MIPI_DSI_MODE_VIDEO一MIPI_DSI_MODE_VIDEOBURST                          一MIPI_DSI_MODE_EOT_PACKET                            1MIPI_DSI_MODE_LPM) | MIPI_DSI_MODE_VIDEO,MIPI_DSI_MODE_VIDEO_BURST,表示 Video Burst Mode。MIPI_DSI_MODE_LPM表示默认在LP模式下发送初始化序列。MIPI_DSI_MODE_EOT_PACKET表示关闭 EOTP 特性。 |
| dsi,format | MIPI_DSI_FMT_RGB888 | Pixel Format |
| dsi,lanes | 4 | Lane Number（1～8），大于4表示为 Dual-channel MIPI-DSIPanel。 |
| panel-init-sequence |  | 屏的上电初始化序列，具体参数配置方式参考下文说明。 |
| panel-exit-sequence |  | 屏的下电初始化序列，具体参数配置方式参考下文说明。 |

### 3.3 Command



第一条命令的解析如下：

39 00 04 b9 ff 83 94

Data Type：0x39 (DCS Long Write)

Delay：0x00 (0 ms)

Payload Length：0x04 (4 Bytes)

Payload：0xb9 0xff 0x83 0x94

最后一条命令的解析如下：

05 14 01 29

Data Type：0x05 (DCS Short Write, no parameters)

Delay：0x14 (20 ms)

Payload Length：0x01 (1 Bytes)

Payload：0x29

#### 3.3.1 Data Type

Table 16 Data Types for Processor-sourced Packets


| Data Type,hex | Data Type,binary | Description | PacketSize |
| --- | --- | --- | --- |
| 0x01 | 00 0001 | Sync Event, V Sync Start | Short |
| 0x11 | 01 0001 | Sync Event, V Sync End | Short |
| 0x21 | 10 0001 | Sync Event, H Sync Start | Short |
| 0x31 | 11 0001 | Sync Event, H Sync End | Short |
| 0x08 | 00 1000 | End of Transmission packet (EoTp) | Short |
| 0x02 | 00 0010 | Color Mode (CM) Off Command | Short |
| 0x12 | 01 0010 | Color Mode (CM) On Command | Short |
| 0x22 | 10 0010 | Shut Down Peripheral Command | Short |
| 0x32 | 11 0010 | Turn On Peripheral Command | Short |
| 0x03 | 00 0011 | Generic Short WRITE, no parameters | Short |
| 0x13 | 01 0011 | Generic Short WRITE, 1 parameter | Short |
| 0x23 | 10 0011 | Generic Short WRITE, 2 parameters | Short |
| 0x04 | 00 0100 | Generic READ, no parameters | Short |
| 0x14 | 01 0100 | Generic READ, 1 parameter | Short |
| 0x24 | 10 0100 | Generic READ, 2 parameters | Short |
| 0x05 | 00 0101 | DCS Short WRITE, no parameters | Short |
| 0x15 | 01 0101 | DCS Short WRITE, 1 parameter | Short |
| 0x06 | 00 0110 | DCS READ, no parameters | Short |
| 0x37 | 11 0111 | Set Maximum Return Packet Size | Short |
| 0x09 | 001001 | Null Packet, no data | Long |
| 0x19 | 01 1001 | Blanking Packet, no data | Long |
| 0x29 | 10 1001 | Generic Long Write | Long |
| 0x39 | 11 1001 | DCS Long Write/write_LUT Command Packet | Long |
| 0x0C | 001100 | Loosely Packed Pixel Stream, 20-bit YCbCr, 4:2:2 Format | Long |
| 0x1C | 01 1100 | Packed Pixel Stream, 24-bit YCbCr, 4:2:2 Format | Long |
| 0x2C | 10 1100 | Packed Pixel Stream, 16-bit YCbCr, 4:2:2 Format | Long |
| 0x0D | 001101 | Packed Pixel Stream, 30-bit RGB, 10-10-10 Format | Long |
| 0x1D | 01 1101 | Packed Pixel Stream, 36-bit RGB, 12-12-12 Format | Long |
| 0x3D | 11 1101 | Packed Pixel Stream, 12-bit YCbCr, 4:2:0 Format | Long |
| 0x0E | 00 1110 | Packed Pixel Stream, 16-bit RGB, 5-6-5 Format | Long |
| 0x1E | 01 1110 | Packed Pixel Stream, 18-bit RGB, 6-6-6 Format | Long |
| 0x2E | 10 1110 | Loosely Packed Pixel Stream, 18-bit RGB, 6-6-6 Format | Long |
| 0x3E | 111110 | Packed Pixel Stream, 24-bit RGB, 8-8-8 Format | Long |
| 0xX0 and0xXF,unspecified | XX 0000XX1111 | DO NOT USEAll unspecified codes are reserved |  |

### ① DCS Write


| 0x05 |  | DCS Short WRITE, no parameters |  |
| --- | --- | --- | --- |
|  | 00 0101 |  | Short |
| 0x15 | 01 0101 | DCS Short WRITE, 1 parameter | Short |


|  | 11 1001 |  |  |
| --- | --- | --- | --- |
| 0x39 |  | DCS Long Write/write_LUT Command Packet | Long |

DCS packet 包括一个字节的 dcs 命令，以及 n 个字节的 parameters。

### ② Generic Write


|  |  |  |  |
| --- | --- | --- | --- |
| 0x03 | 00 0011 | Generic Short WRITE, no parameters | Short |
| 0x13 | 01 0011 | Generic Short WRITE, 1 parameter | Short |
| 0x23 | 10 0011 | Generic Short WRITE, 2 parameters | Short |


| 0x29 |  |  | Long |
| --- | --- | --- | --- |
|  | 10 1001 | Generic Long Write |  |

Gerneic Packet 包括 n 个字节的 parameters。

如果 n &gt;= 3，将以 Long Packet 的形式进行对 Payload 打包，表示 n parameters，Data

Type 为 0x29。

#### 3.3.2 Delay

表示当前Packet 发送完成之后，需要延时多少ms，再开始发送下一条命令。

#### 3.3.3 Payload Length

表示Packet 的有效负载长度。

#### 3.3.4 Payload

表示 Packet 的有效负载，长度为 Payload Length。

#### 3.3.5 Exmaple

(B) On sequence


| sequence | DataType(hex) | index(hex) | parameters# (hex) | description | comment |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SLEEP MODE |  |  |  |  |  |  |  |
| DCDC EN L-&gt;H |  |  |  |  | DCDC EN L-&gt;H (VSP,VSN on) |  |  |
| wait 20ms |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
| command | 05 | 01 | - |  | soft reset |  |  |
| wait 5ms |  |  |  |  |  |  |  |
| command | 23 | B0 | 1 | 00 | MCAP |  |  |
| command | 29 | B3 | 12345 | 0408002 0 | Interface setting |  |  |
| command | 29 | B4 | 1 | 0C | Interface ID setting |  |  |
| command | 29 | B6 | 12 | 3AD3 | DSI control |  |  |
| command |  | 15 | 51 | 1 | E6 | write display brightness |  |
| command |  | 15 | 53 | 1 | 2C | write control display |  |
| command | 15 | 3A | 1 | 77 | set pixel format |  |  |
| command | 39 | 2A |  | 000004AF | set column address |  |  |
| command | 39 | 2B |  | 00007F | set page address |  |  |
| send image | 39 | 2C/3C |  |  | write memory/ write memory continue |  |  |
|  |  |  |  |  |  |  |  |
| command | 05 | 11 | - | a | exit sleep mode |  |  |
| wait 120ms |  |  |  |  |  |  |  |
| command | 05 | 29 | = |  | set display on |  |  |
| wait min Oms |  |  |  |  |  |  |  |
| LED ENL-&gt;H |  |  |  |  | LED EN L-&gt;H |  |  |
|  |  |  |  |  |  |  |  |
| NORMAL MODE |  |  |  |  |  |  |  |


| panel-init-sequence = 05 05 01 01 23 00 02 b0 00 23 00 02 d6 01 29 00 06 b3 14 08 00 22 00 29 00 02 b4 0c 29 00 03 b9 3a c3 15 00 02 51 e6 15 00 02 53 2c 15 00 02 3a 77 39 00 05 2a 00 00 04 af 39 00 05 2b 00 00 07 7f 05 78 01 29 05 00 01 11 1; |
| --- |

(C) Off sequence  





### 3.4 常见问题

1. 如何对 MIPI-DSI 外设进行读写操作。drivers/gpu/drm/drm\_mipi\_dsi.cdrivers/gpu/drm/drm\_mipi\_dsi.h提供了对 MIPI-DSI 外设通信的相关 API。



## 2. 如何判断MIPI-DSI 外设有正常工作？



## 3. 如何支持DCS背光。

1. 删除dsi-panel节点下的back1ight属性。   

2.   

bivvy@rk-intel-1:\~/rk3288/hardware/rockchip/1iblights\$ git diff   

diff --git a/lights.cpp b/lights.cpp   

index eebcd8f..55e3900 100644   

--- a/1ights.cpp   

+++ b/1ights.cpp   

@@ -34,7 +34,7 @@   

```c
#define LOGE(fmt,args...) ALOGE(fmt,##args)
-#define BACKLIGHT_PATH"/sys/c1ass/backlight/rk28_b1/brightness"
+#define BACKLIGHT_PATH"/sys/class/backlight/dcs-backlight/brightness"
#define BACKLIGHT_PATH1"/sys/class/backlight/backlight/brightness" // for kernel 4.4
#define BUTToN_LED_PATH"sys/c1ass/1eds/rk29_key_1ed/brightness"
#define BATTERY_LED_PATH "sys/c1ass/1eds/battery_1ed/brightness"
```

bivvy@rk-intel-1:\~/rk3288/device/rockchip/common\$ git diff   

diff --git a/init.rk30board.rc b/init.rk30board.rc   

index b7ae3e1..f031e73 100755   

--- a/init.rk30board.rc   

+++ b/init.rk30board.rc   

@@ -139,7 +139,7 @@ on boot   

write /proc/sys/net/core/wmem\_max 1048576   

# backlight   

chown system system /sys/class/backlight/rk28_b1/brightness

+ chown system system/sys/class/backlight/dcs-backlight/brightness   

chown system system /sys/class/backlight/backlight/brightness

## 4. 如何使能 EOTP（EoT packet）特性。



5. 如 何 发 送 data\_type 为 MIPI\_DSI\_SHUTDOWN\_PERIPHERAL （ 0x22 ） 和

MIPI\_DSI\_TURN\_ON\_PERIPHERAL（0x32）的 packet。



## 6. 如何使能非连续时钟？

--- a/arch/arm64/boot/dts/rockchip/px30-evb-ddr3-v10.dtsi   

+++ b/arch/arm64/boot/dts/rockchip/px30-evb-ddr3-v10.dtsi   

@@ -205,7 +205,8 @@   

```
height-mm = <121>;
dsi,flags = <(MIPI DSI MODE VIDEO | MIPI DSI MODE VIDEO BURST |
MIPI DSI MODE LPM I MIPI DSI MODE EOT PACKET)>;
```

MIPI DSI MODE LPM I MIPI DSI MODE EOT PACKET I   

MIPI\_DSI\_CLOCK\_NON\_CONTINUOUS)&gt;;   

dsi,format = &lt;MIPI DSI FMT RGB888&gt;;   

dsi,lanes = &lt;4&gt;;

## 4 eDP

1）rk3288/rk3368 (1/2/4 lanes, 1.62Gbps/2.7Gbps)

2）rk3399 (1/2/4 lanes, 1.62Gbps/2.7Gbps/5.4Gbps)

### 4.1 Documentation and Source Code

Kernel (develop-4.4)：

drivers/gpu/drm/bridge/analogix/analogix\_dp\_core.c

drivers/gpu/drm/bridge/analogix/analogix\_dp\_reg.c

drivers/gpu/drm/rockchip/analogix\_dp-rockchip.c

drivers/phy/rockchip/phy-rockchip-dp.c

Documentation/devicetree/bindings/display/bridge/analogix\_dp.txt

Documentation/devicetree/bindings/display/rockchip/analogix\_dp-rockchip.txt

Documentation/devicetree/bindings/phy/rockchip-dp-phy.txt

U-Boot (next-dev)：

drivers/video/drm/analogix\_dp.c

drivers/video/drm/analogix\_dp\_reg.c

U-Boot (rkdevelop)

drivers/video/rockchip\_analogix\_dp.c

drivers/video/rockchip\_analogix\_dp\_reg.c

### 4.2 DT Bindings

#### 4.2.1 Host

### 1）Embedded Connection





2）Box-to-box Connection






| Property | Value | Comment |
| --- | --- | --- |
| force-hpd |  | 对于Embedded Connection，一般不需要HPD功能，需要加上该属性。 |
| hpd-gpios |  | 对于 Box-to-box Connection，一般需要 HPD |
|  |  | 功能，需要配置该属性。 |

#### 4.2.2 PHY



NOTE: 对于有单独PHY节点的芯片，需要使能该节点。

#### 4.2.3 VOP Routing

```dts
&edp_in_vopb {
status = "okay";
};
&edp_in_vopl {
status = "disabled"
};
```

#### 4.2.4 Logo

```dts
&route_edp {
connect = <&vopb_out_edp>;
status = "okay";
};
```

#### 4.2.5 Panel



① 属性说明


| Property | Value | Comment |
| --- | --- | --- |
| bpc | 6 or 8 | Bit pixel component |
| bus-forma | MEDIA_BUS_FMT_RGB666_1X18 | 分别对应 6bit 和 8bit 屏 |
| t | MEDIA_BUS_FMT_RGB888_1X24 |  |

### 4.3 常见问题

1) Aux Transaction fail

[ 33.319392] rockchip-dp ff970000.edp: Rx Max Link Rate is abnormal :c0 !

[ 33.319543] rockchip-dp ff970000.edp: Rx Max Lane count is abnormal :0 !

[ 33.322377] rockchip-dp ff970000.edp: AUX CH command reply failed!

## 5 LVDS

1）rk3128/px30/rk3326/rk3368（single-channel）

2）rk3288 (single-channel/dual-channel)

### 5.1 Documentation and Source Code

Kernel (develop-4.4)：

drivers/gpu/drm/rockchip/rockchip\_lvds.c

drivers/phy/rockchip/phy-rockchip-inno-video-combo-phy.c

drivers/phy/rockchip/phy-rockchip-inno-video-phy.c

Documentation/devicetree/bindings/display/rockchip/rockchip-lvds.txt

Documentation/devicetree/bindings/phy/phy-rockchip-inno-video-combo-phy.txt

Documentation/devicetree/bindings/phy/phy-rockchip-inno-video-phy.txt

U-Boot (next-dev)：

drivers/video/drm/rockchip\_lvds.c

drivers/video/drm/inno\_video\_combo\_phy.c

drivers/video/drm/inno\_video\_phy.c

U-Boot (rkdevelop)：

drivers/video/rockchip\_lvds.c

### 5.2 DT Bindings

5.2.1 Host



1）Single-channel



2）Dual-channel




| Property | Value | Comment |
| --- | --- | --- |
| dual-channel |  | 使能 Dual-channel 模式 |
| rockchip,data-swap |  | 在Dual-channel模式下，对两个通道的奇偶像素进行互换。 |

5.2.2 PHY  



#### 5.2.3 VOP Routing



#### 5.2.4 Logo

```dts
&route_lvds {

connect = <&vopb_out_lvds>;

status = "okay";
```

#### 5.2.5 Panel



① 属性说明


| Property | Value | Comment |
| --- | --- | --- |
| bus-form | MEDIA_BUS_FMT_RGB666_1X7X3_ | LVDS信号的数据映射方式，分别对应 |
| at | SPWG | "vesa-18", "vesa-24", "jeida-24", |
|  | MEDIA_BUS_FMT_RGB888_1X7X4_ | "jeida-18"。具体映射关系参考data mapping 说明。 |
| SPWG |  |  |
| MEDIA_BUS_FMT_RGB888_1X7X4_ |  |  |
| JEIDA | MEDIA_BUS_FMT_RGB666_1X7X3_ |  |
|  |  |  |
|  | JEIDA |  |

### 5.3 Data Mapping

#### 5.3.1 6 bit output mode


| VESA6BIT              JEIDA 6BIT |  |  |  |
| --- | --- | --- | --- |
|  | TX0         RO                            R2 |  |  |
|  | TX1          R1                            R3 |  |  |
|  | TX2          R2                            R4 |  |  |
| Y | TX3         R3                            R5 |  |  |
| 0 | TX4         R4                            R6 |  |  |
|  | TX6         R5                            R7 |  |  |
|  | TX7          GO                            G2 |  |  |
|  | TX8          G1                            G3 |  |  |
|  | TX9         G2 | G4 |  |
| Y | TX12       G3                            G5 |  |  |
| 1 | TX13       G4                            G6 |  |  |
|  | TX14 | G5 | G7 |
|  | TX15 | BO | B2 |
|  | TX18       B1                            B3 |  |  |
|  | TX19       B2                            B4 |  |  |
|  | TX20 | B3 | B5 |
|  | TX21 | B4 | B6 |
|  | TX22 | B5 | B7 |
|  | TX24 | HSYNC | HSYNC |
|  | TX25 | VSYNC | VSYNC |
|  | TX26       ENABLE                    ENABLE |  |  |
|  | TX27       GND                          GND |  |  |
|  | TX5 | GND | GND |
|  | TX10 | GND                          GND |  |
| Y | TX11 | GND                          GND |  |
| 3 | TX16 | GND | GND |
|  | TX17       GND | GND |  |
|  | TX23       RSVD                        RSVD |  |  |

#### 5.3.2 8 bit output mode


| VESA 8BIT              JEIDA 8BIT |  |  |
| --- | --- | --- |
| TX0         RO                            R2 |  |  |
|  | TX1         R1                            R3 |  |
|  | TX2         R2                            R4TX3         R3                            R5TX4         R4                            R6 |  |
| Y |  |  |
| 0 |  |  |
|  | TX6         R5 | R7 |
|  | TX7          GO                            G2 |  |
|  | TX8          G1                            G3 |  |
|  |  | G4TX12       G3                            G5TX13       G4                            G6G7B2B3 |
| Y |  |  |
| 1 |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  | TX19       B2                            B4B5B6B7HSYNCVSYNCENABLE |  |
|  |  |  |
|  |  |  |
| Y |  |  |
| 2 |  |  |
|  |  |  |
|  |  |  |
|  | TX27        R6                            RO |  |
|  | TX5         R7 | R1GO |
|  | TX10       G6 |  |
| Y |  | G1B6                            BOTX17       B7                            B1TX23       RSVD                        RSVD |
| 3 |  |  |
|  |  |  |
|  |  |  |

## 6 RGB

1）rk3128/rk3326/px30/rk3288/rk3368

### 6.1 Documentation and Source Code

### Kernel (develop-4.4)：

drivers/gpu/drm/rockchip/rockchip\_rgb.c

drivers/phy/rockchip/phy-rockchip-inno-video-combo-phy.c

drivers/phy/rockchip/phy-rockchip-inno-video-phy.c

Documentation/devicetree/bindings/display/rockchip/rockchip-rgb.txt

Documentation/devicetree/bindings/phy/phy-rockchip-inno-video-combo-phy.txt

Documentation/devicetree/bindings/phy/phy-rockchip-inno-video-phy.txt

U-Boot (next-dev)：

drivers/video/drm/rockchip\_rgb.c

drivers/video/drm/inno\_video\_combo\_phy.c

drivers/video/drm/inno\_video\_phy.c

U-Boot (rkdevelop)：

drivers/video/rockchip\_lvds.c

### 6.2 DT Bingdings

#### 6.2.1 Host



6.2.2 PHY



#### 6.2.3 VOP Routing

```dts
&rgb_in_vopb {
status = "okay";
};
&rgb_in_vopl {
status = "disabled"
};
```

#### 6.2.4 Logo

```dts
&route_rgb {
connect = <&vopb_out_rgb>;
status = "okay";
};
```

#### 6.2.5 Panel

```dts
panel {
compatible ="simple-panel";
enable-gpios = <&gpio0 RK PB5 GPIO ACTIVE LOW>;
reset-gpios = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
bus-format = <MEDIA BUS FMT RGB666 1X18>;
display-timings {
native-mode = <&timing0>;
timingθ: timingθ {
clock-frequency = <51200000>;
hactive = <1024>;
vactive = <600>;
hback-porch = <100>;
hfront-porch = <120>;
vback-porch = <10>;
vfront-porch = <15>;
hsync-len = <100>;
vsync-len = <10>;
hsync-active = <0>;
vsync-active = <0>;
de-active = <0>;
pixelclk-active = <0>;
};
port {
panel_in_rgb: endpoint {
remote-endpoint = <&rgb_out_panel>;
};
};
```


| Property | Value | Comment |
| --- | --- | --- |
| bus-format | MEDIA_BUS_FMT_RBG888_1X24MEDIA_BUS_FMT_RGB666_1X24_CPADHIMEDIA_BUS_FMT_RGB666_1X18 | RGB信号的输出关系，分别对应&quot;OUT_P888&quot;, &quot;OUT_D888_P666&quot;,&quot;OUT_P666&quot;。具体参考 data mapping说明。 |

### 6.3 Data Mapping


| Display | RGB | RGB | RGB | RGB | RGB Parallel | ITU656 | ITU656 | ITU656 | MCU mode |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mode | Parallel | Parallel | Parallel | Parallel | 16-bit | Mode0 | Mode1 | Mode2 |  |
|  | 24-bit | 18-bit | 18-bit | 16-bit |  |  |  |  |  |
| Screen_fac | OUT_P88 | OUT_D888 | OUT_P666 | OUT_D888 | OUT_P565 | OUT_S888/ | OUT_S888/O | OUT_S888/OU | OUT_P888 |
| e | 8 | P666 |  | P565 |  | OUT_S888 | UT_S888DU | T_S888DUMY |  |
|  |  |  |  |  |  | DUMY | MY |  |  |
| DCLK | DCLK | DCLK | DCLK | DCLK | DCLK | DCLK | DCLK | DCLK | RS |
| VSYNC | VSYNC | VSYNC | VSYNC | VSYNC | VSYNC |  |  |  | CS |
| HSYNC | HSYNC | HSYNC | HSYNC | HSYNC | HSYNC |  |  |  | WEN |
| DEN | DEN | DEN | DEN | DEN | DEN |  |  |  | REN |
| DATA | DATA[23: | DATA[23:18] | DATA[17:0] | DATA[23:19] | DATA[15:0] | DATA[7:0] | DATA[15:8] | DATA[14:7] |  |
|  | 0] | DATA[15:10] |  | DATA[15:10] |  |  |  |  |  |
|  |  | DATA[7:2] |  | DATA[7:3] |  |  |  |  |  |
| D23 | R7 | R5 | - | R4 | - | - | e | - | D23 |
| D22 | R6 | R4 | - | R3 |  |  | - | - | D22 |
| D21 | R5 | R3 |  | R2 |  | a |  |  | D21 |
| D20 | R4 | R2 |  | R1 |  |  |  |  | D20 |


| D19 | R3 RI |  | R0 |  |  | m |  | D19 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D18 | R2 R0 | 1 | - | - | - | - | - | D18 |
| D17 | R1 - | R5 | - | - | = | e | e | D17 |
| D16 | R0 1 | R4 | - | - | - | - | - | D16 |
| D15 | G7 G5 | R3 | G5 | R4 | - | D7 | 1 | D15 |
| D14 | G6 G4 | R2 | G4 | R3 | - | D6 | D7 | D14 |
| D13 | G5 G3 | RI | G3 | R2 | 一 | D5 | D6 | D13 |
| D12 | G4 G2 | R0 | G2 | RI | = | D4 | D5 | D12 |
| D11 | G3 Gl | G5 | Gl | R0 | - | D3 | D4 | DII |
| D10 | G2 G0 | G4 | G0 | G5 | - | D2 | D3 | D10 |
| D9 | Gl e | G3 | - | G4 | = | DI | D2 | D9 |
| D8 | GO e | G2 | - | G3 | - | D0 | DI | D8 |
| D7 | B7 B5 | G1 | B4 | G2 | D7 | e | D0 | D7 |
| D6 | B6 B4 | G0 | B3 | Gl | D6 | - | e | D6 |
| D5 | B5 B3 | B5 | B2 | G0 | D5 | - | 1 | D5 |
| D4 | B4 B2 | B4 | B1 | B4 | D4 | = | = | D4 |
| D3 | B3 BI | B3 | B0 | B3 | D3 | - | - | D3 |
| D2 | B2 B0 | B2 | - | B2 | D2 | - | - | D2 |
| D1 | BI I | BI | - | Bl | DI | - | 1 | DI |
| D0 | B0 - | B0 | - | B0 | D0 | - | - | D0 |

## 7 DP Alt Mode

### 7.1 Documentation and Source Code

### Kernel (develop-4.4)：

drivers/gpu/drm/rockchip/cdn-dp-core.c

drivers/gpu/drm/rockchip/cdn-dp-reg.c

drivers/gpu/drm/rockchip/cdn-dp-link-training.c

drivers/phy/rockchip/phy-rockchip-typec.c

Documentation/devicetree/bindings/display/rockchip/cdn-dp-rockchip.txt

Documentation/devicetree/bindings/phy/phy-rockchip-typec.txt

### 7.2 DT Bindings

#### 7.2.1 DP\_TX

```dts
&cdn_dp {
extcon = <&fusb0>;
phys = <&tcphyθ_dp>;
status = "okay";
};
```

7.2.2 USB Type-C PHY

```dts
&tcphyθ {
extcon = <&fusb0>;
status = "okay";
};
```

#### 7.2.3 USB PD

```dts
&i2c4 {
status = "okay";
fusb0: fusb30x@22 {
compatible = "fairchild,fusb302";
reg = <0x22>;
pinctrl-names = "default";
pinctrl-0 = <&fusb0_int>;
int-n-gpios = <&gpio1 2 GPIO_ACTIVE_HIGH>;
vbus-5v-gpios = <&gpio2 0 GPIO_ACTIVE_HIGH>;
status = "okay";
};
};
```

#### 7.2.4 VOP Routing

```dts
&dp_in_vopb {
status = "okay";
};
&dp_in_vopl {
status = "disabled"
};
```

NOTE：对于有两个 VOP的芯片，需要选择其一，一般选择VOPB，因为需要支持 4K。

## 8 RK618

RK616/RK618 是Rockchip平台的配套显示转换芯片，该芯片具有如下特性：

② 一个 RGB 输出口，与 LVDS 输出口复用。

④ 一个MIPI-DSI输出口，RK618 支持该接口，RK616 不支持该接口。

⑤ 一个HDMI输出口。

### 8.1 Documentation and Source Code

Kernel (develop-4.4)：

drivers/mfd/rk618.c

drivers/clk/rockchip/rk618/clk-rk618.c

drivers/gpu/drm/rockchip/rk618/rk618\_lvds.c

drivers/gpu/drm/rockchip/rk618/rk618\_rgb.c

drivers/gpu/drm/rockchip/rk618/rk618\_scaler.c

drivers/gpu/drm/rockchip/rk618/rk618\_vif.c

drivers/gpu/drm/rockchip/rk618/rk618\_hdmi.c

drivers/gpu/drm/rockchip/rk618/rk618\_dither.c

drivers/gpu/drm/rockchip/rk618/rk618\_dsi.c

Documentation/devicetree/bindings/mfd/rk618.txt

Documentation/devicetree/bindings/clock/rockchip,rk618-cru.txt

Documentation/devicetree/bindings/display/rockchip/rockchip,rk618.txt

U-Boot (next-dev)：

drivers/video/drm/rk618.c

drivers/video/drm/rk618\_lvds.c

### 8.2 DT Bindings

#### 8.2.1 RK618

```dts
&i2c0 {
status = "okay";
rk618: rk618@50 {
compatible = "rockchip,rk618";
reg = <0x50>;
pinctrl-names = "default";
pinctrl-0 = <&i2s1_2ch_mclk>;
clocks = <&cru SCLK_I2S1_OUT>;
clock-names = "clkin";
assigned-clocks = <&cru SCLK_I2S1_OUT>;
assigned-clock-rates = <12000000>;
reset-gpios = <&gpio0 RK_PA0 GPIO_ACTIVE_LOW>
status = "okay";
};
};
```


| Property | Value | Comment |
| --- | --- | --- |
| pinctrl-namespinctrl-0 |  | 输入时钟 CLKIN 引脚复用配置 |
| clocksclock-names |  | 输入时钟 CLKIN 引用 |
| assigned-clocksassigned-clock-rates |  | 指定 CLKIN 初始频率为 12MHz |
| reset-gpios |  | Reset 引脚配置，可选。 |
| enable-gpios |  | Enable引脚配置，可选。 |
| power-supply |  | Regulator配置，可选。 |

#### 8.2.2 CRU

```dts
compatible = "rockchip,rk618-cru";
clocks = <&cru SCLK I2S1 OUT>, <&cru DCLK VOPL>;
clock-names = "clkin", "1cdc0_dclkp";
assigned-clocks = <&clock SCALER_PLLIN_CLK>, <&clock VIF_PLLIN_CLK> <&clock SCALER_CLK>, <&clock VIF0 PRE CLK>, <&clock CODEC_CLK> <&clock DITHER_CLK>;

assigned-clock-parents = <&cru SCLK I2S1 OUT>, <&clock LCDC0_CLK> <&clock SCALER_PLL_CLK> <&clock VIF_PLL_CLK>, <&cru SCLK_I2S1_OUT>, <&clock VIF0_CLK>;
```


| Property | Value | Comment |
| --- | --- | --- |
| clocksclock-names |  | 输入时钟CLKIN引用，以及 LCDC0_DCLKP 引用 |
| assigned-clocks |  | 指定内部时钟默认父时钟 |
| assigned-clock-rates |  |  |

#### 8.2.3 HDMI



```dts
&rgb {
status = "okay";
ports {
port@1 {
reg = <1>;
rgb_out_hdmi: endpoint {
remote-endpoint = <&hdmi_in_rgb>;
};
};
};
&rgb_in_vopb {
status = "disabled";
};
&rgb_in_vopl {
status = "okay";
};
&route_rgb {
connect = <&vopl_out_rgb>;
status = "disabled";
```




| Property | Value | Comment |
| --- | --- | --- |
| interrupt-parentinterrupts |  | INTERUPT 引脚配置 |

#### 8.2.4 LVDS








| Property | Value | Comment |
| --- | --- | --- |
| dual-channel |  | 使能dual-channel 模式，RK616 不支持 dual-channel，RK618 支持dual-channel。 |



8.2.5 RGB  









8.2.6 MIPI-DSI  



```dts
&rgb {
status = "okay";
ports {
port@1 {
reg = <1>;
rgb_out_dsi: endpoint {
remote-endpoint = <&dsi_in_rgb>;
};
};
};
};
&rgb_in_vopl {
status = "okay";
};
&rgb_in_vopb {
status = "disabled";
};
&route_rgb {
connect = <&vopl_out_rgb>;
status = "disabled";
};

&rk618
dsi {
compatible = "rockchip,rk618-dsi";
clocks = <&clock MIPI CLK>;
clock-names = "dsi";
#address-cells = <1>;
#size-cells = <0>:
status = "okay";
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
reg = <0>;
dsi_in_rgb: endpoint {
remote-endpoint = <&rgb_out_dsi>;
};
};
};

panel@0 { compatible = "simple-panel-dsi"; reg = <0>; power-supply = <&vcc3v3_lcd>; backlight = <&backlight>; reset-gpios = <&gpio2 RK PA0 GPIO ACTIVE_LOW>; prepare-delay-ms = <20>; reset-delay-ms = <20>; init-delay-ms = <20>; enable-delay-ms = <120>; disable-delay-ms = <20>; unprepare-delay-ms = <20>;

width-mm = <95>;
height-mm = <151>;

dsi,flags = <(MIPI_DSI_MODE_VIDEO MIPI DSI MODE VIDEO BURST MIPI DSI MODE LPM MIPI_DSI_MODE_EOT_PACKET)>;

dsi,format = <MIPI_DSI_FMT_RGB888> dsi,lanes = <4>;

panel-init-sequence = [ 15 00 02 b0 00 15 00 02 d6 01 39 00 06 b3 14 08 00 22 00 15 00 02 b4 0c 15 00 02 DE 00 39 00 03 b6 3a d3 15 00 02 51 E0 15 00 02 53 04 15 00 02 3a 77 15 00 02 35 01 39 00 05 2A 00 00 04 AF 39 00 05 2B 00 00 07 7F 05 96 01 29 05 14 01 11
```



#### 8.2.7 Clone Mode



```dts
&rgb {
status = "okay";
ports {
port@1 {
reg = <1>;
rgb_out_vif: endpoint {
remote-endpoint = <&vif_in_rgb>;
};
};
};
};
&rgb_in_vopb {
status = "disabled";
};
&rgb_in_vopl {
status = "okay";
};
&route_rgb {
connect = <&vopl_out_rgb>;
status = "disabled";
};
```









#### 8.2.8 调试步骤

如果需求是双屏同显，建议先把 HDMI和单屏先分别调试完成，再修改配置为双屏同显。


| rk3326_evb:/ # cat /d/regmap/0-0050-core/registers 00: 00000000 04:000100cb 08：002c0898 0c: 084000c0 10:00050465 14：04610029 18:00000000 1c: 00000000 20:00000000 24:00000000 28:00000000 2c: 00000000 30:00000014 34：732d77fd 38：00090734 3c: 005a050e 40:04b400b4 44:000a0276 48：026c0014 4c:04b400b4 50:026c0014 54:00000011 58：00000280 5c: 00001d3e 60:00000000 64:00002184 68：00003025 6c:00000441 70:00200000 74:00005028 78：00000441 7c: 00700000 80:00000000 84:00000020 88:00003c00 8c: 0000ffff 90: 0000000f 94:0000000f 98:00000000 |  |
| --- | --- |

2. 参考现有配置，并对板级配置进行适配。

目前驱动只支持LCD0 作为输入的单显以及双屏同显应用。

Single-channel

LVDS:

Dual-channel

LVDS:

arch/arm64/boot/dts/rockchip/px30-ad-r35-mb-rk618-dual-lvds.dts HDMI: arch/arm64/boot/dts/rockchip/px30-ad-r35-mb-rk618-hdmi.dts DSI: arch/arm64/boot/dts/rockchip/px30-z7-a0-rk618-dsi.dts Clone Mode (HDMI and LVDS): arch/arm64/boot/dts/rockchip/px30-ad-r35-mb-rk618-hdmi-lvds.dts

## 9 MCU/CPU

### 9.1 Interface

MCU 屏又叫 CPU 屏基于 i80 总线协议，具有 CS、RS、RD、WR 四根控制信号线和8/16/18/24 数据线，MCU 屏的优点是控制简单，无需同步信号和时钟信号，缺点是屏内部需要集成 GRAM，成本较高，无法做到大分辨率的屏。目前 RK3188、RK3308、RK3326/PX30 支持 MCU 屏。

控制信号：

CS: 屏的片选信号，低有效，和 VSYNC复用。

RS: 数据和命令区分信号，1 表示发送数据，0 表示发送命令，和DCLK 复用。

RD: 1 表示发数据到屏，0 表示从屏读数据(RK 平台不支持)，和DEN复用。

WR: 写使能信号，上升沿有效，和 HSYNC复用。

### 9.2 Panel



特殊属性说明


| Property | Value | Comment |
| --- | --- | --- |
| rgb-mode | p888、p666、p565、s888、s888_dummy | 屏的数据接口类型 |
| rockchip,cmd-type | spi or mcu | spi：通过 spi 接口发送初始化命令mcu：通过 mcu 接口发送初始化命令 |

### 9.3 MCU timing



1) mcu-pix-total: 发送一次数据/命令需要几个 DCLK 周期；

2) mcu-cs-pst/mcu-cs-pend: 片选开始和结束位置；

3) mcu-rw-pst/mcu-rw-pend: 数据发送开始和结束位置；

时序图：



Figure 3-1 i8080 r/w timing

## 10 Dual-Display

1. 主副屏属性配置（HDMI-A/eDP/DP/LVDS/DPI/DSI）

device/rockchip/common/ system.prop

sys.hwc.device.primary=eDP

sys.hwc.device.extend=HDMI-A

2. 关闭 AFBC 特性

VOPL 不支持 AFBC（Arm Frame Buffer Compression），需要关闭 AFBC 特性。

hardware/rockchip/libgralloc/Android.mk

将-DUSE\_AFBC\_LAYER=\$(USE\_AFBC\_LAYER)改为-DUSE\_AFBC\_LAYER=0.

3. DCLK 父时钟配置

如果是 RK3399 平台，并且 uboot 是 rkdevelop 分支，需要对 VOP 的 DCLK 父时钟进行调整，避免时钟切换影响正常显示。



4. 关闭 DDR 变频

如果是 RK3326/PX30 平台，如果因为带宽不足，导致 VOP 报错，需要将 auto-freq-en属性设为0。

## 11 DEBUG

1. 确认显示驱动已经正常加载。



Drm 驱动的加载存在依赖关系，所以可能会多次因为驱动资源暂时获取不到而返回-EPROBE\_DEFER（-517），但是只要配置正确，待相关组件驱动能够完整获取到资源后，最终就会 bound 成功。

2. 当前显示信息

130|rk3399\_all:/ # cat /d/dri/0/summary   

VOP [ff900000.vop]: ACTIVE Connector: eDP overlay\_mode[0] bus\_format[100a] output\_mode[f] color\_space[0] Display mode: 1536x2048p60 clk[200000] real clk[200000] type[8] flag[a] H: 1536 1548 1564 1612 V: 2048 2056 2060 2068 win0-0: DISABLED win1-0: DISABLED win2-0: ACTIVE format: XB24 little-endian (0x34324258) SDR[0] color space[0] csc: y2r[0] r2r[0] r2y[0] csc mode[0] zpos:0 src: pos[512x0] rect[1536x2048] dst: pos[0x0] rect[1536x2048] buf[0]: addr: 0x00000000086e6000 pitch: 8192 offset: 0 win2-1: DISABLED win2-2: DISABLED win2-3:DISABLED win3-0: ACTIVE format: AB24 little-endian (0x34324241) SDR[0] color space[0] csc: y2r[0] r2r[0] r2y[0] csc mode[0] zpos:1 src: pos[0x0] rect[1536x2048] dst: pos[0x0] rect[1536x2048] buf[0]: addr: 0x000000000c8de000 pitch: 6144 offset: 0 win3-1: DISABLED win3-2: DISABLED win3-3: DISABLED post: sdr2hdr[0] hdr2sdr[0] pre : sdr2hdr[0] post CSC: r2y[0] y2r[0] CSC mode[1]   

VOP [ff8f0000.vop]: DISABLED   

rk3399\_all:/ # cat /d/dri/0/summary   

VOP[fF900000.vop]:DISABLED   

VOP [ff8f0000.vop]: DISABLED

3. connector 当前连接状态

rk3399\_all:/ # cat /sys/class/drm/card0-eDP-1/status   

connected   

rk3399 all:/ # cat /sys/class/drm/card0-HDMI-A-1/status   

disconnected

4. connector 当前使能状态

rk3399 all:/ # cat /sys/class/drm/card0-eDP-1/enabled   

enabled   

rk3399\_all:/# cat /sys/class/drm/card0-HDMI-A-1/enabled   

disabled

5. connector 支持的显示模式

rk3399\_ali:/ # cat /sys/class/dm/card0-eDP-1/modes 1536x2048p60

6. connector 当前的显示模式

rk3399 all:/ # cat /sys/class/drm/card0-eDP-1/mode1536x2048p60

7. 手动灭屏/亮屏

\# echo off &gt; /sys/class/drm/card0-eDP-1/status

\# echo on &gt; /sys/class/drm/card0-eDP-1/status
