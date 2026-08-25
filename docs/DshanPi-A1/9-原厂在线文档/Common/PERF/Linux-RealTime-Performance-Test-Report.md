---
sidebar_position: 1
---

# Rockchip RealTime Linux Performance Test Report

## 前言

随着产品对实时性能要求的提高，标准Linux的实时性已经满足不了很多产品的需求，需要对标准Linux进行一定的优化，来提高实时性能，比如：PREEMPT\_RT补丁，Xenomai实时系统。

## 概述

本文档提供Rockchip芯片在不同RT Linux实现下的实时性能测试数据。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3568 | kernel-4.19 |
| RK3562 | kernel-5.10 |
| RK3588 | kernel-5.10 |
| RK3576 | kernel-6.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

硬件开发工程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 陈亮 | 2023-08-14 | 初始版本 |
| V1.0.1 | ZhiZhan Chen | 2023-10-07 | 修改RK3568相关说明 |
| V1.0.2 | Caesar Wang | 2024-06-20 | 增加RK3576支持修改一些章节内容 |

## 1. RealTime Linux介绍

标准Linux系统目的是构建一个完整、稳定的开源操作系统，尽量缩短系统的平均响应时间，提高吞吐量，注重操作系统的整体功能需求，达到更好地平均性能，所以标准Linux并不提供硬实时性。

为解决Linux不具有硬实时的问题，诞生了几种基于Linux的硬实时解决方案，分为两类：

直接修改Linux内核源代码：对Linux内核代码进行细微修改并不对内核作大规模的变动，在遵循GPL协议的情况下，直接修改内核源代码将Linux改造成一个完全可抢占的实时系统。其缺点是：通过修改Linux内核，难以保证实时进程的执行不会遭到非实时进程所进行的不可预测活动的干扰。该方法的代表是RT-patch(Real Preemption Patch)。

双内核法：添加一个实时内核，在内核空间与Linux内核并存，把标准的Linux内核作为一个普通进程在实时内核上调度。其优点是可以做到硬实时，并且能很方便地实现一种新的调度策略。常用的双内核法有RT-Linux、RTAI(Real-Time Application Interface)和 Xenomai，双核法具有较好的实时性。

## 2. 实时性能测试

### 2.1 RK3568


| 配置 | 说明 |
| --- | --- |
| CPU | 4xA55,1314 MHz(PVTPLL@0.9V@len=0x43) |
| CACHE | L1-32K，L2-0K，L3-512K |
| DDR | DDR4， 1560M |
| OS | Android-13， kernel-4.19 |
| BL31 | rk3568_bl31_rt_v1.01.elf(optimize RT latency) |

#### 2.1.1 空载测试

##### 2.1.1.1 PREEMPT\_RT Patch

rk3568\_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 1.70 1.98 2.00 1/1142 3765   

T: 0 ( 3920) P:99 I:1000 C:1569551 Min: 8 Act: 11 Avg: 13 Max: 75   

T: 1 ( 3921) P:99 I:1500 C:1046353 Min: 9 Act: 13 Avg: 13 Max: 69   

T: 2 ( 3922) P:99 I:2000 C: 784755 Min: 9 Act: 11 Avg: 14 Max: 81   

T: 3 ( 3923) P:99 I:2500 C: 627795 Min: 9 Act: 12 Avg: 13 Max: 98   

（测试1小时）

##### 2.1.1.2 Xenomai Cobalt Mode

rk3568\_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 0.29 0.18 0.12 1/1107 4216   

T: 0 ( 4021) P:99 I:1000 C:12501264 Min: 1 Act: 8 Avg: 7 Max: 68   

T: 1 ( 4022) P:99 I:1500 C:8334176 Min: 2 Act: 8 Avg: 7 Max: 70   

T: 2 ( 4023) P:99 I:2000 C:6250631 Min: 2 Act: 9 Avg: 8 Max: 66   

T: 3 ( 4024) P:99 I:2500 C:5000505 Min: 2 Act: 6 Avg: 7 Max: 58   

（测试3小时）

#### 2.1.2 压力测试1

```batch
stress-ng -c 4 --io 2 --vm 1 --vm-bytes 4M --timeout 1000000s
```

##### 2.1.2.1 PREEMPT\_RT Patch

rk3568\_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 9.36 9.67 9.84 8/1152 3678   

T: 0 ( 3482) P:99 I:1000 C:5892687 Min: 9 Act: 20 Avg: 25 Max: 123   

T: 1 ( 3483) P:99 I:1500 C:3928444 Min: 9 Act: 20 Avg: 25 Max: 116   

T: 2 ( 3484) P:99 I:2000 C:2946323 Min: 9 Act: 13 Avg: 26 Max: 120   

T: 3 ( 3485) P:99 I:2500 C:2357050 Min: 10 Act: 20 Avg: 26 Max: 126   

（测试2小时）

##### 2.1.2.2 Xenomai Cobalt Mode

rk3568\_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 7.65 7.80 7.75 8/1118 3998   

T: 0 ( 3492) P:99 I:1000 C:21069118 Min: 2 Act: 4 Avg: 13 Max:   

T: 1 ( 3493) P:99 I:1500 C:14046070 Min: 2 Act: 13 Avg: 15 Max:   

T: 2 ( 3494) P:99 I:2000 C:10534550 Min: 2 Act: 6 Avg: 16 Max:   

T: 3 ( 3495) P:99 I:2500 C:8427637 Min: 2 Act: 15 Avg: 15 Max:   

（测试5小时）

#### 2.1.3 压力测试2

```shell
stress-ng -c 4 --io 2 --vm 1 --vm-bytes 4M --timeout 1000000s + 捕鱼达人
```

##### 2.1.3.1 PREEMPT\_RT Patch

rk3568\_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 11.92 12.59 12.59 9/1196 3372   

T: 0 ( 1796) P:99 I:1000 C:52099573 Min: 9 Act: 34 Avg: 30 Max: 176   

T: 1 ( 1797) P:99 I:1500 C:34733036 Min: 9 Act: 41 Avg: 32 Max: 165   

T: 2 ( 1798) P:99 I:2000 C:26049766 Min: 10 Act: 55 Avg: 32 Max: 171   

T: 3 ( 1799) P:99 I:2500 C:20839804 Min: 10 Act: 26 Avg: 31 Max: 156   

（测试12小时）

##### 2.1.3.2 Xenomai Cobalt Mode

rk3568\_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 10.21 10.06 9.99 10/1193 3177   

T: 0 ( 2062) P:99 I:1000 C:41956558 Min: 2 Act: 34 Avg: 20 Max: 112   

T: 1 ( 2063) P:99 I:1500 C:27971036 Min: 2 Act: 29 Avg: 20 Max: 128   

T: 2 ( 2064) P:99 I:2000 C:20978270 Min: 2 Act: 30 Avg: 18 Max: 82   

T: 3 ( 2065) P:99 I:2500 C:16782616 Min: 2 Act: 28 Avg: 18 Max: 105   

（测试12小时）

### 2.2 RK3562


| 配置 | 说明 |
| --- | --- |
| CPU | 4xA53,2016MHz |
| CACHE | L1-32K,L2-512K |
| DDR | LP4X,1320M |
| OS | BUILDROOT,kernel-5.10 |

#### 2.2.1 空载测试

##### 2.2.1.1 PREEMPT\_RT Patch

root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 1.00 1.26 1.31 1/202 1344   

T: 0 ( 1152) P:99 I:1000 C:51905271 Min: 4 Act: 6 Avg: 6 Max: 46   

T: 1 ( 1153) P:99 I:1500 C:34603508 Min: 4 Act: 6 Avg: 6 Max: 55   

T: 2 ( 1154) P:99 I:2000 C:25952627 Min: 4 Act: 6 Avg: 6 Max: 28   

T: 3 ( 1155) P:99 I:2500 C:20762098 Min: 4 Act: 6 Avg: 6 Max: 55   

（测试14小时）

##### 2.2.1.2 Xenomai Cobalt Mode

root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 0.02 0.02 0.00 1/152 2459   

T: 0 ( 2377) P:99 I:1000 C:14773911 Min: 2 Act: 4 Avg: 4 Max: 31   

T: 1 ( 2378) P:99 I:1500 C:9849274 Min: 2 Act: 4 Avg: 4 Max: 28   

T: 2 ( 2379) P:99 I:2000 C:7386955 Min: 2 Act: 4 Avg: 4 Max: 18   

T: 3 ( 2380) P:99 I:2500 C:5909564 Min: 2 Act: 4 Avg: 4 Max: 32   

（测试4小时）

#### 2.2.2 压力测试

```batch
stress -c 4 --io 2 --vm 1 --vm-bytes 256M --timeout 1000000s
```

##### 2.2.2.1 PREEMPT\_RT Patch

root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 9.42 8.33 8.61 9/220 1477   

T: 0 ( 1472) P:99 I:1000 C:7971377 Min: 4 Act: 8 Avg: 10 Max: 69   

T: 1 ( 1473) P:99 I:1500 C:5314247 Min: 5 Act: 16 Avg: 12 Max: 72   

T: 2 ( 1474) P:99 I:2000 C:3985679 Min: 5 Act: 10 Avg: 10 Max: 63   

T: 3 ( 1475) P:99 I:2500 C:3188543 Min: 5 Act: 12 Avg: 12 Max: 76   

（测试2小时）

##### 2.2.2.2 Xenomai Cobalt Mode

root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 7.93 7.92 7.92 9/165 2370   

T: 0 ( 2266) P:99 I:1000 C:6493284 Min: 2 Act: 11 Avg: 9 Max: 69   

T: 1 ( 2267) P:99 I:1500 C:4328849 Min: 2 Act: 12 Avg: 10 Max: 72   

T: 2 ( 2268) P:99 I:2000 C:3246637 Min: 2 Act: 11 Avg: 9 Max: 40   

T: 3 ( 2269) P:99 I:2500 C:2597305 Min: 2 Act: 13 Avg: 9 Max: 73   

（测试2小时）

### 2.3 RK3588


| 配置 | 说明 |
| --- | --- |
| CPU | 4xA76(big),2.2GHz,4xA55(little),1.8GHz |
| CACHE | A76:L1-64K,L2-512KA55:L1-32K,L2-128K |
| DDR | LP4X,2112M |
| OS | BUILDROOT,kernel-5.10 |

#### 2.3.1 空载测试

##### 2.3.1.1 PREEMPT\_RT Patch

root@rk3588:/# cyclictest -c 0 -m -t 8 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 2.71 3.24 3.29 1/322 3955   

T: 0 3406) P:99 I:1000 C:6766462 Min: 3 Act: 4 Avg: 4 Max: 11   

T: 1 ( 3407) P:99 I:1500 C:4510976 Min: 4 Act: 4 Avg: 4 Max: 13   

T: 2 3408) P:99 I:2000 C:3383228 Min: 4 Act: 4 Avg: 4 Max: 13   

T: 3 ( 3409) P:99 I:2500 C:2706579 Min: 4 Act: 4 Avg: 4 Max: 13   

T: 4 ( 3410) P:99 I:3000 C:2255481 Min: 1 Act: 1 Avg: 1 Max: 8   

T: 5 ( 3411) P:99 I:3500 C:1933267 Min: 1 Act: 1 Avg: 1 Max: 7   

T: 6 ( 3412) P:99 I:4000 C:1691609 Min: 1 Act: 1 Avg: 1 Max: 8   

T: 7 ( 3413) P:99 I:4500 C:1503652 Min: 1 Act: 1 Avg: 1 Max: 8   

（测试2小时）

##### 2.3.1.2 Xenomai Cobalt Mode

root@rk3588:/# cyclictest -c 0 -m -n -t 8 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 0.63 0.60 0.55 1/206 1336   

T: 0 1163) P:99 I:1000 C:43237018 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 1 1164) P:99 I:1500 C:28824678 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 2 ( 1165) P:99 I:2000 C:21618508 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 3 ( 1166) P:99 I:2500 C:17294807 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 4 ( 1167) P:99 I:3000 C:14412339 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 5 ( 1168) P:99 I:3500 C:12353433 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 6 ( 1169) P:99 I:4000 C:10809254 Min: 1 Act: 2 Avg: 2 Max: 6   

T: 7 ( 1170) P:99 I:4500 C:9608226 Min: 1 Act: 2 Avg: 2 Max: 6   

（测试12小时）

#### 2.3.2 压力测试

stress-ng -c 8 --io 2 --vm 1 --vm-bytes 1024M --timeout 1000000s

##### 2.3.2.1 PREEMPT\_RT Patch


| # |  |  | root@rk3588:/# cyclictest -c 0 -m -t 8 -p 99 /dev/cpu_dma_latency set to 0us |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  | policy: fifo: loadavg: 15.20 15.28 15.29 11/345 10678 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | T: 0（ |  | 6379) | P:99 I:1000 |  |  | C:6473077 Min: |  |  |  | 3 Act: | 13 Avg: |  | 7 Max: | 28 |  |  |  |
|  |  | T: 1 ( 6380) | P:99 |  | I:1500 |  | C:4315388 Min: |  |  |  | 4 Act: |  | 7 Avg: |  | 7 Max: | 24 |  |  |
|  |  | T: 2 ( 6381) |  |  | P:99 I:2000 | C:3236536 Min: |  |  |  |  | 3 Act: |  | 4 Avg: |  | 6 Max: | 24 |  |  |
|  |  |  | T: 3 ( 6382) P:99 I:2500 |  |  | C:2589231 Min: |  |  |  |  | 4 Act: |  | 8 Avg: |  | 7 Max: | 30 |  |  |
|  |  |  | T: 4 ( 6383) P:99 I:3000 |  |  | C:2157683 Min: |  |  |  |  | 1 Act: |  | 1 Avg: |  | 2 Max: | 16 |  |  |
|  |  |  | T: 5 ( 6384) P:99 I:3500 |  |  | C:1849443 Min: |  |  |  |  | 1 Act: |  | 2 Avg: |  | 2 Max: | 15 |  |  |
|  |  |  |  |  | T: 6 ( 6385) P:99 I:4000 | C:1618261 Min: |  |  |  |  | 1 Act: |  | 2 Avg: |  | 2 Max: | 16 |  |  |
|  |  |  |  |  |  |  |  |  |  |  | 1 Act: |  | 2 Avg: |  | 2 Max: | 15 |  |  |
| T: 7 ( 6386) P:99 I:4500 C:1438455 Min: |  | (测试2小时) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

##### 2.3.2.2 Xenomai Cobalt Mode

root@rk3588:/# cyclictest -c 0 -m -n -t 8 -p 99   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 12.82 12.81 12.81 11/225 1490   

T: 0 ( 1179) P:99 I:1000 C:12797171 Min: 1 Act: 4 Avg: 4 Max: 19   

T: 1 ( 1180) P:99 I:1500 C:8531447 Min: 1 Act: 4 Avg: 3 Max: 16   

T: 2 ( 1181) P:99 I:2000 C:6398585 Min: 1 Act: 4 Avg: 4 Max: 25   

T: 3 ( 1182) P:99 I:2500 C:5118868 Min: 1 Act: 3 Avg: 5 Max: 28   

T: 4 ( 1183) P:99 I:3000 C:4265723 Min: 1 Act: 5 Avg: 4 Max: 17   

T: 5 ( 1184) P:99 I:3500 C:3656334 Min: 1 Act: 4 Avg: 5 Max: 18   

T: 6 ( 1185) P:99 I:4000 C:3199292 Min: 2 Act: 4 Avg: 5 Max: 17   

T: 7 ( 1186) P:99 I:4500 C:2843815 Min: 1 Act: 5 Avg: 5 Max: 19   

（测试4小时）

### 2.4 RK3576


| 配置 | 说明 |
| --- | --- |
| CPU | 4xA72(big):2.3GHz，4xA53(little)：2.2GHz |
| CACHE | A72：L1-I-48K,L1-D-32K，L2-1MA53：L1-I-32K,L1-D-32K，L2-512K |
| DDR | LP4X，2112M |
| OS | BUILDROOT，kernel-6.10 |

#### 2.4.1 空载测试

##### 2.4.1.1 PREEMPT\_RT Patch

root@rk3576-buildroot:/# cyclictest -c0 -m -t -p99 -D8H   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 3.50 3.32 3.17 1/309 3491   

T: 0 2675) P:99 I:1000 C:28799996 Min: 2 Act: 3 Avg: 3 Max: 34   

T: 1 2676) P:99 I:1500 C:19199994 Min: 2 Act: 3 Avg: 3 Max: 25   

T: 2 ( 2677) P:99 I:2000 C:14399993 Min: 2 Act: 3 Avg: 3 Max: 27   

T: 3 ( 2678) P:99 I:2500 C:11519993 Min: 2 Act: 3 Avg: 3 Max: 28   

T: 4 ( 2679) P:99 I:3000 C:9599993 Min: 2 Act: 2 Avg: 2 Max: 17   

T: 5 ( 2680) P:99 I:3500 C:8228564 Min: 2 Act: 2 Avg: 2 Max: 19   

T: 6 ( 2681) P:99 I:4000 C:7199993 Min: 2 Act: 2 Avg: 2 Max: 16   

T: 7 ( 2682) P:99 I:4500 C:6399993 Min: 2 Act: 2 Avg: 2 Max: 16   

（测试8小时）

##### 2.4.1.2 Xenomai Cobalt Mode

root@rk3576:/# ./usr/demo/cyclictest -c 0 -m -n -t 8 -p 99 -D 2H   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 0.54 0.54 0.54 1/207 1104   

T: 0 ( 1557) P:99 I:1000 C:7199995 Min: 1 Act: 2 Avg: 2 Max: 12   

T: 1 ( 1558) P:99 I:1500 C:4799996 Min: 1 Act: 2 Avg: 2 Max: 8   

T: 2 ( 1559) P:99 I:2000 C:3599997 Min: 1 Act: 2 Avg: 2 Max: 14   

T: 3 ( 1560) P:99 I:2500 C:2879998 Min: 1 Act: 2 Avg: 2 Max: 9   

T: 4 ( 1561) P:99 I:3000 C:2399998 Min: 1 Act: 2 Avg: 2 Max: 13   

T: 5 ( 1562) P:99 I:3500 C:2057141 Min: 1 Act: 2 Avg: 2 Max: 9   

T: 6 ( 1563) P:99 I:4000 C:1799998 Min: 1 Act: 2 Avg: 2 Max: 7   

T: 7 ( 1564) P:99 I:4500 C:1599998 Min: 1 Act: 2 Avg: 2 Max: 8   

（测试2小时）

#### 2.4.2 压力测试

##### 2.4.2.1 PREEMPT\_RT Patch

stress-ng -c8 --io 8 --cpu-load 100 -vm 4 --vm-bytes 512M --timeout 10000000s

root@rk3576-buildroot:/# cyclictest -c0 -m -t -p99 -D8H   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 24.41 23.87 23.55 17/341 2533   

T: 0 ( 1425) P:99 I:1000 C:28799993 Min: 3 Act: 6 Avg: 9 Max: 44   

T: 1 ( 1426) P:99 I:1500 C:19199994 Min: 3 Act: 7 Avg: 9 Max: 36   

T: 2 ( 1427) P:99 I:2000 C:14399992 Min: 3 Act: 7 Avg: 8 Max: 35   

T: 3 ( 1428) P:99 I:2500 C:11519992 Min: 3 Act: 11 Avg: 10 Max: 39   

T: 4 ( 1429) P:99 I:3000 C:9599985 Min: 2 Act: 10 Avg: 8 Max: 41   

T: 5 ( 1430) P:99 I:3500 C:8228558 Min: 2 Act: 12 Avg: 7 Max: 35   

T: 6 ( 1431) P:99 I:4000 C:7199986 Min: 2 Act: 8 Avg: 9 Max: 48   

T: 7 ( 1432) P:99 I:4500 C:6399988 Min: 2 Act: 6 Avg: 7 Max: 38   

（测试8小时）

##### 2.4.2.2 Xenomai Cobalt Mode

root@rk3576:/# ./usr/demo/cyclictest -c0 -m -n -t -p99 -D 2H   

# /dev/cpu\_dma\_latency set to 0us   

policy: fifo: loadavg: 21.61 21.60 21.64 20/241 1759   

T: 0 ( 1653) P:99 I:1000 C:7199993 Min: 2 Act: 7 Avg: 7 Max: 43   

T: 1 ( 1654) P:99 I:1500 C:4799991 Min: 2 Act: 11 Avg: 6 Max: 40   

T: 2 ( 1655) P:99 I:2000 C:3599991 Min: 2 Act: 5 Avg: 6 Max: 43   

T: 3 ( 1656) P:99 I:2500 C:2879986 Min: 2 Act: 16 Avg: 6 Max: 39   

T: 4 ( 1657) P:99 I:3000 C:2399988 Min: 2 Act: 7 Avg: 7 Max: 42   

T: 5 ( 1658) P:99 I:3500 C:2057132 Min: 2 Act: 12 Avg: 6 Max: 45   

T: 6 ( 1659) P:99 I:4000 C:1799991 Min: 2 Act: 7 Avg: 8 Max: 44   

T: 7 ( 1660) P:99 I:4500 C:1599991 Min: 2 Act: 16 Avg: 8 Max: 47   

（测试2小时）
