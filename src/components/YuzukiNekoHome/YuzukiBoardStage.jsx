import React, { useState } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const CORE_LENSES = [
  {
    id: 'all',
    label: '全板总览',
    telemetryCode: 'board: yuzukineko (F101S3)',
    telemetryText: '玄铁 C907 RISC-V · 16MiB PSRAM · 16MiB XIP NOR · VDEC/G2D',
    linkLabel: '板卡硬件概览 →',
    linkTo: '/docs/yuzukineko/hardware/overview',
  },
  {
    id: 'boot',
    label: '下载启动',
    telemetryCode: 'boot: 按住 FEL 键 + USB-C → SPIF NOR (0x0)',
    telemetryText: '支持 LYNX Imager / xfel 写入 zephyr-full.img、RAM 调试与 XIP 就地执行',
    linkLabel: '首次烧录指南 →',
    linkTo: '/docs/yuzukineko/start/flash-first-firmware',
  },
  {
    id: 'media',
    label: '多媒体',
    telemetryCode: 'media: VDEC H.264 + G2D + Codec',
    telemetryText: '硬件 H.264/JPEG/PNG 解码、2D 旋转混合加速与片上音频 Codec',
    linkLabel: '视频引擎手册 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/drivers/vdec',
  },
];

const BASE_LENSES = [
  {
    id: 'all',
    label: '全板总览',
    telemetryCode: 'board: yuzukineko_base (YuzukiCube-M V1.0)',
    telemetryText: 'MIPI DSI 彩屏触摸 · AIC8800D80 Wi-Fi 6/BT · 功放 · UART1 · CAN',
    linkLabel: '底板详细说明 →',
    linkTo: '/docs/yuzukineko/baseboard',
  },
  {
    id: 'debug',
    label: '接线调试',
    telemetryCode: 'console: CN2 UART1 (PB0/PB1, 115200 8N1)',
    telemetryText: '接入底板 CN2 串口查看日志，SW1（PD5）可作用户按键或 UF2 触发键',
    linkLabel: '串口接线指南 →',
    linkTo: '/docs/yuzukineko/start/hardware-and-uart',
  },
  {
    id: 'media',
    label: '显示无线',
    telemetryCode: 'io: FPC1 (DSI+GT967) · U3 (AIC8800D80) · U2 (LPA4890)',
    telemetryText: '40Pin 彩屏与电容触摸、Wi-Fi 6/蓝牙及 IPEX 天线、板载功放扬声器',
    linkLabel: '体验 17 个 Demo →',
    linkTo: '/docs/yuzukineko/demos/overview',
  },
];

/*
 * Core board render image (800x861) placed at x=290, y=184, w=660, h=710.
 */
const CORE_NODES = [
  {
    id: 'usbc',
    lenses: ['all', 'boot'],
    accent: 'var(--node-usbc)',
    tag: 'USB-C + FEL 按键',
    title: '供电与下载烧录',
    card: { x: 18, y: 16, w: 386, h: 128 },
    reticle: { x1: 394, y1: 184, x2: 520, y2: 306 },
    secondaryReticle: { x1: 486, y1: 633, x2: 546, y2: 720 },
    dashedBoxes: false,
    anchor: { x: 457, y: 184 },
    points: '211,144 211,164 457,164 457,184',
    telemetryCode: 'boot: 按住 FEL 键 + 插 USB-C (1f3a:efe8)',
    telemetryText: '按住板载 FEL 键上电进入 BROM 下载模式，支持 LYNX Imager / xfel 烧录与 USB 副屏',
    linkLabel: '烧录第一个固件 →',
    linkTo: '/docs/yuzukineko/start/flash-first-firmware',
  },
  {
    id: 'soc',
    lenses: ['all', 'media'],
    accent: 'var(--node-soc)',
    tag: 'C907 RVV · 16MiB PSRAM',
    title: 'Allwinner F101S3 主控',
    card: { x: 427, y: 16, w: 386, h: 128 },
    reticle: { x1: 402, y1: 469, x2: 507, y2: 578 },
    anchor: { x: 507, y: 524 },
    points: '620,144 620,524 507,524',
    telemetryCode: 'soc: sun252i_f101 (rv32imafdcv)',
    telemetryText: '合封 16MiB PSRAM、硬件 H.264/JPEG 解码引擎 VDEC 与 G2D 加速器',
    linkLabel: '芯片规格概览 →',
    linkTo: '/docs/yuzukineko/hardware/overview',
  },
  {
    id: 'base',
    lenses: ['all'],
    accent: 'var(--node-bus)',
    tag: '2×20 邮票孔 · 底板',
    title: 'YuzukiCube-M 扩展',
    card: { x: 836, y: 16, w: 386, h: 128 },
    reticle: { x1: 878, y1: 224, x2: 927, y2: 884 },
    secondaryReticle: { x1: 642, y1: 224, x2: 683, y2: 884 },
    anchor: { x: 903, y: 224 },
    points: '1029,144 1029,186 903,186 903,224',
    telemetryCode: 'board: yuzukineko_base (MIPI DSI + Wi-Fi)',
    telemetryText: '扩展 40Pin 彩屏触摸、AIC8800D80 Wi-Fi/BT、UART1 控制台与 CAN',
    linkLabel: '底板接口说明 →',
    linkTo: '/docs/yuzukineko/baseboard',
  },
  {
    id: 'nor',
    lenses: ['all', 'boot'],
    accent: 'var(--node-nor)',
    tag: 'SPIF · 16MiB NOR',
    title: 'XIP 启动闪存',
    card: { x: 18, y: 976, w: 386, h: 128 },
    reticle: { x1: 388, y1: 638, x2: 460, y2: 714 },
    anchor: { x: 388, y: 676 },
    points: '211,976 211,676 388,676',
    telemetryCode: 'flash: 16MiB SPI NOR (100MHz XIP)',
    telemetryText: '存放 SyterKit 引导与整片镜像，支持 NekoBox / Bilibili XIP 运行',
    linkLabel: 'Flash 布局与备份 →',
    linkTo: '/docs/yuzukineko/boot/flash-layout',
  },
  {
    id: 'sd',
    lenses: ['all', 'boot', 'media'],
    accent: 'var(--node-sd)',
    tag: 'SMHC0 · 4-bit SD',
    title: 'microSD 扩展卡槽',
    card: { x: 427, y: 976, w: 386, h: 128 },
    reticle: { x1: 370, y1: 757, x2: 536, y2: 839 },
    anchor: { x: 453, y: 839 },
    points: '620,976 620,926 453,926 453,839',
    telemetryCode: 'dts: &smhc0 (25MHz FATFS /SD:)',
    telemetryText: '存放本地 MP4 视频、游戏 ROM、DLNA 缓存与 Wi-Fi 配置文件',
    linkLabel: 'SD 与文件系统 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/components/sd',
  },
  {
    id: 'audio',
    lenses: ['all', 'media'],
    accent: 'var(--node-audio)',
    tag: 'Codec · HPOUT / PA0–3',
    title: '模拟音频输出焊盘',
    card: { x: 836, y: 976, w: 386, h: 128 },
    reticle: { x1: 748, y1: 768, x2: 821, y2: 879 },
    anchor: { x: 785, y: 879 },
    points: '1029,976 1029,926 785,926 785,879',
    telemetryCode: 'audio: HPOUT (片上 Codec 输出) · PA0–PA3',
    telemetryText: 'YuzukiNeko 仅通过背面焊盘引出片上 Codec 模拟音频 HPOUT，扬声器功放 U2 (LPA4890) 位于 YuzukiCube-M 底板',
    linkLabel: 'AUDIO 驱动手册 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/drivers/audio',
  },
];

/*
 * Baseboard transparent WebP (1200x966) placed at x=170, y=200, w=900, h=724 (scale=0.75).
 * SVG coords = (170 + imgX * 0.75, 200 + imgY * 0.75).
 */
const BASE_NODES = [
  {
    id: 'can',
    lenses: ['all', 'debug'],
    accent: 'var(--node-can)',
    tag: 'CN1 + U5 · TJA1051T/3',
    title: 'CAN 总线接口',
    card: { x: 18, y: 16, w: 386, h: 128 },
    reticle: { x1: 233, y1: 202, x2: 353, y2: 353 },
    anchor: { x: 293, y: 202 },
    points: '211,144 211,174 293,174 293,202',
    telemetryCode: 'can0: PB2/PB3 → U5 TJA1051T/3 → CN1 (1:CANH, 2:CANL)',
    telemetryText: '高速 CAN 收发器（含 100Ω 分裂终端与 4.7µF 滤波），经左上角 2Pin CN1 引出差分总线',
    linkLabel: '底板 CAN 说明 →',
    linkTo: '/docs/yuzukineko/baseboard',
  },
  {
    id: 'dsi',
    lenses: ['all', 'media'],
    accent: 'var(--node-nor)',
    tag: 'FPC1 · MIPI DSI + GT967',
    title: '40Pin 彩屏与触摸',
    card: { x: 427, y: 16, w: 386, h: 128 },
    reticle: { x1: 398, y1: 204, x2: 786, y2: 432 },
    anchor: { x: 620, y: 204 },
    points: '620,144 620,204',
    telemetryCode: 'display: 4-lane MIPI DSI · GT967 (TWI1) · PWM0-2 (PD22)',
    telemetryText: '单根 40 脚排线同时传输高速 MIPI DSI 显示、电容触摸与 RY3730 背光供电',
    linkLabel: '显示驱动手册 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/drivers/display',
  },
  {
    id: 'amp',
    lenses: ['all', 'media'],
    accent: 'var(--node-audio)',
    tag: 'CN3 + U2 · LPA4890',
    title: '功放与扬声器接口',
    card: { x: 836, y: 16, w: 386, h: 128 },
    reticle: { x1: 892, y1: 202, x2: 1004, y2: 356 },
    anchor: { x: 948, y: 202 },
    points: '1029,144 1029,174 948,174 948,202',
    telemetryCode: 'audio: HPOUT → U2 LPA4890 (PD4) → CN3 (1:SPKR-, 2:SPKR+)',
    telemetryText: '音频功放使能脚接 PD4，经右上角 CN3 2Pin 接口直接驱动外接扬声器',
    linkLabel: 'AUDIO 驱动手册 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/drivers/audio',
  },
  {
    id: 'wifi',
    lenses: ['all', 'media'],
    accent: 'var(--node-soc)',
    tag: 'U3 + RF1 · AIC8800D80',
    title: 'Wi-Fi 6 与天线座',
    card: { x: 18, y: 976, w: 290, h: 128 },
    reticle: { x1: 196, y1: 408, x2: 366, y2: 568 },
    secondaryReticle: { x1: 206, y1: 634, x2: 268, y2: 691 },
    dashedBoxes: false,
    anchor: { x: 196, y: 488 },
    points: '92,976 92,488 196,488',
    telemetryCode: 'sdio: &smhc2 (PE0–PE5) · WL-REG-ON (PE10) · RF1 IPEX',
    telemetryText: '板载 AIC8800D80 无线模块与 RF1 IPEX 天线座，支持 STA、P2P Miracast 与蓝牙',
    linkLabel: 'AIC8800 Wi-Fi 手册 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/components/aic8800-wifi',
  },
  {
    id: 'sw1',
    lenses: ['all', 'debug'],
    accent: 'var(--node-bus)',
    tag: 'SW1 · DOWN (PD5)',
    title: '用户与 UF2 按键',
    card: { x: 322, y: 976, w: 290, h: 128 },
    reticle: { x1: 168, y1: 726, x2: 282, y2: 860 },
    anchor: { x: 225, y: 860 },
    points: '467,976 467,946 225,946 225,860',
    telemetryCode: 'dts: aliases { sw0 = &btn_down; } (PD5, 低有效上拉)',
    telemetryText: '在 yuzukineko_base 中映射为标准输入按键 sw0，同时也是 UF2 下载器触发键',
    linkLabel: 'GPIO 驱动手册 →',
    linkTo: '/docs/yuzukineko/dev/zephyr/drivers/gpio',
  },
  {
    id: 'slot',
    lenses: ['all', 'debug', 'media'],
    accent: 'var(--node-sd)',
    tag: 'U1 · 49 焊盘贴装位',
    title: 'YuzukiNeko 贴装位',
    card: { x: 626, y: 976, w: 290, h: 128 },
    reticle: { x1: 404, y1: 540, x2: 1046, y2: 856 },
    anchor: { x: 771, y: 856 },
    points: '771,976 771,856',
    telemetryCode: 'module: U1 YuzukiNeko-SMT (2×20 + 5 路模拟焊盘)',
    telemetryText: '承接 YuzukiNeko 全部数字总线与 HPOUT 音频信号，VSYS-5V 由 YuzukiNeko 的 USB-C 供给',
    linkLabel: '底板引脚与冲突表 →',
    linkTo: '/docs/yuzukineko/baseboard',
  },
  {
    id: 'uart',
    lenses: ['all', 'debug'],
    accent: 'var(--node-usbc)',
    tag: 'CN2 · UART1 / UART4',
    title: '5Pin 调试串口',
    card: { x: 930, y: 976, w: 290, h: 128 },
    reticle: { x1: 990, y1: 276, x2: 1070, y2: 438 },
    anchor: { x: 1070, y: 357 },
    points: '1148,976 1148,357 1070,357',
    telemetryCode: 'CN2: 1:U1-RX · 2:U1-TX · 3:U4-RX · 4:U4-TX · 5:GND',
    telemetryText: '引出 Zephyr 默认控制台 UART1（PB0/PB1）与 UART4（PD6/PD7），仅接 3.3V 串口',
    linkLabel: '串口接线指南 →',
    linkTo: '/docs/yuzukineko/start/hardware-and-uart',
  },
];

function renderCornerBrackets(rect, color, len = 22, strokeWidth = 4.2) {
  const { x1, y1, x2, y2 } = rect;
  const paths = [
    `M ${x1} ${y1 + len} L ${x1} ${y1} L ${x1 + len} ${y1}`,
    `M ${x2 - len} ${y1} L ${x2} ${y1} L ${x2} ${y1 + len}`,
    `M ${x1} ${y2 - len} L ${x1} ${y2} L ${x1 + len} ${y2}`,
    `M ${x2 - len} ${y2} L ${x2} ${y2} L ${x2} ${y2 - len}`,
  ];
  return paths.map((d, index) => (
    <g key={index}>
      <path
        d={d}
        fill="none"
        stroke="var(--stage-halo)"
        strokeWidth={strokeWidth + 3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  ));
}

export default function YuzukiBoardStage({
  defaultBoard = 'core',
  initialNode = null,
  focusNodes = null,
  focusTitle = '本体验使用接口',
  focusText = null,
  isHero = true,
}) {
  const coreImgUrl = useBaseUrl('/figures/yuzukineko-3d-render.webp');
  const baseImgUrl = useBaseUrl('/figures/yuzukicube-m-baseboard.webp');

  const hasFocus = Array.isArray(focusNodes) && focusNodes.length > 0;
  const [board, setBoard] = useState(defaultBoard);
  const [lens, setLens] = useState(hasFocus ? 'focus' : 'all');
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(initialNode);

  const isCore = board === 'core';
  const baseLenses = isCore ? CORE_LENSES : BASE_LENSES;
  const nodes = isCore ? CORE_NODES : BASE_NODES;
  const showFocusLens = hasFocus && board === defaultBoard;
  const focusLensObj = showFocusLens
    ? {
        id: 'focus',
        label: '本体验接口',
        telemetryCode: focusTitle,
        telemetryText:
          focusText ||
          nodes
            .filter((n) => focusNodes.includes(n.id))
            .map((n) => `${n.title}（${n.tag}）`)
            .join(' · '),
        linkLabel: isCore ? '板卡硬件概览 →' : '底板接口说明 →',
        linkTo: isCore ? '/docs/yuzukineko/hardware/overview' : '/docs/yuzukineko/baseboard',
      }
    : null;
  const lenses = focusLensObj ? [focusLensObj, ...baseLenses] : baseLenses;
  const activeInspectId = hoveredId || pinnedId;
  const activeLens = lenses.find((opt) => opt.id === lens) || lenses[0];
  const inspectedNode = nodes.find((node) => node.id === activeInspectId) || null;
  const telemetry = inspectedNode || activeLens;

  const handleSwitchBoard = (nextBoard) => {
    if (nextBoard === board) return;
    setBoard(nextBoard);
    setLens(hasFocus && nextBoard === defaultBoard ? 'focus' : 'all');
    setPinnedId(null);
    setHoveredId(null);
  };

  const handleSelectLens = (nextLens) => {
    setLens(nextLens);
    setPinnedId(null);
    setHoveredId(null);
  };

  const handleTogglePin = (nodeId) => {
    setPinnedId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleNodeKeyDown = (e, nodeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTogglePin(nodeId);
    }
  };

  return (
    <aside
      className={`${styles.heroStage} ${!isHero ? styles.stageEmbedded : ''}`}
      aria-label={isCore ? 'YuzukiNeko 硬件资源交互总览' : 'YuzukiCube-M 底板接口与器件交互总览'}
    >
      {isHero && (
        <Head>
          <link rel="preload" as="image" href={defaultBoard === 'core' ? coreImgUrl : baseImgUrl} fetchPriority="high" />
        </Head>
      )}
      <div className={styles.stageGridOverlay} aria-hidden="true" />

      <div className={styles.stageHeader}>
        <div className={styles.stageHeaderLeft}>
          <div className={styles.boardSwitch} role="group" aria-label="切换 YuzukiNeko 与 YuzukiCube-M 底板视图">
            <button
              type="button"
              aria-pressed={isCore}
              className={`${styles.boardSwitchBtn} ${isCore ? styles.boardSwitchBtnActive : ''}`}
              onClick={() => handleSwitchBoard('core')}
            >
              <span className={styles.stageBeacon} aria-hidden="true" />
              YuzukiNeko
            </button>
            <button
              type="button"
              aria-pressed={!isCore}
              className={`${styles.boardSwitchBtn} ${!isCore ? styles.boardSwitchBtnActive : ''}`}
              onClick={() => handleSwitchBoard('base')}
            >
              YuzukiCube-M
            </button>
          </div>
        </div>

        <div className={styles.lensTabs} role="tablist" aria-label="按功能视角筛选硬件资源">
          {lenses.map((opt) => {
            const isActive = lens === opt.id && !pinnedId;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={lens === opt.id}
                className={`${styles.lensBtn} ${isActive ? styles.lensBtnActive : ''}`}
                onClick={() => handleSelectLens(opt.id)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.stageSvgWrap}>
        <svg
          className={styles.stageSvg}
          viewBox="0 0 1240 1120"
          role="img"
          aria-label={isCore ? 'YuzukiNeko 正反面主要芯片与接口分布图' : 'YuzukiCube-M 底板实物接口与板载器件分布图'}
        >
          <defs>
            <filter id="yn-board-shadow" x="-12%" y="-12%" width="124%" height="130%">
              <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#0f2942" floodOpacity="0.2" />
            </filter>
            <filter id="yn-card-shadow" x="-12%" y="-18%" width="124%" height="144%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f2942" floodOpacity="0.09" />
            </filter>
            <radialGradient id="yn-core-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--stage-aura-core)" stopOpacity="0.17" />
              <stop offset="60%" stopColor="var(--stage-aura-core)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--stage-aura-core)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="yn-warm-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--stage-aura-warm)" stopOpacity="0.11" />
              <stop offset="65%" stopColor="var(--stage-aura-core)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="var(--stage-aura-core)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="460" cy="540" rx="280" ry="300" fill="url(#yn-core-aura)" />
          <ellipse cx="780" cy="540" rx="260" ry="290" fill="url(#yn-warm-aura)" />

          {isCore ? (
            <>
              <rect
                x="272"
                y="168"
                width="696"
                height="742"
                rx="28"
                fill="var(--stage-board-plate)"
                stroke="var(--stage-ring)"
                strokeWidth="1.8"
              />
              <image
                href={coreImgUrl}
                x="290"
                y="184"
                width="660"
                height="710"
                preserveAspectRatio="xMidYMid meet"
                filter="url(#yn-board-shadow)"
              />
            </>
          ) : (
            <image
              href={baseImgUrl}
              x="170"
              y="200"
              width="900"
              height="724"
              preserveAspectRatio="xMidYMid meet"
              filter="url(#yn-board-shadow)"
            />
          )}

          {nodes.map((node) => {
            const inLens =
              lens === 'focus' && showFocusLens
                ? focusNodes.includes(node.id)
                : node.lenses.includes(lens);
            const isFocused = activeInspectId === node.id;
            const isDimmed = activeInspectId ? !isFocused : !inLens;
            const opacity = isFocused ? 1 : isDimmed ? 0.24 : 0.96;
            const traceWidth = isFocused ? 4.2 : 2.8;

            return (
              <g
                key={`${board}-${node.id}`}
                className={styles.hudNode}
                style={{ opacity }}
                role="button"
                tabIndex={0}
                aria-label={`${node.title}：${node.telemetryText}`}
                aria-pressed={pinnedId === node.id}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === node.id ? null : prev))}
                onClick={() => handleTogglePin(node.id)}
                onKeyDown={(e) => handleNodeKeyDown(e, node.id)}
              >
                <polyline
                  points={node.points}
                  fill="none"
                  stroke="var(--stage-halo)"
                  strokeWidth={traceWidth + 4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={node.points}
                  fill="none"
                  stroke={node.accent}
                  strokeWidth={traceWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={isFocused ? 1 : 0.72}
                />

                {!isDimmed && (
                  <polyline
                    points={node.points}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={isFocused ? 2.4 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="16 160"
                    className={styles.traceFlow}
                  />
                )}

                {renderCornerBrackets(node.reticle, node.accent, isFocused ? 22 : 16, isFocused ? 4.6 : 3.6)}
                {node.secondaryReticle && (
                  <>
                    {node.dashedBoxes !== false ? (
                      <>
                        <rect
                          x={node.reticle.x1}
                          y={node.reticle.y1}
                          width={node.reticle.x2 - node.reticle.x1}
                          height={node.reticle.y2 - node.reticle.y1}
                          rx="6"
                          fill={node.accent}
                          fillOpacity={isFocused ? 0.12 : 0.05}
                          stroke={node.accent}
                          strokeWidth="1.5"
                          strokeDasharray="8 8"
                          strokeOpacity={isFocused ? 0.8 : 0.4}
                        />
                        <rect
                          x={node.secondaryReticle.x1}
                          y={node.secondaryReticle.y1}
                          width={node.secondaryReticle.x2 - node.secondaryReticle.x1}
                          height={node.secondaryReticle.y2 - node.secondaryReticle.y1}
                          rx="6"
                          fill={node.accent}
                          fillOpacity={isFocused ? 0.12 : 0.05}
                          stroke={node.accent}
                          strokeWidth="1.5"
                          strokeDasharray="8 8"
                          strokeOpacity={isFocused ? 0.8 : 0.4}
                        />
                      </>
                    ) : (
                      <>
                        <rect
                          x={node.reticle.x1}
                          y={node.reticle.y1}
                          width={node.reticle.x2 - node.reticle.x1}
                          height={node.reticle.y2 - node.reticle.y1}
                          rx="8"
                          fill={node.accent}
                          fillOpacity={isFocused ? 0.12 : 0}
                        />
                        <rect
                          x={node.secondaryReticle.x1}
                          y={node.secondaryReticle.y1}
                          width={node.secondaryReticle.x2 - node.secondaryReticle.x1}
                          height={node.secondaryReticle.y2 - node.secondaryReticle.y1}
                          rx="8"
                          fill={node.accent}
                          fillOpacity={isFocused ? 0.14 : 0.04}
                        />
                      </>
                    )}
                    {renderCornerBrackets(node.secondaryReticle, node.accent, isFocused ? 20 : 15, isFocused ? 4.6 : 3.6)}
                  </>
                )}

                <circle cx={node.anchor.x} cy={node.anchor.y} r={isFocused ? 8.5 : 6.5} fill="var(--stage-halo)" />
                <circle cx={node.anchor.x} cy={node.anchor.y} r={isFocused ? 5.5 : 4.2} fill={node.accent} />

                <g filter="url(#yn-card-shadow)">
                  <rect
                    x={node.card.x}
                    y={node.card.y}
                    width={node.card.w}
                    height={node.card.h}
                    rx="18"
                    fill={isFocused ? 'var(--stage-card-bg-focus)' : 'var(--stage-card-bg)'}
                    stroke={node.accent}
                    strokeWidth={isFocused ? 3.2 : 1.8}
                    strokeOpacity={isFocused ? 0.95 : 'var(--stage-card-stroke-opacity)'}
                  />
                  <rect
                    x={node.card.x + 16}
                    y={node.card.y + 22}
                    width="7"
                    height={node.card.h - 44}
                    rx="3.5"
                    fill={node.accent}
                  />
                  <text
                    x={node.card.x + (node.card.w < 320 ? 32 : 38)}
                    y={node.card.y + 52}
                    fill={node.accent}
                    fontSize={node.card.w < 320 ? '17' : '20'}
                    fontWeight="800"
                    fontFamily="var(--ifm-font-family-monospace)"
                  >
                    {node.tag}
                  </text>
                  <text
                    x={node.card.x + (node.card.w < 320 ? 32 : 38)}
                    y={node.card.y + 95}
                    fill="var(--stage-card-title)"
                    fontSize={node.card.w < 320 ? '22.5' : '27'}
                    fontWeight="800"
                  >
                    {node.title}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.stageFooter}>
        <div className={styles.telemetryInfo}>
          <span className={styles.telemetryCode}>{telemetry.telemetryCode}</span>
          <span className={styles.telemetryText}>{telemetry.telemetryText}</span>
        </div>
        <Link className={styles.telemetryLink} to={telemetry.linkTo}>
          {telemetry.linkLabel}
        </Link>
      </div>
    </aside>
  );
}
