---
sidebar_position: 1
---

# User-Guide-Production-For-Firmware-Download

### 量产烧录指南

## 前言

## 概述

本文介绍RK平台的量产烧录方案，包括如何制作烧录镜像、烧录工具使用和常见问题处理。

支持产品


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3326 | Linux4.4,Linux4.19 |
| RK3399 | Linux4.4,Linux4.19 |
| RK3368 | Linux4.4,Linux4.19 |
| RK3288 | Linux4.4,Linux4.19 |
| RK3328 | Linux4.4,Linux4.19,Linux3.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

生产技术人员

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 刘翊 | 2016-07-18 | 初稿 |
| V1.1.0 | 刘翊 | 2017-02-14 | 增加RK3328支持 |
| V1.2.0 | 刘翊 | 2019-11-13 | 增加Linux4.19支持 |
| V1.2.1 | 黄莹 | 2021-05-19 | 修改格式 |
| V1.2.2 | 刘翊 | 2022-05-26 | ID From RK-SM-YF-179 to RK-SM-YF-180 |
| V1.2.3 | 赵仪峰 | 2023-02-09 | 修改EXT CSD配置说明 |

## 1. 量产烧录方案

### 1.1 方案一(USB升级方案)

步骤1：制作update.img升级固件

步骤2：使用FactoryTool进行批量烧录

### 1.2 方案二(SD升级方案)

步骤1：制作update.img升级固件

步骤2：使用SD\_Firmware\_Tool工具制作固件升级的SD卡

步骤3：插入升级SD卡，重新上电，进行固件烧录

### 1.3 方案三(烧录器升级方案)

步骤1：制作update.img升级固件

步骤2：使用SpiImageTool工具制作烧录器的烧录文件

步骤3：存储芯片接入烧录器，进行固件烧录

## 2. 工具使用

### 2.1 FactoryTool批量烧录工具


| 固件 |  | 启动 | 升级 |  | 修复 | Demo拷贝 | 语言选择 | 退出 |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 固件： |  |  |  |  |  | 固件版本： Loader版本： |  |  |  |
| ☐Demo 芯片信息： |  |  |  |  |  |  |  |  |  |
| ID 失败 设备列表 设备类型 ID 升级信息 A |  |  |  |  |  |  |  |  |  |
|  |  | RootHub20 |  |  | A |  |  |  |  |
|  |  | HUS Port[1] |  |  |  |  |  |  |  |
|  |  |  | Hub | 4 |  |  |  |  |  |
|  |  | Port[1] |  |  |  |  |  |  |  |
|  |  | Port[2] |  |  |  |  |  |  |  |
|  |  | Port[3] |  |  |  |  |  |  |  |
|  |  | Port[4] |  |  |  |  |  |  |  |
|  |  | Port[5] |  |  |  | E |  |  |  |
|  |  | Port[6] | Loader | 20 |  |  |  |  |  |
|  |  | Port[2] |  |  |  |  |  |  |  |
|  |  |  | Port[3] |  |  |  |  |  |  |
|  |  | RootHub20 |  |  |  |  |  |  |  |
|  |  | Port[1] | Hub | 1 |  |  |  |  |  |
|  |  | Port[1] |  |  |  |  |  |  |  |
|  |  | Port[2] |  |  |  |  |  |  |  |
|  |  | Port[3] |  |  |  |  |  |  |  |
|  |  | Port[4] |  |  |  |  |  |  |  |
|  |  | Port[5] |  |  |  |  |  |  |  |
|  |  | Port[6] |  |  |  |  |  |  |  |
| 友情提示： |  |  |  |  |  |  |  |  |  |
| 1. 第一次使用，标识USB端口方法：连接设备，工具显示设备后记录绑定ID.标识所有USB端口. |  |  |  |  |  |  |  |  |  |
| 2. 插入设备升级，要等到工具开始升级后再接入下一台. | 成功： 00000 失败： 00000 |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |
| 3. 升级过程中，绿灯亮，接入设备，红灯亮，不要拔插设备. |  |  |  |  |  |  |  |  |  |
| 4. 升级结束，成功以绿色背景显示，失败以红色背景显示. 总共： 00000 |  |  |  |  |  |  |  |  |  |
| 5. 所有成功设备会在右侧表格中显示，所有失败设备会在左侧表格中显示. |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

使用步骤:

点击”固件”，选择升级固件

如果有烧录Demo镜像，则勾选”Demo”选择Demo镜像(可选)，Demo镜像制作见OemTool工具使用

点击”启动”，开始自动检测升级设备

连接升级设备，工具检测到后，自动开始升级

### 2.2 OemTool(制作Demo镜像工具)



制作Demo镜像步骤:

1. 点击”选择…”，选择制作镜像的Demo目录

2. 勾选”Fat32”， 目 前只支持Fat32格式镜像

3. 设置”磁盘大小”，只要大于user分区的容量，按100M对齐即可

4. 点击”开始执行”，成功后会在工具目录下生成一个OemImage.img镜像文件

### 2.3 SD\_Firmware\_Tool(SD升级卡制作工具)



### SD升级卡制作步骤:

1. 从下拉列表中，选中要制作的SD卡或U盘

2. 勾选”固件升级”

3. 点击”选择固件”，选择update.img升级固件

4. 点击”开始创建”

### 2.4 SpiImageTool(烧录器镜像制作工具)



烧录器镜像制作步骤:

1. 点击”选择固件”，选取update.img升级固件

2. 存储使用Emmc时，勾选”数据区预留”

3. 存储使用Emmc时，空白填充选择0，存储使用nandflash时，空白填充选择0xFF

4. 点击”生成文件”，成功时会在工具 目 录下生成boot0.bin和data.bin。emmc情况只使用data.bin，nandflash情况需要使用boot0.bin和data.bin

## 3. 制作升级固件

### 3.1 步骤

1. 在Android源代码 目 录下，运行mkimage.sh脚本带上ota参数，生成system.img、boot.img和recovery.img等，将其拷贝到rockdev的image 目 录下。

2. 在AndroidTool的rockdev 目 录下，执行mkupdate.bat批处理，生成update.img升级固件.ubuntu下执行mkupdate.sh脚本生成。下图为mkupdate.bat内容:

2 Afptool -pack ./ Image\update.img   

RKImageMaker.exe -RK31 RK3188Loader(L) V2.10.bin Image\update.img update.img -os type:androidos

重点关注-RK31这个参数，它需要跟设备匹配。如果不清楚这个值，可以通过下面方法获得：

打开androidtool工具，进入高级功能，选择这个方案的loader文件，点击”下载”

Android开发工具v2.38  

下载镜像升级固件高级功能  

Boot: E:\Rockchip\usb工作\firmware\3399\android\rk3 下载

点击下方的”读取Chip信息”，右方会打印出以下信息，Image Chip Flag就是那个参数

获取ChipInfo开始  

Chip Tag: 33 33 30 43  

Image Chip Flag: -RK330C  

获取ChipInfo成功

## 4. 烧录器设置

### 4.1 EMMC烧录数据：

EMMC分为3个部分，USER区，BOOT1区和BOOT2，只需要烧录USER分区即可，烧录的文件为SpiImageTool 生成的data.bin。

### 4.2 EMMC EXT\_CSD配置信息：

全部使用默认值，不需要配置。

$$

\mathsf &#123; E X T \_ C S D &#125; [ 1 6 7 ] \ = \ \Theta \times \mathtt &#123; 1 &#125; \mathsf &#123; f &#125; \ \left( \sharp \sharp \wedge / \sharp \right)

$$

$$

\mathsf &#123; E X T \_ C S D &#125; [ 1 6 2 ] \ = \ \Theta \times \Theta ( \sharp \sharp \wedge / \sharp )

$$

$$

\mathsf &#123; E X T \_ C S D [ 1 7 7 ] &#125; \ = \ \Theta \times \Theta \left( \sharp \sharp \wedge / \sharp \right)

$$

$$

\mathsf &#123; E X T \_ C S D &#125; [ 1 7 8 ] \ = \ \Theta \times \Theta ( \sharp \sharp \wedge / \sharp )

$$

$$

\mathsf &#123; E X T \_ C S D &#125; [ 1 7 9 ] \ = \ \Theta \times \Theta ( \sharp \sharp \wedge / \sharp )

$$

## 5. 常见升级问题

### 5.1 下载Boot失败一


| ID | 失败 |  | 设备列表 | 设备类型 | ID | 升级信息 |
| --- | --- | --- | --- | --- | --- | --- |
| 20 | 下载Boot失败 |  | 日我的电脑 |  |  |  |
|  |  |  |  |  | HUBRootHub20 |  |
|  |  | 白H Port[1] | Hub | 4 |  |  |
|  |  |  | Port[1] |  |  |  |
|  |  |  | Port[2] |  |  |  |
|  |  |  | Port[3] |  |  |  |
|  |  |  | Port[4] |  |  |  |
|  |  |  | Port[5] |  |  |  |
|  |  |  | 心Port[6] | Maskro | m20 | 下载Boot失败 |
|  |  | Port[2] |  |  |  |  |
|  |  | Port[3] |  |  |  |  |

日志提示:

08:58:34 722Layer&lt;20,2-1-6&gt;:下载Boot开始

08:59:41 498 &lt;LAYER 2-1-6&gt; ERROR:Boot\_VendorRequest--&gt;DeviceIoControl failed, Total(45058), Sended(0),1

08:59:41 499&lt;LAYER 2-1-6&gt; ERROR:DownloadBoot--&gt;Boot\_VendorRequest471 failed, index(0)

08:59:41 502[Error] Layer&lt;20,2-1-6&gt;:下载Boot失败

可能的原因：

1. USB信号不好(检查usb线路上的电容和电阻参数是否正常，usb供电是否正常)

2. 主控虚焊或者电源供电问题

### 5.2 下载Boot失败二


| ID | 失败 |  | 设备列表 | 设备类型 | ID | 升级信息 |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 20 | 测试设备失败 |  | 日我的电脑 |  |  |  |  |  |
|  |  |  |  | HUBRootHub20 |  |  |  |  |
|  |  |  | 白Port[1] | Hub | 4 |  |  |  |
|  |  |  |  |  | Port[1] |  |  |  |
|  |  |  |  |  | Port[2] |  |  |  |
|  |  |  |  |  | Port[3] |  |  |  |
|  |  |  |  |  | Port[4] |  |  |  |
|  |  |  |  |  | Port[5] |  |  |  |
|  |  |  |  |  | 小Port[6] | Loader      20              测试设备失败 |  |  |

可能的原因：

DDR颗粒或者走线问题

### 5.3 准备IDB失败


| ID | 失败 |  | 设备列表 | 设备类型 | ID | 升级信息 |
| --- | --- | --- | --- | --- | --- | --- |
| 准备IDB失败 | 20 | 我的电脑 |  |  |  |  |
| 白HUBRootHub20 |  |  |  |  |  |  |
|  | 曰HUBPort[1] | Hub | 4 |  |  |  |
|  |  |  | Port[1] |  |  |  |
|  |  |  | Port[2] |  |  |  |
|  |  |  | Port[3] |  |  |  |
|  |  |  | Port[4] |  |  |  |
|  |  |  | Port[5] |  |  |  |
|  |  |  | 小Port[6] | Loader | 20 | 准备IDB失败 |
| 09:13:28 244    Layer&lt;20,2-1-6&gt;:准备IDB开始09:13:43 001    &lt;LAYER 2-1-6&gt; INFO:CS(1)                     (14910MB)                   (SAMSUNG)09:13:48 010     &lt;LAYER 2-1-6&gt; ERROR:PrepareIDB--&gt;No Found 1st Flash CS09:13:48 016    [Error] Layer&lt;20,2-1-6&gt;:准备IDB失败 |  |  |  |  |  |  |

可能的原因：

Flash虚焊或者不支持的颗粒

### 5.4 下载IDB失败


| ID | 失败 |  | 设备列表 | 设备类型 | ID | 升级信息 |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20 | 下载IDB失败 |  | 日我的电脑 |  |  |  |  |
|  |  |  |  |  | RootHub20 |  |  |
|  |  | Port[1] | Hub | 4 |  |  |  |
|  |  |  | Port[1] |  |  |  |  |
|  |  |  | Port[2] |  |  |  |  |
|  |  |  | Port[3] |  |  |  |  |
|  |  |  |  | Port[4] |  |  |  |
|  |  |  | Port[5] |  |  |  |  |
|  |  |  | 小Port[6] | 下载IDB失败 |  |  |  |

可能的原因：  

1. USB通讯问题(断电重试，需要使用有源usb hub)

2. DDR稳定性问题(使用DDR测试工具进行稳定性测试)

### 5.5 下载固件失败


| ID | 失败 |  | 设备列表 | 设备类型 | ID | 升级信息 |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20 | 下载固件失败 | 日  我的电脑 |  |  |  |  |  |
|  |  | 日RootHu20 |  |  |  |  |  |
|  |  | Port[1] | Hub | 4 |  |  |  |
|  |  |  |  | Port[1] |  |  |  |
|  |  |  |  | Port[2] |  |  |  |
|  |  |  |  | Port[3] |  |  |  |
|  |  |  |  | Port[4] |  |  |  |
|  |  |  |  | Port[5] |  |  |  |
|  |  |  |  | Port[6]           Loader      20               下载固件失败 |  |  |  |

可能的原因：  

1. USB通讯问题(断电重试，需要使用有源usb hub)

2. Flash问题(使用AndroidTool擦除flash重试)
