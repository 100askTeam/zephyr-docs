---
sidebar_position: 1
---

# RK3576 系统待机配置指南

## 前言

## 概述

本文档用于指导用户如何根据产品需求，配置 RK3576 系统待机模式。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3576 | 6.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 黄小东 | 2022-05-08 | 初始版本 |

## 1. 系统待机

凡是带有 bl31 的 SoC 平台，系统待机（system suspend）的工作都在 bl31 中完成。因为各个平台的 bl31对于系统待机实现各不相同，所以不同平台之间的待机配置选项/方法没有任何关联性和参考性<sub>，</sub>本文档仅适用于 RK3576 平台。

系统待机流程一般会有如下操作：关闭 power domain、模块 IP、时钟、PLL、ddr 进入自刷新、系统总线切到低速时钟（24M 或 32K）、vdd\_arm /vdd\_log断电、配置唤醒源等。为了满足不同产品对待机模式的需求，目前都是通过 DTS 节点把相关配置在开机阶段传递给 bl31 。

### 1.1 驱动文件

./drivers/soc/rockchip/rockchip\_pm\_config.c   

./drivers/firmware/rockchip\_sip.c   

./include/dt-bindings/suspend/rockchip-rk3576.h

### 1.2 DTS 节点

```lisp
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
// 休眠log开关配置，0：关闭打印， 1：打开打印
rockchip,sleep-debug-en = <1>;
// 常规配置
rockchip,sleep-mode-config = <
(0
| RKPM_SLP_ARMOFF_LOGOFF
| RKPM_SLP_PMU_PMUALIVE_32K
| RKPM_SLP_PMU_DIS_OSC
| RKPM_SLP_PMIC_LP
| RKPM_SLP_32K_EXT
)
>;
// 唤醒源配置
rockchip,wakeup-config = <
(0
| RKPM_GPIO_WKUP_EN
)
>;
// io retention功能配置
rockchip,sleep-io-ret-config = <
(0)
>;
// sleep pin配置
rockchip,sleep-pin-config = <
(0
| RKPM_SLEEP_PIN0_EN
)
```

```lisp
(0)
>;
};
```

## 2. DTS 配置

目前已支持的配置选项都定义在：

./include/dt-bindings/suspend/rockchip-rk3576.h

### 2.1 常规配置

属性

```javascript
rockchip,sleep-mode-config = <...>;
```

### 配置项

```c
// 断电vdd_arm，且DDR控制器断电，需要硬件电路设计上能支持
#define RKPM_SLP_ARMOFF_DDRPD BIT(2)
// 断电vdd_arm和vdd_log，需要硬件电路设计上能支持
#define RKPM_SLP_ARMOFF_LOGOFF BIT(3)
// 断电vdd_arm和vdd_log，且PMU1电源域断电，需要硬件电路设计上能支持
#define RKPM_SLP_ARMOFF_PMUOFF BIT(4)
// 休眠时使用32K时钟源作为系统时钟
#define RKPM_SLP_PMU_PMUALIVE_32K BIT(9)
// 关闭24M晶振，最低功耗模式时可使能，需要配合RKPM_SLP_PMU_PMUALIVE_32K使用
#define RKPM_SLP_PMU_DIS_OSC BIT(10)
// 休眠时的32K时钟源是否选用外部的32K钟源，不配该选项则默认选用内部32K时钟源，需要配合
RKPM_SLP_PMU_PMUALIVE_32K使用
#define RKPM_SLP_32K_EXT BIT(24)
// 休眠定时唤醒功能，用于测试使用
#define RKPM_SLP_TIME_OUT_WKUP BIT(25)
// 休眠时输出pmu状态机波形，用于debug使用
#define RKPM_SLP_PMU_DBG BIT(26)
```

### 注意事项

需要根据具体产品对唤醒源的需求进行相关配置，比如usb唤醒，那休眠时就不能将usb的电源和时钟关闭，所以不能配置RKPM\_SLP\_ARMOFF\_LOGOFF、RKPM\_SLP\_PMU\_DIS\_OSC、RKPM\_SLP\_PMU\_PMUALIVE\_32K等选项。

RKPM\_SLP\_PMU\_DBG：使能该配置后，待机时 PMU 状态机会通过 GPIO0\_B0 一直输出特定波形信号，用于反馈当前 PMU 状态机内部状态，该功能仅用于休眠唤醒测试和debug。

RKPM\_SLP\_TIME\_OUT\_WKUP：使能该配置后，待机后1s左右会自动唤醒，且只有pmu内部timer才能唤醒系统，该配置只用于休眠唤醒测试和debug。

### 2.2 唤醒配置

属性

rockchip,wakeup-config = &lt;...&gt;;

### 配置项

```c
// 支持所有的中断唤醒（经过GIC管理的休眠可唤醒中断），一般由cpu0运行休眠流程，需要时只配
RKPM_CPU0_WKUP_EN即可
#define RKPM_CPU0_WKUP_EN BIT(0)
#define RKPM_CPU1_WKUP_EN BIT(1)
#define RKPM_CPU2_WKUP_EN BIT(2)
#define RKPM_CPU3_WKUP_EN BIT(3)
#define RKPM_CPU4_WKUP_EN BIT(4)
#define RKPM_CPU5_WKUP_EN BIT(5)
#define RKPM_CPU6_WKUP_EN BIT(6)
#define RKPM_CPU7_WKUP_EN BIT(7)
// GPIO0唤醒
#define RKPM_GPIO_WKUP_EN BIT(8)
// SDMMC唤醒
#define RKPM_SDMMC_WKUP_EN BIT(9)
// SDIO唤醒
#define RKPM_SDIO_WKUP_EN BIT(10)
// USB DEV唤醒
#define RKPM_USB_WKUP_EN BIT(11)
// UART1唤醒
#define RKPM_UART_WKUP_EN BIT(12)
// MCU唤醒
#define RKPM_MCU_WKUP_EN BIT(13)
// PMU TIMER唤醒
#define RKPM_TIMER_WKUP_EN BIT(14)
// 支持所有的中断唤醒（不经过GIC管理），不推荐使用
#define RKPM_SYSINT_WKUP_EN BIT(15)
// pwm唤醒，一般用于红外唤醒使用
#define RKPM_PWM_WKUP_EN BIT(16)
// tsadc唤醒
#define RKPM_TSADC_WKUP_EN BIT(17)
// hptimer唤醒
#define RKPM_HPTIMER_WKUP_EN BIT(18)
// saradc唤醒
#define RKPM_SARADC_WKUP_EN BIT(19)
// PMU内部timer唤醒（默认1s），用于测试和debug
#define RKPM_TIMEOUT_WKUP_EN BIT(20)
```

### 注意事项

RKPM\_GPIO\_WKUP\_EN（首选）：

GPIO0\~4 中仅支持 GPIO0 这组 pin 脚作为唤醒源，该模式下 GPIO0 上的 pin 脚中断信号被直接送往 PMU 状态机，不经过 GIC。在硬件设计上，建议用户把需要的唤醒源尽量都放到 GPIO0 这组pin 脚上。

RKPM\_CPU0\_WKUP\_EN（次选）：

支持所有在 kernel 阶段用 enable\_irq\_wake()注册到 GIC 的可唤醒中断，适用的唤醒中断源数量比RKPM\_GPIO\_WKUP\_EN更多。但这种方式相当于把唤醒源的管理权分散交给了 kernel 各个模块，待机时系统有可能被不期望的中断唤醒。

RKPM\_TIMEOUT\_WAKEUP\_EN：

PMU 内部的 timer 唤醒，默认 1s 超时产生中断，一般仅用于开发阶段测试休眠唤醒使用。

### 2.3 io retention 配置

在vdd\_logic断电的休眠场景下，用户如果仍想维持某个io的电平，则可以配置该属性。

### 属性

rockchip,sleep-io-ret-config = &lt;   

(0   

| RKPM\_VCCIO0\_RET\_EN   

...   

)   

&gt;;

### 配置项

```c
// 支持配置以下九个io域
#define RKPM_VCCIO0_RET_EN BIT(0)
#define RKPM_VCCIO1_RET_EN BIT(1)
#define RKPM_VCCIO2_RET_EN BIT(2)
#define RKPM_VCCIO3_RET_EN BIT(3)
#define RKPM_VCCIO4_RET_EN BIT(4)
#define RKPM_VCCIO5_RET_EN BIT(5)
#define RKPM_VCCIO6_RET_EN BIT(6)
#define RKPM_VCCIO7_RET_EN BIT(7)
#define RKPM_PMUIO1_RET_EN BIT(8)
```

### 注意事项：

用户想要维持某个io的电平时，要配置上这个io所在的io域，且该io域的电源不能断电，否则无法维持电平。

### 2.4 sleep pin 配置

sleep pin用于休眠时关闭电源，用户需根据实际的硬件设计进行相应配置。

属性

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

...   

)   

(0   

| RKPM\_SLEEP\_PIN0\_ACT\_LOW   

)   

&gt;;

### 配置项

```c
// 支持以下三个sleep pin
#define RKPM_SLEEP_PIN0_EN BIT(0) /* GPIO0_A3 */
#define RKPM_SLEEP_PIN1_EN BIT(1) /* GPIO0_A4 */
#define RKPM_SLEEP_PIN2_EN BIT(2) /* GPIO0_A5 */
// 如果是拉低sleep pin来关闭电源，则配置下面对应项，默认拉高sleep pin
#define RKPM_SLEEP_PIN0_ACT_LOW BIT(0) /* GPIO0_A3 */
#define RKPM_SLEEP_PIN1_ACT_LOW BIT(1) /* GPIO0_A4 */
#define RKPM_SLEEP_PIN2_ACT_LOW BIT(2) /* GPIO0_A5 */
```

### 注意事项

rk3576默认配置是拉高sleep pin0。

### 2.5 假关机配置

有些产品关机时无法断电，需要使用休眠场景来代替关机场景以降低功耗

### 属性

```
// 0：关闭假关机模式， 1：开启假关机模式。
rockchip,virtual-poweroff = <...>;
// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

### 注意事项

如果不配置rockchip,virtual-poweroff-irqs，默认会把pwm0 channel0作为唤醒源。

## 3. 打印信息

如下简要介绍系统待机和唤醒时的 bl31 打印信息含义。为注释方便，如下对一些打印内容进行分行，不同的待机功耗模式同样也会带来不同的打印，所有打印信息内容以实际显示为主。

属性

```
// 0：休眠时不会打印log， 1：休眠时会打印log
rockchip,sleep-debug-en = <...>;
```

### RK3576 系统待机打印

```
// 休眠所用bl31版本及commit信息
INFO: BL31: v2.3():v2.3-775-gacfcb4fbd:derrick.huang, fwver: v1.05
// 休眠模式配置及休眠次数打印
INFO: enter: cfg=0x1020608, sleeptimes:
// 休眠模式打印
```

INFO: deep  

INFO: armoff\_logoff  

INFO: pmu\_pmualive\_32k  

INFO: pmu\_dis\_osc  

INFO: pmic\_low\_power  

INFO: 32k ext  

INFO: io\_ret (0x8)  

INFO: sleep\_pin: 0x1 0x0  

INFO: GPIO POWER INFO:  

INFO: not config  

// 休眠gpio中断配置状态打印

INFO: GPIO0\_INTEN: 0xffff 0xffff 0xfd9e 0xffff 0x0 0xd408611e  

INFO: GPIO1\_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xef03f600  

INFO: GPIO2\_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0x9fdb0c20  

INFO: GPIO3\_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xaf8c3ec4  

INFO: GPIO4\_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xfe92c7d7  

// 休眠系统中断状态打印

INFO: IRQ\_EN: 77  

INFO: IRQ\_EN: 108  

INFO: IRQ\_EN: 135  

INFO: IRQ\_EN: 132  

INFO: IRQ\_EN: 189  

INFO: IRQ\_EN: 185  

INFO: IRQ\_EN: 201  

INFO: IRQ\_EN: 197  

INFO: IRQ\_EN: 193  

INFO: IRQ\_EN: 312  

INFO: IRQ\_PED: 268  

// 休眠关键寄存器信息打印

INFO: PMU1\_PWR\_CON(0x2101) PMU1\_CRU\_PWR\_CON(0x22f) PMU1\_WAKEUP\_INT\_CON(0x100)  

PMU2\_BUS\_IDLE\_ST(0x7ffff) PMU2\_PWR\_GATE\_ST(0x3ffffc1)  

PMU2\_BUS\_IDLE\_CON(0x0 0x3ff8)  

PMU2\_PWR\_GATE\_CON(0x3e 0x0)  

PMU2\_VOL\_GATE\_CON(0x31 0x200)  

PMU1\_DDR\_PWR\_CON(0x2b 0x2b)  

PMU1\_PLLPD\_CON(0xfff)  

INFO: PMU0\_PWR\_CON(0x0) PMU0\_WAKEUP\_INT\_CON(0x0)  

PMU0\_DDR\_RET\_CON(0x0 0x0) PMU0\_GRF\_OS\_REGS17(0xe707d445)  

PMU0GRF\_SOC\_CON5(0x64)

// 唤醒流程步骤打印

012abcdef3456789   

987654fedcba3210   

// 唤醒源

INFO: wake up status: 0x100   

INFO: GPIO0 interrupt wakeup: 0x40   

// gpio唤醒的话会打印出具体的gpio

INFO: gpio0\_a6

## 4. 典型配置案例

### 4.1 logic断电模式

该模式可以支持vdd\_logic断电，降低休眠功耗。

配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <1>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_LOGOFF   

| RKPM\_SLP\_PMU\_PMUALIVE\_32K   

| RKPM\_SLP\_PMU\_DIS\_OSC   

| RKPM\_SLP\_PMIC\_LP   

| RKPM\_SLP\_32K\_EXT   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0   

| RKPM\_GPIO\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;   

```
};
```

### 4.2 pmu1断电模式

该模式在logic断电基础上关掉pd pmu1，且支持关掉PMUIO1电源，功耗比logic断电模式低。配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <1>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_PMUOFF   

| RKPM\_SLP\_PMU\_PMUALIVE\_32K   

| RKPM\_SLP\_PMU\_DIS\_OSC   

| RKPM\_SLP\_PMIC\_LP   

| RKPM\_SLP\_32K\_EXT   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0   

| RKPM\_GPIO\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;   

```
};
```

### 4.3 uart1唤醒

如果产品有uart唤醒需求，则应尽量选择uart1。因为uart1在pd\_pmu1中，可以在logic断电的情况下支持uart1唤醒，这样功耗更低。

配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <1>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_LOGOFF   

| RKPM\_SLP\_PMIC\_LP   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0

| RKPM\_GPIO\_WKUP\_EN   

| RKPM\_UART\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;   

```
};
```

### 注意事项

uart1唤醒需要24M晶振保持工作，所以24M晶振电源不能关闭。

### 4.4 usb唤醒

如果产品有usb唤醒需求，则应尽量让usb的0.75V、1.8V、3.3V与pmu的电源合并供电。这样可以在logic断电的情况下支持usb唤醒，这样功耗更低。

### 配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <1>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_LOGOFF   

| RKPM\_SLP\_PMIC\_LP   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0   

| RKPM\_GPIO\_WKUP\_EN   

| RKPM\_USB\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;   

```
};
```

### 注意事项

usb唤醒需要24M晶振保持工作，所以24M晶振电源不能关闭。

### 4.5 pwm唤醒

如果产品有红外唤醒需求，则需要使用pwm唤醒，应尽量把红外接到pwm0 channel0。因为pwm0在pd\_pmu1中，可以在logic断电的情况下支持pwm唤醒，这样功耗更低。

### 配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <1>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_LOGOFF   

| RKPM\_SLP\_PMIC\_LP   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0   

| RKPM\_GPIO\_WKUP\_EN   

| RKPM\_PWM\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;   

```
};
```

### 注意事项

pwm唤醒需要24M晶振保持工作，所以24M晶振电源不能关闭。

### 4.6 mcu唤醒

如果产品需要pmu mcu在休眠时进行一些工作（比如中断过滤等），则需要使用mcu唤醒。

### 配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <1>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_DDRPD

| RKPM\_SLP\_PMIC\_LP   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0   

| RKPM\_GPIO\_WKUP\_EN   

| RKPM\_MCU\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;   

```
};
```

### 注意事项

mcu唤醒需要24M晶振保持工作，所以24M晶振电源不能关闭。

mcu唤醒不能关闭vdd\_logic。

### 4.7 gpio唤醒

如果产品有gpio0的唤醒需求，因为gpio0在pd\_pmu中，则使用logic断电模式的配置即可。

如果是gpio1\~4的唤醒，则vdd\_logic不能断电，配置如下

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-config";
status = "okay";
rockchip,sleep-debug-en = <0>;
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMOFF\_DDRPD   

| RKPM\_SLP\_PMIC\_LP   

)   

&gt;;   

rockchip,wakeup-config = &lt;   

(0   

| RKPM\_GPIO\_WKUP\_EN   

| RKPM\_CPU0\_WKUP\_EN   

)   

&gt;;   

rockchip,sleep-io-ret-config = &lt;   

(0)   

&gt;;   

rockchip,sleep-pin-config = &lt;   

(0   

| RKPM\_SLEEP\_PIN0\_EN   

)   

(0)   

&gt;;

### 注意事项

gpio1\~4唤醒需要24M晶振保持工作，所以24M晶振电源不能关闭
