---
sidebar_position: 0
sidebar_label: 课程介绍
title: RA6M5 Zephyr 快速入门
slug: /ra6m5/
hide_title: true
hide_table_of_contents: true
---

import Link from '@docusaurus/Link';
import styles from './overview.module.css';

<div className={styles.overview}>
  <section className="course-hero" aria-labelledby="ra6m5-course-title">
    <div className="course-hero__copy">
      <span className="course-hero__eyebrow">RA6M5 Zephyr 快速入门</span>
      <h1 id="ra6m5-course-title">从应用开发到设备驱动</h1>
      <p className="course-hero__lead">从官方 example-application 开始，掌握 Zephyr 工程、设备树与配置，逐步编写应用和设备驱动，在 RA6M5 开发板上完成编译、烧录与调试。</p>
      <div className="course-hero__actions">
        <Link className="course-button course-button--primary" to="/docs/ra6m5/preparation/project-and-board/">从学习准备开始</Link>
        <Link className="course-button course-button--text" to="/docs/ra6m5/application/example-application/">已完成准备，进入第 1 章 →</Link>
      </div>
      <div className="course-hero__facts" aria-label="课程特点">
        <span>配套完整工程</span>
        <span>板载外设实验</span>
        <span>逐步编写代码</span>
      </div>
    </div>
    <figure className="course-hero__visual">
      <div className="course-hero__image">
        <img src={require('./images/ra6m5-board-front.jpg').default} alt="DShanMCU RA6M5 开发板正面实物图" />
      </div>
      <figcaption>
        <strong>DShanMCU RA6M5 开发板</strong>
        <span>板载外设与调试器 · 一根 USB 数据线连接电脑</span>
      </figcaption>
    </figure>
  </section>

  <section aria-labelledby="ra6m5-capabilities">
    <h2 id="ra6m5-capabilities">你会掌握的四项能力</h2>
    <div className="course-capabilities">
      <div>
        <span>01</span>
        <strong>组织 Zephyr 应用</strong>
        <p>理解工作区与应用目录，通过 CMake 加入源码，用 Kconfig 选择软件功能。</p>
      </div>
      <div>
        <span>02</span>
        <strong>配置并使用设备</strong>
        <p>从设备树找到设备实例，启用驱动，通过统一 API 完成设备访问。</p>
      </div>
      <div>
        <span>03</span>
        <strong>编写 Zephyr 驱动</strong>
        <p>连接 Binding、设备注册、初始化与事件上报，将自定义驱动接入工程。</p>
      </div>
      <div>
        <span>04</span>
        <strong>构建、调试与验证</strong>
        <p>核对生成的配置与设备树，结合断点、串口日志和实物现象检查程序。</p>
      </div>
    </div>
  </section>

  <section aria-labelledby="ra6m5-curriculum">
    <h2 id="ra6m5-curriculum">课程安排</h2>
    <div className={styles.stages}>
      <section className={styles.stage} aria-labelledby="ra6m5-preparation">
        <span className={styles.stageNumber} aria-hidden="true">00</span>
        <div className={styles.stageIntro}>
          <h3 id="ra6m5-preparation">学习准备</h3>
          <p>获取课程工程，连接开发板，掌握后续各章共用的开发操作。</p>
        </div>
        <ul className={styles.lessons}>
          <li><Link to="/docs/ra6m5/preparation/project-and-board/">准备工程与连接开发板<span aria-hidden="true">→</span></Link></li>
          <li><Link to="/docs/ra6m5/preparation/build-flash-debug/">编译、烧录与调试程序<span aria-hidden="true">→</span></Link></li>
        </ul>
      </section>
      <section className={styles.stage} aria-labelledby="ra6m5-application">
        <span className={styles.stageNumber} aria-hidden="true">01</span>
        <div className={styles.stageIntro}>
          <span className={styles.stageLabel}>第一篇</span>
          <h3 id="ra6m5-application">Zephyr 应用开发</h3>
          <p>从 example-application 认识工程，编写应用并通过设备接口访问板载器件。</p>
        </div>
        <ul className={styles.lessons}>
          <li><Link to="/docs/ra6m5/application/example-application/">1. 从 example-application 认识 Zephyr 工程<span aria-hidden="true">→</span></Link></li>
          <li><Link to="/docs/ra6m5/application/first-application/">2. 编写第一个 Zephyr 应用<span aria-hidden="true">→</span></Link></li>
          <li><Link to="/docs/ra6m5/application/devicetree-and-device-model/">3. Zephyr 设备驱动的使用<span aria-hidden="true">→</span></Link></li>
        </ul>
      </section>
      <section className={styles.stage} aria-labelledby="ra6m5-drivers">
        <span className={styles.stageNumber} aria-hidden="true">02</span>
        <div className={styles.stageIntro}>
          <span className={styles.stageLabel}>第二篇</span>
          <h3 id="ra6m5-drivers">Zephyr 驱动开发</h3>
          <p>沿已有驱动理解设备模型，再逐步完成自定义驱动与应用的配合。</p>
        </div>
        <ul className={styles.lessons}>
          <li><Link to="/docs/ra6m5/drivers/framework/">4. Zephyr 设备驱动模型<span aria-hidden="true">→</span></Link></li>
          <li><Link to="/docs/ra6m5/drivers/implementation-and-registration/">5. 编写第一个 Zephyr 设备驱动<span aria-hidden="true">→</span></Link></li>
        </ul>
      </section>
    </div>
  </section>

  <section aria-labelledby="ra6m5-references">
    <h2 id="ra6m5-references">工程参考</h2>
    <div className={styles.referenceLinks}>
      <Link to="/docs/ra6m5/reference/hardware/"><strong>RA6M5 芯片与硬件<span aria-hidden="true">→</span></strong><span>芯片规格、瑞萨官方框图与板载接口。</span></Link>
      <Link to="/docs/ra6m5/reference/examples/"><strong>配套示例详解<span aria-hidden="true">→</span></strong><span>按功能查看 9 个应用的用途、操作和运行结果。</span></Link>
    </div>
  </section>

  <section aria-labelledby="ra6m5-requirements">
    <h2 id="ra6m5-requirements">开始课程前</h2>
    <div className="course-requirements">
      <div>
        <strong>硬件</strong>
        <span className="course-requirements__description">DShanMCU RA6M5 开发板与一根支持数据传输的 USB Type-C 线。</span>
      </div>
      <div>
        <strong>开发主机</strong>
        <span className="course-requirements__description">Windows 电脑与 VS Code，使用课程工程配套的开发工具和板卡支持。</span>
      </div>
      <div>
        <strong>已有知识</strong>
        <span className="course-requirements__description">能够编写 C 程序，了解 RTOS 中线程、消息队列和中断的基本用法。</span>
      </div>
    </div>
    <div className={styles.startRow}>
      <p>准备好开发板，开始第一个 Zephyr 工程。</p>
      <Link className="course-button course-button--primary" to="/docs/ra6m5/preparation/project-and-board/">准备工程与连接开发板 →</Link>
    </div>
  </section>
</div>
