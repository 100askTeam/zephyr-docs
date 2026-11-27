---
title: 烧录第一个体验固件
description: 安装 LYNX Imager 并在软件内一键安装全志 FEL 驱动，按四步向导将预编译整片镜像 zephyr-full.img 写入 SPI NOR，验证启动与串口输出。
---

import FelModeGuide from '@site/src/components/FelModeGuide';

# 烧录第一个体验固件

这一步无需搭建编译环境：安装图形化烧录工具 **LYNX Imager**（软件内自带全志 FEL 驱动一键安装），按四步向导将预编译整片镜像写入 SPI NOR，即可验证开发板启动与串口输出。

## 第一步：下载烧录工具与体验固件

1. **下载并安装 LYNX Imager**：前往 [LYNX Imager 发布页](https://github.com/dshanpi/lynx-imager/releases) 下载最新 Windows 安装程序（文件名类似 `LYNX-Imager_x.x.x_windows-x64-setup.exe`），双击按默认选项完成安装并启动。
2. **下载体验固件**：下载轻量串口心跳固件 [`00_hello_f101-full.img`](https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/00_hello_f101-full.img)，单板即可运行，用于验证烧录与串口日志畅通。

## 第二步：用 LYNX Imager 装驱动并完成烧录

打开 **LYNX Imager**，按向导顺序完成以下四步：

### 1. 选择烧录目标（F101 / SPI NOR）

按图中 ① → ② → ③ 操作：在 **全志 Allwinner** 下点击左侧 **F 系列 → F101**，目标存储选 **SPI NOR**，点击右下角 **下一步：选择系统 →**。

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step1-target.webp').default}
    alt="LYNX Imager 第 1 步：选择全志 F 系列 F101 与 SPI NOR 目标存储"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    第 1 步：选择 F 系列（F101）→ 选中 SPI NOR → 点击「下一步：选择系统」
  </figcaption>
</figure>

### 2. 选择系统镜像

按图中 ① → ② → ③ → ④ 操作：勾选 **主线 · SPI NOR**（从物理起点 `0x000000` 写入），在 **完整 SPI NOR 系统镜像** 栏导入刚才下载的 `00_hello_f101-full.img`（图中以 `zephyr-full.img` 为例），确认 **RAM FES 引导来源** 为板型配套包 `f101s3-neko-loader-v1.img`，点击右下角 **下一步：设备连接 →**。

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step2-image.webp').default}
    alt="LYNX Imager 第 2 步：勾选主线 SPI NOR，导入完整系统镜像并确认 RAM FES 引导来源"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    第 2 步：勾选「主线 · SPI NOR」→ 导入整片镜像 → 确认引导包 → 点击「下一步：设备连接」
  </figcaption>
</figure>

### 3. 安装 FEL 驱动并连接设备

**首次使用先一键安装全志 FEL 驱动**（装过一次后以后烧录可直接跳过）：点击红框处的 **安装驱动**，按系统提示允许管理员权限等待安装完成即可。

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step3-driver.webp').default}
    alt="LYNX Imager 第 3 步设备连接页：点击右上角安装驱动按钮"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    首次使用：点击红框处的 <strong>安装驱动</strong> 一键安装全志 FEL 驱动
  </figcaption>
</figure>

接着按下面四步让开发板进入 FEL 烧录模式：

<FelModeGuide />

进入 FEL 模式后，回到 **LYNX Imager** 按图中 ① → ② → ③ 操作：点击 **重新检测** → 选中 **Allwinner 全志 USB 设备**（`FEL / FES`、`1f3a:efe8`）→ 点击右下角 **下一步：确认烧写 →**。

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step3-connected.webp').default}
    alt="LYNX Imager 第 3 步：点击重新检测并选中 Allwinner 全志 USB 设备后进入下一步确认烧写"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    第 3 步：点击「重新检测」→ 选中 Allwinner 全志 USB 设备（1f3a:efe8）→ 点击「下一步：确认烧写」
  </figcaption>
</figure>

### 4. 确认烧录并等待回读校验完成

1. 在右侧 **确认烧录** 面板核对目标为 `F101 · fel/fes` 与 `SPI NOR`，按图中 ① 勾选 **我已核对设备，并备份重要数据**，再点击 ② **确认烧录**：

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step4-confirm.webp').default}
    alt="LYNX Imager 第 4 步：勾选核对确认并点击确认烧录"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    第 4 步：勾选核对确认项后点击「确认烧录」开始写入 SPI NOR
  </figcaption>
</figure>

2. 工具将自动依次完成 **准备 → 擦除 → 写入 → 独立物理回读校验 → 发送重启指令**，烧录过程中请保持 USB 连接稳定、不要断电：

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step4-progress.webp').default}
    alt="LYNX Imager 正在将系统镜像写入 SPI NOR 的进度界面"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    正在写入 SPI NOR：实时显示进度条、传输速度与执行日志
  </figcaption>
</figure>

3. 看到页面提示 **烧写完成**（镜像写入已完成、物理回读 SHA-256 已通过、重启指令已执行），开发板会自动重启运行新固件（如未自动启动，重新插拔一次 USB-C 线即可）：

<figure style={{ margin: '1rem 0 1.4rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
  <img
    src={require('./images/lynx-imager-step4-done.webp').default}
    alt="LYNX Imager 烧写完成界面：镜像写入已完成、物理回读已通过、重启指令已执行"
    width={1282}
    height={816}
    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
  />
  <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
    烧写完成：物理回读 SHA-256 校验通过后自动发送重启指令启动新固件
  </figcaption>
</figure>

## 第三步：打开串口观察运行现象

打开任意串口终端（如 MobaXterm、PuTTY、串口助手或选购的 [DshanPI USBToolBox](https://dl.100ask.net/Tools/usbtoolsbox/) 串口工具），选择对应的 COM 口，参数设为 `115200 8N1`（无校验、无流控），串口会每秒持续输出运行时间计数：

```text
*** Booting Zephyr OS build v4.5.0 ***
hello_f101 started on yuzukineko_base/sun252i_f101
uptime: 0 ms
uptime: 1000 ms
uptime: 2000 ms
```

看到串口日志持续刷新，说明 YuzukiNeko、烧录链路与串口通道已全部验证通过。

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 点击重新检测看不到设备 | 未装驱动、未按住 FEL 键上电或使用了纯充电线 | 先点击同页 **安装驱动** 并允许管理员权限；拔下 USB-C 线，按住正面 FEL 键重插后点 **重新检测** |
| 烧过固件后不按键进不了 FEL | Flash 中已有可启动固件 | 正常现象，后续每次烧录都需按住 FEL 键重新上电进入 FEL |
| 烧写完成后重启无输出 | 误选了裸 `zephyr.bin`（非 `*-full.img` 整片镜像）或未选主线模式 | 确认导入的是 `00_hello_f101-full.img`，并勾选 **主线 · SPI NOR** 重新写入 |
| 串口空白或找不到 COM 口 | 分线器插反 180°、RX/TX 接反或未装串口模块驱动 | 安装所用串口模块驱动；回查 [连接开发板与串口](01-hardware-and-uart.md) 确认分线器朝向与 RX ↔ TXD 交叉接线 |
| 串口输出乱码 | 波特率不是 `115200` 或 GND 虚接 | 将串口参数设为 `115200 8N1`（无校验、无流控），检查 GND 是否接牢 |

## 下一步选择

- **快速体验全部 17 个应用**：免搭编译环境，直接进入 [应用总览与预编译固件](../demos/overview.md)，用 LYNX Imager 烧录体验无线投屏、Bilibili、NekoBox、复古模拟器与端侧 AI。
- **进入源码编译与二次开发**：继续下一步 [获取工程与编译烧录](03-get-sdk-and-build.md)，获取自包含工程并跑通本地编译与打包。

---

[上一步：连接开发板与串口](01-hardware-and-uart.md) · [下一步：获取工程与编译烧录](03-get-sdk-and-build.md) · [直接体验 17 个 Demo](../demos/overview.md)
