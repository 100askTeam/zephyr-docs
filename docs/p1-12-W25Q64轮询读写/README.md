---
title: 第 12 课：W25Q64 轮询读写
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 12 课：W25Q64 轮询读写

本课下载预编译固件 [`12_w25q64_polling_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/12_w25q64_polling_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，以 **Polling（轮询）** 模式体验底板 **M12** 上 W25Q64（8 MiB SPI NOR Flash）的 JEDEC 识别与擦写校验。

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

:::note[共用引脚提示：建议顺手拔掉 M6 超声波模块]
**M12（W25Q64）** 的片选 `CS` 与第 6 课 **M6（HC-SR04 超声波）** 的触发脚 `Trig` 共用 `PB05`（W25Q64 未使用 `PE01`）。两边在 `PB05` 上均为输入脚，未拔 M6 通常不会阻塞 Flash 读写，但每次片选拉高都会顺带触发超声波模块发波耗电，**建议实验时顺手拔下 M6 以减小电源纹波**。
:::

:::tip[建议保持 M1 OLED 插在底板上 + 从 Polling 模式开始验证]
- **M1 OLED 联动显示**：M1（`PF12/PF13`）与 M12（`PB04~PB07`）无引脚冲突，保留 M1 屏幕可直接显示 `M12 W25Q64 POLL`、`PASS/FAIL` 徽章与递增的 `Seq` 序号（未识别芯片时自动提示 `NO FLASH CHIP` 与 JEDEC ID；未插屏时自动降级）。
- 本系列共有三个 W25Q64 示例（第 12 课轮询、第 13 课中断、第 14 课 DMA），除 SPI 传输方式外逻辑完全一致。Polling 模式时序最简单直观，**建议先用本例确认模块插接与 JEDEC ID 读取完全正常，再去体验中断与 DMA 模式**。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`12_w25q64_polling_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/12_w25q64_polling_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `12_w25q64_polling_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 23 课：W25Q64 轮询读写开发](../p2-23-W25Q64轮询读写开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **M1 OLED 校验状态面板**：顶部黄区显示 `M12 W25Q64 POLL`，正常运行时蓝区显示 `8MiB NOR  4KB Sec0`、反白 `PASS` 徽章与每 3 秒递增的 `Seq #XXX`；若未识别到 Flash 会醒目提示 `NO FLASH CHIP` 与 JEDEC 探测字节（如 `JEDEC: FF FF FF`）；
2. **核心板心跳灯**：绿色 LED（`PC22`）每 3 秒与擦写校验同节奏闪烁；
3. **JEDEC 识别与擦写校验**：启动时能正确读回 W25Q64 的 JEDEC ID（`EF 40 17`，总容量 `128 sectors x 65536 bytes = 8192 KiB`），随后每 3 秒对第 0 扇区执行一次 `4 KiB` 擦除、写入 256 字节测试序列并读回比对，每次递增 `seq` 序号；
4. **串口日志示例**：

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
| `probe: MISO samples = FF FF FF FF ...` | 模块未插好、接触不良、未上电或片选信号异常；若同时插着 M6 超声波模块可拔除以排除供电纹波干扰 |
| 打印 `ERROR: flash device not ready` | 检查模块是否为 W25Q64（JEDEC ID 应为 `EF 40 17`）及插座方向是否正确 |
| 报错 `ERROR: verify mismatch!` | 检查供电与插针接触稳定性，按住模块再复位观察是否接触松动 |

---

[上一课：红外发射与接收通信](../p1-11-红外发射与接收通信/README.md) · [下一课：W25Q64 中断读写](../p1-13-W25Q64中断读写/README.md) · [课程目录](../README.md)
