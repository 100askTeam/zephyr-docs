---
sidebar_position: 1
---

# Rockchip Developer Guide Linux IOMMU

## 前言

## 概述

IOMMU用于32位虚拟地址和物理地址的转换，它带有读写控制位，能产生缺页异常以及总线异常中断。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| ROCKCHIP 芯片 | 4.4/4.19 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0 | 薛小明 | 2019.12.23 | 初始发布 |
| V1.1.0 | 薛小明 | 2021-04-13 | 添加常见问题说明 |

## 1. IOMMU结构

使用二级页表结构， 如下：




| 31 |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 22 21 |  | 121 | 1 |  | 0 |  |  |
| DTE index | PTE index | Page offset |  |  |  |  |  |  |

32位地址结构，前10位第一级页表偏移，中间10位二级页表偏移，最后12位页内偏移

DTE结构：



bit0：下一级页表是否存在

PTE结构：



bit0：实际的物理页是否存在

bit1：读允许

bit2：写允许

## 2. IOMMU驱动

### 2.1 驱动文件

驱动文件所在位置：  

drivers/iommu/rockchip-iommu.c

### 2.2 DTS 节点配置

DTS 配置参考文档 为 Documentation/devicetree/bindings/iommu/rockchip,iommu.txt ，本文主要说明如下参数:

compatible = "rockchip,iommu";

对于所有设备的iommu，compatible字段值相同

```
interrupts = <GIC_SPI 119 IRQ_TYPE_LEVEL_HIGH 0>; 用于异常中断，比如缺页中断

clocks = <&cru ACLK_VOP1>, <&cru HCLK_VOP1>;
```

```javascript
clock-names = "aclk", "hclk";
```

```
power-domains = <&power RK3399_PD_VOPL>;
```

用于iommu驱动操作pd功能

```
iommu-cells = <0>;
```

必须为0，详见iommu.txt

## 3. IOMMU使用

ROCKCHIP IOMMU驱动依赖IOMMU框架( drivers/iommu/iommu.c )，主要实现 struct iommu\_opsrk\_iommu\_ops 当中的回调函数，然后master调用iommu框架提供的API对iommu进行操作，如下:

```c
1. iommu attach
iommu_attach_device -> rk_iommu_attach_device /* enable iommu */
```

```c
iommu_detach_device -> rk_iommu_detach_device /* disable iommu */
```

## 3. iommu map

iommu\_map -&gt; rk\_iommu\_map

创建页表，建立虚拟地址和物理地址的映射关系，debug时候将iommu\_map里面的dbg打印打开，观察mapping过程

iommu\_unmap -&gt; rk\_iommu\_unmap

解除虚拟地址和物理地址的映射关系，释放虚拟地址空间，debug时候将iommu\_unmap里面的dbg打印打开，观察

### unmapping过程

## 5. domain alloc

iommu\_domain\_alloc -&gt; rk\_iommu\_domain\_alloc  

申请页表基地址，用于attach/detach操作

## 6. domain free

iommu\_domain\_free -&gt; rk\_iommu\_domain\_free  

释放页表空间

## 7. dump iommu页表

以3399 vopl\_iommu为例，假设当前访问的虚拟地址VA为0x00001000，依照如下顺序dump页表：   

a. 获取一级页表基地址: DT   

io -4 0xff8f3f00   

b. 计算一级页表偏移   

index1 = VA &gt;&gt; 22   

c. 计算一级页表物理地址: DTE   

DTE = index1 \* 4 + DT   

d. 获取二级页表基地址：PT   

PT = io -4 DTE   

e. 计算二级页表偏移   

index2 = VA && 0x3ff000   

e. 计算二级页表物理地址: PTE   

PTE = index2 \* 4 + PT   

f. 获取PAGE物理地址: page   

page = io -4 PTE   

g. 计算页内偏移: offset   

offset = page + (VA && 0xfff)   

offset就是虚拟地址0x00001000对应的物理地址，master可以用此来分析数据是否正确

## 8. dma-mapping

a. dev为非iommu设备  

ARM32: dev-&gt;dma ops arm \_dma\_ops;  

ARM64: dev-&gt;dma ops = arm64 \_swiotlb\_dma\_ops;  

b. dev为iommu设备  

ARM32: dev-&gt;dma\_ops = iommu\_ops;  

ARM64: dev-&gt;dma\_ops = iommu\_dma\_ops;  

以dma\_alloc\_attrs函数为例：

1. 非iommu dev，从a的dma\_ops调用alloc回调申请连续物理内存和内核态虚拟地址2. iommu dev，从b的dma\_ops调用alloc回调申请物理内存，并通过iommu框架调用iommu\_map来创建iommu页表，建立虚拟地址和物理地址映射关系，返回iommu虚拟地址首地址和内核态虚拟地址

### 一个最简单的使用iommu的步骤

1. domain = iommu\_domain\_alloc(&platform\_bus\_type);   

2. iommu\_map(domain, iova, paddr, size, prot)；   

3. iommu\_attach\_device(domain, dev)；   

4. master启动访问iommu

iommu是一个基础的部件，可以嵌入各种内存分配的框架中，比如ion/drm，以ARM64环境下drm为例，一次完整的iommu buffer分配以及映射过程如下：

rockchip\_gem\_alloc\_buf -&gt;   

rockchip\_gem\_get\_pages -&gt;   

rockchip\_gem\_iommu\_map -&gt;   

iommu\_map\_sg -&gt;   

iommu\_map

通过传递fd的iommu映射过程如下：

```c
1. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> drm_gem_map_dma_buf ->
dma_map_sg_attrs -> map_sg ->
_iommu_map_sg_attrs ->
iommu_dma_map_sg ->
iommu_map_sg ->
iommu_map
```

4. 内核配置

Symbol: ROCKCHIP\_IOMMU [=y]   

Type : boolean   

Prompt: Rockchip IOMMU Support   

Location:   

-&gt; Device Drivers   

-&gt; IOMMU Hardware Support (IOMMU\_SUPPORT [=y])   

Defined at drivers/iommu/Kconfig:211   

Depends on: IOMMU\_SUPPORT [=y] && (ARM || ARM64 [=y]) && (ARCH\_ROCKCHIP [=y]   

||   

COMPILE\_TEST [=n])   

Selects: IOMMU\_API [=y] && ARM\_DMA\_USE\_IOMMU

5. IOMMU常见问题

1. pagefault中断

出现pagefault中断，说明当前iommu产生了缺页异常，即当前正在访问的虚拟地址没有创建对应的映射关系。有三种可能，一是访问unmap的地址，二是越界访问，三是没有map就开始访问，历史上这三种情况master都有出现过。

2. iommu enable stall异常

这个很有可能是iommu已经出现pagefault异常，然后master没有处理异常，继续访问，从log可以看出该问题。

3. iommu寄存器不能访问

很有可能是master对pd的处理即pm\_runtime\_get\_sync/pm\_runtime\_put\_sync使用不合理导致，即没有开iommu power domain的情况下去访问iommu寄存器。

4. iommu持续报中断

DTS中断号填写错误。

5. 开机闪屏

在vop显示过程中，使能iommu，导致vop取数异常，在没有帧生效功能的芯片中，需要等到vop没有取数再使能iommu。

6. iommu寄存器异常

很有可能是master越界访问iommu寄存器，或者master复位整个IP。

7. iommu集成device link操作，将PD的操作权限交给master，master需要注意pm\_runtime\_get/pm\_runtime\_put的使用。

8. ARM32环境下，共享iommu的master需要维护独立的页表，比如vepu和vdpu，每次访问之前需要attach对应的页表，ARM64则是共享页表，不需要每次attach。

## 9. 高频复位问题

RK3288重启压力测试，会出现vop pagefault，由于vop有超频，在超频状态vop iommu的force reset操作有可能会出现异常，解决办法是vop iommu attach时候忽略force reset。

## 10. RK3128和RK3126的vop iommu无法读

11. ISP iommu无法执行reset操作

12. RK1126和RV1109的rkvenc的iommu有可能会出现写命令失效，需要重复几次写命令，防止失效

## 13. VOP IOMMU关闭自动attach

从4.19内核之后，vop由自己主动attach iommu，不在注册设备节点的时候自动attach，防止在uboot进内核阶段出现显示异常。

## 14. 刷iommu tlb导致的性能问题

由于映射过程需要刷iommu tlb, 如果buffer比较离散，就会出现多次刷iommu tlb，导致性能下降。  

解决办法是添加标志位，只刷一次iommu tlb。

## 15. VOP iommu添加一一映射功能

可以规避从uboot到内核因为等待帧生效引起的显示异常，比如RK356X master个数超过iommu个数，无法使用等  

帧生效，一一映射功能可以规避这个问题。

## 16. 一个master两个iommu

如果没有特殊需求，可以优化master驱动，两个iommu使用相同的页表。

17. px30 264/265切换

正确切换顺序如下：

1. 确保clock都打开

2. 确保pd都打开

3. 关闭所有的iommu

4. 切换grf

5. 打开当前的iommu

## 18. RK3368 vpu和hevc同时工作异常

由于RK3368的vpu和hevc共享iommu tlb，所以必须保证对tlb的操作串行化，就是映射必须串行化，否则会引起异常。
