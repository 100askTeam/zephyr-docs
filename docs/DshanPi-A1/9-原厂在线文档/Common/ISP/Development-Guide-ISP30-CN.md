---
sidebar_position: 1
---

# Rockchip Developement Guide ISP30

## 前言

## 概述

本文旨在描述RkAiq（Rk Auto Image Quality）模块的作用，整体工作流程，及相关的API接口。主要给

使用RkAiq模块进行ISP功能开发的工程师提供帮助。

产品版本\`\`


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3588 | Linux 5.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

ISP模块软件开发工程师

系统集成软件开发工程师

### 各芯片系统支持状态


| 芯片名称 | BuildRoot | Debian | Yocto | Android |
| --- | --- | --- | --- | --- |
| RK3588 | Y | N | N | Y |

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| v0.0.1 | All | 2021-11-04 | RK3588 ISP3.0 alpha版 |
| v1.0.0 | All | 2022-1-1 | 1. AE / AWB / AF / CCM / 3DLut / Gamma / Dhz&amp;Ehz / Merge /DRC / BLC / NR / Sharp 模块更新2. 统计信息章节更新3.Demosaic / DPCC / FEC / LDCH / GIC 尚未提供 |
| v1.1.0 | ALL | 2022-01-11 | 1. 修订 系统控制 API 部分2. 增加 CSM/CPROC/IE 模块API说明3. 增加 Camera组API说明4. 增加LDCH / GIC / DPCC / Debayer 模块说明5. 更新“统计信息”章节，AE统计值结构体相关说明更新 |
| v1.2.2 | 朱林靖欧阳亚凤 | 2022-1-25 | 1.“统计信息”章节，RKAiqExpl2cParam_s结构体更新说明2.&quot;Camera组&quot;章节，RK_PS_SrcOverlapMap结构体更新说明3. NR/Sharp 章节参数勘误 |
| v1.2.3 | 徐鸿飞武强 | 2022-2-19 | 1.Debayer / DPCC 章节API 以及数据类型更新说明 |
| v1.2.4 | 翁涵梅 | 2022-3-17 | 1. CSM / CGC 章节API 以及数据类型更新说明2. CCM 章节参数勘误 |
| v1.2.5 | 翁涵梅李仁奎 | 2022-7-7 | 1.CSM/ CGC 章节API 以及数据类型更新说明2. DRC / Dehaze&amp;Enhance 章节API说明 |

```c
XCamReturn
rk_aiq_uapi2_sysctl_preInit (const char* sns_ent_name,
rk_aiq_working_mode_t mode,
const char* force_iq_file);
```

```c
XCamReturn
rk_aiq_uapi2_sysctl_preInit_scene (const char* sns_ent_name,
const char *main_scene,
const char *sub_scene);
```

```c
int
rk_aiq_uapi2_sysctl_switch_scene (const rk_aiq_sys_ctx_t* sys_ctx,
const char *main_scene,
const char *sub_scene);
```

```c
rk_aiq_sys_ctx_t*
rk_aiq_uapi2_sysctl_init (const char* sns_ent_name,
const char* iq_file_dir,
rk_aiq_error_cb err_cb,
rk_aiq_metas_cb metas_cb);
```

```c
XCamReturn
rk_aiq_uapi2_sysctl_prepare(const rk_aiq_sys_ctx_t* ctx,
uint32_t width,
uint32_t height,
rk_aiq_working_mode_t mode);
```

```c
bool
rk_aiq_uapi2_sysctl_getAxlibStatus(const rk_aiq_sys_ctx_t* ctx,
const int algo_type,
const int lib_id);
```

```c
XCamReturn
rk_aiq_uapi2_sysctl_setCpsLtCfg(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_cpsl_cfg_t* cfg);
```

```c
XCamReturn
rk_aiq_uapi2_sysctl_getCrop(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_rect_t
*rect);
```

```c
typedef enum {
RK_AIQ_WORKING_MODE_NORMAL,
RK_AIQ_WORKING_MODE_ISP_HDR2 = 0x10,
RK_AIQ_WORKING_MODE_ISP_HDR3 = 0x20,
} rk_aiq_working_mode_t;
```

```c
typedef struct {
rk_aiq_sensor_info_t sensor_info;
rk_aiq_lens_info_t lens_info;
bool has_lens_vcm;
bool has_fl;
bool fl_strth_adj_sup;
bool has_irc;
bool fl_ir_strth_adj_sup;
} rk_aiq_static_info_t;
```

```c
typedef struct {
char sensor_name[32];
rk_frame_fmt_t support_fmt[SUPPORT_FMT_MAX];
int32_t num;
/* binded pp stream media index */
int8_t binded_strm_media_idx;
} rk_aiq_sensor_info_t;
```

```c
typedef struct rk_aiq_cpsl_cfg_s {
RKAiqOPMode_t mode;
rk_aiq_cpsls_t lght_src;
bool gray_on; /*!< force to gray if light on */
union {
struct {
float sensitivity; /*!< Range [0-100] */
uint32_t sw_interval; /*!< switch interval time, unit seconds */
} a; /*< auto mode */
struct {
uint8_t on; /*!< disable 0, enable 1 */
float strength_led; /*!< Range [0-100] */
float strength_ir; /*!< Range [0-100] */
} m; /*!< manual mode */
} u;
} rk_aiq_cpsl_cfg_t;
```

```c
typedef struct rk_aiq_cpsl_info_s {
int32_t mode;
uint8_t on;
bool gray;
float strength_led;
float strength_ir;
float sensitivity;
uint32_t sw_interval;
int32_t lght_src;
} rk_aiq_cpsl_info_t;
```

```c
typedef struct rk_aiq_cpsl_cap_s {
int32_t supported_modes[RK_AIQ_OP_MODE_MAX];
uint8_t modes_num;
int32_t supported_lght_src[RK_AIQ_CPSLS_MAX];
uint8_t lght_src_num;
rk_aiq_range_t strength_led;
rk_aiq_range_t sensitivity;
rk_aiq_range_t strength_ir;
} rk_aiq_cpsl_cap_t;
```

```c
typedef struct rk_aiq_rect_s {
int left;
int top;
int width;
int height;
} rk_aiq_rect_t;
```

```c
XCamReturn
rk_aiq_uapi2_camgroup_getOverlapMap_from_file (const char* map_file,
struct
RK_PS_SrcOverlapMap** overlapMap);
```

```c
rk_aiq_sys_ctx_t*
rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm (rk_aiq_camgroup_ctx_t* camgroup_ctx,
const char* sns_entity_name);
```

```c
typedef struct rk_aiq_camgroup_instance_cfg_s {
const char* sns_ent_nm_array[RK_AIQ_CAM_GROUP_MAX_CAMS];
int sns_num;
const char* config_file_dir;
/* followings are relative path to config_file_dir */
const char* single_iq_file;
const char* group_iq_file;
const char* overlap_map_file;
} rk_aiq_camgroup_instance_cfg_t;
```

```cpp
struct RK_PS_SrcOverlapMap
{
char versionInfo[64];
RK_PS_SrcOverlapPosition srcOverlapPositon[8];
unsigned char overlapMap[15 * 15 * 8];
};
```

```c
XCamReturn rk_aiq_uapi2_setAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool on)；
```

```c
XCamReturn
rk_aiq_user_api2_ae_setExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
const Uapi_ExpSwAttrV2_t expSwAttr);
```

```javascript
Uapi_ExpSwAttrV2_t expSwAttr;
ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
//LinearAE
expSwAttr.stManual.LinearAE.ManualGainEn = true;
expSwAttr.stManual.LinearAE.ManualTimeEn = true;
expSwAttr.stManual.LinearAE.GainValue = 1.0f; /*gain = 1x*/
expSwAttr.stManual.LinearAE.TimeValue = 0.02f; /*time = 1/50s*/
//HdrAE (should set all frames)
expSwAttr.stManual.HdrAE.ManualGainEn = true;
expSwAttr.stManual.HdrAE.ManualTimeEn = true;
expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
expSwAttr.stManual.HdrAE.TimeValue[0] = 0.002f; /*sframe time = 1/500s*/
expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
expSwAttr.stManual.HdrAE.TimeValue[1] = 0.01f; /*mframe time = 1/100s*/
expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
expSwAttr.stManual.HdrAE.TimeValue[2] = 0.02f; /*lframe time = 1/50s*/
ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

```prolog
expSwAttr.stAuto.LinAeRange.stGainRange.Min,
expSwAttr.stAuto.LinAeRange.stGainRange.Max);
printf("hdr sgain range=[%f,%f], mgain range=[%f,%f], lgain range=[%f,%f]\n",
expSwAttr.stAuto.HdrAeRange.stGainRange[0].Min,
expSwAttr.stAuto.HdrAeRange.stGainRange[0].Max,
expSwAttr.stAuto.HdrAeRange.stGainRange[1].Min,
expSwAttr.stAuto.HdrAeRange.stGainRange[1].Max,
expSwAttr.stAuto.HdrAeRange.stGainRange[2].Min,
expSwAttr.stAuto.HdrAeRange.stGainRange[2].Max);
ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

```asm
Uapi_ExpSwAttr_t expSwAttr;
ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
uint8_t GridWeights[225]={
0, 0, 1, 2, 2, 3, 4, 5, 4, 3, 2, 2, 1, 0, 0,
0, 1, 2, 3, 3, 4, 5, 6, 5, 4, 3, 3, 2, 1, 0,
1, 2, 3, 5, 5, 6, 7, 8, 7, 6, 5, 5, 3, 2, 1,
2, 3, 5, 7, 7, 8, 9, 10, 9, 8, 7, 7, 5, 3, 2,
2, 3, 5, 7, 8, 9, 10, 11, 10, 9, 8, 7, 5, 3, 2,
2, 4, 6, 8, 9, 10, 11, 12, 11,10, 9, 8, 6, 4, 2,
2, 4, 6, 9, 10, 11, 12, 13, 12,11, 10, 9, 6, 4, 2,
3, 5 ,7, 10, 11, 12, 13, 14, 13,12, 11, 10, 7, 5, 3,
2, 4, 6, 9, 10, 11, 12, 13, 12,11, 10, 9, 6, 4, 2,
2, 4, 6, 8, 9, 10, 11, 12, 11,10, 9, 8, 6, 4, 2,
2, 3, 5, 7, 8, 9, 10, 11, 10, 9, 8, 7, 5, 3, 2,
2, 3, 5, 7, 7, 8, 9, 10, 9, 8, 7, 7, 5, 3, 2,
1, 2, 4, 6, 6, 7, 8, 9, 8, 7, 6, 6, 4, 2, 1,
0, 1, 3, 5, 5, 6, 7, 8, 7, 6, 5, 5, 3, 1, 0,
0, 1, 3, 5, 5, 6, 7, 8, 7, 6, 5, 5, 3, 1, 0
};
//method one：
memcpy(expSwAttr.GridWeights.uCoeff, GridWeights,
sizeof(expSwAttr.GridWeights.uCoeff));
//method two:
expSwAttr.stAdvanced.enable = true; //important! true means preferring to use
these parameters
memcpy(expSwAttr.stAdvanced.GridWeights,GridWeights,sizeof(expSwAttr.stAdvanced.
GridWeights));
ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

```prolog
LinAeRouteAttr.GainDot_len = len;
LinAeRouteAttr.IspDGainDot_len = len;
LinAeRouteAttr.PIrisDot_len = len;
LinAeRouteAttr.GainDot = GainDot;
LinAeRouteAttr.IspDGainDot = IspGainDot;
LinAeRouteAttr.TimeDot = TimeDot;
LinAeRouteAttr.PIrisDot = PirisDot;
rk_aiq_user_api2_ae_setLinAeRouteAttr(sys_ctx,LinAeRouteAttr);
```

```c
Uapi_HdrAeRouteAttr_t stHdrRoute;
memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
```

```c
Uapi_IrisAttrV2_t irisAttr;
ret = rk_aiq_user_api2_ae_getIrisAttr(ctx, &irisAttr);
irisAttr.enable = true; /*run AIris*/
//set P-iris attributes
irisAttr.IrisType = IRIS_P_TYPE;
irisAttr.PIrisAttr.TotalStep = 81;
irisAttr.PIrisAttr.EffcStep = 44;
irisAttr.PIrisAttr.ZeroIsMax = true;
uint16_t StepTable[1024] = {
```

```csv
512, 511, 506,499 491 483, 474, 465, 456,
446, 437, 427, 417, 408, 398, 388, 378, 368,
359, 349, 339, 329, 319, 309, 300, 290, 280,
271, 261, 252, 242, 233, 224, 214, 205, 196,
187, 178, 170, 161, 153, 144, 136, 128, 120,
112, 105, 98, 90, 83, 77, 70, 64, 58,
52, 46, 41, 36, 31, 27, 23, 19, 16,
13, 10, 8, 6, 4, 3, 1, 1, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0};
memcpy(irisAttr.PIrisAttr.StepTable,StepTable,sizeof(irisAttr.PIrisAttr.StepTabl
e));
ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
//set DC-iris attributes
irisAttr.IrisType = IRIS_DC_TYPE;
irisAttr.DCIrisAttr.Kp= 0.5f;
irisAttr.DCIrisAttr.Ki= 0.2f;
irisAttr.DCIrisAttr.Kd = 0.3f;
irisAttr.DCIrisAttr.OpenPwmDuty = 40;
irisAttr.DCIrisAttr.ClosePwmDuty = 22;
irisAttr.DCIrisAttr.MinPwmDuty = 0;
irisAttr.DCIrisAttr.MaxPwmDuty = 100;
ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
//set manual iris with auto ae
irisAttr.IrisOpType = RK_AIQ_OP_MODE_MANUAL;
if(irisAttr.IrisType == IRIS_P_TYPE);
irisAttr.ManualAttr.PIrisGainValue = 512; /*p-iris F#=1.4*/
if(irisAttr.IrisType == IRIS_DC_TYPE);
irisAttr.ManualAttr.DCIrisHoldValue = 20; /*dc-iris PwmDuty=20*/
ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
```

```c
typedef struct Uapi_ExpSwAttrV2_s {
rk_aiq_uapi_sync_t
uint8_t
CalibDb_CamRawStatsModeV2_t
CalibDb_CamHistStatsModeV2_t
CalibDb_CamYRangeModeV2_t
uint8_t
RKAiqOPMode_t
Cam15x15UCharMatrix_t
Uapi_AeAttrV2_t
Uapi_MeAttrV2_t
Uapi_ExpSwAttr_AdvancedV2_t
} Uapi_ExpSwAttrV2_t;
```

```c
typedef struct Aec_uapi_advanced_attr_s {
bool enable;
uint8_t GridWeights[15 * 15];
bool SetAeRangeEn;
Aec_LinAeRange_t SetLinAeRange;
Aec_HdrAeRange_t SetHdrAeRange;
} Aec_uapi_advanced_attr_t;
typedef Aec_uapi_advanced_attr_t Uapi_ExpSwAttr_AdvancedV2_t;
```

```c
typedef struct Aec_LinAeRange_s {
Aec_AeRange_t stExpTimeRange;
Aec_AeRange_t stGainRange;
Aec_AeRange_t stIspDGainRange;
Aec_AeRange_t stPIrisRange;
} Aec_LinAeRange_t;
```

```c
typedef struct Aec_HdrAeRange_s {
Aec_AeRange_t stExpTimeRange[3];
Aec_AeRange_t stGainRange[3];
Aec_AeRange_t stIspDGainRange[3];
Aec_AeRange_t stPIrisRange;
} Aec_HdrAeRange_t;
```

```c
typedef struct Uapi_AeAttrV2_s {
Uapi_AeSpeedV2_t stAeSpeed;
//DelayFrmNum
uint8_t BlackDelayFrame;
uint8_t WhiteDelayFrame;
//Auto/Fixed fps
Uapi_AeFpsAttrV2_t stFrmRate;
Uapi_AntiFlickerV2_t stAntiFlicker;
//auto range
Aec_LinAeRange_t LinAeRange;//result LinAerange
Aec_HdrAeRange_t HdrAeRange;//result HdrAerange
} Uapi_AeAttrV2_t;
```

```c
typedef struct CalibDb_AeFrmRateAttrV2_s {
bool isFpsFix;
uint8_t FpsValue;
} CalibDb_AeFrmRateAttrV2_t;
typedef CalibDb_AeFrmRateAttrV2_t Uapi_AeFpsAttrV2_t;
```

```c
typedef struct CalibDb_AntiFlickerAttrV2_s {
bool enable;
CalibDb_FlickerFreq_t Frequency;
CalibDb_AntiFlickerMode_t Mode;
} CalibDb_AntiFlickerAttrV2_t;
typedef CalibDb_AntiFlickerAttrV2_t Uapi_AntiFlickerV2_t;
```

```c
typedef struct Uapi_MeAttrV2_s {
Uapi_LinMeAttrV2_t stLinMe;
Uapi_HdrMeAttrV2_t stHdrMe;
} Uapi_MeAttrV2_t;
```

```c
typedef struct CalibDb_LinAeRoute_AttrV2_s {
float* TimeDot;
int TimeDot_len;
float* GainDot;
int GainDot_len;
float* IspDGainDot;
int IspDGainDot_len;
int* PIrisDot;
int PIrisDot_len;
} CalibDb_LinAeRoute_AttrV2_t;
typedef struct Uapi_LinAeRouteAttr_s {
rk_aiq_uapi_sync_t sync;
CalibDb_LinAeRoute_AttrV2_t Params;
} Uapi_LinAeRouteAttr_t;
```

```c
typedef struct CalibDb_LinearAE_AttrV2_s {
uint8_t RawStatsEn;
float ToleranceIn;
float ToleranceOut;
float Evbias;
CalibDb_AeStrategyModeV2_t StrategyMode;
CalibDb_LinExpInitExpV2_t InitExp;
CalibDb_LinAeRoute_AttrV2_t Route;
CalibDb_AecDynamicSetpointV2_t DySetpoint;
CalibDb_AecBacklightV2_t BackLightCtrl;
CalibDb_AecOverExpCtrlV2_t OverExpCtrl;
} CalibDb_LinearAE_AttrV2_t;
typedef struct Uapi_LinExpAttrV2_s {
rk_aiq_uapi_sync_t sync;
CalibDb_LinearAE_AttrV2_t Params;
} Uapi_LinExpAttrV2_t;
```

```c
typedef struct CalibDb_AecDynamicSetpointV2_s {
float* ExpLevel;
int ExpLevel_len;
float* DySetpoint;
int DySetpoint_len;
} CalibDb_AecDynamicSetpointV2_t;
```

```c
typedef struct CalibDb_HdrAE_AttrV2_s {
float ToleranceIn;
float ToleranceOut;
float Evbias;
CalibDb_AeStrategyModeV2_t StrategyMode;
float LumaDistTh; //used for area-growing
CalibDb_HdrExpInitExpV2_t InitExp;
CalibDb_HdrAeRoute_AttrV2_t Route;
CalibDb_ExpRatioCtrlV2_t ExpRatioCtrl;
CalibDb_LongFrmCtrlV2_t LongFrmMode;
CalibDb_LfrmCtrlV2_t LframeCtrl;
CalibDb_MfrmCtrlV2_t MframeCtrl;
CalibDb_SfrmCtrlV2_t SframeCtrl;
} CalibDb_HdrAE_AttrV2_t;
typedef struct Uapi_HdrExpAttrV2_s {
rk_aiq_uapi_sync_t sync;
CalibDb_HdrAE_AttrV2_t Params;
} Uapi_HdrExpAttrV2_t;
```

```c
typedef struct CalibDb_AecIrisCtrlV2_s {
uint8_t Enable;
CalibDb_IrisTypeV2_t IrisType;
RKAiqOPMode_t IrisOpType;
CalibDb_MIris_AttrV2_t ManualAttr;
CalibDb_PIris_AttrV2_t PIrisAttr;
CalibDb_DCIris_AttrV2_t DCIrisAttr;
} CalibDb_AecIrisCtrlV2_t;
typedef struct Uapi_IrisAttrV2_s {
rk_aiq_uapi_sync_t sync;
CalibDb_AecIrisCtrlV2_t Params;
} Uapi_IrisAttrV2_t;
```

```c
#define AEC_PIRIS_STAP_TABLE_MAX (1024)
typedef struct CalibDb_PIris_AttrV2_s {
uint16_t TotalStep;
uint16_t EffcStep;
bool ZeroIsMax;
uint16_t StepTable[AEC_PIRIS_STAP_TABLE_MAX];
} CalibDb_PIris_AttrV2_t;
```

```c
typedef struct window {
uint16_t h_offs;
uint16_t v_offs;
uint16_t h_size;
uint16_t v_size;
} window_t;
typedef struct Uapi_ExpWin_s {
rk_aiq_uapi_sync_t sync;
window Params;
} Uapi_ExpWin_t;
```

```c
typedef enum rk_aiq_wb_op_mode_s {
RK_AIQ_WB_MODE_INVALID = 0,
RK_AIQ_WB_MODE_MANUAL = 1,
RK_AIQ_WB_MODE_AUTO = 2,
RK_AIQ_WB_MODE_MAX
} rk_aiq_wb_op_mode_t;
```

```c
typedef enum rk_aiq_wb_mwb_mode_e {
RK_AIQ_MWB_MODE_INVAILD = 0,
RK_AIQ_MWB_MODE_CCT = 1,
RK_AIQ_MWB_MODE_WBGAIN = 2,
RK_AIQ_MWB_MODE_SCENE = 3,
} rk_aiq_wb_mwb_mode_t;
```

```c
typedef enum rk_aiq_wb_scene_e {
RK_AIQ_WBCT_INCANDESCENT = 0,
RK_AIQ_WBCT_FLUORESCENT,
RK_AIQ_WBCT_WARM_FLUORESCENT,
RK_AIQ_WBCT_DAYLIGHT,
RK_AIQ_WBCT_CLOUDY_DAYLIGHT,
RK_AIQ_WBCT_TWILIGHT,
RK_AIQ_WBCT_SHADE
} rk_aiq_wb_scene_t;
```

```c
typedef struct rk_aiq_wb_cct_s {
float CCT;
float CCRI;
} rk_aiq_wb_cct_t;
```

```c
typedef struct rk_aiq_wb_mwb_attrib_s {
rk_aiq_wb_mwb_mode_t mode;
union MWBPara_u {
rk_aiq_wb_gain_t gain;
rk_aiq_wb_scene_t scene;
rk_aiq_wb_cct_t cct;
} para;
} rk_aiq_wb_mwb_attrib_t;
```

```c
typedef struct rk_aiq_uapiV2_wb_awb_wbGainOffset_s{
rk_aiq_uapi_sync_t sync;
CalibDbV2_Awb_gain_offset_cfg_t gainOffset;
}rk_aiq_uapiV2_wb_awb_wbGainOffset_t;
```

```c
typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_s {
float lumaValue;
int ct_grid_num;
int cri_grid_num;
float ct_in_range[2];//min,max, equal distance sapmle
float cri_in_range[2];//min,max
float *ct_lut_out;//size is ct_grid_num*cri_grid_num
float *cri_lut_out;
} rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t;
typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjust_s {
rk_aiq_uapi_sync_t sync;
bool enable;
rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t *lutAll;
int lutAll_len;
} rk_aiq_uapiV2_wb_awb_wbGainAdjust_t;
```

```c
typedef struct rk_aiq_uapiV2_wbV30_attrib_s {
rk_aiq_uapi_sync_t sync;
bool byPass;
rk_aiq_wb_op_mode_t mode;
rk_aiq_wb_mwb_attrib_t stManual;
rk_aiq_uapiV2_wbV30_awb_attrib_t stAuto;
} rk_aiq_uapiV2_wbV30_attrib_t;
```

```c
typedef struct rk_aiq_wb_querry_info_s {
rk_aiq_wb_gain_t gain;
rk_aiq_wb_cct_t cctGloabl;
bool awbConverged;
uint32_t LVValue;
} rk_aiq_wb_querry_info_t;
```

```c
typedef struct rk_aiq_uapiV2_wb_opMode_s {
rk_aiq_uapi_sync_t sync;
rk_aiq_wb_op_mode_t mode;
} rk_aiq_uapiV2_wb_opMode_t;
```

```c
typedef struct rk_aiq_wb_mwb_attrib_s {
rk_aiq_uapi_sync_t sync;
rk_aiq_wb_mwb_mode_t mode;
union MWBPara_u {
rk_aiq_wb_gain_t gain;
rk_aiq_wb_scene_t scene;
rk_aiq_wb_cct_t cct;
} para;
} rk_aiq_wb_mwb_attrib_t;
```

```cpp
XCamReturn rk_aiq_uapi2_trackingFocus(const rk_aiq_sys_ctx_t* ctx);
```

```c
typedef enum opMode_e {
OP_AUTO = 0,
OP_MANUAL = 1,
OP_SEMI_AUTO = 2,
OP_INVAL
} opMode_t;
```

```c
typedef enum rk_aiq_af_sec_stat_e
RK_AIQ_AF_SEARCH_INVAL = 0,
RK_AIQ_AF_SEARCH_RUNNING = 1,
RK_AIQ_AF_SEARCH_END = 2
} rk_aiq_af_sec_stat_t;
typedef struct {
rk_aiq_af_sec_stat_t stat;
int32_t final_pos;
} rk_aiq_af_result_t;
```

```c
typedef enum _RKAIQ_AF_MODE
RKAIQ_AF_MODE_NOT_SET = -1,
RKAIQ_AF_MODE_AUTO,
RKAIQ_AF_MODE_MACRO,
RKAIQ_AF_MODE_INFINITY,
RKAIQ_AF_MODE_FIXED,
RKAIQ_AF_MODE_EDOF,
RKAIQ_AF_MODE_CONTINUOUS_VIDEO,
RKAIQ_AF_MODE_CONTINUOUS_PICTURE,
RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM,
} RKAIQ_AF_MODE;
```

```c
typedef enum _RKAIQ_AF_HWVER
RKAIQ_AF_HW_V20 = 0,
RKAIQ_AF_HW_V30,
RKAIQ_AF_HW_VMAX
} RKAIQ_AF_HWVER;
```

```c
typedef struct {
unsigned char af_en;
unsigned char rawaf_sel;
unsigned char gamma_en;
unsigned char gaus_en;
unsigned char v1_fir_sel;
unsigned char hiir_en;
```

```c
unsigned char viir_en;
unsigned char v1_fv_outmode; // 0 square, 1 absolute
unsigned char v2_fv_outmode; // 0 square, 1 absolute
unsigned char h1_fv_outmode; // 0 square, 1 absolute
unsigned char h2_fv_outmode; // 0 square, 1 absolute
unsigned char ldg_en;
unsigned char accu_8bit_mode; // fix to 1
unsigned char ae_mode;
unsigned char y_mode; // fix to 0
unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
unsigned char window_num;
unsigned short wina_h_offs;
unsigned short wina_v_offs;
unsigned short wina_h_size;
unsigned short wina_v_size;
unsigned short winb_h_offs;
unsigned short winb_v_offs;
unsigned short winb_h_size;
unsigned short winb_v_size;
unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
// [old version param]
unsigned short thres;
unsigned char shift_sum_a;
unsigned char shift_sum_b;
unsigned char shift_y_a;
unsigned char shift_y_b;
/**********[Vertical IIR (v1 & v2)]************/
short v1_iir_coe[9];
short v1_fir_coe[3];
short v2_iir_coe[3];
short v2_fir_coe[3];
/**********[Horizontal IIR (h1 & h2)]************/
short h1_iir1_coe[6];
short h2_iir1_coe[6];
short h1_iir2_coe[6];
short h2_iir2_coe[6];
/**********[Focus value statistic param]**********/
// level depended gain
// input8 lumi, output8bit gain
unsigned char h_ldg_lumth[2]; //luminance thresh
unsigned char h_ldg_gain[2]; //gain for [minLum,maxLum]
unsigned short h_ldg_gslp[2]; //[slope_low,-slope_high]
unsigned char v_ldg_lumth[2];
unsigned char v_ldg_gain[2];
unsigned short v_ldg_gslp[2];
// coring
unsigned short v_fv_thresh;
unsigned short h_fv_thresh;
// left shift, more needed if outmode=square
```

```c
unsigned char v1_fv_shift; //only for sel1
unsigned char v2_fv_shift;
unsigned char h1_fv_shift;
unsigned char h2_fv_shift;
/**********[High light]**********/
unsigned short highlit_thresh;
} rk_aiq_af_algo_meas_v30_t;
```

```c
typedef struct rk_aiq_af_attrib_s {
rk_aiq_uapi_sync_t sync;
RKAIQ_AF_MODE AfMode;
RKAIQ_AF_HWVER AfHwVer;
bool contrast_af;
bool laser_af;
bool pdaf;
int h_offs;
int v_offs;
unsigned int h_size;
unsigned int v_size;
short fixedModeDefCode;
short macroModeDefCode;
short infinityModeDefCode;
union {
rk_aiq_af_algo_meas_v20_t manual_meascfg;
rk_aiq_af_algo_meas_v30_t manual_meascfg_v30;
};
} rk_aiq_af_attrib_t;
```

```c
typedef enum merge_OpModeV21_e {
MERGE_OPMODE_API_OFF = 0,
MERGE_OPMODE_MANU = 1,
} merge_OpModeV21_t;
```

```javascript
mMergeOECurveV21_t
```

```c
typedef struct mMergeAttrV21_s {
mMergeOECurveV21_t OECurve;
mMergeMDCurveV21_t MDCurve;
} mMergeAttrV21_t;
```

```c
typedef struct mergeAttrV21_s {
merge_OpModeV21_t opMode;
mMergeAttrV21_t stManual;
MergeCurrCtlData_t CtlInfo;
} mergeAttrV21_t;
```

```c
typedef struct mMergeMDCurveV30Short_s{
float Coef;
float ms_thd0;
float lm_thd0;
} mMergeMDCurveV30Short_t;
```

```c
typedef struct mShortFrameModeData_s {
mMergeOECurveV21_t OECurve;
mMergeMDCurveV30Short_t MDCurve;
} mShortFrameModeData_t;
```

```c
typedef struct mergeAttrV30_s {
merge_OpModeV21_t opMode;
mMergeAttrV30_t stManual;
MergeCurrCtlData_t CtlInfo;
} mergeAttrV30_t;
```

```c
typedef struct mergeAttr_s {
rk_aiq_uapi_sync_t sync;
mergeAttrV21_t attrV21;
mergeAttrV30_t attrV30;
} mergeAttr_t;
```

```c
typedef struct mDrcGain_s {
float DrcGain;
float Alpha;
float Clip;
} mDrcGain_t;
```

```c
typedef struct mDrcHiLit_s {
float Strength;
} mDrcHiLit_t;
```

```c
typedef struct drcAttr_s {
rk_aiq_uapi_sync_t sync;
AdrcVersion_t Version;
drc_OpMode_t opMode;
mdrcAttr_V21_t stManualV21;
mdrcAttr_V30_t stManualV30;
mDrcGain_t stDrcGain;
mDrcHiLit_t stHiLit;
mLocalDataV21_t stLocalDataV21;
mLocalDataV30_t stLocalDataV30;
DrcInfo_t Info;
} drcAttr_t;
```

```c
typedef struct rk_aiq_bayer2dnr_attrib_v2_s {
rk_aiq_uapi_sync_t sync;
Abayer2dnr_OPMode_V2_t eMode;
Abayer2dnr_Auto_Attr_V2_t stAuto;
Abayer2dnr_Manual_Attr_V2_t stManual;
} rk_aiq_bayer2dnr_attrib_v2_t;
```

```c
typedef enum Abayer2dnr_OPMode_V2_e {
ABAYER2DNR_OP_MODE_INVALID = 0,
ABAYER2DNR_OP_MODE_AUTO = 1,
ABAYER2DNR_OP_MODE_MANUAL 2,
ABAYER2DNR_OP_MODE_REG_MANUAL 3,
ABAYER2DNR_OP_MODE_MAX
} Abayer2dnr_OPMode_V2_t;
```

```c
typedef struct Abayer2dnr_Auto_Attr_V2_s
RK_Bayer2dnr_Params_V2_t st2DParams;
RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
} Abayer2dnr_Auto_Attr_V2_t;
```

```c
typedef struct Abayer2dnr_Manual_Attr_V2_s
{
RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
RK_Bayer2dnr_Fix_V2_t st2Dfix;
} Abayer2dnr_Manual_Attr_V2_t;
```

```c
typedef struct RK_Bayer2dnr_Fix_V2_s {
//ISP_BAYNR_3A00_CTRL
uint8_t baynr_lg2_mode;
uint8_t baynr_gauss_en;
uint8_t baynr_log_bypass;
uint8_t baynr_en;
// ISP_BAYNR_3A00_DGAIN0-2
uint16_t baynr_dgain[3];
// ISP_BAYNR_3A00_PIXDIFF
uint16_t baynr_pix_diff;
// ISP_BAYNR_3A00_THLD
uint16_t baynr_diff_thld;
uint16_t baynr_softthld;
// ISP_BAYNR_3A00_W1_STRENG
uint16_t bltflt_streng;
uint16_t baynr_reg_w1;
// ISP_BAYNR_3A00_SIGMAX0-15
uint16_t sigma_x[16];
// ISP_BAYNR_3A00_SIGMAY0-15
uint16_t sigma_y[16];
```

```c
// ISP_BAYNR_3A00_WRIT_D
uint16_t weit_d[3];
uint16_t lg2_lgoff;
uint16_t lg2_off;
uint32_t dat_max;
} RK_Bayer2dnr_Fix_V2_t;
```

```c
typedef struct rk_aiq_bayer2dnr_strength_v2_s {
rk_aiq_uapi_sync_t sync;
float percent;
} rk_aiq_bayer2dnr_strength_v2_t;
```

```c
typedef struct rk_aiq_bayertnr_attrib_v2_s {
rk_aiq_uapi_sync_t sync;
Abayertnr_OPMode_V2_t eMode;
Abayertnr_Auto_Attr_V2_t stAuto;
Abayertnr_Manual_Attr_V2_t stManual;
} rk_aiq_bayertnr_attrib_v2_t;
```

```c
typedef enum Abayertnr_OPMode_V2_e {
ABAYERTNRV2_OP_MODE_INVALID = 0,
ABAYERTNRV2_OP_MODE_AUTO = 1,
ABAYERTNRV2_OP_MODE_MANUAL = 2,
ABAYERTNRV2_OP_MODE_REG_MANUAL = 3,
ABAYERTNRV2_OP_MODE_MAX
} Abayertnr_OPMode_V2_t;
```

```c
typedef struct Abayertnr_Manual_Attr_V2_s
int bayernr3DEn;
RK_Bayertnr_Params_V2_Select_t st3DSelect;
RK_Bayertnr_Fix_V2_t st3DFix;
} Abayertnr_Manual_Attr_V2_t;
```

```c
typedef struct RK_Bayertnr_Fix_V2_s {
// BAY3D_BAY3D_CTRL 0x2c00
uint8_t bay3d_exp_sel;
uint8_t bay3d_soft_st;
uint8_t bay3d_soft_mode;
uint8_t bay3d_bwsaving_en;
uint8_t bay3d_loswitch_protect;
uint8_t bay3d_glbpk_en;
uint8_t bay3d_logaus3_bypass_en;
uint8_t bay3d_logaus5_bypass_en;
uint8_t bay3d_lomed_bypass_en;
uint8_t bay3d_hichnsplit_en;
uint8_t bay3d_hiabs_pssel;
uint8_t bay3d_higaus_bypass_en;
uint8_t bay3d_himed_bypass_en;
uint8_t bay3d_lobypass_en;
uint8_t bay3d_hibypass_en;
uint8_t bay3d_bypass_en;
uint8_t bay3d_en_i;
// BAY3D_BAY3D_KALRATIO 0x2c04
uint16_t bay3d_softwgt;
uint16_t bay3d_hidif_th;
// BAY3D_BAY3D_GLBPK2 0x2c08
uint32_t bay3d_glbpk2;
// BAY3D_BAY3D_WGTLMT 0x2c10
uint16_t bay3d_wgtlmt;
uint16_t bay3d_wgtratio;
// BAY3D_BAY3D_SIG_X0 0x2c14 - 0x2c30
uint16_t bay3d_sig0_x[16];
// BAY3D_BAY3D_SIG0_Y0 0x2c34 - 0x2c50
```

```c
uint16_t bay3d_sig0_y[16];
// BAY3D_BAY3D_SIG_X0 0x2c54 - 0x2c70
uint16_t bay3d_sig1_x[16];
// BAY3D_BAY3D_SIG1_Y0 0x2c74 - 0x2c90
uint16_t bay3d_sig1_y[16];
// BAY3D_BAY3D_SIG2_Y0 0x2c94 - 0x2cb0
uint16_t bay3d_sig2_y[16];
//BAY3D_BAY3D_LODIF_STAT0 0x2cb4 -0x2cb8
uint64_t ro_sum_lodif;
//BAY3D_BAY3D_LODIF_STAT0 0x2cbc -0x2cc0
uint64_t ro_sum_hidif0;
//BAY3D_BAY3D_MI_ST 0x2CC8
uint8_t sw_bay3dmi_st_linemode;
uint8_t sw_bay3d_mi2cur_linecnt;
} RK_Bayertnr_Fix_V2_t;
```

```c
typedef struct rk_aiq_ynr_attrib_v3_s {
rk_aiq_uapi_sync_t sync;
Aynr_OPMode_V3_t eMode;
Aynr_Auto_Attr_V3_t stAuto;
Aynr_Manual_Attr_V3_t stManual;
} rk_aiq_ynr_attrib_v3_t;
```

```c
typedef struct Aynr_Auto_Attr_V3_s
{
RK_YNR_Params_V3_t stParams;
RK_YNR_Params_V3_Select_t stSelect;
} Aynr_Auto_Attr_V3_t;
```

```c
typedef struct Aynr_Manual_Attr_V3_s
{
RK_YNR_Params_V3_Select_t stSelect;
RK_YNR_Fix_V3_t stFix;
} Aynr_Manual_Attr_V3_t;
```

```c
typedef struct RK_YNR_Params_V3_s
{
int enable;
char version[64];
float iso[RK_YNR_V3_MAX_ISO_NUM];
RK_YNR_Params_V3_Select_t arYnrParamsISO[RK_YNR_V3_MAX_ISO_NUM];
} RK_YNR_Params_V3_t;
```

```c
RK_YNR_Params_V3_Select_t
```

```c
typedef struct RK_YNR_Fix_V3_s {
// YNR_2700_GLOBAL_CTRL (0x0000)
uint8_t ynr_rnr_en;
uint8_t ynr_gate_dis;
uint8_t ynr_thumb_mix_cur_en;
uint8_t ynr_global_gain_alpha;
uint16_t ynr_global_gain;
uint8_t ynr_flt1x1_bypass_sel;
uint8_t ynr_sft5x5_bypass;
uint8_t ynr_flt1x1_bypass;
uint8_t ynr_lgft3x3_bypass;
uint8_t ynr_lbft5x5_bypass;
uint8_t ynr_bft3x3_bypass;
uint8_t ynr_en;
// YNR_2700_RNR_MAX_R (0x0004)
uint8_t ynr_local_gainscale;
uint16_t ynr_rnr_max_r;
// YNR_2700_RNR_MAX_R (0x0008)
```

```c
uint16_t ynr_rnr_center_coorv;
uint16_t ynr_rnr_center_coorh;
// YNR_2700_RNR_MAX_R (0x000c)
uint8_t ynr_localgain_adj;
uint16_t ynr_localgain_adj_thresh;
// YNR_2700_LOWNR_CTRL0 (0x0010)
uint16_t ynr_low_bf_inv[2];
// YNR_2700_LOWNR_CTRL1 (0x0014)
uint8_t ynr_low_peak_supress;
uint16_t ynr_low_thred_adj;
// YNR_2700_LOWNR_CTRL2 (0x0018)
uint16_t ynr_low_dist_adj;
uint16_t ynr_low_edge_adj_thresh;
// YNR_2700_LOWNR_CTRL3 (0x001c)
uint8_t ynr_low_bi_weight;
uint8_t ynr_low_weight;
uint16_t ynr_low_center_weight;
// YNR_2700_HIGHNR_CTRL0 (0x0020)
uint8_t ynr_hi_min_adj;
uint16_t ynr_high_thred_adj;
// YNR_2700_HIGHNR_CTRL1 (0x0024)
uint8_t ynr_high_retain_weight;
uint8_t ynr_hi_edge_thed;
// YNR_2700_HIGHNR_BASE_FILTER_WEIGHT (0x0028)
uint8_t ynr_base_filter_weight[3];
// YNR_2700_HIGHNR_BASE_FILTER_WEIGHT (0x002c)
uint32_t ynr_frame_full_size;
uint16_t ynr_lbf_weight_thres;
// YNR_2700_GAUSS1_COEFF (0x0030)
uint16_t ynr_low_gauss1_coeff[3];
// YNR_2700_GAUSS2_COEFF (0x0034)
uint16_t ynr_low_gauss2_coeff[3];
// YNR_2700_DIRECTION_W_0_3 (0x0038 - 0x003c)
uint8_t ynr_direction_weight[8];
// YNR_2700_SGM_DX_0_1 (0x0040 - 0x0060)
uint16_t ynr_luma_points_x[17];
// YNR_2700_LSGM_Y_0_1 (0x0070- 0x0090)
uint16_t ynr_lsgm_y[17];
// YNR_2700_HSGM_Y_0_1 (0x00a0- 0x00c0)
uint16_t ynr_hsgm_y[17];
// YNR_2700_RNR_STRENGTH03 (0x00d0- 0x00e0)
uint16_t ynr_rnr_strength[17];
```

```c
typedef struct rk_aiq_cnr_attrib_v2_s {
rk_aiq_uapi_sync_t sync;
AcnrV2_OPMode_t eMode;
Acnr_Auto_Attr_V2_t stAuto;
Acnr_Manual_Attr_V2_t stManual;
} rk_aiq_cnr_attrib_v2_t;
```

```c
typedef struct Acnr_Auto_Attr_V2_s
{
//all ISO params and select param
RK_CNR_Params_V2_t stParams;
RK_CNR_Params_V2_Select_t stSelect;
} Acnr_Auto_Attr_V2_t;
```

```c
typedef struct Acnr_Manual_Attr_V2_s
{
RK_CNR_Params_V2_Select_t stSelect;
RK_CNR_Fix_V2_t stFix;
} Acnr_Manual_Attr_V2_t;
```

```c
typedef struct RK_CNR_Params_V2_s
{
int enable;
float iso[RK_CNR_V2_MAX_ISO_NUM];
```

```lisp
int hf_bypass[RK_CNR_V2_MAX_ISO_NUM];
int lf_bypass[RK_CNR_V2_MAX_ISO_NUM];
// gain
float global_gain[RK_CNR_V2_MAX_ISO_NUM];
float global_gain_alpha[RK_CNR_V2_MAX_ISO_NUM];
float local_gain_scale[RK_CNR_V2_MAX_ISO_NUM];
// strength adj by gain
int gain_adj_strength_ratio[RK_CNR_V2_MAX_ISO_NUM]
[RKCNR_V2_SGM_ADJ_TABLE_LEN];
//
float color_sat_adj[RK_CNR_V2_MAX_ISO_NUM];
float color_sat_adj_alpha[RK_CNR_V2_MAX_ISO_NUM];
// step1
// median filter
float hf_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
// bilateral filter
float hf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
float hf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
float hf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
int hf_bf_wgt_clip[RK_CNR_V2_MAX_ISO_NUM];
// step2
// median filter
float thumb_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
// bilateral filter
float thumb_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
float thumb_color_sat[RK_CNR_V2_MAX_ISO_NUM];
// step3
// bilateral filter
float lf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
float lf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
float lf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
// bilateral filter kernels
float kernel_5x5[5];
} RK_CNR_Params_V2_t;
```

```c
typedef struct RK_CNR_Params_V2_Select_s
{
int enable;
// bypass
int hf_bypass;
int lf_bypass;
// gain
// gain
float global_gain;
float global_gain_alpha;
float local_gain_scale;
// strength adj by gain
int gain_adj_strength_ratio[RKCNR_V2_SGM_ADJ_TABLE_LEN];
//
float color_sat_adj;
float color_sat_adj_alpha;
// step1
// median filter
float hf_spikes_reducion_strength;
// bilateral filter
float hf_denoise_strength;
float hf_color_sat;
float hf_denoise_alpha;
int hf_bf_wgt_clip;
```

```c
typedef struct RK_CNR_Fix_V2_s {
//ISP_CNR_2800_CTRL
uint8_t cnr_thumb_mix_cur_en;
uint8_t cnr_lq_bila_bypass;
uint8_t cnr_hq_bila_bypass;
uint8_t cnr_exgain_bypass;
uint8_t cnr_en_i;
// ISP_CNR_2800_EXGAIN
uint8_t cnr_global_gain_alpha;
uint16_t cnr_global_gain;
// ISP_CNR_2800_GAIN_PARA
uint8_t cnr_gain_iso;
uint8_t cnr_gain_offset;
uint8_t cnr_gain_1sigma;
// ISP_CNR_2800_GAIN_UV_PARA
uint8_t cnr_gain_uvgain1;
uint8_t cnr_gain_uvgain0;
// ISP_CNR_2800_LMED3
uint8_t cnr_lmed3_alpha;
// ISP_CNR_2800_LBF5_GAIN
uint8_t cnr_lbf5_gain_y;
uint8_t cnr_lbf5_gain_c;
// ISP_CNR_2800_LBF5_WEITD0_4
uint8_t cnr_lbf5_weit_d[5];
// ISP_CNR_2800_HMED3
```

```c
uint8_t cnr_hmed3_alpha;
// ISP_CNR_2800_HBF5
uint8_t cnr_hbf5_weit_src;
uint8_t cnr_hbf5_min_wgt;
uint16_t cnr_hbf5_sigma;
// ISP_CNR_2800_LBF3
uint8_t cnr_lbf5_weit_src;
uint16_t cnr_lbf3_sigma;
//ISP_CNR_2800_SIGMA0-SIGMA3
uint8_t cnr_sigma_y[13];
} RK_CNR_Fix_V2_t;
```

```c
XCamReturn
rk_aiq_user_api2_ablc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_blc_attrib_t *attr);
```

```c
XCamReturn
rk_aiq_user_api2_ablc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_blc_attrib_t *attr);
```

```c
typedef enum dehaze_api_mode_e {
DEHAZE_API_AUTO = 0,
DEHAZE_API_MANUAL = 1,
} dehaze_api_mode_t;
```

```c
typedef struct DehazeDataV21_s{
float* EnvLv;
int EnvLv_len;
float* dc_min_th;
int dc_min_th_len;
float* dc_max_th;
int dc_max_th_len;
float* yhist_th;
int yhist_th_len;
float* yblk_th;
int yblk_th_len;
float* dark_th;
int dark_th_len;
float* bright_min;
int bright_min_len;
float* bright_max;
int bright_max_len;
float* wt_max;
int wt_max_len;
float* air_min;
int air_min_len;
float* air_max;
int air_max_len;
float* tmax_base;
int tmax_base_len;
float* tmax_off;
int tmax_off_len;
float* tmax_max;
int tmax_max_len;
float* cfg_wt;
int cfg_wt_len;
float* cfg_air;
int cfg_air_len;
float* cfg_tmax;
int cfg_tmax_len;
```

```c
float* dc_weitcur;
int dc_weitcur_len;
float* bf_weight;
int bf_weight_len;
float* range_sigma;
int range_sigma_len;
float* space_sigma_pre;
int space_sigma_pre_len;
float* space_sigma_cur;
int space_sigma_cur_len;
} DehazeDataV21_t;
```

```sql
typedef struct Dehaze_Setting_V21_s{
bool en;
bool air_lc_en;
float stab_fnum;
float sigma;
float wt_sigma;
float air_sigma;
float tmax_sigma;
float pre_wet;
DehazeDataV21_t DehazeData;
} Dehaze_Setting_V21_t;
```

```c
typedef struct HistDataV21_s{
float* EnvLv;
int EnvLv_len;
float* hist_gratio;
int hist_gratio_len;
float* hist_th_off;
int hist_th_off_len;
float* hist_k;
int hist_k_len;
float* hist_min;
int hist_min_len;
float* hist_scale;
int hist_scale_len;
float* cfg_gratio;
int cfg_gratio_len;
} HistDataV21_t;
```

```c
typedef struct Hist_setting_V21_s{
bool en;
bool hist_para_en;
HistDataV21_t HistData;
} Hist_setting_V21_t;
```

```c
typedef struct mHist_setting_V21_s {
bool en;
bool hist_para_en;
mHistDataV21_t HistData;
} mHist_setting_V21_t;
```

```c
typedef struct adehaze_sw_V2_s {
rk_aiq_uapi_sync_t sync;
dehaze_api_mode_t mode;
CalibDbV2_dehaze_V21_t stAuto;
mDehazeAttr_t stManual;
DehazeManuAttr_t stDehazeManu;
EnhanceManuAttr_t stEnhanceManu;
} adehaze_sw_V2_t;
```

```c
XCamReturn rk_aiq_user_api2_acp_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
acp_attrib_t attr);
```

```c
typedef struct acp_attrib_s {
uint8_t brightness; /* 0 ~ 255 */
uint8_t contrast; /* 0 ~ 255 */
uint8_t saturation; /* 0 ~ 255 */
uint8_t hue; /* 0 ~ 255 */
} acp_attrib_t;
```

```c
XCamReturn rk_aiq_user_api2_aie_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
```

```c
typedef enum rk_aiq_ie_effect_e {
RK_AIQ_IE_EFFECT_NONE,
RK_AIQ_IE_EFFECT_BW,
RK_AIQ_IE_EFFECT_NEGATIVE,
RK_AIQ_IE_EFFECT_SEPIA,
RK_AIQ_IE_EFFECT_EMBOSS,
RK_AIQ_IE_EFFECT_SKETCH,
RK_AIQ_IE_EFFECT_SHARPEN, /*!< deprecated */
} rk_aiq_ie_effect_t;
```

```c
typedef struct rk_aiq_uapi_acsm_attrib_s {
rk_aiq_uapi_sync_t sync;
rk_aiq_acsm_params_t param;
} rk_aiq_uapi_acsm_attrib_t;
```

```c
typedef struct __csm_param {
RKAiqOPMode_t op_mode;
bool full_range;
uint8_t y_offset;
uint8_t c_offset;
float coeff[RK_AIQ_CSM_COEFF_NUM];
} Csm_Param_t;
```

```c
XCamReturn
rk_aiq_user_api2_asharpV4_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_sharp_attrib_v4_t* attr);
```

```c
XCamReturn
rk_aiq_user_api2_asharpV4_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_sharp_attrib_v4_t* attr);
```

```c
typedef struct rk_aiq_sharp_attrib_v4_s {
rk_aiq_uapi_sync_t sync;
Asharp4_OPMode_t eMode;
Asharp_Auto_Attr_V4_t stAuto;
Asharp_Manual_Attr_V4_t stManual;
} rk_aiq_sharp_attrib_v4_t;
```

```c
typedef enum Asharp4_OPMode_e {
ASHARP4_OP_MODE_INVALID = 0,
ASHARP4_OP_MODE_AUTO 1,
ASHARP4_OP_MODE_MANUAL 2,
ASHARP4_OP_MODE_REG_MANUAL 3,
ASHARP4_OP_MODE_MAX
} Asharp4_OPMode_t;
```

```c
typedef struct Asharp_Manual_Attr_V4_s
{
RK_SHARP_Params_V4_Select_t stSelect;
RK_SHARP_Fix_V4_t stFix;
} Asharp_Manual_Attr_V4_t;
```

```c
typedef struct RK_SHARP_Fix_V4_s
{
// SHARP_SHARP_EN (0x0000)
uint8_t sharp_clk_dis;
uint8_t sharp_exgain_bypass;
uint8_t sharp_center_mode;
uint8_t sharp_bypass;
uint8_t sharp_en;
// SHARP_SHARP_RATIO (0x0004)
uint8_t sharp_sharp_ratio;
uint8_t sharp_bf_ratio;
uint8_t sharp_gaus_ratio;
uint8_t sharp_pbf_ratio;
// SHARP_SHARP_LUMA_DX (0x0008)
uint8_t sharp_luma_dx[7];
// SHARP_SHARP_PBF_SIGMA_INV_0 (0x000c - 0x0014)
uint16_t sharp_pbf_sigma_inv[8];
// SHARP_SHARP_BF_SIGMA_INV_0 (0x0018 - 0x0020)
uint16_t sharp_bf_sigma_inv[8];
// SHARP_SHARP_SIGMA_SHIFT (0x00024)
uint8_t sharp_bf_sigma_shift;
uint8_t sharp_pbf_sigma_shift;
// SHARP_SHARP_EHF_TH_0 (0x0028 - 0x0030)
uint16_t sharp_ehf_th[8];
// SHARP_SHARP_CLIP_HF_0 (0x0034 - 0x003c)
uint16_t sharp_clip_hf[8];
// SHARP_SHARP_PBF_COEF (0x00040)
uint8_t sharp_pbf_coef[3];
// SHARP_SHARP_BF_COEF (0x00044)
uint8_t sharp_bf_coef[3];
```

```c
typedef struct rk_aiq_sharp_strength_v4_s {
rk_aiq_uapi_sync_t sync;
float percent;
} rk_aiq_sharp_strength_v4_t;
```

```sql
XCamReturn rk_aiq_uapi2_setGammaCoef(const rk_aiq_sys_ctx_t* ctx, float
GammaCoef, float SlopeAtZero);
```

```c
typedef enum rk_aiq_gamma_op_mode_s {
RK_AIQ_GAMMA_MODE_OFF = 0,
RK_AIQ_GAMMA_MODE_MANUAL = 1,
RK_AIQ_GAMMA_MODE_FAST = 2,
} rk_aiq_gamma_op_mode_t;
```

```c
typedef struct Agamma_api_manualV30_s {
bool Gamma_en;
uint16_t Gamma_out_offset;
uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V30];
} Agamma_api_manualV30_t;
```

```c
typedef struct rk_aiq_gamma_attrV21_s {
rk_aiq_gamma_op_mode_t mode;
Agamma_api_manualV21_t stManual;
Agamma_api_Fast_t stFast;
} rk_aiq_gamma_attrV21_t;
```

```c
typedef struct rk_aiq_gamma_attrV30_s {
rk_aiq_gamma_op_mode_t mode;
Agamma_api_manualV30_t stManual;
Agamma_api_Fast_t stFast;
} rk_aiq_gamma_attrV30_t;
```

```c
typedef struct rk_aiq_gamma_attr_s {
rk_aiq_uapi_sync_t sync;
rk_aiq_gamma_attrV21_t atrrV21;
rk_aiq_gamma_attrV30_t atrrV30;
} rk_aiq_gamma_attr_t;
```

```c
XCamReturn rk_aiq_uapi2_setCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

```c
XCamReturn rk_aiq_uapi2_setMCcCoef(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_ccm_matrix_t *mccm);
```

```c
typedef struct rk_aiq_ccm_matrix_s {
float ccMatrix[9];
float ccOffsets[3];
} rk_aiq_ccm_matrix_t;
```

```c
typedef enum rk_aiq_ccm_op_mode_s {
RK_AIQ_CCM_MODE_INVALID = 0,
RK_AIQ_CCM_MODE_MANUAL = 1,
RK_AIQ_CCM_MODE_AUTO = 2,
RK_AIQ_CCM_MODE_MAX
} rk_aiq_ccm_op_mode_t;
```

```c
typedef struct rk_aiq_ccm_attrib_s {
rk_aiq_uapi_sync_t sync;
bool byPass;
rk_aiq_ccm_op_mode_t mode;
rk_aiq_ccm_mccm_attrib_t stManual;
rk_aiq_ccm_accm_attrib_t stAuto;
CalibDbV2_Ccm_Para_V2_t stTool;
} rk_aiq_ccm_attrib_t;
```

```tcl
typedef struct rk_aiq_ccm_querry_info_s {
bool ccm_en;
float ccMatrix[9];
float ccOffsets[3];
float y_alpha_curve[CCM_CURVE_DOT_NUM];
float low_bound_pos_bit;
float color_inhibition_level;
float color_saturation_level;
float finalSat;
char ccmname1[25];
char ccmname2[25];
} rk_aiq_ccm_querry_info_t;
```

```tcl
typedef struct rk_aiq_lut3d_table_s{
unsigned short look_up_table_r[729];
unsigned short look_up_table_g[729];
unsigned short look_up_table_b[729];
} rk_aiq_lut3d_table_t;
```

```c
typedef enum rk_aiq_lut3d_op_mode_s {
RK_AIQ_LUT3D_MODE_INVALID
RK_AIQ_LUT3D_MODE_MANUAL
RK_AIQ_LUT3D_MODE_AUTO
RK_AIQ_LUT3D_MODE_MAX
} rk_aiq_lut3d_op_mode_t;
```

```c
typedef struct rk_aiq_lut3d_attrib_s {
rk_aiq_uapi_sync_t sync;
bool byPass;
rk_aiq_lut3d_op_mode_t mode;
rk_aiq_lut3d_mlut3d_attrib_t stManual;
} rk_aiq_lut3d_attrib_t;
```

```c
XCamReturn rk_aiq_uapi2_setLdchEn(const rk_aiq_sys_ctx_t* ctx, bool en);
```

```c
typedef struct rk_aiq_ldch_cfg_s {
rk_aiq_uapi_sync_t sync;
unsigned int en;
int correct_level;
} rk_aiq_ldch_cfg_t;
```

```c
typedef struct adebayer_attrib_auto_s {
uint8_t sharp_strength[9];
uint8_t low_freq_thresh;
uint8_t high_freq_thresh;
} adebayer_attrib_auto_t;
```

```c
typedef struct adebayer_attrib_s {
rk_aiq_uapi_sync_t sync;
uint8_t enable;
rk_aiq_debayer_op_mode_t mode;
adebayer_attrib_manual_t stManual;
adebayer_attrib_auto_t stAuto;
} adebayer_attrib_t;
```

```c
XCamReturn
rk_aiq_user_api2_adpcc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_dpcc_attrib_V20_t *attr);
```

```c
unsigned char pg_green1_enable;
unsigned char sw_rk_red_blue2_en;
unsigned char rg_red_blue2_enable;
unsigned char rnd_red_blue2_enable;
unsigned char ro_red_blue2_enable;
unsigned char lc_red_blue2_enable;
unsigned char pg_red_blue2_enable;
unsigned char sw_rk_green2_en;
unsigned char rg_green2_enable;
unsigned char rnd_green2_enable;
unsigned char ro_green2_enable;
unsigned char lc_green2_enable;
unsigned char pg_green2_enable;
unsigned char sw_rk_red_blue3_en;
unsigned char rg_red_blue3_enable;
unsigned char rnd_red_blue3_enable;
unsigned char ro_red_blue3_enable;
unsigned char lc_red_blue3_enable;
unsigned char pg_red_blue3_enable;
unsigned char sw_rk_green3_en;
unsigned char rg_green3_enable;
unsigned char rnd_green3_enable;
unsigned char ro_green3_enable;
unsigned char lc_green3_enable;
unsigned char pg_green3_enable;
unsigned char sw_mindis1_rb;
unsigned char sw_mindis1_g;
unsigned char line_thr_1_rb;
unsigned char line_thr_1_g;
unsigned char sw_dis_scale_min1;
unsigned char sw_dis_scale_max1;
unsigned char line_mad_fac_1_rb;
unsigned char line_mad_fac_1_g;
unsigned char pg_fac_1_rb;
unsigned char pg_fac_1_g;
unsigned char rnd_thr_1_rb;
unsigned char rnd_thr_1_g;
unsigned char rg_fac_1_rb;
unsigned char rg_fac_1_g;
unsigned char sw_mindis2_rb;
unsigned char sw_mindis2_g;
unsigned char line_thr_2_rb;
unsigned char line_thr_2_g;
unsigned char sw_dis_scale_min2;
unsigned char sw_dis_scale_max2;
unsigned char line_mad_fac_2_rb;
unsigned char line_mad_fac_2_g;
unsigned char pg_fac_2_rb;
unsigned char pg_fac_2_g;
unsigned char rnd_thr_2_rb;
unsigned char rnd_thr_2_g;
unsigned char rg_fac_2_rb;
unsigned char rg_fac_2_g;
unsigned char sw_mindis3_rb;
unsigned char sw_mindis3_g;
unsigned char line_thr_3_rb;
unsigned char line_thr_3_g;
unsigned char sw_dis_scale_min3;
```

```c
typedef struct Adpcc_basic_params_s
{
Adpcc_basic_params_select_t arBasic[DPCC_MAX_ISO_LEVEL];
} Adpcc_basic_params_t;
```

```c
typedef struct Adpcc_bpt_params_s
unsigned char bpt_rb_3x3;
unsigned char bpt_g_3x3;
unsigned char bpt_incl_rb_center;
unsigned char bpt_incl_green_center;
unsigned char bpt_use_fix_set;
unsigned char bpt_use_set_3;
```

```c
unsigned char bpt_use_set_2;
unsigned char bpt_use_set_1;
unsigned char bpt_cor_en;
unsigned char bpt_det_en;
unsigned short int bp_number;
unsigned short int bp_table_addr;
unsigned short int bpt_v_addr;
unsigned short int bpt_h_addr;
unsigned int bp_cnt;
} Adpcc_bpt_params_t;
```

```c
typedef struct dpcc_pdaf_point_s
{
unsigned char y;
unsigned char x;
} dpcc_pdaf_point_t;
```

```c
typedef struct Adpcc_pdaf_params_s
unsigned char sw_pdaf_en;
unsigned char pdaf_point_en[DPCC_PDAF_POINT_NUM];
unsigned short int pdaf_offsety;
unsigned short int pdaf_offsetx;
unsigned char pdaf_wrapy;
unsigned char pdaf_wrapx;
unsigned short int pdaf_wrapy_num;
unsigned short int pdaf_wrapx_num;
dpcc_pdaf_point_t point[DPCC_PDAF_POINT_NUM];
unsigned char pdaf_forward_med;
} Adpcc_pdaf_params_t;
```

```c
typedef struct Adpcc_Auto_Attr_s
{
Adpcc_basic_params_t stBasicParams;
Adpcc_bpt_params_t stBptParams;
Adpcc_pdaf_params_t stPdafParams;
CalibDb_Dpcc_Fast_Mode_t stFastMode;
CalibDb_Dpcc_Sensor_t stSensorDpcc;
Adpcc_basic_params_select_t stBasicSelect;
Adpcc_bpt_params_select_t stBptSelect;
Adpcc_pdaf_params_select_t stPdafSelect;
} Adpcc_Auto_Attr_t;
```

```c
typedef struct Adpcc_Manual_Attr_s
unsigned char enable;
Adpcc_onfly_cfg_t stOnfly;
Adpcc_bpt_params_select_t stBpt;
Adpcc_pdaf_params_select_t stPdaf;
Adpcc_sensor_dpcc_attr_t stSensorDpcc;
} Adpcc_Manual_Attr_t;
```

```c
typedef struct Adpcc_onfly_cfg_s {
Adpcc_onfly_mode_t mode;
Adpcc_fast_mode_attr_t fast_mode;
Adpcc_basic_cfg_params_t expert_mode;
} Adpcc_onfly_cfg_t;
```

```c
typedef enum Adpcc_onfly_mode_e {
ADPCC_ONFLY_MODE_FAST 0,
mode */
ADPCC_ONFLY_MODE_EXPERT = 1,
mode */
ADPCC_ONFLY_MODE_MAX
} Adpcc_onfly_mode_t;
```

```c
typedef struct CalibDb_Dpcc_Pdaf_s
unsigned char en;
unsigned char point_en[16];
unsigned short int offsetx;
unsigned short int offsety;
```

```c
unsigned char wrapx;
unsigned char wrapy;
unsigned short int wrapx_num;
unsigned short int wrapy_num;
unsigned char point_x[16];
unsigned char point_y[16];
unsigned char forward_med;
} CalibDb_Dpcc_Pdaf_t;
```

```c
typedef struct CalibDb_Dpcc_set_PG_s
{
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_PG_t;
```

```c
typedef struct CalibDb_Dpcc_set_RND_s
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_RND_t;
```

```c
typedef struct CalibDb_Dpcc_set_RO_s
{
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_RO_t;
```

```c
typedef struct CalibDb_Dpcc_set_s
{
CalibDb_Dpcc_set_RK_t rk;
CalibDb_Dpcc_set_LC_t lc;
CalibDb_Dpcc_set_PG_t pg;
CalibDb_Dpcc_set_RND_t rnd;
CalibDb_Dpcc_set_RG_t rg;
CalibDb_Dpcc_set_RO_t ro;
} CalibDb_Dpcc_set_t;
```

```c
typedef struct rk_aiq_dpcc_attrib_s
{
AdpccOPMode_t eMode;
Adpcc_Auto_Attr_t stAuto;
Adpcc_Manual_Attr_t stManual;
CalibDb_Dpcc_t stTool;
} rk_aiq_dpcc_attrib_t;
```

```c
XCamReturn
rk_aiq_user_api2_alsc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_lsc_attrib_t attr);
```

```c
XCamReturn
rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_lsc_attrib_t *attr);
```

```c
typedef struct rk_aiq_lsc_table_s {
unsigned short r_data_tbl[LSC_DATA_TBL_SIZE];
unsigned short gr_data_tbl[LSC_DATA_TBL_SIZE];
unsigned short gb_data_tbl[LSC_DATA_TBL_SIZE];
unsigned short b_data_tbl[LSC_DATA_TBL_SIZE];
} rk_aiq_lsc_table_t;
```

```c
typedef enum rkaiq_gic_api_op_mode_e {
RKAIQ_GIC_API_OPMODE_OFF 0,
RKAIQ_GIC_API_OPMODE_AUTO = 1,
RKAIQ_GIC_API_OPMODE_MANUAL = 2,
} rkaiq_gic_api_op_mode_t;
```

```c
typedef struct rkaiq_gic_v2_param_selected_s {
uint32_t iso;
uint8_t bypass;
uint8_t gr_ratio;
uint16_t min_busy_thre;
uint16_t min_grad_thr1;
uint16_t min_grad_thr2;
uint16_t k_grad1;
uint16_t k_grad2;
uint16_t gb_thre;
uint16_t maxCorV;
uint16_t maxCorVboth;
uint16_t dark_thre;
uint16_t dark_threHi;
uint16_t k_grad1_dark;
uint16_t k_grad2_dark;
uint16_t min_grad_thr_dark1;
uint16_t min_grad_thr_dark2;
float NoiseScale;
float NoiseBase;
float noiseCurve_0;
float noiseCurve_1;
float globalStrength;
uint16_t diff_clip;
} rkaiq_gic_v2_param_selected_t;
```

```c
typedef struct rkaiq_gic_v2_api_attr_s {
rk_aiq_uapi_sync_t sync;
uint8_t gic_en;
rkaiq_gic_api_op_mode_t op_mode;
uint32_t iso_cnt;
rkaiq_gic_v2_param_selected_t auto_params[RKAIQ_GIC_MAX_ISO_CNT];
rkaiq_gic_v2_param_selected_t manual_param;
} rkaiq_gic_v2_api_attr_t;
```

```c
typedef struct rk_aiq_uapi_acgc_attrib_s {
rk_aiq_uapi_sync_t sync;
rk_aiq_acgc_params_t param;
} rk_aiq_uapi_acgc_attrib_t;
```

```c
typedef struct __cgc_param {
RKAiqOPMode_t op_mode;
bool cgc_ratio_en;
bool cgc_yuv_limit;
} Cgc_Param_t;
typedef Cgc_Param_t rk_aiq_acgc_params_t;
```

```yaml
sdk: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo
```

```c
typedef struct {
rk_aiq_isp_aec_stats_t aec_stats;
rk_aiq_isp_awb_stats2_v3x_t awb_stats_v3x;
rk_aiq_isp_af_stats_t af_stats;
} rk_aiq_isp_stats_t;
```

```htaccess
RkAiqExpParamComb_t
```

```c
typedef struct RkAiqExpRealParam_s {
float integration_time;
float analog_gain;
float digital_gain;
float isp_dgain;
int iso;
int dcg_mode;
} RkAiqExpRealParam_t;
```

```c
typedef struct RkAiqExpSensorParam_s {
unsigned short fine_integration_time;
unsigned short coarse_integration_time;
unsigned short analog_gain_code_global;
unsigned short digital_gain_global;
unsigned short isp_digital_gain;
RkAial
```

```c
#define MAX_I2CDATA_LEN 64
typedef struct RKAiqExpI2cParam_s {
bool bValid;
unsigned int nNumRegs;
unsigned int RegAddr[MAX_I2CDATA_LEN];
unsigned int AddrByteNum[MAX_I2CDATA_LEN];
unsigned int RegValue[MAX_I2CDATA_LEN];
unsigned int ValueByteNum[MAX_I2CDATA_LEN];
unsigned int DelayFrames[MAX_I2CDATA_LEN];
} RKAiqExpI2cParam_t;
```

```c
typedef struct {
RkAiqPIrisParam_t PIris;
RkAiqDCIrisParam_t DCIris;
} RkAiqIrisParamComb_t;
typedef struct {
int step;
int gain;
bool update;
} RkAiqPIrisParam_t;
typedef struct {
int pwmDuty; //percent value,range = 0-100
bool update;
} RkAiqDCIrisParam_t;
```

```c
struct rawaebig_stat {
unsigned short channelr_xy[RAWAEBIG_WIN_NUM];
unsigned short channelg_xy[RAWAEBIG_WIN_NUM];
unsigned short channelb_xy[RAWAEBIG_WIN_NUM];
unsigned int channely_xy[RAWAEBIG_WIN_NUM]; //not HW!
unsigned long int wndx_sumr[RAWAEBIG_SUBWIN_NUM];
unsigned long int wndx_sumg[RAWAEBIG_SUBWIN_NUM];
unsigned long int wndx_sumb[RAWAEBIG_SUBWIN_NUM];
unsigned short wndx_channelr[RAWAEBIG_SUBWIN_NUM]; //not HW!
unsigned short wndx_channelg[RAWAEBIG_SUBWIN_NUM]; //not HW!
unsigned short wndx_channelb[RAWAEBIG_SUBWIN_NUM]; //not HW!
unsigned char wndx_channely[RAWAEBIG_SUBWIN_NUM]; //not HW!
};
#define RAWAEBIG_WIN_NUM 225
#define RAWAEBIG_SUBWIN_NUM 4
```

```c
struct rawaelite_stat {
unsigned short channelr_xy[RAWAELITE_WIN_NUM];
unsigned short channelg_xy[RAWAELITE_WIN_NUM];
unsigned short channelb_xy[RAWAELITE_WIN_NUM];
unsigned int channely_xy[RAWAELITE_WIN_NUM]; //not HW!
};
#define RAWAELITE_WIN_NUM 25
```

```c
struct rawhist_stat {
unsigned int bins[RAWHIST_BIN_N_MAX];
};
#define RAWHIST_BIN_N_MAX 256
```

```m4
typedef struct rk_aiq_isp_awb_stats2_v3x_s {
//method1
rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
//method2
rk_aiq_awb_stat_blk_res_v201_t blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
//window in pixel domain
rk_aiq_awb_stat_wp_res_light_v201_t
multiwindowLightResult[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
//window in xy or uv domain
rk_aiq_awb_stat_wp_res_v201_t
excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
//wpno histogram
unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
} rk_aiq_isp_awb_stats2_v3x_t;
```

```c
typedef struct {
unsigned int wndb_luma;
unsigned int wndb_sharpness;
unsigned int winb_highlit_cnt;
unsigned int wnda_luma[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_v1[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_v2[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_h1[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_h2[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wina_highlit_cnt[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int int_state;
struct timeval focus_starttim;
struct timeval focus_endtim;
struct timeval zoom_starttim;
struct timeval zoom_endtim;
int64_t sof_tim;
int focusCode;
int zoomCode;
bool focusCorrection;
bool zoomCorrection;
float angleZ;
} rk_aiq_af_algo_stat_v30_t;
```

```cmake
8
9 if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
10 add_definitions(-DBUILD_TYPE_DEBUG)
11 endif()
```

```cmake
8
9 #if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
10 add_definitions(-DBUILD_TYPE_DEBUG)
11 #endif()
```

```typescript
export persist_camera_engine_log=0x1000000ff2
```

```javascript
Cur-Exp: FrmId=270,gain=0x36a,time=0x576,envChange=0,dcg=-1,pirs=0
```

```csv
Framenum=270
Cur
gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=3
4.875557,IsConverged=0
```

```html
================================= HDR-AE
(enter)===============================
```
