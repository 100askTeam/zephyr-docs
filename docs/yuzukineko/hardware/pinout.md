---
title: "引脚排布与外设复用"
---

下表视角为**元件面朝上，USB-C 接口在顶部**，行号从 USB-C 一端向 microSD 一端递增。

:::caution
本文的「实际 SoC GPIO」列适用于所有版本。如果使用的是 **V1.3**，丝印从 `PD10` 起比真实 GPIO 小 2，配置复用前请先核对 [V1.3 PD 丝印勘误](overview.md#v13pd-丝印编号错误)。
:::

## 排针总表

下表中 **V1.3 丝印** 是 V1.3 板子上印的名字；**实际 GPIO / V1.4 丝印** 才是 SoC 的真实引脚名，pinmux、设备树和原理图都使用这一列。加粗的是与 V1.3 丝印不同的项。

| 行 | 左：V1.3 丝印 | 左：实际 GPIO / V1.4 丝印 | 右：V1.3 丝印 | 右：实际 GPIO / V1.4 丝印 |
| ---: | --- | --- | --- | --- |
| 1 | `3V3` | `3V3` | `5V` | `5V` |
| 2 | `PD6` | `PD6` | `GND` | `GND` |
| 3 | `PD7` | `PD7` | `PD5` | `PD5` |
| 4 | `PD8` | `PD8` | `PD4` | `PD4` |
| 5 | `PD9` | `PD9` | `PD3` | `PD3` |
| 6 | `PD10` | **`PD12`** | `PD2` | `PD2` |
| 7 | `PD11` | **`PD13`** | `PD1` | `PD1` |
| 8 | `PD12` | **`PD14`** | `PD0` | `PD0` |
| 9 | `PD13` | **`PD15`** | `PD20` | **`PD22`** |
| 10 | `PD14` | **`PD16`** | `PB0` | `PB0` |
| 11 | `PD15` | **`PD17`** | `PB1` | `PB1` |
| 12 | `PD16` | **`PD18`** | `PB2` | `PB2` |
| 13 | `PD17` | **`PD19`** | `PB3` | `PB3` |
| 14 | `PD18` | **`PD20`** | `GPADC` | `GPADC` |
| 15 | `PD19` | **`PD21`** | `PE5` | `PE5` |
| 16 | `PE0` | `PE0` | `PE6` | `PE6` |
| 17 | `PE1` | `PE1` | `PE7` | `PE7` |
| 18 | `PE2` | `PE2` | `PE8` | `PE8` |
| 19 | `PE3` | `PE3` | `PE9` | `PE9` |
| 20 | `PE4` | `PE4` | `PE10` | `PE10` |

`3V3`、`5V`、`GND` 是电源脚，不是 GPIO。`GPADC` 是模拟输入脚，其通道、输入范围和基准电压请以 [原理图](download.md) 和 SoC 文档为准。

### 速查：按功能找引脚

| 需求 | 可用引脚 |
| --- | --- |
| 普通 GPIO | 任何带 `P` 前缀的脚（Function0 输入，Function1 输出） |
| 外部中断 | 所有 GPIO 的 Function14（`PD-EINTn` / `PE-EINTn` / `PB-EINTn`） |
| 模拟输入 | `GPADC` |
| 控制台串口 | 配套工程统一为 UART1（`PB0` TX / `PB1` RX），见 [板卡概览](overview.md#软件常见的引脚约定) |
| 显示输出 | `PD0`–`PD9`、`PD12`–`PD22` 及部分 `PE` 脚 |
| 红外接收 | `PD5` / `PD7` / `PD22` / `PE5` / `PE6` / `PB1` / `PB3`（IR-RX） |

---

## 引脚复用 (MUX)

下表中的「复用功能」是 SoC 在该引脚上**可以选择**的功能，同一时刻一个引脚只能选一种功能，在 Zephyr 设备树中通常通过 `ALLWINNER_PINMUX(port, num, mux)` 配置。

- **Function0 = 输入，Function1 = 输出**；
- Function11–13 保留；**外部中断 EINT 是 Function14**；
- 表中使用的是**实际 SoC GPIO 名**。

### 左侧排针

| 引脚 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10 | 外部中断（F14） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PD6` | LCD0-D10 | SPI1-CS1 | I2S0-MCLK | UART4-TX | PWM0-0 |  |  |  |  | PD-EINT6 |
| `PD7` | LCD0-D11 | IR-RX | I2S0-BCLK | UART4-RX | PWM0-1 |  |  |  |  | PD-EINT7 |
| `PD8` | LCD0-D12 | TWI1-SCK | I2S0-LRCK | UART4-RTS | PWM0-2 |  |  |  |  | PD-EINT8 |
| `PD9` | LCD0-D13 | TWI1-SDA | I2S0-DOUT0 | UART4-CTS | PWM0-3 | LCD0-VSYNC |  |  |  | PD-EINT9 |
| `PD12` | LCD0-D18 | LVDS0-D0P | DSI-D0P | UART3-RX | TWI0-SDA |  |  |  |  | PD-EINT12 |
| `PD13` | LCD0-D19 | LVDS0-D0N | DSI-D0N | UART2-TX |  |  |  |  |  | PD-EINT13 |
| `PD14` | LCD0-D20 | LVDS0-D1P | DSI-D1P | UART2-RX |  |  |  |  |  | PD-EINT14 |
| `PD15` | LCD0-D21 | LVDS0-D1N | DSI-D1N | UART2-RTS |  |  |  |  |  | PD-EINT15 |
| `PD16` | LCD0-D22 | LVDS0-D2P | DSI-CKP | UART2-CTS |  |  |  |  |  | PD-EINT16 |
| `PD17` | LCD0-D23 | LVDS0-D2N | DSI-CKN | UART5-TX |  |  |  |  |  | PD-EINT17 |
| `PD18` | LCD0-CLK | LVDS0-CKP | DSI-D2P | UART5-RX |  |  |  |  |  | PD-EINT18 |
| `PD19` | LCD0-HSYNC | LVDS0-CKN | DSI-D2N | UART5-RTS | UART4-TX |  |  |  |  | PD-EINT19 |
| `PD20` | LCD0-VSYNC | LVDS0-D3P | DSI-D3P | UART5-CTS | UART4-RX |  |  |  |  | PD-EINT20 |
| `PD21` | LCD0-DE | LVDS0-D3N | DSI-D3N | UART1-TX | UART4-RTS |  |  |  |  | PD-EINT21 |
| `PE0` |  | LCD0-D0 | TWI1-SCK | I2S0-MCLK | UART0-TX | CAN0_TX0 | SPI1-CS0/DBI-CSX | SDC2-D1 | CLK-FANOUT0 | PE-EINT0 |
| `PE1` |  | LCD0-D1 | TWI1-SDA | I2S0-BCLK | UART0-RX | CAN0_RX0 | SPI1-CLK/DBI-SCLK | SDC2-D0 |  | PE-EINT1 |
| `PE2` |  | LCD0-D8 | TWI0-SCK | I2S0-LRCK | UART4-TX | CAN1_TX0 | SPI1-MOSI/DBI-SDO | SDC2-CLK | PWM0-0 | PE-EINT2 |
| `PE3` |  | LCD0-D9 | TWI0-SDA | I2S0-DOUT0 | UART4-RX | CAN1_RX0 | SPI1-MISO/DBI-SDI/DBI-TE/DBI-DCX | SDC2-CMD | PWM0-1 | PE-EINT3 |
| `PE4` |  | LCD0-D16 | TWI2-SCK | I2S0-DIN0 | UART4-RTS | UART5-TX | SPI1-HOLD/DBI-DCX/DBI-WRX | SDC2-D3 | PWM0-2 | PE-EINT4 |

### 右侧排针

| 引脚 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10 | 外部中断（F14） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PD5` | LCD0-D7 | SPI1-WP/DBI-TE | UART2-CTS | IR-RX | TWI0-SDA |  |  |  |  | PD-EINT5 |
| `PD4` | LCD0-D6 | SPI1-HOLD/DBI-DCX/DBI-WRX | UART2-RTS | UART3-CTS | TWI0-SCK |  |  |  |  | PD-EINT4 |
| `PD3` | LCD0-D5 | SPI1-MISO/DBI-SDI/DBI-TE/DBI-DCX | UART2-RX | UART3-RTS | UART1-RX | RJTAG-CK |  |  |  | PD-EINT3 |
| `PD2` | LCD0-D4 | SPI1-MOSI/DBI-SDO | UART2-TX | TWI0-SDA | UART1-TX | RJTAG-DO |  |  |  | PD-EINT2 |
| `PD1` | LCD0-D3 | SPI1-CLK/DBI-SCLK | TWI1-SDA | UART3-RX | PWM0-0 | RJTAG-DI |  |  |  | PD-EINT1 |
| `PD0` | LCD0-D2 | SPI1-CS0/DBI-CSX | TWI1-SCK | UART3-TX | TWI0-SCK | RJTAG-MS |  |  |  | PD-EINT0 |
| `PD22` | OWA-OUT | IR-RX | PWM0-2 | UART1-RX | UART4-CTS |  |  |  |  | PD-EINT22 |
| `PB0` | BOOST1-PWM | TWI1-SCK | UART1-TX | UART2-RTS | CAN1_TX0 | PWM0-0 | SPIF0-CS1 |  |  | PB-EINT0 |
| `PB1` | BOOST1-FB | TWI1-SDA | UART1-RX | UART2-CTS | CAN1_RX0 | PWM0-1 | IR-RX |  |  | PB-EINT1 |
| `PB2` | BOOST0-PWM | TWI2-SCK | UART1-RTS | UART2-TX | CAN0_TX0 | PWM0-2 | SPI0-CS1 |  |  | PB-EINT2 |
| `PB3` | BOOST0-FB | TWI2-SDA | UART1-CTS | UART2-RX | CAN0_RX0 | PWM0-3 | IR-RX |  |  | PB-EINT3 |
| `GPADC` | | | | | | | | | | |
| `PE5` |  | LCD0-D17 | TWI2-SDA | IR-RX | UART4-CTS | UART5-RX | SPI1-WP/DBI-TE | SDC2-D2 | PWM0-3 | PE-EINT5 |
| `PE6` |  | UART2-TX | LCD0-D14 | CAN0_TX0 | OWA-OUT | IR-RX | SPI1-CS1 |  |  | PE-EINT6 |
| `PE7` |  | UART2-RX | LCD0-D15 | CAN0_RX0 |  |  | SPI1-CS0/DBI-CSX | CLK-FANOUT1 |  | PE-EINT7 |
| `PE8` |  | UART2-RTS | TWI0-SCK | CAN1_TX0 | UART3-TX | PWM0-0 | SPI1-CLK/DBI-SCLK | CLK-FANOUT2 |  | PE-EINT8 |
| `PE9` |  | UART2-CTS | TWI0-SDA | CAN1_RX0 | UART3-RX | PWM0-1 | SPI1-MOSI/DBI-SDO |  |  | PE-EINT9 |
| `PE10` |  | UART4-TX | TWI1-SCK | I2S0-MCLK | UART1-TX | PWM0-2 | SPI1-MISO/DBI-SDI/DBI-TE/DBI-DCX |  |  | PE-EINT10 |

---

## 常用外设引脚组合

下表给出从排针中凑出的完整外设信号组合（括号内为 MUX 功能编号），选用前请核对是否与 [YuzukiCube-M 底板占用引脚](../baseboard.md#占用的模块引脚) 冲突。

### UART

| 外设 | TX | RX | RTS | CTS | 备注 |
| --- | --- | --- | --- | --- | --- |
| UART0 | `PE0`（F6） | `PE1`（F6） |  |  | 基本串口对 |
| UART1 | `PB0`（F4） | `PB1`（F4） | `PB2`（F4） | `PB3`（F4） | 默认控制台使用 `PB0/PB1` |
| UART2 | `PD2`（F4） | `PD3`（F4） | `PD4`（F4） | `PD5`（F4） | `PE6` F3 / `PE7` F3 备选（底板蓝牙 HCI 使用 `PE6`–`PE9`） |
| UART3 | `PD0`（F5） | `PD1`（F5） | `PD3`（F5） | `PD4`（F5） | `PE8` F6 / `PE9` F6 备选 |
| UART4 | `PD6`（F5） | `PD7`（F5） | `PD8`（F5） | `PD9`（F5） | 底板 `CN2` 引出 `PD6/PD7`；`PE2`–`PE5` F6 备选 |
| UART5 | `PD17`（F5） | `PD18`（F5） | `PD19`（F5） | `PD20`（F5） | 避开编号较小的 PD 脚 |

### I²C（TWI）

| 外设 | SCK | SDA | 备注 |
| --- | --- | --- | --- |
| TWI0 | `PE2`（F4） | `PE3`（F4） | 也可用 `PD0` F6 SCK + `PD2` F5 SDA |
| TWI1 | `PD8`（F3） | `PD9`（F3） | 底板电容触摸使用 `PD0` F4 / `PD1` F4；`PE0` F4 / `PE1` F4 备选 |
| TWI2 | `PB2`（F3） | `PB3`（F3） | `PE4` F4 / `PE5` F4 备选 |

### SPI / I2S / CAN / PWM

| 外设 | 信号映射 | 备注 |
| --- | --- | --- |
| SPI1 | `PD0` CS0 / `PD1` CLK / `PD2` MOSI / `PD3` MISO / `PD4` HOLD / `PD5` WP / `PD6` CS1（均为 F3） | 可作 SPI 或 DBI；另有一组 PE 脚备选 |
| I2S0 | `PD6` MCLK / `PD7` BCLK / `PD8` LRCK / `PD9` DOUT0（F4）+ `PE4` DIN0（F5） | 装上 YuzukiCube-M 底板后与 Wi-Fi/UART4/DSI 冲突不可用 |
| CAN0 / CAN1 | CAN0：`PB2/PB3`（F6，底板 `U5` 已接）或 `PE0/PE1`（F7）；CAN1：`PE2/PE3`（F7）或 `PE8/PE9`（F5） | 需外置收发器与终端电阻 |
| PWM0 | CH0：`PB0`(F7)/`PD1`(F6)/`PD6`(F6)/`PE2`(F10)/`PE8`(F7)；CH1：`PB1`(F7)/`PD7`(F6)/`PE3`(F10)/`PE9`(F7)；CH2：`PD22`(F4，底板背光)/`PB2`(F7)/`PD8`(F6)/`PE4`(F10)/`PE10`(F7)；CH3：`PB3`(F7)/`PD9`(F6)/`PE5`(F10) | 每通道任选其一 |

### 注意事项与常见冲突

- 所有排针引脚均为 **3.3 V 逻辑**，同一时刻一个引脚只能选择一种复用功能。
- **显示与 DBI/SPI1 共用 `PD0`–`PD5`**，同一时刻只能二选一；在 YuzukiCube-M 底板上 `PD0`–`PD3` 已固定用于电容触摸。
- **I2S0 与 SDC2 共用 `PE0`–`PE4`**，且 `PE2` 在裸板 USB 主机模式下用于 VBUS 开关；在 YuzukiCube-M 底板上 `PE0`–`PE5` 已用于 AIC8800 Wi-Fi SDIO。
