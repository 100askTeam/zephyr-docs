---
title: 第 21 课：红外对管避障检测开发
---

# 第 21 课：红外对管避障检测开发

本课解析 `ir_obstacle_demo` 的源码工程。我们把一个简单的红外比较器 GPIO 模块封装成了标准 Zephyr `sensor` 驱动（暴露 `SENSOR_CHAN_PROX` 通道并同时支持**轮询 fetch** 与 **`SENSOR_TRIG_NEAR_FAR` 中断触发器**），应用代码可以通过 overlay 开关无缝切换运行模式（快速体验见 [一期第 10 课：红外对管避障检测](../p1-10-红外对管避障检测/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/ir_obstacle_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 SENSOR、DSHAN_IR_OBSTACLE 与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # PA21 out-gpios + i2c1 ssd1306@3c
│  └─ src/main.c                       # 轮询或 trigger 回调唤醒主线程刷新 OLED 横幅
└─ platform/
   ├─ dts/bindings/sensor/dshan,ir-obstacle.yaml
   ├─ drivers/display/oled_ui.c        # 共享 128x64 仪表盘 UI
   └─ drivers/sensor/ir_obstacle/
      ├─ Kconfig                       # 定义 CONFIG_SENSOR_DSHAN_IR_OBSTACLE
      ├─ CMakeLists.txt
      └─ ir_obstacle.c                 # 标准 sensor API + GPIO 单边沿重装防抖触发器
```

## 配置与设备树解析

### 1. `prj.conf` 与设备树

`applications/ir_obstacle_demo/prj.conf` 核心配置：

```ini
CONFIG_GPIO=y
CONFIG_SENSOR=y
CONFIG_SENSOR_DSHAN_IR_OBSTACLE=y
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
CONFIG_SYSTEM_WORKQUEUE_STACK_SIZE=2048
```

`applications/ir_obstacle_demo/boards/dshanmcu_hpm6e70.overlay` 在保持 `PA21` `ir_obstacle` 节点的同时挂接 `&i2c1` + `ssd1306@3c`：

```dts
/ {
	ir_obstacle: ir-obstacle {
		compatible = "dshan,ir-obstacle";
		status = "okay";
		out-gpios = <&gpioa 21 GPIO_ACTIVE_LOW>;
		polling-mode;
		poll-interval-ms = <100>;
		debounce-interval-ms = <10>;
	};
};
```

- **有效电平反转**：检测到障碍物时模块拉低 `OUT`，所以配为 `GPIO_ACTIVE_LOW`；若使用高电平有效模块，只需改为 `GPIO_ACTIVE_HIGH`；
- **轮询 / 中断切换**：删除 `polling-mode;` 一行并加 `-p always` 重建后，应用自动通过 `#if !POLLING_MODE` 走 `sensor_trigger_set()` 中断路径；`debounce-interval-ms` 则决定中断后的延迟工作消抖窗口。

## 源码解析

### 1. 标准接近传感器通道实现（`platform/drivers/sensor/ir_obstacle/ir_obstacle.c`）

驱动把纯数字 GPIO 遮挡电平包装为符合 Zephyr 规范的 `SENSOR_CHAN_PROX`（接近传感器）设备，隐藏物理高低有效差异：

```c
static int ir_obstacle_sample_fetch(const struct device *dev,
				    enum sensor_channel chan)
{
	struct ir_obstacle_data *data = dev->data;
	int detected;
	int ret;

	if (chan != SENSOR_CHAN_ALL && chan != SENSOR_CHAN_PROX) {
		return -ENOTSUP;
	}

	ret = gpio_pin_get_dt(&((const struct ir_obstacle_config *)dev->config)->out);
	if (ret >= 0) {
		detected = ret;
		data->detected = detected;
		return 0;
	}
	return ret;
}

static int ir_obstacle_channel_get(const struct device *dev,
				   enum sensor_channel chan,
				   struct sensor_value *val)
{
	struct ir_obstacle_data *data = dev->data;

	if (chan != SENSOR_CHAN_PROX) {
		return -ENOTSUP;
	}

	val->val1 = data->detected;
	val->val2 = 0;
	return 0;
}
```

- 因为 `out-gpios` 配置了 `GPIO_ACTIVE_LOW`，Zephyr 的 `gpio_pin_get_dt()` 已自动按有效电平取反，因此“有遮挡（物理低电平）”时返回 `1`、“无遮挡（物理高电平）”时返回 `0`，应用层完全不必关心模块比较器的电性方向。

### 2. 单边沿交替重装触发器与工作队列消抖（`ir_obstacle_trigger_set` & ISR）

```c
static void ir_obstacle_trigger_work(struct k_work *work)
{
	struct k_work_delayable *delayable = k_work_delayable_from_work(work);
	struct ir_obstacle_data *data =
		CONTAINER_OF(delayable, struct ir_obstacle_data, trigger_work);
	int detected;
	int ret = ir_obstacle_read(data->dev, &detected);

	if (ret >= 0 && detected != data->detected) {
		data->detected = detected;
		if (data->trigger_handler != NULL) {
			data->trigger_handler(data->dev, data->trigger);
		}
	}

	if (data->trigger_handler != NULL) {
		(void)ir_obstacle_arm_next_edge(data->dev);
	}
}

static void ir_obstacle_gpio_isr(const struct device *port,
				 struct gpio_callback *cb,
				 gpio_port_pins_t pins)
{
	struct ir_obstacle_data *data =
		CONTAINER_OF(cb, struct ir_obstacle_data, gpio_cb);
	const struct ir_obstacle_config *config = data->dev->config;

	ARG_UNUSED(port); ARG_UNUSED(pins);

	(void)gpio_pin_interrupt_configure_dt(&config->out, GPIO_INT_DISABLE);
	(void)k_work_reschedule(&data->trigger_work,
				K_MSEC(config->debounce_interval_ms));
}
```

- **边沿抖动过滤逻辑**：当手缓慢靠近红外比较器临界阈值时，比较器输出可能快速震荡几个脉冲。ISR 第一时间关闭引脚中断并推迟 `debounce_interval_ms`（10 ms）执行工作项；如果 10 ms 后电平已经弹回原来的 `data->detected` 状态，`if (detected != data->detected)` 会直接忽略本次毛刺，只有真正完成状态翻转才通知上层 `trigger_handler`，随后调用 `ir_obstacle_arm_next_edge()` 把中断边沿切换为下一次离开/进入的反向边沿。

### 3. 编译期双模式复用与反白告警横幅（`applications/ir_obstacle_demo/src/main.c`）

```c
#define OBSTACLE_NODE    DT_NODELABEL(ir_obstacle)
#define POLLING_MODE     DT_PROP(OBSTACLE_NODE, polling_mode)
#define POLL_INTERVAL_MS DT_PROP(OBSTACLE_NODE, poll_interval_ms)

static int obstacle_read_and_report(bool changes_only)
{
	struct sensor_value proximity;
	int ret;

	ret = sensor_sample_fetch_chan(obstacle_dev, SENSOR_CHAN_PROX);
	if (ret < 0) {
		return ret;
	}
	ret = sensor_channel_get(obstacle_dev, SENSOR_CHAN_PROX, &proximity);
	if (ret < 0) {
		return ret;
	}

	if (!changes_only || proximity.val1 != last_obstacle_state) {
		bool was_detected = (last_obstacle_state > 0);
		bool now_detected = (proximity.val1 != 0);

		last_obstacle_state = proximity.val1;
		g_detected = now_detected;
		if (now_detected && !was_detected) {
			g_hit_count = g_hit_count + 1U;
		}
		printk("obstacle: %s (prox=%d)\n",
		       now_detected ? "DETECTED" : "CLEAR", proximity.val1);
		k_sem_give(&ui_sem);
	}
	return 0;
}
```

```c
static void render_obstacle_oled(bool detected, uint32_t hits, uint32_t tick)
{
	/* ... header + card ... */
	if (detected) {
		oled_ui_big_text_center(22, "DETECTED");
		oled_ui_invert_rect(8, 20, 112, 18);
	} else {
		oled_ui_rect(8, 20, 112, 18, true);
		oled_ui_big_text_center(22, "CLEAR");
	}
	oled_ui_text(8, 47, POLLING_MODE ? "Mode: Poll" : "Mode: IRQ", false);
	oled_ui_text_right(120, 47, hit_buf, false);
	(void)oled_ui_present();
}
```

- **上升沿计数与 `DETECTED` 反白效果**：只有在从“无遮挡”跳变为“有遮挡”（`now_detected && !was_detected`）时才把 `g_hit_count` 加一；遇到遮挡时先画大号 `"DETECTED"`，再调用 `oled_ui_invert_rect(8, 20, 112, 18)` 对该矩形区域按位异或反白，在蓝区形成一块非常醒目的高亮告警块，同时左下角自动标注当前运行的是 `Mode: Poll` 还是 `Mode: IRQ`。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\ir_obstacle_demo -d build\ir_obstacle_demo
```

## 烧录步骤与串口验证（`west flash`）

确认红外避障模块插在底板 **M5**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\ir_obstacle_demo
```

烧录校验完成后，串口（`115200 8-N-1`）在遮挡与移开时实时变化打印：

```text
infrared obstacle demo: Zephyr sensor driver
SDRAM quick check PASSED (32 MiB)
obstacle: CLEAR (prox=0)
Mode: polling every 100 ms; LED is the firmware heartbeat.
obstacle: DETECTED (prox=1)
```

---

[上一课：旋转编码器与按键开发](../p2-20-旋转编码器与按键开发/README.md) · [下一课：红外发射与接收通信开发](../p2-22-红外发射与接收通信开发/README.md) · [课程目录](../README.md)
