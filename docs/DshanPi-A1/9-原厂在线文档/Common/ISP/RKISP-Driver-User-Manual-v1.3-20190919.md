---
sidebar_position: 1
---

# RKISP\_Driver\_User\_Manual

### 版 本 历 史

### 1.1 适用平台及系统


| 芯片平台 | 软件系统 | 支持情况 |
| --- | --- | --- |
| RK3399/RK3288/RK3368/RK3326/RK3399Pro | Linux(Kernel-4.4)Android-9.0 | Y |
| RK3399/RK3288/RK3326/RK1808 | Linux(Kernel-4.4) | Y |
| RV1108 | Linux (Kernel-3.10) | N |

### 1.2 适用驱动版本


| 驱动类型 | 版本号 |
| --- | --- |
| rkisp driver | v0.1.2 |
| RK1608 AP driver | v0.1.1 |
|  |  |

## 2 Camera 软件驱动目录说明

Linux Kernel-4.4：|

$$

```
\mathrm { | -- \ a r c h / a r m 6 4 / b o o t / d t s / r o c k c h i p }
```

$$

$$

```
\mathrm { | -- \ d r i v e r s / p h y / r o c k c h i p / }
```

$$

$$

```
\mathrm { \ l \mathrm { -- \ p h y - r o c k c h i p { \mathrm { - } } m i p i - r x . \mathrm { c } } }
```

$$

$$

\scriptstyle \left| \mathrm &#123; -- &#125; \mathrm &#123; \ d r i v e r s / m e d i a &#125; \right|

$$

|-- platform/rockchip/isp1

$$

```
\mathrm { ~ \ -- ~ \ c a p t u r e . ~ c ~ }
```

$$

$$

```
| \mathrm { ~ -- ~ } \mathrm { d e v . ~ c ~ }
```

$$

$$

```
| \mathrm { -- } \mathrm { i s p _ p a r a m s . } \mathrm { c }
```

$$

$$

```
| \mathrm { -- } \mathrm { i } \mathrm { s p } _ \mathrm { s t a t s . } \mathrm { c }
```

$$

$$

```
\mathrm { ~ \ -- ~ } \mathrm { r e g s . ~ c }
```

$$

$$

```
| \mathrm { -- } \ \mathrm { r k i s p 1 . \mathrm { c } }
```

$$

$$

| \mathrm &#123; ~ -- ~ i 2 c &#125; /

$$

$$

```
\mathrm { ~ \ K ~ -- ~ \ o v 1 3 8 5 0 . ~ c ~ }
```

$$

$$

```
\mathrm { ~ \ -- ~ } \mathrm { v m } 1 4 9 \mathrm { c . ~ c }
```

$$

$$

```
| \mathrm { -- \ s p i / }
```

$$

$$

```
\mathrm { ~ \ -- ~ } \mathrm { r k } 1 6 0 8 . \mathrm { ~ c ~ }
```

$$

$$

```
\mathrm { | -- \ r k l 6 0 8 _ d e v . c }
```

$$

$$

```
| \mathrm { ~ -- ~ r k 1 6 0 8 ~ _ d p h y . ~ c ~ }
```

$$

DTS 配置文件

mipi dphy 驱动

$$

\mathrm &#123; r k i s p 1 i s p \ 4 &#125; | \vec &#123; \Sigma &#125; \vec &#123; \Sigma &#125; \rangle ]

$$

包含 mp/sp 的配置及 vb2，帧中断处理

包含 probe、异步注册、clock、pipeline、

iommu 及 media/v4l2 framework

3A 相关参数设置

3A 相关统计

寄存器相关的读写操作

对应 isp\_sd entity 节点，

包含从 mipi 接收数据，并有 crop功能

CIS(cmos image sensor)驱动

VCM driver ic 驱动

rk1608 ap driver 驱动

注册 rk1608 spi 设备

注册/dev/rk\_preisp misc 设备

注册 v4l2 media 节点，与 rk1608 和 AP 端交互

## 3 rkisp1 isp 驱动

### 3.1 框架简要说明

下面的框图描述了 RKISP1驱动的拓扑结构。




| 名称 | 类型 | 描述 |
| --- | --- | --- |
| rkispl_mainpath | v412_vdev,capture | Format: YUV, RAW Bayer; Support: Crop |
| rkispl_selfpath | v412_vdev,capture | Format: YUV, RGB; Support: Crop |
| rkispl-isp-subdeV | v412_subdev | Internal isp blocks; Support: source/sink padcrop.The format on sink pad should be equal to sensorinput format, the size should be equal/less thansensor input size. |
|  |  | The format on source pad should be equal to vdevoutput format if output format is raw bayer,otherwise it should be YUYV2X8. The size should beequal/less than sink pad size. |
| rockchip-sy-mipi-dphy | v412_subdev | MIPI-DPHY Configure. |
| rkispl-statisticS | v412_vdev,capture | Provide Image color Statistics information. |
| rkispl-input-params | v412_vdev,output | Accept params for AWB, BLC...... Image enhancementblocks. |

## 4 CIS(cmos image sensor)驱动

### 4.1 驱动版本号获取方式

·从 kernel 启动 log 中获取

rkisp1 ff910000.rkisp1: rkisp1 driver version: v00.01.02

·由以下命令获取

cat /sys/module/video_rkisp1/parameters/version

### 4.2 CIS 设备注册(DTS)

Rkisp1 的 DTS 节 点 在 kernel 源 码 中 有 文 档 说 明 ， 路 径 如 下 ：

Documentation/devicetree/bindings/media/rockchip-isp1.txt。

mipi dphy驱动节点kernel源码中有文档说明，路径如下：

Documentation/devicetree/bindings/media/rockchip-mipi-dphy.txt

### 4.2.1MIPI CIS 注册

下面以 rk3399 isp0 和 ov13850 为例进行说明。

```
ov13850: ov13850@10 {
```

```javascript
compatible = "ovti,ov13850"; // 需要与驱动中的匹配字符串一致
```

```hcl
status = "okay";
```

```
reg = <0x10>; // sensor I2C 设备地址

clocks = <&cru SCLK_CIF_OUT>; // sensor clickin 配置

clock-names = "xvclk";

reset-gpios = <&gpio2 10 GPIO_ACTIVE_HIGH>;

// reset管脚分配及有效电平
```

```hcl
pwdn-gpios = <&gpio1 4 GPIO_ACTIVE_HIGH>;
```

```dts
// power管脚分配及有效电平
pinctrl-names = "rockchip,camera_default";
pinctrl-0 = <&cif_clkout>; // pinctl 设置
rockchip,camera-module-index = <0>; // 模组编号，该编号不要重复
rockchip,camera-module-facing = "back"; // 模组朝向，有"back"和"front"
rockchip,camera-module-name = "CMK-CT0116"; // 模组名
rockchip,camera-module-lens-name = "Largan-50013A1"; // lens 名
// 模组名和 lens名被用来和IQ xml 文件做匹配
lens-focus = <&vm149c>; // vcm 驱动设置，支持 AF 时需要有这个设置
port {
ucam_out0: endpoint {
remote-endpoint = <&mipi_in_ucam0>;
// mipi dphy 端的 port 名
data-lanes = <1 2>;
// mipi lane 数，1lane 为 <1>, 4lane 为 <1 2 3 4>
};
};
};
&mipi_dphy_rx0 {
status = "okay";
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
reg = <0>;
#address-cells = <1>;

#size-cells = <0>;
mipi_in_ucam0: endpoint@1 {
reg = <1>;
remote-endpoint = <&ucam_out0>;
// sensor 端的 port 名
data-lanes = <1 2>;
// mipi lane 数，1lane 为 <1>, 4lane 为 <1
};
};
port@1 {
reg = <1>;
#address-cells = <1>;
#size-cells = <0>;
dphy_rx0_out: endpoint@0 {
reg = <0>;
remote-endpoint = <&isp0_mipi_in>;
// isp 端的 port 名
};
};
};
};
&rkisp1_0 {
status = "okay";
port {
#address-cells = <1>;
#size-cells = <0>;

isp0_mipi_in: endpoint@0 {
reg = <0>;
remote-endpoint = <&dphy_rx0_out>;
// mipi dphy 端的 port 名
};
};
};
&isp0_mmu {
status = "okay"; // isp 驱动使用了 iommu，所以 isp iommu 也需要打开
};
```

#### 4.2.2 DVP CIS 注册

以 rk3326 isp 和 gc0312/gc2145 为例进行说明。

```dts
&i2c2 {
status = "okay";
gc0312@21 {
status = "okay";
compatible = "galaxycore,gc0312"; // 需要与驱动中的匹配字符串一致
reg = <0x21>; // sensor I2C 设备地址
pinctrl-names = "default";
pinctrl-0 = <&cif_clkout_m0>; // pinctl 设置
clocks = <&cru SCLK_CIF_OUT>; // sensor clickin 配置
clock-names = "xvclk";
avdd-supply = <&vcc2v8_dvp>; // sensor 电源配置
dovdd-supply = <&vcc1v8_dvp>;
dvdd-supply = <&vcc1v8_dvp>;
```

```proto
pwdn-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;
// power管脚分配及有效电平
rockchip,camera-module-index = <1>; // 模组编号，该编号不要重复
rockchip,camera-module-facing = "front"; // 模组朝向，有"back"和"front"
rockchip,camera-module-name = "CameraKing"; // 模组名
rockchip,camera-module-lens-name = "Largan"; // lens 名
port {
gc0312_out: endpoint {
remote-endpoint = <&dvp_in_fcam>;// isp 端的 port 名
};
};
};
gc2145@3c {
status = "okay";
compatible = "galaxycore,gc2145"; // 需要与驱动中的匹配字符串一致
reg = <0x3c>; // sensor I2C 设备地址
pinctrl-names = "default";
pinctrl-0 = <&cif_clkout_m0>; // pinctl 设置
clocks = <&cru SCLK_CIF_OUT>; // sensor clickin 配置
clock-names = "xvclk";
avdd-supply = <&vcc2v8_dvp>; // sensor 电源配置
dovdd-supply = <&vcc1v8_dvp>;
dvdd-supply = <&vcc1v8_dvp>;
pwdn-gpios = <&gpio2 13 GPIO_ACTIVE_HIGH>;
// power 管脚分配及有效电平
rockchip,camera-module-index = <0>; // 模组编号，该编号不要重复
```

rockchip,camera-module-facing = "back"; // 模组朝向，有"back"和"front"   

rockchip,camera-module-name = "CameraKing"; // 模组名   

rockchip,camera-module-lens-name = "Largan"; // lens 名   

```dts
port {
gc2145_out: endpoint {
remote-endpoint = <&dvp_in_bcam>;// isp 端的 port 名
};
};
};
};
&isp_mmu {
status = "okay";
};
&rkisp1 {
status = "okay";
pinctrl-names = "default";
pinctrl-0 = <&cif_clkout_m0 &dvp_d0d1_m0 &dvp_d2d9_m0 &dvp_d10d11_m0>;
// pinctl 设置，增加 dvp pin 脚相关配置
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
reg = <0>;
#address-cells = <1>;
#size-cells = <0>;
dvp_in_fcam: endpoint@0 {

reg = <0>;
remote-endpoint = <&gc0312_out>; // sensor 端的 port 名
};
dvp_in_bcam: endpoint@1 {
reg = <1>;
remote-endpoint = <&gc2145_out>; // sensor 端的 port 名
};
};
};
};
```

### 4.3 CIS 驱动说明

### 4.3.1数据类型简要说明

##### 4.3.1.1 struct i2c\_driver

[说明]   

定义i2c 设备驱动信息   

[定义]   

```c
struct i2c_driver {
```

/\* Standard driver model interfaces \*/   

```c
int (*probe)(struct i2c_client *, const struct i2c_device_id *);
int (*remove)(struct i2c_client *);

struct device_driver driver;

const struct i2c_device_id *id_table;

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| @driver | Device driver model driver主要包含驱动名称和与 DTS 注册设备进行匹配的 of_match_table。当of_match_table 中的 compatible 域和 dts 文件的 compatible 域匹配时，.probe函数才会被调用 |
| @id_table | List of I2C devices supported by this driver如果kernel没有使用of_match_table和dts注册设备进行进行匹配，则 kernel 使用该 table 进行匹配 |
| @probe | Callback for device binding |
| @remove | Callback for device unbinding |

```c
[示例]
#if IS_ENABLED(CONFIG_OF)
static const struct of_device_id ov13850_of_match[] = {
{ .compatible = "ovti,ov13850" },
{},
};
MODULE_DEVICE_TABLE(of, ov13850_of_match);
#endif
```

```c
static const struct i2c_device_id ov13850_match_id[] = {
{ "ovti,ov13850", 0 },
{ },
};
static struct i2c_driver ov13850_i2c_driver = {
.driver = {
.name = "ov13850",
.pm = &ov13850_pm_ops,
.of_match_table = of_match_ptr(ov13850_of_match),
},
.probe = &ov13850_probe,
.remove = &ov13850_remove,
.id_table = ov13850_match_id,
};
static int __init sensor_mod_init(void)
{
return i2c_add_driver(&ov13850_i2c_driver);
}
static void __exit sensor_mod_exit(void)
{
i2c_del_driver(&ov13850_i2c_driver);
}
```

device\_initcall\_sync(sensor\_mod\_init);

module\_exit(sensor\_mod\_exit);

##### 4.3.1.2 struct v4l2\_subdev\_ops

[说明]

Define ops callbacks for subdevs.

[定义]

```c
struct v4l2_subdev_ops {

const struct v4l2_subdev_core_ops *core;

const struct v4l2_subdev_video_ops *video;

const struct v4l2_subdev_pad_ops *pad;

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .core | Define core ops callbacks for subdevs |
| .video | Callbacks used when v41 device was opened in video mode. |
| .pad | v412-subdev pad level operations |

[示例]

```c
static const struct v4l2_subdev_ops ov5695_subdev_ops = {

.core = &ov5695_core_ops,

.video = &ov5695_video_ops,

.pad = &ov5695_pad_ops,

};
```

##### 4.3.1.3 struct v4l2\_subdev\_core\_ops

[说明]

Define core ops callbacks for subdevs.

[定义]

```c
struct v4l2_subdev_core_ops {

long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);

#ifdef CONFIG_COMPAT

long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,

unsigned long arg);

#endif

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .ioctl | called at the end of ioctl() syscall handler at the V4L2core.used to provide support for private ioctls used on thedriver. |
| .compat_ioct132 | called when a 32 bits application uses a 64 bits Kernel, inorder to fix data passed from/to userspace.in order to fixdata passed from/to userspace. |

[示例]

```c
static const struct v4l2_subdev_core_ops ov13850_core_ops = {

.ioctl = ov13850_ioctl,

#ifdef CONFIG_COMPAT

.compat_ioctl32 = ov13850_compat_ioctl32,

#endif

};
```

目前使用了如下的私有 ioctl实现模组信息的查询和 OTP信息的查询设置。


| 私有ioctl | 描述 |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | 获取模组信息，详细参考struct rkmodule_inf; |
| RKMODULE AWB CFG | 开关 sensor 对 awb 的补偿功能;若模组没有烧录 golden awb 值，可以在此设置；详细参考struct rkmodule awb cfg; |
| RKMODULE_LSC_CFG | 开关 sensor 对 1sc 的补偿功能;详细参考struct rkmodule 1sc cfg; |

##### 4.3.1.4 struct v4l2\_subdev\_video\_ops

[说明]

Callbacks used when v4l device was opened in video mode.

[定义]

```c
struct v4l2_subdev_video_ops {

int (*s_stream)(struct v4l2_subdev *sd, int enable);

int (*g_frame_interval)(struct v4l2_subdev *sd,

struct v4l2_subdev_frame_interval *interval);

int (*s_frame_interval)(struct v4l2_subdev *sd,

struct v4l2_subdev_frame_interval *interval);

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .g_frame_interval | cal1back for VIDIOC SUBDEV G FRAME INTERVAL ioct1 handlercode |
| .s_stream | used to notify the driver that a video stream will start orhas stopped |

[示例]

```c
static const struct v4l2_subdev_video_ops ov13850_video_ops = {

.s_stream = ov13850_s_stream,

.g_frame_interval = ov13850_g_frame_interval,

};
```

##### 4.3.1.5 struct v4l2\_subdev\_pad\_ops

[说明]

v4l2-subdev pad level operations

[定义]

```c
struct v4l2_subdev_pad_ops {

int (*enum_mbus_code)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_mbus_code_enum *code);

int (*enum_frame_size)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_frame_size_enum *fse);

int (*get_fmt)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_format *format);

int (*set_fmt)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_format *format);

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| . enum_mbus_code | cal1back for VIDIOC_SUBDEV_ENUM_MBUS_CODE ioct1 handlercode. |
| . enum_frame_size | cal1back for VIDIOC SUBDEV ENUM FRAME SIZE ioct1 handlercode. |
| .s_fmt | cal1back for VIDIOC_SUBDEV_S_FMT ioct1 handler code. |
| ·g_fmt | cal1back for VIDIOC_SUBDEV_G_FMT ioct1 handler code |

[示例]

```c
static const struct v4l2_subdev_pad_ops ov13850_pad_ops = {

.enum_mbus_code = ov13850_enum_mbus_code,

.enum_frame_size = ov13850_enum_frame_sizes,

.get_fmt = ov13850_get_fmt,

.set_fmt = ov13850_set_fmt,

};
```

##### 4.3.1.6 struct v4l2\_ctrl\_ops

[说明]

The control operations that the driver has to provide.

[定义]

```c
struct v4l2_ctrl_ops {

int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);

int (*try_ctrl)(struct v4l2_ctrl *ctrl);

int (*s_ctrl)(struct v4l2_ctrl *ctrl);

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .g_volatile_ctrl | get a new value for this control, generally only relevantfor volatile (and usually read-only) controls . |
| .try_ctrl | test whether the control&#x27;s value is valid. |
| .s_ctrl | actually set the new control value. |

[示例]

```c
static const struct v4l2_ctrl_ops ov13850_ctrl_ops = {
```

```python
.s_ctrl = ov13850_set_ctrl,
```

```
};
```

Rkisp 驱动要求使用框架提供的 user controls 功能， cameras sensor 驱动必须实现如下

control 功能，参考 CIS 驱动 V4L2-controls 列表 1

##### 4.3.1.7 struct xxxx\_mode

[说明]

Sensor能支持各个模式的信息。

这个结构体在sensor 驱动中常常可以见到，虽然它不是 v4l2标准要求的。

```c
[定义]
struct xxxx_mode {
u32 width;
u32 height;
struct v4l2_fract max_fps;
u32 hts_def;
u32 vts_def;
u32 exp_def;
const struct regval *reg_list;
```

```
};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .width | 有效图像宽度 |
| .height | 有效图像高度 |
| .max_fps | 图像 FPS，denominator/numerator 为 fps |
| hts_def | 默认 HTS，为有效图像宽度 + HBLANK |
| vts_def | 默认 VTS，为有效图像高度 + VBLANK |
| exp_def | 默认曝光时间 |
| *reg_list | 寄存器列表 |

[示例]

```c
static const struct ov13850_mode supported_modes[] = {
{
.width = 2112,
.height = 1568,
.max_fps = {
.numerator = 10000,
```

```javascript
.denominator = 300000,
},
.exp_def = 0x0600,
.hts_def = 0x12c0,
.vts_def = 0x0680,
.reg_list = ov13850_2112x1568_regs,
},{
.width = 4224,
.height = 3136,
.max_fps = {
.numerator = 20000,
.denominator = 150000,
},
.exp_def = 0x0600,
.hts_def = 0x12c0,
.vts_def = 0x0d00,
.reg_list = ov13850_4224x3136_regs,
},
};
```

##### 4.3.1.8 struct v4l2\_mbus\_framefmt

[说明]   

frame format on the media bus   

[定义]   

```c
struct v4l2_mbus_framefmt {
__u32 width;

_u32 height;

__u32 code;

_u32 field;

__u32 colorspace;

__u16 ycbcr_enc;

_u16 quantization;

__u16 xfer_func;

_u16 reserved[11];

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| width | Frame width |
| height | Frame height |
| code | 参考 MEDIA BUS FMT 表 |
| field | V4L2_FIELD_NONE：帧输出方式V4L2_FIELD_INTERLACED：场输出方式 |

[示例]

##### 4.3.1.9 struct rkmodule\_base\_inf

[说明]

模组基本信息，上层用此信息和 IQ进行匹配

[定义]

```c
struct rkmodule_base_inf {

char sensor[RKMODULE_NAME_LEN];

char module[RKMODULE_NAME_LEN];

char lens[RKMODULE_NAME_LEN];

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| sensor | sensor 名，从 sensor 驱动中获取 |
| module | 模组名，从DTS配置中获取，以模组资料为准 |
| lens | 镜头名，从DTS配置中获取，以模组资料为准 |

[示例]

##### 4.3.1.10 struct rkmodule\_fac\_inf

[说明]

模组OTP 工厂信息

[定义]

```c
struct rkmodule_fac_inf {

__u32 flag;

char module[RKMODULE_NAME_LEN];

char lens[RKMODULE_NAME_LEN];

__u32 year;

__u32 month;

__u32 day;

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| flag | 该组信息是否有效的标识 |
| module | 模组名，从OTP中获取编号，由编号得到模组名 |
| lens | 镜头名，从OTP中获取编号，由编号得到镜头名 |
| year | 生产年份，如12代表2012年 |
| month | 生产月份 |
| day | 生产日期 |

[示例]

##### 4.3.1.11 struct rkmodule\_awb\_inf

[说明]

模组 OTP awb 测定信息

[定义]

```c
struct rkmodule_awb_inf {

_u32 flag;

__u32 r_value;

_u32 b_value;

__u32 gr_value;

__u32 gb_value;

_u32 golden_r_value;

_u32 golden_b_value;

__u32 golden_gr_value;

_u32 golden_gb_value;

} __attribute__ ((packed));
```

### [关键成员]


| 成员名称 | 描述 |
| --- | --- |
| flag | 该组信息是否有效的标识 |
| r_value | 当前模组的 AWB R 测定信息 |
| b_value | 当前模组的 AWB B测定信息 |
| gr_value | 当前模组的 AWB GR 测定信息 |
| gb_value | 当前模组的 AWB GB 测定信息 |
| golden_r_value | 典型模组的AWB R测定信息，如没有烧录，设为0 |
| golden_b_value | 典型模组的AWB B测定信息，如没有烧录，设为0 |
| golden_gr_value | 典型模组的AWB GR测定信息，如没有烧录，设为0 |
| golden_gb_value | 典型模组的AWB GB测定信息，如没有烧录，设为0 |

[示例]

##### 4.3.1.12 struct rkmodule\_lsc\_inf

[说明]

模组 OTP lsc 测定信息

[定义]

```c
struct rkmodule_lsc_inf {

_u32 flag;

__u16 lsc_w;

__u16 lsc_h;

_u16 decimal_bits;

__u16 lsc_r[RKMODULE_LSCDATA_LEN];

__u16 lsc_b[RKMODULE_LSCDATA_LEN];

__u16 lsc_gr[RKMODULE_LSCDATA_LEN];

u16 lsc_gb[RKMODULE_LSCDATA_LEN];

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| flag | 该组信息是否有效的标识 |
| 1sc_w | 1sc 表实际宽度 |
| 1sc_h | 1sc 表实际高度 |
| decimal_bits | 1sc测定信息的小数位数，无法获取的话，设为0 |
| 1sc_r | 1sc r测定信息 |
| 1sc_b | 1sc b 测定信息 |
| 1sc_gr | 1sc gr 测定信息 |
| 1sc_gb | 1sc gb 测定信息 |

[示例]

##### 4.3.1.13 struct rkmodule\_af\_inf

[说明]

模组 OTP af 测定信息

[定义]

```c
struct rkmodule_af_inf {

_u32 flag; // 该组信息是否有效的标识

_u32 vcm_start; // vcm 启动电流

_u32 vcm_end; // vcm 终止电流

_u32 vcm_dir; // vcm 测定方向

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| flag | 该组信息是否有效的标识 |
| vcm_start | vcm 启动电流 |
| vcm_end | vcm 终止电流 |
| vcm_dir | vcm 测定方向 |

[示例]

##### 4.3.1.14 struct rkmodule\_inf

[说明]

模组信息

[定义]

```c
struct rkmodule_inf {

struct rkmodule_base_inf base;

struct rkmodule_fac_inf fac;

struct rkmodule_awb_inf awb;

struct rkmodule_lsc_inf lsc;

struct rkmodule_af_inf af;

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| base | 模组基本信息 |
| fac | 模组 OTP 工厂信息 |
| awb | 模组 OTP awb 测定信息 |
| 1sc | 模组 OTP 1sc 测定信息 |
| af | 模组 OTP af 测定信息 |

[示例]

##### 4.3.1.15 struct rkmodule\_awb\_cfg

[说明]

模组 OTP awb 配置信息

[定义]

```c
struct rkmodule_awb_cfg {

__u32 enable;

__u32 golden_r_value;

_u32 golden_b_value;

_u32 golden_gr_value;

_u32 golden_gb_value;

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| enable | 标识 awb 校正是否启用 |
| golden_r_value | 典型模组的 AWB R 测定信息 |
| golden_b_value | 典型模组的 AWB B 测定信息 |
| golden_gr_value | 典型模组的 AWB GR 测定信息 |
| golden_gb_value | 典型模组的 AWB GB 测定信息 |

[示例]

##### 4.3.1.16 struct rkmodule\_lsc\_cfg

[说明]

模组 OTP lsc 配置信息

[定义]

```c
struct rkmodule_lsc_cfg {

__u32 enable;

} __attribute__ ((packed));

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| enable | 标识 1sc 校正是否启用 |

[示例]

### 4.3.2API 简要说明

#### 4.3.2.1xxxx\_set\_fmt

[描述]

设置sensor输出格式。

[语法]

$$

```
\mathrm { s t a t i c ~ i n t ~ \ x x x x _ s e t ~ f m t ~ ( s t r u c t ~ v 4 l 2 ~ s u b d e v ~ * s d , }
```

$$

$$

```
\mathrm { s t r u c t ~ v 4 l 2 _ s u b d e v _ p a d _ c o n f i g ~ * c f g , }
```

$$

struct v4l2\_subdev\_format \*fmt)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *sd | v412 subdev 结构体指针 | 输入 |
| *cfg | subdev pad information 结构体指针 | 输入 |
| *fmt | Pad-level media bus format 结构体指针 | 输入 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 4.3.2.2xxxx\_get\_fmt

[描述]

获取 sensor 输出格式。

[语法]

static int xxxx\_get\_fmt(struct v4l2\_subdev \*sd,

struct v4l2\_subdev\_pad\_config \*cfg,

struct v4l2\_subdev\_format \*fmt)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *sd | v412 subdev 结构体指针 | 输入 |
| *cfg | subdev pad information 结构体指针 | 输入 |
| *fmt | Pad-level media bus format 结构体指针 | 输出 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

参考 MEDIA\_BUS\_FMT 表

#### 4.3.2.3xxxx\_enum\_mbus\_code

[描述]

枚举 sensor 输出 bus format。

[语法]

static int xxxx\_enum\_mbus\_code(struct v4l2\_subdev \*sd,

struct v4l2\_subdev\_pad\_config \*cfg,

struct v4l2\_subdev\_mbus\_code\_enum \*code)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *sd | v412 subdev 结构体指针 | 输入 |
| *cfg | subdev pad information 结构体指针 | 输入 |
| *code | media bus format enumeration 结构体指针 | 输出 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

下表总结了各种图像类型对应的 format，参考 MEDIA\_BUS\_FMT 表

#### 4.3.2.4xxxx\_enum\_frame\_sizes

[描述]

枚举sensor输出大小。

[语法]

static int xxxx\_enum\_frame\_sizes(struct v4l2\_subdev \*sd,

struct v4l2\_subdev\_pad\_config \*cfg,

struct v4l2\_subdev\_frame\_size\_enum \*fse)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *sd | v412 subdev 结构体指针 | 输入 |
| *cfg | subdev pad information 结构体指针 | 输入 |
| *fse | media bus frame size 结构体指针 | 输出 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 4.3.2.5xxxx\_g\_frame\_interval

[描述]

获取 sensor 输出 fps。

[语法]

static int xxxx\_g\_frame\_interval(struct v4l2\_subdev \*sd,

struct v4l2\_subdev\_frame\_interval \*fi)  

[参数]


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 4.3.2.6xxxx\_s\_stream

[描述]

设置stream输入输出。

[语法]

static int xxxx\_s\_stream(struct v4l2\_subdev \*sd, int on)

[参数]


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 4.3.2.7xxxx\_runtime\_resume

[描述]

sensor上电时的回调函数。

[语法]

static int xxxx\_runtime\_resume(struct device \*dev)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *dev | device 结构体指针 | 输入 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 4.3.2.8xxxx\_runtime\_suspend

[描述]

sensor下电时的回调函数。

[语法]

static int xxxx\_runtime\_suspend(struct device \*dev)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *dev | device 结构体指针 | 输入 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 4.3.2.9xxxx\_set\_ctrl

[描述]

设置各个 control 的值。

[语法]

static int xxxx\_set\_ctrl(struct v4l2\_ctrl \*ctrl)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *ctrl | v412_ctrl 结构体指针 | 输入 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

### 4.3.3驱动移植步骤

1. 实现标准I2C子设备驱动部分.

1.1 根据 struct i2c\_driver 说明实现以下成员:

struct driver.name

struct driver.pm

struct driver. of\_match\_table

probe 函数

remove 函数

1.2 probe 函数实现细节描述:

1). CIS 设备资源的获取,主要是解析 DTS 文件中定义资源, 参考 Camera 设备注册(DTS);

1.2) CIS设备资源定义,RK相关参考驱动一般包含以下几项:


| CIS 设备工作参考时钟 | 采用外部独立晶振方案无需获取,RK参考设计一般采用 AP输出时 |
| --- | --- |
|  | 钟，该方案需要获取，一般名称为xvclk |
| CIS 设备控制 GPIO | 例如：Resst 引脚,Powerdown引脚 |
| CIS 设备控制电源 | 根据实际硬件设计，获取匹配的软件电源控制资源，例如gpio,regulator |

1.4) CIS v4l2 设备以及 media 实体的初始化;

media 实体：media\_entity\_init

2. 参考 struct v4l2\_subdev\_ops 说明实现 v4l2 子设备驱动，主要实现以下 3 个成员：


| struct v412_subdev_core_ops |
| --- |
| struct v4I2_subdev_video_ops |
| struct v4l2_subdev_pad_ops |

2.1 参考 struct v4l2\_subdev\_core\_ops 说明实现其回调函数，主要实现以下回调：


| .ioctl |
| --- |
| .compat_ioctl32 |

该回调主要实现 RK私有控制命令，涉及：


| RKMODULE_GET_MODULE_INFO | DTS文件定义的模组信息(模组名称等)，通过该命令上传camera_engine |
| --- | --- |
| RKMODULE_AWB_CFG | 模组 OTP 信息使能情况下，camera_engine 通过该命令传递典型模组 AWB标定值，CIS驱动负责与当前模组AWB 标定值比较后，生成 R/B Gain 值设置到 CIS MWB模块中； |
| RKMODULE_LSC_CFG | 模组 OTP 信息使能情况下，camera_engine 通过该命 |
|  | 令控制LSC标定值生效使能； |
|  |  |

分实现按照 standard integer menu controls 方式实现；

参考 CIS 驱动 V4L2-controls 列表 1 实现各控制 ID，其中以下 ID 属于信息获取类，这部


| int (*s_stream)(struct v4I2_subdev *sd, int enable); |
| --- |
| int (*g_frame_interval)(struct v4l2_subdev *sd, |
|  |
| struct v4I2_subdev_frame_interval *interval); |


| .enum_mbus_code | 枚举当前 CIS 驱动支持数据格式 |
| --- | --- |
| .enum_frame_size | 枚举当前 CIS 驱动支持分辨率 |
| .get_fmt | Rkisp driver 通过该回调获取 CIS 输出的数据格式，务必实现；针对 Bayer raw sensor、SOC yuv sensor、BW raw sensor输出的数据类型定义参考MEDIA BUS FMT 表针对 field输出方式的支持，参考struct v412 mbus framefmt定义； |
| .set_fmt | 设置CIS驱动输出数据格式以及分辨率，务必实现 |

2.4 参考 struct v4l2\_ctrl\_ops 说明实现，主要实现以下回调


| .s_ctrl | Rkisp driver、camera_engine 通过设置不同的命令来实现 CIS |
| --- | --- |
|  | 曝光控制； |


| V4L2_CID_LINK_FREQ | 参考 CIS 驱动 V4L2-controls 列表 1中标准定义，目前 rkispdriver 根据该命令获取 MIPI 总线频率； |
| --- | --- |
| V4L2 CID PIXEL RATE | 针对 MIPI 总线：pixel_rate = link_freq * 2 * nr_of_lanes /bits_per_sample |
| V4L2_CID_HBLANK | 参考CIS 驱动 V4L2-controls 列表1中标准定义 |
| V4L2_CID_VBLANK | 参考CIS 驱动 V4L2-controls 列表 1中标准定义 |

RK camera\_engine会通过以上命令获取必要信息来计算曝光，其中涉及的公式如下：


| line_time = HTS * PIXEL_RATE; |
| --- |
| HTS = sensor_width_out + HBLANK; |
| VTS = sensor_height_out + VBLANK; |

其中以下 ID 属于控制类，RK camera\_engine 通过该类命令控制 CIS


| V4L2_CID_VBLANK | 调整VBLANK，进而调整 frame rate、Exposure time max; |
| --- | --- |
| V4L2_CID_EXPOSURE | 设置曝光时间，单位：曝光行数 |
| V4L2_CID_ANALOGUE_GAIN | 设置曝光增益，实际为 total gain = analog gain*digitalgain；单位：增益寄存器值 |
|  |  |

3. CIS 驱动不涉及硬件数据接口信息定义,CIS设备与AP的接口连接关系由DTS设备节点的Port 来体现其连接关系，参考 4.1 MIPI Sensor 注册与 4.2 DVP Sensor 注册中关于 Port 信息的描述。

4. CIS 参考驱动列表

## 5 VCM 驱动

### 5.1 VCM 设备注册(DTS)

RK VCM 驱动私有参数说明：


|  |  |
| --- | --- |
|  |  |
| 额定电流 | VCM刚好推动模组镜头至模组镜头可移动行程的最远端(模组近 焦)，此时 VCM driver ic 的输出电流值定义为额定电流 |
| VCM 电流输出模式 | VCM移动过程中会产生振荡，VCM driver ic 电流输出变化需要考虑 vcm的振荡周期，以便最大程度减小振荡，输出模式决定了输出电流改 变至目标值的时间； |

```javascript
vm149c: vm149c@0c { // vcm 驱动配置，支持 AF 时需要有这个设置
compatible = "silicon touch,vm149c";
status = "okay";
reg = <0x0c>;
rockchip,vcm-start-current = <0>; // 马达的启动电流
rockchip,vcm-rated-current = <100>; // 马达的额定电流
rockchip,vcm-step-mode = <4>; // 马达驱动 ic 的电流输出模式
rockchip,camera-module-index = <0>; // 模组编号
rockchip,camera-module-facing = "back"; // 模组朝向，有"back"和"front"
};
ov13850: ov13850@10 {
lens-focus = <&vm149c>; // vcm 驱动设置，支持 AF 时需要有这个设置
};
```

```c
[说明]
定义i2c 设备驱动信息
[定义]
struct i2c_driver {
/* Standard driver model interfaces */
int (*probe)(struct i2c_client *, const struct i2c_device_id *);
int (*remove)(struct i2c_client *);
struct device_driver driver;
const struct i2c_device_id *id_table;
};
```

### 5.2 VCM 驱动说明

### 5.2.1数据类型简要说明

##### 5.2.1.1 struct i2c\_driver

[关键成员]


| 成员名称 | 描述 |
| --- | --- |
| @driver | Device driver model driver主要包含驱动名称和与 DTS 注册设备进行匹配的 of_match_table。当of_match_table 中的 compatible 域和 dts 文件的 compatible 域匹配时，.probe函数才会被调用 |
| @id_table | List of I2C devices supported by this driver如果 kernel 没有使用of_match_table和dts注册设备进行进行匹配， |
|  |  |
|  |  |
|  |  |

```c
[示例]
static const struct i2c_device_id vm149c_id_table[] = {
{ VM149C_NAME, 0 },
{ { 0 } }
};
MODULE_DEVICE_TABLE(i2c, vm149c_id_table);
static const struct of_device_id vm149c_of_table[] = {
{ .compatible = "silicon touch,vm149c" },
{ { 0 } }
};
MODULE_DEVICE_TABLE(of, vm149c_of_table);
static const struct dev_pm_ops vm149c_pm_ops = {
SET_SYSTEM_SLEEP_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume)
SET_RUNTIME_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume, NULL)
};
static struct i2c_driver vm149c_i2c_driver = {
.driver = {
.name = VM149C_NAME,
.pm = &vm149c_pm_ops,
.of_match_table = vm149c_of_table,
},
.probe = &vm149c_probe,
```

.remove = &vm149c\_remove,   

.id\_table = vm149c\_id\_table,   

```
};
module_i2c_driver(vm149c_i2c_driver);
```

##### 5.2.1.2 struct v4l2\_subdev\_core\_ops

```c
[说明]
Define core ops callbacks for subdevs.
[定义]
struct v4l2_subdev_core_ops {
long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
#ifdef CONFIG_COMPAT
long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
unsigned long arg);
#endif
```

```
};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .ioctl | called at the end of ioctl() syscall handler at the V4L2core.used to provide support for private ioctls used on thedriver. |
| .compat_ioct132 | called when a 32 bits application uses a 64 bits Kernel, inorder to fix data passed from/to userspace.in order to fix |
|  | data passed from/to userspace. |

[示例]

```c
static const struct v4l2_subdev_core_ops vm149c_core_ops = {

.ioctl = vm149c_ioctl,

#ifdef CONFIG_COMPAT
```

```python
.compat_ioctl32 = vm149c_compat_ioctl32
```

```
#endif

};
```

目前使用了如下的私有 ioctl实现马达移动时间信息的查询。

RK\_VIDIOC\_VCM\_TIMEINFO

##### 5.2.1.3 struct v4l2\_ctrl\_ops

[说明]

The control operations that the driver has to provide.

[定义]

```c
struct v4l2_ctrl_ops {

int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);

int (*try_ctrl)(struct v4l2_ctrl *ctrl);

int (*s_ctrl)(struct v4l2_ctrl *ctrl);

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .g_volatile_ctrl | Get a new value for this control. Generally only relevant for volatile (and usually read-only) controls such as a |
|  | changes continuously. |
| .s_ctrl | Actually set the new control value. s_ctrl is compulsory. The ctrl-&gt;handler-&gt;lock is held when these ops are called, so no one else can access controls owned by that handler. |

[示例]

```c
static const struct v4l2_ctrl_ops vm149c_vcm_ctrl_ops = {

.g_volatile_ctrl = vm149c_get_ctrl,

.s_ctrl = vm149c_set_ctrl,

};
```

vm149c\_get\_ctrl 和 vm149c\_set\_ctrl 对下面的 control 进行了支持

V4L2\_CID\_FOCUS\_ABSOLUTE

#### 5.2.2 API 简要说明

#### 5.2.2.1xxxx\_get\_ctrl

[描述]

获取马达的移动位置。

[语法]

static int xxxx\_get\_ctrl(struct v4l2\_ctrl \*ctrl)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *ctrl | v412 control 结构体指针 | 输出 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 5.2.2.2xxxx\_set\_ctrl

[描述]

设置马达的移动位置。

[语法]

static int xxxx\_set\_ctrl(struct v4l2\_ctrl \*ctrl)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *ctrl | v412 control 结构体指针 | 输入 |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

#### 5.2.2.3xxxx\_ioctl/xxxx\_compat\_ioctl32

[描述]

自定义ioctl的实现函数，主要包含获取马达移动的时间信息，

实现了自定义 RK\_VIDIOC\_COMPAT\_VCM\_TIMEINFO。

[语法]

static int xxxx\_ioctl(struct v4l2\_subdev \*sd, unsigned int cmd, void \*arg)

[参数]


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
| *arg/arg | 参数指针 | 输出 |
|  |  |  |

[返回值]


|  |  |
| --- | --- |
|  |  |
|  |  |

### 5.2.3驱动移植步骤

1.实现标准的i2c子设备驱动部分.

1.1 根据 struct i2c\_driver 描述，主要实现以下几部分：

struct driver.name

struct driver.pm

struct driver. of\_match\_table

probe 函数

remove 函数

1.2 probe 函数实现细节描述：

1）VCM设备资源获取，主要获取DTS资源，参考VCM设备注册（DTS）

2） VCM v4l2 设备以及 media 实体的初始化.

media 实体：media\_entity\_init；

3）RK AF 算法将模组镜头整个可移动行程的位置参数定义为[0,64]，模组镜头整个可

2.实现v4l2 子设备驱动，主要实现以下2 个成员：


| struct v4l2_subdev_core_ops |
| --- |
| struct v412_ctrl_ops |

2.1 参考 v4l2\_subdev\_core\_ops 说明实现回调函数，主要实现以下回调函数：  

.ioctl   

.compat\_ioctl32  

该回调主要实现 RK私有控制命令，涉及：


| RK_VIDIOC_VCM_TIMEINFO | camera_engine通过该命令获取此次镜头移动所需 时间，据此来判断镜头何时停止以及CIS帧曝光时间段是 否与镜头移动时间段有重叠； 镜头移动时间与镜头移动距离、VCM driver ic 电流 |
| --- | --- |

2.2 参考v4l2\_ctrl\_ops说明实现回调函数，主要实现以下回调函数：


| .g_volatile_ctrl |
| --- |
|  |
|  |
| .s_ctrl |

.g\_volatile\_ctrl 和.s\_ctrl 以标准的 v4l2 control 实现了以下命令：


| V4L2_CID_FOCUS_ABSOLUTE 义为[0,64]。 | camera_engine 通过该命令来设置和获取镜头的绝对 位置，RK AF算法中将镜头整个可移动行程的位置参数定 |
| --- | --- |

## 6 Rk1608 AP 驱动

### 6.1 驱动版本号获取方式

通过以下命令可以查询：

```
echo v > /dev/rk_preisp
```

### 6.2 框架简要说明

Rk1608 内部 mipi 通路连接图如下：  





sensor i2c 可以被 AP 控制，也可以被 1608 直接控制。



### 6.3 Rk1608 AP 设备注册(DTS)

以 rk3326-evb-lp3-v10-rk1608-linux.dts 为例

```c
#define LINK_FREQ 400000000

mipidphy0: mipidphy0 {//rk1608 mipi dphy
```

```c
data_type = <0x2c>;//mipi data type
/*in_mipi: rk1608 in mipi phy index
*out_mipi: rk1608 out mipi phy index
*注意：此处走 bypass mode，vip/vop mode 需要更改 rk1608 固件
*如果硬件连接 rk1608 mipi dphy rx3，软件此处需要配 in_mipi=<1>
*bypass mode:
*rx0/rx2 进，tx0 出
*rx2/rx3 进，tx1 出*/
in_mipi = <2>;
out_mipi = <1>;
mipi_lane = <2>;//mipi lane num
//rk1608’ i2c bus index, use for rk1608<->i2c<->sensor
sensor_i2c_bus = <1>;
sensor_i2c_addr = <0x78>;
sensor-name = "OPN8008";//sensor name
field = <1>;//used interlacing type (from enum v4l2_field)
colorspace = <8>;//colorspace of the data (from enum v4l2_colorspace)
//data format code (from enum v4l2_mbus_pixelcode)
code = <MEDIA_BUS_FMT_SRGGB12_1X12>;
width = <328>;//image width
height= <744>;//image height
htotal = <650>;//horizontal total
vtotal = <900>;//vertical total
/* rk1608 mipi out freqs
* mipi clk: htotal * vtotal * max_fps * data_bits / lane */
link-freqs = /bits/ 64 <LINK_FREQ>;
```

/\*input ch0 info:&lt;width height data\_id decode\_format flag&gt;

Data Identifier (Dl) Byte   

DI7 DI6 DI5 DI4 DI3 DI2 DI1 DIO   

vc DT   

Virtual Channel Data Type   

Indentifier (DT)   

\* data\_id (VC)   

\* decode\_format 0x2c(raw12)   

\* flag 1(picture channel) 0(normal channel)\*/   

```dts
inch0-info = <328 744 0x2c 0x2c 1>;
outch0-info = <328 744 0x2c 0x2c 1>;//out ch0 info
rockchip,camera-module-index = <0>;//模组编号，该编号不要重复
rockchip,camera-module-facing = "back";//模组朝向，有"back"和"front"
rockchip,camera-module-name = "TongJu";//模组名
rockchip,camera-module-lens-name = "CHT842-MD";//lens 名
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
rk1608_dphy0_in: endpoint {
remote-endpoint = <&rk1608_out0>;//rk1608 mipidphy 输入端
};
};
port@1 {
rk1608_dphy_out: endpoint {
remote-endpoint = <&mipi_in_ucam>;//rk1608 mipidphy 输出端
clock-lanes = <0>;
data-lanes = <1 2>;
clock-noncontinuous;

link-frequencies =
/bits/ 64 <LINK_FREQ>;
};
};
};
};
&i2c2 {
```

…   

```
pisp_dmy: pisp_dmy@1 {
/*dummy sensor for preisp, sensor 直接与 rk1608 通信使用此驱动
```

\*sensor 与 AP 端通信使用对应 sensor 驱动\*/   

```dts
compatible = "pisp_dmy";
status = "okay";
reg = <0x1>;
clocks = <&cru SCLK_CIF_OUT>;
clock-names = "xvclk";
pwdn-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;
rockchip,camera-module-index = <0>;
rockchip,camera-module-facing = "back";
rockchip,camera-module-name = "TongJu";
rockchip,camera-module-lens-name = "CHT842-MD";
port {
cam_out: endpoint {
remote-endpoint = <&rk1608_in0>;//sensor 输出端口
data-lanes = <1 2>;
};

};
};
};
&spi1 {
```

…   

spi\_rk1608@00 &#123;//rk1608 spi 设备   

```dts
compatible = "rockchip,rk1608";
status = "okay";
reg = <0>;
spi-max-frequency = <16000000>;
spi-min-frequency = <16000000>;
clocks = <&cru SCLK_CIF_OUT>;
clock-names = "mclk";
firmware-names = "rk1608.rkl";//rk1608 固件名
reset-gpios = <&gpio3 RK_PC4 GPIO_ACTIVE_HIGH>;
irq-gpios = <&gpio3 RK_PC5 GPIO_ACTIVE_HIGH>;
pinctrl-names = "default";
pinctrl-0 = <&preisp_irq_gpios &preisp_sleep_gpios
&preisp_reset_gpios>;
```

/\* regulator config \*/   

```
vdd-core-regulator = "vdd_preisp";
vdd-core-microvolt = <1150000>;
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {

#address-cells = <1>;
#size-cells = <0>;
reg = <0>;
rk1608_out0: endpoint@0 {
reg = <0>;
remote-endpoint = <&rk1608_dphy0_in>;//rk1608 输出端口
};
};
port@1 {
#address-cells = <1>;
#size-cells = <0>;
reg = <1>;
rk1608_in0: endpoint@0 {
reg = <0>;
remote-endpoint = <&cam_out>;//rk1608 输入端口
};
};
};
};
};
```

有些算法不需要 1608 直接接 sensor,此时可以只配置 spi\_rk1608 节点， spi\_rk1608 节点中  

的 port信息不需要配置。应用通过 rk1608\_dev.c中提供ioctl接口控制 1608完成算法应用。  

另外，上述mipidphy dts仅能支持一个输出格式到AP，在下面的这个提交之后，可以支持多个输  

出格式到AP，这个提交目前暂时还未合并。  

media: spi: rk1608: support multiple output format to isp  

Change-Id: Icc9c14891d6f7494a6d6cc4752dabcf07278d708

Signed-off-by: Hu Kejun &lt;william.hu@rock-chips.com&gt;   

这个提交对应的dts需要做一些变动。   

```dts
mipidphy0: mipidphy0 {
compatible = "rockchip,rk1608-dphy";
status = "okay";
rockchip,grf = <&grf>;
id = <0>;
cam_nums = <1>;
in_mipi = <0>;
out_mipi = <0>;
link-freqs = /bits/ 64 <LINK_FREQ>;
sensor_i2c_bus = <6>;
sensor_i2c_addr = <0x1A>;
sensor-name = "IMX317";
rockchip,camera-module-index = <0>;
rockchip,camera-module-facing = "back";
rockchip,camera-module-name = "PREISP";
rockchip,camera-module-lens-name = "PREISP";
format-config-0 { // 1608 到 AP 的输出格式一
data_type = <0x2b>;
mipi_lane = <4>;
field = <1>;
colorspace = <8>;
code = <MEDIA_BUS_FMT_SRGGB10_1X10>;
width = <1932>;
height= <1094>;
```

```c
htotal = <2500>;
vtotal = <1500>;
inch0-info = <1932 1094 0x2b 0x2b 1>;
outch0-info = <1932 1094 0x2b 0x2b 1>;
};
format-config-1 { // 1608 到 AP 的输出格式二
data_type = <0x2b>;
mipi_lane = <4>;
field = <1>;
colorspace = <8>;
code = <MEDIA_BUS_FMT_SRGGB10_1X10>;
width = <3864>;
height= <2174>;
htotal = <4200>;
vtotal = <2400>;
inch0-info = <3864 2174 0x2b 0x2b 1>;
outch0-info = <3864 2174 0x2b 0x2b 1>;
};
ports {
#address-cells = <1>;
#size-cells = <0>;
port@0 {
rk1608_dphy0_in: endpoint {
remote-endpoint = <&rk1608_out0>;
};
```

```
};
port@1 {
rk1608_dphy_out: endpoint {
remote-endpoint = <&mipi_in_cam>;
clock-lanes = <0>;
data-lanes = <1 2 3 4>;
clock-noncontinuous;
link-frequencies =
/bits/ 64 <LINK_FREQ>;
};
};
};
};
```

对于rk1608 hdr 模式，dts需要增加2 个AE同步引脚配置：   

rk1608(gpio1\_A2)-&gt;AP gpio rk1608 帧开始信号通知 AP 端   

AP gpio-&gt; rk1608(gpio1\_A3) AP端配置完曝光后通知 rk1608   

```dts
&spi1 {
spi_rk1608@00 {//rk1608 spi 设备
//AP gpio-> rk1608(gpio1_A3)
aesync-gpio = <&gpio2 RK_PA1 GPIO_ACTIVE_LOW>//AP 端 gpio
};
};
&rkisp1 {

//rk1608(gpio1_A2)->AP gpio
Vsirq-gpios = <&gpio RK_PA0 GPIO_ACTIVE_LOW>;//AP 端 gpio
}
```

### 6.4 Rk1608 AP 驱动说明

### 6.4.1数据类型简要说明

##### 6.4.1.1 struct spi\_driver

[说明]

定义 spi 设备驱动信息

[定义]

```c
struct spi_driver {

const struct spi_device_id *id_table;

int (*probe)(struct spi_device *);

int (*remove)(struct spi_device *);
```

void (\*shutdown)(struct spi\_device \*)

```c
struct device_driver driver;

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| @driver | Device driver model driver主要包含驱动名称和与 DTS 注册设备进行匹配的 of_match_table。当of_match_table 中的 compatible 域和 dts 文件的 compatible 域匹配时，.probe函数才会被调用 |
| @id_table | List of SPI devices supported by this driver如果kernel没有使用of_match_table和dts注册设备进行进行匹配，则 kernel 使用该 table 进行匹配 |
| @probe | Callback for device binding |
| @remove | Callback for device unbinding |

```c
[示例]
static const struct spi_device_id rk1608_id[] = {
{ "rk1608", 0 },
{ }
};
MODULE_DEVICE_TABLE(spi, rk1608_id);
static const struct of_device_id rk1608_of_match[] = {
{ .compatible = "rockchip,rk1608" },
{ }
};
MODULE_DEVICE_TABLE(of,rk1608_of_match);
static struct spi_driver rk1608_driver = {
.driver = {
.name = "rk1608",
.of_match_table = of_match_ptr(rk1608_of_match),
},
```

```c
.probe = &rk1608_probe,
.remove = &rk1608_remove,
.id_table = rk1608_id,
};
module_i2c_driver(vm149c_i2c_driver);
static int __init preisp_mod_init(void){
return spi_register_driver(&rk1608_driver);
}
static int __exit preisp_mod_exit(void){
return spi_unregister_driver(&rk1608_driver);
}
late_initcall(preisp_mod_init);
module_exit(preisp_mod_exit);
```

##### 6.4.1.2 struct v4l2\_subdev\_core\_ops

```c
[说明]
Define core ops callbacks for subdevs.
[定义]
struct v4l2_subdev_core_ops {
long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
#ifdef CONFIG_COMPAT
long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
unsigned long arg);
#endif
```

```
};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .ioctl | called at the end of ioctl() syscall handler at the V4L2core.used to provide support for private ioctls used on thedriver. |
| .compat_ioctl32 | called when a 32 bits application uses a 64 bits Kernel, inorder to fix data passed from/to userspace.in order to fixdata passed from/to userspace. |

[示例]

```c
static const struct v4l2_subdev_core_ops rk1608_core_ops = {

.s_power = rk1608_sensor_power,

.ioctl = rk1608_ioctl,

};
```

目前使用了如下的私有 ioctl 获取sensor信息、曝光控制。


| 私有ioctl | 描述 |
| --- | --- |
| PREISP_CMD_SAVE_HDRAE_PARAM | 向 1608 传递当前的 awb gain 信息和 1sc 补偿信息;由isp 驱动直接调用；详细参考struct preisp hdrae para s; |
| PREISP CMD SET HDRAE EXP | 进行 sensor HDR 模式的曝光设置；详细参考struct preisp hdrae exp s; |
| RKMODULE_GET_MODULE_INFO | 获取模组信息，实际返回对应 sensor的模组信息;详细参考struct rkmodule inf; |

[说明]   

Callbacks used when v4l device was opened in video mode.   

[定义]   

```c
struct v4l2_subdev_video_ops {
int (*s_stream)(struct v4l2_subdev *sd, int enable);
int (*g_frame_interval)(struct v4l2_subdev *sd,
struct v4l2_subdev_frame_interval *interval);
int (*s_frame_interval)(struct v4l2_subdev *sd,
struct v4l2_subdev_frame_interval *interval);
```

##### 6.4.1.3 struct v4l2\_subdev\_video\_ops

```
};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .g_frame_interval | cal1back for VIDIOC SUBDEV G FRAME INTERVAL ioct1 handlercode |
| .s_stream | used to notify the driver that a video stream will start orhas stopped |

[示例]

```c
static const struct v4l2_subdev_video_ops rk1608_video_ops = {

.s_stream = rk1608_s_stream,

.g_frame_interval = rk1608_g_frame_interval,

};
```

##### 6.4.1.4 struct v4l2\_subdev\_pad\_ops

[说明]

v4l2-subdev pad level operations

[定义]

```c
struct v4l2_subdev_pad_ops {

int (*enum_mbus_code)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_mbus_code_enum *code);

int (*enum_frame_size)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_frame_size_enum *fse);

int (*get_fmt)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_format *format);

int (*set_fmt)(struct v4l2_subdev *sd,

struct v4l2_subdev_pad_config *cfg,

struct v4l2_subdev_format *format);

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| . enum_mbus_code | cal1back for VIDIOC_SUBDEV_ENUM_MBUS_CODE ioct1 handler code. |
| . enum_frame_size | cal1back for VIDIOC SUBDEV ENUM FRAME SIZE ioct1 handlercode. |
| .s_fmt | callback for VIDIOC_SUBDEV_S_FMT ioctl handler code. |
| ·g_fmt | callback for VIDIOC_SUBDEV_G_FMT ioct1 handler code |

[示例]

```c
static const struct v4l2_subdev_pad_ops rk1608_subdev_pad_ops = {
```

```python
.enum_mbus_code = rk1608_enum_mbus_code,
```

.enum\_frame\_size = rk1608\_enum\_frame\_sizes,

```python
.get_fmt = rk1608_get_fmt,
```

.set\_fmt = rk1608\_set\_fmt,

```
};
```

##### 6.4.1.5 struct file\_operations

[说明]

File operations

[定义]

```c
struct file_operations {

struct module *owner;

int (*open)(struct inode *, struct file *);

int (*release)(struct inode *, struct file *);

ssize_t (*write)(struct file *, const char __user *, size_t, loff_t *);

unsigned int (*poll)(struct file *, struct poll_table_struct *);

long (*unlocked_ioctl)(struct file *, unsigned int, unsigned long);

long (*conpat_ioctl)(struct file *, unsigned int, unsigned long);
```

```c
};
[示例]
static const struct file_operations rk1608_fops = {
.owner = THIS_MODULE,
.open = rk1608_dev_open,
.release = rk1608_dev_release,
.write = rk1608_dev_write,
.poll = rk1608_dev_poll,
.unlocked_ioctl = rk1608_dev_ioctl,
#ifdef CONFIG_COMPAT
.compat_ioctl = rk1608_compat_ioctl,
#endif
};
Rk1608 spi设备文件节点操作，上层可直接访问此节点控制 rk1608。
```

##### 6.4.1.6 struct preisp\_hdrae\_para\_s

[说明]   

Awb and lsc parameter for preisp.   

[定义]   

```c
struct preisp_hdrae_para_s {
unsigned short r_gain;
unsigned short b_gain;
unsigned short gr_gain;
unsigned short gb_gain;
int lsc_table[PREISP_LSCTBL_SIZE];

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| r_gain | awb r gain |
| b_gain | awb b gain |
| gr_gain | awb gr gain |
| gb_gain | awb gb gain |
| 1sc_table | 1sc table |

[示例]

##### 6.4.1.7 struct preisp\_hdrae\_exp\_s

[说明]

Hdr ae 曝光设置.

[定义]

```c
struct preisp_hdrae_exp_s {

unsigned int long_exp_reg;

unsigned int long_gain_reg;

unsigned int middle_exp_reg;

unsigned int middle_gain_reg;

unsigned int short_exp_reg;

unsigned int short_gain_reg;

unsigned int long_exp_val;

unsigned int long_gain_val;

unsigned int middle_exp_val;

unsigned int middle_gain_val;

unsigned int short_exp_val;

unsigned int short_gain_val;

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| long_exp_reg | HDR 长曝光时间寄存器值； |
| long_gain_reg | HDR 长曝光 gain 寄存器值； |
| middle_exp_reg | HDR 中曝光时间寄存器值； |
| middle_gain_reg | HDR 中曝光 gain 寄存器值; |
| short_exp_reg | HDR短曝光时间寄存器值； |
| short_gain_reg | HDR 短曝光 gain 寄存器值; |
| long_exp_val | HDR 长曝光时间实际值，将上层传递的 f1oat值传给1608; |
| long_gain_val | HDR 长曝光 gain 实际值，将上层传递的 float 值传给1608; |
| middle_exp_val | HDR 中曝光时间实际值，将上层传递的 float值传给1608; |
| middle_gain_val | HDR 中曝光 gain 实际值，将上层传递的 float 值传给1608; |
| short_exp_val | HDR短曝光时间实际值，将上层传递的 float值传给1608; |
| short_gain_val | HDR 短曝光 gain 实际值，将上层传递的 float 值传给1608; |

[示例]

### 6.4.2API 简要说明

如下V4L2 API用法与 sensor 一样，不再重复说明。

xxxx\_set\_fmt

xxxx\_get\_fmt

xxxx\_enum\_mbus\_code

xxxx\_enum\_frame\_sizes

xxxx\_g\_frame\_interval

xxxx\_s\_stream

xxxx\_set\_ctrl

##### 6.4.2.1 rk1608\_dev\_write

[描述]

通过/dev/rk\_preisp 传输命令，可用于调试

[用法]

```
echo c > /dev/rk_preisp

receive a message from rk1608 -> AP message queue

echo f [fw_name] > /dev/rk_preisp

download firmware, there is no parameter and download preisp.rkl default

echo fw reg1 > /dev/rk_preisp

fast write reg1, make a interrupt of rk1608

echo fr > /dev/rk_preisp

fast read, read the value of reg2

echo log level > /dev/rk_preisp

set the rk1608 print level, the smaller of the value of number, the fewer of log

echo on > /dev/rk_preisp

power on, increase 1 on the count, and only execute when the count is 1.

echo off > /dev/rk_preisp

power off, decrease 1 from the count, execute only when the count is 0.

echo q > /dev/rk_preisp
```

rK1608 last operation state query

```
echo r addr [length] > /dev/rk_preisp

read data, output the data by kmsg

echo rate max [min] > /dev/rk_preisp
```

set the maximum speed and minimum speed of spi

```
echo s type,... > /dev/rk_preisp

send message to AP -> rk1608 message queue

echo w addr value,... > /dev/rk_preisp
```

write data

```
echo v > /dev/rk_preisp
```

inquire the version of driver

### 6.4.3Bringup 步骤

使用1608 bypass固件调试时的大概步骤：

·确认所接 sensor 驱动为 liner mode，1608 bypass 固件不支持 hdr mode;

·确认 dts 文件中配置的 1608 固件为 1608 bypass 固件;

spi\_rk1608 节点中的 firmware-names 可以指定固件名称

```
firmware-names = "fw_rk1608_bypass.rkl";

·修改 dts 文件中 mipidphy 的配置;

code = <MEDIA_BUS_FMT_SRGGB10_1X10>; // sensor 输出图像格式

width = <1932>; // sensor 输出图像宽度

height= <1094>; // sensor 输出图像高度

htotal = <2500>; // 比 sensor 输出图像宽度大 400 左右

vtotal = <1500>; // 比 sensor 输出图像高度大 400 左右
```

$$

```
\mathrm { i n c h 0 - i n f o ~ = ~ < 1 9 3 2 ~ 1 0 9 4 ~ 0 x 2 b ~ 0 x 2 b ~ 1 > ; ~ / / ~ \hbar \frac { 4 \pi } { 1 5 } f f f \frac { 8 \pi } { 1 0 } ~ s e n s o r ~ \frac { i \pi } { 1 0 1 } | \frac { 1 } { 1 4 } | \frac { ( 2 \hbar ) } { 1 9 } f f \frac { 8 \pi } { 1 0 } ~ f \frac { 1 } { 1 5 } - \hbar \frac { 8 \pi } { 1 0 } | \frac { 1 } { 1 5 } f f . }
```

$$

```
outch0-info = <1932 1094 0x2b 0x2b 1>; // 按照 sensor 输出图像格式填写

link-freqs = /bits/ 64 <LINK_FREQ>; // 这里设置的 link-freqs 要比 sensor->1608 的
```

link-freqs 高才行，一般大 30%，也可以尝试最高的 link-freqs 750MHz。

rk1608 spi32766.0: Download firmware success!

1608上电的时序要求如下：

1. Power up timing:



$$

\tau _ &#123; 1 &#125; \geq 0 , \tau 2 \geq 0 , \tau 3 \geq 0 , \tau 4 \geq 0

$$

2. SPI timing after power up



其中的 NPOR 即为 1608 reset 引脚。

2) 调试 1608 hdr mode 时，dts 需要增加 2 个 AE 同步引脚配置，请参考 rk1608 dts 配置说明。  

Sensor 驱动需要实现 PREISP\_CMD\_SET\_HDRAE\_EXP ioctl，对 sensor hdr mode 配置曝光和 gain。  

1608 固件需要使用 hdr mode 固件。

## 7 FlashLight 驱动

### 7.1 FLASHLight 设备注册(DTS)

```dts
&i2c1 {
```

...   

```dts
sgm3784: sgm3784@30 {//闪光灯设备
#address-cells = <1>;
#size-cells = <0>;
compatible = "sgmicro,gsm3784";
reg = <0x30>;
rockchip,camera-module-index = <0>;//闪光灯对应 camera 模组编号
rockchip,camera-module-facing = "back";//闪光灯对应 camera 模组朝向
enable-gpio = <&gpio2 RK_PB4 GPIO_ACTIVE_HIGH>;//enable gpio
strobe-gpio = <&gpio1 RK_PA3 GPIO_ACTIVE_HIGH>;//flash 触发 gpio
status = "okay";
sgm3784_led0: led@0 {//led0 设备信息
reg = <0x0>;//index
led-max-microamp = <299200>;//torch 模式最大电流
flash-max-microamp = <1122000>;//flash 模式最大电流
flash-max-timeout-us = <1600000>;//falsh 最大时间
};
sgm3784_led1: led@1 {//led1 设备信息
reg = <0x1>;//index
led-max-microamp = <299200>;//torch 模式最大电流
flash-max-microamp = <1122000>;//flash 模式最大电流
flash-max-timeout-us = <1600000>;//falsh 最大时间
```

```javascript
};
};
ov13850: ov13850@10 {
flash-leds = <&sgm3784_led0 &sgm3784_led1>;//闪光灯设备挂接到 camera
};
}
```

### 7.2 FLASHLight 驱动说明

### 7.2.1数据类型简要说明

##### 7.2.1.1 struct i2c\_driver

```c
[说明]
定义i2c 设备驱动信息
[定义]
struct i2c_driver {
/* Standard driver model interfaces */
int (*probe)(struct i2c_client *, const struct i2c_device_id *);
int (*remove)(struct i2c_client *);
struct device_driver driver;
const struct i2c_device_id *id_table;
```

[关键成员]


| 成员名称 | 描述 |
| --- | --- |
| @driver | Device driver model driver主要包含驱动名称和与 DTS 注册设备进行匹配的 of_match_table。当of_match_table 中的 compatible 域和 dts 文件的 compatible 域匹配时，.probe函数才会被调用 |
| @id_table | List of I2C devices supported by this driver如果kernel没有使用of_match_table和dts注册设备进行进行匹配，则 kernel 使用该 table 进行匹配 |
| @probe | Callback for device binding |
| @remove | Callback for device unbinding |

```c
[示例]
static const struct i2c_device_id sgm3784_id_table[] = {
{ SGM3784_NAME, 0 },
{ { 0 } }
};
MODULE_DEVICE_TABLE(i2c, sgm3784_id_table);
static const struct of_device_id sgm3784_of_table[] = {
{ .compatible = "sgmicro,sgm3784" },
{ { 0 } }
};
MODULE_DEVICE_TABLE(of, sgm3784_of_table);
static const struct dev_pm_ops sgm3784_pm_ops = {
```

SET\_RUNTIME\_PM\_OPS(sgm3784\_runtime\_suspend, sgm3784\_runtime\_resume, NULL)   

```c
};
static struct i2c_driver sgm3784_i2c_driver = {
.driver = {
.name = sgm3784_NAME,
.pm = &sgm3784_pm_ops,
.of_match_table = sgm3784_of_table,
},
.probe = &sgm3784_probe,
.remove = &sgm3784_remove,
.id_table = sgm3784_id_table,
};
module_i2c_driver(vm149c_i2c_driver);
```

##### 7.2.1.2 struct v4l2\_subdev\_core\_ops

```c
[说明]
Define core ops callbacks for subdevs.
[定义]
struct v4l2_subdev_core_ops {
long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
#ifdef CONFIG_COMPAT
long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
unsigned long arg);
#endif
```

```
};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .ioctl | called at the end of ioctl() syscall handler at the V4L2core.used to provide support for private ioctls used on thedriver. |
| .compat_ioct132 | called when a 32 bits application uses a 64 bits Kernel, inorder to fix data passed from/to userspace.in order to fixdata passed from/to userspace. |

[示例]

```c
static const struct v4l2_subdev_core_ops sgm3784_core_ops = {

.ioctl = sgm3784_ioctl,

#ifdef CONFIG_COMPAT

.compat_ioctl32 = sgm3784_compat_ioctl32

#endif

};
```

目前使用了如下的私有 ioctl实现闪光灯点亮时间信息的查询。

RK\_VIDIOC\_FLASH\_TIMEINFO

##### 7.2.1.3 struct v4l2\_ctrl\_ops

[说明]

The control operations that the driver has to provide.

[定义]

```c
struct v4l2_ctrl_ops {

int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);

int (*s_ctrl)(struct v4l2_ctrl *ctrl);

};

[关键成员]
```


| 成员名称 | 描述 |
| --- | --- |
| .g_volatile_ctrl | Get a new value for this control. Generally only relevantfor volatile (and usually read-only) controls such as acontrol that returns the current signal strength whichchanges continuously. |
| .s_ctrl | Actually set the new control value. s_ctrl is compulsory.The ctrl-&gt;handler-&gt;lock is held when these ops are called,so no one else can access controls owned by that handler. |

[示例]

```c
static const struct v4l2_ctrl_ops sgm3784_ctrl_ops[LED_MAX] = {

[LED0] = {
.g_volatile_ctrl = sgm3784_led0_get_ctrl,
.s_ctrl = sgm3784_led0_set_ctrl,
},
[LED1] = {
.g_volatile_ctrl = sgm3784_led1_get_ctrl,
.s_ctrl = sgm3784_led1_set_ctrl,
}
};
```

### 7.2.2API 简要说明

#### 7.2.2.1xxxx\_set\_ctrl

[描述]

设置闪光灯模式、电流和flash timeout时间。

[语法]

static int xxxx\_set\_ctrl(struct v4l2\_ctrl \*ctrl)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *ctrl | v412 control 结构体指针 | 输入 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

#### 7.2.2.2xxxx\_get\_ctrl

[描述]

获取闪光灯故障状态。

[语法]

static int xxxx\_get\_ctrl(struct v4l2\_ctrl \*ctrl)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *ctrl | v412 control 结构体指针 | 输出 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

#### 7.2.2.3xxxx\_ioctl/xxxx\_compat\_ioctl32

[描述]

自定义ioctl的实现函数，主要包含获取闪光灯亮的时间信息，

实现了自定义 RK\_VIDIOC\_COMPAT\_FLASH\_TIMEINFO。

[语法]

static int xxxx\_ioctl(struct v4l2\_subdev \*sd, unsigned int cmd, void \*arg)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| *sd | v412 subdev 结构体指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

### 7.2.3驱动移植步骤

对于普通 gpio 直接控制 led 可参考使用 kernel/drivers/leds/leds-rgb13h.c 和kernel/Documentation/devicetree/bindings/leds/leds-rgb13h.txt

对于 flashlight driver IC 可按如下步骤移植

1.实现标准的i2c子设备驱动部分.

1.1 根据 struct i2c\_driver 描述，主要实现以下几部分：

struct driver.name

struct driver.pm   

struct driver. of\_match\_table   

probe 函数   

remove 函数

1.2 probe 函数实现细节描述：

1）flashlight 设备资源获取，主要获取 DTS 资源，参考 FLASHLIGHT 设备注册(DTS);

2)flash 设备名:

对于双led闪光灯，使用led0、led1 设备名进行区分。

name: led0 meet the main led   

name: led1 meet the secondary led   

snprintf(sd-&gt;name, sizeof(sd-&gt;name),   

"m%02d %s %s led%d %s",   

flash-&gt;module\_index, facing,   

SGM3784\_NAME, i, dev\_name(sd-&gt;dev));

3)FLASH v4l2 设备以及 media 实体的初始化.

media 实体：media\_entity\_init；

2.实现v4l2 子设备驱动，主要实现以下2 个成员：

```tcl
struct v4l2_subdev_core_ops
struct v4l2_ctrl_ops
```

2.1 参考 v4l2\_subdev\_core\_ops 说明实现回调函数，主要实现以下回调函数：

该回调主要实现 RK私有控制命令，涉及：


| RK_VIDIOC_FLASH_TIMEINFO | camera_engine 通过该命令获取此次 led 亮的时 间，据此来判断CIS帧曝光时间是否在闪光灯亮之后。 |
| --- | --- |

2.2 参考v4l2\_ctrl\_ops说明实现回调函数，主要实现以下回调函数：


| ·g_volatile_ctrl |
| --- |
|  |
|  |
| .s_ctrl |

.g\_volatile\_ctrl 和.s\_ctrl 以标准的 v4l2 control 实现了以下命令：


| V4L2_CID_FLASH_FAULT | 获取闪光灯故障信息 |
| --- | --- |
| V4L2 CID FLASH LED MODE | 设置 Led 模式V4L2_FLASH_LED_MODE_NONEV4L2_FLASH_LED_MODE_TORCHV4L2_FLASH_LED_MODE_FLASH |
| V4L2 CID FLASH STROBE | 控制闪光灯开 |
| V4L2_CID_FLASH_STROBE_STOP | 控制闪光灯关 |
| V4L2_CID_FLASH_TIMEOUT | 设置闪光灯模式最大持续亮时间 |
| V4L2_CID_FLASH_INTENSITY | 设置闪光灯模式电流 |
| V4L2_CID_FLASH_TORCH_INTENSITY | 设置火炬模式电流 |

## 8 media-ctl / v4l2-ctl 工具

具体用法可以参考命令的帮助信息，下面是常见的几个使用。

```shell
1）打印拓扑结构
media-ctl -p /dev/media0
2） 修改 fmt/size
media-ctl -d /dev/media0 \
--set-v4l2 '"ov5695 7-0036":0[fmt:SBGGR10_1X10/640x480]
3）设置fmt并抓帧
v4l2-ctl -d /dev/video0 \
--set-fmt-video=width=720,height=480,pixelformat=NV12 \
--stream-mmap=3 \
--stream-skip=3 \
--stream-to=/tmp/cif.out \
--stream-count=1 \
--stream-poll
4） 设置曝光、gain 等 control
v4l2-ctl -d /dev/video3 --set-ctrl 'exposure=1216,analogue_gain=10
```

## 9 FAQ

### 9.1 如何判断 rkisp驱动加载状态

/sys/class/video4linux/video3/name:rkisp1\_selfpath

/sys/class/video4linux/video4/name:rkisp1\_mainpath

/sys/class/video4linux/video5/name:rkisp1-statistics

/sys/class/video4linux/video6/name:rkisp1-input-params

还可以通过 media-ctl命令，打印拓扑结构查看 pipeline是否正常。

### 1）判断camera驱动是否加载成功

当所有的camera 都注册完毕，kernel会打印出如下的 log。

localhost \~ # dmesg | grep Async

[ 0.682982] rkisp1: Async subdev notifier completed

如发现 kernel 没有 Async subdev notifier completed 这行 log，那么请首先查看 sensor

是否有相关的报错，I2C通讯是否成功。

### 9.2 如何抓取 isp 输出的 yuv 数据

参考命令如下，

$$

```
\begin{array} { r }  \mathrm  n e d i a \mathrm { - c t 1 _ d \ / / d e v / n e d i a 0 \mathrm { - } } \mathrm { - s e t \mathrm { - } v 4 1 2 \mathrm { \Lambda } } ^  \mathrm { ~ \prime } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm { ~ } \mathrm   \end{array}
```

$$

$$

\mathrm &#123; &#123; \font ~ &#123; \font ~ &#123; \font ~ &#123; \font ~ &#123; \Lambda &#125; ~ - \Lambda &#125; ~ - \Lambda &#125; ~ - \Lambda &#125; ~ - \Lambda &#125; ~ / \ d e v / \ m e d i a 0 ~ - s e t - v 4 1 2 ~ &#125; ^ &#123; \prime \prime &#125; &#123; \bf &#123; \Sigma &#125; &#125; ^ &#123; \prime &#125; &#123; \bf &#123; \Psi &#125; &#125; _ &#123; \mathrm &#123; &#123; r k i s p 1 - i s p - s u b d e v &#125; &#125; &#125; ^ &#123; \prime &#125; &#123; \bf &#123; \Psi &#125; &#125; ^ &#123; \prime &#125; 0 [ \mathrm &#123; &#123; f i m t : S R G G R 1 0 &#125; ~ 1 X 1 0 / 2 5 9 2 x 1 9 4 4 &#125; ] ^ &#123; \prime &#125; .

$$

media-ctl -d /dev/media0 --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/2592x1944]

media-ctl -d /dev/media0 --set-v4l2 '"rkisp1-isp-subdev":2[fmt:YUYV8\_2X8/2592x1944]

media-ctl -d /dev/media0 --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/2592x1944]

v4l2-ctl -d /dev/video4 \

--set-selection=target=crop,top=336,left=432,width=1920,height=1080 \

--set-fmt-video=width=1280,height=720,pixelformat=NV21 \

--stream-mmap=3 --stream-to=/tmp/mp.out --stream-count=20 --stream-poll

### 9.3 如何抓取 Sensor 输出的 Raw Bayer 原始数据

参考命令如下，

$$

```
\begin{array} { r } { \mathrm { n e d i a \mathrm { - c t 1 _ d \ / / d e v / m e d i a 0 \mathrm { - } s e t \mathrm { - } v 4 1 2 \mathrm { \Omega } ^ { \nu , \nu _ { 0 } } v s 6 9 5 \mathrm { \Omega } } \ 7 \mathrm { - } 0 0 3 6 \mathrm { ^ { \nu } \mathrm { { : } } 0 [ f i n t : 5 B G G R 1 0 _ 1 X 1 0 / 2 5 9 2 x 1 9 4 4 ] ^ { \nu } } } } \end{array}
```

$$

$$

```
\mathrm { n e d i a - c t 1 ~ - d ~ / d e v / m e d i a 0 ~ -- s e t - v 4 1 2 ~ } ^ { \prime \prime } { } ^ { \prime \prime } \mathrm { r k i s p 1 - i s p - s u b d e v ~ } ^ { p } : 0 [ \mathrm { f r u t : S B G G R 1 0 ~ 1 X 1 0 / 2 5 9 2 x 1 9 4 4 } ] ^ { \prime }
```

$$

$$

```
\mathrm { n e d i a \mathrm { - } c t 1 _ { d } \ \mathrm { / d e v / n e d i a 0 } \ \mathrm { - } s e t { - } v 4 1 2 _ { r } \mathrm { x } \mathrm { t i } s p 1 \mathrm { - } i s p \mathrm { - } s u b d e v } ^ { \sigma } : 0 [ \mathrm { c r o p } : ( 0 , 0 ) / 2 5 9 2 \mathrm { x } 1 9 4 4 ] ^ { \prime }
```

$$

media-ctl -d /dev/media0 --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10\_1X10/2592x1944]

media-ctl -d /dev/media0 --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/2592x1944]

v4l2-ctl -d /dev/video4 --set-ctrl 'exposure=1216,analogue\_gain=10' \

```javascript
--set-selection=target=crop,top=0,left=0,width=2592,height=1944 \
```

--set-fmt-video=width=2592,height=1944,pixelformat=SBGGR10 \

--stream-mmap=3 --stream-to=/tmp/mp.raw.out --stream-count=1 --stream-poll

需要注意的是，ISP 虽然不对 Raw 图处理，但它仍然会将 10bit 的数据低位补 0 成16bit。

不管 Sensor 输入的是 10bit/12bit， 最终上层得到的都是 16bit 每像素。

### 9.4 如何支持黑白摄像头

CIS 驱动需要将黑白 sensor 的输出 format 改为如下三种 format 之一，

$$

\mathrm &#123; M E D I A \_ B U S \_ F M T \_ Y 8 \_ 1 X 8 &#125; ( \mathrm &#123; s e n s o r 8 b i t \ &#125; \frac &#123; \not &#123; H &#125; \mathrm &#123; e &#125; &#125; &#123; \mathrm &#123; f &#125; \mathrm &#123; f &#125; \mathrm &#123; f &#125; \mathrm &#123; f &#125; &#125; \mathrm &#123; L &#125; )

$$

MEDIA\_BUS\_FMT\_Y10\_1X10 (sensor 10bit 输出)

即在函数 xxxx\_get\_fmt 和 xxxx\_enum\_mbus\_code 返回上述 format。

Rkisp驱动会对这三种 format进行特别设置，以支持获取黑白图像。

另外，如应用层需要获取Y8格式的图像，则只能使用SP Path，因为只有 SP Path可以支持Y8格式输出。

### 9.5 如何支持奇偶场合成

Rkisp1 驱动支持奇偶场合成功能，限制要求：

1.MIPI 接口： 支持输出 frame count number (from frame start and frame end shortpackets)，Rkisp1驱动以此来判断当前场的奇偶；

2. BT656 接口：支持输出标准 SAV/EAV，即 bit6 为有奇场偶场标记信息，rkisp1 驱动以此来判断当前场的奇偶；

3. rkisp1 驱动中 rkisp1\_selfpath video 设备节点具备该功能，其他 video 设备节点不具备该功能，app层误调用其他设备节点的话，驱动提示以下错误信息：

“only selfpath support interlaced”

rkisp1\_selfpath 信息可以 media-ctl -p 查看:

\- entity 3: rkisp1\_selfpath (1 pad, 1 link)

type Node subtype V4L flags 0

device node name /dev/video1

pad0: Sink

&lt;- "rkisp1-isp-subdev":2 [ENABLED]

设备驱动实现方式如下：

设备驱动 format.field 需要设置为 V4L2\_FIELD\_INTERLACED，表示此当前设备输出格式为奇偶场，即在函数 xxxx\_get\_fmt 返回 format.field 格式。可参考 driver/media/i2c/tc35874x.c驱动；

### 附录 A CIS 驱动 V4L2-controls 列表 1


| CID | 描述 |
| --- | --- |
| V4L2 CID VBLANK | Vertical blanking. The idle period after every frame duringwhich no image data is produced. The unit of verticalblanking is a line. Every line has length of the image widthplus horizontal blanking at the pixel rate defined byV4L2_CID_PIXEL_RATE control in the same sub-device. |
| V4L2_CID_HBLANK | Horizontal blanking. The idle period after every line ofimage data during which no image data is produced. The unitof horizontal blanking is pixels. |
| V4L2_CID_EXPOSURE | Determines the exposure time of the camera sensor. Theexposure time is limited by the frame interval. |
| V4L2 CID ANALOGUE GAIN | Analogue gain is gain affecting all colour components in thepixel matrix. The gain operation is performed in theanalogue domain before A/D conversion. |
| V4L2_CID_PIXEL_RATE | Pixel rate in the source pads of the subdev. This controlis read-only and its unit is pixels / second.Ex mipi bus:pixel_rate = link_freq * 2 * nr_of_lanes /bits per sample |
| V4L2_CID_LINK_FREQ | Data bus frequency. Together with the media bus pixel code,bus type (clock cycles per sample), the data bus frequencydefines the pixel rate (V4L2_CID_PIXEL_RATE) in the pixelarray (or possibly elsewhere, if the device is not an imagesensor). The frame rate can be calculated from the pixelclock, image width and height and horizontal and vertical |
|  | blanking. While the pixel rate control may be defined elsewhere than in the subdev containing the pixel array, the frame rate cannot be obtained from that information. This is because only on the pixel array it can be assumed that the vertical and horizontal blanking information is exact: no other blanking is allowed in the pixel array. The selection of frame rate is performed by selecting the |

### 附录 B MEDIA\_BUS\_FMT 表


| CIS sensor 类型 | Sensor 输出 format |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10 MEDIA BUS FMT SRGGB10 1X10 MEDIA BUS FMT SGBRG10 1X10 |
|  | MEDIA_BUS_FMT_SGRBG10_1X10 MEDIA_BUS_FMT_SRGGB12_1X12 MEDIA_BUS_FMT_SBGGR12_1X12 MEDIA_BUS_FMT_SGBRG12_1X12 |
|  | MEDIA_BUS_FMT_SGRBG12_1X12 MEDIA_BUS_FMT_SRGGB8_1X8 |
|  |  |
|  |  |
|  |  |
|  | MEDIA_BUS_FMT_SBGGR8_1X8 |
|  | MEDIA_BUS_FMT_SGBRG8_1X8 |
|  | MEDIA_BUS_FMT_SGRBG8_1X8 |
|  | MEDIA BUS FMT YVYU8 2X8 MEDIA_BUS_FMT_UYVY8_2X8 MEDIA_BUS_FMT_VYUY8_2X8 MEDIA_BUS_FMT_YUYV10_2X10 MEDIA_BUS_FMT_YVYU10_2X10 MEDIA_BUS_FMT_UYVY10_2X10 MEDIA_BUS_FMT_VYUY10_2X10 MEDIA_BUS_FMT_YUYV12_2X12 |
| On1y Y(黑白) 即 raw bw sensor | MEDIA_BUS_FMT_Y8_1X8 MEDIA_BUS_FMT_Y10_1X10 MEDIA_BUS_FMT_Y12_1X12 |

附录 C CIS 参考驱动列表


| CIS 数据接口 | CIS 输出数据 类型 | Frame/Field | 参考驱动 |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | frame | ov13850.c ov8858.c ov7750.c ov5695.c ov5648.c ov4689.c ov2735.c ov2718.c ov2685.c ov2680.c imx327.c imx317.c imx258.c |
|  |  |  | gc5025.c gc2385.c gc2355.c jx-h65 |
| MIPI | YUV | frame | gc2145.c |
| MIPI | RAW BW | frame | ov9281.c ov7251.c |
|  |  |  | sc132gs.c |
| MIPI | YUV | field | tc35874x.c |
| ITU.BT601 | Bayer RAW |  | imx323ar0230.c |
| ITU.BT601 | YUV |  | gc2145.cgc2155.cgc2035.cgc0329.cgc0312.cbf3925.c |
| ITU.BT601 | RAW BW |  |  |
| ITU.BT656 | Bayer RAW |  | imx323(可支持) |
|  |  |  |  |

### 附录 D VCM driver ic 参考驱动列表


| 参考驱动 |
| --- |
| vm149c.c |
| dw9714.c |
| fp5510.c |

##


| 参考驱动 |
| --- |
| sgm3784.c |
