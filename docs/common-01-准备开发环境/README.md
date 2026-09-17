---
sidebar_position: 1
title: 准备开发环境
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 准备开发环境

按正在学习的课程选择一项，完成对应步骤即可。

<Tabs defaultValue="phase1" queryString="phase" lazy>
<TabItem value="phase1" label="一期：使用完整工程包">

在现成工程中学习驱动、应用和设备树。**工具已随包提供，无需安装 Git、Python、uv，也无需创建或激活 `.venv`。**

## 1. 解压工程包

建议放在 `D:\work\HPM6E70\` 这样的短路径中，盘符可自行选择。各级目录建议使用英文、数字、连字符或下划线，避免中文、空格和临时目录。

保持包内目录结构，确认 `HPM6E70` 下有 `.west/`、`zephyr/`、`sdk_glue/`、`sdk_env/` 和 `tools/`。

## 2. 检查内置工具

在 **HPM6E70 工程根目录**打开 Windows PowerShell，执行：

```powershell
Test-Path .\.west\config
Test-Path .\tools\python-portable\python.exe
Test-Path .\tools\git-portable\cmd\git.exe
Test-Path .\sdk_env\tools\cmake\bin\cmake.exe
.\tools\python-portable\python.exe -m west --version
```

前四项均为 `True`，最后显示 west 1.5.0，即可继续。缺少文件时，请重新取得完整工程包。

**一期环境准备到这里结束。** 下一步：[认识 Zephyr 与工程模型](../common-02-认识Zephyr与工程模型/README.md)。编译检查在[构建和烧录应用](../p1-02-一键开发工作流/README.md)中进行。

</TabItem>
<TabItem value="phase2" label="二期：从零搭建工程">

从空目录准备 Git、Python 和 west，再下载源码、工具链并搭建整个工程。**以下步骤仅用于二期。**

## 1. 创建工程目录

在计划存放工程的**父目录**打开 Windows PowerShell。建议使用短路径，例如 `D:\work\`；各级目录建议使用英文、数字、连字符或下划线，避免中文、空格和临时目录。

创建并进入一个新的 `HPM6E70` 目录。若已有一期工程，请另选父目录：

```powershell
New-Item -ItemType Directory -Path .\HPM6E70 -Force
Set-Location .\HPM6E70
Get-Location
```

输出路径的最后一级应为 `HPM6E70`。后续命令都从这个目录开始执行。

## 2. 安装 Git

Git 用来下载源码仓库。下载 [Git 64 位安装程序（Git 2.55.0.5）](https://repo.huaweicloud.com/git-for-windows/v2.55.0.windows.5/Git-2.55.0.5-64-bit.exe)，双击运行。

安装向导中看到许可协议后点击 **Next**，后续选项保持默认，直到安装完成。

![Git 安装向导](./images/Git-安装向导.png)

安装完成后关闭已经打开的终端，重新打开一个普通 Windows PowerShell，进入工程目录。检查 Git：

```powershell
git --version
```

能看到版本号即可。

## 3. 安装 uv

uv 是一个独立的 Python 工具，用来下载指定版本的 Python，并在工程目录创建 `.venv`。本课使用清华 PyPI 镜像下载，不需要先安装系统 Python。

### 下载并解压

在工程根目录的 PowerShell 中执行，将 uv 下载到临时目录：

```powershell
$uvWheel = Join-Path $env:TEMP 'uv-0.9.9-py3-none-win_amd64.whl'
Invoke-WebRequest -Uri 'https://pypi.tuna.tsinghua.edu.cn/packages/f2/38/562295348cf2eb567fd5ea44512a645ea5bec2661a7e07b7f14fda54cb07/uv-0.9.9-py3-none-win_amd64.whl' -OutFile $uvWheel
```

下载完成后，创建独立的临时目录并解压：

```powershell
$uvExtract = Join-Path $env:TEMP ('uv-extract-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $uvExtract | Out-Null
tar -xf $uvWheel -C $uvExtract
```

### 安装到用户目录

在同一个窗口继续执行，将 `uv.exe` 放到当前用户的 `.local\bin` 中，无需管理员权限：

```powershell
$uvBin = Join-Path $env:USERPROFILE '.local\bin'
New-Item -ItemType Directory -Path $uvBin -Force | Out-Null
Copy-Item (Join-Path $uvExtract 'uv-0.9.9.data\scripts\uv.exe') (Join-Path $uvBin 'uv.exe') -Force
$env:Path = "$uvBin;$env:Path"
```

最后一行让当前窗口能够找到 uv。检查版本和实际位置：

```powershell
uv --version
Get-Command uv | Select-Object Source
```

应显示 uv 0.9.9，`Source` 指向当前用户目录下的 `.local\bin\uv.exe`。后续步骤继续使用这个 PowerShell 窗口。


## 4. 创建 Python 虚拟环境

uv 管理的 Python 运行时会放在 uv 的用户缓存目录中，不会覆盖电脑上已有的 Python。

**1. 下载 Python 3.12。**

```powershell
uv python install 3.12 --mirror https://registry.npmmirror.com/-/binary/python-build-standalone/ --no-registry
```

看到 `Installed Python 3.12.x` 后再继续。`--no-registry` 表示不把这个版本写入 Windows 的 Python 版本注册表。

**2. 查看 Python 存放目录。**

```powershell
uv python dir
```

这条命令显示 uv 管理 Python 的存放目录，仅用于确认位置。

**3. 创建工程虚拟环境。** 在当前工程根目录执行：

```powershell
uv venv --python 3.12 --seed .venv
```

这条命令在当前工程根目录创建 `.venv`。`--python 3.12` 指定解释器版本，`--seed` 会同时准备虚拟环境所需的 pip。

虚拟环境就在当前工程的 `.venv\` 目录中，只服务于这个工程。先允许本窗口执行激活脚本：

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
```

这个设置只对当前 PowerShell 窗口有效，关闭窗口后自动恢复。

```powershell
.\.venv\Scripts\Activate.ps1
```

看到提示符前出现 `(.venv)`，表示已经进入工程虚拟环境。

后续安装的 west 和 Python 包都会进入当前工程的 `.venv`；CMake 与 Ninja 不在 venv 中，而是统一使用 `sdk_env\tools` 里的版本。

## 5. 安装 west

确认命令提示符前有 `(.venv)`。下面的安装命令只把 west 放入当前工程的虚拟环境：

```powershell
python -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple west==1.5.0
```

安装完成后，检查工具版本：

```powershell
git --version
uv --version
west --version
```

三条命令均返回版本号，且提示符前有 `(.venv)`，即可进入[搭建 SDK Glue 工作区](../p2-01-搭建SDK-Glue工作区/README.md)。CMake、Ninja 和交叉编译工具链将在下一课下载到 `sdk_env/`，无需在此单独安装。

</TabItem>
</Tabs>
