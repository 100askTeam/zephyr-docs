---
title: 第 8 课：光敏电阻亮度采集
---

import KitExplorer from '@site/src/components/KitExplorer';

# 第 8 课：光敏电阻亮度采集

在 `HPM6E70` 完整工程包中编译并烧录 `applications/light_sensor_demo`，每 500 ms 读取一次底板 **M7** 插座上光敏电阻模块的模拟输出（16 位 ADC 原始值与毫伏电压）和数字比较器阈值输出（`DO`）。

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

## 编译与烧录

在 `HPM6E70` 工程根目录执行：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\light_sensor_demo -d build\light_sensor_demo
.\.venv\Scripts\python.exe -m west flash -d build\light_sensor_demo
```

## 预期现象与串口日志

烧录完成后打开串口终端（`115200 8-N-1`）：

1. **核心板心跳灯**：板载绿色 LED（`PC22`）每 500 ms 翻转一次；
2. **光敏模块响应测试**：
   - 用手遮住光敏电阻或用手机手电筒照射，观察 `raw`（范围 `0～65535`）和换算后的毫伏值明显变化（最低几位小幅跳动属正常环境与电源噪声）；
   - 用螺丝刀缓慢旋转模块上的蓝色电位器，观察 `DO` 在某一光照阈值附近从 `0` 翻转为 `1`（或 `1` 翻转为 `0`；具体方向取决于模块比较器接法）；
3. **串口日志示例**：

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
| 按板卡 RESET 键后串口工具拒绝访问或短暂断开 | 可能是板载串口通道因总线重枚举短暂断开，关闭串口工具后重新打开对应 `USB-HiSpeed-SERIAL-B` COM 口即可 |
| 串口出现 `adc read failed: -5 / -16 / -22 / -12` 等错误码 | 确认使用的是完整的 `HPM6E70` 工程包并带 `-p always -b dshanmcu_hpm6e70` 重新构建 |

---

[上一课：MPU6050 六轴姿态采集](../p1-07-MPU6050六轴姿态采集/README.md) · [下一课：旋转编码器与按键](../p1-09-旋转编码器与按键/README.md) · [课程目录](../README.md)
