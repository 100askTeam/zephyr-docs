---
sidebar_position: 1
---

# Tuning-Guide-ISP21-CN

## 前言

## 概述

本文旨在指导用户进行图像调优的文档。

## 产品版本


| 芯片名称 | ISP版本 |
| --- | --- |
| RK3566 | ISP2.1 lite |
| RK3568 | ISP2.1 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

ISP图像效果调试工程师

修订记录


| 版本号 | 修改记录 | 修改日期 | 作者 |
| --- | --- | --- | --- |
| v0.0.1 | 1. 《Rockchip_Development_Guide_ISP20_v1.6.2》同步2. 更新ISP21 NR/Sharp模块章节 | 2021-03-30 | 欧阳亚凤 |
| v0.0.2 | 更新ISP21 AE / DRC / GIC / Dehaze&amp;Enhance 模块参数 | 2021-04-10 | 朱林靖李仁奎 |
| v2.0.0 | 1. AIQ v2.X 效果文件由XML变更为JSON2. AE / Merge / DRC / Dehaze&amp;Enhance / AF / NR / Sharp模块参数更新 | 2021-7-3 | 朱林靖李仁奎欧阳亚凤胡克俊 |
| v2.1.0 | 1. NR / Merge / DRC / Dehaze&amp;Enhance 模块参数更新 | 2021-8-24 | 李仁奎欧阳亚凤 |
| v2.1.1 | 1.AE模块参数说明更新2.更新ISP框图 | 2022-4-6 | 朱林靖邓达龙 |

### 2.1 功能简介

ISP21模块支持标准的Sensor图像数据处理，包括自动白平衡，自动曝光，Demosaic,坏点矫正及镜头阴影矫正等基本功能，也支持HDR、去雾、降噪等高级处理功能。具体如下：


| Feature | ISP21(RK3568) | ISP21 Lite(RK3566) |
| --- | --- | --- |
| 支持黑电平矫正 | Y | Y |
| 支持静态以及动态坏点矫正，坏点簇矫正 | Y | Y |
| 支持bayer 降噪 | Y | Y |
| 支持固定噪声消除 | Y | Y |
| 支持Demosaic 处理 | Y | Y |
| 支持gamma矫正 | Y | Y |
| 支持最大2合一宽动态功能 | Y | N |
| 支持自动白平衡 | Y | Y |
| 支持自动曝光 | Y | Y |
| 支持自动对焦 | Y | Y |
| 支持3A相关统计信息输出 | Y | Y |
| 支持镜头阴影矫正 | Y | Y |
| 支持图像锐化 | Y | Y |
| 支持自动去雾处理 | Y | Y |
| 支持局部对比度增强 | Y | Y |
| 支持2D亮度、色彩降噪 | Y | Y |
| 支持3D降噪 | Y | Y |
| 支持矫正镜头垂直方向上的畸变 | Y | Y |
| 支持3DLut 处理 | Y | Y |

### 2.2 ISP功能框图



图2-1 ISP21功能框图

### 2.3 各模块简介


| 模块名称 | 描述 |
| --- | --- |
| FPN | 通过表型的黑帧或者黑行对Sensor输入的图像进行矫正，达到去除SensorFPN的目的。 |
| BLC | 提供Sensor相关的黑电平矫正。 |
| DPCC | 提供对静态坏点和动态坏点的检测和校正功能。 |
| GIC | 矫正Gr与Gb两个通道的失衡，提高部分场景的图像质量。 |
| BNR | 提供在Bayer domain中实现对图像的去噪功能。 |
| LSC | 用于镜头的阴影矫正。 |
| AE | 该模块输出自动曝光的统计信息，软件根据统计信息调节Sensor可实现自动曝光的功能。 |
| Alris | 控制可变光圈，支持P-iris和DC-iris的控制 |
| AF | 支持图像清晰度评价信息统计，用于完成支持自动对焦功能。 |
| AWB | 该模块输出全局统计信息和区域统计信息，软件基于统计信息完成自动白平衡功能。 |
| Demosaic | 将Bayer格式的Raw图像转换到RGB图像。 |
| CCM | 通过标准的3X3的矩阵和矢量偏移量可完成颜色空间的线性矫正。 |
| Gamma | 该模块根据伽马曲线分R\G\B三个通道调整亮度。 |
| Dehaze &amp;Enhance | 提供强大的去雾能力以改善雾霾场景下的视频对比度和清晰度。 |
| CSC | 通过标准的3X3的矩阵和矢量偏移量将输入(R,G，B)转换为(Y,U,V) |
| Sharp | 实现图像锐度，提高图像清晰度。 |
| 3D-LUT | 9x9x9大小的3Dlut实现复杂的颜色调整操作，比如亮度的调整，饱和度的调整。 |
| MERGE | 2帧宽动态合成。 |
| DRC | 利用Iog域下的LUT曲线实现复杂亮度的调整操作。 |
| YNR | YUV区域针对亮度的小波去噪。 |
| UVNR | 单独的彩色噪点去除。 |
| LDCH | 矫正镜头垂直方向上的畸变 |

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

色彩维度：

在AE调节合理的基础上面，接下来主要调节色彩相关的参数，主要涉及的模块有AWB和CCM。颜色前需要准备的环境：黑电平校正准确、LSC标定完成、AE模块参数调试合理。

步骤2：利用AWB标定用的RAW图，用工具生成对应光源对应饱和度下的CCM矩阵。

在此之前需要确认使用的gamma曲线，一般默认gamma2.2，如果对gamma有特殊需求需要先填好gamma曲线。操作界面参考如下：



图3-7 CCM标定界面

步骤3：做完步骤1、2 后我们便可以在标准灯箱里面拍摄各个光源的24色卡图片，用imatest软件测试24色卡的颜色指标。如果指标满足需求，可以初步确定标定得到的AWB参数和CCM矩阵满足需求。

AWB和CCM模块的具体调优需要参考《Rockchip\_Color\_Optimization\_Guide\_ISP2x》

### ---- 结束

### 对比度维度

调整对比度前准备环境：黑电平校正正确、LSC标定完成、AE曝光调整合理、AWB和CCM参数标定合理。



图3-8 静态场景Gamma曲线影响的区域示例

步骤3：在优化完对比度相关参数的基础上，需要对整体对比度效果进行客观测试，在D65光源环境下测试灰阶卡，观察灰阶数是否能达到18阶以上，同时用imatest测试是否能达到14steps。



图 3-9 实验室灯箱D65光源环境下的灰阶卡示例图以及imatest分析结果

### 清晰度和噪声维度

调整清晰度和噪声前准备环境：黑电平校正正确、LSC标定完成、AE曝光调整合理、AWB和CCM参数标定合理、Gamma/Dehaze/Enhance 等调整合理。

影响清晰度和噪声的模块主要包括Bayer NR 、Demosaic、DPCC、YNR、UVNR、3DNR、sharpen、Edgefilter等。

步骤1：图像的基本纹理细节的第一道关口就是Demosaic。在调试该模块前，我们需要确认：黑电平标定准确、RawNR标定合理、AWB/CCM等标定合理。



图 3-10 实验室灯箱D65光源环境下清晰度卡示意图



图 3-11 静态场景ISO50 需要关注锐化纹理示意图

步骤5：DPCC去动态坏点强度只需要在照度稍微低的场景确认清楚即可。照度好的场景建议DPCC的等级开弱点。DPCC的具体调试方法请参考4.8 “DPCC”章节。



3-12 3DNR测试点示意图

步骤7：以上各个步骤完成之后，需要在各个ISO下综合测试最后的效果，必要时候需要做微调，以达到整体的清晰度和噪声的平衡。

### ----结束

#### 3.1.2 HDR 模式图像质量调优

针对HDR模式，图像质量主要关注以下维度：动态范围、亮度、清晰度和噪声、通透性、色彩还原以及运动拖尾的表现等方面，其中亮度涉及的模块主要有AE、LSC；动态范围主要取决于曝光比控制，清晰度和噪声主要涉及到的模块有Bayer NR 、Demosaic、DPCC、YNR、UVNR、3DNR、sharpen、Edgefilter等；通透性主要影响模块有Gamma、Dehaze、Enhance等；色彩还原涉及到模块有AWB、CCM、3DLUT；运动拖尾的严重程度取决与HDR参数的控制和曝光比。HDR典型的应用场景大部分都是包含背光下的人脸获取或者强光下的车牌获取。HDR模式图像调优的整个架构图如图3-13所示。



3-13 HDR模式图像调优架构图

1） 饱和度标定值在80%\~90%左右即可；

2） 如果出现个别颜色表现突兀，可以通过3D lut进行微调。

3) 适当减小TMO模块对于亮度的大幅度提升，降低对色彩还原的影响。亮度不足时可以考虑采用Gamma模块与HDR TMO联调。

在完成Sensor对接和Sensor镜头标定之后，接下来主要针对HDR模式图像质量关注的维度进行图像调优。

### HDR 背光场景提升人脸亮度应用场景调试指南

### 亮度维度：

HDR模式下，场景的亮区优先采用短帧图像，暗区使用长帧图像。背光场景下，人脸处于场景的暗区，提升人脸亮度的步骤建议如下：

1. 通过调整AE参数包括权重表、AE Route、AE长帧目标值等来提升长帧图像的亮度。

2. 通过调整HDR TMO模块参数包括DetailsLowLight来针对暗区亮度进行提升。

3. 通过限制最大曝光比来控制图像动态范围，一定程度上也会轻微提升暗区亮度。



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

### IPC产品应用多场景运行模式

YNR

UVNR

Edgefilter

Gamma

Dehaze & Enhance

### 4.1 AEC

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

### AecGridWeight

【描述】

统计主窗口各个子窗口权重，包含15x15个参数

【注意事项】

356x平台硬件可支持5X5和15X15两种规格的权重设置，调试文件中统一设置15X15的权重，算法内部根据实际硬件配置进行权重的压缩或扩展。

### AecWinScale

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

硬件窗口的偏移值和大小值之和，不可以超过1，即要求h $\mathsf &#123; \Gamma &#125; _ &#123; \mathsf &#123; o f f &#125; &#125; + \mathsf &#123; h \_ s i z e &#125; &lt; = 1 \mathrm &#123; \Omega &#125; , \mathsf &#123; v \_ o f f &#125; + \mathsf &#123; v \_ s i z e &#125; &lt; = 1$

### AecManualCtrl

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

356X平台目前暂不支持ISP数字增益，故ManualIspDgainEn、IspDGainValue皆无效。

### AecSpeed

【描述】

自动曝光调节速度属性。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| DampOver | 环境亮度稳定，图像亮度高于目标值时对应的曝光调节速度，取值范围[0,1] |
| DampUnder | 环境亮度稳定，图像亮度低于目标值时对应的曝光调节速度，取值范围[0,1] |
| DampDark2Bright | 环境亮度突变，从暗到亮时对应的曝光调节速度，取值范围[0,1] |
| DampBright2Dark | 环境亮度突变，从亮到暗时对应的曝光调节速度，取值范围[0,1] |

### 【注意事项】

自动曝光调节阻尼系数，通过调整当前曝光值与当前曝光值的权重，实现曝光速度的调节。最终曝光值 = 当前曝光值 x DampCoef + 新曝光值 x（1 - DampCoef ）

自动曝光调节阻尼系数越大，曝光调节速度越慢，反之越快。为了保证调节过程的平滑，建议调节速度设置在[0.4,0.7]范围内。

【描述】

自动曝光触发延时属性

【成员】


| 成员名称 | 描述 |
| --- | --- |
| BlackDelay | 自动曝光触发延时属性，图像亮度低于目标值超过BlackDelay帧时，Ae开始调节 |
| WhiteDelay | 自动曝光触发延时属性，图像亮度高于目标值超过WhiteDelay帧时，Ae开始调节 |

### 【注意事项】

AecFrameRateMode

【描述】

自动曝光帧率模式，可分为固定帧率模式与自动降帧模式

【成员】


| 成员名称 | 描述 |
| --- | --- |
| isFpsFix | 固定帧率模式的使能，默认值为0，即采用自动降帧模式；值为1时，表示为固定帧率模式。 |
| FpsValue | 仅在固定帧率模式下有效，默认值为0时，使用驱动默认帧率；值不为0时，使用设定的帧率值。 |

### 【注意事项】

自动降帧模式：要求isFpsFix置0，此时FpsValue值无效。自动降帧模式的最小帧率由AecRoute中的最大曝光时间和SensorInfo中的CISMinFps共同决定。AecRoute中的最大曝光时间超过CISMinFps所允许的最大曝光时间时，算法内部将对该值进行校正。当前曝光分解后，若曝光时间大于驱动默认帧率所允许的曝光时间，则会通过修改vblank值，实现降低帧率提高曝光时间；若曝光时间小于等于驱动默认帧率所允许的曝光时间，则当前帧率设置为驱动的默认帧率。自动降帧的具体实现需要依赖AecRoute参数，在AecRoute中设置增益阈值，当增益大于阈值时，触发降帧。

### AecAntiFlicker

【描述】

自动曝光抗工频闪烁属性

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | 抗工频闪烁功能使能，该值为1时，开启抗工频闪烁功能，反之则关闭。 |
| Frequency | 设置工频，共两种：AECV2_FLICKER_FREQUENCY_50HZ和AECV2_FLICKER_FREQUENCY_60HZ |
| Mode | 抗工频闪烁工作模式，共两种模式：AECV2_ANTIFLICKER_NORMAL_MODE模式，AECV2_ANTIFLICKER_AUTO_MODE模式。通过不同的工作模式，调整曝光时间，实现抗工频闪烁。 |

### 【注意事项】

enable使能为0时，代表关闭抗闪功能。

AUTO抗闪模式：曝光时间根据亮度进行调节，最小曝光时间可以到达sensor最小曝光时间，与normal抗闪模式的区别在于高亮度环境，能够抑制过曝，但抗闪失效。

AecEnvLvCalib

【描述】

环境亮度标定参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| CalibFNumber | 环境亮度标定时的基准相对光圈大小，该值与镜头有关 |
| CurveCoeff | 环境亮度标定曲线系数 |

### 【注意事项】

该参数暂时无效，环境亮度标定功能暂不可用

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

### 【描述】

线性曝光支持使用Raw域统计亮度或RGB域统计亮度来计算曝光，根据具体应用需求可以切换。默认使用raw图统计值，即该位置1.

RawStatsEn = 0 , 表示使用RGB图（gamma前）的统计值计算曝光

RawStatsEn = 1 , 表示使用raw图（已减黑电平，并乘上白平衡gain值）的统计值计算曝光

【注意事项】

356X平台线性曝光仅支持raw域统计，因此该参数仅可设置为1。

### ToleranceIn/Out

【描述】

当自动曝光收敛时画面亮度值B应在 [真实生效目标亮度 X（1-容忍度/100）, 真实生效目标亮度X（1+容忍度/100）] 范围内。

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

【成员】

LinearAE


| 成员名称 | 描述 |
| --- | --- |
| TimeDot | 曝光时间节点，单位为秒 |
| GainDot | sensor增益节点，此处增益值为实际值，单位为1x |
| IspgainDot | Isp数字增益节点，此处增益值为实际值，单位为1x |
| PlrisDot | 光圈等效增益节点，此处增益值为实际值，单位为1x |

### 【注意事项】



图4-2 曝光分解示意图

曝光分解曲线节点个数不限，建议至少设置6个节点，以防曝光分解过渡不平滑。

节点中曝光时间分量的单位为秒，最小值允许为0，实际最小曝光时间代码内部会根据sensor限制进行校正。

光圈分量仅支持P-Iris, 不支持DC-Iris。P-iris等效增益分量仅在Airis自动光圈功能使能时有效，否则默认光圈固定为初始值大小。P-iris等效增益的计算详见AecIrisCtrl模块。

如果相邻节点的曝光量增加，则应该只有一个曝光分量增加，其他曝光分量固定。增加的分量决定该段路线的分配策略。例如增益分量增加，其他分量固定，那么该段路线的分配策略是增益优先。

356X平台目前暂不支持ISP数字增益，故IspgainDot参数暂无效。

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

### DySetpoint

【描述】

动态目标亮度值设置。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| ExpLevel | 动态曝光量节点属性，节点值为当前曝光量值，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。 |
| DySetpoint | 动态目标亮度值节点属性，节点值随曝光量动态变化，曝光量节点值越大，目标亮度节点值越小，并与曝光量节点一一对应。节点个数不限，需要与ExpLevel节点个数一致，建议至少设置6个节点，以防曝光过渡不平滑。 |

### 【注意事项】

ExpLevel为当前曝光量值，即(Curgain \* Curtime)。

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
| NonOEPdfHighTh | 非过曝区域占比阈值(0~1），节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点个数需要与ExpLevel一致，节点值需要与ExpLevel——对应。 |
| LowLightPdfTh | 暗区占比阈值(0~1)，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点个数需要与ExpLevel一致，节点值需要与ExpLevel——对应。 |
| TargetLLLuma | 动态暗区亮度目标值，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑。节点个数需要与ExpLevel一致，节点值需要与ExpLevel——对应，随着ExpLevel增大而减小。 |

### 【注意事项】

环境亮度Lv=meanluma/exp/1000 (exp=gain\*time, unit：s)

以上环境亮度的高低阈值用于计算环境亮度因子。

### OverExpCtrl

### 【描述】

强光抑制模块，降低曝光减轻画面过曝程度。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | 模块使能位，1：使能，0：关闭 |
| HighLightTh | 高亮区域的亮度阈值，取值范围[0,255] |
| LowLightTh | 低亮区域的亮度阈值，取值范围[0,255] |
| MaxWeight | 最大权重值 |
| OEPdf | 过曝区域占比，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑，占比值从小到大变化，取值范围[0,1] |
| HighLightWeight | 高亮区域权重，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑，与过曝区域占比节点相对应，最大值受MaxWeight限制。 |
| LowLightWeight | 低亮区域权重，节点个数不限，建议至少设置6个节点，以防曝光过渡不平滑，与过曝区域占比节点相对应，最大值受MaxWeight限制。 |

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

【描述】

画面亮度的容忍度。单位为%，取值范围为[0,100]

当自动曝光收敛时画面亮度值B应在 [真实生效目标亮度 X（1-容忍度/100）, 真实生效目标亮度X（1+容忍度/100）] 范围内。

ToleranceIn代表曝光未收敛时的容忍度，ToleranceOut代表曝光收敛时的容忍度。建议ToleranceIn &lt;ToleranceOut，可避免曝光变动过于灵敏，用于稳定曝光。

### StrategyMode

【描述】

自动曝光策略模式，高光优先或低光优先.

【成员】

高光优先：AECV2\_STRATEGY\_MODE\_HIGHLIGHT\_PRIOR

低光优先：AECV2\_STRATEGY\_MODE\_LOWLIGHT\_PRIOR

### 【注意事项】

此参数在不同曝光比模式下，表现不同，详见ExpRatioCtrl参数。

EvBias

【描述】

自动曝光调节时，曝光量的偏差百分比，单位为%，取值范围为[-200,+200]。用于特殊场景下对目标亮度值进行调整。真实生效目标亮度为目标值 X [1+abs(EvBias)/100]^[EvBias/abs(EvBias)]。

如设置EvBias=100时，目标亮度为默认参数的2倍；EvBias=-100时，目标亮度为默认参数的1/2。

【注意事项】

如上述的toleranceIn/Out设置较大，一方面会影响AE的响应速度，一方面会影响EvBias值。当EvBias调整的间隔值低于toleranceIn/Out，有可能导致亮度调整不生效。

### InitExp

### 【描述】

Hdr曝光模式初始值设置。

### 【成员】


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

### Route

### 【描述】

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Frm0/1/2TimeDot | 曝光时间节点，单位为秒。Hdr 2帧模式时，仅Frm0/1TimeDot有效；Hdr 3帧模式时，Frm0/1/2TimeDot皆有效。Frm0~3依次为曝光量从短至长的帧序号。 |
| Frm0/1/2GainDot | sensor增益节点。Hdr 2帧模式时，仅Frm0/1GainDot有效；Hdr 3帧模式时，Frm0/1/2GainDot皆有效。此处增益值为实际值，单位为1x。Frm0~3依次为曝光量从短至长的帧序号。 |
| Frm0/1/2IspDGainDot | Isp数字增益节点。Hdr 2帧模式时，仅Frm0/1IspDGainDot有效；Hdr 3帧模式时，Frm0/1/2IspDGainDot皆有效。此处增益值为实际值，单位为1x。Frm0~3依次为曝光量从短至长的帧序号。 |
| PlrisDot | 光圈等效增益节点，此处增益值为实际值，单位为1x |

### 【注意事项】



图4-2 曝光分解示意图

曝光分解曲线节点个数不限，建议至少设置6个节点，才可实现曝光分解的平滑。

节点中曝光时间分量的单位为秒，最小值允许为0，实际最小曝光时间代码内部会根据sensor限制进行校正。

光圈分量仅支持P-Iris, 不支持DC-Iris。P-iris等效增益分量仅在Airis自动光圈功能使能时有效，否则默认光圈固定为初始值大小。P-iris等效增益的计算详见AecIrisCtrl模块。

设置的曝光分解路线节点不是最终生效的曝光分解路线。系统最终各曝光分量的实际最大/小值由曝光分解节点和手动配置的曝光分量最大/小值共同决定。先对曝光分解路线节点最大/小值做第一次校正，当节点最大/小值不超过sensor或isp的限制时，节点最大/小值不变；当节点最大/小值超过sensor或isp的限制时，节点最大/小值以sensor或isp的限制为准。当手动配置的曝光分量最大/小值为0时，最终生效的曝光分解路线以第一次校正的分解路线为准；当手动配置的曝光分量最大小值不为0时，且设置的最大/小值不超过sensor或isp的限制时，对曝光分解路线做第二次校正，节点最大/小值以手动设置的范围为准；若设置曝光分量的最大/小值超过sensor或isp的限制时，曝光分解路线曝光分量的节点最大/小值以第一次校正结果为准。

如果相邻节点的曝光量增加，则应该只有一个曝光分量增加，其他曝光分量固定。增加的分量决定该段路线的分配策略。例如增益分量增加，其他分量固定，那么该段路线的分配策略是增益优先。

### ExpRatioCtrl

【描述】

HdrAE曝光比控制模块。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| ExpRatioType | 曝光比模式，仅在Hdr模式多帧合成下有效AUTO：根据场景，自动计算长短帧的曝光比FIX：长短帧采用固定曝光比 |
| RatioExpDot | 表示曝光量节点，根据曝光量，动态设置曝光比固定值或曝光比最大值，二者一对应。节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。 |
| M2SRatioFix | 节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与 RatioExpDot节点个数一致。ExpRatioType = AUTO时，无效。ExpRatioType = FIX时，表示中帧与短帧的曝光比，与曝光量节点RatioExpDot——对应。。 |
| L2MRatioFix | 节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与 RatioExpDot节点个数一致。ExpRatioType = AUTO时，无效。ExpRatioType = FIX时，表示长帧与中帧的曝光比,与曝光量节点RatioExpDot——对应。Hdr为2帧合成时无效，3帧合成时有效。 |
| M2SRatioMax | 节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与 RatioExpDot节点个数一致。ExpRatioType = AUTO时，表示中帧与短帧的曝光比动态最大值，与曝光量节点RatioExpDot——对应。ExpRatioType= FIX时，无效 |
| L2MRatioMax | 节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。节点个数需要与 RatioExpDot节点个数一致。ExpRatioType = AUTO时，表示长帧与中帧的曝光比动态最大值,与曝光量节点RatioExpDot——对应。Hdr为2帧合成时无效，3帧合成时有效。ExpRatioType = FIX时，无效。 |

### 【注意事项】

自动曝光比模式，2帧HDR模式下，当AEC控制算法模块求得的长短帧曝光比超过最大曝光比M2SratioMax限制时，根据StrategyMode选择需要优先保证曝光的帧。StrategyMode =HIGHLIGHT\_PRIOR，优先保证短曝帧的曝光，长曝帧曝光=短曝帧曝光\*M2SratioMax；StrategyMode = LOWLIGHT\_PRIOR，优先保证长曝帧的曝光，短曝帧曝光=长曝帧曝光/M2SratioMax。以此类推，3帧HDR模式下，当StrategyMode = HIGHLIGHT\_PRIOR，优先保证曝光较短帧的曝光；StrategyMode = LOWLIGHT \_PRIOR，优先保证曝光较长帧的曝光。

### LongFrmMode

【描述】

### HdrAE长帧模式功能控制模块

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Mode | 长帧模式，包括：NORMAL/AUTO_LONGFRAME/LONGFRAME NORMAL:正常Hdr模式。Ae和Hdr合成模块按照手动/自动曝光比进行工作。AUTO_LONGFRAME:自动长帧模式。在曝光超过设定的阈值时，长帧曝光时间接近1帧所允许的最大值，合成模块只输出长帧。LONGFRAME:长帧模式。AE将短帧曝光时间设为最小值，长帧曝光时间接近1帧所允许的最大值，合成模块只输出长帧。 |
| SfrmMinLine | 长帧模式/自动长帧模式下，短帧最小曝光行。由于sensor的一些限制，长帧模式下，短帧的最小曝光行可能无法达到sensor允许的最小曝光行，因此需要另行设置。 |
| LfrmModeExpTh | 自动长帧模式下，当长帧曝光超过LfrmModeExpTh，切换为长帧模式 |

### LframeCtrl

【描述】

【成员】


| 成员名称 | 描述 |
| --- | --- |
| OEROILowTh | 过曝区域亮度最低值,用于区分过曝区域与非过曝区域 |
| LvHighTh | 环境亮度高阈值 |
| LvLowTh | 环境亮度低阈值 |
| LExpLevel | 动态长帧曝光值节点参数，节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。ExpLevel =gain*time(time单位为s) |
| LSetPoint | 动态长帧全局目标亮度值，节点个数需要与LExpLevel保持一致，节点值与LExpLevel各节点值——对应。 |
| NonOEPdfHighTh | 非过曝区域占比阈值(0~1），节点个数需要与LExpLevel保持一致，节点值与LExpLevel——对应。 |
| LowLightPdfTh | 暗区占比阈值(0~1），节点个数需要与LExpLevel保持一致，节点值与LExpLevel各节点值——对应,随着ExpLevel增大而增大。 |
| TargetLLLuma | 动态长帧暗区亮度目标值，节点个数需要与LExpLevel保持一致，节点值与LExpLevel各节点值——对应，随着ExpLevel增大而减小。 |

### 【注意事项】

环境亮度Lv=meanluma/exp/1000 (exp=gain\*time,unit:s)

LvHighTh: 环境亮度高阈值，该值越大，则越不容易触发背光补偿，反之，则容易触发背光补偿。  

等价于区分室内室外的环境亮度阈值，建议LvHighTh=setpoint/(室外曝光)。LvLowTh: 环境亮度低阈值，该值越大，则越不容易触发背光补偿，反之，则容易触发背光补偿。  

等价于区分室内亮暗环境的环境亮度阈值，建议LvHighTh=setpoint/(室内暗环境曝光)。

以上环境亮度的高低阈值用于计算环境亮度因子。

建议暗区目标值不要超过全局目标值的50%，控制在全局目标亮度的40%\~50%，否则可能出现背光场景下亮度过亮的现象。

### MframeCtrl

【描述】

中帧调试参数（仅Hdr 3帧时有效）

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MExpLevel | 动态中帧曝光值节点参数，节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。ExpLevel =gain*time(time 单位为s) |
| MSetPoint | 动态中帧全局目标亮度值，节点个数需要与MExpLevel保持一致，节点值与MExpLevel各节点值一—对应。随曝光增长，目标值降低。 |

### SframeCtrl

【描述】

短帧调试参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| SExpLevel | 动态短帧最大曝光值节点参数，节点个数不限，建议至少设置6个节点，才可实现曝光过渡的平滑。ExpLevel =gain*time(time单位为s) |
| SSetPoint | 动态短帧全局平均亮度目标值,节点个数需要与MExpLevel保持一致，节点值与MExpLevel各节点值一一对应。同区间内的亮区亮度目标值要求高于对应全局亮度目标值。 |
| TargetHLLuma | 动态短帧高亮区均值目标值，节点个数需要与MExpLevel保持一致，节点值与MExpLevel各节点值——对应. |
| HLLumaTolerance | 设置短帧高亮区目标容忍百分比，单位为% |
| HLROIExpandEn | 短帧高亮区扩展使能。=1，忽略占比较小的高亮区，减小高亮区灵敏度；=0，对所有高亮区进行亮度抑制，增大高亮区灵敏度 |

##### 4.1.2.4 AEC模块光圈调试参数

IrisCtrl

### 【描述】

光圈控制参数

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | 自动光圈控制功能的使能 |
| IrisType | 光圈类型，P(即P-iris光圈)或DC(即DC-iris光圈) |
| ManualEn | 手动光圈使能 |
| ManualAttr | 手动光圈控制参数，仅在ManualEn=1时有效 |
| InitAttr | 光圈初始值参数 |
| PlrisAttr | P光圈控制参数 |
| DClrisAttr | DC光圈控制参数 |

ManualAttr


| 成员名称 | 描述 |
| --- | --- |
| PIrisGainValue | 手动P光圈等效增益值，此处增益值为实际值，单位为1x，参数值受P光圈设备限制，取值范围为[1，1024] |
| DCIrisHoldValue | 手动DC光圈HoldValue值，参数值与DC光圈设备有关，取值范围为[0，100] |

InitAttr


| 成员名称 | 描述 |
| --- | --- |
| PIrisGainValue | P光圈等效增益初始值，此处增益值为实际值，单位为1x，参数值受P光圈设备限制，取值范围为[1，1024] |
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
| OpenPwmDuty | 光圈打开时的PWM占空比阈值，当光圈PWM占空比高于(不含）OpenPwmDuty时，光圈处于打开状态。具体大小与DC-iris镜头有关，单位为%，取值范围[0,100]。 |
| ClosePwmDuty | 光圈关闭时的PWM占空比阈值，当光圈PWM占空比小于(不含）ClosePwmDuty时，光圈处于关闭状态。具体大小与DC-iris镜头有关，单位为%，取值范围[0,100]。 |

### 【注意事项】

ManualIrisEn，手动光圈控制使能。当光圈类型IrisType为P光圈时，仅PirisGainValue有效；当光圈类型为DC光圈时，仅DCIrisHoldValue有效。

自动光圈Airis算法的基本控制流程如下：

针对P-iris镜头，光圈控制通过AecRoute模块进行。P-iris镜头的光圈大小换算为等效增益，参与曝光分解计算。

作表时，需要将步进电机位置对应的光圈孔径换算为等效增益，填入StepTable中，并固定按照步进电机位置递增（即step0、step1……stepN）的顺序填入。

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


| 成员名称 | 描述 |
| --- | --- |
| Enable | 曝光与统计同步测试功能的使能 |
| IntervalFrm | 曝光切换间隔帧数 |
| AlterExp | 曝光切换参数 |

AlterExp

根据模式的不同，分为LinearAE和HdrAE两套参数。


| 成员名称 | 描述 |
| --- | --- |
| TimeValue | 曝光时间值 |
| GainValue | 曝光增益值 |
| IspDgainValue | Isp数字增益值 |
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


| 成员名称 | 描述 |
| --- | --- |
| GainMode | 增益转换公式模式，EXPGAIN MODE NONLINEAR DB为非线性模式EXPGAIN_MODE_LINEAR为线性模式。 |
| GainRange | 线性增益转换公式，支持分段线性。当GainMode = EXPGAIN_MODE_LINEAR时有效。 |

### 【注意事项】

sensor增益转寄存器值公式中的sensor增益指sensor的total gain = again\*dgain。若again与dgain的转换公式不同，支持分段设置，如上图所示，size需要做适应性修改。

线性sensor增益转寄存器值公式，由3个系数构成（M0、C0、C1），系数说明如下：

转换公式为： $\begin&#123;array&#125; &#123; r l &#125; &#123; &#123; 5 &#125; \mathsf &#123; e t t o d r i v e r &#125; \mathsf &#123; r e g &#125; = &#125; & &#123; &#123; &#125; ( \mathsf &#123; g a i n &#125; ^ &#123; \wedge &#125; \mathsf &#123; M &#125; 0 ) \mathsf &#123; \Omega &#125; ^ &#123; \star &#125; \mathsf &#123; C &#125; 1 - \mathsf &#123; C &#125; 0 + 0 . 5 &#125; \end&#123;array&#125;$

xml 参数对应：

第一列： gain 区间起始值，第二列 gain 区间结束值，第三列： C1，第四列： C0，

第五列： M0，第六列： gain 起始值对应 reg， 第七列： gain 结束值对应 reg

GainMode = EXPGAIN\_MODE\_NONLINEAR\_DB时，使用非线性sensor增益转换公式，目前仅支持dB模式。dB模式对应的转换公式为：reg = 20xlog10(gain)x10/3，此公式无需填写，算法内部默认使用该公式。

针对支持DCG的sensor，且转换公式为线性模式时，GainRange填写LCG的增益转换公式。

### 【举例】

### s5kgm1sp

该sensor的模拟增益和数字增益转换公式不同，如图4-3、4-4所示，模拟增益寄存器值为模拟增益的32倍，数字增益寄存器值为数字增益的256倍。

Analog gain can be calculated by the following equation:

$$

```
g a i n = \frac { x } { 0 . 1 2 0 }
```

$$

```
NOTE: In S5KGM1ST03, Analog gain is global; there is no per-channel gain. $g a i n = \frac { x } { 3 2 }$ Gain is supported up to X16. 图4-3 模拟增益转寄存器值示例

SMIA gain registers interface, which is coarse and supports fractional gain of 1/256 scale

Digital gain of the four Baver channels is controlled separately using the four parameters shown in the following table. When digital gain is applied, the LSB(s) resulting data shall be padded with zeros.
```

Table 15Digital Gain Examples


| Gain Value | api_rw_digital_gain_code_XXX Register Value |
| --- | --- |
| X1 | 0x0100 |
| X2 | 0x0200 |
| X3 | 0x0300 |
| X8 | 0x0800 |
| X16 | 0x1000 |

图4-4 数字增益转寄存器值示例

已知s5kgm1sp的模拟增益最大值为16X，数字增益最大值为16X，且Total gain = again\*dgain。当Total gain &lt;=16X时，again有效，dgain=1X；当Total gain &gt; 16X时，again = 16X, dgain有效。因此填写转换公式时，[1,16]倍Total gain与[16,256]倍Total gain需要分开配置，具体配置如下：

[1.0000 16.0000 32.0000 0.0000 1.0000 32.0000 512.0000 16.0000 256.0000 16.0000 -512.0000 1.0000 768.0000 4608.0000 ]

[16,256]倍Total gain区间，模拟增益固定为16X（a\_reg=16x32=512）, 数字增益d\_reg = dgain x256，其对应的配置公式所得寄存器值reg=a\_reg+d\_reg = 512 + Total gain /16 x 256 = 512+Totalgain x 16，即M0=1, C0=-512,C1=16。驱动中获取到应用下发的total gain寄存器值(以下用reg表示)需要做如下适应性修改：

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
| CISIspDgainRange | Isp数字增益range，最小值不得低于1356x平台目前暂不支持ISP数字增益，该项最大最小值分别填1。 |
| CISHdrGainIndSetEn | Hdr模式下是否支持多帧的sensor曝光增益独立设置- 值为0，代表多帧共用一个增益，如sensor gc2093;- 值为1，代表多帧支持独立设置增益。该模式仅针对HDR stagger模式，HDR DCG模式该参数无效 |

### CISTimeSet

【描述】

与CIS相关的曝光时间设置，根据曝光的模式不同，分为Linear和HDR两种模式，其中HDR又分为2帧和3帧两种配置。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| CISLinTimeRegMaxFac | Linear曝光模式下，最大曝光时间行与VTS的关系，由两个系数(CO,C1)组成MaxTimeLine = C0*vts – C1系数的具体值详见sensor原厂给出的datasheet |
| CISHdrTimeRegSumFac | Hdr曝光模式下，多帧最大曝光时间行之和与VTS的关系，由两个系数（CO,C1）组成MaxTimeLineSum = C0*vts - C1系数的具体值详见sensor原厂给出的datasheet |
| CISTimeRegMin | 线性/HDR曝光模式sensor曝光时间行（寄存器值）允许的最小值，为整型 |
| CISTimeRegOdevity | 线性/HDR曝光模式sensor曝光时间行奇偶性，由两个系数(CO,C1)组成Line = C0*x+C1- 无奇偶限制：CO=1C1=0- 固定奇数行：C0=2 C1=1- 固定偶数行：C0=2 C1=0- 固定为N的整数倍行：CO=N C1=0 |
| CISTimeRegUnEqualEn | Hdr模式Sensor对各帧（S/M/L）曝光时间行不相等限制- En=0 sensor Hdr模式允许各帧曝光时间行相等；- En=1 sensor Hdr模式不允许各帧曝光时间行相等。 |
| CISTimeRegMax | Hdr曝光模式sensor曝光时间行（寄存器值）允许的最大值，为整型。-该参数由3个元素组成，Hdr2帧时前2个元素有效，分别代表短帧、长帧对应的最大曝光时间行；Hdr3帧时3个元素皆有效，分别代表短帧、中帧、长帧对应的最大曝光时间行。-一般sensor对Hdr模式下各帧的最大曝光时间行无限制，此时该参数可填0，即代表sensor无最大曝光时间行的限制。当该值不为0时，各帧的曝光时间最大行以该参数为准。以imx307为例，该sensor对短帧的最大曝光行有限制，要求为222行，对长帧中帧则无此限制。因此该参数可填写为：[22200] |

### CISHdrSet

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
| sync_switch | 同步切换开关(仅HDR模式下有效)。=1，各帧同步切换Dual conversiongain模式，以长帧为准；=0，各帧不同步切换Dual conversion gain |
| gain_ctrl | 以曝光增益为准，切换Dual conversion gain。Icg2hcg_th：LCG转HCG阈值hcg2Icg_th：HCG转LCG阈值 |

### 【注意事项】

该模块用于控制DCG的切换，要求sensor支持DCG模式切换的配置。如sensor的DCG功能为内部自动切换时，该模块需要关闭。

Sensor采用HDR-DCG模式时，短曝帧固定为LCG, 长曝帧固定为HCG。因此需要将dcg\_optype置为MANUAL，2帧时dcgmode\_init = [0 1 0]，3帧时dcgmode\_init=[0 0 1]。

若sensor不支持Dual conversion gain功能时，dcg\_ratio需要置为1。

### CISExpUpdate

【描述】

曝光生效模块参数，该模块参数一般从sensor的datasheet获知。鉴于部分sensor在normal模式和Hdr模式下曝光的生效帧数不同，该模块需要按照模式分开填写。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| time_update | sensor曝光时间生效帧数 |
| gain_update | sensor曝光增益生效帧数 |
| dcg_update | Dual conversion gain模式生效帧数 |

### 【注意事项】

该模块的值需要以sensor原厂所给的datasheet为准，不可随意设置。如该模块值出错，可能导致曝光调节过程中出现闪烁。

一般sensor的datasheet会描述曝光时间和增益的生效帧数。如曝光时间和增益在第n帧写入，n+2帧生效，则time\_delay = 2, gain\_delay =2，以此类推。

部分sensor的曝光时间和增益生效帧数不同，如该模块参数出错，则有可能在曝光调节的过程中出现曝光时间和增益生效不同步，导致闪烁现象。

### CISMinFps

【描述】

允许最小帧率，用于自动降帧模式，限制最小帧率，以防低照环境下，帧率过低导致拖影严重影响效果。

### CISFlip

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

isp去噪模块包含 bayernr 2d, bayernr 3d, ynr和cnr4个模块。

isp锐化模块包含sharp一个模块。



NR pipeline框图

建议按照pipeline上的先后顺序进行噪声调试，每个模块调试时候都需要考虑模块前后级的效果相互影响以及综合的效果。

在噪声调试过程中，需要按照顺序将各个步骤的效果对应输出查看，好明确每个步骤对去噪的影响。

如查看bayernr2d效果，需对比未去噪原始图，和仅打开bayernr2d效果图。

如查看ynr效果，需要对比bayernr3d输出效果图，和仅经过ynr但是sharp关闭的图像对比。

以此类推。

#### 4.2.1 BayerNR 2D

##### 4.2.1.1 功能描述

bayernr 2d模块主要是对raw数据进行空域降噪的模块。模块内部会判断是否是hdr模式，转换去噪力度对hdr的长短帧同时进行降噪处理。

tuning过程需要对raw数据的噪声方差进行标定，来获取相应的标定数据，来更好的针对噪声特性进行去噪。



bayernr2d框图

##### 4.2.1.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| ISO | 调试参数 | 常调试参数 |
| filter_strength | 调试参数 | 常调试参数 |
| gauss_guide | 调试参数 | 常调试参数 |
| lumapoint | 标定数据 | 标定工具产生参数 |
| sigma | 标定数据 | 标定工具产生参数 |
| edgesofts | 调试参数 | 不常调试参数 |
| ratio | 调试参数 | 常调试参数 |
| weight | 调试参数 | 常调试参数 |

### Enable:

【描述】

模块开关使能。1：模块打开，0：模块关闭。

ModeName

【描述】

目前支持normal,hdr,gray 3个模式参数。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。

hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

### filter\_strength

【描述】

去噪力度参数。取值范围[0, 15.9], 值越大，去噪力度越大。

gauss\_guide

【描述】

高斯导向是否使能。1：使能。0：关闭。

### lumapoint/sigma

【描述】

不同pixel亮度，对应不同噪声sigma曲线点。共16个点。

横坐标像素亮度，取值范围[0, 65535]

纵坐标噪声sigma曲线, 取值范围[0, 65535];

edgesofts:

【描述】

影响空域权重。一般不需要修改。

ratio:

【描述】

软阈值权重。取值范围[0, 0.99].。值越小，去噪力度越大。

值大于0.1，会导致整体去噪效果不明显。 值设置最好小于0.1。

新版参数算法有重新修改力度，力度可能上一句参考可能不准了。

### Weight:

滤波输出权重，取值范围[0, 0.99], 值越大，去噪力度越大。

##### 4.2.1.3 调试步骤

调试时：关闭bayernr3d, ynr, cnr, sharp等模块。

Bayernr2D可抑制高频噪声，影响图像细节和噪声形态。力度大时，噪声颗粒变低频，细节变少。

调节bayernr2D的力度，平衡噪声和细节损失。

低iso下，整体去噪力度小一些， filter\_strength小一些， weight小一些。

高iso下，建议可适当逐步增加力度， filter\_strength大一些， weight大一些。

#### 4.2.2 Bayernr3D

##### 4.2.2.1 功能描述

此模块是在raw域数据上对图像进行时域的降噪和软阈值降噪处理。其中当前帧和IIR帧数据都会分为低频层和高频层分别进行处理降噪。

此模块tuning时候需要标定数据和bayernr 2d模块是采用相同的标定数据，来更好的针对噪声特性进行去噪。



bayernr3d框图

##### 4.2.2.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| ISO | 调试参数 | 常调试参数 |
| filter_strength | 调试参数 | 常调试参数 |
| sp_filter_strength | 调试参数 | 不常调试参数 |
| lo_clipwgt | 调试参数 | 常调试参数 |
| hi_clipwgt | 调试参数 | 常调试参数 |
| softwgt | 调试参数 | 常调试参数 |
| lumapoint | 标定数据 | 标定工具产生参数 |
| sigma | 标定数据 | 标定工具产生参数 |

### Enable:

【描述】

Bayernr3d模块使能位，0：关闭，1：打开。

ModeName

【描述】

目前支持normal,hdr,gray 3个模式参数。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

filter\_strength

【描述】

时域降噪运动判断权重设置的力度，值越小，去噪力度越强, 物体越虚化拖影越大。

取值范围[0, 0.99]。

sp\_filter\_strength

【描述】

默认不会使用到。默认选择模式，使用是上面filter\_strength.

lo\_clipwgt:

【描述】

低频叠帧权重限制。值越小，叠帧越多，去噪效果更好。

取值范围[0.001, 1.0]。

hi\_clipwgt

【描述】

高频叠帧权重限制。值越小，叠帧越多，去噪效果更好。

取值范围[0.001, 1.0]。

调试主要可先将clipwgt先设置0.125, 再来调试filter\_strength的值。

Softwgt

【描述】

软阈值权重。值越小，去噪越好。取值范围[0, 0.99];

### Lumapoint/sigma

【描述】

像素不同亮度对应的噪声曲线值。共16个点。

横坐标像素亮度，取值范围[0, 65535]；

纵坐标噪声曲线值，取值范围[0, 65535]。

##### 4.2.2.3 调试步骤

关闭bayernr2d,ynr,cnr,sharp模块

调节filter\_strength,lo\_clipwgt,hi\_clipwgt 参数，平衡去噪和拖影水平。

正常多帧叠加去噪是不会影响噪声形态。

但是在多帧叠加后，bayernr3d里还有一个软阈值处理，所以会影响噪声形态。

软阈值处理越强，噪声颗粒会变的更低频。

#### 4.2.3 YNR

##### 4.2.3.1 功能描述

该模块在YUV域上对图像亮度信号进行去噪等处理。模块内部会利用上一帧下采样图像和当前帧图像进行双边去噪、软阈值去噪、边缘滤波等处理。

该去噪模块基于噪声标定结果，建立更符合噪声特性的去噪模型。

支持分别针对高信噪比与低信噪比2种噪声标定以及噪声参数，例如：支持双转换增益模式（Duaconvertion gain DCG）的CIS，高转换增益(HCG)对应高信噪比模式，低转换增益(HCG)对应低信噪比模式。



图4-2-3-1 YNR功能框图

##### 4.2.3.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| ynr_bft3x3_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_lbft5x5_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_lgft3x3_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_flt1x1_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| ynr_sft5x5_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| rnr_strength | 调试参数 | 常调试参数 |
| sigma_curve | 标定数据 | 标定工具产生参数 |
| ynr_ci | 标定数据 | 标定工具产生参数 |
| low_bf | 调试参数 | 常调试参数 |
| low_thred_adj | 调试参数 | 常调试参数 |
| low_peak_supress | 调试参数 | 常调试参数 |
| low_edge_adj_thresh | 调试参数 | 常调试参数 |
| low_center_weight | 调试参数 | 常调试参数 |
| low_dist_adj | 调试参数 | 常调试参数 |
| low_weight | 调试参数 | 常调试参数 |
| low_filt_strength | 调试参数 | 常调试参数 |
| low_bi_weight | 调试参数 | 常调试参数 |
| base_filter_weight | 调试参数 | 不常调试参数 |
| high_thred_adj | 调试参数 | 常调试参数 |
| high_weight | 调试参数 | 常调试参数 |
| high_direction_weight | 调试参数 | 不常调试参数 |
| hi_min_adj | 调试参数 | 常调试参数 |
| hi_edge_thed | 调试参数 | 常调试参数 |

Enable:  

【描述】  

ynr模块使能开关，1：模块打开，0：模块关闭。

### ModeName

【描述】

目前支持normal,hdr,gray 3个模式参数。

### SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。

hsnr对应hcg, lsnr对应lcg模式。

### Sensor\_Mode

【描述】

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。不同iso档位，对应不同调试参数。目前仅支持13档。

ynr\_bft3x3\_bypass,ynr\_lbft5x5\_bypass,ynr\_lgft3x3\_bypass,ynr\_flt1x1\_bypass， ynr\_sft5x5\_bypass

【描述】

模块内部子模块bypass功能。0：功能使能。 1：功能bypass。

一般情况，全部子模块都打开使能。

### rnr\_strength

【描述】

图像中心，按照圆的半径r方向，进行去噪力度设置。

主要是为lsc这种噪声进行配置的。取值范围[0, 15.9 ]。

sigma\_curve

【描述】

噪声sigma曲线。

ynr\_ci

【描述】

第一行影响低频sigma。

第二行影响高频sigma。

low\_bf

【描述】

双边滤波力度参数。

第一行是原图3x3双边滤波力度，值越大，去噪越强。取值范围[0.32, 512]。

第二行是上一帧小图5x5双边滤波力度，值越大，去噪越强。取值范围[0.32, 512]。

low\_thred\_adj

【描述】

低频软阈值的调整力度，值越大，低频降噪力度越大。取值范围[0, 31]。

low\_peak\_supress

【描述】

low\_edge\_adj\_thresh

【描述】

小图边缘检测的调整系数的门限，用于限制调整系数所能取到的最大值。

值越小，去噪力度越大，图像越模糊。取值范围[0, 1023]整数。

low\_center\_weight

【描述】

5x5 双边滤波时中心点的权重，该值越小，则降噪力度越强。

取值范围[0,1]。

low\_dist\_adj

【描述】

双边滤波距离权重调整因子。值越小，去噪越强。取值范围[0, 63]。

low\_weight

【描述】

低频去噪结果的权重,值越大，低频降噪力度越大。取值范围[0, 1]。

low\_filt\_strength

【描述】

第一行对原图进行高斯滤波的滤波核权重。

第二行对双边滤波的结果进行高斯滤波的滤波核权重。

low\_bi\_weight

【描述】

软阈值处理中使用的第一步双边滤波权重，该值越大，则降噪力度也越大。

取值范围[0, 1]。

base\_filter\_weight

【描述】

方向滤波器的系数 。

high\_thred\_adj

【描述】

软阈值的调整系数，该值越大，则高频降噪的力度也越大。

取值范围[0, 31]。

high\_weight

【描述】

高频去噪权重，注意该值表示的是保留的高频分量的比例，

值越小，则表示降噪力度越强. 取值范围[0, 1]。

high\_direction\_weight

【描述】

各个方向的权重设置， 某一方向上该值越大，

表示沿着该方向的降噪力度越强。

hi\_min\_adj

【描述】

所有差异值减去的最小差异值的比例，该值越大，则边缘越锐利。

取值范围[0, 0.98]。

hi\_edge\_thed

【描述】

对差异值作限制的门限，该值越小，则高频降噪力度越大。

取值范围[0, 255]的整数。

##### 4.2.3.3 调试步骤

关闭sharp模块。

调节low bf, low thred adj, low weight, low bi weight等低频去噪参数，

调节high weight, high thred adj 等高频去噪参数，

调节rnr\_strength，对边角噪声力度调节。

#### 4.2.4 CNR

##### 4.2.4.1 功能描述

本模块主要是针对uv数据进行彩色噪声降噪处理。和rk isp20的uvnr模块算法较为接近。

每个尺度上下采样同时进行中值滤波，然后对uv数据进行双边滤波，滤波时候会参考y的梯度对边缘色噪进行处理，最后和未去噪图像进行插值输出。



图4-2-3-1 CNR功能框图

##### 4.2.4.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| hf_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| If_bypass | 调试参数 | 不常调试参数，开关内部模块 |
| cnr_exgain | 调试参数 | 不常调试参数 |
| cnr_g_gain | 调试参数 | 不常调试参数 |
| color_sat_adj | 调试参数 | 常调试参数 |
| color_sat_adj_alpha | 调试参数 | 常调试参数 |
| hf_spikes_reducion_strength | 调试参数 | 常调试参数 |
| hf_denoise_strength | 调试参数 | 常调试参数 |
| hf_color_sat | 调试参数 | 常调试参数 |
| hf_denoise_alpha | 调试参数 | 常调试参数 |
| hf_bf_wgt_clip | 调试参数 | 常调试参数 |
| thumb_spikes_reducion_strength | 调试参数 | 常调试参数 |
| thumb_denoise_strength | 调试参数 | 常调试参数 |
| thumb_color_sat | 调试参数 | 常调试参数 |
| If_denoise_strength | 调试参数 | 常调试参数 |
| If_color_sat | 调试参数 | 常调试参数 |
| If_denoise_alpha | 调试参数 | 常调试参数 |
| kernel_5x5 | 调试参数 | 常调试参数 |

Enable

【描述】

模块开关使能。1：模块打开，0：模块关闭。

ModeName

【描述】

目前支持normal,hdr,gray 3个模式参数。

### SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

hf\_bypass

【描述】

高频降噪bypass. 0：不bypass, 1:bypass.

lf\_bypass

【描述】

低频降噪bypass.0：不bypass, 1:bypass.

cnr\_exgain

【描述】

3566没有externel gain，固定用1.0.

cnr\_g\_gain

【描述】

放大externel gain,目前固定1.0.

color\_sat\_adj

【描述】

基于梯度调整双边滤波的 uv 比例，1\~255。值越小，去彩噪越好。

color\_sat\_adj\_alpha

【描述】

color\_sat\_adj 调整的比例：0.0\~1.0 。

hf\_spikes\_reducion\_strength

【描述】

高频中值滤波强度：0.0\~1.0 。值越大，中值滤波越强。

hf\_denoise\_strength

【描述】

高频双边滤波强度：1\~1023，值越大，去彩噪越好。

hf\_color\_sat

【描述】

高频双边滤波的 uv 比例因子：0.0\~7.9.值越小，色彩饱和度下降越多。

hf\_denoise\_alpha

【描述】

高频双边滤波中心点的权重：0\~1.0。

hf\_bf\_wgt\_clip

【描述】

高频最小去噪力度：0-255的整数。值越大，去噪越强。

thumb\_spikes\_reducion\_strength

【描述】

缩略图中值滤波强度：0.0\~1.0。值越大，中值滤波越强。

thumb\_denoise\_strength

【描述】

缩略图双边滤波强度：1\~1023。值越大，去彩噪越好。

thumb\_color\_sat

【描述】

缩略图双边滤波的 uv 比例因子：0.0\~7.9。值越小，色彩饱和度下降越多。

### lf\_denoise\_strength

【描述】

低频双边滤波强度：1\~1023。值越大，去彩噪越好。

lf\_color\_sat

【描述】

低频双边滤波的 uv 比例因子：0.0\~7.9。值越小，色彩饱和度下降越多。

lf\_denoise\_alpha

【描述】

低频双边滤波中心点的权重：0.1\~1.0

kernel\_5x5

【描述】

5x5双边滤波核。

##### 4.2.4.3 调试步骤

关闭sharp模块。

调节各层denoise\_strength, denoise\_alpha和color\_sat等参数。

控制高频和低频色噪的去除，权衡色度侵染、饱和度降低等瑕疵。

#### 4.2.5 SHARP

##### 4.2.5.1 功能描述

Sharpen模块用于增强图像的清晰度，算法和rk isp2x的算法接近。

主要是对高频数据进行提取，然后进行预滤波，锐化增强和噪声抑制，最后和未锐化原图插值叠加输出。



图4-2-5-1 SHARP功能框图

##### 4.2.5.2 关键参数


| 参数名称 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常调试参数 |
| SNR_Mode | 模式参数 | dcg模式对应高低信噪比模式 |
| Sensor_Mode | 模式参数 | sensor dcg模式 |
| iso | 调试参数 | 常调试参数 |
| luma_point | 调试参数 | 常调试参数 |
| luma_sigma | 调试参数 | 常调试参数 |
| pbf_gain | 调试参数 | 常调试参数 |
| pbf_add | 调试参数 | 常调试参数 |
| pbf_ratio | 调试参数 | 常调试参数 |
| gaus_ratio | 调试参数 | 常调试参数 |
| sharp_ratio | 调试参数 | 常调试参数 |
| hf_clip | 调试参数 | 常调试参数 |
| bf_gain | 调试参数 | 常调试参数 |
| bf_add | 调试参数 | 常调试参数 |
| bf_ratio | 调试参数 | 常调试参数 |
| local_sharp_strength | 调试参数 | 常调试参数 |
| prefilter_coeff | 调试参数 | 不常调试参数 |
| GaussianFilter_coeff | 调试参数 | 不常调试参数 |
| hfBilateralFilter_coeff | 调试参数 | 不常调试参数 |

### Enable:

【描述】

Sharp模块使能开关。

1：模块打开，0：模块关闭。

### ModeName

【描述】

目前支持normal,hdr,gray 3个模式参数。

SNR\_Mode

【描述】

lcg和hcg对应不同噪声模式。 hsnr对应hcg, lsnr对应lcg模式。

Sensor\_Mode

【描述】

sensor支持的hcg和lcg模式，如果不支持dcg模式，默认采用lcg参数。

ISO

【描述】

不同iso档位，对应不同调试参数。目前仅支持13档。

luma\_point/luma\_sigma:

【描述】

不同pixel亮度，对应不同噪声sigma曲线。

横坐标为曲线亮度值，0\~1023

纵坐标为sigma 曲线，0\~1023

pbf\_gain

【描述】

预滤波 sigma 乘以的比例， 0\~2.0 。值越大，滤波越强，噪声越小，细节更少。

pbf\_add

【描述】

预滤波 sigma 叠加的偏移，0\~1023 。值越大，滤波越强，噪声越小，细节更少。

pbf\_ratio

【描述】

预滤波融合权重，0\~1。值越大，滤波越强，噪声越小，细节更少。

gaus\_ratio

【描述】

高频双边滤波的导向图像为高斯滤波与原图融合的结果。

高斯滤波融合权重，0\~1。值越大，滤波越强，噪声越小，细节更少。

sharp\_ratio

【描述】

锐化强度， 0\~15.9。

hf\_clip

【描述】

高频值 clip 的范围，0\~1023 。值越大，允许的最大锐化强度越强。

bf\_gain

【描述】

高频双边滤波 sigma 乘以的比例， 0\~2.0。

值越大，滤波越强，噪声越小，细节更少。

bf\_add

【描述】

高频双边滤波 sigma 叠加的偏移，0\~1023 。

值越大，滤波越强，噪声越小，细节更少。

bf\_ratio

【描述】

高频双边滤波融合权重， 0\~1.0。

值越大，滤波越强，噪声越小，细节更少。

local\_sharp\_strength

【描述】

计算不同pixel亮度，高频叠加权重的比例， 0\~1023。

值越大，允许叠加的高频越大，图像越锐化。

prefilter\_coeff:

【描述】

预滤波算子。

GaussianFilter\_coeff

【描述】

高斯滤波算子。

hfBilateralFilter\_coeff

【描述】

高频双边滤波算子。

##### 4.2.5.3 调试步骤

sharp\_ratio,local\_sharp\_strength，hf\_clip：控制高频边缘增强的力度。

gaus\_ratio, pbf\_ratio, pbf\_gain, pbf\_add，bf\_ratio, bf\_gain, bf\_add：

用于高频增强，降低锐化带来的噪声，用来平衡噪声和锐化细节的参数。

Sharp模块可以对细节的增强同时对噪声抑制，但最终不可避免还是会带来整体噪声的增加。

### 4.3 MERGE

#### 4.3.1 功能描述

过曝曲线由OECurve\_smooth和OECurve\_offset两个参数确定，在两帧模式下，是否过曝在长帧和短帧之间判断，三帧模式下，是否过曝在长帧和中帧之间判断。

运动曲线包含长帧与中帧运动曲线（LM\_smooth和LM\_offset两参数决定）和中帧与短帧运动曲线（MS\_smooth和MS\_offset两参数决定），在两帧模式下，只有中帧短帧运动曲线生效。

由于RK356x平台只支持两帧模式，因此LM\_smooth和LM\_offset两参数决定的长帧与中帧运动曲线未生效。



Merge框图

#### 4.3.2 关键参数

##### 4.3.2.1 OECurve

【描述】

过曝曲线设置

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
| EnvLv_len | EnvLv数组长度 |
| Smooth | 过曝曲线的斜率，取值范围[0,1]，默认值为0.4 |
| Smooth_len | Smooth数组长度 |
| Offset | 过曝曲线的偏移值，取值范围[108,280]，默认值为210 |
| Offset_len | Offset数组长度 |

### 【注意事项】

EnvLv：当前环境环境亮度，可由工具在线调试模块得到。

##### 4.3.2.2 MDCurve

【描述】

运动曲线设置，由于RK356x平台只支持两帧模式，因此LM\_smooth和LM\_offset两参数决定的长帧与中帧运动曲线未生效。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MoveCoef | 画面运动程度，取值范围[0,1]，其中0代表完全静止，1代表完全运动 |
| MoveCoef_len | MoveCoef数组长度 |
| LM_smooth | 在RK356x平台下，该值无效。 |
| LM_smooth_len | LM_smooth数组长度 |
| LM_offset | 在RK356x平台下，该值无效。 |
| LM_offset_len | LM_offset数组长度 |
| MS_smooth | 长帧和短帧之间运动曲线斜率，取值范围为[0,1]，默认值为0.4。 |
| MS_smooth_len | MS_smooth数组长度 |
| MS_offset | 长帧和短帧之间运动曲线偏移值，取值范围为[0.26,1]，默认值为0.38。 |
| MS_offset_len | MS_offset数组长度 |

【注意事项】

MoveCoef：由于当前场景检测未做，不能得到运动量，实际使用均为MoveCoef等于1

##### 4.3.2.3 ByPassThr

【描述】

表示bypass当前模块阈值，取值范围[0,1]。当前环境亮度与前一帧环境亮度差异的百分比小于ByPassThr时，本模块参数不做更新处理。

【成员】

【注意事项】

在使用工具调试过程中，请将值写为0，否则可能会出现调试无效的情况。

##### 4.3.2.4 OECurve\_damp

【描述】

表示过曝曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1],默认值为0.3。

【成员】

【注意事项】

##### 4.3.2.5 MDCurveLM\_damp

【描述】

在RK356x平台下，该值无效。

【成员】

【注意事项】

##### 4.3.2.6 MDCurveMS\_damp

【描述】

表示中帧短帧间运动曲线变化的平滑系数，为当前帧参数的占比，取值范围为[0,1],默认值为0.3。

【成员】

【注意事项】

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

##### 4.3.3.2 运动曲线调试

【描述】

运动曲线（MS\_smooth和MS\_offset两参数决定）实际曲线如下图所示。



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

2.MS\_offset：

从图像上看，该值代表了过曝处使用短帧的初始值。该值越小，使用短帧的权重最大。绿色曲线代表值为0时，蓝色曲线代表值为0.38时，红色曲线代表值为1时。



MDCurve\_offset示意图

### 4.4 DRC

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

该开关只在线性模式下生效，HDR模式下无效（强制开启）。

##### 4.4.2.2 DrcGain

【描述】

通过DrcGain模块可以对输入的RAW进行亮度调整，即对整体亮度，或者局部亮度进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
| EnvLv_len | EnvLv数组长度 |
| DrcGain | DRC模块增益，取值范围[1,8] |
| DrcGain_len | DrcGain数组长度 |
| Alpha | 取值范围[0,1] |
| Alpha_len | Alpha数组长度 |
| Clip | 取值范围[0,64] |
| Clip_len | Clip数组长度 |

【注意事项】

##### 4.4.2.3 HiLight

【描述】

通过HiLight模块可以对输出RAW的高亮区域进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
| EnvLv_len | EnvLv数组长度 |
| Strength | 高光区域细节，取值范围[0,1] |
| Strength_len | Strength数组长度 |

### 【注意事项】

##### 4.4.2.4 LocalTMOSetting

### 【描述】

通过LocalTMOSetting模块可以对LocalTMO相关参数进行调整。

##### 4.4.2.4.1 LocalTMOData

【描述】

LocalTMOData主要是对LocalTMO权重以及对比度进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
| EnvLv_len | EnvLv数组长度 |
| LocalWeit | Local TMO权重，取值范围[0,1]，0：Global TMO，1：全Local TMO。 |
| LocalWeit_len | LocalWeit数组长度 |
| GlobalContrast | 局部对比度，取值范围[0,1] |
| GlobalContrast_len | GlobalContrast数组长度 |
| LoLitContrast | 低亮区对比度，取值范围[0,1] |
| LoLitContrast_len | LoLitContrast数组长度 |

### 【注意事项】

##### 4.4.2.4.2 curPixWeit

【描述】

表示当前点的双边权重，取值范围[0,1]

【成员】

【注意事项】

##### 4.4.2.4.3 preFrameWeit

【描述】

表示当前帧双边权重，取值范围[0,1]

【成员】

【注意事项】

##### 4.4.2.4.4 Range\_force\_sgm

【描述】

表示双边值域 sigma 的倒数，取值范围[0,1]

【成员】

【注意事项】

当Range\_force\_sgm为非零值时，Range\_sgm\_cur和Range\_sgm\_pre不生效。

##### 4.4.2.4.5 Range\_sgm\_cur

【描述】

表示当前帧双边空域sigma的倒数，取值范围[0,1]

【成员】

【注意事项】

##### 4.4.2.4.6 Range\_sgm\_pre

【描述】

表示前一帧双边空域sigma的倒数，取值范围[0,1]

【成员】

【注意事项】

##### 4.4.2.4.7 Space\_sgm\_cur

【描述】

表示当前帧双边值域sigma的倒数，取值范围[0,4095]

【成员】

【注意事项】

##### 4.4.2.4.8 Space\_sgm\_pre

【描述】

表示前一帧双边值域sigma的倒数，取值范围[0,4095]

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

表示边缘响应scale值，取值范围[0,1]，用于降低高对比度边缘Artifact。

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

表示IIR滤波器帧数，取值范围[1,1000]，默认值为4.

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

Clip：



##### 4.4.3.2 HiLight调试

【描述】

通过HiLight模块可以对输出RAW的高亮区域细节进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Strength | 高光区域细节，取值范围[0,1] |

### 【注意事项】

Stength值越大，高光处细节处压得会越好，但是高光边界更可能会出现halos。如下图所示，左图为Strength为0时，右图Strength为1时：



##### 4.4.3.3 LocalTMOSetting调试

【描述】

通过LocalTMOSetting模块可以对LocalTMO相关参数进行调整。该模块中所有参数，在LocalWeit为0时，不生效。

##### 4.4.3.3.1 LocalTMOData调试

【描述】

LocalTMOData主要是对LocalTMO权重、全局对比度已经暗区对比度进行调整。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### 【注意事项】

当LocalWeit取值为0时，DRC为Global TMO；当取值为1时，为local TMO；当取值为0到1之间时，为Global TMO和Local TMO的混合。实际对比图如下（左边LocalWeit=0，右边LocalWeit=0.3）：

GlobalContrast：值越大，整体对比度（不包括暗区）越强。如下图所示，左图为GlobalContrast为0时，右图为GlobalContrast为1时。



LoLitContrast：值越大，暗区对比度越强。如下图所示，左图为LoLitContrast为0时，右图为LoLitContrast为1时。



##### 4.4.3.4 Edge\_Weit调试

【描述】

通过改变该值来降低高对比度边缘Artifact。

【成员】

【注意事项】



### 4.5 Dehaze & Enhance

#### 4.5.1 功能描述

在雾、霾之类的恶劣天气下，采集的图像质量会由于大气散射而严重降低, 使图像颜色偏灰白色, 对比度降低, 物体特征难以辨认。所以需要图像去雾技术来增强或修复, 以改善视觉效果。



#### 4.5.2 关键参数

##### 4.7.2.1 Enable

【描述】

Dehaze&Enhance开关功能

0：关闭

1：打开

【成员】

【注意事项】

##### 4.5.2.2 cfg\_alpha

【描述】

软件配置占比，取值范围[0,1]，默认值1。

0：全使用自适应参数

1：全使用软件配置参数，可控制自适应参数和软件配置参数按照比例混合

【成员】

【注意事项】

当值为0时，Dehaze中的cfg\_wt、cfg\_air、cfg\_tmax以及Hist中的cfg\_gratio不生效；反之，当值为1时，Dehaze参数完全由cfg\_wt、cfg\_air和cfg\_tmax决定，Hist参数完全由cfg\_gratio决定。

##### 4.5.2.3 ByPassThr

【描述】

表示bypass当前模块阈值，取值范围[0,1]。当前环境亮度与前一帧环境亮度差异的百分比小于ByPassThr时，本模块参数不做更新处理。

【成员】

【注意事项】

在使用工具调试过程中，请将值写为0，否则可能会出现调试无效的情况。

##### 4.5.2.4 Dehaze\_Setting

【描述】

通过该模块对去雾参数进行调整。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| en | 开关功能 |
| air_lc_en | 是否使用 airlight base 对 airlight 进行最小值截止开关 |
| stab_fnum | 帧稳定的最大值 |
| sigma | iir控制的sigma |
| wt_sigma | 帧间wt滤波系数 |
| air_sigma | 帧间air滤波系数 |
| tmax_sigma | 帧间tmax滤波系数 |
| pre_wet | 参考数据IIR 滤波系数 |
| DehazeData | dehaze调试参数 |
| EnvLv | 环境亮度 |
| EnvLv_len | EnvLv数组长度 |
| dc_min_th | wt自适应的统计范围，取值范围[16，120]，默认值64 |
| dc_min_th_len | dc_min_th数组长度 |
| dc_max_th | wt自适应高曝区统计范围，取值范围[170，255]，默认值192 |
| dc_max_th_len | dc_max_th数组长度 |
| yhist_th | y分量高曝区统计范围，取值范围[170，255]，默认值249 |
| yhist_th_len | yhist_th数组长度 |
| yblk_th | y分量块数目比例阈值，取值范围[0.002，0.01]，默认值0.002 |
| yblk_th_len | yblk_th数组长度 |
| dark_th | wt自适应y分量块最小值阈值，取值范围[230，250]，默认值250 |
| dark_th_len | dark_th数组长度 |
| bright_min | air自适应阈值的最小值，取值范围[160，200]，默认值180 |
| bright_min_len | bright_min数组长度 |
| bright_max | air自适应阈值的最大值，取值范围[210，250]，默认值240 |
| bright_max_len | bright_max数组长度 |
| wt_max | wt自适应的最大值限制，取值范围[0.75，0.9]，默认值0.9 |
| wt_max_len | wt_max数组长度 |
| air_min | air自适应的最小值限制，取值范围[200，220]，默认值200 |
| air_min_len | air_min数组长度 |
| air_max | air自适应的最大值限制，取值范围[230，250]，默认值250 |
| air_max_len | air_max数组长度 |
| tmax_base | tmax自适应基础值，默认125，对应配置如下，200(131)，210(125)，220(119)，230(114)，240(109)，250(105)，推荐131-105 |
| tmax_base_len | tmax_base数组长度 |
| tmax_off | tmax自适应的固定值，取值范围[0.1，0.5]，默认值0.1 |
| tmax_off_len | tmax_off数组长度 |
| tmax_max | tmax自适应的最大值，取值范围[0.1，0.5]，默认值0.5 |
| tmax_max_len | tmax_max数组长度 |
| cfg_wt | 软件配置wt，图像去雾力度，取值范围[0，1] |
| cfg_wt_len | cfg_wt数组长度 |
| cfg_air | 软件配置air，大气光系数，取值范围[0，255] |
| cfg_air_len | cfg_air数组长度 |
| cfg_tmax | 软件配置tmax，去雾的最大值，取值范围[0，1] |
| cfg_tmax_len | cfg_tmax数组长度 |
| bf_weight | 两个双边滤波的合成权重 |
| bf_weight_len | bf_weight数组长度 |
| dc_weitcur | dark channel部分的双边权重，默认值1 |
| dc_weitcur_len | dc_weitcur数组长度 |
| range_sigma | 双边滤波值域 sigma 值。 |
| range_sigma_len | range_sigma数组长度 |
| space_sigma_pre | 以IIR 数据为参考时，双边滤波空域 sigma 值 |
| space_sigma_pre_len | space_sigma_pre数组长度 |
| space_sigma_cur | 以当前数据为参考时，双边滤波空域sigma 值 |
| space_sigma_cur_len | space_sigma_cur数组长度 |

### 【注意事项】

stab\_fnum：dehaze的参数是从0开始逐渐到达一个稳定值，sw\_dhaze\_stab\_fnum就是软件指定的达到稳定的帧数，一般10帧是比较合适的，该参数最大值可配到31，最多1s的时间就要进入稳定状态；

##### 4.5.2.5 Enhance\_Setting

【描述】

通过该模块对图像对比度进行调整。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
| 成员名称 | 描述 |
| EnvLv | 环境亮度 |
| EnvLv_len | 环境亮度数组长度 |
| enhance_value | 通用对比度力度，取值范围[0，16]，推荐范围[1，2] |
| enhance_value_len | enhance_value数组长度 |
| enhance_chroma | 色度的增强调节参数，取值范围[0，16]，推荐范围[1，2] |
| enhance_chroma_len | enhance_chroma数组长度 |

【注意事项】

enhance\_value：越大对比度越强

enhance\_chroma：越大饱和度越高

##### 4.5.2.6 Hist\_Setting

【描述】

通过该模块对图像对比度进行调整，通常用于去雾后对比度不够的情况。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
| 成员名称 | 描述 |
| EnvLv | 环境亮度 |
| EnvLv_len | EnvLv数组长度 |
| hist_gratio | 直方图拉伸倍数，直方图均衡控制系数，取值范围[0,32] |
| hist_gratio_len | hist_gratio数组长度 |
| hist_th_off | 直方图统计阈值，取值范围[0，255]，默认值64 |
| hist_th_off_len | hist_th_off数组长度 |
| hist_k | 直方图自适应阈值放大倍数，取值范围[0,7)，默认值2 |
| hist_k_len | hist_k数组长度 |
| hist_min | 直方图统计阈值的最小值，取值范围[0,2)，默认值0.016 |
| hist_min_len | hist_min数组长度 |
| hist_scale | 直方图均衡控制系数，取值范围[0,32] |
| hist_scale_len | hist_scale数组长度 |
| cfg_gratio | 软件配置直方图拉伸倍数，直方图均衡控制系数，取值范围[0,32) |
| cfg_gratio_len | cfg_gratio数组长度 |

### 【注意事项】

hist\_para\_en：当取值为1时，hist\_scale生效，hist\_gratio不生效；反之，当取值为0时，hist\_scale不生效，hist\_gratio生效。

hist\_gratio：值越大，直方图拉伸力度越大，图像整体亮度也越高。

hist\_th\_off：该值越大，直方图的统计值越大，图像整体亮度也越高。

hist\_k：该值越大，直方图的统计值越大，图像整体亮度也越高。

hist\_min：该值越大，直方图的统计值越大，图像整体亮度也越高。

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

如下图可见，cfg\_tmax是0.1的时候景深方向的雾去除的比较干净，一些细节已经可以看见了，cfg\_tmax为0.5的时候就弱很多，景深方向的雾不是去除的越多越好，去除太多会破坏图像的层次感，通常0.2是一个比较合适的值。（如下图，从左到右依次为Dehaze\_en= 0 ，Dehaze\_en= 1且cfg $_ \mathrm &#123; t m a x &#125; = 0 . 1$ ，Dehaze\_en= 1且cfg\_tmax= 0.5）



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

2.enhance\_chroma：越大饱和度越高

3.enh\_curve：可以通过调低暗区参数，用来提升暗区亮度和对比度。

##### 4.5.3.3 Hist调试

【描述】

直方图均衡化Hist建议通过以下两个参数进行调整。以下两个参数根据ISO变化。在调过程中需要将cfg\_alpha置为1。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| cfg_gratio | 软件配置直方图拉伸倍数，直方图均衡控制系数 |

### 【注意事项】

（如下图，从左到右依次为 Hist\_en = 0，Hist\_en = 1且cfg\_gratio= 0.768，Hist\_en = 1且cfg\_gratio=2）



cfg\_gratio对比图

### 4.6 DPCC

#### 4.6.1 功能描述

通过本模块对坏点进行检查与去除。

模块包括Fast\_mode、Expert\_mode以及sensor\_dpcc三个部分，其中Fast\_mode与Expert\_mode互斥，两者只能开启一个。



DPCC框图

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
| Triple_level | 多坏点去除力度，取值范围[0，10] |

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
| ISO | 环境ISO |
| Stage1_enable | 默认值1 |
| grayscale_mode | 黑白模式开关，0：关闭，1：打开 |
| rk_out_sel | RK坏点算法中ro_lim的使用，0：ro_lim1，1：ro_lim2，2：ro_lim3 |
| dpcc_out_sel | 坏点矫正模式，0：中值模式，1：RK模式 |
| stage1_rb_3x3 | 默认值0 |
| stage1_g_3x3 | 默认值0 |
| stage1_inc_rb_center | 红/蓝通道用中值模式对坏点去除时，是否包括待去除点，0：否，1：是，默认值为1 |
| stage1_inc_g_center | 绿通道用中值模式对坏点去除时，是否包括待去除点，0：否，1：是，默认值为1 |
| stage1_use_fix_set | 内置坏点判定条件开关，0：关闭，1：打开 |
| stage1_use_set3 | set_cell中第三种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set2 | set_cell中第二种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set1 | set_cell中第一种坏点判断条件开关，0：关闭，1：打开 |
| set_cell | 坏点判断条件 |

### 【注意事项】

grayscale\_mode：当sensor为彩色时，设置为0；反之，当sensor为黑白时，设置为1。

##### 4.6.2.4 set\_cell

【描述】

通过该部分可以调整判定坏点条件阈值，主要包括RK、LC、PG、RND、RG以及RO六种判定条件，六种条件为且的关系。



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

4.6.2.4.1 RK

【描述】

通过该部分可以调整坏点检测算法中RK算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RK_red_blue_enable | RK坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| RK_green_enable | RK坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_sw_mindis | RK坏点判定算法红/蓝通道阈值1，取值范围[0,255] |
| g_sw_mindis | RK坏点判定算法绿通道阈值1，取值范围[0,255] |
| sw_dis_scale_min | RK坏点判定算法阈值2，取值范围[0,63] |
| sw_dis_scale_max | RK坏点判定算法阈值3，取值范围[0,63] |

【注意事项】

4.62.4.2 LC

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

【注意事项】

4.6.2.4.3 PG

【描述】

通过该部分可以调整坏点检测算法中PG算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| PG_red_blue_enable | PG坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| PG_green_enable | PG坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_pg_fac | PG坏点判定算法红/蓝通道系数，取值范围[0,63]，默认值4 |
| g_pg_fac | PG坏点判定算法绿通道系数，取值范围[0,63]，默认值3 |

【注意事项】

4.6.2.4.4 RND

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

### 【注意事项】

##### 4.6.2.4.5 RG

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

##### 4.6.2.4.6 RO

【描述】

通过该部分可以调整坏点检测算法中RO算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RO_red_blue_enable | RO坏点判定算法红/蓝通道开关，0：关闭，1：开启 |
| RO_green_enable | RO坏点判定算法绿通道开关，0：关闭，1：开启 |
| rb_ro_lim | RO坏点判定算法红/蓝通道阈值，取值范围[0,3]，默认值1 |
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

### 【注意事项】

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

Expert\_mode中主要通过stage1\_use\_fix\_set、stage1\_use\_set1、stage1\_use\_set2、

stage1\_use\_set3和set\_cell坏点进行去除，

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

4.6.3.2.2 LC

【描述】

通过该部分可以调整坏点检测算法中LC算法相关参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

【注意事项】

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

【注意事项】

pg\_fac：值越小，越容易判断为坏点。

4.6.3.2.4 RND

【描述】

通过该部分可以调整坏点检测算法中RND算法相关参数。

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

【注意事项】

rnd\_thr：值越小，越容易判断为坏点。

rnd\_offs：值越小，越容易判断为坏点。

4.6.3.2.5 RG

【描述】

通过该部分可以调整坏点检测算法中RG算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | RG坏点判定算法开关，0：关闭，1：开启 |
| rg_fac | RG坏点判定算法通道系数，取值范围[0,63]，默认值8 |

【注意事项】

rg\_fac：值越小，越容易判断为坏点。

4.6.3.2.6 RO

【描述】

通过该部分可以调整坏点检测算法中RO算法相关参数。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | RO坏点判定算法通道开关，0：关闭，1：开启 |
| ro_lim | RO坏点判定算法通道阈值，取值范围[0,3]，默认值1 |

【注意事项】

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

【注意事项】

max\_level：定义sensor端坏点去除的力度的最大值，主要为了细分单个等级去坏点力度。

level\_single和level\_multiple的力度不能超过max\_level。

### 4.7 Gamma

#### 4.7.1 功能描述

通过该模块对gamma曲线进行调整，包含三条gamma曲线，curve\_normal、curve\_hdr以及curve\_night。



GAMMA框图

#### 4.7.2 关键参数

##### 4.7.2.1 gamma\_en

【描述】

Gamma开关功能

0：关闭

1：打开

【成员】

【注意事项】

##### 4.7.2.2 gamma\_out\_segnum

【描述】

Gamma曲线X轴间距类型

0：非等间距

1：等间距

【成员】

【注意事项】

##### 4.7.2.3 gamma\_out\_offset

【描述】

Gamma曲线修正功能，取值范围[-2048,2048]，默认值0。

【成员】

【注意事项】

##### 4.7.2.4 curve\_normal

【描述】

线性模式下gamma曲线，取值范围[0,4095]。

【成员】

【注意事项】

##### 4.7.2.5 curve\_hdr

【描述】

HDR模式下gamma曲线，取值范围[0,4095]。

【成员】

【注意事项】

##### 4.7.2.6 curve\_night

【描述】

夜晚模式下gamma曲线，取值范围[0,4095]。

【成员】

【注意事项】

#### 4.7.3 调试步骤

### 4.8 Debayer

#### 4.8.1 功能描述

由于大部分彩色相机均采用单传感器获取图像信息，且每个传感器表面覆盖有一个CFA (Color FilterArray,色彩滤波阵列)，使得每一个像素只能获得R、G、B三基色中的一种彩色分量。由于彩色滤波阵列每个像素上只有一种颜色的分量是已知的， 为了得到一幅彩色图像，需要利用已知的颜色信息插值出另外两种丢失的颜色分量，该过程被称为去马赛克(Debayer或Demosaic)：



图4-10-1 Debayer功能示意图

#### 4.8.2 关键参数

Enable:

【描述】

Debayer模块使能位，0：关闭，1：打开。

debayer\_filter1

【描述】

低频梯度滤波器，取值范围[-8，7]。

debayer\_filter2

【描述】

高频梯度滤波器，取值范围[-8，7]。

debayer\_gain\_offset

【描述】

计算G通道插值系数中锐化权重时梯度的偏移值，取值范围[0，15]。

ISO

【描述】

当前档对应的ISO值，取值范围[50，2048]。

sharp\_strength

【描述】

G通道插值锐化权重最大值，取值范围[0，4]。

debayer\_hf\_offset

【描述】

计算梯度时的偏移值，取值范围[0，4095]。

debayer\_offset

【描述】

G通道clip的offset，取值范围[0，15]。值越大， clip范围越大。

debayer\_clip\_en

【描述】

G通道插值 clip 开关，0：关闭，1：打开。

debayer\_filter\_g\_en

【描述】

G通道插值结果滤波开关，0：关闭，1：打开。

debayer\_filter\_c\_en

【描述】

色差图滤波开关，0：关闭，1：打开。

debayer\_thed0

【描述】

控制高低频权重选取，值越大选取高频权重概率越小，取值范围[0，16]。

debayer\_thed1

【描述】

控制高低频权重选取，值越大选取低频权重概率越小，取值范围[0，16]。

debayer\_dist\_scale

【描述】

控制高低频权重选取，值越大选取高频权重概率越小，取值范围[0，16]。

debayer\_cnr\_strength

【描述】

色差图滤波时clip的强度，取值范围[0，9]。

debayer\_shift\_num

【描述】

值越小，色差 clip 的范围越大，取值范围[0，4]。

#### 4.8.3 名词解释


| 简称 | 描述 |
| --- | --- |
| CFA | Color Filter Array,色彩滤波阵列 |
| 去马赛克 | Debayer或Demosaic，将单像素单色的Bayer RGB转换为三原色RGB的过程 |
| 滤波器 | 一组滤波参数，去除数字图像上的干扰信号 |
| 色差图 | 插值得到的G通道图像和原始raw图像作差后的图像 |

### 4.9 CPSL

#### 4.11.1 功能描述

#### 4.9.2 关键参数

enable

【描述】

模块使能开关。如果为0则模块不工作，即手动自动模式都不工作，CPSL相关API调用也不生效。如果驱动中未配置补光灯，需要将之设置成0；相反的，需要设置为1，否则CPSL相关API会不生效。

### mode

【描述】

工作模式。0 为 自动模式， 1 为手动模式。自动模式时补光灯由AIQ算法控制，手动模式时用户可通过API控制补光灯。

### force\_gray

【描述】

### light\_src

【描述】

补光灯类型信息，可通过该字段表明需要控制的补光灯类型。

0：只控制彩色补光灯

1：只控制红外补光灯

2：控制彩色及红外补光灯

### auto\_adjust\_sens

【描述】

自动模式参数，用于 灵敏度调节。调节范围为 0.0 ～ 100.0，默认为 50.0。调节的目标参数是auto\_on2off\_th 及 auto\_off2on\_th，目标参数最大可在 正负1.5倍间变化。

### auto\_on2off\_t

【描述】

自动模式参数，用于控制补光灯开启后自动关闭的阈值，计算公式为：图像亮度/（sensor曝光量/最大曝光量）。

### auto\_off2on\_th

【描述】

自动模式参数，用于控制补光灯是否开启的阈值，计算公式为：图像亮度/（sensor曝光量/最大曝光量）。

### auto\_sw\_interval

【描述】

自动模式参数，用于控制补光灯开启关闭的时间间隔，单位为 秒。补光灯开启后，不管外部环境亮度如何，只有过了间隔时间后，才会启动是否切换的检测。

### manual\_on

【描述】

手动模式参数，用于控制补光灯是否固定开启。

manual\_strength

【描述】

手动模式参数，用于控制补光灯的强度，取值范围为 0\~100。

### 4.10 GIC

#### 4.10.1 功能描述

通过该模块对GIC相关参数进行调整。GIC主要参数在GIC\_ISO中，分为GIC相关参数和噪声相关参数两个部分，其中噪声相关参数由标定获得，GIC相关参数可以对GIC力度进行调整。

#### 4.10.2 关键参数

##### 4.10.2.1 enable

【描述】

GIC开关功能

0：关闭

1：打开

【成员】

【注意事项】

##### 4.10.2.3 gr\_ration

【描述】

确定gr和gb补偿值参数，取值范围[0，3]，默认值0。

【成员】

【注意事项】

##### 4.10.2.5 SettingV21

【描述】

根据ISO对相关参数进行插值运算。

【成员】


| 成员名称 | 描述 |
| --- | --- |
| iso | 环境iso |
| min_busy_thre | busy区域检测能力，取值范围[0，1023]，默认值160 |
| min_grad_thr1 | 非边缘区域的数量阈值1，GIC强度控制值，取值范围[0，1023]，默认值32 |
| min_grad_thr2 | 非边缘区域的数量阈值2，GIC强度控制值，取值范围[0，1023]，默认值32 |
| k_grad1 | 边缘（水平、垂直梯度）的响应程度阈值1，取值范围[0，15]，默认值5 |
| k_grad2 | 边缘（水平、垂直梯度）的响应程度阈值2，取值范围[0，15]，默认值1 |
| gb_thre | 缩放的比例系数，取值范围[0，15]，默认值7 |
| maxCorV | 限制边缘区域gb的最大补偿值，取值范围[0，1023]，默认值40 |
| maxCorVboth | 限制平坦(非边缘)区域gb最大补偿值，取值范围[0，1023]，默认值8 |
| dark_thre | 定义暗部区域的阈值1，取值范围[0，2047]，默认值120 |
| dark_threHi | 定义暗部区域的阈值2，取值范围[0，2047]，默认值240 |
| k_grad1_dark | 图像暗部的边缘（水平、垂直梯度）响应程度阈值1，取值范围[0，15]，默认值6 |
| k_grad2_dark | 图像暗部的边缘（水平、垂直梯度）响应程度阈值2，取值范围[0，15]，默认值1 |
| min_grad_thr_dark1 | 图像暗部的非边缘区域的数量阈值1，取值范围[0，1023]，默认值64 |
| min_grad_thr_dark2 | 图像暗部的非边缘区域的数量阈值2，取值范围[0，1023]，默认值32 |
| noiseCurve_0 | 噪声曲线参数1 |
| noiseCurve_1 | 噪声曲线参数2 |
| globalStrength | 全局控制调整gb补偿值的强度，取值范围[0，2]，默认值1 |
| NoiseScale | 根据噪声曲线获取当前点噪 声标准差，利用 noise_std *noise_scale来确定最大gb补偿值 |
| NoiseBase | 惩罚图像边缘调整阈值，根据第一梯度和第二梯度计算结果加上noise_offset，然后进行比较只要一个方向gradx&gt;2*grady 就认为是边缘，不做调整 |
| diff_clip | 限制最大gb的最大补偿值 |

【注意事项】

#### 4.10.3 调试步骤

在GIC的调试过程中，主要是对GIC\_ISO中GIC相关参数进行调整。

##### 4.10.3.1 GIC\_ISO调试


| 成员名称 | 描述 |
| --- | --- |
| min_busy_thre | busy区域检测能力，取值范围[16，120]，默认值64 |
| min_grad_thr1 | 非边缘区域的数量阈值1，GIC强度控制值 |
| min_grad_thr2 | 非边缘区域的数量阈值2，GIC强度控制值 |
| k_grad1 | 边缘(水平、垂直梯度)的响应程度阈值1 |
| k_grad2 | 边缘(水平、垂直梯度)的响应程度阈值2 |
| gb_thre | 缩放的比例系数 |
| maxCorV | 限制边缘区域gb的最大补偿值 |
| maxCorVboth | 限制平坦(非边缘)区域gb最大补偿值 |
| dark_thre | 定义暗部区域的阈值1 |
| dark_threHi | 定义暗部区域的阈值2 |
| k_grad1_dark | 图像暗部的边缘(水平、垂直梯度)响应程度阈值1 |
| k_grad2_dark | 图像暗部的边缘(水平、垂直梯度)响应程度阈值2 |
| min_grad_thr_dark1 | 图像暗部的非边缘区域的数量阈值1 |
| min_grad_thr_dark2 | 图像暗部的非边缘区域的数量阈值2 |

min\_busy\_thre：这个值主要修正暗区的busy区域（例如文字等不规则且存在较高对比度区域）检测能力，即给较暗区域一个阈值的嵌位。值越大，则暗区的busy区域越多，反之越少。对于busy区域，GIC不做任何处理。所以检测到的busy区域越多，可以保留一些边缘细节，但同时对于误检测区域则会造成GIC残留。

min\_grad\_thr1、min\_grad\_thr2：它们的大小直接影响非边缘区域的数量。 非边缘区域的数量越多，则GIC效果越强，图片被抹得越狠，细节保留越少。 非边缘区域的数量越少，则可能会有GIC残留，表现为一些典型的GIC纹理（横竖亮暗条纹，伪边缘）被保留。 这个值越大，在进行方向判断时就越有可能被判断为平坦（非边缘）区域。是控制GIC强度的一个参数。

min\_grad\_thr\_dark1、min\_grad\_thr\_dark2：作用及调试方法同min\_grad\_thr1、min\_grad\_thr2，一般值比min\_grad\_thr大。

k\_grad1、k\_grad2：调节对边缘（水平、垂直梯度）的响应程度的大小，这个值越大，对应判断是否为边缘的阈值就越大，结果就是将弱边缘判断成平坦区域；若减小这个参数，可以增大边缘的数量。

k\_grad1\_dark、k\_grad2\_dark：作用及调试方法同k\_grad1、k\_grad2，一般比k\_grad大，即降低图像暗部的边缘响应程度。

gb\_thre：它是个用来缩放的比例系数，而不是一个用来直接判断的绝对阈值。 它越大，则允许补偿的gb越小，反之越大。跟Sensor、 镜头的关系比较大。

maxCorV：假定gb的补偿值有一个上限，若计算得到的值超过假定的阈值，则认为计算错误，为了减少计算错误的影响，将gb的补偿值嵌位下来。

maxCorVboth：目的同maxCorV。

dark\_thre：用于确定图像暗部区域与普通区域的下边界。

dark\_threHi：用于确定图像暗部区域与普通区域的上边界。

### 4.11 AF

#### 4.11.1 功能描述

通过该模块移动镜头使物体在成像面上对焦。

#### 4.11.2 关键参数

##### 4.11.2.1 af\_mode

【描述】

默认对焦模式

```c
CalibDbV2_AF_MODE_NOT_SET = -1,
CalibDbV2_AF_MODE_AUTO,
CalibDbV2_AF_MODE_MACRO,
CalibDbV2_AF_MODE_INFINITY,
CalibDbV2_AF_MODE_FIXED,
CalibDbV2_AF_MODE_EDOF,
CalibDbV2_AF_MODE_CONTINUOUS_VIDEO,
CalibDbV2_AF_MODE_CONTINUOUS_PICTURE,
CalibDbV2_AF_MODE_ONESHOT_AFTER_ZOOM,
```

【成员】

【注意事项】

##### 4.11.2.2 win\_h\_offs/win\_v\_offs/win\_h\_size/win\_v\_size

【描述】

默认对焦窗口。

【成员】

h\_offs为对焦区域起始横坐标；

v\_offs为对焦区域起始纵坐标；

h\_size为对焦区域宽度；

v\_size为对焦区域高度；

### 【注意事项】

取值范围为0\~2000，代码内部会根据sensor输入进行转换。

如果这四个值全部设置为0，代码内部会自动设置。

##### 4.11.2.3 fixed\_mode/macro\_mode/infinity\_mode

【描述】

fixed\_mode为固定对焦模式；

macro mode为近焦对焦模式；

infinity mode为远焦对焦模式;

【成员】

fixed\_mode下的code值为lens停留位置，取值范围为0\~64；

macro mode下的code值为对焦终止位置，起始code值为0；

infinity mode下的code值为对焦起始位置，终止code值为64;

【注意事项】

##### 4.11.2.4 contrast\_af

【描述】

contrast af算法参数设置

【成员】

enable为contrast af算法开关；

AfSearchStrategy为contrast af算法策略，有FULL\_RANGE、 ADAPTIVE\_RANGE等，一般使用ADAPTIVE\_RANGE；

FullDir为FULL\_RANGE策略下搜寻方向，取值范围POSITIVE、NEGATIVE、ADAPTIVE，一般使用ADAPTIVE；

FullRangeTbl为FULL\_RANGE策略下搜寻表，按照这个表进行粗搜；

FullSteps为FullRangeTbl表的项目个数；

AdaptiveDir为ADAPTIVE\_RANGE策略下搜寻方向，取值范围POSITIVE、NEGATIVE、ADAPTIVE，一般使用ADAPTIVE；

AdaptRangeTbl为ADAPTIVE\_RANGE策略下搜寻表，按照这个表进行粗搜；

AdaptiveSteps为AdaptRangeTbl表的项目个数；

TrigThers为触发再次对焦的阈值，当前Fv值与上次对焦成功时的Fv值相比，变化率超过TrigThers时，触发对焦；

LumaTrigThers为触发再次对焦的阈值，当前亮度值与上次对焦成功时的亮度值相比，变化率超过LumaTrigThers时，触发对焦；

StableThers为满足触发对焦条件后，当前Fv值与上次Fv值相比，变化率小于该值时，认为本次场景稳定；

StableFrames为满足触发对焦条件后，变化率小于StableThers的帧数大于该值时，认为场景已经稳定；

StableTime当前未使用；

SceneDiffEnable为利用主窗口15\*15 fv值判断场景改变的开关，判断场景未改变时，将不进行对焦触发；

SceneDiffThers为利用主窗口15\*15 fv值判断场景改变时，判断单个block改变时的阈值；

SceneDiffBlkThers为利用主窗口15\*15 fv值判断场景改变时，场景改变时的block数阈值，和SceneDiffThers一起使用；

CenterSceneDiffThers为利用主窗口15\*15 fv值判断场景改变时，判断最中间block改变时的阈值；

上述两个条件满足一个，即认为场景改变。

ValidMaxMinRatio为利用中间独立窗口无法聚焦时，使用主窗口15\*15 fv值搜索可靠block时使用的最大fv最小fv的变化率阈值；

ValidValueThers为利用中间独立窗口无法聚焦时，使用主窗口15\*15 fv值搜索可靠block时使用的最大fv阈值；

OutFocusValue为Fv值小于该值时，认为对焦结果不可靠；

OutFocusPos为Fv值小于OutFocusValue，对焦结果不可靠时，将lens置于该位置；

WeightEnable为利用主窗口15\*15 fv值进行加权算出的fv值进行对焦的开关；

Weight为当WeightEnable为1时，对主窗口15\*15 fv值进行加权的权重系数；

SearchPauseLumaEnable为在af搜索过程中对亮度变化进行检查的开关；

SearchPauseLumaThers为af搜索过程中对亮度变化率进行检查的阈值，当亮度变化超过该阈值时，搜索暂停；

SearchLumaStableThers为af搜索过程中因亮度变化太大暂停后判断亮度变化为否稳定的阈值，变化率小于该值时，认为本次亮度变化稳定；

SearchLumaStableFrames为af搜索过程中因亮度变化太大暂停后判断亮度变化为否稳定的阈值，变化率小于SearchLumaStableThers的帧数大于该值时，认为亮度变化已经稳定；

FlatValue为af搜索过程中最大fv值小于该值时判断当前对焦区域为平坦区；

【注意事项】

##### 4.11.2.5 laser\_af

【描述】

laser af算法参数设置

【成员】

enable为laser af算法开关；

vcmDot和distanceDot为vcm code值和distance映射表;

【注意事项】

##### 4.11.2.6 pdaf

【描述】

pdaf算法参数设置

【成员】

enable为pdaf算法开关;

【注意事项】

##### 4.11.2.7 vcmcfg

【描述】

vcm配置一般在kernel dts中设置，但内核编译比较麻烦，为了方便调试，xml中也增加对其进行设置的接口。

【成员】

startCurrent为vcm启动电流，单位为mA；

ratedCurrent为vcm截至电流，单位为mA；

stepMode为vcm工作模式，一般有LSC / SAC等模式；

extraDelay为在lens移动结束时间过后，追加一定的延时，以方便调试，该值可正、可负、可为零；

【注意事项】

##### 4.11.2.8 measiso\_cfg

【描述】

不同ISO下对焦统计设置

【成员】

iso index为iso值，一般取值为

50/100/200/400/800/1600/3200/6400/12800/25600/51200/102400/204800；

afmThres为阈值信息threshold；

gammaY为gamma信息设置，所有值都为零时，关闭该功能；

gaussWeight为filter系数设置，所有值都为零时，关闭该功能；

【注意事项】

##### 4.11.2.9 zoomfocus\_tbl

【描述】

变焦曲线表设置

【成员】

tbl\_len为变焦曲线表大小；

focal\_length为焦距变化表；

focal\_length\_len为焦距变化表长度；

zoom\_pos为焦距变化对应变焦马达位置表；

zoom\_pos\_len为变焦马达位置表长度；

focus\_infpos为对应焦距变化的无穷远物距的对焦马达位置表；

focus\_infpos\_len为无穷远物距的对焦马达位置表长度；

focus\_macropos为对应焦距变化的最近物距的对焦马达位置表；

focus\_macropos\_len最近物距的对焦马达位置表长度；

【注意事项】

tbl\_len / focal\_length\_len / zoom\_pos\_len / focus\_infpos\_len / focus\_macropos\_len数值应该是相等 的
