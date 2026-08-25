---
sidebar_position: 1
---

# RT-Thread-Ymodem

### Ymodem开发指南

## 前言

## 概述

产品版本


| 芯片名称 | 内核版本 |
| --- | --- |
| 通用 | 通用 |

读者对象

本文档（本指南）主要适用于以下工程师：

技术支持工程师

软件开发工程师

修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 刘诗舫 | 2019-12-20 | 初始版本 |

目录

odem开发指南  

1. 基本原理  

1.1 握手阶段  

1.2 传输阶段  

1.3 结束阶段  

2. 应用指南  

2.1 Ymodem配置  

2.2 接收文件功能使用  

2.3 发送文件功能使用  

3. 存在的问题及优化方向  

4. Ymodem软件兼容情况

## 1. 基本原理

Ymodem是一种使用串口进行文件传输的协议，由Xmodem演变而来。Ymodem协议数据块通常有128-byte和1024-byte两种，对应的数据包大小有133-byte和1029-byte两种。Ymodem协议采用CRC16校验，校验失败直接结束传输流程。Chuck Forsberg在设计Ymodem协议时考虑增加多项可选的特性，包括数据包大小、校验方式、出错重发机制等。但也正因为这种没有严格规定协议标准的做法，导致Ymodem出现很多亚种。目前很多软件的Ymodem协议可能不兼容。RT-Thread中的Ymodem协议主要兼容SecureCRT软件实现。Ymodem协议通讯流程如图所示，分为接收端和发送端，整个传输过程有三个阶段：握手阶段、传输阶段、结束阶段。


| 一 SENDER 一 一 一 一 一 | I 一 | &lt;--- | RECIEVER \| C(0x43) \| |  |
| --- | --- | --- | --- | --- |
| \| SOH\|0x00\|0xFF\|File_name 00 File_size NULL\|CRC16\| \| | &lt;--- | Time out I C(0x43) I |  |  |
|  | ---&gt; | I |  |  |
|  | &lt;--- | ACK(0x06)\| |  |  |
|  | &lt;--- | C(0x43) I |  |  |
| \|CRC16\| \| ---&gt; |  | I |  |  |
| \| &lt;--- |  | ACK(0x06)\| |  |  |
| \|SOH\|0x02\|0xFD\| 一 | Data[0~127] | \|CRC16\| \| ---&gt; |  | I |
|  | . |  | \| &lt;--- | ACK(0x06)Ⅰ |
| Data[0~??] 0x1A |  | \|CRC16\| \| ---&gt; |  | 一 一 |
| \| SOH\|0x??\|0x??\| |  |  | &lt;--- | ACK(0x06)\| |
| 一 EOT |  |  | ---&gt; |  |
| 一 |  |  | &lt;--- | I |
| EOT |  |  | ---&gt; | NAK(0x15)\| |
| 一 |  |  | &lt;--- | I ACK(0x06)\| |
| 一 |  |  | &lt;--- | C(0x43) I |
| \|SOH\|0x00\|0xFF\| | NULL | \|CRC16\|\| | ---&gt; | I |
| 一 |  |  | &lt;--- | ACK(0x06)\| |
|  |  |  |  |  |

### 1.1 握手阶段

接收端每隔一段时间（这里设为1s）发送请求字符C（0x43），发送端收到请求后发送数据包

SOH|0x00|0xFF|File\_name 00 File\_size NULL|CRC16| ，这里的SOH（0x01）为128-byte数据块的数据包头，如果使用1024-byte数据块则需要将数据包头改为STX（0x02）。0x00为数据包序号，0xFF为数据包序号的反码，File\_name将会是接收端生成文件的文件名，File\_size将会是接收端生成文件准备的存储区域大小。需要注意的是Ymodem协议中File\_size通常为文件大小（单位为byte）的十六进制ASCII码，而实际上SecureCRT软件中的File\_size为文件大小（单位为byte）的十进制ASCII码。数据包最后两位为CRC16校验码。接收端收到数据包后发送应答字符ACK（0x06），再发送请求字符C（0x43）正式开始文件传输。

握手阶段开始时，如果接收端发送请求字符C（0x43）一直没有收到发送端的数据包，则接收端在多次请求失败（这里设为10次）将会超时退出。

### 1.2 传输阶段

发送端发送数据包 SOH|0x01|0xFE| Data[0\~127] |CRC16| ，接收端收到数据包后发送应答字符ACK（0x06），发送端继续发送下一个数据包。注意，在SecureCRT软件中的Ymodem协议并没有接收端接收数据包错误后发送NAK（0x15）请求重发的机制，而是在出现错误后直接退出传输流程。但经过测试（测试方案参考应用指南中相关内容），文件大小超过5M，在115200串口波特率的传输条件下，

Ymodem协议没有出现过一次错误。文件传输即将结束时，发送端发送最后一个数据包SOH|0x??|0x??| Data[0\~??] 0x1A |CRC16| 。数据块不足128-byte的部分用0x1A补全，0x1A是为了模拟文件结束操作Ctrl+Z。因此，如果发现通过Ymodem协议传输后的文件末尾出现多个0x1A，这是正常现象，不影响文件特性和文件使用。在文件传输阶段，发送端主动发送字符CAN（0x18）可以结束传输，或是在终端软件中使用Ctrl+C主动结束传输。

### 1.3 结束阶段

发送端发送结束字符EOT（0x04），接收端发送错误应答字符NAK（0x15）请求再次确认结束，发送端再次发送结束字符EOT（0x04），接收端发送应答字符ACK（0x06）结束当前文件的传输。接收端发送请求字符C（0x43）请求发送下一个文件，如果发送端没有文件发送，则发送空的数据包SOH|0x00|0xFF| NULL |CRC16| ，接收端收到后发送应答字符ACK（0x06）。至此，一次Ymodem文件传输结束。

## 2. 应用指南

### 2.1 Ymodem配置

Ymodem包括协议层代码和应用示例代码。代码在 /components/utilities/ymodem 路径下，ymodem.c和ymodem.h为协议层代码，ry\_sy.c为收发文件的应用示例代码。

使用 scons --menuconfig 在Utilities工具选择列表下启用Ymodem功能。Ymodem在RT-Thread中常用于其他厂商的OTA在线升级，这不需要对DFS文件系统产生依赖。但Rockchip使用Ymodem协议主要用于收发文件，ry\_sy.c应用示例代码需要读写DFS文件系统。因此，启用文件传输特性就可以使用ry\_sy指令进行文件收发。CRC Table作为可选配置，如果启用此选项，Ymodem协议CRC校验将使用查表法，这种方法相比于直接计算CRC的方法理论上更快，实际上在128-byte数据块、波特率115200的传输环境下不会有显著提升。不启用此选项将会节省存储空间。完成所有配置后下载编译的固件，就可以通过串口使用Ymodem协议进行文件收发了。

RT-Thread Components ---&gt;   

Utilities ---&gt;   

[\*] Enable Ymodem   

[ ] Enable CRC Table in Ymodem   

[\*] Enable file transfer feature

### 2.2 接收文件功能使用

使用Ymodem接收文件，默认使用Console控制台，可以通过指令参数使用任意uart设备。在Console控制台输入指令ry，可以看到控制台出现请求字符C等待上位机发送文件，点击SecureCRT工具栏Transfer，点击Send Ymodem即可选择文件进行发送。接收文件过程中控制台将会打印进度。整个操作流程如图所示。选择任意uart设备，例如输入指令 ry uart2 即可在uart2设备上进行相应操作。特别注意，文件传输过程中会临时禁止向串口打印任何内容。

$$

```
\begin{array}{c} \begin{array} { r l r } {  { \begin{array} { l } { \mathsf { m s h \ / > r y } } \\ { \mathsf { C C C } } \end{array} } } \\ & { } & { \mathsf { S t a r t \ " ~ i n g ~ \gamma \ " ~ m o d e m ~ t r ~ a n s f e r . ~ \gamma ~ \mathsf { P r e s s ~ \subset ~ \mathsf { t r } ~ \mathsf { T } + \mathsf { C } ~ \mathsf { \ t o ~ c a n c e l . } } ~ } } \\ & { } & { \mathsf { T r a n s f e r \ " { n g } ~ \mathsf { t e s t . } ~ m p 3 . \cdot \mathsf { \Omega } _ { 3 } ~ \mathsf { K B / s e c } ~ } \end{array} } \qquad \mathsf { o 0 : 1 0 : 5 1 } \qquad \mathsf { O } \qquad \mathsf { 0 }  \end{array}
```

$$

Errors

接收文件默认保存在根目录下，用户可以通过修改ry\_sy.c代码中的 \_rym\_recv\_begin 函数修改接收文件保存路径 fpath 。

### 2.3 发送文件功能使用

使用Ymodem发送文件，默认使用Console控制台，可以通过指令参数使用任意uart设备。在Console控制台输入指令sy file\_path，可以看到控制台等待上位机接收文件，点击SecureCRT工具栏Transfer，点击Receive Ymodem即可开始上位机文件接收。发送文件过程中控制台将会打印进度。整个操作流程如图所示。选择任意uart设备，例如输入指令 sy file\_path uart2 即可在uart2设备上进行相应操作。特别注意，文件传输过程中会临时禁止向串口打印任何内容。

msh /&gt;sy /test.mp3

Starting ymodem transfer. Press Ctrl+C to cancel.

0 Errors

发送文件的文件路径请使用绝对路径，暂不支持相对路径。接收端生成的新文件的名字会包含整个文件路径，用户可以通过修改ry\_sy.c代码中的 \_rym\_send\_begin 函数解析文件路径，从而实现接收端文件名不包含文件路径。

## 3. 存在的问题及优化方向

目前Ymodem协议部分和应用示例部分代码已完成Upstream，成功Merge RT-Thread主分支，如图。进一步开发将对Ymodem进行以下几个方面的优化：

1. Ymodem协议支持发送1024-byte数据块的数据包。

2. 目前串口波特率为115200，传输速率稳定在4kB/s左右。提高波特率至1.5M及以上在文件传输过程中会出现错误。

3. 波特率为115200时理论极限速率在11kB/s，实际极限速率在8kB/s，协议开销较大。

4. Ymodem协议支持更多终端软件。

# [components]: utilities: ymodem: Add ymodem send protocol and ry\_sy application.#3264

## 4. Ymodem软件兼容情况


| 操作系统 | 终端软件 | 接收功能 | 发送功能 |
| --- | --- | --- | --- |
| Windows | SecureCRT | 支持 | 支持 |
| MacOS | SecureCRT | 不支持 | 支持 |
| MacOS | Minicom | 不支持 | 不支持 |
| Linux | Minicom | 支持 | 不支持 |
