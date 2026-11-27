---
title: gpSP 动态重编译
description: 按步骤准备硬件与 TF 卡 .gba 游戏 ROM、烧录 15_gpsp-full.img，实测 RISC-V 动态重编译加速下的 60 fps 满速 GBA 体验。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# gpSP 动态重编译

搭载带 **RISC-V 动态重编译器（Dynarec）** 的 gpSP 高速 GBA 模拟核心：将 GBA 指令动态翻译为 RISC-V 原生代码运行，每帧耗时仅约 4～6 ms，**支持高达 32 MiB 的大容量 `.gba` ROM** 且内置开源 BIOS（免自备 BIOS）。

<SourceRefBar sourcePath="zephyr-components/gbsp/samples/gbsp_player" to="/docs/yuzukineko/dev/zephyr/apps/gpsp" />

## 第一步：准备硬件连接

<YuzukiBoardStage defaultBoard="base" isHero={false} focusNodes={['dsi', 'amp', 'slot']} />

1. 确认 YuzukiNeko 已装在 YuzukiCube-M 底板上，扣紧 `FPC1` 40 脚屏排线，并将 2 脚扬声器插到底板 `CN3`。
2. 通过 USB-C 线（或经串口分线器）连接电脑，方便烧录与在串口对比帧耗时。

## 第二步：准备 `.gba` 游戏并配置 TF 卡（必做）

游戏 ROM 需自备（注意 gpSP **仅支持 `.gba`**，不支持 `.gb` / `.gbc`）：

1. 将 TF 卡格式化为 **FAT32**（或 exFAT）。
2. 将单文件 **不超过 32 MiB** 的 `.gba` 游戏文件直接复制到 TF 卡**根目录**。
3. 固件优先寻找 `/SD:/Pokemon-FireRed.gba`；找不到时自动加载根目录里找到的**第一个 `.gba` 文件**（如根目录放了多个 `.gba`，可把想测试的那个改名为 `Pokemon-FireRed.gba` 或只留一个 `.gba`）：

```text
TF 卡根目录/
├── your_game.gba    # 必放（<= 32 MiB，仅支持 .gba；优先匹配 Pokemon-FireRed.gba）
└── gba_bios.bin     # 可选；不放时自动使用内置开源 BIOS
```

4. 安全弹出读卡器，插入 YuzukiNeko 正面右侧卡槽。游戏存档会自动保存为同目录的同名 `.sav`（注意与 mGBA 的 `.sav` 不互通）。

## 第三步：下载并烧录固件

<FirmwareDownloadCard filename="15_gpsp-full.img" size="3.18 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第四步：上电满速实测与串口验证

1. 插好 TF 卡上电，游戏以 60 fps 满速运行，屏幕叠加 10 键半透明虚拟手柄（顶部左右角 L/R、左下方向键、右下 A/B、底部中间 SELECT/START，支持 5 指同按，按下变橙色高亮），`CN3` 扬声器输出流畅伴音。
2. 打开串口终端（115200 8N1），每 5 秒输出一次性能统计，实测典型每帧仅 4～6 ms、声音 `underruns` 为 `0`、`skipped` 为 `0`：

```text
gba: 300 frames, emulation 5120 us/frame, sound 240000 frames pushed, queued 2600, underruns 0, skipped 0
```

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 放了 `.gb` / `.gbc` 报错无法打开 | gpSP 仅支持 GBA 架构 | 仅放 `.gba` 文件；玩 GB / GBC 请改用 `14_mgba-full.img` |
| 个别对原版 BIOS 敏感的游戏白屏 | 开源替代 BIOS 存在极少数游戏兼容差异 | 在 TF 卡根目录放入自备的 `gba_bios.bin` 后重新上电 |
| 沿用 mGBA 的 `.sav` 读不出进度 | 两者存档文件格式不同 | 切换模拟器前先将旧 `.sav` 移出或备份 |

---

[上一项：mGBA 掌机模拟](14-mgba.md) · [下一项：Win95 · Bochs x86](16-win95.md) · [应用总览](overview.md)
