---
sidebar_position: 1
---

# Rockchip\_Color\_Optimization\_Guide\_ISP 32\_Lite\_CN

## 前言

概述

本文旨在描述色彩相关模块的调试，主要给使用RkAiq模块进行图像色彩调优的工程师提供帮助。

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3562 | kernel-5.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

ISP调试工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 | 对应工具版本 |
| --- | --- | --- | --- | --- |
| V3.1.0 | 翁涵梅池晓芳 | 2021-01-30 | 初始版本 |  |

### 2.1 功能描述

自动白平衡算法能自动的计算WB gain (R G B通道的白平衡增益)，并将其与RGB通道分别相乘后，使受环境光影响的白色还原成纯白色，保证在各个光线条件下，相机成像色彩跟物体真实的色彩保持一致。当场景存在白点时基于自动检测的白点计算WB gain，当场景不存在白点时通过单纯色方法得到WBgain。色适应模块，对白平衡校正的目标进行调节，使白平衡校正后的图像尽可能与人眼感知的外貌一致。色调调整模块，根据喜好调整整体色调。由硬件的统计和软件的策略构成自动白平衡，如AWB流程图所示



图 AWB 流程

### 2.2 关键参数

ISP21的参数见IQ json文件的wb\_v21节点；

白平衡校正使能及白平衡模式选择

在control节点下


| 名称 | 描述 |
| --- | --- |
| bypass | 取值0或1 0表示做白平衡校正，使用的白平衡增益由mode控制 1表示不执行白平衡校正 |
| mode | 取值CALIB_WB_MODE_AUTO或CALIB_WB_MODE_MANUAL |
|  | CALIB_WB_MODE_MANUAL表示使用手动白平衡增益 CALIB_WB_MODE_AUTO表示使用自动白平衡算法计算白平增益 |

### 手动白平衡参数

### 在manualPara节点下


| 名称 | 描述 |
| --- | --- |
| mode | 取值CALIB_MWB_MODE_CCT或CALIB_MWB_MODE_WBGAIN或CALIB_MWB_MODE_SCENE |
| cfg.wbgain | 取值范围[0.5-3.9]mode == CALIB_MWB_MODE_WBGAIN时，手动白平衡应用该参数 |
| cfg.scene | 取值为CALIB_WB_SCENE_INCANDESCENT（表示A光源）或CALIB_WB_SCENE_FLUORESCENT（表示CWF光源）或CALIB_WB_SCENE_WARM_FLUORESCENT(表示U30光源）或CALIB_WB_SCENE_DAYLIGHT（表示D65光源）或CALIB_WB_SCENE_CLOUDY_DAYLIGHT(表示D50光源）或CALIB_WB_SCENE_TWILIGHT（表示HZ光源）或CALIB_WB_SCENE_SHADE（表示D75光源）mode == CALIB_MWB_MODE_SCENE时，手动白平衡应用该参数 |
| cfg.cct | CCT取值为[0-10000]CCRI取值为[-2,2]，CCRI取值为0时近似为色度图中普朗克轨迹上的光源mode == CALIB_MWB_MODE_CCT时，手动白平衡应用该参数 |

### 几种配置为：

自动白平衡+白平衡校正使能（推荐配置）   

control.bypass = 0;   

control.mode = CALIB\_WB\_MODE\_AUTO;   

白平衡校正不使能   

control.wbBypass = 1;   

手动白平衡+白平衡校正使能   

control.wbBypass = 0;   

control.mode = CALIB\_WB\_MODE\_MANUAL;   

manualPara.mode = CALIB\_MWB\_MODE\_WBGAIN;   

manualPara.cfg.wbgain = [1,1,1,1];

### 自动白平衡参数

接下来的参数均为自动白平衡模式下的参数。在autoPara和autoExtPara节点中。后续的参数均为这两个结构体的成员。

### rawSelectPara

对应于autoPara.rawSelectPara结构体，用于选择进入rawawb统计时的数据来源，推荐配置为frameChooseMode = CALIB\_AWB\_INPUT\_BAYERNR，即选bayer2dnr模块的输出。

hdr模式下用于选择进入rawawb统计的数据来源，共有以下几种：

1. raw\_in\_short---&gt;blc---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

2. raw\_in\_long---&gt;blc---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

3. bay2dnr\_output---&gt;lsc---&gt;rawawb\_statistics

4. hdr\_drc\_output---&gt;rawawb\_statistics

linenar 模式下用于选择进入rawawb统计的数据来源，共有以下几种：

1. raw\_in---&gt;blc---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

2. bay2dnr\_output---&gt;blc1--&gt;offset---&gt;lsc---&gt;rawawb\_statistics

3. hdr\_drc\_output---&gt;rawawb\_statistics

### 其中：

blc指的是主通路的blc(包括blc0和blc1)

blc1指的是主通路的blc1

offset为相对于主通路的blc差异值；

lsc指rawawb通路上的lsc, 该参数同主通路lsc，只可以通过lscBypassEnable去控制是否执行lsc;

raw\_in\_xxx指的是sensor输出的raw；

bay2dnr\_output指是bayer2dnr模块的输出；

hdr\_drc\_output指的是drc模块的输出 ；

autoPara.rawSelectPara结构体成员如下：


| 名称 | 描述 |
| --- | --- |
| frameChooseMode | 取值CALIB_AWB_INPUT_RAW_FIXED、CALIB_AWB_INPUT_RAW_AUTO、CALIB_AWB_INPUT_BAYERNR、CALIB_AWB_INPUT_DRC。CALIB_AWB_INPUT_RAW_FIXED 固定选长帧或短帧的raW，由frameChoose指定；CALIB_AWB_INPUT_RAW_AUTO自动选择长帧或短帧的raw用于白平衡统计；CALIB_AWB_INPUT_BAYERNR 选bayer2dnr模块的输出;CALIB_AWB_INPUT_DRC 选DRC模块的输出； |
| frameChoose | hdr模式且frameChooseMode为CALIB_AWB_INPUT_RAW_FIXED时有效；两帧hdr下：取值为0或1；0 选择短帧（raw_in_short)用于白平衡统计；1 选择长帧（raw_in_long-）用于白平衡统计； |

hdr模式下如果要自动选raw\_in\_xxx中的某一帧，可配置frameChooseMode =CALIB\_AWB\_INPUT\_RAW\_AUTO， frameChoose 无需配置。（该配置优于指定配置raw\_in\_xxx）对于线性模式 frameChooseMode配为CALIB\_AWB\_INPUT\_RAW\_AUTO或CALIB\_AWB\_INPUT\_RAW\_FIXED没有区别，均指选择raw\_in通路。

### blc2ForAwb

前面rawSelectPara章节有介绍了几种统计数据来源，仅通路上有写offset的该功能才会生效，即(a)当frameChooseMode 为 CALIB\_AWB\_INPUT\_RAW\_FIXED 或 CALIB\_AWB\_INPUT\_RAW\_AUTO,(b)或linear模式下frameChooseMode 为CALIB\_AWB\_INPUT\_BAYERNR时;

当该功能生效时，rawawb通路扣除的黑电平为主通路blc+offset;

当主通路上blc扣除的不是标定值（为了解决特殊问题），而对于rawawb而言需要基于标定值去统计，此时务必要参考主体通路blc和标定值去配置offset，除此之外无需使能该功能。

该结构体的成员有：


| 名称 | 描述 |
| --- | --- |
| enable | 取值0或1，对应该功能关闭和启用； |
| offset | 相对于主通路blc的偏差值，分通道，分ISO |
| offset.ISO | 数字增益x模拟增益x50 |
| offset.R_Channel | R通道的偏差取值范围（-4096，4096） |
| offset.Gr_Channel | GR通道的偏差取值范围（-4096，4096) |
| offset.Gb_Channel | GB通道的偏差取值范围（-4096，4096） |
| offset.B_Channel | B通道的偏差取值范围（-4096，4096） |

### limitRange


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度取值范围0-255000 |
| maxR | R通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| minR | R通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |
| maxG | G通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| minG | G通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |
| maxB | B通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| minB | B通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |
| maxY | Y通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| minY | Y通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |

### mainWindow

awb统计主窗口配置对应JSON中的autoPara.mainWindow结构体。推荐使用自动配置模式；对于特殊应用，如广角镜头时四周colorshading 比较重的情况下可以自定义主窗口大小，减少对AWB统计的影响


| 名称 | 描述 |
| --- | --- |
| mode | 取值 CALIB_AWB_WINDOW_CFG_FIXED 或CALIB_AWB_WINDOW_CFG_AUTOCALIB_AWB_WINDOW_CFG_AUTO 自动配置统计主窗口为raw大小，推荐值CALIB_AWB_WINDOW_CFG_FIXED 自定义统计窗口大小 |
| window | mode 为1 时使能window=[h_offset,v_offset,h_size,v_size]，h代表水平方向，v代表垂直方向h_offset,v_offset,h_size,v_size取值为0-1取值为[0，0,1，1]表示使用全窗口，即raw的尺寸 |

### multiWindow

落在子窗口内的点将不进入白点检测，例如配置为人脸框位置，由于这种窗口需实时配置，所以未加入json文件里，可通过api调用配置。

### downScaleMode\*

对应JSON中的autoPara.downScaleMode成员


| 名称 | 描述 |
| --- | --- |
| downScaleMode | 取值CALIB_AWB_DS_4X4 或CALIB_AWB_DS_8X8或CALIB_AWB_DS_16X8 CALIB_AWB_DS_4X4表示 raw 4x4下采样作为AWB 统计模块的输入，水平和 垂直方向的下采样倍数ds_w，ds_h都为4 CALIB_AWB_DS_8X8表示 raw 8x8下采样作为AWB 统计模块的输入，水平和 垂直方向的下采样倍数ds_w，ds_h都为8，默认值 CALIB_AWB_DS_16X8表示 raw16x8下采样作为AWB 统计模块的输入，水 平和垂直方向的下采样倍数ds_w，ds_h分别为16和8 |

### lscBypass

对应JSON中的autoPara.lscBypass成员


| 名称 | 描述 |
| --- | --- |
| IscBypass | 取值0或1； 0 白平衡统计通路的lens shading correction (LSC)不使能; 1 白平衡统计通路的LSC使能； 不影响主ISP通路的LSC模块 |

### blkStatisticsEnable

对应JSON中的autoPara.blkStatisticsEnable成员


| 名称 | 描述 |
| --- | --- |
|  | 取值0或1； |
| blkStatisticsEnable | 0白平衡统计15x15的块统计功能不使能； |
|  | 1白平衡统计15x15的块统计功能使能； |

### blkMeasureMode

对应JSON中的autoPara.blkMeasureMode成员


| 名称 | 描述 |
| --- | --- |
| blkMeasureMode | 取值CALIB_AWB_BLK_STAT_MODE_ALL_V201 或 CALIB_AWB_BLK_STAT_MODE_REALWP_V201; CALIB_AWB_BLK_STAT_MODE_ALL_V201指15x15的块统计块内所有点的 累加值，默认值； CALIB_AWB_BLK_STAT_MODE_REALWP_V201指15x15的块统计块内白点 |

### 硬件的白点检测流程



图 AWB 白点检测流程

如白点流检测程图所示从三个域上去法判断是否是白点


| 名称 | 描述 |
| --- | --- |
| uvDetectionEnable | 取值0或1;0 UV域非白点过滤不使能;1 UV域非白点过滤使能，根据白点条件选择UV域白点； |
| xyDetectionEnable | 取值0或1；0 XY域非白点过滤不使能；1 XY域非白点过滤使能，根据白点条件选择XY域白点； |
| yuvDetectionEnable | 取值0或1;0 YUV域非白点过滤不使能；1 YUV域非白点过滤使能，根据白点条件选择YUV域白点； |

上述三个参数为autoPara结体的成员，当这三个参数都配置为0时，则落在统计窗口内，且亮度符合要求的点都会被当成白点。来不及标定，又想粗略看一下自动白平衡后的效果时，可以这样使用。

### RGB2XY

RGB域到XY域变换参数由标定工具自动生成，对应JSON中autoPara.rgb2TcsPara结构体


| 名称 | 描述 |
| --- | --- |
| pseudoLumWeight | 使不同光源的白点尽量在一条直线上，参数由标定工具生成，取值范围 0~1，不建议调整 |
| rotationMat | 旋转矩阵，使x轴表征黑体辐射色温的变化，y轴表征同温异谱的光源，参 数由标定工具生成，取值范围[-3.99,3.99]，不建议调整 |

XY domain white points detector



图 XY域白点区间

$[ \times 0 , \times 1 , \mathsf &#123; y &#125; 0 , \mathsf &#123; y &#125; 1 ]$


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
| V | UV域白点条件的V坐标,构成一个闭环，如 $\| [ \mathsf &#123; v &#125; 0 , \mathsf &#123; v &#125; 1 \mathsf &#123; v &#125; 2 , \mathsf &#123; v &#125; 3 , \mathsf &#123; v &#125; 0 ]$ ，取值范围[0,255],小数位值只能是0或0.5在标定工具上手动调整生成 |

### RGB2RYUV

RGB到旋转YUV空间的变化参数，对应JSON的autoPara.rgb2RotationYuvMat矩阵

$$

```
\Gamma \mathrm { g b } 2 \mathsf { R o t a t i o n Y u v M a t } = [ \mathsf { u } 0 , \mathsf { u } 1 , \mathsf { u } 2 , \mathsf { u } 0 \mathsf { f f s e t }
```

$$

$$

```
\mathsf { v } 0 , \mathsf { v } 1 , \mathsf { v } 2 , \mathsf { v } 0 \mathsf { f f s e t }
```

$$

$$

\mathsf &#123; y 0 , y 1 , y 2 , y 0 f f s e t &#125; ]

$$


| 名称 | 描述 |
| --- | --- |
| $\mathsf &#123; u &#125; 0 , \mathsf &#123; u &#125; 1 , \mathsf &#123; u &#125; 2 , \mathsf &#123; v &#125; 0 , \mathsf &#123; v &#125; 1 , \mathsf &#123; v &#125; 2 , \mathsf &#123; y &#125; 0 , \mathsf &#123; y &#125; 1 , \mathsf &#123; y &#125; 2$ | 取值范围[-1,1)在标定工具上自动生成精度 $1 / 2 \land 9$ |
| uoffset,voffset,yoffset | 取值范围[-255,254]在标定工具上自动生成精度 $1 / 2 \land 4$ |

RYUV domain white points detector

$( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$ $( \mathsf &#123; y &#125; ^ &#123; \prime &#125; , \mathsf &#123; u &#125; 0 , \mathsf &#123; v &#125; 0 )$



$( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$

对应JSON中autoPara.lightSources.rtYuvRegion的结构体


| 名称 | 描述 |
| --- | --- |
| lineVector | 由 $( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$  得到理论白点 $( \mathsf &#123; y &#125; ^ &#123; \prime &#125; , \mathsf &#123; u &#125; 0 , \mathsf &#123; v &#125; 0 )$  计算所需参数每个分量的取值范围[0,255]，精度为 $1 / ( 2 \land 4 )$ 由标定工具得到不建议调整 |
| disP1P2 | 由 $( \mathsf &#123; y 0 &#125; , \mathsf &#123; u 0 &#125; , \mathsf &#123; v 0 &#125; )$  得到理论白点  $( \mathsf &#123; y &#125; ^ &#123; \prime &#125; , \mathsf &#123; u &#125; 0 , \mathsf &#123; v &#125; 0 )$  计算所需参数每个分量的取值范围[0,5]由标定工具得到不建议调整 |
| thcurve_u | 分段直线u-th的u分量每个分量的取值范围[0,255]，整数注：需满足相邻两个u分量的差为2的幂次方 |
| thcure_th | 分段直线u-th的th分量每个分量的取值范围[0,255]，精度为1/(2^4)注: 分段直线u-th必须为单调递增 |

### 不同光源白点区间权重

对应autoPara.lightSources[i].weight的结构体，不同光源白点区间权重可以随环境亮度变化


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度取值范围0-255000 |
| weight | 取值范围[0,5]某个光源下的白点区间权重 |

### 非白点区间及附加光源白点区间

一般要同时落在XY、UV、YUV的白点区间内的点才会是白点，而有些非白点也可能满足这种情况，且位于区间的中心位置，不好排除出去。这种情况可以在UV或XY空间上增加非白点区间，只要落入该区间的点都会被当成非白点。若存在物体色和其他光源的白点区间重叠时，可以配置权重（0到1之间的值，推荐0.5）以权衡影响和收益。

非白点区间及附加光源白点区间总个数最多为7，且只有前面4个可以用于附加光源白点区间，不同的附加光源白点区间也可以设置不同权重。

对应JSON中的autoPara.extraWpRange参数，




| 名称 | 描述 |
| --- | --- |
| domain | 取值CALIB_AWB_EXTRA_RANGE_DOMAIN_UV或 |
| CALIB_AWB_EXTRA_RANGE_DOMAIN_XY |  |
| CALIB_AWB_EXTRA_RANGE_DOMAIN_UV表示UV域白点区间 |  |
| CALIB_AWB_EXTRA_RANGE_DOMAIN_XY表示XY域白点区间 |  |
|  |  |
| mode | 取值CALIB_AWB_EXCLUDE_WP_MODE或CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODECALIB_AWB_EXCLUDE_WP_MODE表示该range 为非白点区间CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODE表示该range为额外光源的白点区间(ISP21上不支持该模式) |
| window | 配置区间如上图所示[x0,x1,y0,y1]当domain=0时，取值范围为[0,511]，其中1bit为小数位当domain=1时，取值范围为[-8192,8191]，其中10bit为小数位 |
| weightInculde | 用于配置白点区间或非白点区间的权重，权重可以随环境亮度weightInculde.lumaValue变化 |
| weightInculde.weight | (1) 当mode = CALIB_AWB_EXCLUDE_WP_MODE取值[0,1]weight=0表示落入非白点区间内的点将完全被排除weight=1表示落入非白点区间内的点将不会被排除若某个光源下的物体色和其他光源的白点区间重合度高，为了解决该物体色引入的白平衡偏色，可将该物体色圈为非白点区间，mode配置为CALIB_AWB_EXCLUDE_WP_MODE，weight配置为0.5，折中去改善该问题(2) 当mode = CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODE取值[0,5]weight用于配置附加光源的白点区间的权重 |

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
| wpDiffWeightLvSet.ratioSet.weight | 环境亮度为wpDiffWeightLvSet.LvValue时且可信 度高的白点占比值为 wpDiffWeightLvSet.ratioSet.ratioValue时的亮度 权重 每个分量对应一个bin 取值范围[0,1] |

### 分块权重\*

不同块的白点可以配置不同的权重，可以根据实际的应用场合去配置使用，没有特殊需求不建议使用


| 名称 | 描述 |
| --- | --- |
| wpDiffBIkWeiEnable | 该功能使能的开关取值0或10不使能1使能 |
| wpDiffBlkWeight | 5*5块，每块的权重取值范围[0-63]，整数 |

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
| wpNumTh.low | 图上的白点数量阈值WP_THL取值范围0-100000实际的白点数量和WP_THL/100000*totalPixe比较，其中totalPixel = wight * height /ds_w/ds_h，图像宽高为wight，height，水平和垂直方向的下采样倍数分别为ds_w，ds_h |
| wpNumTh.high | 图上的白点数量阈值WP_THH取值范围0-100000实际的白点数量和WP_THH/100000*totalPixel比较 |

### (2)策略wbgain 相关参数

根据以上阈值对环境亮度-白点数量空间进行分区，不同的区间计算白平衡增益的方法为：

② WPType2为过渡带,由WPType3和WPType1的wbgain混合得到；

### ③ WPType1中的wbgain:

如果是第一帧时可能为固定的NightGain或DayGain，也有可能是由单纯色算法算出的WBGain，由环境亮度所在区间决定；否则为前几帧的wbgain加权得到

对应JSON中参数，

### ①　DayGain


| 名称 | 描述 |
| --- | --- |
| defaultDayGainLow | 特别亮日光下的推荐wbgain取值范围[0.5-7.9] |
| defaultDayGainHigh | 普通日光下的推荐wbgain取值范围[0.5-7.9] |
| dayGainLvThSet | 表示dayGainLvThSet_THL和dayGainLvThSet_THH，分别和defaultDayGainLow和defaultDayGainHigh对应。不同光源可以有不同配置取值[0-255000] |
| staWeight | WPType3中的wbgain计算时StaGain_i的权重。不同亮度下对应不同StaGain_权重，与JSON中LvMatrix对应。DayGain_i的权重为100-staWeigthSet。不同光源可以有不同配置。通常情况StaGain的权重都为100效果最优，对于室外蓝天偏红的场景可以通过配置defaultDayGainLow为d65为标准wbgain,defaultDayGainHigh为d50为标准wbgain，且减小改场景亮度下的staWeigth值改善取值[0-100] |

根据环境亮度、dayGainLvThSet、defaultDayGainLow、defaultDayGainHigh即可线性插值得到不同光源的DayGain\_i。用后面讲到的光源权重加权后得到给WPType1区间中的DayGain。

### ②　NightGain


| 名称 | 描述 |
| --- | --- |
| defaultNightGain | 即为前面所述的NightGain，环境亮度低时的推荐wbgain取值范围[0.5-7.9] |
| defaultNightGainWeight | WPType3中的wbgain计算时NightGain的权重，不同亮度下对应不同权重，与JSON中lumaValueMatrix对应。取值范围0-100 |

### ③　SingleColorGain（singleColorProcess）

实现大面积单纯色白平衡的功能，基于场景信息从配置的颜色集合和光源集合中选出颜色和WBGain。目前默认标定参数可以识别的颜色有红绿蓝黄紫。可以根据实际应用场合去增删待选择的颜色集合（colorBlock），及调整待选择的光源集合（lsUsedForEstimation），工具尚未支持该功能，对应JSON中autoExtPara.singleColorGain


| 名称 | 描述 |
| --- | --- |
| enable | 该功能使能的开关 取值0或1 0不使能 |
|  | 1使能 |
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

④　若前几帧有白平衡增益了，则用前几帧加权的wbgain作为WpType3的白平衡增益


| 名称 | 描述 |
| --- | --- |
| weightForNightGainCalc_len | 指定前weightForNightGainCalc_len帧用于加权取值不限，整数 |
| weightForNightGainCalc | 指定前几帧用于加权的权重，第0个位置对应最远一帧的权重，最后一个位置对应最近一帧的权重取值[0-100] |

(3) 光源权重计算相关参数

WpType3内不同光源的概率计算参数

$$

```
\mathcal { P } \Gamma \mathcal { O } \dot { \mathcal { Z } } _ { 3 } = \mathcal { P } r o 3 \mathcal { L } V _ { i } ^ { * } \mathcal { P } r o 3 \mathcal { D } \dot { s } _ { i } ^ { * } \mathcal { P } r o 3 \mathcal { W } \bar { \mathcal { P } } _ { i } ^ { 0 }
```

$$

① $p r o &#123; \dot &#123; \lambda &#125; &#125; \mathscr &#123; D i s &#125; _ &#123; i &#125;$ 距离概率参数

由前一帧的wbgain到各个光源的标准wbgain的欧式距离（gain\_dis）,根据下图分段直线计算得到距离概率



对应JSON中autoExtPara.probCalcDis的结构体


| 名称 | 描述 |
| --- | --- |
| proDis_THL | 图上的距离阈值disTHL取值范围[0-4] |
| proDis_THH | 图上的距离阈值disTHH取值范围[0-4] |

② $p r o &#123; b &#125; L V _ &#123; i &#125;$ 场景亮度概率参数

室外类型的光源其光源的概率为 pout，pout根据图 4- 14亮度-pout曲线计算

室内类型的光源其光源的概率为 $\mathsf &#123; p i n &#125; = 1 \mathsf &#123; - p o u t &#125;$

不能严格区分的光源，如 $\mathsf &#123; | p d &#125; 5 0 = \mathsf &#123; m a x &#125; ( \mathsf &#123; p o u t &#125;$ ，pin)



对应JSON中的参数如下


| 名称 | 描述 |
| --- | --- |
| autoExtPara.probCalcLv.outdoorLumaValThLow | 图上的环境亮度阈值outdoorTHL 取值范围0-255000 |
| autoExtPara.probCalcLv.outdoorLumaValThHigh | 图上的环境亮度阈值outdoorTHH取值范围0-255000 |
| autoPara.lightSources.doorType | 光源属于室内还是室外，不同光源有不同的配置1 表示室内2 表示介于室内和室外之间3表示室外 |

### ③　 场景白点数量概率参数

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



将白平衡增益限制在上图所示红色直线围成的区域内，其中横坐标为相关色温，纵坐标为显色指数，这两个为光源的属性。对应JSON中autoExtPara.wbGainClip的结构体


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
| enable | 室外最低色温限制使能取值0或1，分别代表不使能、使能 |
| outdoor_cct_min | 室外最低色温取值不限 |

### WBGain色调调整

对应JSON中autoExtPara.wbGainAdjust的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 色调调整使能取值0或1，分别代表不使能、使能 |
| ctrlDataSelt | 指定色调调整表的控制量，即lutAll.ctIData取值AWB_CTRL_DATA_LV或AWB_CTRL_DATA_ISOctrIDataSelt=AWB_CTRL_DATA_LV时，表示不同的环境亮度下可以配置不同的lut用于色调调整ctrIDataSelt=AWB_CTRL_DATA_ISO时，表示不同的ISO下可以配置不同的lut用于色调调整 |
| adjDataSelt | 指定色调调整表rgct，bgcri的变量含义取值AWB_GAIN_ADJ_DATA_GAIN或AWB_GAIN_ADJ_DATA_CT;取值为AWB_GAIN_ADJ_DATA_GAIN时，2维lut的两个维度分别为Rgain(白平衡增益之红色通道)，Bgain(白平衡增益之蓝色通道);取值为AWB_GAIN_ADJ_DATA_CT时，2维lut的两个维度分别为CT(相关色温)，CRI(显色指数) |
| lutAll | lutAll中所有成员概述看这里：不同的lutAll.ctIData可以配置不同的lut用于色调调整色调调整通过2维线性插值实现，配置输入的2维表lut_in和输出的2维表lut_out，代入场景中（rgct，bgcri)值即可得到调整后的wbgain值，其中2维表为11行9列的表。因此通过修改lut_out表格中每个位置的（rgct，bgcri)值就可以实现色调调整(参考下面的配置2)lut_out的rgct分量存在lutAll.rgct_lut_out中，lut_out表的bgcri分量存在lutAll.bgcri_lut_out中lut_in的rgct分量和bgcri分量没有直接存下来，通过下面的方式生成：lut_in的rgct分量每一行都是复制lutAll.rgct_in_ds的值，lut_in的bgcri分量的每一列都是复制lutAll.bgcri_in_ds的值（参考下面的配置1） |
| lutAll_len | 指定色调调整表lut的个数 |
| lutAll.ctIData | 色调调整表的控制量ctrIDataSelt=AWB_CTRL_DATA_LV时，表示环境亮度ctrIDataSelt=AWB_CTRL_DATA_ISO时，表示ISO取值范围0-255000 |
| lutAll.rgct_in_ds | 用于生成输入的2维表lut_in，参考前面lutAlI描述有9个元素，从左到右值从小到大若adjDataSelt=AWB_GAIN_ADJ_DATA_GAIN，存rgain的值，取值范围0-8若adjDataSelt=AWB_GAIN_ADJ_DATA_CT，存ct的值，取值范围0-10000 |
| lutAll.bgcri_in_ds | 用于生成输入的2维表lut_in，参考前面lutAIl描述有11个元素，从左到右值从大到小若adjDataSelt=AWB_GAIN_ADJ_DATA_GAIN，存bgain的值，取值范围0-8若adjDataSelt=AWB_GAIN_ADJ_DATA_CT，存cri的值，取值范围-2-4 |
| lutAll.rgct_lut_out | 输出的2维表，参考前面lutAIll描述若adjDataSelt=AWB_GAIN_ADJ_DATA_CT，存ct的值，取值范围0-10000若adjDataSelt=AWB_GAIN_ADJ_DATA_GAIN，存rgain的值，取值范围0-8 |
| lutAll.bgcri_lut_out | 输出的2维表，参考前面lutAIl描述若adjDataSelt=AWB_GAIN_ADJ_DATA_CT，存cri的值，取值范围0-10000若adjDataSelt=AWB_GAIN_ADJ_DATA_GAIN，存bgain的值，取值范围0-8 |

（1）配置1示意（输入和输出相同，即不做调整）：

rgct\_in\_ds配置为，

image-20220816152356787

bgcri\_in\_ds配置为，

image-20220816152446372

rgct\_lut\_out配置为，

image-20220816152647390

bgcri\_lut\_out配置为，

image-20220816152713775

（2）配置2示意（调暖）：

当场景色调调整前的wbgain为（1.8,1,1,1.9）时，rgct\_in\_ds及bgcri\_in\_ds配置同配置1，lut\_out配置如下时，调整后的wbgain为（1.9,1,1,1.8）。rgain=1.8位于rgct\_in\_ds的第4和第5个元素之间，bgain=1.9位于bgcri\_in\_ds的第8和第9个元素之间，所以wbgain（1.8,1,1,1.9）落于lutout(4,8),lutout(4,9), lutout(5,8), lutout(5,9)四个顶点组成的矩形区域内，调整任意一个顶点的值均会修改wbgain。

image-20220816154537499

（3）色调调整效果参考下图（中间是原图，上下左右分别为绿紫蓝红色调）

同时增加rgain bgain可以使白平衡正常的图像偏紫

同时减小rgain bgain可以使白平衡正常的图像偏绿

增加rgain, bgain不变或减小可以使白平衡正常的图像偏暖

增加bgain，rgain不变或减小可以使白平衡正常的图像偏蓝


|  |  | Rackchip |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

（4）与之前版本的色调调整相比，可以选择lut表是随iso变还是随环境亮度变，及lut表里的数据内容是rgain,bain还是ct,cri。

### wbGain偏移

对应JSON中autoExtPara.wbGainOffset的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 使能开关取值0或1，分别代表不使能、使能 |
| offset | wbgain与offset相加，对应R GR GB B通道的偏移取值范围由wbgain与offset相加值确定，即wbgain与offset相加后范围在\[0,4\](ISP20),wbgain与offset相加后范围在\[0,8\](其他) |

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
}
else if (*wbGainDampFactor > dFMax) {
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
| LvlIRsize | 记录几帧的环境亮度取值范围0-255 |
| LvVarTh | 用于判断wbGainDampFactor是否要变化的环境亮度方差阈值取值范围0-255000 |

### 其他

### tolerance


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度，取值范围[0-255000]，参考后面的lumaValueMatrix来配置 |
| toleranceValue | 阈值，取值范围[0-1] |
| lumaValue_len/toleranceValue_len | 相等，对应配置的个数取值范围不限 |

### runInterval


| 名称 | 描述 |
| --- | --- |
| lumaValue | 环境亮度，取值范围[0-255000]，参考后面的lumaValueMatrix来配置 |
| intervalValue | 帧数，取值范围[0-255] |
| lumaValue_len/intervalValue_len | 相等，对应配置的个数取值范围不限 |

### smartRun


| 名称 | 描述 |
| --- | --- |
| enable | 环境亮度，取值范围[0-255000]，参考后面的lumaValueMatrix来配置 |
| cfg | 阈值，不同环境亮度可配置不同阈值 |
| cfg.lumaValue | 环境亮度，取值范围[0-255000] |
| cfg.lvVarTh | 环境亮度变化相关阈值，取值范围[0,1]，推荐值0.001 |
| cfg.wbgainAlgDiffTh | awb算法的wbgain阈值，取值范围[0,4]，推荐值0.005 |
| cfg.wbgainHwDiffTh | 硬件统计的wbgain阈值，取值范围[0,4]，推荐值0.05 |

### lumaValueMatrix

对应JSON中autoExtPara.lumaValueMatrix的数组


| 名称 | 描述 |
| --- | --- |
| lumaValueMatrix | 将环境亮度划分为15个等级，每一级的起始环境亮度值取值范围0-300000 |

### 白平衡收敛判断

对应JSON中autoExtPara.converged的结构体


| 名称 | 描述 |
| --- | --- |
| varThforUnDamp | 白平衡收敛阈值；几帧内由AWB策略算出的白平衡增益（所有通道）差值的平均小于阈值varThforUnDamp时，且几帧内平滑后的白平衡增益(所有通道)差值的平均小于varThforDamp时认为白平衡收敛；其中帧数由weightForNightGainCalc_len配置取值范围0.0-1；推荐值0.06 |
| varThforDamp | 参数含义及取值范围同上推荐值0.03 |

### 中框、大框、附件框白点选择参数

对应JSON的autoExtPara.xyRegionStableSelection节点


| 名称 | 描述 |
| --- | --- |
| enable | 中框、大框、附加白点框选择结果稳定的功能开关 |
| xyTypeListSize | xyRegionSize和LvVarTh用于稳定选框的结果，xyTypeListSize帧内选投票比较多的框，作为最终的结果，且LvlIRsize(见&quot;WBGain平滑“章节)帧内环境亮度的方差小于varianceLumaTh时，不更新选框的结果，即前一帧用什么框，后面一帧一直都用这个框。取值范围0-1000; |
| varianceLumaTh | 见上面一行描述；取值范围0-1000; |
| wpNumTh | 配置随环境亮度变化的配置，由这些配置线性插值得到阈值 |
| wpNumTh.lumaValue | 环境亮度；取值范围0-255000 |
| wpNumTh.forBigType | 白点数量和forBigType/100000*totalPixel比较取值范围0-100000 |
| wpNumTh.forExtraType | 实际的白点数量和forExtraType/100000*totalPixel比较取值范围0-100000 |

xyRegionSize =0 或varianceLumaTh= 0，将每帧都去应用当前帧信息对应的选框结果。

```
if(中框白点数量>forBigType/100000*totalPixel){
```

则计算wbgain的白点来自于中框  

```
}else{
```

计算wbgain的白点来自于大框  

```
if(大框白点数量<=forExtraType/100000*totalPixel && 附件白点框里面的白点总数>0){
```

计算wbgain的白点来自于附加白点框  

```
}
}
```

注：

（1）当计算wbgain的白点来自于附加白点框时，“分区策略计算WBGain”章节里面的参数无效

### 启动时awb快速生效


| 名称 | 描述 |
| --- | --- |
| enable | 取值为1，awb快速生效功能开启取值为0，awb快速生效功能关闭 |
| mode | 取值CALIB_AWB_EARLACT_XYREG_AUTO或CALIB_AWB_EARLACT_XYREG_FIXED取值为CALIB_AWB_EARLACT_XYREG_FIXED时 统计的4个光源的白点区间参数由xyRegion指定取值为CALIB_AWB_EARLACT_XYREG_AUTO时，统计的4个光源的白点区间参数aiq会自动获取，基于autoExtPara.lightSources[i].xyRegion的值 |
| xyRegion | 参数含义同autoPara.lightSources.xyRegion，但进行了定点化，即乘1024一般只有CALIB_AWB_EARLACT_XYREG_FIXED时才会用到这部分参数，但是快启项目上需配置该数值给还未启动aiq时使用(即使mode配置为CALIB_AWB_EARLACT_XYREG_AUTO，因为aiq未启动无法自动得到) |

### 2.3 标定

### AWB标定基本原理

主要是标定Raw在XY、UV、YUV的白点条件,单纯色算法参数及标准光源下的白平衡增益

### AWB标定的raw图要求

Raw图采集时需要准备环境如下：

①　设备：x-rite 24色卡，灯箱

②　调整曝光参数,使色卡中最亮的白色块的最大值为[150-240]，在这个范围内越亮越好

③　色卡占画面1/9以上

依次在A,CWF,D50，D65，D75，HZ,TL84光源下拍摄x-rite 24色卡，解完马赛克的示意图如下：



### AWB标定工具的界面说明

### (1)AWB主界面示意



(2) 标定的时候主要是调整UV、XY域的白点边界，及YUV域的TH值



UV、XY域调整白点区间操作说明  

a) 在坐标系中用鼠标拖动白点条件的四角以调整位置和白点区间大小  

b) 在坐标系中鼠标拖动空白区域，可以拖动整个白点区间  

c) 使用滚轮放大缩小查看  

(3) Exclude WPC Range面板可用于增加非白点区间和额外光源白点区间。  

(4) 单击“AWB主界面”上的“ AWB Simulaton”按钮将弹出下面界面。AWB Simulaton 用于对raw图进行白点检测，统计白点增益及个数











### AWB标定步骤

(1) AWB标定时需完成BLC和LSC的标定

(2) 单击Load Raw Files导入A,CWF,D50，D65，D75，HZ,TL84下的raw图（推荐标定这七个光源的raw图）

(3) 单击Find Chart 识别色卡



①　依次单击第1块，第6块，第19块，第20块

②　单击FindChart 会批量识别所有光源的色卡色块，如下所示（显示最后一个光源的白点检测结果）





(4) 单击Calibrate ，得到如下初始的白点条件及其他参数  






| Light NamesA | uo | U154 | U270 | U378 | U4110 | U5142 |
| --- | --- | --- | --- | --- | --- | --- |
| 50 |  |  |  |  |  |  |
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

(5) 单击AWB Simulaton ,依次导入A,CWF,D50，D65，D75，HZ,TL84下的raw图查看白点检测的准确性

(6) 修改UV域或XY域的框或YUV的TH使各个光源下色卡的白点检测更准确

(7) 单击Save

(8) 重复（5）\~（7）直到各个光源的白点检测都比较合理。

(9) 注意事项：

①　调整边界尽量使白点在框里面，非白点在框外（一般做不到）

②　所有黑体轨迹上光源的中框围成的区间在x方向连续（三种线型表示三个大小的框，当前版本没有小框）

错误示范（大框的区间是紧连的，但是中框之间有间隔，如下箭头所示）：



正确示范：



③　a和hz光源在XY域的Y方向上可以紧凑一些，d50 d65XY域的Y方向上可以放宽一些

④ 色温差不多的光源围成的中、大框区间在y方向上连续（CWF和TL84）

⑤　所有光源在UV域围成的区间没有断开的部分

⑥　不同光源边界可以重叠，但不要同时在XY和UV空间都重叠

⑦　参考XY空间划分UV空间，以排除非白点

如圈出来的D75光源第7块落在hz范围内，将会被识别为白点







重新调整后，D75光源第7块B在xy和uv空间上不在同一光源内，不会被识别为白点

⑧　当非白点落在XY和UV的白点区间里，还可以通过调小YUV域的TH排除，或者增加非白点区间排除。

⑨ 当白点落在XY和UV的白点区间里，但仍然不是白点时，可能是因为超过亮度范围被排除了，或者落在非白点区间内，或者是因为小于TH 而没有落在YUV域的白点区间里

### AWB标定参数效果验证

依次导入标定的图，进行白点检测，优先保证低漏检率，适当降低误解率

最终白点条件：



白点检测结果为：

A光



CWF:





D65  

D75

Preview  



HZ  



TL84



### 2.4 常见问题定位

为了解决白平衡异常的问题，通常需要抓log和抓raw分析原因，通过修改白点条件或修改策略参数来解决。

抓log

方式1 ，在启动前将log等级设置为export persist\_camera\_engine\_log=0x2ff4，串口和adb上将会打印相关的awblog

方式2，连接工具后一次单击这三个地方，会弹出一个log框，稍等片刻awblog将显示出来

工具上log显示如下（与方式1显示差不多）：

AWB log 解读(以串口或adb打印的log为例)

(1) 控制及模式的log

[AWB]:XCAM INFO (1782) rk aiq awb algo v201.cpp:1979: AwbInitV201: (enter)   

[AWB]:XCAM INFO (1782) rk\_aiq\_awb\_algo\_v201.cpp:2040: AwbInitV201: (exit)   

[AWB]:XCAM INFO (1782) rk aig awb algo v201.cpp:2070: AwbPrepareV201: (enter)   

[AWB]:XCAM INFO (1782) rk aig awb algo v201.cpp:2148: hdr working mode(0), remosaic cfg,enable (0)   

[AWB]:XCAM INFO (1782) rk\_aiq\_awb\_algo\_v201.cpp:2149: AwbPrepareV201: (exit)   

[AWB]:XCAM INFO (1782) rk\_aiq\_algo\_awb\_itf.cpp:102: -frame id (-1)   

[AWB]:XCAM DEBUG rk\_aiq\_awb\_algo\_v201.cpp:2469: AwbReconfigV201: byPass: 0 mode( 0-manual 1-auto):1   

[AWB]:XCAM INFO (1782) rk\_aiq\_algo\_awb\_itf.cpp:250: processing awb\_gain\_algo (1.905082,1.000000,1.000000,1.978512)   

[AWB]:XCAM INFO (1782) rk\_aiq\_algo\_awb\_itf.cpp:102: -frame\_id (0)

hdr\_working\_mode为0 表示当前为normal模式，否则为hdr模式

byPass 为0 表示白平衡校正使能，为1 表示白平衡校正不使能

mode为0表示当前为手动白平衡模式，为1表示当前为自动白平衡模式

frame\_id为帧id

processing awb\_gain\_algo 为此模块最终输出的wbgain

（2）awb log等级为export persist\_camera\_engine\_log=0x2ff3 可用于一般的问题定位

2: -frame\_id (1)   

68: \*\*\*1th calculate wbgain\*\*\*   

52: AwbGainClip, Input CCT : 5800.018555, CRI : -0.124677   

09: AwbGainClip, Output CCT : 5800.018555, CRI : -0.124677   

09: AwbGainAdjust2, Input CCT : 5800.018555, CRI : -0.124677   

50: AwbGainAdjust2, Output CCT : 5800.018066, CRI : -0.124677   

3:   

7: wbgain s5(after damping) (rggb):(2.146030,1.000000,1.000000,2.072558), awbConverged(0) ,LVValue(6054), WPType(3),df(0.75), frameChoose(0)   

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

runInterval 为隔多少帧跑一次

tolerance 为wbgain的方差变化小于该值时，wbgain将不更新

（3）awb log等级为export persist\_camera\_engine\_log=0x2ff4 可用于白点条件及策略问题定位

tf.cpp:102: -frame\_id (91)   

om1.cpp:868: \*\*\*91th calculate wbgain\*\*\*   

om2.cpp:352: AwbGainClip, Input CCT : 6534.665527, CRI : -0.122040   

p:389:AwbGainClip wb gain clip, because curent cri(-0.122040)&lt; upper bound cri(-0.120000)   

p:407: AwbGainClip, wbgain\_s3 (rggb) (2.319863,1.000000,1.000000,1.746177)   

om2.cpp:409: AwbGainClip, Output CCT : 6534.665527, CRI : -0.120000   

om2.cpp:609: AwbGainAdjust2, Input CCT : 6534.665527, CRI : -0.120000   

p:649: AwbGainAdjust2. wbgain s4(2.319863.1.000000,1.000000,1.746177)   

om2.cpp:650: AwbGainAdjust2, Output CCT : 6534.664551, CRI : -0.120000   

p:847: Global CCT:6524.882812,CCRI:-0.119850,valid:1   

p:860: i11:D65 prob: 0.923094, CCT:6514.593750, CCRI:-0.121243, valid:1   

p:860: i11:D75 prob: 0.076906, CCT:6775.584961, CCRI:-0.131615, valid:1   

p:860: i11:A prob: 0.000000, CCT:0.000000, CCRI:0.000000, valid:0   

p:860: i11:CWF prob: 0.000000, CCT:4577.164551, CCRI:-0.118429, valid:1   

201.cpp:43:   

201.cpp:47: wbgain\_s5(after damping) (rggb):(2.317371,1.000000,1.000000,1.750428), awbConverged(1) ,LVValue(1498), WPType(3),df(0.90), frameChoose(0)   

201.cpp:50: WPNo(normal,big):(12374,12429),vaild wp number in standard light(12282), vaild wp number in extra light(0),   

201.cpp:52: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0, runInterval(0),tolerance(0.000000)   

p:63: temporalDefaultGain for wbGainType3 (rggb):(1.327034,1.000000,1.000000,3.314321), weight (0.000000)   

p:65: wbGainType1 (rggb):(0.000000,0.000000,0.000000,0.000000)   

p:67: wbGainType3(rggb):(2.321654,1.000000,1.000000,1.747155)   

p:70: wbgain s1 (mix wbGainType1 and wbGainType3 ) :(2.321654,1.000000,1.000000,1.747155) is updated (1), weight of wbGainType3   

p:108: A:   

p:112: stategy zesult.gain (xggb):(0.000000.0.000000.0.000000.0.000000)   

p:114: prob\_total(0.000000),prob\_dis(0.056154),prob\_LV(0.142857),prob\_WPNO(0.000000)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(0.000000, 0.000000) WPNo(0)   

p:132: type1: gain (rg,bg):(0.000000,0.000000) WPNo(0)   

p:108: CWF:   

p:112: stategy result.gain (rggb):(1.846224.1.000000.1.000000.2.610467)   

p:114: prob total(0.000000),prob dis(0.148655),prob LV(0.142857),prob wPNo(0.000000)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(1.846224,2.610467) WPNo(18)   

p:132: type1: gain (rg,bq):(1.860870,2.614064) WPNo(20)   

p:108: D50:   

p:112: stategy result.gain (rggb):(2.087728.1.000000.1.000000.2.081820)   

p:114: prob\_total(0.000000),prob\_dis(0.207562),prob\_LV(0.142857),prob\_WPNO(0.000000)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bg):(2.087728,2.081820) WPNo(74)   

p:132: type1: gain (rg,bg):(2.092266,2.077117) WPNo(78)   

p:108: D65:   

p:112: stategy\_result.gain (rggb):(2.316112,1.000000,1.000000,1.755642)   

p:114: prob\_total(0.923094),prob\_dis(0.216764),prob\_LV(0.142857),prob\_WPNO(0.923058)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: gain (rg,bq):(2.316112,1.755642) WPNo(11337)   

p:132: type1: gain (rg,bg):(2.316112,1.755642) WPNo(11337)   

p:108: D75:   

p:112: stategy\_result.gain (rggb):(2.388181,1.000000,1.000000,1.645277)   

p:114: prob\_total(0.076906),prob\_dis(0.216654),prob\_LV(0.142857),prob\_WPNO(0.076942)   

p:116: spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weight(1.000000)   

p:132: type0: qain (rq,bq):(2.388181,1.645277) WPNo(945)   

p:132: type1: gain (rg,bg):(2.389237,1.646780) WPNo(994)   

p:108: HZ:   

n-112. (rggb):(8 000008 8.000000 0 000000 8.000000)

由统计信息type0: gain到最终的processing awb\_gain\_algo经过下面几个步骤：

①

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

③ wbGainTepType1为WpType1算出来的WBGain

④ wbGainType3为WpType3算出来的WBGain，wbWeightType3为权重（WpType1的权重为1-wbWeightType3）

⑤ wbgain\_s1 及weight分别为wbGainTepType1和wbGainType3混合的gain，及wbGainType3所占权重

⑥ stategy\_result.gain 为各个光源下的WBGain

⑦ prob\_total(0.372926),prob\_dis(0.151197),prob\_LV(0.142857),prob\_WPNO(0.383987)分别标示每个光源的总概率，距离概率，亮度概率，白点数量概率

⑨ type0: gain (rg,bg):(1.287584,2.843158) WPNo(7707) 为中框统计的白平衡增益，白点数量

⑩ type1: gain (rg,bg):(1.291619,2.862351) WPNo(8557)为大框统计的白平衡增益，白点数量

### 从log上定位问题

①　若WPNo值比较小且实际场景中有一些白点，需要重新调整白点条件

②　看一下每个光源的statistics gain weigth是否为1，是否有受策略gain的影响

③　看一下wbWeightType3权重是否为1：

如果场景确实白点比较少，但是wbGainType3可能与实际色温更符合，需调整WP\_THL、WP\_THH将当前场景划分到WpType3

其他情况均参考前面两点说明调整

### 抓raw并仿真

当需要重新调整白点条件，或者从Log上定位不出问题的时候，需要抓raw图（推荐参考例2的方式在仿真工具上获取）进行白点检测仿真，及查看各个光源下的白点统计。

### (1) 例1

右边是有问题的场景，左边是抓raw图重新调整了白点条件的效果



操作步骤：

①　抓raw图1

②　打开RKISPCalibrationTool，导入json文件



④　在 AWB Simulation界面上单击Load Image 导入raw图1，图片和白点检测结果会同时更新在界面上，如下所示






| 1024, 1614, 058 | 18.28,2056.30,831.46 | 3.01,4078.57,1754.84 |
| --- | --- | --- |
| 13.15.12 | 27.16.31.32,25.02 | 30.91,35.77,20.62 |
| 217, 209, 184 | 384.35,471.25,326.40 | 365. 76,449.44,309.86 |
| 10.26.16 | 40.32,57.33.35.00 | 27.92.39.39,25.02 |
| 0.0.0 | 0.00,0.00,0.00 | 0.00.0.00.0.00 |
| 073, 923, 306 | 334.70,903.05.319.50 | 6.17,3206.45.1164.55 |
| 808, 1551, 284 | B8. 42, 2435. 73, 474. 4B | 73.15, 3513.90, 620.96 |

可以看出识别的白点非常少，而图确实也比较暗。如下所示，类似圈出来的灰白区域都应该被检测为白点



⑤ 在图像上单击灰白区域，

看一下映射的点是否有在XY、UV的白点区间内，没有的话需要调整白点条件，使其落在区间内；

若即在limitRange范围内，又在XY、UV的白点区间内，但是又没被识别为白点，还需确认YUV 的TH，后面AWB Simulaton界面上也会显示出该点的th , 参考界面上的这个值去调整YUV 的TH；




| □ All | Detected WP Number | RGain | BGain |
| --- | --- | --- | --- |
| ☑A | 17053, 18576, 15794 | 45, 22974.32, 19467.19 | 38,48464.96,41539.59 |
| □ CWF | 10, 12, 8 | 20.53,24.33,16.41 | 23.08,27.63,18.63 |
| □D50 | 72, 118, 55 | 137.98,227.24,104.65 | 120.82,198.23,92.91 |
| □D65 | 8,11, 6 | 17.00,23.30,12.81 | 11.70,16.04,8.85 |
| □D75 | 0,0,0 | 0.00,0.00,0.00 | 0.00,0.00,0.00 |
| HZ | 1626, 1703, 535 | 58.16, 1734.76,528.21 | 4.53,5816.17,1940.03 |
| □ TL84 | 745, 1517, 24 | 114.55,2225.90,40.67 | 817.71,3653.69,53.98 |

### (2)例2（仿真工具界面升级）

a. 在线获取raw

在工具和板子连接后，可单击“Get online Image”获取在线图像，并自动更新仿真结果到界面上，和例1  

相比简化了调试流程，且，其他调试步骤参考例1的④⑤ ⑥

image-20220817104918135

b. 支持查看中框白点，大框白点，附加框内的点，排除框内的点

### c. 计算总的wbgain

image-20230201155238824

可以编辑红色部分影响权重，WP Number修改了，右边的prob会自动更新，Statistics 那一行相应的数据也会更新。

d. 离线仿真blc-lsc-wb-ccm-gamma效果

该功能可用于辅助查看不同wbgain的效果，以指导awb调试；可用于查看应用不同光源lsc的效果，以指导lsc调试； 可用于查看raw图是否有异常，等等。

image-20230201163328454

单击 Run Simulator2 按钮可以得到blc-lsc-wb-ccm-gamma后的效果。应用的blc lsc ccm gamma数据均来自json，且有打印在标定界面的log窗口里。

image-20230201164115240

应用的wbgain来自于中框的wbgain，可以直接编辑该wbgain，重新单击Run Simulator2 更新仿真结果。

### (3) 例3 （yuv th 调优示意）

该示例用于确认白点漏检是否由于yuv th设置不合理导致及调优，步骤如下：

a.确定当前光源是哪个，通过该点落在xy域和uv域的光源区间确定

b. 从AWB Simulator界面上查看该光源对应行的Distance是否大于TH，如果是：

查看该光源对应行的U位于YUV条件对应光源行的哪几列之间，调大其对应的列的th值即可

具体操如下：

如下图所示色卡的22块没有完全被识别为白点，分析原因为此时的D65光源下的distance &gt; th (0.3125&gt;0.1875)导致，


| YHR FBC &amp; LICH SinulatorWFC (W Domain &amp; XY Donain)VPC (YUV Donsin) |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | A | 50 | 54 | 70 | 78 | 110 | 142 |
|  | CWF | 50 | 54 | 70 | 78 | 110 | 142 |
|  | D50 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | D65 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | D75 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | HZ | 50 | 54 | 70 | 78 | 110 | 142 |
|  | TL84 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | A | 0.4 | 0.4 | 0.4 | 0.76 | 1 | 4 |
|  | CWF | 0.4 | 0.4 | 0.4 | 0.76 | 11 | 4 |
| D | D50 | 0.7 | 0.7 | 1 | 2 | 4 | 4 |
| 65 | 0.2 | 0.2 | 0.2 | 0.76 | 11 | 4 |  |
|  | D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
|  | HZ | 2 | 2 | 2 | 2 | 2 | 4 |
|  | TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
|  |  |  |  |  |  |  |  |




| Stats of Point Track Pos: 202,150 |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| R: | 30 | G: | 56 | B: 38 |  |
| T: | 46 | U: | 123 | V: | 116 |
| I: | 13 |  | I: | 7 |  |
| BGain: | 1.8T5 |  | BGain: |  | 1.49007 |
| Light | U_Interp | Th_Interp |  | Distance |  |
| A | 67 |  | 0.3T5 | 0.375 |  |
| CYF | 68 |  | 0.3T5 | 1.875 |  |
| D50 | 69 |  | 1 | 0.1875 |  |
| D65 | 69 |  | 0.18T5 |  | 0.3125 |
| IT5 |  | 69 | 0.1875 |  | 0.25 |
| YZ |  | 65 | 2 |  | 1.4375 |
| TL84 |  | 68 |  | 0.1875 | 0.375 |


| Stats Besult |  |  |  |  |
| --- | --- | --- | --- | --- |
| ☑A11 | N? lunber |  | Rüain | Büain |
| ☑A |  | 0, 0 | 0.000, 1.140 1.578, 1.578 | 0.000, 2.946 |
| ✓ CπF ☑ D50 | 0,0 |  |  | 2.304, 2.304 |
|  | 64, 121 |  | 1.695, 1.735 | 1.701, 1. 741 |
| ☑D65 | 35409, 35439 |  | 1.931, 1.931 | 1.481, 1. 481 |
| ☑ IT5 ☑π | 467, 493 |  | 1.958, 1.966 0.978, 0.978 | 1.394, 1.398 |
|  | 519, 519 |  |  | 2.865, 2.865 |
| TLB4 | 9, 9 |  | 1.383, 1.383 | 2.303, 2.303 |

又因为该点映射到D65光源下的u为60，位于u1（54）和u2（70）之间，所以按如下调大着两列对应的th1和th2阈值即可，从白点检测结果可以看出修改方向是对的。


| A | 50 | 54 | 70 | 78 | 110 | 142 |
| --- | --- | --- | --- | --- | --- | --- |
| CWF | 50 | 54 | 70 | 78 | 110 | 142 |
| D50 | 50 | 54 | 70 | 78 | 110 | 142 |
| D65 | 50 | 54 | 70 | 78 | 110 | 142 |
| D75 | 50 | 54 | 70 | 78 | 110 | 142 |
| HZ | 50 | 54 | 70 | 78 | 110 | 142 |
| TL84 | 50 | 54 | 70 | 78 | 110 | 142 |
| Light Names | Th0 | Th1 | Th2 | Th3 | Th4 | Th5 |
| A | 0.4 | 0.4 | 0.4 | 0.76 | 1 | 4 |
| CWF | 0.4 | 0.4 | 0.4 | 0.76 | 1 | 4 |
| D50 | 0.7 | 0.7 | 1 | 2 | 4 | 4 |
| D65 | 0.2 | 0.4 | 0.6 | 0.76 | 1 | 4 |
| D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| HZ | 2 | 2 | 2 | 2 | 2 | 4 |
| TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |




| Stats of Point Track | Pos: 193,154 |  |  |  |
| --- | --- | --- | --- | --- |
| R: | 29 G: | 54 | B: | 37 |
| Y: | 45 | U: 124 | V: | 117 |
| x: | 20 |  | Y: 6 |  |
| BGain: | 1.87931 | BGain: | 1.48299 |  |
| Light | U_Interp | Th_Interp | Distance |  |
| à | 66 | 0.375 |  | 0.375 |
| CWF | 67 | 0.375 |  | 1.8125 |
| 150 | 68 | 0.9375 |  | 0.25 |
| 165 | 68 | 0.625 |  | 0.3125 |
| 175 | 68 | 0.1875 |  | 0.18T5 |
| 图 |  |  |  |  |
| TL84 | 64 67 | 0.1875 | 2 | 1.375 0.375 |


| Stats Result |  |  |  |
| --- | --- | --- | --- |
| VP Bumber BGain BGain |  |  |  |
| A11 A | 0, 0 | 0.000, 1.140 | 0.000, 2.946 |
| ☑ CπF | 0,0 | 1.578, 1.578 | 2.304, 2.304 |
| 050 | 64, 121 | 1.695, 1.735 | 1. 701, 1.741 |
| ☑D65 | 36175, 36204 | 1.930, 1.930 | 1. 482, 1. 482 |
| DTS | 467, 493 | 1.958, 1.966 | 1.394, 1.398 |
|  | 519, 519 | 0.978, 0.978 | 2.865, 2.865 |
| TL84 |  | 1.383, 1.383 | 2.303, 2.303 |
|  | 9, 9 |  |  |

注：

当用yuv th 去除非白点时，操作步骤与上面类似，只不过此时是减小阈值，但要保证不影响到白点识别。

### 特殊问题举例

(1) 网络摄像头应用里把白平衡设置为自然光模式，导致自动白平衡没有开启，

通过查看log发现当前mode=1 为手动模式

[09:51:39.57935][AWB]:XCAM DEBUG rk\_aiq\_awb\_algo\_v200.cpp:2795: AwbReConfigV200: byPass: 0 mode:1]

更改白平衡模式后可解决这个问题

(2) 标定的时候发现hz a光下白点分布不集中



实际效果如下，白平衡做不对



后面测试发现是因为红外滤光片不合格导致近红外波段没有被截止，通过更换红外滤光片解决。

（3）cc模块的光源估计在来回震荡，导致色彩在震荡

Find result - 143 hits   

Line 5698: [00:02:57.712232][ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50 (2)   

Line 5699: [00:02:57.7122321[ACCMi:XCAM DEBUG rk\~aiσ accm\~alão.cpp:56: wbGain:1.262492,0.988665. is D50 (2)   

Line 5809: [00:02:57.8113491[ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.262492.0.988665. estimation i1luminant is D50 (2)   

Line 5810: [00:02:57.811349][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.262492,0.988665, estimation i1luminant is D50 (2)   

Line 5920: [00:02:58.56126][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50 (2)   

Line 5921: [00:02:58.56126][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.267507,0.983502, estimation i1luminant is D50 (2)   

Line 6031: [00:02:58.155059][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50 (2)   

Line 6032: [00:02:58.155059][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.267507,0.983502, estimation i1luminant is D50 (2)   

Line 6142: [00:02:58.366345][ACCM]:XCAM DEBUG rk\~aiq accm\~algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6143: [00:02:58.366345][ACCM]:XCAM DEBUG rk\~aiq accm\~algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6253: [00:02:58.465620][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6254: [00:02:58.465620][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50 (2)   

Line 6364: [00:02:58.577856][ACCM]:XCAM DEBUG rk aiq accm algo.cpp   

Line 6365: [00:02:58.577856][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp 56: wbGain:1 ,0.979029, illuminant D50 (2)   

Line 6475: [00:02:58.776105][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp 56: wbGain:1.275650,0.975244, estimation illuminant is D65 (3)   

Line 6476: [00:02:58.776105][ACCM]:XCAM DEBUG rk aiq accm algo.cpp D0313   

Line 6586: [00:02:58.987769][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65 (3)   

Line 6587: [00:02:58.9877691[ACCM]:XCAM DEBUG rk aig accm algo.cpp:56: wbGain:1.279142.0.971930. estimation i1luminant is D65 (3)   

Line 6697: [00:02:59.85831][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65 (3)   

Line 6698: [00:02:59.85831][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65 (3)   

Line 6808: [00:02:59.296966][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 6809: [00:02:59.296966][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.282218,0.968997, estimation i1luminant 1s D65 (3)   

Line 6919: [00:02:59.409406][ACCM]:XCAM DEBUG rk\~aiq accm\~algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant 18 D65 (3)   

Line 6920: [00:02:59.409406][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.282218,0.968997, estimation i1luminant is D65 (3)   

Line 7030: [00:02:59.522048][ACCM]:XCAM DEBUG rk\~aiq\~accm\~algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65 (3)   

Line 7031: [00:02:59.522048][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.282218,0.968997, estimation 111uminant 1s D65 (3)   

Line 7141: [00:02:59.719781][ACCM]:XCAM DEBUG rk\~aiq accm\~algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65 (3)   

Line 7142: [00:02:59.719781][ACCM]:XCAM DEBUG rk aiq accm algo.cpp:56: wbGain:1.285019,0.966382, estimation i1luminant is D65 (3)   

Line 7252: [00:02:59.9452111[ACCM]:XCAM DEBUG rk\~aig accm\~algo.cpp:56: wbGain:1.287606,0.963857, estimation illuminant is D65 (3)   

Line 7253: [00:02:59.945211][ACCM]:XCAM DEBUG rk\_aiq\_accm\_algo.cpp:56: wbGain:1.287606,0.963857, estimation i1luminant 1s D65 (3)

通过增加JSON 中tolerance节点中的value值，使wbgain 变化小于这个值时，就不更新，达到稳定的目的。在这个例子中修改xml中参数为

```xml
<tolerance index="1" type="struct" size="[1 1]">
<LV index="1" type="double" size="[1 4]">
[0 64 128 256.0000 ]
</LV>
<value index="1" type="double" size="[1 4]">
[0.05 0.05 0.05 0.05 ]
</value>
</tolerance>
```

## 3 基础颜色调整 CCM

### 3.1 功能描述

CCM标定工具支持对24色卡进行3x3 CCM（aij）的预校正。

$$

\left[ \begin&#123;array&#125; &#123; l &#125; &#123; R _ &#123; c c &#125; &#125; \\ &#123; G _ &#123; c c &#125; &#125; \\ &#123; B _ &#123; c c &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; \alpha _ &#123; 1 1 &#125; &#125; & &#123; \alpha _ &#123; 1 2 &#125; &#125; & &#123; \alpha _ &#123; 1 3 &#125; &#125; \\ &#123; \alpha _ &#123; 2 1 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 2 2 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 2 3 &#125; &#125; \\ &#123; \alpha _ &#123; 3 1 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 3 2 &#125; &#125; & &#123; \mathbf &#123; a &#125; _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] \cdot \left[ \begin&#123;array&#125; &#123; l &#125; &#123; R _ &#123; c o n e r a &#125; &#125; \\ &#123; G _ &#123; c o n e r a &#125; &#125; \\ &#123; B _ &#123; c o n e r a &#125; &#125; \end&#123;array&#125; \right]

$$

支持多组不同色温的CCM，在ISP运行时，可根据IQ参数配置的gain节点，调整全局饱和度或局部饱和度，实现CCM矩阵系数的动态调整。

$$

```
\begin{array} { r } { \left[ \begin{array} { l } { R _ { c c } } \\ { G _ { c c } } \\ { B _ { c c } } \\ { B _ { c c } } \end{array} \right] = a l p h a ^ { * } s c d e ^ { * } \left[ \begin{array} { l l l } { a _ { 1 1 } { \bf - 1 } } & { a _ { 1 2 } } & { a _ { 1 3 } } \\ { a _ { 2 1 } } & { a _ { 2 2 } { \bf - 1 } } & { a _ { 2 3 } } \\ { a _ { 3 1 } } & { a _ { 3 2 } } & { a _ { 3 3 } { \bf - 1 } } \end{array} \right] \cdot \left[ \begin{array} { l } { R _ { c a n e r a } } \\ { G _ { c a n e r a } } \\ { B _ { c a n e r a } } \end{array} \right] + \left[ \begin{array} { l } { R _ { c a n e r a } } \\ { G _ { c a n e r a } } \\ { B _ { c a n e r a } } \end{array} \right] } \end{array}
```

$$

### 3.2 关键参数

ISP的参数见IQ json文件的ccm\_calib\_v2节点。

使能控制及模式选择

在control节点下


| 参数 | 描述 |
| --- | --- |
| enable | 色彩校正使能开关，1表示使能；取值0或1 |
| mode | 色彩校正矩阵模式；取值CALIB_CCM_MODE_AUTO或CALIB_CCM_MODE_MANUAL,CALIB_CCM_MODE_MANUAL表示使用手动色彩校正CALIB_CCM_MODE_AUTO表示使用自动色彩校正 |
| wbgain_tolerance | 色彩校正白平衡增益变化容忍度：白平衡增益统计值差值小于该阈值时，可认为白平衡增益满足色彩校正的稳定条件；取值范围0.0-1;建议值：0.1 |
| gain_tolerance | 色彩校正曝光增益变化容忍度：曝光增益统计值差值小于该阈值时，可认为曝光增益满足色彩校正的稳定条件；取值范围0.0-1；建议值：0.1 |

### 亮度-饱和度调节

在lumaCCM节点下

### 亮度-颜色校正强度调节

对于指定Y区间的像素点，颜色校正强度可进行调整。


| 参数 | 描述 |
| --- | --- |
| RGB2Y_para | 由RGB到Y的计算系数，7bit定点化的值；整数，取值范围[0,128]，不建议调整 |
| asym_enable | 是否启用非对称曲线以进行亮度-颜色校正强度调整取值范围：0或1 |
| y_alp_sym | 对称曲线参数配置，当asym_enable=0时，启用该配置 |
| y_alp_asym | 非对称曲线参数配置，当asym_enable=1时，启用该配置 |

### （1）对称曲线 y\_alp\_sym

可调Y区间为[0, )和(4095- , 4095]，将可调Y区间分别等分成16段，共产生17个y采样点，可在y\_alpha\_curve中配置这些y采样点对应的颜色校正强度alpha值。


| 参数 | 描述 |
| --- | --- |
| highy_adj_en | 是否启用高Y区曲线调整(即图中右侧曲线)；取值范围：0或1 |
| bound_pos_bit | 亮度-颜色校正强度调整曲线的两端亮度区间长度各为2bound_pos_bit;整数，取值范围：[4,10] |
| y_alpha_curve | 亮度-颜色校正强度调整曲线的纵坐标alpha值，递增序列，1024表示1倍强度，0表示不校正；整数，取值范围：[0,1024] |



图 对称曲线Y-CcAlpha

### （2）非对称曲线 y\_alp\_asym

可调Y区间为[0, )和(4095- , 4095]，将可调Y区间分别等分成8段，各产生9个y采样点，可在y\_alpha\_left\_curve和y\_alpha\_right\_curve中配置这些y采样点对应的颜色校正强度alpha值。


| 参数 | 描述 |
| --- | --- |
| bound_pos_bit | 亮度-颜色校正强度调整曲线的左侧亮度区间长度为2bound_pos_bit;整数，取值范围[3,11] |
| right_pos_bit | 亮度-颜色校正强度调整曲线的右侧亮度区间长度为27ight_pos_bit;整数，取值范围[3,11] |
| y_alpha_left_curve | 左侧亮度-颜色校正强度调整曲线的纵坐标alpha值，递增序列，1024表示1倍强度，0表示不校正；整数，取值范围[0,1024] |
| y_alpha_right_curve | 右侧亮度-颜色校正强度调整曲线的纵坐标alpha值，递减序列，1024表示1倍强度，0表示不校正；整数，取值范围[0,1024] |



图 非对称曲线Y-CcAlpha

### 全局饱和度调整

### 在gain\_alphaScale\_curve节点下

不同曝光增益(gain)对应不同的校正强度scale，对应节点gain\_alphaScale\_curve下的参数


| 参数 | 描述 |
| --- | --- |
| gain | gain-scale之曝光增益分量，小数，取值大于0 |
| scale | gain-scale之校正强度分量，小数，取值范围[0,1] |

### 颜色增强调节

在enhCCM节点下

在enh\_ctl中，不同曝光增益(gain)可设置不同强度的颜色增强。


| 参数 | 描述 |
| --- | --- |
| enh_ctl | 颜色增强调节控制参数配置 |
| gains | 曝光增益节点，小数，取值大于0 |
| enh_adj_en | 是否启用CCM颜色增强调整；整数，取值范围：0或 |
| enh_rat_max | 动态范围的最大压缩比限制，大于1，增强饱和度，小于1，降低饱和度小数，取值范围：[0，8]；建议值：增强饱和度[1.1，1.5]，降低饱和度[0.7，1) |
| enh_rgb2y_para | 由RGB到Y的计算系数，用于颜色增强调整，7bit定点化的值；整数，取值范围[0,128]，不建议调整 |

### 手动CCM参数

### 在manualPara节点下

使用手动CCM参数，需将control节点中的mode参数置为 CALIB\_CCM\_MODE\_MANUAL


| 参数 | 描述 |
| --- | --- |
| ccMatrix | 颜色校正矩阵，由标定工具生成，小数，取值范围[-8，7.992] |
| ccOffsets | R\G\B分量偏移，由标定工具生成，取值范围[-4095，4095] |

### 自动CCM参数

### 在TuningPara节点下


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
| frame_no | 平滑帧数目，取frameno帧的距离概率平均值用于CCM矩阵加权计算 |

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
| ccMatrix | 颜色校正矩阵，由标定工具生成，小数，取值范围[-8,7.992] |
| ccOffsets | R\G\B分量偏移，由标定工具生成，取值范围[-4096，4095] |

### 3.3 CCM标定

按照《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》完成CCM标定工作。

### RAW数据采集

### 标定光源选择

七种不同色温的光源：D50、D65、D75、A、CWF、HZ、TL84

### 采集步骤

Step 1. 色卡放置在灯箱背景墙的中心，保证左右两侧光源均匀；如果项目对颜色要求比较高，也可以在旁边也放入相应的颜色，比如肤色卡，用于确认效果。

Step 2. 调节曝光，使得应用gamma后的色卡各个色块都不能过曝，推荐用自动曝光

Step 3. 拍摄时，调节物距，使得色卡在画面的占比为1/9。

### 标定

### 步骤

Step 1. RAW数据导入以及选取24色区域部分请参考《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》4.5章节“CCM标定”。

### Step 2. 配置标定参数

（1）设置gamma：选择相机将会使用的gamma曲线。支持Normal、HDR、Night模式，也支持自定义。

（2）设置色块权重：在6x4的表格中配置色块权重，色块位置与表格中的位置对应。

（3）点击“Calibrate”按钮进行标定，获得CCM。可在Calibrate页面进行手动调节Saturation（饱和度），直到Result中校正完的效果图或色差图满足要求。

### 色差图介绍

根据色差图中标准色块的偏差方向与所在区间，分析出是哪个分量异常，如下：

（1）camera的色块比idea的色块到原点的距离更远，则camera饱和度高比idea高

（2）camera的色块比idea的色块到原点的距离更小，则camera饱和度高比idea低

### 案例看图：



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
|  | T184 (for internal only) | color saturation | 110-120% |
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

### 调整gain\_alphaScale\_curve的参数

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



### 手动调整CCM

获取RK RGB值

使用RK机器抓取图像，获得RK RGB值

### 获取目标RGB值

### （1）有对比机时

使用对比机抓取图像，获得目标值，但需要保正与RK的亮度白平衡接近

### （2）无对比机时

用faststone等工具调整RK采集图上的某个关注的颜色，直到该颜色预期相符。





如：调整B分量作为目标值，用fastone将B通道减17，右下所示的绿色是预期的颜色，



比较此时RK的绿色RGB为64 85 90，目标为65 86 69，然后就知道要调整CCM使B分量减小，那么两个绿色就会接近了

### （3）24色卡人眼视觉的目标值为：


| No. | Number | sRGB | CIEL*a*b* | Munsell NotationHue Value / Chroma |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R | G | B | 1° | a* | b* |  |  |  |  |  |
| 1. | dark skin |  | 115 | 82 | 68 | 37.986 | 13.555 | 14.059 | 3 YR | 3.7/3.2 |
| 2. | light skin |  | 194 | 150 | 130 | 65.711 | 18.13 | 17.81 | 2.2 YR | 6.47 / 4.1 |
| 3. | blue sky |  | 98 | 122 | 157 | 49.927 | -4.88 | -21.925 | 4.3 PB | 4.95/5.5 |
| 4. | foliage |  | 87 | 108 | 67 | 43.139 | -13.095 | 21.905 | 6.7 GY | 4.2 / 4.1 |
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
| 15. | red |  | 175 | 54 | 60 | 42.101 | 53.378 | 28.19 | 5R | 4/12 |
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

（2）常见色偏精调总结：

蓝色（红色）偏紫， $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 1 3 &#125; &#125; & &#123; &#123; &#125; \left( \alpha _ &#123; 3 1 &#125; \right) &#125; \end&#123;array&#125;$ 为正数时，需减小R（B）分量，将 $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 1 3 &#125; &#125; & &#123; &#123; &#125; \left( \alpha _ &#123; 3 1 &#125; \right) &#125; \end&#123;array&#125;$ 从接近0 的正数改为较小负数；

蓝色（红色）过饱和， $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 2 3 &#125; &#125; & &#123; &#123; &#125; ( \alpha _ &#123; 2 1 &#125; ) &#125; \end&#123;array&#125;$ 为负值时，需增大G分量，可减小 $\begin&#123;array&#125; &#123; r l &#125; &#123; . \boldsymbol &#123; \alpha &#125; _ &#123; 2 3 &#125; &#125; & &#123; &#123; &#125; \left( \boldsymbol &#123; \alpha &#125; _ &#123; 2 1 &#125; \right) &#125; \end&#123;array&#125;$ ）的绝对值；

紫色偏蓝，需增大R分量，可增大 $\alpha _ &#123; 1 3 &#125;$ ，减小 $\alpha _ &#123; 1 1 &#125;$ 和 $\alpha _ &#123; 1 2 &#125;$ ；或者减小B分量，减小 $\cdot \alpha _ &#123; 3 3 &#125;$ ，增大 和 $| \alpha _ &#123; 3 2 &#125;$ ；

红色偏橘，需减小G分量，可减小 $&#123; \bf \nabla &#125; \cdot &#123; \bf \nabla &#125; a _ &#123; 2 1 &#125;$ 并增大 $\boldsymbol &#123; a &#125; _ &#123; 2 2 &#125;$ ；

肤色偏黄绿，需减小G分量，增大B分量，可大幅度减小 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; a &#125; _ &#123; 2 2 &#125;$ 和增大 $\alpha _ &#123; 2 3 &#125;$ ，微调 $\alpha _ &#123; 2 1 &#125;$ ，大幅度增大 $\alpha _ &#123; 3 1 &#125;$ 和减小 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; \mathcal &#123; a &#125; &#125; _ &#123; 3 2 &#125;$ ，微调 $a _ &#123; 3 3 &#125;$

调整CCM示例

(1) 案例1 红色偏橘：



使用faststone 调整RGB 发现，减小G分量可以改善偏橘的问题，此时红色塑料片目标RGB值为[212 6379]。



红色框内的红色塑料片偏橘，RGB = [212, 78, 80]，与目标值[212 63 79]相比，G分量偏大。如果经验比较丰富，可以跳过获取用faststone这一步，直接调整CCM减小G分量即可。

$$

```
\begin{array} { r } { ( \tilde { \mathcal { T } } ^ { \prime } = \mathcal { a } _ { 2 1 } \mathcal { R } + \mathcal { a } _ { 2 2 } \tilde { G } + \mathcal { a } _ { 2 3 } \mathcal { B } \ , } \end{array}
```

$$

原校正系数： $[ a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; ] = [ \phantom &#123; - &#125; 0 . 2 8 5 4 , 1 . 1 4 9 6 , 0 . 1 3 5 8 ]$

由于红色塑料片R分量值最大，因此需要减小 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; \mathcal &#123; a &#125; &#125; _ &#123; 2 1 &#125;$ 的值，为了符合行相加为1的约束，需要增大 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; a &#125; _ &#123; 2 2 &#125;$ 的值调整后校正系数： $[ a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; ] = [ - 0 . 3 8 5 , 1 . 2 4 9 7 , 0 . 1 3 5 8 ]$



红色塑料片： $\mathsf &#123; R G B &#125; = [ 2 0 8 , 5 6 , 7 6 ] .$

(2) 案例2 肤色偏黄绿：



红色框内的肤色偏黄绿， $\mathsf &#123; R G B &#125; = [ 2 1 6 , 1 7 4 , 1 2 4 ]$ ，其中G分量偏大，B分量偏小；

原校正系数： $&#123; \left[ \begin&#123;array&#125; &#123; l &#125; &#123; a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; , a _ &#123; 3 2 &#125; , a _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] &#125; = &#123; \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; - 0 . 3 1 9 2 &#125; & &#123; 1 . 6 9 2 7 &#125; & &#123; - 0 . 3 7 3 5 &#125; \\ &#123; 0 . 0 2 3 9 &#125; & &#123; - 0 . 5 7 3 8 &#125; & &#123; 1 . 5 4 9 9 &#125; \\ &#123; 0 . 0 2 3 9 &#125; & &#123; - 0 . 5 7 3 8 &#125; & &#123; 1 . 5 4 9 9 &#125; \end&#123;array&#125; \right] &#125;$ 同案例1，减小G分量，大幅度减小 $\boldsymbol &#123; \alpha &#125; _ &#123; 2 2 &#125;$ 和增大 $\boldsymbol &#123; a &#125; _ &#123; 2 3 &#125;$ ，微调 $\alpha _ &#123; 2 1 &#125;$ ，



此时相应位置的肤色：RGB = [212, 169, 124]；

为增大B分量，因为R分量值较大，因此大幅度增大 $\alpha _ &#123; 3 1 &#125;$ ，确保行和为1，需要减小 $\alpha _ &#123; 3 2 &#125;$ 和 $a _ &#123; 3 3 &#125;$



调整后校正系数： $\left[ \begin&#123;array&#125; &#123; l &#125; &#123; a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; , a _ &#123; 3 2 &#125; , a _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; - 0 . 3 0 0 4 &#125; & &#123; 1 . 6 3 7 5 &#125; & &#123; - 0 . 3 3 7 1 &#125; \\ &#123; 0 . 2 1 2 7 &#125; & &#123; - 0 . 7 2 9 4 &#125; & &#123; 1 . 5 1 6 6 &#125; \end&#123;array&#125; \right]$

此时相应位置的肤色： $\mathsf &#123; R G B &#125; = [ 2 1 4 , 1 6 9 , 1 4 6 ]$

## 4 高级颜色调整 3DLut

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

RK1109上3D LUT为9x9x9，表中没有记录的值可以通过三线性插值得到

### 4.3 关键参数

参数见IQ json文件的lut3d\_calib节点。

### 使能控制及模式选择

在common节点下


| 参数 | 描述 |
| --- | --- |
| enable | 3DLUT使能开关，1表示使能；取值0或1 |
| mode | 3DLUT模式；取值CALIB_Lut3D_MODE_AUTO或CALIB_Lut3D_MODE_MANUAL,CALIB_Lut3D_MODE_MANUAL表示使用手动配置3DLUTCALIB_Lut3D_MODE_AUTO表示使用自动配置3DLUT |
| gain_tolerance | 3DLUT曝光增益变化容忍度：曝光增益统计值差值小于该阈值时，可认为曝光增益满足3DLUT的稳定条件；取值范围0.0-1 |

### 手动3DLUT参数

在MLut3D节点下

使用手动3DLUT参数，需将common节点中的mode参数置为 CALIB\_3DLUT\_MODE\_MANUAL


| 参数 | 描述 |
| --- | --- |
| look_up_table_r | R通道查找表，取值范围：[0,1023] |
| look_up_table_g | G通道查找表，取值范围：[0，4095] |
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
| look_up_table_g | G通道查找表，取值范围：[0，4095] |
| look_up_table_b | B通道查找表，取值范围：[0,1023] |

### 4.4 3DLUT 标定与调整

RKISP 3D-LutTool 基于LAB色彩模型，将 A-B （颜色通道）直角坐标系转换为 C（饱和度）- H（色调）极坐标系，输入支持 jpg/bmp/png/yuv/nv12 格式。如图4.4-2所示，原点 O 饱和度为0，径向朝外饱和度递增，由红色箭头逆时针旋转改变色调。《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》2.6章节 ”3D-LUT工具“介绍了其界面及使用方法。





图4.4-1 增强绿色饱和度





图4.4-2 改变红色色调

### 调整步骤

1. 采集图像，关闭3DLUT及其后置模块（YNR/SHARP/CNR等），为方便观察3DLUT是否引入其他影响，最好采集yuv图像；

2. 导入图像，参照《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》2.6章节 ”3D-LUT工具“说明；

3. 保持白平衡，右键单击中心原点，圆点变为方块即固定成功；

4. 在右侧图像显示界面上单击需要调整的像素点，将会显示在左侧坐标系中；

5. 朝目标点拖动鼠标，注意坐标系中该点附近的点需要做平滑处理；

6. 生成3DLUT参数后，应用参数在色彩丰富的场景，观察色彩是否符合预期。

### 注意

一旦3DLUT前置模块做出调整，特别是影响到色彩，需要重新调整3DLUT。

### 案例

调整人脸肤色：

（1）选择Grid Division（8，12，16），值越大精度越高；在右侧图像显示界面上点击人脸区域，定位到左侧坐标系中；





（2）肤色偏黄绿，需要将肤色定位点向红色色调方向偏移，并降低饱和度，如图中①②标识所示；③标识处做了细微的调整，是为了平滑处理



（3）效果对比：




