---
title: "Flash 布局与进阶调试"
---

日常整片烧录推荐直接使用 Windows 下的 **LYNX Imager**（见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)）。本页整理板载 16 MiB SPI NOR 的分区布局，以及开发调试阶段通过配套工程 `scripts/flash.py` 进行 **RAM 快速载入调试、整片备份与救砖** 的参考说明。

## 16 MiB SPI NOR 布局

板载 SPI NOR Flash 共 **16 MiB**（`0x000000`–`0xFFFFFF`）。配套工程的 `scripts/pack_full_img.py` 会自动读取 `zephyr.elf` 入口地址，按应用类型生成对应的整片镜像 `zephyr-full.img`：

### RAM 模式应用（入口 `0x40000000`，共 15 个应用及 `hello_f101`）

| 偏移范围 | 内容 | 说明 |
| --- | --- | --- |
| `0x000000` / `0x010000` / `0x020000` | SyterKit 引导（`flash-boot_spi_s3.bin` 三份） | 上电初始化 16 MiB PSRAM 与 SPIF |
| `0x02f000` | Flash 采样点参数区 | 引导器自动维护，手工写片时不要覆盖 |
| `0x200000` 起 | 应用原始镜像（含 4 KiB 头页） | 上电后由引导器搬运至 PSRAM `0x40000000` 运行 |

### XIP 模式应用（入口 `0x0e000000`，如 `nekobox`、`bilibili`）

| 偏移范围 | 内容 | 说明 |
| --- | --- | --- |
| `0x000000`–`0x01FFFF` | SyterKit XIP 引导（`xip-boot_spi_s3.bin`） | 初始化 312 MHz PSRAM 并把 Flash `0x80000` 映射到 `0x0e000000` |
| `0x020000`–`0x02FFFF` | Flash 采样点参数区 | 首次启动完成训练后保存，后续启动加速约 0.55 s |
| `0x080000` 起 | XIP 应用镜像（`zephyr.bin`） | 代码与只读数据在 Flash 原地执行，RAM 仅放 `.data`/`.bss`/堆 |

:::caution
RAM 模式与 XIP 模式的 Flash 布局互不兼容。使用 `scripts/pack_full_img.py` + LYNX Imager 或 `scripts/flash.py flash-full` 整片烧录时会自动写齐对应引导，无需手工拼接。
:::

## 命令行快速调试（`scripts/flash.py`）

如果已在 WSL2（配合 `usbipd-win`，详见 [获取工程与编译烧录](../start/03-get-sdk-and-build.md#第四步打包整片镜像并烧录验证)）或原生 Linux 环境下连接了处于 **FEL 模式** 的开发板，可直接使用工作区内置的 `scripts/flash.py`（已内置 `tools/host/bin/xfel` 与全部引导器，无需单独安装）：

| 命令 | 作用 |
| --- | --- |
| `./.venv/bin/python scripts/flash.py version` | 确认 FEL 设备连接（正常应输出 `AWUSBFEX ID=0x00193700(F101)`） |
| `./.venv/bin/python scripts/flash.py run <应用名>` | **快速调试**：RAM 应用直接初始化 PSRAM 并载入 `0x40000000` 运行（不写 Flash，断电即失）；XIP 应用写入 `0x80000`、校验 SHA-256 后直接通过 RAM 引导启动 |
| `./.venv/bin/python scripts/flash.py flash-full <应用名>` | 将 `build/<应用名>/zephyr/zephyr-full.img` 写入 `0x000000`、回读校验 SHA-256 并复位 |
| `./.venv/bin/python scripts/flash.py backup -o build/neko-backup.bin` | 备份整片 16 MiB SPI NOR 并打印 SHA-256 |
| `./.venv/bin/python scripts/flash.py clear-boot` | 擦除 `0x000000`–`0x010000` 启动头，使开发板下次上电**自动进入 FEL**（适合高频 RAM 调试，省去每次按 FEL 键） |

### 开发调试小技巧

- **进入 FEL**：Flash 内已有有效引导时，上电会直接运行固件而不会停在 FEL，必须按「拔线断电 → 按住 FEL → 插回通电 → 1 秒后松手」进入（图文步骤见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)）。
- **高频改代码调试**：先执行一次 `scripts/flash.py clear-boot` 清除启动头，之后每次断电重插都会自动进入 FEL，改完代码直接 `build` + `scripts/flash.py run <应用名>`，几秒就能在串口 `UART1`（`PB0/PB1`，`115200 8N1`）看到输出；调试完成后再刷一次 `zephyr-full.img` 恢复脱机自启。
- **关于 `exec` 后的 USB 报错**：`scripts/flash.py run` 或 `xfel exec` 跳转后 CPU 离开 BROM，USB 链路会立即断开，终端偶尔出现 `usb bulk send/recv error` 属正常现象，以串口输出为准。

## 整片 Flash 备份与恢复

在尝试自定义分区或刷写第三方固件前，建议先备份当前整片 16 MiB Flash：

```sh
# 备份整片 16 MiB SPI NOR（自动打印 SHA-256）
./.venv/bin/python scripts/flash.py backup -o build/neko-backup.bin

# 恢复备份并复位
./tools/host/bin/xfel spinor write 0x0 build/neko-backup.bin
./tools/host/bin/xfel reset
```

写入前后建议用 `sha256sum`（Linux/WSL）或 `Get-FileHash -Algorithm SHA256`（Windows PowerShell）核对文件摘要，确保镜像完整无损。

## 常见连接问题排查

| 提示 / 现象 | 原因与处理 |
| --- | --- |
| 找不到 FEL 设备（`1f3a:efe8`） | 确认已按住 FEL 键重新上电、使用带数据线的 USB-C 线；WSL2 需先用 `usbipd attach --wsl` 透传；Windows 使用 `xfel` 需确认已装 WinUSB 驱动（LYNX Imager 安装驱动时会自动配置） |
| Linux / WSL2 报 USB 权限不足 | 按 [获取工程与编译烧录](../start/03-get-sdk-and-build.md#第四步打包整片镜像并烧录验证) 配置 `/etc/udev/rules.d/70-allwinner-fel.rules` 后重新插拔 |
| 刷写后无法开机 / 救砖 | 按住 FEL 键重新上电即可回到 BROM（硬件级不可写坏），再用 LYNX Imager 重新刷入任一整片 `-full.img` 固件即可恢复 |
| 串口没有任何输出 | 确认串口接在底板 `CN2` 的 `UART1`（`PB0` TX / `PB1` RX）、交叉接线（TX↔RX）与共地，波特率 `115200 8N1` |

:::info 更多上游底层工具
如需了解手动编译 `xfel` / `rfel` 或从零配置 UF2 拖放下载器，可查阅 [YuzukiNeko 原版文档](https://yuzukihd.github.io/YuzukiNeko/zh)。
:::
