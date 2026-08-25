---
sidebar_position: 1
---

# Rockchip Developer Guide Linux GMAC DPDK

## 读者对象

本⽂档（本指南）主要适⽤于以下⼯程师：

技术⽀持⼯程师

软件开发⼯程师

## 修订记录


| 版本号 | 作者 | 修改日期 | 修改说明 |
| --- | --- | --- | --- |
| V1.0.0 | 吴达超 | 2023-03-06 | 初始版本 |

### ⽬录

Rockchip Developer Guide Linux GMAC DPDK  

代码编译  

内核  

DPDK 编译  

运⾏ DPDK 程序  

挂载巨⻚  

加载 KO  

设置 performance 模式  

运⾏ testpmd  

运⾏ l2fwd  

运⾏ l3fwd  

Pktgen  

下载 pktgen-dpdk 源码  

DPDK 编译  

Pktgen 编译  

运⾏ Pktgen 程序  

常⻅问题：  

⻓时间打流会丢包  

物理内存超4G空间

### 代码编译

### 内核

⾸先使能 DTS 中 UIO 节点，以 RK3568-evb1 参考：

```diff
diff --git a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
index 0cb57e9d8529..c7729258e51d 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
@@ -262,6 +262,14 @@
status = "okay";
};
+&gmac_uio0 {
+ status = "okay";
+};
+
```

```diff
+&gmac_uio1 {
+ status = "okay";
+};
+
/*
* power-supply should switche to vcc3v3_lcd1_n
* when mipi panel is connected to dsi1.
```

### 编译 KO

```shell
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rockchip_linux_defconfig
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 menuconfig, 配置 CONFIG_UIO=m,
CONFIG_STMMAC_UIO=m，CONFIG_HUGETLBFS=y
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rrk3568-evb1-ddr4-v10-
linux.img -j8
烧写 boot.img
adb push drivers/uio/uio.ko, adb push
drivers/net/ethernet/stmicro/stmmac/stmmac_uio.ko
```

### DPDK 编译

DPDK 测试使⽤的开发板跑的系统是 Debian 11，DPDK 版本 21.11，编译参考 http://doc.dpdk.org/guides-21.11/linux\_gsg/cross\_build\_dpdk\_for\_arm64.html

### PC 交叉编译

```shell
wget https://developer.arm.com/-/media/Files/downloads/gnu-a/9.2-
2019.12/binrel/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu.tar.xz
tar -xvf gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu.tar.xz
export PATH=$PATH:<cross_install_dir>/gcc-arm-9.2-2019.12-x86_64-aarch64-none
linux-gnu/bin
apt install build-essential
apt install pkg-config-aarch64-linux-gnu
apt-get install python3 python3-pip
apt install meson
apt install ninja-build
meson aarch64-build-gcc --cross-file config/arm/arm64_armv8_linux_gcc
meson --reconfigure aarch64-build-gcc --cross-file
config/arm/arm64_armv8_linux_gcc -Dbuildtype=debug -Dplatform=arm64 -
Dexamples=l2fwd,l3fwd
ninja -C aarch64-build-gcc
```

### 开发板编译 DPDK

```shell
apt-get install python3 python3-pip
apt install meson
apt install ninja-build
apt-get install libdpkg-perl
apt-get install build-essential
apt-get install python3-pyelftools
meson -Ddisable_drivers='common/cnxk' build
cd build
ninja
ninja install
```

### 运⾏ DPDK 程序

### 挂载巨⻚

```batch
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

### 加载 KO

insmod uio.ko   

insmod stmmac\_uio.ko

默认开机起来后的⽹络走的还是原⽣内核⽹络，这⾥我们通过 insmod stmmac\_uio.ko 和 rmmod 该ko 来做到 DPDK 与内核原⽣⽹络的切换，即卸载 KO 后，会回到原来的内核⽹络状态。

### 进⼊ DPDK ⽹络控制：

root@linaro-alip:/home/linaro#insmod stmmac\_uio.ko   

41.232761] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]   

(mii\_bus:phy\_addr=stmmac-1:00, irq=POLL)   

[ 41.236447] dwmac4: Master AXI performs any burst length   

41.236497] rk\_gmac-dwmac fe010000.ethernet eth0: No Safety Features support   

found   

[ 41.236886] rockchip\_eth\_uio\_drv fe010000.uio: Registered uio\_eth0 uio   

devices, 3 register maps attached   

[ 41.241453] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]   

(mii\_bus:phy\_addr=stmmac-0:00, irq=POLL)   

41.257084] dwmac4: Master AXI performs any burst length   

[ 41.257138] rk\_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support   

found   

[ 41.257523] rockchip\_eth\_uio\_drv fe2a0000.uio: Registered uio\_eth1 uio   

devices, 3 register maps attached

### 返回内核⽹络控制：

root@linaro-alip:/home/linaro# rmmod stmmac\_uio   

[ 2200.304636] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]   

(mii\_bus:phy\_addr=stmmac-0:00, irq=POLL)   

[ 2200.318163] dwmac4: Master AXI performs any burst length   

[ 2200.318205] rk\_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support   

found   

[ 2200.318227] rk\_gmac-dwmac fe2a0000.ethernet eth1: IEEE 1588-2008 Advanced   

Timestamp supported

[ 2200.318443] rk\_gmac-dwmac fe2a0000.ethernet eth1: registered PTP clock   

[ 2200.319414] IPv6: ADDRCONF(NETDEV\_UP): eth1: link is not ready   

[ 2200.322971] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]   

(mii\_bus:phy\_addr=stmmac-1:00, irq=POLL)   

[ 2200.324883] dwmac4: Master AXI performs any burst length   

[ 2200.324921] rk\_gmac-dwmac fe010000.ethernet eth0: No Safety Features support   

found   

[ 2200.324945] rk\_gmac-dwmac fe010000.ethernet eth0: IEEE 1588-2008 Advanced   

Timestamp supported   

[ 2200.325468] rk\_gmac-dwmac fe010000.ethernet eth0: registered PTP clock   

[ 2200.325814] IPv6: ADDRCONF(NETDEV\_UP): eth0: link is not ready   

[ 2205.385406] IPv6: ADDRCONF(NETDEV\_CHANGE): eth0: link becomes ready

### 设置 performance 模式

echo performance | tee \$(find /sys/ -name *governor) /dev/null || true

### 运⾏ testpmd

### 转发模式测试命令

--vdev=net\_stmmac0 --vdev=net\_stmmac1 表⽰指定的虚拟设备，⽬前是名字是固定的

--main-lcore=0 表⽰ 0 核⽤作管理，2 和 3 核⽤于转发

--iova-mode=pa 因为设备不⽀持 iommu，故 iova-mode 规定为 pa 模式

-- ⽤于分隔 eal 参数与 testpmd 的参数

-i 表⽰进⼊ dpdk-testpmd 命令交互模式

root@linaro-alip:/home/linaro# ./dpdk-testpmd --iova-mode=pa --   

vdev=net\_stmmac0 --vdev=net\_stmmac1 -l 0,2,3 --main-lcore=0 -- -i   

EAL: Detected CPU lcores: 4   

EAL: Detected NUMA nodes: 1   

EAL: Detected static linkage of DPDK   

EAL: Multi-process socket /var/run/dpdk/rte/mp\_socket   

EAL: Selected IOVA mode 'PA'   

TELEMETRY: No legacy callbacks, legacy socket not created   

Interactive-mode selected   

Warning: NUMA should be configured manually by using --port-numa-config and --   

ring-numa-config parameters along with --numa.   

testpmd: create a new mbuf pool &lt;mb\_pool\_0&gt;: n=163456, size=2176, socket=0   

testpmd: preferred mempool ops selected: ring\_mp\_mc   

Configuring Port 0 (socket 0)

stmmac\_net: stmmac\_eth\_link\_update()Port (0) link is Up   

Port 0: BA:A0:3F:FD:B2:8C   

Configuring Port 1 (socket 0)

stmmac\_net: stmmac\_eth\_link\_update()Port (1) link is Up   

Port 1: B6:A0:3F:FD:B2:8C   

Checking link statuses...   

stmmac\_net: stmmac\_eth\_link\_update()Port (0) link is Up   

stmmac\_net: stmmac\_eth\_link\_update()Port (1) link is Up   

Done

### 开启 testpmd 64 字节转发模式测试

testpmd&gt; start

io packet forwarding - ports=2 - cores=1 - streams=2 - NUMA support enabled, MP   

allocation mode: native   

Logical Core 2 (socket 0) forwards packets on 2 streams:   

RX P=0/Q=0 (socket 0) -&gt; TX P=1/Q=0 (socket 0) peer=02:00:00:00:00:01   

RX P=1/Q=0 (socket 0) -&gt; TX P=0/Q=0 (socket 0) peer=02:00:00:00:00:00   

io packet forwarding packets/burst=32   

nb forwarding cores=1 - nb forwarding ports=2   

port 0: RX queue number: 1 Tx queue number: 1   

Rx offloads=0x0 Tx offloads=0x0   

RX queue: 0   

RX desc=0 - RX free threshold=0   

RX threshold registers: pthresh=0 hthresh=0 wthresh=0   

RX Offloads=0x0   

TX queue: 0   

TX desc=0 - TX free threshold=0   

TX threshold registers: pthresh=0 hthresh=0 wthresh=0   

TX offloads=0x0 - TX RS bit threshold=0   

port 1: RX queue number: 1 Tx queue number: 1   

Rx offloads=0x0 Tx offloads=0x0   

RX queue: 0   

RX desc=0 - RX free threshold=0   

RX threshold registers: pthresh=0 hthresh=0 wthresh=0   

RX Offloads=0x0   

TX queue: 0   

TX desc=0 - TX free threshold=0   

TX threshold registers: pthresh=0 hthresh=0 wthresh=0   

TX offloads=0x0 - TX RS bit threshold=0

### 查看转发数据：

testpmd&gt; show port stats all   

######################## NIC statistics for port 0 ########################   

RX-packets: 86276096 RX-missed: 0 RX-bytes: 5176569365   

RX-errors: 0   

RX-nombuf: 0   

TX-packets: 0 TX-errors: 0 TX-bytes: 0   

Throughput (since last show)   

Rx-pps: 1125857 Rx-bps: 576438784   

Tx-pps: 0 Tx-bps: 0   

############################################################################   

######################## NIC statistics for port 1 ########################   

RX-packets: 0 RX-missed: 0 RX-bytes: 0   

RX-errors: 0   

RX-nombuf: 0   

TX-packets: 46621099 TX-errors: 0 TX-bytes: 2797265940   

Throughput (since last show)   

Rx-pps: 0 Rx-bps: 0   

Tx-pps: 1124867 Tx-bps: 575931904   

############################################################################

### 多核设置

⽐如双向转发，需要⽤到2个核(2和3)，⼀个核⼀个⽅向：

set corelist 2,3

设置多 port 转发：

⽐如 prot0 和 port2 转发，port1 和 port3 转发

set portlist 0,2,1,3

### 其它常⽤设置：

--nb-cores 表⽰指定 dpdk-testpmd ⽤作转发⼯作的核的数量

--rxd 接收队列描述符

--txd 发送队列描述符

--rxq 表⽰指定 dpdk-testpmd 接收队列数，RK3568 队列数为1

--txq 表⽰指定 dpdk-testpmd 发送队列数，RK3568 队列数为1

### 运⾏ l2fwd

l2fwd 默认⾄少要有两个核才能测试转发

```shell
./dpdk-l2fwd -l 0,2,3 --main-lcore=0 --iova-mode=pa --vdev=net_stmmac0 --
vdev=net_stmmac1 -- -q 1 -p 0x3
```

l2fwd 运⾏的串口信息每隔10s钟会刷新⼀次，考虑可能会导致丢包，建议将串口信息重定向到⽂件。

### 运⾏ l3fwd

```shell
./dpdk-l3fwd -l 3 -n 1 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 --
-p 0x3 -P --config="(0,0,3),(1,0,3)" --parse-ptype
```

-p PortMask 参数指定使⽤的⽹口掩码

-P 参数表⽰将所有⽹口设置为混杂模式，以便收到所有数据包

--config (port,queue,lcore)，[(port,queue,lcore)] 参数⽤以配置⽹口、队列、核之间的对应关系，例如，--config (0,0,3) 表⽰⽹口 0 的队列 0 由核 3 进⾏处理

值得注意的是，上述输出中打印了 l3fwd 的默认路由规则，即

LPM: Adding route 198.18.0.0 / 24 (0) [net\_stmmac0]   

LPM: Adding route 198.18.1.0 / 24 (1) [net\_stmmac1]   

LPM: Adding route 2001:200:: / 64 (0) [net\_stmmac0]   

LPM: Adding route 2001:200:0:1:: / 64 (1) [net\_stmmac1]

也就是说，⽬的 IP 为 198.18.0.0/24 段的数据包将会通过⽹口 0 进⾏转发，⽬的 IP 为 198.18.1.0 / 24段的数据包将会通过⽹口 1 进⾏转发。上述默认路由规则是在源码中配置的，所以在l3fwd测试的时候，需要设置好测试数据的⽬标ip和源ip。

### Pktgen

在板⼦上跑Pktgen ，是基于 dpdk，所以需要先编译和安装好 DPDK，编译参考1.2章节的开发板编译DPDK。

### 下载 pktgen-dpdk 源码

```shell
git clone http://dpdk.org/git/apps/pktgen-dpdk
apt-get install libpcap-dev
apt-get install libnuma-dev
apt install meson
apt install ninja-build pkg-config
```

### DPDK 编译

```
cd build
ninja
ninja install
ldconfig
export PKG_CONFIG_PATH=/usr/local/lib/aarch64-linux-gnu/pkgconfig/
```

### Pktgen 编译

```
cd pktgen-dpdk
meson build
cd build
ninja
```

### 运⾏ Pktgen 程序

```shell
./build/app/pktgen --iova-mode=pa --vdev=net_stmmac0 -l 6,7 --proc-type auto
log-level debug -- -P -m 7.0
```

其中，EAL options 参数部分可以参看 DPDK EAL parameters，最重要的⼀个参数就是 -l 参数，⽤它来指定使⽤的核列表，⽐如：-l 1,2 或者 -l 1-2，表⽰使⽤核 1 和核 2。

值得注意的是，pktgen ⾄少要指定两个核，因为 pktgen 需要⼀个核与⽤⼾进⾏交互，⽐如响应测试过程中⽤⼾的输⼊。

pktgen ⾃有参数部分最重要的是 -m 参数，⽤它来指定⽹口与核之间的对应关系，⽐如：

-m 2.0：表⽰让核 2 来处理⽹口 0。值得注意的是，若要指定多个对应关系（使⽤多个⽹卡和多个核），则需多次使⽤ -m 参数。

如果要收包，最好也指定⼀下 -P 参数，表⽰让所有⽹口进⼊混杂模式，以便接收到所有数据包。

设置数据包格式并开启 Pktgen：

```batch
set 0 size 64
set 0 src ip 198.18.0.100/24
set 0 dst ip 198.18.1.101
set 0 dst mac ba:a0:3f:fd:b2:8c
start 0
```

### 常⻅问题：

### ⻓时间打流会丢包

### 设置核隔离

在 cmdline 加⼊隔离的核，⽐如隔离核2和3，加⼊ isolcpus=2,3

```diff
diff --git a/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
b/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
index c7e309645099..cf88ad29dcf6 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
@@ -13,7 +13,7 @@ aliases {
};
chosen: chosen {
bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 rw rootwait";
+ bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 isolcpus=2,3 rw rootwait";
};
fiq-debugger {
```

### 设置 no full\_hz

### 确保⼀下编译选项打开，编译内核

+CONFIG\_NO\_HZ\_FULL=y

在 cmdline 加⼊对应隔离核，⽐如核2和3，nohz\_full=2,3

```diff
diff --git a/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
b/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
index c7e309645099..cf88ad29dcf6 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
@@ -13,7 +13,7 @@ aliases {
};
chosen: chosen {
bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 rw rootwait";
+ bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 isolcpus=2,3 nohz_full=2,3 rw rootwait";
};
fiq-debugger {
```

### 关闭串口打印

### 物理内存超4G空间

因为 RK3568 和 RK3588 的 GMAC 只能⽀持4G以下的物理内存空间，需要对 dpdk的 memory 使⽤做限制，否则有可能出现异常

uboot log 先确认是否超 4G(0x00000000 - 0xffffffff)

例如下⾯这个log显⽰，⼤概有256M在4G以上：

Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)   

Adding bank: 0x09400000 - 0xf0000000 (size: 0xe6c00000)   

Adding bank: 0x1f0000000 - 0x200000000 (size: 0x10000000)

可以简单的修改 uboot 的代码限制在 4G 以下：

```diff
diff --git a/arch/arm/mach-rockchip/param.c b/arch/arm/mach-rockchip/param.c
index 21a45705f0..b9895bae2a 100644
--- a/arch/arm/mach-rockchip/param.c
+++ b/arch/arm/mach-rockchip/param.c
@@ -287,10 +287,12 @@ struct memblock *param_parse_ddr_mem(int *out_count)
return 0;
}
+ count = 1;
for (i = 0, n = 0; i < count; i++, n++) {
base = t->u.ddr_mem.bank[i];
size = t->u.ddr_mem.bank[i + count];
+ size = SZ_4GB;
/* 0~4GB */
if (base < SZ_4GB) {
mem[n].base = base;
```
