---
sidebar_position: 1
---

# Quick-Start-Linux-Streamline

### Streamline 使用说明

## 1. 介绍

Streamline 是 DS5 提供的一个性能分析工具，通过抓取 cpu 和 gpu 的内部硬件计数器和 Kernel 的一些软件 tracepoint 来实现性能分析，功能比较强大。

## 2. 抓取数据

准备工具

1. 首先需要下载 ds5，一些新的 cpu 和 gpu 可能需要较新的 DS5 才能支持，我目前用的是5.26 版本。DS5 是需要 license 的，不过可以先申请一个 30 天的全功能试用 license，下载



安装和申请 license 的流程就不在这里介绍了。

2. 设备端需要和 host 建立连接，目前支持两种连接方式：adb 和网络

3. 需要设备端的 root 权限，不然没法在设备端运行 gatord

4. 需要和固件匹配的符号表，方便后续的分析

gatord

设备端需要运行一个守护进程来和 host 端做交互，早期版本的 mali 驱动或 ds5 版本还需要重新编译 Kernel 的 gpu 驱动来启用 gatord，不过目前新版本的 ds5 已经没有这个问题了。

```shell
$ adb push /path/to/ds5/sw/streamline/bin/$ARCH/gatord /data/local/
# cd /data/local/
# ./gatord &
```

### 建立连接

gatord 跑起来之后就可以在 host 端打开 Streamline，在左上角点击 按钮，会弹出如下对话框：



选中你要调试的设备，点“select”即可。

### 配置计数器



Streamline 支持的计数器和设备相关，在连接完成后，可以点击 按钮，会弹出对话框，列出所有支持的计数器：



### Counter Configuration

Choose the target counters to collect.

Connected to adb:EGP6CYN74U.



左边是可选的计数器，右边是已选的计数器，在可选计数器上双击即可移动到已选计数器，完成后点“save”按钮即可，全部重选可以点击“load defaults"先恢复默认设置。

抓取数据



计数器选好以后，可以点击 开启抓取，结束时点击 按钮，这时候会自动跳转到分析界面。

## 3. 分析结果

Streamline 相对于传统的 profile 工具的优势在于：丰富的硬件计数器支持，可以很方便的看到cache，bus 和 gpu 内部状态。

加载符号表

右键单击左侧的我们抓取到的数据名称，在弹出的菜单中点击”analyze"，会弹出如下对话框：

### 愛fish\_02

### Analyze

Choose the settings to produce a new report



点击红色箭头指向的按钮就可以添加带符号信息的 elf 文件了。不用全部添加，根据热点添加即可。

### Heat Map

这个视图可以很方便的找到热点线程，点击左下角的

点击▶ 可以展开各个进程，点击每个线程的名字，可以只显示这个线程的统计值，例如线程的 cpu占有率，线程的 miss rate 等。

时间轴上有个滑块，可以拉伸和移动，以显示某个时间段内的统计数据，类似下图：



### Core Map

这个视图可以看到每个线程各个时刻都在那个 core 上跑，对于看调度问题比较方便，比如不合理的 cpu 迁移。

### Cluster Map

这个视图可以看到每个线程在当前跑在哪个 cluster，可以分析是否有不合理的大小核迁移导致性能下降。

### Samples

这个视图可以分析每个时间片内函数的 cpu 占比，时间片可以通过上面时间轴上的滑块控制，对于分析热点函数比较有用。

### Processes

这个视图可以分析热点进程的 cpu 占比。

### Functions

点击上部的”functions"选项卡，可以看到整个抓取周期内的函数热点统计，如下图所示：


| P Streamline |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0°C |  | Streamline Data 口 | 日 | Help fish | fish_02 3 |  | ned int) (1 so) 1 k/arm/boot- lib/libart. virtual addr ls from /de lvik-jit-cod so) |  |  |  |  |  |
|  | adb:EGP6CYN74U o | ⑦ | Timeline Call Paths Functions CodeLog |  |  |  |  |  |  |  | 口 日 |  |
| 口 | 田日 Filter | M3US EY Row Filter |  |  |  |  |  |  |  | 1 | 1,547 (3.62%) |  |
|  | caffe_gpu |  |  | Function Name | 4 Self | % Self | Total |  | % Total | Instances Stack | Size |  |
|  | caffe_gpu_02 | cpuidle_enter_state |  |  | 17,746 | 41.50% | 17,746 | 41.50% |  | 1 | 640 788 |  |
|  | caffe_gpu_03 |  | &lt;unknown code in libGLES_mali.so&gt; accum_dump_buffer |  | 2,601 2,531 | 6.08% 5.92% | 2,601 2,531 | 6.08% 5.92% |  | 8 1 | 0 2 0 80 |  |
| 0℃08:00 |  |  | _raw_spin_unlock_irq |  | 2,054 | 4.80% | 2,054 | 4.80% |  | 66 | 128 64 |  |
|  | Q CP | caffe_gpu_04 |  | sk_fill_path(const SkPath&amp;, const SkIRect&amp;, SkBlitter*, int, int, |  | 1,547 | 3.62% | 1,547 | 3.62% |  | 3,072 | 928 |
|  | caffe_gpu_05 |  | _raw_spin_unlock_irqrestore |  | 919 2.15% |  | 919 | 2.15% | 52 | 128 64 |  |  |
|  | caffe_gpu_06 |  | SkAlphaRuns::Break(short*, unsigned char*, int, int) SuperBlitter::blitH(int, int, int) |  | 825 1.93% 771 1.80% |  | 825 1.93% 771 1.80% |  | 1 1 | 80 128 192 364 |  |  |
|  | fish | &lt;unknown code in gatord&gt; |  |  | 527 1.23% |  | 527 | 1.23% | 5 | 0 2 |  |  |
| 国 | ▼ fish_02 | &lt;unknown code in system_server&gt; |  | 435 | 1.02% | 435 | 1.02% |  | 13 | 0 2 |  |  |
|  |  | memcpy |  | 377 | 0.88% 0.80% | 377 344 | 0.88% 0.80% |  | 7 8 | 0 592 |  |  |
| A | Rockchip RK3399 Evaluation Boar.. | memset |  | 344 251 | 0.59% | 251 | 0.59% |  | 32 1,408 | 0 272 864 |  |  |
|  | 1ms Resolution /home/cmc/Documents/Streamline 0 | do_softirq &lt;unknown code in libart.so&gt; |  | 231 | 0.54% | 231 | 0.54% |  | 2 | 0 2 |  |  |
| a | fish_03 |  | SkTIntroSort&lt;SkEdge*, SkTPointerCompareLT&lt;SkEdge&gt;&gt;(void,.. |  | 227 0.53% |  | 227 | 0.53% | 1 | 192 656 |  |  |
|  | SkPathRef::Editor::Editor(sk_sp&lt;SkPathRef&gt;*, int, int) |  | 194 0.45% |  | 194 | 0.45% | 1 | 128 | 260 |  |  |  |
| tensorflow ipt_do_table arch_cpu_idle |  |  | 187 | 0.44% | 187 | 0.44% |  | 5 2,944 1 | 1,552 |  |  |  |
|  |  |  | 186 | 0.44% 0.37% | 186 157 | 0.44% 0.37% |  |  | 384 388 |  |  |  |
|  | SkA8_Coverage_Blitter::blitAntiH(int, int, const unsigned char.. |  | 157 |  | 154 | 0.36% |  | 1 96 0 | 68 |  |  |  |
| 内 | _dma_clean_range |  | 154 | 0.36% 0.31% | 131 | 0.31% |  | 6 2 | 48 0 220 |  |  |  |
|  | divsi3 pthread_mutex_lock |  | 131 129 | 0.30% | 131 (0.31%) % |  |  | 11 0 | 64 |  |  |  |
| G |  | .plt [libwebviewchromium.so] |  |  | 119 | 0.28% | 119 | 0.28% | 8 | 0 4,148 |  |  |
|  | _pi_memcpy |  | 116 | 0.27% | 116 | 0.27% |  | 5 | 0 384 |  |  |  |
|  | &lt;unknown code in libhwui.so&gt; |  | 108 | 0.25% | 108 | 0.25% |  | 3 | 0 2 |  |  |  |
|  | &lt;unknown code in kernel&gt; |  | 100 | 0.23% | 100 | 0.23% |  | 1 | 0 2 |  |  |  |
| 网 | &lt;unknown code in libutils.so&gt; |  | 97 0.23% |  | 97 96 | 0.23% 0.22% |  | 10 0 | 2 5,964 |  |  |  |
|  |  | aaa_walk_edges(SkAnalyticEdge*, SkAnalyticEdge*, SkPath::Fi... | 96 0.22% |  | 95 | 0.22% | 16 | 1 928 0 | 68 |  |  |  |
|  | _raw_spin_lock pthread_mutex_unlock |  | 95 94 | 0.22% 0.22% | 94 | 0.22% |  | 9 | 0 198 |  |  |  |
|  | ifree |  |  | 91 | 0.21% | 91 | 0.21% |  | 9 | 0 1,088 |  |  |
|  |  | &lt;unknown code in libbinder.so&gt; |  |  | 90 0.21% |  | 90 87 0.20% | 0.21% | 7 | 0 2 |  |  |
|  |  | &lt;unknown code in hwcomposer.rk3oboard.so&gt; | refresh_cpu_vm_stats.isra.9 | 87 83 | 0.20% 0.19% | 83 | 0.19% |  | 2 1 | 0 2 1,920 288 |  |  |
|  |  |  |  |  | 4aa. | aa | aa |  |  | P |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |

### Call Paths

如果想看函数的调用关系，可以切换到“call paths”选项卡
