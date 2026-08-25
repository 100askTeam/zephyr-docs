---
sidebar_position: 1
---

# RGA IM2D API 开发指南

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

## 修订记录


| 日期 | 版本 | 作者 | 修改说明 |
| --- | --- | --- | --- |
| 2020/06/24 | 1.0.0 | 陈城，李煌 | 初始版本 |
| 2020/10/16 | 1.0.1 | 陈城，李煌，余乔伟 | 更新部分接口 |
| 2021/12/07 | 2.0.0 | 陈城，李煌，余乔伟 | 增加RGA3相关支持 |
| 2022/01/20 | 2.1.0 | 陈城，李煌，余乔伟 | - 更新im2d api接口说明- 更新硬件指标说明，以及对齐限制- 增加数据结构介绍 |
| 2022/06/22 | 2.1.1 | 陈城，李煌，余乔伟 | 完善格式支持/对齐说明 |
| 2022/09/15 | 2.2.0 | 陈城，李煌，余乔伟 | - 补充默认值相关说明- 新增array接口- 新增task接口- 新增矩形边框绘制接口 |
| 2023/02/09 | 2.2.1 | 余乔伟 | 更正文档格式 |
| 2023/06/28 | 2.2.2 | 余乔伟 | - 增加芯片RK3562介绍-完善针对灰度图的注意事项 |
| 2024/03/06 | 2.2.3 | 余乔伟 | 增加芯片RK3576介绍 |

## 1. 概述

RGA (Raster Graphic Acceleration Unit)是一个独立的2D硬件加速器，可用于加速点/线绘制，执行图像缩放、旋转、bitBlt、alpha混合等常见的2D图形操作。

### 1.1 设计指标


| Version | Codename | Chip | Source | Destination | Function | Pixels/Cycle |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| min | max | min | max |  |  |  |  |  |
| RGA1 | Pagani | RK3066 |  | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 RotateX/Y MirrorCrop1/2~8 scaleAlpha blendColor keyColor fillROPIOMMU(32bit) | 1 |
| JaguarPlus | RK3188 | 2x2 |  |  |  |  |  |  |
| Beetles | RK2926/2928 |  |  |  |  |  |  |  |
| BeetlesPlus | RK3026/3028 |  |  |  |  |  |  |  |
| RGA1_plus | AudiGranite | RK3128Sofia 3gr | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 RotateX/Y MirrorCrop1/2~8 scaleAlpha blendColor keyColor fillColor paletteIOMMU(32bit) | 1 |
| RGA2 | LincolnCapricorn | RK3288/3288wRK3190 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 RotateX/Y MirrorCrop1/16~16 scalescale-up(bi-linear/bi-cubic)scale-down(average)Alpha blendColor keyColor fillColor paletteROPIOMMU(32bit) | 2 |
| RGA2-Lite0 | Maybach | RK3368 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 RotateX/Y MirrorCrop1/8~8 scalescale-up(bi-linear/bi-cubic)scale-down(average)Alpha blendColor keyColor fillColor paletteROPIOMMU(32bit) | 2 |
| BMW | RK3366 |  |  |  |  |  |  |  |
| RGA2-Litel | Benz | RK3228 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 RotateX/Y MirrorCrop1/8~8 scalescale-up(bi-linear/bi-cubic)scale-down(average)Alpha blendColor keyColor fillColor paletteIOMMU(32bit) | 2 |
| Infiniti | RK3228H |  |  |  |  |  |  |  |
| Gemini | RK3326 |  |  |  |  |  |  |  |
| Lion | RK1808 |  |  |  |  |  |  |  |
| RGA2-Enhance | Mclaren | RK3399 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate                 2X/Y MirrorCrop1/16~16 scalescale-up(bi-linear/bi-cubic)scale-down(average)Alpha blendColor key |  |
| Mercury | RK1108 |  |  |  |  |  |  |  |
| Puma | RV1126/RV1109 |  |  |  |  |  |  |  |
| skylarkV2 | RK3566/RK3568 |  |  |  |  |  |  |  |
|  |  |  |  | Color fillColor paletteROP(NA forRV1108/RV1109/RK3566)NN quantize(NA forRK3399/RV1108)osd (onlyRV1106/RV1103/RK3562/RK3528)mosaic(onlyRV1106/RV1103/RK3562/RK3528)IOMMU(32bit, RK3528/RK3562为40bit, NA for RV1106/1103) |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |
| Orion | RK3588 |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
| Otter | RV1106/1103 |  |  |  |  |  |  |  |
| Bull | RK3528 |  |  |  |  |  |  |  |
| Snipe | RK3562 |  |  |  |  |  |  |  |
| RGA2-Pro | Heron | RK3576 | 2x2 | 8192x8192 | 2x2 | 8192x8192 | 90/180/270 RotateX/Y MirrorCrop1/16~16 scalescale-up(bi-linear/bi-cubic)scale-down(bi-linear/average)Alpha blendColor keyColor fillColor paletteROPosdmosaicARGB5551 alpha bit maprkfbc64x4(only input)90/180/270 Rotateafbc32x8 splice mode(only input)tile4x4IOMMU(40bit) |  |
| RGA3 | Orion | RK3588 | 68x2 | 8176x8176 | 68x2 | 8128x8128 | X/Y MirrorCrop1/8~8 scalescale-up(bi-cubic)scale-down(average) | 3 (by pass)2 (scale) |
|  |  |  |  |  |  |  |  |  |

<sup>Color</sup> <sup>key</sup>1). 单位时钟周期处理像素的能力为理论数据，实际运行性能表现与带宽、硬件频率等相关，列表数据仅供参考。efbe16x16  

<sub>IOMMU(40bit)</sub>2). 除最小输入分辨率限制外，每个通道可设置的实际操作矩形的x、y、width、height参数必须大于等于2。  

3). RGA的寻址能力和IOMMU的bit位数是相关联的，例如搭载支持32bit IOMMU的RGA实际的物理地址寻址能力仅支持0\~4G的内存空间。

### 1.2 图像格式支持

Pixel Format conversion, BT.601/BT.709/BT.2020(only RGA3)

Dither operation


| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
|  | Pagani | RK3066 |  | RK_FORMAT_RGBA_8888 RK_FORMAT _BGRA_8888 |
| RK FORMAT RGBA 8888 |  |  |  |  |
| RK_FORMAT_BGRA_8888 | RK_FORMAT_ARGB_8888 |  |  |  |
| RK_FORMAT_ARGB_8888 | RK_FORMAT_ABGR_8888 |  |  |  |
| RK_FORMAT_ABGR_8888 | RK_FORMAT_RGBX_8888 |  |  |  |
| RK_FORMAT_RGBX_8888 | RK_FORMAT_BGRX_8888 |  |  |  |
|  | RK_FORMAT_XRGB_8888 |  |  |  |
| RK_FORMAT_BGRX_8888 | RK_FORMAT _XBGR_8888 |  |  |  |
| RK_FORMAT_XRGB_8888 | RK_FORMAT_ARGB_4444 |  |  |  |
| RK_FORMAT_XBGR_8888 | RK_FORMAT_ABGR_4444 |  |  |  |
| RGA1 | Jaguar Plus | RK3188 |  | RK_FORMAT_ARGB_5551 |
| RK_FORMAT_ARGB_4444 | RK FORMAT ABGR 5551 |  |  |  |
| RK_FORMAT_ABGR_4444 | RK_FORMAT_RGB_888 |  |  |  |
| RK_FORMAT_ARGB_5551 | RK_FORMAT_BGR_888 |  |  |  |
| RK_FORMAT_ABGR_5551 |  |  |  |  |
| RK_FORMAT_RGB_888 | RK_FORMAT_RGB_565 RK_FORMAT BGR_565 |  |  |  |
| RK_FORMAT_BGR_888 | RK_FORMAT_YCbCr_420_SP (only for |  |  |  |
| RK_FORMAT_RGB_565 | Blur/sharpness) |  |  |  |
| RK_FORMAT_BGR_565 | RK_FORMAT_YCrCb_420_SP (only for |  |  |  |
| RK_FORMAT_YCbCr_420_SP | Blur/sharpness) |  |  |  |
|  |  | RK_FORMAT_YCrCb_420_SP RK_FORMAT_YCbCr_422_SP | RK_FORMAT_YCbCr_422_SP (only for |  |
|  | Blur/sharpness) RK_FORMAT_YCrCb_422_SP |  |  |  |
| RK_FORMAT_YCbCr_420_P | RK_FORMAT_YCrCb_422_SP (only for |  |  |  |
| RK_FORMAT_YCrCb_420_P | Blur/sharpness) RK_FORMAT_YCbCr_420_P (only for |  |  |  |
| RK FORMAT YCbCr 422 P | Blur/sharpness) |  |  |  |
| RK_FORMAT_YCrCb_422_P | RK_FORMAT_YCrCb_420_P (only for |  |  |  |
| RK_FORMAT_BPP1 | Blur/sharpness) |  |  |  |
| RK_FORMAT_BPP2 | RK_FORMAT_YCbCr_422_P (only for |  |  |  |
| RK_FORMAT_BPP4 | Blur/sharpness) |  |  |  |
|  |  | RK_FORMAT_BPP8 | RK_FORMAT_YCrCb_422_P (only for |  |
|  | Blur/sharpness) |  |  |  |
|  | RK FORMAT RGBA 8888 |  |  |  |
|  | RK_FORMAT_BGRA_8888 |  |  |  |
| RK_FORMAT_RGBA_8888 | RK_FORMAT_ARGB_8888 |  |  |  |
| RK_FORMAT_BGRA_8888 | RK_FORMAT_ABGR_8888 |  |  |  |
| RK_FORMAT_ARGB_8888 | RK_FORMAT_RGBX_8888 |  |  |  |
| RK_FORMAT_ABGR_8888 | RK_FORMAT_BGRX_8888 |  |  |  |
| RK_FORMAT_RGBX_8888 | RK_FORMAT_XRGB_8888 |  |  |  |
|  | RK3128 | RK FORMAT BGRX 8888 | RK_FORMAT_XBGR_8888 |  |
| RK_FORMAT_XRGB_8888 | RK_FORMAT_ARGB_4444 |  |  |  |
| RK_FORMAT_XBGR_8888 | RK_FORMAT_ABGR_4444 |  |  |  |
| RK_FORMAT_ARGB_4444 | RK_FORMAT_ARGB_5551 |  |  |  |
| RK_FORMAT_ABGR_4444 | RK_FORMAT_ABGR_5551 |  |  |  |
| RK_FORMAT_ARGB_5551 | RK_FORMAT_RGB_888 |  |  |  |
| RK_FORMAT_ABGR_5551 | RK_FORMAT_BGR_888 |  |  |  |
|  |  |  |  |  |
| RK_FORMAT_RGB_888 RK_FORMAT_BGR_888 | RK_FORMAT_RGB_565 RK_FORMAT_BGR_565 |  |  |  |
|  | RK_FORMAT_RGB_565 RK_FORMAT_BGR_565 |  |  |  |
|  |  | RK_FORMAT_YCbCr_420_SP (only for | normal Bitblt without alpha) RK_FORMAT_YCrCb_420_SP (only for |  |
|  | RK_FORMAT_YCbCr_420_SP RK FORMAT YCrCb 420 SP | normal Bitblt without alpha) |  |  |
|  | RK_FORMAT_YCbCr_422_SP | RK_FORMAT_YCbCr_422_SP (only for |  |  |
|  | RK_FORMAT_YCrCb_422_SP | normal Bitblt without alpha) |  |  |
|  | RK_FORMAT_YCbCr_420_P | RK_FORMAT_YCrCb_422_SP (only for |  |  |
| Sofia 3gr | RK_FORMAT_YCrCb_420_P | normal Bitblt without alpha) |  |  |
|  | RK_FORMAT_YCbCr_422_P | RK_FORMAT_YCbCr_420_P (only for normal |  |  |
|  | RK_FORMAT_YCrCb_422_P | Bitblt without alpha) |  |  |
|  | RK_FORMAT_BPP1 | RK_FORMAT_YCrCb_420_P (only for normal |  |  |
|  |  | Bitblt without alpha) |  |  |
|  | RK_FORMAT_BPP2 RK_FORMAT_BPP4 | RK_FORMAT_YCbCr_422_P (only for normal |  |  |
|  |  |  | RK_FORMAT_YCrCb_422_P (only for normal |  |
| RGA2 | RK3288/3288w |  | Bitblt without alpha) |  |
|  |  |  |  |  |
| Lincoln |  |  |  |  |
| RK3190 |  |  | RK_FORMAT_BGRA_8888 RK_FORMAT_ARGB_8888 RK_FORMAT_ABGR_8888 | RK_FORMAT_BGRA_8888 RK_FORMAT ARGB_8888 RK_FORMAT_ABGR_8888 |
|  | RK_FORMAT_RGBX_8888 |  |  |  |
| RK_FORMAT_RGBX_8888 |  |  |  |  |
| RK_FORMAT_BGRX_8888 | RK_FORMAT_BGRX_8888 |  |  |  |
| RK_FORMAT_XRGB_8888 | RK_FORMAT XRGB_8888 |  |  |  |
| RK FORMAT XBGR 8888 | RK_FORMAT_XBGR_8888 RK_FORMAT_ARGB_4444 |  |  |  |
|  | RK_FORMAT_ARGB_4444 RK_FORMAT_ABGR_4444 | RK_FORMAT_ABGR_4444 |  |  |
|  |  |  |  |  |
| RK_FORMAT_ARGB_5551 | RK_FORMAT_ARGB_5551 |  |  |  |
| RK_FORMAT_ABGR_5551 | RK_FORMAT_ABGR_5551 |  |  |  |
| RK_FORMAT_RGB_888 | RK FORMAT RGB 888 |  |  |  |
|  | RK_FORMAT_RGB_565 | RK FORMAT RGB 565 |  |  |
| RK_FORMAT_BGR_565 | RK_FORMAT_BGR_565 |  |  |  |
| RK_FORMAT_YCbCr_420_SP | RK_FORMAT_YCbCr_420_SP |  |  |  |
| RK_FORMAT_YCrCb_420_SP | RK_FORMAT_YCrCb_420_SP |  |  |  |
| RK_FORMAT_YCbCr_422_SP | RK_FORMAT_YCbCr_422_SP |  |  |  |
| RK_FORMAT_YCrCb_422_SP | RK_FORMAT_YCrCb_422_SP |  |  |  |
| RK_FORMAT_YCbCr_420_P RK_FORMAT_YCrCb_420_P | RK_FORMAT_YCbCr_420_P RK_FORMAT_YCrCb_420_P |  |  |  |
| Capricorn |  | RK_FORMAT_YCbCr_422_P RK_FORMAT_YCrCb_422_P | RK_FORMAT_YCbCr_422_P |  |
|  | RK FORMAT YCrCb 422 P |  |  |  |
| RK_FORMAT_BPP1 (only for color |  |  |  |  |
| palette) RK_FORMAT_BPP2 (only for color |  |  |  |  |
| palette) RK_FORMAT_BPP4 (only for color |  |  |  |  |
| palette) RK_FORMAT_BPP8 (only for color palette) |  |  |  |  |
| RK_FORMAT_RGBA_8888 RK_FORMAT_BGRA_8888 |  |  |  |  |
| Maybach RGA2- Lite0 |  |  |  |  |
|  | RK_FORMAT_ARGB_8888 |  |  |  |
| RK_FORMAT_ABGR_8888 |  |  |  |  |
| RK_FORMAT_RGBX_8888 | RK_FORMAT_RGBA_8888 |  |  |  |
| RK_FORMAT_BGRX_8888 | RK_FORMAT_BGRA_8888 |  |  |  |
| RK3368 | RK_FORMAT_XRGB_8888 RK_FORMAT_XBGR_8888 | RK_FORMAT_ARGB_8888 RK_FORMAT ABGR_8888 |  |  |
|  |  | RK_FORMAT RGBX_8888 |  |  |
| RK_FORMAT_ARGB_4444 |  | RK_FORMAT_BGRX_8888 |  |  |
| RK_FORMAT_ABGR_4444 |  | RK_FORMAT XRGB_8888 |  |  |
| RK_FORMAT_ARGB_5551 |  | RK_FORMAT XBGR_8888 |  |  |
|  | RK_FORMAT_ABGR_5551 RK_FORMAT_RGB_888 | RK_FORMAT_ARGB_4444 |  |  |
|  |  | RK_FORMAT_BGR_888 RK_FORMAT_RGB_565 | RK_FORMAT_ABGR_4444 RK_FORMAT_ARGB_5551 |  |
|  | RK_FORMAT_BGR_565 | RK FORMAT ABGR 5551 |  |  |
|  | RK_FORMAT_YCbCr_420_SP | RK_FORMAT RGB_888 |  |  |
|  | RK_FORMAT_YCrCb_420_SP | RK_FORMAT_BGR_888 |  |  |
|  | RK_FORMAT_YCbCr_422_SP | RK_FORMAT_RGB_565 |  |  |
| BMW | RK_FORMAT_YCrCb_422_SP RK_FORMAT_YCbCr_420_P | RK_FORMAT_BGR_565 RK_FORMAT_YCbCr_420_SP |  |  |
| RK3366 | RK_FORMAT_YCrCb_420_P | RK_FORMAT_YCrCb_420_SP |  |  |
|  | RK_FORMAT_YCbCr_422_P | RK_FORMAT_YCbCr_422_SP |  |  |
|  | RK_FORMAT_YCrCb_422_P | RK FORMAT YCrCb 422 SP |  |  |
| palette) | RK_FORMAT_BPP1 (only for color | RK_FORMAT_YCbCr_420_P |  |  |
| palette) RK_FORMAT_BPP4 (only for color | RK_FORMAT_BPP2 (only for color | RK_FORMAT_YCrCb_420_P RK_FORMAT_YCbCr_422_P RK_FORMAT_YCrCb_422_P |  |  |
| RGA2- Benz Litel | RK3228 | palette) RK_FORMAT_BPP8 (only for color |  |  |
|  | palette) |  |  |  |
|  |  |  |  |  |
|  | RK_FORMAT_RGBA_8888 | RK_FORMAT_RGBA_8888 |  |  |
|  |  |  |  |  |
|  | RK_FORMAT_BGRA_8888 RK_FORMAT_ARGB_8888 | RK_FORMAT_BGRA_8888 RK_FORMAT ARGB_8888 |  |  |


|  |  |  | RK_FORMAT_RGBX_8888 | RK_FORMAT_RGBX_8888RK_FORMAT_BGRX_8888RK_FORMAT_XRGB_8888RK_FORMAT_XBGR_8888RK_FORMAT_ARGB_4444RK FORMAT ABGR 4444RK FORMAT ARGB 5551RK FORMAT ABGR 5551RK_FORMAT_RGB_888RK FORMAT BGR 888RK FORMAT RGB 565RK FORMAT BGR 565RK FORMAT YCbCr 420 SPRK_FORMAT_YCrCb_420_SPRK_FORMAT_YCbCr_422_SPRK FORMAT YCrCb 422 SPRK FORMAT YCbCr 420 PRK FORMAT YCrCb 420 PRK_FORMAT_YCbCr_422_PRK FORMAT YCrCb 422 P |
| --- | --- | --- | --- | --- |
|  | RK_FORMAT_BGRX_8888 |  |  |  |
| RK_FORMAT XRGB_8888 |  |  |  |  |
|  |  | RK_FORMAT_XBGR_8888 |  |  |
| RK_FORMAT_RGBA_4444 |  |  |  |  |
|  | RK_FORMAT ARGB_5551 |  |  |  |
|  |  | RK_FORMAT ABGR_5551 |  |  |
|  |  | RK FORMAT RGB 888 |  |  |
| Infiniti | RK3228H | RK_FORMAT_BGR_888RK FORMAT RGB 565 |  |  |
|  | RK FORMAT BGR 565 |  |  |  |
|  | RK FORMAT YCbCr 420 SP |  |  |  |
|  |  |  |  | RK_FORMAT_YCrCb_420_SP |
|  |  | RK FORMAT YCbCr 422 SP |  |  |
| RK_FORMAT_YCrCb_422_SP |  |  |  |  |
|  |  | RK_FORMAT_YCbCr_420_P |  |  |
| FORMATYCrCb420 P |  |  |  |  |
| Gemini |  | RK_FORMAT_YCbCr_422_PRK_FORMAT_YCrCb_422_P |  |  |
|  |  |  |  |  |
| RK3326 | RK FORMAT YCbCr 420 SP 10BRK_FORMAT_YCrCb_420_SP_10B |  |  |  |
|  |  | RK_FORMAT_YCbCr_422_SP_10BRK_FORMAT_YCrCb_422_SP_10BRK FORMAT BPP1 (only for color |  |  |
| Lion | RK1808 | palette)RK_FORMAT_BPP2 (only for colorpalette)RK_FORMAT_BPP4 (only for colorpalette)RK_FORMAT_BPP8 (only for colorpalette) |  |  |
| RGA2-Enhance |  |  | RK_FORMAT RGBA_ 8888RK_FORMAT_BGRA_8888RK_FORMAT_ARGB_8888 | RK_FORMAT_RGBA_8888RK_FORMAT_BGRA_8888RK_FORMAT_ARGB_8888RK_FORMAT_ABGR_8888RK_FORMAT_RGBX_8888RK_FORMAT_BGRX_8888RK_FORMAT_XRGB_8888RK_FORMAT_XBGR_8888RK_FORMAT_ARGB_4444RK_FORMAT_ABGR_4444RK_FORMAT_ARGB_5551RK FORMAT ABGR 5551RK_FORMAT_RGB_888RK_FORMAT_BGR_888RK_FORMAT_RGB_565RK_FORMAT_BGR_565RK FORMAT YCbCr 420 SPRK_FORMAT_YCrCb_420_SPRK_FORMAT_YCbCr_422_SPRK FORMAT YCrCb 422 SPRK FORMAT YCbCr 420 PRK_FORMAT_YCrCb_420_PRK_FORMAT_YCbCr_422_PRK FORMAT YCrCb 422 PRK FORMAT YUYV 422RK FORMAT YVYU 422RK_FORMAT_UYVY_422RK FORMAT VYUY 422 |
| RK_FORMAT_ABGR_8888RK_FORMAT_RGBX_8888 |  |  |  |  |
|  | RK_FORMAT_BGRX_8888 |  |  |  |
|  | RK FORMAT XRGB 8888 |  |  |  |
| Mclaren | RK3399 | RK_FORMAT_XBGR_8888 |  |  |
|  |  |  | RK_FORMAT_ARGB_4444 |  |
| RK_FORMAT_ABGR_4444 |  |  |  |  |
| RK_FORMAT ARGB_5551 |  |  |  |  |
|  | RK FORMAT ABGR 5551 |  |  |  |
|  | RK_FORMAT_RGB_888 |  |  |  |
|  | RK_FORMAT_BGR_888 |  |  |  |
| RK FORMAT RGB 565 |  |  |  |  |
|  |  | RK_FORMAT BGR_565 |  |  |
| RK FORMAT YCbCr 420 SP |  |  |  |  |
|  |  |  | RK_FORMAT_YCrCb_420_SP |  |
| RK FORMAT YCbCr 422 SP |  |  |  |  |
|  | RK FORMAT YCrCb 422 SP |  |  |  |
|  |  | RK FORMAT YCbCr 420 P |  |  |
|  |  | RK_FORMAT_YCrCb_420_P |  |  |
|  |  | RK_FORMAT_YCbCr_422_P |  |  |
| Mercury | RK1108 | RK_FORMAT_YCrCb_422_P |  |  |
| RK FORMAT YCbCr 420 SP 10B |  |  |  |  |
| RK_FORMAT_YCrCb_420_SP_10B |  |  |  |  |
|  |  | RK_FORMAT_YCbCr_422_SP_10B |  |  |
| RK FORMAT YCrCb 422 SP 10B |  |  |  |  |
|  | RK_FORMAT_BPP1 (only for color |  |  |  |
|  |  | palette) |  |  |
| RK_FORMAT_BPP2 (only for color |  |  |  |  |
| palette)RK_FORMAT_BPP4 (only for color |  |  |  |  |
|  |  |  |  |  |
| palette)RK_FORMAT_BPP8 (only for colorpalette) |  |  |  |  |
|  |  |  |  |  |


| Puma | KV 1126/ KV 1109 | KK_FUKMA1_KGBA_δδδδRK FORMAT BGRA 8888RK_FORMAT_ARGB_8888 | RK_FORMAT_RGBA_8888 |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| skylarkV2 | RK3566/RK3568 | RK_FORMAT_BGRA_8888 |  |  |  |  |  |  |  |  |  |  |  |
|  | RK_FORMAT_ARGB_8888 |  |  |  |  |  |  |  |  |  |  |  |  |
| Orion | RK3588 | RK_FORMAT_ABGR_8888RK_FORMAT_RGBX_8888RK_FORMAT_BGRX_8888RK FORMAT XRGB 8888RK_FORMAT XBGR_8888RK_FORMAT_ARGB_4444RK_FORMAT_ABGR_4444RK FORMAT ARGB 5551 |  | RK FORMAT ABGR 8888 |  |  |  |  |  |  |  |  |  |
| Otter |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | RK_FORMAT_RGBX_8888 |  |  |  |  |  |  |  |  |  |
| RV1106/1103 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_BGRX_8888 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Bull | RK3528 | RK_FORMAT XRGB_8888 |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_XBGR_8888 |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_ARGB_4444 |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | RK_FORMAT | RK_FORMAT_ABGR_4444 |  |  |  |  |  |  |  |  |
|  | RK_FORMAT_ | RK_FORMAT_ARGB_5551 |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_ABGR_5551RK FORMAT RGB 888RK_FORMAT_RGB_888RK_FORMAT_BGR_888RK FORMAT BGR 888RK_FORMAT_RGB_565RK_FORMAT RGB_565RK_FORMAT_BGR_565RK_FORMAT_BGR_565RK_FORMAT_YCbCr_420_SPRK_FORMAT_YCbCr_420_SPRK_FORMAT_YCrCb_420_SPRK_FORMAT_YCrCb_420_SPRK_FORMAT_YCbCr_422_SPRK_FORMAT_YCrCb_422_SP |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_R |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  | RK_FORMAT |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK FORMAT YC |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_YCbCr_422_SP |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_YCrCb_422_SP |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  | RK_FORMAT_YCbCr_420_P |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  | RK FORMAT YCbCr 420 P |  |
|  | RK FORMAT YCrCb 420 P |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  | RK_FORMAT_YCrCb_420_P |  |
|  |  | RK_FORMAT_YCbCr_422_P |  |  |  |  |  |  |  |  |  |  |  |
| RK FORMAT YCbCr 422 P |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_YCrCb_422_P | RK_FORMAT_YCrCb_422_P |  |  |  |  |  |  |  |  |  |  |
| Snipe | RK3562 | RK_FORMAT_YUYV_422 | RK FORMAT YUYV 422 |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_YVYU_422 | RK_FORMAT_YVYU_422 |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_UYVY_422 |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  | RK_FORMAT_UYVY_422 |  |
|  |  | RK_FORMAT_VYUY_422RK_FORMAT_YCbCr_400 | RK_FORMAT_VYUY_422 |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_YCbCr_400 |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_YCbCr_420_SP_10B |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK FORMAT YCbCr 422 SP 10B |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_YCrCb_422_SP_10B |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_BPP1 (only for colorpalette)RK_FORMAT_BPP2 (only for color |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | palette)RK_FORMAT_BPP4 (only for color |  |  |  |  |  |  |  |  |  |  |  |
|  | palette)RK_FORMAT_BPP8 (only for colorpalette) |  |  |  |  |  |  |  |  |  |  |  |  |
| RK_FORMAT_BPI |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RGA2-Pro | Heron | RK3576 | RK_FORMAT_ARGB_4444 RK_FORMAT ARGB_ 5551 RK_FORMAT_RGB_888 RK FORMAT BGR 888 RK_FORMAT_RGB_565 RK_FORMAT_BGR_565 RK_FORMAT_YUYV_422 RK_FORMAT_YVYU_422 RK_FORMAT_UYVY_422 RK_FORMAT_VYUY_422 RK_FORMAT_YCbCr_400 RK_FORMAT_YCrCb_422_SP_10B RK_FORMA_A8 (only src for alpha blend) RK_FORMAT_BPP1 (only for color palette) | KK_FOKMA1_RGBA_δδδδ RK_FORMAT_RGBA_8888 RK_FORMAT_BGRA_8888 RK_FORMAT_BGRA_8888 RK_FORMAT_ARGB_8888 RK_FORMAT_ARGB_8888 RK_FORMAT_ABGR_8888 RK_FORMAT_ABGR_8888 RK FORMAT RGBX_8888 RK FORMAT RGBX 8888 RK FORMAT BGRX_8888 RK_FORMAT BGRX_8888 RK_FORMAT XRGB_8888 RK_FORMAT_XRGB_8888 RK_FORMAT_XBGR_8888 RK_FORMAT XBGR_8888 RK_FORMAT_ARGB_4444 RK_FORMAT_ABGR_4444 RK_FORMAT_ABGR_4444 RK_FORMAT_ARGB_5551 RK_FORMAT_ABGR_5551 RK_FORMAT_ABGR_5551 RK_FORMAT_RGB_888 RK_FORMAT_BGR_888 RK_FORMAT RGB_565 RK_FORMAT BGR_565 RK FORMAT YCbCr 420 SP RK_FORMAT_YCbCr_420_SP RK_FORMAT_YCrCb_420_SP RK_FORMAT_YCrCb_420_SP RK FORMAT YCbCr 422 SP RK_FORMAT_YCbCr_422_SP RK_FORMAT_YCrCb_422_SP RK_FORMAT_YCrCb_422_SP RK_FORMAT_YCbCr_444_SP RK_FORMAT_YCbCr_444_SP RK_FORMAT_YCrCb_444_SP RK_FORMAT_YCrCb_444_SP RK_FORMAT_YCbCr_420_P RK_FORMAT_YCbCr_420_P RK_FORMAT_YCrCb_420_P RK_FORMAT_YCrCb_420_P RK_FORMAT_YCbCr_422_P RK_FORMAT_YCbCr_422_P RK_FORMAT_YCrCb_422_P RK_FORMAT_YCrCb_422_P RK_FORMAT_YUYV_422 RK_FORMAT_YVYU_422 RK_FORMAT_UYVY_422 RK_FORMAT_VYUY_422 RK_FORMAT_YCbCr_400 RK_FORMAT_YCbCr_420_SP_10B RK FORMAT Y4 RK_FORMAT_YCrCb_420_SP_10B RK_FORMAT_Y8 RK_FORMAT_YCbCr_422_SP_10B |  |  |  |  |  |  |  |  |  |
| RGA3 | Orion | RK3588 | KK_FOKMA1_KGBA_δδδδRK FORMAT RGBA 8888RK FORMAT BGRA 8888RK FORMAT BGRA 8888RK FORMAT ARGB 8888RK FORMAT RGBX 8888RK FORMAT ABGR 8888RK FORMAT BGRX 8888RK FORMAT RGBX 8888RK FORMAT RGB 888 |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK FORMAT BGRX 8888RK FORMAT BGR 888RK FORMAT XRGB 8888RK FORMAT RGB 565RK FORMAT XBGR 8888RK FORMAT BGR 565RK_FORMAT_RGB_888RK FORMAT YCbCr 420 SPRK_FORMAT BGR_ 888RK_FORMAT_YCrCb_420_SPRK_FORMAT_RGB_565RK FORMAT YCbCr 422 SPRK FORMAT_BGR_565RK_FORMAT_YCrCb_422_SPRK FORMAT YCbCr 420 SP |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RK FORMAT YCbCr 420 SP 10B |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | RK_FORMAT_YCrCb_420_SP_10B |  |  |  |  |  |  |  |  |  |  |  |

1. 3图像格式对齐说明


| Version | Byte_stride | Format | Alignment |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGBA_8888 RK_FORMAT_BGRA_8888 |  |
|  |  | RK_FORMAT_ARGB_8888 |  |
|  |  | RK_FORMAT_ABGR_8888 |  |
|  |  | RK_FORMAT_RGBX_8888 | width stride无对齐要求 |
|  |  | RK_FORMAT_BGRX_8888 |  |
|  |  | RK_FORMAT_XRGB_8888 |  |
|  |  | RK_FORMAT_XBGR_8888 |  |
|  |  |  |  |
|  |  | RK_FORMAT_RGBA_4444 |  |
|  |  | RK_FORMAT_BGRA_4444 |  |
|  |  | RK_FORMAT_ARGB_4444 |  |
|  |  | RK_FORMAT_ABGR_4444 |  |
|  |  | RK_FORMAT_RGBA_5551 | width stride须2对齐 |
| RGA1 |  | RK_FORMAT_BGRA_5551 |  |
| RGA1-Plus | 4 | RK_FORMAT_ARGB_5551 |  |
|  |  | RK_FORMAT_ABGR_5551 |  |
|  |  | RK_FORMAT_RGB_565 |  |
|  |  | RK_FORMAT_BGR_565 |  |
|  |  | RK_FORMAT_RGB_888 | width stride须4对齐 |
|  |  | RK_FORMAT_BGR_888 |  |
|  |  | RK_FORMAT_YCbCr_420_SP |  |
|  |  | RK_FORMAT_YCrCb_420_SP |  |
|  |  | RK_FORMAT_YCbCr_422_SP | width stride须4对齐，x_offset、y_offset、width、height、height |
|  |  | RK_FORMAT_YCrCb_422_SP RK_FORMAT_YCbCr_420_P | stride均须2对齐 |
|  |  | RK_FORMAT_YCrCb_420_P |  |
|  |  | RK_FORMAT_YCbCr_422_P |  |
|  |  | RK_FORMAT_YCrCb_422_P |  |
| 4 |  |  |  |
| RGA2 |  | RK_FORMAT_RGBA_8888 |  |
| RGA2- |  | RK_FORMAT_BGRA_8888 |  |
| Lite0 |  | RK_FORMAT_ARGB_8888 |  |
| RGA2- |  | RK_FORMAT_ABGR_8888 | width stride无对齐要求 |
| Litel |  | RK_FORMAT_RGBX_8888 |  |
| RGA2- |  | RK_FORMAT_BGRX_8888 |  |
| Enhance RGA2-Pro |  | RK_FORMAT_XRGB_8888 |  |
|  |  | RK_FORMAT_XBGR_8888 |  |
|  |  | RK_FORMAT_RGBA_4444 |  |
|  |  | RK FORMAT BGRA 4444 |  |
|  |  | RK_FORMAT_ARGB_4444 |  |
|  |  | RK_FORMAT_ABGR_4444 |  |
|  |  | RK_FORMAT_RGBA_5551 | width stride须2对齐 |
|  |  | RK_FORMAT_BGRA_5551 |  |
|  |  | RK_FORMAT_ARGB_5551 |  |
|  |  | RK_FORMAT_ABGR_5551 |  |
|  |  | RK_FORMAT_RGB_565 RK_FORMAT_BGR_565 |  |
|  |  |  |  |
|  |  | RK_FORMAT_YUYV_422 |  |
|  |  | RK_FORMAT_YVYU_422 |  |
|  |  | RK_FORMAT_UYVY_422 | width stride须2对齐，x_offset、y_offset、width、height、height |
|  |  | RK_FORMAT_VYUY_422 |  |
|  |  | RK_FORMAT_YUYV_420 | stride均须2对齐 |
|  |  | RK_FORMAT_YVYU_420 |  |
|  |  | RK_FORMAT_UYVY_420 |  |
|  |  |  |  |
|  |  | RK_FORMAT_BGR_888 |  |
|  |  | RK_FORMAT RGB_888 |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  | RK_FORMAT_VYUY_420 |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |


| RGA3       16 |  |  |
| --- | --- | --- |
| RK_FORMAT_YCbCr_420_SPRK_FORMAT_YCrCb_420_SPRK_FORMAT_YCbCr_422_SPRK_FORMAT_YCrCb_422_SPRK_FORMAT_YCbCr_444_SPRK_FORMAT_YCrCb_444_SPRK_FORMAT_YCbCr_420_PRK_FORMAT_YCrCb_420_PRK_FORMAT_YCbCr_422_PRK_FORMAT_YCrCb_422_PRK_FORMAT_YCbCr_400RK_FORMAT_Y4RK_FORMAT_Y8 | width stride须4对齐，x_offset、y_offset、width、height、heightstride均须2对齐 |  |
| RK_FORMAT_YCbCr_420_SP_10BRK_FORMAT_YCrCb_420_SP_10BRK_FORMAT_YCbCr_422_SP_10BRK_FORMAT_YCrCb_422_SP_10B | width stride须16对齐，x_offset、y_offset、width、height、heightstride均须2对齐 |  |
| RK_FORMAT RGBA_8888RK FORMAT BGRA 8888RK_FORMAT_ARGB_8888RK_FORMAT_ABGR_8888RK_FORMAT_RGBX_8888RK_FORMAT_BGRX_8888RK_FORMAT_XRGB_8888RK_FORMAT_XBGR_8888 | width stride须4对齐 |  |
| RK_FORMAT_RGB_565RK_FORMAT_BGR_565 | width stride须8对齐 |  |
| RK_FORMAT_YUYV_422RK_FORMAT_YVYU_422 | width stride须8对齐，x_offset、y_offset、width、height、heightstride均须2对齐 |  |
| RK_FORMAT_UYVY_422RK_FORMAT_VYUY_422 |  |  |
| RK_FORMAT_RGB_888RK_FORMAT_BGR_888 | width stride须16对齐 |  |
| RK_FORMAT_YCbCr_420_SPRK_FORMAT_YCrCb_420_SPRK_FORMAT_YCbCr_422_SPRK_FORMAT_YCrCb_422_SP | width stride须16对齐，x_offset、y_offset、width、height、heightstride均须2对齐 |  |
| RK_FORMAT_YCbCr_420_SP_10BRK_FORMAT_YCrCb_420_SP_10BRK_FORMAT_YCbCr_422_SP_10BRK_FORMAT_YCrCb_422_SP_10B | width stride须64对齐，x_offset、y_offset、width、height、heightstride均须2对齐 |  |
| FBC mode | 除上述格式对齐要求外，width stride、height stride须16对齐 |  |
| TILE8*8 mode | 除上述格式对齐要求外，width、height须8对齐，输入通道widthstride、height stride须16对齐。 |  |

注：  

1). 对齐要求计算公式：lcm(bpp，byte\_stride \* 8) / pixel\_stride。  

2). 当芯片平台搭载多版本硬件时，为了保证硬件利用率，librga会按最严格的对齐要求进行约束。

## 2. 版本说明

RGA的支持库librga.so按照一定规则更新版本号，标识着功能新增、兼容性、问题修正的更新提交，并提供几种方式查询版本号，方便开发者在使用librga.so时可以清楚的辨别当前的库文件版本是否适合于当前的开发环境。详细版本更新日志以及版本差异可以查阅源码根目录下CHANGLOG.md。

### 2.1 librga API版本说明

### 2.1.1版本号格式与递增规则

##### 2.1.1.1 版本号格式

major.minor.revision\_[build]

例如：

1.0.0\_[0]

##### 2.1.1.2 递增规则


| 名称 | 规则 |
| --- | --- |
| major | 主版本号，当提交不向下兼容的版本。 |
| minor | 次版本号，当向下兼容的功能性API新增。 |
| revision | 修订版本号，当提交向下兼容的功能补充或致命的问题修正。 |
| build | 编译版本号，当向下兼容的问题修正。 |

#### 2.1.2 版本号查询

2.1.2.1 strings命令查询：

以Android R 64位为例：

:/# strings vendor/lib64/librga.so |grep rga\_api |grep version   

rga\_api version 1.0.0\_[0]

##### 2.1.2.2 日志打印：

当每个进程首次调用RGA API时，会打印版本号。

rockchiprga: rga\_api version 1.0.0\_[0]

##### 2.1.2.3 函数接口查询

调用以下API，可以查询代码版本号、编译版本号、RGA硬件版本信息。具体使用说明可以查看应用接口说明 章节。

```javascript
querystring(RGA_VERSION);
```

字符串格式如下：

RGA\_api version : v1.0.0\_[0]   

RGA version : RGA\_2\_Enhance

##### 2.1.2.4 属性查询

该方式查询版本号仅Android系统支持，并且须已有进程调用RGA后，属性设置方生效。

:/# getprop |grep rga   

[vendor.rga\_api.version]: [1.0.0\_[0]]

### 2.2 驱动版本说明

librga是基于驱动调用RGA硬件的，必须要保证驱动版本在使用的librga库的支持范围内。

### 2.2.1版本号格式与递增规则

##### 2.2.1.1 版本号格式

&lt;driver\_name&gt;: v major.minor.revision

例如：

RGA2 Device Driver: v2.1.0

##### 2.2.1.2 递增规则


| 名称 | 规则 |
| --- | --- |
| major | 主版本号，当提交不向下兼容的版本。 |
| minor | 次版本号，当向下兼容的功能性API新增。 |
| revision | 修订版本号，当提交向下兼容的功能补充或致命的问题修正。 |

#### 2.2.2 版本号查询

##### 2.2.2.1 开机日志查询：

开机后使用以下命令查询RGA驱动初始化日志，部分早期的驱动没有打印版本号，该方法仅适用部分驱动。

dmesg |grep rga

例如：

```ini
[ 2.382393] rga3_core0 fdb60000.rga: Adding to iommu group 2
[ 2.382651] rga: rga3_core0, irq = 33, match scheduler
[ 2.383058] rga: rga3_core0 hardware loaded successfully, hw_version:3.0.76831.
[ 2.383121] rga: rga3_core0 probe successfully
[ 2.383687] rga3_core1 fdb70000.rga: Adding to iommu group 3
[ 2.383917] rga: rga3_core1, irq = 34, match scheduler
[ 2.384313] rga: rga3_core1 hardware loaded successfully, hw_version:3.0.76831.
[ 2.384412] rga: rga3_core1 probe successfully
[ 2.384893] rga: rga2, irq = 35, match scheduler
[ 2.385238] rga: rga2 hardware loaded successfully, hw_version:3.2.63318.
[ 2.385257] rga: rga2 probe successfully
[ 2.385455] rga_iommu: IOMMU binding successfully, default mapping core[0x1]
[ 2.385586] rga: Module initialized. v1.2.23
```

其中 “v1.2.23” 便是驱动版本号。

##### 2.2.2.2 调试节点查询

可以通过驱动调试节点查询版本号，如果没有以下节点则说明当前运行的是不支持查询的驱动版本。

使用默认使能CONFIG\_ROCKCHIP\_RGA\_DEBUG\_FS编译选项的kernel。

cat /sys/kernel/debug/rkrga/driver_version

使能ROCKCHIP\_RGA\_PROC\_FS编译选项的kernel。

cat /proc/rkrga/driver_version

例如：

cat /sys/kernel/debug/rkrga/driver_version

RGA multicore Device Driver: v1.2.23

这里 “RGA multicore Device Driver”是指驱动名称为RGA multicore Device Driver，“v1.2.23” 是指版本为1.2.23，即说明当前驱动为1.2.23版本的RGA multicore Device Driver（通常简称multi\_rga driver）驱动。

cat /sys/kernel/debug/rkrga/driver_version

RGA2 Device Driver: v2.1.0

这里 “RGA2 Device Driver” 是指驱动名称为RGA2 Device Driver，“v2.1.0” 是指版本号为2.1.0，即说明当前驱动为2.1.0版本的RGA2 DeviceDriver（通常简称rga2 driver）驱动。

### 2.3 版本对应关系

使用RGA时需要确认保证当前的运行环境是可以正常工作的，下表为常用的librga与驱动版本对应关系。


| librga版本 | 对应驱动 | 硬件支持 |
| --- | --- | --- |
| 无版本号 | 对应SDK内驱动 | RGA1、RGA2 |
| 1.0.0~1.3.2 | RGA Device Driver（kernel - 4.4及以上）RGA2 Device Driver（无版本号或v2.1.0） | RGA1、RGA2 |
| &gt;1.4.0 | RGA multicore Device Driver(v1.2.0及以上） | RGA2、RGA3 |
| &gt;1.9.0 | RGA Device Driver（kernel-4.4及以上）RGA2 Device Driver（无版本号和v2.1.0）RGA multicore Device Driver(v1.2.0及以上） | RGA1、RGA2、RGA3 |

## 3. 应用接口

RGA模块支持库为librga.so，通过对图像缓冲区结构体struct rga\_info进行配置，实现相应的2D图形操作。为了获得更友好的开发体验，在此基础上进一步封装常用的2D图像操作接口。新的接口主要包含以下特点：

接口定义参考opencv/matlab中常用的2D图形接口定义，以减少二次开发的学习成本。

为消除RGA硬件版本差异带来的兼容问题，加入RGA query查询功能。查询内容主要包括版本信息，输入输出大分辨率及图像格式的支持。

执行图像操作之前，需要对输入输出图像缓冲区进行处理。调用wrapbuffer\_T接口将输入输出图像信息填充到结构体struct rga\_buffer\_t，结构体中包含分辨率及图像格式等信息。

对于2D图像复合操作，增加improcess接口。通过传入一系列预定义的usage执行复合操作。

支持对单次无法完成的图像复合操作进行绑定为一个RGA图像任务，统一提交到驱动内逐个执行。

### 3.1 概述

该软件支持库提供以下API，异步模式仅支持C++实现。

querystring：查询获取当前芯片平台RGA硬件版本与功能支持信息，以字符串的形式返回。

imcheckHeader: 校验当前使用头文件版本与librga版本差异。

importbuffer\_T：将外部内存（dma\_fd、虚拟地址、物理地址）导入RGA驱动内部，实现硬件快速访问物理连续/非物理连续的内存。

releasebuffer\_handle： 将外部buffer从RGA驱动内部解除引用与映射。

wrapbuffer\_handle： 快速封装图像缓冲区结构（rga\_buffer\_t）。

imbeginJob：创建RGA图像处理任务。

imendJob：提交并执行RGA图像处理任务。

imcancelJob： 取消并删除RGA图像处理任务。

imcopy：调用RGA实现快速图像拷贝操作。

imcopyTask：向RGA图像任务中添加快速图像拷贝操作。

imresize：调用RGA实现快速图像缩放操作。

imresizeTask：向RGA图像任务中添加快速图像缩放操作。

impyramind： 调用RGA实现快速图像金字塔操作。

imcrop： 调用RGA实现快速图像裁剪操作。

imcropTask： 向RGA图像任务中添加快速图像裁剪操作。

imtranslate： 调用RGA实现快速图像平移操作。

imtranslateTask： 向RGA图像任务中添加快速图像平移操作。

imcvtcolor：调用RGA实现快速图像格式转换。

imcvtcolorTask： 向RGA图像任务中添加快速图像格式转换。

imrotate：调用RGA实现快速图像旋转操作。

imrotateTask：向RGA图像任务中添加快速图像旋转操作。

imflip： 调用RGA实现快速图像翻转操作。

imflipTask： 向RGA图像任务中添加快速图像翻转操作。

imblend：调用RGA实现双通道快速图像合成操作。

imblendTask： 向RGA图像任务中添加双通道快速图像合成操作。

imcomposite： 调用RGA实现三通道快速图像合成操作。

imcompositeTask：向RGA图像任务中添加三通道快速图像合成操作。

imcolorkey： 调用RGA实现快速图像颜色键操作。

imcolorkeyTask： 向RGA图像任务中添加快速图像颜色键操作。

imosd：调用RGA实现快速图像OSD字幕叠加。

imosdTask：向RGA图像任务中添加快速图像OSD字幕叠加。

imquantize： 调用RGA实现快速图像运算点前处理（量化）操作。

imquantizeTask： 向RGA图像任务中添加快速图像运算点前处理（量化）操作。

imrop： 调用RGA实现快速图像光栅操作。

imropTask： 向RGA图像任务中添加快速图像光栅操作。

imfill：调用RGA实现快速图像填充操作。

imfillArray：调用RGA实现多组快速图像填充操作。

imfillTask：向RGA图像任务中添加快速图像填充操作。

imfillTaskArray：向RGA图像任务中添加多组快速图像填充操作。

imrectangle：调用RGA实现等距矩形边框快速绘制操作。

imrectangleArray：调用RGA实现多组等距矩形边框快速绘制操作。

imrectangleTask： 向RGA图像任务中添加等距矩形边框快速绘制操作。

imrectangleTaskArray： 向RGA图像任务中添加多组等距矩形边框快速绘制操作。

immakeBorder： 调用RGA实现矩形边框快速绘制操作。

immosaic：调用RGA实现快速图像马赛克遮盖。

immosaicArray：调用RGA实现快速图像马赛克遮盖。

immosaicTask：向RGA图像任务中添加快速图像马赛克遮盖。

immosaicTaskArray：向RGA图像任务中添加快速图像马赛克遮盖。

improcess：调用RGA实现快速图像复合处理操作。

improcessTask： 向RGA图像任务中添加快速图像复合处理操作。

imcheck：校验参数是否合法，以及当前硬件是否支持该操作。

imsync：用于异步模式时，同步任务完成状态。

imconfig： 向当前线程上下文添加默认配置。

3. 2获取RGA 版本及支持信息

#### 3.2.1 querystring

```javascript
const char* querystring(int name);
```

查询RGA基础信息及分辨率格式等支持情况


| Parameters | Description |
| --- | --- |
|  | RGA_VENDOR - 厂商信息 RGA VERSION - 版本信息 |
|  | RGA MAX INPUT - 支持的最大输入分辨率 |
|  | RGA_MAX_OUTPUT - 支持的最大输出分辨率 |
| name | RGA BYTE STRIDE - 支持的stride对齐要求 |
|  | RGA SCALE LIMIT - 支持得缩放倍数 |
|  | RGA INPUT FORMAT - 支持的输入格式 |
|  | RGA OUTPUT FORMAT - 支持的输出格式 |
|  | RGA_EXPECTED - 预期性能 |
|  | RGA ALL - 输出所有信息 |

Returns a string describing properties of RGA.

3. 3头文件版本校验

#### 3.3.1 imcheckHeader

```sql
IM_API IM_STATUS imcheckHeader(im_api_version_t header_version = RGA_CURRENT_API_HEADER_VERSION);
```

校验当前使用头文件版本与librga版本差异。


| Parameters | Description |
| --- | --- |
| header_version | 头文件版本，通常使用宏 RGA CURRENT API HEADER VERSION即可。 |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 4图像缓冲区预处理

#### 3.4.1 importbuffer\_T

对于需要RGA处理的外部内存，可以使用importbuffer\_T接口将缓冲区对应的物理地址信息映射到RGA驱动内部，并获取缓冲区相应的地址信息，方便后续的稳定、快速地调用RGA完成工作。

不同的buffer类型调用RGA的性能是不同的，性能排序如下所示：  

physical address &gt; fd &gt; virtual address  

一般推荐使用fd作为buffer类型。


| Parameters(T) | Data Type | Description |
| --- | --- | --- |
| virtual address | void * | 图像缓冲区虚拟地址 |
| physical address | uint64_t | 图像缓冲区连续的物理地址 |
| fd | int | 图像缓冲区DMA的文件描述符 |
| GraphicBufferhandle | buffer_handle_t | 图像缓冲区handle,包含缓冲区地址，文件描述符，分辨率及格式等信息 |
| GraphicBuffer | GraphicBuffer | android graphic buffer |
| AHardwareBuffer | AHardwareBuffer | chunks of memory that can be accessed by various hardware components in the system. https://developer.android.com/ndk/reference/group/a-hardware-buffer |

```c
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int size);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int size);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int size);
```


| Parameter | Description |
| --- | --- |
| fd/va/pa | [required] external buffer |
| size | [required] memory size |

IM\_API rga\_buffer\_handle\_t importbuffer\_fd(int fd, int width, int height, int format);   

IM\_API rga\_buffer\_handle\_t importbuffer\_virtualaddr(void \*va, int width, int height, int format);   

IM\_API rga\_buffer\_handle\_t importbuffer\_physicaladdr(uint64\_t pa, int width, int height, int format); IM\_API rga\_buffer\_handle\_t importbuffer\_fd(int fd, im\_handle\_param\_t \*param);   

IM\_API rga\_buffer\_handle\_t importbuffer\_virtualaddr(void \*va, im\_handle\_param\_t \*param);   

IM\_API rga\_buffer\_handle\_t importbuffer\_physicaladdr(uint64\_t pa, im\_handle\_param\_t \*param);


| Parameter | Description |
| --- | --- |
| fd/va/pa | [required] external buffer |
| width | [required] pixel width stride of the image buffer |
| height | [required] pixel height stride of the image buffer |
| format | [required] pixel format of the image buffer |


| Parameter | Description |
| --- | --- |
| fd/va/pa | [required] external buffer |
| param | [required] configure buffer parameters |


|  | IM_API rga_buffer_handle_t importbuffer_GraphicBuffer_handle(buffer_handle_t hnd); |
| --- | --- |
|  | IM_API rga_buffer_handle_t importbuffer_GraphicBuffer(sp&lt;GraphicBuffer&gt; buf); |
|  | IM_API rga_buffer_handle_t importbuffer_AHardwareBuffer(AHardwareBuffer *buf); |


| Parameter | Description |
| --- | --- |
| hnd/buf | [required] external buffer |

Returns rga\_buffer\_handle\_t to describe the memory handle.

#### 3.4.2 releasebuffer\_handle

当使用外部内存调用RGA完毕后，需要通过内存句柄 handle 调用 releasebuffer\_handle解除该缓冲区与RGA驱动的映射和绑定关系，并释放RGA驱动内部对应的资源。

```sql
IM_API IM_STATUS releasebuffer_handle(rga_buffer_handle_t handle);
```

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.4.3 wrapbuffer\_handle

IM2D图形库接口参数中，输入源图像及输出目标图像应支持多种类型，它主要包含内存、图像格式、图像宽高等信息。在执行相应的图像操作之前，需要先调用wrapbuffer\_handle将输入输出的图像参数转化为统一的 rga\_buffer\_t 结构作为user API的输入参数。

```c
rga_buffer_t wrapbuffer_handle(rga_buffer_handle_t handle,
int width,
int height,
int format，
int wstride = width,
int hstride = height);
```


| Parameter | Description |
| --- | --- |
| handle | [required] RGA buffer handle |
| width | [required] pixel width of the image that needs to be processed |
| height | [required] pixel height of the image that needs to be processed |
| format | [required] pixel format |
| wtride | [optional] pixel width stride of the image |
| hstride | [optional] pixel width stride of the image |

Returns a rga\_buffer\_t to desribe image information.

3. 5图像处理任务创建

#### 3.5.1 imbeginJob

IM\_API im\_job\_handle\_t imbeginJob(uint64\_t flags = 0);

创建一个RGA图像处理任务，将返回一个任务句柄，job\_handle 可用于添加/删除RGA图像操作、提交/执行该任务。


| Parameter | Description |
| --- | --- |
| flags | [optional] job flags |

Returns im\_job\_handle\_t to describe the job handle.

3. 6图像处理任务提交

#### 3.6.1 imendJob

IM\_API IM\_STATUS imendJob(im\_job\_handle\_t job\_handle,   

```c
int sync_mode = IM_SYNC,
int acquire_fence_fd = 0,
int *release_fence_fd = NULL);
```

提交并执行已创建的RGA图像处理任务。完成后将自动删除当前完成的RGA图像处理任务资源。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| sync_mode | [optional] wait until operation complete |
| acquire_fence_fd | [optional] Used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [optional] Used in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 7图像处理任务取消

#### 3.7.1 imcancelJob

```sql
IM_API IM_STATUS imcancelJob(im_job_handle_t job_handle);
```

取消并删除已创建的RGA图像处理任务。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 8图像拷贝

#### 3.8.1 imcopy

```c
IM_STATUS imcopy(const rga_buffer_t src,
rga_buffer_t dst,
int sync = 1,
int *release_fence_fd = NULL);
```

执行单次快速图像拷贝操作，将图像从src通道图像缓冲区拷贝到dst通道图像缓冲区上。


| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionalJUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.8.2 imcopyTask

IM\_API IM\_STATUS imcopyTask(im\_job\_handle\_t job\_handle,  

const rga\_buffer\_t src,  

rga\_buffer\_t dst);

通过job\_handle向指定的任务中添加图像拷贝操作，用法和imcopy一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 9图像缩放<sub>、</sub>图像金字塔

#### 3.9.1 imresize

```c
IM_STATUS imresize(const rga_buffer_t src,
rga_buffer_t dst,
double fx = 0,
double fy = 0,
int interpolation = INTER_LINEAR,
int sync = 1,
int *release_fence_fd = NULL);
```

根据不同的应用场景，可选择配置dst来描述缩放的目标图像大小，或配置缩放系数fx/fy实现缩放指定倍率的效果。同时配置dst和缩放系数fx/fy时，将采用缩放系数fx/fy计算后的结果作为目标图像大小。

interpolation 仅硬件版本RGA1/RGA1 plus 可以支持配置，其他硬件版本RGA须查询对应TRM确认缩放算法。

注意：使用缩放系数fx/fy进行倍率缩放时，YUV等对宽高对齐有要求的格式将强制向下对齐至符合要求，使用该功能有可能会改变预期缩放效果。


| Parameters | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image; it has the size dsize (when it is non-zero) or the size computed from src.size(), fx, and fy; the typeof dst is the same as of src. |
| fx | [optional] scale factor along the horizontal axis; when it equals 0, it is computed as:fx = (double) dst.width / src.width |
| fy | [optional] scale factor along the vertical axis; when it equals 0, it is computed as:fy = (double) dst.height / src.height |
| interpolation | [optional] interpolation method:INTER_NEAREST - a nearest-neighbor interpolationINTER_LINEAR - a bilinear interpolation (used by default)INTER_CUBIC - a bicubic interpolation over 4x4 pixel neighborhood |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.9.2 impyramid

IM\_STATUS impyramid (const rga\_buffer\_t src,   

rga\_buffer\_t dst，   

IM\_SCALE direction)

金字塔缩放。根据direction 宽高同时做1/2 或者 2 倍的缩放。


| Parameters | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image; |
| direction | [required] scale modeIM_UP_SCALE  – up scaleIM_DOWN_SCALE   - down scale |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.9.3 imresizeTask

IM\_API IM\_STATUS imresizeTask(im\_job\_handle\_t job\_handle,   

const rga\_buffer\_t src,   

rga\_buffer\_t dst,   

```c
double fx = 0,
double fy = 0,
int interpolation = 0);
```

通过job\_handle向指定的任务中添加图像缩放操作，用法和imresize一致。


| Parameters | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image; it has the size dsize (when it is non-zero) or the size computed from src.size(), fx, and fy; the type of dstis the same as of src. |
| fx | [optional] scale factor along the horizontal axis; when it equals 0, it is computed as:fx = (double) dst.width / src.width |
| fy | [optional] scale factor along the vertical axis; when it equals 0, it is computed as:fy = (double) dst.height / src.height |
| interpolation | [optional] interpolation method:INTER_NEAREST - a nearest-neighbor interpolationINTER_LINEAR - a bilinear interpolation (used by default)INTER_CUBIC - a bicubic interpolation over 4x4 pixel neighborhood |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.10 图像裁剪

#### 3.10.1 imcrop

```c
IM_STATUS imcrop(const rga_buffer_t src,
rga_buffer_t dst,
im_rect rect,
int sync = 1,
int *release_fence_fd = NULL);
```

通过指定Rect 的大小区域执行图像裁剪。


| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| rect | [required] crop region |
| x - upper-left x coordinate |  |
| y - upper-left y coordinate |  |
| width - region width |  |
| height - region height |  |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync) |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.10.2 imcropTask

```sql
IM_API IM_STATUS imcropTask(im_job_handle_t job_handle,
const rga_buffer_t src,
rga_buffer_t dst,
im_rect rect);
```

通过job\_handle向指定的任务中添加图像裁剪操作，用法和imcrop一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| rect | [required] crop region |
| x - upper-left x coordinate |  |
| y - upper-left y coordinate |  |
| width - region width height - region height |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.11 图像平移

#### 3.11.1 imtranslate

```c
IM_STATUS imtranslate(const rga_buffer_t src,
rga_buffer_t dst,
int x,
int y,
int sync = 1,
int *release_fence_fd = NULL);
```

对图像做平移操作，移动到（x, y）坐标位置，src和dst 宽高须一致，超出部分会被裁剪。


| Parameter | Description |
| --- | --- |
| src | [required]input image |
| dst | [required] output image |
| X | [required] horizontal translation |
| y | [required] vertical translation |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.11.2 imtranslateTask

```sql
IM_API IM_STATUS imtranslateTask(im_job_handle_t job_handle,
const rga_buffer_t src,
rga_buffer_t dst,
int x,
int y);
```

通过job\_handle向指定的任务中添加图像平移操作，用法和imtranslate一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required]input image |
| dst | [required] output image |
| X | [required] horizontal translation |
| y | [required] vertical translation |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 12图像格式转换

#### 3.12.1 imcvtcolor

```c
IM_STATUS imcvtcolor(rga_buffer_t src,
rga_buffer_t dst,
int sfmt,
int dfmt,
int mode = IM_COLOR_SPACE_DEFAULT,
int sync = 1,
int *release_fence_fd = NULL);
```

格式转换功能，具体格式支持根据soc有不同请查阅图像格式支持章节。

格式可以通过rga\_buffer\_t 设置，也可以通过sfmt/dfmt分别配置源图像及输出图像格式，当涉及YUV/RGB色域转换时可以通过mode配置转换的色域，默认按照BT.601 limit range进行转换。


| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| sfmt | [optional] source image format |
| dfimt | [optional] destination image format |
| Mode | [optional] color space mode: |
| IM_YUV_TO_RGB_BT601_LIMIT |  |
| IM_YUV_TO_RGB_BT601_FULL |  |
| IM_YUV_TO_RGB_BT709_LIMIT |  |
| IM_RGB_TO_YUV_BT601_LIMIT |  |
| IM_RGB_TO_YUV_BT601_FULL |  |
| IM_RGB_TO_YUV_BT709_LIMIT |  |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.12.2 imcvtcolorTask

```sql
IM_API IM_STATUS imcvtcolorTask(im_job_handle_t job_handle,
rga_buffer_t src,
rga_buffer_t dst,
int sfmt,
int dfmt,
int mode = IM_COLOR_SPACE_DEFAULT);
```

通过job\_handle向指定的任务中添加图像平移操作，用法和imcvtcolor一致。


| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| sfmt | [optional] source image format |
| dfmt | [optional] destination image format |
| Mode | [optional] color space mode:IM_YUV_TO_RGB_BT601_LIMITIM_YUV_TO_RGB_BT601_FULLIM_YUV_TO_RGB_BT709_LIMITIM_RGB_TO_YUV_BT601_LIMITIM_RGB_TO_YUV_BT601_FULLIM_RGB_TO_YUV_BT709_LIMIT |

Return IM\_STATUS\_SUCCESS on success or else negative error code

### 3.13 图像旋转

#### 3.13.1 imrotate

```c
IM_STATUS imrotate(const rga_buffer_t src,
rga_buffer_t dst,
int rotation,
int sync = 1,
int *release_fence_fd = NULL);
```

支持图像旋转90，180，270度。


| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| rotation | [required] rotation angle: |
| IM_HAL_TRANSFORM_ROT_90 |  |
| IM_HAL_TRANSFORM_ROT_180 |  |
| IM_HAL_TRANSFORM_ROT_270 |  |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.13.2 imrotateTask

IM\_API IM\_STATUS imrotateTask(im\_job\_handle\_t job\_handle,   

const rga\_buffer\_t src,   

rga\_buffer\_t dst,   

int rotation);

通过job\_handle向指定的任务中添加图像旋转操作，用法和imrotate一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| rotation | [required] rotation angle: |
| IM_HAL_TRANSFORM_ROT_90 |  |
| IM_HAL_TRANSFORM_ROT_180 |  |
| IM_HAL_TRANSFORM_ROT_270 |  |
|  |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 14图像镜像翻转

#### 3.14.1 imfilp

```c
IM_STATUS imflip (const rga_buffer_t src,
rga_buffer_t dst,
int mode,
int sync = 1,
int *release_fence_fd = NULL);
```

支持图像做水平、垂直镜像翻转。


| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| mode | [required] flip mode: |
| IM_HAL_TRANSFORM_FLIP_H_V |  |
| IM_HAL_TRANSFORM_FLIP_H |  |
| IM_HAL_TRANSFORM_FLIP_V |  |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.14.2 imflipTask

IM\_API IM\_STATUS imflipTask(im\_job\_handle\_t job\_handle,  

const rga\_buffer\_t src,  

rga\_buffer\_t dst,  

int mode);

通过job\_handle向指定的任务中添加图像镜像翻转操作，用法和imflip一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| mode | [required] flip mode: |
| IM_HAL_TRANSFORM_FLIP_H_V |  |
| IM_HAL_TRANSFORM_FLIP_H |  |
| IM_HAL_TRANSFORM_FLIP_V |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.15 图像合成

#### 3.15.1 imblend/imcomposite

```c
IM_STATUS imblend(const rga_buffer_t fg_image,
rga_buffer_t bg_image,
int mode = IM_ALPHA_BLEND_SRC_OVER,
int sync = 1,
int *release_fence_fd = NULL);
```

RGA使用A+B -&gt; B 的图像双通道合成模式，将前景图像（srcA通道）与背景图像（dst通道）根据配置的混合模型执行对应的Alpha叠加计算，并将合成结果输出至dst通道上，当没有配置混合模式时则默认设置为src-over模式。

```c
IM_STATUS imcomposite(const rga_buffer_t fg_image,
const rga_buffer_t bg_image,
rga_buffer_t output_image,
int mode = IM_ALPHA_BLEND_SRC_OVER,
int sync = 1,
int *release_fence_fd = NULL);
```

RGA使用A+B -&gt; C 的图像三通道合成模式，将前景图像（srcA通道）与背景图像（srcB通道）根据配置的混合模型执行对应的Alpha叠加计算，并将合成结果输出至dst通道上，当没有配置混合模式时则默认设置为src-over模式。

两种图像合成模式中mode 可以配置不同的Porter-Duff混合模型：

说明Porter-Duff混合模型前，先做出如下定义：

S -标识两个混合图像中的源图像，即前景图像，为souce的缩写。

Porter-Duff混合模型的核心公式如下：

RGA支持以下几种混合模型：

SRC:   

Sf = 1， Df = 0；   

[Rc，Ra] = [Sc，Sa]；   

DST:   

Sf = 0， Df = 1；   

[Rc，Ra] = [Dc，Da]；   

SRC\_OVER：   

Sf = 1， Df = （1 - Sa）；   

[Rc，Ra] = [ Sc + (1 - Sa) \* Dc， Sa + (1 - Sa) \* Da ]；   

DST\_OVER:   

Sf = (1 - Da) ， Df = 1；   

[Rc，Ra] = [ Sc \* (1 - Da) + Dc， Sa \* (1 - Da) + Da ] ；

【注意】图像合成模式不支持YUV格式之间合成，imblend函数dst图像不支持YUV格式，imcomposite函数srcB图像不支持YUV格式。


| Parameter | Description |
| --- | --- |
| fg_image | [required] foreground image |
| bg_image | [required] background image, when A+B-&gt;B it is also the output destination image. |
| output_image | [required] output destination image. |
| mode | [optional] blending mode: |
| IM_ALPHA_BLEND_SRC -SRC模式 |  |
| IM_ALPHA_BLEND_DST- ——DST模式 |  |
| IM_ALPHA_BLEND_SRC_OVER - SRC OVER模式 |  |
| IM ALPHA BLEND DST OVER DST OVER模式 |  |
| IM_ALPHA_BLEND_PRE_MUL——预乘使能，当需要预乘时须将该标识与其他模式标识进行或处理，再赋值给 mode |  |
| [optional] wait until operation complete |  |
| sync release_fence_fd | [optionalJUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.15.2 imblendTask/imcompositeTask

```c
IM_API IM_STATUS imblendTask(im_job_handle_t job_handle,
const rga_buffer_t fg_image,
rga_buffer_t bg_image,
int mode = IM_ALPHA_BLEND_SRC_OVER);
```

通过job\_handle向指定的任务中添加A+B -&gt; B模式的图像合成操作，用法和imblend一致，当没有配置混合模式时则默认设置为src-over模式。

IM\_API IM\_STATUS imcompositeTask(im\_job\_handle\_t job\_handle,   

const rga\_buffer\_t fg\_image,   

const rga\_buffer\_t bg\_image,   

rga\_buffer\_t output\_image,   

int mode = IM_ALPHA_BLEND_SRC_OVER);

通过job\_handle向指定的任务中添加A+B -&gt; C模式的图像合成操作，用法和imcomposite一致，当没有配置混合模式时则默认设置为src-over模式。

【注意】图像合成模式不支持YUV格式之间合成，imblend函数dst图像不支持YUV格式，imcomposite函数srcB图像不支持YUV格式。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| fg_image | [required] foreground image |
| bg_image | [required] background image, when A+B-&gt;B it is also the output destination image. |
| output_image | [required] output destination image. |
| mode | [optional] blending mode: |
| IM_ALPHA_BLEND_SRC -SRC模式 |  |
| IM_ALPHA_BLEND_DST —— DST模式 |  |
| IM_ALPHA_BLEND_SRC_OVER -SRC OVER模式 IM_ALPHA_BLEND_DST_OVER - DST OVER模式 |  |
| IM_ALPHA_BLEND_PRE_MUL 预乘使能，当需要预乘时须将该标识与其他模式标识进行或处理，再赋值给mode |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.16 色键（Color Key）

#### 3.16.1 imcolorkey

```c
IM_STATUS imcolorkey(const rga_buffer_t src,
rga_buffer_t dst,
im_colorkey_range range,
int mode = IM_ALPHA_COLORKEY_NORMAL,
int sync = 1,
int *release_fence_fd = NULL);
```

Color Key技术是对源图像进行预处理，将符合色键过滤条件的像素的alpha分量置零，其中所述色键过滤条件为非透明的颜色值，并将预处理后的源图像与目标图像进行alpha混合模式。

该模式仅支持在源图像（src）区域的图像上针对设定的颜色范围实现Color Key功能，并叠加在目标图像（dst）区域上。

IM\_ALPHA\_COLORKEY\_NORMAL为正常模式，即在设定的颜色范围内的颜色作为过滤条件，在该色彩范围内的像素点Alpha分量清零，IM\_ALPHA\_COLORKEY\_INVERTED则反之，当没有配置模式时则默认设置为IM\_ALPHA\_COLORKEY\_NORMAL模式。


| Parameters | Range | Description |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | 需要消去/抠取的颜色范围最大值，排列为ABGR |
| min | 0x0 ∼ 0xFFFFFFFF | 需要消去/抠取的颜色范围最小值，排列为ABGR |


| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| range | [required] Target color rangetypedef struct im_colorkey_range &#123;int max;int min;&#125; im_colorkey_value; |
| Mode | [required] Color Key mode:IM_ALPHA_COLORKEY_NORMALIM_ALPHA_COLORKEY_INVERTED |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.16.2 imcolorkeyTask

IM\_API IM\_STATUS imcolorkeyTask(im\_job\_handle\_t job\_handle,   

const rga\_buffer\_t fg\_image,   

rga\_buffer\_t bg\_image,   

im\_colorkey\_range range,   

int mode = IM_ALPHA_COLORKEY_NORMAL);

通过job\_handle向指定的任务中添加图像Color Key操作，用法和imcolorkey一致，当没有配置模式时则默认设置为IM\_ALPHA\_COLORKEY\_NORMAL模式。


| Parameters | Range | Description |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | 需要消去/抠取的颜色范围最大值，排列为ABGR |
| min | 0x0 ~ 0xFFFFFFFF | 需要消去/抠取的颜色范围最小值，排列为ABGR |
|  |  |  |
| parameter | Description |  |
| job_handle | [required] job handle |  |
| src | [required] input image |  |
| dst | [required] output image |  |
| range | [required] Target color rangetypedef struct im_colorkey_range &#123;int max;int min;&#125; im_colorkey_value; |  |
| Mode | [required] Color Key mode:IM_ALPHA_COLORKEY_NORMALIM_ALPHA_COLORKEY_INVERTED |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 17图像字幕叠加（OSD）

#### 3.17.1 imosd

```c
IM_API IM_STATUS imosd(const rga_buffer_t osd,
const rga_buffer_t bg_image,
const im_rect osd_rect,
im_osd_t *osd_config,
int sync = 1,
int *release_fence_fd = NULL);
```

OSD（On-Screen-Display）功能，可以将文字信息叠加在视频图片上，并对字体进行亮度统计、自动反色功能。


| parameter | Description |
| --- | --- |
| OSD | [required] osd block image |
| bg_image | [required] output image |
| osd_rect | [required] image region to OSD |
| osd_config | [required] OSD function config |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.17.2 imosdTask

```c
IM_API IM_STATUS imosdTask(im_job_handle_t job_handle,
const rga_buffer_t osd,
const rga_buffer_t bg_image,
const im_rect osd_rect,
im_osd_t *osd_config);
```

通过job\_handle向指定的任务中添加图像OSD操作，用法和imosd一致。


| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| OSD | [required] osd block image |
| dst | [required] output image |
| osd_rect | [required] image region to OSD |
| osd_config | [required] OSD function config |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 18NN运算点前处理（量化）

#### 3.18.1 imquantize

```c
IM_STATUS imquantize(const rga_buffer_t src,
rga_buffer_t dst,
rga_nn_t nn_info,
int sync = 1,
int *release_fence_fd = NULL);
```

目前仅RV1126 / RV1109上支持。NN运算点前处理，图像RGB 三个通道可以分开单独配置offset以及scale。

dst = 【(src + offset) \* scale 】

参数范围：


| Parameters | Range | Description |
| --- | --- | --- |
| scale | 0~3.99 | 10bit，从左往右，高位2个bit表示整数部分，低位8bit表示小数部分 |
| offset | -255~255 | 9bit，从左往右，高位表示符号位，地位表示0～255的偏移量 |


| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
|  | [required] rga_nn_t结构体对RGB三个通道offset及scale进行单独配置 typedef struct rga_nn &#123; int nn_flag; int scale_r; int scale_g; |
| nn_info | int scale_b; int offset_r; int offset_g; |
|  | int offset_b; &#125; rga_nn_t; |
| sync | [optional] wait until operation complete |
| release_fence_fd |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.18.2 imquantizeTask

```sql
IM_API IM_STATUS imquantizeTask(im_job_handle_t job_handle,
const rga_buffer_t src,
rga_buffer_t dst,
im_nn_t nn_info);
```

通过job\_handle向指定的任务中添加图像量化操作，用法和imquantize一致。


| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| nn_info | [required] rga_nn_t结构体对RGB三个通道offset及scale进行单独配置typedef struct rga_nn &#123;int nn_flag;int scale_r;int scale_g;int scale_b;int offset_r;int offset_g;int offset_b;&#125; rga_nn_t; |
|  |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.19 图像光栅操作 ROP

#### 3.19.1 imrop

IM\_STATUS imrop(const rga\_buffer\_t src,   

rga\_buffer\_t dst,   

int rop\_code,   

```c
int sync = 1,
int *release_fence_fd = NULL);
```

对两个图形做ROP运算

parameter Description   

src [required] input image   

dst [required] output image   

[required] rop code mode   

IM\_ROP\_AND : dst = dst AND src;   

IM\_ROP\_OR : dst = dst OR src   

rop\_code IM\_ROP\_NOT\_DST : dst = NOT dst   

IM\_ROP\_NOT\_SRC : dst = NOT src   

IM\_ROP\_XOR : dst = dst XOR src   

IM\_ROP\_NOT\_XOR : dst = NOT (dst XOR src)   

sync [optional] wait until operation complete   

release\_fence\_fd [optional]Used in async mode, as a parameter of imsync()  

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.19.2 imropTask

```sql
IM_API IM_STATUS imropTask(im_job_handle_t job_handle,
const rga_buffer_t src,
rga_buffer_t dst,
int rop_code);
```

通过job\_handle向指定的任务中添加图像ROP运算操作，用法和imrop一致。


| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
|  | [required] rop code mode |
|  | IM_ROP_AND : dst = dst AND src; |
| rop_code | IM_ROP_OR : dst = dst OR src |
|  | IM_ROP_NOT_DST : dst = NOT dst |
|  | IM_ROP_NOT_SRC : dst = NOT src |
|  | IM_ROP_XOR : dst = dst XOR src |
|  | IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 20图像颜色填充 边框绘制

#### 3.20.1 imfill

```c
IM_STATUS imfill(rga_buffer_t dst,
im_rect rect,
int color,
int sync = 1,
int *release_fence_fd = NULL);
```

对图像的指定区域rect进行颜色填充。

color参数按照RGBA格式填写颜色值，由高到低位分别是A，B，G，R，例如，红色：color = 0x000000ff.

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect | [required] image region to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.2 imfillArray

```c
IM_API IM_STATUS imfillArray(rga_buffer_t dst,
im_rect *rect_array,
int array_size,
uint32_t color,
int sync = 1,
int *release_fence_fd = NULL);
```

对图像的多个区域逐个进行颜色填充。

color参数按照RGBA格式填写颜色值，由高到低位分别是A，B，G，R，例如，红色：color = 0x000000ff.

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionalJUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.3 imfillTask

```c
IM_API IM_STATUS imfillTask(im_job_handle_t job_handle,
rga_buffer_t dst,
im_rect rect,
uint32_t color);
```

通过job\_handle向指定的任务中添加图像填充操作，用法和imfill一致。

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect | [required] image region to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.4 imfillTaskArray

IM\_API IM\_STATUS imfillTaskArray(im\_job\_handle\_t job\_handle,   

rga\_buffer\_t dst,   

im\_rect \*rect\_array,   

int array\_size,   

uint32\_t color);

通过job\_handle向指定的任务中添加对图像多个区域进行颜色填充的操作，用法和imfillArray一致。

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.5 imrectangle

```c
IM_API IM_STATUS imrectangle(rga_buffer_t dst,
im_rect rect,
uint32_t color,
int thickness,
int sync = 1,
int *release_fence_fd = NULL);
```

对图像的指定区域rect（描述为边框外径）根据指定颜色color进行绘制粗细为thickness的边框，当thickness为负时填充一个实心的矩 形。

color参数按照RGBA格式填写颜色值，由高到低位分别是A，B，G，R，例如，红色：color = 0x000000ff.

### 【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect | [required] image region to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| color | [required] fll with color |
| thickness | [required] Thickness of lines that make up the rectangle.Negative values, like -1, mean that the function has to draw a filled rectangle. |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.6 imrectangleArray

IM\_API IM\_STATUS imrectangleArray(rga\_buffer\_t dst,   

im\_rect \*rect\_array,   

int array\_size,   

uint32\_t color,   

int thickness,   

```c
int sync = 1,
int *release_fence_fd = NULL);
```

对图像的多个指定区域rect（描述为边框外径）逐个根据指定颜色color进行绘制粗细为thickness的边框，当thickness为负时填充一个实 心的矩形。

color参数按照RGBA格式填写颜色值，由高到低位分别是A，B，G，R，例如，红色：color = 0x000000ff.

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |
| thickness | [required] Thickness of lines that make up the rectangle.Negative values, like -1, mean that the function has to draw a filled rectangle. |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.7 imrectangleTask

```c
IM_API IM_STATUS imrectangleTask(im_job_handle_t job_handle,
rga_buffer_t dst,
im_rect rect,
uint32_t color,
int thickness);
```

通过job\_handle向指定的任务中添加图像填充矩形边框操作，用法和imrectangle一致。

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect | [required] image region to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |
| thickness | [required] Thickness of lines that make up the rectangle.Negative values, like -1, mean that the function has to draw a filled rectangle. |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.8 imrectangleTaskArray

IM\_API IM\_STATUS imrectangleTaskArray(im\_job\_handle\_t job\_handle,   

rga\_buffer\_t dst,   

im\_rect \*rect\_array,   

int array\_size,   

uint32\_t color,   

int thickness);

通过job\_handle向指定的任务中添加对图像绘制多个矩形边框的操作，用法和imrectangleArray一致。

【注意】填充区域rect宽高须大于或等于2


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified colorwidth and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fil with color |
| thickness | [required] Thickness of lines that make up the rectangle.Negative values, like -1, mean that the function has to draw a filled rectangle. |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.20.9 immakeBorder

```sql
IM_API IM_STATUS immakeBorder(rga_buffer_t src,
rga_buffer_t dst,
int top,
int bottom,
int left,
int right,
int border_type,
int value = 0,
int sync = 1,
int acquir_fence_fd = -1,
int *release_fence_fd = NULL);
```  
根据配置的top/bottom/left/right像素数，对输入图像绘制边框后，输出到输出的目标图像缓冲区上。

【注意】top/bottom/left/right值须大于或等于2


| Parameter | Description |
| --- | --- |
| src | [required] input source image |
| dst | [required] output target image |
| top | [required] number of top pixels |
| bottom | [required] number of bottom pixels |
| left | [required] number of left pixels |
| right | [required] number of right pixels |
| border_type | [required] Border typeIM_BORDER_CONSTANT /ii abcdefgh iiwith some specified value &#x27;i&#x27;IM_BORDER_REFLECT //fedcba abcdefgh hgfedcbIM_BORDER_WRAP//cdefgh abcdefgh abcdefg |
| value | [optional] the pixel value at which the border is filled |
| sync | [optional] wait until operation complete |
| acquire_fence_fd | [required] used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [required] used in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.21 图像马赛克

#### 3.21.1 immosaic

IM\_API IM\_STATUS immosaic(const rga\_buffer\_t image,   

im\_rect rect,   

int mosaic\_mode,   

```c
int sync = 1,
int *release_fence_fd = NULL);
```

对图像指定区域进行马赛克遮盖。


| Parameter | Description |
| --- | --- |
| image | [required] target image |
| rect | [required] image region to mosaic |
| mosaic_mode | [required] set mosaic mode |
| IM_MOSAIC_8 |  |
| IM_MOSAIC_16 |  |
| IM_MOSAIC_32 |  |
| IM_MOSAIC_64 |  |
| IM_MOSAIC_128 |  |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.21.2 immosaicArray

IM\_API IM\_STATUS immosaicArray(const rga\_buffer\_t image,   

im\_rect \*rect\_array,   

int array\_size,   

int mosaic\_mode,   

```c
int sync = 1,
int *release_fence_fd = NULL);
```

对图像的多个区域逐个进行马赛克遮盖。


| Parameter | Description |
| --- | --- |
| image | [required] target image |
| rect_array | [required] image region array_ptr to mosaic |
| array_size | [required] size of region arrays. |
| mosaic_mode | [required] set mosaic mode |
| IM_MOSAIC_8 |  |
| IM_MOSAIC_16 |  |
| IM_MOSAIC_32 |  |
| IM_MOSAIC_64 |  |
| IM_MOSAIC_128 |  |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optionaljUsed in async mode, as a parameter of imsync() |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.21.3 immosaicTask

IM\_API IM\_STATUS immosaicTask(im\_job\_handle\_t job\_handle,   

const rga\_buffer\_t image,   

im\_rect rect,   

int mosaic_mode);

通过job\_handle向指定的任务中添加图像马赛克遮盖操作，用法和immosaic一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| image | [required] target image |
| rect | [required] image region to mosaic |
| mosaic_mode | [required] set mosaic mode |
| IM_MOSAIC_8 |  |
| IM_MOSAIC_16 |  |
| IM_MOSAIC_32 |  |
| IM_MOSAIC_64 IM_MOSAIC_128 |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.21.4 immosaicTaskArray

```sql
IM_API IM_STATUS immosaicTaskArray(im_job_handle_t job_handle,
const rga_buffer_t image,
im_rect *rect_array,
int array_size,
int mosaic_mode);
```

通过job\_handle向指定的任务中添加对图像多个区域的马赛克遮盖操作，用法和immosaicArray一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| image | [required] target image |
| rect_array | [required] image region array_ptr to mosaic |
| array_size | [required] size of region arrays. |
| mosaic_mode | [required] set mosaic mode |
| IM_MOSAIC_8 |  |
| IM_MOSAIC_16 |  |
| IM_MOSAIC_32 IM_MOSAIC_64 |  |
|  |  |
| IM_MOSAIC_128 |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.22 图像处理

#### 3.22.1 improcess

```c
IM_STATUS improcess(rga_buffer_t src,
rga_buffer_t dst,
rga_buffer_t pat,
im_rect srect,
im_rect drect,
im_rect prect,
int acquire_fence_fd,
int *release_fence_fd,
im_opt_t *opt,
int usage);
```

RGA 图像复合操作函数，其他API都是基于此API开发，improcess 可以实现更复杂的复合操作。

图像操作通过usage 的方式进行配置。

usage 参照定义：

```c
typedef enum {
/* Rotation */
IM_HAL_TRANSFORM_ROT_90 = 1 << 0,
IM_HAL_TRANSFORM_ROT_180 = 1 << 1,
IM_HAL_TRANSFORM_ROT_270 = 1 << 2,
IM_HAL_TRANSFORM_FLIP_H = 1 << 3,
IM_HAL_TRANSFORM_FLIP_V = 1 << 4,
IM_HAL_TRANSFORM_FLIP_H_V = 1 << 5,
IM_HAL_TRANSFORM_MASK = 0x3f,
/*
* Blend
* Additional blend usage, can be used with both source and target configs.
* If none of the below is set, the default "SRC over DST" is applied.
*/
IM_ALPHA_BLEND_SRC_OVER = 1 << 6, /* Default, Porter-Duff "SRC over DST" */
IM_ALPHA_BLEND_SRC = 1 << 7, /* Porter-Duff "SRC" */
IM_ALPHA_BLEND_DST = 1 << 8, /* Porter-Duff "DST" */
IM_ALPHA_BLEND_SRC_IN = 1 << 9, /* Porter-Duff "SRC in DST" */
IM_ALPHA_BLEND_DST_IN = 1 << 10, /* Porter-Duff "DST in SRC" */
IM_ALPHA_BLEND_SRC_OUT = 1 << 11, /* Porter-Duff "SRC out DST" */
IM_ALPHA_BLEND_DST_OUT = 1 << 12, /* Porter-Duff "DST out SRC" */
IM_ALPHA_BLEND_DST_OVER = 1 << 13, /* Porter-Duff "DST over SRC" */
IM_ALPHA_BLEND_SRC_ATOP = 1 << 14, /* Porter-Duff "SRC ATOP" */
IM_ALPHA_BLEND_DST_ATOP = 1 << 15, /* Porter-Duff "DST ATOP" */
IM_ALPHA_BLEND_XOR = 1 << 16, /* Xor */
IM_ALPHA_BLEND_MASK = 0x1ffc0,
IM_ALPHA_COLORKEY_NORMAL = 1 << 17,
IM_ALPHA_COLORKEY_INVERTED = 1 << 18,
```


|  | IM_ALPHA_COLORKEY_MASK      = 0x60000, |  |  |  |
| --- | --- | --- | --- | --- |
|  | IM_SYNC                      = 1 | &lt;&lt; 19, |  |  |
|  | IM_ASYNC                     = 1 | &lt;&lt; 26, |  |  |
|  | IM_CROP                      = 1 | &lt;&lt; 20, | /* Unused */ |  |
| IM_COLOR_FILL                = 1 &lt;&lt; 21, |  |  |  |  |
| IM_COLOR_PALETTE            = 1 &lt;&lt; 22, |  |  |  |  |
| IM_NN_QUANTIZE               = 1 | &lt | ;&lt; 23, |  |  |
| IM_ROP                        = 1 | &lt | ;&lt; 24, |  |  |
| IM_ALPHA_BLEND_PRE_MUL      = 1 | &lt | ;&lt | ; 25, |  |
| TM USACE: |  |  |  |  |


| Parameter | Description |
| --- | --- |
| src | [required] input imageA |
| dst | [required] output image |
| pat | [required] input imageB |
| srect | [required] sre crop region |
| drect | [required] dst crop region |
| prect | [required] pat crop region |
| acquire_fence_fd | [required] Used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [required] Used in async mode, as a parameter of imsync() |
| opt | [required] operation optionstypedef struct im_opt &#123;int color;im_colorkey_range colorkey_range;im_nn_t nn;int rop_code;int priority;int core;&#125; im_opt_t;[required] image operation usage |
| usage |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

#### 3.22.2 improcessTask

通过job\_handle向指定的任务中添加复合图像处理操作，用法和improcess一致。


| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input imageA |
| dst | [required] output image |
| pat | [required] input imageB |
| srect | [required] src crop region |
| drect | [required] dst crop region |
| prect | [required] pat crop region |
| acquire_fence_fd | [required] Used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [required] Used in async mode, as a parameter of imsync() |
| opt | [required] operation optionstypedef struct im_opt &#123;int color;im_colorkey_range colorkey_range;im_nn_t nn;int rop_code;int priority;int core;&#125; im_opt_t; |
| usage |  |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

### 3.23 参数校验

#### 3.23.1 imcheck

```c
IM_API IM_STATUS imcheck(const rga_buffer_t src, const rga_buffer_t dst,
const im_rect src_rect, const im_rect dst_rect,
const int mode_usage);
IM_API IM_STATUS imcheck_composite(const rga_buffer_t src, const rga_buffer_t dst, const rga_buffer_t pat,
const im_rect src_rect, const im_rect dst_rect, const im_rect pat_rect,
const int mode_usage);
```

在配置完毕RGA任务参数后，可以通过该接口校验当前参数是否合法，并根据当前硬件情况判断硬件是否支持。

建议该接口仅在开发调试阶段使用，避免多次校验导致性能损耗。


| Parameter | Description |
| --- | --- |
| src | [required] input imageA |
| dst | [required] output image |
| pat | [optional] input imageB |
| srect | [required] src crop region |
| drect | [required] dst crop region |
| prect | [optional] pat crop region |
| usage | [optional] image operation usage |

Return IM\_STATUS\_NOERROR on success or else negative error code.

### 3.24 同步操作

#### 3.24.1 imsync

IM\_STATUS imsync(int fence\_fd);

RGA异步模式需要调用该接口等待操作完成，将返回的release\_fence\_fd作为传入参数。

其他API 将 形参sync 设置为0时，使能异步调用模式，效果相当于opengl中的 glFlush，如果进一步调用imsync 可以达到glFinish的效果。


| Parameter | Description |
| --- | --- |
| fence_fd | [required] fence_fd to wait |

Return IM\_STATUS\_SUCCESS on success or else negative error code.

3. 25线程上下文配置

#### 3.25.1 imconfig

```c
IM_STATUS imconfig(IM_CONFIG_NAME name, uint64_t value);
```

通过不同的配置名对当前线程的上下文进行配置，该上下文将作为该线程的默认配置。

线程上下文的配置优先级低于接口的传参配置。如果接口传参配置未配置相关参数，则本地调用使用上下文默认配置完成本地调用；  

如果接口传参配置相关参数，以接口传参的配置完成本次调用。


| parameter | Description |
| --- | --- |
| name | [required] context config name: |
| IM_CONFIG_SCHEDULER_CORE 指定任务处理核心 |  |
| IM_CONFIG_PRIORITY 任务优先级 |  |
| IM_CHECK_CONFIG 校验使能 |  |
| value | [required] config value IM CONFIG SCHEDULER CORE : IM SCHEDULER RGA3 CORE0 IM_SCHEDULER_RGA3_CORE1 IM_SCHEDULER_RGA2_CORE0 IM_SCHEDULER_RGA3_DEFAULT IM_SCHEDULER_RGA2_DEFAULT IM_CONFIG_PRIORITY: 0~6 |

注意：priority、core权限极高，操作不当可能导致系统崩溃或死锁，建议仅用于开发调试阶段，极度不建议在实际产品场景进行配置。

Return IM\_STATUS\_SUCCESS on success or else negative error code

## 4. 数据结构

本章节将详细描述应用接口中涉及的数据结构。

### 4.1 概述


| 数据结构 | 说明 |
| --- | --- |
| rga_buffer_t | 描述图像缓冲区信息 |
| im_rect | 描述图像实际操作区域 |
| im_opt_t | 描述图像操作选项 |
| im_job_handle_t | RGA任务句柄 |
| rga_buffer_handle_t | RGA驱动图像缓冲区句柄 |
| im_handle_param_t | 描述待导入图像缓冲区属性 |
| im_context_t | 当前线程默认上下文 |
| im_nn_t | 描述运算点前处理参数 |
| im_colorkey_range | Colorkey关键色范围 |

### 4.2 详细描述

#### 4.2.1 rga\_buffer\_t

说明

描述单一通道的图像缓冲区信息。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct {
void* vir_addr; /* virtual address */
void* phy_addr; /* physical address */
int fd; /* shared fd */
rga_buffer_handle_t handle; /* buffer handle */
int width; /* width */
int height; /* height */
int wstride; /* wstride */
int hstride; /* hstride */
int format; /* format */
int color_space_mode; /* color_space_mode */
int global_alpha; /* global_alpha */
int rd_mode;
} rga_buffer_t;
```


| 成员参数 | 描述 |
| --- | --- |
| vir_addr | 图像缓冲区虚拟地址。 |
| phy_addr | 图像缓冲区连续的物理地址。 |
| fd | 图像缓冲区DMA的文件描述符。 |
| handle | 导入RGA驱动的图像缓冲区对应的内存句柄。 |
| width | 图像实际操作区域的宽度，以像素为单位。 |
| height | 图像实际操作区域的高度，以像素为单位。 |
| wstride | 图像宽度的步幅，以像素为单位。 |
| hstride | 图像高度的步幅，以像素为单位。 |
| format | 图像格式。 |
| color_space_mode | 图像色域空间。 |
| global_alpha | 全局Alpha配置。 |
| rd_mode | 当前通道读取数据模式。 |

### 注意事项

vir\_addr、phy\_addr、fd、handle只需选择其一作为图像缓冲区的描述即可，如多项赋值，则只会根据默认优先级选择其一作为图像缓冲区描述，优先级如下：handle &gt; phy\_addr &gt; fd &gt; vir\_addr。

#### 4.2.2 im\_rect

说明

描述单一通道的图形实际操作区域。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct {
int x; /* upper-left x */
int y; /* upper-left y */
int width; /* width */
int height; /* height */
} im_rect;
```


| 成员参数 | 描述 |
| --- | --- |
| X | 图像实际操作区域的起始横坐标，以像素为单位。 |
| y | 图像实际操作区域的起始纵坐标，以像素为单位。 |
| width | 图像实际操作区域的宽度，以像素为单位。 |
| height | 图像实际操作区域的高度，以像素为单位。 |

### 注意事项

实际操作区域不能超出图像大小，即（x + width）&lt;= wstride， （y + height） &lt;= hstride。

#### 4.2.3 im\_opt\_t

说明

描述当前任务图像操作选项。

### 定义

```c
typedef struct im_opt {
im_api_version_t version DEFAULT_INITIALIZER(RGA_CURRENT_API_HEADER_VERSION);
int color; /* color, used by color fill */
im_colorkey_range colorkey_range; /* range value of color key */
im_nn_t nn;
int rop_code;
int priority;
int core;
int mosaic_mode;
im_osd_t osd_config;
im_intr_config_t intr_config;
char reserve[128];
} im_opt_t;
```


| 成员参数 | 描述 |
| --- | --- |
| version | 当前头文件版本 |
| color | 填充图像颜色配置。 |
| colorkey_range | Colorkey关键色范围配置。 |
| nn | 运算点前处理（量化）配置。 |
| rop_code | 光栅操作ROP操作码配置。 |
| priority | 当前任务优先级配置。 |
| core | 当前任务指定硬件核心。 |
| mosaic_mode | 马赛克模式配置。 |
| osd_config | osd字幕叠加反色/统计配置。 |
| intr_config | 提前中断模式配置。 |
| reserve | 预留位。 |

### 注意事项

priority、core权限极高，操作不当可能导致系统崩溃或死锁，建议仅用于开发调试阶段，极度不建议在实际产品场景进行配置。

#### 4.2.4 im\_job\_handle\_t

说明

RGA任务句柄，用于标识当前配置的RGA任务。

路径

im2d\_api/im2d\_type.h

定义

typedef uint32_t im_job_handle_t;

注意事项

配置失败后须使用 imcancelJob 释放当前任务句柄，避免内存泄漏。

#### 4.2.5 rga\_buffer\_handle\_t

说明

RGA驱动图像缓冲区句柄。

路径

```c
im2d_api/im2d_type.h
```

定义

typedef int rga_buffer_handle_t;

注意事项

当该内存使用完毕后须使用 releasebuffer\_handle 释放内存，避免内存泄漏。

#### 4.2.6 im\_handle\_param\_t

说明

描述待导入的图像缓冲区描述参数。

路径

```c
im2d_api/im2d_type.h
```

定义

```c
typedef struct im_handle_param {
uint32_t width;
uint32_t height;
uint32_t format;
} im_handle_param_t;
```


| 成员参数 | 描述 |
| --- | --- |
| width_stride | 描述待导入图像缓冲区的水平方向步幅，以像素为单位。 |
| height_stride | 描述待导入图像缓冲区的垂直方向步幅，以像素为单位。 |
| format | 描述待导入图像缓冲区的格式。 |

### 注意事项

该结构描述为缓冲区内存开辟大小，如若实际开辟内存大小小于该结构配置大小，会导致 importbuffer\_T 接口错误。

#### 4.2.7 im\_nn\_t

说明

描述运算点前处理（量化）的参数。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct im_nn {
int scale_r; /* scaling factor on R channal */
int scale_g; /* scaling factor on G channal */
int scale_b; /* scaling factor on B channal */
int offset_r; /* offset on R channal */
int offset_g; /* offset on G channal */
int offset_b; /* offset on B channal */
} im_nn_t;
```


| 成员参数 | 描述 |
| --- | --- |
| scale_r | red分量缩放系数。 |
| scale_g | green分量缩放系数。 |
| scale_b | blue分量缩放系数。 |
| offset_r | red分量偏移值。 |
| offsetg | green分量偏移值。 |
| offset_b | blue分量偏移值。 |

注意事项

无

#### 4.2.8 im\_colorkey\_range

说明

Colorkey关键色范围。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct {
int max;
int min;
} im_colorkey_range;
```

/\* The Maximum value of the color key \*/   

/\* The minimum value of the color key \*/


| 成员参数 | 描述 |
| --- | --- |
| max | 关键色范围最大值。 |
| min | 关键色范围最小值。 |

### 注意事项

无

#### 4.2.9 im\_osd\_block\_t

说明

OSD字块描述参数配置。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct im_osd_block {
int width_mode; // normal or different
// IM_OSD_BLOCK_MODE_NORMAL
// IM_OSD_BLOCK_MODE_DIFFERENT
union {
int width; // normal_mode block width
int width_index; // different_mode block width index in RAM
};
int block_count; // block count
int background_config; // background config is bright or dark
// IM_OSD_BACKGROUND_DEFAULT_BRIGHT
// IM_OSD_BACKGROUND_DEFAULT_DARK
```

```c
int direction; // osd block direction
// IM_OSD_MODE_HORIZONTAL
// IM_OSD_MODE_VERTICAL
int color_mode; // using src1 color or config color
// IM_OSD_COLOR_PIXEL
// IM_OSD_COLOR_EXTERNAL
im_color_t normal_color; // config color: normal
im_color_t invert_color; // config color: invert
} im_osd_block_t;
```


| 成员参数 | 描述 |
| --- | --- |
| width_mode | 字块宽度模式配置： 字块宽度相同：IM_OSD_BLOCK_MODE_NORMAL 字块宽度不同：IM_OSD_BLOCK_MODE_DIFFERENT |
| width/width_index | width：字块宽度相同模式时使用，标识当前task OSD字块宽度。 width_index：字块宽度不同模式时使用，标识当前使用RAM内部的宽度配置表的索引。 |
| block_count | 字块数量 |
| background_config |  |
| 文字背景亮度描述： 白底黑字：IM_OSD_BACKGROUND_DEFAULT_BRIGHT |  |
| 黑底白字：IM_OSD_BACKGROUND_DEFAULT_DARK |  |
| direction | OSD方向： |
| 垂直方向：IM_OSD_MODE_VERTICAL |  |
| 水平方向：IM_OSD_MODE_HORIZONTAL |  |
| color_mode | OSD字块颜色模式： |
| 像素颜色：IM_OSD_COLOR_PIXEL |  |
| 外部指导颜色：IM_OSD_COLOR_EXTERNAL |  |
| normal_color | 外部指导颜色：正常时（非反色状态）字块颜色。 |
| invert_color | 外部指导颜色：反色时字块颜色。 |

### 注意事项

无

#### 4.2.10 im\_osd\_invert\_factor\_t

说明

OSD反色公式配置。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct im_osd_invert_factor {
uint8_t alpha_max;
uint8_t alpha_min;
uint8_t yg_max;
uint8_t yg_min;
uint8_t crb_max;
uint8_t crb_min;
} im_osd_invert_factor_t;
```

### 计算公式如下：

MAX(channel\_min\_factor, channel\_max\_factor - channel\_value)

注意事项

#### 4.2.11 im\_osd\_invert\_t

说明

OSD反色功能配置。

路径

im2d\_api/im2d\_type.h

定义


| 成员参数 | 描述 |
| --- | --- |
| invert_channel | 反色通道配置：默认无通道反色使能：IM_OSD_INVERT_CHANNEL_NONEY/G分量反色使能：IM_OSD_INVERT_CHANNEL_Y_GC（UV）/RB分量反色使能：IM_OSD_INVERT_CHANNEL_C_RBAlpha分量反色使能：IM_OSD_INVERT_CHANNEL_ALPHA颜色值反色使能：IM_OSD_INVERT_CHANNEL_COLOR即(IM_OSD_INVERT_CHANNEL_Y_G \|IM_OSD_INVERT_CHANNEL_C_RB)。全部通道反色使能：IM_OSD_INVERT_CHANNEL_BOTH即(IM_OSD_INVERT_CHANNEL_COLOR \|IM_OSD_INVERT_CHANNEL_ALPHA)。 |
| flags_mode | 反色指导模式：内部指导：IM_OSD_FLAGS_EXTERNAL，使用内部RAM统计的反色flag指导反色功能。外部指导：IM OSD FLAGS INTERNAL，由外部指导反色功能。 |
| flags_index | 当前使用RAM内部的反色指导flag表的索引。 |
| invert_flags | 外部指导反色配置表，共64个bit。 |
| current_flags | 当前task统计的反色配置表，共64个bit，task执行结束后读取。 |
| invert_mode | 反色模式：自定义公式：IM_OSD_INVERT_USE_FACTOR默认公式：IM_OSD_INVERT_USE_SWAP，YUV格式对U、V分量进行交换，RGB格式对R、B分量进行交换。 |
| factor | 反色公式配置。 |
| threash | 反色阈值。 |

### 注意事项

#### 4.2.12 im\_osd\_bpp2\_t

说明

OSD BPP2 RGB格式映射配置。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct im_osd_bpp2 {
uint8_t ac_swap; // ac swap flag
// 0: CA
// 1: AC
uint8_t endian_swap; // rgba2bpp endian swap
// 0: Big endian
// 1: Little endian
im_color_t color0;
im_color_t color1;
} im_osd_bpp2_t;
```


| 成员参数 | 描述 |
| --- | --- |
| ac_swap | AC排布模式。 |
| endian_swap | 大小端配置。 |
| color0 | color值为0时映射的颜色。 |
| color1 | color值为1时映射的颜色。 |

### 注意事项

无

#### 4.2.13 im\_osd\_t

说明

OSD功能配置。

路径

im2d\_api/im2d\_type.h

定义

```c
typedef struct im_osd {
int osd_mode; // osd mode: statistics or auto_invert
im_osd_block_t block_parm; // osd block info config
im_osd_invert_t invert_config;
im_osd_bpp2_t bpp2_info;
} im_osd_t;
```


| 成员参数 | 描述 |
| --- | --- |
| osd_mode | OSD模式： 统计模式：IM_OSD_MODE_STATISTICS |
|  | 反色模式：IM_OSD_MODE_AUTO_INVERT |
| block_parm | OSD block参数配置。 |
| invert_config | 反色功能配置。 |
| bpp2_info | bpp2-rgb格式配置。 |

### 注意事项

## 5. 测试用例及调试方法

为了让开发者更加快捷的上手上述的新接口，这里通过运行demo和对demo源码的解析以加速开发者对API的理解和运用。

## 5.1测试文件说明

用于测试的输入与输出二进制文件需提前准备好，在/sample/sample\_file目录下，存放着默认的RGBA8888格式的源图像文件可以直接使用。

Android系统须将源图片存储在设备/data/目录下，Linux系统须将源图储存在设备/usr/data目录下，文件命名规则如下：

in%dw%d-h%d-%s.bin  

out%dw%d-h%d-%s.bin  

示例：  

1280×720 RGBA8888的输入图像： in0w1280-h720-rgba8888.bin  

1280×720 RGBA8888的输出图像： out0w1280-h720-rgba8888.bin

参数解释如下：

输入文件为 in ， 输出文件为 out

---&gt;第一个%d 是文件的索引，一般为 0， 用于区别格式及宽高完全相同的文件

---&gt;第二个%d 是宽的意思，这里的宽一般指虚宽

---&gt;第三个%d 是高的意思，这里的高一般指虚高

---&gt;第四个%s 是格式的名字。

预置测试的部分常用图像格式如下，其他格式对应字符串名可以查看rgaUtils.cpp中查看：


| format（Android） | format (Linux) | name |
| --- | --- | --- |
| HAL_PIXEL_FORMAT_RGB_565 | RK_FORMAT_RGB_565 | &quot;rgb565&quot; |
| HAL_PIXEL_FORMAT_RGB_888 | RK_FORMAT_RGB_888 | &quot;rgb888&quot; |
| HAL_PIXEL_FORMAT_RGBA_8888 | RK_FORMAT_RGBA_8888 | &quot;rgba8888&quot; |
| HAL_PIXEL_FORMAT_RGBX_8888 | RK_FORMAT_RGBX_8888 | &quot;rgbx888&quot; |
| HAL_PIXEL_FORMAT_BGRA_8888 | RK_FORMAT_BGRA_8888 | &quot;bgra888&quot; |
| HAL_PIXEL_FORMAT_YCrCb_420_SP | RK_FORMAT_YCrCb_420_SP | &quot;crcb420sp&quot; |
| HAL_PIXEL_FORMAT_YCrCb_NV12 | RK_FORMAT_YCbCr_420_SP | &quot;nv12&quot; |
| HAL_PIXEL_FORMAT_YCrCb_NV12_VIDEO | 1 | &quot;nv12&quot; |
| HAL PIXEL FORMAT YCrCb NV12 10 | RK_FORMAT_YCbCr_420_SP_10B | &quot;nv12_10&quot; |

demo中默认的输入图像文件分辨率为1280x720，格式为RGBA8888， 则须在/data或/usr/data目录下提前准备好名为in0w1280-h720-rgba8888.bin的源图像文件，图像合成模式还须额外在/data或/usr/data目录下提前准备好名为in1w1280-h720-rgba8888.bin的源图像文件。

## 5.2调试方法说明

运行demo后打印日志如下（以图像拷贝为例）：

Android中打印日志如下：

```markdown
# rgaImDemo --copy
librga:RGA_GET_VERSION:3.02,3.020000
ctx=0x7ba35c1520,ctx->rgaFd=3
Start selecting mode
im2d copy ..
GraphicBuffer check ok
GraphicBuffer check ok
lock buffer ok
open file ok
```

```
//RGA版本
//RGA上下文
//RGA运行模式
//src文件的状态，如果/data/目录下没有对应文件这里会报错
```

unlock buffer ok   

lock buffer ok   

unlock buffer ok   

copying .... successfully   

open /data/out0w1280-h720-rgba8888.bin and write ok

Linux系统中打印日志如下：

```markdown
# rgaImDemo --copy
librga:RGA_GET_VERSION:3.02,3.020000 //RGA版本
ctx=0x2b070,ctx->rgaFd=3 //RGA上下文
Rga built version:version:1.00
Start selecting mode
im2d copy .. //RGA运行模式
open file //src文件的状态，如果/usr/data/目录下没有对应文件这里会报错
copying .... Run successfully //标志运行成功
open /usr/data/out0w1280-h720-rgba8888.bin and write ok //输出文件名以及目录
```

当需要查看RGA运行更加详细的日志时，Android系统可以通过设置属性vendor.rga.log（Android 8及以下是sys.rga.log）来打开RGA配置log打印：

setprop vendor.rga.log 1 打开RGA log打印   

logcat -s librga 开启并过滤log打印   

setprop vendor.rga.log 0 关闭RGA log打印

Linux系统中需要打开代码core/NormalRgaContext.h，将\_\_DEBUG设置为1，重新编译即可

```c
#ifdef LINUX
-#define _DEBUG 0
+#define _DEBUG 1
```

一般打印log如下，可将此log上传至RedMine，由RK有关工程师分析：

Android系统中打印日志如下：

D librga : &lt;&lt;&lt;&lt;-------- print rgaLog ---&gt;&gt;&gt;&gt;   

D librga : src-&gt;hnd = 0x0 , dst-&gt;hnd = 0x0   

D librga : srcFd = 11 , phyAddr = 0x0 , virAddr = 0x0   

D librga : dstFd = 15 , phyAddr = 0x0 , virAddr = 0x0   

D librga : srcBuf = 0x0 , dstBuf = 0x0   

D librga : blend = 0 , perpixelAlpha = 1   

D librga : scaleMode = 0 , stretch = 0;   

D librga : rgaVersion = 3.020000 , ditherEn =0   

D librga : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0   

D librga : &lt;&lt;&lt;&lt;-- rgaReg --- -----&gt;&gt;&gt;&gt;   

D librga : render\_mode=0 rotate\_mode=0   

D librga : src:[b,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0   

D librga : dst:[f,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0   

D librga : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0   

D librga : ROP:[0,0,0],LUT[0]   

D librga : color:[0,0,0,0,0]   

D librga : MMU:[1,0,80000521]   

D librga : mode[0,0,0,0]

Linux系统打印日志如下：

```csv
render_mode=0 rotate_mode=0
src:[0,a681a008,a68fb008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
dst:[0,a6495008,a6576008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
ROP:[0,0,0],LUT[0]
color:[0,0,0,0,0]
MMU:[1,0,80000521]
mode[0,0,0,0,0]
gr_color_x [0, 0, 0]
gr_color_x [0, 0, 0]
```

## 5.3测试用例说明

测试路径位于librga源码目录下 sample/im2d\_api\_demo ，开发者可以根据需求修改demo的配置，建议第一次运行demo使用默认配置。

测试用例的编译不同的平台编译是不同的，Android平台可以使用 ‘mm’ 命令进行编译，linux平台上在使用cmake编译librga.so时会在同目录下生成对应的测试用例。

将对应的测试用例编译后生成的可执行文件通过adb传入设备，添加执行权限，执行demo，查看打印log。

查看输出文件，检查是否与预期相符。

### 5.3.1申请图像缓冲

demo中提供了两种buffer用于RGA合成——Graphicbuffer、AHardwareBuffer。这两种buffer通过宏USE\_AHARDWAREBUFFER区分。

```makefile
目录：librga/samples/im2d_api_demo/Android.mk
（line +15）
ifeq (1,$(strip $(shell expr $(PLATFORM_SDK_VERSION) \> 25)))
/*USE_AHARDWAREBUFFER为1则使用AHardwareBuffer，为0使用Graphicbuffer*/
LOCAL_CFLAGS += -DUSE_AHARDWAREBUFFER=1
endif
```

##### 5.3.1.1 Graphicbuffer

主要通过三个函数完成Graphicbuffer的初始化、填充/清空、填充rga\_buffer\_t结构体。

```c
/*传入src/dst的宽、高、图像格式，初始化Graphicbuffer*/
src_buf = GraphicBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT);
dst_buf = GraphicBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT);
/*通过枚举值FILL_BUFF/EMPTY_BUFF，执行填充/清空Graphicbuffer*/
GraphicBuffer_Fill(src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
GraphicBuffer_Fill(dst_buf, FILL_BUFF, 1);
else
GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_GraphicBuffer(src_buf);
dst = wrapbuffer_GraphicBuffer(dst_buf);
```

##### 5.3.1.2 AHardwareBuffer

主要通过三个函数完成AHardwareBuffer的初始化、填充/清空、填充rga\_buffer\_t结构体。

```c
/*传入src/dst的宽、高、图像格式，初始化AHardwareBuffer*/
AHardwareBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT, &src_buf);
AHardwareBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT, &dst_buf);
/*通过枚举值FILL_BUFF/EMPTY_BUFF，执行填充/清空AHardwareBuffer*/
AHardwareBuffer_Fill(&src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
AHardwareBuffer_Fill(&dst_buf, FILL_BUFF, 1);
else
AHardwareBuffer_Fill(&dst_buf, EMPTY_BUFF, 1);
/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_AHardwareBuffer(src_buf);
dst = wrapbuffer_AHardwareBuffer(dst_buf);
```

### 5.3.2查看帮助信息

使用如下命令获取测试用例帮助信息

```shell
rgaImDemo -h
rgaImDemo --help
rgaImDemo
```

运行成功后，便可以根据帮助信息使用demo，打印信息如下：

rk3399\_Android10:/ # rgaImDemo   

librga:RGA\_GET\_VERSION:3.02,3.020000   

ctx=0x7864d7c520,ctx-&gt;rgaFd=3

usage: rgaImDemo [--help/-h] [--while/-w=(time)] [--querystring/--querystring=&lt;options&gt;]   

[--copy] [--resize=&lt;up/down&gt;] [--crop] [--rotate=90/180/270]   

[--flip=H/V] [--translate] [--blend] [--cvtcolor]   

[--fill=blue/green/red]   

--help/-h Call help   

--while/w Set the loop mode. Users can set the number of cycles by themselves.   

--querystring You can print the version or support information corresponding to the current version

version of RGA will be printed.   

&lt;options&gt;:   

vendor Print vendor information.   

version Print RGA version, and librga/im2d\_api version.   

maxinput Print max input resolution.   

maxoutput Print max output resolution.   

scalelimit Print scale limit.   

inputformat Print supported input formats.   

outputformat Print supported output formats.   

expected Print expected performance.   

all Print all information.   

--copy Copy the image by RGA.The default is 720p to 720p.   

--resize resize the image by RGA.You can choose to up(720p-&gt;1080p) or down(720p-&gt;480p).   

--crop Crop the image by RGA.By default, a picture of 300\*300 size is cropped from (100,100).   

--rotate Rotate the image by RGA.You can choose to rotate 90/180/270 degrees.   

--flip Flip the image by RGA.You can choice of horizontal flip or vertical flip.   

--translate Translate the image by RGA.Default translation (300,300).   

--blend Blend the image by RGA.Default, Porter-Duff 'SRC over DST'.   

--cvtcolor Modify the image format and color space by RGA.The default is RGBA8888 to NV12.   

--fill Fill the image by RGA to blue, green, red, when you set the option to the corresponding   

color.   

======

所有的参数解析在目录/librga/demo/im2d\_api\_demo/args.cpp中。

#### 5.3.3 循环执行demo

使用如下命令循环执行示例demo，循环命令必须在所有参数之前，循环次数为int型，默认每次循环间隔200ms。

```batch
rgaImDemo -w6 --copy
rgaImDemo --while=6 --copy
```

### 5.3.4获取RGA版本及支持信息

使用如下命令获取版本及支持信息：

rgaImDemo --querystring   

rgaImDemo --querystring=&lt;options&gt;

该命令有可选options，没有options则默认视为选择=all，可选options如下：

options：  

=vendor 打印厂商信息  

=version 打印版本信息  

=maxinput 打印支持的最大输入分辨率  

=maxoutput 打印支持的最大输出分辨率  

=scalelimit 打印支持的缩放倍数  

=inputformat 打印支持的输入格式  

=outputformat 打印支持的输出格式  

=expected 打印预期性能  

=all 打印所有信息

##### 5.3.4.1 代码解析

根据main()传参决定打印出的不同信息。

```javascript
/*将main()传参转化为QUERYSTRING_INFO枚举值*/
IM_INFO = (QUERYSTRING_INFO)parm_data[MODE_QUERYSTRING];
/*打印querystring()返回的字符串，即所需要的信息*/
printf("\n%s\n", querystring(IM_INFO));
```

#### 5.3.5 图像缩放

使用如下命令进行图像缩放测试

```batch
rgaImDemo --resize=up
rgaImDemo --resize=down
```

该功能必须填入可选options，可选options如下：

options：   

=up   

=down

图像分辨率放大至1920x1080  

图像分辨率缩小至720x480

##### 5.3.5.1 代码解析

根据main()传参（up/down）决定放大或是缩小，即针对不同场景，重新初始化、清空buffer，填充rga\_buffer\_t结构体，并将最终的存储src、dst图像数据的rga\_buffer\_t结构体传入imresize()。

switch(parm\_data[MODE\_RESIZE])   

```
{
```

/\*放大图像\*/   

case IM\_UP\_SCALE :   

/\*重新初始化Graphicbuffer为分辨率1920x1080对应大小\*/   

dst\_buf = GraphicBuffer\_Init(1920, 1080, DST\_FORMAT);   

/\*清空buffer\*/   

GraphicBuffer\_Fill(dst\_buf, EMPTY\_BUFF, 1);   

/\*重新填充存储dst数据的rga\_buffer\_t结构体\*/   

```
dst = wrapbuffer_GraphicBuffer(dst_buf);
break;
```

case IM\_DOWN\_SCALE :   

/\*重新初始化Graphicbuffer为分辨率1920x1080对应大小\*/   

dst\_buf = GraphicBuffer\_Init(720, 480, DST\_FORMAT);   

/\*清空buffer\*/   

GraphicBuffer\_Fill(dst\_buf, EMPTY\_BUFF, 1);   

/\*重新填充存储dst数据的rga\_buffer\_t结构体\*/   

```
dst = wrapbuffer_GraphicBuffer(dst_buf);
break;
}
```

/\*将rga\_buffer\_t格式的结构体src、dst传入imresize()\*/   

STATUS = imresize(src, dst);

/\*根据返回的IM\_STATUS枚举值打印运行状态\*/   

printf("resizing .... %s\n", imStrError(STATUS));

#### 5.3.6 图像裁剪

使用如下命令测试图像裁剪

```batch
rgaImDemo --crop
```

该功能无可选options，默认裁剪坐标LT(100,100)，RT(400,100)，LB(100,400)，RB(400,400)内的图像。

##### 5.3.6.1 代码解析

将需要裁剪的大小在存储src矩形数据的im\_rect结构体中赋值，并将存储src、dst图像数据的rga\_buffer\_t结构体传入imcrop()。

```c
/*这里通过x、y确定裁剪顶点的坐标，width、height确定裁剪区域大小*/
src_rect.x = 100;
src_rect.y = 100;
src_rect.width = 300;
src_rect.height = 300;
/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst传入imcrop()*/
STATUS = imcrop(src, dst, src_rect);
/*根据返回的IM_STATUS枚举值打印运行状态*/
printf("cropping .... %s\n", imStrError(STATUS));
```

#### 5.3.7 图像旋转

使用如下命令测试图像旋转

```shell
rgaImDemo --rotate=90
rgaImDemo --rotate=180
rgaImDemo --rotate=270
```

该功能必须填入可选options，可选options如下：

options：  

=90  

=180  

=270

图像旋转90° ，输出图像分辨率宽高交换  

图像旋转180°，输出图像分辨率不变  

图像旋转270°，输出图像分辨率宽高交换

##### 5.3.7.1 代码解析

根据main()传参（90/180/270）决定旋转角度，并将传参转化为IM\_USAGE枚举值，与存储src、dst图像数据的rga\_buffer\_t结构体一同传入imrotate()。

```c
/*将main()传参转化为IM_USAGE枚举值*/
ROTATE = (IM_USAGE)parm_data[MODE_ROTATE];
/*将标识旋转角度的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst一同传入imrotate()*/
STATUS = imrotate(src, dst, ROTATE);
/*根据返回的IM_STATUS枚举值打印运行状态*/
printf("rotating .... %s\n", imStrError(STATUS));
```

### 5.3.8图像镜像翻转

使用如下命令测试镜像翻转

rgaImDemo --flip=H   

rgaImDemo --flip=V

该功能必须填入可选options，可选options如下：

##### 5.3.8.1 代码解析

根据main函数传参（H/V）决定镜像翻转方向，并将传参转化为IM\_USAGE枚举值，与存储src、dst图像数据的rga\_buffer\_t结构体一同传入imflip()。

```c
/*将main()传参转化为IM_USAGE枚举值*/
FLIP = (IM_USAGE)parm_data[MODE_FLIP];
/*将标识镜像反转方向的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst一同传入imflip()*/
STATUS = imflip(src, dst, FLIP);
/*根据返回的IM_STATUS枚举值打印运行状态*/
printf("flipping .... %s\n", imStrError(STATUS));
```

### 5.3.9图像颜色填充

使用如下命令测试颜色填充

```shell
rgaImDemo --fill=blue
rgaImDemo --fill=green
rgaImDemo --fill=red
```

该功能必须填入可选options，默认填充颜色在坐标LT(100,100)，RT(400,100)，LB(100,400)，RB(400,400)内的图像，可选options如下：

options：  

=blue 图像颜色填充为蓝色  

=green 图像颜色填充为绿色  

=red 图像颜色填充为红色

##### 5.3.9.1 代码解析

根据main函数传参（bule/green/red）决定填充颜色，将需要填充的大小在存储dst矩形数据的im\_rect结构体中赋值，并将传参转化为对应颜色的16进制数，与存储dst图像数据的rga\_buffer\_t结构体一同传入imfill()。

/\*将main()传参转化为对应颜色的16进制数\*/   

COLOR = parm_data[MODE_FILL];

/\*这里通过x、y确定裁剪顶点的坐标，width、height确定填充颜色区域大小\*/   

dst\_rect.x = 100;   

dst\_rect.y = 100;   

dst\_rect.width = 300;   

dst\_rect.height = 300;   

/\*将im\_rect格式的结构体dst\_rect、对应颜色的16进制数与rga\_buffer\_t格式的结构体src、dst一同传入imfill()\*/   

STATUS = imfill(dst, dst_rect, COLOR);

/\*根据返回的IM\_STATUS枚举值打印运行状态\*/   

printf("filling .... %s\n", imStrError(STATUS));

#### 5.3.10 图像平移

使用如下命令测试图像平移操作

```batch
rgaImDemo --translate
```

该功能无可选options，默认顶点（左上角坐标）平移至(300,300)，即向右平移300个像素，再向下平移300个像素。

##### 5.3.10.1 代码解析

将需要平移的偏移量在存储src矩形数据的im\_rect结构体中赋值，并将存储src、dst图像数据的rga\_buffer\_t结构体传入imtranslate()。

```c
/*这里通过x、y确定平移后图像的顶点的坐标*/
src_rect.x = 300;
src_rect.y = 300;
/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst一同传入imtranslate()*/
STATUS = imtranslate(src, dst, src_rect.x, src_rect.y);
/*根据返回的IM_STATUS枚举值打印运行状态*/
printf("translating .... %s\n", imStrError(STATUS));
```

#### 5.3.11 图像拷贝

使用如下命令测试图像拷贝

```batch
rgaImDemo --copy
```

该功能无可选options，默认拷贝分辨率为1280x720，格式为RGBA8888的图像。

##### 5.3.11.1 代码解析

将存储src、dst图像数据的rga\_buffer\_t结构体传入imcopy()。

/\*rga\_buffer\_t格式的结构体src、dst传入imcopy()\*/   

STATUS = imcopy(src, dst);

/\*根据返回的IM\_STATUS枚举值打印运行状态\*/   

printf("copying .... %s\n", imStrError(STATUS));

#### 5.3.12 图像合成

使用如下命令测试图像合成

```batch
rgaImDemo --blend
```

该功能无可选options，默认合成模式为 IM\_ALPHA\_BLEND\_DST 模式。

##### 5.3.12.1 代码解析

将存储src、dst图像数据的rga\_buffer\_t结构体传入imblend()。

```c
/*rga_buffer_t格式的结构体src、dst传入imblend()*/
STATUS = imblend(src, dst);
/*根据返回的IM_STATUS枚举值打印运行状态*/
printf("blending .... %s\n", imStrError(STATUS));
```

#### 5.3.13 图像格式转换

使用如下命令测试图像格式转换

```batch
rgaImDemo --cvtcolor
```

该功能无可选options，默认将分辨率为1280x720的图像从RGBA8888格式转换为NV12格式。

##### 5.3.13.1 代码解析

将需要转换的格式在rga\_buffer\_t的成员变量format中赋值，并将存储src、dst图像数据的rga\_buffer\_t结构体传入imcvtcolor()。

/\*将转换前后的格式赋值给对应的rga\_buffer\_t结构体的成员变量format\*/  

src.format = HAL\_PIXEL\_FORMAT\_RGBA\_8888;  

dst.format = HAL\_PIXEL\_FORMAT\_YCrCb\_NV12;  

/\*将需要转换的格式与rga\_buffer\_t格式的结构体src、dst一同传入imcvtcolor()\*/  

STATUS = imcvtcolor(src, dst, src.format, dst.format);

/\*根据返回的IM\_STATUS枚举值打印运行状态\*/  

printf("cvtcolor .... %s\n", imStrError(STATUS));
