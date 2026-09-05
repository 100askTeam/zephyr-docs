---
sidebar_position: 2
sidebar_label: 配套示例详解
title: 配套示例详解
slug: /ra6m5/reference/examples/
---

import Example from './Example';
import styles from './examples.module.css';

# 配套示例详解

工程的 `apps` 目录包含 9 个独立应用。按功能找到感兴趣的示例，点击对应条目，查看操作、运行结果和源码入口。第一次检查开发板，可以从 `board_bringup` 开始。

<nav className={styles.jumpNav} aria-label="示例功能分组">
  <a href="#control-input">基础控制与输入 <span>3</span></a>
  <a href="#storage-files">存储与文件系统 <span>4</span></a>
  <a href="#communication-display">通信与图形界面 <span>2</span></a>
</nav>

## 基础控制与输入 {#control-input}

<Example name="board_bringup" title="启动与 GPIO 控制" description="打印启动信息，让 D12 周期闪烁，确认程序已经在板上运行。" hardware="板载 LED · 无需外接模块" apis="设备树 led0、GPIO、printk、内核延时">

启动后，串口会打印 Zephyr 版本和板卡名称。D12 每隔 500 ms 翻转一次，亮、灭一个完整周期约为 1 秒。

按下 **RES**，启动信息会重新出现，LED 重新开始闪烁。通过串口输出与灯的变化，可以检查烧录、程序启动和 GPIO 控制是否正常。

应用通过设备树的 `led0` 找到 LED，并调用 Zephyr GPIO 接口。具体引脚由板卡设备树描述。

</Example>

<Example name="k2_button" title="按键事件与 LED 控制" description="每次按下 K2 翻转 D12，串口显示按下次数与持续时间。" hardware="板载 K2、D12" apis="自定义 GPIO 按键驱动、Input、消息队列、GPIO">

按下、松开 **K2**，观察以下结果：

| 操作 | 运行现象 |
| --- | --- |
| 按下 K2 | 次数加一，D12 翻转，输出 `K2 pressed count=...` |
| 松开 K2 | 输出本次按下持续的时间，LED 保持当前状态 |
| 保持约 1 秒后松开 | 与短按的输出比较，持续时间相应增加 |

工程中的 `dshan,gpio-button` 驱动负责 GPIO 中断和消抖，通过 Input 子系统上报事件；应用再处理计数、LED 和日志。

</Example>

<Example name="ir_remote" title="红外遥控按键识别" description="接收遥控器按键，输出名称、地址和命令，同时翻转 D12。" hardware="需 NEC / 扩展 NEC 遥控器" apis="GPIO 中断、红外输入驱动、Input、消息队列">

将遥控器对准板载 **IRM-H638** 接收器并按键。每个有效扫描事件都会使 D12 翻转一次，串口显示按键名称、地址、命令和扫描码。

应用预设了 20 个按键名称，包括电源、菜单和数字键。命令码不在对应表中时，名称显示为 `UNKNOWN`，但仍会输出地址、命令和扫描码。

当前驱动支持 NEC、扩展 NEC，忽略 NEC 重复帧。长按时不会持续重复上报，也不输出按键释放事件。

</Example>

## 存储与文件系统 {#storage-files}

<Example name="eeprom" title="EEPROM 读写与恢复" description="备份原数据，写入测试内容并校验，最后恢复原数据。" hardware="板载 AT24C02 · 256 字节" notice="临时改写最后 8 字节；等待恢复成功后再复位或断电。" apis="设备模型、EEPROM、I²C">

程序通过 I²C 访问地址为 `0x50` 的 AT24C02，每次启动自动完成一轮测试：

1. 查询容量，备份最后 8 字节，即 `0xF8～0xFF`。
2. 写入测试数据，读回比较。
3. 写回原数据，再次读取并校验。

| 串口结果 | 含义 |
| --- | --- |
| `Test pattern read-back passed` | 测试数据读回一致 |
| `Original EEPROM data restored` | 原数据恢复并通过校验 |
| `EEPROM test passed` | 完整测试通过 |

备份只保存在 RAM 中。中途掉电、复位或恢复失败，都可能使这 8 字节无法还原。应用调用标准 EEPROM 接口，底层驱动通过 I²C 操作芯片。

</Example>

<Example name="qspi_flash" title="Flash 扇区擦写" description="检查 Flash 信息，完成擦除、写入、读回和校验。" hardware="板载 W25Q64JV · 8 MiB" notice="会清除测试扇区，可能破坏此前保存的 LittleFS 文件系统。" apis="Flash、Flash Map、JEDEC ID、页布局查询">

启动后，串口显示容量、写入和擦除粒度、测试分区及 JEDEC ID。程序随后：

1. 擦除一个 4 KiB 扇区，并检查擦除结果。
2. 写入 256 字节测试数据，读回比较。
3. 重新擦空该扇区，成功时输出 `QSPI flash test passed`。

**实际擦除范围是芯片偏移 `0x007FE000～0x007FEFFF`，不备份、不恢复。** 正常结束时该扇区为空。它位于 `qspi_littlefs` 使用的整片 Flash 分区内，切换运行这两个应用时，不能保证原文件系统保留。

</Example>

<Example name="qspi_littlefs" title="文件读写与启动计数" description="将启动次数保存到文件中，重新上电后读取并累加。" hardware="板载 W25Q64JV · 8 MiB" notice="占用整片 Flash；没有有效文件系统或挂载失败时允许格式化。" apis="文件系统、LittleFS、设备树 fstab、Flash Map">

程序将 LittleFS 挂载到 `/lfs`，使用 `/lfs/boot_count.bin` 保存启动次数：

1. 显示空间信息，读取并校验原计数；没有文件时，从零开始。
2. 将计数加一，写入文件。
3. 卸载、重新挂载文件系统，再读取一次，确认数据已保存。

看到 `Persistent boot count: ...` 和 `QSPI LittleFS test passed` 后，按 RES 或重新上电，可以观察次数继续增加。

整个 8 MiB Flash 都划给 LittleFS，擦写位置由文件系统管理。当前配置允许挂载失败后格式化；已有计数文件若内容校验失败，程序会报错。运行 `qspi_flash` 会直接擦除这个文件系统范围内的扇区。

</Example>

<Example name="usb_msc_host" title="USB 移动存储读写" description="识别 U 盘或 USB 读卡器，列出文件并验证读写。" hardware="需 U 盘 / USB 读卡器" notice="介质需有文件系统；程序可能创建并保留 ZEPHYR.TXT。" apis="USB Host、MSC、Disk Access、FatFs、文件系统">

保持 Debug 与电脑连接，将 U 盘或插有 MicroSD 卡的 USB 读卡器接入 **J3 USB-A 接口，丝印为 USB HOST**。介质应已有 FAT、FAT32 或 exFAT 文件系统。

程序等待设备接入，识别磁盘，挂载到 `/USB:`，输出容量、剩余空间和根目录内容，再验证文件读写。

| 串口结果 | 含义 |
| --- | --- |
| `USB disk ready` | 磁盘已就绪 |
| `Mounted /USB:` | 文件系统已挂载 |
| `FAT read/write verification passed` | 文件验证通过 |

程序不格式化介质。没有 `ZEPHYR.TXT` 时，会创建并写入测试文字，文件会保留；已有同名文件时只读取比较、不覆盖，内容不符合预期会报告验证失败。

使用允许写入测试文件的介质，等待读写结束后，再拔出、重新插入，观察识别过程。

</Example>

## 通信与图形界面 {#communication-display}

<Example name="w800" title="无线扫描与网络通信" description="扫描周边 Wi-Fi、启动 BLE 广播，并在已有 IP 时测试网络通信。" hardware="板载 W800 · BLE 可用手机观察" notice="应用不设置 Wi-Fi 凭据、不主动连接路由器。" apis="Modem UART、设备模型、DNS、Socket offload">

RA6M5 通过 UART 与 W800 的 AT 固件通信。启动时复位模块、检查 AT 通道，再查询模式、MAC 地址和连接状态。

| 功能 | 可以观察到的结果 |
| --- | --- |
| Wi-Fi 扫描 | 接入点的 SSID、信号强度、信道和数量 |
| BLE 广播 | 串口显示名称、地址，手机 BLE 扫描工具可查找该设备 |
| 已获得 IP 时的网络测试 | ping 网关和 `www.baidu.com`，通过 Socket 请求 `example.com:80`，显示 HTTP 响应开头及接收字节数 |

查询状态时已获得 IP，才会先执行网络测试，再扫描 Wi-Fi、启动 BLE 广播。没有 IP 时会跳过网络测试，因此 `W800 Wi-Fi scan and BLE advertising test passed` 不表示 HTTP 请求一定执行过。

当前 Socket 适配支持一个 IPv4 TCP 客户端连接；BLE 部分用于广播验证。

</Example>

<Example name="lvgl_widgets_demo" title="图形界面与触摸操作" description="体验 LVGL 控件，通过触摸切换页面、调节实际背光亮度。" hardware="需配套 3.5 英寸触摸屏" apis="Display、SPI、I²C、Input、PWM、LVGL">

配套屏幕使用 **ST7796S** 显示控制器，分辨率为 320 × 480，通过 SPI 传输图像；**FT6336U** 触摸控制器通过 I²C 连接。

| 操作或观察位置 | 运行现象 |
| --- | --- |
| 程序启动 | 背光初始亮度为 80%，进入 LVGL 官方 widgets 示例 |
| 触摸页签 | 切换 `Profile`、`Analytics`、`Shop` 页面，操作控件 |
| `Profile` 中的 `Brightness` 滑条 | 在 5%～100% 范围内调节实际背光 |
| 串口 | 每隔 2 秒输出传输速率、刷新次数、错误次数和触摸事件数 |

当前触摸驱动处理第一个触点。程序将显示传输、触摸输入和 PWM 背光控制连接到 LVGL 界面。

</Example>

## 选择应用并运行

条目左侧的名称就是 `apps` 下的目录名，也是编译、烧录时使用的应用名称。每个应用分别生成固件；烧录另一个应用后，开发板会运行新程序。

| 应用中的文件 | 作用 |
| --- | --- |
| `CMakeLists.txt` | 应用的编译入口 |
| `prj.conf` | 启用需要的软件功能 |
| `src/main.c` | 应用逻辑 |
| `boards/dshan_ra6m5.overlay` | 部分应用用它补充设备树配置 |

具体操作见[编译、烧录与调试程序](../../00-学习准备/02-编译烧录与调试程序/README.md)。需要对照芯片接口和板载器件时，查看[RA6M5 芯片与硬件](../01-RA6M5芯片与硬件/README.md)。
