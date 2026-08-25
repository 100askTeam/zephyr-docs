---
sidebar_position: 1
---

# RKNN SDK User Guide

### （图形计算平台中心）

### 更新记录

### 1.1 RKNN 工具链介绍

#### 1.1.1 RKNN 软件栈整体介绍

RKNN软件栈可以帮助用户快速的将AI模型部署到Rockchip芯片。整体的框架如下：



图 1-1 RKNN 软件栈

#### 1.1.2 RKNN-Toolkit2 功能介绍



图 1-2 RKNN-Toolkit2 软件框图

通过该工具提供的 Python接口可以便捷地完成以下功能：

2. 量化功能：支持将浮点模型量化为定点模型，并支持混合量化。

6. 模型加密功能：使用指定的加密等级将RKNN 模型整体加密。

#### 1.1.3 RKNN Runtime 功能介绍

RKNN Runtime 负责加载 RKNN 模型，并调用 NPU 驱动实现在 NPU 上推理 RKNN 模型。推理RKNN模型时，包括原始数据输入预处理、NPU运行模型、输出后处理三项流程。根据不同模型输入格式和量化方式，RKNN Runtime 提供通用 API 和零拷贝 API 两种处理流程。



图1-3 通用API的数据处理流程

零拷贝 API 推理：流程如图 1-4 所示。优化了通用 API 的数据处理流程，归一化、量化和模型推理都会在 NPU 上运行，NPU 输出的数据排布格式和反量化过程在 CPU 或者NPU上运行。零拷贝API对于输入数据流程的处理效率会比通用API高。支持数据在不同的 IP 核之间流动，没有数据拷贝，减少 CPU 及 DDR 带宽消耗。比如通过camera 或者解码出来的数据，支持零拷贝导入到 NPU 中使用。



图1-4 零拷贝API数据处理流程

### 1.2 RKNN 开发流程介绍



图 1-5 RKNN 开发流程图

1. 模型转换：

具体内容请见 3.1 和 4.2.1 章节内容。

## 2. 模型评估：

具体内容请见 3.2、3.3、4.2.2 和 4.2.3 章节内容。

## 3. 板端部署运行：

这个阶段涵盖了模型的实际部署和运行。它通常包括以下步骤：

a. 模型初始化：加载 RKNN 模型到RKNPU平台，准备进行前处理。

b. 模型前处理：加载待推理数据到RKNPU 平台，准备进行推理。

c. 模型推理：执行推理操作，将输入数据传递给模型并获取推理结果。

d. 模型后处理：取出推理结果进行后处理，后处理结果传给应用端。

e. 模型释放：在完成推理流程后，释放模型资源，以便其他任务使用RKNN模型。

具体内容请见3.4 和4.2章节内容。

### 1.3 适用的硬件平台

本文档适用如下硬件平台：

RK3576、RK3562、RK3566 系列、RK3568 系列、RK3588 系列、RV1103、RV1106

### 1.4 关键字说明

RKNN模型：指运行在RKNPU 上的文件，后缀名为.rknn。

HIDL：用于指定 Android HAL 和其用户之间的接口的一种接口描述语言。

CTS：全名兼容性测试套件，是谷歌提供的一个 Andorid 平台自动化测试套件。

VTS：全名供应商测试套件，是谷歌提供的一个 Andorid 平台自动化测试套件。

DRM：英文全名 Direct Rendering Manager，是一个主流的图形显示框架。

NATIVE\_LAYOUT：指对于 NPU 运行时而言，通常性能表现最佳的计算机内存排列格式。

tensor：张量，在深度学习中，用它表示高阶数组的数据。

fd：文件描述符，被用来标识一块内存空间。

i8模型：量化的RKNN 模型，即以8位有符号整型数据运行的模型。

fp16模型：非量化的RKNN 模型，即以16位半精度浮点型数据运行的模型。

## 2 开发环境准备

### 2.1 RKNN-Toolkit2 安装

#### 2.1.1 通过 Docker 方式安装

##### 2.1.1.1 安装 Docker 工具

已安装 Docker 工具的用户可跳过此步骤，未安装的用户请根据官方手册进行安装。

Docker 安装官方手册链接：https://docs.docker.com/install/linux/docker-ce/ubuntu/。

注意事项：需要将用户添加到 docker用户组。

```yaml
# 创建 docker 用户组
sudo groupadd docker
# 把当前用户加入docker 用户组
sudo usermod -aG docker $USER
# 更新激活 docker 用户组
newgrp docker
# 验证不需要 sudo 执行 docker 命令
docker run hello-world
正确运行结果展示：
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest:
sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5a
f48e8d
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
```

##### 2.1.1.2 镜像准备

本节介绍两种RKNN-Toolkit2 镜像环境准备方式，可任选一种方式进行操作。

## 1. 通过 Dockerfile 创建镜像环境

## 2. 加载已打包所有开发环境的Docker镜像

网盘下载链接：https://console.zbox.filez.com/l/I00fc3。提取码：rknn

执行以下命令加载对应 Python 版本的镜像文件。

```batch
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

##### 2.1.1.3 查询镜像信息

创建或加载镜像成功后，查看Docker的镜像信息。

docker images

相应的 RKNN-Toolkit2 镜像信息显示。

REPOSITORY TAG IMAGE ID CREATED SIZE   

rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB

##### 2.1.1.4 运行镜像

执行以下命令运行Docker镜像，运行后将进入镜像的bash环境。

```shell
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb rknn
toolkit2:x.x.x-cpxx /bin/bash
```

将文件夹 examples 代码映射进 Docker 环境可通过附加“-v &lt;host src folder&gt;:&lt;image dst

folder&gt;”参数。

##### 2.1.1.5 运行 Demo

```batch
cd examples/onnx/yolov5
python test.py
```

脚本运行成功后结果如下。


| class | score | xmin, ymin, |  | xmax, ymax |
| --- | --- | --- | --- | --- |
| person | 0.884 | [208, 244, | 286, | 506] |
| person | 0.868 | [478, 236, | 559, | 528] |
| person | 0.825 | [ 110, 238, | 230, | 534] |
| person | 0.339 | [ 79, 353, | 122, | 516] |
| bus | 0.705 | [ 92, 128, | 554, | 467] |

#### 2.1.2 通过 Pip 方式安装

##### 2.1.2.1 安装 Python 环境

若已安装Python环境，则可省略此步骤。

##### 2.1.2.2 安装 Conda 工具

如果系统中同时有多个版本的 Python 环境，建议使用 Conda 管理 Python 环境。

检查是否安装 Conda 和版本信息，若已安装则可省略此小节步骤。

conda -V  

# 提示 conda: command not found 则表示未安装 conda  

# 提示 例如版本 conda 23.9.0

下载 Conda 安装包

安装 Conda

chmod 777 Miniconda3-latest-Linux-x86_64.sh

bash Miniconda3-latest-Linux-x86\_64.sh

##### 2.1.2.3 创建 RKNN-Toolkit2 Conda 环境

进入 Conda base 环境

创建一个 Python3.8 版本（建议版本）名为 RKNN-Toolkit2 的 Conda 环境

```batch
conda create -n RKNN-Toolkit2 python=3.8
```

进入 RKNN-Toolkit2 Conda 环境

conda activate RKNN-Toolkit2   

# (RKNN-Toolkit2) xxx@xxx-pc:\~\$

##### 2.1.2.4 安装 RKNN-Toolkit2 依赖库

```batch
pip3 install -r rknn-toolkit2/packages/requirements_cpxx.txt
```

表2-1 不同Python版本对应的依赖包


| Python 版本 | RKNN-Toolkit2 依赖包 |
| --- | --- |
| 3.6 | requirements_cp36.txt |
| 3.7 | requirements_cp37.txt |
| 3.8 | requirements_cp38.txt |
| 3.9 | requirements_cp39.txt |
| 3.10 | requirements_cp310.txt |
| 3.11 | requirements_cp311.txt |

##### 2.1.2.5 安装 RKNN-Toolkit2

```batch
pip3 install rknn-toolkit2/packages/rknn_toolkit2-x.x.x+xxxxxxxx-
cpxx-cpxx-linux_x86_64.whl
```

表2-2 不同Python版本对应的安装包


| Python 版本 | RKNN-Toolkit2 安装包 |
| --- | --- |
| 3.6 | rknn_toolkit2-&#123;版本号&#125;+&#123;commit 号&#125;-cp36-cp36m-linux_x86_64.whl |
| 3.7 | rknn_toolkit2-&#123;版本号&#125;+&#123;commit 号&#125;-cp37-cp37m-linux_x86_64.whl |
| 3.8 | rknn_toolkit2-&#123;版本号&#125;+&#123;commit号&#125;-cp38-cp38-linux_x86_64.whl |
| 3.9 | rknn_toolkit2-&#123;版本号&#125;+&#123;commit 号&#125;-cp39-cp39-linux_x86_64.whl |
| 3.10 | rknn_toolkit2-&#123;版本号&#125;+&#123;commit 号&#125;-cp310-cp310-linux_x86_64.whl |
| 3.11 | rknn_toolkit2-&#123;版本号&#125;+&#123;commit 号&#125;-cp311-cp311-linux_x86_64.whl |

若执行以下命令没有报错，则安装成功。  

from rknn.api import RKNN

### 2.2 设备 NPU 环境准备

#### 2.2.1 NPU 驱动版本确认

查询命令：

```shell
dmesg | grep -i rknpu
# 或
cat /sys/kernel/debug/rknpu/version
# 或
cat /sys/kernel/debug/rknpu/driver_version
# 或
cat /proc/debug/rknpu/driver_version
查询结果：
```

RKNPU driver: vX.X.X

X.X.X 表示版本号，例如 0.9.2。

Rockchip 的固件均自带 RKNPU 驱动。若以上命令均查询不到NPU 驱动版本，则可能为 第 三 方 固 件 未 安 装 RKNPU 驱 动 ， 需 要 打 开 kernel config 文 件 的“CONFIG\_ROCKCHIP\_RKNPU=y”选项，重新编译内核驱动并烧录。建议 RKNPU 驱动版本&gt;=0.9.2。

#### 2.2.2 NPU 连板环境确认

进入开发板终端，查询是否有RKNN Server进程。

adb shell  

ps | grep rknn\_server  

查询结果：  

702 root 1192 S grep rknn\_server

Android 系统手动启动 RKNN Server：

```csv
su
setenforce 0
/vendor/bin/rknn_server &
Linux 系统手动启动 RKNN Server：
```

restart\_rknn.sh

正常情况下 Rockchip 固件均集成 RKNN Server 并自启动，若无自启动或无相关文件用

于手动启动，请手动安装或更新 RKNN Server。

#### 2.2.3 RKNN Server 安装和更新

2. RKNPU2 Runtime 库

<sup>⚫</sup> librknnmrt.so: 是用于 RV1103/RV1106 板端的 Runtime 库。

注意：

##### 2.2.3.1 RK356X/RK3588/RK3576 平台

## 1. Android 系统

查询RKNN Server服务和librknnrt.so库版本，若版本号不一致请更新至同一版本。

# 查询 rknn<sub>\_</sub>server 版本  

strings /vendor/bin/rknn\_server | grep -i "rknn\_server version"  

# 显示 rknn<sub>\_</sub>server 版本为 X.X.X  

# rknn\_server version: X.X.X  

# 查询 librknnrt.so 库版本  

# 64 位系统  

strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"  

# 32 位系统  

strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"  

# 显示 librknnrt 库版本为 X.X.X  

# librknnrt version: X.X.X

更新 RKNN Server 服务和 librknnrt.so 库。

adb root

```shell
adb remount
64 位系统：
adb push runtime/Android/rknn_server/arm64/rknn_server
/vendor/bin/
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so
/vendor/lib64
32 位系统：
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so
/vendor/lib
重启 RKNN Server 服务：
adb shell
su
chmod +x /vendor/bin/rknn_server
sync
reboot
2. Linux 系统
查询 RKNN Server 服务和 librknnrt.so 库版本，若不一致请更新至同一版本。
# 查询 rknn<sub>_</sub>server 版本
strings /usr/bin/rknn_server | grep -i "rknn_server version"
# 显示 rknn<sub>_</sub>server 版本为 X.X.X
# rknn_server version: X.X.X
# 查询 librknnrt.so 库版本
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
# 显示 librknnrt 库版本为 X.X.X
# librknnrt version: X.X.X
更新 RKNN Server 服务和 librknnrt.so 库。
64 位系统：
adb push runtime/Linux/rknn_server/aarch64/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib
32 位系统：
adb push runtime/Linux/rknn_server/armhf/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
重启 RKNN Server 服务：
adb shell
chmod +x /usr/bin/rknn_server
chmod +x /usr/bin/start_rknn.sh
chmod +x /usr/bin/restart_rknn.sh
restart_rknn.sh
```

##### 2.2.3.2 RV1103/RV1106 平台

查询 RKNN Server 和 librknnmrt.so 库版本，若不一致请更新至同一版本。

```shell
# 查询 rknn<sub>_</sub>server 版本
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"
# 显示 rknn<sub>_</sub>server 版本为 X.X.X
# rknn_server version: X.X.X
# 查询 librknnmrt.so 库版本
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
# 显示 librknnmrt 库版本为 X.X.X
# librknnmrt version: X.X.X
```

更新 RKNN Server 服务和 librknnmrt.so 库。RV1103 与 RV1106 使用同一份 RKNN Server

服务和 librknnmrt.so 库。

重启 RKNN Server 服务：

```shell
adb shell
chmod +x /oem/usr/bin/rknn_server
chmod +x /oem/usr/bin/start_rknn.sh
chmod +x /oem/usr/bin/restart_rknn.sh
restart_rknn.sh
```

#### 2.2.4 查看 RKNN Server 详细日志

##### 2.2.4.1 Android 系统

进入开发板终端，设置日志等级。

adb shell  

su  

setenforce 0  

setprop persist.vendor.rknn.server.log.level 5  

关闭当前 RKNN Server 服务进程。

kill -9 \`pgrep rknn\_server\`

若没有自动重启 RKNN Server 服务，可以手动启动，查看详细日志。

/vendor/bin/rknn\_server &   

logcat

##### 2.2.4.2 Linux 系统

进入开发板终端，设置日志等级。

```batch
adb shell
export RKNN_SERVER_LOGLEVEL=5
```

重启RKNN Server服务可查看详细日志。

restart\_rknn.sh

## 3 RKNN 使用说明

### 3.1 模型转换

RKNN-Toolkit2提供了丰富的功能，包括模型转换、性能分析、部署调试等。本节将重点介绍 RKNN-Toolkit2 的模型转换功能。模型转换是 RKNN-Toolkit2 的核心功能之一，它允许用户将各种深度学习模型从不同的框架转换为 RKNN 格式以在RKNPU 上运行，用户可以参考模型转换流程图以帮助理解如何进行模型转换。



图3-1 模型转换流程图

目前RKNN-Toolkit2 支持多个主流深度学习框架的模型转换，包括：

<sup>⚫</sup> Caffe（推荐版本为 1.0）

<sup>⚫</sup> TensorFlow（推荐版本为 1.12.0\~2.8.0）

<sup>⚫</sup> TensorFlow Lite（推荐版本为 Schema version = 3）

<sup>⚫</sup> ONNX（推荐版本为 1.7.0\~1.10.0）

<sup>⚫</sup> PyTorch（推荐版本为 1.6.0\~1.13.1）

<sup>⚫</sup> Darknet（推荐版本为 Commit ID = 810d7f7）

#### 3.1.1 RKNN 初始化及对象释放

在这一部分，用户需要先初始化 RKNN 对象，这是整个工作流程的第一步：

⚫ 初始化RKNN 对象：

◼ verbose决定是否在屏幕上显示详细日志信息。

示例代码：

rknn = RKNN(verbose=True, verbose\_file='./mobilenet\_build.log')

### ⚫ 释放资源：

◼ 使用release()方法来释放RKNN 对象占用的资源。

示例代码：

rknn.release()

#### 3.1.2 模型 Config 配置

quant\_img\_RGB2BGR 用于控制量化时加载量化校正图像时是否需要先进行 RGB 到BGR的转换，默认值为False。该配置只在量化数据集时生效，实际部署模型时，模型推理阶段不会生效，需要用户在输入前处理里预先处理好。注：quant\_img\_RGB2BGR= True 时模型的推理顺序为先做 RGB2BGR 转换再做 mean\_values 和 std\_values 操作，详细注意事项请见 10.3章节。

⚫ 更具体的rknn.config()接口配置请参考API手册，上述仅列出部分常用参数。

示例代码：

```python
rknn.config(
mean_values=[[103.94, 116.78, 123.68]],
std_values=[[58.82, 58.82, 58.82]],
quant_img_RGB2BGR=False,
target_platform='rk3566')
```

#### 3.1.3 模型加载接口介绍

⚫ Caffe模型加载接口：

<sup>◼</sup> 使用 rknn.load\_caffe()接口加载 Caffe 模型。

◼ 需要提供模型文件（.prototxt后缀）路径和权重文件（.caffemodel后缀）路径。

◼ 如果模型有多个输入层，可以指定输入层名称的顺序。

示例代码：

<sup>⚫</sup> TensorFlow 模型加载接口：

<sup>◼</sup> 使用 rknn.load\_tensorflow()接口加载 TensorFlow 模型。

示例代码：

```python
ret = rknn.load_tensorflow(
tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
inputs=['Preprocessor/sub'],
outputs=['concat', 'concat_1'],
input_size_list=[[1, 300, 300, 3]])
```

<sup>⚫</sup> TensorFlow Lite 模型加载接口：

<sup>◼</sup> 使用 rknn.load\_tflite()接口加载 TensorFlow Lite 模型。

<sup>◼</sup> 需要提供 TensorFlow Lite 模型文件（.tflite 后缀）路径。

示例代码：

```python
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

⚫ ONNX 模型加载接口：

<sup>◼</sup> 使用 rknn.load\_onnx()接口加载 ONNX 模型。

◼ 需要提供 ONNX 模型文件（.onnx 后缀）路径。

示例代码：

ret = rknn.load\_onnx(model='./arcface.onnx')

⚫ DarkNet 模型加载接口：

<sup>◼</sup> 使用 rknn.load\_darknet()接口加载 DarkNet 模型。

◼ 需要提供DarkNet模型文件（.cfg后缀）路径和权重文件（.weights后缀）路径。

示例代码：

⚫ PyTorch 模型加载接口：

<sup>◼</sup> 使用 rknn.load\_pytorch()接口加载 PyTorch 模型。

◼ 需要提供 PyTorch 模型文件（.pt 后缀）路径，模型必须是 torchscript 格式的。

示例代码：

ret = rknn.load\_pytorch(model='./resnet18.pt',   

input\_size\_list=[[1, 3, 224, 224]])

用户可以根据不同类型的模型选择合适的接口进行加载，确保模型转换的正确性。

#### 3.1.4 构建 RKNN 模型

rknn.build()接口参数如下：

⚫ do\_quantization 参数控制是否对模型进行量化，建议设置为 True。

⚫ dataset参数用于提供用于量化校准的数据集，数据集的格式是文本文件。

dataset.txt 示例:

./imgs/ILSVRC2012\_val\_00000665.JPEG   

./imgs/ILSVRC2012\_val\_00001123.JPEG   

./imgs/ILSVRC2012\_val\_00001129.JPEG   

./imgs/ILSVRC2012\_val\_00001284.JPEG   

./imgs/ILSVRC2012\_val\_00003026.JPEG   

./imgs/ILSVRC2012\_val\_00005276.JPEG

示例代码：

```python
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

#### 3.1.5 导出 RKNN 模型

<sup>⚫</sup> export\_path 导出模型文件的路径。

<sup>⚫</sup> cpp\_gen\_cfg 可以选择是否生成 C++ 部署示例。

示例代码：

ret = rknn.export<sub>\_</sub>rknn(export<sub>\_</sub>path='./mobilenet<sub>\_</sub>v1.rknn'）

这些操作和接口涵盖了 RKNN-Toolkit2 模型转换步骤，根据不同的需求和应用场景，

用户可以选择不同的配置选项和量化算法进行自定义设置，方便后续进行部署。

#### 3.1.6 模型转换工具 RKNN\_Convert

python -m rknn.api.rknn\_convert -t rk3588 -i ./model\_config.yml - o ./output\_path

⚫ -i: 模型配置文件（.yml）路径。

⚫ -o: 转换后模型输出路径。

⚫ -v: (选填)指定是否要在屏幕上打印详细日志信息，若开启打印模式请输入-v。

下面是一个示例的 yml 配置文件(object\_detection.yml)：

```yaml
models:
# model output name
name: object_detection
# Original model framework
platform: onnx
# Model input file path
model_file_path: ./object_detection.onnx
# Describe information such as input and output shapes
subgraphs:
# model input tensor shape
input_size_list:
- 1,3,512,512
# input tensor name
inputs:
- data
# output tensor name
outputs:
- conv6-1
- conv6-2
- conv6-3
# quantification flag
quantize: true
# Quantify dataset file path (relative yml path)
dataset: ./dataset.txt
configs:
quantized_dtype: asymmetric_quantized-8
# rknn.config mean_values
mean_values: [127.5,127.5,127.5]
# rknn.config std_values
std_values: [128.0,128.0,128.0]
# rknn.config quant_img_RGB2BGR
quant_img_RGB2BGR: false
# rknn.config quantized_algorithm
quantized_algorithm: normal
```

yml模型转换配置文件附录表：

表3-1 yml模型转换配置参数说明


| 参数名 | 填写内容 |
| --- | --- |
| -name | 模型输出名称 |
| -platform | 原始模型使用的框架，支持 tensorflow、tflite、caffe、onnx、pytorch、darknet |
| -model_file_path | 原始模型文件路径，适用于单模型文件输入，例：tensorflow、tflite、onnx、pytorch |
| -quantize | 是否开启量化 |
| -dataset | O量化 dataset 文件路径（相对 yml 配置文件路径     若要开启accuracy_analysis 此项必填 |
| -prototxt_file_path | 7platform 为 caffe 时，模型的 prototxt 文件 |
| -caffemodel_file_path | platform 为 caffe 时，模型的 caffemodel 文件 |
| -darknet_cfg_path | platform 为 darknet 时，模型的 cfg 文件 |
| -darknet_weights_path | platform为 darknet 时，模型的 weight 文件 |
| -subgraphs | 描述输入输出 shape等信息。除特定框架外，一般情况下该参数及附带的子参数可不写，使用模型默认值 |
| ----input_size_list(子参数) | 输入 tensor 的 shape |
| ---nputs(子参数) | 输入 tensor 的名称 |
| ----outputs(子参数) | 输出 tensor 的名称 |
| 7-configs | 对应 rknn.config()配置 |
| ----quantized_dtype(子参数) | 量化类型，RKNN_toolkit2：可填写[asymmetric_quantized-8]，不输入用默认值 |
| ----mean_values(子参数) | 输入的均值归一数，模型为单输入RGB如[123.675,116.28,103.53]，若为多输入如[[123,116,103],[255,255,255]] |
| ----std_values(子参数) | 输入的方差归一数，模型为单输入RGB如[58.395,58.295,58.391]，若为多输入如[[127,127,127],[255,255,255]] |
| ----quant_img_RGB2BGR(子参数) | 用于控制量化时加载量化校正图像时是否需要先进行RGB到BGR的转换，默认值是 False |
| ----quantized_algorithm(子参数) | 量化算法，可选['normal', 'kl_divergence', 'mmse']，默认为normal |
| ----quantized_method(子参数) | 量化方式，RKNN_toolkit2 可选['layer'，'chanr      默认为channel |
| ----optimization_level(子参数) | 设置优化级别。默认为          使用所有默认优化选项 |
| ----model_pruning(子参数) | 修剪模型以减小模型大                         开启为 true |
| ----quantize_weight(子参数) | 当 quantize 参数为 false 时，通过量化一些权重来减小 rknn 模型的大小。默认为 false，开启为 true |
| ----single_core_mode(子参数) | 是否仅生成单核模型，可以减小RKNN模型的大小和内存消耗。默认值为False。目前对 RK3588/RK3576生效。默认值为False |

#### 3.1.7 RKNN-Toolkit2 模型量化功能

### ⚫ 三种量化算法：

为20-50张左右，用户也可以根据量化时间长短对量化数据量进行适当增减。

3. KL-Divergence 量化算法：将模型中特征（feature）中浮点数和定点数抽象成两个分布，通过调整不同的阈值来更新浮点数和定点数的分布，并根据 KL 散度衡量两个分布的相似性来确定量化范围的最大值和最小值。所用时间会比 normal 多一些，但比 mmse 会少很多，在某些场景下（feature 分布不均匀时）可以得到较好的改善效果，推荐量化数据量一般为20-100 张左右。

### ⚫ 两种量化方式：

### 3.2 模型评估

#### 3.2.1 模型推理

初始化 rknn.init\_runtime()接口参数如下：

⚫ device\_id：设备编号。默认值为 None。若有设置 target 则选择唯一一台设备进行推理。如果电脑连接多台设备连板推理时，需要指定填入相应的设备 ID。若通过网络 adb 连接设备进行模型推理，则需要用户手动执行命令 adb connect [IP] 连接网络设备后再填入设备编号，通常为 [IP] 或 [IP:Port] 的形式。

RV1103 和 RV1106 平台不支持。

<sup>⚫</sup> 推理 rknn.inference()接口参数如下：

⚫ inputs：待推理的输入列表，格式为 ndarray。

示例代码：

```python
ret = rknn.init_runtime(target=platform,
device_id='515e9b401c060c0b')
# Preprocess
image_src = cv2.imread(IMG_PATH)
img = preprocess(image_src)
# Inference
outputs = rknn.inference(inputs=[img])
# Postprocess
outputs = postprocess(outputs)
注意事项： 注意事项：
```

##

#### 3.2.2 模型精度分析

精度分析 rknn.accuracy\_analysis()接口参数如下：

⚫ inputs：输入文件路径列表（格式包括 jpg、png、bmp 和 npy）。

<sup>⚫</sup> output\_dir：结果保存目录，默认值为'./snapshot'。

通常为 [IP] 或 [IP]:[Port] 的形式。

注意事项：



图 3-2 精度分析结果

分为 4 列精度情况，说明如下：


| simulator_error | entire | 从头到当前层 simulator 结果与 golden 结果对比的余弦距离和欧氏距离。 |
| --- | --- | --- |
| single | 当前层 golden 输入时，simulator 结果与 golden 结果对比的余弦距离和欧氏距离。 |  |
| runtime_error | entire | 从头到当前层板端实际结果与golden结果对比的余弦距离和欧氏距离。 |
| single_sim | 当前层 golden 输入时，板端当前层实际结果与 simulator结果对比的余弦距离和欧氏距离。 |  |

#### 3.2.3 模型性能评估

接口 rknn.eval\_perf()会输出当前的硬件频并获取模型的性能评估结果，fix\_freq 参数表示是否需要尝试对硬件（包括 CPU/NPU/DDR）定频，如果要对硬件定频设置成 True，否则设置成 False，默认值为 True。若初始化时 rknn.init\_runtime()的 perf\_debug 参数设置为True，将输出每一层的耗时情况和总耗时情况，若为 False则只输出总耗时情况。

1. 平台 RV1103 / RV1106 不支持 perf\_debug 为 True 模式，只能输出模型总耗时情况。



图3-3 性能评估结果  

部分参数说明如下：


| 参数 | 描述 |
| --- | --- |
| ID | 算子编号 |
| OpType | 算子类型 |
| DataType | 输入的数据类型 |
| Target | 算子运行的硬件（CPU/NPU/GPU） |
| InputShape | 输入形状 |
| OutputShape | 输出形状O |
| DDRCycles | DDR 读写时钟周期数 |
| NPUCycles | NPU 计算时钟周期数 |
| MaxCycles | DDR Cycles 和 NPU Cycles 的最大值 |
| Time(us) | 算子计算耗时（us） |
| MacUsage(%) | MAC 使用率 |
| WorkLoad(0/1/2) | 0/1/2 核负载情况（仅 RK3588 平台） |
| WorkLoad(0/1) | 0/1核负载情况（仅RK3576平台） |
| TaskNumber | NPU任务数 |
| RW(KB) | 读写的数据总量（KB） |
| FullNName | 算子全名 |
| Total Operator Elapsed Per Frame Time(us) | 模型推理的单帧总耗时 |
| Total Memory Read/Write Per FrameSize(KB) | 模型推理的单帧总带宽消耗 |
| CallNumber | 单帧内该算子运行次数 |
| CPUTime(us) | 单帧内该算子在CPU上的总耗时 |
| GPUTime(us) | 单帧内该算子在GPU上的总耗时 |
| NPUTime(us) | 单帧内该算子在NPU上的总耗时 |
| TotalTime(us) | 单帧内该算子的总耗时 |
| TimeRatio(%) | 单帧内该算子的总耗时与单帧总耗时的比 值 |

#### 3.2.4 模型内存评估

示例代码：

内存评估结果如下：

Memory Profile Info Dump   

NPU model memory detail(bytes):   

Weight Memory: 8.67 MiB   

Internal Tensor Memory: 7.42 MiB   

Other Memory: 3.03 MiB   

Total Memory: 19.12 MiB   

INFO: When evaluating memory usage, we need consider   

the size of model, current model size is: 11.86 MiB

部分参数说明如下：


| Total Weight Memory | 模型中权重的内存占用（MB） |
| --- | --- |
| Total Internal Tensor Memory | 模型中间 tensor内存占用（MB） |
| Other Memory | 其他内存占用（例如寄存器配置、输入输出 tensor）(MB) |
| Total Memor | 模型的内存总占用（MB） |

### 3.3 板端 C 推理

此章节介绍通用API 接口的调用流程。零拷贝调用流程请参考章节 5.2。



图 3-4 通用 API 调用流程

RKNN通用API接口调用流程：

1. rknn\_init()初始化模型；

2. rknn\_query()查询模型的输入输出属性；

3. 对输入进行前处理；

4. rknn\_inputs\_set()设置输入数据；

5. rknn\_run()进行模型推理；

6. rknn\_outputs\_get()获取推理结果数据；

7. 对输出进行后处理；

8. rknn\_outputs\_release()释放输出数据内存；

9. rknn\_destroy()销毁 RKNN；

10. 通用API调用流程如图3-4 所示，黄色字体流程表示用户行为可循环输入数据。

通用API调用流程示例代码：

```c
// Init RKNN model
ret = rknn_init(&ctx, model, model_len, 0, NULL);
// Get Model Input Output Number
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num,
sizeof(io_num));
// Get Model Input Info
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++)
input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
// Get Model Output Info
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++)
output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
rknn_input inputs[io_num.n_input];
rknn_output outputs[io_num.n_output];
memset(inputs, 0, sizeof(inputs));
memset(outputs, 0, sizeof(outputs));
// Pre-process
// Read Image
image_buffer_t src_image;
memset(&src_image, 0, sizeof(image_buffer_t));
ret = read_image(image_path, &src_image);
// Set Input Data
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].size = src_image.size;
inputs[0].buf = src_image.virt_addr;
ret = rknn_inputs_set(rknn_ctx, io_num.n_input, inputs);
```

```c
// Run
ret = rknn_run(rknn_ctx, nullptr);
// Get Output Data
ret = rknn_outputs_get(rknn_ctx, io_num.n_output, outputs, NULL);
// Post-process
post_process(outputs, results);
// Release RKNN Output
rknn_outputs_release(rknn_ctx, io_num.n_output, outputs);
if (rknn_ctx != 0)
{
rknn_destroy(rknn_ctx);
```

### 3.4 板端 Python 推理

#### 3.4.1 系统依赖说明

使用 RKNN-Toolkit Lite2 需满足以下运行环境要求：

表 3-2 RKNN-Toolkit Lite2 运行环境


| 操作系统版本 | Debian 10 / 11 (aarch64) |
| --- | --- |
| Python 版本 | 3.7 / 3.8 / 3.9 / 3.10 / 3.11 |
| Python 依赖库 | &#x27;numpy&#x27;、&#x27;ruamel.yaml&#x27;、&#x27;psutils&#x27; |

#### 3.4.2 工具安装

请通过 pip3 install 命令安装 RKNN-Toolkit Lite2。安装步骤如下：

```shell
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip gcc
```

<sup>⚫</sup> 安装依赖模块：opencv-python 和 numpy，参考命令如下：

```shell
sudo apt-get install -y python3-opencv
sudo apt-get install -y python3-numpy
```

注:

2. 在 Debian10 固件上通过 pip3 安装 numpy 可能失败，建议用上述方法安装。

### <sup>⚫</sup> 安装 RKNN-Toolkit Lite2

```shell
# Python 3.7
pip3 install rknn_toolkit_lite2-x.y.z-cp37-cp37m
linux_aarch64.whl
# Python 3.8
pip3 install rknn_toolkit_lite2-x.y.z-cp38-cp38-linux_aarch64.whl
# Python 3.9
pip3 install rknn_toolkit_lite2-x.y.z-cp39-cp39-linux_aarch64.whl
# Python 3.10
pip3 install rknn_toolkit_lite2-x.y.z-cp310-cp310-
linux_aarch64.whl
# Python 3.11
pip3 install rknn_toolkit_lite2-x.y.z-cp311-cp311-
linux_aarch64.whl
```

#### 3.4.3 基本使用流程

使用 RKNN-Toolkit Lite2 部署 RKNN 模型的基本流程如下图所示：



图 3-5 RKNN-Toolkit Lite2 基本使用流程

注：

#### 3.4.4 运行参考示例

运行该示例的方法：

1. 准备一块安装有 RKNN-Toolkit Lite2 的开发板；

2. 将 SDK/rknn-toolkit-lite2/examples 目录推到开发板上；

3. 在开发板上进入examples/resnet18 目录，执行如下命令运行该示例：

```batch
python test.py
```

参考运行结果如下所示：

model: resnet18   

-----TOP 5-----   

[812]: 0.999676 [class: space shuttle]   

[404]: 0.000249 [class: airliner]   

[657]: 0.000014 [class: missile]   

[833]: 0.000009 [class: bullet train, bullet | submarine,   

pigboat, sub, U-boat]   

[466]: 0.000009 [class: bullet train, bullet | submarine,   

pigboat, sub, U-boat]

#### 3.4.5 RKNN-Toolkit Lite2 API 详细说明

本章节将详细说明 RKNN-Toolkit Lite2 提供的所有 API 的用法。

##### 3.4.5.1 RKNNLite 初始化及对象释放

举例如下：

```python
# 将详细的日志信息输出到屏幕，并写到inference.log文件中
rknn_lite = RKNNLite(verbose=True,
verbose_file='./inference.log')
# 只在屏幕打印详细的日志信息
rknn_lite = RKNNLite(verbose=True)
rknn_lite.release()
```

##### 3.4.5.2 加载 RKNN 模型


| API | load_rknn |
| --- | --- |
| 描述 | 加载 RKNN 模型 |
| 参数 | Path: RKNN 模型路径 |
| 返回值 | 0：加载成功；-1：加载失败。 |

举例如下：

举例如下：

```python
# 从当前目录加载 resnet<sub>_</sub>18.rknn 模型
ret = rknn_lite.load_rknn('./resnet_18.rknn')
```

##### 3.4.5.3 初始化运行时环境

在模型推理之前，必须先初始化运行时环境。


| API | init runtime |
| --- | --- |
| 描述 参数 | 初始化运行时环境。 core_mask：NPU工作核心配置模式。可选值如下： |
| 返回值 | RKNNLite.NPU_CORE_AUTO：自动调度模式，模型将以单核模式自动运行 在当前空闲的NPU核上。 RKNNLite.NPU_CORE_0：模型运行在 NPU Core0 RKNNLite.NPU_CORE_2：模型运行在 NPU Core2 上 RKNNLite.NPU_CORE_0_1：模型同时运行在 NPU Core0 和 NPU Core1 上。 RKNNLite.NPU_CORE_0_1_2: 模型同时运行在 NPU Core0，NPU Core1 和 NPU Core2 上。 RKNNLite.NPU CORE ALL：模型同时运行在所有 NPU 核上。 默认值为 NPU_CORE_AUTO， 即默认使用的是自动调度模式。 注：该参数对 RK3588/RK3576 有效。 0: 初始化运行时环境成功；-1：初始化运行时环境失败。 |

##### 3.4.5.4 模型推理


| API | inference |
| --- | --- |
| 描述 | 对指定输入进行推理，返回推理结果。 |
| 参数 | inputs：输入数据，如OpenCV读取的图片（如果输入是四维的，需要手动扩成4维）。类型是list，列表成员是 ndarray。 |
| data_format：数据排列方式，类型是list，对于每个输入可选值&quot;nhwc&quot;，输入，数据buffer应按照NHWC排列，对于非4维输                  r应按照模型输入要求的格式排列。如果要填写该buffer应按照模型输入要求的格式排列维输入，数据buffer应按照该参数设置                         输入模型，填写该参数时要包括所有输入。 |  |
| 返回值 | results：推理结果，类型是 list，列表成员是 ndarray。 |

以分类模型为例，模型推理代码参考如下：

# Get input data   

img = cv2.imread('./space\_shuttle\_224.jpg')   

img = cv2.cvtColor(img, cv2.COLOR\_BGR2RGB)   

img = np.expand\_dims(img, 0)   

# Inference   

outputs = rknn\_lite.inference(inputs=[img])   

# Show the classification results   

show\_top5(outputs)

##### 3.4.5.5 查询 SDK 版本


| API | get_sdk_version |
| --- | --- |
| 描述 | 获取 Runtime，驱动和 RKNN模型版本信息。注：使用该接口前必须完成模型加载和初始化运行环境。 |
| 参数 | 无 |
| 返回值 | sdk_version：runtime，驱动版本信息。类型为字符串。 |

举例如下：

# 获取SDK版本信息  

sdk\_version = rknn\_lite.get\_sdk\_version()

返回的SDK信息参考如下：

RKNN VERSION:   

API: 1.5.2 (71720f3fc@2023-08-21T09:29:52)   

DRV: 0.7.2

##### 3.4.5.6 查询模型可运行平台


| API | list_support_target_platform |
| --- | --- |
| 描述 | 查询给定RKNN模型可运行的芯片平台。 |
| 参数 | rknn model：RKNN 模型路径。如果不指定模型路径，则按类别打印 RKNN-Toolkit Lite2 当前支持的芯片平台。 |
| 返回值 | support_target_platform: 返回模型可运行的芯片平台。如果 RKNN 模型路径_为空或不存在，返回None. |

参考代码如下：

rknn\_lite.list\_support\_target\_platform(rknn\_model=’mobilenet\_v1.r   

knn’)

参考结果如下：

大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大   

Target platforms filled in RKNN model: ['rk3566']   

Target platforms supported by this RKNN model: ['RK3566'   

'RK3568']   

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

### 3.5 矩阵乘法接口

#### 3.5.1 主要用途和特点

⚫ 高效：底层使用RKNPU实现，具有高性能低功耗的特点。



#### 3.5.2 Matmul API 使用流程



图 3-6 Matmul API 基础调用流程

使用Matmul API通常包括以下步骤：

1. 创建上下文：设置 rknn\_matmul\_info 结构体，包含 M、K、N、输入和输出矩阵的数据类型、输入和输出矩阵使用的数据排列方式等信息，然后，调用 rknn\_matmul\_create 接口初始化上下文。在初始化后，获取以 rknn\_matmul\_io\_attr 结构体指针，它包含了输入和输出矩阵 tensor 信息。

5. 填充输入数据：根据形状和数据类型填充输入矩阵A 和B 的数据。

6. 设置输入和输出内存：调用 rknn\_matmul\_set\_io\_mem 将填充好数据的输入矩阵记录到上下文中，输出内存也同样记录到上下文中。除了记录内存地址外，该接口还会涉及对数据做重新排列，必须在填充或更新输入数据后调用，与零拷贝 API 中的 rknn\_set\_io\_mem 接口行为有区别。

8. 处理输出：执行矩阵乘法运算后，从输出内存中读取结果。

#### 3.5.3 矩阵乘法高级用法

如下表所示：

表 3-3 rknn\_matmul\_info 结构体定义


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| M | int32_t | A矩阵的行数 |
| K | int32_t | A矩阵的列数 |
| N | int32_t | B矩阵的列数 |
| type | rknn_matmul_type 1 | 输入输出矩阵的数据类型： RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32 ：表示矩阵A和 B 是 float16类型，矩阵C 是float32 类型； RKNN_INT8_MM_INT8_TO_INT32：表示矩阵 A 和 B 是 int8 类型，矩阵 C 是 int32 类型； RKNN_INT8_MM_INT8_TO_INT8：表示矩阵 A、B 和 C 是 int8 类型； ：表示矩阵 A、B 和 C 是 float16 类型； RKNN FLOAT16_MM_INT8_TO_FLOAT32： 表 示矩阵 A 是 float16 类型，矩阵 B 是 int8 类型，矩 阵 C 是 float32 类型； RKNN_FLOAT16_MM_INT8_TO_FLOAT16: 表 示矩阵 A 是 float16 类型，矩阵 B 是 int8 类型，矩 阵 C 是 float16 类型； RKNN FLOAT16 MM INT4 TO FLOAT32: 表 示矩阵 A 是 float16 类型，矩阵 B 是 int4 类型，矩 阵 C 是 float32 类型； RKNN_FLOAT16_MM_INT4_TO_FLOAT16:表 示矩阵 A 是 float16 类型，矩阵 B 是 int4 类型，矩 阵 C 是 float16 类型； |
|  |  | 和 B 是 int4 类型，矩阵 C 是 int16 类型。RKNN INT8 MM INT4 TO INT32： 表示矩阵 A和 B 是 int4 类型，矩阵 C 是 int32 类型。 |
| B_layout | int16_t | 指定矩阵B的数据排列方式。0：表示矩阵B按照原始形状排列1：表示矩阵B按照高性能形状排列 |
| B_quant_type | int16_t | 指定矩阵B的量化方式类型。1：表示矩阵 B 按照 Per-Channel 方式量化 |
| AC_layout | int16_t | 0：表示矩阵 A和C 按照原始形状排列1：表示矩阵A和 C 按照高性能形状排列 |
| AC_quant_type | int16_t | 指定矩阵A和C的量化方式类型。0：表示矩阵 A 和 C按照 Per-Layer 方式量化表示矩阵 A 和 C 按照 Per-Channel 方式量化 |
| iommu_domain_id | int32 | 矩阵上下文所在的IOMMU地址空间域的索引。IOMMU地址空间与上下文一一对应，每个IOMMU地址空间大小为4GB。该参数主要用于矩阵A、B和C的参数规格较大，某个域内NPU分配的内存超过4GB以后需切换另一个域时使用。 |
| reserved | int8_t[] | 预留字段 |

其中，矩阵A的原始形状是MxK，矩阵B的原始形状是KxN，矩阵C的原始形状是MxN。

##### 3.5.3.1 指定量化参数的矩阵乘法

如果矩阵乘积的高比特数据需要根据量化参数量化成低比特数据，例如，矩阵 A 和 B是 int8类型，矩阵C是 int8 类型，需要设置矩阵的量化参数，量化参数由 scale和 zero\_point组成，用 rknn\_quant\_params 结构体表示，通过 rknn\_matmul\_set\_quant\_params 接口设置矩阵A和C的量化参数，量化参数设置成功后，Per-Channel量化方式下的矩阵B的量化参数可以通过 rknn\_matmul\_get\_quant\_params 接口读取。rknn\_quant\_params 数据结构定义如下表所示：

表 3-4 rknn\_quant\_params 结构体定义


| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| name | char[] | 矩阵的名称 |
| scale | float* | 量化参数 scale数组的首地址 |
| scale_len | int32_t | 量化参数 scale数组的长度 |
| zp | int32_t* | 量化参数 zero_point 数组的首地址 |
| zp_len | int32_t | 量化参数 zero_point 数组的长度 |

##### 3.5.3.2 动态 shape 输入的矩阵乘法



图 3-7 动态 shape 输入的 Matmul API 调用流程

1. 创建上下文：配置 shape 数量和所需的 shape，设置 rknn\_matmul\_info 结构体，包含输入和输出矩阵的数据类型、输入和输出矩阵使用的数据排列方式等信息。注意，动态 shapeMatmul 接口参数 rknn\_matmul\_info 中的 M、K、N 不需要设置。然后，调用rknn\_matmul\_set\_dynamic\_shape 接口初始化上下文。在初始化后，获取 rknn\_matmul\_io\_attr结构体数组，它包含了所有shape配置下的输入和输出矩阵Tensor信息。

#### 3.5.4 高性能的数据排列方式

由于NPU是专用的硬件架构，读取 MxK和KxN这种原始形状的数据不是最高效的，同样的，写入MxN形状的C矩阵也不是最高效的，用户使用特殊的数据排列方式可以实现更高的性能。AC\_layout 参数控制矩阵 A 和 C 是否使用高性能数据排列，B\_layout 参数控制矩阵B是否使用高性能数据排列。

表 3-5 各个芯片平台矩阵A、B和 C的高性能形状


|  | RK3562 | RK3566/RK3568 | RK3576 | RK3588 |
| --- | --- | --- | --- | --- |
| A 形状(int4) | 暂不支持 | 暂不支持 | 暂不支持 | [K/32,M,32] |
| B形状(int4) | 暂不支持 | 暂不支持 | 暂不支持 | [N/64,K/32,64,32] |
| C形状(int16) | 暂不支持 | 暂不支持 | 暂不支持 | [N/8,M,8] |
| A 形状(int8) | [K/16,M,16] | [K/8,M,8] | [K/16,M,16] | [K/16,M,16] |
| B 形状(int8) | [N/16,K/32,16,32] | [N/16,K/32,16,32] | [N/32,K/32,32,32] | [N/32,K/32,32,32] |
| C形状(int32) | [N/4,M,4] | [N/4,M,4] | O[N/4,M,4] | [N/4,M,4] |
| A形状(float16) | [K/8,M,8] | [K/4,M,4] | [K | [K/8,M,8] |
| B形状(float16) | [N/8,K/32,8,32] | [N/8,K/16,8,16] | [N/16,K/32,16,32] | [N/16,K/32,16,32] |
| C形状(float32) | [N/4,M,4] |  | [N/4,M,4] | [N/4,M,4] |



sub Matirx 0



Matrix A  

sub Matirx 1



sub Matirx K/8-1  

图 3-8 int8 类型矩阵 A 从[M,K]变换到[K/8,M,8]的元素对应关系图

$\mathrm &#123; D i &#125; , \mathrm &#123; j &#125;$

矩阵A或C从原始形状转换成高性能形状的示例代码如下：

```c
template <typename Ti, typename To>
void norm_layout_to_perf_layout(Ti *src, To *dst, int32_t M,
int32_t K, int32_t subK){
int outter_size = (int)std::ceil(K * 1.0f / subK);
for (int i = 0; i < outter_size; i++)
{
for (int m = 0; m < M; m++)
{
for (int j = 0; j < subK; j++)
{
int ki = i * subK + j;
if (ki >= K)
```

```
{
dst[i * M * subK + m * subK + j] = 0;
}
```

else   

```
{
dst[i * M * subK + m * subK + j] = src[m * K +
ki];
}
}
}
}
```



图 3-9 int8 类型矩阵 B 从[K,N]变换到[N/16,K/32,16,32]的元素对应关系图

$\mathrm &#123; D i &#125; , \mathrm &#123; j &#125;$

矩阵B 从原始形状转换成高性能形状的示例代码如下：

```c
template <typename Ti, typename To>
void norm_layout_to_native_layout(Ti *src, To *dst, int32_t K,
int32_t N, int32_t subN, int32_t subK)
int N_remain = (int)std::ceil(N * 1.0f / subN);
int K_remain = (int)std::ceil(K * 1.0f / subK);
for (int i = 0; i < N_remain; i++)
{
for (int j = 0; j < K_remain; j++)
{
for (int n = 0; n < subN; n++)
{
int ni = i * subN + n;
for (int k = 0; k < subK; k++)
{
int ki = j * subK + k;
if (ki < K && ni < N)
{
dst[((i * K_remain + j) * subN + n) * subK +
k] = src[ki * N + ni];
}
else
{
dst[((i * K_remain + j) * subN + n) * subK +
k] = 0;
}
}
}
}
}
```  
注意：

表3-6 Matmul接口支持的矩阵A、B和C 的数据类型


|  | 矩阵A | 矩阵B | 矩阵C |
| --- | --- | --- | --- |
| 类型1 | int4 | int4 | int16 |
| 类型2 | int8 | int8 | int32 |
| 类型3 | float16 | float16 | float32 |

其 中 ， float16 浮 点 格 式 遵 循 IEEE-754 标 准 ， 具 体 格 式 请 参 考 [IEEE-754 half](https://en.wikipedia.org/wiki/Half-precision\_floating-point\_format)。

##### 3.5.4.1 矩阵规格限制

Matmul API是基于NPU的硬件架构实现，受硬件规格限制。K和N 大小限制如下：

表3-7 各个芯片平台K和N 的大小限制


|  | RK3562 | RK3566/RK3568 | RK3576 | RK3588 |
| --- | --- | --- | --- | --- |
| K大小限制(int4) | 暂不支持 | 暂不支持 | 暂不支持 | 32 对齐 |
| K大小限制(int8) | &lt;=10240 且 32对齐 | &lt;=10240 且32 对齐 | 32 对齐 | 32 对齐 |
| K大小限制(float16) | &lt;=10240 且32 对齐 | &lt;=10240 且 32 对齐 | 32 对齐 | 对齐 |
| N大小限制(int4) | 暂不支持 |  |  | 且64对 |
| N大小限制(int8) | &lt;=4096 且 16 对齐 | &lt;=4096 且16对齐1 | &lt;=4096且32对齐 | &lt;=4096 且 32 对齐 |
| N大小限制(float16) | 齐 | 4196 16寸开 | -06 32方 | &lt;=4096 且 32 对齐 |

对于 RK3588：

当 K &gt; 8192, B 会被分成 T 段.

```rust
int T = std::ceil(K / 8192);
```

例如: normal layout -&gt; native layout

K = 20488, N = 4096, T = 3, 数据会被分成 3 段.

```
subN = rknn_matmul_io_attr.B.dims[2];

subK = rknn_matmul_io_attr.B.dims[3];

(8196, 4096) (4096 / subN, 8196 / subK, subN, subK)
(K, N) = (20488, 4096) -> (8196, 4096) -> (4096 / subN, 8196 / subK, subN, subK)
normal layout (4096, 4096) (4096 / subN, 4096 / subK, subN, subK)
```

T normal layout T native layout

推荐使用 rknn\_B\_normal\_layout\_to\_native\_layout 接口进行直接数据转换。

对于 RK3576：

当 K &gt; 4096, B 会被分成 T 段.

```rust
int T = std::ceil(K / 4096);
```

例如: normal layout -&gt; native layout

K = 10240, N = 2048, T = 3, 数据会被分成 3 段.

```
subN = rknn_matmul_io_attr.B.dims[2];
subK = rknn_matmul_io_attr.B.dims[3];
(4096, 2048) (2048 / subN, 4096 / subK, subN, subK)
(K, N) = (10240, 2048) -> (4096, 2048) -> (2048 / subN, 4096 / subK, subN, subK)
```


| normal layout | (2048, 2048) | (2048 / subN, 2048 / subK, subN, subK) |
| --- | --- | --- |
|  | T normal layout | T native layout |
| 推荐使用 rknn_B_normal_layout_to_native_layout 接口进行直接数据转换。 |  |  |

## 4 示例

RKNN提供了不同模型的参考示例，包括MobileNet图像分类、YOLOv5目标检测等，代码工程位于 https://github.com/airockchip/rknn\_model\_zoo/tree/main/examples 目录下。

本章节以 PC 端 Ubuntu22.04，Conda 环境的 Python3.8，开发板为 RK3588 Linux 平台为 例 。 有 关 开 发 环 境 的 安 装 可 参 考 第 二 章 ， 其 他 平 台 的 部 署 流 程 可 参 考Rockchip\_RKNPU\_Quick\_Start\_RKNN\_SDK。

### 4.1 MobileNet 模型部署示例

本章节以 MobileNet 模型部署为例，介绍如何快速上手模型转换、模型连板运行、模型评估和模型板端部署。

#### 4.1.1 模型转换

1.进入 rknn\_model\_zoo/examples/mobilenet/python 目录

cd rknn_model_zoo/examples/mobilenet/python

2.执行模型转换并进行图片推理

```batch
python mobilenet.py --model ../model/mobilenetv2-12.onnx --
target rk3588
```

执行该命令后模型是在电脑模拟器上进行推理，转换后的模型默认保存路径为rknn\_model\_zoo/examples/mobilenet/model/mobilenet\_v2.rknn。

#### 4.1.2 模型连板运行

1.进入 rknn\_model\_zoo/examples/mobilenet/python 目录

cd rknn_model_zoo/examples/mobilenet/python

2. 执行模型连板运行

```batch
python mobilenet.py --target rk3588 --npu_device_test
```

执行该命令后模型通过连板的方式在板端上进行推理。输出结果如下：

-----TOP 5-----   

[494] score=0.99 class="n03017168 chime, bell, gong"   

[469] score=0.00 class="n02939185 caldron, cauldron"   

[653] score=0.00 class="n03764736 milk can"   

[747] score=0.00 class="n04023962 punching bag, punch bag,   

punching ball, punchball"   

[505] score=0.00 class="n03063689 coffeepot"

#### 4.1.3 模型评估

RKNN 提供(模拟器和板端)精度评估、耗时评估和内存评估的功能，辅助 RKNN 模型的优化和部署。

##### 4.1.3.1 精度评估

1.进入 rknn\_model\_zoo/examples/mobilenet/python 目录

```ini
cd rknn_model_zoo/examples/mobilenet/python
行模型连板精度分析
python mobilenet.py --target rk3588 --accuracy_analysis --
npu_device_test
模型连板精度分析的输出结果如下：
# simulator_error: calculate the output error of each layer of the
simulator (compared to the 'golden' value).
# entire: output error of each layer between 'golden' and
'simulator', these errors will accumulate layer by layer.
# single: single-layer output error between 'golden' and
'simulator', can better reflect the single-layer accuracy of the
simulator.
layer_name simulator_error
entire single
cos euc cos euc
[Conv] 464 0.99202 | 4.1079 0.99998 | 0.1981
[Conv] output_conv 0.99308 | 13.235 0.99992 | 1.4133
[Reshape] output_int8 0.99308 | 13.235 0.99993 | 1.3043
[exDataConvert] output 0.99308 | 13.235 0.99993 | 1.3043
# runtime_error: calculate the output error of each layer of the
runtime.
# entire: output error of each layer between 'golden' and
'runtime', these errors will accumulate layer by layer.
# single_sim: single-layer output error between 'simulator' and
'runtime', can better reflect the single-layer accuracy of runtime.
layer_name runtime_error
entire single_sim
cos euc cos euc
[Conv] 464 0.99210 | 4.2718 1.00000 | 0.0
[Conv] output_conv 0.99203 | 14.847 1.00000 | 0.2007
[Reshape] output_int8
[exDataConvert] output 0.99203 | 14.847 1.00000 | 0.0
```

##### 4.1.3.2 耗时评估

1.进入 rknn\_model\_zoo/examples/mobilenet/python 目录

cd rknn_model_zoo/examples/mobilenet/python

2. 执行模型耗时评估

```batch
python mobilenet.py --target rk3588 --eval_perf
```

模型耗时评估的输出结果如下：


| Network Layer Information Table |  |  |  |  |
| --- | --- | --- | --- | --- |
| ID OpType DataType Target Time(us) |  |  |  |  |
|  |  |  |  |  |
| 1 | InputOperator | UINT8 | CPU | 17 |
| 2 | ConvClip | UINT8 | NPU | 331 |
| 3 4 | ConvClip | INT8 | NPU | 429 |
|  | Conv | INT8 | NPU | 292 |
|  |  |  |  |  |
| 55 | Conv | INT8 | NPU | 374 |
| 56 | Reshape | INT8 | CPU | 61 |
| 57 | OutputOperator | INT8 | CPU | 11 |

Total Operator Elapsed Per Frame Time(us): 12631   

Total Memory Read/Write Per Frame Size(KB): 10563

Operator Time Consuming Ranking Table

OpType CallNumber ... NPUTime(us) TotalTime(us) TimeRatio(%)   

ConvClip 35 8436 8436 66.79%   

Conv 9 2093 2093 16.57%   

ConvAdd 10 2013 2013 15.94%   

Reshape 1 0 61 0.48%   

InputOperator 1 0 17 0.13%   

OutputOperator 1 0 11 0.09%

##### 4.1.3.3 内存评估

1.进入 rknn\_model\_zoo/examples/mobilenet/python 目录

cd rknn_model_zoo/examples/mobilenet/python

执行模型内存评估   

python mobilenet.py --target rk3588 --eval\_memory   

模型内存评估的输出结果如下：   

Memory Profile Info Dump   

NPU model memory detail(bytes):   

Weight Memory: 3.53 MiB   

Internal Tensor Memory: 1.53 MiB   

Other Memory: 377.19 KiB   

Total Memory: 5.43 MiB   

INFO: When evaluating memory usage, we need consider   

the size of model, current model size is: 3.98 MiB

#### 4.1.4 板端部署

1.在 rknn\_model\_zoo 工程下的 build-linsx.sh 脚本中指定 gcc 交叉编译器路径

GCC\_COMPILER=\~/opts/gcc-linaro-6.3.1-2017.05-   

x86\_64\_aarch64-linux-gnu/bin/aarch64-linux-gnu

有关 gcc 交叉编译器的下载和安装方法可参考 Rockchip\_RKNPU\_Quick\_Start\_RKNN\_SDK。

2. 编译模型相关文件

```shell
./build-linux.sh -t rk3588 -a aarch64 -d mobilenet
```

## 3.推送可执行文件到板端

adb root   

adb remount   

adb push install/rk3588\_linux\_aarch64/rknn\_mobilenet\_demo/   

/userdata/

## 4. 板端执行

```shell
adb shell
cd /userdata/rknn_mobilenet_demo/
export LD_LIBRARY_PATH=./lib
./rknn_mobilenet_demo model/mobilenet_v2.rknn
model/bell.jpg
```

输出结果如下：

```html
-----TOP 5----
[494] score=0.99 class="n03017168 chime, bell, gong"
[469] score=0.00 class="n02939185 caldron, cauldron"
[653] score=0.00 class="n03764736 milk can"
[747] score=0.00 class="n04023962 punching bag, punch bag"
[505] score=0.00 class="n03063689 coffeepot"
```

### 4.2 YOLOv5 模型部署示例

#### 4.2.1 模型转换

1.下载模型

```shell
cd rknn_model_zoo/examples/yolov5/model
./download_model.sh
```

2.执行模型转换

```shell
cd rknn_model_zoo/examples/yolov5/python
python convert.py ../model/yolov5s_relu.onnx rk3588
i8 ../model/yolov5s_relu.rknn
```

转换后的模型保存路径为 rknn\_model\_zoo/examples/yolov5/model/yolov5s\_relu.rknn。

#### 4.2.2 模型连板运行

1.进入 rknn\_model\_zoo/examples/yolov5/python 目录

cd rknn_model_zoo/examples/yolov5/python

2. 执行模型连板运行

```batch
python yolov5.py --model_path ../model/yolov5s_relu.rknn --
target rk3588 --img_show
```

默认输入图片是 model/bus.jpg，结果图片如下所示：



图 4-1 RKNN Python 可视化结果

#### 4.2.3 板端部署运行

1.在 rknn\_model\_zoo 工程下的 build-linsx.sh 脚本中指定 gcc 交叉编译器路径

有关 gcc 交叉编译器的下载和安装方法可参考 Rockchip\_RKNPU\_Quick\_Start\_RKNN\_SDK。

2.编译模型相关文件

```batch
cd rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d yolov5
```

3.推送可执行文件到板端

adb root   

adb remount   

adb push install/rk3588\_linux\_aarch64/rknn\_yolov5\_demo/   

/userdata/   

adb push examples/yolov5/model/yolov5s\_relu.rknn   

/userdata/rknn\_yolov5\_demo/model/

4. 板端运行

adb shell

```
cd userdata/rknn_yolov5_demo/

export LD_LIBRARY_PATH=./lib
```

./rknn\_yolov5\_demo model/yolov5s\_relu.rknn model/bus.jpg

5.从板端拉取到本地查看，在本地电脑的终端中，执行以下命令：

adb pull /userdata/rknn\_yolov5\_demo/out.png .

输出结果图片如下所示：



图 4-2 RKNN C demo 可视化结果

## 5 RKNN进阶使用说明

### 5.1 数据排列格式



图 5-1 RKNPU NC1HWC2 数据排布与存储

如图5-1所示， 数字0代表一笔数据，即一次存放C2个数据，其中C2是由平台决定的，不同硬件平台的C2的规则约束由表5-1所示，C1为C/C2的上取整值。NC1HWC2数据存放的顺序与图中数值增长的顺序一致，先存放 0-15的数据，再存放16-31的数据。以 RK3568 平台为例当 feature 为(1,13,4,4)的 int8 数据，对应的 NC1HWC2 为(1,2,4,4,8),此时C2位8，C1为2，feature在内存中在16-31 排放的数据中，对应的每个C2数据块只有前5个数据有效，剩下的3个数据是额外补的对齐数据。

表5-1 不同硬件平台对应的 C2值


|  | RK3566/RK3568 | RK3588/RK3576 | RV1103/RV1106 | RK3562 |
| --- | --- | --- | --- | --- |
| int8 | 8 | 16 | 16 | 16 |
| float16 | 4 | 8 | 8 | 8 |

接下来重点介绍NC1HWC2 数据排列转NCHW 和NHWC 数据在内存中的变化过程。以 feature (1, 13, 2, 2) RK3568 为例，数据在内存排布中的转换，根据前文的对齐要求可知 feature(1, 13, 2, 2) 对应的 NC1HWC2 为(1, 2, 2, 2,8) ，NC1HWC2 的存储如下图所示，红色部分为额外对齐的无效数据。



图 5-2 NC1HWC2 数据排布展开  

移除无效数据转成 NCHW 即 (1, 13, 2, 2)数据，在内存中的排布如下：



图 5-3 NCHW 数据排布

移除无效数据转成NHWC 即 (1, 2, 2, 13)数据，在内存中的排布如下：


| 低 | 低地址 |  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 32 | 33 | 34 | 35 | 36 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 40 | 41 | 42 | 43 | 44 |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 48 | 49 | 50 | 51 | 52 |  |  |
| 高 | 高地址 |  | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 56 | 57 | 58 | 59 | 60 |

图 5-4 NHWC 数据排布

转换示例代码：

NC1HWC2 转 NCHW：以 int8 数据排列的 NC1HWC2 转成 int8 数据排列的 NCHW 如

下所示：

```c
大
*src: 表示 NC1HWC2 输入 tensor 的地址
*dst: 表示 NCHW 输出 tensor 的地址
*dims: 表示 NC1HWC2 的 shape 信息
*channel: 表示 NCHW 输入的 C 的值
* h : 表示 NCHW 的 h 的值
* w: 表示 NCHW 的 w 的值
*/
int NC1HWC2_to_NCHW(const int8_t* src, int8_t* dst, int* dims,
int channel, int h, int w)
1
int batch = dims[0];
int C1 = dims[1];
int C2 = dims[4];
int hw_src = dims[2] * dims[3];
int hw_dst = h * w;
for (int i = 0; i < batch; i++) {
src = src + i * C1 * hw_src * C2;
dst = dst + i * channel * hw_dst;
for (int c = 0; c < channel; ++c) {
int plane = c / C2;
const int8_t* src_c = plane * hw_src * C2 + src;
int offset = c % C2;
for (int cur_h = 0; cur_h < h; ++cur_h)
for (int cur_w = 0; cur_w < w; ++cur_w) {
int cur_hw = cur_h * w + cur_w;
dst[c * hw_dst + cur_h * w + cur_w] = src_c[C2 * cur_hw +
offset];
}
}
}
return 0;
```

\*src: 表示 NC1HWC2 输入 tensor 的地址  

\*dst: 表示 NCHW 输出 tensor 的地址  

\*dims: 表示 NC1HWC2 的 shape 信息  

\*channel: 表示 NHWC 输入的 C 的值  

\* h : 表示 NCHW 的 h 的值  

\* w: 表示 NCHW 的 w 的值  

\*/  

int NC1HWC2\_to\_NHWC(const int8\_t\* src, int8\_t\* dst, int\* dims,  

int channel, int h, int w)  

```c
int batch = dims[0];
int C1 = dims[1];
int C2 = dims[4];
int hw_src = dims[2] * dims[3];
int hw_dst = h * w;
for (int i = 0; i < batch; i++) {
src = src + i * C1 * hw_src * C2;
dst = dst + i * channel * hw_dst;
for (int cur_h = 0; cur_h < h; ++cur_h) {
for (int cur_w = 0; cur_w < w; ++cur_w) {
int cur_hw = cur_h * dims[3] + cur_w;
for (int c = 0; c < channel; ++c) {
int plane = c / C2;
const auto* src_c = plane * hw_src * C2 + src;
int offset = c % C2;
dst[cur_h * w * channel + cur_w * channel + c] = src_c[C2
cur_hw + offset];
}
}
}
}
return 0;
```

### 5.2 RKNN Runtime 零拷贝调用

#### 5.2.1 零拷贝介绍

在推理RKNN模型时，原始数据要经过输入处理、NPU运行模型、输出处理三大流程。目前根据不同模型输入格式和量化方式，接口内部会存在通用 API 和零拷贝 API 两种处理流程，如图5-5和图5-6所示，两组API的主要区别在于，通用接口每次更新帧数据，需要将外部模块分配的数据拷贝到 NPU 运行时的输入内存，而零拷贝流程的接口会直接使用预先分配的内存（包括 NPU 运行时创建的或外部其他框架创建的，比如 DRM 框架），减少了内存拷贝的花销，性能更优，带宽更少。当用户输入数据只有虚拟地址时，只能使用通用API接口；当用户输入数据有物理地址或fd时，两组接口都可以使用。通用API和零拷贝API不能混合调用。



图5-5 通用API的数据处理流程  



图5-6 零拷贝API数据处理流程

1. 通用 API

2. 零拷贝 API

零拷贝场景的条件如下表所示：

表5-2 零拷贝输入要求


| 输入维度 | 输入对齐要求 |  |
| --- | --- | --- |
| RK3566/RK3568 | RK3576/RK3562/RK3588/RV1106/RV1103 |  |
| 4维，通道数是1、3、4 | 宽8字节对齐 | 宽16字节对齐 |
| 非4维 | 总大小8字节对齐 | 总大小16字节对齐 |

#### 5.2.2 C API 零拷贝整体流程

零拷贝 API 接口使用 rknn\_tensor\_memory 结构体，需要在推理前创建并设置该结构体，并在推理后读取该结构体中的内存信息。根据用户是否需要自行分配模型的模块内存（输入/输出/权重/中间结果）和内存表示方式（文件描述符/物理地址等）差异，有下列三种典型的零拷贝调用流程，如图 5-7 至图 5-9 所示，红色部分表示专为零拷贝加入的接口和数据结构，斜体表示接口调用之间传递的数据结构。

### ⚫ 输入/输出内存由运行时分配



图 5-7 零拷贝 API接口调用流程（输入/输出内部分配）

### ⚫ 输入/输出内存由外部分配



图5-8 零拷贝API接口调用流程（输入/输出外部分配）

如 图 5-8 所 示 ， 输 入 / 输 出 内 存 由 外 部 分 配 调 用 的 是rknn\_create\_mem\_from\_fd()/rknn\_create\_mem\_from\_phys()接口创建 rknn\_tensor\_memory 结构体，rknn\_set\_io\_mem()设置输入输出 rknn\_tensor\_memory 结构体。flush\_cache 表示用户需要调用与分配的内存类型关联的接口来刷新输出缓存。

### ⚫ 输入/输出/权重/中间结果内存由外部分配



图5-9 零拷贝 API接口调用流程（输入/输出/权重/中间结果外部分配）

如 图 5-9 所 示 ， 输 入 / 输 出 / 权 重 / 中 间 结 果 内 存 由 外 部 分 配 调 用 的 是rknn\_create\_mem\_from\_fd()/rknn\_create\_mem\_from\_phys()接口创建 rknn\_tensor\_memory 结构体 ， rknn\_set\_io\_mem() 设 置 输 入 输 出 rknn\_tensor\_memory 结 构 体 ，rknn\_set\_weight\_mem()/rknn\_set\_internal\_mem()设置权重/中间结果 rknn\_tensor\_memory 结构体。

#### 5.2.3 C API 零拷贝的用法

以图5-7零拷贝API接口调用流程（输入/输出内部分配）为例，用法如下：

<sup>⚫</sup> rknn\_query()

### 输入:

用 RKNN\_QUERY\_NATIVE\_INPUT\_ATTR 查 询 相 关 的 属 性 （ 注 意 ， 不 是RKNN\_QUERY\_INPUT\_ATTR）. 当查询出来的 fmt（或者称为 layout）不同时，需要提前处理的方式也不一样。该方式查询出来的是输入硬件效率最优的 layout 和 type。rknn\_query()输入的情况如下:

b. 当 layout 为 RKNN\_TENSOR\_NHWC 时，这种情况一般输入是 4 维，并且数据类型为float32/float16/int8/uint8，同时，输入通道数是 1、3、4。当传数据给 NPU 时，也需要按照 NHWC 格式排列给 NPU。需要注意的是当 pass\_through=1 时，width 可能需要做stride对齐，具体取决于查询出来的w\_stride的值。

当 layout 为 RKNN\_TENSOR\_NC1HWC2 时，这种情况一般输入是 4 维，并且数据类照 NHWC 格式排列，接口内部会进行 NHWC 到 NC1HWC2 的 cpu 转换; 当pass\_through=1 时，输入数据按照 NC1HWC2 格式排列, 用户外部需转换好。

表5-3 输入可修改的输入数据类型表


|  | rknn_query 查询得到的模型数据类型 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| bool | int8 | float16 | int16 | int32 | Int64 |  |  |
| 用户接口修改的数据类型 | bool | Y |  |  |  |  |  |
| int8 |  | Y |  |  |  |  |  |
| uint8 |  | Y | Y |  |  |  |  |
| float32 |  | Y | Y |  |  |  |  |
| float16 |  |  |  |  |  |  |  |
| int16 |  |  |  |  |  |  |  |
| int32 |  |  |  |  | Y |  |  |
| Int64 |  |  |  |  |  | Y |  |

输出:

rknn\_query()输出的情况如下:

c. 当 layout 为 RKNN\_TENSOR\_NCHW 时，这种情况一般输出是 4 维, 并且数据类型为

float16/int8。用户外部无需进行 layout 转换。

如果用户需要的输出配置不同于查询接口获取的 rknn\_tensor\_attr 结构体，可以对rknn\_tensor\_attr 结构体进行对应修改，可修改的配置信息如表 5-4，表 5-5 所示，特别注意：如果查询输出的数据类型是 int8，用户想获取成 float32 类型输出，则 rknn\_tensor\_attr 结构体 的 size 要 修 改 成 原 size 的 四 倍 ， 同 时 其 中 的 数 据 类 型 要 修 改 成RKNN\_TENSOR\_FLOAT32。用该方式修改后硬件效率就不是最优了，接口内部会调用 cpu进行数据类型转换。

表 5-4 输出可修改的输入数据类型表


|  | rknn_query 查询得到的模型数据类型 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| bool | int8 | float16 | int16 | int32 | Int64 |  |  |
| 用户接口修改的数据类型 | bool | Y |  |  |  |  |  |
| int8 |  |  |  |  |  |  |  |
| uint8 |  |  |  |  |  |  |  |
| float32 |  |  | Y |  |  |  |  |
| float16 |  |  | Y |  |  |  |  |
| int16 |  |  |  | Y |  |  |  |
|  |  |  |  |  | Y |  |  |
| Int64 |  |  |  |  |  | Y |  |

表 5-5 输出可修改的 layout 类型表


|  | rknn_query 查询得到的模型 layout 类型 |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| NC1HWC2 | NCHW | NHWC | UNDEFINE |  |  |
| 用户接口设置的layout 类型 | NC1HWC2 | Y |  |  |  |
| NCHW | Y | Y |  |  |  |
| NHWC |  |  | Y |  |  |
| UNDEFINE |  |  |  | Y |  |

表 5-6 RK3562/RK3566/RK3568/RK3588/RK3576 零拷贝接口 NPU 支持的输出配置


| 模型类型 | 输出数据类型 | 输出维度 | 可支持 output layout |
| --- | --- | --- | --- |
| int8 模型 | int8float16float32 | 4维 | NCHWNC1HWC2NHWC |
| 非4维 | UNDEFINE |  |  |
| float16 模型 | float16float32 | 4维 | NCHWNC1HWC2NHWC |
| 非4维 | UNDEFINE |  |  |

表 5-7 RV1106/RV1103 零拷贝接口 NPU 支持的输出配置


| 模型类型 | 输出数据类型 | 输出维度 | 可支持 output layout |
| --- | --- | --- | --- |
| int8 模型 | int8float16 | 4维 | NCHWNC1HWC2NHWC |
| 非4维 | UNDEFINE |  |  |

### <sup>⚫</sup> rknn\_create\_mem

零拷贝 API 接口使用 rknn\_tensor\_memory 结构体，需要在推理前创建并设置该结构体，并在推理后读取该结构体中的内存信息。当无需对 RKNN\_QUERY\_NATIVE\_INPUT\_ATTR，RKNN\_QUERY\_NATIVE\_OUTPUT\_ATTR 出来的 layout 和 type 进行修改时，直接采用默认配置的 size\_with\_stride 创建内存大小。若修改了相应的 layout 和 type，则需按照相应的 size创建内存大小.(例如输出的数据类型是 int8，用户想获取成 float32类型输出，size要修改成原 size 的四倍)。

### <sup>⚫</sup> rknn\_set\_io\_mem

### 5.3 NPU 多核配置

#### 5.3.1 多核运行配置方法

表 5-8 init\_runtime 接口 core\_mask 参数说明  

参数 详细说明  

core\_mask 该参数用于设置模型运行的NPU 核心。可选值和相应说明如下：  

NPU\_CORE\_AUTO: 自动调度模式，模型将以单核模式自动运行在当前空  

闲的NPU核上。  

NPU\_CORE\_0: 模型运行在 NPU Core0 上。  

NPU\_CORE\_1: 模型运行在 NPU Core1 上。  

NPU\_CORE\_2: 模型运行在 NPU Core2 上。  

NPU\_CORE\_0\_1: 模型同时运行在 NPU Core0 和 NPU Core1 上。  

NPU\_CORE\_0\_1\_2: 模型同时运行在 NPU Core0，  

NPU\_CORE\_ALL: 根据平台自定配置 NPU 核  

默认值为 NPU\_CORE\_AUTO。  

例如 RKNNLite.NPU\_CORE\_AUTO；如果在 RKNN-Toolkit2 上设置该参  

数时，值的前面要加上 RKNN，例如 RKNN.NPU\_CORE\_AUTO。

RKNN-Toolkit2 设置 NPU 核心，参考代码如下：

```python
#Python
# Init runtime environment
print('--> Init runtime environment')
ret = rknn.init_runtime(target='rk3588',
core_mask=RKNN.NPU_CORE_0)
if ret != 0:
print('Init runtime environment failed!')
exit(ret)
```

RKNN-Toolkit Lite2 设置 NPU 核心，参考代码如下：

```python
#Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_0)
if ret != 0:
print('Init runtime environment failed')
exit(ret)
print('done')
```  
如果使用 C/C++ 作为应用程序开发语言，可以调用 rknn\_set\_core\_mask()接口设置模

型运行的NPU核心。该接口 core\_mask的详细说明如下表：

#

表 5-9 rknn\_set\_core\_mask 接口 core\_mask 参数说明


| 参数 | 详细说明 |
| --- | --- |
| core_mask | 该参数用于设置模型运行的NPU核心。可选值和相应说明如下： |
|  | RKNN_NPU_CORE_AUTO：自动调度模式，模型将以单核模式自动运行在 |
|  | 当前空闲的NPU核上。 |
|  | RKNN_NPU_CORE_0: 模型运行在 NPU Core0 上。 |
|  | RKNN_NPU_CORE_1:模型运行在 NPU Core1 上。 |
|  | RKNN_NPU_CORE_2: 模型运行在 NPU Core2 上。 |
|  | RKNN_NPU_CORE_0_1:模型同时运行在 NPU Core0 和 NPU Core1 上。 |
|  | RKNN_NPU_CORE_0_1_2: 模型同时运行在 NPU Core0，Core1 和 Core2 上。 |

使用 C/C++ API 设置模型运行 NPU 核心，参考代码如下：

```c
// C++
// rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

#### 5.3.2 查看多核运行效果

本章节将详细说明RKNN模型以多核模式运行时的效果。

```python
#Python
# Init runtime environment
ret = rknn.init_runtime(target='rk3588',
device_id='29d5dd97766a5c27', perf_debug=True)
if ret != 0:
print('Init runtime environment failed!')
exit(ret)
# Eval performance
rknn.eval_perf()
```

# Python  

# 使用 RKNN-Toolkit Lite2 提供的 Python 接口，只需在创建 RKNNLite 对象时将  

verbose 设成 True 即可  

rknnlite = RKNNLite(verbose=True)  

# 使用C/C++接口，则需要在运行二进制程序前设置如下环境变量  

```
export RKNN_LOG_LEVEL=4
```


| ID | OpType | DataType |  | Target WorkLoad(0/1/2)-ImproveTherical |
| --- | --- | --- | --- | --- |
| 1 | InputOperator | UINT8 | CPU | 100.0%/0.0%/0.0% - Up:0.0% |
| 2 | Conv | UINT8 | NPU | 50.0%/50.0%/0.0% - Up:50.0% |
| 3 | MaxPool | INT8 | NPU | 100.0%/0.0%/0.0% - Up:0.0% |
| 4 | Conv | INT8 | NPU | 50.0%/50.0%/0.0% - Up:50.0% |
| 5 | MaxPool | INT8 | NPU | 100.0%/0.0%/0.0% - Up:0.0% |
| 6 | ConvRelu | INT8 | NPU | 48.1%/51.9%/0.0% - Up:48.1% |
| 7 | Conv | INT8 | NPU | 100.0%/0.0%/0.0% - Up:0.0% |
| 8 | Softmax | INT8 | CPU | 0.0%/0.0%/0.0% - Up:0.0% |
| 9 | OutputOperator | FLOAT16 CPU |  | 0.0%/0.0%/0.0% - Up:0.0% |
| Total Operator Elapsed Time(us): 591 Total Memory RW Amount(MB): 0 |  |  |  |  |

模型每层运行信息中的"WorkLoad(0/1/2)-ImproveTherical"一列只在多核 NPU 上会打印，记录了模型每一层的任务在 NPU 核心上是如何分配以及其理论性能提升情况。例如"50.0%/50.0%/0.0% - Up:50.0%"代表该层的计算量以 Core0 负责 50%，Core1 负责 50%进行分配，该层的性能相比单核运行，理论能提升 50%。如果某一层的性能没有提升，例如"100.0%/0.0%/0.0% - Up:0.0%"，可能存在以下几种情况：

该层的负载太小，小于NPU 多核任务分配的粒度，因此该层运行在单核上；

#### 5.3.3 多核性能提升技巧

可以尝试如下方法，以得到较高的多核运行性能：

<sup>⚫</sup> 将 CPU/DDR/NPU 频率定到最高

⚫ 将应用绑定至CPU 大核

⚫ 将NPU 中断绑定至上面一点相应的CPU 大核

不同固件对应的定频命令有所区别，请参考8.1.1章节。

以将应用绑定到CPU4 大核心为例，上面提到的后两点可以参考如下脚本：

```shell
interrupts=$(cat /proc/interrupts | grep npu)
interrupts_array=($interrupts)
irq1=$(echo ${interrupts_array[0]} | awk -F ':' '{print $1}')
irq2=$(echo ${interrupts_array[14]} | awk -F ':' '{print $1}')
irq3=$(echo ${interrupts_array[28]} | awk -F ':' '{print $1}')
for irq in $irq1 $irq2 $irq3; do
echo 4 > /proc/irq/$irq/smp_affinity_list
done
taskset 10 ./rknn<sub>_</sub>benchmark lenet.rknn "" 10 3 # CPU4 对应的
taskset 掩码值为 0x10
```

上述脚本会执行如下操作：

<sup>⚫</sup> 执行 cat /proc/interrupts | grep npu 命令并解析出三个中断号（去除冒号）

<sup>⚫</sup> 使用循环将每个中断号的 smp\_affinity\_list 设置为 4（CPU4 对应的 ID 为 4）

### 5.4 动态 Shape

#### 5.4.1 动态 Shape 功能介绍

是指模型输入数据的形状在运行时可以改变。它可以帮助处理输入数据大定的情况，增加模型的灵活性。在之前仅支持静态 shape 的 RKNN 模型情况下，如果用户需要使用多 个输入 shape，传统的做法是生成多个 RKNN 模型，在模型部署时初始化多个上下文分别执行推理，而在引入动态 shape 后，用户可以只保留一份与静态 shapeRKNN 模型大小接近的动态 shape RKNN 模型，并使用一个上下文进行推理，从而节省Flash占用和DDR占用，动态shape在图像处理和序列模型推理中具有重要的作用，它的典型应用场景包括：

⚫ 序列长度改变的模型，常见于 NLP 模型，例如 BERT, GPT

⚫ 空间维度变化的模型，例如分割和风格迁移

<sup>⚫</sup> 带 Batch 模型，Batch 维度上变化

⚫ 可变输出数量的目标检测模型

#### 5.4.2 RKNN SDK 版本和平台要求

<sup>⚫</sup> RKNN-Toolkit2 版本&gt;=1.5.0

<sup>⚫</sup> RKNPU Runtime 库(librknnrt.so)版本&gt;=1.5.0

<sup>⚫</sup> RK3566/RK3568/RK3588/RK3588S/RK3562/RK3576 平台的 NPU 支持该功能

#### 5.4.3 生成动态 Shape 的 RKNN 模型

本节介绍使用 RKNN-Toolkit2 的 Python 接口生成动态 shape 的 RKNN 模型的步骤：

1. 确认模型支持动态 shape

如果模型文件本身不是动态 shape, RKNN-Toolkit2 支持扩展成动态 shape 的 RKNN 模型。首先，用户要确认模型本身不存在限制动态 shape 的算子或子 图结构，例如，常量的形状动态shape扩展的情况，用户要根据报错信息，修改模型结构，重新训练模型以支持动态 shape。建议使用原始模型本身就是动态shape的模型。

2. 设置需要使用的输入形状

```python
# Python
dynamic_input = [
[[1,3,224,224]], # set the first shape for all inputs
[[1,3,192,192]], # set the second shape for all inputs
[[1,3,160,160]], # set the third shape for all inputs
]
# Pre-process config
rknn.config(mean_values=[103.94, 116.78, 123.68],
std_values=[58.82, 58.82, 58.82], quant_img_RGB2BGR=True,
dynamic_input=dynamic_shapes)
```

3. 量化

在设置好输入 shape 后， 如果要做量化，则需要设置量化矫正集数据。工具会读取用户设置的最大分辨率输入做量化（是所有输入尺寸之和的最大的一组 shape）。例如，模型有两个输入，一个输入 shape 分别是[1,224]和[1,112]，另一个输入 shape 分别[1,40]和[1,80]，第一组 shape 所有输入尺寸之和是 1\*224+1\*40=264，第二组 shape 所有输入尺寸之和是1\*112+1\*80=192，第一组 shape 所有输入尺寸之和更大，因此使用两个输入分别以[1,224]和[1,40]的 shape 做量化。

另外，输入的最大分辨率 shape 在调用 rknn.config 时也会打印出来，如下：

W config: The 'dynamic\_input' function has been enabled, the   

MaxShape is dynamic\_input[0] = [[1,224],[1,40]]!   

The following functions are subject to the MaxShape:   

1. The quantified dataset needs to be configured   

according to MaxShape   

2. The eval\_perf or eval\_memory return the results of   

MaxShape

## 4. 推理评估或精度分析

#### 5.4.4 C API 部署

##### 5.4.4.1 通用 API

使用通用API部署动态 shape RKNN 模型的流程如下图所示：



图 5-10 动态 shape 输入接口的通用 API 调用流程

加载动态 shape RKNN 模型后，可以在运行时动态修改输入的 shape。首先，通过rknn\_query()可以查询 RKNN 模型支持的输入 shape 列表,每个输入支持的 shape 列表信息以rknn\_input\_range 结构体形式返回，它包含了每个输入的名称、数据布局信息、shape 个数以及具体 shape。接着，通过调用 rknn\_set\_input\_shapes()接口，传入包含每个输入 shape 信

1. 初始化

调用 rknn\_init()接口初始化动态 shape RKNN 模型，

对于动态shape RKNN模型，在初始化上下文时有如下限制：

<sup>⚫</sup> 不支持权重共享功能（带 RKNN\_FLAG\_SHARE\_WEIGHT\_MEM 标志的初始化）。

⚫ 不支持上下文复用功能（具体说明见 rknn\_dup\_context 接口）。

2. 查询 RKNN 模型支持的输入 shape 组合

```c
// 查询模型支持的输入shape
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input *
sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++)
{
dyn_range[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE,
&dyn_range[i], sizeof(rknn_input_range));
if (ret != RKNN_SUCC)
{
fprintf(stderr, "rknn_query error! ret=%d\n", ret);
return -1;
}
dump_input_dynamic_range(&dyn_range[i]);
```

注意：对于多输入的模型，所有输入的 shape 按顺序一一对应，例如，有两个输入、多种shape 的 RKNN 模型，第一个输入的第一个 shape 与第二个输入的第一个 shape 组合有效，不存在交叉的 shape 组合。例如，模型有两个输入 A 和 B，A 的 shape 分别是[1,224]和[1,112]，B 的 shape 分别[1,40]和[1,80]，此时，只支持以下两组输入 shape 的情况：

<sup>⚫</sup> A shape = [1,224],B shape=[1,40]

<sup>⚫</sup> A shape = [1,112],B shape=[1,80]

## 3.设置输入 shape

在首次设置输入数据或者输入数据 shape 发生改变时，需要调用 rknn\_set\_input\_shapes()接口动态修改输入 shape。加载动态 shape RKNN 模型后，可以在运行时动态修改输入的shape。通过调用 rknn\_set\_input\_shapes()接口，传入所有输入的 rknn\_tensor\_attr 数组，每个rknn\_tensor\_attr 中的 dims,n\_dims 和 fmt 三个成员信息表示了当前次推理的 shape。C 代码示例如下：

```c
/
dynamic inputs shape range:
index=0, name=data, shape_number=2, range=[[1, 224, 224,
3],[1, 112, 224, 3]], fmt = NHWC
**/
input_attrs[0].dims[0] = 1;
input_attrs[0].dims[1] = 224;
input_attrs[0].dims[2] = 224;
input_attrs[0].dims[3] = 3;
input_attrs[0].fmt=RKNN_TENSOR_NHWC;
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0)
{
fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n",
ret);
return -1;
}
```

其中，io\_num.n\_input 是输入数量,input\_attrs 是模型输入的 rknn\_tensor\_attr 结构体数组。

注：这里设置的shape必须包含在第2步查询到的 shape列表中。

```c
// 获取当前次推理的输入和输出shape
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input *
sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++)
{
cur_input_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
if (ret < 0)
{
printf("rknn_init error! ret=%d\n", ret);
return -1;
}
dump_tensor_attr(&cur_input_attrs[i]);
}
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output *
sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++)
{
```

```c
cur_output_attrs[i].index = i;
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR,
&(cur_output_attrs[i]), sizeof(rknn_tensor_attr));
if (ret != RKNN_SUCC)
{
printf("rknn_query fail! ret=%d\n", ret);
return -1;
}
dump_tensor_attr(&cur_output_attrs[i]);
}
```

### 注意事项：

## 4.推理

```cpp
// 设置输入信息
rknn_input inputs[io_num.n_input];
memset(inputs, 0, io_num.n_input * sizeof(rknn_input));
for (int i = 0; i < io_num.n_input; i++)
{
int height = cur_input_attrs[i].fmt == RKNN_TENSOR_NHWC ?
cur_input_attrs[i].dims[1] : cur_input_attrs[i].dims[2];
int width = cur_input_attrs[i].fmt == RKNN_TENSOR_NHWC ?
cur_input_attrs[i].dims[2] : cur_input_attrs[i].dims[3];
cv::resize(imgs[i], imgs[i], cv::Size(width, height));
inputs[i].index = i;
inputs[i].pass_through = 0;
inputs[i].type = RKNN_TENSOR_UINT8;
inputs[i].fmt = RKNN_TENSOR_NHWC;
inputs[i].buf = imgs[i].data;
inputs[i].size = imgs[i].total() * imgs[i].channels();
}
// 将输入数据转换成正确的格式后，放到输入缓冲区
ret = rknn_inputs_set(ctx, io_num.n_input, inputs);
if (ret < 0)
{
printf("rknn_input_set fail! ret=%d\n", ret);
return -1;
}
// 进行推理
printf("Begin perf ...\n");
double total_time = 0;
for (int i = 0; i < loop_count; ++i)
```

```c
int64_t start_us = getCurrentTimeUs();
ret = rknn_run(ctx, NULL);
int64_t elapse_us = getCurrentTimeUs() - start_us;
if (ret < 0)
{
printf("rknn run error %d\n", ret);
return -1;
}
total_time += elapse_us / 1000.f;
printf("%4d: Elapse Time = %.2fms, FPS = %.2f\n", i,
elapse_us / 1000.f, 1000.f * 1000.f / elapse_us);
}
printf("Avg FPS = %.3f\n", loop_count * 1000.f / total_time);
// 获取输出结果
rknn_output outputs[io_num.n_output];
memset(outputs, 0, io_num.n_output * sizeof(rknn_output));
for (uint32_t i = 0; i < io_num.n_output; ++i)
{
outputs[i].want_float = 1;
outputs[i].index = i;
outputs[i].is_prealloc = 0;
}
ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
if (ret < 0)
{
printf("rknn_outputs_get fail! ret=%d\n", ret);
return ret;
}
//释放输出缓冲区 buffer
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

##### 5.4.4.2 零拷贝 API

API 而言，初始化成功后，通过 rknn\_query()可以查询 RKNN 模型支持的列表，调 用 rknn\_create\_mem()接口分配的输入和输出内存。接着，通过调用ut\_shapes()接口，传入包含每个输入 shape 信息的 rknn\_tensor\_attr 数组指针可以设置当前推理使用的 shape。在设置输入 shape 后，可以再次调用 rknn\_query()查询设置成功后的输入和输出shape。最后，调用rknn\_set\_io\_mem()接口设置需要的输入输出内存。每次切换输入 shape 时，需要再设置一次新的 shape，准备新 shape 大小的数据并再次调用rknn\_set\_io\_mem() 接 口 ， 如 果 推 理 前 不 需 要 切 换 输 入 shape ， 无 需 重 复 调 用rknn\_set\_input\_shapes()接口。典型用法流程如下图所示：



图 5-11 动态shape输入接口的零拷贝 API调用流程

```c
// 创建最大的输入 tensor 内存
rknn_tensor_mem *input_mems[io_num.n_input];
for (int i = 0; i < io_num.n_input; i++)
{
// default input type is int8 (normalize and quantize need
compute in outside)
// if set uint8, will fuse normalize and quantize to npu
input_attrs[i].type = RKNN_TENSOR_UINT8;
// default fmt is NHWC, npu only support NHWC in zero copy
```

```c
mode
input_attrs[i].fmt = RKNN_TENSOR_NHWC;
input_mems[i] = rknn_create_mem(ctx,
input_attrs[i].size_with_stride);
}
// 创建最大的输出 tensor 内存
rknn_tensor_mem *output_mems[io_num.n_output];
for (uint32_t i = 0; i < io_num.n_output; ++i)
{
// default output type is depend on model, this require
float32 to compute top5
// allocate float32 output tensor
int output_size = output_attrs[i].size * sizeof(float);
output_mems[i] = rknn_create_mem(ctx, output_size);
}
// 加载输入并设置模型输入shape，每次切换输入 shape要调用一次
for (int s = 0; s < shape_num; ++s)
{
for (int i = 0; i < io_num.n_input; i++)
{
for (int j = 0; j < input_attrs[i].n_dims; ++j)
{
input_attrs[i].dims[j] =
shape_range[i].dyn_range[s][j];
}
}
ret = rknn_set_input_shapes(ctx, io_num.n_input,
input_attrs);
if (ret < 0)
{
fprintf(stderr, "rknn_set_input_shape error! ret=%d\n",
ret);
return -1;
}
// 获取当前次推理的输入和输出shape
printf("current input tensors:\n");
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input *
sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++)
{
cur_input_attrs[i].index = i;
// query info
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
if (ret < 0)
{
printf("rknn_init error! ret=%d\n", ret);
return -1;
}
dump_tensor_attr(&cur_input_attrs[i]);
}
printf("current output tensors:\n");
```

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output *
sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++)
{
cur_output_attrs[i].index = i;
// query info
ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR,
&(cur_output_attrs[i]), sizeof(rknn_tensor_attr));
if (ret != RKNN_SUCC)
{
printf("rknn_query fail! ret=%d\n", ret);
return -1;
}
dump_tensor_attr(&cur_output_attrs[i]);
}
// 指定 NPU 核心数量，仅 3588/3576 支持
rknn_set_core_mask(ctx, (rknn_core_mask)core_mask);
// 设置输入信息
rknn_input inputs[io_num.n_input];
memset(inputs, 0, io_num.n_input * sizeof(rknn_input));
std::vector<cv::Mat> resize_imgs;
resize_imgs.resize(io_num.n_input);
for (int i = 0; i < io_num.n_input; i++)
{
int height = cur_input_attrs[i].fmt ==
RKNN_TENSOR_NHWC ? cur_input_attrs[i].dims[1] :
cur_input_attrs[i].dims[2];
int width = cur_input_attrs[i].fmt ==
RKNN_TENSOR_NHWC ? cur_input_attrs[i].dims[2] :
cur_input_attrs[i].dims[3];
int stride = cur_input_attrs[i].w_stride;
cv::resize(imgs[i], resize_imgs[i], cv::Size(width,
height));
int input_size = resize_imgs[i].total() *
resize_imgs[i].channels();
// 拷贝外部数据到零拷贝输入缓冲区
if (width == stride)
{
memcpy(input_mems[i]->virt_addr,
resize_imgs[i].data, input_size);
}
else
{
int height = cur_input_attrs[i].dims[1];
int channel = cur_input_attrs[i].dims[3];
// copy from src to dst with stride
uint8_t *src_ptr = resize_imgs[i].data;
uint8_t *dst_ptr = (uint8_t
*)input_mems[i]->virt_addr;
// width-channel elements
int src_wc_elems = width * channel;
int dst_wc_elems = stride * channel;
for (int b = 0; b < cur_input_attrs[i].dims[0]; b++)
{
for (int h = 0; h < height; ++h)
```

```c
{
memcpy(dst_ptr, src_ptr, src_wc_elems);
src_ptr += src_wc_elems;
dst_ptr += dst_wc_elems;
}
}
}
}
// 更新输入零拷贝缓冲区内存
for (int i = 0; i < io_num.n_input; i++)
{
cur_input_attrs[i].type = RKNN_TENSOR_UINT8;
ret = rknn_set_io_mem(ctx, input_mems[i],
&cur_input_attrs[i]);
if (ret < 0)
{
printf("rknn_set_io_mem fail! ret=%d\n", ret);
return -1;
}
}
// 更新输出零拷贝缓冲区内存
for (uint32_t i = 0; i < io_num.n_output; ++i)
{
// default output type is depend on model, this require
float32 to compute top5
cur_output_attrs[i].type = RKNN_TENSOR_FLOAT32;
cur_output_attrs[i].fmt = RKNN_TENSOR_NCHW;
// set output memory and attribute
ret = rknn_set_io_mem(ctx, output_mems[i],
&cur_output_attrs[i]);
if (ret < 0)
{
printf("rknn_set_io_mem fail! ret=%d\n", ret);
return -1;
}
}
// 推理
printf("Begin perf ...\n");
double total_time = 0;
for (int i = 0; i < loop_count; ++i)
{
int64_t start_us = getCurrentTimeUs();
ret = rknn_run(ctx, NULL);
int64_t elapse_us = getCurrentTimeUs() - start_us;
if (ret < 0)
{
printf("rknn run error %d\n", ret);
return -1;
}
total_time += elapse_us / 1000.f;
printf("%4d: Elapse Time = %.2fms, FPS = %.2f\n", i,
elapse_us / 1000.f, 1000.f * 1000.f / elapse_us);
}
printf("Avg FPS = %.3f\n", loop_count * 1000.f /
total_time);
```

#

注意事项：

1. rknn\_set\_io\_mem()接口在动态 shape 情况下，输入 buffer 的 shape 和大小说明：

<sup>⚫</sup> 初 始 化 完 成 后 和 调 用 rknn\_set\_input\_shapes() 接 口 前 ， rknn\_query() 接 口 使 用RKNN\_QUERY\_INPUT\_ATTR 和 RKNN\_QUERY\_OUTPUT\_ATTR 查询输入和输出 Tensor的 shape 通常是最大的，用户可以使用这两个命令获取的大小来分配输入和输出内存。若遇到多输入模型，部分输入的 shape 可能不是最大的，此时需要搜索支持的 shape 中最大的规格，并分配最大的输入和输出内存。

rknn\_query() 接 口 中 ， 标 志 位 为 RKNN\_QUERY\_CURRENT\_INPUT\_ATTR 和RKNN\_QUERY\_CURRENT\_OUTPUT\_ATTR 时获取原始模型输入/输出的 shape，其格式为NHWC 或者 UNDEFINED；标志位为 RKNN\_QUERY\_CURRENT\_NATIVE\_INPUT\_ATTR和 RKNN\_QUERY\_CURRENT\_NATIVE\_OUTPUT\_ATTR 时获取 NPU 以最优性能读取数据时模型输入/输出的 shape，其格式为 NHWC 或者 NC1HWC2。

2. rknn\_set\_io\_mem()接口中使用的 buffer 排列格式为 NHWC 时，rknn\_tensor\_attr 中的shape 和 fmt 需按照 RKNN\_QUERY\_CURRENT\_INPUT\_ATTR 查询到的信息进行设置；如 果 使 用 buffer 排 列 格 式 为 NC1HWC2 时 ， 需 要 按 照RKNN\_QUERY\_CURRENT\_NATIVE\_INPUT\_ATTR 查询到的信息进行设置。

### 5.5 自定义算子

#### 5.5.1 自定义算子介绍

RKNN SDK提供了一种自定义算子的机制，它允许开发者在RKNN模型的推理阶段定义和执行自定义的算子。通过实现自定义算子，开发者可以扩展模型功能，并且针对特定硬件（CPU 或者 GPU）进行优化，以充分利用硬件资源并提高推理速度。同时，开发自定义算子需要深刻的理解深度学习计算原理和目标硬件平台的特性，以确保正确性和性能。

目前只支持ONNX 模型自定义算子。

RKNN自定义算子主要包括两大步骤：

<sup>⚫</sup> 使用 RKNN-Toolkit2 注册自定义算子并导出 RKNN 模型。

⚫ 编写自定义算子的C 代码实现，通过RKNN API 加载注册并执行。

整体流程如下图所示：



图5-12 注册自定义算子的完整流程

#### 5.5.2 整体流程介绍

##### 5.5.2.1 使用 RKNN-Toolkit2 注册自定义算子并导出 RKNN 模型

##### 5.5.2.2 编写自定义算子的 C代码实现，通过 RKNN API 加载注册并执行

2. 调用 rknn\_register\_custom\_ops()注册 rknn\_custom\_op 类的信息。

##### 5.5.2.3 使用 RKNN-Toolkit2 连板推理或精度分析

#### 5.5.3 Python 端处理

目前只有ONNX模型支持自定义算子，支持用户添加非 ONNX标准的算子。

◼ 算子的op\_type 不能与ONNX 标准算子相同，推荐以"cst"字符开头。

◼ 算子与其他算子必须要有连接关系，包含各个输入/输出的shape，数据类型等。

◼ 算子输入属性，支持 bool、int32、float32、int64 类型的单值或者数组。

ONNX 标准算子 cstSoftmax 的 ONNX 模型，修改方法如下：

```python
import onnx
path="test_softmax.onnx"
model=onnx.load(path)
for node in model.graph.node:
if node.op_type =="Softmax":
node.op_type = "cstSoftmax"
... # 修改 cstSoftmax 的属性定义等
onnx.save(model, "./test_softmax_custom.onnx")
```

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
```

◼ 自定义算子必须为一个 Python 类。

自定义算子类必须包含成员函数 shape\_infer(self, node, in\_shapes, in\_dtypes)，函数名、参数名都必须一致，否则报错。该函数用于自定义算子的shape推理，其中，node为ONNX的算子节点对象，该对象里包含了自定义算子的属性和输入输出信息；in\_shapes 为该算子所有输入的 shape 信息，格式为[shape\_0, shape\_1, ...]，列表内的 shape 的类型为列表；in\_dtypes 为该算子所有输入的 dtype 信息，格式为[dtype\_0, dtype\_1, ...], 列表内的 dtype 的类型为 numpy 的 dtype 类型。另外该函数需要返回该算子所有输出的 shape 信息和 dtype 信息，格式与 in\_shapes 和 in\_dtypes一致。

<sup>◼</sup> 自定义算子类必须包含成员函数 compute(self, node, inputs)，函数名和参数名都必须一致，否则报错。该函数用于自定义算子的推理。其中，node为ONNX的算子节点对象，该对象里包含了自定义算子的属性和输入输出信息；inputs 为该算子的输入数据，格式为[array\_0, array\_1, ...]，列表内的 array 的类型为 numpy 的ndarray 类型。另外该函数需要返回该算子所有输出的数据，格式与 inputs 一致。

```python
from rknn.api import RKNN
# Create RKNN object
rknn = RKNN(verbose=True)
# Pre-process config
print('--> Config model')
rknn.config(mean_values=[103.94, 116.78, 123.68],
std_values=[58.82, 58.82, 58.82],
quant_img_RGB2BGR=True, target_platform='rk3566')
print('done')
print('--> Register cstSoftmax op')
ret = rknn.reg_custom_op(cstSoftmax())
if ret != 0:
print('Register cstSoftmax op failed!')
exit(ret)
print('done')
print('--> Loading model')
ret = rknn.load_onnx(model='mobilenet_v2.onnx')
if ret != 0:
print('Load model failed!')
exit(ret)
print('done')
# Build model
print('--> Building model')
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
if ret != 0:
print('Build model failed!')
exit(ret)
print('done')
```

rknn.reg\_custom\_op()需要在 rknn.config()和 rknn.load\_xxx()之间调用。

#### 5.5.4 C API 部署

在得到带自定义算子的 RKNN 模型后，开始调用 C API 部署。首先，自定义算子的结



图5-13 注册自定义算子的 C API调用流程

##### 5.5.4.1 初始化自定义算子结构体

⚫ version：算子的版本号。

⚫ target：算子的执行后端设备，目前支持CPU和GPU。

⚫ op\_type: 算子的类型，与ONNX模型中的类型字段相同。

<sup>⚫</sup> cl\_kernel\_name: OpenCL 代码的 cl\_kernel 函数名。注册 GPU 算子时必须配置。

<sup>⚫</sup> cl\_kernel\_source： 自定 义算 子 的 .cl 文 件 全路 径或 者 OpenCL kernel 字 符 串 。当

<sup>⚫</sup> init :可选，在 rknn\_register\_custom\_ops 被调用一次。

<sup>⚫</sup> compute\_native: 保留，请设置成 NULL。

<sup>⚫</sup> destroy:可选，rknn\_destory 中执行一次。

<sup>⚫</sup> init/prepare/compute 回调函数参数定义规范如下:

<sup>◼</sup> rknn\_custom\_op\_context\* op\_ctx: op 回调函数的上下文信息

<sup>◼</sup> rknn\_custom\_op\_tensor\* inputs: op 输入 tensor 数据和信息

<sup>◼</sup> uint32\_t n\_inputs: op 输入个数

<sup>◼</sup> rknn\_custom\_op\_tensor\* outputs: op 输出 tensor 数据和信息

<sup>◼</sup> uint32\_t n\_outputs: op 输出个数

destroy 回调函数仅 rknn\_custom\_op\_context\* op\_ctx 一个参数。

### rknn\_custom\_op\_context

### rknn\_custom\_op\_tensor

表示输入/输出 tensor 的信息,包含 tensor 的名称、形状、大小、量化参数、虚拟基地址、

<sup>⚫</sup> GPU 算子

fd、数据偏移等信息。

用户在回调 compute()回调函数内无需创建该算子的输入和输出 tensor 内存。虚拟地址对应的数据在进入compute()回调函数时已经准备好。虚拟地址的计算公式是Tensor的有效地址=虚拟基地址+数据偏移，mem 成员的 virt\_addr 表示虚拟基地址,mem 成员的 offset 表示数据偏移(以字节为单位)。用户在回调函数内可以读取输入tensor的有效地址，该指向前一层算子已经计算后的输出数据，输出 tensor 的有效地址指向即将送给下一层算子的输入。rknn\_custom\_op\_attr

开发者通过调用 rknn\_custom\_op\_get\_op\_attr()接口传入属性字段获得属性信息，属性信息用 rknn\_custom\_op\_attr 表示，rknn\_custom\_op\_attr 中的 void 类型 buffer，dtype 以及元素数量表示一块内存段，开发者根据dtype使用C/C++将buffer强制转换指针类型可以得到相应数值类型的数组。

##### 5.5.4.1.1 init 回调函数

### <sup>⚫</sup> CPU 算子

```c
/**
* cpu kernel init callback for custom op
*/
int custom_op_init_callback(rknn_custom_op_context* op_ctx,
rknn_custom_op_tensor* inputs, uint32_t n_inputs,
rknn_custom_op_tensor* outputs, uint32_t
n _outputs)
printf("custom_op_init_callback\n");
// create tmp buffer
float* tmp_buffer = (float*)malloc(inputs[0].attr.n_elems *
sizeof(float));
op_ctx->priv_data = tmp_buffer;
return 0;
```

```c
**
* opencl kernel init callback for custom op
* */
int relu_init_callback_gpu(rknn_custom_op_context* op_ctx,
rknn_custom_op_tensor* inputs, uint32_t n_inputs,
rknn_custom_op_tensor* outputs, uint32_t n_outputs)
{
printf("relu_init_callback_gpu\n");
// 获取 opencl context
cl_context cl_ctx = (cl_context)op_ctx->gpu_ctx.cl_context;
// create tmp cl buffer
cl_mem* memObject = (cl_mem*)malloc(sizeof(cl_mem) * 2);
memObject[0] = clCreateBuffer(cl_ctx, CL_MEM_READ_WRITE,
inputs[0].attr.size, NULL, NULL);
memObject[1] = clCreateBuffer(cl_ctx, CL_MEM_READ_WRITE,
outputs[0].attr.size, NULL, NULL);
op_ctx->priv_data = memObject;
return 0;
```

##### 5.5.4.1.2 prepare 回调函数

该回调函数每帧推理都会调用，目前为预留实现。

##### 5.5.4.1.3 compute 回调函数

```c
/**
* float32 kernel implemetation sample for custom op
* */
int compute_custom_softmax_float32(rknn_custom_op_context* op_ctx,
rknn_custom_op_tensor* inputs, uint32_t n_inputs,
rknn_custom_op_tensor* outputs, uint32_t
n_outputs)
{
unsigned char* in_ptr = (unsigned char*)inputs[0].mem.virt_addr +
inputs[0].mem.offset;
unsigned char* out_ptr = (unsigned char*)outputs[0].mem.virt_addr +
outputs[0].mem.offset;
int axis = 0;
const float* in_data = (const float*)in_ptr;
float* out_data = (float*)out_ptr;
std::string name = "";
rknn_custom_op_attr op_name;
rknn_custom_op_get_op_attr(op_ctx, "name", &op_name);
if (op name.n elems > 0 && op name.dtype == RKNN TENSOR UINT8) {
name = (char*)op_name.data;
}
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
axis = ((int64_t*)op_attr.data)[0];

printf("op name = %s, axis = %d\n", name.c_str(), axis);
float* tmp_buffer = (float*)op_ctx->priv_data;
// kernel implemetation for custom op

int inside = 1;
int outside = 1;
int channel = 1;
while (axis < 0) {
axis += inputs[0].attr.n_dims;
}
for (int i = 0; i < axis; i++) {
outside *= inputs[0].attr.dims[i];
}
channel = inputs[0].attr.dims[axis];
for (int i = axis; i < inputs[0].attr.n_dims; i++) {
inside *= inputs[0].attr.dims[i];
}
for (int y = 0; y < outside; y++) {
const float* src_y = in_data + y * inside;
float* dst_y = out_data + y * inside;
float max_data = -FLT_MAX;
float sum_data = 0.0f;
for (int i = 0; i < inside; ++i) {
max_data = fmaxf(max_data, src_y[i]);
}
for (int i = 0; i < inside; ++i) {
tmp_buffer[i] = expf(src_y[i] - max_data);
sum_data += tmp_buffer[i];
for (int i = 0; i < inside; ++i) {
dst_y[i] = tmp_buffer[i] / sum_data;
}
}
return 0;
```

2. compute 回调函数（GPU）

对于GPU算子，开发者可以在回调函数中完成以下步骤：

⚫ 如有必要，用户自行创建的 op输入或输出的 cl\_mem对象缓冲区。

<sup>⚫</sup> 设置 cl\_kernel 的函数参数。

对于使用零拷贝的情况下，调用 clImportMemoryARM 可以自行协助用户把输入 tensor的内存映射到OpenCL的cl\_mem结构体中，输入tensor已包含输入数据，用户不需要自行再拷贝一次。该过程也可以在 init 回调函数中处理，然后将 cl\_mem 结构体记录到

⚫ 以阻塞的形式运行 cl\_kernel。

⚫ CL kernel 内的输入数据都是以 NCHW 形式排布给出。

假设开发者想实现一个自定义层，完成relu功能，GPU算子 compute函数示例如下：

```cpp
/**
* opencl kernel init callback for custom op
* */
int compute_custom_relu_float32(rknn_custom_op_context* op_ctx,
rknn_custom_op_tensor* inputs, uint32_t num_inputs,
rknn_custom_op_tensor* outputs,
uint32_t num_outputs)
1
std::string name = "";
rknn_custom_op_attr op_name;
rknn_custom_op_get_op_attr(op_ctx, "name", &op_name);
if (op_name.n_elems > 0 && op_name.dtype == RKNN_TENSOR_UINT8) {
name = (char*)op_name.data;
}
// get context
cl_context cl_ctx = (cl_context)op_ctx->gpu_ctx.cl_context;
// get command queue
cl_command_queue queue =
(cl_command_queue)op_ctx->gpu_ctx.cl_command_queue;
// get kernel
cl_kernel kernel = (cl_kernel)op_ctx->gpu_ctx.cl_kernel;
```

```c
// import input/output buffer
const cl_import_properties_arm props[3] = {
CL_IMPORT_TYPE_ARM,
CL_IMPORT_TYPE_DMA_BUF_ARM,
0,
};
cl_int status;
cl_mem inObject = clImportMemoryARM(cl_ctx, CL_MEM_READ_WRITE,
props, &inputs[0].mem.fd,
inputs[0].mem.offset +
inputs[0].mem.size, &status);
if (status != CL_SUCCESS) {
printf("Tensor: %s clImportMemoryARM failed\n",
inputs[0].attr.name);
}
cl_mem outObject = clImportMemoryARM(cl_ctx, CL_MEM_READ_WRITE,
props, &outputs[0].mem.fd,
outputs[0].mem.offset +
outputs[0].mem.size, &status);
if (status != CL_SUCCESS) {
printf("Tensor: %s clImportMemoryARM failed\n",
outputs[0].attr.name);
}
int in_type_bytes = get_type_bytes(inputs[0].attr.type);
int out_type_bytes =
get_type_bytes(outputs[0].attr.type);
int in_offset = inputs[0].mem.offset /
in_type_bytes;
int out_offset = outputs[0].mem.offset /
out_type_bytes;
unsigned int elems = inputs[0].attr.n_elems;
// set kernel args
int argIndex = 0;
clSetKernelArg(kernel, argIndex++, sizeof(cl_mem), &inObject);
clSetKernelArg(kernel, argIndex++, sizeof(cl_mem), &outObject);
clSetKernelArg(kernel, argIndex++, sizeof(int), &in_offset);
clSetKernelArg(kernel, argIndex++, sizeof(int), &out_offset);
clSetKernelArg(kernel, argIndex++, sizeof(unsigned int),
&elems);
// set global worksize
const size_t global_work_size[3] = {elems, 1, 1};
// enqueueNDRangeKernel
clEnqueueNDRangeKernel(queue, kernel, 1, NULL, global_work_size,
NULL, 0, NULL, NULL);
// finish command queue
clFinish(queue);
// //cpu access data after sync to device
// rknn_mem_sync(&outputs[0].mem, RKNN_MEMORY_SYNC_FROM_DEVICE);
// // save output npy
// char output_path[PATH_MAX];
// sprintf(output_path, "%s/cpu_output%d.npy", ".", 0);
```

```c
// unsigned char* out_data = (unsigned
char*)outputs[0].mem.virt_addr+outputs[0].mem.offset;
// save_npy(output_path, (float*)out_data, &inputs[0].attr);
return 0;
}
```

##### 5.5.4.1.4 destroy 回调函数

### ⚫ CPU 算子

```c
/**
* cpu kernel destroy callback for custom op
*/
int custom_op_destroy_callback(rknn_custom_op_context* op_ctx)
{
printf("custom_op_destroy_callback\n");
// clear tmp buffer
free(op_ctx->priv_data);
return 0;
```

### ⚫ GPU 算子

/\*\*   

\* opencl kernel destroy callback for custom op   

\*/   

int relu\_destroy\_callback\_gpu(rknn\_custom\_op\_context\* op\_ctx)   

```
{
// clear tmp buffer
printf("relu_destroy_callback_gpu\n");
cl_mem* memObject = (cl_mem*)op_ctx->priv_data;
clReleaseMemObject(memObject[0]);
clReleaseMemObject(memObject[1]);
free(memObject);
return 0;
```

##### 5.5.4.2 注册自定义算子

### ⚫ CPU 算子

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN
1);
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
}
```

### ⚫ GPU 算子

对于GPU算子而言，支持以常量字符串或者文件路径的两种方式注册 OpenCLkernel。当 rknn\_custom\_op 结构体中的 cl\_source\_size 等于 0 时，cl\_kernel\_source 表示 OpenCL kernel 的文件路径，当 cl\_source\_size 大于 0 时 cl\_kernel\_source 表示OpenCL kernel 函数字符串。以字符串保存的 relu 功能的 OpenCL kernel 的示例代码如

```lisp
char* cl_kernel_source = "#pragma OPENCL EXTENSION cl_arm_printf : enable
\n"
"#pragma OPENCL EXTENSION cl_khr_fp16 : enable \n"
kernel void relu_float(__global const float* input, __global float*
output, int "
"in_offset, int out_offset, const unsigned int elems) \n"
"{\n"
" int gid = get_global_id(0);\n"
" if (gid < elems) {\n"
" float in_value = input[in_offset + gid];\n"
output[out_offset + gid] = in_value >= 0.f ? in_value : 0.f;\n"
" }\n"
"}\n"
"__kernel void relu_half(__global const half* input, __global half*
output, int in_offset,
"int out_offset, const unsigned int elems)\n"
"{\n"
" int gid = get_global_id(0);\n"
" if (gid < elems) {\n"
" half in_value = input[in_offset + gid];\n"
output[out_offset + gid] = in_value >= 0.f ? in_value : 0.f;\n"
" }\n"
"}\n";
```

```c
// GPU operators
rknn_custom_op user_op[1];
memset(user_op, 0, sizeof(rknn_custom_op));
strncpy(user_op->op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op->version = 1;
user_op->target = RKNN_TARGET_TYPE_GPU;
user_op->init = relu_init_callback_gpu;
user_op->compute = compute_custom_relu_float32;
user_op->destroy = relu_destroy_callback_gpu;
#ifdef LOAD_FROM_PATH
user_op->cl_kernel_source = "./custom_op.cl";
user_op->cl_source_size = 0;
#else
user_op->cl_kernel_source = cl_kernel_source;
user_op->cl_source_size = strlen(cl_kernel_source);
#endif
strcpy(user_op->cl_kernel_name, "relu_float");
ret = rknn_register_custom_ops(ctx, user_op, 1);
if (ret < 0) {
printf("rknn_register_custom_ops fail! ret = %d\n", ret);
return -1;
```

##### 5.5.4.3 模型推理

在注册完所有算子后，可以使用通用 API或零拷贝API 流程完成推理。

##### 5.5.4.4 连板精度分析

自定义算子的连板调试功能要求 rknn\_server 版本&gt;=1.6.0。

若用户需要对包含自定义算子的模型做连板精度分析，具体步骤如下：

2. 插件放到/vendor/lib64/（Android arm64-v8a）或/usr/lib/rknpu/op\_plugins（Linux）

```c
**
* To obtain operator information to be registered, a plugin
library must
* have one and only one of this function.
*/
RKNN_CUSTOM_OP_EXPORT rknn_custom_op* get_rknn_custom_op()
{
// register a custom op
memset(&user_op, 0, sizeof(rknn_custom_op));
strncpy(user_op.op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op.version = 1;
user_op.target = RKNN_TARGET_TYPE_CPU;
user_op.init = custom_op_init_callback;
user_op.compute = compute_custom_softmax_float32;
user_op.destroy = custom_op_destroy_callback;
return &user_op;
```

```c
std::vector<std::string> get_all_plugin_paths(std::string
plugin_dir)
std::vector<std::string> plugin_paths;
if (access(plugin_dir.c_str(), 0) != 0) {
fprintf(stderr, "Can not access plugin directory: %s, please
check it!\n", plugin_dir.c_str());
}
DIR* dir;
struct dirent* ent;
const char* prefix = RKNN<sub>_</sub>CSTOP<sub>_</sub>PLUGIN<sub>_</sub>PREFIX; // 所有库文件名应
该以此前缀开头
if ((dir = opendir(plugin_dir.c_str())) != NULL) {
while ((ent = readdir(dir)) != NULL) {
if (ent->d_type == DT_REG) {
const char* filename = ent->d_name;
size_t len = strlen(filename);
if (len > 10 && strncmp(filename, prefix, strlen(prefix))
== 0) {
printf("Found plugin: %s file in %s\n", filename,
plugin_dir.c_str());
plugin_paths.push_back(plugin_dir + "/" + filename);
}
}
}
closedir(dir);
} else {
fprintf(stderr, "Unable to open directory");
```

```
return plugin_paths;
}
// the default path of the custom operator plugin libraries
std::string plugin_dir =
#if defined(__ANDROID__)
```

# if defined(\_\_aarch64\_\_)   

"/vendor/lib64/";   

# else   

"/vendor/lib/";   

# endif // \_\_aarch64   

#elif defined(\_\_linux\_\_)   

"/usr/lib/rknpu/op\_plugins/";   

```
#endif
std::vector<std::string> plugin_paths =
get_all_plugin_paths(plugin_dir);
std::vector<void*> so_handles;
for (auto path : plugin_paths) {
printf("load plugin %s\n", path.c_str());
void* plugin_lib = dlopen(path.c_str(), RTLD_NOW);
char* error = dlerror();
if (error != NULL) {
fprintf(stderr, "dlopen %s fail: %s.\nPlease try to set
'export LD_LIBRARY_PATH=\$LD_LIBRARY_PATH:%s'\n",
path.c_str(), error, plugin_dir.c_str());
dlclose(plugin_lib);
return -1;
}
printf("dlopen %s successfully!\n", path.c_str());
get_custom_op_func custom_op_func =
(get_custom_op_func)dlsym(plugin_lib, "get_rknn_custom_op");
error = dlerror();
if (error != NULL) {
fprintf(stderr, "dlsym fail: %s\n", error);
dlclose(plugin_lib);
return -1;
}
rknn_custom_op* user_op = custom_op_func();
ret = rknn_register_custom_ops(ctx, user_op,
1);
if (ret < 0) {
printf("rknn_register_custom_ops fail! ret = %d\n", ret);
return -1;
}
so_handles.push_back(plugin_lib);
```

插件库有如下注意事项：

⚫ 插件库的名称必须以"librkcst\_"开头，以.so结尾。

```c
#ifdef cplusplus
extern "C" {
#endif
//code
#ifdef _cplusplus
} // extern "C"
#endif
```

### 5.6 多 Batch 使用说明

#### 5.6.1 多 Batch 原理

RK3588 NPU内部有3个核心，RK3576 NPU内部有2个核心，为了更高效得利用多核性能，提供了多 batch 推理功能。当开启多 batch 推理时，内部会调用 rknn\_dup\_context 将context 进行拷贝（rknn\_dup\_context 只会对 context 的 Internal 进行拷贝，Weight 会复用）。当 rknn\_batch\_size=2 时，会拷贝 1 份，当 rknn\_batch\_size &gt;=3 时，会拷贝 2 份（同一时刻最多只有3个核心工作，为了避免内存浪费只拷贝2份）。每个context core\_mask 会设置成 0，让多核内部自动调度。当执行 rknn\_run()时，内部会起一个线程池，同一时刻调用 3个线程同时对3个context进行推理。



图 5-14 多 batch 内部原理图

#### 5.6.2 多 Batch 使用方式

多batch使用方式如下：

1. Python 端开启多 batch 设置：

```python
ret = rknn.build(do_quantization=True, dataset='./dataset.txt',
rknn_batch_size=3)
```

2. 建议使用零拷贝接口

#### 5.6.3 多 Batch 输入输出设置

当开启多batch功能时，查询出来的输入输出size是未开启时的rknn\_batch\_size倍。内部每个 context 会各自算自己的一个输入偏移量，按照这个输入偏移量取输入数据做推理，然后各自算自己的一个输出偏移量，按照这个输出偏移量写到各自的输出。以第二个 batch为例，输入偏移量是查询出来的 input\_size 除以 rknn\_batch\_size，输出偏移量是查询出来的output\_size 除以 rknn\_batch\_size。



图5-15 多batch内部输入输出地址偏移图

### 5.7 RK3588 NPU SRAM 使用说明

<sup>⚫</sup> RK3588 SOC 内部含有 1MB 的 SRAM，其中有 956KB 可供给 SOC 上各个 IP 所使用。

SRAM 可以帮助 RKNPU 应用减轻 DDR 带宽压力，但对推理耗时可能有一定影响。

#### 5.7.1 板端环境要求

##### 5.7.1.1 内核环境要求

<sup>⚫</sup> RKNPU 驱动版本&gt;=0.9.2

<sup>⚫</sup> 内核 config 需要开启 CONFIG\_ROCKCHIP\_RKNPU\_SRAM=y

<sup>◼</sup> Android 系统 config 路径如下：

&lt;path-to-your-kernel&gt;/arch/arm64/configs/rockchip\_defconfig

<sup>⚫</sup> Linux 系统 config 路径如下：

&lt;path-to-your-kernel&gt;/arch/arm64/configs/rockchip\_linux\_defconfig

⚫ 内核相应DTS 需要从系统SRAM中分配给RKNPU使用

◼ 如下为956KB 全部分配给RKNPU 的例子：

```dts
syssram: sram@ff001000 {
compatible = "mmio-sram";
reg = <0x0 0xff001000 0x0 0xef000>;
#address-cells = <1>;
#size-cells = <1>;
ranges = <0x0 0x0 0xff001000 0xef000>;
```

/\* 分配 RKNPU SRAM / / start address and size should be 4k   

algin \*/   

```
rknpu_sram: rknpu_sram@0 {
reg = <0x0 0xef000>; // 956KB
};
};
```

◼ 把分配的SRAM挂到RKNPU节点，修改如下所示的 dtsi文件：

&lt;path-to-your-kernel&gt;/arch/arm64/boot/dts/rockchip/rk3588s.dtsi

```dts
rknpu: npu@fdab0000 {
compatible = "rockchip,rk3588-rknpu";
```

/\* ... / / 增加 RKNPU sram 的引用 \*/   

rockchip,sram = &lt;&rknpu\_sram&gt;;   

```
status = "disabled";
};
```

##### 5.7.1.2 RKNN SDK 版本要求

<sup>⚫</sup> RKNPU Runtime 库(librknnrt.so)版本&gt;=1.6.0

#### 5.7.2 使用方法

例如：

ret = rknn\_init(&ctx, rknn\_model, size, RKNN\_FLAG\_ENABLE\_SRAM,   

NULL);

注意：

#### 5.7.3 调试方法

##### 5.7.3.1 SRAM 是否启用查询

通过开机内核日志查看 SRAM是否启用，包含为RKNPU指定SRAM的地址范围和大

小信息，如下所示：

##### 5.7.3.2 SRAM 使用情况查询

⚫ 可通过节点查询SRAM 的使用情况

⚫ 如下为未使用 SRAM 的位图表，每个点表示 4K 大小

rk3588\_s:/ # cat /sys/kernel/debug/rknpu/mm   

SRAM bitmap: "\*" - used, "." - free (1bit = 4KB)   

[000] [................................]   

[001] [................................]   

[002] [................................]   

[003] [................................]   

[004] [................................]   

[005] [................................]   

[006] [.................   

[007] [...............]   

SRAM total size: 978944, used: 0, free: 978944   

# 单位为 Byte

⚫ 如下为分配使用512KB 后的SRAM位图表

rk3588\_s:/ # cat /sys/kernel/debug/rknpu/mm   

SRAM bitmap: "\*" - used, "." - free (1bit = 4KB)   

[000] [\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*]   

[001] [\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*]   

[002] [\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*]   

[003] [\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*]   

[004] [................................]   

[005] [................................]   

[006] [................................]   

[007] [...............]   

SRAM total size: 978944, used: 524288, free: 454656   

# 单位为 Byte

##### 5.7.3.3 通过 RKNN API 查询 SRAM 大小

<sup>⚫</sup> 通过 rknn\_query()的 RKNN\_QUERY\_MEM\_SIZE 接口查询 SRAM 大小信息

```c
typedef struct _rknn_mem_size {
uint32_t total_weight_size;
uint32_t total_internal_size;
uint64_t total_dma_allocated_size;
uint32_t total_sram_size;
uint32_t free_sram_size;
uint32_t reserved[10];
} rknn_mem_size;
```

<sup>⚫</sup> 其中，total\_sram\_size 表示：系统给 RKNPU 分配的 SRAM 总大小，单位是 Byte。

<sup>⚫</sup> free\_sram\_size 表示：剩余 RKNPU 能使用的 SRAM 大小，单位是 Byte。

##### 5.7.3.4 查看模型 SRAM 的占用情况

⚫ 板端环境中，RKNN应用运行前设置如下环境变量，可打印SRAM使用预测情况：

```
export RKNN_LOG_LEVEL=3
```

⚫ Internal 分配 SRAM 的逐层占用情况，如下日志所示：

```csv
Total allocated Internal SRAM Size: 524288, Addr: [0xff3e0000, 0xff460000)
ID User Tensor DataType OrigShape NativeShape | [Start
End) Size | SramHit
1 ConvRelu input0 INT8 (1,3,224,224) (1,1,224,224,3) |
0xff3b0000 0xff3d4c00 0x00024c00 | \
2 ConvRelu output2 INT8 (1,32,112,112) (1,2,112,112,16) |
0xff404c00 0xff466c00 0x00062000 | 0x0005b400
3 ConvRelu output4 INT8 (1,32,112,112) (1,4,112,112,16) |
0xff466c00 0xff52ac00 0x000c4000 | 0x00000000
4 ConvRelu output6 INT8 (1,64,112,112) (1,4,112,112,16) |
0xff52ac00*0xff5eec00 0x000c4000 | 0x00000000
5 ConvRelu output8 INT8 (1,64,56,56) (1,4,56,56,16)
0xff3e0000 0xff411000 0x00031000 | 0x00031000
6 ConvRelu output10 INT8 (1,128,56,56) (1,8,56,56,16)
0xff411000 0xff473000 0x00062000 | 0x0004f000
7 ConvRelu output12 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff473000 0xff4d5000 0x00062000 | 0x00000000
8 ConvRelu output14 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff3e0000 0xff442000 0x00062000 | 0x00062000
9 ConvRelu output16 INT8 (1,128,28,28) (1,8,28,28,16)
0xff442000 0xff45a800 0x00018800 | 0x00018800
10 ConvRelu output18 INT8 (1,256,28,28) (1,16,28,28,16)
0xff3e0000 0xff411000 0x00031000 | 0x00031000
11 ConvRelu output20 INT8 (1,256,28,28) (1,16,28,28,16)
0xff411000 0xff442000 0x00031000 | 0x00031000
12 ConvRelu output22 INT8 (1,256,28,28) (1,16,28,28,16)
0xff3e0000 0xff411000 0x00031000 | 0x00031000
13 ConvRelu output24 INT8 (1,256,14,14) (1,16,14,14,16)
0xff411000 0xff41d400 0x0000c400 | 0x0000c400
14 ConvRelu output26 INT8 (1,512,14,14) (1,32,14,14,16)
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
15 ConvRelu output28 INT8 (1,512,14,14) (1,32,14,14,16)
```

```csv
0xff3f8800 0xff411000 0x00018800 | 0x00018800
16 ConvRelu output30 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 0x00018800
17 ConvRelu output32 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
18 ConvRelu output34 INT8 (1,512,14,14) (1,32,14,14,16)
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
19 ConvRelu output36 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
20 ConvRelu output38 INT8 (1,512,14,14) (1,32,14,14,16)
0xff3e0000 0xff3f8800 0x00018800 0x00018800
21 ConvRelu output40 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 0x00018800
22 ConvRelu output42 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
23 ConvRelu output44 INT8 (1,512,14,14) (1,32,14,14,16)
0xff3f8800 0xff411000 0x00018800 | 0x00018800
24 ConvRelu output46 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 0x00018800
25 ConvRelu output48 INT8 (1,512,7,7) (1,33,7,7,16) |
0xff3f8800 0xff3ff000 0x00006800 | 0x00006800
26 ConvRelu output50 INT8 (1,1024,7,7) (1,67,7,7,16)
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
27 ConvRelu output52 INT8 (1,1024,7,7) (1,67,7,7,16)
0xff3ed000 0xff3fa000 0x0000d000 | 0x0000d000
28 AveragePool output54 INT8 (1,1024,7,7) (1,67,7,7,16)
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
29 Conv output55 INT8 (1,1024,1,1) (1,64,1,1,16) | 0xff3ed000
0xff3ed400 0x00000400 | 0x00000400
30 Softmax output56 INT8 (1,1000,1,1) (1,64,1,1,16)
0xff3e0000 0xff3e0400 0x00000400 | 0x00000400
31 OutputOperator output57 FLOAT (1,1000,1,1) (1,1000,1,1) |
0xff3ae000 0xff3aefa0 0x00000fa0 | \
```

Total Weight Memory Size: 4260864   

Total Internal Memory Size: 2157568   

Predict Internal Memory RW Amount: 11068320   

Predict Weight Memory RW Amount: 4260832   

Predict SRAM Hit RW Amount: 6688768

⚫ 注意：Linux 环境日志重定向到终端，Android 环境日志重定向到 logcat。

### 5.8 模型剪枝

但并不是所有模型都可以进行无损剪枝，无损剪枝是根据模型的权重的稀疏化程度，

来去除一些对模型结果不造成影响的权重和 Feature 通道，以减小模型的大小和模型的计算量。在启用模型剪枝配置后（将 rknn.config()的 model\_pruning 参数设为 True），模型转换时会自动根据权重的稀疏化程度对模型进行剪枝。

如果模型剪枝成功，则会打印剪枝结果，如下：

I model\_pruning results:   

Weight: -1.12145 MB (-6.9%)   

GFLOPs: -0.15563 (-13.4%)

### 5.9 模型加密

模型加密指的是生成完 RKNN 模型后，再重新对其做进一步处理。使用rknn.export\_rknn()生成的模型，可以通过 Netron 等第三方工具查看图结构。模型加密后，Netron 等第三方工具将无法查看相应的网络结构，也无法获取权重，起到对模型的保护作用。当前加密后的 RKNN 模型使用方法和未加密的模型一样，不需要在开发板推理时做任何修改。

使用方法如下：

```python
# Create RKNN object
rknn = RKNN()
# Export encrypted RKNN model
crypt_level= 1
ret = rknn.export_encrypted_rknn_model("input.rknn",
"encrypt.rknn", crypt_level)
if ret != 0:
print('Encrypt RKNN model failed!')
```

<sup>⚫</sup> 支持平台：RK3562/RK3566/RK3568/RK3588/RK3576

### 5.10 Cacheable 内存一致性

#### 5.10.1 Cacheable 内存同步的方向

当 CPU 写数据到 cacheable 的内存，之后 NPU 访问该内存时，要保证 CPU cache 的数据同步到 DDR 中，此时同步的方向是指从 CPU 到 NPU 设备；当 NPU 写完数据，CPU 开始访问该内存时，要保证DDR的数据与CPU cache中的一致，此时同步的方向是指从NPU设备到 CPU。RKNN C API 提供了 rknn\_mem\_sync\_mode 枚举类型表示 cacheable 内存同步的方向，数据结构如下：

```c
/*
The mode to sync cacheable rknn memory.
*/
typedef enum _rknn_mem_sync_mode {
RKNN_MEMORY_SYNC_TO_DEVICE = 0x1, /* the mode used for
consistency of device access after CPU accesses data. */
RKNN_MEMORY_SYNC_FROM_DEVICE = 0x2, /* the mode used for
consistency of CPU access after device accesses data. */
RKNN_MEMORY_SYNC_SYNC_BIDIRECTIONAL =
RKNN_MEMORY_SYNC_TO_DEVICE | RKNN_MEMORY_SYNC_FROM_DEVICE, /* the
mode used for consistency of data access
between device and CPU in both directions. */
} rknn_mem_sync_mode;
```

<sup>⚫</sup> RKNN\_MEMORY\_SYNC\_TO\_DEVICE ：表示数据同步方向是 CPU 到 NPU 设备

<sup>⚫</sup> RKNN\_MEMORY\_SYNC\_FROM\_DEVICE ：表示数据同步方向是 NPU 设备到 CPU

#### 5.10.2 同步 Cacheable 内存

int rknn\_mem\_sync(rknn\_context context, rknn\_tensor\_mem\* mem,   

rknn\_mem\_sync\_mode mode);

### 5.11 模型稀疏化推理

#### 5.11.1 稀疏化原理

模型权重稀疏化在训练阶段根据用户自定义的方式，进行权重置零操作，具体方式有4:2 输入方向稀疏化，4:2 输出方向稀疏化，16:4 输入输出稀疏化，16:4 输出输入稀疏化。其中 4:2 输入方向稀疏化实现原理如图 5-16 所示，将模型权重沿输入方向，在连续的 4 个数值中选择两个置零。需要注意的是，当模型权重指定方向非 4 对齐时，会进行补齐操作。



图 5-164:2输入方向稀疏化原理图

有关四种权重稀疏化说明如表 5-10 所示，其中输入输出方向为权重的方向，例如 2 维卷积 shape 为 $\mathrm &#123; C _ &#123; \mathrm &#123; o u t &#125; &#125; &#123; \times &#125; C _ &#123; \mathrm &#123; i n &#125; &#125; &#123; \times &#125; K _ &#123; h &#125; &#123; \times &#125; K _ &#123; w &#125; &#125; ,$ 输入方向即 $\mathbf &#123; C &#125; _ &#123; \mathrm &#123; i n &#125; &#125; ,$ ，输出方向即 $\mathrm &#123; C _ &#123; o u t &#125; &#125;$ 。在稀疏率为 75%的方式中前置训练模型可以是未稀疏化模型也可以是稀疏模型，建议使用单方向稀疏模型作为前置预训练模型，可减少稀疏化后的精度损失。

表5-10 模型权重稀疏化说明


| 1稀疏化方式 | 稀疏率 | 说明 |
| --- | --- | --- |
| 4:2输入方向稀疏化 | 50% | 沿输入方向对权重稀疏化 |
| 4:2输出方向稀疏化 | 50% | 沿输出方向对权重稀疏化 |
| 16:4输入输出稀疏化 | 75% | 先沿输入方向4:2稀疏，再沿输出方向4:2稀疏 |
| 16:4输出输入稀疏化 | 75% | 先沿输出方向4:2稀疏，再沿输入方向4:2稀疏 |

#### 5.11.2 训练稀疏化模型

1.首先确保 cuda 可使用并安装对应 python 版本的 autosparsity 包

toolkit2/tree/master/autosparsity/packages

2.以 torchvision 中的 resnet50 的 4:2 输入方向稀疏化为例，进行权重稀疏化训练

```python
import torch
import torchvision.models as models
from autosparsity.sparsity import sparsity_model
if __name__ == "__main__":
model = models.resnet50(pretrained=True).cuda()
optimizer = None
mode = 0
sparsity_model(model, optimizer, mode)
model.eval()
x = torch.randn((1,3,224,224)).cuda()
torch.onnx.export(
model, x, 'resnet50.onnx', input_names=['inputs'],
output_names=['outputs']
```

自定义模型的稀疏化在模型训练之前添加 sparsity\_model 函数即可，参考示例如下：

```python
# insert model autosparsity code before training
import torch
import torchvision.models as models
from autosparsity.sparsity import sparsity_model
model = models.resnet34(pretrained=True).cuda()
mode = 0
sparsity_model(model, optimizer, mode)
# normal training
x, y = DataLoader(args)
for epoch in range(epochs):
y_pred = model(x)
loss = loss_func(y_pred, y)
loss.backward()
optimizer.step()
```

有关 sparsity\_model 函数的参数说明如下：

表 5-11 sparsity\_model 函数各参数说明


| 参数 | 详细说明 |
| --- | --- |
| model | 原训练模型 |
| optimizer | 原优化器，默认为None |
| mode | 稀疏化方式，可选值为0,1,2,3，默认为00:4:2输入方向稀疏化(50%稀疏率)1:4:2输出方向稀疏化(50%稀疏率)2:16:4输入输出稀疏化(75%稀疏率)3:16:4输出输入稀疏化(75%稀疏率) |
| verbose | 1og 等级，可选值为 0,1,2,3，默认为20: Errors1: Errors and Warnings2: Errors, warnings and info |
| whitelist | 稀疏化支持的 module 列表，支持 1d conv，2d conv，3d conv,linear,  MultiheadAttention，默 认 [torch.nn.Linear,torch.nn.Conv2d] |
| allowed_layer_names | 允许稀疏化的层名，用户配置时则只稀疏指定层，默认None |
| disallowed_layer_names | 不允许稀疏化的层名，用户配置时则会跳过该层，默认[] |
| fast | 设为 True 代表使用快速方法计算 mask，默认为 False(默认的mask计算方法针对部分模型会失效，若稀疏化报错可尝试将该参数设为 True) |

#### 5.11.3 RKNN 稀疏化推理使用方法

rknn.config(target\_platform=’rk3576’, sparse\_infer=True)完 整 的 稀 疏 化 Python 推 理 代 码 可 参 考 ： https://github.com/airockchip/rknn-toolkit2/tree/master/autosparsity/examples

使用 C API 进行部署时，首先使用 RKNN-Toolkit2 在 config()接口中设置“sparse\_infer”参数为True生成带稀疏化推理的RKNN模型，之后正常调用通用API接口流程或零拷贝接口流程即可。

使用 Python 代码推理时可在构建 RKNN 对象时设置 verbose=True，开启日志打印各层稀疏化情况；使用 C API 推理时通过设置环境变量 RKNN\_LOG\_LEVEL=4，开启日志打印各层稀疏化情况。日志信息如下：



图 5-17 4:2 输入方向稀疏化 Python 打印日志  



图 5-18 4:2 输入方向稀疏化 C API 打印日志

其中SparseRation 代表稀疏率，4:2输入方向稀疏化对应50%(IC)，4:2输出方向稀疏化对应 50%(OC)，16:4 输入输出稀疏化和 16:4 输出输入稀疏化对应 75%。0%则代表未做稀疏化。

#### 5.11.4 RKNN 稀疏化推理限制

稀疏化推理是基于 NPU 的硬件架构实现，受硬件规格限制，RK3576 的稀疏化推理目前只支持 2d Conv 并且 group 参数为 1，其余限制如下：

表 5-12 RK3576 稀疏化推理限制


|  | 通道数量 | 数据类型 |
| --- | --- | --- |
| 4:2输入方向稀疏化 | 输入32对齐，输出32对齐 | Int8Float16 不支持 |
| 4:2输出方向稀疏化 | 输入32对齐，输出32对齐 | Int8Float16 不支持 |
| 16:4输入输出稀疏化 | 输入32对齐，输出32对齐 | Int8Float16 不支持 |
| 16:4输出输入稀疏化 | 输入32对齐，输出32对齐 | OInt8                  Float16 不支 |

### 5.12 生成部署 C 代码

RKNN-Toolkit2 2.0.0 版本新增 Codegen 接口，用于生成模型部署代码，简化开发者的上 手 难 度 。 Codegen 基 于 CAPI 零 拷 贝 接 口 进 行 二 次 封 装 ， 接 口 风 格 与开发者也可以基于生成的代码进行二

使用示例：

```python
ret = rknn.codegen(output_path='./rknn_app_demo',
inputs=['../../caffe/mobilenet_v2/dog_224x224.jpg'],
overwrite=True)
```

<sup>⚫</sup> 调用 codegen 接口前，必须先调用 rknn.export 接口保存 RKNN 模型

⚫ output\_path 为输出文件夹目录，用户可配置目录名称

⚫ inputs 填写模型输入的路径列表，允许不填。有效文件格式为 jpg/png/npy，以 npy 文件为输入时，npy数据的维度信息应与模型输入的维度信息保持一致

⚫ overwrite 设为 True 时，会覆盖 output<sub>\_</sub>path 指定目录下的文件。默认值为False

⚫ 生成部署代码后，请参考生成目录下的README.md 文档说明进行编译、测试

⚫ 若inputs填入有效值，部署代码示例在推理后，会评估CAPI接口与RKNN-Toolkit2模拟器之间的推理结果差异，评估方式为对比每一个输出的余弦相似度

⚫ 无 NPU 硬件平台限制，要求板端系统为 Linux 或 Android

⚫ 支持量化、非量化模型

### 5.13 ONNX 模型编辑

部分模型在转RKNN模型后，可能存在冗余的op，常见于模型的输入输出节点处存在冗余的 reshape、transpose op，影响了 RKNN 模型的推理性能。RKNN-Toolkit2 提供了onnx\_edit 接口，用于修改 ONNX 模型的输入输出的维度定义，使调整后的 onnx 模型能转出性能更好的 RKNN 模型，减少冗余的 reshape、transpose op。

#### 5.13.1 onnx\_edit 接口说明

使用示例：

```python
from rknn.utils import onnx_edit
ret = onnx_edit(model = './concat_block.onnx',
export_path = './concat_block_edited.onnx',
inputs_transform = {'k_in':
'a,b,c,d->1,ad,b,c'},
outputs_transform = {'k_cache':
'a,b,c,d->1,ab,c,d'},
dataset = './dataset.txt'
```

⚫ model 填入待修改模型，为必填参数

⚫ export<sub>\_</sub>path 填入新模型的生成路径，为必填参数

⚫ inputs\_transform 填入输入节点的变换公式字典，key 为节点名称，value 为变换公式。为可选参数，默认为空字典

⚫ outputs\_transform填入输出节点的变换公式字典。为可选参数，默认为空字典

dataset 填入输入数据的路径集文件，文件格式要求与 rknn.build 接口对 dataset 的要求一致。填入后，onnx\_edit接口除了对模型的输入输出定义进行调整，也会将 dataset 中对应的数据进行调整，在 export<sub>\_</sub>path 同级目录下生成新的 dataset 数据，可用于新模型的验证、量化。为可选参数，默认为空。

#### 5.13.2 onnx\_edit 变换公式说明

onnx\_edit 接口中的 inputs<sub>\_</sub>transform、outputs<sub>\_</sub>transform 需要填入变换公式。变换公式的定义与 einsum 算子的定义类似，例如 $\prime &#123; \tt a &#125; , &#123; \tt b &#125; , &#123; \tt c &#125; , &#123; \tt d &#125; &#123; - &#125; &gt; 1 , &#123; \tt a &#125; &#123; \tt d &#125; , &#123; \tt b &#125; , &#123; \tt c &#125; ^ &#123; \prime &#125;$ 公式，指将原始的维度为 $\prime \mathsf &#123; a &#125; , \mathsf &#123; b &#125; , \mathsf &#123; c &#125; , \mathsf &#123; d &#125; ^ &#123; \prime &#125;$ ，变换后为 $^ &#123; \prime &#125; 1 , \mathsf &#123; a d &#125; , \mathsf &#123; b &#125; , \mathsf &#123; c &#125; ^ &#123; \prime &#125;$ 。变换公式的填写规则如下：

$^ &#123; \prime &#125; \mathtt &#123; C &#125; , \mathtt &#123; a &#125; \mathrm &#123; - &#125; &gt; \mathtt &#123; a &#125; , \mathtt &#123; c &#125; ^ &#123; \prime &#125;$

$\prime a , b , c , d \prime$ $\prime \mathsf &#123; a &#125; , \mathsf &#123; b &#125; , 1 , \mathsf &#123; d &#125; ^ &#123; \prime &#125;$

$\prime &#123; \tt a &#125; , 1 , &#123; \tt c &#125; , &#123; \tt d - &gt; a c &#125; , &#123; \tt d &#125; , 1 $ $^ &#123; \prime &#125; &#123; \mathsf &#123; a &#125; &#125; , 1 , &#123; \mathsf &#123; c &#125; &#125; , &#123; \mathsf &#123; d &#125; &#125; &#123; \mathsf &#123; - &#125; &#125; &gt; &#123; \mathsf &#123; a &#125; &#125; &#123; \mathsf &#123; c &#125; &#125; , 1 ^ &#123; \prime &#125;$

$^ &#123; \prime &#125; a , b , c &#123; - &#125; &gt;$ $\mathsf &#123; a &#125; , 1 , \mathsf &#123; c b &#125; , 1 , 1 ^ &#123; \bullet &#125;$

原始字符shape，允许用多个字母以及赋值公式来表示对shape进行拆分，例如原始输入定义是 [32,4,1,64]， $^ &#123; \prime &#125; &#123; \mathrm &#123; a b &#125; &#125; , \mathsf &#123; c &#125; , \mathsf &#123; d &#125; , \mathsf &#123; q &#125; \mathsf &#123; k &#125; [ &#123; \mathsf &#123; a &#125; &#125; &#123; = &#125; 2 , \mathsf &#123; k &#125; &#123; = &#125; 8 ] \to \mathsf &#123; a q &#125; , \mathsf &#123; c &#125; \mathsf &#123; d &#125; , \mathsf &#123; l &#125; , \mathsf &#123; k &#125; &#123; \mathsf &#123; b &#125; &#125; ^ &#123; \dagger &#125;$ ，表示将32 拆分成 2x16，将 64 拆分成 8x8，再进行 transpose, reshape 操作。其中 '[ ]' 的部分称为赋值公式，多个公式用 ',' 符号分隔。此外，允许拆分中的某个字符没有赋值，此时会自动推断对应的shape，例如赋值公式只给了 a=2，已知在模型中 ab=32，则自动推断出 b=16；若推断出的 shape 异常会直接报错，比如ab=32， a=5，则 b=6.4，又维度必须是整数，此时会抛出异常错误。

#### 5.13.3 变换公式示例

⚫ 将 3维输入修改为 4维输入： $\mathrm &#123; ^ &#123; \prime &#125; a , b , c - &gt; a , b , l , c ^ &#123; \prime &#125; &#125;$

⚫ 将 5维输入修改为 4维输入： $\mathrm &#123; \hat &#123; a &#125; , b , c , d , e - &gt; a b , c , d , e &#125; ^ &#123; \prime &#125;$

<sup>⚫</sup> 进行 transpose(0,3,1,2)操作： $\mathrm &#123; ^ &#123; \prime &#125; a , b , c , d - &gt; a , d , b , c ^ &#123; \prime &#125; &#125;$

<sup>⚫</sup> Transpose 并合并部分维度： $\mathbf &#123; \dot &#123; a &#125; &#125; , \mathbf &#123; b &#125; , \mathbf &#123; c &#125; , \mathbf &#123; d &#125; - &gt; \mathbf &#123; d &#125; , \mathbf &#123; a c b &#125; , 1 ^ &#123; \prime &#125;$

⚫ 拆分维度、transpose、合并维度： $\mathrm &#123; \Delta ^ &#123; * &#125; a , b c , d e , f [ b = 2 , d = 4 ] &#123; \_ &#125; &#125; \mathrm &#123; &gt; a b , f e , d c , l &#125; ^ &#123; \prime &#125; $

## 6 量化说明

### 6.1 量化介绍

#### 6.1.1 量化定义

#### 6.1.2 量化计算原理

以线性非对称量化为例，浮点数量化为有符号定点数的计算原理如下：

$$

```
\mathrm { x _ { i n t } = c l a m p ( \lvert \frac { x } { \lvert s } \rvert + z ; - 2 ^ { b - 1 } , 2 ^ { b - 1 } - 1 ) }\tag{6-1}
```

$$

$\mathbf &#123; x _ &#123; \mathrm &#123; i n t &#125; &#125; &#125;$

$$

```
{ \mathrm { c l a m p } } ( { \mathrm { x } } ; { \mathrm { a } } , { \mathrm { c } } ) = { \left\{ \begin{array} { l l } { { \mathrm { a } } , } & { { \mathrm { ~ x ~ < ~ a } } , } \\ { { \mathrm { x } } , { \mathrm { ~ a ~ \leq ~ x ~ \leq ~ c } } , } \\ { { \mathrm { c } } , } & { { \mathrm { ~ x ~ > ~ c } } , } \end{array} \right. }\tag{6-2}
```

$$

从定点数转换为浮点数称为反量化过程，具体定义如下：

$$

```
\mathbf { \Delta x } \approx \hat { \mathbf { x } } = s ( \mathbf { x _ { \mathrm { i n t } } - z } )\tag{6-3}
```

$$

设量化范围为 $( \mathtt &#123; q &#125; _ &#123; \mathrm &#123; m i n &#125; ^ &#123; \prime &#125; &#125; \mathtt &#123; q &#125; _ &#123; \mathrm &#123; m a x &#125; &#125; )$ ，截断范围为 $( \cos &#123; \it \Omega &#125; ( \cos &#123; \it \omega &#125; )$ ，量化参数s和z的计算公式如下：

$$

```
\begin{array} { r } { s = { \frac { q _ { m a x } - q _ { m i n } } { c _ { m a x } - c _ { m i n } } } = { \frac { q _ { m a x } - q _ { m i n } } { 2 ^ { b } - 1 } } } \end{array}\tag{6-4}
```

$$

$$

```
\begin{array} { r } { z = c _ { m a x } - \lfloor \frac { q _ { m a x } } { s } \rceil \ \bar { \mathcal { Z } } \hat { \zeta } z = c _ { m i n } - \lfloor \frac { q _ { m i n } } { s } \rceil } \end{array}\tag{6-5}
```

$$

#### 6.1.3 量化误差

量化会造成模型一定程度的精度丢失。根据公式(6-1)可知，量化误差来源于舍入误差和截断误差，即⌊⋅⌉和clamp运算。四舍五入的计算方式会产生舍入误差，误差范围为$\scriptstyle \left( - &#123; \frac &#123; 1 &#125; &#123; 2 &#125; &#125; s , &#123; \frac &#123; 1 &#125; &#123; 2 &#125; &#125; s \right)$ 。当浮点数x过大，比例因子s过小时，容易导致量化定点数超出截断范围，产生截断误差。理论上，比例因子s的增大可以减小截断误差，但会造成舍入误差的增大。因此为了权衡两种误差，需要设计合适的比例因子和零点，来减小量化误差。

#### 6.1.4 线性对称量化和线性非对称量化

线性量化中定点数之间的间隔是均匀的，例如 INT8 线性量化将量化范围均匀等分为256 个数。线性对称量化中零点是根据量化数据类型确定并且零点z位于量化定点数范围上的中心对称点，例如 INT8 中零点为 0。线性非对称量化中零点根据公式(6-5)计算确定并且零点z一般不在量化定点数范围上的中心对称点。



图 6-1 线性对称量化和线性非对称量化

#### 6.1.5 Per-Layer 量化和 Per-Channel 量化

Per-Layer 量化将网络层的所有通道作为一个整体进行量化，所有通道共享相同的量化参数。Per-Channel 量化将网络层的各个通道独立进行量化，每个通道有自己的量化参数。Per-Channel 量化更好的保留各通道的信息，能够更好的适应不同通道之间的差异，提供更好的量化效果。



图 6-2 Per-Layer 量化和 Per-Channel 量化

#### 6.1.6 量化算法

$$

```
q _ { m i n } = \operatorname* { m i n } V\tag{6-6}
```

$$

$$

```
q _ { m a x } = \operatorname* { m a x } V\tag{6-7}
```

$$

其中V为浮点数 Tensor。

KL-Divergence 量化算法计算浮点数和定点数的分布，通过调整不同的阈值来更新浮点数和定点数的分布，并根据 KL 散度最小化两个分布的相似性来确定量化范围的最大值和最小值。KL-Divergence 量化算法通过最小化浮点数和定点数之间的分布差异，能够更好地适应非均匀的数据分布并缓解少数异常值的影响。

$$

```
\underset { q _ { m i n } , q _ { m a x } } { \mathrm { a r g m i n } } H ( \psi ( V ) , \psi ( V _ { i n t } ) )\tag{6-8}
```

$$

$\Psi ( \cdot )$ $\mathrm &#123; \Delta V _ &#123; i n t &#125; &#125;$

MMSE 量化算法通过最小化浮点数与量化反量化后浮点数的均方误差损失，确定量化范围的最大值和最小值，在一定程度上缓解大异常值带来的量化精度丢失问题。由于MMSE 量化算法的具体实现是采用暴力迭代搜索近似解，速度较慢，内存开销较大，但通常会比 Normal 量化算法具有更高的量化精度。

$$

```
\underset { q _ { m i n } , q _ { m a x } } { \arg \operatorname* { m i n } } \left\| V - \widehat { V } ( q _ { m i n } , q _ { m a x } ) \right\| _ { F } ^ { 2 }\tag{6-9}
```

$$

其中 $\widehat &#123; \pmb &#123; V &#125; &#125; ( q _ &#123; m i n &#125; , q _ &#123; m a x &#125; )$ 为�的量化、反量化形式， $| | \cdot | | _ &#123; \mathrm &#123; F &#125; &#125;$ 为 F 范数。

### 6.2 量化配置

#### 6.2.1 量化数据类型

RKNN-Toolkit2 支持的量化数据类型为 INT8。

#### 6.2.2 量化算法建议

Normal量化算法运行速度快，适用于一般场景。

MMSE 量化算法运行速度较慢，内存消耗大，相比 KL\_Divergence 量化算法能够更好的缓解异常值造成的量化精度丢失问题。对于量化友好的模型可尝试使用 MMSE 量化算法来提高量化精度，因为在多数场景下MMSE量化精度要高于Normal和KL-Divergence量化算法。

#### 6.2.3 量化校正集建议

量化校正集用于计算激活值的量化范围，在选择量化校正集时应覆盖模型实际应用场景的不同数据分布，例如对于分类模型，量化校正集应包含实际应用场景中不同类别的图片。一般推荐量化校正集数量为 20-200 张，可根据量化算法的运行时间适当增减。需要注意的是，增加量化校正集数量会增加量化算法的运行时间但不一定能提高量化精度。

#### 6.2.4 量化配置方法

rknn.config()接口包含以下相关量化配置项：

rknn.build()接口包含以下相关量化配置项：

1. do\_quantization：是否开启量化，默认为 False。

2. dataset：量化校正集的路径，默认为空。

a.jpg

b.jpg

如有多个输入，则每个输入对应的文件用空格隔开，如：

a0.jpg a1.jpg

b0.jpg b1.jpg

### 6.3 混合量化

#### 6.3.1 混合量化用法

目前混合量化功能支持如下用法：

2. 每一层的量化参数也可以进行修改。(量化参数不建议修改)

#### 6.3.2 混合量化使用流程

使用混合量化功能时，具体分四步进行。



图6-3 混合量化第一步

2. 修改第一步生成的量化配置文件。

```yaml
custom_quantize_layers:
Conv__350:0: float16
Conv__358:0: float16
quantize_parameters:
FeatureExtractor/MobilenetV2/Conv/Relu6:0:
qtype: asymmetric_quantized
qmethod: layer
dtype: int8
```

```yaml
min:
0.0
max:
6.0
scale:
0.023529411764705882
zero_point:
-128
```

quantize\_parameters 下是模型中每个 tensor 的量化参数。每个 tensor 的量化参数按照tensor 名: 量化属性和参数的格式呈现。其中 min/max 代表量化范围的最小最大值，tensor名可根据精度分析输出结果查看或使用 Netron 打开临时模型文件&#123;model\_name&#125;.model 查看对应输出 tensor 名。

3. 生成 RKNN 模型。具体的接口调用流程如下：



图 6-4 混合量化第三步

4. 使用第三步生成的 RKNN 模型进行推理。

注：RKNN-Toolkit2 工程中 examples/functions/hybrid\_quant 目录下提供了一个混合量化

的例子，具体可以参考该例子对模型进行混合量化。

### 6.4 量化感知训练

#### 6.4.1 QAT 简介

量化感知训练（英文名称 Quantization-aware Training，简称 QAT）是一种量化训练方式，该方式旨在解决低比特量化的精度损失问题。低比特量化会掉精度，是因为值域从浮点数调整到定点数时会有精度损失，QAT 训练时会将量化误差计入训练的损失函数，训练出一个带量化参数的模型。


| 量化方法 | 基于原始框架二次训练 | 数据集 | 权重参数是否被调整 | 损失函数 | 性能 |
| --- | --- | --- | --- | --- | --- |
| 后训练量化(PTQ) | 不需要 | 少量未标注数据 |  | 无关 | 最优 |
| 量化感知训练(QAT) | 需要 | 完整的训练数据集 | 是 | 量化损失计入训练损失函数 | 存在算子不支持QAT 时，性能略弱于 PTQ |

#### 6.4.2 QAT 原理

量化感知训练时，所有权重的存放格式、算子的计算单元都是按照浮点数进行的，这是为了保证反向传播功能可以正常生效、模型的训练可以正常进行。与训练浮点模型不同，在模型可被量化的位置上，量化感知训练会插入 FakeQuantize 模块进行伪量化操作，模拟浮点数调整到定点数的精度损失，使其能被损失函数识别、优化，最终使模型转为定点模型时仍可以保持准确的推理结果。

#### 6.4.3 QAT 使用依据

由于 QAT 需要增加额外的训练代码，且部分开源仓库的代码可能与 QAT 功能存在冲

突，推荐在同时满足以下两种情况时，考虑使用QAT 训练进行模型量化:

1. 参考章节7进行量化精度排查，确认 RKNN 的 PTQ 功能不满足精度要求。

2. 尝试章节6.3进行混合量化，确认RKNN的混合量化功能不满足精度、性能要求。

#### 6.4.4 QAT 实现简例及配置说明

以下是各框架 QAT 功能的说明文档，实际使用请以官方文档为准:

这里我们以 Pytorch 为例，说明实现 QAT 的流程及一些需要注意的地方。

```python
# for 1.10 <= torch <= 1.13
import torch
class M(torch.nn.Module):
def __init__(self):
super().__init__()
self.conv = torch.nn.Conv(3, 8, 3, 1)
def forward(self, x):
x = self.conv(x)
return x
# initialize a floating point model
float_model = M().train()
from torch.quantization import quantize_fx, QConfig, FakeQuantize,
MovingAverageMinMaxObserver, MovingAveragePerChannelMinMaxObserver
qconfig = QConfig(activation=FakeQuantize.with_args(observer=
MovingAverageMinMaxObserver,
quant_min=0,
quant_max=255,
reduce_range=False),
#reudece<sub>_</sub>range 默认是 True
weight=FakeQuantize.with_args(observer=
MovingAveragePerChannelMinMaxObserver,
quant_min=-128,
quant_max=127,
dtype=torch.qint8,
```

```python
qscheme=torch.per_channel_affine
#参数 qscheme 默认是 torch.per<sub>_</sub>channel<sub>_</sub>symmetric
reduce_range=False))
qconfig_dict = {"": qconfig}
model_qat = quantize_fx.prepare_qat_fx(float_model, qconfig_dict)
# define the training loop for quantization aware training
def train_loop(model, train_data):
model.train()
for image, target in data_loader:
Run training
train_loop(model_qat, train_loop)
model_qat = quantize_fx.convert_fx(model_qat)
```

#### 6.4.5 QAT 支持的算子

Pytorch:   

https://github.com/pytorch/pytorch/blob/main/torch/ao/quantization/quantization\_mappings.py   

Paddle:   

https://github.com/PaddlePaddle/Paddle/blob/86df789a567f1285101c57b6e3ada4b952c58f48/pyt   

hon/paddle/quantization/config.py

Tensorflow:

#### 6.4.6 QAT 模型中浮点算子的处理

1. 前后为可量化算子：



图 6-5 QAT OP 前后为可量化算子状态

2. 前后存在非量化算子：



图 6-6 QAT OP 前后为非量化算子状态

如上图左边所示，图中的 gelu、 softmax 算子在原模型中为浮点算子，其前后的 conv为量化算子，RKNN-Toolkit2 在加载模型时，由于 gelu、softmax 中间的量化参数缺失，gelu、softmax 仍保持浮点类型。转为 RKNN 模型后结构如上图右边所示，图中 RKNN模型在 gelu 的前面插入反量化算子，softmax 后面插入量化算子，这些插入的量化、反量化算子都会增加额外的耗时 。

#### 6.4.7 QAT 经验总结

1. QAT 配置

2. 模型中保存的量化参数可能需要二次调整

以 sigmoid 为例子，模型中 sigmoid 算子记录的量化参数可能不是实际推理时使用的量 数 在 官 方 的 代 码（https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/quantized/cpu/qsigmoid.cpp）中，sigmoid 的量化参数在推理时会进行调整，将 min 置为0，max 置为 1。

## 7 精度排查



图7-1 精度排查步骤

### 7.1 模拟器精度排查

RKNN-Toolkit2上的模拟器推理根据模型是否量化分为FP16推理和量化推理。FP16推

#### 7.1.1 模拟器 FP16 精度

RKNPU 目前不支持 FP32 的计算方式，因此模拟器在不开启量化的情况下，默认是FP16 的运算类型，所以只需要在使用 rknn.build()接口时，将 do\_quantization 参数设置为False ， 即 可 以 将 原 始 模 型 转 换 为 FP16 的 RKNN 模 型 ， 接 着 调 用rknn.init\_runtime(target=None)和 rknn.inference()接口进行 FP16 模拟推理并获取输出结果。

如果FP16推理输出结果错误，则可以进行以下排查：

### ⚫ 配置错误

mean\_values/ std\_values：模型的归一化参数，一般原始模型的输入归一化操作是放在模型的输入预处理里实现的，但 RKNN模型在推理时可以包含该归一化的操作（在开启量化后，对量化校正集也会先进行归一化操作），因此在原始模型有归一化步骤时，要确保该参数和原始模型使用的归一化参数一致。

⚫ 一般在 Python 环境下，图像数据都是通过 cv2.imread()读取的，此时需要注意cv2.imread()读取的图像格式为 BGR，如果原始模型的输入为 BGR（如大部分的caffe模型），则不需要做 RGB 顺序的调整；而如果原始模型的输入为 RGB，则需要调用 cv2.cvtColor(img, cv2.COLOR\_BGR2RGB)将图像数据转为 RGB；另外，通过cv2.imread()读取的图像的shape维度为3维，但是一般模型的输入shape为4维，因此还需要调用 np.expand\_dims(img, 0)将输入 shape 扩为 4 维； 之后才可以传给rknn.inference()接口进行推理。通过 cv2.imread()读取的图像的 layout 为 NHWC，data\_format 的默认值也是 NHWC，因此不需要设置 data\_format 参数。

a. 使用原始模型在原始推理框架下进行推理，并将推理结果保存下来。

b. 使用 RKNN-Toolkit2 对原始模型进行转换并推理，此时需要使用与前一步骤里同样的输入数据，并设置 FP16 的推理方式（rknn.build() 的False），同时 rknn.init\_runtime()的 target 参数设为 None，模拟器进行推理，同样将推理的结果保存下来。

d. 如果结果不一致，检查上述参数是否正确。

### ⚫ 超出FP16表达范围

对于溢出问题，可以通过调用 rknn.accuracy\_analysis(..., target=None)接口（参考 3.2.2章节）进行模拟器 FP16 精度分析，如果分析结果中的 simulator\_error 的 entire 列或 single列出现异常值（出现‘inf’等的字样），则可能出现了 FP16溢出。此时可以尝试修改模型结构来保证模型中的所有 Tensor不会出现FP16溢出（如添加一些BN 层等）。

口（参考3.2.2章节）进行模拟器量化精度分析。

### ⚫ 配置错误

dataset：rknn.build()接口的量化校正集配置，用于在量化过程中，计算每个 Tensor 合能会出现精度下降的问题，此外校正集的数量过多或过少都会影响精度（一般选择 20～200 张）。

具体检查量化参数配置问题，一般可按如下步骤进行：

2. 如果结果差异还是很明显：

b. 可以先使用一张图像进行量化（dataset.txt中只留一行），推理时也使用这张图像进行推理，如果此时单张图像的精度提升较多，则说明先前使用的量化校正集选择不佳，可以重新选择与部署场景较吻合的图片（如果提升并不明显，则可能不是 dataset的问题）。

c. 如原先只使用一张图像进行量化（dataset.txt中只有一行），此时可以尝试使

用更多的图像进行量化，可以提高到 20～200张左右。

### ⚫ 量化方法和量化算法

有些模型本身对量化并不友好，此时可以尝试切换不同的量化方法和量化算法。目前量 化 方 法 主 要 有 两 种 ， 分 别 是 layer 和 channel ， 可 通 过 rknn.config() 接 口 里 的quantized\_method 参数进行设置（默认是 channel）。量化算法主要分为三种，分别是参数进行设置（默认是normal）。步骤如下：

如果使用上述方法后，从分析结果中仍然发现 simulator\_error 的 entire 列精度还是不好，并且simulator\_error的single列有部分层精度掉的比较多，这可能是这些层的权重数值分布不好，导致量化后会出现精度下降较多的情况。如：Conv的weight的分布很不均匀的情况下，此时可以考虑使用混合量化来进一步提高模型精度。步骤如下：

先使用精度分析接口对精度进行分析，找出造成精度下降比较多的层，记录对应层1.的输出 Tensor name。（这边需要注意的是，因为误差是会逐层累积的，所以越前面的层对最终的精度影响也会越大，因此不仅要考虑 simulator\_error 的 single 列的精度损失情况，也要考虑层在模型中的位置）

择将该层Op的运行放在后处理中进行，同样会有效避免该层的精度问题。

### ⚫ QAT量化感知训练

### 7.2 Runtime 精度排查

#### 7.2.1 连板精度

1. 在配置好连板调试环境的情况下（连板调试环境配置方法参考 2.2 章节），将开发板通过 USB 连接到电脑上，然后使用 RKNN-Toolkit2 进行连板推理（设置rknn.init\_runtime()的 target 参数， 如 target='rk3566'），并检查推理结果是否大致正确（因为模拟器并没有严格模拟 NPU 硬件，所以结果可能与模拟器并没有完全一致）。

2. 如果上述步骤里的推理结果与模拟器推理结果差异较大，则可以初步确定板端的Runtime 存在 bug，此时可以使用精度分析的接口（参考 3.2.2 章节）进行连板精度分 析 rknn.accuracy\_analysis() 接 口 ， 并 设 置 target 参 数 即 可 ， 如target='rk3566'），精度分析完后会输出每层的分析结果。

3. 检查分析结果中的 runtime\_error 的 single\_sim 列，如其 cos 余弦距离偏低或 euc 欧氏距离偏高（显示黄色或红色），从而导致 runtime\_error 的 entire 列与simulator\_error 的 entire 列差异越来越大，则可能 Runtime 在实现该层时有出现精度丢失或异常的问题，此时可以将该分析结果以及复现的模型反馈给瑞芯微 NPU 团队进行修复。

#### 7.2.2 Runtime 精度

如果连板精度没有问题，但精度仍然有问题，则问题可能出在用户调用 RKNN 的 CAPI 进行编程的 C/C++代码本身，这时用户需要仔细检验下 RKNN 的 C API 的接口配置等是否配置正确，以及模型的前处理和后处理流程是否正确（需要与模拟器端的流程完全一致）。可以按照以下步骤查看：

1. 检查输入配置和数据

查看 C API 的输入是否配置正确。例如，RKNN-Toolkit2 在转换 RKNN 模型时已经配置均值和方差，则在 C/C++代码中不需要做归一化。对于 3 通道的输入，通道顺序与模型训练时设置的输入通道一致；对于四维输入形状，fmt=NHWC;对于非四维输入，fmt=UNDEFINED。若使用通用 API，输入 buffer 的 size 入 Tensor 元素个数\*每个元素的字节数，若使用零拷贝 API，rknn\_create\_mem 接口创建的内存大小以及输入数据格式参考《RKNN Runtime 零拷贝调用》章节。

在 确 认 配 置 正 确 后 ， 需 查 看 输 入 层 的 数 据 ， 可 以 在 应 用 运 行 前 设 置RKNN\_LOG\_LEVEL=5，然后再运行 推理时逐层的结果会以 numpy 格式文件保存在/data/dumps （ Android 系 统 ） 或 / （Linux 系统）目录下。查看包含InputOperator 字段的 numpy 文件是否符合预期，如果使用通用 API，它是输入归一化的结果；如果使用零拷贝API，它是未归一化前的数据。

2. 检查输出配置和数据

在确保输入正确后，查看代码中输出是否配置正确。例如，如果使用通用 API，当设置 want\_float=1 后，输出是 float32 类型结果，当设置 want\_float=0 后，输出是量化数据类型或者float16类型(非量化数据类型)。如果使用零拷贝API，rknn\_create\_mem()接口创建的内存大小以及输入数据格式参考《RKNN Runtime零拷贝调用》章节。

查看输出层的数据，同样在上述逐层 numpy 文件生成后，打开包含 OutputOperator 字段的 numpy 文件，查看数据是否正确。如果确认输入结果正确，输出仍然错误，可能Runtime 在特定的输入/输出类型处理上有问题，此时可以将该分析结果以及复现的模型反馈给瑞芯微 NPU 团队进行修复。

## 8 性能优化



图8-1 模型性能优化流程

### 8.1 模型性能优化前期分析流程

#### 8.1.1 环境条件与配置检查

查询和设置测试环境的条件和配置有如下几个方面：

### ⚫ 查询和设置 CPU、DDR、NPU 频率

也可以简单的使用如下命令设置为性能模式：

### <sup>⚫</sup> 检查 NPU 内核 Driver 版本

检查内核驱动版本命令如下：

cat /sys/kernel/debug/rknpu/version # for

RK3566/RK3568/RK3588/RK3562/RK3576   

cat /proc/rknpu/version # for RV1106/RV1103

### ⚫ 检查 NPU 的负载

NPU 的负载为单位时间内 NPU 执行任务的时间占比。负载能够反应 NPU 的繁忙程度，如果查询到的负载较低，则表明 NPU 等待任务提交的时间较长，需要检查数据输入输出拷贝用时、应用程序前后处理优化等等。或者在应用程序中使用多线程处理方式来提升 NPU负载。

查询NPU负载的命令如下：

cat /sys/kernel/debug/rknpu/load

# or   

cat /proc/debug/rknpu/load

#### 8.1.2 部署过程耗时分析

### ⚫ 用户应用程序耗时

### ⚫ 输入输出拷贝耗时

当采用通用API时，用户设置的输入输出内存与NPU的内存是存在拷贝耗时的，这个耗时可以在调用通用 API 时打印出来。拷贝耗时取决于 DDR 与 CPU 的性能，在输入输出数据量较小的时候Normal API的拷贝耗时较低，但数据量较大时，Normal API的耗时就不可忽略。因此更多推荐采用零拷贝API。

### ⚫ 推理耗时

NPU 执行推理的耗时，该部分耗时直接体现部署模型的耗时。受推理模型规模、编译因为 LOG 打印存在一定的耗时。一般在查看单帧推理耗时时，设置的 LOG 等级为 1，并且跑多次取平均为准。

### 8.2 模型性能分析

#### 8.2.1 获取 Profile 信息

当需要了解模型推理逐层耗时情况时，可以在运行程序前输入以下指令打印详细信息：

```shell
export RKNN_LOG_LEVEL=4
./run_rknn_test ./test.rknn ./input.jpg
```

如果是Android平台，运行后可以通过 logcat命令获取详细日志。

如果是使用rknn-toolkit2，你可以使用如下方式来获取每层的耗时：

性能分析报告信息如下（仅截出性能相关部分）



图 8-2 性能分析报告


| ID OpType DataType Target InputShape | OutputShape | DDRCycles | NPUCycles | MaxCycles | Time(us) |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| InputOperator |  | (1,3,480,640) | 0 | 0 | 0 | 9 |  |  |
| 0 1 | UINT8 UINT8 | CPU NPU | (1,3,480,640),(32,3,3,3),(32) | (1,32,240,320) | 794117 | 1382400 |  |  |
|  | ConvExSwish |  |  |  |  |  | 1382400 | 2805 |
| 2 | ConvExSwish INT8 | NPU | (1,32,240,320),(64,32,3,3),(64) | (1,64,120,160) | 665207 | 691200 | 691200 | 1605 |
| 3 |  | NPU | (1,64,120,160),(32,64,1,1),(32) | (1,32,120,160) | 332036 | 153600 | 332036 | 832 |
|  | ConvExSwish INT8 |  |  |  |  |  |  |  |
| 4 | ConvExSwish INT8 | NPU | (1,64,120,160),(32,64,1,1),(32) | (1,32,120,160) | 332036 | 153600 | 332036 | 788 |
| 5 | ConvExSwish INT8 | NPU | (1,32,120,160),(32,32,1,1),(32) | (1,32,120,160) | 248988 | 153600 | 248988 | 722 |
|  |  | NPU | (1,32,120,160),(32,32,3,3),(32) | (1,32,120,160) | 250087 | 345600 | 345600 |  |
| 6 | ConvExSwish INT8 | NPU |  |  |  |  |  | 768 |
| 7 Add | INT8 |  | (1,32,120,160),(1,32,120,160) | (1,32,120,160) | 329574 | 0 | 329574 | 298 |
| 8 | Concat INT8 | NPU | (1,32,120,160),(1,32,120,160) | (1,64,120,160) | 494407 | 0 | 494407 | 453 |
|  | ConvExSwish INT8 | NPU | (1,64,120,160),(64,64,1,1),(64) | (1,64,120,160) | 497258 | 307200 | 497258 | 1427 |
| 9 |  | NPU | (1,64,120,160),(128,64,3,3),(128) | (1,128,60,80) | 401854 | 691200 | 691200 |  |
| 10 11 | ConvExSwish INT8 ConvExSwish INT8 | NPU | (1,128,60,80),(64,128,1,1),(64) | (1,64,60,80) | 167682 | 76800 | 167682 | 962 405 |

图8-3 性能分析报告

#### 8.2.2 分析逐层耗时



图8-4 高耗时算子性能分析

#### 8.2.3 分析 CPU 算子影响



图 8-5 CPU 算子性能分析

一般来说算子运行在非NPU 上的原因有如下几种：

⚫ 算子尺寸超限（查询 OpList 文档的算子尺寸限制）

⚫ 算子尚未支持在 NPU 上运算（查询 OpList 是否支持该算子，可以在 Github 工程

上提 Issue）

⚫ NPU硬件限制无法支持（是否可以算法等效成其他NPU可支持的其他实现）

#### 8.2.4 分析 NPU 算子性能瓶颈

考虑 NPU 算子的高耗时问题时，可以根据 DDR Cycles/NPU Cycles/Total Cycles 这三栏来判断该算子耗时的理论瓶颈是带宽瓶颈还是算力瓶颈。这里的 DDR Cycles 是根据 NPU频率换算过后的数据，指该层算子读写数据换算成 NPU 频率下所需的 Cycle 数，因此可以直接与 NPU Cycle 比较。

### 如下图所示：



图 8-6 NPU算子性能瓶颈分析  

目前 NPU Cycles 一栏主要显示 Conv 所需的 Cycles，其他算子类型后续会逐步补充。

### 8.3 量化加速

### 8.4 图级别优化

模型的图级别优化是最容易从整体角度去统筹优化模型的方法。在分析出耗时占比较高的算子或图区域后，我们可以有多种不同的方式去改造图进而达成优化的目的。图优化主要以节省多余算子、非NPU OP的NPU 化、面向硬件高效率算子改造等为目标。这些目标有可能有些时候是存在矛盾的，例如为了非NPU OP的NPU 化，可能需要额外多出几个算子，看似违背了节省多余算子的目标，但总体推理性能提升，便是有意义的。

在 RKNN-Toolkit2 工具链中，软件栈在转换模型的过程中已经会进行一定程度上的图优化。但这一过程不是万能和尽善尽美的，有些未被考虑的场景仍然会出现冗余的操作，用户可以根据本节介绍的一些思路来进行预先性的图优化。以下仅作为每一种优化方法的介绍，不是强制固定，实际场景需要灵活运用。

#### 8.4.1 非 NPU OP 通过图变换实现 NPU 化



图 8-7 卷积重排

#### 8.4.2 利用硬件 Fuse 特性设计网络或图优化



图 8-8 算子图优化/融合  

利用融合规则设计，融合规则如下：


| 已支持的融合规则 | 未来计划支持的融合规则 |
| --- | --- |
| Conv+Relu | Activation+Add(Mul) |
| Conv+PRelu(LeakyRelu) | Add(Mul)+Activation |
| Conv+Clip | Conv+Mul |
| Conv+Sigmoid(Tanh/Elu/Silu...)                 1 | Conv+Activation+Mul |
| Conv+Add | Conv+Activation+Pooling |
| Conv+Activation+Add | Conv+Activation+Add(Mul)+Pooling |

#### 8.4.3 算法等效变换或者子图单 OP化

方案来源：https://github.com/ultralytics/yolov5/issues/4825



图8-9 算子等效图变换

#### 8.4.4 算子等效进行“同类项合并”、“提取公因式”

例如下图可以通过简单调整图顺序以达成同类算子合并目的。



图8-10 同类项算子合并

某些图结构有一些共有部分的同类型操作可以调整顺序以提取成单一操作。

例如下图可以通过调整算子顺序将重复性的同类算子单独提取出来只执行一次操作。



图8-11 重复性算子合并

### 8.5 算子级别优化

模型的算子级别优化是针对性比较强的细节优化，对于某些特定算子的具体改造设计，以期进一步提升性能。算子的优化更多是针对性进行算子尺寸设计，以硬件实现效率最高的尺寸规格运行，例如某些算子尺寸规模相似，对齐与非对齐的运行耗时可能差别巨大，差别的原因在于硬件对于部分非对齐尺寸的算子会需要额外的冗余操作来保证正确性，因此算子的尺寸设计对于模型性能也能起到很大的影响，用户可以根据如下一些思路来进行预先性的算子优化。

#### 8.5.1 面向 DDR性能优化的 OP尺寸设计（非强制）

### <sup>⚫</sup> Channel 按对齐量对齐

对齐表格如下所示

表 8-1 RK3566/RK3568


|  | Conv | Depthwise Conv | Others |  |
| --- | --- | --- | --- | --- |
| Dtype | InputChannel | OutputChannel | Channel | Channel |
| Int8 | 32 | 16 | 32 | 8 |
| Int16 | 16 | 8 | 16 | 4 |
| Float16 | 16 | 8 | 16 | 4 |
| BFloat16 | 16 | 8 | 16 | 4 |

表 8-2 RK3588/RK3576


|  | Conv | Depthwise Conv | Others |  |
| --- | --- | --- | --- | --- |
| Dtype | InputChannel | OutputChannel | Channel | Channel |
| Int8 | 32 | 32   7 | 64 | 16 |
| Int16 | 32 | 16 |  | 8 |
| Float16 | 32 | 16 | 32 | 8 |
| BFloat16 | 32 | 16 | 32 | 8 |
| TFloat32 | 16 | 16 | 16 | 4 |

表 8-3 RV1106/RV1103


|  | Conv | Depthwise Conv | Others |  |
| --- | --- | --- | --- | --- |
| Dtype | InputChannel | OutputChannel | Channel | Channel |
| Int8 | 32 | 16 | 32 | 16 |
| Int16 | 16 | 16 | 16 | 8 |

表 8-4 RK3562


| 1 | Conv | Depthwise Conv | Others |  |
| --- | --- | --- | --- | --- |
| Dtype   1 | InputChannel | OutputChannel | Channel | Channel |
| Int8 | 32 | 16 | 32 | 16 |
| Int16 | 32 | 8 | 16 | 8 |
| Float16 | 32 | 8 | 16 | 8 |
| BFloat16 | 32 | 8 | 16 | 8 |
| TFloat32 | 16 | 8 | 8 | 4 |

<sup>⚫</sup> Height \* Width&gt; 1 时 4 对齐



图 8-12 同等规格卷积对比

#### 8.5.2 高利用率模型算子的设计

### ⚫ 规避低效算子原则设计

模型中尽量减少以下三类算子

表 8-5 三类低效算子


| 数据搬运类 | 尺寸变换类 | 非 Relu 类激活函数 |
| --- | --- | --- |
| Transpose | Resize | Sigmoid |
| Reshape | Tile | Tanh |
| Split | Pooling | Softplus |
| Concat | Pad | Hardswish |

### ⚫ 卷积尺寸与利用率关系的讨论

<sup>◼</sup> 输出 Tensor 的 Height \* Width &lt; 16 时利用率下降。

<sup>◼</sup> 输出 Tensor 的 Channel 越大，利用率越高。

#### 8.5.3 子图融合的匹配



图 8-1 Glu 子图融合



图 8-2 LayerNorm 子图融合

目前已经支持的子图融合规则有：

$\mathrm &#123; S p l i t &#125; + \mathrm &#123; S i g m o i d &#125; + \mathrm &#123; M u l &#125;  \mathrm &#123; G L U &#125;$

ReduceMean + Sub + Pow + ReduceMean + Add + Sqrt + Div (+ Mul + Add) -&gt; LayerNorm

## 9 内存使用优化

### 9.1 模型运行时内存组成及分析方法介绍

#### 9.1.1 RKNN 模型运行时内存组成

#### 9.1.2 模型内存分析方法

在 rknn\_init()接口调用完毕后，当用户需要查看模型分配的内存或者需要外部分配模权重、internal的内存(不包括输入和输出)、模型推理所用的所有 DMA 内存以及 SRAM内存（如果 SRAM 没开或者没有此项功能则为 0）的占用情况。

以下是示例代码：

```c
rknn_context ctx = 0;
// Load RKNN Model
int ret = rknn_init(&ctx, model_path, 0, NULL, NULL);
if (ret < 0) {
printf("rknn_init fail! ret=%d\n", ret);
return -1;
}
// Get weight and internal mem size
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size,
sizeof(mem_size));
if (ret != RKNN_SUCC) {
printf("rknn_query fail! ret=%d\n", ret);
return -1;
}
printf("total weight size: %d, total internal size: %d\n",
mem_size.total_weight_size, mem_size.total_internal_size);
```

### 9.2 如何使用外部分配内存

#### 9.2.1 输入输出内存外部分配

外部内存可以用物理地址和 fd记录，主要通过下面2 个接口创建：

<sup>⚫</sup> rknn\_create\_mem\_from\_phys()：通过物理地址来创建 rknn\_tensor\_mem 的结构体

### <sup>⚫</sup> rknn\_create\_mem\_from\_fd()：通过 fd 来创建 rknn\_tensor\_mem 的结构体

以下是示例代码：

```c
// Create input tensor memory
rknn_tensor_mem* input_mems[1];
// default input type is int8 (normalize and quantize need
compute in outside)
// if set uint8, will fuse normalize and quantize to npu
input_attrs[0].type = input_type;
// default fmt is NHWC, npu only support NHWC in zero copy mode
input_attrs[0].fmt = input_layout;
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys,
input_virt, input_attrs[0].size_with_stride);
// Create output tensor memory
rknn_tensor_mem* output_mems[io_num.n_output];
for (uint32_t i = 0; i < io_num.n_output; ++i) {
output_mems[i] = rknn_create_mem_from_phys(ctx,
output_physs[i], output_virts[i], output_attrs[i].size);
}
// Set input tensor memory
ret = rknn_set_io_mem(ctx, input_mems[0], &input_attrs[0]);
if (ret < 0) {
printf("rknn_set_io_mem fail! ret=%d\n", ret);
return -1;
}
// Set output tensor memory
for (uint32_t i = 0; i < io_num.n_output; ++i) {
// set output memory and attribute
ret = rknn_set_io_mem(ctx, output_mems[i], &output_attrs[i]);
if (ret < 0) {
printf("rknn_set_io_mem fail! ret=%d\n", ret);
return -1;
}
```

示例代码如下：

除了引用外部内存的物理地址外，还可以通过引用fd 的方式来使用外部分配内存，

```c
int mb_flags = RK_MMZ_ALLOC_TYPE_CMA | RK_MMZ_ALLOC_UNCACHEABLE;
// Allocate weight memory in outside
MB BLK weight_mb;
rknn_tensor_mem* weight_mem;
ret = RK_MPI_MMZ_Alloc(&weight_mb, mem_size.total_weight_size,
mb_flags);
if (ret < 0) {
printf("RK_MPI_MMZ_Alloc failed, ret: %d\n", ret);
return ret;
}
void* weight_virt = RK_MPI_MMZ_Handle2VirAddr(weight_mb);
if (weight_virt == NULL) {
printf("RK_MPI_MMZ_Handle2VirAddr failed!\n");
return -1;
int weight_fd = RK_MPI_MMZ_Handle2Fd(weight_mb);
if (weight_fd < 0) {
printf("RK_MPI_MMZ_Handle2Fd failed!\n");
return -1;
}
weight_mem = rknn_create_mem_from_fd(ctx, weight_fd,
weight_virt, mem_size.total_weight_size, 0);
printf("weight mb info: virt = %p, fd = %d, size: %d\n",
weight_virt, weight_fd, mem_size.total_weight_size);
int mb_flags = RK_MMZ_ALLOC_TYPE_CMA | RK_MMZ_ALLOC_UNCACHEABLE;
// Allocate weight memory in outside
MB_BLK weight_mb;
rknn_tensor_mem* weight_mem;
ret = RK_MPI_MMZ_Alloc(&weight_mb, mem_size.total_weight_size,
mb_flags);
if (ret < 0) {
printf("RK_MPI_MMZ_Alloc failed, ret: %d\n", ret);
return ret;
}
void* weight_virt = RK_MPI_MMZ_Handle2VirAddr(weight_mb);
if (weight_virt == NULL) {
printf("RK_MPI_MMZ_Handle2VirAddr failed!\n");
return -1;
}
int weight_fd = RK_MPI_MMZ_Handle2Fd(weight_mb);
if (weight_fd < 0) {
printf("RK_MPI_MMZ_Handle2Fd failed!\n");
return -1;
}
weight_mem = rknn_create_mem_from_fd(ctx, weight_fd,
weight_virt, mem_size.total_weight_size, 0);
printf("weight mb info: virt = %p, fd = %d, size: %d\n",
weight_virt, weight_fd, mem_size.total_weight_size);
```

#### 9.2.2 模型内存的外部分配

在 9.1 的章节提到模型内存占用有分两部分，一部分是 internal 内存，另外一部分是weight 内 存 。 应 用 如 果 需 要 使 用 外 部 分 配 的 模 型 内 存 ， 可 以 通 过 接 口rknn\_set\_weight\_mem()，rknn\_set\_internal\_mem()接口设置模型 weight 和 internal 使用的内存。参考示例如下：

```c
// Load RKNN Model
ret = rknn_init(&ctx, model_virt, model_size,
RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
TIME_END(rknn_init);
if (ret < 0) {
printf("rknn init fail! ret=%d\n", ret);
return -1;
}
//query and inset input / output tensor
// Allocate weight memory in outside
MB_BLK weight_mb;
rknn_tensor_mem* weight_mem;
ret = RK_MPI_MMZ_Alloc(&weight_mb,
SIZE_ALIGN_128(mem_size.total_weight_size), mb_flags);
void* weight_virt = RK_MPI_MMZ_Handle2VirAddr(weight_mb);
int weight_fd = RK_MPI_MMZ_Handle2Fd(weight_mb);
weight_mem = rknn_create_mem_from_fd(ctx, weight_fd,
weight_virt, mem_size.total_weight_size, 0);
ret = rknn_set_weight_mem(ctx, weight_mem);
if (ret < 0) {
printf("rknn_set_weight_mem fail! ret=%d\n", ret);
return -1;
}
printf("weight mb info: virt = %p, fd = %d, size: %d\n",
weight_virt, weight_fd, mem_size.total_weight_size);
// Allocate internal memory in outside
MB_BLK internal_mb;
rknn_tensor_mem* internal_mem;
ret = RK_MPI_MMZ_Alloc(&internal_mb,
SIZE_ALIGN_128(mem_size.total_internal_size), mb_flags);
void* internal_virt = RK_MPI_MMZ_Handle2VirAddr(internal_mb);
int internal_fd = RK_MPI_MMZ_Handle2Fd(internal_mb);
internal_mem = rknn_create_mem_from_fd(ctx, internal_fd,
internal_virt, mem_size.total_internal_size, 0);
ret = rknn_set_internal_mem(ctx, internal_mem);
if (ret < 0) {
printf("rknn_set_internal_mem fail! ret=%d\n", ret);
return -1;
}
printf("internal mb info: virt = %p, fd = %d, size: %d\n",
internal_virt, internal_fd, mem_size.total_internal_size);
```

### 9.3 Internal 内存复用

⚫ 部署时，所有NPU内存均是用户自行分配，便于对整个系统内存进行统筹安排。



图 9-1 两个模型 Internal Tensor 共享同一块内存地址空间的示例图

假设模型 1 的路径是 model\_path\_a，模型 2 路径是 model\_path\_b，示例代码如下：

```c
rknn_init(&ctx_a, model_path_a, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE,
NULL);
rknn_query(ctx_a, RKNN_QUERY_MEM_SIZE, &mem_size_a,
sizeof(mem_size_a));
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE,
NULL);
rknn_query(ctx_b, RKNN_QUERY_MEM_SIZE, &mem_size_b,
sizeof(mem_size_b));
// 获取两个模型最大的 internal size
max_internal_size = MAX(mem_size_a.total_internal_size,
mem_size_b.total_internal_size);
```

```c
internal_mem_max = rknn_create_mem(ctx_a, max_internal_size);
// 设置 a 模型 internal memory
internal_mem_a = rknn_create_mem_from_fd(ctx_a,
internal_mem_max->fd,
internal_mem_max->virt_addr,
mem_size_a.total_internal_size, 0);
rknn_set_internal_mem(ctx_a, internal_mem_a);
// 设置 b 模型 internal memory
internal_mem_b = rknn_create_mem_from_fd(ctx_b,
internal_mem_max->fd,
internal_mem_max->virt_addr,
mem_size_b.total_internal_size, 0);
rknn_set_internal_mem(ctx_b, internal_mem_b);
```

### 9.4 多线程复用上下文

```c
int rknn_dup_context(rknn_context* context_in,rknn_context*
context_out)
```



图9-2 两个相同的模型复用上下文的示例图

### 9.5 多种分辨率模型共享相同权重

如下图所示，模型A 和模型B的权重完全相同。



图9-3 两个不同分辨率模型共享权重的示例图  

可按照以下步骤实现多分辨率模型共享相同权重：

2) 部署时，先初始化主 RKNN 模型，再初始化从 RKNN 模型。初始化从模型时，使用RKNN\_FLAG\_SHARE\_WEIGHT\_MEM 标志，并新增 rknn\_init\_extend 参数，该参数值为主模型的上下文。假设主模型路径是 model\_A，从模型路径是 model\_B，示例代码如下：

rknn\_context context\_A;   

rknn\_context context\_B;   

```
ret = rknn_init(&context_A,model_A,0,0,NULL);
rknn_init_extend extend;
extend.ctx = context_A;
ret = rknn_init(&context_B, model_B,0,
RKNN_FLAG_SHARE_WEIGHT_MEM,&extend);
```

#

## 10 常见问题

### 10.1 NPU 环境准备问题

### ⚫ 版本兼容性

<sup>◼</sup> NPU 内核驱动和 Runtime 版本兼容

◼ RKNN-Toolkit2 导出的模型和 Runtime 版本之间的兼容关系如下表所示：

表 10-1 RKNN 模型和 Runtime 版本对应关系


| RKNN 模型版本 | Runtime 版本 |
| --- | --- |
| 1.2.0 | &gt;=1.2.0 and &lt;=1.5.0 |
| 1.3.0 | &gt;=1.3.0 and &lt;=1.5.0 |
| 1.4.0 | &gt;=1.4.0 and &lt;=1.5.0 |
| 1.5.0 | 1.5.0 |
| 1.5.2 | &gt;=1.5.2 |
| 1.6.0 | =1.5.2 |

### ⚫ 如何更新 NPU 内核驱动

建议升级完整固件以更新NPU驱动，对应固件可以找厂商提供。

### ⚫ 板端 docker 环境中如何使用 NPU

该命令中重点关注以下参数：

<sup>◼</sup> /dev/dri/renderD129：RK3588 NPU 设备节点，Runtime 依赖该节点以使能 NPU。

<sup>◼</sup> /usr/lib/librknnrt.so：Runtime 库存放位置，RKNN-Toolkit Lite2 和 RKNPU2 C API

依赖该文件以使用NPU资源。

◼ ai\_application:v1.0.0：待启动容器所使用的镜像名和版本。

### 10.2 工具安装问题

### ⚫ RKNN-Toolkit2依赖的环境限制太严格，导致无法成功安装

```batch
pip install rknn-toolkit2*.whl --no-deps
```

### ⚫ PyTorch 依赖说明

推荐使用的 PyTorch 版本为 1.6.0、1.9.0、1.10 或 1.13.1 版本。

### ⚫ TensorFlow 依赖说明

RKNN-Toolkit2 的 TensorFlow 模型加载功能依赖于 TensorFlow。由于 TensorFlow 各版本之间的兼容性一般，其他版本可能会造成 RKNN-Toolkit2 模型加载异常，所以在加载TensorFlow 模型时，建议导出原模型的 TensorFlow 版本，要与 RKNN-Toolkit2 依赖的TensorFlow 版本一致。

推荐使用的 TensorFlow 版本为 2.6.2 或 2.8.0。

### ⚫ RKNN-Toolkit2 安装包命名规则

以 1.5.2 版本的发布件为例，RKNN-Toolkit2 wheel 包命令规则如下：

rknn\_toolkit2-1.5.2+b642f30c-cp38-cp38-linux\_x86\_64.whl

<sup>◼</sup> rknn\_toolkit2: 工具名称。

<sup>◼</sup> 1.5.2: 版本号。

<sup>◼</sup> b642f30c: 提交号。

<sup>◼</sup> linux\_x86\_64: 系统类型和 CPU 架构。

### ⚫ RKNN-Toolkit2 是否有 ARM Linux 版本

### ⚫ bfloat16 依赖库安装不上

bfloat16的依赖库安装出错，如下：



图 10-1 bfloat16 依赖库安装失败日志

### 10.3 模型转换常用参数说明

本章节主要覆盖模型转换阶段常用参数的使用说明。

### ⚫ 根据模型确定参数

可以参考以下基本步骤进行模型转换：

1. 准备量化数据，提供 dataset.txt 文件。

### ⚫ RKNN模型的跨平台兼容性

对于 rknn.config()的 target\_platform 设置的平台参数，兼容性关系如下：

RK3566、RK3568 平台使用的模型是相互兼容的。

◼ RK3588、RK3588S 平台使用的模型是相互兼容的。

◼ RV1103、RV1106 平台使用的模型是相互兼容的。

### ⚫ 量化校正数据的格式及要求

对于非 RGB/BGR 图片输入的模型，建议使用 numpy 的 npy 格式提供量化数据。

### ⚫ 多输入模型 dataset.txt 文件的填写方式

模型量化需要用dataset.txt文件指定量化数据的路径。规则为一行作为一组输入，模型

存在多输入时，多个输入写在同一行，并用空格隔开。

如单输入模型，使用两组量化数据：

sampleA.npy   

sampleB.npy

如三个输入的模型，两组量化数据按如下方式填写：

sampleA\_in0.npy sampleA\_in1.npy sampleA\_in2.npy   

sampleB\_in0.npy sampleB\_in1.npy sampleB\_in2.npy

### ⚫ 确认 rknn.config()的 quant\_img\_RGB2BGR 参数

采用图片（jpg，png）作为量化数据时，需要考虑设置 quant\_img\_RGB2BGR 参数。

### ⚫ rknn.config()的 mean、std 和 quant\_img\_RGB2BGR 的计算顺序问题

因为 quant\_img\_RGB2BGR 只控制在量化过程中读取校正集图像时是否要进行转换通道，并不会影响其他的步骤。因此对于 RKNN-Toolkit2 的 inference 接口及 RKNPU2 C API，对输入数据都只先进行减均值（mean）、再除标准差（std）的操作，并没有通道转换的操作。

##

mean\_values 和 std\_values 的设置格式是一致的。以 mean\_values 为例子。

### ⚫ 量化参数矫正算法和量化图片数量的选取

RKNN-Toolkit2 中量化算法（rknn.config()的 quantized\_algorithm）参数提供三种算法进行参数矫正，分别为 normal、mmse 和 kl\_divergence，默认使用 normal。normal 为常规的量化参数矫正算法；而 mmse 会迭代中间层的计算结果，对权重数值进行一定范围的裁剪，以获得更高的推理精度。使用 mmse 不一定能提升量化精度，但相比 normal 方式，量化时会占用更多的内存、耗费更长的模型转换时间；使用 kl\_divergence 量化算法所用时间会比normal 多一些，但比 mmse 会少很多，在某些场景下（feature 分布不均匀时）可以得到较好的改善效果。

建议先使用 normal 算法，如果量化效果不佳，可尝试使用 mmse 或 kl\_divergence 算法。

### ⚫ 量化模型与非量化模型，推理时输入输出的差异

调用通用 RKNPU2 C API 时（指不使用 pass\_through、zero\_copy 的方式调用 C API），输入数据的数据类型（如uint8数据，float数据）与模型的量化与否没有关系。输出数据的数据类型可以选择自动处理成 float32 格式， 也可以选择直接输出模型推理结果，此时数据类型与输出节点的数据类型一致。使用Python推理接口会有点差异，具体关系如下表：

表 10-2 Python 推理接口和通用 C API 接口区别


| 模型量化后 | Python 推理 (rknn.inference()) | C API 推理（rknn.run()） (非 pass_through、zero_copy) |
| --- | --- | --- |
| 输入类型是否 | 无限制。 | 无限制。 |
| 有限制 | rknn.inference()的输入为 | rknn_inputs 的 rknn_tensor_type 参数可 |
| numpy 数组，本身带有 data type属性，该输入会自动转 | 以根据实际输入，指定 RKNN TENSOR FLOAT32、 |  |
| 成 RKNN 模型需要的数据格 式。 | RKNN TENSOR FLOAT16、 RKNN TENSOR INT8 |  |
|  | RKNN |  |
| 无变化。 | 将输入自动转成 RKNN 模型需要的数 据格式 |  |
| 变化 | 无论模型量化与否，Python 的 rknn.inference()接口总是 | 有变化。 RKNPU2 C API 的 rknn outputs attr，可 以设置 want float=1，得到 float 类型 |
|  |  |  |
|  |  |  |
|  |  |  |
|  | 择其他数据类型。 |  |
|  | 返回 float 类型输出。无法选 |  |
|  |  |  |
|  |  | 的输出。而量化后，可以设置 |
|  |  |  |
|  |  | want_float=0，此时可以输出最后一个 |
|  |  |  |
|  |  |  |
|  |  | 节点的原始输出数据，如i8量化时， |
|  |  |  |
|  |  | 输出 int8 数据。 |
|  |  |  |
| 输入 format 是 |  |  |
|  | 无变化。 | 无变化。 |
|  |  |  |
| 否有变化 |  |  |
|  | 无论模型量化与否， | 无论模型量化与否，rknn inputs 结构体 |
|  |  |  |
|  |  |  |
| (NCHW, |  |  |
|  | rknn.inference()接口的 | 的 rknn_tensor_format 参数，可以根据 |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
| NHWC) |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  | data format参数，可以根据 | 需要设置为NCHW或NHWC。 |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
| 需要设置为 nchw 或 nhwc。 |  |  |

### ⚫ 是否存在在线预编译的模式

### ⚫ RKNN-Toolkit 转出来的 RKNN 模型可以在 RK3566 平台上使用吗

不可以。

RKNN-Toolkit 转出来的 RKNN 模型适用于 RK1806 / RK1808 / RK3399Pro / RV1109 /RV1126等平台；RK3566平台需要用RKNN-Toolkit2转出来的RKNN模型。RKNN-Toolkit2转出来的 RKNN 模型适用于 RK3566 / RK3568 / RK3588 / RK3588S / RV1103 / RV1106 /RK3562 / RK3576 等平台。

RKNN-Toolkit工具的使用说明请参考以下工程：

https://github.com/airockchip/rknn-toolkit

RKNN-Toolkit2工具的使用说明请参考以下工程：

https://github.com/airockchip/rknn-toolkit2

### 10.4 模型加载问题

#### 10.4.1 RKNN-Toolkit2 支持的深度学习框架和对应版本

请参考 3.1 章节。

#### 10.4.2 各框架的 OP 支持列表

https://github.com/airockchip/rknn-toolkit2/blob/master/doc/

#### 10.4.3 ONNX 模型转换常见问题

### ⚫ 加载模型时出现“Error parsing message”报错

转换 examples/onnx/resnet50v2 模型时，提示加载失败：

E load\_onnx: Catch exception when loading onnx model:   

/rknn\_resnet\_demo/resnet50v2.onnx!   

E lod\_onnx: Traceback (most recent call last):   

E load\_onnx: File "rknn/api/rknn\_base.py", line 1094, in   

rknn.api.rknn\_base.RKNNBase.load\_onnx   

E load\_onnx: File "/usr/local/lib/python3.6/dist  

packages/onnx/\_\_init\_\_.py", line 115, in load\_model   

E load\_onnx: google.protobuf.message.DecoderError: Error   

parsing message

22ed6e6a8fb9192f0980acca0c941414 resnet50v2.onnx

### ⚫ 是否支持动态的输入 shape

### ⚫ 自定义输出节点时报错

rknn.load\_onnx()时传入 outputs 参数进行模型的裁剪，但报如下错误：

```python
E load_onnx: the '378' in outputs=['378', '439', '500'] is
invalied!
```

日志提示输出节点 378 是无效的，因此 outputs 参数需设置正确的输出节点名称。

#### 10.4.4 Pytorch 模型转换常见问题

### 加载 Pytorch 模型时出现 torch.\_C 没有\_jit\_pass\_inline 属性的错误

错误日志如下：

'torch.\_C' has no attribute '\_jit\_pass\_inline'

请将 PyTorch 升级到 1.6.0 或之后的版本。

### ⚫ Pytorch 模型的保存格式

### ⚫ 转换时遇到 PytorchStreamReader 失败的错误

详细错误如下：

E Catch exception when loading pytorch   

model: ./mobilenet0.25\_Final.pth!   

E Traceback (most recent call last):   

E cpp\_module = torch.\_C.import\_ir\_module(cu, f,   

map\_location, extra\_files)   

E RuntimeError: [enforce fail at inline   

container.cc:137]. PytorchStreamReader failed reading zip   

archive: faild finding central directory frame #0 ……

出错原因是输入的 PyTorch模型没有网络结构信息。

通常 pth 只有权重，并没有网络结构信息。对于已保存的模型权重文件，可以通过初始化对应的网络结构，再使用 net.load\_state\_dict()加载 pth 权重文件。最后通过torch.jit.trace()接口将网络结构和权重参数固化成一个 pt 文件。得到 torch.jit.trace()处理过以后的 pt 文件，就可以用 rknn.load\_pytorch()接口将其转为 RKNN 模型。

### ⚫ 转换时遇到 KeyError 的错误

错误日志如下：

E Traceback (most recent call last):   

E KeyError: 'aten::softmax'

出现形如 KeyError: 'aten::xxx'的错误信息时，表示该算子当前版本还不支持。RKNN-

Toolkit2在每次版本升级时都会修复此类bug，请使用最新版本的RKNN-Toolkit2 试试。

### ⚫ 转换时遇到"Syntax error in input! LexToken(xxx)"的错误

错误日志如下：

WARNING: Token 'COMMENT' defined, but not used   

WARNING: There is 1 unused token   

!!!!! Illegal character '"'   

Syntax error in input! LexToken(NAMED\_IDENTIFIER, 'fc',   

1, 27)   

!!!!! Illegal character '"'

该错误的原因有很多种，请按照以下顺序排查：

#### 10.4.5 TensorFlow 模型转换常见问题

### ⚫ Tensorflow1.x 模型报错

使用 rknn.load\_tensorflow()接口加载 tensorflow1.x 模型如出现报错提示：

E load\_tensorflow: Catch exception when loading   

tensorflow model: ./yolov3\_mobilenetv2.pb!   

E load\_tensorflow: Traceback (most recent call last):   

E load\_tensorflow:   

tensorflow.python.framework.errors\_impl.InvalidArgumentError:   

Node   

'MobilenetV2/expanded\_conv/depthwise/BatchNorm/cond/Switch\_1'   

expects to be colocated with unknown node   

'MobilenetV2/expanded\_conv/depthwise/BatchNorm/moving\_mean'   

E load\_tensorflow: During handling of the above   

exception, another exception occurred:   

E load\_tensorflow: Traceback (most recent call last):   

E load\_tensorflow: File "rknn/api/rknn\_base.py", line   

990, in rknn.api.rknn\_base.RKNNBase.load\_tensorflow   

E load\_tensorflow: return func(\*args, \*\*kwargs)   

E load\_tensorflow: File "/usr/local/lib/python3.6/dist  

packages/tensorflow/python/framework/importer.py", line 431,   

in import\_graph\_def   

E load\_tensorflow: raise ValueError(str(e))   

E load\_tensorflow: ValueError: Node

建议：

<sup>◼</sup> 如当前安装的是 1.x 的 TensorFlow，请安装 2.x 的 TensorFlow。

<sup>◼</sup> 更新 RKNN-Toolkit2 / RKNPU2 至最新版本。

### ⚫ TransformGraph 类似的报错

TensorFlow 的模型转成 RKNN 时报错：

Traceback (most recent call last):   

File "test.py", line 80, in &lt;module&gt;   

input\_size\_list=[[1, 368, 368, 3]])   

File "/usr/local/lib/python3.6/site  

packages/rknn/api/rknn.py", line 68, in load\_tensorflow   

input\_size\_list=input\_size\_list, outputs=outputs)   

File "rknn/api/rknn\_base.py", line 940, in   

rknn.api.rknn\_base.RKNNBase.load\_tensorflow   

File "/usr/local/lib/python3.6/dist  

packages/tensorflow/tools/graph\_transforms/\_\_init\_\_", line 51,   

in TransformGraph.transforms\_string, status)   

File "/usr/local/lib/python3.6/dist  

packages/tensorflow/python/framework/errors\_impl.py". ;ome   

548, in \_\_exit   

C\_api.TF\_GetCode(self.status.status)   

Tensorflow.python.framework.error\_impl.InvalidArgumentError   

: Beta input to batch norm has bad shape: [24]

原因：

2）可能是模型生成时的TensorFlow 版本与目前安装的版本已经不兼容了。

建议：

使用1.14.0的TensorFlow版本重新生成该模型，或者寻找其他框架的同类型模型。

### <sup>⚫</sup> "Shape must be rank 4 but is rank 0"报错

加载 pb 模型时：

会产生报错：

E load\_tensorflow: Catch exception when loading   

tensorflow model: ./model.pb!   

E load\_tensorflow: Traceback (most recent call last):   

E load\_tensorflow: File "/usr/local/lib/python3.6/dist   

packages/tensorflow/python/framework/importer.py", line 427,   

in import\_graph\_def   

E load\_tensorflow: graph.\_c\_graph, serialized, options)   

# pylint: disable=protected-access   

E load\_tensorflow:   

tensorflow.python.framework.errors\_impl.InvalidArgumentError:   

Shape must be rank 4 but is rank 0 for   

'generator/conv2d\_3/Conv2D' (op: 'Conv2D') with input shapes:   

[], [7,7,3,32].

原因可能是该模型是多输入模型，rknn.load\_tensorflow()的 input\_size\_list 没按规范填写，

可以参考 examples/functions/multi\_input\_test 里的以下用法：

### ⚫ 加载模型出错时的排查步骤

### 10.5 模型量化问题

### ⚫ 量化对模型体积的影响

分两种情况，当导入的模型是量化的模型时，rknn.build()接口的 do\_quantization=False会使用该模型里面的量化参数。当导入的模型是浮点的模型时，do\_quantization=False 不会做量化的操作，但是会把权重从 float32 转成 float16，这块几乎不会有精度损失。这两种情况都减少了模型权重的体积，从而使得整个模型占用空间变小。

### ⚫ 模型量化时，图片是否需要和模型输入的尺寸一致

如果时非图像格式的校正数据，如 npy 格式，则需要与模型输入的 shape 一致。

### ⚫ 量化校正集是否需要根据 rknn\_batch\_size 参数进行修改

不需要。

### ⚫ 模型量化时，程序运行一段时间后被 kill掉或程序卡住

解决方法：增加电脑内存或增大虚拟内存（交换分区）。

### 10.6 模型转换问题

### ⚫ 常见转换 bug 报错的问题

### ◼ infer\_shapes 类似错误

```ruby
(op_type:Mul, name:Where_2466_mul): Inferred elem type
differs from existing elem type: (FLOAT) vs (INT64)
E build: Catch exception when building RKNN model!
E build: Traceback (most recent call last):
E build: File "rknn/api/rknn_base.py", line 1555, in
rknn.api.rknn_base.RKNNBase.build
E build: File "rknn/api/graph_optimizer.py", line 5409, in
rknn.api.graph_optimizer.GraphOptimizer.run
E build: File "rknn/api/graph_optimizer.py", line 5123, in
rknn.api.graph_optimizer.GraphOptimizer._fuse_ops
E build: File "rknn/api/ir_graph.py", line 180, in
rknn.api.ir_graph.IRGraph.rebuild
E build: File "rknn/api/ir_graph.py", line 140, in
rknn.api.ir_graph.IRGraph._clean_model
E build: File "rknn/api/ir_graph.py", line 56, in
rknn.api.ir_graph.IRGraph.infer_shapes
E build: File "/home/anaconda3/envs/rk2/lib/python3.6/site
packages/onnx/shape_inference.py", line 35, in infer_shapes
E build: inferred_model_str = C.infer_shapes(model_str,
check_type)
E build: RuntimeError: Inferred elem type differs from
existing elem type: (FLOAT) vs (INT64)
```

或：

E build: Traceback (most recent call last):   

E build: File "rknn/api/rknn\_base.py", line 1643, in   

rknn.api.rknn\_base.RKNNBase.build   

E build: File "rknn/api/graph\_optimizer.py", line 6256, in   

rknn.api.graph\_optimizer.GraphOptimizer.fuse\_ops   

E build: File "rknn/api/ir\_graph.py", line 285, in   

rknn.api.ir\_graph.IRGraph.rebuild   

E build: File "rknn/api/ir\_graph.py", line 149, in   

rknn.api.ir\_graph.IRGraph.\_clean\_model   

E build: File "rknn/api/ir\_graph.py", line 62, in   

rknn.api.ir\_graph.IRGraph.infer\_shapes   

E build: File "/usr/local/lib/python3.6/dist  

packages/onnx/shape\_inference.py", line 35, in infer\_shapes   

E build: inferred\_model\_str = C.infer\_shapes(model\_str,   

check\_type)   

E build: RuntimeError: Inferred shape and existing shape   

differ in rank: (0) vs (3)

或：

(op\_type:ReduceMax, name:ReduceMax\_18): Interred shape and   

existing shape differ in rank: (3) vs (0)   

E build: Catch exception when building RKNN model!   

E build: Traceback (most recent call last):   

E build: RuntimeError: Interred shape and existing shape differ   

in rank: (3) vs (0)

### ◼ \_p\_fuse\_two\_mul 类似错误

E build: Catch exception when building RKNN model!   

E build: Traceback (most recent call last):   

E build: File "rknn/api/rknn\_base.py", line 1643, in   

rknn.api.rknn\_base.RKNNBase.build   

E build: File "rknn/api/graph\_optimizer.py", line 6197, in   

rknn.api.graph\_optimizer.GraphOptimizer.fuse\_ops   

E build: File "rknn/api/graph\_optimizer.py", line 204, in   

rknn.api.graph\_optimizer.\_p\_fuse\_two\_mul   

E build: ValueError: non-broadcastable output operand with   

shape () doesn't match the broadcast shape (3,2)

### <sup>◼</sup> "Segmentation fault"类似错误

如picodet模型转换报错：

### ◼ \_p\_fuse\_mul\_into\_conv 类似错误

### ⚫ 怎么判断算子RKNN是否支持

直接进行模型的转换，如果不支持会有相关提示。

也可参考以下两个算子支持文档：

### ⚫ 转换时提示 Expand 算子不支持

建议：

1）新版本已经支持 CPU 的 Expand，可尝试更新 RKNN-Toolkit2 / RKNPU2 至最新版本。

2）修改模型，采用 repeat 算子来替代 expand 算子。

### ⚫ 转换时提示"Meet unsupported dims in reducesum"

模型转换出现 Meet unsupported dims in reducesum, dims: 6，具体如下：

D RKNN: [14:54:19.434] &gt;&gt;&gt;&gt;&gt;&gt; start:   

N4rknn17RKNNInitCastConstE   

D RKNN: [14:54:19.434] &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt; end:   

N4rknn17RKNNInitCastConstE   

D RKNN: [14:54:19.434] &gt;&gt;&gt;&gt;&gt;&gt; start:   

N4rknn20RKNNMultiSurfacePassE   

D RKNN: [14:54:19.434] &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt; end:   

N4rknn20RKNNMultiSurfacePassE   

D RKNN: [14:54:19.434] &gt;&gt;&gt;&gt;&gt;&gt; start: N4rknn14RKNNTilingPassE   

D RKNN: [14:54:19.434] &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt; end: N4rknn14RKNNTilingPassE   

D RKNN: [14:54:19.434] &gt;&gt;&gt;&gt;&gt;&gt; start:   

N4rknn23RKNNProfileAnalysisPassE   

D RKNN: [14:54:19.434] &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt; end:   

N4rknn23RKNNProfileAnalysisPassE   

D RKNN: [14:54:19.434] &gt;&gt;&gt;&gt;&gt;&gt; start: OpEmit   

E RKNN: [14:54:19.438] Meet unsupported dims in reducesum,   

dims: 6   

Aborted (core dumped)

目前RKNN不支持 6维的OP，大多数情况下只支持4 维。

### ⚫ 因 NonMaxSuppression 或 TopK 等后处理 Op 导致转换报错

<sup>◼</sup> NonMaxSuppression 或 TopK 等后处理 Op，RKNN 目前不支持。

◼ 可以将图的后处理子图部分移除，如：

```python
rknn.load_onnx(model='picodet_xxx.onnx',
outputs=['concat_4.tmp_0', 'tmp_16'])
```

◼ 移除的子图在cpu 端另行进行处理。

### ⚫ "invalid expand shape"类似报错

例如 rvm\_mobilenetv3\_fp32.onnx 转换时出现以下报错：

[E:onnxruntime:, sequential\_executor.cc:333 Execute] Non-zero   

status code returned while running Expand node. Name:'Expand\_294'   

Status Message: invalid expand shape   

E build: Catch exception when building RKNN model!   

E build: Traceback (most recent call last):   

E build: File "rknn/api/rknn\_base.py", line 1638, in   

rknn.api.rknn\_base.RKNNBase.build   

E build: File "rknn/api/graph\_optimizer.py", line 5529, in   

rknn.api.graph\_optimizer.GraphOptimizer.fold\_constant   

E build: File "rknn/api/session.py", line 69, in   

rknn.api.session.Session.run   

E build: File   

"/home/cx/work/tools/Anaconda3/envs/rknn/lib/python3.8/site  

packages/onnxruntime/capi/onnxruntime\_inference\_collection.py",   

line 124, in run   

E build: return self.\_sess.run(output\_names, input\_feed,   

run\_options)   

E build:   

onnxruntime.capi.onnxruntime\_pybind11\_state.InvalidArgument:   

[ONNXRuntimeError] : 2 : INVALID\_ARGUMENT : Non-zero status code   

returned while running Expand node. Name:'Expand\_294' Status   

Message: invalid expand shape

因为 downsample\_ratio 的输入值会改变模型中间 feature 的 size，所以说这种图本质上是动态图。建议修改模型 downsample\_ratio 的逻辑，不要用输入的数值来控制中间 feature 的 shape。如需使用动态图功能，可在更新 1.5.2 的 RKNN-Toolkit2 后，使用动态 shape 的功能来模拟动态图（同样需要修改模型 downsample\_ratio 的逻辑，不要用输入的数值来控制中间 feature 的 shape，目前动态 shape 功能只支持输入的 shape 是可变的情况）。

### ⚫ rknn.config()的 mean\_values 报错提示

设置 mean/std 为：

rknn.config(mean\_values=[128, 128, 128], std\_values=[128, 128,   

128])

时转换模型报错：

原因可能是模型的输入不是 3 通道图像数据（例如输入 shape 是 1x32，非图像数据），此时：

<sup>◼</sup> 需要根据输入通道个数来设置 mean\_values / mean\_values。

<sup>◼</sup> 如 果 模 型 不 需 要 指 定 mean/std ， rknn.config() 可 以 不 设 置 mean\_values / std\_values

（mean/std一般只对图像输入有效）

### ⚫ 模型存在 4 维以上 Op 时报错（如 5 维或 6 维）

当模型存在4维以上 Op时（如5维或 6维），会有如下报错：

E build: Catch exception when building RKNN model!   

E build: Traceback (most recent call last):   

E build: File "rknn/api/rknn\_base.py", line 1580, in   

rknn.api.rknn\_base.RKNNBase.build   

E build: File "rknn/api/rknn\_base.py", line 341, in   

rknn.api.rknn\_base.RKNNBase.\_generate\_rknn   

E build: File "rknn/api/rknn\_base.py", line 307, in   

rknn.api.rknn\_base.RKNNBase.\_biild\_rknn   

E build: IndexError: vector::\_M\_range\_check: \_\_n (which is   

4) &gt;= this-&gt;size() (which is 4)

RKNN目前暂不支持4维以上的OP，可以手工将这些节点去掉。

### ⚫ RKNN是否支持动态卷积

目前 RK3588/RK3576 平台支持 group 参数为1的动态卷积。其他平台暂不支持。

### <sup>⚫</sup> "Not support input data type 'float16'"报错

pytorch 训练的权重类型为 float16 的模型，在转换 RKNN 时出现以下报错：

--&gt; Building model   

E build: Not support input data type 'float16'   

W build: = === WARN(3)   

E rknn-toolkit2 version: 1.3.0-11912b58   

E build: Catch exception when building RKNN model!   

E build: Traceback (most recent call last):   

E build: File "rknn/api/rknn\_base.py", line 1638, in   

rknn.api.rknn\_base.RKNNBase.build   

E build: File "rknn/api/graph\_optimizer.py", line 5524, in   

rknn.api.graph\_optimizer.GraphOptimzer.fold\_constant   

E build: File "rknn/api/load\_checker.py", line 63, in   

rknn.api.load\_checker.create\_random\_data   

E build: File "rknn/api/rknn\_log.py", line 113, in   

rknn.api.rknn\_log.RKNNLog.e   

E build: ValueError: Not support input data type 'float16'!

目前 RKNN-Toolkit2 还还不支持 float16 的权重类型的 Pytorch 模型，需改为 float32。

### ⚫ 动态图相关报错

转换模型时，如果出现以下类似报错：

E build: ValueError: The Op of 'NonZero' is not support! it   

will cause the graph to be a dynamic graph!

说明包含该OP 的模型为动态图，需要手动修改模型，用其他 OP 替换或将其移除。

### ⚫ RKNN模型大小问题

模型转换结束后，可能存在转换出来的 RKNN 模型比原始模型大的现象，甚至跟模型的输入shape 也有关系，这种现象是正常的。因为 RKNN 模型里不仅仅包含权重和图结构信息，还会有很多NPU 的寄存器配置信息，并且为了提高运行效率，可能也会做 OP 的拆解等操作，这些都会导致RKNN模型变大。

### 10.7 模拟器推理及连板推理的说明

### ⚫ 术语说明

板端推理：指在开发板上调用RKNPU2 的C API接口推理模型，获取推理结果。

### ⚫ 模拟器推理结果与连板推理结果不一致

发生此情况时，可能意味着板端的结果不正确。

### ⚫ 连板推理的工作原理

使用连板推理时，RKNN-Toolkit2 会与板端的 RKNN Server 进行通信，通信时会将模型、模型的输入由 PC 端传至板端，随后调用 RKNPU2 C API 进行模型推理，板端推理完成后将结果回传至PC端。

### ⚫ 连板推理与板端推理结果有差异

连板推理是基于RKNPU2 C API 实现的，理论上连板推理结果会与RKNPU2 C API 推理结果一致。当这两者出现较大差异时，请确认输入的预处理、数据类型、数据的排布方式（NCHW，NHWC）是否有差异。

### ⚫ 板端推理的速度比连板推理更快

### ⚫ 涉及连板调试、连板推理功能时，获取详细的错误日志

为了获取具体的板端调试信息，可以通过串口进入开发板操作系统。然后执行以下两条命令设置获取日志的环境变量。保持串口窗口不要关闭，再进行连板调试，此时板端的错误信息就会显示在串口窗口上：

```
export RKNN_LOG_LEVEL=5
```

restart\_rknn.sh

### 10.8 模型评估常见问题

### ⚫ 量化模型精度不及预期

参考本文档的第7章节。

### ⚫ 支持哪些框架的已量化模型

### ⚫ 连板调试时，连接设备失败

连板精度分析（rknn.accuracy\_analysis()）时出现如下报错：

```python
E accuracy_analysis: Connect to Device Failure (-1)
E accuracy_analysis: Catch exception when init runtime!
E accuracy_analysis: Traceback (most recent call last):
E accuracy_analysis: File "rknn/api/rknn_base.py", line 2001,
in rknn.api.rknn_base.RKNNBase.init_runtime
E accuracy_analysis: File "rknn/api/rknn_runtime.py", line
194, in rknn.api.rknn_runtime.RKNNRuntime.__init
E accuracy_analysis: File "rknn/api/rknn_platform.py", line
331, in rknn.api.rknn_platform.start_ntp_or_adb
```

或连板推理（rknn.inference）时出现如下报错：

I target set by user is: rk3568   

I Starting ntp or adb, target is RK3568   

I Device [0c6a9900ef4871e1] not found in ntb device list.   

I Start adb…   

I Connect to Device success!   

I NPUTransfer: Starting NPU Transfer Client, Transfer version   

2.1.0 (b5861e7@2020-11-23T11:50:36)   

D NPUTransfer: Transfer spec = local:transfer\_proxy   

D NPUTransfer: ERROR: socket read fd = 3, n = -1: Connection   

reset by peer   

D NPUTransfer: Transfer client closed fd = 3   

E RKNNAPI: rknn\_init, server connect fail! ret = -   

9(ERROR\_PIPE)!   

E init\_runtime: Catch exception when init\_runtime!   

E init\_runtime: Traceback (most recent call last):   

E init\_runtime: File "rknn/api/rknn\_base.py", line 2001, in   

rknn.api.rknn\_base.RKNNBase.init\_runtime   

E init\_runtime: File "rknn/api/rknn\_runtime.py", line 361, in   

rknn.api.rknn\_runtime.RKNNRuntime.build\_graph   

E init\_runtime: Exception: RKNN init failed. error code:   

RKNN\_ERR\_DEVICE\_UNAVAILABLE

### ⚫ 连板调试时，rknn\_init 失败，返回-6 或模型非法的错误

错误信息如下：

```python
E RKNNAPI: rknn_init, msg_load_ack fail, ack = 1(ACK_FAIL),
expect 0(ACK_SUCC)!
D NPUTransfer: Transfer client closed, fd = 4
E init_runtime: Catch exception when init runtime!
E init_runtime: Traceback (most recent call last):
E init_runtime: File "rknn/api/rknn_base.py", line 2011, in
rknn.api.rknn_base.RKNNBase.init_runtime
E init_runtime: File "rknn/api/rknn_runtime.py", line 361,
in rknn.api.rknn_runtime.RKNNRuntime.build_graph
E init_runtime: Exception: RKNN init failed. error code:
RKNN_ERR_MODEL_INVALID
```

出现该错误一般有以下几种情况：

没有正确设置 target\_platform。例如不设置 rknn.config()接口中的 target\_platform 时，生成的 RKNN 模型只能在 RK3566/RK3568 上运行。如果要在其他平台上运行（如应的 target\_platform。

### ⚫ 连板调试时，rknn\_init()失败，返回设备不可用的错误

错误信息如下：

```python
E RKNNAPI: rknn_init, msg_ioctl_ack fail, data_len = 104985,
except 102961!
D NPUTransfer: Transfer client closed, fd = 3
E init_runtime: Catch exception when init_runtime!
E init_runtime: Traceback (most recent call last):
E init_runtime: File "rknn/api/rknn_base.py", line 1961, in
rknn.api.rknn_base.RKNNBase.init_runtime
E init_runtime: File "rknn/api/rknn_runtime.py", line 360, in
rknn.api.rknn_runtime.RKNNRuntime.build_graph
E init_runtime: Exception: RKNN init failed. error code:
RKNN_ERR_DEVICE_UNAVAILABLE
```

该问题的原因比较复杂，请按以下方式排查：

### <sup>⚫</sup> Runtime 出现"Invalid RKNN format"报错

Runtime上出现以下报错：

Loading model …   

E RKNN: [06:28:39.048] parseRKNN from buffer: Invalid RKNN   

format!   

E RKNN: [06:28:39.049] rknn\_init, load model failed!   

rknn\_init error ret=-1

原因：

2）Runtime 版本与 RKNN-Toolkit2 不兼容。

建议：

1）设置正确的 target\_platform。

2）RKNN-Toolkit2 与 Runtime 要一起更新到同一个版本。

### ⚫ rknn.inference()耗时与 rknn.eval\_perf()理论速度不一致

对于更真实的帧率，建议直接在开发板上使用RKNPU2 C API进行测试。

### ⚫ rknn.inference()对多 batch 的支持

另外，当 rknn\_batch\_size 大于 1（如等于 4 时），Python 里推理的调用要由：

```python
outputs = rknn.inference(inputs=[img])
```

修改为：

完整示例请参考：examples/functions/multi\_batch/

### ⚫ 运行多个 RKNN 模型

### ⚫ 模型推理的耗时非常长，而且得到的结果错误

### ⚫ 模型输入为3维情况下，连板推理结果错误

建议：

◼ 先将模型输入改为 4维。

<sup>◼</sup> 更新 RKNN-Toolkit2 / RKNPU2 至最新版本进行尝试。

### ⚫ 连板推理结果错误，并且每次都不一致

### ⚫ 模型存在较多的Resize OP时，出现精度下降问题

当 ONNX 模型里存在较多的 Resize OP 时，转换为RKNN 后出现精度下降。可能的原因是：

1）精度下降是因为NPU目前还不支持硬件级别Resize（后续会支持），转换工具会将Resize

转为ConvTranspose，会导致一点点的精度丢失。

1）目前尽量避免 Resize 的使用（如将 Resize 改为 ConvTranspose 再进行训练）

### ⚫ do\_quantization 设为 False 以后推理结果都为 nan

rknn.build()接口中的 do\_quantization 设为 True 时推理结果没有异常，但设为 False 以后推理  

结果就都变为 nan 了。原因可能是 do\_quantization=False 时，RKNN 模型的运算类型是 fp16 的，  

但该模型的中间层（如卷积）输出的范围可能超出了 fp16（65536）的范围（如-51597\~75642）。建议：

### ⚫ QAT模型与RKNN模型结果不一致

### ⚫ 怎么获取模型运行时候内存占用率

可以使用rknn.eval\_memory()接口，输出的日志里有个 Total项，就是总的占用大小。

### ⚫ 性能评估时，开启或关闭 rknn.init\_runtime()的 perf\_debug 参数，性能数据的差异

无法检测到上端连接已经断开，这时需要重启下开发板，重置RKNN Server的连接状态。

### 10.9 C API 使用常见问题

### ⚫ rknn\_outputs\_release()是否会释放 rknn\_output 数组

### ⚫ rknn\_create\_mem 如何创建合适的大小的内存？

对于输出而言，rknn\_create\_mem()使用用户填充的数据类型的字节数\*n\_elems 分配内存。

### ⚫ 输入数据如何填充？

### ⚫ pass\_through 如何使用？

### ⚫ 出现"failed to submit"错误如何处理？

如果错误出现在中间的NPU层，可能的原因是模型配置出错，此时可在错误日志中找到最新的 SDK网盘链接，建议升级最新工具链或者在转换RKNN模型时将该层指定到 CPU 上运行。

### ⚫ 出现"Meet unsupport xxx operator"错误如何处理？

在板端运行demo出现类似的报错时，一般是板端的Runtime（librknnrt.so） 不支持该算子。建议用户先更新 RKNN 相关工具链到最新版本，再重新转换模型，并在板端重跑 demo。

如果最新的工具链还出现同样报错，则用户需要自行添加该算子的实现，可以参考 5.5 章节来自定义实现算子，或者通过 redmine上报给RKNN 团队。

### ⚫ 动态 shape模型是否支持在零拷贝流程中使用外部分配的内存？

1.6.0 之前版本不支持，1.6.0 版本开始支持使用 RKNN\_FLAG\_MEM\_ALLOC\_OUTSIDE 标志初始化上下文。

### ⚫ 自定义算子性能评估(runtime)

自定义算子的性能可以在板端上设定 RKNN\_LOG\_LEVE=4 或 5 以上, 并运行测试 demo,runtime 库就会自动打印出每层耗时信息, 包含自定义 OP 的耗时。

## 11 相关资源

RKNN：https://github.com/airockchip/rknn-toolkit2。

Model Zoo：https://github.com/airockchip/rknn\_model\_zoo。

RGA：https://github.com/airockchip/librga。


