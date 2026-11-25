import React from 'react';
import Link from '@docusaurus/Link';
import KitExplorer from '@site/src/components/KitExplorer';
import HeroBoardStage from './HeroBoardStage';
import styles from './styles.module.css';

const HERO_STATS = [
  { value: '14 节', label: '一期快速体验' },
  { value: '25 节', label: '二期驱动与Demo' },
  { value: '11 节', label: '三期板级移植' },
];

const COMMON_STEPS = [
  { num: '01', label: '连接调试器与串口', to: '/docs/start-01-连接调试器与串口/' },
  { num: '02', label: '安装 USBToolBox 与驱动', to: '/docs/start-02-安装USBToolBox与驱动/' },
  { num: '03', label: '烧录第一个闪灯程序', to: '/docs/start-03-烧录第一个闪灯程序/' },
  { num: '04', label: '获取源码与编译烧录', to: '/docs/start-04-获取源码与编译烧录/' },
];

const PHASE_TRACKS = [
  {
    themeClass: styles.trackPhase1,
    phase: '第一期',
    count: '14 节',
    title: '外设模块快速体验',
    description: '免搭编译环境，下载 .hex 固件用 USBToolBox 直接烧录。',
    tags: ['OLED / RGB / 蜂鸣器', '温湿度 / 测距 / 姿态', '编码器 / 红外 / W25Q64'],
    primaryLabel: '开始体验 →',
    primaryTo: '/docs/p1-01-OLED双色屏显示/',
    secondaryLabel: '套件接线',
    secondaryTo: '/docs/p1-00-认识实验套件/',
  },
  {
    themeClass: styles.trackPhase2,
    phase: '第二期',
    count: '25 节',
    title: '驱动、应用与设备树',
    description: '掌握设备树与驱动模型，拆解 14 个外设 Demo 源码与编译。',
    tags: ['工程结构与设备树', '自定义传感器驱动', '14 个 Demo 源码详解'],
    primaryLabel: '进入二期 →',
    primaryTo: '/docs/p2-01-从example-application认识标准工程/',
    secondaryLabel: '认识板卡',
    secondaryTo: '/docs/common-03-认识HPM6E70板卡/',
  },
  {
    themeClass: styles.trackPhase3,
    phase: '第三期',
    count: '11 节',
    title: '从零搭建完整工程',
    description: '从空白工作区建立 SoC、Board、XPI Flash 与 SDRAM 支持。',
    tags: ['SDK Glue 工作区', 'Board 与 UART0', 'XPI NOR 与 SDRAM'],
    primaryLabel: '进入三期 →',
    primaryTo: '/docs/p3-01-搭建SDK-Glue工作区/',
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
            HPM6E70
            <br />
            <span className={styles.heroTitleAccent}>Zephyr 实战教程</span>
          </h1>

          <p className={styles.heroLead}>
            基于 DshanMCU-HPM6E70 核心板与扩展底板，覆盖外设体验、驱动开发与板级移植。
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to="/docs/start-01-连接调试器与串口/">
              开始之前准备 →
            </Link>
            <Link className={styles.btnSecondary} to="/docs/p1-01-OLED双色屏显示/">
              快速体验外设
            </Link>
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
            <h2 id="roadmap-title" className={styles.sectionTitle}>课程路线</h2>
          </div>
        </div>

        <div className={styles.prepCard}>
          <div className={styles.prepTop}>
            <div className={styles.prepIntro}>
              <span className={styles.prepBadge} aria-hidden="true">00</span>
              <div className={styles.prepText}>
                <h3 className={styles.prepTitle}>开始之前 · 接线、烧录与源码编译</h3>
              </div>
            </div>
            <Link className={styles.prepAction} to="/docs/start-01-连接调试器与串口/">
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

      {/* Section 2: Interactive Kit Explorer */}
      <section id="kit-explorer" className={styles.sectionBlock} aria-labelledby="explorer-title">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderMain}>
            <h2 id="explorer-title" className={styles.sectionTitle}>实验套件与底板接线</h2>
          </div>
          <Link className={styles.sectionLink} to="/docs/p1-00-认识实验套件/">
            引脚复用与固件总表 →
          </Link>
        </div>

        <KitExplorer mode="explorer" />
      </section>
    </div>
  );
}
