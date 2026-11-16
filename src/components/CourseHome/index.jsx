import React from 'react';
import Link from '@docusaurus/Link';
import KitExplorer from '@site/src/components/KitExplorer';
import HeroBoardStage from './HeroBoardStage';
import styles from './styles.module.css';

const HERO_STATS = [
  { value: '14 节', label: '一期外设实验' },
  { value: '11 节', label: '二期驱动开发' },
  { value: '11 节', label: '三期板级移植' },
  { value: '免安装', label: '一二期随包环境' },
];

const COMMON_STEPS = [
  { num: '01', label: '准备开发环境', to: '/docs/common-01-准备开发环境/' },
  { num: '02', label: 'Zephyr 与工程模型', to: '/docs/common-02-认识Zephyr与工程模型/' },
  { num: '03', label: '认识 HPM6E70 板卡', to: '/docs/common-03-认识HPM6E70板卡/' },
  { num: '04', label: '连接并验证 JTAG', to: '/docs/common-04-连接JTAG与OpenOCD/' },
  { num: '05', label: '连接串口与 COM 端口', to: '/docs/common-05-连接串口并查看日志/' },
];

const PHASE_TRACKS = [
  {
    themeClass: styles.trackPhase1,
    phase: '第一期',
    count: '14 节实验',
    subtitle: '先跑通外设模块',
    title: '外设模块实验与验证',
    description:
      '在随包工程中按底板插座位置、共用引脚说明与串口日志，逐一编译、烧录并验证 14 个外设模块示例。',
    highlights: [
      '声光显示：RGB 全彩 LED、蜂鸣器、0.96 寸 OLED',
      '传感测距：DHT11、DS18B20、HC-SR04、MPU6050、光敏电阻',
      '输入通信与存储：旋转编码器、红外避障/收发、W25Q64 轮询/中断/DMA',
    ],
    primaryLabel: '进入第 1 课 →',
    primaryTo: '/docs/p1-01-RGB全彩LED调色/',
    secondaryLabel: '认识实验套件',
    secondaryTo: '/docs/p1-00-认识实验套件/',
  },
  {
    themeClass: styles.trackPhase2,
    phase: '第二期',
    count: '11 节课程',
    subtitle: '再学会驱动与应用',
    title: '驱动、应用与设备树',
    description:
      '以标准 example-application 与 HC-SR04 为主线，从原理图信号出发，完成设备树描述、驱动编写到应用调用的全过程。',
    highlights: [
      '独立应用工程结构与命令行构建烧录流程',
      'Overlay、Devicetree Binding、Kconfig 与 CMake 注册',
      '自定义传感器驱动实现与 Zephyr 已有驱动复用',
    ],
    primaryLabel: '进入二期课程 →',
    primaryTo: '/docs/p2-01-从example-application认识标准工程/',
  },
  {
    themeClass: styles.trackPhase3,
    phase: '第三期',
    count: '11 节课程',
    subtitle: '最后理解工程怎样组成',
    title: '从零搭建完整工程',
    description:
      '从空白 west 工作区与 HPMicro SDK Glue 开始，逐层建立 SoC、Board、UART0 控制台、板载 NOR Flash 与 SDRAM 支持。',
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
    desc: '保存 Zephyr 源码、SDK Glue、板级支持以及一、二期应用与驱动源码。课程中的构建、烧录和调试命令默认在此根目录执行。',
  },
  {
    name: 'zephyr-docs/',
    desc: '保存本教程文档网站源码，与 HPM6E70/ 工程目录相互独立。',
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
            <span>DshanMCU-HPM6E70 · Zephyr 教程</span>
          </div>

          <h1 id="home-hero-title" className={styles.heroTitle}>
            从外设模块实验，
            <br />
            到<span className={styles.heroTitleAccent}>驱动开发与完整工程</span>
          </h1>

          <p className={styles.heroLead}>
            围绕 DshanMCU-HPM6E70 核心板与模块化底板分三期展开：一期在现成工程中编译烧录并验证 14 路外设模块；二期以 HC-SR04 为主线完成设备树、驱动与应用开发；三期从空白工作区开始，逐层接通 SoC、Board、Flash 与 SDRAM。
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to="/docs/common-01-准备开发环境/">
              从共同准备开始 →
            </Link>
            <Link className={styles.btnSecondary} to="/docs/p1-01-RGB全彩LED调色/">
              直接进入一期实验
            </Link>
            <a className={styles.btnGhost} href="#kit-explorer">
              查看实验套件与接线 ↓
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
            <span className={styles.sectionEyebrow}>课程路线</span>
            <h2 id="roadmap-title" className={styles.sectionTitle}>从共同准备进入三期课程</h2>
            <p className={styles.sectionDesc}>
              三期课程共用同一套板卡认识、JTAG 烧录与串口日志通道。建议先完成开始之前的准备步骤，再按学习目标进入对应阶段。
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
                  确认工程目录、板卡供电与 BOOT 状态、OpenOCD 驱动以及串口终端参数。
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
            <span className={styles.sectionEyebrow}>实验套件</span>
            <h2 id="explorer-title" className={styles.sectionTitle}>一期外设模块与底板接线</h2>
            <p className={styles.sectionDesc}>
              点击底板上的插座（<code>M1</code>–<code>M13</code>）或中央 <strong>HPM6E70 核心板</strong>，可查看对应模块的信号引脚、供电电压、共用引脚冲突说明与编译烧录命令。
            </p>
          </div>
          <Link className={styles.sectionLink} to="/docs/p1-00-认识实验套件/">
            查看引脚复用总表 →
          </Link>
        </div>

        <KitExplorer mode="explorer" />
      </section>

      {/* Section 3: Pre-Flight & Workspace */}
      <section id="preflight" className={styles.sectionBlock} aria-labelledby="preflight-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <span className={styles.sectionEyebrow}>课程说明</span>
            <h2 id="preflight-title" className={styles.sectionTitle}>开始课程前与工程目录</h2>
            <p className={styles.sectionDesc}>
              一、二期提供配好工具链的完整工程包；开始前请确认硬件连接条件，并分清源码工程目录与文档目录。
            </p>
          </div>
        </div>

        <div className={styles.preflightGrid}>
          <div className={styles.preflightCard}>
            <div className={styles.preflightHeader}>
              <h3 className={styles.preflightTitle}>软硬件与前置条件</h3>
              <span className={styles.preflightSub}>按步骤完成硬件连接与真机验证</span>
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
              <strong className={styles.sdkCalloutTitle}>已经下载一、二期完整工程包</strong>
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
