import React from 'react';
import Link from '@docusaurus/Link';
import KitExplorer from '@site/src/components/KitExplorer';
import HeroBoardStage from './HeroBoardStage';
import styles from './styles.module.css';

const HERO_STATS = [
  { value: '14 节', label: '一期外设快演' },
  { value: '11 节', label: '二期驱动工程' },
  { value: '11 节', label: '三期板级移植' },
  { value: '免安装', label: '一二期随包 SDK' },
];

const COMMON_STEPS = [
  { num: 'STEP 01', label: '准备开发环境', to: '/docs/common-01-准备开发环境/' },
  { num: 'STEP 02', label: 'Zephyr 与工程模型', to: '/docs/common-02-认识Zephyr与工程模型/' },
  { num: 'STEP 03', label: '认识 HPM6E70 板卡', to: '/docs/common-03-认识HPM6E70板卡/' },
  { num: 'STEP 04', label: '连接并验证 JTAG', to: '/docs/common-04-连接JTAG与OpenOCD/' },
  { num: 'STEP 05', label: '连接串口与 COM 端口', to: '/docs/common-05-连接串口并查看日志/' },
];

const PHASE_TRACKS = [
  {
    themeClass: styles.trackPhase1,
    phase: 'PHASE 01',
    count: '14 节实验 + 交互导览',
    subtitle: '一期 · 先跑通每个模块',
    title: '快速烧录与模块演示',
    description:
      '直接使用随包环境与配套外设模块，按底板接线定位、互斥提醒与串口日志，逐一编译烧录并点亮 14 个硬件 Demo。',
    highlights: [
      '声光显示：RGB LED、蜂鸣器、0.96 寸 OLED',
      '传感测距：DHT11、DS18B20、HC-SR04、MPU6050、光敏',
      '交互与存储：旋转编码器、红外避障/收发、W25Q64 轮询/中断/DMA',
    ],
    primaryLabel: '进入第 1 课 →',
    primaryTo: '/docs/p1-01-RGB全彩LED调色/',
    secondaryLabel: '套件交互导览',
    secondaryTo: '/docs/p1-00-交互认识实验套件/',
  },
  {
    themeClass: styles.trackPhase2,
    phase: 'PHASE 02',
    count: '11 节进阶课',
    subtitle: '二期 · 再学会驱动与应用',
    title: '驱动、应用与设备树',
    description:
      '以标准 example-application 与 HC-SR04 为主线，从原理图信号出发，亲手完成设备树描述、驱动编写到应用调用的完整闭环。',
    highlights: [
      '独立应用工程骨架与一键构建烧录流',
      'Overlay、Devicetree Binding、Kconfig 与 CMake 注册',
      '自定义传感器驱动实现与 Zephyr 内置驱动复用',
    ],
    primaryLabel: '进入二期课程 →',
    primaryTo: '/docs/p2-01-从example-application认识标准工程/',
  },
  {
    themeClass: styles.trackPhase3,
    phase: 'PHASE 03',
    count: '11 节底层课',
    subtitle: '三期 · 最后理解工程怎样组成',
    title: '从零搭建完整工程',
    description:
      '不依赖现成模板，从空白 west 工作区与 HPMicro SDK Glue 开始，逐层接通 SoC、Board 身份、控制台、外部 Flash 与 SDRAM。',
    highlights: [
      '手动初始化 SDK Glue 与 T2 工作区清单结构',
      '建立 Board 定义、SoC 启动链与 UART0 / GPIO 基础外设',
      '适配 XPI NOR 启动映射与 32 MiB 板载 SDRAM FEMC',
    ],
    primaryLabel: '进入三期课程 →',
    primaryTo: '/docs/p3-01-搭建SDK-Glue工作区/',
  },
];

const REQUIREMENTS = [
  {
    tag: '实验硬件',
    title: 'DshanMCU-HPM6E70 开发板与模块底板',
    detail: '包含 DshanMCU-HPM6E70 核心板、模块化扩展底板、CH347F 调试器（V12，提供 JTAG 与 USB-UART）及配套 M1–M13 外设模块。',
  },
  {
    tag: '开发主机',
    title: 'Windows 10 / 11 + PowerShell / VS Code',
    detail: '教程所有构建与烧录命令均基于 PowerShell 验证，并同步兼容 VS Code 终端与常用串口助手（115200 8-N-1）。',
  },
  {
    tag: '前置基础',
    title: '基础 C 语言阅读与命令行操作',
    detail: '无需事先掌握 Zephyr RTOS，课程会沿着可验证现象逐层拆解设备树、Kconfig、驱动模型与板级配置。',
  },
];

const WORKSPACE_DIRS = [
  {
    name: 'HPM6E70/',
    desc: '保存 Zephyr 内核、SDK Glue、Board 板级支持、一期/二期应用与驱动源码。构建与烧录命令默认在此根目录执行。',
  },
  {
    name: 'zephyr-docs/',
    desc: '本教程文档站点源码工程（即当前浏览的交互式站点），与编译构建工作区完全解耦，互不干扰。',
  },
];

/**
 * HPM6E70 Zephyr tutorial homepage portal.
 */
export default function CourseHome() {
  return (
    <div className={styles.portal}>
      {/* Hero Banner */}
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowPill}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span>DshanMCU-HPM6E70 · Zephyr RTOS 实战教程</span>
          </div>

          <h1 id="home-hero-title" className={styles.heroTitle}>
            从外设模块快演，
            <br />
            到<span className={styles.heroTitleAccent}>驱动与板级全栈工程</span>
          </h1>

          <p className={styles.heroLead}>
            专为 HPM6E70 RISC-V 核心板与模块化扩展底板打造的三阶实战路径：一期零阻力跑通 14 路外设 Demo，二期亲手写通设备树与 Zephyr 驱动，三期从零构建 SoC、Board、Flash 与 SDRAM。
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to="/docs/common-01-准备开发环境/">
              从共同准备开始 →
            </Link>
            <Link className={styles.btnSecondary} to="/docs/p1-01-RGB全彩LED调色/">
              直接进入一期实验
            </Link>
            <a className={styles.btnGhost} href="#kit-explorer">
              查看交互套件地图 ↓
            </a>
          </div>

          <div className={styles.heroStats} aria-label="课程概览数据">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className={styles.heroStatItem}>
                <strong className={styles.heroStatValue}>{stat.value}</strong>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroBoardStage />
      </section>

      {/* Section 1: Roadmap */}
      <section id="roadmap" className={styles.sectionBlock} aria-labelledby="roadmap-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <span className={styles.sectionEyebrow}>LEARNING ROADMAP</span>
            <h2 id="roadmap-title" className={styles.sectionTitle}>从共同准备进入三条进阶路线</h2>
            <p className={styles.sectionDesc}>
              三期课程共用同一套板卡认知、JTAG 烧录与串口观察通道。建议先完成第 00 步通道检查，再按当前目标选择一期、二期或三期。
            </p>
          </div>
          <Link className={styles.sectionLink} to="/docs/common-04-连接JTAG与OpenOCD/">
            硬件连接自检指南 →
          </Link>
        </div>

        <div className={styles.prepCard}>
          <div className={styles.prepTop}>
            <div className={styles.prepIntro}>
              <span className={styles.prepBadge} aria-hidden="true">00</span>
              <div className={styles.prepText}>
                <span className={styles.prepTag}>三期共用准备</span>
                <h3 className={styles.prepTitle}>打通编译环境、JTAG 烧录与串口观察通道</h3>
                <p className={styles.prepSubtitle}>
                  先确认工作区目录、识别板卡供电与 BOOT 状态、验证 OpenOCD 与 COM 串口，后续调试事半功倍。
                </p>
              </div>
            </div>
            <Link className={styles.prepAction} to="/docs/common-01-准备开发环境/">
              从第 1 步开始 →
            </Link>
          </div>

          <div className={styles.prepSteps}>
            {COMMON_STEPS.map((step) => (
              <Link key={step.num} className={styles.prepStepChip} to={step.to}>
                <span className={styles.prepStepNum}>{step.num}</span>
                <span className={styles.prepStepName}>{step.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.trackGrid}>
          {PHASE_TRACKS.map((track) => (
            <article key={track.phase} className={`${styles.trackCard} ${track.themeClass}`}>
              <div className={styles.trackMeta}>
                <span className={styles.trackPhaseBadge}>{track.phase}</span>
                <span className={styles.trackCountBadge}>{track.count}</span>
              </div>
              <span className={styles.trackSubtitle}>{track.subtitle}</span>
              <h3 className={styles.trackTitle}>{track.title}</h3>
              <p className={styles.trackDesc}>{track.description}</p>
              <ul className={styles.trackHighlights}>
                {track.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.trackFooter}>
                <Link className={styles.trackPrimaryLink} to={track.primaryTo}>
                  {track.primaryLabel}
                </Link>
                {track.secondaryTo && (
                  <Link className={styles.trackSecondaryLink} to={track.secondaryTo}>
                    {track.secondaryLabel}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: Interactive Kit Explorer */}
      <section id="kit-explorer" className={styles.sectionBlock} aria-labelledby="explorer-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <span className={styles.sectionEyebrow}>INTERACTIVE HARDWARE MAP</span>
            <h2 id="explorer-title" className={styles.sectionTitle}>一期 14 路模块交互接线导览</h2>
            <p className={styles.sectionDesc}>
              点击底板实拍图上的任意插座（<code>M1</code>–<code>M13</code>）或中央 <strong>HPM6E70 核心板</strong>，即可查看信号引脚、供电规格、硬件复用冲突提醒与一键烧录命令。
            </p>
          </div>
          <Link className={styles.sectionLink} to="/docs/p1-00-交互认识实验套件/">
            独立打开套件完整导览 →
          </Link>
        </div>

        <KitExplorer mode="explorer" />
      </section>

      {/* Section 3: Pre-Flight & Workspace */}
      <section id="preflight" className={styles.sectionBlock} aria-labelledby="preflight-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <span className={styles.sectionEyebrow}>PRE-FLIGHT &amp; WORKSPACE</span>
            <h2 id="preflight-title" className={styles.sectionTitle}>开始前准备与双目录约定</h2>
            <p className={styles.sectionDesc}>
              一、二期完整工程包开箱即用；开始前请核对硬件连接方式，并区分工程源码目录与文档目录。
            </p>
          </div>
        </div>

        <div className={styles.preflightGrid}>
          <div className={styles.preflightCard}>
            <div className={styles.preflightHeader}>
              <h3 className={styles.preflightTitle}>软硬件与前置条件</h3>
              <span className={styles.preflightSub}>开箱接电即可跟随每一步真机验证</span>
            </div>

            <div className={styles.reqList}>
              {REQUIREMENTS.map((req) => (
                <div key={req.tag} className={styles.reqRow}>
                  <span className={styles.reqTag}>{req.tag}</span>
                  <div className={styles.reqBody}>
                    <strong>{req.title}</strong>
                    <span>{req.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.preflightCard}>
            <div className={styles.preflightHeader}>
              <h3 className={styles.preflightTitle}>工程包说明与目录分工</h3>
              <span className={styles.preflightSub}>所有构建指令默认在工程根目录执行</span>
            </div>

            <div className={styles.sdkCallout}>
              <strong className={styles.sdkCalloutTitle}>一、二期完整工程包：解压即用，免装环境</strong>
              <p>
                工程包已内置 <code>.west/</code> 清单、Zephyr 源码、<code>sdk/</code>（Python、west、Git、CMake、Ninja、RISC-V 工具链、OpenOCD）及 <code>.venv/</code> 入口，无需激活虚拟环境或另行配置环境变量；仅在进入三期从空目录搭建时，按{' '}
                <Link to="/docs/common-01-准备开发环境/?phase=phase3">三期环境准备</Link> 安装工具链。
              </p>
            </div>

            <div className={styles.dirGrid}>
              {WORKSPACE_DIRS.map((dir) => (
                <div key={dir.name} className={styles.dirBox}>
                  <code className={styles.dirCode}>{dir.name}</code>
                  <span>{dir.desc}</span>
                </div>
              ))}
            </div>

            <div className={styles.quickLinksBar}>
              <span className={styles.quickLinksLabel}>常用入口：</span>
              <Link className={styles.quickLink} to="/docs/common-02-认识Zephyr与工程模型/">
                认识 Zephyr 工程模型
              </Link>
              <Link className={styles.quickLink} to="/docs/appendix-01-故障排查/">
                常见问题与故障排查
              </Link>
              <Link className={styles.quickLink} to="/docs/appendix-02-资料与下载/">
                官方资料与下载
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
