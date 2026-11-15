---
title: 第 3 课：创建第一个应用工程
---

# 第 3 课：创建第一个应用工程

前两课已经确认了工程目录，并跑通了构建和烧录。接下来要新增的不是一个孤立的 `main.c`，而是一个可以独立配置、独立构建的 Zephyr 应用。

这个应用最终会读取 HC-SR04 超声波测距模块，但现在驱动、Binding 和设备树节点都还不存在。本课只建立 `applications/hc_sr04_demo/`，先让它以 HPM6E70 基础模板的状态完成构建。后面的每次修改都在这个应用和对应驱动目录中继续。

## 从基础模板创建应用

在工程根目录打开 PowerShell，用随包入口执行创建脚本：

```powershell
.\.venv\Scripts\python.exe scripts\ide\create_app.py --name hc_sr04_demo --template hpm6e70_demo
```

脚本非交互，参数全部由命令行给出。创建完成后应看到类似下面的结果：

```text
已创建 applications/hc_sr04_demo（模板：hpm6e70_demo）
```

这里有两个名称：

| 名称 | 作用 |
| --- | --- |
| `hpm6e70_demo` | 已经验证过 UART、SDRAM 和板载 LED 的基础模板，也是脚本的默认模板 |
| `hc_sr04_demo` | 本次创建的新应用，也是后续构建命令使用的应用名 |

脚本会复制整个模板目录，并把 `CMakeLists.txt` 中的 `project(hpm6e70_demo)` 改成 `project(hc_sr04_demo)`，其余参数保持不变。应用名要求英文字母开头，只含字母、数字、下划线；模板不存在或目标已存在都会报错退出，不会留下半个应用。

`--list` 可以列出当前所有应用，便于确认名称拼写：

```powershell
.\.venv\Scripts\python.exe scripts\ide\create_app.py --list
```

创建完成后，检查工程中是否出现下面的目录：

```text
applications/
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

打开 `applications/hc_sr04_demo/CMakeLists.txt`，确认内容如下：

```cmake
# SPDX-License-Identifier: Apache-2.0

cmake_minimum_required(VERSION 3.20.0)

find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(hc_sr04_demo)

target_sources(app PRIVATE src/main.c)
```

`find_package(Zephyr ...)` 加载 Zephyr 构建系统，并创建应用目标 `app`。`target_sources()` 再把 `src/main.c` 加入该目标。仅把 `.c` 文件放入 `src/` 并不会自动编译；以后增加新的源文件，也需要在这里登记。

这里没有写板卡目录，也没有写绝对路径：板卡由构建命令的 `-b` 指定，板卡搜索根目录由 `platform/zephyr/module.yml` 的 `board_root` 设置自动登记，应用不需要重复接线。

## 完成第一次构建

在工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -b dshanmcu_hpm6e70 applications\hc_sr04_demo -d build\hc_sr04_demo
```

构建成功后检查：

```text
build/hc_sr04_demo/zephyr/zephyr.elf
build/hc_sr04_demo/zephyr/zephyr.hex
```

`zephyr.elf` 保存可执行代码与符号信息，是烧录的输入；`zephyr.hex` 是 Intel HEX 格式的镜像。两个文件都位于 `build/hc_sr04_demo/`，说明新应用拥有独立的构建目录，不会和其他 Demo 的产物混在一起。

## 本课检查点

- `applications/hc_sr04_demo/` 已经创建；
- `project()` 中的名称已经变为 `hc_sr04_demo`；
- `create_app.py --list` 能列出新应用；
- 能用 west 命令构建该应用；
- `zephyr.elf` 和 `zephyr.hex` 已经生成；
- 工程中还没有增加 HC-SR04 设备树节点和驱动代码。

下一课先不修改 `main.c`。我们先看清一个 Zephyr 驱动由哪些部分组成、应用最终通过什么接口使用它，再按照依赖顺序逐项创建设备树节点、Binding、构建配置和驱动源文件。