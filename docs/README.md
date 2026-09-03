---
sidebar_position: 1
title: HPM6E70 Zephyr 教程
slug: /
hide_title: true
hide_table_of_contents: true
---

<section className="course-hero">
  <div className="course-hero__copy">
    <span className="course-hero__eyebrow">HPM6E70 Zephyr 教程</span>
    <h1>从驱动开发到完整工程</h1>
    <div className="course-hero__lead">
      一期以 HC-SR04 为主线，在现成工程中完成硬件描述、驱动、应用与真机测距；
      二期从工作区开始，逐层接通 SoC、Board、Flash 与 SDRAM。
    </div>
    <div className="course-hero__actions">
      <a className="course-button course-button--primary" href="/docs/common-01-准备开发环境/">从开发准备开始</a>
      <a className="course-button course-button--text" href="/docs/p1-01-从example-application认识标准工程/">已有完整工程，进入一期 →</a>
    </div>
    <div className="course-hero__facts" aria-label="课程特点">
      <span>Windows 10 / 11</span>
      <span>PowerShell 与 VS Code</span>
      <span>每一步真机验证</span>
    </div>
  </div>

  <figure className="course-hero__visual">
    <div className="course-hero__image">
      <img src="/img/hpm6e70-phase1-kit.jpg" alt="HPM6E70 核心板、模块化底板与一期课程外设模块" />
    </div>
    <figcaption>
      <strong>一期实验套件</strong>
      <span>DshanMCU-HPM6E70 与模块化底板</span>
    </figcaption>
  </figure>
</section>

## 你会建立的四种能力

<div className="course-capabilities">
  <div>
    <span>01</span>
    <strong>从硬件找到配置</strong>
    <span className="course-capabilities__description">沿着原理图、引脚和控制器，把真实连接写进 Devicetree。</span>
  </div>
  <div>
    <span>02</span>
    <strong>完成 Zephyr 驱动</strong>
    <span className="course-capabilities__description">理解 Binding、Kconfig、CMake、设备实例与驱动 API 怎样配合。</span>
  </div>
  <div>
    <span>03</span>
    <strong>让应用使用设备</strong>
    <span className="course-capabilities__description">通过统一 API 获取设备、采集数据，并把结果变成可观察的日志。</span>
  </div>
  <div>
    <span>04</span>
    <strong>验证完整工程</strong>
    <span className="course-capabilities__description">从构建产物追踪配置是否生效，再通过烧录、串口和实物现象验收。</span>
  </div>
</div>

## 从共同准备进入两条路线

两期课程共用同一套开发环境、板卡认识、JTAG 和串口连接。先完成共同准备，再根据目标进入一期或二期。

<a className="course-prep" href="/docs/common-01-准备开发环境/">
  <span className="course-prep__index">00</span>
  <span className="course-prep__body">
    <small>两期共用</small>
    <strong>准备开发环境与硬件观察通道</strong>
    <span>确认工程包、开发工具、HPM6E70 板卡、JTAG 驱动和串口日志。</span>
  </span>
  <b>打开准备课程 →</b>
</a>

<div className="course-track-grid">
  <a className="course-track-card course-track-card--featured" href="/docs/p1-01-从example-application认识标准工程/">
    <span className="course-track-card__index">01</span>
    <small>一期 · 先学会开发</small>
    <strong>驱动、应用与设备树</strong>
    <span className="course-track-card__description">使用已经搭好的工程，以 HC-SR04 为主线完成一个外设从硬件描述到应用测距的全过程。</span>
    <b>进入一期课程 →</b>
  </a>
  <a className="course-track-card" href="/docs/p2-01-搭建SDK-Glue工作区/">
    <span className="course-track-card__index">02</span>
    <small>二期 · 再理解工程怎样组成</small>
    <strong>从零搭建完整工程</strong>
    <span className="course-track-card__description">从 west 工作区开始，依次建立 SoC、Board、启动链、Flash 与 SDRAM 支持。</span>
    <b>进入二期课程 →</b>
  </a>
</div>

## 一期的开发流程

一期不会要求你先搭建一块空白 Board。每一阶段只增加一个可验证结果，最后把它们组合成能够测距的应用。

<div className="course-flow" aria-label="一期模块开发流程">
  <div><span>01</span><strong>确认硬件信号</strong><small>TRIG、ECHO 与 GPIO</small></div>
  <div><span>02</span><strong>描述设备节点</strong><small>overlay 与 Binding</small></div>
  <div><span>03</span><strong>注册并实现驱动</strong><small>Kconfig、CMake 与驱动 API</small></div>
  <div><span>04</span><strong>编写应用</strong><small>获取设备并读取距离</small></div>
  <div><span>05</span><strong>构建和真机验证</strong><small>烧录、日志与测距结果</small></div>
</div>

## 开始课程前

<div className="course-requirements">
  <div>
    <strong>硬件</strong>
    <span className="course-requirements__description">DshanMCU-HPM6E70 开发板、CH347F 调试器（V12）和 USB 线。</span>
  </div>
  <div>
    <strong>开发主机</strong>
    <span className="course-requirements__description">Windows 10/11。课程同时提供 PowerShell 命令和 VS Code 操作方式。</span>
  </div>
  <div>
    <strong>已有知识</strong>
    <span className="course-requirements__description">能够阅读基础 C 代码并执行命令；不要求提前接触过 Zephyr。</span>
  </div>
</div>

:::tip[已经下载完整工程包]
完整工程包已经包含课程需要的源码与开发环境，可以跳过软件安装，先完成板卡、JTAG 和串口检查，再进入一期。只有下载纯源码或工程中的 `.venv`、`sdk_env` 无法使用时，才需要重新搭建环境。
:::

## 工程目录

后续操作涉及两个彼此独立的目录：`HPM6E70/` 保存 Zephyr 工程、板级支持和应用源码，`zephyr-docs/` 保存教程网站。课程中的构建、烧录和调试命令默认从 `HPM6E70/` 根目录执行。

依赖版本由工程中的 west manifest 固定。完成准备后，先从[认识 Zephyr 与工程模型](./common-02-认识Zephyr与工程模型/README.md)了解这些目录由谁使用，再进入一期或二期。
