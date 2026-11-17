---
title: 第 5 课：DS18B20 单总线测温
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 5 课：DS18B20 单总线测温

本课下载预编译固件 [`05_ds18b20_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/05_ds18b20_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M2** 插座上的 DS18B20 温度传感器以 12 位精度（0.0625 ℃）测温并输出串口日志。

## 硬件准备与接线

<KitExplorer focus="m2" />

将 DS18B20 模块插入底板 **M2** 插座（三线外部 3.3V 供电，不使用寄生供电模式）：

| M2 引脚 | 底板标注 | HPM6E70 实际引脚 | 作用 |
| ---: | --- | --- | --- |
| 1 | `VCC_+3.3V` | 3.3V | 模块供电 |
| 2 | `PA1 OUT/INT` | **PC06** | 1-Wire 数据脚 |
| 3 | `GND` | GND | 公共地 |

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留 M1 屏幕可直接在屏上查看两位小数大字号温度与动态温度条；未插屏时自动降级为仅串口输出。
:::

:::danger[运行前务必先拔掉 M10 上的 DHT11]
底板网络名称 `PA1` 为沿用命名，实际连接到 HPM6E70 的 `PC06`。**M2（DS18B20）与 M10（DHT11）共用同一根 `PC06` 数据线**——如果你刚做完上一课，插上 DS18B20 前**务必先把 M10 上的 DHT11 拔掉**！
:::

:::note[关于上拉电阻]
板内引脚配置已启用芯片弱上拉（`bias-pull-up`），可直接满足短线与配套模块测试。若使用无板载上拉电阻的裸探头或长延长线出现 CRC 报错，可在 `DATA` 与 `3.3V` 之间补一颗约 `4.7 kΩ` 的外部上拉电阻。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`05_ds18b20_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/05_ds18b20_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `05_ds18b20_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 16 课：DS18B20 单总线测温开发](../p2-16-DS18B20单总线测温开发/README.md)**。

## 预期现象与串口日志

烧录后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **M1 OLED 实时测温画面**：顶部黄区显示 `M2 DS18B20`，底部蓝区居中大字号显示两位小数温度（如 `25.62°C`）、中间小字号显示完整 `12-bit: 25.625 C` 精度、底部为 `0～50 ℃` 动态温度条；
2. **核心板心跳灯**：绿色 LED（`PC22`）每 500 ms 翻转一次，作为固件运行心跳（不代表温度高低）；
3. **实时测温**：串口每 2 秒打印一次温度值，用手指捏住 DS18B20 探头可看到温度以 0.0625 ℃ 分辨率平稳上升；
4. **串口日志示例**：

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
