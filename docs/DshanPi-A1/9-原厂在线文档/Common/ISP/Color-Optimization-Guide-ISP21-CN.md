---
sidebar_position: 1
---

# Rockchip\_Color\_Optimization\_Guide\_ISP 21\_CN

## 前言

## 概述

本文旨在描述色彩相关模块的调试，主要给使用RkAiq模块进行图像色彩调优的工程师提供帮助。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3566/RK3568 |  |

读者对象

本文档（本指南）主要适用于以下工程师：

ISP调试工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 | 对应工具版本 |
| --- | --- | --- | --- | --- |
| V1.0.0 | 翁涵梅池晓芳 | 2020-07-30 | 初始版本 | RKISP2.x_Tuner_v0.1.0及以上 |
| V1.1.0 | 池晓芳 | 2020-09-29 | 修改为markdown文件awb模块增加手动白平衡/自动白平衡参数说明 | 同上 |
| V1.2.0 | 池晓芳 | 2020-10-19 | 微调结构awb 模块增加hdrFrameChoose参数说明 | 同上 |
| V1.2.1 | 池晓芳 | 2021-01-04 | 修正awb多处错误描述 | 同上 |
| V1.2.2 | 池晓芳 | 2021-04-08 | 修改2.2章节，对参数增加详细描述，及增加之前未描述的参数 | 同上 |
| V1.2.3 | 池晓芳 | 2021-04-08 | 增加ISP21参数的说明，主要修改2.2、2.4章节。请先阅读前面的产品版本说明 | 同上 |
| V1.2.4 | 池晓芳 | 2021-05-17 | xml参数没有修改，代码升级，ISP20awb模块最多支持标定14个光源，ISP21wb模块最多支持标定7个光源 | RKISP2.x_Tuner_v1.6.1及以上 |
| 池晓芳V1.2.4 | 2021-05-17 | JSON由v1.4.7到v1.4.8，兼容v1.4.7的版本修改内容:(1)luma limit 改为随环境亮度变化，见“luma limit’章节(2)分区策略参数的白点数量阈值WP_THH,WP_THL随环境亮度变化，见“分区间参数”章节(3)增加xyRegionStableSelection参数说明，增加xyRegionStableSelection里面的wpNumTh节点（选择中框，大框和附加光源框的白点数量阈值），见“中框、大框、附加白点框选择参数(ISP20)"章节(4)增加暗光下白平衡问题解决示例，见章节“例3” | aiq和工具支持版本待定 |  |
| v2.0.0 | 翁涵梅池晓芳 | 2021-06-18 | iq文件由xml改为json，关键参数的参数名及位置有变化。如果有些参数在在线调试工具上没有找到，是被隐藏了，即这部分参数不需要在线调试 | AIQ v2.0x60.0; IQ Toolv2.0.2 |
| v2.0.1 | 池晓芳 | 2021-8-25 | 该文档调整为仅针对ISP21(RK356X) | AIQ v2.0x60.0; IQ Toolv2.0.2 |

### 2.1 功能描述

自动白平衡算法能自动的计算WB gain (R G B通道的白平衡增益)，并将其与RGB通道分别相乘后，使受环境光影响的白色还原成纯白色，保证在各个光线条件下，相机成像色彩跟物体真实的色彩保持一致。当场景存在白点时基于自动检测的白点计算WB gain，当场景不存在白点时通过单纯色方法得到WBgain。色适应模块，对白平衡校正的目标进行调节，使白平衡校正后的图像尽可能与人眼感知的外貌一致。色调调整模块，根据喜好调整整体色调。由硬件的统计和软件的策略构成自动白平衡，如AWB流程图所示



图 AWB 流程

### 2.2 关键参数

ISP21的参数见IQ json文件的wb\_v21节点；

### 白平衡校正使能及白平衡模式选择

在control节点下


| 名称 | 描述 |
| --- | --- |
| bypass | 取值0或10表示做白平衡校正，使用的白平衡增益由mode控制1表示不执行白平衡校正 |
| mode | 取值CALIB_WB_MODE_AUTO或CALIB_WB_MODE_MANUALCALIB_WB_MODE_MANUAL表示使用手动白平衡增益CALIB_WB_MODE_AUTO表示使用自动白平衡算法计算白平增益 |

### 手动白平衡参数

在manualPara节点下

名称 描述  

取值CALIB\_MWB\_MODE\_CCT或CALIB\_MWB\_MODE\_WBGAIN或  

mode  

CALIB\_MWB\_MODE\_SCENE  

取值范围[0.5-3.9]  

cfg.wbgain  

mode == CALIB\_MWB\_MODE\_WBGAIN时，手动白平衡应用该参数  

取值为CALIB\_WB\_SCENE\_INCANDESCENT（表示A光源）  

或CALIB\_WB\_SCENE\_FLUORESCENT（表示CWF光源）  

或CALIB\_WB\_SCENE\_WARM\_FLUORESCENT（表示U30光源）  

或CALIB\_WB\_SCENE\_DAYLIGHT（表示D65光源）  

cfg.scene  

或CALIB\_WB\_SCENE\_CLOUDY\_DAYLIGHT（表示D50光源）  

或CALIB\_WB\_SCENE\_TWILIGHT（表示HZ光源）  

或CALIB\_WB\_SCENE\_SHADE（表示D75光源）  

mode == CALIB\_MWB\_MODE\_SCENE时，手动白平衡应用该参数  

CCT取值为[0-10000]  

cfg.cct CCRI取值为[-2,2]，CCRI取值为0时近似为色度图中普朗克轨迹上的光源  

mode == CALIB\_MWB\_MODE\_CCT时，手动白平衡应用该参数

### 几种配置为：

自动白平衡+白平衡校正使能（推荐配置）   

control.bypass = 0;   

control.mode = CALIB\_WB\_MODE\_AUTO;   

白平衡校正不使能   

control.wbBypass = 1;   

手动白平衡+白平衡校正使能   

control.wbBypass = 0;   

control.mode = CALIB\_WB\_MODE\_MANUAL;   

manualPara.cfg.scene = CALIB\_MWB\_MODE\_WBGAIN;   

manualPara.cfg.wbgain = [1,1,1,1];

### 自动白平衡参数

接下来的的参数均为自动白平衡模式下的参数。在autoPara（ISP20和ISP21的成员有差异）和autoExtPara（ISP20和ISP21的成员一样）节点中。后续的参数均为这两个结构体的成员。

### hdrPara

对应于autoPara.hdrPara结构体，对于hdr sensor 可以指定从长中短的其中一帧进行白平衡相关统计，推荐使用自动模式。


| 名称 | 描述 |
| --- | --- |
| frameChooseMode | 取值CALIB_AWB_HDR_FRAME_CHOOSE_MODE_MANUAL或CALIB_AWB_HDR_FRAME_CHOOSE_MODE_AUTO。CALIB_AWB_HDR_FRAME_CHOOSE_MODE_MANUAL 固定模式;CALIB_AWB_HDR_FRAME_CHOOSE_MODE_AUTO自动模式，自动选择哪一帧用于白平衡统计，推荐值。 |
| frameChoose | mode 为0 时有效；两帧hdr下：取值为0或1；0 选择短帧用于白平衡统计；1 选择长帧用于白平衡统计；三帧hdr下：取值为0、1或2；0 选择短帧用于白平衡统计；1 选择中帧用于白平衡统计；2 选择长帧用于白平衡统计； |

### limitRange


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度取值范围0-255000 |
| maxR | R通道值域右边界，推荐值255-黑电平-3，最大值255 |
| minR | R通道值域左边界，推荐值3，最小值0 |
| maxG | G通道值域右边界，推荐值255-黑电平-3，最大值255 |
| minG | G通道值域左边界，推荐值3，最小值0 |
| maxB | B通道值域右边界，推荐值255-黑电平-3，最大值255 |
| minB | B通道值域左边界，推荐值3，最小值0 |
| maxY | Y通道值域右边界，推荐值255-黑电平-3，最大值255 |
| minY | Y通道值域左边界，推荐值3，最小值0 |

### mainWindow


| 名称 | 描述 |
| --- | --- |
| mode | 取值 CALIB_AWB_WINDOW_CFG_FIXED 或CALIB_AWB_WINDOW_CFG_AUTOCALIB_AWB_WINDOW_CFG_AUTO自动配置统计主窗口为raw大小，推荐值CALIB_AWB_WINDOW_CFG_FIXED 自定义统计窗口大小 |
| window | mode 为1 时使能window=[h_offset,v_offset,h_size,v_size]，h代表水平方向，v代表垂直方向h_offset,v_offset,h_size,v_size取值为0-1取值为[0,0,1,1]表示使用全窗口，即raw的尺寸 |

### downScaleMode

对应JSON中的autoPara.downScaleMode成员


| 名称 | 描述 |
| --- | --- |
| downScaleMode | 取值 CALIB_AWB_DS_4X4 或CALIB_AWB_DS_8X8 CALIB AWB DS 4X4表示 raw 4x4下采样作为AWB 统计模块的输入，水平 和垂直方向的下采样倍数ds_w，ds_h都为4 CALIB_AWB_DS_8X8表示 raw 8x8下采样作为AWB 统计模块的输入，水平 和垂直方向的下采样倍数ds_w，ds_h都为8，默认值 |

### lscBypassEnable

对应JSON中的autoPara.lscBypassEnable成员


| 名称 | 描述 |
| --- | --- |
| IscBypassEnable | 取值0或1； 0 白平衡统计通路的lens shading correction (LSC)不使能; 1 白平衡统计通路的LSC使能； |

### blkStatisticsEnable

对应JSON中的autoPara.blkStatisticsEnable成员


| 名称 | 描述 |
| --- | --- |
|  | 取值0或1; |
| blkStatisticsEnable | 0白平衡统计15x15的块统计功能不使能； |
|  | 1白平衡统计15x15的块统计功能使能； |

### blkMeasureMode

对应JSON中的autoPara.blkMeasureMode成员


| 名称 | 描述 |
| --- | --- |
| blkMeasureMode | 取值CALIB_AWB_BLK_STAT_MODE_ALL_V201 或 CALIB_AWB_BLK_STAT_MODE_REALWP_V201; CALIB_AWB_BLK_STAT_MODE_ALL_V201指15x15的块统计块内所有点的 累加值，默认值； CALIB_AWB_BLK_STAT_MODE_REALWP_V201 指15x15的块统计块内白点 |

### 硬件的白点检测流程



图 AWB 白点检测流程

如白点流检测程图所示从三个域上去法判断是否是白点


| 名称 | 描述 |
| --- | --- |
| uvDetectionEnable | 取值0或1；0 UV域非白点过滤不使能；1 UV域非白点过滤使能，根据白点条件选择UV域白点； |
| xyDetectionEnable | 取值0或1；0 XY域非白点过滤不使能；1 XY域非白点过滤使能，根据白点条件选择XY域白点； |
| yuvDetectionEnable | 取值0或1；0 YUV域非白点过滤不使能；1 YUV域非白点过滤使能，根据白点条件选择YUV域白点； |

上述三个参数为autoPara结体的成员，当这三个参数都配置为0时，则落在统计窗口内，且亮度符合要求的点都会被当成白点。来不及标定，又想粗略看一下自动白平衡后的效果时，可以这样使用。

### RGB2XY

RGB域到XY域变换参数由标定工具自动生成，对应JSON中autoPara.rgb2TcsPara结构体


| 名称 | 描述 |
| --- | --- |
| pseudoLumWeight | 使不同光源的白点尽量在一条直线上，参数由标定工具生成，取值范围0~1，不建议调整 |
| rotationMat | 旋转矩阵，使x轴表征黑体辐射色温的变化，y轴表征同温异谱的光源，参数由标定工具生成，取值范围[-3.99,3.99]，不建议调整 |

XY domain white points detector



图 XY域白点区间


| 名称 | 描述 |
| --- | --- |
| normal | 中框白点区间，取值范围[-8,7.99] |
| big | 大框白点区间，取值范围[-8,7.99] |

UV domain white points detector



图 UV域白点区间

UV域白点区间如上所示，在四边形框内的为白点，对应JSON的autoPara.lightSources.uvRegion结构体


| 名称 | 描述 |
| --- | --- |
| u | UV域白点条件的U坐标,构成一个闭环，如 $[ \mathsf &#123; u &#125; 0 , \mathsf &#123; u &#125; 1 \ \mathsf &#123; u &#125; 2 , \mathsf &#123; u &#125; 3 , \mathsf &#123; u &#125; 0 ]$ ，取值范围[0,255],小数位值只能是0或0.5在标定工具上手动调整白点区间生成 |
| V | UV域白点条件的V坐标,构成一个闭环，如 $[ \mathsf &#123; v &#125; 0 , \mathsf &#123; v &#125; 1 \ \mathsf &#123; v &#125; 2 , \mathsf &#123; v &#125; 3 , \mathsf &#123; v &#125; 0 ]$ ，取值范围[0,255],小数位值只能是0或0.5在标定工具上手动调整生成， |

### YUV domain white points detector

$( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$ $( \mathsf &#123; y &#125; ^ &#123; \prime &#125; , \ \mathsf &#123; u &#125; 0 , \ \mathsf &#123; v &#125; 0 )$



$( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$

对应JSON中autoPara.lightSources.rtYuvRegion的结构体


| 名称 | 描述 |
| --- | --- |
| lineVector | 由 $( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$ 得到理论白点  $( \mathsf &#123; y &#125; ^ &#123; \prime &#125; , \mathsf &#123; u &#125; 0 , \mathsf &#123; v &#125; 0 )$  计算所需参数每个分量的取值范围[0,255]，精度为 $1 / ( 2 \land 4 )$ 由标定工具得到不建议调整 |
| disP1P2 | 由 $( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$ 得到理论白点  $( \mathsf &#123; y &#125; ^ &#123; \prime &#125; , \mathsf &#123; u &#125; 0 , \mathsf &#123; v &#125; 0 )$  计算所需参数每个分量的取值范围[0,255]，精度为1/(2^4)由标定工具得到不建议调整 |
| thcurve_u | 分段直线u-th的u分量每个分量的取值范围[0,255]，整数注：需满足相邻两个u分量的差为2的幂次方 |
| thcure_th | 分段直线u-th的th分量每个分量的取值范围[0,255]，精度为1/(2^4)注: 分段直线u-th必须为单调递增 |

### 增加非白点的区间

非白点区间个数最多为7。

对应JSON中的autoPara.extraWpRange参数，




| 名称 | 描述 |
| --- | --- |
| domain | 取值CALIB_AWB_EXTRA_RANGE_DOMAIN_UV或CALIB_AWB_EXTRA_RANGE_DOMAIN_XYCALIB_AWB_EXTRA_RANGE_DOMAIN_UV表示UV域白点区间CALIB_AWB_EXTRA_RANGE_DOMAIN_XY表示 XY域白点区间 |
| mode | 取值CALIB_AWB_EXCLUDE_WP_MODE或CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODECALIB_AWB_EXCLUDE_WP_MODE表示该range 为非白点区间CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODE表示该range为额外光源的白点区间(ISP21上不支持该模式) |
| window | 配置区间如上图所示[x0,x1,y0,y1]当domain=0时，取值范围为[0,511]，其中1bit为小数位当domain=1时，取值范围为[-8192,8191]，其中10bit为小数位 |

### 白点不同亮度不同权重



从图上可以看出合适亮度白点数占比比较多的时候，合适亮度区间（如y为80-224区间）分配的权重更大，而其他暗区或亮区权重比较小。  

对应于JSON中的autoPara.wpDiffLumaWeight参数


| 名称 | 描述 |
| --- | --- |
| enable | 该功能使能的开关取值0或10不使能1使能 |
| wpDiffWeiEnableTh | 该功能使能还要满足该阈值条件 |
| wpDiffWeiEnableTh.wpDiffWeiNoTh | 白点数量大于该阈值该功能才使能取值范围[0,1] |
| wpDiffWeiEnableTh.wpDiffWeiLvValueTh | 环境亮度大于该阈值功能才使能取值范围[0-2555000] |
| wpDiffwei_y | 白点亮度直方图的亮度分段，九个点分为8个bin取值范围[0,255]注：需满足相邻两个分量的差为2的幂次方不建议调整 |
| perfectBinConf | 指定白点亮度直方图上哪个bin的白点为可信度高的白点，即指定合适亮度每个分量对应一个bin取值范围0或10 可信度低的白点1 可信度高的白点 |
| wpDiffWeiLvTh | 两个分量分别对应环境亮度为wpDiffWeiLvTh0，wpDiffWeiLvTh1取值范围[0-2555000] |
| wpDiffWeightLvSet | 不同环境亮度下不同的可信度高的白点占比可以配置不同的曲线，实际情况由这些曲线进行线性插值 |
| wpDiffWeightLvSet_len | 环境亮度的个数 |
| wpDiffWeightLvSet.LvValue | 环境亮度值 |
| wpDiffWeightLvSet.ratioSet | 环境亮度为wpDiffWeightLvSet.LvValue时不同的可信度高的白点占比可以配置不同的曲线 |
| wpDiffWeightLvSet.ratioSet_len | 可信度高的白点占比个数 |
| wpDiffWeightLvSet.ratioSet.ratioValue | 可信度高的白点占比值 |
| wpDiffWeightLvSet.ratioSet.weight | 环境亮度为wpDiffWeightLvSet.LvValue时且可信度高的白点占比值为wpDiffWeightLvSet.ratioSet.ratioValue时的亮度权重每个分量对应一个bin取值范围[0,1] |

### 分块权重

不同块的白点可以配置不同的权重，可以根据实际的应用场合去配置使用，没有特殊需求不建议使用


| 名称 | 描述 |
| --- | --- |
| wpDiffBIkWeiEnable | 该功能使能的开关取值0或10不使能1使能 |
| wpDiffBlkWeight | 15*15块，每块的权重取值范围[0-63]，整数 |

### AWB 策略

分区策略计算WBGain



图 AWB 分区策略计算WBGain示意

### (1) 分区间参数

分区间参数对应JSON中autoExtPara.division结构体


| 名称 | 描述 |
| --- | --- |
| lumaValThLow | 图上的环境亮度阈值LV_THL1取值范围0-255000 |
| lumaValThLow2 | 图上的环境亮度阈值LV_THL2取值范围0-255000 |
| lumaValThHigh | 图上的环境亮度阈值LV_THH1取值范围0-255000 |
| lumaValThHigh2 | 图上的环境亮度阈值LV_THH2取值范围0-255000 |
| wpNumTh | 不同环境亮度可配置不同的图上阈值WP_THL、WP_THH，由这些配置线性插值得到实际阈值 |
| wpNumTh.lumaValue | 环境亮度取值范围0-255000 |
| wpNumTh.low | 图上的白点数量阈值WP_THL取值范围0-100000实际的白点数量和WP_THL/100000*totalPixe比较，其中totalPixel = wight * height /ds_w/ds_h，图像宽高为wight,height，水平和垂直方向的下采样倍数分别为ds_w，ds_h |
| wpNumTh.high | 图上的白点数量阈值WP_THH取值范围0-100000实际的白点数量和WP_THH/100000*totalPixel比较 |

### (2)策略wbgain 相关参数

根据以上阈值对环境亮度-白点数量空间进行分区，不同的区间计算白平衡增益的方法为：

② WPType2为过渡带,由WPType3和WPType1的wbgain混合得到；

### ③ WPType1中的wbgain:

如果是第一帧时可能为固定的NightGain或DayGain，也有可能是由单纯色算法算出的WBGain，由环境亮度所在区间决定；否则为前几帧的wbgain加权得到

对应JSON中参数，

### ① DayGain


| 名称 | 描述 |
| --- | --- |
| defaultDayGainLow | 特别亮日光下的推荐wbgain取值范围[0.5-7.9] |
| defaultDayGainHigh | 普通日光下的推荐wbgain取值范围[0.5-7.9] |
| dayGainLvThSet | 表示dayGainLvThSet_THL和dayGainLvThSet_THH，分别和defaultDayGainLow和defaultDayGainHigh对应。不同光源可以有不同配置取值[0-255000] |
| staWeight | WPType3中的wbgain计算时StaGain_i的权重。不同亮度下对应不同StaGain_权重，与JSON中LvMatrix对应。DayGain_i的权重为100-staWeigthSet。不同光源可以有不同配置。通常情况StaGain的权重都为100效果最优，对于室外蓝天偏红的场景可以通过配置defaultDayGainLow为d65为标准wbgain,defaultDayGainHigh为d50为标准wbgain，且减小改场景亮度下的staWeigth值改善取值[0-100] |

根据环境亮度、dayGainLvThSet、defaultDayGainLow、defaultDayGainHigh即可线性插值得到不同光源的DayGain\_i。用后面讲到的光源权重加权后得到给WPType1区间中的DayGain。

### ② NightGain


| 名称 | 描述 |
| --- | --- |
| defaultNightGain | 即为前面所述的NightGain，环境亮度低时的推荐wbgain取值范围[0.5-7.9] |
| defaultNightGainWeight | WPType3中的wbgain计算时NightGain的权重，不同亮度下对应不同权重，与JSON中lumaValueMatrix对应。取值范围0-100 |

### ③ SingleColorGain（singleColorProcess）

实现大面积单纯色白平衡的功能，基于场景信息从配置的颜色集合和光源集合中选出颜色和WBGain。目前默认标定参数可以识别的颜色有红绿蓝黄紫。可以根据实际应用场合去增删待选择的颜色集合（colorBlock），及调整待选择的光源集合（lsUsedForEstimation），工具尚未支持该功能，对应JSON中autoExtPara.singleColorGain


| 名称 | 描述 |
| --- | --- |
| enable | 该功能使能的开关取值0或10不使能1使能 |
| colorBlock | 待选择的颜色集合，由工具生成 |
| colorBlock_len | colorBlock集合中颜色总数 |
| colorBlock.index | 颜色索引，标记标定时用到的颜色块，修改对效果没有影响，取值范围1-24标定工具默认选择x-rite色卡上的13、14、15、16、5、10 |
| colorBlock.meanC | 该颜色在LCH空间的平均色度值 |
| colorBlock.meanH | 该颜色在LCH空间的平均色调值 |
| IsUsedForEstimation | 待选择的光源集合，由工具生成 |
| IsUsedForEstimation_len | IsUsedForEstimation集合中光源总数 |
| IsUsedForEstimation.name | 光源名 |
| IsUsedForEstimation.RGain | 该光源的红色通道白平衡增益取值大于0,小数 |
| IsUsedForEstimation.BGain | 该光源的蓝色通道白平衡增益取值大于0,小数 |
| alpha | LCH空间的H权重使用默认值即可，不用调整取值范围[0.0-1.0] |

④ 若前几帧有白平衡增益了，则用前几帧加权的wbgain作为WpType3的白平衡增益


| 名称 | 描述 |
| --- | --- |
| weightForNightGainCalc_len | 指定前weightForNightGainCalc len帧用于加权取值不限，整数 |
| weightForNightGainCalc | 指定前几帧用于加权的权重，第0个位置对应最远一帧的权重，最后一个位置对应最近一帧的权重取值[0-100] |

### (3) 光源权重计算相关参数

WpType3内不同光源的概率计算参数

$$

```
\mathcal { P } \Gamma \mathcal { O } \dot { \mathcal { Z } } _ { 3 } = \mathcal { P } r o 3 \mathcal { L } V _ { i } ^ { * } \mathcal { P } r o 3 \mathcal { D } \dot { s } _ { i } ^ { * } \mathcal { P } r o 3 \mathcal { W } \bar { \mathcal { P } } _ { i } ^ { 0 }
```

$$

① $p r v &#123; \dot &#123; \lambda &#125; &#125; \bar &#123; \mathcal &#123; D &#125; &#125; \dot &#123; s &#125; _ &#123; i &#125;$ 距离概率参数

由前一帧的wbgain到各个光源的标准wbgain的欧式距离（gain\_dis）,根据下图分段直线计算得到距离概率



对应JSON中autoExtPara.probCalcDis的结构体


| 名称 | 描述 |
| --- | --- |
| $p r o D i s _ &#123; - &#125; \mathsf &#123; T H L &#125;$ | 图上的距离阈值disTHL取值范围[0-4] |
| $\mathsf &#123; p r o D i s \_ T H H &#125;$ | 图上的距离阈值disTHH取值范围[0-4] |

### ② $p r o \dot &#123; b &#125; \dot &#123; L &#125; V _ &#123; \mathrm &#123; i &#125; &#125;$ 场景亮度概率参数

室外类型的光源其光源的概率为 pout，pout根据图 4- 14亮度-pout曲线计算

室内类型的光源其光源的概率为 $\mathsf &#123; p i n &#125; = 1 \mathsf &#123; - p o u t &#125;$

不能严格区分的光源，如 $\mathsf &#123; p d &#125; 5 0 = \mathsf &#123; m a x &#125; ( \mathsf &#123; p o u t &#125; _ &#123; \cdot &#125;$ ，pin)



对应JSON中的参数如下


| 名称 | 描述 |
| --- | --- |
| autoExtPara.probCalcLv.outdoorLumaValThLow | 图上的环境亮度阈值outdoorTHL取值范围0-255000 |
| autoExtPara.probCalcLv.outdoorLumaValThHigh | 图上的环境亮度阈值outdoorTHH取值范围0-255000 |
| autoPara.lightSources.doorType | 光源属于室内还是室外，不同光源有不同的配置1 表示室内2 表示介于室内和室外之间3表示室外 |

### ③ 场景白点数量概率参数

对应JSON中autoExtPara.probCalcWp的结构体


| 名称 | 描述 |
| --- | --- |
| wpNumPercTh | 当某个光源白点数量小于wpNumPercTh*totalPixel，且白点数量占所有光源的白点数比例小于wpNumPercTh2，则该光源白点数量概率为0，其中totalPixel = wight* height /ds_w/ds_h，图像宽高为wight，height，水平和垂直方向的下采样倍数分别为ds_w，ds_h取值范围0-1 |
| wpNumPercTh2 | 同上 |

### WBGain色适应调整

暂不推荐使用，对应JSON中autoExtPara.chrAdpttAdj的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 白平衡校正后的图像尽可能与人眼感知的色彩外貌一致的使能取值0或1，分别代表不使能、使能 |
| laCalcFactor | 控制不同亮度下色适应程度的因子，默认值为40。 |
| targetGain | 用wbgain来表征光源，调整色彩外貌将被调整为该光源下的样子取值范围0-4，默认值为d50白平衡增益 |

### WBGain范围限制



将白平衡增益限制在上图所示红色直线围成的区域内，其中横坐标为相对色温，纵坐标为显色指数，这两个为光源的属性。对应JSON中autoExtPara.wbGainClip的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 色温范围限制使能取值0或1，分别代表不使能、使能 |
| cct | 对应图上围成区域的圆点cct坐标上下边界采用相同的cct采样坐标取值[1000-10000] |
| cri_bound_up | 对应图上围成区域的下边界圆点cri分量对于位于区域内的点即cri0&gt;=-cri_bound_up，否则取值-1到1 |
| cri_bound_low | 对应图上围成区域的上边界圆点cri分量对于位于区域内的点有cri0&lt;=cri_bound_low取值-1到1 |
| cct_len/cri_bound_up_len/cri_bound_low_len | cct_len,cri_bound_up_len,cri_bound_low_len分别对应cct，cri_bound_up,cri_bound_low的长度，这三个要相等 |

除此之外还可以对室外光源的色温最小值进行限制，对应JSON中autoExtPara.wbGainDaylightClip的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 室外最低色温限制使能 取值0或1，分别代表不使能、使能 |
|  |  |
| outdoor_cct_min | 室外最低色温取值不限 |

若wbGainDaylightClip.enable= 1，且场景为室外场景，若cct0&gt;outdoor\_cct\_min，则输出cct0=outdoor\_cct\_min。

### WBGain色调调整

对应JSON中autoExtPara.wbGainAdjust的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 色调调整使能取值0或1，分别代表不使能、使能 |
| lutAll | 不同的环境亮度可以配置不同的输出色温表 |
| lutAll_len | 指定色温表的个数 |
| lutAll.IumaValue | 环境亮度取值范围0-255000 |
| lutAll.ct_grid_num | 输入色温表之色温的采样点数取值不限 |
| lutAll.ct_in_range | 输入色温表之色温的范围取值不限 |
| lutAll.cri_grid_num | 输入色温表之显色指数的采样点数取值不限 |
| lutAll.cri_in_range | 输入色温表之显色指数的范围取值不限 |
| lutAll.ct_out | 如下面的工具界面图所示每个圆点的ct值，从左到右(色调从冷到暖)，即CT从小到大取值范围0-255000 |
| lutAll.cri_out | 如下面的工具界面图所示每个圆点的cri，从下到上(色调从紫到绿)，即CRI从负数到正数取值范围不限 |
| lutAll.ct_in_range_len/lutAll.cri_in_range_len/lutAll.cri_out_len/lutAll.cri_out | 表示如下面的工具界面图中二维网格的点个数，相等且为lutAll.ct_grid_num*lutAll.cri_grid_num |

### 目前json版本的工具尚未支持调整功能。



对于整体色彩风格的调整：

①如将色调色温为2000k的色调调暖，如下所示选择CT Line Only模式调整表格，鼠标移动到cct=2000的任意一个圆点附近后单击并向右拖动即可。应用后输入是2000k-2391k的都将被调整为2391k。



② 如将所有的色调调冷，如下所示选择CT Line Only模式调整表格，鼠标依次移动到不同cct的任意一个圆点附近后单击并向左拖动，直到所有的色调都往左偏。



③如将所有cri为0.5的色调调紫，如下所示选择CRILine Only模式调整表格，鼠标移动到cri=0.5任意一个圆点附近后单击并向下拖动即可。如果向上拖动则得到偏绿的色调。  



色调调整效果参考下图（中间是原图，上下左右分别为绿紫蓝红色调）



另外二维表可以很方便的对局部wbgain进行调整而不影响其他场景，这时候选择free模式可以任意方向调整，移动其所在矩形的四个顶点坐标就可以调整输出的wbgain。

### wbGain偏移

对应JSON中autoExtPara.wbGainOffset的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 使能开关取值0或1，分别代表不使能、使能 |
| offset | wbgain与offset相加，对应R GR GB B通道的偏移取值范围由wbgain与offset相加值确定，即wbgain与offset相加后范围在\[0,4\](ISP20),wbgain与offset相加后范围在\[0,8\](ISP21) |

### remosaic sensor配置

其他形式的sensor raw通过插值转为bayer raw的时候，需要先乘wbgain效果更优，转之后没有进行逆wbgain计算，为了适配当前awb算法采用的配置，对应JSON中autoExtPara.remosaicCfg的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 使能开关取值0或1，分别代表不使能、使能bayer 排列的sensor 无需使能 |
| sensorWbGain | 插值时乘的wbgain，对应R GR GB B通道取值范围得看sensor的说明文档 |
| applylnvWbGainEnable | 在raw awb统计前是否进行逆wbgain的开关，即除以sensorWbGain取值0或1，分别代表不使能、使能 |

### WBGain平滑

```c
if (varianceLuma > LvVarTh) {
*wbGainDampFactor -= dFStep;
}
else {
*wbGainDampFactor += dFStep;
}
if (*wbGainDampFactor < dFMin) {
*wbGainDampFactor = dFMin;
```

```
}

else if (*wbGainDampFactor > dFMax) {
```

```javascript
*wbGainDampFactor = dFMax;
```

```
}
```

对应JSON中autoExtPara.dampFactor的结构体


| 名称 | 描述 |
| --- | --- |
| dFStep | wbGainDampFactor变化的步长取值范围0-1 |
| dFMin | wbGainDampFactor最小值取值范围0-1 |
| dFMax | wbGainDampFactor最大值取值范围0-1 |
| LvllRsize | 记录几帧的环境亮度取值范围0-255 |
| LvVarTh | 用于判断wbGainDampFactor是否要变化的环境亮度方差阈值取值范围0-255000 |

### 其他

### tolerance


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度，取值范围[0-255000]，参考后面的lumaValueMatrix来配置 |
| toleranceValue | 阈值，取值范围[0-1] |
| lumaValue_len/toleranceValue_len | 相等，对应配置的个数取值范围不限 |

### runInterval

用于控制隔几帧做一次自动白平衡，不同环境亮度（lumaValue）下可配置不同的帧数（intervalValue）。对应JSON中autoExtPara.runInterval的结构体


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度，取值范围[0-255000]，参考后面的lumaValueMatrix来配置 |
| intervalValue | 帧数，取值范围[0-255] |
| lumaValue_len/intervalValue_len | 相等，对应配置的个数取值范围不限 |

### lumaValueMatrix

对应JSON中autoExtPara.lumaValueMatrix的数组


| 名称 | 描述 |
| --- | --- |
| lumaValueMatrix | 将环境亮度划分为15个等级，每一级的起始环境亮度值取值范围0-300000 |

### 白平衡收敛判断

对应JSON中autoExtPara.converged的结构体


| 名称 | 描述 |
| --- | --- |
| varThforUnDamp | 白平衡收敛阈值；几帧内由AWB策略算出的白平衡增益（所有通道）差值的平均小于阈值varThforUnDamp时，且几帧内平滑后的白平衡增益（所有通道）差值的平均小于varThforDamp时认为白平衡收敛；其中帧数由weightForNightGainCalc_len配置取值范围0.0-1；推荐值0.06 |
| varThforDamp | 参数含义及取值范围同上推荐值0.03 |

### 中框、大框选择

对应JSON的autoExtPara.xyRegionStableSelection节点


| 名称 | 描述 |
| --- | --- |
| enable | 中框、大框、附加白点框选择结果稳定的功能开关 |
| xyTypeListSize | xyRegionSize和LvVarTh用于稳定选框的结果，xyTypeListSize帧内选投票比较多的框，作为最终的结果，且LvlIRsize(见”WBGain平滑“章节）帧内环境亮度的方差小于varianceLumaTh时，不更新选框的结果，即前一帧用什么框，后面一帧一直都用这个框。取值范围0-1000; |
| varianceLumaTh | 见上面一行描述；取值范围0-1000； |
| wpNumTh | 配置随环境亮度变化的配置，由这些配置线性插值得到阈值 |
| wpNumTh.lumaValue | 环境亮度；取值范围0-255000 |
| wpNumTh.forBigType | 白点数量和forBigType/100000*totalPixel比较取值范围0-100000 |
| wpNumTh.forExtraType | 无用 |

xyRegionSize =0 或varianceLumaTh= 0，将每帧都去应用当前帧信息对应的选框结果。

```
if(中框白点数量>wpNumThForBigType/100000*totalPixel){
```

则计算wbgain的白点来自于中框

```
}else{
```

计算wbgain的白点来自于大框

注：

（1）当计算wbgain的白点来自于附加白点框时，“分区策略计算WBGain”章节里面的参数无效

### 2.3 标定

### AWB标定基本原理

主要是标定Raw在XY、UV、YUV的白点条件,单纯色算法参数及标准光源下的白平衡增益

AWB标定的raw图要求

Raw图采集时需要准备环境如下：

① 设备：x-rite 24色卡，灯箱

② 调整曝光参数,使色卡中最亮的白色块的最大值为[150-240]，在这个范围内越亮越好

③ 色卡占画面1/9以上

依次在A,CWF,D50，D65，D75，HZ,TL84光源下拍摄x-rite 24色卡，解完马赛克的示意图如下：















### AWB标定工具的界面说明

(1) 标定的时候主要是调整UV、XY域的白点边界，及YUV域的TH值





(2) 各个光源的信息显示可以通过Display Control面板里LightX前面的复选框来选择是否显示

(3) Exclude WPC Range面板可用于增加非白点区间和额外光源白点区间。

(4) AWB Simulaton 用于对raw图进行白点检测，统计白点增益



① LoadImage 导入Raw图后，如下所示，会打印出白点信息。不同光源的白点用不同的颜色显示出来。中框、大框、小框的白点数量 RGain累加和 BGain累加和 会显示在Detected WP Number、RGain、BGain三个文本框里



② 单击图像中的任意位置，会映射到UV域白点条件界面和XY域条件界面上，便于查看点是否落在白点区间内，同时该点的R G B U V X Y RGain BGain Dis Th会显示在该界面的Stats of Point Track面板上

### AWB标定步骤

(1) AWB标定时需完成BLC和LSC的标定

(2) 单击Load Raw Files导入A,CWF,D50，D65，D75，HZ,TL84下的raw图（推荐标定这七个光源的raw图）

(3) 单击Find Chart 识别色卡  



① 依次单击第1块，第6块，第19块，第20块

② 单击FindChart 会批量识别所有光源的色卡色块，如下所示（显示最后一个光源的白点检测结果）



③ 从下拉菜单里面选择其他光源，确认色块识别的正确性，发现只有TL84的最后一块识别有点偏右，这时候只需单独重新检测即可，固Mode里面 选择 Find chart one by one 重复步骤12，直至TL84的色卡色块识别正确，如下所示



④ 单击Save 完成识别  

(4) 单击Calibrate ，得到如下初始的白点条件及其他参数






| YPC (UV Domain &amp; XY Domain) | WPC (YUV Donain) |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Light Names | Dis0 | Dis1 | Dis2 | Dis3 | Dis4 | Dis5 |  |
|  | 44 | 108 | 236 | 364 | 620 | 876 |  |
| 2 CWF | 39 | 103 | 231 | 359 | 615 | 871 |  |
| m D50 | 30 | 94 | 158 | 414 | 542 | 798 |  |
| 4 D65 | 18 | 82 | 210 | 338 | 594 | 850 |  |
| 5 D75 | 7 | 71 | 199 | 327 | 583 | 839 |  |
| 6 HZ | 50 | 114 | 242 | 370 | 626 | 882 |  |
| TL84 A | 38 | 102 | 166 | 294 | 550 | 806 |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
| Light Names Thd0 | 11 | Thd1 14 | Thd2 | Thd3 20 | Thd4 23 | Thd5 26 |  |
| 1A |  |  | 17 |  |  |  |  |
| 2 CWF | 11 | 14 | 17 | 20 | 23 | 26 |  |
| 3 D50 | 11 | 14 | 17 | 20 | 30 | 40 |  |
| 4 D65 | 11 | 14 | 17 | 20 | 23 | 26 |  |
| 5 D75 | 11 | 14 | 17 | 20 | 23 | 26 |  |
| 6 6 HZ | 11 | 14 | 17 | 20 | 23 | 26 |  |
| 7 TL84 | 11 | 14 | 17 | 20 | 23 | 26 |  |
|  |  |  |  |  |  |  |  |

(5) 单击AWB Simulaton ,依次导入导入A,CWF,D50，D65，D75，HZ,TL84下的raw图查看白点检测的准确性

(6) 修改UV域或XY域的框或YUV的TH使各个光源下色卡的白点检测更准确

(7) 单击Save

(8) 重复（5）\~（7）直到各个光源的白点检测都比较合理。

(9) 注意事项：

① 调整边界尽量使白点在框里面，非白点在框外（一般做不到）

② 所有光源中框或大框围成的区间必须是紧连的（三种线型表示三个大小的框）

错误示范（大框的区间是紧连的，但是中框之间有间隔，如下箭头所示）：



### 正确示范：



③ a和hz光源在XY域的Y方向上可以紧凑一些，d50 d65XY域的Y方向上可以放宽一些

④ 所有光源在UV域围成的区间必须是紧连的

⑤ 不同光源边界可以重叠，但不要同时在XY和UV空间都重叠

⑥ 参考XY空间划分UV空间，以排除非白点

如圈出来的D75光源第7块落在hz范围内，将会被识别为白点



重新调整后，D75光源第7块B在xy和uv空间上不在同一光源内，不会被识别为白点





⑦ 当非白点落在XY和UV的白点区间里，还可以通过调小TH排除，或者增加非白点区间排除。

⑧ 当白点落在XY和UV的白点区间里，但仍然不是白点时，可能是因为超过亮度范围被排除了，或者落在非白点区间内，或者是因为小于TH 而没有落在YUV域的白点区间里

### AWB标定结果

最终白点条件：



### 白点检测结果为：



A光



CWF:



D65  



D75

Preview  



HZ  



TL84



### 2.4 常见问题定位

为了解决白平衡异常的问题，通常需要抓log和抓raw分析原因，通过修改白点条件或修改策略参数来解决。

### 抓log并分析

用于debug的awb log等级为export persist\_camera\_engine\_log=0x2ff4

### AWB log 解读

### (1) 控制及模式的log

[AWB]:XCAM INFO (1782) rk aig awb algo v201.cpp:1979: AwbInitV201: (enter)   

[AWB]:XCAM INFO (1782) rk\_aiq\_awb\_algo\_v201.cpp:2040: AwbInitV201: (exit)   

[AWB]:XCAM INFO (1782) rk aiq awb algo v201.cpp:2070: AwbPrepareV201: (enter)   

[AWB]:XCAM INFO (1782) rk aiq awb algo v201.cpp:2148: hdr working mode(0), remosaic cfg.enable (0)   

[AWB]:XCAM INFO (1782) rk aiq awb algo v201.cpp:2149: AwbPrepareV201: (exit)   

[AWB]:XCAM INFO (1782) rk aiq algo awb itf.cpp:102: -frame id (-1)---   

[AWB]:XCAM DEBUG rk aiq awb algo v201.cpp:2469: AwbReconfigV201: byPass: 0 mode( 0-manual 1-auto):1   

[AWB]:XCAM INFO (1782) rk\_aiq\_algo\_awb\_itf.cpp:250: processing awb\_gain\_algo (1.905082,1.000000,1.000000,1.978512)   

[AWB]:XCAM INFO (1782) rk aig algo awb itf.cpp:102: -frame id (0)----

hdr\_working\_mode为0 表示当前为normal模式，否则为hdr模式

byPass 为0 表示白平衡校正使能，为1 表示白平衡校正不使能

mode为0表示当前为手动白平衡模式，为1表示当前为自动白平衡模式

frame\_id为帧id

processing awb\_gain\_algo 为此模块最终输出的wbgain

（2）awb log等级为export persist\_camera\_engine\_log=0x2ff2 可用于一般的问题定位

2: -frame\_id (1)   

68: \*\*\*1th calculate wbgain\*\*\*   

52: AwbGainClip, Input CCT : 5800.018555, CRI : -0.124677   

09: AwbGainClip, Output CCT : 5800.018555, CRI : -0.124677   

09: AwbGainAdjust2. Input CCT : 5800.018555, CRI : -0.124677   

50: AwbGainAdjust2, Output CCT : 5800.018066, CRI : -0.124677   

3:   

7: wbgain a5(after damping) (rggb):(2,146030.1.000000,1,000000.2.072558), awbConverged(0) ,LVValue(6054), WPType(3),df(0.75). frameChoose(0   

0: WPNo(normal,big):(203,208),vaild wp number in standard light(187), vaild wp number in extra light(0),   

2: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0, runInterval(0),tolerance(0.000000)   

41:   

0: processing awb\_gain\_algo (2.146030,1.000000,1.000000,2.072558)

AwbGainClip Input 和output 分别为wbgain范围限制输入和输出的CCT和CRI；

AwbGainAdjust2Input 和output 分别为色调调整输入和输出的CCT和CRI；

wbgain\_s5为与平滑后的wbgain，一般与processing awb\_gain\_algo 相等; awbConverged 为 0 或1分别为AWB未收敛和收敛；

LVValue为环境亮度；

WPType对应于策略分区里面的区间；

df为当前的平滑系数wbGainDampFactor

frameChoose 为 0 1 2 分别表示用了 短、中、长帧作为AWB硬件统计的输入；

WPNo为中框、大框的白点数

vaild wp number in standard light为所有光源有效白点的数量

select white point range type 为0 1 表示当前白点统计分别基于中框和大框

tolerance 为wbgain的方差变化小于该值时，wbgain将不更新

（3）awb log等级为export persist\_camera\_engine\_log=0x2ff3 可用于白点条件及策略问题定位

tf.cpp:102: -frame id (91)   

om1.cpp:868: \*\*\*91th calculate wbgain\*\*\*   

om2.cpp:352: AwbGainClip, Input CCT : 6534.665527, CRI : -0.122040   

p:389: AwbGainClip wb gain clip, because curent cri(-0.122040)&lt; upper bound cri(-0.120000)   

p:407: AwbGainClip, wbgain s3 (rggb) (2.319863,1.000000,1.000000,1.746177)   

om2.cpp:409: AwbGainClip, Output CCT : 6534.665527, CRI : -0.120000   

om2.cpp:609: AwbGainAdiust2. Input CCT : 6534.665527. CRI : -0.120000   

p:649: AwbGainAdjust2, wbgain\_s4(2.319863,1.000000,1.000000,1.746177)   

om2.cpp:650: AwbGainAdjust2, Output CCT : 6534.664551, CRI : -0.120000   

p:847: Global CCT:6524.882812,CCRI:-0.119850,valid:1   

p:860: i11:D65 prob: 0.923094, CCT:6514.593750, CCRI:-0.121243, valid:1   

p:860: i11:D75 prob: 0.076906, CCT:6775.584961, CCRI:-0.131615, valid:1   

p:860: i11:A prob: 0.000000, CCT:0.000000, CCRI:0.000000, valid:0   

p:860: i11:CWF prob: 0.000000, CCT:4577.164551, CCRI:-0.118429, valid:1   

201.cpp:43:   

201.cpp:47: wbgain\_s5(after damping)(rggb):(2.317371,1.000000,1.000000,1.750428), awbConverged(1) ,LVValue(1498), WPType(3),df(0.90), frameChoose(0)   

201.cpp:50: WPNo(normal,big):(12374,12429),vaild wp number in standard light(12282), vaild wp number in extra light(0),   

201.cpp:52: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0. runInterval(0),tolerance(0.000000)   

p:63: temporalDefaultGain for wbGainType3 (rggb):(1.327034,1.000000,1.000000,3.314321), weight (0.000000)   

p:65: wbGainType1 (rqqb):(0.000000,0.000000,0.000000,0.000000)   

p:67: wbGainType3(rggb):(2.321654,1.000000,1.000000,1.747155)   

p:70: wbgain\_s1 (mix wbGainType1 and wbGainType3 ) :(2.321654,1.000000,1.000000,1.747155) is updated (1), weight of wbGainType3   

p:108: A:   

p:112: stateqy result.gain (rggb):(0.000000,0.000000,0.000000,0.000000)   

p:114: prob total(0.000000),prob dis(0.056154),prob LV(0.142857),prob WPNO(0.000000)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(0.000000,0.000000) WPNo(0)   

p:132: type1: gain (rg,bg):(0.000000,0.000000) WPNo(0)   

p:108: CWF:   

p:112: stategy\_result.gain (rggb):(1.846224,1.000000,1.000000,2.610467)   

p:114: prob total(0.000000),prob dis(0.148655),prob LV(0.142857),prob WPNO(0.000000)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: qain (rq,bq):(1.846224,2.610467) WPNo(18)   

p:132: type1: gain (rg,bg):(1.860870,2.614064) WPNo(20)   

p:108: D50:   

p:112: stategy\_result.gain (rggb):(2.087728,1.000000,1.000000,2.081820)   

p:114: prob\_total(0.000000),prob\_dis(0.207562),prob\_LV(0.142857),prob\_WPNO(0.000000)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(2.087728,2.081820) WPNo(74)   

p:132: type1: gain (rg,bg):(2.092266,2.077117) WPNo(78)   

p:108: D65:   

P:112: stategy\_result.gain (rggb):(2.316112,1.000000,1.000000,1.755642)   

p:114: prob total(0.923094),prob dis(0.216764),prob LV(0.142857),prob WPNO(0.923058)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(2.316112,1.755642) WPNo(11337)   

p:132: type1: gain (rg.bg):(2.316112.1.755642) WPNo(11337)   

p:108: D75:   

p:112: stategy\_result.gain (rggb):(2.388181,1.000000,1.000000,1.645277)   

p:114: prob total(0.076906),prob dis(0.216654),prob LV(0.142857),prob WPNO(0.076942)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(2.388181,1.645277) WPNo(945)   

p:132: type1: gain (rg,bg):(2.389237,1.646780) WPNo(994)   

p:108: HZ:   

n-112 (ragh)-(0.000000 0.000000 0.000000 0.000000)

由统计信息type0: gain到最终的processing awb\_gain\_algo经过下面几个步骤：

```
type0: gain ==> stategy_result.gain ==> wbGainType1+wbGainType3 ==> wbgain_s1 ==> wbgain_s3（AwbGainClip之后） ==> wbgain_s4（AwbGainAdjust，色调调整之后）==> wbgain_s5（damp，平滑之后） ==> processing awb_gain_algo
```

: Global   

: CCT:4342.158203,CCRI:0.072367   

: ill:A prob: 0.372926   

: CCT:3058.074463,CCRI:0.034103   

: ill:D50 prob: 0.369272   

: CCT:5710.621582,CCRI:0.096392   

: ill:TL84 prob: 0.233994   

: CCT:4246.391602,CCRI:0.107421   

: ill:CWF prob: 0.014538   

: CCT:4403.761719,CCRI:-0.060823

这些信息用于表征场景的色温，只是辅助信息，Global为综合的色温，ill列出参与WBGain计算的前几个光源的概率及色温

② temporalDefaultGain for wbGainType3 、weight分别为temporalDefaultGain及其在wbGainType3 中占的权重

③ wbGainTepType1为WpType1算出来的WBGain

④ wbGainType3为WpType3算出来的WBGain，wbWeightType3为权重（WpType1的权重为1-wbWeightType3）

⑤ wbgain\_s1 及weight分别为wbGainTepType1和wbGainType3混合的gain，及wbGainType3所占权重

⑥ stategy\_result.gain 为各个光源下的WBGain

⑦ prob\_total(0.372926),prob\_dis(0.151197),prob\_LV(0.142857),prob\_WPNO(0.383987)分别标示每个光源的总概率，距离概率，亮度概率，白点数量概率

⑧ spatial gain(rggb):(1.745900,1.000000,1.000000,1.824126),statistics gain weigth(1.000000)分别表示每个光源的dayGain（策略WBGain）,每个光源基于统计的白点输出的WBGain的概率，则策略WBGain概率为1 - statistics gain weigth

⑨ type0: gain (rg,bg):(1.287584,2.843158) WPNo(7707) 为中框统计的白平衡增益，白点数量

⑩ type1: gain (rg,bg):(1.291619,2.862351) WPNo(8557)为大框统计的白平衡增益，白点数量

### 从log上定位问题

① 若WPNo值比较小且实际场景中有一些白点，需要重新调整白点条件

② 看一下每个光源的statistics gain weigth是否为1，是否有受策略gain的影响

③ 看一下wbWeightType3权重是否为1：

如果场景确实白点比较少，但是wbGainType3可能与实际色温更符合，需调整WP\_THL、WP\_THH将当前场景划分到WpType3

其他情况均参考前面两点说明调整

### 抓raw并仿真

当需要重新调整白点条件，或者从Log上定位不出问题的时候，需要抓raw图进行白点检测仿真，及查看各个光源下的白点统计。

(1) 例1



右边是有问题的场景，左边是抓raw图重新调整了白点条件的效果

操作步骤：

① 抓raw图1

② 打开RKISPCalibrationTool，导入xml文件

③ BLC LSC参数配置好，现在的版本需要重新标定这两个参数

④ 为了可以参考之前标准光源下的色卡的白块和非白块的分布，需要重新Load Raw Files 导入标定时用到的所有图，单击FindChart 完成色卡识别，不要单击Calibrate，单击Save，单击Draw WPC FromIQ Param 导入白点条件，及显示色卡的色块分布。



⑤ 在 AWB Simulation界面上单击Load Image 导入raw图1，图片和白点检测结果会同时更新在界面上，如下所示






| 1024, 1614, 658 | 18.28,2056.30,831.46 | 3.01,4078.57,1754.84 |
| --- | --- | --- |
| 13.15.12 | 27.16.31.32.25.02 | 30.91,35.77,20.62 |
| 217, 209, 184 | 384.35,471.25,326.40 | 365. 76,449.44,309.86 |
| 10.26.16 | 40.32.57.33.36.00 | 27.92.39.39,25.02 |
| 0.0.0 | 0.00.0.00,0.00 | 0.00.0.00.0.00 |
| 073. 923, 306 | 34.70,903.05.319.50 | 6.17,3206.45.1164.55 |
| 808, 1551, 204 | 38. 42, 2435. 73, 474. 48 | 73.15, 3513.90, 620.96 |

可以看出识别的白点非常少，而图确实也比较暗。如下所示，类似圈出来的灰白区域都应该被检测为白点



⑥ 在图像上单击灰白区域，

看一下映射的点是否有在XY、UV的白点区间内，没有的话需要调整白点条件，使其落在区间内；

AWB Simulaton界面上也会显示出该点的R G B 和Y 的值，需要和JSON里面设置的limitRange对比，看是否超出范围了，若是这种情况，可以适当放宽点limitRange范围。因为特别暗和特别亮的点受噪声或某个通道饱和的影响，其Rgain Bgain与实际的会有些偏差，所以这个范围需要权衡；

若即在limitRange范围内，又在XY、UV的白点区间内，但是又没被识别为白点，还需确认YUV 的TH，后面AWB Simulaton界面上也会显示出该点的th , 参考界面上的这个值去调整YUV 的TH；

⑦ 调整完，单击AWB界面上的Save，单击AWB Simulation界面上的 Run Simlation 重新仿真。

修改XY、UV的白点区间后，白点检测如下，就解决了白平衡异常的问题




| □ All ☑A | Detected WP Number | RGain | BGain |
| --- | --- | --- | --- |
|  | 17053, 18576, 15794 45, 22974.32, 19467.19 | 38, 48464.96, 41539.59 |  |
| □ CWF 10, 12, 8 | 20.53,24.33,16.41 | 23.08,27.63,18.63 |  |
| □D50 72, 118, 55 | 137.98,227.24,104.65 | 120.82,198.23,92.91 |  |
| □D65 8, 11, 6 | 17.00,23.30,12.81 | 11.70,16.04,8.85 |  |
| □D75 0,0,0 | 0.00,0.00,0.00 | 0.00,0.00,0.00 |  |
| HZ 1626, 1703, 535 | 58.16, 1734.76, 528.21 | 4.53,5816.17,1940.03 |  |
| □ TL84 745, 1517, 24 | 114.55,2225.90,40.67 | 817.71,3653.69,53.98 |  |

### 特殊问题举例

(1) 网络摄像头应用里把白平衡设置为自然光模式，导致自动白平衡没有开启，

通过查看log发现当前mode=1 为手动模式

[09:51:39.57935] [AWB]:XCAM DEBUG rk\_aiq\_awb\_algo\_v200.cpp:2795: AwbReConfigV200: byPass: 0 mode:1]

更改白平衡模式后可解决这个问题

(2) 标定的时候发现hz a光下白点分布不集中



实际效果如下，白平衡做不对



后面测试发现是因为红外滤光片不合格导致近红外波段没有被截止，通过更换红外滤光片解决。

（3）cc模块的光源估计在来回震荡，导致色彩在震荡

Find result - 143 hits   

Line 5698: [00:02:57.7122321[ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.262492.0.988665, estimation illuminant is D50 (2)   

Line 5699: [00:02:57.712232][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50 (2)   

Line 5809: [00:02:57.811349][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.262492,0.988665, estimation i1luminant is D50 (2)   

Line 5810: [00:02:57.811349][ACCM]:XCAM DEBUG rk\~aig accm\~algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50 (2)   

Line 5920: [00:02:58.56126][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.267507,0.983502, estimation i1luminant is D50 (2)   

Line 5921: 00:02:58.561261[ACCM1:XCAM DEBUG rk aiσ accm algo.cpp:56: wbGain:1.267507,0.983502, estimation i1luminant is D50(2)   

Line 6031: [00:02:58.1550591[ACCM]:XCAM DEBUG rk aiσ accm algo.cpp:56: wbGain:1.267507.0.983502. estimation illuminant is D50 (2)   

Line 6032: [00:02:58.155059][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.267507,0.983502, estimation i1luminant is D50 (2)   

Line 6142: [00:02:58.366345][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6143: [00:02:58.3663451[ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6253: [00:02:58.465620][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6254: [00:02:58.465620][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6364: [00:02:58.577856] [ACCM]:XCAM DEBUG rk\~aiq acm\~algo.cpp   

Line 6365: [00:02:58.577856][ACCM]:XCAM DEBUG rk\~aiq\~accm\~algo.cpp 56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6475: [00:02:58.776105][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp 56: wbGain:1.275650,0.975244, estimation illuminant is D65 (3)   

Line 6476: [00:02:58.776105][ACCM]:XCAM DEBUG rk aiq accm algo.cpp 56: wDGaln:l.2 D65 (3)   

Line 6586: [00:02:58.987769][ACCM]:XCAM DEBUG rk\~aiq\~accm\~algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65 (3)   

Line 6587: [00:02:58.987769][ACCM]:XCAM DEBUG rk\~aiq accm\~algo.cpp:56: wbGain:1.279142,0.971930, estimation i1luminant is D65 (3)   

Line 6697: [00:02:59.85831][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65 (3)   

Line 6698: [00:02:59.85831][ACCM]:XCAM DEBUG rk\~aiq accm algo.cpp:56: wbGain:1.279142,0.971930, estimation i1luminant is D65 (3)   

Line 6808: [00:02:59.296966][ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 6809: [00:02:59.296966][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 6919: [00:02:59.409406][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 6920: [00:02:59.409406][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 7030: [00:02:59.522048][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.282218,0.968997, estimation i1luminant is D65 (3)   

Line 7031: [00:02:59.522048][ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 7141: [00:02:59.719781][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65 (3)   

Line 7142: [00:02:59.719781][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65 (3)   

Line 7252: [00:02:59.945211][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.287606,0.963857, estimation illuminant is D65 (3)   

Line 7253: [00:02:59.945211][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.287606,0.963857, estimation i1luminant is D65 (3)

通过增加JSON 中tolerance节点中的value值，使wbgain 变化小于这个值时，就不更新，达到稳定的目的。在这个例子中修改xml中参数为

$$

```
\begin{array} { r l } & { \qquad < \mathsf { t o } { \mathsf { I e r a n c e \ i n d e x } } \mathsf { I \Pi } ^ { \boldsymbol { \mathsf { u } } } \mathsf { t } \mathsf { \Pi } ^ { \boldsymbol { \mathsf { u } } } \mathsf { t } \mathsf { y p p e } = \mathsf { \Pi } ^ { \boldsymbol { \mathsf { u } } } 5 \mathsf { t r u c \ t \ t \ t } ^ { \mathrm { u } } \mathsf { \Pi } ^ { \mathrm { \tiny { u } } } \mathsf { \varphi } \mathsf { s i } z \mathsf { e } = ^ { \mathrm { \tiny { u } } } [ \mathsf { \Pi } \mathsf { 1 } \ \ \mathsf { 1 } \ ] ^ { \mathrm { \tiny { u } } } \mathsf { \varphi } > } \\ & { \qquad < \mathsf { L } \mathsf { V \Pi } \mathsf { i n d e x } = \mathsf { \Pi } ^ { \mathrm { \tiny { u } } } \mathsf { I \Pi } ^ { \mathrm { \tiny { u } } } \mathsf { y p p e } = \mathsf { \Pi } ^ { \mathrm { \tiny { u } } } \mathsf { d o u b l \ P } \mathsf { e } ^ { \mathrm { \tiny { u } } \varphi } \mathsf { s i } z \mathsf { e } = ^ { \mathrm { \tiny { u } } } [ \mathsf { \Pi } \mathsf { 4 } \ ] ^ { \mathrm { \tiny { u } } } \mathsf { y } > } \\ & { \qquad [ \mathsf { 0 } \quad \mathsf { 6 4 } \quad 1 2 8 \ \mathrm { \tiny \ 2 } \mathsf { 5 6 } \mathsf { . 0 0 0 0 \ } \mathsf { \Pi } ] } \\ & { \qquad < / \mathsf { L } \mathsf { V o } } \\ & { \qquad < \mathsf { v a l u e \ i n d e x } = \mathsf { \Pi } ^ { \mathrm { \tiny { u } } } \Pi ^ { \mathrm { \tiny { u } } } \quad \mathrm { t y p e } = \mathsf { \Pi } ^ { \mathrm { \tiny { u } } } \mathsf { d o u b l \ e } ^ { \mathrm { \tiny { u } } \varphi } \mathsf { s i } z \mathsf { e } = ^ { \mathrm { \tiny { u } } } [ \mathsf { \Pi } \ 4 ] ^ { \mathrm { \tiny { u } } } > } \\ &  \qquad [ \mathsf { 0 } . \mathsf { 0 5 \ } \mathsf { 0 } . 0 5 \ \mathsf { 0 } . 0 5 \ \mathsf { 0 } . 0 5 \ \mathsf { 0 } . 0  \end{array}
```

$$

## 3 基础颜色调整CC

### 3.1 功能描述

由于Sensor频谱分布函数很难和视觉响应函数完全匹配，因此，可通过一个色彩校正矩阵(ColorCorrection Matrix,CCM)校正光谱响应的交叉效应和响应强度，使前端捕获的图像与人眼视觉保持色彩一致。

CCM标定工具支持对24色卡进行3x3 CCM（aij）的预校正。

$$

\left[ \begin&#123;array&#125; &#123; l &#125; &#123; R _ &#123; c c &#125; &#125; \\ &#123; G _ &#123; c c &#125; &#125; \\ &#123; B _ &#123; c c &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; \alpha _ &#123; 1 1 &#125; &#125; & &#123; \alpha _ &#123; 1 2 &#125; &#125; & &#123; \alpha _ &#123; 1 3 &#125; &#125; \\ &#123; \alpha _ &#123; 2 1 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 2 2 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 2 3 &#125; &#125; \\ &#123; \alpha _ &#123; 3 1 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 3 2 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] \cdot \left[ \begin&#123;array&#125; &#123; l &#125; &#123; R _ &#123; c c a n e r a &#125; &#125; \\ &#123; G _ &#123; c o n e r a &#125; &#125; \\ &#123; B _ &#123; c o n e r a &#125; &#125; \end&#123;array&#125; \right]

$$

RV1109 支持多组不同色温的CCM，在ISP2.0运行时，可根据IQ参数配置的gain节点，调整全局饱和度或局部饱和度，实现CCM矩阵系数的动态调整。

$$

```
\begin{array} { r } { \left[ \begin{array} { l } { R _ { c c } } \\ { G _ { c c } } \\ { B _ { c c } } \\ { B _ { c c } } \end{array} \right] = a l p h a ^ { * } s c d e ^ { * } \left[ \begin{array} { l l l } { a _ { 1 1 } { \bf - 1 } } & { a _ { 1 2 } } & { a _ { 1 3 } } \\ { a _ { 2 1 } } & { a _ { 2 2 } { \bf - 1 } } & { a _ { 2 3 } } \\ { a _ { 3 1 } } & { a _ { 3 2 } } & { a _ { 3 3 } { \bf - 1 } } \end{array} \right] \cdot \left[ \begin{array} { l } { R _ { c a n e r a } } \\ { G _ { c a n e r a } } \\ { B _ { c a n e r a } } \end{array} \right] + \left[ \begin{array} { l } { R _ { c a n e r a } } \\ { G _ { c a n e r a } } \\ { B _ { c a n e r a } } \end{array} \right] } \end{array}
```

$$

### 3.2 关键参数

ISP的参数见IQ json文件的ccm\_calib节点。

### 使能控制及模式选择

在control节点下


| 参数 | 描述 |
| --- | --- |
| enable | 色彩校正使能开关，1表示使能；取值0或1 |
| mode | 色彩校正矩阵模式；取值CALIB_CCM_MODE_AUTO或CALIB_CCM_MODE_MANUAL,CALIB_CCM_MODE_MANUAL表示使用手动色彩校正CALIB_CCM_MODE_AUTO表示使用自动色彩校正 |
| wbgain_tolerance | 色彩校正白平衡增益变化容忍度：白平衡增益统计值差值小于该阈值时，可认为白平衡增益满足色彩校正的稳定条件；取值范围0.0-1 |
| gain_tolerance | 色彩校正曝光增益变化容忍度：曝光增益统计值差值小于该阈值时，可认为曝光增益满足色彩校正的稳定条件；取值范围0.0-1 |

### 亮度-饱和度调节

在lumaCCM节点下

### 像素亮度相关饱和度调节


| 参数 | 描述 |
| --- | --- |
| RGB2Y_para | 由RGB到Y的计算系数，7bit定点化的值；整数，取值范围[0,128] |
| low_bound_pos_bit | 像素点亮度(Y)-颜色校正(CC)强度之亮度阈值；整数，取值范围[0,10] |
| y_alpha_curve | 像素点亮度(Y)-颜色校正(CC)强度(alpha)之强度，1024表示1倍强度，0表示不校正；整数，取值范围[0,1024] |



图 Y-CcAlpha

### 全局饱和度调整

在gain\_alphaScale\_curve节点下

不同曝光增益(gain)对应不同的校正强度scale，对应节点gain\_alphaScale\_curve下的参数


| 参数 | 描述 |
| --- | --- |
| gain | gain-scale之曝光增益分量，小数，取值大于0 |
| scale | gain-scale之校正强度分量，小数，取值范围[0,1] |

### 手动CCM参数

在manualPara节点下

使用手动CCM参数，需将control节点中的mode参数置为 CALIB\_CCM\_MODE\_MANUAL


| 参数 | 描述 |
| --- | --- |
| ccMatrix | 颜色校正矩阵，由标定工具生成，小数，取值范围[-8,7.992] |
| ccOffsets | R\G\B分量偏移，由标定工具生成，取值范围[-4095-4095] |

### 自动CCM参数

在TuningPara节点下


| 参数 | 描述 |
| --- | --- |
| damp_enable | 色彩校正矩阵平滑功能开关，1表示使用该功能；取值0或1 |

### CCM矩阵计算方式选择

CCM模块设有以下两种CCM矩阵计算方式：

（1）选择 标准白平衡增益与白平衡增益统计值 欧氏距离最小的光源的CCM参数；

（2）使用各个光源的标准白平衡增益与白平衡增益统计值的距离概率作为权重，加权计算CCM矩阵。每个光源的距离概率 prob 计算公式如下：

$$

```
\begin{array} { c } { d i s t = \sqrt { ( R g a i n - a w b G a i n [ 0 ] ) ^ { 2 } * w r + ( B g a i n - a w b G a i n [ 1 ] ) ^ { 2 } * w b } } \\ { { } } \\ { p r o b = e x p ( - \frac { d i s t ^ { 2 } } { \sigma ^ { 2 } } ) } \end{array}
```

$$

其中，\$\$Rgain, Bgain\$\$是白平衡增益统计值，\$\$awbGain\$\$是各个光源的标准白平衡增益，\$\$wr,wb\$\$是\$\$R,B\$\$通道权重，\$\$\sigma\$\$ 为 所有光源的\$\$dist\$\$的标准差。

在illu\_estim节点下


| 参数 | 描述 |
| --- | --- |
| interp_enable | CCM加权计算使能，1表示使能；取值0或1 |

### CCM矩阵加权计算

在illu\_estim节点下


| 参数 | 描述 |
| --- | --- |
| default_illu | 默认光源名，当各光源距离概率相等时，使用默认光源的CCM参数 |
| weightRB | R(G)gain的通道权重，在计算距离概率时将会使用到 |
| prob_limit | 距离概率的下限值，距离概率小于该值的光源将不参与CCM矩阵计算 |
| frame_no | 平滑帧数目，取frame_no帧的距离概率平均值用于CCM矩阵加权计算 |

### CCM选择控制参数

根据白平衡增益自动选择相应光源的参数，某个光源下可配置不同曝光增益(gain)对应不同的饱和度（sat）CCM

在aCcmCof节点下


| 参数 | 描述 |
| --- | --- |
| name | 光源名 |
| awbGain | 光源对应的标准白平衡增益，由标定工具生成，取值大于0 |
| minDist | 光源对应的白平衡增益距离阈值，由标定工具生成，在计算光源距离概率将会使用到，当dist小于该值时，将该光源的prob置为1 |
| matrixUsed | 该光源下将会用到的CCM |
| gains | gains-sat之曝光增益分量，小数，取值大于0 |
| sat | gains-sat之饱和度分量，小数，取值大于0 |

### CCM参数


| 参数 | 描述 |
| --- | --- |
| Name | CCM名字 |
| illumination | 光源名 |
| saturation | 对应的饱和度，由标定工具生成，取值大于等于0 |
| ccMatrix | 颜色校正矩阵，由标定工具生成，小数，取值范围[-8，7.992] |
| ccOffsets | R\G\B分量偏移，由标定工具生成，取值范围[-4095-4095] |

### 3.3 CCM标定

按照《Rockchip IQ Tools Guide ISP2x v1.1》完成CCM标定工作。

### RAW数据采集

### 标定光源选择

七种不同色温的光源：D50、D65、D75、A、CWF、HZ、TL84

### 采集步骤

Step 1. 色卡放置在灯箱背景墙的中心，保证左右两侧光源均匀；如果项目对颜色要求比较高，也可以在旁边也放入相应的颜色，比如肤色卡，用于确认效果。

Step 2. 调节曝光，使得应用gamma后的色卡各个色块都不能过曝，推荐用自动曝光

Step 3. 拍摄时，调节物距，使得色卡在画面的占比为1/9。

### 标定

### 步骤

Step 1. RAW数据导入以及选取24色区域部分请参考《Rockchip IQ Tools Guide ISP2x v1.1》第四部分第5模块“CCM”。

### Step 2. 配置标定参数

（1）设置gamma：选择相机将会使用的gamma曲线。支持Normal、HDR、Night模式，也支持自定义。

（2）设置色块权重：在6x4的表格中配置色块权重，色块位置与表格中的位置对应。

（3）点击“Calibrate”按钮进行标定，获得CCM。可在Calibrate页面进行手动调节Saturation（饱和度），直到Result中校正完的效果图或色差图满足要求。

### 色差图介绍

根据色差图中标准色块的偏差方向与所在区间，分析出是哪个分量异常，如下：

（1）camera的色块比idea的色块到原点的距离更远，则camera饱和度高比idea高

（2）camera的色块比idea的色块到原点的距离更小，则camera饱和度高比idea低

案例看图：



色块15（红色块）及色块14（绿色）camera饱和度高比idea低，但属于偏差比较小的范畴内色块13（蓝色）偏紫色方向，人眼视觉可能也觉得色块13也偏紫色，所以这种偏差可以接受。

一般要保证13-15色块色块偏差不要太大，这差不多代表了三原色，其他颜色可以从这三个颜色叠加得到。

如果13-15色块，或其他比较关注的颜色块色偏严重，可以增加色块的权重，但需注意兼顾对其他颜色块色偏的影响。

### 注意事项

（1）在识别24色区域时，确保每一个色块的黑边没被选入

（2）调整gamma曲线后可能需要重新标定CCM，所以最好先调好gamma

（3）标定图亮度不合适将会影响标定出的CCM的饱和度特性，过亮的RAW图标定出的CCM饱和度偏低，过暗的RAW图标定出的CCM饱和度偏高

（4）建议客观指标如下，但可以因项目而异，不注重这些客观指标


|  |  |  |  |
| --- | --- | --- | --- |
|  | D65(external) |  | color saturation |
| mean(ΔC) | &lt;10 |  |  |
| max(ΔC) | &lt;20 |  |  |
| mean(ΔE) | &lt;15 |  |  |
|  | T184 ( for internal only ) | color saturation | 110-120% |
| mean(ΔC) | &lt;10 |  |  |
| max(ΔC) | &lt;20 |  |  |
| mean(ΔE) | &lt;12 |  |  |
| Color accuracy | Coolwhite ( for internal only ) | color saturation | 110-125% |
| mean(ΔC)max(ΔC) | &lt;10 |  |  |
| &lt;20 |  |  |  |
| mean(ΔE) | &lt;12 |  |  |
| A light ( for internal only ) | color saturation | 110-120% |  |
| mean(ΔC)max(ΔC) | &lt;10 |  |  |
| &lt;22 |  |  |  |
| mean(ΔE) | &lt;12 |  |  |

### 3.4 颜色调整

### 整体颜色饱和度调整

调整gain\_alphaScale\_curve的参数

scale取值可在[0, 1.0]范围内做适当调整，影响最终的色彩校正强度，scale越小，色彩饱和度越低，反之色彩饱和度增加。

### 调整gains-sat

sat越小，色彩饱和度越低，反之色彩饱和度增加。不同光源可以调不同的参数。

### 增加高饱和度的CCM

当前两点调到最大值时，饱和度还是不够，需要重新标定更高饱和度的CCM，同时要调整gains-sat 里的sat最大值为增加的饱和度。

### 降低暗的像素的色彩饱和度

减小y\_alpha\_curve中的值，以降低暗的像素的色彩饱和度，注意最后一个值需为1024，否则会影响图像中其他亮度的色彩饱和度。

### 某些颜色调整

当完成前面整体颜色饱和度调整后，颜色仍然没有达到预期的效果，可以按如下步骤尝试：

（1）当需要调整颜色与人眼视觉一致时，要确认白平衡是否正确；

（2）当需要调整颜色与对比机一致时，要确认是白平衡是否一致；

（3）当需要调整颜色与对比机一致时，要确认是亮度是否接近

（4）若白平衡确认一致或正确及亮度接近后，颜色还是没有达到预期，则再调整CCM相关参数以达到目的。

### 确认白平衡是否正确

要点：白色物体是否偏色。

方法：

眼睛看，视频中白色物体是否为白色；

抓图，看白色块的R/G/B分量是否相差较大。

### 确认白平衡是否与对比机一致及调整

（1）如果对比机的白平衡比较对，而RK的白色物体偏色较明显，则先通过白平衡模块使白平衡更正确；

（2）如果对比机的白色物体偏色较明显，而RK的白平衡比较对，需区分是因为对比机的白平衡算法缺陷导致，还是对比机色调喜好不同导致；如果是色调喜好不同，可以先通过白平衡模块调整色调使两者一致，或用faststone等工具调整对比机色调与RK的相同；如果是对比机的白平衡算法缺陷导致，可以增加场景中的白点数量，重新抓图，或者用faststone等工具调整对比机色调与RK的相同。

（3）如何区分对比机的白色物体偏色较明显是因为对比机的白平衡算法缺陷导致，还是对比机色调喜好不同导致

a. 若场景只有白色物体且亮度合适时，对比机的白色还是偏色，很大概率上是因为对比机做了色调调整；

b. 否则就是对比机算法缺陷导致；

### 调整亮度与对比机一致

（1）通过调整亮度相关模块（ae ,gamma，dehaze ,hdr）使亮度靠近，允许有一定差距

（2）或通过faststone等工具调整对比机亮度与RK的相同

### 调整CCM

### 重新用工具标定CCM

在24色卡中找到与该颜色最接近的色块，增加该色块的权重，重新标定CCM。

### 案例：

以下左边的色差图中，第6/18色块色偏比较大，对此，可将中性色块（第19-24色块）权重设置成0，将第6色块设置为16，第18色块权重设置为8。另外，为了减少上述调整给其他色块带来的影响，将三原色色块（第13-15色块）权重设置为8，肤色块（第2色块）权重也设置为8，这样得到的结果色差图如下右图，第6/18色块色偏减小。



手动调整CCM

获取RK RGB值

使用RK机器抓取图像，获得RK RGB值

### （1）有对比机时

使用对比机抓取图像，获得目标值，但需要保正与RK的亮度白平衡接近

### （2）无对比机时

用faststone等工具调整RK采集图上的某个关注的颜色，直到该颜色预期相符。





如：调整B分量作为目标值，用fastone将B通道减17，右下所示的绿色是预期的颜色，



比较此时RK的绿色RGB为64 85 90，目标为65 86 69，然后就知道要调整CCM使B分量减小，那么两个绿色就会接近了

（3）24色卡人眼视觉的目标值为：


| No. | Number | sRGB | CIEL*a*b* | Munsell NotationHue Value / Chroma |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R | G | B | 1° | a* | b* |  |  |  |  |  |
| 1. | dark skin |  | 115 | 82 | 68 | 37.986 | 13.555 | 14.059 | 3 YR | 3.7/3.2 |
| 2. | light skin |  | 194 | 150 | 130 | 65.711 | 18.13 | 17.81 | 2.2 YR | 6.47 / 4.1 |
| 3. | blue sky |  | 98 | 122 | 157 | 49.927 | -4.88 | -21.925 | 4.3 PB | 4.95/5.5 |
| 4. | foliage |  | 87 | 108 | 67 | 43.139 | -13.095 | 21.905 | 6.7 GY | 4.2/4.1 |
| 5. | blue flower |  | 133 | 128 | 177 | 55.112 | 8.844 | -25.399 | 9.7 PB | 5.47/6.7 |
| 6. | bluish green |  | 103 | 189 | 170 | 70.719 | -33.397 | -0.199 | 2.5 BG | 716 |
| 7. | orange |  | 214 | 126 | 44 | 62.661 | 36.067 | 57.096 | 5 YR | 6/11 |
| 8. | purplish blue |  | 80 | 91 | 166 | 40.02 | 10.41 | -45.964 | 7.5 PB | 4/10.7 |
| 9. | moderate red |  | 193 | 90 | 99 | 51.124 | 48.239 | 16.248 | 2.5 R | 5/10 |
| 10. | purple |  | 94 | 60 | 108 | 30.325 | 22.976 | -21.587 | 5P | 317 |
| 11. | yellow green |  | 157 | 188 | 64 | 72.532 | -23.709 | 57.255 | 5 GY | 7.1/9.1 |
| 12. | orange yellow |  | 224 | 163 | 46 | 71.941 | 19.363 | 67.857 | 10 YR | 7/10.5 |
| 13. | blue |  | 56 | 61 | 150 | 28.778 | 14.179 | -50.297 | 7.5 PB | 2.9/12.7 |
| 14. | green |  | 70 | 148 | 73 | 55.261 | -38.342 | 31.37 | 0.25 G | 5.4/8.65 |
| 15. | red |  | 175 | 54 | 60 | 42.101 | 53.378 | 28.19 | 5 R | 4/12 |
| 16. | yellow |  | 231 | 199 | 31 | 81.733 | 4.039 | 79.819 | 5Y | 8/11.1 |
| 17. | magenta |  | 187 | 86 | 149 | 51.935 | 49.986 | -14.574 | 2.5 RP | 5/12 |
| 18. | cyan |  | 8 | 133 | 161 | 51.038 | -28.631 | -28.638 | 5B | 5/8 |
| 19. | white (.05*) |  | 243 | 243 | 242 | 96.539 | -0.425 | 1.186 | N | 9.5/ |
| 20. | neutral 8 (.23*) |  | 200 | 200 | 200 | 81.257 | -0.638 | -0.335 | N | 8/ |
| 21. | neutral 6.5 (.44*) |  | 160 | 160 | 160 | 66.766 | -0.734 | -0.504 | N | 6.5/ |
| 22. | neutral 5 (.70*) |  | 122 | 122 | 121 | 50.867 | -0.153 | -0.27 | N | 51 |
| 23. | neutral 3.5 (.1.05*) |  | 85 | 85 | 85 | 35.656 | -0.421 | -1.231 | N | 3.5/ |
| 24. | black (1.50*) |  | 52 | 52 | 52 | 20.461 | -0.079 | -0.973 | N | 21 |

### 调整CCM说明

对比当前RGB和目标RGB值，手动调整CCM，使两者RGB接近。

### （1）CCM调节约束

颜色校正矩阵的公式如下：

$$

```
{ \left[ \begin{array} { l } { { \bar { R } } ^ { t } } \\ { G ^ { t } } \\ { B ^ { t } } \end{array} \right] } = { \left[ \begin{array} { l l l } { \alpha _ { 1 1 } } & { \alpha _ { 1 2 } } & { \alpha _ { 1 3 } } \\ { \alpha _ { 2 1 } } & { \alpha _ { 2 2 } } & { \alpha _ { 2 3 } } \\ { \alpha _ { 3 1 } } & { \alpha _ { 3 2 } } & { \alpha _ { 3 3 } } \end{array} \right] } { \left[ \begin{array} { l } { { \bar { R } } } \\ { { \bar { G } } } \\ { { \bar { B } } } \end{array} \right] }
```

$$

为了保证白平衡不受破坏，参数必须满足条件：

$$

a _ &#123; i 1 &#125; + a _ &#123; i 2 &#125; + a _ &#123; i 3 &#125; = 1

$$

各通道主要来源于原通道的颜色分量，因此必须满足条件：

$$

a _ &#123; i i &#125; \geq 1

$$

同时，尽量使主对角线元素值差异较小，尽量使主对角线以外的元素均为负值。

如果 $\alpha _ &#123; 1 3 &#125;$ 为正数，会导致高饱和度红色偏紫，如果 $\alpha _ &#123; 3 1 &#125;$ 为正数，会导致高饱和度蓝色偏紫。

当 $\alpha _ &#123; 2 1 &#125;$ 为负值时，绝对值越大，校正后的红色的G分量值越小，红色的饱和度越高； $\alpha _ &#123; 2 3 &#125;$ 为负值时，绝对值越大，校正后的蓝色的G分量值越小，蓝色的饱和度越高。

### （2）常见色偏精调总结：

蓝色（红色）偏紫， $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 1 3 &#125; &#125; & &#123; &#123; &#125; \left( \alpha _ &#123; 3 1 &#125; \right) &#125; \end&#123;array&#125;$ 为正数时，需减小R（B）分量，将 $\alpha _ &#123; 1 3 &#125; \mathrm &#123; ~  ~ &#123; ~ \alpha ~ &#125; ~ &#125; ( \alpha _ &#123; 3 1 &#125; )$ 从接近0 的正数改为较小负数；

蓝色（红色）过饱和， $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 2 3 &#125; &#125; & &#123; &#123; &#125; ( \alpha _ &#123; 2 1 &#125; ) &#125; \end&#123;array&#125;$ 为负值时，需增大G分量，可减小 $\begin&#123;array&#125; &#123; r l &#125; &#123; \mathcal &#123; A &#125; _ &#123; 2 3 &#125; &#125; & &#123; &#123; &#125; \left( \boldsymbol &#123; a &#125; _ &#123; 2 1 &#125; \right) &#125; \end&#123;array&#125;$ ）的绝对值；  

紫色偏蓝，需增大R分量，可增大 $\alpha _ &#123; 1 3 &#125;$ ，减小 $\alpha _ &#123; 1 1 &#125;$ 和 $\alpha _ &#123; 1 2 &#125;$ ；或者减小B分量，减小 $\cdot a _ &#123; 3 3 &#125;$ ，增大 $\alpha _ &#123; 3 1 &#125;$ 和 $\alpha _ &#123; 3 2 &#125;$ ；  

红色偏橘，需减小G分量，可减小 $&#123; \bf \nabla &#125; \cdot &#123; \bf &#123; &#123; a &#125; &#125; &#125; _ &#123; 2 1 &#125;$ 并增大 $\boldsymbol &#123; \alpha &#125; _ &#123; 2 2 &#125;$ ；

肤色偏黄绿，需减小G分量，增大B分量，可大幅度减小 $\cdot \alpha _ &#123; 2 2 &#125;$ 和增大 $\alpha _ &#123; 2 3 &#125;$ ，微调 $\alpha _ &#123; 2 1 &#125;$ ，大幅度增大 $\alpha _ &#123; 3 1 &#125;$ 和减小 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; \mathcal &#123; a &#125; &#125; _ &#123; 3 2 &#125;$ ，微调 $a _ &#123; 3 3 &#125;$

调整CCM示例

(1) 案例1 红色偏橘：



使用faststone 调整RGB 发现，减小G分量可以改善偏橘的问题，此时红色塑料片目标RGB值为[212 6379]。



红色框内的红色塑料片偏橘，RGB = [212, 78, 80]，与目标值[212 63 79]相比，G分量偏大。如果经验比较丰富，可以跳过获取用faststone这一步，直接调整CCM减小G分量即可。

$$

```
\begin{array} { r } { ( \tilde { \mathcal { T } } ^ { \prime } = \alpha _ { 2 1 } \bar { \mathcal { R } } + \alpha _ { 2 2 } \tilde { G } + \alpha _ { 2 3 } \bar { \mathcal { B } } \ , } \end{array}
```

$$

原校正系数： $[ a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; ] = [ \phantom &#123; - &#125; 0 . 2 8 5 4 , 1 . 1 4 9 6 , 0 . 1 3 5 8 ]$

由于红色塑料片R分量值最大，因此需要减小 $\alpha _ &#123; 2 1 &#125;$ 的值，为了符合行相加为1的约束，需要减小 $\alpha _ &#123; 2 2 &#125;$ 的绝对值

调整后校正系数： $[ a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; ] = [ - 0 . 3 8 5 , 1 . 2 4 9 7 , 0 . 1 3 5 8 ]$



红色塑料片： $\mathsf &#123; R G B &#125; = [ 2 0 8 , 5 6 , 7 6 ] _ &#123; \bullet &#125;$

(2) 案例2 肤色偏黄绿：



红色框内的肤色偏黄绿，RGB = [216, 174, 124]，其中G分量偏大，B分量偏小；

原校正系数： $\left[ \begin&#123;array&#125; &#123; l &#125; &#123; a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; , a _ &#123; 3 2 &#125; , a _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; - 0 . 3 1 9 2 &#125; & &#123; 1 . 6 9 2 7 &#125; & &#123; - 0 . 3 7 3 5 &#125; \\ &#123; 0 . 0 2 3 9 &#125; & &#123; - 0 . 5 7 3 8 &#125; & &#123; 1 . 5 4 9 9 &#125; \end&#123;array&#125; \right]$ 同案例1，减小G分量，大幅度减小 $&#123; &#123; \cdot &#125; &#125; a _ &#123; 2 2 &#125;$ 和 $\alpha _ &#123; 2 3 &#125;$ 的绝对值，微调 $\alpha _ &#123; 2 1 &#125;$



此时相应位置的肤色：RGB = [212, 169, 124]；

为增大B分量，因为R和G分量值较大，因此大幅度增大 $\alpha _ &#123; 3 1 &#125;$ 和 $\alpha _ &#123; 3 2 &#125;$ 的绝对值，微调 $a _ &#123; 3 3 &#125;$



调整后校正系数： $\left[ \begin&#123;array&#125; &#123; l &#125; &#123; a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; , a _ &#123; 3 2 &#125; , a _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; - 0 . 3 0 0 4 &#125; & &#123; 1 . 6 3 7 5 &#125; & &#123; - 0 . 3 3 7 1 &#125; \\ &#123; 0 . 2 1 2 7 &#125; & &#123; - 0 . 7 2 9 4 &#125; & &#123; 1 . 5 1 6 6 &#125; \end&#123;array&#125; \right]$

此时相应位置的肤色： $\mathsf &#123; R G B &#125; = [ 2 1 4 , 1 6 9 , 1 4 6 ]$

## 4 高级颜色调整-3DLut

### 4.1 CCM VS 3DLut

CCM的任务是使不同光源下的颜色与人眼视觉相近，3DLut的任务是根据喜好去调整个别的颜色。两者对颜色调整的优缺点如下：


|  | CCM | 3DLut |
| --- | --- | --- |
| 优点 | 颜色过渡自然，不容易引人噪声 | 对某个颜色的色调调整及饱和度调整比较容易；对不相近的颜色可以没有影响 |
| 缺点 | 针对某个喜好，修改了CCM，可能会导致其他不相近颜色受到影响；颜色调整比较困难 | 由于当前的采样点数9x9x9偏少，颜色容易过渡不自然，且调整了数值以后会影响像素点的去噪强度，会引入噪声 |

至于选择哪种方案，实际项目中在颜色喜好和过渡及噪声直接做权衡。

### 4.2 功能说明

3维查找表3 dimensional look-up-tables(3DLUT)



图 9x9x9 bypass 3dlut示意

任意一个颜色均能被独立的映射为另外一个值  



图 9x9x9 绿色增强3dlut示意  

RK1109上3D LUT为 $9 \times 9 \times 9$ ，表中没有记录的值可以通过三线性插值得到

### 4.3 关键参数

参数见IQ json文件的lut3d\_calib节点。

### 使能控制及模式选择

在common节点下


| 参数 | 描述 |
| --- | --- |
| enable | 3DLUT使能开关，1表示使能；取值0或1 |
| mode | 3DLUT模式；取值CALIB_Lut3D_MODE_AUTO或CALIB_Lut3D_MODE_MANUAL,CALIB_Lut3D_MODE_MANUAL表示使用手动配置3DLUTCALIB_Lut3D_MODE_AUTO表示使用自动配置3DLUT |

|wbgain\_tolerance| 3DLUT白平衡增益变化容忍度：

白平衡增益统计值差值小于该阈值时，可认为白平衡增益满足3DLUT的稳定条件；

取值范围0.0-1|

|gain\_tolerance | 3DLUT曝光增益变化容忍度：

曝光增益统计值差值小于该阈值时，可认为曝光增益满足3DLUT的稳定条件；

取值范围0.0-1|

### 手动3DLUT参数

在MLut3D节点下

使用手动3DLUT参数，需将common节点中的mode参数置为 CALIB\_3DLUT\_MODE\_MANUAL


| 参数 | 描述 |
| --- | --- |
| look_up_table_r | R通道查找表，取值范围：[0,1023] |
| look_up_table_g | G通道查找表，取值范围：[0,4095] |
| look_up_table_b | B通道查找表，取值范围：[0,1023] |

### 自动3DLUT参数

在ALut3D节点下


| 参数 | 描述 |
| --- | --- |
| damp_en | 3DLUT平滑功能开关，1表示使用该功能；取值0或1 |

### 3DLUT参数


| 参数 | 描述 |
| --- | --- |
| Name | 3DLUT名字 |
| awbGain | 对应的标准白平衡增益，由标定工具生成，取值大于0 |
| gain | gain-alpha之曝光增益分量，小数，取值大于0 |
| alpha | gain-alpha之3DLUT强度分量，小数，取值大于0 |
| look_up_table_r | R通道查找表，取值范围：[0,1023] |
| look_up_table_g | G通道查找表，取值范围：[0,4095] |
| look_up_table_b | B通道查找表，取值范围：[0,1023] |

### 4.4 调整示例

目前RK调整该功能的工具尚未开发，以下为调整效果对比


