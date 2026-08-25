---
sidebar_position: 1
---

# RKNN-Toolkit2 API 参考手册

### （图形计算平台中心）

### 更新记录

### 1.1 适用芯片

RKNN-Toolkit2 当前版本所支持芯片的型号如下：

 RK3566 系列

 RK3568 系列

 RK3588 系列

 RV1103

 RV1106

RK3562

 RK3576

注：后文用 RK3566 / RK3568 / RK3588 分别统称 RK3566 系列 / RK3568 系列 / RK3588 系列。

### 1.2 系统依赖说明

使用 RKNN-Toolkit2 时需要满足以下运行环境要求：


| 操作系统版本 | Ubuntu18.04（x64） | Ubuntu20.04（x64） | Ubuntu22.04（x64） |
| --- | --- | --- | --- |
| Python 版本 | 3.6/ 3.7 | 3.8 / 3.9 | 3.10 / 3.11 |

注：

1. 具体 python 库依赖详见 doc/requirements\*.txt

2. 本文档主要以 Ubuntu 20.04 / Python3.8 为例进行说明

### 1.3 适用的深度学习框架

RKNN-Toolkit2 支持的深度学习框架包括 Caffe、TensorFlow、TensorFlow Lite、ONNX、Darknet

和 Pytorch。

它和各深度学习框架的版本对应关系如下：


| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | Darknet | Pytorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.01.4.21.5.01.5.2 | 1.0 | 1.12.0~2.8.0 | Schemaversion = 3 | 1.7.0~1.10.0 | CommitID:810d7f7 | 1.6.0~1.10.1 |
|  |  |  |  |  |  |  |
| 1.6.0 | 1.0 | 1.12.0~2.14.0 | Schemaversion = 3 | 1.7.0~1.14.0 | CommitID:810d7f7 | 1.6.0~1.13.1 |

注：

1. 依照语义版本，用某一版本 TensorFlow 导出的任何图或检查点，都可以通过相同主要版本中更高（次要或补丁）版本的 TensorFlow 来进行加载和评估，所以理论上，1.14.0 之前版本的 TensorFlow 导出的 pb 文件，RKNN-Toolkit2 1.4.0 及之后的版本都是支持的。关于 TensorFlow 版 本 兼 容 性 的 更 多 信 息 ， 可 以 参 考 官 方 资 料 ：https://www.tensorflow.org/guide/versions?hl=zh-cn

3. RKNN-Toolkit2 使 用 的 caffe protocol 是 基 于 berkeley 官 方 修 改 的 protocol ：https://github.com/BVLC/caffe/tree/master/src/caffe/proto ， commit 值 为 828dd10 ，RKNN-Toolkit2 在此基础上新增了一些 OP。

## 2 API 详细说明

### 2.1 RKNN 初始化及释放

初始化 RKNN 对象时，可以设置 verbose 和 verbose\_file 参数，以打印详细的日志信息。其中verbose 参数指定是否要在屏幕上打印详细日志信息；如果设置了 verbose\_file 参数，且 verbose 参数值为 True，日志信息还将写到该参数指定的文件中。

举例如下：

# 在屏幕打印详细的日志信息  

rknn = RKNN(verbose=True)  

rknn.release()

### 2.2 模型配置


| API | config |
| --- | --- |
| 描述 |  |
|  | mean_values：输入的均值。参数格式是一个列表，列表中包含一个或多个均值子列表，多输入模型对应多个子列表，每个子列表的长度与该输入的通道数一致，例如[[128,128,128]]，表示一个输入的三个通道的值减去128。默认值为None，表示所有的mean值为0。 |
| std_values：输入的归一化值。参数格式是一个列表，列表中包含一个或多个归一化值子列表，多输入模型对应多个子列表，每个子列表的长度与该输入的通道数一致， |  |

例如[[128,128,128]]，表示设置一个输入的三个通道的值减去均值后再除以 128。  

默认值为None，表示所有的 std 值为 1。

quant\_img\_RGB2BGR：表示在加载量化图像时是否需要先做 RGB2BGR 的操作。如果有多个输入，则用列表包含起来，如[True, True, False]。默认值为 False。

该配置一般用在 Caffe 的模型上，Caffe 模型训练时大多会先对数据集图像进行RGB2BGR 转换，此时需将该配置设为 True。

另外，该配置只对量化图像格式为 jpg/jpeg/png/bmp 有效，npy 格式读取时会忽略该配置，因此当模型输入为 BGR 时，npy 也需要为 BGR 格式。

该配置仅用于在量化阶段（build 接口）读取量化图像或量化精度分析（accuracy\_analysis 接口），并不会保存在最终的 RKNN 模型中，因此如果模型的传入的图像数据也为 BGR格式。

quantized\_dtype ： 量 化 类 型 ， 目 前 支 持 的 量 化 类 型 有 asymmetric\_quantized-8 、asymmetric\_quantized-16（asymmetric\_quantized-16 目前版本暂不支持）。默认值为asymmetric\_quantized-8。

quantized\_algorithm：计算每一层的量化参数时采用的量化算法，目前支持的量化算法有：normal，mmse 及 kl\_divergence。默认值为 normal。

normal 量化算法的特点是速度较快，推荐量化数据量一般为 20-100 张左右，更多的数据量下精度未必会有进一步提升。

的精度，推荐量化数据量一般为 20-50 张左右，用户也可以根据量化时间长短对量化数据量进行适当增减。

kl\_divergence 量化算法所用时间会比 normal 多一些，但比 mmse 会少很多，在某些场景下（feature 分布不均匀时）可以得到较好的改善效果，推荐量化数据量一般为20-100 张左右。


| layer：每层的 weight 只有一套量化参数；channel: 每层的 weight 的每个通道都有一套量化参数，通常情况下 channel 会比 layer精度更高。 |
| --- |
| float_dtype:用于指定非量化情况下的浮点的数据类型，目前支持的数据类型有float16。默认值为 float16。 |
| optimization_level：模型优化等级。默认值为3。通过修改模型优化等级，可以关掉部分或全部模型转换过程中使用到的优化规则。该参数的默认值为3，打开所有优化选项。值为2或1时关闭一部分可能会对部分模型精度产生影响的优化选项，值为0时关闭所有 |
| target_platform：指定 RKNN 模型是基于哪                         成的。目前支持“rk3566”、“rk3568”、“rk3588”、“rv1103”、“rv1106”、“rk3562”和“rk3576”。该参数对大小写不敏感。默认值为None。 |
| custom_string:添加自定义字符串信息到 RKNN 模型，可以在 runtime 时通过 query查询到该信息，方便部署时根据不同的 RKNN模型做特殊的处理。默认值为None。 |
| remove_weight：去除 conv 等权重以生成一个 RKNN 的从模型，该从模型可以与带完整权重的RKNN模型共享权重以减少内存消耗。默认值为False。 |
| compress_weight：压缩模型权重，可以减小 RKNN 模型的大小。默认值为 False。 |
| single_core_mode:是否仅生成单核模型，可以减小RKNN模型的大小和内存消耗。默认值为 False。目前仅对 RK3588 / RK3576 生效。默认值为 False。 |
| model_pruning：对模型进行无损剪枝。对于权重稀疏的模型，可以减小转换后 RKNN模型的大小和计算量。默认值为False。 |
| op_target：用于指定 OP的具体执行目标（如NPU/CPU/GPU等），格式为&#123;&#x27;op0_output_name&#x27;:&#x27;cpu&#x27;, &#x27;op1_output_name&#x27;:&#x27;npu&#x27;, ...&#125; 。默认值为 None。其中，&#x27;op0_output_name&#x27;和&#x27;op1_output_name&#x27;为对应 OP 的输出 tensor 名，可以通过精度分析（accuracy_analysis）功能的返回结果中获取。&#x27;cpu&#x27;和&#x27;npu&#x27;则表示该 tensor 对应的 OP 的执行目标是 CPU或 NPU，目前可选的选项有：&#x27;cpu&#x27; / &#x27;npu&#x27; / &#x27;gpu&#x27; / &#x27;auto&#x27;，其 |


|  | 中，&#x27;auto&#x27;是自动选择执行目标。 |
| --- | --- |
| dynamic_input：用于根据用户指定的多组输入shape，来模拟动态输入的功能。格式为[[input0_shapeA, input1_shapeA, ...], [input0_shapeB, input1_shapeB, ...] ...]。默认值为None，实验性功能。假设原始模型只有一个输入，shape 为[1,3,224,224]，或者原始模型的输入 shape 本身就是动态的，如 shape为[1,3,height,width]或[1,3,-1,-1]，但部署的时候，需要该模型支持3 种不同的输入 shape，如[1,3,224,224], [1,3,192,192]和[1,3,160,160]，此时可以设置 dynamic_input=[[1,3,224,224]], [[1,3,192,192]], [[1,3,160,160]]]，转换成 RKNN模型后进行推理时，需传入对应 shape的输入数据。1注：1. 需要原始模型本身支持动态输入才可开启此功能，否则会报错。2. 如果原始模型输入 shape本身就是动态的，则只有动态的轴可以设置不同的值。 |  |
| quantize_weight: 在 build 接口的 do_quantization 为 False 情况下，通过对一些权重进行量化以减小 rknn 模型的大小默认值为 False。 |  |
| remove_reshape:删除模型的输入和输出中可能存在的 Reshape 的 OP，以提高模型运行时性能（因为目前很多平台的 Reshape 是跑在 cpu上，相对较慢）。默认为 False。注：开启后可能会修改模型的输入或输出节点的shape，需要留意观察转换过程中 |  |
| sparse_infer:在已经稀疏化过的模型上进行稀疏化推理，以提高推理性能。目前仅对 RK3576 生效。默认为 False。 |  |
| 返回值 | 无。 |

举例如下：

\# model config rknn.config(mean\_values=[[103.94, 116.78, 123.68]],

# 从当前路径加载 mobilenet\_v2 模型   

ret = rknn.load\_caffe(model='./mobilenet\_v2.prototxt',   

blobs='./mobilenet\_v2.caffemodel')

```python
std_values=[[58.82, 58.82, 58.82]],
quant_img_RGB2BGR=True,
target_platform='rk3566')
```

### 2.3 模型加载

#### 2.3.1 Caffe 模型加载接口


| API | load_caffe |
| --- | --- |
| 描述 | 加载 caffe 模型。 |
| 参数 | model：caffe 模型文件（.prototxt 后缀文件）路径。 |
| blobs：caffe模型的二进制数据文件（.caffemodel后缀文件）路径。 |  |
| input_name：caffe模型存在多输入时，可以通过该参数指定输入层名的顺序，形如caffe 模型文件  prototxt后缀文件）自动给定。 |  |
| 返回值 | 0：导入成功。 |
| -1：导入失败。 |  |

举例如下：

#### 2.3.2 TensorFlow 模型加载接口


| API | load_tensorflow |
| --- | --- |
| 描述 | 加载 TensorFlow 模型。 |
| 参数 | tf_pb：TensorFlow 模型文件（.pb后缀）路径。 |
|  | inputs：模型的输入节点（tensor名），支持多个输入节点。所有输入节点名放在一个列表中。 |
| input_size_list：每个输入节点对应的 shape，所有输入 shape 放在一个列表中。如示例中的 ssd_mobilenet_v1 模型，其输入节点对应的输入 shape 是[[1, 300, 300, 3]]。 |  |
| outputs：模型的输出节点（tensor名），支持多个输出节点。所有输出节点名放在一个列表中。 |  |
| input_is_nchw：模型的输入的 layout 是否已经是 NCHW。默认值为 False，表示默认输入 layout 为 NHWC。 |  |
| 返回值 | 0：导入成功。 |
| -1：导入失败。 |  |

举例如下：

```python
# 从当前目录加载 ssd_mobilenet_v1_coco_2017_11_17 模型
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
inputs=['Preprocessor/sub'],
outputs=['concat', 'concat_1'],
input_size_list=[[300, 300, 3]])
```

#### 2.3.3 TensorFlow Lite 模型加载接口


| API | load_tflite |
| --- | --- |
|  | 加载 TensorFlow Lite 模型。 |
| 参数 | model：TensorFlow Lite 模型文件（.tflite后缀）路径。 |
| input_is_nchw：模型的输入的 layout 是否已经是 NCHW。默认值为 False，即默认输入 layout 为 NHWC。 |  |
| 返回值 | 0：导入成功。 |
| -1：导入失败。 |  |

举例如下：

\# 从当前目录加载 mobilenet\_v1 模型 ret = rknn.load\_tflite(model = './mobilenet\_v1.tflite')

#### 2.3.4 ONNX 模型加载


| API | load_onnx |
| --- | --- |
| 描述 | 加载 ONNX 模型。 |
| 参数 | model：ONNX模型文件（.onnx后缀）路径。 |
| inputs：模型输入节点（tensor名），支持多个输入节点，所有输入节点名放在一个列表中。默认值为None，表示从模型里获取。                      O |  |
| input_size_list:每个输入节点对应的 shape，所有输入 shape 放在一个列表中。如 inputs有设置，则 input_size_list 也需要被设置。默认值为None。 |  |
| input_initial_val：设置模型输入的初始值，格式为 ndarray 的列表。默认值为 None。主要用于将某些输入固化为常量，对于不需要固化为常量的输入可以设为None，如[None, np.array([1])]。 |  |
| outputs：模型的输出节点              ，支持多个输出节点，所有输出节点名放在一个列表中。默认值 |  |
| 返回值 | 0：导入成功。 |
| -1：导入失败。 |  |

举例如下：

\# 从当前目录加载 arcface 模型

ret = rknn.load\_onnx(model = './arcface.onnx')

#### 2.3.5 DarkNet 模型加载接口


| API | load_darknet |
| --- | --- |
| 描述 | 加载 DarkNet 模型。 |
| 参数 | model：DarkNet 模型文件（.cfg后缀）路径。 |
| weight：权重文件（.weights后缀）路径。 |  |
| 返回值 | 0：导入成功。 |
| -1：导入失败。 |  |

举例如下：

# 从当前目录加载 yolov3-tiny 模型   

ret = rknn.load\_darknet(model = './yolov3-tiny.cfg',   

weight='./yolov3.weights')

#### 2.3.6 PyTorch 模型加载接口


| API | load_pytorch |
| --- | --- |
| 描述 | 加载 PyTorch 模型。支持量化感知训练（QAT）模型，但需要将 torch版本更新至1.9.0以上。 |
| 参数 | model：PyTorch 模型文件（.pt后缀）路径，而且需要是 torchscript 格式的模型。 |
| input_size_list：每个输入节点对应的 shape，所有输入 shape 放在一个列表中。 |  |
| 返回值 | 0：导入成功。 |
| -1：导入失败。 |  |

举例如下：

# 从当前目录加载 resnet18 模型   

ret = rknn.load\_pytorch(model = './resnet18.pt',   

input\_size\_list=[[1,3,224,224]])

### 2.4 构建 RKNN 模型


| API | build |
| --- | --- |
| 描述 | 构建 RKNN 模型。 |
| 参数 | do_quantization：是否对模型进行量化。默认值为 True。 |
| dataset：用于量化校正的数据集。目前支持文本文件格式，用户可以把用于校正的图片（jpg或 png格式）或 npy文件路径放到一个.txt文件中。文本文件里每一行一条 |  |
| 路径信息。如： a.jpg b.jpg |  |
| 或 a.npy b.npy 如有多个输入，则每个输入对应的文件用空格隔开，如： a.jpg a2.jpg b.jpg b2.jpg |  |
| 或 a.npy a2.npy b.npy b2.npy 注：量化图片建议选择与预测场景较吻合的图片。 |  |
| rknn_batch_size：模型的输入Batch参数调整。默认值为None，表示不进行调整。 如果大于1，则可以在一次推理中同时推理多帧输入图像或输入数据，如MobileNet 模型的原始 input 维度为[1, 224, 224, 3]，output 维度为[1, 1001]，当 rknn_batch_size 设为4时，input的维度变为[4,224,224, 3]，output 维度变为[4, 1001]。 注： rknn_batch_size 的调整并不会提高一般模型在 NPU上的执行性能，但却会显著 |  |


| 返回值 | 0：构建成功。 |
| --- | --- |
|  | -1：构建失败。 |

举例如下：

\# 构建 RKNN 模型，并且做量化

ret = rknn.build(do\_quantization=True, dataset='./dataset.txt')

### 2.5 导出 RKNN 模型

通过本工具构建的 RKNN 模型通过该接口可以导出存储为 RKNN 模型文件，用于模型部署。


| API | 7     export_rknn |
| --- | --- |
| 描述 | 将 RKNN模型保存到指定文件中（.rknn后缀）  o              1 |
| 参数 | export_path：导出模型文件的路径。 |
| cpp_gen_cfg：是否生成 C++部署示例。默认值为 False。生成文件 - 模型路径同文件夹下，生成rknn_deploy_demo文件夹、说明文档。支持功能 - 验证模型推理时，各CAPI接口耗时- 验证推理结果的余弦精度- 支持常规 API 接口- 支持图片/npy 输入#请注意，目前 RV1106/RV1103 暂不支持此功能 |  |
| 返回值 | 0：导出成功。 |
| -1:导出失败。 |  |

举例如下：

### 2.6 加载 RKNN 模型


| API | load_rknn |
| --- | --- |
| 描述 | 加载 RKNN 模型。 加载完RKNN模型后，不需要再进行模型配置、模型加载和构建RKNN模型的步骤。 |
|  | 并且加载后的模型仅限于连接NPU硬件进行推理或获取性能数据等，不能用于模拟 |
|  | 器或精度分析等。 |
| 参数 | O path：RKNN 模型文件路径。 |
| 返回值 | 7 0：加载成功。 |
|  | -1：加载失败。 |

举例如下：

\# 从当前路径加载 mobilenet\_v1.rknn 模型 ret = rknn.load\_rknn(path='./mobilenet\_v1.rknn')

### 2.7 初始化运行时环境


| API | init_runtime |
| --- | --- |
| 描述 | 初始化运行时环境。 |
| 参数 | target：目标硬件平台，支持“rk3566”、“rk3568”、“rk3588”、“rv1103”、“rv1106”、“rk3562”、“rk3576”。默认值为None，即在PC使用工具时，模型在模拟器上运行。注：target 设为None时，需要先调用 build 或 hybrid_quantization 接口才可让模型在模拟器上运行。 |
| device_id：设备编号，如果PC连接多台设备时，需要指定该参数，设备编号可以通过“list_devices”接口查看。默认值为None。 |  |
|  | perf_debug:进行性能评估时是否开启 debug 模式。在 debug 模式下，可以获取到每一层的运行时间，否则只能获取模型运行的总时间。默认值为False。 |
| eval_mem：是否进入内存评估模式。进入内存评估模式后，可以调用 eval_memory接口获取模型运行时的内存使用情况。默认值为False。 |  |
| async_mode：是否使用异步模式。默认值为False。调用推理接口时，涉及设置输入图片、模型推理、获取推理结果三个阶段。如果开启了异步模式，设置当前帧的输入将与推理上一帧同时进行，所以除第一帧外，之后的每一帧都可以隐藏设置输入的时间，从而提升性能。在异步模式下，每次返回的推理结果都是上一帧的。（目前版本该参数暂不支持） |  |
| core_mask：设置运行时的 NPU 核心。支持的平台为 RK3588 /RK3576，支持的配置_如下：RKNN.NPU_CORE_AUTO：表示自动调度模型，自动运行在当前空闲的 NPU 核上。RKNN.NPU CORE 0：表示运行在 NPU0 核心上。RKNN.NPU_CORE_1：表示运行在 NPU1 核心上。RKNN.NPU CORE 2：表示运行在 NPU2 核心上。RKNN.NPU_CORE_0_1：表示同时运行在 NPU0、NPU1 核心上。RKNN.NPU CORE 01 2：表示同时运行在 NPU0、NPU1、NPU2 核心上。RKNN.NPU_CORE_ALL：表示根据平台自动配置 NPU核心数量。默认值为 RKNN.NPU_CORE_AUTO。 |  |
| 返回值 | 0：初始化运行时环境成功。 |
| -1：初始化运行时环境失败。 |  |

举例如下：

\# 初始化运行时环境 ret = rknn.init\_runtime(target='rk3566')

### 2.8 模型推理

在进行模型推理前，必须先构建或加载一个 RKNN 模型。


| API | inference |
| --- | --- |
| 描述 | 对当前模型进行推理，并返回推理结果。如果 RKNN-Toolkit2 运行在 PC 上，且初始化运行环境时设置 target 为 Rockchip NPU设备，得到的是模型在硬件平台上的推理结果。如果 RKNN-Toolkit2 运行在 PC 上，且初始化运行环境时没                   得到的是模型在模拟器上的推理结果。 |
| 参数 | inputs：待推理的输入列表，格式为   larray7 |
| data_format：输入数据的 layout 列表，                          对4维的输入有效。默认值为 None，表示所有输入的 layout都为 NHWC。 |  |
| inputs_pass_through：输入的透传列表。默认值为None，表示所有输入都不透传。非透传模式下，在将输入传给NPU驱动之前，工具会对输入进行减均值、除方差等操作；而透传模式下，不会做这些操作，而是直接将输入传给NPU。该参数的值是 一个列表，比如要透传input0，不透传input1，则该参数的值为[1,0]。 |  |
| 返回值 | results：推理结果，类型是 ndarray list。 |

举例如下：

对于分类模型，如 mobilenet\_v1，代码如下（完整代码参考 example/tflite/mobilent\_v1）：

# 使用模型对图片进行推理，得到 TOP5 结果  

outputs = rknn.inference(inputs=[img])  

show\_outputs(outputs)

输出的 TOP5 结果如下：

```yaml
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
```

[ 285] score:0.000171 class:"Siamese cat, Siamese"

### 2.9 评估模型性能


| API | eval_perf |
| --- | --- |
| 描述 | 评估模型性能。 |
|  | 模型必须运行在与 PC 连接的 RK3566  / RK3568  / RK3588 / RV1103 / RV1106  / RK3562/RK3576上。如果调用“init_runtime”的接口来初始化运行环境时设置 |
| perf_debug 为False，则获得的是模型在硬件上运行的总时间；如果设置 perf_debug |  |
| △。 为True，除了返回总时间外，还将返回每一层的耗时情况 |  |
| is_print：是否打印性能信息，默认值为 True |  |
| fix_freq：是否固定硬件设备的频率，默认值为True。 |  |
| 返回值 | perf_result：性能信息（字符串）。 |

举例如下：

\# 对模型性能进行评估 perf\_detail = rknn.eval\_perf()

### 2.10 获取内存使用情况


| API | eval_memory |
| --- | --- |
| 描述 | 获取模型在硬件平台运行时的内存使用情况。模型必须运行在与 PC 连接的 RK3566 / RK3568 / RK3588 / RV1103 / RV1106 /RK3562 /RK3576上。 |
| 参数 | is_print：是否以规范格式打印内存使用情况，默认值为 True。 |
| 返回值 | memory_detail：内存使用情况，类型为字典。内存使用情况按照下面的格式封装在字典中：&#123;'weight_memory': 3698688,'internal memory': 1756160, |
|  | 'other_memory': 484352, 'total_memory': 5939200, 一 'weight_memory'字段表示运行时模型权重的内存占用。 'internal_memory'字段表示运行时模型中间 tensor内存占用。 'other_memory'字段表示运行时其他的内存占用。 'total_model_allocation'表示运行时的总内存占用，即权重、中间 tensor 和其他 |

举例如下：

\# 对模型内存使用情况进行评估memory\_detail = rknn.eval\_memory()

如 examples/caffe/mobilenet\_v2，它在 RK3588 上运行时内存占用情况如下：


| Memory Profile Info Dump |
| --- |
| NPU model memory detail(bytes): Weight Memory: 3.53 MiB Internal Tensor Memory: 1.67 MiB |
| Other Memory: 473.00 KiB Total Memory: 5.66 MiB |
| INFO: When evaluating memory usage, we need consider the size of model, current model size is: 4.09 MiB |

### 2.11 查询 SDK 版本


| API | get_sdk_version |
| --- | --- |
| 描述 | 获取 SDK API和驱动的版本号。 注：使用该接口前必须完成模型加载和初始化运行环境，且该接口只能在硬件平台 |
|  | RK3566 / RK3568 / RK3588 / RV1103 / RV1106 / RK3562 / RK3576上使用。 |
| 参数 | 无。 |
| 返回值 | sdk_version：API和驱动版本信息，类型为字符串。 |

举例如下：

```python
# 获取 SDK 版本信息
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

返回的 SDK 信息类似如下：

RKNN VERSION:   

API: 1.5.2 (8babfea build@2023-08-25T02:31:12)   

DRV: rknn\_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)   

DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)

### 2.12 混合量化

#### 2.12.1 hybrid\_quantization\_step1

使用混合量化功能时，第一阶段调用的主要接口是 hybrid\_quantization\_step1，用于生成临时模 型 文 件 （ &#123;model\_name&#125;.model ） &#123;model\_name&#125;.data ） 和 量 化 配 置 文 件（&#123;model\_name&#125;.quantization.cfg）。接口详情如下：


| API | hybrid_quantization_step1 |
| --- | --- |
| 描述 | 根据加载的原始模型，生成对应的临时模型文件、配置文件和量化配置文件。 |
| 参数 | 7dataset:见构建 RKNN 模型的 dataset 说明。 |
| rknn_batch_size：见构建 RKNN 模型的 rknn_batch_size 说明。 |  |
| proposal：产生混合量化的配置建议值。默认值为False。 |  |
| proposal_dataset_size：proposal 使用的 dataset 的张数。默认值为 1。因为 proposal 功能比较耗时，所以默认只使用1 张，也就是 dataset 里的第一张。 |  |
| custom_hybrid：用于根据用户指定的多组输入和输出名，选取混合量化对应子图。格式为[[input0_name, output0_name]，[input1_name, output1_name],...]。默认值为None。 |  |
|  | 注：输入和输出名应根据生成的临时模型文件(&#123;model_name&#125;.model)来选择。 |
| 返回值 | 0：成功。 |
| -1：失败。 |  |

举例如下：

\# 调用 hybrid\_quantization\_step1 产生量化配置文件 ret = rknn.hybrid\_quantization\_step1(dataset='./dataset.txt')

#### 2.12.2 hybrid\_quantization\_step2

用于使用混合量化功能时生成 RKNN 模型，接口详情如下：


| API | hybrid_quantization_step2     _1 |
| --- | --- |
| 描述 | 接收临时模型文件、配置文件、量化配置文件和校正数据集作为输入，生成混合量化后的 RKNN 模型。 |
| 参数 | model_input：hybrid_quantization_step1生成的临时模型文件（&#123;model_name&#125;.model）路径。 |
| data_input：hybrid_quantization_step1生成的数据文件（&#123;model_name&#125;.data）路径。 |  |
| model_quantization_cfg：hybrid_quantization_step1 生成并经过修改后的模型量化配置文件（&#123;model_name&#125;.quantization.cfg）路径。 |  |
|  | 0：成功。 |
| -1：失败。 |  |

举例如下：

# Call hybrid\_quantization\_step2 to generate hybrid quantized RKNN model   

ret = rknn.hybrid\_quantization\_step2( model\_input='./ssd\_mobilenet\_v2.model', data\_input='./ssd\_mobilenet\_v2.data', model\_quantization\_cfg='./ssd\_mobilenet\_v2.quantization.cfg')

### 2.13 量化精度分析

该接口的功能是进行浮点、量化推理并产生每层的数据，并进行量化精度分析。


| API | accuracy analysis |
| --- | --- |
| 描述 | 推理并产生快照，也就是 dump 出每一层的 tensor 数据。会 dump 出包括 fp32 和 quant |
| 两种数据类型的快照，用于计算量化误差。 |  |
| 注： 1. 该接口只能在 build 或 hybrid_quantization_step2 后调用。 |  |
| Γ模型），则会调用失 2. 如未指定target，且原始模型应该为已量化的模型（Q |  |
| 败。 |  |
| 参数 | inputs：图像（jpg / png / bmp /npy 等） output_dir：输出目录，所有快照都保存在该目录。默认值为'./snapshot'。 |
| simulator目录：保存整个量化模型在 simulator上完整运行时每一层的结果（已 |  |
| 转成 float32) |  |
|  |  |
| error analysis.txt: 记录 simulator 上量化模型逐层运行时每一层的结果与 golden 浮点模型逐层运行时每一层的结果的余弦距离（entire_error cosine），以及量化 |  |
|  | （entire_error cosine）等信息，更详细的信息请查看 error_analysis.txt 文件。 |
| target：目标硬件平台，支持“rk3566”、“rk3568”、“rk3588”、“rv1103”、“rv1106”、“rk3562”、“rk3576”，默认为None。如果设置了target，则会获取NPU运行时每一层的结果，并进行精度的分析。 |  |
| device_id：设备编号，如果PC连接多台设备时，需要指定该参数，设备编号可以通过“list_devices”接口查看。默认值为None。 |  |
| 返回值 | 0：成功。 |
| -1：失败。 |  |

举例如下：

### 2.14 获取设备列表


| API | list_devices |
| --- | --- |
| 描述 | 列出已连接的 RK3566 / RK3568 / RK3588 /RV1103 / RV1106 /RK3562 /RK3576。注：目前设备连接模式有两种：ADB和NTB。多设备连接时请确保他们的模式都是一样的。 |
| 参数 | 7无。 |
| 返回值 | 返回 adb devices 列表和 ntb_devices 列表，如果设备为空，则返回空列表。 |

返回的设备列表信息如下：

### 2.15 导出加密模型

该接口的功能是将普通的 RKNN 模型进行加密，得到加密后的模型。


| API | export_encrypted_rknn_model |
| --- | --- |
| 描述 | 根据用户指定的加密等级对普通的RKNN模型进行加密。 |
| 参数 | 77input_model: 待加密的 RKNN 模型路径。 |
| output_model:模型加密后的保存路径。默认值为None，表示使用&#123;original_model_name&#125;.crypt.rknn 作为加密后的模型名字。 |  |
| crypt_level:加密等级，有1，2和3三个等级。默认值为1。等级越高，安全性越高，解密越耗时；反之，安全性越低，解密越快。数据类型为整型， |  |
| 返回值 | 0：成功。 |
| -1：失败。 |  |

举例如下：

$$

```
\mathrm { { r e t } = \mathrm { { r k n n . e x p o r t _ e n c r y p t e d _ r k n n _ m o d e l ( ` t e s t . r k n n " ) } } }
```

$$

### 2.16 注册自定义算子

该接口的功能是注册一个自定义算子。


| API | reg_custom_op |
| --- | --- |
| 描述 | 注册用户提供的自定义算子类。目前只支持ONNX模型。 |
| 参数 | custom_op:用户自定义的算子类。用于用户需要自定义一个不存在于ONNX算子规 范内的新算子。该算子的 op_type推荐以“cst”字符开头，并且其算子类的 shape_infer |
|  |  |
|  | 和 compute 函数需要用户自己实现。 |
|  | 注：custom_op算子类仅用于模型转换并生成带有自定义算子的RKNN模型，在设备 |
| 返回值 | 端进行部署时还需要参考《RKNN用户指南》的5.5章节。 |
| 0：成功。 |  |
|  | -1：失败。 |

举例如下：

```python
import numpy as np
from rknn.api.custom_op import get_node_attr
class cstSoftmax:
op_type = 'cstSoftmax'
def shape_infer(self, node, in_shapes, in_dtypes):
out_shapes = in_shapes.copy()
out_dtypes = in_dtypes.copy()
return out_shapes, out_dtypes
def compute(self, node, inputs):
x = inputs[0]
axis = get_node_attr(node, 'axis')
x_max = np.max(x, axis=axis, keepdims=True)
tmp = np.exp(x - x_max)
s = np.sum(tmp, axis=axis, keepdims=True)
outputs = [tmp / s]
return outputs
ret = rknn.reg_custom_op(cstSoftmax)
```
