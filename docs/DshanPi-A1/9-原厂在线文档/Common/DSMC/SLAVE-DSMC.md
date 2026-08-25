---
sidebar_position: 1
---

# Rockchip SLAVE DSMC 开发文档

## 前言

## 概述

本文为ROCKHIP SLAVE\_DSMC模块的kernel开发提供说明和使用方法。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3506 | kernel 6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 何智欢 | 2024-09-10 | 初始版本 |

## 1. 概述

Slave Double Data Rate Serial Memory Controller（SLAVE DSMC）作为DSMC的slave，仅支持Local bus协议，且需配合使用RK 开发的DSMC host 控制器，或者传输协议相同。如2块RK3506 EVB对接，一块EVB做DSMC host，一块EVB做DSMC local bus的slave。如下图连接方式：



## 2. SLAVE DSMC 驱动

### 2.1 驱动文件

SALVE DSMC 的驱动文件位置如下：

drivers/memory/rockchip/dsmc-lb-slave.c /\* DSMC local bus slave 驱动程序 \*/

### 2.2 DTS节点配置

```c
&dsmc_lb_slave {
memory-region = <&dsmc_lb_slave_mem>; /* dsmc local bus slave的内存空间 */
status = "okay"; /* 开启dsmc local bus slave */
};
&reserved_memory {
/*
* dsmc local bus slave的内存空间，一般占用DDR一段连续的空间
*/
```

```javascript
dsmc_lb_slave_mem: dsmc-lb-slave-mem@6000000 {
compatible = "rockchip,dsmc-lb-slave-mem";
reg = <0x6000000 0x2000000>;/* 定义dsmc local bus slave的起始地址，空间大小
*/
};
};
```

DSMC local bus slave定义的内存空间，在默认情况下作为DSMC host的Merged FIFO 空间使用。所以DSMC local bus slave的内存空间范围需要与DSMC host端属性 rockchip,ranges 配置一致 。

### 2.3 内核配置

Symbol: ROCKCHIP\_DSMC\_SLAVE [=y]   

│   

│ Type : tristate   

│   

Prompt: Rockchip Double Data Rate Serial Memory Controller(DSMC) slave   

driver   

│   

Depends on: MEMORY [=y] && ARCH\_ROCKCHIP   

│   

Location:   

│   

-&gt; Device Drivers   

│   

-&gt; Memory Controller drivers (MEMORY [=y])   

│   

-&gt; Rockchip Double Data Rate Serial Memory Controller(DSMC) slave   

driver (ROCKCHIP\_DSMC\_SLAVE [=y])   

│

### 2.4 中断

DSMC slave的驱动注册了一个中断服务程序，当DSMC host通过写入DSMC slave的LBC\_CONx寄存器，将触发SLAVE\_DSMC中断（host2slave中断），DSMC slave端CPU收到中断后执行rockchip\_dsmc\_lb\_slave\_irq 中断服务程序，若LBC\_CON15 写入非零值，则通过写入APP\_CON15的方式触发slave2host中断，DSMC host接收后自动发起一定数量的DMA 硬件请求，触发DMA搬移。
