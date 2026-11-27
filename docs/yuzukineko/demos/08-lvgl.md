---
title: LVGL 图形界面
description: 按步骤连接底板彩屏、烧录 08_lvgl-full.img，免 TF 卡免联网直接测试 1024×768 显示色彩、LVGL 9.6 动效与电容触控。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# LVGL 图形界面

内置 **LVGL 9.6 音乐播放器交互演示**，**无需 TF 卡、无需联网、无需外部素材**，烧录上电即可直接检验屏幕显示色彩、动画刷新流畅度与 GT967 电容触摸屏灵敏度。

<SourceRefBar sourcePath="zephyr/samples/modules/lvgl/demos" to="/docs/yuzukineko/dev/zephyr/apps/lvgl" />

## 第一步：准备硬件连接

<YuzukiBoardStage defaultBoard="base" isHero={false} focusNodes={['dsi', 'slot']} />

1. 确认 YuzukiNeko 已装在 YuzukiCube-M 底板上，将 40 脚屏排线稳妥扣紧在底板 `FPC1`（此单根排线同时承载 MIPI DSI 显示、背光与电容触摸）。
2. 通过 USB-C 线（或经串口分线器）连接电脑，方便烧录与查看串口日志。

## 第二步：下载并烧录固件

<FirmwareDownloadCard filename="08_lvgl-full.img" size="3.28 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第三步：触屏交互体验与串口核对

1. **验证显示与动画**：烧录重启约 1 秒后屏幕点亮，完整呈现 1024×768 LVGL 9.6 音乐播放器界面。
2. **逐项测试电容触摸**：
   - 点击底部 **播放 / 暂停** 按钮，观察专辑封面旋转与底部实时音频频谱柱状动效；
   - 点击 **上一首 / 下一首** 切换曲目，左右拖动进度条观察跟手响应；
   - 从界面底部向上滑动展开播放列表并上下滑动滚动（本演示专注 UI 图形交互，不输出实际声音）。
3. **核对串口初始化日志（可选）**：打开串口终端（115200 8N1），应看到显示（`1024x768 @ 60 Hz`）与触摸芯片（`gt967`）均初始化正常，并出现 `uart:~$` 交互提示符。

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 背光亮但黑屏或花屏 | 底板 `FPC1` 40 脚排线未插到底或歪斜 | 断电后重新对齐插紧 `FPC1` 排线并锁紧卡扣，确认烧录的是 `08_lvgl-full.img` |
| 有画面但手指触摸没反应 | `FPC1` 接触不良导致 I2C 触摸通信失败 | 断电重插 `FPC1` 排线；打开串口确认能否看到 `gt967` 初始化成功日志 |

---

[上一项：MP4 本地播放器](07-mp4-player.md) · [下一项：PocketJS 界面应用](09-pocketjs.md) · [应用总览](overview.md)
