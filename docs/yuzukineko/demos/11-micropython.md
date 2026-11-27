---
title: MicroPython 脚本
description: 按步骤连接串口、烧录 11_micropython-full.img，通过串口 REPL 实测 MicroPython、F101 硬件扩展模块，以及可选 TF 卡 main.py 自启动。
---

import YuzukiBoardStage from '@site/src/components/YuzukiNekoHome/YuzukiBoardStage';
import FirmwareDownloadCard from '@site/src/components/FirmwareDownloadCard';
import SourceRefBar from '@site/src/components/SourceRefBar';

# MicroPython 脚本

在 YuzukiNeko 上直接运行交互式 **MicroPython REPL**，内置 `machine`、`zephyr` 与 F101 专属 `f101` 硬件模块（读取芯片 ID、调用 G2D 2D 加速器、音频输出）。**单板接串口即可体验**；插在底板带屏幕时，屏幕上还会同步显示复古黑底绿字控制台。

<SourceRefBar sourcePath="zephyr-components/micropython/micropython/ports/zephyr" to="/docs/yuzukineko/dev/zephyr/apps/micropython" />

## 第一步：准备硬件与串口终端

<YuzukiBoardStage defaultBoard="core" isHero={false} focusNodes={['usbc', 'sd']} />

1. 按 [连接开发板与串口](../start/01-hardware-and-uart.md) 接好 YuzukiNeko 与串口分线器（单板即可；若装在 YuzukiCube-M 底板并扣好 `FPC1` 排线，还能同时看到 1024×768 屏幕终端）。
2. 在电脑准备好交互式串口终端软件（推荐使用 **MobaXterm** 或 **PuTTY**，参数设为 115200 8N1；不建议用仅按行发送的简易串口助手）。

## 第二步：下载并烧录固件

<FirmwareDownloadCard filename="11_micropython-full.img" size="2.54 MiB" />

下载完成后，打开 **LYNX Imager**（全志 F101 → SPI NOR → 勾选主线 · SPI NOR），按住开发板正面 FEL 键重新上电后导入该镜像写入并等待自动重启。完整图文向导见 [烧录第一个体验固件](../start/02-flash-first-firmware.md)。

## 第三步：在串口 REPL 中分步体验

烧录重启后打开串口终端，敲一下回车键，看到 **`>>>`** 提示符即可逐段输入体验（接了底板屏幕时，屏幕同步滚动显示绿字）：

1. **读取 F101 芯片 128 位唯一 ID 与查看剩余内存**：

```python
import f101, gc
f101.unique_id().hex()
gc.mem_free()
```

2. **直接用 Python 控制 GPIO**：

```python
from machine import Pin
led = Pin(('gpiod', 5), Pin.OUT)
led.toggle()
```

3. **体验开机软复位（约 1 秒后重启）**：

```python
import machine
machine.reset()
```

## 第四步：配置 TF 卡运行开机脚本 `main.py`（可选）

如果想把脚本存到 TF 卡里让开发板通电自动跑，按下面步骤操作：

1. 将 TF 卡格式化为 **FAT32**（注意这里用 FAT32），在根目录新建 **`main.py`**（确认无 `.txt` 后缀），写入示例脚本：

```python
import time, f101
print("Hello from /sd/main.py! Chip ID:", f101.unique_id().hex())
for i in range(5):
    print("tick", i)
    time.sleep(1)
```

2. 核对 TF 卡根目录结构并插入 YuzukiNeko 正面右侧卡槽：

```text
TF 卡根目录/
└── main.py    # 开机由 _boot.py 挂载 /sd 后自动执行
```

3. 重新上电即可在串口（与底板屏幕）看到自动执行输出，脚本结束后自动落回 `>>>` REPL，可用 `import os; os.listdir('/sd')` 查看卡内文件。

## 常见问题排查

| 现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| 打开串口一片空白 | 启动横幅已输出完毕，正在等待输入 | 敲一下回车或按 `Ctrl + B` 呼出 `>>>`；若无反应核对波特率为 115200 8N1 |
| 敲字不回显或无法执行 | 误用了非交互式串口助手，或误按 `Ctrl + S` 暂停了流控 | 改用 MobaXterm / PuTTY 并关闭软件流控（XON/XOFF） |
| 无法挂载 `/sd` 或找不到 `main.py` | TF 卡未格式化为 FAT32 或文件名多了 `.txt` | 将 TF 卡重新格式化为 FAT32，确认根目录文件名严格为 `main.py` 后插卡重启 |

---

[上一项：LiteHTML 网页渲染](10-litehtml.md) · [下一项：Doom 毁灭战士](12-doom.md) · [应用总览](overview.md)
