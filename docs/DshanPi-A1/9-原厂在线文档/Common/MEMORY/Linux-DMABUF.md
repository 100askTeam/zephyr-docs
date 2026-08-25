---
sidebar_position: 1
---

# Rockchip Linux DMABUF开发文档

## 前言

## 概述

本文介绍DMABUF的一种调试手段，可以有效分析确认DMABUF的内存泄漏问题、数据流出错、内存映射失败等问题。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3588 | Linux-5.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 许剑群 | 2022-05-02 | 初始版本 |

```javascript
CONFIG_DMABUF_DEBUG_ADVANCED=y
```

## 1. 简介

DMABUF是多媒体设备之间共享内存的一种特定buffer结构，不同设备可以通过DMABUF的fd进行跨进程共享内存，实现零拷贝提高性能，支持异步访问降低模块耦合度。

## 2. DMABUF 调试Linux修改

### 2.1 DMABUF\_DEBUG

Linux-5.10开始支持DMABUF debug，支持此功能需要修改  

arch/arm64/configs/rockchip\_defconfig

```javascript
CONFIG_DMABUF_DEBUG=y
```

打开该宏定义，每个DMABUF会默认设置name，以pid+taskname的形式，16个字符。如

416-allocator@4.

### 2.2 DMABUF\_PROCFS

Linux-5.10开始支持DMABUF procfs，支持此功能需要修改

arch/arm64/configs/rockchip\_defconfig

CONFIG\_RK\_DMABUF\_PROCFS=y

打开该宏定义，在/proc/节点下创建一个rk\_dmabuf的子结点，该子节点支持多种调试节点，如

dev # 显示所有DMABUF已经attach的device  

sgt # 显示所有DMABUF的ScatterListTable，显示其IOVA  

size # 显示所有DMABUF的total size  

peak # 显示所有DMABUF的total size的峰值

### 2.3 DMABUF\_DEBUG\_ADVANCED

是DMABUF procfs的一个子功能，用于获取DMABUF的内存物理地址，支持此功能需要修改arch/arm64/configs/rockchip\_defconfig

打开该宏定义，所有DMABUF都会通过fake device去attach/map，从而获取到它的sgt，协助/proc/rk\_dmabuf\_sgt完整显示所有DMABUF的IOVA。

## 3. QA

### 3.1 RK3588 视频播放DMABUF内存泄漏?

打开调试宏，在进入主界面

console:/ # cat /proc/rk\_dmabuf/size   

Total: 65552 KiB

播放视频、退出播放、删除历史内容、回到主界面

console:/ # cat /proc/rk\_dmabuf/size   

Total: 83948 KiB

### 3.2 RK3588 视频播放DMABUF内存峰值？

通过mpp的调试节点，查看播放视频的DMABUF的总内存大小

```shell
console:/ # cat /proc/mpp_service/sessions-summary
fdc38100.rkvdec-core Total: 699760 KiB
```

通过DMABUF的调试节点，查看DMABUF峰值内存

console:/ # cat /proc/rk\_dmabuf/peak   

Peak: 1544 MiB

### 清零重新观察

console:/ # echo 0 &gt; /proc/rk\_dmabuf/peak
