---
title: NekoBox 综合媒体盒
description: 按步骤准备硬件与 TF 卡影音游戏素材、烧录 05_nekobox-full.img，逐项体验 NekoBox 触控桌面的视频、照片、复古游戏、Miracast 与设置功能。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# NekoBox 综合媒体盒

开机直接进入 1024×768 触控桌面，一次整合了 **本地视频、照片浏览、NES / GB / GBC / GBA 游戏、Miracast 无线投屏、USB 副屏、计算器与 Wi-Fi 校时** 等全部核心玩法。

<SourceRefBar sourcePath="zephyr-components/nekobox" to="/docs/yuzukineko/dev/zephyr/apps/nekobox" />

## 第一步：准备硬件连接

<YuzukiBoardStage defaultBoard="base" isHero={false} focusNodes={['dsi', 'wifi', 'amp', 'slot']} />

1. 确认 YuzukiNeko 已装在 YuzukiCube-M 底板上，接齐以下外设以便体验全部功能：
   - **显示与触摸**：40 脚排线扣紧在 `FPC1`；
   - **Wi-Fi 天线**：IPEX 天线扣紧在 `RF1`（用于 Wi-Fi 校时与 Miracast）；
   - **扬声器**：2 脚扬声器插在 `CN3`（用于视频和游戏伴音）。
2. 通过 USB-C 线（或经串口分线器）给开发板供电。

## 第二步：格式化并配置 TF 卡（推荐）

不插 TF 卡也可正常开机进入桌面并体验计算器、Miracast、USB 副屏和设置；若想同时体验视频、照片和游戏，按下面步骤准备 TF 卡（NekoBox 支持热插拔，每 3 秒自动扫描挂载）：

1. 将 TF 卡格式化为 **FAT32**（或 exFAT，支持中文/长文件名）。
2. 按自己习惯把测试素材放进根目录或分类文件夹（文件管理器支持浏览子目录）：

```text
TF 卡根目录/
├── video/
│   └── demo.mp4       # H.264 视频 + 44.1/48 kHz AAC 音频（建议每 1~2 秒一个关键帧，拖动更快）
├── photos/
│   ├── pic1.jpg       # 基线 4:2:0 JPEG 或 PNG 图片
│   └── pic2.png
└── roms/
    ├── game.nes       # 红白机 ROM（自备）
    ├── game.gb        # Game Boy / GBC ROM（自备）
    └── game.gba       # GBA ROM（最大 32 MiB，免 BIOS，自备）
```

3. 安全弹出读卡器，插入 YuzukiNeko 正面右侧卡槽（也可以直接把视频、图片、游戏 ROM 统统放在根目录，与其他体验共用同一张 TF 卡；首次改设置或看视频后，系统会自动在根目录生成 `.nekobox_settings` 和 `.nekobox_recent`）：

<figure style={{ maxWidth: '713px', margin: '0.75rem auto 1.25rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '10px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/nekobox-tf-root.webp').default}
    alt="TF 卡根目录实拍示例：包含 video540p.mp4、photo_gradient.png、game.nes、game.gba 以及自动生成的 .nekobox_settings 和 .nekobox_recent"
    width={713}
    height={416}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.45, textAlign: 'center' }}>
    TF 卡根目录示例：放入视频、图片和游戏 ROM 即可，.nekobox_settings 与 .nekobox_recent 由系统自动生成
  </figcaption>
</figure>

## 第三步：下载并烧录固件

<FirmwareDownloadCard filename="05_nekobox-full.img" size="4.87 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第四步：逐项触控体验桌面功能

烧录重启后进入 NekoBox 触控主屏（底部会实时显示 TF 卡剩余空间，如下方实拍图所示）：

<figure style={{ maxWidth: '700px', margin: '0.75rem auto 1.25rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '10px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/nekobox-home.webp').default}
    alt="NekoBox 触控主屏实拍：包含 Videos、Files、Photos、USB Display、DLNA、Miracast、NES、Game Boy、Calculator、Settings 十个功能磁贴与底部 SD 卡容量显示"
    width={1200}
    height={900}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.45, textAlign: 'center' }}>
    NekoBox 主屏实拍：10 个触控功能磁贴，底部自动识别并显示 TF 卡剩余容量
  </figcaption>
</figure>

可按以下顺序逐项点击磁贴测试：

1. **设置与 Wi-Fi 校时（`Settings`）**：调节背光亮度、切换深色/浅色主题和强调色，连接 2.4 GHz Wi-Fi 后开启网络校时。
2. **本地视频与文件（`Videos` / `Files`）**：选中 TF 卡里的 `.mp4`，验证 H.264 硬解画面与 `CN3` 扬声器伴音；测试拖动进度条、前后快进 10 秒和调节音量，退出再进可验证续播记忆。
3. **照片双指缩放（`Photos`）**：打开 `.jpg` / `.png` 图片，测试左右滑动切图、双指捏合缩放和单指拖拽平移。
4. **NES / GBA 复古游戏（`NES` / `Game Boy`）**：选择卡里的 `.nes` / `.gb` / `.gba` 开玩，屏幕叠加半透明触控手柄，进度每 3 秒自动存为同目录 `.sav`（运行游戏时系统会自动暂停 Wi-Fi 以释放全部 CPU 性能）。
5. **无线投屏（`DLNA` / `Miracast`）**：点击 `Miracast` 后在安卓手机无线显示列表中选择 **`NekoBox Miracast`** 即可投屏（离开页面后自动恢复普通 Wi-Fi）；点击 `DLNA` 可在同局域网视频 App 中推送投屏。
6. **USB 副屏与计算器（`USB Display` / `Calculator`）**：点开 `USB Display` 并接入已装虚拟屏驱动的 Windows 电脑可作为扩展副屏；点开 `Calculator` 可体验触屏四则计算器。

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 打开「文件」或「视频」看不到卡内文件 | TF 卡未插牢或格式不是 FAT32/exFAT | 重新插紧 TF 卡等待约 3 秒自动重新挂载，确认文件系统为 FAT32 或 exFAT |
| 拖动 MP4 进度条响应偏慢 | 视频源关键帧间隔太长 | 使用 `-g 30`（每 1～2 秒一个关键帧）重新转码的 MP4，拖动可秒切 |
| 打开 Miracast 后设置的 Wi-Fi 断开了 | Miracast 需独占 AIC8800 无线接口 | 属正常机制，退出 Miracast 页面后会自动重连原 Wi-Fi |

---

[上一项：USB 电脑扩展副屏](04-usb-display.md) · [下一项：Bilibili 在线视频](06-bilibili.md) · [应用总览](overview.md)
