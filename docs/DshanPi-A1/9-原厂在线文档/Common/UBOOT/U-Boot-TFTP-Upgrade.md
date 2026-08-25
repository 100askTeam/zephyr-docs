---
sidebar_position: 1
---

# Rockchip U-Boot TFTP升级开发指南

## 前言

概述

本文主要描述了U-Boot中使用TFTP进行系统固件升级的方法和开发注意事项。

产品版本


| 芯片名称 | U-Boot版本 |
| --- | --- |
| ALL | next-dev分支 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 日期 | 版本 | 作者 | 修改说明 |
| --- | --- | --- | --- |
| 2020-10-12 | V1.0.0 | Hans Yang | 初始版本 |

## 1. 基本介绍

使用U-Boot下载固件或文件除了通过USB、SD卡等存储设备外，最快捷的方法是通过网络传输。为了这一目的，U-Boot实现了TFTP协议。以下我们将介绍U-Boot中如何启用TFTP，并完成固件升级的功能实现。

## 2. U-Boot配置

### 2.1 以太网驱动

U-Boot defconfig配置，可参考RV1126配置：configs/rv1126\_defconfig

CONFIG\_DM\_ETH=Y   

CONFIG\_DM\_ETH\_PHY=Y   

CONFIG\_DWC\_ETH\_QOS=Y   

CONFIG\_GMAC\_ROCKCHIP=Y

dwc\_eth\_qos 驱动需要配置 nocache memory，可参考 RV1126配置：

```diff
diff --git a/include/configs/rv1126_common.h b/include/configs/rv1126_common.h
index 933917f3f0..9d70795fb8 100644
--- a/include/configs/rv1126 common.h
+++ b/include/configs/rv1126_common.h
@@ -50,6 +50,7 @@
#define CONFIG SYS SDRAM BASE 0
#define SDRAM MAX SIZE 0xfd000000
+#define CONFIG SYS NONCACHED MEMORY (1 << 20) /* 1 MiB */
#ifndef CONFIG_SPL_BUILD
```

### 2.2 cmd配置

可手动menuconfig选上如下配置：

-&gt; Command line interface   

-&gt; Network commands   

[\*] bootp, tftpboot   

[\*] tftp put   

[\*] tftp download and bootm   

[\*] tftp download and flash

U-Boot defconfig配置，可参考RV1126配置：configs/rv1126\_defconfig

CONFIG\_CMD\_TFTPPUT=Y   

CONFIG\_CMD\_TFTP\_BOOTM=Y   

CONFIG\_CMD\_TFTP\_FLASH=Y

### 2.3 DTS 配置

DTS节点与kernel一样，需要关注的是以下板级相关的属性配置：

• phy 接口配置(phy-mode)

• phy 复位脚与复位时间(snps,reset-gpio)(snps,reset-delays-us)

• 针对主控的时钟输出方向(clock\_in\_out)

• 时钟源选择与频率设定(assigned-clock-parents)(assigned-clock-rates)

• RGMII Delayline， RGMII 接口需要(tx\_delay) (rx\_delay)

可参考RV1126配置：arch/arm/dts/rv1126-u-boot.dtsi

```hcl
&gmac {
phy-mode = "rgmii";
clock in out = "input";
snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
snps,reset-active-low;
/* Reset time is 20ms, 100ms for rtl8211f */
snps,reset-delays-us = <0 20000 100000>;
assigned-clocks = <&cru CLK GMAC SRC>, <&cru CLK GMAC TX RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
assigned-clock-rates = <125000000>, <0>, <25000000>;
pinctrl-names = "default";
pinctrl-0 = <&rgmiim1_pins &clk_out_ethernetm1_pins>;
tx_delay = <0x2a>;
rx delay = <0x1a>;
phy-handle = <&phy>;
status = "okay";
};
```

### 2.4 网络信息配置

为了方便找到TFTP服务端，需要配置设备IP、服务端IP、默认网关IP，可在代码中添加申明定义，可参考RV1126配置：include/configs/rv1126\_common.h。如需自动完成TFTP烧录，请在代码中配置好网络信息。

```diff
diff --git a/include/configs/rv1126_common.h b/include/configs/rv1126_common.h
index a6307ebcc7..f293c87286 100644
--- a/include/configs/rv1126_common.h
+++ b/include/configs/rv1126_common.h
@@ -25,6 +25,11 @@
#define CONFIG_SYS_LOAD_ADDR 0x00C00800
#define CONFIG_SYS_BOOTM_LEN (64 << 20)
+#define CONFIG_IPADDR 192.168.11.254 //设备IP
+#define CONFIG_SERVERIP 192.168.11.26 //服务端IP
+#define CONFIG_GATEWAYIP 192.168.11.1 //网关IP
+#define CONFIG NETMASK 255.255.255.0 //子网掩码
```

也可以通过命令行设置以上信息：

```batch
set ipaddr 192.168.11.254
set serverip 192.168.11.26
set gatewayip 192.168.11.1
set netmask 255.255.255.0
```

## 3. TFTP固件升级

### 3.1 服务端配置

电脑的主机需要配置好对应的网络信息，以保证设备端可以与服务端进行通信（需与代码中配置一致）：

1. Server IP 服务端IP地址

2. NetMask 子网掩码

3. GateWay IP 网关IP地址



### 3.2 服务端TFTP工具配置

打开工具，选择TftpServer选项卡，确认服务端的IP和固件所在的目录配置正确。



### 3.3 设备端使用TFTP升级固件

#### 3.3.1 命令行测试

##### 3.3.1.1 Step1 进入命令行

开机，键盘长按Ctrl+C，可进入U-Boot命令行模式

```javascript
=> <INTERRUPT>
=> <INTERRUPT>
=> <INTERRUPT>
=>
```

##### 3.3.1.2 Step2 检查网络配置

1. 查看设备端网络信息配置是否符合预期

```javascript
=> printenv
gatewayip=192.168.11.1
ipaddr=192.168.11.254
netmask=255.255.255.0
serverip=192.168.11.26
```

...

## 2. 查看与服务端通信是否正常

```javascript
=> ping 192.168.11.26
```

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

host 192.168.11.26 is alive

打印is alive表示设备与服务端网络通信正常

##### 3.3.1.3 Step3 通过TFTP下载固件

```perl
=> tftpflash 0x20000000 uboot.img uboot
=> tftpflash 0x20000000 misc.img misc
=> tftpflash 0x20000000 rootfs.img rootfs
=> tftpflash 0x20000000 boot.img boot
=> tftpflash 0x20000000 recovery.img recovery
=> tftpflash 0x20000000 oem.img oem
=> tftpflash 0x20000000 userdata.img userdata
```

### 命令参数说明

Usage:   

tftpflash [loadAddress] [[hostIPaddr:]bootfilename] [partition]

每个分区升级成功会打印如下信息

```javascript
=> tftpflash 0x20000000 uboot.img uboot
```

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

TFTP from server 192.168.11.26; our IP address is 192.168.11.254   

Filename 'uboot.img'.   

Load address: 0x20000000   

Loading： ＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

479.5 KiB/s   

done   

Bytes transferred = 4194304 (400000 hex)   

### TFTP flash uboot.img to partititon 'uboot' size 0x400000 ... OK

##### 3.3.1.4 Step4 重启设备

```javascript
=> reset
```

### 3.3.2开机自动检查升级（分立固件）

##### 3.3.2.1 Step1 U-Boot启动命令修改

U-Boot启动最终会调用到RKIMG\_BOOTCOMMAND，我们添加TFTP\_DOWNLOAD\_COMMAND，用来做固件的烧 录

```diff
diff --git a/include/configs/rv1126_common.h b/include/configs/rv1126_common.h
index a6307ebcc7..f308095159 100644
--- a/include/configs/rv1126_common.h
+++ b/include/configs/rv1126 common.h
@@ -62,6 +69,15 @@
#define CONFIG_USB_FUNCTION_MASS_STORAGE
#define CONFIG ROCKUSB G DNL PID 0x110b
+#define TFTP DOWNLOAD COMMAND
+ "tftpflash 0x20000000 uboot.img uboot;"
十 "tftpflash 0x20000000 misc.img misc;"
十 "tftpflash 0x20000000 rootfs.img rootfs;"
十 "tftpflash 0x20000000 boot.img boot;"
十 "tftpflash 0x20000000 recovery.img recovery;"
+ "tftpflash 0x20000000 oem.img oem;" \
```

```shell
+ "tftpflash 0x20000000 userdata.img userdata;
+
#define ENV MEM LAYOUT SETTINGS \
"scriptaddr=0x00000000\0" \
"pxefile_addr_r=0x00100000\0" \
@@ -84,8 +100,12 @@
"boot fit;"
#else
#define RKIMG BOOTCOMMAND \
"boot_fit;"
一 "boot android ${devtype} ${devnum};"
十 "if ping ${serverip}; then ;"
+ TFTP DOWNLOAD COMMAND
十 "reset;"
十 "else;" \
十 "boot fit;"
十 "boot android ${devtype} ${devnum};"
+ "fi;"
```

注意：需要结合产品实际调整分区镜像及分区名

自动检测升级流程如下：



##### 3.3.2.2 Step2 优化Ping接连失败的时间

由于自动升级是基于服务端联通且有升级包的基础上才能完成的流程，正常开机时，也需要判断服务端是否联通，需要优化ping操作的时间。

```diff
diff --git a/include/configs/rv1126_common.h b/include/configs/rv1126_common.h
index a6307ebcc7..f308095159 100644
--- a/include/configs/rv1126_common.h
+++ b/include/configs/rv1126_common.h
@@ -25,6 +25,13 @@
#define CONFIG_SYS_LOAD_ADDR 0x00C00800
#define CONFIG_SYS_BOOTM_LEN (64 << 20)
+#define CONFIG_ARP_TIMEOUT 200UL
```

##### 3.3.2.3 Step3 测试验证

1. 服务端连接失败，正常启动

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

ARP Retry count exceeded; starting again   

ping failed; host 192.168.11.26 is not alive   

### Booting FIT Image at 0x3b53a580 with size 0x005bc800

## 2.服务端连接正常，升级固件后，正常启动

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

host 192.168.11.26 is alive   

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

TFTP from server 192.168.11.26; our IP address is 192.168.11.254   

Filename 'uboot.img'.   

Load address: 0x20000000   

Loading：＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

1.1 MiB/s   

done   

Bytes transferred = 4194304 (400000 hex)   

### TFTP flash uboot.img to partititon 'uboot' size 0x400000 ... OK

.....   

分区镜像升级   

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done

Using ethernet@ffc40000 device   

TFTP from server 192.168.11.26; our IP address is 192.168.11.254   

Filename 'userdata.img'.   

Load address: 0x20000000   

Loading： ＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃   

1 MiB/s   

done   

Bytes transferred = 5242880 (500000 hex)   

### TFTP flash userdata.img to partititon 'userdata' size 0x500000 ... OK

### Booting FIT Image at 0x3b53a580 with size 0x005bc800

##### 3.3.2.4 Step4 升级成功

升级成功后，系统会自动重启，请断开TFTP服务端，以防设备重新升级。

## 4. 常见问题说明

### 4.1 服务端网络无法连通

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

ARP Retry count exceeded; starting again   

ping failed; host 192.168.11.26 is not alive

### 4.2 服务端TFTP服务未启动

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

host 192.168.11.26 is alive   

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

TFTP from server 192.168.11.26; our IP address is 192.168.11.254   

Filename 'uboot.img'.   

Load address: 0x20000000   

Loading: \*   

TFTP server died; starting again

4. 3服务端文件路径配置错误或文件不存在

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

host 192.168.11.26 is alive   

ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done   

Using ethernet@ffc40000 device   

TFTP from server 192.168.11.26; our IP address is 192.168.11.254   

Filename 'uboot.img'.   

Load address: 0x20000000   

Loading: \*   

TFTP error: 'File not found'(1)   

Not retrying...

### 4.4 update.img如何转成分立的镜像文件

1. 可通过Linux环境下脚本工具解包update.img为分立的镜像文件

• 工具：tools/linux/Linux\_Pack\_Firmware/rockdev/unpack.sh

•使用方法：将update.img放置于unpack.sh脚本同级目录，执行以下命令解包

./unpack.sh

2. 可使用Windows环境下瑞芯微开发工具解包update.img为分立的镜像文件

•工具：tools/windows/RKDevTool/RKDevTool\_Release/RKDevTool.exe

• 使用方法：选择高级功能选项卡，固件栏...选择对应update.img，点击解包按钮，即可解包固件



没有发现设备
