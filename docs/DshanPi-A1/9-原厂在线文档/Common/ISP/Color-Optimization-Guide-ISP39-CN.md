---
sidebar_position: 1
---

# Color-Optimization-Guide-ISP39-CN

## 读者对象

本文档（本指南）主要适用于以下工程师：

### ISP调试工程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 | 对应工具版本 |
| --- | --- | --- | --- | --- |
| V1.0.0 | 翁涵梅 | 2024-04-09 | 针对ISP39(RK3576)调整，CCM新增参数hfCCM，详见概述 | AIQ v5.0x5.0; |
| v1.0.0 | 池晓芳 | 2024-07-18 | ISP39/ISP33版本的awb算法及参数描述更新 | AIQ v6.0x6.3-rc2 |

### 2.1 功能描述

自动白平衡算法能自动的计算WB gain (R G B通道的白平衡增益)，并将其与RGB通道分别相乘后，使受环境光影响的白色还原成纯白色，保证在各个光线条件下，相机成像色彩跟物体真实的色彩保持一致。当场景存在白点时基于自动检测的白点计算WB gain，当场景不存在白点时通过单纯色方法得到WBgain。色适应模块，对白平衡校正的目标进行调节，使白平衡校正后的图像尽可能与人眼感知的外貌一致。色调调整模块，根据喜好调整整体色调。由硬件的统计和软件的策略构成自动白平衡，如AWB流程图所示



图 AWB 流程

### 2.2 关键参数

ISP39的参数见IQ json文件的wb节点；

### 白平衡增益控制(wbGainCtrl)

在wbGainCtrl节点下


| 名称 | 描述 |
| --- | --- |
| bypass | 取值0或1 0表示做白平衡校正，使用的白平衡增益由mode控制 |
| opMode | 取值RK_AIQ_OP_MODE_AUTO或RK_AIQ_OP_MODE_MANUALRK_AIQ_OP_MODE_AUTO表示使用自动白平衡算法计算白平增益RK_AIQ_OP_MODE_MANUAL表示使用手动白平衡增益，下面manualPara中的参数才会生效 |
| manualPara.mode | 取值mwb_mode_cct或mwb_mode_wbgain或mwb_mode_scene |
| manualPara.cfg.manual_wbgain | 取值范围[0.5-3.9]mode == mwb_mode_wbgain时，手动白平衡应用该参数 |
| manualPara.cfg.scene_mode | 取值为mwb_scene_incandescent(表示A光源）或mwb_scene_fluorescent(表示CWF光源)或mwb_scene_warm_fluorescent(表示U30光源)或mwb_scene_daylight(表示D65光源)或mwb_scene_cloudy_daylight(表示D50光源)或mwb_scene_twilight(表示HZ光源)或mwb_scene_shade(表示D75光源)mode == mwb_mode_scene时，手动白平衡应用该参数 |
| manualPara.cfg.cct | CCT取值为[0-10000]CCRI取值为[-2,2]，CCRI取值为0时近似为色度图中普朗克轨迹上的光源mode == mwb_mode_cct时，手动白平衡应用该参数 |

### 几种配置为：

自动白平衡+白平衡校正使能（推荐配置）   

wbGainCtrl.bypass = 0;   

wbGainCtrl.opMode = RK\_AIQ\_OP\_MODE\_AUTO;   

白平衡校正不使能   

wbGainCtrl.bypass = 1;   

手动白平衡+白平衡校正使能   

wbGainCtrl.bypass = 0;   

wbGainCtrl.mode = RK\_AIQ\_OP\_MODE\_MANUAL;   

wbGainCtrl.manualPara.mode = mwb\_mode\_wbgain;   

wbGainCtrl.manualPara.cfg.manual\_wbgain = [1,1,1,1];

### 自动白平衡统计相关（awbStats）

在awbStats节点下

hw\_awbCfg\_statsSrc\_mode

对应于awbStats.hw\_awbCfg\_statsSrc\_mode结构体，用于选择进入rawawb统计时的数据来源，推荐配置为hw\_awbCfg\_statsSrc\_mode = awbStats\_drcOut\_mode，即选drc模块的输出。


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_statsSrc_mode | 取值awbStats_chloDegamOut_mode、 awbStats_chl1DegamOut_mode、 awbStats_chl2DegamOut_mode、 awbStats_btnrOut_mode,awbStats_drcOut_mode. awbStats_chloDegamOut_mode 选择raw_in_short的raw用于白 平衡统计； awbStats_chI1DegamOut_mode 选择raw_in_long的raw用于白 平衡统计； awbStats_chl2DegamOut_mode 无效; awbStats_btnrOut_mode 选bayer2dnr模块的输出; awbStats_drcOut_mode 选DRC模块的输出; |

hdr模式下用于选择进入rawawb统计的数据来源，共有以下几种：

1. raw\_in\_short ---&gt;blc---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

2. raw\_in\_long---&gt;blc---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

3. bay2dnr\_output---&gt;lsc---&gt;rawawb\_statistics

4. hdr\_drc\_output---&gt;rawawb\_statistics

linenar 模式下用于选择进入rawawb统计的数据来源，共有以下几种：

1. raw\_in---&gt;blc---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

2. bay2dnr\_output---&gt;offset---&gt;lsc---&gt;rawawb\_statistics

3. hdr\_drc\_output---&gt;rawawb\_statistics

其中：

blc指的是主通路的blc

offset为相对于主通路的blc差异值；

lsc值rawawb通路上的lsc, 该参数同主通路lsc，只可以通过hw\_awbCfg\_lsc\_en去控制是否执行lsc;

raw\_in\_xxx指的是sensor输出的raw；

bay2dnr\_output指是bayer2dnr模块的输出；

hdr\_drc\_output指的是drc模块的输出 ；

### blc2ForAwb

前面hw\_awbCfg\_statsSrc\_mode章节有介绍了几种统计数据来源，仅通路上有写offset的该功能才会生效，即

(b)或linear模式下hw\_awbCfg\_statsSrc\_mode为awbStats\_btnrOut\_mode 时;

当该功能生效时，rawawb通路扣除的黑电平为主通路blc+offset;

当主通路上blc扣除的不是标定值（为了解决特殊问题），而对于rawawb而言需要基于标定值去统计，此时务必要参考主体通路blc和标定值去配置offset,，除此之外无需使能该功能。

该结构体的成员有：


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_blc_en | 取值0或1，对应该功能关闭和启用； |
| offset | 相对于主通路blc的偏差值，分通道，分ISO |
| offset.ISO | 数字增益x模拟增益x50 |
| offset.r_val | R通道的偏差取值范围（-4096，4096） |
| offset.gr_val | GR通道的偏差取值范围（-4096，4096) |
| offset.gb_val | GB通道的偏差取值范围（-4096，4096） |
| offset.b_val | B通道的偏差取值范围(-4096，4096) |

### rgbyLimit


| 名称 | 描述 |
| --- | --- |
| sw_awbCfg_rgbyLimit_en | 取值0或1，对应该功能关闭和启用； |
| cfg.luma_val | 环境亮度取值范围0-255000 |
| cfg.maxR_thred | R通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| cfg.minR_thred | R通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |
| cfg.maxG_thred | G通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| cfg.minG_thred | G通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |
| cfg.maxB_thred | B通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| cfg.minB_thred | B通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |
| cfg.maxY_thred | Y通道值域右边界，推荐值254，最大值255，支持配置小数，精度1/16 |
| cfg.minY_thred | Y通道值域左边界，推荐值3，最小值0，支持配置小数，精度1/16 |

补充环境亮度含义说明：1x曝光gain和1ms曝光积分时间下若场景的平均亮度为255（最大值），则环境亮度为255000；该值越大表示环境越亮。

### mainWin

awb统计主窗口配置对应JSON中的awbStats.mainWin结构体。推荐使用自动配置模式；对于特殊应用，如广角镜头时四周colorshading 比较重的情况下可以自定义主窗口大小，减少对AWB统计的影响


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_win_mode | 取值 awbStats_winSizeFull_mode或awbStats_winSizeFixed_modeawbStats_winSizeFull_mode自动配置统计主窗口为raw大小，推荐值awbStats_winSizeFixed_mode自定义统计窗口大小 |
| hw_awbCfg_win_x | mode 为awbStats_winSizeFixed_mode时使能统计窗口左上顶点坐标之水平分量取值范围：0-图像的宽 |
| hw_awbCfg_win_y | mode 为awbStats_winSizeFixed_mode时使能统计窗口左上顶点坐标之水平分量取值范围：0-图像的高 |
| hw_awbCfg_win_width | mode 为awbStats_winSizeFixed_mode时使能统计窗口的宽取值范围：0-图像的宽 |
| hw_awbCfg_win_height | mode 为awbStats_winSizeFixed_mode时使能统计窗口的高取值范围：0-图像的高 |
| hw_awbCfg_nonROl_en | 取值0或1，对应nonROI功能关闭和启用； |
| nonROI | 落在nonROI窗口内的点将不进入白点检测，例如配置为人脸框位置。最多可以配置4个窗口 |
| nonROI[i].hw_awbCfg_nonROl_x | nonROI窗口左上顶点坐标之水平分量取值范围：0-图像的宽 |
| nonROI[i].hw_awbCfg_nonROl_y | nonROI窗口左上顶点坐标之水平分量取值范围：0-图像的高 |
| nonROI[i].hw_awbCfg_nonROl_width | nonROI窗口的高取值范围：0-图像的宽 |
| nonROI[i].hw_awbCfg_nonROl_height | nonROI窗口的高取值范围：0-图像的高 |

### hw\_awbCfg\_ds\_mode

对应JSON中的awbStats.hw\_awbCfg\_ds\_mode成员


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_ds_mode | 取值awbStats_ds_4x4或awbStats_ds_8x8或awbStats_ds_16x8 awbStats_ds_8x8表示 raw 4x4下采样作为AWB 统计模块的输入，水平 和垂直方向的下采样倍数ds_w，ds_h都为4 awbStats_ds_8x8表示 raw 8x8下采样作为AWB 统计模块的输入，水平 和垂直方向的下采样倍数ds_w，ds_h都为8，推荐值 awbStats_ds_8x8表示 raw 16x8下采样作为AWB 统计模块的输入，水 平和垂直方向的下采样倍数ds w为16，ds h为8 |

### hw\_awbCfg\_lsc\_en

对应JSON中的awbStats.hw\_awbCfg\_lsc\_en成员


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_Isc_en | 取值0或1; |
| 0 白平衡统计通路的lens shading correction (LSC)不使能; |  |
| 1 白平衡统计通路的LSC使能； |  |
| 不影响主ISP通路的LSC模块 |  |

### hw\_awbCfg\_zoneStats\_en

对应JSON中的awbStats.blkStatisticsEnable成员


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_zoneStats_en | 取值0或1； 0白平衡统计15x15的块统计功能不使能； 1白平衡统计15x15的块统计功能使能； |

hw\_awbCfg\_zoneStatsSrc\_mode

对应JSON中的awbStats.blkMeasureMode成员


| 名称 | 描述 |
| --- | --- |
| blkMeasureMode | 取值如下： awbStats_pixAll_mode指15x15的块统计，块内所有点的累加值，默认值； awbStats_norWpLs0_mode指15x15的块统计，块内落在光源0中框白点的 累加值; awbStats_norWpLs1_mode指15x15的块统计，块内落在光源1中框白点的 累加值; awbStats_norWpLs2_mode指15x15的块统计，块内落在光源2中框白点的 累加值; awbStats_norWpLs3_mode指15x15的块统计，块内落在光源3中框白点的 累加值； awbStats_norWpLs4_mode指15x15的块统计，块内落在光源4中框白点的 累加值; awbStats_norWpLs5_mode指15x15的块统计，块内落在光源5中框白点的 累加值; awbStats_norWpLs6_mode指15x15的块统计，块内落在光源6中框白点的 累加值; awbStats_norWpAll_mode指15x15的块统计，块内落在所有光源的中框白 点的累加值； awbStats_bigWpLs0_mode指15x15的块统计，块内落在光源0大框白点的 累加值; awbStats_bigWpLs1_mode指15x15的块统计，块内落在光源1大框白点的 累加值; awbStats_bigWpLs2_mode指15x15的块统计，块内落在光源2大框白点的 累加值; awbStats_bigWpLs3_mode指15x15的块统计，块内落在光源3大框白点的 累加值; awbStats_bigWpLs4_mode指15x15的块统计，块内落在光源4大框白点的 累加值; awbStats_bigWpLs5_mode指15x15的块统计，块内落在光源5大框白点的 累加值; awbStats_bigWpLs6_mode指15x15的块统计，块内落在光源6大框白点的 累加值; awbStats_bigWpAll_mode指15x15的块统计，块内落在所有光源的大框白 |



图 AWB 白点检测流程

如白点流检测程图所示从三个域上去法判断是否是白点


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_uvDct_en | 取值0或1;0 UV域非白点过滤不使能；1 UV域非白点过滤使能，根据白点条件选择UV域白点； |
| hw_awbCfg_xyDct_en | 取值0或1;0 XY域非白点过滤不使能；1 XY域非白点过滤使能，根据白点条件选择XY域白点； |
| hw_awbCfg_rotYuvDct_en | 取值0或1;0 YUV域非白点过滤不使能；1 YUV域非白点过滤使能，根据白点条件选择YUV域白点； |

上述三个参数为awbStats结体的成员，当这三个参数都配置为0时，则落在统计窗口内，且亮度符合要求的点都会被当成白点。来不及标定，又想粗略看一下自动白平衡后的效果时，可以这样使用。

注：isp33上不支持rotYuvDct

### RGB2XY

RGB域到XY域变换参数由标定工具自动生成，对应JSON中awbStats.rgb2xy结构体


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_rgb2xy_coeff | 使不同光源的白点尽量在一条直线上，参数由标定工具生成，取值范围0~1，不建议调整 |
| hw_awbCfg_xyTransMatrix_coeff | 旋转矩阵，使x轴表征黑体辐射色温的变化，y轴表征同温异谱的光源，参数由标定工具生成，取值范围[-3.99,3.99]，不建议调整 |

### RGB2RYUV

RGB到旋转YUV空间的变化参数，对应JSON的awbStats.hw\_awbCfg\_rgb2RotYuv\_coeff矩阵

$$

```
\mathsf { h w _ a w b c f g _ r g b 2 R o t Y u v _ c o e f f = [ u 0 , u 1 , u 2 , u o f f s e t }
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
| $\mathsf &#123; u &#125; 0 , \mathsf &#123; u &#125; 1 , \mathsf &#123; u &#125; 2 , \mathsf &#123; v &#125; 0 , \mathsf &#123; v &#125; 1 , \mathsf &#123; v &#125; 2 , \mathsf &#123; y &#125; 0 , \mathsf &#123; y &#125; 1 , \mathsf &#123; y &#125; 2$ | 取值范围[-1,1)在标定工具上自动生成精度1 $/ 2 \land 9$ |
| uoffset,voffset,yoffset | 取值范围[-255,254]在标定工具上自动生成精度 $1 / 2 \land 4$ |

### 光源相关配置1

XY domain white points detector



图 XY域白点区间

$[ \times 0 , \times 1 , \mathsf &#123; y &#125; 0 , \mathsf &#123; y &#125; 1 ]$


| 名称 | 描述 |
| --- | --- |
| normal | 中框白点区间，取值范围[-8,7.99] |
| normal.ItVtx.hw_awbT_vtxX_val | 对应图上所示x0 |
| normal.ItVtx.hw_awbT_vtxY_val | 对应图上所示y0 |
| normal.rbVtx.hw_awbT_vtxX_val | 对应图上所示x1 |
| normal.rbVtx.hw_awbT_vtxY_val | 对应图上所示y1 |
| big | 大框白点区间，取值范围[-8,7.99],子成员及取值范围含义同normal |

UV domain white points detector



图 UV域白点区间

UV域白点区间如上所示，在四边形框内的为白点，对应JSON的awbStats.lightSources.wpDct\_uvSpace结构体


| 名称 | 描述 |
| --- | --- |
| regionVtx | UV域白点条件的4个坐标,构成一个四边形，取值范围[0,255],小数位精度1/16在标定工具上手动调整白点区间生成 |
| regionVtx[i].hw_awbT_vtxU_val | 图上所示的ui |
| regionVtx[i].hw_awbT_vtxV_val | 图上所示的yi |

UV domain white points detector



对应JSON中awbStats.lightSources.wpDct\_rotYuvSpace的结构体


| 名称 | 描述 |
| --- | --- |
| IsVect.edp | 由（y0，u0，v0)得到理论白点（y，u0，v0）计算所需参数每个分量的取值范围[0,255]，精度为1/(2^4)由标定工具得到不建议调整 |
| hw_awbT_u2WpDistTh_curve | 由（y0，u0，v0)得到理论白点（y&#x27;，u0，v0）计算所需参数分段直线u-th由标定工具得到不建议调整 |
| hw_awbT_u2WpDistTh_curve.idx | 分段直线u-th的u分量每个分量的取值范围[0,255]，整数注：需满足相邻两个u分量的差为2的幂次方 |
| hw_awbT_u2WpDistTh_curve.val | 分段直线u-th的th分量每个分量的取值范围[0,255]，精度为1/(2^4)注: 分段直线u-th必须为单调递增 |

### 中框和大框白点加权

中框和大框加权后的白点统计信息作为该光源的白点统计，环境亮度不同或中框所有光源白点占比不同可配置不同的权重。对应JSON中awbStats.lightSources.bigNorWpWgt的结构体


| 名称 | 描述 |
| --- | --- |
| bigNorWpWgt_lvSet[i].bigNorWpWgt_lvSet.luma_val | 环境亮度取值范围0-255000 |
| bigNorWpWgt_lvSet[i].bigNorWpWgt_lvSet.ratioSet | 中框所有光源白点比例不同可配置不同的权重 |
| awbStats.lightSources[i].bigNorWpWgt_lvSet.ratioSet.norWpNum_rat | 取值范围[0,1]所有光源白点占比 |
| awbStats.lightSources[i].bigNorWpWgt_lvSet.ratioSet.bigWp_wgt | 取值范围[0,1]大框白点的权重为bigWp_wgt，中框的白点权重为1-bigWp_wgt |

### 各个光源白点权重

不同光源白点权重可以随环境亮度变化，偏离黑体轨迹比较远的光源，如cwf可以配置较低的权重


| 名称 | 描述 |
| --- | --- |
| awbStats.sw_awbCfg_lgtSrcWgt_en | 该功能的开关取值0或1对应启用或不启用 |
| awbStats.lightSources[i].IgtSrcWgt.luma_val | 环境亮度取值范围0-255000 |
| awbStats.lightSources[i].IgtSrcWgt.weight | 取值范围[0,1]第i个光源下的白点权重 |

### 非白点区间及附加光源白点区间

一般要同时落在XY、UV、YUV的白点区间内的点才会是白点，而有些非白点也可能满足这种情况，且位于区间的中心位置，不好排除出去。这种情况可以在UV或XY空间上增加非白点区间，只要落入该区间的点都会被当成非白点。若存在物体色和其他光源的白点区间重叠时，可以配置权重（0到1之间的值，推荐0.5）以权衡影响和收益。

非白点区间及附加光源白点区间总个数最多为7，且只有前面4个可以用于额外光源白点区间，不同的附加光源白点区间也可以设置不同权重。

对应JSON中的awbStats.extraWpRange参数，




| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_wpExtraLs_en | 取值0或1，对应额外光源白点区间功能的关闭和启用 |
| hw_awbCfg_wpFiltOut_en | 取值0或1，对应非白点区间功能的关闭和启用 |
| wpRegionSet[i].domain | 取值awbStats_uvWp_mode或awbStats_xyWp_modeawbStats_uvWp_mode表示 UV域白点区间awbStats_xyWp_mode表示 XY域白点区间 |
| wpRegionSet[i].mode | 取值awb_wpFiltOut_mode或awb_wpExtraLs_modeawb_wpFiltOut_mode表示该range为非白点区间awb_wpExtraLs_mode表示该range为额外光源的白点区间 |
| wpRegionSet[i].wpRegion | 配置区间对应上图所示[x0,x1,y0,y1]当domain=0时，取值范围为[0,511]，其中1bit为小数位当domain=1时，取值范围为[-8192,8191]，其中10bit为小数位 |
| wpRegionSet[i].wpRegion.ItVtx.hw_awbT_vtxXU_val | 对应上图所示x0 |
| wpRegionSet[i].wpRegion.ItVtx.hw_awbT_vtxYV_val | 对应上图所示y0 |
| wpRegionSet[i].wpRegion.rbVtx.hw_awbT_vtxXU_val | 对应上图所示x1 |
| wpRegionSet[i].wpRegion.rbVtx.hw_awbT_vtxYV_val | 对应上图所示y1 |
| wgtInculde | 用于配置白点区间或非白点区间的权重，权重可以随环境亮度wgtInculde.luma_val变化 |
| (1) 当mode = awb_wpFiltOut_mode取值[0,1]weight=0表示落入非白点区间内的点将完全被排除weight=1表示落入非白点区间内的点将不会被排除若某个光源下的物体色和其他光源的白点区间重合度高，为了解决该物体色引wgtInculde.weight入的白平衡偏色，可将该物体色圈为非白点区间，mode配置为awb_wpFiltOut_mode，weight配置为0.5，折中去改善该问题(2) 当mode = awb_wpExtraLs_mode取值[0,5]weight用于配置不同额外光源的白点区间的权重 |  |

### 白点统计时不同亮度的像素点不同权重



从图上可以看出合适亮度白点数占比比较多的时候，合适亮度区间（如y为80-224区间）分配的权重更大，而其他暗区或亮区权重比较小。

对应于JSON中的awbStats.luma2WpWgt参数


| 名称 | 描述 |
| --- | --- |
| luma2WpWgt_en | 该功能使能的开关取值0或10不使能1使能 |
| luma2WpWgtEn_th | 该功能使能还要满足该阈值条件 |
| luma2WpWgtEn_th.wpNum_rat | 白点数量比例大于该阈值该功能才使能取值范围[0,1] |
| luma2WpWgtEn_th.lumaVal_th | 环境亮度大于该阈值功能才使能取值范围[0-2555000] |
| luma2WpWgt_ccm | 基于wb和ccm后处理后计算像素亮度，isp39不支持，isp33支持该功能推荐配置d50光源的ccm取值范围[-4.0-4.0] |
| luma2WpWgt_luma | 白点亮度直方图的亮度分段，九个点分为8个bin取值范围[0,255]注：需满足相邻两个分量的差为2的幂次方不建议调整 |
| perfectWpBin | 指定白点亮度直方图上哪个bin的白点为可信度高的白点，即指定合适亮度每个分量对应一个bin取值范围0或10 可信度低的白点1 可信度高的白点 |
| luma2WpWgt_lvSet | 不同环境亮度下不同的可信度高的白点占比可以配置不同的曲线，实际情况由这些曲线进行线性插值 |
| luma2WpWgt_lvSet_len | 环境亮度的个数 |
| luma2WpWgt_lvSet.luma_val | 环境亮度值 |
| luma2WpWgt_lvSet.ratioSet | 环境亮度为luma2WpWgt_lvSet.luma_val时不同的可信度高的白点占比可以配置不同的曲线 |
| luma2WpWgt_lvSet.ratioSet_len | 可信度高的白点比例个数 |
| luma2WpWgt_lvSet.ratioSet.perfectWpNum_rat | 可信度高的白点比例 |
| luma2WpWgt_lvSet.ratioSet.luma2WpWgt_wgt | 环境亮度为luma2WpWgt_lvSet.luma_val时且可信度高的白点占比值为luma2WpWgt_lvSet.ratioSet.perfectWpNum_rat时的亮度权重每个分量对应一个bin取值范围[0,1] |

### 分块权重

不同块的白点可以配置不同的权重，可以根据实际的应用场合去配置使用，没有特殊需求不建议使用

对应于JSON中的awbStats.zoneWgt参数


| 名称 | 描述 |
| --- | --- |
| hw_awbCfg_zoneWgt_en | 该功能使能的开关取值0或10 不使能，默认值1使能 |
| hw_awbCfg_zone_wgt | 15*15块，每块的权重取值范围[0-63]，整数 |

### 启动时awb快速生效


| 名称 | 描述 |
| --- | --- |
| enable | 取值为1，awb快速生效功能开启取值为0，awb快速生效功能关闭，默认值 |
| mode | 取值CALIB_AWB_EARLACT_XYREG_AUTO或CALIB_AWB_EARLACT_XYREG_FIXED取值为CALIB_AWB_EARLACT_XYREG_FIXED时统计的4个光源的白点区间参数由xyRegion指定取值为CALIB_AWB_EARLACT_XYREG_AUTO时，统计的4个光源的白点区间参数aiq会自动获取，基于awbGnCalcStep.lightSources[i].xyRegion的值 |
| xyRegion | 参数含义同autoPara.lightSources.xyRegion一般只有CALIB_AWB_EARLACT_XYREG_FIXED时才会用到这部分参数 |

### 快启项目特殊说明

1103b的快启项目上，awb光源统计数目不能超过4个，同时earlierAwbAct配置没有被使用。（而1106的快启项目对awb光源数目没有限制，同时earlierAwbAct必须配置。）

### 自动白平衡增益计算相关（awbGnCalcStep）

计算自动白平衡增益的总流程  



将选择gnCalc\_method后输出的wbgain定义为wbgns1,这之后的处理过程为： wbgns1 ==&gt;wbgain\_s3（AwbGainClip之后）\Rightarrow wbgain\_s4（AwbGainAdjust，色调调整之后）\Rightarrow wbgain\_s5（wbGainOffset，wbgain偏移后）\Rightarrow wbgain\_s6（damp，平滑之后）

### 自动白平衡增益的方法(gnCalc\_method)


| 名称 | 描述 |
| --- | --- |
| gnCalc_method | 有如下取值： awb_gan_calc_method_auto，基于所有统计自动计算wbain awb_gan_calc_method_zone_mean = 1,灰度世界法 awb_gan_calc_method_wp_nor = 2,使用中框的白点统计信息，不用大框及额 外光源的白点统计信息 awb_gan_calc_method_wp_big = 3,使用大框的白点统计信息，不用中框及额 外光源的白点统计信息 awb_gan_calc_method_wp_ext = 4,使用额外光源框的白点统计信息，不用中 框及大框的白点统计信息 awb_gan_calc_method_sgc = 5,单色算法 |

当gnCalc\_method为awb\_gan\_calc\_method\_zone\_mean或awb\_gan\_calc\_method\_wp\_ext时wbgns1的计算直接来源于相关统计的wbgain；

当gnCalc\_method为awb\_gan\_calc\_method\_sgc 时wbgns1的计算相关参数见后面的“大面积单色wbgain(sgc)”章节；

当gnCalc\_method为awb\_gan\_calc\_method\_auto，awb\_gan\_calc\_method\_wp\_nor 或awb\_gan\_calc\_method\_wp\_big 将会进入下一步的按wpType分区计算WbGain，相关参数见“wpType分区参数（division）”, "wpType分区计算WbGain导图","wpType3 相关参数","wpType1 相关参数"章节；

### wpType分区参数（division）



参数对应JSON中awbGnCalcStep.division结构体


| 名称 | 描述 |
| --- | --- |
| wpNumTh | 不同环境亮度可配置不同的分区阈值，由这些配置线性插值得到实际阈值 |
| wpNumTh.luma_val | 环境亮度取值范围0-255000 |
| wpNumTh.low_rat | 白点数量阈值取值范围0-1白点数量占比，和log中的WpNum比较 |
| wpNumTh.high_rat | 白点数量阈值取值范围0-1白点数量占比，和log中的WpNum比较 |

### wpType分区计算WbGain导图

根据以上阈值对白点数量空间进行分区，不同的区间计算白平衡增益的方法为：



①WPType3中的wbgain(wpgnT3)与不同光源的中框,大框白点统计，偏好wbgain(prf\_wbgain)，额外光源统计，暗环境的wbgain(prefereNgtwbGain)均有关系。

②WPType2为过渡带,由WPType3和WPType1的wbgain混合得到；

③WPType1中的wbgain(wpgnT1): 如果是算法初始帧时可能为refWbgain，也有可能是由单纯色算法算出的sgcWbgain；否则为前几帧的wbgain加权得到或由单纯色算法算出的sgcWbgain

### wpType3 相关参数

光源相关配置2


| 名称 | 描述 |
| --- | --- |
| awbStats.lightSources[i].name | 光源名字,由标定工具生成 |
| awbStats.lightSources[i].doorType_mode | 光源属于室内还是室外，不同光源有不同的配置awb_doorType_indoor 表示室内awb_doorType_ambiguity 表示介于室内和室外之间awb_doorType_outdoor 表示室外由标定工具生成 |
| awbStats.lightSources[i].standard_wbGain | 标定的wbgain，由标定工具生成 |
| awbStats.sw_awbCfg_lgtPrefer_en | 各个光源下偏好wbgain设置的开关，对应取值为1,0；不同环境亮度可以配置不同的preferWgt和prf_wbgain |
| awbStats.lightSources[i].preferWgt.luma_val | 环境亮度取值范围0-255000 |
| awbStats.lightSources[i].preferWgt.weight | 权重，不同环境亮度可以配置不同的preferWgt取值范围0-255000 |
| awbStats.lightSources[i].preferWbGain.luma_val | 环境亮度取值范围0-255000 |
| awbStats.lightSources[i].preferWbGain.prf_wbgain | 权重，不同环境亮度可以配置不同的prf_wbgain取值范围[0.5-3.9] |

暗环境偏好设置(prefereNgtwbGain)

对应JSON中参数 awbGnCalcStep.prefereNgtwbGain


| 名称 | 描述 |
| --- | --- |
| prefereNgtwbGain_en | 暗环境偏好wbgain设置开关，取值1或0分别对应开或关 |
| wbGain | 暗环境偏好wbgain取值范围[0.5-7.9] |
| wgt.preferWgt | 暗环境偏好wbgain的权重可以随环境亮度变化 |
| wgt.preferWgt.luma_val | 环境亮度取值范围0-255000 |
| wgt.preferWgt.weight | 取值范围[0,1]暗环境偏好wbgain的权重，默认值0 |

### 光源权重计算相关参数

不同光源的概率计算参数

$$

```
\mathcal { P } \Gamma \mathcal { O } \dot { \mathcal { Z } } _ { 3 } = \mathcal { P } r o 3 \mathcal { L } V _ { i } ^ { * } \mathcal { P } r o 3 \mathcal { D } \dot { s } _ { i } ^ { * } \mathcal { P } r o 3 \mathcal { W } \bar { \mathcal { P } } _ { i } ^ { 0 }
```

$$

① $p r v &#123; \dot &#123; \lambda &#125; &#125; \bar &#123; \mathcal &#123; D &#125; &#125; \dot &#123; s &#125; _ &#123; i &#125;$ 距离概率参数

由前一帧的wbgain到各个光源的标准wbgain的欧式距离 $( &#123; \mathrm &#123; g a i n &#125; &#125; _ &#123; - &#125; &#123; \mathrm &#123; d i s &#125; &#125; )$ ,根据下图分段直线计算得到距离概率



对应JSON中awbGnCalcStep.lgtSrcProcCal.dist的结构体


| 名称 | 描述 |
| --- | --- |
| low_th | 图上的距离阈值disTHL取值范围[0-4] |
| high_th | 图上的距离阈值disTHH取值范围[0-4] |

② $p r o &#123; b &#125; L V _ &#123; i &#125;$ 场景亮度概率参数

室外类型的光源其光源的概率为 pout，pout根据图 4- 14亮度-pout曲线计算

室内类型的光源其光源的概率为 $\mathsf &#123; p i n &#125; = 1 \mathsf &#123; - p o u t &#125;$

不能严格区分的光源，如 $\mathsf &#123; p d &#125; 5 0 = \mathsf &#123; m a x &#125; ( \mathsf &#123; p o u t &#125;$ ，pin)



对应JSON中awbGnCalcStep.lgtSrcProcCal.dist的结构体


| 名称 | 描述 |
| --- | --- |
| awbGnCalcStep.IgtSrcProcCal.dist.low_th | 图上的环境亮度阈值outdoorTHL 取值范围0-255000 |
| awbGnCalcStep.IgtSrcProcCal.dist.high_th | 图上的环境亮度阈值outdoorTHH 取值范围0-255000 |

### ③　 场景白点数量概率参数

对应JSON中awbGnCalcStep.lgtSrcProcCal.wpNum的结构体


| 名称 | 描述 |
| --- | --- |
| wpNum_rat | 当某个光源白点占比小于wpNum rat，且白点数量占所有光源的白点数比例小于IgtSrc_rat，则该光源白点数量概率为0取值范围0-1 |
| IgtSrc_rat | 同上 |

额外光源权重设置（wbGnExt）

对应JSON中awbGnCalcStep.wbGnExt的结构体

额外光源框统计的白点的权重可以由三个变量控制，先是附加框的wbgain,再是环境亮度


| 名称 | 描述 |
| --- | --- |
| ext_wbGain | 额外光源权重的第一个控制变量wbgain取值范围[0.5-7.9] |
| extWgtGnLv.luma_val | 额外光源权重的第二个控制变量环境亮度取值范围0-255000 |
| extWgtGnLv.extWgtGnRto.bigWpNum_rat | 额外光源权重的第三个控制变量大框的白点占比取值范围0-1 |
| extWgtGnLv.extWgtGnRto.ext_wgt | 额外光源权重为ext_wgt，标准光源的权重为1-ext_wgt取值范围0-1 |

### wpType1相关参数



### 大面积单色wbgain(sgc)

大面积单色白平衡算法作为补充算法，先基于场景信息从配置的颜色集合和光源集合中选出颜色和WBGain(sgcWbgin)，再计算该结果的可靠性（wbWeightSgc）。目前默认标定参数可以识别的颜色有红绿蓝黄紫。可以根据实际应用场合去增删待选择的颜色集合（colorBlock）及调整待选择的光源集合（lsUsedForEstimation）,工具尚未支持该功能，对应JSON中awbGnCalcStep.sgc。

①sgcWbgin计算相关


| 名称 | 描述 |
| --- | --- |
| sgc_en | 该功能使能的开关取值0或10 不使能1使能 |
| mode | 用于约束sgc算法的启用时机，有以下配置awb_sgcCall_initial，sgc算法只可能在初始帧启用，一般项目推荐值awb_sgcCall_always sgc算法在运行期间都启用awb_sgcCall_auto， sgc算法在运行期间都启用，和awb_sgcCall_always有两点区别：a)参与估计的光源除了IsUsedForEstimation集合中的，还可以是wptye3Wbgain; b)会和前一帧可靠wbgain加权；直播机项目推荐值 |
| colorBlock | 待选择的颜色集合，由工具生成 |
| colorBlock_len | colorBlock集合中颜色总数 |
| colorBlock.index | 颜色索引，标记标定时用到的颜色块，修改对效果没有影响，取值范围1-24标定工具默认选择x-rite色卡上的13、14、15、16、5、10 |
| colorBlock.meanC | 该颜色在LCH空间的平均色度值 |
| colorBlock.meanH | 该颜色在LCH空间的平均色调值 |
| colorBlock.ct | 当估计出的颜色和标定颜色的距离超过一定范围，将丢弃该估计结果。距离阈值可以随色温变化。色温，取值范围0-10000 |
| colorBlock.dist_th | 距离，取值范围0-100000 |
| IsUsedForEstimation | 待选择的光源集合，由工具生成mode为awb_sgcCall_auto时，参与估计的光源除了IsUsedForEstimation集合中的，还可以是wptye3Wbgain |
| IsUsedForEstimation_len | IsUsedForEstimation集合中光源总数 |
| IsUsedForEstimation.name | 光源名 |
| IsUsedForEstimation.RGain | 该光源的红色通道白平衡增益取值大于0,小数 |
| IsUsedForEstimation.BGain | 该光源的蓝色通道白平衡增益取值大于0,小数 |
|  | LCH空间的H权重 |
| alpha | 使用默认值即可，不用调整 取值范围[0.0-1.0] |

② wbWeightSgc计算相关  




| 名称 | 描述 |
| --- | --- |
| wgtClrGradX | 所有块估计结果一致性-权重的分段直线的x坐标x值越大表示所有块光源估计出的光源的差异大，相应的y坐标值越小取值范围[0-10000] |
| wgtClrGradY | 所有块估计结果一致性-权重的分段直线的y坐标值越大表示sgc结果的可靠性越高取值范围[0.0-1.0] |
| wgtDistX | 估计颜色和标定颜色的偏差-权重的分段直线的x坐标x值越大表示估计的颜色和标定的颜色偏差大，相应的y坐标值越小取值范围[0-10000] |
| wgtDistCt | wgtDistCt[0],wgtDistCt[1],wgtDistCt[2]对应低中高三个色温值取值范围[0-10000]高中低色温可以配置不同的权重y值，实际场景中使用线性插值得到权重y值，x坐标共用wgtDistX |
| wgtDistLCtY | 低色温（wgtDistCt[0]）时，估计颜色和标定颜色的偏差-权重的分段直线的y坐标值越大表示sgc结果的可靠性越高取值范围[0.0-1.0] |
| wgtDistMCtY | 中色温（wgtDistCt[1]）时，估计颜色和标定颜色的偏差-权重的分段直线的y坐标值越大表示sgc结果的可靠性越高取值范围[0.0-1.0] |
| wgtDistHCtY | 高色温（wgtDistCt[2]）时，估计颜色和标定颜色的偏差-权重的分段直线的y坐标值越大表示sgc结果的可靠性越高取值范围[0.0-1.0] |
| wgtLvX | 亮度-权重的分段直线的x坐标x值越大表示环境亮度大，一般环境亮度较低时相应的y坐标值越小取值范围[0-2550000] |
| wgtLvY | 亮度-权重的分段直线的y坐标值越大表示sgc结果的可靠性越高取值范围[0.0-1.0] |
| wgtWpNumthX | 白点占比-权重的分段直线x坐标x值越大表示场景中的白点越多，相应的y坐标值越小取值范围[0-2550000] |
| wgtWpNumthY | 白点占比-权重的分段直线的y坐标值越大表示sgc结果的可靠性越高取值范围[0.0-1.0] |

### ③ sgc其他


| 名称 | 描述 |
| --- | --- |
| illuEstList_size | sgc估计光源结果稳定性参数，对illuEstList_size帧内估计的光源进行投票，使用投票多的取值范围[0,255] |
| illuMchPrt | 打印应用指定光源后的meanch值，用于debug取值范围[0,255] |
| useSgcResth | wbWeightSgc&gt;useSgcResth时才会使用sgc结果，用于初始帧或帧或者mode=awb_sgcCall_always时取值范围[0.0-1.0] |
| updateDpWbgnTh | mode=awb_sgcCall_auto时，当白点占比大于updateDpWbgnTh，lastawbGainS1来源于上一帧的wbType3Wbgain取值范围[0.0-1.0] |
| updateDpWbgnTh2 | mode=awb_sgcCall_auto时，当wbWeightSgc大于updateDpWbgnTh2，lastawbGainS1来源于上一帧的sgcWbgain取值范围[0.0-1.0] |
| updateEstWbgnTh | mode=awb_sgcCall_auto时,当白点占比大于updateEstWbgnTh，上一帧的wbType3Wbgain将加入光源估计的集合取值范围[0.0-1.0] |

### 前几帧加权的wbgain（hstrGainCalc）

对应json中的awbGnCalcStep.wbGnType1.hstrGainCalc


| 名称 | 描述 |
| --- | --- |
| hstrGainCalc_wgt_len | 指定前weightForNightGainCalc_len帧用于加权取值[1,16] |
| hstrGainCalc_wgt | 指定前几帧用于加权的权重，第0个位置对应最远一帧的权重，最后一个位置对应最近一帧的权重，相加需为1取值[0.0-1.0] |

### 算法初始帧refWbGain

对应json中的awbGnCalcStep.wbGnType1.refWbGain

不同环境亮度可以配置不同的ref\_wbgain，用于算法初始帧。算法初始帧指的是有白点统计后的首帧


| 名称 | 描述 |
| --- | --- |
| luma_val | 环境亮度 取值范围0-255000 |
| ref_wbgain | 白平衡增益 |
|  | 取值范围[0.5-3.9]，默认值d50光源的wbgain |

### WBGain范围限制



将白平衡增益限制在上图所示红色直线围成的区域内，其中横坐标为相关色温，纵坐标为显色指数，这两个为光源的属性。对应JSON中awbGnCalcStep.wbGainClip的结构体


| 名称 | 描述 |
| --- | --- |
| awbGnClip_en | 色温范围限制使能取值0或1，分别代表不使能、使能，默认不使能 |
| cfg.cct | 对应图上围成区域的圆点cct坐标上下边界采用相同的cct采样坐标取值[1000-10000] |
| cfg.cri_bound_up | 对应图上围成区域的下边界圆点cri分量对于位于区域内的点即cri0&gt;=-cri_bound_up，否则取值-1到1 |
| cfg.cri_bound_low | 对应图上围成区域的上边界圆点cri分量对于位于区域内的点有cri0&lt;=cri_bound_low取值-1到1 |
| cfg_len | cfg中数组的有效长度取值范围[1-11] |

除此之外还可以对室外光源的色温最小值进行限制，对应JSON中awbGnCalcStep.wbGainDaylightClip的结构体


| 名称 | 描述 |
| --- | --- |
| awbGnDLgtClip_en | 室外最低色温限制使能取值0或1，分别代表不使能、使能 |
| outdoor_cct_min | 室外最低色温取值不限 |

$( \mathsf &#123; c c t 0 &#125; , \mathsf &#123; c r i 0 &#125; )$ $\mathsf &#123; c r i o &#125; &#123; = &#125; \mathsf &#123; c r i \_ b o u n d \_ l o w &#125; ;$

若wbGainDaylightClip.awbGnDLgtClip\_en= 1，且场景为室外场景，若cct0&gt;outdoor\_cct\_min，则输出cct0=outdoor\_cct\_min。

### WBGain色调调整

对应JSON中awbGnCalcStep.wbGainAdjust的结构体


| 名称 | 描述 |
| --- | --- |
| awbGnAdjst_en | 色调调整使能取值0或1，分别代表不使能、使能，默认不使能 |
| ctrIDataSelt_mode | 指定色调调整表的控制量，即lutAll.ctIData取值awb_ctrlData_lv或awb_ctrlData_isoctrlDataSelt=awb_ctrIData_lv时，表示不同的环境亮度下可以配置不同的lut用于色调调整ctrIDataSelt=awb_ctrIData_iso时，表示不同的ISO下可以配置不同的lut用于色调调整 |
| adjDataSelt_mode | 指定色调调整表rgct，bgcri的变量含义取值awb_GainAdjDatSelt_gain或awb_GainAdjDatSelt_ct;取值为awb_GainAdjDatSelt_gain时，2维lut的两个维度分别为Rgain(白平衡增益之红色通道)，Bgain(白平衡增益之蓝色通道);取值为awb_GainAdjDatSelt_ct时， 2维lut的两个维度分别为CT(相关色温)，CRI(显色指数) |
| lutAll | lutAll中所有成员概述看这里：不同的lutAll.ctIData可以配置不同的lut用于色调调整色调调整通过2维线性插值实现，配置输入的2维表lut_in和输出的2维表lut_out，代入场景中（rgct，bgcri)值即可得到调整后的wbgain值，其中2维表为11行9列的表。因此通过修改lut_out表格中每个位置的（rgct，bgcri)值就可以实现色调调整（参考下面的配置2）lut_out的rgct分量存在lutAll.rgct_lut_out中， lut_out表的bgcri分量存在lutAll.bgcri_lut_out中lut_in的rgct分量和bgcri分量没有直接存下来，通过下面的方式生成：lut_in的rgct分量每一行都是复制lutAll.rgct_in_ds的值，lut_in的bgcri分量的每一列都是复制lutAll.bgcri_in_ds的值（参考下面的配置1） |
| lutAll_len | 指定色调调整表lut的个数 |
| lutAll.ctlData | 色调调整表的控制量ctrlDataSelt=awb_ctrlData_lv时，表示环境亮度ctrlDataSelt=awb_ctrlData_iso时，表示ISO取值范围0-255000 |
| lutAll.rgct_in_ds | 用于生成输入的2维表lut_in，参考前面lutAll描述有9个元素，从左到右值从小到大若adjDataSelt=awb_GainAdjDatSelt_gain，存rgain的值，取值范围0-8若adjDataSelt=awb_GainAdjDatSelt_ct，存ct的值，取值范围0-10000 |
| lutAll.bgcri_in_ds | 用于生成输入的2维表lut_in，参考前面lutAll描述有11个元素，从左到右值从大到小若adjDataSelt=awb_GainAdjDatSelt_gain，存bgain的值，取值范围0-8若adjDataSelt=awb_GainAdjDatSelt_ct，存cri的值，取值范围-2-4 |
| lutAll.rgct_lut_out | 输出的2维表，参考前面lutAIl描述若adjDataSelt=awb_GainAdjDatSelt_ct，存ct的值，取值范围0-10000若adjDataSelt=awb_GainAdjDatSelt_gain，存rgain的值，取值范围0-8 |
| lutAll.bgcri_lut_out | 输出的2维表，参考前面lutAll描述若adjDataSelt=awb_GainAdjDatSelt_ct，存cri的值，取值范围0-10000若adjDataSelt=awb_GainAdjDatSelt_gain，存bgain的值，取值范围0-8 |

（1）配置1示意（输入和输出相同，即不做调整）：

rgct\_in\_ds配置为，


| rgct_in_ds [0.00000 - 100000000] |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /wb_v32/autoExtPara/wbGainAdjust/lutAll/0/rgct_in_ds |  |  |  |  |  |  |  |  |  |
|  |  |  | 3 | 4 | 5 | 6 | 1 | 8 | 9 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |

/wb\_v32/autoExtPara/wbGainAdjust/lutAl/0/bgcri\_lut\_out

bgcri\_in\_ds配置为，


| bgcri_in_ds [-2.00000 - 8.00000] | □ × |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | /wb_v32/autoExtPara/wbGainAdjust/lutAl/0/bgcri_in_ds 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|  |  |  |  |  |  |  |  |  |  |  |  |
|  | 4.2000 | 3.9000 | 3.6000 | 3.3000 | 3.0000 | 2.7000 | 2.4000 | 2.1000 | 1.8000 | 1.5000 | 1.2000 |

### rgct\_lut\_out配置为，

□ ×


|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| 8 | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| 9 | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| 10 | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| 11 | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |

bgcri\_lut\_out配置为，

□


| wb_v32/autoExtPara/wbGainAdjust/lutA/0/bgcri_lut_out |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 |
|  | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 |
|  | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3.6000 |
|  | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 |
|  | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 |
|  | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 |
|  | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 |
|  | 2.1000 | 2.1000 | 2.1000 | 2.1000 | 2.1000 | 2.1000 | 2.1000 | 2.1000 | 2.1000 |
|  | 1.8000 | 1.8000 | 1.8000 | 1.8000 | 1.8000 | 1.8000 | 1.8000 | 1.8000 | 1.8000 |
| 10 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 |
| 11 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 |

### （2）配置2示意（调暖）：

当场景色调调整前的wbgain为（1.8,1,1,1.9）时，rgct\_in\_ds及bgcri\_in\_ds配置同配置1，lut\_out配置如下时，调整后的wbgain为（1.9,1,1,1.8）。rgain=1.8位于rgct\_in\_ds的第4和第5个元素之间，bgain=1.9位于bgcri\_in\_ds的第8和第9个元素之间，所以wbgain（1.8,1,1,1.9）落于lutout(4,8),lutout(4,9), lutout(5,8), lutout(5,9)四个顶点组成的矩形区域内，调整任意一个顶点的值均会修改wbgain。


| /wb_v | 32/autoExtPara/wbGainAdjust/lu | tAI/0/rgct_lut_out |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| 8 | 0.8000 | 1.1000 | 1.4000 | 1.8 | 2.1    +0.1 2.3000 | 2.6000 | 2.9000 | 3.2000 |  |
| 9 | 0.8000 | 1.1000 | 1.4000 | 1.8 | 21 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
| 10 | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |
|  | 0.8000 | 1.1000 | 1.4000 | 1.7000 | 2.0000 | 2.3000 | 2.6000 | 2.9000 | 3.2000 |

bgcri\_lut\_out [-2.000000 - 8.000000]  

□


|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 | 4.2000 |
|  | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 | 3.9000 |
|  | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3.6000 | 3,6000 | 3.6000 | 3.6000 | 3.6000 |
|  | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 | 3.3000 |
|  | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 | 3.0000 |
| 6 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 | 2.7000 |
|  | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 | 2.4000 |
| 8 | 2.1000 | 2.1000 | 2.1000 | 2.0 | 2.0   -0. | 1   2.1000 | 2.1000 | 2.1000 | 2.1000 |
| 9 | 1.8000 | 1.8000 | 1.8000 | 1.7 | 1.7 | 1.8000 | 1.8000 | 1.8000 | 1.8000 |
| 10 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 | 1.5000 |
| 11 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 | 1.2000 |

（3）色调调整效果参考下图（中间是原图，上下左右分别为绿紫蓝红色调）同时增加rgain bgain可以使白平衡正常的图像偏紫同时减小rgain bgain可以使白平衡正常的图像偏绿增加rgain, bgain不变或减小可以使白平衡正常的图像偏暖增加bgain，rgain不变或减小可以使白平衡正常的图像偏蓝











（4）与之前版本的色调调整相比，可以选择lut表是随iso变还是随环境亮度变，及lut表里的数据内容是rgain,bain还是ct,cri。

### wbGain偏移

对应JSON中awbGnCalcStep.wbGainOffset的结构体


| 名称 | 描述 |
| --- | --- |
| enable | 使能开关取值0或1，分别代表不使能、使能，默认不使能 |
| offset | wbgain与offset相加，对应R GR GB B通道的偏移取值范围由wbgain与offset相加值确定，即wbgain与offset相加后范围在\[0,4\](ISP20),wbgain与offset相加后范围在\[0,8\](其他) |

### WBGain平滑

```
if (varianceLuma > lvVar_th) {
```

$$

```
\mathsf { \Pi } ^ { * } \mathsf { w b o s a i n o a m p e a c t o r } - = \mathsf { d f _ s t e p } ;
```

$$

\*wbGainDampFactor += df\_step;

```
}

else {

}

if (*wbGainDampFactor < df_min) {

*wbGainDampFactor = df_min;

}

else if (*wbGainDampFactor > df_max) {

*wbGainDampFactor = df_max;

}
```

对应JSON中awbGnCalcStep.dampFactor的结构体


| 名称 | 描述 |
| --- | --- |
| df_step | wbGainDampFactor变化的步长取值范围0-1 |
| df_min | wbGainDampFactor最小值取值范围0-1 |
| df_max | wbGainDampFactor最大值取值范围0-1 |
| IvlIR_size | 记录几帧的环境亮度取值范围0-255 |
| IvVar_th | 用于判断wbGainDampFactor是否要变化的环境亮度方差阈值取值范围0-255000 |

### 其他（awbGnCalcOth）

### 首帧白平衡增益（fstFrm\_wbgain）

对应awbGnCalcOth.fstFrm\_wbgain结构体


| 名称 | 描述 |
| --- | --- |
| fstFrm_wbgain | 首帧白平衡增益，仅当自动白平衡模式且advSiteRec en=0且非快启项目有 效； 取值范围[0.5-3.9] |

### awb 现场恢复

（1）若smartAdv\_en为0，则无条件恢复，即wbgain\_first= wbgain\_last；

（2）若smartAdv\_en为1，（有条件恢复）

当abs(lumavalue\_cur  

lumavalue\_last)/(lumavalue\_cur+lumavalue\_last)\*2&lt;lvValueTh且abs(rgain\_cur  

rgain\_last)+abs(bgain\_cur- bgain\_last)&lt;wbgainTh 时wbgain\_first= wbgain\_last；

$$

```
\widehat { \square } \mathbb { M } \mathbb { M } \mathbb { M } \mathbb { B } \mathbb { g } \widehat  \smash { \mathrm { { a i n } } _ { - } \dagger \} } \mathbb { r } \mathbb { s } \mathbb { t } = \mathbb { w } \mathbb { b } \mathbb { g } \mathsf { a i n } _ { - } \mathbb { c } \mathsf { u r } _ { \circ }
```

$$

其中lumavalue\_cur为当前场景的环境亮度；wbgain\_cur为当前场景基于自动白平衡算法算出的白平衡增益，rgain\_cur和bgain\_cur分别为红色和蓝色通道对应的白平衡增益；lumavalue\_last为上一次相机退出时保存的环境亮度；wbgain\_last为上一次相机退出时保存的的白平衡增益，rgain\_last和bgain\_last分别为红色和蓝色通道对应的白平衡增益。

注意：

（1）该功能仅在自动白平衡模式下有效；


| 名称 | 描述 |
| --- | --- |
| advSiteRec_en | 取值为1，awb现场恢复功能开启，fstFrm_wbgain参数失效取值为0，awb现场恢复功能关闭 |
| kpRecFrm_num | wbgain_last保持的帧数取值0-255 |
| smartAdv_en | 取值为1，有条件awb现场恢复取值为0，无条件awb现场恢复 |
| advSitelnfo_name | 现场信息保存文件，保存lumavalue_last和wbgain_last |
| wbGain_th | smartAdv_en=1时使用，wbgain阈值参考前面描述取值0-8 |
| IvValue_th | smartAdv_en=1时使用，环境亮度阈值参考前面描述取值0-255 |

### runInterval

对应awbGnCalcOth.runInterval结构体


| 名称 | 描述 |
| --- | --- |
| luma_val | 环境亮度，取值范围[0-255000]，参考后面的lumaValueMatrix来配置 |
| interval_val | 帧数，取值范围[0-255] |
| runInterval_len | 对应配置的个数取值范围不限 |

### tolerance


| 名称 | 描述 |
| --- | --- |
| tolerance_en | 取值0，1分别表示自动控制算法运行与否的功能的关闭和开启 |
| cfg | 阈值，不同环境亮度可配置不同阈值 |
| cfg.luma_val | 环境亮度，取值范围[0-255000] |
| cfg.lvVar_th | 环境亮度变化相关阈值，取值范围[0,1]，推荐值0.001 |
| cfg.wbGainAlgUdDiff_th | 几帧内由AWB策略算出的白平衡增益(所有通道)差值的平均小于该阈值时，wbgain使用前一帧的值，其中帧数由hstrGainCalc_wgt_len配置取值范围[0-4],推荐值0 |
| cfg.wbGainAlgDpDiff_th | awb算法的wbgain阈值，取值范围[0,4]，推荐值0.005 |
| cfg.wbGainHwDiff_th | 硬件统计的wbgain阈值，取值范围[0,4]，推荐值0.05 |

### 白平衡收敛判断

对应JSON中awbGnCalcOth.converged的结构体，收敛阈值可以随环境亮度变化


| 名称 | 描述 |
| --- | --- |
| luma_val | 环境亮度，取值范围[0-255000] |
| unDampVar_th | 白平衡收敛阈值；几帧内由AWB策略算出的白平衡增益（所有通道）差值的平均小于阈值varThforUnDamp时，且几帧内平滑后的白平衡增益(所有通道)差值的平均小于varThforDamp时认为白平衡收敛；其中帧数由weightForNightGainCalc_len配置取值范围0.0-1；推荐值0.06 |
| dampVar_th | 参数含义及取值范围同上推荐值0.03 |

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

(1)AWB主界面示意



(2) 标定的时候主要是调整UV、XY域的白点边界，及YUV域的TH值



UV、XY域调整白点区间操作说明  

a) 在坐标系中用鼠标拖动白点条件的四角以调整位置和白点区间大小

b) 在坐标系中鼠标拖动空白区域，可以拖动整个白点区间

c) 使用滚轮放大缩小查看

(3) Exclude WPC Range面板可用于增加非白点区间和额外光源白点区间。

(4) 单击“AWB主界面”上的“ AWB Simulaton”按钮将弹出下面界面。AWB Simulaton 用于对raw图进行白点检测，统计白点增益及个数





②　单击图像中的任意位置（如下所示黑色箭头处），会映射到UV域白点条件界面和XY域条件界面上（为黑色的小方块），便于查看点是否落在白点区间内；同时显示该点的R G B U V X Y RGainBGain(红框区域) ，yuv域该点映射各个光源后的u和th及和标准白点的偏差距离（对应绿框区域的三列）







### AWB标定步骤

(1) AWB标定时需完成BLC和LSC的标定

(2) 单击Load Raw Files导入A,CWF,D50，D65，D75，HZ,TL84下的raw图（推荐标定这七个光源的raw图）

(3) 单击Find Chart 识别色卡



①　依次单击第1块，第6块，第19块，第20块

②　单击FindChart 会批量识别所有光源的色卡色块，如下所示（显示最后一个光源的白点检测结果）





④　单击Save 完成识别

(4) 单击Calibrate ，得到如下初始的白点条件及其他参数





WPC (UV Domain & XY Domain) WPC (YUV Domain)


| Light NamesA | uo50 | U1 | U2 | U3 | U4110 | U5142 |
| --- | --- | --- | --- | --- | --- | --- |
| 54 | 70 | 78 |  |  |  |  |
| CWF | 50 | 54 | 70 | 78 | 110 | 142 |
| D50 | 50 | 54 | 70 | 78 | 110 | 142 |
| D65 | 50 | 54 | 70 | 78 | 110 | 142 |
| D75 | 50 | 54 | 70 | 78 | 110 | 142 |
| HZ | 50 | 54 | 70 | 78 | 110 | 142 |
| TL84 | 50 | 54 | 70 | 78 | 110 | 142 |
| Light NamesA | Th00.2 | Th10.2 | Th2 | Th30.76 | Th41 | Th54 |
| 0.2 |  |  |  |  |  |  |
| CWF | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D50 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D65 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| HZ | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |

(5) 单击AWB Simulaton ,依次导入导入A,CWF,D50，D65，D75，HZ,TL84下的raw图查看白点检测的准确性

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

Previ ew  





TL84



### 2.4 常见问题定位

为了解决白平衡异常的问题，通常需要抓log和抓raw分析原因，通过修改白点条件或修改策略参数来解决。

### 抓log

方式1 ，在启动前将log等级设置为export persist\_camera\_engine $\scriptstyle 1 0 8 = 0 \times 2 + \uparrow 4$ ，串口和adb上将会打印相关的awblog

方式2，连接工具后一次单击这三个地方，会弹出一个log框，稍等片刻awblog将显示出来





工具上log显示如下（与方式1显示差不多）：

AWB Statistics   

AWB Preview Statistics Control   

WpNo   

RGain、BGain

Rockchip AWB Analyzer v1.0 &lt;   

-26th calculate wbgain   

mode:OP\_AUTO   

global CCT:6145.35,CCRI:-0.000300884,valid:true wbgain\_s6(after damping)(rggb):(2.06937, 1, 1, 1.7076)   

awbConverged(true),LVValue(1200), WPType(3), df(0.9)   

WPNo(normal,big):(41127, 41588),vaild wp number in standard light(41063), vaild wp number in extra light(0)   

select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0   

runInterval(0), tolerance(0)   

wbGainSgo for WPType1(rggb):(0, 0, 0, 0) ,wbWeightSgc(-1), sgoGainEqu2Tem(false)   

wbGainSpa for WPType1(rggb):(0, 0, 0, 0) ,wbWeightSpa(-1), spaGainEqu2Tem(false)   

wbGainTep for WPType1(rggb):(0, 0, 0, 0)   

wbGainType1(rggb): (0, 0, 0, 0)   

wbGainType3(rggb):(2.07421, 1, 1, 1.76075), weight of wbGainType3: 1   

wbgain\_s1 :(2.07421, 1, 1, 1.76075) is updated (true)   

wbgain\_s3 (wbgainclip) :(0, 0, 0, 0)   

wbgain s4 (wbgainAdjust) :(0, 0, 0, 0)   

wbgain\_s5 (wbgain0ffest) :(2.07421, 1, 1, 1.71075   

hdrFrameChoose: -1   

select algorithm method based on stat\_mode 0 (0-wp,1-gw) : 0   

WpNoHist: 0, 0, 0, 0, 0, 0, 0, 0   

à:   

strategy\_result.gain (rggb):(1.3226, 1, 1, 2.77572)   

prob\_total(0), prob\_dis(0.108739), prob\_LV(0.142857), prob\_WPN0(0)   

spatial gain(rggb):(1.79361, 1, 1, 1.76297), statistics gain weight(1)   

type0: gain (rggb):(1.3226, 1, 1, 2.77572) WPNo(12)   

type1: gain (rggb):(1.31253, 1, 1, 2.7529) WPNo(13)   

CTF:   

strategy\_result.gain (rggb):(1.85961, 1, 1, 2.45984)   

prob\_total(0), prob\_dis(0.159196), prob\_LV(0.142857), prob\_WPN0(0)   

spatial gain(rggb):(1.79361, 1, 1, 1.76297), statistics gain weight(1)   

type0; gain (rgeb):(1.85961, 1, 1, 2.45984) WPNo(52)   

type1: gain (rggb):(1.85838, 1, 1, 2.4569) WPNo(53)   

D50:   

strategy\_result.gain (rggb):(2.03007, 1, 1, 1.82758)   

prob\_total(0.301401), prob\_dis(0.183191), prob\_LV(0.142857), prob\_WPNO(0.301756)   

spatial gain(rggb):(1.79361, 1, 1, 1.76297),statistics gain weight(1)   

type0: gain (rggb):(2.03007, 1, 1, 1.82758) WPNo(12391)   

type1: gain (rggb):(2.03107, 1, 1, 1.82898) WPNo(12536)   

D65:   

strategy\_result.gain (rggb):(2.1223, 1, 1, 1.70285)   

prob\_total(0.651942), prob\_dis(0.184709), prob\_LV(0.142857), prob\_WPNO(0.647347)   

spatial gain(rggb):(1. 79361, 1, 1, 1.76297), statistics gain weight(1)   

type0: gain (rggb):(2.1223, 1, 1, 1.70285) WPNo(26582)   

type1: gain (rggb):(2.12123, 1, 1, 1.70199) WPNo(26689)   

D75:   

strategy\_result.gain (rggb):(2.241, 1, 1, 1.33784)   

prob\_total(0.0107051), prob\_dis(0.181175), prob\_LV(0.142857), prob\_WPNo(0.010837)   

spatial gain(rggb):(1.79361, 1, 1, 1.76297),statistics gain weight(1)   

type0: gain (rggb):(2.241, 1, 1, 1.33784) WPNo(445)   

tvpe1: gain (rggb):(2.29284. 1, 1, 1.31183) WPNo(652)   

HZ:   

strategy\_result.gain (rggb):(0, 0, 0, 0)   

prob\_total(0), prob\_di s(0.0183914), prob\_Lv(0. 142857), prob\_WPN0(0)   

spatial gain(rggb):(1.79361, 1, 1, 1.76297), statistics gain weight(1)   

type0: gain (rggb): (0, 0, 0, 0) WPNo(0)   

type1: gain (rggb):(0, 0, 0, 0) WPNo(0)   

TL84:   

strategy\_result.gain (rggb):(1.52262, 1, 1, 2.37639)   

prob\_total(0.0359522), prob\_dis(0.164598), prob\_LV(0.142857), prob\_WPNO(0.0400604)   

spatial gain(rggb):(1.79361, 1, 1, 1.76297),statistics gain weight(1)   

type0: gain (rggb):(1.52262, 1, 1, 2.37639) WPNo(1645)   

type1: gain (rggb):(1.52262, 1, 1, 2.37639) WPNo(1645)

### AWB log 解读(以串口或adb打印的log为例)

### (1) 控制及模式的log

byPass 为0 表示白平衡校正使能，为1 表示白平衡校正不使能

mode为2表示当前为手动白平衡模式，为1表示当前为自动白平衡模式

frame\_id为帧id

processing awb\_gain\_algo 为此模块最终输出的wbgain

(2)awb log等级为export persist\_camera\_engine\_log=0x2ff3 可用于一般的问题定位

AWB:I: -frame\_id (18)   

AWB:I:\*\*\*14th calc wbgn\*\*\*   

AWB:I:   

AWB:I:wbgns6(smooth) (rggb):(1.882737,1.000000,1.000000,2.171484),ganCalcM(0,0),wbgnCvg(0)   

AWB:I:iso(200.000000),fLv(2922.037842), WpT(3),df(0.90,0.00), statsSrc(3),runItv(0),toler(0.000000)   

AWB:I:WpNum:t(9454,0.291790),n(9517,0.293735),b(10083,0.311204),e(9424)   

AWB:I:forceRunAwb : 0, lvStb :1, wbgnStb :1, lum2WpWgtStb :1, statsStb : 3, smartRunAwb: 1   

AWB:I:byPass: 0, mode( 2-m 1-a):1   

AWB:I:awb\_processing2 awb\_gain\_algo (1.882737,1.000000,1.000000,2.171484),awb\_cfg\_update: 1, awb\_gain\_update: 1

wbgain\_s6为与平滑后的wbgain，一般与processing awb\_gain\_algo 相等;

ganCalcM对应设置和生效的gnCalc\_method；

wbgnCvg为 0 或1分别为AWB未收敛和收敛；

iso为曝光；

fLv为环境亮度，与json中的luma\_val对应；

WpT为根据白点占比得到的WpType结果

df为配置的平滑系数和加速后的平滑系数

statsSrc为输入源，与hw\_awbCfg\_statsSrc\_mode对应；

runInterval 为隔多少帧跑一次；

tolerance 为wbgain的方差变化小于该值时，wbgain将不更新；

WpNum为白点数量，t为总的白点数量及白点数量占比，n为中框的白点数量及及白点数量占比，n为大框的白点数量及及白点数量占比，e为额外光源框的白点数量及及白点数量占比

### (3)awb log等级为export persist\_camera\_engine\_log=0x2ff4 可用于白点条件及策略问题定位 (3)awb log等级为export persist camera enginelog=0x2ff4 可用于日点条件及策略问题定位

AWB:I: -frame id (5)-   

AWB:D:update wbgnB1k(r,b): (1.301463,1.409268) for gpIdx(1)   

AWB:D:eff preWbqnSw =[1.000000,1.000000,1.000000,1.000000]   

AWB:D:PrepareMeasureResult,lgtValid 1,EffeGrpIdx 1 illIdxSet:4,5,6, timSgn:17:59:35.414135   

AWB:I:\*\*\*2th calc wbgn\*\*\*   

AWB:D:Global CCT:4544.168457.CCRI:0.186261.Valid:1   

AWB:D:main i11:TL84 prob: 0.606179, CCT:4780.766113, CCRI:0.299659,   

AWB:I:   

AWB:I:wbgns6(smooth) (rggb):(1.841978,1.000000,1.000000,2.347285),ganCalcM(0,0),wbgnCvg(0)   

AWB:I:iso(200.000000),fLv(3053.347412), WpT(3),df(0.75,0.63), statsSrc(3),runItv(0),toler(0.000000)   

AWB:I:WpNum:t(11214,0.346111),n(10791,0.333056),b(11245,0.347068),e(12786)   

AWB:D:wbgns1 (mix wpT1 and wpT3) :(1.832499,1.000000,1.000000,2.260894),updated (1), wgt\_wpT3(1.000000)   

AWB:D:wpgnT3:(1.832499.1.000000.1.000000.2.260894)   

AWB:D:wpgnT1:(0.000000,0.000000,0.000000,0.000000)   

AWB:D:wbGnRef for WpT1 :(0.000000,0.000000,0.000000,0.000000),wgtRef(-1.000000)   

AWB:D:wbGnExt for wpT3 (1.912021,1.000000,1.000000,2.378766), wgtExt(0.239699),dIdx[0,-1],idx0Wgt(0.239699)   

AWB:D:wbGnPref for wpT3 :(1.955200,1.000000,1.000000,2.238100), wgtPrfNgt (0.000000)   

AWB:D:WpNoHist: 10712. 404, 13, 0. 0. 0, 0, 0,   

AWB:D:A res wbqn :(1.318977,1.000000,1.000000,2.952138)   

AWB:D: prob\_tota1(0.123883),dis(0.147017),1v(0.142857),wpnum(0.132755),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn:(1.450000,1.000000,1.000000,1.500000),prefWgt(0.200000)   

AWB:D: nor\_wbgn:(1.286222,1.000000,1.000000,3.315173) wpnum(1423)   

AWB:D: big\_wbgn:(1.280734,1.000000,1.000000,3.287769) wpnum(1522),bigWp\_wgt(0.000000)   

AWB:D:CWF res\_wbgn :(1.632328,1.000000,1.000000,3.014620)   

AWB:D: prob\_total(0.000000),dis(0.165327),1v(0.142857),wpnum(0.000000),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn: (1.300000,1.000000,1.000000,2.700000),prefWgt(0.200000)   

AWB:D: nor\_wbgn:(1.715410,1.000000,1.000000,3.093275) wpnum(28)   

AWB:D: big\_wbgn:(1.841103,1.000000,1.000000,2.644103) wpnum(256),bigWp\_wgt(0.000000)   

AWB:D:D50 res\_wbgn :(1.959692,1.000000,1.000000,2.035155)   

AWB:D: prob\_total(0.228708),dis(0.155549),1v(0.142857),wpnum(0.231645),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn:(1.750000,1.000000,1.000000,1.400000),prefWgt(0.200000)   

AWB:D: nor\_wbgn:(2.012115,1.000000,1.000000,2.193944) wpnum(2483)   

AWB:D: big\_wbgn:(2.014339,1.000000,1.000000,2.192942) wpnum(2504),bigWp\_wgt(0.000000)   

AWB:D:D65 res wbgn :(2.384972,1.000000,1.000000,1.511213)   

AWB:D: prob\_tota1(0.000000),dis(0.145157),1v(0.142857),wpnum(0.000000),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn:(2.400000,1.000000,1.000000,1.000000),prefWgt(0.200000)   

AWB:D: nor\_wbgn:(2.381215,1.000000,1.000000,1.639016) wpnum(44)   

AWB:D: big\_wbgn:(2.359896,1.000000,1.000000,1.629418) wpnum(46),bigWp\_wgt(0.000000)   

AWB:D:D75 res wbgn :(2.708096,1.000000,1.000000,1.253679)   

AWB:D: prob total(0.030904),dis(0.139171),lv(0.142857),wpnum(0.034985),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn:(3.111111,1.111111,1.111111,1.000000),prefWgt(0.400000)   

AWB:D: nor wbgn:(2.640018,1.000000,1.000000,1.515663) wpnum(375)   

AWB:D: big wbgn:(2.661621,1.000000,1.000000,1.522854) wpnum(473),bigWp wgt(0.000000)   

AWB:D:HZ res\_wbgn :(1.193348,1.000000,1.000000,3.938394)   

AWB:D: prob\_total(0.010326),dis(0.083438),1v(0.142857),wpnum(0.019498),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn:(1.170000.1.000000.1.000000,4.150000).prefWgt(0.200000)   

AWB:D: nor wbgn:(1.199185,1.000000,1.000000,3.885492) wpnum(209)   

AWB:D: big\_wbgn:(1.195139,1.000000,1.000000,3.873553) wpnum(213),bigWp\_wgt(0.000000)   

AWB:D:TL84 res wbqn :(1.814346,1.000000,1.000000,2.166265)   

AWB:D: prob total(0.606179),dis(0.164340),1v(0.142857),wpnum(0.581118),1gtSrcWgt(0.142857)   

AWB:D: prefwbgn:(1.650000,1.000000,1.000000,1.550000),prefWgt(0.200000)   

AWB:D: nor\_wbgn:(1.855432,1.000000,1.000000,2.320331) wpnum(6229)   

AWB:D: biq wbqn:(1.855306,1.000000,1.000000,2.320178) wpnum(6231),biqWp wqt(0.000000)   

AWB:D:cfgGrpIdx 1 il1IdxSet:4,5,6, timSgn:17:59:35.414135   

AWB:D:igMap2MainCam preWbgain :0, [0.000000,0.000000,0.000000,0.000000]   

AWB:I:forceRunAwb : 0, lvStb :1, wbgnStb :0, lum2WpWgtStb :1, statsStb : 1, smartRunAwb: 1   

AWB:I:byPass: 0, mode( 2-m 1-a):1   

AWB:I:awb\_processing2 awb\_gain\_algo (1.841978,1.000000,1.000000,2.347285),awb\_cfg\_update: 1, awb\_gain\_update: 1   

AWB:D:[5] wbgain params from algo   

AWB:D:[5] params from algo   

AWB:D:ConfigWbqainBaseOnBlc awb qain = [1.966345, 1.066406, 1.066406, 2.505770]

由统计信息nor\_wbgn,big\_wbgn,wbGnExt到最终的processing awb\_gain\_algo经过下面几个步骤：\*\*

### nor\_wbgn+big\_wbgn+prefwbgn ==&gt; res\_wbgn

update wbgnBlk(r,b): (1.301463,1.409268) 为块平均的wbgain

CCT用于表征场景的色温，只是辅助信息，Global为综合的色温，ill列出参与WBGain计算的概率最高的光源的色温和概率

wbgns1为wpgnT1和wpgnT3混合的gain，wgt\_wpT3为wpgnT3所占权重

wpgnT3为WpType3算出来的WBGain

wpgnT1为WpType1算出来的WBGain

wbGnRef for WpT1为wbGnType1.refWbGain计算得到refWbgain

wbGnExt for wpT3 为额外光源的wbgain

wbGnPref for wpT3 为prefereNgtwbGain，wgtPrfNgt为其混合权重

WpNoHist 为白点直方图，用于指导luma2WpWgt设置

res\_wbgn 为各个光源下的WBGain，为nor\_wbgn，big\_wbgn及prefwbgn混合的结果

prob\_total(0.123883),dis(0.147017),lv(0.142857),wpnum(0.132755),lgtSrcWgt(0.142857) 分别标示每个光源的总概率，距离概率，亮度概率，白点数量概率，白点权重

nor\_wbgn:(1.286222,1.000000,1.000000,3.315173) wpnum(1423) 为中框统计的白平衡增益，白点数量，中框的权重为1-bigWp\_wgt

big\_wbgn:(1.280734,1.000000,1.000000,3.287769) wpnum(1522),bigWp\_wgt(0.000000)为中框统计的白平衡增益，白点数量，大框的权重

从log上定位白平衡偏色问题  



### 抓raw并仿真

当需要重新调整白点条件，或者从Log上定位不出问题的时候，需要抓raw图（推荐参考例2的方式在仿真工具上获取）进行白点检测仿真，及查看各个光源下的白点统计。

### (1) 例1

右边是有问题的场景，左边是抓raw图重新调整了白点条件的效果



操作步骤：

①　抓raw图1

②　打开RKISPCalibrationTool，导入json文件



④　在 AWB Simulation界面上单击Load Image 导入raw图1，图片和白点检测结果会同时更新在界面上，如下所示



可以看出识别的白点非常少，而图确实也比较暗。如下所示，类似圈出来的灰白区域都应该被检测为白点



⑤ 在图像上单击灰白区域，

看一下映射的点是否有在XY、UV的白点区间内，没有的话需要调整白点条件，使其落在区间内；

若即在limitRange范围内，又在XY、UV的白点区间内，但是又没被识别为白点，还需确认YUV 的TH，后面AWB Simulaton界面上也会显示出该点的th , 参考界面上的这个值去调整YUV 的TH；

⑥　调整完，单击AWB界面上的Save，单击AWB Simulation界面上的 Run Simlation 重新仿真。

修改XY、UV的白点区间后，白点检测如下，就解决了白平衡异常的问题




| □ Al1 | Detected WP Number | RGain | BGain |
| --- | --- | --- | --- |
| ☑A | 17053, 18576, 15794 | 45, 22974.32, 19467.19 | 38,48464.96, 41539.59 |
| □ CWF | 10, 12, 8 | 20.53,24.33,16.41 | 23.08,27.63,18.63 |
| □D50 | 72, 118, 55 | 137.98,227.24,104.65 | 120.82,198.23,92.91 |
| □D65 | 8,11, 6 | 17.00,23.30,12.81 | 11.70,16.04, 8.85 |
| □D75 | 0,0,0 | 0.00,0.00,0.00 | 0.00,0.00,0.00 |
| ☑HZ | 1626, 1703, 535 | 58.16, 1734.76, 528.21 | 4.53,5816.17,1940.03 |
| □ TL84 | 745, 1517, 24 | 114.55,2225.90,40.67 | 817.71,3653.69,53.98 |

### (2)例2（仿真工具界面升级）

### a. 在线获取raw

在工具和板子连接后，可单击“Get online Image”获取在线图像，并自动更新仿真结果到界面上，和例1相比简化了调试流程，且，其他调试步骤参考例1的④⑤ ⑥




|  |  | G: 47 |  | B: 29 |  |
| --- | --- | --- | --- | --- | --- |
| R: | 31 | U: |  |  |  |
| Y: | 40.25 | 121.563 | V: 121.188 |  |  |
| x: | -163 | Y: | 5 |  |  |
| RGain: | 1.53862 | BGain: | 1.64565 |  |  |


| Light | U_Interp | Th_Interp | Distance |
| --- | --- | --- | --- |
| H | 63 | 0.5 | 0 |
| CWF | 66 | 0.5 | 1.625 |
| D65 | 67 | 0.5 | 0.3125 |
| TL84 | 65 | 2 | 0.625 |
| A | 64 | 2 | 0.5625 |
| D50 | 66 | 2 | 0.3125 |
| D75 | 67 | 0.5 | 0.1875 |


| Stats Kesult ☑ All WP Number RGain BGain Normal prob Big prob |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| ☑ | 0,0 | 0.000, 0.000 | 0.000, 0.000 | 0.000 | 0.000 |
| ☑ CWF | 184, 188 | 1.392, 1.397 | 2.372, 2.371 | 0.005 | 0.005 |
| D65 | 10040, 10115 | 1.599, 1.599 | 1.597, 1.597 | 0.263 | 0.261 |
| ☑ TL84 | 751, 919 | 1.251, 1.247 | 1.975, 1.954 | 0.020 | 0.024 |
| ☑A | 1, 4 | 1.074, 1.082 | 2.262, 2.245 | 0.000 | 0.000 |
| ☑ D50 | 26648, 26942 | 1.536, 1.535 | 1.680, 1.681 | 0.699 | 0.695 |
| D75 | 501, 574 | 1.732, 1.739 | 1.456, 1.457 | 0.013 | 0.015 |
| Statistios | 38125, 38742 | 1.549, 1.548 | 1.665, 1.666 | 1.000 | 1.000 |

注：获取的在线图会报存在工具的根目录下，后缀为.dat2（如：

awbinput\_rgb\_w2880\_h1616\_ds1\_fr1453492.dat2）。该界面上的Load Image也支持导入该格式文件。

### b. 支持查看中框白点，大框白点，附加框内的点，排除框内的点

依次对应界面上的这几个按钮 ，可查看中框白点，大框白点，附加框内的点，排除框内的点


| White Point Display : | Normal Range | Big Range | Additional Range Show Exclusion Range |  |  |
| --- | --- | --- | --- | --- | --- |
| Stats Result |  |  |  |  |  |

### c. 计算总的wbgain


| Stats Result |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| ☑ All | WP Number | RGain | BGain |  | Normal prob | Big prob |
| ☑z | 0, 0 | 0.000, 0.000 | 0.000, 0.000 |  | 0.000 | 0.000 |
| ☑ CWF | 184, 188 | 1.392, 1.397 | 2.372, 2.371 |  | 0.005 | 0.005 |
| ☑ D65 | 10040, 10115 | 1.599, 1.599 | 1.597, 1.597 |  | 0.263 | 0.261 |
| TL84 | 751, 919 | 1.251, 1.247 | 1.975, 1.954 |  | 0.020 | 0.024 |
| ☑A | 1, 4 | 1.074, 1.082 | 2.262, 2.245 |  | 0.000 | 0.000 |
| ☑ D50 | 26648, 26942 | 1.536, 1.535 | 1.680, 1.681 |  | 0.699 | 0.695 |
| D75 | 501, 574 | 1.732, 1.739 | 1.456, 1.457 |  | 0.013 | 0.015 |
| Statistics | 38125, 38742 | 1.549, 1.548 | 1.665, 1.666 |  | 1.000 | 1.000 |

可以编辑红色部分影响权重，WP Number修改了，右边的prob会自动更新，Statistics 那一行相应的数据也会更新。

### d. 离线仿真blc-lsc-wb-ccm-gamma效果

该功能可用于辅助查看不同wbgain的效果，以指导awb调试；可用于查看应用不同光源lsc的效果，以指导lsc调试； 可用于查看raw图是否有异常，等等。




| Stats Result |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| ☑ A1l | WP Nunber | RGain | BGain | Hornal prob | Big prob |
| ☑ | 0, 0 | 0.000, 0.000 | 0.000, 0.000 | 0.000 | 0.000 |
| ☑ CWF | 184, 188 | 1.392, 1.397 | 2.372, 2.371 | 0.005 | 0.005 |
| D65 | 10040, 10115 | 1.599, 1.599 | 1.597, 1.597 | 0.263 | 0.261 |
| TL84 | 751, 919 | 1.251, 1.247 | 1.975, 1.954 | 0.020 | 0.024 |
| ☑A | 1, 4 | 1.074, 1.082 | 2.262, 2.245 | 0.000 | 0.000 |
| D50 | 26648, 26942 | 1.536, 1.535 | 1.680, 1.681 | 0.699 | 0.695 |
| D75 | 501, 574 | 1.732, 1.739 | 1.456, 1.457 | 0.013 | 0.015 |
| Statisties | 38125, 38742 | 1.549, 1.548 | 1.665, 1.666 | 1.000 | 1.000 |

单击 Run Simulator2 按钮可以得到blc-lsc-wb-ccm-gamma后的效果。应用的blc lsc ccm gamma数据均来自json，且有打印在标定界面的log窗口里。

Raw File Options   

Width: 2560   

Height: 1440   

Bits: 10 bit   

Bayer: BGGR   

Edit Options

IQ File

-&gt;Info: Load JsonIQ normal: day   

-&gt;INFO: load   

sc4336\_OT01\_40IRC\_F16.json   

successfully.   

-&gt;INFO(AWB): init uv/xy wpc ok.   

-&gt;INFO(AWB): use D65 CCM parameter.   

-&gt;INFO(AWB): ccmMatrix:1.3683,-0.3732   

,0.0049   

-&gt;INFO(LSC): Raw Image loaded   

successfully.   

-&gt;Info: Load JsonIQ normal: day   

-&gt;INFO: load   

sc4336\_OT01\_40IRC\_F16.json   

successfully.   

−&gt;INFO(AWB): init uv/xy wpc ok.   

-&gt;INFO(AWB): use TL84 CCM parameter.   

-&gt;INFO(AWB): ccmMatrix:1.2447,-0.2877   

,0.0429   

-&gt;INFO(AWB): Raw Image loaded   

successfully.   

-&gt;INFO(AWB): Load   

rkisp\_sc4336\_D75\_2560\_1440\_10bpp\_1.80x   

\_0.0400s\_normal\_normL\_single\_104803899   

raw successfully   

−&gt;INFO(AWB): BlcValue(12bit)= 254 ,254   

254 254   

-&gt;INFO(AWB): D75 use D50 LSC   

parameter.   

-&gt;INF0(AWB): R:2246 ,1970 ,1760 ,1607   

-&gt;INFO(AWB): Gr:2211 ,1901 ,1702 ,1578   

-&gt;INFO(AWB): Gb:2264 ,1942 ,1757 ,1626   

-&gt;TWR0(sWR). B·2197 1979 1747 162E   

-&gt;INFO(AWB): D75 use A CCM parameter.   

-&gt;INFO(AWB): ccmMatrix:1.2380,-0.7220   

,0.4840  

应用的wbgain来自于中框的wbgain，可以直接编辑该wbgain，重新单击Run Simulator2 更新仿真结果。

### (3) 例3 （yuv th 调优示意）

该示例用于确认白点漏检是否由于yuv th设置不合理导致及调优，步骤如下：

a.确定当前光源是哪个，通过该点落在xy域和uv域的光源区间确定

b. 从AWB Simulator界面上查看该光源对应行的Distance是否大于TH，如果是：

查看该光源对应行的U位于YUV条件对应光源行的哪几列之间，调大其对应的列的th值即可

具体操如下：

如下图所示色卡的22块没有完全被识别为白点，分析原因为此时的D65光源下的distance &gt; th (0.3125&gt;0.1875)导致，


| YHRFEC a LDCHSimulatorWPC (UV Domain &amp; XY Domain)NPC (YUV Domsin)Light Names   U0     U1     U2     U3     U4     U5 |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | A | 50 | 54 | 70 | 78 | 110 | 142 |
|  | CWF | 50 | 54 | 70 | 78 | 110 | 142 |
|  | D50 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | D65 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | D75 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | HZ | 50 | 54 | 70 | 78 | 110 | 142 |
|  | TL84 | 50 | 54 | 70 | 78 | 110 | 142 |
|  | A | 0.4 | 0.4 | 0.4 | 0.76 | 1 | 4 |
|  | CWF | 0.4 | 0.4 | 0.4 | 0.76 | 1 | 4 |
|  | D50 | 0.7 | 0.7 | 1 | 2 | 4 | 4 |
|  | D65 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
|  | D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
|  | HZ | 2 | 2 | 2 | 2 | 2 | 4 |
|  | TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
|  |  |  |  |  |  |  |  |




| Stats of Point Track Pos: 202, 150 |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| R: | 30 | G: 56 |  | B: 38 |  |
| Y: | 46 | U: | 123 | v: 116 |  |
| X: | 13 |  | Y: | 7 |  |
| BGain: | 1.875 |  | BGain: | 1.49007 |  |
| Light | U_Interp | Th_Interp |  | Distance |  |
| A | 67 | 0.375 |  | 0.375 |  |
| CYF | 68 | 0.375 |  | 1.875 |  |
| D50 | 69 | 1 |  | 0.1875 |  |
| D65 | 69 | 0.1875 |  | 0.3125 |  |
| DTS |  | 69 | 0.1875 |  | 0.25 |
| HZ | 65 | 2 |  | 1.4375 |  |
| TL84 | 68 |  | 0.1875 | 0.375 |  |


| Stats Result |  |  |  |  |
| --- | --- | --- | --- | --- |
| A11 ☑A | VP Jonber 0,0 | RGain 0.000, 1.140 |  | BGain 0.000, 2.946 |
| ☑CHF | 0, 0 | 1.578, 1.578 |  | 2.304, 2.304 |
| 050 | 64, 121 |  | 1.695, 1.735 | 1.701, 1.741 |
| D65 | 35409, 35439 |  | 1.931, 1.931 | 1.481, 1.481 |
| 075 | 467, 493 |  | 1.958, 1.966 | 1.394, 1.398 |
| ☑1区 | 519, 519 |  | 0.978, 0.978 | 2.865, 2.885 |
| TL84 | 9, 9 |  | 1.383, 1.383 | 2.303, 2.303 |
|  |  |  |  |  |

又因为该点映射到D65光源下的u为60，位于u1（54）和u2（70）之间，所以按如下调大着两列对应的th1和th2阈值即可，从白点检测结果可以看出修改方向是对的。


| A | 50 | 54 | 70 | 78 | 110 | 142 |
| --- | --- | --- | --- | --- | --- | --- |
| CWF | 50 | 54 | 70 | 78 | 110 | 142 |
| D50 | 50 | 54 | 70 | 78 | 110 | 142 |
| D65 | 50 | 54 | 70 | 78 | 110 | 142 |
| D75 | 50 | 54 | 70 | 78 | 110 | 142 |
| HZ | 50 | 54 | 70 | 78 | 110 | 142 |
| TL84 | 50 | 54 | 70 | 78 | 110 | 142 |
| A | 0.4 | 0.4 | 0.4     0 | .76 | 1 | 4 |
| CWF | 0.4 | 0.4 | 0.4 | 0.76 | 1 | 4 |
| D50 | 0.7 | 0.7 | 1 | 2 | 4 | 4 |
| D65 | 0.2 | 0.4 | 0.6 | 0.76 | 1 | 4 |
| D75 | 0.2 | 0.2 | 0.2     0 | .76 | 1 | 4 |
| HZ | 2 | 2 | 2 | 2 | 2 | 4 |
| TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |




| Stats of Point Track |  |  |  |
| --- | --- | --- | --- |
|  | Pos: 193, 154 |  |  |
| R: | 29 | G: 54 | B: 37 |
| Y: | 45 V: | 124 | V: 117 |
| X: | 20 | Y: | 6 |
| Rüain: | 1.87931 | BGain: | 1.48299 |
| Light | U_Interp | Th_Interp | Distance |
| à | 88 | 0.375 | 0.375 |
| CN7 | 67 | 0.375 | 1.8125 |
| I50 | 68 | 0.9375 | 0.25 |
| 165 | 68 | 0.625 | 0.3125 |
| 175 | 68 | 0.1875 | 0.1875 |
| YZ | 64 | 2 | 1.375 |
| TL84 | 67 | 0.1875 | 0.3T5 |


| Stats Result |  |  |  |
| --- | --- | --- | --- |
| All | N7 Wunber | BGain | Boain |
| A | 0,0 | 0.000, 1.140 | 0.000, 2.948 |
| CHF | 0, 0 | 1.578, 1.578 | 2.304, 2.304 |
| 050 | 64, 121 | 1.695, 1. T35 | 1. 701, 1. 741 |
| 65 | 36175, 36204 | 1.930, 1.930 | 1.482, 1.482 |
| 075 | 467, 493 | 1.958, 1.966 | 1.394, 1.398 |
| 配 | 519, 519 | 0.978, 0.9T8 | 2.865, 2.865 |
| TLB4 |  |  |  |
|  | 9, 9 | 1.383, 1.383 | 2.303, 2.303 |

注：

当用yuv th 去除非白点时，操作步骤与上面类似，只不过此时是减小阈值，但要保证不影响到白点识别。

### 特殊问题举例

(1) 网络摄像头应用里把白平衡设置为自然光模式，导致自动白平衡没有开启，

通过查看log发现当前 为手动模式

更改白平衡模式后可解决这个问题

(2) 标定的时候发现hz a光下白点分布不集中



实际效果如下，白平衡做不对



后面测试发现是因为红外滤光片不合格导致近红外波段没有被截止，通过更换红外滤光片解决。

## 3 CCM

### 3.1 功能描述

CCM标定工具支持对24色卡进行3x3 CCM（a<sub>ij</sub>）的预校正。

$$

\left[ \begin&#123;array&#125; &#123; l &#125; &#123; R _ &#123; c c &#125; &#125; \\ &#123; G _ &#123; c c &#125; &#125; \\ &#123; B _ &#123; c c &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; a _ &#123; 1 1 &#125; &#125; & &#123; a _ &#123; 1 2 &#125; &#125; & &#123; a _ &#123; 1 3 &#125; &#125; \\ &#123; a _ &#123; 2 1 &#125; &#125; & &#123; a _ &#123; 2 2 &#125; &#125; & &#123; a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; &#125; & &#123; a _ &#123; 3 2 &#125; &#125; & &#123; a _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] \cdot \left[ \begin&#123;array&#125; &#123; l &#125; &#123; R _ &#123; c a m e r a &#125; &#125; \\ &#123; G _ &#123; c a m e r a &#125; &#125; \\ &#123; B _ &#123; c a m e r a &#125; &#125; \end&#123;array&#125; \right]

$$

在ISP运行时，可根据画面局部亮度调整alp0，来实现CCM饱和度动态调整，并且可调整alp1来缓解通道信息被截断为0的情况。

$$

\left[ \begin&#123;array&#125; &#123; c c &#125; &#123; R _ &#123; c c &#125; &#125; \\ &#123; G _ &#123; c c &#125; &#125; \\ &#123; B _ &#123; c c &#125; &#125; \end&#123;array&#125; \right] = a l p _ &#123; 0 &#125; \cdot a l p _ &#123; 1 &#125; \cdot \left[ \begin&#123;array&#125; &#123; c c c &#125; &#123; a _ &#123; 1 1 &#125; - 1 &#125; & &#123; a _ &#123; 1 2 &#125; &#125; & &#123; a _ &#123; 1 3 &#125; &#125; \\ &#123; a _ &#123; 2 1 &#125; &#125; & &#123; a _ &#123; 2 2 &#125; - 1 &#125; & &#123; a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; &#125; & &#123; a _ &#123; 3 2 &#125; &#125; & &#123; a _ &#123; 3 3 &#125; - 1 &#125; \end&#123;array&#125; \right] \cdot \left[ \begin&#123;array&#125; &#123; c c &#125; &#123; R _ &#123; c a m e r a &#125; &#125; \\ &#123; G _ &#123; c a m e r a &#125; &#125; \\ &#123; B _ &#123; c a m e r a &#125; &#125; \end&#123;array&#125; \right] + \left[ \begin&#123;array&#125; &#123; c c &#125; &#123; R _ &#123; c a m e r a &#125; &#125; \\ &#123; G _ &#123; c a m e r a &#125; &#125; \\ &#123; B _ &#123; c a m e r a &#125; &#125; \end&#123;array&#125; \right]

$$

### 3.2 关键参数

ISP39/33的调试参数见IQ json文件的ccm节点。

### 模块使能及模式控制


| 参数 | 描述 |
| --- | --- |
| opMode | 工作模式，取值RK_AIQ_OP_MODE_AUTO或RK_AIQ_OP_MODE_MANUALRK_AIQ_OP_MODE_AUTO表示使用stAuto和calibdb进行自动CCM校正，RK_AIQ_OP_MODE_MANUAL表示使用stMan参数 |
| en | 模块使能，1表示使能；取值0或1 |
| bypass | 模块bypass，预留，暂不使用 |

### 亮度Y转换（Y2Alpha\_fac0）

根据sta-&gt;ccmCfg计算画面各像素点对应的亮度值Y。


| 参数 | 描述 |
| --- | --- |
| hw_ccmCfg_rgb2y_coeff | 由RGB到Y的计算系数，7bit定点化的值；整数，取值范围  $[ 0 \times 4 0 0 ,$  0x3ff]，默认值：[38，75，15]，不建议调整 |

### 亮度相关饱和度调节（Y2Alpha\_fac0）

Y2Alpha\_fac0是一条三分段曲线，对应三个亮度区间，亮度值Y作为索引，依照Y2Alpha\_fac0曲线插值出对应的 $&#123; \pmb q &#125; / p _ &#123; \pmb 0 &#125;$ ，其对应函数关系如下：

$$

a l p _ &#123; 0 &#125; = \left\&#123; \begin&#123;array&#125; &#123; l l &#125; &#123; l o Y 2 A l p h a \_ f a c 0 , \quad Y \leq 2 ^ &#123; f a c M a x \_ m i n T h r e d &#125; &#125; \\ &#123; h i Y 2 A l p h a \_ f a c 0 [ 1 6 ] , 2 ^ &#123; f a c M a x \_ m i n T h r e d &#125; &lt; Y \leq 4 0 9 5 - 2 ^ &#123; f a c M a x \_ m a x T h r e d &#125; &#125; \\ &#123; h i Y 2 A l p h a \_ f a c 0 , \quad Y &gt; 4 0 9 5 - 2 ^ &#123; f a c M a x \_ m a x T h r e d &#125; &#125; \end&#123;array&#125; \right.

$$

如下图所示，其中 $\scriptstyle | | &#123; \mathsf &#123; p &#125; &#125; _ &#123; 0 &#125; = 1 0 2 .$ 4表示1倍强度，即不降低饱和度， $\scriptstyle \mathsf &#123; A l p &#125; _ &#123; 0 &#125; = 0$ 表示不做CCM校正。




| 参数 | 描述 |
| --- | --- |
| ccmAlpha_yFac |  |
| hw_ccmT_facMax_minThred | Y2Alpha_fac0曲线的左侧拐点对应的亮度值Y=2hw_ccmT_facMax_minThred :整数，取值范围[3,11] |
| hw_ccmT_facMax_maxThred | Y2Alpha_fac0曲线的右侧拐点对应的亮度值Y = 4095-2hw_ccmT_facMax_maxThred ;整数，取值范围[3,11] |
| hw_ccmT_loY2Alpha_fac0 | Y2Alpha_fac0曲线上第一分段即低照度区域的17个均匀采样点的纵坐标alpo，递增序列，1024表示1倍强度；整数，取值范围[0,1024] |
| hw_ccmT_hiY2Alpha_fac0 | Y2Alpha_fac0曲线上第三分段即高照度区域的17个均匀采样点的纵坐标alpo，递增序列，1024表示1倍强度；整数，取值范围[0,1024] |

### 颜色增量调整（ccmAlpha\_satFac）

该子功能主要针对ccm校正导致通道正反向溢出问题，对于指定颜色校正增量范围的像素点，可调整 $\mathsf &#123; a l p &#125; _ &#123; 1 &#125;$ 以减轻。

上述所提颜色校正增量如下计算：

$$

```
{ \binom { \Delta R } { \Delta G } } = { \left[ \begin{array} { l l l } { a 1 1 - 1 } & { a 1 2 } & { a 1 3 } \\ { a 2 1 } & { a 2 2 - 1 } & { a 2 3 } \\ { a 3 1 } & { a 3 2 } & { a 3 3 - 1 } \end{array} \right] } \cdot { \left[ \begin{array} { l } { R c a m e r a } \\ { G c a m e r a } \\ { B c a m e r a } \end{array} \right] }
```

$$

这里使用 $m i n \varDelta C = m i n \iota \varDelta R , \varDelta G , \varDelta B y$ 作为索引，根据sat2Alpha\_fac1曲线（如下图所示）插值出对应的alp<sub>1</sub>。




| 参数 | 描述 |
| --- | --- |
| ccmAlpha_satFac |  |
| hw_ccmT_satldx_maxLimit | 为sat2Alpha_fac1曲线左侧拐点对应min $\vartriangle C = -$ hw_ccmT_satIdx_maxLimit，对于颜色增量小于该值的像素点， $\scriptstyle \equiv &#123; \frac &#123; 1 &#125; &#123; 2 &#125; &#125; \mathbf &#123; a &#125; \| \mathbf &#123; p &#125; _ &#123; 1 &#125; = \mathbf &#123; s a t &#125; 2 \mathbf &#123; A l p h a &#125; .$ _fac1[16]，整数，取值范围：[0，256] |
| hw_ccmT_facMax_thred | sat2Alpha_fac1曲线右侧拐点对应min△C，对于颜色增量大于该值的像素点，其颜色校正强度为a $\mathsf &#123; l p &#125; _ &#123; 1 &#125; &#123; = &#125; \mathsf &#123; s a t &#125; 2 \mathsf &#123; A l p h a \_ f a c &#125; 1 [ \mathsf &#123; 0 &#125; ]$ ，整数，取值范围：[0，255] |
| hw_ccmT_satldx_scale | sat2Alpha_fac1曲线索引 $\| \mathsf &#123; m i n &#125; \triangle 0$ 的拉伸系数，只对颜色增量处于[-satIdx_maxLimit, facMax_thred]范围内的像素点起作用，越大 $\mathbf &#123; \hat &#123; a &#125; &#125; \mathbf &#123; l &#125; \mathbf &#123; p &#125; _ &#123; 1 &#125;$ 越小，即饱和度越低；整数，取值范围：[0，16128]；建议值: $\mathsf &#123; m i n &#125; ( 6 5 5 3 6 / ( \mathsf &#123; h f \_ u p T h &#125; + \mathsf &#123; h f \_ l o w T h &#125; ) , 6 3 . 9 9 6 ) ^ &#123; \star &#125; 2 5 6$ |
| hw_ccmT_sat2Alpha_fac1 | sat2Alpha_fac1第二分段曲线17个均匀采样点的纵坐标alp₁，递减序列，1024表示1倍强度；整数，取值范围[0,1024] |



图 ccmAlpha\_satFac效果对比 （hw\_ccmT\_satIdx\_maxLimit = 51, hw\_ccmT\_facMax\_thred = 240,hw\_ccmT\_satIdx\_scale = 2^14-1）

### 颜色增强调节（enhance）

亮度值Y与CCM校正后的三个通道值共同参与计算各像素点的颜色增强强度。主要作用是增强颜色饱和度较高区域颜色，但同时会放大中高亮灰阶区域偏色，需要配合使用hw\_ccmT\_enhanceRat\_maxLimit进行限制。



图 enhCCM效果对比 （enh\_rat\_max = 1.5）


| 参数 | 描述 |
| --- | --- |
| hw_ccmT_enhance_en | 是否启用CCM颜色增强调整；整数，取值范围：0或1 |
| hw_ccmT_enhanceRat_maxLimit | 颜色增强强度限制，大于1，颜色增强，小于1，降低饱和 度; |
| 小数，取值范围：[0，15.992]; |  |
|  | 建议值：颜色增强[1.1，1.5]，降低饱和度[0.7，1) |

### 自动CCM（ACCM)

ACCM基于标定参数calibdb和调试参数stAuto，可根据不同光源不同增益下进行动态自适应调整。

### 标定参数 calibdb-&gt;matrixAll


| 参数 | 描述 |
| --- | --- |
| sw_ccmC_illu_name | 光源名 |
| sw_ccmC_ccmSat_val | 对应的饱和度，由标定工具生成，取值大于等于0 |
| ccMatrix |  |
| hw_ccmC_matrix_coeff | 颜色校正矩阵，由标定工具生成，小数，取值范围[-8，7.992] |
| hw_ccmC_matrix_offset | R\G\B分量偏移，由标定工具生成，取值范围[-2048，2047] |

### CCM光源相关控制参数（stAuto-&gt;dyn-&gt;illuLink）

根据实际白平衡增益自动选择标准白平衡增益最接近的光源参数，每个光源下可通过调整gain2SatCurve以实现在不同曝光增益下的CCM矩阵及偏移动态调整。


| 参数 | 描述 |
| --- | --- |
| sw_ccmC_illu_name | 光源名 |
| sw_ccmC_wbGainR_val | 光源对应的标准白平衡R通道增益，由标定工具生成，取值大于0 |
| sw_ccmC_wbGainB_val | 光源对应的标准白平衡B通道增益，由标定工具生成，取值大于0 |
| gain2SatCurve |  |
| sw_ccmT_isoldx_val | gains-sat之曝光增益分量，小数，取值大于0 |
| sw_ccmT_glbSat_val | gains-sat之饱和度分量，小数，取值大于0 |

### 注意事项

illuLink配置的光源必须有对应的标定参数。

### ISO相关控制参数（stAuto-&gt;dyn-&gt;isoLink）

根据实际曝光增益iso的大小动态插值饱和度相关调整参数。


| 参数 | 描述 |
| --- | --- |
| sw_ccmT_glbCcm_scale | 直接作用在Y2Alpha_fac0曲线上，小数，取值范围[0，1] |
| ccmAlpha_yFac | 亮度相关饱和度调节 |
| ccmAlpha_satFac | 颜色增量调整 |
| enhance | 颜色增强调节 |

### 帧间过渡控制


| 参数 | 描述 |
| --- | --- |
| sw_ccmT_damp_en | 色彩校正矩阵帧间平滑功能开关，1表示使用该功能；取值0或1 |

### 3.3 CCM标定

按照《Rockchip\_IQ\_Tools\_Guide\_CN\_vx.x.x》完成CCM标定工作。

### RAW数据采集

### 标定光源选择

七种不同色温的光源：D50、D65、D75、A、CWF、HZ、TL84

### 采集步骤

Step 1. 色卡放置在灯箱背景墙的中心，保证左右两侧光源均匀；如果项目对颜色要求比较高，也可以在旁边也放入相应的颜色，比如肤色卡，用于确认效果。

Step 2. 调节曝光，使得应用gamma后的色卡各个色块都不能过曝，推荐用自动曝光

Step 3. 拍摄时，调节物距，使得色卡在画面的占比为1/9。

### 标定

### 步骤

Step 1. RAW数据导入以及选取24色区域部分请参考《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》4.5章节 “CCM标定”。

### Step 2. 配置标定参数

（1）设置gamma：选择相机将会使用的gamma曲线。支持Normal、HDR、Night模式，也支持自定义。

（2）设置色块权重：在6x4的表格中配置色块权重，色块位置与表格中的位置对应。

（3）点击“Calibrate”按钮进行标定，获得CCM。可在Calibrate页面进行手动调节Saturation（饱和度），直到Result中校正完的效果图或色差图满足要求。

### 色差图介绍

根据色差图中标准色块的偏差方向与所在区间，分析出是哪个分量异常，如下：

（1）camera的色块比idea的色块到原点的距离更远，则camera饱和度高比idea高

（2）camera的色块比idea的色块到原点的距离更小，则camera饱和度高比idea低

### 案例看图：



色块15（红色块）及色块14（绿色）camera饱和度高比idea低，但属于偏差比较小的范畴内  

色块13（蓝色）偏紫色方向，人眼视觉可能也觉得色块13也偏紫色，所以这种偏差可以接受。  

一般要保证13-15色块色块偏差不要太大，这差不多代表了三原色，其他颜色可以从这三个颜色叠加得到。

如果13-15色块，或其他比较关注的颜色块色偏严重，可以增加色块的权重，但需注意兼顾对其他颜色块色偏的影响。

### 注意事项

（1）在识别24色区域时，确保每一个色块的黑边没被选入

（2）调整gamma曲线后可能需要重新标定CCM，所以最好先调好gamma

（3）标定图亮度不合适将会影响标定出的CCM的饱和度特性，过亮的RAW图标定出的CCM饱和度偏低，过暗的RAW图标定出的CCM饱和度偏高

（4）建议客观指标如下，但可以因项目而异，不注重这些客观指标


|  |  |  |  |
| --- | --- | --- | --- |
|  | D65(external) | color saturation | 110-120% |
| mean(ΔC) | &lt;10 |  |  |
| max(ΔC) | &lt;20 |  |  |
| mean(ΔE) | &lt;15 |  |  |
|  | T184 (for internal only) | color saturation | 110-120% |
| mean(ΔC) | &lt;10 |  |  |
| max(ΔC) | &lt;20 |  |  |
| mean(ΔE) | &lt;12 |  |  |
| Color accuracy | Coolwhite (for internal only ) | color saturation | 110-125% |
| mean(ΔC) | &lt;10 |  |  |
| max(ΔC) | &lt;20 |  |  |
| mean(ΔE) | &lt;12 |  |  |
| A light ( for internal only ) | color saturation | 110-120% |  |
| mean(ΔC) | &lt;10 |  |  |
| max(ΔC) | &lt;22 |  |  |
| mean(ΔE) | &lt;12 |  |  |

### 3.4 颜色调整

### 整体颜色饱和度调整

调整sw\_ccmT\_glbCcm\_scale

scale取值可在[0, 1.0]范围内做适当调整，影响最终的色彩校正强度，scale越小，色彩饱和度越低，反之色彩饱和度增加。

### 调整gain2SatCurve

sw\_ccmT\_glbSat\_val越小，色彩饱和度越低，反之色彩饱和度增加。不同光源可以配置不同的参数。

### 增加高饱和度的CCM

当前两点调到最大值时，饱和度还是不够，需要重新标定更高饱和度的CCM，同时要调整gain2SatCurve里的sat最大值为新增标定矩阵对应的饱和度。

### 降低亮、暗区的像素的色彩饱和度

减小ccmAlpha\_yFac中的值，以降低暗、亮区像素的色彩饱和度。

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

案例：

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

（3）24色卡人眼视觉的目标值为：


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

（2）常见色偏精调总结：

蓝色（红色）偏紫， $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 1 3 &#125; &#125; & &#123; &#123; &#125; \left( \alpha _ &#123; 3 1 &#125; \right) &#125; \end&#123;array&#125;$ 为正数时，需减小R（B）分量，将 $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 1 3 &#125; &#125; & &#123; &#123; &#125; \left( \alpha _ &#123; 3 1 &#125; \right) &#125; \end&#123;array&#125;$ 从接近0 的正数改为较小负数；

蓝色（红色）过饱和， $\begin&#123;array&#125; &#123; r l &#125; &#123; \alpha _ &#123; 2 3 &#125; &#125; & &#123; &#123; &#125; \big ( \boldsymbol &#123; a &#125; _ &#123; 2 1 &#125; \big ) &#125; \end&#123;array&#125;$ 为负值时，需增大G分量，可减小 $\cdot \alpha _ &#123; 2 3 &#125; \ \left( \alpha _ &#123; 2 1 &#125; \right)$ ）的绝对值；

紫色偏蓝，需增大R分量，可增大 $\alpha _ &#123; 1 3 &#125;$ ，减小 $&#123; \bf \cdot &#125; &#123; \boldsymbol &#123; \alpha &#125; &#125; _ &#123; 1 1 &#125;$ 和 $\alpha _ &#123; 1 2 &#125;$ ；或者减小B分量，减小 $\cdot \alpha _ &#123; 3 3 &#125;$ ，增大 $\alpha _ &#123; 3 1 &#125;$ 和 $\alpha _ &#123; 3 2 &#125;$

红色偏橘，需减小G分量，可减小 $&#123; \bf \nabla &#125; \cdot &#123; \bf &#123; &#123; a &#125; &#125; &#125; _ &#123; 2 1 &#125;$ 并增大 $\boldsymbol &#123; \mathcal &#123; a &#125; &#125; _ &#123; 2 2 &#125;$ ；

肤色偏黄绿，需减小G分量，增大B分量，可大幅度减小 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; a &#125; _ &#123; 2 2 &#125;$ 和增大 $\alpha _ &#123; 2 3 &#125;$ ，微调 $\alpha _ &#123; 2 1 &#125;$ ，大幅度增大 $\alpha _ &#123; 3 1 &#125;$ 和减小 $\cdot \alpha _ &#123; 3 2 &#125;$ ，微调 $a _ &#123; 3 3 &#125;$

调整CCM示例

(1) 案例1 红色偏橘：



使用faststone 调整RGB 发现，减小G分量可以改善偏橘的问题，此时红色塑料片目标RGB值为[21263 79]。



红色框内的红色塑料片偏橘，RGB = [212, 78, 80]，与目标值[212 63 79]相比，G分量偏大。如果经验比较丰富，可以跳过获取用faststone这一步，直接调整CCM减小G分量即可。

$$

```
\begin{array} { r } { ( \widetilde { \mathcal { T } } ^ { \prime } = \alpha _ { 2 1 } \mathcal { R } + \alpha _ { 2 2 } \widetilde { G } + \alpha _ { 2 3 } \mathcal { B } \ , } \end{array}
```

$$

原校正系数： $[ a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; ] = [ \phantom &#123; - &#125; 0 . 2 8 5 4 , 1 . 1 4 9 6 , 0 . 1 3 5 8 ]$

由于红色塑料片R分量值最大，因此需要减小 $\boldsymbol &#123; \cdot &#125; \boldsymbol &#123; \mathcal &#123; a &#125; &#125; _ &#123; 2 1 &#125;$ 的值，为了符合行相加为1的约束，需要增大 $\boldsymbol &#123; \mathcal &#123; a &#125; &#125; _ &#123; 2 2 &#125;$ 的值

调整后校正系数： $[ a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; ] = [ - 0 . 3 8 5 , 1 . 2 4 9 7 , 0 . 1 3 5 8 ]$



红色塑料片： $\mathsf &#123; R G B &#125; = [ 2 0 8 , 5 6 , 7 6 ]$

(2) 案例2 肤色偏黄绿：



红色框内的肤色偏黄绿，RGB = [216, 174, 124]，其中G分量偏大，B分量偏小；

原校正系数： $\left[ \begin&#123;array&#125; &#123; l &#125; &#123; \alpha _ &#123; 2 1 &#125; , \alpha _ &#123; 2 2 &#125; , \alpha _ &#123; 2 3 &#125; &#125; \\ &#123; \alpha _ &#123; 3 1 &#125; , \alpha _ &#123; 3 2 &#125; , \alpha _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; - 0 . 3 1 9 2 &#125; & &#123; 1 . 6 9 2 7 &#125; & &#123; - 0 . 3 7 3 5 &#125; \\ &#123; 0 . 0 2 3 9 &#125; & &#123; - 0 . 5 7 3 8 &#125; & &#123; 1 . 5 4 9 9 &#125; \end&#123;array&#125; \right]$ 同案例1，减小G分量，大幅度减小$\boldsymbol &#123; \alpha &#125; _ &#123; 2 2 &#125;$ 和增大 $\alpha _ &#123; 2 3 &#125;$ ，微调 $\alpha _ &#123; 2 1 &#125;$ ，



此时相应位置的肤色：RGB = [212, 169, 124]；

为增大B分量，因为R分量值较大，因此大幅度增大 $\alpha _ &#123; 3 1 &#125;$ ，确保行和为1，需要减小 $\alpha _ &#123; 3 2 &#125;$ 和 $a _ &#123; 3 3 &#125;$



调整后校正系数： $\left[ \begin&#123;array&#125; &#123; l &#125; &#123; a _ &#123; 2 1 &#125; , a _ &#123; 2 2 &#125; , a _ &#123; 2 3 &#125; &#125; \\ &#123; a _ &#123; 3 1 &#125; , a _ &#123; 3 2 &#125; , a _ &#123; 3 3 &#125; &#125; \end&#123;array&#125; \right] = \left[ \begin&#123;array&#125; &#123; l l l &#125; &#123; - 0 . 3 0 0 4 &#125; & &#123; 1 . 6 3 7 5 &#125; & &#123; - 0 . 3 3 7 1 &#125; \\ &#123; 0 . 2 1 2 7 &#125; & &#123; - 0 . 7 2 9 4 &#125; & &#123; 1 . 5 1 6 6 &#125; \end&#123;array&#125; \right]$

此时相应位置的肤色： $&#123; \sf R G B &#125; = [ 2 1 4 , 1 6 9 , 1 4 6 ]$

## 4 3DLUT

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

3D LUT为9x9x9，表中没有记录的值可以通过三线性插值得到

### 4.3 关键参数

参数见IQ json文件的lut3d节点。

### 使能控制及模式选择

在tuning节点下


| 参数 | 描述 |
| --- | --- |
| opMode | 工作模式，取值RK_AIQ_OP_MODE_AUTO或RK_AIQ_OP_MODE_MANUALRK_AIQ_OP_MODE_AUTO表示使用stAuto和calibdb进行自动3DLUT校正，RK_AIQ_OP_MODE_MANUAL表示使用stMan参数 |
| en | 模块使能，1表示使能；取值0或1 |
| bypass | 模块bypass，预留，暂不使用 |

### 自动3DLUT（A3DLUT)

A3DLUT基于标定参数calibdb和调试参数stAuto，可根据不同光源不同增益下进行动态自适应调整。

### 标定参数 calibdb-&gt;tableAll


| 参数 | 描述 |
| --- | --- |
| sw_lut3dC_illu_name | 光源名 |
| meshGain |  |
| hw_lut3dC_lutR_val | R通道查找表，取值范围：[0,1023] |
| hw_lut3dC_lutG_val | G通道查找表，取值范围：[0,4095] |
| hw_lut3dC_lutB_val | B通道查找表，取值范围：[0,1023] |

### 3DLUT光源相关控制参数（stAuto-&gt;dyn-&gt;illuLink）

根据实际白平衡增益自动选择标准白平衡增益最接近的光源参数，每个光源下可通过调整gain2StrgCurve以实现在不同曝光增益下的3DLUT表的动态调整。


| 参数 | 描述 |
| --- | --- |
| sw_lut3dC_illu_name | 光源名 |
| sw_lut3dC_wbGainR_val | 光源对应的标准白平衡R通道增益，由标定工具生成，取值大于0 |
| sw_lut3dC_wbGainB_val | 光源对应的标准白平衡B通道增益，由标定工具生成，取值大于0 |
| gain2StrgCurve |  |
| sw_lut3dT_isoldx_val | gains-alpha之曝光增益分量，小数，取值大于0 |
| sw_lut3dT_alpha_val | gains-alpha之强度分量alpha，小数，取值范围：[0，1] |

### 注意事项

illuLink配置的光源必须有对应的标定参数。

### 帧间过渡控制


| 参数 | 描述 |
| --- | --- |
| sw_lut3dT_damp_en | 帧间平滑功能开关，1表示使用该功能；取值0或1 |

### 4.4 3DLUT 标定与调整

RKISP 3D-LutTool 基于LAB色彩模型，将 A-B （颜色通道）直角坐标系转换为 C（饱和度）- H（色调）极坐标系，输入支持 jpg/bmp/png/yuv/nv12 格式。如图4.4-2所示，原点 O 饱和度为0，径向朝外饱和度递增，由红色箭头逆时针旋转改变色调。《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》2.6章节 ”3D-LUT工具“介绍了其界面及使用方法。





图4.4-1 增强绿色饱和度





图4.4-2 改变红色色调

### 调整步骤

1. 采集图像，关闭3DLUT及其后置模块（YNR/SHARP/CNR等），为方便观察3DLUT是否引入其他影响，最好采集yuv图像；

2. 导入图像，参照《Rockchip\_IQ\_Tools\_Guide\_ISP2x\_CN》”3D-LUT工具“说明；

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



### （3）效果对比：







## 5 HSV

### 5.1 3DLUT VS. HSV

HSV与3DLut都处在ISP Pipline上RGB域的最后一级模块，其功能都是根据喜好去调整个别的颜色，前者基于HSV颜色空间，后者基于RGB空间，两者差异如下：


|  | 3DLUT | HSV |
| --- | --- | --- |
| 平台 | ISP2X/ISP30/ISP39 | ISP33 |
| 颜色空间 | RGB | HSV |
| Lut组成 | RGB通道映射表，每个通道映射表大小为9x9x9 | 由2个1维查找表(1x65)和一个2维查找表(17x17)组成，每个查找表的输入输出通道都可配置；其中1维查找表支持配置增量输出 |

### 5.2 功能说明

### 1维查找表 (1DLUT)

输入X可以选择色相（Hue）/饱和度（Sat）/明度（Value）任一通道，同样可以选择任一通道增量作为Y。将其等间距采样得到65个采样点，可通过配置65个采样点的Y值，进行颜色调整。

常见的输入输出映射关系有：Hue-&gt;ΔHue、Hue-&gt;ΔSat、Hue-&gt;ΔValue。

Hue-&gt;ΔHue  



### Hue-&gt;ΔSat



Hue-&gt;ΔValue  



### 2维查找表 (2DLUT)

输入X可以选择HuexSat/HuexValue/SatxValue任一输入组合，同样可以选择Hue/Sat/Value任一通道的映射值作为Y。将其等间距采样得到17x17个采样点，可通过配置17x17个采样点的Y值，进行颜色调整。

常见的输入输出映射关系有：HuexSat-&gt;Hue、HuexSat-&gt;Sat、SatxValue-&gt;Sat、SatxValue-&gt;Value。



HuexSat-&gt;Sat  





SatxValue-&gt;Value  



### 5.3 关键参数

参数见IQ json文件的hsv节点。

### 使能控制及模式选择

在tuning节点下


| 参数 | 描述 |
| --- | --- |
| opMode | 工作模式，取值RK_AIQ_OP_MODE_AUTO或RK_AIQ_OP_MODE_MANUALRK_AIQ_OP_MODE_AUTO表示使用stAuto和calibdb进行自动HSV校正，RK_AIQ_OP_MODE_MANUAL表示使用stMan参数 |
| en | 模块使能，1表示使能；取值0或1 |
| bypass | 模块bypass，预留，暂不使用 |

### 查找表使能控制

在sta节点下


| 参数 | 描述 |
| --- | --- |
| hw_hsvT_lut1d0_en | 1维查找表lut1d0使能，1表示使能；取值0或1 |
| hw_hsvT_lut1d1_en | 1维查找表lut1d1使能，1表示使能；取值0或1 |
| hw_hsvT_lut2d_en | 2维查找表lut2d使能，1表示使能；取值0或1 |

### 1维查找表 (1DLUT)


| 参数 | 描述 |
| --- | --- |
| hw_hsvT_lut1d_mode | 输入输出模式，取值hsv_lut1d_h2hDiff_mode、 hsv_lut1d_h2sDiff_mode、hsv_lut1d_h2vDiff_mode、 hsv_lut1d_s2sDiff_mode。 hsv_lut1d_h2hDiff_mode：选择Hue作为输入通道，Hue增量作为输 出; hsv_lut1d_h2sDiff_mode：选择Hue作为输入通道，Sat增量作为输 出; hsv_lut1d_h2vDiff_mode：选择Hue作为输入通道，Value增量作为输 |
| hw_hsvT_lut1d_val | 出; hsv_lut1d_s2sDiff_mode：选择Sat作为输入通道，Sat增量作为输出； 目前工具只支持前三种模式的调试； 65个采样点对应的增量映射值，取值范围：[-1024，1023] |

### 2维查找表 (2DLUT)


| 参数 | 描述 |
| --- | --- |
| hw_hsvT_lut2d_mode | 输入输出模式，取值hsv_lut2d_hs2h_mode、 hsv_lut2d_hv2h_mode、hsv_lut2d_sv2s_mode、 hsv_lut2d_hs2s_mode、hsv_lut2d_hv2v_mode、 hsv_lut2d_sv2v_mode。 hsv_lut2d_hs2h_mode：选择Hue和Sat作为输入通道，Hue作为输出； hsv_lut2d_hs2s_mode：选择Hue和Sat作为输入通道，Sat作为输出； hsv_lut2d_hv2h_mode：选择Hue和Value作为输入通道，Hue作为输 出; hsv_lut2d_hv2v_mode：选择Hue和Value作为输入通道，Value作为输 出; hsv_lut2d_sv2s_mode：选择Sat和Value作为输入通道，Sat作为输出； hsv_lut2d_sv2v_mode：选择Sat和Value作为输入通道，Value作为输 |
| hw_hsvT_lut2d_val | 出; 17x17个采样点对应的映射值，取值范围：[0，1023] |

### 注意事项

3个查找表的输出通道必须不同，否则黑屏。

### 自动HSV（AHSV)

AHSV基于标定参数calibdb和调试参数stAuto，可根据不同光源不同增益下进行动态自适应调整。标定参数 calibdb-&gt;tableAl


| 参数 | 描述 |
| --- | --- |
| sw_hsvC_illu_name | 光源名 |
| meshGain |  |
| lut1d0 | 1维查找表lut1d0参数 |
| lut1d1 | 1维查找表lut1d1参数 |
| lut2d | 2维查找表lut2d参数 |

### HSV光源相关控制参数（stAuto-&gt;dyn-&gt;illuLink）

根据实际白平衡增益自动选择标准白平衡增益最接近的光源参数，每个光源下可通过调整gain2StrgCurve以实现在不同曝光增益下的3DLUT表的动态调整。


| 参数 | 描述 |
| --- | --- |
| sw_hsvC_illu_name | 光源名 |
| sw_hsvC_wbGainR_val | 光源对应的标准白平衡R通道增益，由标定工具生成，取值大于0 |
| sw_hsvC_wbGainB_val | 光源对应的标准白平衡B通道增益，由标定工具生成，取值大于0 |
| gain2StrgCurve |  |
| sw_hsvT_isoldx_val | gains-alpha之曝光增益分量，小数，取值大于0 |
| sw_hsvT_alpha_val | gains-alpha之强度分量alpha，小数，取值范围：[0，1] |

### 注意事项

illuLink配置的光源必须有对应的标定参数。

### 帧间过渡控制


| 参数 | 描述 |
| --- | --- |
| sw_hsvT_wbgainDiff_th | 白平衡增益变化容忍度：白平衡增益统计值差值小于该阈值时，可认为白平衡增益满足AHSV稳定条件；取值范围0.0-1；建议值：0.3 |
| sw_hsvT_gainDiff_th | 曝光增益变化容忍度：曝光增益统计值差值小于该阈值时，可认为曝光增益满足AHSV稳定条件；取值范围0.0-1；建议值：0.5 |
| sw_hsvT_damp_en | 帧间平滑功能开关，1表示使用该功能；取值0或1 |

### 5.4 HSV调试

### 调整步骤

1. 关闭HSV及其后置模块（YNR/SHARP/CNR等），为方便观察HSV是否引入其他影响，最好采集yuv图像；

2. 在调试工具界面上定位需要调整的像素点坐标，依据需求调整：

### 2.1 调整指定色相饱和度

（1）简单：使用1维查找表，选择hsv\_lut1d\_h2hDiff\_mode，调整对应色相的hw\_hsvT\_lut1d\_val值。应用示例：调整人脸肤色、增强绿色饱和度。

（2）高级：使用2维查找表，选择hsv\_lut2d\_hs2s\_mode，调整对应色相及饱和度的hw\_hsvT\_lut2d\_val值。应用示例：增强绿色饱和度。相较于（1），呈现效果颜色更均匀，引入影响较小。

### 2.2 调整指定色相亮度

使用HSV调整亮度，会放大一定的噪声。

（1）简单：使用1维查找表，选择hsv\_lut1d\_h2vDiff\_mode，调整对应色相的hw\_hsvT\_lut1d\_val值。应用示例：提亮人脸肤色、绿色提亮。

（2）高级：使用2维查找表，选择hsv\_lut2d\_hv2v\_mode，调整对应色相及亮度的hw\_hsvT\_lut2d\_val值。应用示例：绿色提亮。

### 2.3 调整指定色相

使用1维查找表，选择hsv\_lut1d\_h2hDiff\_mode，调整对应色相的hw\_hsvT\_lut1d\_val值。应用示例：结合2.1（1）用于调整人脸肤色。

3. 生成HSV参数后，应用参数在色彩丰富的场景，观察色彩是否符合预期。

### 注意事项

一旦HSV前置色彩相关模块做出较大变动，需要重新调整HSV。

3个查找表的输出通道必须不同，否则黑屏。如若3个查找表的输出通道有重复的，使用工具调试时工具会给出如下警告：





Warning  

The Y-axis of LUT0、LUT1、 LUT2 cannot be the same!  

LUT0=hsv\_lut1d\_h2hDiff\_mode, LUT1=hsv\_lut1d\_h2vDiff\_mode,  

LUT2=hsv\_lut2d\_hs2h\_mode

同时Aiq运行窗口给出提示，并关闭HSV功能。

### 案例

### 调整人脸肤色

（1）调整肤色色相：原肤色偏黄绿，使用lut1d0，选择hsv\_lut1d\_h2hDiff\_mode，调整肤色色相在工具界面的对应点，使其偏红；



（2）降低肤色饱和度：使用lut2d，选择hsv\_lut1d\_hs2sDiff\_mode，降低肤色在工具界面的对应点的饱和度；



（3）效果对比：





### 增强绿植饱和度

（1）使用lut2d，选择hsv\_lut1d\_hs2sDiff\_mode，增加绿植在工具界面的对应点的饱和度；  



（2）效果对比：


