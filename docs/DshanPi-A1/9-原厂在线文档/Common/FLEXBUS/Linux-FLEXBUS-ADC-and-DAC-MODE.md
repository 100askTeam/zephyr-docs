---
sidebar_position: 1
---

# Rockchip FLEXBUS ADC 和 DAC 模式开发指南

## 前言

## 概述

本文档介绍了如何在 Linux 使用 FLEXBUS ADC 模式和 DAC 模式。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3576 | 6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 姚旭伟 | 2024-06-11 | 初始版本 |

## 1. FLEXBUS ADC 模式

### 1.1 概述

时钟频率最高 100MHz

分辨率最高 16-Bit

### 1.2 配置

#### 1.2.1 硬件配置

只支持将 ADC 器件的 LSB 连接到 FLEXBUS1\_D0，例如 10-Bit ADC 连接至 FLEXBUS1\_D[9:0]、16-Bit ADC 连接至 FLEXBUS1\_D[15:0]

slave 模式为器件向 FLEXBUS1 提供 CLK，master 模式为 FLEXBUS1 向器件提供 CLK

#### 1.2.2 内核配置

FLEXBUS ADC 模式依赖 iio/adc 框架。

Device Drivers -&gt; Multifunction device drivers -&gt; Rockchip Flexbus

Device Drivers -&gt; Industrial I/O support -&gt; Analog to digital converters -&gt; Rockchip Flexbus ADC opmode driver

#### 1.2.3 dtsi 配置

以 RK3576 平台和 RK3576 TEST1 板子，FLEXBUS1 对接 ADC 为例。

rk3576.dtsi 中：

```dts
flexbus: flexbus@2a2f0000 {
flexbus_adc: adc {
compatible = "rockchip,flexbus-adc";
#io-channel-cells = <0>;
rockchip,slave-mode; // 配置 slave 模式，不配置则为 master 模式
rockchip,free-sclk; // 配置时钟保持输出，不配置则时钟跟随数据
rockchip,auto-pad; // 默认配置
rockchip,cpol; // 配置 CPOL = 1，不配置则为 0
rockchip,cpha; // 配置 CPHA = 1，不配置则为 0
rockchip,dfs = <16>; // data frames
```

```javascript
status = "disabled";
};
flexbus_dac: dac {
};
};
```

rockchip,slave-mode：配置了为 slave 模式为器件向 FLEXBUS1 提供 CLK；不配置为 master 模式，FLEXBUS1 向器件提供 CLK

rockchip,free-sclk：配置了则时钟一直保持输出，不配置则只在数据传输时输出时钟（该配置仅在master 模式有效）

rockchip,cpol、rockchip,cpha：与 SPI 协议的定义相同，根据器件手册的时序图配置

arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi 中：

```hcl
&flexbus {
rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_xxx>;
rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 选择
ADC 模式
status = "okay"; // 使能 FLEXBUS
};
&flexbus_adc {
pinctrl-names = "default";
pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
&flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
&flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
&flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
&flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// 配置 FLEXBUS1 ADC 模式需要的 IOMUX
status = "okay"; // 使能 ADC 模式
};
```

#### 1.2.4 驱动文件

驱动文件为 drivers/iio/adc/rockchip-flexbus-adc.c。

其中 rockchip\_flexbus\_adc\_read\_block() 是 read ADC 器件数据的函数，主要操作有：

1. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_RX\_NUM, num\_of\_dfs);

配置 RX 数量，单位是 dfs（dtsi 中的 rockchip,dfs）

3. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_DMA\_DST\_LEN0, dst\_len);配置 dst buffer 的长度

4. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_ENR, FLEXBUS\_RX\_ENR);

Enable RX 传输

5. wait\_for\_completion\_timeout(&rkfb\_adc-&gt;completion, FLEXBUS\_ADC\_TIMEOUT)

等待 RX 传输完成，产生中断（中断处理函数为 rockchip\_flexbus\_adc\_isr()）

6. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_ENR, FLEXBUS\_RX\_DIS);

Disable RX 传输

### 1.3 常用接口

#### 1.3.1 确认 FLEXBUS ADC 对应的 device

例如：

说明 FLEXBUS ADC 对应 iio:device0

#### 1.3.2 获取 ADC 值

```batch
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_raw
33004
```

### 1.3.3获取和修改时钟频率

获取时钟频率：

root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0   

root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat   

in\_voltage\_sampling\_frequency   

99000000

说明当前时钟频率为 99MHz。

修改时钟频率：

时钟频率就被改为 25MHz。

Note：

只有 master 模式支持获取和修改时钟频率，slave 模式的 CLK 来源于 ADC 器件

时钟频率最高 100MHz

## 2. FLEXBUS DAC 模式

### 2.1 概述

时钟频率最高 100MHz

分辨率最高 16-Bit

### 2.2 配置

#### 2.2.1 硬件配置

只支持将 DAC 器件的 LSB 连接到 FLEXBUS0\_D0，例如 10-Bit DAC 连接至 FLEXBUS0\_D[9:0]、16-Bit DAC 连接至 FLEXBUS0\_D[15:0]

#### 2.2.2 内核配置

FLEXBUS DAC 模式依赖 iio/dac 框架。

Device Drivers -&gt; Multifunction device drivers -&gt; Rockchip Flexbus

Device Drivers -&gt; Industrial I/O support -&gt; Digital to analog converters -&gt; Rockchip Flexbus DAC opmode driver

#### 2.2.3 dtsi 配置

以 RK3576 平台和 RK3576 TEST1 板子，FLEXBUS0 对接 DAC 为例。

rk3576.dtsi 中：

```dts
flexbus: flexbus@2a2f0000 {
flexbus_adc: adc {
};
flexbus_dac: dac {
compatible = "rockchip,flexbus-dac";
#io-channel-cells = <0>;
rockchip,free-sclk; // 配置时钟保持输出，不配置则时钟跟随数据
rockchip,cpol; // 配置 CPOL = 1，不配置则为 0
rockchip,cpha; // 配置 CPHA = 1，不配置则为 0
rockchip,dfs = <16>; // data frames
status = "disabled";
};

rockchip,free-sclk：配置了则时钟一直保持输出，不配置则只在数据传输时输出时钟

rockchip,cpol、rockchip,cpha：与 SPI 协议的定义相同，根据器件手册的时序图配置
```

arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi 中：

```hcl
&flexbus {
rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 选择
DAC 模式
rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_xxx>;
status = "okay"; // 使能 FLEXBUS
};
&flexbus_dac {
pinctrl-names = "default";
pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
&flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
&flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
&flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
&flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// 配置 FLEXBUS0 DAC 模式需要的 IOMUX
status = "okay"; // 使能 DAC 模式
};
```

#### 2.2.4 驱动文件

驱动文件为 drivers/iio/dac/rockchip-flexbus-dac.c。

其中 rockchip\_flexbus\_dac\_write\_block() 是向 DAC 器件发送数据的函数，主要操作有：

1. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_TX\_NUM, num\_of\_dfs);配置 TX 数量，单位是 dfs（dtsi 中的 rockchip,dfs）

2. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_TXWAT\_START, val);配置水线

4. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_DMA\_SRC\_LEN0, src\_len);配置 src buffer 的长度

5. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_ENR, FLEXBUS\_TX\_ENR); Enable TX 传输

7. rockchip\_flexbus\_writel(rkfb, FLEXBUS\_ENR, FLEXBUS\_TX\_DIS); Disable TX 传输

2. 3常用接口

#### 2.3.1 确认 FLEXBUS DAC 对应的 device

例如：

说明 FLEXBUS DAC 对应 iio:device2

#### 2.3.2 向 DAC 发送数据

```batch
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 16383 >
out_voltage_raw
```

### 2.3.3获取和修改时钟频率

获取时钟频率：

root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device2   

root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# cat   

out\_voltage\_sampling\_frequency   

99000000

说明当前时钟频率为 99MHz。

修改时钟频率：

时钟频率就被改为 25MHz。

Note：

时钟频率最高 100MHz
