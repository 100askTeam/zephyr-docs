---
sidebar_position: 1
---

# Rockchip Sound Event Detection开发文档

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| 全系列 | 通用 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | Huaping Liao, AbadonJiang | 2022-07-23 | 初始版本 |
| V1.0.1 | Huaping Liao, XingZheng | 2022-08-15 | 整理文档格式 |
| V1.0.2 | Huaping Liao | 2022-08-20 | 更新接口，加入蜂鸣器检测 |
| V1.1.0 | Ryne Lai | 2022-12-15 | 更新接口，加入AGC及玻璃破碎声检测 |
| V1.2.0 | Ryne Lai | 2023-01-16 | 添加初始化结果输出接口 |
| V1.3.0 | Ryne Lai | 2023-03-09 | 添加fir滤波器接口 |
| V1.4.0 | Ryne Lai | 2023-08-17 | 修改aed流程，将fir置于agc之前，添加aed平滑系数设置接口 |
| V1.5.0 | Ryne Lai | 2023-10-31 | 更新哭声检测模型，添加confirm_prob设置接口 |
| V1.5.1 | Ryne Lai | 2023-11-03 | 修改log打印的格式，完善说明文档的内容 |
| v1.6.0 | Ryne Lai, Xing Zheng | 2024-03-18 | 更新优化哭声检测的NPU模型 |

## 1. 概述

本文档主要描述声音事件检测(Sound Event Detection)功能。当前包含婴儿哭声检测(Baby Cry Detection)、异常声检测(Abnormal Event Detection)和蜂鸣器检测(Buzz Detection)。三个模块通过统一接口调用，但功能相互独立，可通过开关使能关闭其中任何模块。

## 2. 功能描述

### 2.1 Abnormal Event Detection(AED)

AED实现实时异常声检测功能，包括超大声检测和信噪比检测，支持8k和16k的音频输入。超大声检测实现对dB的检测，超过设定的dB值输出1，否则输出0。信噪比检测主要实现对噪声和信号进行检测，这里说的噪声主要是环境中的平稳噪声和录音的底噪，当信噪比大于设定阈值后输出1，否则为0。

分贝（decibel），是量度两个相同单位之数量比例的计量单位，幅值为我们声音数据大小的绝对值，分贝(dB)和幅值X的关系为：

$$

d B = 2 0 * l o g 1 0 ( X )

$$

所以幅值为倍数关系，dB为加减关系。幅值每上升一倍，dB值上升6dB。16bit的音频数据满幅值32767，此值设为0dB，所以我们这里说的dB值都在0dB以下。

信噪比(SNR)可理解为信号与噪声的比值，噪声设为0dB，信号比噪声高6dB，那么此时的信噪比为6dB。

### 2.2 AI声音事件检测Sound Event Detection(SED)

SED模块实现对婴儿哭声，蜂鸣器报警声及玻璃破碎声的实时检测，仅支持16k的音频输入。采用带有多头注意力机制的RCNN模型对约1.5s时间内的声音信息进行分析，从而实现对上述声音事件的检测，模块在信息信噪比高于6dB时有较好的效果。

#### 2.2.1 Baby Cry Detection(BCD)

BCD实现实时检测婴儿哭声的功能。通过深度学习的方式进行婴儿哭声检测，信噪比高的时候效果较好，从婴儿哭声出现开始计算，检测延迟约2s。

#### 2.2.2 Buzz Detection(BUZ)

BUZ实现实时检测蜂鸣器报警声的功能。主要检测常见的警报声，包括烟雾报警、防空报警、防盗报警等。通过深度学习的方式进行警报声检测，信噪比高的时候效果较好，从蜂鸣器报警声出现开始计算，检测延迟约2s。

#### 2.2.3 Glass broken Detection(GBS)

GBS实现实时检测玻璃破碎声的功能。通过深度学习的方式进行玻璃破碎声检测，信噪比高的时候效果较好，从玻璃破碎声出现开始计算，检测延迟约0.6s。

## 3. 相关API介绍

该功能模块为用户提供以下API:

rkaudio\_sed\_init：SED初始化。

rkaudio\_sed\_destroy：SED销毁。

rkaudio\_sed\_process：SED执行。

rkaudio\_sed\_init\_res：初始化结果。

### 3.1 rkaudio\_sed\_init

【描述】

初始化并返回SED的操作句柄，此句柄用于rkaudio\_sed\_process。使用结束后，执行rkaudio\_sed\_destroy销毁。

【语法】

void \*rkaudio\_sed\_init(int fs, int bit, int chan, RKAudioSedParam \*param)

【参数】


| 参数名 | 描述 | 输入输出 |
| --- | --- | --- |
| fs | 采样率，AED支持8k和16k，BCD、BUZ及GBS只支持16k。 | 输入 |
| bit | 每个数据的bit数，一般使用的都是16bit数据。 | 输入 |
| chan | 通道数，如果输入多通道数据，使用的是第一个通道的数据。 | 输入 |
| param | SED参数，相关定义见RKAudioSedParam。可通过函数rkaudio sed_param init构建，也可自行构建相关函数和初始化系数。 | 输入 |

【返回值】


| 返回值 | 描述 |
| --- | --- |
| NULL | 失败。 |
| 非NULL | 成功。 |

### 3.2 rkaudio\_sed\_destroy

【描述】

销毁SED句柄。

【语法】

void rkaudio\_sed\_destroy(void \*st\_)

【参数】


| 参数名 | 描述 | 输入/输出 |
| --- | --- | --- |
| st_ | rkaudio sed init返回的句柄。 | 输入 |

【返回值】

无

### 3.3 rkaudio\_sed\_init\_res

【描述】

输出SED句柄的初始化结果。

【语法】

char rkaudio\_sed\_init\_res(void\* st\_)

【参数】


| 参数名 | 描述 | 输入/输出 |
| --- | --- | --- |
| st_ | rkaudio_sed_init返回的句柄。 | 输入 |

【返回值】

返回8bit的char类型，从低位开始，第一字节表示agc的初始化结果，1表示初始化成功，0表示初始化失败；第二字节表示aed的初始化结果，1表示初始化成功，0表示初始化失败；第三字节表示sed的初始化结果，1表示初始化成功，0表示初始化失败；第四字节表示fir的初始化结果，1表示初始化成功，0表示初始化失败

### 3.4 rkaudio\_sed\_process

【描述】

进行声音事件检测，返回结果存于res中。

【语法】

int rkaudio\_sed\_process(void \*st\_, short \*in, int in\_size, RKAudioSedRes \*res)

【参数】


| 参数名 | 描述 | 输入/输出 |
| --- | --- | --- |
| st_ | 句柄。 | 输入 |
| in | 输入数据的指针。 | 输入 |
| in_size | 输入数据的长度，8k数据size应为128的倍数，16k数据size应为256的倍数。 | 输入 |
| res | 检测结果结构体指针，此结构体需在外部申请，定义参见RKAudioSedRes。 | 输出 |

【返回值】


| 返回值 | 描述 |
| --- | --- |
| 大于等于0 | 执行成功，此返回值为执行数据的长度。 |
| 小于0 | 执行失败。 |

### 3.5 rkaudio\_sed\_param\_init

【描述】

初始化SED模块参数，进行子模块使能，并调用各个子模块参数初始化函数。此函数源码对外开放，并且各参数默认值已设置，也可根据实际数据进行适当调整。使用完后，调用rkaudio\_sed\_param\_destroy销毁。如果在SED调用过程中要对参数或者模块使能进行调整，需要将SED模块销毁后，重新初始化才能生效。

【语法】

RKAudioSedParam \*rkaudio\_sed\_param\_init()

【返回值】

SED参数指针，定义参见RKAudioSedParam。

### 3.6 rkaudio\_sed\_param\_destroy

【描述】

销毁SED模块参数。

【语法】

void rkaudio\_sed\_param\_destroy(RKAudioSedParam \*param)

【参数】

SED参数指针。

### 3.7 rkaudio\_sed\_param\_aed

【描述】

初始化AED模块参数，在rkaudio\_sed\_param\_init函数中调用，在rkaudio\_sed\_param\_destroy函数中销毁。

【语法】

```cmake
SedAedParam *rkaudio_sed_param_aed()
```

【返回值】

AED模块参数指针。

### 3.8 rkaudio\_sed\_param

【描述】

初始化BCD/BUZ/GBS模块参数，在rkaudio\_sed\_param\_init函数中调用，在rkaudio\_sed\_param\_destroy函数中销毁。

【语法】

SedBuzParam \*rkaudio\_sed\_param()

【返回值】

BUZ模块参数指针。

### 3.9 rkaudio\_agc\_param\_init

【描述】

初始化AGC参数，在rkaudio\_sed\_param\_init函数中调用，在rkaudio\_sed\_param\_destroy函数中销毁。

【语法】

RKAGCParam\* rkaudio\_agc\_param\_init()

【返回值】

AGC模块参数指针。

### 3.10 rkaudio\_sed\_lsd\_db

【描述】

返回aed超大声检测的音量的db值。

【语法】

float rkaudio\_sed\_lsd\_db(void \*st\_)

【返回值】

dbfs值

### 3.11 rkaudio\_sed\_bcd\_model\_set

【描述】   

设置婴儿哭声检测的rknn路径   

【语法】   

int rkaudio\_sed\_bcd\_model\_set(char \*model\_path)

【返回值】

0表示成功，-1表示失败

## 4. 参数介绍

### 4.1 JUMP\_FRAME

【说明】

SED算法相关参数，检测间隔帧数，数值越高则每秒检测频率越低，同时计算量越低。以数值20为例，则检测间隔为0.016\*20 = 0.32s，即差不多平均一秒检测3次，建议数值：15-25。被跳过帧的检测结果会与上一帧保持一致。

【定义】

```c
#define JUMP_FRAME 20
```

### 4.2 RKAudioSedParam

【说明】

SED算法相关参数。

【定义】

```c
typedef struct RKAudioSedParam
int model_en;
RKSEDAGCParam *agc_param;
SedAedParam *aed_param;
SedParam *sed_param;
RKFIRParam *fir_param;
} RKAudioSedParam;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| model_en | 通过设置bit位开启子模块，各bit定义参见RKSedEnable，如要开启AED和BCD，则应设为EN_AED\|EN_BCD。 |
| SedAedParam | AED模块参数，定义参见SedAedParam。 |
| SedParam | SED模块参数，定义参见SedParam。 |
| RKSEDAGCParam | AGC模块参数，定义参见RKSEDAGCParam |
| RKFIRParam | FIR模块参数，定义参见RKFIRParam |

### 4.3 SedAedParam

【说明】

AED算法相关参数。

【定义】

```c
typedef struct SedAedParam
{
float snr_db;
float lsd_db;
int policy;
float smooth_param;
} SedAedParam;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| snr_db | 语音信噪比阈值，大于则输出1。 |
| lsd_db | 超大声阈值，大于则输出1。最大为0dB。 |
| policy | 信噪比检测算法灵敏度，取值范围为[0，2]，值越大越灵敏，越容易满足检测阈值。默认取1。 |
| smooth_param | 超大声音量计算平滑系数，取值范围为(0，1)，数值越大，平滑窗越大 |

### 4.4 SedParam

【说明】

BCD/BUZ/GBS算法相关参数。

【定义】

typedef struct SedParam   

```c
int frm_len;
int nclass;
int babycry_decision_len;
int buzzer_decision_len;
int glassbreaking_decision_len;
float babycry_confirm_prob;
float buzzer_confirm_prob;
float glassbreaking_confirm_prob;
} SedParam;
```

【成员】


| 成员名 称 | 描述 |
| --- | --- |
| frm_len | SED模块公共属性，表示统计的总帧数，取值范围为[60,120]，建议数值为90，越长检 测延迟越高，越低越容易漏检测或误检测。 |

| nclass | 使能SED子模块设置关注的分类的总类别数目。如仅开启哭声检测子模块，该分类值设为1。

| babycry\_decision\_len | 哭声检测确认帧长，数值应小于frm\_len，取值范围为[40,80]，建议数值为60，越长检测延迟越高，越容易漏检测；越短越容易误检测。 |

| buzzer\_decision\_len | 蜂鸣器报警声检测确认帧长，数值应小于frm\_len，建议长度100，越长检测延迟越高，越容易漏检测；越短越容易误检测。 |

| glassbreaking\_decision\_len | 玻璃破碎声检测确认帧长，数值应小于frm\_len，大于JUMP\_FRAME，建议长度25-50，越长检测延迟越高，越容易漏检测；越短越容易误检测。 |

| glassbreaking\_confirm\_prob | 玻璃破碎声检测确认概率，取值范围为(0，1)，建议取值0.8，取值越大越不容易误检，但容易漏检 |

### 4.5 RKAudioSedRes

### 【说明】

SED模块返回结果。

【定义】

```c
typedef struct RKAudioSedRes
{
int snr_res;
int lsd_res;
int bcd_res;
int buz_res;
int gbs_res;
} RKAudioSedRes;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| snr_res | SNR返回结果，1为满足信噪比阈值，0不满足。 |
| lsd_res | LSD返回结果，1为满足超大声阈值，0不满足。 |
| bcd_res | BCD返回结果，1为检测到哭声，0没检测到。 |
| buz_res | BUZ返回结果，1为检测到警报声，0没检测到。 |
| gbs_res | GBS返回结果，1为检测到玻璃破碎声，0没检测到。 |

### 4.6 RKAudioSedEnable

【说明】

使能各模块，将此值赋给model\_en，则可使能对应模块。如要使能多个模块，则使用EN\_AED | EN\_BCD方式。

【定义】

```c
typedef enum RKAudioSedEnable
{
EN_AGC = 1 << 0,
EN_AED = 1 << 1,
EN_SED = 1 << 2,
EN_FIR = 1 << 3,
} RKAudioSedEnable;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EN_AGC | 使能AGC模块，建议在接收音量较小时开启。 |
| EN_AED | 使能AED模块。 |
| EN_SED | 使能SED模块。 |
| EN_FIR | 使能FIR模块。 |

### 4.7 RKSEDAGCParam

【说明】

agc相关参数，不建议改动

定义

typedef struct RKSEDAGCParam   

```c
{
float attack_time;
float release_time;
float max_gain;

float max_peak;
float fRth0;
float fRk0;
float fRth1;
int fs;
int frmlen;
float attenuate_time;
float fRth2;
float fRk1;
float fRk2;
float fLineGainDb;
int swSmL0;
int swSmL1;
int swSmL2;
} RKSEDAGCParam;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| attack_time | 触发时间，即AGC增益下降所需要的时间 |
| release_time | 释放时间，即AGC增益上升所需要的时间 |
| max_gain | 最大增益，同时也是线性段增益，单位：dB |
| max_peak | 经AGC处理后，输出语音的最大能量，范围：单位：dB |
| fRth0 | 扩张段结束能量dB阈值，同时也是线性段开始阈值 |
| fRk0 | 扩张段斜率（未启用） |
| fRth1 | 压缩段起始能量dB阈值，同时也是线性段结束阈值 |
| fs | 数据采样率（未启用） |
| frmlen | 处理帧长（未启用） |
| attenuate_time | 噪声衰减时间，即噪声段增益衰减到1所需的时间（未启用） |
| fRth2 | 压缩段起始能量dB阈值 |
| fRk1 | 扩张段斜率（未启用） |
| fRk2 | 扩张段斜率（未启用） |
| fLineGainDb | 线性段提升dB数（未启用） |
| swSmL0 | 扩张段时域平滑点数（未启用） |
| swSmL1 | 线性段时域平滑点数（未启用） |
| swSmL2 | 压缩段时域平滑点数（未启用） |

### 4.8 RKFIRParam

【说明】

fir相关参数，不建议改动

【定义】

```c
typedef struct RKFIRParam
{
int fir_len;
float* fir_coeffs;
} RKFIRParam;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| fir_len | fir长度 |
| fir_coeffs | fir系数 |
