---
title: 第 24 课：W25Q64 中断读写开发
---

# 第 24 课：W25Q64 中断读写开发

本课解析 `w25q64_interrupt_demo` 的源码工程。应用层源码（`src/main.c`）和设备树与第 23 课保持完全一致，**仅通过切换 `prj.conf` 中的 SPI 传输模式开关**，就能把底层传输从 CPU 阻塞轮询无缝切换为 **FIFO 中断驱动**（快速体验见 [一期第 13 课：W25Q64 中断读写](../p1-13-W25Q64中断读写/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/w25q64_interrupt_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # 将传输模式改为 CONFIG_SPI_HPM_SPI_INTERRUPT=y（保留 DSHAN_OLED_UI）
│  ├─ boards/dshanmcu_hpm6e70.overlay  # 与轮询模式相同（spi5 + jedec,spi-nor + i2c1 ssd1306@3c）
│  └─ src/main.c                       # 同一份通用 Flash/SPI + OLED 状态徽章代码
└─ sdk_glue/drivers/spi/spi_hpmicro.c  # 根据 CONFIG_SPI_HPM_SPI_INTERRUPT 编译中断路径
```

## 配置与驱动解耦

### 1. Kconfig 模式切换（`prj.conf`）

对比第 23 课唯一变化在于传输选项：

```ini
CONFIG_SPI=y
CONFIG_FLASH=y
CONFIG_SPI_HPM_SPI_INTERRUPT=y
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
```

### 2. 应用层零业务代码改动（`src/main.c`）

`applications/w25q64_interrupt_demo/src/main.c` 只通过条件编译宏读取当前生效的传输模式名用于日志与 OLED 黄区标题（`W25Q64 IRQ`）：

```c
#if defined(CONFIG_SPI_HPM_SPI_DMA)
#define SPI_TRANSFER_MODE_NAME "dma"
#define OLED_MODE_TITLE        "W25Q64 DMA"
#elif defined(CONFIG_SPI_HPM_SPI_INTERRUPT)
#define SPI_TRANSFER_MODE_NAME "interrupt"
#define OLED_MODE_TITLE        "W25Q64 IRQ"
#else
#define SPI_TRANSFER_MODE_NAME "polling"
#define OLED_MODE_TITLE        "W25Q64 POLL"
#endif
```

从 `spi_jedec_probe()` 到 `flash_erase()` / `flash_write()` / `flash_read()` 的所有业务代码与第 23 课完全一致，充分体现了 Zephyr 将总线传输机制封装在驱动与 Kconfig 中的解耦优势。

## 源码解析（`sdk_glue/drivers/spi/spi_hpmicro.c` 中断状态机）

### 1. 轮询模式与 FIFO 中断模式的线程调度差异

当关闭 DMA 且未开启中断选项时，上层调用 `spi_hpm_transceive()` 进入 `transceive()`；在启动传输后 `transceive()` 会阻塞在 `spi_context_wait_for_completion(&data->ctx)`（其内部为内核信号量 `k_sem`）：

```c
static int transceive(const struct device *dev, const struct spi_config *spi_cfg,
		      const struct spi_buf_set *tx_bufs, const struct spi_buf_set *rx_bufs,
		      bool asynchronous, spi_callback_t cb, void *userdata)
{
	/* 1. 抢锁并调用 spi_hpm_configure() 复位 FIFO 与配置时钟/模式 */
	spi_context_lock(&data->ctx, asynchronous, cb, userdata, spi_cfg);
	ret = spi_hpm_configure(dev, spi_cfg);
	/* ... */
	/* 2. 整理多段 tx/rx 描述符并拉低 cs-gpios */
	spi_context_buffers_setup(&data->ctx, tx_bufs, rx_bufs, data->dfs);
	spi_context_cs_control(&data->ctx, true);

	/* 3. 启动第一段数据包：中断模式下该函数配置完 IRQ/CMD 即刻返回！ */
	spi_hpm_transfer_next_packet(dev);

	/* 4. 挂起当前线程等待信号量，期间 Zephyr 可调度其他就绪线程运行 */
	ret = spi_context_wait_for_completion(&data->ctx);
out:
	spi_context_release(&data->ctx, ret);
	return ret;
}
```

- 与第 23 课直接在 `spi_hpm_transfer_next_packet()` 内部死等 `spi_transfer()` 不同，在 `CONFIG_SPI_HPM_SPI_INTERRUPT=y` 下，函数启动完硬件传送便立即返回到 `spi_context_wait_for_completion()` 睡眠让出 CPU，后续所有字节搬运全部交由 `SPI5` 中断服务程序 `spi_hpm_isr()` 异步推进。

### 2. 写 `CMD` 前的 TX FIFO 预填充与阈值中断配置

在 `spi_hpm_transfer_next_packet()` 的 `#if SPI_HPM_INTERRUPT_DRIVEN` 分支中，有一处极其关键的硬件时序控制：

```c
#if SPI_HPM_INTERRUPT_DRIVEN
	uint32_t irq_mask = spi_end_int;

	data->tx_buf = ctx->tx_buf;
	data->rx_buf = (uint8_t *) ctx->rx_buf;
	data->tx_remaining = tx_size;
	data->rx_remaining = rx_size;
	stat = spi_control_init(base, &control_config, tx_size, rx_size);
	/* ... 错误检查 ... */

	/* 关键：在写 CMD 寄存器启动控制器前，先把首批发送字节预填进 TX FIFO！
	 * 否则控制器启动第一拍发现 TX FIFO 为空，会发出硬件填充字节并导致后续全部响应错位。 */
	if (data->tx_remaining > 0U) {
		stat = spi_hpm_fill_tx_fifo(base, data);
		if (stat != status_success) {
			spi_hpm_interrupt_fail(dev, -EIO);
			return;
		}
	}

	spi_set_tx_fifo_threshold(base, SPI_SOC_FIFO_DEPTH - 1U);
	spi_set_rx_fifo_threshold(base, 1U);
	if (data->tx_remaining > 0U) {
		irq_mask |= spi_tx_fifo_threshold_int;
	}
	if (data->rx_remaining > 0U) {
		irq_mask |= spi_rx_fifo_threshold_int;
	}
	spi_clear_interrupt_status(base,
				   spi_end_int | spi_rx_fifo_threshold_int |
				   spi_tx_fifo_threshold_int);
	spi_enable_interrupt(base, irq_mask);

	/* 一切就绪后再写 CMD 寄存器真正触发 SCK 时钟与传送 */
	stat = spi_write_command(base, spi_master_mode, &control_config, NULL);
	/* ... */
#endif
```

- **为什么要“先灌 TX FIFO、后写 CMD”**：对于 `256 B` 页编程等大于硬件 FIFO 深度的写操作，在启动控制器那一微秒若 TX FIFO 还是空的，硬件会先把总线上的默认占位字节推走并产生整帧字节错位（就像日志中观察到的 `00 00 EF 40 17` 滞后现象）；预先喂满首轮 TX FIFO 并清中断使能后，再写 `CMD` 即可丝滑触发；
- 同时，对于长度大于硬件 FIFO 的剩余字节，则开启 `spi_tx_fifo_threshold_int`（TX FIFO 腾空即续填）与 `spi_rx_fifo_threshold_int`（RX FIFO 收到即取走）。

### 3. 中断服务程序 `spi_hpm_isr` 三阶段事件驱动

```c
static hpm_stat_t spi_hpm_fill_tx_fifo(SPI_Type *base, struct spi_hpm_data *data)
{
	while ((data->tx_remaining > 0U) &&
	       (spi_get_tx_fifo_valid_data_size(base) < SPI_SOC_FIFO_DEPTH)) {
		hpm_stat_t stat = spi_write_data(base, data->dfs,
					     (uint8_t *)data->tx_buf, 1U);
		if (stat != status_success) { return stat; }
		data->tx_buf += data->dfs;
		data->tx_remaining--;
	}
	return status_success;
}

static hpm_stat_t spi_hpm_drain_rx_fifo(SPI_Type *base, struct spi_hpm_data *data)
{
	while ((data->rx_remaining > 0U) &&
	       (spi_get_rx_fifo_valid_data_size(base) > 0U)) {
		hpm_stat_t stat = spi_read_data(base, data->dfs, data->rx_buf, 1U);
		if (stat != status_success) { return stat; }
		data->rx_buf += data->dfs;
		data->rx_remaining--;
	}
	return status_success;
}

__attribute__((section(".isr"))) static void spi_hpm_isr(const struct device *dev)
{
	const struct spi_hpm_config *config = dev->config;
	SPI_Type *base = config->base;
	struct spi_hpm_data *data = dev->data;
	volatile uint32_t irq_status = spi_get_interrupt_status(base);
	hpm_stat_t stat;

	if (irq_status & spi_rx_fifo_threshold_int) {
		stat = spi_hpm_drain_rx_fifo(base, data);
		spi_clear_interrupt_status(base, spi_rx_fifo_threshold_int);
		/* ... 失败调用 spi_hpm_interrupt_fail() ... */
		if (data->rx_remaining == 0U) {
			spi_disable_interrupt(base, spi_rx_fifo_threshold_int);
		}
	}

	if (irq_status & spi_tx_fifo_threshold_int) {
		stat = spi_hpm_fill_tx_fifo(base, data);
		spi_clear_interrupt_status(base, spi_tx_fifo_threshold_int);
		if (data->tx_remaining == 0U) {
			spi_disable_interrupt(base, spi_tx_fifo_threshold_int);
		}
	}

	if (irq_status & spi_end_int) {
		/* END 中断到达时，RX FIFO 里往往还有最后几个刚移入的尾字节未抽干！ */
		stat = spi_hpm_drain_rx_fifo(base, data);
		spi_disable_interrupt(base,
				      spi_end_int | spi_rx_fifo_threshold_int |
				      spi_tx_fifo_threshold_int);
		spi_clear_interrupt_status(base,
				   spi_end_int | spi_rx_fifo_threshold_int |
				   spi_tx_fifo_threshold_int);
		if ((stat != status_success) || (data->tx_remaining != 0U) ||
		    (data->rx_remaining != 0U)) {
			spi_hpm_interrupt_fail(dev, -EIO);
			return;
		}
		spi_hpm_master_transfer_callback(base, data);
	}
}
```

- **精确的关断与收尾顺序**：当 `tx_remaining` 减到 `0` 时立刻关掉 `spi_tx_fifo_threshold_int`（避免 FIFO 空后反复进空中断）；等整个 SPI 传输结束触发 `spi_end_int` 时，务必先调用 `spi_hpm_drain_rx_fifo()` 把尾字节收干净、再关断和清除全部中断标志，最后由 `spi_hpm_master_transfer_callback()` 推进下一段缓冲并在全部完成后通过 `spi_context_complete()` 唤醒等待信号量的业务线程。

## 编译步骤（`west build`）

注意切换工程或修改 Kconfig 传输选项后，使用独立的构建目录 `-d build\w25q64_interrupt_demo` 并保留 `-p always`：

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\w25q64_interrupt_demo -d build\w25q64_interrupt_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M12** 已插好 W25Q64 模块（建议顺手拔除 **M6 超声波模块**以免片选翻转连带触发发波），执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\w25q64_interrupt_demo
```

烧录校验完成后，串口（`115200 8-N-1`）首部应确认 `SPI transfer mode: interrupt`，且擦写读写校验持续通过：

```text
W25Q64 demo: coreboard + spi nor flash
SPI transfer mode: interrupt
SDRAM quick check PASSED (32 MiB)
probe: MISO samples = 00 EF 40 17 00 00 00 00
flash: erase+write+read OK (seq=0, 256 bytes, data=57563400...)
```

---

[上一课：W25Q64 轮询读写开发](../p2-23-W25Q64轮询读写开发/README.md) · [下一课：W25Q64 DMA 读写开发](../p2-25-W25Q64-DMA读写开发/README.md) · [课程目录](../README.md)
