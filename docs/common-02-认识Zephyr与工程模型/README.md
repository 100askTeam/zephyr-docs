---
sidebar_position: 3
title: 认识 Zephyr 与工程模型
---

# 认识 Zephyr 与工程模型

本教程围绕同一套工程展开三期内容：一、二期直接使用完整工程包（一期编译烧录并验证各外设模块，二期学习设备树、驱动与应用开发），三期再从空目录把它完整搭建出来。这里先沿着课程工程中的真实目录认识 Zephyr：哪些能力来自 Zephyr，哪些支持由 HPMicro 提供，板卡自身的信息又应该放在哪里。

完成本课后，你将能够在工程中找到 Zephyr、HPMicro 适配层和 HPM SDK，并了解后续为什么要为 HPM6E70 建立 Board。

## 从课程工程开始

在完整工程包的 `HPM6E70` 根目录打开 Windows PowerShell，先查看 west 的入口配置，再列出它识别的项目。入口统一用工程自带的 `.venv\Scripts\python.exe`，它会自动把随包工具配好，不需要手工设置 PATH。

```powershell
Get-Content .\.west\config
.\.venv\Scripts\python.exe -m west list manifest sdk_glue zephyr sdk_env -f '{name}: {path}'
```

`.west/config` 中的清单位置应为：

```ini
[manifest]
path = platform
file = west.yml
```

`path = platform` 指向工程里的 `platform/` 目录，`file = west.yml` 指向其中的清单文件。再打开 `platform/west.yml`，可以看到它把 HPMicro 的清单导入当前工作区：

```yaml
manifest:
  projects:
    - name: sdk_glue
      import:
        file: west_gitee.yml
        name-blocklist:
          - mcuboot
```

这里摘录了 `west.yml` 中与清单导入有关的字段；实际文件还固定了 `sdk_glue` 的远端和 revision。west 先读取 `platform/west.yml`，再由 `import` 读取 `sdk_glue/west_gitee.yml`，因此能找到 Zephyr、HPM SDK 等项目；`name-blocklist` 把本工程不使用的 mcuboot 排除在外。`.west/config` 记录入口位置，本身不是源码目录。

上面的 `west list` 命令应输出：

```text
manifest: platform
sdk_glue: sdk_glue
zephyr: zephyr
sdk_env: sdk_env
```

`manifest: platform` 表示 `platform/` 目录是清单入口；`sdk_glue` 是被清单导入的项目。它们不是同一个目录。

把配置项放回工程目录中，可以直接看到 west 最终读取的文件：

```text
HPM6E70/
├─ .west/
│  └─ config                 ← 记录 path 和 file
├─ platform/
│  ├─ west.yml               ← west 首先读取的清单
│  └─ zephyr/module.yml      ← 把 platform 注册为 Zephyr 模块
├─ sdk_glue/
│  └─ west_gitee.yml         ← 由清单导入的上游清单
├─ zephyr/                   ← Zephyr 项目
└─ sdk_env/                  ← HPM SDK 源码
```

`.west/config` 中的 `path = platform` 与 `file = west.yml` 组合成 `platform/west.yml`；其中的 `import` 再连接到 `sdk_glue/west_gitee.yml`。执行 `west update` 时，west 才会按这两层清单更新各个仓库。三期从零搭建过程中的中间状态可能不同，本页描述的是一、二期完整工程包的最终结构。

| 目录 | 主要内容 | 后续会在哪里遇到 |
|---|---|---|
| `zephyr/` | Zephyr 内核、通用驱动 API、Devicetree、Kconfig 和构建系统 | 应用 API、设备模型、编译过程 |
| `sdk_glue/` | HPMicro 的 Zephyr SoC 支持、驱动适配和 west 扩展 | HPM6E00 系列 SoC、Flash 驱动 |
| `sdk_env/` | HPM SDK、芯片寄存器定义和底层驱动 | 时钟、启动和芯片外设底层实现 |
| `platform/` | 本课程的板卡、驱动、设备树 Binding 和公共头 | 后续每一课写入的内容 |
| `applications/` | 可以分别构建和运行的应用 | 第 3 课起创建的应用 |
| `sdk/` | 随包 Python、CMake、Ninja、Git、RISC-V 工具链和 OpenOCD | 构建与烧录 |

这层划分很重要：应用通常调用 Zephyr API；Zephyr 通过板级描述找到设备；HPMicro 适配代码再把统一 API 接到 HPM 芯片的底层实现。

## Zephyr 不只是一个实时内核

线程、信号量、消息队列和定时器是许多 RTOS 都具备的基础能力。Zephyr 在这些内核能力之外，还把硬件描述、功能裁剪、驱动模型、板卡支持和构建流程放进同一套工程模型中。

Zephyr 官方在 *Distinguishing Features* 中列出了可配置与模块化、跨架构、编译期资源定义、统一设备驱动模型和 Devicetree 支持等特性：

![Zephyr 官方列出的部分项目特性](./images/Zephyr官方特性说明.png)

可在 [Zephyr 官方 Introduction：Distinguishing Features](https://docs.zephyrproject.org/latest/introduction/index.html#distinguishing-features) 查看完整说明。上图所列内容会在后续实验中落到具体文件：

| 官方特性 | 在本课程中的落点 |
|---|---|
| Highly configurable / Modular | `prj.conf`、Kconfig，只把需要的能力编进固件 |
| Cross Architecture | HPM6E70 复用 Zephyr 已有的 RISC-V 架构实现 |
| Compile-time resource definition | Devicetree 和 Kconfig 在编译阶段生成配置 |
| Optimized Device Driver Model | 应用通过 Zephyr GPIO、UART 等统一 API 使用设备 |
| Devicetree Support | Board DTS 描述 UART、LED、Flash 和 SDRAM 的实际连接 |

## 工作区清单不包含板卡连接

`.west/config` 和 `west list` 可以确认源码来自哪个仓库、各仓库位于什么目录，但它们不会说明当前实物板使用哪颗 MCU，也不会给出 UART、LED、Flash 或 SDRAM 的实际连接。

这些硬件事实需要从芯片丝印和原理图中确认，再决定哪些内容应写入 Board、Devicetree 和 pinctrl。下一篇先记录 HPM6E70 板卡上的主控制器、外部存储器和观察接口；三期从零搭建工程时，再把这份硬件记录与现有软件支持逐层对照。

## 完成本课后的检查

继续下一篇前，确认自己能够回答：

1. `.west/config` 中的 `path` 和 `file` 组合成哪个入口文件？它又导入哪个清单？
2. `zephyr/`、`sdk_glue/` 和 `sdk_env/` 分别由谁维护、提供什么内容？
3. 为什么仅查看 west 工作区还不能确定当前板卡的 UART、LED 和外部存储器连接？

能够结合终端输出、目录树和源码作用表回答这三个问题，就可以继续从实物板与原理图确认板卡硬件。
