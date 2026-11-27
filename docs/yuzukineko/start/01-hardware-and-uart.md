---
title: 连接开发板与串口
description: 仅用 YuzukiNeko、USB-C 串口分线器与 3.3 V USB 转串口模块完成供电与 UART1 串口连接，含正反面实物对照与 3D 交互接线图。
---

import HardwareWiringGuide from '@site/src/components/HardwareWiringGuide';

# 连接开发板与串口

准备好 **YuzukiNeko**、**USB-C 串口分线器**、**USB-C 数据线** 和一个 **3.3 V USB 转串口模块**，按下面三步接好即可。

:::caution[接线前先断电]
插拔线前请先断开所有 USB 供电；仅连接 TX、RX、GND 三根线，**不要连接 3.3V 或 5V 电源线**。
:::

## 第一步：按正反方向插好分线器

USB-C 串口分线器<strong style={{ color: 'var(--ifm-color-danger)' }}>必须区分正反</strong>（<strong>插反 180° 会导致串口无输出</strong>），照下方实物图插入即可：

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1rem 0 1.4rem' }}>
  <figure style={{ margin: 0, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
    <img
      src={require('./images/yuzuki-splitter-front.webp').default}
      alt="YuzukiNeko 正面芯片面朝上，分线器 AvaotaUART 与 USB-C 母口朝上"
      width={1024}
      height={430}
      style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
    />
    <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
      <strong>正面</strong>：芯片与 FEL 键朝上 ↔ 分线器 USB-C 母口朝上
    </figcaption>
  </figure>
  <figure style={{ margin: 0, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
    <img
      src={require('./images/yuzuki-splitter-back.webp').default}
      alt="YuzukiNeko 背面猫咪面朝上，分线器白色 3-Pin 座子朝上"
      width={1024}
      height={430}
      style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
    />
    <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
      <strong>背面</strong>：猫咪图案朝上 ↔ 分线器白色 3-Pin 座子朝上
    </figcaption>
  </figure>
</div>

## 第二步：连接 3 根串口线

翻到背面（白座朝上），将 3 根串口线按 RX ↔ TX 交叉接到你的 3.3 V USB 转串口模块。

> 下图左侧以 DshanPI USBToolBox 作演示（非标配配件，如需同款可联系客服购买）；使用 CH340、CP2102、FT232 等任意 3.3 V USB 转串口模块接法完全一致。

<HardwareWiringGuide mode="uart" board="yuzukineko" />

| 分线器白座（从第 1 脚往下数） | 线色 | 通用 3.3 V 串口模块 | USBToolBox 演示（可选购） |
| --- | --- | --- | --- |
| 第 1 脚（圆点 `•` · RX） | 黄线 | **TXD** | **P3 · TXD1**（左数第 3 针） |
| 第 2 脚（中间 · TX） | 黑线 | **RXD** | **P2 · RXD1**（左数第 2 针） |
| 第 3 脚（最下 · GND） | 红线 | **GND** | **P7 · GND**（最右侧第 7 针） |

## 第三步：核对并上电

1. 确认未接任何 3.3V / 5V 电源线，且分线器正反方向与实物图一致；
2. 将 USB-C 数据线插到分线器尾部母口连到电脑，正面右侧 **红色电源灯点亮** 即供电正常；
3. 将 3.3 V USB 转串口模块插到电脑 USB 口（串口参数统一为 `115200 8N1`）。

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1rem 0 1.4rem' }}>
  <figure style={{ margin: 0, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
    <img
      src={require('./images/yuzuki-poweron-front.webp').default}
      alt="YuzukiNeko 正面上电实物图，右侧红色电源灯常亮"
      width={1024}
      height={399}
      style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
    />
    <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
      <strong>正面验收</strong>：USB-C 接入尾部母口，右侧红色电源灯常亮
    </figcaption>
  </figure>
  <figure style={{ margin: 0, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
    <img
      src={require('./images/yuzuki-poweron-back.webp').default}
      alt="YuzukiNeko 背面上电实物图，白座三线引出就位"
      width={1024}
      height={399}
      style={{ width: '100%', height: 'auto', display: 'block', margin: 0, border: 0, borderRadius: 0, boxShadow: 'none' }}
    />
    <figcaption style={{ padding: '0.6rem 0.85rem', fontSize: '0.84rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.5 }}>
      <strong>背面验收</strong>：底侧 USB-C 线与白座 3 根串口线插牢就位
    </figcaption>
  </figure>
</div>

> 如果通电后电脑 USB 反复断开或线缆发热，请立即拔掉 USB 重新核对针脚。

<details>
<summary>补充说明：接线原理与底板入口</summary>

- **不接 3.3V**：YuzukiNeko 由分线器尾部 USB-C 独立供电，并接电源线容易造成倒灌损坏。
- **分线器正反原理**：Type-C 的 DP/DN 对称（供电和 FEL 不分正反），但串口复用的 SBU1（PB1 / UART1-RX）与 SBU2（PB0 / UART1-TX）非对称，插反会交换收发脚。
- **扩展外设**：后续体验彩屏、Wi-Fi 或扬声器时，可查看 [YuzukiCube-M 底板](../baseboard.md)。

</details>

---

[返回首页](../README.md) · [下一步：烧录第一个体验固件](02-flash-first-firmware.md)
