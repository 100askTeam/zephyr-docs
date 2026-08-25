---
sidebar_position: 1
---

# Development-Guide-ISP32-Lite-CN

## 前言

## 概述

本文旨在描述RkAiq（Rk Auto Image Quality）模块的作用，整体工作流程，及相关的API接口。主要给使用RkAiq模块进行ISP功能开发的工程师提供帮助。

产品版本\`\`


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3562 | Linux 5.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

ISP模块软件开发工程师

系统集成软件开发工程师

各芯片系统支持状态


| 芯片名称 | BuildRoot | Debian | Yocto | Android |
| --- | --- | --- | --- | --- |
| RK3562 | Y | N | N | N |

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| v1.0.0 | All | 2023-3-2 | ISP3.2-lite 初版 |

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
XCamReturn
rk_aiq_uapi2_sysctl_start(const rk_aiq_sys_ctx_t* ctx);
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
typedef enum {
RK_MODULE_INVAL = 0,
RK_MODULE_DPCC,
RK_MODULE_BLS,
RK_MODULE_LSC,
RK_MODULE_AWB_GAIN,
RK_MODULE_CTK,
RK_MODULE_GOC,
RK_MODULE_SHARP,
RK_MODULE_AE,
RK_MODULE_AWB,
RK_MODULE_NR,
RK_MODULE_GIC,
RK_MODULE_3DLUT,
RK_MODULE_LDCH,
RK_MODULE_TNR,
RK_MODULE_FEC,
RK_MODULE_MAX
}rk_aiq_module_id_t;
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

```javascript
expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
expSwAttr.stManual.HdrAE.TimeValue[0] = 0.002f; /*sframe time = 1/500s*/
expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
expSwAttr.stManual.HdrAE.TimeValue[1] = 0.01f; /*mframe time = 1/100s*/
expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
expSwAttr.stManual.HdrAE.TimeValue[2] = 0.02f; /*lframe time = 1/50s*/
ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

```javascript
//Method One
Uapi_ExpSwAttrV2_t expSwAttr;
ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
//LinearAE
expSwAttr.stManual.LinearAE.ManualGainEn = true;
expSwAttr.stManual.LinearAE.ManualTimeEn = false;
expSwAttr.stManual.LinearAE.ManualIspDgainEn = false;
expSwAttr.stManual.LinearAE.GainValue = 2.0f; /*gain = 2x*/
//HdrAE (need to set all frames)
expSwAttr.stManual.HdrAE.ManualGainEn = true;
```

```javascript
memcpy(expSwAttr.GridWeights.uCoeff, GridWeights,
sizeof(expSwAttr.GridWeights.uCoeff));
//method two:
expSwAttr.stAdvanced.enable = true; //important! true means preferring to use
these parameters
memcpy(expSwAttr.stAdvanced.GridWeights, GridWeights,
sizeof(expSwAttr.stAdvanced.GridWeights));
ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

```asm
Uapi_HdrAeRouteAttr_t stHdrRoute;
memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
int len = 6;
float HdrTimeDot[3][6] = {0.0, 0.01, 0.01, 0.01, 0.01, 0.01,
0.0, 0.02, 0.02, 0.02, 0.02, 0.02,
0.0, 0.03, 0.03, 0.03, 0.03, 0.03};
float HdrGainDot[3][6] = {1, 1, 4, 6, 8, 12,
1, 1, 4, 6, 8, 12,
1, 1, 4, 6, 8, 12};
float HdrIspDGainDot[3][6] = {1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1};
int HdrPIrisGainDot[6] = {1, 1, 1, 1, 1, 1};
stHdrRoute.Frm0TimeDot_len = len;
stHdrRoute.Frm0GainDot_len = len;
stHdrRoute.Frm0IspDGainDot_len = len;
stHdrRoute.Frm1TimeDot_len = len;
stHdrRoute.Frm1GainDot_len = len;
stHdrRoute.Frm1IspDGainDot_len = len;
stHdrRoute.Frm2TimeDot_len = len;
stHdrRoute.Frm2GainDot_len = len;
stHdrRoute.Frm2IspDGainDot_len = len;
stHdrRoute.PIrisDot_len = len;
stHdrRoute.Frm0TimeDot = HdrTimeDot[0];
stHdrRoute.Frm0GainDot = HdrGainDot[0];
stHdrRoute.Frm0IspDGainDot = HdrIspDGainDot[0];
stHdrRoute.Frm1TimeDot = HdrTimeDot[1];
stHdrRoute.Frm1GainDot = HdrGainDot[1];
stHdrRoute.Frm1IspDGainDot = HdrIspDGainDot[1];
stHdrRoute.Frm2TimeDot = HdrTimeDot[2];
stHdrRoute.Frm2GainDot = HdrGainDot[2];
stHdrRoute.Frm2IspDGainDot = HdrIspDGainDot[2];
stHdrRoute.PIrisDot = HdrPIrisGainDot;
ret = rk_aiq_user_api2_ae_setHdrAeRouteAttr(ctx,stHdrRoute);
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
```

```c
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
typedef struct rk_aiq_uapiV2_wbV32_awb_mulWindow_s {
rk_aiq_uapi_sync_t sync;
bool enable;
float window[4][4];
} rk_aiq_uapiV2_wbV32_awb_mulWindow_t;
```

```c
typedef struct rk_aiq_uapiV2_wbV32_awb_attrib_s {
rk_aiq_uapiV2_wb_awb_wbGainAdjust_t wbGainAdjust;
CalibDbV2_Awb_gain_offset_cfg_t wbGainOffset;
rk_aiq_uapiV2_wbV32_awb_mulWindow_t multiWindow;
} rk_aiq_uapiV2_wbV32_awb_attrib_t;
```

```c
typedef struct rk_aiq_uapiV2_wbV32_attrib_s {
rk_aiq_uapi_sync_t sync;
bool byPass;
rk_aiq_wb_op_mode_t mode;
rk_aiq_wb_mwb_attrib_t stManual;
rk_aiq_uapiV2_wbV32_awb_attrib_t stAuto;
} rk_aiq_uapiV2_wbV32_attrib_t;
```

```c
XCamReturn
rk_aiq_user_api2_awb_SetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
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
XCamReturn rk_aiq_uapi2_getSearchResult(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_af_result_t* result);
```

```c
XCamReturn rk_aiq_uapi2_endOpZoomChange(const rk_aiq_sys_ctx_t* ctx);
```

```c
XCamReturn rk_aiq_uapi2_getFocusRange(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_af_focusrange* range);
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
XCamReturn
rk_aiq_user_api2_af_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_af_attrib_t *attr);
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

```sql
typedef enum _RKAIQ_AF_HWVER
RKAIQ_AF_HW_V20 = 0,
RKAIQ_AF_HW_V30,
RKAIQ_AF_HW_V31,
RKAIQ_AF_HW_V32_LITE,
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
unsigned char viir_en;
unsigned char v1_fv_outmode; // 0 square, 1 absolute
unsigned char v2_fv_outmode; // 0 square, 1 absolute
unsigned char h1_fv_outmode; // 0 square, 1 absolute
unsigned char h2_fv_outmode; // 0 square, 1 absolute
unsigned char ldg_en;
unsigned char accu_8bit_mode;
unsigned char ae_mode;
unsigned char y_mode;
unsigned char vldg_sel;
unsigned char sobel_sel;
unsigned char v_dnscl_mode;
unsigned char from_awb;
unsigned char from_ynr;
unsigned char ae_config_use;
unsigned char ae_sel;
unsigned char from_bnr;
unsigned char bnrin_shift;
unsigned char hiir_left_border_mode;
unsigned char avg_ds_en;
```

```c
unsigned char avg_ds_mode;
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
char gaus_coe[9];
/**********[Vertical IIR (v1 & v2)]************/
short v1_iir_coe[3];
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
unsigned char hldg_dilate_num;
// coring
unsigned short v_fv_thresh;
unsigned short h_fv_thresh;
unsigned short v_fv_limit;
unsigned short v_fv_slope;
unsigned short h_fv_limit;
```

```c
unsigned short h_fv_slope;
// left shift, more needed if outmode=square
unsigned char v1_fv_shift; //only for sel1
unsigned char v2_fv_shift;
unsigned char h1_fv_shift;
unsigned char h2_fv_shift;
// acc mode
unsigned char v1_acc_mode;
unsigned char v2_acc_mode;
unsigned char h1_acc_mode;
unsigned char h2_acc_mode;
/**********[High light]**********/
unsigned short highlit_thresh;
// bls for af
unsigned char bls_en;
short bls_offset;
} rk_aiq_af_algo_meas_v32_t;
```

```c
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
rk_aiq_af_algo_meas_v31_t manual_meascfg_v31;
rk_aiq_af_algo_meas_v32_t manual_meascfg_v32;
};
rk_aiq_af_attrib_t;
```

```c
XCamReturn
rk_aiq_user_api2_amerge_v12_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
mergeAttrV12_t* attr);
```

```c
typedef enum merge_OpModeV21_e {
MERGE_OPMODE_AUTO = 0,
MERGE_OPMODE_MANUAL = 1,
} merge_OpModeV21_t;
```

```c
typedef struct mLongFrameModeDataV12_s {
bool EnableEachChn;
mMergeOECurveV10_t OECurve;
mMergeMDCurveV10_t MDCurve;
mMergeEachChnCurveV12_t EachChnCurve;
} mLongFrameModeDataV12_t;
```

```c
typedef struct mMergeMDCurveV11Short_s{
float Coef;
float ms_thd0;
float lm_thd0;
} mMergeMDCurveV11Short_t;
```

```c
typedef struct mShortFrameModeData_s {
mMergeOECurveV10_t OECurve;
mMergeMDCurveV11Short_t MDCurve;
} mShortFrameModeData_t;
```

```c
typedef struct mMergeAttrV12_s {
MergeBaseFrame_t BaseFrm;
mLongFrameModeDataV12_t LongFrmModeData;
mShortFrameModeData_t ShortFrmModeData;
} mMergeAttrV12_t;
```

```javascript
} LongFrameModeDataV12_t;
```

```c
typedef struct CalibDbV2_merge_V12_s {
MergeBaseFrame_t BaseFrm;
float ByPassThr;
LongFrameModeDataV12_t LongFrmModeData;
ShortFrameModeData_t ShortFrmModeData;
} CalibDbV2_merge_V12_t;
```

```c
typedef enum drc_OpMode_e {
DRC_OPMODE_AUTO = 0,
DRC_OPMODE_MANUAL = 1,
} drc_OpMode_t;
```

```c
typedef struct mDrcGain_s {
float DrcGain;
float Alpha;
float Clip;
} mDrcGain_t;
```

```javascript
mdrcAttr_v12_lite_t
```

```c
typedef struct CalibDbV2_drc_v12_lite_ {
CalibDbV2_Adrc_v12_lite_t DrcTuningPara;
} CalibDbV2_drc_v12_lite_t;
```

```c
typedef struct DrcInfoV12Lite_s {
DrcInfo_t CtrlInfo;
mdrcAttr_v12_lite_t ValidParams;
} DrcInfoV12Lite_t;
```

```c
typedef struct drcAttrV12_s {
rk_aiq_uapi_sync_t sync;
drc_OpMode_t opMode;
CalibDbV2_drc_V12_t stAuto;
mdrcAttr_V12_t stManual;
DrcInfoV12_t Info;
} drcAttrV12_t;
```

```c
XCamReturn rk_aiq_uapi2_setNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

```c
XCamReturn
rk_aiq_user_api2_abayertnrV23Lite_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_bayertnr_attrib_v23L_t* attr);
```

```c
XCamReturn
rk_aiq_user_api2_abayertnrV23_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_bayertnr_strength_v23_t *pStrength);
```

```c
XCamReturn
rk_aiq_user_api2_aynrV22_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_ynr_attrib_v22_t* attr);
```

```c
XCamReturn
rk_aiq_user_api2_aynrV22_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_ynr_attrib_v22_t* attr);
```

```c
XCamReturn
rk_aiq_user_api2_aynrV22_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_ynr_strength_v22_t* pStrength);
```

```c
XCamReturn
rk_aiq_user_api2_aynrV22_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_ynr_strength_v22_t* pStrength);
```

```c
XCamReturn
rk_aiq_user_api2_acnrV30_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_cnr_attrib_v30_t* attr);
```

```c
XCamReturn
rk_aiq_user_api2_acnrV30_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_cnr_strength_v30_t *pStrength);
```

```c
typedef struct rk_aiq_bayertnr_attrib_v23L_s {
rk_aiq_uapi_sync_t sync;
Abayertnr_OPMode_V23_t eMode;
Abayertnr_Auto_Attr_V23L_t stAuto;
Abayertnr_Manual_Attr_V23L_t stManual;
} rk_aiq_bayertnr_attrib_v23L_t;
```

```c
typedef struct Abayertnr_Manual_Attr_V23L_s {
RK_Bayertnr_Param_V23L_Select_t st3DSelect;
RK_Bayertnr_Fix_V23_t st3DFix;
} Abayertnr_Manual_Attr_V23L_t;
```

```c
typedef struct RK_Bayertnr_Params_V23L_s {
bool enable;
float iso[RK_BAYERNR_V23_MAX_ISO_NUM];
RK_Bayertnr_Param_V23L_Select_t
bayertnrParamISO[RK_BAYERNR_V23_MAX_ISO_NUM];
} RK_Bayertnr_Params_V23L_t;
```

```c
typedef struct RK_Bayertnr_Param_V23L_Select_s
{
int enable;
//calib
int lumapoint[16];
int sigma[16];
int lumapoint2[16];
int lo_sigma[16];
int hi_sigma[16];
//tuning
int thumbds_w;
int thumbds_h;
int lo_enable;
int hi_enable;
int lo_gsbay_en;
int lo_gslum_en;
int hi_gslum_en;
int trans_en;
```

```c
typedef struct RK_Bayertnr_Fix_V23_s {
/* BAY3D_CTRL */
uint8_t soft_st;
uint8_t soft_mode;
uint8_t bay3d_en;
```

```c
uint8_t bypass_en;
uint8_t hibypass_en;
uint8_t lobypass_en;
uint8_t himed_bypass_en;
uint8_t higaus_bypass_en;
uint8_t hiabs_possel;
uint8_t hichnsplit_en;
uint8_t lomed_bypass_en;
uint8_t logaus5_bypass_en;
uint8_t logaus3_bypass_en;
uint8_t glbpk_en;
uint8_t loswitch_protect;
uint8_t bwsaving_en;
/* BAY3D_KALRATIO */
uint16_t softwgt;
uint16_t hidif_th;
/* BAY3D_GLBPK2 */
uint32_t glbpk2;
/* BAY3D_CTRL1 */
uint8_t hiwgt_opt_en;
uint8_t hichncor_en;
uint8_t bwopt_gain_dis;
uint8_t lo4x8_en;
uint8_t lo4x4_en;
uint8_t hisig_ind_sel;
uint8_t pksig_ind_sel;
uint8_t iirwr_rnd_en;
uint8_t curds_high_en;
uint8_t higaus3_mode;
uint8_t higaus5x5_en;
uint8_t wgtmix_opt_en;
/*isp32 lite*/
uint8_t wgtmm_opt_en;
uint8_t wgtmm_sel_en;
/* BAY3D_WGTLMT */
uint16_t wgtlmt;
uint16_t wgtratio;
/* BAY3D_SIG */
uint16_t sig0_x[16];
uint16_t sig0_y[16];
uint16_t sig1_x[16];
uint16_t sig1_y[16];
uint16_t sig2_y[16];
/*isp32 lite*/
uint16_t wgtmin;
/* BAY3D_HISIGRAT */
uint16_t hisigrat0;
```

```c
uint16_t hisigrat1;
/* BAY3D_HISIGOFF */
uint16_t hisigoff0;
uint16_t hisigoff1;
/* BAY3D_LOSIG */
uint16_t losigoff;
uint16_t losigrat;
/* BAY3D_SIGPK */
uint16_t rgain_off;
uint16_t bgain_off;
/* BAY3D_SIGGAUS */
uint8_t siggaus0;
uint8_t siggaus1;
uint8_t siggaus2;
uint8_t siggaus3;
} RK_Bayertnr_Fix_V23_t;
```

```c
typedef struct rk_aiq_ynr_attrib_v22_s {
rk_aiq_uapi_sync_t sync;
Aynr_OPMode_V22_t eMode;
Aynr_Auto_Attr_V22_t stAuto;
Aynr_Manual_Attr_V22_t stManual;
} rk_aiq_ynr_attrib_v22_t;
```

```c
typedef enum Aynr_OPMode_V3_e {
AYNRV22_OP_MODE_INVALID = 0,
AYNRV22_OP_MODE_AUTO = 1,
AYNRV22_OP_MODE_MANUAL = 2,
AYNRV22_OP_MODE_REG_MANUAL = 3,
AYNRV22_OP_MODE_MAX
} Aynr_OPMode_V22_t;
```

```c
typedef struct Aynr_Auto_Attr_V22_s
RK_YNR_Params_V22_t stParams;
RK_YNR_Params_V22_Select_t stSelect;
} Aynr_Auto_Attr_V22_t;
```

```c
typedef struct Aynr_Manual_Attr_V22_s
{
RK_YNR_Params_V22_Select_t stSelect;
RK_YNR_Fix_V22_t stFix;
} Aynr_Manual_Attr_V22_t;
```

```c
typedef struct RK_YNR_Params_V22_s
{
int enable;
char version[64];
float iso[RK_YNR_V22_MAX_ISO_NUM];
RK_YNR_Params_V22_Select_t arYnrParamsISO[RK_YNR_V22_MAX_ISO_NUM];
} RK_YNR_Params_V22_t;
```

```c
typedef struct RK_YNR_Params_V22_Select_s
{
int enable;
float lci;
float hci;
float sigma[YNR_V22_ISO_CURVE_POINT_NUM];
short lumaPoint[YNR_V22_ISO_CURVE_POINT_NUM];
float lo_lumaPoint[6];
float lo_ratio[6];
float hi_lumaPoint[6];
float hi_ratio[6];
//local gain control
float ynr_global_gain_alpha;
float ynr_global_gain;
float ynr_adjust_thresh;
float ynr_adjust_scale;
// low frequency
float rnr_strength[17];
int ynr_bft3x3_bypass;
int ynr_lbft5x5_bypass;
```

```c
int ynr_lgft3x3_bypass;
int ynr_flt1x1_bypass;
int ynr_nlm11x11_bypass;
float low_bf1;
float low_bf2;
float low_thred_adj;
float low_peak_supress;
float low_edge_adj_thresh;
float low_lbf_weight_thresh;
float low_center_weight;
float low_dist_adj;
float low_weight;
float low_filt1_strength;
float low_filt2_strength;
float low_bi_weight;
// high frequency
float hi_weight_offset;
float hi_center_weight;
float hi_bf_scale;
float hi_min_sigma;
float hi_nr_weight;
float hi_gain_alpha;
int hi_filter_coeff1_1;
int hi_filter_coeff1_2;
int hi_filter_coeff1_3;
int hi_filter_coeff2_1;
int hi_filter_coeff2_2;
int hi_filter_coeff2_3;
} RK_YNR_Params_V22_Select_t;
```

```c
typedef struct RK_YNR_Fix_V22_s {
/* YNR_GLOBAL_CTRL */
uint8_t rnr_en;
uint8_t gate_dis;
uint8_t thumb_mix_cur_en;
uint8_t global_gain_alpha;
uint16_t global_gain;
uint8_t flt1x1_bypass_sel;
uint8_t nlm11x11_bypass;
uint8_t flt1x1_bypass;
uint8_t lgft3x3_bypass;
uint8_t lbft5x5_bypass;
uint8_t bft3x3_bypass;
uint8_t ynr_en;
/* YNR_RNR_MAX_R */
uint16_t rnr_max_r;
uint16_t local_gainscale;
/* YNR_RNR_CENTER_COOR */
```

```c
uint16_t rnr_center_coorh;
uint16_t rnr_center_coorv;
/* YNR_LOCAL_GAIN_CTRL */
uint16_t localgain_adj_thresh;
uint16_t localgain_adj;
/* YNR_LOWNR_CTRL0 */
uint16_t low_bf_inv1;
uint16_t low_bf_inv0;
/* YNR_LOWNR_CTRL1 */
uint16_t low_peak_supress;
uint16_t low_thred_adj;
/* YNR_LOWNR_CTRL2 */
uint16_t low_dist_adj;
uint16_t low_edge_adj_thresh;
/* YNR_LOWNR_CTRL3 */
uint16_t low_bi_weight;
uint16_t low_weight;
uint16_t low_center_weight;
/* YNR_LOWNR_CTRL4 */
uint16_t frame_full_size;
uint16_t lbf_weight_thres;
/* YNR_GAUSS1_COEFF */
uint16_t low_gauss1_coeff2;
uint16_t low_gauss1_coeff1;
uint16_t low_gauss1_coeff0;
/* YNR_GAUSS2_COEFF */
uint16_t low_gauss2_coeff2;
uint16_t low_gauss2_coeff1;
uint16_t low_gauss2_coeff0;
/* YNR_SGM_DX */
uint16_t luma_points_x[17];
/* YNR_LSGM_Y */
uint16_t lsgm_y[17];
/* YNR_RNR_STRENGTH */
uint8_t rnr_strength[17];
/* YNR_NLM_SIGMA_GAIN */
uint16_t nlm_min_sigma;
uint8_t nlm_hi_gain_alpha;
uint16_t nlm_hi_bf_scale;
/* YNR_NLM_COE */
uint8_t nlm_coe_0;
uint8_t nlm_coe_1;
uint8_t nlm_coe_2;
```

```c
uint8_t nlm_coe_3;
uint8_t nlm_coe_4;
uint8_t nlm_coe_5;
/* YNR_NLM_WEIGHT */
uint32_t nlm_center_weight;
uint16_t nlm_weight_offset;
/* YNR_NLM_NR_WEIGHT */
uint16_t nlm_nr_weight;
} RK_YNR_Fix_V22_t;
```

```c
typedef struct rk_aiq_ynr_strength_v22_s {
rk_aiq_uapi_sync_t sync;
float percent;
bool strength_enable;
} rk_aiq_ynr_strength_v22_t;
```

```c
typedef struct rk_aiq_cnr_attrib_v30_s {
rk_aiq_uapi_sync_t sync;
AcnrV30_OPMode_t eMode;
Acnr_Auto_Attr_V30_t stAuto;
Acnr_Manual_Attr_V30_t stManual;
} rk_aiq_cnr_attrib_v30_t;
```

```c
typedef enum AcnrV30_OPMode_e {
ACNRV30_OP_MODE_INVALID = 0,
ACNRV30_OP_MODE_AUTO = 1,
ACNRV30_OP_MODE_MANUAL 2,
ACNRV30_OP_MODE_REG_MANUAL = 3,
ACNRV30_OP_MODE_MAX
} AcnrV30_OPMode_t;
```

```c
typedef struct Acnr_Auto_Attr_V30_s
{
//all ISO params and select param
RK_CNR_Params_V30_t stParams;
RK_CNR_Params_V30_Select_t stSelect;
} Acnr_Auto_Attr_V30_t;
```

```c
typedef struct Acnr_Manual_Attr_V30_s
{
RK_CNR_Params_V30_Select_t stSelect;
RK_CNR_Fix_V30_t stFix;
} Acnr_Manual_Attr_V30_t;
```

```c
typedef struct RK_CNR_Params_V30_Select_s
{
bool enable;
uint8_t down_scale_x;
uint8_t down_scale_y;
float thumb_sigma;
float thumb_bf_ratio;
float chroma_filter_strength;
float chroma_filter_wgt_clip;
float anti_chroma_ghost;
float chroma_filter_uv_gain;
float wgt_slope;
float gaus_ratio;
float bf_sigmaR;
float bf_uvgain;
```

```c
typedef struct RK_CNR_Fix_V30_s {
/* CNR_CTRL */
uint8_t cnr_en;
uint8_t exgain_bypass;
uint8_t yuv422_mode;
uint8_t thumb_mode;
uint8_t bf3x3_wgt0_sel;
/* CNR_EXGAIN */
uint8_t gain_iso;
uint8_t global_gain_alpha;
uint16_t global_gain;
/* CNR_THUMB1 */
uint16_t thumb_sigma_c;
uint16_t thumb_sigma_y;
/* CNR_THUMB_BF_RATIO */
uint16_t thumb_bf_ratio;
/* CNR_LBF_WEITD */
uint8_t lbf1x7_weit_d[4];
/* CNR_IIR_PARA1 */
uint8_t iir_uvgain;
```

```c
uint8_t iir_strength;
uint8_t exp_shift;
uint16_t wgt_slope;
/* CNR_IIR_PARA2 */
uint8_t chroma_ghost;
uint8_t iir_uv_clip;
/* CNR_GAUS_COE */
uint8_t gaus_coe[6];
/* CNR_GAUS_RATIO */
uint16_t gaus_ratio;
uint8_t bf_wgt_clip;
uint16_t global_alpha;
/* CNR_BF_PARA1 */
uint8_t uv_gain;
uint16_t sigma_r;
uint8_t bf_ratio;
/* CNR_BF_PARA2 */
uint16_t adj_offset;
uint16_t adj_ratio;
/* CNR_SIGMA */
uint8_t sigma_y[13];
/* CNR_IIR_GLOBAL_GAIN */
uint8_t iir_gain_alpha;
uint8_t iir_global_gain;
} RK_CNR_Fix_V30_t;
```

```c
typedef struct rk_aiq_cnr_strength_v30_s {
rk_aiq_uapi_sync_t sync;
float percent;
bool strength_enable;
} rk_aiq_cnr_strength_v30_t;
```

```c
XCamReturn
rk_aiq_user_api2_ablcV32_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, const
rk_aiq_blc_attrib_V32_t *attr)
```

```c
typedef struct rk_aiq_blc_attrib_V32_s {
rk_aiq_uapi_sync_t sync;
AblcOPMode_V32_t eMode;
AblcParams_V32_t stBlc0Auto;
AblcParams_V32_t stBlc1Auto;
AblcOBParams_V32_t stBlcOBAuto;
AblcManualAttr_V32_t stBlc0Manual;
AblcManualAttr_V32_t stBlc1Manual;
AblcManualOBAttr_V32_t stBlcOBManual;
} rk_aiq_blc_attrib_V32_t;
```

```c
typedef enum AblcOPMode_V32_e {
ABLC_V32_OP_MODE_OFF = 0,
ABLC_V32_OP_MODE_AUTO = 1,
ABLC_V32_OP_MODE_MANUAL = 2,
ABLC_V32_OP_MODE_MAX
} AblcOPMode_V32_t;
```

```c
typedef struct AblcParams_V32_s {
bool enable;
int len;
float* iso;
float* blc_r;
float* blc_gr;
float* blc_gb;
float* blc_b;
} AblcParams_V32_t;
```

```c
typedef struct AblcOBSelect_V32_s {
bool enable;
float ob_offset;
float ob_predgain;
} AblcOBSelect_V32_t;
typedef AblcOBSelect_V32_t AblcManualOBAttr_V32_t;
```

```c
typedef enum dehaze_api_mode_e {
DEHAZE_API_AUTO = 0,
DEHAZE_API_MANUAL = 1,
} dehaze_api_mode_t;
```

```c
typedef struct Hist_setting_V11_s {
bool en;
bool hist_para_en;
HistDataV11_t HistData;
} Hist_setting_V11_t;
```

```c
typedef struct mEnhance_setting_v12_s {
bool en;
bool color_deviate_en;
bool enh_luma_en;
float enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
float enh_luma[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
mEnhanceDataV11_t EnhanceData;
} mEnhance_setting_v12_t;
```

```c
typedef struct mHist_setting_v11_s {
bool en;
bool hist_para_en;
mHistDataV11_t HistData;
} mHist_setting_v11_t;
```

```perl
typedef struct mDehazeAttrV12_s {
bool Enable;
float cfg_alpha;
mDehaze_setting_v11_t dehaze_setting;
mEnhance_setting_v12_t enhance_setting;
mHist_setting_v11_t hist_setting;
} mDehazeAttrV12_t;
```

```javascript
mDehazeAttrInfoV11_t
```

```c
typedef struct adehaze_sw_v12_s {
rk_aiq_uapi_sync_t sync;
dehaze_api_mode_t mode;
CalibDbV2_dehaze_v12_t stAuto;
mDehazeAttrV12_t stManual;
mDehazeAttrInfoV11_t Info;
} adehaze_sw_v12_t;
```

```c
typedef struct acp_attrib_s {
uint8_t brightness;
uint8_t contrast;
uint8_t saturation;
uint8_t hue;
} acp_attrib_t;
```

```c
XCamReturn rk_aiq_user_api2_aie_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
aie_attrib_t* attr);
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
rk_aiq_user_api2_asharpV33LT_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_sharp_attrib_v33LT_t* attr);
```

```c
XCamReturn
rk_aiq_user_api_asharpV33_GetInfo(const rk_aiq_sys_ctx_t* sys_ctx,
rk_aiq_sharp_info_v33_t* pInfo)
```

```c
typedef struct rk_aiq_sharp_attrib_v33LT_s {
rk_aiq_uapi_sync_t sync;
Asharp_OPMode_V33_t eMode;
Asharp_Auto_Attr_V33LT_t stAuto;
Asharp_Manual_Attr_V33LT_t stManual;
} rk_aiq_sharp_attrib_v33LT_t;
```

```c
typedef struct Asharp_Manual_Attr_V33LT_s {
RK_SHARP_Params_V33LT_Select_t stSelect;
RK_SHARP_Fix_V33_t stFix;
} Asharp_Manual_Attr_V33LT_t;
```

```c
typedef struct rk_aiq_sharp_strength_v33_s {
rk_aiq_uapi_sync_t sync;
float percent;
bool strength_enable;
} rk_aiq_sharp_strength_v33_t;
```

```c
typedef struct rk_aiq_sharp_info_v33_s {
rk_aiq_uapi_sync_t sync;
int iso;
Asharp_ExpInfo_V33_t expo_info;
} rk_aiq_sharp_info_v33_t;
```

```c
for(int i = 0; i < 49; i++) {
gamma_Y_v11[i] = 4095 * pow(gamma_Y_v11[i] / 4095, 1 / GammaCoef +
SlopeAtZero);
gamma_Y_v11[i] = LIMIT_VALUE(gamma_Y_v11[i], 4095, 0);
}
```

```c
typedef enum rk_aiq_gamma_op_mode_s {
RK_AIQ_GAMMA_MODE_AUTO = 0,
RK_AIQ_GAMMA_MODE_MANUAL = 1,
} rk_aiq_gamma_op_mode_t;
```

```c
typedef struct AgammaApiManualV11_s {
bool Gamma_en;
uint16_t Gamma_out_offset;
uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V11];
} AgammaApiManualV11_t;
```

```c
typedef struct CalibDbGammaV11_s {
bool Gamma_en;
uint16_t Gamma_out_offset;
uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V11];
} CalibDbGammaV11_t;
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
typedef struct rk_aiq_ccm_mccm_attrib_v2_s {
float ccMatrix[9];
float ccOffsets[3];
bool highy_adj_en;
bool asym_enable;
float bound_pos_bit;
float right_pos_bit;
float y_alpha_curve[CCM_CURVE_DOT_NUM_V2];
unsigned short enh_adj_en;
unsigned char enh_rgb2y_para[3];
float enh_rat_max;
} rk_aiq_ccm_mccm_attrib_v2_t;
```

```c
typedef struct rk_aiq_ccm_v2_attrib_s {
rk_aiq_uapi_sync_t sync;
bool byPass;
rk_aiq_ccm_op_mode_t mode;
rk_aiq_ccm_mccm_attrib_v2_t stManual;
rk_aiq_ccm_accm_attrib_t stAuto;
} rk_aiq_ccm_v2_attrib_t;
```

```c
XCamReturn rk_aiq_uapi2_getM3dLut(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_lut3d_table_t *mlut);
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
typedef struct rk_aiq_ldch_cfg_s {
rk_aiq_uapi_sync_t sync;
unsigned int en;
int correct_level;
} rk_aiq_ldch_cfg_t;
```

```c
typedef enum rk_aiq_debayer_op_mode_s {
RK_AIQ_DEBAYER_MODE_INVALID = 0, /**<
initialization value */
RK_AIQ_DEBAYER_MODE_MANUAL = 1, /**< run manual
lens shading correction */
RK_AIQ_DEBAYER_MODE_AUTO = 2, /**< run auto
lens shading correction */
RK_AIQ_DEBAYER_MODE_MAX
} rk_aiq_debayer_op_mode_t;
```

```c
typedef CalibDbV2_Debayer_Tuning_t adebayer_attrib_v2_auto_t;
typedef struct CalibDbV2_Debayer_Tuning_s {
bool debayer_en;
int lowfreq_filter1[4];
int highfreq_filter2[4];
int c_alpha_gaus_coe[3];
int c_guid_gaus_coe[3];
int c_ce_gaus_coe[3];
CalibDbV2_Debayer_GInterp_t g_interp;
CalibDbV2_Debayer_GDirectWgt_t g_drctwgt;
CalibDbV2_Debayer_GFilter_t g_filter;
CalibDbV2_Debayer_CFilter_t c_filter;
} CalibDbV2_Debayer_Tuning_t;
```

```c
typedef enum AdpccOPMode_e {
ADPCC_OP_MODE_INVALID = 0,
ADPCC_OP_MODE_AUTO = 1,
ADPCC_OP_MODE_MANUAL = 2,
ADPCC_OP_MODE_TOOL = 3,
ADPCC_OP_MODE_MAX
} AdpccOPMode_t;
```

```vhdl
typedef struct Adpcc_basic_params_select_s
{
int iso;
unsigned char stage1_enable;
unsigned char grayscale_mode;
unsigned char enable;
unsigned char sw_rk_out_sel;
unsigned char sw_dpcc_output_sel;
unsigned char stage1_rb_3x3;
unsigned char stage1_g_3x3;
unsigned char stage1_incl_rb_center;
unsigned char stage1_incl_green_center;
unsigned char stage1_use_fix_set;
unsigned char stage1_use_set_3;
unsigned char stage1_use_set_2;
unsigned char stage1_use_set_1;
unsigned char sw_rk_red_blue1_en;
unsigned char rg_red_blue1_enable;
unsigned char rnd_red_blue1_enable;
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
Adpcc_basic_params_t stBasicParams;
Adpcc_bpt_params_t stBptParams;
Adpcc_pdaf_params_t stPdafParams;
CalibDb_Dpcc_Fast_Mode_t stFastMode;
CalibDb_Dpcc_Sensor_t stSensorDpcc;
Adpcc_basic_params_select_t stBasicSelect;
Adpcc_bpt_params_select_t stBptSelect;
Adpcc_pdaf_params_select_t stPdafSelect;
```

```c
typedef struct Adpcc_fast_mode_attr_s
{
bool fast_mode_en;
bool fast_mode_single_en;
int fast_mode_single_level;
bool fast_mode_double_en;
int fast_mode_double_level;
bool fast_mode_triple_en;
int fast_mode_triple_level;
} Adpcc_fast_mode_attr_t;
```

```ignorefile
Adpcc_onfly_mode_t
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
ADPCC_ONFLY_MODE_FAST = 0, /**< dpcc manual fast
mode */
ADPCC_ONFLY_MODE_EXPERT = 1, /**< dpcc manual expert
mode */
ADPCC_ONFLY_MODE_MAX /**< max */
} Adpcc_onfly_mode_t;
```

```c
typedef struct CalibDb_Dpcc_Pdaf_s
unsigned char en;
unsigned char point_en[16];
unsigned short int offsetx;
unsigned short int offsety;
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
typedef struct CalibDb_Dpcc_Expert_Mode_s
{
float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_Enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char grayscale_mode;
unsigned char rk_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
```

```c
typedef enum rk_aiq_lsc_op_mode_s {
RK_AIQ_LSC_MODE_INVALID = 0, /**< initialization
value */
RK_AIQ_LSC_MODE_MANUAL = 1, /**< run manual lens
shading correction */
RK_AIQ_LSC_MODE_AUTO = 2, /**< run auto lens
shading correction */
RK_AIQ_LSC_MODE_MAX
} rk_aiq_lsc_op_mode_t;
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

```c
typedef struct rk_aiq_awb_stat_res_v32_s {
rk_aiq_awb_stat_wp_res_light_v201_t
light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM_V32];
int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM_V32];
rk_aiq_awb_stat_blk_res_v201_t blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
//window in xy or uv domain
rk_aiq_awb_stat_wp_res_v201_t
excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
//wpno histogram
unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
} rk_aiq_awb_stat_res_v32_t;
```

```c
typedef struct {
unsigned int wndb_luma;
unsigned int wndb_sharpness;
unsigned int winb_highlit_cnt;
unsigned int wnda_luma[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_v1[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_v2[RKAIQ_RAWAF_SUMDATA_NUM];
```

```c
unsigned int wnda_fv_h1[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wnda_fv_h2[RKAIQ_RAWAF_SUMDATA_NUM];
unsigned int wina_highlit_cnt[RKAIQ_RAWAF_SUMDATA_NUM];
int comp_bls;
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
} rk_aiq_af_algo_stat_v3x_t;
```

```json
{
"name": "day",
"ae_calib": {
"enable": true,
"value": 1.4
},
"af_calib": {
"enable": true,
"value": 1.4
},
"awb_calib": {
"enable": true,
"value": 1.4
},
"colorAsGrey": {
"enable": false,
"value": 1.4
}
}
```

```jsonl
"name": "night",
"ae_calib": {
"enable": true,
"value": 1.2
},
"af_calib": {
"enable": true,
"value": 1.4
},
"awb_calib": {
"enable": false,
"value": 1.4
},
"colorAsGrey": {
"enable": true,
"value": 1.4
}
```

```json
{
"name": "night",
"ae_calib": {
"value": 1.2
},
"awb_calib": {
"enable": false
},
"colorAsGrey": {
"enable": true
}
}
```

```shell
# 进入转换工具源码路径
cd tool/j2s4b/
# 执行转换工具编译脚本
./build.sh
```

```c
rk_smart_ir_ctx_t* rk_smart_ir_init(const rk_aiq_sys_ctx_t* ctx)
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
Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L-gain=0x0,L
time=0x0
```

```html
================================= HDR-AE
(enter)===============================
```
