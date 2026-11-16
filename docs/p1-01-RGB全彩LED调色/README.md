---
title: 第 1 课：RGB 全彩 LED 调色
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 1 课：RGB 全彩 LED 调色

在 `HPM6E70` 完整工程包中直接编译、烧录 `applications/rgb_led_demo`，通过 M3 插座上的全彩 LED 模块观察红、绿、蓝、黄、青、品红、白、灭 8 种颜色循环切换，并在串口终端确认启动自检与 PWM 调色日志。

:::tip[开始本课前先确认]
1. 已按 [连接并验证 JTAG](../common-04-连接JTAG与OpenOCD/README.md) 接好 CH347F JTAG 通道并确认驱动正常；
2. 已按 [连接串口并查看日志](../common-05-连接串口并查看日志/README.md) 接好 UART0 串口线，并在终端打开 `USB-HiSpeed-SERIAL-B` 对应的串口（参数 `115200`、`8-N-1`、`无流控`）；
3. 已获取 `HPM6E70` 完整工程包，后续命令均在 **`HPM6E70` 工程根目录**的 PowerShell 中执行，统一使用随包入口 `.\.venv\Scripts\python.exe`（无需激活虚拟环境）。
:::

## 硬件准备与接线

<KitExplorer focus="m3" />

将配套的**全彩 LED 模块**插入模块化底板的 **M3** 插座（注意丝印方向，切勿反插）。该模块由核心板两路 PWM 控制器共同驱动：

| 颜色通道 | 底板 M3 插座信号 | 核心板说明 | HPM6E70 引脚 | PWM 控制器与通道 |
| --- | --- | --- | --- | --- |
| 红（R） | `PA2` 网络 | 丝印“全彩LED R/舵机定时器” | **PB09** | `pwm1` 通道 1（`PWM1_P_1`） |
| 绿（G） | `PA15` 网络 | 丝印“全彩LED G/舵机定时器” | **PF01** | `pwm0` 通道 1（`PWM0_P_1`） |
| 蓝（B） | `PB3` 网络 | 丝印“全彩LED B/舵机定时器” | **PF00** | `pwm0` 通道 0（`PWM0_P_0`） |
| 供电/地 | `3.3V` / `GND` | 模块供电 | — | — |

:::note[极性与丝印说明]
- 核心板在 `PB09` 旁的早期丝印 `PWM0-P-4` 属于设计笔误，芯片实际复用为 `PWM1_P_1`；工程设备树已按实际硬件配置，直接编译即可。
- 当前 `applications/rgb_led_demo/boards/dshanmcu_hpm6e70.overlay` 默认使用 `PWM_POLARITY_NORMAL`（高电平点亮）。若你使用的是**共阳模块**（表现为主色全部变成补色，例如红色显示成青色），只需把 overlay 中三路 `pwms` 的极性改为 `PWM_POLARITY_INVERTED`，再带 `-p always` 全量重建。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\rgb_led_demo -d build\rgb_led_demo
.\.venv\Scripts\python.exe -m west flash -d build\rgb_led_demo
```

- 首次编译或修改过 `boards/dshanmcu_hpm6e70.overlay` / `prj.conf` 后，建议保留 `-p always` 做干净配置；若仅改 C 代码，可去掉 `-p always` 做增量构建。
- 每个 Demo 使用独立的 `-d build\<应用名>` 目录，互不覆盖构建缓存。

## 预期现象与串口日志

烧录完成后，观察开发板与串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：核心板绿色 LED（`PC22`）每秒翻转一次；
2. **M3 全彩 LED 模块**：每秒依次循环显示 **红 → 绿 → 蓝 → 黄 → 青 → 品红 → 白 → 灭** 8 种状态；
3. **串口日志示例**：

```text
RGB LED demo: coreboard + pwm rgb led
SDRAM quick check PASSED (32 MiB)
pwm: pwm@f0040000/pwm@f0044000/pwm@f0044000 ready (period=1000000ns)
Init complete. LED blinking, color cycling every second.
color: red     (R=100% G=0% B=0%)
color: green   (R=0% G=100% B=0%)
color: blue    (R=0% G=0% B=100%)
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 颜色变成补色（如红亮成青、绿亮成品红） | 模块极性与当前设置相反，将 `applications/rgb_led_demo/boards/dshanmcu_hpm6e70.overlay` 中的 `PWM_POLARITY_NORMAL` 改为 `PWM_POLARITY_INVERTED` 后加 `-p always` 重新编译烧录 |
| 串口日志正常打印，但 M3 模块不亮 | 检查模块是否插紧在 **M3** 插座、引脚顺序是否反插 |
| 无任何串口输出且 `PC22` 绿灯不闪 | 先确认烧录命令返回成功与 `verified`，按一次核心板 **RESET** 键再观察；如串口仍无输出，回查 [连接串口并查看日志](../common-05-连接串口并查看日志/README.md) |

---

[上一课：认识实验套件](../p1-00-认识实验套件/README.md) · [下一课：有源/无源蜂鸣器](../p1-02-有源无源蜂鸣器/README.md) · [课程目录](../README.md)
