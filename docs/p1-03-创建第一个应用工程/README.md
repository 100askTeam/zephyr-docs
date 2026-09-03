---
title: 第 3 课：创建第一个应用工程
---

# 第 3 课：创建第一个应用工程

前两课已经确认了工程目录和开发脚本。接下来要新增的不是一个孤立的 `main.c`，而是一个可以独立配置、独立构建的 Zephyr 应用。

这个应用最终会读取 HC-SR04 超声波测距模块，但现在驱动、Binding 和设备树节点都还不存在。本课只建立 `apps/hc_sr04_demo/`，先让它以 HPM6E70 基础模板的状态完成构建。后面的每次修改都在这个应用和对应驱动目录中继续。

## 从基础模板创建应用

可以通过 VS Code 任务或终端命令创建应用。两种方式最终都调用 `scripts/dev.ps1 new`，生成的目录和文件完全相同，只选择其中一种执行。

### 使用 VS Code 创建

保持 VS Code 打开在 HPM6E70 工程根目录，依次点击顶部菜单中的「终端」→「运行任务...」。

在任务列表中选择：

```text
新建工程（选择模板，支持任意应用作为模板）
```

VS Code 会打开集成终端，并列出 `apps/` 中可以作为起点的应用。脚本当前的默认模板是 `hpm6e70_demo`，因此在选择模板时直接按回车即可；也可以输入 `hpm6e70_demo` 前面的序号。

终端继续显示下面的提示时，输入新应用名称：

```text
新应用名称（例如 uart_echo）: hc_sr04_demo
```

创建完成后应看到类似下面的结果：

```text
已创建 apps/hc_sr04_demo（模板：hpm6e70_demo）。
```

脚本还会重新扫描 `apps/`，把 `hc_sr04_demo` 同步到 VS Code 后续构建任务的应用下拉列表。

### 使用终端创建

也可以在工程根目录打开 PowerShell，直接指定应用名称和模板：

```powershell
.\scripts\dev.ps1 new hc_sr04_demo -Template hpm6e70_demo
```

终端写法通过 `-Template hpm6e70_demo` 跳过模板选择，其余处理过程与 VS Code 任务相同。

这里有两个名称：

| 名称 | 作用 |
| --- | --- |
| `hpm6e70_demo` | 已经验证过 UART、SDRAM 和板载 LED 的基础模板 |
| `hc_sr04_demo` | 本次创建的新应用，也是后续构建命令使用的应用名 |

`new` 是本工程开发脚本提供的功能，不是 Zephyr 自带命令。脚本会复制模板目录，并把 `CMakeLists.txt` 中的 `project(hpm6e70_demo)` 改成 `project(hc_sr04_demo)`。Zephyr 的构建规则仍然来自应用自己的文件。

创建完成后，检查工程中是否出现下面的目录：

```text
apps/
└─ hc_sr04_demo/
   ├─ boards/
   │  └─ dshanmcu_hpm6e70.overlay
   ├─ src/
   │  └─ main.c
   ├─ CMakeLists.txt
   └─ prj.conf
```

## 四个文件分别由谁读取

文件放在同一个应用目录中，但它们进入构建的时间和用途不同。

| 文件 | 读取者 | 当前作用 |
| --- | --- | --- |
| `CMakeLists.txt` | CMake 和 Zephyr 构建系统 | 声明工程名，并把 `src/main.c` 加入应用目标 |
| `prj.conf` | Kconfig | 选择当前应用需要的 Zephyr 功能 |
| `boards/dshanmcu_hpm6e70.overlay` | Devicetree 构建工具 | 在公共开发板描述上增加本应用需要的硬件 |
| `src/main.c` | C 编译器 | 保存应用入口和运行逻辑 |

这也是应用、设备树和驱动需要分开的原因：`main.c` 表达程序要完成的任务，overlay 表达这块板怎样连接硬件，驱动负责按照硬件协议操作设备。现在只有应用目录，后两部分将在后续课程中加入。

## 检查 CMakeLists.txt

打开 `apps/hc_sr04_demo/CMakeLists.txt`，确认内容如下：

```cmake
# SPDX-License-Identifier: Apache-2.0

# 当前工程使用的 Zephyr 版本要求 CMake 不低于 3.20.0。
cmake_minimum_required(VERSION 3.20.0)

# 从当前应用向上两级可以找到工程根目录中的 boards/。
list(APPEND BOARD_ROOT ${CMAKE_CURRENT_LIST_DIR}/../..)

# 加载 Zephyr 构建系统；成功后会提供应用目标 app。
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})

# 工程名与 apps/ 下的应用目录名保持一致，便于区分构建产物。
project(hc_sr04_demo)

# 只有登记到 app 目标的源文件才会参与编译。
target_sources(app PRIVATE src/main.c)
```

`find_package(Zephyr ...)` 加载 Zephyr 构建系统，并创建应用目标 `app`。`target_sources()` 再把 `src/main.c` 加入该目标。仅把 `.c` 文件放入 `src/` 并不会自动编译；以后增加新的源文件，也需要在这里登记。

`BOARD_ROOT` 则让 Zephyr 能从工程根目录找到 `boards/hpmicro/dshanmcu_hpm6e70/`。如果漏掉这一行，构建会在选择开发板时失败，而不是在编译 `main.c` 时失败。

## 让工程发现新应用

创建目录后，还要重新扫描一次 `apps/`。这一步既会在终端列出应用，也会更新 VS Code 任务使用的应用下拉列表。可以在 VS Code 中运行任务，也可以直接执行终端命令，两种方式最终都会调用 `scripts/dev.ps1 list`。

### 使用 VS Code 同步应用列表

在 VS Code 顶部菜单中依次点击「终端」→「运行任务...」，然后选择：

```text
列出并同步应用（更新下拉选项）
```

VS Code 会打开集成终端并执行扫描。任务结束后，终端列出的应用中应出现：

```text
hc_sr04_demo
```

### 使用终端同步应用列表

在工程根目录打开 PowerShell，执行：

```powershell
.\scripts\dev.ps1 list
```

终端输出和 VS Code 任务相同，也应出现 `hc_sr04_demo`。应用能被列出，只能证明目录和 `CMakeLists.txt` 存在，还不能证明源码能够编译。

## 完成第一次构建

### 使用 VS Code 构建

再次打开「终端」→「运行任务...」，选择：

```text
构建应用（选择应用）
```

随后在应用下拉列表中选择 `hc_sr04_demo`。如果列表中没有它，先执行上一节的「列出并同步应用（更新下拉选项）」任务。

### 使用终端构建

也可以在工程根目录执行：

```powershell
.\scripts\dev.ps1 build hc_sr04_demo
```

VS Code 任务与终端命令都会调用 `scripts/dev.ps1 build hc_sr04_demo`，并使用同一个 `build/hc_sr04_demo/` 构建目录。

构建成功后检查：

```text
build/hc_sr04_demo/zephyr/zephyr.elf
build/hc_sr04_demo/zephyr/zephyr.hex
```

`zephyr.elf` 保存可执行代码、符号和调试信息，供 GDB 调试；`zephyr.hex` 保存烧录使用的数据。两个文件都位于 `build/hc_sr04_demo/`，说明新应用拥有独立的构建目录，不会和其他 Demo 的产物混在一起。

## 本课检查点

- `apps/hc_sr04_demo/` 已经创建；
- `project()` 中的名称已经变为 `hc_sr04_demo`；
- VS Code 的应用下拉列表和 `dev.ps1 list` 都能列出新应用；
- 能使用「构建应用（选择应用）」任务或终端命令构建该应用；
- `zephyr.elf` 和 `zephyr.hex` 已经生成；
- 工程中还没有增加 HC-SR04 设备树节点和驱动代码。

下一课先不修改 `main.c`。我们先看清一个 Zephyr 驱动由哪些部分组成、应用最终通过什么接口使用它，再按照依赖顺序逐项创建设备树节点、Binding、构建配置和驱动源文件。
