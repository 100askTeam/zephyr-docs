---
title: 第 8 课：光敏电阻亮度采集
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 8 课：光敏电阻亮度采集

本课下载预编译固件 [`08_light_sensor_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/08_light_sensor_demo.zip)（解压得 `08_light_sensor_demo.hex`） 并通过 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录，快速体验底板 **M7** 插座上光敏电阻模块的模拟亮度采集（16-bit ADC）与阈值电平输出（`DO`）。

## 硬件准备与接线

<KitExplorer focus="m7" />

将光敏电阻模块插入模块化底板的 **M7** 插座（3.3V）：

| 模块信号 | 底板 M7 网络 | 连接器位置 | HPM6E70 引脚 | 说明 |
| --- | --- | --- | --- | --- |
| VCC | `3.3V` | M7-1 | `3.3V` | 模块供电 |
| GND | `GND` | M7-3 | `GND` | 公共地 |
| AO | `PA3 / ADC1_IN3`（底板网络名） | J3-8 | **PF07 / ADC0_IN15** | 模拟光照强度（16-bit） |
| DO | `PB11 / DO/INT`（底板网络名） | J3-16 | **PB02** | 模块电位器比较输出 |

> 核心板参考电压 `VREFH` 接 3.3 V、`VREFL` 接 GND，设备树按标称 `3300 mV` 计算电压：`电压(mV) = raw * 3300 / 65535`。

:::tip[建议保持 M1 OLED 插在底板上同屏查看]
本课固件已内置 **M1 OLED 联动显示**：保留 M1 屏幕可直接在屏上用大字号毫伏电压、光照进度条和顶部 `[DO:0/1]` 阈值状态实时观察变化；未插屏时自动降级为仅串口输出。
:::

## 下载并烧录体验固件

1. **下载并解压预编译固件**：点击下载 [`08_light_sensor_demo.zip`](https://dl.100ask.net/Hardware/MCU/HPM6E70-ZEPHYR/firmware/08_light_sensor_demo.zip)，解压得到 `08_light_sensor_demo.hex` 烧录文件；
2. **使用 [`DshanPI USBToolBox`](https://dl.100ask.net/Tools/usbtoolsbox/) 烧录**：打开上位机，按图中的 `①`～`⑥` 步骤直接烧录：

![使用 DshanPI USBToolBox 烧录体验固件的步骤图解](../p1-00-认识实验套件/images/usbtoolbox-flash-steps.jpg)

1. **① 确认设备授权连接**：确保 HPM6E70 板卡已上电、调试器已通过 USB 接入电脑，软件左下角显示绿色 **`DshanPI USBToolBox 已授权`**；
2. **② 打开 JTAG/SWD 工具**：在左侧功能栏点击 **`JTAG/SWD 工具`**，顶部保持在 **`固件烧录`** 页签；
3. **③ 选择芯片平台**：下拉选择 **`HPMicro / HPM`**；
4. **④ 选择目标配置**：下拉选择 **`HPM6E70`**（保持默认通信速率 `500 kHz`，勾选 **`烧录后运行`**）；
5. **⑤ 加载固件**：点击 **`选择文件`**，导入解压得到的 `08_light_sensor_demo.hex`（`.hex` 自带烧录地址，无需填写起始地址）；
6. **⑥ 检测并烧录**：可先点 **`检测连接`**（日志出现 `Examined RISC-V core`），再点击 **`开始烧录`**；校验完成后固件会自动复位运行。

> 只需快速体验本外设功能时，以上步骤即已完成烧录；如果需要查阅源码位置、调整设备树配置并使用 `west build` / `west flash` 开发，请见 **[二期第 19 课：光敏电阻亮度采集开发](../p2-19-光敏电阻亮度采集开发/README.md)**。

## 预期现象与串口日志

烧录完成后观察 M1 OLED 屏幕与串口终端（`115200 8-N-1`）：

1. **M1 OLED 实时亮度仪表盘**：顶部黄区显示 `M7` 徽章与动态阈值标志 `LIGHT [DO:1]` / `LIGHT [DO:0]`，底部蓝区大字号居中显示转换后的毫伏电压（如 `1420 mV`）、底部为 `0～3300 mV` 光照强度条；
2. **核心板心跳灯**：板载绿色 LED（`PC22`）每 500 ms 翻转一次；
3. **光敏模块响应测试**：
   - 用手遮住光敏电阻或用手机手电筒照射，观察 `raw`（范围 `0～65535`）和换算后的毫伏值在屏幕和串口同步变化（最低几位小幅跳动属正常环境与电源噪声）；
   - 用螺丝刀缓慢旋转模块上的蓝色电位器，观察 `DO` 在某一光照阈值附近从 `0` 翻转为 `1`（或 `1` 翻转为 `0`；具体方向取决于模块比较器接法），顶部 `[DO:0/1]` 标志随之切换；
4. **串口日志示例**：

```text
light sensor demo: coreboard + adc + gpio
SDRAM quick check PASSED (32 MiB)
adc: adc@f0100000 ch15, 16-bit, vref=3300 mV ready
Init complete. LED blinking, sampling every 500 ms.
Cover the LDR: AO should change; adjust the potentiometer to test DO.
light: raw=52122 (2624 mV) DO=1
light: raw=52081 (2622 mV) DO=1
```

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| `raw` 长期恒为 `0` 或 `65535` | 优先检查模块供电、是否插紧在 **M7** 以及插接方向是否正确 |
| 遮挡/补光时 `raw` 变化正常，但 `DO` 一直不翻转 | 调节模块上的蓝色电位器阈值，使对比基准落在当前环境光照区间内 |
| 按板卡 RESET 键后串口工具拒绝访问或短暂断开 | 可能是串口通道因总线重枚举短暂断开，关闭串口工具后重新打开对应 `DshanPI USBToolBox UART1` COM 口即可 |

---

[上一课：MPU6050 六轴姿态采集](../p1-07-MPU6050六轴姿态采集/README.md) · [下一课：旋转编码器与按键](../p1-09-旋转编码器与按键/README.md) · [课程目录](../README.md)
