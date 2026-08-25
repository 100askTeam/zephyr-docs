---
sidebar_position: 1
---

# Rockchip Developer Guide Linux GMAC Mode Configuration

## 前言

## 概述

本文提供 Rockchip 平台以太网 GMAC 接口不同模式下的配置用例，用于解决以太网配置问题。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| ROCKCHIP 芯片 | 所有版本 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 吴达超 | 2021-01-26 | 初始版本 |
| V1.1.0 | 吴达超 | 2021-12-28 | 支持RK3588 |
| V1.1.1 | 吴达超 | 2022-11-28 | 修正错误 |
| V1.2.0 | 吴达超 | 2022-11-29 | 支持RK3528 |
| V1.3.0 | 吴达超 | 2023-01-16 | 支持RK3562 |
| V1.4.0 | 吴达超 | 2024-04-26 | 支持RK3576,配置参考 RK3588 |

## 1. RGMII 模式

一般使用主控 PLL 输出 时钟 output 方式，PHY 提供的 125M 时钟作为 input 方式为备选方案。

### 1.1 PLL output 125M for TX\_CLK, Crystal 25M for PHY

主控 PLL 提供 TXCLK 所需时钟，PHY 25M 时钟由晶振提供。



### 1.2 PLL output 125M for TX\_CLK, PLL 25M for PHY

主控 PLL 提供 TXCLK 所需时钟，PHY 25M 时钟由主控提供。



1.3 125M TX\_CLK input from PHY, PLL 25M for PHY  

TXCLK 所需时钟由 PHY 提供，PHY 25M 时钟由主控提供。



1.4 125M TX\_CLK input from PHY, Crystal 25M for PHY  

TXCLK 所需时钟由 PHY 提供，PHY 25M 时钟由晶振提供。



## 2. RMII 模式

### 2.1 RMII Clock Output

主控提供 RMII 所需时钟



### 2.2 RMII Clock Input

PHY 提供 RMII 所需时钟



同样，RMII 模式下，晶振也可以由主控输出 25M 替代。

## 3. 模式配置

不同模式下的配置主要包含了 phy mode，clock 和 pinctrl 的配置，这些配置都是关联的，需要同时配置，否则无法工作。

以下是各芯片不同模式下，以 SDK 板级 DTS 为例的不同配置方式的参考，关注 dts 中 gmac 节点里 '+'部分的修改。

### 3.1 PX30

#### 3.1.1 RMII Clock Output

```dts
&gmac {
phy-supply = <&vcc_phy>;
```

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_MAC&gt;;   

```
assigned-clock-rates = <50000000>;
snps,reset-gpio = <&gpio2 13 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
```

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmii\_pins &mac\_refclk\_12ma&gt;;   

```dts
status = "okay";
};
```

#### 3.1.2 RMII Clock Input

```hcl
&gmac {
phy-supply = <&vcc_phy>;
+ clock_in_out = "input";
+ assigned-clocks = <&cru SCLK_MAC>;
assigned-clock-parents = <&gmac_clkin>;
snps,reset-gpio = <&gpio2 13 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins &mac_refclk>;
status = "okay";
};
```

### 3.2 RK1808

#### 3.2.1 RMII Clock Output：

```hcl
&gmac {
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
+ clocks = <&cru SCLK_GMAC>, <&cru SCLK_GMAC_RX_TX>,
+ <&cru SCLK_GMAC_RX_TX>, <&cru SCLK_GMAC_REF>,
+ <&cru SCLK_GMAC_REFOUT>, <&cru ACLK_GMAC>,
+ <&cru PCLK_GMAC>, <&cru SCLK_GMAC_RMII_SPEED>;
+ clock-names = "stmmaceth", "mac_clk_rx",
+ "mac_clk_tx", "clk_mac_ref",
+ "clk_mac_refout", "aclk_mac",
+ "pclk_mac", "clk_mac_speed";
assigned-clocks = <&cru SCLK_GMAC_RX_TX>;
assigned-clock-parents = <&cru SCLK_GMAC_RMII_SPEED>;
snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
+ pinctrl-names = "default";
pinctrl-0 = <&rmii_pins>;
status = "okay";
```

#### 3.2.2 RMII Clock Input

```c
+&gmac_clkin {
+ clock-frequency = <50000000>;
+};
&gmac {
phy-supply = <&vcc_phy>;
phy-mode = "rmii";
+ clock_in_out = "input";
+ clocks = <&cru SCLK_GMAC>, <&cru SCLK_GMAC_RX_TX>,
+ <&cru SCLK_GMAC_RX_TX>, <&cru SCLK_GMAC_REF>,
+ <&cru SCLK_GMAC_REFOUT>, <&cru ACLK_GMAC>,
+ <&cru PCLK_GMAC>, <&cru SCLK_GMAC_RMII_SPEED>;
+ clock-names = "stmmaceth", "mac_clk_rx",
+ "mac_clk_tx", "clk_mac_ref",
+ "clk_mac_refout", "aclk_mac",
+ "pclk_mac", "clk_mac_speed";
+ assigned-clocks = <&cru SCLK_GMAC_RX_TX>, <&cru SCLK_GMAC>;
assigned-clock-parents = <&cru SCLK_GMAC_RMII_SPEED>, <&gmac_clkin>;
snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
status = "okay";
};
```

#### 3.2.3 RGMII Clock Output

```dts
&gmac {
phy-supply = <&vcc_phy>;
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_MAC&gt;;   

+ assigned-clock-rates = &lt;125000000&gt;;   

snps,reset-gpio = &lt;&gpio0 10 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

tx\_delay = &lt;0x50&gt;;   

rx\_delay = &lt;0x3a&gt;;   

```dts
status = "okay";
};
```

#### 3.2.4 RGMII Clock Input

```c
&gmac {
phy-supply = <&vcc_phy>;
+ phy-mode = "rgmii";
+ clock_in_out = "input";
+ assigned-clocks = <&cru SCLK_GMAC>;
+ assigned-clock-parents = <&gmac_clkin>;
snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x50>;
rx_delay = <0x3a>;
status = "okay";
};
```

### 3.3 RK3128

#### 3.3.1 RMII Clock Output

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_MAC_SRC>;
+ assigned-clock-rates = <50000000>;
+ clock_in_out = "output";
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
phy-supply = <&vcc_phy>;
phy-mode = "rmii";
snps,reset-active-low;
snps,reset-delays-us = <0 10000 50000>;
snps,reset-gpio = <&gpio2 24 GPIO_ACTIVE_LOW>;
status = "okay";
};
```

#### 3.3.2 RMII Clock Input

```
+&clkin_gmac {
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+};
&gmac {
```

+ assigned-clocks = &lt;&cru SCLK\_MAC&gt;;   

+ assigned-clock-parents = &lt;&clkin\_gmac&gt;;   

+ clock\_in\_out = "input";   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmii\_pins&gt;;   

```
phy-supply = <&vcc_phy>;
```

+ phy-mode = "rmii";   

snps,reset-active-low;

snps,reset-delays-us = &lt;0 10000 50000&gt;;   

snps,reset-gpio = &lt;&gpio2 24 GPIO\_ACTIVE\_LOW&gt;;   

```dts
status = "okay";
};
```

#### 3.3.3 RGMII Clock Input

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_MAC>;
+ assigned-clock-parents = <&clkin_gmac>;
+ clock_in_out = "input";
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmii_pins>;
phy-supply = <&vcc_phy>;
+ phy-mode = "rgmii";
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
snps,reset-gpio = <&gpio2 24 GPIO_ACTIVE_LOW>;
tx_delay = <0x30>;
rx_delay = <0x16>;
status = "okay";
};
```

### 3.4 RK3228

#### 3.4.1 RMII Clock Output

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;
+ assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;
+ assigned-clock-rates = <0>, <50000000>;
+ clock_in_out = "output";
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
status = "okay";
};
```

#### 3.4.2 RMII Clock Input

```
+&ext_gmac: external-gmac-clock {
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+}
&gmac {
```

+ assigned-clocks = &lt;&cru SCLK\_MAC\_EXTCLK&gt;, &lt;&cru SCLK\_MAC&gt;;   

+ assigned-clock-parents = &lt;&ext\_gmac&gt;, &lt;&cru SCLK\_MAC\_EXTCLK&gt;;   

+ clock\_in\_out = "input";   

```
phy-supply = <&vcc_phy>;
```

+ phy-mode = "rmii";   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmii\_pins&gt;;   

snps,reset-gpio = &lt;&gpio2 RK\_PD0 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

```dts
status = "okay";
};
```

#### 3.4.3 RGMII Clock Output

```c
&gmac {
+ assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;
+ assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;
+ assigned-clock-rates = <0>, <125000000>;
+ clock_in_out = "output";
phy-supply = <&vcc_phy>;
+ phy-mode = "rgmii";
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmii_pins>;
snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x30>;
rx_delay = <0x10>;
status = "okay";
};
```

#### 3.4.4 RGMII Clock Input

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;
+ assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;
+ clock_in_out = "input";
phy-supply = <&vcc_phy>;
+ phy-mode = "rgmii";
+ pinctrl-names = "default";
pinctrl-0 = <&rgmii_pins>;
snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x30>;
rx_delay = <0x10>;
status = "okay";
};
```

#### 3.4.5 Internal EPHY

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_MAC_SRC>;
+ assigned-clock-rates = <50000000>;
+ clock_in_out = "output";
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
phy-handle = <&phy>;
status = "okay";
mdio {
compatible = "snps,dwmac-mdio";
#address-cells = <1>;
#size-cells = <0>;
phy: ethernet-phy@0 {
compatible = "ethernet-phy-id1234.d400", "ethernet-phy
ieee802.3-c22";
reg = <0>;
clocks = <&cru SCLK_MAC_PHY>;
resets = <&cru SRST_MACPHY>;
phy-is-integrated;
};
};
};
```

### 3.5 RK3288

#### 3.5.1 RMII Clock Output

```hcl
&gmac {
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
+ clock_in_out = "output";
+ assigned-clocks = <&cru SCLK_MAC>;
+ assigned-clock-rates = <50000000>;
snps,reset-gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 1000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
status = "okay";
};
```

#### 3.5.2 RMII Clock Input

```
+&ext_gmac: external-gmac-clock {
```

+ clock-frequency = &lt;50000000&gt;;   

```
+}
```

```hcl
&gmac {
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
+ clock_in_out = "input";
+ assigned-clocks = <&cru SCLK_MAC>;
+ assigned-clock-parents = <&ext_gmac>;
snps,reset-gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 1000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
status = "okay";
};
```

#### 3.5.3 RGMII Clock Input

```hcl
&gmac {
phy-supply = <&vcc_phy>;
+ phy-mode = "rgmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 1000000>;
+ assigned-clocks = <&cru SCLK_MAC>;
+ assigned-clock-parents = <&ext_gmac>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmii_pins>;
tx_delay = <0x30>;
rx_delay = <0x10>;
status = "okay";
};
```

### 3.6 RK3328

#### 3.6.1 RMII Clock Output

```dts
&gmac2io {
phy-supply = <&vcc_phy>;
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_MAC2IO&gt;;   

```
assigned-clock-rates = <50000000>;
snps,reset-gpio = <&gpio1 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
```

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmiim1\_pins&gt;;   

```dts
status = "okay";
};
```

#### 3.6.2 RMII Clock Input

```hcl
+&clkin_gmac {
+ clock-frequency = <50000000>;
+};
&gmac2io {
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
+ clock_in_out = "input";
+ assigned-clocks = <&cru SCLK_MAC2IO>, <&cru SCLK_MAC2IO_EXT>;
+ assigned-clock-parents = <&gmac_clkin>, <&gmac_clkin>;
snps,reset-gpio = <&gpio1 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmiim1_pins>;
status = "okay";
};
```

#### 3.6.3 RGMII Clock Input

```dts
&gmac2io {
phy-supply = <&vcc_phy>;
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "input";   

+ assigned-clocks = &lt;&cru SCLK\_MAC2IO&gt;, &lt;&cru SCLK\_MAC2IO\_EXT&gt;;   

+ assigned-clock-parents = &lt;&gmac\_clkin&gt;, &lt;&gmac\_clkin&gt;;   

snps,reset-gpio = &lt;&gpio1 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rgmiim1\_pins&gt;;   

tx\_delay = &lt;0x26&gt;;   

rx\_delay = &lt;0x11&gt;;   

```dts
status = "okay";
};
```

#### 3.6.4 Internal EPHY

```dts
&gmac2phy {
phy-supply = <&vcc_phy>;
```

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_MAC2PHY\_SRC&gt;;   

+ assigned-clock-rate = &lt;50000000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_MAC2PHY&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_MAC2PHY\_SRC&gt;;   

```dts
status = "okay";
};
```

### 3.7 RK3368

#### 3.7.1 RMII Clock Output

```hcl
&gmac {
phy-supply = <&vcc_lan>;
+ phy-mode = "rmii";
+ clock_in_out = "output";
assigned-clocks = <&cru SCLK_MAC>;
assigned-clock-rates = <50000000>;
snps,reset-gpio = <&gpio3 12 0>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
status = "ok";
};
```

#### 3.7.2 RMII Clock Input

```
+&ext_gmac {
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+}
&gmac {
phy-supply = <&vcc_lan>;
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "input";   

+ assigned-clocks = &lt;&cru SCLK\_MAC&gt;;   

+ assigned-clock-parents = &lt;&ext\_gmac&gt;;   

snps,reset-gpio = &lt;&gpio3 12 0&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmii\_pins&gt;;   

```
status = "ok";
};
```

#### 3.7.3 RGMII Clock Input

```hcl
&gmac {
phy-supply = <&vcc_lan>;
+ phy-mode = "rmii";
+ clock_in_out = "input";
+ assigned-clocks = <&cru SCLK_MAC>;
+ assigned-clock-parents = <&ext_gmac>;
snps,reset-gpio = <&gpio3 12 0>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
status = "okay";
};
```

### 3.8 RK3399

#### 3.8.1 RMII Clock Output

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_MAC>;
+ assigned-clock-rates = <50000000>;
+ clock_in_out = "output";
phy-supply = <&vcc_phy>;
+ phy-mode = "rmii";
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmii_pins>;
snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
status = "okay";
};
```

#### 3.8.2 RMII Clock Input

```
+&clkin_gmac {
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+};
&gmac {
```

+ assigned-clocks = &lt;&cru SCLK\_RMII\_SRC&gt;;   

+ assigned-clock-parents = &lt;&clkin\_gmac&gt;;   

+ clock\_in\_out = "input";   

```
phy-supply = <&vcc_phy>;
```

+ phy-mode = "rmii";   

+ pinctrl-names = "default";   

```dts
pinctrl-0 = <&rmii_pins>;
snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
status = "okay";
};
```

#### 3.8.3 RGMII Clock Input

```hcl
&gmac {
+ assigned-clocks = <&cru SCLK_RMII_SRC>;
+ assigned-clock-parents = <&clkin_gmac>;
+ clock_in_out = "input";
phy-supply = <&vcc_phy>;
+ phy-mode = "rgmii";
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmii_pins>;
snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x28>;
rx_delay = <0x11>;
status = "okay";
};
```

### 3.9 RK3528

#### 3.9.1 GMAC1 RMII Clock 50M Output, PLL 25M Output

```hcl
&gmac1 {
phy-mode = "rmii";
clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PC3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 10000 50000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmii_miim
&rgmii_tx_bus2
&rgmii_rx_bus2
&rgmii_clk
&eth_pins>;
phy-handle = <&rmii1_phy>;
status = "okay";
};
&mdio1 {
rmii1_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC1_VPU_25M>;
};
};
```

#### 3.9.2 GMAC1 RMII Clock 50M Input, PLL 25M Output

```hcl
&gmac1 {
phy-mode = "rmii";
clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PC3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 10000 50000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmii_miim
&rgmii_tx_bus2
&rgmii_rx_bus2
&rgmii_clk
&eth_pins>;
phy-handle = <&rmii1_phy>;
status = "okay";
};
&mdio1 {
rmii1_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC1_VPU_25M>;
};
};
```

#### 3.9.3 GMAC1 RGMII PLL output 25M for PHY, PLL output 125M for TX\_CLK

```c
&gmac1 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x30>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmii_miim
&rgmii_tx_bus2
&rgmii_rx_bus2
&rgmii_rgmii_clk
&rgmii_rgmii_bus
&eth_pins>;
phy-handle = <&rgmii_phy>;
status = "okay";
```

```dts
};
&mdio1 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC1_VPU_25M>;
};
};
```

#### 3.9.4 GMAC1 RGMII Crystal 25M for PHY, PLL output 125M for TX\_CLK

```c
&gmac1 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x30>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmii_miim
&rgmii_tx_bus2
&rgmii_rx_bus2
&rgmii_rgmii_clk
&rgmii_rgmii_bus>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio1 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.9.5 GMAC1 RGMII PLL output 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

```c
&gmac1 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "input";
snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
```

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

tx\_delay = &lt;0x30&gt;;   

/\* rx\_delay = &lt;0x3f&gt;; \*/   

```dts
pinctrl-names = "default";
pinctrl-0 = <&rgmii_miim
&rgmii_tx_bus2
&rgmii_rx_bus2
&rgmii_rgmii_clk
&rgmii_rgmii_bus
&rgmii_clk
&eth_pins>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio1 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC1_VPU_25M>;
};
};
```

#### 3.9.6 GMAC1 RGMII Crystal 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

```dts
&gmac1 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rgmii-rxid";
clock_in_out = "input";
snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x30>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmii_miim
&rgmii_tx_bus2
&rgmii_rx_bus2
&rgmii_rgmii_clk
&rgmii_rgmii_bus
&rgmii_clk>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio1 {

rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.9.7 GMAC0 & FEPHY

GMAC0 与内部 FEPHY 相连，是固定的 RMII，没有模式可以配置；但可以根据硬件原理图配置 PHY led功能，有 3 个功能 IO 可配置，配置对应 IO 的 iomux 即可，默认配置如下：

```dts
&rmii0_phy {
pinctrl-names = "default";
pinctrl-0 = <&fephym0_led_link &fephym0_led_spd>;
};
```

### 3.10 RK3562

#### 3.10.1 RMII Clock Output

gmac0m0

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rmii";
clock_in_out = "output";
snps,reset-gpio = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmiim0_miim
&rgmiim0_tx_bus2
&rgmiim0_rx_bus2
&rgmiim0_clk>;
phy-handle = <&rmii_phy>;
status = "okay";
};
&mdio0 {
rmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

gmac0m1:

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rmii";
clock_in_out = "output";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_miim
&rgmiim1_tx_bus2
&rgmiim1_rx_bus2
&rgmiim1_clk>;
phy-handle = <&rmii_phy>;
status = "okay";
};
&mdio0 {
rmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

### gmac1(MAC100):

```dts
&gmac1 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rmii";
clock_in_out = "output";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
pinctrl-names = "default";
pinctrl-0 = <&rmii_pins>;
phy-handle = <&rmii_phy>;
status = "okay";
};
&mdio1 {
rmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.10.2 RMII Clock Input, PLL out 25M for PHY

### gmac0m0

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rmii";
clock_in_out = "input";
snps,reset-gpio = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmiim0_miim
&rgmiim0_tx_bus2
&rgmiim0_rx_bus2
&rgmiim0_clk
&ethm0_pins>;
phy-handle = <&rmii_phy>;
status = "okay";
};
&mdio0 {
rmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

### gmac0m1:

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rmii";
clock_in_out = "input";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_miim
&rgmiim1_tx_bus2
&rgmiim1_rx_bus2
&rgmiim1_clk
&ethm1_pins>;
phy-handle = <&rmii_phy>;
status = "okay";
```

```javascript
};
&mdio0 {
rmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

### gmac1(MAC100):

```dts
&gmac1 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rmii";
clock_in_out = "input";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
pinctrl-names = "default";
pinctrl-0 = <&rmii_pins
&ethm1_pins>;
phy-handle = <&rmii_phy>;
status = "okay";
};
&mdio1 {
rmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

#### 3.10.3 RGMII PLL output 25M for PHY, PLL output 125M for TX\_CLK

### gmac0m0

```c
&gmac0 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
```

```javascript
tx_delay = <0x3f>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmiim0_miim
&rgmiim0_tx_bus2
&rgmiim0_rx_bus2
&rgmiim0_rgmii_clk
&rgmiim0_rgmii_bus
&ethm0_pins>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

### gmac0m1

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x3f>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_miim
&rgmiim1_tx_bus2
&rgmiim1_rx_bus2
&rgmiim1_rgmii_clk
&rgmiim1_rgmii_bus
&ethm1_pins>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;

clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

#### 3.10.4 RGMII PLL output 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

gmac0m0

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rgmii-rxid";
clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x3f>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmiim0_miim
&rgmiim0_tx_bus2
&rgmiim0_rx_bus2
&rgmiim0_rgmii_clk
&rgmiim0_rgmii_bus
&rgmiim0_clk
&ethm0_pins>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

### gmac0m1

```c
&gmac0 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "input";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
```

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

tx\_delay = &lt;0x39&gt;;   

/\* rx\_delay = &lt;0x3f&gt;; \*/   

```dts
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_miim
&rgmiim1_tx_bus2
&rgmiim1_rx_bus2
&rgmiim1_rgmii_clk
&rgmiim1_rgmii_bus
&rgmiim1_clk
&ethm1_pins>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
assigned-clock-rates = <25000000>;
};
};
```

#### 3.10.5 RGMII Crystal 25M for PHY, PLL output 125M for TX\_CLK

### gmac0m0

```c
&gmac0 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x3f>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmiim0_miim
&rgmiim0_tx_bus2
&rgmiim0_rx_bus2
&rgmiim0_rgmii_clk
&rgmiim1_rgmii_bus>;
phy-handle = <&rgmii_phy>;
status = "okay";
```

```dts
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

### gmac0m1

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x3f>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_miim
&rgmiim1_tx_bus2
&rgmiim1_rx_bus2
&rgmiim1_rgmii_clk
&rgmiim1_rgmii_bus>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.10.6 RGMII Crystal 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

### gmac0m0

```c
&gmac0 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
phy-mode = "rgmii-rxid";
clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
```

tx\_delay = &lt;0x3f&gt;;   

/\* rx\_delay = &lt;0x3f&gt;; \*/   

```dts
pinctrl-names = "default";
pinctrl-0 = <&rgmiim0_miim
&rgmiim0_tx_bus2
&rgmiim0_rx_bus2
&rgmiim0_rgmii_clk
&rgmiim0_rgmii_bus
&rgmiim0_clk>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

### gmac0m1

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

```dts
phy-mode = "rgmii-rxid";
clock_in_out = "input";
snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
tx_delay = <0x39>;
/* rx_delay = <0x3f>; */
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_miim
&rgmiim1_tx_bus2
&rgmiim1_rx_bus2
&rgmiim1_rgmii_clk
&rgmiim1_rgmii_bus
&rgmiim1_clk>;
phy-handle = <&rgmii_phy>;
status = "okay";
};
&mdio0 {
rgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

### 3.11 RK3568

#### 3.11.1 RMII Clock Output

gmac0

```dts
&gmac0 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_GMAC0\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC0&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC0\_RMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;50000000&gt;;   

snps,reset-gpio = &lt;&gpio3 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

```dts
pinctrl-names = "default";
pinctrl-0 = <&gmac0_miim &gmac0_clkinout &gmac0_rx_bus2 &gmac0_tx_bus2>;
phy-handle = <&rmii_phy0>;
status = "okay";
};
&mdio0 {
rmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m0:

```dts
&gmac1 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;50000000&gt;;   

snps,reset-gpio = &lt;&gpio3 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m0\_miim &gmac1m0\_clkinout &gmac1m0\_rx\_bus2   

&gmac1m0\_tx\_bus2&gt;;   

```dts
phy-handle = <&rmii_phy1>;
status = "okay";
};
&mdio1 {
rmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";

reg = <0x0>;
};
};
```

### gmac1m1:

```dts
&gmac1 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;50000000&gt;;   

snps,reset-gpio = &lt;&gpio3 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m1\_miim &gmac1m1\_clkinout &gmac1m1\_rx\_bus2   

&gmac1m1\_tx\_bus2&gt;;   

```dts
phy-handle = <&rmii_phy1>;
status = "okay";
};
&mdio1 {
rmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.11.2 RMII Clock Input

gmac0

```
+&gmac0_clkin{
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+};
&gmac0 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio3 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_GMAC0\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC0&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC0\_RMII\_SPEED&gt;, &lt;&gmac0\_clkin&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac0\_miim &gmac0\_clkinout &gmac0\_rx\_bus2 &gmac0\_tx\_bus2&gt;;   

```dts
phy-handle = <&rmii_phy0>;

status = "okay";
};
&mdio0 {
rmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m0:

```
+&gmac1_clkin{
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+};
&gmac1 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio3 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RMII\_SPEED&gt;, &lt;&gmac1\_clkin&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m0\_miim &gmac1m0\_clkinout &gmac1m0\_rx\_bus2   

&gmac1m0\_tx\_bus2&gt;;   

```dts
phy-handle = <&rmii_phy1>;
status = "okay";
};
&mdio1 {
rmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m1:

```
+&gmac1_clkin{
```

+ clock-frequency = &lt;50000000&gt;;   

```dts
+};
&gmac1 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio3 RK\_PC2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RMII\_SPEED&gt;, &lt;&gmac1\_clkin&gt;;

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m1\_miim &gmac1m1\_clkinout &gmac1m1\_rx\_bus2   

&gmac1m1\_tx\_bus2&gt;;   

```dts
phy-handle = <&rmii_phy1>;
status = "okay";
};
&mdio1 {
rmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.11.3 RGMII PLL output 25M for PHY, PLL output 125M for TX\_CLK

gmac0

```hcl
&gmac0 {
+ phy-mode = "rgmii";
+ clock_in_out = "output";
+ assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>, <&cru
CLK_MAC0_OUT>;
+ assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>;
+ assigned-clock-rates = <0>, <125000000>, <25000000>;
snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac0_miim
&gmac0_tx_bus2
+ &gmac0_rx_bus2
&gmac0_rgmii_clk
+ &gmac0_rgmii_bus
+ &eth0_pins>;
tx_delay = <0x3c>;
rx_delay = <0x2f>;
phy-handle = <&rgmii_phy0>;
status = "okay";
};
&mdio0 {
rgmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
+ clocks = <&cru CLK_MAC0_OUT>;
};
};
```

```dts
&gmac1 {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio2 RK\_PD1 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;, &lt;&cru   

CLK\_MAC1\_OUT&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RGMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;125000000&gt;, &lt;25000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m0\_miim   

+ &gmac1m0\_tx\_bus2   

+ &gmac1m0\_rx\_bus2   

+ &gmac1m0\_rgmii\_clk   

+ &gmac1m0\_rgmii\_bus   

+ &eth1m0\_pins&gt;;   

tx\_delay = &lt;0x4f&gt;;   

rx\_delay = &lt;0x26&gt;;   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
```

+ clocks = &lt;&cru CLK\_MAC1\_OUT&gt;;   

```
};
};
```

### gmac1m1

```dts
&gmac1 {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio2 RK\_PD1 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;, &lt;&cru   

CLK\_MAC1\_OUT&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RGMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;125000000&gt;, &lt;25000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m1\_miim   

+ &gmac1m1\_tx\_bus2

```c
+ &gmac1m1_rx_bus2
+ &gmac1m1_rgmii_clk
+ &gmac1m1_rgmii_bus
+ &eth1m1_pins>;
tx_delay = <0x4f>;
rx_delay = <0x26>;
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
+ clocks = <&cru CLK_MAC1_OUT>;
};
};
```

#### 3.11.4 RGMII PLL output 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

gmac0

```dts
&gmac0 {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "input";   

+ assigned-clocks = &lt;&cru SCLK\_GMAC0\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC0&gt;, &lt;&cru   

CLK\_MAC0\_OUT&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC0\_RGMII\_SPEED&gt;, &lt;&gmac0\_clkin&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;125000000&gt;, &lt;25000000&gt;;   

snps,reset-gpio = &lt;&gpio2 RK\_PD3 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac0\_miim   

+ &gmac0\_tx\_bus2   

+ &gmac0\_rx\_bus2   

+ &gmac0\_rgmii\_clk   

+ &gmac0\_rgmii\_bus   

+ &eth0\_pins   

+ &gmac0\_clkinout&gt;;   

tx\_delay = &lt;0x3c&gt;;   

rx\_delay = &lt;0x2f&gt;;   

```dts
phy-handle = <&rgmii_phy0>;
status = "okay";
};
&mdio0 {
rgmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
```

```javascript
reg = <0x0>;
+ clocks = <&cru CLK_MAC0_OUT>;
};
};
```

### gmac1m0

```hcl
&gmac1 {
+ phy-mode = "rgmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru
CLK_MAC1_OUT>;
+ assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+ assigned-clock-rates = <0>, <125000000>, <25000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac1m0_miim
+ &gmac1m0_tx_bus2
+ &gmac1m0_rx_bus2
+ &gmac1m0_rgmii_clk
+ &gmac1m0_rgmii_bus
+ &eth1m0_pins
+ &gmac1m0_clkinout>;
tx_delay = <0x4f>;
rx_delay = <0x26>;
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio0 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
+ clocks = <&cru CLK_MAC0_OUT>;
};
};
```

### gmac1m1

```dts
&gmac1 {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio2 RK\_PD1 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;, &lt;&cru   

CLK\_MAC1\_OUT&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RGMII\_SPEED&gt;, &lt;&gmac1\_clkin&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;125000000&gt;, &lt;25000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m1\_miim   

+ &gmac1m1\_tx\_bus2   

+ &gmac1m1\_rx\_bus2   

+ &gmac1m1\_rgmii\_clk   

+ &gmac1m1\_rgmii\_bus   

+ &eth1m1\_pins   

+ &gmac1m1\_clkinout&gt;;   

tx\_delay = &lt;0x4f&gt;;   

rx\_delay = &lt;0x26&gt;;   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
```

+ clocks = &lt;&cru CLK\_MAC1\_OUT&gt;;   

```
};
};
```

#### 3.11.5 RGMII Crystal 25M for PHY, PLL output 125M for TX\_CLK

gmac0

```diff
&gmac0 {
+ phy-mode = "rgmii";
+ clock_in_out = "output";
+ assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>;
+ assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>;
+ assigned-clock-rates = <0>, <125000000>;
snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac0_miim
+ &gmac0_tx_bus2
+ &gmac0_rx_bus2
+ &gmac0_rgmii_clk
+ &gmac0_rgmii_bus>;
tx_delay = <0x3c>;
rx_delay = <0x2f>;
phy-handle = <&rgmii_phy0>;
```

```dts
status = "okay";
};
&mdio0 {
rgmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m0

```dts
&gmac1 {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio2 RK\_PD1 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RGMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;125000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m0\_miim   

+ &gmac1m0\_tx\_bus2   

+ &gmac1m0\_rx\_bus2   

+ &gmac1m0\_rgmii\_clk   

+ &gmac1m0\_rgmii\_bus&gt;;   

tx\_delay = &lt;0x4f&gt;;   

rx\_delay = &lt;0x26&gt;;   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m1

```hcl
&gmac1 {
+ phy-mode = "rgmii";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
```

+ assigned-clocks = &lt;&cru SCLK\_GMAC1\_RX\_TX&gt;, &lt;&cru SCLK\_GMAC1&gt;;   

+ assigned-clock-parents = &lt;&cru SCLK\_GMAC1\_RGMII\_SPEED&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;125000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1m1\_miim   

+ &gmac1m1\_tx\_bus2   

+ &gmac1m1\_rx\_bus2   

+ &gmac1m1\_rgmii\_clk   

+ &gmac1m1\_rgmii\_bus&gt;;   

tx\_delay = &lt;0x4f&gt;;   

rx\_delay = &lt;0x26&gt;;   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.11.6 RGMII Crystal 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

gmac0

```c
&gmac0 {
+ phy-mode = "rgmii";
+ clock_in_out = "input";
+ assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>;
+ assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>, <&gmac0_clkin>;
+ assigned-clock-rates = <0>, <125000000>;
snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac0_miim
+ &gmac0_tx_bus2
+ &gmac0_rx_bus2
+ &gmac0_rgmii_clk
+ &gmac0_rgmii_bus
+ &gmac0_clkinout>;
tx_delay = <0x3c>;
rx_delay = <0x2f>;
phy-handle = <&rgmii_phy0>;
status = "okay";
};
```

```dts
&mdio0 {
rgmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m0

```hcl
&gmac1 {
+ phy-mode = "rgmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+ assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+ assigned-clock-rates = <0>, <125000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac1m0_miim
+ &gmac1m0_tx_bus2
+ &gmac1m0_rx_bus2
+ &gmac1m0_rgmii_clk
+ &gmac1m0_rgmii_bus
+ &gmac1m0_clkinout>;
tx_delay = <0x4f>;
rx_delay = <0x26>;
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac1m1

```dts
&gmac1 {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio2 RK\_PD1 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;

```c
+ assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+ assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+ assigned-clock-rates = <0>, <125000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac1m1_miim
+ &gmac1m1_tx_bus2
+ &gmac1m1_rx_bus2
+ &gmac1m1_rgmii_clk
+ &gmac1m1_rgmii_bus
+ &gmac1m1_clkinout>;
tx_delay = <0x4f>;
rx_delay = <0x26>;
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.11.7 SGMII

DTS 除了配置 gmac 和 mac phy 节点外，还需要配置 xpcs 和 combophy 节点。

combophy

其中属性 rockchip,sgmii-mac-sel 表示使用的是哪个 gmac：

```javascript
&combphy1_usq {
+ rockchip,sgmii-mac-sel = <0>; /* Use gmac0 for sgmii */
status = "okay";
};
```

xpcs

```hcl
&xpcs {
status = "okay";
};
```

gmac0

```dts
&gmac0 {
phy-mode = "sgmii";
rockchip,pipegrf = <&pipegrf>;
rockchip,xpcs = <&xpcs>;
snps,reset-gpio = <&gpio2 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;

snps,reset-delays-us = <0 20000 100000>;
assigned-clocks = <&cru SCLK_GMAC0_RX_TX>;
assigned-clock-parents = <&gmac0_xpcsclk>;
pinctrl-names = "default";
pinctrl-0 = <&gmac0_miim>;
power-domains = <&power RK3568_PD_PIPE>;
phys = <&combphy1_usq PHY_TYPE_SGMII>;
phy-handle = <&sgmii_phy>;
status = "okay";
};
&mdio0 {
sgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

### gmac1

```dts
&gmac1 {
phy-mode = "sgmii";
rockchip,pipegrf = <&pipegrf>;
rockchip,xpcs = <&xpcs>;
snps,reset-gpio = <&gpio2 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
assigned-clocks = <&cru SCLK_GMAC1_RX_TX>;
assigned-clock-parents = <&gmac1_xpcsclk>;
pinctrl-names = "default";
pinctrl-0 = <&gmac1_miim>;
power-domains = <&power RK3568_PD_PIPE>;
phys = <&combphy1_usq PHY_TYPE_SGMII>;
phy-handle = <&sgmii_phy>;
status = "okay";
};
&mdio1 {
sgmii_phy: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.11.8 QSGMII

同 SGMIIl 类似，DTS 除了配置 gmac 和 mac phy 节点外，还需要配置 xpcs 和 combophy 节点。

combophy

```hcl
&combphy2_psq {
status = "okay";
};
```

xpcs

```hcl
&xpcs {
status = "okay";
};
```

```hcl
&gmac0 {
phy-supply = <&pcie20_3v3>;
phy-mode = "qsgmii";
rockchip,xpcs = <&xpcs>;
snps,reset-gpio = <&gpio2 RK_PC2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 20000 100000>;
assigned-clocks = <&cru SCLK_GMAC0_RX_TX>;
assigned-clock-parents = <&gmac0_xpcsclk>;
pinctrl-names = "default";
pinctrl-0 = <&gmac0_miim>;
power-domains = <&power RK3568_PD_PIPE>;
phys = <&combphy2_psq PHY_TYPE_QSGMII>;
phy-handle = <&qsgmii_phy0>;
status = "okay";
};
&gmac1 {
phy-supply = <&pcie20_3v3>;
phy-mode = "qsgmii";
assigned-clocks = <&cru SCLK_GMAC1_RX_TX>;
assigned-clock-parents = <&gmac1_xpcsclk>;
power-domains = <&power RK3568_PD_PIPE>;
phy-handle = <&qsgmii_phy1>;
status = "okay";
};
&mdio0 {
qsgmii_phy0: phy@0 {
compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
```

```dts
};
qsgmii_phy1: phy@1 {
compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
qsgmii_phy2: phy@2 {
compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
reg = <0x2>;
};
qsgmii_phy3: phy@3 {
compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
reg = <0x3>;
};
};
```

### 3.12 RK3588/RK3576

#### 3.12.1 RMII Clock Output

gmac0

```diff
&gmac0 {
+ phy-mode = "rmii";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac0_miim
+ &gmac0_tx_bus2
+ &gmac0_rx_bus2
+ &gmac0_clkinout>;
phy-handle = <&rmii_phy0>;
status = "okay";
};
&mdio0 {
rmii_phy0: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

gmac1:

```dts
&gmac1 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";

snps,reset-gpio = &lt;&gpio3 RK\_PB2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1\_miim   

+ &gmac1\_tx\_bus2   

+ &gmac1\_rx\_bus2   

+ &gmac1\_clkinout&gt;;   

```dts
phy-handle = <&rmii_phy1>;
status = "okay";
};
&mdio1 {
rmii_phy1: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.12.2 RMII Clock Input

gmac0

```dts
&gmac0 {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio4 RK\_PB3 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac0\_miim   

+ &gmac0\_tx\_bus2   

+ &gmac0\_rx\_bus2   

+ &gmac0\_clkinout&gt;;   

```dts
phy-handle = <&rmii_phy0>;
status = "okay";
};
&mdio0 {
rmii_phy0: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

gmac1:

```dts
&gmac1 {
```

```proto
+ phy-mode = "rmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac1_miim
+ &gmac1_tx_bus2
+ &gmac1_rx_bus2
&gmac1_clkinout>;
phy-handle = <&rmii_phy1>;
status = "okay";
};
&mdio1 {
rmii_phy1: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
};
};
```

#### 3.12.3 RGMII PLL output 25M for PHY, PLL output 125M for TX\_CLK

gmac0

```c
&gmac0 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
+ phy-mode = "rgmii-rxid";
clock_in_out = "output";
snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac0_miim
+ &gmac0_tx_bus2
+ &gmac0_rx_bus2
+ &gmac0_rgmii_clk
+ &gmac0_rgmii_bus
+ &eth0_pins>;
tx_delay = <0x45>;
/* rx_delay = <0x43>; */
phy-handle = <&rgmii_phy0>;
status = "okay";
};
&mdio0 {
```

```dts
rgmii_phy0: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
```

+ clocks = &lt;&cru REFCLKO25M\_ETH0\_OUT&gt;;   

```
};
};
```

gmac1

```dts
&gmac1 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

+ phy-mode = "rgmii-rxid";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio3 RK\_PB2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1\_miim   

+ &gmac1\_tx\_bus2   

+ &gmac1\_rx\_bus2   

+ &gmac1\_rgmii\_clk   

+ &gmac1\_rgmii\_bus   

+ &eth1\_pins&gt;;   

tx\_delay = &lt;0x45&gt;;   

/\* rx\_delay = &lt;0x43&gt;; \*/   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
```

+ clocks = &lt;&cru REFCLKO25M\_ETH0\_OUT&gt;;   

```
};
};
```

#### 3.12.4 RGMII PLL output 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

gmac0

```c
&gmac0 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
+ phy-mode = "rgmii-rxid";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
```

```c
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac0_miim
+ &gmac0_tx_bus2
&gmac0_rx_bus2
&gmac0_rgmii_clk
+ &gmac0_rgmii_bus
+ &gmac0_clkinout
+ &eth0_pins>;
tx_delay = <0x45>;
/* rx_delay = <0x43>; */
phy-handle = <&rgmii_phy0>;
status = "okay";
};
&mdio0 {
rgmii_phy0: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
+ clocks = <&cru REFCLKO25M_ETH0_OUT>;
};
};
```

### gmac1

```dts
&gmac1 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

+ phy-mode = "rgmii-rxid";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio3 RK\_PB2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1\_miim   

+ &gmac1\_tx\_bus2   

+ &gmac1\_rx\_bus2   

+ &gmac1\_rgmii\_clk   

+ &gmac1\_rgmii\_bus   

+ &gmac1\_clkinout   

+ &eth1\_pins&gt;;   

tx\_delay = &lt;0x45&gt;;   

/\* rx\_delay = &lt;0x43&gt;; \*/   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@1 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x1>;
```

```javascript
+ clocks = <&cru REFCLKO25M_ETH0_OUT>;
};
};
```

#### 3.12.5 RGMII Crystal 25M for PHY, PLL output 125M for TX\_CLK

### gmac0

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

+ phy-mode = "rgmii-rxid";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio4 RK\_PB3 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac0\_miim   

+ &gmac0\_tx\_bus2   

+ &gmac0\_rx\_bus2   

+ &gmac0\_rgmii\_clk   

+ &gmac0\_rgmii\_bus&gt;;   

tx\_delay = &lt;0x45&gt;;   

/\* rx\_delay = &lt;0x43&gt;; \*/   

```dts
phy-handle = <&rgmii_phy0>;
status = "okay";
};
&mdio0 {
rgmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

gmac1

```c
&gmac1 {
/* Use rgmii-rxid mode to disable rx delay inside Soc */
+ phy-mode = "rgmii-rxid";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&gmac1_miim
+ &gmac1_tx_bus2
&gmac1_rx_bus2
```

+ &gmac1\_rgmii\_clk   

+ &gmac1\_rgmii\_bus&gt;;   

tx\_delay = &lt;0x45&gt;;   

/\* rx\_delay = &lt;0x43&gt;; \*/   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.12.6 RGMII Crystal 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

### gmac0

```dts
&gmac0 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

+ phy-mode = "rgmii-rxid";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio4 RK\_PB3 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac0\_miim   

+ &gmac0\_tx\_bus2   

+ &gmac0\_rx\_bus2   

+ &gmac0\_rgmii\_clk   

+ &gmac0\_rgmii\_bus   

+ &gmac0\_clkinout&gt;;   

tx\_delay = &lt;0x45&gt;;   

/\* rx\_delay = &lt;0x43&gt;; \*/   

```dts
phy-handle = <&rgmii_phy0>;
status = "okay";
};
&mdio0 {
rgmii_phy0: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};

&gmac1 {
```

/\* Use rgmii-rxid mode to disable rx delay inside Soc \*/   

+ phy-mode = "rgmii-rxid";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio3 RK\_PB2 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&gmac1\_miim   

+ &gmac1\_tx\_bus2   

+ &gmac1\_rx\_bus2   

+ &gmac1\_rgmii\_clk   

+ &gmac1\_rgmii\_bus   

+ &gmac1\_clkinout&gt;;   

tx\_delay = &lt;0x45&gt;;   

/\* rx\_delay = &lt;0x43&gt;; \*/   

```dts
phy-handle = <&rgmii_phy1>;
status = "okay";
};
&mdio1 {
rgmii_phy1: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### 3.13 RV1108

#### 3.13.1 RMII Clock Input

```
+gmac_clkin: gmac_clkin {
```

+ compatible = "fixed-clock";   

+ clock-output-names = "gmac\_clkin";   

+ clock-frequency = &lt;50000000&gt;;   

+ #clock-cells = &lt;0&gt;;   

```dts
+};
&gmac {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "input";   

+ assigned-clocks = &lt;&cru SCLK\_MAC&gt;;   

+ assigned-clock-parents = &lt;&gmac\_clkin&gt;;   

snps,reset-gpio = &lt;&gpio3 12 0&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

pinctrl-names = "default";

+ pinctrl-0 = &lt;&rmii\_pins&gt;;   

status = "ok";

#### 3.13.2 RMII Clock Output

```dts
&gmac {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";   

+ assigned-clocks = &lt;&cru SCLK\_MAC&gt;;   

+ assigned-clock-rates = &lt;50000000&gt;;   

snps,reset-gpio = &lt;&gpio3 12 0&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmii\_pins&gt;;   

```
status = "ok";
};
```

### 3.14 RV1126

#### 3.14.1 RGMII PLL output 25M for PHY, PLL output 125M for TX\_CLK

gmac m0

```dts
&gmac {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio3 RK\_PA0 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;   

+ assigned-clocks = &lt;&cru CLK\_GMAC\_SRC&gt;, &lt;&cru CLK\_GMAC\_TX\_RX&gt;, &lt;&cru   

CLK\_GMAC\_ETHERNET\_OUT&gt;;   

+ assigned-clock-parents = &lt;&cru CLK\_GMAC\_SRC\_M0&gt;, &lt;&cru RGMII\_MODE\_CLK&gt;;   

+ assigned-clock-rates = &lt;125000000&gt;, &lt;0&gt;, &lt;25000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rgmiim0\_miim &rgmiim0\_bus2 &rgmiim0\_bus4 &clkm0\_out\_ethernet&gt;;   

tx\_delay = &lt;0x2a&gt;;   

rx\_delay = &lt;0x1a&gt;;   

```dts
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
```

+ clocks = &lt;&cru CLK\_GMAC\_ETHERNET\_OUT&gt;;

gmac m1

```hcl
&gmac {
+ phy-mode = "rgmii";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+ assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+ assigned-clock-rates = <125000000>, <0>, <25000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4 &clkm1_out_ethernet>;
tx_delay = <0x2a>;
rx_delay = <0x1a>;
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
+ clocks = <&cru CLK_GMAC_ETHERNET_OUT>;
};
};
```

#### 3.14.2 RGMII PLL output 25M for PHY, RGMII Clock input 125M for TX\_CLK

### gmac m0

```hcl
&gmac {
+ phy-mode = "rgmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+ assigned-clock-parents = <&cru CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;
+ assigned-clock-rates = <125000000>, <0>, <25000000>;
```

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rgmiim0\_miim &rgmiim0\_bus2 &rgmiim0\_bus4 &clkm0\_out\_ethernet&gt;;   

tx\_delay = &lt;0x2a&gt;;   

rx\_delay = &lt;0x1a&gt;;   

```dts
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
```

+ clocks = &lt;&cru CLK\_GMAC\_ETHERNET\_OUT&gt;;   

```
};
};
```

### gmac m1

```hcl
&gmac {
+ phy-mode = "rgmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+ assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+ assigned-clock-rates = <125000000>, <0>, <25000000>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4 &clkm1_out_ethernet>;
tx_delay = <0x2a>;
rx_delay = <0x1a>;
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
+ clocks = <&cru CLK_GMAC_ETHERNET_OUT>;
};
};
```

#### 3.14.3 RGMII Crytal 25M for PHY, PLL output 125M for TX\_CLK

gmac m0

```hcl
&gmac {
+ phy-mode = "rgmii";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+ assigned-clock-parents = <&cru CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;
+ assigned-clock-rates = <125000000>, <0>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmiim0_miim &rgmiim0_bus2 &rgmiim0_bus4 &clkm0_out_ethernet>;
tx_delay = <0x2a>;
rx_delay = <0x1a>;
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

gmac m1

```c
&gmac {
+ phy-mode = "rgmii";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+ assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+ assigned-clock-rates = <125000000>, <0>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4 &clkm1_out_ethernet>;
tx_delay = <0x2a>;
rx_delay = <0x1a>;
phy-handle = <&phy>;
```

```dts
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.14.4 RGMII Crytal 25M for PHY, RGMII\_CLK input 125M for TX\_CLK

gmac m0

```hcl
&gmac {
+ phy-mode = "rgmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
+ assigned-clocks = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru
CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+ assigned-clock-parents = <&gmac_clkin_m0>, <&cru CLK_GMAC_RGMII_M0>, <&cru
CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rgmiim0_miim &rgmiim0_bus2 &rgmiim0_bus4>;
tx_delay = <0x2a>;
rx_delay = <0x1a>;
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac m1

```dts
&gmac {
```

+ phy-mode = "rgmii";   

+ clock\_in\_out = "input";   

snps,reset-gpio = &lt;&gpio3 RK\_PA0 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

/\* Reset time is 20ms, 100ms for rtl8211f \*/   

snps,reset-delays-us = &lt;0 20000 100000&gt;;

+ assigned-clocks = &lt;&cru CLK\_GMAC\_SRC&gt;, &lt;&cru CLK\_GMAC\_TX\_RX&gt;, &lt;&cru   

CLK\_GMAC\_ETHERNET\_OUT&gt;;   

+ assigned-clock-parents = &lt;&cru CLK\_GMAC\_SRC\_M1&gt;, &lt;&cru RGMII\_MODE\_CLK&gt;;   

+ assigned-clock-rates = &lt;125000000&gt;, &lt;0&gt;, &lt;25000000&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rgmiim1\_miim &rgmiim1\_bus2 &rgmiim1\_bus4&gt;;   

tx\_delay = &lt;0x2a&gt;;   

rx\_delay = &lt;0x1a&gt;;   

```dts
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.14.5 RMII Clock Output

### gmac m0

```dts
&gmac {
```

+ phy-mode = "rmii";   

+ clock\_in\_out = "output";   

snps,reset-gpio = &lt;&gpio3 RK\_PC5 GPIO\_ACTIVE\_LOW&gt;;   

snps,reset-active-low;   

snps,reset-delays-us = &lt;0 50000 50000&gt;;   

+ assigned-clocks = &lt;&cru CLK\_GMAC\_SRC\_M0&gt;, &lt;&cru CLK\_GMAC\_SRC&gt;, &lt;&cru   

CLK\_GMAC\_TX\_RX&gt;;   

+ assigned-clock-rates = &lt;0&gt;, &lt;50000000&gt;;   

+ assigned-clock-parents = &lt;&cru CLK\_GMAC\_RGMII\_M0&gt;, &lt;&cru CLK\_GMAC\_SRC\_M0&gt;,   

&lt;&cru RMII\_MODE\_CLK&gt;;   

+ pinctrl-names = "default";   

+ pinctrl-0 = &lt;&rmiim0\_miim &rgmiim0\_rxer &rmiim0\_bus2 &rgmiim0\_mclkinout&gt;;   

```dts
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

gmac m1

```diff
&gmac {
+ phy-mode = "rmii";
+ clock_in_out = "output";
snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
+ assigned-clocks = <&cru CLK_GMAC_SRC_M1>, <&cru CLK_GMAC_SRC>, <&cru
CLK_GMAC_TX_RX>;
+ assigned-clock-rates = <0>, <50000000>;
+ assigned-clock-parents = <&cru CLK_GMAC_RGMII_M1>, <&cru CLK_GMAC_SRC_M1>,
<&cru RMII_MODE_CLK>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmiim1_miim &rgmiim1_rxer &rmiim10_bus2 &rgmiim1_mclkinout>;
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

#### 3.14.6 RMII Clock Input

gmac m0

```diff
+&gmac_clkin_m0 {
+ clock-frequency = <50000000>;
+};
&gmac {
+ phy-mode = "rmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
+ assigned-clocks = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru
CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+ assigned-clock-rates = <0>, <0>, <50000000>;
+ assigned-clock-parents = <&gmac_clkin_m0>,<&cru CLK_GMAC_RGMII_M0>, <&cru
CLK_GMAC_SRC_M0>, <&cru RMII_MODE_CLK>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmiim0_miim &rgmiim0_rxer &rmiim0_bus2
&rgmiim0_mclkinout_level0>;
```

```dts
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```

### gmac m1

```diff
+&gmac_clkin_m1 {
+ clock-frequency = <50000000>;
+};
&gmac {
+ phy-mode = "rmii";
+ clock_in_out = "input";
snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
snps,reset-delays-us = <0 50000 50000>;
+ assigned-clocks = <&cru CLK_GMAC_RGMII_M1>, <&cru CLK_GMAC_SRC_M1>, <&cru
CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+ assigned-clock-rates = <0>, <0>, <50000000>;
+ assigned-clock-parents = <&gmac_clkin_m1>,<&cru CLK_GMAC_RGMII_M1>, <&cru
CLK_GMAC_SRC_M1>, <&cru RMII_MODE_CLK>;
+ pinctrl-names = "default";
+ pinctrl-0 = <&rmiim1_miim &rgmiim1_rxer &rmiim1_bus2
&rgmiim1_mclkinout_level0>;
phy-handle = <&phy>;
status = "okay";
};
&mdio {
phy: phy@0 {
compatible = "ethernet-phy-ieee802.3-c22";
reg = <0x0>;
};
};
```
