---
sidebar_position: 1
---

# RGB-MCU

## 前言

文本主要介绍Rockchip平台低速显示接口的调试验证指南。

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

硬件开发工程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 丁凌崧 | 2023-07-01 | 初始发布 |
| V1.1.0 | 丁凌崧 | 2023-07-15 | 添加 mcu-timing 和 display-timings 的详细说明 |
| V1.2.0 | 丁凌崧 | 2023-09-05 | 修改 mcu-timing 和 display-timings 的配置说明 |
| V1.3.0 | 丁凌崧 | 2024-03-21 | 添加 RK3576 支持 |
| V1.4.0 | 丁凌崧 | 2024-06-26 | 添加 SPI RGB Panel 说明 |
| V1.5.0 | 丁凌崧 | 2024-08-27 | 添加 RK3506 支持和 mcu read 功能相关说明 |

## 6. 常见问题

6.1 RGB/MCU屏可以显示图像但屏幕上有噪点或者存在显示错位现象

1. 基础概念

### 1.1 RGB 接口



#### 1.1.1 DE Mode

DB[23:0]数据是否有效仅由Den信号决定，低电平时数据有效，反之无效。

#### 1.1.2 SYNC Mode



DB[23:0]数据由 Vsync 和 Hsync 信号来同步，按照上图时序扫描数据。

### 1.2 MCU 接口

MCU接口也被称为DBI接口或 8080接口，支持TX和 RX端的双向通信，有RS（CSX）、CSN（D/CX）、WEN（WRX）和REN（RDX）四个同步信号，RK平台仅支持MCU接口的TX功能。

#### 1.2.1 Write Timing



CSX、D/CX和 WRX 引脚依次拉低，在DB[23:0]数据有效期间 WRX信号会先拉低再拉高。

#### 1.2.2 Read Timing



CSX、D/CX 和 RDX 引脚依次拉低，在 DB[23:0]数据有效期间 RDX 信号会先拉低再拉高。

• read前先通过一次 write 将所读取的寄存器地址传输给 Panel 端。

• 第一次read返回的数据是无效的，从第二次read开始才是有效的数据。

• MCU read 通常用于 panel 调试期间 debug、通过区分 panel ID 实现多屏兼容功能等应用场景，以及会在下文中介绍的 frame read 功能。

#### 1.2.3 Bypass 和 Normal Mode

• bypass 模式：当 MCU和panel 之间通过 write/read 操作进行指令传输时，工作于 bypass 模式。

• normal 模式：主控将图像通过 MCU接口传输到 panel 端的 ram 中并正常显示的模式，通常在传输完 panel-init-sequence 并确认 panel 正常初始化后就会进入到该模式。

bypass模式下可以包含 write/read 操作，normal模式下仅为 write操作。

## 2. RK 平台支持情况


| SOC 平台 | 是否支持RGB | 是否支持MCU | 是否支持MCURead | VOPVersion | Video Port通路（forVOP 2.0) | Output Mode 支持 |
| --- | --- | --- | --- | --- | --- | --- |
| RK1808 | Y | Y | N | VOP1.0 |  | RGB666/RGB565 |
| RK312X/PX3SE | Y | N | N | VOP1.0 |  | RGB888/RGB666/RGB565 |
| RK3288 | Y | Y | N | VOP1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RK3308B/RK3308BS | Y | Y | N | VOP1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RK3326/PX30 | Y | Y | N | VOP1.0 |  | RGB888/RGB666/RGB565 |
| RK3506 | Y | Y | Y | VOP1.0 |  | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |
| RK3562 | Y | Y | N | VOP2.0 | VP0 | RGB888/RGB666/RGB565/RGB3x8 |
| RK3568 | Y | N | N | VOP2.0 | VP2 | RGB888/RGB666/RGB565 |
| RK3576 | Y | Y | N | VOP2.0 | VP1/VP2 | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |
| RV1103 | Y | Y | N | VOP1.0 |  | RGB3x8 |
| RV1106 | Y | Y | N | VOP1.0 |  | RGB666/RGB565/RGB3x8 |
| RV1109/RV1126 | Y | Y | N | VOP1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |

注：上述 VOP及 VP（Video Port）相关概念参考文档《Rockchip\_Developer\_Guide\_DRM\_Display\_Driver\_CN》。

## 3. 硬件连接

1. RK3562/RK3576/RK3506 平台


| ComponentName | Pin Name | RGB888(MCU) | RGB666(MCU) | RGB565(MCU) | RGB3x8(MCU) | RGB3x6(MCU) | RGB2x8(MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | VO_LCDC_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | VO_LCDC_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | VO_LCDC_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | VO_LCDC_D23 | √ | √ | √ | √(D7_ml) | √(D5_m1) | √(D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ | √ | √(D6_m1) | √(D4_m1) | √(D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ | $\surd$ | √(D5_ml) | √(D3_m1) | √(D5_ml) |
| R4_D20 | VO_LCDC_D20 | $\surd$ | √ | $\surd$ | √(D4_m1) | √(D2_m1) | √(D4_ml) |
| R3_D19 | VO_LCDC_D19 | $\surd$ | √ | $\surd$ | √(D3_ml) | √(D1_m1) | √(D3_m1) |
| R2_D18 | VO_LCDC_D18 | $\surd$ | √ | X | × | × | X |
| R1_D17 | VO_LCDC_D17 | $\surd$ | × | $\times$ | × | x | x |
| R0_D16 | VO_LCDC_D16 | $\surd$ | × | $\times$ | × | x | × |
| G7_D15 | VO_LCDC_D15 | $\surd$ | √ | $\surd$ | √(D2_m1) | √(D0_m1) | √(D2_m1) |
| G6_D14 | VO_LCDC_D14 | $\surd$ | √ | $\surd$ | √(D1_ml) | X | √(D1_m1) |
| G5_D13 | VO_LCDC_D13 | $\surd$ | √ | $\surd$ | √(D0_m1) | X | √(D0_m1) |
| G4_D12 | VO_LCDC_D12 | $\surd$ | √ | $\surd$ | √(D7_m0) | √(D5_m0) | √(D7_m0) |
| G3_D11 | VO_LCDC_D11 | $\surd$ | √ | $\surd$ | √(D6_m0) | √(D4_m0) | √(D6_m0) |
| G2_D10 | VO_LCDC_D10 | $\surd$ | √ | $\surd$ | √(D5_m0) | √(D3_m0) | √(D5_m0) |
| G1_D9 | VO_LCDC_D9 | $\surd$ | X | $\times$ | × | x | × |
| G0_D8 | VO_LCDC_D8 | $\surd$ | × | $\times$ | x | X | x |
| B7_D7 | VO_LCDC_D7 | $\surd$ | $\surd$ | $\surd$ | √(D4_m0) | √(D2_m0) | √(D4_m0) |
| B6_D6 | VO_LCDC_D6 | $\surd$ | $\surd$ | $\surd$ | √(D3_m0) | √(D1_m0) | √(D3_m0) |
| B5_D5 | VO_LCDC_D5 | $\surd$ | $\surd$ | $\surd$ | √(D2_m0) | √(D0_m0) | √(D2_m0) |
| B4_D4 | VO_LCDC_D4 | $\surd$ | $\surd$ | $\surd$ | √(D1_m0) | x | √(D1_m0) |
| B3_D3 | VO_LCDC_D3 | $\surd$ | $\surd$ | $\surd$ | √(D0_m0) | × | √(D0_m0) |
| B2_D2 | VO_LCDC_D2 | $\surd$ | $\surd$ | $\times$ | x | × | x |
| B1_D1 | VO_LCDC_D1 | $\surd$ | $\times$ | $\times$ | × | × | × |
| B0_D0 | VO_LCDC_D0 | √ | X | X | x | X | x |

## 2. RK3568 平台


| Component Name | Pin Name | RGB888 | RGB666 | RGB565 |
| --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK | DCLK | DCLK | DCLK |
| VSYNC | LCDC_VSYNC | VSYNC | VSYNC | VSYNC |
| HSYNC | LCDC_HSYNC | HSYNC | HSYNC | HSYNC |
| DEN | LCDC_DEN | DEN | DEN | DEN |
| R7_D23 | LCDC_D23 | $\surd$ | $\surd$ | $\surd$ |
| R6_D22 | LCDC_D22 | $\surd$ | $\surd$ | $\surd$ |
| R5_D21 | LCDC_D21 | $\surd$ | $\surd$ | $\surd$ |
| R4_D20 | LCDC_D20 | $\surd$ | $\surd$ | $\surd$ |
| R3_D19 | LCDC_D19 | $\surd$ | $\surd$ | $\surd$ |
| R2_D18 | LCDC_D18 | $\surd$ | $\surd$ | X |
| R1_D17 | LCDC_D17 | $\surd$ | $\times$ | X |
| R0_D16 | LCDC_D16 | $\surd$ | $\times$ | $\times$ |
| G7_D15 | LCDC_D15 | $\surd$ | $\surd$ | $\surd$ |
| G6_D14 | LCDC_D14 | $\surd$ | $\surd$ | $\surd$ |
| G5_D13 | LCDC_D13 | $\surd$ | $\surd$ | $\surd$ |
| G4_D12 | LCDC_D12 | $\surd$ | $\surd$ | $\surd$ |
| G3_D11 | LCDC_D11 | $\surd$ | $\surd$ | $\surd$ |
| G2_D10 | LCDC_D10 | $\surd$ | $\surd$ | $\surd$ |
| G1_D9 | LCDC_D9 | $\surd$ | $\times$ | × |
| G0_D8 | LCDC_D8 | $\surd$ | $\times$ | $\times$ |
| B7_D7 | LCDC_D7 | $\surd$ | $\surd$ | $\surd$ |
| B6_D6 | LCDC_D6 | $\surd$ | $\surd$ | $\surd$ |
| B5_D5 | LCDC_D5 | $\surd$ | $\surd$ | $\surd$ |
| B4_D4 | LCDC_D4 | $\surd$ | $\surd$ | $\surd$ |
| B3_D3 | LCDC_D3 | $\surd$ | $\surd$ | $\surd$ |
| B2_D2 | LCDC_D2 | $\surd$ | $\surd$ | × |
| B1_D1 | LCDC_D1 | $\surd$ | $\times$ | X |
| B0_D0 | LCDC_D0 | $\surd$ | X | X |

## 3. RK312X/PX3SE/RK3288/RK3308B/RK3308BS/RK3328/RK3326/PX30/RV1109/RV1126平台


| ComponentName | Pin Name | RGB888(MCU) | RGB666(MCU) | RGB666_CPADHI(MCU) | RGB565(MCU) | RGB565_CPADHI(MCU) | RGB3x8(MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | LCDC_D23/LCD_D23 | √ | X | √ | X | √ | X |
| R6_D22 | LCDC_D22/LCD_D22 | √ | x | √ | x | √ | X |
| R5_D21 | LCDC_D21/LCD_D21 | √ | x | √ | X | √ | x |
| R4_D20 | LCDC_D20/LCD_D20 | √ | X | √ | X | √ | x |
| R3_D19 | LCDC_D19/LCD_D19 | √ | X | √ | x | √ | X |
| R2_D18 | LCDC_D18/LCD_D18 | √ | x | √ | x | x | x |
| R1_D17 | LCDC_D17/LCD_D17 | √ | √ | X | x | x | x |
| R0_D16 | LCDC_D16/LCD_D16 | √ | √ | X | x | x | X |
| G7_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | √ | √ | x |
| G6_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | √ | √ | x |
| G5_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | √ | √ | x |
| G4_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | √ | √ | X |
| G3_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | √ | √ | X |
| G2_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | √ | √ | X |
| G1_D9 | LCDC_D9/LCD_D9 | √ | √ | X | √ | x | x |
| G0_D8 | LCDC_D8/LCD_D8 | √ | √ | X | √ | X | X |
| B7_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ | √ | √ |
| B6_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ | x | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | x | √ | X | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | X | √ | X | √ |

## 3. RK1808/RV1106 平台


| ComponentName | Pin Name | RGB666(MCU) | RGB565(MCU) | RGB565(MCU) | RGB3x8(MCU) |
| --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R5_D17 | LCDC_D17/LCD_D17 | √ | x | X | × |
| R4_D16 | LCDC_D16/LCD_D16 | √ | × | X | X |
| R3_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | X |
| R2_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | X |
| R1_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | X |
| R0_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | X |
| G5_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | X |
| G4_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | X |
| G3_D9 | LCDC_D9/LCD_D9 | √ | √ | √ | X |
| G2_D8 | LCDC_D8/LCD_D8 | √ | √ | √ | X |
| G1_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ |
| G0_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | √ | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | √ | √ |

4. RV1103 平台


| Component Name | Pin Name | RGB3x8 (MCU) |
| --- | --- | --- |
| DCLK | LCDC_CLK | DCLK(RS) |
| VSYNC | LCDC_VSYNC | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC | HSYNC(WRN) |
| DEN | LCDC_DEN | DEN(RDN) |
| D7 | LCDC_D7 | √ |
| D6 | LCDC_D6 | √ |
| D5 | LCDC_D5 | √ |
| D4 | LCDC_D4 | √ |
| D3 | LCDC_D3 | √ |
| D2 | LCDC_D2 | √ |
| D1 | LCDC_D1 | √ |
| DO | LCDC_D0 | √ |

## 4. 软件配置

### 4.1 显示通路



VOP（Video Output Process）是 RK 平台的显示处理单元，存在 VOP 1.0 和 VOP 2.0 两种架构主要区别是对多显的支持方式不同，详细的介绍可以查阅文档

### 4.2 Panel 配置

RGB panel 驱动可以参考 drivers/gpu/drm/panel/panel-simple.c 中的实现，下面为典型的 panel 节点配置：

```dts
/{
panel: panel {
compatible = "simple-panel";
bus-format = <MEDIA BUS FMT RGB888 1X24>;
backlight = <&backlight>;
enable-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
enable-delay-ms = <20>;
reset-gpios = <&gpio3 RK PB0 GPIO ACTIVE LOW>;
reset-delay-ms = <10>;
status = "okay";
display-timings {
native-mode = <&fx070 dhm11boe timing>;
fx070 dhm11boe timing: timing0 {
clock-frequency = <50000000>;
hactive = <1024>;
vactive = <600>;
hback-porch = <140>;
hfront-porch = <160>;
vback-porch = <20>;
vfront-porch = <20>;
hsync-len = <20>;
vsync-len = <2>;
hsync-active = <0>;
vsync-active = <0>;
de-active = <0>;
pixelclk-active = <0>;
};
};
port {
panel_in_rgb: endpoint {
remote-endpoint = <&rgb out panel>;
};
};
};
};
&backlight {
pwms = <&pwm9 0 25000 0>;
status = "okay";
};
```


| Display Mode | Bus Format | Cycles Per Pixel |
| --- | --- | --- |
| RGB888 (24bit) | MEDIA_BUS_FMT_RGB888_1X24 | 1 |
| RGB666 (18bit) | MEDIA_BUS_FMT_RGB666_1X18 | 1 |
| RGB666_CPADHI (18bit) | MEDIA_BUS_FMT_RGB666_1X24_CPADHI | 1 |
| RGB565 (16bit) | MEDIA_BUS_FMT_RGB565_1X16 | 1 |
| RGB565_CPADHI (16bit) | MEDIA_BUS_FMT_RGB565_1X24_CPADHI | 1 |
| RGB3x8 (8bit) | MEDIA_BUS_FMT_RGB888_3X8MEDIA_BUS_FMT_RGB888_3X8 | 3 |
| RGB4x8(8bit) | MEDIA_BUS_FMT_RGB888_DUMMY_4X8MEDIA_BUS_FMT_BGR888_DUMMY_4X8 | 4 |

• backlight节点的pwms配置需要根据硬件实际的连接情况修改，在显示图像前需要确保背光已经正常点亮。详见 pwm 模块参考文档《Rockchip\_Developer\_Guide\_Linux\_PWM\_CN》。  

。（可选）enable引脚通常用于屏端供电的使能，gpio配置取决于供电电路的具体设计。

。（可选）reset引脚通常屏端会直接引出，并在datasheet 中说明触发复位功能的条件，gpio配置取决于复位电路的具体设计。

o（可选）enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms根据 datasheet 的 power/reset/signal 时序要求配置。

• display-timings时序节点屏幕 datasheet 会提供推荐配置，用户也可以根据具体的应用需求在指定的上下阈值区间内微调，下图为示例 panel 节点配置对应的 panel datasheet:


| ITEM | SYMBOL | MIN. | TYP. | MAX. | UNIT | Note |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEMODE | Dot Clock | 1/tCLK | 45 | 51.2 | 57 | MHz |  |
| DCLK pulse duty | Tcwh | 40 | 50 | 60 | % |  |  |
| Horizontal total Time | tH | 1324 | 1344 | 1364 | tCLK |  |  |
| Horizontal effective Time | tHA | 1024 | tCLK |  |  |  |  |
| Horizontal Blank Time | tHB | 300 | 320 | 340 | tCLK |  |  |
| Vertical total Time | tV | 625 | 635 | 645 | tH |  |  |
| Vertical effective Time | tVA | 600 | tH |  |  |  |  |
| Vertical Blank Time | tVB | 25 | 35 | 45 | tH |  |  |
| SYNCMODE | Horizontal total Time | TH | 1324 | 1344 | 1364 | tCLK |  |
| Horizontal Pulse Width | Thpw |  | 20 | ■ | tCLK | thb + thpw =160DCLK isfxed |  |
| Horizontal Back Porch | Thb |  | 140 | • | tCLK |  |  |
| Horizontal Front Porch | Thfp | 140 | 160 | 180 | tCLK |  |  |
| Horizontal effective Time | THA | 1024 | tCLK |  |  |  |  |
| Vertical total Time | TV | 625 | 635 | 645 | tH |  |  |
| Vertical Pulse Width | Tvpw |  | 3 | - | th | tvpw + tvb=23th is fixed |  |
| Vertical Back Porch | Tvb | = | 20 | - | th |  |  |
| Vertical Front Porch | Tvfp | 2 | 12 | 22 | th |  |  |
| Vertical Valid | Tvd | 600 | th |  |  |  |  |

同时 DRM 框架对于 display\_timing 结构体及其变量的描述可以在文件 include/video/display\_timing.h中找到，如下所示：

```c
* have in one setting. This struct can later be converted to struct videomode
* (see include/video/videomode.h). As each timing entry can be defined as a
* range, one struct display timing may become multiple struct videomodes.
* Example: hsync active high, vsync active low
大
大 Active Video
* Video xxxxxxxxxxxxxxxxxxxxxx
|<- sync ->|<- back ->|<----- active ----->|<- front ->|<- sync..
大 porch porch
大
* HSync _
★
* vsync ~
*/
struct display_timing {
struct timing entry pixelclock;
struct timing entry hactive; /* hor. active video */
struct timing entry hfront porch; /* hor. front porch */
struct timing entry hback porch; /* hor. back porch */
struct timing entry hsync len; /* hor. sync len */
struct timing entry vactive; /* ver. active video */
struct timing entry vfront porch; /* ver. front porch */
struct timing entry vback porch; /* ver. back porch */
struct timing entry vsync len; /* ver. sync len */
enum display_flags flags; /* display flags */
};
```

帧率的计算则可以参考 drivers/gpu/drm/drm\_modes.c 中 drm\_mode\_vrefresh()函数的实现，设帧率为fr则计算公式为：

clock   

fr =   

htotal × vtotal

/\*\*   

struct drm display mode - DRM kernel-internal display mode structure   

@hdisplay: horizontal display size   

\* @hsync\_start: horizontal sync start   

\* @hsync\_end: horizontal sync end   

★ @htotal: horizontal total size   

★ @hskew: horizontal skew?!   

大 @vdisplay: vertical display size   

大 @vsync\_start: vertical sync start   

大 @vsync end: vertical sync end   

@vtotal: vertical total size   

\* @vscan: vertical scan?!   

大   

\* The horizontal and vertical timings are defined per the following diagram.   

大   

\* : :

```c
Active Front Sync Back
Region Porch Porch
//////////////////////1
//////////////////////
//////////////////////
[hv]display
[hv]sync_start
[hv]sync end
[hv]total
/* 大
drm mode vrefresh - get the vrefresh of a mode
@mode: mode
Returns:
@modes's vrefresh rate in Hz, rounded to the nearest integer. Calculates the
* value first if it is not yet set.
*/
int drm_mode_vrefresh(const struct drm_display_mode *mode)
unsigned int num, den;
if (mode->htotal == 0 || mode->vtotal == 0)
return 0;
num = mode->clock;
den = mode->htotal * mode->vtotal;
if (mode->flags & DRM MODE FLAG INTERLACE)
num *= 2;
if (mode->flags & DRM_MODE_FLAG_DBLSCAN)
den *= 2;
if (mode->vscan > 1)
den *= mode->vscan;
return DIV ROUND CLOSEST ULL(mul u32 u32(num, 1000), den);
EXPORT SYMBOL(drm mode vrefresh);
```

#### 4.2.1 SPI 初始化配置

有些 RGB 屏需要主控通过 SPI 接口发送指令以完成初始化流程，drivers/gpu/drm/panel/panel-simple.c 支持 3-wire 9-bit serial interface 协议：



由于RK平台 SPI模块支持的数据传输粒度为4/8/16 bit，上述协议为9 bit数据单元，因此在panel-simple 驱动中是用 GPIO 模拟 SPI 来实现。

kernel-5.10及以上内核版本的典型配置：

```dts
spi gpio: spi-gpio {
compatible = "spi-gpio";
#address-cells = <0x1>;
#size-cells = <0x0>;
pinctrl-names = "default";
pinctrl-0 = <&spi gpio pins>;
spi-delay-us = <10>;
status = "okay";
sck-gpios = <&gpio4 RK PA5 GPIO ACTIVE HIGH>;
miso-gpios = <&gpio4 RK PA7 GPIO ACTIVE HIGH>;
mosi-gpios = <&gpio4 RK PA6 GPIO ACTIVE HIGH>;
cs-gpios = <&gpio4 RK PA4 GPIO ACTIVE HIGH>;
num-chipselects = <1>;
```

/\*   

\* 320x480 RGB/MCU screen K350C4516T   

\*/   

```dts
panel: panel {
compatible = "simple-panel-spi";
reg = <0>;
bus-format = <MEDIA BUS FMT RGB666 1X18>;
backlight = <&backlight>;
enable-gpios = <&gpio3 RK PA6 GPIO ACTIVE LOW>;
enable-delay-ms = <20>;
reset-gpios = <&gpio3 RK PB0 GPIO ACTIVE LOW>;
reset-delay-ms = <10>;
prepare-delay-ms = <20>;
unprepare-delay-ms = <20>;
disable-delay-ms = <20>;
init-delay-ms = <10>;
width-mm = <217>;
height-mm = <136>;
rockchip,cmd-type = "spi";
status = "okay";
// type:0 is cmd, 1 is data
panel-init-sequence = [
```

/\* type delay num val1 val2 val3 \*/   

00 00 01 e0   

01 00 01 00

00 78 01 11   

00 00 01 29   

1;   

panel-exit-sequence = [   

//type delay num val1 val2 val3

00 0a 01 28   

00 78 01 10   

1;   

```
display-timings {
native-mode = <&kd050fwfba002 timing>;
kd050fwfba002_timing: timing0 {
```

/\*   

\* 10453500 for RGB666(18bit)   

\*/   

```
clock-frequency = <10453500>;
hactive = <320>;
vactive = <480>;
hback-porch = <10>;
hfront-porch = <5>;
vback-porch = <10>;
vfront-porch = <5>;
hsync-len = <10>;
vsync-len = <10>;
hsync-active = <0>;
vsync-active = <0>;
de-active = <0>;
pixelclk-active = <1>;
};
};
port {
panel in rgb: endpoint {
remote-endpoint = <&rgb_out_panel>;
};
};
};
};
```

• 需要打开配置项 CONFIG\_SPI\_GPIO，并根据硬件设计配置对应的 sck-gpios、miso-gpios、mosi-gpios 和 cs-gpios，详见驱动 drivers/spi/spi-gpio.c

· panel节点配置与上文基本相同，注意点如下：

。 compatible 修改为”simple-panel-spi“。

。rockchip,cmd-type 需配置为“spi"。

。 在 panel-init-sequence/panel-exit-sequence 填上相应的 init/deinit 序列。

```dts
panel: panel {
compatible = "simple-panel";
```

...   

```
spi-sdi-gpios = <&gpio1 RK PC7 GPIO ACTIVE HIGH>;

spi-scl-gpios = <&gpio1 RK_PD0 GPIO_ACTIVE_HIGH>;
spi-cs-gpios = <&gpio1 RK_PD1 GPIO_ACTIVE_HIGH>;
rockchip,cmd-type = "spi";
/* type:0 is cmd, 1 is data */
panel-init-sequence = [
```

/\* type delay num val1 val2 val3 \*/   

00 00 01 e0   

00 78 01 11   

00 00 01 29   

1;   

panel-exit-sequence = [   

/\* type delay num val1 val2 val3 \*/   

00 0a 01 28   

00 78 01 10   

1;   

```
}i
```

• 不同内核版本 SPI RGB屏的参考配置如下：

### 4.3 RGB 接口

rgb 驱动对应文件 drivers/gpu/drm/rockchip/rockchip\_rgb.c，参考 dts 配置如下：

```dts
&rgb {
status = "okay";
pinctrl-0 = <&rgb666_pins>;
ports {
port@1 {
reg = <1>;
rgb_out_panel: endpoint {
remote-endpoint = <&panel_in_rgb>;
}i
};
}i
};
//VOP 1.0
&rgb in vop {
status = "okay";
};
//VOP 2.0
&rgb_in_vp0 {
status = "okay";
};
```

• 对于VOP1.0和 VOP2.0两种架构，RGB接口相关节点的配置有所不同，参考配置：

。VOP 1.0: arch/arm/boot/dts/rv1106-evb-ext-rgb-v10.dtsi。

。VOP 2.0：可以参考 arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-rgb-FX070-DHM11BOE-  

A.dts。

• pinctrl 配置需要根据实际的硬件连接确定，可以在 rkxxxx-pinctrl.dtsi/rvxxxx-pinctrl.dtsi 文件中找到各种线序对应的定义。

### 4.4 MCU 接口

mcu接口及 mcu panel 驱动可以查看 drivers/gpu/drm/rockchip/rockchip\_rgb.c，dts 配置与 rgb 接口基本相同，额外需要加上切换mcu模式的标志和 timing，参考配置如下：

```c
&rgb {
status = "okay";
rockchip,data-sync-bypass;
pinctrl-names = "default";
/*
* rgb3x8 pins m0/rgb3x8 pins m1 for RGB3x8(8bit)
* rgb565 pins for RGB565(16bit)
*/
pinctrl-0 = <&rgb565_pins>;
/*
* 320x480 RGB/MCU screen K350C4516T
*/
mcu_panel: mcu-panel {
/*
* MEDIA BUS FMT RGB888 3X8 for RGB3x8(8bit)
* MEDIA BUS FMT RGB565 1X16 for RGB565(16bit)
*/
bus-format = <MEDIA BUS FMT RGB565 1X16>;
backlight = <&backlight>;
enable-gpios = <&gpio1 RK PA3 GPIO ACTIVE LOW>;
enable-delay-ms = <20>;
reset-gpios = <&gpio1 RK PA4 GPIO ACTIVE LOW>;
reset-value = <0>;
reset-delay-ms = <10>;
prepare-delay-ms = <20>;
unprepare-delay-ms = <20>;
disable-delay-ms = <20>;
init-delay-ms = <10>;
width-mm = <217>;
height-mm = <136>;
// type:0 is cmd, 1 is data
panel-init-sequence = [
//type delay num val1 val2 val3
01 00 01 55 /*
* interface pixel format:
* 66 for RGB3x8(8bit)
* 55 for RGB565(16bit)
*/
```

01 00 01 a0 /\*   

\* frame rate control:   

\* 70 (45hz) for RGB3x8(8bit)   

\* a0 (60hz) for RGB565(16bit)   

\*/   

…   

01 00 01 02 /\*   

\* display function control:   

\* 32 for RGB   

\* 02 for MCU   

\*/   

00 78 01 11   

00 32 01 29   

00 00 01 2c   

1;   

panel-exit-sequence = [   

//type delay num val1 val2 val3

00 0a 01 28   

00 78 01 10   

1;   

```
display-timings {
native-mode = <&kd050fwfba002_timing>;
kd050fwfba002_timing: timing0 {
```

/\*   

\* 7840125 for frame rate 45Hz   

\* 10453500 for frame rate 60Hz   

\*/   

```dts
clock-frequency = <10453500>;
hactive = <320>;
vactive = <480>;
hback-porch = <10>;
hfront-porch = <5>;
vback-porch = <10>;
vfront-porch = <5>;
hsync-len = <10>;
vsync-len = <10>;
hsync-active = <0>;
vsync-active = <0>;
de-active = <0>;
pixelclk-active = <1>;
};
};
port {
panel_in_rgb: endpoint {
remote-endpoint = <&rgb out panel>;
};
};
};
ports {
rgb_out: port@1 {
reg = <1>;
#address-cells = <1>;
#size-cells = <0>;

rgb_out_panel: endpoint@0 {
reg = <0>;
remote-endpoint = <&panel_in_rgb>;
}i
};
};
};
};
//VOP 1.0
&rgb_in_vop {
status = "okay";
};
&vop {
status = "okay";
```

/\*   

\* Default config is as follows:   

\* mcu-pix-total = &lt;9&gt;;   

\* mcu-cs-pst = &lt;1&gt;;   

\* mcu-cs-pend = &lt;8&gt;;   

\* mcu-rw-pst = &lt;2&gt;;   

\* mcu-rw-pend = &lt;5&gt;;   

\* mcu-hold-mode = &lt;0&gt;; // default set to 0   

\* To increase the frame rate, reduce all parameters becaus   

\* the max dclk rate of mcu is 150M in rv1103/rv1106.   

\*/   

```dts
mcu-timing {
mcu-pix-total = <5>;
mcu-cs-pst = <1>;
mcu-cs-pend = <4>;
mcu-rw-pst = <2>;
mcu-rw-pend = <3>;
mcu-hold-mode = <0>; // default set to 0
};
}i
//VOP 2.0
&rgb_in_vp0 {
status = "okay";
}i
&vp0 {
status = "okay";
```

/\*   

\* Default config is as follows:   

\* mcu-pix-total = &lt;9&gt;;   

\* mcu-cs-pst = &lt;1&gt;;   

\* mcu-cs-pend = &lt;8&gt;;   

\* mcu-rw-pst = &lt;2&gt;;   

\* mcu-rw-pend = &lt;5&gt;;

```c
* mcu-hold-mode = <0>; // default set to 0
* To increase the frame rate, reduce all parameters because
* the max dclk rate of mcu is 150M in rk3562.
*/
mcu-timing {
mcu-pix-total = <5>;
mcu-cs-pst = <1>;
mcu-cs-pend = <4>;
mcu-rw-pst = <2>;
mcu-rw-pend = <3>;
mcu-hold-mode = <0>; // default set to 0
};
};
```

• 对于VOP1.0和 VOP2.0两种架构，MCU接口相关节点的配置有所不同，参考配置：

o VOP 1.0: arch/arm/boot/dts/rv1106-evb-ext-mcu-v10.dtsi。

。VOP 2.0：可以参考 arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-mcu-k350c4516t.dts。

• 驱动中会根据 rgb 节点下的 rockchip,data-sync-bypass 属性来切换 mcu 和 rgb 两种接口模式，不加该属性默认为rgb接口，使能后则切换到mcu接口。

。确保 panel 节点命名为 mcu-panel，驱动中根据此去识别并解析 mcu panel 参数。

。compatible属性可以删除，无需配置。

。 序列由屏厂提供，通常需要从c文件转换为DTS配置。

。序列每行从左往右依次为：指令类型cmd/data、延迟时间（ms）、数据长度（byte）、数据。

。帧率的配置通常也在序列初始化阶段进行，需要跟《Panel配置》中计算出的帧率相对应。下面是示例驱动IC手册中的说明

5.3.2. Frame Rate Control (In Normal Mode/Full Colors) (B1h)


| B1h | FRMCTR1 (Frame Rate Control (In Normal Mode/Full colors)) |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | D/CX | RDX | WRX | D [23:8] | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | HEX |
| Command | 0 | 1 | ← | XX | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | B1h |
| 1ª Parameter | 1 | 1 | ← | XX | FRS [3:0] | 0 | 0 | DIVA[1:0] | B0h |  |  |  |  |
| 2nd Parameter | 1 | 1 | ← | XX | 0 | 0 | 0 | RTNA [4:0] | 11h |  |  |  |  |


| FRS [3:0] | CNT | Frame rate(Hz)Tearing Effect Line OFF(R34h) | Frame rate(Hz)Tearing Effect Line ON(R35h)VBP+VFP &lt;24 |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 37 | 28.78 | 27.64 |
| 0 | 0 | 0 | 1 | 35 | 30.38 | 29.17 |
| 0 | 0 | 1 | 0 | 33 | 32.17 | 30.89 |
| 0 | 0 | 1 | 1 | 31 | 34.18 | 32.82 |
| 0 | 1 | 0 | 0 | 29 | 36.46 | 35.01 |
| 0 | 1 | 0 | 1 | 27 | 39.06 | 37.51 |
| 0 | 1 | 1 | 0 | 25 | 42.07 | 40.40 |
| 0 | 1 | 1 | 1 | 23 | 45.57 | 43.76 |
| 1 | 0 | 0 | 0 | 21 | 49.71 | 47.74 |
| 1 | 0 | 0 | 1 | 19 | 54.69 | 52.52 |
| 1 | 0 | 1 | 0 | 17 | 60.76 | 58.35 |
| 1 | 0 | 1 | 1 | 15 | 68.36 | 65.65 |
| 1 | 1 | 0 | 0 | 13 | 78.13 | 75.03 |
| 1 | 1 | 0 | 1 | 11 | 91.15 | 87.53 |

$\mathrm &#123; \Delta t _ &#123; m i n &#125; &#125; \mathrm &#123; : &#125;$

(panel datasheet 中 $\mathbf &#123; t &#125; _ &#123; \mathrm &#123; w c &#125; &#125; = 4 0$ 而驱动 ic datasheet $\mathrm &#123; t &#125; _ &#123; \mathrm &#123; w c &#125; &#125; = 3 0$ ，取两者中的较大值）

$$

t _ &#123; m i n &#125; = T _ &#123; C H W &#125; + T _ &#123; A S T &#125; + T _ &#123; W C &#125; + T _ &#123; C H W &#125; = 4 0 ( n s )

$$

对于示例 panel，同时支持MEDIA\_BUS\_FMT\_RGB888\_3X8 和

$\operatorname &#123; f r &#125; _ &#123; \operatorname &#123; s - m a x &#125; &#125;$ $\mathrm &#123; f r &#125; _ &#123; \mathrm &#123; p - m a x &#125; &#125; )$

$$

```
f r < \frac { 1 * 1 0 0 0 0 0 0 0 0 0 0 } { h t o t a l \times p t o t a l \times c p p \times t _ { m i n } }
```

$$

$$

h t o t a l = h a c t i v e + h b a c k - p o r c h + h f r o n t - p o r c h + h s y n c - l e n = 3 4 5

$$

$$

v t o t a l = v a c t i v e + v b a c k - p o r c h + v f r o n t - p o r c h + v s y n c - l e n = 5 0 5

$$

$$

f r _ &#123; s - m a x &#125; &lt; \frac &#123; 1 * 1 0 0 0 0 0 0 0 0 0 0 &#125; &#123; 3 4 5 \times 5 0 5 \times 3 \times 4 0 &#125; \approx 4 7 . 8 3 ( H z )

$$

$$

f r _ &#123; p - m a x &#125; &lt; \frac &#123; 1 * 1 0 0 0 0 0 0 0 0 0 &#125; &#123; 3 4 5 \times 5 0 5 \times 1 \times 4 0 &#125; \approx 1 4 3 . 4 9 ( H z )

$$

因此，串行 rgb3x8模式的帧率 $\mathrm &#123; f r &#125; _ &#123; \mathrm &#123; s &#125; &#125; = 4 5 ( \mathrm &#123; H z &#125; )$ ，并行 rgb1x16模式的帧率 $\mathrm &#123; f r &#125; _ &#123; \mathrm &#123; p &#125; &#125; &#123; = &#125; 6 0 \mathrm &#123; ( H z ) &#125;$

（下文变量的下缀 s 表示 serial串行，p表示 parallel并行，不再赘述)

同时也可算出两者 display-timings 配置中 clock-frequency 属性的值：

$$

c l o c k _ &#123; s &#125; = f r _ &#123; s &#125; \times h t o t a l \times v t o t a l = 4 5 \times 3 4 5 \times 5 0 5 = 7 8 4 0 1 2 5

$$

$$

c l o c k _ &#123; p &#125; = f r _ &#123; p &#125; \times h t o t a l \times v t o t a l = 6 0 \times 3 4 5 \times 5 0 5 = 1 0 4 5 3 5 0 0

$$

根据 $\mathrm &#123; \ d c l k _ &#123; \mathrm &#123; m a x &#125; &#125; &#125;$ 和初始化序列中配置的帧率（设为变量fr，值通常为60Hz），可以算出ptotal的最大值：

$$

p t o t a l _ &#123; m a x &#125; &lt; \frac &#123; d c l k _ &#123; m a x &#125; &#125; &#123; c p p \times c l o c k &#125; - 1

$$

$$

p t o t a l _ &#123; s - m a x &#125; &lt; \frac &#123; 1 5 0 0 0 0 0 0 &#125; &#123; 3 \times 7 8 4 0 1 2 5 &#125; - 1 \approx 5 . 3 8

$$

$$

p t o t a l _ &#123; p - m a x &#125; &lt; \frac &#123; 1 5 0 0 0 0 0 0 0 &#125; &#123; 1 \times 1 0 4 5 3 5 0 0 &#125; - 1 \approx 1 3 . 3 5

$$

实际的 ptotal 取两者较小值 ptotal = 5，同时由时序图可确定 mcu-timing的其他属性值。

。最后，还需要根据datasheet时序要求对计算出的实际值作校验。

MCU接口的实际 dclk 并不是 display-timings 配置中 clock-frequency 属性的值，还和 mcu-timing 中 mcu-pix-total 配置和 Cycles Per Pixel 值有关：

$$

```
\begin{array} { c } { d c l k = c l o c k \times c p p \times ( p t o t a l + 1 ) } \\ { d c l k _ { s } = 7 8 4 0 1 2 5 \times 3 \times 6 = 1 4 1 1 2 2 2 5 0 } \\ { d c l k _ { p } = 1 0 4 5 3 5 0 0 \times 1 \times 6 = 6 2 7 2 1 0 0 0 } \end{array}
```

$$

上述 dclk 值均未超过 $\mathrm &#123; \ d c l k _ &#123; \mathrm &#123; m a x &#125; &#125; &#125;$ ，同时可以计算出 MCU\_PIX\_TOTAL 区间实际时间：

$$

```
\begin{array} { r l } & { t _ { s } = \frac { \left( \ b { p t o t a l } + 1 \right) \times 1 0 0 0 0 0 0 0 0 0 0 } { d c l k _ { s } } \approx 4 2 . 5 2 ( n s ) } \\ & { t _ { p } = \frac { \left( \ b { p t o t a l } + 1 \right) \times 1 0 0 0 0 0 0 0 0 0 0 } { d c l k _ { p } } \approx 9 5 . 6 6 ( n s ) } \end{array}
```

$$

上述 MCU\_PIX\_TOTAL 区间时间 t 均满足大于 40 ns 的要求。

#### 4.4.1 MCU Bypass Timing 配置

早期支持 MCU 接口的平台，如 RK3308 和 PX30 等，bypass mode 的 timing 配置跟 normal mode 是一致的。在 RK3562 及之后的平台，IC 在设计上进行了优化，驱动中会有一组默认的 bypass mode timing 用于满足大多数情况下 bypass mode 中 write/read 操作的需要，详见

drivers/gpu/drm/rockchip/rockchip\_vop\_reg.c 和 drivers/gpu/drm/rockchip/rockchip\_vop2\_reg.c 中结构体vop\_mcu\_bypass\_cfg的相关定义，如：

```c
static struct rockchip_mcu_timing rk3506_mcu_bypass_timing = {
.mcu_pix_total = 26,
.mcu_cs_pst = 3,
.mcu_cs_pend = 24,
.mcu_rw_pst = 6,
.mcu_rw_pend = 15,
};
static const struct vop_mcu_bypass_cfg rk3506_mcu_bypass_cfg =
.timing = &rk3506_mcu_bypass_timing,
.dclk_rate = 120000000,
};
```

如果默认的 bypass mode timing 无法满足应用场景的需要，支持在 dts 中指定（参考arch/arm/boot/dts/rk3506g-evb1-v10-mcu-k350c4516t.dts):

```dts
&vop {
mcu-timing {
mcu-pix-total = <5>;
mcu-cs-pst = <1>;
mcu-cs-pend = <4>;
mcu-rw-pst = <2>;
mcu-rw-pend = <3>;
mcu-hold-mode = <0>;
}i
mcu-bypass-timing {
mcu-pix-total = <9>;

mcu-cs-pst = <1>;
mcu-cs-pend = <8>;
mcu-rw-pst = <2>;
mcu-rw-pend = <7>;
mcu-hold-mode = <0>;
};
};
```

• 需要注意的是，bypass mode 中可能会涉及 MCU read 操作，而通常情况下，MCU read timing的min限制会大于MCU write timing（可以参考前一章节的示例 datasheet），所以 mcu-bypass-timing 通常会以 datasheet 中 read timing 的限制去计算和配置，以同时兼容 write/read操作的时序要求。

#### 4.4.2 MCU Frame Write/Read

在 MCU normal mode 下，可以通过 frame write/read 功能在帧间去进行主控和 panel 间的指令交互行为，用于读取panel的状态寄存器、修改显示的起始位置等，通常用于静电压测或满足一些特定panel逐帧更新显示起始位置的需要等场景。

使能该功能需要在 dts 中配置 panel-frame-sequence 序列，可以参考 arch/arm/boot/dts/rk3506g-evb1-v10-mcu-k350c4516t.dts，示例如下：

```dts
&rgb {
mcu_panel: mcu-panel {
panel-frame-sequence = [
//type delay num val1 val2 val3
```

00 00 01 0a   

02 00 01 0a   

02 00 01 0a   

00 00 01 2c   

];   

```
}i
};
```

• 帧间的 write/read 操作是在 drivers/gpu/drm/rockchip/rockchip\_rgb.c 中实现的：

```c
static void mcu_interframe_work_func(struct work_struct *work)
1
struct rockchip_mcu_panel *mcu_panel =
container_of(work, struct rockchip_mcu_panel, interframe_work);
struct drm_panel *panel = &mcu_panel->base;
struct drm_display_mode *mode = mcu_panel->desc->mode;
struct drm crtc *crtc = mcu panel->encoder->crtc;
u32 timeout = DIV_ROUND_CLOSEST_ULL(1000, drm_mode_vrefresh(mode));
int ret;
ret = rockchip_drm_wait_vact_end(crtc, timeout);
if (ret) {
DRM_DEV_ERROR(panel->dev, "wairt vact end timed out\n");
```

```c
return;
}
ret = rockchip_mcu_panel_xfer_mcu_cmd_seq(mcu_panel, mcu_panel->desc-
>frame_seq);
if (ret) {
DRM DEV ERROR(panel->dev, "failed to send frame cmds seq\n");
return;
}
schedule_work(&mcu_panel->interframe_work);
};
```

如果有特定的应用需求，可以自行修改上述work的实现。

## 5. 调试流程

1. 确认 rgb/mcu接口各 pin 脚的硬件连接，需要注意每个平台 pin脚的映射方式可能会有所不同，具体看上文《硬件连接》章节。


| LCDC CLK C | R9002 0R 1 | 2 R0402 5% |  | LCDC_CLK | 5 |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
| LCDC DEN C | R9003 OR 1 | 2 R0402 5% |  | LCDC DEN | 5 |
| LCDC HSYNC C | R9004 OR 1 | 2 R0402 | 5% | LCDC HSYNC | 5 |
| LCDC VSYNC C | R9005 0R 1 | 2 R0402 5% |  | LCDC VSYNC | 5 |
|  |  |  |  |  |  |
| LCDC DO C LCDC D1 C | R9006 0R 1 | 2 | R0402 5% | LCDC_DO | 5 |
|  | R9007 0R 1 | 2 | R0402 5% | LCDC D1 | 5 |
| LCDC D2 C | R9008 OR 1 | 2 | R0402 5% | LCDC D2 | 5 |
| LCDC D3 C | R9009 0R 1 | 2 R0402 5% |  | LCDC D3 | 5 |
| LCDC D4 C | R9010 0R 1 | 2 R0402 5% |  | LCDC D4 | 5 |
| LCDC D5 C LCDC D6 C | R9011 0R 1 | 2 R0402 5% | R0402 5% | LCDC D5 | 5 |
| LCDC D7 C | R9012 OR 1 | 2 |  | LCDC D6 | 55 |
|  | R9013 0R 1 | 2 R0402 5% |  | LCDC_D7 |  |
| LCDC D8 C | R9014 0R 1 | 2 | R0402 5% |  |  |
| LCDC D9 C | R9015 OR 1 | 2 | R0402 5% | LCDC_D8 LCDC D9 | 55 |
| LCDC D10 C | R9016 0R 1 | 2 | R0402 5% | LCDC D10 |  |
| LCDC D11 C | R9017 0R 1 |  | 2 R0402 5% | LCDC D11 | 5 5 |
| LCDC D12 C | R9018 OR 1 | 2 | R0402 5% | LCDC D12 |  |
| LCDC D13 C | R9019 0R 1 |  | 2 R0402 5% | LCDC D13 | 5 |
| LCDC D14 C | R9020 0R 1 |  | 2 R0402 5% | LCDC D14 | 5 |
| LCDC D15 C | R9021 0R 1 |  | 2 R0402 5% | LCDC_D15 | 5 5 |
|  |  |  |  |  |  |
| LCDC D16 C | R9022 0R 1 | 2 | R0402 5% | LCDC_D16 | 5 |
| LCDC D17 C | R9023 0R 1 | 2 | R0402 5% | LCDC D17 | 5 |
| LCDC D18 C | R9024 0R 1 | 2 | R0402 5% | LCDC D18 |  |
| LCDC D19 C | R9025 0R 1 | 2 | R0402 5% | LCDC D19 |  |
| LCDC D20 C | R9026 0R 1 | 2 | R0402 5% | LCDC D20 |  |
| LCDC D21 C | R9027 0R 1 | 2 | R0402 5% | LCDC D21 | 5555 |
| LCDC D22 C | R9028 OR 1 |  | 2 R0402 5% | LCDCD22 | 5 |
| LCDC D23 C | R9029 0R 1 |  | 2 R0402 5% | LCDC D23 | 5 |
|  |  |  |  |  |  |

2. 根据 panel datasheet 正确配置 enable/reset 控制引脚极性和上电时序，以及背光所用到的 pwm 通道。若为mcu屏，还需要配置正确的初始化序列。

VOCON RESET C R9030 0R 1 2 R0402 5% LCD RST 5   

VOCON PWREN C R9031 0R 1 2 R0402 5% SSLCDPWREN 5   

VOCON LEDPWM C R9032 0R 1 2 R0402 5% SLCDC\_BL\_PWM 5

3. 确保背光已点亮的情况下，需再确认下enable/reset控制引脚是否为正确的电平，若实际测量仍非预期值，则确认下iomux是否正确配置为GPIO。

## 6. 常见问题

## 6.1RGB/MCU屏可以显示图像但屏幕上有噪点或者存在显示错位现象

答：可以尝试翻转下 dclk 时钟极性，对应 display-timings 下的 pixelclk-active属性，可以改变 dclk与data信号的相对相位。

```
display-timings {
native-mode = <&fx070_dhm11boe_timing>;
fx070_dhm11boe_timing: timing0 {
clock-frequency = <50000000>;
hactive = <1024>;
vactive = <600>;
hback-porch = <140>;
hfront-porch = <160>;
vback-porch = <20>;
vfront-porch = <20>;
hsync-len = <20>;
vsync-len = <2>;
hsync-active = <0>;
vsync-active = <0>;
de-active = <0>;
pixelclk-active = <0>; // 1 翻转， 0 不翻转
};
};
```
