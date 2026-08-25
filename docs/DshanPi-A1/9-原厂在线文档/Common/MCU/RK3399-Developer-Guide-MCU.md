---
sidebar_position: 1
---

# RK3399 MCU 开发指南

## 1. Rockchip MCU简介

ARM® Cortex®-M处理器系列具有灵活性、易用性、高性能、低功耗等特点。同时，Cortex-M处理器能够帮助开发者以更低的成本提供更多的功能，其在代码重用和提高开发效率方面有显著优势，所以在嵌入式设备领域的应用非常广泛。如下为Cortex-M0基本简介。

Cortex-M0采用ARMv6-M结构，基于一个高集成度、低功耗的32位处理器内核；它采用冯·诺伊曼结构，基于16位的Thumb指令集，并包含Thumb-2技术。

基于以上ARM® Cortex®-M优点，目前，Rockchip SoC上集成的MCU说明如下：

RK3399 集成2个Cortex-M0，其一PMU M0为ATF所用，其二Perilp M0开放给客户使用。

## 2. 开发基础

### 2.1 运行前配置

本章节主要以RK3399 Perilp M0为例介绍Rockchip MCU开发的基础方法。

#### 2.1.1 启动地址

以常见miniloader + ATF + u-boot的启动方式为例。

采用这种启动方式，通常将MCU代码编译生成的BIN和ATF的BIN一起打包为trust.img，因此，需要在u-boot添加如下打包配置。

tools/rk\_tools/RKTRUST/RK3399TRUST.ini   

[BL30\_OPTION]   

SEC=1   

PATH=tools/rk\_tools/bin/rk33/rk3399bl30\_v1.00.bin   

ADDR=0x00080000

其中，PATH为MCU BIN文件存放路径，ADDR为MCU在DDR中被加载的地址（MCU的0地址）。当然这个地址需要是在u-boot中reserve出来的一段安全地址。这个地址会传递给miniloader，其会负责将MCU的代码从ROM中加载到DDR的这个地址处。

当然，如果使用u-boot或其它loader作为一级boot loader，也可参考上面的方法对M0的固件进行打包和加载。

MCU BIN编译方法参阅3.2.2章节。

#### 2.1.2 地址映射

Coretex-M0/Coretex-M3拥有固定的Memory Map，这样方便软件在不同系统之间的轻松移植，其地址空间被分为许多不同的段，可参阅Cortex-M0 Devices Generic User Guide

Chapter 2.2章节Memory model和RK3399 TRM Chapter 7.4.2章节。通常，我们只需要配置MCU的0x00000000-0x1FFFFFFF地址映射。

注意，RK3399 M0的地址映射需要通过SGRF配置，所以务必在能访问SGRF的模块进行配置（通常放在miniloader或ATF中进行），以2.1.1章节中的加载地址为例，具体内存映射配置方式如下：

### 启动地址配置

sgrf\_perilp\_m0\_con7 = 0xf &lt;&lt; (4 + 16) | (0x080000 &gt;&gt; 28) & 0x0f   

sgrf\_perilp\_m0\_con15 = 0xffff &lt;&lt; 16 | (0x80000 &gt;&gt; 12) & 0xffff

### 外设地址配置

Rockchip MCU已默认配置了外设的映射地址(0x40000000-0x5FFFFFFF)，即：

ADDR\_MCU = ADDR\_CA72 – 0xB8000000

这里的外设就是RK3399 TRM Chapter 2 System Overview中所列出的外设。

#### 2.1.3 时钟配置

Rockchip MCU 时钟源可选择CPLL或GPLL，可参考RK3399 TRM Chapter 3 CRU章节。在其章节中指出clk配置寄存器为CRU\_CLKSEL\_CON24(0x0160)，其中：

bit[15] : 时钟源选择，1’b0: CPLL；1’b1: GPLLbit[12:8] : 分频设置，用于配置MCU的运行频率。

### u-boot 参考代码

```c
arch/arm/cpu/armv8/rk33xx/clock-rk3399.c
#ifdef CONFIG_PERILP_MCU
/* peril m0 clk = 300MHz, select gpll as the source clock */
clk_parent_hz = RKCLK_GPLL_FREQ_HZ;
clk_child_hz = 300000000; /* HZ */
div = rkclk_calc_clkdiv(clk_parent_hz, clk_child_hz, 1);
div = div ? (div - 1) : 0;
cru_writel((1 << 31) | (0x1F << 24) | (1 << 15) | (div << 8),
CRU_CLKSELS_CON(24));
#endif
```

#### 2.1.4 复位撤销

MCU运行起来的最后一步就是进行复位撤销。其寄存器信息阅RK3399 TRM Chapter 3 CRU章节。RK3399 Perilp M0的复位撤销寄存器为：

PMUCRU\_SOFTRST\_CON0(0x0110)   

需要设置PMUCRU\_SOFTRST\_CON0[5:0] = 4b’0000.

u-boot 参考代码

```c
arch/arm/cpu/armv8/rk33xx/clock-rk3399.c
#ifdef CONFIG_PERILP_MCU
/* perilp m0 dereset */
cru_writel(0x00160000, CRU_SOFTRSTS_CON(11));
#endif
```

提示：时钟和复位的配置可放在最后期望MCU跑起来的地方，目前Rockchip SDK是放在u-boot当中。

### 2.2 其它配置

#### 2.2.1 JTAG使能配置

MCU开发过程中，常常需要借助于JTAG来跟踪、调试和解决问题。Rockchip MCU JTAG接口采用SWD（2线）模式，需要配置JTAG iomux后才能连接上。

RK3399 Perilp M0的iomux配置信息详见RK3399 TRM Chapter 7.3章节，包括如下两个寄存器。

GRF\_GPIO4B\_IOMUX[9:8] = 2’b10   

GRF\_GPIO4B\_IOMUX[9:8] = 2’b10

### 2.3 MCU与主控通信

#### 2.3.1 Mailbox

Rockchip SoC上集成的mailbox拥有4个通道，通过中断触发，数据通过共享内存传递。RockchipMCU可通过mailbox外设与主控通信。RK3399 Mailbox编程可参阅RK3399 TRM Chapter 21 Mailbox章节；RK3368 Mailbox参考RK3368 TRM Chapter 11 Mailbox章节。

目前Linux 4.4 Kernel中，Mailbox Driver框架上层使用ARM SCPI协议，因此需要在Kernel开启CONFIG\_RK3368\_MBOX和CONFIG\_RK3368\_SCPI\_PROTOCOL两个配置。同时，MCU这边代码也需要编写mailbox驱动和scpi协议支持。

Kernel DTS可参考下面代码进行配置。

```dts
mailbox: mailbox@ff6b0000 {
compatible = "rockchip,rk3368-mbox-legacy";
reg = <0x0 0xff6b0000 0x0 0x1000>,
<0x0 0xff8cf000 0x0 0x1000>; /* the end 4k of sram *
interrupts = <GIC_SPI 146 IRQ_TYPE_LEVEL_HIGH>,
<GIC_SPI 147 IRQ_TYPE_LEVEL_HIGH>,
<GIC_SPI 148 IRQ_TYPE_LEVEL_HIGH>,
<GIC_SPI 149 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru PCLK_MAILBOX>;
clock-names = "pclk_mailbox";
#mbox-cells = <1>;
status = "disabled";
};
mailbox_scpi: mailbox-scpi {
compatible = "rockchip,rk3368-scpi-legacy";
```

```javascript
mboxes = <&mailbox 0>, <&mailbox 1>, <&mailbox 2>;
chan-nums = <3>;
status = "disabled";
};
```

#### 2.3.2 共享内存

Rockchip MCU亦可通过共享内存方式与主控通信，比如在INTMEM (SRAM)中划分一块空间，将其配置成对主控和MCU均可访问，即可实现共享内存方式通信。

Rockchip MCU还可以通过UART或其它方式与主控通信。

## 3. Demo程序

### 3.1 代码获取

Git仓库路径：

https://github.com/rockchip-linux/mcu

参考rk3399-box-m0分支。

### 3.2 代码简介

#### 3.2.1 目录结构

```makefile
rk-mcu>ls -R
.:
build include Makefile src
./build:
arm-gcc-link.ld RK3399M0
./build/RK3399M0:
bin obj
./build/RK3399M0/bin:
RK3399M0.bin RK3399M0.dump RK3399M0.elf RK3399M0.map
./build/RK3399M0/obj:
main.o startup.o
./include:
mcu.h rk3399.h
./src:
main.c startup.c
```

build：用于存放编译生成的obj文件和bin文件。

include：代码头文件。

src：代码C文件。

startup.c文件为M0入口程序，主要包括M0中断向量表和中断执行函数。  

main.c文件为M0程序的main函数。

#### 3.2.2 编译方法

交叉编译工具链使用gcc-arm-none-eabi- v4.8版本或以上。编译方法如下：

rk-mcu&gt;make help   

usage: make PLAT=&lt;RK3399M0&gt; &lt;all|clean|distclean&gt;   

PLAT is used to specify which platform you wish to build.   

If no platform is specified in first time, PLAT defaults to:   

Supported Targets:   

all Build all the project   

clean Clean the current platform project   

distclean Clean the current project and delete .config   

example: build the targets for the RK3399M0 project:   

make PLAT=RK3399M0

编译后会生成build/RK3399M0/bin/RK3399M0.bin文件，将RK3399M0.bin拷贝到u-boot目录中tools/rk\_tools/bin/rk33/目录，重命名为rk3399bl30\_v1.00.bin；然后按照2.1.1章节配置，重新编译u-boot，即可将M0的bin打包到trust.img。

#### 3.2.3 中断编程

M0中断向量表可参阅Cortex-M0 Devices Generic User Guide

Chapter 2.3 Exception model章节。对应到Demo程序，即src/startup.c中有如下参考代码：

```c
/**
* The minimal vector table for a Cortex M3. Note that the proper constructs
* must be placed on this to ensure that it ends up at physical address
* 0x00000000.
*/
_attribute__ ((used,section(".isr_vector")))
void (* const g_pfnVectors[])(void) =
{
/* core Exceptions */
(void *)&pstack[STACK_SIZE], /* the initial stack pointer */
reset_handler,
nmi_handler,
hardware_fault_handler,
0,0,0,0,0,0,0,
svc_handler,
0,0,
pend_sv_handler,
systick_handler,
```

```c
M0_INT_ARB_SET_MASK() // 设置中断mask
M0_INT_ARB_GET_FLAG() // 获取中断bit
```

/\* external exceptions \*/   

0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,   

0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0   

```
};

Coretex-M0内部有16个异常，从g_pfnVectors[0]到g_pfnVectors[15]，可根据实际应用需要注册并实现对应的异常处理函数。

Cortex-M0可处理32个外部中断，对应g_pfnVectors[16]到g_pfnVectors[47]。
```

RK3399 Perilp M0引入了中断仲裁器，将32个外部中断扩展到256个，可参阅RK3399 TRMChapter 7.4.6 Interrupt Source Arbiter for PERILPM0章节。当然，使用仲裁器，需要配置对应的mask bit，而M0收到中断后，需要根据对应的mask bit来判断具体的中断源。

Arbiter的接口可参考include/rk3399.h中

RK3399 Perilp M0支持的外部中断请参阅RK3399 TRM 2.4 System Interrupt Connection for Cortex-M0 章节。

## 4. MCU调试

### 4.1 JTAG调试

GRF中设置JTAG相关iomux、tck、tms，请阅2.2.1章节。

开发板JTAG拨码开关或tck/tms开关拨至MCU处；

DS-5或ICE连接MCU进行调试。

### 4.2 串口打印

M0可直接访问UART寄存器进行打印调试。

如果MCU使用跟主控相同的UART，建议正常运行时关闭M0打印，防止UART访问异常导致系统异常。

### 4.3 读写寄存器

可将系统停留到u-boot或Kernel命令行，通过io读取MCU状态寄存器查看MCU状态。

也可将MCU关键点的运行状态写入空闲GRF寄存器，然后在u-boot或kernel命令行读取其值判断MCU的当前运行状态。

## 5. 参考文档

Cortex-M0 Devices Generic User Guide Cortex-M0 Technical Reference Manual Rockchip RK3399 TRM V1.4
