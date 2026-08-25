---
sidebar_position: 1
---

# Rockchip Developement Guide ISP21

## 前言

## 概述

本文旨在描述RkAiq（Rk Auto Image Quality）模块的作用，整体工作流程，及相关的API接口。主要给

使用RkAiq模块进行ISP功能开发的工程师提供帮助。

产品版本\`\`


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3566/RK3568 | Linux 4.19 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

ISP模块软件开发工程师

系统集成软件开发工程师

各芯片系统支持状态


|  |  |  |  |  |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
|  |  |  |  |  |

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| v2.0.0 | 吴炳阳 | 2021-07-05 | 更新RK356X ISP21 API |
| v2.1.0 | 朱林靖欧阳亚凤李仁奎武强 | 2021-07-06 | 1.修改AE API参数描述2. 增加NR / Merge / DRC /Sharp模块API说明3. 增加FAQ中关于XML转换JSON的说明 |
| v2.1.1 | 朱林靖 | 2021-12-06 | AE模块api修改/补充说明 |

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
XCamReturn
rk_aiq_uapi2_sysctl_stop(const rk_aiq_sys_ctx_t* ctx);
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

```asm
Uapi_HdrAeRouteAttr_t stHdrRoute;
memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
int len = 6;
float HdrTimeDot[3][6] = {0.0, 0.01, 0.01, 0.01, 0.01, 0.01,
0.0, 0.02, 0.02, 0.02, 0.02, 0.02,
0.0, 0.03, 0.03, 0.03, 0.03, 0.03
};
float HdrGainDot[3][6] = {1, 1, 4, 6, 8, 12,
1, 1, 4, 6, 8, 12,
1, 1, 4, 6, 8, 12
};
float HdrIspDGainDot[3][6] = {1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1
};
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
XCamReturn
rk_aiq_user_api2_ae_queryExpResInfo(const rk_aiq_sys_ctx_t* ctx,
Uapi_ExpQueryInfo_t* pExpResInfo);
```

```c
typedef struct Uapi_ExpSwAttrV2_s {
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
typedef struct CalibDb_HdrAeRoute_AttrV2_s {
float* Frm0TimeDot;
int Frm0TimeDot_len;
float* Frm0GainDot;
int Frm0GainDot_len;
float* Frm0IspDGainDot;
int Frm0IspDGainDot_len;
float* Frm1TimeDot;
int Frm1TimeDot_len;
float* Frm1GainDot;
int Frm1GainDot_len;
float* Frm1IspDGainDot;
int Frm1IspDGainDot_len;
float* Frm2TimeDot;
int Frm2TimeDot_len;
float* Frm2GainDot;
int Frm2GainDot_len;
float* Frm2IspDGainDot;
int Frm2IspDGainDot_len;
int* PIrisDot;
int PIrisDot_len;
} CalibDb_HdrAeRoute_AttV2r_t;
typedef CalibDb_HdrAeRoute_AttrV2_t Uapi_HdrAeRouteAttr_t;
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
typedef CalibDb_LinearAE_AttrV2_t Uapi_LinExpAttrV2_t;
```

```javascript
CalibDb_AecOverExpCtrlV2_t
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
```

```c
CalibDb_LongFrmCtrlV2_t LongFrmMode;
CalibDb_LfrmCtrlV2_t LframeCtrl;
CalibDb_MfrmCtrlV2_t MframeCtrl;
CalibDb_SfrmCtrlV2_t SframeCtrl;
} CalibDb_HdrAE_AttrV2_t;
typedef CalibDb_HdrAE_AttrV2_t Uapi_HdrExpAttrV2_t;
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
typedef CalibDb_AecIrisCtrlV2_t Uapi_IrisAttrV2_t;
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

```vhdl
typedef struct CalibDb_DCIris_AttrV2_s {
float Kp;
float Ki;
float Kd;
int MinPwmDuty;
int MaxPwmDuty;
int OpenPwmDuty;
int ClosePwmDuty;
} CalibDb_DCIris_AttrV2_t;
```

```c
typedef struct window {
uint16_t h_offs;
uint16_t v_offs;
uint16_t h_size;
uint16_t v_size;
} window_t;
typedef struct window Uapi_ExpWin_t;
```

```c
XCamReturn rk_aiq_uapi2_getMWBScene(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_wb_scene_t *scene);
```

```c
XCamReturn rk_aiq_uapi2_setAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

```c
XCamReturn rk_aiq_uapi2_getAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

```c
XCamReturn rk_aiq_uapi2_getAwbV21AllAttrib(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_uapiV2_wbV21_attrib_t *attr);
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
bool enable;
rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t *lutAll;
int lutAll_len;
} rk_aiq_uapiV2_wb_awb_wbGainAdjust_t;
```

```c
typedef struct rk_aiq_uapiV2_wbV21_attrib_s {
bool byPass;
rk_aiq_wb_op_mode_t mode;
rk_aiq_wb_mwb_attrib_t stManual;
rk_aiq_uapiV2_wbV21_awb_attrib_t stAuto;
} rk_aiq_uapiV2_wbV21_attrib_t;
```

```c
XCamReturn
rk_aiq_user_api2_awb_GetCCT(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_wb_cct_t
*cct);
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
XCamReturn rk_aiq_uapi2_setVcmCfg(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_lens_vcmcfg* cfg);
```

```c
typedef struct {
unsigned char contrast_af_en;
unsigned char rawaf_sel;
unsigned char window_num;
unsigned short wina_h_offs;
unsigned short wina_v_offs;
unsigned short wina_h_size;
unsigned short wina_v_size;
unsigned short winb_h_offs;
unsigned short winb_v_offs;
unsigned short winb_h_size;
unsigned short winb_v_size;
unsigned char gamma_flt_en;
unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
unsigned char gaus_flt_en;
unsigned char gaus_h0;
unsigned char gaus_h1;
```

```c
unsigned char gaus_h2;
unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
unsigned short afm_thres;
unsigned char lum_var_shift[RKAIQ_RAWAF_WIN_NUM];
unsigned char afm_var_shift[RKAIQ_RAWAF_WIN_NUM];
} rk_aiq_af_algo_meas_t;
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
int v_offs;
unsigned int h_size;
unsigned int v_size;
unsigned short fixedModeDefCode;
unsigned short macroModeDefCode;
unsigned short infinityModeDefCode;
rk_aiq_af_algo_meas_t manual_meascfg;
} rk_aiq_af_attrib_t;
```

```c
typedef struct rk_aiq_fec_cfg_s {
unsigned int en;
int bypass;
int correct_level;
fec_correct_direction_t direction;
} rk_aiq_fec_cfg_t;
```

```diff
diff --git a/arch/arm/boot/dts/rv1126-ipc.dtsi
b/arch/arm/boot/dts/rv1126-ipc.dtsi
index d9c69e9..3580f0b 100644
--- a/arch/arm/boot/dts/rv1126-ipc.dtsi
+++ b/arch/arm/boot/dts/rv1126-ipc.dtsi
@@ -169,7 +169,7 @@
};
&rkispp_mmu {
status = "okay";
+ status = "disabled";
};
&rkvdec {
diff --git a/arch/arm/boot/dts/rv1126.dtsi
b/arch/arm/boot/dts/rv1126.dtsi
```

```diff
index 59b97244..77a8f81 100644
--- a/arch/arm/boot/dts/rv1126.dtsi
+++ b/arch/arm/boot/dts/rv1126.dtsi
@@ -320,7 +320,7 @@
isp_reserved: isp {
compatible = "shared-dma-pool";
reusable;
size = <0x10000000>;
size = <0x20000000>;
};
ramoops: ramoops@8000000 {
@@ -1962,7 +1962,8 @@
assigned-clock-rates = <500000000>, <250000000>,
<400000000>;
power-domains = <&power RV1126_PD_ISPP>;
iommus = <&rkispp_mmu>;
/* iommus = <&rkispp_mmu>; */
memory-region = <&isp_reserved>;
status = "disabled";
};
```

```c
memset(&reqbuf, 0, sizeof(reqbuf));
reqbuf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
reqbuf.memory = V4L2_MEMORY_MMAP;
reqbuf.count = 20;
if (-1 == ioctl (fd, VIDIOC_REQBUFS, &reqbuf)) {
if (errno == EINVAL)
printf("Video capturing or mmap-streaming is not
supported\\n");
else
perror("VIDIOC_REQBUFS");
exit(EXIT_FAILURE);
```

## 2. fec只校正y方向的畸变

用户可以通过调用uapi配置，fec只校正y方向。

该方案的畸变校正方式为： ldch校x方向 + fec校正y方向

```c
// 此函数需要在rkaiq 执行prepare之前调用，才会生效
rk_aiq_uapi2_setFecCorrectDirection(ctx, FEC_CORRECT_DIRECTION_Y);
```

## 3. 确认isp/ispp频率

isp clk ：600M， isp aclk：500M， qos： 0x101  

ispp clk：500M， isp aclk：500M ， qos m0：0x202， m1: 0x302

# cat /sys/kernel/debug/clk/clk\_summary |grep isp   

clk\_isp\_div 0 0 0 142857143 0 0   

50000   

clk\_isp\_np5 0 1 0 500000000 0 0   

50000


| c1k_isp 50000 | 0 | 2 | 0 | 500000000 | 0 | 0 |
| --- | --- | --- | --- | --- | --- | --- |
| c1k_ispp_np5 50000 | 0 | 0 | 0 | 111111112 | 0 | 0 |
| clk_ispp_div 50000 | 0 | 1 | 0 | 500000000 | 0 | 0 |
| c1k_ispp 50000 | 0 | 2 | 0 | 500000000 | 0 | 0 |
| ac1k_isp 50000 | 0 | 2 | 0 | 594000000 | 0 | 0 |
| hclk_isp 0 50000 |  | 2 | 0 | 297000000 | 0 | 0 |
| aclk_pdispp_np5 50000 | 0 | 0 | 0 | 475200000 | 0 | 0 |
| aclk_pdispp_div 50000 | 0 | 1 | 0 | 594000000 | 0 | 0 |
| aclk_pdispp 50000 | 0 | 2 | 0 | 594000000 | 0 | 0 |
| aclk_pdispp_niu 0 |  | 0 |  | 0 594000000 | 0 |  |
| 0 50000 ac1k_ispp | 0 | 4 | 0 | 594000000 | 0 | 0 |
| 50000 hc1k_pdispp 0 |  | 1 | 0 | 297000000 | 0 | 0 |
| 50000 |  |  |  |  |  |  |
|  | hclk_pdispp_niu 0 |  | 0 | 0 297000000 |  | 0 |
| 0 50000 |  |  |  |  |  |  |
|  | hclk_ispp 0 | 4 | 0 | 297000000 | 0 | 0 |
| 50000 |  |  |  |  |  |  |

### LDCH

### 功能描述

光学系统、电子扫描系统失真而引起的斜视畸变、枕形、桶形畸变等，都可能使图像产生几何特性失真。图像的畸变矫正是以某种变换方式将畸变图像转换为理想图像的过程。

该模块只对x方向的图像畸变进行校正。

### 功能级API参考

### rk\_aiq\_uapi2\_setLdchEn

【描述】 水平畸变校正功能开关。

【语法】

XCamReturn rk\_aiq\_uapi2\_setLdchEn(const rk\_aiq\_sys\_ctx\_t\* ctx, bool en);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_aldch.h、rk\_aiq\_uapi2\_aldch\_int.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setLdchCorrectLevel

【描述】 设置水平畸变校正等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_setLdchCorrectLevel(const rk\_aiq\_sys\_ctx\_t\* ctx, int correctLevel);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_aldch.h、rk\_aiq\_uapi2\_aldch\_int.h

库文件：librkaiq.so

### 模块级API参考

rk\_aiq\_user\_api2\_aldch\_SetAttrib

【描述】

设置fec属性。

【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_aldch.h、rk\_aiq\_uapi2\_aldch\_int.h

库文件：librkaiq.so

rk\_aiq\_user\_api2\_aldch\_GetAttrib

【描述】

获取fec属性。

【语法】

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_aldch.h、rk\_aiq\_uapi2\_aldch\_int.h

库文件：librkaiq.so

模块级API数据类型

rk\_aiq\_ldch\_attrib\_t

【说明】

ldch属性配置

### 【定义】

```c
typedef struct rk_aiq_ldch_cfg_s {
unsigned int en;
int correct_level;
} rk_aiq_ldch_cfg_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### Merge

功能描述

Merge是将多帧图像合成为一帧的模块。

### 重要概念

在且仅在HDR模式下生效。

功能级API参考

模块级API参考

rk\_aiq\_user\_api2\_amerge\_SetAttrib

【描述】设置merge属性。

【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败，详见错误码表 |

### 【需求】

头文件：rk\_aiq\_user\_api2\_amerge.h

库文件：librkaiq.so

### rk\_aiq\_user\_api2\_amerge\_GetAttrib

【描述】

获取merge属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_amerge.h

库文件：librkaiq.so

### 模块级API数据类型

merge\_OpMode\_t

【说明】定义merge工作模式

【定义】

```c
typedef enum merge_OpMode_s {
MERGE_OPMODE_API_OFF = 0,
MERGE_OPMODE_AUTO = 1,
MERGE_OPMODE_MANU = 2,
MERGE_OPMODE_TOOL = 3,
} merge_OpMode_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| MERGE_OPMODE_API_OFF | api关闭模式 |
| MERGE_OPMODE_AUTO | 自动模式 |
| MERGE_OPMODE_MANU | 手动模式 |
| MERGE_OPMODE_TOOL | TOOL模式，可调整全部参数 |

### mgeCtrlData\_t

### 【说明】

定义自动Merge参数属性

### 【定义】

```sql
typedef struct mgeCtrlData_s {
float stCoef;
float stCoefMax;
float stCoefMin;
int stSmthMax;
int stSmthMin;
int stOfstMax;
int stOfstMin;
} mgeCtrlData_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| stCoef | 当前控制参数 |
| stCoefMax | 控制参数最大值 |
| stCoefMin | 控制参数最小值 |
| stSmthMax | 曲线斜率最大值 |
| stSmthMin | 曲线斜率最小值 |
| stOfstMax | 曲线偏移值最大值 |
| stOfstMin | 曲线偏移值最小值 |

### amgeAttr\_t

### 【说明】

定义自动Merge属性

### 【定义】

```c
typedef struct amgeAttr_s {
mgeCtrlData_t stMDCurveLM;
mgeCtrlData_t stMDCurveMS;
mgeCtrlData_t stOECurve;
} amgeAttr_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### mmgeAttr\_t

【说明】

定义手动Merge工作模式

【定义】

```c
typedef struct mmgeAttr_s {
float OECurve_smooth;
float OECurve_offset;
float MDCurveLM_smooth;
float MDCurveLM_offset;
float MDCurveMS_smooth;
float MDCurveMS_offset;
float dampOE;
float dampMDLM;
float dampMDMS;
} mmgeAttr_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| OECurve_smooth | 过曝曲线斜率 |
| OECurve_offset | 过曝曲线偏移值 |
| MDCurveLM_smooth | 长中帧运动曲线斜率，在RK356x平台下，该值无效。 |
| MDCurveLM_offset | 长中帧运动曲线偏移值，在RK356x平台下，该值无效。 |
| MDCurveMS_smooth | 中短帧运动曲线斜率 |
| MDCurveMS_offset | 中短帧运动曲线偏移值 |
| dampOE | 过曝曲线平滑系数 |
| dampMDLM | 长中帧运动曲线平滑系数，在RK356x平台下，该值无效。 |
| dampMDMS | 中短帧运动曲线平滑系数 |

### mmergeAttr\_t

【说明】

定义手动merge属性

【定义】

```c
typedef struct mmergeAttr_s {
bool bUpdateMge;
mmgeAttr_t stMgeManual;
} mmergeAttr_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### MergeCurrCtlData\_t

### 【说明】

定义当前控制量属性

【定义】

```c
typedef struct MergeCurrCtlData_s {
float Envlv;
float MoveCoef;
} MergeCurrCtlData_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### MergeCurrRegData\_t

### 【说明】

定义当前被控制量属性

### 【定义】

```c
typedef struct MergeCurrRegData_s{
float OECurve_smooth;
float OECurve_offset;
float MDCurveLM_smooth;
float MDCurveLM_offset;
float MDCurveMS_smooth;
float MDCurveMS_offset;
} MergeCurrRegData_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| OECurve_smooth | 过曝曲线斜率 |
| OECurve_offset | 过曝曲线偏移值 |
| MDCurveLM_smooth | 长中帧运动曲线斜率 |
| MDCurveLM_offset | 长中帧运动曲线偏移值 |
| MDCurveMS_smooth | 中短帧运动曲线斜率 |
| MDCurveMS_offset | 中短帧运动曲线偏移值 |

MergeOECurveV20\_t

【说明】

定义过曝曲线属性

【定义】

```c
typedef struct MergeOECurveV20_s{
float* EnvLv;
int EnvLv_len;
float* Smooth;
int Smooth_len;
float* Offset;
int Offset_len;
} MergeOECurveV20_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 环境亮度，取值范围[0,1]，0：全黑，1：最亮。 |
| EnvLv_len | EnvLv数组长度 |
| Smooth | 过曝曲线的斜率，取值范围[0,1]，默认值为0.4 |
| Smooth_len | Smooth数组长度 |
| Offset | 过曝曲线的偏移值，取值范围[108,280]，默认值为210 |
| Offset_len | Offset数组长度 |

MergeMDCurveV20\_t

【说明】

定义运动曲线属性

【定义】

```c
typedef struct MergeMDCurveV20_s{
float* MoveCoef;
int MoveCoef_len;
float* LM_smooth;
int LM_smooth_len;
float* LM_offset;
int LM_offset_len;
float* MS_smooth;
int MS_smooth_len;
float* MS_offset;
int MS_offset_len;
} MergeMDCurveV20_t;
```

### 【成员】


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

### MergeV20\_t

### 【说明】

定义merge调试参数属性

### 【定义】

```c
typedef struct MergeV20_s{
MergeOECurveV20_t OECurve;
MergeMDCurveV20_t MDCurve;
float ByPassThr;
float OECurve_damp;
float MDCurveLM_damp;
float MDCurveMS_damp;
} MergeV20_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| OECurve | 过曝曲线 |
| MDCurve | 运动曲线 |
| ByPassThr | 当控制量变化百分比小于该值，不更新参数 |
| OECurve_damp | 过曝曲线damp系数 |
| MDCurveLM_damp | 暂未生效 |
| MDCurveMS_damp | 长短帧间运动曲线damp系数 |

CalibDbV2\_merge\_t

【说明】

merge属性配置

【定义】

```c
typedef struct CalibDbV2_merge_s {
MergeV20_t MergeTuningPara;
} CalibDbV2_merge_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| MergeTuningPara | merge调试参数 |

mergeAttr\_t

【说明】

merge属性配置

【定义】

```c
typedef struct mergeAttr_s {
merge_OpMode_t opMode;
amergeAttr_t stAuto;
mmergeAttr_t stManual;
MergeCurrCtlData_t CtlInfo;
MergeCurrRegData_t RegInfo;
CalibDbV2_merge_t stTool;
} mergeAttr_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| opMode | 模式选择 |
| stAuto | 自动模式参数 |
| stManual | 手动模式参数 |
| Ctllnfo | 控制量参数 |
| Reglnfo | 被控制量参数 |
| stTool | TOOL模式参数 |

### DRC

### 功能描述

DRC(动态范围压缩, High Dynamic Range Compression)，其作用是将高比特位的图像压缩到低比特位图像。

### 重要概念

在线性或者HDR模式下均可使用DRC。

### 功能级API参考

rk\_aiq\_uapi2\_enableDrc

【描述】

开启DRC模块。通过本api开启DRC功能后，生效参数为Json文件中参数。

【语法】

XCamReturn rk\_aiq\_uapi2\_enableDrc(const rk\_aiq\_sys\_ctx\_t\* ctx);

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_disableDrc

### 【描述】

关闭DRC模块。

### 【语法】

XCamReturn rk\_aiq\_uapi2\_disableDrc(const rk\_aiq\_sys\_ctx\_t\* ctx);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setDrcGain

### 【描述】

设置DrcGain相关参数。

在调用本api时不需要调用rk\_aiq\_uapi2\_enableDrc。同时，本api不能与DRC其他功能级设置api同时调用。

### 【语法】

XCamReturn rk\_aiq\_uapi2\_setDrcGain(const rk\_aiq\_sys\_ctx\_t\* ctx, float Gain,float Alpha, float Clip);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| Gain | Gain值取值范围：[1,8] | 输入 |
| Alpha | Alpha值取值范围：[0,1] | 输入 |
| Clip | Clip值取值范围：[0,64] | 输入 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getDrcGain

【描述】

获取DrcGain相关参数。

【语法】

XCamReturn rk\_aiq\_uapi2\_getDrcGain(const rk\_aiq\_sys\_ctx\_t\* ctx, float Gain, float Alpha, float Clip);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| Gain | Gain值取值范围：[1,8] | 输出 |
| Alpha | Alpha值取值范围：[0,1] | 输出 |
| Clip | Clip值取值范围：[0,64] | 输出 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setDrcHiLit

【描述】

设置DrcHiLit参数。

在调用本api时不需要调用rk\_aiq\_uapi2\_enableDrc。同时，本api不能与DRC其他功能级设置api同时调用。

【语法】

XCamReturn rk\_aiq\_uapi2\_setDrcHiLit(const rk\_aiq\_sys\_ctx\_t\* ctx, floatStrength);

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| Strength | 强度取值范围：[0,1] | 输入 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getDrcHiLit

【描述】

获取DrcHiLit参数。

【语法】

XCamReturn rk\_aiq\_uapi2\_getDrcHiLit(const rk\_aiq\_sys\_ctx\_t\* ctx, floatStrength);

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| Strength | 强度取值范围：[0,1] | 输出 |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setDrcLocalTMO

### 【描述】

设置DrcLocalTMO相关参数。

在调用本api时不需要调用rk\_aiq\_uapi2\_enableDrc。同时，本api不能与DRC其他功能级设置api同时调用。

### 【语法】

XCamReturn rk\_aiq\_uapi2\_setDrcLocalTMO(const rk\_aiq\_sys\_ctx\_t\* ctx, floatLocalWeit, float GlobalContrast, float LoLitContrast);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| LocalWeit | LocalWeit值取值范围：[0,1] | 输入 |
| GlobalContrast | GlobalContrast值取值范围：[0,1] | 输入 |
| LoLitContrast | LoLitContrast值取值范围：[0,1] | 输入 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getDrcLocalTMO

【描述】

获取DrcLocalTMO相关参数。

【语法】

XCamReturn rk\_aiq\_uapi2\_getDrcLocalTMO(const rk\_aiq\_sys\_ctx\_t\* ctx, float LocalWeit, float GlobalContrast, float LoLitContrast);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| LocalWeit | LocalWeit值取值范围：[0,1] | 输出 |
| GlobalContrast | GlobalContrast值取值范围：[0,1] | 输出 |
| LoLitContrast | LoLitContrast值取值范围：[0,1] | 输出 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setDrcCompress

【描述】

设置DrcCompress相关参数。

在调用本api时不需要调用rk\_aiq\_uapi2\_enableDrc。同时，本api不能与DRC其他功能级设置api同时调用。

### 【语法】

XCamReturn rk\_aiq\_uapi2\_setDrcCompress(const rk\_aiq\_sys\_ctx\_t\* ctx, mDrcCompress\_t\* pIn);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getDrcCompress

### 【描述】

设置DrcCompress相关参数。

【语法】

XCamReturn rk\_aiq\_uapi2\_getDrcCompress(const rk\_aiq\_sys\_ctx\_t\* ctx, mDrcCompress\_t\* pIn);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

功能级API数据类型

CompressMode\_t

【说明】

定义手动模式下，DrcCompress曲线工作模式

【定义】

```c
typedef enum CompressMode_s {
COMPRESS_AUTO 0,
COMPRESS_MANUAL = 1,
} CompressMode_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

【说明】定义DrcCompress相关参数

【定义】

```c
typedef struct mDrcCompress_s {
CompressMode_t Mode;
uint16_t Manual_curve[17];
} mDrcCompress_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 模块级API参考

rk\_aiq\_user\_api2\_adrc\_SetAttrib

【描述】

设置DRC软件属性。

【语法】

```c
XCamReturn
rk_aiq_user_api2_adrc_SetAttrib(RkAiqAlgoContext* ctx,
drc_attrib_t attr);
```

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_adrc.h

库文件：librkaiq.so

### 【说明】

rk\_aiq\_user\_api2\_adrc\_GetAttrib

### 【描述】

获取DRC软件属性。

【语法】

XCamReturn   

rk\_aiq\_user\_api2\_adrc\_GetAttrib(RkAiqAlgoContext\* ctx,   

drc\_attrib\_t\* attr);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_adrc.h

库文件：librkaiq.so

【说明】

模块级API数据类型

drc\_OpMode\_t

【说明】定义DRC工作模式

【定义】

```c
typedef enum drc_OpMode_s {
DRC_OPMODE_API_OFF = 0,
DRC_OPMODE_MANU = 1,
DRC_OPMODE_AUTO = 2,
DRC_OPMODE_DRC_GAIN = 3,
DRC_OPMODE_HILIT = 4,
DRC_OPMODE_LOCAL_TMO = 5,
DRC_OPMODE_COMPRESS = 6,
} drc_OpMode_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| DRC_OPMODE_API_OFF | api关闭模式 |
| DRC_OPMODE_MANU | 手动模式 |
| DRC_OPMODE_AUTO | 自动模式 |
| DRC_OPMODE_DRC_GAIN | DrcGain模式，调整DrcGain部分参数 |
| DRC_OPMODE_HILIT | HiLit模式，调整HiLit部分参数 |
| DRC_OPMODE_LOCAL_TMO | LocalTMO模式，调整LocalTMO部分参数 |
| DRC_OPMODE_COMPRESS | Compress模式，调整Compress部分参数 |

mDrcGain\_t

### 【说明】

定义手动DrcGain参数属性

【定义】

```c
typedef struct mDrcGain_s {
float DrcGain;
float Alpha;
float Clip;
} mDrcGain_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

mDrcHiLit\_t

### 【说明】

定义手动DrcHiLit参数属性

【定义】

```c
typedef struct mDrcHiLit_s {
float Strength;
} mDrcHiLit_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| Strength | 手动Strength值 |

mDrcLocal\_t

【说明】定义手动DrcHiLit参数属性

### 【定义】

```c
typedef struct mDrcLocal_s {
float LocalWeit;
float GlobalContrast;
float LoLitContrast;
} mDrcLocal_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

### CompressMode\_t

### 【说明】

定义手动模式下，DrcCompress曲线工作模式

【定义】

```c
typedef enum CompressMode_s {
COMPRESS_AUTO 0,
COMPRESS_MANUAL = 1,
} CompressMode_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### mDrcCompress\_t

### 【说明】

定义手动DrcCompress参数属性

【定义】

```c
typedef struct mDrcCompress_s {
CompressMode_t Mode;
uint16_t Manual_curve[17];
} mDrcCompress_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

mdrcAttr\_t

【说明】

定义手动模式下drc属性

【定义】

```c
typedef struct mdrcAttr_s {
mDrcGain_t DrcGain;
mDrcHiLit_t HiLit;
mDrcLocal_t Local;
mDrcCompress_t Compress;
} mdrcAttr_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| DrcGain | 手动模式下，DrcGain参数 |
| HiLit | 手动模式下，HiLit参数 |
| Local | 手动模式下，Local参数 |
| Compress | 手动模式下，Compress参数 |

DrcInfo\_t

【说明】

定义DRC参考信息属性

【定义】

```c
typedef struct DrcInfo_s {
float EnvLv;
} DrcInfo_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| EnvLv | 当前环境亮度 |

drcAttr\_t

【说明】  

定义DRC属性

【定义】

```c
typedef struct drcAttr_s {
bool Enable;
drc_OpMode_t opMode;
mdrcAttr_t stManual;
DrcInfo_t Info;
} drcAttr_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| Enable | 开关功能 |
| opMode | api模式 |
| stManual | 手动模式参数 |
| Info | DRC参考信息 |

### Noise Removal

### 功能描述

图像噪声是指存在于图像数据中的不必要的或多余的干扰信息。图像去噪是减少数字图像中噪声的过程。

### 功能级API参考

rk\_aiq\_uapi2\_setNRMode

【描述】 设置去噪模式。

【语法】

```c
XCamReturn rk_aiq_uapi2_setNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getNRMode

【描述】 获取当前去噪模式。

【语法】

XCamReturn rk\_aiq\_uapi2\_getNRMode(const rk\_aiq\_sys\_ctx\_t\* ctx, opMode\_t\* mode);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setANRStrth

【描述】 设置普通去噪强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_setANRStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getANRStrth

【描述】 获取普通去噪强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_getANRStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int\* level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setMSpaNRStrth

【描述】 设置空域去噪强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_setMSpaNRStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, bool on, unsigned int level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getMSpaNRStrth

【描述】 获取空域去噪强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_getMSpaNRStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, bool \*on, unsigned int \*level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setMTNRStrth

【描述】 设置时域去噪强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_setMTNRStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, bool on, unsigned int level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getMTNRStrth

【描述】 获取时域去噪强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_getMTNRStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, bool \*on，unsigned int \*level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

### 模块级API参考

### rk\_aiq\_user\_api2\_abayernrV2\_SetAttrib

【描述】

设置bayernr算法属性。

【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非json对应参数结构体。json有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_abayernr\_v2.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

rk\_aiq\_user\_api2\_abayernrV2\_GetAttrib

【描述】

获取bayernr去噪算法属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非json对应参数结构体。json有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_abayernr\_v2.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

rk\_aiq\_user\_api2\_aynrV2\_SetAttrib

### 【描述】

设置ynr去噪算法属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非json对应参数结构体。json有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_aynr\_v2.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

### rk\_aiq\_user\_api2\_aynrV2\_GetAttrib

【描述】

获取ynr去噪算法属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非json对应参数结构体。json有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_aynr\_v2.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

rk\_aiq\_user\_api2\_acnrV1\_SetAttrib

【描述】

设置cnr去噪算法属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非json对应参数结构体。json有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_acnr\_v1.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

rk\_aiq\_user\_api2\_acnrV1\_GetAttrib

### 【描述】

获取ynr去噪算法属性。

【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非json对应参数结构体。json有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_acnr\_v1.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

模块级API数据类型

rk\_aiq\_bayernr\_attrib\_v2\_t

【说明】定义bayernr去噪模块的属性参数

【定义】

```c
typedef struct rk_aiq_bayernr_attrib_v2_s {
Abayernr_OPMode_t eMode;
Abayernr_Auto_Attr_V2_t stAuto;
Abayernr_Manual_Attr_V2_t stManual;
} rk_aiq_bayernr_attrib_v2_t;
```

【成员】

成员名称 描述  

eMode bayernr模块模式属性。  

stAuto bayernr自动模式，对应不同iso不同配置参数。  

stManual bayernr手动模式，全局使用一个配置参数。

### Abayernr\_Auto\_Attr\_V2\_t

【说明】

定义bayernr去噪模块的自动模式参数。

【定义】

```c
typedef struct Abayernr_Auto_Attr_V2_s
//all ISO params and select param
int bayernr2DEn;
int bayernr3DEn;
RK_Bayernr_2D_Params_V2_t st2DParams;
RK_Bayernr_3D_Params_V2_t st3DParams;
RK_Bayernr_2D_Params_V2_Select_t st2DSelect;
RK_Bayernr_3D_Params_V2_Select_t st3DSelect;
} Abayernr_Auto_Attr_V2_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| bayernr2DEn | bayernr2d，模块使能位。 |
| bayernr3DEn | bayernr3的，模块使能位. |
| st2DParams | bayernr2d不同iso对应不同配置参数。 |
| st3DParams | bayernr3d不同iso对应不同配置参数。 |
| st2DSelect | bayernr2d当前配置参数。 |
| st3DSelect | bayernr3d当前配置参数。 |

Abayernr\_Manual\_Attr\_V2\_t

【说明】

定义bayernr去噪模块的手动参数配置

【定义】

typedef struct Abayernr\_Manual\_Attr\_V2\_s   

```c
{
int bayernr2DEn;
int bayernr3DEn;
RK_Bayernr_2D_Params_V2_Select_t st2DSelect;
RK_Bayernr_3D_Params_V2_Select_t st3DSelect;

} Abayernr_Manual_Attr_V2_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| bayernr2DEn | bayernr2d模块使能位 |
| bayernr3DEn | bayernr3d模块使能位 |
| st2DSelect | bayernr2d手动模式参数配置 |
| st3DSelect | bayernr3d手动模式参数配置 |

rk\_aiq\_ynr\_attrib\_v2\_t

【说明】定义ynr模块算法属性参数。

【定义】

```c
typedef struct rk_aiq_ynr_attrib_v2_s {
Aynr_OPMode_t eMode;
Aynr_Auto_Attr_V2_t stAuto;
Aynr_Manual_Attr_V2_t stManual;
} rk_aiq_ynr_attrib_v2_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

Aynr\_Auto\_Attr\_V2\_t

【说明】

ynr模块自动算法参数配置。

【定义】

```c
typedef struct Aynr_Auto_Attr_V2_s
{
//all ISO params and select param
int ynrEn;
RK_YNR_Params_V2_t stParams;
RK_YNR_Params_V2_Select_t stSelect;
} Aynr_Auto_Attr_V2_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

Aynr\_Manual\_Attr\_V2\_t

【说明】

定义bayernr去噪模块的手动参数配置

【定义】

rk\_aiq\_cnr\_attrib\_v1\_t

```c
typedef struct Aynr_Manual_Attr_V2_s
{
int ynrEn;
RK_YNR_Params_V2_Select_t stSelect;
} Aynr_Manual_Attr_V2_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

【说明】

定义cnr模块算法属性参数。

【定义】

```c
typedef struct rk_aiq_cnr_attrib_v1_s {
Acnr_OPMode_t eMode;
Acnr_Auto_Attr_V1_t stAuto;
Acnr_Manual_Attr_V1_t stManual;
} rk_aiq_cnr_attrib_v1_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

Acnr\_Auto\_Attr\_V1\_t

【说明】ynr模块自动算法参数配置。

【定义】

```c
typedef struct Acnr_Auto_Attr_V1_s
{
//all ISO params and select param
int cnrEn;
RK_CNR_Params_V1_t stParams;
RK_CNR_Params_V1_Select_t stSelect;
} Acnr_Auto_Attr_V1_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |

Acnr\_Manual\_Attr\_V1\_t

【说明】定义bayernr去噪模块的手动参数配置

【定义】

```c
typedef struct Acnr_Manual_Attr_V1_s
{
int cnrEn;
RK_CNR_Params_V1_Select_t stSelect;
} Acnr_Manual_Attr_V1_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

### Defog

功能描述

Defog 是通过动态的改变图象的对比度和亮度来实现的去雾增强。

功能级API参考

rk\_aiq\_uapi2\_setDhzMode

【描述】

设置去雾工作模式。

【语法】

XCamReturn rk\_aiq\_uapi2\_setDhzMode(const rk\_aiq\_sys\_ctx\_t\* ctx, opMode\_t mode);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getDhzMode

【描述】

获取当前去雾工作模式。

【语法】

XCamReturn rk\_aiq\_uapi2\_getDhzMode(const rk\_aiq\_sys\_ctx\_t\* ctx, opMode\_t\* mode);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setMDhzStrth

【描述】

设置去雾工作强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_setMDhzStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, bool on, unsigned int level);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getMDhzStrth

【描述】

获取去雾工作强度。

【语法】

XCamReturn rk\_aiq\_uapi2\_getMDhzStrth(const rk\_aiq\_sys\_ctx\_t\* ctx, bool \*on, unsigned int \*level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_enableDhz

【描述】

开启去雾功能。

【语法】

XCamReturn rk\_aiq\_uapi2\_enableDhz(const rk\_aiq\_sys\_ctx\_t\* ctx);

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_disableDhz

【描述】

关闭去雾功能。

【语法】

XCamReturn rk\_aiq\_uapi2\_disableDhz(const rk\_aiq\_sys\_ctx\_t\* ctx);

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

### 模块级API参考

rk\_aiq\_user\_api2\_adehaze\_setSwAttrib

【描述】

设置去雾参数。

【语法】

XCamReturn rk\_aiq\_user\_api2\_adehaze\_setSwAttrib(const rk\_aiq\_sys\_ctx\_t\* sys\_ctx, adehaze\_sw\_t attr);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

rk\_aiq\_user\_api2\_adehaze\_getSwAttrib

【描述】

获取当前去雾参数。

【语法】

XCamReturn rk\_aiq\_user\_api2\_adehaze\_getSwAttrib(const rk\_aiq\_sys\_ctx\_t\* sys\_ctx, adehaze\_sw\_t \*attr);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### ACM

### 功能描述

ACM(Auto Color Managment) 提供基本的喜好色调节功能，通过对一定区间内的亮度、对比度、饱和度、色度的调节，达到对喜好色的调节。

### API参考

rk\_aiq\_uapi2\_setBrightness

【描述】

设置亮度等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_setBrightness(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int level);

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getBrightness

【描述】

获取亮度等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_getBrightness(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int\* level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setContrast

【描述】

设置对比度等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_setContrast(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getContrast

【描述】

获取对比度等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_getContrast(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int \*level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setSaturation

【描述】

设置饱和度等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_setSaturation(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getSaturation

【描述】

获取饱和度等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_getSaturation(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int\* level);

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_setHue

【描述】

设置色度等级。

【语法】

```c
XCamReturn rk_aiq_uapi2_setHue(const rk_aiq_sys_ctx_t* ctx, unsigned int level);
```

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| level | 色度等级取值范围：[0,255]默认值为128 | 输入 |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getHue

【描述】

获取色度等级。

【语法】

```sql
XCamReturn rk_aiq_uapi2_getHue(const rk_aiq_sys_ctx_t* ctx, unsigned int*
level);
```

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

### Sharpen

### 功能描述

Sharpen 模块用于增强图像的清晰度，包括调节图像边缘的锐化属性和增强图像的细节和纹理。

### 功能级API参考

rk\_aiq\_uapi2\_setSharpness

【描述】

设置锐化等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_setSharpness(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int level);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| ctx | AIQ上下文指针 | 输入 |
| level | 锐化等级取值范围：[0,100]默认值为50 | 输入 |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

rk\_aiq\_uapi2\_getSharpness

### 【描述】

获取锐化等级。

【语法】

XCamReturn rk\_aiq\_uapi2\_getSharpness(const rk\_aiq\_sys\_ctx\_t\* ctx, unsigned int\* level);


| XXCamReturn |
| --- |
| rk_aiq_user_api2_asharpv3_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, |
| rk_aiq_sharp_attrib_v3_t* attr) |
|  |

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

### 模块级API参考

rk\_aiq\_user\_api2\_asharpV3\_SetAttrib

【描述】

设置锐化算法属性。

【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非IQ对应参数结构体。IQ有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_asharp\_v3.h、RkAiqHandleIntV21.h

库文件：librkaiq.so

### rk\_aiq\_user\_api2\_asharpV3\_GetAttrib

### 【描述】

获取锐化算法属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【注意】

此attr属性参数为软件算法最终使用参数结构体，而非IQ对应参数结构体。IQ有些参数还需要转换成算法值。但是两者参数基本相同，差异较小。

### 【需求】

头文件：rk\_aiq\_user\_api2\_asharp\_v3.h、RkAiqHandleInt.h

库文件：librkaiq.so

### 模块级API数据类型

rk\_aiq\_sharp\_attrib\_v3\_t

【说明】

定义锐化模块的参数

【定义】

```c
typedef struct rk_aiq_sharp_attrib_v3_s {
Asharp3_OPMode_t eMode;
Asharp_Auto_Attr_V3_t stAuto;
Asharp_Manual_Attr_V3_t stManual;
} rk_aiq_sharp_attrib_v3_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| eMode | 锐化模块属性 |
| stAuto | 锐化模块自动模式参数 |
| stManual | 锐化模块手动模式参数 |

Asharp\_Auto\_Attr\_V3\_t

【说明】

定义锐化模块的自动属性

【定义】

```c
typedef struct Asharp_Auto_Attr_V3_s
{
//all ISO params and select param
RK_SHARP_Params_V3_t stParams;
RK_SHARP_Params_V3_Select_t stSelect;
} Asharp_Auto_Attr_V3_t;
```

【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

Asharp\_Manual\_Attr\_t

【说明】定义锐化模块的手动属性

【定义】

```c
typedef struct Asharp_Manual_Attr_V3_s
{
RK_SHARP_Params_V3_Select_t stSelect;
} Asharp_Manual_Attr_V3_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RK_SHARP_Params_V3_Select_t | sharp手动设置算法参数 |

### Gamma

### 功能描述

Gamma 模块对图像进行亮度空间非线性转换以适配输出设备。

功能级API参考

rk\_aiq\_uapi2\_setGammaCoef

【描述】

设置伽玛。

【语法】

```sql
XCamReturn rk_aiq_uapi2_setGammaCoef(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_gamma_attrib_t gammaAttr);
```

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_imgproc.h

库文件：librkaiq.so

【说明】

Api中Gamma曲线未按照场景进行切换，若场景变化，请重新通过api设置gamma曲线。

功能级API数据类型

rk\_aiq\_gamma\_op\_mode\_t

【说明】

定义Gamma工作模式

【定义】

```c
typedef enum rk_aiq_gamma_op_mode_s {

= 0,

= 2,

} rk_aiq_gamma_op_mode_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| RK_AIQ_GAMMA_MODE_OFF | Api关闭模式 |
| RK_AIQ_GAMMA_MODE_MANUAL | Api自动模式 |
| RK_AIQ_GAMMA_MODE_TOOL | Api工具模式 |

rk\_gamma\_curve\_type\_t

【说明】

定义手动模式下Gamma曲线工作模式

【定义】

RK\_GAMMA\_CURVE\_TYPE\_DEFUALT

RK\_GAMMA\_CURVE\_TYPE\_HDR

RK\_GAMMA\_CURVE\_TYPE\_USER\_DEFINE1

RK\_GAMMA\_CURVE\_TYPE\_USER\_DEFINE2

```
} rk_gamma_curve_type_t;

= 0,

= 1,

= 2,
```

【成员】

= 3,

= 4,


| 成员名称 | 描述 |
| --- | --- |
| RK_GAMMA_CURVE_TYPE_DEFUALT | 使用IQ文件中Gamma曲线 |
| RK_GAMMA_CURVE_TYPE_SRGB | 使用sRGB标准Gamma 2.2曲线 |
| RK_GAMMA_CURVE_TYPE_HDR | 使用HDR模式Gamma曲线 |
| RK_GAMMA_CURVE_TYPE_USER_DEFINE1 | 使用用户定义Gamma曲线1 |
| RK_GAMMA_CURVE_TYPE_USER_DEFINE2 | 使用用户定义Gamma曲线2 |

rk\_gamma\_curve\_usr\_define1\_para\_t

### 【说明】

定义手动模式下用户定义Gamma曲线1属性

【定义】

```c
typedef struct rk_gamma_curve_usr_define1_para_s {
float coef1;
float coef2;
} rk_gamma_curve_usr_define1_para_t;
```

### 【成员】


|  |  |
| --- | --- |
|  |  |
|  |  |

rk\_gamma\_curve\_usr\_define2\_para\_t

### 【说明】

定义手动模式下用户定义Gamma曲线2属性

【定义】

```c
typedef struct rk_gamma_curve_usr_define2_para_s {
int gamma_out_segnum;
int gamma_out_offset;
int gamma_table[45];
} rk_gamma_curve_usr_define2_para_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| gamma_out_segnum | 定义Gamma曲线X轴间距，0：非等间距，1：等间距 |
| gamma_out_offset | Gamma曲线偏移值 |
| gamma_table | Gamma曲线 |

Agamma\_api\_manual\_t

### 【说明】

定义手动Gamma属性

【定义】

```c
typedef struct Agamma_api_manual_s {
bool en;
rk_gamma_curve_type_t CurveType;
rk_gamma_curve_usr_define1_para_t user1;
rk_gamma_curve_usr_define2_para_t user2;
} Agamma_api_manual_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| en | 开关功能 |
| CurveType | 曲线种类 |
| user1 | 用户定义Gamma曲线1 |
| user2 | 用户定义Gamma曲线2 |

【说明】定义工具模式下Gamma属性

### 【定义】

```c
typedef struct CalibDb_Gamma_s {
unsigned char gamma_en;
unsigned char gamma_out_segnum;
unsigned char gamma_out_offset;
float curve_normal[45];
float curve_hdr[45];
float curve_night[45];
} CalibDb_Gamma_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| gamma_en | 开关功能 |
| gamma_out_segnum | 定义Gamma曲线X轴间距，0：非等间距，1：等间距 |
| gamma_out_offset | Gamma曲线偏移值 |
| curve_normal | 线性模式下Gamma曲线 |
| curve_hdr | HDR模式下Gamma曲线 |
| curve_night | 夜视模式下Gamma曲线 |

rk\_aiq\_gamma\_attr\_t

### 【说明】

定义Gamma属性

【定义】

```c
typedef struct rk_aiq_gamma_attr_s {
rk_aiq_gamma_op_mode_t mode;
Agamma_api_manual_t stManual;
CalibDb_Gamma_t stTool;
int Scene_mode;
} rk_aiq_gamma_attr_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| mode | Api模式 |
| stManual | 手动Gamma参数 |
| stTool | 工具Gamma参数 |
| Scene_mode | 场景模式 |

### 模块级API参考

rk\_aiq\_user\_api2\_agamma\_SetAttrib

### 【描述】

设定 Gamma软件属性。

### 【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_agamma.h

库文件：librkaiq.so

### 【说明】

Api中Gamma曲线未按照场景进行切换，若场景变化，请重新通过api设置gamma曲线。

rk\_aiq\_user\_api2\_agamma\_GetAttrib

### 【描述】

获取 Gamma软件属性。

【语法】

### 【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_agamma.h

库文件：librkaiq.so

【说明】

DPCC

功能描述

模块级API参考

rk\_aiq\_user\_api2\_adpcc\_SetAttrib

【描述】

设定 DPCC软件属性。

【语法】

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

【需求】

头文件：rk\_aiq\_user\_api2\_adpcc.h

库文件：librkaiq.so

【说明】

rk\_aiq\_user\_api2\_adpcc\_GetAttrib

### 【描述】

获取 DPCC软件属性。

### 【语法】

【参数】


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### 【返回值】


|  |  |
| --- | --- |
|  |  |
|  |  |

### 【需求】

头文件：rk\_aiq\_user\_api2\_adpcc.h

库文件：librkaiq.so

### 【说明】

模块级API数据类型

AdpccOPMode\_t

【说明】定义DPCC工作模式

【定义】

```c
typedef enum AdpccOPMode_e {
ADPCC_OP_MODE_INVALID = 0,
ADPCC_OP_MODE_AUTO = 1,
ADPCC_OP_MODE_MANUAL = 2,
ADPCC_OP_MODE_TOOL = 3,
ADPCC_OP_MODE_MAX
} AdpccOPMode_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| ADPCC_OP_MODE_INVALID | Api无效模式 |
| ADPCC_OP_MODE_AUTO | Api自动模式 |
| ADPCC_OP_MODE_MANUAL | Api手动模式 |
| ADPCC_OP_MODE_TOOL | Api工具模式 |
| ADPCC_OP_MODE_MAX |  |

### Adpcc\_basic\_params\_select\_t

### 【说明】

定义DPCC基本参数属性

【定义】

typedef struct Adpcc\_basic\_params\_select\_s   

```c
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
unsigned char ro_red_blue1_enable;
unsigned char lc_red_blue1_enable;
unsigned char pg_red_blue1_enable;
unsigned char sw_rk_green1_en;
unsigned char rg_green1_enable;
unsigned char rnd_green1_enable;
unsigned char ro_green1_enable;
unsigned char lc_green1_enable;
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
unsigned char sw_dis_scale_max3;
unsigned char line_mad_fac_3_rb;
unsigned char line_mad_fac_3_g;
unsigned char pg_fac_3_rb;
unsigned char pg_fac_3_g;
unsigned char rnd_thr_3_rb;
unsigned char rnd_thr_3_g;
unsigned char rg_fac_3_rb;
unsigned char rg_fac_3_g;
unsigned char ro_lim_3_rb;
unsigned char ro_lim_3_g;
unsigned char ro_lim_2_rb;
```

```c
unsigned char ro_lim_2_g;
unsigned char ro_lim_1_rb;
unsigned char ro_lim_1_g;
unsigned char rnd_offs_3_rb;
unsigned char rnd_offs_3_g;
unsigned char rnd_offs_2_rb;
unsigned char rnd_offs_2_g;
unsigned char rnd_offs_1_rb;
unsigned char rnd_offs_1_g;
```

```
} Adpcc_basic_params_select_t;
```

Adpcc\_basic\_params\_t

### 【说明】

定义DPCC基本参数属性

【定义】

```c
typedef struct Adpcc_basic_params_s
{
Adpcc_basic_params_select_t arBasic[DPCC_MAX_ISO_LEVEL];
} Adpcc_basic_params_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| arBasic | DPCC基本参数属 |

### Adpcc\_bpt\_params\_t

【说明】

定义自动DPCC属性

【定义】

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

dpcc\_pdaf\_point\_t

### 【说明】

【定义】

```c
typedef struct dpcc_pdaf_point_s
{
unsigned char y;
unsigned char x;
} dpcc_pdaf_point_t;
```

该模块还未实现

Adpcc\_pdaf\_params\_t

### 【说明】

定义自动模式下PDAF模式属性

【定义】

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

该模块还未实现

CalibDb\_Dpcc\_Fast\_Mode\_t

### 【说明】

定义自动模式下Fast mode属性

【定义】

typedef struct CalibDb\_Dpcc\_Fast\_Mode\_s   

```c
{
int fast_mode_en;
int ISO[CALIBDB_DPCC_MAX_ISO_LEVEL];
int fast_mode_single_en;
int fast_mode_single_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
int fast_mode_double_en;
int fast_mode_double_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
int fast_mode_triple_en;
int fast_mode_triple_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_Fast_Mode_t;
```

### 【成员】

【说明】  

定义自动模式下选择的Fast mode属性


| 成员名称 | 描述 |
| --- | --- |
| Fast_mode_enable | Fast_mode开关功能，0：关闭，1：打开 |
| ISO | 环境ISO |
| fast_mode_single_en | 单坏点去除开关，0：关闭，1：打开 |
| fast_mode_single_level | 单坏点去除力度，取值范围[0，10] |
| fast_mode_double_en | 双坏点去除开关，0：关闭，1：打开 |
| fast_mode_double_level | 双坏点去除力度，取值范围[0，10] |
| fast_mode_triple_en | 多坏点去除开关，0：关闭，1：打开 |
| fast_mode_triple_level | 多坏点去除力度，取值范围[0，10] |

CalibDb\_Dpcc\_Sensor\_t

### 【说明】

定义自动模式下Fast mode属性

【定义】

typedef struct CalibDb\_Dpcc\_Sensor\_s   

```
float en;
float max_level;
float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
float level_single[CALIBDB_DPCC_MAX_ISO_LEVEL];
float level_multiple[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_Sensor_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| en | sensor dpcc开关功能，0：关闭，1:打开 |
| max_level | 去除坏点最大力度 |
| iso | 环境ISO |
| level_single | 去除单个坏点力度 |
| level_multiple | 去除多个坏点力度 |

Adpcc\_bpt\_params\_select\_t

【定义】

typedef Adpcc_bpt_params_t Adpcc_bpt_params_select_t;

Adpcc\_pdaf\_params\_select\_t

### 【说明】

定义自动模式下选择的PDAF模式属性

【定义】

typedef Adpcc\_pdaf\_params\_t Adpcc\_pdaf\_params\_select\_t

Adpcc\_Auto\_Attr\_t

【说明】

定义自动DPCC属性

【定义】

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

【成员】


| 成员名称 | 描述 |
| --- | --- |
| stBasicParams | 自动模式下基本参数 |
| stBptParams | 自动模式下坏点参数 |
| stPdafParams | 自动模式下PDAF模式参数 |
| stFastMode | 自动模式下快速模式参数 |
| stSensorDpcc | 自动模式下Sensor坏点功能参数 |
| stBasicSelect | 自动模式下选择的基本参数 |
| stBptSelect | 自动模式下选择的坏点参数 |
| stPdafSelect | 自动模式下选择的PDAF模式参数 |

Adpcc\_fast\_mode\_attr\_t

【说明】

定义手动模式下快速模式属性

【定义】

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

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| Fast_mode_en | Fast_mode开关功能 |
| fast_mode_single_en | 单坏点去除开关 |
| fast_mode_single_level | 单坏点去除力度，取值范围[0，10] |
| fast_mode_double_en | 双坏点去除开关 |
| fast_mode_double_level | 双坏点去除力度，取值范围[0，10] |
| fast_mode_triple_en | 多坏点去除开关 |
| fast_mode_triple_level | 多坏点去除力度，取值范围[0，10] |

### Adpcc\_sensor\_dpcc\_attr\_t

### 【说明】

定义手动模式下Sensor坏点功能属性

【定义】

typedef struct Adpcc\_sensor\_dpcc\_attr\_s   

```c
{
bool en;
int max_level;
int single_level;
int double_level;
} Adpcc_sensor_dpcc_attr_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| en | sensor dpcc开关功能 |
| max_level | 去除坏点最大力度 |
| single_level | 去除单个坏点力度 |
| double_level | 去除多个坏点力度 |

Adpcc\_Manual\_Attr\_t

【定义】

```c
typedef struct Adpcc_Manual_Attr_s
Adpcc_basic_params_select_t stBasic;
Adpcc_bpt_params_select_t stBpt;
Adpcc_pdaf_params_select_t stPdaf;
Adpcc_fast_mode_attr_t stFastMode;
Adpcc_sensor_dpcc_attr_t stSensorDpcc;
} Adpcc_Manual_Attr_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| stBasicParams | 手动模式下基本参数 |
| stBptParams | 手动模式下坏点参数 |
| stPdafParams | 手动模式下PDAF模式参数 |
| stFastMode | 手动模式下快速模式参数 |
| stSensorDpcc | 手动模式下Sensor坏点功能参数 |

### CalibDb\_Dpcc\_Pdaf\_t

### 【说明】

定义工具PDAF模式属性

### 【定义】

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

### CalibDb\_Dpcc\_set\_RK\_t

【说明】定义RK算法属性

【定义】

typedef struct CalibDb\_Dpcc\_set\_RK\_s   

```
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char sw_dis_scale_min[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char sw_dis_scale_max[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_RK_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rb_enable | 红、蓝通道坏点检测开关 |
| g_enable | 绿通道坏点检测开关 |
| rb_sw_mindis | 红、蓝通道坏点阈值1 |
| g_sw_mindis | 绿通道坏点阈值1 |
| sw_dis_scale_min | 坏点阈值2 |
| sw_dis_scale_max | 坏点阈值3 |

### CalibDb\_Dpcc\_set\_LC\_t

### 【说明】

定义LC算法属性

### 【定义】

typedef struct CalibDb\_Dpcc\_set\_LC\_s   

```
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_LC_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rb_enable | 红、蓝通道坏点检测开关 |
| g_enable | 绿通道坏点检测开关 |
| rb_line_thr | 红、蓝通道坏点阈值1 |
| g_line_thr | 绿通道坏点阈值1 |
| rb_line_mad_fac | 红、蓝通道坏点阈值2 |
| g_line_mad_fac | 绿通道坏点阈值2 |

### CalibDb\_Dpcc\_set\_PG\_t

【说明】

定义PG算法属性

【定义】

```c
typedef struct CalibDb_Dpcc_set_PG_s
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_PG_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rb_enable | 红、蓝通道坏点检测开关 |
| g_enable | 绿通道坏点检测开关 |
| rb_pg_fac | 红、蓝通道坏点阈值 |
| g_pg_fac | 绿通道坏点阈值 |

CalibDb\_Dpcc\_set\_RND\_t

【说明】

定义RND算法属性

### 【定义】

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

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rb_enable | 红、蓝通道坏点检测开关 |
| g_enable | 绿通道坏点检测开关 |
| rb_rnd_thr | 红、蓝通道坏点阈值1 |
| g_rnd_thr | 绿通道坏点阈值1 |
| rb_rnd_offs | 红、蓝通道坏点阈值2 |
| g_rnd_offs | 绿通道坏点阈值2 |

CalibDb\_Dpcc\_set\_RG\_t

### 【说明】

定义RK算法属性

### 【定义】

typedef struct CalibDb\_Dpcc\_set\_RG\_s   

```
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_RG_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rb_enable | 红、蓝通道坏点检测开关 |
| g_enable | 绿通道坏点检测开关 |
| rb_rg_fac | 红、蓝通道坏点阈值 |
| g_rg_fac | 绿通道坏点阈值 |

CalibDb\_Dpcc\_set\_RO\_t

【说明】  

定义RO算法属性

### 【定义】

typedef struct CalibDb\_Dpcc\_set\_RO\_s   

```
unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char rb_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char g_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
} CalibDb_Dpcc_set_RO_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rb_enable | 红、蓝通道坏点检测开关 |
| g_enable | 绿通道坏点检测开关 |
| rb_ro_lim | 红、蓝通道坏点阈值 |
| g_ro_lim | 绿通道坏点阈值 |

CalibDb\_Dpcc\_set\_t

### 【说明】

定义坏点判断条件属性

【定义】

typedef struct CalibDb\_Dpcc\_set\_s   

CalibDb\_Dpcc\_set\_RK\_t rk;   

CalibDb\_Dpcc\_set\_LC\_t lc;   

CalibDb\_Dpcc\_set\_PG\_t pg;   

CalibDb\_Dpcc\_set\_RND\_t rnd;   

CalibDb\_Dpcc\_set\_RG\_t rg;   

CalibDb\_Dpcc\_set\_RO\_t ro;   

```
} CalibDb_Dpcc_set_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rk | RK算法 |
| lc | LC算法 |
| pg | PG算法 |
| rnd | RND算法 |
| rg | RG算法 |
| ro | RO算法 |

CalibDb\_Dpcc\_Expert\_Mode\_t

### 【说明】

定义工具专家模式属性

【定义】

```c
typedef struct CalibDb_Dpcc_Expert_Mode_s
{
float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_Enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char grayscale_mode;
unsigned char rk_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
```

```
unsigned char dpcc_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_rb_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_g_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_inc_rb_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_inc_g_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_use_fix_set[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_use_set3[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_use_set2[CALIBDB_DPCC_MAX_ISO_LEVEL];
unsigned char stage1_use_set1[CALIBDB_DPCC_MAX_ISO_LEVEL];
CalibDb_Dpcc_set_t set[3];
} CalibDb_Dpcc_Expert_Mode_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| iso | 环境ISO |
| stage1_Enable | 默认值1 |
| grayscale_mode | 黑白模式开关，0：关闭，1：打开 |
| rk_out_sel | RK坏点判断模式，0：模式1，1：模式2，2：模式3 |
| dpcc_out_sel | 坏点矫正模式，0：中值，1：RK模式 |
| stage1_rb_3x3 | 默认值0 |
| stage1_g_3x3 | 默认值0 |
| stage1_inc_rb_center | 默认值1 |
| stage1_inc_g_center | 默认值1 |
| stage1_use_fix_set | 内置坏点判定条件开关，0：关闭，1：打开 |
| stage1_use_set3 | set_cell中第三种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set2 | set_cell中第二种坏点判断条件开关，0：关闭，1：打开 |
| stage1_use_set1 | set_cell中第一种坏点判断条件开关，0：关闭，1：打开 |
| set | 坏点判断条件 |

CalibDb\_Dpcc\_t

【说明】

定义工具DPCC属性

【定义】

### rk\_aiq\_dpcc\_attrib\_t

typedef struct CalibDb\_Dpcc\_s   

```c
int enable;
char version[64];
CalibDb_Dpcc_Fast_Mode_t fast;
CalibDb_Dpcc_Expert_Mode_t expert;
CalibDb_Dpcc_Pdaf_t pdaf;
CalibDb_Dpcc_Sensor_t sensor_dpcc;
} CalibDb_Dpcc_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | 开关功能 |
| version | 版本 |
| fast | 快速模式 |
| expert | 专家模式 |
| pdaf | PADF模式下坏点条件 |
| sensor_dpcc | Sensor自带坏点矫正设置 |

### 【说明】

定义DPCC属性

【定义】

```c
typedef struct rk_aiq_dpcc_attrib_s
{
AdpccOPMode_t eMode;
Adpcc_Auto_Attr_t stAuto;
Adpcc_Manual_Attr_t stManual;
CalibDb_Dpcc_t stTool;
} rk_aiq_dpcc_attrib_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| eMode | api模式 |
| stAuto | 自动DPCC模式 |
| stManual | 手动DPCC模式 |
| stTool | 工具DPCC模式 |

### ASD

### 模块级API参考

rk\_aiq\_user\_api2\_asd\_GetAttrib

【描述】

获取当前环境亮度的计算结果。

【语法】

XCamReturn rk\_aiq\_user\_api2\_asd\_GetAttrib(const rk\_aiq\_sys\_ctx\_t\* sys\_ctx,   

asd\_attrib\_t\* attr);

### 【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| sys_ctx | AIQ上下文指针 | 输入 |
| attr | 计算结果 | 输出 |

【返回值】


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败，详见错误码表 |

### 【需求】

头文件：rk\_aiq\_user\_api2\_asd.h

库文件：librkaiq.so

### 数据类型

asd\_attrib\_t

【说明】

当前环境亮度的计算结果

【定义】

```c
typedef struct asd_attrib_s {
float cur_m2r;
} asd_attrib_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| cur_m2r | 当前平均亮度 |
| 计算方法为： |  |
| exp_val_ratio = cur_exp_val / max_exp_va |  |
| cur_m2r = mean_luma / exp_val_ratio |  |
|  |  |

### Demosaic

### 功能描述

去马赛克主要指将输入的 Bayer 数据转化成 RGB 域数据。

### 模块级API参考

rk\_aiq\_user\_api2\_adebayer\_SetAttrib

【描述】

设置去马赛克属性。

【语法】

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| sys_ctx | AIQ上下文指针 | 输入 |
| attr | 去马赛克属性 | 输入 |

【返回值】


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败，详见错误码表 |

【需求】

头文件：rk\_aiq\_user\_api2\_adebayer.h、rk\_aiq\_uapi2\_adebayer\_int.h

库文件：librkaiq.so

rk\_aiq\_user\_api2\_adebayer\_GetAttrib

【描述】

获取去马赛克属性。

【语法】

【参数】


| 参数名称 | 描述 | 输入/输出 |
| --- | --- | --- |
| sys_ctx | AIQ上下文指针 | 输入 |
| attr | 去马赛克属性 | 输出 |

### 【返回值】


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败，详见错误码表 |

### 【需求】

头文件：rk\_aiq\_user\_api2\_adebayer.h、rk\_aiq\_uapi2\_adebayer\_int.h

库文件：librkaiq.so

### 数据类型

adebayer\_attrib\_t

【说明】

定义ISP去马赛克属性。

【定义】

```c
typedef struct adebayer_attrib_s {
unsigned char enable;
unsigned char enhance_strength[9];
unsigned char low_freq_thresh;
unsigned char high_freq_thresh;
} adebayer_attrib_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| enable | Demosaic模块使能0：关闭1：使能 |
| enhance_strength[9] | 不同ISO下的细节纹理增强强度index 0 - ISO 50index 1 - ISO 100index 2 - ISO 200index 3 - ISO 400index 4 - ISO 800index 5 - ISO 1600index 6 - ISO 3200index 7 - ISO 6400index 8 - ISO 12800值越大细节细碎度和清晰度越好，同时伪细节也会相应增强 |
|  |  |
|  |  |
| low_freq_thresh | 低频权重选取阈值值越大选取低频权重的概率越小 |
| high_freq_thresh | 高频权重选取阈值值越大选取高频权重的概率越小 |

### 统计信息

## 概述

ISP21支持对图像数据处理获取到AWB / AE / AF 3A控制算法需要的相关的统计信息，大致框图如下：



### 功能描述

### AE统计信息

AE硬件统计信息主要包含以下几个部分：基于raw图的256段带权重直方图统计信息、基于raw图的分块R/G/B/Y 均值统计信息；基于gamma前RGB图的32段带权重直方图统计信息、基于gamma前RGB图的分块R/G/B/Y 均值统计信息。

### 基于raw图的AE统计

该模块统计分为分块亮度统计和直方图统计。根据支持的分块大小和是否含有子窗口统计，统计模式又可分为big模式、lite模式。

big模式：最大支持全局15X15分块，最小支持1X1分块，每个分块均可输出10bit R/B通道亮度均值和12bit G通道均值，默认采用15X15分块；在全局分块的基础上，支持独立设置4个子窗口，每个子窗口均可输出29bit R/B通道亮度总和和32bit G通道总和，亮度均值需要在软件中除以每个子窗口的像素数求得。该模式下的带权重直方图统计，根据分块数和对应分配的权重，进行256段8bit亮度统计，每个亮度分段内像素数的有效bit数为28bit。

### 基于RGB图的AE统计

该模块统计分为分块亮度统计和直方图统计。

分块亮度统计，最大支持15X15分块，最小支持1x1分块，每个分块均可输出10bit R/B通道亮度均值和12bit G通道均值，默认采用15X15分块；在全局分块的基础上，支持独立设置4个子窗口，每个子窗口均可输出32bit Y通道亮度总和，亮度均值需要在软件中除以每个子窗口的像素数求得。

直方图统计，最大支持15X15分块，最新支持5X5分块，该模式下的带权重直方图统计，根据分块数和对应分配的权重，进行32段8bit亮度统计，每个亮度分段内像素数的有效bit数为16bit。

### AWB统计信息

AWB硬件统计信息包含全局统计信息和区域统计信息。

全局统计信息：图像全局AWB统计窗口内分色温区域的R,G,B均值，以及有效统计点的个数，色温区域支持7个色温。

分块统计信息：图像全局AWB统计窗口内15x15分块，每个分块的R,G,B均值。

### AF统计信息

AF硬件统计信息包含2个主窗口统计信息以及1个主窗口中分块统计信息。

主窗口统计信息：AF统计主窗口内AF统计信息。

分块统计信息：AF统计主窗口内15x15分块的统计信息。

ISP21 AF硬件统计模块框图



API参考

数据类型

rk\_aiq\_isp\_stats\_t

【说明】AIQ 3A统计信息

【定义】

```c
typedef struct {
rk_aiq_isp_aec_stats_t aec_stats;
rk_aiq_awb_stat_res_v200_t awb_stats_v200;
rk_aiq_isp_af_stats_t af_stats;
} rk_aiq_isp_stats_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| aec_stats | ae统计信息 |
| awb_stats_v200 | awb统计信息 |
| af_stats | af统计信息 |

### RKAiqAecStats\_t

### 【说明】

定义AE数据信息，详细内容参见AE章节的功能描述。

【定义】

```c
typedef struct RKAiqAecStats_s {
RkAiqAecHwStatsRes_t ae_data;
RKAiqAecExpInfo_t ae_exp;
} RKAiqAecStats_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| RkAiqAecHwStatsRes_t | AE模块硬件统计信息 |
| RKAiqAecExpInfo_t | AE模块sensor曝光信息 |

### RKAiqAecExpInfo\_t

【说明】

AE模块曝光参数信息

【定义】

```c
typedef struct RKAiqAecExpInfo_s {
RkAiqExpParamComb_t LinearExp;
RkAiqExpParamComb_t HdrExp[3];
unsigned short line_length_pixels;
unsigned short frame_length_lines;
float pixel_clock_freq_mhz;
} RKAiqAecExpInfo_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| LinearExp | 非HDR模式的曝光参数信息 |
| HdrExp | HDR模式的曝光参数信息 |
| line_length_pixels | hts，其值由sensor的配置序列决定 |
| frame_length_lines | vts，其值由sensor的配置序列决定 |
| pixel_clock_freq_mhz | pclk，单位MHz，其值由sensor的配置序列决定 |

### 【注意事项】

HdrExp表示HDR模式下的曝光参数信息，至多支持3TO1。HDR 2TO1: 下标0表示短帧曝光参数，下标1表示长帧曝光参数，下标2无效；HDR 3TO1：下标0表示短帧曝光参数，下标1表示中帧曝光参数，下标2表示长帧曝光参数。

### RkAiqExpParamComb\_t

【说明】

AE模块曝光参数信息详细内容

【定义】

```c
typedef struct {
RkAiqExpRealParam_t exp_real_params; //real value
RkAiqExpSensorParam_t exp_sensor_params;//reg value
} RkAiqExpParamComb_t;
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
} RkAiqExpSensorParam_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| integration_time | 曝光积分时间，单位为秒 |
| analog_gain | sensor的模拟增益/Total增益 |
| digital_gain | sensor的数字增益，暂时无效。数字增益大小合并到analog_gain |
| isp_dgain | isp的数字增益，暂时无效 |
| iso | 感光度，暂时无效 |
| dcg_mode | dual conversion gain模式 |
| fine_integration_time | fine曝光积分时间寄存器值，暂时无效 |
| coarse_integration_time | 曝光积分时间寄存器值【行数】 |
| analog_gain_code_global | sensor模拟增益寄存器值 |
| digital_gain_global | sensor数字增益寄存器值，暂时无效 |
| isp_digital_gain | isp数字增益寄存器值，暂时无效 |

### 【注意事项】

不同sensor的数字增益作用不同，有的是用于增大感光度范围，有的是用于补足模拟增益的精度。因此目前先不将数字增益单独列出，其大小和对应寄存器值全部并入模拟增益中。

dual conversion gain模式共有三种状态，值为-1代表sensor不支持dcg，值为0代表LCG，值为1代表HCG

### RkAiqAecHwStatsRes\_t

【说明】AE模块硬件统计信息

### 【定义】

```c
typedef struct RkAiqAecHwStatsRes_s {
Aec_Stat_Res_t chn[3];
Aec_Stat_Res_t extra;
struct yuvae_stat yuvae;
struct sihist_stat sihist;
} RkAiqAecHwStatsRes_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| Aec_Stat_Res_t | AE模块基于raw图的统计信息，兼容HDR与非HDR模式，至多支持HDR 3TO1S/M/L的统计信息。 |
| yuvae_stat | AE模块基于gamma前RGB图的分块信息 |
| sihist_stat | AE模块基于gamma前RGB图的直方图信息 |

### 【注意事项】

Aec\_Stat\_Res\_t chn[3]： 代表HDR Merge模块前3个Raw数据通路的统计信息。非HDR模式，对应下标为0，其他下标均无效；HDR 2TO1模式，对应下标为0时表示短帧数据通路统计信息、下标1表示长帧数据通路统计信息，下标2无效；HDR 3TO1模式，对应下标为0时表示短帧数据通路统计信息、下标1表示中帧数据通路统计信息、下标2表示长帧数据通路统计信息。基于raw图的统计模块之前有BLC AWB模块，因此基于raw图的统计信息受BLC、AWB的增益值影响。

Aec\_Stat\_Res\_t extra：HDR模式下，extra表示HDR合成后经debayer的raw图统计信息。该统计模块之前有BLC、 AWB、 HDRMERGE、 TMO模块，因此该模块的统计信息受BLC、 AWB、HDRMERGE、TMO的增益影响。

### Aec\_Stat\_Res\_t

### 【说明】

AE模块基于raw图的统计信息

【定义】

```c
typedef struct Aec_Stat_Res_s {
//rawae
struct rawaebig_stat rawae_big;
struct rawaelite_stat rawae_lite;
//rawhist
struct rawhist_stat rawhist_big;
struct rawhist_stat rawhist_lite;
} Aec_Stat_Res_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| rawaebig_stat | 基于raw图的big模式分块统计信息 |
| rawaelite_stat | 基于raw图的lite模式分块统计信息 |
| rawhist_stat | 基于raw图的直方图统计信息 |

### 【注意事项】

有关基于raw图统计的big、lite模式区别详见功能描述模块。由于big与lite模式的主要区别在于分块统计均值亮度的块数及是否支持子窗口均值亮度统计，故此处基于raw图的big、lite模式直方图统计具有相同的数据结构。

### rawaebig\_stat

### 【说明】

基于raw图的big模式统计信息，包含全局窗口分块R/G/B均值亮度、子窗口R/G/B亮度总和

### 【定义】

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

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| channelr_xy | big模式全局窗口分块的r通道均值亮度信息。有效比特数：10bit。 |
| channelg_xy | big模式全局窗口分块的g通道均值亮度信息。有效比特数：12bit。 |
| channelb_xy | big模式全局窗口分块的b通道均值亮度信息。有效比特数：10bit。 |
| wndx_sumr | big模式子窗口的r通道亮度和信息。有效比特数：29bit。 |
| wndx_sumg | big模式子窗口的g通道亮度和信息。有效比特数：32bit。 |
| wndx_sumb | big模式子窗口的b通道亮度和信息。有效比特数：29bit。 |

### 【注意事项】

基于raw图的big模式统计信息，仅包含R/G/B 3通道的统计信息，如需Y通道统计信息，可在软件中添加代码根据R/G/B统计值计算。

基于raw图的big模式全局窗口分块统计信息为做了除法的均值亮度统计信息，但子窗口为整个窗口的亮度和信息，需要在软件添加代码计算子窗口的均值亮度统计信息。

结构体中的channely\_xy、wndx\_channelr、 wndx\_channelg、wndx\_channelb、wndx\_channely参数皆为软件计算参数，需要添加代码，根据硬件统计值计算求得。

### rawaelite\_stat

### 【说明】

基于raw图的lite模式统计信息，包含全局窗口分块R/G/B均值亮度

### 【定义】

```c
struct rawaelite_stat {
unsigned short channelr_xy[RAWAELITE_WIN_NUM];
unsigned short channelg_xy[RAWAELITE_WIN_NUM];
unsigned short channelb_xy[RAWAELITE_WIN_NUM];
unsigned int channely_xy[RAWAELITE_WIN_NUM]; //not HW!
};
#define RAWAELITE_WIN_NUM 25
```

### 【成员】

成员名称 描述  

channelr\_xy big模式全局窗口分块的r通道均值亮度信息。有效比特数：10bit。  

channelg\_xy big模式全局窗口分块的g通道均值亮度信息。有效比特数：12bit。  

channelb\_xy big模式全局窗口分块的b通道均值亮度信息。有效比特数：10bit。

### 【注意事项】

基于raw图的lite模式统计信息，仅包含R/G/B 3通道的统计信息，如需Y通道统计信息，可在软件中添加代码根据R/G/B统计值计算。

结构体中的channely\_xy为软件计算参数，需要添加代码，根据硬件统计值计算求得。

### rawhist\_stat

### 【说明】

基于raw图的直方图统计信息

### 【定义】

```c
struct rawhist_stat {
unsigned int bins[RAWHIST_BIN_N_MAX];
};
#define RAWHIST_BIN_N_MAX 256
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| bins | 直方图的分段，共256段，有效bit数：28bit |

### yuvae\_stat

### 【说明】

基于gamma前RGB图的分块均值亮度统计信息，包含全局窗口分块Y通道均值亮度、子窗口Y通道亮度总和

### 【定义】

```c
struct yuvae_stat {
unsigned long int ro_yuvae_sumy[YUVAE_SUBWIN_NUM];
unsigned char mean[YUVAE_WIN_NUM];
};
#define YUVAE_SUBWIN_NUM 4
#define YUVAE_WIN_NUM 225
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| ro_yuvae_sumy | 子窗口的Y通道亮度总和，有效bit数：32bit |
| mean | 全局窗口分块Y通道均值亮度，有效bit数：8bit |

### 【注意事项】

基于raw图的lite模式统计信息，仅包含R/G/B 3通道的统计信息，如需Y通道统计信息，可在软件中添加代码根据R/G/B统计值计算。

结构体中的channely\_xy为软件计算参数，需要添加代码，根据硬件统计值计算求得。

### sihist\_stat

### 【说明】

基于gamma前RGB图的直方图计信息

【定义】

```c
struct sihist_stat {
unsigned int bins[SIHIST_BIN_N_MAX];
};
#define SIHIST_BIN_N_MAX 32
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| bins | 直方图的分段，共32段，有效比特数：16bit |

### rk\_aiq\_awb\_stat\_res\_v200\_t

### 【说明】

定义白平衡硬件统计信息

【定义】

```c
typedef struct rk_aiq_awb_stat_res_v200_s {
rk_aiq_awb_stat_wp_res_light_v200_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
rk_aiq_awb_stat_blk_res_v200_t blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
```

rk\_aiq\_awb\_stat\_wp\_res\_light\_v200\_t   

multiwindowLightResult[RK\_AIQ\_AWB\_MAX\_WHITEREGIONS\_NUM];   

rk\_aiq\_awb\_stat\_wp\_res\_v200\_t   

excWpRangeResult[RK\_AIQ\_AWB\_STAT\_WP\_RANGE\_NUM\_V200];   

```
} rk_aiq_awb_stat_res_v200_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| light | 主窗口下不同光源下的白点统计结果，最多RK_AIQ_AWB_MAX_WHITEREGIONS_NUM个光源; |
| blockResult | 每个块的RGB累加，图像进行不重叠同尺寸的15x15（RK_AIQ_AWB_GRID_NUM_TOTAL）分块 |
| multiwindowLightResult | 几个子窗口内不同光源下的白点统计结果，最多RK_AIQ_AWB_MAX_WHITEREGIONS_NUM个光源; |
| excWpRangeResult | 落在非白点区域里的非白点统计结果，最多RK_AIQ_AWB_STAT_WP_RANGE_NUM_V200个非白点区域 |

### 【注意事项】

如果用户希望获取主窗口全局的白点统计结果，根据所有光源下的白点统计结果可以简单换算得到。

rk\_aiq\_awb\_stat\_wp\_res\_light\_v200\_t

### 【说明】

定义某个光源下的白点统计结果

【定义】

【成员】


| 成员名 称 | 描述 |
| --- | --- |
| xYType | 某个光源下不同大小的XY框的白点统计结果，最多 RK AIQ AWB XY TYPE MAX V200个框 |

### rk\_aiq\_awb\_stat\_wp\_res\_v200\_t

【说明】

定义某个光源某个大小的XY框下的白点统计结果，后非白点区域里的非白点统计结果

【定义】

```c
typedef struct rk_aiq_awb_stat_wp_res_v200_s {
unsigned int WpNo;
unsigned int Rvalue;
unsigned int Gvalue;
unsigned int Bvalue;
} rk_aiq_awb_stat_wp_res_v200_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| WpNo | (非)白点数量 |
| Rvalue | (非)白点R通道的累加和 |
| Gvalue | (非) 白点G通道的累加和 |
| Bvalue | (非)白点B通道的累加和 |

rk\_aiq\_awb\_stat\_blk\_res\_v200\_t

【说明】  

定义每个块的统计结果

【定义】

```c
typedef struct rk_aiq_awb_stat_blk_res_v200_s {
unsigned int Rvalue;
unsigned int Gvalue;
unsigned int Bvalue;
bool isWP[RK_AIQ_AWB_STORE_LS_WPFLAG_NUM];
} rk_aiq_awb_stat_blk_res_v200_t;
```

【成员】


| 成员名称 | 描述 |
| --- | --- |
| isWP | 块内是否包含某个光源白点的标志，最多纪录RK_AIQ_AWB_STORE_LS_WPFLAG_NUM个光源的标志 |
| Rvalue | 块内所有点R通道的累加和 |
| Gvalue | 块内所有点RG通道的累加和 |
| Bvalue | 块内所有点RB通道的累加和 |

rk\_aiq\_af\_algo\_stat\_t

【说明】定义AF统计信息

【定义】

```c
typedef struct {
unsigned int roia_sharpness;
unsigned int roia_luminance;
unsigned int roib_sharpness;
unsigned int roib_luminance;
unsigned int global_sharpness[RKAIQ_RAWAF_SUMDATA_NUM];
struct timeval focus_starttim;
struct timeval focus_endtim;
int64_t sof_tim;
} rk_aiq_af_algo_stat_t;
```

### 【成员】


| 成员名称 | 描述 |
| --- | --- |
| roia_sharpness | 主窗口的清晰度值; |
| roia_luminance | 主窗口的亮度值; |
| roib_sharpness | 独立窗口的清晰度值; |
| roib_luminance | 独立窗口的亮度值; |
| global_sharpness | 主窗口下15*15子窗口的清晰度值; |
| focus_starttim | 最近一次VCM移动的起始时间; |
| focus_endtim | 最近一次VCM移动的结束时间; |
| sof_tim | 本次数据帧的帧开始时间，单位ns; |

### 【注意事项】

roia\_sharpness/roia\_luminance/roib\_sharpness/roib\_luminance/global\_sharpness为AF硬件统计信息。

focus\_starttim/focus\_endtim/sof\_tim为VCM移动时间和数据帧的帧开始时间，辅助确认VCM是否移动结束，AF硬件统计信息是否可靠。

### Debug & FAQ

### 如何获取版本号

aiq提供了版本发布日期、aiq版本、iq解析器版本及isp各个算法模块的版本信息；

### 获取简略版本信息

strings librkaiq.so | grep -w AIQ   

AIQ: v0.1.6

### 获取完整版本信息

1. SDK中aiq库默认编译为Release版本，需要改成Debug版本，重新编译aiq库后更新到设备。

SDK/external/camera\_engine\_rkaiq/CMakeLists.txt:

```cmake
8
9 if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
10 add_definitions(-DBUILD_TYPE_DEBUG)
11 endif()
```

改成：

```cmake
8
9 #if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
10 add_definitions(-DBUILD_TYPE_DEBUG)
11 #endif()
```

2. 默认打印级别下，加载运行的aiq库不会打印，可以设置xcore模块的log级别，以打印aiq版本信息：

```typescript
export persist_camera_engine_log=0x1000000ff2
```

3. aiq启动时打印版本信息如下所示：

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* VERSION INFOS \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*   

version release date: 2020-06-05   

AIQ: v0.1.6   

IQ PARSER: v1.0.0   

RK INTEGRATED ALGO MODULES:   

AWB: v0.0.9   

AEC: v0.1.1   

AF: v0.0.9   

AHDR: v0.0.9   

ANR: v0.0.9   

ASHARP: v0.0.9   

ADEHAZE: v0.0.9   

AGAMMA: v0.0.9   

A3DLUT: v0.0.9   

ABLC: v0.0.9   

ACCM: v0.0.9   

ACGC: v0.0.9   

ACP: v0.0.9   

ADEBAYER: v0.0.1   

ADPCC: v0.0.9   

AGIC: v0.0.9   

AIE: v0.0.1   

ALDCH: v0.0.9   

ALSC: v0.0.9   

AORB: v0.0.9   

AR2Y: v0.0.9   

ASD: v0.0.9   

AWDR: v0.0.9   

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* VERSION INFOS END \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

### 版本号匹配规则说明

AIQ与IQ Tool、ISP Driver的版本匹配规则如下：

v A . B. C

其中B为16进制表示，bit[0:3] 标识 AIQ与IQ Tool的匹配版本，bit[4:7]标识AIQ与ISP driver的匹配版本，例如：

ISP driver：v 1. 0x3.0 与 AIQ：v1.0x30.0匹配，与AIQ：v1.0x40.0不匹配。

IQ tool：v 1. 0x3.0 与 AIQ：v1.0x33.0匹配，与AIQ：v1.0x30.0不匹配， 其中AIQ 版本号C不为0，有可能出现版本不匹配的情况，针对IQ Tool匹配建议优先采用C版本号为0的AIQ版本。

### AIQ Log

### Log开关

1. aiq采用64bits表示所有模块的log级别，表示各个模块的位图及说明如下：

bit: [63-39] 38 37 36 35 34 33 32 31   

mean: [U] [CAMHW][ANALYZER][XCORE][ASD][AFEC][ACGC][AORB][ASHARP]   

bit: 30 29 28 27 26 25 24 23 22   

mean:[AIE][ACP][AR2Y][ALDCH][A3DLUT][ADEHAZE][AWDR][AGAMMA][ACCM]   

bit: 21 20 19 18 17 16 15 14 13 12   

mean:[ADEBAYER][AGIC][ALSC][ANR][AHDR][ADPCC][ABLC][AF][AWB][AEC]   

bit: 11-4 3-0   

mean:[sub modules][level]   

[U] means unused now.   

[level] : use 4 bits to define log levels.   

each module log has following ascending levels:   

0: error   

1: warning   

2: info   

3: debug   

4: verbose   

5: low1   

6-7: unused, now the same as debug   

[sub modules] : use bits 4-11 to define the sub modules of each module,   

thespecific meaning of each bit is decided by the module itself. These bitsis   

designed to implement the sub module's log switch.   

[modules] : AEC, AWB, AF ...   

set debug level example:   

eg. set module af log level to debug, and enable all sub modules of af:   

Android:   

setprop persist.vendor.rkisp.log 0x4ff4   

Linux:   

```
export persist_camera_engine_log=0x4ff4
```

And if only want enable the sub module 1 log of af:   

Android:   

setprop persist.vendor.rkisp.log 0x4014   

Linux:   

```
export persist_camera_engine_log=0x4014
```

2. 模块log级别配置：

如上说明，linux环境下通过设置环境变量persist\_camera\_engine\_log来控制各个模块的开关级别。

例如开启af模块的log开关，并且级别为verbose，则bit[14] = 1, bit[3-0] = 4， 所以在应用程序执行前执行：

```
export persist_camera_engine_log=0x4014
```

查看当前log级别可通过如下命令：

[root@RV1126\_RV1109:/]# echo \$persist\_camera\_engine\_log   

0x4014

## 3. 各模块开关列表


| 模块 | Debug log | Verbose log |
| --- | --- | --- |
| AE | exportpersist_camera_engine_log=0x1ff3 | exportpersist_camera_engine_log=0x1ff4 |
| AF | exportpersist_camera_engine_log=0x4ff3 | exportpersist_camera_engine_log=0x4ff4 |
| AWB | exportpersist_camera_engine_log=0x2ff3 | exportpersist_camera_engine_log=0x2ff4 |
| NR | exportpersist_camera_engine_log=0x40fff |  |

### Log解读

AE

由于篇幅限制，此处仅对debug等级的log进行内容解读。

线性模式AE LOG   

rk aiq algo ae itf.cpp:262: Cur-Exp: FrmId=270,qain=0x36a,time=0x576,envChange=0,dcq=-1,pirs=0   

rk\_aiq\_algo\_ae\_itf.cpp:266: Last-Res:FrmId=269,gain=0x356,time=0x576,pirs=0   

rk aiq ae algo.cpp:5861: ===== =============== Linear-AE (enter)======:   

rk aiq ae algo.cpp:5881: &gt;&gt;&gt; Framenum=270 Cur gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=34.875557,IsConverged=0   

rk\_aiq\_ae\_algo.cpp:2961: AecClmExecute: NewExposure(0.172051) SplitGain(5.735024) SplitIntegrationTime(0.030000) SplitPirisGain(0)   

rk\_aiq\_ae\_algo.cpp:5952: calc result:SetPoint=22.000000,gain=5.720671,time=0.029987,piris=0,reggain=845,regtime=1398   

rk\_aiq\_ae\_algo.cpp:6133: : (exit)  

图3-1 线性模式AE LOG

如图3-1所示为线性模式的AE LOG示例。

Line1：

```javascript
Cur-Exp: FrmId=270,gain=0x36a,time=0x576,envChange=0,dcg=-1,pirs=0
```

当前帧的曝光参数信息。


| 成员名称 | 描述 |
| --- | --- |
| Frmld | 当前帧的帧号 |
| gain | 当前帧对应的sensor曝光增益寄存器值 |
| time | 当前帧对应的sensor曝光时间寄存器值 |
| envChange | 当前帧是否发生环境亮度突变。0：环境亮度无突变；1：环境亮度突变 |
| dcg | 当前帧对应的dcg模式。-1：sensor不支持dcg模式 或sensor内部进行dcg模式的切换；0：LCG模式；1：HCG模式 |
| pirs | 当前帧对应的p-iris光圈步进电机位置。若Airis功能关闭，该参数无效，无意义。 |

Line2：

Last-Res:FrmId=269,gain=0x356,time=0x576,pirs=0

上次运行AE设置的新曝光参数，部分参数与（1）中含义一致，此处不再赘述。通过比较Line1与Line2的曝光参数LOG信息，可知当前曝光是否与新曝光一致，即新曝光是否已经生效。

Line3：

================================= Linear-AE   

(enter)=========================

进入AE控制算法模块，Linear-AE表示当前为线性曝光模式。

Line4：

```csv
Framenum=270
Cur
gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=3
4.875557,IsConverged=0
```


| 成员名称 | 描述 |
| --- | --- |
| Framenum | 当前帧的帧号 |
| gain | 当前帧对应的sensor曝光增益值 |
| time | 当前帧对应的sensor曝光时间值 |
| pirisGain | 当前帧对应的p-iris光圈等效增益值。若Airis功能关闭，该参数无效，无意义。 |
| RawMeanluma | 当前帧对应的debayer前raw图亮度，已扣除黑电平，并乘上awb gain。 |
| YuvMeanluma | 当前帧对应的gamma前RGB图亮度，用于判断debayer后的模块对亮度的影响。 |
| IsConverged | 当前帧曝光是否已经收敛。0：曝光未收敛；1：曝光已收敛 |

Line 5：

AecClmExecute: NewExposure(0.180993) SplitGain(6.033096) SplitIntegrationTime(0.030000) SplitPirisGain(0)


| 成员名称 | 描述 |
| --- | --- |
| NewExposure | AE控制算法得出的新曝光量值 |
| SplitGain | 新sensor曝光增益 |
| SplitIntegrationTime | 新sensor曝光时间 |
| SplitPirisGain | 新p-iris光圈等效增益值。若Airis功能关闭，该参数无效，无意义。 |

Line6:

最终设置的新曝光


| 成员名称 | 描述 |
| --- | --- |
| SetPoint | 目标亮度值 |
| gain | 最终的新曝光增益值 |
| time | 最终的新曝光时间值 |
| piris | 最终的新p-iris光圈等效增益值。若Airis功能关闭，该参数无效，无意义。 |
| reggain | 最终的新曝光增益值对应的寄存器值 |
| regtime | 最终的新曝光时间值对应的寄存器值 |

综上，可得知当前帧的画面亮度RawMeanLuma，以及对应的目标亮度setpoint。通过比较画面亮度和目标亮度，计算新曝光。

Hdr模式AE LOG:   

rk aig algo ae itf.cpp:246: Cur-Exp: FrmId=22.S-gain=0x0.S-time=0x2b6.M-gain=0xb.M-time=0x1a5e.L-gain=0x0.L-time=0x0.envChange=1.dcg=-1--1--1.Piris=0   

rk\_aiq\_algo\_ae\_itf.cpp:254: Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L-gain=0x0,L-time=0x0   

rk aig ae algo.cpp:5983: === === HDR-AE (enter) ==   

rk aiq ae algo.cpp:6004: AecRun: SMeanLuma=9.342692, MMeanLuma=37.698597,LMeanLuma=0.000000,TmoMeanluma=37.571430,Isconverged=0,Longfrm=0   

rk aig ae algo-cpp:6013: &gt;&gt;&gt; Framenum=22 Cur Piris=0. Sgain=1.000000-Stime=0.002570.mgain=1.462177.mtime=0.025000.lgain=1.000000.1time=0.000000   

rk\_aiq\_ae\_algo.cpp:3308: S-HighLightLuma=197.250000,S-Target=100.000000,S-GlobalLuma=9.342692,S-Target=19.959433   

rk\_aiq\_ae\_algo.cpp:3733: L-LowLightLuma=29.626642,L-Target=48.572094,L-GlobalLuma=37.698597,L-Target=77.620155   

rk aiq ae algo.cpp:6110: calc result:piris=0,sgain=1.000000,stime=0.005081,mgain=1.862087,mtime=0.025000,1gain=0.000000,1time=0.000000   

rk\_aiq\_ae\_algo.cpp:6133: == == (exit)=  

图3-2 Hdr模式AE LOG

Line1:

Cur-Exp: FrmId=22,S-gain=0x0,S-time=0x2b6,M-gain=0xb,M-time=0x1a5e,L-gain=0x0,L  

time=0x0,envChange=1,dcg=-1--1--1,Piris=0

当前帧的曝光参数信息。


| 成员名称 | 描述 |
| --- | --- |
| Frmld | 当前帧的帧号 |
| S/M/L-gain | 当前Hdr各帧对应的sensor曝光增益寄存器值。HDR 2帧模式时，S/M有效；HDR 3帧模式时，S/M/L皆有效。 |
| S/M/L-time | 当前Hdr各帧对应的sensor曝光时间寄存器值。HDR 2帧模式时，S/M有效；HDR 3帧模式时，S/M/L皆有效。 |
| envChange | 当前帧是否发生环境亮度突变。0：环境亮度无突变；1：环境亮度突变 |
| dcg | 当前帧对应的dcg模式，分别对应短中长3帧。Hdr2帧模式时，前两个数值有效，分别代表短长帧的dcg模式；Hdr3帧模式时，三个数值分别代表短中长的dcg模式。-1：sensor不支持dcg模式或 sensor内部进行dcg模式的切换；0：LCG模式；1：HCG模式 |
| pirs | 当前帧对应的p-iris光圈步进电机位置。若Airis功能关闭，该参数无效，无意义。 |

### Line2:

```html
Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L
gain=0x0,L-time=0x0
```

上次运行AE设置的新曝光参数，部分参数与（1）中含义一致，此处不再赘述。通过比较Line1与Line2的曝光参数LOG信息，可知当前曝光是否与新曝光一致，即新曝光是否已经生效。

Line3:

```html
================================= HDR-AE
(enter)===============================
```

进入AE控制算法模块，HDR-AE表示当前为HDR曝光模式。

Line4:


| 成员名称 | 描述 |
| --- | --- |
| S/M/LMeanLuma | 当前Hdr各帧的亮度均值。HDR 2帧模式时，S/M有效；HDR 3帧模式时，S/M/L皆有效。 |
| TmoMeanluma | 当前帧TMO模块输出的亮度均值。 |
| Isconverged | 当前Hdr各帧曝光量是否收敛。0：曝光未收敛；1：曝光已收敛。 |
| Longfrm | 当前帧的长帧模式状态。0：长帧模式关闭；1：长帧模式开启。 |

### Line5：


| 成员名称 | 描述 |
| --- | --- |
| Framenum | 当前帧的帧号 |
| s/m/lgain | 当前帧对应的sensor曝光增益值。HDR 2帧模式时，s/m有效；HDR 3帧模式时，s/m/l皆有效。 |
| s/m/ltime | 当前帧对应的sensor曝光时间值。HDR 2帧模式时，s/m有效；HDR 3帧模式时，s/m/l皆有效。 |
| piris | 当前帧对应的p-iris光圈等效增益值。若Airis功能关闭，该参数无效，无意义。 |

Line6:

S-HighLightLuma=197.250000,S-Target=100.000000,S-GlobalLuma=9.342692,S-Target=19.959433

短帧控制算法LOG


| 成员名称 | 描述 |
| --- | --- |
| S-HighLightLuma | 当前短帧高亮区域亮度。 |
| S-Target | 当前短帧高亮区域目标亮度。 |
| S-GlobalLuma | 当前短帧全局区域平均亮度。 |
| S-Target | 当前短帧全局区域目标亮度。 |

Line7:

L-LowLightLuma=29.626642,L-Target=48.572094,L-GlobalLuma=37.698597,L-Target=77.620155

长帧控制算法LOG


| 成员名称 | 描述 |
| --- | --- |
| L-LowLightLuma | 当前长帧暗区亮度 |
| L-Target | 当前长帧暗区目标亮度。 |
| L-GlobalLuma | 当前长帧全局区域平均亮度。 |
| L-Target | 当前长帧全局区域目标亮度。 |

Line8:

AE控制算法输出的曝光结果

if (cur\_time &gt;= zoom\_end\_time)   

zoom\_stable = true;   

else   

zoom\_stable = false;   

zoom\_start\_time、zoom\_end\_time从zoom驱动查询得到


| 成员名称 | 描述 |
| --- | --- |
| s/m/lgain | 最终新sensor曝光增益值。HDR 2帧模式时，s/m有效；HDR 3帧模式时s/m/l皆有效。 |
| s/m/ltime | 最终新sensor曝光时间值。HDR 2帧模式时，s/m有效；HDR 3帧模式时，s/m/l皆有效。 |
| piris | 最终新p-iris光圈等效增益值。若Airis功能关闭，该参数无效，无意义。 |

### AF

### 1）每帧的AF统计值

rk\_aiq\_algo\_af\_itf.cpp:465: AFProcessing: sharpness roia: 2454915276 - 16253362 roib: 4770628 - 7350891 vcm\_stable: 1, 1618759, 1618375, 1618382, 30.006588, sof\_tim 1618712, zoom\_stable 1


| 成员名称 | 描述 |
| --- | --- |
| roia | window A的FV值和亮度值 |
| roib | window B的FV值和亮度值 |
| vcm_stable | vcm移动是否结束标记：0：未结束1：结束当前时刻,单位msvcm移动起始时刻，单位msvcm移动结束时刻，单位ms当前帧曝光时间，单位ms |
| sof_tim | 当前帧的帧数据传输起始时刻，单位ms |
| zoom_stable | zoom缩放是否结束 |

vcm\_stable的判断方法

if (sof\_time &gt;= vcm\_end\_time + exposure\_time + extraDelay)   

vcm\_stable = true;

else

vcm\_stable = false;

extraDelay在IQ xml中指定，可正，可负，可为零

vcm\_start\_time、vcm\_end\_time从vcm驱动查询得到

zoom\_stable的判断方法

2）对焦触发：

af\_trigger.cpp:158: curSharpness: 178.780685, triggered: 1, sceneChanged 1

当前帧FV值与上次成功对焦的FV值的变化大于TrigThers，且连续StableFrames帧的FV变化小于StableThers时，触发对焦。

TrigThers、StableFrames、StableThers由IQ xml指定

### 3）搜索路径：

af\_trigger.cpp:921: Search list is:

af\_trigger.cpp:933: -&gt;index: 0 pos: 64 stage: 1

af\_trigger.cpp:938: index: 1 pos: 56 stage: 1

af\_trigger.cpp:938: index: 2 pos: 48 stage: 1

af\_trigger.cpp:938: index: 3 pos: 40 stage: 1

af\_trigger.cpp:938: index: 4 pos: 32 stage: 1

af\_trigger.cpp:938: index: 5 pos: 24 stage: 1

af\_trigger.cpp:938: index: 6 pos: 16 stage: 1

af\_trigger.cpp:938: index: 7 pos: 8 stage: 1

af\_trigger.cpp:938: index: 8 pos: 0 stage: 1

### 4）显示当前iso值，并根据iso值更新相关配置

af.cpp:1615: AfCalcMeasCfgByIso: current iso = 599, again 11.999999, dgain 1.000000!

af.cpp:171: AfUpdateMeasIsoCfg: iso = 800

### 5）粗调结果

XCAM INFO (807) af\_search.cpp:25: --&gt; SearchIdx 1 route(search rough) is:

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 0, pos: 64, sharpness: 178.836884,

dSharpness: 0.000000, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 1, pos: 56, sharpness: 177.747253,

dSharpness: -0.003056, abs\_dSharpness: -0.003056, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 2, pos: 48, sharpness: 178.024612,

dSharpness: 0.000780, abs\_dSharpness: -0.002276, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 3, pos: 40, sharpness: 180.054565,

dSharpness: 0.005669, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 4, pos: 32, sharpness: 180.206558,

dSharpness: 0.000422, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 5, pos: 24, sharpness: 180.668610,

dSharpness: 0.001280, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 6, pos: 16, sharpness: 186.813889,

dSharpness: 0.016723, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 7, pos: 8, sharpness: 196.762360,

dSharpness: 0.025936, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 1, index: 8, pos: 0, sharpness: 206.649445,

dSharpness: 0.024509, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:38: MaxSharpnessPos 0, MaxSharpness: 206.649445, MinSharpness: 177.747253

### 6）细调结果

XCAM INFO (807) af\_search.cpp:25: --&gt; SearchIdx 1 route(search fine) is:

XCAM INFO (807) af\_search.cpp:32: stage: 0, index: 0, pos: 8, sharpness: 196.762360,

dSharpness: 0.000000, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 0, index: 1, pos: 4, sharpness: 207.176315,

dSharpness: 0.025781, abs\_dSharpness: 0.000000, skip: 0, quick\_focus: 0

XCAM INFO (807) af\_search.cpp:32: stage: 0, index: 2, pos: 0, sharpness: 206.649445,

dSharpness: -0.001273, abs\_dSharpness: -0.001273, skip: 0, quick\_focus: 1

XCAM INFO (807) af\_search.cpp:38: MaxSharpnessPos 4, MaxSharpness: 207.176315,

MinSharpness: 177.747253

### 7）对焦结果

af\_search.cpp:1010: AfSearching: Found focus(pos: 4 sharpness: 207.176315, distance: 0.000 0)!

### AWB

参考《Rockchip\_Color\_Optimization\_Guide\_ISP2x\_CN》

### 动态抓取raw/yuv图像

### 抓取raw图原理说明

1.目前软件isp的数据流粗略流程为：

sensor(raw) -&gt; csi-tx -&gt; isp-rx -&gt; ... -&gt; isp-&gt; ... -&gt;ispp -&gt; ... -&gt; out-yuv, 其中csi-tx -&gt; isp-rx的raw图数据可以在aiq的hwi层获取到。

aiq根据/tmp/.capture\_cnt中间文件获取用户想保存raw文件的帧数，aiq将对应帧数的raw图写入/tmp目录下。

2.这种抓raw方式仅在isp回读模式下支持。

### 抓raw图步骤

1. 运行rkaiq。

2. echo要抓取的raw图帧数, 例如抓取3帧

linux系统下执行: echo 3 &gt; /tmp/.capture\_cnt   

android系统下执行：echo 3 &gt; /data/.capture\_cnt

3. 在/tmp/capture\_image或/data/capture\_image目录下会生成抓取的raw图及对应的meta信息

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 381 Aug 15 20:40 meta\_data   

android系统下：   

[root@RV1126\_RV1109:/]# ls -l /data/capture\_image/raw\_2017-08-15\_20-40-58/   

total 35932   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 381 Aug 15 20:40 meta\_data

运行rkisp\_demo,抓raw及对应的yuv图像步骤

1. 加--sync-to-raw参数，运行rkisp\_demo，只有rkisp\_demo支持

rkisp\_demo --device /dev/video14 --width 1280 --height 720 --vop --rkaiq --hdr 2   

--sync-to-raw

2. echo要抓取的raw/yuv图帧数, 例如抓取3帧

linux系统下执行: echo 3 &gt; /tmp/.capture\_cnt   

android系统下执行：echo 3 &gt; /data/.capture\_cnt

3. 在/tmp/capture\_image或/data/capture\_image目录下会生成抓取的raw图/meta信息/yuv图像

linux系统下：   

[root@RV1126\_RV1109:/]# ls -l /tmp/capture\_image/raw\_2017-08-15\_20-40-58/   

total 35932   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 381 Aug 15 20:40 meta\_data   

android系统下：   

[root@RV1126\_RV1109:/]# ls -l /data/capture\_image/raw\_2017-08-15\_20-40-58/   

total 35932   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame476\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame477\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_long.raw   

-rw-r--r-- 1 root root 6128640 Aug 15 20:40 frame478\_2688x1520\_short.raw   

-rw-r--r-- 1 root root 381 Aug 15 20:40 meta\_data

4. 如上所示，raw图/meta信息/yuv图像是一一对应

### 旧版IQ文件XML转JSON

### 转换工具路径：

rk\_aiq/tools/iqConverTer/bin/iqConverTer

### 转换工具代码路径:

rk\_aiq/tools/iqConverTer/src/

### 工具编译:

编译完成后会在以下目录生成转换工具:

rk\_aiq/tools/iqConverTer/build/release/bin

### 执行转换程序:

# 第一个参数为旧的XML格式的IQ文件，第二个参数为输出的JSON格式的IQ文件  

./build/release/bin/iqConverTer old.xml new.json

### 转换失败的处理方法:

```shell
# 由于我们的XML文件可能在多个平台上编辑过，导致换行等格式信息上存在一些不标准或者不统一的情况，
我们可以通过以下几个命令来修复
# 需要先安装xmllint工具
# 修复完再次进行转换即可
xmllint --format old.xml > ./new.xml
find -type f -name "*.xml" | xargs -i sed -i "/^[1-9]/ s/^/\ /" {}
```

### 错误码


| 错误代码 | 描述 |
| --- | --- |
| 0 | 成功 |
| -1 | 失败 |
| -2 | 参数无效 |
| -3 | 内存不足 |
| -4 | 文件操作失败 |
| -5 | ANALYZER模块出错 |
| -6 | ISP模块出错 |
| -7 | sensor驱动出错 |
| -8 | 线程操作出错 |
| -9 | IOCTL操作出错 |
| -10 | 时序出错 |
| -20 | 超时 |
| -21 | 超出范围 |
| -255 | 未知错误 |

### 缩略语


| 缩写 | 全称 |
| --- | --- |
| CIS | Camera Image Sensor |
| RkAiq | Rockchip Automatical Image Quality |
| ISP | Image Signal Process |
| IQ Tuning | Image Quality Tuning |
