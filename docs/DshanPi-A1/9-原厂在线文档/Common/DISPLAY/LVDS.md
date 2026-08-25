---
sidebar_position: 1
---

# Rockchip LVDS接口开发指南

## 前言

本文主要介绍Rockchip平台LVDS显示接口的各种配置以及调试验证方法。

## 产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| RK3126 | Linux 4.4 |
| RK3128 | Linux 4.4 |
| RK3288 | Linux 4.4 |
| RK3326 / PX30 | Linux 4.19 及以后版本 |
| RK3368 | Linux 4.19 及以后版本 |
| RK356X | Linux 4.19 及以后版本 |

## 读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 陈潮毅 | 2023-11-16 | 初始版本 |
| V1.1.0 | 陈潮毅 | 2023-12-25 | 补充LVDS使用案例、增加图示 |
| V1.2.0 | 陈潮毅 | 2024-7-19 | 补充 LVDS 电气特性以及 RK356X 的共模/差模电压配置 |

## 1. 基础概念

LVDS (Low Voltage Differential Signaling) 是一种低电压差分信号传输技术，用于在高速串行数据通信中传输信号。它广泛应用于显示、图像传输和数据通信等领域。

LVDS是一种物理层信号传输技术，定义了电气特性和接口标准。VESA和JEIDA组织则规定了LVDS在数据链路上的传输方式。根据传输数据量的不同以及传输顺序，又可以分为JEIDA-18， JEIDA-24VESA-24等。

对于LVDS，一个时钟周期可以传输7bit的数据。下面简要介绍各种常见的LVDS格式的时序。

## 1. JEIDA-18



## 2. JEIDA-24



## 3. VESA-24



其中，CTL2为 DE使能信号，CTL1为VSYNC场同步信号，CTL0为HSYNC行同步信号。CTL3作为预留的额外用途信号，一般情况下可以忽略。

在 DTS 的 panel 节点中，可以通过 bus-format属性来指定采用的 LVDS 格式，其对应关系如下：

## 2. 电气特性



LVDS驱动器的典型实现电路如上图所示，本质上是一个由恒流源驱动的差分放大电路。

首先考虑直流输出特性，对于理想差分放大电路，共模电压Vcm可以表述为以下形式：

$$

```
V _ { c m } = \frac { U _ { a } + U _ { b } } { 2 }
```

$$

其中， $\$ 023,456$ 为图中A 的直流对地电压， $\$ 023,45$ 为图中B的直流对地电压。

对于理想差分放大电路，认为 $\mathbb &#123; S &#125; \mathrm &#123; U &#125; \&#123; a \&#125; = U \&#123; \boldsymbol &#123; \mathrm &#123; b &#125; &#125; \&#125; \mathbb &#123; S &#125;$ ，即接收端的100Ω电阻两端无压差，呈现出隔直流的特性。

再考虑交流输出特性，在AB两端产生的交流小信号 $\$ 123$ \$在接收端的100Ω电阻两侧产生压降，呈现出通交流的特性。

一个常见的需求是调整LVDS的驱动强度，以增强驱动强度为例，可以有多种实现方式，例如增大恒流源的电流，增加负载电阻等。

以上的分析均是从电路分析的角度出发，在实际的应用中，有些LVDSPHY提供了额外的配置完成这些操作。例如，可以通过增大差分电压\$u&#123;ab&#125;\$以提高LVDS的驱动强度（压差越高，电流越大）。

在实际应用中，还需要考虑传输线带来的影响。优化差分线上的电容和电阻（使其变小），也可以在一定程度上增强LVDS的驱动强度。

## 3. 平台支持情况


| 平台 | 支持LVDS0 | 支持LVDS1 |
| --- | --- | --- |
| RK3568 | √ | √ |
| RK3567 | √ | √ |
| RK3566 | √ | X |
| RK3562 | √ | X |
| RK3368 | √ | X |
| RK3326 /PX30 | √ | X |
| RK3288 | √ | √ |
| RK3128 | √ | X |
| RK3126 | √ | × |

## 4. 应用场景梗概

根据使用场景的不同，LVDS的用法可以归纳为下表：


| 编号 | 屏幕数量 | LVDS接口连接情况 | VideoPort 输出分配情况 | 最高分辨率 | 描述 |  |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1个屏幕 | LVDS0或LVDS1 | VP1 -&gt;LVDS0/1或 VP2 -&gt;LVDS0/1 | 1280x800 | 单通道LVDS屏 | rk3567-e |
| 2 | 1个屏幕 | LVDS0与LVDS1 | VP1 -&gt;LVDS0,VP1-&gt;LVDS1或 VP2 -&gt;LVDS0,VP2-&gt;LVDS1 | 1920x1080 | DualLVDS,双通道LVDS |  |
| 3 | 2个屏幕 | LVDS0与LVDS1 | VP1 -&gt;LVDS0,VP2 -&gt;LVDS1或VP2 -&gt;LVDS0,VP1 -&gt;LVDS1 | 每个屏幕为1280x800 | 两个VP分别接一个单通道LVDS 屏 | rk3567-evb2-lp4x-v10-two-vp-t |
| 4 | 2个屏幕 | LVDS0与LVDS1 | VP1 -&gt;LVDS0,VP1-&gt;LVDS0或 VP2 -&gt;LVDS0,VP2-&gt;LVDS0 | 每个屏幕为1280x800 | 一个VP接两个单通道LVDS屏，每个屏幕显示VP中的半边内容 | rk3567-evb2-1p4x-v1 |
| 5 | 2个屏幕 | LVDS0与LVDS1 | VP1 -&gt;LVDS0,VP1-&gt;LVDS1或 VP2 -&gt;LVDS0,VP2-&gt;LVDS1 | 每个屏幕为1280x800 | 一个VP接两个单通道LVDS屏，每个屏幕显示完全相同的内容(connectormirror) |  |

这5种场景的实际效果如下图所示：





## 5. 不同场景的 LVDS 配置示例

在本章节中，将介绍不同LVDS的配置示例。尽管LVDS的输出具有多种组合，但实际上只需考虑以下两点：

• 是否是双通道 LVDS，即 Dual LVDS。

• 实际的 LVDS 对应哪个 VP。

对于 Dual LVDS，需要启用两个 LVDS 节点，并在 LVDS0 节点中添加 dual-channe1属性，以表明使用的是 Dual LVDS。

```dts
&lvds0 {
status = "okay";
dual-channel;
};
```

此外，需要确认 LVDS 对应的是哪个 VP。对于 Dual LVDS，LVDS0 与 LVDS1 均使用 VP1 或者均使用VP2作为输出。其余情况则视具体场景进行配置：

```c
/*
* 例1： 两个 VP 分别接一个单通道 LVDS 屏
* VP1 -> LVDS0, VP2 -> LVDS1
*/
&lvds0_in_vp1 {
status = "okay";
};
&lvds1_in_vp2 {
status = "okay";
};
/*
* 例2： 两个 VP 分别接一个单通道 LVDS 屏（顺序相反）
* VP2 -> LVDS0, VP1 -> LVDS1
```



\*/   

```dts
&lvds0_in_vp2 {
status = "okay";
};
&lvds1_in_vp1 {
status = "okay";
};
```

### 5.1 单通道 LVDS 配置

在配置单通道LVDS时，需要确认以下参数：

• 屏幕的时序、输出格式、相应的Enable引脚以及PWM背光引脚

• 从 LVDS0 还是 LVDS1 上输出

• 从 VP1 还是 VP2 输出到 LVDS

对于单通道LVDS，在RK356X上，LVDS 与VP具有4种分配关系，如下图所示：

下面以 VP1输出LVDS0为例，简要介绍DTS 的配置过程：

1. 设置 panel节点，配置屏幕时序、输出格式、Enable及背光引脚，并将 panel与LVDS 节点关联起来：

```dts
panel {
compatible = "simple-panel";
backlight = <&backlight>;
power-supply = <&vcc3v3_1cd0_n>;
enable-delay-ms = <20>;
prepare-delay-ms = <20>;
unprepare-delay-ms = <20>;
disable-delay-ms = <20>;
bus-format = <MEDIA BUS FMT RGB666 1X7X3 SPWG>;
width-mm = <217>;
height-mm = <136>;
display-timings {
native-mode = <&timing0>;
timing0: timing0 {
clock-frequency = <67000000>;
hactive = <800>;
vactive = <1280>;
hback-porch = <60>;
hfront-porch = <60>;
vback-porch = <4>;
vfront-porch = <2>;
hsync-len = <8>;
vsync-len = <8>;
hsync-active = <0>;
vsync-active = <0>;
de-active = <0>;
pixelclk-active = <0>;
};
};
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
reg = <0>;
panel_in_lvds0: endpoint {
remote-endpoint = <&lvds0 out panel>;
};
};
};
};
```

2. 启用对应的 LVDS 节点，并与 panel 节点关联起来：

```javascript
&lvds0 {
status = "okay";
ports {
port@1 {
reg = <1>;
lvds0_out_panel: endpoint {
remote-endpoint = <&panel in lvds0>;
};
};
};
};
```

3. 指定 LVDS 在哪一个 VP 上进行输出：

```hcl
&lvds0_in_vp1 {
status = "okay";
}i
```

### 5.2 Dual LVDS (双通道 LVDS) 配置

本小节的配置适用于RK356X。

1. 在 LVDS0 节点 1vds 中添加 dual-channe1 属性，以表明使用的是 Dual LVDS。

```dts
&lvds0 {
status = "okay";
dual-channel;
ports {
port@1 {
reg = <1>;
lvds0 out panel: endpoint {
remote-endpoint = <&panel in lvds0>;
};
}i
};
}i
```

2. 指定 Video Port 的分配方式，对于 RK356X 上的 Dual LVDS，可以选择均在 VP1 或者 VP2 上进行输出。下图展示了所有可能的分配方式。

1.   

Video Port 1 LVDS0   

LVDS1

2.  



下面的例子展示了均使用VP1进行输出，即图中的方式1：

```dts
&lvds0_in_vp1 {
status = "okay";
};
&lvds1_in_vp1 {
status = "okay";
}i
&lvds1_in_vp2 {
status = "disabled";
}i
```

3. 指定 LVDS 通道的输出顺序：

```
panel {
```

/\* ..． 相关屏幕参数在这里填入   

\*1   

```
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
reg = <0>;
dual-lvds-odd-pixels; /*输出奇像素*/

panel_in_lvds0: endpoint {
remote-endpoint = <&lvds0 out panel>;
};
};
port@1 {
reg = <1>;
dual-lvds-even-pixels; /* 输出偶像素 */
panel_in_lvds1: endpoint {
remote-endpoint = <&lvds1 out panel>;
};
}i
};
};
```

在这个示例中，LVDS0 输出 dual-1vds-odd-pixels，即奇像素；LVDS1 输出 dual-1vds-even-pixels，即偶像素。实际中可以按需调换二者的顺序。

### 5.3 适用于 RK3288 的 Dual LVDS (双通道 LVDS) 配置

本小节适用于RK3288。

1. 在 LVDS 节点 1vds中添加 dual-channe1 属性，以表明使用的是 Dual LVDS。

```twig
&lvds {
status = "okay";
dual-channel;
ports {
port@1 {
reg = <1>;
lvds0 out panel: endpoint {
remote-endpoint = <&panel in lvds0>;
}i
};
};
}i
```

2. 指定 LVDS 在哪个 VOP 上进行输出，可以是 vopb 或者 vopl 。

```proto
/* 在 vopb 上输出 */
&lvds in vopb {
status = "okay";
};
/* 或者，在 vop1 上输出 */
&lvds_in_vopl {
status = "okay";
}
```

3. 指定 LVDS 通道的输出顺序。对于 RK3288，可以在 1vds 节点中添加 rockchip, data-swap属性，以交换输出顺序：



```dts
&lvds {
rockchip,data-swap;
}i
```

### 5.4 两个 VP 分别接一个独立的单通道 LVDS 屏幕配置

在这种情况下，只需按照单通道LVDS的配置，分别配置每一个单通道的LVDS即可。

对于这种情况，不要设置dual-channe1属性，否则将被识别为DualLVDS

在实际使用中，需要指定好VideoPort的分配方式。一共有2种可能的分配方式，如下图所示：

1.

Video Port 1

Video Port 2

LVDS1

2.

下面的DTS示例分别对应图中的方式1与方式：

/\*   

\* VP1 -&gt; LVDS0, VP2 -&gt; LVDS1   

\*/   

```dts
&lvds0_in_vp1 {
status = "okay";
};
&lvds1_in_vp2 {
status = "okay";
};
```

/\*   

\* 或者， VP2 -&gt; LVDS0, VP1 -&gt; LVDS1   

\*/   

```dts
&lvds0_in_vp2 {
status = "okay";
};
&lvds1_in_vp1 {
status = "okay";
};
```

### 5.5 一个 VP 接两个单通道 LVDS 屏配置

在这种场景下，一个VP接两个单通道LVDS屏，每个屏幕显示VP中的半边内容。

值得注意的是，在这种情况下，目前将其实现为Dual LVDS的扩展。因此其配置方式与Dual LVDS类似：

1. 在 LVDS0 节点 1vds 中添加 dual-channel 属性。

```dts
&lvds0 {
status = "okay";
dual-channel;
ports {
port@1 {
reg = <1>;
lvds0 out panel: endpoint {
remote-endpoint = <&panel in lvds0>;
};
}i
};
};
```

2. 指定 Video Port的分配方式。对于 RK356X上一个 VP 接两个单通道LVDS 屏的场景，可以选择均在VP1或者VP2上进行输出。其可能的分配方式如下图所示。

1.   

Video Port 1 LVDS0   

LVDS1

2.  



下面的例子展示了均使用VP1进行输出，即图中的方式1：

```dts
&lvds0_in_vp1 {
status = "okay";
};
&lvds1_in_vp1 {
status = "okay";
}i
&lvds1_in_vp2 {
status = "disabled";
}i
```

3. 指定 LVDS 通道的输出顺序：

```
panel {
```

/\*..．相关屏幕参数在这里填入   

\*/   

```
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
reg = <0>;
```

dual-lvds-left-pixels； /\*输出左半边内容\*/

```
panel_in_lvds0: endpoint {
remote-endpoint = <&lvds0_out_panel>;
};
}i
port@1 {
reg = <1>;
dual-lvds-right-pixels; /*输出右半边内容 */
panel in lvds1: endpoint {
remote-endpoint = <&lvds1_out_panel>;
};
};
};
};
```

在当前的实现中，我们额外定义了dual-lvds-left-pixels和dual-lvds-right-pixels属性用以区分输出顺序。在实际使用中可以按需更改。

### 5.6 一个 VP 接两个单通道 LVDS 屏配置 (Connector Mirror)

在这种场景下，一个VP接两个单通道LVDS屏，每个屏幕的时序参数相同，并显示完全相同的内容。  

对于每个屏幕时序的配置，可以参照单通道LVDS进行配置。

在 Video Port 与 LVDS 的分配方式上，可以指定均从 VP1 或均从 VP2 进行输出：



2.  



```hcl
/* 均使用 VP1 进行输出 */
&lvds0_in_vp1 {
status = "okay";
};
&lvds1 in vp1 {
status = "okay";
};
/* 或者，均使用 VP2 进行输出 */
&lvds0_in_vp2 {
status = "okay";
};
&lvds1_in_vp2 {
status = "okay";
};
```

## 6. LVDS 调试方法

借助 VOP 的 summary 节点，可以查看当前的 LVDS Connector 信息：

cat /sys/kernel/debug/dri/0/summary

当启用了 Dual LVDS，且驱动已经成功加载时，将显示名为LVDS-DUAL的 Connector 节点：

root@rk3568-buildroot:/sys/kernel/debug/dri/0# cat summary   

Video Port0: DISABLED   

Video Port1: \_ACTIVE   

Connecto: LVDS-DUAL   

bus\_format[1010]: RGB666\_1X7X3\_SPWG   

overlay\_mode[0] output\_mode[0] color\_space[0], eotf:0   

Display mode: 1920x1080p67   

clk[148500] real\_clk[148500] type[48] flag[a]   

H: 1920 1980 1988 2048   

V: 1080 1082 1084 1088   

Smart1-win0: ACTIVE   

win\_id: 1   

format: XR24 little-endian (0x34325258) SDR[0] color\_space[0] glb\_alpha[0xff]   

rotate: xmirror: 0 ymirror: 0 rotate\_90: 0 rotate\_270: 0   

csc: y2r[0] r2y[0] csc mode[0]   

zpos: 1   

src: pos[0, 0] rect[1920 x 1080]   

dst: pos[0, 0] rect[1920 x 1080]   

buf[0]: addr: 0x000000007ef8a000 pitch: 7680 offset: 0   

Video Port2: DISABLED

注意，对于一个VP接两个单通道LVDS屏，每个屏幕显示VP中的半边内容的场景，同样将显示为LVDS-DUAL。

当使用了两个单通道的 LVDS 屏幕时，可以看到不同的 LVDS Connector 节点：



此时，LVDS Connector 分配到哪个 VP 下取决于具体的配置。

## 7. 常见问题

### 7.1 LVDS1 通道无输出

首先检查 VOP summary的输出信息，确保LVDS1 已正确启用。若仍然无输出，尝试更新Loader。

### 7.2 使用 Dual LVDS 输出的内容模糊/有锯齿感

可能是 LVDS0 和 LVDS1 输出接反了，可以尝试在 DTS 配置中调换 dual-1vds-odd-pixels和 dual-lvds-even-pixels属性的位置。

### 7.3 屏幕黑屏/白屏

检查硬件连接，检查背光引脚和Enable引脚的输出是否正确。

### 7.4 修改 LVDS 共模/差模电压

对于 RK356X，修改 PHY 对应的 DTS 属性：

其中， inno,lvds-vcom 为共模电压， inno,lvds-vod为差模电压。

RK356X的共模电压一共有如下几种：

RK356X的差模电压一共有如下几种：

• 350 mV （默认值）

```javascript
&video_phy0 {
inno,1vds-vcom = <1000>; /* 1000mV */
inno,lvds-vod = <400>; /* 400mV */
};
```
