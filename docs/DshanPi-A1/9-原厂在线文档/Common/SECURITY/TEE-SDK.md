---
sidebar_position: 1
---

# TEE-SDK

## 前言

概述

本文档主要介绍Rockchip TEE安全相关固件说明、TEE环境搭建、CA/TA开发测试、TA调试方法、TA签名方法以及注意事项。

读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.00 | 张志杰 | 2018-4-26 | 初始版本 |
| V1.10 | 张志杰 | 2019-3-18 | 新增uboot TEE环境说明；优化V1与V2版本区分说明 |
| V1.20 | 林平 | 2019-6-4 | 新增安全存储说明 |
| V1.30 | 林平 | 2019-7-4 | 修改安全存储说明 |
| V1.40 | 林平 | 2019-7-11 | 新增parameter.txt说明；新增TEE相关内核节点说明 |
| V1.50 | 林平 | 2019-8-8 | 新增编译rk_tee_user报错说明 |
| V1.60 | 林平 | 2021-1-27 | optee v1内核驱动变更说明 |
| V1.61 | 林平 | 2021-3-4 | 新增rkfs unsupported说明 |
| V1.70 | 林平 | 2021-5-13 | 新增内置TA到安全存储说明 |
| V1.71 | 王小滨 | 2021-5-14 | RK开发的CA/TA测试程序升级，对应更新文档的描述 |
| V1.72 | 林平 | 2021-6-4 | 修改U-Boot中TEE相关宏说明 |
| V1.73 | 林平 | 2021-6-4 | 新增加密TA说明 |
| V1.74 | 王小滨 | 2021-6-17 | 新增REE FS TA的防回滚说明 |
| V1.75 | 林平 | 2021-7-5 | 更新TA调试方法说明 |
| V1.76 | 林平 | 2021-7-8 | 新增TA调试查看函数调用栈方法说明 |
| V1.77 | 林平 | 2021-9-3 | 修改TA签名章节 |
| V1.78 | 林平 | 2021-9-6 | 新增安全存储性能测试说明 |
| V1.79 | 张志杰 | 2021-9-10 | 优化部分格式 |
| V1.80 | 主办 | 2021-9-10 | 新增TA API说明章节 |
| V1.81 | 林平 | 2021-10-12 | 修改安全存储性能测试说明 |
| V1.82 | 小 | 2021-10-15 | 在TA API章节新增API |
| V1.83 | 张志杰 | 2021-10-18 | 优化部分格式 |
| V1.84 | 王小滨 | 2021-11-22 | 新增强弱安全等级可选方案的说明，更新CA/TA相关描述 |
| V1.85 | 王小滨 | 2021-11-26 | 新增OTP说明章节，更新OTP API, 调整CA/TA等描述 |
| V1.86 | 王小滨 | 2021-11-30 | 新增阅读指引 |
| V1.87 | 林平 | 2022-06-22 | 新增 rk_tee_service 章节 |
| V1.9.0 | 林平 | 2023-05-29 | 补充各章节细节，新增Step By Step章节更新内存相关说明，更新安全存储，更新OTP说明 |
| V1.10.0 | 张志杰 | 2023-06-02 | 优化部分格式 |
| V1.11.0 | 林平 | 2024-01-23 | 新增U-Boot运行UserTA，新增安全内存打印，新增测试xtest,新增HW Crypto API，新增Derive Key API |
| V1.12.0 | 林平 | 2024-07-30 | 补充加密TA方法章节新增soft ta encryption key说明 |

## 1. 阅读指引

下面介绍了阅读本文档以及使用TEE的步骤，可作为开发者的阅读指引。

1. 了解TEE基础，查看TrustZone软硬件架构和TEE基础知识。

## 2. 确认和配置功能需求

确认OPTEE版本，查看平台说明章节。

强弱安全等级配置，查看强弱安全等级可选的方案章节。

TA签名密钥，查看TA签名章节。

TA额外的保护机制，查看内置TA到安全存储、加密TA、REE FS TA防回滚等章节。

安全存储和性能，查看安全存储章节。

OTP说明，查看OTP说明章节。

## 3. 搭建TEE环境

配置安全存储的文件系统，查看安全存储和Parameter.txt说明章节。

使能TEE固件，查看TEE固件章节。

U-Boot使能TEE，查看U-Boot 中TEE驱动章节。

kernel使能TEE，查看TEE linux kernel驱动章节。

## 4. 测试CA/TA

确认环境和工程目录，查看TEE库文件、环境配置、Android、Linux等章节。

了解RK提供的demo并编译，查看CA/TA demo介绍、Android、Linux等章节。

安装相关库文件和CA/TA demo，查看Android、Linux等章节。

测试demo，查看Android、Linux等章节。

## 5. 开发CA/TA

了解TA调试方法，查看TA调试方法章节。

参考demo和TA API，开发CA/TA，查看CA/TA demo介绍、TA API说明等章节。

2. TrustZone简介

### 2.1 什么是TrustZone

ARM TrustZone技术是系统范围的安全方法，针对高性能计算平台上的大量应用，包括安全支付、数字版权管理(DRM)、企业服务和基于Web的服务。

按照TrustZone Ready Program建议开发并利用TrustZone技术的设备提供了能够支持完全可信执行环境(TEE)以及安全感知应用程序和安全服务的平台。

同时，移动设备处理重要服务的需求日益增加。从能够支付、下载和观看某一特定时段的最新好莱坞大片，到能够通过手机远程支付帐单和管理银行帐户，这一切都表明，新的商业模式已开始出现。

### 2.2 TrustZone软硬件架构

#### 2.2.1 硬件架构

架构的主要安全目标是支持构建可编程环境，以防止资产的机密性和完整性受到特定攻击。具备这些特性的平台可用于构建一组范围广泛的安全解决方案，而使用传统方法构建这些解决方案将费时费力。



可通过以下方式确保系统安全：隔离所有SoC硬件和软件资源，使它们分别位于两个区域（用于安全子系统的安全区域以及用于存储其他所有内容的普通区域）中。支持TrustZone的AMBA3 AXI™总线构造中的硬件逻辑可确保普通区域组件无法访问安全区域资源，从而在这两个区域之间构建强大边界。将敏感资源放入安全区域的设计，以及在安全的处理器内核中可靠运行软件可确保资产能够抵御众多潜在攻击，包括那些通常难以防护的攻击（例如，使用键盘或触摸屏输入密码）。通过在硬件中隔离安全敏感的外设，设计人员可限制需要通过安全评估的子系统的数目，从而在提交安全认证设备时节省成本。

更改当前运行的虚拟处理器后，这两个虚拟处理器通过新处理器模式（称为监视模式）来进行上下文切换。

#### 2.2.2 软件架构



在SoC硬件中实现安全区域要求在其中运行某些安全软件，并利用存储在其中的敏感资产。

专用安全内核可能是一种复杂但强大的设计。它可模拟多个独立安全区域应用程序的并发执行、新安全应用程序的运行时下载以及完全与普通区域环境独立的安全区域任务。

安全扩展是ARM架构的开放式组件，因此任何开发人员都可创建自定义安全区域软件环境，以满足其要求。

#### 2.2.3 TrustZone与TEE

支付、网上银行、内容保护和企业身份验证之类的应用可通过利用TrustZone技术增强型设备所提供的三个关键要素来提高其完整性、功能和用户体验：

1. 面向软件的安全执行环境，可防止从富操作系统发起恶意软件攻击

2. 已知良好的硬件信任根，可在富操作领域检查数据和应用程序的完整性，确保安全环境不受到损害  

3. 按需访问安全外设，如内存、键盘/触摸屏，甚至显示器

TEE API的标准化（由GlobalPlatform管理）将会使服务提供商、运营商和OEM的可互操作可信应用程序和服务实现市场化。

ARM TrustZone技术无需单独的安全硬件来验证设备或用户的完整性。它通过在主手机芯片集中提供真正的硬件信任根来实现这一点。

为确保应用程序的完整性，TrustZone还提供了安全执行环境（即可信执行环境 (TEE)），在此环境中只有可信应用程序才能运行，从而防止遭到黑客/病毒/恶意软件形式的攻击。

TrustZone硬件提供了TEE与软件攻击媒介的隔离。硬件隔离可扩展为保护一直到物理外设（包括键盘/触摸屏等）的数据输入和输出。

正是具备了这些关键功能，采用TrustZone技术的芯片集提供了众多机会来重新定义用户可以访问的服务（更多、更好的服务），如何访问服务（更快、更轻松）以及在何处访问服务（随时随地）。

## 3. TEE环境

### 3.1 平台说明

Rockchip平台中Android 7.1及更高版本SDK默认均支持TEE环境，Android7.1以下版本默认不支持TEE环境。

Linux版本SDK默认没有开启TEE环境，但可以参考后续章节手动配置TEE环境。

Rockchip平台采用的TEE方案为OP-TEE，TEE API符合GlobalPlatform标准。

目前运行在rockchip平台上的OP-TEE有两个版本，OP-TEE V1与OP-TEE V2。

1.OP-TEE V1<sub>：</sub>RK312x<sub>、</sub>RK322x<sub>、</sub>RK3288<sub>、</sub>RK3328<sub>、</sub>RK322xh<sub>、</sub>RK3368<sub>、</sub>RK3399<sub>、</sub> RK3399Pro<sub>。</sub>

2.OP-TEE V2<sub>：</sub>RK3326/PX30<sub>、</sub>RK3358<sub>、</sub>RK3308<sub>、</sub>RK1808<sub>、</sub>RV1109/RV1126<sub>、</sub>RK3566/RK3568<sub>、</sub>RK3588<sub>、</sub>RK3528<sub>、</sub>RK3562<sub>、</sub>RV1106和后续新平台<sub>。</sub>

两个版本在Secure OS固件<sub>、</sub>TEE库文件<sub>、</sub>TA文件方面均有不同<sub>，</sub>需根据具体平台采用不同版本TEE相关组件<sub>。</sub>

不在 OP-TEE V1 列表中的平台即可视为采用 OP-TEE V2 的平台<sub>。</sub>

### 3.2 Parameter.txt说明

### 3.3 TEE固件

TEE Secure OS的源码默认不开源，binary位于目录 u-boot/tools/rk\_tools/bin 或 rkbin/bin 下。

1. ARMv7平台的TEE binary由工具 u-boot/tools/loaderimage 打包成固件trust.img，TEE binary的命名如下：

&lt;platform&gt;\_tee\_[ta]\_&lt;version&gt;.bin

名称中带ta的为支持外部TA运行，不带ta则不支持运行外部TA。

2. ARMv8平台的TEE binary由工具 u-boot/tools/trust\_merger 将BL31/BL32等bin打包成固件trust.img，TEE binary的命名如下：

&lt;platform&gt;\_bl32\_&lt;version&gt;.bin

3. 若rkbin/RKTRUST/.ini中[BL32\_OPTION]下SEC=0，则需要将其改成SEC=1，否则trust.img将不包含Secure OS，无法运行TEE相关服务。

4. RK3566/RK3568、RK3588、RK3528、RK3562、RV1106和后续新平台会把TEE binary打包进uboot.img，不会生成trust.img固件。

### 3.4 U-Boot 中TEE驱动

#### 3.4.1 宏定义说明

CONFIG\_OPTEE\_CLIENT ，U-Boot调用OP-TEE总开关。

CONFIG\_OPTEE\_V1 ，采用OP-TEE V1的平台使用。

CONFIG\_OPTEE\_V2 ，采用OP-TEE V2的平台使用。

### 3.4.2共享内存说明

### 3.4.3安全存储功能测试

##### 3.4.3.1 测试步骤

1. 进入U-Boot串口命令行：设备串口连接PC，PC按住ctrl+c，启动设备，启动时设备检测到ctrl+c操作则会停在uboot。

2. 执行：以下指令启动测试。

```javascript
=> mmc testsecurestorage
```

##### 3.4.3.2 常见错误排查

"TEEC: Could not find device"

没有找到emmc或者nand设备，请检查U-Boot中驱动，或者硬件是否损坏。

"TEEC: Could not find security partition"

当采用security分区安全存储时，加密数据会存储在该分区，请检查parameter.txt中是否定义了security分区。

"TEEC: verify [%d] fail, cleanning ...."

第一次使用security分区进行安全存储时，或者security分区数据被非法篡改时出现，security分区会全部清空。

"TEEC: Not enough space available in secure storage !"

安全存储的空间不足，请检查存储的数据是否过大，或者存储的文件数量过多，或者之前是否存储过大量的数据而没有删除。

接格式化emmc即可，若是使用rpmb则需要联系技术支持提供特殊固件清除rpmb中旧数据。

“optee check api revision fail”

U-Boot与TEE版本不匹配，U-Boot版本高于TEE版本，解决办法如下（二选一）：

1. 回退U-Boot版本至 cf13b78438 (tag: android-10.0-mid-rkr9) rockchip: spl: add  

rollback index check with otp 。

2. revert以下几个提交：

396e3049bd rochchip: board: only map op-tee share memory as dcache enabled

7a349fdcbd lib: optee\_client: add optee initialize flag

74eb602743 lib: optee\_client: update to new optee msg for optee v1 platform

102dfafc4a rochchip: board: map op-tee memory as dcache enabled

正常情况下对外释放的SDK版本都是匹配的。

"optee api revision mismatch with u-boot/kernel, panic"

若在Android系统启动阶段打印，则升级 android/vendor/rockchip/common 版本至 8bc7bf97 (tag:android-10.0-mid-rkr10) vpu: librockit: add Rockit MetadataRetriever 及以上版本。

若在Linux系统启动阶段打印，则升级 linux/external/security/bin 版本至 f59085c optee\_v1:  

lib: arm&arm64: update binary and library 及以上版本。

正常情况下对外释放的SDK版本都是匹配的。

#### 3.4.4 U-Boot运行User TA

部分开发者需要在U-Boot阶段运行自己开发的TA应用，可以参考本章节。

1. 确认是否包含该功能提交，若不包含请更新U-Boot代码。

2. 开发者拷贝TA文件到 u-boot/lib/optee\_clientApi/userta 目录下，该目录支持存放多个TA文件，默认已经存放了rktest ta文件用于测试。

3. 执行以下命令打包TA文件生成userta.img固件。

4. 修改parameter.txt新增一个userta分区，分区大小需要大于userta.img固件大小。

5. 使用烧写工具烧写 parameter.txt 和 userta.img。

6. U-Boot可以调用 trusty\_oem\_user\_ta\_transfer 和 trusty\_oem\_user\_ta\_storage 测试 rktest ta 是否运行正常。开发者可以参考这两个函数，调用自己的TA。

### 3.5 TEE linux kernel驱动

TEE linux kernel驱动位于 security/optee\_linuxdriver/ 与 drivers/tee/ 中。

#### 3.5.1 OP-TEE V1

采用OP-TEE V1的芯片的驱动位于 security/optee\_linuxdriver/ ，默认均有开启。开启方法如下：

config中添加以下配置：

CONFIG\_TEE\_SUPPORT=y

2020年8月份以后释放的Android10以及以上版本和Linux版本默认使用OP-TEE V2的kernel驱动。

#### 3.5.2 OP-TEE V2

```dts
firmware {
optee: optee {
compatible = "linaro,optee-tz";
method = "smc";
#status = "disabled";
};
};
```

各平台默认情况下都有添加该节点，但部分平台会设置 status = "disabled"; 导致该驱动默认关闭，所以如果要开启optee驱动，只要去除 status = "disabled"; 即可。

config 中添加以下两个配置：

CONFIG\_TEE=y   

CONFIG\_OPTEE=y

### 3.5.3确认驱动开启

### 3.6 TEE库文件

### Android

1. lib：包含32bit与64bit平台编译出来的tee-supplicant、libteec.so以及keymaster/gatekeeper相关库文件。  

2. ta：存放编译好的keymaster/gatekeeper等相关TA文件。

Linux

TEE环境相关组件在linux工程目录 external/security/bin 下（包含V1与V2版本，需根据不同平台采用不同版本文件）：

1. lib：包含32bit与64bit平台编译出来的tee-supplicant、libteec.so以及其他CA相关库文件。

2. ta：存放编译好的TA文件。

## 4. CA/TA开发与测试

### 4.1 环境配置

1. 若编译报错 No module named Crypto.Signature ，这是开发电脑没有安装python的算法库导致的，执行如下命令即可：

```batch
pip uninstall Crypto
pip uninstall pycrypto
pip install pycrypto
```

### 4.2 CA/TA demo介绍

RK提供一套CA/TA demo，目的是：

给开发者提供参考，或

直接用于测试TEE环境

CA/TA demo的源码在Android工程目录的 external/rk\_tee\_user ，或Linux工程目录的

```ignorefile
external/security/rk_tee_user
```

备注：测试程序只涉及常用的部分功能，不覆盖OPTEE支持的所有功能。


| 功能参数 | 功能 | 备注 |
| --- | --- | --- |
| transfer_data | 测试CA与TA之间的参数传递 |  |
| storage | 测试安全存储功能 | 测试安全存储功能前，需要确保内核对应节点存在，/dev/block/by-name/security对应security分区；rpmb安全存储需要三个节点，/dev/block/mmcblk%u,/dev/block/mmcblk%urpmb,/sys/class/mmc_host/mmc%u/mmc%u:0001/cid，%u值为012任意一个；若节点不存在，请链接到对应节点。 |
| storage_speed | 测试安全存储性能 |  |
| property | 测试获取property |  |
| crypto_sha | 测试SHA算法 |  |
| crypto_aes | 测试AED算法 |  |
| crypto_rsa | 测试RSA加解密、签名验签 |  |
| secstor_ta | 测试内置TA到安全存储 | 请先阅读“内置TA到安全存储”章节，理解该功能的原理后再测试 |
| otp_read | 测试读OEM_S_OTP | 测试程序默认隐藏otp测试项，如需开启，请在/host/rk_test/main.c中定义。otp相关特性见下文“OTP说明”章节 |
| otp_write | 测试写OEM_S_OTP |  |
| otp_size | 获取OEM_S_OTP的总大小 |  |
| otp_ns_read | 测试读OEM_NS_OTP |  |
| otp_ns_write | 测试写OEM_NS_OTP |  |
| trng | 获取trng数据 |  |
| socket | 测试CA与TA间socket通信 |  |

执行测试程序，指令如：

CA程序执行成功提示PASS，失败提示Fail。

### 4.3 Android

#### 4.3.1 目录介绍

TEE CA/TA开发环境在安卓工程目录 external/rk\_tee\_user 下：

1. Android.mk：其中决定了编译的工具和需要编译的ca 文件。

2. host：存放CA的相关源文件。

3. ta：存放TA的源文件。

4. export\*：存放编译TA 所依赖的环境。

### 4.3.2编译开发说明

```shell
#OP-TEE V1平台进入v1目录
cd external/rk_tee_user/v1
#OP-TEE V2平台进入v2目录
cd external/rk_tee_user/v2
rm -rf out/
./build.sh ta
mm
```

若 external/rk\_tee\_user 目录下没有v1/ v2/两个目录，说明依然使用两个分支，OP-TEE V1请先切换到master分支，OP-TEE V2请先切换到develop-next分支，执行如下命令开始编译。

编译成功后会得到相应的执行程序，执行程序分为CA（Client Application，运行在normal world）和TA（Trust Application，运行在secure world）。

CA为普通执行文件，编译后生成于Android工程out目录中。

#### 4.3.3 运行测试TEE环境

1. adb shell进入设备

3. 若开机未自动运行tee-supplicant，则需手动root权限后台运行tee-supplicant：

```markdown
# tee-supplicant &
```

若出现 tee\_supp\_rk\_fs\_init: unsupported 打印，说明parameter.txt中没有定义security分区，详情请参考2.2章节，若开发者只使用rpmb分区或REE文件系统进行安全存储，可以忽略该错误打印。

4. 运行CA，调用TA，测试TEE相关功能。rk\_tee\_user自带的rktest程序，可用于直接测试TEE基本功能，执行：

# rktest [command]

5. 若rktest的各指令运行通过，则TEE环境正常，可进行TEE相关开发。

若运行报错，请先检查驱动及各组件；

也可能是rk\_tee\_user版本与TEE OS版本不匹配导致，以下为常用匹配关系：

### OP-TEE V1:

rkbin/bin目录下TEE binary文件名中 version &gt;= v2.00，

对应 492f1cbf testapp: support new OP-TEE MSG

rkbin/bin目录下TEE binary文件名中 version &lt; v2.00，

对应 e8d7215d Android.mk: support build in android R

或者 466515ec add tools for user to resign TA

### OP-TEE V2:

TEE启动阶段串口打印"OP-TEE version: 3.13.0"，对应 a566557 - v2: update to keep up with v3.13.0 of optee\_test

TEE启动阶段串口打印"OP-TEE version: 3.6.0"，对应 1aa969e2 Android.mk: support build in android R

TEE启动阶段串口打印"OP-TEE version: 3.3.0"，对应 aa0a0c00 Android.mk: remove build ta from android

#### 4.3.4 Step By Step

这里以安卓12上采用OP-TEE V2的arm64平台举例

```
//编译CA TA
cd /home1/xxxx/rk_android_12
```

source build/envsetup.sh   

lunch rk3568\_s-userdebug   

cd /home1/xxxx/rk_android_12/external/rk_tee_user/v2

./build.sh ta

mm   

```
//推送TEE库文件和CA TA到设备
adb root && adb remount
```

adb push Y:\rk\_android\_12\hardware\rockchip\optee\v2\arm64\libteec.so   

/vendor/lib64   

adb push Y:\rk\_android\_12\hardware\rockchip\optee\v2\arm64\tee-supplicant   

/vendor/bin   

adb push Y:\rk\_android\_12\out\target\product\rk3568\_s\vendor\bin\rktest   

/vendor/bin   

adb push Y:\rk\_android\_12\external\rk\_tee\_user\v2\out\ta\rk\_test\1db57234-dacd-  

462d-9bb1-ae79de44e2a5.ta /vendor/lib/optee\_armtz   

//运行CA TA

# tee-supplicant & //若tee-supplicant已经运行，可以忽略本步骤，安卓平台一般默认已经有运行   

# rktest transfer\_data

#### 4.3.5 开发CA/TA

可参考CA，TA中的Makefile与头文件的UUID需要修改成新生成的UUID，可用uuidgen命令生成。

### 4.4 Linux

#### 4.4.1 目录介绍

TEE CA/TA开发环境在linux工程目录 external/security/rk\_tee\_user 下：

1. build.sh：编译执行脚本，编译说明请参考脚本中的注释。

2. Makefile：其中决定了编译的工具和需要编译的ca 文件。

3. host：存放CA的相关源文件以及对应Makefile。

4. ta：存放TA的源文件。

5. export\*：存放编译TA 所依赖的环境。

#### 4.4.2 编译开发说明

```shell
#OP-TEE V1平台进入v1目录
cd external/security/rk_tee_user/v1
#OP-TEE V2平台进入v2目录
cd external/security/rk_tee_user/v2
rm -rf out/
./build.sh 3232 （32位平台执行，CA 32bits，TA 32bits）
./build.sh 6432 （64位平台执行，CA 64bits，TA 32bits）
```

若 external/security/rk\_tee\_user 目录下没有v1/ v2/两个目录，说明依然使用两个分支，OP-TEEV1请先切换到master分支，OP-TEE V2请先切换到develop-next分支，执行如下命令开始编译。

```shell
cd external/security/rk_tee_user/
rm -rf out/
./build.sh 3232 （32位平台执行，CA 32bits，TA 32bits）
./build.sh 6432 （64位平台执行，CA 64bits，TA 32bits）
```

编译成功后会得到相应的执行程序，执行程序分为CA（Client Application，运行在normal world）和TA（Trust Application，运行在secure world）。

CA为普通执行文件，编译后生成于rk\_tee\_user/out、rk\_tee\_user/v1/out、rk\_tee\_user/v2/out其中一个 目录下对应的文件夹中。

TA是文件名为uuid，后缀为.ta的文件，编译后生成于rk\_tee\_user/out/ta、rk\_tee\_user/v1/out/ta、 rk\_tee\_user/v2/out/ta其中一个目录对应的文件夹中。

#### 4.4.3 运行测试TEE环境

1. adb shell进入设备。

（若开机tee-supplicant自启动，则tee-supplicant和libteec.so不用再push，系统中已有这两个文件；

libteec.so和tee-supplicant注意区分OP-TEE V1与OP-TEE V2，注意区分32位和64位；

push后检查下tee-supplicant和CA程序是否有执行权限）

3. 其他步骤，与Android平台相同，见上述“Android”章节。

#### 4.4.4 Step By Step

这里以Linux上采用OP-TEE V2的arm64平台举例

```
//编译CA TA
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
```

./build.sh 6432   

//设备上创建optee_armtz目录，用于存放TA文件

# mkdir -p /lib/optee\_armtz   

//推送TEE库文件和CA TA到设备

adb push Y:\rk\_px30\_linux\external\security\bin\optee\_v2\lib\arm64\libteec.so   

/lib64

adb push Y:\rk\_px30\_linux\external\security\bin\optee\_v2\lib\arm64\libteec.so.1   

/lib64   

adb push Y:\rk\_px30\_linux\external\security\bin\optee\_v2\lib\arm64\tee-supplicant   

/usr/bin   

adb push Y:\rk\_px30\_linux\external\security\rk\_tee\_user\v2\out\rk\_test\rktest   

/usr/bin   

adb push   

Y:\rk\_px30\_linux\external\security\rk\_tee\_user\v2\out\ta\rk\_test\1db57234-dacd-  

462d-9bb1-ae79de44e2a5.ta /lib/optee\_armtz   

//添加可执行权限

# chmod +x /usr/bin/tee-supplicant   

# chmod +x /usr/bin/rktest   

//运行CA TA

# tee-supplicant & //若tee-supplicant已经运行，可以忽略本步骤   

# rktest transfer\_data

#### 4.4.5 开发CA/TA

可参考CA，TA中的Makefile与头文件的UUID需要修改成新生成的UUID，可用uuidgen命令生成。

```c
#define TA_STACK_SIZE (2 * 1024)
#define TA_DATA_SIZE (32 * 1024)
```

### 4.5 rk\_tee\_service

#### 4.5.1 功能介绍

目前OP-TEE V2平台支持该功能，OP-TEE V1平台暂不支持。

#### 4.5.2 组件

目前支持 Linux 平台和 Android 平台（Android 12及更高版本）。


| 组件 | Android 目录 | Linux 目录 |
| --- | --- | --- |
| librk_tee_service.so | hardware/rockchip/optee/v2/armhardware/rockchip/optee/v2/arm64 | external/security/bin/optee v2/lib/armexternal/security/bin/optee_v2/lib/arm64 |
| rk_tee_service.h | hardware/rockchip/optee/v2/include | external/security/bin/optee_v2/include |
| 4367fd45-4469-42a6-925d-3857b952704a.ta | hardware/rockchip/optee/v2/ta | external/security/bin/optee_v2/ta |

#### 4.5.3 参考Demo

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "rk_tee_service.h"
int main(int argc, char *argv[])
{
unsigned char plain[256];
unsigned int plain_len;
unsigned char cipher[256];
unsigned int cipher_len;
int res;
memset((void *)plain, 0xab, sizeof(plain));
cipher_len = 256;
res = rk_encrypt_data(plain, sizeof(plain), cipher, &cipher_len);
printf("res=0x%x cipher_len=%d\n", res, cipher_len);
memset((void *)plain, 0, sizeof(plain));
plain_len = 256;
res = rk_decrypt_data(cipher, cipher_len, plain, &plain_len);
printf("res=0x%x plain_len=%d\n", res, plain_len);
return 0;
}
```

### 4.6 测试xtest

xtest是OPTEE开源的测试代码，包含较完整的测试项，客户可以参考本章节测试xtest。

这里以安卓13上采用OP-TEE V2的arm64平台举例：

```shell
//编译CA TA
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
```

```batch
mm
//设备上创建plugins目录
# mkdir -p /vendor/lib64/tee-supplicant/plugins/
//推送TEE库文件和CA TA到设备
adb root && adb remount
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libteec.so
/vendor/lib64
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\tee-supplicant
/vendor/bin
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\xtest
/vendor/bin
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\crypt\cb3e5ba0-adf1-
11e0-998b-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\concurrent\e13010e0-
2ae1-11e5-896a-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push
Y:\rk_android_13\external\rk_tee_user\v2\out\ta\create_fail_test\c3f6e2c0-3548-
11e1-b86c-0800200c9a66.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\rpc_test\d17f73a0-36ef-
11e1-984a-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\sims\e6a33ed4-562b-463a
bb7e-ff5e15a493c8.ta /vendor/lib/optee_armtz
adb push
Y:\rk_android_13\external\rk_tee_user\v2\out\ta\concurrent_large\5ce0c432-0ab0-
40e5-a056-782ca0e6aba2.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\miss\528938ce-fc59-11e8-
8eb2-f2801f1b9fd1.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\socket\873bcd08-c2c3-
11e6-a937-d0bf9c45c61c.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\sims_keepalive\a4c04d50-
f180-11e8-8eb2-f2801f1b9fd1.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\os_test\5b9e0e40-2636-
11e1-ad9e-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\os_test_lib\ffd2bded
ab7d-4988-95ee-e4962fff7154.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\os_test_lib_dl\b3091a65-
9751-4784-abf7-0298a7cc35ba.ta /vendor/lib/optee_armtz
//测试安全存储，security空间有限会导致测试失败，删除parameter.txt中security分区，
//uboot不要定义CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION，默认使用安卓文件系统可以测试
通过
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\storage\b689f2a7-8adf-
477a-9f99-32e90c0ad0a2.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\storage2\731e279e-aafb
4575-a771-38caa6f0cca6.ta /vendor/lib/optee_armtz
adb push
Y:\rk_android_13\external\rk_tee_user\v2\out\ta\storage_benchmark\f157cda0-550c-
11e5-a6fa-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\supp_plugin\380231ac
fb99-47ad-a689-9e017eb6e78a.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\lib64\tee
supplicant\plugins\f07bfc66-958c-4a15-99c0-260e4e7375dd.plugin.so
/vendor/lib64/tee-supplicant/plugins/
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libckteec.so
/vendor/lib64
```

adb push Y:\rk\_android\_13\external\rk\_tee\_user\v2\export-ta\_arm32\ta\fd02c9da-  

306c-48c7-a49c-bbd827ae86ee.ta /vendor/lib/optee\_armtz  

//运行xtest

# tee-supplicant & //若tee-supplicant已经运行，可以忽略本步骤，安卓平台一般默认已经有运行  

# xtest

### 这里以Linux上采用OP-TEE V2的arm64平台举例

```batch
//编译CA TA
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432
//设备上创建optee_armtz目录，用于存放TA文件
# mkdir -p /lib/optee_armtz
//设备上创建plugins目录
# mkdir -p /usr/lib/tee-supplicant/plugins/
//推送TEE库文件和CA TA到设备
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so
/lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so.1
/lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\tee-supplicant
/usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\xtest\xtest
/usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\crypt\cb3e5ba0-
adf1-11e0-998b-0002a5d5c51b.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\concurrent\e13010e0-
2ae1-11e5-896a-0002a5d5c51b.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\create_fail_test\c3f6e2c
0-3548-11e1-b86c-0800200c9a66.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\rpc_test\d17f73a0-36ef-
11e1-984a-0002a5d5c51b.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\sims\e6a33ed4-
562b-463a-bb7e-ff5e15a493c8.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\concurrent_large\5ce0c43
2-0ab0-40e5-a056-782ca0e6aba2.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\miss\528938ce
fc59-11e8-8eb2-f2801f1b9fd1.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\socket\873bcd08-c2c3-
11e6-a937-d0bf9c45c61c.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\sims_keepalive\a4c04d50-
f180-11e8-8eb2-f2801f1b9fd1.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\os_test\5b9e0e40-2636-
11e1-ad9e-0002a5d5c51b.ta /lib/optee_armtz
```

```batch
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\os_test_lib\ffd2bded
ab7d-4988-95ee-e4962fff7154.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\os_test_lib_dl\b3091a65-
9751-4784-abf7-0298a7cc35ba.ta /lib/optee_armtz
//测试安全存储，security空间有限会导致测试失败，删除parameter.txt中security分区，
//uboot不要定义CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION，默认使用安卓文件系统可以测试
通过
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\storage\b689f2a7-8adf-
477a-9f99-32e90c0ad0a2.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\storage2\731e279e-aafb-
4575-a771-38caa6f0cca6.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\storage_benchmark\f157cd
a0-550c-11e5-a6fa-0002a5d5c51b.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\supp_plugin\380231ac
fb99-47ad-a689-9e017eb6e78a.ta /lib/optee_armtz
adb push
Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\supp_plugin\f07bfc66-958c-
4a15-99c0-260e4e7375dd.plugin /usr/lib/tee-supplicant/plugins/
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libckteec.so.0
/lib64
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\export
ta_arm32\ta\fd02c9da-306c-48c7-a49c-bbd827ae86ee.ta /lib/optee_armtz
//添加可执行权限
# chmod +x /usr/bin/tee-supplicant
# chmod +x /usr/bin/xtest
//运行CA TA
# tee-supplicant & //若tee-supplicant已经运行，可以忽略本步骤
# xtest
```

## 5. TA签名

### 5.1 原理

TEE binary内部保存着一份RSA公钥，在加载运行TA时，TEE OS将使用该公钥验证TA的合法性，验证通过才能正常运行TA应用，这将保证运行的TA都是合法。

### 5.2 替换公钥

为防止开发者A的TA应用运行在开发者B的板子上，建议开发者替换公钥。

开发者可以使用工具替换TEE binary中的公钥，所需工具在rk\_tee\_user工程tools/目录中。

Linux下替换：

./change\_puk --teebin &lt;TEE binary&gt;

该命令将自动生成一个2048长度的RSA密钥oemkey.pem并保存在当前目录下，并自动使用该密钥中的公钥替换TEE binary中的原始公钥。

```batch
./change_puk --teebin <TEE binary> --key oemkey.pem
```

使用开发者指定的密钥中的公钥来替换TEE binary中的原始公钥，密钥长度须2048长度。

Windows下替换：

打开Windows\_change\_puk.exe点击“生成oemkey.pem”按钮生成并保存密钥。

选择刚刚生成的密钥和TEE binary，点击修改公钥。

开发者需把之前工具生成的密钥或者指定的密钥重命名为oem\_privkey.pem并替换rk\_tee\_user工程

## 6. 内置TA到安全存储

### 6.1 原理

### 6.2 参考实现

以下为CA端代码，开发者可以先读取TA文件，然后通过 install\_ta 函数把TA数据发送到OP-TEE OS。

```c
static void install_ta(void *buf, size_t blen)
{
TEEC_Result res = TEEC_ERROR_GENERIC;
uint32_t err_origin = 0;
TEEC_UUID uuid = PTA_SECSTOR_TA_MGMT_UUID;
TEEC_Operation op;
TEEC_Context ctx = { };
TEEC_Session sess = { };
int i = 0;
res = TEEC_InitializeContext(NULL, &ctx);
if (res != TEEC_SUCCESS) {
printf("TEEC_InitializeContext failed with code 0x%x\n", res);
goto exit;
}
res = TEEC_OpenSession(&ctx, &sess, &uuid,
TEEC_LOGIN_PUBLIC, NULL, NULL, &err_origin);
if (res != TEEC_SUCCESS) {
printf("TEEC_Opensession failed with code 0x%x origin 0x%x\n",
res, err_origin);
goto exit;
}
memset(&op, 0, sizeof(op));
op.paramTypes = TEEC_PARAM_TYPES(TEEC_MEMREF_TEMP_INPUT, TEEC_NONE,
TEEC_NONE, TEEC_NONE);
op.params[0].tmpref.buffer = buf;
op.params[0].tmpref.size = blen;
res = TEEC_InvokeCommand(&sess, PTA_SECSTOR_TA_MGMT_BOOTSTRAP, &op,
&err_origin);
if (res != TEEC_SUCCESS) {
printf("TEEC_InvokeCommand failed with code 0x%x origin 0x%x\n",
res, err_origin);
goto exit;
}
printf("Installing TAs done\n");
exit:
TEEC_CloseSession(&sess);
TEEC_FinalizeContext(&ctx);
return;
```

## 7. 加密TA

### 7.1 加密TA方法

若开发者没有TA源码，只有TA二进制文件，可以使用工具对TA二进制文件进行加密，所需工具在rk\_tee\_user工程tools/目录中。

对明文TA进行加密的命令：

对密文TA重新加密的命令：

工具参数说明：

--key 指向用户私有的用于签名TA的非对称密钥文件。

--in 指向TA文件。

--enc\_key 用户私有的用于加密TA的对称密钥。

--ori\_enc\_key 原始加密TA的对称密钥。

### 7.2 烧写TA encryption key

开发者使用SDK工程RKTools目录下 RKDevInfoWriteTool 工具（版本号大于等于1.2.8）烧写TAencryption key。

为防止TA encryption key泄漏，工具不支持读TA encryption key。



### 7.3 解密并运行TA

加密TA与明文TA在使用上完全一致，OP-TEE OS在加载TA过程会自动识别到TA是加密的，OP-TEE OS会自动读取OTP中TA encryption key并解密运行TA，该过程由OP-TEE OS自动完成。

### 7.4 Soft TA encryption key

若开发者不想增加额外步骤去烧写 TA encryption key 到设备 OTP，可以使用 Soft TA encryption key，它是内置在 TEE binary 中的对称密钥。

若开发者有烧写 TA encryption key 到设备 OTP，则 OP-TEE OS 优先使用 OTP 中的 TA encryption key 去解密并运行TA，安全性较高。

若开发者没有烧写 TA encryption key 到设备 OTP，则 OP-TEE OS 使用 Soft TA encryption key 去解密并运行TA，安全性较低。

开发者需要使用工具替换 TEE binary 中的 Soft TA encryption key，所需工具在rk\_tee\_user工程tools/目录中。

替换 TEE binary 中默认 Soft TA encryption key 密钥的命令：

工具参数说明：

--teebin 为 TEE binary 固件路径。

--takey 为开发者私有的32字节密钥，需与加密TA时使用的密钥保持一致。

## 8. REE FS TA防回滚

### 8.1 使用TA防回滚

REE FS的TA防回滚功能始终开启，开发者可通过在Makefile定义TA的版本号来使用防回滚功能。

如果TA的Makefile始终不定义 CFG\_TA\_VERSION ，系统识别TA版本号为0，允许相同版本号的TA运行。

如果TA的Makefile定义当前 CFG\_TA\_VERSION 大于0，示例如下，则后续禁止该TA版本降级。

# unsigned integer format   

CFG\_TA\_VERSION=1

## 9. TA调试方法

### 9.1 optee v1平台

TA出现异常时会打印如下信息。

user TA data-abort at address 0x2a   

esr 0x92000021 ttbr0 0x400000852fc00 ttbr1 0x00000000 cidr 0x0   

cpu #4 cpsr 0x20000130   

#32位平台打印r0-r12, sp, lr, pc(402000a0)   

#64位平台打印x0-x30, sp\_el0, elr(00000000402000a0)   

Status of TA 8cccf200-2450-11e4-abe20002a5d5c52c (0x85109b0) (active)   

- load addr : 0x40200000 ctx-idr: 4   

- code area : 0x9200000 2097152   

- stack: 0x9400000 stack:2048   

TEEC\_InvokeCommand failed with code 0xffff3024 origin 0x3

异常打印中pc或elr就是异常发生的地址，load addr是TA加载到内存中的运行虚拟地址，所以elr - loadaddr = 0x402000a0 - 0x40200000 = 0xa0就是异常代码在TA中的偏移地址。

```asm
9c: 2161 movs r1, #97 ; 0x61
9e: 4820 ldr r0, [pc, #128] ; (120
<TA_InvokeCommandEntryPoint+0xa0>)
a0: 681b ldr r3, [r3, #0]
a2: 4478 add r0, pc
a4: 3033 adds r0, #51 ; 0x33
a6: 9301 str r3, [sp, #4]
a8: 4b1e ldr r3, [pc, #120] ; (124
<TA_InvokeCommandEntryPoint+0xa4>)
aa: 447b add r3, pc
ac: 9300 str r3, [sp, #0]
ae: 2301 movs r3, #1
b0: f002 fbc0 bl 2834 <trace_printf>
```

### 9.2 optee v2平台

TA出现异常时会打印如下信息。

E/TC:? 0 User mode data-abort at address 0x2a (translation fault)   

E/TC:? 0 esr 0x92000005 ttbr0 0x20000084a7020 ttbr1 0x00000000 cidr 0x0   

E/TC:? 0 cpu #1 cpsr 0x20000130   

#32位平台打印r0-r12, sp, lr, pc(c00870a4)   

#64位平台打印x0-x30, sp\_el0, elr(00000000c00870a4)   

E/LD: region 0: va 0xc0004000 pa 0x08600000 size 0x002000 flags rw-s (ldelf)   

E/LD: region 1: va 0xc0006000 pa 0x08602000 size 0x008000 flags r-xs (ldelf)   

E/LD: region 2: va 0xc000e000 pa 0x0860a000 size 0x001000 flags rw-s (ldelf)   

E/LD: region 3: va 0xc000f000 pa 0x0860b000 size 0x004000 flags rw-s (ldelf)   

E/LD: region 4: va 0xc0013000 pa 0x0860f000 size 0x001000 flags r--s   

E/LD: region 5: va 0xc0014000 pa 0x08625000 size 0x001000 flags rw-s (stack)   

E/LD: region 6: va 0xc0015000 pa 0x09201000 size 0x002000 flags rw-- (param)   

E/LD: region 7: va 0xc0087000 pa 0x00001000 size 0x009000 flags r-xs [0]   

E/LD: region 8: va 0xc0090000 pa 0x0000a000 size 0x00c000 flags rw-s [0]   

E/LD: [0] 8cccf200-2450-11e4-abe2-0002a5d5c52c @ 0xc0087000   

E/LD: Call stack:   

E/LD: 0xc00870a4   

E/LD: 0xc0088b21   

E/LD: 0xc008d507   

E/LD: 0xc008716c

/home/xxx/rk\_px30\_linux/external/optee\_test/ta/testapp/testapp\_ta.c:101   

9c: 6823 ldr r3, [r4, #0]   

9e: 2202 movs r2, #2   

a0: 4d28 ldr r5, [pc, #160] ; (144   

&lt;TA\_InvokeCommandEntryPoint+0xc4&gt;)

a2: 4e29 ldr r6, [pc, #164] ; (148   

&lt;TA\_InvokeCommandEntryPoint+0xc8&gt;)   

a4: 681b ldr r3, [r3, #0]   

a6: 447d add r5, pc   

a8: 447e add r6, pc   

aa: 3533 adds r5, #51 ; 0x33   

ac: 4628 mov r0, r5   

ae: 9600 str r6, [sp, #0]   

b0: 9301 str r3, [sp, #4]   

b2: 2301 movs r3, #1   

b4: f000 f912 bl 2dc &lt;trace\_printf&gt;

9. 3查看调用栈

若开发者调试代码时不仅仅要查看程序异常地址，还想查看整个函数调用栈，optee v2平台提供了脚本export-ta\_arm32\scripts\symbolize.py脚本实现该功能。optee v1平台暂不支持。

第一步，设置脚本需要的编译器路径，开发者请根据自己本地编译器路径自行调整。

```shell
#32位TA执行
export PATH=/home1/hisping/rk_px30_linux/prebuilts/gcc/linux-x86/arm/gcc-linaro-
6.3.1-2017.05-x86_64_arm-linux-gnueabihf/bin:$PATH
export CROSS_COMPILE=arm-linux-gnueabihf-
#64位TA执行
export PATH=/home1/hisping/rk_px30_linux/prebuilts/gcc/linux-x86/aarch64/gcc
linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin:$PATH
export CROSS_COMPILE=aarch64-linux-gnu-
```

第二步，执行脚本，其中-d参数指向开发者编译出的TA目录。

```shell
./export-ta_arm32/scripts/symbolize.py -d out/ta/testapp/
```

第三步，脚本会等待开发者输入异常打印信息，复制并粘贴异常打印信息，可以得到如下结果，其中Call stack就是函数调用栈。

I/TA: Hello Test App!   

E/TC:? 0   

E/TC:? 0 User mode data-abort at address 0x2a (translation fault)   

E/TC:? 0 esr 0x92000005 ttbr0 0x20000084a7020 ttbr1 0x00000000 cidr 0x0   

E/TC:? 0 cpu #1 cpsr 0x20000130   

E/TC:? 0 x0 00000000000069ee x1 0000000000000062   

E/TC:? 0 x2 0000000000000002 x3 000000000000002a   

E/TC:? 0 x4 00000000c0014f30 x5 00000000c0014f40   

E/TC:? 0 x6 00000000c0074080 x7 00000000c0074308   

E/TC:? 0 x8 00000000c00742e8 x9 00000000c0014f30   

E/TC:? 0 x10 0000000000000065 x11 00000000c007f2d8   

E/TC:? 0 x12 0000000000000773 x13 00000000c0014f00   

E/TC:? 0 x14 00000000c006cb0d x15 0000000000000000   

E/TC:? 0 x16 0000000000000000 x17 0000000000000000   

E/TC:? 0 x18 0000000000000000 x19 0000000000000000   

E/TC:? 0 x20 0000000000000000 x21 0000000000000000   

E/TC:? 0 x22 0000000000000000 x23 0000000000000000   

E/TC:? 0 x24 0000000000000000 x25 0000000000000000

```asm
E/TC:? 0 x26 0000000000000000 x27 0000000000000000
E/TC:? 0 x28 0000000000000000 x29 0000000000000000
E/TC:? 0 x30 0000000000000000 elr 00000000c006b0a4
E/TC:? 0 sp_el0 00000000c0014f80
E/LD: Status of TA 8cccf200-2450-11e4-abe2-0002a5d5c52c
E/LD: arch: arm
E/LD: region 0: va 0xc0004000 pa 0x08600000 size 0x002000 flags rw-s (ldelf)
E/LD: region 1: va 0xc0006000 pa 0x08602000 size 0x008000 flags r-xs (ldelf)
E/LD: region 2: va 0xc000e000 pa 0x0860a000 size 0x001000 flags rw-s (ldelf)
E/LD: region 3: va 0xc000f000 pa 0x0860b000 size 0x004000 flags rw-s (ldelf)
E/LD: region 4: va 0xc0013000 pa 0x0860f000 size 0x001000 flags r--s
E/LD: region 5: va 0xc0014000 pa 0x08625000 size 0x001000 flags rw-s (stack)
E/LD: region 6: va 0xc0015000 pa 0x09201000 size 0x002000 flags rw-- (param)
E/LD: region 7: va 0xc006b000 pa 0x00001000 size 0x009000 flags r-xs [0]
.ta_head .text .rodata .ARM.extab .ARM.exidx .dynsym .dynstr .hash
E/LD: region 8: va 0xc0074000 pa 0x0000a000 size 0x00c000 flags rw-s [0]
.dynamic .got .rel.got .data .bss .rel.dyn
E/LD: [0] 8cccf200-2450-11e4-abe2-0002a5d5c52c @ 0xc006b000
(out/ta/testapp/8cccf200-2450-11e4-abe2-0002a5d5c52c.elf)
E/LD: Call stack:
E/LD: 0xc006b0a4 TA_InvokeCommandEntryPoint at ta/testapp/testapp_ta.c:98
E/LD: 0xc006cb0d entry_invoke_command at
/home/zhangzj/secure/optee_3.6.0/optee_os/lib/libutee/arch/arm/user_ta_entry.c:35
7
E/LD: 0xc00714f3 __ta_entry_c at export-ta_arm32/src/user_ta_header.c:48
E/LD: 0xc006b158 __ta_entry at export-ta_arm32/src/ta_entry_a32.S:20
```

## 10. 内存相关说明

### 10.1 OP-TEE V1


| 平台 | TEE_RAM | TA_RAM | SHMEM |
| --- | --- | --- | --- |
| RK312x | 1M | 12M | 1M |
| RK322x | 1M | 12M | 2M |
| RK3288 | 1M | 12M | 2M |
| RK3368 | 2M | 24M | 4M |
| RK3328/RK322xH | 2M | 24M | 4M |
| RK3399/RK3399Pro | 2M | 24M | 4M |

说明：Secure OS运行在TEE\_RAM，TA运行在 TA\_RAM ，SHMEM为共享内存。

### 10.2 OP-TEE V2


| 平台 | TEE_RAM | TA_RAM | SHMEM |
| --- | --- | --- | --- |
| RK3326/PX30 | 2M | 4M | 2M |
| RK3358 | 2M | 4M | 2M |
| RK3308 | 2M | 1M | 1M |
| RK1808 | 2M | 1M | 1M |
| RV1109/RV1126 | 760K | 1M | 512K |
| RK3566/RK3568 | 2M | 12M | 2M |
| RK3588 | 2M | 12M | 2M |
| RK3528 | 2M | 4M | 2M |
| RK3562 | 2M | 4M | 2M |
| RV1106 | 1M | 1M | 512K |

说明：Secure OS运行在TEE\_RAM，TA运行在 TA\_RAM ，SHMEM为共享内存。

OPTEE OS已支持打印安全内存大小，开发者可以在启动log中查看到如下信息。

若启动log打印的大小与上述列表不一致则以打印为准。

## 11. 安全存储

### 11.1 分区

1. 安全存储是OPTEE OS重要的功能之一，一般用于存储用户重要数据，数据经过OPTEE OS加密存储于security分区、rpmb分区、Android/Linux文件系统。

TEE安全存储共3种：

第一种，TA代码中设置storageID = TEE\_STORAGE\_PRIVATE\_RPMB，则使用emmc rpmb进行安全存储，各emmc型号rpmb大小不同，常见为4M。

第二种，parameter.txt中有定义security分区，且TA代码中设置storageID =TEE\_STORAGE\_PRIVATE\_REE，此时安全存储存放于security分区，security分区目前可用为512k。

2. Uboot端安全存储，请参考 “U-Boot 中TEE驱动” 章节。

### 11.2 性能测试

OPTEE V1平台，RK3399 Linux平台，CPU定频1200000，DDR定频200000000，进行测试：


| 存储区域 | 数据大小 | 创建文件 | 写数据 | 读数据 | 删除文件 |
| --- | --- | --- | --- | --- | --- |
| Linux文件系统 | 30K | 16ms | 67ms | 61ms | 19ms |
| Linux文件系统 | 4K | 17ms | 23ms | 13ms | 7ms |
| Linux文件系统 | 1K | 18ms | 16ms | 7ms | 6ms |
| Linux文件系统 | 32 | 23ms | 16ms | 7ms | 7ms |
| security分区 | 30K | 97ms | 181ms | 54ms | 277ms |
| security分区 | 4K | 101ms | 74ms | 14ms | 101ms |
| security分区 | 1K | 104ms | 56ms | 7ms | 64ms |
| security分区 | 32 | 103ms | 55ms | 7ms | 73ms |
| rpmb分区 | 30K | 20ms | 233ms | 10ms | 7ms |
| rpmb分区 | 4K | 20ms | 36ms | 3ms | 6ms |
| rpmb分区 | 1K | 22ms | 14ms | 2ms | 6ms |
| rpmb分区 | 32 | 27ms | 8ms | 2ms | 6ms |

OPTEE V2平台，RK356x Linux平台，CPU定频1416000，DDR定频324000000，进行测试：


| 存储区域 | 数据大小 | 创建文件 | 写数据 | 读数据 | 删除文件 |
| --- | --- | --- | --- | --- | --- |
| Linux文件系统 | 30K | 17ms | 28ms | 3ms | 8ms |
| Linux文件系统 | 4K | 17ms | 11ms | 1ms | 8ms |
| Linux文件系统 | 1K | 18ms | 9ms | 1ms | 8ms |
| Linux文件系统 | 32 | 19ms | 8ms | lms | 7ms |
| security分区 | 30K | 12ms | 12ms | 4ms | 12ms |
| security分区 | 4K | 12ms | 3ms | lms | 11ms |
| security分区 | 1K | 13ms | 2ms | lms | 11ms |
| security分区 | 32 | 15ms | 3ms | 1ms | 14ms |
| rpmb分区 | 30K | 23ms | 287ms | 16ms | 5ms |
| rpmb分区 | 4K | 24ms | 50ms | 7ms | 6ms |
| rpmb分区 | 1K | 23ms | 22ms | 5ms | 6ms |
| rpmb分区 | 32 | 30ms | 12ms | 5ms | 5ms |

## 12. 强弱安全等级可选的方案

## 12.1方案的适用范围

方案适用于：RK3588、RK3528、RK3562及后续新平台。

### 12.2 注意事项

在使用本方案之前，开发者需注意以下事项。

请在首次下载固件之前，确认uboot的配置项CONFIG\_OPTEE\_SECURITY\_LEVEL已按需求配置。芯片只支持一次配置，后续无法修改。

如果采用“强安全方案2”，请先用工具“RKDevInfoWriteTool(V1.3.5及以上版本)”，下载OEM HUK。

### 12.3 方案说明

方案支持由开发者配置OPTEE的安全等级，不同的安全等级对eMMC/安全存储的保护强度不同。


| 安全等级方案 | 说明 | CONFIG_OPTEE_SECURITY_LEVEL(uboot的配置项) |
| --- | --- | --- |
| 强安全方案1 | 主控和eMMC/安全存储的数据强绑定，更换主控后，需同步更换eMMC芯片和擦除其他安全存储数据 | 2 |
| 强安全方案2 | 主控和eMMC/安全存储的数据弱绑定，由开发者定义的OEM HUK来派生eMMC/安全存储的保护密钥，更换主控后，如果下载相同的OEMHUK，可继续使用原有的eMMC芯片和其他安全存储数据 | 1 |
| 弱安全方案 | 主控和eMMC/安全存储的数据不绑定，更换主控后，可继续使用原有的eMMC芯片和其他安全存储数据 | 0或不配置 |

以上不同安全等级的差异，源于eMMC和安全存储相关密钥的差异。下面介绍本方案相关的密钥。

HUK(Hardware Unique Key)：用于派生RPMB Key、Secure Storage Key以及其他密钥。不同安全的等级，HUK不同，详见下图。

Hard HUK是基于Device Root Key派生的，一机一密，Device Root Key在芯片出厂时已烧录到安全OTP中。

OEM HUK是由开发者定义的，由开发者烧录到安全OTP中。

Soft HUK是Rockchip定义的，所有芯片为同一个密钥，固化在固件的密钥。

RPMB Key：eMMC芯片RPMB分区的存储保护密钥。

Secure Storage Key：安全存储保护密钥。

Other Key：OP-TEE中用于其他用途的密钥。



## 13. OTP说明


| OTP类型 | 说明 | 支持的平台 |
| --- | --- | --- |
| OEMCipherKey | 该OEM Zone区域用于存储用户密钥，密钥一旦写入不可更改，用户烧写密钥后可以使用指定密钥进行加解密操作。 | rv1126, rv1109, rk3566,rk3568, rk3588, rk3528,rk3562, rv1106 |
| ProtectedOEMZone | 该OEM Zone区域仅供运行在OP-TEE OS上的合法Trust Application(TA应用) 调用，非安全世界无法直接读写该OEM Zone区域。Demo请参考rk_test。 | rk3308, rk3326, rk3358,rk3566, rk3568, rk3588,rv1126, rv1109, rk3528,rk3562, rv1106 |
| Non-ProtectedOEMZone | 该OEM Zone区域可以被U-Boot和UserSpace调用，数据会暴露在非安全世界内存中。 | rk3308, rk3326, rk3358,rk3566, rk3568, rk3588,rv1106, rk3528, rk3562 |

更多细节请参考《Rockchip\_Developer\_Guide\_OTP\_CN.pdf》文档。

## 14. TA API说明

### 14.1 概述

RK提供以下TA API，有两个目的：

供开发者参考常用的GlobalPlatform TEE Internal Core API的用法

供开发者直接使用API

### 14.2 API的返回值

API的返回值有：

TEE\_SUCCESS: 成功

TEE\_ERROR\_BAD\_PARAMETERS: 参数错误

其他错误: 见 tee\_api\_defines.h

### 14.3 API说明

#### 14.3.1 Crypto API

##### 14.3.1.1 rk\_crypto\_malloc\_ctx

```c
crypto_ctx_t *rk_crypto_malloc_ctx(void);
```

功能

申请crypto操作句柄资源。

参数

无

##### 14.3.1.2 rk\_crypto\_free\_ctx

void rk_crypto_free_ctx(crypto_ctx_t **ctx);

功能

释放crypto操作句柄，完整的算法执行完毕，需执行本函数以释放资源。

### 参数

ctx: 操作句柄

##### 14.3.1.3 rk\_hash\_crypto

功能

消息摘要算法。如需分段，可使用 rk\_hash\_begin/update/finish 接口。

### 参数

in: 输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

algo: 算法类型，支持 TEE\_ALG\_MD5, TEE\_ALG\_SHA1, TEE\_ALG\_SHA224, TEE\_ALG\_SHA256,TEE\_ALG\_SHA384, TEE\_ALG\_SHA512

##### 14.3.1.4 rk\_hash\_begin

TEE\_Result rk\_hash\_begin(crypto\_ctx\_t \*ctx, uint32\_t algo);

### 功能

消息摘要分段算法，初始化操作。

### 参数

ctx: 操作句柄

algo: 算法类型，支持 TEE\_ALG\_MD5, TEE\_ALG\_SHA1, TEE\_ALG\_SHA224, TEE\_ALG\_SHA256,TEE\_ALG\_SHA384, TEE\_ALG\_SHA512

##### 14.3.1.5 rk\_hash\_update

```c
TEE_Result rk_hash_update(crypto_ctx_t *ctx, uint8_t *in, uint32_t in_len);
```

### 功能

消息摘要分段算法，对输入的数据，在内部计算摘要。

### 参数

ctx: 操作句柄

in: 输入数据

in\_len: 输入数据长度

##### 14.3.1.6 rk\_hash\_finish

### 功能

消息摘要分段算法，计算最后一段数据并输出所有数据的摘要。

### 参数

ctx: 操作句柄

in: 输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

##### 14.3.1.7 rk\_cipher\_crypto

### 功能

对称加解密算法接口。如需分段，可使用 rk\_cipher\_begin/update/finish 接口。

### 参数

in: 输入数据

len: 输入数据的长度

out: 输出数据

key: algo对应的密钥

key\_len: 密钥长度，不同的algo，支持的密钥长度略有不同

iv: 初始向量

algo: 算法类型，支持以下算法(OP-TEE V1版本不支持SM算法)

TEE\_ALG\_AES\_ECB\_NOPAD   

TEE\_ALG\_AES\_CBC\_NOPAD   

TEE\_ALG\_AES\_CTR   

TEE\_ALG\_AES\_CTS   

TEE\_ALG\_AES\_XTS   

TEE\_ALG\_SM4\_ECB\_NOPAD   

TEE\_ALG\_SM4\_CBC\_NOPAD   

TEE\_ALG\_SM4\_CTR   

TEE\_ALG\_DES\_ECB\_NOPAD   

TEE\_ALG\_DES\_CBC\_NOPAD   

TEE\_ALG\_DES3\_ECB\_NOPAD   

TEE\_ALG\_DES3\_CBC\_NOPAD

mode: 加密或解密模式

##### 14.3.1.8 rk\_set\_padding

TEE\_Result rk\_set\_padding(crypto\_ctx\_t \*ctx, int padding);

### 功能

设置对加解密数据的填充模式。

### 参数

ctx: 操作句柄

padding: 支持的模式见 rk\_padding\_t

##### 14.3.1.9 rk\_cipher\_begin

```c
TEE_Result rk_cipher_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
uint8_t *iv, uint32_t algo, TEE_OperationMode mode);
```

### 功能

对称加解密分段算法的初始化操作。

### 参数

ctx: 操作句柄

key: 密钥

key\_len: 密钥长度，不同的algo，支持的密钥长度略有不同

iv: 初始向量

algo: 算法类型，支持以下算法(OP-TEE V1版本不支持SM算法)

TEE\_ALG\_AES\_ECB\_NOPAD   

TEE\_ALG\_AES\_CBC\_NOPAD   

TEE\_ALG\_AES\_CTR   

TEE\_ALG\_AES\_CTS   

TEE\_ALG\_AES\_XTS   

TEE\_ALG\_SM4\_ECB\_NOPAD   

TEE\_ALG\_SM4\_CBC\_NOPAD   

TEE\_ALG\_SM4\_CTR   

TEE\_ALG\_DES\_ECB\_NOPAD   

TEE\_ALG\_DES\_CBC\_NOPAD   

TEE\_ALG\_DES3\_ECB\_NOPAD   

TEE\_ALG\_DES3\_CBC\_NOPAD

mode: 加密或解密模式

##### 14.3.1.10 rk\_cipher\_update

### 功能

对称加解密分段算法，对输入的数据进行加解密。

### 参数

ctx: 操作句柄

in: 待加解密的输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

##### 14.3.1.11 rk\_cipher\_finish

TEE\_Result rk\_cipher\_finish(crypto\_ctx\_t \*ctx, uint8\_t \*out, uint32\_t \*out\_len);

### 功能

对称加解密分段算法，完成加解密操作。

### 参数

ctx: 操作句柄

out: 输出数据

out\_len: 输出数据长度

14.3.1.12 rk\_ae\_begin

### 功能

AES-CCM或AES-GCM算法的初始化操作。

### 参数

ctx: 操作句柄

key: 密钥

key\_len: 密钥长度，支持16，24，32

iv: 初始向量

iv\_len: 向量长度

add\_len: AES-CCM时的ADD长度

tag\_len: tag长度（bit），AES-GCM支持128, 120, 112, 104, 96; AES-CCM支持128, 112, 96, 80, 64, 48,32

payload\_len: AES-CCM时的payload长度

algo: 算法类型，支持 TEE\_ALG\_AES\_GCM, TEE\_ALG\_AES\_CCM

mode: 加密或解密模式

##### 14.3.1.13 rk\_ae\_update

### 功能

AES-CCM或AES-GCM算法，对输入的数据进行加解密。

### 参数

ctx: 操作句柄

in: 待加解密的输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

is\_add: 是否有AAD(Additional Authentication Data)

##### 14.3.1.14 rk\_ae\_finish

```c
TEE_Result rk_ae_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
uint8_t *tag, uint32_t in_len,
uint32_t *out_len, uint32_t *tag_len);
```

### 功能

AES-CCM或AES-GCM算法，完成加解密操作。

### 参数

ctx: 操作句柄

in: 待处理的最后一段输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

tag: 输出数据缓冲区填充的tag

tag\_len: tag长度

##### 14.3.1.15 rk\_gen\_rsa\_key

### 功能

随机生成RSA公私钥对。

### 参数

rsa\_key: 生成的RSA公私钥对

key\_len: RSA密钥长度（字节），支持32，64，96，128，192，256，384，512

public\_exponent: 指数，支持3，65537

##### 14.3.1.16 rk\_rsa\_crypto

TEE\_Result rk\_rsa\_crypto(uint8\_t \*in, uint8\_t \*out, uint32\_t len,   

rsa\_key\_t \*key, uint32\_t algo, TEE\_OperationMode mode);

### 功能

RSA加密、解密算法。也可使用 rk\_rsa\_begin/finish 接口实现。

### 参数

in: 输入数据

len: 输入数据长度

out: 输出数据

key: RSA密钥

algo: RSA算法填充模式，支持以下

TEE\_ALG\_RSAES\_PKCS1\_V1\_5   

TEE\_ALG\_RSAES\_PKCS1\_OAEP\_MGF1\_SHA1   

TEE\_ALG\_RSAES\_PKCS1\_OAEP\_MGF1\_SHA224   

TEE\_ALG\_RSAES\_PKCS1\_OAEP\_MGF1\_SHA256   

TEE\_ALG\_RSAES\_PKCS1\_OAEP\_MGF1\_SHA384   

TEE\_ALG\_RSAES\_PKCS1\_OAEP\_MGF1\_SHA512   

TEE\_ALG\_RSA\_NOPAD

mode: 加解密模式， TEE\_MODE\_ENCRYPT 或 TEE\_MODE\_DECRYPT

##### 14.3.1.17 rk\_rsa\_sign

### 功能

RSA签名、验签。也可使用 rk\_rsa\_begin/finish 接口实现。

### 参数

digest: 摘要值

signature: 签名输出的值，或者输入待验签的值

digest\_len: 摘要长度

signature\_len: 签名值长度

key: rsa密钥

salt\_len: salt的字节数，此参数是可选的。如果不存在，salt长度等于摘要长度

algo: 算法，详见GPD\_TEE\_Internal\_Core\_API\_Specification，Table 6-4

mode: 模式， TEE\_MODE\_SIGN 或 TEE\_MODE\_VERIFY

##### 14.3.1.18 rk\_set\_sign\_mode

TEE\_Result rk\_set\_sign\_mode(crypto\_ctx\_t \*ctx, unsigned int mode);

### 功能

设置RSA签名模式，对数据签名或对摘要签名。

### 参数

ctx: 操作句柄

mode: 数据 SIGN\_DATA 或摘要 SIGN\_DIGEST

##### 14.3.1.19 rk\_rsa\_begin

### 功能

RSA加密、解密、签名、验签算法的初始化操作。

### 参数

ctx: 操作句柄

key: RSA密钥

algo: 算法填充模式，不同的mode允许的algo不同，详见

mode: 算法类型，支持 TEE\_MODE\_ENCRYPT, TEE\_MODE\_DECRYPT, TEE\_MODE\_SIGN,

##### 14.3.1.20 rk\_rsa\_finish

TEE\_Result rk\_rsa\_finish(crypto\_ctx\_t \*ctx, uint8\_t \*in, uint8\_t \*out,   

uint32\_t in\_len, uint32\_t \*out\_len, uint32\_t salt\_len);

### 功能

在 rk\_rsa\_begin 之后执行的RSA加密、解密、签名、验签算法。

### 参数

ctx: 操作句柄

in: 输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

salt\_len: salt的字节数，此参数是可选的

##### 14.3.1.21 rk\_gen\_ec\_key

TEE\_Result rk\_gen\_ec\_key(ec\_key\_t \*ec\_key, uint32\_t key\_len, uint32\_t curve);

### 功能

随机生成ECC密钥对。

### 参数

ec\_key: 生成的ECC公私钥对

key\_len: 密钥长度（bit），支持192，224，256，384，521

curve: ECC曲线，支持的曲线见 tee\_api\_defines.h

##### 14.3.1.22 rk\_ecdh\_genkey

### 功能

进行ECDH，协商对称密钥。

### 参数

private: ECC私钥

publicx: ECC公钥X坐标

publicy: ECC公钥Y坐标

keysize: 密钥长度（bit），支持192，224，256，384，521

out: 输出的对称密钥

##### 14.3.1.23 rk\_ecdsa\_sign

### 功能

ECDSA签名、验签算法。也可使用 rk\_ecdsa\_begin/finish 接口实现。

### 参数

digest: 输入的摘要

signature: 输出的签名值，或者输入的待验签的值

digest\_len: 摘要长度

signature\_len: 签名值长度

key: ECC密钥

mode: 支持 TEE\_MODE\_SIGN, TEE\_MODE\_VERIFY

##### 14.3.1.24 rk\_ecdsa\_begin

### 功能

ECDSA签名、验签算法的初始化操作。

### 参数

ctx: 操作句柄

key: ECC密钥

mode: 支持 TEE\_MODE\_SIGN, TEE\_MODE\_VERIFY

##### 14.3.1.25 rk\_ecdsa\_finish

### 功能

ECDSA签名、验签算法，对输入的摘要进行签名，或者对输入的摘要、签名值进行验签。

### 参数

ctx: 操作句柄

in: 输入的摘要

out: 输出的签名值，或者输入的待验签的值

in\_len: 摘要长度

out\_len: 签名值长度

##### 14.3.1.26 rk\_sm2\_pke

```c
TEE_Result rk_sm2_pke(uint8_t *in, uint32_t in_len, uint8_t *out,
uint32_t *out_len, ec_key_t *key,
uint32_t algo, TEE_OperationMode mode);
```

### 功能

SM2加密、解密。OP-TEE V1版本不支持该接口。

### 参数

in: 输入待加密解密的数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

key: SM2密钥

algo: 算法，支持 TEE\_ALG\_SM2\_PKE

mode: 模式，支持 TEE\_MODE\_ENCRYPT 和 TEE\_MODE\_DECRYPT

##### 14.3.1.27 rk\_sm2\_dsa\_sm3

### 功能

SM2签名或验签。OP-TEE V1版本不支持该接口。

### 参数

digest: SM3摘要

digest\_len: SM3摘要长度，固定为32

signature: 输出的签名数据，或者输入的待验证的签名数据

signature\_len: 签名数据的长度

key: SM2密钥

algo: 算法，支持 TEE\_ALG\_SM2\_DSA\_SM3

mode: 签名 TEE\_MODE\_SIGN 或验签 TEE\_MODE\_VERIFY

##### 14.3.1.28 rk\_sm2\_kep\_genkey

```c
TEE_Result rk_sm2_kep_genkey(rk_sm2_kep_parms *kep_parms, uint8_t *share_key,
uint32_t share_key_len, uint8_t *conf_out);
```

### 功能

基于SM2的ECDH算法。OP-TEE V1版本不支持该接口。

### 参数

kep\_parms: SM2密钥信息，包含A的私钥和B的公钥

share\_key: 输出ECDH协商的对称密钥

share\_key\_len: share\_key长度

conf\_out: 用于校验的会话信息

##### 14.3.1.29 rk\_mac\_crypto

```c
TEE_Result rk_mac_crypto(uint8_t *in, uint8_t *out, uint32_t in_len,
uint32_t *out_len, uint8_t *key, uint32_t key_len,
uint8_t *iv, uint32_t algo);
```

### 功能

MAC计算。如需分段，可使用 rk\_mac\_begin/update/finish 接口。

### 参数

in: 输入数据

in\_len: 输入数据长度

out: 输出数据

out\_len: 输出数据长度

key: MAC密钥

key\_len: 密钥长度

iv: 初始向量

algo: MAC算法类型, (OP-TEE V1版本不支持SM算法)， TEE\_ALG\_HMAC\_MD5,

TEE\_ALG\_HMAC\_SHA1, TEE\_ALG\_HMAC\_SHA256, TEE\_ALG\_AES\_CMAC, TEE\_ALG\_HMAC\_SM3

##### 14.3.1.30 rk\_mac\_begin

TEE\_Result rk\_mac\_begin(crypto\_ctx\_t \*ctx, uint8\_t \*key, uint32\_t key\_len,   

uint8\_t \*iv, uint32\_t algo);

### 功能

MAC分段算法，初始化操作。

### 参数

ctx: 操作句柄

key: MAC密钥

key\_len: 密钥长度

iv: 初始向量

algo: MAC算法类型, (OP-TEE V1版本不支持SM算法)， TEE\_ALG\_HMAC\_MD5,

TEE\_ALG\_HMAC\_SHA1, TEE\_ALG\_HMAC\_SHA256, TEE\_ALG\_AES\_CMAC, TEE\_ALG\_HMAC\_SM3

##### 14.3.1.31 rk\_mac\_update

```c
TEE_Result rk_mac_update(crypto_ctx_t *ctx, uint8_t *in, uint32_t in_len);
```

### 功能

algo: 支持 TEE\_ALG\_HKDF\_MD5\_DERIVE\_KEY, TEE\_ALG\_HKDF\_SHA1\_DERIVE\_KEY,   

TEE\_ALG\_HKDF\_SHA224\_DERIVE\_KEY, TEE\_ALG\_HKDF SHA256\_DERIVE\_KEY,   

TEE\_ALG\_HKDF\_SHA384\_DERIVE\_KEY, TEE\_ALG\_HKDF\_SHA512\_DERIVE\_KEY

MAC分段算法，积累输入数据，用于计算MAC。

### 参数

ctx: 操作句柄

in: 输入数据

in\_len: 输入数据长度

##### 14.3.1.32 rk\_mac\_finish

TEE\_Result rk\_mac\_finish(crypto\_ctx\_t \*ctx, uint8\_t \*in, uint8\_t \*mac,   

uint32\_t in\_len, uint32\_t \*mac\_len, rk\_mac\_mode\_t mode);

### 功能

MAC分段算法，输入最后一段数据计算MAC，或者输入最后一段数据和预期的MAC值，输出校验结果。

### 参数

ctx: 操作句柄

in: 最后一段输入数据

in\_len: 输入数据长度

mac: 当 mode=RK\_MAC\_SIGN 时输出MAC值，当 mode=RK\_MAC\_VERIFY 时，输入预期的MAC值

mac\_len: MAC值的长度

mode: 见“mac”

##### 14.3.1.33 rk\_hkdf\_genkey

### 功能

HKDF密钥派生函数。

### 参数

ikm: 输入的密码

ikm\_len: 密码长度

salt: 输入的salt

salt\_len: salt长度

info: 输入的info

info\_len: info长度

okm\_len: 输入的派生的密钥长度

okm: 派生的密钥

##### 14.3.1.34 rk\_pkcs5\_pbkdf2\_hmac

### 功能

通过指定的salt和iteration count以及password，派生密钥。

### 参数

password: 输入的密码

password\_len: 密码长度

salt: 输入的salt

salt\_len: salt长度

iterations: 输入的iteration count值

algo: 支持 TEE\_ALG\_PBKDF2\_HMAC\_SHA1\_DERIVE\_KEY

key\_len: 输入的派生的密钥长度

out\_key: 派生的密钥

#### 14.3.2 HW Crypto API

##### 14.3.2.1 rk\_user\_ta\_cipher

TEE\_Result rk\_user\_ta\_cipher(rk\_cipher\_config \*config, uint8\_t \*src, uint32\_t   

len)

### 功能

使用硬件Crypto进行加解密计算。

### 参数

config: 算法参数，用于配置算法类型、算法模式、密钥等

src: 输入输出数据

len：数据长度

#### 14.3.3 TRNG API

##### 14.3.3.1 rk\_get\_trng

TEE\_Result rk\_get\_trng(uint8\_t \*buffer, uint32\_t size);

### 功能

获取硬件随机数。

仅部分平台支持，如果不支持该接口，将返回TEE\_ERROR\_NOT\_SUPPORTED。

### 参数

buffer: 返回的硬件随机数，buffer内存空间必须不小于size

size: 待获取的随机数长度

#### 14.3.4 Derive Key API

##### 14.3.4.1 rk\_derive\_ta\_unique\_key

TEE\_Result rk\_derive\_ta\_unique\_key(uint8\_t \*extra, uint16\_t extra\_size, uint8\_t   

\*key, uint16\_t key\_size)

### 功能

获取由硬件唯一密钥派生的密钥。

每颗芯片生产时都会注入硬件唯一密钥，由此密钥派生的密钥具有唯一性。

### 参数

extra: 输入数据，用于派生出不同的密钥

extra\_size: 输入数据长度

key：派生出来的密钥

key\_size：密钥长度

#### 14.3.5 OTP API

##### 14.3.5.1 rk\_otp\_size

TEE\_Result rk\_otp\_size(uint32\_t \*otp\_size);

### 功能

获取安全OTP中Protected OEM Zone的总大小。

### 参数

otp\_size: 返回的OTP的总大小

##### 14.3.5.2 rk\_otp\_read

TEE\_Result rk\_otp\_read(uint32\_t offset, uint8\_t \*data, uint32\_t len);

### 功能

读取安全OTP中Protected OEM Zone数据。

### 参数

offset: 待读取的OTP区域的位置偏移

data: 返回的OTP数据，data内存空间必须不小于len

len: 待读取的长度

```sql
TEE_Result rk_otp_write(uint32_t offset, uint8_t *data, uint32_t len);
```

功能

写数据到安全OTP中Protected OEM Zone。

### 参数

offset: 待写入到OTP区域的位置偏移

data: 待写入到OTP的数据

len: data长度

## 15. 相关资料扩展

ARM官方TrustZone

https://developer.arm.com/ip-products/security-ip/trustzone

GlobalPlatform官网：

https://globalplatform.org/

该网站可下载CA开发API参考文档： TEE Client API Specification

TA开发API参考文档： TEE Internal Core API Specification

以及其他架构方面参考文档。
