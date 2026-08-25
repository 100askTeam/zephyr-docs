---
sidebar_position: 1
---

# Camera\_Engine\_Rkisp\_User\_Manual（ISP 部）

## 1. 文档适用说明

### 1.1 适用平台及系统


| 芯片平台 | 操作系统 | 支持情况 |
| --- | --- | --- |
| RK3399/RK3326/RK3288/RK3368 | android-9.0 | Y |
| RK3399/RK3326/RK3288/RK1808 | Linux(Kernel-4.4) | Y |
| RV1108 | Linux(Kernel-3.10) | N |

1. 2适用软件版本


| 软件类型 | 版本号 |
| --- | --- |
| camera_engine_rkisp | v2.0.0 |
|  |  |
|  |  |

## 2. Camera engine 基本框架



包括 core engine 库（librkisp.so）及 3A 库。Core engine 主体功能为获取驱动数据流，实现上层帧参数控制，如3A模式等，从ISP驱动获取3A统计，调用3A库实现3A调整。为上层主要提供的类接口为 DeviceMan-ager。librkisp\_ae.so，librkisp\_awb.so 及 librkisp\_af.so 为 RK 实现的3A库，实现为动态加载库，且有标准接口，用户如有需求，可实现自己的3A库进行替换。

### 2.3 Interface layer

在 engine 层基础上为 Android 及 Linux 封装了不同接口。Android 层不需要数据流部分，只需要3A控制部分，控制接口及说明请参考头文件rkisp\_control\_loop.h，该文件中对实现的接口以及基本调用流程都有详细说明及注释。libgstrkisp 是为gstreamer实现的插件，通过该插件，用户可通过gsreamer获取数据流以及控制3A。如用户有其他需求，可封装满足自己需求的接口层。

### 2.4 Application layer

应用层，目前有适配 Android 的 Camera Hal3 及 Linux 平台的gstreamer。

## 3. 源码目录结构

├── Android.mk\* // Android 编译 mk

├── build\_system/ // 移植的简易编译系统

├── ext/ // 引用的外部库，文件等

├── gstreamer/ // 基于 camera engine 实现的 gstreamer 插件 demo

├── interface/ // camera engine 提供给外部的接口实现

├── iqfiles/ // 已调试过的模组 iq 文件

├── Makefile // Linux 编译文件

├── metadata/ // 从 Android 移植，控制 3A 参数等

├── modules/ // 适配于xcore 框架的具体实现

├── plugins/ // 3A 库及头文件

├── productConfigs.mk // 编译配置文件

rkisp/ // 3A 库接口层，连接 xcore 框架及 3A 库  

tests/ // demo 程序  

update\*  

update\_header\* // 更新 Linux 版本 3A 库  

update\_header\_android\* // 更新 Android 版本 3A 库  

xcore/ // camera engine 框架，移植自 intel 开源项目

## 4. API 简要说明

Camera engine 主要提供 3A 功能，3A 功能主要

由 interace/rkisp\_control\_loop.h 文件提供，以下主要介绍该文件相关接口。

### 4.1 Control loop API

接口在 rkisp\_control\_loop.h 中已有详细说明，此外，在

tests/rkisp\_demo.cpp 中有 3A 接口的使用示例，这里简要说明如下：

#### 4.1.1 rkisp\_cl\_init

[描述]

初始化 control loop。

[语法]

```c
int rkisp_cl_init(void** cl_ctx, const char* tuning_file_path, const cl_result_callback_ops_t *callback_ops);

[参数]
```


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| cl_ctx | 成功返回 control loop context | 输出 |
| tuning_file_path | RAW sensor 使用的 tunning xml 文件，engine v2.0.0开始已不需要提供该文件，engine中自动选择 | 输入 |
| callback_ops | 接收 result metadata 的回调，提供该回调后，该回调函数每一帧都会被执行一次，返回帧对应的统计信息、所应用的参数及3A状态等。 |  |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

#### 4.1.2 rkisp\_cl\_prepare

[描述]

prepare control loop。

[语法]

int rkisp\_cl\_prepare(void\* cl\_ctx,

```javascript
const struct rkisp_cl_prepare_params_s* prepare_params);

[参数]
```


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| cl_ctx | control loop context | 输入 |
| prepare_params | 所需控制的设备路径集 | 输入 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

#### 4.1.3 rkisp\_cl\_start

[描述]

start control loop，调用成功后 control loop 开始运行，3A 开始工作。

[语法]

int rkisp\_cl\_start(void\* cl\_ctx)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| cl_ctx | control loop context | 输入 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

#### 4.1.4 rkisp\_cl\_stop

[描述]

stop control loop

[语法]

int rkisp\_cl\_stop(void\* cl\_ctx)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| cl_ctx | control loop context | 输入 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

#### 4.1.5 rkisp\_cl\_deinit

[描述]   

反初始化 control loop   

[语法]   

void rkisp\_cl\_deinit(void\* cl\_ctx)

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| cl_ctx | control loop context | 输入 |

#### 4.1.6 rkisp\_cl\_set\_frame\_params

[描述]

设置新的帧参数，主要包括3A模式等

[语法]

[参数]


| 参数名称 | 描述 | 输入输出 |
| --- | --- | --- |
| cl_ctx | control loop context | 输入 |
| frame_params | 新的帧参数 | 输入 |

[返回值]


| 返回值 | 描述 |
| --- | --- |
| 0 | 成功 |
| 非0 | 失败 |

[注意]

参数结构体直接使用 Android 的 camera\_metadata\_t 结构，可设置的参数请参考 camera\_metadata\_doc.html，用户可根据该文档描述进行参数设置。tests/rkisp\_demo.cpp 提供了一些基本参数的设置及获取示例。

#### 4.1.7 设置 metadata 基本步骤

1）包含如下头文件：

CameraMetadata.h：包含了 CameraMetadata 类，该类封装了camera\_metadata\_t 结构体，使得 metadata 管理更加方便rkcamera\_vendor\_tags.h:包含了 RK 的自定义 metadata。

### 2）初始化 metadata

提供一些camera的基础能力信息，如支持的3A模式，最大曝光时间，支持的帧率范围，支持的分辨率等等。初始化metadata信息需要在rkisp\_cl\_prepare 时传入。初始化 metadata 示例代码如下：




| TAG 名称 | 描述 |
| --- | --- |
| ANDROID_CONTROL_AE_LOCK | Lock 住 ae |
| ANDROID CONTROL AE MODE | 支持 on/off，off 时为 manual 模式，可设置手动曝光参数 |
| ANDROID CONTROL AE REGIONS | ae的测光区域 |
| ANDROID CONTROL AE TARGET FPS RANGE | 帧率范围，上限值等于下限值时代表固定帧率 |
| ANDROID SENSOR INFO EXPOSURE TIME RANGE | 定义曝光时间范围 |
| ANDROID SENSOR INFO SENSITIVITY RANGE | 定义曝光增益范围 |
| ANDROID_CONTROL_AE_STATE | 获取当前 ae 状态 |
| ANDROID CONTROL AWB MODE | 支持off/auto/INCANDESCENT/FLUORESCENT/DAYLIGHT/CLOUDY DAYLIGHT |
| ANDROID CONTROL AWB REGIONS | Awb 统计窗口 |
| ANDROID CONTROL AWB STATE | 获取当前 awb 状态 |
| ANDROID CONTROL AF MODE | 支持 OFF/AUTO/CONTINUOUS PICTURE |
| ANDROID CONTROL AF REGIONS | af 统计窗口 |
| ANDROID CONTROL AF TRIGGER | 主动触发 af 对焦 |
| ANDROID CONTROL AF STATE | 获取 af 状态 |
| ANDROID SENSOR SENSITIVITY | 设置手动曝光时的增益及反馈当前曝光增益 |
| ANDROID SENSOR EXPOSURE TIME | 设置手动曝光时的时长及反馈当前曝光时长 |
| RKCAMERA3 PRIVATEDATA EFFECTIVE DRIVER_FRAME_ID | 反馈的当前帧metada对应的帧id，与数据帧id做对应后，可做到帧与生效参数的对应 |
| RKCAMERA3 PRIVATEDATA FRAME SOF TIMESTAMP | 当前帧的开始传输时刻，减去曝光时间可知当前帧的起始曝光时刻 |

## 5. IQ 效果文件相关

### 5.1 IQ文件名定义规则

IQ 文件放置于iqfiles文件夹，文件名定义需要遵循以下规则：

&lt;sensor 名称&gt;\_&lt;模组名称&gt;\_&lt;lens 名称&gt;.xml

上述信息需要与内核中dts文件里定义的相一致。否则，camera engine将找不到对应的iq文件。

注：如果 sensor 连接到 preisp(即 RK1608)，再连接到 AP ISP，那么&lt;sensor名称&gt; 后面需要加上后缀 “ -preisp”，即：

&lt;sensor 名称&gt;-preisp\_&lt;模组名称&gt;\_&lt;lens 名称&gt;.xml

### 5.2 IQ 版本校验机制

Engine v2.0.0 引入 IQ xml 强校验机制，校验使用的 IQ xml 是否与 engine 库版本相匹配。校验机制会检测xml文件中每个tag的定义是否与当前engine库版本匹配。因此，只修改xml中版本号等非正常方式升级xml是可能会出现错误的。

如果使用的iq xml版本错误，将导致校验失败，camera应用会退出，搜索 log会有类似 如下的 calibtags 的 assert 错误：



### 5.3 calibdb 及 IQ xml 文件版本号

calibdb为 iq xml 解析器，解析器中包含了对应iq xml版本的模板定义。每个版本的模板都会定义一个版本号（version number）及版本特征码（magicversion code），版本号为字符串，格式如“v1.0.0”，iq xml 中定义的解析器版本号需要与之一致；版本特征码根据具体iq版本模板生成，用于标识iq版本唯一性，用一个32位数据表示，后续iq tuning tool 可根据该特征码为具体sensor生成对应版本的iq文件。

版本号及特帧码可通过如下方式获取：

（1）通过log确认，有类似如下信息：



### （2）通过源码确认：

rkisp/ia-engine/calib\_xml/calibdb.cpp 中有版本信息



## 6. camera\_engine 使用与调试

### 6.1 Android 平台使用

#### 6.1.1 编译

1. 将 camera engine 源码放至 &lt;android 工程根目录&gt;/hardware/rockchip/2. 工程编译环境设置好后，camera engine 源码目录执行 mm 编译编译后生成 librkisp.so, 3A 库不提供源码，随工程提供编好的库在plugins/rkiq/&lt;aec/af/awb&gt;/&lt;lib32/lib64&gt;

### 6.2 Android 平台调试

#### 6.2.1 log 开关

setprop persist.vendor.rkisp.log &lt;level&gt;

level：

0: error level, defalut level

1: warning level

2: info level

3: verbose level

#### 6.2.2 更新库

android 8.x 及以上库路径：

librkisp : /vendor/lib&lt;64&gt;   

3a: /vendor/lib&lt;64&gt;/rkisp/&lt;ae/awb/af&gt;/   

iq: /vendor/etc/camera/rkisp/   

更新库后重启camera服务：   

pkill provider && pkill camera

android 7.x 及以下库路径：

librkisp: /system/lib&lt;64&gt;/

3a: /system/lib&lt;64&gt;/rkisp/&lt;ae/awb/af&gt;/

iq: /system/etc/camera/rkisp/

更新库后重启camera服务：

pkill camera\*

### 6.3 Linux 平台使用

#### 6.3.1 编译

### (1) 配置 productConfigs.mk

配置编译工具链路径： CROSS\_COMPILE，如果使用的是linux sdk工程则不需要该步骤。

### (2) 编译

可通过 ARCH=arm 或者 aarch64 来指定编译 32 位或者 64 位库

32 bit 编译：

make ARCH= arm

64 bit 编译：

make ARCH=aarch64

编译成功后库文件生成在camera engine工程目录 build文件夹下。3A库不提供源码，随工程提供编好的库在 plugins/rkiq/&lt;aec/af/awb&gt;/&lt;lib32/lib64&gt;

#### 6.3.2 log 开关

```
export persist_camera_engine_log=<level>
```

level：   

0: error level, defalut level   

1: warning level   

2: info level   

3: verbose level

#### 6.3.3 库及 IQ 文件

### （1）库文件

camera\_engine\_rkisp 需要将 5 个库文件 push 到板子里。

1) librkisp.so push 到板子的/usr/lib/

2) librkisp\_aec.so push 到板子的/usr/lib/rkisp/ae/

3) librkisp\_awb.so push 到板子的/usr/lib/rkisp/awb/

4) librkisp\_af.so push 到板子的/usr/lib/rkisp/af/

5) libgstrkisp.so push 到板子的/usr/lib/gstreamer-1.0/

注：若不使用 gstreamer 可以不用 push libgstrkisp.so)

在buildroot系统中，已自动将全部的库拷贝到系统中，

buildroot/package/rockchip/camera\_engine\_rkisp/camera\_engine\_rkisp.mk如下图：



图 6.3.3-1

### （2） IQ 文件

在 SDK 工程目录中，在 etc/external/camera\_engine\_rkisp/iqfiles 目录下统一存放IQ文件。如果需要加入新的IQ文件，就放在此目录下，并且IQ名字规范参照前述 iq文件定义 章节，然后删除以下目

录 buildroot/output/rockchip\_rkxxxx\_xx/build/camera\_engine\_rkisp-1.0，最后重新编译 buildroot。

在 buildroot 系统中，IQ 文件会统一拷贝到板子的/etc/iqfiles/目录下，如图6.3.3-2。(buildroot/package/rockchip/camera\_engine\_rkisp/camera\_engine\_rkisp.mk)



图 6.3.3-2

当系统启动后，会运行/etc/init.d/S50set\_pipeline start，这里会匹配当前连接的 sensor，如图 6.3.3-3 所示，



图 6.3.3-3

通过名字找到/etc/iqfiles/目录下匹配的 xml 文件，链接成/etc/cam\_iq.xml，如图 6.3.3-4 所示，当前 cam\_iq.xml 链接的是 OV5695.xml。



图 6.3.3-4

注意： camera engine v1.9.0 版本后，iq 文件已不可由外部传入，camera engine中根据从sensor驱动查询到的信息自动进行iq文件匹配。

### 6.4 Linux 平台集成 camera engine 方法

Camera\_engine\_rkisp 使用方式有两种：1、通过 gstreamer ，2、V4L2 应用编程。

#### 6.4.1 通过 gstreamer

Camera\_engine\_rkisp 的使用通过以 plugin 的形式通过 gst-launch-1.0 实现。测试前我们需要指明动态库的路径：

通过以下命令可以测试

gst-launch-1.0 rkisp device=/dev/video1 io-mode=1 analyzer=1 enable-  

3a=1 path-iqf=/etc/cam\_iq.xml ! video/x  

raw,format=NV12,width=640,height=480, framerate=30/1 ! videoconvert !   

autovideosink

若没有显示设备，需要dump图像，可以将以上命令‘autovideosink’修改为filesink location=/tmp/streamer.yuv’，最后通过 yuv 工具预览。

Buildroot 中可以直接使用 camera\_rkisp.sh 测试。

#### 6.4.2 通过 v4l2 应用编程

我们提供了 rkisp\_demo 供客户参考测试。如图 6.4.2-1 代码在工程的 tests/下rkisp\_dmeo 随工程生成在目录 build/bin/

图 6.4.2-1  



Buildroot 系统中，已经将 rkisp\_dmeo 拷贝到/usr/bin/下(buildroot/package/rockchip/camera\_engine\_rkisp/camera\_engine\_rkisp.mk)



图 6.4.2-2

使用方法：如图 6.4.2-3，可以通过 rkisp\_demo -h 查看，最后会在指定的 ouput目录下生成图像数据，再通过yuv工具预览。



图 6.4.2-3

## 7. RK1608 适配调试

### 7.1 设备驱动调试

参考《RKISP\_Driver\_User\_Manual\_v1.2》驱动调试文档 bringup rk1608，与普通sensor调试类似。

RK1608可以实现不同的算法，不同的算法对应不同的RK1608固件，固件的在工程中的存储路径如下:

hardware/rockchip/camera/etc/firmware/

目前支持的固件列表如下：


| 固件名称 | 描述 |
| --- | --- |
| fw_rk1608_bypass.rkl | Rk1608 bypass 固件，RK1608 输入数据不做任何处理，bypass 直接输出。这边的bypass指的是mipi csi rx 直接 bypass 到 mipi csi tx，数据都未进入 RK1608 端 ddr; |
| fw_rk1608_ov2718_2frame.rk1 | RK1608 集成 ov2718 DCG HDR 算法； |
|  |  |

生效固件的配置方式，详见《RKISP\_Driver\_User\_Manual\_v1.2》文档中第6.3 章节：Rk1608 AP 设备注册(DTS) ，firmware-names.

### 7.2 HAL 层数据流调试

设备驱动调试成功后可进行HAL调试，可参考HAL3调试文档。

1. 配置 camera3\_profiles.xml 文件

hardware/rockchip/camera/camera\_etc.mk：配置 HAL3 加载哪个 profile；  

hardware/rockchip/camera /camera3\_profiles\_rk3399\_1608.xml：RK1608 配  

置 camera3\_profiles.xml 参考配置文件；具体参见 HAL 配置文档  

《camera\_hal3\_user\_manual\_v2.1》。

2. 配置为SOC类型调试数据流

camera3\_profiles\_xxx.xml 文件中&lt;sensorType value=""/&gt;配置成：  

&lt;sensorType value="SENSOR\_TYPE\_SOC"/&gt;。

该配置将决定不启动 camera\_engine，即 3A 控制 bypass；

3.配置 RK1608 采用 bypass 固件

### 7.3 camera\_engine 3A 调试

HAL层预览调试成功后可进行3A效果调试，建议步骤如下：

1. 配置为 RAW 类型使能 camera\_engine

camera3\_profiles\_xxx.xml 文件中&lt;sensorType value=""/&gt;配置成：&lt;sensorType value="SENSOR\_TYPE\_RAW"/&gt;。

2.如果RK1608固件集成的算法会影响3A，建议配置该模组对应的IQ文件，关闭其相应功能来调试基础3A

模组对应的IQ文件，规则参考：5.1 IQ文件名定义规则

举例：

RK1608 实现 HDR 算法，该算法会影响 AP 端 ISP AE，建议将 IQ 文件中的 HDR AE功能功能关闭

IQ 文件：HdrCtrl 项中：

```
enable = 0: 关闭 HDR AE, 采用线性(Linear)AE;

enable = 1：使能 HDR AE;
```

## 8. FAQ

### 8.1 共性 FAQ

#### 8.1.1 如何获取版本号

方式一：

查看 engine 工程 git log，有类似如下信息：



### 方式二：

查看engine源码，各库版本信息文件路径如下：

librkisp.so: &lt;engine project&gt;/interface/rkisp\_dev\_manager.h

librkisp\_af.so: &lt;engine project&gt;/plugins/3a/rkiq/af/af.h

librkisp\_aec.so: &lt;engine project&gt;/plugins/3a/rkiq/ae/aec.h

librkisp\_awb.so: &lt;engine project&gt;/plugins/3a/rkiq/awb/awb.h

### 方式三：

查看 log。打开 log 开关后，执行以下命令：

（1）pkill provider && pkill camera

（2）然后打开camera应用

（3）logcat | grep version -i，输出如下：

#### 8.1.2 集成 camera\_engine 后,3A 并没有自动调整

A：打开log开关，查找进入应用时的log，

"failed to get iq file name"   

"load tunning file failed"

以上错误信息代表IQ文件未找到或者解析IQ文件时出错，需要检查IQ文件名是否与内核dts中定义的信息一致；

#### 8.1.3 rkisp\_cl\_prepare 未执行完成程序就 crash

A：1.camera\_engine\_rkisp v2.0.0 之前的版本，IQ 文件与 camera\_engine 集成的calidb的匹配失败会出现该问题，v2.0.0之后IQ文件增加了版本校验机制，详见：5.2 IQ版本校验机制

2.其他因素

### 8.2 Android FAQ

#### 8.2.1 Android 系统中 LOGV 打印不出来

A：建议更新至 camera\_engine\_rkisp：v1.9.0 及其以上版本

8.3 Linux FAQ

#### 8.3.1 修改部分源码后，直接编译 camera\_engine 代码，生成的 librkisp.so 中未生效

A: 修改非interface文件夹中代码时，建议执行以下步骤：#make clean && make

#### 8.3.2 media get entity by name：rkisp1\_xxx is null



A：/dev/videoX 设备节点没有指定正确

8.3.3 Failed to load plugin ‘\*\*\*libgstrkisp.so’:libgstvideo4linux2.so



A:动态链接库路径没有配置，例如：export LD\_LIBRARY\_PATH=\$LD\_LIBRARY\_PATH:/usr/lib/gstreamer-1.0
