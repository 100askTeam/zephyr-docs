---
sidebar_position: 1
---

# Rockchip Developer Guide Linux SARADC

## 前言

SARADC是一个6通道10bit有效位的数模转化器，当输入频率为13MHz，转换速度为1MSPS。

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| ROCKCHIP 芯片 | 4.4/4.19 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

## 修订记录


| 日期 | 版本 | 作者 | 修改说明 |
| --- | --- | --- | --- |
| 2019.12.23 | V1.0 | 薛小明 | 初始发布 |

Rockchip Developer Guide Linux SARADC  

SARADC 驱动  

驱动文件  

DTS 节点配置  

SARADC 使用  

内核配置  

SARADC常用接口

### SARADC 驱动

### 驱动文件

驱动文件所在位置：

drivers/iio/adc/rockchip\_saradc.c

### DTS 节点配置

DTS 配置参考文档为 Documentation/devicetree/bindings/iio/adc/rockchip-saradc.txt ，本文主要说明如下参数:

```
interrupts = <GIC_SPI 62 IRQ_TYPE_LEVEL_HIGH 0>;
```

转换完成，产生中断信号。

```
io-channel-cells = <1>;
```

必须为1，详见iio-bindings.txt。

```
vref-supply = <&vccadc_ref>;
```

saradc值对应的参考电压，需要根据具体的硬件环境设置，最大为1.8V，对应的saradc值为1024，电压和adc值成线性关系。

### SARADC 使用

1. 依赖"iio"框架，需要初始化 struct iio\_dev 结构体，具体请看 rockchip\_saradc\_probe 函数当中的indio\_dev ，最后调用 iio\_device\_register(indio\_dev) 注册 indio\_dev , 等待"input"框架使用。

2. 以"adc-key"为例，需要初始化 struct input\_polled\_dev ，具体请看drivers/input/keyboard/adc-keys.c 当中的 adc\_keys\_probe 函数，调用input\_register\_polled\_device(poll\_dev); 将 poll\_dev 注册进"input"框架。

3. 当使用 getevent 测试时候，假设 adc-key 为event0，则 getevent -s /dev/input/event0 ，

会有如下调用关系：

adc\_keys\_poll -&gt; iio\_read\_channel\_processed -&gt; iio\_channel\_read -&gt; chan-  

&gt;indio\_dev   

-&gt;info-&gt;read\_raw(rockchip\_saradc\_read\_raw) -&gt;   

iio\_convert\_raw\_to\_processed\_unlocked

rockchip\_saradc\_read\_raw 是重要函数，逐条分析：

```c
1. writel_relaxed(8, info->regs + SARADC_DLY_PU_SOC);
```

设置power up到开始采样的间隔为8个sclk周期。

2. writel(SARADC\_CTRL\_POWER\_CTRL | (chan-&gt;channel & SARADC\_CTRL\_CHN\_MASK)

| SARADC\_CTRL\_IRQ\_ENABLE,info-&gt;regs + SARADC\_CTRL);

a) "power up saradc"

b) 设置采样通道

c) 使能中断，开始采样

3. wait\_for\_completion\_timeout(&info-&gt;completion, SARADC\_TIMEOUT)

等待saradc完成采样，并产生中断。

4. \*val = info-&gt;last\_val; 将采样数据存放在val中。

5. 最后调用 iio\_convert\_raw\_to\_processed\_unlocked 将采样数据转换成对应的电压值。

中断处理过程： rockchip\_saradc\_isr 函数：

1. info-&gt;last\_val = readl\_relaxed(info-&gt;regs + SARADC\_DATA);

保存数据，提供给上面的第4步使用。

```c
2. writel_relaxed(0, info->regs + SARADC_CTRL);
```

清中断，并且"power down saradc"，关闭saradc。

一个完整的采样过程是 rockchip\_saradc\_read\_raw 配置saradc,打开saradc,开始采样，等待中断，中断函数中清除中断，关闭saradc。

### 内核配置

Symbol: ROCKCHIP\_SARADC [=y]   

Type : tristate   

Prompt: Rockchip SARADC driver   

Location:   

-&gt; Device Drivers   

-&gt; Industrial I/O support (IIO [=y])   

(1) -&gt; Analog to digital converters   

Defined at drivers/iio/adc/Kconfig:319   

Depends on: IIO [=y] && (ARCH\_ROCKCHIP [=y] || ARM && COMPILE\_TEST [=n]) &&   

RESET\_CONTROLLER [=y]

### SARADC常用接口

1.可以通过用户态接口获取adc值，其中\*表示adc第多少通道:

```batch
cat /sys/bus/iio/devices/iio\:device0/in_voltage*_raw
```

例如 channle0:

```batch
cat /sys/bus/iio/devices/iio\:device0/in_voltage0_raw
```

2.内核常用接口:

获取电压: iio\_read\_channel\_processed()
