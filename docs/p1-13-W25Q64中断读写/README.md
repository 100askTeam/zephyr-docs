---
title: 第 13 课：W25Q64 中断读写
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 13 课：W25Q64 中断读写

本课下载预编译固件 [`13_w25q64_interrupt_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/13_w25q64_interrupt_demo.zip)（解压得 `13_w25q64_interrupt_demo.hex`） 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，以 **FIFO 中断模式**体验底板 **M12** 上 W25Q64 SPI NOR Flash 的擦除、写入与读回校验。

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

:::note[共用引脚提示：建议顺手拔掉 M6 超声波模块]
**M12（W25Q64）** 的片选 `CS` 与 **M6（HC-SR04 超声波）** 的 `Trig` 共用 `PB05`。虽然未拔 M6 通常不影响 SPI 通信，但片选翻转会连带触发超声波发波，建议实验时拔除 M6。建议先跑通第 12 课 `w25q64_polling_demo` 确认硬件连接无误后再运行本课。
:::

> **与第 12 课的区别**：在 FIFO 中断模式下，只有当 SPI 发送 FIFO 需要补数据或接收 FIFO 有数据时才进入中断服务程序；在等待硬件发送/接收的间隙，Zephyr 内核可以调度其他线程，适合有并发任务的应用。如果底板保留了 **M1 OLED**，屏幕顶部会实时标识为 **`W25Q64 IRQ`** 并显示每轮 **`PASS/FAIL`** 与 `Seq` 序号（未插屏时自动降级为仅串口输出）。

## 下载并烧录体验固件

1. **下载并解压预编译固件**：点击下载 [`13_w25q64_interrupt_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/13_w25q64_interrupt_demo.zip)，解压得到 `13_w25q64_interrupt_demo.hex` 烧录文件；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入解压得到的 `13_w25q64_interrupt_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 24 课：W25Q64 中断读写开发](../p2-24-W25Q64中断读写开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`），确认运行模式显示为中断模式且擦写校验持续成功：

1. **M1 OLED 状态面板**：顶部黄区显示 `M12 W25Q64 IRQ`，蓝区同步刷新 `PASS` 徽章与 `Seq #XXX`（未识别到芯片时提示 `NO FLASH CHIP`）；
2. **核心板心跳灯**：绿色 LED（`PC22`）每 3 秒闪烁一次；
3. **串口日志示例**：

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
| `probe: MISO samples = FF FF FF FF ...` | 模块未插好、接触不良、未上电（若插有 M6 超声波模块可一并拔除以减少供电干扰） |
| `probe: MISO samples = 00 00 EF 40 17 ...`（整体滞后一字节） | 传输启动时序偏差；先烧录第 12 课 `w25q64_polling_demo` 验证硬件连接正常后再回到本课 |
| `ERROR: flash device not ready` | 核对模块型号是否为 W25Q64（JEDEC ID `EF 40 17`）及 M12 插接方向 |

---

[上一课：W25Q64 轮询读写](../p1-12-W25Q64轮询读写/README.md) · [下一课：W25Q64 DMA 读写](../p1-14-W25Q64-DMA读写/README.md) · [课程目录](../README.md)
