---
title: 第 2 课：构建和烧录应用
---

# 第 2 课：构建和烧录应用

HPM6E70 工程的 `applications/` 目录中保存多个应用。本课把其中一个应用编译成固件，再经 JTAG 烧进板卡，最后从串口确认它真的在运行。构建与烧录直接用 west 命令，没有封装脚本，也没有任务菜单。

所有命令都在**工程根目录**的 PowerShell 中执行，入口统一用随包的 `.venv\Scripts\python.exe`。它会自动配好工具链环境，不要用系统安装的 python 或 west。

## 构建一个应用

以默认 demo 为例：

```powershell
.\.venv\Scripts\python.exe -m west build -b dshanmcu_hpm6e70 applications\hpm6e70_demo -d build\hpm6e70_demo
```

| 参数 | 作用 |
| --- | --- |
| `-b dshanmcu_hpm6e70` | 板卡 target，来自 `platform/boards/` 下的 Board 定义 |
| `applications\hpm6e70_demo` | 应用源码目录 |
| `-d build\hpm6e70_demo` | 构建目录，每个应用独立，互不干扰 |

第一次构建会完整编译 Zephyr 内核、驱动和应用，需要几分钟；之后改代码再构建是增量的，通常几秒到几十秒。建议始终带 `-d build\<应用名>`：省略时 west 用默认 `build/`，多个应用会互相覆盖缓存。

改了 `prj.conf` 或设备树 overlay 但行为没变化时，加 `-p always` 强制全量重建：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\hpm6e70_demo -d build\hpm6e70_demo
```

构建成功后，入口会自动把编译数据库发布到 `build/compile_commands.json`，VS Code 的代码跳转和补全读取的就是它；构建失败则不发布，保留上一次可用索引。

## 烧录到板卡

烧录前先完成 [连接调试器与串口](../start-01-连接调试器与串口/README.md) 与 [安装 USBToolBox 与驱动](../start-02-安装USBToolBox与驱动/README.md)：五根 JTAG 线接好，已安装驱动并关闭 `USBToolBox` 上位机。然后执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\hpm6e70_demo
```

`west flash` 会先自动增量重建（代码没变就是秒过），保证烧进去的是最新代码，再用板级默认的 OpenOCD runner 烧录。这套餐具在 `platform/boards/hpmicro/dshanmcu_hpm6e70/board.cmake` 里接线：

- 烧录器是随包的定制版 OpenOCD（`sdk/openocd`），已集成对 JTAG 烧录调试接口与 HPM XPI Flash 的支持；
- 板级配置在 `support/openocd/` 下分三层：JTAG 调试器接口配置（500 kHz）、HPM6E70 目标、板级 Flash 与复位时序；
- 复位走 RISC-V 调试模块路径，不依赖 SRST 线，五根信号线即可。

烧录过程包含写入、读回校验和复位。看到校验通过并复位完成，固件就已经在板上运行了。要跳过自动重建加 `--skip-rebuild`；换应用时只改 `-d`。

## 确认程序在运行

烧录完成后打开串口（115200 8N1），按一下板卡复位键，应看到 Zephyr 启动横幅和应用打印。串口接线与工具设置见 [连接调试器与串口](../start-01-连接调试器与串口/README.md) 和 [烧录第一个闪灯程序](../start-03-烧录第一个闪灯程序/README.md)。

`hpm6e70_demo` 会打印 UART 与 SDRAM 自检结果，并让板载 LED 周期性闪烁。有打印、灯在闪，本课的构建烧录链路就通了。

## 构建产物在哪里

```text
build/hpm6e70_demo/
├─ zephyr/
│  ├─ zephyr.elf        完整镜像,烧录输入来自它
│  ├─ zephyr.hex        Intel HEX
│  ├─ .config           最终生效的 Kconfig
│  └─ zephyr.dts        最终生效的设备树
├─ compile_commands.json
└─ build.ninja
```

排查配置问题看 `zephyr/.config` 和 `zephyr/zephyr.dts`——它们是板级 defconfig、`prj.conf`、overlay 全部合并后的**最终结果**，比逐个翻源文件可靠。

## VS Code 的角色

VS Code 只负责编辑和看串口，构建烧录都在终端跑 west。工程推荐两个扩展：

| 扩展 | 用途 |
| --- | --- |
| C/C++（`ms-vscode.cpptools`） | 代码补全与跳转，读取 `build/compile_commands.json` |
| Serial Monitor（`ms-vscode.vscode-serial-monitor`） | 查看串口输出 |

`.vscode/settings.json` 已为集成终端配好与启动器相同的环境，在 VS Code 终端里也可以直接跑 `west build`。用 VS Code 打开**工程根目录**，不要打开某个应用子目录。

## 本课检查点

1. 成功构建 `hpm6e70_demo`，产物出现在 `build/hpm6e70_demo/zephyr/`；
2. `west flash` 烧录并校验通过；
3. 串口看到启动横幅与应用打印，板载 LED 闪烁；
4. 能说出 `-b`、`-d`、`-p always` 三个参数各自的作用。

下一课创建自己的第一个应用工程，认识 `CMakeLists.txt`、`prj.conf`、`src/main.c` 和应用 overlay 的分工。