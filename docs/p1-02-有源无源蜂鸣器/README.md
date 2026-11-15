---
title: 第 2 课：有源/无源蜂鸣器
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 2 课：有源/无源蜂鸣器

在 `HPM6E70` 完整工程包中编译并烧录 `applications/buzzer_demo`，驱动底板 **M9** 插座上的蜂鸣器循环播放 2000 Hz、2500 Hz、3000 Hz 测试音后静音 2 秒，同时分辨手头模块属于有源还是无源蜂鸣器。

## 硬件准备与接线

<KitExplorer focus="m9" />

将配套的三针蜂鸣器模块插入模块化底板的 **M9** 插座（3.3V）：

| 模块引脚 | 底板 M9 网络 | HPM6E70 引脚 | 复用功能 |
| --- | --- | --- | --- |
| VCC | `3.3V` | — | 3.3V 供电 |
| GND | `GND` | — | 公共地 |
| OUT | `PA8`（底板网络名） | **PF26** | `PWM3_P_2`（PWM3 通道 2） |

:::danger[重要互斥：运行前必须拔掉 M4 红外发射管]
底板 **M9（蜂鸣器）** 与 **M4（红外发射管）** 共用同一根 `PA8` / `PF26` 信号线。运行本示例前，**务必先拔掉 M4 插座上的红外发射模块**；三针模块注意核对 `VCC / GND / OUT` 方向，不要插反。此外，不要直接插只有两只引脚、没有驱动三极管的裸蜂鸣器。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\buzzer_demo -d build\buzzer_demo
.\.venv\Scripts\python.exe -m west flash -d build\buzzer_demo
```

## 预期现象与串口日志

烧录后打开串口终端（`115200 8-N-1`，对应本机的 `USB-HiSpeed-SERIAL-B` COM 口）：

1. **声音现象**：模块会循环发出“低 → 中 → 高”三声短音（2000 Hz / 2500 Hz / 3000 Hz）并停顿 2 秒；
   - **无源蜂鸣器**：能明显听出音调由低变高；
   - **有源蜂鸣器**：内部自带振荡器，会以固定音色断续发声（两种情况均属正常，不会损坏模块）；
2. **心跳灯**：核心板绿色 LED（`PC22`）随每声提示与停顿周期翻转；
3. **串口日志示例**：

```text
buzzer demo: devicetree plus driver plus application
SDRAM quick check PASSED (32 MiB)
M9 buzzer driver ready: PF26 / PWM3 channel 2
If pitch changes, the module is passive; fixed pitch means active.

M9 pattern #1: three PWM tones
[BUZZER] LOW    tone 2000 Hz for 150 ms
[BUZZER] MIDDLE tone 2500 Hz for 150 ms
[BUZZER] HIGH   tone 3000 Hz for 400 ms
[BUZZER] pattern complete; silent for 2 seconds
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 串口日志正常，但完全没有声音 | 1. 确认 **M4 红外发射模块已拔掉**；<br/>2. 核对 **M9** 模块方向（`VCC/GND/OUT` 切勿反插）；<br/>3. 确认使用的是带驱动电路的三针蜂鸣器模块，而非裸两脚蜂鸣器；<br/>4. 若模块低电平触发，可将 `applications/buzzer_demo/boards/dshanmcu_hpm6e70.overlay` 中 `PWM_POLARITY_NORMAL` 改为 `PWM_POLARITY_INVERTED` 后加 `-p always` 重建测试 |
| 不发声期间也有微弱杂音或持续响 | 模块为相反有效电平触发，按上条修改 PWM 极性后再测 |
| 串口无任何输出 | 检查 `USB-HiSpeed-SERIAL-B` 端口与 `115200 8-N-1` 参数，烧录后按一次核心板 RESET 键 |

---

[上一课：RGB 全彩 LED 调色](../p1-01-RGB全彩LED调色/README.md) · [下一课：OLED 双色屏显示](../p1-03-OLED双色屏显示/README.md) · [课程目录](../README.md)
