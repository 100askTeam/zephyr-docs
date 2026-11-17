---
title: 第 23 课：W25Q64 轮询读写开发
---

# 第 23 课：W25Q64 轮询读写开发

本课解析 `w25q64_polling_demo` 的源码工程。应用复用 Zephyr 内置 `jedec,spi-nor` 驱动与标准 `<zephyr/drivers/flash.h>` 接口，并通过 Kconfig 选择最基础、确定性最高的 **Polling（轮询）** SPI 传输路径；源码内还附带了一套“底层 SPI 原始 JEDEC 探针 + 寄存器体检”调试方法供硬件排障学习（快速体验见 [一期第 12 课：W25Q64 轮询读写](../p1-12-W25Q64轮询读写/README.md)）。

## 源码位置与文件结构

```text
HPM6E70/
├─ applications/w25q64_polling_demo/
│  ├─ CMakeLists.txt
│  ├─ prj.conf                         # SPI / FLASH / POLLING 与 DSHAN_OLED_UI
│  ├─ boards/dshanmcu_hpm6e70.overlay  # spi5 + w25q64 + i2c1 ssd1306@3c
│  └─ src/main.c                       # 0x9F 探针 + 擦写校验 + OLED 状态徽章
├─ platform/drivers/display/oled_ui.c  # 共享 128x64 仪表盘 UI
├─ sdk_glue/drivers/spi/spi_hpmicro.c  # HPMicro SPI 控制器适配驱动（支持轮询/中断/DMA）
└─ zephyr/drivers/flash/spi_nor.c      # Zephyr 内置 JEDEC SPI NOR Flash 驱动
```

## 配置与设备树解析

### 1. `prj.conf` 与设备树

`applications/w25q64_polling_demo/prj.conf` 核心配置：

```ini
CONFIG_SPI=y
CONFIG_FLASH=y
CONFIG_SPI_HPM_SPI_POLLING=y
CONFIG_I2C=y
CONFIG_DISPLAY=y
CONFIG_SSD1306=y
CONFIG_DSHAN_OLED_UI=y
CONFIG_MAIN_STACK_SIZE=4096
```

`CONFIG_SPI_HPM_SPI_POLLING`、`CONFIG_SPI_HPM_SPI_INTERRUPT`、`CONFIG_SPI_HPM_SPI_DMA` 是 HPMicro SPI 驱动提供的互斥选择配置，同一个应用只能选其中一种（分别对应第 23、24、25 课）；同时 overlay 中在 `&i2c1` 挂接 `ssd1306@3c`（`PF12/PF13` 与 `SPI5 PB04~PB07` 完全独立）。

`applications/w25q64_polling_demo/boards/dshanmcu_hpm6e70.overlay`：

```dts
&spi5 {
	status = "okay";
	pinctrl-0 = <&pinmux_spi5>;
	pinctrl-names = "default";
	cs-gpios = <&gpiob 5 GPIO_ACTIVE_LOW>;

	w25q64: w25q64@0 {
		compatible = "jedec,spi-nor";
		reg = <0>;
		spi-max-frequency = <1000000>;
		jedec-id = [ef 40 17];
		size = <DT_SIZE_M(64)>;
	};
};
```

- `cs-gpios = <&gpiob 5 GPIO_ACTIVE_LOW>`：采用 Zephyr 标准 GPIO 软件片选控制 `PB05`（该脚与底板 M6 超声波 `Trig` 共线；若未拔除 M6，片选释放高电平会顺带触发超声波发波）；
- `jedec-id = [ef 40 17]`：`spi_nor` 驱动初始化时会读取芯片 ID 并逐字节核对，不匹配即拒绝就绪；`size = <DT_SIZE_M(64)>` 单位是 bit（`64 Mbit = 8 MiB`）。

## 源码解析

### 1. 绕过 Flash 驱动的原始 SPI `0x9F` 探针与寄存器诊断（`spi_jedec_probe`）

在把设备控制权交给高层 `jedec,spi-nor` 驱动之前，`applications/w25q64_polling_demo/src/main.c` 先直接走底层 `<zephyr/drivers/spi.h>` 手动发送 JEDEC Read ID 命令 `0x9F`，以便在硬件异常时快速区分究竟是 SPI 引脚通信问题还是 Flash 芯片/ID 配置问题：

```c
static void spi_jedec_probe(uint8_t jedec_id[3])
{
	const struct device *spi = DEVICE_DT_GET(DT_NODELABEL(spi5));
	const struct gpio_dt_spec cs = GPIO_DT_SPEC_GET(DT_NODELABEL(spi5), cs_gpios);
	struct spi_config cfg = { 0 };
	uint8_t tx[8] = { 0x9F, 0, 0, 0, 0, 0, 0, 0 };
	uint8_t rx[8] = { 0 };

	/* ... device_is_ready(spi) / gpio_is_ready_dt(&cs) 检查 ... */
	cfg.frequency = DT_PROP(FLASH_NODE, spi_max_frequency);
	cfg.operation = SPI_OP_MODE_MASTER | SPI_WORD_SET(8) | SPI_TRANSFER_MSB;
	cfg.cs = (struct spi_cs_control){ .gpio = cs, .delay = 0 };

	struct spi_buf txb = { .buf = tx, .len = sizeof(tx) };
	struct spi_buf_set tx_set = { .buffers = &txb, .count = 1 };
	struct spi_buf rxb = { .buf = rx, .len = sizeof(rx) };
	struct spi_buf_set rx_set = { .buffers = &rxb, .count = 1 };

	if (spi_transceive(spi, &cfg, &tx_set, &rx_set) != 0) {
		return;
	}
	if (jedec_id != NULL) {
		jedec_id[0] = rx[1];
		jedec_id[1] = rx[2];
		jedec_id[2] = rx[3];
	}
	printk("probe: MISO samples = %02X %02X %02X %02X %02X %02X %02X %02X\n",
	       rx[0], rx[1], rx[2], rx[3], rx[4], rx[5], rx[6], rx[7]);

	/* 直接回读 IOC PAD_CTL 寄存器，现场诊断 PB04/PB05/PB06/PB07 的复用与输入缓冲 */
	volatile uint32_t *ioc = (volatile uint32_t *)0xF4040000UL;
	uint32_t sclk = ioc[36 * 2], miso = ioc[38 * 2], mosi = ioc[39 * 2];
	uint32_t csn = ioc[37 * 2];
	printk("probe: clk(SPI5)=%u Hz\n", (unsigned)clock_get_frequency(clock_spi5));
	printk("probe: PB04=%08lX PB06=%08lX PB07=%08lX PB05=%08lX\n",
	       (unsigned long)sclk, (unsigned long)miso,
	       (unsigned long)mosi, (unsigned long)csn);
}
```

- **为什么 JEDEC ID 落在 `rx[1..3]` 而不是 `rx[0..2]`**：SPI 是全双工收发同步总线，主机发送命令字节 `tx[0] = 0x9F` 的同时就在采样 `MISO`（此时 Flash 才刚开始解码指令，因此 `rx[0]` 必定是无效占位字节 `0x00`），第 2～4 个时钟字节才依次移出厂商 ID `0xEF`（Winbond）、存储器类型 `0x40` 与容量编码 `0x17`（64 Mbit）；
- **寄存器级硬件自诊与持续探针循环**：如果 `MISO` 焊盘忘了开 `input-enable`，读回的 `ioc[38 * 2]`（`PB06` PAD_CTL）就能一目了然；当 `flash_init()` 返回 `NULL` 时，`main()` 会自动进入每 2 秒重测一次的探针循环并实时更新 OLED，用手按稳或微调模块插座就能立刻观察恢复情况。

### 2. NOR Flash 物理擦写特性与校验闭环（`flash_init` & `flash_test_once`）

```c
#define FLASH_NODE  DT_NODELABEL(w25q64)
#define TEST_OFFSET 0x0
#define TEST_SIZE   4096

static int flash_test_once(const struct device *dev, uint32_t seq)
{
	uint8_t wbuf[256];
	uint8_t rbuf[sizeof(wbuf)];
	int ret;

	wbuf[0] = 'W';
	wbuf[1] = '6';
	wbuf[2] = '4';
	wbuf[3] = (uint8_t)seq;
	for (size_t i = 4; i < sizeof(wbuf); i++) {
		wbuf[i] = (uint8_t)(seq * 7 + i);
	}

	/* 1. 写入前必须整扇区(4 KiB)擦除为全 0xFF */
	ret = flash_erase(dev, TEST_OFFSET, TEST_SIZE);
	if (ret != 0) {
		return ret;
	}
	/* 2. 写入 256 字节测试序列（不超过单页边界 256 B） */
	ret = flash_write(dev, TEST_OFFSET, wbuf, sizeof(wbuf));
	if (ret != 0) {
		return ret;
	}
	/* 3. 读回并与源缓冲逐字节对比 */
	ret = flash_read(dev, TEST_OFFSET, rbuf, sizeof(rbuf));
	if (ret != 0) {
		return ret;
	}
	if (memcmp(wbuf, rbuf, sizeof(wbuf)) != 0) {
		printk("ERROR: verify mismatch!\n");
		return -EIO;
	}
	return 0;
}
```

- **为什么不能跳过 `flash_erase()` 直接写**：SPI NOR Flash 的浮栅单元只能将比特 `1` 编程为 `0`，无法单独将 `0` 写回 `1`；若不先以最小擦除粒度（W25Q64 扇区大小为 `4096 B`，可由 `flash_get_page_info_by_idx()` 读出）擦成全 `0xFF`，下一轮写入新序列 `seq` 时旧比特为 `0` 的位将发生逻辑“线与”错误并引发 `memcmp` 失败。

### 3. 底层 HPM SPI 轮询传输路径剖析（`sdk_glue/drivers/spi/spi_hpmicro.c`）

`flash_read()` / `flash_write()` 与上面的 `spi_jedec_probe()` 最终都会落入 HPMicro SPI 驱动的 `spi_hpm_transceive()` -> `transceive()`：

```c
static int spi_hpm_configure(const struct device *dev,
			     const struct spi_config *spi_cfg)
{
	/* 每次事务均先清空 TX/RX FIFO，防止上一轮残留 RX 帧把响应整体右移 */
	spi_transmit_fifo_reset(base);
	spi_receive_fifo_reset(base);
	if (spi_context_configured(&data->ctx, spi_cfg)) {
		return 0;
	}
	/* ... 配时钟、字宽、CPOL/CPHA/LSB ... */
}

static void spi_hpm_transfer_next_packet(const struct device *dev)
{
	/* ... 拆包计算 tx_data / tx_size / rx_data / rx_size 及 trans_mode ... */
#if SPI_HPM_INTERRUPT_DRIVEN
	/* 第 24 课分析的中断路径 */
#else
	/* 轮询路径：调用 HPM SDK 阻塞 API spi_transfer() 死等硬件 FIFO 收发完 */
	stat = spi_transfer(base, &control_config, NULL, NULL,
			    (uint8_t *)tx_data, tx_size, (uint8_t *)rx_data, rx_size);
	if (stat != status_success) {
		spi_context_cs_control(&data->ctx, false);
		spi_context_complete(&data->ctx, dev, -EIO);
		return;
	}
	spi_hpm_master_transfer_callback(base, data);
#endif
}
```

- **全包链式推进**：由于 Zephyr 的 `spi_buf_set` 可能包含多段零散缓冲（例如先发 1 字节 `0x9F` 命令、再读 3 字节数据，或发送与接收长度不等），驱动会拉低一次 `cs-gpios` 后反复执行 `spi_hpm_transfer_next_packet()` 拆段调用 `spi_transfer()`，每完成一段就经 `spi_hpm_master_transfer_callback()` 更新 `spi_context` 指针；直到 `tx_len == 0 && rx_len == 0` 才释放片选并唤醒信号量。整个过程 CPU 始终在轮询 FIFO 状态标志位，确定性高但期间不会让出处理器时间片。

### 4. OLED 正常校验与缺失芯片双态界面

```c
static void render_flash_missing_oled(const uint8_t jedec_id[3], uint32_t tick)
{
	if (!oled_ui_is_ready()) { return; }
	char jbuf[24];
	snprintf(jbuf, sizeof(jbuf), "JEDEC: %02X %02X %02X",
		 jedec_id[0], jedec_id[1], jedec_id[2]);

	oled_ui_clear();
	oled_ui_header("M12", OLED_MODE_TITLE, tick);
	oled_ui_card(0, 17, 128, 47);
	oled_ui_fill_rect(6, 20, 116, 13, true);
	oled_ui_text_center(23, "NO FLASH CHIP", true);
	oled_ui_text_center(37, jbuf, false);
	oled_ui_text_center(49, "Check M12/Unplug M6", false);
	(void)oled_ui_present();
}
```

- 正常擦写周期调用 `render_flash_status_oled(ret == 0, (uint8_t)seq, tick)` 刷新 `"PASS"` / `"FAIL"` 胶囊徽章和右对齐递增 `Seq #XXX`；如果未检测到芯片，无需查看串口也能直接在 M1 屏上看到实测探测到的 `JEDEC: XX XX XX` 字节。

## 编译步骤（`west build`）

```powershell
.\.venv\Scripts\python.exe -m west build -p always -b dshanmcu_hpm6e70 applications\w25q64_polling_demo -d build\w25q64_polling_demo
```

## 烧录步骤与串口验证（`west flash`）

确认 **M12** 已插好 W25Q64 模块（建议顺手拔除共线 `PB05` 的 **M6 超声波模块**以免片选翻转连带触发发波），执行：

```powershell
.\.venv\Scripts\python.exe -m west flash -d build\w25q64_polling_demo
```

烧录校验完成后，串口（`115200 8-N-1`）显示 `polling` 模式与擦写校验成功输出：

```text
W25Q64 demo: coreboard + spi nor flash
SPI transfer mode: polling
probe: MISO samples = 00 EF 40 17 00 00 00 00
flash: w25q64@0 ready, 128 sectors x 65536 bytes = 8192 KiB
flash: erase+write+read OK (seq=0, 256 bytes, data=57563400...)
```

---

[上一课：红外发射与接收通信开发](../p2-22-红外发射与接收通信开发/README.md) · [下一课：W25Q64 中断读写开发](../p2-24-W25Q64中断读写开发/README.md) · [课程目录](../README.md)
