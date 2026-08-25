---
sidebar_position: 1
---

# Linux SATA 开发指南

## 前言

## 概述

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK356X | 4.19 |
| RK3588/RK3588S/RK356X | 5.10 |
| RK3576 | 6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 日期 | 版本 | 作者 | 修改说明 |
| --- | --- | --- | --- |
| 2021-02-26 | V1.0.0 | 赵仪峰 | 初始版本 |
| 2021-04-30 | V1.1.0 | 赵仪峰 | 增加ACTLED配置说明 |
| 2021-12-23 | V2.0.0 | 赵仪峰 | 增加RK3588支持增加限速配置信息等修正RK3566支持SATA信息 |
| 2022-09-08 | V2.1.0 | 赵仪峰 | 增加JMB575 固件下载说明增加支持硬盘个数限制说明增加U-boot支持说明 |
| 2023-07-20 | V2.2.0 | 赵仪峰 | 补充U-boot DTS配置说明增加休眠和待机设置说明 |
| 2024-04-28 | V2.3.0 | 赵仪峰 | 增加RK3576支持 |

## 1. 芯片资源介绍

RK3566


| 资源 | 模式 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA1 | 6G/3G/1.5G | 支持（支持5个硬盘） | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE、QSGMII |  |

RK3568


| 资源 | 速率 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持（支持5个硬盘） | USB |  |
| SATA1 | 6G/3G/1.5G | 支持（支持5个硬盘） | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE、QSGMII |  |

RK3588S


| 资源 | 模式 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE |  |
| SATA2 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE、USB |  |

RK3588


| 资源 | 速率 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE |  |
| SATA1 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE |  |
| SATA2 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE、USB |  |

RK3576


| 资源 | 速率 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE |  |
| SATA1 | 6G/3G/1.5G | 支持（支持5个硬盘） | PCIE、USB |  |

## 2. DTS 配置

RK3566


| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA1 | rk3568.dtsi | satal | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3568


| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3568.dtsi | sata0 | combphy0_us |
| SATA1 | rk3568.dtsi | satal | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3588


| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3588.dtsi | satal | combphy1_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3588s


| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3576


| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3576.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3576.dtsi | satal | combphy1_psu |

1. compatible = "rockchip,rk-ahci", "snps,dwc-ahci";

必须配置项：默认配置，对应驱动：drivers/ata/ahci\_platform.c。

2. phy-names = "sata-phy“;

必须配置项：不可以修改，AHCI驱动会根据"sata-phy“名字找到对应combphy节点。

3. status = &lt;okay&gt;;

必须配置项：此配置需要在 SATA控制器节点和对应的 phy 节点同时使能。

4. assigned-clock-rates = &lt;100000000&gt;;

必须配置项：可以配置的参考时钟频率值有：24000000、25000000和100000000，推荐配置100000000。

5. pinctrl-0 = &lt;&sata\_pm\_reset&gt;;

```hcl
sata_pm_reset: sata-pm-reset {
rockchip,pins = <4 RK_PD2 RK_FUNC_GPIO &pcfg_output_high>;
};
&combphy1_usq {
pinctrl-names = "default";
pinctrl-0 = <&sata_pm_reset>;
};
```

可选配置项：外接PM芯片扩展SATA口时，可能需要一个GPIO来复位PM芯片，具体可以参考“rk3568-nvr-demo-v10.dtsi”里面设置。

6. pinctrl-0 = &lt;&sata2\_pins&gt;;

```dts
&sata0 {
pinctrl-names = "default";
pinctrl-0 = <&sata0_pins>;
};
&sata1 {
pinctrl-names = "default";
pinctrl-0 = <&sata1_pins>;
};
&sata2 {
pinctrl-names = "default";
pinctrl-0 = <&sata2_pins>;
};
```

可选配置项：在对应的sata控制器节点增加pinctrl配置来启用SATA ACT LED功能。

6. dma-coherent;

可选配置项：RK3576支持CACHE一致性，SDK默认已经启用功能，dts可以配置，其他平台不能配置这个参数。

## 3. menuconfig 配置

需要确保如下配置打开，方可正确的使用 SATA相关功能。

CONFIG\_ATA=y   

CONFIG\_SATA\_AHCI=y   

CONFIG\_SATA\_AHCI\_PLATFORM=y   

CONFIG\_PHY\_ROCKCHIP\_NANENG\_COMBO\_PHY=y

## 4. U-boot支持SATA

### 4.1 DTS修改

DTS需要启用combphy和sata控制器, 引用到的php\_grf和pipe\_phyx\_grf节点也需要启用，下面代码是RK3588 SATA0的配置参考：

```diff
diff --git a/arch/arm/dts/rk3588-u-boot.dtsi b/arch/arm/dts/rk3588-u-boot.dtsi
index 3fe8054aac..29cb50e122 100644
--- a/arch/arm/dts/rk3588-u-boot.dtsi
+++ b/arch/arm/dts/rk3588-u-boot.dtsi
@@ -192,6 +192,16 @@
status = "okay";
};
+&sata0 {
+ u-boot,dm-pre-reloc;
+ status = "okay";
+};
+
+&combphy0_ps {
+ u-boot,dm-pre-reloc;
+ status = "okay";
+};
+
/* Support SPL-PINCTRL:
* 1. ioc
* 2. pinctrl(sdmmc)
```

### 4.2 编译

RK356x的配置文件为“rk3568-sata.config”，编译命令：

./make.sh rk3568-sata

RK3588(s)的配置文件为“rk3588-sata.config”，编译命令：

./make.sh rk3588-sata

## 5. 常见问题

## 5.1是否支持通过SATA接口给PM芯片下载固件？

RK356X和RK3588都支持JMB575下载固件，补丁下载地址：JMB575固件下载补丁

### 5.2 SATA性能怎么测试？

参考文档 RK-KF-YF-138 《Rockchip\_RK3568\_Reference\_SATA\_Performance\_CN》。

5. 3默认SDK代码认不到SATA设备，什么原因？

软件情况1：第一版SDK代码单独更新uboot后，会出现这个问题，需要更新一下kernel下phy驱动。

commit b3f78165e536d35b2337063093bb33a018ff518d   

Author: Shawn Lin &lt;shawn.lin@rock-chips.com&gt;   

Date: Wed Dec 23 16:17:31 2020 +0800   

phy: rockchip: naneng-combphy: Reset phy if not being used   

Change-Id: Ia62481ebf5aa5684c359fd00a3933bb02e2caaff   

Signed-off-by: Shawn Lin &lt;shawn.lin@rock-chips.com&gt;

软件情况2： SATA和PCIE只能二选一，DTS里面需要把PCIE配置为disabled。

硬件情况： SATA和PCIE只能二选一 ，如果有做兼容布板会影响信号，把PCIE走线部分的分支去掉。

### 5.4 如何限制SATA速度到1.5G或者3G？

PHY驱动默认支持6G速率，通过修改PHY驱动来限制PHY的最高支持速率，下面是不同平台参考补丁。

RK356X 限制到1.5G补丁：

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 08445c1890eb..3df0e0e05ab4 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -604,7 +604,7 @@ static const struct rockchip_combphy_grfcfg
rk3568_combphy_grfcfgs = {
.con2_for_sata = { 0x0008, 15, 0, 0x00, 0x80c3 },
.con3_for_sata = { 0x000c, 15, 0, 0x00, 0x4407 },
/* pipe-grf */
.pipe_con0_for_sata = { 0x0000, 15, 0, 0x00, 0x2220 },
+ .pipe_con0_for_sata = { 0x0000, 15, 0, 0x00, 0x0000 },
.pipe_sgmii_mac_sel = { 0x0040, 1, 1, 0x00, 0x01 },
.pipe_xpcs_phy_ready = { 0x0040, 2, 2, 0x00, 0x01 },
.u3otg0_port_en = { 0x0104, 15, 0, 0x0181, 0x1100 },
```

RK356X 限制到3G补丁：

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 08445c1890eb..3df0e0e05ab4 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -604,7 +604,7 @@ static const struct rockchip_combphy_grfcfg
rk3568_combphy_grfcfgs = {
.con2_for_sata = { 0x0008, 15, 0, 0x00, 0x80c3 },
.con3_for_sata = { 0x000c, 15, 0, 0x00, 0x4407 },
/* pipe-grf */
.pipe_con0_for_sata = { 0x0000, 15, 0, 0x00, 0x2220 },
+ .pipe_con0_for_sata = { 0x0000, 15, 0, 0x00, 0x1110 },
.pipe_sgmii_mac_sel = { 0x0040, 1, 1, 0x00, 0x01 },
.pipe_xpcs_phy_ready = { 0x0040, 2, 2, 0x00, 0x01 },
.u3otg0_port_en = { 0x0104, 15, 0, 0x0181, 0x1100 },
```

### RK3588(S) 限制到1.5G补丁：

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 6f7aa8ebc292..062116ad09e8 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -868,8 +868,8 @@ static const struct rockchip_combphy_grfcfg
rk3588_combphy_grfcfgs = {
.con2_for_sata = { 0x0008, 15, 0, 0x00, 0x80c1 },
.con3_for_sata = { 0x000c, 15, 0, 0x00, 0x0407 },
/* pipe-grf */
.pipe_con0_for_sata = { 0x0000, 11, 5, 0x00, 0x22 },
.pipe_con1_for_sata = { 0x0004, 2, 0, 0x00, 0x2 },
+ .pipe_con0_for_sata = { 0x0000, 11, 5, 0x00, 0x00 },
+ .pipe_con1_for_sata = { 0x0004, 2, 0, 0x00, 0x0 },
};
static const struct clk_bulk_data rk3588_clks[] = {
```

### RK3588(S) 限制到3G补丁：

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 6f7aa8ebc292..062116ad09e8 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -868,8 +868,8 @@ static const struct rockchip_combphy_grfcfg
rk3588_combphy_grfcfgs = {
.con2_for_sata = { 0x0008, 15, 0, 0x00, 0x80c1 },
.con3_for_sata = { 0x000c, 15, 0, 0x00, 0x0407 },
/* pipe-grf */
.pipe_con0_for_sata = { 0x0000, 11, 5, 0x00, 0x22 },
.pipe_con1_for_sata = { 0x0004, 2, 0, 0x00, 0x2 },
+ .pipe_con0_for_sata = { 0x0000, 11, 5, 0x00, 0x11 },
+ .pipe_con1_for_sata = { 0x0004, 2, 0, 0x00, 0x1 },
```

```c
};
static const struct clk_bulk_data rk3588_clks[] =
```

### 5.5 RK356X怎么启用FBS功能？

外接PM芯片时，开启FBS功能，可以提高读写性能。

更新下面补丁，修改dtsi的sata节点为 compatible = "rockchip,rk-ahci", "snps,dwc-ahci";

```diff
diff --git a/drivers/ata/ahci_platform.c b/drivers/ata/ahci_platform.c
index 3aab2e3d57f3..1825b33cc274 100644
--- a/drivers/ata/ahci_platform.c
+++ b/drivers/ata/ahci_platform.c
@@ -62,6 +62,9 @@ static int ahci_probe(struct platform_device *pdev)
if (of_device_is_compatible(dev->of_node, "hisilicon,hisi-ahci"))
hpriv->flags |= AHCI_HFLAG_NO_FBS | AHCI_HFLAG_NO_NCQ;
+ if (of_device_is_compatible(dev->of_node, "rockchip,rk-ahci"))
+ hpriv->flags |= AHCI_HFLAG_YES_FBS;
+
port = acpi_device_get_match_data(dev);
if (!port)
port = &ahci_port_info;
@@ -88,6 +91,7 @@ static const struct of_device_id ahci_of_match[] = {
{ .compatible = "snps,dwc-ahci", },
{ .compatible = "hisilicon,hisi-ahci", },
{ .compatible = "cavium,octeon-7130-ahci", },
+ { .compatible = "rockchip,rk-ahci", },
{},
};
```

5. 6硬盘怎么设置进入待机或者休眠？

关机的时候，需要设置硬盘进入待机或者休眠，避免直接下电造成硬盘损坏。

执行下面命令后，可能需要等待10秒硬盘才会停转并进入待机或者休眠，有访问硬盘时又会重新被唤醒，关机时建议硬盘umount后再执行命令，避免系统还有访读写访问。

```shell
待机： busybox hdparm -y /dev/block/sda
休眠： busybox hdparm -Y /dev/block/sda
```
