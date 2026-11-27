import React from 'react';
import Link from '@docusaurus/Link';
import YuzukiBoardStage from './YuzukiBoardStage';
import DemoShowcase from './DemoShowcase';
import styles from './styles.module.css';

const HERO_STATS = [
  { value: '17 个', label: '真机验证应用' },
  { value: '20 篇', label: '驱动与组件手册' },
  { value: 'Zephyr 4.5', label: '免配置独立工程' },
];

const PREP_STEPS = [
  { num: '01', label: '连接开发板与串口', to: '/docs/yuzukineko/start/hardware-and-uart' },
  { num: '02', label: '烧录第一个体验固件', to: '/docs/yuzukineko/start/flash-first-firmware' },
  { num: '03', label: '获取工程与编译烧录', to: '/docs/yuzukineko/start/get-sdk-and-build' },
];

const PHASE_TRACKS = [
  {
    themeClass: styles.trackPhase1,
    phase: '第一期',
    count: '17 个 Demo',
    title: '应用快速体验',
    description: '免搭编译环境，下载预编译整片镜像并用 LYNX Imager 写入，快速体验无线投屏、在线视频、图形界面与游戏模拟。',
    tags: ['Android / Miracast / iOS 投屏', 'NekoBox / Bilibili / MP4', 'LVGL / PocketJS / 模拟器 / ncnn'],
    primaryLabel: '浏览 17 个应用 →',
    primaryTo: '/docs/yuzukineko/demos/overview',
    secondaryLabel: '首次烧录向导',
    secondaryTo: '/docs/yuzukineko/start/flash-first-firmware',
  },
  {
    themeClass: styles.trackPhase2,
    phase: '第二期',
    count: '工程 + 源码 + 手册',
    title: '工程与外设开发',
    description: '拆解 f101-zephyr 工作区与 yuzukineko_base 设备树，深入 17 个综合应用源码详解以及 20 篇驱动与组件参考。',
    tags: ['工作区与设备树范式', '17 篇综合应用源码详解', '12 篇外设驱动 + 8 篇协议栈'],
    primaryLabel: '进入二期开发 →',
    primaryTo: '/docs/yuzukineko/dev/zephyr/guide/workspace-and-first-app',
    secondaryLabel: 'GPIO 手册',
    secondaryTo: '/docs/yuzukineko/dev/zephyr/drivers/gpio',
  },
  {
    themeClass: styles.trackPhase3,
    phase: '硬件参考',
    count: '5 篇资料',
    title: '硬件资料与参考',
    description: '集中收录 YuzukiNeko 与 YuzukiCube-M 底板规格、版本勘误、引脚复用 (MUX)、Flash 布局与进阶调试，以及原理图与硬件资料下载。',
    tags: ['YuzukiCube-M 底板与勘误', '引脚排布与外设复用', 'Flash 布局 / 原理图下载'],
    primaryLabel: '查阅底板资料 →',
    primaryTo: '/docs/yuzukineko/baseboard',
    secondaryLabel: '引脚复用速查',
    secondaryTo: '/docs/yuzukineko/hardware/pinout',
  },
];

export default function YuzukiNekoHome() {
  return (
    <div className={styles.portal}>
      {/* Hero Banner + Interactive Hardware Stage */}
      <section className={styles.hero} aria-labelledby="yn-hero-title">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowPill}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span>YuzukiNeko · Allwinner F101S3 · Zephyr 4.5.0</span>
          </div>

          <h1 id="yn-hero-title" className={styles.heroTitle}>
            YuzukiNeko
            <br />
            <span className={styles.heroTitleAccent}>Zephyr 实战教程</span>
          </h1>

          <p className={styles.heroLead}>
            基于全志 F101S3（玄铁 C907 RISC-V）的 YuzukiNeko 与 YuzukiCube-M 底板，随附免配置自包含工程，一站式覆盖 17 个实测多媒体应用、Zephyr 4.5.0 二次开发与片上外设驱动参考。
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to="/docs/yuzukineko/start/hardware-and-uart">
              开始之前准备 →
            </Link>
            <Link className={styles.btnSecondary} to="/docs/yuzukineko/demos/overview">
              体验 17 个 Demo
            </Link>
            <a
              className={styles.btnGhost}
              href="https://yuzukihd.github.io/YuzukiNeko/zh"
              target="_blank"
              rel="noopener noreferrer"
            >
              原文档站 ↗
            </a>
          </div>

          <div className={styles.heroStats} aria-label="教程核心规格">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className={styles.heroStatItem}>
                <strong className={styles.heroStatValue}>{stat.value}</strong>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <YuzukiBoardStage />
      </section>

      {/* Section 1: Roadmap */}
      <section id="roadmap" className={styles.sectionBlock} aria-labelledby="yn-roadmap-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <span className={styles.sectionEyebrow}>LEARNING PATH</span>
            <h2 id="yn-roadmap-title" className={styles.sectionTitle}>学习路线</h2>
          </div>
          <a
            className={styles.sectionLink}
            href="https://yuzukihd.github.io/YuzukiNeko/zh"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看原版完整文档（含原章节）↗
          </a>
        </div>

        <div className={styles.prepCard}>
          <div className={styles.prepTop}>
            <div className={styles.prepIntro}>
              <span className={styles.prepBadge} aria-hidden="true">00</span>
              <div className={styles.prepText}>
                <h3 className={styles.prepTitle}>开始之前 · 接线、首次烧录与工程编译</h3>
                <p className={styles.prepSubtitle}>三步完成串口接线、LYNX Imager 装驱动并首次烧录、以及自包含工程本地编译。</p>
              </div>
            </div>
            <Link className={styles.prepAction} to="/docs/yuzukineko/start/hardware-and-uart">
              从第 1 步开始 →
            </Link>
          </div>

          <div className={styles.prepSteps}>
            {PREP_STEPS.map((step) => (
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
              <h3 className={styles.trackTitle}>{track.title}</h3>
              <p className={styles.trackDesc}>{track.description}</p>
              <div className={styles.trackTags}>
                {track.tags.map((tag) => (
                  <span key={tag} className={styles.trackTag}>{tag}</span>
                ))}
              </div>
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

      {/* Section 2: Interactive 17-Demo Showcase */}
      <section id="demos" className={styles.sectionBlock} aria-labelledby="yn-demos-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <span className={styles.sectionEyebrow}>VERIFIED DEMOS · ZEPHYR 4.5.0</span>
            <h2 id="yn-demos-title" className={styles.sectionTitle}>17 个实测应用展厅</h2>
            <p className={styles.sectionDesc}>
              全部应用均已在 YuzukiNeko + YuzukiCube-M 底板实机验证，支持预编译整片镜像直刷或一键脚本编译打包。
            </p>
          </div>
          <Link className={styles.sectionLink} to="/docs/yuzukineko/demos/overview">
            预编译固件与命令总表 →
          </Link>
        </div>

        <DemoShowcase />
      </section>

      {/* Section 3: Open-Source Repositories & Upstream Attribution */}
      <section className={styles.metaStrip} aria-label="配套代码仓库与原文档说明">
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>配套内核仓库</span>
          <a
            className={styles.metaLink}
            href="https://github.com/dshanpi/yuzukihdneko-zephyr"
            target="_blank"
            rel="noopener noreferrer"
          >
            dshanpi/yuzukihdneko-zephyr ↗
          </a>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>配套组件仓库</span>
          <a
            className={styles.metaLink}
            href="https://github.com/dshanpi/zephyr-components"
            target="_blank"
            rel="noopener noreferrer"
          >
            dshanpi/zephyr-components ↗
          </a>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>原版在线文档（含 Linux / Asterinas / 外壳等原章节）</span>
          <a
            className={styles.metaLink}
            href="https://yuzukihd.github.io/YuzukiNeko/zh"
            target="_blank"
            rel="noopener noreferrer"
          >
            yuzukihd.github.io/YuzukiNeko/zh ↗
          </a>
        </div>
      </section>
    </div>
  );
}
