---
sidebar_position: 1
---

# Rockchip DP 信号测试指南

## 前言

## 概述

本文提供为 RK3576 RK3588 DP PHY 信号测试提供寄存器配置指导。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3576/RK3588 | Linux-5.10/Linux-6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 张玉炳 | 2024/5/31 | 初始版本 |

## 1. DP PHY 简介

RK3576 和 RK3588 DP PHY 为 DP 和 USB 共用的 PHY(USBDP PHY)，本文介绍 USBDP PHY 作为 DP功能使用时的信号指标调整方法。

RK3576 和 RK3588 USBDP PHY 的基地址如下：


| USBDP PHY | USBDP PHY 基地址 |
| --- | --- |
| RK3588 USBDP PHY0 | 0xfed88000 |
| RK3588 USBDP PHY1 | 0xfed98000 |
| RK3576 USBDP PHY | 0x2b018000 |

配置寄存器时，寄存器地址需要选择对应的 PHY 基地址加上寄存器偏移。

## 2. DP 信号Tuning

本文 IO 命令以 RK3588 PHY0的 Lane0 为例<sub>，</sub>Tuning 其它 Lane 需要修改寄存器偏移<sub>；</sub>TuingRK3588 PHY1 和 RK3756 PHY 需要修改基地址

PHY 的一个寄存器通常都是用于多个功能配置<sub>，</sub>如果需要多个 Tuning 项联合调整<sub>，</sub>寄存器的值需要先读出来<sub>，</sub>再根据新的 Tuning 的 bits 或操作后再写入<sub>，</sub>否则前面 Tuning 好的指标会被覆盖。

### 2.1 DP Amplitude Control

#### 2.1.1 DP TX driver main-tap level

调电压，建议优先调此寄存器

寄存器偏移

```
// bit5为使能位, default={0x0f}
lane0: 0x0810[5:0]
lane1: 0x1010[5:0]
lane2: 0x1810[5:0]
lane3: 0x2010[5:0]
```

调整及范围

以下io命令用于Lane0, 其它Lane请更改寄存器偏移，如lane1地址为0xfed89010 (0xfed88810 + 0x800)


| 幅值 | 命令[ reg offset 0x0810, bit 5:0] |
| --- | --- |
| 4&#x27;b1010:1200mv (max) | io -4 0xfed88810 0x2a |
| 4&#x27;b1001: | io -4 0xfed88810 0x29 |
| 4&#x27;b1000: | io -4 0xfed888100x28 |
| 4&#x27;b0111: | io -4 0xfed88810 0x27 |
| 4&#x27;b0110 : | io -4 0xfed88810 0x26 |
| 4&#x27;b0101: | io -4 0xfed88810 0x25 |
| 4&#x27;b0100: | io -4 0xfed88810 0x24 |
| 4&#x27;b0011: | io -4 0xfed88810 0x23 |
| 4&#x27;b0010 ： | io -4 0xfed88810 0x22 |
| 4&#x27;b0001: | io -4 0xfed88810 0x21 |
| 4&#x27;b0000: 400mv (min) | io -4 0xfed88810 0x20 |

#### 2.1.2 DP TX pmos current control

调电流，建议在调压不满足时，再设置此寄存器

### 寄存器偏移

```javascript
// 使能 bit[1:0]，default={0x1, 0xe7}
lane0: 使能: 0x0818[1:0]; 调整: 0x081c[7:5]={3'b000 ~ 3'b111}
lane1: 使能: 0x1018[1:0]; 调整: 0x101c[7:5]
lane2: 使能: 0x1818[1:0]; 调整: 0x181c[7:5]
lane3: 使能: 0x2018[1:0]; 调整: 0x201c[7:5]
```

### 调整及范围


| 幅值 | 命令[ reg offset 0x081c, bit 7:5] |
| --- | --- |
| 3&#x27;b111: | io -4 0xfed88818 0x03io -4 0xfed8881c 0xe5 |
| 3&#x27;b110: | io -4 0xfed88818 0x03io -4 0xfed8881c 0xc5 |
| 3&#x27;b101: | io -4 0xfed88818 0x03io -4 0xfed8881c 0xa5 |
| 3&#x27;b100: | io -4 0xfed88818 0x03io -4 0xfed8881c 0x85 |
| 3&#x27;b011 : | io -4 0xfed88818 0x03io -4 0xfed8881c 0x65 |
| 3&#x27;b010 : | io -4 0xfed88818 0x03io -4 0xfed8881c 0x45 |
| 4&#x27;b001: | io -4 0xfed88818 0x03io -4 0xfed8881c 0x25 |
| 4&#x27;b000: | io -4 0xfed88818 0x03io -4 0xfed8881c 0x05 |

### 2.2 DP Equalization

#### 2.2.1 DP TX De-emphasis

寄存器偏移

```javascript
// bit4 为使能位, default=0x0, 即 0dB
lane0: 0x0814[4:0]
lane1: 0x1014[4:0]
lane2: 0x1814[4:0]
lane3: 0x2014[4:0]
```

调整及范围


| Level | 命令[reg offset 0x0814, bit 4:0] |
| --- | --- |
| 5&#x27;b10000: 0 dB | io -4 0xfed88814 0x10 |
| 5&#x27;b11011: -5 dB (Recommend to use over 5 Gbps speed) | io -4 0xfed88814 0x1b |
| 5&#x27;b10101: -2.8 dB (Recommend to use over 10 Gbps speed) | io -4 0xfed88814 0x15 |
| 5&#x27;b11001: -6.9 dB (Not recommend to use) | io -4 0xfed88814 0x19 |

#### 2.2.2 DP TX Preshoot Level

寄存器偏移

```
// bit6 为使能位, default=0x0
lane0: 0x0818[6:2]
lane1: 0x1018[6:2]
lane2: 0x1818[6:2]
lane3: 0x2018[6:2]
```

调整及范围

### 注意<sub>：</sub>该寄存器与TX pmos current control 复用

以下io命令用于Lane0, 其它Lane请更改寄存器偏移，如lan1地址为0xfed89018 (0xfed88818 + 0x800)


| Level | 命令 [ reg offset 0x0818, bit 6:2] |
| --- | --- |
| 5&#x27;b1000000: 0 dB (default, Recommend to use over 5 Gbps speed) | io -4 0xfed88818 0x40 |
| 5&#x27;b1011000: -1.6 dB (Recommend to use over 10 Gbps speed) | io -4 0xfed88818 0x58 |
| 5&#x27;b11001: -6.9 dB (Not recommend to use) | io -4 0xfed88818 0x64 |

### 2.3 DP TX Slew Rate

#### 2.3.1 DP Faster Slew Rate Control

寄存器偏移

```javascript
// default={0xe7, 0x60}
lane0: 使能: 0x081c[1:0]={2'b11}; 驱动强度: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: 使能: 0x101c[1:0]; 驱动强度: 0x1020[5:3]
lane2: 使能: 0x181c[1:0]; 驱动强度: 0x1820[5:3]
lane3: 使能: 0x201c[1:0]; 驱动强度: 0x2020[5:3]
```

调整及范围 (以下io命令用于Lane0, 其它Lane请更改寄存器偏移)

以下io命令用于Lane0, 其它Lane请更改寄存器偏移，如lan1地址为0xfed8901c (0xfed8881c + 0x800)


| 幅值 | 命令 [ reg offset 0x081c, bit 7:5] |
| --- | --- |
| 3&#x27;b111: | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x78 |
| 3&#x27;b110: | io -4 0xfed8881c 0xe7io -4 0xfed888200x70 |
| 3&#x27;b101: | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x68 |
| 3&#x27;b100: | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x60 |
| 3&#x27;b011 : | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x58 |
| 3&#x27;b010 : | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x50 |
| 4&#x27;b001: | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x48 |
| 4&#x27;b000: | io -4 0xfed8881c 0xe7io -4 0xfed88820 0x40 |

#### 2.3.2 DP Slower Slew Rate Control

寄存器偏移

```javascript
// default={0xe7, 0x60}
lane0: 使能: 0x081c[1:0]={2'b10}; 驱动强度: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: 使能: 0x101c[1:0]; 驱动强度: 0x1020[5:3]
lane2: 使能: 0x181c[1:0]; 驱动强度: 0x1820[5:3]
lane3: 使能: 0x201c[1:0]; 驱动强度: 0x2020[5:3]
```

调整及范围 (以下io命令用于Lane0, 其它Lane请更改寄存器偏移)

注意<sub>：</sub>该寄存器与TX pmos current control 复用

以下io命令用于Lane0, 其它Lane请更改寄存器偏移,如lan1地址为0xfed8901c (0xfed8881c + 0x800)


| 幅值 | 命令 [ reg offset 0x081c, bit 7:5] |
| --- | --- |
| 3&#x27;b111: | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x78 |
| 3&#x27;b110: | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x70 |
| 3&#x27;b101: | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x68 |
| 3&#x27;b100: | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x60 |
| 3&#x27;b011 : | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x58 |
| 3&#x27;b010 : | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x50 |
| 4&#x27;b001: | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x48 |
| 4&#x27;b000: | io -4 0xfed8881c 0xe6io -4 0xfed88820 0x40 |

### 2.4 DP TX SSC Control

#### 2.4.1 PLL SSC modulation deviation

寄存器偏移

```
// default=0x19
RBR: 调整：0x03F0[5:0]
HBR: 调整：0x03F4[5:0]
HBR2: 调整：0x03F8[5:0]
HBR3: 调整：0x03FC[5:0]
```

### 调整及范围


| Level | 命令[reg offset 0x03F0, bit5:0] |
| --- | --- |
| 6&#x27;b000000: | io -4 0xfed883f0 0x00 |
| 6&#x27;b000001: | io -4 0xfed883f0 0x01 |
| … | .… |
| 4&#x27;b111110: | io -4 0xfed883f0 0x3e |
| 4&#x27;b111111: | io -4 0xfed883f0 0x3f |

#### 2.4.2 PLL SSC modulation frequency

### 寄存器偏移

```
// default=0x0f
RBR: 调整：0x0404[4:0]
HBR: 调整：0x0408[4:0]
HBR2: 调整：0x040c[4:0]
HBR3: 调整：0x0410[6:2] (default=0x3c)
```

调整及范围


| Level | 命令 [ reg offset 0x0400, bit4:0] |
| --- | --- |
| 5&#x27;b00000: | io -4 0xfed88400 0x00 (HBR3: io -4 0xfed88410 0x00) |
| 5&#x27;b00001: | io -4 0xfed88400 0x01 (HBR3: io -4 0xfed88410 0x04) |
| .… | … |
| 5&#x27;b11110: | io -4 0xfed88400 0x1e (HBR3： io -4 0xfed88410 0x38) |
| 5&#x27;b11111: | io -4 0xfed88400 0x1f (HBR3： io -4 0xfed88410 0x3c) |

HBR3需要左移两位

### 2.5 DP TX AUX Amplitude Control

寄存器偏移

```
// default=0x36
aux swing: 0x0024[6:3]
```

### 调整及范围


| Level | 命令 [ reg offset 0x0024, bit6:3] (bit[2:0] = 0x6(default)) |
| --- | --- |
| 4&#x27;b0000: 0 mVpp | io -4 0xfed88024 0x06 |
| 4&#x27;b0001: | io -4 0xfed88024 0x0e |
| 4&#x27;b0010: | io -4 0xfed88024 0x16 |
| 4&#x27;b0011: | io -4 0xfed88024 0x1e |
| 4&#x27;b0100: | io -4 0xfed88024 0x26 |
| 4&#x27;b0101: | io -4 0xfed88024 0x2e |
| 4&#x27;b0110: | io -4 0xfed88024 0x36 |
| 4&#x27;b0111: 390 mVpp | io -4 0xfed88024 0x3e |
| 4&#x27;b1000: | io -4 0xfed88024 0x46 |
| 4&#x27;b1001: | io -4 0xfed88024 0x4e |
| 4&#x27;b1010: | io -4 0xfed88024 0x56 |
| 4&#x27;b1011: | io -4 0xfed88024 0x5e |
| 4&#x27;b1100: | io -4 0xfed88024 0x66 |
| 4&#x27;b1101: | io -4 0xfed88024 0x6e |
| 4&#x27;b1110: | io -4 0xfed88024 0x76 |
| 4&#x27;b1111: 880 mVpp | io -4 0xfed88024 0x7e |

## 3. 代码参数配置调整

Kernel 驱动代码位置：

drivers/phy/rockchip/phy-rockchip-usbdp.c

U-boot 驱动代码位置：

```batch
drivers/phy/phy-rockchip-usbdp.c
```

swing 和 pre-emphasis 的调整寄存器定义如下：

```c
struct dp_tx_drv_ctrl {
u32 trsv_reg0204;
u32 trsv_reg0205;
u32 trsv_reg0206;
u32 trsv_reg0207;
};
```

不同的 lane 对应的配置寄存器偏移如下：


|  | trsv_reg0204 | trsv_reg0205 | trsv_reg0206 | trsv_reg0206 |
| --- | --- | --- | --- | --- |
| lane0 | 0x0810 | 0x0814 | 0x0818 | 0x081C |
| lanel | 0x1010 | 0x1014 | 0x1018 | 0x101C |
| lane2 | 0x1810 | 0x1814 | 0x1818 | 0x181C |
| lane3 | 0x2010 | 0x2014 | 0x2018 | 0x201C |

DP 的 link rate 有 4 个 等级，分别是 RBR, HBR, HBR2, HBR3, 针对这 4 个等级，定义了如下的几个swing 和 pre-emphasis 的配置数组：

DP标准口输出时：


|  | RK3576 配置 | RK3588配置 |
| --- | --- | --- |
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

Type-C 接口输出时：


|  | RK3576配置 | RK3588配置 |
| --- | --- | --- |
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

上述每个数组大小均为4x4, 用于保存不同等级 swing 和 pre-emphasis 组合的寄存器配置参数。

SSC 代码配置位置如下：

```c
static const struct reg_sequence rk3588_udphy_24m_refclk_cfg[] = {
{0x03f0, 0x0a}, {0x03f4, 0x07},
{0x03f8, 0x07}, {0x03fc, 0x0c},
{0x0404, 0x12}, {0x0408, 0x1a},
{0x040c, 0x1a}, {0x0410, 0x3f},
......
};
```

AUX 幅值代码配置位置如下：
