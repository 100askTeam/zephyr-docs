---
sidebar_position: 1
---

# Rockchip DRM Display Driver 开发指南

## 前言

本文主要介绍 Rockchip 平台处理器基于 DRM 显示框架 VOP 以及相关显示接口的基本特性、工作流程和常见问题分析。目的是为了相关工程师能对 DRM 显示驱动框架和硬件接口有更好的理解，并通过常见问题的分析能快速定位问题、解决问题。

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3036 | Linux kernel 4.4 及以上内核 |
| RK312X/PX3SE | Linux kernel 4.4 及以上内核 |
| RK3288 | Linux kernel 4.4 及以上内核 |
| RK322X/RK312XH | Linux kernel 4.4 及以上内核 |
| RK3308 | Linux kernel 4.4 及以上内核 |
| RK322XH/RK332X | Linux kernel 4.4 及以上内核 |
| RK3326/PX30 | Linux kernel 4.4 及以上内核 |
| RK3368/PX5 | Linux kernel 4.4 及以上内核 |
| RK3399 | Linux kernel 4.4 及以上内核 |
| RK1808 | Linux kernel 4.4 及以上内核 |
| RV1109/RV1126 | Linux kernel 4.19 及以上内核 |
| RK356X | Linux kernel 4.19 及以上内核 |
| RK3588 | Linux kernel 5.10 及以上内核 |
| RV1103/RV1106 | Linux kernel 5.10 及以上内核 |
| RK3528 | Linux kernel 4.19 及以上内核 |
| RK3562 | Linux kernel 5.10 及以上内核 |
| RK3576 | Linux kernel 6.1 及以上内核 |
| RK3506 | Linux kernel 6.1 及以上内核 |

读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

硬件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |  |
| --- | --- | --- | --- | --- |
| V1.0.0 | 黄家钗 | 2019-1-5 | 初始版本 |  |
| V2.0.0 | 黄家钗 | 2019-11-15 | 针对 Linux 4.19 更新 |  |
| V3.0.0 | 黄家钗 | 2022-03-17 | 针对 RK356X/RK3588/RV1103/RV1106 以及 Linux kernel 5.10 更新 |  |
| V3.1.0 | 闫孝军 | 2022-04-24 | 加入更多内容 |  |
| V3.1.2 | 闫孝军 | 2022-05-09 | 修正一些描述错误 |  |
| V3.1.3 | 闫孝军 | 2022-05-30 | 补充相关引用参考文档 |  |
| V3.2.0 | 黄家钗 | 2022-06-12 | 更新 VOP 和接口 feature |  |
| V3.3.0 | 张玉炳 | 2022-06-23 | 添加 RK3588 VOP DCLK 分配策略 |  |
| V3.4.0 | 黄家钗 | 2022-06-29 | 加入 RK3566 图层分配策略说明 |  |
| V3.4.1 | 闫孝军 | 2022-07-06 | 修正 connector-split 相关描述 |  |
| V3.5.0 | 闫孝军 | 2022-07-08 | 加入一些定位问题的方法和建议 |  |
| V3.5.1 | 张玉炳 | 2022-07-13 | 修正 dclk 相关描述 |  |
| V3.6.0 | 黄家钗 | 2023-05-29 | 添加 RK3528 和 RK3562 支持并更新 RK3588 DSC 支持情况说明 |  |
| V3.7.0 | 闫孝军 | 2023-09-14 | 更新 connector-mirror 软件支持版本情况 |  |
| V3.8.0 | 丁凌崧 | 2023-09-28 | 添加 RK3308 和 RV1106 开启显示功能的配置说明 |  |
| V3.9.0 | 黄家钗 | 2023-10-20 | 添加获取 VOP 显示状态信息的方法 |  |
| V4.0.0 | 黄家钗 | 2024-04-23 | 添加 RK3576 以及 Linux kernel 6.1 支持 |  |
| V4.1.0 | 黄家钗 | 2024-06-21 | 更新 connector split 模式说明 |  |
| V4.2.0 | 闫孝军 | 2024-07-17 | 添加关于如何准确打开DRM显示设备的描述 |  |
| V4.3.0 | 丁凌崧 | 2024-08-27 | 添加 x-mirror 功能说明和 4K logo 显示相关 FAQ |  |
| V4.4.0 | 丁凌崧 | 2024-08-28 | 添加 RK3506 支持 |  |
| V4.5.0 | 丁凌崧 | 2024-09-10 | 添加 RV1106/RV1103 小分辨率显示异常相关 FAQ |  |

## 1. Rockchip 平台显示子系统（DSS） 概述

显示子系统是 Rockchip 平台显示输出相关软硬件系统的统称，它包括 VOP（比较老的平台叫 LCDC，比如 RK3188、RK3066）和 RGB、BT1120、BT656、I8080（MCU 显示接口），LVDS、MIPI DSI、EDP、DP、HDMI 等显示信号输出模块以及与之对应的软件驱动。

整个显示系统的硬件框架如下图所示：



VOP 1.0 显示子系统架构  



VOP 2.0 显示子系统架构

从上面的 DSS 框图可以看到，在整个显示通路的最后端，是由 RGA，GPU、VPU 组成的显示图形加速模块，他们是专门针对图像处理优化设计的硬件 IP，能够高效的进行图像的生成和进一步处理（比如 GPU 通过 opengl 功能提供图像渲染功能，RGA 可以对图像数据进行缩放，旋转，合成等 2D 处理，VPU 可以高效的进行视频解码），从而减轻 CPU 负担。

经过这些图像加速模块处理后的数据会存放在 DDR 中，然后由 VOP 读取，根据应用需求进行 Alpha 叠加，颜色空间转换，gamma 矫正，HDR 转换等处理后，再发送到对应的显示接口模块（HDMI/DP/DSI/RGB/LVDS）, 这些接口模块会把接收到的数据转换成符合各自协议的数据流，发送到显示器或者屏幕上，呈现在最终用户眼前。

目前 Rockchip 平台上存在两种 VOP 架构—— VOP 1.0 和 VOP 2.0，他们的主要的区别是对多显的支持方式不同，VOP 1.0 是用多 VOP 的方式来实现多屏幕显示，即正常情况下，一个 VOP 在同一时刻只能输出一路独立的显示时序，驱动一个屏幕显示独立的内容。如果需要实现双屏显示，则需要有两个 VOP 来实现，所以在 RK3288，RK3399，PX30 等支持双显的平台上，都有两个独立的 VOP。

VOP 2.0 采用了统一显示架构，即整个 SOC 上只存在一个 VOP，但是在 VOP 的后端设计了多路独立的 Video Port(简称 VP) 输出接口，这些VP 能够同时独立工作，并且输出相互独立的显示时序。比如在上面的 VOP 2.0 框图中，有三个 VP，就能同时实现三屏异显。

如果想了解哪些芯片采用的是 VOP 1.0 架构，哪些芯片采用的是 VOP 2.0 架构，请参考后面的Display Feature 章节内容。

## 2. DRM 概述

DRM 全称是 Direct Rendering Manager，进行显示输出管理、buffer 分配、帧缓冲。对应的 userspace 库为 libdrm，libdrm 库提供了一系列友好的控制封装，使用户可以方便的进行显示的控制和 buffer 申请。DRM 的设备节点为 "/dev/dri/cardX"， X 为 0-15 的数值，默认使用的是/dev/dri/card0。

Rockchip 平台从 Linux 4.4 内核开始，显示驱动全部切到 DRM 显示框架。

需要注意的是，在一个系统中，可能存在多个 DRM 设备，这些设备产生的设备节点 /dev/dri/cardX 是不固定的，他们和 DRM 驱动的加载顺序相关。

比如 Rockchip 目前的平台上，显示子系统和 NPU 驱动都使用了 DRM 框架，所以大部分情况下，我们会在系统上看到两个设备节点：

/dev/dri/card0 和 /dev/dri/card1 ， 但是 card0 和 card1 和显示子系统与 NPU 没有固定的对应关系。一般情况下哪个驱动先加载，哪个驱动会被注册为 card0。

如果某个应用需要打开 DRM 显示设备，则该应用在打开 /dev/dri/card0 或者 /dev/dri/card1 后需要做进一步判断，判断该设备是否是显示设备，在 Rockchip 平台上，目前有两种方法：

1. 使用 libdrm 提供的 drmIsKMS(int fd) API 对打开的设备做检查，判断该设备是否支持显示功能，NPU 设备不支持显示功能

2. 使用 libdrm 提供的 drmOpen("rockchip", NULL) ，强制指定打开 rockchip drm 驱动。

## 2.1基本概念

为了方便管理显示通路上的各种硬件模块，DRM 定义了以下几个概念：


| 基本概念 | 说明 |
| --- | --- |
| CRTC | 显示控制器，在 rockchip 平台是 SOC 内部 VOP（部分文档也称为 LCDC）模块或者 VOP2 中 Video Port 的抽象 |
| Plane | 图层，在 rockchip 平台是 SOC 内部 VOP（LCDC）模块 win 图层的抽象 |
| Encoder | 输出转换器，指RGB、LVDS、DSI、eDP、DP、HDMI、CVBS、VGA等显示接口 |
| Connector | 连接器，指 encoder 和panel 之间交互的接口部分 |
| Bridge | 桥接设备，一般用于注册 encoder后面另外再接的转换芯片，如 DSI2HDMI转换芯片 |
| Panel | 泛指屏，各种LCD 显示设备的抽象 |
| GEM | DRM 下 buffer 管理和分配，类似 ION、DMA BUFFER |

### 2.2 显示通路



2.3 DRM 驱动和 libdrm 的交互过程



## 3. 软件驱动

### 3.1 U-Boot 驱动

显示驱动在 U-Boot 中主要提供开机 logo 显示和充电界面显示这两个功能。

在 Rockchip 平台上，开机 logo 一般分为两个阶段：显示 U-Boot logo 和 显示 Kernel logo。

# Rackchi?

默认 U-Boot logo



默认 Kernel logo

这两个 LOGO 图片默认放在 Linux kernel 根目录下（logo.bmp 和 logo\_kernel.bmp），Linux Kernel 在编译的时候会把他们打包到 resource.img中，再打包进入 Boot.img。

U-Boot 启动的时候会把这两个文件加载到内存中，U-Boot LOGO 在 U-Boot 阶段就开始显示，Kernel LOGO 在内存中的地址会被 U-Boot 传递给 Linux kernel，在 Linux Kernel 的 drm 驱动初始化阶段显示。

#### 3.1.1 驱动目录

#### 3.1.2 驱动文件

drivers/video/drm/


| Driver | File |
| --- | --- |
| Core | rockchip_display.crockchip_crtc.crockchip_connector.crockchip_phy.crockchip_panel.crockchip_bridge.c |
| VOP | rockchip_vop.crockchip_vop_reg.crockchip_vop2.crockchip_vop2_reg.c |
| RGB | rockchip_rgb.cinno_video_combo_phy.c |
| LVDS | rockchip_lvds.cinno_video_combo_phy.c |
| MIPI-DSI | drm_mipi_dsi.cdw_mipi_dsi2.cinno_mipi_phy.cinno_video_combo_phy.csamsung_mipi_dcphy.c |
|  |  |
|  |  |
|  |  |
|  |  |
| eDP | rockchip_analogix_dp.crockchip_analogix_dp_reg.c |
|  | dw_hdmi.crockchip_dw_hdmi.crockchip-inno-hdmi-phy.cinno_hdmi.cdw_hdmi_qp.crockchip_dw_hdmi_qp.cphy-rockchip-samsung-hdptx-hdmi.c |
|  |  |
| HDMI |  |
|  |  |
| TVE /CVBS | rockchip_drm_tve.cdw-dp.cdrm_dp_helper.cphy-rockchip-usbdp.c |
|  |  |
| DP |  |

以上驱动文件在不同的 U-Boot 版本可能会做些小的调整，但多数驱动文件和框架部分基本不会变化，查阅的时候可以根据实际情况调整。

#### 3.1.3 接口说明

1. 显示 U-Boot logo

void rockchip\_show\_logo(void)

2. 显示指定的 bmp 图片，目前主要用于充电 logo 的显示

void rockchip\_show\_bmp(const char \*bmp)

3. 将 U-Boot 中确定的一些变量通过修改 dtb 文件传递给内核，包括 kernel logo 的大小、地址、格式、输出扫描时序以及过扫描的配置等信息

void rockchip\_display\_fixup(void \*blob)

#### 3.1.4 应用说明

1. 开启 U-Boot logo

logo 通过 Linux kernel dts(U-Boot 显示模块和 Linux kernel 复用同一个 dtb) 中对应显示接口的 route\_xxx 节点控制，这里的 xxx 可以是dsi，edp，hdmi，lvds，具体请搜索 dts 中的 route 关键字。

以 MIPI DSI0 为例，在对应的板级 dts 文件里找到 route\_dsi0 节点，把 status 设置为 “okay”:

```dts
&route_dsi0 {
status = "okay";
connect = <&vp3_out_dsi0>;
};
```

connect 属性参考后面 DTS 配置 章节的详细说明。

## 2. 配置 U-Boot logo 全屏显示

logo 默认是居中（center）显示，如果需要全屏显示，修改对应接口的 route 节点。

比如需要把 DSI0 上输出的 logo 全屏显示，则修改 route\_dis0 的 logo,mode 属性为 “fullscreen”。

a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi   

++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi   

a@ -1065,7 +1065,7 @@   

```
status = "disabled";
1ogo,uboot = "1ogo. bmp";
logo,kernel = "Togo_kernel. bmp";
1ogo,mode = "center";
logo,mode = "ful1screen";
charge_logo,mode = "center";
connect =<&vp3_out_dsi0>;
```

## 3. logo 图片要求

U-Boot logo 和 Linux Kernel logo 分辨率相同，而且分辨率必须是偶数；

只支持 8bit，16bit，24bit、32bit 的 bmp 图片；

U-Boot logo 和 Linux Kernel logo 必须同时开启，即 logo.bmp 和 logo\_kernel.bmp 必须同时提供，不能只提供其中一个。

## 4. 启动 log 确认

如果 logo 功能正常启用，在 U-Boot 阶段会看到类似如下的 log：

Rockchip UBOOT DRM driver version: v1.0.1   

vp0 have layer nr:2[0 2 ], primary plane: 2   

vp1 have layer nr:2[1 3 ], primary plane: 3   

vp2 have layer nr:2[6 8 ], primary plane: 8   

vp3 have layer nr:2[7 9 ], primary plane: 9   

Using display timing dts   

dsi@fde20000: detailed mode clock 132000 kHz, flags[a]   

H: 1080 1095 1099 1129   

V: 1920 1935 1937 1952   

bus\_format: 100e   

VOP update mode to: 1080x1920p0, type: MIPI0 for VP3   

VOP VP3 enable Esmart3[654x270-&gt;654x270@213x825] fmt[2] addr[0xedf04000]   

final DSI-Link bandwidth: 880000 Kbps x 4   

hdmi\_select\_link\_config use tmds mode   

mode:1920x1080 bus\_format:0x100a   

hdmi@fde80000: detailed mode clock 148500 kHz, flags[5]   

H: 1920 2008 2052 2200   

V: 1080 1084 1089 1125   

bus\_format: 100a   

VOP update mode to: 1920x1080p0, type: HDMI0 for VP0   

VOP VP0 enable Esmart0[654x270-&gt;654x270@633x405] fmt[2] addr[0xedf04000]   

CLK: (uboot. arm: enter 1200000 KHz, init 1200000 KHz, kernel 0N/A)

可以看到在 VP0 和 VP3 上都启动了 logo 显示。

VP0 的显示分辨率为 1920 x 1080，显示接口是 HDMI。

VP3 的显示分辨率为 1080 x 1920，显示接口是 MIPI DSI。

显示的 logo 大小为 654 x 270。

#### 3.1.5 分析 U-Boot logo 过渡到 Linux Kernel logo 过程中出现的闪屏或者无法显示的问题

1. 确认 DRM 驱动是否有正常加载

DRM 驱动加载过程中可能会出现一些资源没有准备好，导致 DRM 驱动 bind 失败，可能会出现类似以下 log：

[1.792387] dw-mipi-dsi2 fde20000.dsi: [drm:dw\_mipi\_dsi2\_bind] \*ERROR\* Failed to find panel or bridge: -517

这个 log 说明此时 panel 或者 bridge 没准备好，正常驱动框架会在一段时间后重新开始 bind，但如果最后出现以下 log 说明此时 drm 驱动已经加载成功了，这种情况我们就不需要太在意前面一两次 bind 失败的 log：

[2.566831] rockchip-drm display-subsystem: [drm] fb0: rockchipdrmfb frame buffer device

如果开机 log 一直不停的刷 bind 失败的 log，那可能要检查的你 dts 配置，产品中最经常遇到的是 GPIO 口被其他设备先注册、 panel 的compatible 未正确配置导致 panel 注册失败、backlight 驱动注册失败等。

如果 Linux kernel log 中出现了如下 logo 失败相关的信息，则需要结合代码认真分析：

rockchip-drm display-subsystem: failed to parse resources for logo display   

rockchip-drm display-subsystem: connector[HDMI-A-1] can't found any modes   

rockchip-drm display-subsystem: can't not find any logo display   

rockchip-drm display-subsystem: failed to show loader logo

2. DDR 变频导致闪屏或者显示错位

(1) 尝试关闭 dts 文件中 DDR 变频节点，保证内核阶段不做 DDR 变频，修改方法如下：

```dts
&dmc {
status = “disabled”;
};
```

(2) 尝试关闭 DDR 变频时对 DCLK 频率的调整，修改方法如下：

```dts
&dmc {
vop-dclk-mode = <1>;
};
```

## 3. clk tree 变化导致

部分平台 U-Boot 中的 clk tree 配置和内核的 clk tree 配置是独立的，如果两个驱动的 clk 策略不一致，就有可能在 Linux kernel clk 重新初始化的时候出现闪屏问题，以 RK3399 为例，可以按如下方法确认：

(1) 在 rk3399\_clk\_init()@kernel/drivers/clk/rockchip/clk-rk3399.c 函数入口处加上 while(1)；确认是否会有闪屏问题；

(2) 在 rk3399\_clk\_init()@kernel/drivers/clk/rockchip/clk-rk3399.c 函数结束处加上 while(1)，确认是否会有闪屏问题；

(3) 如果步骤 (1) 中无闪屏现象步骤 (2) 中有闪屏现象，那基本可以确认是 clk tree 变化导致闪屏问题，可以直接找对应平台 cru 负责人或者提交 redmine 并说明转给 pll 相关负责人。

## 4. 时钟被关闭导致

有一些流程上的问题或者软件上的 bug 可能存在一些必要的时钟在驱动注册的时候没有被使能，导致这些时钟在内核跑完后被框架自动关闭从而导致显示异常，可以尝试按下面的修改默认不关闭时钟做测试：

在 dts 文件中，找到 chosen 节点，在 bootargs 末尾加上 clk\_ignore\_unused：如 bootargs = "xxxx clk\_ignore\_unused”；

a/arch/arm64/boot/dts/rockchip/rk3399-1inux.dtsi   

+++ b/arch/arm64/boot/dts/rockchip/rk3399-1inux.dtsi   

@@ -47,7 +47,7 @a   

```dts
compatible = "rockchip,linux", "rockchip,rk3399";
chosen {
bootargs = "ear1ycon=uart8250,mmio32,0xff1a0000";
bootargs ="earlycon=uart8250,mmio32,0xff1a0000 c1k_ignore_unused";
};
```

## 5. U-Boot logo 图片和 kernel logo 图片大小不一致

rockchip 平台有要求 U-Boot logo 和 kernel logo 的图片分辨率大小一样，如果出现 U-Boot logo 显示正常，到内核阶段显示异常，可以确认下 kernel 目录下 logo.bmp 和 logo\_kernel.bmp 分辨率是否一致；

\$fi1e\_ 1ogo.bmp 1ogo\_kerne1.bmp   

1ogo.bmp: PC bitmap, windows 3.x format, 654 x 258 x 8   

logo\_kernel.bmp: PC bitmap, windows 3.x format, 654 x 258 x 8

## 6. 内核初始化过程一些电源 GPIO 被重新初始化

该问题涉及的可能性很多，总之在新项目 porting 过程中要及时确认显示相关的 GPIO 电源是否和其他模块有冲突；

如果 DTS 确认无误，可以在内核代码搜索串口中的关键字，通过二分法在各个模块加载的位置 while 住，逐步确认导致闪屏问题的点；

## 7. VOP 优先级配置问题

如果 VOP 优先级没有被配置最高，有可能在内核加载阶段被其他 IP 抢占总线导致闪屏问题，该问题一般会在 SDK 发布前 Fix。

## 8. 测试相关电源和信号

如果以上还未找到闪屏问题，请使用示波器抓取 CLK、DATA 和电源等相关信号从 U-Boot 到内核阶段的波形图并提交 redmine。

### 3.2 kernel 驱动

#### 3.2.1 驱动目录

drivers/gpu/drm/rockchip/   

drivers/gpu/drm/bridge/analogix/   

drivers/gpu/drm/bridge/synopsys/   

drivers/phy/rockchip/

#### 3.2.2 驱动文件


| Driver | File | Doc |
| --- | --- | --- |
|  | rockchip_drm_drv.crockchip_drm_fb.crockchip_drm_fbdev.crockchip_drm_gem.crockchip_drm_logo.crockchip_drm_direct_show.cpanel-simple.c | rockchip-drm.txt or rockchip-drm.yaml |
|  |  |  |
|  |  |  |
| Core |  |  |
| VOP | rockchip_drm_vop.crockchip_vop_reg.crockchip_drm_vop2.crockchip_vop2_reg.c | rockchip-vop.txt or rockchip-vop.yaml |
| RGB | rocckhip_rgb.cphy-rockchip-inno-video-combo-phy.c | rockchip-rgb.txt |
| LVDS | rockchip_lvds.cphy-rockchip-inno-video-combo-phy.c | rockchip-lvds.txt |
| MIPI-DSI | dw-mipi-dsi.cphy-rockchip-inno-dsidphy.cphy-rockchip-inno-video-combo-phy.cdw-mipi-dsi2-rockchip.cphy-rockchip-samsung-dcphy.c | dw_mipi_dsi_rockchip.txtphy-rockchip-inno-mipi-dphy.txt |
| eDP | analogix_dp_core.canalogix_dp-rockchip.canalogix_dp_reg.cphy-rockchip-dp.c | analogix_dp-rockchip.txtanalogix_dp.txtrockchip-dp-phy.txt |
|  | cdn-dp-core.ccdn-dp-reg.cdw-dp.cphy-rockchip-usbdp.cphy-rockchip-samsung-hdptx-hdmi.c | cdn-dp-rockchip.txt |
| DP |  |  |
| HDMI | inno_hdmi.cdw-hdmi.cdw_hdmi-rockchip.cphy-rockchip-inno-hdmi-phy.cdw-hdmi-qp.cphy-rockchip-samsung-hdptx-hdmi.c | inno_hdmi-rockchip.txtdw_hdmi-rockchip.txtphy-rockchip-inno-hdmi-phy.txt |
| TVE/CVBS | rockchip_drm_tve.c | rockchip_drm_tve.txt |

以上驱动文件在不同的 kernel 版本可能会做些小的调整，但多数驱动文件和框架部分基本不会变化，查阅的时候可以根据实际情况调整。

### 3.2.3驱动加载流程



需要注意的是，DRM 驱动是一系列显示相关模块的驱动的结合，他包含了 backlight、panel、rgb、lvds、dsi、edp、lvds、hdmi、vop 等等显示通路上的依赖模块。只有这些相互依赖的模块都加载起来，整个 drm 系统才能启动成功。

因为这些复杂的依赖关系，在 drm 系统初始化的过程中，可能会出现某个资源暂时未就绪，而导致某个模块暂时无法顺利加载的情况，为了解决这种问题，drm 驱动利用了 Linux 驱动中的 deferred probe 机制，当发现某个依赖的资源未就绪的时候，驱动返回 -EPROBE\_DEFER(-517) , 然后退出。Linux kernel 会在稍后再次尝试加载这个驱动，直到依赖的资源就绪，驱动顺利加载为止。

```ini
[1.747190] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[1.747877] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[1.748022] rockchip-drm display-subsystem: bound fde80000.hdmi (ops dw_hdmi_rockchip_ops)
[1.748676] dwhdmi-rockchip fdea0000.hdmi: registered ddc I2C bus driver
[1.748807] rockchip-drm display-subsystem: bound fdea0000.hdmi (ops dw_hdmi_rockchip_ops)
[1.748840] dw-mipi-dsi2 : [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
[1.755174] panel-simple-dsi fde20000.dsi.0: failed to get power regulator: -517
[1.759296] brd: module loaded
[1.764374] loop: module loaded
[1.764528] zram: Added device: zram0
[1.764698] system_heap: orders[0] = 6
[2.248871] imx415 5-001a: supply dovdd not found, using dummy regulator
[2.416673] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[2.418711] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[2.420336] rockchip-drm display-subsystem: bound fde80000.hdmi (ops dw_hdmi_rockchip_ops)
[2.421725] dwhdmi-rockchip fdea0000.hdmi: registered ddc I2C bus driver
[2.422291] rockchip-drm display-subsystem: bound fdea0000.hdmi (ops dw_hdmi_rockchip_ops)
[2.422318] dw-mipi-dsi2 : [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
[2.433888] input: adc-keys as /devices/platform/adc-keys/input/input3
[2.466237] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[2.468705] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[2.469751] rockchip-drm display-subsystem: bound fde80000.hnd fde20000.dsi (ops dw_mipi_dsi2_ops)
[2.472282] rockchip-drm display-subsystem: bound fde50000.dp (ops dw_dp_component_ops)
[2.472319] rockchip-drm display-subsystem: bound fde60000.dp (ops dw_dp_component_ops)
[2.531892] rockchip-drm display-subsystem: [drm] fb0: rockchipdrmfb frame buffer device
[2.532850] [drm] Initialized rockchip 3.0.0 20140818 for display-subsystem on minor 0
```

从上面的 log 我们可以看到，在第 6 行和第 18 行，mipi dsi 驱动因为找不到 panel 或者 bridge 这个依赖资源，而返回 -EPROBE\_DEFER 退出，一直到第 23 行，dsi 驱动获取到依赖的资源 bind 成功，最终看到整个 drm 驱动完成加载的标准 log。

#### 3.2.4 DTS 配置

##### 3.2.4.1 基础配置

在一颗 SOC 上，可能有多个 VOP，HDMI，eDP，DP，MIPI，Panel 模块，根据具体产品定义，一款产品可能只需要使用到其中一部分模块来组成显示通路。具体使用哪些模块，以及这些模块之间如何衔接则通过 dts 配置。

在每一个支持 drm 显示功能的 soc 的核心 dtsi 里面，都会有如下 display\_subsystem 节点：

```hcl
display_subsystem: display-subsystem {
compatible = "rockchip,display-subsystem";
memory-region = <&drm_logo>, <&drm_cubic_lut>;
memory-region-names = "drm-logo", "drm-cubic-lut";
ports = <&vop_out>;
devfreq = <&dmc>;
route {
route_dsi0: route-dsi0 {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp0_out_dsi0>;
};
route_dsi1: route-dsi1 {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp0_out_dsi1>;
};
route_edp: route-edp {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp0_out_edp>;
};
route_hdmi: route-hdmi {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp1_out_hdmi>;
};
route_lvds: route-lvds {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp1_out_lvds>;
};
route_rgb: route-rgb {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp2_out_rgb>;
};
};
};
```  
该节点控制 rockchip\_drm\_drv.c 驱动的加载。

memory-region 控制 logo 显示 buffer 的分配和传递，该属性在系统启动时会在 u-boot 中被动态修改，然后传递给内核。

route\_xxx 节点控制着各个接口开机 logo 功能是否开启，默认处于关闭状态。

以 route\_rgb 为例，解释相关属性的功能：

```
route_rgb: route-rgb {
status = "disabled";
logo,uboot = "logo.bmp";
logo,kernel = "logo_kernel.bmp";
logo,mode = "center";
charge_logo,mode = "center";
connect = <&vp2_out_rgb>;
};

logo,uboot 、 logo,kernel 描述 U-Boot 阶段和 Kernel 阶段 logo 图片的名字，需要和真实的图片资源匹配。

logo,mode charege_logo,mode 控制 logo 图片的显示模式，有 center 和 fullscreen 两种模式。
```

connect 描述该显示接口和 VOP 的哪个 Video Port(VOP2.0 架构) 或者哪个 VOP（VOP1.0 架构)连接 。一般根据实际使用情况配置。

display\_subsystem 节点的大部分属性不需要修改，一般只需要根据实际产品需求，开关对应的 logo 节点即可。

```dts
vop: vop@fe040000 {
compatible = "rockchip,rk3568-vop";
reg = <0x0 0xfe040000 0x0 0x3000>, <0x0 0xfe044000 0x0 0x1000>;
reg-names = "regs", "gamma_lut";
rockchip,grf = <&grf>;
interrupts = <GIC_SPI 148 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru ACLK_VOP>, <&cru HCLK_VOP>, <&cru DCLK_VOP0>, <&cru DCLK_VOP1>, <&cru DCLK_VOP2>;
clock-names = "aclk_vop", "hclk_vop", "dclk_vp0", "dclk_vp1", "dclk_vp2";
iommus = <&vop_mmu>;
power-domains = <&power RK3568_PD_VO>;
status = "disabled";
vop_out: ports {
vp0: port@0 {
```

......   

```
vp0_out_dsi0: endpoint@0 {
reg = <0>;
remote-endpoint = <&dsi0_in_vp0>;
};
vp0_out_dsi1: endpoint@1 {
reg = <1>;
remote-endpoint = <&dsi1_in_vp0>;
};
vp0_out_edp: endpoint@2 {
reg = <2>;
remote-endpoint = <&edp_in_vp0>;
};
vp0_out_hdmi: endpoint@3 {
reg = <3>;
remote-endpoint = <&hdmi_in_vp0>;
};
};
vp1: port@1 {
```

......   

```
vp1_out_dsi0: endpoint@0 {
reg = <0>;
remote-endpoint = <&dsi0_in_vp1>;
};
vp1_out_dsi1: endpoint@1 {
reg = <1>;
remote-endpoint = <&dsi1_in_vp1>;
};
vp1_out_edp: endpoint@2 {
reg = <2>;
remote-endpoint = <&edp_in_vp1>;
};
vp1_out_hdmi: endpoint@3 {

reg = <3>;
remote-endpoint = <&hdmi_in_vp1>;
};
vp1_out_lvds: endpoint@4 {
reg = <4>;
remote-endpoint = <&lvds_in_vp1>;
};
};
vp2: port@2 {
vp2_out_lvds: endpoint@0 {
reg = <0>;
remote-endpoint = <&lvds_in_vp2>;
};
vp2_out_rgb: endpoint@1 {
reg = <1>;
remote-endpoint = <&rgb_in_vp2>;
};
};
};
};
```

该节点描述 VOP 硬件资源，控制着 vop 驱动的加载 rockchip\_drm\_vop.c/rockchip\_drm\_vop2.c ， 它描述了如下的显示通路连接关系：



vop\_out: ports 节点描述 VOP 的输出通道，vp0/1/2 对应 VOP 上 Video Port0/1/2 三个独立的输出通路。

vp0/1/2 : port 下的 endpoint 节点描述 VP 和显示接口的连接关系，以上面的 dts 描述为例：vp0 节点下有 vp0\_out\_dsi0 ，vp0\_out\_dsi1 ， vp0\_out\_edp ， vp0\_out\_hdmi 四个节点，说明 vp0 可以和 dsi0、dsi1、edp、hdmi 四个显示接口连接。

每个 endpoint 通过 remote-endpoint 属性和对应的显示接口组成一个连接通路 ，比如和 hdmi 显示接口的连接：

```dts
hdmi: hdmi@fe0a0000 {
compatible = "rockchip,rk3568-dw-hdmi";
status = "disabled";
ports {
port@0 {
reg = <0>;
```

......   

```
hdmi_in_vp0: endpoint@0 {
reg = <0>;
remote-endpoint = <&vp0_out_hdmi>;
status = "disabled";
};

hdmi_in_vp1: endpoint@1 {
reg = <1>;
remote-endpoint = <&vp1_out_hdmi>;
status = "disabled";
};
};
};
};
```

结合上面的 dts 描述我们可以知道，在 rk3568 上，hdmi 可以和 vop 的 vp0，vp1 连接。

需要注意的是，一个显示接口在同一个时刻只能和一个 vp 连接，所以在具体的板级配置中，需要在 dts 中把要使用的通路打开，把不使用的通路设置为 disabled 状态。

比如在某款产品上，希望 HDMI 连接在 vp0 上，则 dts 中需要做如下设置：

```hcl
&hdmi {
status = "okay";
};
&hdmi_in_vp0 {
status = "okay";
};
&hdmi_in_vp1 {
status = "disabled";
};
&route_hdmi {
status = "okay";
connect = <&vp0_out_hdmi>;
};
```

#### 3.2.4.2指定图层分配策略

VOP2 采用统一显示架构，各个独立的 Video Port 共享 VOP 内部的所有图层资源，而且这些图层需要排他性的使用，即某个图层在同一时刻只能为其中一个 Video Port 所独占。

为了充分合理的使用所有图层资源，我们会根据当前产品 dts 配置的接口类型和数量在 U-Boot 中生成了一种默认的图层分配策略，如果有些产品没有开 U-Boot logo 显示或者对图层使用有特殊的需求，可以参考下面的写法在 dts 根据需求自行指定图层分配策略：

rockchip,plane-mask：指定分配给该 VP 的图层 ID 掩码集合，图层 ID 定义在 dt-bindings/display/rockchip\_vop.h 中。

rockchip,primary-plane：指定 primary 图层，当前 VP 的 primary 图层一定是 rockchip,plane-mask 中的一个，我们一般选用 Smart 或者 Esmart图层。

图层分配的基本原则是：把所有图层（rk3568 有 6 个图层，rk3588 有 8 个图层）平均分配给各个使用的 VP，不使用的 VP 一般不分配图层。由于 VOP 内部不同类型（Cluster，Esmart，Smart）的图层，性能，限制不同，一般推荐各种类型的图层平均搭配分配。

如下是一个 RK3568 上的典型图层分配参考， RK3568 VOP 一共有 6 个图层（2 Cluster + 2 Esmart + 2 Smart），该配置支持三屏异显。一般，我们尽量给使用场景最多的屏幕(主屏) 对应的 VP 分配三个以上的图层（在该应用案例下是 VP1），其他接口尽量分配不少于两个图层。

```c
#include <dt-bindings/display/rockchip_vop.h> // 图层 ID 定义头文件
&vp0 {
rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_SMART1)>;
rockchip,primary-plane = <ROCKCHIP_VOP2_SMART1>;
};
&vp1 {
rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0)>;
rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
};
&vp2 {
rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_ESMART1)>;
rockchip,primary-plane = <ROCKCHIP_VOP2_ESMART1>;
};
```

配置生效后，系统启动的时候可以从 U-Boot 和 Linux kernel 的启动 log 中看到对应的 plane mask 解析信息。

Rockchip UBOOT DRM driver version: v1.0.1   

VOP have 3 active VP

vp0 have layer nr:2[1 5 ], primary plane: 5   

vp1 have layer nr:3[0 2 4 ], primary plane: 4   

vp2 have layer nr:1[3 ], primary plane: 3   

Using display timing dts   

dsi@fe060000: detailed mode clock 132000 kHz, flags[8000000a]   

H: 1080 1095 1097 1127   

V: 1920 1935 1937 1952   

bus\_format: 100e   

VOP update mode to: 1080x1920p0, type: MIPI0 for VP1   

VOP VP1 enable Smart0[654x270-&gt;654x270@213x825] fmt[2] addr[0x7df04000]   

final DSI-Link bandwidth: 876 Mbps x 4   

disp info 0, type:11, id:0   

xfer: num: 2, addr: 0x50   

xfer: num: 2, addr: 0x50

[2.314574] panel-simple-dsi fe060000.dsi.0: Specify missing connector\_type   

[2.315764] rockchip-vop2 : [drm:vop2\_bind] vp0 assign plane mask: 0x22, primary plane phy id: 5   

[2.315807] rockchip-vop2 : [drm:vop2\_bind] vp1 assign plane mask: 0x15, primary plane phy id: 4   

[2.315828] rockchip-vop2 : [drm:vop2\_bind] vp2 assign plane mask: 0x8, primary plane phy id: 3   

[2.316713] rockchip-drm display-subsystem: bound fe040000.vop (ops vop2\_component\_ops)   

[2.317966] rockchip-drm display-subsystem: bound fe0c0000.edp (ops rockchip\_dp\_component\_ops)   

[2.318378] dwhdmi-rockchip : Detected HDMI TX controller v2.11a with HDCP (DWC HDMI 2.0 TX PHY)   

[2.319625] dwhdmi-rockchip : registered DesignWare HDMI I2C bus driver   

[2.321857] rockchip-drm display-subsystem: bound fe0a0000.hdmi (ops dw\_hdmi\_rockchip\_ops)   

[2.322069] rockchip-drm display-subsystem: bound fe060000.dsi (ops dw\_mipi\_dsi\_rockchip\_ops)

##### 3.2.4.2.1 RK3566 图层分配策略

RK3566 IC 实现上有主图层和镜像图层的区别，即镜像图层 Cluster1 只能从主图层 Cluster0 对应的地址取数，同理 Esmart1/Smart1 只能从Esmart0/Smart0 对应的地址取数，所以我们需要保证主图层被优先使用。正常产品的 U-Boot 显示驱动中会根据显示接口的类型设置好 plane-mask 属性，如果有些产品没有开 U-Boot logo 显示，可以在 dts 中按以下规则配置：

1. 只有一个屏显示，可以使用如下配置：

```c
#include <dt-bindings/display/rockchip_vop.h> //图层 ID 定义头文件
&vpx { //x 取决于使用的 vp id，如 vp0
rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0 | 1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_ESMART1 | 1 << ROCKCHIP_VOP2_SMART1)>;
rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
};
```

2. 有两个屏显示【RK3566 目前只有 android 产品支持双显，且要求两个屏刷新帧率一致】，那我们让不支持热插拔设备(即始终连接显示的通路)使用主图层，另一个通路使用镜像图层：

```c
#include <dt-bindings/display/rockchip_vop.h> //图层 ID 定义头文件
&vpx { //x 取决于使用的 vp id，如 vp0
rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0)>;
rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
}; //单显或者双显时不支持热插拔的主显示设备使用主图层
&vpx { //x 取决于使用的 vp id，如 vp1
rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_ESMART1 | 1 <<
ROCKCHIP_VOP2_SMART1)>;
rockchip,primary-plane = <ROCKCHIP_VOP2_SMART1>;
};
```

#### 3.2.4.3把某个图层设置为鼠标层

应用如果使用 Atomic 显示接口，可以不区分图层的类型(primary, overlay, cursor), 只需要根据图层支持的格式，使用任意可以使用的图层做各种类型的显示。

但是在 Linux 系统(非 Android) 下，还有一些应用使用 legacy 的 API，这些 API 对图层类型比较在意，比如使用 primary 图层显示桌面背景，使用 overlay 图层播放视频，使用 cursor 图层显示鼠标。

Rockchip drm 驱动默认只注册 primary 图层和 overlay 图层，不注册 cursor 图层，如果一些特殊的 Linux 系统希望使用 cursor 图层，可以在 dts中对应的 vp 节点下设置 cursor-win-id 属性，为该 VP 对应的 crtc 分配一个 cursor 图层。

```javascript
&vp0 {
cursor-win-id = <ROCKCHIP_VOP2_CLUSTER0>;
};
```

##### 3.2.4.3.1 图层和 VP 之间的的连接关系

对于 RK356X/RK3588/RK3562 每一个图层和任意 VP 都有连接的，配置上没有特殊要求；对于 RK3528 和 RK3576 并不是每一个图层都可以连接到任意 VP 上，所以配置 VP 的 cursor 图层的时候需要选择能连接到当前 VP 的图层，以下是不同平台图层和 VP 的连接关系：

1. RK3528


| VP | 图层 |
| --- | --- |
| VP0 | Cluster0、Esmart0、Esmart1、Esmart2 |
| VP1 | Esmart2、Esmart3 |

## 2. RK3576


| VP | 图层 |
| --- | --- |
| VP0 | Cluster0、Cluster1、Esmart0、Esmart2 |
| VP1 | Cluster0、Cluster1、Esmart1、Esmart3 |
| VP2 | Esmart0、Esmart1、Esmart2、Esmart3 |

如果是 Linux 系统（buildroot，Debian 等非 Android 系统），指定 Cluster 图层为鼠标层的话，要配合 Linux SDK 提供的 libdrm-cursor 库。具体细节可参考 《Rockchip\_Developer\_Guide\_Debian\_CN.pdf》。

##### 3.2.4.4 esmart 图层分割

RK3528 和 RK3576 几个 esmart 图层共享 linebuffer，可以根据产品形态对 linebuffer 进行分割来支持不同的图层数量和性能：

3.2.4.4.1 RK3528 esmart 图层分割

RK3528 平台的 esmart0/1/2/3 共享 linebuffer，默认配置为：VOP3\_ESMART\_4K\_2K\_2K\_MODE，即此时除了固定的 cluster 图层，还注册esmart0[4k]，esmart2[2k]，esmart3[2k]，也可以根据产品需求在 dts 中做修改，如要改成 2 个支持 4k 的图层，可以按以下配置：

```dts
&vop {
esmart_lb_mode = /bits/ 8 <1>;
};
```

配置说明：


| esmart_lb_mode | val | 图层数量和性能 |
| --- | --- | --- |
| VOP3_ESMART_4K_4K_MODE | 1 | 注册 cluster[4k], esmart0[4k], esmart2[4k] |
| VOP3_ESMART_4K_2K_2K_MODE | 2 | 注册 cluster[4k], esmart0[4k], esmart2[2k], esmart3[2k] |
| VOP3 ESMART 2K 2K 2K 2K MODE | 3 | 注册 cluster[4k], esmart0[2k], esmart1[2k], esmart2[2k], esmart3[2k] |

##### 3.2.4.4.2 RK3576 esmart 图层分割

RK3576 平台除了 Cluster0/1[4k] 和 esmart0/1[4k] 是固定的配置之外，esmart2[2k] 和 esmart3[2k] 也是共享 linebuffer 的设计，默认配置是 2 个2k 的图层，如要改成 1 个支持 4k 的图层，可以按以下配置：

```dts
&vop {
esmart_lb_mode = /bits/ 8 <4>;
};
```

配置说明：


| esmart_lb_mode | val | 图层数量和性能 |
| --- | --- | --- |
| VOP3_ESMART_4K_4K_4K_MODE | 4 | 注册 cluster0[4k], cluster1[4k], esmart0[4k], esmart1[4k], esmart2[4k] |
| VOP3 ESMART 4K 4K 2K 2K MODE | 5 | 注册 cluster0[4k],cluster1[4k], esmart0[4k], esmart1[4k], esmart2[2k], esmart3[2k] |

##### 3.2.4.5 禁止图层迁移

某些 Linux 系统可能希望每个 crtc 上的图层都是唯一独占的，不在 crtc 之间做图层迁移，可以在 vop 节点下设置 disable-win-move 打开该功能。

```scss
&vop {
disable-win-move;
}
```

## 4. Display feature

### 4.1 各平台 VOP 基础特性


| SOC | VOP-version | VOP base feature |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8K | 4K | MMU | i-MODE | A/IFBDC | MULTIAREA | BCSH | gamma | 3D-LUT | POST-SCALE | X-mirrol |  |  |
| RK3066/PX2 | V1.0 | X | X | X | X | X | X | X | √ | X | X | X |
| RK3188/PX3 | V1.0 | X | X | X | X | X | X | X | √ | X | X | X |
| RK3126/RK3126C | V1.0 | X | X | √ | X | X | X | √ | √ | X | X | X |
| RK3128/PX3SE | V1.0 | X | x | √ | √ | X | X | √ | √ | X | X | X |
| RK3036 | V1.0 | X | X | √ | √ | X | X | √ | √ | X | X | X |
| RK322X/RK312XH | V1.0 | X | √ | √ | √ | X | X | √ | X | X | √ | X |
| RK322XH/RK332X | V1.0 | X | √ | √ | √ | X | X | √ | X | X | √ | X |
| SOFIA 3GR | V1.0 | X | x | √ | x | X | X | V | √ | X | X | X |
| RV1108 | V1.0 | X | X | X | √ | X | X | √ | √ | X | X | X |
| RK3288 | V1.0 | x | √ | √ | X | × | √ | √ | √ | X | √ | X |
| RK3368/PX5 | V1.0 | X | √ | √ | X | √ | √ | √ | √ | X | √ | X |
| RK3399 | V1.0 | X | √ | √ | √ | √ | √ | √ | √ | x | √ | X |
| RK3326/PX30 | V1.0 | X | X | √ | √ | √ | √ | √ | √ | X | X | X |
| RK3308 | V1.0 | X | X | X | X | X | X | √ | √ | X | X | × |
| RK1808 | V1.0 | X | X | √ | X | X | X | √ | √ | X | X | X |
| RV1109/RV1126 | V1.0 | X | X | √ | X | X | X | N | √ | X | X | × |
| RV1103/RV1106 | V1.0 | X | X | X | √ | X | X | √ | √ | X | X | X |
| RK356X | V2.0 | X | √ | √ | √ | √ | √ | N | √ | √ | √ | √ |
| RK3588 | V2.0 | √ | √ | √ | √ | √ | √ | √ | √ | √ | X | √ |
| RK3528 | V3.0 | X | √ | √ | V | √ | √ | √ | √ | √ | V | √ |
| RK3562 | V3.0 | X | X | √ | √ | X | √ | √ | √ | √ | √ | √ |
| RK3576 | V3.0 | X | √ | V | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3506 | V1.0 | X | x | x | √ | x | × | √ | √ | x | X | × |

4. 2各平台显示接口最大输出分辨率和协议标准


| 平台 | 显示接口 | 最大输出分辨率 | 协议标准 |
| --- | --- | --- | --- |
| RK3036 | HDMI | 1920x1080@60hz | 支持 HDMI 1.4a 协议标准 |
|  | CVBS | 720x480i@60hz/720x576i@50hz | 支持 NTSC/PAL 标准输出 |
|  | RGB | 1280x800@60hz | 支持 RGB666/sRGB888 |
| LVDS | 1280x800@60hz | 支持 VESA 和 JEIDA LVDS 数据格式 |  |
| RK312X/PX3SE | MIPI | 1920x1080@60hz | 支持 DSI v1.0，DCS v1.0，DPHY v1.0 协议标准 |
| HDMI | 1920x1080@60hz | 支持 HDMI 1.4a 协议标准 |  |
| CVBS | 720x480i@60hz/720x576i@50hz | 支持 NTSC/PAL 标准输出 |  |
| RK322X/RK312XH | HDMI | 4096x2160@60hz | 支持 HDMI 1.4a 和 2.0 协议标准 |
|  | CVBS | 720x480i@60hz/720x576i@50hz | 支持 NTSC/PAL 标准输出 |
| RK3288 | RGB | 1920x1080@60hz | 支持 GB888/RGB666/sRGB888 |
| LVDS | 单通道：1280x800@60hz双通道：1920x1080@60hz | 支持 VESA 和 JEIDA LVDS 数据格式 |  |
| eDP | 2560x1600@60hz | 支持 DP1.2a 和 eDP1.3 协议标准 |  |
| MIPI | 单通道：1920x1080@60hz双通道：2560x1600@60hz | 支持 DSI v1.1，DCS v1.1，DPHY v1.1 协议标准 |  |
| HDMI | VOP BIG:：3840x2160@60hzVOP LIT:1920x1080@60hz | 支持 HDMI 1.4a 和 2.0 协议标准 |  |
| RK3308 | RGB | 1280x800@60hz | 支持 RGB888/RGB666/sRGB888/MCU |
| RK1808 | RGB | 1280x800@60hz | 支持 RGB888/RGB666/sRGB888/MCU |
| MIPI | 1280X800@60hz | 支持 DSI v1.0，DCS v1.0，DPHY v1.0 协议标准 |  |
| RK322XH/RK332X | HDMI | 3840x2160@60hz | 支持 HDMI 1.4a 和 2.0 协议标准 |
|  | CVBS | 720x480i@60hz/720x576i@50hz | 支持 NTSC/PAL 标准输出 |
|  | RGB | 1280x800@60hz | 支持 RGB888/RGB666/sRGB888/MCU |
| RK3326/px30 | LVDS | 1280x800@60hz | 支持 VESA 和 JEIDA LVDS 数据格式 |
|  | MIPI | 1920x1080@60hz | 支持 DSI v1.0，DCS v1.0，DPHY v1.0 协议标准 |
|  | RGB | 1280x800@60hz | 支持 RGB888/RGB666/sRGB888/MCU |
|  | LVDS | 1280x800@60hz | 支持 VESA 和 JEIDA LVDS 数据格式 |
| RK3368/PX5 | MIPI | 1920x1080@60hz | 支持 DSI v1.0，DCS v1.0，DPHY v1.0 协议标准 |
|  | eDP | 2560x1600@60hz | 支持 DP1.2a 和 eDP1.3 协议标准 |
|  | HDMI | 4096x2160@60hz | 支持 HDMI 1.4a 和 2.0 协议标准 |
|  | MIPI | 单通道：1280x800@60hz双通道：2560x1600@60hz | 支持 DSI v1.1，DCS v1.1，DPHY v1.1 协议标准准 |
| RK3399 | eDP | 2560x1600@60hz | 支持 DP1.2a 和 eDP1.3 协议标准 |
| HDMI | VOP BIG: 4096x2160@60hzVOP LIT: 2560x1600@60hz | 支持 HDMI 1.4a 和 2.0a 协议标准 |  |
| DP | VOP BIG: 3840x2160@60hzVOP LIT: 2560x1600@60hz | 支持 DP 1.2 协议标准 |  |
| RV1109/RV1126 | RGB | 1920x1080@60hz | 支持 RGB888/RGB666/sRGB888/MCU/BT.1120 |
|  | MIPI | 1920x1080@60hz | 支持 DSI v1.1，DCS v1.1，DPHY v1.2 协议标准 |
| RK356X | RGB | 1920x1080@60hz | 支持 RGB888/RGB666/BT.656/BT.1120 |
| MIPI | 单通道：1920x1080@60hz双通道：2560x1600@60hz | 支持 DSI v1.1，DCS v1.1，DPHY v1.1 协议标准准 |  |
| eDP | 2560x1600@60hz | 支持 DP 1.2a 和 eDP 1.3 协议标准 |  |
|  | HDMI | 4096x2160@60hz | 支持 HDMI 1.4a 和 2.0a 协议标准 |
| RK3588 | RGB | 1920x1080@60hz | 支持 BT.656/BT.1120 |
| MIPI | 3840x2160@60hz | 双 MIPI，支持 DSI v1.1，DCS v1.1，DPHY v2.0，CPHY V1.1协议标准 |  |
| eDP0 | 3840x2160@60hz | 双 eDP，支持 DP1.2a 和 eDP1.3 协议标准 |  |
|  | HDMI | 7680x4320@60hz | 双 HDMI，支持 HDMI 2.1 协议标准 |
| DP | 7680x4320@30hz | 双 DP，支持 DP1.4 协议标准 |  |
| RV1103/RV1106 | RGB | 1280x720@60hz | 支持 RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3528 | HDMI | 4096x2160@60hz | 支持 HDMI 2.0 协议标准 |
| CVBS | 720x480i@60hz/720x576i@50hz | 支持 NTSC/PAL 标准输出 |  |
| RK3562 | RGB | 1920x1080@60hz | 支持 RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| MIPI | 2048x1080@60hz | 支持 DSI v1.1，DCS v1.1，DPHY v1.2 协议标准 |  |
|  | LVDS | 1280x800@60hz | 支持 VESA 和 JEIDA LVDS 数据格式 |
|  | HDMI | 4096x2160@120hz | 支持 HDMI 2.1 协议标准 |
|  | DP | 4096x2160@120hz | 支持 DP1.4 协议标准 |
| RK3576 | MIPI | 2560x1600@60hz | 支持 DSI v1.1，DCS v1.4，DPHY v2.0 协议标准 |
|  | eDP | 4096x2160@60hz | 支持 DP1.2 和 eDP1.3 协议标准 |
|  | RGB | 1920x1080@60hz | 支持 RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3506 | RGB | 1280x720@60hz | 支持 RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| MIPI | 1280x720@60hz | 支持 DSI v1.1，DCS v1.1，DPHY v1.2 协议标准 |  |

Note:  

1. 在 RK3576/RK3588 上，eDP 和 HDMI 的 PHY 是 combo 的，即在同一个产品上，使用了 HDMI0 就不能使用 eDP0，HDMI1 和 eDP1 同理。

### 4.3 VOP2 平台显示通路

#### 4.3.1 RK3568 VP 和各显示接口的连接关系



更详细的内容请参考 《Rockchip RK3568 datasheet》 Display Interface 和 Video Output Processor 章节。

#### 4.3.2 RK3588 VP 和各显示接口的连接关系



需要注意的是，RK3588 的 HDMI 和 DP 支持 8K 输出，但是在 8K 输出模式下，一个显示接口需要同时占用 VP0 和 VP1 。所以如果产品上需要支持 8K 显示输出，VP1 上要注意不要连接其他显示接口。  

更详细的内容请参考 《Rockchip RK3588 datasheet》 Display Interface 和 Video Output Processor 章节。

#### 4.3.3 RK3576 VP 和各显示接口的连接关系



需要注意的是，上图 VP1 的 2K 对应的分辨率是2560x1600，更详细的内容请参考 《Rockchip RK3576 datasheet》 Display Interface 和 VideoOutput Processor 章节。

## 5. VOP 2.0 架构下的多屏显示

根据前面的介绍，对于采用 VOP 1.0 架构的芯片，如果要实现多屏异显，一般需要多个 VOP，所以对于 VOP 1.0 架构的平台，只有RK3288，RK3399，PX30 这些包含双 VOP 的芯片才支持双屏异显。

对于 VOP 2.0 架构的芯片，由于采用了统一显示架构，可以更高效的利用 IP 资源，在最基础的条件下，VOP 内部包含几个 Video Port 就能实现几路独立的显示输出。根据VOP2 平台显示通路 章节的内容可以知道，RK3568 有三路独立的 Video Port，RK3588 平台有四路独立的Video Port, 所以在最基础的条件下，RK3568 和 RK3588 可以分别实现 3 路和 4 路独立的显示输出。

### 5.1 Connector-mirror

VOP2 的 Connector-mirror 技术支持一个 Video Port 同时驱动多路显示接口，输出相同的显示时序并显示相同的内容。



如图所示，在 RK3588 上，通过 connector-mirror 技术，把两路 HDMI/eDP 连接在 VP0 上，把两路 DP 连接在 VP1 上，把两路 MIPI DSI 连接在 VP2 上，VP3 通过 BT656，BT1120 可以同时输出 7 路，四组独立的显示输出，其中每一组（同一个 VIdeo Port 上的两个显示接口）输出的显示时序相同，且显示内容相同。

在这种应用模式下，每一组显示通路输出的最大分辨率受对应的 Video Port 和显示接口的最大分辨率限制。

这种显示特性可以通过 dts 配置开启，在 dts 里面只要把两个显示接口挂接在同一个 VP 上即可：

```hcl
&hdmi0 {
status = "okay";
};
&hdmi1 {
status = "okay";
};
&hdmi0_in_vp0 {
status = "okay";
};
&hdmi1_in_vp0 {
status = "okay";
};
&hdmi0_in_vp1 {
status = "disabled";
};
&hdmi0_in_vp2 {
status = "disabled";
};
&hdmi1_in_vp1 {
status = "disabled";
};
&hdmi1_in_vp2 {
status = "disabled";
};
```

该配置把 HDMI0 和 HDMI1 挂接在 VP0 上，开启 connector-mirror 功能。

目前 NVR SDK 支持这种功能，Android 需要更新到 1.4.15 以后的 hwc 版本才支持这种特性。

### 5.2 Connector-split

VOP2 提供的 Connector-split 功能是一种类似 mipi 双通道模式的技术，可以让一路 Video Port 输出按照水平方向平分成左右两路，同时驱动两个显示接口，显示时序相同，内容独立的画面。



如上图所示，如果在 VP0 上开启 split 模式，则 VP0 的输出可以同时驱动两个显示接口(HDMI0/1、eDP0/1 或者其他能与 VP0 连接的显示接口)，两个显示接口上显示的内容为 VP0 输出的内容水平方向左右平分，比如 VP0 以 3840x1080 的分辨率输出，则两个显示接口各显示1920x1080 的输出。

通过这种技术，可以在 RK3588 上扩展出 7 路独立的显示输出。

需要注意的是，每一个 VP 上参与 split 输出的两个显示接口，输出的时序，帧率必须相同。

通过 Connector-split 技术，可以扩展出更多的多屏异显功能，目前只有 RK3588/RK3576 支持该功能， Connector-split 根据接口类型又分以下两种模式：

1. 相同显示接口的 split 模式： rockchip,split-mode

(1) 单个 VP 接 2 个接口/时序完全相同的屏；

(2) 两个屏分别显示左右半屏图像；

(3) DTS 配置/EDID 读取单个屏的时序，驱动通过调用接口： drm\_mode\_convert\_to\_split\_mode() 将水平方向的时序 \*2 后传给VOP；

(4) 软件注册 1 个 connetor，应用层看到 1 个显示设备；

这种模式下，dts 配置文件中把参与 split 的两个显示接口挂接在同一个 VP 上，且打开左边显示接口的 rockchip,split-mode 属性。比如 ，按照如下配置，打开 hdmi0 和 hdmi1 在 VP0 上的 split 功能：

```hcl
&hdmi0 {
status = "okay";
};
&hdmi1 {
status = "okay";
rockchip,split-mode；
};
&hdmi0_in_vp0 {
status = "okay";
};
&hdmi1_in_vp0 {
status = "okay";
};
&hdmi0_in_vp1 {
status = "disabled";
};
&hdmi0_in_vp2 {
status = "disabled";
};
```

```dts
&hdmi1_in_vp1 {
status = "disabled";
};
&hdmi1_in_vp2 {
status = "disabled";
};
```

在驱动实现上，为了方便上层应用适配，尽量和 MIPI 双通道技术接近，屏蔽底层实现差异，每个 Video Port 上进行 split 的两个显示接口只会向 drm 系统注册一个 encoder 和 connector，所以在用户空间，每一 CRTC(Video Port) 上只会看到一个 connector 设备，这个信息可以通过modetest 的输出确认。

对于 Android 应用，希望每一个屏幕都对应一个独立的显示设备，针对这种需求，Rockchip 平台的 Android hwc 有做针对性的优化，具体请参考《DrmHwc2 多屏拼接异显功能说明》文档。

2. 不同显示接口的 split 模式： rockchip,dual-connector-split

(1) 单个 VP 接 2 个接口不一样但是时序完全一样的屏；

(2) 两个屏分别显示左右半屏图像；

(3) DTS 配置/EDID 读取单个屏的时序，驱动通过调用接口： drm\_mode\_convert\_to\_split\_mode() 将水平方向的时序 \*2 后传给VOP；

(4) 软件注册 2 个 connector，应用层看到 2 个显示设备；

和 rockchip,split-mode 的主要区别是使用 2 个不同的显示接口，由于 DRM 框架需要对 2 个显示接口的驱动分别进行管理，所以注册了 2个 connector，应用层看到的是 2 个显示设备；这种模式下，通过在对应接口的节点下配置属性： rockchip,dual-connector-split 就可以打开该功能，同时可以使用属性： rockchip,left-display 来标注左边的那个屏。

比如 ，按照如下配置，打开 HDMI0 和 DP0 在 VP0 上的 split 功能，同时 HDMI0 显示左半屏的图像：

```hcl
&hdmi0 {
status = "okay";
rockchip,dual-connector-split;
rockchip,left-display;
};
&dp0 {
status = "okay";
rockchip,dual-connector-split;
};
&hdmi0_in_vp0 {
status = "okay";
};
&dp0_in_vp0 {
status = "okay";
};
&hdmi0_in_vp1 {
status = "disabled";
};
&hdmi0_in_vp2 {
status = "disabled";
};
&dp0_in_vp1 {
status = "disabled";
};
&dp0_in_vp2 {
status = "disabled";
};
```

## 6. 硬件相关

### 6.1 RGB 输出/TTL 模式硬件连接

#### 6.1.1 VOP 1.0 RGB 接口硬件连接方式

1. 判断是 VOP 1.0 还是 VOP 2.0 的设计，可以从 3.1 章节的 VOP version 中查询；

2. 对于 SOC 支持 24bit RGB 输出的硬件连接方式


| display mode index | mode0 | mode1 | mode2 | mode3 | mode4 | mode | 5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| display mode | RGBparallel24 bit | RGBparallel18 bit | RGBparallel18 bit | RGBparallel16 bit | RGBparallel16 bit | serial3x8/4x8 | serial3x6/4x6 |
| dclk |  |  |  | dclk |  |  |  |
| vsync |  |  |  | vsync |  |  |  |
| hsync |  |  |  | hsync |  |  |  |
| den |  |  |  | den |  |  |  |
| data | data[23:0] | data[23:18]data[15:10]data[7:2] | data[17:0] | data[23:19]data[15:10]data[7:3] | data[15:0] | data[7:0] | data[7:2] |
| D22 | R6 | R4 | 一 | R3 |  |  |  |
| D21 | R5 | R3 | 一 | R2 |  |  |  |
| D20 | R4 | R2 | 一 | R1 |  |  |  |
| D19 | R3 | R1 | 一 | RO |  |  |  |
| D18 | R2 | RO |  |  |  |  |  |
| D17 | R1 |  | R5 |  |  |  |  |
| D15 | G7 | G5 | R3 | G5 | R4 |  |  |
| D14 | G6 | G4 | R2 | G4 | R3 |  |  |
| D13 | G5 | G3 | R1 | G3 | R2 |  |  |
| D12 | G4 | G2 | RO | G2 | R1 |  |  |
| D11 | G3 | G1 | G5 | G1 | RO |  |  |
| D9 | G1 | 一 | G3 | 一 | G4 | _ | _ |
| D8 | GO | 一 | G2 | _ | G3 | _ | _ |
| D7 | B7 | B5 | G1 | B4 | G2 | D7 | D5 |
| D6 | B6 | B4 | GO | B3 | G1 | D6 | D4 |
| D4 | B4 | B2 | B4 | B1 | B4 | D4 | D2 |
| D3 | B3 | B1 | B3 | BO | B3 | D3 | D1 |
| D2 | B2 | BO | B2 | 一 | B2 | D2 | DO |
| D1 | B1 | 一 | B1 | 一 | B1 | D1 | 一 |

3. 对于 SOC 支持 18bit RGB 输出的硬件连接方式


| interface | RGB parallel |  |  |  |
| --- | --- | --- | --- | --- |
| display mode index | mode2 | mode4 | mode5 |  |
| display mode | RGBparallel18 bit | RGBparallel16 bit | serial3x8/4x8 | serial3x6/4x6 |
| dclk | dclk |  |  |  |
| vsync | vsync |  |  |  |
| hsync | hsync |  |  |  |
| den | den |  |  |  |
| data | data[17:0] | data[15:0] | data[7:0] | data[7:2] |
| D17 | R5 |  |  |  |
| D16 | R4 | 一 | 一 | 一 |
| D15 | R3 | R4 | 一 | 一 |
| D14 | R2 | R3 | 一 | 一 |
| D13 | R1 | R2 | 一 | 一 |
| D12 | RO | R1 | 一 | 一 |
| D11 | G5 | RO | 一 | 一 |
| D10 | G4 | G5 | 一 | 一 |
| D9 | G3 | G4 | 一 | 一 |
| D8 | G2 | G3 | 一 | 一 |
| D7 | G1 | G2 | D7 | D5 |
| D6 | GO | G1 | D6 | D4 |
| D5 | B5 | GO | D5 | D3 |
| D4 | B4 | B4 | D4 | D2 |
| D3 | B3 | B3 | D3 | D1 |
| D2 | B2 | B2 | D2 | DO |
| D1 | B1 | B1 | D1 | 一 |
| DO | BO | BO | DO | 一 |

4. 对于 VOP 1.0 中 MCU 接口 DATA 线连接方式和 RGB parallel 的连接方式一致，需要注意的是，RGB parallel 中的 4 个 时钟信号复用成MCU 接口的控制信号，以下是具体的对应关系：


| dclk | mcu_rs | 1表示发送的是数据，0表示发送的是命令 |
| --- | --- | --- |
| vsync | mcu_csn | 片选信号，低有效 |
| hsync | mcu_wrn | 写使能信号，上升沿有效 |
| den | mcu_rdn | 1：表示发数据到屏，0：表示从屏读数据 |

#### 6.1.2 VOP 2.0 及之后的版本 RGB 接口硬件连接方式


| interface | RGB parallel |  |  |
| --- | --- | --- | --- |
| display mode index | mode0 | mode1 | mode3 |
| display mode | RGBparallel24 bit | RGBparallel18 bit | RGBparallel16 bit |
| dclk | dclk |  |  |
| vsync | vsync |  |  |
| hsync | hsync |  |  |
| den | den |  |  |
| data | data[23:0] | data[23:18]data[15:10]data[7:2] | data[23:19]data[15:10]data[7:3] |
| D23 | R7 | R5 | R4 |
| D22 | R6 | R4 | R3 |
| D21 | R5 | R3 | R2 |
| D20 | R4 | R2 | R1 |
| D19 | R3 | R1 | RO |
| D18 | R2 | RO | 一 |
| D17 | R1 |  | 一 |
| D16 | RO | 一 | 一 |
| D15 | G7 | G5 | G5 |
| D14 | G6 | G4 | G4 |
| D13 | G5 | G3 | G3 |
| D12 | G4 | G2 | G2 |
| D11 | G3 | G1 | G1 |
| D10 | G2 | GO | GO |
| D9 | G1 | 一 | 二 |
| D8 | GO | 一 | 一 |
| D7 | B7 | B5 | B4 |
| D6 | B6 | B4 | B3 |
| D5 | B5 | B3 | B2 |
| D4 | B4 | B2 | B1 |
| D3 | B3 | B1 | BO |
| D2 | B2 | BO | 一 |
| D1 | B1 | 一 | 一 |
| DO | BO |  | 一 |

6.1.3 不同 display mode index 对应的软件配置


| display mode index | bus format |
| --- | --- |
| mode0 | MEDIA BUS FMT RGB888 1X24 |
| mode1 | MEDIA BUS FMT RGB666 1X24 CPADHI |
| mode2 | MEDIA BUS FMT RGB666 1X18 |
| mode3 | MEDIA_BUS_FMT_RGB565_1X24_CPADLO |
| mode4 | MEDIA_BUS_FMT_RGB565_1X16 |
| mode5 | MEDIA_BUS_FMT_RGB888_3X8 |

6.1.4 BT.656 和 BT.1120 的硬件连接方式


| SOC TX 引脚 | Clock | D15 D | 14 D | 13 D | 12 D | 11 D | 10 | D9 | D8 [ | D7 | D6 | D5 | D4 | D3 | D2 | D1 | DO | 软件 bus_format 配置 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BT.656 接法 | Clock | 1 | – |  | 一 | 一 | 一 |  | 一 | [D7 | \|D6 \| | D5 | \|D4 | \|D3 | D2 | D1 | \|DO | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 接法1 | Clock | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Yo | c7 | c6 | c5 | C4 | c3 | C2 | C1 | co | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 接法2 | Clock | C7 | c6 | C5 | \|c4 | c3 | c2 | C1 | co | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Yo | MEDIA_BUS_FMT_UYVY8_1X16 |

根据接收端的 Y/U/V 处理顺序不同，如果出现显示颜色不对，还可以在 DTS 中调整不同的 bus\_format 来适配，BT.656 和 BT.1120 分别有以下四种配置：

BT.656：


| #define MEDIA_BUS_FMT_UYVY8_2X8 | 0x2006 |
| --- | --- |
|  |  |
| #define MEDIA_BUS_FMT_VYUY8_2X8 | 0x2007 |
| #define MEDIA_BUS_FMT_YUYV8_2X8 #define MEDIA_BUS_FMT_YVYU8_2X8 | 0x2008 0x2009 |

BT.1120：


|  |  |
| --- | --- |
| #define MEDIA_BUS_FMT_UYVY8_1X16 | 0x200f |
| #define MEDIA BUS FMT VYUY8 1X16 | 0x2010 |
| #define MEDIA BUS FMT YUYV8 1X16 | 0x2011 |
| #define MEDIA BUS FMT YVYU8 1X16 | 0x2012 |

MEDIA\_BUS\_FMT 的定义可以参考：


| ./include/uapi/1inux/media-bus-format.h |
| --- |

### 6.2 LVDS Data Mapping


| bus-format | Timeslot | Data organization |  |  |  |
| --- | --- | --- | --- | --- | --- |
| Lane3 | Lane2 | Lane1 | Lane0 |  |  |
| MEDIA BUS FMT RGB666 1X7X3 SPWG | 0 | 一 | DEN | B1 | GO |
| 1 | 一 | VSYNC | BO | R5 |  |
| 2 | 一 | HSYNC | G5 | R4 |  |
| 3 | 一 | B5 | G4 | R3 |  |
| 4 | 一 | B4 | G3 | R2 |  |
| 5 | 一 | B3 | G2 | R1 |  |
| 6 | 一 | B2 | G1 | RO |  |
| MEDIA BUS FMT RGB888 1X7X4 SPWG | 0 | GND | DEN | B1 | GO |
| 1 | B7 | VSYNC | BO | R5 |  |
| 2 | B6 | HSYNC | G5 | R4 |  |
| 3 | G7 | B5 | G4 | R3 |  |
| 4 | G6 | B4 | G3 | R2 |  |
| 5 | R7 | B3 | G2 | R1 |  |
| 6 | R6 | B2 | G1 | RO |  |
| MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA | 0 | GND | DEN | B3 | G2 |
| 1 | B1 | VSYNC | B2 | R7 |  |
| 2 | BO | HSYNC | G7 | R6 |  |
| 3 | G1 | B7 | G6 | R5 |  |
| 4 | GO | B6 | G5 | R4 |  |
| 5 | R1 | B5 | G4 | R3 |  |
| 6 | RO | B4 | G3 | R2 |  |

## 7. 扫描时序说明

## 7.1常见的扫描时序图



## 7.2DRM 对扫描时序的定义



## 7.3软件配置的对应关系和转换



## 7.4查看当前配置的时序



## 8. 带宽的计算方法

## 8.1图像的带宽

以 1080P ARGB 格式的图像数据为例：


| p0 | p0 | p0 | p0 | pl | pl | pl | pl | p2 | p2 | p2 | p2 | p3 | p3 | p3 | p3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p4 | p4 | p4 | p4 | p5 | p5 | p5 | p5 | p6 | p6 | p6 | p6 | p7 | p7 | p7 | p7 |
| p8 | p8 | p8 | p8 | p9 | p9 | p9 | p9 | pl0 | p10 | p10 | p10 | p11 | p11 | pl1 | p11 |
| p12 | p12 | pl2 | pl2 | 1 | p13 | pl3 | pl3 | p14 | p1 | pl4 | p14 | 15 | pl5 | 15 | pl5 |

ARGB 格式一个像素占用的内存大小：4 Byte

1080P ARGB 格式的数据占用内存：1920 x 1080 x 4Byte/pixel = 8,100 Kbyte

如果按 60fps 刷新，占用的带宽是： 8,100 x 60fps = 474.6 Mbyte/s

如果数据格式改成 YUV420SP(NV12):

Single Frame YUV420: NV12


| Y1 | Y2 | Y3 | Y4 | Y5 | Y6 |
| --- | --- | --- | --- | --- | --- |
| Y7 | Y8 | Y9 | Y10 | Y11 | Y12 |
| Y13 | Y14 | Y15 | Y16 | Y17 | Y18 |
| Y19 | Y20 | Y21 | Y22 | Y23 | Y24 |
| U1 | V1 | U2 | V2 | U3 | V3 |
| U4 | V4 | U5 | V5 | U6 | V6 |

Position in byte stream:

Y1 Y2 Y3 Y4 Y5 Y6 Y7 Y8 Y9 Y10 Y11 Y12 Y13 Y14 Y15 Y16 Y17 Y18 Y19 Y20 Y21 Y22 Y23 Y24 U1 V1 U2 V2 U3 V3 U4 V4 U5 V5 U6 V6

NV12 格式一个像素占用的内存大小：1.5 Byte

1080P NV12 格式的数据占用内存：1920 x 1080 x 1.5Byte/pixel = 3,037.5 Kbyte

如果按 60fps 刷新，占用的带宽是： 3,037.5 x 60fps = 178 Mbyte/s

## 8.2显示接口的带宽



以上面这张图配置的时序为例，当前这个时序下，按 60 帧刷新需要的 dclk 是：131994240 hz，dts 实际按取整 132000000 hz 配置：

htotal = hfp + hsync + hbp + hactive = 15 + 2 + 30 + 1080 = 1,127   

vtotal = vfp + vsync + vbp + vactive = 15 + 2 + 15 + 1920 = 1,952   

dclk = htotal x vtotal x fps = 1127 x 1952 x 60fps = 131,994,240

MIPI 接口上传输的频率是：

132M x 3(RGB) x 8(bpc) / 4(lane) / 0.9 = 880 Mbps

其中：

x3(RGB)：是每一个 pixel 有 RGB 3 个分量；

x8(bpc)：是每一个分量的位深是 8bit；

/4(lane)：是这么多数据量在 4 lane 上传输，/4 是计算每 lane 的数据量；

/0.9：是考虑 mipi 时序的传输效率；

## 9. 常用的 debug 手段

### 9.1 dump 当前的显示状态

9.1.1 使用命令

cat /sys/kernel/debug/dri/0/summary



需要注意的是该命令依赖内核的 debugfs 功能，如果内核没有开启 debugfs 功能或者系统没有挂载 debugfs 节点，需要确保内核打开CONFIG\_DEBUG\_FS 选项，并通过如下命令手动挂载：

mount -t debugfs none /sys/kernel/debug

#### 9.1.2 参数说明

1. 两个红色方框表示两个显示设备使用的 vop 分别是 ff900000.vop 和 ff8f0000.vop；

2. 绿色部分表示 connector 信息，两个显示设备分别为 eDP 屏和 MIPI 屏；

3. 粉色部分为显示模式，可以知道具体的时序、DCLK 以及帧率，上图中两个设备分别为分辨率为 1536x2048p60 的 eDP 屏和分辨率1280x720p29 的 MIPI 屏；

4. 蓝色部分是 VOP 图层信息，第一个显示设备打开 win0 图层，大小为 1536x2048 格式为 XRGB 第二个显示设备打开 win0 图层，大小1280x720 格式为 XRGB， src 和 dst 表示源数据和显示的大小和位置，如果 src 和 dst 的大小不一致，VOP 会进行缩放处理，如下图所示:



5. 橙色部分为 VOP HDR、CSC 的一些状态信息；SDR 表示应用送下来的是 SDR 格式的数据，如果是 HDR 格式的数据，会看到 HDR 的关键字。

6. VOP2 平台的 summary 信息基本和之前平台的一致，只是把之前 VOP 改成了 Video Port，图层名字从原来的 winx， 变成了 Cluster-winx或者 Esmart-winx:



7. 每个图层下边有一个 format 属性，他可能是 AB24、XR24、NV12 之类的标准 fourcc 值，表示的是这个图层所显示的 framebuffer 中数据的格式，具体的含义可以参考 drm fourcc。

#### 9.1.3 dump VOP 当前的配置信息

由于 VOP2 架构复杂，寄存器相关配置量非常大，我们提供了以下两个方法 dump VOP 当前的配置信息：

1. 通过 cat DRM 的设备节点获取配置信息，如：

(1) 获取 VOP 中正在工作的模块的寄存器配置

cat /sys/kernel/debug/dri/0/active_regs

(2) 获取 VOP 所有子模块的寄存器配置

cat /sys/kernel/debug/dri/0/regs

以上两个命令可以 dump VOP 的相关寄存器配置，再配合上一个章节的 cat /sys/kernel/debug/dri/0/summary，基本可以 dump 出当前 VOP的显示状态信息。

需要注意的是，这个功能在 Linux-6.1 及之后的内核默认就支持，在 Linux-5.10 和 Linux-4.19 内核需要更新到较新的版本才支持，如果你是这2个版本的内核，同时又不方便更新的，那可以使用下面的方法2。

2. 使用 vop2\_dump.sh 脚本

这个脚本可以更方便的 dump vop 相关的显示状态信息，大部分 SDK 里面默认有带这个脚本，如果没有，可以通过如下地址获取：vop2\_dump。

需要注意的是，该脚本也依赖 debugfs ，并且需要内核打开 CONFIG\_DEVMEM 选项，以方便该脚本利用 io 命令读取寄存器配置。

### 9.2 dump 当前显示的 buffer

有时候我们发现屏幕上显示的内容异常，这种异常有可能是 VOP ——&gt; 显示接口 ——&gt; 屏幕/显示器，这条链路上有异常，也有可能是上面的应用绘制的显示数据就是异常的。这时候我们可以把 VOP 图层显示的 buffer 的数据 dump 出来，然后用 7yuv 之类的软件查看，这些数据是否正常。如果这些数据本身就是异常的，那就说明是 userspace 送下来的数据就是有问题的，反之则要排查 VOP 到屏幕之间的这条显示通路。

#### 9.2.1 使用说明

首选需要确保 Linux kernel make menuconfig 打开 CONFIG\_ROCKCHIP\_DRM\_DEBUG 选项。

/sys/kernel/debug/dri/0/ff900000.vop/vop\_dump # cat dump   

```
echo dump>dump to dump one frame
echo dumpon > dump to start vop keep dumping
echo dumpoff > dump to stop keep dumping
echo dumpn > dump n is the number of dump times
```

dump path is /data/vop\_buf   

if fd err = -3 try rm -r /data/vopbuf echo dump1 &gt; dump can fix it   

if fd err = -28 save needed data try rm -r /data/vopbuf

1. dump 一帧当前显示的 buffer

```
echo dump > /sys/kernel/debug/dri/0/ff900000.vop/vop_dump/dump
```

2. 连续 dump n 帧显示的 buffer

```batch
echo dumpn > /sys/kernel/debug/dri/0/ff900000.vop/vop_dump/dump
```

3. dump 出来的文件保存在 /data/vop\_buf/，可以使用 7yuv 软件查看

4. 以上路径加粗部分 [ff900000.vop] 在不同平台不一样，具体路径可以和 cat /sys/kernel/debug/dri/0/summary 节点的 VOP/Video Port 对应，比如对于 RK3588 路径会变成：/sys/kernel/debug/dri/0/video\_port0/dump

### 9.3 调整 DRM 打印 Log 等级抓 Log

DRM 根据不同的接口设定以下几个打印等级，可以通过 DRM 的 debug 节点决定开关哪个接口的打印，比如我要查看 ATOMIC 的打印，就你可以输入命令：

```shell
echo 0x10 > /sys/module/drm/parameters/debug
```

如果想看到所有的调试信息，可以输入命令：

```
echo 0xff > /sys/module/drm/parameters/debug
```

其中 0x20 Bit5 对应的是 vsync 相关的信息，这个打印的内容非常多，如果调试的时候不关注这个信息，一般不要设置这个 bit。

其他更多的打印等级可以查看下面的定义：

Enable debug output, where each bit enables a debug category.   

Bit 0 (0x01) will enable CORE messages (drm core code)   

Bit 1 (0x02) will enable DRIVER messages (drm controller code)   

Bit 2 (0x04) will enable KMS messages (modesetting code)   

Bit 3 (0x08) will enable PRIME messages (prime code)   

Bit 4 (0x10) will enable ATOMIC messages (atomic code)   

Bit 5 (0x20) will enable VBL messages (vblank code)   

Bit 7 (0x80) will enable LEASE messages (leasing code)   

Bit 8 (0x100) will enable DP messages (displayport code)

这里面有很多打印，默认是不打印到串口的，所以打开了对应的调试开关后，默认在串口终端只会看到部分调试信息，要获取完整 log 信息需要通过 dmesg 命令查看。

9. 4查看当前显示时钟

时钟是影响显示模块的关键因素之一，所以我们经常要获取当前系统提供的时钟是多少，可以通过以下命令获取：

1. 获取整个时钟树

cat /sys/kernel/debug/clk/clk_summary

2. 如果只关注 VOP 的时钟

cat /sys/kernel/debug/clk/clk_summary | grep vop

对于 HDMI/DP/VGA/CVBS 等显示接口，每个分辨率对应的 DCLK 是有严格的标准要求，如果 DCLK 时钟不对可能会出现无法显示或者出现显示兼容性问题，而对于 eDP/LVDS/MIPI/RGB 等显示接口一般有一定的余量。

在 VOP2 驱动使能对应的显示接口的时候，会有如下的打印，显示接口需要的时钟频率以及从系统中获取到的时钟频率，如果二者不匹配的时候，就要特别注意。

rockchip-vop2: [vop2\_crtc\_atomic\_enable] Update mode to 3840x2160p60, type: 10(if:200) for vp2 dclk: 533280000   

fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] dclk\_out2 div: 2 dclk\_core2 div: 2   

fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] set dclk\_vop2 to 533280000, get 533279987

这个 log 显示的是，VP2 上整在使能一个 DP 接口(通过 type 判断)，显示 4K 的分辨率，需要的 dclk 为 533280000 HZ，但是系统分配到的是533279987 HZ，因为 DP 对 dclk 的精度要求非常高，这种情况下，大概率屏幕是点不亮的。

### 9.5 强行开关显示设备

以 LVDS 为例：

关 LVDS: echo off &gt; /sys/class/drm/card0-LVDS-1/status

开 LVDS: echo on &gt; /sys/class/drm/card0-LVDS-1/status

### 9.6 查看 DRM buffer 使用情况

通过下面的命令可以知道通过 DRM GEM 申请的 buffer 使用情况：

cat /sys/kernel/debug/dri/0/mm_dump

/ # cat /sys/kernel/debug/dri/0/mm\_dump   

0x0000000000000000-0x0000000000c00000:12582912: used   

0x0000000000c00000-0x0000000100000000:4282384384:free   

total: 4294967296, used 12582912 free 4282384384

### 9.7 查看 GPIO 状态

在项目刚开始 bring up 点屏阶段，经常需要通过控制 GPIO 的状态来控制屏或者背光的电源，我们可以通过以下命令确认软件配置的 GPIO 状态是否正确：

```
cat /sys/kernel/debug/gpio

GPIOs 0-31, platform/pinctrl, gpio0:
```

gpio-1 vcc\_sd ) out lo   

gpio-4 bt\_default\_wake\_host) in lo   

gpio-5 GPIO Key Power ) in hi   

gpio-9 |bt default reset out lo   

gpio-10 reset out hi   

GPIOs 32-63, platform/pinctrl, gpio1:   

gpio-34 int-n in hi   

gpio-45 enable out hi   

gpio-46 vsel out lo   

gpio-49 vsel out lo

[root@RK356X:/]# modetest -M rockchip   

Encoders:   

id crtc type possible crtcs possible clones   

151 0 Virtual 0x00000007 0x00000000   

153 0 TMDS 0x00000002 0x00000000   

155 71 TMDS 0x00000001 0x00000000   

166 0 DPI 0x00000004 0x00000000   

Connectors:   

id encoder status name size (mm) modes encoders   

154 0 disconnected eDP-1 0x0 0 153   

props:   

1 EDID:   

flags: immutable blob   

blobs:   

value:   

2 DPMS:   

flags: enum   

enums: On=0 Standby=1 Suspend=2 Off=3   

value: 0   

156 155 connected HDMI-A-1 530x300 31 155

### 9.8 modetest 的使用

modetest 是集成在 libdrm 中用来测试 drm 系统的命令行工具，它可以提供如下功能：

1. Dump drm 系统的基础状态

modes:   

name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)   

1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: preferred,   

driver   

1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148352 flags: phsync, pvsync; type: driver   

1920x1080 50 1920 2448 2492 2640 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: driver   

1280x720 60 1280 1390 1430 1650 720 725 730 750 74250 flags: phsync, pvsync; type: driver   

720x576 50 720 732 796 864 576 581 586 625 27000 flags: nhsync, nvsync; type: driver   

720x480 60 720 736 798 858 480 489 495 525 27027 flags: nhsync, nvsync; type: driver   

props:   

167 0 disconnected HDMI-A-2 0x0 0 166   

props:

```asm
CRTCs:
id fb pos size
71 0 (0,0) (1920x1080)
60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: userdef
props:
72 PLANE_MASK:
flags: immutable bitmask
values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20
Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
value: 21
26 GAMMA_LUT:
flags: blob
blobs:
value:
27 GAMMA_LUT_SIZE:
flags: immutable range
values: 0 4294967295
value: 1024
87 0 (0,0) (0x0)
0 0 0 0 0 0 0 0 0 0 flags: ; type:
props:
88 PLANE_MASK:
flags: immutable bitmask
values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20
Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
value: 34
26 GAMMA_LUT:
flags: blob
blobs:
value:
27 GAMMA_LUT_SIZE:
flags: immutable range
values: 0 4294967295
value: 1024
103 0 (0,0) (0x0)
0 0 0 0 0 0 0 0 0 0 flags: ; type:
```

104 PLANE\_MASK: flags: immutable bitmask values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20

26 GAMMA\_LUT: flags: blob blobs: value:

27 GAMMA\_LUT\_SIZE: flags: immutable range values: 0 4294967295 value: 1024

possible crtcs 0x00000007

formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16

props: 8 type: flags: immutable enum enums: Overlay=0 Primary=1 Cursor=2 value: 1

60 alpha: flags: range values: 0 65535 value: 65535

61 pixel blend mode: flags: enum enums: None=2 Pre-multiplied=0 Coverage=1 value: 0

62 zpos: flags: range values: 0 7 value: 0

63 NAME: flags: immutable bitmask values: Smart0-win0=0x1 value: 1

70 colorkey: flags: range values: 0 2164260863 value: 0   

0 0 0,0 0,0 0

formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16

8 type: flags: immutable enum enums: Overlay=0 Primary=1 Cursor=2 value: 1

76 alpha: flags: range values: 0 65535 value: 65535

77 pixel blend mode: flags: enum enums: None=2 Pre-multiplied=0 Coverage=1 value: 0

78 zpos: flags: range values: 0 7 value: 1

79 NAME: flags: immutable bitmask values: Smart1-win0=0x2 value: 2

86 colorkey: flags: range values: 0 2164260863 value: 0   

0 0 0 0 0,0

89 0,0 0 0x00000007 formats: XR24 AR24 formats: XR24 AR24 XB24 AB24 XB24 AB24 RG24 BG24 RG24 BG24 RG16 RG16 BG16 BG16 NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY props:

value: 1   

92 alpha:   

flags: range   

values: 0 65535   

value: 65535   

93 pixel blend mode:   

flags: enum   

enums: None=2 Pre-multiplied=0 Coverage=1   

value: 0   

94 zpos:   

flags: range   

values: 0 7   

value: 2   

95 NAME:   

flags: immutable bitmask   

values: Esmart1-win0=0x4   

value: 4   

105 0 0 0,0 0,0 0 0x00000007   

formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY   

props:   

8 type:   

flags: immutable enum   

enums: Overlay=0 Primary=1 Cursor=2   

value: 0   

108 alpha:   

flags: range   

values: 0 65535   

value: 65535   

109 pixel blend mode:   

flags: enum   

enums: None=2 Pre-multiplied=0 Coverage=1   

value: 0   

110 zpos:   

flags: range   

values: 0 7   

value: 3   

111 NAME:   

flags: immutable bitmask   

values: Esmart0-win0=0x8   

value: 8

第一部分的 Encoders 输出和第二部分的 Connectors 对应，从 Dump 输出我们可以看到：

Connectore eDP-1 的 id 为 154，它对应的 Encoder id 为 153， 且它处于 disconnected 状态， 说明底层驱动未检测到该 eDP 设备的连接，Encoder 153 的 possible crtcs 的值为 2 即 BIT(1)， 这是一个按位与的掩码，说明该 eDP 只能和 VP1 连接。

Connector HDMI-A-1 的 id 为 156，它对应的 Encoder id 为 155，且它处于 connected 的状态，说明底层驱动已经检测到了该 HDMI 接口上已经有显示设备连接，modes 是驱动上报的对应显示设备支持的分辨率。

CRTC 对应 VOP 2.0 中的 Video Port 或者 VOP 1.0 中的 vop。

Planes 对应图层，列出的信息包含该图层可以在哪几个 VP 之间切换（ possible crtcs ）以及所支持的格式( formats )。

2. 在对应的显示接口上输出各种颜色的彩条，可以利用该功能对 Drm 驱动进行简单的验证。

modetest -M rockchip -s 156@71:1920x1080

通过上述命令，可以在 HDMI-A-1 上显示类似下边的 smpte 彩条，其中 156 是 HDMI-A-1 的 id，71 是 VP0 的 id。



3. 需要临时手动修改 drm 一些属性的值

更多的使用方式，可以参考以下使用说明：

[root@RK3588:/]# modetest -h   

usage: modetest [-acDdefMPpsCvrw]   

Query options:   

- C list connectors   

- e list encoders   

list framebuffers   

-p list CRTCs and planes (pipes)   

Test options:   

-P &lt;plane id&gt;@&lt;crtc id&gt;:&lt;w&gt;x&lt;h&gt;[+&lt;x&gt;+&lt;y&gt;][\*&lt;scale&gt;][@&lt;format&gt;] set a plane   

-s &lt;connector id&gt;[,&lt;connector id&gt;][@&lt;crtc id&gt;]:[#&lt;mode index&gt;]&lt;mode&gt;[-&lt;vrefresh&gt;][@&lt;format&gt;] set a mode   

-C test hw cursor   

-V test vsynced page flipping   

set the preferred mode for all connectors   

-w &lt;obj\_id&gt;:&lt;prop\_name&gt;:&lt;value&gt; set property   

- a use atomic API   

-F pattern1,pattern2 specify fill patterns   

Generic options:   

-d drop master after mode set   

-M module use the given driver   

-D device use the given device   

Default is to dump all info

这里需要说明的是，modetest 是通过 id 来指定 plane，crtc，connector 等 Drm 资源的，这些 id 可以通过 modetest 查询，也可以通过如下命令来查询：

cat /sys/kernel/debug/dri/0/state

### 9.9 xrandr 的使用

xrandr 是使用 Xserver 的图形系统上的一个显示配置工具，它可以用来 dump 系统的显示信息，也可以用来配置系统的显示输出。

```csv
root@linaro-alip:/# xrandr
Screen 0: minimum 320 x 200, current 1920 x 2048, maximum 8192 x 8192
eDP-1 connected primary 1536x2048+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
1536x2048 59.99*+
HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 708mm x 398mm
1920x1080 60.00*+ 50.00 59.94 30.00 24.00 29.97 23.98
1920x1080i 60.00 50.00 59.94
1280x1024 60.02
1440x900 59.90
1360x768 60.02
1280x720 60.00 50.00 59.94
1024x768 60.00
800x600 60.32
720x576 50.00
```

720x576i 50.00   

720x480 60.00 59.94   

720x480i 60.00 59.94   

640x480 60.00 59.94   

DP-1 disconnected (normal left inverted right x axis y axis)

该工具是 Xserver 环境下的通用工具，详细的使用介绍可参考Xrandr

9. 10显示进程的暂停<sub>、</sub>启动

有时候为了调试方便，希望应用停在某一个固定的场景，我们可以使用下面的命令暂停和恢复显示进程。

Android Surfaceflinger 进程：

1. 暂停进程

kill -STOP \`pgrep surfaceflinger\`

2. 恢复进程

kill -CONT \`pgrep surfaceflinger\`

Linux weston 进程：

1. 暂停进程

Kill -STOP \`pgrep weston\`

2. 恢复进程

kill -CONT \`pgrep weston\`

Linux Xserver 进程：

1. 暂停进程

```powershell
Kill -STOP `pgrep Xorg`
```

2. 恢复进程

kill -CONT \`pgrep Xorg\`

在日常的开发过程中，当我们希望临时通过 io 命令修改 VOP 的一些寄存器配置来查看某种显示效果的时候，特别注意提前使用类似的命令，停掉 usespace 中对应的显示主进程，否则显示进程的更新会随时覆盖本地的寄存器修改。

### 9.11 获取 EDID 信息

以 HDMI 为例：

```
cat /sys/class/drm/card0-HDMI-A-1/edid > /data/edid.bin
```

### 9.12 查看 HDMI 状态

cat /sys/kernel/debug/dw-hdmi/status

/ # cat /sys/kernel/debug/dw-hdmi/status   

PHY: enabled Mode: HDMI   

Pixel Clk: 148500000Hz TMDS Clk: 148500000Hz   

Color Format: RGB Color Depth: 8 bit   

Colorimetry: ITU.BT709 EOTF: Off

## 10. FAQ

### 10.1 VOP POST\_BUF\_EMPTY

可能会出现类似以下 log：



### 可能原因有：

1. 带宽不够

如果系统带宽不够会导致 VOP 不能及时取到数据，从而报 post buf empty，可以做如下尝试：

(1) 尝试将 ddr 固定最高频率;

(2) 将屏的消隐期加长，提高一行的取数时间;

2. iommu 出错

确认是否如下图所示的 iommu pagefault 错误，如果有，请先尝试更新到最新代码测试，如果最新代码还存在该问题，请提交 remine 系统，并附上相关 log；

rockchip-vop ff8f0000.vop: [drm:vop isr] \*ERROR\* PoST BUF EMPTY irq err   

rk\_iommu ff8f3f00.iommu: Page fault at 0x00000000f0000400 of type read   

rk iommu ff8f3f00.iommu: iova = 0x00000000f0000400: dte index: 0x3c0 pte index: 0x0   

rk\_iommu ff8f3f00.iommu: mmu\_dte\_addr: 0x00000000f1692000 dte@0x00000000f1692f00: 0x   

1: ē page@0x0000000000000000 flags: 0x0   

0x00000000: 00000000 03058896 20805800 0003d000   

0x00000010: 0000000f 0800780c 00000000 00711c08   

0x00000020: ed000000 00000000 00000000 00000000   

0x00000030: 3a001085 00400000 00000000 01400147   

0x00000040: 00082000 00000000 0101028d 0101028d

3. Logic 电压太低

Logic 电压太低会导致 VOP 异常，可以尝试提高 100mv 测试；

4. AFBDC/IFBDC 对齐要求

对于 PX30/RK3326、RK3368、RK3399、RK356X、RK3588 平台如果屏的分辨率非 16pixel 对齐可以尝试关闭 afbdc/ifbdc 功能，修改方法参考文档《FAQ-DRM-HWC》 1.3.1 章节。

10. 2显示效果调节

VOP 内部的 BCSH 模块支持 亮度、对比度、饱和度、色度的调节，可以通过 modetest 配置 connector 下的对应属性调节，对于 android 系统，有实现了基于安卓系统的属性配置默认值是 50，N 每次+1。

android 9.0 之前使用命令：

setprop persist.sys.brightness.main val   

setprop persist.sys.contrast.main val   

setprop persist.sys.saturation.main val   

setprop persist.sys.hue.main val   

setprop sys.display.timeline N+1

android 9.0 及之后使用命令：

setprop persist.vendor.brightness.main val   

setprop persist.vendor.contrast.main val   

setprop persist.vendor.saturation.main val   

setprop persist.vendor.hue.main val   

setprop vendor.display.timeline N+1

从 Android 11 开始 SDK 有集成了整套显示效果调节工具和文档，可以参考 Android SDK 中的以下文档说明：

RKDocs/common/display/Rockchip\_Introduction\_DisplayAdjust\_APK\_CN.pdf

10. 3屏无法点亮/休眠唤醒显示异常/不显示问题

按以下几个方面做进一步确认：

1. 确认是否有背光；

2. 确认屏的相关电源及复位控制是否正常；

3. 确认上下电时序是否满足屏的 spec 要求；

### 10.4 RK3308/RV1106/RV1103 如何打开显示功能

由于 RK3308/RV1106/RV1103 轻量化的设计理念，支持的内存较小，所以默认不支持显示功能。如果需要开显示，需要做以下配置：

1. U-Boot 修改

RK3308 U-Boot RGB/MCU 接口显示参考配置 rk3308-display.config：

```batch
make rk3308_defconfig rk3308-display.config && ./make.sh
```

RV1106/RV1103 U-Boot RGB/MCU 接口显示参考配置 rv1106-display.config：

```batch
make rv1106_defconfig rv1106-display.config && ./make.sh
```

2. kernel 修改

RK3308 VOP 不支持 IOMMU，所以分配内存需要从预留的 cma buffer 分配，默认 CMA\_SIZE 为 16M，如果出现分配内存失败，可以参考如下方法修改 CMA\_SIZE：

```diff
@@ -784,7 +786,12 @@ CONFIG_ARCH_SUPPORTS_MEMORY_FAILURE=y
# CONFIG_MEMORY_FAILURE is not set
# CONFIG_TRANSPARENT_HUGEPAGE is not set
# CONFIG_CLEANCACHE is not set
-# CONFIG_CMA is not set
+CONFIG_CMA=y
+# CONFIG_CMA_INACTIVE is not set
+# CONFIG_CMA_DEBUG is not set
+# CONFIG_CMA_DEBUGFS is not set
+# CONFIG_CMA_SYSFS is not set
+CONFIG_CMA_AREAS=7
# CONFIG_ZPOOL is not set
# CONFIG_ZBUD is not set
# CONFIG_ZSMALLOC is not set
@@ -4917,6 +4925,18 @@ CONFIG_DMA_NONCOHERENT_MMAP=y
CONFIG_DMA_COHERENT_POOL=y
CONFIG_DMA_REMAP=y
CONFIG_DMA_DIRECT_REMAP=y
+CONFIG_DMA_CMA=y
+# CONFIG_DMA_PERNUMA_CMA is not set
+
+#
+# Default contiguous memory area size:
+#
+CONFIG_CMA_SIZE_MBYTES=32
+CONFIG_CMA_SIZE_SEL_MBYTES=y
+# CONFIG_CMA_SIZE_SEL_PERCENTAGE is not set
+# CONFIG_CMA_SIZE_SEL_MIN is not set
+# CONFIG_CMA_SIZE_SEL_MAX is not set
+CONFIG_CMA_ALIGNMENT=8
# CONFIG_DMA_API_DEBUG is not set
CONFIG_SGL_ALLOC=y
CONFIG_CPU_RMAP=y
```

RK3308 kernel RGB 转 MIPI 显示（bridge 芯片 RK618）参考配置 rk3308bs\_mipi\_display.config：

```batch
make ARCH=arm64 rk3308_linux_defconfig rk3308bs_mipi_display.config
```

RV1106/RV1103 kernel RGB/MCU 接口显示参考配置 rv1106-evb.config：

make ARCH=arm rv1106_defconfig rv1106-evb.config

### 10.5 关闭 iommu 的方法

关闭 vop iommu 后通过 DRM 申请的内存会从 CMA 内存分配，系统默认 CMA 内存大小 16M，需要根据场景需求调整到对应的大小，否则会出现分配内存失败。



10. 6各种接口应用参考文档

《Rockchip\_DRM\_Panel\_Porting\_Guide.pdf》

《RK3588\_MIPI\_DSI2\_Developer\_Guide\_CN.pdf》。

### 10.7 RGB/MCU 屏帧率计算问题

已知：

htotal = hactive + hback-porch + hfront-porch + hsync-len   

vtotal = vactive + vback-porch + vfront-porch + vsync-len

N 是每一个像素需要 N 个 cycly 发送完：


| bus_format | 一个 Pixel 要 N 个 Cycle 发送 |
| --- | --- |
| MEDIA_BUS_FMT_RGB888_1X24 |  |
| MEDIA_BUS_FMT_RGB666_1X18 MEDIA_BUS_FMT_RGB565_1X16 | 1 |
|  |  |
| MEDIA BUS FMT RGB888 3X8 MEDIA_BUS_FMT_RGB888_DUMMY_4X8 | 3 4 |

根据以上信息，可以计算帧率：


| 接口类型 | 帧率计算 |
| --- | --- |
| RGB | fps = dclk / (htotal x vtotal x N) |
| MCU | fps = dclk / (htotal x vtotal x (mcu-pix-total + 1) x N) |

10. 8如何编写第三方转换芯片驱动

有些第三方转换芯片需要软件驱动的，这个时候我们需要借助 DRM 框架 bridge 接口向框架注册 connector，比如 RGB2HDMI 的 SII902X 为例，此时 rockchip\_rgb.c 充当 encoder 角色，sii902x.c 充当 connector 角色，具体可以参考 SII902X 驱动的实现：

drivers/gpu/drm/bridge/sii902x.c

### 10.9 RK3588 DSC 支持几个 slice，slice width 最大支持多少

RK3588 有 2 个 DSC，HDMI0 和 DSI0 使用 DSC0(DSC\_8K)，可以支持的 slice 数量是： 1、2、4、8 ， 对应的 slice width 是 xres / 1、xres /2、xres / 4、xres / 8， DSC\_8K 最大可以支持的宽是 7680，所以最大的 slice\_width 也是 7680； HDMI1 和 DSI1 使用 DSC1(DSC\_4K)，可以支持的 slice 数量是：1、2，对应的 slice width 是 xres / 1、xres / 2，DSC\_4K 最大可以支持的宽是 4096，所以最大的 slice\_width 也是 4096。

### 10.10 超过 4kP60 对 aclk 的要求

对于类似 RK3588 这种支持的分辨率超过 4KP60 的【如 4KP120, 8KP30, 8KP60 等分辨率】，默认的 500M aclk 无法满足这些分辨率的需求，所以需要在 DTS 中设置 aclk 频率为 800M，否则会出现 VOP 性能不够导致的显示横条纹问题，修改方法如下：

```dts
&vop {
assigned-clocks = <&cru ACLK_VOP>;
assigned-clock-rates = <800000000>;
};
```

### 10.11 RK3588 VOP DCLK 分配策略

#### 10.11.1 RK3588 DCLK 概述

RK3588 有 4 个 Video Port, 每个 Video Port 的 dclk tree 如下图所示：





对于 dclk\_vp0/1/2， 可以指定 hdmi\_phy0\_pll, hdmi\_phy1\_pll, dclk\_vpx\_src0/1/2 中的一个作为其 parent clock, 对 dclk\_vpx\_src0/1/2，可以指定V0PLL, CPLL, GPLL, AUPLL 中的一个作为其 parent clock。

对于 dclk\_vp3, 可以指定 V0PLL, CPLL, GPLL, AUPLL 中的一个作为其 parent clock。

V0PLL, CPLL, GPLL, AUPLL 为系统 CRU 上的 PLL，hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 为 HDMI PHY 上的 PLL

VOPLL 的特点如下：

1. VOP 独占 PLL

2. 支持任意频率

3. dts 中默认与 dclk\_vp2 绑定，代码如：

```
vp2: port@2 {
assigned-clocks = <&cru DCLK_VOP2_SRC>;
assigned-clock-parents = <&cru PLL_V0PLL>;
}

CPLL, GPLL, AUPLL 的特点如下：
```

1. 与其它 IP 模块共享 PLL

2. 不支持任意分频，输出频率为 PLL 频率的整数分频

3. dclk\_vp0/1/3 默认与 GPLL 绑定

各个 Video Port 的默认 parent clock 的绑定关系如下：



hdmi\_phy0\_pll, hdmi\_phy1\_pll 的特点如下：

1. 支持任意分频

2. HDMI 不工作时 VOP 独占 PLL，HDMI 工作时与 HDMI PHY 共享 PLL

3. HDMI 和 EDP 共用 PHY，EDP 工作时，PHY 上的 PLL 无法被 VOP 使用

hdmi\_phy1\_pll, hdmi\_phy1\_pll 的第 2, 3 个特点导致使用时有一些限制，举例说明如下：

1. 当 HDMI0 工作时，且 Video Port0 绑定到 HDMI0，各 Video Port 可以使用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的场景(绑定到 Video Port1/2时类似)


| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | DCLK &lt;= 600MHz, 可用; DCLK &gt; 600MHz, 不可用 | 不可用 | 不可用 |
| hdmi_phy1_pll | 可用 | 可用 | 可用 |

2. 当 HDMI1 工作时，且 Video Port0 绑定到 HDMI1，各 Video Port 可以使用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的场景(绑定到 Video Port1/2时类似)


| HDMI PHY PLL | VP0 DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | 可用 | 可用 | 可用 |
| hdmi_phy1_pll | DCLK &lt;= 600MHz, 可用 DCLK &gt; 600MHz, 不可用 | 不可用 | 不可用 |

3. 当 HDMI0 和 HDMI1 同时工作时，且都绑定到 Video Port0 时， Video Port 可以使用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的场景(绑定到Video Port1/2 时类似)


| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | DCLK &lt;= 600MHz, 可用; DCLK &gt; 600MHz, 不可用 | 不可用 | 不可用 |
| hdmi_phy1_pll | DCLK &lt;= 600MHz, 可用; DCLK &gt; 600MHz, 不可用 | 不可用 | 不可用 |

4. 当 EDP0 工作时，且 Video Port0 绑定到 EDP0，各 Video Port 可以使用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的场景(绑定到 Video Port1/2 时类似)


| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | 不可用 | 不可用 | 不可用 |
| hdmi_phy1_pll | 可用 | 可用 | 可用 |

5. 当 EDP1 工作时，且 Video Port0 绑定到 EDP1，各 Video Port 可以使用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的场景(绑定到 Video Port1/2 时类似)


| HDMI PHY PLL | VP0 DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | 可用 | 可用 | 可用 |
| hdmi_phy1_pll | 不可用 | 不可用 | 不可用 |

6. 当 EDP0 和 EDP1 同时工作时，且都绑定到 Video Port0 时， Video Port 可以使用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的场景(绑定到 VideoPort1/2 时类似)


| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | 不可用 | 不可用 | 不可用 |
| hdmi_phy1_pll | 不可用 | 不可用 | 不可用 |

由于 CPLL，GPLL，AUPLL 作为 Video Port dclk 源时，无法实现任意分频。当需要准确分频时，且满足使用的限制条件时，可以使用hdmi\_phy0\_pll 或 hdmi\_phy1\_pll 作为 Video Port dclk 的 parent clock。分配 Video Port dclk parent 有两种方式，分别是静态分配和动态分配。

#### 10.11.2 RK3588 VOP DCLK 静态分配策略

静态分配即通过在 dtsi 中绑定 Video Port dclk parent 的方式, 在 dtsi 中配置好绑定关系后，就不再发生变更。

```dts
&hdptxphy_hdmi0 {
status = "okay";
};
&hdptxphy_hdmi1 {
status = "okay";
};
&hdptxphy_hdmi_clk0 {
status = "okay";
};
&hdptxphy_hdmi_clk1 {
status = "okay";
};
&vp0 {
assigned-clocks = <&cru DCLK_VOP0>;
assigned-clock-parents = <&hdptxphy_hdmi_clk0>;
};
&vp1 {
assigned-clocks = <&cru DCLK_VOP1>;
assigned-clock-parents = <&hdptxphy_hdmi_clk1>;
};
```

如上，即绑定 dclk\_vp0 的 parent clock 为 hdmi\_phy0\_pll, dclk\_vp1 的 parent clock 为 hdmi\_phy1\_pll 。

通过 clock tree，可以确认配置是否生效，如下：

rk3588\_s:/ # cat /sys/kernel/debug/clk/clk\_summary grep "hdmiphy" -A 1   

clk\_hdmiphy\_pixel1 0 1 0 0 0 0 50000   

dclk\_vop1 0 3 0 0 0 0 50000   

clk\_hdmiphy\_pixel0 1 1 0 148500000 0 0 50000   

dclk\_vop0 2 5 0 148500000 0 0 50000

如上，parent clock 绑定生效，并且当前 dclk\_vp0 设置的 clock rate 为 148.5MHz，这里的 clock rate 与 log 打印中获取的 clock rate 是一样的。如下 log 中的最后一行 set dclk\_vop0 to 148500000, get 148500000 即设置 148.5MHz, 实际输出的也是 148.5MHz, 与从 clk tree 上获取的相同。

[ 270.974623][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] Update mode to 1920x1080p60,   

type: 11(if:800) for vp0 dclk: 148500000   

[ 270.974837][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] dclk\_out0 div: 0 dclk\_core0   

div: 2   

[ 270.974891][ T381] rockchip-hdptx-phy-hdmi fed60000.hdmiphy: hdptx\_ropll\_cmn\_config bus\_width:16a8c8   

rate:1485000   

[ 270.975264][ T381] rockchip-hdptx-phy-hdmi fed60000.hdmiphy: hdptx phy pll locked!   

[ 270.975304][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] set dclk\_vop0 to 148500000,   

get 148500000

结合之前的 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 的使用限制描述，静态分配时建议如下：

1. 连接到 HDMI 的 Video Port 的 parent clock 优先指定为 hdmi\_phy0\_pll 或 hdmi\_phy1\_pll；  

2. HDMI 不工作时，HDMI PHY 上的 PLL 可以任意配置给 dclk\_vp0/1/2 作为 parent clock。

动态绑定的方式如下：

```hcl
&hdptxphy_hdmi0 {
status = "okay";
};
&hdptxphy_hdmi1 {
status = "okay";
};
&hdptxphy_hdmi_clk0 {
status = "okay";
};
&hdptxphy_hdmi_clk1 {
status = "okay";
};
&display_subsystem {
clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;
clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
```

由于可任意分频的 PLL 源有限，并且 HDMI PHY 上的 PLL 使用还有一定的限制，因此动态分配的策略比较复杂，同时，动态分配的策略对业务场景有一定的限制。

每次使能一个 Video Port 时，都会按照如下的策略进行动态的 Video Port dclk 的绑定：

1. HDMI0 和 HDMI1 (可能也包含 DP 或 MIPI 挂在同一个 Video Port 下) 接到同一个 Video Port(0/1/2)并且 dclk 在 600MHz 以下:

1.1 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 均未被其他 Video Port 使用时，使用 hdmi\_phy0\_pll 为当前 Video Port dclk 的 parent clock , 并且hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 不可被其他的 Video Port 使用;

1.2 hdmi\_phy0\_pll 或 hdmi\_phy0\_pll 被其他 Video Port 使用时，则报错；

2. HDMI0 (可能也包含 DP 或 MIPI 挂在同一个 Video Port 下) 接到一个 Video Port(0/1/2)，下面称 VP\_A，并且 dclk 在 600MHz 以下:

2.1 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 均存在时，且 hdmi\_phy0\_pll 未被其他 Video Port 使用时，VP\_A 使用 hdmi\_phy0\_pll ，同时hdmi\_phy0\_pll 不可被其他的 Video Port 使用;

2.2 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 均存在时，且 hdmi\_phy0\_pll 正在被其他的 Video Port(VP\_B) 使用时, hdmi\_phy1\_pll 空闲时，VP\_B要把 hdmi\_phy0\_pll 的 pll 让出来，去使用 hdmi\_phy1\_pll ，VP\_A 使用 hdmi\_phy0\_pll ;

2.3 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll 均存在且均被其他的 Video Port 使用时, 报错；

2.4 只有配置 hdmi\_phy0\_pll 且 未被其他 Video Port 使用时， VP\_A 使用 hdmi\_phy0\_pll;

2.5 只有配置 hdmi\_phy0\_pll 且 被其他 Video Port 使用时，报错;

3. HDMI1 (可能也包含 DP 或 MIPI 挂在同一个 Video Port 下) 接到一个 Video Port(0/1/2) 并且 dclk 在 600MHz 以下时，策略和 2 类似，不再详细描述；

4. 只有 DP接到一个 Video Port(0/1/2) 时:

4.1 Video Port 为 Video Port2 时, 使用默认配置的 dclk parent clock;

4.2 hdmi\_phy0\_pll 或 hdmi\_phy1\_pll 未被其他 Video Port 使用时，优先使用 hdmi\_phy0\_pll 或 hdmi phy1\_pll，否则使用默认配置的 dclkparent clock;

如果要求的 dclk 大于 4k@60Hz, 使用默认的 pll。

根据动态配置策略，为尽可能多的利用 hdmi\_phy0\_pll 和 hdmi\_phy1\_pll , 实际使用时有如下建议：

1. HDMI0 和 HDMI1 尽量不要挂在 Video Port2 上；

2. HDMI0 和 HDMI1 尽量不要挂在同一个Video Port上。

对于一些应用场景，可以给出如下的建议 Video Port 和显示接口的配置：

2 个 HDMI 接口和 1 个 DP 接口输出时：


| Video Port | 接口配置1 | 接口配置2 |
| --- | --- | --- |
| Video Port0 | HDMI0 | HDMI1 |
| Video Port1 | HDMI1 | HDMIO |
| Video Port2 | DP0/DP1 | DP0/DP1 |

2 个 DP 接口和 1 个 HDMI 接口输出时:


| Video Port | 接口配置1 | 搭配方案2 | 接口配置1 | 接口配置2 |
| --- | --- | --- | --- | --- |
| Video Port0 | HDMI0/1 | HDMI0/1 | DP0 | DP1 |
| Video Port1 | DP0 | DP1 | HDMI0/1 | HDMI0/1 |
| Video Port2 | DP1 | DPO | DP1 | DP0 |

更多的应用场景，需要参考动态分配策略进行合理的配置。

动态分配策略可能会出现 HDMI PHY PLL 都被占用的情况，这个时候 log 中会打印 HDMI PHY PLL 的占用信息：

[ 220.692900][ T383] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] Update mode to 1920x1080p60,   

type: 11(if:1000) for vp1 dclk: 148500000   

[ 220.693048][ T383] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] dclk\_out1 div: 0 dclk\_core1   

div: 2   

[ 220.693094][ T383] [drm:vop2\_clk\_set\_parent\_extend.isra.61] \*ERROR\* hdmi1 phy pll is used by vp0:vp2

如上，即 hdmi\_phy0\_pll 已经被 Video Port0 占用，hdmi\_phy1\_pll 已经被 Video Port2 占用。

当只配置一个 HDMI PHY PLL 时，例如

```hcl
&display_subsystem {
clocks = <&hdptxphy_hdmi_clk0>;
clock-names = "hdmi0_phy_pll";
};
```

当出现如下 log 时，即说明 hdmi\_phy0\_pll 已经被 Video Port2 占用。

[ 35.059306][ T386] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] Update mode to 1920x1080p60,   

type: 11(if:800) for vp0 dclk: 148500000   

[ 35.059416][ T386] rockchip-vop2 fdd90000.vop: [drm:vop2\_crtc\_atomic\_enable] dclk\_out0 div: 0 dclk\_core0   

div: 2   

[ 35.059447][ T386] [drm:vop2\_clk\_set\_parent\_extend.isra.61] \*ERROR\* hdmi0: phy pll is used by vp2

### 10.12 如何默认开启显示 mirror 功能

有些项目，由于模具和屏幕方向不一致，可能希望软件上默认就能对显示内容做镜像。

默认 Y 方向镜像显示是不支持的。

默认 X 方向镜像显示仅 VOP V2.0 及以上版本支持（详见《各平台 VOP 基础特性》章节），配置方法示例如下：

```dts
&vp1 {
xmirror-enable;
};
```

### 10.13 如何支持 4K 分辨率 logo 显示功能

各平台的 defconfig 是无法支持 4K logo 图片正常显示的，串口会有类似下述 log：

bmp[logo.bmp] size[23MB] is over the limitation MAX\_IMAGE\_BYTES[8MB]   

failed to display uboot logo   

CLK: (uboot. arm: enter 1008000 KHz, init 1008000 KHz, kernel 0N/A)   

bpll 816000 KHz   

lpll 816000 KHz

以 RK3576 平台为例，需要添加如下修改：

```diff
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c
index b1773ba6942..d1606db1ba5 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -52,7 +52,7 @@
#define RK_BLK_SIZE 512
#define BMP_PROCESSED_FLAG 8399
#define BYTES_PER_PIXEL sizeof(uint32_t)
-#define MAX_IMAGE_BYTES (8 * 1024 * 1024)
+#define MAX_IMAGE_BYTES (32 * 1024 * 1024)
```

```diff
DECLARE_GLOBAL_DATA_PTR;
static LIST_HEAD(rockchip_display_list);
diff --git a/include/configs/rk3576_common.h b/include/configs/rk3576_common.h
index 16abba314c5..b4a8ec3b898 100644
--- a/include/configs/rk3576_common.h
+++ b/include/configs/rk3576_common.h
@@ -22,7 +22,7 @@
#endif
#define CONFIG_SPL_LOAD_FIT_ADDRESS 0x42000000
-#define CONFIG_SYS_MALLOC_LEN (32 << 20)
+#define CONFIG_SYS_MALLOC_LEN (32 << 21)
#define CONFIG_SYS_CBSIZE 1024
#ifdef CONFIG_SUPPORT_USBPLUG
```

并且需要将配置项 CONFIG\_DRM\_MEM\_RESERVED\_SIZE\_MBYTES 修改为 64 MB。

上述修改的原因为：

出于内存占用及默认 parameter 分区表配置等方面考虑，不建议使用太大的 BMP logo 图片，所以将 MAX\_IMAGE\_BYTES 限制到 8MB，超过此大小的建议使用 BI\_RLE4/BI\_RLE8 格式 BMP 图片。

常见的 4K BI\_RGB 24bpp BMP 图片大小约为 24 MB，各平台默认的 malloc heap 大小通常为 32 MB，会出现 BMP decode 相关函数无法申请到内存问题。

为了保证 U-Boot 到 Kernel logo 显示的平滑切换，通常两张 logo 图片会是相同的分辨率和格式，这样预留给 logo 显示功能的内存区域大小（由 CONFIG\_DRM\_MEM\_RESERVED\_SIZE\_MBYTES 决定，默认为 32 MB）就不够了。

### 10.14 RV1106/RV1103 小分辨率屏无法点亮/显示异常问题

对于 RV1106 和 RV1103 平台，dclk\_vop 的时钟源可以为 GPLL 或 CPLL，两者的默认频率分别是 1188000 KHz 和 1000000 KHz，而 CRU 模块在设计上 dclk\_vop 支持的最大分频系数为 32：

### CRU CLKSEL CON23

Address: Operational Base + offset (0x035C)


| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 31:16 | RW | 0x0000 | write_enableWrite enable for lower 16 bits, each bit is individual.1&#x27;b0: Write access disable1&#x27;b1: Write access enable |
| 15:14 | RO | 0x0 | reserved |
| 13:9 | RW | 0x00 | clk_ref_pvtpll_0_divDivide clk_ref_pvtpll_0 by (div_con + 1). |
| 8 | RW | 0x0 | dclk_vop_src_seldclk_vop_src clock mux.1&#x27;b0: clk_gpll_mux1&#x27;b1: clk_cpll_mux |
| 7:3 | RW | 0x07 | dclk_vop_src_divDivide dclk_vop_src by (div_con + 1). |
| 2:0 | RO | 0x0 | reserved |

因此，dclk\_vop 在两个 PLL 下的最小频率默认为 37125 KHz 和 31250 KHz，若屏端支持分辨率的 pixel clock 小于上述频率，可能会导致无法点亮或显示异常问题。若需支持较小分辨率的显示设备（比如 pixel clock 为 27000 KHz 的分辨率 720x480p60/720x576p60），只能通过修改时钟源 GPLL 或 CPLL 的频率以降低 dclk\_vop 支持的的最小频率：

```dts
&vop {
assigned-clocks = <&cru PLL_GPLL>;
assigned-clock-rates = <594000000>;
};
```

需要注意的是：

RGB/MCU 屏通常可以支持一定区间内的 clock 频率（对应 datasheet 中说明的 MIN/TYP/MAX clock rate），如果默认 GPLL/CPLL 下dclk\_vop 的最小频率可以满足 MAX clock rate 的要求，则尽量不要去修改时钟源 GPLL/CPLL 的频率。

GPLL 和 CPLL 通常作为多个模块的时钟源，需要根据具体的应用场景，确认时钟源频率的修改是否会对 VOP 外的其他模块造成影响。

## 11. 如何更高效的定位问题

在日常开发中，如果发现了 Bug 或者 issue，科学的分析和沟通有助于问题的更快解决和收敛。对于显示相关的问题，我们建议发现问题后，开发者能做如下确认。

1. 看内核 log，或者应用层 log，是否能看到明显的异常提示

2. 如果能看到内核异常的 log 提示，根据 log 去搜索内核驱动，找到相关代码，看是根据什么判断逻辑输出这些异常 log 的。

3. 确认问题是概率的，还是必现的。

4. 如果是 HDMI、DP 这些支持多分辨率的设备，确认异常是在某个特定分辨率才会出现，还是所有分辨率都会出现，确认问题是特定显示器才会出现，还是所有显示器都会出现。

5. 如果是 HDMI，DP 兼容性相关的问题，请在控制变量的前提下找第三方设备做对比，看第三方设备在同样条件下是什么表现。

6. 如果是播放视频场景下出现的异常，确认问题是特定视频，APP 才会出现，还是任何视频，APP 都会出现。

7. 如果找不到任何方向，请确认这个异常是一直都存在还是更新特定代码或者版本后才存在，如果是后者，用二分法、控制变量法，找到更新哪个版本或者模块后，异常才出现。

## 12. 参考文档

1. Rockchip\_drm\_integration\_helper-zh.pdf

2. Rockchip\_DRM\_Panel\_Porting\_Guide.pdf

3. Rockchip\_Developer\_Guide\_HDMI\_CN.pdf

4. RK3588\_MIPI\_DSI2\_Developer\_Guide\_CN.pdf

5. Rockchip\_BT656\_TX\_AND\_BT1120\_TX\_Developer\_Guide\_CN.pdf

6. Rockchip RK3568 Datasheet.pdf

7. Rockchip rk fb development guide.pdf

8. Wikipedia for Direct\_Rendering\_Manager

9. Linux DRM Developer's Guide
