import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const LENS_OPTIONS = [
  {
    id: 'all',
    label: '全板总览',
    telemetryCode: 'dts: dshanmcu_hpm6e70',
    telemetryText: '双核 RISC-V 600MHz · 16MiB NOR · 32MiB SDRAM',
    linkLabel: '板卡硬件详解 →',
    linkTo: '/docs/common-03-认识HPM6E70板卡/',
  },
  {
    id: 'p1',
    label: '一期外设',
    telemetryCode: 'pinctrl: PWM / I2C1 / SPI1 / ADC',
    telemetryText: '双排 40Pin 扩展母座直连底板 14 路外设模块',
    linkLabel: '认识实验套件 →',
    linkTo: '/docs/p1-00-认识实验套件/',
  },
  {
    id: 'p2',
    label: '二期驱动',
    telemetryCode: 'driver: overlay + binding + sensor',
    telemetryText: '从硬件引脚到设备树与驱动 API 的开发闭环',
    linkLabel: '进入二期驱动 →',
    linkTo: '/docs/p2-01-从example-application认识标准工程/',
  },
  {
    id: 'p3',
    label: '三期移植',
    telemetryCode: 'boot: &xpi0 → HPM6E70 → &femc',
    telemetryText: 'XIP 启动闪存、SoC/Board 身份与 32M 内存适配',
    linkLabel: '进入三期移植 →',
    linkTo: '/docs/p3-01-搭建SDK-Glue工作区/',
  },
];

const HW_NODES = [
  {
    id: 'nor',
    lenses: ['all', 'p3'],
    accent: 'var(--node-nor)',
    tag: 'XPI0 · 16MiB NOR',
    title: 'MX25L12833F 闪存',
    card: { x: 190, y: 226, w: 380, h: 136 },
    reticle: { x1: 662, y1: 584, x2: 790, y2: 736 },
    anchor: { x: 726, y: 584 },
    points: '390,362 390,398 418,426 698,426 726,454 726,584',
    telemetryCode: 'dts: &xpi0 (MX25L12833F)',
    telemetryText: '16 MiB 板载 SPI NOR Flash · 外部 XIP 固件存储',
    linkLabel: 'Flash 配置课 →',
    linkTo: '/docs/p3-07-配置XPI-NOR-Flash/',
  },
  {
    id: 'soc',
    lenses: ['all', 'p1', 'p2', 'p3'],
    accent: 'var(--node-soc)',
    tag: 'RISC-V · 600MHz 双核',
    title: 'HPM6E70 主控芯片',
    card: { x: 598, y: 226, w: 408, h: 136 },
    reticle: { x1: 868, y1: 646, x2: 1126, y2: 916 },
    anchor: { x: 997, y: 646 },
    points: '865,362 865,398 893,426 969,426 997,454 997,646',
    telemetryCode: 'soc: hpm6e70ign1 (BGA196)',
    telemetryText: '双核 RISC-V 600MHz · 2080KB SRAM · 148 GPIO',
    linkLabel: '认识主控芯片 →',
    linkTo: '/docs/common-03-认识HPM6E70板卡/',
  },
  {
    id: 'sdram',
    lenses: ['all', 'p3'],
    accent: 'var(--node-sdram)',
    tag: 'FEMC · 32MiB',
    title: 'IS42S16160J 内存',
    card: { x: 1034, y: 226, w: 386, h: 136 },
    reticle: { x1: 1148, y1: 624, x2: 1322, y2: 798 },
    anchor: { x: 1235, y: 624 },
    points: '1235,362 1235,624',
    telemetryCode: 'dts: &femc (IS42S16160J)',
    telemetryText: '32 MiB 外部高速 SDRAM · 缓冲区与大数据运行空间',
    linkLabel: 'SDRAM 适配课 →',
    linkTo: '/docs/p3-10-适配板载SDRAM/',
  },
  {
    id: 'usbc',
    lenses: ['all', 'p1', 'p2'],
    accent: 'var(--node-usbc)',
    tag: 'USB-C · PA00/PA01',
    title: '供电与 UART0 通道',
    card: { x: 190, y: 1234, w: 382, h: 136 },
    reticle: { x1: 264, y1: 686, x2: 434, y2: 902 },
    anchor: { x: 349, y: 902 },
    points: '380,1234 380,1188 349,1157 349,902',
    telemetryCode: 'dts: &uart0 (115200 8N1)',
    telemetryText: 'D+/D- 为原生 USB，SBU1/SBU2 引出 UART0 控制台',
    linkLabel: '串口连接指南 →',
    linkTo: '/docs/common-05-连接串口并查看日志/',
  },
  {
    id: 'jtag',
    lenses: ['all', 'p2', 'p3'],
    accent: 'var(--node-jtag)',
    tag: 'JTAG · OpenOCD',
    title: 'CH347F 烧录调试座',
    card: { x: 598, y: 1234, w: 404, h: 136 },
    reticle: { x1: 658, y1: 750, x2: 776, y2: 1060 },
    anchor: { x: 717, y: 1060 },
    points: '785,1234 785,1194 717,1126 717,1060',
    telemetryCode: 'runner: openocd (ch347f)',
    telemetryText: '搭配 CH347F 调试器完成固件烧录、停核与在线调试',
    linkLabel: 'JTAG 验证指南 →',
    linkTo: '/docs/common-04-连接JTAG与OpenOCD/',
  },
  {
    id: 'bus',
    lenses: ['all', 'p1', 'p2'],
    accent: 'var(--node-bus)',
    tag: '2×20 Pin · 14 路外设',
    title: '底板信号扩展母座',
    card: { x: 1030, y: 1234, w: 390, h: 136 },
    reticle: { x1: 930, y1: 1058, x2: 1328, y2: 1118 },
    secondaryReticle: { x1: 292, y1: 484, x2: 1328, y2: 542 },
    anchor: { x: 1160, y: 1118 },
    points: '1225,1234 1225,1194 1160,1129 1160,1118',
    telemetryCode: 'header: 2×20 Pin GPIO/Bus',
    telemetryText: '核心板倒扣接入底板总线，映射 M1–M13 全部模块插座',
    linkLabel: '认识实验套件 →',
    linkTo: '/docs/p1-00-认识实验套件/',
  },
];

function renderCornerBrackets(rect, color, len = 24, strokeWidth = 4.5) {
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

/**
 * DshanMCU-HPM6E70 coreboard hardware overview panel.
 */
export default function HeroBoardStage() {
  const boardImgUrl = useBaseUrl('/img/hpm6e70-coreboard.png');
  const [lens, setLens] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);

  const activeInspectId = hoveredId || pinnedId;
  const activeLens = LENS_OPTIONS.find((opt) => opt.id === lens) || LENS_OPTIONS[0];
  const inspectedNode = HW_NODES.find((node) => node.id === activeInspectId) || null;
  const telemetry = inspectedNode || activeLens;

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
    <aside className={styles.heroStage} aria-label="DshanMCU-HPM6E70 核心板硬件资源总览">
      <div className={styles.stageGridOverlay} aria-hidden="true" />

      <div className={styles.stageHeader}>
        <div className={styles.stageTitleGroup}>
          <span className={styles.stageBeacon} aria-hidden="true" />
          <span className={styles.stageBoardCode}>DshanMCU-HPM6E70</span>
        </div>

        <div className={styles.lensTabs} role="tablist" aria-label="按课程阶段筛选板载资源">
          {LENS_OPTIONS.map((opt) => {
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
          viewBox="175 214 1260 1168"
          role="img"
          aria-label="DshanMCU-HPM6E70 核心板主要器件与接口分布图"
        >
          <defs>
            <filter id="hpm-board-shadow" x="-15%" y="-15%" width="130%" height="145%">
              <feDropShadow dx="0" dy="22" stdDeviation="18" floodColor="#0f2942" floodOpacity="0.22" />
            </filter>
            <filter id="hpm-card-shadow" x="-12%" y="-18%" width="124%" height="144%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f2942" floodOpacity="0.09" />
            </filter>
            <radialGradient id="hpm-core-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--stage-aura-core)" stopOpacity="0.16" />
              <stop offset="60%" stopColor="var(--stage-aura-core)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--stage-aura-core)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hpm-pcb-warmth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--stage-aura-warm)" stopOpacity="0.08" />
              <stop offset="65%" stopColor="var(--stage-aura-core)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="var(--stage-aura-core)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Aura & Registration Rings */}
          <ellipse cx="804" cy="800" rx="560" ry="380" fill="url(#hpm-pcb-warmth)" />
          <circle cx="997" cy="781" r="370" fill="url(#hpm-core-aura)" />
          <g stroke="var(--stage-ring)" fill="none">
            <circle cx="997" cy="781" r="245" strokeWidth="1.6" strokeDasharray="6 10" />
            <circle cx="997" cy="781" r="415" strokeWidth="1.3" strokeDasharray="4 14" />
            <line x1="205" y1="781" x2="1405" y2="781" strokeWidth="1" strokeDasharray="5 12" />
          </g>

          {/* Outer Corner Registration Marks */}
          <g stroke="var(--stage-corner)" strokeWidth="2.2" fill="none">
            <path d="M 190 256 L 190 226 L 220 226" />
            <path d="M 1390 226 L 1420 226 L 1420 256" />
            <path d="M 190 1340 L 190 1370 L 220 1370" />
            <path d="M 1390 1370 L 1420 1370 L 1420 1340" />
          </g>

          {/* Coreboard Image */}
          <image
            href={boardImgUrl}
            x="0"
            y="0"
            width="1600"
            height="1600"
            filter="url(#hpm-board-shadow)"
          />

          {/* Interactive Reticles, Traces & HUD Nodes */}
          {HW_NODES.map((node) => {
            const isHighlighted = activeInspectId
              ? activeInspectId === node.id
              : node.lenses.includes(lens);
            const isFocused = activeInspectId === node.id;
            const nodeOpacity = isHighlighted ? 1 : 0.24;
            const showSecondary = Boolean(
              node.secondaryReticle && (isFocused || (lens === 'p1' && !activeInspectId)),
            );

            return (
              <g
                key={node.id}
                className={styles.hudNode}
                style={{ opacity: nodeOpacity }}
                role="button"
                tabIndex={0}
                aria-label={`${node.title}：${node.telemetryText}`}
                aria-pressed={pinnedId === node.id}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(node.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => handleTogglePin(node.id)}
                onKeyDown={(e) => handleNodeKeyDown(e, node.id)}
              >
                {/* Halo Casing + Base Trace + Animated Signal Flow */}
                <polyline
                  points={node.points}
                  fill="none"
                  stroke="var(--stage-halo)"
                  strokeWidth={isFocused ? 7.5 : 5.8}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polyline
                  points={node.points}
                  fill="none"
                  stroke={node.accent}
                  strokeWidth={isFocused ? 3 : 2.2}
                  strokeOpacity={isFocused ? 0.72 : 0.36}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {isHighlighted && (
                  <polyline
                    points={node.points}
                    className={styles.traceFlow}
                    fill="none"
                    stroke={node.accent}
                    strokeWidth={isFocused ? 3.8 : 3}
                    strokeDasharray="20 68"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}

                {/* Anchor Via Pad */}
                <circle
                  cx={node.anchor.x}
                  cy={node.anchor.y}
                  r={isFocused ? 15 : 11}
                  fill={node.accent}
                  fillOpacity={0.18}
                  stroke={node.accent}
                  strokeWidth="2.2"
                />
                <circle
                  cx={node.anchor.x}
                  cy={node.anchor.y}
                  r="5.5"
                  fill="#ffffff"
                  stroke={node.accent}
                  strokeWidth="2.5"
                />

                {/* 4-Corner Target Reticle (unfilled center preserves real chip markings) */}
                {renderCornerBrackets(
                  node.reticle,
                  node.accent,
                  node.id === 'soc' ? 32 : 22,
                  isFocused ? 5.5 : 4.2,
                )}

                {showSecondary &&
                  renderCornerBrackets(node.secondaryReticle, node.accent, 20, 3.6)}

                {/* Callout Card */}
                <rect
                  x={node.card.x}
                  y={node.card.y}
                  width={node.card.w}
                  height={node.card.h}
                  rx="20"
                  fill={isFocused ? 'var(--stage-card-bg-focus)' : 'var(--stage-card-bg)'}
                  filter="url(#hpm-card-shadow)"
                  stroke={node.accent}
                  strokeWidth={isFocused ? 3 : 1.7}
                  strokeOpacity={isFocused ? 0.95 : 'var(--stage-card-stroke-opacity)'}
                />
                <rect
                  x={node.card.x + 22}
                  y={node.card.y + 20}
                  width="8"
                  height={node.card.h - 40}
                  rx="4"
                  fill={node.accent}
                />
                <text
                  x={node.card.x + 44}
                  y={node.card.y + 54}
                  fill={node.accent}
                  fontSize="26"
                  fontWeight="700"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  {node.tag}
                </text>
                <text
                  x={node.card.x + 44}
                  y={node.card.y + 102}
                  fill="var(--stage-card-title)"
                  fontSize="35"
                  fontWeight="800"
                  fontFamily="Inter, 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
                >
                  {node.title}
                </text>
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
