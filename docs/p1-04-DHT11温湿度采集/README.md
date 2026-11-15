---
title: 第 4 课：DHT11 温湿度采集
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 4 课：DHT11 温湿度采集

在 `HPM6E70` 完整工程包中编译并烧录 `applications/dht11_demo`，通过 `PC06` 单总线每 2 秒采集一次底板 **M10** 插座上的 DHT11 模块数据，并在串口打印实时温度与相对湿度。

## 硬件准备与接线

<KitExplorer focus="m10" />

将 DHT11 温湿度模块插入模块化底板的 **M10** 插座（3.3V）：

| 模块引脚 | 底板 M10 插座 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | --- | --- | --- | --- |
| VCC | `3.3V` | — | — | 3.3V 供电 |
| GND | `GND` | — | — | 公共地 |
| DATA（OUT/INT） | `OUT/INT` 网络 | 6 | **PC06** | 单总线双向数据脚 |

:::danger[重要互斥：M10（DHT11）与 M2（DS18B20）共用 PC06]
底板 **M10** 与 **M2** 两个插座共用 `PC06` 数据线。运行本课时，**必须确保 M2（DS18B20）没有插传感器**；同理，下一课运行 DS18B20 时需先拔掉 M10 的 DHT11。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\dht11_demo -d build\dht11_demo
.\.venv\Scripts\python.exe -m west flash -d build\dht11_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：板载绿色 LED（`PC22`）与采集节奏同步，每 2 秒翻转一次（符合 DHT11 规格书采样间隔 ≥ 1 秒的要求）；
2. **实时交互验证**：用手轻握探头或哈一口气，观察温度与湿度（RH）随之上升；
3. **串口日志示例**：

```text
DHT11 demo: coreboard + temp/humidity sensor
SDRAM quick check PASSED (32 MiB)
sensor: dht11 ready
Init complete. LED blinking, sampling every 2 s.
temp: 28.000000 C, RH: 65.000000 %
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 周期打印 `read failed: -5 (module not plugged or bus timing error)` | 1. 确认模块插在 **M10** 且没有反插；<br/>2. 确认 **M2 插座为空**（未插 DS18B20 抢占 `PC06`）；<br/>3. DHT11 上电后约需 1 秒稳定，若偶发 `-5` 会在下一个 2 秒周期自动重试；若持续 `-5`，检查模块是否损坏或接触不良 |
| 报错 `ERROR: dht11 device not ready` | 检查是否错误使用其他板卡目标构建，务必带 `-b dshanmcu_hpm6e70` 并做干净重建 |
| LED 不闪且没有任何启动日志 | 按一次核心板 **RESET** 键，确认已烧录成功且串口选对 `USB-HiSpeed-SERIAL-B` |

---

[上一课：OLED 双色屏显示](../p1-03-OLED双色屏显示/README.md) · [下一课：DS18B20 单总线测温](../p1-05-DS18B20单总线测温/README.md) · [课程目录](../README.md)
