---
title: 获取工程与编译烧录
description: 下载并解压已配置好的 f101-zephyr（Zephyr 4.5.0）完整工程源码包，完成工具链自检、源码编译、整片镜像打包与烧录验证。
---

# 获取工程与编译烧录

前面通过预编译固件确认了开发板和烧录通道。接下来下载已经搭建好的 **f101-zephyr（Zephyr 4.5.0）完整工程源码包**，在本地亲手编译 `hello_f101` 源码、打包整片镜像并烧录到开发板，跑通完整的源码开发闭环。

**工程包已随包内置全部构建工具与交叉工具链**（Python 3.12、west 1.5.0、CMake 4.5.1、Ninja 1.13.2、DTC 1.7.0、gperf 3.1、玄铁 GCC 14.1.1、Bun 1.4.5、Rust nightly），**无需手动搭建工程或安装工具链，也不用激活虚拟环境或配置全局环境变量，整个目录可直接搬移**。

## 第一步：下载并解压工程源码包

1. 下载打包好的完整工程源码压缩包 **`f101-zephyr.tar.gz`**（约 `1.86 GiB`，面向 WSL2 / Ubuntu x86_64）：
   - **百度网盘下载**：[点击前往下载 `f101-zephyr.tar.gz`](https://pan.baidu.com/s/14TJlJcCZKn_clEtp6PNjeQ?pwd=atvr)（提取码：`atvr`）
   - **SHA-256 校验值**（可选）：`40315d3737c72ba76dc44c09a052d262ff90312e4633c99f1c944dbd72f25c4e`
2. 在 **WSL2 / Ubuntu 终端**中，用 `tar` 命令将压缩包解压到 Linux 原生文件系统目录（推荐 `~/work`，解压后即得到 `~/work/f101-zephyr`）：

```sh
mkdir -p ~/work
# 将下方路径替换为你实际下载保存 f101-zephyr.tar.gz 的位置（如 Windows D 盘 Downloads 目录）
tar -xzf /mnt/d/Downloads/f101-zephyr.tar.gz -C ~/work
```

:::tip[解压注意事项]
- 请务必在 **WSL2 / Ubuntu 终端中使用 `tar -xzf` 解压**，不要用 Windows 下的 7-Zip / WinRAR 解压后再拷贝，以免丢失 `.venv/` 与 `tools/` 内的符号链接和可执行权限。
- 请解压到 WSL2 Linux 原生目录（如 `~/work/f101-zephyr`），避免放在 `/mnt/c` 或 `/mnt/d` 等 Windows 挂载盘下，以免拖慢编译速度。
:::

解压完成后，进入工程根目录可以看到以下主要文件夹：

| 目录 | 说明 |
| --- | --- |
| `.venv/` | 随包命令行启动器（`.venv/bin/python`、`.venv/bin/west`），自动关联内置 `tools/` 环境 |
| `.west/` | west 工作区配置（manifest 位于 `zephyr/west.yml`） |
| `applications/` | 自定义应用目录，内置最简入门工程 `hello_f101` |
| `platform/` | 平台扩展模块 `f101_platform`，包含适配 YuzukiCube-M 底板的默认板级 `yuzukineko_base` |
| `zephyr/` | Zephyr 4.5.0 内核、F101 SoC 与片上外设驱动源码 |
| `zephyr-components/` | 扩展组件与 17 个综合演示应用源码 |
| `modules/` | west 管理的固定依赖（LVGL 9.6、Mbed TLS 4.1.1、CherryUSB、FATFS、OpenCORE 等） |
| `scripts/` | 常用脚本：`build_apps.py`、`pack_full_img.py`、`flash.py`、`create_app.py` |
| `tools/` | 随包内置工具链、Python、CMake、Ninja、DTC、Bun、Rust 与启动加载器 |
| `build/` | 各应用独立的构建输出目录（首次编译后生成） |

## 第二步：校验内置工具链

在 WSL / Ubuntu 终端（或 VS Code 连接 WSL 后的集成终端）进入工程根目录，执行以下命令确认内置工具就绪：

```sh
cd ~/work/f101-zephyr
./.venv/bin/west --version
./.venv/bin/python --version
```

分别输出 `West version: v1.5.0` 和 `Python 3.12.x` 即表示环境就绪。后续所有命令统一通过 `./.venv/bin/west` 和 `./.venv/bin/python` 执行，它们会自动注入工作区环境变量，避免与系统里已安装的其他版本工具冲突。

## 第三步：编译 `hello_f101` 示例

在工程根目录执行：

```sh
./.venv/bin/west build -b yuzukineko_base -d build/hello_f101 applications/hello_f101
```

| 参数 | 作用 |
| --- | --- |
| `-b yuzukineko_base` | 指定搭配 YuzukiCube-M 底板的默认板级（仅使用 YuzukiNeko 单板时可改用 `-b yuzukineko`） |
| `-d build/hello_f101` | 指定独立构建目录，防止多个应用共用缓存相互覆盖 |
| `applications/hello_f101` | 要编译的应用源码路径 |

编译成功后，产物位于：

- `build/hello_f101/zephyr/zephyr.bin`（原始应用镜像）
- `build/hello_f101/zephyr/zephyr.elf`（含符号表的 ELF 文件）

如果后续修改了 `prj.conf` 或 `.overlay` 设备树文件，在 `west build` 命令后加上 `-p always` 重新生成配置。

## 第四步：打包整片镜像并烧录验证

先将刚编译的应用与启动引导打包成可直接写入 SPI NOR 的整片镜像：

```sh
./.venv/bin/python scripts/pack_full_img.py --app hello_f101
```

执行完成后会在 `build/hello_f101/zephyr/` 下生成 `zephyr-full.img`。

接着打开 Windows 下的 **LYNX Imager**，按 [烧录第一个体验固件](02-flash-first-firmware.md) 的四步向导烧录即可：在第 2 步「选择系统镜像」中，导入刚生成的整片镜像（WSL2 下可直接在文件选择框地址栏输入 `\\wsl.localhost\Ubuntu\home\<你的用户名>\work\f101-zephyr\build\hello_f101\zephyr\zephyr-full.img`，也可先复制到 Windows 目录再选择），随后让开发板按住 FEL 键重新上电并点击确认烧录。

<details>
<summary>补充：WSL2 USB 透传（usbipd-win）与 Linux 命令行一键烧录 / RAM 调试</summary>

如果想在 WSL2 或 Linux 终端里编译完直接命令行烧录（或把程序直接载入 RAM 快速调试），可将 FEL USB 设备透传进 WSL2 后调用工作区自带的 `scripts/flash.py`。

**1. 在 Windows 中将 FEL 设备透传到 WSL2（使用 Linux 宿主机可跳过此步）**

先以管理员身份打开 Windows PowerShell，安装 `usbipd-win`（装过可跳过，也可从 [usbipd-win 发布页](https://github.com/dorssel/usbipd-win/releases) 下载 `.msi` 安装，装完需重开 PowerShell）：

```powershell
winget install --interactive --exact dorssel.usbipd-win
```

让开发板按住 FEL 键重新上电进入 FEL 模式后，在管理员 PowerShell 中绑定并透传全志 FEL 设备（VID:PID 固定为 `1f3a:efe8`）：

```powershell
# 查看设备列表，确认 1f3a:efe8 已出现
usbipd list

# 首次共享绑定（只需执行一次）
usbipd bind --hardware-id 1f3a:efe8

# 透传到 WSL2；加 --auto-attach 后，后续每次重进 FEL 会自动重连（按 Ctrl+C 停止）
usbipd attach --wsl --auto-attach --hardware-id 1f3a:efe8
```

**2. 在 WSL2 / Linux 中校验设备并执行烧录或 RAM 调试**

在 WSL2 终端确认设备已挂载：

```sh
lsusb | grep 1f3a:efe8
```

看到 `1f3a:efe8` 后，即可直接写入 Flash 或载入 RAM 运行：

```sh
# 一键写入 SPI NOR 并回读校验重启
sudo ./.venv/bin/python scripts/flash.py flash-full hello_f101

# 调试阶段不擦写 Flash，直接载入 RAM 运行
sudo ./.venv/bin/python scripts/flash.py run hello_f101
```

如果不想每次输入 `sudo`，可一次性写入 udev 规则放开 FEL 设备权限（配置后重新插拔生效）：

```sh
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="1f3a", ATTR{idProduct}=="efe8", MODE="0666"' | sudo tee /etc/udev/rules.d/70-allwinner-fel.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
```

需要换回 Windows 下的 **LYNX Imager** 烧录时，在运行 `usbipd attach` 的 PowerShell 窗口按 `Ctrl + C`（或执行 `usbipd detach --hardware-id 1f3a:efe8`）即可把设备归还给 Windows。

</details>

## 第五步：修改一行代码验证开发闭环

打开 `applications/hello_f101/src/main.c`，将打印间隔从 1 秒改为 500 毫秒：

```c
k_sleep(K_MSEC(500));
```

重新执行编译、打包并烧录后，打开串口终端（115200 8N1），可以看到 `uptime` 变为每 500 ms 刷新一次：

```text
hello_f101 started on yuzukineko_base/sun252i_f101
uptime: 0 ms
uptime: 500 ms
uptime: 1000 ms
```

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 编译特别慢或出现权限警告 | 工程解压在了 Windows 挂载盘 `/mnt/c` 或 `/mnt/d` | 将工程移动到 WSL2 Linux 原生文件系统（如 `~/work/f101-zephyr`） |
| 报错找不到 `yuzukineko_base` 板级 | 未使用工程内的 `./.venv/bin/west`，未加载 `platform/` 模块 | 改用 `./.venv/bin/west build ...` 入口，并确认 `platform/zephyr/module.yml` 存在 |
| 烧录完成后重启无输出 | 误选了裸 `zephyr.bin` 而非打包后的 `zephyr-full.img` | 先执行 `pack_full_img.py`，在 LYNX Imager 中导入 `zephyr-full.img` 并勾选主线 SPI NOR 模式 |
| 修改 `prj.conf` 后配置未生效 | 增量编译沿用了旧的 `.config` 缓存 | 在 `west build` 命令中增加 `-p always` 强制重新配置 |

## 进入正式学习

到这里，串口接线、预编译固件体验与本地源码编译烧录三步准备已全部打通，可以按需进入对应阶段：

- **[一期 · 应用总览与预编译固件](../demos/overview.md)**：一键编译或直接烧录体验全部 17 个真机验证应用；
- **[二期 · 认识工程与新建应用](../dev/zephyr/guide/01-workspace-and-first-app.md)**：掌握工作区结构、`create_app.py` 脚手架、设备树与板载外设驱动调用。

---

[上一步：烧录第一个体验固件](02-flash-first-firmware.md) · [进入一期：17 个应用 Demo](../demos/overview.md) · [进入二期：工程与外设开发](../dev/zephyr/guide/01-workspace-and-first-app.md)
