---
title: PocketJS 界面应用
description: 按步骤连接屏幕与串口、烧录 09_pocketjs-full.img，实测 QuickJS-ng + Rust G2D/RVV 界面渲染及触摸、串口键盘双通道输入。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# PocketJS 界面应用

演示使用 **QuickJS-ng 脚本引擎 + Rust UI 渲染核心（结合 G2D 与 RVV 加速）** 在 F101 上运行打包后的 TypeScript / TSX 应用。**无需 TF 卡、无需联网**。

<SourceRefBar sourcePath="zephyr-components/pocketjs/samples/player" to="/docs/yuzukineko/dev/zephyr/apps/pocketjs" />

## 第一步：准备硬件连接

<YuzukiBoardStage defaultBoard="base" isHero={false} focusNodes={['dsi', 'slot', 'uart']} />

1. 确认 YuzukiNeko 已装在 YuzukiCube-M 底板上，扣紧 `FPC1` 40 脚屏排线。
2. 通过 USB-C 串口分线器连接电脑，并打开串口终端软件（115200 8N1），以便观察渲染统计和测试串口按键输入。

## 第二步：下载并烧录固件

<FirmwareDownloadCard filename="09_pocketjs-full.img" size="3.52 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第三步：观察动效渲染并测试双通道翻页交互

1. **确认屏幕渲染画面**：烧录重启后，1024×768 屏幕中央按 2× 整数倍缩放（960×544）流畅播放内置的 **Motion Lab（`motions`）** 动效演示——共 4 页、每页 6 宫格动效卡片（`MOTIONS/53`、`MOTIONS/56`、`MOTIONS/30`、`MOTIONS/64 · 3D`）。
2. **核对串口启动统计**：在串口终端（115200 8N1）中可以看到加载的逻辑画布尺寸（480×272）、host profile 与约每 5 秒刷新一次的实时 tick / picture 统计及 G2D/RVV 耗时。
3. **测试触摸翻页**：在屏幕中央画布区域**向左或向右滑动**，即可在 4 页动效之间循环切换；串口会同步打印触摸槽位与手势按键事件日志。
4. **测试串口键盘控制**：在串口终端窗口直接按下键盘按键，验证串口遥控手柄映射（按 `A` / `D` 或 `Q` / `E` 即可前后切换 4 页动效）：

| 串口按键 | 对应动作 |
| --- | --- |
| `A` / `D` | 左 / 右方向键（切换上一页 / 下一页动效） |
| `Q` / `E` | 左 / 右肩键（同样可切换上一页 / 下一页动效） |
| `W` / `S` | 上 / 下方向键 |
| `J` 或空格 / `K` | Cross（确认）/ Circle（返回） |
| `U` / `I` | Square / Triangle |
| `Enter` / `Tab` 或 `b` | Start / Select |

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 屏幕边缘滑动没有触发翻页 | 480×272 画布居中按 2× 缩放（960×544），四周黑边区域不接收触摸事件 | 在屏幕中央画布区域内做水平滑动，或直接在串口终端按 `A`/`D`、`Q`/`E` 翻页 |
| 在串口助手里按 `A`/`D` 或 `Q`/`E` 没反应 | 串口助手处于「整行发送」模式而非交互终端 | 改用 MobaXterm / PuTTY 等支持逐字符即时发送的串口终端（115200 8N1） |

---

[上一项：LVGL 图形界面](08-lvgl.md) · [下一项：LiteHTML 网页渲染](10-litehtml.md) · [应用总览](overview.md)
