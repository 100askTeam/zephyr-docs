---
sidebar_position: 1
---

# IO-Domain 开发指南

## 前言

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3188 | 4.4 |
| RK3288 | 4.4 |
| RK3036 | 4.4 |
| RK312x | 4.4 |
| RK322x | 4.4 |
| RK3368 | 3.10 |
| RK3368 | 4.4 |
| RK3366 | 4.4 |
| RK3399 | 4.4 |
| RV1108 | 3.10 |
| RV1108 | 4.4 |
| RK3228H | 3.10 |
| RK3328 | 4.4 |
| RK3326/PX30 | 4.4 |
| RK3308 | 4.4 |

读者对象 本文档（本指南）主要适用于以下工程师： 技术支持工程师 软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 吴达超 | 2019-01-28 | 初始版本 |
| V1.0.1 | 黄莹 | 2021-05-28 | 修改格式，增加版权信息 |

## 1. 驱动文件与 DTS 节点

### 1.1 驱动文件

驱动文件所在位置： drivers/power/avs/rockchip-io-domain.c

### 1.2 DTS 节点

内核 3.10 版本的 DTS 节点合并：

```
1 io-domains {
2 compatible = "rockchip,rk3368-io-voltage-domain";
3 rockchip,grf = <&grf>;
4 rockchip,pmugrf = <&pmugrf>;
```

5   

6 /\*GRF\_IO\_VSEL\*/   

7 dvp-supply = &lt;&ldo7\_reg&gt;; /\* DVPIO\_VDD \*/   

8 wifi-supply = &lt;&ldo7\_reg&gt;; /\* APIO2\_VDD \*/   

9 audio-supply = &lt;&dcdc2\_reg&gt;; /\* APIO3\_VDD \*/   

10 sdcard-supply = &lt;&ldo1\_reg&gt;; /\* SDMMC0\_VDD \*/   

11 gpio30-supply = &lt;&dcdc2\_reg&gt;; /\* APIO1\_VDD \*/   

12 gpio1830-supply = &lt;&dcdc2\_reg&gt;;/\* ADIO4\_VDD \*/   

13   

14 /\*PMU\_GRF\_IO\_VSEL\*/   

15 pmu-supply = &lt;&ldo5\_reg&gt;; /\* PMUIO\_VDD \*/   

16 vop-supply = &lt;&ldo5\_reg&gt;; /\* LCDC\_VDD \*/   

```
17 };
```

### 内核 4.4 版本的 DTS 节点 GRF 和 PMUGRF 分开：

```
1 &io_domains {
2 status = "okay";
3 dvp-supply = <&vcc_18>;
4 audio-supply = <&vcc_io>;
5 gpio30-supply = <&vcc_io>;
6 gpio1830-supply = <&vcc_io>;
7 sdcard-supply = <&vccio_sd>;
8 wifi-supply = <&vccio_wl>;
9 };
```

10   

```
11 &pmu_io_domains {
12 status = "okay";
```

13   

14 pmu-supply = &lt;&vcc\_io&gt;;   

15 vop-supply = &lt;&vcc\_io&gt;;   

```
16 };
```

## 2. TRM 中的描述

支持配置的两种电压 1.8v / 3.3v：

寄存器配置成 1，一般对应的电压范围是 1.62v \~ 1.98v，typical 电压 1.8v；

寄存器配置成 0，一般对应的电压范围是 3.00v \~ 3.60v，typical 电压 3.3v。

具体电压范围要以实际芯片的 Datasheet 为准。

## 3. 驱动软件流程

下面是 rockchip-io-domain.c 驱动的软件流程图，主要分为两个方面：

### 3.1 初始化配置



3. 2动态配置

在初始化的过程中，会绑定 regulator，通过注册 notify 的方式，一旦这个 regulator 的电压发生变化，就会通知 io-domain 驱动更新成对应的寄存器，做到动态更新寄存器的效果。

## 4. 如何配置 io-domain

不是每个 IO 电源域都需要配置，有些 IO 的电源域是固定的，不需要配置。下面 3 个步骤描述如何通过软件配置 io-domian：

### 4.1 通过 rockchip-io-domain.txt 文档寻找名称

需要在软件上通过 dts 配置的 IO 电源域在 Linux Kernel 的目录下的文件都有描述：

Possible supplies for rk3399:

bt656-supply: The supply connected to APIO2\_VDD.

audio-supply: The supply connected to APIO5\_VDD.

sdmmc-supply: The supply connected to SDMMC0\_VDD.

gpio1830-supply: The supply connected to APIO4\_VDD.

Possible supplies for rk3399 pmu-domains:

pmu1830-supply:The supply connected to PMUIO2\_VDD.

4. 2通过硬件原理图寻找 io-domain 配置的真实电压

U1000L


| RK3399-Socket |
| --- |
| G31 GPIO2_A0/VOP_D0/CIF_D0/I2C2_SDA_u &gt;CIF_D0 |
| H25 GPIO2_A1/VOP_D1/CIF_D1/I2C2_SCL_u CIF_D1 H30 CIF_D2 |
| GPIO2_A2/VOP_D2/CIF_D2_d F28 CIF_D3 |
| GPIO2_A3/VOP_D3/CIF_D3_d H29 |
| GPIO2_A4/VOP_D4/CIF_D4_d CIF_D4 F29 |
| GPIO2_A5/VOP_D5/CIF_D5_d CIF_D5 H27 |
| GPIO2_A6/VOP_D6/CIF_D6_d CIF_D6 G30 |
| GPIO2_A7/VOP_D7/CIF_D7/I2C7_SDA_u CIF_D7 |
| H28 &gt;&gt;CIF_VSYNC |
| GPIO2_B0/VOP_CLK/CIF_VSYNC/I2C7_SCL_u F30 GPIO2_B1 GPIO2_B1/SPI2_RXD/CIF_HREF/I2C6_SDA_u GPIO2 B2 |
| H24 GPIO2_B2/SPI2_TXD/CIF_CLKIN/I2C6_SCL_u H31 &gt;&gt;CIF_CLKO |
| GPIO2_B3/SPI2_CLK/VOP_DEN/CIF_CLKOUTA_u |
| F31 GPIO2_B4/SPI2_CSn0_u &gt;DVP_PDNO_H |
|  |
| J24 APIO2_VDDPST OAPIO2_VDDPST K23 |
| APIO2_VDD OAPIO2_VDD |


| 14 RW | 0x0 | flash_poc_ctrol flash IO domain poc control selection 0: controled by gpio_0b5 pad 1: controled by bit 2 of IO VSEL |  |
| --- | --- | --- | --- |
| 2 | RW | 0x1 | flash0_v18sel FLASH0 IO domain 1.8V voltage selection 1&#x27;b0: 3.3V/2.5V 1&#x27;b1: 1.8V |

TRM 寄存器描述：  

硬件原理图：



### 4.3 通过 DTS 配置

以上两步做完后，得到了配置的名称和供电源头，在 DTS 里面找到对应的 regulator: vcc1v8\_dvp，就可以在 rk3399-evb.dtsi 配置上 “bt656-supply = &lt;&vcc1v8\_dvp&gt;;”，其他的电源域配置类似。

## 5. 通过硬件 Pin 脚控制的电源域一般不做配置

例如，RK3368 Soc 的 TRM 和 RK3368-evb 的硬件原理图上有下面寄存器的描述和硬件上 Pin 脚的配置。



FLASH Driver IO SEL  



## 6. DTS 中无定义 Regulator 情况处理

下面是 rk3229-evb.dts 的配置例子，确定硬件上的电压是用 1.8v 还是 3.3v，配置成相应的 regulator：

```
1 regulators {
2 compatible = "simple-bus";
3 #address-cells = <1>;
4 #size-cells = <0>;
```

5   

```
6 vccio_1v8_reg: regulator@0 {
7 compatible = "regulator-fixed";
8 regulator-name = "vccio_1v8";
9 regulator-min-microvolt = <1800000>;
10 regulator-max-microvolt = <1800000>;
11 regulator-always-on;
12 };
```

13   

```
14 vccio_3v3_reg: regulator@1 {
15 compatible = "regulator-fixed";
16 regulator-name = "vccio_3v3";
17 regulator-min-microvolt = <3300000>;
18 regulator-max-microvolt = <3300000>;
19 regulator-always-on;
20 };
21 };
```

22   

```
23 &io_domains {
24 status = "okay";
```

25   

26 vccio1-supply = &lt;&vccio\_3v3\_reg&gt;;   

27 vccio2-supply = &lt;&vccio\_1v8\_reg&gt;;   

28 vccio4-supply = &lt;&vccio\_3v3\_reg&gt;;   

```
29 };
```

30

## 7. 常见问题

## 7.1如何确定某个 Pin 脚所在的电源域寄存器是否配置正确

经常遇到客户报的问题是某 pin 脚的电压与所期望的不符，很有可能就是电源域配置问题。例如，在RK3399 上，软件上代码已经让 GPIO2\_B1 输出高，但是实际通过量测发现电压不对；通过读取寄存器已经确认该 pin 脚已经将 iomux 配置成 gpio，并且也设置成输出高，这就很有可能是 io-domain 没有配置正确。那么这时候就要确认电源域寄存器是否配置正确，方法就是上面介绍的如何配置电源域的相反步骤。


| RK3399-Socket G31 GPIO2_A0/VOP_D0/CIF_D0/I2C2_SDA_u H25 |
| --- |
| &gt;CIF_D0 |
| GPIO2_A1/VOP_D1/CIF_D1/I2C2_SCL_u CIF_D1 H30 CIF_D2 |
| GPIO2_A2/VOP_D2/CIF_D2_d F28 CIF_D3 |
| GPIO2_A3/VOP_D3/CIF_D3_d H29 |
| GPIO2_A4/VOP_D4/CIF_D4_d CIF_D4 F29 CIF_D5 |
| GPIO2_A5/VOP_D5/CIF_D5_d H27 |
| GPIO2_A6/VOP_D6/CIF_D6_d CIF_D6 G30 |
| GPIO2_A7/VOP_D7/CIF_D7/I2C7_SDA_u CIF_D7 |
| H28 &gt;&gt;CIF_VSYNC |
| GPIO2_B0/VOP_CLK/CIF_VSYNC/I2C7_SCL_u F30 GPIO2 B1 GPIO2_B1/SPI2_RXD/CIF_HREF/I2C6_SDA_u H24 GPIO2 B2 |
| GPIO2_B2/SPI2_TXD/CIF_CLKIN/I2C6_SCL_u H31 |
| GPIO2_B3/SPI2_CLK/VOP_DEN/CIF_CLKOUTA_u |
| &gt;&gt;CIF_CLKO F31 GPIO2_B4/SPI2_CSn0_u S&gt;DVP_PDN0_H |
| J24 |
| APIO2_VDDPST OAPIO2_VDDPST K23 |
| APIO2_VDD OAPIO2_VDD |
|  |



通过 rockchip-io-domain.txt 文档找到对应的名称。例如，在 rockchip-io-domain.txt 文档上找到的电源域对应的名称是 “bt656”。

Possible supplies for rk3368 pmu-domains: pmu-supply: The supply connected to PMUI0\_VDD. vop-supply: The supply connected to LCDC\_VDD.

Possible supplies for rk3399: bt656-supply: The supply connected toAPI02 VDD audio-supply: The supply connected to API05\_VDD. sdmmc-supply: The supply connected to SDMMCē\_VDD gpio1830 The supply connected to API04\_VDD.

在 TRM 上找到这个寄存器，通过 io 命令或者其他方式读取这个寄存器的值，一般基地址是 GRF或者 PMUGRF。例如，在 TRM 文档上搜索到 “bt656” 寄存器描述，为 bit0，查看寄存器偏移为0xe640，GRF 基地址为 0xff770000。在串口终端输入 “io -4 0xff77e640”，得到 io-domain 寄存器值，如果该寄存器值 bit0 为 1，表示 1.8v， 与硬件实际电压 VCC1V8\_DVP，dts 中该项配置正确；如果 bit0 为 0，则表示 3.3v，与硬件实际电压 VCC1V8\_DVP 不符，dts 中该项配置不正确。


| 3 | RW | 0x0 | gpio1833_gpio4cd_ms |
| --- | --- | --- | --- |
| 2 | RW | 0x0 | sdmmc_gpio4b_ms |
| 1 | RW | 0x0 | audio_gpio3d4a_ms |
| 0 | RW | 0x0 | bt656_gpio2ab_ms |

### 7.2 io-domain 的寄存器不正确

常见的寄存器错误，可能是以下几个问题

所配置的 regulator 电压不对；

未配置 Regulator 或 Regulator 未使能；

Regulator 比 io-domain 驱动加载更慢，获取 regulator 失败。
