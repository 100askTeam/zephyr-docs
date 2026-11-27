---
title: ncnn 神经网络推理
description: 按步骤连接串口、烧录 17_ncnn-full.img，免 TF 卡免屏幕实测腾讯 ncnn 在玄铁 C907 RISC-V 向量扩展（RVV 128-bit）下的推理耗时。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# ncnn 神经网络推理

内置腾讯开源神经网络推理框架 **ncnn** 与多款轻量视觉模型，启用玄铁 C907 **RISC-V 向量扩展（RVV 128-bit）** 硬件加速。**无需 TF 卡、无需屏幕、无需联网，单板接串口即可自动跑完基准测试并输出耗时表**。

<SourceRefBar sourcePath="zephyr-components/ncnn/samples/benchmark" to="/docs/yuzukineko/dev/zephyr/apps/ncnn" />

## 第一步：准备硬件与串口终端

<YuzukiBoardStage defaultBoard="core" isHero={false} focusNodes={['usbc', 'soc']} />

1. 按 [连接开发板与串口](../start/01-hardware-and-uart.md) 用串口分线器连接 YuzukiNeko 与电脑（单板即可，有无底板均不影响）。
2. 在电脑提前打开串口终端（115200 8N1，无校验、无流控）并保持连接状态，防止重启瞬间漏看开头日志。

## 第二步：下载并烧录固件

<FirmwareDownloadCard filename="17_ncnn-full.img" size="2.84 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第三步：在串口观察 RVV 推理基准结果

1. 烧录自动重启后（或保持串口打开状态下重新拔插一次 USB-C 供电线），程序会自动对每个内置模型先预热 8 轮、再正式计时 4 轮。
2. 观察串口终端依次打印出 RVV 向量状态与各模型单次完整前向推理耗时（单位：毫秒 `ms`）：

```text
*** Booting Zephyr OS build v4.5.0 ***
ncnn: vector extension on, VLEN 128 bits
ncnn: free heap is all RAM above the image, starting
loop_count = 4
num_threads = 1
powersave = 0
gpu_device = -1
cooling_down = 0
           blazeface  min =  175.92  max =  177.27  avg =  176.52
          FastestDet  min =  710.23  max =  710.70  avg =  710.43
      yolo-fastestv2  min =  670.47  max =  674.43  avg =  671.97
    yolo-fastest-1.1  min =  759.50  max =  761.41  avg =  760.05
ncnn benchmark done, ret 0
```

3. **确认测试通过标志**：
   - 开头出现 `ncnn: vector extension on, VLEN 128 bits`：说明玄铁 C907 的 128 位 RVV 向量加速已启用；
   - 依次打印 4 个轻量视觉模型的 `min / max / avg`（毫秒）；
   - 结尾打印 `ncnn benchmark done, ret 0` 表示全部模型基准运行完毕。

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 插在底板上但屏幕是黑的 | 为给神经网络腾出全部 RAM，该固件关闭了显示驱动 | 属正常设计，直接通过串口终端（115200 8N1）查看结果 |
| 串口打开后一片空白 | 烧录重启时串口晚开，测试已经跑完结束 | 保持串口打开状态，重新插拔一次 USB-C 供电线即可从头重新跑一遍 |

---

[上一项：Win95 · Bochs x86](16-win95.md) · [应用总览](overview.md) · [进入二期：工程与外设开发](../dev/zephyr/guide/01-workspace-and-first-app.md)
