---
title: 应用总览与预编译固件
description: 汇总 YuzukiNeko 全部 17 个预编译应用体验固件，提供一键打包下载、单项直链下载以及一期体验与二期源码入口。
---

# 应用总览与预编译固件

本阶段汇总了 YuzukiNeko 全部 **17 个应用体验固件**，点击下表即可直接下载对应镜像并用 **LYNX Imager** 烧录体验（首次烧录步骤见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)）。

也可以一次性下载全套固件压缩包 [`00_yuzukineko_firmware_all.zip`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/00_yuzukineko_firmware_all.zip)，或前往 [固件下载目录](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/) 统一浏览。

## 17 个应用体验固件

| 应用体验 | 分类 | 直接下载固件 | 源码详解（二期） |
| --- | --- | --- | --- |
| [安卓无线投屏](01-android-mirror.md) | 无线投屏 | [`01_android_mirror-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/01_android_mirror-full.img) | [查看源码](../dev/zephyr/apps/android-mirror.md) |
| [Miracast 无线显示](02-miracast.md) | 无线投屏 | [`02_miracast-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/02_miracast-full.img) | [查看源码](../dev/zephyr/apps/miracast.md) |
| [iOS 投屏 (AirPlay)](03-ios-mirror.md) | 无线投屏 | [`03_ios_mirror-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/03_ios_mirror-full.img) | [查看源码](../dev/zephyr/apps/ios-mirror.md) |
| [USB 电脑扩展副屏](04-usb-display.md) | 扩展副屏 | [`04_usb_display-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/04_usb_display-full.img) | [查看源码](../dev/zephyr/apps/usb-display.md) |
| [NekoBox 综合媒体盒](05-nekobox.md) | 音视频媒体 | [`05_nekobox-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/05_nekobox-full.img) | [查看源码](../dev/zephyr/apps/nekobox.md) |
| [Bilibili 在线视频](06-bilibili.md) | 音视频媒体 | [`06_bilibili-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/06_bilibili-full.img) | [查看源码](../dev/zephyr/apps/bilibili.md) |
| [MP4 本地播放器](07-mp4-player.md) | 音视频媒体 | [`07_mp4_player-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/07_mp4_player-full.img) | [查看源码](../dev/zephyr/apps/mp4-player.md) |
| [LVGL 图形界面](08-lvgl.md) | UI 与脚本 | [`08_lvgl-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/08_lvgl-full.img) | [查看源码](../dev/zephyr/apps/lvgl.md) |
| [PocketJS 界面应用](09-pocketjs.md) | UI 与脚本 | [`09_pocketjs-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/09_pocketjs-full.img) | [查看源码](../dev/zephyr/apps/pocketjs.md) |
| [LiteHTML 网页渲染](10-litehtml.md) | UI 与脚本 | [`10_litehtml-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/10_litehtml-full.img) | [查看源码](../dev/zephyr/apps/html.md) |
| [MicroPython 脚本](11-micropython.md) | UI 与脚本 | [`11_micropython-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/11_micropython-full.img) | [查看源码](../dev/zephyr/apps/micropython.md) |
| [Doom 毁灭战士](12-doom.md) | 复古模拟 | [`12_doom-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/12_doom-full.img) | [查看源码](../dev/zephyr/apps/doom.md) |
| [NES 红白机模拟](13-nes.md) | 复古模拟 | [`13_nes-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/13_nes-full.img) | [查看源码](../dev/zephyr/apps/nes.md) |
| [mGBA 掌机模拟](14-mgba.md) | 复古模拟 | [`14_mgba-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/14_mgba-full.img) | [查看源码](../dev/zephyr/apps/mgba.md) |
| [gpSP 动态重编译](15-gpsp.md) | 复古模拟 | [`15_gpsp-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/15_gpsp-full.img) | [查看源码](../dev/zephyr/apps/gpsp.md) |
| [Win95 · Bochs x86](16-win95.md) | 复古模拟 | [`16_win95_bochs-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/16_win95_bochs-full.img) | [查看源码](../dev/zephyr/apps/win95.md) |
| [ncnn 神经网络推理](17-ncnn.md) | 端侧 AI | [`17_ncnn-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/17_ncnn-full.img) | [查看源码](../dev/zephyr/apps/ncnn.md) |

---

[上一步：获取工程与编译烧录](../start/03-get-sdk-and-build.md) · [开始第 1 项体验：安卓无线投屏](01-android-mirror.md) · [进入二期：工程与外设开发](../dev/zephyr/guide/01-workspace-and-first-app.md)
