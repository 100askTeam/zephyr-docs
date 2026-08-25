---
sidebar_position: 1
---

# GNU MCU Eclipse OpenOCD

## 前言

## 概述

本文主要介绍 GNU MCU Eclipse OpenOCD调试方面的功能。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3588 |  |
| RK3568 |  |
| RK3566 |  |
| RK3399 |  |
| RK3288 |  |
| RK3368 |  |
| RK3326 |  |
| PX30 |  |
| RK3308 |  |
| RV1108 |  |
| RV1126/RV1109/RV1106 |  |
| RK2108 |  |
| RK2206 |  |
| RISCV |  |

读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 洪慧斌 | 2020-04-21 | 初始版本 |
| V1.1.0 | 洪慧斌 | 2020-06-18 | 主要修改章节2操作系统环境，增加章节4，修改公司名称 |
| V1.2.0 | 洪慧斌 | 2020-08-07 | 主要修改OpenOCD命令配置，源代码路径配置 |
| V2.0.0 | 洪慧斌 | 2021-02-08 | 调整了整个文档结构，主要是让用户更容易上手，再逐步深入 |

## 1. 说明

调试架构：Eclipse CDT+GNU MCU Eclipse OpenOCD+Eclipse+GDB+OpenOCD+ftdi/jlink+SOC

Eclipse CDT (C/C++ Development Tooling) C/C++ 开发工具

GNU MCU Eclipse OpenOCD 是一个开源插件，主要完成CDT和GDB、OpenOCD的交互

Eclipse 是一个很强大的工具，可以集成各种插件，ARM DS-5也是基于它

GDB GNU调试器

OpenOCD 是一个开源的调试软件，可以适配各种SWD/JTAG适配器，支持ARM，RISCV等架构

ftdi 采用ft232h，USB转SWD/JTAG芯片，可以作为SWD/JTAG适配器，速度快，稳定性高

## 2. 操作系统环境

### 2.1 Windows

#### 2.1.1 eclipse软件包openocd\_eclipse.zip

解压，进入主目录：

"Eclipse\_for\_OpenOCD V1.0.exe" 执行该文件，可以打开eclipse软件

RK 目录：

eclipse-workspace 工作 目 录，eclipse已默认把工作 目 录设到该文件夹

example 相关的例子

tools 开源相关的工具，如GDB，JDK

实战视频 快速上手

OpenOCD openocd相关文件

SVD（CMSIS System View Description format）主要用来查看芯片寄存器

doc 使用帮助文档

#### 2.1.2 运行eclipse，需要安装JRE

RK\tools\jdk\_8.0.1310.11\_64.exe

#### 2.1.3 使能Windows telnet功能

telnet用来进入openocd的命令行模式。

不同的Windows版本，使能telnet的入口可能不一样，请自行百度。以下主要介绍windows10:





### 2.2 Ubuntu 64位

#### 2.2.1 eclipse软件包openocd\_eclipse.tar.gz

解压openocd\_eclipse.tar.gz：

tar -xzvf openocd_eclipse.tar.gz

进入主目录：

eclipse 执行该文件，打开eclipse软件

RK 目录：

eclipse-workspace 工作 目 录，eclipse已默认把工作 目 录设到该文件夹

example 相关的例子

OpenOCD openocd相关文件

SVD （CMSIS System View Description format）主要用来查看芯片寄存器

tools 开源相关的工具，如GDB

doc 使用帮助文档

实战视频 快速上手

#### 2.2.2 安装软件

运行eclipse，需要安装JRE。

```shell
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jre 这里不<sup>一</sup>定要8
```

运行openocd需要libusb。

```shell
sudo apt-get install libusb-1.0-0-dev
sudo apt-get install libftdi-dev
```

拷贝USB设备信息

sudo cp RK/OpenOCD/drivers/99-openocd.rules /etc/udev/rules.d/ sudo cp RK/OpenOCD/drivers/60-openocd.rules /etc/udev/rules.d/

安装开源的反汇编工具capstone。

sudo apt-get install libcapstone-dev

说明：在Ubuntu 16.04和Ubuntu 18.04测试正常

## 3. 快速上手

不管是Ubuntu还是Windows，UI界面基本一致。由于大部分人习惯Windows，本文介绍以Windows为主。

### 3.1 硬件连接

#### 3.1.1 ARM 20PIN标准JTAG座子



#### 3.1.2 TF转JTAG小板



#### 3.1.3 UART2与JTAG复用



### 3.2 软件连接

#### 3.2.1 运行软件Eclipse\_for\_OpenOCD V1.0.exe



#### 3.2.2 导入芯片配置（非必需）

正常拿到的软件包，已经包含了芯片配置，但是芯片配置会持续更新，修改或增加芯片配置，这就需要导入芯片配置。





#### 3.2.3 从芯片支持列表里找到所需要连接的芯片





#### 3.2.4 连接成功

cpu stop后的效果如下：



#### 3.2.5 连接失败

##### 3.2.5.1 JTAG适配器无法识别

需要确认适配器的驱动，或者适配器是否能正常工作。参照文档《Rockchip\_Developer\_Guide\_FT232H\_USB2JTAG.pdf》

说明：openocd默认可以 自 动识别ft232h ft2232h jlink三种适配器。



##### 3.2.5.2 芯片无法识别

需要确认芯片引脚接触是否正常，或者芯片的JTAG IOMUX是否使能，或者降低JTAG的TCK速率。

the connection is ok, but the cpu is in incorrect state

这种情况表示硬件连接正常，JTAG也认到了，但是芯片状态异常，这种情况是无法继续debug的

please check hardware, make sure swd/jtag iomux is correct, and the pins connection is ok

please check hardware, the swdio(tms) pin is low level

上述2种情况是，硬件连接问题，可能是IOMUX没配好，或者pin脚接触不良

Please, adapter speed 1000 set clk 1MHz to try again

遇到这个log，需要降低JTAG速率，再次尝试连接



## 4. 基础调试功能

### 4.1 调整SWD/JTAG速率

如果硬件限制导致SWD/JTAG通讯失败，需要降低TCK的速率，比如1000KHz。

最大到30000KHz，推荐使用15000KHz或者7500KHz。



### 4.2 静态加载符号表

静态加载符号表需要在连接前完成，而且只能加载一个符号表。



### 4.3 动态加载符号表

在Debugger Console窗口，这实际是执行GDB命令的窗口，执行add-symbol-file命令加载符号表，可同时加载多个符号表。

加载linux符号表：add-symbol-file G:/vmlinux   

加载bl31符号表：add-symbol-file T:/work/uboot/u-boot/bl31.elf   

加载tpl符号表：add-symbol-file T:/work/uboot/u-boot/tpl/u-boot-tpl   

加载spl符号表：add-symbol-file T:/work/uboot/u-boot/spl/u-boot-spl   

加载uboot符号表：add-symbol-file T:/work/uboot/u-boot/u-boot

注意：在windows环境，需要将"\"改为"/"。

另外，执行完加载命令后，需要单步跑下，函数调用栈才会显示出来。



### 4.4 设置源代码路径

方法1，如下图



方法2，进入Debug Configurations界面设置  



### 4.5 查看反汇编

### 查看调用栈函数的反汇编



### 查看某个地址的反汇编



### 查看某个函数的反汇编，前提是有导入符号表



### 4.6 查看调用栈函数的局部变量



### 4.7 查看全局变量

点击Expressions窗口的Add new expression，输入全局变量名字


| (x)= Variables Expressions3PeripheralsBreakpointsModulesTerminal                        口E:日+××口 000Expression                                                  Value输入全局变量的名字&#123;...&#125;&#123;.&#125; |  |  |  |  |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
| 量的名字 |  |  |  |  |
|  |  |  |  |  |
| init task输入全局变 | struct thread_info |  |  |  |
| &gt;thread_info | volatile long |  |  |  |
|  |  |  |  |  |
| (x)= state | void * |  |  |  |
| 0xfffff8009920000 |  |  |  |  |
| stack | atomic_t |  |  |  |
| [&#123;.&#125; |  |  |  |  |
| &gt;  usage |  | unsigned int |  |  |
|  | 2097410 |  |  |  |
| (x)= flags |  | unsigned int |  |  |
|  | 0 |  |  |  |
| (x)= ptrace |  | struct Ilist_node |  |  |
|  | &#123;.&#125; |  |  |  |
|  | &gt;wake_entry | int |  |  |
|  | 0 |  |  |  |
|  | (x)= on_cpu | unsigned int |  |  |
|  | 0 |  |  |  |
|  | (x)= cpu | unsigned int |  |  |
|  |  |  |  |  |
|  |  |  | last wakee                      struct task struct *&lt;                                                                                                                     7Name : init taskDetails:&#123;thread_info = &#123;flags = 40, addr_limit = 18446744073709551615, ttbr0 = 38969344, preempt_coιDefault:&#123;...&#125;Decimal.S   1E |  |
|  |  |  |  |  |
|  | (x)= wakee flip decay ts |  | strurt tack strust *. |  |
|  |  |  |  |  |
|  |  |  |  |  |

点击Expressions窗口的Add new expression，输入指针形式的expression


| (x)= Variables Expressions   Peripherals BreakpointsModules   Terminal                        口日:日+×\|口 000Value(struct task_struct *)0xfffff800993b7struct task_struct *  0xfffff800993b7c0 &lt;init_task&gt; |  |  |
| --- | --- | --- |
|  |  |  |
| (struct task_struct *)0xfffff800993b7 | struct task_struct * |  |
| thread_info | struct thread_info | &#123;.&#125;&#125; |
| (x)= state | volatile long | 0 |
| stack | void * | 0xfffff8009920000 |
| usage | atomic_t | &#123;.&#125; |
| (x)= flags | unsigned int | 2097410 |
| (x)= ptrace | unsigned int | 0 |
| wake_entry | struct llist_node | &#123;..&#125;&#125; |
| (x)= on_cpu | int | 0 |
| (x)= cpu | unsigned int | 0 |
| (x)= wakee_flips | unsigned int | 231 |
| (x)= wakee_flip_decay_ts | unsigned long | 4305262800 |
| last wakee | struct task struct * | 0vffffffc035978e80 |

### 4.8 单步调试



### 4.9 设置断点

### 在从源代码窗口设置断点



### 从Disassembly窗口设置



### 4.10 查看内存数据



注意：Memory Browser窗口只能正常支持32位地址的访问，对于64位地址访问有问题，请进入OpenOCD命令行模式用mdw,mww,

smdw,smww,io等操作内存。

## 5. 高级调试功能

### 5.1 寄存器分组

由于寄存器很多，查看起来不方便，分组查看比较方便



### 5.2 指定连接的CPU



### 5.3 安全调试

如果客户产品使能安全策略，那么JTAG需要输入key才能调试。



### 5.4 OpenOCD命令行模式（基于命令行终端）

在cmd窗口打开openocd，获取使用帮助



更多命令请参考：OpenOCD User’s Guide：

http://openocd.org/doc/html/General-Commands.html#General-Commands

openocd.exe -r 连接芯片



基于cmd窗口创建telnet连接，新打开一个cmd窗口，执行telnet localhost 4444



127.0.0.1 - SecureCRT


| 文件( 编辑(E) 超 | 查看(V) 选项(O) | 传输(T) 脚本(S) 工具(L) 帮助(H) |
| --- | --- | --- |
| 连接(C)... 快速连接(Q)... | Alt+C 号 昌 Alt+Q |  |
|  |  |  |
| 在标签页中连接(B)... Alt+B 重新连接(R) |  |  |
| 關&amp; X |  |  |
| 全部重新连接(A) 断开(D) |  |  |
| 全部断开(O) |  |  |
| 克隆会话(N) |  |  |
| 连接SFTP标签页(S) Alt+P 锁住会话(K)... |  |  |
| 打印(P) |  |  |
| 打印设置(U)... |  |  |
| 记录会话(L) |  |  |
| 记录原始会话(W) |  |  |
| 跟踪选择(T) 1 127.0.0.1 |  |  |
| 2 Serial-COM23 |  |  |
| 3 Serial-COM4 4 Serial-COM8 |  |  |





### 5.5 OpenOCD命令行模式（基于eclipse）

有时候有些信息UI无法很好的展示或者操作，这时就需要OpenOCD的命令行模式。

打开本地终端



输入telnet localhost 4444进入命令行模式，如果提示不识别telnet命令，请参照《使能Windows telnet功能》章节。



### 5.6 查看可视化的外设寄存器

连接前，选择svd格式的文件




| Console  Memory Brows... | Memory |  | Debugger Con... ExecutablesProblemsProgress | 口 日 | (x)= Variables  Expresso... |  | PerinheralsBreakpoi..ModulesTerminalType Hier.. | □日 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 3 |  |  |  |  |  | 吨日 |  |
| Monitors GRF | +x&amp; | GRF: OxFDC600003 | New Renderings... |  | Peripheral CRU | Address | Description |  |
|  | Register |  | Address | Value ^ |  | 0xFDD20000 | CRU registers |  |
| GRF | 0xFDC60000 |  | GPIO1 | 0xFE740000 0xFE750000 | GPIO1 registers GPIO2 registers |  |  |  |
| &gt; GPIO1A_IOMUX_L | 0xFDC60000 | 0x00001100 | GPIO2 |  |  |  |  |  |
| &gt;  GPIO1A_IOMUX_H | 0xFDC60004 | 0x00001014 | GRF 2 | 0xFDC60000 | GRF registers |  |  |  |
| &gt; GPIO1B IOMUX_L | 0xFDC60008 | 0x00001000 | GRF_CORE | 0xFDC30000 | GRF_CORE registers |  |  |  |
| GPIO1B_IOMUX_H | 0xFDC6000C | 0x00001111 | PMUCRU | 0xFDD00000 | PMUCRU registers |  |  |  |
| gpio1b4_sel | [2:0] | 0x1: EMMC_D0 | UART2 | 0xFE660000 | UART2 registers |  |  |  |
| gpio1b5_sel | [6:4] | 0x1: EMMC_D1 | WDT | 0xFE600000 | WDT registers |  |  |  |
| gpio1b6 sel | [10:8] | 0x1: EMMC_D2 |  |  |  |  |  |  |
| gpio1b7_sel |  | [14:12] | 0x1: EMMC_D3 |  |  |  |  |  |
| write_enable |  | [31:16] | 0x0: Write accessd... |  |  |  |  |  |
| GPIO1C_IOMUX_L |  | 0xFDC60010 | 0x00001111 |  |  |  |  |  |
| gpio1c0_sel | [2:0] |  | 0x1: EMMC_D4 &lt; |  |  |  |  |  |
| gpio1c1_sel | [6:4] | 0x1: EMMC_D5 |  |  |  |  |  |  |
| gpio1c2 sel |  | [10:8] | 0x1: EMMC_D6 |  |  |  |  |  |
|  | gpio1c3_sel | [14:12] | 0x1: EMMC_D7 |  |  |  |  |  |
|  | write enable | [31:16] | 0x0: Write access d... |  |  |  |  |  |
|  | &gt; GPIO1C_IOMUX_H | 0xFDC60014 | 0x00001111 |  |  |  |  |  |
|  | &gt;  GPIO1D_IOMUX_L | 0xFDC60018 |  |  |  |  |  |  |
|  | MIL CRIO1D IOMUVU | A.rDC5001C | 0x00002222 0-00001112 |  |  |  |  |  |

### 5.7 查看可视化的system control registers

连接前，选择svd格式的文件





### 5.8 从内存导出数据到文件

dump\_image filename [p:]address size   

虚拟地址访问：   

&gt; dump\_image dd.bin 0xffffff8009a63c80 65536   

dumped 65536 bytes in 0.113187s (565.436 KiB/s)   

物理地址访问：   

&gt; dump\_image dd.bin p:0x01c63c80 65536   

dumped 65536 bytes in 0.094566s (676.776 KiB/s)

### 5.9 从文件导入数据到内存

load\_image filename [p:]address ['bin'|'ihex'|'elf'|'s19'] [min\_address]   

[max\_length]   

虚拟地址访问：   

&gt; load\_image dd.bin 0xffffff8009a63c80 bin   

65536 bytes written at address 0xffffff8009a63c80   

downloaded 65536 bytes in 0.055928s (1144.328 KiB/s)   

物理地址访问：   

&gt; load\_image dd.bin p:0x01c63c80 bin   

65536 bytes written at address 0x01c63c80   

downloaded 65536 bytes in 0.056400s (1134.752 KiB/s)

### 5.10 对比文件和内存里的数据是否一致

verify\_image filename [offset [type]]   

只支持虚拟地址访问：   

&gt; verify\_image dd.bin 0xffffff8009a63c80   

verified 65536 bytes in 0.066775s (958.443 KiB/s)

说明：上述3个命令都会涉及虚拟地址和物理地址。需要特别强调对于maskrom, tpl, spl, uboot, atf 等

可以认为虚拟地址跟物理地址是一样的，所以只需采用虚拟地址访问方式即可。但是对于linux，物理地址

和虚拟地址是不一样的，当需要访问物理地址时，需要在地址前面加p:。

同时filename是相对路径话，那么dd.bin就是保存在openocd运行的目录下。

## 6. 实际运用场景

### 6.1 调试CPU卡死问题

当出现画面卡死，或者黑屏，或者串口无法敲命令，或者内核报的相关错误，都表明CPU无法继续执行程序，可能卡死在某条或某几条指令上。

以调试RK3399开机死机为例子，如下死机时内核log，log基本停止，串口无法敲命令，显示画面不更新。

[ 7.441882] type=1400 audit(1501952314.540:9): avc: denied &#123; setattr &#125; for   

pid=1 comm="init" name="mmcblk1p13" dev="tmpfs" ino=15288 scontext=u:r:init:s0   

tcontext=u:object\_r:block\_device:s0 tclass=lnk\_file permissive=1   

[ 7.455950] init: Service 'exec 2 (/system/bin/vdc)' (pid 252) exited with   

status 0   

rk3399\_all:/ \$ [ 7.589883] random: nonblocking pool is initialized   

[ 8.078474] init: Starting service 'bootanim'...   

[ 8.261358] read channel() error: -110   

[ 15.245727] BUG: spinlock lockup suspected on CPU#2, adbd/251

\$ ./src/openocd.exe -r rk3399   

Open On-Chip Debugger 0.10.0+dev-01555-g6ad367fa3-dirty (2021-08-04-17:44)

Licensed under GNU GPL v2   

For bug reports, read   

http://openocd.org/doc/doxygen/bugs.html   

中间省掉很多log   

Info : clock speed 2000 kHz   

Info : SWD DPIDR 0x5ba02477   

Info : cpu0: hardware has 6 breakpoints, 4 watchpoints   

Info : cpu1: hardware has 6 breakpoints, 4 watchpoints   

Info : cpu2: hardware has 6 breakpoints, 4 watchpoints   

Info : cpu3: hardware has 6 breakpoints, 4 watchpoints   

Info : cpu4: hardware has 6 breakpoints, 4 watchpoints   

Info : cpu5: hardware has 6 breakpoints, 4 watchpoints   

Info : starting gdb server for cpu0 on 3333   

Info : Listening on port 3333 for gdb connections   

Info : starting gdb server for cpu1 on 3334   

Info : Listening on port 3334 for gdb connections   

Info : starting gdb server for cpu2 on 3335   

Info : Listening on port 3335 for gdb connections   

Info : starting gdb server for cpu3 on 3336   

Info : Listening on port 3336 for gdb connections   

Info : starting gdb server for cpu4 on 3337   

Info : Listening on port 3337 for gdb connections   

Info : starting gdb server for cpu5 on 3338   

Info : Listening on port 3338 for gdb connections

另外再打开<sup>一</sup>个cmd窗口，输入telnet localhost 4444 进入命令行调试

Open On-Chip Debugger   

&gt; cpu\_block 查看针对cpu卡死问题，有哪些命令可以用   

l 查看cpu状态   

dump\_pc 多次打印pc指针   

halt 停住cpu   

if halt fail, try fhalt 强制cpu进入debug 状态   

if fhalt success, try core\_reg64 or core\_reg32, but you can't access memory   

&gt; l

cpu3 pc:0xffffff8008081078  

cpu4 pc:0xffffff80081133c8  

cpu5 pc:0xffffff800808248c  

3  

cpu0 pc:0xffffff8008143a88  

cpu1 pc:0xffffff8008143a5c  

cpu2 pc:0xffffff8008081078  

cpu3 pc:0xffffff8008081078  

cpu4 pc:0xffffff80081133c8  

cpu5 pc:0xffffff800808248c  

4  

cpu0 pc:0xffffff8008143a88  

cpu1 pc:0xffffff8008143a5c  

cpu2 pc:0xffffff8008081078  

cpu3 pc:0xffffff8008081078  

cpu4 pc:0xffffff80081133c8  

cpu5 pc:0xffffff800808248c  

5  

cpu0 pc:0xffffff8008143a88  

cpu1 pc:0xffffff8008143a5c  

cpu2 pc:0xffffff8008081078  

cpu3 pc:0xffffff8008081078  

cpu4 pc:0xffffff80081133c8  

cpu5 pc:0xffffff800808248c 经过5次打印，发现6个cpu的pc指针都没变，那么很可能是卡死了  

&gt; halt  

Timeout waiting for target cpu0 halt 第<sup>一</sup>次尝试停cpu0失败  

&gt; fhalt  

cpu0 fail to force entry to debug state; prsr:00000001 第二次尝试停cpu0失败，这时只  

能根据打印出来的pc指针来查问题了  

&gt; l cpu1  

&gt; halt  

Timeout waiting for target cpu1 halt  

&gt; fhalt  

cpu1 fail to force entry to debug state; prsr:00000001  

&gt; l cpu2  

&gt; halt  

Timeout waiting for target cpu2 halt  

&gt; fhalt  

cpu2 success to force entry to debug state; prsr:00000011 终于可以停住cpu2  

&gt; core\_reg64 可以打印cpu通用寄存器，以便进<sup>一</sup>步分析  

x0 (/64): 0xffffffc00a3d7e00  

x1 (/64): 0xffffff8008081028  

x2 (/64): 0x0000000000000000  

x3 (/64): 0x00000040edbb6000  

x4 (/64): 0x0100000000000000  

x5 (/64): 0x000000000d8031bf  

x6 (/64): 0x000000000000126a  

x7 (/64): 0xffffff8008141ee0  

x8 (/64): 0x0000000000000000  

x9 (/64): 0x0000000000000000  

x10 (/64): 0x00000000000012b0

ffffff8008081028 &lt;gic\_handle\_irq&gt;:   

ffffff8008081028: a9bc7bfd stp x29, x30, [sp, #-64]!   

ffffff800808102c: 910003fd mov x29, sp   

ffffff8008081030: a9025bf5 stp x21, x22, [sp, #32]   

ffffff8008081034: d00096b6 adrp x22, ffffff8009357000   

&lt;event\_hash+0x288&gt;   

ffffff8008081038: a90363f7 stp x23, x24, [sp, #48]   

ffffff800808103c: d000a335 adrp x21, ffffff80094e7000   

&lt;event\_class\_drv\_config+0x40&gt;   

ffffff8008081040: aa0003f7 mov x23, x0   

ffffff8008081044: 913a82d6 add x22, x22, #0xea0   

ffffff8008081048: 912642b5 add x21, x21, #0x990   

ffffff800808104c: a90153f3 stp x19, x20, [sp, #16]   

ffffff8008081050: 52800038 mov w24, #0x1   

// #1

ffffff8008081054: d503201f nop   

ffffff8008081058: 14000008 b ffffff8008081078   

&lt;gic\_handle\_irq+0x50&gt;   

ffffff800808105c: 71003e7f cmp w19, #0xf

```asm
x11 (/64): 0x000000000000000f
x12 (/64): 0x0000000100000000
x13 (/64): 0x0000000000000001
x14 (/64): 0x0000000000000000
x15 (/64): 0x0000000000000000
x16 (/64): 0xffffff80080b8b28
x17 (/64): 0x0000007cf3aeee00
x18 (/64): 0x0000000000000000
x19 (/64): 0x000000000000001e
x20 (/64): 0x0000008000000000
x21 (/64): 0xffffff80094e7990
x22 (/64): 0xffffff8009357ea0
x23 (/64): 0xffffffc00a3d7e00
x24 (/64): 0x0000000000000001
x25 (/64): 0xffffffc0f6ed4060
x26 (/64): 0xffffffc0f6ed8050
x27 (/64): 0x0000000000ed9234
x28 (/64): 0xffffffc00a3cad00
x29 (/64): 0xffffffc0f6ed8000
x30 (/64): 0xffffff8008083230
sp (/64): 0xffffffc0f6ed8000
pc (/64): 0xffffff800808107c
> mrs SCTLR_EL1 也可以读system control寄存器
Cannot reach EL 0, SPSR corrupted?
SCTLR_EL1:0x34d5d91d
> mrs SCTLR_EL2
Cannot reach EL 0, SPSR corrupted?
SCTLR_EL2:0x30c50830
> mrs SCTLR_EL3
Cannot reach EL 0, SPSR corrupted?
SCTLR_EL3:0x00cd383f
```

```asm
ffffff8008081060: 540007e8 b.hi ffffff800808115c
<gic_handle_irq+0x134> // b.pmore
ffffff8008081064: 92407e60 and x0, x19, #0xffffffff
ffffff8008081068: d518cc20 msr s3_0_c12_c12_1, x0
ffffff800808106c: d5033fdf isb
ffffff8008081070: d503201f nop
ffffff8008081074: 14000035 b ffffff8008081148
<gic_handle_irq+0x120>
ffffff8008081078: d538cc13 mrs x19, s3_0_c12_c12_0
*ffffff800808107c: d5033f9f dsb sy cpu2卡死在这个位置
ffffff8008081080: 51004260 sub w0, w19, #0x10
ffffff8008081084: 2a1303f4 mov w20, w19
ffffff8008081088: 710fac1f cmp w0, #0x3eb
ffffff800808108c: 54000089 b.ls ffffff800808109c
<gic_handle_irq+0x74> // b.plast
ffffff8008081090: 5283ffe0 mov w0, #0x1fff
// #8191
ffffff8008081094: 6b00027f cmp w19, w0
ffffff8008081098: 54fffe29 b.ls ffffff800808105c
<gic_handle_irq+0x34> // b.plast
```

经过以上步骤，客户如果还是无法分析死机原因，可以将上述命令的log发给Rockchip的工程师分析。

### 6.2 RT-Thread调试说明

默认只显示单线程，添加以下命令后，可以显示多线程



### 6.3 单步调试Linux

如果内核启动过程中，没任何内核的log输出，排除串口问题的话，那么比较可能是内核启动早期异常了。

#### 6.3.1 内核单核阶段

```c
linux5.10/init/main.c
asmlinkage __visible void __init __no_sanitize_address start_kernel(void)
{
char *command_line;
char *after_dashes;
asm volatile("b .");
}
```

如下图，右击b . 指令的下一条指令，选择Move To line跳到下一条指令，进行单步调试

eclipse-workspace - Source not found. - Eclipse Platform   

File Edit Navigate Search Project Run Window Help   

Debug RK3588\_bl31\_inux i+ Q   

Offf011a00700 83 Registers 23 Enter location here   

erR 圖   

O fff c1a00700 View Disass.embly... Configure when this editor is shown Preferences... 0xffffc11b591c0 ffffffc011a006e4: 0xf44f04a9 stp adp x20, ×19, [5p, #64] orack   

openocd.exe 0x0 ffffffc011a006f4: exc00a00ba aden xθ, exffffffc011b59000 &lt;init\_shadow   

aarch64-none-elf-gdb.exe 0xffffc0c11b43f94 ffffffc011a006f8: 0x00000791 add xθ, x0, #0x1c0   

f stur 48&gt;   

0xfffc1b43f544   

0×8000000000 ffffc0704:0xe008999 -\_stack\_e   

0x722c716b72606afe fffff011708 8194   

0x0 b1 Select All Ctrl+A   

nop   

9 0x2 ffffffc011a00714: @x080c8052 Show Source 从 #   

Ox08 s4203d5 sdrpp mov Show Symbols conntrac   

0x0 c01724:x8163539 strb   

0x36e28 ffffffc011a00728:0x59250094 b1 Run to Line Ctrl+R init&gt;   

ffc01072c:exc0eaffde adrp   

0x0 adrp Move To Line 2 Ige\_vaddr   

Oxfffc062d1088 ffffff01100734:x0782591 add Resume At Line   

x3 2a04   

0xffc10b581c8 fffffc01744:xe0230091 add xθ, sp, #0x8   

22 ×19 0x2034f4d91d ffffffc011800748: 0x77120094 b1 0xfffffc011a05124 &lt;setup\_arch&gt;   

0x30500800 b d   

0xa100000 ffffffc011800754:0xa2010094 θxfffffc011aeddc &lt;setup command li   

171 ×x22 0x4 fffc01758:0x7400094 bl exfffceiialeab &lt;setup \_nr cpu ids   

171 x23 0x0 b1   

0x0 ffffffc011a00764: 0x7d250094 b1 exffffffce11ae9d58 &lt;boot\_cpu\_hotplug   

ffffffc011a00768: @xe0031faa x9. xz5   

ffffffc011a0076c: 0xf9b7e197 b1 0xffffffc01126e750 &lt;build al1 zoneli   

ffffffc011a00770: 0xf15f0094 b1   

ffffffc011a00774:0x882900ba adrp x8, 0xffffffc011f31000 &lt;reset\_device:   

Cons...   

Peripheral Address Description   

RK3588\_bl31\_linux [GDB OpenOCD Debugging] openocd.exe BIGCOREOCRU 0xFD810000 BIGCOREOCRU registers   

(116) d22 (/64) BIGCORE1CRU 0xFD812000 BIGCORE1CRU registers   

CRU OxFD7C0000 CRU registers   

(12)) 口 DDROCRU DDR01\_GRF 0xFD59C000 0xFD800000 DDR01\_GRF registers DDROCRU registers   

(121 d27 (/64 DDR1CRU 0xFD804000 DDR1CRU registers   

DDR23 GRE 0xFD59D000DDR23 GRE registers   

(124   

d31 (/64))   

(126) fpscr (/32)   

&lt;   

316M of 681M S ， ↓  Y

#### 6.3.2 内核多核阶段

```c
linux5.10/kernel/cpu.c
void bringup_nonboot_cpus(unsigned int setup_max_cpus)
unsigned int cpu;
for_each_present_cpu(cpu) {
if (num_online_cpus() >= setup_max_cpus)
break;
if (!cpu_online(cpu))
cpu_up(cpu, CPUHP_ONLINE);
}
asm volatile("b .");
}
```



### 6.4 裸机调试

#### 6.4.1 创建工程

安装eclipse的标准流程创建工程能

配置编译器的各种参数

配置交叉编译器



#### 6.4.2 加载并运行固件

注意：需要在哪个芯片上调试，就复制一份该芯片的配置，然后在这基础上修改





### 6.5 kgdb使用

#### 6.5.1 kgdb用途

调试某个驱动

出现非法指针时，用来回溯整个调用栈，判断指针出错的点

采用串口通讯，而非JTAG接口，方便快捷

#### 6.5.2 kgdb使能

menuconfig配置

Device Drivers ---&gt;   

Character devices ---&gt;   

[\*] Virtual terminal

[\*] Enable character translations in console (NEW)   

[\*] Support for console on virtual terminal (NEW)   

-&gt; Kernel hacking   

-&gt; Generic Kernel Debugging Instruments   

[\*] KGDB: kernel debugger ---&gt;   

--- KGDB: kernel debugger   

[\*] KGDB: use kprobe blocklist to prohibit unsafe breakpoints (NEW)   

&lt;\*&gt; KGDB: use kgdb over the serial console (NEW)   

Kernel hacking ---&gt;   

Debug Oops, Lockups and Hangs ---&gt;   

(0) panic timeout 这个要配成0，出现die时才会进入kgdb   

或者echo 0 &gt; /sys/module/kernel/parameters/panic 将panic timeout时间设为0，即   

不reboot

### 内核修改

```hcl
arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
chosen {
bootargs = "kgdboc_earlycon kgdboc=ttyFIQ0,1500000";
};
```

### 验证生效

```
echo g > /proc/sysrq-trigger
[ 1.385017][ T0] kgdboc: No suitable earlycon yet, will try later
[ 1.385069][ T0] earlycon: uart8250 at MMIO32 0x00000000feb50000
(options '')
[ 1.390726][ T0] printk: bootconsole [uart8250] enabled
[ 2.956193][ T0] kgdboc: Going to register kgdb with earlycon 'uart'
[ 2.956196][ T0] KGDB: Registered I/O driver kgdboc_earlycon
[ 3.092139][ T1] Unable to handle kernel NULL pointer dereference at
```

virtual address 000000000000007f   

[ 3.093010][ T1] Mem abort info:   

[ 3.093329][ T1] ESR = 0x96000005   

[ 3.093672][ T1] EC = 0x25: DABT (current EL), IL = 32 bits   

[ 3.094219][ T1] SET = 0, FnV = 0   

[ 3.094561][ T1] EA = 0, S1PTW = 0   

[ 3.094912][ T1] Data abort info:   

[ 3.095238][ T1] ISV = 0, ISS = 0x00000005   

[ 3.095651][ T1] CM = 0, WnR = 0   

[ 3.095987][ T1] [000000000000007f] user address but active\_mm is   

swapper   

[ 3.096633][ T1] Internal error: Oops: 96000005 [#1] PREEMPT SMP   

[ 3.097206][ T1] KGDB: Waiting for remote debugger

#### 6.5.3 kgdb配置



6.6 aarch64 32位模式的调试

-c "cpu0 aarch64\_32 "
