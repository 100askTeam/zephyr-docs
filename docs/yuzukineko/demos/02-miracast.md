---
title: Miracast 无线显示
description: 按步骤接好屏幕与 Wi-Fi 天线、烧录 02_miracast-full.img，免路由器免 TF 卡直接用安卓手机无线显示完成 720p30 投屏测试。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# Miracast 无线显示

通过 Wi-Fi Direct 点对点接收安卓手机的 Miracast 无线显示画面（支持 1280×720p30，当前仅演示画面投屏，不含音频输出）。**无需 TF 卡、无需路由器、手机端无需装任何 App**。

<SourceRefBar sourcePath="zephyr-components/miracast/samples/receiver" to="/docs/yuzukineko/dev/zephyr/apps/miracast" />

## 第一步：准备硬件连接

<YuzukiBoardStage defaultBoard="base" isHero={false} focusNodes={['dsi', 'wifi', 'slot']} />

1. 确认 YuzukiNeko 已装在 YuzukiCube-M 底板上，并接好以下外设：
   - **显示与触摸排线**：40 脚排线接入底板 `FPC1`；
   - **Wi-Fi 天线**：IPEX 天线扣紧在底板 `RF1`（Wi-Fi Direct 依赖天线收发，必接）。
2. 用 USB-C 线（或经串口分线器）给 YuzukiNeko 供电并连接电脑。

## 第二步：下载并烧录固件

<FirmwareDownloadCard filename="02_miracast-full.img" size="4.51 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第三步：手机发起无线显示连接与实测

1. **确认板卡进入待机广播**：烧录重启约 3～5 秒后，开发板自动启动 AIC8800 Wi-Fi Direct，屏幕显示等待连接提示并对外广播设备名称 **`YuzukiNeko Miracast`**：

<figure style={{ maxWidth: '680px', margin: '0.75rem auto 1.25rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '10px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/miracast-waiting.webp').default}
    alt="开发板屏幕显示 YuzukiNeko Miracast 等待手机无线显示连接"
    width={1200}
    height={900}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.45, textAlign: 'center' }}>
    开机就绪：屏幕提示在安卓手机上打开无线显示并选择 YuzukiNeko Miracast
  </figcaption>
</figure>

2. **在安卓手机打开无线投屏**：
   - 打开支持 Miracast 的安卓手机（确保手机 Wi-Fi 开关处于开启状态，无需连路由器）；
   - 进入 **设置 → 连接与共享 → 投屏 / 无线显示 / 多屏互动**（各品牌入口名称略有差异），开启无线显示扫描；
   - 在弹出的设备列表中点击 **`YuzukiNeko Miracast`**：

<figure style={{ maxWidth: '340px', margin: '0.75rem auto 1.25rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '10px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/miracast-phone-select.webp').default}
    alt="安卓手机投屏设备选择列表中发现 YuzukiNeko Miracast"
    width={702}
    height={720}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.45, textAlign: 'center' }}>
    在安卓手机投屏列表中选中 YuzukiNeko Miracast
  </figcaption>
</figure>

3. **验证画面与断开重连**：
   - 等待数秒完成 P2P 协商与 RTSP 建链后，手机屏幕内容即实时同步到开发板彩屏；
   - 测试在手机端关闭投屏，开发板会自动退回待机广播状态，可再次点击重新连接：

<figure style={{ maxWidth: '720px', margin: '0.75rem auto 1.25rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '10px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/miracast-mirroring.webp').default}
    alt="安卓手机通过 Miracast 将横屏视频实时投射到 YuzukiNeko 彩屏"
    width={1400}
    height={1050}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.45, textAlign: 'center' }}>
    Miracast 实机投屏效果：手机横屏播放视频实时同步至开发板屏幕
  </figcaption>
</figure>

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 手机搜索不到 `YuzukiNeko Miracast` | 手机仅支持 Google Cast 不支持 Miracast，或底板 `RF1` 未接天线 | 确认已扣好 IPEX 天线，并换用支持标准 Miracast 无线显示的安卓手机测试 |
| 点击连接后长时间转圈超时 | 手机侧 P2P 缓存状态异常或无线信道干扰 | 关闭再重新打开手机无线显示开关，或断电重启开发板后重试 |

---

[上一项：安卓无线投屏](01-android-mirror.md) · [下一项：iOS 投屏 (AirPlay)](03-ios-mirror.md) · [应用总览](overview.md)
