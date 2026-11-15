---
title: 第 5 课：DS18B20 单总线测温
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 5 课：DS18B20 单总线测温

在 `HPM6E70` 完整工程包中编译并烧录 `applications/ds18b20_demo`，在 **M2** 插座上通过 Zephyr 1-Wire（`w1`）总线以 12 位精度（最小步进 0.0625 ℃）每 2 秒读取一次 DS18B20 温度并打印到串口。

## 硬件准备与接线

<KitExplorer focus="m2" />

将 DS18B20 模块插入底板 **M2** 插座（三线外部 3.3V 供电，不使用寄生供电模式）：

| M2 引脚 | 底板标注 | HPM6E70 实际引脚 | 作用 |
| ---: | --- | --- | --- |
| 1 | `VCC_+3.3V` | 3.3V | 模块供电 |
| 2 | `PA1 OUT/INT` | **PC06** | 1-Wire 数据脚 |
| 3 | `GND` | GND | 公共地 |

:::danger[运行前务必先拔掉 M10 上的 DHT11]
底板网络名称 `PA1` 为沿用命名，实际连接到 HPM6E70 的 `PC06`。**M2（DS18B20）与 M10（DHT11）共用同一根 `PC06` 数据线**——如果你刚做完上一课，插上 DS18B20 前**务必先把 M10 上的 DHT11 拔掉**！
:::

:::note[关于上拉电阻]
板内引脚配置已启用芯片弱上拉（`bias-pull-up`），可直接满足短线与配套模块测试。若使用无板载上拉电阻的裸探头或长延长线出现 CRC 报错，可在 `DATA` 与 `3.3V` 之间补一颗约 `4.7 kΩ` 的外部上拉电阻。
:::

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\ds18b20_demo -d build\ds18b20_demo
.\.venv\Scripts\python.exe -m west flash -d build\ds18b20_demo
```

## 预期现象与串口日志

烧录后打开串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：绿色 LED（`PC22`）每 500 ms 翻转一次，作为固件运行心跳（不代表温度高低）；
2. **实时测温**：串口每 2 秒打印一次温度值，用手指捏住 DS18B20 探头可看到温度以 0.0625 ℃ 分辨率平稳上升；
3. **串口日志示例**：

```text
DS18B20 demo: Zephyr 1-Wire and sensor API
SDRAM quick check PASSED (32 MiB)
sensor: temperature-sensor ready, 12-bit conversion every 2 s
PC06 is shared by M2 and M10; keep DHT11 unplugged.
temperature: 25.062 C
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 打印 `read failed: -19 (check M2 wiring and DATA pull-up)` | 总线上未检测到从设备：确认模块插在 **M2**、方向正确、且 **M10 上的 DHT11 已经拔掉** |
| 打印 `read failed: -5` 或提示 CRC 失败 | 优先检查接触与供电；若模块不带板载上拉电阻，在 DATA 与 3.3V 之间补 4.7 kΩ 上拉电阻 |
| 温度始终固定显示 `85.000 C` | 这是 DS18B20 上电默认寄存器初值，表示转换未能正常完成或供电瞬间掉电 |
| 温度变化趋势对，但数值频繁大跳变 | 缩短连线、补外部 4.7 kΩ 上拉，并确认 3.3V 供电稳定 |

---

[上一课：DHT11 温湿度采集](../p1-04-DHT11温湿度采集/README.md) · [下一课：HC-SR04 超声波测距](../p1-06-HC-SR04超声波测距/README.md) · [课程目录](../README.md)
