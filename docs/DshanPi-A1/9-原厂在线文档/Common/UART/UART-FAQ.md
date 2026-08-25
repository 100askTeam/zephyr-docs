---
sidebar_position: 1
---

# UART FAQ排查指南

## 13. 其它问题

13.1 案例

13.1.1 使用某些上位机时Kernel无法正常启动

13.1.2 更换UART设备节点号

1. 使用说明

### 1.1 相关文档

使用本文前，请先阅读以下文档，确保对Rockchip UART的功能特点、使用方法、调试手段等内容理解充分：

Rockchip\_Developer\_Guide\_UART\_CN：Rockchip Linux Kernel UART开发指南。

Rockchip\_Developer\_Guide\_UBoot\_Nextdev\_CN中的UART章节：Rockchip Uboot UART开发指南。

### 1.2 开机日志

DDR Version &lt;version information&gt; # DDR阶段（TPL阶段）打印   

U-Boot SPL board init # Miniloader阶段（SPL阶段）打印   

U-Boot SPL &lt;version information&gt;   

INFO: Preloader serial: 2 # Trust阶段（BL31阶段）打印   

NOTICE: BL31: &lt;version information&gt;   

NOTICE: BL31: Built : &lt;version information&gt;   

I/TC: Rockchip release version: 1.0 # OP-TEE阶段（BL32阶段）打印   

I/TC: OP-TEE version: &lt;version information&gt;   

U-Boot &lt;version information&gt; # U-Boot阶段打印   

Model: Rockchip RK3568 Evaluation Board   

PreSerial: 2, raw, 0xfe660000   

DRAM: 2 GiB   

Sysmem: init   

Starting kernel ...   

[ 0.000000] Booting Linux # Linux Kernel earlycon打印   

[ 0.000000] Linux version &lt;version information&gt;   

[ 0.000000] Machine model: Rockchip RK3568 EVB2 LP4X V10 Board   

[ 0.000000] earlycon: uart8250 at MMIO32 0x00000000fe660000   

[ 0.000000] bootconsole [uart8250] enabled   

[ 0.193783] console [ttyFIQ0] enabled # 切换到fiq\_debugger打印   

[ 0.194484] bootconsole [uart8250] disabled   

[ 0.411356] Serial: 8250/16550 driver # 普通UART初始化

### 1.3 io命令

Rockchip平台中通常集成io命令用于执行直接读写寄存器的操作。io命令源代码在安卓SDK external目录下。下面以RK3568 UART5\_M0为例，说明使用io命令进行调试的常用操作。

确保UART5 pclk打开，才能正确操作UART5控制器的寄存器。可以直接根据TRM手册操作CRU模块对应寄存器，也可以使用以下命令：

```shell
echo 1 > /sys/kernel/debug/clk/pclk_uart5/clk_enable_count
```

使用以下命令查看UART5控制器全部寄存器：

io -4 -l 0x100 0xFE690000

确保UART5 sclk打开，UART5才能正常工作：

```shell
cat /sys/kernel/debug/clk/clk_summary | grep uart5 # UART5相关时钟
cat /sys/kernel/debug/clk/sclk_uart5/clk_rate # UART5工作时钟频率
echo 24000000 > /sys/kernel/debug/clk/sclk_uart5/clk_rate
cat /sys/kernel/debug/clk/sclk_uart5/clk_enable_count # UART5工作时钟状态
echo 1 > /sys/kernel/debug/clk/sclk_uart5/clk_enable_count
```

确保UART5\_M0 IOMUX配置正确，才能从目标引脚得到相应信号，使用的寄存器需要查找TRM中GRF章节：

```shell
io -4 0xFDC60310 # uart5_iomux_sel，选择iomux group 0 或 group 1
fdc60310: 00000000 # bit 0为0，说明UART5_M0配置正确
io -4 0xFDC60020 # gpio2a1_sel和gpio2a2_sel，rx和tx的GPIO function
fdc60020: 00001331 # bit 7:4和bit 11:8均为3，说明UART5_M0 RX和TX配置正确
```

通过直接配置UART5控制器寄存器，实现UART5在115200波特率下的基础收发功能：

```shell
io -4 0xFE690088 0x00000007 # SRR寄存器，对UART和FIFO进行reset
io -4 0xFE690010 0x00000010 # MCR寄存器，将UART配置成loopback模式
io -4 0xFE69000C 0x00000080 # LCR寄存器，div_lat_access置1
io -4 0xFE690000 0x0000000D # DLL寄存器，配置波特率分频系数
io -4 0xFE690004 0x00000000 # DLH寄存器，配置波特率分频系数
io -4 0xFE69000C 0x00000003 # LCR寄存器，div_lat_access清0和配置UART协议参数
io -4 0xFE690010 0x00000000 # MCR寄存器，将UART配置成一般模式
io -4 0xFE690004 0x00000001 # IER寄存器，打开接收中断
io -4 0xFE690008 0x00000041 # FCR寄存器，打开FIFO，FIFO触发阈值配置为1/4
io -4 0xFE69009C # SRT寄存器，读写RX FIFO触发阈值
io -4 0xFE6900A0 # STET寄存器，读写TX FIFO触发阈值
io -4 0xFE690000 0x00000055 # THR寄存器，发送“U”，0x55
io -4 0xFE690000 # RBR寄存器，上位机发送“U”，读取到0x55
```

### 1.4 关闭其它打印干扰

调试过程中可以使用以下命令关闭其它打印干扰：

su   

```
echo 0 > /proc/sysrq-trigger
```

## 2. 波特率相关

如果正在使用的SDK版本较为老旧，请联系Rockchip更新UART相关源码。

### 2.1 时钟分频策略

在Linux Kernel 4.19中，主要关注以下驱动文件和函数代码：

CLK\_FRAC\_DIVIDER\_NO\_LIMIT。注意，某些以前的SDK中可能不包含此功能的补丁，请联系Rockchip FAE获取。

### 2.2 案例

#### 2.2.1 波特率测量方法错误

使用示波器抓取UART TX实际输出波形的波特率。

打印对应UART的工作时钟频率。

根据时钟分频策略计算出的理论UART的工作时钟频率。

打印出的时钟频率正常，测量波特率异常，请检查测量波特率的过程是否有误。时钟分频策略的理论值与打印出来实际输入UART控制器的值有差异，请尝试修改时钟分频策略或更换其它波特率。

#### 2.2.2 使用过程中出错，重启后正常

#### 2.2.3 波特率由高到低切换后异常

## 3. 引脚复用相关

一个UART控制器的信号在引脚分配上通常有多个iomux。配置UART iomux需要同时配置GRF中的两处寄存器，出现问题时也需要通过io命令检查这两处寄存器的值是否正确：

选择GPIO引脚的function：同一个引脚会与多个模块的功能进行复用，需要确认该寄存器的值是否已经配置成UART的对应功能。

### 3.1 案例

#### 3.1.1 不同iomux的TX可以同时使用但RX不能

Rockchip设计iomux是为了更好地利用引脚资源，同一个UART控制器只能选择一组iomux group。iomuxgroup是否成功切换需要检查UART RX功能。因为在UART M0和M1两组iomux的TX引脚中并未加入选择开关，所以可能出现只要对应GPIO引脚的iomux的function都配置成UART功能，两个TX的引脚都会有数据输出的情况。但是在UART M0和M1两组iomux的RX引脚中是存在选择开关的，所以不会出现两个RX的引脚都能接收UART数据的情况。

#### 3.1.2 开启其他模块后串口异常

由于存在引脚复用，某些模块开启后会去重新配置iomux相关寄存器，导致串口传输错误。常见的PWM（显示设备中使用的PWM背光）、SDMMC（系统启动的存储位置）、JTAG（force jtag位需要保持关闭）等功能，在使用不当的情况下都会与UART的iomux冲突。尤其是用于console的UART的对应引脚，其iomux function涉及的模块使用时需要特别注意，配置冲突会导致打印出错。出现此类问题时，请确认对应引脚的iomux function寄存器的值来定位。

## 4. 引脚电平相关

确认kernel dts中UART RX和TX对应引脚电平配置是否正确。

根据芯片的datasheet，检查电源域io domain的配置（1v8或3v0）是否正确。

直接测量UART RX和TX引脚电平是否为高电平，且电压值是否正确。

硬件上的技术支持请联系Rockchip硬件工程师。

### 4.1 案例

#### 4.1.1 硬件PCB设计错误

如果确认软件配置正确后仍无法解决问题，请检查硬件PCB设计，包括但不止以下几种情况：

硬件PCB RX和TX信号线接反、接到低电平或高电平。

UART打开流控，CTS引脚被外部电平强制拉高。

外设实际电平不匹配、电压值错误、没有做漏电保护等。

#### 4.1.2 硬件设计与实际使用的芯片型号不一致

#### 4.1.3 外设TX无法拉低主控RX

出现外设TX无法拉低主控RX从而无法启动UART传输的问题时，请先检查外设是否能拉低其它GPIO引脚。进一步检查外设和主控中间是否存在电平转换芯片、外设引脚驱动能力是否足够等。

## 5. 中断相关

UART中断包括TX发送中断和RX接收中断。因为UART控制器一般都会使用FIFO，所以中断相关问题需要和FIFO配置结合分析。主要关注以下几组寄存器：

IER寄存器：中断使能寄存器。

0x80 PTIME：Programmable THRE Interrupt Mode Enable。提高中断发送传输效率，在TXFIFO中数据触发TX FIFO水线时，提前产生THRI中断，准备下一笔发送数据。

0x08 MSI：Modem Status Interrupt。第四优先级，UART Modem触发的中断，相关寄存器为MCR和MSR。

IIR寄存器：中断识别寄存器，读取触发中断的子中断号。除了IER寄存器中使能的四类子中断，还包括第五类最低优先级的Busy Detect Indication中断。

FCR寄存器：FIFO控制寄存器，操作RX FIFO和TX FIFO的水线配置等的控制。

### 5.1 案例

#### 5.1.1 配置接收中断的触发水线

UART数据传输时，接收中断的触发水线，即FCR寄存器中RX FIFO Trigger Level的配置很关键。Rockchip UART RX FIFO通常为64 Bytes或32 Bytes，可以配置为以下四种触发水线：

2'b00: 1 character in the FIFO

2'b01: FIFO 1/4 full

2'b10: FIFO 1/2 full

2'b11: FIFO 2 less than full

UART RX FIFO触发水线越低，接收数据处理越及时，但是将会产生较多中断消耗CPU资源。通常默认配置为FIFO 1/2 full，在Linux Kernel UART驱动代码drivers/tty/serial/8250/8250\_port.c中的

serial8250\_do\_set\_termios()函数里修改UART\_FCR\_R\_TRIG\_10参数。如果出现UART接收数据错误，可以尝试修改RX FIFO触发水线为2'b00，即每收到一个字符就产生一次中断。

## 6. DMA相关

默认配置DMA传输为burst模式，但burst length为1，即1个byte触发一次DMA请求。UART的这种配置方式是由PL330控制器的特性决定的。由于在UART中断传输模式下，FCR寄存器中的FIFO水线默认配置为2'b10，即1/2 FIFO触发，这与DMA配置不匹配。因此，需要确认FCR寄存器中的FIFO水线是否已经修改配置为2'b00，即1个byte触发一次。详细配置UART FIFO的触发水线方法请参考中断相关章节。

使用DW的DMA控制器不会出现以上问题，但为了统一DMA控制器的配置策略，仍使用同种方案。在使用DMA的过程中，需要注意以下几点：

确认每一笔DMA数据的开始位置和结束位置。

确认下一笔DMA数据传输开始前，DMA控制器的开关状态。

### 6.1 案例

#### 6.1.1 不同版本kernel的DMA配置可能不同

#### 6.1.2 高波特率下DMA模式接收数据出现概率性丢失

### 7.1 案例

#### 7.1.1 打开硬件流控后无法发送数据

此类问题通常是硬件问题，可以从以下方向进行排查：

开发板硬件设计错误、硬件故障等导致CTS引脚被强制拉高。

对方RTS引脚无法正常拉高或拉低，导致连接后一直将我方CTS引脚拉高。

## 8. 数据接收错误相关

UART数据接收错误的问题分为数据接收不到和数据接收出现乱码两类，可以从以下方向进行排查：

硬件层面：确认RX引脚是否配置为内部上拉、外围电路是否有电压电流异常、芯片引脚电平是否正确配置等。如果使用USB转串口小板，请尝试更换更优质的串口线和工具。

驱动层面：使用io命令，关闭IER寄存器中断，运行接收测试程序，检查RFL寄存器中是否有数据停留。确认FCR寄存器配置的RX FIFO触发水线是否满足需求。

如果正在使用的SDK版本较为老旧，请联系Rockchip FAE更新UART相关源码。请仔细阅读本文档其它章节，结合Rockchip\_Developer\_Guide\_UART\_CN中的调试方式进行问题排查。

### 8.1 案例

#### 8.1.1 对方数据发送错误

#### 8.1.2 一次接收大量数据会出现分段

请查看UART驱动代码中数据上报逻辑是否符合要求。注意以下代码中参数max\_count的值是否与循环接收字符的次数一致：

kernel 3.10在drivers/tty/serial/rk\_serial.c的receive\_chars函数中的max\_count。

kernel 4.4和4.19在drivers/tty/serial/8250/8250\_port.c的serial8250\_rx\_chars函数中max\_count。

#### 8.1.3 应用层读取数据出现延迟

```diff
diff --git a/drivers/tty/serial/rk_serial.c b/drivers/tty/serial/rk_serial.c
index 9870873c1200..ff81be78a53a 100644
--- a/drivers/tty/serial/rk_serial.c
+++ b/drivers/tty/serial/rk_serial.c
@@ -2074,6 +2074,9 @@ static int serial_rk_probe(struct platform_device *pdev)
up->port.uartclk = 24000000;
#endif
+ /* update recv data quickly instead of workqueue */
+ up->port.flags |= UPF_LOW_LATENCY ;
```

在kernel 4.4和kernel 4.19中，UART驱动框架只支持Work Queue上报数据给应用层。如果对实时性有较高要求，请使用RTOS。

## 9. 连接外设或其它控制器相关

UART连接蓝牙、WIFI、NFC等外设或其它控制器出现数据传输异常时，可以从以下方向进行排查：

确认错误数据是否存在规律：通过分析获取到的数据，根据错误数据出现的位置、数量以及数值，推理可能的原因。

### 9.1 案例

#### 9.1.1 蓝牙传输异常

DMA模式：两线蓝牙配置为DMA模式，可能会出现蓝牙没有环形buffer的警告，需要自行根据使用场景配置DMA buffer。

#### 9.1.2 使用RS485出现异常

Rockchip UART模块原生不支持RS485，仅支持RS232。因此，如果需要使用RS485需要外接转换模块。  

使用RS485出现异常时，请检查硬件电路设计以及相关电平状态。

## 10. 控制台打印相关

使用控制台打印时，以下几点需要注意：

每一级的打印波特率需要保持一致，具体配置参考本文的关闭所有打印或切换所有打印到其他UART章节。

如果需要打印大量数据，在驱动代码中，增大FIFO\_SIZE可以提高线程打印的缓存能力。

### 10.1 案例

#### 10.1.1 使用控制台发送大量测试命令时出现shell卡死

此类问题通常出现在客户进行自动化压力测试时，使用控制台发送大量测试命令，shell会卡死。这是安卓shell造成的，建议更换基于busybox的shell或者bash。

#### 10.1.2 回车和换行的问题

## 11. 休眠唤醒和功耗相关

如果对于休眠状态下的功耗有严格要求，作为唤醒源的UART需要使用晶振作为工作时钟输入，以节省CRU小数分频器带来的功耗。

## 12. 关闭所有打印或切换所有打印到其他UART

每一级均使用关闭打印或切换打印到其他UART的特殊固件：通常Rockchip早期平台只支持这种修改方式。请联系Rockchip以获取特殊前级固件支持。

使用传参机制关闭打印或切换打印到其他UART：Rockchip前级打印使用传参机制，只需要修改DDR Loader的UART打印参数，即可在前级所有阶段生效。Kernel阶段需要单独进行修改。

### 12.1 DDR Loader修改方法

uart id= # UART控制器id，配置为0xf为关闭打印  

uart iomux= # 复用的IOMUX引脚  

uart baudrate= # 115200 or 1500000

详细使用说明请参考文档：ddrbin\_tool\_user\_guide.txt。修改完成后，使用以下命令重新生成ddr.bin固件。具体ddr.bin固件名请替换为实际SDK中使用的ddr.bin固件名。

```shell
./ddrbin_tool ddrbin_param.txt path/to/ddr.bin
```

### 12.2 Uboot修改方法

Uboot中关闭打印，需要在menuconfig中，打开配置CONFIG\_DISABLE\_CONSOLE，保存到.config文件。

console ---&gt;   

disable console in&out

### 12.3 Kernel修改方法

#### 12.3.1 Kernel中关闭打印

需要在menuconfig中，关闭配置CONFIG\_SERIAL\_8250\_CONSOLE。

Device Drivers ---&gt;   

Character devices ---&gt;   

Serial drivers ---&gt;   

[ ] Console on 8250/16550 and compatible serial port

在dts配置中找到类似以下内容，并去掉UART基地址和console相关配置参数。

```hcl
chosen: chosen {
bootargs = "earlycon=uart8250,mmio";
}
```

找到fiq-debugger节点，修改serial-id为0xffffffff，去掉UART引脚复用相关配置。注意，需要保持fiq-debugger节点使能，保持fiq-debugger流程系统才能正常启动。

```c
fiq-debugger {
compatible = "rockchip,fiq-debugger";
rockchip,serial-id = <0xffffffff>;
rockchip,wake-irq = <0>;
/* If enable uart uses irq instead of fiq */
rockchip,irq-mode-enable = <1>;
rockchip,baudrate = <1500000>; /* Only 115200 and 1500000 */
interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
status = "okay";
};
```

#### 12.3.2 Kernel中切换打印

例如将Kernel打印从UART2切换到UART3，在dts配置中找到类似以下内容，将UART基地址由UART2改为UART3.

找到fiq-debugger节点，修改serial-id为3，修改UART3引脚复用配置。注意，同时需要将切换为打印串口的UART3作为普通串口的节点禁用。

```c
fiq-debugger {
compatible = "rockchip,fiq-debugger";
rockchip,serial-id = <3>;
rockchip,wake-irq = <0>;
/* If enable uart uses irq instead of fiq */
rockchip,irq-mode-enable = <1>;
rockchip,baudrate = <1500000>; /* Only 115200 and 1500000 *
interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
pinctrl-names = "default";
pinctrl-0 = <&uart3m0_xfer>;
status = "okay";
};
```

#### 12.3.3 将原控制台UART作为普通UART使用

进行完上述关闭或切换控制台UART后，需要重新将该UART作为普通UART使能。注意，在dts配置流程下一定是先关闭或切换控制台UART，将其释放后再作为普通UART在对应UART节点使能。

### 12.4 Android修改方法

service recovery /sbin/recovery   

#console   

seclabel u:r:recovery:s0

### 12.5 案例

#### 12.5.1 由打印串口切换成普通串口后出现的问题

## 13. 其它问题

### 13.1 案例

#### 13.1.1 使用某些上位机时Kernel无法正常启动

这些上位机默认串口配置打开软件流控是不合理的。因为软件流控并不可靠，且在Rockchip平台上并未使用软件流控。如果出现此类问题，请检查上位机串口工具的配置。

#### 13.1.2 更换UART设备节点号

如果需要更换UART设备节点号，以ttyS3和ttyS4交换为例。请在dts中修改以下内容：

```
aliases {
serial3 = &uart4;
serial4 = &uart3;
}
```

如果是将作为控制台的UART和普通UART设备节点号交换，请直接修改drivers/tty/tty\_io.c 中的tty\_line\_name()函数，对需要修改的编号进行判断。
