---
title: 第 22 课：红外发射与接收通信开发
---

# 第 22 课：红外发射与接收通信开发

本课解析 `ir_tx_rx_demo` 的源码架构。这是一个典型的**双自定义驱动 + 双并发工作线程**综合案例：发射端驱动基于 PWM3 输出 `38 kHz` 载波脉冲调制帧；接收端驱动在 GPIO 下降沿中断里按微秒脉宽解码并校验命令反码，再经 `k_msgq` 唤醒等待的接收线程（快速体验见 [一期第 11 课：红外发射与接收通信](../p1-11-红外发射与接收通信/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/ir_tx_rx_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启红外收发驱动、DISPLAY、SSD1306 与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # M4(PF26)/M8(PA09) + i2c1 ssd1306@3c
│  └─ src/main.c                       # tx_thread/rx_thread 经 k_mutex+k_sem 驱动主线程 OLED
└─ platform/
   ├─ include/dshan/
   │  ├─ ir_protocol.h                 # 教学红外帧格式与时间窗口阈值定义
   │  ├─ ir_transmitter.h              # 发射子系统 API：ir_transmitter_send_command()
   │  ├─ ir_receiver.h                 # 接收子系统 API：receive_command / stats_get / level_get
   │  └─ oled_ui.h                     # 共享 128x64 仪表盘 UI
   ├─ dts/bindings/infrared/
   │  ├─ dshan,ir-transmitter.yaml
   │  └─ dshan,ir-receiver.yaml
   ├─ drivers/display/oled_ui.c
   └─ drivers/infrared/
      ├─ transmitter/ir_transmitter.c  # PWM 38 kHz 载波发码驱动
      └─ receiver/ir_receiver.c        # 下降沿周期测宽 ISR + k_msgq 帧队列驱动
```

## 配置与设备树解析

### 1. `prj.conf` 与设备树

`applications/ir_tx_rx_demo/prj.conf` 核心配置：

```ini
CONFIG_GPIO=y
CONFIG_PWM=y
CONFIG_THREAD_NAME=y
CONFIG_DSHAN_IR_TRANSMITTER=y
CONFIG_DSHAN_IR_RECEIVER=y
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
```

`applications/ir_tx_rx_demo/boards/dshanmcu_hpm6e70.overlay`：

```dts
/ {
	ir_transmitter: ir-transmitter {
		compatible = "dshan,ir-transmitter";
		status = "okay";
		/* 38 kHz 载波：1 / 38000 ≈ 26316 ns */
		pwms = <&pwm3 2 26316 PWM_POLARITY_NORMAL>;
		duty-cycle-percent = <50>;
	};

	ir_receiver: ir-receiver {
		compatible = "dshan,ir-receiver";
		status = "okay";
		out-gpios = <&gpioa 9 (GPIO_ACTIVE_LOW | GPIO_PULL_UP)>;
	};
};
```

- 注意 `M4` 的 `PF26` 为 `PWM3_P_2`（`alt = 16`，同第 14 课蜂鸣器互斥，因此运行本示例时务必拔掉 M9）；
- 接收头（HS0038 等一体化解调器）检测到 38 kHz 载波时拉低，空闲上拉为高，所以配 `GPIO_ACTIVE_LOW | GPIO_PULL_UP`。

## 源码解析

### 1. 红外帧时序定义与 38 kHz 载波发码驱动（`ir_protocol.h` & `ir_transmitter.c`）

`platform/include/dshan/ir_protocol.h` 用脉宽区分引导码、逻辑 `0` 与逻辑 `1`：

```c
/* 教学用红外协议（空闲低、高脉宽调制载波）：
 *   引导码：2400 us 载波 + 1200 us 空闲（相邻下降沿间隔 ~3600 us）
 *   逻辑 0： 600 us 载波 +  600 us 空闲（下降沿间隔 ~1200 us）
 *   逻辑 1： 600 us 载波 + 1200 us 空闲（下降沿间隔 ~1800 us） */
#define IR_PROTOCOL_LEADER_INTERVAL_MIN_US 3000U
#define IR_PROTOCOL_LEADER_INTERVAL_MAX_US 4300U
#define IR_PROTOCOL_DATA_INTERVAL_MIN_US    900U
#define IR_PROTOCOL_ZERO_INTERVAL_MAX_US   1500U
#define IR_PROTOCOL_DATA_INTERVAL_MAX_US   2300U
```

发射驱动 `platform/drivers/infrared/transmitter/ir_transmitter.c` 按位控载波占空比与空窗时间：

```c
static int set_carrier(const struct ir_transmitter_config *config, bool enabled)
{
	uint32_t pulse_ns = enabled ?
		(uint32_t)(((uint64_t)config->pwm.period *
			    config->duty_cycle_percent) / 100U) : 0U;

	return pwm_set_dt(&config->pwm, config->pwm.period, pulse_ns);
}

static int send_symbol(const struct ir_transmitter_config *config,
		       uint32_t mark_us, uint32_t space_us)
{
	int ret = set_carrier(config, true);
	if (ret < 0) {
		return ret;
	}
	k_busy_wait(mark_us);

	ret = set_carrier(config, false);
	if (ret < 0) {
		return ret;
	}
	if (space_us != 0U) {
		k_busy_wait(space_us);
	}
	return 0;
}

static int ir_transmitter_send_command_impl(const struct device *dev, uint8_t command)
{
	const struct ir_transmitter_config *config = dev->config;
	struct ir_transmitter_data *data = dev->data;
	int ret;

	k_mutex_lock(&data->lock, K_FOREVER);

	ret = send_symbol(config, IR_PROTOCOL_LEADER_MARK_US, IR_PROTOCOL_LEADER_SPACE_US);
	if (ret == 0) { ret = send_byte(config, command); }
	if (ret == 0) { ret = send_byte(config, (uint8_t)~command); }
	if (ret == 0) { ret = send_symbol(config, IR_PROTOCOL_BIT_MARK_US, 0U); }

	/* 无论中间哪步失败，返回前都务必关闭 38 kHz 载波防止发射管常亮发热 */
	if (ret < 0) {
		(void)set_carrier(config, false);
	}
	k_mutex_unlock(&data->lock);
	return ret;
}
```

### 2. 下降沿时间差 ISR 状态机与无锁入队（`ir_receiver.c`）

一体化红外接收头（HS0038 等）只有在收到 `38 kHz` 载波时才会把 `PA09` 拉低。注意每个符号恰好从一段载波开始（对应一次下降沿）并以一段空闲结束（直到下一符号载波到来形成下一个下降沿），因此 **单靠连续两次下降沿之间的周期长度就能唯一区分引导码、`0` 与 `1`**，完全不需要双边沿中断：

```c
static void ir_receiver_gpio_isr(const struct device *port,
				 struct gpio_callback *cb,
				 gpio_port_pins_t pins)
{
	struct ir_receiver_data *data =
		CONTAINER_OF(cb, struct ir_receiver_data, gpio_cb);
	uint32_t now = k_cycle_get_32();
	uint32_t interval_us;
	uint8_t bit;

	ARG_UNUSED(port); ARG_UNUSED(pins);
	atomic_inc(&data->edge_count);

	if (!data->have_previous_edge) {
		data->previous_cycle = now;
		data->have_previous_edge = true;
		return;
	}

	interval_us = k_cyc_to_us_floor32(now - data->previous_cycle);
	data->previous_cycle = now;

	if (interval_in_range(interval_us, IR_PROTOCOL_LEADER_INTERVAL_MIN_US,
			      IR_PROTOCOL_LEADER_INTERVAL_MAX_US)) {
		data->frame_word = 0U;
		data->bit_count = 0U;
		data->receiving_frame = true;
		return;
	}

	if (!data->receiving_frame) {
		return;
	}

	if (interval_in_range(interval_us, IR_PROTOCOL_DATA_INTERVAL_MIN_US,
			      IR_PROTOCOL_ZERO_INTERVAL_MAX_US)) {
		bit = 0U;
	} else if (interval_in_range(interval_us, IR_PROTOCOL_ZERO_INTERVAL_MAX_US + 1U,
				     IR_PROTOCOL_DATA_INTERVAL_MAX_US)) {
		bit = 1U;
	} else {
		data->receiving_frame = false;
		atomic_inc(&data->invalid_frame_count);
		return;
	}

	data->frame_word = (uint16_t)((data->frame_word << 1) | bit);
	data->bit_count++;
	if (data->bit_count == IR_PROTOCOL_FRAME_BITS) {
		uint8_t command = (uint8_t)(data->frame_word >> 8);
		uint8_t inverse = (uint8_t)data->frame_word;

		data->receiving_frame = false;
		if (inverse != (uint8_t)~command) {
			atomic_inc(&data->invalid_frame_count);
			return;
		}
		if (k_msgq_put(data->frame_queue, &command, K_NO_WAIT) == 0) {
			atomic_inc(&data->valid_frame_count);
		} else {
			atomic_inc(&data->dropped_frame_count);
		}
	}
}
```

- **高分辨零分配解码**：ISR 内只读取 CPU 周期计数器 `k_cycle_get_32()` 并移位拼装 16 位 `frame_word`，校验 `(uint8_t)~command` 匹配后用 `k_msgq_put(..., K_NO_WAIT)` 把结果安全递给线程上下文的环形队列 `K_MSGQ_DEFINE(ir_receiver_queue_##inst, ...)`，各阶段统计计数使用 `atomic_inc()` 保证线程/中断并发安全。

### 3. 双工作线程编排与链路超时自检（`tx_thread` & `rx_thread`）

```c
	tx_tid = k_thread_create(&tx_thread_data, tx_stack,
				 K_THREAD_STACK_SIZEOF(tx_stack), tx_thread,
				 NULL, NULL, NULL, TX_THREAD_PRIORITY, 0, K_FOREVER);
	rx_tid = k_thread_create(&rx_thread_data, rx_stack,
				 K_THREAD_STACK_SIZEOF(rx_stack), rx_thread,
				 NULL, NULL, NULL, RX_THREAD_PRIORITY, 0, K_FOREVER);

	/* 先让更高优先级的接收线程进入消息队列阻塞等待，10 ms 后再启动发射线程 */
	k_thread_start(rx_tid);
	k_sleep(K_MSEC(10));
	k_thread_start(tx_tid);
```

- `rx_thread` 优先级（`4`）高于 `tx_thread`（`5`），并且采用 `K_FOREVER` 延迟启动策略：保证第 1 帧发射时接收线程已在 `ir_receiver_receive_command(ir_rx, &command, K_SECONDS(5))` 上做好准备；若光路被遮挡超过 5 秒超时，会调用 `ir_receiver_stats_get()` 把 `edges / valid / invalid / dropped` 计数器打印到串口，同时把 OLED 标题切换为 `"IR WAITING"`。

### 4. 多线程共享状态锁与主线程 OLED 聚合渲染（`ir_state_lock` + `ui_sem`）

```c
struct ir_ui_state {
	uint32_t tx_count;
	uint32_t rx_count;
	uint8_t last_tx_cmd;
	uint8_t last_rx_cmd;
	int32_t demo_value;
	bool link_ok;
};

static K_MUTEX_DEFINE(ir_state_lock);
static K_SEM_DEFINE(ui_sem, 0, 1);
```

- `tx_thread` 每发一帧、或 `rx_thread` 每收一帧/超时，均**不直接操作 OLED**（避免多个线程竞争字体缓冲区 `s_fb`），而是先锁 `ir_state_lock` 刷新 `g_ir_state` 再发信号量 `k_sem_give(&ui_sem)`；
- `main()` 主线程的 `render_ir_oled()` 在绘制前先把 `struct ir_ui_state st = g_ir_state;` 拷贝到局部栈变量后立刻解锁，彻底隔离互斥锁持有期与耗时 ~25 ms 的 I2C 刷屏操作。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\ir_tx_rx_demo -d build\ir_tx_rx_demo
```

## 烧录步骤与串口验证（`west flash`）

确认已插好 **M4 + M8** 且 **M9 蜂鸣器已拔掉**，执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\ir_tx_rx_demo
```

烧录校验完成后，在串口终端（`115200 8-N-1`）确认收发双向闭环：

```text
devices ready: TX=ir-transmitter, RX=ir-receiver, receiver active=0 (expected 0)
[TX] send #1: PING       command=0x01 check=0xFE
[RX] recv #1: PING       -> link OK, value=0
```

---

[上一课：红外对管避障检测开发](../p2-21-红外对管避障检测开发/README.md) · [下一课：W25Q64 轮询读写开发](../p2-23-W25Q64轮询读写开发/README.md) · [课程目录](../README.md)
