---
title: 第 7 课：使用 Kconfig 与 CMake 注册驱动
---

# 第 7 课：使用 Kconfig 与 CMake 注册驱动

设备树已经能描述 HC-SR04，但构建系统还没有任何规则指向驱动源文件。把 `hc_sr04.c` 放进 `drivers/` 并不足以让它进入固件：Kconfig 负责决定功能是否启用，CMake 负责决定启用后编译哪些文件。

本课先建立注册关系，并放入一个可编译的占位源文件。下一课再把占位内容替换为完整驱动。

## 工程怎样作为 Zephyr Module 加载

打开工程根目录的 `zephyr/module.yml`，其中的关键配置是：

```yaml
# Zephyr 用这个名称识别当前树外模块。
name: dshanmcu
build:
  # 自定义驱动从 drivers/ 进入 CMake，从根 Kconfig 进入配置系统。
  cmake: drivers
  kconfig: Kconfig
  settings:
    # Binding 和 Board 都从当前模块根目录继续查找。
    dts_root: .
    board_root: .
```

west 构建时把工程根目录识别为名为 `dshanmcu` 的 Zephyr Module：

| 配置 | 交给 Zephyr 的入口 |
| --- | --- |
| `cmake: drivers` | 从 `drivers/CMakeLists.txt` 进入自定义驱动构建 |
| `kconfig: Kconfig` | 从根目录 `Kconfig` 进入自定义配置 |
| `dts_root: .` | 在本工程 `dts/bindings/` 中查找 Binding |
| `board_root: .` | 在本工程 `boards/` 中查找开发板 |

这套入口与具体应用无关，因此 `apps/` 下的多个 Demo 都可以使用同一份驱动。不要在 `apps/hc_sr04_demo/CMakeLists.txt` 中直接写入 `../../drivers/sensor/hc_sr04/hc_sr04.c`，否则其他应用无法按同样方式复用驱动。

## 创建驱动目录

在工程根目录下创建：

```text
drivers/
└─ sensor/
   └─ hc_sr04/
      ├─ CMakeLists.txt
      ├─ Kconfig
      └─ hc_sr04.c
```

目录使用 `sensor`，是因为驱动最终实现 Zephyr 的传感器接口；`hc_sr04` 只保存该设备自己的构建文件和源码。

## 定义 Kconfig 选项

新建 `drivers/sensor/hc_sr04/Kconfig`：

```kconfig
config DSHAN_HC_SR04
	bool "DshanMCU HC-SR04 ultrasonic distance sensor"
	# 节点存在时默认启用，也允许应用在 prj.conf 中显式选择。
	default y
	# 没有状态为 okay 的匹配节点时，不提供本驱动选项。
	depends on DT_HAS_DSHAN_HC_SR04_ENABLED
	# 驱动操作 GPIO，并向应用提供 Zephyr sensor API。
	select GPIO
	select SENSOR
	help
	  Enable driver for the HC-SR04 ultrasonic distance sensor
	  (devicetree compatible "dshan,hc-sr04"). The driver measures the
	  echo pulse width with GPIO timing and reports the distance in
	  meters through the standard sensor API (SENSOR_CHAN_DISTANCE).
```

`DT_HAS_DSHAN_HC_SR04_ENABLED` 由设备树构建过程生成，含义是至少存在一个 `compatible = "dshan,hc-sr04"` 且状态为 `okay` 的节点。`depends on` 把驱动配置与真实节点联系起来：没有启用的设备时，配置项不可选。

`select GPIO` 和 `select SENSOR` 表示这个驱动依赖 GPIO 子系统，并实现 sensor 子系统接口。选择 `DSHAN_HC_SR04` 时，两个依赖能力会一同启用。

在 `drivers/sensor/Kconfig` 中增加：

```kconfig
# 从 sensor 类别继续加载 HC-SR04 自己的配置项。
rsource "hc_sr04/Kconfig"
```

再确认 `drivers/Kconfig` 中包含：

```kconfig
# 让驱动总入口进入 sensor 类别。
rsource "sensor/Kconfig"
```

`rsource` 按当前 Kconfig 文件所在目录解析相对路径。根目录 `Kconfig`、`drivers/Kconfig`、`drivers/sensor/Kconfig` 和设备自己的 `Kconfig` 共同形成连续的加载关系。

## 用 CMake 选择源文件

新建 `drivers/sensor/hc_sr04/CMakeLists.txt`：

```cmake
# SPDX-License-Identifier: Apache-2.0

# 为本设备建立 Zephyr 驱动库，并把实现文件加入该库。
zephyr_library()
zephyr_library_sources(hc_sr04.c)
```

在 `drivers/sensor/CMakeLists.txt` 中增加：

```cmake
# 只有 Kconfig 最终启用驱动时，才进入 hc_sr04 子目录。
add_subdirectory_ifdef(CONFIG_DSHAN_HC_SR04 hc_sr04)
```

再确认 `drivers/CMakeLists.txt` 中包含：

```cmake
# 从驱动总入口进入 sensor 类别；设备开关在下一层判断。
add_subdirectory(sensor)
```

`add_subdirectory_ifdef()` 是构建开关。只有最终配置中 `CONFIG_DSHAN_HC_SR04=y` 时，CMake 才进入 `hc_sr04/`，随后 `zephyr_library_sources()` 才把 `hc_sr04.c` 加入编译。

如果这些文件原来已经包含其他驱动条目，只追加 HC-SR04 对应的一行，不要覆盖已有内容。

## 先放入可编译的占位源文件

新建 `drivers/sensor/hc_sr04/hc_sr04.c`：

```c
/* SPDX-License-Identifier: Apache-2.0 */

/* 下一课将在这里实现 HC-SR04 驱动。 */
```

占位文件没有创建设备，也不能测距。它只用于确认 Kconfig 和 CMake 已经能够找到正确路径，避免把“文件没有进入编译”和“驱动代码写错”混成同一个问题。

## 让应用选择驱动

打开 `apps/hc_sr04_demo/prj.conf`，在文件末尾增加：

```ini
# HC-SR04 驱动实现 Zephyr sensor API。
CONFIG_SENSOR=y
CONFIG_DSHAN_HC_SR04=y
```

Kconfig 中的 `default y` 已经会在节点启用时选择驱动，这里仍显式写出应用需要的能力。阅读 `prj.conf` 时可以直接看出该 Demo 依赖 HC-SR04 驱动；将来调整默认值也不会悄悄改变应用行为。

## 检查配置和编译输入

使用 VS Code 时，按下 `Ctrl+Shift+B` 打开 Demo 工具，先输入 `hc_sr04_demo` 前面的序号，再输入 `4` 选择「全量重建」。

使用终端时，在工程根目录执行：

```powershell
.\scripts\dev.ps1 rebuild hc_sr04_demo
```

打开 `build/hc_sr04_demo/zephyr/.config`，确认：

```ini
CONFIG_GPIO=y
CONFIG_SENSOR=y
CONFIG_DSHAN_HC_SR04=y
```

再在 `build/hc_sr04_demo/build.ninja` 中搜索 `hc_sr04.c`。能够找到该路径，说明 CMake 已经把源文件加入当前构建。此时文件内容仍是占位注释，所以固件中还没有 HC-SR04 设备实例。

如果 `.config` 中没有 `CONFIG_DSHAN_HC_SR04=y`，依次检查：

1. overlay 节点的 `compatible` 是否为 `dshan,hc-sr04`；
2. 节点是否写了 `status = "okay"`；
3. `drivers/sensor/Kconfig` 是否加载了设备 Kconfig；
4. `prj.conf` 是否拼错配置名称；
5. 是否执行了全量构建。

## 本课检查点

- 能说明 Kconfig 与 CMake 的不同职责；
- 工程的 Zephyr Module 入口能够到达 `drivers/`；
- `.config` 中三个相关配置均为 `y`；
- `build.ninja` 中可以找到 `hc_sr04.c`；
- 源文件目前仍是占位内容，还没有创建设备实例。

下一课将从 Binding 生成的 GPIO 信息建立驱动配置，实现初始化、触发测量、读取距离和设备注册。
