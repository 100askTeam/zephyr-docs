---
title: 第 12 课：W25Q64 轮询读写
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 12 课：W25Q64 轮询读写

在 `HPM6E70` 完整工程包中编译并烧录 `applications/w25q64_polling_demo`，以最稳妥的 **Polling（轮询/阻塞）** 模式通过 SPI5 对底板 **M12** 插座上的 W25Q64（8 MiB SPI NOR Flash）每 3 秒执行一次“擦除 → 写入 → 读回校验”。

## 硬件准备与接线

<KitExplorer focus="m12" variant="polling" />

将 W25Q64 SPI Flash 模块插入模块化底板的 **M12** 插座（3.3V）：

| 模块信号 | 底板 M12 插座 | 核心板 J4 | HPM6E70 引脚 | SPI5 功能 |
| --- | --- | :---: | --- | --- |
| `VCC` | `3.3V` | — | `3.3V` | 3.3V 供电 |
| `GND` | `GND` | — | `GND` | 公共地 |
| `SCK` | `SCK` | 10 | **PB04** | `SPI5_SCLK` |
| `MISO（DO）` | `DO` | 11 | **PB06** | `SPI5_MISO` |
| `MOSI（DI）` | `DI` | 12 | **PB07** | `SPI5_MOSI` |
| `CS` | `CS` | 4 | **PB05** | GPIO 片选（与 M6 Trig 共线） |

:::danger[重要互斥：运行前必须拔掉 M6 超声波模块]
**M12（W25Q64）** 与第 6 课使用的 **M6（HC-SR04 超声波模块）** 共用核心板 `PB05` / `PE01` 引脚，**两者互斥、绝对不能同时插在底板上**！测试 Flash 前请务必先把 M6 拔掉。
:::

:::tip[建议先从 Polling 模式开始验证]
本系列共有三个 W25Q64 示例（第 12 课轮询、第 13 课中断、第 14 课 DMA），除 SPI 传输方式外逻辑完全一致。Polling 模式时序最简单直观，**建议先用本例确认模块插接与 JEDEC ID 读取完全正常，再去体验中断与 DMA 模式**。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\w25q64_polling_demo -d build\w25q64_polling_demo
.\.venv\Scripts\python.exe -m west flash -d build\w25q64_polling_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：绿色 LED（`PC22`）每 3 秒与擦写校验同节奏闪烁；
2. **JEDEC 识别与擦写校验**：启动时能正确读回 W25Q64 的 JEDEC ID（`EF 40 17`，总容量 `128 sectors x 65536 bytes = 8192 KiB`），随后每 3 秒对第 0 扇区执行一次 `4 KiB` 擦除、写入 256 字节测试序列并读回比对，每次递增 `seq` 序号；
3. **串口日志示例**：

```text
W25Q64 demo: coreboard + spi nor flash
SPI transfer mode: polling
SDRAM quick check PASSED (32 MiB)
probe: MISO samples = 00 EF 40 17 00 00 00 00
flash: w25q64@0 ready, 128 sectors x 65536 bytes = 8192 KiB
flash: erase+write+read OK (seq=0, 256 bytes, data=57563400...)
Init complete. LED blinking, flash test every 3 s.
```

> 日志中 `00` 为发送 `0x9F` 命令字节期间收到的占位字节，紧随其后的 `EF 40 17` 即 Winbond W25Q64 的标准 JEDEC ID。

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| `probe: MISO samples = FF FF FF FF ...` | 模块未插好、接触不良、未上电或片选信号异常；同时确认 **M6 超声波模块已拔掉** |
| 打印 `ERROR: flash device not ready` | 检查模块是否为 W25Q64（JEDEC ID 应为 `EF 40 17`）及插座方向是否正确 |
| 报错 `ERROR: verify mismatch!` | 检查供电与插针接触稳定性，按住模块再复位观察是否接触松动 |

---

[上一课：红外发射与接收通信](../p1-11-红外发射与接收通信/README.md) · [下一课：W25Q64 中断读写](../p1-13-W25Q64中断读写/README.md) · [课程目录](../README.md)
