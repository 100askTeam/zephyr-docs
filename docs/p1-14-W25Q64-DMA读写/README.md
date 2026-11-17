---
title: 第 14 课：W25Q64 DMA 读写
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 14 课：W25Q64 DMA 读写

本课下载预编译固件 [`14_w25q64_dma_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/14_w25q64_dma_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，体验 **HDMA 传输模式**驱动底板 **M12** 上 W25Q64 SPI NOR Flash 的擦除、写入与读回校验。

## 硬件准备与接线

<KitExplorer focus="m12" variant="dma" />

硬件接线与第 12、13 课完全相同，将 W25Q64 模块插入底板 **M12** 插座（3.3V）：

| 模块信号 | 底板 M12 插座 | 核心板 J4 | HPM6E70 引脚 | SPI5 功能 |
| --- | --- | :---: | --- | --- |
| `VCC` | `3.3V` | — | `3.3V` | 3.3V 供电 |
| `GND` | `GND` | — | `GND` | 公共地 |
| `SCK` | `SCK` | 10 | **PB04** | `SPI5_SCLK` |
| `MISO（DO）` | `DO` | 11 | **PB06** | `SPI5_MISO` |
| `MOSI（DI）` | `DI` | 12 | **PB07** | `SPI5_MOSI` |
| `CS` | `CS` | 4 | **PB05** | GPIO 片选（与 M6 Trig 共线） |

:::note[共用引脚提示：建议顺手拔掉 M6 超声波模块]
**M12（W25Q64）** 的片选 `CS` 与 **M6（HC-SR04 超声波）** 的 `Trig` 共用 `PB05`；为避免片选拉高时顺带触发超声波发波耗电，建议实验时拔除 M6。
:::

> **与前两课的区别**：在 DMA 模式下，由 HDMA 控制器在内存与 SPI FIFO 之间搬运数据，大块读写时 CPU 占用最低。保留底板 **M1 OLED** 时，屏幕顶部会标识 **`W25Q64 DMA`** 并同步刷新校验徽章与序号（未插屏时自动降级为仅串口输出）。底层配置与 Cache 维护细节见 [二期第 25 课：W25Q64 DMA 读写开发](../p2-25-W25Q64-DMA读写开发/README.md)。

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`14_w25q64_dma_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/14_w25q64_dma_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `14_w25q64_dma_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 25 课：W25Q64 DMA 读写开发](../p2-25-W25Q64-DMA读写开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`），确认模式显示为 DMA 模式且擦写校验稳定通过：

1. **M1 OLED 状态面板**：顶部黄区显示 `M12 W25Q64 DMA`，蓝区同步刷新 `PASS` 徽章与 `Seq #XXX`（未识别到芯片时提示 `NO FLASH CHIP`）；
2. **核心板心跳灯**：绿色 LED（`PC22`）每 3 秒闪烁一次；
3. **串口日志示例**：

```text
W25Q64 demo: coreboard + spi nor flash
SPI transfer mode: dma
SDRAM quick check PASSED (32 MiB)
probe: MISO samples = 00 EF 40 17 00 00 00 00
flash: w25q64@0 ready, 128 sectors x 65536 bytes = 8192 KiB
flash: erase+write+read OK (seq=0, 256 bytes, data=57563400...)
Init complete. LED blinking, flash test every 3 s.
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| `probe: MISO samples = FF FF FF FF ...` | 模块未插好、接触不良、未上电（若插有 M6 超声波模块可一并拔除以减少供电干扰） |
| `probe: MISO samples = 00 00 EF 40 17 ...`（整体滞后一字节） | 传输启动时序异常；先烧录第 12 课 `w25q64_polling_demo` 验证硬件本身正常 |
| DMA 模式读回全 0 | 先烧录第 12 课确认硬件接触正常，排查设备树 `&hdma` 与 SPI DMA 配置请参考 [二期第 25 课](../p2-25-W25Q64-DMA读写开发/README.md) |
| `ERROR: flash device not ready` | 核对模块型号是否为 W25Q64（JEDEC ID `EF 40 17`）及 M12 插接方向 |

:::tip[接下来学什么？]
至此你已经完成全部 14 节外设模块的快速体验！接下来建议进入 [二期：驱动、应用与设备树](../p2-01-从example-application认识标准工程/README.md)（含全部 14 个 Demo 的源码位置、代码解析与 `west build` / `west flash` 开发步骤），或者在 [三期：搭建 SDK Glue 工作区](../p3-01-搭建SDK-Glue工作区/README.md) 学习工程底座移植。
:::

---

[上一课：W25Q64 中断读写](../p1-13-W25Q64中断读写/README.md) · [下一阶段：二期第 1 课](../p2-01-从example-application认识标准工程/README.md) · [课程目录](../README.md)
