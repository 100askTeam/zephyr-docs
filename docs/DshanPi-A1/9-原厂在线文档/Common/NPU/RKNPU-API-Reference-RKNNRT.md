---
sidebar_position: 1
---

# RKNN C API 参考手册

### （图形计算平台中心）

### 更新记录

### 3.1 RKNN C API 头文件

1. “rknn\_api.h”定义部署 RKNN模型的基础接口和数据结构。

2. “rknn\_matmul\_api.h”定义矩阵乘法接口。

3. “rknn\_custom\_op.h”定义用户自定义算子接口。

### 3.2 Linux 平台 RKNPU 运行时库

1. 对 于 RK3576、 RK3566 系 列、 RK3568 系 列、 RK3588 系 列、 RK3562 硬 件平 台，RKNPU 运 行 时 库 文 件 为 &lt;sdk\_path&gt;/rknpu2/runtime 目 录 下 的 librknnrt.so ， 其 中&lt;sdk\_path&gt;是瑞芯微 NPU 软件开发包的路径。

### 3.3 Android 平台 RKNPU 运行时库

Android 平台有两种方式来调用 RKNN C API：

1） 应用直接链接 librknnrt.so。

2） 应用链接 Android 平台 HIDL 实现的 librknn\_api\_android.so。

对 于 使 用 Android HIDL 实 现 的 RKNN API 的 代 码 位 于RK3576/RK3588/RK3562/RK3566/RK3568 Android 系 统 SDK 的vendor/rockchip/hardware/interfaces/neuralnetworks 目录下。当完成 Android 系统编译后，将会生成RKNPU 相关的一系列库文件（对于应用开发只需要链接使用 librknn\_api\_android.so即可），如下所示：

/vendor/lib/librknn\_api\_android.so

/vendor/lib/librknnhal\_bridge.rockchip.so

/vendor/lib64/librknn\_api\_android.so

/vendor/lib64/librknnhal\_bridge.rockchip.so

/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so

/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so

/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so

/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service

也可以使用如下命令单独重新编译生成以上的库文件：

mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8



## 4 RKNN C API 说明

### 4.1 各个硬件平台的CAPI支持情况

表 4-1 各个硬件平台的 RKNN CAPI接口支持情况


|  | RKNN C API | RK3562/RK3566/RK3568 | RK3588/RK3576 | RV1106/RV1103 |
| --- | --- | --- | --- | --- |
| 1 | rknn init | $\surd$ | $\surd$ | $\surd$ |
| 2 | rknn set core mask | X | $\surd$ | X |
| 3 | rknn_dup_context | $\surd$ | $\surd$ | X |
| 4 | rknn destroy | $\surd$ | $\surd$ | $\surd$ |
| 5 | rknn_query | $\surd$ | $\surd$ | $\surd$ |
| 6 | rknn_inputs_set | $\surd$ | $\surd$ | $\times$ |
| 7 | rknn run | $\surd$ | $\surd$ | $\surd$ |
| 8 | rknn wait | $\times$ | $\times$ | X |
| 9 | rknn outputs get | $\surd$ | $\surd$ | $\times$ |
| 10 | rknn outputs release | $\surd$ | $\surd$ | $\surd$ |
| 11 | rknn create mem from mb blk | $\times$ |  | $\times$ |
| 12 | rknn create mem from phys | $\surd$ | $\surd$ | $\surd$ |
| 13 | rknn create mem from fd | $\surd$ | $\surd$ | $\surd$ |
| 14 | rknn_create mem | $\surd$ | $\surd$ | $\surd$ |
| 15 | rknn_destroy_mem | $\surd$ | $\surd$ | $\surd$ |
| 16 | rknn_set_weight_mem | $\surd$ | $\surd$ | $\surd$ |
| 17 | rknn set internal mem | $\surd$ | $\surd$ | $\surd$ |
| 18 | rknn set io mem | $\surd$ | $\surd$ | $\surd$ |
| 19 | rknn_set_input_shapes | $\surd$ | $\surd$ | X |
| 20 | rknn mem sync | $\surd$ | $\surd$ | $\surd$ |
| 21 | rknn matmul create | $\surd$ | $\surd$ | X |
| 22 | rknn matmul set io mem | $\surd$ | $\surd$ | X |
| 23 | rknn matmul set core mask | $\times$ | $\surd$ | X |
| 24 | rknn matmul run | $\surd$ | $\surd$ | × |
| 25 | rknn matmul destroy | $\surd$ | $\surd$ | X |
| 26 | rknn_register_custom_ops | $\surd$ | $\surd$ | X |
| 27 | rknn custom op get op attr | $\surd$ | $\surd$ | X |
| 28 | rknn set batch core num | $\times$ | $\surd$ | × |
| 29 | rknn matmul set quant params | $\surd$ | $\surd$ | X |
| 30 | rknn matmul get quant params | $\surd$ | $\surd$ | × |
| 31 | rknn matmul create dyn shape | $\surd$ | $\surd$ | X |
| 32 | rknn matmul set dynamic shape | $\surd$ | $\surd$ | X |
| 33 | rknn B normal layout to native layout | $\surd$ | $\surd$ | X |

各个硬件平台使用 rknn\_query 函数支持的查询参数如表 4-2所示：

表 4-2 各个硬件平台 rknn\_query函数支持的查询参数


|  | rknn_query 参数 | RK3562/RK3566/RK3568 | RK3576/RK3588 | RV1106/RV1103 |
| --- | --- | --- | --- | --- |
| 1 | RKNN QUERY IN OUT NUM | $\surd$ | √ | √ |
| 2 | RKNN QUERY INPUT ATTR | $\surd$ | √ | √ |
| 3 | RKNN QUERY OUTPUT ATTR | $\surd$ | √ | √ |
| 4 | RKNN QUERY PERF DETAIL | $\surd$ | √ | X |
| 5 | RKNN QUERY PERF RUN | $\surd$ | √ | X |
| 6 | RKNN QUERY SDK VERSION | $\surd$ | √ | √ |
| 7 | RKNN QUERY MEM SIZE | $\surd$ | √ | √ |
| 8 | RKNN QUERY CUSTOM STRING | $\surd$ | M | 7 |
| 9 | RKNN QUERY NATIVE INPUT ATTR | $\surd$ |  | √ |
| 10 | RKNN QUERY NATIVE OUTPUT ATTR | $\surd$ | √ | √ |
| 11 | RKNN QUERY NATIVE NC1HWC2 INPUT ATTR | $\surd$ | $\surd$ | √ |
| 12 | RKNN QUERY NATIVE NC1HWC2 OUTPUT ATTR | $\surd$ |  | √ |
| 13 | RKNN QUERY NATIVE NHWC INPUT ATTR | $\surd$ | √ | √ |
| 14 | RKNN QUERY NATIVE NHWC OUTPUT ATTR | $\surd$ | √ | √ |
| 15 | RKNN QUERY INPUT DYNAMIC RANGE | $\surd$ | $\surd$ | X |
| 16 | RKNN QUERY CURRENT INPUT ATTR | $\surd$ C | $\surd$ | X |
| 17 | RKNN QUERY CURRENT OUTPUT ATTR | 1     $\surd$ | $\surd$ | X |
| 18 | RKNN QUERY CURRENT NATIVE INPUT ATTR | $\surd$ | √ | X |
| 19 | RKNN QUERY CURRENT NATIVE OUTPUT ATTR | $\surd$ | $\surd$ | X |

### 4.2 基础数据结构定义

#### 4.2.1 rknn\_sdk\_version

结构体 rknn\_sdk\_version 用来表示 RKNN SDK 的版本信息，结构体的定义如下：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| api_version | char[] | SDK 的版本信息。 |
| drv_version | char[] | 1SDK所基于的驱动版本信息 |

#### 4.2.2 rknn\_input\_output\_num

结构体 rknn\_input\_output\_num 表示输入输出 tensor 个数，其结构体成员变量如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| n_input | uint32_t | 输入 tensor 个数。 |
| n_output | uint32_t | 输出 tensor 个数。 |

#### 4.2.3 rknn\_input\_range


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| index | uint32_t | 表示该形状对应输入的索引位置。 |
| shape_number | uint32_t | 表示RKNN模型支持的输入形状个数。 |
| 7 fmt | rknn_tensor_format | 表示形状对应的数据布局格式。 |
| name | char[] | 表示输入的名称。 |
| dyn_range | uint32_t[][] | 表示输入形状列表，它是包含多个形状数组的二维数组，形状优先存储。 |
| n_dims | uint32_t | 表示每个形状数组的有效维度个数。 |

#### 4.2.4 rknn\_tensor\_attr

结构体 rknn\_tensor\_attr表示模型的 tensor的属性，结构体的定义如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| index | uint32_t | 表示输入输出 tensor 的索引位置。 |
| n_dims | uint32_t | Tensor 维度个数。 |
| dims | uint32_t[] | Tensor 各维度值。 |
| name | char[] | Tensor 名称。 |
| n_elems | uint32_t | Tensor数据元素个数。 |
| size | uint32_t | Tensor数据所占内存大小。 |
| fmt | rknn_tensor_format | Tensor维度的格式，有以下格式：RKNN TENSOR NCHWRKNN TENSOR NHWCRKNN_TENSOR_NC1HWC2RKNN_TENSOR_UNDEFINED |
| type | rknn_tensor_type | Tensor数据类型，有以下数据类型：RKNN TENSOR FLOAT32RKNN TENSOR FLOAT16RKNN_TENSOR_INT8RKNN TENSOR UINT8RKNN TENSOR INT16RKNN TENSOR UINT16RKNN TENSOR INT32RKNN_TENSOR_INT64RKNN_TENSOR_BOOL |
| qnt_type | rknn_tensor_qnt_type | Tensor量化类型，有以下的量化类型：RKNN_TENSOR_QNT_NONE：未量化;RKNN_TENSOR_QNT_DFP：动态定点量化；RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC：非对称量化。 |
| fl | int8_t | RKNN TENSOR QNT DFP 量化类型的参数。 |
| scale | float | RKNN TENSOR QNT AFFINE ASYMMETRIC量化类型的参数。 |
| w_stride | uint32_t | 实际存储一行图像数据的像素数目，等于一行的有效数据像素数目+为硬件快速跨越到下一行而补齐的一些无效像素数目，单位是像素。 |
| size_with_stride | uint32_t | 实际存储图像数据所占的存储空间的大小（包括了补齐的无效像素的存储空间大小）。 |
| pass_through | uint8_t | 0表示未转换的数据，1表示转换后的数据，转换包括归一化和量化。 |
| h_stride | uint32_t | 仅用于多batch输入场景，且该值由用户设置。目的是 NPU正确地读取每 batch数据的起始地址，它等于原始模型的输入高度+跨越下一列而补齐的无效像素数目。如果设置成0，表示与原 |

#### 4.2.5 rknn\_perf\_detail


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| perf_data | char*  AO1 | 性能详情包含网络每层运行时间，能够直接打印出来查看。 |
| data_len | 7 uint64_t | 存放性能详情的字符串数组的长度。 |

#### 4.2.6 rknn\_perf\_run


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| run_duration | int64_t | 网络总体运行（不包含设置输入/输出）时间，单位是微秒。 |

#### 4.2.7 rknn\_mem\_size

结构体 rknn\_mem\_size 表示初始化模型时的内存分配情况，结构体的定义如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| total_weight_size | uint32_t | 模型的权重占用的内存大小。 |
| total_internal_size | uint32_t | 模型的中间 tensor 占用的内存大小。 |
| total dma allocated size | uint64_t | 模型申请的所有dma内存之和。 |
| total_sram_size | uint32_t | 只针对RK3588有效，为NPU预留的系统SRAM大小（具体使用方式参考《RK3588_NPU_SRAM_usage.md》)。 |
| free sram size | uint32_t | 只针对 RK3588有效，当前可用的空闲 SRAM大小（具体使用方式参考 |
| reserved[12] | uint32_t | 预留。 |

#### 4.2.8 rknn\_tensor\_mem

结构体 rknn\_tensor\_mem表示 tensor的内存信息。结构体的定义如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| virt_addr | void* | 该 tensor 的虚拟地址 |
| phys_addr | uint64_t | 该 tensor 的物理地址。 |
| fd | int32_t | 该 tensor 的文件描述符。 |
| offset | int32_t | 相较于文件描述符和虚拟地址的偏移量。 |
| size | uint32_t | 该 tensor 占用的内存大小。 |
| flags | uint32_t | rknn_tensor_mem的标志位，有以下标志：RKNN_TENSOR_MEMORY_FALGS_ALLOC_INSIDE:表明 rknn_tensor_mem 结构体由运行时创建；RKNN_TENSOR_MEMORY_FLAGS_FROM_FD:表明 rknn_tensor_mem 结构体由 fd 构造；RKNN_TENSOR_MEMORY_FLAGS_FROM_ PHYS:表明 rknn_tensor_mem 结构体由物理地址构造；用户不用关注该标志。 |
| priv_data | void* | 内存的私有数据。 |

#### 4.2.9 rknn\_input


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| index | uint32_t | 该输入的索引位置。 |
| buf | void* | 输入数据的指针。 |
| size | uint32_t | 输入数据所占内存大小。 |
| pass_through | uint8_t | 设置为1时会将buf存放的输入数据直接设置给 |
| type | rknn_tensor_type | 7输入数据的类型。 |
| fmt | rknn_tensor_format | 输入数据的格式。 |

#### 4.2.10 rknn\_output


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| want_float | uint8_t   7 | 标识是否需要将输出数据转为float类型输出，该字段由用户设置。 |
| is_prealloc | uint8_t | 标识存放输出数据是否是预分配，该字段由用户设置。 |
| index | uint32_t | 该输出的索引位置，该字段由用户设置。 |
| buf | void* | 输出数据的指针，该字段由接口返回。 |
| size | uint32_t | 输出数据所占内存大小，该字段由接口返回。 |

#### 4.2.11 rknn\_init\_extend


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| ctx | rknn_context | 已初始化的 rknn context 对象。 |
| real model offset | int32_t | 真正rknn模型在文件中的偏移，只有以文件路径为参数初始化时才生效。 |
| real_model_size | uint32_t | 真正 rknn模型在文件中的大小，只有以文件路径为参数初始化时才生效。 |
| reserved | uint8_t[120] | 预留数据位。 |

#### 4.2.12 rknn\_run\_extend


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| frame_id | uint64_t | 表示当前推理的帧序号。 |
| non_block | int32_t | 0表示阻塞模式，1表示非阻塞模式，非阻塞即rknn run 调用直接返回。 |
| timeout_ms | int32_t | 推理超时的上限，单位毫秒。 |
| fence_fd | int32_t | 用于非阻塞执行推理，暂不支持。 |

#### 4.2.13 rknn\_output\_extend


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| frame_id | int32_t | 输出结果的帧序号。 |

#### 4.2.14 rknn\_custom\_string


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| string | char[] | 用户自定义字符串。 |



### 4.3 基础 API 说明

#### 4.3.1 rknn\_init


| API | rknn_init |
| --- | --- |
| 功能 | 初始化 rknn 上下文。 |
| 参数 | rknn context *context: rknn context 指针。 |
| void *model：RKNN 模型的二进制数据或者 RKNN模型路径。当参数 size 大于0时，model表示二进制数据；当参数 size 等于 0时，model表示 RKNN模型路径。 |  |
| uint32 t size：当model是二进制数据，表示模型大小，当model是路径，则设置为1         0。 |  |
| uint32 t flag：初始化标志，默认初始化行为需要设置为0。 |  |
| rknn init extend：特定初始化时的扩展信息。没有使用，传入NULL即可。如果需要共享模型 weight 内存，则需要传入另个模型 rknn context 指针。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

各个初始化标志说明如下：

RKNN\_FLAG\_COLLECT\_PERF\_MASK：用于运行时查询网络各层时间；

1）所有内存均是用户自行分配，便于对整个系统内存进行统筹安排。

2）用于内存复用，特别是针对 RV1103/RV1106这种内存极为紧张的情况。

rknn\_context ctx\_a, ctx\_b;

max\_internal\_size = MAX(mem\_size\_a.total\_internal\_size, mem\_size\_b.total\_internal\_size);   

internal\_mem\_max = rknn\_create\_mem(ctx\_a, max\_internal\_size);

RKNN\_FLAG\_SHARE\_WEIGHT\_MEM：用于共享另一个模型的 weight 权重。主要用于模拟不定长度模型输入（RKNPU运行时库版本大于等于 1.5.0后该功能被动态 shape功能替代）。比如对于某些语音模型，输入长度不定，但由于 NPU无法支持不定长输入，因此需要生成几个不同分辨率的 RKNN模，其中 型的保留完整权重，其他 RKNN模型不带权重。在初始化不带权重 RKNN模型时，使用该标志能让当前上下文共享完整 RKNN模型的权重。假设需要分辨率 A、B两个模型，则使用流程如下：

1）使用 RKNN-Toolkit2 生成分辨率 A 的模型。

3）在板子上，正常初始化模型 A。

4）通过 RKNN\_FLAG\_SHARE\_WEIGHT\_MEM 的 flags 初始化模型 B。

5）其他按照原来的方式使用。板端参考代码如下：

rknn\_context ctx\_a, ctx\_b;   

rknn\_init(&ctx\_a, model\_path\_a, 0, 0, NULL);   

rknn\_init\_extend extend;   

extend.ctx = ctx\_a;   

rknn\_init(&ctx\_b, model\_path\_b, 0, RKNN\_FLAG\_SHARE\_WEIGHT\_MEM, &extend);

RKNN\_FLAG\_COLLECT\_MODEL\_INFO\_ONLY：用于初始化一个空上下文，仅用于调用

rknn\_query 接口查询模型 weight 内存总大小和中间 tensor 总大小，无法进行推理；

RKNN\_FLAG\_ENABLE\_SRAM: 表示中间 tensor 内存尽可能分配在 SRAM 上；

RKNN\_FLAG\_DISABLE\_FLUSH\_OUTPUT\_MEM\_CACHE ： runtime 不 主 动 清 除 输 出tensor 缓存。此时用户不能直接访问 output\_mem-&gt;virt\_addr，这会导致缓存一致性问题。 如果用户 想 使 用 必 须 使 用 rknn\_mem\_sync (ctx, mem,RKNN\_MEMORY\_SYNC\_FROM\_DEVICE) 来刷新缓存。该标志一般在 NPU 的输出数据不被CPU 访问时使用，比如输出数据由 GPU 或 RGA 访问以减少刷新缓存所需的时间。

#### 4.3.2 rknn\_set\_core\_mask


| API | rknn_set_core_mask |
| --- | --- |
| 功能 | 设置运行的NPU核心。 |
| 参数 | rknn_context context: rknn_context 对象。 |
| rknn_core_mask core_mask：NPU核心的枚举类型，目前有如下方式配置： |  |
|  | RKNN_NPU_CORE_AUTO：表示自动调度模型，自动运行在当前空闲的 NPU核 上； RKNN_NPU_CORE_0：表示运行在 NPU0 核上； RKNN_NPU_CORE_1：表示运行在 NPU1 核上； RKNN_NPU_CORE_2：表示运行在 NPU2 核上； RKNN_NPU_CORE_0_1：表示同时工作在NPU0、NPU1核上； RKNN_NPU_CORE_0_1_2：表示同时工作在NPU0、NPU1、NPU2核上。 |
| 返回值 | A int错误码（见RKNN返回值错误码）。 O |

示例代码如下：

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

在 RKNN\_NPU\_CORE\_0\_1 及 RKNN\_NPU\_CORE\_0\_1\_2 模式下，目前以下 OP 能获得更好的加速：Conv、DepthwiseConvolution、Add、Concat、Relu、Clip、Relu6、ThresholdedRelu、PRelu、LeakyRelu，其余类型 OP 将 fallback 至单核 Core0 中运行，部分类型 OP（如 Pool 类、ConvTranspose 等）将在后续更新版本中支持。

#### 4.3.3 rknn\_set\_batch\_core\_num


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

rknn\_context ctx;   

int ret = rknn_set_batch_core_num(ctx, 2);

#### 4.3.4 rknn\_dup\_context


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

#### 4.3.5 rknn\_destroy

rknn\_destroy 函数将释放传入的 rknn\_context 及其相关资源。


| API | rknn_destroy |
| --- | --- |
| 功能 | 销毁 rknn context 对象及其相关资源。 |
| 参数 | rknn context context: 要销毁的 rknn context 对象。 |
| 返回值 | int 错误码（见 RKNN返回值错误码）。 |

示例代码如下：

rknn\_context ctx;   

int ret = rknn_destroy (ctx);

#### 4.3.6 rknn\_query

rknn\_query 函数能够查询获取到模型输入输出信息、逐层运行时间、模型推理的总时间、

SDK版本、内存占用信息、用户自定义字符串等信息。


| API | rknn_query |
| --- | --- |
| 功能 | 查询模型与 SDK的相关信息。 |
| 参数 | rknn_context context: rknn_context 对象。 |
| rknn_query_cmd ：查询命令。 |  |
| void*info：存放返回结果的结构体变量。 |  |
| uint32 t size：info 对应的结构体变量的大小。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

当前 SDK支持的查询命令如下表所示：


| 查询命令 | 返回结果结构体 | 功能 |
| --- | --- | --- |
| RKNN QUERY IN OUT NUM | rknn_input output _num | 查询输入输出 tensor 个数。 |
| RKNN QUERY INPUT ATTR | rknn tensor attr | 查询输入 tensor 属性。 |
| RKNN_QUERY_OUTPUT_ATTR | rknn tensor attr | 查询输出 tensor 属性。 |
| RKNN QUERY PERF DETAIL | rknn perf detail | 查询网络各层运行时间，需要调用 rknn_init 接口时，设置RKNN_FLAG_COLLECT_PERF_MASK 标志才能生效。 |
| RKNN QUERY PERF RUN | rknn perf_run | 查询推理模型（不包含设置输入/输出）的耗时，单位是微秒。 |
| RKNN_QUERY_SDK_VERSION | rknn_sdk_version | 查询 SDK版本。 |
| RKNN_QUERY_MEM_SIZE | rknn_mem_size | 查询分配给权重和网络中间tensor 的内存大小。 |
| RKNN_QUERY_CUSTOM_STRING | rknn_custom_string | 查询 RKNN 模型里面的用户自定义字符串信息。 |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn tensor attr | 使用零拷贝API接口时,查询原生输入 tensor 属性，它是NPU 直接读取的模型输入属性。 |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn tensor attr | 使用零拷贝API接口时,查询原生输出 tensor 属性，它是NPU直接输出的模型输出属性。 |
| RKNN QUERY NATIVE NC1HWC2 INPUT ATTR | rknn tensor attr | 使用零拷贝API接口时,查询原生输入 tensor属性，它是NPU 直接读取的模型输入属性                          与RKNN_QUERY_NATIVE_INPUT_ATTR 查询结果一致。 |
| RKNN QUERY NATIVE NC1HWC2 OUTPUT ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输出 tensor 属性，它是NPU直接输出的模型输出属与RKNN_QUERY_NATIVE_OU |
|  |  | TPUT ATTR 查询结果一致性。 |
| RKNN QUERY NATIVE NHWC INPUT ATTR | rknn tensor attr | 使用零拷贝API接口时，查询原生输入tensor属性与RKNN_QUERY_NATIVE_INPUT ATTR 查询结果一致。 |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn tensor attr | 使用零拷贝API接口时,查询原生输出 NHWC tensor属性。 |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn input range1 | 使用支持动态形状 RKNN 模型时，查询模型支持输入形状数量、列表、形状对应的数据布局和名称等信息。 |
| RKNN QUERY CURRENT INPUT ATTR | rknn tensor attr | 使用支持动态形状 RKNN模型时，查询模型当前推理所使用的输入属性。 |
|  | rknn tensor attr | 使用支持动态形状 RKNN模型时，查询模型当前推理所使用的输出属性。 |
| RKNN QUERY CURRENT NATIVE INPUT ATTR | rknn tensor attr | 使用支持动态形状 RKNN 模型时，查询模型当前推理所使用的NPU原生输入属性。 |
| RKNN QUERY CURRENT NATIVE OUTPUT ATTR_ | rknn_ tensor attr | 使用支持动态形状 RKNN模型时，查询模型当前推理所使用的NPU原生输出属性。 |

各个指令用法的详细说明，如下：

### 1) 查询 SDK 版本

示例代码如下：

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

### 2) 查询输入输出 tensor 个数

示例代码如下：

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num,
sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input,
io_num.n_output);
```

### 3) 查询输入 tensor 属性(用于通用 API 接口)

示例代码如下：

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

### 4) 查询输出 tensor 属性(用于通用 API 接口)

示例代码如下：

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

### 5) 查询模型推理的逐层耗时

### 示例代码如下：

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size,
RKNN_FLAG_COLLECT_PERF_MASK, NULL);
ret = rknn_run(ctx,NULL);
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail,
sizeof(perf_detail));
```

### 6) 查询模型推理的总耗时

### 示例代码如下：

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
ret = rknn_run(ctx,NULL);
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run,
sizeof(perf_run));
```

### 7) 查询模型的内存占用情况

在 rknn\_init 接口调用完毕后，当用户需要自行分配网络的内存时，rknn\_query 接口传入RKNN\_QUERY\_MEM\_SIZE 可以查询模型的权重、网络中间 tensor 的内存（不包括输入和输出）、推演模型所用的所有 DMA内存的以及 SRAM内存（如果 sram没开或者没有此项功能则为 0）的占 用 情 况 。 使 用 该 命 令 的 前 提 是 在 rknn\_init 接 口 的 flag 参 数 需 要 包 含RKNN\_FLAG\_MEM\_ALLOC\_OUTSIDE 标志。

示例代码如下：

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size,
RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size,
sizeof(mem_size));
```

### 8) 查询模型中用户自定义字符串

在 rknn\_init 接口调用完毕后，当用户需要查询生成 RKNN 模型时加入的自定义字符串，rknn\_query 接 口 传 NN\_QUERY\_ TRING 可以获取该字符串。例如，在转换RKNN模型时，用而不是 BGR格式三通道图像，在运行时则根据查询到的“RGB”信息将数据转换成 RGB图像。

示例代码如下：

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string,
sizeof(custom_string));
```

### 9) 查询原生输入 tensor属性(用于零拷贝 API接口)

示例代码如下：

rknn\_tensor\_attr input\_attrs[io\_num.n\_input];   

memset(input\_attrs, 0, sizeof(input\_attrs));   

```
for (int i = 0; i < io_num.n_input; i++) {
input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
```

### 10) 查询原生输出 tensor 属性(用于零拷贝 API 接口)

示例代码如下：

rknn\_tensor\_attr output\_attrs[io\_num.n\_output];   

memset(output\_attrs, 0, sizeof(output\_attrs));   

```
for (int i = 0; i < io_num.n_output; i++) {
output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
```

### 11) 查询 NHWC 格式原生输入 tensor 属性(用于零拷贝 API 接口)

示例代码如下：

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
```

### 12) 查询 NHWC 格式原生输出 tensor 属性(用于零拷贝 API 接口)

示例代码如下：

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
```

### 13) 查询 RKNN模型支持的动态输入形状信息（注：RV1106/RV1103不支持该接口）

示例代码如下：

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
dyn_range[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE,
&dyn_range[i], sizeof(rknn_input_range));
```

### 14) 查询 RKNN模型当前使用的输入动态形状

示例代码如下：

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
cur_input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
```

### 15) 查询 RKNN模型当前使用的输出动态形状

在 rknn\_set\_input\_shapes 接口调用完毕后，传入 RKNN\_QUERY\_CURRENT\_OUTPUT\_ATTR

示例代码如下：

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
cur_output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR,
&(cur_output_attrs[i]), sizeof(rknn_tensor_attr));
```

### 16) 查询 RKNN模型当前使用的原生输入动态形状

示例代码如下：

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
cur_input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
```

### 17) 查询 RKNN模型当前使用的原生输出动态形状

示例代码如下：

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
cur_output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR,
&(cur_output_attrs[i]), sizeof(rknn_tensor_attr));
```

#### 4.3.7 rknn\_inputs\_set


| API | rknn_inputs_set | 177 7 |
| --- | --- | --- |
| 功能 | 设置模型输入数据。 |  |
| 参数 | rknn_context context: rknn context 对象。 |  |
| uint32_tn_inputs：输入数据个数。 |  |  |
| rknn_input inputs[]：输入数据数组，数组每个元素是 rknn_input 结构体对象。 |  |  |
| 返回值 | int 错误码（见RKNN返回值错误码 |  |

示例代码如下：

```c
rknn_input inputs[1];
memset(inputs, 0, sizeof(inputs));
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].size = img_width*img_height*img_channels;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].buf = in_data;
inputs[0].pass_through = 0;
ret = rknn_inputs_set(ctx, 1, inputs);
```

#### 4.3.8 rknn\_run

ret = rknn_run(ctx, NULL);


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

#### 4.3.9 rknn\_outputs\_get

对于输出数据的 buffer 存放可以采用两种方式：一种是用户自行申请和释放，此时rknn\_output 对象的 is\_prealloc 需要设置为 1，并且将 buf 指针指向用户申请的 buffer；另一种是由rknn 来进行分配，此时 rknn\_output 对象的 is\_prealloc 设置为 0 即可，函数执行之后 buf将指向输出数据。（注：RV1106/RV1103不支持该接口）


| API | rknn_outputs_get |
| --- | --- |
| 功能 | 获取模型推理输出。 |
| 参数 | rknn context context: rknn context 对象。 |
| uint32_tn_outputs：输出数据个数。 |  |
| rknn_output outputs[]：输出数据的数组，其中数组每个元素为 rknn_output 结构体对象，代表模型的一个输出。 |  |
| rknn_output_extend* extend：保留扩展，当前没有使用，传入NULL即可。 |  |
| 返回值 | int错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
rknn_output outputs[io_num.n_output];
memset(outputs, 0, sizeof(outputs));
for (int i = 0; i < io_num.n_output; i++) {
outputs[i].index = i;
outputs[i].is_prealloc = 0;
outputs[i].want_float = 1;
ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
```

#### 4.3.10 rknn\_outputs\_release

rknn\_outputs\_release 函数将释放 rknn\_outputs\_get 函数得到的输出的相关资源。


| API | rknn_outputs_release |
| --- | --- |
| 功能 | 释放 rknn_output 对象。 |
| 参数 | rknn context context: rknn context 对象。 |
| uint32_t n_outputs：输出数据个数。 |  |
| rknn_output outputs[]：要销毁的 rknn_output 数组。 |  |
| 返回值 | int错误码（见RKNN返回值错误码）。 |

示例代码如下：

ret = rknn_outputs_release(ctx, io_num.n_output, outputs);

#### 4.3.11 rknn\_create\_mem\_from\_phys

部内存相关的信息会赋值给 rknn\_tensor\_mem结构体。


| API | rknn_create_mem_from_phys |
| --- | --- |
| 功能 | 通过物理地址创建 rknn tensor mem 结构体并分配内存。 |
| 参数 | rknn context context: rknn context 对象。 |
| uint64_tphys_addr：内存的物理地址。 |  |
| void *virt_addr：内存的虚拟地址。 |  |
| uint32_t size：内存的大小。 |  |
| 返回值 | rknn_tensor_mem*：tensor 内存信息结构体指针。 |

示例代码如下：

#### 4.3.12 rknn\_create\_mem\_from\_fd


| API | rknn_create_mem_from_fd |
| --- | --- |
| 功能 | 通过文件描述符创建 rknn tensor mem 结构体。 |
| 参数 | rknn context context: rknn context 对象。 |
| int32_tfd：内存的文件描述符。 |  |
| void *virt addr：内存的虚拟地址，fd对应的内存的首地址。 |  |
| uint32 t size：内存的大小。 |  |
| int32_toffset：内存相对于文件描述符和虚拟地址的偏移量。 |  |
| 返回值 | rknn tensor mem*：tensor 内存信息结构体指针。 |

示例代码如下：

//suppose we have got buffer information as input_fd, input_virt and size rknn_tensor_mem* input_mems [1]; input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);

#### 4.3.13 rknn\_create\_mem


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

#### 4.3.14 rknn\_create\_mem2


| API | rknn_create_mem2 |
| --- | --- |
| 功能 | 创建 rknn tensor mem 结构体并分配内存。 |
| 参数 | rknn context context: rknn context 对象。 |
| uint64_t size：内存的大小。 |  |
|  | uint64_t alloc_flags: 控制内存是否是 cacheable 的。RKNN_FLAG_MEMORY_CACHEABLE：创建 cacheable 内存RKNN_FLAG_MEMORY_NON_CACHEABLE: 创建 non -cacheable 内存RKNN FLAG MEMORY FLAGS DEFAULT               :                 同RKNN FLAG MEMORY CACHEABLE |
| 返回值 | rknn_tensor_mem*：tensor 内存信息结构体指针。 |

示例代码如下：

//suppose we have got buffer size rknn_tensor_mem* input_mems [1]; input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);



#### 4.3.15 rknn\_destroy\_mem

rknn\_destroy\_mem 函数会销毁 rknn\_tensor\_mem 结构体，用户分配的内存需要自行释放。


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

#### 4.3.16 rknn\_set\_weight\_mem


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

rknn\_tensor\_mem\* weight\_mems [1];   

int ret = rknn_set_weight_mem(ctx, weight_mems[0]);

#### 4.3.17 rknn\_set\_internal\_mem


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

rknn\_tensor\_mem\* internal\_tensor\_mems [1];   

int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);

#### 4.3.18 rknn\_set\_io\_mem


| API | rknn set io mem                 1 |
| --- | --- |
| 功能 | 设置包含模型输入/输出内存信息的 rknn tensor mem 结构体。 |
| 参数 | rknn_context context: rknn context 对象。 |
| rknn tensor mem*：输入/输出 tensor 内存信息结构体指针。 |  |
| rknn_tensor_attr *: 输入/输出 tensor 的属性。 |  |
| 返回值   7 | int错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
rknn_tensor_attr output_attrs[1];
rknn_tensor_mem* output_mems[1];
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]),
sizeof(rknn_tensor_attr));
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].size_with_stride);
rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);
```

#### 4.3.19 rknn\_set\_input\_shape（deprecated）

#### 4.3.20 rknn\_set\_input\_shapes

对于动态形状输入 RKNN模型，在推理前必须指定当前使用的输入形状。该接口传入输入个数和 rknn\_tensor\_attr 数组，包含了每个输入形状和对应的数据布局信息，将每个 rknn\_tensor\_attr结构体对象的索引、名称、形状（dims）和内存布 局信息（fmt）必须填充，rknn\_tensor\_attr 结构体其他成员无需设置。状数量和动态形状列表，要求输入数据的形状在模型支持的输入形状列表中。初次运行或每次切换新的输入形状，需要调用该接口设置新的形状，否则，不需要重复调用该接口。


| API | rknn_set_input_ shapes |
| --- | --- |
| 功能 | 设置模型当前使用的输入形状。 |
|  | rknn context context: rknn context 对象。 |
| uint32 t n inputs：输入 Tensor 的数量。 |  |
| rknn tensor attr *: 输入 tensor的属性数组指针，传递所有输入的形状信息，用户需要设置每个输入属性结构体中的 index、name、dims、fmt、ndims成员，其他成员无需设置。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
for (int i = 0; i < io_num.n_input; i++) {
for (int j = 0; j < input_attrs[i].n_dims; ++j) {
//使用第一个动态输入形状
input_attrs[i].dims[j] = dyn_range[i].dyn_range[0][j];
}
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0) {
fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n", ret);
return -1;
```

#### 4.3.21 rknn\_mem\_sync

rknn\_create\_mem 函数创建的内存默认是带 cacheable 标志的，对于带 cacheable 标志创建的内块带 cacheable标志创建的内存，保证 CPU和 NPU访问这块内存的数据是一致的。


| API | rknn_mem_sync 7 |
| --- | --- |
| 功能 | 同步 CPU cache 和 DDR 数据。 |
| 参数 | rknn_context context:rknn_context 对象。 |
| rknn_tensor_mem* mem：tensor 内存信息结构体指针。 rknn_mem_sync_mode mode: 表示刷新 CPU cache 和 DDR 数据的模式。 |  |
| RKNN_MEMORY SYNC TO DEVICE：表示 CPU cache 数据同步到 DDR 中，通 常用于 CPU写入内存后，NPU访问相同内存前使用该模式将 cache中的数据写回 DDR。 a |  |
| RKNN_MEMORY_SYNC_FROM_DEVICE：表示 DDR 数据同步到 CPU cache, 通常用于NPU写入内存后，使用该模式让下次CPU访问相同内存时，cache数据无 CPU 从 DDR 重新读取数据。 |  |
| 返回值 int 错误码（见 RKNN返回值错误码 | RKNN_MEMORY_SYNC_BIDIRECTIONAL：表示 CPU cache数据同步到 DDR 同时令 CPU 重新从 DDR 读取数据。 |

示例代码如下：

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
return -1;
}
```



### 4.4 矩阵乘法数据结构定义

#### 4.4.1 rknn\_matmul\_info


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| M | int32_t | A矩阵的行数O |
| K | int32_t | A矩阵的列数 |
| N | int32_t | 77B矩阵的列数 |
| type | rknn_matmul_type1 | 输入输出矩阵的数据类型：RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32：表示矩阵 A 和 B 是 float16类型，矩阵 C 是 float32 类型；RKNN_INT8_MM_INT8_TO_INT32：表示矩阵 A 和 B是 int8类型，矩阵 C 是 int32 类型；RKNN INT8 MM INT8 TO INT8：表示矩阵 A、B 和C 是 int8类型；RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16：表示矩阵 A、B和 C 是 float16类型；RKNN FLOAT16 MM INT8 TO FLOAT32：表示矩阵A 是 float16 类型，矩阵 B 是 int8 类型，矩阵 C 是float32类型；RKNN FLOAT16 MM INT8 TO FLOAT16： 表示矩阵A 是 float16 类型，矩阵 B 是 int8 类型，矩阵 C 是float16类型；RKNN FLOAT16 MM INT4 TO FLOAT32：表示矩阵A 是 float16 类型，矩阵 B 是 int4 类型，矩阵 C 是float32                类                型                ;RKNN FLOAT16 MM INT4 TO FLOAT16：表示矩阵A 是 float16 类型，矩阵 B 是 int4 类型，矩阵 C 是float16 类型；RKNN INT4 MM INT4 TO INT16：表示矩阵 A和 B是 int4类型，矩阵C是 int16类型； |
|  |  | RKNN INT8 MM INT4 TO INT32：表示矩阵 A 和 B是 int4 类型，矩阵 C 是 int32 类型 |
| B_layout | int16_t | 指定矩阵B的数据排列方式。0：表示矩阵B按照原始形状排列1：表示矩阵B按照高性能形状排列 |
| B_quant_type | int16_t | 指定矩阵B的量化方式类型。0：表示矩阵 B 按照 Per-Layer 方式量化1：表示矩阵B按照 Per-Channel方式量化 |
| AC_layout | int16_t | 指定矩阵 A和矩阵C的数据排列方式。 |
| AC_quant_type | int16_t | 指定矩阵 A和C的量化方式类型0：表示矩阵 A 和 C 按照 Per-Layer 方式量化1：表示矩阵 A 和C 按照 Per-Channel 方式量化 |
| iommu domain_id | int32_t | 矩阵上下文所在的IOMMU地址空间域的索引。IOMMU地址空间与上下文一一对应，每个IOMMU地址空间大小为4GB。该参数主要用于矩阵A、B和C的参数规格较大，某个域内NPU分配的内存超过4GB以 |
| reserved | int8_t[] | 预留字段 |

#### 4.4.2 rknn\_matmul\_tensor\_attr


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| name | char[] | 矩阵的名字 |
| n_dims | uint32_t | 矩阵的维度个数 |
| dims | uint32_t[] | 矩阵的形状 |
| size | uint32_t | 矩阵的大小，以字节为单位 |
| type | rknn_tensor_type | 矩阵的数据类型 |

#### 4.4.3 rknn\_matmul\_io\_attr


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

#### 4.4.4 rknn\_quant\_params

rknn\_quant\_params 表示矩阵的量化参数，包括 name 以及 scale 和 zero\_point 数组的指针和长度，name用来标识矩阵的名称，它可以从初始化矩阵上下文时得到的 rknn\_matmul\_io\_attr结构体中获取。结构体定义如下表所示:


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| name | char[] | 矩阵的名字 |
| scale | float* | 矩阵的 scale 数组指针 |
| scale_len | int32_t | 矩阵的 scale 数组长度 |
| zp | int32_t* | 矩阵的 zero_point 数组指针 |
| Rlen | int32_t | 矩阵的 zero_point 数组长度 |

#### 4.4.5 rknn\_matmul\_shape

rknn\_matmul\_shape 表示某个特定 shape 的矩阵乘法的 M、K 和 N，在初始化动态 shape 的矩阵乘法上下文时，需要提供 shape 的数量，并使用 rknn\_matmul\_shape 结构体数组表示所有的输入的 shape。结构体定义如下表所示:


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| M | int32_t | 矩阵 A 的行数 |
| K | int32_t | 矩阵 A 的列数 |
| N | int32_t | 矩阵B的列数 |

### 4.5 矩阵乘法 API 说明

#### 4.5.1 rknn\_matmul\_create

该函数的功能是根据传入的矩阵乘法规格等信息，完成矩阵乘法上下文的初始化，并返回输入和输出 tensor的形状、大小和数据类型等信息。

API rknn\_matmul\_create  

功能 初始化矩阵乘法上下文。  

参数 rknn\_matmul\_ctx\* ctx：矩阵乘法上下文指针。  

rknn\_matmul\_info\* info：矩阵乘法的规格信息结构体指针。  

rknn\_matmul\_io\_attr\* io\_attr：矩阵乘法输入和输出 tensor 属性结构体指针。  

返回值 int错误码（见 RKNN返回值错误码）

示例代码如下：

```c
rknn_matmul_info info;
memset(&info, 0, sizeof(rknn_matmul_info));
info.M = 4;
info.K = 64;
info.N = 32;
info.type = RKNN_INT8_MM_INT8_TO_INT32;
info.B_layout = 0;
info.AC_layout = 0;
rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));
int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
printf("rknn_matmul_create fail! ret=%d\n", ret);
return -1;
}
```

#### 4.5.2 rknn\_matmul\_set\_io\_mem

该函数用于设置矩阵乘法运算的输入/输出内存。在调用该函数前，先使用 rknn\_create\_mem接口创建的 rknn\_tensor\_mem 结构体指针，接着将其与 rknn\_matmul\_create 函数返回的矩阵 A、B或 C 的 rknn\_matmul\_tensor\_attr结构体指针传入该函数，把输入和输出内存设置到矩阵乘法上下文中。在调用该函数前，要根据 rknn\_matmul\_info 中配置的内存排布准备好矩阵 A和矩阵 B的数

据。


| API | rknn matmul set io mem |
| --- | --- |
| 功能 | 设置矩阵乘法的输入/输出内存。 |
| 参数 | rknn matmul ctx ctx：矩阵乘法上下文。 |
| rknn_tensor_mem* mem：tensor 内存信息结构体指针。 |  |
| rknn_matmul_tensor_attr* attr：矩阵乘法输入和输出 tensor 属性结构体指针。 |  |
| 返回值 | int错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
// Create A
rknn_tensor_mem* A = rknn_create_mem(ctx, io_attr.A.size);
if (A == NULL) {
printf("rknn_create_mem fail!\n");
return -1;
}
memset(A->virt_addr, 1, A->size);
rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));
int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
printf("rknn_matmul_create fail! ret=%d\n", ret);
return -1;
}
// Set A
ret = rknn_matmul_set_io_mem(ctx, A, &io_attr.A);
if (ret < 0) {
printf("rknn_matmul_set_io_mem fail! ret=%d\n", ret);
return -1;
}
```

#### 4.5.3 rknn\_matmul\_set\_core\_mask

该函数用于设置矩阵乘法运算时可用的 NPU 核心（仅支持 RK3588 和 RK3576）。在调用该函数前，需要先通过 rknn\_matmul\_create 函数初始化矩阵乘法上下文。可通过该函数设置的掩码值，指定需要使用的核心，以提高矩阵乘法运算的性能和效率。


| API | rknn_matmul_set_core_mask |
| --- | --- |
| 功能 | 设置矩阵乘法运算的NPU核心掩码。 |
| 参数 | rknn_matmul_ctx ctx：矩阵乘法上下文。 |
| rknn_core_mask core_mask：矩阵乘法运算的 NPU核心掩码值，用于指定可用的NPU核心。掩码的每一位代表一个核心，如果对应位为1，则表示该核心可用；否则，表示该核心不可用（详细掩码说明见 rknn_set_core_mask API参数）。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

rknn\_matmul\_set\_core\_mask(ctx, RKNN\_NPU\_CORE\_AUTO);

#### 4.5.4 rknn\_matmul\_set\_quant\_params

rknn\_matmul\_set\_quant\_params 用于设置每个矩阵的量化参数，支持 Per-Channel 量化和 Per-Layer 量化两种方式的量化参数设置。当使用 Per-Channel 量化时，rknn\_quant\_params 中的 scale和 zp 数组的长度等于 N。当使用 Per-Layer 量化时，rknn\_quant\_params 中的 scale 和 zp 数组的长度为 1。在 rknn\_matmul\_run之前调用此接口设置所有矩阵的量化参数。如果不调用此接口，则默认量化方式为 Per-Layer 量化，scale=1.0，zero\_point=0。


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

```c
rknn_quant_params params_a;
memcpy(params_a.name, io_attr.A.name, RKNN_MAX_NAME_LEN);
params_a.scale_len = 1;
params_a.scale = (float *)malloc(params_a.scale_len * sizeof(float));
params_a.scale[0] = 0.2;
params_a.zp_len = 1;
params_a.zp = (int32_t *)malloc(params_a.zp_len * sizeof(int32_t));
params_a.zp[0] = 0;
rknn_matmul_set_quant_params(ctx, &params_a);
```

#### 4.5.5 rknn\_matmul\_get\_quant\_params

rknn\_matmul\_get\_quant\_params 用 于 rknn\_matmul\_type 型 等 于RKNN\_INT8\_MM\_INT8\_TO\_INT32 并且 Per-Channel 量化方式时，获取矩阵 B 所有通道 scale 归一化后的 scale值，获取的 scale值和 A的原始 scale值相乘可以得到 C的 scale值。可以用于在矩阵 C没有真实 scale时，近似计算得到 C的 scale。


| API | rknn_matmul_get_quant_params                       1 |
| --- | --- |
| 功能 | 获取矩阵B的量化参数。 |
| 参数 | rknn_matmul_ctx ctx：矩阵乘法上下文。 |
| rknn_quant_params* params: 矩阵B的量化参数信息。 |  |
| float* scale: 矩阵 B 的 scale 指针。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

```
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

#### 4.5.6 rknn\_matmul\_create\_dyn\_shape

rknn\_matmul\_create\_dyn\_shape 用 于 创 建 动 态 shape 矩 阵 乘 法 上 下 文 , 该 接 口 需 要 传 入rknn\_matmul\_info 结构体、shape 数量以及对应的 shape 数组，shape 数组会记录多个 M、K 和 N值。在初始化成功后，会得到 rknn\_matmul\_io\_attr 的数组，数组中包含了所有的输入输出矩阵的shape、大小和数据类型等信息。目前仅支持设置多个不同的 M，而 K和N固定。


| API | rknn_matmul_create_dyn_shape |
| --- | --- |
| 功能 | 初始化动态 shape矩阵乘法的上下文。 |
| 参数 | rknn matmul ctx *ctx：矩阵乘法上下文指针。 |
| rknn_matmul_info*info：矩阵乘法的规格信息结构体指针。其中M、K和N不需要设置。 |  |
| int shape_num：矩阵上下文支持的 shape数量。 |  |
| rknn_matmul_shape dynamic_shapes[]：矩阵上下文支持的 shape 数组。 |  |
| rknn_matmul_io_attr io attrs[]：矩阵乘法输入和输出 tensor属性结构体数组。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
const int shape_num = 2;
rknn_matmul_shape shapes[shape_num];
for (int i = 0; i < shape_num; ++i) {
shapes[i].M = i+1;
shapes[i].K = 64;
shapes[i].N = 32;
} rknn_matmul_io_attr io_attr[shape_num];
memset(io_attr, 0, sizeof(rknn_matmul_io_attr) * shape_num);
int ret = rknn_matmul_create_dyn_shape(&ctx, &info, shape_num, shapes, io_attr);
if (ret < 0) {
fprintf(stderr, " rknn_matmul_create_dyn_shape fail! ret=%d\n", ret);
return -1;
}
```

#### 4.5.7 rknn\_matmul\_set\_dynamic\_shape

rknn\_matmul\_set\_dynamic\_shape 用于指定矩阵乘法使用的某一个 shape。在创建动态 shape 的矩阵乘法上下文后，选取其中一个 rknn\_matmul\_shape结构体作为输入参数，调用此接口设置运


|  |  |
| --- | --- |
|  |  |
|  |  |
|  |  |
|  |  |

示例代码如下：

```
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
return -1;
}
```

#### 4.5.8 rknn\_B\_normal\_layout\_to\_native\_layout

rknn\_B\_normal\_layout\_to\_native\_layout 用于将矩阵 B 的原始形状排列的数据（KxN）转换为高性能数据排列方式的数据。


| API | rknn B normal layout to native layout |
| --- | --- |
| 功能 | 将矩阵B的数据排列从原始形状转换成高性能形状。 |
| 参数 | void* B input：原始形状的矩阵 B 数据指针。              7 |
| void*B_output：高性能形状的矩阵 B数据指针。 |  |
| int K：矩阵B的行数。                                    77 |  |
| int N：矩阵 B的列数。 |  |
| int subN：等于 rknn_matmul_io_attr 结构体中的 B.dims[2]。 |  |
| int subK：等于 rknn_matmul_io_attr 结构体中的 B.dims[3]。 |  |
| rknn_matmul_type type：输入输出矩阵的数据类型。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码 |

示例代码如下：

int32\_t subN = io\_attr.B.dims[2];   

int32\_t subK = io\_attr.B.dims[3];   

rknn\_B\_normal\_layout\_to\_native\_layout(B\_Matrix, B-&gt;virt\_addr, K, N, subN, subK,   

info.type);

#### 4.5.9 rknn\_matmul\_run

该函数用于运行矩阵乘法运算，并将结果保存在输出矩阵 C 中。在调用该函数前，输入矩阵A 和 B 需要先准备好数据，并通过 rknn\_matmul\_set\_io\_mem 函数设置到输入缓冲区。输出矩阵 C需要先通过 rknn\_matmul\_set\_io\_mem 函数设置到输出缓冲区，而输出矩阵的 tensor 属性则通过rknn\_matmul\_create 函数获取。


| API | rknn_matmul_run |
| --- | --- |
| 功能 | 运行矩阵乘法运算。 |
| 参数 | rknn_matmul_ctx ctx：矩阵乘法上下文。 |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

int ret = rknn_matmul_run(ctx);

#### 4.5.10 rknn\_matmul\_destroy

该函数用于销毁矩阵乘法运算上下文，释放相关资源。在使用完 rknn\_matmul\_create函数创建的矩阵乘法上下文指针后，需要调用该函数进行销毁。


| API | rknn_matmul_destroy |
| --- | --- |
| 功能 | 销毁矩阵乘法运算上下文。 |
| 参数 | rknnmatmul ctx ctx：矩阵乘法上下文。 |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

int ret = rknn_matmul_destroy(ctx);

### 4.6 自定义算子数据结构定义

#### 4.6.1 rknn\_gpu\_op\_context

rknn\_gpu\_op\_context表示指定 GPU 运行的自定义算子的上下文信息。结构体的定义如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| cl_context | void* | OpenCL 的 cl_context 对象，使用时请强制类型转换成 cl_context。 |
| cl_command_queue | void* | OpenCL 的 cl_command_queue 对象，使用时请强制类型转换成cl_command_queue。 |
| cl_kernel | void* | OpenCL 的 cl_kernel 对象，使用时请 |

#### 4.6.2 rknn\_custom\_op\_context

rknn\_custom\_op\_context 表示自定义算子的上下文信息。结构体的定义如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| target | rknn_target_type | 执行自定义算子的后端设备：RKNN_TARGET_TYPE_CPU: CPURKNN TARGET TYPE CPU: GPU |
| internal_ctx | rknn_custom_op_interal_context | 算子内部的私有上下文。 |
| gpu_ctx | rknn_gpu_op_context | 包含自定义算子的 OpenCL上下文信息，当执行后端设备是GPU时，在回调函数中从该结构体获取 OpenCL的 cl_context 等对象。 |
| priv_data | void* | 留给开发者管理的数据指针 |

#### 4.6.3 rknn\_custom\_op\_tensor

rknn\_custom\_op\_tensor 表示自定义算子的输入/输出的 tensor 信息。结构体的定义如下表所示：


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

#### 4.6.4 rknn\_custom\_op\_attr

rknn\_custom\_op\_attr表示自定义算子的参数或属性信息。结构体的定义如下表所示：


|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

#### 4.6.5 rknn\_custom\_op

rknn\_custom\_op表示自定义算子的注册信息。结构体的定义如下表所示：


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| version | uint32_t | 自定义算子版本号。 |
| target | rknn_target_type | 自定义算子执行后端类型。 |
| op_type | char[] | 自定义算子类型。 |
| cl kernel name | char[] | OpenCL 的 kernel 函数名。 |
| cl_kernel_source | char* | OpenCL的资源名称。当cl source size 等于 0 时，表示文件绝对路径；当 cl source size 大于 0 时，表示 kernel 函数代码的字符串。 |
| cl_source_size | uint64_t | 当 cl kernel source 是字符串，表示字符串长度；当 cl_kernel_source 是文件路径，则设置为0。 |
| cl_build_options | char[] | OpenCL kernel 的编译选项。 |
| init | int (*)(rknn custom op context*op_ctx, rknn_custom_op_tensor*inputs, uint32_t n_inputs,rknn_custom_op_tensor* outputs,uint32_t n_outputs); | 自定义算子初始化回调函数指针。在注册时，调用一次。不需要时可以设置为NULL。 |
| prepare | int (*)(rknn_custom_op_context*op_ctx, rknn_custom_op_tensor*inputs, uint32_t n_inputs,rknn_custom_op_tensor* outputs,uint32_t n_outputs); | 预处理回调函数指针。在 rknn run 时调用一次。不需要时可以设置为NULL。 |
| compute | int (*)(rknn_custom_op_context*op_ctx, rknn_custom_op_tensor*inputs, uint32_t n_inputs,rknn custom op tensor* outputs,uint32 t n outputs); | 自定义算子功能的回调函数指针。在rknn_run时调用一次。不能设置为NULL。 |
| compute_native | int (*)(rknn_custom_op_context*op_ctx, rknn_custom_op_tensor*inputs, uint32_t n_inputs,rknn_custom_op_tensor* outputs,uint32_tn_outputs); | 高性能计算的回调函数指针，它与compute 回调函数区别是输入和输出的 tensor 的格式存在差异。暂不支持，目前设置为NULL。 |
| destroy | int (*)(rknn_custom_op_context*op_ctx); | 销毁资源的回调函数指针。在rknn destroy 时调用一次。 |

### 4.7 自定义算子API说明

#### 4.7.1 rknn\_register\_custom\_ops

在初始化上下文成功后，该函数用于在上下文中注册若干个自定义算子的信息，包括自定义算子类型、运行后端类型、OpenCL 内核信息以及回调函数指针。注册成功后，在推理阶段，rknn\_run 接口会调用开发者实现的回调函数。


| API | rknn_register_custom_ops |
| --- | --- |
| 功能 | 注册若干个自定义算子到上下文中。                                   7 |
| 参数 | rknn context *context：rknn context 指针。函数调用之前，context 必须已经初始化1成功。 |
| rknn_custom_op* op：自定义算子信息数组，数组每个元素是 rknn_custom_op 结构        体对象。 |  |
| uint32_t custom_op_num：自定义算子信息数组长度。 |  |
| 返回值 | int 错误码（见RKNN返回值错误码）。 |

示例代码如下：

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;
strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;
ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
printf("rknn_register_custom_ops fail! ret = %d\n", ret);
return -1;
```

#### 4.7.2 rknn\_custom\_op\_get\_op\_attr

该函数用于在自定义算子的回调函数中获取自定义算子的参数信息，例如 Softmax 算子的axis参数。它传入自定义算子参数的字段名称和一个 rknn\_custom\_op\_attr结构体指针，调用该接口后，参数值会存储在 rknn\_custom\_op\_attr结构体中的 data成员中，开发者根据返回的结构体内dtype成员将该指针强制转换成 C语言中特定数据类型的数组首地址，再按照元素数量读取出完整参数值。


| API | rknn_custom_op_get_op_attr |
| --- | --- |
| 功能 | 获取自定义算子的参数或属性。 |
| 参数 | rknn_custom_op_context* op_ctx：自定义算子上下文指针。 |
| const char* attr_name：自定义算子参数的字段名称。 |  |
| rknn_custom_op_attr* op_attr：表示自定义算子参数值的结构体。 |  |
| 返回值 | 无 |

示例代码如下：

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
axis = ((int64_t*)op_attr.data)[0];
}
```

### 5RKNN返回值错误码

RKNNAPI函数的返回值错误码定义如下表所示：


| 错误码 | 错误详情 |
| --- | --- |
| RKNN_SUCC(0) | 执行成功。           1 |
| RKNN_ERR_FAIL(-1) | 执行出错。 |
| RKNN_ERR_TIMEOUT(-2) | 执行超时。 |
| RKNN_ERR_DEVICE_UNAVAILABLE(-3) | NPU设备不可用。 |
| RKNN_ERR_MALLOC_FAIL(-4) | 内存分配失败。 |
| RKNN_ERR_PARAM_INVALID(-5) | 传入参数错误。 |
| RKNN_ERR_MODEL_INVALID(-6) | 传入的 RKNN模型无效。 |
| RKNN_ERR_CTX_INVALID(-7) | 传入的 rknn_context 无效。 |
| RKNN_ERR_INPUT_INVALID(-8) | 传入的 rknn_input 对象无效。 |
| RKNN_ERR_OUTPUT_INVALID(-9) | 传入的 rknn_output 对象无效。 |
| RKNN_ERR_DEVICE_UNMATCH(-10) | 版本不匹配。 |
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION(-12)_ | RKNN模型设置了优化等级的选项，但是和当前驱动不兼容。 |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH(-13) | RKNN模型和当前平台不兼容。 |
