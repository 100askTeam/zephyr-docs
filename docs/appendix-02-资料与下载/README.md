# 附录：官方资料与下载

## 本课程使用的主要来源

- [HPMicro Zephyr SDK Glue 开发指南](https://kb.hpmicro.com/2025/12/03/zephyr-zephyr-sdk-glue-%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97/)
- [Zephyr Getting Started Guide](https://docs.zephyrproject.org/3.7.0/develop/getting_started/index.html)
- [Zephyr Board Porting Guide](https://docs.zephyrproject.org/3.7.0/hardware/porting/board_porting.html)
- [Zephyr SoC Porting Guide](https://docs.zephyrproject.org/3.7.0/hardware/porting/soc_porting.html)
- [Zephyr Architecture Porting Guide](https://docs.zephyrproject.org/3.7.0/hardware/porting/arch.html)
- [Zephyr Devicetree Guide](https://docs.zephyrproject.org/3.7.0/build/dts/index.html)
- [Zephyr Kconfig Guide](https://docs.zephyrproject.org/3.7.0/build/kconfig/index.html)

## 工程内的硬件资料

板卡原理图、HPM6E70/HPM6E00 用户手册、Flash 与 SDRAM 器件资料应随工程发行包放在 `hardware/` 或单独资料包中。课程中的管脚、容量、时序和地址结论均应能回到这些原始资料核对。

## 调试工具

- [WCH CH347 官方页面](https://www.wch.cn/products/CH347.html)
- [WCH CH343/CH347 Windows 串口驱动](https://www.wch-ic.com/downloads/CH343SER_EXE.html)
- [Zadig](https://zadig.akeo.ie/)
- [OpenOCD](https://openocd.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Microsoft Serial Monitor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-serial-monitor)

本工程的 `tools/openocd-ch347/` 是为了同时支持 CH347F 与 HPM XPI Flash 的已验证 OpenOCD 版本。官方 Zephyr SDK Glue 提供的 OpenOCD 可用于受支持的调试器，但当前版本不包含本课程需要的 CH347 适配器驱动。

## 版本原则

`west.yml` 固定的是一组相互配合的源码版本。更新 Zephyr、sdk_glue、HPM SDK 或工具链后，应重新执行编译、JTAG、Flash、UART、LED 与 SDRAM回归验证，不能只根据单个版本号判断兼容性。
