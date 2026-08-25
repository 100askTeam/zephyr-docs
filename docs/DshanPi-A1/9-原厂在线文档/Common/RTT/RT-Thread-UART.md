---
sidebar_position: 1
---

# RT-Thread UART开发指南

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师、软件开发工程师

修订记录


| 版本 | 作者 | 日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 洪慧斌 | 2019-06-13 | 初始版本 |
| V1.1.0 | 刘诗舫 | 2020-05-15 | 格式修订 |
| V1.2.0 | 洪慧斌 | 2024-08-15 | 支持RTT V4.1版本 |

RT-Thread UART开发指南  

1. Rockchip UART 功能特点  

2. 软件  

2.1 代码路径  

2.2 配置  

2.3 串口测试  

2.4 波特率支持  

2.5 console配置

## 1. Rockchip UART 功能特点

UART （Universal Asynchronous Receiver/Transmitter）

兼容16550A

部分串口支持硬件自动流控，部分不支持，详细参看数据手册

支持中断传输模式和DMA传输模式

最高支持4M波特率，部分支持8M波特率，详细参看数据手册

部分芯片支持硬件RS485，详细参看数据手册

## 2. 软件

### 2.1 代码路径

串口框架：

components/drivers/include/drivers/serial.h   

components/drivers/serial/serial.c 设备驱动   

components/libc/termios/posix\_termios.c 类似linux的tty配置   

components/libc/termios/posix\_termios.h

串口驱动适配层：

bsp/rockchip-pisces/drivers/drv\_uart.c   

bsp/rockchip-pisces/drivers/drv\_uart.h

串口测试命令，串口用户程序完全可以参照以下驱动：

bsp/rockchip-common/tests/termios\_test.c

### 2.2 配置

打开串口配置，同时会生成/dev/uart0..9设备。

RT-Thread rockchip RKxxxx drivers   

[\*] Enable UART   

[\*] Enable UART0   

[ ] Enable UART1   

[\*] Enable UART2   

[ ] Enable UART3   

[ ] Enable UART4   

[ ] Enable UART5   

[ ] Enable UART6   

[ ] Enable UART7   

[ ] Enable UART8   

[ ] Enable UART9

### 执行命令可以看到已经生成的串口设备：

msh &gt;list\_device   

device type ref count   

uart7 Character Device 0   

uart6 Character Device 0   

uart5 Character Device 0   

uart4 Character Device 2   

uart3 Character Device 0   

uart2 Character Device 0   

uart1 Character Device 0   

uart0 Character Device 0

### 2.3 串口测试

使能串口测试程序：

lts-v3.1.x:   

RT-Thread Components ---&gt;   

Device virtual file system ---&gt;   

[\*] Using device virtual file system   

-\*- Using devfs for device objects   

POSIX layer and C standard library ---&gt;   

[\*] Enable termios feature   

RT-Thread bsp test case ---&gt;   

RT-Thread Common Test case ---&gt;   

[\*] Enable BSP Common TEST   

[\*] Enable BSP Common UART TEST   

lts-v4.1.x:   

RT-Thread Components ---&gt;   

[\*] DFS: device virtual file system ---&gt;   

[\*] Using devfs for device objects   

C/C++ and POSIX layer ---&gt;   

POSIX (Portable Operating System Interface) layer ---&gt;   

[\*] Enable POSIX file system and I/O   

[\*] Enable I/O Multiplexing select() &lt;sys/select.h&gt;

```c
[*] Enable Terminal I/O <termios.h>
RT-Thread bsp test case --->
RT-Thread Common Test case --->
[*] Enable BSP Common TEST
[*] Enable BSP Common UART TEST
```

### 串口测试命令：

receive data:   

termtest r /dev/uart4 115200   

send data:   

termtest s /dev/uart4 115200   

receive then send:   

termtest t /dev/uart4 115200   

externel loopback:   

termtest l /dev/uart4 115200

### 2.4 波特率支持

1.5M以下的波特率都可以支持，1.5M以上的波特率需要实际测试看支不支持，因为这跟CLK 时钟树有关。

### 2.5 console配置

RT-Thread Kernel ---&gt;   

Kernel Device Object ---&gt;   

[\*] Using console for rt\_kprintf   

(128) the buffer size for console log printf   

(uart2) the device name for console
