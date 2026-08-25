---
sidebar_position: 1
---

# Rockchip Tunning Guide ISP32-lite

## 前言

## 概述

本文旨在指导用户进行图像调优的文档。

产品版本


| 芯片名称 | ISP版本 |
| --- | --- |
| RK3562 | ISP3.2-lite |

## 读者对象

本文档（本指南）主要适用于以下工程师：

## 修订记录


| 版本号 | 修改记录 | 修改日期 | 作者 |
| --- | --- | --- | --- |
| v0.1.0 | 初版 | 2023-3-2 | ALL |

```csv
debayer_select_thed
4.8.2.4 g_filter参数
iso
debayer_gfilter_en
debayer_gfilter_offset
4.8.3 名词解释
4.9 BLC
4.9.0 ISP32-lite vs ISP32 差异点
4.9.1 功能描述
4.9.2 关键参数
4.9.2.1 Blc0TuningPara 、Blc1TuningPara
enable
ISO
R_Channel 、Gr_Channel、Gb_Channel、B_Channel
4.9.2.2 BlcObPara
enable
ISO
isp_ob_Offset
isp_ob_preDgain
4.9.3 调试步骤
4.10 AF
4.10.0 ISP32-lite vs ISP32 差异点
4.10.1 功能描述
4.10.2 关键参数
4.10.2.1 af_mode
4.10.2.2 win_h_offs/win_v_offs/win_h_size/win_v_size
4.10.2.3 video_win_h_offs/video_win_v_offs/video_win_h_size/video_win_v_size
4.10.2.4 fixed_mode/macro_mode/infinity_mode
4.10.2.5 contrast_af/video_contrast_af
4.10.2.6 laser_af
4.10.2.7 pdaf
4.10.2.8 vcmcfg
4.10.2.9 zoomfocus_tbl
4.10.2.10 zoom_meas
4.10.2.11 meascfg_tbl
4.10.3 变焦镜头调试步骤
```

### 2.1 功能简介

ISP32模块支持标准的Sensor图像数据处理，包括自动白平衡，自动曝光，Demosaic,坏点矫正及镜头阴影矫正等基本功能，也支持HDR、去雾、降噪等高级处理功能。

### 2.2 ISP功能框图



图2-1 ISP32功能框图

### 2.3 各模块简介


| 模块名称 | 描述 |
| --- | --- |
| BLC | 提供CIS相关的黑电平矫正。 |
| Degamma | 提供CIS非线性化校正 |
| DPCC | 提供对静态坏点和动态坏点的检测和校正功能。 |
| SPC | 提供对遮蔽像素(相位对焦)的校正 |
| Dgain | 提供图像全局的数字线性增益 |
| WB Gain | 白平衡校正增益 |
| MERGE | 2帧宽动态合成。 |
| Raw 3DNR | Raw域时域降噪模块 |
| DRC | 动态范围压缩 |
| LSC | 用于镜头的阴影矫正。 |
| AE Stats | 该模块输出自动曝光的统计信息，软件根据统计信息调节CIS可实现自动曝光的功能。 |
| AF | 支持图像清晰度评价信息统计，用于完成支持自动对焦功能。 |
| AWB | 该模块输出全局统计信息和区域统计信息，软件基于统计信息完成自动白平衡功能。 |
| Debayer | 将Bayer格式的Raw图像转换到RGB图像。 |
| CCM | 通过标准的3X3的矩阵和矢量偏移量可完成颜色空间的线性矫正。 |
| Gamma | 该模块根据伽马曲线分R\G\B三个通道调整亮度。 |
| Dehaze &amp;Enhance | 提供强大的去雾能力以改善雾霾场景下的视频对比度和清晰度。 |
| CSM | 通过标准的3X3的矩阵和矢量偏移量将输入(R,G,B)转换为(Y,U,V)，提供色度降采样输出YUV422给后级模块 |
| LDCH | 矫正镜头垂直方向上的畸变 |
| 3D-LUT | 9x9x9大小的3Dlut 实现复杂的颜色调整操作，比如亮度的调整，饱和度的调整。 |
| Sharp | YUV域实现图像锐度，提高图像清晰度。 |
| YNR | 针对亮度的空域去噪 |
| UVNR | 单独的彩色噪点去除。 |
| CGC | YUV色彩空间转换 |
| SCL | 图像缩放 |
|  |  |

## 3 图像质量调优总体概述

### 3.1 IPC应用图像调优概述

#### 3.1.1 线性模式图像质量调优

IPC应用场景线性模式图像调优的整个框架图如下（图3-1）所示：



图3-1 IPC应用场景线性模式图像调优流程图

在进行图像质量调优前需要开展的工作主要如下：



图 3-2 模组标定流程图



图 3-3 线性模式图像调优场景图  

线性模式ISP图像质量关注维度调试的基本流程如图 3-4所示。



图3-4 图像质量关注维度调试流程图

### 亮度维度：



图3-5 AE权重表



图3-6 静态场景示意图

----结束

### 色彩维度：

在AE调节合理的基础上面，接下来主要调节色彩相关的参数，主要涉及的模块有AWB和CCM。颜色前需要准备的环境：黑电平校正准确、LSC标定完成、AE模块参数调试合理。

步骤2：利用AWB标定用的RAW图，用工具生成对应光源对应饱和度下的CCM矩阵。

在此之前需要确认使用的gamma曲线，一般默认gamma2.2，如果对gamma有特殊需求需要先填好gamma曲线。操作界面参考如下：



图3-7 CCM标定界面

步骤3：做完步骤1、2 后我们便可以在标准灯箱里面拍摄各个光源的24色卡图片，用imatest软件测试24色卡的颜色指标。如果指标满足需求，可以初步确定标定得到的AWB参数和CCM矩阵满足需求。

AWB和CCM模块的具体调优需要参考《Rockchip\_Color\_Optimization\_Guide\_ISP32》

### ---- 结束

### 对比度维度

调整对比度前准备环境：黑电平校正正确、LSC标定完成、AE曝光调整合理、AWB和CCM参数标定合理。



图3-8 静态场景Gamma曲线影响的区域示例

步骤3：在优化完对比度相关参数的基础上，需要对整体对比度效果进行客观测试，在D65光源环境下测试灰阶卡，观察灰阶数是否能达到18阶以上，同时用imatest测试是否能达到14steps。



图 3-9 实验室灯箱D65光源环境下的灰阶卡示例图以及imatest分析结果

### ----结束

### 清晰度和噪声维度

调整清晰度和噪声前准备环境：黑电平校正正确、LSC标定完成、AE曝光调整合理、AWB和CCM参数标定合理、Gamma/Dehaze/Enhance 等调整合理。

影响清晰度和噪声的模块主要包括Bayer NR 、Demosaic、DPCC、YNR、UVNR、3DNR、sharpen、Edgefilter等。

步骤1：图像的基本纹理细节的第一道关口就是Demosaic。在调试该模块前，我们需要确认：黑电平标定准确、RawNR标定合理、AWB/CCM等标定合理。



图 3-10 实验室灯箱D65光源环境下清晰度卡示意图

步骤2：在Demosaic的参数调试合理之后，接下来重点联调BayerNR,YNR,UVNR，3DNR以及Sharpen和DPCC模块。

在调试Bayer NR 模块前确认：黑电平标定准确、RawNR标定合理、AWB/CCM等标定合理。

Bayer NR 作为最前级的噪声处理模块，不宜将强度开的过大，否则会损失画面的清晰度。Bayer NR的具体调优方法请参考4.5 “Bayer NR”章节。



图 3-11 静态场景ISO50 需要关注锐化纹理示意图

步骤5：DPCC去动态坏点强度只需要在照度稍微低的场景确认清楚即可。照度好的场景建议DPCC的等级开弱点。DPCC的具体调试方法请参考4.8 “DPCC”章节。



3-12 3DNR测试点示意图

步骤7：以上各个步骤完成之后，需要在各个ISO下综合测试最后的效果，必要时候需要做微调，以达到整体的清晰度和噪声的平衡。

### ----结束

#### 3.1.2 HDR 模式图像质量调优

针对HDR模式，图像质量主要关注以下维度：动态范围、亮度、清晰度和噪声、通透性、色彩还原以及运动拖尾的表现等方面，其中亮度涉及的模块主要有AE、LSC；动态范围主要取决于曝光比控制，清晰度和噪声主要涉及到的模块有Bayer NR 、Demosaic、DPCC、YNR、UVNR、3DNR、sharpen、Edgefilter等；通透性主要影响模块有Gamma、Dehaze、Enhance等；色彩还原涉及到模块有AWB、CCM、3DLUT；运动拖尾的严重程度取决与HDR参数的控制和曝光比。HDR典型的应用场景大部分都是包含背光下的人脸获取或者强光下的车牌获取。HDR模式图像调优的整个架构图如图3-13所示。



1） 饱和度标定值在80%\~90%左右即可；

2） 如果出现个别颜色表现突兀，可以通过3D lut进行微调。

3. 适当减小TMO模块对于亮度的大幅度提升，降低对色彩还原的影响。亮度不足时可以考虑采用Gamma模块与HDR TMO联调。

在完成Sensor对接和Sensor镜头标定之后，接下来主要针对HDR模式图像质量关注的维度进行图像调优。

### HDR 背光场景提升人脸亮度应用场景调试指南

### 亮度维度：

HDR模式下，场景的亮区优先采用短帧图像，暗区使用长帧图像。背光场景下，人脸处于场景的暗区，提升人脸亮度的步骤建议如下：

1. 通过调整AE参数包括权重表、AE Route、AE长帧目标值等来提升长帧图像的亮度。

2. 通过调整HDR TMO模块参数包括DetailsLowLight来针对暗区亮度进行提升。

3. 通过限制最大曝光比来控制图像动态范围，一定程度上也会轻微提升暗区亮度。



3-14 长帧暗区示意图

### 合成区域的运动拖尾维度：

1. 兼顾场景动态范围与运动拖尾，调试合理的HDR AE曝光比。

2. 同样曝光比条件下，通过调整短帧的曝光时间来减小长短帧时间的曝光时延，进而减小拖尾程度。

3. 通过调整HDR MERGE模块包括OECurve\_XXX，MDCurve\_XXX参数，降低合成区域因为运动误用短帧的概率，进而减轻运动拖尾的情况。



3-15 HDR合成区域运动拖尾示意图

### 场景动态范围维度：

如图3-14所示，在隔开的箱子里布置类似的场景，放入照度计，在箱子两边45度放置可调光LED补光灯，这样便可以模拟不同动态范围的场景。



3-14 动态范围调优场景示意

### 色彩维度：

请参考线性模式下的色彩调试方法；注意，HDR模式下由于有Tonemap，所以颜色的表现跟线性有略微差别，建议标定完后，根据情况适当降低饱和度。

### 对比度维度：

请参考线性模式下的对比度调试方法；

### 清晰度和噪声维度：

请参考线性模式下的清晰度和噪声调试方法；

## 4 模块介绍

该章节主要介绍各个模块的功能以及参数说明，其中参数以XML文件的方式存储在firmware中，部分参数可以采用调试工具进行调试。该章节中针对参数说明格式简要描述如下：

“ ” ：代表参数为字符串形式

xxx/yyy ： 代表yyy元素实体在xml文件中是xxx子元素实体

#### 4.1.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | 无 | ISP32:ISP32-lite: |

#### 4.1.1 功能描述

AE控制算法模块根据输入的亮度统计信息值，与目标亮度进行比较，计算新曝光量，最后自动分配sensor曝光时间、曝光增益及镜头光圈值，以获得合适亮度的图像。



图4-1 AEC模块原理图

#### 4.1.2 关键参数

##### 4.1.2.1 AEC模块公共功能控制参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 用户调试参数 |
| AecRunInterval | 调试参数 | 用户调试参数 |
| AecOpType | 调试参数 | 用户调试参数 |
| HistStatsMode | 调试参数 | 用户调试参数一般使用默认值 |
| RawStatsMode | 调试参数 | 用户调试参数一般使用默认值 |
| YrangeMode | 调试参数 | 用户调试参数一般使用默认值 |
| AecSpeed | 调试参数 | 用户调试参数 |
| AecDelayFrmNum | 调试参数 | 用户调试参数 |
| AecFrameRateMode | 调试参数 | 用户调试参数 |
| AecAntiFlicker | 调试参数 | 用户调试参数 |
| AecGridWeight | 调试参数 | 用户调试参数 |
| AecManualCtrl | 调试参数 | 用户调试参数 |

### Enable

【描述】

AEC模块开关功能。0：关闭；1：打开

【注意事项】

Enable值为0时，即关闭Aec算法。曝光保持在关闭前的值。

AecRunInterval

【描述】

Ae算法运行间隔，取值范围[0,255]，默认值为0。取值为0时，每帧运行AE；取值为1时，每隔1帧运行AE；以此类推。

建议该值不宜过大，否则可能导致AE响应速度慢，不平滑

AecOpType

【描述】

曝光模式，分为自动曝光(RK\_AIQ\_OP\_MODE\_AUTO)模式/手动(RK\_AIQ\_OP\_MODE\_MANUAL)曝光模式。

手动曝光模式需要与AecManualCtrl一起配合，进行手动曝光值的设置。

AecManualCtrl参数详见下文。

HistStatsMode

【描述】

Aec模块直方图统计模式。共五种模式分别为： CAM\_HISTV2\_MODE\_Y/R/G/B/RGB，默认为Y模式。

RawStatsMode

【描述】

Aec模块亮度统计模式。共四种模式分别为：CAM\_RAWSTATSV2\_MODE\_Y/R/G/B，默认为Y模式。

### YrangeMode

【描述】

Aec模块Y通道Range模式。共两种模式分别为CAM\_YRANGEV2\_MODE\_FULL/LIMITED，默认为FULL模式。

该参数仅在RawStatsMode为Y模式时有效。

AecGridWeight

【描述】

统计主窗口各个子窗口权重，包含15x15个参数

【注意事项】

1106平台硬件可支持5X5和15X15两种规格的权重设置，调试文件中统一设置15X15的权重，算法内部根据实际硬件配置进行权重的压缩或扩展。

AecWinScale

【描述】

AE模块硬件统计窗口大小比例配置参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| InputRaw | 基于raw图的AE硬件统计窗口大小比例配置参数，共包含4个参数，分别对应[h_off,v_off,h_size,v_size]，各参数的range=[0,1] |
| TmoRaw | 基于tmo模块后raw图的AE硬件统计窗口大小比例配置参数，共包含4个参数，分别对应[h_off,v_off,h_size,v_size]，各参数的range=[0,1] |
| Yuv | 基于yuv图的AE硬件统计窗口大小比例配置参数，共包含4个参数，分别对应[h_off,v_off,h_size,v_size]，各参数的range=[0,1] |

### 【注意事项】

sensor的分辨率以res表示，实际配置的硬件窗口偏移值为[res x h\_off,res x v\_off]；实际配置的硬件窗口大小值为[res x h\_size,res x v\_size]。

硬件窗口的偏移值和大小值之和，不可以超过1，即要求h $\mathsf &#123; \Gamma &#125; _ &#123; - &#125; \mathsf &#123; o f f &#125; + \mathsf &#123; h \_ s i z e &#125; &lt; = 1 , \mathsf &#123; v \_ o f f &#125; + \mathsf &#123; v \_ s i z e &#125; &lt; = 1$ 0

AecManualCtrl

【描述】

手动曝光参数设置，根据曝光模式分为LinearAE和HdrAE两套参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| ManualTimeEn | 手动曝光时间使能，默认值为1 |
| ManualGainEn | 手动sensor增益使能，默认值为1 |
| ManuallspDgainEn | 手动ISP数字增益使能，默认值为1 |
| TimeValue | 手动曝光时间值，以s为单位，参数值受sensor限制 |
| GainValue | 手动sensor增益值，此处增益值为实际值，单位为1x，参数值受sensor限制 |
| IspDGainValue | 手动ISP数字增益值，此处增益值为实际值，单位为1x，参数值受ISP限制 |

### 【注意事项】

手动/半手动模式下，手动曝光时间和增益会受自动模式下的最大/最小曝光时间和增益限制。超出自动曝光限制的范围之后，将使用自动模式下最大/最小值替代。

### AecSpeed

【描述】

自动曝光调节速度属性。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| SmoothEn | 平滑开关开启: 实现曝光平滑关闭：关闭曝光平滑，可提升曝光调节速度 |
| DampOver | 环境亮度稳定，图像亮度高于目标值时对应的曝光调节速度，取值范围[0,1] |
| DampUnder | 环境亮度稳定，图像亮度低于目标值时对应的曝光调节速度，取值范围[0,1] |
| DampDark2Bright | 环境亮度突变，从暗到亮时对应的曝光调节速度，取值范围[0,1] |
| DampBright2Dark | 环境亮度突变，从亮到暗时对应的曝光调节速度，取值范围[0,1] |
| DyDamp | 动态曝光调节速度模块 |

DyDamp成员如下


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
| 成员名称 | 描述 |
| SlowOPType | 减速收敛模式：包括手动模式（RK_AIQ_OP_MODE_MANUAL）与自动模式(RK_AIQ_OP_MODE_AUTO) |
| SlowRange | 减速收敛对应的亮度范围，仅在SIowOPType=RK_AIQ_OP_MODE_MANUAL下有效，取值范围[0,100]，单位百分比。代表当前亮度在目标亮度±SlowRange时，采用SlowDamp作为曝光调节速度。 |
| SlowDamp | 减速收敛对应的曝光调节速度，仅在SIowOPType=RK_AIQ_OP_MODE_MANUAL下有效，取值范围[0,1]。 |

### 【注意事项】

自动曝光调节阻尼系数，通过调整当前曝光值与当前曝光值的权重，实现曝光速度的调节。最终曝光值 = 当前曝光值 x DampCoef + 新曝光值 x（1 - DampCoef ）

自动曝光调节阻尼系数越大，曝光调节速度越慢，反之越快。为了保证调节过程的平滑，建议调节速度设置在[0.4,0.7]范围内。

SmoothEn默认开启，可使自动曝光平滑过渡；对于词典笔这类对平滑无要求，需要快速收敛的应用，可关闭。

### AecDelay

【描述】

自动曝光触发延时属性

【成员】


| 成员名称 | 描述 |
| --- | --- |
| DelayType | 延时模式，包括帧延迟模式DELAY TYPE FRAME和时间延迟模式DELAY_TYPE_TIME。DELAY_TYPE_FRAME：延时单位为帧；DELAY_TYPE_TIME：延时单位固定为1/30秒。 |
| BlackDelay | 自动曝光触发延时属性，其单位随DelayType变化。图像亮度低于目标值超过BlackDelay时，Ae开始调节 |
| WhiteDelay | 自动曝光触发延时属性，其单位随DelayType变化。图像亮度高于目标值超过WhiteDelay时，Ae开始调节 |

### 【注意事项】

BlackDelay/ WhiteDelay 不宜过大，否则将导致AE触发响应过慢，出现明显的阶梯亮度变化。

DelayType=DELAY\_TYPE\_TIME时，延迟响应的时间=1/30\*BlackDelay（WhiteDelay），单位为秒。

### AecFrameRateMode

【描述】

自动曝光帧率模式，可分为固定帧率模式与自动降帧模式

【成员】


| 成员名称 | 描述 |
| --- | --- |
| isFpsFix | 帧率模式选择，默认值为0，即采用自动降帧模式；值为1时，表示为固定帧率模式。 |
| FpsValue | isFpsFix=0时，用于表示自动降帧模式的最高帧率。默认值为0时，使用驱动setting中的帧率作为最高帧率；值不为0时，使用设定的帧率作为最高帧率。isFpsFix=1时，用于表示固定帧模式的固定帧率值。默认值为0时，使用驱动setting中的帧率作为固定帧率；值不为0时，使用设定的帧率作为固定帧率。 |

### 【注意事项】

自动降帧模式：要求isFpsFix置0，FpsValue为0时，使用驱动setting中的帧率作为最高帧率；值不为0时，使用设定的帧率作为最高帧率。当设的的帧率值大于驱动setting中的默认帧率时，会有warning提醒，帧率设置无效。自动降帧模式的最小帧率由AecRoute中的最大曝光时间和SensorInfo中的CISMinFps共同决定。AecRoute中的最大曝光时间超过CISMinFps所允许的最大曝光时间时，算法内部将对该值进行校正。当前曝光分解后，若曝光时间大于驱动默认帧率所允许的曝光时间，则会通过修改vblank值，实现降低帧率提高曝光时间；若曝光时间小于等于驱动默认帧率所允许的曝光时间，则当前帧率设置为驱动的默认帧率。自动降帧的具体实现需要依赖AecRoute参数，在AecRoute中设置增益阈值，当增益大于阈值时，触发降帧。

### AecAntiFlicker

【描述】

### 自动曝光抗工频闪烁属性

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | 抗工频闪烁功能使能，该值为1时，开启抗工频闪烁功能，反之则关闭。 |
| Frequency | 设置工频，共两种：AECV2_FLICKER_FREQUENCY_50HZ和AECV2_FLICKER_FREQUENCY_60HZ |
| Mode | 抗工频闪烁工作模式，共两种模式：AECV2 ANTIFLICKERNORMALMODE模式AECV2 ANTIFLICKER AUTOMODE模式。通过不同的工作模式，调整曝光时间，实现抗工频闪烁。 |

### 【注意事项】

enable使能为0时，代表关闭抗闪功能。

AUTO抗闪模式：曝光时间根据亮度进行调节，最小曝光时间可以到达sensor最小曝光时间，与normal抗闪模式的区别在于高亮度环境，能够抑制过曝，但抗闪失效。

### AecEnvLvCalib

【描述】

环境亮度标定参数

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

该参数目前仅在快启应用中有效，用于加速曝光收敛。一般应用，该功能无效。

##### 4.1.2.2 AEC模块线性曝光调试参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| RawStatsEn | 调试参数 | 用户调试参数一般为默认值 |
| EvBias | 调试参数 | 用户调试参数 |
| Toleranceln/Out | 调试参数 | 用户调试参数 |
| StrategyMode | 调试参数 | 用户调试参数 |
| Route | 调试参数 | 用户调试参数 |
| InitExp | 调试参数 | 用户调试参数 |
| DySetpoint | 调试参数 | 用户调试参数 |
| BackLightCtrl | 调试参数 | 用户调试参数 |
| OverExpCtrl | 调试参数 | 用户调试参数 |

### RawStatsEn

【描述】

线性曝光支持使用Raw域统计亮度或RGB域统计亮度来计算曝光，根据具体应用需求可以切换。默认使用raw图统计值，即该位置1.

RawStatsEn = 0 , 表示使用RGB图（gamma前）的统计值计算曝光

RawStatsEn = 1 , 表示使用raw图（已减黑电平，并乘上白平衡gain值）的统计值计算曝光

### 【注意事项】

3562平台线性曝光仅支持raw域统计，因此该参数仅可设置为1，0值无效。

### ToleranceIn/Out

### 【描述】

自动曝光调节时，画面亮度的容忍度。单位为%，取值范围为[0,100]

当自动曝光收敛时画面亮度值B应在 [真实生效目标亮度 X（1-容忍度/100）, 真实生效目标亮度 X（1+容忍度/100）] 范围内。

ToleranceIn代表曝光未收敛时的容忍度，ToleranceOut代表曝光收敛时的容忍度。建议ToleranceIn &lt;ToleranceOut，可避免曝光变动过于灵敏，用于稳定曝光。

### EvBias

【描述】

自动曝光调节时，曝光量的偏差百分比，单位为%，取值范围为[-200,+200]

用于特殊场景下对（固定/动态）目标亮度值（SetPoint/NightSetPoint）进行调整。真实生效目标亮度为（SetPoint/ NightSetPoint）\*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]。

如设置EvBias=100时，亮度为默认参数的2倍；EvBias=-100时，亮度为默认参数的1/2。

【注意事项】

如上述的toleranceIn/Out设置较大，一方面会影响AE的响应速度，一方面会影响EvBias值。当EvBias调整的间隔值低于toleranceIn/Out，有可能导致亮度调整不生效。

### StrategyMode

【描述】

自动曝光策略模式，高光优先或低光优先

【注意事项】

目前该参数暂无效

Route

【描述】

自动曝光分解策略属性。用于设定AE曝光分解路线，AE算法计算得到的曝光量将按照设定的路线进行分配，用户可以根据具体应用的需求，将路线设定为曝光时间优先（快门优先）、增益优先、光圈优先。

【成员】

LinearAE


| 成员名称 | 描述 |
| --- | --- |
| TimeDot | 曝光时间节点，单位为秒 |
| GainDot | sensor增益节点，此处增益值为实际值，单位为1x |
| IspgainDot | Isp数字增益节点，此处增益值为实际值，单位为1x |
| PlrisDot | 光圈等效增益节点，此处增益值为实际值，单位为1x |

【注意事项】



图4-2 曝光分解示意图

曝光分解路线中每个曝光分量的节点个数不限，建议至少设置6个节点，以防曝光分解过渡不平滑，同时每个曝光分量的节点个数需要一致。

节点中曝光时间分量的单位为秒，最小值允许为0，实际最小曝光时间代码内部会根据sensor限制进行校正；节点中曝光增益分量的单位是倍数，最小值为1倍。

光圈分量仅支持P-Iris, 不支持DC-Iris。P-iris等效增益分量仅在Airis自动光圈功能使能时有效，否则默认光圈固定为初始值大小。P-iris等效增益的计算详见IrisCtrl模块。

如果相邻节点的曝光量增加，则应该只有一个曝光分量增加，其他曝光分量固定。增加的分量决定该段路线的分配策略。例如增益分量增加，其他分量固定，那么该段路线的分配策略是增益优先。

InitExp  

【描述】  

线性曝光模式初始值设置。  

【成员】


| 成员名称 | 描述 |
| --- | --- |
| InitTimeValue | 初始曝光时间值，单位为秒 |
| InitGainValue | 初始sensor增益值，此处增益值为实际值，单位为1x |
| InitIspDGainValue | 初始ISP数字增益值，此处增益值为实际值，单位为1x |
| InitPIrisGainValue | 初始P光圈等效增益值，此处增益值为实际值，单位为1x |
| InitDCIrisDutyValue | 初始DC光圈占空比值，取值范围为[0,100] |

### 【注意事项】

自动曝光初始值未设置时（即各值皆为0时），采用系统默认值。

自动曝光初始值的大小，受自动曝光分解曲线的最大/小值限制。当自动曝光初始值的大小超出或低于自动曝光分解曲线的最大/小值，则用自动曝光分解曲线的最大/小值代替。

自动曝光P光圈等效增益初始值，仅在光圈类型为P光圈时有效，默认初始值为P光圈所支持的最大光圈对应的等效增益值。等效增益的含义说明详见光圈调试参数IrisCtrl模块。

InitIspDGainValue初始ISP数字增益值暂无效。

### DySetpoint

【描述】

动态目标亮度值设置。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| ExpLevel | 动态曝光量节点属性，节点值为当前曝光量值，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。 |
| DySetpoint | 动态目标亮度值节点属性，取值范围[0,255]。节点值随曝光量动态变化，曝光量节点值越大，目标亮度节点值越小，并与曝光量节点一一对应。节点个数不限，需要与ExpLevel节点个数一致，建议至少设置6个节点，以防曝光过渡不平滑。 |

### 【注意事项】

ExpLevel为当前曝光量值，即(Curgain \* Curtime)。

需要设置固定目标值，则DySetpoint中各节点值可设置为相同值。

设置DySetpoint的节点时，尽量让各节点的值随着ExpLevel平滑变化，防止出现闪烁。

### BackLightCtrl

【描述】

背光补偿功能，即背光场景下，支持背光暗区的亮度抬亮，重现暗区细节。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | 模块使能位，1：使能，0：关闭 |
| MeasArea | 暗区检测区域，共包含6种模式：AECV2_MEASURE_AREA_AUTO/UP/BOTTOM/LEFT/RIGHT/CENTER |
| LumaDistTh | 区域增长容忍度。 |
| OEROILowTh | 过曝区域亮度最低值,用于区分过曝区域与非过曝区域 |
| LvHighTh | 环境亮度高阈值 |
| LvLowTh | 环境亮度低阈值 |
| ExpLevel | 动态曝光量节点属性，节点值为当前曝光量值，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点值即为曝光值(gain*time，time以s为单位) |
| NonOEPdfHighTh | 非过曝区域占比阈值(0~1)，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点个数需要与ExpLevel一致，节点值需要与ExpLevel——对应。 |
| LowLightPdfTh | 暗区占比阈值(0~1)，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点个数需要与ExpLevel一致，节点值需要与ExpLevel——对应。 |
| TargetLLLuma | 动态暗区亮度目标值，取值范围[0,255]。节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点个数需要与ExpLevel一致，节点值需要与ExpLevel——对应，随着ExpLevel增大而减小。 |

### 【注意事项】

### 环境亮度Lv=meanluma/exp/1000 (exp=gain\*time, unit：s)

以上环境亮度的高低阈值用于计算环境亮度因子。



图4-3 背光MeasArea区域

当MeasArea配置为UP, BOTTOM, LEFT, RIGHT或CENTER时，代表手动模式，暗区位置以手动设定为准。如图4-3，其中UP指定为画面上方1/3的区域；BOTTOM为画面下方1/3的区域；LEFT为画面左侧1/3的区域；RIGHT为画面右侧1/3的区域；CENTER为画面中心3/5的区域。当指定区域亮度低于暗区目标亮度值时，加大曝光提升指定区域亮度；当指定区域亮度高于暗区目标亮度值时，说明此时指定区域不是暗区，或者当前场景不是背光场景，那么曝光的增减改由全局亮度决定。即该模式下背光补偿仅在指定区域的亮度低于暗区目标亮度值时开启。

### OverExpCtrl

### 【描述】

强光抑制模块，降低曝光减轻画面过曝程度。  

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | 模块使能位，1：使能，0：关闭 |
| HighLightTh | 高亮区域的亮度阈值，取值范围[0,255] |
| LowLightTh | 低亮区域的亮度阈值，取值范围[0,255] |
| MaxWeight | 最大权重值，取值范围[1,20] |
| OEPdf | 过曝区域占比，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑，占比值从小到大变化，取值范围[0,1] |
| HighLightWeight | 高亮区域权重，取值范围[1,20]，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑，与过曝区域占比节点相对应，最大值受MaxWeight限制。 |
| LowLightWeight | 低亮区域权重，取值范围[1,20]，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑，与过曝区域占比节点相对应，最大值受MaxWeight限制。 |

### 【注意事项】

强光抑制模块开启时，建议同时开启线性TMO功能，防止强光抑制过程中，暗区过暗的问题。

##### 4.1.2.3 AEC模块HDR曝光调试参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Toleranceln/Out | 调试参数 | 用户调试参数 |
| StrategyMode | 调试参数 | 用户调试参数 |
| EvBias | 调试参数 | 用户调试参数 |
| ExpRatioCtrl | 调试参数 | 用户调试参数 |
| Route | 调试参数 | 用户调试参数 |
| InitExp | 调试参数 | 用户调试参数 |
| LongFrmMode | 调试参数 | 用户调试参数 |
| LframeCtrl | 调试参数 | 用户调试参数 |
| MframeCtrl | 调试参数 | 用户调试参数 |
| SframeCtrl | 调试参数 | 用户调试参数 |

### ToleranceIn/Out

### 【描述】

画面亮度的容忍度。单位为%，取值范围为[0,100]

当自动曝光收敛时画面亮度值B应在 [真实生效目标亮度 X（1-容忍度/100）, 真实生效目标亮度 X（1+容忍度/100）] 范围内。

ToleranceIn代表曝光未收敛时的容忍度，ToleranceOut代表曝光收敛时的容忍度。建议ToleranceIn &lt;ToleranceOut，可避免曝光变动过于灵敏，用于稳定曝光。

### StrategyMode

【描述】

自动曝光策略模式，高光优先或低光优先.

【成员】

高光优先：AECV2\_STRATEGY\_MODE\_HIGHLIGHT

低光优先：AECV2\_STRATEGY\_MODE\_LOWLIGHT

【注意事项】

此参数在不同曝光比模式下，表现不同，详见ExpRatioCtrl参数。

### EvBias

### 【描述】

自动曝光调节时，曝光量的偏差百分比，单位为%，取值范围为[-200,+200]。用于特殊场景下对目标亮度值进行调整。真实生效目标亮度为目标值 X [1+abs(EvBias)/100]^[EvBias/abs(EvBias)]。

如设置EvBias=100时，目标亮度为默认参数的2倍；EvBias=-100时，目标亮度为默认参数的1/2。

【注意事项】

如上述的toleranceIn/Out设置较大，一方面会影响AE的响应速度，一方面会影响EvBias值。当EvBias调整的间隔值低于toleranceIn/Out，有可能导致亮度调整不生效。

InitExp

【描述】

Hdr曝光模式初始值设置。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| InitTimeValue | 初始曝光时间值，单位为秒 |
| InitGainValue | 初始sensor增益值，此处增益值为实际值，单位为1x |
| InitIspDGainValue | 初始ISP数字增益值，此处增益值为实际值，单位为1x |
| InitPIrisGainValue | 初始P光圈等效增益值，此处增益值为实际值，单位为1x |
| InitDCIrisDutyValue | 初始DC光圈占空比值，取值范围为[0,100] |

### 【注意事项】

自动曝光初始值未设置时(即各值为0时)，采用系统默认值。

自动曝光初始值的大小，受自动曝光分解曲线的最大/小值限制。当自动曝光初始值的大小超出或低于自动曝光分解曲线的最大/小值，则用自动曝光分解曲线的最大/小值代替。

部分sensor在HDR曝光模式下对初始曝光有特殊要求，如os04a10，其要求短帧的初始曝光需要低于0.005s。

自动曝光P光圈等效增益初始值，仅在光圈类型为P光圈时有效，默认初始值为P光圈所支持的最大光圈对应的等效增益值。等效增益的含义说明详见AecIrisCtrl模块。

InitIspDGainValue初始ISP数字增益值暂无效。

### Route

【描述】

自动曝光分解策略属性。用于设定AE曝光分解路线，AE算法计算得到的曝光量将按照设定的路线进行分配，用户可以根据具体应用的需求，将路线设定为曝光时间优先（快门优先）、增益优先、光圈优先。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Frm0/1/2TimeDot | 曝光时间节点，单位为秒。Hdr 2帧模式时，仅Frm0/1TimeDot有效；Hdr 3帧模式时，Frm0/1/2TimeDot皆有效。Frm0~3依次为曝光量从短至长的帧序号。 |
| Frm0/1/2GainDot | sensor增益节点，单位为1x。Hdr 2帧模式时，仅Frm0/1GainDot有效；Hdr 3帧模式时，Frm0/1/2GainDot皆有效。此处增益值为实际值，单位为1x。Frm0~3依次为曝光量从短至长的帧序号。 |
| Frm0/1/2IspDGainDot | Isp数字增益节点，单位为1x。Hdr 2帧模式时，仅Frm0/1IspDGainDot有效；Hdr 3帧模式时，Frm0/1/2IspDGainDot皆有效。此处增益值为实际值，单位为1x。Frm0~3依次为曝光量从短至长的帧序号。 |
| PlrisDot | 光圈等效增益节点，此处增益值为实际值，单位为1x |

### 【注意事项】



图4-2 曝光分解示意图

曝光分解路线中每个曝光分量的节点个数不限，建议至少设置6个节点，以防曝光分解过渡不平滑，同时每个曝光分量的节点个数需要一致。

节点中曝光时间分量的单位为秒，最小值允许为0，实际最小曝光时间代码内部会根据sensor限制进行校正。

光圈分量仅支持P-Iris, 不支持DC-Iris。P-iris等效增益分量仅在Airis自动光圈功能使能时有效，否则默认光圈固定为初始值大小。P-iris等效增益的计算详见IrisCtrl模块。

注意：设置的曝光分解路线不一定是最终生效的曝光分解路线。算法内部会根据sensor或isp对曝光分量的最大/最小值限制（可在sensorinfo中查看），对分解路线中各节点的值进行值域校验，

不满足限制条件的节点会被校正。因此设置曝光分解路线节点之前，建议先通过sensorinfo模块内的参数，了解sensor或ISP支持的曝光分量值域，而后再根据产品应用设置节点值。

如果相邻节点的曝光量增加，则应该只有一个曝光分量增加，其他曝光分量固定。增加的分量决定该段路线的分配策略。例如增益分量增加，其他分量固定，那么该段路线的分配策略是增益优先。

1106目前暂不支持ISP数字增益，故Frm0/1/2ispDGainDot皆无效。

### ExpRatioCtrl

【描述】

HdrAE曝光比控制模块。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| ExpRatioType | 曝光比模式，仅在Hdr模式多帧合成下有效AUTO：根据场景，自动计算长短帧的曝光比FIX：长短帧采用固定曝光比 |
| RatioExpDot | 表示曝光量节点，根据曝光量，动态设置曝光比固定值或曝光比最大值，二者一对应。节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。 |
| M2SRatioFix | 中帧与短帧的曝光比固定值。节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与RatioExpDot节点个数一致。ExpRatioType= AUTO时，无效。ExpRatioType = FIX时，表示中帧与短帧的曝光比，与曝光量节点RatioExpDot——对应。。 |
| L2MRatioFix | 长帧帧与中帧的曝光比固定值。节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与RatioExpDot节点个数一致。ExpRatioType = AUTO时，无效。ExpRatioType = FIX时，表示长帧与中帧的曝光比,与曝光量节点RatioExpDot——对应。Hdr为2帧合成时无效，3帧合成时有效。 |
| M2SRatioMax | 中帧与短帧的曝光比最大值。节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与 RatioExpDot节点个数一致。ExpRatioType= AUTO时，表示中帧与短帧的曝光比动态最大值，与曝光量节点RatioExpDot一对应。ExpRatioType = FIX时，无效 |
| L2MRatioMax | 长帧与中帧的曝光比最大值。节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与 RatioExpDot节点个数一致。ExpRatioType= AUTO时，表示长帧与中帧的曝光比动态最大值,与曝光量节点RatioExpDot一一对应。Hdr为2帧合成时无效，3帧合成时有效。ExpRatioType = FIX时，无效。 |

### 【注意事项】

StrategyMode = LOWLIGHT\_PRIOR，优先保证长曝帧的曝光，短曝帧曝光=长曝帧曝

光/M2SratioMax。以此类推，3帧HDR模式下，当StrategyMode = HIGHLIGHT\_PRIOR，优先保证曝光较短帧的曝光；StrategyMode = LOWLIGHT \_PRIOR，优先保证曝光较长帧的曝光。

### LongFrmMode

【描述】

HdrAE长帧模式功能控制模块

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Mode | 长帧模式，包括：DISABLE/AUTO/ENABLE。DISABLE:正常Hdr，不开启长帧模式。Ae和Hdr合成模块按照手动/自动曝光比进行工作。AUTO:自动长帧模式。在曝光超过设定的阈值时，长帧曝光时间接近1帧所允许的最大值，合成模块只输出长帧。ENABLE:开启长帧模式。AE将短帧曝光时间固定设为最小值，长帧曝光时间接近1帧所允许的最大值，合成模块只输出长帧。 |
| SfrmMinLine | 长帧模式/自动长帧模式下，短帧最小曝光行。由于sensor的一些限制，长帧模式下，短帧的最小曝光行可能无法达到sensor允许的最小曝光行，因此需要另行设置。 |
| LfrmModeExpTh | 自动长帧模式下，当长帧曝光超过LfrmModeExpTh，切换为长帧模式 |

### LframeCtrl

### 【描述】

【成员】


| 成员名称 | 描述 |
| --- | --- |
| OEROILowTh | 过曝区域亮度最低值,用于区分过曝区域与非过曝区域，取值范围[0,255]。 |
| LvHighTh | 环境亮度高阈值，无量纲，取值范围[0,15] |
| LvLowTh | 环境亮度低阈值，无量纲，取值范围[0,15] |
| LExpLevel | 动态长帧曝光值节点参数，节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。ExpLevel =gain*time(time单位为s) |
| LSetPoint | 动态长帧全局目标亮度值，取值范围[0,255]。节点个数需要与LExpLevel保持一致，节点值与LExpLevel各节点值——对应。 |
| NonOEPdfHighTh | 非过曝区域占比阈值(0~1），节点个数需要与LExpLevel保持一致，节点值与LExpLevel——对应。 |
| LowLightPdfTh | 暗区占比阈值(0~1)，节点个数需要与LExpLevel保持一致，节点值与LExpLevel各节点值——对应,随着ExpLevel增大而增大。 |
| TargetLLLuma | 动态长帧暗区亮度目标值，取值范围[0,255]。节点个数需要与LExpLevel保持一致，节点值与LExpLevel各节点值——对应，随着ExpLevel增大而减小。 |

### 【注意事项】

环境亮度Lv=meanluma/exp/1000 (exp=gain\*time,unit:s)

LvHighTh: 环境亮度高阈值，该值越大，则越不容易触发背光补偿，反之，则容易触发背光补偿。  

等价于区分室内室外的环境亮度阈值，建议LvHighTh=setpoint/(室外曝光)。LvLowTh: 环境亮度低阈值，该值越大，则越不容易触发背光补偿，反之，则容易触发背光补偿。  

等价于区分室内亮暗环境的环境亮度阈值，建议LvHighTh=setpoint/(室内暗环境曝光)。

以上环境亮度的高低阈值用于计算环境亮度因子。

建议暗区目标值不要超过全局目标值的50%，控制在全局目标亮度的40%\~50%，否则可能出现背光场景下亮度过亮的现象。

MframeCtrl

【描述】

中帧调试参数（仅Hdr 3帧时有效）

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### SframeCtrl

【描述】

短帧调试参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| SExpLevel | 动态短帧最大曝光值节点参数，节点个数不限，建议至少设置6个节点，才 可实现曝光过渡的平滑。ExpLevel =gain*time(time 单位为s) |
| SSetPoint | 动态短帧全局平均亮度目标值，取值范围[0,255]。节点个数需要与MExpLevel保持一致，节点值与MExpLevel各节点值一—对应。同区间内的亮区亮度目标值要求高于对应全局亮度目标值。 |
| TargetHLLuma | 动态短帧高亮区均值目标值，取值范围[0,255]。节点个数需要与MExpLevel保持一致，节点值与MExpLevel各节点值——对应. |
| HLLumaTolerance | 设置短帧高亮区目标容忍百分比，单位为%，取值范围[0,100]。 |
| HLROIExpandEn | 短帧高亮区扩展使能。=1，忽略占比较小的高亮区，减小高亮区灵敏度；=0，对所有高亮区进行亮度抑制，增大高亮区灵敏度 |

##### 4.1.2.4 AEC模块光圈调试参数

IrisCtrl

【描述】

光圈控制参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | 自动光圈控制功能的使能 |
| IrisType | 光圈类型，P(即P-iris光圈)或DC（即DC-iris光圈） |
| ManualEn | 手动光圈使能 |
| ManualAttr | 手动光圈控制参数，仅在ManualEn=1时有效 |
| InitAttr | 光圈初始值参数 |
| PlrisAttr | P光圈控制参数 |
| DCIrisAttr | DC光圈控制参数 |

ManualAttr


| 成员名称 | 描述 |
| --- | --- |
| PIrisGainValue | 手动P光圈等效增益值，此处增益值为实际值，单位为1x，参数值受P光圈设备限制，取值范围为[1，1024] |
| DCIrisHoldValue | 手动DC光圈HoldValue值，参数值与DC光圈设备有关，取值范围为[0，100] |

InitAttr


| 成员名称 | 描述 |
| --- | --- |
| PIrisGainValue | P光圈等效增益初始值，此处增益值为实际值，单位为1x，参数值受P光圈设 备限制，取值范围为[1，1024] |
| DCIrisHoldValue | DC光圈HoldValue值，参数值与DC光圈设备有关，取值范围为[0，100] |

PIrisAttr


| 成员名称 | 描述 |
| --- | --- |
| TotalStep | P-iris步进电机总步数，具体大小与P-iris镜头有关。 |
| EffcStep | P-iris步进电机的可用步数，具体大小与P-iris镜头有关。 |
| ZerolsMax | P-iris步进电机step0是否对应最大光圈位置，具体取值与P-iris镜头有关。该值为0，代表步进电机位置为step0时，光圈开到最小；该值为1，代表步进电机位置为step0时，光圈开到最大。 |
| StepTable | P-iris步进电机位置与光圈等效增益的映射表，具体数值与P-iris镜头有关。 |

DCIrisAttr


| 成员名称 | 描述 |
| --- | --- |
| Kp | 比例系数，用于限制光圈剧烈变化时光圈的开关速度，该值越大，光线剧烈变化时光圈打开和关闭的速度越慢。该值过大，调节过程制动就会超前，致使调节时间过长；该值过小，调节过程制动就会落后，从而导致超调增加。该值的合理设置与DC-iris镜头及电路特性有关。建议值为0.5。取值范围[0，1]。 |
| Ki | 积分系数，用于调节光圈的开关速度，该值越大光圈打开和关闭的速度越大。该值过大，容易出现超调导致振荡；该值过小，光圈调节速度较慢、环境亮度变化较剧烈时容易发生振荡。建议值为0.2。取值范围[0，1]。 |
| Kd | 微分系数，用于调节光圈的开关速度，该值越大光圈打开和关闭的速度越大。建议值为0.3。取值范围[0，1]。 |
| MinPwmDuty | 最小PWM占空比，具体大小与DC-iris镜头、电路特性有关，单位为%。该值越小，所支持的光圈关闭速度越快，但容易导致光圈振荡。取值范围[0,100]，默认值为0。 |
| MaxPwmDuty | 最大PWM占空比，具体大小与DC-iris镜头、电路特性有关，单位为%。该值越大，所支持的光圈打开速度越快，该值过小，可能导致光圈尚未达到最大时就退出光圈控制。取值范围[0,100]，默认值为100。 |
| OpenPwmDuty | 光圈打开时的PWM占空比阈值，当光圈PWM占空比高于（不含）OpenPwmDuty时，光圈处于打开状态。具体大小与DC-iris镜头有关，单位为%，取值范围[0,100]。 |
| ClosePwmDuty | 光圈关闭时的PWM占空比阈值，当光圈PWM占空比小于(不含）ClosePwmDuty时，光圈处于关闭状态。具体大小与DC-iris镜头有关，单位为%，取值范围[0,100]。 |

【注意事项】

ManualIrisEn，手动光圈控制使能。当光圈类型IrisType为P光圈时，仅PirisGainValue有效；当光圈类型为DC光圈时，仅DCIrisHoldValue有效。

自动光圈Airis算法的基本控制流程如下：

针对P-iris镜头，光圈控制通过AecRoute模块进行。P-iris镜头的光圈大小换算为等效增益，参与曝光分解计算。

P-iris的步进电机位置与光圈等效增益映射表StepTable一般根据镜头厂家提供的步进电机位置与光圈孔径对应关系制作。P-iris的控制是通过AE的AecRoute模块来控制的，该模块将光圈孔径大小换算成等效增益，因此要求P-iris的光圈控制需要具有较好的线性度。等效增益的取值范围为[1,1024]，用等效增益1024表示F1.0,等效增益512表示F1.4，以此类推，等效增益1表示F32.0。制作表时，需要将步进电机位置对应的光圈孔径换算为等效增益，填入StepTable中，并固定按照步进电机位置递增（即step0、step1……stepN）的顺序填入。

表4-1为P-iris步进电机位置与光圈孔径和等效增益的对应表，以此表为例来说明StepTable该如何设置。表4-1中第1-2、4-5列的步进电机位置step和光圈孔径面积的对应关系为某镜头原厂提供。该款P-iris镜头的步进电机调节总步数为81，step0时对应的光圈孔径最大，标称最大光圈数为1.4。光圈数为1.4时对应的等效增益为512，故step0处对应的等效增益为512。其他孔径面积对应的等效增益，此处以step3为例，计算方式如下：step3的孔径面积为195.869，对应等效增益=512\*（195.869/201.062）= 499（四舍五入）。以此类推，其他步进电机位置对应的等效增益值也可据此算出。从表1-1中可知，步进电机位置靠近关闭端时，对应的孔径面积很小，与最大的孔径面积相差可达几千倍，对应的等效增益值误差较大，因此建议靠近光圈关闭端的步进电机位置不要使用，以免因为误差导致曝光振荡。将表中各步进电机位置对应的等效增益按照步进电机位置递增（即step0、step1……stepN）的顺序填入StepTable。

DC-iris的OpenPwmDuty与ClosePwmDuty取值需要进行实测，其具体值与DC-iris镜头相关。对于部分镜头，存在当PWM占空比大于OpenPwmDuty时，光圈执行打开操作；当PWM占空比小于OpenPwmDuty时，光圈执行关闭操作；当PWM占空比大于等于ClosePwmDuty且小于等于OpenPwmDuty时，光圈稳定在当前位置，该区间内的值皆为HoldValue。另存在某些镜头，只存在一个光圈开关的阈值，即当PWM占空比大于该阈值时，光圈执行打开操作；当PWM占空比小于该阈值时，光圈执行关闭操作；当PWM占空比等于该阈值时，光圈稳定在当前位置，该阈值即为HoldValue。此时可令ClosePwmDuty = OpenPwmDuty = HoldValue。

表4-1 P-iris步进电机位置与光圈孔径和等效增益的对应表


| Step | 孔径面积(mm2) | 等效增益 | Step | 孔径面积(mm2) | 等效增益 |
| --- | --- | --- | --- | --- | --- |
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | close | 0 |
| 32 | 87.777 | 224 | 73 | close | 0 |
| 33 | 84.156 | 214 | 74 | close | 0 |
| 34 | 80.569 | 205 | 75 | close | 0 |
| 35 | 77.02 | 196 | 76 | close | 0 |
| 36 | 73.51 | 187 | 77 | close | 0 |
| 37 | 70.043 | 178 | 78 | close | 0 |
| 38 | 66.621 | 170 | 79 | close | 0 |
| 39 | 63.247 | 161 | 80 | close | 0 |
| 40 | 59.923 | 153 |  |  |  |

##### 4.1.2.5 AEC模块同步测试参数

SyncTest

【描述】

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

AlterExp

根据模式的不同，分为LinearAE和HdrAE两套参数。


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
| 成员名称 | 描述 |
| DcgMode | Dcg模式值 |
| PIrisGainValue | P-iris等效增益值 |

##### 4.1.2.5 sensorinfo参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Gain2Reg | CIS驱动参数 | 以CIS datasheet为准，非调试参数 |
| Time2Reg | CIS驱动参数 | 以CIS datasheet为准，非调试参数一般为默认值，无需修改 |
| CISGainSet | CIS驱动参数 | 以CIS datasheet为准，非调试参数 |
| CISTimeSet | CIS驱动参数 | 以CIS datasheet为准，非调试参数 |
| CISHdrSet | CIS驱动参数 | 以CIS datasheet为准，非调试参数 |
| CISDcgSet | CIS驱动参数 | 以CIS datasheet为准，非调试参数 |
| CISExpUpdate | CIS驱动参数 | 以CIS datasheet为准，非调试参数 |
| CISMinFps | CIS驱动参数 | 一般为默认值，如需设置更低帧率，可修改 |
| CISFlip | 调试参数 | 用户调试参数根据产品应用设置翻转与镜像 |

### Gain2Reg

【描述】

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意事项】

sensor增益转寄存器值公式中的sensor增益指sensor的total gain = again\*dgain。若again与dgain的转换公式不同，支持分段设置，如上图所示，size需要做适应性修改。

线性sensor增益转寄存器值公式，由3个系数构成（M0、C0、C1），系数说明如下：

转换公式为： set to driver reg = （gain^M0）\*C1 - C0+ 0.5

xml 参数对应：

第一列： gain 区间起始值，第二列 gain 区间结束值，第三列： C1，第四列： C0，

第五列： M0，第六列： gain 起始值对应 reg， 第七列： gain 结束值对应 reg

针对支持DCG的sensor，且转换公式为线性模式时，GainRange填写LCG的增益转换公式。

### 【举例】

s5kgm1sp

该sensor的模拟增益和数字增益转换公式不同，如图4-3、4-4所示，模拟增益寄存器值为模拟增益的32倍，数字增益寄存器值为数字增益的256倍。



图4-3 模拟增益转寄存器值示例

SMIA gain registers interface, which is coarse and supports fractional gain of 1/256 scale.

Digital gain of the four Baver channels is controlled separately using the four parameters shown in the following table. When digital gain is applied, the LSB(s) resulting data shall be padded with zeros.

Table 15Digital Gain Examples


| Gain Value | api_rw_digital_gain_code_XXX Register Value |
| --- | --- |
| X1 | 0x0100 |
| X2 | 0x0200 |
| X3 | 0x0300 |
| X8 | 0x0800 |
| X16 | 0x1000 |

图4-4 数字增益转寄存器值示例

```
if(reg <= 0x200){
a_reg = reg;
d_reg = 0x0100;
}else{
a_reg = 0x200;
d_reg = reg-0x200;
}
```

### Time2Reg

【描述】

sensor曝光时间转寄存器曝光行数的转换公式，由四个系数（C0、C1、C2、C3）组成。

转换公式： line(曝光行) = C0\*VTS + C1 + C2 \* (time \* pclk / HTS + C3)

xml 对应参数：

第一个： C0 ，第二个： C1， 第三个 C2，第四个 C3

根据公式，反过来计算曝光时间为：

Time = ((line - C0 x vts - C1) / C2 - C3)\*hts/pclk

【注意事项】

默认4个系数分别为0、0、1、0.5，求得的曝光行数以1行为步进。一般该值无需修改。

CISGainSet

【描述】

与CIS相关的增益设置

【成员】


| 成员名称 | 描述 |
| --- | --- |
| CISAgainRange | sensor模拟增益/LCG支持的range，分别为最小值和最大值，其中最小值不得低于1。- 当sensor支持dual conversion gain时，此项可表示sensor支持的LCGrange.- 如遇到数字增益用于补足精度时，此项可表示sensor的total gainrange. |
| CISExtraAgainRange | sensor模拟增益(HCG)range，分别为最小值和最大值，其中最小值不得低于1。- 当sensor支持dual conversion gain时，此项表示sensor支持的HCGrange.- Range范围一般= CISAgainRange * dcg_ratio，但也有例外，如ov2718。具体以sensor原厂所给的datasheet为准。- 当sensor不支持dual conversion gain时，此项无效，建议最大最小值皆填1，方便debug查阅。 |
| CISDgainRange | Sensor支持的数字增益range，最小值不得低于1。如遇到数字增益用于补足精度时，此项的最大最小值皆填1 |
| CISIspDgainRange | Isp数字增益range，最小值不得低于13562平台的ISP数字增益最大值为32倍，可填写[1,32]；如无需使用ISP数字增益此处可写为[1,1] |
| CISHdrGainIndSetEn | Hdr模式下是否支持多帧的sensor曝光增益独立设置- 值为0，代表多帧共用一个增益，如sensor gc2093;-值为1，代表多帧支持独立设置增益。该模式仅针对HDR stagger模式，HDR DCG模式该参数无效 |

### CISTimeSet

【描述】

与CIS相关的曝光时间设置，根据曝光的模式不同，分为Linear和HDR两种模式，其中HDR又分为2帧和3帧两种配置。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| CISLinTimeRegMaxFac | Linear曝光模式下，最大曝光时间行与VTS的关系，由两个系数(CO,C1)组成MaxTimeLine = C0*vts – C1系数的具体值详见sensor原厂给出的datasheet |
| CISHdrTimeRegSumFac | Hdr曝光模式下，多帧最大曝光时间行之和与VTS的关系，由两个系数(CO,C1)组成MaxTimeLineSum = C0*vts - C1系数的具体值详见sensor原厂给出的datasheet |
| CISTimeRegMin | 线性/HDR曝光模式sensor曝光时间行（寄存器值）允许的最小值，为整型 |
| CISTimeRegOdevity | 线性/HDR曝光模式sensor曝光时间行奇偶性，由两个系数（CO,C1）组成Line = C0*x+C1- 无奇偶限制：CO=1C1=0- 固定奇数行：C0=2 C1=1- 固定偶数行：CO=2 C1=0- 固定为N的整数倍行：C0=N C1=0 |
| CISTimeRegUnEqualEn | Hdr模式Sensor对各帧（S/M/L）曝光时间行不相等限制- En=0 sensor Hdr模式允许各帧曝光时间行相等；- En=1 sensor Hdr模式不允许各帧曝光时间行相等。 |
| CISTimeRegMax | Hdr曝光模式sensor曝光时间行（寄存器值）允许的最大值，为整型。-该参数由3个元素组成，Hdr2帧时前2个元素有效，分别代表短帧、长帧对应的最大曝光时间行；Hdr3帧时3个元素皆有效，分别代表短帧、中帧、长帧对应的最大曝光时间行。-一般sensor对Hdr模式下各帧的最大曝光时间行无限制，此时该参数可填0，即代表sensor无最大曝光时间行的限制。当该值不为0时，各帧的曝光时间最大行以该参数为准。以imx307为例，该sensor对短帧的最大曝光行有限制，要求为222行，对长帧中帧则无此限制。因此该参数可填写为：[22200] |

CISHdrSet

【描述】

HDR模式的相关设置参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | Hdr模式使能，= 0 不支持Hdr模式；=1 支持Hdr模式使能。 |
| Support_mode | Hdr采用的帧模式，共支持4种类型。分别为MODE_2_LINE/MODE_3_LINE，MODE_2_FRAME/MODE_3_FRAME |
| Line_mode | Hdr采用的Line_mode，目前仅支持DCG和STAGGER两种模式。注：DOL等同STAGGER，统一写为STAGGER模式 |

### CISDcgSet

【描述】

Dual conversion gain功能设置参数模块，包含线性和HDR模式。该模块用于控制DCG的切换，要求sensor支持DCG模式切换的配置。如sensor的DCG功能为内部自动切换时，该模块需要关闭。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Support_en | 是否支持Dual conversion gain功能，=1时该模块参数有效，=0 表示不支持Dual conversion gain功能。 |
| dcg_optype | Dual conversion gain功能切换模式，分为RK_AIQ_OP_MODE_AUTO和RK_AIQ_OP_MODE_MANUAL。AUTO: 根据阈值进行LCG/HCG的切换MANUAL：不进行自动切换，采用固定值，以dcgmode_init为准。 |
| dcgmode_init | 各帧Dual conversion gain模式的初始值。 |
| dcg_ratio | conversion gain值 |
| sync_switch | 同步切换开关(仅HDR模式下有效）。=1，各帧同步切换Dual conversion gain模式，以长帧为准；=0，各帧不同步切换Dual conversion gain |
| gain_ctrl | 以曝光增益为准，切换Dual conversion gain。Icg2hcg_th：LCG转HCG阈值hcg2lcg_th：HCG转LCG阈值 |

### 【注意事项】

该模块用于控制DCG的切换，要求sensor支持DCG模式切换的配置。如sensor的DCG功能为内部自动切换时，该模块需要关闭。

Sensor采用HDR-DCG模式时，短曝帧固定为LCG, 长曝帧固定为HCG。因此需要将dcg\_optype 置为MANUAL，2帧时dcgmode\_init = [0 1 0]，3帧时dcgmode\_init=[0 0 1]。

若sensor不支持Dual conversion gain功能时，dcg\_ratio需要置为1。

### CISExpUpdate

【描述】

曝光生效模块参数，该模块参数一般从sensor的datasheet获知。鉴于部分sensor在normal模式和Hdr模式下曝光的生效帧数不同，该模块需要按照模式分开填写。

【成员】


| 成员名称 | 描述 |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

### 【注意事项】

该模块的值需要以sensor原厂所给的datasheet为准，不可随意设置。如该模块值出错，可能导致曝光调节过程中出现闪烁。

一般sensor的datasheet会描述曝光时间和增益的生效帧数。如曝光时间和增益在第n帧写入，n+2帧生效，则time\_delay = 2, gain\_delay =2，以此类推。

部分sensor的曝光时间和增益生效帧数不同，如该模块参数出错，则有可能在曝光调节的过程中出现曝光时间和增益生效不同步，导致闪烁现象。

### CISMinFps

【描述】

允许最小帧率，用于自动降帧模式，限制最小帧率，以防低照环境下，帧率过低导致拖影严重影响效果。

CISFlip

【描述】

Sensor输出图像方向控制。

bit 0，为镜像控制位（mirror）

bit 1，为上下翻转控制位（flip）

##### 4.1.2.5 moduleinfo参数

【描述】

模组信息参数，该模块参数一般从模组的datasheet获知。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| FNumber | 模组镜头的相对孔径大小，无需调试，与镜头相关 |
| EFL | 模组镜头的焦距，无需调试，与镜头相关 |
| LensTavg | 镜头透过率，无需调试，与镜头相关 |
| IRCutTavg | IRCut透过率，无需调试，与镜头相关 |

### 【注意事项】

该部分参数目前暂无效

#### 4.1.3 调试步骤

AEC模块的调试主要包括AE的目标值调试、AE的曝光量分解路径调试、AE的权重调试、AE收敛速度调试等。在进行ISP调试前，需要确认sensor驱动是否正常工作，与CIS相关的曝光参数是否设置正确，避免曝光设置错误。

调试AEC之前还需要确保如下模块标定已完成且功能正确：BLC、AWB、LSC、CCM，gamma模块可使用默认gamma曲线。

### 步骤1.Sensor曝光参数设置

如4.1.2章节的参数介绍，在进行正式调试前，需要确保SensorInfo参数的正确性，避免曝光设置错误或出现闪烁等问题。这个模块的参数来源于sensor原厂的datasheet，需要调试人员和负责驱动编写人员密切注意。完成模块参数的填写后，可以开启调试上述AE模块同步测试功能SyncTest进行测试。SyncTest功能通过循环设置N组不同曝光值，可测试sensor的曝光时间和曝光增益、及DCG切换生效帧数是否正确，还可用于测试曝光的线性度，从而确认曝光时间和曝光增益的寄存器值转换公式及相关参数是否正确。

如标定前参数已经确认完毕，该步骤可以跳过。

### 步骤2.设置AE权重参数



图4-5 AEC权重参数

需注意，部分型号芯片硬件支持更多分块亮度统计。为了方便调试，调试文件中统一设置15X15的权重，由算法内部根据块数进行权重的扩充。

### 步骤3.设置AE曝光分解参数

### 步骤4.设置AE目标亮度值

线性曝光模式建议开启动态目标亮度功能，以满足不同亮度场景的需求。线性模式的目标亮度设置涉及到DySetpoint、ToleranceIn/ToleranceOut、BackLightCtrl、OverExpCtrl参数等，各参数说明详见4.1.2章节。要求针对室内静态场景，亮度合适，不出现大面积过曝。环境从亮到暗，亮度能过平滑过渡。

### 步骤5.设置AE收敛及响应速度

AE收敛及响应速度的调节影响到曝光响应速度、收敛速度及调节过程的平滑性。该步骤涉及到的参数包括AecRunInterval、AecSpeed、AecDelayFrmNum，各参数说明详见4.1.2章节。可以在室内静态场景，开关灯来检测光线剧烈变化时的收敛速度。收敛速度加快可能造成亮度缓慢变化时过渡不平滑或者过冲，因此需要进行权衡。

### 4.2 NR & SHARP

isp去噪模块包含 bayernr 3d, ynr和cnr3个模块。

isp锐化模块包含sharp一个模块。



NR pipeline框图

建议按照pipeline上的先后顺序进行噪声调试，每个模块调试时候都需要考虑模块前后级的效果相互影响以及综合的效果。

在噪声调试过程中，需要按照顺序将各个步骤的效果对应输出查看，好明确每个步骤对去噪的影响。

如查看bayernr3d效果，需对比未去噪原始图，和仅打开bayern3d效果图。

如查看ynr效果，需要对比bayernr3d输出效果图，和仅经过ynr但是sharp关闭的图像对比。

以此类推。

#### 4.2.1 BayerTnr (Bayer3dnr)

##### 4.2.1.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | 动静判决中，低频、高频的中值滤波简化 | ISP32:lo_med _en, hi_med_enISP32-lite:无相关参数配置 |
| 2 | 动静判决中，高频的高斯滤波简化 | ISP32:hi_guass, kl_guass, hi_filter_filt_bay,hi_filter_filt_avg, hi_filter_filt_modeguass_guide_coeff0-3ISP32-lite:guass_guide_coeff0-2. |
| 3 | 新增边缘叠帧最大最小力度控制 | ISP32:无相关参数配置ISP32-lite:wgtmm_opt_en, wgtmm_sel_en,wgtmin |

##### 4.2.1.1 功能描述

此模块是在raw域数据上对图像进行时域的降噪和软阈值降噪处理。

其中对缩略图的当前帧和IIR帧数据进行运动判断和权重计算，图像多帧叠加，得到低频的叠帧降噪效果。

其中对原图的当前帧和IIR帧数据进行运动判断和权重计算，图像多帧叠加，得到高频的叠帧降噪效果。  

高低频权重多帧叠加后，再进行软阈值降噪滤波，得到最终3dnr输出结果。

此模块tuning时候需要标定数据和bayernr 2d模块是采用相同的标定数据。

该去噪模块基于噪声标定结果，建立更符合噪声特性的去噪模型。

支持分别针对高信噪比与低信噪比2种噪声标定以及噪声参数，

例如：支持双转换增益模式（Dual convertion gain DCG）的CIS，高转换增益(HCG)对应高信噪比模式，低转换增益(HCG)对应低信噪比模式。



bayernr3d框图

##### 4.2.1.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| thumbds_w | 调试参数 | 不常调试参数 |
| thumbds_h | 调试参数 | 不常调试参数 |
| lo_enable | 调试参数 | 常调试参数 |
| hi_enable | 调试参数 | 常调试参数 |
| lo_gsbay_en、lo_gslum_en | 调试参数 | 不常调试参数 |
| hi_gslum_en | 调试参数 | 不常调试参数 |
| hi_wgt_comp | 调试参数 | 不常调试参数 |
| lo_clipwgt | 调试参数 | 不常调试参数 |
| global_pk_en | 调试参数 | 不常调试参数 |
| global_pksq | 调试参数 | 不常调试参数 |
| hidif_th | 调试参数 | 不常调试参数 |
| lo_filter_strength | 调试参数 | 常调试参数 |
| hi_filter_strength | 调试参数 | 常调试参数 |
| soft_threshold_ratio | 调试参数 | 常调试参数 |
| lumapoint / sigma | 标定数据 | 标定工具产生参数 |
| lumapoint2 / lo_sigma | 标定数据 | 标定工具产生参数 |
| lumapoint2 / hi_sigma | 标定数据 | 标定工具产生参数 |
| lo_filter_rat0 | 调试参数 | 常调试参数 |
| lo_filter_thed0 | 调试参数 | 常调试参数 |
| hi_filter_rat0 | 调试参数 | 常调试参数 |
| hi_filter_thed0 | 调试参数 | 常调试参数 |
| hi_filter_rat1 | 调试参数 | 常调试参数 |
| hi_filter_thed1 | 调试参数 | 常调试参数 |
| trans_en | 调试参数 | 不常调试参数 |
| wgt_use_mode | 调试参数 | 不常调试参数 |
| wgt_mge_mode | 调试参数 | 不常调试参数 |
| wgtmm_opt_en | 调试参数 | 不常调试参数 |
| wgtmm_sel_en | 调试参数 | 不常调试参数 |
| wgtmin | 调试参数 | 不常调试参数 |
| guass_guide_coeff0/1/2 | 调试参数 | 不常调试参数 |

### Enable:

【描述】

Bayernr3d模块使能位，0：关闭，1：打开。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

### thumbds\_w / thumbds\_h

【描述】

下采样比例。共有4x4, 8x4, 8x8这3种模式。默认使用8x4模式。

其中4x4和4x8模式，内存可使用sram也可使用ddr内存。

8x8模式，如果使用sram内存，那分辨率宽不能大于1440。

8x8模式，如果使用ddr内存，则分辨率无上面限制。

lo\_enable

【描述】

低频运动判断是否打开, 1打开，0关闭。默认打开。

lo\_enable的动态变化会导致isp卡死，目前代码中固定lo\_enable为1.

hi\_enable

【描述】

高频运动判断是否打开, 1打开，0关闭。默认打开。

lo\_gsbay\_en、lo\_gslum\_en

【描述】

内部低频子模块开关, 1打开，0关闭。默认打开。

hi\_gslum\_en

【描述】

内部高频子模块开关, 1打开，0关闭。默认打开。

hi\_wgt\_comp

【描述】

3588模式的权重融合模式下，叠加权重回补的比例系数值,只在高频打开的时候才有用;

默认值0.16， 取值范围[0.0, 1.0]。

一般不太常调节，使用默认值。

### lo\_clipwgt

【描述】

图像叠加的权重限制值。值越小对权重限制越小，最大叠帧力度变强。

默认值0.03215， 取值范围[0.0, 1.0]。

一般不太常调节，使用默认值。

### global\_pk\_en

【描述】

时域降噪是否使用全局 pk还是使用局部pk, 1：使用全局pk，0:使用局部pk。

默认值为0。

### global\_pksq

【描述】

全局 pk 的平方值，当global\_pk\_en为 1 的时候才用它.

默认值1024， 取值范围[0, 268435455]。

一般不太常调节，使用默认值。

### hidif\_th

【描述】

高频差异阈值，主要影响差异统计结果，对效果无影响。

默认值32767， 取值范围[0, 65535]。

一般不太常调节，使用默认值。

### lo\_filter\_strength

【描述】

低频运动判断计算的图像叠加强度。

值越大,叠加力度越强,运动判断准确性越低.

默认值1， 取值范围[0.0, 16.0]。

### hi\_filter\_strength

【描述】

高频运动判断计算的图像叠加强度。

值越大,叠加力度越强,运动判断准确性越低.

取值范围[0.0, 16.0], 默认值1。

### soft\_threshold\_ratio

【描述】

软阈值权重。值越大，保留噪声越多。

取值范围[0.0 1.0]，默认值0。

### lumapoint / sigma

【描述】

像素不同亮度对应的噪声曲线值。共16个点。

lumapoint对应像素亮度，取值范围[0, 65535]；

sigma对应噪声曲线值，取值范围[0, 65535]。

### lumapoint2 / lo\_sigma

【描述】

运动判断的噪声曲线的低频sigma。共16个点。

lumapoint2对应像素亮度，取值范围[0, 65535]；

lo\_sigma对应噪声曲线值，取值范围[0, 65535]。

### lumapoint2 / hi\_sigma

【描述】

运动判断的噪声曲线的高频sigma。共16个点。

lumapoint2对应像素亮度，取值范围[0, 65535]；

hi\_sigma对应噪声曲线值，取值范围[0, 65535]。

### lo\_filter\_rat0

【描述】

低频运动判断权重计算时,差异值要减掉的数据比例参数。

取值范围[0.0, 16.0], 默认值1。

### lo\_filter\_thed0

【描述】

低频运动判断权重计算时,差异值要减掉的数据偏移参数.

取值范围[0, 4095], 默认值0。

### hi\_filter\_rat0

【描述】

高频运动判断第一个权重计算时,差异值要减掉的数据比例参数,主要对静止区域的高频影响更多.

取值范围[0.0, 16.0], 默认值1。

### hi\_filter\_thed0

【描述】

高频运动判断第一个权重计算时,差异值要减掉的数据偏移参数, 主要对静止区域的高频影响更多.

取值范围[0, 4095], 默认值256。

### hi\_filter\_rat1

【描述】

高频运动判断第二个权重计算时,差异值要减掉的数据比例参数,主要是影响边缘等纹理比较强的高频.

取值范围[0.0, 16.0], 默认值1。

### hi\_filter\_thed1

【描述】

高频运动判断第二个权重计算时,差异值要减掉的数据偏移参数,主要是影响边缘等纹理强的高频

取值范围[0, 4095], 默认值1024。

### trans\_en

【描述】

省带宽模式是否开启。

0：不开启，1:开启。默认值为0。

正常线性模式，此参数可设置为1.

hdr模式，此参数建议设置为0，以图像效果为优先。

wgt\_use\_mode、wgt\_mge\_mode

【描述】

权重融合对应不同融合计算方法。

$$

```
1 : \mathrm { ~ w g t _ u s e _ m o d e } = 0 , \mathrm { w g t _ m g e _ m o d e } = 0 \not \Xi \not \Xi \not \equiv 1
```

$$

和3588相同的权重融合计算方法。

$$

\mathsf &#123; W m &#125; = \mathsf &#123; W &#125; \mathsf &#123; I o &#125; ^ &#123; \star &#125; \mathsf &#123; W h 0 &#125; + \mathsf &#123; h i \_ w g t \_ c o m p &#125; ^ &#123; \star &#125; ( \mathsf &#123; W &#125; \mathsf &#123; I o &#125; - \mathsf &#123; W h 0 &#125; )

$$

2：wgt\_use\_mode = 1, wgt\_mge\_mode=0

Wm =(1- Wlo) \* (1-Wh0) + (1-Wh1)

3：wgt\_use\_mode = 1, wgt\_mge\_mode=1

Wm = Wlo \* Wh0 + Wh1

默认使用wgt\_use\_mode = 1, wgt\_mge\_mode=1

### wgtmm\_opt\_en

【描述】

是否开启isp32lite新增最大或者最小叠帧力度功能是否开启位。

0：不开启，1：开启。

默认为0。

wwgtmm\_sel\_en

【描述】

isp32lite新增功能选择位：

0：控制最大叠帧力度，1：控制最小叠帧力度。

默认为0。

wgtmin

【描述】

isp32lite新增最大或者最小叠帧力度的配置位。

取值范围[0, 1]。

默认值为0.

### hi\_filter\_abs\_ctrl

【描述】

高频权重计算时绝对值位置选择

0: Difference-&gt;median-&gt;Gaussian-&gt;abs

1: Difference-&gt;median-&gt;abs-&gt;Gaussian

默认值为0.

### guass\_guide\_coeff0-2

【描述】

高斯滤波算子。

取值范围[0, 64]。默认值为16，8， 4。

$$

\mathsf &#123; c o e f f &#125; [ 0 ] + 4 ^ &#123; \star &#125; \mathsf &#123; c o e f &#125; [ 1 ] + 4 ^ &#123; \star &#125; \mathsf &#123; c o e f &#125; [ 2 ] = 6 4 ;

$$

##### 4.2.1.3 调试步骤

关闭ynr,cnr,sharp模块，调节filter\_strength,lo\_clipwgt,hi\_clipwgt 参数，平衡去噪和拖影水平。

调试高低频力度的时候，先调低频，再调高频。可以先将静止区域的噪声调至稳定没有跳动，再观察运动区域是否有透的情况，调试参数要保证两者都稳定。如果噪声太大到超过算法的边界，只能满足一项,就要做取舍。

如果要更多保留高频，可以调试hi\_filter\_sig的参数，值越小高频保留越多，静止区域的噪声会越大。

主要调试off0和off1即可，off0主要影响静止区域的高频，而off1是影响强纹理的高频,

运动区域和静止区域是bayer3dnr内部自适应做判断。它会通过模块的输出gain数据来区分，gain越大说明运动越强。bayer3dnr会把gain数据分别传递给ynr，它们会根据gain来加强对运动区域的降噪。

正常时域多帧叠加去噪是不会影响噪声形态。

但是在多帧叠加后，bayernr3d里还有一个软阈值处理，所以会影响噪声形态。

软阈值处理越强，噪声颗粒会变的更低频。

#### 4.2.2 Bayer2dnr

##### 4.2.2.0 ISP32-lite vs ISP32 差异点


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

#### 4.2.3 YNR

##### 4.2.3.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | 一致 | ISP32:ISP32-lite: |

##### 4.2.3.1 功能描述

该模块在YUV域上对图像亮度信号进行去噪等处理。

YNR模块可以分为预滤波子模块、低频降噪模块和高频降噪模块。

低频降噪分为两个部分：大范围低频滤波和软阈值处理。

高频降噪使用7x7的保边滤波来实现，并适应自适应计算噪声的方式来得到噪声的估计值。

ynr会利用gain模块记录的局部噪声大小来针对local不同区域去噪力度不同。

ynr还会针以图像中心为原点，对径向设置不同去噪力度，来解决lsc校正后对应边角噪声变大的问题。

该去噪模块基于噪声标定结果，建立更符合噪声特性的去噪模型。

支持分别针对高信噪比与低信噪比2种噪声标定以及噪声参数，

例如：支持双转换增益模式（Dual convertion gain DCG）的CIS，高转换增益(HCG)对应高信噪比模式，低转换增益(HCG)对应低信噪比模式。



图4-2-3-1 YNR功能框图

##### 4.2.3.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| lumaPoint / sigma | 标定数据 | 标定工具产生参数 |
| lci | 标定数据 | 标定工具产生参数 |
| hci | 标定数据 | 标定工具产生参数 |
| lo_lumaPoint / lo_ratio | 调试参数 | 常调试参数 |
| hi_lumaPoint / hi_ratio | 调试参数 | 常调试参数 |
| ynr_bft3x3_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_Ibft5x5_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_lgft3x3_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_flt1x1_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_nlm11x11_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_global_gain_alpha | 调试参数 | 不常调试参数 |
| ynr_global_gain | 调试参数 | 不常调试参数 |
| ynr_adjust_thres | 调试参数 | 常调试参数 |
| ynr_adjust_scale | 调试参数 | 常调试参数 |
| rnr_strength | 调试参数 | 常调试参数 |
| low_bf | 调试参数 | 常调试参数 |
| low_thred_adj | 调试参数 | 常调试参数 |
| low_peak_supress | 调试参数 | 常调试参数 |
| low_edge_adj_thresh | 调试参数 | 常调试参数 |
| low_Ibf_weight_thresh | 调试参数 | 常调试参数 |
| low_center_weight | 调试参数 | 常调试参数 |
| low_dist_adj | 调试参数 | 常调试参数 |
| low_weight | 调试参数 | 常调试参数 |
| low_filt_strength | 调试参数 | 常调试参数 |
| low_bi_weight | 调试参数 | 常调试参数 |
| hi_weight_offset | 调试参数 | 常调试参数 |
| hi_center_weight | 调试参数 | 常调试参数 |
| hi_bf_scale | 调试参数 | 常调试参数 |
| hi_min_sigma | 调试参数 | 常调试参数 |
| hi_nr_weight | 调试参数 | 常调试参数 |
| hi_gain_alpha | 调试参数 | 常调试参数 |
| hi_filter_coeff1_1/2/3 | 调试参数 | 不常调试参数 |
| hi_filter_coeff2_1/2/3 | 调试参数 | 不常调试参数 |

Enable:

【描述】

ynr模块使能开关，1：模块打开，0：模块关闭。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。

hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

lumaPoint / sigma

【描述】

标定工具产生噪声sigma曲线。

lci

【描述】

标定工具产生低频噪声sigma影响因子。值越大，噪声sigma越大，去噪力度越强。

hci

【描述】

标定工具产生高频噪声sigma影响因子。值越大，噪声sigma越大，去噪力度越强。

lo\_lumaPoint / lo\_ratio

【描述】

局部调节噪声曲线低频sigma形状。

lo\_lumaPoint 取值范围[0, 256].

lo\_ratio 取值范围[0.0, 2.0].

hi\_lumaPoint / hi\_ratio

【描述】

局部调节噪声曲线低频sigma形状。

hi\_lumaPoint 取值范围[0, 256].

hi\_ratio 取值范围[0.0, 2.0].

【描述】

模块内部子模块bypass功能。0：功能使能。 1：功能bypass。

一般情况，全部子模块都打开使能，这几个值设置为0。

### ynr\_global\_gain\_alpha/ynr\_global\_gain

【描述】

ynr去噪local模式和global模式插值力度配置。

一般使用默认值，不用配置，全部使用local gain的方式。

公式：Gain=(global\_gain\_alphaglobal\_gain+(8-global\_gain\_alpha)local\_gain )&gt;&gt;3

global gain alpha 取值范围[0.0 1.0]，默认值0。

global gain取值范围[0.0 64.0]。默认值1。

### ynr\_adjust\_thresh /ynr\_adjust\_scale

【描述】

对大于阈值ynr\_adjust\_thresh的噪声进行去噪力度控制。

设计是认为运动区域噪声比较大，设定合适阈值，增强运动区域ynr去噪力度。

ynr\_adjust\_thresh，取值范围[0.0, 1.0], 默认值1。

ynr\_adjust\_scale，取值范围[0, 16.0], 默认值1。

### rnr\_strength

【描述】

图像中心，按照圆的半径r方向，设置不同去噪力度。

取值范围[0, 16.0 ]，默认值1。

low\_bf

【描述】

双边滤波力度参数。

第一行是原图3x3双边滤波力度，值越大，去噪越强。

取值范围[0.01, 32]，默认值1。

第二行是上一帧小图5x5双边滤波力度，值越大，去噪越强。

取值范围[0.01, 32]，默认值1。

low\_thred\_adj

【描述】

低频软阈值的调整力度，值越大，低频降噪力度越大。

取值范围[0, 31]，默认值0.5。

### low\_peak\_supress

【描述】

控制去除孤立噪声的力度，值越小，去噪力度越大。

取值范围[0, 1]，默认值0.5。

### low\_edge\_adj\_thresh

【描述】

小图边缘检测的调整系数的门限，用于限制调整系数所能取到的最大值。

值越小，去噪力度越大，图像越模糊。取值范围[0, 1023]整数，默认值7。

low\_lbf\_weight\_thresh

【描述】

用于对 5x5 的双边滤波的权重进行限制， 该值越大，则低频降噪力度越弱。

取值范围[0.0,1.0]。默认值0.25。

low\_center\_weight

【描述】

5x5 双边滤波时中心点的权重，该值越小，则降噪力度越强。

取值范围[0,128]，默认值0.5。

low\_dist\_adj

【描述】

双边滤波距离权重调整因子。值越小，去噪越强。

取值范围[0, 127.0]，默认值8.0。

### low\_weight

【描述】

低频去噪结果的权重,值越大，低频降噪力度越大。

取值范围[0, 1]，默认值0.5。

### low\_filt\_strength

【描述】

第一行对原图进行高斯滤波的滤波核权重。

取值范围[0，1.0]，默认值0.7。

第二行对双边滤波的结果进行高斯滤波的滤波核权重。

取值范围[0，1.0]，默认值0.85。

### low\_bi\_weight

【描述】

软阈值处理中使用的第一步双边滤波权重，该值越大，则降噪力度也越大。

取值范围[0, 1]，默认值0.3。

### hi\_weight\_offset

【描述】

算出来的加权权重减去该值，用于额外调整权重，值越大则降噪力度越弱。

取值范围[0, 1.0]，默认值0.05。

### hi\_center\_weight

【描述】

高频中心点的权重，越大则降噪力度越弱。

取值范围[0, 1]，默认值0.8。

hi\_bf\_scale

【描述】

高频降噪的力度控制，越大则去噪力度越强。

取值范围[0.0, 16.0]，默认值1.0。

hi\_min\_sigma

【描述】

最小噪声门限值，实际上是平坦区域使用的噪声估计值，值越大，则平坦区域的降噪力度越强。

取值范围[0.0, 1.0]，默认值0.0068。

### hi\_nr\_weight

【描述】

高频降噪结果和原图的叠加权重，该值越大则降噪力度越强。

取值范围[0, 1.0]，默认值0.8。

hi\_gain\_alpha

【描述】

高频降噪的local gain使用比例，值越大使用local gain的比例越高。

取值范围[0, 1.0]，默认值1。

hi\_filter\_coeff1\_1 / hi\_filter\_coeff1\_2 / hi\_filter\_coeff1\_3

【描述】

高斯滤波算子1。

取值范围[0, 15]. 默认值为：7,6,3。

hi\_filter\_coeff2\_1 / hi\_filter\_coeff2\_2 / hi\_filter\_coeff2\_3

【描述】

高斯滤波算子2。

取值范围[0, 15].默认值为：6,5,3。

##### 4.2.3.3 调试步骤

关闭sharp模块。

低频降噪分为两个部分：大范围低频滤波和软阈值处理。

调试方式：

先调整sw\_low\_bf2和sw\_low\_center\_weight控制整体的低频降噪力度；

调整sw\_low\_thred\_adj控制软阈值的力度，用于调整图像中纹理和大噪点的形态；

弱出现格子或者明显bandding，调整sw\_low\_dist\_adj，若运动处出现类似拖影的阴影，则调整sw\_low\_lbf\_weight\_thresh。

高频降噪使用7x7的保边滤波来实现，并适应自适应计算噪声的方式来得到噪声的估计值。

先调试sw\_hi\_bf\_scale和sw\_hi\_center\_weight调试高频降噪的整体力度；

若平坦区域力度不够，调整sw\_high\_min\_sigma；

调整sw\_hi\_gain\_alpha，控制local gain的使用比例，控制运动区域的力度

纹理区域的锐利程度用sw\_high\_weight\_offset进行调整

#### 4.2.4 CNR

##### 4.2.4.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | 缩略图下采样模式更新。 | ISP32:down_scale_x,dow_scale_y：支持2x2,4x4,8x6三种模式ISP32-lite:down_scale_x,dow_scale_y：支持4x4,8x4两种模式 |

##### 4.2.4.1 功能描述

本模块主要是针对uv数据进行彩色噪声降噪处理。

算法的整体思路是先将原始图像进行均值下采样，得到下采样图像，对下采样图像进行IIR滤波，以IIR滤波后的缩略图为导向对输入图像进行保边处理，去除图像的色噪。

模块支持分别针对高信噪比与低信噪比2种噪声模式的参数设置，

例如：支持双转换增益模式（Dual convertion gain DCG）的CIS，高转换增益(HCG)对应高信噪比模式，低转换增益(HCG)对应低信噪比模式。



图4-2-3-1 CNR功能框图

##### 4.2.4.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| down_scale_x | 调试参数 | 不常调试参数 |
| down_scale_y | 调试参数 | 不常调试参数 |
| thumb_sigma | 调试参数 | 常调试参数 |
| thumb_bf_ratio | 调试参数 | 常调试参数 |
| chroma_filter_strength | 调试参数 | 常调试参数 |
| chroma_filter_wgt_clip | 调试参数 | 常调试参数 |
| anti_chroma_ghost | 调试参数 | 常调试参数 |
| chroma_filter_uv_gain | 调试参数 | 常调试参数 |
| wgt_slope | 调试参数 | 常调试参数 |
| gaus_ratio | 调试参数 | 常调试参数 |
| bf_sigmaR | 调试参数 | 常调试参数 |
| bf_uvgain | 调试参数 | 常调试参数 |
| bf_ratio | 调试参数 | 常调试参数 |
| hbf_wgt_clip | 调试参数 | 常调试参数 |
| bf_wgt0_sel | 调试参数 | 常调试参数 |
| global_alpha | 调试参数 | 常调试参数 |
| saturation_adj_offset | 调试参数 | 常调试参数 |
| saturation_adj_ratio | 调试参数 | 常调试参数 |
| global_gain | 调试参数 | 不常调试参数 |
| global_gain_alpha | 调试参数 | 不常调试参数 |
| local_gain_scale | 调试参数 | 常调试参数 |
| global_gain_thumb | 调试参数 | 不常调试参数 |
| global_gain_alpha_thumb | 调试参数 | 不常调试参数 |
| gain_adj_strength_ratio | 调试参数 | 不常调试参数 |
| thumb_filter_wgt_coeff | 调试参数 | 不常调试参数 |
| gaus_coeff | 调试参数 | 不常调试参数 |

Enable

【描述】

模块开关使能。1：模块打开，0：模块关闭。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

down\_scale\_x / down\_scale\_y

【描述】

缩略图下采样比例。

目前仅支持4x4, 8x4两种模式。

默认使用4x4模式。

thumb\_sigma

【描述】

缩略图保边滤波Y通道sigma。值越大，滤波力度越大。

取值范围[0.0, 1.0]。默认值0.01。

thumb\_bf\_ratio

【描述】

缩略图保边滤波全局融合权重。值越大，滤波力度越大。

取值范围[0.0， 1.0]。默认值1。

chroma\_filter\_strength

【描述】

缩略图IIR滤波力度，值越大，滤波力度越大。

取值范围[0, 1.0]。默认值0.01。

chroma\_filter\_wgt\_clip

【描述】

缩略图IIR滤波IIR权重clip值，值越大，最大滤波力度越大。

取值范围[0, 16.0]。默认值0.9。

### anti\_chroma\_ghost

【描述】

缩略图IIR滤波抑制拖影阈值，值越小，色度拖影越严重。

取值范围[0.0, 1.0]。默认值0.0313。

chroma\_filter\_uv\_gain

【描述】

缩略图IIR滤波中计UV分量差值占比，值越大，UV分量占比越大。

取值范围[0.0, 1.0]。默认值0.333。

wgt\_slope

【描述】

指数权重曲线斜率。

取值范围[0.0, 8.0]。默认值0.7。

gaus\_ratio

【描述】

输入图像高斯滤波全局融合权重，值越大，高斯滤波结果占比越大。

取值范围[0.0, 1.0]。默认值0。

bf\_sigmaR

【描述】

保边滤波力度，值越大，滤波力度越大。

取值范围[0.0, 1.0]。默认值0.03。

bf\_uvgain

【描述】

保边滤波UV分量差值占比，值越小，滤波力度越大。

取值范围[0.0, 8.0]。默认值3。

bf\_ratio

【描述】

保边滤波当前点权重，值越大，滤波力度越小。

取值范围[0.0, 1.0]。默认值0.0625。

hbf\_wgt\_clip

【描述】

保边滤波权重clip值，

取值范围[0.0, 1.0]。默认值0.0078。

### bf\_wgt0\_sel

【描述】

双边权重和为0的时候，就是在小图上没有找到相似点的情况下，是选择输出原图还是选择输出高斯滤波的图像。

0：输出原图。

1：输出高斯滤波图像。

global\_alpha

【描述】

保边滤波全局融合权重，值越大，滤波力度越大。

取值范围[0.0, 1.0]。默认值1。

### saturation\_adj\_offset

【描述】

饱和度调整的offet，值越小，饱和度低的区域回填越多。

取值范围[0.0, 511.0]。默认值0。

saturation\_adj\_ratio

【描述】

饱和度调整的力度，值越大，饱和度回填越多。

取值范围[0.0, 32.0]。默认值0。

### global\_gain / global\_gain\_alpha

【描述】

global\_gain：全局gain，值越大，滤波力度越大。

global\_gain\_alpha：全局gain和局部gain融合的权重，值越大，全局gain占比越大。

cnr去噪local gain和global gain插值力度配置。

一般使用默认值，不用配置，全部使用local gain的方式。

公式：Gain=(global\_gain\_alpha \* global\_gain+(8-global\_gain\_alpha)\*local\_gain )&gt;&gt;3

global gain alpha 取值范围[0.0 1.0]，默认值0。

global gain取值范围[0.0 64.0]，默认值1。

### local\_gain\_scale

【描述】

局部gain缩放的比例，值越大，局部gain越大。

取值范围[0.0, 1.0]，默认值0.5。

### global\_gain\_thumb / global\_gain\_alpha\_thumb

【描述】

global\_gain\_thumb：缩略图IIR滤波中，全局滤波力度调整大小，值越大，滤波力度越小。

global\_gain\_alpha\_thumb： 缩略图IIR滤波中，全局滤波力度调整的比例。

目前芯片无此功能，此值须固定为1.0.

cnr缩略图iir帧对应local gain 和global gain插值力度配置。

一般使用默认值，不用配置，全部使用local gain的方式。

公式：Gain=(global\_gain\_alpha\_thumb \* global\_gain\_thumb + (8-

global\_gain\_alpha\_thumb)\*local\_gain )&gt;&gt;3

global gain alpha\_thumb 取值范围[1.0 1.0]，默认值1.0。

global\_gain\_thumb 取值范围[0.0 64.0]，默认值1。

### gain\_adj\_strength\_ratio

【描述】

根据gain调整去噪力度的表格，值越大，滤波力度越小。

横轴坐标gain值为[0,4,8,12,16,24,32,48,64,128,256,512,1024]。

取值范围[0.0, 4.0]，默认值1.0.

thumb\_filter\_wgt\_coeff

【描述】

缩略图保边滤波空域权重，值越大，滤波力度越大。

取值范围[0.0, 10]，默认值1.0.

### gaus\_coeff

【描述】

输入图像高斯滤波系数。

取值范围[0, 127]。

默认系数配置为：48，28，6，28，17，4.

需满足条件coef0 + 2coef1 + 2coef2 + 2coef3 + 4coef4 + 4\*coef5 = 256

YUV420 处理高斯核：


| Coeff5 | Coeff4 | Coeff3 | Coeff4 | Coeff5 |
| --- | --- | --- | --- | --- |
| Coeff2 | Coeff1 | Coeffo | Coeff1 | Coeff2 |
| Coeff5 | Coeff4 | Coeff3 | Coeff4 | Coeff5 |

##### 4.2.4.3 调试步骤

关闭sharp模块。

控制高频和低频色噪的去除，权衡色度侵染、饱和度降低等瑕疵。

#### 4.2.5 SHARP

##### 4.2.5.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | add_mode | ISP32:无 ISP32-lite:新增 |
|  |  | ISP32:无 |
| 2 | clip_hf_mode | ISP32-lite:新增 |
| 3 | noiseclip_mode | ISP32:有ISP32-lite:删除 |
| 4 | hf_clip_neg | ISP32:无ISP32-lite:新增 |
| 5 | local_sharp_strength | ISP32:无ISP32-lite:新增 |
| 6 | noiseclip_strength | ISP32:有ISP32-lite:删除 |
| 7 | noise_sigma_clip | ISP32:有ISP32-lite:删除 |
| 8 | enhance_bit | ISP32:有ISP32-lite:删除 |

##### 4.2.5.1 功能描述

Sharpen模块用于增强图像的清晰度。

算法的整体思路是先对图像进行预处理，在预处理的结果上进行高频信息的提取，对提取的高频信息进行保边滤波并增强后再叠加到预处理图像上得到锐化的图像。

Sharp模块主要由预处理模块、 高频计算及滤波模块 、权重计算（距离、外部gain、纹理检测）、锐化模块等子模块构成。

支持分别针对高信噪比与低信噪比2种噪声模式下锐化参数设置，

例如：支持双转换增益模式（Dual convertion gain DCG）的CIS，高转换增益(HCG)对应高信噪比模式，低转换增益(HCG)对应低信噪比模式。



##### 4.2.5.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| clip_hf_mode | 调试参数 | 常调试参数 |
| add_mode | 调试参数 | 常调试参数 |
| iso | 调试参数 | 常调试参数 |
| pbf_gain | 调试参数 | 常调试参数 |
| pbf_add | 调试参数 | 常调试参数 |
| pbf_ratio | 调试参数 | 常调试参数 |
| gaus_ratio | 调试参数 | 常调试参数 |
| sharp_ratio | 调试参数 | 常调试参数 |
| bf_gain | 调试参数 | 常调试参数 |
| bf_add | 调试参数 | 常调试参数 |
| luma_point / luma_sigma | 调试参数 | 常调试参数 |
| luma_point / lum_clip_h | 调试参数 | 常调试参数 |
| luma_point / hf_clip_neg | 调试参数 | 常调试参数 |
| luma_point / local_sharp_strength | 调试参数 | 常调试参数 |
| global_clip_pos | 调试参数 | 常调试参数 |
| prefilter_coeff | 调试参数 | 常调试参数 |
| GaussianFilter_coeff | 调试参数 | 常调试参数 |
| hfBilateralFilter_coeff | 调试参数 | 常调试参数 |
| kernel_sigma_enable | 调试参数 | 常调试参数 |
| prefilter_sigma | 调试参数 | 常调试参数 |
| hfBilateralFilter_sigma | 调试参数 | 常调试参数 |
| GaussianFilter_sigma | 调试参数 | 常调试参数 |
| GaussianFilter_radius | 调试参数 | 常调试参数 |
| exgain_bypass | 调试参数 | 常调试参数 |
| global_gain | 调试参数 | 常调试参数 |
| global_gain_alpha | 调试参数 | 常调试参数 |
| local_gainscale | 调试参数 | 常调试参数 |
| gain_adj_sharp_strength | 调试参数 | 常调试参数 |
| dis_adj_sharp_strength | 调试参数 | 常调试参数 |
| center_mode | 调试参数 | 不常调试参数 |

### Enable:

【描述】

Sharp模块使能开关。

1：模块打开，0：模块关闭。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

clip\_hf\_mode

【描述】

根据图像亮度数据查找高频clip值的上限。1：使用高斯滤波后的图像数据，0：使用模块原始输入数据。

add\_mode

【描述】

锐化最终效果叠加模式。1：在原始输入数据上叠加锐化效果，0：在双边滤波后的数据上叠加最终锐化效果。

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

pbf\_gain

【描述】

预滤波 sigma 乘以的比例，值越大，滤波越强，噪声越小，细节更少。

取值范围[0.0, 2.0], 默认值1.0 。

pbf\_add

【描述】

预滤波 sigma 叠加的偏移，值越大，滤波越强，噪声越小，细节更少。

取值范围[0, 1023], 默认值0。

pbf\_ratio

【描述】

预滤波融合权重，值越大，滤波越强，噪声越小，细节更少。

取值范围[0.0, 1.0], 默认值0.5。

gaus\_ratio

【描述】

高频双边滤波的导向图像为高斯滤波与原图融合的结果。

值越大，高斯双边滤波的导向权重更大。

取值范围[0.0, 1.0], 默认值0。

sharp\_ratio

【描述】

锐化强度，值越大，锐化越强。

取值范围[0.0, 32], 默认值6。

### bf\_gain

【描述】

高频双边滤波 sigma 乘以的比例， 值越大，滤波越强，噪声越小，细节更少。

取值范围[0.0, 2.0], 默认值1.0 。

### bf\_add

【描述】

高频双边滤波 sigma 叠加的偏移。值越大，滤波越强，噪声越小，细节更少。

取值范围[0, 1023], 默认值0。

### bf\_ratio

【描述】

高频双边滤波融合权重。值越大，滤波越强，噪声越小，细节更少。

取值范围[0.0, 1.0], 默认值0.5。

### luma\_point / luma\_sigma

【描述】

不同pixel亮度，对应不同噪声sigma曲线。

luma\_point为曲线亮度值，取值范围[0, 1023] 。

luma\_sigma为噪声强度值，取值范围[0, 1023] 。

### luma\_point / lum\_clip\_h

【描述】

不同pixel亮度高频值 白边clip 的范围。

值越大，允许的最大锐化强度越强。

取值范围[0, 1023]。默认值256。

luma\_point / hf\_clip\_neg

【描述】

不同pixel亮度高频值 黑边clip 的范围。

值越大，允许的最大锐化强度越强。

取值范围[0, 1023]。默认值256。

luma\_point / local\_sharp\_strength

【描述】

计算不同pixel亮度，局部高频叠加权重的比例。

值越大，允许叠加的高频越大，图像越锐化。

取值范围[0, 1023]。默认值512。

### global\_clip\_pos

【描述】

取值范围0,1,2。默认值为0。

0：dis\_adj\_sharp\_strength[21]为0，lum\_clip\_h和hf\_clip\_neg最大值不受限制。

1：dis\_adj\_sharp\_strength[21]为64，lum\_clip\_h和hf\_clip\_neg最大值为256。

2：dis\_adj\_sharp\_strength[21]为128，lum\_clip\_h和hf\_clip\_neg最大值为512。

### prefilter\_coeff:

【描述】

预滤波算子。

取值范围[0.0, 1.0]，默认值：0.2042，0.1238，0.0751。

GaussianFilter\_coeff

【描述】

高斯滤波算子。

取值范围[0.0, 1.0]，默认值：0.1621，0.0983，0.0596，0.0219，0.0133，0.003。

hfBilateralFilter\_coeff

【描述】

高频双边滤波算子。

取值范围[0.0, 1.0]，默认值：0.2042，0.1238，0.0751。

### kernel\_sigma\_enable:

【描述】

所有滤波算子系数采用sigma来计算使能位。

1：使用sigma值输入，自动计算标准算子值。

0：采用上面，算子各个系数配置方式。

### prefilter\_sigma:

【描述】

预滤波算子sigma值。

取值范围[0, 100.0]，默认值1。

### hfBilateralFilter\_sigma

【描述】

高频双边波算子sigma值。

取值范围[0, 100.0]，默认值1。

GaussianFilter\_sigma

【描述】

高斯滤波算子sigma值。

取值范围[0, 100.0]，默认值2。

GaussianFilter\_radius

【描述】

高斯滤波算子半径大小。

取值范围1或者2，默认值2。

1：使用高斯3x3滤波算子。

2：使用高斯5x5滤波算子。

exgain\_bypass

【描述】

局部gain模块开关。

0：使用局部gain。

1：不使用局部gain。

### global\_gain

【描述】

全局gain，值越大，局部锐化权重越小

取值范围[0.0, 63.0]，默认值1。

### global\_gain\_alpha

【描述】

全局gain和局部gain融合的权重，值越大，全局gain占比越大。

取值范围[0.0, 1.0]，默认值0。

### local\_gainscale

【描述】

局部gain缩放的比例，值越大，局部gain越大。

取值范围[0.0, 1.0]，默认值0。

### gain\_adj\_sharp\_strength

【描述】

根据gain值调整锐化权重的表格，值越大，局部锐化权重越大。

横轴坐标gain值为[1,2,4,8,16,24,32,48,64,128,256,512,1024]。

取值范围[0.0, 31.0]，默认值1。

dis\_adj\_sharp\_strength

【描述】

径向锐化力度调整表格，值越大，局部锐化权重越大。

取值范围[0.0, 1.0]，默认值1。

##### 4.2.5.3 调试步骤

调节sharp\_ratio, local\_sharp\_strength, lum\_clip\_h，hf\_clip\_neg 控制高频边缘增强的力度。

调节gaus\_ratio, pbf\_ratio, pbf\_gain, pbf\_add，bf\_ratio, bf\_gain, bf\_add，用于降低锐化带来的噪声，用来平衡噪声和锐化细节的参数。

通过调节gain\_adj\_sharp\_strength，分别来调节运动区域和静止区域的锐化力度。

通过调节dis\_adj\_sharp\_strength，分别来调节因lsc校正导致边角噪声锐化程度。

通过调节local\_sharp\_strength，分别来调节局部锐化程度。

Sharp模块可以对细节的增强同时对噪声抑制，但最终不可避免还是会带来整体噪声的增加。

#### 4.2.6 gain

##### 4.2.6.1 功能描述

gain模块为外部存储的局部local gain模块。

各个模块会均会向此模块进行输出，ynr,cnr,sharp模块会读取此模块gain值，分别对运动和静止区域进行参数调节控制。

模块内部使能位，以及各个模块输入使能位均有底层根据模块是否打开进行控制。

支持分别针对高信噪比与低信噪比2种噪声模式下锐化参数设置，

例如：支持双转换增益模式（Dual convertion gain DCG）的CIS，高转换增益(HCG)对应高信噪比模式，低转换增益(HCG)对应低信噪比模式。

##### 4.2.6.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| hdrgain_ctrl_enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| hdr_gain_scale_s | 调试参数 | 常调试参数 |
| hdr_gain_scale_m | 调试参数 | 常调试参数 |

### hdrgain\_ctrl\_enable

【描述】

hdr模式下，是否使能对短帧和中帧的gain整体大小控制。

0：不使能，1：使能。默认值0。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

hdr\_gain\_scale\_s

【描述】

hdr模式下，对短帧的gain模块整体放大倍数。值越大，短帧去噪力度越大。

取值范围[0.0, 128.0]，默认值1.0。

hdr\_gain\_scale\_m

【描述】

hdr模式下，对中帧的gain模块整体放大倍数。值越大，中帧去噪力度越大。

取值范围[0.0, 128.0]，默认值1.0。

##### 4.2.6.3 调试步骤

hdr模式可以打开此模块进行调试。如果hdr模式下短帧噪声比较大，可以调大hdr\_gain\_scale\_s的值，来增强短帧去噪力度。以此类推hdr\_gain\_scale\_m。

### 4.3 MERGE

#### 4.3.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 无 | 无 | 无 |

#### 4.3.1 功能描述

在融合过程中，基准帧可以选择长帧或者短帧，分别对应长帧模式和短帧模式。

在长帧模式下，过曝曲线由OECurve\_smooth和OECurve\_offset两个参数确定，在两帧模式下，是否过曝在长帧和短帧之间判断，三帧模式下，是否过曝在长帧和中帧之间判断，同时，。



Merge框图

#### 4.3.2 关键参数

##### 4.3.2.1 BaseFrm

【描述】

表示在融合过程中，基准帧的选择。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| BASEFRAME_LONG | 长帧为基准 |
| BASEFRAME_SHORT | 短帧为基准 |

### 【注意事项】

使用BASEFRAME\_LONG和BASEFRAME\_SHORT，融合后亮度基本一致。主要差异在于，使用BASEFRAME\_SHORT模式时，运动拖影情况更好，使用BASEFRAME\_LONG模式时，噪声情况更好。

使用BASEFRAME\_LONG模式时，LongFrmModeData中参数生效，而使用BASEFRAME\_SHORT模式时，ShortFrmModeData中参数生效。

##### 4.3.2.2 ByPassThr

【描述】

表示bypass当前模块阈值，取值范围[0,1]。当前环境亮度与前一帧环境亮度差异的百分比小于ByPassThr时，本模块参数不做更新处理。

【成员】

【注意事项】

在使用工具调试过程中，请将值写为0，否则可能会出现调试无效的情况。

##### 4.3.2.3 LongFrmModeData

【描述】

长帧模式下，merge参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |
| OECurve_damp | 过曝曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。 |
| MDCurveLM_damp | 长帧与中帧间运动曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。在HDR x2模式下，不生效。 |
| MDCurveMS_damp | 中帧与短帧间运动曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。 |

### 【注意事项】

##### 4.3.2.3.1 EnableEachChn

【描述】

单通道过曝检测开关。0：关闭，1：开启。

【成员】

【注意事项】

当画面中存在单色区域过曝，从而导致该单色过曝区域，在merge完成后噪声较大时，建议开启。

##### 4.3.2.3.2 OECurve

【描述】

长帧模式下，过曝曲线参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

##### 4.3.2.3.3 MDCurve

【描述】

长帧模式下，运动曲线参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MoveCoef | 画面运动程度，取值范围[0,1]，其中0代表完全静止，1代表完全运动 |
| LM_smooth | 长帧和中帧之间运动曲线斜率，取值范围为[0,1]，默认值为0.4。在HDRx2模式下，不生效。 |
| LM_offset | 长帧和中帧之间运动曲线偏移值，取值范围为[0.26,1]，默认值为0.38。在HDRx2模式下，不生效。 |
| MS_smooth | 中帧和短帧之间运动曲线斜率，取值范围为[0,1]，默认值为0.4。 |
| MS_offset | 中帧和短帧之间运动曲线偏移值，取值范围为[0.26,1]，默认值为0.38。 |

### 【注意事项】

MoveCoef：由于当前场景检测未做，不能得到运动量，实际使用均为MoveCoef等于1

##### 4.3.2.3.4 EachChnCurve

【描述】

长帧模式下，单通道过曝曲线参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

##### 4.3.2.3.5 OECurve\_damp

【描述】

表示过曝曲线平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。

【成员】

【注意事项】

##### 4.3.2.3.6 MDCurveLM\_damp

【描述】

表示长中帧运动曲线平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。

【成员】

【注意事项】

HDR x2模式下不生效

##### 4.3.2.3.7 MDCurveMS\_damp

【描述】

表示中短帧运动曲线平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。

【成员】

【注意事项】

##### 4.3.2.4 ShortFrmModeData

【描述】

短帧模式下，merge参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |
| OECurve_damp | 过曝曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。 |
| MDCurve_damp | 运动曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。 |

【注意事项】

##### 4.3.2.4.1 OECurve

【描述】

长帧模式下，过曝曲线参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

##### 4.3.2.4.2 MDCurve

【描述】

长帧模式下，过曝曲线参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MoveCoef | 画面运动程度，取值范围[0,1]，其中0代表完全静止，1代表完全运动 |
| Coef | 控制系数，取值范围[0,1]，默认值为0.05，精度0.0001 |
| ms_thd0 | 中短帧控制系数，取值范围[0,1]，默认值为0.0，精度0.1。 |
| Im_thd0 | 长中帧控制系数，取值范围[0,1]，默认值为0.0，精度0.1。在HDRx2模式下，不生效。 |

### 【注意事项】

##### 4.3.2.4.3 OECurve\_damp

【描述】

表示过曝曲线平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。

【成员】

【注意事项】

##### 4.3.2.4.4 MDCurve\_damp

【描述】

表示运动曲线平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。

【成员】

【注意事项】

HDR x2模式下不生效

#### 4.3.3 调试步骤

Merge调试主要包括过曝曲线调试和运动曲线调试两个部分。

##### 4.3.3.1 过曝曲线调试

【描述】

过曝曲线OECurve由OECurve\_smooth和OECurve\_offset来确定（曲线如下图所示），同时，在不同Envlv下设置不同的过曝曲线。



OECurve示意图

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Smooth | 过曝曲线斜率 |
| Offset | 过曝曲线斜率 |

### 【注意事项】

1. Smooth：



OECurve\_smooth示意图

2. Offset：

从图像上看，该值代表了过曝处使用短帧的初始值。该值越小，使用短帧的权重最大。

几个较为特殊的点：其中108代表，设置下去的过曝曲线值全为1023，此时短帧使用的权重最大，如下图中黄色曲线所示；128是值代表从亮度为128开始时，短帧就可能使用，如下图中蓝色曲线所示；215是代表，215是值代表从亮度为215开始时，短帧就可能使用，同时正好到到达256时，短帧的权重刚好为1023，如下图中绿色曲线所示；280是到代表过曝曲线值全为0，此时merge不会使用短帧，如下图中红色曲线所示：



OECurve\_offset示意图

##### 4.3.3.2 长帧模式下运动曲线调试

【描述】

长帧模式下运动曲线（MS\_smooth和MS\_offset，LM\_smooth和LM\_offset两组参数决定）实际曲线如下图所示。



MDCurve示意图

在画面运动时候，需要降低权重，从而减少短帧的使用，从而减小运动带来的鬼影的情况。同时，在不同MoveCoef下设置不同的运动曲线

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MS_smooth | 运动曲线斜率 |
| MS_offset | 运动曲线斜率 |

### 【注意事项】

1.MS\_smooth：



MDCurve\_smooth示意图

2. MS\_offset：

从图像上看，该值代表了过曝处使用短帧的初始值。该值越小，使用短帧的权重最大。绿色曲线代表值为0时，蓝色曲线代表值为0.38时，红色曲线代表值为1时。



MDCurve\_offset示意图

##### 4.3.3.2 短帧模式下运动曲线调试

【描述】

短帧模式下运动曲线（Coef、ms\_thd0以及lm\_thd0三个参数决定）实际曲线如下图所示。



MDCurve示意图

在画面运动时候，需要降低权重，从而减少短帧的使用，从而减小运动带来的鬼影的情况。同时，在不同MoveCoef下设置不同的运动曲线

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

### 4.4 DRC

#### 4.4.0 ISP32-lite vs ISP32 差异点


| 更新索 引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | DRC模块内部的双边滤波简化 | ISP32:preFrameWeit、Range_sgm_pre、Space_sgm_preISP32-lite:不支持以上3个参数 |

#### 4.4.1 功能描述

动态范围指场景中最亮物体与最暗物体之间的亮度比值。动态范围越大，通常表示场景中的亮度层次越丰富。


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

如果采用传统图像传感器拍摄高动态范围的场景，要么出现亮出过曝，丢失细节；要么暗处曝光不足，细节难以分辨。为了能够记录高动态范围场景，需要使用更高动态范围的传感器或是多次曝光图像合成。并且当前主流显示设备动态范围有限，同样无法展现宽动态图像，为了解决该问题，DRC模块能够对图像的动态范围进行压缩。使真实场景的观察者和显示设备的观察者都能获取相同的视觉感受。

#### 4.4.2 关键参数

##### 4.4.2.1 Enable

【描述】

表示开关功能，0：关闭，1：开启。

【成员】

【注意事项】

线性模式下，ob功能开关优先级高于drc开关，即ob功能开启，线性drc开关强制开启，ob功能关闭，drc开关方可进行独立开关。

HDR模式下无效（强制开启）

##### 4.4.2.2 DrcGain

【描述】

通过DrcGain模块可以对输入的RAW进行亮度调整，即对整体亮度，或者局部亮度进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
|  |  |
|  |  |
|  |  |
|  |  |

【注意事项】

##### 4.4.2.3 HiLight

##### 4.4.2.3.1 HiLightData

【描述】

通过HiLight模块可以对输出RAW的高亮区域进行调整。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

Strength对高光附件亮度均有压制作用。

gas\_t只对高光边缘有效。

4.4.2.3.2 gas\_lx

描述】

对亮度域矩进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| gas_l0 | 系数0，取值范围[0,64]，默认值24 |
| gas_11 | 系数1，取值范围[0,64]，默认值10 |
| gas_12 | 系数2，取值范围[0,64]，默认值10 |
| gas_l3 | 系数3，取值范围[0,64]，默认值5 |

### 【注意事项】

需要满足gas\_l0 + 2 \* gas\_l1 + gas\_l2 + 2 \* gas\_l3 = 64的条件。

##### 4.4.2.4 LocalSetting

【描述】

通过LocalSetting模块可以对Local相关参数进行调整。

4.4.2.4.1 LocalData

【描述】

LocalData主要是对Local权重以及对比度进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
| LocalWeit | Local权重，取值范围[0,1]，0：Global，1：全Local，默认值0。 |
| LocalAutoEnable | 自动LocalWeit开关，取值范围[0,1]，默认值为1，精度1。 |
| LocalAutoWeit | 自动LocalWeit值，取值范围[0,1]，默认值为0.4，精度0.01。 |
| GlobalContrast | 全局对比度，取值范围[0,1]，默认值为0，精度0.01。 |
| LoLitContrast | 低亮区对比度，取值范围[0,1]，默认值为0，精度0.01。 |

### 【注意事项】

当LocalAutoEnable开启时，LocalAutoWeit生效，LocalWeit不生效。

##### 4.4.2.4.2 MotionData

【描述】

MotionData主要是对运动残影进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MotionCoef | 运动系数，取值范围[0,1]，0：静止，1：运动最大值。 |
| MotionStr | 抑制运动残影力度，取值范围[0,1]，默认值0。 |

### 【注意事项】

MotionStr只越大，运动残影越少，对比度更差。

4.4.2.4.3 curPixWeit

【描述】

表示当前点的双边权重，取值范围[0,1]，默认值为0.37，精度0.001。

【成员】

【注意事项】

##### 4.4.2.4.4 Range\_force\_sgm

【描述】

表示双边值域 sigma 的倒数，取值范围[0,1]，默认值为0，精度0.0001。

【成员】

【注意事项】

当Range\_force\_sgm为非零值时，Range\_sgm\_cur和Range\_sgm\_pre不生效。

##### 4.4.2.4.5 Range\_sgm\_cur

【描述】

表示当前帧双边空域sigma的倒数，取值范围[0,1]，默认值为0.2，精度0.0001。

【成员】

【注意事项】

4.4.2.4.6 Space\_sgm\_cur

【描述】

表示当前帧双边值域sigma的倒数，取值范围[0,4095]，默认值为4068，精度1。

【成员】

【注意事项】

##### 4.4.2.5 CompressSetting

【描述】

通过CompressSetting模块可以对压缩曲线进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Mode | 要输曲线表选择模式 |
| Manual_curve | 手动压缩曲线表，取值范围[0,8192] |

【注意事项】

默认使用AUTO模式

##### 4.4.2.6 Scale\_y

【描述】

表示增益修正scale表，取值范围[0,2048]

【成员】

【注意事项】

##### 4.4.2.7 ByPassThr

【描述】

表示bypass当前模块阈值，取值范围[0,1]。当前环境亮度与前一帧环境亮度差异的百分比小于ByPassThr时，本模块参数不做更新处理。

【成员】

【注意事项】

在使用工具调试过程中，请将值写为0，否则可能会出现调试无效的情况。

##### 4.4.2.8 Edge\_Weit

【描述】

表示边缘响应scale值，取值范围[0,1]，默认值0.02，精度0.01。用于降低高对比度边缘Artifact。

【成员】

【注意事项】

##### 4.4.2.9 OutPutLongFrame

【描述】

表示只输出长帧开关，0：关闭，1：开启。

【成员】

【注意事项】

该参数只在Debug阶段使用。

##### 4.4.2.10 IIR\_frame

【描述】

表示IIR滤波器帧数，取值范围[1,1000]，默认值为2，精度1。

【成员】

【注意事项】

该参数在线性模式下无效。

##### 4.4.2.11 Tolerance

【描述】

表示随着EnvLv变化的参数（DrcGain、Alpha、Clip、Strength、LocalWeit、GlobalContrast、LoLitContrast）的容忍值。取值范围[0,1].

【成员】

【注意事项】

##### 4.4.2.12 damp

【描述】

表示随着EnvLv变化的参数（DrcGain、Alpha、Clip、Strength、LocalWeit、GlobalContrast、LoLitContrast）平滑系数，为当前帧参数的占比，取值范围为[0,1]，默认值为0.9。

【成员】

【注意事项】

#### 4.4.3 调试步骤

##### 4.4.3.1 DrcGain调试

【描述】

通过DrcGain模块可以对输入的RAW进行亮度调整，即对整体亮度，或者局部亮度进行调整。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

DrcGain曲线是又DrcGain、Alpha已经Clip三个参数组成，其大致图像如下图所示：



图示中横坐标代表0\~4096的像素亮度，纵坐标代表当前亮度像素的增益倍数。

DrcGain：

DrcGain确认了最大的gain倍数，该最大倍数受两个条件限制：

$$

```
\begin{array} { c } { 1 < = D r c G a i n < = 8 } \\ { } \\ { A E R a t i o * D r c G a i n < = 2 5 6 } \end{array}
```

$$

有上面两个条件可知实际DrcGain小于等8x，在调试过程中，若DrcGain设置为8x，但是和AERatio的乘积大于256x，内部会对DrcGain进行clip，以满足乘积小于256x的条件。

在实际调试中，DrcGain的意义在于，在达到同样亮度下，增加DrcGain可以减少长短帧的位移误差（除DCG模式以外的sensor适用）。针对DrcGain说带来的噪声影响，由于DrcGain为数字gain，因此若sensor还处于模拟增益模式下，提高DrcGain会增加噪声水平；反之，若sensor处于数字增益模式下，提高DrcGain噪声水平不会有明显差异。

下图是DrcGain在等于1x（红线）和8x（蓝线）时大致曲线：



Alpha：

Alpha确认了DrcGain曲线的斜率，如下图所示为Alpha为0（红线）和0.9（蓝线）的区别：



有上图可知，当Alpha越小时，DrcGain曲线更接近于一条水平直线，即各个亮度均会等倍放大，由此可能引入对比度不足、暗部噪声被放大等问题。



##### 4.4.3.2 HiLight调试

【描述】

通过HiLight模块可以对输出RAW的高亮区域细节进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Strength | 高光区域细节，取值范围[0,1] |
| Strength | 高光区域细节，取值范围[0,1] |

### 【注意事项】

Stength值越大，高光处细节处压得会越好，但是高光边界更可能会出现halos。如下图所示，左图为Strength为0时，右图Strength为1时：



##### 4.4.3.3 LocalSetting调试

【描述】

通过LocalSetting模块可以对Local相关参数进行调整。该模块中所有参数，在LocalAutoEnable=0且LocalWeit=0，或者LocalAutoEnable=1且LocalAutoWeit=0时，不生效。

##### 4.4.3.3.1 LocalData调试

【描述】

LocalTMOData主要是对LocalTMO权重、全局对比度已经暗区对比度进行调整。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
| 成员名称 | 描述 |
| GlobalContrast | 全局对比度，取值范围[0,1]，默认值为0，精度0.01。 |
| LoLitContrast | 低亮区对比度，取值范围[0,1]，默认值为0，精度0.01。 |

### 【注意事项】

当LocalAutoEnable=0且LocalWeit=0，或者LocalAutoEnable=1且LocalAutoWeit=0时，DRC为Global 模式；当LocalAutoEnable=0且LocalWeit&gt;0，或者LocalAutoEnable=1且LocalAutoWeit&gt;0时

GlobalContrast：值越大，整体对比度（不包括暗区）越强。如下图所示，左图为GlobalContrast为0时，右图为GlobalContrast为1时。



LoLitContrast：值越大，暗区对比度越强。如下图所示，左图为LoLitContrast为0时，右图为LoLitContrast为1时。



##### 4.4.3.3.2 MotionData

【描述】

MotionData主要是对运动残影进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MotionStr | 抑制运动残影力度，取值范围[0,1]，默认值0。 |

【注意事项】

##### 4.4.3.4 Edge\_Weit调试

【描述】

通过改变该值来降低高对比度边缘Artifact。

【成员】



### 4.5 Dehaze & Enhance

#### 4.5.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 无 | 无 | 无 |

#### 4.5.1 功能描述

在雾、霾之类的恶劣天气下，采集的图像质量会由于大气散射而严重降低, 使图像颜色偏灰白色, 对比度降低, 物体特征难以辨认。所以需要图像去雾技术来增强或修复, 以改善视觉效果。



Dehaze模块框图

#### 4.5.2 关键参数

##### 4.7.2.1 Enable

【描述】

Dehaze&Enhance开关功能

0：关闭

1：打开

【成员】

【注意事项】

##### 4.5.2.2 CtrlDataType

【描述】

控制参数选择。

CTRLDATATYPE\_ENVLV：使用EnvLv作为控制参数

CTRLDATATYPE\_ISO：使用ISO作为控制参数

【成员】

【注意事项】

##### 4.5.2.3 cfg\_alpha

【描述】

软件配置占比，取值范围[0,1]，默认值1，精度0.01。

0：全使用自适应参数

1：全使用软件配置参数，可控制自适应参数和软件配置参数按照比例混合

【成员】

【注意事项】

当值为0时，Dehaze中的cfg\_wt、cfg\_air、cfg\_tmax以及Hist中的cfg\_gratio不生效；反之，当值为1时，Dehaze参数完全由cfg\_wt、cfg\_air和cfg\_tmax决定，Hist参数完全由cfg\_gratio决定。

##### 4.5.2.4 ByPassThr

【描述】

表示bypass当前模块阈值，取值范围[0,1]。当前环境亮度与前一帧环境亮度差异的百分比小于ByPassThr时，本模块参数不做更新处理。

【成员】

【注意事项】

在使用工具调试过程中，请将值写为0，否则可能会出现调试无效的情况。

##### 4.5.2.5 Dehaze\_Setting

4.5.2.5.1 en

【描述】

dehaze功能开关。0：关闭，1：开启。

【成员】

【注意事项】

4.5.2.5.2 air\_lc\_en

【描述】

是否使用 airlight base 对 airlight 进行最小值截止开关。0：关闭，1：开启。

【成员】

【注意事项】

4.5.2.5.3 stab\_fnum

【描述】  

帧稳定的最大值。【成员】  

【注意事项】  

4.5.2.5.4 sigma

【描述】

iir控制的sigma。【成员】【注意事项】

4.5.2.5.5 wt\_sigma

【描述】

帧间wt滤波系数。

【成员】

【注意事项】

##### 4.5.2.5.6 air\_sigma

【描述】

帧间air滤波系数。

【成员】

【注意事项】

##### 4.5.2.5.7 tmax\_sigma

【描述】

帧间tmax滤波系数。

【成员】

【注意事项】

4.5.2.5.8 pre\_wet

【描述】

参考数据 IIR 滤波系数。

【成员】

【注意事项】

##### 4.5.2.5.9 DehazeData

【描述】

通过该模块对去DehazeData进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度 |
| dc_min_th | wt自适应的统计范围，取值范围[16，120]，默认值64。 |
| dc_max_th | wt自适应高曝区统计范围，取值范围[170，255]，默认值192。 |
| yhist_th | y分量高曝区统计范围，取值范围[170,255]，默认值249。 |
| yblk_th | y分量块数目比例阈值，取值范围[0.002，0.01]，默认值0.002。 |
| dark_th | wt自适应y分量块最小值阈值，取值范围[230，250]，默认值250。 |
| bright_min | air自适应阈值的最小值，取值范围[160，200]，默认值180。 |
| bright_max | air自适应阈值的最大值，取值范围[210，250]，默认值240。 |
| wt_max | wt自适应的最大值限制，取值范围[0.75，0.9]，默认值0.9。 |
| air_min | air自适应的最小值限制，取值范围[200，220]，默认值200。 |
| air_max | air自适应的最大值限制，取值范围[230，250]，默认值250。 |
| tmax_base | tmax自适应基础值，默认125，对应配置如下，200(131)，210(125)，220(119)，230(114)，240(109)，250(105)，推荐131-105 |
| tmax_off | tmax自适应的固定值，取值范围[0.1，0.5]，默认值0.1。 |
| tmax_max | tmax自适应的最大值，取值范围[0.1，0.5]，默认值0.5。 |
| cfg_wt | 软件配置wt，图像去雾力度，取值范围[0，1]，默认值0.8。 |
| cfg_air | 软件配置air，大气光系数，取值范围[0，255]，默认值210。 |
| cfg_tmax | 软件配置tmax，去雾的最大值，取值范围[0，1]，默认值0.2。 |
| bf_weight | 两个双边滤波的合成权重，取值范围[0，1]，默认值0.5。 |
| dc_weitcur | dark channel部分的双边权重，取值范围[0， 1]，默认值。 |
| range_sigma | 双边滤波值域 sigma 值，取值范围[0， 1]，默认值0.4。 |
| range_sigma_len | range_sigma数组长度 |
| space_sigma_pre | 以IIR数据为参考时，双边滤波空域sigma 值，取值范围[0，1]，默认值0.4。 |
| space_sigma_cur | 以当前数据为参考时，双边滤波空域sigma 值，取值范围[0，1]，默认值0.8。 |

【注意事项】

stab\_fnum：dehaze的参数是从0开始逐渐到达一个稳定值，sw\_dhaze\_stab\_fnum就是软件指定的达到稳定的帧数，一般10帧是比较合适的，该参数最大值可配到31，最多1s的时间就要进入稳定状态；

##### 4.5.2.6 Enhance\_Setting

4.5.2.6.1 en

【描述】

enhance功能开关。0：关闭，1：开启。

【成员】

【注意事项】

4.5.2.6.2 color\_deviate\_en

【描述】

色差矫正开关。0：关闭，1：开启。

【成员】

【注意事项】

当enhance\_chroma值较大时，存在通道溢出导致颜色偏差的情况，此时开启可对本情况进行矫正。

##### 4.5.2.6.3 enh\_luma\_en

【描述】

enh\_luma曲线开关。0：关闭，1：开启。

【成员】

【注意事项】

开启时enh\_luma生效，enhance\_value失效；反之，关闭时enh\_luma失效，enhance\_value生效。

##### 4.5.2.6.4 enhance\_curve

【描述】

低频曲线。

【成员】

【注意事项】

4.5.2.6.5 enh\_luma

【描述】

enh\_luma曲线。取值范围[0，16]，推荐范围[1, 2]。

【成员】

【注意事项】

通过曲线可以在不同亮度点附件设置不同通用对比度力度。

X轴不同亮度值，其值为

```
{ 64,128,192,256,320,384,448,512,576,640,704,768,832,896,960,1023};
```

##### 4.5.2.6.6 EnhanceData

【描述】

通过该模块对图像对比度进行调整。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

【注意事项】

enhance\_value：越大对比度越强

enhance\_chroma：越大饱和度越高

##### 4.5.2.7 Hist\_Setting

4.5.2.7.1 en

【描述】

hist功能开关。

【成员】

【注意事项】

##### 4.5.2.7.2 hist\_para\_en

【描述】

直方图拉伸控制开关。0：关闭，1：开启。

【成员】

【注意事项】

dehaze或者enhance功能开启时，可以独立开关；当dehaze或者enhance功能均关闭时，强制开启。开启时，hist\_scale生效；关闭时，且cfg\_alpha为0时，hist\_gratio生效；关闭时，且cfg\_alpha为1时，cfg\_gratio生效。

##### 4.5.2.7.3 HistData

【描述】

通过该模块对图像对比度进行调整，通常用于去雾后对比度不够的情况。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度 |
| hist_gratio | 直方图拉伸倍数，直方图均衡控制系数，取值范围[0，32] |
| hist_th_off | 直方图统计阈值，取值范围[0，255]，默认值64 |
| hist_k | 直方图自适应阈值放大倍数，取值范围[0，7)，默认值2 |
| hist_min | 直方图统计阈值的最小值，取值范围[0,2)，默认值0.016 |
| hist_scale | 直方图均衡控制系数，取值范围[0,32] |
| cfg_gratio | 软件配置直方图拉伸倍数，直方图均衡控制系数，取值范围[0,32) |

### 【注意事项】

hist\_para\_en：当取值为1时，hist\_scale生效，hist\_gratio不生效；反之，当取值为0时，hist\_scale不生效，hist\_gratio生效。

hist\_gratio：值越大，直方图拉伸力度越大，图像整体亮度也越高。

hist\_th\_off：值越大，直方图的统计值越大，图像整体亮度也越高。

hist\_k：值越大，直方图的统计值越大，图像整体亮度也越高。

hist\_min：值越大，直方图的统计值越大，图像整体亮度也越高。

#### 4.5.3 调试步骤

Dehaze调试主要包括Dehaze、Enhance和Hist调试三个部分。

##### 4.5.3.1 Dehaze调试

【描述】

去雾力度建议通过以下三个参数进行调整。以下三个参数根据ISO变化。在调过程中需要将cfg\_alpha置为1。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】



cfg\_wt对比图

2.cfg\_air：也可以控制去雾力度，同时会影响图像过曝区域的去雾效果，与sw\_dhaz\_cfg\_wt配合使用。如下图可见，对下面这幅输入图像来说，cfg\_air越大天空交界处的去雾效果越自然，cfg\_air为250的时候不会出现中间的分层问题，air的调试主要考虑图像中是否存在天空和过曝区，如果存在则需要调大air，避免出现分层或者是细节丢失的问题。（如下图，从左到右依次为Dehaze\_en= 0，Dehaze\_en= 1且 cfg\_air= 200，Dehaze\_en= 1且cfg\_air= 250）





cfg\_air对比图



3.cfg\_tmax：值越小，景深方向的去雾力度越大，值越大，景深方向的去雾力度越小。

如下图可见，cfg\_tmax是0.1的时候景深方向的雾去除的比较干净，一些细节已经可以看见了，



cfg\_tmax对比图

##### 4.5.3.2 Enhance调试

【描述】

通用对比度增强Enhance通过enhance\_value进行调整。enhance\_value根据ISO变化。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

1.enhance\_value：值越大对比度越强。（如下图，从左到右依次为Enhance\_en= 0，Enhance\_en= 1且enhance\_value = 1.5）



enhance\_value对比图  

2.enhance\_chroma：越大饱和度越高（如下图，从左到右依次为Enhance\_en= 0，Enhance\_en= 1且enhance\_chroma = 1.5）



eenhance\_chroma对比图  

3.enh\_curve：可以通过调低暗区参数，用来提升暗区亮度和对比度。

##### 4.5.3.3 Hist调试

【描述】

直方图均衡化Hist建议通过以下两个参数进行调整。以下两个参数根据ISO变化。在调过程中需要将cfg\_alpha置为1。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| cfg_gratio | 软件配置直方图拉伸倍数，直方图均衡控制系数 |

### 【注意事项】

cfg\_gratio：与wt有关，wt越大gratio需适当调大，wt越小gratio越小。参数过大会让效果看起来不自然，整体颜色偏蓝，另外一些细节也会再次丢失掉，gratio是直方图拉伸的一个系数，其大小与wt有关，wt越大gratio需适当调大，wt越小gratio越小，要避免wt比较小却配置了一个比较大的gratio。（如下图，从左到右依次为 Hist\_en = 0，Hist\_en = 1且cfg\_gratio= 0.768，Hist\_en = 1且cfg\_gratio= 2）





cfg\_gratio对比图



### 4.6 DPCC

#### 4.6.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

#### 4.6.1 功能描述

DPCC模块包含了ISP DPCC和Sensor DPCC。



##### 4.6.1.1 ISP DPCC

ISP DPCC硬件模块提供六种坏点判定算法，即RK、LC、PG、RND、RG、RO对坏点进行检测，检测到后对坏点进行去除。每种判定算法均具备独立开关与阈值参数调整。六种坏点判定算法均能检测亮点、暗点以及动态坏点进行检测，针对不同的坏点，检测能力不同。RO、PG对单个亮点和暗点的两种坏点较为有效，RK、RG以及RND对多坏点较为有效。





##### 4.6.1.1.1 Expert\_mode

Expert\_mode模式下，用户可以是直接配置ISP DPCC硬件，其主要包含fix\_set、set1、set2以及set3四种坏点判定方案。

##### 4.6.1.1.2 Fast\_mode

Fast\_mode模式是RK根据ISP DPCC硬件模块各坏点判定算法的能力抽象组合出的一种针对坏点类型区分的工作模式，主要包含如下方式：

Single\_level：针对对单个孤立坏点比较有效的模式，其中仅使能坏点判定方案Set1，该方案使能了六种坏点判定算法，随着等级的增大，算法使用的数量变少、阈值变化、去坏点能力越强；

由于以上3种模式在硬件坏点判定方案上未出现使用重复，所以允许同时开启，但是Triple\_level会增强Double\_level和Single\_level的力度，Double\_level会增强Single\_level的力度。



##### 4.6.1.2 Sensor DPCC

Sensor DPCC是sensor端自带的DPCC功能，在Sensor驱动实现支持的情况下，AIQ支持通过JSON参数文件中该模块下的参数来控制Sensor端DPCC模块。

#### 4.6.2 关键参数

##### 4.6.2.1 Enable

【描述】

DPCC开关功能

0：关闭

1：打开

【成员】

【注意事项】

##### 4.6.2.2 Fast\_mode

【描述】

通过该部分对Fast\_mode相关参数进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Fast_mode_enable | Fast_mode开关功能，0：关闭，1：打开 |
| ISO | 环境ISO |
| Single_enable | 单坏点去除开关，0：关闭，1：打开 |
| Single_level | 单坏点去除力度，取值范围[0，10] |
| Double_enable | 双坏点去除开关，0：关闭，1：打开 |
| Double_level | 双坏点去除力度，取值范围[0，10] |
| Triple_enable | 多坏点去除开关，0：关闭，1：打开 |
| Triple_level | 多坏点去除力度，取值范围[0,10] |

### 【注意事项】

Fast\_mode\_enable：值为0时，Fast\_mode关闭，Expert\_mode开启；反之，值为1时，Fast\_mode开启，Expert\_mode关闭。

双坏点、多坏点指相邻的多个坏点。

坏点去除力度，0代表不做处理，1\~10代表不同强度坏点去除力度，值越大力度越大。

若使用Fast\_mode不能达到想要的力度，请使用Expert\_mode。

##### 4.6.2.3 Expert\_mode

【描述】

通过该部分对Expert\_mode相关参数进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| stage1_Enable | 默认值1 |
| grayscale_mode | 黑白模式开关，0：关闭，1：打开 |
| rk_out_sel | RK坏点算法中ro_lim的使用，0：ro_lim1，1：ro_lim2，2：ro_lim3 |
| dpcc_out_sel | 坏点矫正模式，0：中值模式，1：RK模式 |
| stage1_rb_3x3 | 默认值0 |
| stage1_g_3x3 | 默认值0 |
| stage1_inc_rb_center | 红/蓝通道用中值模式对坏点去除时，是否包括待去除点，0：否，1：是，默认值为1 |
| stage1_inc_g_center | 绿通道用中值模式对坏点去除时，是否包括待去除点，0：否，1：是，默认值为1 |
| SetEnable | 四种方案开关 |
| set | 方案条件 |

【注意事项】

grayscale\_mode：当sensor为彩色时，设置为0；反之，当sensor为黑白时，设置为1。

##### 4.6.2.3.1 SetEnable

【描述】

Expert\_mode中四种方案开关。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| ISO | 环境ISO |
| stage1_use_fix_set | 内置坏点判定条件开关，0：关闭，1：打开 |
| stage1_use_set3 | set_cell中第三种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set2 | set_cell中第二种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set1 | set_cell中第一种坏点判断条件开关，0：关闭，1：打开 |

### 【注意事项】

【描述】

通过该部分可以调整判定坏点条件阈值，主要包括RK、LC、PG、RND、RG以及RO六种判定条件，六种条件为且的关系。



set\_cell框图

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RK | RK坏点判定算法 |
| LC | LC坏点判定算法 |
| PG | PG坏点判定算法 |
| RNG | RND坏点判定算法 |
| RG | RG坏点判定算法 |
| RO | RO坏点判定算法 |

【注意事项】

4.6.2.3.2.1 RK

【描述】

通过该部分可以调整坏点检测算法中RK算法相关参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

4.6.2.3.2.2 LC

【描述】

通过该部分可以调整坏点检测算法中LC算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| LC_red_blue_enable | LC坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| LC_green_enable | LC坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_line_thr | LC坏点判定算法红/蓝通道阈值，取值范围[0,255]，默认值16 |
| g_line_thr | LC坏点判定算法绿通道阈值，取值范围[0,255]，默认值12 |
| rb_line_mad_fac | LC坏点判定算法红/蓝通道系数，取值范围[0,63]，默认值34 |
| g_line_mad_fac | LC坏点判定算法绿通道系数，取值范围[0,63]，默认值16 |

### 【注意事项】

4.6.2.3.2.3 PG

【描述】

通过该部分可以调整坏点检测算法中PG算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| PG_red_blue_enable | PG坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| PG_green_enable | PG坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_pg_fac | PG坏点判定算法红/蓝通道系数，取值范围[0,63]，默认值4 |
| g_pg_fac | PG坏点判定算法绿通道系数，取值范围[0,63]，默认值3 |

### 【注意事项】

【描述】

通过该部分可以调整坏点检测算法中RND算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RND_red_blue_enable | RND坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| RND_green_enable | RND坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_rnd_thr | RND坏点判定算法红/蓝通道阈值，取值范围[0,255]，默认值8 |
| g_rnd_thr | RND坏点判定算法绿通道阈值，取值范围[0,255]，默认值8 |
| rb_rnd_offs | RND坏点判定算法红/蓝通道偏移值，取值范围[0,3]，默认值3 |
| g_rnd_offs | RND坏点判定算法绿通道偏移值，取值范围[0,3]，默认值3 |

【注意事项】

4.6.2.3.2.5 RG

【描述】

通过该部分可以调整坏点检测算法中RG算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RG_red_blue_enable | RG坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| RG_green_enable | RG坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_rg_fac | RG坏点判定算法红/蓝通道系数，取值范围[0,63]，默认值8 |
| g_rg_fac | RG坏点判定算法绿通道系数，取值范围[0,63]，默认值8 |

【注意事项】

4.6.2.3.2.6 RO

【描述】

通过该部分可以调整坏点检测算法中RO算法相关参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
| 成员名称 | 描述 |
| g_ro_lim | RO坏点判定算法绿通道阈值，取值范围[0,3]，默认值1 |

【注意事项】

##### 4.6.2.5 sensor\_dpcc

【描述】

通过该部分可以对sensor自身的坏点去除力度进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| sensor_dpcc_auto_en | sensor dpcc开关功能，0：关闭，1:打开 |
| max_level | 去除坏点最大力度 |
| ISO | 环境ISO |
| level_single | 去除单个坏点力度 |
| level_multiple | 去除多个坏点力度 |

【注意事项】

#### 4.6.3 调试步骤

DPCC调试主要包括Fast\_mode、Expert\_mode和sensor\_dpcc调试三个部分。Fast\_mode和Expert\_mode互斥，通过Fast\_mode中的Fast\_mode\_enable来决定，Fast\_mode\_enable值为0时，Fast\_mode关闭，Expert\_mode开启；反之，Fast\_mode\_enable值为1时，Fast\_mode开启，Expert\_mode关闭。

在实际调试过程中，建议先使用Fast\_mode进行坏点去除，若Fast\_mode不能达到想要的去坏点力度，则使用Expert\_mode。

##### 4.6.3.1 Fast\_mode调试

【描述】

Fast\_mode中主要通过Single\_level对单坏点进行去除，Double\_level对相邻的两个坏点进行去除，Triple\_level对相邻的三个以上的坏点进行去除。

三个功能互不影响，但是Triple\_level会增强Double\_level的力度，Double\_level会增强Single\_level的力度。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Fast_mode_enable | Fast_mode开关功能，0：关闭，1：打开 |
| Single_level | 单坏点去除力度，取值范围[0，10] |
| Double_level | 双坏点去除力度，取值范围[0，10] |
| Triple_level | 多坏点去除力度，取值范围[0，10] |

### 【注意事项】

坏点去除力度，0代表不做处理，1\~10代表不同强度坏点去除力度，值越大力度越大。

当某种坏点模式开启时，对应的去坏点力度不能为0。例如，当Single\_enable开启时，Single\_level中的值不能为0。

##### 4.6.3.2 Expert\_mode调试

【描述】

Expert\_mode中主要通过stage1\_use\_fix\_set、stage1\_use\_set1、stage1\_use\_set2、stage1\_use\_set3和set\_cell坏点进行去除，

set\_cell中包含RK、LC、PG、RND、RG以及RO六种坏点判定算法，六个算法间是“且”的关系，即若六种判定条件均开启，则待测点需要满足六个条件才能判定为坏点。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| stage1_use_fix_set | 内置坏点判定条件开关，0：关闭，1：打开 |
| stage1_use_set1 | set_cell中第一种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set2 | set_cell中第二种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set3 | set_cell中第三种坏点判断条件开关，0：关闭，1：打开 |
| set_cell | 坏点判断条件 |

### 【注意事项】

RK、LC、PG、RND、RG以及RO六个算法均分为绿、红蓝两个通道对坏点进行判断，建议两个通道同步开启关闭。

六个算法均可独立开启关闭，由于六种算法间是“且”的关系，因此算法开启越多，越不容易判定为坏点。但是，由于存在噪声的存在，当算法开启较少时，可能会出现画面中“边缘抖动”情况，即画面中固定边缘出现波浪线，且帧间出现差异的情况。因此，在实际使用中，建议每个set下，算法至少开启三种。

##### 4.6.3.2.1 RK

【描述】

通过该部分可以调整坏点检测算法中RK算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | RK坏点判定算法开关，0：关闭，1：开启 |
| ro_lim | RK坏点判定算法偏移值，取值范围[0,3] |
| sw_mindis | RK坏点判定算法阈值1，取值范围[0,255] |
| sw_dis_scale_min | RK坏点判定算法阈值2，取值范围[0,63] |
| sw_dis_scale_max | RK坏点判定算法阈值3，取值范围[0,63] |

### 【注意事项】

ro\_lim：值越大，越容易判断为坏点。

sw\_mindis：值越小，越容易判断为坏点。

sw\_dis\_scale\_max：值越小，越容易判断为坏点。

sw\_dis\_scale\_max ：值越小，越容易判断为坏点。

##### 4.6.3.2.2 LC

【描述】

通过该部分可以调整坏点检测算法中LC算法相关参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

line\_thr：值越小，越容易判断为坏点。

line\_mad\_fac：值越小，越容易判断为坏点。

4.6.3.2.3 PG

【描述】

通过该部分可以调整坏点检测算法中PG算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | PG坏点判定算法开关，0：关闭，1：开启 |
| pg_fac | PG坏点判定算法通道系数，取值范围[0,63]，默认值3 |

### 【注意事项】

pg\_fac：值越小，越容易判断为坏点。

##### 4.6.3.2.4 RND

【描述】

通过该部分可以调整坏点检测算法中RND算法相关参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

rnd\_thr：值越小，越容易判断为坏点。

rnd\_offs：值越小，越容易判断为坏点。

##### 4.6.3.2.5 RG

【描述】

通过该部分可以调整坏点检测算法中RG算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | RG坏点判定算法开关，0：关闭，1：开启 |
| rg_fac | RG坏点判定算法通道系数，取值范围[0,63]，默认值8 |

### 【注意事项】

rg\_fac：值越小，越容易判断为坏点。

##### 4.6.3.2.6 RO

【描述】

通过该部分可以调整坏点检测算法中RO算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | RO坏点判定算法通道开关，0：关闭，1：开启 |
| ro_lim | RO坏点判定算法通道阈值，取值范围[0,3]，默认值1 |

### 【注意事项】

ro\_lim：值越大，越容易判断为坏点。

##### 4.6.3.3 sensor\_dpcc调试

【描述】

sensor\_dpcc主要通过max\_level、level\_single、level\_multiple对sensor端坏点去除功能进行控制。该功能需要sensor自身具有去除坏点的功能，同时驱动配置完成的情况下，才能使用。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

max\_level：定义sensor端坏点去除的力度的最大值，主要为了细分单个等级去坏点力度。

level\_single和level\_multiple的力度不能超过max\_level。

### 4.7 Gamma

#### 4.7.0 ISP32-lite vs ISP32 差异点


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

#### 4.7.1 功能描述

通过该模块对gamma曲线进行调整，包含三条gamma曲线，curve\_normal、curve\_hdr以及curve\_night。



#### 4.7.2 关键参数

##### 4.7.2.1 Gamma\_en

【描述】

Gamma开关功能

0：关闭

1：打开

【成员】

【注意事项】

##### 4.7.2.2 Gamma\_out\_offset

【描述】

Gamma曲线修正功能，取值范围[-2048,2048]，默认值0。

【成员】

【注意事项】

最终使用的Gamma曲线为，Gamma\_curve - Gamma\_out\_offset。

##### 4.7.2.3 Gamma\_curve

【描述】

49点Gamma曲线Y轴值，取值范围[0,4095]。

【成员】

【注意事项】

Gamma曲线X轴点为固定49点，即

```c
int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640, 768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840, 4095};
```

#### 4.7.3 调试步骤

### 4.8 Debayer

#### 4.8.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | 去伪彩功能删除 | ISP32:c_filter模块及c_guid_gaus_coe、c_ce_gaus_coe、c_alpha_gaus_coe参数ISP32-lite:不支持以上参数配置 |

#### 4.8.1 功能描述

由于大部分彩色相机均采用单传感器获取图像信息，且每个传感器表面覆盖有一个CFA (Color FilterArray,色彩滤波阵列)，使得每一个像素只能获得R、G、B三基色中的一种彩色分量。由于彩色滤波阵列每个像素上只有一种颜色的分量是已知的， 为了得到一幅彩色图像，需要利用已知的颜色信息插值出另外两种丢失的颜色分量，该过程被称为去马赛克(Debayer或Demosaic)。该模块支持 RGGB、BGGR、GRBG、GBRG 四种 pattern 模式，暂不支持 RGBIR 模式。



图4-10-1 Debayer功能示意图

#### 4.8.2 关键参数

##### 4.8.2.1 control参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 用户调试参数 |
| lowfreq_filter1 | 调试参数 | 用户调试参数一般使用默认值 |
| highfreq_filter2 | 调试参数 | 用户调试参数一般使用默认值 |

#####

【描述】

Debayer模块使能位，0：关闭，1：打开。当配置为0时，图像是黑白模式，当配置为1时，是RGB模式。

### lowfreq\_filter1

【描述】

低频梯度滤波器，包含四个参数（coe1\~coe4），取值范围为-16\~15，一般使用默认值，coe1\~coe4的分布如下图所示：


| coel | 0 | coe2 |
| --- | --- | --- |
| coe3 | 0 | coe4 |
| coel | 0 | coe2 |

Filter1

### highfreq\_filter2

【描述】

高频梯度滤波器，包含四个参数（coe1\~coe4），取值范围为-16\~15，一般使用默认值，coe1\~coe4的分布如下图所示：


| coel c | oe2 | coel |
| --- | --- | --- |
| coe3 | coe4 | coe3 |
| coel c | oe2 | coel |

Filter2

##### 4.8.2.2 g\_interp参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| iso | 调试参数 | 用户调试参数 |
| debayer_clip_en | 调试参数 | 用户调试参数一般使用默认值 |
| debayer_gain_offset | 调试参数 | 用户调试参数一般使用默认值 |
| debayer_max_ratio | 调试参数 | 用户调试参数 |

iso

【描述】

增益值，其值为实际增益值\*50。g\_interp模块中所有参数皆跟随iso值变动，需要保持一一对应。

debayer\_clip\_en

【描述】

G通道插值 clip 开关，0：关闭，1：打开。

debayer\_gain\_offset

【描述】

计算 G 通道插值锐化系数的梯度偏移值，一般使用默认值，取值范围为0\~4095。

debayer\_max\_ratio

【描述】

G 通道插值锐化系数的最大值，值越大，锐化力度越大，取值范围为0\~63。

##### 4.8.2.3 g\_drctwgt参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| iso | 调试参数 | 用户调试参数 |
| debayer_hf_offset | 调试参数 | 用户调试参数 |
| debayer_thed0 | 调试参数 | 用户调试参数一般使用默认值 |
| debayer_thed1 | 调试参数 | 用户调试参数一般使用默认值 |
| debayer_dist_scale | 调试参数 | 用户调试参数一般使用默认值 |
| debayer_select_thed | 调试参数 | 用户调试参数一般使用默认值 |

iso

【描述】

增益值，功能与上述模块中的iso相同，此处不再赘述。

debayer\_hf\_offset

【描述】

梯度 offset，值越大，方向性越弱，有利于降低噪声导致的伪纹理，取值范围[0, 65535]。

debayer\_thed0

【描述】

控制高频权重选取，值越大选取高频权重概率越小，一般使用默认值，取值范围[0，15]。

debayer\_thed1

【描述】

控制低频权重选取，值越大选取低频权重概率越小，一般使用默认值，取值范围[0，15]。

debayer\_dist\_scale

【描述】

高频细节判断阈值，一般使用默认值，取值范围[0，15]。

debayer\_select\_thed

【描述】

高低频梯度选取方式的阈值，一般使用默认值，取值范围[0，255]。

##### 4.8.2.4 g\_filter参数


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

iso

【描述】

增益值，功能与上述模块中的iso相同，此处不再赘述。

debayer\_gfilter\_en

【描述】

G 通道插值结果滤波开关，0：关闭，1：打开。

debayer\_gfilter\_offset

【描述】

G 通道 clip offset，值越大，clip 范围越大，滤波力度越小，取值范围是[0,2047]

#### 4.8.3 名词解释


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
| 简称 | 描述 |
| 色差图 | 插值得到的G通道图像和原始raw图像作差后的图像 |

### 4.9 BLC

#### 4.9.0 ISP32-lite vs ISP32 差异点


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

#### 4.9.1 功能描述

BLC模块包含三个子模块，blc0,blc1,blc\_ob 3个部分。

blc0：raw输入，一开始就进行黑电平校正。

blc1: 在bayer3dnr处理完后，才进行黑电平校正。

blc\_ob: 这个部分是对暗部细节进行调整的一个模块。

线性模式下，可以选择在blc0做黑电平校正，或者在blc1做黑电平校正, 或者两个模块各做一部分。

hdr模式下，只能使用blc0做黑电平校正，并且不能使能blc\_ob模块。

#### 4.9.2 关键参数

##### 4.9.2.1 Blc0TuningPara 、Blc1TuningPara

enable

【描述】

模块使能位。

0：不使能，1：使能。默认值1。

ISO

【描述】

不同iso对应不同黑电平校正值。

R\_Channel 、Gr\_Channel、Gb\_Channel、B\_Channel

【描述】

r,gr,gb,b 4通道对应的黑电平校正值。

##### 4.9.2.2 BlcObPara

enable

【描述】

模块使能位。

0：不使能，1：使能。默认值1。

ISO

【描述】

不同iso对应不同黑电平校正值。

isp\_ob\_Offset

【描述】

暗部细节提升偏移值。

取值范围[0, 511], 默认值0。

isp\_ob\_preDgain

【描述】

暗部细节提升乘以倍数。

取值范围[0.0, 256.0], 默认值1。

#### 4.9.3 调试步骤

blc0和blc1总的值加起来要等于标定的blc值。

blc\_ob，在极暗的环境亮度下，想要提示暗部细节，可以调大isp\_ob\_Offset和isp\_ob\_preDgain。

### 4.10 AF

#### 4.10.0 ISP32-lite vs ISP32 差异点


| 更新索引 | 更新点描述 | 更新点涉及参数 |
| --- | --- | --- |
| 1 | Lite版本在水平和垂直方向只有一套滤波器 | ISP32:v1_band/v1_iir_coe/v1_fir_coe/v2_band/v2_iir_coe/v2_fir_coe/h1_band/h1_iir1_coe/h1_iir2_coe/h2_band/h2_iir1_coe/h2_iir2_coeISP32-lite:v1_band/v1_iir_coe/v1_fir_coe/h1_band/h1_iir1_coe/h1_iir2_coe |
| 2 | Lite版本FV统计子窗口改为了5*5 | ISP32:WeightISP32-lite:Weight |
| 3 | Lite版本增加了BLS功能 | ISP32:无ISP32-litebls_en/bls_offset |
| 4 | Lite版本增加了FV统计的最大值功能 | ISP32:无ISP32-lite:v1_maxmode/h1_maxmode |
| 5 | Lite版本修改了FV统计的Coring功能 | ISP32:v_fv_thresh/h_fv_threshISP32-lite:v_fv_thresh/v_fv_limit/v_fv_slope/h_fv_thresh/h_fv_limit/h_fv_slope |

#### 4.10.1 功能描述

#### 4.10.2 关键参数


| 成员名称 | 参数类型 | 描述 |
| --- | --- | --- |
| af_mode | 功能参数 | 功能参数 |
| win_h_offs | 调试参数 | 用户调试参数 |
| win_v_offs | 调试参数 | 用户调试参数 |
| win_h_size | 调试参数 | 用户调试参数 |
| win_v_size | 调试参数 | 用户调试参数 |
| video_win_h_offs | 调试参数 | 用户调试参数 |
| video_win_v_offs | 调试参数 | 用户调试参数 |
| video_win_h_size | 调试参数 | 用户调试参数 |
| video_win_v_size | 调试参数 | 用户调试参数 |
| fixed_mode | 调试参数 | 用户调试参数 |
| macro_mode | 调试参数 | 用户调试参数 |
| infinity_mode | 调试参数 | 用户调试参数 |
| contrast_af.enable | 调试参数 | 用户调试参数 |
| contrast_af.Afss | 调试参数 | 用户调试参数 |
| contrast_af.FullDir | 调试参数 | 用户调试参数 |
| contrast_af.FullRangeTbl | 调试参数 | 用户调试参数 |
| contrast_af.AdaptiveDir | 调试参数 | 用户调试参数 |
| contrast_af.AdaptRangeTbl | 调试参数 | 用户调试参数 |
| contrast_af.FineSearchStep | 调试参数 | 用户调试参数 |
| contrast_af.SkipCurveFitGain | 调试参数 | 用户调试参数 |
| contrast_af.TrigThers | 调试参数 | 用户调试参数 |
| contrast_af.TrigThersFv | 调试参数 | 用户调试参数 |
| contrast_af.LumaTrigThers | 调试参数 | 用户调试参数 |
| contrast_af.ExpTrigThers | 调试参数 | 用户调试参数 |
| contrast_af.ChangedFrames | 调试参数 | 用户调试参数 |
| contrast_af.StableThers | 调试参数 | 用户调试参数 |
| contrast_af.StableFrames | 调试参数 | 用户调试参数 |
| contrast_af.StableTime | 调试参数 | 用户调试参数 |
| contrast_af.SceneDiffEnable | 调试参数 | 用户调试参数 |
| contrast_af.SceneDiffThers | 调试参数 | 用户调试参数 |
| contrast_af.SceneDiffBlkThers | 调试参数 | 用户调试参数 |
| contrast_af.CenterSceneDiffThers | 调试参数 | 用户调试参数 |
| contrast_af.ValidMaxMinRatio | 调试参数 | 用户调试参数 |
| contrast_af.ValidValueThers | 调试参数 | 用户调试参数 |
| contrast_af.OutFocusValue | 调试参数 | 用户调试参数 |
| contrast_af.OutFocusPos | 调试参数 | 用户调试参数 |
| contrast_af.WeightEnable | 调试参数 | 用户调试参数 |
| contrast_af.Weight | 调试参数 | 用户调试参数 |
| contrast_af.SearchPauseLumaEnable | 调试参数 | 用户调试参数 |
| contrast_af.SearchPauseLumaThers | 调试参数 | 用户调试参数 |
| contrast_af.SearchLumaStableFrames | 调试参数 | 用户调试参数 |
| contrast_af.SearchLumaStableThers | 调试参数 | 用户调试参数 |
| contrast_af.Stage1QuickFoundThers | 调试参数 | 用户调试参数 |
| contrast_af.Stage2QuickFoundThers | 调试参数 | 用户调试参数 |
| contrast_af.FlatValue | 调试参数 | 用户调试参数 |
| contrast_af.PointLightLumaTh | 调试参数 | 用户调试参数 |
| contrast_af.PointLightCntTh | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.QuickFoundThersZoomldx | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.QuickFoundThers | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SearchStepZoomldx | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SearchStep | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.StopStepZoomldx | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.StopStep | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SkipHighPassZoomldx | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SkipHighPassGain | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SwitchDirZoomldx | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SpotlightHighlightRatio | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SpotlightLumaRatio | 调试参数 | 用户调试参数 |
| contrast_af.ZoomCfg.SpotlightBlkCnt | 调试参数 | 用户调试参数 |
| video_contrast_af | 调试参数 | 用户调试参数 |
| laser_af.enable | 预留调试参数 | 用户调试参数 |
| laser_af.vcmDot | 预留调试参数 | 用户调试参数 |
| laser_af.distanceDot | 预留调试参数 | 用户调试参数 |
| pdaf.enable | 调试参数 | 用户调试参数 |
| pdaf.pdVsCdDebug | 调试参数 | 用户调试参数 |
| pdaf.pdDumpDebug | 调试参数 | 用户调试参数 |
| pdaf.pdDumpMaxFrm | 调试参数 | 用户调试参数 |
| pdaf.pdDataBit | 调试参数 | 用户调试参数 |
| pdaf.pdBlkLevel | 调试参数 | 用户调试参数 |
| pdaf.pdSearchRadius | 调试参数 | 用户调试参数 |
| pdaf.pdMirrorlnCalib | 调试参数 | 用户调试参数 |
| pdaf.pdVslmgoutMirror | 调试参数 | 用户调试参数 |
| pdaf.pdLRInDiffLine | 调试参数 | 用户调试参数 |
| pdaf.pdWidth | 调试参数 | 用户调试参数 |
| pdaf.pdHeight | 调试参数 | 用户调试参数 |
| pdaf.pdHeight | 调试参数 | 用户调试参数 |
| pdaf.pdVerBinning | 调试参数 | 用户调试参数 |
| pdaf.pdFrmlnValid | 调试参数 | 用户调试参数 |
| pdaf.pdDgainValid | 调试参数 | 用户调试参数 |
| pdaf.pdGainMapNormEn | 调试参数 | 用户调试参数 |
| pdaf.pdConfdMode | 调试参数 | 用户调试参数 |
| pdaf.pdNoiseSn | 调试参数 | 用户调试参数 |
| pdaf.pdNoiseRn | 调试参数 | 用户调试参数 |
| pdaf.pdNoisePn | 调试参数 | 用户调试参数 |
| pdaf.pdSatValRatio | 调试参数 | 用户调试参数 |
| pdaf.pdSatCntRatio | 调试参数 | 用户调试参数 |
| pdaf.pdDiscardRegionEn | 调试参数 | 用户调试参数 |
| pdaf.pdLessTextureRatio | 调试参数 | 用户调试参数 |
| pdaf.pdTargetOffset | 调试参数 | 用户调试参数 |
| pdaf.pdCaliblnf.pdGainMapW | 调试参数 | 用户调试参数 |
| pdaf.pdCaliblnf.pdGainMapH | 调试参数 | 用户调试参数 |
| pdaf.pdCaliblnf.pdDccMapW | 调试参数 | 用户调试参数 |
| pdaf.pdCaliblnf.pdDccMapH | 调试参数 | 用户调试参数 |
| pdaf.pdConfdMwinFactor | 调试参数 | 用户调试参数 |
| pdaf.pdCenterMinFv | 调试参数 | 用户调试参数 |
| pdaf.pdCenterMinRatio | 调试参数 | 用户调试参数 |
| pdaf.pdHighlightRatio | 调试参数 | 用户调试参数 |
| pdaf.pdStepRatio[7] | 调试参数 | 用户调试参数 |
| pdaf.pdStepDefocus[7] | 调试参数 | 用户调试参数 |
| pdaf.pdlsoPara.iso | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.pdNoiseFactor | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.pdConfdRatio0 | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.pdConfdRatio2 | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.pdConfdThresh | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.convergedInfPdThresh | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.convergedMacPdThresh | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.defocusInfPdThresh | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.defocusMacPdThresh | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.stablePdRatio | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.stablePdOffset | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.stableCntRatio | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.noconfCntThresh | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.roiBlkCntW | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.roiBlkCntH | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.fineSearchTbl.confidence | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.fineSearchTbl.range | 调试参数 | 用户调试参数 |
| pdaf.pdIsoPara.fineSearchTbl.stepPos | 调试参数 | 用户调试参数 |
| vcmcfg.startCurrent | 调试参数 | 用户调试参数 |
| vcmcfg.ratedCurrent | 调试参数 | 用户调试参数 |
| vcmcfg.stepMode | 调试参数 | 用户调试参数 |
| vcmcfg.extraDelay | 调试参数 | 用户调试参数 |
| vcmcfg.posture_diff | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.widemod_deviate | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.telemod_deviate | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.focus_backval | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.zoom_move_dot | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.zoom_move_step | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.focal_length | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.zoomcode | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.focuscode.pos | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.focuscode.code | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.ZoomSearchTbl | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.ZoomSearchRefCurveldx | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.FocusSearchMargin | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.FocusSearchPlusRange | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.FocusStage1Step | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.QuickFndRate | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.QuickFndMinFv | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.searchZoomRange | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.searchFocusRange | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.searchEmax | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.searchEavg | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.IsZoomFocusRec | 调试参数 | 用户调试参数 |
| zoomfocus_tbl.ZoomInfoDir | 调试参数 | 用户调试参数 |
| zoom_meas.zoom_idx | 调试参数 | 用户调试参数 |
| zoom_meas.measiso.iso | 调试参数 | 用户调试参数 |
| zoom_meas.measiso.idx | 调试参数 | 用户调试参数 |
| zoom_meas.measiso.spotlt_scene_idx | 调试参数 | 用户调试参数 |
| meascfg_tbl.tbl_idx | 调试参数 | 用户调试参数 |
| meascfg_tbl.from_awb | 调试参数 | 用户调试参数 |
| meascfg_tbl.from_ynr | 调试参数 | 用户调试参数 |
| meascfg_tbl.from_bnr | 调试参数 | 用户调试参数 |
| meascfg_tbl.bls_en | 调试参数 | 用户调试参数 |
| meascfg_tbl.avg_ds_en | 调试参数 | 用户调试参数 |
| meascfg_tbl.v1_maxmode | 调试参数 | 用户调试参数 |
| meascfg_tbl.v2_maxmode | 调试参数 | 用户调试参数 |
| meascfg_tbl.h1_maxmode | 调试参数 | 用户调试参数 |
| meascfg_tbl.h2_maxmode | 调试参数 | 用户调试参数 |
| meascfg_tbl.hiir_left_border_mode | 调试参数 | 用户调试参数 |
| meascfg_tbl.bnr_in_shift | 调试参数 | 用户调试参数 |
| meascfg_tbl.bls_offset | 调试参数 | 用户调试参数 |
| meascfg_tbl.avg_ds_mode | 调试参数 | 用户调试参数 |
| meascfg_tbl.afmThres | 调试参数 | 用户调试参数 |
| meascfg_tbl.gammaY | 调试参数 | 用户调试参数 |
| meascfg_tbl.gaus_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.dnscl_mode | 调试参数 | 用户调试参数 |
| meascfg_tbl.v1fv_reliable | 调试参数 | 用户调试参数 |
| meascfg_tbl.v2fv_reliable | 调试参数 | 用户调试参数 |
| meascfg_tbl.v1_fir_sel | 调试参数 | 用户调试参数 |
| meascfg_tbl.v1_band | 调试参数 | 用户调试参数 |
| meascfg_tbl.v1_iir_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.v1_fir_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.v2_band | 调试参数 | 用户调试参数 |
| meascfg_tbl.v2_iir_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.v2_fir_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.h1_band | 调试参数 | 用户调试参数 |
| meascfg_tbl.h1_iir1_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.h1_iir2_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.h2_band | 调试参数 | 用户调试参数 |
| meascfg_tbl.h2_iir1_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.h2_iir2_coe | 调试参数 | 用户调试参数 |
| meascfg_tbl.Idg_en | 调试参数 | 用户调试参数 |
| meascfg_tbl.ve_Idg_lumth_l | 调试参数 | 用户调试参数 |
| meascfg_tbl.ve_Idg_gain_l | 调试参数 | 用户调试参数 |
| meascfg_tbl.ve_Idg_gslp_! | 调试参数 | 用户调试参数 |
| meascfg_tbl.ve_Idg_lumth_h | 调试参数 | 用户调试参数 |
| meascfg_tbl.ve_ldg_gain_h | 调试参数 | 用户调试参数 |
| meascfg_tbl.ve_ldg_gslp_h | 调试参数 | 用户调试参数 |
| meascfg_tbl.ho_Idg_lumth_l | 调试参数 | 用户调试参数 |
| meascfg_tbl.ho_Idg_gain_i | 调试参数 | 用户调试参数 |
| meascfg_tbl.ho_ldg_gslp_l | 调试参数 | 用户调试参数 |
| meascfg_tbl.ho_ldg_lumth_h | 调试参数 | 用户调试参数 |
| meascfg_tbl.ho_ldg_gain_h | 调试参数 | 用户调试参数 |
| meascfg_tbl.ho_ldg_gslp_h | 调试参数 | 用户调试参数 |
| meascfg_tbl.hldg_dilate_num | 调试参数 | 用户调试参数 |
| meascfg_tbl.v_fv_thresh | 调试参数 | 用户调试参数 |
| meascfg_tbl.v_fv_limit | 调试参数 | 用户调试参数 |
| meascfg_tbl.v_fv_slope | 调试参数 | 用户调试参数 |
| meascfg_tbl.h_fv_thresh | 调试参数 | 用户调试参数 |
| meascfg_tbl.h_fv_limit | 调试参数 | 用户调试参数 |
| meascfg_tbl.h_fv_slope | 调试参数 | 用户调试参数 |
| meascfg_tbl.highlit_thresh | 调试参数 | 用户调试参数 |
| meascfg_tbl.v_fv_ratio | 调试参数 | 用户调试参数 |

##### 4.10.2.1 af\_mode

【描述】

默认对焦模式

CalibDbV2\_AFMODE\_NOT\_SET = -1, CalibDbV2\_AFMODE\_AUTO, CalibDbV2\_AFMODE\_MACRO, CalibDbV2\_AFMODE\_INFINITY, CalibDbV2\_AFMODE\_FIXED, CalibDbV2\_AFMODE\_EDOF, CalibDbV2\_AFMODE\_CONT\_VIDEO, CalibDbV2\_AFMODE\_CONT\_PICTURE, CalibDbV2\_AFMODE\_ZOOM\_ONESHOT,

### 【成员】

### 【注意事项】

##### 4.10.2.2 win\_h\_offs/win\_v\_offs/win\_h\_size/win\_v\_size

【描述】

一般模式下对焦窗口。

【成员】

h\_offs为对焦区域起始横坐标；

v\_offs为对焦区域起始纵坐标；

h\_size为对焦区域宽度；

v\_size为对焦区域高度；

### 【注意事项】

取值范围为0\~2000，代码内部会根据sensor输入进行转换。

如果这四个值全部设置为0，代码内部会自动设置。

#### 4.10.2.3

录像模式下对焦窗口。

【成员】

h\_offs为对焦区域起始横坐标；

v\_offs为对焦区域起始纵坐标；

h\_size为对焦区域宽度；

v\_size为对焦区域高度；

【注意事项】

取值范围为0\~2000，代码内部会根据sensor输入进行转换。

如果这四个值全部设置为0，代码内部会自动设置。

##### 4.10.2.4 fixed\_mode/macro\_mode/infinity\_mode 【描述】

fixed\_mode为固定对焦模式；

macro mode为近焦对焦模式；

infinity mode为远焦对焦模式;

【成员】

fixed\_mode下的code值为lens停留位置，取值范围为0\~64；

macro mode下的code值为对焦终止位置，起始code值为0；

infinity mode下的code值为对焦起始位置，终止code值为64;

【注意事项】

##### 4.10.2.5 contrast\_af/video\_contrast\_af

【描述】

一般模式和录像模式下contrast af算法参数设置

【成员】

enable为contrast af算法开关；

Afss为contrast af算法策略，目前固定使用ADAPTIVE\_RANGE；

FullDir为FULL\_RANGE策略下搜寻方向，取值范围POSITIVE、NEGATIVE、ADAPTIVE，一般使用ADAPTIVE；

FullRangeTbl[3]为FULL\_RANGE策略下搜寻表，按照这个表进行粗搜，[0]为搜寻起始位置，[1]为搜寻步长，[2]为搜寻结束位置；

AdaptiveDir为ADAPTIVE\_RANGE策略下搜寻方向，取值范围POSITIVE、NEGATIVE、ADAPTIVE，一般使用ADAPTIVE；

AdaptRangeTbl为ADAPTIVE\_RANGE策略下搜寻表，按照这个表进行粗搜；

FineSearchStep为ADAPTIVE\_RANGE策略下精搜步长表；

SkipCurveFitGain为使用曲线拟合的sensor gain阈值，当sensor gain小于该阈值时，使用曲线拟合代替精搜，可加快对焦速度；

TrigThers为触发再次对焦的阈值，当前Fv值与上次对焦成功时的Fv值相比，变化率超过TrigThers时，触发对焦；

TrigThersFv与TrigThers配合使用，由当前Fv的绝对值决定TrigThers的取值，逻辑代码如下所示；

```c
for (i = TrigThersNums - 1; i >= 0; i--) {
if (curFv >= TrigThersFv[i])
break;
}
if (i < 0)
i = 0;
TrigThers = TrigThers[i];
```

LumaTrigThers为触发再次对焦的阈值，当前亮度值与上次对焦成功时的亮度值相比，变化率超过LumaTrigThers时，触发对焦；

ExpTrigThers为触发再次对焦的阈值，当前曝光设置值与上次对焦成功时的曝光设置值相比，变化率超过ExpTrigThers时，触发对焦，曝光设置值包含曝光时间和曝光gain值；

ChangedFrames为满足上述触发阈值的帧数阈值，当满足上述触发阈值的帧数超过该阈值时，会触发重新对焦；

StableThers为满足触发对焦条件后，当前Fv值与上次Fv值相比，变化率小于该值时，认为本次场景稳定；

StableFrames为满足触发对焦条件后，变化率小于StableThers的帧数大于该值时，认为场景已经稳定；

StableTime当前未使用；

SceneDiffEnable / SceneDiffThers / SceneDiffBlkThers / CenterSceneDiffThers当前未使用；

ValidMaxMinRatio在Lite版本下无法使用；

ValidValueThers在Lite版本下无法使用；

OutFocusValue为Fv值小于该值时，认为对焦结果不可靠；

OutFocusPos为Fv值小于OutFocusValue，对焦结果不可靠时，将lens置于该位置；

WeightEnable为利用主窗口5\*5 fv值进行加权算出的fv值进行对焦的开关；

Weight为当WeightEnable为1时，对主窗口5\*5 fv值进行加权的权重系数；

SearchPauseLumaEnable为在af搜索过程中对亮度变化进行检查的开关；

SearchPauseLumaThers为af搜索过程中对亮度变化率进行检查的阈值，当亮度变化超过该阈值时，搜索暂停；

SearchLumaStableThers为af搜索过程中因亮度变化太大暂停后判断亮度变化为否稳定的阈值，变化率小于该值时，认为本次亮度变化稳定；

SearchLumaStableFrames为af搜索过程中因亮度变化太大暂停后判断亮度变化为否稳定的阈值，变化率小于SearchLumaStableThers的帧数大于该值时，认为亮度变化已经稳定；

Stage1QuickFoundThers为af搜索过程中跳过fv下降区域的阈值1；

Stage2QuickFoundThers为af搜索过程中跳过fv下降区域的阈值2；

FlatValue为af搜索过程中最大fv值小于该值时判断当前对焦区域为平坦区；

PointLightLumaTh和PointLightCntTh为利用亮度统计值进行光源判断的阈值，取亮度统计模块最中间的3 \* 3块进行判断，具体逻辑如下；

```
for (i = 0; i < 25; i++) {
if (isInCentor[i]) {
if (luma[i] >= PointLightLumaTh)
LightBlkCnt++;
}
}
if (LightBlkCnt >= PointLightCntTh) {
LOG("light source detected, move to inf position\n");
}
```

下面的参数主要在光学变焦功能启用时使用。

ZoomCfg.QuickFoundThers为快速搜索阈值，当前Fv值相对于最大值的变化率大于该值时提前结束搜索；

ZoomCfg.QuickFoundThersZoomIdx配合QuickFoundThers使用，根据zoom index的取值，可设置多个QuickFoundThers值，

zoom index的值需要从小到大排列；

ZoomCfg.SearchStep为每次对焦搜索中的搜索步数，即不管是粗搜还是精搜，本次搜索范围划分为SearchStep+1段进行搜索；

ZoomCfg.SearchStepSearchStepZoomIdx配合SearchStep使用，根据zoom index的取值，可设置多个SearchStep值；

ZoomCfg.StopStep为停止对焦搜索阈值，当本次搜索步长小于该值时结束搜索；

ZoomCfg.StopStepZoomIdx配合SearchStep使用，根据zoom index的取值，可设置多个StopStep值；

ZoomCfg.SkipHighPassZoomIdx和ZoomCfg.SkipHighPassGain未使用；

ZoomCfg.SpotlightHighlightRatio为通过高亮计数器判断高亮场景的阈值，当高亮点个数在图像块中所 占比例超过该阈值

时，判定该图像块为高亮块；

ZoomCfg.SpotlightLumaRatio为通过亮度值判断图像块为低亮度、中等亮度、高亮度图像块的阈值；

ZoomCfg.SpotlightBlkCnt为通过低亮度、中等亮度、高亮度图像块在总的图像块中所占比例判断是否为高亮场景的阈值；

【注意事项】

4.10.2.6 laser\_af

【描述】

laser af算法参数设置

【成员】

enable为laser af算法开关；

vcmDot和distanceDot为vcm code值和distance映射表;

【注意事项】

##### 4.10.2.7 pdaf

【描述】

pdaf算法参数设置

【成员】

enable为pdaf算法开关；

pdVsCdDebug为全扫开关，打开此开关后，会遍历每个马达位置，同时打印fv值和相位差值；

pdDumpDebug为debug开关，打开此开关后，会dump pdaf调试数据到/data/pdafdebug/下；

pdDumpMaxFrm为pdDumpDebug打开时，会dump pdaf的帧数；

pdDataBit为pd像素bit数；

pdBlkLevel为pd像素黑电平值；

pdSearchRadius为pd左右像素匹配半径值，一般设置3即可；

pdMirrorInCalib表示标定时sensor pd的mirror设置和使用时sensor pd的mirror设置的差异，两者不同时为1，两者相同时为0；

pdVsImgoutMirror为正常像素和pd像素在mirror上的差异，两者不同时为1，两者相同时为0；

pdLRInDiffLine为pd像素是否在同一行的标志，从pd像素中分解pd左右像素时使用；

pdWidth为pd像素宽度；

pdHeight为pd像素高度；

pdVerBinning为对pd像素进行垂直Binning处理的标识；

pdFrmInValid为马达移动后下次pd计算处理前额外等待的帧数；

pdDgainValid为sensor的dgain设置是否影响pd像素亮度的标识；

pdGainMapNormEn为对pd标定后的gain map是否进行归一化的标识；

pdConfdMode为计算pd置信度的模式选择，1为均值模式，0为最小值模式；

pdNoiseSn为pd像素噪声标定结果；

pdNoiseRn[2]为pd像素噪声标定结果；

pdNoisePn为pd像素噪声标定结果；

pdSatValRatio为pd像素过曝判断系数，当pd像素亮度大于该值乘最大像素亮度时，该pd像素过曝；

ppdSatCntRatio为pd像素过曝判断个数，当pd像素过曝个数大于该值时，转到对比度对焦处理；

pdDiscardRegionEn为跳过平坦区处理开关，可加快pd计算；

pdLessTextureRatio为平坦区判断系数；

pdTargetOffset为pdaf判断准焦位置和cdaf判断准焦位置的偏差值，当该偏差值为固定值时，可提高pdaf的准确度；

pdCalibInf.pdGainMapW为sensor标定时GainMap的宽度；

pdCalibInf.pdGainMapH为sensor标定时GainMap的高度；

pdCalibInf.pdDccMapW为sensor标定时DccMap的宽度；

pdCalibInf.pdDccMapH为sensor标定时DccMap的高度；

pdConfdMwinFactor为多子窗口时pd置信度调节系数，一般可配置为3；

pdCenterMinFv为判断居中roi是否为平坦区的最小FV阈值，一般不常用；

pdCenterMinRatio为判断居中roi是否为平坦区的判断系数，一般不常用；

pdHighlightRatio为判断居中roi是否为高亮区的判断系数，一般不常用；

pdStepRatio[7] 为使AF平滑，对pd的移动步长进行加权，final\_move\_step = calc\_move\_step \*pdStepRatio[i]；

pdIsoPara.iso为iso值，为pdIsoPara的索引值，iso值要从小到大进行排列设置；

pdIsoPara.pdConfdRatio0为pd置信度调节系数0；

pdIsoPara.pdConfdRatio1目前未使用；

pdIsoPara.pdConfdRatio2为pd置信度调节系数2；

pdIsoPara.pdConfdRatio3目前未使用；

pdIsoPara.convergedInfPdThresh为远焦端pd置信度可靠阈值，置信度超过该值时认为pd可靠；

pdIsoPara.convergedMacPdThresh为近焦端pd置信度可靠阈值，置信度超过该值时认为pd可靠；

pdIsoPara.defocusInfPdThresh为远焦端pd失焦阈值，相位差超过该值时触发pd对焦；

pdIsoPara.defocusMacPdThresh为近焦端pd失焦阈值，相位差超过该值时触发pd对焦；

pdIsoPara.stablePdOffset为pd相位差稳定阈值2，参考stablePdRatio的说明；

pdIsoPara.stableCntRatio为pd相位差稳定帧数阈值3，相位差稳定帧数 = stableCntRatio /confidence；

pdIsoPara.noconfCntThresh为pd不可靠帧数阈值，不可靠帧数超过该值时转到对比度对焦去处理；

pdIsoPara.roiBlkCntW为pd不可靠帧数阈值，不可靠帧数超过该值时转到对比度对焦去处理；

pdIsoPara.roiBlkCntH为pd不可靠帧数阈值，不可靠帧数超过该值时转到对比度对焦去处理；

pdIsoPara.fineSearchTbl.confidence为pd搜索结束，使用对比度对焦精搜时置信度阈值，当前置信度大于该阈值时，使用对应的搜索范围range和搜索步长stepPos进行精搜，置信度要从大到小进行排列；

pdIsoPara.fineSearchTbl.range为使用对比度对焦精搜时的搜索范围range，当range为0时，不进行对比度对焦精搜；

pdIsoPara.fineSearchTbl.stepPos为使用对比度对焦精搜时的搜索步长stepPos；

【注意事项】

##### 4.10.2.8 vcmcfg

vcm配置一般在kernel dts中设置，但内核编译比较麻烦，为了方便调试，xml中也增加对其进行设置的接口。

【成员】

max\_logical\_pos为对焦算法与底层驱动之间的逻辑马达位置最大值，一般配置为64；

startCurrent为vcm启动电流；

ratedCurrent为vcm截至电流；

stepMode为vcm工作模式，一般有LSC / SAC等模式；

extraDelay为在lens移动结束时间过后，追加一定的延时，以方便调试，该值可正、可负、可为零；

postureDiff为模组中存在OTP记录启动电流、截至电流时，通过该值适当扩大马达可移动的电流范围，以弥补姿势差值；

【注意事项】

##### 4.10.2.9 zoomfocus\_tbl

【描述】

变焦曲线表设置

【成员】


| 成员名称 | 描述 |
| --- | --- |
| WideModuleDeviation | 模组标定后，对标定结果进行微调，设定对焦过程中在近焦段focus额外多搜索的范围，focus搜索范围为[标定后对焦曲线minFocus - ModuleDeviation, 标定后对焦曲线minFocus + ModuleDeviation] |
| TeleModuleDeviation | 模组标定后，对标定结果进行微调，设定对焦过程中在远焦段focus额外多搜索的范围，focus搜索范围为[标定后对焦曲线minFocus - ModuleDeviation, 标定后对焦曲线minFocus + ModuleDeviation]一般可将WideModuleDeviation和TeleModuleDeviation设置为相同的值 |
| zoom_move_step | 在变焦(也称变倍)过程中，zoom和focus同时移动后进行同步的位置，即每隔zoom_move_step进行zoom和focus马达的同步 |
| zoom_move_dot | 和ZoomMoveStep配套使用，每段ZoomMoveDot位置，可设置一个zoom_move_step进行zoom和focus的同步，为了方便，此处为zoom index值，即对焦曲线表中对zoomcode从近焦到远焦从0进行编号 |
| focal_length | 对焦曲线表中的焦距数据，需保持原样拷贝 |
| zoomcode | 对焦曲线表中的zoom step数据，如模组为有光耦(复位开关)的模组，zoom step数据需要转换为以光耦指示原点为起始坐标；如模组为无光耦(复位开关)的模组，zoom step数据可直接拷贝对焦曲线表中的zoom step数据；可参考下面的对焦曲线图。 |
| focuscode | 包含pos和code两个域，pos为对焦距离，code为focus step数据，如模组为有光耦(复位开关)的模组，focus step数据需要转换为以光耦指示原点为起始坐标；如模组为无光耦(复位开关)的模组，focus step数据可直接拷贝对焦曲线表中的zoom step数据；必须包含无穷远距离和最近距离的focus step数据，各个距离的focus step数据长度要一致，和zoomcode数据长度也要一致； |
| ZoomSearchTbl | 模组标定时使用的查找表，根据该表搜索一定距离最清晰位置的focus 坐标值表中数据为zoom 坐标值，以光耦指示原点为起始坐标，需包含对焦曲线表拐点附近的位置 |
| ZoomSearchRefCurveldx | 模组标定时参考的focusPosition曲线编号，例如使用1.5米距离进行标定，找到focusPosition中该距离的编号为0，然后填写到此处 |
| FocusSearchMargin | 模组标定时为了保护镜头不撞击到模组两端，影响标定准确性，对模组标定时focus搜索范围进行限制，focus搜索范围为[focus_minimum + FocusSearchMargin,focus_maximum - FocusSearchMargin]focus_minimum和focus_maximum为驱动报告的focus可移动范围的最小值和最大值 |
| FocusSearchPlusRange | 模组标定时搜索最清晰位置的focus 坐标值时，模组标定前，各个模组的机械后焦等差距较大，需要在对焦曲线表的基础上设置额外多查找的范围，查找范围为 [对焦曲线表指示focus 坐标值-PlusRange， 对焦曲线表指示focus 坐标值+PlusRange] |
| FocusStage1Step | 模组标定时分为粗搜和精搜两个阶段，FocusStage1Step为精搜时的步长，一般设置为1 |
| QuickFndRate | 当前FV相对于最大FV下降率超过该值时，提前结束搜索，以提高模组标定速度 |
| QuickFndMinFv | 当前FV值大于该值时，QuickFndRate才生效 |
| searchZoomRange | 模组标定时[zoom focus]坐标对搜索完毕后，与对焦曲线表进行偏差计算时zoom的比较范围 |
| searchFocusRange | 模组标定时[zoom focus]坐标对搜索完毕后，与对焦曲线表进行偏差计算时focus的比较范围 |
| searchEmax | 对焦曲线表进行偏差计算时允许的最大偏差值，结果超过该值时模组标定失败 |
| searchEavg | 对焦曲线表进行偏差计算时允许的平均偏差值，结果超过该值时模组标定失败 |
| IsZoomFocusRec | 是否记录对焦后的[zoom focus]坐标，一般设置为0 |
| ZoomInfoDir | 记录光学变焦相关信息的存储位置 |

### 【注意事项】

### 对焦曲线图：



##### 4.10.2.10 zoom\_meas

【描述】

配置各个焦段各个iso下AF统计配置的索引。

【成员】

zoom\_idx为变焦曲线表中各个焦段的索引。

measiso.iso为iso值；

measiso.idx为该iso下普通场景的AF统计配置的索引，该索引为meascfg\_tbl中的tbl\_idx；

measiso.spotlt\_scene\_idx为点光源场景的AF统计配置的索引，该索引为meascfg\_tbl中的tbl\_idx；

【注意事项】

##### 4.10.2.11 meascfg\_tbl

【描述】

AF统计配置表。

【成员】

tbl\_idx为AF统计配置表的索引值。

from\_awb为1时，AF统计数据来自AWB，会受AWB选择通路和通路上其它模块设置的影响，一般不使用。

from\_ynr为1时，AF统计数据来自YNR，会受YNR通路上其它模块设置的影响，一般不使用。

from\_bnr为1时，AF统计数据来自Bayer3DNR，会受Bayer3DNR通路上其它模块设置的影响，一般不使用。

bls\_en为1时，使能AF统计通道上的BLS功能。

avg\_ds\_en为AF统计数据的8×8/16×16下采样功能开关，Lite版本下无法使用。

v1\_maxmode为1时，使能最大值模式，V1通道的输出数据为块内各行的最大值。

v2\_maxmode为1时，使能最大值模式，V2通道的输出数据为块内各行的最大值，Lite模式下不可用。

h1\_maxmode为1时，使能最大值模式，H1通道的输出数据为块内各行的最大值。

h2\_maxmode为1时，使能最大值模式，H2通道的输出数据为块内各行的最大值，Lite模式下不可用。

hiir\_left\_border\_mode决定水平方向滤波器的输出结果是否受上一行的影响，一般推荐设置为0。

bnr\_in\_shift为AF统计数据来自Bayer3DNR时，输入AF统计的数据需要右移的bit数，一般在hdr模式下需要设置。

bls\_offset，使能AF统计通道上的BLS功能时，在AF统计的输入数据上增加的BLS值，主要对亮度统计有影响。

avg\_ds\_mode为AF统计数据的下采样模式，Lite版本下无法使用。

afmThres为win b(独立窗口)的AF统计阈值，计算出的fv值小于该值时，fv值改为0，可减少噪声的影响，取值范围为0-0xFFFF；

gammaY为gamma table的y值，取值范围0-1023；x坐标分段为0 to 1023: 16 16 16 16 32 32 32 3264 64 64 128 128 128 128 128；

gaus\_coe可进行前置去噪处理，一般无需处理，按如下配置即可。0 64 0  

0 64 0  

0 0 0；

dnscl\_mode对输入的AF统计信号进行下采样处理，有助于支持更低频的滤波器频带；

v1fv\_reliable和v2fv\_reliable为垂直fv可靠程度，由于垂直fv设置灵活性不如水平方向，需要一个系数来衰减它的可靠程度；

v1\_fir\_sel一般设置为1即可；

v1\_band用于V1通道的带通选择范围，用于标识V1通道的系数由什么带通范围生成的，实际起作用的是下面的具体系数

v1\_iir\_coe用于V1通道的1X3 IIR系数，按照AF滤波器系数生成工具的输出进行设置；

v1\_fir\_coe用于V1通道的1x3 FIR系数，按照AF滤波器系数生成工具的输出进行设置；

v2\_band用于V2通道的带通选择范围，用于标识V2通道的系数由什么带通范围生成的，实际起作用的是下面的具体系数；

v2\_iir\_coe用于V2通道的1x3 IIR系数，按照AF滤波器系数生成工具的输出进行设置，Lite模式下不可用;

v2\_fir\_coe用于V2通道的1x3 FIR系数，按照AF滤波器系数生成工具的输出进行设置，Lite模式下不可用;

h1\_band用于H1通道的带通选择范围，用于标识H1通道的系数由什么带通范围生成的，实际起作用的是下面的具体系数;

h1\_iir1\_coe用于H1通道的1X6 IIR1系数，按照AF滤波器系数生成工具的输出进行设置;

h1\_iir2\_coe用于H1通道的1X6 IIR2系数，按照AF滤波器系数生成工具的输出进行设置;

h2\_band用于H2通道的带通选择范围，用于标识H2通道的系数由什么带通范围生成的，实际起作用的是下面的具体系数;

h2\_iir1\_coe用于H2通道的1X6 IIR1系数，按照AF滤波器系数生成工具的输出进行设置，Lite模式下不可用;

h2\_iir2\_coe用于H2通道的1X6 IIR2系数，按照AF滤波器系数生成工具的输出进行设置，Lite模式下不可用;

ldg\_en用于V1/H1通道的ldg模块开关;

ve\_ldg\_lumth\_l用于V1通道的ldg模块的亮度阈值系数，0为左边暗区设置，1为右边高亮区设置，取值范围为0\~255;

ve\_ldg\_gain\_l用于V1通道的ldg模块的最小gain值，为左边暗区设置，取值范围为0\~255;

ve\_ldg\_gslp\_l用于V1通道的ldg模块的斜率系数，为左边暗区设置，取值范围为0\~65535;

ve\_ldg\_lumth\_h用于V1通道的ldg模块的亮度阈值系数，为右边高亮区设置，取值范围为0\~255;

ve\_ldg\_gain\_h用于V1通道的ldg模块的最小gain值，为右边高亮区设置，取值范围为0\~255;

ve\_ldg\_gslp\_h用于V1通道的ldg模块的斜率系数，为右边高亮区设置，取值范围为0\~65535;

ho\_ldg\_lumth\_l用于H1通道的ldg模块的亮度阈值系数，为左边暗区设置，取值范围为0\~255;

ho\_ldg\_gain\_l用于H1通道的ldg模块的最小gain值，为左边暗区设置，取值范围为0\~255;

ho\_ldg\_gslp\_l用于H1通道的ldg模块的斜率系数，为左边暗区设置，取值范围为0\~65535;

ho\_ldg\_lumth\_h用于H1通道的ldg模块的亮度阈值系数，为右边高亮区设置，取值范围为0\~255;

ho\_ldg\_gain\_h用于H1通道的ldg模块的最小gain值，为右边高亮区设置，取值范围为0\~255;

ho\_ldg\_gslp\_h用于H1通道的ldg模块的斜率系数，为右边高亮区设置，取值范围为0\~65535;

v\_fv\_thresh用于V1通道的Coring模块的最小fv值，输入的fv值小于该值时，fv值改为0，取值范围为0-0x0FFF;

v\_fv\_limit用于V1通道的Coring模块的最大fv值，计算出的fv值大于该值时，fv值改为v\_limit，取值范围为0-1023;

v\_fv\_slope为V1通道的Coring模块的斜率系数，输入的fv值会乘上该系数输出，防止输出的fv值跳变， 取值范围为0-511;

h\_fv\_thresh用于H1通道的Coring模块的最小fv值，输入的fv值小于该值时，fv值改为0，取值范围为0-0x0FFF;

h\_fv\_limit用于H1通道的Coring模块的最大fv值，计算出的fv值大于该值时，fv值改为v\_limit，取值范围为0-1023;

h\_fv\_slope为H1通道的Coring模块的斜率系数，输入的fv值会乘上该系数输出，防止输出的fv值跳变， 取值范围为0-511;

highlit\_thresh表示高亮统计的阈值，当高于该值则认为是高亮点，纳入统计，只累加每个区域的高亮点的个数，取值范围为0-0x0FFF;

v\_fv\_ratio将垂直Fv和水平Fv进行加权时的系数;

【注意事项】

同个场景下，不同对焦位置下拍摄，会得到一系列模糊程度不同的图像，这些图像在中间某些频段上频谱能量的变化最明显，因此通常采用相应的带通滤波器来统计对焦度量。

RK3562芯片中，对焦度量统计模块的结构图如下。主要包括几大模块：

1.亮度提取(RawToLum)

2.gamma映射(gamma)

3.预去噪(gauss)

4.下采样(down scale)

5.水平方向1组 4阶IIR滤波器(4Ord-IIR)，带通滤波，支持灵活的频带设置

6.垂直方向1组 2阶混合FIR滤波器(2Ord-mixFIR)，设置灵活性不如水平方向

7.滤波得到单像素FV值的衰减和裁切(decay/clip)，可根据亮度对FV进行增益 或 钳位.

8.FV值 可选平方模式或绝对值模式下进行窗口内累加

9.FV值 也可选择每行最大值模式或每行累加模式

10.亮度 和 高亮计数 统计模块（highlight count)，统计窗口内的亮度和 以及 高亮点计数和



### 亮度预处理

目前可选两个位置作为AF统计的输入数据：1.(短/长曝的)WBGain+DPCC输出；2.DEBAYER输入; 3.AWB输入； 4. YNR输入; 5. Bayer3DNR输入。

gamma映射可用于改善暗区对比度。

gause可进行前置去噪处理。

downscale对输入的AF统计信号进行下采样处理，有助于支持更低频的滤波器频带。

### 滤波器和频带设置

FV统计曲线 不仅受镜头焦距、马达步长等设备参数的影响，还会受到场景亮度/对比度/动态范围/过曝区/噪声等的影响。各种应用场景下，应针对其典型的频谱特性来选择滤波器的频带。

### 高亮像素统计

此时，可以利用高亮计数功能、修改滤波器到较高频带、衰减光源区附近的像素对FV统计的贡献 等来优化FV对焦统计。



### ROI窗口统计

#### 4.10.3 变焦镜头调试步骤

1. 镜头马达驱动调试，可参考驱动相关文档。

2. 对焦曲线表导入IQ文件。

对应IQ文件中的focal\_length / zoomcode / focuscode。

需要注意的是，如模组为一体机芯等有光耦的模组，zoom code / focus code数据需要转换为以光耦指示原点为起始坐标，

一般参考镜头规格书中驱动控制表(Cam lifting map)中的数据，在zoom / focus数据上加固定偏移即可。

## 3. 设定镜头标定参数。

ZoomSearchTbl需要包含对焦曲线表的拐点附近的位置

4. 设定变焦对焦搜索过程参数。

AdaptiveDir / QuickFoundThersZoomIdx / QuickFoundThers   

SearchStepZoomIdx / SearchStep / StopStepZoomIdx / StopStep / SkipHighPassZoomIdx /   

SkipHighPassGain   

WideModuleDeviation / TeleModuleDeviation / ZoomMoveStep / ZoomMoveDot /   

SpotlightHighlightRatio / SpotlightLumaRatio / SpotlightBlkCnt
