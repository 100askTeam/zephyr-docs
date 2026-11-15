---
title: 第 13 课：W25Q64 中断读写
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 13 课：W25Q64 中断读写

在 `HPM6E70` 完整工程包中编译并烧录 `applications/w25q64_interrupt_demo`，切换为 **FIFO 中断模式**驱动底板 **M12** 上的 W25Q64 SPI NOR Flash，完成同样每 3 秒一轮的擦除、写入与读回校验。

## 硬件准备与接线

<KitExplorer focus="m12" variant="interrupt" />

硬件接线与第 12 课完全相同，将 W25Q64 模块插入底板 **M12** 插座（3.3V）：

| 模块信号 | 底板 M12 插座 | 核心板 J4 | HPM6E70 引脚 | SPI5 功能 |
| --- | --- | :---: | --- | --- |
| `VCC` | `3.3V` | — | `3.3V` | 3.3V 供电 |
| `GND` | `GND` | — | `GND` | 公共地 |
| `SCK` | `SCK` | 10 | **PB04** | `SPI5_SCLK` |
| `MISO（DO）` | `DO` | 11 | **PB06** | `SPI5_MISO` |
| `MOSI（DI）` | `DI` | 12 | **PB07** | `SPI5_MOSI` |
| `CS` | `CS` | 4 | **PB05** | GPIO 片选（与 M6 Trig 共线） |

:::danger[重要互斥：M12 与 M6 互斥]
**M12（W25Q64）** 与 **M6（HC-SR04 超声波模块）** 共用 `PB05` / `PE01` 引脚，运行前务必确保 **M6 保持拔除状态**。建议先跑通第 12 课 `w25q64_polling_demo` 确认硬件无误后再运行本课。
:::

> **与第 12 课的区别**：在 FIFO 中断模式下，只有当 SPI 发送 FIFO 需要补数据或接收 FIFO 有数据时才进入中断服务程序；在等待硬件发送/接收的间隙，Zephyr 内核可以调度其他线程，适合有并发任务的应用。

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\w25q64_interrupt_demo -d build\w25q64_interrupt_demo
.\.venv\Scripts\python.exe -m west flash -d build\w25q64_interrupt_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`），确认运行模式打印为 `interrupt` 且擦写校验持续成功：

1. **核心板心跳灯**：绿色 LED（`PC22`）每 3 秒闪烁一次；
2. **串口日志示例**：

```text
W25Q64 demo: coreboard + spi nor flash
SPI transfer mode: interrupt
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
| `probe: MISO samples = 00 00 EF 40 17 ...`（整体滞后一字节） | 传输启动时序偏差；先烧录第 12 课 `w25q64_polling_demo` 验证硬件连接正常后再回到本课 |
| `ERROR: flash device not ready` | 核对模块型号是否为 W25Q64（JEDEC ID `EF 40 17`）及 M12 插接方向 |

---

[上一课：W25Q64 轮询读写](../p1-12-W25Q64轮询读写/README.md) · [下一课：W25Q64 DMA 读写](../p1-14-W25Q64-DMA读写/README.md) · [课程目录](../README.md)
