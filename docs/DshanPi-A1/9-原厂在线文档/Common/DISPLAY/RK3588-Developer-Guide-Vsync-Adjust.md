---
sidebar_position: 1
---

# Rockchip RK3588 Vsync 调整说明

## 前言

## 概述

本文描述 RK3588 Vsync 调整的说明。

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3588 | LINUX KERNEL 5.10 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 张玉炳 | 2022-06-28 | 初始版本 |
| V1.1.0 | 张玉炳 | 2024-05-29 | 添加 DSI AUTO 模式下说明 |
| V1.2.0 | 张玉炳/黄国椿 | 2024-06-12 | 添加 DSI/eDP VRR 更多说明 |

## 1. 扫描时序说明

要输出一帧图像到屏幕时，一般有扫描时序如下图：



每一行包括 hsync, hback porch, hactive, hfront porch, 每一帧包括 vsync, vback porch, vactive, vfront porch。定义 htotal 如下：

$$

h t o t a l = h s y n c + h b a c k p o r c h + h a c t i v e + h f r o n t p o r c h

$$

定义 vtotal 如下：

$$

v t o t a l = v s y n c + v b a c k p o r c h + v a c t i v e + v f r o n t p o r c h

$$

对于一个 pixel clock 为 pixel\_clk, 刷新率为 fps 的扫描时序输出，要满足如下公式：

$$

p i x e l \_ c l k = h t o t a l * v t o t a l * f p s

$$

从扫描时序图看，一个 Vysnc 周期即为 1/fps, 要调整 Vysnc 周期，即调整 fps，可以通过修改 pixel clock，htotal， vtotal 来实现。对一个固定的分辨率，

hactive 和 vactive 是不变，htotal 中只能调整 hbank(hsync + hback porch + hfront porch), vtotal 中只能调整vbank(vsync + vback porck + vfront porch)，

在调整 hbank 的方案中，目前遇到的屏基本都是调整 HFP(hfront porch), 在调整 vbank 的方案中，目前遇到的屏基本都是调整 VFP(vfront porch)。pixel clock 的调整，在 RK3588 中对应 dclk rate 的调整。

后续讨论调整 Vsync 周期，只讨论调整 VFP, HFP 或 dclk rate 这几种方案。

以 DSI 挂 VP2 通路实现 120/60fps 动态变频为例，其分辨率信息如下：

## 2. 显示通路说明

RK3588 的显示通路如下图：



支持 HDMI, DSI, DP, eDP 等接口输出，其中，HDMI，DSI 接口输出时，可能使用 DSC，在评估 DSI 和HDMI 接口调整 Vsync 周期时，需要分别考虑使能 DSC 和不使能 DSC 的两种场景。

## 3. VOP 调整说明

在 RK3588 的 VOP 中， 通过寄存器配置可以调整 VFP， HFP 或 dclk rate，其中调整 VFP 可以配置成立即生效或者帧生效，调整 HFP 只能是帧生效，调整 dclk rate 只能是帧生效。

通过调整 dclk rate 改变 Vysnc 周期，有如下限制：

1. 只有 VP0 和 VP2 支持切换 dclk 源来改变 Vsync 周期；

2. VP0 可以在 dclk0 和 dclk1 之间切换 dclk 源，VP2 可以在 dclk2 和 dclk1 之前切换 dclk 源。



Video Port0: DISABLED   

Video Port1: DISABLED   

Video Port2: ACTIVE   

Connector: DSI-1   

bus\_format[1018]: RGB101010\_1X30   

overlay\_mode[0] output\_mode[f] color\_space[0], eotf:0   

Display mode: 3024x2016p120   

clk[1187744] real\_clk[1187744] type[48] flag[a]   

H: 3024 4416 4432 4532   

V: 2016 2042 2044 2184   

Variable refresh rate info:   

Min refresh rate: 60   

Max refresh rate: 120   

Current refresh rate: 60   

Type: DCLK   

Current pixel clock:593872   

Cluster1-win0: ACTIVE   

win\_id: 2   

format: AB24 little-endian (0x34324241)[AFBC] SDR[0] color\_space[0]   

glb\_alpha[0xff]   

rotate: xmirror: 0 ymirror: 0 rotate\_90: 0 rotate\_270: 0   

csc: y2r[0] r2y[0] csc mode[0]   

zpos: 0   

src: pos[0, 0] rect[3024 x 2016]   

dst: pos[0, 0] rect[3024 x 2016]   

buf[0]: addr: 0x00000000ef7b9000 pitch: 12096 offset: 0   

Video Port3: DISABLED

120/60fps 变频场景下，将dclk1 和 dclk2 同时挂在 v0pll(dclk1和dclk2为2倍频关系，可以满足精准分频同时保证父pll稳定不发生变化), 时钟关系如下关系如下：

cat /sys/kernel/debug/clk/clk_summary

pll\_v0pll 1 1 0 1187743988 0 0 50000   

v0pll 2 2 0 1187743988 0 0 50000   

dclk\_vop2\_src 1 2 0 296935997 0 0 50000   

dclk\_vop2 1 2 0 296935997 0 0 50000   

dclk\_vop1\_src 1 2 0 148467999 0 0 50000   

dclk\_vop1 1 2 0 148467999 0 0 50000

## 4. DSC 模块调整说明

DSC 模块支持调整 VFP 和 HFP，并且都只能配置成立即生效。DSC 模式也支持 VOP 通过调整 dclk 后送进来的 timing。

## 5. DSI 接口调整说明

DSI 的寄存器其配置都是立即生效的，无论配置 VFP，HFP 都是立即生效。DSI 有两种工作模式，

Manual 和 Auto-Calculation。在 Auto-Calculation 模式下，DSI 控制器会被配置为从 IPI 和 PPI 接口提取所有必要的信息和时序参数，以满足视频模式中的帧时序要求，允许 IPI 帧动态变化，同时控制器适应输出帧的变化，所以 DSI 在 Auto-Calculattion 模式下可以根据收到的 VOP timing 自动调整 phy 上的输出，不需要配置 DSI 的寄存器。在不同模式下，对调整方式的支持存在差异。

### 5.1 VFP 调整说明

DSI 接口可以通过调整 VFP 来改变 Vsync 的周期。

在 Manual 模式下， Vsync 中断到来时，同时改变 VOP、DSC(如果有使能 DSC)、 DSI 的 VFP 寄存器，并立即起效，就可以改变当前帧的 VFP。由于 DSI 寄存器的限制， VFP 最大只能设置到 1023。

如果为了获取更大的 VFP ，可以只调整VOP、DSC(如果有用到 DSC 压缩)的 VFP 寄存器，不过不改动DSI 的 VFP 寄存器会影响 VFP 的发包配置，会出现下图情形：

即缺少同步包，如果屏端不接受这种波形，则可能出现显示异常，不建议不配置 DSI 的 VFP。

在 Auto-Calculation 模式下，只需在 Vsync 中断到来时，同时改变 VOP、DSC(如果有使能 DSC)，并立即起效。DSI 的 VFP 同样只能到 1023。

### 5.2 HFP 调整说明

通过配置 DSC HFP 寄存器实现动态帧率存在的风险：

DSC 时序相关寄存器是立即生效，与 VOP 按帧生效机制不同，在帧尾改变 DSC 的配置寄存器，会破坏当前帧的时序，帧时间上带来误差，而 DSC video mode 模式需要保证 VOP 和 DSC 的扫描时序尽可能一致，否则 DSC 内部的 Buffer 会溢出。

如下是当 DSC 出错后，在 MIPI DPHY 上异常波形体现（无数据下发）：

在 Manual 模式下，RK3588 的 DSI 接口目前不支持通过调整 HFP 改变 Vsync。本地测试 DSC 模式下调整 HFP 会显示异常，如下：

在 Auto-Calculation 模式下，不 使能DSC 时，调整 HFP 时只需要调整 VOP 的 HFP，DSI 可以支持这种调整方式。使能 DSC 时，由于需要同时调整 VOP 和 DSC 的寄存器，无法保证 HFP 的调整会在同一行起效，不支持调整 HFP。

### 5.3 dclk rate 调整说明

在 Manual 模式下，不支持 VOP 调整 dclk rate 来改变 Vsync 周期。

在 Auto-Calculation 模式下，无论是否使能 DSC，都支持使用 dclk rate 调整 Vsync 周期， DSI 控制器自动调整输出。

以如下红框 A/B 两组 120/60 帧 timing 作为变帧说明：

#### 5.3.1 dclk rate 调整的变帧细节

如下图，红色信号表示屏端 IC 内部解析到 HSYNC 资讯，dclk 变帧调整为帧生效，在变帧瞬间，屏端统计上一帧的26行 VFP后，预计收到 VSYNC，并且预期 VSYNC 到 DATA 会有 140+2 个 VBP+VSA，屏端IC 会取 VSYNC 后的头4 line 平均宽度跟变帧时间作为变帧切换判断。

#### 5.3.2 120帧转60帧

#### 5.3.3 60帧转120帧

## 6. eDP/DP 接口调整说明

eDP 和 DP 接口对 VRR 的支持，除了控制器本身需要支持，还需要 DPCD/EDID 相关描述支持，eDP/DP对 VRR 的支持，也称之为 Adpative-Sync。

### 6.1 DPCD VRR 支持说明

MSA 数据包中包含 timing 信息用于 Sink 端重建视频流的时序。MSA 数据包中的这些 timing 是为静态时序的视频流设计的。如果视频流的时序是动态变化的，Sink 端不能使用 MSA 中的 timing 信息。Source端通过读取DOWN\_STREAM\_PORT\_COUNT 寄存器中的 MSA\_TIMING\_PAR\_IGNORED 位(DPCDAddress 00006h, bit6) 来确认 Sink 端是否支持是否无缝切换 timing (即 VRR)。如果支持并且 Source 端需要使用此功能，Source 端需要向DOWNSPREAD\_CTRL 寄存器的 MSA\_TIMING\_PAR\_IGNORE\_EN位(DPCD Address 00107h, bit7), Sink 端忽略如下的 MSA 参数。

### 6.2 EDID VRR 支持说明

在 EDID 有定义一个 Descriptor 描述对 VRR 的支持, 即 Display Range Limit Descriptor， 如下：

Table 3.26 – Display Range Limits & Timing Descriptor Block Definition


| Byte# | Value | Display Range Limits Definitions |
| --- | --- | --- |
| 0,1 | (00 00)h | Indicates that this 18 byte descriptor is a Display Descriptor. |
| 2 | 00h | Reserved: Set to 00h when 18 byte descriptor is used as a Display Descriptor |
| 3 | FDh | Tag Number for Display Range Limits Descriptor |
| 4 | 7654 321 0 | Display Range Limits Offsets: FLAGs |
| 0 0 0 0 | 00 | Vertical Rate Offsets are zero. |
| 0 0 0 0 | 1 0 | Max. Vertical Rate + 255 Hz Offset; Min. Vertical Rate is not offset |
| 0 0 0 0 | 1 1 | Max. Vertical Rate + 255 Hz Offset; Min. Vertical Rate + 255 Hz Offset |
| 0 0 0 0 | 0 0 | Horizontal Rate Offsets are zero. |
| 0 0 00 | 10 | Max. Horizontal Rate + 255 kHz Offset; Min. Horizontal Rate is not offset |
| 0 0 0 0 | 11 | Max. Horizontal Rate + 255 kHz Offset; Min. Horizontal Rate + 255 kHzOffset |
| 01h, 04h → 07h, 09h0Dh 10h → FFh | Reserved: Do not use. |  |
| 5 | 01h → FFh[Byte 4, Bits 1, 0] ≠ 11[Byte 4, Bits 1, 0] = 1100h | Minimum Vertical Rate:         (for interlace this refers to the field rate)Binary coded rate in Hz, integer only (range is 1 Hz to 255 Hz)Binary coded rate in Hz, integer only (range is 256 Hz to 510 Hz)Reserved: Do Not Use. |
| 6 | 01h→ FFh | Maximum Vertical Rate:          (for interlace this refers to the field rate) |
| [Byte 4, Bit 1]≠ 1 | Binary coded rate in Hz, integer only (range is 1 Hz to 255 Hz) |  |
| [Byte 4, Bit 1] = 1 | Binary coded rate in Hz, integer only (range is 256 Hz to 510 Hz)Note: Minimum rate value shall be less than or equal to maximum rate value |  |
| 00h | Reserved: Do Not Use. |  |
| 7 | 01h → FFh | Minimum Horizontal Rate: |
| [Byte 4, Bits 3, 2]≠11[Byte 4, Bits 3, 2] = 1100h | Binary coded rate in kHz, integer only (range is 1 kHz to 255 kHz)Binary coded rate in kHz, integer only (range is 256 kHz to 510 kHz)Reserved: Do Not Use. |  |
| 8 | 01h → FFh | Maximum Horizontal Rate: |
| [Byte 4, Bit 3] ≠1[Byte 4, Bit 3] = 100h | Binary coded rate in kHz, integer only (range is 1 kHz to 255 kHz) |  |
| , integer only (range is 256 kHz to 510 kHz) |  |  |
| value s |  |  |

这个 Descriptor 描述了 VRR 支持的范围。

需要注意的是， EDID 中定义的 timing 都是 vblank 和 hblank 最小的。比如从 EDID 获取 VRR 支持范围为 30 \~ 100 Hz, 那么，对于一个帧率为 60Hz 的 timing，

支持的 VRR 访问为 30 \~ 60Hz， 对于一个 24 Hz 的 timing， 则不支持 VRR。为了获取 VRR 规定范围内的更低的帧率，需要拓展 vbank。

### 6.3 eDP 接口 VRR 调整说明

eDP 接口支持通过调整 VFP 调整 Vsync。调整 VFP 时，只需要调整 VOP 的 VFP即可，eDP 需要再 dts中配置属性 analogix,force-stream-valid ，即可以自动根据 VOP 送出的 timing 进行调整。

eDP 接的屏有可能不支持 EDID, 这种情况 VRR 的支持范围需要从 dts 中定义。
