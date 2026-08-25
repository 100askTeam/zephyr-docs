---
sidebar_position: 1
---

# 瑞芯微多核异构系统开发指南

## 前言

## 概述

本文档主要指导工程师基于瑞芯微多核异构系统进行项目开发。

### 平台支持


| 芯片名称 | 处理器核心 | Linux | RTOS | Bare-metal |
| --- | --- | --- | --- | --- |
| RK3588 | 4 x ARM Cortex-A76 | Kernel 5.10 | N/A | N/A |
| RK3588 | 4 x ARM Cortex-A55 | Kernel 5.10 | RTT 3.1-32 / RTT 4.1-32 | HAL-32 |
| RK3588 | 1 x ARM Cortex-M0 | N/A | RTT 3.1 / RTT 4.1 | HAL |
| RK3576 | 4 x ARM Cortex-A72 | Kernel 6.1 | N/A | N/A |
| RK3576 | 4 x ARM Cortex-A53 | Kernel 6.1 | RTT 4.1-32 | HAL-32 |
| RK3576 | 1 x ARM Cortex-M0 | N/A | RTT 4.1 | HAL |
| RK3568 | 4 x ARM Cortex-A55 | Kernel 4.19 / Kernel 5.10 | RTT 3.1-32 | HAL-32 |
| RK3568 | 1 x RISC-V | N/A | RTT 3.1 | HAL |
| RK3562 | 4 x ARM Cortex-A53 | Kernel 5.10 | RTT 4.1-32 | HAL-32 |
| RK3562 | 1 x ARM Cortex-M0 | N/A | RTT 4.1 | HAL |
| RK3358 | 4 x ARM Cortex-A35 | N/A | RTT 3.1-32 | HAL-32 |
| RK3308 | 4 x ARM Cortex-A35 | Kernel 5.10 | RTT 3.1-32 / RTT 4.1-32 | HAL-32 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

- 软件开发工程师
- 技术支持工程师

### 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 刘诗舫、邹鸿名、王征增、郑嘉航、杨汉兴 | 2024-03-15 | 初始版本 |

## 第 1 章 多核异构系统

### 1.1 概述

#### 1.1.1 多核异构系统简介



<p className="rockchip-figure-caption">图1-1-1多核异构系统将传统平台两套系统合二为一</p>

多核异构系统也支持同一颗SoC芯片同时独立运行多个实时系统。



<p className="rockchip-figure-caption">图1-1-2同时独立运行多个实时系统</p>

多核异构系统还支持同一颗 SoC 芯片以 SMP + AMP 的方式运行。



<p className="rockchip-figure-caption">图 1-1-3 以 SMP + AMP 的方式运行</p>

多核异构系统应用于产品设计中，还具有明显的性价比优势和产品体积优势。目前已经广泛应用于电力行业、工控行业、消费电子、汽车电子等产品中。

### 1.1.2 瑞芯微多核异构系统



- Linux：提供标准的 Linux Kernel

- RTOS:提供开源的 RT-Thread

- Bare-metal：提供基于 RK HAL 硬件抽象层的裸机开发库

<p className="rockchip-figure-caption">图 1-2-1 运行平台</p>



- 支持 SoC 中同构的 ARM Cortex-A每个处理器核心独立运行

- 支持 SoC 中异构的 ARM Cortex-M 或 RISC-V 核心独立运行

<p className="rockchip-figure-caption">图 1-2-2 处理器核心</p>

目前，瑞芯微多核异构系统主要采用无监督的AMP方案。不使用虚拟化管理，从而在运行实时系统时获得更快的中断响应，以满足电力、工控等行业应用中严苛的硬实时性要求。

### 1.2 平台支持

#### 1.2.1 RK3588

##### 1.2.1.1 处理器核心


| 处理器类型 | 处理器核心 |
| --- | --- |
| AP | 4 x ARM Cortex-A76 + 4 x ARM Cortex-A55 |
| MCU | 1 x ARM Cortex-M0 |

##### 1.2.1.2 运行平台支持


| 处理器核心 | ARM Cortex-A76 | ARM Cortex-A55 | ARM Cortex-M0 |
| --- | --- | --- | --- |
| Linux 支持 | Kernel 5.10 | Kernel 5.10 | N/A |
| RTOS 支持 | N/A | RTT 3.1-32RTT 4.1-32 | RTT 3.1RTT 4.1 |
| Bare-metal 支持 | N/A | HAL-32 | HAL |

#### 1.2.2 RK3576

##### 1.2.2.1 处理器核心


| 处理器类型 | 处理器核心 |
| --- | --- |
| AP | 4 x ARM Cortex-A72 + 4 x ARM Cortex-A53 |
| MCU | 1 x ARM Cortex-M0 |

##### 1.2.2.2 运行平台支持


| 处理器核心 | ARM Cortex-A72 | ARM Cortex-A53 | ARM Cortex-M0 |
| --- | --- | --- | --- |
| Linux 支持 | Kernel 6.1 | Kernel 6.1 | N/A |
| RTOS 支持 | N/A | RTT 4.1-32 | RTT 4.1 |
| Bare-metal 支持 | N/A | HAL-32 | HAL |

#### 1.2.3 RK3568

##### 1.2.3.1 处理器核心


| 处理器类型 | 处理器核心 |
| --- | --- |
| AP | 4 x ARM Cortex-A55 |
| MCU | 1 x RISC-V |

##### 1.2.3.2 运行平台支持


| 处理器核心 | ARM Cortex-A55 | RISC-V |
| --- | --- | --- |
| Linux 支持 | Kernel 4.19Kernel 5.10 | N/A |
| RTOS 支持 | RTT 3.1-32 | RTT 3.1 |
| Bare-metal 支持 | HAL-32 | HAL |

#### 1.2.4 RK3562

##### 1.2.4.1 处理器核心


| 处理器类型 | 处理器核心 |
| --- | --- |
| AP | 4 x ARM Cortex-A53 |
| MCU | 1 x ARM Cortex-M0 |

##### 1.2.4.2 运行平台支持


| 处理器核心 | ARM Cortex-A53 | ARM Cortex-M0 |
| --- | --- | --- |
| Linux 支持 | Kernel 5.10 | N/A |
| RTOS 支持 | RTT 4.1-32 | RTT 4.1 |
| Bare-metal 支持 | HAL-32 | HAL |

#### 1.2.5 RK3358

##### 1.2.5.1 处理器核心


| 处理器类型 | 处理器核心 |
| --- | --- |
| AP | 4 x ARM Cortex-A35 |

##### 1.2.5.2 运行平台支持


| 处理器核心 | ARM Cortex-A35 |
| --- | --- |
| Linux 支持 | N/A |
| RTOS 支持 | RTT 3.1-32 |
| Bare-metal 支持 | HAL-32 |

#### 1.2.6 RK3308

##### 1.2.6.1 处理器核心


| 处理器类型 | 处理器核心 |
| --- | --- |
| AP | 4 x ARM Cortex-A35 |

##### 1.2.6.2 运行平台支持


| 处理器核心 | ARM Cortex-A35 |
| --- | --- |
| Linux 支持 | Kernel 5.10 |
| RTOS 支持 | RTT 3.1-32RTT 4.1-32 |
| Bare-metal 支持 | HAL-32 |

### 1.3 产品案例介绍

#### 1.3.1 AP + AP案例：电力继电保护装置



<p className="rockchip-figure-caption">图 3-1-1 AP + AP 案例：电力继电保护装置</p>

并且，得益于AP的高性能特性，在用于实时系统处理任务时，也能获得运行更高效、算力更强劲的使用体验。

#### 1.3.2 AP + MCU 案例：扫地机器人



<p className="rockchip-figure-caption">图 3-2-1 AP + MCU 案例：扫地机器人</p>

并且，使用 SoC内部的这颗MCU作为实时处理器或协处理器，也能让Linux系统获得更完整的性能释放。

## 第 2 章 AMP SDK

### 2.1 目录结构

瑞芯微多核异构系统提供的 AMP SDK源码结构如下。注释中标记\*的部分为AMP SDK主要目录。

— app # Linux 系统用户界面示例  

— buildroot # Buildroot 系统编译目录  

— debian # Debian 系统编译目录  

— device # \* AMP SDK 编译脚本和配置文件  

docs # \* AMP SDK 文档  

external # Buildroot 系统补充应用  

hal # \* Bare-metal 系统编译目录  

kernel-\* # \* 不同版本的 Linux Kernel 编译目录  

prebuilts # \* 预置的编译工具链  

rkbin # \* AMP SDK 使用的二进制文件  

— rtos #\* RTOS 系统编译目录  

tools # AMP SDK 使用的工具集  

u-boot # \* U-Boot 编译目录  

— uefi # uefi 编译目录  

yocto # yocto 系统编译目录

### 2.2 device 目录

device 目录存放AMP SDK的编译脚本和默认配置。以RK3562为例，主要文件包括：

device/rockchip  

- common  

build.sh # AMP SDK 统一编译脚本  

scripts  

mk-amp.sh # RTOS / Bare-metal 统一编译脚本  

rk3562  

amp.its # RTOS + Bare-metal 固件打包配置文件  

amp\_linux.its # Linux + RTOS / Bare-metal 固件打包配置文件  

amp\_mcu.its # Linux + RTOS / Bare-metal MCU 固件打包配置  

文件  

rockchip rk3562 xxx defconfig # 板级编译配置文件

### 相关章节：

### 第3章编译配置

### 2.3 kernel 目录

kernel 目录存放 Linux 系统源码。AMP SDK 提供标准的 Linux Kernel。

各芯片平台支持情况如下：


| 芯片名称 | Kernel 4.19 | Kernel 5.10 | Kernel 6.1 |
| --- | --- | --- | --- |
| RK3588 |  | √ |  |
| RK3576 |  |  | √ |
| RK3568 | √ | √ |  |
| RK3562 |  | √ |  |
| RK3308 |  | √ |  |

以RK3562为例，主要文件包括：

kernel  

arch/arm64/boot/dts/rockchip  

rk3562-amp.dtsi # AMP dtsi 文件  

rk3562-xxx-amp.dts # AMP dts 板级配置文件  

drivers  

— mailbox # Mailbox 核间通信方案  

— rpmsg # RPMsg 核间通信方案  

soc/rockchip  

一 rockchip\_amp.c #资源划分、从核生命周期管理等  

include

对于 Linux + RTOS / Bare-metal 的运行方式，运行 Linux系统的核心必须作为主核心（Master Core），负责整个多核异构系统的资源划分和从核心（Remote Core）管理。

相关章节：

第3章编译配置

第4章资源划分

第5章启动方案

第6章通信方案

### 2.4 hal 目录

hal 目录存放 Bare-metal 系统源码。AMP SDK 提供基于 RK HAL 硬件抽象层的裸机开发库。

各芯片平台支持情况如下：


| 芯片名称 | AP HAL-32 | MCU HAL |
| --- | --- | --- |
| RK3588 | √ | √ |
| RK3576 | √ | √ |
| RK3568 | √ | √ |
| RK3562 | √ | √ |
| RK3358 | √ | N/A |
| RK3308 | √ | N/A |

以RK3562为例，主要文件包括：

doc  

Rockchip User Guide HAL CN.md # RK HAL 开发文档  

lib  

bsp #板级支持配置文件  

CMSIS # ARM 微控制器软件接口标准库  

Core # MCU 相关文件  

Core\_A # AP 32位相关文件  

Core\_A\_64 # AP 64位相关文件  

Device/RK3562  

Include  

rk3562.h # RK3562 寄存器定义  

soc.h # RK3562 芯片相关定义  

system rk3562.h  

Source/Templates  

GCC # 使用 GCC 交叉编译工具链  

gcc\_arm.ld #链接脚本示例  

start m0.S # MCU 启动文件  

startup rk3562.c # AP 启动文件  

mmu rk3562.c # AP MMU Map 配置文件  

system rk3562.c  

system\_rk3562\_mcu.c  

DSP # DSP 相关文件  

RISCV # RISC-V 相关文件  

hal  

inc #模块驱动头文件  

src #模块驱动文件  

middleware # Bare-metal 系统中间件  

benchmark #性能测试  

rpmsg-lite # RPMsg 核间通信方案  

simple\_console # Console  

project # Bare-metal 系统工程示例  

common  

GCC  

Cortex-A.mk # AP 通用编译文件  

Cortex-M.mk # MCU 通用编译文件  

riscv.mk # RISC-V 通用编译文件  

rk3562  

GCC  

build.sh # AP 编译脚本  

gcc arm.ld.s # AP 链接脚本  

Makefile # AP 编译文件

Image  

amp.img #打包后的 Bare-metal 系统固件  

amp.its # RTOS + Bare-metal 固件打包配置文件  

amp\_linux.its # Linux + RTOS / Bare-metal 固件打包配置文  

件  

halx.bin  

halx.elf  

parameter.txt #分区表配置文件  

mkimage.sh # AP 固件打包脚本  

src  

hal\_conf.h # RK HAL 配置文件  

— main.c # Bare-metal 系统示例  

test demo.c # Bare-metal 系统模块与功能示例  

rk3562-mcu  

GCC  

— gcc\_bus\_m0.1d # MCU 链接脚本  

Makefile # MCU 编译文件  

Image  

— amp.img #打包后的 Bare-metal 系统固件  

amp\_mcu.its # Linux + RTOS / Bare-metal MCU 固件打包  

配置文件  

mcu.bin  

mcu.elf  

parameter.txt #分区表配置文件  

mkimage.sh # MCU 固件打包脚本  

src  

— hal\_conf.h # RK HAL 配置文件  

— main.c # Bare-metal 系统示例  

test\_demo.c # Bare-metal 系统模块与功能示例  

test # Bare-metal 系统模块测试文件  

tools # Bare-metal 系统工具集

相关章节：

第3章编译配置

第4章资源划分

第5章启动方案

第6章通信方案

### 2.5 rtos 目录

rtos 目录存放 RTOS 系统源码。AMP SDK 提供开源的 RT-Thread。

瑞芯微多核异构系统中提供的 RT-Thread基于 RK HAL 进行适配。RK HAL 文件在

各芯片平台支持情况如下：


| 芯片名称 | AP RTT 3.1-32 | AP RTT 4.1-32 | MCU RTT 3.1 | MCU RTT 4.1 |
| --- | --- | --- | --- | --- |
| RK3588 | √ | √ | √ | √ |
| RK3576 |  | √ |  | √ |
| RK3568 | √ |  | √ |  |
| RK3562 |  | √ |  | √ |
| RK3358 | √ |  | N/A | N/A |
| RK3308 | √ | √ | N/A | N/A |

以 RK3562 为例，RT-Thread V4.1 主要文件包括：

— applications #公共的应用文件  

bsp/rockchip #板级支持包  

common #公共的模块与功能相关文件  

drivers # RTOS Device Driver 文件  

fwmgr #固件管理相关文件  

— hal # RK HAL 文件  

test #模块与功能测试文件  

rk3562-32 # RK3562 AP 32位  

— applications #应用文件  

- board #板级配置文件  

driver #驱动文件  

Image  

— amp.img # 打包后的 RTOS / Bare-metal 固件  

amp.its # RTOS + Bare-metal 固件打包配置文件  

amp\_linux.its # Linux + RTOS / Bare-metal 固件打包配置文  

rttx.bin  

rttx.elf  

parameter.txt #分区表配置文件  

smp.its # RTOS SMP 固件打包配置文件  

test #测试文件  

build.sh # AP 编译脚本  

gcc arm.ld.s # AP 链接脚本  

hal\_conf.h # RK HAL 配置文件  

- Kconfig  

mkimage.sh # AP 固件打包脚本  

rtconfig.h  

- rtconfig.py  

SConscript  

SConstruct  

rk3562-mcu # RK3562 MCU  

applications #应用文件  

board #板级配置文件  

driver #驱动文件  

Image  

amp.img #打包后的 RTOS 系统固件  

amp mcu.its # Linux + RTOS / Bare-metal MCU 固件打包  

配置文件  

mcu.bin  

mcu.elf  

gcc\_arm.ld.S # MCU 链接脚本

hal\_conf.h # RK HAL 配置文件  

Kconfig  

mkimage.sh # MCU 固件打包脚本  

rtconfig.h  

rtconfig.py  

SConscript  

SConstruct  

tools #工具集  

components  

examples  

include  

libcpu  

— src  

third\_party  

tools

相关章节：

第4章资源划分

第5章启动方案

第6章通信方案

### 2.6 u-boot 目录

u-boot 目录存放 U-Boot 源码。AMP SDK 需要增加 rk-amp.config 打开如下配置：

CONFIG\_AMP=y   

CONFIG\_ROCKCHIP\_AMP=Y

以 RK3562为例，AMP SDK相关的主要文件包括：

arch/arm/mach-rockchip/rk3562/rk3562.c   

drivers/cpu/rockchip\_amp.c   

include/configs/rk3562\_common.h

相关章节：

第3章编译配置

第5章启动方案

### 2.7 rkbin 目录

rkbin 目录存放 AMP SDK 使用的二进制文件，需要与 u-boot 目录配合使用。

以 RK3562 为例，AMP SDK相关的主要文件包括：

bin/rk35/rk3562\_bl31\_xxx.elf

bin/rk35/rk3562\_bl31\_cpu3\_xxx.elf

\# 通用 b131 文件

\# 前级运行在 CPU3 的 b131 文件

RKTRUST/RK3562TRUST.ini

RKTRUST/RK3562TRUST\_CPU3.ini

#通用配置文件

\# 前级运行在 CPU3 的配置文件

相关章节：

第3章编译配置

第5章启动方案

## 第 3 章 编译配置

### 3.1 配置文件

在编译AMP SDK前，请先选择并修改相关配置文件。

#### 3.1.1 统一编译配置文件

RK AMP=y # AMP RTOS / Bare-metal 支持  

RK AMP ARCH="arm" # RTOS / Bare-metal 使用32位  

# 64位使用 "arm64"  

RK AMP HAL TARGET="rk3562" # AP Bare-metal 对应的工程目录名  

RK AMP RTT TARGET="rk3562-32" # AP RTOS 对应的工程目录名  

RK AMP MCU HAL TARGET="rk3562-mcu" # MCU Bare-metal 对应的工程目录名  

RK AMP MCU RTT TARGET="rk3562-mcu" # MCU RTOS 对应的工程目录名  

RK AMP CFG is not set #辅助配置文件  

RK\_AMP\_FIT\_ITS="amp\_linux.its" # AMP 固件打包配置文件  

RK UBOOT CFG FRAGMENTS="rk-amp" # 增加 AMP U-Boot config 配置文件  

RK UBOOT TRUST INI is not set #使用特殊 rkbin 时需要指定的配置文  

件  

RK PARAMETER="parameter.txt" #分区表配置文件

AMP SDK配置建议使用 make menuconfig的方式，这种方式可以自动整理编译宏之间的依赖关系，避免生成无效编译配置。

--- AMP (Asymmetric Multi-Processing System)   

arch (arm) ---&gt;   

(rk3562) HAL target   

(\$&#123;RK\_CHIP\_FAMILY&#125;-32) RT-Thread target   

(\$&#123;RK\_CHIP\_FAMILY&#125;-mcu) MCU HAL target   

(\$&#123;RK\_CHIP\_FAMILY&#125;-mcu) MCU RT-Thread target   

config file   

(amp.its) FIT ITS file

#### 3.1.2 AMP 固件打包配置文件

amp linux.its ： Linux + RTOS /Bare-metal 混合部署方案。  

amp.its：RTOS + Bare-metal 混合部署方案。  

amp\_mcu.its：Linux + MCU RTOS / Bare-metal 混合部署方案。

##### 3.1.2.1 amp\_linux.its

Linux + RTOS / Bare-metal 混合部署方案。以下示例为 RK3562 CPU3 独立运行 RTOS，其余处理器核心运行 Linux SMP。

/dts-v1/;  

```
/{
description = "FIT source file for rockchip AMP";
#address-cells = <1>;
images {
```

# amp3 节点配置 CPU3，其它处理器核心类似。  

```
amp3 {
description = "rtt-core3"; #固件描述信息
data = /incbin/("rtt3.bin")；#指定待打包的固件位置（带路径）
type = "firmware"; # AP 设置为 firmware
compression = "none"; #保持默认 none
arch = "arm"; #指定处理器的架构
cpu = <0x3>; #指定处理器的硬件ID
thumb = <0>; #指定处理器的指令集
hyp = <0>; # 指定处理器是否运行 Hypervisior
load = <0x01800000>; #指定固件加载和运行地址
compile { #编译时的配置，编译后自动清除
size = <0x00800000>; #运行内存大小
sys = "rtt"; # RTOS (rtt) or Bare-metal (hal)
core = "ap"; # 处理器核心类型：ap or mcu
rtt_config= "board/rk3562_evb1_lp4x/amp_defconfig"
};
udelay = <10000>; #启动下一个处理器核心的延时
hash {
algo = "sha256"; #指定固件完整性校验的算法
};
};
}i
share { #编译时的共享内存配置，编译后自
```

动清除  

shm\_base = &lt;0x07800000&gt;; #共享内存起始地址  

shm\_size = &lt;0x00400000&gt;; #共享内存大小  

rpmsg\_base = &lt;0x07c00000&gt;; # RPMsg 共享内存起始地址  

rpmsg\_size = &lt;0x00500000&gt;; # RPMsg 共享内存大小  

```
};
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
loadables = "amp3"; #指定被加载的固件，以及加载和启动顺
```

序  

```
signature {
algo = "sha256,rsa2048";

padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
```

/\* - run linux on cpu0  

\* - it is brought up by amp(that run on U-Boot)  

\* - it is boot entry depends on U-Boot  

\*/  

linux &#123; # 支持 Linux 混合部署  

```
description = "linux-os";
arch = "arm64";
cpu = <0x000>;
thumb = <0>;
hyp = <0>;
udelay = <0>;
```

# AMP 固件加载位置如果与 Linux Kernel 加载位置冲突，需要进行调整  

```
load = <0x2000000>; # Linux Kernal 加载位置
load_c = <0x4880000>; # 压缩的 Linux Kernel 加载位置
};
};
}i
};
```

##### 3.1.2.2 amp.its

RTOS + Bare-metal 混合部署方案。以下示例为 RK3562 CPU1 独立运行 RTOS，其余处理器核心独立运行三个 Bare-metal。

/dts-v1/;   

```
/{
description = "FIT source file for rockchip AMP";
#address-cells = <1>;
images {
amp0 {
description = "bare-metal-core0";
data = /incbin/("rtt0.bin");
type = "firmware";
compression = "none";
arch = "arm";
cpu = <0x0>;
thumb = <0>;
hyp = <0>;
load = <0x02000000>;
udelay = <10000>;
compile {
size = <0x00800000>;
sys = "hal";
};
hash {
algo = "sha256";
};
};
amp1 {
description = "rtt-corel";
data = /incbin/("rtt1.bin");
```

```hcl
type "firmware";
compression "none";
arch = "arm";
cpu = <0x1>;
thumb = <0>;
hyp = <0>;
load = <0x00800000>;
udelay = <10000>;
compile {
size = <0x00800000>;
sys = "rtt";
};
hash {
algo = "sha256";
};
};
amp2 {
description = "bare-metal-core2";
data = /incbin/("rtt2.bin");
type = "firmware";
compression = "none";
arch = "arm";
cpu = <0x2>;
thumb = <0>;
hyp = <0>;
load = <0x01000000>;
udelay = <10000>;
compile {
size = <0x00800000>;
sys = "hal";
};
hash {
algo = "sha256";
};
};
amp3 {
description = "bare-metal-core3";
data = /incbin/("rtt3.bin");
type = "firmware";
compression = "none";
arch = "arm";
cpu = <0x3>;
thumb = <0>;
hyp = <0>;
load = <0x01800000>;
udelay = <10000>;
compile {
size = <0x00800000>;
sys = "hal";
};
hash {
algo = "sha256";
}i
};
};
share {
shm_base = <0x07800000>;
```

```hcl
shm_size = <0x00400000>;
};
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
loadables = "amp0", "amp1", "amp2", "amp3";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
}i
};
}i
};
```

##### 3.1.2.3 amp\_mcu.its

Linux + MCU RTOS / Bare-metal 混合部署方案。以下示例为 RK3562 AP 运行 Linux SMP，MCU 独立运行 Bare-metal AMP。

/dts-v1/;   

```
/{
description = "Rockchip AMP FIT Image";
#address-cells = <1>;
images {
mcu {
description = "mcu";
data = /incbin/("./rtt.bin");
type = "standalone"; # MCU 设置为 standalone
compression = "none";
arch = "arm";
load = <0x08200000>;
udelay = <1000000>;
compile {
size = <0x00800000>;
sys = "hal";
core = "mcu"; #处理器核心类型：ap or mcu
};
hash {
algo = "sha256";
};
};
}i
share {
shm_base = <0x07800000>;
shm_size = <0x00400000>;
rpmsg_base = <0x07c00000>;
rpmsg_size = <0x00500000>;
}i
```

```hcl
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
loadables = "mcu";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
}i
};
};
};
```

第4章资源划分

#### 3.1.3 辅助配置文件

某些 SoC平台需要额外使用 &lt;AMP\_SDK&gt;/device/rockchip/.chip/\$RK\_AMP\_CFG 辅助配置文件。辅助配置文件中的参数会被直接export到环境变量中，辅助进行编译。

例如在RK3308中，使用共享LOG功能需要增加以下配置：

### 第3章 RTT config

### 第3章 Share Memory config

RTT SHLOGO SIZE=0x00001000  

RTT SHLOG1 SIZE=0x00001000  

RTT SHLOG2 SIZE=0x00001000  

RTT SHLOG3 SIZE=0x00001000  

### 第3章 HAL config

### 第3章 Share Memory config same as RTT

SHLOGO SIZE=\$RTT SHLOGO SIZE  

SHLOG1 SIZE=\$RTT SHLOG1 SIZE  

SHLOG2 SIZE=\$RTT SHLOG2 SIZE  

SHLOG3 SIZE=\$RTT SHLOG3 SIZE

### 3.1.4 分区表配置文件

在开发过程中，需要根据实际使用的存储介质容量大小和AMP固件大小等调整分区表配置。

手动修改分区表配置文件parameter.txt。分区表配置文件在：

&lt;AMP\_SDK&gt;/device/rockchip/.chip/\$RK\_PARAMETER。添加分区格式为 start@size(part\_name)，单位为 sector（512 Byte）。例如增加一个 2M的 amp 分区：

CMDLINE:   

mtdparts=:0x00002000@0x00004000(uboot),0x00002000@0x00006000(misc),0x00020000@0x0   

0008000(boot),0x00001000@0x00028000(amp),0x00040000@0x00029000(recovery),0x000100   

00@0x00069000(backup),0x01c00000@0x00079000(rootfs),0x00040000@0x01c79000(oem),-   

@0x01cb9000(userdata:grow)

### 使用脚本插入新增的 amp 分区：

./build.sh list-parts   

Partition table   

1: uboot at 0x00004000 size=0x00002000(4M)   

2: misc at 0x00006000 size=0x00002000(4M)   

3: boot at 0x00008000 size=0x00020000(64M)   

4: recovery at 0x00028000 size=0x00040000(128M)   

5: backup at 0x00068000 size=0x00010000(32M)   

6: rootfs at 0x00078000 size=0x01c00000(14G)   

7: oem at 0x01c78000 size=0x00040000(128M)   

8: userdata at 0x01cb8000 size=-(grow)   

./build.sh insert-part:4:amp:2M   

./build.sh list-parts   

Partition table   

1: uboot at 0x00004000 size=0x00002000(4M)   

2: misc at 0x00006000 size=0x00002000(4M)   

3: boot at 0x00008000 size=0x00020000(64M)   

4: amp at 0x00028000 size=0x00001000(2M)   

5: recovery at 0x00029000 size=0x00040000(128M)   

6: backup at 0x00069000 size=0x00010000(32M)   

7: rootfs at 0x00079000 size=0x01c00000(14G)   

8: oem at 0x01c79000 size=0x00040000(128M)   

9: userdata at 0x01cb9000 size=-(grow)

### 3.2 编译命令

#### 3.2.1 统一编译命令

AMP SDK统一编译命令如下，支持一键编译和打包等功能：

./build.sh chip # 选择 SoC 平台   

./build.sh lunch #选择默认配置文件   

./build.sh #一键编译打包   

./build.sh uboot # 单独编译 U-Boot   

./build.sh kernel # 单独编译 Linux Kernel   

./build.sh amp # 单独编译 RTOS / Bare-metal   

./build.sh cleanall ＃清除所有   

./build.sh help ＃获取帮助

./build.sh amp 会读取AMP固件打包配置文件，自动完成amp.img的编译和打包。

#### 3.2.2 单独编译命令

可以从 AMP SDK附带的基础固件中的 build\_info.txt 获取各个组件的单独编译命令。

##### 3.2.2.1 Linux Kernel 编译命令

Linux Kernel作为独立组件单独编译时，以RK3562 AP为例，参考命令如下：

```shell
cd <AMP_SDK>/kernel
export ARCH=arm64 #指定处理器的架构
export CROSS COMPILE="path to compiler" #指定编译工具链
## 第3章 例如：
export CROSS_COMPILE=../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-
x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-
make rockchip_linux_defconfig #指定编译配置
make rk3562-evb1-lp4x-v10-linux-amp.img-j8 #编译指定 dts 板级配置
```

##### 3.2.2.2 RT-Thread 编译命令

RT-Thread作为独立组件单独编译时，以RK3562AP为例，参考命令如下：

```shell
cd <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/
./build.sh <cpu_id 0~3 or all>
./mkimage.sh
scons -j8
scons -c
```

##### 3.2.2.3 RK HAL 编译命令

RKHAL作为独立组件单独编译时，以RK3562AP为例，参考命令如下：

```
cd <AMP SDK>/hal/project/rk3562/GCC
./build.sh <cpu id 0~3 or all>
cd .
```

./mkimage.sh   

```
make -j8
make clean
```

##### 3.2.2.4 U-Boot 编译命令

U-Boot作为独立组件单独编译时，以RK3562为例，参考命令如下：

```shell
cd <AMP_SDK>/u-boot/
make rk3562_defconfig rk-amp.config
./make.sh
```

如果需要使用特殊的rkbin，例如前级运行在CPU3上的rkbin，参考命令如下：

```batch
cd <AMP_SDK>/u-boot/
make rk3562_defconfig rk-amp.config
./make.sh ../rkbin/RKTRUST/RK3562TRUST_CPU3.ini
```

相关章节：

第5章启动方案

## 第 4 章 资源划分

### 4.1 系统架构

#### 4.1.1 AP + AP 系统架构

在瑞芯微多核异构系统中，将 AP + AP 系统架构分为 Linux + RTOS / Bare-metal 和 RTOS + Bare-metal 两种。在 Linux + RTOS /Bare-metal系统架构中，运行 Linux的处理器核心作为主核（Master Core）。运行 RTOS / Bare-metal 的处理器核心作为从核（Remote Core）。在 RTOS + Bare-metal 系统架构中，第一个启动的处理器核心作为主核（Master Core）。其它处理器核心作为从核（Remote Core）。主核负责整个多核异构系统中共享资源的划分和管理，并运行主站服务程序。



<p className="rockchip-figure-caption">图 4-1-1 Linux + RTOS / Bare-metal 系统架构</p>



<p className="rockchip-figure-caption">图 4-1-2 RTOS + Bare-metal 系统架构</p>

#### 4.1.2 AP + MCU 系统架构



<p className="rockchip-figure-caption">图 4-1-3 Linux + MCU RTOS / Bare-metal 系统架构</p>

### 4.2 Linux Kernel 资源配置

#### 4.2.1 Linux Kernel 配置文件

##### 4.2.1.1 DTS 相关文件

Linux Kernel 的资源配置在 DTS 文件中，瑞芯微多核异构系统的 DTS 文件命名为 rkxxxx-evbxxxxx-amp.dts，并包含rkxxxx-amp.dtsi，例如：

rk3562-amp.dtsi是Linux Kernel 用来集中管理多核异构系统的共享资源的。

```dts
/{
rockchip amp: rockchip-amp {
compatible = "rockchip,amp";
```

/\* AMP 用到的时钟资源 \*/   

```
clocks = <&cru FCLK BUS CMO CORE>, <&cru CLK BUS CMO RTC>,
<&Cru PCLK MAILBOX>, <&Cru PCLK INTC>,
<&cru SCLK UART7>, <&cru PCLK UART7>,
<&cru PCLK TIMER>, <&cru CLK TIMER4>, <&cru CLK TIMER5>;
```

/\* AMP 用到的引脚资源 \*/   

```
pinctrl-names = "default";
pinctrl-0 = <&uart7m1 xfer>;
```

/\* AMP 用到的中断资源 \*/   

amp-cpu-aff-maskbits = /bits/ 64 &lt;0x0 0x1 0x1 0x2 0x2 0x4 0x3   

0x8&gt;;   

amp-irqs = /bits/ 64 &lt;GIC AMP IRQ CFG ROUTE(147, 0xd0,   

CPU GET AFFINITY(3, 0))&gt;;   

```dts
status = "okay";
};
};
```

##### 4.2.1.2 AMP 驱动相关文件

AMP驱动相关文件： &lt;AMP\_SDK&gt;/kernel/drivers/soc/rockchip/rockchip\_amp.c

```c
11
// 集中管理 AMP 的中断资源，由 GIC 驱动调用
static void amp_gic_get_irqs_config(struct device_node *np, struct amp_gic_ctrl_s
*amp_ctrl)
11
static int rockchip_amp_probe(struct platform_device *pdev)
{
```

```c
/1
// 集中管理 AMP 的时钟资源
rkamp_dev->num_clks = devm_clk_bulk_get_all(&pdev->dev, &rkamp_dev->clks);
// 集中管理 AMP 的供电资源
rkamp_dev->num_pds =
of_count_phandle_with_args(pdev->dev.of_node, "power-domains",
"#power-domain-cells");
//集中管理AMP的核心资源，做核心的生命周期管理，例如开，关，重启等操作
cpus node = of get child by name(pdev->dev.of node, "amp-cpus");
//.
// 引脚资源，在调用 rockchip_amp_probe 前，由 pinctrl 驱动先行处理了。
static const struct of_device_id rockchip_amp_match[] = {
{ .compatible = "rockchip,amp" }, // 和 DTS 文件的属性对应
//.
};
```

#### 4.2.2 Linux Kernel 内存资源

##### 4.2.2.1 运行内存配置

DRAM 是系统私有的运行内存。Linux Kernel 默认是将所有 DDR 资源都作为 DRAM 使用，因此多核异构系统中，需要在 Linux Kernel DTS 上，将其他系统的 DRAM位置保留出来。

以 RK3562 为例：

```
/{
reserved-memory {
```

/\* rk3588-amp.dtsi \*/   

/\* mcu address \*/   

```
mcu reserved: mcu@8200000 {
reg = <0x0 0x8200000 0x0 0x100000>;
no-map;
};
```

/\* rk3588-evb1-1p4-v10-linux-amp.dts \*/   

/\* ap address \*/   

```
amp_reserved: amp@800000 {
reg = <0x0 0x01800000 0x0 0x00800000>;
no-map;
};
};
};
```

##### 4.2.2.2 共享内存配置

Share Memory 是多系统间交互信息的空间。Linux Kernel 默认是将所有 DDR 资源都作为 DRAM 使用，因此多核异构系统中，需要在 Linux Kernel DTS 上，将Share Memory 保留出来。

保留的配置操作与LinuxKernel DRAM配置一致，只要不同名即可。

以 RK3562 为例：

```
/{
reserved-memory {
```

/\* rk3588-amp.dtsi \*/   

```
rpmsg_reserved: rpmsg@7c00000 {
reg = <0x0 0x07c00000 0x0 0x400000>;
no-map;
};
};
};
```

#### 4.2.3 Linux Kernel 外设资源

Linux Kernel 默认将所有芯片资源都定义到了DTS 中，因此，当 AMP 需要在 Linux Kernel之外使用外设资源，需要现在DTS中关闭对应的模块，将资源让给AMP的其他系统使用。

下面以 RK3562 EVB1 中，Linux Kernel 将 I2C1 资源转让给 RTOS 使用为例

先找到rk3562.dtsi中，I2C1的定义。

```
i2c1: i2c@ffa00000 { /* 模块名字
```

\*/   

```dts
compatible = "rockchip,rk3562-i2c", "rockchip,rk3399-i2c";
reg = <0x0 0xffa00000 0x0 0x1000>;
clocks = <&cru CLK I2C1>, <&cru PCLK I2C1>; /*时钟引用
```

\*/   

```
clock-names = "i2c", "pclk";
interrupts = <GIC_SPI 13 IRQ_TYPE_LEVEL_HIGH>; /* 中断引用
```

\*/   

```
pinctrl-names = "default";
pinctrl-0 = <&i2c1m0_xfer>; /*引脚引用
```

\*/   

#address-cells = &lt;1&gt;;   

#size-cells = &lt;0&gt;;   

```
status = "disabled";
};
```

从DTS 中，I2C1的资源配置中，可以看到I2C1需要用到：

- 中断资源

- 引脚资源

- 时钟资源

先在 DTS 中将 I2C1 资源关闭：

```dts
&i2c1 {
status = "disabled";
};
```

##### 4.2.3.1 中断配置

将 I2C1 的中断资源，加到 rockchip-amp的 amp-irqs节点中：

```c
/{
rockchip_amp: rockchip-amp {
compatible = "rockchip,amp";
//………
/* AMP 用到的中断资源 */
amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0,
CPU_GET_AFFINITY(3, 0))>;
+ amp-irqs = /bits/ 64 <GIC AMP IRQ CFG ROUTE(147, 0xd0,
CPU_GET_AFFINITY(3, 0))
+ GIC_AMP_IRQ_CFG_ROUTE(45, 0xd0,
CPU GET AFFINITY(3, 0))>;
// 新增 I2C1： 45 = I2C1 中断 13 + 固定偏移 32
//…………
};
};
```

注意：模块中断号，和 amp-irqs 引用中断号差一个固定偏移32。

##### 4.2.3.2 引脚配置

将 I2C1 的引脚资源，加到rockchip-amp节点中：

```dts
/{
rockchip_amp: rockchip-amp {
compatible = "rockchip,amp";
//…
```

/\* AMP 用到的引脚资源 \*/   

```
pinctrl-names = "default";
pinctrl-0 = <&uart7m1_xfer>;
```

+ pinctrl-0 = &lt;&uart7m1\_xfer&gt;, &lt;&i2c1m0\_xfer&gt;;   

```
//…
};
};
```

注意：模块使用的引脚资源可能有多组，选择实际使用的组别进行添加。

##### 4.2.3.3 时钟配置

将 PWM1 的中断资源，加到 rockchip-amp节点中：

```dts
rockchip_amp: rockchip-amp {
compatible = "rockchip,amp";
//……
```

/\* AMP 用到的时钟资源 \*/   

```
clocks = <&cru FCLK_BUS_CMO_CORE>, <&cru CLK_BUS_CMO_RTC>,
<&cru PCLK MAILBOX>, <&Cru PCLK INTC>,
<&cru SCLK_UART7>, <&cru PCLK_UART7>,
```

一 &lt;&cru PCLK TIMER&gt;, &lt;&cru CLK TIMER4&gt;, &lt;&cru CLK TIMER5&gt;;  

+ &lt;&cru PCLK TIMER&gt;, &lt;&cru CLK TIMER4&gt;, &lt;&cru CLK TIMER5&gt;,  

+ &lt;&cru CLK I2C1&gt;, &lt;&cru PCLK I2C1&gt;;  

```
//………
};
};
```

### 4.3 RTOS 资源配置

#### 4.3.1 RT-Thread 配置文件

通常来说，芯片级别的工程中，会预设好几个板级配置，使用工程中，通过scons--menuconfig指令修改CONFIG RT BOARD NAME配置，达到同一个工程适配多个板子的需求。

因此，RT-Thread配置的内容包括：

&lt;AMP SDK&gt;/internal/rk3588/rtos/bsp/rockchip/rk3562-32/   

applications   

board   

common #通用配置   

Kconfig   

rk3562\_evb1\_1p4x #板级配置   

SConscript   

build.sh #编译脚本，内含一些编译配置

· 通用配置部分：芯片的基础配置，为工程必选代码，为所有板级工程服务。

- 板级配置部分：板级配置，为具体板子配置相关功能，比如GPIO、UART、I2C等。

- 编译命令：编译命令可以实现编译时的系统传参，提供灵活的编译指令。有build.sh脚本时，参数可以直接定义在 build.sh中。或者 export 特定编译参数后，使用 scons命令编译。

##### 4.3.1.1 板级相关文件

RT-Thread工程资源配置，包括通用配置，以及板级配置。

通用配置文件包括：

```shell
## 第4章 通用配置
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/board_base.c
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/iomux_base.c
```

通用配置，定义了硬件启动的初始化顺序和默认硬件资源同时提供大量的 RT\_WEAK定义，方便用户在板级配置中进行对应的替换。

```c
RT WEAK const struct clk init clk inits[l; //弱定义结构体，可以在板级配置
中重定义
RT_WEAK void rt_hw_iomux_config(void); // 弱定义函数，可以在板级配置中
重定义
//… // 不同芯片的弱定义资源不一致，
不一一列举
void rt hw board init(void)
{
// ... 初始化顺序，不要修改
一
```

板级配置文件包括：

板级配置中，对需要的 RT\_WEAK 资源进行重定义。

```
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_1p4x/iomux.c
```

void rt\_hw\_iomux\_config(void)   

```
{
}
```

##### 4.3.1.2 编译相关文件

RT-Thread 使用 SCONS 编译，编译涉及的文件有：

```
cd <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/
```

rk3562-32/rtconfig.h #编译使用的配置文件  

rtconfig.py #编译脚本，决定编译链位置，编译命令的传入参数等  

SConscript # SCONS 链接文件  

SConstruct # SCONS 链接文件  

build.sh # RT-Thread AP Core 快捷编译脚本， MCU Core 没有此  

脚本

AP Core 使用 ./build.sh 完成编译，MCU Core，使用 make 命令完成编译。

#### 4.3.2 RT-Thread 内存资源

RT-Thread的内存分配，由编译的链接文件分配。

```shell
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/gcc_arm.1d.S
<AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.1d.S
```

##### 4.3.2.1 AP 运行内存配置

```prolog
/* cat <AMP SDK>/rtos/bsp/rockchip/rk3562-32/gcc arm.ld.S */
MEMORY
{
SRAM (rxw) : ORIGIN = 0xfe480000, LENGTH = 64K /* SYSTEM SRAM */
DRAM (rXw) : ORIGIN = FIRMWARE BASE, LENGTH = DRAM SIZE /* DRAM */
SHMEM (rXw) : ORIGIN = SHMEM BASE, LENGTH = SHMEM SIZE /* shared memory
for all cpu */
LINUX RPMSG (rXw) : ORIGIN = LINUX RPMSG_BASE, LENGTH = LINUX RPMSG_ SIZE
}
## 第4章 cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/rtconfig.py
## 第4章 做变量转换，连接 build.sh 脚本和 gcc_arm.ld.S 文件
CFLAGS += ' -DFIRMWARE BASE={a} -DDRAM SIZE={b} -DSHMEM BASE={c} -DSHMEM SIZE={d}
-DLINUX_RPMSG_BASE={e} -DLINUX_RPMSG_SIZE={f}'.format(a=PRMEM_BASE, b=PRMEM_SIZE,
C=SHMEM_BASE, d=SHMEM_SIZE, e=LINUX_RPMSG_BASE, f=LINUX_RPMSG_SIZE)
## 第4章 cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/build.sh
export RTT PRMEM BASE=$(eval echo \$CPU$1 MEM BASE) /* DRAM 起始位置 */
export RTT PRMEM SIZE=$(eval echo \$CPU$1 MEM SIZE) /* DRAM 容量大小 */
export RTT SHMEM BASE=0x07800000 /* shared memory
起始位置 */
export RTT_SHMEM_SIZE=0x00400000 /* shared memory
容量大小 */
export LINUX RPMSG BASE=0x07c00000 /* rpmsg 起始位置
*/
export LINUX_RPMSG_SIZE=0x00500000 /* rpmsg 容量大小
*/
```

RT-Thread AP Core的内存配置，处于 gcc arm.1d.s中，为了方便编译配置，部分参数，通过rtconfig·py转化到build.sh中，方便编译修改。

AP Core中配置的地址信息，即使真实DDR的物理地址信息。

DRAM可以通过build.sh中的参数进行配置：

```shell
CPU3 MEM BASE=0x01800000
CPU3 MEM SIZE=0x00800000
export RTT_PRMEM_BASE=$(eval echo \$CPU$1_MEM_BASE) /* DRAM 起始位置
*/
export RTT_PRMEM_SIZE=$(eval echo \$CPU$1_MEM_SIZE) /* DRAM 容量大小
*/
```

以上变量，对应 gcc arm.1d.S的 DRAM 区域:

DRAM (rXw) : ORIGIN = FIRMWARE BASE, LENGTH = DRAM SIZE /\* DRAM \*/

变量名的不同，通过rtconfig.py转化。

##### 4.3.2.2 AP 共享内存配置

以共享内存LINUX\_RPMSG 为例子，需要在 gcc\_arm.1d.s中定义以下内容:

```
MEMORY {
LINUX_ RPMSG (rXw) : ORIGIN = LINUX_ RPMSG BASE, LENGTH = LINUX RPMSG SIZE
```

一   

.linux\_share\_rpmsg (NOLOAD):   

PROVIDE(\_\_linux\_share\_rpmsg\_start\_\_ = .);   

. += LINUX\_RPMSG\_SIZE;   

PROVIDE(\_\_linux\_share\_rpmsg\_end\_\_ = .);   

```
} > LINUX_RPMSG
```

可以在代码中，直接获取到LINUX RPMSG的物理地址指针

```c
/* <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/rpmsg_base.h */
/* RPMSG share memory infomation */
extern uint32_t __share_rpmsg_start__[];
extern uint32_t __share_rpmsg_end_[];
#define RPMSG MEM BASE ((uint32_t)&__share_rpmsg_start_)
#define RPMSG_MEM_END ((uint32_t)&__share_rpmsg_end__)
```

##### 4.3.2.3 MCU 运行内存配置

/\* cat &lt;AMP SDK&gt;/rtos/bsp/rockchip/rk3562-mcu/gcc link.ld.S \*/   

MEMORY   

```
{
DDR (rxw) : ORIGIN = 0x00000000, LENGTH = 512K
}
/* cat <AMP SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/{
images {
mcu {
//...
load = <0x08200000>;
//...
};
};
};
```

RT-Thread MCU Core 的内存配置，由gcc\_link.1d.S和 amp.its共同完成。

MCU Core 较 AP Core 不同的地方在于，MCU Core 的启动位置，就是 MCU Core 的 0 地址。所以，MCU Core看到的地址，和真实物理地址间存在一个固定偏移。

/\* cat &lt;AMP SDK&gt;/rtos/bsp/rockchip/rk3562-mcu/gcc link.ld.S \*/   

MEMORY

```
{
DDR (rxw) : ORIGIN = 0x00000000, LENGTH = 512K
/* cat <AMP SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/{
images {
mcu {
//...
load = <0x08200000>;
//...
};
};
};
```

以上展示的，就是将 RT-Thread MCU DRAM 设置在物理地址0x08200000，容量大小位 512K的例子。

##### 4.3.2.4 MCU 共享内存配置

以向 RK3562 RT-Thread MCU 添加共享内存 LINUX\_RPMSG 为例子，需要在 gcc\_arm.1d.s中定义以下内容:

/\* cat &lt;AMP SDK&gt;/rtos/bsp/rockchip/rk3562-mcu/gcc link.ld.S \*/   

```
MEMORY {
//.
LINUX RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
//...
```

.linux\_share\_rpmsg (NOLOAD):   

```
{
PROVIDE(_linux_share_rpmsg_start__ = .);
. += LINUX RPMSG SIZE;
PROVIDE(_linux_share_rpmsg_end_ = .);
} > LINUX RPMSG
/* cat <AMP SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/{
images {
mcu {
//...
load = <0x08200000>;
//...
};
};
};
```

以上例子中，LINUX\_RPMSG 的物理地址应该是 0x08300000 = 0x08200000 + 0x00100000。容量大小为 0x00500000 byptes (5M byptes)。

代码中，同样可以获取LINUXRPMSG信息。需要注意，MCU中，所有的地址信息，都是以自生加载地址为偏移的。

```c
/* RPMSG share memory infomation */
extern uint32_t __share_rpmsg_start__[];
extern uint32_t __share_rpmsg_end__[];
#define RPMSG MEM BASE ((uint32_t)&__share_rpmsg_start__) /* 0x00100000
*/
#define RPMSG MEM END ((uint32_t)&_share_rpmsg_end_) /* 0x00500000
*/
```

Zain: 1sf: RISC-V 是否一致。

#### 4.3.3 RT-Thread 外设资源

以RK3562添加 I2C1 资源为例，说明如何在RT-Thread中添加一个外设模块。

##### 4.3.3.1 AP 中断配置

Zain: lsf: 增加 中断章节跳转

如果使用的是MCU核心，请调过此章节。MCU使用的是独立的NVIC控制器，不需要配置此项。

向 irqsConfig 中，声明需要响应I2C1的中断。

```c
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/board_base.c
// 系统运行在 CPU3 上，则 CPU3 需要响应 I2C1 中断。
#define CUR CPU 3
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] =
{
//.
GIC_AMP_IRQ_CFG_ROUTE(I2C1_IRQn, OxdO, CPU_GET_AFFINITY(CUR_CPU, 0)),
//…
}
```

##### 4.3.3.2 MCU 中断配置

与MCU 直连的中断走NVIC的接口，其余的中断需要走INTMUX接口。

```c
<AMP_SDK>/hal/project/rk3562/src/test_demo.c
// NVIC 接口示例
/* */
/* SOFTIRQ TEST */
/* *1
/************************************************
#ifdef SOFTIRQ TEST
static void soft isr(void)
{
printf("softirq_test: enter isr\n");
}
```

```c
static void softirq_test(void)
printf("softirq_test start\n");
HAL NVIC SetIRQHandler(RSVD0 MCU IRQn, soft isr);
HAL_NVIC_EnableIRQ(RSVD0_MCU_IRQn);
HAL DelayMs(4000);
HAL_NVIC_SetPendingIRQ(RSVD0_MCU_IRQn);
一
#endif
// INTMUX 接口示例
/* */
/* GPIO_TEST */
/* */
/**************** *******
#ifdef GPIO_TEST
//..
static void gpio test(void)
//……
/* Test GPIO interrupt */
HAL_GPIO_SetPinDirection(GPIO1, GPIO_PIN_B7, GPIO_IN);
HAL_INTMUX_SetIRQHandler(GPIO1_IRQn, gpio1_isr, NULL);
HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK1,GPIO_PIN_B7, b7_call_back,
NULL);
HAL INTMUX EnableIRQ(GPIO1 IRQn);
HAL_GPIO_SetIntType(GPIO1, GPIO_PIN_B7, GPIO_INT_TYPE_EDGE_BOTH);
HAL GPIO EnableIRQ(GPIO1, GPIO PIN B7);
printf("test_gpio interrupt ready\n");
一
#endif
```

##### 4.3.3.3 引脚配置

向 rt\_hw\_iomux\_config 中，初始化I2C1引脚配置。

```c
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
void i2c1 m0 iomux config(void)
{
HAL PINCTRL SetIOMUX(GPIO BANKO,
GPIO_PIN_B3  GPIO_PIN_B4,
PIN CONFIG MUX FUNC1);
一
void rt_hw_iomux_config(void)
{
//.
```

```c
i2c1_m0_iomux_config();
//.
}
```

##### 4.3.3.4 时钟配置

RT-Thread 中自带 CRU模块，不需要再进行时钟开关配置。

至此，即可使用 RT-Thread 的 I2C接口，对 I2C1 进行操作。

### 4.4 Bare-metal 资源配置

#### 4.4.1 RK HAL 配置文件

##### 4.4.1.1 板级相关文件

RK HAL所有资源都是直接定义于main.c中，用户可以自行划分配置方式。

##### 4.4.1.2 编译相关文件

RT-Thread 使用 SCONS 编译，编译涉及的文件有：

```
cd <AMP SDK>/hal/project/rk3562/GCC
```

Makefile #编译使用的配置文件  

build.sh # RT-Thread AP Core 快捷编译脚本， MCU Core 没有此  

脚本

AP Core 使用 . /build.sh 完成编译，MCU Core，使用 make 命令完成编译。

#### 4.4.2 RK\_HAL 内存资源

HAL的内存分配，由编译的链接文件分配。

&lt;AMP\_SDK&gt;/hal/project/rk3562/GCC/gcc\_arm.1d.S   

&lt;AMP\_SDK&gt;/hal/project/rk3562-mcu/GCC/gcc\_bus\_m0.1d

##### 4.4.2.1 AP 运行内存配置

```sql
/* cat <AMP_SDK>/hal/project/rk3562/GCC/gcc_arm.ld.S */
MEMORY
{
SRAM (rXw) : ORIGIN = SRAM BASE, LENGTH = SRAM SIZE /* SYSTEM
SRAM */
DRAM (rXw) : ORIGIN = FIRMWARE BASE, LENGTH = DRAM SIZE /* DRAM */
```

```c
SHMEM (rXw) : ORIGIN = SHMEM BASE, LENGTH = SHMEM SIZE /* shared memory
for all cpu */
LINUX RPMSG (rXw) : ORIGIN = LINUX RPMSG BASE, LENGTH = LINUX RPMSG SIZE
}
## 第4章 cat <AMP_SDK>/hal/1lib/CMSIS/Device/RK3562/Source/Templates/mmu_rk3562.c
## 第4章 做内存映射，连接 build.sh 脚本和 gcc_arm.ld.S 文件
#if defined(NC_MEM_BASE) && defined(NC_MEM_SIZE)
MMU_TTSection(MMUTable, FIRMWARE_BASE, (DRAM_SIZE - NC_MEM_SIZE) >> 20,
Sect_Normal);
MMU_TTSection(MMUTable, NC_MEM_BASE, NC_MEM_SIZE >> 20, Sect_Normal_NC);
#else
MMU_TTSection(MMUTable, FIRMWARE_BASE, DRAM_SIZE >> 20, Sect_Normal);
#endif
MMU_TTSection(MMUTable, SHMEM_BASE, SHMEM_SIZE >> 20, Sect_Normal_SH);
11 MMU_TTSection(MMUTable, SHMEM_BASE, SHMEM_SIZE >> 20, Sect_Normal_NC_SH);
#ifdef LINUX RPMSG BASE
MMU TTSection(MMUTable, LINUX RPMSG BASE, LINUX RPMSG SIZE >> 20,
Sect_Normal_NC_SH);
#endif
## 第4章 cat <AMP_SDK>/hal/project/rk3562/GCC/build.sh
export FIRMWARE_CPU_BASE=$(eval echo \$CPU$1_MEM_BASE) /* DRAM 起始位置
*/
export DRAM_SIZE=$(eval echo \$CPU$1_MEM_SIZE) /* DRAM 容量大小
*/
export SHMEM_BASE=0x07800000 /* shared
memory 起始位*/
export SHMEM_SIZE=0x00400000 /* shared memory
容量大小 */
export LINUX_RPMSG_BASE=0x07c00000 /* rpmsg 起始位置
*/
export LINUX_RPMSG_SIZE=0x00500000 /* rpmsg 容量大小
*/
```

HAL AP Core的内存配置，处于 gcc\_arm.1d.s中，为了方便编译配置，部分参数，通过 mmu\_rk3562.c转化到build.sh中，方便编译修改。

AP Core中配置的地址信息，即使真实DDR的物理地址信息。

DRAM可以通过build.sh中的参数进行配置：

```shell
CPU3 MEM BASE=0x01800000
CPU3 MEM SIZE=0x00800000
export FIRMWARE CPU BASE=$(eval echo \$CPU$1 MEM BASE) /* DRAM 起始位
置*/
export DRAM SIZE=$(eval echo \$CPU$1 MEM SIZE) /* DRAM 容量大
小*/
```

以上变量，对应 gcc arm.1d.S的 DRAM 区域:

DRAM (rXw) : ORIGIN = FIRMWARE BASE, LENGTH = DRAM SIZE /\* DRAM \*

变量名的不同，在 mmu\_rk3562.c 中转化。

##### 4.4.2.2 AP 共享内存配置

以共享内存 LINUX\_RPMSG 为例子，需要在 gcc\_arm.1d.s中定义以下内容:

```
MEMORY {
LINUX_ RPMSG (rXw) : ORIGIN = LINUX_ RPMSG BASE, LENGTH = LINUX RPMSG SIZE
```

一   

.linux\_share\_rpmsg (NOLOAD):   

PROVIDE(\_\_linux\_share\_rpmsg\_start\_\_\_ = .);   

. += LINUX\_RPMSG\_SIZE;   

PROVIDE(\_\_linux\_share\_rpmsg\_end\_\_ = .);   

```
} > LINUX_RPMSG
```

可以在代码中，直接获取到LINUX RPMSG的物理地址指针

```c
/* <AMP_SDK>/hal/project/rk3562/src/test_demo.c */
extern uint32_t __linux_share_rpmsg_start__[];
extern uint32_t __linux_share_rpmsg_end__[];
#define RPMSG_LINUX_MEM_BASE ((uint32_t)&__linux_share_rpmsg_start__)
#define RPMSG_LINUX_MEM_END ((uint32_t)&__linux_share_rpmsg_end__)
#define RPMSG_LINUX_MEM_SIZE (2UL * RL_VRING_OVERHEAD)
```

##### 4.4.2.3 MCU 运行内存配置

```c
/* cat <AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.1d */
MEMORY
DDR (rxw) : ORIGIN = 0x00000000, LENGTH = 512K
/* cat <AMP_SDK>/hal/project/rk3562-mcu/Image/amp.its */
/{
images {
mcu {
//...
load = <0x08200000>;
//...
};
}i
};
```

RT-Thread MCU Core 的内存配置，由 gcc\_bus\_m0.1d 和 amp. its共同完成。

MCU Core 较 AP Core 不同的地方在于，MCU Core 的启动位置，就是 MCU Core 的 0 地址。所以，MCU Core看到的地址，和真实物理地址间存在一个固定偏移。

以向 RK3562 HAL MCU 添加共享内存 LINUX\_RPMSG 为例子，需要在 gcc\_bus\_m0.1d 中定义以下内容:

```c
/* cat <AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.1d */
MEMORY {
//.
LINUX RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
//...
.linux_share_rpmsg (NOLOAD):
{
PROVIDE(_linux_share_rpmsg_start_ = .);
. += LINUX RPMSG SIZE;
PROVIDE(_linux_share_rpmsg_end__ = .);
} > LINUX RPMSG
/* cat <AMP_SDK>/hal/project/rk3562-mcu/Image/amp.its */
/{
images {
mcu {
//...
load = <0x08200000>;
//...
};
};
};
```

以上例子中，LINUX\_RPMSG 的物理地址应该是 0x08300000 = 0x08200000 + 0x00100000。容量大小为 0x00500000 byptes (5M byptes)。

代码中，同样可以获取LINUX RPMSG信息。需要注意，MCU中，所有的地址信息，都是以自生加载地址为偏移的。

#### 4.4.3 RK HAL 外设资源

##### 4.4.3.1 AP 中断配置

RK HAL 所有资源都是直接定义于 main.c中。以 RK3562 添加 I2C1 资源为例，说明如何在 RK HAL 中添加一个外设模块。

```c
/* I2C1 中断配置
/* RK HAL bare CORE*/
static struct GIC AMP IRQ INIT CFG irqsConfig[] = {
GIC_AMP_IRQ_CFG_ROUTE(I2C1_IRQn, OxdO, CPU_GET_AFFINITY(3, 0)),
GIC AMP IRQ CFG ROUTE(O, 0, CPU GET AFFINITY(1, 0)), /* sentinel */
};
static struct GIC_IRQ_AMP_CTRL irqConfig = {
.CpuAff = CPU_GET_AFFINITY(1, 0),
.defPrio = 0xd0,
```

```c
.defRouteAff = CPU_GET_AFFINITY(1, 0),
.irqsCfg = &irqsConfig[0],
};
/* I2C1 引脚资源
static void HAL IOMUX I2C1MO Config(void)
HAL_PINCTRL_SetIOMUX(GPIO_BANKO,
GPIO_PIN_B3  GPIO_PIN_B4,
PIN_CONFIG_MUX_FUNC1);
一
void main(void)
uint32_t freq;
struct I2C_HANDLE instance;
/* HAL BASE Init */
HAL_Init();
/* BSP Init */
BSP_Init();
/* Interrupt Init */
HAL_GIC_Init(&irqConfig);
HAL_IOMUX_I2C1MO_Config();
freq = HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
// i2c operations
while (1);
```

##### 4.4.3.2 MCU 中断配置

RK HAL 所有资源都是直接定义于 main.c中。以 RK3562 MCU 添加 I2C1 资源为例，说明如何在 RKHAL中添加一个外设模块。

```c
/* I2C1 引脚资源
static void HAL IOMUX I2C1MO Config(void)
HAL_PINCTRL_SetIOMUX(GPIO_BANKO,
GPIO_PIN_B3 I GPIO_PIN_B4,
PIN CONFIG MUX FUNC1);
一
void main(void)
uint32_t freq;
struct I2C_HANDLE instance;
/* HAL BASE Init, MCU Core 使用 NVIC 控制器，HAL Init 完成 NVIC 初始化 */
HAL_Init();
/* BSP Init */
BSP_Init();
```

```c
HAL_IOMUX_I2C1MO_Config();
freq = HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
// i2c operations ...
while (1);
}
```

##### 4.4.3.3 引脚配置

I2C1 引脚配置在 MCU 及 AP 上相同，使用 HAL\_PINCTRL\_SetIOMUX 函数配置需要的引脚功能。

```c
/ * I2C1 引脚资源 大
static void HAL IOMUX I2C1M0 Config(void)
HAL PINCTRL SetIOMUX(GPIO BANKO,
GPIO PIN B3 I GPIO PIN B4,
PIN_CONFIG_MUX_FUNC1);
void main(void)
//.…
HAL_IOMUX_I2C1MO_Config();
//.
一
```

##### 4.4.3.4 时钟配置

I2C1 时钟配置在 MCU 及 AP 上相同，使用 HAL\_CRU\_ClkGetFreq 和 HAL\_I2C\_Init 函数获取时钟频率及初始化I2C设备。

```c
void main(void)
uint32_t freq;
struct I2C_HANDLE instance;
//…
HAL CRU ClkGetFreq(g i2c1dev.clkID);
HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
//………
```

## 第 5 章 启动方案

### 5.1 Rockchip SoC 处理器架构

在瑞芯微多核异构系统中，Rockchip SoC处理器架构可以抽象为下图所示。

AP Cores（Application Processor），一般为 ARM Cortex-A 处理器核心。

MCU Core（Micro Controller Unit），一般为 ARM Cortex-M 或 RISC-V 处理器核心。



<p className="rockchip-figure-caption">图 5-1-1 Rockchip SoC 处理器架构</p>

### 5.2 AP + AP 启动方案

以 RK3562 为例，RK3562 是一颗四核 ARM Cortex-A53 处理器，我们将其抽象成 CPU0、CPU1、CPU2、CPU3。在RK3562运行瑞芯微多核异构系统时，支持多种组合运行方式。

#### 5.2.1 Linux + RTOS / Bare-metal

##### 5.2.1.1 示例固件：Kernel + RT-Thread / HAL



<p className="rockchip-figure-caption">图 5-1-2 kernel + rtt / hal</p>

Kernel + RT-Thread /HAL 的打包文件 amp\_linux.its 配置如下：

```hcl
/dts-v1/;
/{
description = "FIT source file for rockchip AMP";
#address-cells = <1>;
images {
amp3 {
description  = "bare-mental-core3";
data = /incbin/("cpu3.bin");
type = "firmware";
compression = "none";
arch = "arm"; # arm or arm64，默认arm
cpu = <0x3>; # CPU ID
thumb = <0>;
hyp = <0>;
load = <0x01800000>; # DRAM 起始位置
#编译配置，编译解释后，编译脚本自动清除
compile {
size = <0x00800000>; # DRAM 大小
srambase = <0xfe480000>; # SRAM 起始位置
sramsize = <0x00010000>; # SRAM 大小
sys = "rtt"; # CPU 运行系统： HAL or RT-
Thread
# RT-Thread 编译配置文件
rtt_config= "board/rk3562_evb1_1p4x/defconfig"
};
udelay = <10000>；# CPU 启动延时，多个 CPU 依次启动时的
延时时间
hash {
algo = "sha256";
};
};
#一个 images 下，可以包含多个子节点，SDK 会遍历所有 images 下的节点，根据
节点信息，自动编译打包
};
#共享内存信息，编译配置，编译解释后，编译脚本自动清除
share {
```

```hcl
shm_base = <0x07800000>； # 多核 CPU 共享 SDRAM 内存起始地址
shm_size = <0x00400000>； # 多核 CPU 共享 SDRAM 内存分配大小
rpmsg_base = <0x07C00000>；# RPMSG 共享内存起始地址
rpmsg size = <0x00500000>；# RPMSG 共享内存分配大小
#主系统核心 ID，当多个 AMP 包含多个系统时，该参数设定主系统的 CPU ID
# 纯 RTOS AMP 中默认为"0x01"
#当 AMP 系统中包含 linux 时，linux cpu0 默认配置为主核
primary = <0x0>;
};
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
loadables = "amp3"；# 加载镜像，该示例中只有“amp3"
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
/* - run linux on cpu0
* - it is brought up by amp(that run on U-Boot)
* - it is boot entry depends on U-Boot
*/
linux {
description = "linux-os";
arch = "arm64";
cpu = <0x000>;
thumb = <0>;
hyp = <0>;
udelay = <0>;
# AMP 系统如果和 Kernel 加载位置冲突，需要调整 Kernel
加载位置
load = <0x2000000>; # Kernal 加载位置
load_c = <0x4880000>; # 压缩 Kernel 加载位置
};
}i
};
};
```

##### 5.2.1.2 示例固件：Kernel + 3 \* HAL



<p className="rockchip-figure-caption">图 5-1-3 kernel + 3 \* hal</p>

Kernel + 3 \* HAL / RT-Thread 的打包文件 amp\_linux.its 配置如下：

```
description = "FIT source file for rockchip AMP";
#address-cells = <1>;
images {
amp1 {
```

#……  

```
}
amp2 {
```

#  

```
}
amp3 {
description  = "bare-mental-core3";
data = /incbin/("cpu3.bin");
type = "firmware";
compression = "none";
arch = "arm"; # arm or arm64，默认arm
cpu = <0x3>; # CPU ID
thumb = <0>;
hyp = <0>;
load = <0x01800000>; # DRAM 起始位置
```

#编译配置，编译解释后，编译脚本自动清除  

```
compile {
size = <0x00800000>; # DRAM 大小
srambase = <0xfe480000>; # SRAM 起始位置
sramsize = <0x00010000>; # SRAM 大小
sys = "hal"; # CPU 运行系统： HAL or RT-
```

Thread  

# RT-Thread 编译配置文件  

rtt\_config= "board/rk3562\_evb1\_1p4x/defconfig"  

```
};
udelay = <10000>； # CPU 启动延时，多个 CPU 依次启动时的
```

延时时间  

```
hash {
algo = "sha256";
};
};
```

# 一个 images 下，可以包含多个子节点，SDK 会遍历所有 images 下的节点，根据  

节点信息，自动编译打包  

```
};
```

#共享内存信息，编译配置，编译解释后，编译脚本自动清除  

```
share {
shm base = <0x07800000>； # 多核 CPU 共享 SDRAM 内存起始地址
shm_size = <0x00400000>； # 多核 CPU 共享 SDRAM 内存分配大小
rpmsg_base = <0x07C00000>；# RPMSG 共享内存起始地址
rpmsg size = <0x00500000>； # RPMSG 共享内存分配大小
```

#主系统核心 ID，当多个 AMP 包含多个系统时，该参数设定主系统的 CPU ID  

#纯 RTOS AMP 中默认为"0x01"  

#当AMP系统中包含 linux 时，linux cpu0 默认配置为主核  

```
primary = <0x0>;
};
confiqurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
```

#镜像加载列表：当存在多个 amp 镜像时，  

# 如: loadables = "amp0", "amp1", "amp2", "amp3"...  

#当CPU0 为启动核时，实际加载顺序为：amp1--&gt;amp2--&gt;amp3-&gt;...  

&gt;amp0  

#依次类推，启动核由于在 boot 阶段被占用，在 AMP 中将是最后一个启  

动  

#加载镜像，该示例中有“amp1”、“amp2"、“amp3"  

```
loadables = "amp1", "amp2", "amp3";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
```

/\* - run linux on cpu0  

\* - it is brought up by amp(that run on U-Boot)  

\* - it is boot entry depends on U-Boot  

\*/  

```
linux {
description = "linux-os";
arch = "arm64";
cpu = <0x000>;
thumb = <0>;
hyp = <0>;
udelay = <0>;
```

# AMP 系统如果和 Kernel 加载位置冲突，需要调整 Kernel  

加载位置  

```
load = <0x2000000>; # Kernal 加载位置
load_c = <0x4880000>； # 压缩 Kernel 加载位置
};
};
};
};
```

#### 5.2.2 RTOS + Bare-metal

##### 5.2.2.1 示例固件：HAL + HAL



<p className="rockchip-figure-caption">图 5-1-4 hal + hal + hal + hal</p>

HAL + HAL 的打包文件 amp\_linux.its 配置如下：

```
description = "FIT source file for rockchip AMP";
#address-cells = <1>;
images {
amp0 {
```

#……   

```
}
amp1 {
description = "bare-mental-core3";
data = /incbin/("cpu1.bin");
type = "firmware";
compression = "none";
arch = "arm"; # arm or arm64，默认arm
cpu = <0x1>; # CPU ID
thumb = <0>;
hyp = <0>;
load = <0x00800000>; # DRAM 起始位置
```

#编译配置，编译解释后，编译脚本自动清除   

```
compile {
size = <0x00800000>; # DRAM 大小
srambase = <0xfe480000>; # SRAM 起始位置
sramsize = <0x00010000>; # SRAM 大小
sys = "hal"; # CPU 运行系统： HAL or RT-
```

Thread   

# RT-Thread 编译配置文件   

rtt\_config= "board/rk3562\_evb1\_1p4x/defconfig"   

```
}i

udelay = <10000>； # CPU 启动延时，多个 CPU 依次启动时的
```

延时时间  

```
hash {
algo = "sha256";
};
amp2 {
}
amp3 {
```

＃………  

```
};
```

# 一个 images 下，可以包含多个子节点，SDK 会遍历所有 images 下的节点，根据  

节点信息，自动编译打包  

```
};
```

#共享内存信息，编译配置，编译解释后，编译脚本自动清除  

```
share {
shm_base = <0x07800000>； # 多核 CPU 共享 SDRAM 内存起始地址
shm_size = <0x00400000>； # 多核 CPU 共享 SDRAM 内存分配大小
rpmsg_base = <0x07C00000>； # RPMSG 共享内存起始地址
rpmsg size = <0x00500000>；# RPMSG 共享内存分配大小
```

#主系统核心 ID，当多个 AMP 包含多个系统时，该参数设定主系统的 CPU ID  

# 纯 RTOS AMP 中默认为"0x01"  

#当 AMP 系统中包含 linux 时，linux cpu0 默认配置为主核  

```
primary = <0x0>;
};
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
```

#镜像加载列表：当存在多个 amp 镜像时，  

# 如: loadables = "amp0", "amp1", "amp2", "amp3"...  

#当 CPU0 为启动核时，实际加载顺序为：amp1--&gt;amp2--&gt;amp3-&gt;...-  

&gt;amp0  

#依次类推，启动核由于在 boot 阶段被占用，在 AMP 中将是最后一个启  

动  

#加载镜像，该示例中有“amp1″、“amp2"、“amp3"  

```
loadables = "amp0", "amp1", "amp2", "amp3";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
};
}i
};
```

##### 5.2.2.2 示例固件：RT-Thread + HAL



<p className="rockchip-figure-caption">图 5-1-5 rtt + hal + hal + hal</p>

RT-Thread + HAL 的打包文件 amp\_linux.its 配置如下：

```
description = "FIT source file for rockchip AMP";
#address-cells = <1>;
images {
amp0 {
```

＃……  

```
}
amp1 {
description  = "bare-mental-core3";
data = /incbin/("cpu1.bin");
type = "firmware";
compression = "none";
arch = "arm"; # arm or arm64，默认arm
cpu = <0x1>; # CPU ID
thumb = <0>;
hyp = <0>;
load = <0x00800000>； # DRAM 起始位置
```

#编译配置，编译解释后，编译脚本自动清除  

```
compile {
size = <0x00800000>; # DRAM 大小
srambase = <0xfe480000>; # SRAM 起始位置
sramsize = <0x00010000>; # SRAM 大小
sys = "rtt"; # CPU 运行系统： HAL or RT-
```

Thread  

# RT-Thread 编译配置文件  

rtt\_config= "board/rk3562\_evb1\_lp4x/defconfig"  

```
};
udelay = <10000>；# CPU 启动延时，多个 CPU 依次启动时的
```

延时时间

```hcl
hash {
algo = "sha256";
};
}
amp2 {
#………
amp3 {
………
};
# 一个 images 下，可以包含多个子节点，SDK 会遍历所有 images 下的节点，根据
节点信息，自动编译打包
};
#共享内存信息，编译配置，编译解释后，编译脚本自动清除
share {
shm_base = <0x07800000>； # 多核 CPU 共享 SDRAM 内存起始地址
shm_size = <0x00400000>； # 多核 CPU 共享 SDRAM 内存分配大小
rpmsg base = <0x07C00000>； # RPMSG 共享内存起始地址
rpmsg size = <0x00500000>；# RPMSG 共享内存分配大小
#主系统核心 ID，当多个 AMP 包含多个系统时，该参数设定主系统的 CPU ID
# 纯 RTOS AMP 中默认为"0x01"
# 当 AMP 系统中包含 linux 时，linux cpu0 默认配置为主核
primary = <0x0>;
};
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
#镜像加载列表：当存在多个amp镜像时，
# 如: loadables = "amp0", "amp1", "amp2", "amp3"...
#当 CPU0 为启动核时，实际加载顺序为：amp1-->amp2-->amp3->...
>amp0
#依次类推，启动核由于在 boot 阶段被占用，在 AMP 中将是最后一个启
动
#加载镜像，该示例中有“amp1"、“amp2"、“amp3"
loadables = "amp0", "amp1", "amp2", "amp3";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
}i
};
};
```

### 5.3 AP + MCU 启动方案

#### 5.3.1 Linux + MCU RTOS / Bare-metal

##### 5.3.1.1 示例固件：Kernel + mcu RT-Thread / HAL



<p className="rockchip-figure-caption">图 5-1-6 kernel + mcu rtt / hal</p>

Kernel + mcu RT-Thread / HAL 的打包文件 amp\_linux.its 配置如下：

/dts-v1/;   

```
/{
description = "Rockchip AMP FIT Image";
#address-cells = <1>;
images {
mcu {
description = "mcu";
data = /incbin/("./mcu.bin"); // hal、rtt 系统编译
```

出来固件统一为 mcu.bin   

type = "standalone"; // must be   

"standalone"   

```
compression = "none";
arch = "arm"; // "arm64" or
"arm", the same as U-Boot state
load = <0x08200000>; // MCU 程序 RAM 启动地址
udelay = <1000000>; // 启动延时时间
hash {
algo = "sha256";
};
}i
};
configurations {
default = "conf";
conf {
```

```hcl
description = "Rockchip AMP images";
rollback-index = <0x0>;
#加载镜像，该示例中只有“mcu"
loadables = "mcu";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
};
};
};
```

### 5.4 不同存储的启动方案

SDK支持多种存储介质的启动方案，如eMMC、Flash、SD卡等。这使得开发人员能够更好地利用不同存储设备的优势，并根据具体的项目需求选择最合适的存储方案。

#### 5.4.1 eMMC / Flash 启动

瑞芯微方案通常使用eMMC/Flash作为主要引导设备来启动系统。系统的引导加载器和操作系统内核等固件存储在 eMMC / Flash 芯片中。主要流程为：

1. 加电启动：

。当芯片上电时，执行器件内部的引导ROM代码。

。引导ROM负责加载引导加载器（Bootloader）到内存中。

2. 引导加载器（Bootloader）：

。 引导加载器是位于 eMMC/Flash存储设备的引导分区中的一段特殊代码。

。 引导加载器通常是U-Boot或者瑞芯微提供的自定义引导加载器。

。 引导加载器从 eMMC /Flash的引导分区中加载Linux 内核映像到内存中。

。引导加载器还可以加载设备树文件（DeviceTreeBlob，DTB）和其他必要的文件。4. 内核启动：

。加载的内核映像被解压缩到内存中，并开始执行。

。内核初始化硬件、设置中断、启动调度器等。

。内核根据设备树文件（DTB）的信息来配置和识别硬件设备。

。 内核启动时会挂载根文件系统。

5. 文件系统挂载：

。内核根据设备树文件（DTB）中的指示，挂载eMMC/Flash中的根文件系统。

。根文件系统可以是 ext4、FAT等文件系统类型。

。文件系统挂载完成后，系统可以访问文件系统中的文件和目录。

6. 用户空间初始化：

。初始化脚本或系统服务负责启动用户空间进程和服务。

。用户空间进程和服务可以根据需要启动应用程序、网络服务等。

具体细节及配置可以参考《Rockchip\_Developer\_Guide\_UBoot\_Nextdev\_CN.pdf》文档中 Storage 部分的描述。

### 5.5 快速启动方案

#### 5.5.1 SD卡启动

SD启动卡是通过RK的工具制作，实现直接从SD卡启动，极大的方便用戶更新启动新固件而不用重新烧写固件到设备存储内。具体实现是将固件烧写到SD卡中，把SD卡当作主存储使用。主控从SD卡启动时，固件以及临时文件都存放在SD卡上，有没有本地主存储都可以正常工作。

具体启动流程及相关细节可以参考《Rockchip\_Developer\_Guide\_UBoot\_Nextdev\_CN.pdf》和《Rockchip\_Developer\_Guide\_SD\_Boot\_CN.pdf》两份文档中SD卡启动部分的描述。

### 5.6 快速启动方案

SDK支持系统快速启动方案。通过利用SoC内置的一个高性能的MCU，在启动阶段协助AP端进行一些简单的线程操作，从而实现操作任务的快速进行。

#### 5.6.1 SPL启动方案

SPL方案指的是通过将MCU固件提前到SPL阶段释放和加载，减少了上电到MCU固件加载的时间。

以RK3562为例，从上电到MCU上第一个控制业务完成时间最快可以达到200mS。

SPL启动方案具体配置如下：

SPL 阶段启动需要在 rkbin 仓库下，修改 RKTRUST/RK3562TRUST.ini，启用 MCU。默认固件运行在0x08200000上。

MCU=bin/rk35/rk3562\_mcu\_v1.00.bin,0x08200000,okay

在uboot仓库下，使用以下命令编译：

```shell
./make.sh rk3562 --spl-new
```

MCU 固件打包到 uboot.img 中，由 SPL 负责加载和释放。

#### 5.6.2 双存储启动方案

双存储方案指的是Nor + eMMC搭配的方案，将MCU固件存放到一个小内存的Flash中，AP固件放在eMMC固件中。由于Flash上电初始化的时间相比 eMMC上电初始化的时间少很多，MCU固件就能够更快速的加载起来。

双存储方案具体配置请参考文档《Rockchip\_Developer\_Guide\_Dual\_Storage\_CN.pdf》。

## 第 6 章 通信方案

### 6.1 核间中断触发

瑞芯微AMP通信方案采用中断+共享内存的方式实现，发送端在更新共享内存中数据后，通过触发中断通知接收端进行处理，目前提供三种核间中断触发方式，分别是Mailbox中断触发、软件中断触发及SGI触发。另外，瑞芯微多核异构系统通常还会提供Hardware Spinlock来进行可靠的原子操作。

#### 6.1.1 Mailbox 中断触发

使用 RK Mailbox 模块进行核间通信，在触发 Mailbox 中断的同时，可以传输一个 32 bit 的 Command 寄存器数据和一个32 bit的 Data 寄存器数据。

```c
#ifdef PRIMARY CPU
// Master中断处理，会在此处回调函数
static void mbox master isr(int vector, void *param)
{
HAL MBOX IrqHandler(vector, pMBox);
HAL GIC EndOfInterrupt(vector);
// 在 Mailbox 中断中回调
static void mbox_master_cb(struct MBOX_CMD_DAT *msg, void *args)
{
uint32_t cpu_id;
struct MBOX_CMD_DAT rx_msg = *msg;
cpu id = HAL CPU TOPOLOGY GetCurrentCpuId();
// 处理接收到的 32 bit 的 Command 数据和一个 32 bit 的 Data 数据
printf("mbox master: recieve cpu-%ld cmd=0x%lx data=0x%lx\n", cpu id,
rx msg.CMD, rx msg.DATA);
}
#else
// Remote 中断处理，会在此处回调函数
static void mbox remote isr(int vector, void *param)
{
HAL MBOX IrqHandler(vector, pMBox);
HAL GIC EndOfInterrupt(vector);
一
static void mbox remote cb(struct MBOX CMD DAT *msg, void *args)
1
uint32_t cpu_id;
struct MBOX_CMD_DAT rx_msg = *msg;
cpu id = HAL CPU TOPOLOGY GetCurrentCpuId();
// 处理接收到的 32 bit 的 Command 数据和一个 32 bit 的 Data 数据
printf("mbox remote: recieve cpu-%ld cmd=0x%lx data=0x%lx\n", cpu_id,
rx msg.CMD, rx msg.DATA);
}
#endif
```

```c
#ifdef PRIMARY_CPU
// Master 端通道注册
static struct MBOX_CLIENT mbox_client2_m = { "mbox-cl2m", MBOX0_CH2_B2A_IRQn,
mbox_master_cb, (void *)MBOX_CH_2 };
static void mbox_master_test(void)
struct MBOX_CLIENT *mbox_cl2m;
struct MBOX_CMD_DAT tx_msg;
uint32_t cpu_id;
int ret = 0;
cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
mbox_cl2m = &mbox_client2_m;
tx_msg.CMD = cpu_id & 0xFU;
tx_msg.DATA = 0x12345678;
/* master core uses MBOX_A2B and remote core uses MBOX_B2A */
HAL_MBOX_Init(pMBox, MBOX_A2B);
ret = HAL_MBOX_RegisterClient(pMBox, MBOX_CH_2, mbox_cl2m);
if (ret) {
printf("mbox_cl2m register failed, ret=%d\n", ret);
}
HAL_IRQ_HANDLER_SetIRQHandler(MBOX0_CH2_B2A_IRQn, mbox_master_isr, NULL);
HAL_GIC_Enable(MBOXO_CH2_B2A_IRQn);
HAL_DelayMs(4000);
printf("mbox master: send cmd=0x%lx data=0x%lx\n", tx_msg.CMD, tx_msg.DATA);
// 发送数据，32 bit 的 Command 数据和一个 32 bit 的 Data 数据
HAL_MBOX_SendMsg(pMBox, MBOX_CH_2, &tx_msg);
}
#endif
#ifdef CPU2
// Remote 端通道注册
static struct MBOX_CLIENT mbox_client2_r = { "mbox-cl2r", MBOX0_CH2_A2B_IRQn,
mbox remote cb, (void *)MBOX CH 2 };
static void mbox_remote_test(void)
struct MBOX_CLIENT *mbox_cl2r;
struct MBOX_CMD_DAT tx_msg;
uint32_t cpu_id;
int ret = 0;
cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
mbox_cl2r = &mbox_client2_r;
tx_msg.CMD = cpu_id & 0xFU;
tx_msg.DATA = 0x98765432;
/* master core uses MBOX_A2B and remote core uses MBOX_B2A */
HAL_MBOX_Init(pMBOx, MBOX_B2A);
ret = HAL_MBOX_RegisterClient(pMBox, MBOX_CH_2, mbox_cl2r);
if (ret) {
printf("mbox_cl2r register failed, ret=%d\n", ret);
}
HAL_IRQ_HANDLER_SetIRQHandler(MBOX0_CH2_A2B_IRQn, mbox_remote_isr, NULL);
HAL_GIC_Enable(MBOXO_CH2_A2B_IRQn);
HAL_DelayMs(2000);
```

```c
printf("mbox remote: send cmd=0x%lx data=0x%lx\n", tx_msg.CMD, tx_msg.DATA);
// 发送数据，32 bit 的 Command 数据和一个 32 bit 的 Data 数据
HAL MBOX SendMsg(pMBox, MBOX CH 2, &tx msg);
}
#endif
```

#### 6.1.2 软件中断触发

使用 GIC SPI 中断，即共享外设中断中的 reserved irq，通过主动 Send Pending 触发。

```c
static void soft_isr(int vector, void *param)
printf("soft isr, vector = %d\n", vector);
HAL GIC EndOfInterrupt(vector);
一
static void softirq test(void)
HAL_IRQ_HANDLER_SetIRQHandler(RSVD0_IRQn, soft_isr, NULL);
HAL_GIC_Enable(RSVD0_IRQn);
// 触发软中断
HAL_GIC_SetPending(RSVD0_IRQn);
一
```

#### 6.1.3 SGI 触发

使用 GIC SGI，即软中断触发。由于 Linux SMP 占用了8个 non-secure SGI 中断号，而另外8个 secure的SGI中断号需要特殊申请。因此，SGI触发的方式常用于多个从核进行同步。

```c
#define IPI CPUO 0x01
#define IPI_CPU1 0x02
#define IPI CPU2 0x04
#define IPI_CPU3 0x08
#define IPI_TO_TARGETLIST 0
#define IPI_TO_ALL_EXCEPT_SELF 1
static void ipi_sgi_isr(int vector, void *param)
uint32_t cpu_id;
cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
if (cpu_id == 2) {
HAL DelayMs(1000);
} else if (cpu_id == 3) {
HAL_DelayMs(2000);
}
printf("ipi sgi: cpu_id=%ld vector = %d\n", cpu_id, vector);
HAL GIC EndOfInterrupt(vector);
一
static void ipi_sgi_test(void)
uint32_t cpu_id;
```

hal/middleware/rpmsg-lite/lib/rpmsg\_lite/porting/platform/RKXX/rpmsg\_platform.c  

RTOS 下 RPMsg-Lite 参考如下路径的代码：  

rtos/rockchip/common/drivers/rpmsg-  

lite/lib/rpmsg\_lite/porting/platform/RKXX/rpmsg\_platform.c

```c
cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
HAL_IRQ_HANDLER_SetIRQHandler(IPI_SGI7, ipi_sgi_isr, NULL);
HAL_GIC_Enable(IPI_SGI7);
if (cpu_id == 1) {
printf("ipi sgi: cpu_id=%ld test start\n", cpu_id);
HAL_DelayMs(2000);
// 触发 CPUO SGI7中断
HAL_GIC_SendSGI(IPI_SGI7, 0, IPI_TO_ALL_EXCEPT_SELF);
HAL_DelayMs(4000);
HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3, IPI_TO_TARGETLIST);
HAL_DelayMs(4000);
HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3 I IPI_CPU2, IPI_TO_TARGETLIST);
HAL_DelayMs(4000);
HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3 I IPI_CPU2 I IPI_CPUO,
IPI TO TARGETLIST);
}
}
```

### 6.2 底层接口方案

瑞芯微多核异构系统开放核间中断+Shared Memory底层驱动接口给客户，对于已经在使用多核异构系统的客户，可以直接替换相应底层驱动接口，完成平台移植工作。

RK AMP 目前核间中断触发方式支持 Mailbox、软件中断，共享内存 Linux 仅支持 uncache，其余默认支持 cacheable

### 6.3 RPMsg 协议方案

#### 6.3.1 标准框架

瑞芯微为多核异构系统提供了 RPMsg 协议标准框架方案，Linux Kernel 适配 RPMsg，RTOS 和 Bare-metal适配RPMsg-Lite。它定义了AMP系统中核与核之间进行通信时所使用的标准二进制接口。

因此从整体框架上看，RPMsg 是由 Master Core 和 Remote Core 的核间中断，以及 vring0、vring1、vdevbuffer 三段 Shared Memory 构成。



#### 6.3.2 通信流程



因此当主核（Master Core）和从核（Reomte Core）进行通信时：

1. Master Core 发送时，从 vring0(USED) 中取得一块 buffer，再将消息按照 RPMsg 协议填充

2. 将处理好的内存 buffer 链接到 ving1(AVAIL)

3. 触发中断通知 Remote Core 有数据处理待处理



类似的，当从核需要和主核进行通信时：

1. 从核根据队列从 vring1(AVAIL) 中取得一块 buffer，再将消息按照 RPMsg 协议填充

2. 将处理好的内存 buffer 链接到 ving0(USED)

3. 触发中断通知 Master Core 有数据处理待处理



完成消息传递后，释放使用的buffer，并等待下一笔数据发送。从核发送时，与主核发送流程相反。通信过程中的共享数据放在vdev buffer中。



#### 6.3.3 RPMsg 适配

##### 6.3.3.1 Linux Kerne l适配 RPMsg

Linux Kerne RPMsg 主要代码结构：



kernel/drivers/rpmsg/rockchip\_rpmsg\_mbox.c 是注册在 Platform Bus 上的 driver，同时向 VirtIO Bus 注册device。它是基于 mailbox 核间中断加 Shared Memory 底层驱动接口实现的物理层（Physical Layer）。

kernel/drivers/rpmsg/rockchip\_rpmsg\_softirq.c 也是注册在 Platform Bus 上的 driver，同时向 VirtIO Bus 注册device。它是基于 softirq 核间中断加 Shared Memory 底层驱动接口实现的物理层（Physical Layer）。

kernel/drivers/rpmsg/virtio\_rpmsg\_bus.c 是注册在 VirtIO Bus 上的 driver，同时向 RPMsg Bus 注册 device。  

VirtIO 和Virtqueue 是通用 RPMsg 协议选择的MAC层（MAC Layer）。

kernel/drivers/rpmsg/rpmsg\_core.c 则是创建 RPMsg Bus，并提供传输层（Transport Layer）接口。

kernel/drivers/rpmsg/rockchip\_rpmsg\_test.c 提供一个简单的核间通信通道创建和数据收发的示例。

### RPMsg TTY支持

Linux kernel 同时支持将 RPMsg 挂载成 TTY 设备，其原理和软件结构和上述的 Linux 一致，Linux 端RPMsg一般作为Master，在与Remote进行连接时需要创建终端(endpoint)，一个通道(channel)允许创建多个终端，通过服务器名称(service name)来创建的不同终端，也就是说在Linux(Master)的本地服务器名称(local service name)和远程 Remote的发送的服务器名称相匹配时，在通道(channel)的两端就创建了两个可以相互通信的终端。

如kernel/drivers/rpmsg/rockchip\_rpmsg\_test.c:

```c
static struct rpmsg_device_id rockchip_rpmsg_test_id_table[] = {
{ .name = "rpmsg-ap3-ch0" },
{ .name = "rpmsg-mcu0-test" },
{ .name = "rpmsg-perf-bw-test" },
{ .name = "rpmsg-perf-pingpong-bw-test" },
{ .name = "rpmsg-latency-test" },
{ /* sentinel */ },
};
```

在 kernel/drivers/rpmsg/rockchip\_rpmsg\_test.c 声明了如上几个服务器名称(service name)，而 Remote 端在Link完成后，可以通过发送对应的服务器名称来创建链接，在名称匹配时调用probe函数。

TTY 创建示例如下：

Remote 端在创建终端后，使用 rpmsg\_ns\_announce 发送"rpmsg-tty"服务器名称：

kernel/drivers/tty/rpmsg\_tty.c

```lisp
static struct rpmsg_device_id rpmsg_driver_tty_id_table[] = {
{ .name = "rpmsg-tty" },
{},
};
```

RPMsg-Lite 是第三方开源方案，结构与 Linux RPMsg 类似。

RPMsg-Lite 主要代码结构：



实际的内存访问是在 virtqueue.c 中实现的，主要定义用来管理共享内存使用的数据结构，例如 vring或virtqueue。

移植部分为两个层：environment 和platform。environment 将针对每个环境单独实现，如裸机环境 Bare-metal 在 rpmsg\_env\_bm.c 中实现，RT-Thread 环境在 rpmsg\_env\_rt\_thread.c 中实现，当然，开发者也可以参考这部分代码，实现对指定 RTOS 的支持。platform 在 rpmsg\_platform.c 中实现，主要实现中断配置和触发，如上文介绍，可以在这一阶段使用不同的中断（MailBox或软中断）。如果存在cache或者共享内存地址的偏移，也需要在platform中进行具体的操作，RPMsg-Lite可以参考：



##### 6.3.3.3 MCU RPMsg-Lite 适配

MCU同样使用RPMsg-Lite，需要注意的是由于MCU存在内存的映射，如果想要改变共享内存的地址，需要重新配置 uboot 和 rpmsg\_platform.c。目前 RPMsg 的共享内存都处于 unCache 下，所以不需要刷新Cache来保证内存数据一致，对于有MCU的平台只需要注意共享内存地址的映射，一般MCU的地址映射会在Uboot 中进行初始化。

在MCU端RAM的起始地址由ITS 配置传入，和实际的物理地址存在偏移，所以MCU看到的共享内存地址和真实的物理地址也存在偏移，这里建议将共享内存的地址放在MCU之后，方便后续操作。

```c
int fit_standalone_release(char *id, uintptr_t entry_point)
{
/* bus m0 configuration: */
/* open hclk_dcache / hclk_icache / clk_bus m0 rtc / fclk_bus_m0_core */
writel(0x03180000, TOP_CRU_BASE + TOP_CRU_GATE_CON23);
/* open bus m0 sclk / bus m0 hclk / bus m0 dclk */
writel(0x00070000, TOP CRU BASE + TOP CRU CMO GATEMASK);
/*
* mcu cache peripheral addr
* The uncache area ranges from 0x7c00000 to 0xffb400000
* and contains rpmsg shared memory
*/
/*这里将0x07c00000到0xffb40000都设置为了uncahce，确保共享内存处于uncache*/
writel(0x07c00000, SYS_GRF_BASE + SYS_GRF_SOC_CON5);
writel(0xffb40000, SYS_GRF_BASE + SYS_GRF_SOC_CON6);
/*配置MCU RAM的起始地址*/
sip_smc_mCu_config(ROCKCHIP_SIP_CONFIG_BUSMCU_0_ID,
ROCKCHIP SIP CONFIG MCU CODE START ADDR,
0xffff0000 | (entry point >> 16));
```

```c
/* release dcache / icache / bus m0 jtag / bus m0 */
writel(0x03280000, TOP_CRU_BASE + TOP_CRU_SOFTRST_CON23);
/* release pmu m0 jtag / pmu m0 */
/* writel(0x00050000, PMU1_CRU_BASE + PMU1_CRU_SOFTRST_CON02); */
return 0;
}
```

MCU的 amp.its 中：

```proto
/*
* Copyright (C) 2023 Rockchip Electronics Co., Ltd
大
* SPDX-License-Identifier: GPL-2.0
*/
/dts-v1/;
/{
description = "Rockchip AMP FIT Image";
#address-cells = <1>;
images {
mcu {
description = "mcu";
data = /incbin/("./mcu.bin");
type = "standalone"; // must be "standalone"
compression = "none";
arch = "arm"; // "arm64" or "arm", the same as U-Boot
state
load = <0x07b00000>; //MCU RAM 起始地址
udelay = <1000000>;
hash {
algo = "sha256";
};
};
};
configurations {
default = "conf";
conf {
description = "Rockchip AMP images";
rollback-index = <0x0>;
loadables = "mcu";
signature {
algo = "sha256,rsa2048";
padding = "pss";
key-name-hint = "dev";
sign-images = "loadables";
};
};
};
};
```

gcc bus m0.1d配置中可以看到，共享内存的地址是一个偏移地址：

```solidity
/* SPDX-License-Identifier: BSD-3-Clause */
/*
* Copyright (c) 2023 Rockchip Electronics Co., Ltd.
*/
MEMORY
# RAM 起始地址，真实物理地址 0x07b00000
RAM(rxw) : ORIGIN = 0x00000000, LENGTH = 0x100000
# RPMsg 共享内存地址，真实物理地址 0x07c00000
LINUX RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
```

同时内存的管理由 Master 负责，MCU 作为 Remote 端，从 vring 中取到的 buffer 地址为真实物理地址，所以在发送/接收时都需要对申请到地址进行偏移处理，参考rpmsg\_platform.c

```c
#ifdef HAL MCU CORE
/* MCU offset address */
#ifdef HAL CACHE DECODED ADDR BASE
#define RL PHY MCU OFFSET HAL CACHE DECODED ADDR BASE
#else
#define RL_PHY_MCU_OFFSET (OU)
#endif
#endif
/**
platform_patova
*
Dummy implementation
*/
void *platform patova(uint32 t addr)
{
#ifdef HAL MCU CORE
addr -= RL PHY MCU OFFSET;
#endif
return ((void *) (char *)addr);
}
```

### 6.4 RPMsg 编译配置

#### 6.4.1 Kernel + RT-Thread

Kernel 配置：

```markdown
## 第6章 开启MailBox支持
CONFIG MAILBOX=Y
CONFIG_ROCKCHIP_MBOX=Y
## 第6章 MailBox 中断触发
CONFIG_RPMSG_ROCKCHIP_MBOX=Y
CONFIG_RPMSG_VIRTIO=Y
```

开启TTY的支持：

CONFIG\_RPMSG\_TTY=Y

RT-Thread 配置：  

运行 scons --menuconfig

```markdown
## 第6章 开启RPMsg-Lite 支持
CONFIG RT USING RPMSG LITE=Y
## 第6章 开启Linux+RTT RPMsg
CONFIG_RT_USING_LINUX_RPMSG=Y
```

#### 6.4.2 Kernel + HAL

Kernel 配置：

### 第6章 开启MailBox支持

CONFIG MAILBOX=Y  

CONFIG\_ROCKCHIP\_MBOX=Y  

### 第6章 MailBox 中断触发

CONFIG\_RPMSG\_ROCKCHIP\_MBOX=Y  

CONFIG\_RPMSG\_VIRTIO=y

### HAL 配置：

HAL默认开启 RPMSG 的支持，可以参考RPMsg 测试示例章节，开启使用 HAL 的测试 demo。

```c
// 在test demo.c 中开启
#define RPMSG_LINUX_TEST
```

#### 6.4.3 RT-Thread + HAL

RT-Thread 配置：  

运行 scons --menuconfig

```markdown
## 第6章 开启RPMsg-Lite 支持
CONFIG_RT_USING_RPMSG_LITE=Y
```

### 6.5 RPMsg 测试示例

#### 6.5.1 Kernel + RT-Thread

Kernel RPMSG核间通信框架，底层适配使用 VirtIO方案。主要代码路径如下：

kernel/drivers/rpmsg/rpmsg\_core.c   

kernel/drivers/rpmsg/virtio\_rpmsg\_bus.c   

kernel/drivers/rpmsg/rockchip\_rpmsg\_softirq.c   

kernel/include/linux/rpmsg/rockchip\_rpmsg.h

##### 6.5.1.1 共享内存

以 SDK 提供的 demo 为例，划分 5M 共享内存给 RPMSG，其中 4M 为 VRING BUFFER，1M 为 VDEVBUFFER。目前共享内存仅支持unCache。

Kernel Path: SDK/kernel/arch/arm64/boot/dts/rockchip/rkxxxx-amp.dtsi

```
reserved-memory {
#address-cells = <2>;
#size-cells = <2>;
ranges;
```

/\* remote amp core address \*/   

```dts
amp_reserved: amp@2e00000 {
reg = <0x0 0x2e00000 0x0 0x1200000>;
no-map;
};
rpmsg_reserved: rpmsg@7c00000 {
reg = <0x0 0x07c00000 0x0 0x400000>;
no-map;
};
rpmsg_dma_reserved: rpmsg-dma@8000000 {
compatible = "shared-dma-pool";
reg = <0x0 0x08000000 0x0 0x100000>;
no-map;
};
};
```

RTT Path: SDK/rtos/bsp/rockchip/rk3308-32/board/common/board\_base.c

1.MMU 映射为 unCache   

```
{LINUX SHMEM BASE, LINUX SHMEM BASE + LINUX SHMEM SIZE - 1, LINUX SHMEM BASE,
UNCACHED MEM},
```

##### 6.5.1.2 测试 Demo

##### 6.5.1.2.1 Kernel Demo

在 Kernel 工程中修改配置文件 kernel/arch/arm64/configs/xxxx\_defconfig

CONFIG\_RPMSG\_ROCKCHIP\_TEST

### 或者 menuconfig 配置菜单配置:

```shell
## 第6章 打开配置界面
make ARCH=arm64 rkxxxx_linux_defconfig
make ARCH=arm64 menuconfig
#打开以下宏开关
CONFIG RPMSG ROCKCHIP TEST
## 第6章 保存配置
make ARCH=arm64 savedefconfig
cp defconfig arch/arm64/configs/rkxxxx_linux_defconfig
```

### Kernel Demo Path: kernel/drivers/rpmsg/rockchip\_rpmsg\_test.c

```c
1.demo主要流程
static struct rpmsg driver rockchip rpmsg test = {
.drv.name = KBUILD MODNAME,
.drv.Owner = THIS MODULE,
.id_table = rockchip_rpmsg_test_id_table,
·probe = rockchip_rpmsg_test_probe,
.callback = rockchip rpmsg test cb,
.remove = rockchip_rpmsg_test_remove,
};
2.rockchip rpmsg test id table
/*等待从核announce完声明一个新的ept name,如果和下面链表中的name对应则进入probe函数中 */
static struct rpmsg device id rockchip rpmsg test id table[] = {
{ .name = "rpmsg-ap3-ch0" },
{ .name = "rpmsg-mcu0-test" },
{ /* sentinel */ },
};
3.rockchip rpmsg test probe
static int rockchip rpmsg test probe(struct rpmsg device *rp)
int ret, size;
uint32 t master ept id, remote ept id;
struct instance data *idata;
master_ept_id = rp->src;
remote ept id = rp->dst;
dev_info(&rp->dev, "new channel: 0x%x -> 0x%x!\n", master_ept_id,
remote_ept_id);
/*probe发一笔数据过去给remote,让remote知道master ept id*/
ret = rpmsg send(rp->ept, LINUX TEST MSG 1, strlen(LINUX TEST MSG 1));
if (ret) {
dev err(&rp->dev, "rpmsg send failed: %d\n", ret);
return ret;
一
/*运行测试*/
ret = rpmsg sendto(rp->ept, LINUX TEST MSG 2, strlen(LINUX TEST MSG 2),
remote_ept_id);
if (ret) {
dev err(&rp->dev, "rpmsg send failed: %d\n", ret);
return ret;
```

```c
}
return 0;
一
4.rockchip_rpmsg_test_cb
static int rockchip_rpmsg_test_cb(struct rpmsg_device *rp, void *payload,
int payload_len, void *priv, u32 src)
int ret, size;
uint32 t remote ept id;
struct instance_data *idata = dev_get_drvdata(&rp->dev);
/* master发完一笔数据给remote后，remote也会发一笔数据过来 */
remote_ept_id = src;
dev info(&rp->dev, "rx msg %s rx count %d(remote ept id: 0x%x)\n",
(char *)payload, ++idata->rx_count, remote_ept_id);
/* 测试来回收发10000后退出 */
if (idata->rx_count >= MSG_LIMIT) {
dev_info(&rp->dev, "Rockchip rpmsg test exit!\n");
return 0;
}
/* 收到数据后再次发送一个数据给对端 */
ret = rpmsg_sendto(rp->ept, LINUX_TEST_MSG_2, strlen(LINUX_TEST_MSG_2),
remote_ept_id);
if (ret)
dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
return ret;
}
```

具体接口函数说明如下：


| 函数 | 说明 |
| --- | --- |
| rpmsg_send() | 向远程处理器发送消息 |
| rpmsg_sendto() | 向远程处理器发送消息，指定 remote ept id |

##### 6.5.1.2.2 RTT Demo

配置菜单配置：scons --menuconfig

CONFIG\_RT\_USING\_RPMSG\_LITE=Y  

CONFIG RT USING LINUX RPMSG=Y  

CONFIG\_RT\_USING\_COMMON\_TEST\_LINUX\_RPMSG\_LITE=Y

RTT Demo Path: rtos/bsp/rockchip/common/tests/rpmsg\_test.c

```c
static void rpmsg linux test(void)
{
```

```c
int j;
uint32 t master id, remote id;
struct rpmsg_info_t *info;
struct rpmsg_block_t *block;
rpmsg_queue_handle remote_queue;
char *rx_msg = (char *)rt_malloc(RL_BUFFER_PAYLOAD_SIZE);
uint32_t master_ept_id;
uint32_t ept_flags;
void *ns_cb_data;
rpmsg_share_mem_check();
master_id = MASTER_ID;
remote_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
rt_kprintf("rpmsg remote: remote core cpu_id-%ld\n", remote_id);
rt_kprintf("rpmsg remote: shmem_base-0x%lx shmem_end-%lx\n",
RPMSG_LINUX_MEM_BASE, RPMSG_LINUX_MEM_END);
info = malloc(sizeof(struct rpmsg_info_t));
if (info == NULL) {
rt_kprintf("info malloc error!\n");
while (1) {
;
}
1
info->private = malloc(sizeof(struct rpmsg_block_t));
if (info->private == NULL) {
rt_kprintf("info malloc error!\n");
while (1) {
;
}
}
/*初始化rpmsg ept*/
info->instance = rpmsg_lite_remote_init((void *)RPMSG_LINUX_MEM_BASE,
RL_PLATFORM_SET_LINK_ID(master_id, remote_id), RL_NO_FLAGS);
rpmsg_lite_wait_for_link_up(info->instance);
rt_kprintf("rpmsg remote: link up! link_id-0x%lx\n",
info->instance->link_id);
rpmsg_ns_bind(info->instance, rpmsg_ns_cb, &ns_cb_data);
remote_queue = rpmsg_queue_create(info->instance);
info->ept = rpmsg_lite_create_ept(info->instance,
RPMSG_RTT_REMOTE_TEST3_EPT_ID, rpmsg_queue_rx_cb, remote_queue);
/*从核announce完声明一个新的ept name与master端对应*/
ept_flags = RL_NS_CREATE;
rpmsg_ns_announce(info->instance, info->ept,
RPMSG_RTT_REMOTE_TEST_EPT3_NAME, ept_flags);
/****************** rpmsg test run **************/
for (j = 0; j < 100; j++)
{
rpmsg_queue_recv(info->instance, remote_queue,
(uint32_t *) &master_ept_id, rx_msg,
RL_BUFFER_PAYLOAD_SIZE, RL_NULL, RL_BLOCK);
11 rpmsg_queue_recv_nocopy(remote_rpmsg, remote_queue, (uint32_t *)&src,
(char **) &rx_msg, RL_NULL, RL_BLOCK);
rt_kprintf("rpmsg remote: master_ept_id-0x%lx rx_msg: %s\n",
master_ept_id, rx_msg);
```

```c
rpmsg_lite_send(info->instance, info->ept, master_ept_id,
RPMSG RTT TEST MSG, strlen(RPMSG RTT TEST MSG), RL BLOCK);
}
}
```

具体接口函数说明如下：


| 函数 | 说明 |
| --- | --- |
| rpmsg_lite_remote_init() | RPMsg-lite remote 端初始化 |
| rpmsg_queue_create() | RPMsg-lite 创建队列 |
| rpmsg_lite_create_ept() | 创建端点 |
| rpmsg_queue_recv() | 接收到的数据自动复制到缓存区 |
| rpmsg_ns_bind() | 绑定 name service ept（0x35这个ept id是专门给name service用于传新通道的名字） |
| rpmsg_ns_announce() | 声明 remote new ept name |
| rpmsg_lite_send() | 发送消息 |

##### 6.5.1.2.3 测试成功log

Linux master core RPMSG 成功挂载能看到如下打印：

1.105178] rockchip-rpmsg 7c00000.rpmsg: rockchip rpmsg platform probe.   

1.105228] rockchip-rpmsg 7c00000.rpmsg: assigned reserved memory node   

rpmsg\_dma@8000000   

[ 1.105239] rockchip-rpmsg 7c00000.rpmsg: rpdev vdev0: vring0 0x7c00000,   

vring1 0x7c08000   

[ 1.105720] virtio\_rpmsg\_bus virtio0: rpmsg host is online

remote core 发起 name service announce 后，Linux master core 能看到如下打印：

其中，rpmsg-ap3-ch0 为 ept name，0x400 为 Master ept id，0xc3 为 Remote ept id。

RT-Thread 测试结果，开机 log 信息如下：

```snap
[(3)0.101.712] rpmsg remote: remote core cpu_id-3
[(3)0.101.890] rpmsg remote: shmem_base-0x7c00000 shmem_end-8100000
[(3)0.506.840] rpmsg remote: link up! link_id-0x3
```

RPMSG FLAG 定义如下

```c
/* rpmsg flag bit definition
* bit 0: Set 1 to indicate remote processor is ready
* bit 1: Set 1 to use reserved memory region as shared DMA pool
* bit 2: Set 1 to use cached share memory as vring buffer
*/
#define RPMSG REMOTE IS READY BIT(0)
#define RPMSG SHARED DMA POOL BIT(1)
#define RPMSG CACHED VRING BIT(2)
```

#### 6.5.2 RT-Thread + HAL

RTOS的RPMsg-lite多核通信是建立在核间中断和共享内存的基础上。通过标准化的框架，实现多核之间的通信。默认配置 CPU 1为 Master，其他 CPU 为 Remote。

##### 6.5.2.1 共享内存

RT-Thread共享内存开始的地址及大小

共享内存区域具体分配

Path: rtos/bsp/rockchip/rkxxxx-32/gcc\_arm.ld.S

```c
.share_lock (NOLOAD):
{
. = ALIGN(64);
PROVIDE(__spinlock_mem_start__ = .);
. += _SPINLOCK_MEM_SIZE;
PROVIDE(__spinlock_mem_end__ = .);
. = ALIGN(64);
} > SHMEM
.share_rpmsg (NOLOAD):
{
. = ALIGN(0x1000);
PROVIDE(__share_rpmsg_start__ = .);
. += SHARE RPMSG SIZE;
PROVIDE(__share_rpmsg_end__ = .);
. = ALIGN(0x1000);
} > SHMEM
.share_data :
{
. = ALIGN(64);
PROVIDE(__share_data_start__ = .);
KEEP(*(.share_data))
PROVIDE(__share_data_end__ = .);
. = ALIGN(64);
} > SHMEM AT > DRAM
```

### HAL共享内存开始的地址及大小

共享内存区域具体分配

Path: hal/project/rkxxxx/GCC/gcc\_arm.ld.S

```c
.share lock (NOLOAD) :
{
. = ALIGN(64);
PROVIDE(__spinlock_mem_start_ = .);
. += SPINLOCK MEM SIZE;
PROVIDE(__spinlock_mem_end__ = .);
. = ALIGN(64);
} > SHMEM
.share_rpmsg (NOLOAD):
{
. = ALIGN(0x1000);
PROVIDE(__share_rpmsg_start___ = .);
. += SHRPMSG_SIZE;
PROVIDE(__share_rpmsg_end__ = .);
. = ALIGN(0x1000);
} > SHMEM
.share ramfs (NOLOAD):
{
. = ALIGN(0x1000);
PROVIDE( share ramfs start = .);
. += SHRAMFS SIZE;
PROVIDE(_share_ramfs_end_ = .);
. = ALIGN(0x1000);
} > SHMEM
.share_log (NOLOAD):
{
. = ALIGN(64);
PROVIDE(_share_log0_start__ = .);
. += SHLOGO SIZE;
PROVIDE(__share_log0_end_ = .);
. = ALIGN(64);
PROVIDE(__share_log1_start__ = .);
. += SHLOG1_SIZE;
PROVIDE(_share_log1_end_ = .);
. = ALIGN(64);
PROVIDE(__share_log2_start__ = .);
. += SHLOG2 SIZE;
PROVIDE(__share_log2_end__ = .);
. = ALIGN(64);
PROVIDE(__share_log3_start__ = .);
. += SHLOG3 SIZE;
PROVIDE(__share_log4_end_ = .);
. = ALIGN(64);
} > SHMEM
```

##### 6.5.2.2 测试demo

6.5.2.2.1 RTT Demo

Path: SDK/rtos/bsp/rockchip/rkxxxx-32

配置菜单配置：scons --menuconfig

CONFIG\_RT\_USING\_RPMSG\_LITE=Y  

CONFIG RT USING COMMON TEST RPMSG LITE=Y

RTT Demo Path: rtos/bsp/rockchip/common/tests/rpmsg\_test.c

RPMsg-lite的核心代码位于：rtos/bsp/rockchip/common/drivers/rpmsg-lite目录下。其具体接口函数说明如下：


| 函数 | 说明 |
| --- | --- |
| rpmsg_lite_master_init() | RPMsg-lite master 端初始化 |
| rpmsg_lite_remote_init() | RPMsg-lite remote 端初始化 |
| rpmsg_lite_wait_for_link_up() | RPMsg-lite remote 端等待初始化链接成功 |
| rpmsg_queue_create() | RPMsg-lite创建队列 |
| rpmsg_lite_create_ept() | 创建端点 |
| rpmsg_queue_recv() | 接收到的数据复制到本地buffer |
| rpmsg_queue_recv_nocopy() | 接收到的数据直接传递指针 |
| rpmsg_lite_send() | 发送消息 |

6.5.2.2.2 HAL Demo

File: SDK/hal/project/rkxxxx/src/main.c

```c
#define TEST_DEMO
#define TEST_USE_RPMSG_INIT
```

File: SDK/hal/project/rkxxxx/src/test\_demo.c

```c
#define RPMSG_TEST
```

HAL Demo Path: hal/project/rkxxxx/src/test\_demo.c

RPMsg-lite的核心代码位于：hal/middleware/rpmsg-lite/目录下。其具体接口函数说明如下：


| 函数 | 说明 |
| --- | --- |
| rpmsg_lite_master_init() | RPMsg-lite master 端初始化 |
| rpmsg_lite_remote_init() | RPMsg-lite remote 端初始化 |
| rpmsg_lite_wait_for_link_up() | RPMsg-lite remote 端等待初始化链接成功 |
| rpmsg_lite_create_ept() | 创建端点 |
| rpmsg_lite_send() | 发送消息 |

##### 6.5.2.2.3 测试结果

在串口终端输入串口命令查看log信息。

\## 第6章 RPMSG 测试命令

msh &gt;rpmsg\_master\_test

$$

```
\begin{array} { r l } & { \mathrm { [ \Gamma ( 1 ) ] 2 2 . 0 8 6 . 4 1 0 ] ~ \ r p m s g _ m a s t e r _ s e n d : ~ m a s t e r [ 1 ] _ - > r e m o t e [ 0 ] ~ , ~ \ r e m o t e ~ \ e p t ~ \ a d d r ~ = 0 , } } \\ & { \mathrm { 0 \times 8 0 0 0 8 0 0 } } \end{array}
```

$$

$$

```
{ \begin{array} { r l } & { \left[ \begin{array} { l } { ( 0 ) 2 2 . 1 5 2 . 7 8 0 ] \mathrm { ~ r p m s g } _ { - } \mathrm { r e m o t e } _ { - } \mathrm { r e c v } \mathrm { : ~ } \mathrm { ~ r e m o t e } [ 0 ] \mathrm { < - \cdot } \mathrm { m a s t e r } [ 1 ] \ , \ \mathrm { m a s t e r ~ e p t ~ } \ \mathrm { a d d r } \ = } \end{array} \right. } \\ & { \ \mathrm { o x } \ 8 0 0 0 0 0 0 0 0 } \end{array} }
```

$$

$$

```
{ \begin{array} { r l } & { [ \mathbf { \Gamma } ( 0 ) ~ 2 2 . 1 5 2 . 9 5 9 ] ~ { \mathrm { r p m s g } } _ { - } { \mathrm { r e m o t e } } _ { - } { \mathrm { s e n d } } \colon ~ { \mathrm { r e m o t e } } [ 0 ] \cdots { \mathrm { s m a s t e r } } [ 1 ] ~ , ~ { \mathrm { m a s t e r } } { \mathrm { ~ e p t } } ~ { \mathrm { a d d r } } = } \\ & { \qquad \quad 0 \times 8 0 0 0 0 0 0 } \end{array} }
```

$$

$$

```
\begin{array} { r l } & { \mathrm { [ \Gamma ( 1 ) ] 2 2 . 1 5 3 . 6 1 6 ] ~ \ r p m s g \ \underline { { m } } a s t e r _ r e c v : ~ m a s t e r [ 1 ] < - r e m o t e [ 0 ] ~ , ~ \ r e m o t e ~ \ e p t ~ \ e a d d r ~ \ = ~ r e m ' { ' } d , } } \\ &  \mathrm { 0 \times 8 0 0 0 8 0 0 ~ \ r e c t : ~ \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t = \ r e c t } \\ & { \mathrm { ~ } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { \mathrm { [ \Gamma ( 2 ) 2 2 . 2 3 1 . 3 9 7 ] ~ r p m s g _ r e m o t e _ r e c v : ~ { \ r e m o t e } [ 2 ] < - \ r e a s t e r [ 1 ] ~ , ~ m a s t e r ~ e p t ~ a d d r ~ = ~ } } \\ & { \mathrm { ~ } } \\ & { \mathrm { 0 \times 8 0 0 0 0 0 0 2 ~ } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { \mathrm { [ \gamma ( 2 ) ~ 2 2 2 . 2 3 1 . ~ 5 8 0 ] ~ r p m s g _ r e m o t e _ s e n d : ~ { \ r e m o t e } [ 2 ] ^ { _ { 1 } - \gamma } } \mathrm { m a s t e r [ 1 ] } , \mathrm { m a s t e r ~ e p t ~ _ s d d r ~ = ~ \gamma ^ { \prime } ~ } } \\ & { \mathrm { 0 \times 8 0 0 0 0 0 0 2 } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { [ \mathbf { ( 1 ) } 2 2 . 2 3 2 . 2 3 7 ] \quad \mathrm { r p m s g _ m a s t e r _ r e c v : ~ m a s t e r : ~ } \operatorname { m a s t e r } \left[ \mathrm { 1 } \right] \gets - \mathrm { r e m o t e } \left[ 2 \right] , \quad \mathrm { r e m o t e ~ } \mathrm { e p t ~ } \mathrm { ~ a d d r ~ } = } \\ & { \mathrm { ~ } } \\ & { \mathrm { 0 \times 8 0 0 0 8 0 0 2 } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { [ \mathrm { ( 1 ) ~ 2 2 . 2 3 2 . 8 9 3 } ] \quad \mathrm { r p m s g _ m a s t e r _ s e n d : ~ m a s t e r [ 1 ] _ } \cdots \mathrm { { y r e m o t e } [ 3 ] } , \quad \mathrm { { r e m o t e } ~ e p t _ \mathrm { a d d r _ } = 0 . } } \\ & { \mathrm { 0 \times 8 0 0 0 8 0 0 } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { \mathrm { [ \gamma ( 3 ) 2 2 . 2 8 6 . 5 2 5 ] r p m s g _ r e m o t e _ r e c v : ~ { \ r e m o t e } [ 3 ] < - m a s t e r [ 1 ] , ~ m a s t e r ~ e p t ~ a d d r ~ = ~ 1 8 6 . 4 4 , } } \\ & { \mathrm { ~ \gamma ( 3 ) 4 . 8 0 0 0 0 0 0 0 3 ~ } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { \mathrm { [ \gamma ( 3 ) 2 2 . 2 8 6 . 7 0 6 ] ~ r p m s g _ r e m o t e _ s e n d : ~ { \ r e m o t e = [ 3 ] } - > m a s t e r [ 1 ] ~ , ~ m a s t e r ~ e p t ~ a d d r ~ = ~ \alpha ~ } } \\ & { \mathrm { 0 \times 8 0 0 0 0 0 0 0 3 } } \end{array}
```

$$

$$

```
\begin{array} { r l } & { [ \mathrm { ( 1 ) ~ } 2 2 . 2 8 7 . 3 6 3 ] \quad \mathrm { r p m s g _ m a s t e r _ r e c v : ~ \ m a s t e r : ~ } \ \mathtt { m a s t e r } \boxed { 1 } \ll \mathtt { - r e m o t e } [ \mathrm { 3 } ] , \quad \mathtt { r e m o t e ~ \mathtt { e p t } ~ a d d r _ s e m } } \end{array}
```

$$

## 第 7 章 中断

### 7.1 Cortex-A GIC

Cortex-A GIC（Generic Interrupt Controller）是一种用于处理中断请求的模块。它的作用是管理和分配各种类型的中断，并将它们发送给处理器核心以执行相应的中断服务程序。

GIC 可以分为 GICv2、GICv3 版本，常用芯片平台的支持情况如下：


| Chip | GICv2 | GICv3 |
| --- | --- | --- |
| RK3588 |  | √ |
| Rk3576 | √ |  |
| RK3568 |  | √ |
| RK3562 | √ |  |
| RK3358 | √ |  |
| RK3308 | √ |  |

GIC中包含三种不同类型的中断：

1. SGI:中断号0-15，软件产生的中断，每个 CPU私有。

2.PPI:中断号16-31，私有的外设中断，每个CPU私有。

3.SPI:中断号32起，公共的外设中断，所有CPU共享。

三种中断配合，实现了各种丰富的应用。同时，各种配置文件中，也按不同的中断分组给予不同的分组偏移。

中断使用步骤包含以下几个方面：

1. GIC中断配置：配置指定中断号对应的中断优先级，以及中断服务程序由哪个CPU来运行。

2.GIC中断服务程序注册：注册指定中断号对应的中断服务程序。

3.GIC中断使能：使能中断，系统能收到中断，并响应。

4.配置外设模块中断，使模块能产生中断。

以在 RK3562 Bare-metal 和 RTOS 中配置 GPIO 中断为例，简要说明要如何配置。

#### 7.1.1 GIC 中断配置

在 Bare-metal 和 RTOS 中，找到 irqsConfig结构体的定义位置：

- RTOS: &lt;AMP\_SDK&gt;/rtos/bsp/rockchip/rk3562/board/common/board\_base.c

代码结构为：

#define DEFAULT IRQ CPU 1 /* 指向主系统核心，依据实际修改 */

```c
struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
GIC AMP IRQ CFG ROUTE(GPIOO IRQn, OxdO, CPU GET AFFINITY(O, 0)), /* 添加 CPUO
响应 CPUO 中断的路径 */
GIC_AMP_IRQ_CFG_ROUTE(O, 0, CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0)), /*
sentinel */
};
struct GIC IRQ AMP CTRL irqConfig = {
.CpuAff = CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0),
.defPrio = 0xd0,
.defRouteAff = CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0),
.irqsCfg = &irqsConfig[0],
};
int main()
HAL_GIC_Init(&irqConfig);
//…
```

在多系统Bare-metal和RTOS配置中，所有系统共享这张表格。

用户可修改的位置：

```csv
GIC_AMP_IRQ_CFG_ROUTE(irqNum,Priority, CPU_GET_AFFINITY(cpuID, cpuCluster))参
数说明：
```

参数 说明  

irqNum 中断号  

Priority 优先级(使用默认值，不需要修改)  

cpuID 响应中断的 CPU号  

cpuCluster cpu集群，多见于大小核系统中。RK3562，始终为0

#### 7.1.2 GIC 中断服务程序

##### 7.1.2.1 Bare-metal GIC 中断服务程序

下面以GPIO0的 C4 pin脚设置上升沿触发为例，简单说明 GPIO中断使用方法。

```c
// GPIO0 中断服务程序总入口
static void gpio_isr(int vector, void *param)
HAL GPIO IRQHandler(GPIOO, GPIO BANKO);
// ..
```

```c
// GPIOO C4 pin 脚中断回调函数
static HAL_Status c4_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
//…
return HAL_OK;
}
// GPIO 脚中断使用示例
static void gpio test(void)
{
//…
/* Step 1: GIC 设置 */
/* 设置 GIC (GPIO0) 中断服务程序，使能中断，使系统能收到模块中断 */
HAL_IRQ_HANDLER_SetIRQHandler(GPIO0_IRQn, gpio_isr, NULL);
HAL_GIC_Enable(GPIOO_IRQn);
/* Step 2: 模块设置 */
/* 设置 GPIO0 C4 为输入口 */
HAL GPIO SetPinDirection(GPIOO, GPIO PIN C4, GPIO IN);
/* 设置 GPIOO C4 中断类型、回调函数，并且使能 GPIOO C4 的 IO 中断 */
HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANKO, GPIO_PIN_C4, c4_call_back,
NULL);
HAL_GPIO_SetIntType(GPIOO, GPIO_PIN_C4, GPIO_INT_TYPE_EDGE_RISING);
/* 使能 GPIO 中断，使模块能产生中断 */
HAL_GPIO_EnableIRQ(GPIOO, GPIO_PIN_C4);
```

示例中，中断配置分为两部分：

- GIC 设置:配置中断响应函数gpio\_isr，并使能系统中断接收。该部分内容，对所有中断通用，统一配置接口。

- 模块设置：配置模块中断，使模块能产生中断信号给GIC模块。该部分内容，主要依照模块自己的规则，有较大的不一样，需要详细参考模块说明，编写代码。

##### 7.1.2.2 RTOS GIC 中断服务程序

RTOS 中，可以使用 Bare-metal 接口，使用Bare-metal GIC 中断服务程序注册的例子。也可以使用 RTOS官方封装的接口。同样使用使用 GPIO0的C4pin脚设置上升沿触发的例子，RTOS的设置为：

```c
// GPIO 脚中断使用示例
void irq callback(void *args)
{
77
static void gpio test(void)
{
struct rt device pin mode pin mode;
rt_device_t pin_dev = rt_device_find("pin");
rt device open(pin dev, RT DEVICE FLAG RDWR);
```

```c
pin mode.pin = BANK PIN(0, GPIO PIN C4); /* GPIO0 C4 */
pin mode.mode = PIN MODE INPUT;
rt_device_control(pin_dev, 0, &pin_mode);
rt_pin_attach_irq(pin_mode.pin, PIN_IRQ_MODE_RISING, irq_callback, RT_NULL);
rt_pin_irq_enable(pin_mode.pin, PIN_IRQ_ENABLE);
}
```

模块不一样，差异较大，具体参考RT-Thread官方文档。

### 7.2 Cortex-M NVIC

Cortex-M NVIC（Nested Vectored Interrupt Controller）是处理器中用于管理中断的关键组件。它负责管理和分配来自外部和内部源的中断请求，并将它们发送给适当的处理器核心进行处理。

支持的平台有：RK3588、RK3576、RK3562，主要核心是Cortex-M0系列。

Cortex-M0系列中断最大接入为32个中断。意味着多出的中断需要进行二级轮询。为此，引入INTMUX机制，尽可能的引入更多中断，方便软件开发。

NVIC中断使用步骤包含以下几个方面：

1.NVIC中断初始化：初始化中断向量表和NVIC控制器。

2.NVIC中断服务程序注册：注册指定中断号对应的中断服务程序。

3.NVIC中断使能：使能中断，系统能收到中断，并响应。

4.配置外设模块中断，使模块能产生中断。

以在 RK3562 Bare-metal MCU 和 RTOS MCU 中配置 GPIO 中断为例，简要说明要如何配置。

#### 7.2.1 NVIC 中断初始化

在 Bare-metal 和 RTOS 中，NVIC 中断初始化已经被包含在 HAL\_Init()；中了，直接调用 HAL\_Init或单独提取NVIC操作都可以实现初始化。

```c
/* <AMP_SDK>/hal/lib/hal/src/hal_base.c */
HAL Status HAL Init(void)
{
#ifdef CORTEX M
#ifdef HAL NVIC MODULE ENABLED
/* Set Interrupt Group Priority */
HAL NVIC Init();
/* Set Interrupt Group Priority */
HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_DEFAULT);
#endif
#endif
//
return HAL_OK;
}
```

#### 7.2.2 NVIC 中断服务程序

##### 7.2.2.1 Bare-metal GIC 中断服务程序

下面以 GPIO0的 C4 pin脚设置上升沿触发为例，简单说明 GPIO中断使用方法。

```c
// GPIO0 中断服务程序总入口
static void gpio isr(int vector, void *param)
1/
HAL GPIO IRQHandler(GPIOO, GPIO BANK0);
1/
// GPIOO C4 pin 脚中断回调函数
static HAL_Status c4_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
11
return HAL OK;
// GPIO 脚中断使用示例
static void gpio test(void)
{
1/
/* Step 1: GIC 设置 */
/*设置 NVIC (GPIO0) 中断服务程序，使能中断，使系统能收到模块中断 */
HAL_INTMUX_SetIRQHandler(GPIO1_IRQn, gpio_isr, NULL);
HAL INTMUX EnableIRQ(GPIO1 IRQn);
/* Step 2: 模块设置 */
/* 设置 GPIO0 C4 为输入口 */
HAL GPIO SetPinDirection(GPIOO, GPIO PIN C4, GPIO IN);
/* 设置 GPIOO C4 中断类型、回调函数，并且使能 GPIOO C4 的 IO 中断 */
HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANKO, GPIO_PIN_C4, c4_call_back,
NULL);
HAL_GPIO_SetIntType(GPIOO, GPIO_PIN_C4, GPIO_INT_TYPE_EDGE_RISING);
/* 使能 GPIO 中断，使模块能产生中断 */
HAL_GPIO_EnableIRQ(GPIOO, GPIO_PIN_C4);
```

示例中，中断配置分为两部分：

- 模块设置:配置模块中断，使模块能产生中断信号给NVIC模块。该部分内容，主要依照模块自己的规则，有较大的不一样，需要详细参考模块说明，编写代码。

参考RTOS GIC 中断服务程序

### 7.3 RISC-V中断控制器

RISC-V IPIC（Integrated Programmable Interrupt Controller）是处理器中用于管理中断的关键组件。它负责管理和分配来自外部和内部源的中断请求，并将它们发送给适当的处理器核心进行处理。

支持的平台有：RK3568，主要核心是RISC-V系列。

RISC-V系列中断最大接入为32个中断。意味着多出的中断需要进行二级轮询。为此，引入INTMUX机制，尽可能的引入更多中断，方便软件开发。

IPIC中断使用步骤包含以下几个方面：

1.IPIC中断初始化：初始化中断向量表和IPIC控制器。

2.IPIC中断服务程序注册：注册指定中断号对应的中断服务程序。

3.IPIC中断使能：使能中断，系统能收到中断，并响应。

4.配置外设模块中断，使模块能产生中断。

以在 RK3568 Bare-metal RISC-V和 RTOS RISC-V中配置 GPIO 中断为例，简要说明要如何配置。

#### 7.3.1 IPIC 中断初始化

在 Bare-metal 和 RTOS 中，IPIC 中断初始化已经被包含在 HAL\_INTMUX\_Init()中了，直接调用HAL INTMUX Init()或单独提取 IPIC 操作都可以实现初始化。

```c
/* <AMP_SDK>/hal/lib/hal/src/hal_intmux.c */
HAL Status HAL INTMUX Init(void)
{
//
#ifdef HAL RISCVIC MODULE ENABLED
HAL RISCVIC Init();
#endif
//.
return HAL_OK;
}
```

#### 7.3.2 IPIC 中断服务程序

##### 7.3.2.1 Bare-metal GIC 中断服务程序

下面以 GPIO4的 C5 pin脚设置上升沿触发为例，简单说明 GPIO 中断使用方法。

```c
// GPIO0 中断服务程序总入口
static void gpio isr(int vector, void *param)
//…
```

```c
HAL_GPIO_IRQHandler(GPIO4, GPIO_BANK4);
1/
}
// GPIOO C4 pin 脚中断回调函数
static HAL_Status c5_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
//
return HAL_OK;
// GPIO 脚中断使用示例
static void gpio test(void)
{
11
/* Step 1: GIC 设置 */
/* 设置 IPIC (GPIO4) 中断服务程序，使能中断，使系统能收到模块中断 */
HAL_INTMUX_SetIRQHandler(GPIO4_IRQn, gpio_isr, NULL);
HAL_INTMUX_EnableIRQ(GPIO4_IRQn);
/* Step 2: 模块设置 */
/* 设置 GPIO4 C5 为输入口 */
HAL GPIO SetPinDirection(GPIO4, GPIO PIN C5, GPIO IN);
/* 设置 GPIO4 C5 中断类型、回调函数，并且使能 GPIO4 C5 的 IO 中断 */
HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK4,GPIO_PIN_C5, c5_call_back,
NULL) ;
HAL_GPIO_SetIntType(GPIO4, GPIO_PIN_C5, GPIO_INT_TYPE_EDGE_RISING);
/* 使能 GPIO 中断，使模块能产生中断 */
HAL_GPIO_EnableIRQ(GPIO4, GPIO_PIN_C5);
}
```

### 示例中，中断配置分为两部分：

- 模块设置:配置模块中断，使模块能产生中断信号给IPIC模块。该部分内容，主要依照模块自己的规则，有较大的不一样，需要详细参考模块说明，编写代码。

##### 7.3.2.2 RTOS IPIC 中断服务程序

参考RTOS GIC 中断服务程序

## 第 8 章 模块

### 8.1 eMMC

#### 8.1.1 HAL

根据硬件控制器不同，eMMC 驱动分为 SDIO 和 SDHCI，源码位于 hal/lib/src/ 和 hal/middleware/sdhci/，HAL提供基础的读写接口。

以 RK3568 为例：

```c
#include "mmc api.h"
#define TestSector 8
#define maxTestSector (TestSector * 4)
static int pWriteBuf[maxTestSector * 128];
static int pReadBuf[maxTestSector * 128];
static int userCapSize;
static int SdhciInit(void)
1
int ioctlParam[5] = {0, 0, 0, 0, 0};
int ret;
sdmmc init((void *)0xFE310000);
ret = sdmmc ioctrl(SDM IOCTRL REGISTER CARD, ioctlParam);
if (ret) {
printf("emmc init error!\n");
return -1;
}
ret = sdmmc ioctrl(SDM IOCTR GET CAPABILITY, ioctlParam);
if (ret) {
printf("emmc get capability error!\n");
return -1;
一
userCapSize = ioctlParam[1];
}
static int SdhciTest(void)
{
int i, j, loop = 0;
int testEndLBA;
int testLBA = 0;
int testSecCount = 1;
int printFlag;
testEndLBA = userCapSize / 32;
for (i = 0; i < (maxTestSector * 128); i++)
pWriteBuf[i] = i;
```

```c
for (loop = 0; loop < 2; loop ++) {
HAL_DBG (" -Test loop = %d- -\n", loop);
HAL DBG(" -Test ftl write %s- -\n", "") ;
testSecCount = 1;
HAL_DBG("testEndLBA = %x\n", testEndLBA);
HAL_DBG("testLBA = %x\n", testLBA);
for (testLBA = 0x10000 + loop; (testLBA + testSecCount) < testEndLBA;) {
sdmmc_write(testLBA, testSecCount, pWriteBuf);
sdmmc_read(testLBA, testSecCount, pReadBuf);
printFlag = testLBA & 0x1FF;
if (printFlag < testSecCount)
HAL_DBG("testLBA = %x\n", testLBA);
for (j = 0; j < testSecCount * 128; j++) {
if (pWriteBuf[j] != pReadBuf[j]) {
printf("write not match:row=%x, num=%x, write=%x, read=%x\n",
testLBA, j, pWriteBuf[jl, pReadBuf[j]);
while (1);
testLBA += testSecCount;
testSecCount++;
if (testSecCount > maxTestSector)
testSecCount = 1;
}
HAL DBG("-- -Test ftl check--- −%s\n", "");
testSecCount = 1;
for (testLBA = 0x10000 + loop; (testLBA + testSecCount) < testEndLBA;) {
sdmmc_read(testLBA, testSecCount, pReadBuf);
printFlag = testLBA & 0x7FF;
if (printFlag < testSecCount)
HAL_DBG("testLBA = %x\n", testLBA);
for (j = 0; j < testSecCount * 128; j++) {
if (pWriteBuf[j] != pReadBuf[j]) {
printf("check not match:row=%x, num=%x, write=%x,
read=%x\n", testLBA, j, pWriteBuf[j], pReadBuf[j]);
while (1);
}
}
testLBA += testSecCount;
testSecCount++;
if (testSecCount > maxTestSector)
testSecCount = 1;
HAL DBG("-- -\n", "") ;
```

return 0;

#### 8.1.2 RT-Thread

RT-Thread为 SDIO驱动提供了文件系统的支持，SDHCI提供基础的块读写接口。

SDIO配置：

Menuconfig 配置入口：

RT-Thread Components---&gt;   

Device Drivers ---&gt;   

[\*] Using SD/MMC device drivers

RT USING SDIO=y   

RT USING SDIO0=y   

RT USING DMA=Y   

RT USING DMA PL330=y   

RT USING DMA0=y

SDHCI配置：

RT\_USING\_SDHCI=y

RT-Thread elm-fat 文件支持：

Menuconfig配置入口：

```c
RT-Thread Components --->
Device virtual file system --->
[*] Using device virtual file system
[*] Using mount table for file system /* 实现相应注册分区表，可实现分区上电自动挂
载*/
[*] Enable elm-chan fatfs /* fat 文件系统 */
elm-chan's FatFs, Generic FAT Filesystem Module --->
(4096) Maximum sector size to be handled. /*对于 SPI Nor 产品必须修改为 4096
*/
```

RT USING DFS=y   

RT SDCARD MOUNT POINT="/"   

DFS FILESYSTEMS MAX=4   

DFS FILESYSTEM TYPES MAX=4   

RT USING DFS MNTTABLE=Y   

RT USING DFS ELMFAT=y   

RT DFS ELM MAX SECTOR SIZE=4096

RT\_Thread会根据mount\_table来挂载存储中的文件系统，如开启分区自动挂载文件系统，可在 mnt.c中添加相应分区注册信息，例如“root”分区到“/”目录：

```javascript
const struct dfs mount tbl mount table[]
{"root", "/", "elm", 0, 0},
{0}
};
```

如希望自行设计文件系统挂载流程，也可以通过以下代码实现文件系统挂载：

dfs\_mount("root", "/", "elm", 0, 0)

如果 eMMC中没有对应的文件系统，可以对文件系统格式化，通过mount挂载：

mkfs -t elm sd0 # sd0 格式化为 elm-FAT 文件系统  

mount sd0 / elm #在 / 目录挂载 sd0 为 elm-FAT

文件系统挂载成功后，通过文件系统串口命令操作，验证文件系统功能：

### 第8章 在根目录下创建一个文件

echo "This is a test!" /test.txt

### 第8章 查看目录

1s  

Directory /:  

test.txt  

### 第8章 查看文件内容

cat test.txt

This is a test!

#### 8.1.3 Kernel

Kernel eMMC 详细使用方法可以参考《Rockchip\_Developer\_Guide\_SDMMC\_SDIO\_eMMC\_CN.pdf》

### 8.2 UART

#### 8.2.1 HAL

HAL 中 UART 配置主要分为如下几步：

1. 配置 IOMUX

2. 在中断表中配置 UART 中断

3. 调用初始化接口

以RK3562为例：

```sql
static void HAL IOMUX Uart7M1Config(void)
HAL PINCTRL SetIOMUX(GPIO BANK1,
GPIO_PIN_B3,
PIN_CONFIG_MUX_FUNC3);
```

```c
HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
GPIO PIN B4,
PIN_CONFIG_MUX_FUNC3);
static struct GIC AMP IRQ INIT CFG irqsConfig[] = {
/* TODO: Config the irqs here.
* GIC version: GICv2
*/
GIC_AMP_IRQ_CFG_ROUTE(UART7_IRQn, 0xd0, CPU_GET_AFFINITY(1, 0)),
GIC AMP IRQ CFG ROUTE(O, 0, CPU GET AFFINITY(1, 0)), /* sentinel */
};
void main(void)
struct HAL_UART_CONFIG hal_uart_config = {
.baudRate = UART BR 1500000,
.dataBit = UART DATA 8B,
.stopBit = UART_ONE_STOPBIT,
.parity = UART PARITY DISABLE,
};
HAL IOMUX Uart7M1Config();
HAL_UART_Init(&g_uart7Dev, &hal_uart_config);
}
```

#### 8.2.2 RT-Thread

RT-Thread 中 UART 配置主要分为如下几步：

1. scons --menuconfig 打开UART支持

2. 配置对应的 IOMUX

3. 配置 g\_uart\_board 信息，包括波特率等

4. 在中断表中配置 UART 中断

RT-Thread 中已经对部分 UART 进行上面所诉的完整配置，可以直接通过 scons --menuconfig 打开使用，以 RK3562 为例：

Menuconfig配置入口：

RT-Thread rockchip RK3562 drivers   

Enable UART --&gt;   

[\*] Enable UART   

[\*] Enable UARTO

```markdown
## 第8章 UARTO
RT CONSOLE DEVICE NAME="uartO"
RT_USING_UART=y
RT_USING_UART0=y
## 第8章 UART7
RT CONSOLE DEVICE NAME="uart7"
RT_USING_UART=y
RT_USING_UART7=y
```

```c
/* 配置对应的 IOMUX */
#ifdef RT_USING_UARTO
RT_WEAK void uart0_m0_iomux_config(void)
{
HAL_PINCTRL_SetIOMUX(GPIO_BANKO,
GPIO_PIN_DO I
GPIO_PIN_D1,
PIN_CONFIG_MUX_FUNC1);
#endif
#ifdef RT USING UART7
RT_WEAK void uart7_m1_iomux_config(void)
{
HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
GPIO_PIN_B3 I
GPIO_PIN_B4,
PIN_CONFIG_MUX_FUNC3);
#endif
/* 调用 IOMUX */
void rt_hw_iomux_config(void)
{
rt_hw_iodomain_config();
#ifdef RT_USING_UARTO
uart0_m0_iomux_config();
#endif
#ifdef RT_USING_UART7
uart7_m1_iomux_config();
#endif
#ifdef RT USING GMAC
#ifdef RT_USING_GMACO
gmac0_m0_iomux_config();
#endif
#endif
/* 配置 g_uart_board 信息 */
#if defined(RT_USING_UART0)
RT_WEAK const struct uart_board g_uart0_board =
{
.baud_rate = UART_BR_1500000,
.dev_flag = ROCKCHIP_UART_SUPPORT_FLAG_DEFAULT,
.bufer size = RT SERIAL RB BUFSZ,
.name = "uart0",
};
#endif /* RT_USING_UARTO */
/* 在中断表中配置UART中断 */
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] =
/* Config the irqs here. */
// todo...
GIC_AMP_IRQ_CFG_ROUTE(UARTO_IRQn, OxdO, CPU_GET_AFFINITY(3, 0)),
```

#### 8.2.3 Kernel

Kernel 的 DTS 对应的平台 kernel/arch/arm64/boot/dts/rockchip/rkxxxx.dtsi 中具备所有的 UART 配置，在使用时开启即可，Kernel UART 详细细节请参考《Rockchip\_Developer\_Guide\_UART\_CN.pdf》。

/\* DTS 中将UART7中断(69)route到CPU3，同时声明UART7的时钟，如果其他 DTS 使用时钟会报错，以  

此做资源隔离 \*/  

```dts
/{
rockchip amp: rockchip-amp {
compatible = "rockchip,amp";
clocks = <&cru FCLK BUS CMO CORE>, <&cru CLK BUS CMO RTC>,
<&Cru PCLK MAILBOX>, <&Cru PCLK INTC>,
<&cru SCLK UART7>, <&cru PCLK UART7>,
<&cru PCLK TIMER>, <&cru CLK TIMER4>, <&cru CLK TIMER5>;
pinctrl-names = "default";
pinctrl-0 = <&uart7m1 xfer>;
amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
amp-irqs = /bits/ 64 <GIC AMP IRQ CFG ROUTE(147, 0xd0,
CPU GET AFFINITY(3, 0))
GIC_AMP_IRQ_CFG_ROUTE(69, 0xdO, CPU_GET_AFFINITY(3,
0) ) >;
status = "okay";
}i
```

/\* 在 DTS 中禁用 UART7 \*/  

```dts
&uart7 {
status = "disabled";
}
```

### 8.3 SPI FLASH

SPI FLASH 详细使用方法可以参考《Rockchip\_Developer\_Guide\_RT-Thread\_SPIFLASH\_CN.pdf》

RK 平台 SPI Flash 可选用的控制器包括 FSPI、SFC、SPI 三种方案。

FSPI (Flexible Serial Peripheral Interface)是一个灵活的串行传输控制器，有以下主要特性：

- 支持 SPI Nor、SPI Nand、SPI 协议的 Psram 和 SRAM

- 支持 Standard SPI（单线）、Dual SPI、Quad SPI，部分版本支持 Octal SPI

- 支持 SDR（单沿传输），部分版本支持DTR（双沿传输）

- XIP 技术

- DMA 传输（内置 DMA）

SFC (Serial Flash Controller)是串行传输控制器，有以下主要特性：

- 支持 SPI Nor、SPI Nand、SPI 协议的 Psram 和 SRAM

- 支持 Standard SPI（单线）、Dual SPI、Quad SPI

- 支持 SDR（单沿传输）

- DMA 传输（内置 DMA）

SPI（Serial Peripheral Interface）为通用的串行传输控制器，有以下主要特性：

- 支持 SPI Nor、SPI Nand、SPI 协议的 Psram

- 支持 Standard SPI（单线）

- 支持 SDR（单沿传输）

- DMA 传输（外部 DMA）

#### 8.3.1 HAL

RK HAL 提供基于 SPI Nor 传输协议的 HAL\_SNOR 协议层，HAL 源码录在hal/1ib/hal/src/RK HAL 在 hal/test/hal/下提供了接口使用的 Demo，用户可以参考 HAL 下如何读写 SPI FLASH

由于 SPI FLASH型号种类繁多，软件通过flash id 识别特定颗粒，已支持的 SPI FLASH颗粒可以查询源码，如下所示：

```c
HAL_SECTION_SRAM_CODE static const struct FLASH_INFO s_spiFlashbl[] = {
/* GD25LQ16E */
{ 0xc86015, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 12, 9, 0 },
/* GD25Q32B */
{ 0xc84016, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 13, 9, 0 },
/* GD25Q64B */
{ 0xc84017, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 14, 9, 0 },
/* GD25Q127C and GD25Q128C*/
{ 0xc84018, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0C, 15, 9, 0 },
/* GD25Q256B/C/D */
{ 0xc84019, 128, 8, 0x13, 0x12, 0x6C, 0x3E, 0x21, 0xDC, 0x1C, 16, 6, 0 },
/* GD55LT01GE */
{ 0xc8661b, 128, 8, 0x13, 0x12, 0x6B, 0x32, 0x20, 0xD8, 0x3C, 18, 0, 0 },
/* GD25LQ64C */
{ 0xc86017, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 14, 9, 0 },
/* GD25LQ32E */
{ 0xc86016, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 13, 9, 0 },
/* GD25LX256E */
{ 0xc86819, 128, 8, 0x13, 0x12, 0x00, 0x00, 0x21, 0xDC, 0x10, 16, 0, 0x0D },
}
```

### 配置说明：

#define HAL_SNOR_MODULE_ENABLED #define HAL SFC MODULE ENABLED #define HAL SNOR SFC HOST

/\* SNOR 支持 \*//\* SFC 控制器支持 \*//\* SFC 控制器支持 \*/

#### 8.3.2 RT-Thread

### 基础配置

Menuconfig 配置入口：

RT-Thread rockchip common drivers ---&gt;  

[\*] Enable ROCKCHIP SPI NOR Flash  

(80000000) Reset the speed of SPI Nor flash in Hz  

[ ] Set SPI Host DUAL IO Lines /\* 如果 FSPI 主控仅预留 IO0\~1,应使用 Dual mode  

\*/  

Choose SPI Nor Flash Adapter (Attach FSPI controller to SNOR) ---&gt;

### 配置说明：

```c
RT_USING_MTD_NOR=Y
RT_USING_SNOR=y
RT SNOR SPEED=80000000 /* IO 接口速率 */
## 第8章 RT SNOR DUAL IO=n /* 默认不配置，Quad SPI 限制为 Duad SPI 使用 */
## 第8章 RT_SNOR_XIP_DATA_BEGIN=0 /*默认不配置，XIP 读接口实现起始地址，详细参考 “Nor
Flash XIP 技术"说明 */
RT USING SNOR FSPI HOST=y /* FSPI 控制器方案 */
## 第8章 RT USING SNOR SFC HOST=Y /* SFC 控制器方案 */
## 第8章 RT USING SNOR SPI HOST=Y /* SPI 控制器方案 */
## 第8章 RT SNOR SPI DEVICE NAME="spi2 0" /* SPI 控制器方案，指定目标控制器 */
```

### RT-Thread elm-fat 文件支持

```c
RT-Thread Components --->
Device virtual file system --->
[*] Using device virtual file system
[*] Using mount table for file system /* 实现相应注册分区表，可实现分区上电自动挂
载*/
[*] Enable elm-chan fatfs /* fat 文件系统 */
elm-chan's FatFs, Generic FAT Filesystem Module --->
(4096) Maximum sector size to be handled. /*对于 SPI Nor 产品必须修改为 4096
*/
```

如开启分区自动挂载文件系统，可在mnt.c中添加相应分区注册信息，例如“root”分区到“/”目录：

```javascript
const struct dfs mount tbl mount table[]
{"root", "/", "elm", 0, 0},
{0}
};
```

如希望自行设计文件系统挂载流程，也可以通过以下代码实现文件系统挂载：

dfs\_mount("root", "/", "elm", 0, 0)

可以通过以下命令查看相应分区是否注册成功：

msh /&gt;list\_device  

device type ref count  

root Block Device 1 /\* 分区名 root，分区类型 block 设备，Nor  

flash 支持 setting.ini 修改设定为 MTD 设备 \*/  

snor MTD Device 0 /\*SPI Nor根存储设备，分区读写最终接入到该  

节点完成读写擦除 \*/

1. 配置 IOMUX  

2. 配置 GMAC\_ETH\_CONFIG 表  

3. 在中断表中配置 GMAC0\_IRQn 中断

#### 8.3.3 Kernel

Kernel SPI FLASH 详细使用方法可以参考  

《Rockchip\_Developer\_Guide\_Linux\_Flash\_Open\_Source\_Solution\_CN.pdf》

### 8.4 GMAC

#### 8.4.1 HAL

RK HAL 提供 GMAC 的基础驱动和读写 PHY 标准寄存器操作，驱动源码在 hal/1ib/hal/src/gmac

配置说明：

根据 TRM 中对应 SOC 使用的 GMAC 配置

```c
#define HAL GMAC MODULE ENABLED /* GMAC 驱动支持*/
#define HAL GMAC1000 MODULE ENABLED /* GMAC1000 驱动支持*/
```

可以参考hal/test/hal/test\_gmac.c下提供的接口使用 demoHAL 中 GMAC 主要分为如下几步：

以 RK3562 为例：

```c
/* 配置 IOMUX */
static void GMAC_Iomux_Config(uint8_t id)
/* GMACO iomux */
HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
GPIO_PIN_AO | /* RGMII_RSTn */
GPIO_PIN_A1 , /* RGMII_INT/PMEB_MO */
PIN_CONFIG_MUX_FUNCO);
HAL GPIO SetPinDirection(GPIO3, GPIO PIN A1, GPIO IN);
HAL GPIO SetPinDirection(GPIO3, GPIO PIN AO, GPIO OUT);
HAL_GPIO_SetPinLevel(GPIO3, GPIO_PIN_AO, GPIO_HIGH);
HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
GPIO_PIN_D4 I /* RGMII_TXD2_MO */
GPIO_PIN_D5 I /* RGMII_TXD3_MO */
GPIO PIN D6 I /* RGMII TXCLK MO */
GPIO PIN D7 , /* RGMII RXD2 MO */
PIN_CONFIG_MUX_FUNC2);
HAL PINCTRL SetIOMUX(GPIO BANK4,
GPIO_PIN_AO | /* RGMII_RXD3_MO */
GPIO_PIN_A1 | /* RGMII_RXCLK_MO */
GPIO_PIN_A2 I /* RGMII_TXDO_MO */
GPIO_PIN_A3 | /* RGMII_TXD1_MO */
GPIO_PIN_A4 I /* RGMII_TXEN_MO */
GPIO_PIN_A5 I /* RGMII_RXDO_MO */
```

GPIO PIN A6 | /\* RGMII RXD1 MO \*/   

GPIO PIN A7 | /\* RGMII RXDV MO \*/   

GPIO PIN B1 I /\* ETH CLK 25M OUT MO \*/   

GPIO\_PIN\_B2 I /\* RGMII\_MDC\_MO \*/   

GPIO PIN B3 I /\* RGMII MDIO MO \*/   

GPIO PIN B7 , /\* RGMII CLK MO \*/   

PIN CONFIG MUX FUNC2);   

```
}
```

/\* 配置 GMAC ETH CONFIG 表 \*/   

static struct GMAC ETH CONFIG ethConfigTable[] =

1   

.halDev = &g gmac0Dev,   

.mode = PHY INTERFACE MODE RGMII,   

.maxSpeed = 1000,   

.phyAddr = 0, /\* PHY 地址 \*/   

.extClk = false, /\* true 由 PHY 提供时钟输入 \*/   

.resetGpioBank = GPIO3, /\* PHY reset 引脚 \*/   

.resetGpioNum = GPIO PIN AO,   

.resetDelayMs = &#123; 0, 20, 100 &#125;, /\* PHY reset 时序 \*/   

.txDelay = 0x3C,   

.rxDelay = 0,   

```
},
};
```

/\* 在中断表中配置 GMACO IROn 中断 \*/   

```c
static struct GIC AMP IRQ INIT CFG irqsConfig[] = {
```

/\* TODO: Config the irqs here.   

\* GIC version: GICv2   

\* The priority higher than 0x80 is non-secure interrupt.   

\*/   

GIC AMP IRQ CFG ROUTE(GMACO IRQn, OxdO, CPU GET AFFINITY(O, 0)),   

```
};
```

#### 8.4.2 RT-Thread

配置说明：

Menuconfig配置入口：

RT-Thread rockchip RK3562 drivers   

Enable GMAC --&gt;   

[\*] Enable GMAC   

[\*] Enable GMACO

```c
RT_USING_GMAC=y /* 打开 GMAC 配置 */
RT_USING_GMAC0=y /* 打开 GMACO 配置*/
```

RT\_Thread 中 GMAC 主要分为如下几步：

1. 配置 IOMUX

2. 配置 rockchip\_eth\_config 表

3. 在中断表中配置 GMAC0\_IRQn中断（SMP系统不需要配置）

以 RK3562 为例：

```c
/* 配置 IOMUX */
RT_WEAK void gmac0_m0_iomux_config(void)
{
/* GMACO iomux */
HAL PINCTRL SetIOMUX(GPIO BANK3,
GPIO_PIN_AO I /* RGMII_RSTn */
GPIO PIN A1, /* RGMII INT/PMEB MO */
PIN CONFIG MUX FUNCO);
HAL GPIO SetPinDirection(GPIO3, GPIO PIN A1, GPIO IN);
HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_AO, GPIO_OUT);
HAL_GPIO_SetPinLevel(GPIO3, GPIO_PIN_AO, GPIO_HIGH);
HAL PINCTRL SetIOMUX(GPIO BANK3,
GPIO PIN D4 | /* RGMII TXD2 MO */
GPIO PIN D5 I /* RGMII TXD3 MO */
GPIO PIN D6 | /* RGMII TXCLK MO */
GPIO PIN D7, /* RGMII RXD2 MO */
PIN CONFIG MUX FUNC2);
HAL_PINCTRL_SetIOMUX(GPIO_BANK4,
GPIO PIN AO I /* RGMII RXD3 MO */
GPIO PIN A1 I /* RGMII RXCLK MO */
GPIO_PIN_A2 I /* RGMII_TXDO_MO */
GPIO PIN A3 I /* RGMII TXD1 MO */
GPIO PIN A4 I /* RGMII TXEN MO */
GPIO_PIN_A5 I /* RGMII_RXDO_MO */
GPIO PIN A6 I /* RGMII RXD1 MO */
GPIO PIN A7 | /* RGMII RXDV MO */
GPIO_PIN_B1 I /* ETH_CLK_25M_OUT_MO */
GPIO PIN B2 I /* RGMII MDC MO */
GPIO_PIN_B3 I /* RGMII_MDIO_MO */
GPIO_PIN_B7, /* RGMII_CLK_MO */
PIN CONFIG MUX FUNC2);
/* 配置 rockchip eth config 表 */
const struct rockchip_eth_config rockchip_eth_config_table[] =
{
.halDev = &g_gmac0Dev,
.mode = PHY INTERFACE MODE RGMII,
.maxSpeed = 1000,
.phyAddr = 0, /* PHY 地址 */
.extClk = false, /* true 由 PHY 提供时钟输入 */
.resetGpioBank = GPIO3, /* PHY reset 引脚 */
.resetGpioNum = GPIO_PIN_A0,
.resetDelayMs = { 0, 20, 100 }, /* PHY reset 时序 */
.txDelay = 0x3C,
.rxDelay = 0,
},
};
```

RT-Thread 提供 LWIP的支持，可以通过 scons --menuconfig，打开对应功能的支持

### Menuconfig配置入口：

RT-Thread Components ---&gt;   

Network ---&gt;   

[\*] LwIP: light weight TCP/IP stack ---&gt;   

--- LwIP: light weight TCP/IP stack   

[] Use LwIP local version only (NEW)   

lwIP version (lwIP v2.0.3) ---&gt;   

[] IPV6 protocol (NEW)   

(4) Memory alignment (NEW)   

[\*] IGMP protocol (NEW)   

-\*\_ ICMP protocol   

[] SNMP protocol (NEW)   

[\*] Enble DNS for name resolution (NEW)   

[\*] Enable alloc ip address through DHCP (NEW)   

(1) SOF broadcast (NEW)   

(1) SOF broadcast recv (NEW)   

Static IPv4 Address ---&gt;

NETDEV USING PING=Y   

RT\_USING\_LWIP=y   

RT\_USING\_LWIP203=y   

RT USING LWIP VER NUM=0x20003   

RT LWIP MEM ALIGNMENT=4   

RT\_LWIP\_IGMP=y   

RT LWIP ICMP=Y   

RT\_LWIP\_DNS=y   

#开启DHCP，静态IP可以不用配置   

RT\_LWIP\_DHCP=y   

IP\_SOF\_BROADCAST=1   

IP\_SOF\_BROADCAST\_RECV=1   

/\* Static IPv4 Address \*/   

RT LWIP IPADDR="XXX.XXX.XXX.XXX"   

RT LWIP GWADDR="XXX.XXX.XXX.XXX"   

RT LWIP MSKADDR="XXX.XXX.XXX.XXX"   

RT\_LWIP\_UDP=y   

RT\_LWIP\_TCP=y   

RT\_LWIP\_RAW=y   

RT MEMP NUM NETCONN=8   

RT LWIP PBUF NUM=16   

RT LWIP RAW PCB NUM=4   

RT\_LWIP\_UDP\_PCB\_NUM=4   

RT LWIP TCP PCB NUM=4   

RT LWIP TCP SEG NUM=40   

RT LWIP TCP SND BUF=8196   

RT LWIP TCP WND=8196   

RT LWIP TCPTHREAD PRIORITY=10   

RT LWIP TCPTHREAD MBOX SIZE=8   

RT LWIP TCPTHREAD STACKSIZE=1024   

RT LWIP ETHTHREAD PRIORITY=12   

RT LWIP ETHTHREAD STACKSIZE=1024   

RT LWIP ETHTHREAD MBOX SIZE=8   

LWIP NETIF STATUS CALLBACK=1   

LWIP NETIF LINK CALLBACK=1

SO\_REUSE=1  

LWIP SO RCVTIMEO=1  

LWIP\_SO\_SNDTIMEO=1  

LWIP\_SO\_RCVBUF=1  

LWIP\_SO\_LINGER=0  

LWIP NETIF LOOPBACK=0  

RT\_LWIP\_USING\_PING=Y

开启ping后，验证前首先确认网线已经连接，再通过“ping”命令进行操作，参考如下：

```markdown
## 第8章 网络连接成功1og信息
[(1)3.357.573] e0: 100M
[(1)3.357.592] e0: ful1 dumplex
[(1)3.357.610] e0: flow control off
[(1)3.357.811] e0: link up.
## 第8章 向网关发送ping包和执行结果
msh >ping 192.168.31.1
[(1)52.351.270] 60 bytes from 192.168.31.1 icmp_seq=0 ttl=64 time=0 ms
[(1)53.355.786] 60 bytes from 192.168.31.1 icmp_seq=1 ttl=64 time=0 ms
[(1)54.361.215] 60 bytes from 192.168.31.1 icmp_seq=2 ttl=64 time=0 ms
[(1)55.366.645] 60 bytes from 192.168.31.1 icmp_seq=3 ttl=64 time=0 ms
```

#### 8.4.3 Kernel

Kernel GMAC 详细使用方法可以参考  

《Rockchip\_Developer\_Guide\_Linux\_GMAC\_Mode\_Configuration\_CN.pdf》

```dts
/{
rockchip_amp: rockchip-amp {
compatible = "rockchip,amp";
clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CMO_RTC>,
```

# GMAC 时钟声明   

&lt;&cru PCLK\_GMAC&gt;, &lt;&cru ACLK\_GMAC&gt;, &lt;&cru CLK\_GMAC\_125M\_CRU\_I&gt;,   

&lt;&Cru CLK GMAC 50M CRU I&gt;, &lt;&Cru CLK GMAC ETH OUT2IO&gt;,   

&lt;&cru SCLK UART7&gt;, &lt;&cru PCLK UART7&gt;, &lt;&cru PCLK TIMER&gt;,   

&lt;&cru CLK TIMER4&gt;, &lt;&cru CLK TIMER5&gt;;   

```
pinctrl-names = "default";
pinctrl-0 = <&uart7m1 xfer>;
amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0,
CPU_GET_AFFINITY(3, 0))
```

# GMAC 中断配置   

GIC AMP IRQ CFG ROUTE(105, OxdO, CPU GET AFFINITY(3,   

0) ) &gt;;   

```dts
status = "okay";
};

&gmac0 {
status = "disabled";
};
```

### 8.5 PCIE

Bare-metal 或 RT Thread 下仅支持以下简单功能：

- 控制器寄存器访问

- CPU访问外设，主要包括 Bar、CFG 空间

- uDMA 传输

- INTx legacy 中断

#### 8.5.1 HAL / RT-Thread

测试代码的路径为hal/test/hal/test\_pcie.c

具体介绍可以参考hal/doc/guides/Rockchip\_User\_Guide\_HAL\_PCIe\_CN.md文档。

### 8.6 CPU Cache ECC

RK3568平台上支持CacheECC功能，支持单bit错误可检测纠正，双bit错误可检测不可纠正可记录。并支持手动注入错误用于功能的验证。

#### 8.6.1 RT-Thread

### 8.7 DDR ECC

#### 8.7.1 HAL

HAL中具体的操作及配置请参考文档《Rockchip\_Developer\_Guide\_HAL\_DDR\_ECC\_CN.pdf》；

#### 8.7.2 Kernel

Linux中具体的操作及配置请参考文档《Rockchip-Developer-Guide-DDR-CN.pdf》。

## 第 9 章 调试

### 9.1 串口调试

瑞芯微多核异构系统中默认调试串口配置如下：


| 波特率 | 数据位 | 停止位 | 奇偶校验 | 流控 |
| --- | --- | --- | --- | --- |
| 1500000 | 8 | 1 | none | none |

相关章节：  

第8章编译配置

#### 9.1.1 U-Boot 启动输出

以 RK3562 为例，瑞芯微多核异构系统启动时，CPU3 固件 Ram加载地址为 0x01800000：

AMP: Brought up cpu[3] with state 0x10, entry 0x01800000 ...OK

#### 9.1.2 RK HAL 启动输出

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*   

Hello RK3562 Bare-metal using RK HAL!   

Rockchip Electronics Co.Ltd   

CPI\_ID(3)   

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*   

[(3)0.671.983] CPU(3) Initial OK!

#### 9.1.3 RT-Thread 启动输出

\／   

- RT - Thread Operating System   

／\ 4.1.1 build Apr 12 2024 20:28:35   

2006 - 2022 Copyright by RT-Thread team

### 9.2 AP 使用 OpenOCD 调试

AP支持使用OpenOCD调试。调试使用的硬件工具为瑞芯微设计的JTAG小板。支持单步运行、断点追踪、data watch和寄存器、memory dump等常用功能，详细资料请参考JTAG & SWD连接开发和调试

#### 9.2.1 Windows 环境搭建

##### 9.2.1.1 软件安装

1. 安装 OpenOCD 开发环境

eclipse-workspace #工作目录，eclipse 已默认把工作目录设到该文件夹  

OpenOCD # OpenOCD 相关文件  

bat #windows 批处理文件，双击可以直接连接芯片  

bin # 存放 openocd.exe 和 \*gdb.exe  

Tdoc #驱动安装文档和使用文档  

tcl #脚本文件  

SVD #主要用来查看芯片寄存器

2. 安装运行 eclipse 需要的 JRE 工具包

JRE工具包为下载资料包目录下的/环境搭建软件/jdk\_8.0.1310.11\_64.exe。具体安装及配置步骤参见资料包下的《Rockchip\_Developer\_Guide\_GNU\_MCU\_Eclipse\_OpenOCD\_CN.pdf》文档说明。

3. 安装 JTAG 驱动

JTAG驱动为下载资料包目录下的/环境搭建软件/zadig-2.7.exe。具体安装及配置步骤参见资料包下的《Rockchip\_Developer\_Guide\_FT232H\_USB2JTAG.pdf》文档说明。

##### 9.2.1.2 硬件连接

FT232H 是“Future Technology Devices International Ltd”的一款芯片，它可以通过 USB 接口与计算机通信，提供 JTAG 和 SWD 的扩展能力。



FT232H小板如上图所示：

- LED指示灯，LED1：电源指示灯；LED2:灭：未连接，闪：连接；LED3：暂时未定义

- ARM 20PIN JTAG 接口

- USB 接口：有 TYPEC 接口和 mini USB 接口两种

- 拨码开关

SWD模式，1、3、5 off，2、4、6 on

JTAG模式，1、3、5 on，2、4、6 off

- 排针，VCC、TCS、TCK、GND，可以和板子飞线连接

- 排针，3.3V、VCCIO、1.8V，可以用跳冒连接VCCIO到3.3V或1.8V，这个一定要接，不然JTAG通讯会失败

#### 9.2.2 使用示例

以 RK3562 为列，搭建 OpenOCD 开发环境：

1. 参照《Rockchip\_Developer\_Guide\_GNU\_MCU\_Eclipse\_OpenOCD\_CN.pdf》文档，创建目标芯片的配置项。

2. 运行 eclipse.exe 进入“Debug Configurations”配置项，打开“Debugger”标签页，在“Config options”项目中加入：

-c "set SMPMASK 0x8" # 0x8表示cpu3，配置cpu3运行RT Thread  

-r rk3562 #指定芯片  

-c "cpu3 configure -rtos RT\_Thread" # 指定 cpu3 运行 RT Thread  

-c "adapter speed 15000" JTAG TCK 速率，单位KHz



3. 进入“Debug Configurations”配置项，打开 Source 标签页，编辑“Path Mapping: New Mapping”项目，加入或修改 RK356x AMP SDK 的工程路径：

&lt;AMP\_SDK&gt;/hal/ # GCC 编译时的工程路径  

D:&lt;AMP\_SDK&gt;\hal # Windows 下用于 Debug 追踪的源代码的工程路径

Name: AMP\_RK3562\_arm32\_cpu0   

MainDebuggerStartupSource Common SVD Path   

ource Lookup Path:   

Path Mapping: New Mapping Add...   

:/home/zjh/work/RK3562\_AMP/rtos/bsp/rockchip/rk3562-32 - Y:\work\RK3562\_AMP\rtos\bsp\rockchip\rk3562-32   

/home/zjh/work/RK3562\_AMP/rtos/src/ - Y:\work\RK3562\_AMP\rtos\src Edit..   

/home/zjh/work/RK3562\_AMP/rtos/bsp/rockchip/common/drivers - Y:\work\RK3562\_AMP\rtos\bsp\rockchip\common\drivers   

Remove   

/home/zjh/work/RK3562\_AMP/rtos/bsp/rockchip/common/hal - Y:\work\RK3562\_AMP\rtos\bsp\rockchip\common\hal   

/home/zjh/work/RK3562\_AMP/rtos/libcpu/arm/cortex-a/- Y:\work\RK3562\_AMP\rtos\libcpu\arm\cortex-a Up   

Absolute File Path   

Down   

Restore Default   

Search for duplicate source files on the path



在 Console窗口下通过以下命令分别加入4 个CPU的\*.elf文件：

#   

For help, type "help".   

Type "apropos word" to search for commands related to "word".   

#   

add-symbol-file D:/rk3562/hal/project/rk3562/GCC/0\_TestDemo.elf   

add-symbol-file D:/rk3562/hal/project/rk3562/GCC/1\_TestDemo.elf   

add-symbol-file D:/rk3562/hal/project/rk3562/GCC/2\_TestDemo.elf   

add-symbol-file D:/rk3562/hal/project/rk3562/GCC/3\_TestDemo.elf

### 9.3 MCU 使用 Ozone 调试

#### 9.3.1 Windows 环境搭建

Ozone工具是一款常用的，且带有便捷图像界面的嵌入式调试工具，借助J-Link硬件，可以实现对代码的实时跟踪，分步运行以及多断点触发等功能。官方地址：Ozone-The Performance Analyzer

(segger.com)。官方提供商业使用许可和非商业使用许可两种模式，请用户根据实际需求选择合适的许可模式，确保合法使用。

Licensing

Commercial use

Ozone can be used in a commercial environment as part of the licence for J-Link PLus ULTRA+, PRo and J-Trace, With J-Link BAsE. Ozone can be used commercially after purchasing the J-Link BASE to PLUs upgrade bundle, that includes the Ozone license. With other J-Link models, Ozone remains in evaluation mode and presents the following screen each time a debug session is started:

The connected J-Link does not have a valid license for the use of J-Link Debugger J-Link PLUS, ULTRA+ and PRO models come with a built-in license for J-Link Debugger. For more information refer to http://segger.com/j-link-debugger.html.

J-Link S/N: 284200004

Without a valid license, J-Link Debugger may only be used for evaluation purposes. Do you want to continue?

Free for non-commercial use



### 以 RK3562 为例：

1. 连接好 J-Link 设备和调试板子，打开 Ozone 软件，默认跳出工程配置选项，或者点击 File-&gt;New-&gt;New Project Wizard



New Project Wizard



Target Device Choose a Target Device

Device

Cortex-M0

Register Set

Cortex-M0

Peripherals (optional)

&lt; Back

Next &gt;

Cancel



在红框位置中，选中连接的J-Link设备。

Program File Choose the Program to be debugged

ELF, Motorola S-record, Intel Hex, or Binary file (optional)

Z:/work/hal-amp/project/rk3562-mcu/GCC/TestDemo.elf

&lt; Back

Next &gt;

Cancel



### New Project Wizard

Optional Settings Set optional project settings, such as the initial PC

Initial PC (after dowmload and reset)

ELF Entry Point

Read from Base Address Vector Table

Read from Location

Location

Do not set

Initial Stack Pointer

Read from Base Address Vector Table

Read from Location

Location

Do not set

J-Link Script File

J-Link Log File

&lt; Back

Finish

Cancel

2.加载目标文件：使用Ozone的加载功能将目标文件（通常是生成的可执行文件）加载到调试器中。如果 RK HAL 代码仓库在 Linux 环境下，Ozone 调试工具安装在 Windows 环境下，需要先在Windows系统中对 Linux 路径做网络磁盘映射，例如将Linux系统中的 "/home/xxx"映射到Windows系统中的"Z:"。再在Ozone软件界面左下角命令行使用以下命令进行工程路径映射，其中参数 "/home/xxx"为Linux环境挂载到 Windows 上使用的 Linux 路径，参数 "Z:"则为对应的Windows 路径。

Project.AddPathSubstitute "/home/xxx" "Z:"

完成这一系列操作后能得到如下Ozone界面。



### 红框位置是Debug开关，可以实现分步调试功能，也能在代码窗上直接加断点进行调试。

## 第 10 章 演示

### 10.1 性能测试

#### 10.1.1 测试整型


| 处理器 | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| 主频 | 816MHZ | 816MHZ |  |  |
| 运行方式 | DDR41560MHZ | DDR41332MHZ |  |  |
| Cache | 开 | 开 |  |  |
| TCM | 无 | 无 |  |  |
| Coremark | 3273 | 2387 |  |  |
| Coremark/MHz | 4.0 | 2.92 |  |  |

裸机端测试方法如下：

使能测试代码，打开如下几个宏开关。

代码路径：hal/project/rkxxx/src/main.c

-//#define TEST DEMO   

+#define TEST DEMO

代码路径：hal/project/rkxxx/src/test\_demo.c

-//#define PERF TEST   

+#define PERF TEST

代码路径：/hal/middleware/benchmark/benchmark

```makefile
INCLUDES += \
-I"$(BENCHMARK PATH)"\
-I"$(BENCHMARK PATH)/coremark"\
-I"$(BENCHMARK PATH)/coremark/barebones"
SRC DIRS += \
$(BENCHMARK PATH)\
$(BENCHMARK PATH)/coremark\
$(BENCHMARK PATH)/coremark/barebones\
```

代码路径：/hal/middleware/benchmark/benchmark.h

```c
#define HAL BENCHMARK COREMARK
//#define HAL BENCHMARK LINPACK
//#define HAL BENCHMARK TINYMEMBENCH
```

#### 10.1.2 测试浮点型


| 处理器 | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| 主频 | 816MHZ | 816MHZ |  |  |
| 运行方式 | DDR41560MHZ | DDR41332MHZ |  |  |
| Cache | 开 | 开 |  |  |
| TCM | 无 | 无 |  |  |
| LinpackMFLOPS | 154.7 | 79.38 |  |  |

裸机端测试方法如下：

使能测试代码，打开如下几个宏开关。

代码路径：hal/project/rkxxx/src/main.c

-//#define TEST DEMO   

+#define TEST DEMO

代码路径：hal/project/rkxxx/src/test\_demo.c

-//#define PERF TEST   

+#define PERF TEST

代码路径：/hal/middleware/benchmark/benchmark.mk

```makefile
INCLUDES += \
-I"$(BENCHMARK PATH)"\
-I"$(BENCHMARK PATH)/linpack"\
SRC DIRS += \
$(BENCHMARK PATH)\
$(BENCHMARK PATH)/linpack\
```

代码路径：/hal/middleware/benchmark/benchmark.h

```c
//#define HAL BENCHMARK COREMARK
#define HAL BENCHMARK LINPACK
//#define HAL BENCHMARK TINYMEMBENCH
```

#### 10.1.3 测试内存


| 处理器 | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| 主频 | 816MHZ | 816MHZ |  |  |
| 运行方式 | DDR41560MHZ | DDR41332MHZ |  |  |
| Cache | 开 | 开 |  |  |
| TCM | 无 | 无 |  |  |
| 内存带宽测试 | 参考下方详细数据 | 无 |  |  |
| 内存延迟测试 | 参考下方详细数据 | 无 |  |  |

### RK3568 AP HAL 数据

== Memory bandwidth tests   

Note 1: 1MB = 1000000 bytes   

== Note 2: Results for 'copy' tests show how many bytes can be   

copied per second (adding together read and writen   

bytes would have provided twice higher numbers)   

== Note 3: 2-pass copy means that we are using a small temporary buffer   

to first fetch data into it, and only then write it to the   

destination (source -&gt; L1 cache, L1 cache -&gt; destination)   

Note 4: If sample standard deviation exceeds 0.1%, it is shown in   

brackets   

C copy backwards 1673.8 MB/s   

C copy backwards (32 byte blocks) ： 1687.0 MB/s   

C copy backwards (64 byte blocks) : 1673.8 MB/s


| C copy |  |  |  |  | : | 1920.2 MB/s |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | C copy prefetched (32 bytes step) |  |  | : | 1563.7 MB/s |  |
|  |  | C copy prefetched (64 bytes step) |  |  | : |  | 1941.1 MB/s (0.1%) |
|  | C 2-pass copy |  |  |  | : |  | 995.7 MB/s |
|  |  | C 2-pass copy prefetched (32 bytes step) |  |  | : |  | 1036.3 MB/s |
|  |  | C 2-pass copy prefetched (64 bytes step) |  |  |  | ： | 1007.0 MB/s |
|  | C fill |  |  |  |  | ： | 3297.4 MB/s |
|  |  | C fill (shuffle within 16 byte blocks) |  |  |  | : | 3297.4 MB/s |
|  |  | C fill (shuffle within 32 byte blocks) |  |  |  | ： | 3297.4 MB/s |
|  |  | C fill (shuffle within 64 byte blocks) |  |  |  |  | 3292.3 MB/s |
|  |  |  |  |  |  |  |  |
|  | standard memcpy |  |  |  | ： | 1165.1 MB/s |  |
|  | standard memset |  |  |  | ： | 3322.9 MB/s |  |
|  |  |  |  |  |  | ： |  |
|  |  | ARM fill (STM with 8 registers) |  |  |  |  | 3343.7 MB/s |
|  |  |  | ARM fill (STM with 4 registers) |  | : | 3322.9 MB/s |  |

== Memory latency test ==   

== ==   

== Average time is measured for random memory accesses in the buffers ==   

== of different sizes. The larger is the buffer, the more significant ==   

== are relative contributions of TLB, L1/L2 cache misses and SDRAM ==   

== accesses. For extremely large buffer sizes we are expecting to see ==   

== page table walk with several requests to SDRAM for almost every ==   

== memory access (though 64MiB is not nearly large enough to experience ==   

== this effect to its fullest). ==   

== ==   

== Note 1: All the numbers are representing extra time, which needs to ==   

== be added to L1 cache latency. The cycle timings for L1 cache ==   

== latency can be usually found in the processor documentation. ==   

== Note 2: Dual random read means that we are simultaneously performing ==   

== two independent memory accesses at a time. In the case if ==   

== the memory subsystem can't handle multiple outstanding ==   

== requests, dual random read has the same timings as two ==   

== single reads performed one after another. ==   

block size : single random read / dual random read   

1024: 0.0 ns / 0.0 ns   

2048： 0.0 ns / 0.0 ns   

4096: 0.0 ns / 0.0 ns   

8192: 0.0 ns / 0.0 ns   

16384: 0.0 ns / 0.0 ns   

32768： 11.2 ns / 0.3 ns   

65536: 22.4 ns / 32.7 ns   

131072: 33.3 ns / 43.9 ns   

262144： 39.4 ns / 47.2 ns   

524288: 48.8 ns / 56.1 ns   

1048576 : 176.3 ns / 253.8 ns   

2097152 : 240.5 ns / 317.2 ns   

4194304 : 272.0 ns / 339.1 ns   

8388608 : 285.9 ns / 328.5 ns  

裸机端测试方法如下：

使能测试代码，打开如下几个宏开关。

代码路径：hal/project/rkxxx/src/main.c

-//#define TEST DEMO   

+#define TEST DEMO

代码路径：hal/project/rkxxx/src/test\_demo.c

-//#define PERF TEST   

+#define PERF TEST

代码路径：/hal/middleware/benchmark/benchmark.mk

```prolog
INCLUDES += \
-I"$(BENCHMARK PATH)"\
-I"$(BENCHMARK PATH)/tinymembench"\
SRC_DIRS += \
$(BENCHMARK PATH)\
$(BENCHMARK PATH)/tinymembench\
```

代码路径：/hal/middleware/benchmark/benchmark.h

```c
//#define HAL BENCHMARK COREMARK
//#define HAL BENCHMARK LINPACK
#define HAL BENCHMARK TINYMEMBENCH
```

### 10.1.4 测试中断响应时间


| 处理器 | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| 主频 | 816MHZ | 816MHZ |  |  |
| 运行方式 | DDR41560MHZ | DDR41332MHZ |  |  |
| Cache | 开 | 开 |  |  |
| TCM | 无 | 无 |  |  |
| Irq Latency Test | avg = 3.42 usmax = 4.13 usmin = 3.21 us | avg = 1.543296 usmax = 2.916667 usmin = 0.875000 us |  |  |

裸机端测试方法如下：

裸机系统测试中断延时响应数据需要打开以下宏开关。

hal/project/rkxxx/src/main.c

-//#define TEST\_DEMO   

+#define TEST\_DEMO

hal/project/rkxxx/src/test\_demo.c

```c
-//#define IRQ_LATENCY_TEST
+#define IRQ_LATENCY_TEST
```

### 10.2 实时性演示

以RK3568平台为例，展示AMP方案下Linux操作系统及RTOS的实时性能。通过这个演示，便于了解AMP方案在实时数据处理方面的能力以及相关的特性和工具。

#### 10.2.1 测试方法

Linux系统使用cyclictest测试评估系统的响应时间和延迟。可以从Linux发行版的软件仓库或cyclictest的官方网站下载并安装cyclictest工具。

RTOS使用中断延迟测试评估系统的响应时间和延迟。示例代码路径：hal/project/rk3568/src/test\_demo.c

#### 10.2.2 测试原理

测试原理为创建一个或多个实时线程，这些线程以固定的循环时间运行。每个线程在每个循环中都会记录时间，然后计算出实际的循环时间和偏差。这样可以测量系统的响应时间和延迟。

#### 10.2.3 测试结果

测试将输出测试结果，包括每个循环的当前延迟时间和最大延迟时间等。测试结果如下图：



测试的输出包含了一些关键指标，如以下几个例子：

- Min：测量的最小循环时间。

- Avg:测量的平均循环时间。

- Max：测量的最大循环时间。

- Now：记录当前时间值。

- Occurrence：记录延迟耗时区间发生的次数

- Latency in us：延迟耗时区间

这些指标可用于评估系统的实时性能。最大的延迟时间越小表示系统具有较好的实时性能。

## 第 11 章 附录

### 11.1 术语


| 缩写 | 全称 | 定义开源非对称多处理系统 |
| --- | --- | --- |
| OpenAMP | Open AsymmetricMulti-Processing |  |
| AMP | Asymmetric Multi-Processing | 非对称多处理系统 |
| HAL | Hardwareabstraction layer | 硬件抽象层 |
| Bare-metal | Bare-metal | 提供基于硬件抽象层的裸机开发库 |
| MailBox | MailBox | 一个简单的APB外设，允许CPU、MCU核心通过写操作产生中断来相互通信 |
| RPMsg | Remote ProcessorMessaging | 一种用于多核处理器之间通信的协议 |
| RTOS | Real-time operatingsystem | 实时操作系统 |
| RTT | RT-Thread | 一款主要由中国开源社区主导开发的开源实时操作系统 |
| SDK | SoftwareDevelopment Kit | 软件开发工具包 |
| Linux | Linux | 一种自由和开放源代码的类UNIX操作系统 |
| Kernel | Linux Kernel | Linux内核，是Linux操作系统的核心部分，它负责管理计算机的硬件资源，并提供基本的系统服务。 |
| Hypervisior | Virtual MachineMonitor | 虚拟机监视器用于创建和运行虚拟机的软件、固件或硬件，允许它们共享物理硬件资源 |
| Jailhouse | Jailhouse | 一个针对创建工业级应用程序的小型虚拟机监视器 |

### 11.2 文档索引


| 引用文档 | 说明 | 文档路径 |
| --- | --- | --- |
| Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf | FHT232 小板介绍 | openocd_eclipse-2020-09\RK\OpenOCD\doc |
| Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf | OpenOCD 使用说明 | openocd_eclipse-2020-09\RK\OpenOCD\doc |
| Rockchip Developer Guide UBoot Nextdev CN.pdf | U-boot 开发文档 | docs\cn\Common\UBOOT |
| Rockchip_Developer_Guide_Linux_AB_System_CN.pdf | AB双分区说明 | docs\cn\Common\UBOOT |
| Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf | eMMC 使用说明 | docs\cn\Common\MMC |
| Rockchip_Developer_Guide_UART_CN.pdf | UART 使用说明 | docs\cn\Common\UART |
| Rockchip_Developer_Guide_RT-Thread_SPIFLASH_CN.pdf | SPI FLASH 使用说明 | docs\cn\Common\NVM |
