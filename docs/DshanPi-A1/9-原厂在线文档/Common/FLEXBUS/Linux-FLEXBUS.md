---
sidebar_position: 1
---

# Rockchip FLEXBUS 开发指南

## 前言

## 概述

本文档介绍了如何在 Linux 使用 FLEXBUS。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3576 | 6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 姚旭伟 | 2024-06-11 | 初始版本 |

## 1. FLEXBUS 概述

FLEXBUS 模块分为 FLEXBUS0、FLEXBUS1 两部分。FLEXBUS0 支持 TX，部分模式下支持 TX thenRX。FLEXBUS1 只支持 RX。FLEXBUS0、FLEXBUS1 分别只允许对接一个外设。可以同时使用FLEXBUS0 和 FLEXBUS1，也可以只使用 FLEXBUS0 或只使用 FLEXBUS1。

FLEXBUS0 支持以下模式：

1. 高速并行 DAC（本文简称 DAC）

2. 模拟 SPI 协议，主要实现 Single/Quad SPI 传输，支持外接 SPI Flash、QSPI 屏

FLEXBUS1 支持以下模式：

1. 高速并行 ADC（本文简称 ADC）

2. DVP

FLEXBUS0、FLEXBUS1 分别有 1 根 CLK、1 根 CSn、16 根 data 线。实际能使用的引脚还要看具体平台的限制和 IOMUX 的配置。

## 2. FLEXBUS 的使用

### 2.1 内核配置

Device Drivers -&gt; Multifunction device drivers -&gt; Rockchip Flexbus

### 2.2 dtsi 配置

以 RK3576 平台和 RK3576 TEST1 板子，FLEXBUS0 对接 DAC、FLEXBUS1 对接 ADC 为例。

rk3576.dtsi 中：

```dts
flexbus: flexbus@2a2f0000 {
compatible = "rockchip,rk3576-flexbus";
reg = <0x0 0x2a2f0000 0x0 0x200>;
interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru CLK_HSGPIO_TX>, <&cru CLK_HSGPIO_RX>,
<&cru ACLK_HSGPIO>, <&cru HCLK_HSGPIO>;
clock-names = "tx_clk_flexbus", "rx_clk_flexbus",
"aclk_flexbus", "hclk_flexbus";
rockchip,grf = <&ioc_grf>; // FLEXBUS 需要配置 GRF
status = "disabled";
flexbus_adc: adc {
};
flexbus_dac: dac {

};
};
```

根据需要使用的模式，修改对应的子节点配置（如 flexbus\_adc、flexbus\_dac），具体参考各模式对应的文档。其它配置一般不需要修改。

arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi 中：

```hcl
&flexbus {
rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 选择
DAC 模式
rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 选择
ADC 模式
status = "okay"; // 使能 FLEXBUS
};
&flexbus_adc {
pinctrl-names = "default";
pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
&flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
&flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
&flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
&flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// 配置 FLEXBUS1 ADC 模式需要的 IOMUX
status = "okay"; // 使能 ADC 模式
};
&flexbus_dac {
pinctrl-names = "default";
pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
&flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
&flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
&flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
&flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// 配置 FLEXBUS0 DAC 模式需要的 IOMUX
status = "okay"; // 使能 DAC 模式
};
```

rockchip,flexbus0-opmode、rockchip,flexbus1-opmode 分别配置为 FLEXBUS0、FLEXBUS1 实际使用的模式，模式的定义在 include/dt-bindings/mfd/rockchip-flexbus.h。如果没有使用就配成ROCKCHIP\_FLEXBUS0\_OPMODE\_NULL 或 ROCKCHIP\_FLEXBUS1\_OPMODE\_NULL 。

### 2.3 驱动文件

驱动文件为 drivers/mfd/rockchip-flexbus.c。这里只包含寄存器读写、初始化等基本操作。各模式的代码位于对应的框架中，具体参考各模式对应的文档。
