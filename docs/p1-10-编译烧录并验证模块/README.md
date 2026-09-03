---
title: 第 10 课：编译烧录并验证模块
---

# 第 10 课：编译烧录并验证模块

应用、设备树、Binding、Kconfig、CMake 和驱动已经全部写完。最后一次构建成功只能证明代码能够组成固件，还不能证明引脚配置、模块供电和测距结果正确。

本课从构建生成文件一直检查到串口距离。每一层只回答一个问题：Zephyr 最终看到了什么硬件、启用了什么代码、链接了什么实现，以及实物是否按预期工作。

## 先检查最终文件位置

开始构建前，工程中应存在：

```text
apps/hc_sr04_demo/
├─ boards/dshanmcu_hpm6e70.overlay
├─ src/main.c
├─ CMakeLists.txt
└─ prj.conf

dts/bindings/sensor/
└─ dshan,hc-sr04.yaml

drivers/sensor/
├─ CMakeLists.txt
├─ Kconfig
└─ hc_sr04/
   ├─ CMakeLists.txt
   ├─ Kconfig
   └─ hc_sr04.c
```

应用文件放在 `apps/hc_sr04_demo/`，可复用的 Binding 和驱动放在工程公共目录。另一个应用只要提供相同 compatible 的节点并启用配置，就可以使用同一驱动，不需要复制 `hc_sr04.c`。

## 执行一次全量构建

使用 VS Code 时，按下 `Ctrl+Shift+B` 打开 Demo 工具，先输入 `hc_sr04_demo` 前面的序号，再输入 `4` 选择「全量重建」。

使用终端时，在工程根目录执行：

```powershell
.\scripts\dev.ps1 rebuild hc_sr04_demo
```

使用 `rebuild` 是因为前几课改变了 Devicetree、Binding、Kconfig 和 CMake。全量构建会重新生成这些中间结果，避免旧缓存掩盖配置错误。

不要只根据终端文字颜色判断成功。以命令正常结束，并且以下文件重新生成作为构建成功的依据：

```text
build/hc_sr04_demo/zephyr/zephyr.dts
build/hc_sr04_demo/zephyr/.config
build/hc_sr04_demo/zephyr/zephyr.map
build/hc_sr04_demo/zephyr/zephyr.elf
build/hc_sr04_demo/zephyr/zephyr.hex
```

## 检查 Zephyr 最终看到的节点

PowerShell 中执行：

```powershell
Select-String `
  -Path .\build\hc_sr04_demo\zephyr\zephyr.dts `
  -Pattern "hc-sr04|trig-gpios|echo-gpios"
```

生成结果应表达以下内容：

```dts
hc_sr04_sensor: hc-sr04 {
	compatible = "dshan,hc-sr04";
	status = "okay";
	trig-gpios = < &gpiob 0x5 0x0 >;
	echo-gpios = < &gpioe 0x1 0x0 >;
};
```

这一步确认 overlay 已与公共开发板 DTS 合并。若引脚错误，回到应用 overlay 修改，不要编辑生成的 `zephyr.dts`。

## 检查最终 Kconfig

执行：

```powershell
Select-String `
  -Path .\build\hc_sr04_demo\zephyr\.config `
  -Pattern "^CONFIG_(GPIO|SENSOR|DSHAN_HC_SR04)=y$"
```

应找到三行：

```ini
CONFIG_GPIO=y
CONFIG_SENSOR=y
CONFIG_DSHAN_HC_SR04=y
```

`prj.conf` 是应用提出的配置要求，`.config` 是 Kconfig 合并依赖和开发板默认值后的最终结果。驱动是否进入 CMake 判断，取决于最终的 `CONFIG_DSHAN_HC_SR04`。

## 检查驱动是否参与链接

先在构建规则中检查源文件：

```powershell
Select-String `
  -Path .\build\hc_sr04_demo\build.ninja `
  -Pattern "drivers.sensor.hc_sr04|hc_sr04.c"
```

再在链接映射中检查驱动符号：

```powershell
Select-String `
  -Path .\build\hc_sr04_demo\zephyr\zephyr.map `
  -Pattern "hc_sr04_init|hc_sr04_sample_fetch|hc_sr04_channel_get"
```

`build.ninja` 中出现源文件说明 CMake 已安排编译；`zephyr.map` 中出现函数说明对象代码已经参与最终链接。只看到前者而没有后者时，要检查链接是否完成，以及代码是否因配置变化被移除。

## 断电连接模块

连接或拔下 HC-SR04 前先断开开发板电源。使用底板 M7 超声波模块插座时，按底板丝印确认方向：

| HC-SR04 引脚 | 连接目标 |
| --- | --- |
| VCC | 底板 M7 的电源端 |
| GND | 底板 M7 的地端 |
| TRIG | M7-2，最终到 HPM6E70 PB05 |
| ECHO | M7-3，最终到 HPM6E70 PE01 |

再次确认 ECHO 到 MCU 之间存在适合 3.3 V GPIO 的电平处理。若使用跳线而不是底板插座，应按所用模块的电气参数增加分压或电平转换。

完成连接后，再接通调试器、串口和开发板电源。VS Code Serial Monitor 使用 115200、8 数据位、无校验、1 停止位。

## 构建并烧录

使用 VS Code 时，按下 `Ctrl+Shift+B` 打开 Demo 工具，先输入 `hc_sr04_demo` 前面的序号，再输入 `2` 选择「构建并烧录」。

使用终端时，在工程根目录执行：

```powershell
.\scripts\dev.ps1 build-flash hc_sr04_demo
```

脚本会先对 `build/hc_sr04_demo/` 做一次增量构建，再烧录该目录中的固件。烧录前的构建可以避免把修改前的旧 HEX 写入开发板。

烧录结束后让开发板重新运行。按当前源码中的输出语句，正常启动时串口应依次包含以下几类信息；Zephyr 版本和实际距离数值会随环境变化：

```text
*** Booting Zephyr OS build ... ***
HC-SR04 demo: coreboard + ultrasonic sensor
SDRAM quick check PASSED (... MiB)
sensor: ... ready
Init complete. LED blinking, ranging every second.
distance: 25.14 cm
distance: 25.08 cm
```

不要把示例中的 `25.14 cm` 当作固定正确答案。真正需要观察的是：距离行大约每秒出现一次，把平整物体前后移动时数值随之改变，并且物体远离模块时数值总体增大。

## 分层判断串口结果

| 串口停在什么位置 | 已经证明什么 | 优先检查什么 |
| --- | --- | --- |
| 没有任何输出 | 尚未建立有效的控制台观察 | COM 端口、115200 参数、供电和烧录结果 |
| 只看到 Zephyr 启动信息 | 内核和控制台已运行，应用可能不是最新固件 | 构建时选择的应用、`build/active-app.txt` |
| `SDRAM quick check FAILED` | 已进入应用，但基础板初始化未通过 | SDRAM 配置和基础模板，不先判断超声波 |
| `hc-sr04 device not ready` | 设备对象存在，但驱动初始化失败 | GPIO 控制器状态、pinctrl、驱动初始化日志 |
| 持续显示 `no echo` | 驱动已运行，但没有检测到有效 ECHO 脉冲 | 模块供电、TRIG/ECHO 接线、电平处理和目标距离 |
| 距离数值变化 | 完整调用和信号路径已经工作 | 继续检查测量稳定性和合理性 |

一个错误信息只能证明程序执行到了相应检查位置。例如 `device not ready` 不是“应用找不到目录”，而是应用已经取得设备对象，设备初始化状态却没有通过。

## 用已知距离检查变化趋势

准备一块较平整、面积大于模块探头间距的物体，正对传感器移动。可以分别放在约 10 cm、20 cm、30 cm 的位置，每个位置观察多次输出。

记录时重点看三项：

1. 物体远离时，测量值是否总体增大；
2. 同一位置的连续数值是否处于相近范围；
3. 移开物体后，程序是否在超时后继续下一轮，而不是永久停止。

这一步验证信号方向、时间测量和应用循环是否一致。当前驱动使用固定 343 m/s 声速，并采用 1 μs 轮询计数，不能把结果当作校准后的精密仪器数据。

## 重新上电检查

保持模块连接，完全断开开发板电源后重新上电。无需再次烧录，程序仍应完成基础板检查、报告 sensor ready，并持续输出距离。

重新上电能够排除“程序只在调试器保持状态时工作”的情况，也确认固件已写入非易失存储。若复位后正常、断电后不能启动，应检查启动模式和实际烧录位置，而不是修改测距公式。

## 完成结果

通过本课后，工程中的关系应可以从文件和现象两边互相对应：

```text
M7/J4/PB05/PE01
    ↓ 写入
应用 overlay
    ↓ 由 Binding 检查
生成的设备树宏
    ↓ 驱动读取
HC-SR04 sensor 设备
    ↓ 应用通过 sensor API 调用
串口距离输出
```

后续增加其他模块时仍可沿用同一检查顺序：先确认硬件连接，再检查设备树和 Binding，然后检查 Kconfig、CMake、设备注册、应用调用，最后用生成文件和实物现象分别验证。

## 本课检查点

- 全量构建生成 DTS、配置、映射文件、ELF 和 HEX；
- 生成的 DTS 中引脚与实际连接一致；
- 最终 `.config` 已启用 GPIO、sensor 和 HC-SR04 驱动；
- 驱动源文件和关键符号已经参与链接；
- 串口能够区分初始化失败、无回波和有效距离；
- 重新上电后固件仍能运行并持续测量。
