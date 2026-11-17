---
title: 第 25 课：W25Q64 DMA 读写开发
---

# 第 25 课：W25Q64 DMA 读写开发

本课解析 `w25q64_dma_demo` 的源码与 DMA 配置要点。与轮询、中断两种 CPU 搬运 FIFO 的方式不同，DMA 模式启用了片上 **HDMA 控制器**直接代劳内存与 SPI5 FIFO 的数据搬运；同时工程底层配合 D-Cache 一致性维护与 Cache 行对齐跳板缓冲区，在多字节/整页读写时显著降低 CPU 占用（快速体验见 [一期第 14 课：W25Q64 DMA 读写](../p1-14-W25Q64-DMA读写/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/w25q64_dma_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 开启 CONFIG_SPI_HPM_SPI_DMA 与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # 使能 &hdma 与 i2c1 ssd1306@3c
│  └─ src/main.c                       # 同一份 Flash API + OLED 面板代码（标题自动切为 W25Q64 DMA）
├─ platform/drivers/display/oled_ui.c  # 共享 128x64 仪表盘 UI
├─ sdk_glue/drivers/spi/spi_hpmicro.c  # SPI DMA 收发调度与 Cache 同步实现
└─ sdk_glue/drivers/dma/dmav2_hpmicro.c # HPMicro HDMA 控制器驱动
```

## 配置与设备树解析

### 1. `prj.conf` 关键配置

```ini
CONFIG_SPI=y
CONFIG_FLASH=y
CONFIG_SPI_HPM_SPI_DMA=y
CONFIG_SPI_HPM_DMA_BUFFER_SIZE=512
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
```

- `CONFIG_SPI_HPM_SPI_DMA=y`：选中 HPM SPI DMA 传输路径，并由 Kconfig 依赖自动选中 Zephyr `CONFIG_DMA` 子系统；
- `CONFIG_SPI_HPM_DMA_BUFFER_SIZE=512`：设置每个 Cache 行对齐的 DMA 跳板缓冲区大小（遇到大于 512 字节的传输块时，驱动自动分段搬运）。

### 2. `boards/dshanmcu_hpm6e70.overlay` 必须开启 `&hdma`

对比前两课的 overlay，DMA 模式**必须额外使能 `&hdma` 设备树节点**，否则 `spi5` 引用的 DMA 通道初始化失败导致驱动无法就绪：

```dts
&dram {
	status = "okay";
};

/* 仅 DMA 模式需要：使能 SPI5 关联的 HDMA 控制器 */
&hdma {
	status = "okay";
};

&spi5 {
	status = "okay";
	...
};
```

## 源码解析与底层机制

### 1. 设备树 DMA 通道绑定与 Cache 行对齐跳板缓冲定义

在板级基础设备树 `platform/boards/hpmicro/dshanmcu_hpm6e70/dshanmcu_hpm6e70.dts` 中，`spi5` 节点已预先绑定好 `&hdma` 的通道 0（RX，DMAMUX 请求号 `30`）与通道 1（TX，请求号 `31`）：

```dts
spi5: spi@f01b4000 {
	compatible = "hpmicro,hpm-spi";
	/* ... */
	dmas = <&hdma 0 30>, <&hdma 1 31>;
	dma-names = "rx", "tx";
	status = "disabled";
};
```

当 `CONFIG_SPI_HPM_SPI_DMA=y` 时，`sdk_glue/drivers/spi/spi_hpmicro.c` 会展开两个关键实例化宏：为每个 SPI 实例生成按 `HPM_L1C_CACHELINE_SIZE` 对齐且向上取整的收发静态跳板缓冲区，并从 `DT_INST_DMAS_*` 提取控制器与通道号：

```c
#define SPI_DMA_BUFFERS(n)                                                 \
	static uint8_t spi_hpm_dma_tx_buf_##n[                             \
		ROUND_UP(CONFIG_SPI_HPM_DMA_BUFFER_SIZE,                   \
			 HPM_L1C_CACHELINE_SIZE)]                          \
		__aligned(HPM_L1C_CACHELINE_SIZE);                         \
	static uint8_t spi_hpm_dma_rx_buf_##n[                             \
		ROUND_UP(CONFIG_SPI_HPM_DMA_BUFFER_SIZE,                   \
			 HPM_L1C_CACHELINE_SIZE)]                          \
		__aligned(HPM_L1C_CACHELINE_SIZE)

#define SPI_DMA_CHANNELS(n)                                                \
	.dma_tx = {                                                        \
		.dma_dev = DEVICE_DT_GET(DT_INST_DMAS_CTLR_BY_NAME(n, tx)),\
		.channel = DT_INST_DMAS_CELL_BY_NAME(n, tx, channel),      \
		.dma_cfg = {                                               \
			.channel_direction = MEMORY_TO_PERIPHERAL,         \
			.dma_callback = spi_hpm_dma_callback,              \
			.source_data_size = 1,                             \
			.dest_data_size = 1,                               \
			.block_count = 1,                                  \
			.dma_slot = DT_INST_DMAS_CELL_BY_NAME(n, tx, source)\
		}                                                          \
	}, /* .dma_rx 结构相同，方向为 PERIPHERAL_TO_MEMORY */
```

在内核初始化函数 `spi_hpm_init()` 里会立刻检验 `device_is_ready(data->dma_tx.dma_dev)` 与 `dma_rx.dma_dev`。这就是前文 `.overlay` 中**必须添加 `&hdma { status = "okay"; };`** 的源码依据。

### 2. TX / RX DMA 通道描述符装载（`spi_hpm_dma_tx_load` & `rx_load`）

```c
static int spi_hpm_dma_tx_load(const struct device *dev, const uint8_t *buf, size_t len)
{
	const struct spi_hpm_config *cfg = dev->config;
	struct spi_hpm_data *data = dev->data;
	struct stream *stream = &data->dma_tx;
	struct dma_block_config *blk_cfg = &stream->dma_blk_cfg;

	memset(blk_cfg, 0, sizeof(struct dma_block_config));
	blk_cfg->source_address = (uint32_t)buf;
	blk_cfg->dest_address = (uint32_t)&(cfg->base->DATA);
	blk_cfg->block_size = len;

	stream->dma_cfg.channel_direction = MEMORY_TO_PERIPHERAL;
	blk_cfg->source_addr_adj = DMA_ADDR_ADJ_INCREMENT; /* 内存源地址递增 */
	blk_cfg->dest_addr_adj   = DMA_ADDR_ADJ_NO_CHANGE; /* 外设 DATA 寄存器地址固定 */
	stream->dma_cfg.source_burst_length = 1;           /* 每批 DMA 请求搬运 1 字节 */
	stream->dma_cfg.head_block = &stream->dma_blk_cfg;
	stream->dma_cfg.user_data = data;

	return dma_config(data->dma_tx.dma_dev, data->dma_tx.channel, &stream->dma_cfg);
}

static int spi_hpm_dma_rx_load(const struct device *dev, uint8_t *buf, size_t len)
{
	/* 与 TX 对称：source_address = &(cfg->base->DATA) 地址固定，
	 * dest_address = buf 地址递增，channel_direction = PERIPHERAL_TO_MEMORY */
	/* ... */
	return dma_config(data->dma_rx.dma_dev, data->dma_rx.channel, &stream->dma_cfg);
}
```

### 3. 分段跳板搬运、全双工布防顺序与 L1 D-Cache 一致性闭环（`transceive_dma`）

在开启 `CONFIG_DCACHE=y` 的 HPM6E70 上，HDMA 控制器直接读写物理 RAM 而**不会自动嗅探 CPU L1 D-Cache**；如果把应用栈上随便定义的 `uint8_t wbuf[256], rbuf[256]` 直接交给 DMA，不仅地址未按 Cache 行对齐，invalidate 时还可能误伤同 Cache 行里的其他局部变量！`transceive_dma()` 用“内部对齐跳板缓冲区 + 分段传输 + 三步 Cache 维护 + 严格启停顺序”彻底解决了这个问题：

```c
	/* 1. 提前拉低片选 cs-gpios，在多段 DMA 分包期间保持连续选中 Flash */
	spi_context_cs_control(&data->ctx, true);

	while (data->ctx.rx_len > 0 || data->ctx.tx_len > 0) {
		uint32_t expected_flags = 0U;
		data->status_flags = 0U;

		/* 按跳板缓冲大小 (512 B) 与硬件上限拆包；若同时收发则取 common_size 对齐 */
		tx_dma_size = MIN(data->ctx.tx_len, CONFIG_SPI_HPM_DMA_BUFFER_SIZE);
		rx_dma_size = MIN(data->ctx.rx_len, CONFIG_SPI_HPM_DMA_BUFFER_SIZE);
		/* ... common_size 对齐与 trans_mode 设置 ... */

		/* 2. RX 准备：先 Flush rx 跳板缓冲，避免脏 Cache 行后续写回覆盖 DMA 新数据 */
		if (use_rx) {
			if (l1c_dc_is_enabled()) {
				l1c_dc_flush((uint32_t)config->dma_rx_buf,
					     ROUND_UP(rx_dma_size, HPM_L1C_CACHELINE_SIZE));
			}
			ret = spi_hpm_dma_rx_load(dev, config->dma_rx_buf, rx_dma_size);
			expected_flags |= SPI_HPM_SPI_DMA_RX_DONE_FLAG;
		}

		/* 3. TX 准备：把用户缓冲拷贝进对齐跳板后 Writeback 刷入物理内存 */
		if (use_tx) {
			memcpy(config->dma_tx_buf, data->ctx.tx_buf, tx_dma_size);
			if (l1c_dc_is_enabled()) {
				l1c_dc_writeback((uint32_t)config->dma_tx_buf,
						 ROUND_UP(tx_dma_size, HPM_L1C_CACHELINE_SIZE));
			}
			ret = spi_hpm_dma_tx_load(dev, config->dma_tx_buf, tx_dma_size);
			expected_flags |= SPI_HPM_SPI_DMA_TX_DONE_FLAG;
		}

		/* 4. 严格顺序：先启动 RX DMA，再启动 TX DMA，最后才触发 SPI CMD！ */
		if (use_rx) { dma_start(data->dma_rx.dma_dev, data->dma_rx.channel); }
		if (use_tx) { dma_start(data->dma_tx.dma_dev, data->dma_tx.channel); }
		spi_setup_dma_transfer(base, &control_config, NULL, NULL,
				       tx_dma_size, rx_dma_size);

		/* 5. 睡眠等待回调收集 RX_DONE/TX_DONE，再忙等 SPIACTIVE 确认移位器彻底空闲 */
		ret = wait_dma_rx_tx_done(dev, expected_flags);
		do { status = base->STATUS; } while (status & SPI_STATUS_SPIACTIVE_MASK);
		spi_disable_dma(base, spi_tx_dma_enable | spi_rx_dma_enable);

		/* 6. RX 收尾：Invalidate 废弃旧 Cache 行后，再拷回应用用户的 rbuf */
		if (use_rx && (data->ctx.rx_buf != NULL)) {
			if (l1c_dc_is_enabled()) {
				l1c_dc_invalidate((uint32_t)config->dma_rx_buf,
						  ROUND_UP(rx_dma_size, HPM_L1C_CACHELINE_SIZE));
			}
			memcpy(data->ctx.rx_buf, config->dma_rx_buf, rx_dma_size);
		}
		spi_context_update_tx(&data->ctx, data->dfs, tx_dma_size);
		spi_context_update_rx(&data->ctx, data->dfs, rx_dma_size);
	}
```

传输完成时的中断唤醒路径由 `spi_hpm_dma_callback()` 与 `wait_dma_rx_tx_done()` 配合完成：

```c
static void spi_hpm_dma_callback(const struct device *dev, void *arg,
				 uint32_t channel, int status)
{
	struct spi_hpm_data *data = arg;

	if (status != 0) {
		data->status_flags |= SPI_HPM_SPI_DMA_ERROR_FLAG;
	} else if (channel == data->dma_tx.channel) {
		data->status_flags |= SPI_HPM_SPI_DMA_TX_DONE_FLAG;
	} else if (channel == data->dma_rx.channel) {
		data->status_flags |= SPI_HPM_SPI_DMA_RX_DONE_FLAG;
	}
	spi_context_complete(&data->ctx, dev, 0);
}
```

- **全双工防丢字节关键细节**：为什么必须**先 `dma_start(RX)` 再 `dma_start(TX)`，最后写 SPI 控制器发起 `spi_setup_dma_transfer()`**？因为双通道启动瞬间外设请求尚未拉起、DMA 只处在就绪等待状态；一旦 SPI 开始发送第一个字节，第一个响应字节在几个时钟后就会到达 RX FIFO，必须确保 RX DMA 通路已在原地守候；
- **业务层零感知体验**：正因为驱动在底层完成了 Cache 行对齐与三步同步维护，`applications/w25q64_dma_demo/src/main.c` 里的普通栈上数组 `uint8_t wbuf[256], rbuf[256]` 无需添加任何 `__aligned` 或手工调用 Cache API，照样安全无误，且条件编译自动切出 `"W25Q64 DMA"` OLED 标题。

### 4. 三种 SPI 传输模式（第 23～25 课）工程对比总结

| 对比维度 | 第 23 课 · Polling（轮询） | 第 24 课 · Interrupt（FIFO 中断） | 第 25 课 · DMA（HDMA 搬运） |
| --- | --- | --- | --- |
| **Kconfig 开关** | `CONFIG_SPI_HPM_SPI_POLLING=y` | `CONFIG_SPI_HPM_SPI_INTERRUPT=y` | `CONFIG_SPI_HPM_SPI_DMA=y` |
| **设备树要求** | 仅需 `&spi5` | 仅需 `&spi5` | 需 `&spi5` 的 `dmas` + 开启 `&hdma` |
| **CPU 占用与调度** | 阻塞死等 FIFO，不让出 CPU | FIFO 间隙通过信号量让出 CPU | 整段传输让出 CPU，仅包尾进一次回调 |
| **D-Cache / 内存开销** | 无额外开销 | 无额外开销 | 需 2 份 `512 B` Cache 行对齐跳板缓冲与同步 |
| **典型适用场景** | 短字节探针、极简低延迟命令 | 中等数据量、需要同时调度其他线程 | 大块扇区/整页读写、图像/音频流刷写 |

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\w25q64_dma_demo -d build\w25q64_dma_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M12** 已插好 W25Q64 模块（建议顺手拔除 **M6 超声波模块**以免片选翻转连带触发发波），执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\w25q64_dma_demo
```

烧录校验完成后，串口（`115200 8-N-1`）确认 `SPI transfer mode: dma` 且每次擦写校验均输出 `OK`：

```text
W25Q64 demo: coreboard + spi nor flash
SPI transfer mode: dma
SDRAM quick check PASSED (32 MiB)
probe: MISO samples = 00 EF 40 17 00 00 00 00
flash: erase+write+read OK (seq=0, 256 bytes, data=57563400...)
```

---

[上一课：W25Q64 中断读写开发](../p2-24-W25Q64中断读写开发/README.md) · [下一阶段：三期第 1 课](../p3-01-搭建SDK-Glue工作区/README.md) · [课程目录](../README.md)
