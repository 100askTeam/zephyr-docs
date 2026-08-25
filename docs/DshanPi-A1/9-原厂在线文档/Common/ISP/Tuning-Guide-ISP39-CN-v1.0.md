---
sidebar_position: 1
---

# Rockchip Tunning Guide ISP39

### 前⾔

## 概述

本⽂旨在指导⽤⼾进⾏图像调优的⽂档。

产品版本


| 芯片名称 | ISP版本 |
| --- | --- |
| RK3576 | ISP3.9 |

## 读者对象

本⽂档（本指南）主要适⽤于以下⼯程师：

### ISP图像效果调试⼯程师

## 修订记录


| 版本号 | 修改记录 | 修改日期 | 作者 |
| --- | --- | --- | --- |
| alpha | 初版 | 2024-4-8 | ALL |
| v1.0 | btnr、ynr、cnr、sharp模块 | 2024-5-28 | ALL |

### ⽬录

Rockchip Tunning Guide ISP39ISP39 IntroductionISP39 框图ISP39模块迭代列表ISP39 约束模块介绍前置说明模块控制模式参数规则参数名称结构参数类型域说明模块简称域说明参数描述域简称说明曲线类参数说明参数属性域说明参数分类特殊说明BLC模块说明模块约束模块框图参数说明DPC模块说明模块约束模块框图参数说明BTNR模块说明模块约束模块框图模块概念前置说明参数说明hw\_btnrCfg\_pixDomain\_modeStatic:hw\_btnrCfg\_pixDomain\_modetransCfgStatic: hw\_btnr\_trans\_modeStatic: hw\_btnr\_trans\_offsetStatic: hw\_btnr\_transData\_maxLimitsigmaEnvStatic: sw\_btnrCfg\_sigma\_modedebugStatic: sw\_btnrT\_dbgOut\_en

Static: hw\_btnrT\_dbgOut\_mode hw\_btnrT\_md\_en mdDynamic: hw\_btnrT\_md\_en mdSigma mdDynamic: hw\_btnrT\_sigma\_scale mdDynamic: hw\_btnrT\_sigmaHdrS\_scale mdDynamic: hw\_btnrT\_sigmaCurve\_mode subLoMd0\_diffCh mdDynamic: hw\_btnrT\_vFilt\_en mdDynamic: hw\_btnrT\_hFilt\_en mdDynamic: hw\_btnrT\_vIIRFstLn\_scale mdDynamic: hw\_btnrT\_vIIRFilt\_strg subLoMd0\_sgmCh mdDynamic: hw\_btnrT\_hFilt\_en mdDynamic: hw\_btnrT\_vIIRFstLn\_scale mdDynamic: hw\_btnrT\_vIIRFilt\_strg subLoMd0\_wgtOpt mdDynamic: hw\_btnrT\_mdWgt\_negOff mdDynamic: hw\_btnrT\_mdWgt\_scale subLoMd1 mdDynamic:hw\_btnrT\_lpf\_en mdDynamic:sw\_btnrT\_lpfCfg\_mode mdDynamic:hw\_btnrT\_lpfSpatial\_wgt mdDynamic:sw\_btnrT\_lpf\_strg mdDynamic:hw\_btnrT\_mdWgt\_maxLimit mdDynamic:hw\_btnrT\_mdWgt\_negOff mdDynamic:hw\_btnrT\_mdWgtFstLnNegOff\_en mdDynamic:hw\_btnrT\_mdWgtFstLn\_negOff mdDynamic:hw\_btnrT\_mdWgt\_scale mdDynamic:hw\_btnrT\_hFilt\_en mdDynamic:hw\_btnrT\_vIIRFilt\_strg loMd mdDynamic:hw\_btnrT\_loMd\_en mdDynamic:hw\_btnrT\_loMd\_mode mdDynamic:hw\_btnr\_preWgtMge\_scale mdDynamic:hw\_btnr\_preWgtMge\_offset hw\_btnrT\_md\_mode mdDynamic:hw\_btnrT\_md\_mode loAsHiRatioMd mdDynamic:hw\_btnrT\_hfLpf\_en mdDynamic:sw\_btnrT\_hfLpfCfg\_mode mdDynamic:hw\_btnrT\_hfLpfSpatial\_wgt mdDynamic:sw\_btnrT\_hfLpf\_strg mdDynamic:hw\_btnrT\_loWgtStat\_scale mdDynamic:hw\_btnrT\_loWgtStatHdrS\_scale mdDynamic:hw\_btnrT\_hiMdWgt\_scale mdDynamic:hw\_btnrT\_loWgtStat\_negOff mdDynamic:hw\_btnrT\_loWgtStatHdrS\_negOff mdDynamic:hw\_btnrT\_loWgtStat\_scale mdDynamic:hw\_btnrT\_loWgtStatHdrS\_scale mdDynamic:hw\_btnrT\_loWgtStat\_offset mdDynamic:hw\_btnrT\_loWgtStatHdrS\_offset mdDynamic:hw\_btnr\_loWgtStat\_minLimit mdDynamic:hw\_btnrT\_mdWgt\_scale mdDynamic:hw\_btnrT\_mdWgtHdrS\_scale mdWgtPost mdDynamic:hw\_btnr\_lpfSpatial\_wgt sigmaEnv

Dynamic:hw\_btnrT\_statsPixAlpha\_thred Dynamic:hw\_btnrCfg\_statsPixCnt\_thred Dynamic:sw\_btnrT\_autoSgmIIR\_alpha Dynamic:hw\_btnrC\_curSpNrSgm\_curve Dynamic:hw\_btnrC\_preSpNrSgm\_curve Dynamic:hw\_btnrC\_mdSigma\_curve curFrmSpNr Dynamic:hw\_btnrT\_spNr\_en Dynamic:hw\_btnrT\_sigmaIdxLpf\_en Dynamic:hw\_btnrT\_sigmaCurve\_mode Dynamic:hw\_btnrT\_sigma\_scale Dynamic:hw\_btnrT\_sigmaHdrS\_scale Dynamic:hw\_btnrT\_sigma\_offset Dynamic:hw\_btnrT\_sigmaHdrS\_offset Dynamic:sw\_btnrT\_filtSpatial\_strg Dynamic:hw\_btnrT\_pixDiff\_maxLimit Dynamic:hw\_btnrT\_pixDiff\_negOff Dynamic:hw\_btnrT\_pixDiff\_scale Dynamic:hw\_btnrT\_spNrOut\_alpha preFrmSpNr Dynamic:hw\_btnrT\_spNr\_en Dynamic:hw\_btnrT\_sigmaIdxLpf\_en Dynamic:hw\_btnrT\_sigmaCurve\_mode Dynamic:hw\_btnrT\_sigma\_scale Dynamic:hw\_btnrT\_sigmaHdrS\_scale Dynamic:hw\_btnrT\_sigma\_offset Dynamic:hw\_btnrT\_sigmaHdrS\_offset Dynamic:hw\_btnrT\_sigma\_mode Dynamic:sw\_btnrT\_filtSpatial\_strg Dynamic:hw\_btnrT\_pixDiff\_maxLimit Dynamic:hw\_btnrT\_pixDiff\_negOff Dynamic:hw\_btnrT\_pixDiff\_scale Dynamic:hw\_btnrT\_spNrOut\_alpha frmAlpha Dynamic:hw\_btnrT\_loAlpha\_minLimit Dynamic:hw\_btnrT\_loAlphaHdrS\_minLimit Dynamic:hw\_btnrT\_loAlpha\_maxLimit Dynamic:hw\_btnrT\_loAlphaHdrS\_maxLimit Dynamic:hw\_btnrT\_hiAlpha\_minLimit Dynamic:hw\_btnrT\_hiAlphaHdrS\_minLimit Dynamic:hw\_btnrT\_hiAlpha\_maxLimit Dynamic:hw\_btnrT\_hiAlphaHdrS\_maxLimit hw\_btnrT\_noiseBal\_mode Dynamic:hw\_btnrT\_noiseBal\_mode noiseBal\_byHiAlpha Dynamic:hw\_btnrT\_curHiOrg\_alpha Dynamic:hw\_btnrT\_iirHiOrg\_alpha noiseBal\_byLoAlpha Dynamic:hw\_btnrT\_hiMotionNr\_strg localSgmStrg Dynamic:hw\_bnrT\_localSgmStrg\_maxLimit   

模块说明 模块约束 模块框图   

数说明 ynrScl\_radi Static: hw\_ynrCfg\_opticCenter\_x Static: hw\_ynrCfg\_opticCenter\_y Dynamic: hw\_ynrT\_radiDist2YnrScl\_val ynrScl\_locSgmStrg Dynamic:hw\_ynrT\_glbSgmStrg\_val Dynamic:hw\_ynrT\_glbSgmStrg\_alpha Dynamic:hw\_ynrT\_locSgmStrg2YnrScl\_val hw\_ynrC\_luma2Sigma\_curve Dynamic:hw\_ynrC\_luma2Sigma\_curve hw\_ynrC\_luma3Sigma\_curve Dynamic:hw\_ynrC\_luma3Sigma\_curve hw\_ynrT\_loNr\_en Dynamic:hw\_ynrT\_loNr\_en loNr\_preProc Dynamic:sw\_ynrT\_preLpfCfg\_mode Dynamic:hw\_ynrT\_preLpfSpatial\_wgt Dynamic:sw\_ynrT\_preLpf\_strg Dynamic:sw\_ynrT\_edgeDctConf\_scale loNr\_iirGuide Dynamic:hw\_ynrT\_localYnrScl\_alpha Dynamic:sw\_ynrT\_iirFilt\_strg Dynamic:hw\_ynrT\_pixDiffEge\_thred Dynamic:hw\_ynrT\_centerPix\_wgt Dynamic:hw\_ynrT\_iirInitWgt\_scale Dynamic:hw\_ynrT\_softThd\_scale loNr\_bifilt Dynamic:hw\_ynrT\_rgeSgm\_scale Dynamic:hw\_ynrT\_filtSpatialV\_strg Dynamic:hw\_ynrT\_filtSpatialH\_strg Dynamic:hw\_ynrT\_centerPix\_wgt Dynamic:hw\_ynrT\_bifiltOut\_alpha hiNr\_filtProc Dynamic:hw\_ynrT\_nlmFilt\_en Dynamic:hw\_ynrT\_localYnrScl\_alpha Dynamic:hw\_ynrT\_nlmSgm\_minLimit Dynamic:hw\_ynrT\_nlmSgm\_scale Dynamic:hw\_ynrT\_nlmRgeWgt\_negOff Dynamic:hw\_ynrT\_centerPix\_wgt Dynamic:hw\_ynrT\_nlmSpatial\_wgt hiNr\_alphaProc Dynamic:hw\_ynrT\_nlmOut\_alpha Dynamic:hw\_ynrT\_edgAlphaUp\_thred Dynamic:hw\_ynrT\_locSgmStrgAlphaUp\_thred   

试步骤   

块说明 模块约束 模块框图   

数说明 localSgmStrg Dynamic: hw\_cnrT\_glbSgmStrg\_val Dynamic: hw\_cnrT\_glbSgmStrg\_alpha Dynamic: hw\_cnrT\_localSgmStrg\_scale loNr\_preProc Dynamic: hw\_cnrT\_ds\_mode Dynamic: hw\_cnrT\_uvEdg\_strg loNr\_bifilt Dynamic: hw\_cnrT\_ds\_mode Dynamic: sw\_cnrT\_filtSpatial\_strg Dynamic: hw\_cnrT\_filtSpatial\_wgt Dynamic: sw\_cnrT\_rgeSgm\_val Dynamic: hw\_cnrT\_bifiltOut\_alpha loNr\_iirFilt Dynamic: hw\_cnrT\_filtSpatial\_wgt Dynamic:sw\_cnrT\_rgeSgm\_val Dynamic: sw\_cnrT\_rgeSgmRatio\_mode Dynamic: hw\_cnrT\_glbSgm\_ratio Dynamic: hw\_cnrT\_glbSgmRatio\_alpha Dynamic: hw\_cnrT\_sgm2NhoodWgt\_slope Dynamic: hw\_cnrT\_nhoodWgtZero\_thred Dynamic: hw\_cnrT\_iirFiltStrg\_maxLimit hiNr\_preLpf Dynamic: sw\_cnrT\_filtCfg\_mode Dynamic: sw\_cnrT\_filtSpatial\_strg Dynamic: hw\_cnrT\_filtSpatial\_wgt Dynamic: hw\_cnrT\_lpfOut\_alpha hw\_cnrC\_luma2HiNrSgm\_curve Dynamic: hw\_cnrC\_luma2HiNrSgm\_curve Dynamic: hw\_cnrC\_luma2HiNrSgm\_curve hiNr\_bifilt Dynamic: hw\_cnrT\_uvEdg\_strg Dynamic: hw\_cnrT\_filtWgtZero\_mode Dynamic: hw\_cnrT\_locSgmStrg2SgmRat\_val Dynamic: hw\_cnrT\_locSgmStrg2CtrWgt\_scale Dynamic: hw\_cnrT\_centerPix\_wgt Dynamic:hw\_cnrT\_nhoodWgt\_minLimit Dynamic: hw\_cnrT\_satAdj\_negOff Dynamic: hw\_cnrT\_satAdj\_scale Dynamic: hw\_cnrT\_bifiltOut\_alpha   

调试步骤   

P   

模块说明 模块框图   

参数说明 shpScl\_radiDist Static: hw\_sharpCfg\_opticCenter\_x Static: hw\_sharpCfg\_opticCenter\_y hfExtra\_sgmEnv Dynamic: sw\_sharpC\_luma2Sigma\_curve hfExtra\_preBifilt Dynamic: sw\_sharpT\_filtCfg\_mode Dynamic: sw\_sharpT\_filtSpatial\_strg Dynamic: hw\_sharpT\_filtSpatial\_wgt[3] Dynamic: sw\_sharpT\_rgeSgm\_scale Dynamic: sw\_sharpT\_rgeSgm\_offset Dynamic: hw\_sharpT\_bifiltOut\_alpha hfExtra\_lpf Dynamic: sw\_sharpT\_filtCfg\_mode Dynamic:sw\_sharpT\_hfHi\_strg Dynamic:sw\_sharpT\_hfMid\_strg Dynamic:hw\_sharpT\_lpf\_wgt Dynamic:hw\_sharpT\_lpfOut\_alpha hfExtra\_hfBifilt Dynamic:sw\_sharpT\_filtCfg\_mode Dynamic:sw\_sharpT\_filtSpatial\_strg Dynamic:hw\_sharpT\_filtSpatial\_wgt Dynamic:sw\_sharpT\_rgeSgm\_scale

Dynamic:sw\_sharpT\_rgeSgm\_offset Dynamic:hw\_sharpT\_biFiltOut\_alpha shpScl\_hf Dynamic:hw\_sharpT\_luma2hfScl\_val Dynamic:hw\_sharpT\_hf2ShpScl\_val shpScl\_locSgmStrg Dynamic:hw\_sharpT\_locSgmStrg\_mode Dynamic:hw\_sharpT\_glbSgmStrg\_val Dynamic:hw\_sharpT\_glbSgmStrg\_alpha Dynamic:hw\_sharpT\_locSgmStrg\_scale shpScl\_textDetect Dynamic:hw\_sharpT\_estNsFilt\_mode Dynamic:hw\_sharpT\_estNsClip\_mode Dynamic:hw\_sharpT\_estNsManual\_maxLimit Dynamic:hw\_sharpT\_estNs\_scale sharpOpt Dynamic:hw\_sharpT\_shpSrc\_mode Dynamic:hw\_sharpT\_shpOpt\_mode Dynamic:hw\_sharpT\_hfHiGlbShpScl\_val Dynamic:hw\_sharpT\_hfMidGlbShpScl\_val Dynamic:hw\_sharpT\_locSgmStrg2ShpScl\_val Dynamic:hw\_sharpT\_radiDist2ShpScl\_val Dynamic:hw\_sharpT\_tex2ShpScl\_scale Dynamic:hw\_sharpT\_texShpSclRemap\_en Dynamic:hw\_sharpT\_texShpSclRemap\_val Dynamic:sw\_sharpT\_bwEdgClipIdx\_mode Dynamic:hw\_sharpT\_luma2WhtEdg\_maxLimit Dynamic:hw\_sharpT\_luma2BkEdg\_maxLimit 调试步骤

### ISP39 Introduction

### ISP39 框图



图2-1 ISP39 Block Diagram

### ISP39模块迭代列表

模块版本规则：ModuleNameXY

ModuleName：模块名称简写

X：模块主版本号，算法整体更新主版本号升级，不同主版本号之间的调试参数基本认为⽆参考性。

Y：模块⼦版本号，算法迭代升级⼦版本号升级，仅⼦版本号差异的调试参数基本可作参考。


| Module | ISP39 | ISP32 |
| --- | --- | --- |
| awbStats | awbStats33feature未做升级，内部实现更新 | awbStats32 |
| aeStats | aeStats25新增统计数据源btnrOut_mode，支持HDR build-in CIS | aeStats23 |
| afStats | afStats33feature未做升级，内部实现更新，减少硬件约束 | afStats31 |
| blc | blc30 | blc30 |
| btnr | btnr40算法更新，详见btnr章节 | btnr32 |
| cac | cac21 | cac21 |
| ccm | ccm22新增支持局部饱和度调整曲线sat2Alpha | ccm21 |
| cSm | csm21 | csm21 |
| cnr | cnr34新增根据locSgmStrg进行局部滤波力度调整的调试曲线 | cnr32 |
| degm | degm20 | degm20 |
| dm | dm23新增根据图像亮度进行局部方向插值力度调整的调试曲线 | dm21 |
| dpc | dpc20 | dpc20 |
| drc | drc401. 解决drc32的高动态场景下运动物体的亮度闪烁2. 优化融合区域低频的锯齿 | drc32 |
| dehaze | dehze23局部对比度提升 | dehaze22 |
| enhance | enha nce23局部对比度提升 |  |
| gamma | gamma21 | gamma21 |
| gic | gic21 | gic21 |
| histeq | histeq23局部对比度提升 | hisreq21 |
| hdrmge | hdrmge22 | hdrmge22 |
| Isc | Isc21 | 1sc21 |
| ldc | ldc23新增支持垂直方向畸变校正 | ldc22 |
| rgb-ir | rgbir10新增featrue | no |
| sharp | sharp34升级强弱边缘局部锐化力度调整曲线 | sharp32 |
| ynr | ynr34升级为低频//R降噪，解决帧间低频残影 | ynr32 |
| yuvme | yuvme10新增feature | no |

### ISP39 约束

该章节说明的约束是ISP39 各模块之间硬件约束，以及ISP pipeline的规格、性能约束。模块内部的功能约束请直接参考各模块的"模块说明" "模块约束"章节。

1. cnr、ynr、sharp 3个模块都不⽀持单独的模块使能操作，这3个模块的使能操作必须保持⼀致，即3个模块都使能或者是都关闭。

IQ Tool：

鉴于该约束，界⾯上仅提供统⼀的Enable按钮来同步开关这3个模块 。

AIQ：

APP 通过这3个模块的setAttrib API单独控制模块的使能时，AIQ HWI层会采⽤模块效果旁路功能来代替实现。⽤⼾需要关注API的LOG信息。

2. drc模块⼯作时依赖cac、gic的资源，所以drc使能时，cac、gic模块也必须处于使能⼯作状态。

IQ Tool、AIQ：

鉴于该约束，界⾯上操作drc、cac、gic模块的使能按钮触发该约束时，或是APP通过这3个模块的setAttrib API单独控制模块的使能触发该约束时， AIQ HWI层都会进⾏的相关的操作来近似实现⽤⼾需求，主要分为以下3种情况，同时IQ Tool LOG区以及AIQ 都会提供相关提醒信息。


| 源状态 | 用户需求目标状态 | AIQ 实际目标状态 |
| --- | --- | --- |
| gic: disablecac: disabledrc : disable | gic: disablecac: disabledrc : enable, no bypass | gic: enable, bypassscac: enable, bypasssdrc : enable, no bypass |
| gic: enablecac: enabledrc: enable | gic: disablecac: enable, no bypassdrc : enable, no bypass | gic: enable, bypasscac: enable, no bypassdrc : enable, no bypass |
| gic: enablecac: enabledrc : enable | gic: enable, no bypasscac: disabledrc : enable, no bypass | gic: enable, no bypasscac: enable, bypassdrc : enable, no bypass |

3. expand模块与hdr mge模块不⽀持同时使⽤。

### 模块介绍

### 前置说明

SW\_Package\_ISP39 为RK 针对ISP39开发的软件包，该软件包由3部分软件组成：IQ Tool、AIQ、ISPDriver

### 模块控制模式

SW\_Package\_ISP39 软件包中，针对ISP39模块控制模式具备以下3种控制操作：

### 使能控制(Enable)

ISP模块硬件在使能(Enable)状态下才能⼯作。

### 效果旁路控制(Bypass)

ISP模块硬件在使能状态下，模块内部数据处理被旁路，即该模块输⼊直接旁路为输出，效果等效于⽆处理。

注意：此时ISP模块硬件依旧在⼯作，所以功耗、带宽、内存等与未旁路没有区别。

### AIQ模块运⾏模式控制(Mode)

⾃动模式(Auto)下，RK AIQ软件在3A驱动下，依照RK的控制策略⽣成ISP各模块的参数，下发⾄ISPDriver配置给ISP硬件。

⼿动模式(Manual)下，⽤⼾通过AIQ API直接下发⼿动模式下的各模块参数，AIQ直接将参数下发⾄ISP Driver。

### 参数规则


| 软件组件名称 | 运行环境 | 用户 | 参数命名规则 |
| --- | --- | --- | --- |
| IQ Tool | IQ效果调试工具(PC端) | 效果调试工程师 | 界面参数符合该参数规则 |
| AIQ | ISP控制软件(板端系统用户层) | 应用软件工程师 | 模块级用户API形参符合该参数规则 |
| ISPDriver | 内核ISP驱动软件(板端系统内核层) | 应用软件工程师 | 直接采用硬件级寄存器相关名称，不符合该参数规则 |

### 参数名称结构

The API parameters of the board end ISP software and the IQ debugging tool parameters are unified. The parameter name structure is as follows:

Parameter type\_ISP module and parameter classification\_Parameter description\_Parameter attribute

Example:

"hw\_bnrCfg\_logTrans\_mode"

\*Parameter type is 'hw'.\*

\*ISP module and parameter classification is 'bnrCfg'.\*

\*Parameter description is 'logTrans'.\*

### 参数类型域说明

Parameter type is the first part of parameter name. The parameter types are as follows:

HW identifies that the parameter is used to directly control some functions of a module in the ISP pipeline hardware.

SW identifies the parameter controls the ISP pipeline by using some software strategy of the board software.

The software strategy may contain multiple hardware parameter combinations.

### 模块简称域说明

This is the second part of parameter name. It is the isp module that controlled by the parameter.   

Parameter classification is mainly based on the use and generation method of parameters.

The list of isp module abbreviations is as follows:

---a---

awb: auto white balance

ae: auto exposure

af: auto focus

---b---

blc: black level correction

btnr: temporal noise remove in bayer domain

bnr: spatial noise remove in bayer domain

---c---

cac: chromatic aberration correction

ccm: color correction matrix

csm: color space matrix

cnr: color noise remove

---d---

degm: degamma correction

dm: debayer / demosaic

dpcc: defect pixel cluster correction

drc: dynamic range compression

dehaze: dehaze

dehaze & ehz: dehaze and enhance //3576

---e---

enhance: enhance

---f---

fpn: fixed point noise correction

---g---

gamma: gamma correction

gic: green imbalance correction

---h---

histeq: historgram equalization

hdrmge: hdr merge

---l---

lsc: lens shading corretcion

ldch: lens distortion correction only in horizontal direction

---s---

sharp: sharp

---y---

ytnr: temporal noise remove in yuv domain

ynr: spatial noise remove in yuv domain

---3---

3dlut: color 3D lookup table

The list of parameter classification is as follows:

T: Tunning parameter

C: Calibration parameter

Cfg: Isp hardware configuration parameters. It can only be set through software API. It can't be set through IQ tool.

### 参数描述域简称说明

Parameter description is the third part of parameter name. It describes the function, characteristic or position of

the parameter. This part often uses word abbreviations.

The list of abbreviations is as follows:

### --a---

\*alpha: refers to the weighted operation between two data.

Ex ： alpha\_valdata\_a + (1 - alpha\_val)data\_b

### --b---

\* bifilt:

\*bnd:

bilateral filter

boundary

### --c----

\* cfg

configuration

\* chroma:

chrominance

\* clip:

clip

\* coord:

coordinate

\*cnt

count

\*conf:

confidence

\*comb ： combination

\*ctr / center: center

##

down scale

$^ &#123; * &#125; d i f f &#123; \mathrm &#123; : &#125; &#125;$

difference

$\star _ &#123; d r c t : &#125;$

direction

$^ &#123; * &#125; d s t / d i s t :$

distance

$^ &#123; * &#125; d y n ;$

dynamic

$\ast d c t i$

detection

$\ast _ &#123; d n &#125; .$

$^ &#123; * &#125; d r \colon$

down

\*dp:

dynamic range

defect pixel

### --e----

\*extra:

$\star _ &#123; e d g : &#125;$

extraction

\*edp ：

edge

$^ &#123; \ast &#125; e s t .$

endpoint

estimate

##

\* filt / flt:

\* frm:

filter

\* sfrm:

frame

hdr short exposure frame

\* mfrm:

hdr middle exposure frame

$\star _ &#123; I f r m : &#125;$

\*fst:

hdr long exposure frame

\*fbk:

first

$^ &#123; * &#125; F / R \mathrm &#123; : &#125;$

feedback

$\ast _ &#123; f a c : &#125;$

Finite Impulse Response filter

factor

### --g------

\* gaus:

\* glb / global

gaussian

\* guide:

global

\* grad:

guide

\* grp:

gradient

group

### --h----

\* hi/hf:

\* hpf:

high frequence

high pass filter

### --i----

\* inv:

\* interp:

invert

\*IIR:

interpolate

Infinite Impulse Response filter

### --l----

$^ &#123; * &#125; I o / / f .$

\* loc / local:

low frequence

local

$^ &#123; * &#125; I u m a ;$

luminance or raw pixel value

$\boldsymbol &#123; * &#125; \ I p f &#123; : &#125;$

low pass filter

$^ &#123; * &#125; I o g \mathrm &#123; : &#125;$

$* \rvert n \colon$

logarithm

line

$\star _  I e n : $

length

$\star _ &#123; L &#125; / e f t &#123; : &#125;$

$\star _ &#123; I t &#125; .$

left

left top

$^ &#123; * &#125; L 1 / L 2 \mathrm &#123; : &#125;$

level 1 / level 2

$^ &#123; * &#125; L V !$

level

$\ast _ &#123; L S : &#125;$

light source

\*LUT：

look-up table

### --n----

$^ &#123; * &#125; n o i s e &#123; : &#125;$

\* norize

noise

normalizate

### --m----

\* mfilt:

\*mtn:

median filter

\* md:

motion

motion detection

\*mech:

$^ &#123; * &#125; m a g \cdot$

Mechanism

$^ &#123; * &#125; m i d !$

magnitude

middle

##

\* neg:

negative

\*ns / noise:

$^ * n r \colon$

noise

noise remove

\* nhood

neighborhood

\*norm / nor:

$^ &#123; * &#125; n u m$

normal

$^ &#123; * &#125; n r s t &#123; : &#125;$

number

Nearest

### --o----

\* opt:

\* outlr:

operation

$^ &#123; * &#125; o r i \cdot$

outlier

original

### --p---

$&#123; &#125; ^ &#123; * &#125; p i x ;$

$* _ &#123; p r o c : &#125;$

pixel

\*peak ：

process

$\star P G \dot &#123; . &#125;$

peak

\*pred:

pixel gain

Predicted

### --r----

\* rge / range:

\* radi

range

radial / radius

\*R / right

$\ast _ &#123; r b : &#125;$

right

$&#123; &#125; ^ &#123; * &#125; r o t$

right bottom

\*rat / ratio:

rotate

ratio

\*ord / order:

order

### --s---

\*sat ：

saturation

\* softThd:

soft threshold

\* spatial:

\*stats:

spatial

statistics


| * · **wp: white point* |
| --- |

\*stat ： static

\*shp / sharp: sharp

\*sel: selected

\*squ: square

\*s1/s2: step 1/2/3

\*simp / smp: simplified

\*space / spc space

\* trans: transform

\* thred: threshold

\* texture: texture

\*vtx: vertex

\*vect ： vector

\* 2: to.

### 曲线类参数说明

The parameter description domain of curve parameters needs to reflect the mapping relationship. Example:

hw\_bnrC\_luma2Sigma\_curve

### 参数属性域说明

Parameter description mainly refer to the basic functions and characteristics of the parameter. This part often uses word abbreviations. The list of abbreviations is as follows:

\*alpha: Ex：

$$

```
a l p h a * d a t a _ { a } + ( 1 - a l p h a ) * d a t a _ { b }
```

$$

--b------

\* bit: Genetally indicates the enable bit for bitwise control.

coeff: coefficient: It is used for weight coefficient of filter.

count/cnt: count: It is statistical count.

en: enable: It is enable bit of function.

1: enable

0: disable

### --f----------------

\*fmt: data format. Generally, enumeration types are used to represent the definitions of data formats

\*\*facX: factor. It is a factor. \*

##

height: height. It is height of the rectangular area in the image coordinate system.

##

\*idx: index: It is index value of lookup table

● \*inv: multiplicative inverse

##

\*limit: It is used to limit the value range of data that pixel or parameter.

\*minLimit: minimum limit

\*maxLimit: maximum limit

### --n-----

### \*negOff: negative offset

As the negOff coefficient increases, its corresponding parameter value decreases.   

Example:parameter\_a = xxxx - xxxx\_negOffset；

### \*negScl: negative scale

As the negScl coefficient increases, its corresponding parameter value decreases.   

Example：parameter\_a = 1 - (xxxx \* negScl)；

\*num: number.

### --m----------------

mode: mode. It is used to identify multiple functions composed of single or multiple parameters.

Only a mode can be selected at the same time. It is generally implemented with enumeration

--o----

\*offset: offset. It is used for offset adjustment of parameter. As the offset coefficient increases, its corresponding parameter value increases.\* Example: parameter\_a = xxx + xxxx\_offset

\*radius / radi: radius: It is spatial radius of filter.

\*rat / ratio: ratio.

\*sigma: sigma rsigma: range sigma ssigma: spatial sigma

\*strg: strength: It is used to identify a function strength value. For example filter strength.

\*scale / scl: scale factor. Represents the scaling operation of the parameter. As the Scl coefficient increases, its corresponding parameter value increases. Example：parameter\_a = xxxx \* Scl;

\*step: step

\*thred: threshold: It is used for logical judgement.


| minThred |
| --- |

maxThred   

```
Example: if (parameter_a < xxxx_minThred) { } if (parameter_a > xxxx_maxThred) { }
```

\*val: value: It is result value of lookup table.

\*wgt: weight. It is used for weighting between multiple data.It is the normalized weight value.

\*width: width. It is width of the rectangular area in the image coordinate system.

\*x: x. It is horizontal coordinate in image coordinate system.

\*y: y. It is vertical coordinate in image coordinate system.

### 参数分类

该⽂档中将模块参数分为2类：固定配置参数、动态调试参数。

### 固定配置参数

该类参数仅⽀持通过API⽅式在初始化阶段配置，不建议根据场景或是 CIS ISO进⾏切换配置。

参数名称标题前缀 Static，例如：Static: hw\_btnrCfg\_trans\_offset

### 动态调试参数

该类参数建议根据场景或是CIS ISO进⾏切换调试.

### 特殊说明

### BLC

模块说明

模块约束

1. ISP 线性模式下可以使⽤blc模块的obcPostTnr功能来提升⾼ISO场景下的暗光纹理，HDR模式下不⽀持该功能。

IQ Tool：

blc模块的单ISO编辑区界⾯中，⼦功能显⽰为obcPostTnr(LinearOnly) 以作提醒。

ISP HDR模式下，使能该功能，⽤⼾需要关注IQ Tool LOG区的提醒信息。

AIQ：

ISP HDR模式下，通过BLC setAttrib API使能该功能，API返回出错，同时会提供相应提⽰信息。⽤⼾需要关注。

模块框图

参数说明

DPC

模块说明

模块约束

1. spc⽀持16x16 pattern中最多8对Shield pixel 校正

模块框图

参数说明

BTNR

模块说明

模块约束

1. btnr模块运⾏的像素值域空间hw\_btnrCfg\_pixDomain\_mode仅⽀持在初始化阶段配置，在运⾏过程中切换配置会引⼊不必要的效果异常问题。

IQ Tool、 AIQ：

鉴于该约束, 运⾏过程中配置hw\_btnrCfg\_pixDomain\_mode，IQ Tool LOG区 与 AIQ都会进⾏相应的信息提醒，⽤⼾需要关注。

2. ISP HDR模式下，以下3条sigma曲线建议采⽤btnr\_midSegmInterpOff\_mode。

mdSigma.hw\_btnrT\_sigmaCurve\_mode

curFrmSpNr.hw\_btnrT\_sigmaCurve\_mode

preFrmSpNr.hw\_btnrT\_sigmaCurve\_mode

IQ Tool、 AIQ：

### 模块框图



### 模块概念前置说明


| 概念 | 说明 |
| --- | --- |
| 静止权重(statWgt,wgtStat) | 动静判决模块判断当前帧该区域为静止的概率大小静止权重 = 1 - 运动权重 |
| 运动权重(mdWgt) | 动静判决模块判断当前帧该区域为运动的概率大小运动权重 = 1 - 静止权重 |
| 当前帧叠加权重 | 时域叠加模块把当前帧该区域与IIR时域叠加帧进行叠加，当前帧该区域的叠加权重，该权重由运动判决和时域叠加滤波2者共同决定。当前帧运动权重越大，当前帧叠加权重也越大。当前帧叠加权重= 1 - IIR帧叠加权重 |
| IIR帧叠加权重 | 时域叠加模块把当前帧该区域与IIR时域叠加帧进行叠加，IIR帧该区域的叠加权重，该权重由运动判决和时域叠加滤波2者共同决定。当前帧静止权重越大，IIR帧叠加权重也越大。IR帧叠加权重 = 1 - 当前帧叠加权重 |

### 参数说明

### hw\_btnrCfg\_pixDomain\_mode

Static:hw\_btnrCfg\_pixDomain\_mode

【参数功能描述】

配置btnr模块运⾏的像素值域空间

btnr\_pixLog2Domain\_mode：

btnr运⾏在log域模式。

btnr\_pixSqrtDomain\_mode：

btnr运⾏在平⽅根域模式。

btnr\_pixLinearDomain\_mode：

btnr运⾏在线性域。

### 【参数⽤法】：

sensor线性模式，建议优先选择线性域处理。

sensor hdr模式, 默认选择log域进⾏处理。

平⽅根域，暂不使⽤。

### transCfg

Static: hw\_btnr\_trans\_mode

【参数功能描述】

线性域转换log域或平⽅根域的模式选择。

在满⾜输⼊线性域范围的前提下，可以选择更⾼定点化精度模式。

btnr\_pixInBw15b\_mode：

btnr输⼊像素⽀持的最⼤位宽是15bit。ISP线性模式、⻓短帧曝光⽐⼩于等于8x的ISP HDR模式。

btnr\_pixInBw20b\_mode：

btnr输⼊像素⽀持的最⼤位宽是20bit。⻓短帧曝光⽐⼤于8x⼩于256x的ISP HDR模式。

【参数⽤法】：

默认值为btnr\_pixInBw20b\_mode。

Static: hw\_btnr\_trans\_offset

【参数功能描述】

线性域转换前的正向偏置参数

【参数⽤法】：

默认值是256. 不建议修改。

Static: hw\_btnr\_transData\_maxLimit

【参数功能描述】

待转换的线性域像素数值的最⼤值

【参数⽤法】：

默认值1,048,575，即 2^20 - 1.

HDR ⻓短帧的曝光⽐是16x，配置为 2^16 - 1即可，相对配置2^20 - 1 转换精度更⾼，转换精度带来的误差更⼩。

### sigmaEnv

Static: sw\_btnrCfg\_sigma\_mode

【参数功能描述】

噪声标定曲线⽀持以下2种⽅式：

btnr\_autoSigma\_mode：

btnr内部基于图像进⾏统计。基于实时图像统计能够与实际噪声更匹配。例如温度差异导致的噪声差异。

btnr\_manualSigma\_mode：

直接配置标定⼯具标定输出的曲线

【参数⽤法】：

默认btnr\_autoSigma\_mode。

### debug

Static: sw\_btnrT\_dbgOut\_en

【参数功能描述】

tnr debug模式开关。

debug模式ISP输出的数据为调试数据，与正常输出存在差异，仅作调试⽤。

【参数⽤法】：

默认0.

1表⽰打开debug模式，具体输出数据参考dbgOut\_mode的设置。

Static: hw\_btnrT\_dbgOut\_mode

【参数功能描述】

btnr debug模式：btnr\_dbgOut\_iirSpNr\_mode：IIR时域叠加帧空域降噪结果直接作为btnr输出btnr\_dbgOut\_curSpNr\_mode：当前帧空域降噪结果直接作为btnr输出。btnr\_dbgOut\_mdWgt\_mode：动静判决模块静⽌权重以灰度图的⽅式直接作为btnr输出。--&gt; 静⽌权重越⼤，灰度值越⼤即越⽩越亮，越趋向于静⽌区域。--&gt; 静⽌权重越⼩，灰度值越⼩即越⿊越暗，越趋向于运动区域。

【参数⽤法】：

debug模式对对应的效果进⾏观察，便于调试观察。

hw\_btnrT\_md\_en

mdDynamic: hw\_btnrT\_md\_en

【参数功能描述】

动静判决使能开关。

【参数⽤法】：

默认值为1，打开动静判决。

关闭动静判决，动静判决静⽌权重为1，即全帧为静⽌区域，效果上运动物体拖影很⻓。

### mdSigma

mdDynamic: hw\_btnrT\_sigma\_scale

【参数功能描述】

动静判决采⽤的噪声sigma的倍率调整系数。

【参数⽤法】：

值越⼤，

---&gt; 动静判决越容易判断成静⽌，

---&gt; 时域降噪⼒度越⼤

### mdDynamic: hw\_btnrT\_sigmaHdrS\_scale

【参数功能描述】

短帧噪声sigma的倍率调整系数。

HDR模式时，融合短帧的区域，噪声sigma由⻓短帧噪声sigma根据⻓短帧融合权重加权获得。

【参数⽤法】：

值越⼤，融合短帧的区域

---&gt; 动静判决越容易判断成静⽌，

---&gt; 时域降噪⼒度越⼤

mdDynamic: hw\_btnrT\_sigmaCurve\_mode

【参数功能描述】

动静判决采⽤的噪声sigma曲线模式：

btnr\_midSegmInterpOn\_mode：

曲线各个节点间的线性插值功能都使能，

btnr\_midSegmInterpOff\_mode：

【参数⽤法】：

线性模式：

默认btnr\_midSegmInterpOn\_mode

hdr模式：

默认btnr\_midSegmInterpOff\_mode。⻓帧噪声sigma曲线配置⾄curSpNrSgm\_curve的0〜7节点，短帧对应配置⾄8〜15节点。⻓短帧信噪⽐差异较⼤时，建议优先该模式。

subLoMd0\_diffCh

mdDynamic: hw\_btnrT\_vFilt\_en

【参数功能描述】

subLoMd0的帧间差异值通道，垂直⽅向FIR滤波使能。

差异值为当前帧与IIR时域叠加帧的帧间⾼频差异

【参数⽤法】：

默认值为1，打开垂直⽅向FIR滤波。

mdDynamic: hw\_btnrT\_hFilt\_en

【参数功能描述】

subLoMd0的帧间差异值通道，⽔平⽅向滤波使能。

差异值为当前帧与IIR时域叠加帧的帧间⾼频差异

【参数⽤法】：

默认值为1，打开⽔平⽅向滤波。

mdDynamic: hw\_btnrT\_vIIRFstLn\_scale

【参数功能描述】

subLoMd0的帧间差异值通道，垂直⽅向IIR滤波⾸⾏初始权重的倍率调整系数。

该滤波器为subLoMd0 ⾼频帧间差异值的垂直⽅向低通滤波器，由此获得垂直⽅向的低频帧间差异值。

【参数⽤法】：

值越⼤， ⾸⾏帧间差异值的IIR滤波初始权重越⼤。

mdDynamic: hw\_btnrT\_vIIRFilt\_strg

【参数功能描述】

subLoMd0的帧间差异值通道，垂直⽅向IIR滤波的IIR权重.

该滤波器为subLoMd0 ⾼频帧间差异值的垂直⽅向低通滤波器，由此获得垂直⽅向的低频帧间差异值。

【参数⽤法】：

值越⼤， IIR滤波权重越⼤，滤波强度越强，subLoMd0的低频运动权重越低频。

subLoMd0\_sgmCh

mdDynamic: hw\_btnrT\_hFilt\_en

【参数功能描述】

subLoMd0的mdSigma通道，⽔平⽅向滤波使能。

【参数⽤法】：

默认值为1，打开⽔平⽅向滤波。

mdDynamic: hw\_btnrT\_vIIRFstLn\_scale

【参数功能描述】

subLoMd0的mdSigma通道，垂直⽅向IIR滤波⾸⾏初始权重的倍率调整系数。

该滤波器为subLoMd0 mdSigma的垂直⽅向低通滤波器，由此获得垂直⽅向的低频运动判决噪声mdSigma值。

【参数⽤法】：

值越⼤， ⾸⾏帧间差异值的IIR滤波初始权重越⼤。

mdDynamic: hw\_btnrT\_vIIRFilt\_strg

【参数功能描述】

subLoMd0的mdSigma通道，垂直⽅向IIR滤波的IIR权重.

该滤波器为subLoMd0 mdSigma的垂直⽅向低通滤波器，由此获得垂直⽅向的低频运动判决噪声mdSigma值。

【参数⽤法】：

值越⼤， IIR滤波权重越⼤，滤波强度越强，subLoMd0的低频运动权重越低频。

subLoMd0\_wgtOpt

mdDynamic: hw\_btnrT\_mdWgt\_negOff

【参数功能描述】

subLoMd0的低频运动权重的负向偏置调整参数。

根据帧间差异值通道（diffCh）的低频差异值与mdSigma通道（sgmCh）的低频mdSigma，计算低频静⽌权重。

【参数⽤法】：

值越⼤， IIR滤波权重越⼤，滤波强度越强，滤波频段越低频。

mdDynamic: hw\_btnrT\_mdWgt\_scale

【参数功能描述】

subLoMd0的低频运动权重的倍率调整参数

根据帧间差异值通道（diffCh）的低频差异值与mdSigma通道（sgmCh）的低频mdSigma，计算低频静⽌权重。

【参数⽤法】：

值越⼤，

---&gt; subLoMd0低频运动权重越⼤，

---&gt; subLoMd0低频静⽌权重越⼩，

---&gt; btnr最终的时域降噪⼒度越⼩。

subLoMd1

mdDynamic:hw\_btnrT\_lpf\_en

【参数功能描述】

subLoMd1⾼频差异值的低通预滤波器的使能开关位。

【参数⽤法】：

默认值为1，打开低通预滤波器。

mdDynamic:sw\_btnrT\_lpfCfg\_mode

【参数功能描述】

低通预滤波器算⼦配置模式。

btnr\_cfgByFiltStrg\_mode：

直接⽤滤波⼒度值控制该滤波器。

btnr\_cfgByFiltCoeff\_mode：

直接配置算⼦系数来控制该滤波器。

【参数⽤法】：

默认btnr\_cfgByFiltStrg\_mode。

mdDynamic:hw\_btnrT\_lpfSpatial\_wgt

【参数功能描述】

当lpfCfg\_mode = btnr\_cfgByFiltCoeff\_mode时，通过该参数直接配置低通预滤波器的算⼦系数。

【参数⽤法】：

mdDynamic:sw\_btnrT\_lpf\_strg

【参数功能描述】

当lpfCfg\_mode = btnr\_cfgByFiltStrg\_mode时，低通预滤波器的⼒度值。

【参数⽤法】：

默认值为1.

值越⼤，该滤波器滤波⼒度越⼤。

mdDynamic:hw\_btnrT\_mdWgt\_maxLimit

【参数功能描述】

subLoMd1 ⾼频运动权重最⼤限制值。

subLoMd1 低频权重由⾼频权重经过低通滤波⽽得。

【参数⽤法】：

值越⼤，

---&gt; subLoMd1的最⼤⾼频运动权重值越⼤。

---&gt; subLoMd1的最⼤低频运动权重值越⼤。

---&gt; subLoMd1的最⼩低频静⽌权重值越⼩。

---&gt; btnr 最终的最⼩时域降噪⼒度越⼩。

### mdDynamic:hw\_btnrT\_mdWgt\_negOff

### 【参数功能描述】

subLoMd1 ⾼频运动权重的负向偏置调整参数。

subLoMd1 低频权重由⾼频权重经过低通滤波⽽得。

### 【参数⽤法】：

### 值越⼤，

---&gt; subLoMd1的⾼频运动权重越⼩，

---&gt; subLoMd1的低频运动权重越⼩，

---&gt; subLoMd1的低频静⽌权重越⼤，

---&gt; btnr 最终的时域降噪⼒度越⼤。

### mdDynamic:hw\_btnrT\_mdWgtFstLnNegOff\_en

### 【参数功能描述】

subLoMd1⾸⾏⾼频运动权重的单独负向偏置调整（mdWgtFstLn\_negOff）使能。

subLoMd1 低频权重由⾼频权重经过低通滤波⽽得。

### 【参数⽤法】：

默认值为1。

关闭情况下，⾸⾏与其他⾏⼀样采⽤（mdWgt\_negOff）。

mdDynamic:hw\_btnrT\_mdWgtFstLn\_negOff

### 【参数功能描述】

subLoMd1⾸⾏⾼频运动权重的负向偏置调整参数。

⾸⾏的单独负向偏置是作为后级IIR垂直滤波器（vIIRFilt）的初始权重调整。

subLoMd1 低频权重由⾼频权重经过低通滤波⽽得。

【参数⽤法】：

### mdDynamic:hw\_btnrT\_mdWgt\_scale

### 【参数功能描述】

subLoMd1 ⾼频运动权重最⼤限制值。

subLoMd1 低频权重由⾼频权重经过低通滤波⽽得。

### 【参数⽤法】：

### 值越⼤，

---&gt; subLoMd1的⾼频运动权重越⼤，

---&gt; subLoMd1的低频运动权重越⼤，

---&gt; subLoMd1的低频静⽌权重越⼩，

---&gt; btnr 最终的最终时域降噪⼒度越⼩。

mdDynamic:hw\_btnrT\_hFilt\_en

【参数功能描述】

subLoMd1 ⾼频静⽌权重值，⽔平⽅向滤波使能。

【参数⽤法】：

默认值为1，打开⽔平⽅向滤波。

mdDynamic:hw\_btnrT\_vIIRFilt\_strg

【参数功能描述】

垂直⽅向IIR滤波的IIR权重.

该滤波器为subLoMd1 ⾼频静⽌权重的垂直⽅向低通滤波器，由此获得垂直⽅向的低频静⽌权重。

【参数⽤法】：

值越⼤， IIR滤波权重越⼤，滤波强度越强，subLoMd1的低频运动权重越低频。

loMd

mdDynamic:hw\_btnrT\_loMd\_en

【参数功能描述】

低频动静判决使能开关。

subLoMd0 与 subLoMd1 都属于低频动静判决的⼦模块。

【参数⽤法】：

默认值为1，使能低频动静判决。

mdDynamic:hw\_btnrT\_loMd\_mode

【参数功能描述】

低频动静判决模式选择。

【参数⽤法】：

btnr\_subLoMd01Mix\_mode：subLoMd0, subLoMd1混合模式

btnr\_subLoMd0Only\_mode：单独subLoMd0模式

btnr\_subLoMd1Only\_mode：单独subLoMd1模式

默认btnr\_subLoMd01Mix\_mode。

mdDynamic:hw\_btnr\_preWgtMge\_scale

【参数功能描述】

前1帧IIR帧的叠加权重的倍率调整系数。

前1帧IIR帧的叠加权重与当前帧静⽌权重中，优选其⼀作为输出的当前帧静⽌权重

【参数⽤法】：

值越⼤，

---&gt; 叠加模块更容易选择当前帧静⽌权重

mdDynamic:hw\_btnr\_preWgtMge\_offset

【参数功能描述】

前1帧IIR帧的叠加权重的正向偏置调整系数。

前1帧IIR帧的叠加权重与当前帧静⽌权重中，优选其⼀作为输出的当前帧静⽌权重

【参数⽤法】：

值越⼤，

---&gt; 叠加模块更容易选择当前帧静⽌权重

### hw\_btnrT\_md\_mode

mdDynamic:hw\_btnrT\_md\_mode

【参数功能描述】

动静判决模式选择。

btnr\_loAsRatioForHi\_mode:

⾼低频联合，对低频运动权重与⾼频运动权重的⽐例关系进⾏调整，得到最终运动权重。btnr\_loAsBiasForHi\_mode：

⾼低频联合，低频运动权重作为⾼频运动权重的偏置调整，得到最终运动权重。

btnr\_loMdOnly\_mode：

仅低频运动判决，debug模式，低频运动权重作为最终动静判决权重结果输出。

【参数⽤法】：

默认btnr\_loAsBiasForHi\_mode。

loAsHiRatioMd

mdDynamic:hw\_btnrT\_hfLpf\_en

【参数功能描述】

⾼频帧间差异值的低通预滤波器的使能位。

【参数⽤法】：

默认值为1，开启低通预低通滤波器。

mdDynamic:sw\_btnrT\_hfLpfCfg\_mode

【参数功能描述】

⾼频帧间差异值的低通预滤波器算⼦系数配置⽅式。

btnr\_cfgByFiltStrg\_mode：

通过⼒度参数⽣成滤波器算⼦系数。

btnr\_cfgByFiltCoeff\_mode：

直接配置滤波器算⼦系数值。

【参数⽤法】：

默认参数选择btnr\_cfgByFiltStrg\_mode。

mdDynamic:hw\_btnrT\_hfLpfSpatial\_wgt

【参数功能描述】

使⽤btnr\_cfgByFiltCoeff\_mode模式时，低通预滤波器算⼦系数值配置。

【参数⽤法】：

默认值：[178, 99, 60, 22, 13, 3, 0, 1, 1]

mdDynamic:sw\_btnrT\_hfLpf\_strg

【参数功能描述】

使⽤btnr\_cfgByFiltStrg\_mode模式时，通过此⼒度参数⽣成最终低通预滤波器算⼦系数。

【参数⽤法】：

默认值1。

值越⼤，

---&gt; ⾼频帧间差异值的低通预滤波⼒度越强。

mdDynamic:hw\_btnrT\_loWgtStat\_scale

【参数功能描述】

低频静⽌权重（loStatWgt）倍率调整参数。

md\_mode == btnr\_loAsRatioForHi\_mode时，动静判决的当前帧静⽌权重（statWgt ）由以下关系式获得：

loDiff 、hiDiff： 低频、⾼频的帧间像素差异

(1 - loStatWgt)：当前帧低频运动权重。

hiMdWgt\_scale： 即⾼频运动权重倍率调整参数

【参数⽤法】：

默认值为2。

值越⼤，

---&gt; 低频运动权重 (1 - loStatWgt)越⼩，

---&gt; 动静判决越容易判断为静⽌。

---&gt; 最终时域降噪⼒度越⼤。

mdDynamic:hw\_btnrT\_loWgtStatHdrS\_scale

【参数功能描述】

短帧低频静⽌权重倍率调整参数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的低频静⽌权重也是由⻓帧

md\_mode == btnr\_loAsRatioForHi\_mode时，动静判决的当前帧静⽌权重（statWgt ）由以下关系式获得：

loDiff 、hiDiff： 低频、⾼频的帧间像素差异

(1 - loStatWgt)：当前帧低频运动权重。

hiMdWgt\_scale： 即⾼频运动权重倍率调整参数

【参数⽤法】：

默认值为2。

值越⼤，

---&gt; 低频运动权重 (1 - loStatWgt)越⼩，

---&gt; 动静判决越容易判断为静⽌。

---&gt; HDR模式，短帧融合区域最终时域降噪⼒度越⼤。

mdDynamic:hw\_btnrT\_hiMdWgt\_scale

【参数功能描述】

⾼频静⽌权重倍率调整参数

wgtCal\_mode = btnr\_loAsRatioForHi\_mode，动静判决的当前帧静⽌权重（statWgt ）由以下关系式获得：

loDiff 、hiDiff： 低频、⾼频的帧间像素差异

(1 - loStatWgt)：当前帧低频运动权重。

【参数⽤法】：

默认值为3.3。

值越⼤，

---&gt; 动静判决越难判断为静⽌。

---&gt; 最终时域降噪⼒度越⼩。

mdDynamic:hw\_btnrT\_loWgtStat\_negOff

【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时

低频静⽌权重的负向偏置调整参数。

【参数⽤法】：

默认值为0.5，

值越⼤，

---&gt; 低频静⽌权重越⼩。

---&gt; 低频静⽌权重作为⾼频运动权重的负向偏置作⽤越⼩

---&gt; 动静判决运动权重越⼤

---&gt; 时域降噪⼒度越⼩。

### 【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时

短帧低频静⽌权重的负向偏置调整参数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的低频静⽌权重负向偏置调整参数也是由⻓帧（loWgtStat\_negOff）和短帧（loWgtStatHdrS\_negOff）融合⽽成。

【参数⽤法】：

### 默认值为0.5，

值越⼤，HDR模式，短帧融合区域

---&gt; 低频静⽌权重越⼩。

---&gt; 低频静⽌权重作为⾼频运动权重的负向偏置作⽤越⼩

---&gt; 动静判决运动权重越⼤

---&gt; 时域降噪⼒度越⼩。

### mdDynamic:hw\_btnrT\_loWgtStat\_scale

### 【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时，

低频静⽌权重的倍率调整系数。

### 【参数⽤法】：

默认值为1，

值越⼤，

---&gt; 低频静⽌权重越⼤。

---&gt; 低频静⽌权重作为⾼频运动权重的负向偏置作⽤越⼤

---&gt; 动静判决运动权重越⼩

---&gt; 时域降噪⼒度越⼤。

### mdDynamic:hw\_btnrT\_loWgtStatHdrS\_scale

### 【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时，

短帧低频静⽌权重的倍率调整参数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的低频静⽌权重倍率调整参数也是由⻓帧（loWgtStat\_scale）和短帧（loWgtStatHdrS\_scale）融合⽽成。

【参数⽤法】：

默认值为1，

值越⼤，HDR模式，短帧融合区域

---&gt; 低频静⽌权重越⼤。

---&gt; 低频静⽌权重作为⾼频运动权重的负向偏置作⽤越⼤

---&gt; 动静判决运动权重越⼩

---&gt; 时域降噪⼒度越⼤。

md\_mode = btnr\_loAsBiasForHi\_mode时

低频静⽌权重的正向偏置调整参数。

【参数⽤法】：

默认值为0.5，

值越⼤，

---&gt; 低频静⽌权重越⼤。

---&gt; 低频静⽌权重作为⾼频运动权重的负向偏置作⽤越⼤

---&gt; 动静判决运动权重越⼩

---&gt; 时域降噪⼒度越⼤。

### mdDynamic:hw\_btnrT\_loWgtStatHdrS\_offset

### 【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时

短帧低频静⽌权重的正向偏置调整参数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的低频静⽌权重正向偏置调整参数也是由⻓帧（loWgtStat\_offset）和短帧（loWgtStatHdrS\_offset）融合⽽成。

【参数⽤法】：

默认值为0.5，

值越⼤，HDR模式，短帧融合区域

---&gt; 低频静⽌权重越⼤。

---&gt; 低频静⽌权重作为⾼频运动权重的负向偏置作⽤越⼤

---&gt; 动静判决运动权重越⼩

---&gt; 时域降噪⼒度越⼤。

### mdDynamic:hw\_btnr\_loWgtStat\_minLimit

### 【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时

低频静⽌权重的最⼩限制值。

【参数⽤法】：

默认值0.05，

值越⼤，

---&gt; 最⼩低频静⽌权重越⼤。

---&gt; 低频静⽌权重作为⾼频运动权重的最⼩负向偏置作⽤越⼤

---&gt; 最⼤动静判决运动权重越⼩

---&gt; 最⼩时域降噪⼒度越⼤。

mdDynamic:hw\_btnrT\_mdWgt\_scale

【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时，

动静判决运动权重的倍率调整系数。

【参数⽤法】：

默认值2，

值越⼤，

---&gt; 动静判决运动权重越⼤

---&gt; 时域降噪⼒度越⼩。

### mdDynamic:hw\_btnrT\_mdWgtHdrS\_scale

### 【参数功能描述】

md\_mode = btnr\_loAsBiasForHi\_mode时，

短帧动静判决运动权重的倍率调整参数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的动静判决运动权重的倍率调整参数也是由⻓帧（mdWgt\_scale）和短帧（mdWgtHdrS\_scale）融合⽽成。

【参数⽤法】：

默认值2，

值越⼤，HDR模式，短帧融合区域

---&gt; 动静判决运动权重越⼤

---&gt; 时域降噪⼒度越⼩。

### mdWgtPost

mdDynamic:hw\_btnr\_lpfSpatial\_wgt

【参数功能描述】

动静判决静⽌权重的低通滤波器算⼦系数。

【参数⽤法】：

默认值为[4,2,1]。

### sigmaEnv

Dynamic:hw\_btnrT\_statsPixAlpha\_thred

【参数功能描述】

进⼊硬件噪声sigma统计的点的叠加权重最低阈值。

叠加权重⾜够⼤，即该像素点叠加的帧数⾜够，作为统计均值才更可靠，进⽽统计的噪声sigma可靠性也更⼤。

【参数⽤法】：

默认值0.8。

Dynamic:hw\_btnrCfg\_statsPixCnt\_thred

【参数功能描述】

统计噪声sigma曲线时，每个亮度阶上满⾜(statsPixAlpha\_thred)统计条件的有效像素点数量的阈值。  

即每个亮度阶上需要有⾜够多的有效像素点，该亮度阶的sigma统计才⾜够可靠。

【参数⽤法】：

默认值为0.

值越⼤，每个亮度阶需要的最少有效像素数越⼤，统计得到的sigma越可靠。

Dynamic:sw\_btnrT\_autoSgmIIR\_alpha

【参数功能描述】

当前帧噪声sigma统计曲线的权重值， 当与历史噪声sigma统计曲线IIR滤波加权操作时。加权后的曲线作为当前帧应⽤的噪声sigma曲线经由AIQ配置⾄ curSpNrSgm\_curve、preSpNrSgm\_curve、

【参数⽤法】：

默认值0.7。

值越⼤，当前帧统计sigma曲线的权重越⼤，场景变化带来的噪声曲线变化，进⽽导致降噪⽔平差异引⼊的噪声⽔平差异过渡越平滑。当然场景突变带来的降噪⽔平收敛时间也随之变⼤。

Dynamic:hw\_btnrC\_curSpNrSgm\_curve

【参数功能描述】

对当前帧进⾏空域降噪时，其双边滤波采⽤的噪声sigma曲线。

【参数⽤法】：

Dynamic:hw\_btnrC\_preSpNrSgm\_curve

【参数功能描述】

对IIR时域叠加帧进⾏空域降噪时，其双边滤波采⽤的噪声sigma曲线。

【参数⽤法】：

值越⼤，该滤波器值域权重越⼤，IIR叠加帧的空域降噪⼒度越⼤。

Dynamic:hw\_btnrC\_mdSigma\_curve

【参数功能描述】

动静判决模块采⽤的噪声sigma曲线。

【参数⽤法】：

值越⼤，图像越不容易被动静判决模块判断为运动，时域叠加权重越⼤，时域降噪⼒度越⼤。

curFrmSpNr

Dynamic:hw\_btnrT\_spNr\_en

【参数功能描述】

对当前帧进⾏空域降噪的使能开关。

【参数⽤法】：

默认值为1，打开当前帧的空域去噪使能。

Dynamic:hw\_btnrT\_sigmaIdxLpf\_en

【参数功能描述】

采⽤低通滤波后的像素亮度值进⾏查表的使能。

对当前帧进⾏空域降噪时，根据像素亮度值对噪声sigma曲线进⾏查表插值获取噪声sigma。

【参数⽤法】：

默认值为1，采⽤低通滤波后的像素亮度值进⾏噪声sigma曲线进⾏查表。

### Dynamic:hw\_btnrT\_sigmaCurve\_mode

【参数功能描述】

当前帧空域降噪采⽤的噪声sigma曲线模式：

btnr\_midSegmInterpOn\_mode：

曲线各个节点间的线性插值功能都使能，

btnr\_midSegmInterpOff\_mode：

【参数⽤法】：

线性模式：

默认btnr\_midSegmInterpOn\_mode

hdr模式：

默认btnr\_midSegmInterpOff\_mode。⻓帧噪声sigma曲线配置⾄curSpNrSgm\_curve的0〜7节点，短帧对应配置⾄8〜15节点。⻓短帧信噪⽐差异较⼤时，建议优先该模式。

Dynamic:hw\_btnrT\_sigma\_scale

【参数功能描述】

当前帧空域降噪双边滤波值域sigma倍率调整系数。

【参数⽤法】：

值越⼤，该双边预滤波的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

Dynamic:hw\_btnrT\_sigmaHdrS\_scale

【参数功能描述】

短帧数据该双边滤波值域sigma倍率调整系数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的sigma\_scale调整参数也是由⻓帧（sigma\_scale）和短帧（sigmaHdrS\_scale）融合⽽成。

【参数⽤法】：

默认值为1。

值越⼤，当前帧中融合短帧的区域，该双边滤波器的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

### Dynamic:hw\_btnrT\_sigma\_offset

【参数功能描述】

当前帧空域降噪双边滤波值域sigma的正向偏置调整参数。

【参数⽤法】：

默认值为0。

值越⼤，该双边预滤波的值域权重越⼤，降噪⼒度越接近空域权重确定的最⼤⼒度。

⼀般在值域sigma较⼩区域降噪⼒度不⾜的时候，通过调整正向偏移值来进⾏单独调整，相对于调整sigma\_scale参数减少对sigma较⼤区域的降噪⽔平影响。

### Dynamic:hw\_btnrT\_sigmaHdrS\_offset

【参数功能描述】

短帧数据该双边滤波值域sigma正向偏置调整系数。

HDR模式，短帧融合区域由短帧和⻓帧融合⽽成，该区域的sigma\_offset调整参数也是由⻓帧（sigma\_offset）和短帧（sigmaHdrS\_offset）融合⽽成。

【参数⽤法】：

默认值为0。

值越⼤，当前帧中融合短帧的区域，该双边滤波器的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

⼀般在值域sigma较⼩区域降噪⼒度不⾜的时候，通过调整正向偏移值来进⾏单独调整，相对于调整sigma\_scale参数减少对sigma较⼤区域的降噪⽔平影响。

### Dynamic:sw\_btnrT\_filtSpatial\_strg

【参数功能描述】

当前帧空域降噪双边滤波的空域⼒度系数。

【参数⽤法】：

默认值为25。

值越⼤，该双边预滤波空域滤波强度越⼤。即该双边滤波器的最⼤滤波强度越⼤。

### Dynamic:hw\_btnrT\_pixDiff\_maxLimit

【参数功能描述】

当前帧空域降噪双边滤波，邻域像素与中⼼像素差异值最⼤限制值。

邻域像素与中⼼像素差异值⼀般由边缘纹理和噪声⼀起导致。

【参数⽤法】：

默认值为4095.

值越⼤，值域权重的最⼩值越⼤，该双边滤波器保边⼒度的最⼤值越⼤，边缘区降噪的最⼩⼒度越⼤。

Dynamic:hw\_btnrT\_pixDiff\_negOff

【参数功能描述】

当前帧空域降噪双边滤波，邻域像素与中⼼像素差异值的负向偏置调整参数。

邻域像素与中⼼像素差异值⼀般由边缘纹理和噪声⼀起导致。

【参数⽤法】：

默认值为0，

值越⼤，值域权重越⼤，该滤波器滤波⼒度越⼤。

### Dynamic:hw\_btnrT\_pixDiff\_scale

【参数功能描述】

当前帧空域降噪双边滤波，邻域像素与中⼼像素差异值的倍率调整系数。

邻域像素与中⼼像素差异值⼀般由边缘纹理和噪声⼀起导致。

【参数⽤法】：

默认值为0.15，

1) 值越⼤，值域权重越⼩，该双边滤波器保边⼒度越⼤，边缘区降噪的⼒度越⼩。

2) 值越⼤，边缘强弱差异导致的值域权重越⼤，强边缘保边⼒度增加更明显。

Dynamic:hw\_btnrT\_spNrOut\_alpha

【参数功能描述】

通过双边滤波前后数据的加权进⾏细节的回填，该参数为滤波后数据的权重。

【参数⽤法】：

默认值1.0，

值越⼤，滤波后数据的权重越⼤，细节被回填的越少，同时噪声也会同步被回填。但是由于回填的是滤波前原始的数据，所以被回填最⼤的噪声是原始噪声。

preFrmSpNr

Dynamic:hw\_btnrT\_spNr\_en

【参数功能描述】

对IIR时域叠加帧进⾏空域降噪的使能开关。

【参数⽤法】：

默认值为1，打开IIR时域叠加帧的空域去噪使能。

Dynamic:hw\_btnrT\_sigmaIdxLpf\_en

【参数功能描述】

采⽤低通滤波后的像素亮度值进⾏查表的使能开关。

对当前帧进⾏空域降噪时，根据像素亮度值对噪声sigma曲线进⾏查表插值获取噪声sigma。

【参数⽤法】：

默认值为1，采⽤低通滤波后的像素亮度值从噪声sigma曲线索引获取到噪声sigma。

Dynamic:hw\_btnrT\_sigmaCurve\_mode

【参数功能描述】

IIR时域叠加帧空域降噪采⽤的噪声sigma曲线模式：

btnr\_midSegmInterpOn\_mode：

曲线各个节点间的线性插值功能都使能。

btnr\_midSegmInterpOff\_mode：

【参数⽤法】：

线性模式：

默认btnr\_midSegmInterpOn\_mode

hdr模式：

默认btnr\_midSegmInterpOff\_mode。⻓帧噪声sigma曲线配置⾄curSpNrSgm\_curve的0〜7节点，短帧对应配置⾄8〜15节点。⻓短帧信噪⽐差异较⼤时，建议优先该模式。

Dynamic:hw\_btnrT\_sigma\_scale

【参数功能描述】

IIR时域叠加帧空域降噪双边滤波值域sigma倍率调整系数。

【参数⽤法】：

值越⼤，该双边预滤波的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

Dynamic:hw\_btnrT\_sigmaHdrS\_scale

【参数功能描述】

IIR时域叠加帧中，短帧数据该双边滤波值域sigma倍率调整系数。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的sigma\_scale调整参数也是由⻓帧（sigma\_scale）和短帧（sigmaHdrS\_scale）融合⽽成。

【参数⽤法】：

默认值为1。

值越⼤，IIR时域叠加帧中融合短帧的区域，该双边滤波器的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

Dynamic:hw\_btnrT\_sigma\_offset

【参数功能描述】

IIR时域叠加帧空域降噪双边滤波值域sigma的正向偏置调整参数。

### 【参数⽤法】：

默认值为0。

值越⼤，该双边预滤波的值域权重越⼤，降噪⼒度越接近空域权重确定的最⼤⼒度。

⼀般在值域sigma较⼩区域降噪⼒度不⾜的时候，通过调整正向偏移值来进⾏单独调整，相对于调整sigma\_scale参数减少对sigma较⼤区域的降噪⽔平影响。

### Dynamic:hw\_btnrT\_sigmaHdrS\_offset

### 【参数功能描述】

IIR时域叠加帧中，短帧数据该双边滤波值域sigma正向偏置调整系数。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的sigma\_offset调整参数也是由⻓帧（sigma\_offset）和短帧（sigmaHdrS\_offset）融合⽽成。

### 【参数⽤法】：

默认值为0。

值越⼤，IIR时域叠加帧中融合短帧的区域，该双边滤波器的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

⼀般在值域sigma较⼩区域降噪⼒度不⾜的时候，通过调整正向偏移值来进⾏单独调整，相对于调整sigma\_scale参数减少对sigma较⼤区域的降噪⽔平影响。

### Dynamic:hw\_btnrT\_sigma\_mode

【参数功能描述】

IIR时域叠加帧空域降噪的噪声sigma来源选择。

btnr\_lutSgmOnly\_mode：

基于preSpNrSgm\_curve曲线内部查表插值⽣成。

btnr\_kalPkSgm\_mode：

基于卡尔曼滤波内部计算⽣成

【参数⽤法】：

默认值btnr\_kalPkSgm\_mode。

### Dynamic:sw\_btnrT\_filtSpatial\_strg

【参数功能描述】

IIR时域叠加帧空域降噪双边滤波的空域⼒度系数。

【参数⽤法】：

默认值为25。

值越⼤，该双边预滤波空域滤波强度越⼤。即该双边滤波器的最⼤滤波强度越⼤。

Dynamic:hw\_btnrT\_pixDiff\_maxLimit

【参数功能描述】

IIR时域叠加帧空域降噪双边滤波，邻域像素与中⼼像素差异值最⼤限制值。

邻域像素与中⼼像素差异值⼀般由边缘纹理和噪声⼀起导致。

### 【参数⽤法】：

默认值为4095.

值越⼤，值域权重的最⼩值越⼤，该双边滤波器保边⼒度的最⼤值越⼤，边缘区降噪的最⼩⼒度越⼤。

### Dynamic:hw\_btnrT\_pixDiff\_negOff

【参数功能描述】

IIR时域叠加帧空域降噪双边滤波，邻域像素与中⼼像素差异值的负向偏置调整参数。

邻域像素与中⼼像素差异值⼀般由边缘纹理和噪声⼀起导致。

【参数⽤法】：

默认值为0，

值越⼤，值域权重越⼤，该滤波器滤波⼒度越⼤。

### Dynamic:hw\_btnrT\_pixDiff\_scale

【参数功能描述】

IIR时域叠加帧空域降噪双边滤波，邻域像素与中⼼像素差异值的倍率调整系数。

邻域像素与中⼼像素差异值⼀般由边缘纹理和噪声⼀起导致。

【参数⽤法】：

默认值为0.15，

1) 值越⼤，值域权重越⼩，该双边滤波器保边⼒度越⼤，边缘区降噪的⼒度越⼩。

2) 值越⼤，边缘强弱差异导致的值域权重越⼤，强边缘保边⼒度增加更明显。

### Dynamic:hw\_btnrT\_spNrOut\_alpha

【参数功能描述】

通过双边滤波前后数据的加权进⾏细节的回填，该参数为滤波后数据的权重。

由于时域叠加导致的拖影，通过IIR时域叠加帧的空域滤波⼒度调节来减少拖影问题的影响。

【参数⽤法】：

默认值1.0，

1) 值越⼤，滤波后数据的权重越⼤，细节被回填的越少，同时噪声也会同步被回填。

2) 值越⼤，滤波⼒度越⼤，时域叠加的拖影越短。

frmAlpha

Dynamic:hw\_btnrT\_loAlpha\_minLimit

【参数功能描述】

时域低频叠加的最⼩帧数限制值，即IIR时域叠加帧低频叠加权重的最⼩限制值。

【参数⽤法】：

默认值为0，

值越⼤，

---&gt; IIR时域叠加帧最⼩低频叠加权重越⼤，

---&gt; 时域低频叠加的最⼩帧数越⼤，

### Dynamic:hw\_btnrT\_loAlphaHdrS\_minLimit

【参数功能描述】

短帧时域低频叠加的最⼩帧数限制值，即短帧低频叠加权重的最⼩限制值。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的时域低频叠加的最⼩帧数限制值（loAlpha\_minLimit）调整参数也是由⻓帧（loAlpha\_minLimit）和短帧

（loAlphaHdrS\_minLimit）融合⽽成。

【参数⽤法】：

默认值为0，

值越⼤，IIR时域叠加帧中融合短帧区域，

---&gt; 最⼩低频叠加权重越⼤，

---&gt; 时域低频叠加的最⼩帧数越⼤，

### Dynamic:hw\_btnrT\_loAlpha\_maxLimit

【参数功能描述】

时域低频叠加的最⼤帧数限制值，即IIR时域叠加帧低频叠加权重的最⼤限制值。

【参数⽤法】：

默认值为16，

值越⼤

---&gt; IIR时域叠加帧最⼤低频叠加权重越⼤，

---&gt; 时域低频叠加的最⼤帧数越⼤，

Dynamic:hw\_btnrT\_loAlphaHdrS\_maxLimit

【参数功能描述】

短帧时域低频叠加的最⼤帧数限制值，即短帧低频叠加权重的最⼤限制值。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的时域低频叠加的最⼤帧数限制值（loAlpha\_maxLimit）调整参数也是由⻓帧（loAlpha\_maxLimit）和短帧

（loAlphaHdrS\_maxLimit）融合⽽成。

【参数⽤法】：

默认值为16，

值越⼤，IIR时域叠加帧中融合短帧区域，

---&gt; 最⼤低频叠加权重越⼤，

---&gt; 时域低频叠加的最⼤帧数越⼤，

Dynamic:hw\_btnrT\_hiAlpha\_minLimit

frmAlpha\_mode == btnr\_hiAlphaByHi\_mode时，

时域⾼频叠加的最⼩帧数限制值，即IIR时域叠加帧⾼频叠加权重的最⼩限制值。

【参数⽤法】：

默认值为0，

值越⼤，

---&gt; IIR时域叠加帧最⼩⾼频叠加权重越⼤，

---&gt; 时域⾼频叠加的最⼩帧数越⼤，

---&gt; 时域降噪⾼频最⼩⼒度越⼤（即运动区⾼频时域降噪⼒度）。

### Dynamic:hw\_btnrT\_hiAlphaHdrS\_minLimit

【参数功能描述】

frmAlpha\_mode == btnr\_hiAlphaByHi\_mode时，

短帧时域⾼频叠加的最⼩帧数限制值，即短帧⾼频叠加权重的最⼩限制值。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的时域⾼频叠加的最⼩帧数限

制值（hiAlpha\_minLimit）调整参数也是由⻓帧（hiAlpha\_minLimit）和短帧

（hiAlphaHdrS\_minLimit）融合⽽成。

【参数⽤法】：

默认值为0，

值越⼤，IIR时域叠加帧中融合短帧区域，

---&gt; 最⼩⾼频叠加权重越⼤，

---&gt; 时域⾼频叠加的最⼩帧数越⼤，

---&gt; 时域降噪⾼频最⼩⼒度越⼤（即运动区低频时域降噪⼒度）。

Dynamic:hw\_btnrT\_hiAlpha\_maxLimit

【参数功能描述】

frmAlpha\_mode == btnr\_hiAlphaByHi\_mode时，

短帧时域⾼频叠加的最⼤帧数限制值，即短帧⾼频叠加权重的最⼤限制值。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的时域⾼频叠加的最⼤帧数限

制值（hiAlpha\_maxLimit）调整参数也是由⻓帧（hiAlpha\_maxLimit）和短帧

（hiAlphaHdrS\_maxLimit）融合⽽成

【参数⽤法】：

默认值为16，

值越⼤，IIR时域叠加帧中融合短帧区域，

---&gt; 最⼤⾼频叠加权重越⼤，

---&gt; 时域⾼频叠加的最⼤帧数越⼤，

---&gt; 时域降噪低频最⼤⼒度越⼤（即静⽌区低频时域降噪⼒度）。

Dynamic:hw\_btnrT\_hiAlphaHdrS\_maxLimit

【参数功能描述】

frmAlpha\_mode == btnr\_hiAlphaByHi\_mode时，

短帧时域⾼频叠加的最⼤帧数限制值，即短帧⾼频叠加权重的最⼤限制值。

HDR模式IIR时域叠加帧中，短帧融合区域由短帧和⻓帧融合⽽成，该区域的时域⾼频叠加的最⼤帧数限制值（hiAlpha\_maxLimit）调整参数也是由⻓帧（hiAlpha\_maxLimit）和短帧

（hiAlphaHdrS\_maxLimit）融合⽽成

【参数⽤法】：

默认值为16，

值越⼤，IIR时域叠加帧中融合短帧区域，

---&gt; 最⼤⾼频叠加权重越⼤，

---&gt; 时域⾼频叠加的最⼤帧数越⼤，

---&gt; 时域降噪低频最⼤⼒度越⼤（即静⽌区低频时域降噪⼒度）。

### hw\_btnrT\_noiseBal\_mode

Dynamic:hw\_btnrT\_noiseBal\_mode

【参数功能描述】

运动区与静⽌区噪声平衡模式配置

noiseBal\_byHiAlpha:

作为噪声平衡的⾼频噪声来源于当前帧滤波插值插值⾼频和iir帧滤波插值的⾼频按iir帧⾼频插值⽐例系数的插值结果。

noiseBal\_byLoAlpha：

作为噪声平衡的⾼频噪声来源于当前帧滤波⾼频和iir帧的滤波⾼频按iir帧低频插值⽐例系数的插值结果。

【参数⽤法】：

默认值为noiseBal\_byLoAlpha。

noiseBal\_byHiAlpha

Dynamic:hw\_btnrT\_curHiOrg\_alpha

【参数功能描述】

frmAlpha\_mode == btnr\_hiAlphaByHi\_mode时，

在与卡尔曼滤波预测⾼频进⾏加权时，空域降噪后的当前帧⾼频的加权权重。加权后的⾼频作为时域叠加的当前帧⾼频。

【参数⽤法】：

默认值为0,

值越⼤,

---&gt; 空域降噪后的当前帧⾼频的加权权重越⼤，当前帧的⾼频细节以及噪声更多被叠加后输出。

---&gt; 静⽌区时域⾼频降噪⼒度越低。

---&gt; 运动区运动物体虚化感越弱，运动边缘更清晰。

Dynamic:hw\_btnrT\_iirHiOrg\_alpha

【参数功能描述】

frmAlpha\_mode == btnr\_hiAlphaByHi\_mode时，

在与卡尔曼滤波预测⾼频进⾏加权时，空域降噪后的IIR时域叠加帧⾼频的加权权重。加权后的⾼频作为时域叠加的IIR时域叠加帧⾼频。

【参数⽤法】：

默认值为0,

值越⼤,

---&gt; 空域降噪后的IIR时域叠加帧⾼频的加权权重越⼤

### noiseBal\_byLoAlpha

Dynamic:hw\_btnrT\_hiMotionNr\_strg

【参数功能描述】

hw\_btnrT\_frmAlpha\_mode = btnr\_hiAlphaByLo\_mode时，

低频叠加⼒度指导时域⾼频叠加，时域叠加后的⾼频经过缩放后与低频融合作为最终的输出，该参数为⾼频倍率调整系数。

该模式下，由于采⽤低频叠加⼒度指导时域⾼频叠加，frmAlpha\_lo相关参数的作⽤域包含⾼频和低频。

【参数⽤法】：

默认值为1，

值越⼤，⾼频回填更多，时域降噪⼒度越⼩，⼀般⽤于运动区与静⽌区的⾼频过渡平滑性。

### localSgmStrg

Dynamic:hw\_bnrT\_localSgmStrg\_maxLimit

【参数功能描述】

局部噪声强度表征值（locSgmStrg）的最⼤限制值。

由于叠加权重的不同，时域叠加后图像的局部噪声是不同的。⽣成局部噪声强度表征值（locSgmStrg）传递⾄后级使⽤。

【参数⽤法】：

默认值为1，

值越⼤，传递给后⾯模块的最⼤局部噪声强度表征值越⼤，后级模块例如YNR/Sharp等局部噪声强度表征值相关的局部最⼤⼒度越⼤。

YNR

模块说明

模块约束

1. ynr模块不⽀持模块级别的效果旁路功能

IQ Tool、 AIQ：

鉴于该约束，AIQ HWI层会采⽤ ynr.dyn.loNr\_en 、ynr.dyn.hiNr\_filtProc.nlmFilt\_en 分别关闭模块内部的低频降噪和⾼频降噪功能来实现。

IQ Tool界⾯查询 ynr.dyn.loNr\_en 、ynr.dyn.hiNr\_filtProc.nlmFilt\_en的2个参数会是关闭状态。同时IQ Tool LOG窗⼝以及AIQ 内部都有相应的提⽰信息。

### 模块框图



### 参数说明

ynrScl\_radi

Static: hw\_ynrCfg\_opticCenter\_x

【参数功能描述】

镜头光学中⼼在图像中的横坐标。

【参数⽤法】：

默认镜头光学中⼼与图像中⼼重合，即横坐标==图像宽的1/2。

Static: hw\_ynrCfg\_opticCenter\_y

【参数功能描述】

镜头光学中⼼在图像中的纵坐标。

【参数⽤法】：

默认镜头光学中⼼与图像中⼼重合，即纵坐标==图像⾼的1/2。

Dynamic: hw\_ynrT\_radiDist2YnrScl\_val

【参数功能描述】

径向距离的降噪⼒度倍率系数。

由于镜头阴影的存在，距离镜头光学中⼼的不同距离ISP在图像上使⽤的增益往往不同导致噪声信噪⽐不同。该参数⽀持根据图像像素点的径向距离配置不同降噪⼒度。

### 【参数⽤法】：

径向距离的降噪⼒度倍率系数越⼤，降噪⼒度越⼤。1.0表⽰该倍率系数为1，即径向距离对YNR⼒度没有影响。

### ynrScl\_locSgmStrg

Dynamic:hw\_ynrT\_glbSgmStrg\_val

【参数功能描述】

全局的图像噪声强度表征值（glbSgmStrg）设置参数。

全局噪声强度表征值（glbSgmStrg）与前级输⼊的局部噪声强度表征值（locSgmStrg）进⾏加权作为该区域的局部噪声强度表征值（locSgmStrg）。

【参数⽤法】：

该参数越⼤，通过glbSgmStrg\_alpha参数加权后的最终局部噪声强度值（locSgmStrg）也越⼤。

局部噪声强度值（locSgmStrg）越⼤，YNR模块内部会认为噪声更⼤。从曲线

（locSgmStrg2YnrScl\_val）中映射得到的是更⼤局部图像噪声强度表征值（locSgmStrg）对应的YNR降噪⼒度倍率调整系数（YnrScl），进⽽影响图像的局部YNR降噪⼒度。

### Dynamic:hw\_ynrT\_glbSgmStrg\_alpha

【参数功能描述】

全局噪声强度表征值加权的权重值。

全局噪声强度表征值（glbSgmStrg）与前级输⼊的局部噪声强度表征值（locSgmStrg）进⾏加权作为该区域的局部噪声强度表征值（locSgmStrg）。

【参数⽤法】：

参数值越⼤，全局的图像噪声强度表征值权重越⼤。1.0表⽰最终的局部噪声强度值（locSgmStrg）等效于全局图像噪声强度表针值（glbSgmStrg）。

Dynamic:hw\_ynrT\_locSgmStrg2YnrScl\_val

【参数功能描述】

该曲线以局部图像噪声强度表征值（locSgmStrg）索引，映射得到局部YNR降噪⼒度倍率调整系数（YnrScl）。

来⾃前级的局部噪声强度表征值在图像的不同区域是不同的，通过该参数等效实现不同区域的局部去噪⼒度。例如：经过btnr之后，静⽌区locSgmStrg 相对运动区域会⼩很多。

【参数⽤法】：

默认值为全1. 1.0表⽰该倍率系数为1，即局部噪声强度表征值（locSgmStrg）对YNR降噪⼒度没有影响。

值越⼩，

1) 局部噪声强度表征值（locSgmStrg）导致的局部YNR降噪⼒度差异越⼩。

2) YNR降噪⼒度越⼩

Dynamic:hw\_ynrC\_luma2Sigma\_curve

【参数功能描述】

ynr噪声sigma标定曲线的像素亮度索引值。

【参数⽤法】：

直接参考标定⼯具输出值。

hw\_ynrC\_luma3Sigma\_curve

Dynamic:hw\_ynrC\_luma3Sigma\_curve

【参数功能描述】

ynr噪声sigma标定曲线的噪声sigma值

【参数⽤法】：

直接参考标定⼯具输出值。

hw\_ynrT\_loNr\_en

Dynamic:hw\_ynrT\_loNr\_en

【参数功能描述】

低频降噪使能位。

【参数⽤法】：

默认值1

1表⽰使能低频降噪。

### loNr\_preProc

Dynamic:sw\_ynrT\_preLpfCfg\_mode

【参数功能描述】

预滤波低通滤波器的配置模式

cnr\_cfgByFiltStrg\_mode：

直接⽤滤波⼒度值控制该滤波器。

cnr\_cfgByFiltCoeff\_mode：

直接配置算⼦系数来控制该滤波器。

【参数⽤法】：

默认⽤cnr\_cfgByFiltStrg\_mode。

Dynamic:hw\_ynrT\_preLpfSpatial\_wgt

【参数功能描述】

当preLpfCfg\_mode = ynr\_cfgByFiltCoeff\_mode时，通过该参数直接配置预滤波低通滤波器的算⼦系数。

【参数⽤法】：

4wgt[1] + 4wgt[2] + wgt[0] = 128

Dynamic:sw\_ynrT\_preLpf\_strg

【参数功能描述】

当sw\_ynrT\_preLpfCfg\_mode = cnr\_cfgByFiltStrg\_mode时，预滤波低通滤波器的⼒度值。

【参数⽤法】：

默认值为1.

值越⼤，⾼斯算⼦越趋向于均值，⾼斯滤波⼒度越⼤。

Dynamic:sw\_ynrT\_edgeDctConf\_scale

【参数功能描述】

该参数为纹理表征值的放⼤倍率系数。

基于预滤波输出进⾏纹理检测⽣成纹理表征值。纹理表征值越⼤表⽰该区域纹理越强。loNr会根据纹理表征值进⾏⾃适应的低频去噪⼒度调整。

【参数⽤法】：

默认值为6.

值越⼤，纹理保护越强，纹理区域的降噪⼒度越弱。

loNr\_iirGuide

Dynamic:hw\_ynrT\_localYnrScl\_alpha

【参数功能描述】

ynr低频降噪时局部降噪⼒度（局部噪声强度表征值与径向距离）权重值。

【参数⽤法】：

默认值为0.3

0表⽰局部去噪⼒度值失效。1表⽰完全使⽤局部降噪⼒度值。值越⼤，图像局部的降噪⼒度差异越⼤。由于运动区和静⽌区在前级的噪声强度表征值上会有明显差异，所以静⽌和运动区域的降噪⼒度的差异也越⼤。

Dynamic:sw\_ynrT\_iirFilt\_strg

【参数功能描述】

低频IIR滤波的⼒度系数。

【参数⽤法】：

默认值为0.8。

值越⼤，降噪⼒度越⼤。

Dynamic:hw\_ynrT\_pixDiffEge\_thred

【参数功能描述】

低频IIR滤波窗⼝内边缘区判断阈值。中⼼点与邻域点差异值⼤于该阈值被认为是边缘。低频IIR滤波在边缘区降低⼒度。

【参数⽤法】：

默认值为0.25。

值越⼤，越不容易被被判断为边缘区域点。

Dynamic:hw\_ynrT\_centerPix\_wgt

【参数功能描述】

低频IIR滤波时中⼼点（原图点）的权重。

【参数⽤法】：

默认值为0.01。

值越⼤，则降噪⼒度越弱。

Dynamic:hw\_ynrT\_iirInitWgt\_scale

【参数功能描述】

低频IIR滤波的初始权重的调整倍率系数。

【参数⽤法】：

默认值为0.0625.

值越⼤，降噪⼒度越弱。

Dynamic:hw\_ynrT\_softThd\_scale

【参数功能描述】

低频IIR滤波输出前的软阈值处理。软阈值的调整倍率系数。

【参数⽤法】：

默认值为0.3

1.0为1倍的内部噪声sigam值。值越⼤，越容易被判断为噪声被滤波。

loNr\_bifilt

Dynamic:hw\_ynrT\_rgeSgm\_scale

【参数功能描述】

低频双边滤波的值域⼒度系数。

【参数⽤法】：

默认值为0.5.

值越⼤，降噪⼒度越⼤。

Dynamic:hw\_ynrT\_filtSpatialV\_strg

【参数功能描述】

低频双边滤波空域权重计算中，邻域像素与中⼼像素在垂直⽅向距离的调整倍率系数。

【参数⽤法】：

默认值0.0625。

该值越⼤，邻域像素的空域权重越⼩。该双边滤波的最⼤滤波强度越低。

Dynamic:hw\_ynrT\_filtSpatialH\_strg

【参数功能描述】

低频双边滤波空域权重计算中，邻域像素与中⼼像素在垂直⽅向距离的调整倍率系数。

【参数⽤法】：

默认值0.0625。

该值越⼤，邻域像素的空域权重越⼩。该双边滤波的最⼤滤波强度越低。

Dynamic:hw\_ynrT\_centerPix\_wgt

【参数功能描述】

低频双边滤波空域权重计算中，邻域像素与中⼼像素在垂直⽅向距离的调整倍率系数。

【参数⽤法】：

默认值0.0625。

该值越⼤，邻域像素的空域权重越⼩。该双边滤波的最⼤滤波强度越低。

Dynamic:hw\_ynrT\_bifiltOut\_alpha

【参数功能描述】

低频双边滤波空域权重计算中，邻域像素与中⼼像素在垂直⽅向距离的调整倍率系数。

【参数⽤法】：

默认值0.0625。

该值越⼤，邻域像素的空域权重越⼩。该双边滤波的最⼤滤波强度越低。

hiNr\_filtProc

Dynamic:hw\_ynrT\_nlmFilt\_en

【参数功能描述】

⾼频滤波使能位。

【参数⽤法】：

默认值为1，打开⾼频降噪。

Dynamic:hw\_ynrT\_localYnrScl\_alpha

【参数功能描述】

ynr⾼频降噪时局部降噪⼒度（局部噪声强度表征值与径向距离）权重值。

【参数⽤法】：

默认值为0.3

0表⽰局部降噪⼒度值失效。1表⽰完全使⽤局部降噪⼒度值。值越⼤，图像局部的降噪⼒度差异越⼤。由于运动区和静⽌区在前级的噪声强度表征值上会有明显差异，所以静⽌和运动区域的降噪⼒度的差异也越⼤。

Dynamic:hw\_ynrT\_nlmSgm\_minLimit

【参数功能描述】

⾼频降噪使⽤的图像噪声值的最⼩阈值，该参数决定了⾼频降噪的最⼩⼒度值。

【参数⽤法】：

默认值为0.0068。

值越⼤，⾼频降噪的最⼩⼒度值越⼤。

Dynamic:hw\_ynrT\_nlmSgm\_scale

【参数功能描述】

⾼频滤波的整体⼒度控制。

【参数⽤法】：

默认值为0.5,

值越⼤则降噪⼒度越强。

Dynamic:hw\_ynrT\_nlmRgeWgt\_negOff

【参数功能描述】

⾼频降噪时邻域点权重减去的偏移调整值，⽤于修正像素点差异很⼤时仍然存在权重的情况。

【参数⽤法】：

默认值0.01。

值越⼤，则降噪⼒度越弱。

Dynamic:hw\_ynrT\_centerPix\_wgt

【参数功能描述】

⾼频降噪时的中⼼点权重（原图点）。

【参数⽤法】：

默认值1，

值越⼤，则降噪⼒度越弱。

Dynamic:hw\_ynrT\_nlmSpatial\_wgt

【参数功能描述】

⾼频降噪的空域权重系数。

【参数⽤法】：

默认值为&#123;7,6,3,6,5,3&#125;。

hiNr\_alphaProc

Dynamic:hw\_ynrT\_nlmOut\_alpha

【参数功能描述】

通过⾼频降噪前后数据的加权进⾏细节的回填，该参数为降噪后数据的权重。

【参数⽤法】：

默认值0.5，

值越⼤，滤波后数据的权重越⼤，细节被回填的越少，同时噪声也会同步被回填。但是由于回填的是滤波前原始的数据，所以被回填最⼤的噪声是原始噪声。

Dynamic:hw\_ynrT\_edgAlphaUp\_thred

【参数功能描述】

⾼频降噪的细节回处理过程中，该阈值⽤于判断是否为强边缘区域。

【参数⽤法】：

默认值为2。

值越⼤，越不容易被判断为强边缘区域。强边缘区域置信度越⾼，回填的细节和噪声越少。

Dynamic:hw\_ynrT\_locSgmStrgAlphaUp\_thred

【参数功能描述】

局部噪声强度表征值越⼤的区域，噪声越⼤，回填的更多的属于噪声。⾼频降噪的细节回处理过程中，局部噪声强度表征值⼤于该阈值的区域，回填的细节和噪声降低。

【参数⽤法】：

默认值为0.3。

值越⼤，越难进⼊该降低回填⼒度的机制中。⼀般⽤于控制运动区域噪声回填的控制。

### 调试步骤

### CNR

### 模块说明

### 模块约束

1. cnr模块不⽀持模块级别的效果旁路功能

IQ Tool、 AIQ：

鉴于该约束，建议⽤⼾采⽤ cnr.hiNr\_bifilt.bifiltOut\_alpha 参数设置为0来实现该功能。

### 模块框图



### 参数说明

localSgmStrg

Dynamic: hw\_cnrT\_glbSgmStrg\_val

【参数功能描述】

全局的图像噪声强度表征值。图像噪声强度表征值越⼤，表⽰噪声也越⼤。

【参数⽤法】：

图像噪声强度表征值越⼤，CNR内部的去噪⼒度越⼤。

### Dynamic: hw\_cnrT\_glbSgmStrg\_alpha

【参数功能描述】

全局噪声强度表征值加权的权重值。

全局噪声强度表征值与前级输⼊的局部噪声强度表征值进⾏加权作为该区域的局部噪声强度表征值。

【参数⽤法】：

参数值越⼤，全局的图像噪声强度表征值权重越⼤。1.0表⽰最终的局部噪声强度值等效于全局图像噪声强度表针值。

Dynamic: hw\_cnrT\_localSgmStrg\_scale

【参数功能描述】

对前级输⼊的局部噪声强度表征值进⾏调整的倍率系数。

【参数⽤法】：

1.0表⽰保持前级输⼊噪声强度表征值不变。&gt;1.0 表⽰局部噪声强度表征值变⼤。

loNr\_preProc

Dynamic: hw\_cnrT\_ds\_mode

【参数功能描述】

低频缩略图的下采样⽐例选择。

cnr\_ds\_4x4\_mode：4x4的下采样。

cnr\_ds\_8x4\_mode ：8x4的下采样。

【参数⽤法】：

默认值为cnr\_ds\_4x4\_mode。

下采样⽐率越⼤，缩略图越低频，⾊噪降噪更低频，边缘颜⾊会溢出程度越⼤。

Dynamic: hw\_cnrT\_uvEdg\_strg

【参数功能描述】

缩略图滤波，邻域像素与中⼼像素差异值计算中UV通道的占⽐。

【参数⽤法】：

默认值为0.333。

值越⼤，UV通道差异在计算像素差异值的权重越⼤，对于颜⾊边缘的保护更强。

loNr\_bifilt

Dynamic: hw\_cnrT\_ds\_mode

【参数功能描述】

低频缩略图双边滤波器空域权重系数的配置模式

cnr\_cfgByFiltStrg\_mode：

直接⽤滤波⼒度值控制该滤波器空域权重系数。

cnr\_cfgByFiltCoeff\_mode：

直接配置空域权重系数来控制该滤波器。

【参数⽤法】：

默认⽤cnr\_cfgByFiltStrg\_mode。

Dynamic: sw\_cnrT\_filtSpatial\_strg

【参数功能描述】

当filtCfg\_mode = cnr\_cfgByFiltStrg\_mode时，低频缩略图双边滤波器的⼒度值。

【参数⽤法】：

默认值为1，

值越⼤，双边空域权重越⼤，即该双边滤波器的最⼤滤波强度越⼤。

Dynamic: hw\_cnrT\_filtSpatial\_wgt

【参数功能描述】

当filtCfg\_mode = cnr\_cfgByFiltCoeff\_mode时，通过该参数直接配置低频缩略图双边滤波器空域权重系数。

【参数⽤法】：

默认值为[1,1,1,1].

Dynamic: sw\_cnrT\_rgeSgm\_val

【参数功能描述】

低频缩略图双边滤波的值域⼒度。

【参数⽤法】：

默认值为0.00333，

值越⼤，双边值域权重越⼤，降噪⼒度越⼤。

Dynamic: hw\_cnrT\_bifiltOut\_alpha

【参数功能描述】

通过低频缩略图双边降噪前后数据的加权进⾏细节的回填，该参数为降噪后数据的权重

【参数⽤法】：

默认值1.0，

值越⼤，滤波后数据的权重越⼤，细节被回填的越少，同时噪声也会同步被回填。但是由于回填的是滤波前原始的数据，所以被回填最⼤的噪声是原始噪声。

loNr\_iirFilt

Dynamic: hw\_cnrT\_filtSpatial\_wgt

【参数功能描述】

低频缩略图IIR滤波的空域权重系数。

【参数⽤法】：

默认值为[1,1,1]

Dynamic:sw\_cnrT\_rgeSgm\_val

【参数功能描述】

低频缩略图IIR滤波值域噪声sigma。

【参数⽤法】：

默认值为0.0078，

值越⼤，降噪⼒度越⼤。

### Dynamic: sw\_cnrT\_rgeSgmRatio\_mode

【参数功能描述】

低频缩略图IIR滤波值域sigma，可以通过sigma⽐率⼒度调整参数来调整sima值来控制该滤波器的降噪⼒度。⽐率⼒度调整⽀持全局和局部调整，可以通过以下模式进⾏选择：

cnr\_glbSgmRat\_only\_mode：仅⽤全局⽐率⼒度调整模式。

cnr\_glbSgmRat\_locSgmStrgMix\_mode：全局和局部全局⽐率⼒度调整混合加权模式。

cnr\_locSgmStrg2SgmRat\_only\_mode：仅⽤局部⽐率⼒度调整。

【参数⽤法】：

默认值cnr\_locSgmStrg2SgmRat\_only\_mode。

Dynamic: hw\_cnrT\_glbSgm\_ratio

【参数功能描述】

低频缩略图IIR滤波值域sigma全局⽐率⼒度调整参数。

【参数⽤法】：

默认值为1，

值越⼤，低频缩略图IIR滤波值域噪声sigma越⼩，去噪⼒度越⼩。

Dynamic: hw\_cnrT\_glbSgmRatio\_alpha

【参数功能描述】

低频缩略图IIR滤波值域sigma全局⽐率⼒度调整(glbSgm\_ratio)与局部⽐率⼒度调整(localSgmStrg)的加 权，此参数为全局⽐率⼒度调整的权重。

【参数⽤法】：

默认值为0，0表⽰完全由全局⽐率⼒度调整参数决定。

值越⼤，全局⽐率⼒度调整权重越⼤，局部⽐率⼒度调整权重越⼩，图像的局部降噪⼒度差异越⼩，例如：运动区域和⾮运动区域噪声差值越⼩。

Dynamic: hw\_cnrT\_sgm2NhoodWgt\_slope

【参数功能描述】

低频缩略图IIR滤波值域权重计算的指数曲线斜率。

【参数⽤法】：

默认值为1，

值越⼤，值域sigma转换的邻域值域权重越⼤，降噪⼒度变弱。

Dynamic: hw\_cnrT\_nhoodWgtZero\_thred

【参数功能描述】

低频缩略图IIR滤波邻域权重截⽌的阈值，限制滤波器的最低频段，达到抑制拖影阈值的效果。

【参数⽤法】：

默认值为0.0313，

值越⼤，限制滤波器的最低频段越⼤，⾊度拖影越⼩。

Dynamic: hw\_cnrT\_iirFiltStrg\_maxLimit

【参数功能描述】

低频缩略图IIR滤波IIR反馈权重最⼤值限制。

【参数⽤法】：

默认值为1，

值越⼤，最⼤滤波⼒度越⼤。

### hiNr\_preLpf

Dynamic: sw\_cnrT\_filtCfg\_mode

【参数功能描述】

⾼频降噪的预低通滤波器空域权重系数的配置模式。

cnr\_cfgByFiltStrg\_mode：

直接⽤滤波⼒度值控制该滤波器空域权重系数。

cnr\_cfgByFiltCoeff\_mode：

直接配置空域权重系数来控制该滤波器。

【参数⽤法】：

默认⽤cnr\_cfgByFiltStrg\_mode。

Dynamic: sw\_cnrT\_filtSpatial\_strg

【参数功能描述】

当filtCfg\_mode = cnr\_cfgByFiltStrg\_mode时，⾼频降噪的预低通滤波器的⼒度值。

【参数⽤法】：

默认值为1，

值越⼤，双边空域权重越⼤，降噪⼒度越⼤。

Dynamic: hw\_cnrT\_filtSpatial\_wgt

【参数功能描述】

当filtCfg\_mode = cnr\_cfgByFiltCoeff\_mode时，通过该参数直接配置⾼频降噪的预低通滤波器的空域权重系数。

【参数⽤法】：

默认值为[0.1758, 0.1094, 0.0234, 0.1094, 0.0664, 0.0156]

Dynamic: hw\_cnrT\_lpfOut\_alpha

【参数功能描述】

通过⾼频降噪预低通滤波降噪前后数据的加权进⾏细节的回填，该参数为降噪后数据的权重

【参数⽤法】：

默认值1.0，

值越⼤，滤波后数据的权重越⼤，细节被回填的越少，同时噪声也会同步被回填。但是由于回填的是滤波前原始的数据，所以被回填最⼤的噪声是原始噪声。

hw\_cnrC\_luma2HiNrSgm\_curve

Dynamic: hw\_cnrC\_luma2HiNrSgm\_curve

【参数功能描述】

cnr⾼频噪声sigma标定曲线的像素亮度索引值。

【参数⽤法】：

默认值为：[0,64,128,256,384,640,896,1024]。

直接参考标定⼯具输出值。

Dynamic: hw\_cnrC\_luma2HiNrSgm\_curve

【参数功能描述】

⾼频噪声sigma标定曲线的噪声sigma值

【参数⽤法】：

默认值全为0.03。

直接参考标定⼯具输出值。

hiNr\_bifilt

Dynamic: hw\_cnrT\_uvEdg\_strg

【参数功能描述】

⾼频双边滤波，邻域像素与中⼼像素差异值计算中UV通道的占⽐。

【参数⽤法】：

默认值为3，

值越⼤，UV通道差异在计算像素差异值的权重越⼤，对于颜⾊边缘的保护更强。

Dynamic: hw\_cnrT\_filtWgtZero\_mode

【参数功能描述】

⾼频双边滤波的权重为0时，使⽤不同源作为此点滤波输出。

cnr\_wgtIsZero\_preLpfOut\_mode：使⽤⾼斯预滤波结果输出。

cnr\_wgtIsZero\_orgOut\_mode：使⽤原始图像点输出。

【参数⽤法】：

默认选cnr\_wgtIsZero\_preLpfOut\_mode。

Dynamic: hw\_cnrT\_locSgmStrg2SgmRat\_val

【参数功能描述】

该曲线以局部图像噪声强度表征值（locSgmStrg）索引，映射得到局部⾼频降噪双边滤波器的值域sigma⽐率⼒度调整参数（locSgmStrgSgmRat）。

来⾃前级的局部噪声强度表征值在图像的不同区域是不同的，例如：经过btnr之后，静⽌区locSgmStrg相对运动区域会⼩很多。通过该不同的局部噪声强度表征值映射得到的不同的值域sigma⽐率⼒度调整参数（locSgmStrgSgmRat），等效实现不同区域的局部去噪⼒度。

【参数⽤法】：

默认值[1, 0.8, 0.65, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.125, 0.0625, 0.02, 0.02]。

值越⼩，

1) 局部噪声强度表征值（locSgmStrg）导致的局部降噪⼒度差异越⼩。

2) 降噪⼒度越⼩

Dynamic: hw\_cnrT\_locSgmStrg2CtrWgt\_scale

【参数功能描述】

该曲线以局部图像噪声强度表征值（locSgmStrg）索引，映射得到⾼频降噪双边滤波器的滤波中⼼点权重的倍率调整参数（centerWgt）。

来⾃前级的局部噪声强度表征值在图像的不同区域是不同的，例如：经过btnr之后，静⽌区locSgmStrg相对运动区域会⼩很多。通过该不同的局部噪声强度表征值映射得到的不同的中⼼点权重，等效实现不同区域的局部去噪⼒度。

【参数⽤法】：

默认值为[1, 0.8, 0.6, 0.4, 0.4, 0, 0, 0, 0, 0, 0, 0, 0]。1.0表⽰不做调整。

值越⼩，当前点权重越⼩，降噪⼒度越⼤。

Dynamic: hw\_cnrT\_centerPix\_wgt

【参数功能描述】

⾼频降噪双边滤波器的滤波中⼼点权重。

【参数⽤法】：

默认值为[1, 0.8, 0.6, 0.4, 0.4, 0, 0, 0, 0, 0, 0, 0, 0]。

值越⼩，当前点权重越⼩，降噪⼒度越⼤。

Dynamic:hw\_cnrT\_nhoodWgt\_minLimit

【参数功能描述】

⾼频降噪双边滤波的权重的最⼩值限制，保证平坦区有⼀定的去噪⼒度。

【参数⽤法】：

默认值为0，

值越⼤，⾼频降噪双边滤波的最⼩⼒度值越⼤。

Dynamic: hw\_cnrT\_satAdj\_negOff

【参数功能描述】

⾊彩饱和度回填阈值的负向偏置参数，降噪后⾊彩饱和度损失⼤于阈值的部分进⾏饱和度回填。

【参数⽤法】：

默认值为0。

值越⼩，降噪后饱和度损失越⼩的区域也能够被回填饱和度。

Dynamic: hw\_cnrT\_satAdj\_scale

【参数功能描述】

⾊彩饱和度回填⼒度的⼤⼩。

【参数⽤法】：

默认值为0，

值越⼤，⾊彩饱和度回填⼒度越⼤。

Dynamic: hw\_cnrT\_bifiltOut\_alpha

【参数功能描述】

通过⾼频双边降噪前后数据的加权进⾏细节的回填，该参数为降噪后数据的权重

【参数⽤法】：

默认值1.0，

值越⼤，滤波后数据的权重越⼤，细节被回填的越少，同时噪声也会同步被回填。但是由于回填的是滤波前原始的数据，所以被回填最⼤的噪声是原始噪声。

调试步骤

SHARP

模块说明

⽆

### 模块框图



### 参数说明

shpScl\_radiDist

Static: hw\_sharpCfg\_opticCenter\_x

【参数功能描述】

镜头光学中⼼在图像中的横坐标。

【参数⽤法】：

默认镜头光学中⼼与图像中⼼重合，即横坐标==图像宽的1/2。

Static: hw\_sharpCfg\_opticCenter\_y

【参数功能描述】

镜头光学中⼼在图像中的纵坐标。

【参数⽤法】：

默认镜头光学中⼼与图像中⼼重合，即纵坐标==图像⾼的1/2。

hfExtra\_sgmEnv

Dynamic: sw\_sharpC\_luma2Sigma\_curve

【参数功能描述】

镜头光学中⼼在图像中的横坐标。

【参数⽤法】：

默认镜头光学中⼼与图像中⼼重合，即横坐标==图像宽的1/2。

hfExtra\_preBifilt

Dynamic: sw\_sharpT\_filtCfg\_mode

【参数功能描述】

⾼频提取的双边预滤波空域权重系数的配置模式。通过该双边预滤波器和⾼频提取的低通滤波器

（hfExtra\_lpf）的输出提取待锐化的⾼频细节信息（hf）。

sharp\_cfgByFiltStrg\_mode：

直接⽤滤波⼒度值⽣成该滤波器的空域权重系数。

sharp\_cfgByFiltCoeff\_mode：

直接配置该滤波器的空域权重系数。

【参数⽤法】：

默认⽤sharp\_cfgByFiltStrg\_mode。

Dynamic: sw\_sharpT\_filtSpatial\_strg

【参数功能描述】

当filtCfg\_mode = sharp\_cfgByFiltStrg\_mode时，⾼频双边预滤波空域⼒度值。

【参数⽤法】：

默认值为1，

值越⼤，⾼频双边预滤波空域滤波强度越⼤。即该双边滤波器的最⼤滤波强度越⼤。

Dynamic: hw\_sharpT\_filtSpatial\_wgt[3]

【参数功能描述】

当filtCfg\_mode = sharp\_cfgByFiltCoeff\_mode时，⾼频双边预滤波空域权重系数。

【参数⽤法】：

默认值为[0.2042, 0.1238, 0.0751]。

Dynamic: sw\_sharpT\_rgeSgm\_scale

【参数功能描述】

⾼频双边预滤波的值域sigma的倍率调整系数。

【参数⽤法】：

默认值为1，

值越⼤，⾼频双边预滤波的值域权重越⼤，保边效果越低，降噪⼒度越接近空域权重确定的最⼤滤波强度。

被提取的待锐化的⾼频信息的⾼频细节越少。

Dynamic: sw\_sharpT\_rgeSgm\_offset

【参数功能描述】

⾼频双边预滤波的值域值域sigma的正向偏置调整参数。

【参数⽤法】：

默认值为0，

值越⼤，⾼频双边预滤波的值域权重越⼤，降噪⼒度越⼤。

⼀般在值域sigma较⼩区域⼒度不⾜的时候，通过调整正向偏移值来进⾏单独调整，相对于调整sigma\_scale参数减少对sigma较⼤区域的影响。

Dynamic: hw\_sharpT\_bifiltOut\_alpha

### 【参数功能描述】

通过⾼频双边预滤波前后数据的加权进⾏细节的回填，该参数为双边预滤波后数据的权重。

通过该双边预滤波器和⾼频提取的低通滤波器(hfExtra\_lpf)的输出提取待锐化的⾼频信息hf。该滤波器影响待锐化⾼频细节的频段上限，即多⾼频的细节能够被锐化。

该滤波器侧重于在于将⾼频噪声从⾼频细节中滤除。

【参数⽤法】：

默认值0.5，

值越⼤，滤波后数据的加权权重越⼤，滤波强度越⼤。待锐化的⾼频细节越少。

### hfExtra\_lpf

Dynamic: sw\_sharpT\_filtCfg\_mode

【参数功能描述】

⾼频提取的低通滤波器的配置模式。通过该低通滤波器和双边预滤波器（hfExtra\_preBifilt）的输出提取待锐化的⾼频边缘信息（hf）。

sharp\_cfgByFiltStrg\_mode：

直接⽤滤波⼒度值控制该滤波器。

sharp\_cfgByFiltCoeff\_mode：

直接配置算⼦系数来控制该滤波器。

【参数⽤法】：

默认选择sharp\_cfgByFiltStrg\_mode。

Dynamic:sw\_sharpT\_hfHi\_strg

【参数功能描述】

filtCfg\_mode==sharp\_cfgByFiltStrg\_mode时，低通滤波器的⼒度参数。该低通滤波器与双边预滤波器（hfExtra\_preBifilt）配合提取待锐化⾼频信息中相对⾼频的部分（hfHi）。

【参数⽤法】：

默认值为2，

值越⼤，该低通滤波算⼦⼒度越⼤，对应提取的待锐化⾼频越强越多。

Dynamic:sw\_sharpT\_hfMid\_strg

【参数功能描述】

filtCfg\_mode==sharp\_cfgByFiltStrg\_mode时，低通滤波器的⼒度参数。该低通滤波器与双边预滤波器（hfExtra\_preBifilt）配合提取待锐化⾼频信息中相对⾼频的部分（hfMid）。

【参数⽤法】：

默认值为1，

值越⼤，该低通滤波算⼦⼒度越⼤，对应提取到的待锐化中⾼频越强越多。

Dynamic:hw\_sharpT\_lpf\_wgt

【参数功能描述】

filtCfg\_mode==sharp\_cfgByFiltCoeff\_mode时，低通滤波器的算⼦系数

【参数⽤法】：

Dynamic:hw\_sharpT\_lpfOut\_alpha

【参数功能描述】

通过低通滤波前后数据的加权进⾏细节的回填，该参数为低通滤波后数据的权重。

细节回填后的输出作为后级⾼频双边滤波器(hfExtra\_hfBifilt)的导向图。

【参数⽤法】：

默认值0.5，

值越⼤，低通滤波结果的权重越⼤，导向图降噪⼒度越⼤，进⽽影响⾼频双边滤波(hfExtra\_hfBifilt)的边缘细节平滑度。对于⾼频边缘的⽑刺建议优先适当增加该滤波器的⼒度来获取更平滑的导向图。

hfExtra\_hfBifilt

Dynamic:sw\_sharpT\_filtCfg\_mode

【参数功能描述】

通过低通滤波前后数据的加权进⾏细节的回填，该参数为低通滤波后数据的权重。

细节回填后的输出作为后级⾼频双边滤波器(hfExtra\_hfBifilt)的导向图。

【参数⽤法】：

默认值0.5，

值越⼤，低通滤波结果的权重越⼤，导向图降噪⼒度越⼤，进⽽影响⾼频双边滤波(hfExtra\_hfBifilt)的边缘细节平滑度。对于⾼频边缘的⽑刺建议优先适当增加该滤波器的⼒度来获取更平滑的导向图。

Dynamic:sw\_sharpT\_filtSpatial\_strg

【参数功能描述】

当filtCfg\_mode = sharp\_cfgByFiltStrg\_mode时，⾼频双边滤波空域⼒度值。

【参数⽤法】：

默认值为1，

值越⼤，⾼频双边滤波空域滤波强度越⼤。即该双边滤波器的最⼤滤波强度越⼤。

Dynamic:hw\_sharpT\_filtSpatial\_wgt

### 【参数功能描述】

当filtCfg\_mode = sharp\_cfgByFiltCoeff\_mode时，⾼频双边滤波空域权重系数。

【参数⽤法】：

默认值为：[0.2042, 0.1238, 0.0751]。

Dynamic:sw\_sharpT\_rgeSgm\_scale

【参数功能描述】

待锐化的⾼频细节信息hf的双边滤波对应的值域sigma的倍率调整参数。

【参数⽤法】：

默认值为1，

值越⼤，降噪⼒度越⼤，⾼频细节损失越多。

### Dynamic:sw\_sharpT\_rgeSgm\_offset

### 【参数功能描述】

待锐化的⾼频细节信息hf的双边滤波的值域sigma的正向偏置参数。

【参数⽤法】：

默认值为0，

值越⼤，⾼频双边滤波的值域权重越⼤，降噪⼒度越⼤。

⼀般在值域sigma较⼩区域⼒度不⾜的时候，通过调整正向偏移值来进⾏单独调整，相对于调整sigma\_scale参数减少对sigma较⼤区域的影响。

### Dynamic:hw\_sharpT\_biFiltOut\_alpha

【参数功能描述】

待锐化的⾼频细节信息hf的双边滤波前后数据进⾏加权，此参数为双边滤波输出的权重⼤⼩。

【参数⽤法】：

默认值为0.5，

值越⼤，双边滤波输出的权重越⼤，⾼频细节损失越多。⾼频细节低通滤波器(hfExtra\_lpf)的输出是该双边滤波器的导向图，对于⾼频边缘的⽑刺建议：

1. 适当增加(hfExtra\_lpf)低通的⼒度使得导向图更加平滑。

2. 然后在适当增加该双边滤波的⼒度。

### shpScl\_hf

Dynamic:hw\_sharpT\_luma2hfScl\_val

【参数功能描述】

以像素亮度索引，映射不同⾼频细节信息hf的倍率调整系数。该曲线与hf2ShpScl\_val曲线联动可以调整不同亮度区域的⾼频细节hf的锐化⼒度。

【参数⽤法】：

默认值全为1024，

值越⼤，⾼频细节信息hf的倍率调整系数越⼤，经过该调整系数作⽤的hf作为hf2ShpScl\_val曲线的索引值，进⼀步映射得到局部锐化⼒度倍率调整系数。

Dynamic:hw\_sharpT\_hf2ShpScl\_val

【参数功能描述】

该曲线以⾼频细节信息hf索引，映射得到局部锐化⼒度倍率调整系数。

该曲线与luma2hfScl曲线联动可以调整不同亮度区域的⾼频细节hf的锐化⼒度。⼀般⽤于降低的噪声被锐化加强的影响，需要在弱纹理锐化和噪声被锐化加强上做平衡。

【参数⽤法】：

默认值全为1.0，

值越⼤，⾼频细节信息hf的局部锐化⼒度倍率调整系数越⼤，⾼频细节信息hf锐化越强。

注意该曲线建议设置成单调平滑递增，避免变化过于剧烈导致图像局部锐化的不均匀性。

### shpScl\_locSgmStrg

Dynamic:hw\_sharpT\_locSgmStrg\_mode

【参数功能描述】

YNR内部局部噪声强度表征值（locSgmStrg）⽣成模式的配置

sharp\_locGlbSgmStrgMix\_mode：

设置的全局噪声强度表征值与前级输⼊的局部噪声强度表征值加权混合模式。

sharp\_glbSgmStrgOnly\_mode：

仅来源于设置的全局噪声强度表征值。

【参数⽤法】：

默认值为sharp\_locGlbSgmStrgMix\_mode。

Dynamic:hw\_sharpT\_glbSgmStrg\_val

【参数功能描述】

全局的图像噪声强度表征值（glbSgmStrg）设置参数。

全局噪声强度表征值（glbSgmStrg）与前级输⼊的局部噪声强度表征值（locSgmStrg）进⾏加权作为该区域的局部噪声强度表征值（locSgmStrg）。

【参数⽤法】：

该参数越⼤，通过glbSgmStrg\_alpha参数加权后的最终局部噪声强度值（locSgmStrg）也越⼤。

局部噪声强度值（locSgmStrg）越⼤，锐化模块内部会认为噪声更⼤。从曲线

（locSgmStrg2ShpScl\_val）中映射得到的是更⼤局部图像噪声强度表征值（locSgmStrg）对应的锐化⼒度倍率调整系数（ShpScl），进⽽影响图像的局部锐化⼒度。

Dynamic:hw\_sharpT\_glbSgmStrg\_alpha

【参数功能描述】

全局噪声强度表征值加权的权重值。

全局噪声强度表征值（glbSgmStrg）与前级输⼊的局部噪声强度表征值（locSgmStrg）进⾏加权作为该区域的局部噪声强度表征值（locSgmStrg）。

【参数⽤法】：

参数值越⼤，全局的图像噪声强度表征值权重越⼤。1.0表⽰最终的局部噪声强度值（locSgmStrg）等效于全局图像噪声强度表针值（glbSgmStrg）。

### Dynamic:hw\_sharpT\_locSgmStrg\_scale

【参数功能描述】

来⾃前级的局部噪声强度表征值（locSgmStrg）对应的倍率调整系数。

来⾃前级的局部噪声强度表征值在图像的不同区域是不同的，通过该参数等效实现不同区域的局部去噪⼒度。例如：经过btnr之后，静⽌区locSgmStrg 相对运动区域会⼩很多。

【参数⽤法】：

该倍率系数越⼤，

1) 局部噪声强度表征值的局部差异越⼤，进⽽影响的局部锐化⼒度差异越⼤。

2) 同时局部噪声强度表征值也越⼤。

锐化模块内部会认为噪声更⼤。从曲线（locSgmStrg2ShpScl\_val）中映射得到的是更⼤局部图像噪声强度表征值（locSgmStrg）对应的锐化⼒度倍率调整系数（ShpScl），进⽽影响图像的局部锐化⼒度。

### shpScl\_textDetect

Dynamic:hw\_sharpT\_estNsFilt\_mode

【参数功能描述】

预估噪声的计算模式配置

sharp\_allFilt\_mode：

预估窗⼝内所有点参与计算

sharp\_nhoodFiltOnly\_mode：

滤波窗⼝内邻域点参与，当前中⼼像素点不参与。

【参数⽤法】：

默认选择sharp\_allFilt\_mode。

Dynamic:hw\_sharpT\_estNsClip\_mode

【参数功能描述】

预估噪声的限制阈值的⽣成⽅式。

sharp\_preNsSgmStats\_mode：

基于硬件前⼀帧数据的全局统计值。

sharp\_setManual\_mode：

通过estNsManual\_maxLimit参数配置其阈值

【参数⽤法】：

默认选择sharp\_setManual\_mode。

Dynamic:hw\_sharpT\_estNsManual\_maxLimit

【参数功能描述】

estNsClip\_mode == sharp\_setManual\_mode时，预估噪声的最⼤限制阈值参数。

预估纹理=带噪纹理-预估噪声。

【参数⽤法】：

默认值为0。

值越⼤，最⼤预估噪声越⼤，最⼩预估纹理越⼩，纹理检测导致的局部锐化⼒度的倍率系数最⼩值越⼩。

Dynamic:hw\_sharpT\_estNs\_scale

【参数功能描述】

预估噪声的强度倍率调整系数。

预估纹理=带噪纹理-预估噪声。

【参数⽤法】：

默认值为1，

值越⼤，预估噪声强度值越⼤，预估纹理（texShp）越⼩，进⽽

```javascript
texShpSclRemap_en==false：
```

预估纹理对应的局部锐化⼒度倍率调整系数（ShpScl）越⼤。

```javascript
texShpSclRemap_en==true：
```

从曲线（texShpSclRemap\_val）中映射得到的是更⼤预估纹理（texShp）对应的锐化⼒度倍率调整系数（ShpScl），进⽽影响图像的局部锐化⼒度。

### sharpOpt

Dynamic:hw\_sharpT\_shpSrc\_mode

【参数功能描述】

锐化的⾼频值叠加回基础图像作为最终锐化的结果。此参数为基础图像源的选择。

sharp\_hfExactPreBfOut\_mode：

选择预滤波（hfExtra\_preBifilt）输出为基础图像。

sharp\_sharpIn\_mode：

选择模块原始输⼊图像作为基础图像。

【参数⽤法】：

默认选择sharp\_hfExactPreBfOut\_mode。

⼀般预滤波图像更平滑细节更少，原始输⼊图像细节更多噪声更⼤。

Dynamic:hw\_sharpT\_shpOpt\_mode

【参数功能描述】

纹理局部锐化⼒度（texShpScl）debug模式。

sharp\_allShpSclEn\_mode：

正常模式，纹理局部锐化⼒度（texShpScl）与其他局部锐化⼒度共同作⽤。

sharp\_texShpSclDis\_othrEn\_mode：

仅关闭纹理局部锐化⼒度（texShpScl）。

sharp\_texShpSclEn\_othrDis\_mode:

仅开启纹理局部锐化⼒度（texShpScl）。

sharp\_texShpSclDebugOut\_mode：

以灰度图⽅式显⽰输出纹理局部锐化⼒度（texShpScl），纹理局部锐化⼒度（texShpScl）越⼤灰度图越亮。

【参数⽤法】：

默认值为sharp\_allShpSclEn\_mode。

1) texShpSclEn\_othrDis\_mode模式可以观察关⼼的图像纹理是否被纹理局部锐化⼒度（texShpScl）给增强，锐化⼒度是否合适。

2) 切换⾄texShpSclDebugOut\_mode 模式，可以直接查看纹理局部锐化⼒度（texShpScl）的⼤⼩来调整纹理检测对应的参数。配合切换正常模式查看锐化⼒度。

Dynamic:hw\_sharpT\_hfHiGlbShpScl\_val

【参数功能描述】

待锐化⾼频信息的⾼频部分（hfHi）的全局锐化⼒度⼤⼩

【参数⽤法】：

默认值为5，

值越⼤，待锐化⾼频信息的⾼频部分（hfHi）的全局锐化⼒度越强。

Dynamic:hw\_sharpT\_hfMidGlbShpScl\_val

【参数功能描述】

待锐化⾼频信息的中⾼频部分（hfMid）的全局锐化⼒度⼤⼩

【参数⽤法】：

默认值为5，

值越⼤，待锐化⾼频信息的中⾼频部分（hfMid）的全局锐化⼒度越强。

Dynamic:hw\_sharpT\_locSgmStrg2ShpScl\_val

【参数功能描述】

该曲线以局部图像噪声强度表征值（locSgmStrg）索引，映射得到局部图像噪声强度表征值的局部锐化⼒度（locSgmStrgShpScl）。

来⾃前级的局部噪声强度表征值在图像的不同区域是不同的，通过该参数等效实现不同区域的局部锐化⼒度。例如：经过btnr之后，静⽌区locSgmStrg 相对运动区域会⼩很多。

【参数⽤法】：

默认值为全1. 1.0表⽰该倍率系数为1，即局部噪声强度表征值（locSgmStrg）对锐化⼒度没有影响。值越⼩，

1) 局部噪声强度表征值（locSgmStrg）导致的局部锐化⼒度差异越⼩。

2) 锐化⼒度越⼩

Dynamic:hw\_sharpT\_radiDist2ShpScl\_val

【参数功能描述】

该曲线以距离光⼼的径向距离（radiDist）索引，映射得到径向距离局部锐化⼒度（radiDistShpScl）。由于镜头阴影的存在，距离镜头光学中⼼的不同距离ISP在图像上使⽤的增益往往不同导致噪声信噪⽐不同。该参数⽀持根据图像像素点的径向距离配置不同锐化⼒度

【参数⽤法】：

默认值为全1. 1.0表⽰该倍率系数为1，即径向距离（radiDist）对锐化⼒度没有影响。值越⼩，

1) 径向距离（radiDist）导致的局部锐化⼒度差异越⼩。

2) 锐化⼒度越⼩

Dynamic:hw\_sharpT\_tex2ShpScl\_scale

【参数功能描述】

预估纹理（texShp）在转换为纹理局部锐化⼒度（texShpScl）的倍率调整系数。

【参数⽤法】：

默认值1，

值越⼤，转换的局部锐化⼒度越强。

Dynamic:hw\_sharpT\_texShpSclRemap\_en

【参数功能描述】

对纹理局部锐化⼒度（texShpScl）重映射的开关。不同的纹理局部锐化⼒度（texShpScl）进⾏不同的倍率调整后作为最终的纹理局部锐化⼒度（texShpScl）。

【参数⽤法】：

默认值为0，即关闭纹理局部锐化⼒度（texShpScl）重映射功能。

Dynamic:hw\_sharpT\_texShpSclRemap\_val

【参数功能描述】

该曲线以纹理局部锐化⼒度（texShpScl）索引，映射得到对纹理局部锐化⼒度（texShpScl）进⾏调整的倍率系数。

【参数⽤法】：

默认值全为1024。

值越⼩，最终的纹理局部锐化⼒度（texShpScl）越⼩。

### 【参数功能描述】

锐化后的⾼频细节信息（hf）上下限阈值曲线的查表索引源选择。

sharp\_orgPix\_mode：

以sharp模块原始输⼊像素的亮度值作为索引。

sharp\_lpfPix\_mode：

以低通滤波（hfExtra\_lpf）后像素亮度值作为索引

【参数⽤法】：

默认sharp\_lpfPix\_mode。

### Dynamic:hw\_sharpT\_luma2WhtEdg\_maxLimit

【参数功能描述】

锐化后的⾼频细节信息（hf）上限阈值曲线。即⾼频细节信息（hf）被锐化后的最⼤值，⾼频锐化的最⼤值决定了锐化⽩边的强度。

【参数⽤法】：

默认值为256，

值越⼤，⾼频细节信息（hf）被锐化后的最⼤值越⼤，⽩边强度越强。

Dynamic:hw\_sharpT\_luma2BkEdg\_maxLimit

【参数功能描述】

锐化后的⾼频细节信息（hf）下限阈值曲线。即⾼频细节信息（hf）被锐化后的最⼩值，⾼频锐化的最⼩值决定了锐化⿊边的强度。

【参数⽤法】：

默认值为256，

值越⼤，⾼频细节信息（hf）被锐化后的最⼩值越⼤，⿊边强度越弱。

### 调试步骤
