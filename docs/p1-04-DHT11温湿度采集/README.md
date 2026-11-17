---
title: 第 4 课：DHT11 温湿度采集
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 4 课：DHT11 温湿度采集

本课下载预编译固件 [`04_dht11_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/04_dht11_demo.hex) 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M10** 插座上 DHT11 温湿度模块每 2 秒采样与串口实时输出。

## 硬件准备与接线

<KitExplorer focus="m10" />

将 DHT11 温湿度模块插入模块化底板的 **M10** 插座（3.3V）：

| 模块引脚 | 底板 M10 插座 | 核心板 J4 | HPM6E70 引脚 | 说明 |
| --- | --- | --- | --- | --- |
| VCC | `3.3V` | — | — | 3.3V 供电 |
| GND | `GND` | — | — | 公共地 |
| DATA（OUT/INT） | `OUT/INT` 网络 | 6 | **PC06** | 单总线双向数据脚 |

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留第 1 课的 0.96 寸 OLED 模块插在底板上，即可直接在屏幕上用双卡片大字号实时看温度与湿度；如果未插 M1 屏幕，固件会自动降级为仅串口输出，不影响测温体验。
:::

:::danger[重要互斥：M10（DHT11）与 M2（DS18B20）共用 PC06]
底板 **M10** 与 **M2** 两个插座共用 `PC06` 数据线。运行本课时，**必须确保 M2（DS18B20）没有插传感器**；同理，下一课运行 DS18B20 时需先拔掉 M10 的 DHT11。
:::

## 下载并烧录体验固件

1. **下载预编译固件**：点击下载 [`04_dht11_demo.hex`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/04_dht11_demo.hex)（若点击后浏览器直接预览文本，右键链接选择 **“链接另存为”** 保存为 `.hex` 文件）；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入刚下载的 `04_dht11_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 15 课：DHT11 温湿度采集开发](../p2-15-DHT11温湿度采集开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **M1 OLED 双卡片仪表盘**：顶部黄区显示 `M10 DHT11 ENV`，底部蓝区左右分栏卡片大字号实时显示当前温度（℃）与湿度（%RH）及进度条（未插 M1 屏时自动跳过）；
2. **核心板心跳灯**：板载绿色 LED（`PC22`）与采集节奏同步，每 2 秒翻转一次（符合 DHT11 规格书采样间隔 ≥ 1 秒的要求）；
3. **温湿度响应验证**：用手轻握探头或哈一口气，观察温度与湿度（RH）在屏幕与串口中同步上升；
4. **串口日志示例**：

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
| LED 不闪且没有任何启动日志 | 按一次核心板 **RESET** 键，确认已烧录成功且串口选对 `DshanPI USBToolBox UART1` 对应的 COM 口 |

---

[上一课：有源/无源蜂鸣器](../p1-03-有源无源蜂鸣器/README.md) · [下一课：DS18B20 单总线测温](../p1-05-DS18B20单总线测温/README.md) · [课程目录](../README.md)
