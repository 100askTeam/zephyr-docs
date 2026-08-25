---
sidebar_position: 1
---

# Rockchip Linux Memory Allocator开发文档

## 前言

## 概述

本文介绍Rockchip Linux 5.10平台内存分配器相关技术。

Linux 5.10新增DMA-HEAP内存分配器，代码位于 drivers/dma-buf/heaps/ 目 录，专用于分配DMABUF类型的内存；对用户空间通过ioctl返回dmabuf的索引(fd)。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3588, RV1106 | Linux-5.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 许剑群 | 2022-06-25 | 初始版本 |

## 1. 分配器一：DMA-HEAP

分配器驱动代码位于 drivers/dma-buf/heaps/ 目 录。

drivers/dma-buf/heaps/   

── cma\_heap.c 物理地址连续内存分配器驱动   

── deferred-free-helper.c 内存延迟释放驱动   

── deferred-free-helper.h   

── Kconfig   

├── Makefile   

── page\_pool.c 内存页缓存驱动   

├── page\_pool.h   

── system\_heap.c 物理地址不连续虚拟地址连续内存分配器驱动

一个heap driver表示一种内存类型的分配器，支持模块化编译。Linux提供两种典型的内存分配器驱动：system-heap、cma-heap。

### 1.1 system-heap

system-heap默认支持cpu cache，cpu访问该分配器分配的内存是有cache的，访问速度快，但是device和cpu之间要通过软件行为保持数据一致性。该驱动延伸出不支持cpu cahce的分配器，system-uncached-heap。

system-heap默认支持defer-free，即延迟释放内存，在内存页缓存非空时，内存分配速度快。内存页缓存依赖于mm shrinker进行适当地回收。

system-heap通过add\_dma\_heap()向dma-heap增加分配器，获取唯一的索引，并在 /dev/dma\_heap/ 下创建分配器的设备，如 /dev/dma\_heap/system-heap 和 /dev/dma\_heap/system-uncached-heap 。

### 1.2 cma-heap

cma-heap默认支持cpu cache，cpu访问该分配器分配的内存是有cache的，访问速度快，但是device和cpu之间要通过软件行为保持数据一致性。

cma-heap是从cma\_alloc分配内存页，而cma的内存区域是由cma的驱动确定，详细参看

Rockchip\_Developer\_Guide\_Linux\_CMA\_CN 文档。该分配器分配到的是物理地址连续内存，适用于没有iommu的外设直接访问。

## 2. 分配器二：DRM-GEM

分配器驱动代码位于 drivers/gpu/drm/rockchip/ 目 录。

## 3. 分配器三：VB2-MEMOPS

分配器驱动代码位于 drivers/media/common/videobuf2/ 目 录。

## 4. RV1106专用分配器：RK-DMA-HEAP

RK-DMA-HEAP是RV1106专用的DMABUF内存分配器，基于DMA-HEAP。

RK-DMA-HEAP与DMA-HEAP的主要差异：


|  | Linux API | RETURN |
| --- | --- | --- |
| Linux分配DMABUF | rk_dma_heap_buffer_alloc | struct dma_buf * |
| Linux分配PAGE数组 | rk_dma_heap_alloc_contig_pages | struct page * |
| 支持debug list |  |  |

DMA-HEAP是DMABUF的分配器，但是RK-DMA-HEAP支持分配DMABUF，也支持分配普通的页数组。

### 4.1 rk-dma-heap-info

RK-DMA-HEAP的调试节点是 /proc/rk\_dma\_heap/rk-dma-heap-info ，读取节点会打印较多内容如下

# cat /proc/rk\_dma\_heap/rk-dma-heap-info   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5656   

Alloc by (vmpi ) [0x03e1b000-0x03e33fff] 0x00019000 (100 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5655   

Alloc by (vmpi ) [0x03e02000-0x03e1afff] 0x00019000 (100 KiB)   

Attached Devices:   

ffa50000.rkvenc

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5654   

Alloc by (vmpi ) [0x03d96000-0x03e01fff] 0x0006c000 (432 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5653   

Alloc by (vmpi ) [0x03d86000-0x03d95fff] 0x00010000 (64 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5652   

Alloc by (vmpi ) [0x03d76000-0x03d85fff] 0x00010000 (64 KiB)   

Attached Devices:   

ffa50000.rkvenc   

ffa50000.rkvenc   

Total 2 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5637   

Alloc by (vmpi ) [0x03c76000-0x03d75fff] 0x00100000 (1024 KiB)   

Attached Devices:   

ffa50000.rkvenc   

ffa50000.rkvenc   

Total 2 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5636   

Alloc by (vmpi ) [0x03c74000-0x03c75fff] 0x00002000 (8 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5635   

Alloc by (vmpi ) [0x03c72000-0x03c73fff] 0x00002000 (8 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5626   

Alloc by (vmpi ) [0x03c40000-0x03c71fff] 0x00032000 (200 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5625   

Alloc by (vmpi ) [0x03c3f000-0x03c3ffff] 0x00001000 (4 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5624   

Alloc by (vmpi ) [0x03c37000-0x03c3efff] 0x00008000 (32 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5623   

Alloc by (vmpi ) [0x03c36000-0x03c36fff] 0x00001000 (4 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5622   

Alloc by (vmpi ) [0x03c2e000-0x03c35fff] 0x00008000 (32 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5621   

Alloc by (vmpi ) [0x03b64000-0x03c2dfff] 0x000ca000 (808 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5610   

Alloc by (vmpi ) [0x03acf000-0x03b63fff] 0x00095000 (596 KiB)   

Attached Devices:   

ffa00000.rkisp   

ffa50000.rkvenc   

ffa00000.rkisp   

ffa00000.rkisp   

ffa00000.rkisp   

Total 5 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5609   

Alloc by (vmpi ) [0x03ac0000-0x03acefff] 0x0000f000 (60 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5608   

Alloc by (vmpi ) [0x03ab1000-0x03abffff] 0x0000f000 (60 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5607   

Alloc by (vmpi ) [0x038ef000-0x03ab0fff] 0x001c2000 (1800 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5606   

Alloc by (vmpi ) [0x038ed000-0x038eefff] 0x00002000 (8 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5605   

Alloc by (vmpi ) [0x038b3000-0x038ecfff] 0x0003a000 (232 KiB)

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5604   

Alloc by (vmpi ) [0x038b1000-0x038b2fff] 0x00002000 (8 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5603   

Alloc by (vmpi ) [0x03877000-0x038b0fff] 0x0003a000 (232 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5602   

Alloc by (vmpi ) [0x0324e000-0x03876fff] 0x00629000 (6308 KiB)   

Attached Devices:   

ffa50000.rkvenc   

Total 1 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5586   

Alloc by (ff660000.npu ) [0x0308c000-0x030f7fff] 0x0006c000 (432 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5585   

Alloc by (ff660000.npu ) [0x03087000-0x0308bfff] 0x00005000 (20 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5584   

Alloc by (ff660000.npu ) [0x03082000-0x03086fff] 0x00005000 (20 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5583   

Alloc by (ff660000.npu ) [0x0307d000-0x03081fff] 0x00005000 (20 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5582   

Alloc by (ff660000.npu ) [0x0306b000-0x0307cfff] 0x00012000 (72 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5581   

Alloc by (ff660000.npu ) [0x03059000-0x0306afff] 0x00012000 (72 KiB)   

Attached Devices:   

Total 0 devices attached   

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5580   

Alloc by (ff660000.npu ) [0x03047000-0x03058fff] 0x00012000 (72 KiB)   

Attached Devices:

Total 0 devices attached

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5579   

Alloc by (ff660000.npu ) [0x02e5f000-0x03046fff] 0x001e8000 (1952 KiB)   

Attached Devices:   

Total 0 devices attached

dma-heap:&lt;rk-dma-heap-cma&gt; -dmabuf i\_ino = 5328   

Alloc by (vmpi ) [0x02800000-0x02802fff] 0x00003000 (12 KiB)   

Attached Devices:   

Total 0 devices attached

一般可以用 ‘Alloc’过滤出分配信息


| # cat /proc/rk_dma_heap/rk-dma-heap-info Igrep Alloc |  |  |  |
| --- | --- | --- | --- |
| Alloc by (vmpi )[0x03e1b000-0x03e33fff]0x00019000(100 |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi )[0x03e02000-0x03e1afff] 0x00019000 (100 |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi )[0x03d96000-0x03e01fff]0x0006c000(432 |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi )[0x03d86000-0x03d95fff] 0x00010000(64 |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi )[0x03d76000-0x03d85fff] 0x00010000(64 |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi )[0x03c76000-0x03d75fff] 0x00100000(1024 |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi                      )[0x03c74000-0x03c75fff] 0x00002000 (8KiB)Alloc by (vmpi                      ) [0x03c72000-0x03c73fff] 0x00002000 (8KiB)Alloc by (vmpi                       )[0x03c40000-0x03c71fff] 0x00032000 (200KiB)) [0x03c3f000-0x03c3ffff] 0x00001000 (4 |  |  |  |
| KiB) |  |  |  |
|  |  |  |  |
| Alloc by (vmpi |  |  |  |
| KiB) |  | )[0x03c37000-0x03c3efff] 0x00008000 (32 |  |
| Alloc by (vmpi |  |  |  |
| KiB) | )[0x03c36000-0x03c36fff] 0x00001000 (4 |  |  |
| Alloc by (vmpi |  |  |  |
| KiB)Alloc by (vmpi | ) [0x03c2e000-0x03c35fff] 0x00008000 (32)[0x03b64000-0x03c2dfff] 0x000ca000 (808)[0x03acf000-0x03b63fff] 0x00095000 (596 |  |  |
| KiB)Alloc by (vmpi |  |  |  |
| KiB) |  |  |  |
| Alloc by (vmpi |  |  |  |
| KiB)Alloc by (vmpi | ) [0x03ac0000-0x03acefff] 0x0000f000 (60) [0x03ab1000-0x03abffff] 0x0000f000 (60)[0x038ef000-0x03ab0fff] 0x001c2000 (1800 |  |  |
| KiB)Alloc by (vmpi |  |  |  |
| KiB) |  |  |  |
| Alloc | by (vmpi |  |  |
| KiB) |  | ) [0x038ed000-0x038eefff] 0x00002000 (8 |  |
|  | Alloc | by (vmpi |  |
| KiB) |  |  |  |
| Alloc | by (vmpi | )[0x038b3000-0x038ecfff] 0x0003a000 | (232 |
| KiB)Alloc | by (vmpi                      )[0x038b1000-0x038b2fff] 0x00002000by (vmpi                      )[0x03877000-0x038b0fff] 0x0003a000 |  |  |
| (8 |  |  |  |
| KiB) |  |  |  |
| Alloc |  |  |  |
| (232 |  |  |  |
| KiB)Alloc | by (vmpi                      )[0x0324e000-0x03876fff] 0x00629000 (6308 |  |  |
| KiB) | by (ff660000.npu           )[0x0308c000-0x030f7fff] 0x0006c000 (432 |  |  |
| Alloc |  |  |  |
| KiB)Alloc | by (ff660000.npu           ) [0x03087000-0x0308bfff] 0x00005000 (20 |  |  |
| KiB) | by (ff660000.npu           ) [0x03082000-0x03086fff] 0x00005000 (20 |  |  |
| Alloc |  |  |  |
| KiB) | ) [0x0307d000-0x03081fff] 0x00005000 (20 |  |  |
| Alloc |  |  |  |
| by (ff66000.npu |  |  |  |
| KiB)Alloc by (ff660000.npu          )[0x0306b000-0x0307cfff] 0x00012000 (72 |  |  |  |
| KiB)Alloc | by (ff660000.npu          )[0x03059000-0x0306afff] 0x00012000 (72 |  |  |
| KiB)Alloc | by (ff660000.npu           )[0x03047000-0x03058fff] 0x00012000 (72 |  |  |
| Alloc by (ff660000.npu           )[0x02e5f000-0x03046fff] 0x001e8000 (1952KiB)Alloc by (vmpi                       ) [0x02800000-0x02802fff] 0x00003000 (12KiB)Alloc by (ffa00000.rkisp        )[0x02803000-0x02813fff] 0x00011000 (68KiB) |  |  |  |


|  | Alloc by (ffa00000.rkisp | )[0x02814000-0x02824fff] 0x00011000 (68 |  |  |
| --- | --- | --- | --- | --- |
| KiB) |  |  |  |  |
|  | Alloc by (ffa00000.rkisp |  | )[0x02825000-0x02825fff] 0x00001000 (4 |  |
| KiB) |  |  |  |  |
|  | Alloc by (ffa00000.rkisp | )[0x02826000-0x02826fff] 0x00001000 (4 |  |  |
| KiB) |  |  |  |  |
|  | Alloc by (ffa00000.rkisp | )[0x02827000-0x02dddfff] 0x005b7000(5852 |  |  |
| KiB) |  |  |  |  |
|  | Alloc by (ffa00000.rkisp | )[0x02dde000-0x02e4efff] 0x00071000(452 |  |  |
| KiB) |  |  |  |  |
|  | Alloc by (rkisp-vir0 | )[0x02e4f000-0x02e52fff] 0x00004000 (16 |  |  |
| KiB) |  |  |  |  |
|  | Alloc by (rkisp-vir0 | )[0x02e53000-0x02e56fff] 0x00004000(16 |  |  |
| KiB) |  |  |  |  |
|  |  |  |  |  |
| KiB) | Alloc by (rkisp-vir0 | )[0x02e57000-0x02e5afff] 0x00004000(16 |  |  |
|  |  |  |  |  |
|  | Alloc by (rkisp-vir0 | )[0x02e5b000-0x02e5efff] 0x00004000(16 |  |  |
| KiB) |  |  |  |  |
|  | Alloc by (ffa00000.rkisp | )[0x030f8000-0x03249fff] 0x00152000 (1352 |  |  |
| KiB) |  |  |  |  |
|  | Alloc by (ffa00000.rkisp |  | )[0x0324a000-0x0324dfff] 0x00004000(16 |  |
| KiB) |  |  |  |  |
|  |  |  |  |  |

格式：Alloc by ([dmabuf name]) [0xaaaaaaaa-0xbbbbbbbb] 0xzzzzzzzz (dd KiB)

1. [dmabuf name]：在驱动中分配内存的线程名默认被设置为dmabuf name，各模块如果有指定字符串会覆盖默认值。如vmpi是rockit中调用rk-dma-heap的线程名。

2. [0xaaaaaaaa-0xbbbbbbbb]：0xaaaaaaaa是该内存区域的起始地址（物理地址），0xbbbbbbbb是结束地址（物理地址）。

3. 0xzzzzzzzz：是内存区间大小的十六进制值。

4. dd KiB：dd是内存区间大小的十进制值并转为KiB。
