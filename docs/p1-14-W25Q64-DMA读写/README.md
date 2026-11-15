---
title: 第 14 课：W25Q64 DMA 读写
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 14 课：W25Q64 DMA 读写

在 `HPM6E70` 完整工程包中编译并烧录 `applications/w25q64_dma_demo`，启用 **HDMA 传输模式**驱动底板 **M12** 上的 W25Q64 SPI NOR Flash：由 HDMA 在内存与 SPI FIFO 之间搬运数据（配套 D-Cache 一致性维护），同样每 3 秒完成一次擦除、写入与读回校验。

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

:::danger[重要互斥：M12 与 M6 互斥]
**M12（W25Q64）** 与 **M6（HC-SR04 超声波模块）** 共用 `PB05` / `PE01` 引脚，运行前务必确保 **M6 保持拔除状态**。
:::

> **与前两课的区别**：在 DMA 模式下，CPU 仅配置传输参数并触发 HDMA，无需逐字节搬运 FIFO，大块数据吞吐时 CPU 占用最低。示例工程通过 `CONFIG_SPI_HPM_SPI_DMA=y` 与 `CONFIG_SPI_HPM_DMA_BUFFER_SIZE=512` 配合 `&hdma` 设备树节点完成 D-Cache 行对齐的自动分块搬运。

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\w25q64_dma_demo -d build\w25q64_dma_demo
.\.venv\Scripts\python.exe -m west flash -d build\w25q64_dma_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`），确认模式显示为 `dma` 且擦写校验稳定通过：

1. **核心板心跳灯**：绿色 LED（`PC22`）每 3 秒闪烁一次；
2. **串口日志示例**：

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
| `probe: MISO samples = FF FF FF FF ...` | 模块未插好、接触不良、未上电或未拔除 M6 冲突模块 |
| `probe: MISO samples = 00 00 EF 40 17 ...`（整体滞后一字节） | 传输启动时序异常；先烧录第 12 课 `w25q64_polling_demo` 验证硬件本身正常 |
| DMA 模式读回全 0 | 检查是否使用了完整 `HPM6E70` 工程包并带 `-p always` 重新构建，确保 overlay 启用了 `&hdma` 且板级 SPI DMA 驱动完整 |
| `ERROR: flash device not ready` | 核对模块型号是否为 W25Q64（JEDEC ID `EF 40 17`）及 M12 插接方向 |

:::tip[接下来学什么？]
至此你已经跑通了全部 14 个外设模块 Demo！如果想搞清楚这些驱动、设备树节点与 Binding 是怎样从代码一步步写出来的，可以继续学习 [二期：从 example-application 认识标准工程](../p2-01-从example-application认识标准工程/README.md)；如果想了解工程工作区和板卡适配本身是怎么从零搭出来的，可以查看 [三期：搭建 SDK Glue 工作区](../p3-01-搭建SDK-Glue工作区/README.md)。
:::

---

[上一课：W25Q64 中断读写](../p1-13-W25Q64中断读写/README.md) · [下一阶段：二期第 1 课](../p2-01-从example-application认识标准工程/README.md) · [课程目录](../README.md)
