---
title: 第 9 课：旋转编码器与按键
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 9 课：旋转编码器与按键

在 `HPM6E70` 完整工程包中编译并烧录 `applications/rotary_encoder_demo`，读取底板 **M13** 插座上 KY-040 旋转编码器的顺/逆时针旋转（带计数值与方向）和下压按键动作，并在串口实时输出输入事件。

## 硬件准备与接线

<KitExplorer focus="m13" />

将旋转编码器模块直接插入模块化底板的 **M13** 插座：

| 模块功能 | 底板 M13 引脚 | 底板网络名 | HPM6E70 引脚 | 对应 input 事件 |
| --- | :---: | --- | --- | --- |
| `VCC` | 1 | `VCC_+5V` | 5V 电源 | — |
| `KEY / SW` | 2 | `PB1` | **PB10** | 按键 `INPUT_KEY_0` |
| `S2 / DT` | 3 | `PB0` | **PC00** | B 相 |
| `S1 / CLK` | 4 | `PB12` | **PA23** | A 相 |
| `GND` | 5 | `GND` | `GND` | — |

:::note[供电与默认模式说明]
1. **关于 M13 5V 供电**：底板 M13-1 接入经过限流保护的 `VCC_+5V`，配套编码器模块已在实板上直接插 M13 完成正反转与按键按下/松开测试，按本示例直接插接运行即可（无需改线）。若后续用于长期量产并严格要求 GPIO 仅承受 3.3V 电平，可将模块改接 3.3V 或增加 5V→3.3V 电平转换。
2. **默认运行模式**：overlay 默认开启 `polling-mode;`（每 1000 us 采样一次、`steps-per-detent = 4`、按键消抖 `20 ms`）。如需切换为中断模式，可删除 `applications/rotary_encoder_demo/boards/dshanmcu_hpm6e70.overlay` 中的 `polling-mode;` 一行并加 `-p always` 重新编译烧录。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\rotary_encoder_demo -d build\rotary_encoder_demo
.\.venv\Scripts\python.exe -m west flash -d build\rotary_encoder_demo
```

:::info[编译时看到 `LOAD segment with RWX permissions` 告警属正常现象]
构建本示例期间，链接器会对 `zephyr_pre0.elf` 和 `zephyr.elf` 各打印一条 `LOAD segment with RWX permissions` 警告。这是由于启用了 `CONFIG_INPUT`，上游 Zephyr 将 input 子系统的静态线程数据段与代码段合并所致，**属于已知的预期提示，不影响任何功能**，请直接继续烧录。
:::

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`），拧动旋钮并按压轴键：

1. **核心板心跳灯**：板载绿色 LED（`PC22`）每 500 ms 翻转一次；
2. **旋钮与按键事件**：顺时针转动打印 `CW` 且 `position` 递增，逆时针打印 `CCW` 且递减；按下/松开轴键分别打印 `PRESSED` / `RELEASED`；
3. **串口日志示例**：

```text
rotary encoder demo: Zephyr input driver
SDRAM quick check PASSED (32 MiB)
Input ready: turn the knob or press it; LED is the firmware heartbeat.
rotate: delta=+1 position=1 direction=CW
rotate: delta=-1 position=0 direction=CCW
button: PRESSED
button: RELEASED
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 顺时针旋转时日志显示成 `CCW` | 不同批次模块 A/B 相脚位可能相反，交换 overlay 中 `a-gpios` 与 `b-gpios` 后加 `-p always` 重建即可 |
| 每转一格报错两次或转两格才报一次 | 调整 overlay 中的 `steps-per-detent`（在 `2` 和 `4` 之间切换）后加 `-p always` 重建 |
| 快速拧动时轮询偶发丢格 | 删除 overlay 中的 `polling-mode;` 切换为中断模式，再用 `-p always` 重新编译烧录 |
| 完全没有任何事件输出 | 检查模块是否插紧在 **M13**，核对 `CLK / DT / SW / GND` 接触是否正常 |

---

[上一课：光敏电阻亮度采集](../p1-08-光敏电阻亮度采集/README.md) · [下一课：红外对管避障检测](../p1-10-红外对管避障检测/README.md) · [课程目录](../README.md)
