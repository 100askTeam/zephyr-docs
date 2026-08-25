---
sidebar_position: 1
---

# RKISP1\_IQ\_Parameters\_User\_Guide

### 3.1 header 参数说明

Header 主要定义 IQ 创建日期，tuning 负责人，sensor 名称，镜头名称，IQ xml 版本号和 sensor支持的分辨率等一些信息。

#### 3.1.1 IQ 基本信息

##### 3.1.1.1 code\_xml\_parse\_version

IQ相对应代码解析版本号

header   

a= type = struct   

code\_xml\_parse\_version v1.0.0   

eisp\_output\_type color   

creation\_date 2017-12-13   

creator Liquid   

sensor\_name OV5695   

sample\_name no   

generator\_version V1.0   

sdk\_IQfile\_Verify test   

resolution

Log 上会有提示，如下：

```
if(strcmp(meta data.code xml parse version, CODE XML PARSE VERSION)){
```

std::cout   

&lt;&lt; code xml parse version is no match   

&lt;&lt; meta data.code xml parse version   

&lt;&lt; " != ("   

&lt;&lt; CODE XML PARSE VERSION   

&lt;&lt; std::endl;   

return (false);

##### 3.1.1.2 其余 IQ 基本信息

&lt;header size="[1 1]" type="struct"&gt;   

&lt;creation\_date index="1" size="[1 10]" type="char"&gt;   

2016-08-31 IQ创建日期   

&lt;/creation\_date&gt;   

&lt;creator index="1" size="[1 4]" type="char"&gt;   

OYYF 调试人员名字   

&lt;/creator&gt;   

&lt;sensor\_name index="1" size="[1 6]" type="char"&gt;   

OV4689   

sensor名称   

&lt;/sensor\_name&gt;   

&lt;sample\_name index="1" size="[1 9]" type="char"&gt;   

LA6111PA   

&lt;/sample\_name&gt; 镜头名称   

&lt;generator\_version index="1" size="[16]" type="char"&gt;   

v0.4.0 IQ版本   

&lt;/generator\_version&gt; 口   

&lt;isp\_output\_type index="1" type="char" size="[1 6]"&gt;   

color   

&lt;/isp\_output\_type&gt;

isp\_output\_type：选择 isp 输出色彩模式: 目前共定义了 3 种模式：

1：color: 彩色图像模式，ISP 输出彩色图像；

2：gray: 灰度图像模式，ISP 输出灰度图像；

灰度图像模式下 awb 相关参数，均采用 BW 光源的相关参数配置。

&lt;sdk\_IQfile\_Verify index="1" type="char" size="[1 4]"&gt;   

Object\_verify   

&lt;/sdk\_IQfile\_Verify&gt;

sdk\_IQfile\_Verify: 用于 avl 模组的 IQ 效果是否经过测试的标志位。

1：Object\_verify: 客户测试通过

2：Subject\_verify: 主观测试通过

3：Both\_verify: 主客观均通过测试。

4：Test:IQ可以使用，但未经过 rk 主客观测试。

#### 3.1.2 header 支持配置多个分辨率

RK 在 Sensor 实际效果调试一般会调试两个分辨率，

一个作为拍照用的全分辨率（一般为 FULL分辨率）。

车机或者无人机的产品一般只调试一个分辨率。

需要支持更多或更少时，需要将 resolution 字段的定义进行相应修改，并对 sensor 参数中依赖分辨率的其他参数进行修改。

每个分辨率为一个 cell 依次填写在 resolution 字段内。

&lt;resolution index="1" size="[1 2]"type="cell"&gt; 支持多个分辨率   

&lt;cell index="1" size="[1 1] type="struct"&gt;   

&lt;name index=1" size="[1 9]" type="char"&gt; 第一个分辨率   

1920x1080 分辨率名称由宽x高命名   

&lt;/name&gt;   

&lt;id index="1" size="[1 10]" type="char"&gt;   

0x00000001 分辨率id号，按顺序从1递增   

&lt;/id&gt;   

&lt;width index="1" size="[1 1]" type="double"&gt;   

[1920] 分辨率的宽   

&lt;/width&gt;   

&lt;height index="1" size="[1 1]" type="double"&gt;   

[1080] 分辨率的高   

&lt;/height&gt;   

&lt;framerate index="1" size="[1 3]" type="cell"&gt;   

&lt;cell index="1" size="I1 1]" type="struct"&gt;   

&lt;name index="1" size="[1 6]" type="char"&gt;   

FPS\_15 分辨率序列对于帧率   

&lt;/name&gt; 命名为FSP\_帧率   

&lt;fps index="1" size="[1 1]" type="double"&gt;   

[15.0000]   

&lt;/fps&gt; 帧率   

&lt;/cell&gt;   

&lt;/framerate&gt;   

&lt;/cell&gt;   

&lt;cell index="2" size="[1 1]" type="struct"&gt; 第二个分辨率   

&lt;name index="T" size="[1 9]" type="char"&gt;   

2688×1520   

&lt;/name&gt;   

&lt;id index="1" size="[1 10]" type="char"&gt;   

0x00000002   

&lt;/id&gt;   

&lt;width index="1" size="[1 1]" type="double"&gt;   

[2688]   

&lt;/width&gt;   

&lt;height index="1" size="[1 1]" type="double"&gt;   

[1520]   

&lt;/height&gt;   

&lt;framerate index="1" size="[1 1]" type="cell"&gt;   

&lt;cell index="1" size="[1 1]" type="struct"&gt;   

&lt;name index="1" size="[1 6]" type="char"&gt;   

FPS\_08   

&lt;/name&gt;   

&lt;fps index="1" size="[1 1]" type="double"&gt;   

[7.5000]   

&lt;/fps&gt;   

&lt;/cell&gt;   

&lt;/framerate&gt;   

&lt;/cell&gt;   

&lt;/resolution&gt;

### 3.2 sensor 模块参数说明

#### 3.2.1 awb 模块参数说明

AWB   

index =1   

type = struct   

size = [1 1]   

valid\_version\_name   

index =1   

type = char   

size = [1 18]   

version\_10\_para   

a= index = 1   

type = struct   

size = [1 1]   

globals   

illumination   

version\_11\_para   

a= index = 1   

type = struct   

a= size = [1 1]   

globals   

illumination

目前 awb参数有两个版本，版本适配情况如下：


| AWB 版本 | 版本适配情况 |
| --- | --- |
| AWB VERSION 10 | camera_engine_rkisp:v2.0.0IQ magic version code: 635075 |
| AWB VERSION 11 | 不支持 |

### 两者的区别仅在白点参数条件和光源判断条件不同，其他参数都是相同的：

AWBVERSION\_10：白点条件参数还需经过多次转换，最后和寄存器条件相同。判断光源采用二维高斯分布方式来判断，和白平衡范围图上采用不同坐标，比较不直观。

AWBVERSION\_11：白点条件参数直接使用寄存器相对应的条件，更为直观，方便调试。判断光源方式采用欧式距离方式判断，比较直观判断光源。

因此，下面对 awb 参数进行描述时采用是 V10 参数，仅在白点条件和光源判断上增加 V11不同点的描述。

Awb 模块包含 globals 和 illumination 两部分参数。

globals 主要为白平衡白点条件参数和判断光源相关参数。

一般有几个分辨率就配置几个 cell，每个 cell 的参数基本相同，除了分辨率不同而已。如上所说，rk 调试一般选择两个分辨率，所以 cell 一般为 2 个。

illumination 为调试时候选择的几种标准光源的特性信息，包括白平衡，ccm，lsc 插值和 cc插值相关信息，以及光源特性参数。Illumination 的 Size必须和实际调试光源个数必须相匹配。Xml 解析会按照填写的个数去解析，多余的不解析。rk 调试一般只选择 A、CWF、TL84、D65 四个标准光源而已，所以填写 4。后面针对一些黑白摄像头，新增一个光源为 BW，用于黑白显示时候采用此光源的 awb，ccm，lsc 参数。所以目前版本一般是填 5。



##### 3.2.1.1 globals 参数说明

##### 3.2.1.1.1 分辨率信息参数

Name 命名为 width x heightResolution 命名也为 width x height

globals   

a= index = 1   

a= size = [1 2]   

a= type = cell   

cell   

index =1   

size = [1 1]   

type = struct   

由name 1920×1080   

resolution 1920x1080

##### 3.2.1.1.2 光源判断参数

### 1: AWB VERSION\_10 光源判断参数

在做白平衡 tuning 是会产生此参数，将其填入如下位置。

SVDMeanValue [0.3405073885950044 0.4   

PCAMatrix [-0.6787904814407830-0.053   

CenterLine [-0.7251382973142543-0.68

SVDMeanValue：为多个光源下的白点对应的 R,G,B 三通道的均值。

PCAMatrix：为多个光源下白点的 R,G,B 三通道均值确定的特征空间。

这边引入 PCA（主成分分析）的目的是让各个光源在 PCAMatrix 特征空间下的投影的方差最

### 2: AWB VERSION\_11 光源判断参数

不再有上面 AWB VERSION\_10 对应的三个参数。

直接通过统计的白平衡(rgainbgain)坐标,计算和多个标准光源(rgain,bgain)距离，距离最小的光源被判断是该场景对应的光源。

##### 3.2.1.1.3 白平衡范围大小参数

白平衡会对整个白平衡区域做范围大小限制，tuning 过程中会产生此参数，请将其填入如下位置。



上面的这几个参数均为 tuning 后得到的，与白平衡 tuning 时的绘制的白点区域相关，详细描述如下图：



图-1 白点区域曲线

当得到该场景的(gainR/gainG, gainB/gainG)后并不是直接运用于白平衡校正，而是会进行一定的调整。首先会判断该点是否超出了上图中橙色虚线的范围，接着用 IIR 滤波器将当前的该场景的(gainR/gainG, gainB/gainG)与前一帧的(gainR/gainG, gainB/gainG)关联起来（具体的实现见 AwbIIRDampCoef 参数的描述部分），最后用上图中的黑色虚线将(gainR/gainG,gainB/gainG)限制在黑色虚线的范围内

ExpPriorOutExpPriorOut = func(fGExp)，

##### 3.2.1.1.4 曝光和白点范围条件

### 1：AWB VERSION\_10 白点条件参数说明


|  |  |  |  | K_Factor afFade2 afCbMinRegionMax afCrMinRegionMax afMaxCSumRegionMax afCbMinRegionMin afCrMinRegionMin afMaxCSumRegionMin afMinCRegionMax afMaxYRegionMax afMinYMaxGRegionMax afMinCRegionMin afMaxYRegionMin | [4.5676] 1.8 1.95 2.1 2.35] [115 110 105 100 96 93 [90 95 105 113 120 125] [20 16 14 12 12 10] [128 126 124 122 120 1 [90 95 105 116123 126] [12 10 9 9 9 9] [20 17 15 15 14 13] [230 230 230 230 230 23 [30 30 30 30 30 30] [16 14 13 12 12 10] [230 230 230 230 230 23 [30 30 30 30 30 30] | [1.2 1.55 afMinYMaxGRegionMin |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  | 田 | afRefCr RegionSize [1] | [128128128128128128] [128128 128128128 128] |  |
|  |  |  |  | RegionSizelnc | [0.3] |  |
|  |  |  | RegionSizeDec | [0.02] |  |  |

### K\_Factor：

计算光源为室外光源的概率：

fGExp = (SensorGain * IntegrationTime * K_Factor );

曝光参数越大为室外光源的概率就越小。

若 ExpPriorOut&gt;=1,则判定为室外光源，

若 ExpPriorOut&lt;=0.5,则判定为室内光源。

若 0.5&lt;ExpPriorOut&lt;1,则该光源即可能是室外光源也可能是室内光源。

光圈大的 sensor 在 A光下需要的曝光比较小，容易导致 ExpPriorOut&gt;1，被判定为室外光源。  

此时可以增大 K\_Factor，减小 ExpPriorOut，使得 A 光不会被判断为室外光源。

f\_CbMin\_regionMax, f\_CbMin\_regionMin,

f\_CrMin\_regionMax, f\_CrMin\_regionMin,

f\_MaxCSum\_regionMax, f\_MaxCSum\_regionMin

上面 6 个参数矩阵中不同位置的值与 afFade2 矩阵中相应位置的值一一对应。

这些参数并不是 tuning 后得到的，需要参考白平衡范围坐标进行微调。

afFade2 中的值为多个 gainR/gainG 值下在 CenterLine 投影的横坐标。

afRefCb 和 afRefCr：影响白点的 refcb 和 refcr 分量基准，一般为 128。



f\_CrMin=RegionSize \* f\_CrMin\_regionMax + (1.0f - RegionSize) \* f\_CrMin\_regionM in  

f\_MaxCSum =RegionSize \* f\_MaxCSum\_regionMax + (1.0f - RegionSize) \* f\_Max CSum\_regionMin

MeasWdw.RefCr\_MaxR=0.5 \*(f\_CrMin - f\_CbM in )+128

MeasWdw.RefCb\_MaxB=0.5 \*(f\_CbMin - f\_CrM in )+128

MeasWdw.MinC =-0.5 \*(f\_CbMin +f\_Cr Min )+128

MeasWdw.MaxCSum=f\_MaxCSum

其中 RegionSize根据当前帧的白点数量进行调整，

如果白点数量小于白点数量的最小值

如果白点数量大于白点数量的最大值且白点在外部的白点边界线外

概况的说：白平衡白点条件随着 afFade2 参数的变化进行变化。

afCbMinRegionMax 和 afCbMinRegionMin：影响白点的 refcb 分量条件。

afCrMinRegionMax 和 afCrMinRegionMin：影响白点的 refcr 分量条件。

RegionSize、RegionSizeInc、RegionSizeDec：

此三个参数受白点检测出数量影响，从而影响上面白平衡条件。

### 2：AWB VERSION\_11 白点条件参数说明

为了使白点条件调节更为直观有效，方便调试，直接使用下图边界参数作为调试参数。



下面是对 VERSION\_11 版本白点条件描述。


| 由afFade田e由e田田田 | 2                     [1.2 1.55 1.8 2.05 2.3 2.5]afmaxCSum_br                     [20 16 14 12 12 10]afmaxCSum_sr                     [12 10 9 9 9 9]afminC_br                     [20 17 15 15 14 13]afMaxY_br                     [230 230 230 230 230 230]afMinY_br                     [30 30 30 30 30 30] | = |
| --- | --- | --- |
| 由 | afminC_sr                     [16 14 13 12 12 10]afMaxY_sr                     [230 230 230 230 230 230] |  |
| 田afMiafRafR |  |  |
| nY_sr                     [30 30 30 30 30 30]efCb                     [140.5134 128126.5120.5 113]efCr                     [115.5 122 128 129.5 135.5 143] |  |  |

afFade2：afFade2 中的值为 awb 白平衡范围图上多个 gainR/gainG 值下在 CenterLine 投影的横坐标。用来控制不同色温下使用不同的白点条件。

afmaxCSum\_br，afmaxCSum\_sr：

白点边界图上 AWB\_MAX\_CSUM，brsr 后缀为，白点数量多和少时候对应插值边界。

afminC\_br，afminC\_sr：

白点边界图上 AWB\_MIN\_C，brsr后缀为，白点数量多和少时候对应插值边界。

afMaxY\_br，afMaxY\_sr：

白点边界图上 AWB\_MAX\_Y，brsr 后缀为，白点数量多和少时候对应插值边界。

afMinY\_br，afMinY\_sr：

白点边界图上 AWB\_MIN\_Y，brsr后缀为，白点数量多和少时候对应插值边界。

afRefCb：白点边界图上 AWB\_REF\_CB。

afRefCr：白点边界图上 AWB\_REF\_CR。

##### 3.2.1.1.5 白平衡范围特殊限制

fRgProjlndoorMin [1.15] fRgProjMax [2.4663] fRgProjMaxSky [2.55] fRgProjOutdoorMin [1.9] fRgProjYellowLimitEnable [0] fRgProjALimit [5.0] fRgProjAWeight [0.0] fRgProjYellowLimit [1.4] fRgProjllIToCwfEnable [0] fRgProjlIIToCwf [-0.15] fRgProjIlIToCwfWeight [0.0] awb\_clip\_outdoor D65

fRgProjIndoorMin：最小可设定白平衡范围。

为图-1 中黑色虚线左端与 CenterLine的交点,为室内光源下 RgProj 的最小值。

fRgProjMax：最大可设定白平衡范围。

为图-1 中黑色虚线右端与 CenterLine 的交点，为 RgProj 的最大值。

fRgProjMaxSky：最大可检测白平衡范围。

fRgProjOutdoorMin：室内外分界白平衡界限。

为图-1 中斜的蓝色虚线与 CenterLine的交点，为室外光源下 RgProj 的最小值。

上面四个参数均为 tuning 过程中，会自动产生参数。

（1）当判定该场景的光源为室内光源时，调整后的 gainR/gainG 在 CenterLine 上投影的横坐标均大于等于 fRgProjIndoorMin；

（2）当判定该场景的光源为室外光源时，调整后的 gainR/gainG 在 CenterLine 上投影的横坐标均大于等于 fRgProjOutdoorMin；

下面 7 个参数均为特殊处理参数，一般是保持关闭状态，仅在特殊状况下会使用。通过 fRgProjYellowLimitEnable 和 fRgProjIllToCwfEnable 设置为 0 关闭，设置 1 为打开。fRgProjYellowLimitEnable、fRgProjALimit、fRgProjAWeight、fRgProjYellowLimit：改变对黄色物体白平衡微调。

是对 cwf和 d65 光源判断一个调节。

此参数需要人工对 sensor 的白平衡信息进行调节，非自动化产生参数。

awb\_clip\_outdoor 此参数无需改变。



##### 3.2.1.1.6 IIR 参数

IIR 主要包括两部分参数：一部分是 DAMP 参数，一部分是 ExpPrior 参数。此部分参数一般无需改变。

DAMP：通过当前帧与前一帧白平衡值进行加权平均，影响白平衡调节的快慢速度。

DampCoefAdd：damp 系数加加时每次加的值。

DampCoefSub：damp 系数减减时每次减的值。

DampingCoefMin：damp 系数最小值。

DampingCoefMax：damp 系数最大值。

DampingCoefInit：damp 系数初始值。

ExpPrior：基本保持不变，会记录 50 帧的 ExpPriorIn 参数，对其求均值 mean。

通过判断 mean - 当前 ExpPriorIn 是否超过 DampFilterThreshold，来决定 DAMP 系数增减，影响白平衡调节的快慢速度。

ExpPriorFilterSizeMax：ExpPrior 最大记录帧数，代码已定最大值为 50，此参数不可大于 50。  

ExpPriorFilterSizeMin：ExpPrior 最小记录帧数。

ExpPriorMiddle：

##### 3.2.1.2 illumination 参数说明

每个 cell 保存相应光源的特性信息，这些特性信息主要为白平衡，色彩校正矩阵，lsc和 cc 插值矩阵。

illumination   

index =1   

size = [1 4]   

a= type = cell   

日 cell   

a= index = 1   

size = [1 1]   

type = struct   

name A   

doorType Indoor   

GMM   

aLSC   

manualWB [1.34618003063887401.000000000   

manualccMatrix [1.3160902308619769 0.0894   

manualccOffsets [-113.155424248-33.37502   

awbType AUTO   

sat\_CT   

vig\_CT   

aCC   

由ecell   

cell   

末cell   

cell   

cell   

cell  

Name：光源名称

doorType：区分室内室外光源，室内光源为 Indoor，室外光源 Outdoor。

alsc: 该光源支持几个分辨率和几种补偿百分比的 lsc 调试参数。

manualWB：该光源白平衡数值。

manualccMatrix：该光源色彩校正矩阵。

awbType：默认都是 AUTO，自动白平衡。

sat\_CT：根据不同曝光的 gain值，可对选择不同曝光进行不同饱和度设定策略。

vig\_CT：根据不同曝光的 gain值，可对选择不同曝光进行不同 lsc 补偿程度设定策略。

aCC：色彩校正矩阵支持的几种饱和度的校正信息。

##### 3.2.1.2.1 光源判断参数

1：AWB VERSION\_10 光源判断参数

GMM：高斯概率参数，决定落在该光源内的概率。

### GMM 包含 invCovMatrix，GaussianScalingFactor，tau

&lt;GMM index="1" type="struct" size="[1 1]"&gt;   

&lt;invCovMatrix index="1" type="double" size="[1 4]"&gt;   

[1101.4841561222.582536 1222.582536 4296.764664]   

&lt;/invCovMatrix&gt;   

&lt;GaussianScalingFactor index="1" type="double" size="[1 1]"&gt;   

[286.39534]   

&lt;/GaussianScalingFactor&gt;   

&lt;tau index="1" type="double" size="[1 2]"&gt;   

[0.82 0.9]   

&lt;/tau&gt;   

&lt;GaussianMeanValue index="1"type="double" size="[1 2]"&gt;   

[-0.046689-0.061919]   

&lt;/GaussianMeanValue&gt;   

&lt;/GMM&gt;

### 2：AWB VERSION\_11 光源判断参数

&lt;referenceWBgain index="1" type="double" size="[1 4]"&gt;   

[1.1212713678806511 2.42632503376925]   

&lt;/referenceWBgain&gt;

referenceWBgain：标准光源对应 awb 四通道值白平衡值。

Awbv11版本光源判断，直接将当前白点统计出来的白平衡值和几个标准光源进行距离判断。距离谁最近，判断最近光源为当前帧应用的光源。

##### 3.2.1.2.2. manualWB，manualccMatrix，manualccOffset

&lt;manualWB index="1" type="double" size="[1 4]"&gt;   

[1.25109573759722112.25820001637039]   

&lt;/manualWB&gt;   

&lt;manualccMatrix index="1" type="double" size="[3 3]"&gt;   

[1.55343699952413 0.210099486880679-0.76353648640481   

-0.570668483789862.09533041607586-0.524661932285995   

-0.226803432256232-1.67598771013265 2.90279114238889]   

&lt;/manualccMatrix&gt;   

&lt;manualccOffsets index="1" type="double" size="[1 3]"&gt;   

[0 0 0]   

&lt;/manualccOffsets&gt;   

&lt;awbType index="1" type="char" size="[1 4]"&gt;   

AUTO   

&lt;/awbType&gt;

上面这些参数主要用于计算 ACC 部分的色彩校正参数，下面将逐一介绍。

### manualWB：

为各个光源下 tuning 后得到的白平衡校正参数，对应于 R,Gr,Gb,B通道的调节参数。

manualccMatrix 与 manualccOffset：

为各个光源下选择 100%或者 74%的饱和度进行 tuning 后得到的参数。

awbType: 1：AUTO, 自动 awb 参与计算的光源。

2：MANUAL, 像黑白摄像头，不会参与 awb 计算的光源。

##### 3.2.1.2.3 sat\_CT

&lt;sat\_CT index="1" type="struct" size="[1 1]"&gt;   

&lt;gains index="1" type="double" size="[1 4]"&gt;   

[12 48]   

&lt;/gains&gt;   

&lt;sat index="1" type="double" size="[1 4]"&gt;   

[100 100 100 100]   

&lt;/sat&gt;   

&lt;/sat\_CT&gt;

sat\_CT 表示饱和度与 gains 一一对应。

当确定了当前场景所落在的区域，获取 ACC 对应的 CCM 过程如下：

1：若为区域 A，CCM 只由主导光源确定

1.1：已知当前帧的 gain 利用 sat 和 gains 进行插值得到对应的 saturation，即通过 gain来确定当前场景对应的 saturation值；

1.3：根据 saturation 得到相应的 CCMoffset 矩阵，与 1.2 类似。

2：若为区域 B 或 C,CCM 由 tuning 时用到的所有光源共同决定，当为区域 B 时主导光源的贡献更多。

首先，按下列步骤计算出每一个光源 i 对应的 CCM\_i 矩阵，offset\_i 矩阵

2.1：已知当前帧的 gain 利用 sat 和 gains 进行插值得到对应的 saturation，即通过 gain来确定当前场景对应的 saturation值；

2.4：由权值 WeightTrans\_i 对所有光源的矩阵进行加权和得到最终未 damp 的矩阵 CCM

2.5：对矩阵进行 damp，用前一帧的矩阵和当前帧的矩阵进行加权和确定最终的矩阵，权值为 AwbIIRDampCoef（计算白平衡的校正参数也用到这个参数）。

##### 3.2.1.2.4 vig\_CT

&lt;vig\_CT index="1" type="struct" size="[1 1]"&gt;   

&lt;gains index="1" type="double" size="[1 4]"&gt;   

[1 24 8]   

&lt;/gains&gt;   

&lt;vig index="1" type="double" size="[1 4]"&gt;   

[100 100 100 100]   

&lt;/vig&gt;   

&lt;/vig\_CT&gt;

vig\_CT 表示图像四周的亮度与图像中心的亮度的比值，vig\_CT 与 gains 一一对应，及对应的 gain 下校正后的图像图像四周的亮度与图像中心的亮度的比值为 vig\_CT 中对应的值。

当确定了当前场景对应的曝光 gain 后，获取 ALSC 对应的校正参数过程如下：

（a）已知该场景对应的 gain，利用 vig\_CT 和 gains 进行插值得到对应的 vig ，即通过gain 来确定当前场景对应的 vig 值；

（c）对 LSC 参数进行 damp，用前一帧的 LSC参数和当前帧的 LSC 参数进行加权和确定最终的 LSC 参数，权值为 AwbIIRDampCoef（计算白平衡的校正参数也用到这个参数）。

##### 3.2.1.2.5 aCC

&lt;aCC index="1" type="struct" size="[1 1]"&gt;   

&lt;CC\_PROFILE\_LIST index="1" type="char" size="[1 10]"&gt;   

A\_100 A\_74   

&lt;/CC\_PROFILE\_LIST&gt;   

&lt;/aCC&gt;

aCC 对应该光源在 sensor 底下 CC 中调试了几个饱和度的内容。

一般 rk 默认一个光源要调试 2 个饱和度对应的 ccm。

一个是 100%饱和度，一个是 74%的饱和度。

#### 3.2.2 LSC 参数说明

LSC 模块全称：Lens Shading Correction。


| 适用软件及版本 | ISP版本 | 补偿位数 | 取值范围 | 最大补偿倍数 |
| --- | --- | --- | --- | --- |
| camera_engine_rkisp: v2.0.0 IQ magic code: 635075 | ISP10 | 12bit 2bit 整数，10bit 小数 | 1024-4095 | 4 |
| ISP11 | 12bit 2bit 整数，10bit 小数 | 1024-4095 | 4 |  |
| ISP12 | 13bit 3bit 整数，10bit 小数 | 1024-8191 | 8 |  |

LSC参数包含的 cell 个数 = 分辨 x 光源个数 x补偿程度个数。

RKIQ一般调试 2 个分辨率，4 种光源，100%和 70%的两种补偿程度，

那么就有 2 x 4 x 2 = 16 个 cell 要填写。

默认 xml文件中，我们设定是 7 钟光源，2 个分辨率，2 种补偿程度的 28 个 cell。

新增分辨率，光源或者补偿程度，请自行修改增加相应的 cell 信息。

白LSC   

index =1   

size = [1 28]   

type = cell   

cell   

index = 1   

size = [1 1]   

a= type = struct   

+name 1920×1080\_A\_70   

resolution 1920x1080   

+illumination A   

LSC\_sectors [16]   

LSC\_No [10]   

LSC\_Xo [15]   

LSC\_Yo [15]   

LSC\_SECT\_SIZE\_X [120 120 120 120 120 120   

LSC\_SECT\_SIZE\_Y [68 67 68 67 68 67 68 67   

vignetting [70]   

LSC\_SAMPLES\_red [2871 2617 2385 2234 208   

LSC\_SAMPLES\_greenR [2570 2335 2142 2022   

LSC\_SAMPLES\_greenB [2602 2354 2146 2023   

+LSC\_SAMPLES\_blue [2484 2254 2064 1941 18  

Name: widthxheight\_光源名称\_补偿程度。  

Resolution：widthxheight。  

Illumination: 光源名称。  

LSC\_sectors: LSC 分为 16 x 16 的分区，产生 17x17 的网格点。

LSC\_No: 实际未用到参数，请保持原值。

LSC\_Xo: LSC17x17 网格点 width 方向进行双线性插值系数预先计算所需参数。

LSC\_Yo: LSC17x17 网格点 height 方向进行双线性插值系数预先计算所需参数。

LSC\_SAMPLES\_red、LSC\_SAMPLES\_greenR、LSC\_SAMPLES\_greenB、LSC\_SAMPLES\_blue：分别代表 r, gr, gb,b 四通道 lsc 补偿系数，矩阵为 17x17。

#### 3.2.3 CC 参数说明

CC 参数总个数= 光源个数 X 饱和度个数

RkIQ 调试一般选择 5 个光源（A、CWF、TL84、D65、BW），两种饱和度（100%， 74%）。

CC   

index =1   

size = [1 14]   

type = cell   

cell   

a= index = 1   

size = [1 1]   

type = struct   

name A\_74   

saturation [74]   

ccMatrix [1.02391158168734   

+ccOffsets [-95.911013132144   

田wb [1.3047267444900894 1.

Name：命名规则，光源名称\_饱和度数值。

Saturation：饱和度数值。

ccMatrix：色彩校正矩阵，tuningccm 过程会产生此参数。

ccOffsets：色彩校正矩阵 offset，tuning ccm 过程可选择是否需要 offset。

#### 3.2.4 AF 参数说明

AF   

index =1   

type = struct   

size = [1 1]   

WindowNum [1]   

WindowA   

WindowB   

WindowC   

contrast\_af   

laser\_af   

pdaf

##### 3.2.4.1 窗口参数说明

WindowNum [1]   

a= index = 1   

a= type = double   

size = [1 1]   

WindowA   

index = 1   

type = struct   

size = [1 1]   

由h\_offs [0]   

田v\_offs [0]   

h\_size [0]   

+v\_size [0]   

WindowB   

index =1   

type = struct   

size = [1 1]   

h\_offs [0]   

v\_offs [0]   

h\_size [0]   

田v\_size [0]   

WindowC   

index = 1   

type = struct   

size = [1 1]   

田h\_offs [0]   

田v\_offs [0]   

h\_size [0]   

+v\_size [0]   

A

WindowNum：统计窗口个数设置，目前暂时支持窗口 A设置；

h\_offs：窗口 horizontal offset 坐标；

v\_offs：窗口 vertical offset 坐标；

h\_size：窗口 horizontal size 大小；

v\_size：窗口 vertical size 大小；

5&lt;= h\_offs +h\_size &lt;=line last pixel；

2&lt;=v\_offs+v\_size&lt;=number of lines - 2；

##### 3.2.4.2 contrast\_af 参数说明

contrast\_af   

index =1   

type = struct   

size = [1 1]   

enable [1]   

AfSearchStrategy ADAPTIVE\_RANGE   

+eFullDir ADAPTIVE   

FullRangeTbl [0 9 17 24 32 40 48 56 64]   

AdaptiveDir ADAPTIVE   

AdaptRangeTbl [1 10 18 26 33 40 46 52 57 61 64]   

TrigThers [0.075]   

TrigValue [20]   

TrigFrames [1]   

TrigAntiFlash [1]   

+FinishThersMain [0.3]   

eFinishThersSub [0.2]   

+FinishThersOffset [30]   

+StableThers [0.02]   

StableValue [8]   

+StableFrames [3]   

+StableTime [200]   

OutFocusValue [50]   

OutFocusLuma [15]   

OutFocusPos [30]

Enable：反差式对焦使能位，0 关闭，1 打开。

FULLRANGE：全局遍历搜索

HILLCLIMBING：爬山算法搜索

ADAPTIVE\_RANGE：自适应搜索

FullDir：全局遍历搜索方向，支持以下三种模式：

POSITIVE：从远焦向近焦开始搜索；

NEGATIVE：从近焦向远焦开始搜索；

ADAPTIVE：根据当前 position 自适应最优搜索方向；

FullRangeTbl：全局遍历搜索 step 的 table 表；

AdaptiveDir：自适应搜索方向，支持以下三种模式：

POSITIVE：从远焦向近焦开始搜索；

NEGATIVE：从近焦向远焦开始搜索；

ADAPTIVE：根据当前 position 自适应最优搜索方向；

AdaptRangeTbl：自适应搜索 step 的 table 表；

TrigThers：触发对焦阈值，越小越灵敏；

TrigValue：暂未使用；

TrigFrames：暂未使用；

TrigAntiFlash：防抖机制开关；

FinishThersMain：快速对焦完成时 main 阈值，越小越容易判断对焦已完成；

FinishThersSub：快速对焦完成时 sub 阈值，一般情况 main 值&gt;sub 值；

FinishThersOffset：快速对焦 offset，用于同时调整 main 和 sub 的整体阈值；

StableValue：暂未使用；

StableFrames：稳定帧数，用于衡量画面稳定时间，越小触发越灵敏；

StableTime：稳定时间（ms），用于衡量画面稳定时间，越小触发越灵敏；

OutFocusValue：失焦锐度阈值，通过判断锐度低于该阈值，即认为失焦状态， 通 常 设定为 0 或者较小值；

OutFocusLuma：失焦亮度阈值，在 LumaTriggerEnable 使能时有效，当环境 亮 度 小 于该阈值，认为此时锐度无法正确表征清晰度，取值范围 0&lt;=OutFocusLuma&lt;=255；

OutFocusPos：失焦后 position 停留位置，取值范围：0&lt;=OutFocusPos &lt;=64；

##### 3.2.4.3 laser\_af 参数说明


|  |  |  |
| --- | --- | --- |
|  |  |  |

&lt;laser\_af index="1" type="struct" size="[1 3]"&gt;   

&lt;enable index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/enable&gt;   

&lt;vcmDot index="1" type="double" size="[1 7]"&gt;   

[0 16 32 40 48 56 64]   

&lt;/vcmDot&gt;   

&lt;distanceDot index="1" type="double" size="[1 7]"&gt;   

[0.2 0.24 0.34 0.4 0.66 1 3]   

&lt;/distanceDot&gt;

&lt;/laser\_af&gt;

Enable：激光对焦使能位，0 关闭，1 打开。

vcmDot：马达对焦值。

distanceDot：与马达对焦值对应的距离。

##### 3.2.4.3 Pdaf 参数说明


|  |  |  |
| --- | --- | --- |
|  |  |  |

$$

```
\begin{array} { r l } & { < \mathsf { p d a f ~ i n d e x } = ^ { \ast } 1 ^ { \ast } \mathsf { \Pi } \tau \mathsf { p p e } = ^ { \ast } \mathsf { s t r u c t } ^ { \ast } \mathsf { s i z e } = ^ { \ast } [ 1 \mathsf { \Pi } ] ^ { \ast } > } \\ & { \qquad < \mathsf { e n a b l e ~ i n d e x } = ^ { \ast } \mathsf { I } ^ { \ast } \tau \mathsf { v p e } = ^ { \ast } \mathsf { d o u b l e } ^ { \ast } \mathsf { s i z e } = ^ { \ast } [ 1 \mathsf { \Pi } ] ^ { \ast } > } \\ & { \qquad [ 0 ] } \\ & { \qquad < / \mathsf { e n a b l e } > } \\ & { < / \mathsf { p d a f } > } \end{array}
```

$$

Enable：相位对焦使能位，0 关闭，1 打开。

#### 3.2.5 AEC 参数说明

AEC 模块全称：Auto Exposure Control。

AEC   

index =1   

a= type = struct   

à= size = [1 1]   

SetPoint [70]   

NightSetpoint [60]   

DynamicSetpoint   

CamerlclspHistMode RGB   

CamerlcIspExpMeasuringMode   

GridWeights [1344544   

NightGridWeights [1344:   

GainRange [1 16 16 0 1 16   

TimeFactor [0 0 1 0.5]   

ClmTolerance [10]   

DampOver [0.6]   

DampUnder [0.7]   

DampOverVideo [0.7]   

DampUnderVideo [0.9]   

ECM   

aFpsMaxGain [8]   

ExposureSeparate   

FpsSetConfig   

AEC\_Interval\_Adjust\_Strategy   

AOE\_Enable [0]   

AOE\_Max\_point [70]   

AOE\_Min\_point [50]   

AOE\_Y\_Max\_th [0.2]   

AOE\_Y\_Min\_th [0.1]   

AOE\_Step\_Inc [2]   

+AOE\_Step\_Dec [2]   

DON   

NLSC\_Config   

BackLight\_Config   

Hist\_2\_hal   

LockAE   

HdrCtrl

##### 3.2.5.1 AEC 基本参数

NightSetpoint：夜晚曝光目标值。前面 setpoint 为 normal 模式，NightSetpoint 为 night 模式。DynamicSetpoint：

gain转换成 reg 值的公式。  

转换公式为：set to driver reg = （gain\*C1 - C0）/M0 + 0.5  

&lt;GainRange index="1" type="double" size="[4 7]"&gt;  

[1.0 2.0 128.0 0.0 1.0 128 255  

2.0 4.0 64.0 -248.0 1.0 376 504  

4.0 8.0 32.0 -756.0 1.0 884 1012  

8.0 16.0 16.0 -1784 1.0 1912 2040]  

&lt;/GainRange&gt;  

xml 参数对应：  

第一列：gain区间起始值，  

第二列 gain 区间结束值，  

第三列：C1，  

第四列：C0，  

第五列：M0，  

第六列：gain起始值对应 reg，  

第七列：gain结束值对应 reg。

&lt;DynamicSetpoint index="1" type="cell" size="[1 2]"&gt;   

&lt;cell index="1" type="struct" size="[1 1]"&gt;   

&lt;name index="1" type="char" size="[1 6]"&gt;normal&lt;/name&gt;   

&lt;Enable index="1" type="double" size="[1 1]"&gt;[1]&lt;/Enable&gt;   

&lt;ExposueValue index="1" type="double" size="[1 6]"&gt;[0 0.06 0.15 0.5 0.95 1.0]&lt;/ExposueValue&gt;   

&lt;DySetpoint index="1" type="double" size="[1 6]"&gt;[58 58 55 50 35 35]&lt;/DySetpoint&gt;   

&lt;/cell&gt;   

&lt;cell index="2" type="struct" size="[1 1]"&gt;   

&lt;name index="1" type="char" size="[1 6]"&gt;night&lt;/name&gt;   

&lt;Enable index="1"type="double" size="[1 1]"&gt;[1]&lt;/Enable&gt;   

&lt;ExposueValue index="1"type="double" size="[1 6]"&gt;[0 0.06 0.15 0.5 0.91.0]&lt;/ExposueValue&gt;   

&lt;DySetpoint index="1" type="double" size="[1 6]"&gt;[40 40 40 35 35 35]&lt;/DySetpoint&gt;   

&lt;/cell&gt;   

&lt;/DynamicSetpoint&gt;

动态目标值设置，跟随曝光值变化。

Name： 模式名称，目前只支持 normal 和 night 2 种模式。

Enable：该模式 dynamic setpoint 功能是否开启，0：关闭，1：开启。

ExposueValue：最大曝光量的百分比，对应不同曝光量下曝光目标值改变。

DySetpoint：动态曝光目标值，与上面 ExposueValue 一一对应

CamerIcIspHistMode: histogram 测量模式，模式有五种：R,G,B,RGB,Y.

CamerIcIspExpMeasuringMode: ae mean luma 测量模式，模式只有两种：Y 和 RGB。

GridWeights：normal 模式下 ae 分区权重，此版本 xml 权重个数必须为 9x9 个。

NightGridWeights：night 模式下 ae 分区权重，此版本 xml 权重个数必须为 9x9 个。

##### 3.2.5.2 GainRange 、TimeFactor

Gain 和 time 的理论值转换到寄存器值的转换公式。

TimeFactor：time 值转化成驱动 reg 值公式。

转换公式： $\mathsf &#123; r e g &#125; = \mathsf C 0 ^ &#123; \ast &#125; \mathsf &#123; V &#125; \mathsf &#123; T S &#125; + \mathsf C 1 + \mathsf C 2 ^ &#123; \ast &#125; \left( \mathsf &#123; t i m e &#125; ^ &#123; \ast &#125; \mathsf &#123; p c l k &#125; / \mathsf &#123; H T S &#125; + \mathsf C 3 \right)$

&lt;TimeFactor index="1" type="double" size="[1 4]"&gt;  

[0.0 0.0 1.0 0.5]  

&lt;/TimeFactor&gt;  

xml 对应参数：  

第一个：C0 ，  

第二个：C1，  

第三个 C2，  

第四个 C3  

根据公式，反过来计算曝光时间为：  

Time = ((reg - C0\*vts - C1) / C2 - C3)\*hts/pclk

##### 3.2.5.3 ClmTolerance 、Damp

ClmTolerance：目标亮度值容忍度。

实际值曝光区间为[setpoint - setpoint x ClmTolerance, setpoint + setpoint x ClmTolerance]。

Damp 系数：用来调整 ae 调节速度，当前曝光值与上一帧曝光值加权平均。

最终曝光值 = 当前曝光值 x DampCoef + 上一帧曝光值 x（1 - DampCoef ）

为保证 aec 调节速度和平滑过度，damp 系数一般取值区间为[0.5,0.8] 。

DampOver：当亮度值高于 setpoint，aec Damp 系数。

DampOverVideo：video 模式下，当亮度值高于 setpoint，aec Damp 系数。

DampUnderVideo：video 模式下，当亮度值低于 setpoint，aec Damp 系数。

aFpsMaxGain：目前此参数也未被使用。

##### 3.2.5.4 ExposureSeparate

&lt;ExposureSeparate index="1" type="cell" size="[1 2]"&gt;   

&lt;cell index="1" type="struct" size="[1 1]"&gt;   

&lt;name index="1" type="char" size="[1 6]"&gt;   

normal   

&lt;/name&gt;   

&lt;TimeDot index="1" type="double" size="[1 6]"&gt;   

[0 0.03 0.03 0.03 0.03 0.03]   

&lt;/TimeDot&gt;   

&lt;LTimeDot index="1" type="double" size="[1 6]"&gt;   

[0 0.03 0.03 0.03 0.03 0.03]   

&lt;/LTimeDot&gt;   

&lt;STimeDot index="1" type="double" size="[1 6]"&gt;   

[0 0.03 0.03 0.03 0.03 0.03]   

&lt;/STimeDot&gt;   

&lt;GainDot index="1" type="double" size="[1 6]"&gt;   

[1 1 5 5 8 16]   

&lt;/GainDot&gt;   

&lt;LGainDot index="1" type="double" size="[1 6]"&gt;   

[1 1 5 5 8 16]   

&lt;/LGainDot&gt;   

&lt;SGainDot index="1" type="double" size="[1 6]"&gt;   

[1 1 5 5 8 16]   

&lt;/SGainDot&gt;   

&lt;/cell&gt;

曝光分解参数里共有 3 组分解曲线，分别是:

TimeDot、GainDot：

对应非 HDRsensor正常曝光分解曲线，也对应 HDRsensor 的中帧曝光分解曲线。

纵坐标 gain：6 个 gain 对应坐标，gain 单位为 1x real gain。



每段区间要么 time 固定 gain 变化，要么 gain 固定 time 变化。

最后一段区间由最后两个点定义变化，最后一个点为最大曝光时间和曝光 gain值。

FpsSetConfig：固定帧率曝光时间分解控制，

&lt;FpsSetConfig index="1" type="struct" size="[1 1]"&gt;   

&lt;FpsSet\_enable index="1" type="double" size="[1 1]"&gt;   

[i]   

&lt;/FpsSet\_enable&gt;   

&lt;isFpsFix index="1" type="double" size="[1 1]"&gt;   

[1]   

&lt;/isFpsFix&gt;   

&lt;FpsFix\_TimeDot index="1" type="double" size="[1 6]"&gt;   

[0 1.0 1.0 1.0 1.0 1.0]   

&lt;/FpsFix\_TimeDot&gt;   

&lt;/FpsSetConfig&gt;

isFpsFix：是否是固定帧率，0：不是固定帧率，1：固定帧率。

FpsFix\_TimeDot：固定帧率采用曝光时间分解点值，按照固定帧率最大曝光时间百分比来填。

替换上面 ExposureSeparate 中 TimeDot。

### Aec Antiflicker 的方式：

曝光分解过程中，对 flicker进行调节方式是：

凡是曝光时间大于 flicker时间的，必须为 flicker整数倍。

另外此曝光分解策略同时定义了最大曝光时间和最大曝光 gain。

想改变帧率的，请在这里调节最大曝光时间。

想改变最大 gain 的，请在这里调节最大 gain 值，但不能超过驱动设置最大值。

驱动最大值由 GainRange里决定。

##### 3.2.5.5 AEC\_Interval\_Adjust\_Strategy

曝光控制调节策略

&lt;AEC Interval Adiust Strategy index="1" type="struct" size="[1 1]"&gt;   

&lt;enable index="1" type="double" size="[11]"&gt;[1]&lt;/enable&gt;   

&lt;dLuma\_high\_th index="1"type="double" size="[1 1]"&gt;[0.5]&lt;/dLuma\_high\_th&gt;   

&lt;dLuma\_low\_th index="1" type="double" size="1 1]"&gt;[0.03]&lt;/dLuma\_low\_th&gt;   

&lt;adjust\_trigger\_frame index="1"type="double" size="[1 1]"&gt;[100]&lt;/adjust\_trigger\_frame&gt;   

&lt;/AEC\_Interval\_Adjust\_Strategy&gt;

Enable：是否使用曝光控制策略，0：关闭 ， 1：开启。

dLuma\_high\_th：当两帧图像亮度差大于等于此值时，立即进行曝光调整。

dLuma\_low\_th：当两帧图像亮度差大于等于此值时，则认为场景曝光不稳定，等待曝光稳定再进行调节。

adjust\_trigger\_frame：当曝光不稳定时候，统计帧数，如果其中有相邻两帧曝光差有大于dLuma\_low\_th 时候，则认为曝光不稳定。

##### 3.2.5.6 AOE

&lt;AOE\_Enable index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/AOE\_Enable&gt;   

&lt;AOE\_Max\_point index="1" type="double" size="[1 1]"&gt;   

[70]   

&lt;/AOE\_Max\_point&gt;   

&lt;AOE\_Min\_point index="1" type="double" size="[1 1]"&gt;   

[50]   

&lt;/AOE\_Min\_point&gt;   

&lt;AOE\_Y\_Max\_th index="1"type="double" size="[1 1]"&gt;   

[0.2]   

&lt;/AOE\_Y\_Max\_th&gt;   

&lt;AOE\_Y\_Min\_th index="1" type="double" size="[1 1]"&gt;   

[0.1]   

&lt;/AOE\_Y\_Min\_th&gt;   

&lt;AOE\_Step\_Inc index="1" type="double" size="[1 1]"&gt;   

[2]   

&lt;/AOE\_Step\_Inc&gt;   

&lt;AOE\_Step\_Dec index="1" type="double" size="[1 1]"&gt;   

[2]   

&lt;/AOE\_Step\_Dec&gt;

##### 3.2.5.6 DON


|  |  |  |
| --- | --- | --- |
|  |  |  |

DON：夜晚模式判断

&lt;DON index="1" type="struct" size="[1 1]"&gt;   

&lt;NightTrigger index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/NightTrigger&gt;   

&lt;NightMode index="1" type="double" size="[1 1]"&gt;   

[1]   

&lt;/NightMode&gt;   

&lt;DON\_Day2Night\_Fac\_th index="1" type="double" size="[1 1]"&gt;   

[7]   

&lt;/DON Day2Night Fac th&gt;   

&lt;DON\_Night2Day\_Fac\_th index="1" type="double" size="[1 1]"&gt;   

[15]   

&lt;/DON\_Night2Day\_Fac\_th&gt;   

&lt;DON\_Bouncing\_th index="1" type="double" size="[1 1]"&gt;   

[100]   

&lt;/DON\_Bouncing\_th&gt;   

&lt;/DON&gt;

此模块是软件上判断白天和夜晚的一些参数。

以前软件判断比较简单，后面有进行升级。一些参数含义重新定义或者删除。

Night\_Trigger：用于配置模式切换所依赖的触发条件。

0：不启用 Night 模式(TRIGGER\_OFF)

1：依赖感光元件(LIGHT\_SENS)

2：依赖曝光参数(NO\_LIGHT\_SENS)

1：正常模式(NORMAL)

2：黑白模式(WHITE\_BLACK)

当 Night\_Trigger=2 时，AEC 模块将依赖以下公式与参数决定使用白天或黑夜模式

公式：Factor = (MeanLuma/(Gain x Time x 10))

DON\_Bouncing\_th：稳定帧数

DON\_Day2Night\_Fac\_th：处于白天模式时，Factor小于该值且不间断持续大于稳定帧数时切至黑夜模式

DON\_Night2Day\_Fac\_th：处于黑夜模式时，Factor大于该值且不间断持续大于稳定帧数时切至白天模式。

##


|  |  |  |
| --- | --- | --- |
|  |  |  |



白天采用彩色图像模式，sensor 上覆盖 IRCUT，防止红外进入。

夜晚采用黑白图像模式，sensor 上不在覆盖 IRCUT，红外光可进入 sensor，提高 sensor 感光能力。

Enable：使能位。 0：不使能 1：使能

IR\_rg：环境光仅有红外光下, 白平衡统计对应 r 值。

IR\_bg：环境光仅有红外光下, 白平衡统计对应 b 值。

Max\_Dis：可见光的几种标准光源的(r/g, b/g)坐标，与仅有红外光白平衡点(r/g,b/g)最大距离。Color2Black\_count：彩色切换黑白，连续统计低于彩色切换黑白阈值帧数后，才从彩色模式切换到黑白模式。此值就是连续多少帧设定。

Color2Black\_thresh：当可见光环境亮度较低时，会打开红外灯，撤掉 IRcut 滤光片，捕捉红外图像，并将显示从彩色模式切换黑白模式。此值就是彩色模式切换到黑白模式阈值，与图像亮度和曝光相关，Color2Black\_thresh= MeanLuma/(Gain x Time )。

Black2Color\_count：在红外模式下，当可见光亮度大于一定阈值，并且连续帧率超过Black2Color\_count 值，则将红外灯关闭，IRcut 滤光片覆盖在 camera 上，只采集可见光图像。并将显示从黑白模式切换到彩色模式。

Black2Color\_thresh：Black2Color\_thresh= MeanLuma/(Gain x Time )。当图像亮度和曝光达到一定程度后，会去判断是否要将 IRcut 滤光片重新覆盖上，只采集可见光图像。

Black2Color\_vb\_percent：当图像白平衡判断到可见光占全部光源一定比例后，会去判断是否要将 IRcut 滤光片重新覆盖上，只采集可见光图像。

Color2Black\_stable\_fps：当环境亮度较低，打开红外灯后，需要稳定一段时间，等待曝光稳定。此值为等待曝光稳定帧数。

还需配合 DON 夜晚模式切换设定，如下：

Night\_Trigger：必须设置为 2，依赖曝光参数(NO\_LIGHT\_SENS)

##### 3.2.5.8 BackLight\_Config

BackLight\_Config： 背光参数调节。

&lt;BackLight\_Config&gt;   

&lt;Enable index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/Enable&gt;   

&lt;LumaLowTh index="1" type="double" size="[1 1]"&gt;   

[100]   

&lt;/LumaLowTh&gt;   

&lt;LumaHighTh index="1" type="double" size="[1 1]"&gt;   

[180]   

&lt;/LumaHighTh&gt;   

&lt;WeightMinTh index="1" type="double" size="[1 1]"&gt;   

[0.1]   

&lt;/WeightMinTh&gt;   

&lt;WeightMaxTh index="1" type="double" size="[1 1]"&gt;   

[1.0]   

&lt;/WeightMaxTh&gt;   

&lt;/BackLight\_Config&gt;

Aec 分区的亮度，当分区的亮度较高时，降低高亮度分区的权重，来提高 aec。

通过亮度区间线性插值来逐渐降低高亮度的权重。越亮，权重越低。

Enable：模块使能位，1：使能， 0：关闭。

LumaLowTh：亮区权重插值区间最低亮度值。

LumaHighTh：亮区权重插值区间最高亮度值。

WeightMinTh：亮区权重最低值。

WeightMaxTh：亮区权重最高值。

##### 3.2.5.9 Hist\_2\_hal

&lt;Hist\_2\_hal&gt;   

&lt;Enable index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/Enable&gt;   

&lt;LowHistBinTh index="1" type="double" size="[1 1]"&gt;   

[13]   

&lt;/LowHistBinTh&gt;   

&lt;/Hist\_2\_hal&gt;

主要作用是将过曝的几个 hist 的百分比传给应用层。

Enable：模块使能位，1：使能，0：关闭

LowHistBinTh：从第几个 bin 开始为过曝 hist，累加计算到最大 bin 的过曝百分比传给上层应用。

##### 3.2.5.10 LockAE

&lt;LockAE index="1" type="struct" size="[1 1]"&gt;   

&lt;LockAE\_enable index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/LockAE\_enable&gt;   

&lt;GainValue index="1" type="double" size="[1 3]"&gt;   

[9.19 9.69 7.41]   

&lt;/GainValue&gt;   

&lt;TimeValue index="1" type="double" size="[1 3]"&gt;   

[1710 8]   

&lt;/TimeValue&gt;   

&lt;/LockAE&gt;

LockAE 模块，用于手动设置 HDR-AE 的曝光值，供测试使用。

LockAE\_enable:手动设置曝光功能使能开关，0: auto Hdr-AE; 1: manual Hdr-AE。

GainValue: 设置 HDR 3 帧曝光 gain 值，顺序为 L/M/S，gain 值无大小顺序要求。取值范围在 GainRange 范围内。

### TimeValue:

大小顺序要求：Tl &gt;=Tm&gt;=Ts;

结合 sensor 的 HDR 模式，staggered（2/3 帧）模式要求 Tl &gt;=Tm&gt;=Ts，且 3 帧曝光时间之和不得超过 TotalTime=1/hdr\_fps; DCG 模式(2 帧)要求 Tl=Tm=Ts;

当 HDR 合成为 2 帧模式时，中帧曝光依然需要设置，大小需要按上述要求设置。

##### 3.2.5.11 HdrCtrl


|  |  |  |
| --- | --- | --- |
|  |  |  |

HdrCtrl   

index = 1   

type = struct   

size = [1 1]   

Enable [0]   

Mode DCG   

FrameNum [2]   

DCGRatio [ù]   

LframeCtrl   

index = 1   

type = struct   

size = [1 1]   

LGainLevel [22 30 44   

LExpLevel [0 0.1 0.3 0   

LSetPoint [65 60 55 45   

TargetDarkROILuma [3   

SframeCtrl   

index = 1   

type = struct   

size = [1 1]   

SGainLevel [1 2 4 8 12   

SExpLevel [0 0.1 0.3 0   

TargetOELuma [130 1:   

由SSetPoint [60 55 50 45   

OETolerance [15]   

OELumaDistTh [20]   

M2S\_Ratio [5]   

L2M\_Ratio [5]  

HdrCtrl 模块，用于控制与 HDRAE 相关的参数。  

该控制位与 1608 使能开关（rkisp 代码中）共同控制 HDR-AE 的开关。  

Mode：设置 sensor 采用的 HDR 模式。  

现支持两种模式：（1）DCG （2）STAGGER，需全大写  

DCG 模式：使用 2 帧 merge，要求 2 帧曝光时间一致，gain值不同  

STAGGER 模式（兼容 DOL 模式）：使用 2/3 帧 merge，每帧曝光时间和 gain 值可分别设置  

FrameNum：设置 HDR merge 使用的帧数，仅支持 2、3 帧 HdrMerge。  

DCGRatio： sensor 采用 HDR-DCG 模式时，需要设置 conversion ratio；  

非 DCG 模式，该位默认值为 1。

SmaxExposure=SmaxGain\*SmaxIntegrationTime(由 ExposreSeperate 决定)



LframeCtrl：长帧控制子模块

$$

```
\begin{array} { r l } { { \tt L E x p l e v e l : } } & { \vec { \geq } \vec { \jmath } _ { \vec { \jmath } \vec { \jmath } } ^ { - } \overleftrightarrow { \jmath } _ { \vec { \jmath } } ^ { - } \overleftrightarrow { \jmath } _ { \vec { \imath } \downarrow \downarrow } ^ { \perp } \mathcal { L } _ { \vec { \jmath } \vec { \jmath } } ^ { - } \chi _ { \vec { \imath } \downarrow \downarrow } ^ { \perp } \chi _ { \vec { \jmath } } ^ { - } / \vec { \jmath } _ { \vec { \jmath } } ^ { + } \overleftrightarrow { \jmath } _ { \vec { \jmath } } ^ { - } \ \overbrace { \mathbb { E } \mathbb { E } \times \mathbb { V } ^ { \prime } \mathbb { E } } ^ { \mathbb { E } \times \mathbb { V } / \mathbb { E } } , } \\ & { { \tt L e x p l e v e l - } { \tt L E x p o s u r e } / \mathrm { L m a x E x p o s r e } } \\ & { { \tt L m a x E x p o s u r e - } { \tt L m a x G a i n } ^ { * } { \tt L m a x l n t e g r a t i o n T i m e } ( \mathbb { H } \ \mathrm { E x p o s r e S e p e r a t e ~ \it \hat { W } \cdot \it { \hat { K } \cdot \it { \hat { K } \cdot \it { \hat { K } \cdot \xi } } } } ) } \end{array}
```

$$

LSetPoint: 动态长帧全局亮度均值目标值,与 LexpLevel一一对应, 固定 6 个值，5 个区间。

TargetDarkROILuma: 动态长帧暗区亮度均值目标值，与 LexpLevel 一一对应, 固定 6 个值，5个区间，同区间内的暗区亮度目标值要求低于对应全局亮度目标值



SframeCtrl 短帧控制子模块  

TargetOELuma：动态短帧亮区均值目标值,与 SExpLevel 一一对应, 固定 6个值，5 个区间。SSetPoint：动态短帧全局亮度均值目标值,与 SExpLevel 一一对应, 固定 6 个值，5 个区间。同区间内的亮区亮度目标值要求低于对应全局亮度目标值  

OETolerance：设置短帧亮区目标容忍百分比，单位为%  

OELumaDistTh：设置短帧区域增长法中种子和候选种子的容忍亮度差值百分比，单位为%if (fabs(种子亮度-候选种子亮度)/种子亮度 &lt; OELumaDistTh/100 )候选种子成为新种子；

M2S\_Ratio: 设置中帧与短帧的最大曝光比值（仅当 3帧合成模式时，使用该项）

L2M\_Ratio：设置长帧与中帧的最大曝光比值（2 帧合成模式时，仅需设置该项，M2S\_Ratio不使用）

#### 3.2.6 BLS 参数说明

BLS：isp 中固定减模式，此参数为 12bit 。不同分辨率需对应不同 cell。

Name: width x height

Resolution : width x height

blsData: 12bit，参数依次为 r、gr、gb、b 通道相应的黑电平值。

白BLS   

index = 1   

size = [1 2]   

type = cell   

曰cell   

a= index = 1   

à= size = [1 1]   

type = struct   

name 1920x1080   

resolution 1920x1080   

blsData [64 64 64 64]

#### 3.2.7 DEGAMMA 参数说明

该模式尚未支持，不建议使能；

Name：模式选择

degamma\_dx：degamma 曲线 x 轴点间距。

degamma\_y：degamma 曲线 y 轴点

DEGAMMA   

a= index = 1   

a= size = [1 1]   

a= type = cell   

白cell   

index =1   

size = [1 1]   

type = struct   

name linear   

degamma\_dx [256 512 768 102   

degamma\_y [0 256 512 768 10:

#### 3.2.8 GOC 参数说明


| 适用 ISP 版本 | 适用软件及版本 | 支持情况 |
| --- | --- | --- |
| ISP10ISP11ISP12 | camera_engine_rkisp: v2.0.0IQ magic code: 635075 | Normal mode only |



GOC 模块全称：Gamma Out Curve，Gamma out 曲线配置。

每个模式下设置为：

enable\_mode：gamma out 是否打开， 0 关闭， 1 打开。

def\_cfg\_mode：gamma out 模式设置， 0 关闭， 1 为 setting， 2 为 default 即 gamma2.2

wdron\_gamma\_y: wdr 打开时，所使用 gamma out 曲线输出对应坐标。

IQ中 Gamma\_Y 必须按照（0-4095）范围填写 34 个点，且第 34 个点必须为 0。

内部 gamma\_x 坐标为 LOG 模式，非均匀等分。

#### 3.2.9 WDR 参数说明

WDR 模块全称：Wide Dynamic Range


| 适配 ISP 版本 | WDR 硬件 | 适用软件及版本 | 功能配置 |
| --- | --- | --- | --- |
| ISP10 | 无 | camera_engine_rkisp: v2.0.0IQ magic code: 635075 | 不支持 |
| ISP11 | 有 | 支持 |  |
| ISP12 | 有 | 支持 |  |

日WDR index = 1 size = [1 1] type = cell cell a.= index = 1 size = [1 1] type = struct enabled [1] mode [1] tbd [-1] curve1 curve2 local\_curve [00000000O global\_curve [0 0 0 0 0 0 0 0 ( wdr\_noiseratio 0x00ee wdr\_bestlight 0x0ccc wdr\_gain\_off1 0x000000cd wdr\_pym\_cc 0x3 wdr\_epsilon 0xc wdr\_Ivl\_en 0xf wdr\_flt\_sel 0x1 wdr\_gain\_max\_clip\_enable 0x wdr\_gain\_max\_value 0x40 wdr\_bavg\_clip 0x3 wdr\_nonl\_segm 0x0 wdr\_nonl\_open 0x1 wdr\_nonl\_mode1 0x0 wdr\_coe0 0x00000036 wdr\_coel 0x000000b7 wdr\_coe2 0x00000012 wdr\_coe\_off 0x0

Enable：模块打开关闭控制，1 为打开， 0 为关闭。

Mode：模式切换开关，wdr 目前有两种方式，

0 为：global 模式，根据直方图统计，改变全局 gamma 曲线形状。

1 为：block 模式，将图像分区，每个区域有自己相应 gamma 曲线调节动态范围。

curve1：目前无实际意义保留该项目

Curve2：目前无实际意义保留该项目

local\_curve：block 模式下，非线性转化曲线纵坐标。实际只使用前 16 段，剩余补零。

全为 0 代表使用代码中的默认值。

如果对 wdr算法了解，知晓参数实际影响，可从这设置相应的曲线形状。

非线性转化曲线是将像素值由线性域转化到非线性域的曲线，它的计算公式和曲线形状如

下：

$$

L _ &#123; n o n l i n e a r &#125; = \left\&#123; \begin&#123;array&#125; &#123; c &#125; &#123; &#123; L _ &#123; l i n e a r &#125; * 4 . 5 , &#125; &#125; \\ &#123; &#123; L _ &#123; l i n e a r &#125; 0 . 4 5 * 1 . 0 9 9 - 0 . 0 &#125; &#125; \end&#123;array&#125; \right.

$$



图表 1 非线性转换曲线

global\_curve：global 模式下，wdr 全局算法映射曲线纵坐标设置，共 33 段。

全为 0 则代表使用代码中的默认值。

如果对 wdr算法了解，知晓参数实际影响，可从这设置相应的曲线形状。

全局映射曲线是用于 WDR 全局算法的映射曲线，根据画面平均亮度通过软件生成配置。它的计算公式为：

$$

```
{ \mathrm { L u t } } = { \frac { 1 + a * { \mathrm { b i n } } s } { { \mathrm { b i n } } s + a } } * { \mathrm { b i n } } s\tag{1}
```

$$

（\*notice:上述公式只是当前默认的一个计算公式，并非最优）

其中，a为整图平均亮度值，由平均亮度计算或直方图得到；bins 是将整个亮度空间分成若干段后每一段的取值（即：若整个亮度空间为 1，平均分成 n 段，

$$

```
\mathrm { b i n s } = \{ 1 / \mathrm { n } , 2 / \mathrm { n } , . . . , ( \mathrm { n } - 2 ) / \mathrm { n } , ( \mathrm { n } - 1 ) / \mathrm { n } , 1 \} _ { \mathrm { ~ \scriptsize ~ o ~ } }
```

$$

wdr\_bestlight：平均亮度最大值，位宽 16bit。default = 0x0cf0。

上面两个参数用来限制 wdr后输出图像的平均亮度的取值范围，控制增益。wdr\_gain\_off1：增益曲线形状控制，包含 off1 和 off2 两个参数，总位宽 32bit。

off1 增益控制值 1，default = 0x0000。

off2 增益控制值 2，default = 0x019a。

调整这两个参数，则可控制增益曲线形状。

wdr\_pym\_cc：高斯金字塔 cc 值，位宽 8bit。default =二进制值 0000 0011。

wdr\_epsilon：高斯金字塔层间差值参数，default = 0001 1001(0x19)，位宽 8bit。

（即 0.1，针对 1080p；若为 0.05，则取值为 0x0c）

wdr\_lvl\_en：高斯金字塔选层功能开关，位宽 4bit。

```javascript
bit[3]:第四层开关,default = 1
```

```javascript
bit[2]:第三层开关,default = 1
```

```javascript
bit[1]:第二层开关,default = 1
```

```javascript
bit[0]:第一层开关,default = 1
```

wdr\_gain\_max\_clip\_enable：最大增益限制开关，位宽 1bit，选 1 开启。

default = 二进制 1111 0000。

用于抑制噪声被过度抬升，最大增益倍数限制在 0-15 倍之间；

wdr\_bavg\_clip：平均亮度上下限制开关，位宽 2bit。选 1 开启，default =二进制 11。

wdr\_nonl\_segm：非线性映射查表模式，位宽 1bit。

0：非均匀分段 1：均匀分段。default=0。

wdr\_nonl\_open：非线性转换功能开关，位宽 1bit。选 1 开启，default = 1。

wdr\_nonl\_mode1：平均亮度的非线性转换开关，位宽 1bit。选 0 开启，default = 0

wdr\_coe0：RGB 转 Y 通道系数 1，默认值 0x36, 数据位宽 8bit。

wdr\_coe1：RGB 转 Y 通道系数 2，默认值 0xb7, 数据位宽 8bit。

wdr\_coe2：RGB 转 Y 通道系数 3，默认值 0x12, 数据位宽 8bit。

上面几个参数均为 wdr相关寄存器设置，请保持目前使用的 xml中的默认值。

如需修改请参考 wdr的相关文档进行设定。

这些参数设置均为 16 进制寄存器值，使用 0x 开头。

&lt;wdr\_maxgain\_filter index="1" size="[1 2]" type="struct"&gt;  

&lt;wdr\_maxgain\_filter\_enable index="1" size="[1 1]" type="double"&gt;  

[1]  

&lt;/wdr\_maxgain\_filter\_enable&gt;  

&lt;wdr\_sensor\_gain\_level index="1" size="[1 5]" type="double"&gt;  

[1 2 4 8 16]  

&lt;/wdr\_sensor\_gain\_level&gt;  

&lt;wdr\_maxgain\_level index="1" size="[1 5]" type="double"&gt;  

[43222]  

&lt;/wdr\_maxgain\_level&gt;  

&lt;/wdr\_maxgain\_filter&gt;  

新增 wdrMaxGain 控制，此控制跟随曝光的 gain值进行变化。  

这里参数皆为 double类型，已不是 16 进制寄存器值，无需 0x 开头。  

wdr\_maxgain\_filter\_enable：MaxGain 控制是否打开。0 关闭，1 打开。

wdr\_sensor\_gain\_level：曝光 gain 档位。目前设定为 5 档，可进行增加或减少，增加或者减少时 size要跟随进行修改。

wdr\_maxgain\_level：Maxgain 跟随上面 gain 值进行改变档位数必须和上面的wdr\_sensor\_gain\_level 档位数相同，size 相同。Maxgain 取值范围为[0, 15]

#### 3.2.10 CAC 参数说明

CAC 模块全称：Chromatic Aberration Correction。  

目前建议关闭 CAC 校正功能，参数保留原来值。

CAC   

a= index = 1   

a= size = [1 2]   

a= type = cell   

cell   

a= index = 1   

size = [1 1]   

type = struct   

name 1920×1080   

resolution 1920x1080   

x\_normshift [6]   

x\_normfactor [29]   

y\_normshift [6]   

y\_normfactor [29]   

x\_offset [0]   

y\_offset [o]   

red\_parameters [-1.8125 -0.25   

blue\_parameters [-0.1875 -1.2

#### 3.2.11 DPF 参数说明



##### 3.2.11.1 DPF

模块全称：denoise pre-filter，作用是在 demosaic 前对 raw 进行一次去噪。

Name：分辨率名称 width x height。

resolution：分辨率名称 width x height。

adpf\_enable: 是否打开 adpf 模块，0 为关闭，1 为打开。

NLL\_SEGMENTATION：adpf噪声方差曲线 x 间距模式，0 为等间距，1 为非均匀间距。

nll\_coeff\_n：adpf 噪声方差曲线 x 轴点对应 y 轴值。

SigmaGreen：Gr 和 Gb 通道去噪半径，代码已固定为 4，无需改变此参数。

SigmaRedBlue：r和 b 通道去噪半径，可选两种，1 种为 4，1 种为 3。

Gradient 、Offset：与曝光 gain值相关的计算去噪力度的参数。

公式：fStrength = sqrtf( fGradient \* fSensorGain ) + fOffset;

根据算法部门的研究，Gradient 可根据 IQ tuning Dpf 模块的图进行求取。

$\begin&#123;array&#125; &#123; l l l &#125; &#123; &#123; \sf G r a d i e n t &#125; &#125; & &#123; &#123; = &#125; &#125; & &#123; &#123; \left( 3 5 5 ^ &#123; * &#125; 3 . 9 ^ &#123; * &#125; 3 / 2 5 5 / 3 2 \right) ^ &#123; 2 &#125; = 0 . 2 5 &#125; &#125; \end&#123;array&#125;$ ，式中除 3 和 355 为变量外，其余为固定值。

NlGains：代表顺序为 R、GR、GB、B通道其他模块 gain值影响。一般保持 1 不变。

##### 3.2.11.2 FilterSetting


| 适用 ISP 版本 | 适用软件及版本 | 支持情况 |
| --- | --- | --- |
| ISP10ISP11ISP12 | camera_engine_rkisp: v2.0.0IQ magic code: 635075 | Normal mode only |

FilterSetting   

index =1   

type = cell   

size = [1 2]   

cell   

index =1   

type = struct   

size = [1 1]   

name normal   

FilterEnable [1]   

DeNoiseLevel   

+SharpeningLevel   

FilterLevelRegConf   

+Demosaic\_th\_conf   

cell   

index = 2   

type = struct   

size = [1 1]   

name night   

FilterEnable [1]   

DeNoiseLevel   

SharpeningLevel   

FilterLevelRegConf   

+Demosaic\_th\_conf

每个模式下设置为：

FilterEnable：sharp 和 denoise 的控制是否打开。 0：关闭，1：打开。

### DeNoiseLevel：

&lt;DeNoiseLevel index="1" type="struct" size="[1 2]"&gt;   

&lt;gains index="1" type="double" size="[1 6]"&gt;[1 1.1 6 8 10 12]&lt;/gains&gt;   

&lt;dlevel index="1" type="double" size="[1 6]"&gt;[0 11 1 1 1]&lt;/dlevel&gt;   

&lt;/DeNoiseLevel&gt;

Gains：曝光 gain等级，去噪跟随曝光 gain 值进行变化。

Dlevel：去噪力度等级设置。取值范围[0,10]。

不同 gain之间， $\mathsf &#123; g &#125; &lt; ( \mathsf &#123; g &#125; 1 + \mathsf &#123; g &#125; 2 ) / 2$ , 采用 g1 对应的去噪等级。

g&gt;(g1+g2)/2, 采用 g2 对应的去噪等级。

### SharpeningLevel：

&lt;SharpeningLevel index="1" type="struct" size="[1 2]"&gt;   

&lt;gains index="1" type="double" size="[1 6]"&gt;[1 1.1 6 8 10 12]&lt;/gains&gt;   

&lt;slevel index="1" type="double" size="[1 6]"&gt;[3 2 2 2 2 2]&lt;/slevel&gt;   

&lt;/SharpeningLevel&gt;

Slevel：锐化力度等级设置。取值范围[0,10]。

不同 gain 之间， g &lt;(g1+g2)/2, 采用 g1 对应的锐化等级。

g&gt;(g1+g2)/2, 采用 g2 对应的锐化等级。

##### 3.2.11.3 FilterLevelRegConf

配置 filter 不同等级对应寄存器设置。

此参数就是让我们可以设置不同等级对应的寄存器设置。

&lt;FilterLevelRegConf index="1" type="struct" size="[1 14]"&gt;   

&lt;FilterLevelRegConfEnable index="1"type="double" size="[1 1]"&gt;[1]&lt;/FilterLevelRegConfEnable&gt;   

&lt;FilterLevel index="1" type="double" size="[1 5]"&gt;[0 1 2 3 4]&lt;/FilterLevel&gt;   

&lt;flt\_chr\_h\_mode index="1" type="double" size="[1 5]"&gt;[0 3 3 3 3]&lt;/flt\_chr\_h\_mode&gt;   

&lt;flt\_chr\_v\_mode index="1" type="double" size="[1 5]"&gt;[1 3 3 3 3]&lt;/flt\_chr\_v\_mode&gt;   

&lt;flt\_grn\_stage1 index="1" type="double" size="[1 5]"&gt;[7 66 5 5]&lt;/flt\_grn\_stage1&gt;   

&lt;flt\_thresh\_bl0 index="1" type="double" size="[1 5]"&gt;[0 0 8 13 23]&lt;/flt\_thresh\_bl0&gt;   

&lt;flt\_thresh\_bl1 index="1"type="double" size="[1 5]"&gt;[0 0 2 5 10]&lt;/flt\_thresh\_bl1&gt;   

&lt;flt\_fac\_bl0 index="1" type="double" size="[1 5]"&gt;[0 0 2 4 6]&lt;/flt\_fac\_bl0&gt;   

&lt;flt\_fac\_bl1 index="1" type="double" size="[1 5]"&gt;[0 0 0 0 2]&lt;/flt\_fac\_bl1&gt;   

&lt;flt\_thresh\_sh0 index="1" type="double" size="[1 5]"&gt;[0 20 20 20 20]&lt;/flt\_thresh\_sh0&gt;   

&lt;flt\_thresh\_sh1 index="1"type="double" size="[1 5]"&gt;[0 80 80 80 80]&lt;/flt\_thresh\_sh1&gt;   

&lt;flt\_fac\_sh0 index="1" type="double" size="[1 5]"&gt;[8 8 10 16 15]&lt;/flt\_fac\_sh0&gt;   

&lt;flt\_fac\_sh1 index="1" type="double" size="[1 5]"&gt;[10 10 13 32 15]&lt;/flt\_fac\_sh1&gt;   

&lt;flt\_fac\_mid index="1" type="double" size="[1 5]"&gt;[4 4 4 15 8]&lt;/flt\_fac\_mid&gt;   

&lt;/FilterLevelRegConf&gt;

### FilterLevelRegConfEnable：

是否改变原有等级内部寄存器设置，0：不改变，1：改变并采用下面设置。

### FilterLevel：

需要改变的默认等级配置。如上图，会改变 01234 对应等级的内部原本设置的寄存器值。

等级取值范围[010]。

flt\_grn\_stage1：G 通道低通滤波去噪模板等级，取值范围[0 8]。


| Filter 1 select | Filter matrix | Comment / use case |  |
| --- | --- | --- | --- |
| 0 | 686 888 | 686 | Max blur filter for very noisy input data or pre filter for down scaling |
| 1 | 585 8 12 8 | 585 | blur filter for noisy input data |
| 2 | 484 8 16 8 | 484 | Maximum line noise rejection (like separate vertical + horizontal filter with [1 2 1]/4 mask) |
| 3 | 565 6 20 6 | 565 | Maximum line noise rejection with balanced symmetry |
| 4 | 46 6 24 4 6 | 464 | Optimum compromise between noise rejection and sharpening |
| 5 | 353 5 32 5 | 353 | Weak low pass for sharpening |
| 6 | 343 4 36 4 | 343 | Weak low pass for sharpening |
| 7 | 232 3 44 3 | 232 | Weakest low pass filter mask for sharpening |
| 8 | 000 0 64 0 | 000 | bypass mask enables 3x3 over all filter modes |

### FilterG 通道的高通锐化原理

锐化是以梯度和为衡量，四个阈值划分出 5 个区域，分别对每个区域的锐化强度进行配置。下图为梯度和对应阈值和区间锐化强度参数：



flt\_thresh\_bl0，flt\_thresh\_bl1，flt\_thresh\_sh0，flt\_thresh\_sh1：

梯度和分区间的阈值，这四个阈值，分割出 5 个区间，取值范围[01023]。

flt\_fac\_bl0，flt\_fac\_bl1，flt\_fac\_sh0，flt\_fac\_sh1，flt\_fac\_mid:

上面 5 个区间对应的锐化强度值，取值范围[063]。

##### 3.2.11.4 Demosaic\_th\_conf

去马赛克阈值设置

&lt;Demosaic\_th\_conf index="1" type="struct" size="[1 1]"&gt;   

&lt;gains index="1" type="double" size="[1 6]"&gt;[1 1.1 6 8 10 12]&lt;/gains&gt;   

&lt;demosaic\_th\_level index="1" type="double" size="[1 6]"&gt;[0 0 0 0 0 0]&lt;/demosaic\_th\_level&gt;   

&lt;/Demosaic\_th\_conf&gt;

Gains：随着 gain 变化，可对 demosaic 阈值进行调整。

demosaic\_th\_level：阈值调整参数，与上面 gain 一一对应。取值范围：[0 255]。

##### 3.2.11.5 Demosaic\_lp\_conf

GIC 模块。


| 适用 ISP 版本 | Demosaic_lp 硬件 | 适用软件及版本 | 模块 enable |
| --- | --- | --- | --- |
| ISP10 | 无 | camera_engine_rkisp: v2.0.0IQ magic code: 635075 | 0 |
| ISP11 | 无 | 0 |  |
| ISP12 | 有 | 0/1 |  |

e Demosaic\_lp\_conf   

index =1   

type = struct   

size = [1 1]   

lp\_en [0]   

rb\_filter\_en [1]   

由hp\_filter\_en [ü]   

use\_old\_lp [0]   

lu\_divided [240 200 140 80]   

gainsArray [1 2 46816]   

thH\_dividedo [20 20 28 28 39 45]   

thH\_divided1 [16 16 22 22 31 31]   

thH\_divided2 [10 10 14 14 20 25]   

thH\_divided3 [9 9 11 11 15 22]   

thH\_divided4 [6 6 7 7 10 15]   

thCSC\_divided0 [25 25 45 45 48 48]   

thCSC\_divided1 [20 20 30 30 36 36]   

thCSC\_divided2 [18 18 20 20 29 29]   

thCSC\_divided3 [15 15 15 15 14 20]   

thCSC\_divided4 [8 8 8 8 12 15]   

diff\_dividedo [40 40 56 56 78 78]   

diff\_divided1 [28 28 39 39 55 55]   

diff\_divided2 [18 18 25 25 35 48]   

diff\_divided3 [14 14 20 20 28 43]   

diff\_divided4 [8 8 11 11 15 20]   

varTh\_dividedo [300 300 300 300 500 700]   

varTh\_divided1 [100 100 100 100 200 400]   

varTh\_divided2 [80 80 80 80 160 300]   

varTh\_divided3 [50 50 70 70 120 250]   

varTh\_divided4 [30 30 40 40 70 110]   

thgrad\_r\_fct [24 24 24 24 24 24]   

thdiff\_r\_fct [24 24 24 24 24 24]   

ethvar\_r\_fct [24 24 24 24 24 24]   

thgrad\_b\_fct [24 24 24 24 24 24]   

由thdiff\_b\_fct [24 24 24 24 24 24]   

thvar\_b\_fct [24 24 24 24 24 24]   

similarity\_th [776655]

th\_var\_en [1] th\_csc\_en [1] th\_diff\_en [1] th\_grad\_en [1] th\_grad [13 13 13 13 13 13] th\_diff [15 15 15 15 15 15] th\_csc [1818 18 18 18 18] th\_var [12 12 12 12 12 12] flat\_level\_sel [655443] pattern\_level\_sel [876544] edge\_level\_sel [876654]

### Demosaic LP 算法说明：

### 区域划分 lp 算法说明

If ( h\_v\_max\_grad &lt;thH & count&gt;= sw\_similarity\_th & diff\_avg &lt;thCSC & var&lt; varTH )

当前点处于平坦区，强滤波；滤波强度可以配置。

```
else if ( h_v_max_grad >= sw_th_grad | count < sw_similarity_th | diff_avg >= sw_th_csc | var> sw_th_var )
```

当前点处于边缘区，默认不滤波；滤波强度可以配置。

### else

当前点处于纹理区，弱滤波；滤波强度可配置。

### 其中:

h\_v\_max\_grad：梯度；thH：平坦区 grad 阈值；sw\_th\_grad：边缘区 grad 阈值。

count ：3\*3 相似点个数；sw\_similarity\_th：平坦区和边缘区相似点个数阈值。

diff\_avg：gb-gr 差异；thCSC：平坦区 diff 阈值；sw\_th\_csc：边缘区 diff 阈值。

Var：方差； varTH：平坦区 var 阈值；sw\_th\_var：边缘区 var 阈值。

### Demosaic LP 参数说明：

lp\_en：lp 模块开关，0：关闭，1：开启。

rb\_filter\_en：rk demosaic 算法开启，rb 通道 filter 是否开启，0：关闭，1：开启。

hp\_filter\_en：rk 算法锐化是否开启，0：关闭，1：开启。

use\_old\_lp：是否使用 img 的 lp 算法。0:关闭，1：开启。

### 平坦区阈值条件：

lu\_divided：亮度 0-255 分区。共 4 个点，分成 5 个区间。不同亮度，控制不同阈值。

gainsArray：不同 gain 下，控制不同的阈值。

### thH\_divided0，thH\_divided1，thH\_divided2，thH\_divided3，thH\_divided4：

5 个亮度区间在不同 gain下的 thH 阈值控制。

后缀 01234 为对应 5 个亮度区间阈值控制。

thH\_dividedx 为每个亮度区间对应上面 gain array 中不同 gain 值时，设置 g 通道对应不同 thH阈值，取值范围[0-255]。

### thCSC\_divided0，thCSC\_divided1，thCSC\_divided2，thCSC\_divided3，thCSC\_divided4：

5 个亮度区间在不同 gain 下的 thcsc 阈值控制。后缀 01234 为对应 5 个亮度区间阈值控制。

thCSC\_dividedx 为每个亮度区间对应上面 gain array 中不同 gain 值时，设置 g 通道对应不同thCSC 阈值，取值范围[0-255]。

diff\_divided0，diff\_divided1，diff\_divided2，diff\_divided3，diff\_divided4：

5 个亮度区间在不同 gain下的 diff阈值控制。

后缀 01234 为对应 5 个亮度区间阈值控制。

diff\_dividedx 为每个亮度区间对应上面 gain array 中不同 gain 值时，设置 g 通道对应不同 diff阈值，取值范围[0-255]。

varTh\_divided0，varTh\_divided1，varTh\_divided2，varTh\_divided3，varTh\_divided4：

5 个亮度区间在不同 gain下的 var阈值控制。后缀 01234 为对应 5 个亮度区间阈值控制。

varTh\_dividedx 为每个亮度区间对应上面 gain array 中不同 gain 值时，设置 g 通道对应不同varTh 阈值，取值范围[0-65535]。

### thgrad\_r\_fct：

gr 通道基于 g 通道 grad 阈值进行倍数调整，取值范围[0-127]，默认值 0x18 为 1x 倍数。

此值可跟随 gainsArray 的 gain 的变化而变化。

### thdiff\_r\_fct：

gr通道基于 g 通道 diff阈值进行倍数调整，取值范围[0-127]，默认值 0x18 为 1x 倍数。

此值可跟随 gainsArray 的 gain 的变化而变化。

### thvar\_r\_fct：

gr通道基于 g 通道 var阈值进行倍数调整，取值范围[0-127]，默认值 0x18 为 1x 倍数。

此值可跟随 gainsArray 的 gain 的变化而变化。

### thgrad\_b\_fct：

gb 通道基于 g 通道 grad阈值进行倍数调整，取值范围[0-127]，默认值 0x18 为 1x 倍数。

此值可跟随 gainsArray 的 gain 的变化而变化。

### thdiff\_b\_fct：

gb 通道基于 g 通道 diff阈值进行倍数调整，取值范围[0-127]，默认值 0x18 为 1x 倍数。  

此值可跟随 gainsArray 的 gain 的变化而变化。

### thdiff\_b\_fct：

gb 通道基于 g 通道 var 阈值进行倍数调整，取值范围[0-127]，默认值 0x18 为 1x 倍数。

此值可跟随 gainsArray 的 gain 的变化而变化。

similarity\_th：算法判断相似点个数阈值，取值范围[0-8]。

此值可跟随 gainsArray 的 gain 的变化而变化。

### 边缘区阈值条件：

th\_grad：边缘区 grad 阈值设定，取值范围[0-255]，跟随 gainsArray 的 gain 的变化而变化。

th\_diff：边缘区 diff 阈值设定，取值范围[0-255]，跟随 gainsArray 的 gain 的变化而变化。

th\_csc：边缘区 csc 阈值设定，取值范围[0-255]，跟随 gainsArray 的 gain 的变化而变化。

th\_var：边缘区 var 阈值设定，取值范围[0-65535]，跟随 gainsArray 的 gain 的变化而变化。

### 其他寄存器参数说明：

th\_grad\_en：算法 grad 条件是否使能，0：不使能，1：使能。

flat\_level\_sel：平坦区模板选择，模板参考上面 filter 的模板，取值范围[0-8]，跟随 gainsArray的 gain 的变化而变化。

pattern\_level\_sel：纹理区模板选择，模板参考上面 filter 的模板，取值范围[0-8]，跟随gainsArray 的 gain 的变化而变化。

edge\_level\_sel：边缘区模板选择，模板参考上面 filter 的模板，取值范围[0-8]，跟随 gainsArray的 gain 的变化而变化。

##### 3.2.11.6 MFD&UVNR


|  |  |  |
| --- | --- | --- |
|  |  |  |

&lt;MFD\_Support index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/MFD\_Support&gt;   

&lt;MFD\_Gain index="1" type="double" size="[1 3]"&gt;   

[2 4 6]   

&lt;/MFD\_Gain&gt;   

&lt;MFD\_Frames index="1" type="double" size="[1 3]"&gt;   

[2 4 6]   

&lt;/MFD\_Frames&gt;   

&lt;UVNR\_Support index="1" type="double" size="[1 1]"&gt;   

[0]   

&lt;/UVNR\_Support&gt;   

&lt;UVNR\_Gain index="1" type="double" size="[1 3]"&gt;   

[2 48]   

&lt;/UVNR\_Gain&gt;   

&lt;UVNR\_Ratio index="1" type="double" size="[1 3]"&gt;   

[2 4 6]   

&lt;/UVNR\_Ratio&gt;   

&lt;UVNR\_Distance index="1" type="double" size="[1 3]"&gt;   

[2 4 6]   

&lt;/UVNR\_Distance&gt;

MFD\_Gain：不同 gain 下，控制使用不同的叠加去噪帧数。

MFD\_Frames：对应上面不同 gain，使用不同的叠加去噪帧数。

UVNR\_Support：是否使能 uv双边滤波，0：不使能，1：使能。

UVNR\_Gain：不同 gain 下，控制使用不同的双边滤波半径和像素相似性的阈值。

UVNR\_Ratio：对应上面不同 gain，使用不同的双边去噪半径。没有上限，推荐[0-20]。

UVNR\_Distance：对应上面不同 gain，使用不同的像素相似性阈值，主要关系到图像边缘区域。没有上限，推荐[0-10]。

##### 3.2.11.7 DSP\_3DNR\_Setting

第一版 3DNR功能对应参数配置。


|  |  |  |
| --- | --- | --- |
|  |  |  |

DSP\_3DNR\_Setting   

index = 1   

type = cell   

size = [1 2]   

cell   

index = 1   

type = struct   

a=   

name normal   

Enable [1]   

gain\_level [12 4 816]   

noise\_coef\_numerator [1 1 111]   

noise\_coef\_denominator [2 2 2 2 2]   

Level\_Setting   

Luma\_Setting   

Chrm\_Setting   

Shp\_Setting   

cell   

index = 2   

type = struct   

a8ri-.   

name night   

由Enabie []   

gain\_level [1 24 8 16]   

noise\_coef\_numerator [11 111]   

noise\_coef\_denominator [2 2 2 2 2]   

Level\_Setting   

Luma\_Setting   

Chrm\_Setting   

Shp\_Setting

name：模式。目前只支持 2 种，normal 和 night 模式。

Enable：是否打开 3dnr 功能。

gain\_level：3dnr 参数会随着 gain 值变化而变化。

noise\_coef\_numerator：3dnr 噪声估计值调整参数，调整值中分子部分。

noise\_coef\_denominator：3dnr 噪声估计值调整参数，调整值中分母部分。

3dnr会对当前噪声进行估计，调整参数，是对此估计值进行乘以上面系数。

Level\_Setting：不同等级 3dnr 设置

&lt;/Luma\_Setting&gt; &lt;/Luma\_Setting&gt;

&lt;Level\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;luma\_sp\_nr\_en index="1" type="unsigned char" size="[1 1]"&gt;[1]&lt;/luma\_sp\_nr\_en&gt;   

&lt;luma\_sp\_nr\_level index="1" type="unsigned char" size="[1 5]"&gt;[3 6 9 12 16]&lt;/luma\_sp\_nr\_level&gt;   

&lt;luma\_te\_nr\_en index="1" type="unsigned char" size="[1 1]"&gt;[1]&lt;/luma\_te\_nr\_en&gt;   

&lt;luma\_te\_nr\_level index="1" type="unsigned char" size="[1 5]"&gt;[8 8 12 12 16]&lt;/luma\_te\_nr\_level&gt;   

&lt;chrm\_sp\_nr\_en index="1"type="unsigned char" size="[1 1]"&gt;[1]&lt;/chrm\_sp\_nr\_en&gt;   

&lt;chrm\_sp\_nr\_level index="1" type="unsigned char" size="[1 5]"&gt;[16 16 16 16 16]&lt;/chrm\_sp\_nr\_level&gt;   

&lt;chrm\_te\_nr\_en index="1" type="unsigned char" size="[1 1]"&gt;[1]&lt;/chrm\_te\_nr\_en&gt;   

&lt;chrm\_te\_nr\_level index="1" type="unsigned char" size="[1 5]"&gt;[16 16 16 16 16]&lt;/chrm\_te\_nr\_level&gt;   

&lt;shp\_en index="1" type="unsigned char" size="[1 1]"&gt;[1]&lt;/shp\_en&gt;   

&lt;shp\_level index="1" type="unsigned char" size="[1 5]"&gt;[16 16 16 16 16]&lt;/shp\_level&gt;   

&lt;/Level\_Setting&gt;

luma\_sp\_nr\_en：空间域亮度去噪功能是否打开，0：关闭， 1：打开

luma\_sp\_nr\_level：空间域亮度去噪配置不同 gain下采用去噪力度等级。

luma\_te\_nr\_en：te 亮度去噪功能是否打开，0：关闭， 1：打开

luma\_te\_nr\_level：te 亮度去噪配置不同 gain 下采用去噪力度等级。

chrm\_sp\_nr\_en：sp 色度去噪功能是否打开，0：关闭， 1：打开

chrm\_sp\_nr\_level：sp 色度去噪配置不同 gain 下采用去噪力度等级。

chrm\_te\_nr\_en：te 色度去噪功能是否打开，0：关闭， 1：打开

chrm\_te\_nr\_level：te 色度去噪配置不同 gain 下采用去噪力度等级。

shp\_en：亮度锐化功能是否打开，0：关闭， 1：打开

shp\_level： 亮度锐化配置不同 gain下采用锐化力度等级。

Luma\_Setting：3dnr 亮度去噪配置 Luma\_Setting：3dnr 亮度去噪配置

&lt;Luma\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;luma\_default index="1" type="unsigned char" size="[1 1]"&gt;[1]&lt;/luma\_default&gt;   

&lt;luma\_sp\_rad index="1" type="unsigned char" size="[1 5]"&gt;[3 3 3 3 3]&lt;/luma\_sp\_rad&gt;   

&lt;luma\_te\_max\_bi\_num index="1" type="unsigned char" size="[1 5]"&gt;[0 0 0 0 0]&lt;/luma\_te\_max\_bi\_num&gt;   

&lt;luma\_w00 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/luma\_w00&gt;   

&lt;luma\_w01 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w01&gt;   

&lt;luma\_w02 index="1" type="unsigned char" size="[1 5]"&gt; [12 12 12 12 12] &lt;/luma\_w02&gt;   

&lt;luma\_w03 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w03&gt;   

&lt;luma\_w04 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/luma\_w04&gt;   

&lt;luma\_w10 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w10&gt;   

&lt;luma\_w11 index="1" type="unsigned char" size="[1 5]"&gt; [30 30 30 30 30] &lt;/luma\_w11&gt;   

&lt;luma\_w12 index="1" type="unsigned char" size="[1 5]"&gt; [48 48 48 48 48] &lt;/luma\_w12&gt;   

&lt;luma\_w13 index="1" type="unsigned char" size="[1 5]"&gt; [30 30 30 30 30] &lt;/luma\_w13&gt;   

&lt;luma\_w14 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 66 6] &lt;/luma\_w14&gt;   

&lt;luma\_w20 index="1" type="unsigned char" size="[1 5]"&gt; [12 12 12 12 12] &lt;/luma\_w20&gt;   

&lt;luma\_w21 index="1" type="unsigned char" size="[1 5]"&gt; [48 48 48 48 48] &lt;/luma\_w21&gt;   

&lt;luma\_w22 index="1" type="unsigned char" size="[1 5]"&gt; [96 96 96 96 96] &lt;/luma\_w22&gt;   

&lt;luma\_w23 index="1" type="unsigned char" size="[1 5]"&gt; [48 48 48 48 48] &lt;/luma\_w23&gt;   

&lt;luma\_w24 index="1" type="unsigned char" size="[1 5]"&gt; [12 12 12 12 12] &lt;/luma\_w24&gt;   

&lt;luma\_w30 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w30&gt;   

&lt;luma\_w31 index="1" type="unsigned char" size="[1 5]"&gt; [30 30 30 30 30] &lt;/luma\_w31&gt;   

&lt;luma\_w32 index="1" type="unsigned char" size="[1 5]"&gt; [48 48 48 48 48] &lt;/luma\_w32&gt;   

&lt;luma\_w33 index="1" type="unsigned char" size="[1 5]"&gt; [30 30 30 30 30] &lt;/luma\_w33&gt;   

&lt;luma\_w34 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w34&gt;   

&lt;luma\_w40 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/luma\_w40&gt;   

&lt;luma\_w41 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w41&gt;   

&lt;luma\_w42 index="1" type="unsigned char" size="[1 5]"&gt; [12 12 12 12 12] &lt;/luma\_w42&gt;   

&lt;luma\_w43 index="1" type="unsigned char" size="[1 5]"&gt; [6 6 6 6 6] &lt;/luma\_w43&gt;   

&lt;luma\_w44 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/luma\_w44&gt;

luma\_default：1：采用代码默认配置， 0：采用底下参数配置。

luma\_sp\_rad：亮度 Y通道对应空间双边滤波器模板大小。

luma\_te\_max\_bi\_num：暂时未用。

luma\_w00 - luma\_w44：随着 gain 不同，配置亮度去噪 5x5 模板权重。

最中心一行权重为 8bit 取值范围，其余权重取值范围为 6bit，不带符号位。

Chrm\_Setting：3dnr 色度去噪配置   

&lt;Chrm\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;chrm\_default index="1" type="unsigned char" size="[1 1]"&gt;[1]&lt;/chrm\_default&gt;   

&lt;chrm\_sp\_rad index="1" type="unsigned char" size="[1 5]"&gt;[3 3 3 3 3]&lt;/chrm\_sp\_rad&gt;   

&lt;chrm\_te\_max\_bi\_num index="1" type="unsigned char" size="[1 5]"&gt;[0 0 0 0 0]&lt;/chrm\_te\_max\_bi\_num&gt;   

&lt;chrm\_w00 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/chrm\_w00&gt;   

&lt;chrm\_w01 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w01&gt;   

&lt;chrm\_w02 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w02&gt;   

&lt;chrm\_w03 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w03&gt;   

&lt;chrm\_w04 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/chrm\_w04&gt;   

&lt;chrm\_w10 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w10&gt;   

&lt;chrm\_w11 index="1" type="unsigned char" size="[1 5]"&gt;[18 1818 18 18] &lt;/chrm\_w11&gt;   

&lt;chrm\_w12 index="1" type="unsigned char" size="[1 5]"&gt; [25 25 25 25 25] &lt;/chrm\_w12&gt;   

&lt;chrm\_w13 index="1" type="unsigned char" size="[1 5]"&gt; [18 1818 18 18] &lt;/chrm\_w13&gt;   

&lt;chrm\_w14 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w14&gt;   

&lt;chrm\_w20 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w20&gt;   

&lt;chrm\_w21 index="1" type="unsigned char" size="[1 5]"&gt; [25 25 25 25 25] &lt;/chrm\_w21&gt;   

&lt;chrm\_w22 index="1" type="unsigned char" size="[1 5]"&gt; [80 80 80 80 80] &lt;/chrm\_w22&gt;   

&lt;chrm\_w23 index="1" type="unsigned char" size="[1 5]"&gt; [25 25 25 25 25] &lt;/chrm\_w23&gt;   

&lt;chrm\_w24 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w24&gt;   

&lt;chrm\_w30 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w30&gt;   

&lt;chrm\_w31 index="1" type="unsigned char" size="[1 5]"&gt; [18 18 18 18 18] &lt;/chrm\_w31&gt;   

&lt;chrm\_w32 index="1" type="unsigned char" size="[1 5]"&gt; [25 25 25 25 25] &lt;/chrm\_w32&gt;   

&lt;chrm\_w33 index="1" type="unsigned char" size="[1 5]"&gt;[18 1818 18 18] &lt;/chrm\_w33&gt;   

&lt;chrm\_w34 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w34&gt;   

&lt;chrm\_w40 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/chrm\_w40&gt;   

&lt;chrm\_w41 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w41&gt;   

&lt;chrm\_w42 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w42&gt;   

&lt;chrm\_w43 index="1" type="unsigned char" size="[1 5]"&gt; [5 5 5 5 5] &lt;/chrm\_w43&gt;   

&lt;chrm\_w44 index="1" type="unsigned char" size="[1 5]"&gt; [2 2 2 2 2] &lt;/chrm\_w44&gt;   

&lt;/Chrm\_Setting&gt;

chrm\_default：1：采用代码默认配置， 0：采用底下参数配置。

chrm\_sp\_rad：色度 cr cb 通道对应的空间双边滤波器模板大小。

chrm\_te\_max\_bi\_num：暂时未用。

chrm\_w00 ——chrm\_w44：随着 gain 不同，配置色度去噪 5x5 模板权重。

最中心一行权重为 8bit 取值范围，其余权重取值范围为 6bit，不带符号位。

### Shp\_Setting：3dnr 中亮度锐化参数配置

&lt;Shp\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;shp default index="1" type="unsigned char" size="[1 11"&gt;[1]&lt;/shp default&gt;   

&lt;src\_shp\_thr index="1" type="double" size="[1 5]"&gt;[15 15 1515 15]&lt;/src\_shp\_thr&gt;   

&lt;src\_shp\_div index="1" type="double" size="[1 5]"&gt;[5 5 5 5 5]&lt;/src\_shp\_div&gt;   

&lt;src\_shp\_lindex="1" type="double" size="[1 5]"&gt;[1 1 1 1 1]&lt;/src\_shp\_i&gt;   

&lt;src\_shp\_c index="1" type="double" size="[1 5]"&gt;[0 0 0 0 0]&lt;/src\_shp\_c&gt;   

&lt;src\_shp\_w00 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w00&gt;   

&lt;src\_shp\_w01 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w01&gt;   

&lt;src\_shp\_w02 index="1" type="double" size="[1 5]"&gt;[-2 -2 -2 -2-2]&lt;/src\_shp\_w02&gt;   

&lt;src\_shp\_w03 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w03&gt;   

&lt;src\_shp\_w04 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w04&gt;   

&lt;src\_shp\_w10 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w10&gt;   

&lt;src\_shp\_w11 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w11&gt;   

&lt;src\_shp\_w12 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w12&gt;   

&lt;src\_shp\_w13 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w13&gt;   

&lt;src\_shp\_w14 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w14&gt;   

&lt;src\_shp\_w20 index="1" type="double" size="[1 5]"&gt;[-2 -2 -2 -2 -2] &lt;/src\_shp\_w20&gt;   

&lt;src\_shp\_w21 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w21&gt;   

&lt;src\_shp\_w22 index="1" type="double" size="[1 5]"&gt;[36 36 36 36 36]&lt;/src\_shp\_w22&gt;   

&lt;src\_shp\_w23 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w23&gt;   

&lt;src\_shp\_w24 index="1" type="double" size="[1 5]"&gt;[-2 -2 -2 -2 -2] &lt;/src\_shp\_w24&gt;   

&lt;src\_shp\_w30 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w30&gt;   

&lt;src\_shp\_w31 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w31&gt;   

&lt;src\_shp\_w32 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w32&gt;   

&lt;src\_shp\_w33 index="1" type="double" size="[1 5]"&gt;[2 2 2 2 2] &lt;/src\_shp\_w33&gt;   

&lt;src\_shp\_w34 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1-1 -1]&lt;/src\_shp\_w34&gt;   

&lt;src\_shp\_w40 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w40&gt;   

&lt;src\_shp\_w41 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w41&gt;   

&lt;src\_shp\_w42 index="1" type="double" size="[1 5]"&gt;[-2 -2 -2 -2 -2]&lt;/src\_shp\_w42&gt;   

&lt;src\_shp\_w43 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w43&gt;   

&lt;src\_shp\_w44 index="1" type="double" size="[1 5]"&gt;[-1 -1 -1 -1 -1]&lt;/src\_shp\_w44&gt;   

&lt;/Shp\_Setting&gt;

shp\_default：1：采用代码默认配置， 0：采用底下参数配置。

src\_shp\_thr：锐化阈值，取值范围从[0 31]。

src\_shp\_div：权重位移位数，取值范围[0 7]。

src\_shp\_l: 亮度 y 通道锐化使能标志位 0：不使能 1：使能。

src\_shp\_c: 色度 crcb 通道锐化使能标志位 0：不使能 1：使能。

src\_shp \_w00 ——src\_shp \_w44：随着 gain 不同，配置亮度锐化 5x5 模板权重。

最中心一行权重为 8bit 取值范围，其余权重取值范围为 6bit，带符号位。

##### 3.2.11.8 NEW\_DSP\_3DNR\_Setting

NEW\_DSP\_3DNR\_Setting 是第二版 3dnr 对应的参数设置地方。


|  |  |  |
| --- | --- | --- |
|  |  |  |

&lt;NEW\_DSP\_3DNR\_Setting index="1" type="cell" size="[1 1]"&gt;   

&lt;cell index="1" type="struct" size="[1 1]"&gt;   

&lt;name index="1" type="char" size="[1 6]"&gt;normal&lt;/name&gt;   

&lt;Enable index="1" type="double" size="[1 1]"&gt;[0]&lt;/Enable&gt;   

&lt;dpc\_enable index="1" type="double" size="[1 1]"&gt;[1]&lt;/dpc\_enable&gt;   

&lt;gain\_level index="1" type="double" size="[1 5]"&gt;[1 2 4 816]&lt;/gain\_level&gt;   

&lt;ynr\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;ynr\_enable index="1" type="double" size="[1 1]"&gt;[1]&lt;/ynr\_enable&gt;   

&lt;tnr\_enable index="1" type="double" size="[1 1]"&gt;[1]&lt;/tnr\_enable&gt;   

&lt;iir\_enable index="1" type="double" size="[1 1]"&gt;[1]&lt;/iir\_enable&gt;   

&lt;ynr\_level index="1" type="double" size="[1 5]"&gt;[1 2 3 4 5]&lt;/ynr\_level&gt;   

&lt;/ynr\_Setting&gt;   

&lt;uvnr\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;uvnr\_enable index="1"type="double" size="[1 1]"&gt;[1]&lt;/uvnr\_enable&gt;   

&lt;uvnr\_level index="1" type="double" size="[1 5]"&gt;[4 6 8 10 12]&lt;/uvnr\_level&gt;   

&lt;/uvnr\_Setting&gt;   

&lt;sharp\_Setting index="1" type="struct" size="[1 1]"&gt;   

&lt;sharp\_enable index="1" type="double" size="[1 1]"&gt;[1]&lt;/sharp\_enable&gt;   

&lt;sharp\_level index="1" type="double" size="[1 5]"&gt;[0 1 2 3 4]&lt;/sharp\_level&gt;   

&lt;/sharp\_Setting&gt;   

&lt;/cell&gt;

Name：模式名称 现在支持白天(normal)和夜晚(night)两个模式.

Enable：3dnr 整个模块开关。0：关闭，1：打开

dpc\_enable：3dnr 中去坏点模块，一些色彩经过 3dnr可能变成坏点。0：关闭，1：打开。gain\_level：3ndr 的力度随着 gain 值变化而变化。这个是不同 gain 下，对应下面不同设置ynr\_Setting：3dnr 针对亮度去噪的设置。

iir\_enable: 亮度噪声某个去噪功能使能参数，0:关闭，1：打开，默认值 0。

#### 3.2.12 DPCC 参数说明

DPCC 模块全称：Defect Pixel Cluster Correction。

DPCC 去坏点参数，此模块为设置相应寄存器为相应的值。

DPCC 模块硬件上有 V1 和 V2 两个版本，V2 版本是在 V1 基础上进行修改，包含 V1 功能，并新增一些功能。两个版本共用相同的参数，但是参数配置内容有些区别。DPCC V2 版本如果只用 V1 版本功能，需将 dpcc\_mode 寄存器第 4bit 置为 1。DPCC V2 版本如果 dpcc\_mode 第 4bit 为 0，则使用带 rk mode 条件的新 dpcc 算法。


| 适用 ISP 版本 | Dpcc 硬件版本 | 适用软件及版本 | DPCC mode bit[4] |
| --- | --- | --- | --- |
| ISP10 | V1 | camera_engine_rkisp: v2.0.0IQ magic code: 635075 | 0 |
| ISP11 | V1 | 0 |  |
| ISP12 | V2 | 0/1 |  |

下面文档先对 V1 参数进行说明，再对有修改 V2 参数进行补充。



此模块参数均为相应寄存器对应寄存器值设置。

##### 3.2.12.1 dpcc 硬件 V1 寄存器

ISP\_DPCC\_MODE:


| Bits | Name | Description |
| --- | --- | --- |
| 31:3 | --- | unused |
| 2 | STAGE1_ENABLE | 1: enable stage1 *Default0: bypass stage1 |


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

ISP\_DPCC\_OUT\_MODE:


| Bits | Name | Description |
| --- | --- | --- |
| 31:4 | --- | unused |
| 3 | STAGE1_RB_3x3 | 1: stage1 red/blue 9 pixel (3x3) output median0: stage1 red/blue 4 or 5 pixel output median *Default* |
| 2 | STAGE1_G_3x3 | 1: stage1 green 9 pixel (3x3) output median0: stage1 green 4 or 5 pixel output median *Default* |
| 1 | STAGE1_INCL_RB_CENTER | 1: stage1 include center pixel for red/blue output median2x2+1*Default* 0: stage1 do not include center pixel for red/blueoutput median 2x2 |
| 0 | STAGE1_INCL_GREEN_CENTER | 1: stage1 include center pixel for green output median2x2+1 *Default*0: stage1 do not include center pixel for green outputmedian 2x2 |

### ISP\_DPCC\_SET\_USE:


| Bits | Name | Description |
| --- | --- | --- |
| 31:4 | 一 | unused |
| 3 | STAGE1_USE_FIX_SET | 1: stage1 use hard coded methods set *Default*0: stage1 do not use hard coded methods set |


| Bits | Name | Description |
| --- | --- | --- |
| 2 | STAGE1_USE_SET_3 | 1: stage1 use methods set 30: stage1 do not use methods set 3 *Default* |
| 1 | STAGE1_USE_SET_2 | 1: stage1 use methods set 20: stage1 do not use methods set 2 *Default* |
| 0 | STAGE1_USE_SET_1 | 1: stage1 use methods set 1 *Default*0: stage1 do not use methods set 1 |

ISP\_DPCC\_METHODS\_SET1:


| Bits | Name | Description |
| --- | --- | --- |
| 31:13 |  | unused |
| 12 | RG_RED_BLUE1_ENABLE | 1: enable Rank Gradient check for red_blue *Default*0: bypass Rank Gradient check for red_blue |
| 11 | RND_RED_BLUE1_ENABLE | 1: enable Rank Neighbor Difference check for red_blue*Default*0: bypass Rank Neighbor Difference check for red_blue |
| 10 | RO_RED_BLUE1_ENABLE | 1: enable Rank Order check for red_blue *Default*0: bypass Rank Order check for red_blue |
| 9 | LC_RED_BLUE1_ENABLE | 1: enable Line check for red_blue *Default*0: bypass Line check for red_blue |
| 8 | PG_RED_BLUE1_ENABLE | 1: enable Peak Gradient check for red_blue *Default*0: bypass Peak Gradient check for red_blue |
| 7:5 | 1 | unused |
| 4 | RG_GREEN1_ENABLE | 1: enable Rank Gradient check for green *Default*0: bypass Rank Gradient check for green |
| 3 | RND_GREEN1_ENABLE | 1: enable Rank Neighbor Difference check for green *Default*0: bypass Rank Neighbor Difference check for green |
| 2 | RO_GREEN1_ENABLE | 1: enable Rank Order check for green *Default*0: bypass Rank Order check for green |
| 1 | LC_GREEN1_ENABLE | 1: enable Line check for green *Default0: bypass Line check for green |
| 0 | PG_GREEN1_ENABLE | 1: enable Peak Gradient check for green *Default*0: bypass Peak Gradient check for green |

ISP\_DPCC\_METHODS\_SET2: 同上 set1  

ISP\_DPCC\_METHODS\_SET3: 同上 set1

### SET1 对应阈值参数：

ISP\_DPCC\_LINE\_THRESH\_1：


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

ISP\_DPCC\_LINE\_MAD\_FAC\_1：


| Bits | Name | Description |
| --- | --- | --- |
| 31:14 | --- | unused |
| 13:8 | LINE_MAD_FAC_1_RB | line MAD factor for set 1 red/blue |
| 7:6 | --- | unused |
| 5:0 | LINE_MAD_FAC_1_G | line MAD factor for set 1 green |
| Note: all values are unsigned integer |  |  |

ISP\_DPCC\_PG\_FAC\_1：


| Bits | Name | Description |
| --- | --- | --- |
| 31:14 | 一 | unused |
| 13:8 | PG_FAC_1_RB | Peak gradient factor for set 1 red/blue |
| 7:6 | 一 | unused |
| 5:0 | PG_FAC_1_G | Peak gradient factor for set 1 green |
| Note: all values are unsigned integer |  |  |

ISP\_DPCC\_RND\_THRESH\_1：


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

### ISP\_DPCC\_RG\_FAC\_1：


| Bits | Name | Description |
| --- | --- | --- |
| 31:14 | 一 | unused |
| 13:8 | RG_FAC_1_RB | Rank gradient factor for set 1 red/blue |
| 7:6 | 一 | unused |
| 5:0 | RG_FAC_1_G | Rank gradient factor for set 1 green |
| Note: all values are unsigned integer |  |  |

ISP\_DPCC\_RO\_LIMITS：


| Bits | Name | Description |
| --- | --- | --- |
| 31:12 | --- | unused |
| 11:10 | RO_LIM_3_RB | Rank order limit for set 3 red/blue |
| 9:8 | RO_LIM_3_G | Rank order limit for set 3 green |
| 7:6 | RO_LIM_2_RB | Rank order limit for set 2 red/blue |
| 5:4 | RO_LIM_2_G | Rank order limit for set 2 green |
| 3:2 | RO_LIM_1_RB | Rank order limit for set 1 red/blue |
| 1:0 | RO_LIM_1_G | Rank order limit for set 1 green |
| Note: all values are unsigned integer |  |  |

ISP\_DPCC\_RND\_OFFS：


| Bits | Name | Description |
| --- | --- | --- |
| 31:12 | 一 | unused |
| 11:10 | RND_OFFS_3_RB | Rank Offset to Neighbor for set 3 red/blue |
| 9:8 | RND_OFFS_3_G | Rank Offset to Neighbor for set 3 green |


| Bits | Name | Description |
| --- | --- | --- |
| 7:6 | RND_OFFS_2_RB | Rank Offset to Neighbor for set 2 red/blue |
| 5:4 | RND_OFFS_2_G | Rank Offset to Neighbor for set 2 green |
| 3:2 | RND_OFFS_1_RB | Rank Offset to Neighbor for set 1 red/blue |
| 1:0 | RND_OFFS_1_G | Rank Offset to Neighbor for set 1 green |
| Note: all values are unsigned integer |  |  |

剩余参数为 set2 和 set3 可调参数，与 set1 相同意思，在此不再复述。

##### 3.2.12.3 dpcc 硬件 V1 推荐设置

Datasheet 中推荐 6 组参数设置，根据不同坏点数量和坏点大小进行设置，如下图：


| Case | 2. singlepixels | 3. smallclusters | 4. bigclusters |
| --- | --- | --- | --- |
| a) few defects | par1 | par2 | par3 |
| b) many defects | par4 | par5 | par6 |

isp dpcc 2900 ISP DPCC MODE


| register | par1 | par2 | par3 | par4 | par5 | par6 |
| --- | --- | --- | --- | --- | --- | --- |
| ISP DPCC MODE | 0x0005 | 0x0005 | 0x0005 | 0x0005 | 0x0005 | 0x0005 |
| ISP DPCC OUT MODE | 0x0003 | 0x0003 | 0x0003 | 0x0003 | 0x0003 | 0x0003 |
| ISP_DPCC_SET_USE | 0x0003 | 0x0003 | 0x0007 | 0x0003 | 0x000F | 0x000F |
| ISP_DPCC_METHODS_SET1 | 0x1F1F | 0x1F1F | 0x1D1D | 0x1D1D | 0x1D1D | 0x1D1D |
| ISP_DPCC_METHODS_SET2 | 0x0707 | 0x0707 | 0x0707 | 0x0707 | 0x0707 | 0x0707 |
| ISP_DPCC_METHODS_SET3 | 0x1F1F | 0x1F1F | 0x1F1F | 0x1F1F | 0x1F1F | 0x1F1F |
| ISP_DPCC_LINE_THRESH_1 | 0x0808 | 0x0808 | 0x0808 | 0x0808 | 0x0808 | 0x0808 |
| ISP DPCC_LINE_MAD FAC_1 | 0x0404 | 0x0404 | 0x0404 | 0x0404 | 0x0404 | 0x0404 |
| ISP DPCC PG FAC 1 | 0x0808 | 0x0808 | 0x0806 | 0x0806 | 0x0606 | 0x0404 |
| ISP_DPCC_RND_THRESH_1 | 0x0A0A | 0x0A0A | 0x0A0A | 0x0A0A | 0x0808 | 0x0804 |
| ISP DPCC RG FAC 1 | 0x2020 | 0x2020 | 0x2020 | 0x2020 | 0x1010 | 0x0802 |
| ISP_DPCC_LINE_THRESH_2 | 0x2018 | 0x1010 | 0x100C | 0x100C | 0x100C | 0x100C |
| ISP DPCC LINE MAD FAC 2 | 0x1810 | 0x1810 | 0x1810 | 0x1810 | 0x0808 | 0x0404 |
| ISP DPCC_PG_FAC_2 | 0x0806 | 0x0806 | 0x0806 | 0x0806 | 0x0606 | 0x0404 |
| ISP_DPCC_RND_THRESH_2 | 0x0808 | 0x0808 | 0x0808 | 0x0808 | 0x0808 | 0x0808 |
| ISP_DPCC_RG_FAC_2 | 0x0808 | 0x0808 | 0x0808 | 0x0808 | 0x0808 | 0x0808 |
| ISP_DPCC_LINE_THRESH_3 | 0x2020 | 0x2020 | 0x2020 | 0x2020 | 0x0808 | 0x0000 |
| ISP DPCC LINE MAD FAC 3 | 0x0404 | 0x0404 | 0x0404 | 0x0404 | 0x0404 | 0x0404 |
| ISP DPCC PG FAC 3 | 0x0A0A | 0x0A0A | 0x0A0A | 0x0A0A | 0x0606 | 0x0404 |
| ISP DPCC RND THRESH_ 3 | 0x0806 | 0x0806 | 0x0806 | 0x0806 | 0x0806 | 0x0804 |
| ISP_DPCC_RG_FAC_3 | 0x0404 | 0x0404 | 0x0404 | 0x0404 | 0x0404 | 0x0400 |


| ISP DPCC RO LIMITS | 0x09A5 | 0x09FA | 0x0AFA | 0x09FA | 0x0FFF | 0x0FFF |
| --- | --- | --- | --- | --- | --- | --- |
| ISP DPCC RND_OFFS | 0x0AAA | 0x0FFF | 0x0FFF | 0x0FFF | 0x0FFF | 0x0FFF |

##### 3.2.12.4 dpcc 硬件 V2 寄存器

寄存器上，DPCCV2 寄存器大部分和 V1 版本相同。新增 rkmethod 变量是在原来 V1 寄存器上空余位增加对应的变量。

如下图：


| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 31:5 | RO | 0x0 | reserved |
| 4 | RW | 0x1 | sw_mem_update_mode1&#x27;b0: select uncorreted data to update mem(rk mode)1&#x27;b1: select updated data to update mem(img mode default) |

isp dpCC 2900 ISP DPCC QUTPUT MODE


| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 31:7 | RO | 0x0 | reserved |
| 6:5 | RW | 0x0 | sw_rk_out_sel2&#x27;b00:RK method12&#x27;b01:RK method22&#x27;b10:RK method32&#x27;b11:reserved |
| 4 | RW | 0x0 | sw_dpcc_output_sel1&#x27;b0: select median mode1&#x27;b1: select rk output mode |

isp dpcc 2900 ISP DPCC METHODS SET 1


| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 31:14 | RO | 0x0 | reserved |

Copyrig6ht 2015 @FuZhou Rockchip Electranics Co., Ltd. 298

### PX30 TRM


|  |  |  | sw_rk_red_blue1_en |
| --- | --- | --- | --- |
| 13 | RW | 0×0 | 1: enable RK method check for green *Default* 0: bypass RK method check for green |


|  |  |  |  |
| --- | --- | --- | --- |
| 5 | RW | 0x0 | sw_rk_green1_en 1: enable RK method check for green *Default* |
|  |  |  | 0: bypass RK method check for green |

Address: Operational Base + offset (0x0018)

### isp dpcc 2900 ISP DPCC LINE THRESH 1


| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 31:24 | RW | 0×00 | sw_mindis1_rbmin distance for set 1 red /blue |

Copyrig6ht 2015 @FuZhou Rockchip Electranics Co., Ltd. 303

PX30 TRM


| 23:16RW |  | 0×00 | sw_mindis1_g min distance for set 1 green |
| --- | --- | --- | --- |
|  |  |  |  |

### isp\_dpcc\_2900\_ISP\_ DPCC\_LINE\_MAD\_FAC\_1

Address: Operational Base + offset (0x001c)


| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 31:30 | RO | 0x0 | reserved |
| 29:24 | RW | 0x00 | sw_dis_scale_min1 |
| 23:22 | RO | 0x0 | reserved |
| 21:16 | RW | 0x00 | sw_dis_scale_max1 |

#### 3.2.13 CPROC 参数说明

CPROC 模块全称：color process

Cproc 设置图像明度，对比度，饱和度，色调参数



目前支持 3 个模式的设置，分别为 preview, capture,video 模式Name：模式名称

Saturation：饱和度设置，取值范围[0-1.992]

Contrast：对比度设置，取值范围[0-1.992]

Brightness：明度设置，取值范围[-255 +255]

Hue: 色调设置，取值范围[-90 87.188]

#### 3.2.14 IESHARPEN 参数说明


| 适用 ISP 版本 | IESharp 硬件版本 | 适用软件及版本 | IQ参数配置 |
| --- | --- | --- | --- |
| ISP10 | V1 | camera_engine_rkisp: v2.0.0IQ magic code: 635075 | 不支持 |
| ISP11 | V1 | car | 不支持 |
| ISP12 | V2 | 支持 |  |

IESHARPEN   

index =1   

type = cell   

size = [1 2]   

cell   

index =1   

type = struct   

size = [1 1]   

name 2096x1560   

resolution 2096x1560   

IEsharpenEnable [0]   

coring\_thr [0]   

full\_range [0]   

switch\_avg [1]   

yavg\_thr [32 64 128 170]   

p\_deltal [44568]   

p\_delta2 [44568]   

+pmaxnumber [55666]   

pminnumber [11000]   

gauss\_flat\_coe [24 32 24 32 32 32 24 32 24]   

gauss\_noise\_coe [24 32 24 32 32 32 24 32 24]   

gauss\_other\_coe [8 12 8 12 176 12 8 12 8]   

gain\_dvide [4]   

l\_p\_grad [32 64 128 256]   

+I\_sharp\_factor [2 8 16 32 24]   

I\_line1\_filter\_coe [6366565]   

L\_line2\_filter\_coe [3 4 3 4 36 4 3 4 3]   

\_line3\_filter\_coe [5656366]   

l\_lap\_mat\_coe [12 12 12 12 11 12 12 12 12]   

h\_p\_grad [32 64 128 256]   

+h\_sharp\_factor [0 4 8 32 32]   

h\_line1\_filter\_coe [11 13 11 9 11 9]   

h\_line2\_filter\_coe [5 7 5 7 16 7 5 7 5]   

h\_line3\_filter\_coe [9 11 9 11 13 11]   

h\_lap\_mat\_coe [12 12 12 12 11 12 12 12 12]   

uv\_gauss\_flat\_coe [15 17 19 17 15 15 19 22 19 15 15 17 19 17 15]   

uv\_gauss\_noise\_coe [15 17 19 17 15 15 19 22 19 15 15 17 19 17 15]   

uv\_gauss\_other\_coe [3 4 5 4 33 5 202 53 3 45 4 3]  

IEsharpenEnable：IE 模块的 rk 设计锐化是否使能：0：不使能，1：使能。

coring\_thr：y 通道拉普拉斯锐化结果，如果小于此阈值，则不锐化。

full\_range：yuv 是否采用 full range, 0:不是，1：是。

switch\_avg：

中心点与周围 3x3 均值的绝对差值比较条件是否使能，0：不使能，1：使能。

### yavg\_thr：

判断中心点周围 3x3 均值，用 4 个阈值划分出 5 个区域，对每个区域采用不同参数进行锐化控制。取值范围[0-255]。

### p\_delta1：

上面所说 5 个区域中，每个区域对应中心点和周围 3x3 均值的绝对差值的阈值设定，用来判断是否是平坦区和噪声区的条件之一。取值范围[0-255]。

### p\_delta2：

上面所说 5 个区域中，每个区域周围 3x3 像素点和均值的绝对差值的阈值设定，用来判断是否是平坦区和噪声区的条件之二。取值范围[0-255]。

### Pmaxnumber：

上面所说 5 个区域中，每个区域周围 3x3 像素点与均值绝对差值小于 p\_delta2 的最少个数的阈值设定，用来判断是否是平坦区的条件之三。取值范围[0-8]。

### Pminnumber：

上面所说 5 个区域中，每个区域周围 3x3 像素点与均值绝对差值小于 p\_delta2 的最多个数的阈值设定，用来判断是否是噪声区的条件之三。取值范围[0-8]。

gauss\_flat\_coe：

平坦区 y 通道对应的 3x3 高斯滤波系数。取值范围[0-255]。

gauss\_noise\_coe：

噪声区 y 通道对应的 3x3 高斯滤波系数。取值范围[0-255]。

gauss\_other\_coe：

其他区 y 通道对应的 3x3 高斯滤波系数。取值范围[0-255]。

### gain\_dvide:

以此 gain为分界，将参数划分成 2 组，一组低 gain 对应，一组用于高 gain 下参数。

低 gain 对应滤波参数和锐化参数, 此 gain 为上面小于上面 gain\_devide.

### l\_p\_grad：

y通道 3x3 像素点进行滤波后，h 和 v 方向总梯度差作为判断，用 4 个阈值将梯度差范围划分出 5 个区域，用来控制不同的锐化系数。取值范围[0-2047]。

l\_sharp\_factor：上面 5 个梯度差区域，对应的不同的锐化系数。取值范围[0-63]。

l\_line1\_filter\_coe：

y通道 3x3 像素点进行滤波，第一行数据对应滤波系数。取值范围[0-63]。

l\_line2\_filter\_coe：

y通道 3x3 像素点进行滤波，第二行数据对应滤波系数。取值范围[0-63]。

l\_line3\_filter\_coe：

y通道 3x3 像素点进行滤波，第三行数据对应滤波系数。取值范围[0-63]。

高 gain 对应滤波参数和锐化参数，此 gain 为上面大于等于 gain\_devide.

h\_p\_grad： 同上，高 gain 对应系数。

h\_sharp\_factor：同上，高 gain 对应系数。

h\_line1\_filter\_coe：同上，高 gain 对应系数。

h\_line2\_filter\_coe：同上，高 gain 对应系数。

h\_line3\_filter\_coe：同上，高 gain 对应系数。

uv\_gauss\_flat\_coe：平坦区 uv 通道对应的 3x5 高斯滤波系数。取值范围[0-255]。

uv\_gauss\_noise\_coe：噪声区 uv 通道对应的 3x5 高斯滤波系数。取值范围[0-255]。

uv\_gauss\_other\_coe：其他区 uv 通道对应的 3x5 高斯滤波系数。取值范围[0-255]。

#### 3.2.15 OTP 参数说明



otp\_awb\_enable：awb otp 是否要打开，0：关闭，1：打开。

awb\_golden\_r\_value：golden 模组对应读出来的 otp awb 的 r 通道值。

awb\_golden\_gr\_value: golden 模组对应读出来的 otp awb 的 gr 通道值。

awb\_golden\_gb\_value: golden 模组对应读出来的 otp awb 的 gb 通道值。

awb\_golden\_b\_value: golden 模组对应读出来的 otp awb 的 b 通道值。

otp\_lsc\_enable: lsc otp 是否打开，0：关闭，1：打开。

### 3.3 system 参数说明

System 里的 afps 参数，目前软件上已按照曝光分解方式自动去变帧率了，这里保持原样即可。

白system   

a= size = [1 1]   

a= type = struct   

AFPS   

a= index = 1   

a= size = [1 1]   

a= type = struct   

aFpsDefault on
