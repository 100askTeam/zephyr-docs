---
sidebar_position: 1
---

# RK3399 系统待机配置指南

## 前言

## 概述

本文档用于指导用户如何根据产品需求，配置 RK3399 系统待机模式。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3399 | 4.4、4.19 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 日期 | 版本 | 作者 | 修改说明 |
| --- | --- | --- | --- |
| 2020-07-08 | V1.0.0 | 许盛飞 | 初始版本 |

RK3399系统待机配置指南  

1. 系统待机  

1.1 驱动文件  

1.2 DTS 节点  

2. DTS 配置  

2.1 常规配置  

2.2 电源配置  

2.3 唤醒配置  

2.4 debug 配置  

2.5 关闭APIO配置  

2.6 GPIO 控制电源  

3. 打印信息

## 1. 系统待机

凡是带有 trust 的 SoC 平台，系统待机（system suspend）的工作都在 trust 中完成。因为各个平台的 trust对于系统待机实现各不相同，所以不同平台之间的待机配置选项/方法没有任何关联性和参考性<sub>，</sub>本文档仅适用于 RK3399 平台。

系统待机流程一般会有如下操作：关闭 power domain、时钟、PLL、ddr 进入自刷新、系统总线切到低速时钟（24M 或 32K）、控制PMIC进入休眠模式、配置唤醒源等。为了满足不同产品对待机模式的需求，目前都是通过 DTS 节点把相关配置在开机阶段传递给 trust。

### 1.1 驱动文件

```scss
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3399.h
```

### 1.2 DTS 节点

```dts
rockchip_suspend: rockchip-suspend {
compatible = "rockchip,pm-rk3399";
status = "okay";
// 常规配置
rockchip,sleep-mode-config = <
```

(0   

| RKPM\_SLP\_ARMPD   

| RKPM\_SLP\_PERILPPD   

| RKPM\_SLP\_DDR\_RET   

| RKPM\_SLP\_CENTER\_PD   

)   

&gt;;   

```
// 唤醒源配置
rockchip,wakeup-config = <
```

(0   

| RKPM\_GPIO\_WKUP\_EN   

)   

&gt;;   

```
// 电源配置
rockchip,pwm-regulator-config = <
```

(0   

| PWM2\_REGULATOR\_EN   

)   

&gt;;   

```
// 对应APIO断电
rockchip,apios-suspend = <
```

(0   

| RKPM\_APIOxxx   

)   

&gt;;

```
// 休眠控制GPIO的电平，关断对应供电
rockchip,power-ctrl =
<&gpioX RK_PXX GPIO_ACTIVE_HIGH>;
};
```

## 2. DTS 配置

目前已支持的配置选项都定义在：

./include/dt-bindings/suspend/rockchip-rk3399.h

### 2.1 常规配置

配置项：

```javascript
rockchip,sleep-mode-config = <...>;
```

配置源：

```c
// 休眠 CPU 处在 WFI 状态，只有调试时用到
#define RKPM_SLP_WFI (1 << 0)
// 休眠 cpu_pd power down
#define RKPM_SLP_ARMPD (1 << 1)
// 休眠perilp_pd power down
#define RKPM_SLP_PERILPPD (1 << 2)
// 休眠 ddr 进入自刷新且处在 retention 状态
#define RKPM_SLP_DDR_RET (1 << 3)
// 休眠 PLL power down
#define RKPM_SLP_PLLPD (1 << 4)
// 休眠 OSC disable，系统时钟切到 32K
#define RKPM_SLP_OSC_DIS (1 << 5)
// 休眠 center_pd power down
#define RKPM_SLP_CENTER_PD (1 << 6)
// 休眠 AP_OFF 会被拉高，用于控制 PMIC 或者其他分立电源进入休眠态
#define RKPM_SLP_AP_PWROFF (1 << 7)
```

### 2.2 电源配置

配置项：

rockchip,pwm-regulator-config = &lt;...&gt;;

配置源：


| // 使用 pwm-regulator |  |  |  |
| --- | --- | --- | --- |
|  | #define PWM0_REGULATOR_EN | (1 &lt;&lt; 0) |  |
|  | #define PWM1_REGULATOR_EN | (1 &lt;&lt; 1) |  |
|  | #define PWM2 REGULATOR EN | (1 &lt;&lt; 2) |  |
|  | #define PWM3A REGULATOR EN | (1 &lt;&lt; 3) |  |
|  | #define PWM3B_REGULATOR_EN | (1 &lt;&lt; 4) |  |

电源注意点：

根据外部硬件电路设计确定是否使用 pwm-regulator，必须与硬件对应。

2. 3唤醒配置

配置项：

rockchip,wakeup-config = &lt;...&gt;;

配置源：

唤醒源注意点：

在 kernel 阶段没有 enable\_irq\_wake()注册到 GIC 的中断无法唤醒系统。

### 2.4 debug 配置

```c
/* APIO 电压域 */
#define RKPM_APIO0_SUSPEND (1 << 0)
#define RKPM_APIO1_SUSPEND (1 << 1)
#define RKPM_APIO2_SUSPEND (1 << 2)
#define RKPM_APIO3_SUSPEND (1 << 3)
#define RKPM_APIO4_SUSPEND (1 << 4)
#define RKPM_APIO5_SUSPEND (1 << 5)
```

配置项：

rockchip,sleep-debug-en = &lt;...&gt;;

debug 注意点：

赋值1则打开debug功能，在休眠唤醒中会打印出ATF中休眠和唤醒的log。

### 2.5 关闭APIO配置

配置项：

```javascript
rockchip,apios-suspend = <...>;
```

配置源：

APIO配置注意点：

RK3399 GPIO所在的APIO分成，APIO1\~APIO5，在硬件电路支持的情况下，APIO休眠可以单独断电。

### 2.6 GPIO 控制电源

配置项：

```html
rockchip,power-ctrl = <...>
```

配置范例：

```
// 休眠将GPIO1_C1拉高，控制外部电源断电
rockchip,power-ctrl = <&gpio1 RK_PC1 GPIO_ACTIVE_HIGH>,
```

## 3. 打印信息

如下简要介绍系统待机和唤醒时的 trust 打印信息含义。为注释方便，如下对一些打印内容进行分行，不同的待机功耗模式同样也会带来不同的打印，所有打印信息内容以实际显示为主。

RK3399 系统待机打印：

```
// 休眠模式

INFO: sleep mode config[0xde]:
```

INFO: AP\_PWROFF  

INFO: SLP\_ARMPD  

INFO: SLP\_PLLPD  

INFO: DDR\_RET  

INFO: SLP\_CENTER\_PD  

```
// 支持的唤醒源
INFO: wakeup source config[0x804]:
```

INFO: GPIO interrupt can wakeup system  

INFO: PWM interrupt can wakeup system  

```
// 休眠需要控制的pwm regulator
INFO: PWM CONFIG[0x4]:
```

INFO: PWM: PWM2D\_REGULATOR\_EN  

```
// 休眠需要控制的APIO
INFO: APIOS info[0x0]:
```

INFO: not config  

// 通过GPIO控制的电源

INFO: GPIO POWER INFO:  

INFO: GPIO1\_C1  

INFO: GPIO1\_B6  

// 休眠模式寄存器的值

INFO: PMU\_MODE\_CONG: 0x1466bf51

### RK3399 系统唤醒打印：

// 唤醒打印

INFO: RK3399 the wake up information:   

INFO: wake up status: 0x4   

INFO: GPIO interrupt wakeup   

INFO: GPIO0: 0x0   

INFO: GPIO1: 0x200000   

INFO: GPIO2: 0x0   

INFO: GPIO3: 0x0   

INFO: GPIO4: 0x0   

// 唤醒源

GPIO interrupt wakeup   

gpio1\_c5中断唤醒系统
