---
title: 第 6 课：编写 Devicetree Binding
---

# 第 6 课：编写 Devicetree Binding

overlay 已经写出了 `compatible`、`trig-gpios` 和 `echo-gpios`，但这些名字目前只是设备树中的文本。构建系统还不知道两个 GPIO 属性是否必填，也不知道它们是什么类型。

Devicetree Binding 是一份 YAML 规则文件。它把 `compatible = "dshan,hc-sr04"` 与一组可检查的属性联系起来，并让 Zephyr 为驱动生成相应的 C 宏。

## compatible 决定 Binding 文件

本工程把自定义 Binding 放在：

```text
dts/bindings/<设备类别>/
```

HC-SR04 将通过 Zephyr `sensor` 子系统提供距离数据，因此创建：

```text
dts/bindings/sensor/dshan,hc-sr04.yaml
```

文件名与节点中的 compatible 保持一致：

```text
compatible = "dshan,hc-sr04"
                    │
                    └── dts/bindings/sensor/dshan,hc-sr04.yaml
```

逗号左边是厂商或项目标识，右边是设备名称。`dshan` 表示这是当前工程维护的 Binding，不要使用已经被其他厂商占用的前缀。

## 写入 Binding

新建 `dts/bindings/sensor/dshan,hc-sr04.yaml`，写入：

```yaml
# Copyright (c) 2026 DshanMCU
# SPDX-License-Identifier: Apache-2.0

# 说明模块的信号含义和驱动最终提供的数据。
description: |
  DshanMCU HC-SR04 超声波测距模块。

  通过 GPIO 时序驱动：驱动在 TRIG 引脚发出 10 us 以上的触发脉冲，
  模块在 ECHO 引脚返回一个高电平脉冲，其宽度与声波往返时间成正比：
    距离（米）= ECHO 脉宽（秒）* 343 / 2

# 必须与 overlay 节点中的 compatible 完全一致。
compatible: "dshan,hc-sr04"

# 继承传感器设备和所有设备共有的基础属性规则。
include: [sensor-device.yaml, base.yaml]

properties:
  # TRIG、ECHO 都引用 GPIO 控制器，并且是驱动初始化所需的必填项。
  trig-gpios:
    type: phandle-array
    required: true
    description: TRIG 触发引脚，驱动侧配置为输出。

  echo-gpios:
    type: phandle-array
    required: true
    description: ECHO 回响引脚，驱动侧配置为输入。
```

YAML 使用缩进表达层级，不能使用 Tab。`properties` 下的 `trig-gpios` 和 `echo-gpios` 必须比 `properties:` 多缩进两个空格，它们各自的字段再多缩进两个空格。

## 每个字段参与什么检查

| 字段 | 构建阶段的作用 |
| --- | --- |
| `description` | 记录设备用途和协议，供维护者阅读 |
| `compatible` | 与设备树节点匹配 |
| `include: sensor-device.yaml` | 继承 Zephyr 传感器设备的公共规则 |
| `include: base.yaml` | 继承 `status` 等基础属性规则 |
| `type: phandle-array` | 要求属性值是控制器引用加若干参数 |
| `required: true` | 节点缺少该属性时立即停止构建 |

GPIO 属性使用复数形式 `-gpios`，因为 `phandle-array` 可以表示一个或多个 GPIO 描述。当前模块的每个属性只放一个 GPIO，驱动后面会读取索引 0。

Binding 不填写 PB05、PE01。它只规定“TRIG 和 ECHO 必须各自提供一个 GPIO 描述”；具体控制器和引脚编号仍由应用 overlay 决定。同一个驱动因此可以在另一块板上使用不同引脚。

## Binding 怎样变成 C 宏

构建时，Zephyr 会按下面的关系处理节点：

```text
应用 overlay
  compatible = "dshan,hc-sr04"
              │ 匹配
              ▼
dts/bindings/sensor/dshan,hc-sr04.yaml
  检查 trig-gpios、echo-gpios
              │ 生成
              ▼
devicetree_generated.h
  保存控制器、引脚号和标志对应的宏
```

Binding 中的连字符会在生成的 C 标识符中转换成下划线。例如 `trig-gpios` 会对应驱动宏参数中的 `trig_gpios`。这是 Devicetree 语法到 C 宏命名的转换，不要在 YAML 中提前写成 `trig_gpios`。

## 全量构建并检查生成结果

使用 VS Code 时，按下 `Ctrl+Shift+B` 打开 Demo 工具，先输入 `hc_sr04_demo` 前面的序号，再输入 `4` 选择「全量重建」。

使用终端时，在工程根目录执行：

```powershell
.\scripts\dev.ps1 rebuild hc_sr04_demo
```

先确认构建输出中不再出现 `dshan,hc-sr04` 缺少 Binding 的提示。然后打开：

```text
build/hc_sr04_demo/zephyr/include/generated/zephyr/devicetree_generated.h
```

搜索 `trig_gpios`，可以看到生成结果中包含以下信息：

```c
#define DT_N_S_hc_sr04_P_trig_gpios_IDX_0_VAL_pin 5
#define DT_N_S_hc_sr04_P_echo_gpios_IDX_0_VAL_pin 1
```

宏名很长，因为它编码了节点路径、属性名、元素索引和字段名。驱动不需要直接使用这些底层宏；第 8 课会用 `GPIO_DT_SPEC_INST_GET()` 把它们整理成 `gpio_dt_spec`。

## 用必填属性检查节点

可以暂时注释 overlay 中的 `echo-gpios`，再执行一次全量构建。使用 VS Code 时重复上面的 `Ctrl+Shift+B` 操作并选择「全量重建」；使用终端时再次执行 `rebuild` 命令。Binding 已经把它声明为 `required: true`，构建会指出 HC-SR04 节点缺少必填属性。恢复 `echo-gpios` 后用相同方式重新构建，错误应消失。

这个检查发生在编译驱动之前。与其让驱动运行后才发现没有 ECHO 引脚，不如让配置错误在构建阶段停止。

## 本课检查点

- `dts/bindings/sensor/dshan,hc-sr04.yaml` 已经创建；
- Binding 的 `compatible` 与 overlay 完全一致；
- `trig-gpios` 和 `echo-gpios` 都是必填的 `phandle-array`；
- 全量构建能够通过 Binding 检查；
- 生成头文件中可以找到引脚 5 和引脚 1 的属性宏。

下一课还不会实现测距。先让 Kconfig 决定是否启用驱动，再让 CMake 只在启用时编译对应源文件。
