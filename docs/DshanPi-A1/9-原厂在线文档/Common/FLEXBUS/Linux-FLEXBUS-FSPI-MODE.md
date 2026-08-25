---
sidebar_position: 1
---

# Rockchip FLEXBUS FSPI 模式开发指南

## 前言

## 概述

本文档介绍了如何在 Linux 使用 FLEXBUS FSPI 模式。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| 所有支持 FLEXBUS 模块的芯片 | 6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 林鼎强 | 2024-08-12 | 初始版本 |

### 1.1 概述

FLEXBUS FSPI 模式指的是通过 FLEXBUS 模拟 RK FSPI（Flexible Serial Peripheral Interface）来实现相应功能，例如：

single line output/quad line input，满足 Linux MTD Quad SPI Flash 驱动的典型配置

关键特性：

时钟频率最高 100MHz

### 1.2 配置

#### 1.2.1 内核配置

FLEXBUS FSPI mode 为标准 SPI 框架驱动实现，且仅实现 spi-mem 结构，支持外接 SPI Flash 或支持 spi-mem 协议的外设：

CONFIG\_SPI=y   

CONFIG\_SPI\_ROCKCHIP\_FLEXBUS\_FSPI=y

#### 1.2.2 dts 配置

以外接 SPI Nor flash 子设备为例：

```dts
&flexbus {
rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_SPI>;
rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_NULL>;
status = "okay";
};
&flexbus_fspi {
pinctrl-names = "default";
pinctrl-0 = <&flexbus0m1_pins &flexbus0_clk_pins
&flexbus0_d0_pins &flexbus0_d1_pins
&flexbus0_d2_pins &flexbus0_d3_pins>;
status = "okay";
flash@0 {
compatible = "jedec,spi-nor";
reg = <0>;
spi-max-frequency = <100000000>;
spi-rx-bus-width = <4>;
spi-tx-bus-width = <1>;
};

};
```

说明：

mode\_bits 为 SPI\_RX\_QUAD：

支持配置 spi-rx-bus-width 为 4

默认配置为 SPI mode 0，MSB mode，相关参数 dts 不可调，请自行参考控制器手册做进一步开发

#### 1.2.3 驱动文件

驱动文件为 drivers/spi/spi-rockchip-flexbus-fspi.c
