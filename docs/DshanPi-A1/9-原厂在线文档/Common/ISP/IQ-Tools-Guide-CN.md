---
sidebar_position: 1
---

# IQ-Tools-Guide-CN

### Rockchip IQ Tools Guide

## 前言

## 概述

本文旨在介绍RKISP2 Tuner的使用方法以及ISP调试流程。主要帮助使用RKISP2 Tuner进行IQ调试的工程师快速上手以及提供参考。

读者对象

本文档（本指南）主要适用于以下工程师：

ISP调试工程师

图像质量调试工程师

产品版本


| 芯片名称 | ISP版本 | SDK版本 | 工具版本 |
| --- | --- | --- | --- |
| RK3566/RK3568 | ISP21 | - | v.2.1.0 0413 Release |
| RK3588 | ISP30 | - | v.2.1.0 0413 Release |
| RV1106/RV1103 | ISP32 | - | v.2.1.0 0413 Release |
| RK3562 | ISP32Lite | Linux SDK v1.0.0 | v.2.1.0 0413 Release |
| RK3562 | ISP32Lite | Android SDK RKR5 | v.2.1.0 0413 Release |

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| v2.0.3 | 陈煜 | 2021-07-13 | 纠正一些错误描述，增加Sensor配置页面的介绍 |
| v2.0.4 | 陈煜、徐苏皖 | 2022-01-05 | 适配v2.0.6版本，新增看图工具相关说明、其他辅助功能说明 |
| v2.0.5 | 徐苏皖 | 2022-05-05 | 适配v2.0.a版本，新增3A分析工具相关说明、抓图工具YNRCapture说明、标定工具说明 |
| v2.0.6 | 陈煜 | 2022-06-21 | BLC模块增加OB相关描述(RV1106)，更新3.5小节加载、保存功能的描述，更新Gamma曲线可视化调试功能，更新部分功能描述 |
| v2.0.7 | 陈煜 | 2023-03-08 | 新增RK3562平台，更新1.2小节关于版本匹配的提示，更新2.3小节关于抓图工具的描述，更新3.1小节关于rkaiq_tool_server的编译方法 |

### 1.1 关于RKISP Tuner

RKISP Tuner（以下简称Tuner）提供了一套便于用户调试ISP参数的工具，用户可以在Tuner中对所有ISP模块开展标定（Calibration）、调试（Tuning）等工作。用户可以使用Tuner提供的抓图工具（Capture Tool）来拍摄Raw图；在标定工具（Calibration Tool）中完成基础模块的标定工作；在Tuner中连接设备，在线进行ISP参数调试。

### 1.2 适用平台&版本号匹配规则


| 芯片名称 | 系统平台 | ISP版本 |
| --- | --- | --- |
| RK3566/3568 | Linux/Android | ISP21 |
| RK3588 | Linux/Android | ISP30 |
| RV1106 | Linux/Android | ISP32 |
| RK3562 | Linux/Android | ISP32 Lite |

### 1.3 调试环境

\*计算机环境要求：\*

运行Tuner的计算机必须安装Windows 7的x64版本或以上版本的64位Windows操作系统；

运行Tuner之前应预先安装MCR\_R2016a(9.0.1)的64位版本（仅支持此版本），下载地址：

https://ww2.mathworks.cn/products/compiler/matlab-runtime

使用过程中应避免Tuner的路径Tuning工程的路径中出现中文字符；

### \*设备端环境要求：\*

1. 具有以太网卡并支持使用有线、无线等方式连接局域网；

2. 不满足1的情况，应能支持RNDIS服务，使用USB模拟网卡设备来连接局域网；

### 1.4 工具安装与配置

RKISP2.x Tuner的本体无需进行安装，直接使用解压工具解压到任意目录即可使用，但应避免解压到存在中文字符的路径。

在第3节中提到运行Tuner之前需要预先安装MCR\_R2016a，安装步骤如下：

1. 打开MCR\_R2016a\_x64.exe，等待其自解压完成；



图1-4-1

2. 点击下一步，选择同意条款，下一步，点击安装；



图1-4-2

## 3. 等待安装完成；



4. 安装完成；  

图1-4-3



图1-4-4

## 2 功能简介

### 2.1 概述

在实际Tuning项目中，用户应按照如下图所示的流程来进行Tuning工作：



图2-1-1

在调试环境准备阶段，用户需要在工具中生成一份基础IQ文件(.json格式)，该文件记录了ISP开放的所有可调参数，无论是后续的标定流程中输出的标定参数，还是调试流程中用户调试的结果，都将记录在这份文件中，最后用户需要将该文件替换到固件或设备中相应位置并重启相机应用来确认最终的图像效果。

由于工具的抓图、在线调试、命令参数交互等功能是通过网络协议来传输，所以再调试环境准备阶段需要用户将PC与设备接入同一局域网内。

拍摄Raw图是为了进行基础模块的标定，同时也可以采集效果异常的场景，在仿真器中排查问题。

基础模块标定需要按照一定流程来进行，如下图：



图2-1-2

由于某些模块的标定会依赖前级模块的标定结果，所以用户应按照流程顺序完成标定工作。在完成某一模块标定计算后，应确认参数是否正确，以免错误的结果影响到后级模块。

### 2.2 Sensor配置页面



图2-2-1

Sensor配置页面如图2-2-1所示，界面功能主要分为2个部分：

2. 菜单栏：主要包括SensorList中配置的导入、导出功能

```ini
[CaptureRawFormat]
RKRawV2=1
```

### 2.3 抓图工具



图2-3-1

RKISP Capture Tool主界面如图2-3-1所示，界面主要分为图中标记的3个部分：

1. 设备端连接配置：提供了设备网络参数配置、Tuning/Calib模式切换功能、测试连接功能；

2. 抓图设置：分为Raw Capture和Online Capture两部分：

1. Raw Capture：在相机关闭、ISP停止工作的情况下采集Raw图，可以控制拍摄的曝光时间和增益；

2. 曝光控制：支持手动曝光和自动曝光两种方式，以及专门用于NR标定的拍图功能 ，手动曝光允许配置步长用于遍历拍摄多组曝光组合，自动曝光允许用户设置目标最大亮度来挑选曝光参数，YNR Capture支持统计ROI 区域亮度自动匹配合适的曝光参数;

3. Raw图预览和统计功能：这里会以灰度图的方式将拍摄到的Raw图显示在窗口中，并显示相应的直方图、亮度信息和简单的白平衡增益；

### 2.4 标定工具

标定工具会根据选择的芯片平台（图2-4-1）会加载对应平台的RKISP Calibration Tool （图2-4-2），导入的IQ File 也需要与平台对应。



图2-4-1



图2-4-2

RKISP Calibration Tool主界面如图2-3-2所示，主要包括以下模块的标定功能：

BLC： 黑电平校正

LSC： 镜头阴影校正

CCM： 色彩校正矩阵

AWB： 自动白平衡校正

GIC： 绿通道平衡校正（标定集成在Bayer NR模块内）

Bayer NR：Raw域降噪，包括Bayer 2DNR、Bayer 3DNR

YNR：Y通道降噪

FEC： 鱼眼校正

建议用户根据标定工作流程，将相应的raw图导入至对应模块计算标定参数。

### 2.5 看图工具



图2-5-1

RKRAW Tool主界面如图2-5-1所示，支持查看jpg/bmp/png、Raw、RKRawV1、RKRawV2格式，主要分为四个部分：

1.文件系统，用于选择要查看的图像路径；



POS:(1243, 259), RGB:(255, 255, 255)

图2-5-2

2.播放窗口，右击显示区域可以切换GRAY/RGB 、Normal/Hdr Short/Mid/Long(仅支持RKRawV2格式)，如图2-5-2所示；

缩放：ctrl+滚轮

3.直方图显示，支持GRAY/RGB 直方图统计；

4.显示RKRawV2格式的相关信息 RAW Format/Frame Info/Register/ISPP Register/Platform Info , 如图2-5-2所示；



图2-5-3

### 2.6 3D-LUT工具

5.比较功能，按住ctrl，同时选择2张以上图像点击Compare进行比较，如图2-5-3所示。



图2-6-1  

RKISP 3D-LutTool主界面如图2-6-1所示，包含两部分，左侧的LUT区域和右侧的预览区域；

1. File：包含图像导入、IQ 参数导入和保存、LUT Info导入和保存功能；

Load Image：点击Load Image导入要调试的图片（支持 jpg/bmp/png、nv12格式），图像会显示在右侧Preview 区域，如图2-6-2所示；



图2-6-2

Load IQ File：点击Load IQ File 导入IQ参数，选择要导入的场景和Lut3D table，如图2-6-3所示；





图2-6-3  

Save IQ File：点击Save IQ File 保存IQ参数，可以选择覆盖IQ File中已有的table或者创建新的table，如图2-6-4所示；



图2-6-4

2.颜色查找：在图像上移动鼠标，鼠标点对应的颜色会在左侧LUT中被黑框标记出来，如图2-6-5所示；鼠标左键单击当前位置，可以锁住LUT中被标记的颜色 ，通过调整Adjust Sat 和Adjust Hue或者直接拖动被标记的点调整颜色 ，可以在下方看到标记点调整前后的AB、Sat、Hue、RGB值的变化及LUT/Preview中的颜色变化；



图2-6-5

3.拖动Adjust Sat，此时 LUT中被标记的颜色会联动相邻颜色一起变化，如图2-6-6中（a）所示；若只想改变被标记的颜色，其他颜色位置保持不动，可以右键单击不想动的颜色，将圆点变成方块后，即可锁住对应颜色的位置，如图2-6-6中（b）所示，拖动Adjust Sat，此时LUT中只有被标记的颜色会发生变化；

File Image Options  



(a)

RKISP 3DLutTool v1.0.0  

File Image Options  



(b)  

图2-6-6  

4.After&Before ：查看调整前后的图像;  

Reset LUT：还原LUT默认值；

5.Image： 支持图像左右旋转、垂直/水平翻转变换及保存调整后的图像，如图2-6-7所示；



图2-6-7

6.Options：支持LUT的显示设置，可以调整标记点的大小及线宽，如图2-6-8所示。



图2-6-8

### 2.7 3A分析工具



图2-7-1

点击Connect连接rkaiq\_tool\_server，打开RKISP 3AAnalyzerTool，主界面如图2-7-1所示，修改URL地址，勾选Open 打开预览，目前支持获取AE、AWB模块的统计数据；

TimerSet：调整获取统计数据的间隔；

reverse color：改变预览界面统计数据显示的颜色；



图2-7-2



图2-7-3

## 3 快速入门

### 3.1 调试环境准备

以下两个小节将分别介绍调试Linux和Android平台所需要进行的准备工作：

#### 3.1.1 Android系统平台

##### 3.1.1.1 RK356X & RK3588 & RK3562

对于可以使用有线网络进行连接的设备:

1. 将设备使用网线连接至路由器  

2. 使用ifconfig命令查看设备的IP地址  

3. PC也连接至同一路由器（有线、无线均可）  

4. 查看PC的IP地址，并在PC或设备端的命令行中使用ping确认网络通路正常

### 对于无法使用有线网络进行连接的设备（平板电脑等）:

1. PC与EVB用USB线连接(同ADB一个口)  

2. 打开电源，进入系统  

3. 打开Settings  

4. 进入Network&internet  

5. 进入Hotspot&tethering  

6. 打开USB tethering  

7. adb shell进入设备端  

8. 执行ifconfig usb0 查看IP地址  

9. 在PC或设备端的命令行中使用ping确认网络通路正常

编译rkaiq\_tool\_server（暂时只有RK3562平台支持，其他版本可以直接从工具下载链接中获取）

源码在SDK中存放的路径：   

external/camera\_engine\_rkaiq/rkaiq\_tool\_server   

编译方法：   

cd external/camera_engine_rkaiq/rkaiq_tool_server && mm -j8

bin生成路径：   

out/target/product/rk3562\_t/vendor/bin

运行rkaiq\_tool\_server所需要执行的操作（若所需服务应用和其他依赖的文件已存在设备端相应路径下，则直接运行rkaiq\_tool\_server即可）:

1. 在SDK中编译获取rkaiq\_tool\_server, 或直接从工具下载链接中获取  

2. 固件必须是user-debug版本  

3. 将android.hardware.camera.provider@2.4-service.rc文件推入板端/vendor/etc/init/路  

径下  

4. 进入/vendor/etc/init/路径，执行修改权限命令：chmod 644  

android.hardware.camera.provider@2.4-service.rc  

5. 将rkaiq\_tool\_server推入板端/vendor/bin/路径下  

6. 进入/vendor/bin/路径，执行修改权限命令：chmod 755 rkaiq\_tool\_server  

7. 执行刷新缓存命令：sync  

8. 重启设备  

9. 执行命令：setenforce 0  

10. 打开相机apk  

11. 运行rkaiq\_tool\_server

### ADB操作示例:

#以下命令在PC端的cmd中运行   

adb root   

adb remount   

adb push android.hardware.camera.provider@2.4-service.rc /vendor/etc/init/   

adb push rkaiq\_tool\_server /vendor/bin/   

adb shell   

# 以下命令是在adb shell终端中执行   

```
chmod 644 /vendor/etc/init/android.hardware.camera.provider@2.4-service.rc
chmod 755 /vendor/bin/rkaiq_tool_server
```

sync   

reboot   

# 重启后, 再次进入adb shell   

# 关闭SELinux   

setenforce 0   

# 先手动运行相机apk   

# 然后运行tool\_server   

/vendor/bin/rkaiq\_tool\_server &

### 示例：

如果出现崩溃、卡死、在线调试失效、无法预览等异常问题，也请按如下步骤尝试重新连接工具

```shell
source /vendor/etc/camera/reset_camera.sh
# 运行相机apk
/vendor/bin/rkaiq_tool_server &
```

#### 3.1.2 Linux系统平台

##### 3.1.2.1 RK356X & RK3588 & RV1106

对于可以使用有线网络进行连接的设备:

1. 将设备使用网线连接至路由器  

2. 使用ifconfig命令查看设备的IP地址  

3. PC也连接至同一路由器（有线、无线均可）  

4. 查看PC的IP地址，并在PC或设备端的命令行中使用ping确认网络通路正常

### 对于无法使用有线网络进行连接的设备:

1. 尝试开启RNDIS服务  

2. 使用ifconfig命令查看设备的IP地址  

4. 在PC或设备端的命令行中使用ping确认网络通路正常

运行rkaiq\_tool\_server所需要执行的操作（若所需服务应用和其他依赖的文件已存在设备端相应路径下，则直接运行rkaiq\_tool\_server即可）:

1. 在SDK中编译获取rkaiq\_tool\_server和librkmedia.so  

2. 将librkmedia.so文件推入板端/data/路径下  

3. 进入/data/路径，执行修改权限命令：chmod 777 librkmedia.so  

4. 将rkaiq\_tool\_server文件推入板端/data/路径下  

5. 进入/data/路径，执行修改权限命令：chmod 777 rkaiq\_tool\_server  

6. 执行刷新缓存命令：sync  

7. 重启设备  

8. 运行相机应用  

9. 运行rkaiq\_tool\_server

### ADB示例操作:

#以下命令在PC端的cmd中运行  

adb root  

adb remount  

adb push librkmedia.so /data/  

adb push rkaiq\_tool\_server /data/  

adb shell  

# 以下命令是在adb shell终端中执行  

chmod 777 /data/rkaiq_tool_server

sync  

reboot  

# 重启后, 再次进入adb shell  

# 先运行相机应用  

# 然后运行rkaiq\_tool\_server  

/data/rkaiq\_tool\_server &

### 3.2 ToolServer参数使用说明

### 这里简单描述一下rkaiq\_tool\_server的参数功能和配置方法：

-d: sensor选择，设备中存在多个sensor需要进行调试时，可以使用0/1/2等设备号来选择使用哪一颗  

sensor，默认值为0，具体设备号的查询方法参考以下描述：  

media-ctl -p -d /dev/mediaX (X=0/1/2/3...) 输出会有拓扑结构，里面的带sensor名字  

的节点  

类似这样的"m01\_b\_ov8858 2-0036" ，m01 --&gt; mNN, NN是2位数的sensor index  

-d 1, 1 即对应上面的NN, 少于2位不用前面补0

-s: 指定YUV采集用的video节点，默认值会自动搜索iqtool采集节点，也可以手动配置为mainPath或selfPath

-r: RTSP推流功能开关，0为关闭，1为开启，默认值为0，开启后可以在CaptureTool中使用Start RTSP功能

-i: IQ文件读取路径，若路径有改动，应同步修改此处的路径，-r参数为0时可以忽略

-w/-h: 配置RTSP视频流预览输出分辨率，该分辨率会基于ISP输出尺寸进行缩放以满足要求，默认值为1920/1080

-n: 配置在线采集连续Raw使用的缓存数, 默认值为4, 需要采集大量连续Raw图时建议加大该参数的配置

-f: 配置离线帧功能的发送帧率, 默认值为10帧

### 3.3 选择平台&配置网络地址

1. 打开RKISP Tuner，将会显示初始配置界面，如图3-2-1所示；



图3-3-1

2. 选择相应的芯片平台和AIQ版本，AIQ版本可以在板端通过以下命令查询，so文件的路径可能会有变化，应注意修改

strings /oem/usr/lib/librkaiq.so |grep "AIQ v"

4. 点击OK按钮，将会加载对应平台的调试界面，如3-2-2所示；



图3-3-2

### 3.4 新建Sensor配置并生成基础IQ文件

1. 点击菜单栏"File" - "New"按钮，打开生成IQ文件页面;



图3-4-1



图3-4-2  

2. 点击Sensor列表右侧的"New"按钮，打开Sensor配置页面



图3-4-3

3. Sensor配置填写完成后，点击"File" - "Export To Sensor List"按钮



图3-4-4

4. 填写保存的Sensor型号，点击"OK"按钮，保存Sensor配置



图3-4-5  

5. 关闭配置页面，在生成IQ文件页面的Sensor列表中即可看到新的Sensor型号



图3-4-6  

6. 选中该Sensor，点击"Generate IQ File"按钮，生成IQ文件

### 3.5 加载、保存参数和新建场景参数



图3-5-1  

1. 点击菜单栏"File" - "Open..."按钮，选择想要加载的IQ参数文件;



图3-5-2  

2. 在弹出的Scene Selection界面中，会显示IQ参数文件内的各组场景名称，选择想要进行调试的场景，点击OK



图3-5-3



图3-5-4



图3-5-5

### 3.6 导入或修改Sensor Infomation参数



图3-6-1

1. 参考上一小节中的步骤，加载一份IQ参数文件；

2. 点击菜单栏"Tuning" - "Edit Sensor Information"按钮，打开 Sensor Info配置界面；



图3-6-2

3. 点击菜单"File" - “Import From Sensor List”按钮，打开导入界面



图3-6-3

4. 选择想要导入的Sensor配置，如下图



图3-6-4

5. 点击“OK”按钮，导入配置参数；

6. 关闭"Sensor Information"界面即可；

### 3.7 使用Capture Tool采集Raw/YUV图

#### 3.7.1 离线抓取Raw图

1. 点击菜单栏"Tools" - "RK Capture Tool"按钮，打开抓图工具；



图3-7-1-1

2. 确认设备IP地址填写到正确，点击"Device Status"按钮，若Tuner与rkaiq\_tool\_server连接正常则 会显示"Device is Ready"



图3-7-1-2

3. 点击Start RTSP Streaming打开相机并开启RTSP视频流（可选）

1. Android平台：

2. Linux平台：

4. 用户应在Sensor下拉框中的选择该项目需要Tuning的Sensor；



图3-7-1-3

5. 选择正确的分辨率、光源和模块名，便于后续使用时区分；

6. 配置增益、曝光时间和拍摄张数等参数；

7. 点击Start Manual Capture按钮；

8. 拍摄到的raw图会在右侧的Raw Preview & Statistics界面中显示；

9. 下方显示了该raw图对应的直方图信息、最大/最小/均值亮度、全局白平衡增益等；

10. Raw图默认存放在./raw\_capture/模块名/下；



图3-7-1-4 拍摄Gain=5x ExpTime=0.01s 单帧Raw图

#### 3.7.2 在线抓取YUV图

1. 打开相机应用，确保设备端预览出图正常

2. 运行ToolServer，工具端填写IP地址后连接设备

3. 切换至Online Capture标签页，在Sensor Name内填写名称，该名称会成为YUV文件名的前缀

4. 需要拍摄连续帧的情况，在Frame Num内配置需要拍摄的帧数

5. 点击Capture YUV，右侧预览会显示采集到的YUV图像，文件将存放在raw\_capture/yuv/下，如图3-7-2-1所示



图3-7-2-1

#### 3.7.3 在线抓取Raw图

1. 打开相机应用，确保设备端预览出图正常

2. 运行ToolServer，工具端填写IP地址后连接设备

3. 切换至Online Capture标签页，在Sensor Name内填写名称，该名称会成为Raw文件名的前缀

4. 需要拍摄连续帧的情况，在Frame Num内配置需要拍摄的帧数

5. 点击Capture Raw，右侧预览会显示采集到的Raw图像，文件将存放在raw\_capture/下，如图3-7-3-1所示



图3-7-3-1

### 关于在线采集Raw连续帧的最大连续帧数

最大连续帧数取决于申请的缓存bufer数，该参数可以通过ToolServer的-n参数配置，bufer数越大，一次性能拍摄的连续帧越多，在bufer数目小于拍摄帧数时，可能存在丢帧现象。

允许配置的bufer数量还取决于内核分配的缓存数量和内存大小，内核部分可以参考如下修改进行配置

```diff
dif --git a/include/media/videobuf2-core.h b/include/media/videobuf2-core.h
index 3f4f171..ee359c5 100644
--- a/include/media/videobuf2-core.h
+++ b/include/media/videobuf2-core.h
@@ -19,7 +19,7 @@
#include <linux/bitops.h>
#include <media/media-request.h>
-#define VB2_MAX_FRAME (64)
+#define VB2_MAX_FRAME (128)
#define VB2_MAX_PLANES (8)
/**
dif --git a/include/uapi/linux/videodev2.h b/include/uapi/linux/videodev2.h
index d900af7..592fccc 100644
--- a/include/uapi/linux/videodev2.h
+++ b/include/uapi/linux/videodev2.h
@@ -70,7 +70,7 @@
Common stuf for both V4L1 and V4L2
Moved from videodev.h
*/
-#define VIDEO_MAX_FRAME 64
+#define VIDEO_MAX_FRAME 128
#define VIDEO_MAX_PLANES 8
```

## 4 标定流程说明

各模块的标定工作主要可以分为三个部分：

拍摄标定图：根据各模块的需求，用合适的曝光拍摄标定板或场景的raw图；

计算标定参数：导入raw图，计算标定参数，个别模块可以根据需要微调一些参数；

确认效果并保存参数：根据各模块的标准，判断标定参数是否正确；

### 4.1 拍摄raw图

参考3.6小节的操作步骤即可

### 4.2 BLC标定

#### 4.2.1 BLC标定基本原理

RAW = Sensor Input - Optical Black Level

另外，考虑到sensor输出时的信噪比，一般Sensor输出时又会垫上一个基底Pedestal，此时的输出为

RAW = Sensor Input - Optical Black Level + Pedestal

由于不同sensor的功能配置不同，对于ISP的BLC模块来说，只需要在全黑的情况下采集出RAW数据即可得到最终的BLC校正值。

这里的校正值主要受到增益和温度影响，因此需要在不同ISO下分别进行标定。由于BLC是一个偏移量，其他模块在标定时都需要扣除该偏移量，否则无法得到正确的标定参数。

RV1106平台：该平台为了在Bayer2D、Bayer3D降噪时保留更多暗部信息，BLC模块增加了Sensor OB配置，也就是上面提到的Pedestal，有的厂商支持在驱动序列中配置，有的则是固定值，可以查询DataSheet或驱动代码确认，实在不好确定该值的情况，可以使用4.2.4小节中的参考值或者使用Gain=1x计算得到的各通道的BLC均值

#### 4.2.2 BLC标定Raw图拍摄要求

1. 拍摄时遮黑镜头，确保没有任何光线进入；

2. 拍摄需要遍历Gain=1x、2x、4x、8x、16x...Max（若驱动最大Gain支持到40x，则Max=32）；

3. 曝光时间并不影响BLC标定，可以统一10ms；

#### 4.2.3 BLC标定Raw图拍摄方法

1. 打开RK Capture Tool，参考第3.1和3.2小节的说明，连接设备，光源名选择unknow（无光），模块名称选择BLC；

2. 将设备或模组置于无光环境下，并使用黑布、镜头盖等将镜头盖紧；

3. 在Manual Exposure页面中勾选Step和2^n，根据Gain Range配置Gain Begin=1.0 和GainEnd=Max ，ExpTime=0.010 ；

4. 点击Start Manual Capture 会按照2的N次方步长拍摄Raw图；

5. 拍摄到的Raw图会显示在右侧，通过切换下拉框选择要查看的图像；



图4-2-3-1

#### 4.2.4 BLC标定方法



图4-2-4-1 BLC标定结果

1. 打开Calibration Tool，点击界面左上角的Edit Options按钮，打开配置界面，输入raw图的尺寸、位宽和bayer顺序；

2. 选择BLC标签页，点击下方的Load Raw Files按钮，选择存放Raw图的文件夹；

3. 导入的Raw图会显示在右侧的列表中；

4. 点击Calibrate按钮，开始标定计算；

1. RV1106平台： 线性模式标定需要先填写Sensor OB值，以下列出了一些厂商常用的OB值参考


| 厂商 | OB参考值 |
| --- | --- |
| GalaxyCore(gc) | 256 |
| OmniVision(ov/os) | 256 |
| Samsung(s5k) | 256 |
| SmartSens(sc) | 256 |
| Sony(imx) | 200或256(驱动序列可配， 建议参考DataSheet和驱动代码，以实际为) |

5. 标定得到的各通道暗电流值随ISO变化的曲线会显示在上方的坐标轴中；  

6. 标定得到的BLC值会显示在表格中，点击Save保存参数；

### 注意事项：

1. 若设备本身有电源灯、状态等指示灯，应注意是否会有漏光；

2. 错误的BLC值会影响后续所有模块的标定结果，请务必确保该BLC结果正确后再进行后续模块的标定工作；

### 4.3 LSC 标定

#### 4.3.1 LSC标定基本原理

Lens Shading一般被称为暗角或渐晕效应，可细分为Luma Shading（亮度均匀性）和ColorShading（色彩均匀性）两种。

$$

c o s ^ &#123; 4 &#125; \theta

$$

的衰减规律。

Color Shading的成因则相对复杂一些。不同类型的IR-Cut（红外截止滤光片）的透过率各有不同，且当入射角θ变化时不同波段的透过率也会有变化，所以会出现中心和四周颜色不统一的现象。另外一方面则是Micro Lens（微透镜）的CRA（主光线入射角）与镜头的CRA不匹配也会导致Color Shading现象。

#### 4.3.2 LSC标定Raw图拍摄要求

1. 拍摄时使用毛玻璃、均光片覆盖镜头（或使用DNP灯箱、积分球等设备）；

2. 在标准光源的灯箱中拍摄，需要拍摄7个光源：HZ、A、CWF、TL84、D50、D65、D75；

3. 防止交流光源产生Flicker，建议使用10ms的整数倍配置曝光时间；

4. Raw图最大亮度大约在200（8bit）左右，最小亮度应明显大于上一节标定的黑电平值；

5. 推荐使用如下图的均光片；



#### 4.3.3 LSC标定Raw图拍摄方法

1. 打开RK Capture Tool，参考第3.1和3.2小节的说明，连接设备，模块名称选择LSC；

2. 将模组置于灯箱内，切换至HZ光，将均光片紧贴镜头；

3. 光源名选择HZ，在Auto Exposure页面中勾选Search Exposure By Max Luma(8bit)，勾选Anti-Flicker(50hz)，右侧的目标最大亮度配置为200±10%，Frame Number = 1；

4. 点击Start Auto Capture，拍摄Raw图，期间工具会自动挑选合适的曝光直到满足预设的最大亮度；

5. 切换光源至A光，修改光源名为A，重复步骤4，直至所有光源拍摄完成；



图4-3-3-1

#### 4.3.4 LSC标定步骤

1. 打开Calibration Tool，点击界面左上角的Edit Options按钮，打开配置界面，输入Raw图的尺寸、位宽和bayer顺序；

2. 选择LSC标签页，点击下方的Load Raw Files按钮，导入所有raw图；

3. 导入的Raw图会显示在上面的窗口中，切换下拉列表可以查看不同光源的图像；

4. 修改Light Fall of 为100%；

5. 点击Calibrate按钮，开始标定计算；

6. 标定完成后可以在result页面查看各光源的Raw图应用校正参数后的图像；

7. 点击Save保存参数；

8. 修改Light Fall of 为70%，重复步骤5\~7；



图4-3-3-2  



图4-3-3-3  

注意事项：

1. 拍摄时有可能出现因环境光过亮或过暗，搜索不到合适的曝光参数的情况，此时应根据情况，可以参考以下列出的解决方法：

调整光源亮度；

使用减光片；

调整镜头朝向；

修改界面上Gain Range或Exp Range的范围；

调整自动曝光的最大亮度或阈值；

改用手动曝光（挑选的最低标准是最小亮度明显大于上一节标定的黑电平值）；

### 4.4. AWB标定

#### 4.4.1 AWB标定内容

主要是标定Raw在XY、UV、YUV的白点条件,单纯色算法参A数及标准光源下的白平衡增益

#### 4.4.2 AWB标定Raw图拍摄步骤与要求

Raw图采集时需要准备环境如下：

1. 设备：x-rite 24色卡，灯箱(包含D75、D65、D50、TL84、CWF、A、HZ)

2. 调整曝光参数,使色中最亮的白色块的最大值为[150-240]，在这个范围内越亮越好（如果要和后面的CCM共用raw图，图要暗一些）

3. 色卡占画面1/9以上

### Raw图拍摄方法：

1. 打开RK Capture Tool，参考第3.1和3.2小节的说明，连接设备，模块名称选择CCM\_AWB；

2. 将设备和色卡置于灯箱内，调整设备和色卡的位置，令色卡在画面中心位置，尽可能拍摄大一些，调整好后尽量不要移动设备；

3. 打开灯箱，光源切换至HZ光；



图4-4-2-1

1. 点击Start Auto Capture，拍摄Raw图，期间工具会自动挑选合适的曝光直到满足预设的最大亮度；

2. 切换光源至A光，修改光源名为A，重复步骤d，直至所有光源拍摄完成；

依次在A,CWF,D50，D65，D75，HZ,TL84光源下拍摄x-rite 24色卡，解完马赛克的示意图如下：



图4-4-2-2

#### 4.4.3 AWB标定工具的界面说明

1. 标定的时候主要是调整UV、XY域的白点边界，及YUV域的TH值



图4-4-3-1


| BLC LSC | AWB CCM | BayerNR YNR FEC &amp; LDCH | Simulator |
| --- | --- | --- | --- |
|  |  |  |  |
| Load Raw Files | WPC (UV Domain &amp; XY Domain) WPC (YUV Domain) YUV域白点条件 Light Names |  |  |
| Find Chart Calibrate | uo U1 |  |  |
| Save |  |  |  |
| Apply To Device |  |  |  |
| Draw WPC From IQ Param |  |  |  |
|  | AWB Simuation |  |  |
| del tag | Light Names Th0 |  |  |

图4-4-3-2

2. UV、XY域调整白点区间操作说明

a) 在坐标系中用鼠标拖动白点条件的四角以调整位置和白点区间大小

b) 在坐标系中鼠标拖动空白区域，可以拖动整个白点区间

c) 使用滚轮放大缩小查看

4. 单击“AWB主界面”上的“ AWB Simulaton”按钮将弹出下面界面。AWB Simulaton 用于对raw图进行白点检测，统计白点增益及个数

3. Exclude WPC Range面板可用于增加非白点区间和额外光源白点区间。



图4-4-3-3

a) LoadImage 导入Raw图后，如下所示，会打印出白点信息。不同光源的白点用不同的颜色显示出来。中框、大框的白点数量 RGain累加和 BGain累加和 会显示在WP Number、RGain、BGain三个文本框里




| Stats of Point Track Pos: 93,145 |  |  |  |  |
| --- | --- | --- | --- | --- |
| R: | 126 | G: 242 U: 116 | B: | 177 |
| Y: | 200 | V: 75 |  |  |
| X: | 129 | 7 |  |  |
| RGain: |  | Y: BGain: | 1.3653 |  |
| Light | 1.91683 |  |  |  |
| A | U_Interp | Th_Interp 4080 | Distance |  |
| CWF | 181 189 | 64 |  | 11 |
| D50 | 192 | 64 |  | 162 64 |
| D65 | 193 | 64 |  | 65 |
| D75 | 193 | 4080 |  | 56 |
| H | 173 | 64 |  | 59 |
|  |  |  |  |  |
| TL84 | 188 | 64 |  | 62 |


| ☑ A1l | WP Number | RGain | BGain |
| --- | --- | --- | --- |
| ☑A | 83, 507 | 1.197, 1.227 | 2.829, 2.967 |
| ☑ CWF | 5, 5 | 1.621, 1.621 | 2.408, 2.408 |
| ☑ D50 | 3, 3 | 1.410, 1.410 | 1.644, 1.644 |
| ☑ D65 | 195, 195 | 1.899, 1.899 |  |
| D75 |  |  | 1.494, 1.494 |
|  | 42562, 42648 | 2.006, 2.006 | 1.295, 1.295 |
| ☑ | 0, 0 | 0.000, 0.000 | 0.000, 0.000 |
| TL84 | 1, 3 | 1.332, 1.351 | 2.329, 2.394 |

图4-4-3-4





图4-4-3-5  



图4-4-3-6

#### 4.4.4 AWB标定步骤

1. 打开Calibration Tool，点击界面左上角的Edit Options按钮，打开配置界面，输入Raw图的尺寸、位宽和bayer顺序；

2. AWB标定时需完成BLC和LSC的标定；

3. 单击Load Raw Files导入A,CWF,D50，D65，D75，HZ,TL84下的raw图（推荐标定这七个光源的raw图）；

4. 单击Find Chart , 打开色块搜索界面，若导入的图像是镜像的，可以通过右侧Flip功能区进行翻转，目前支持水平方向和垂直方向翻转；

RK IQ Tools



图4-4-4-1

a) 拖动左上、右上、左下、右下的红框中心圆点来调整采样区域，尽量确保采样区域在各个色块的中心，如图4-4-4-1所示

b) 单击FindChart 会批量识别所有光源的色卡色块，如图4-4-4-2所示



图4-4-4-2

RK IQ Tools



图4-4-4-3



图4-4-4-4

d) 单击Save 完成识别



图4-4-4-5


| WPC (UV Domain &amp; XY Domain)  WPC (YUV Domain) |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Light NamesA | uo50 | U154 | U270 | U378 | U4110 | U5142 |
| CWF | 50 | 54 | 70 | 78 | 110 | 142 |
| D50 | 50 | 54 | 70 | 78 | 110 | 142 |
| D65 | 50 | 54 | 70 | 78 | 110 | 142 |
| D75 | 50 | 54 | 70 | 78 | 110 | 142 |
| HZ | 50 | 54 | 70 | 78 | 110 | 142 |
| TL84 | 50 | 54 | 70 | 78 | 110 | 142 |
| Light NamesA | Th00.2 | Th10.2 | Th20.2 | Th30.76 | Th41 | Th54 |
| CWF | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D50 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D65 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| HZ | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |

图4-4-4-6  

6. 单击AWB Simulaton ,依次导入A,CWF,D50，D65，D75，HZ,TL84下的raw图查看白点检测的准确性；  

7. 修改UV域或XY域的框或YUV的TH使各个光源下色卡的白点检测更准确；  

8. 单击Save ，在AWB Simulaton界面点击Run Simulator，查看当前导入光源图像的白点检测结果；  

9. 重复步骤6\~步骤8，直到各个光源的白点检测都比较合理。

注意事项：

① 调整边界尽量使白点（标为19、20、21、22块的点）在框里面，非白点在框外（一般做不到）

② 所有黑体轨迹上光源的中框围成的区间在x方向连续（三种线型表示三个大小的框，当前版本没有小框）

错误示范（大框的区间是紧连的，但是中框之间有间隔，如下箭头所示）：



正确示范：



③ a和hz光源在XY域的Y方向上可以紧凑一些，d50 d65XY域的Y方向上可以放宽一些

④ 色温差不多的光源围成的中、大框区间在y方向上连续（CWF和TL84）

⑤ 所有光源在UV域围成的区间没有断开的部分

⑥ 不同光源边界可以重叠，但不要同时在XY和UV空间都重叠

⑦ 参考XY空间划分UV空间，以排除非白点

如圈出来的D75光源第7块落在hz范围内，将会被识别为白点



重新调整后，D75光源第7块在xy和uv空间上不在同一光源内，不会被识别为白点





⑧ 当非白点落在XY和UV的白点区间里，还可以通过调小TH排除，或者增加非白点区间排除。

⑨ 当白点落在XY和UV的白点区间里，但仍然不是白点时，可能是因为超过亮度范围被排除了，或者落在非白点区间内，或者是因为小于TH 而没有落在YUV域的白点区间里

#### 4.4.5. AWB标定结果示例

最终白点条件：



图4-4-5-1

各光源白点检测结果为：



图4-4-5-1 A



图4-4-5-2 CWF  



图4-4-5-3 D50



图4-4-5-4 D65  



图4-4-5-5 D75



图4-4-5-6 HZ  



图4-4-5-7 TL84

### 4.5 CCM标定

#### 4.5.1 CCM模块Raw图拍摄要求

参考4.4节AWB模块，一般情况下CCM与AWB共同使用同一组Raw图，由于Gamma模块的影响需要重新拍摄的情况，请参考4.5.2小节第12点；

#### 4.5.2 CCM标定步骤

RK IQ Tools

1. 打开Calibration Tool，选择CCM标签页，点击下方的Load Raw Files按钮，导入所有Raw图， 导入的Raw图会显示在下方的列表中；




|  | 1. Load Raw Files | del | tag A |
| --- | --- | --- | --- |
| 2. | Find Chart |  | rkisp_ov5695_A_2592_1944_10bpp_1.0x_0.026s_Icg_normL_single_174206110 |
| 3. | Calibrate | rkisp_ov5695_CWF_2592_1944_10bpp_3.6x_0.100s_lcg_normL_single_174139505 |  |
| 4. |  | x x | rkisp_ov5695_D50_2592_1944_10bpp_1.0x_0.030s_lcg_normL_single_175019432 |
|  | Save | rkisp_ov5695_D65_2592_1944_10bpp_1.0x_0.100s_lcg_normL_single_174853194 |  |
|  | Apply to Device | x | rkisp_ov5695_D75_2592_1944_10bpp_1.0x_0.100s_lcg_normL_single_174119634 |

图4-5-2-1

2. 点击Find Chart，打开色块搜索界面；



图4-5-2-2

4. 拖动左上、右上、左下、右下的红框中心圆点来调整采样区域，尽量确保采样区域在各个色块的中心；

5. 点击Find Chart开始统计色块值，统计区域会被标记为绿色；

6. 用户应检查下拉列表中的各个光源，检查统计区域是否都正确；

RK IQ Tools



图4-5-2-3

6. 搜索完成后点击Save按钮保存退出；

7. 设置饱和度为100%，如图4-5-2-4所示；



图4-5-2-4

8. 点击Calibrate按钮，开始标定计算，该模块耗时较长，大约需要20s左右；

9. 标定完成后，计算结果显示在result页面中；

10. 点击Save按钮保存结果；

11. 修改饱和度为74%，重复步骤8\~10；



图4-5-2-5

1. 若确实存在过亮或过饱和的问题，应当重新拍摄该光源的色卡图，降低曝光量，重新进行一次标定；

2. 若色块亮度都较为正常，有可能导致问题的原因有：BLC参数异常、LSC参数异常、镜头漏光（红外光)等;

13. 具体调试方法请参考Rockchip\_Color\_Optimization\_Guide；

### 4.6 NR标定

NR模块Raw图拍摄要求：  

在标准光源的灯箱中拍摄，建议使用可调亮度的直流光源；  

必须使用灰度渐变卡，如图4-6-1；  

曝光需要遍历Gain=1x,2x,4x,8x,16x...Max（若驱动最大Gain支持到40x，则Max=32）；  

每一个Gain下都需要拍摄四张Raw图，分别是高光-叠帧、高光-单帧、低光-叠帧、低光单帧；  

高光和低光可以调节曝光时间或环境光亮度来区分，叠帧和单帧则由工具自动完成；  

低光拍摄要求：图4-6-1中最亮块的像素值达到30（要保证能够看清每个色块的边界，若不满足可以适当高  

点），最暗块的像素值达到BLC值附近（以最亮块的像素值刚好达到30时此时的最暗块的像素值为准）；  

高光拍摄要求：图4-6-1中最亮块的像素值达到255，最暗块的像素值一般在60-70左右（以最亮块的像素值  

刚好达到255时此时的最暗块的像素值为准）；  

最暗块和最亮块的像素值可以通过RK Capture Tool 中YNR Capture 的ROI统计功能判断；  

采用DCG模式的HDR Sensor需要分别拍摄LCG和HCG两组Raw图；



图4-6-1

#### 4.6.1 Raw图拍摄方法

1. 打开RK Capture Tool，参考第3.1和3.2小节的说明，连接设备；

2. 将设备或模组置于灯箱内，并将渐变卡贴在灯箱背板；

3. 调整设备位置，令渐变卡移动至画面中心，并尽量靠近拍的大一些；

4. 打开灯箱，光源切换至TL84或CWF；

5. 修改界面中的光源名为TL84或CWF，模块名为NR\_Normal；

6. 假设例子中的sensor支持Gain=1-24，则需要拍摄1x 2x 4x 8x 16x；

7. 选择YNR Capture 页面，首先拍摄一张raw图，在右侧预览界面中右键选择Draw ROI，分别依次框选预览图中的最亮块和最暗块（后面将以黑块和白块表示），可以通过双击矩形框内部来切换要

重绘的矩形框，固定图像位置及矩形框位置，进行NR拍摄，如图4-6-1-1所示；



图4-6-1-1

## 8. 拍摄低光：

灯箱亮度调节至大约800lux；

将界面中Gain Range的值修改为1.0 - 1.0，Exp Range不做修改；

勾选Multi-Frame和Low-Light；

选择YNR Capture 页面，填写黑白两个矩形框的阈值；

设定Frame Number=32；



图4-6-1-2

a)点击Start YNR Capture按钮开始拍摄，工具下方log 框内会打印两个矩形框当前平均像素值，以及对应的曝光参数；

meanValue[0]：黑块当前平均像素值；

meanValue[1]：白块当前平均像素值；

blackTarget：所填写的Black Block Mean Luma阈值；

whiteTarget：所填写的White Block Mean Luma阈值；



图4-6-1-3  



图4-6-1-4

c) 找到满足条件的阈值后，重新点击Start YNR Capture按钮开始拍摄，拍摄完成得到带Multiple和Single后缀的Raw图各一张，如图4-6-1-5所示；



图4-6-1-5

## 9. 拍摄高光：

灯箱亮度调节至大约800lux；  

将界面中Gain Range的值修改为1.0 - 1.0，Exp Range不做修改；  

勾选Multi-Frame和High-Light；  

勾选Multi-Frame和Low-Light；  

选择YNR Capture 页面，填写黑白两个矩形框的阈值  

Black Block Mean Luma:表示黑块要达到的目标值，初次填写为60；  

White Block Mean Luma：表示白块要达到的目标值，固定为255；  

设定FrameNumber=32；



图4-6-6

a)点击Start YNR Capture按钮开始拍摄，工具下方log 框内会打印两个矩形框当前平均像素值，以及对应的曝光参数；

meanValue[0]：黑块当前平均像素值；

meanValue[1]：白块当前平均像素值；

blackTarget：所填写的Black Block Mean Luma阈值；

whiteTarget：所填写的White Block Mean Luma阈值；

b)当曝光打满，最亮块的亮度仍然到不了255时，如图4-6-7所示，需要手动将灯箱亮度调亮，再点击StartYNR Capture重新拍摄，满足条件后得到带Multiple和Single后缀的Raw图各一张，如图4-6-8所示；



图4-6-7



图4-6-1-8

10. 修改Gain Range值为2x，重复步骤8、9，直到所有Gain拍摄完成；

11. 由于Gain会不断增大，黑块的阈值会受到噪声影响变大，可以根据打印的log适当调整黑块的阈值；

#### 4.6.2 NR标定步骤

GIC & BayerNR和YNR & MFNR模块共用同一组Raw图：

1. 打开Calibration Tool，点击界面左上角的Edit Options按钮，打开配置界面，输入Raw图的尺寸、位宽和bayer顺序；

2. 选择GIC & Bayer NR页面，点击上方的Load Raw Files按钮，导入所有Raw图，导入的Raw图会显示在下方的列表中；

3. 点击Find ROI 框出渐变卡的位置，如图4-6-2-1所示，要保证矩形框要在色块内；



图4-6-2-1

4. 点击Calibrate按钮，计算标定参数；

5. 标定完成后得到的BayerNR噪声曲线将会显示在右侧窗口中,如图4-6-2-2所示；



图4-6-2-2

6. 点击Save按钮保存参数；

7. 选择YNR&MFNR标签页，点击上方的Load Raw Files按钮，导入所有Raw图，导入的Raw图会显示在下方的列表中；

8. 点击Calculate YUV按钮，Raw图将会通过仿真器处理为YUV图；

9. 点击Calibrate按钮，计算标定参数，在Calibraete 前勾选YNRCurve Print 可以保存标定参数及各个iso下的采样点；

10. 标定完成后得到的YNR噪声曲线将会显示在右侧窗口中，如图4-6-2-3所示；

11. 点击Save按钮保存参数；



图4-6-2-3

### 注意事项：

若标定出的曲线与图4-6-2-3中所示的形状相差甚远，表明高光或低光亮度不对，可以通过曲线异常的位置来判断：

左侧形状错误则是低光亮度不合适；

右侧形状错误则是高光亮度不合适；

拍摄Raw图时请务必选择正确的光源，否则Calculate YUV的结果可能会不正确，若由于灯箱可调光源的最低亮度已无法满足拍摄，建议使用减光片等不影响颜色的滤镜来辅助拍摄；

### 4.7 FEC/LDCH

#### 4.7.1 FEC/LDCH标定图拍摄规范

拍摄棋盘格，棋盘格尺寸支持可变，标定图仅支持jpg、bmp、png格式；

棋盘格的拍摄可以分为两种模式：

方式一: 一张图像只包含一个棋盘格(精度较高，推荐使用)；

方式二: 一张图像包含n个棋盘格(为了标定方便，一般是取n=4)。

1. 拍摄前的准备

2. 拍摄时的规范

（1）适当的比例：尽量让拍摄的棋盘格图像在整个摄像头视野中面积占比在1/4至1/8之间。

（4）不同的倾斜角度：不能只拍摄与镜头平面平行的图像，要确保拍摄不同倾角的图像。

## 3、拍摄示意图：

允许采用两种方式来拍摄：

（1）方式一（推荐使用）

四张标定图，棋盘格分别占据标定图中左上、右上、左下和右下四个位置，没有具体顺序要求；









图4-7-1-1

### （2）方式二

一张标定图，左上、右上、左下和右下四个角都有棋盘格覆盖；



图4-7-1-2

#### 4.7.2 FEC/LDCH标定步骤



图4-7-2-1

1. 配置Raw Options属性中的分辨率。Bit和Bayer Pattern可以忽略。

2. 导入标定图所在的文件夹。支持jpg、bmp、png图像读取。

3. 调节标定配置参数。

a) Square Size: 棋盘格中每个格子的实际尺寸，一般为30mm或25mm。

b) Horizontal/Vertical: 棋盘格的横向(Horizontal)和纵向(Vertical)的内角点数：

注意：如何区分棋盘格的角点和内角点(见图2-5)。下图为横向12格，纵向9格的棋盘格，其中横向的角点数为13，横向的内角点数为11，以此类推。所以 Horizontal =11，Vertical = 8。



图4-7-2-2 棋盘格的角点和内角点(角点包括红色和绿色的部分, 而内角点只包括红色部分)  

c) CheckBoard Number: 每张图像中的棋盘格数量：这里可选项为1或4。

d) Level: 设置畸变校正程度等级Level，共分为256个等级，其中，Level = 0表示此时得到的映射表无校正效果(即输出图像和输入图像一样)，Level = 255表示映射表为LDCH所能达到的最大校正程度。

f) Correct Direction: 如果是生成用于FEC模块的映射表，还能设置不同的校正方向选项：①只勾选Correct X: 只校正横向，其效果和LDCH类似；②只勾选Correct Y: 只校正纵向；③Correct X和Correct Y都勾选：横向和纵向两个方向都校正。

4. 点击“Calibrate”按钮进行标定。

注意：检查工具路径下是否存在result文件夹，若不存在，需要新建一个名称为result的文件夹，放在标定工具exe文件的同级目录下。

5. 点击“Save”按钮保存标定结果。

### 注意事项

1. 棋盘格最外圈不参与计算。但拍摄标定图时，最外圈的黑白块不可被预览全部遮挡。

2. 水平方向和竖直方向上的角点数量，是排除棋盘格最外圈黑白块后，由各方向上黑白块的数量加一得到。

3. FEC默认两个方向都校正。标定时，可根据实际情况，选择需要校正的方向。

4. 存放标定图的文件夹，最好以sensor名+镜头名/焦距+分辨率命名，工具会依据此命名生成存放校正文件的文件夹。

#### 4.7.3 FEC/LDCH标定结果

1. 如果出现标定不成功的结果，一般都是由于棋盘格拍摄不清晰导致角点检测不准确或者不完整所致。所以首先应查看每张图像棋盘格内角点是否都完整准确检测出来，且完整检测的数量不能少于3张。

2. 如果标定成功，则会出现图4-7-3-1的结果，在左侧log显示框可以查看标定后的畸变参数，6个参数的意义从上至下依次为相机的中心坐标(cx、cy)、相机畸变参数(a0、a2、a3、a4)。在右侧的result选项卡可以查看每张图像的棋盘格内角点检测结果。如果出现个别检测结果不准确的情况，可以把对应的图像删除，重新进行标定，以获得更加准确的标定结果。生成的FEC和LDCH映射表保存在result目录下对应的文件夹内。



## 5 在线调试界面及功能

### 5.1 调试界面功能介绍



图5-1-1 RKISP Tuner v2主界面

如图5-1-1所示，该界面为一个典型的使用状态：加载调试界面完成，并导入IQ参数之后的界面，下面将简单介绍一下图中标记数字的UI含义及功能：

1. 模块树形结构图：顶部显示的"normal: day"为加载IQ参数时选择加载的场景名称，其中“normal”为  

主场景名称，day为细分场景名称  

2. ISP模块：一个场景内可以包含多个模块，一个模块可以包含多个调试页面  

3. 调试页面：一个模块节点可以包含多个调试页面，一个调试页面中可以包含多个调试单元  

4. 调试单元：例如该单元名称为InitExp，其中包含了5个数值型成员参数  

5. 调试单元读写按钮：提供整个单元内所有参数的在线读、写功能  

6. 自动写入功能：当其勾选时，若工具已与rkaiq\_tool\_server建立连接，则每一次参数修改都将自动发  

送至设备端并设置生效  

7. 页面/模块读写按钮：提供整个调试页面或模块的在线读、写功能  

8. 撤销/反撤销功能：支持Auto Wrtie勾选状态下写入操作的撤销功能，每次只能撤销或反撤销一个写入操  

作  

9. 搜索功能：用来搜索ISP模块的参数名并快速定位。

### 5.2 平台&网络配置功能

初次启动工具或点击菜单栏"Project" - "Network and Platform Settings"按钮时打开平台&网络配置界面，如下图所示



图5-2-1

1.Platform Setting：

选择相应的芯片平台，即会加载不同的调试界面配置文件，不同平台与配置文件的对应关系记录在config/config.ini中

2.Network Config：

配置调试设备的网络地址，端口号默认5543，非特殊需求请勿修改

点击“Connect”按钮，工具将会尝试向调试设备中的rkaiq\_tool\_server建立连接，这里请确保rkaiq\_tool\_server已正确运行

### 5.3 寄存器及算法参数调整

每个调试单元内都包含寄存器或算法参数，按照各自参数形式与取值范围不同，使用不同的控件，主要分为以下四类：

1.数值：具有一定取值范围的整型或浮点型值；

直接修改文本框的值；

使用文本框右侧的上下小箭头调整值；

使用右侧的滑动条调整值；



图5-3-1

2.布尔：取值为0或1的参数，主要是各种功能开关等；

Enable时取1，Disable时取0；

图5-3-2

3.列表：从预设的选项中取其一，主要是各种功能模式、ISO、Day/Night和LCG/HCG档位选择;



图5-3-3

4.表格：NxM的矩阵参数，矩阵元素可能是整型或浮点型，通过点击界面上的show data或Enter ArrayTable按键展开；



图5-3-4

### 5.4 Gamma参数在线调试

#### 5.4.1 Gamma可视化调试

1. 如图5-4-1-1所示，进入GammaTuningPara页面，点击页面中Gamma\_Curve参数的Edit Curve按钮，打开Gamma可视化调试界面



图5-4-1-1 Gamma界面  

2. 如图5-4-1-2所示，Gamma可视化调试界面主要包含以下几个部分的功能:

1. 曲线调节区域：用鼠标拖动红色圆点即可对曲线进行调节，在AutoWrite勾选的情况下，每次调节都会实时设置到板端；

2. Curve Coef：支持根据系数来生成Gamma曲线，注意这里修改后会自动生成对应系数的曲线，原本手动调节的曲线可能被覆盖；

3. Position Control：鼠标移动到圆点上时会将坐标更新至X和Y框内，用户可以手动单独设置该点的Y值；

4. Control Point Number：调节控制点的数量，支持四挡（49,45,24,13）调节，可以先粗调，再细调；

5. Axis Range：调节坐标轴尺度，X和Y轴都支持调节，主要用于暗区节点较为密集的区域精细调节；

6. Export/Import：支持将Gamma曲线导出为文件保存或从文件中读取Gamma曲线



图5-4-1-2 Gamma可视化调试界面

#### 5.4.2 Gamma曲线基本调试方法

界面上共有两条曲线，蓝色的是原始曲线，红色的是当前调节曲线，当指针移动至红色曲线上的圆点时，将会显示为上下箭头，此时可以拖动圆点上下移动，红色曲线则会随点的位置发生改变，如图5-4-2-1 所示。



图5-4-2-1 拖动圆点后的曲线

修改Curve Coef中的Gamma Coef为1.5并按回车确认，将会根据系数生成一条新的曲线，如图5-4-2-2所示



图5-4-2-2 使用系数生成曲线

## 6 其他辅助功能

### 6.1 IQ文件导入功能

点击菜单栏"File Transfer" - "Send File To Device"，选择要传输的IQ文件，输入设备端要存放IQ文件的路径，如图6-1-1所示，点击Send，传输成功后即可在对应路径下找到该文件。



图6-1-1 选择传输路径界面  



图6-1-2 传输成功界面

### 6.2 倒灌Raw功能使用说明

1. 点击菜单栏File - Send RAW Image To Device按钮打开倒灌Raw配置页面


| RKISP Tuner v2.0.6 for RK3588 |  |  | □ × |
| --- | --- | --- | --- |
| File Project Tuning Tools Optior Connection | hs File Transfer Help |  |  |
|  | Send File To Device Send RAW Image To Device |  |  |
| Scene Name 1 |  |  | Search Redo |
| Read Page AEC CommCtrl LinearAeCtrl HdrAeCtrl IrisCtrl | Write Page Read Module Write Module | Auto Write | Undo |

图6-2-1 打开倒灌Raw配置页面

2. 点击Add按钮加载Raw文件



图6-2-2 加载Raw图

3. 注意：这里离线帧只支持RKRaw格式（后缀为.rkraw），RKRaw格式的采集方法请参考2.3小节和3.7.2小节的描述，如果要使用普通Raw格式来倒灌仿真，可以先使用RKRaw Tool将数据格式转换为RKRaw

4. 点击Send按钮发送Raw图至设备端，同时该操作会在/tmp下生成一份配置文件



图6-2-3 发送Raw图至设备端

5. 重新启动相机应用，在检测到配置文件后会启动离线帧流程，等待倒灌Raw

6. 点击Run按钮，开始循环倒灌Raw数据

7. 此时可以在预览上看到倒灌Raw的输出画面，该状态下支持：在线调试参数读写、采集YUV图

8. 如果需要更换Raw文件，可参考以下流程：

1. 点击Stop暂停灌Raw

2. 重新Add加载Raw文件

3. 点击Send发送Raw文件

4. 点击Run开始循环倒灌Raw数据
