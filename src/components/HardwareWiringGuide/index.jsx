import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const JTAG_WIRES = [
  {
    id: 'tck',
    num: '1',
    signal: 'TCK',
    color: '#0284c7',
    softBg: 'rgba(2, 132, 199, 0.08)',
    leftPin: 'P13 / IO4',
    leftLabel: 'P13 · IO4',
    rightHole: '第 5 孔',
    holeNum: 5,
    ux: 551,
    uy: 277,
    badgeX: 112,
    badgeY: 46,
    badgeRow: 'top',
    cx: 481,
    cy: 483,
    guide:
      '第 1 根 TCK：插调试器 20 针口「上排右数第 4 针（P13 / IO4）」 → 核心板白座子「从 ▼ 往下数第 5 孔（TCK）」',
  },
  {
    id: 'tdo',
    num: '2',
    signal: 'TDO',
    color: '#d97706',
    softBg: 'rgba(217, 119, 6, 0.09)',
    leftPin: 'P15 / IO5',
    leftLabel: 'P15 · IO5',
    rightHole: '第 4 孔',
    holeNum: 4,
    ux: 613,
    uy: 276,
    badgeX: 316,
    badgeY: 46,
    badgeRow: 'top',
    cx: 481,
    cy: 458,
    guide:
      '第 2 根 TDO：插调试器 20 针口「上排右数第 3 针（P15 / IO5）」 → 核心板白座子「从 ▼ 往下数第 4 孔（TDO）」',
  },
  {
    id: 'tdi',
    num: '3',
    signal: 'TDI',
    color: '#7c3aed',
    softBg: 'rgba(124, 58, 237, 0.08)',
    leftPin: 'P17 / IO6',
    leftLabel: 'P17 · IO6',
    rightHole: '第 3 孔',
    holeNum: 3,
    ux: 675,
    uy: 275,
    badgeX: 520,
    badgeY: 46,
    badgeRow: 'top',
    cx: 481,
    cy: 433,
    guide:
      '第 3 根 TDI：插调试器 20 针口「上排右数第 2 针（P17 / IO6）」 → 核心板白座子「从 ▼ 往下数第 3 孔（TDI）」',
  },
  {
    id: 'tms',
    num: '4',
    signal: 'TMS',
    color: '#059669',
    softBg: 'rgba(5, 150, 105, 0.08)',
    leftPin: 'P18 / IO7',
    leftLabel: 'P18 · IO7',
    rightHole: '第 6 孔',
    holeNum: 6,
    ux: 675,
    uy: 335,
    badgeX: 520,
    badgeY: 572,
    badgeRow: 'bottom',
    cx: 481,
    cy: 508,
    guide:
      '第 4 根 TMS：插调试器 20 针口「下排右数第 2 针（P18 / IO7）」 → 核心板白座子「从 ▼ 往下数第 6 孔（TMS）」',
  },
  {
    id: 'gnd',
    num: '5',
    signal: 'GND',
    color: '#475569',
    softBg: 'rgba(71, 85, 105, 0.1)',
    leftPin: 'P19 / P20',
    leftLabel: 'P19 · GND',
    rightHole: '第 7 孔',
    holeNum: 7,
    ux: 738,
    uy: 274,
    altUx: 738,
    altUy: 334,
    badgeX: 724,
    badgeY: 46,
    badgeRow: 'top',
    cx: 481,
    cy: 533,
    guide:
      '第 5 根 GND：插调试器 20 针口「最右侧上下任一针（P19 或 P20）」 → 核心板白座子「最下方第 7 孔（GND）」',
  },
];

const COREBOARD_J5_HOLES = [
  { hole: 1, name: '3.3V', unused: true, cy: 383, stripY: 90, tag: '× 留空不接' },
  { hole: 2, name: 'RST', unused: true, cy: 408, stripY: 170, tag: '× 留空不接' },
  { hole: 3, name: 'TDI', wireId: 'tdi', cy: 433, stripY: 250, tag: '接 P17' },
  { hole: 4, name: 'TDO', wireId: 'tdo', cy: 458, stripY: 330, tag: '接 P15' },
  { hole: 5, name: 'TCK', wireId: 'tck', cy: 483, stripY: 410, tag: '接 P13' },
  { hole: 6, name: 'TMS', wireId: 'tms', cy: 508, stripY: 490, tag: '接 P18' },
  { hole: 7, name: 'GND', wireId: 'gnd', cy: 533, stripY: 570, tag: '接 P19/20' },
];

const UART_WIRES = [
  {
    id: 'urx',
    num: '1',
    signal: 'RX ↔ TXD1',
    color: '#0284c7',
    softBg: 'rgba(2, 132, 199, 0.08)',
    leftPin: 'P3 (TXD1)',
    leftLabel: 'P3 · TXD1',
    rightHole: '第 1 脚 RX',
    ux: 545,
    uy: 210,
    badgeX: 618,
    badgeY: 46,
    padY: 298,
    padName: 'RX',
    dot: true,
    guide:
      '第 1 根 RX → TXD1：分线器靠近白座第 1 脚（圆点 • 标 RX） → 调试器 UART1 左数第 3 针「P3 · TXD1」（交叉连接）',
  },
  {
    id: 'utx',
    num: '2',
    signal: 'TX ↔ RXD1',
    color: '#059669',
    softBg: 'rgba(5, 150, 105, 0.08)',
    leftPin: 'P2 (RXD1)',
    leftLabel: 'P2 · RXD1',
    rightHole: '第 2 脚 TX',
    ux: 512,
    uy: 217,
    badgeX: 374,
    badgeY: 46,
    padY: 360,
    padName: 'TX',
    dot: false,
    guide:
      '第 2 根 TX → RXD1：分线器靠近白座第 2 脚（中间标 TX） → 调试器 UART1 左数第 2 针「P2 · RXD1」（交叉连接）',
  },
  {
    id: 'ugnd',
    num: '3',
    signal: 'GND ↔ GND',
    color: '#475569',
    softBg: 'rgba(71, 85, 105, 0.1)',
    leftPin: 'P7 (GND)',
    leftLabel: 'P7 · GND',
    rightHole: '第 3 脚 GND',
    ux: 678,
    uy: 182,
    badgeX: 856,
    badgeY: 46,
    padY: 422,
    padName: 'GND',
    dot: false,
    guide:
      '第 3 根 GND → GND：分线器靠近白座第 3 脚（最下标 GND） → 调试器 UART1 最右侧第 7 针「P7 · GND」（P1 3V3 不接）',
  },
];

export default function HardwareWiringGuide({ mode = 'jtag' }) {
  const isJtag = mode !== 'uart';
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showSticker, setShowSticker] = useState(false);

  const jtagImgUrl = useBaseUrl('/img/wiring/usbtoolbox-jtag-3d.png');
  const uartImgUrl = useBaseUrl('/img/wiring/usbtoolbox-uart-3d.png');
  const backImgUrl = useBaseUrl('/img/wiring/usbtoolbox-back-pinout.webp');
  const coreboardImgUrl = useBaseUrl('/img/wiring/hpm6e70-coreboard-tight.webp');

  const wires = isJtag ? JTAG_WIRES : UART_WIRES;
  const activeId = hoveredId || selectedId;
  const activeWire = wires.find((w) => w.id === activeId) || null;
  const selectedIndex = wires.findIndex((w) => w.id === selectedId);

  const handleToggleWire = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleStep = (delta) => {
    if (selectedIndex < 0) {
      setSelectedId(delta > 0 ? wires[0].id : wires[wires.length - 1].id);
      return;
    }
    const nextIdx = (selectedIndex + delta + wires.length) % wires.length;
    setSelectedId(wires[nextIdx].id);
  };

  const wireById = Object.fromEntries(wires.map((w) => [w.id, w]));

  return (
    <section
      className={styles.root}
      aria-label={isJtag ? 'JTAG 5 线 3D 交互引脚定位图' : 'UART0 3 线 3D 交互引脚定位图'}>
      {/* Focused Single-Purpose Header */}
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.modePill}>{isJtag ? 'JTAG · 5 根线' : 'UART0 · 3 根线'}</span>
          <span className={styles.headerTitle}>
            {isJtag ? '3D 引脚精准定位图（点「下一根 →」逐根照着插）' : '3D 引脚精准定位图（看分线器左排丝印交叉接 RX ↔ TX）'}
          </span>
        </div>

        {isJtag && (
          <button
            type="button"
            className={`${styles.stickerToggle} ${showSticker ? styles.stickerToggleActive : ''}`}
            aria-expanded={showSticker}
            onClick={() => setShowSticker((v) => !v)}>
            {showSticker ? '收起背面丝印' : '查看调试器背面丝印'}
          </button>
        )}
      </div>

      {/* Main 2-Column Large Hardware Stage */}
      <div className={styles.stage}>
        {/* Left Large Panel: DshanPI USBToolBox 3D Render */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>
              {isJtag ? '调试器端 · 20 针调试口' : '调试器端 · 7 针 UART1 排针'}
            </span>
            <span className={styles.panelSub}>
              {isJtag
                ? '正对 20 针排针、文字朝上，只插最右侧 1～4 列'
                : 'USB 朝左，对照外壳 1～7 丝印插 3 根线（P1 3V3 不接）'}
            </span>
          </div>

          <div className={styles.svgWrap}>
            {isJtag ? (
              <svg
                className={styles.stageSvg}
                viewBox="0 0 831 620"
                role="img"
                aria-label="DshanPI USBToolBox 20 针 JTAG 引脚定位 3D 渲染图">
                <image href={jtagImgUrl} x="0" y="96" width="831" height="512" />

                {JTAG_WIRES.map((w) => {
                  const isFocused = !activeId || activeId === w.id;
                  const op = isFocused ? 1 : 0.16;
                  const py = w.uy + 96;
                  const altPy = w.altUy ? w.altUy + 96 : null;
                  const isBottom = w.badgeRow === 'bottom';
                  const pillW = 194;
                  const pillH = 54;
                  const anchorY = isBottom ? w.badgeY - pillH / 2 : w.badgeY + pillH / 2;

                  return (
                    <g
                      key={w.id}
                      className={styles.interactivePin}
                      style={{ opacity: op }}
                      onMouseEnter={() => setHoveredId(w.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleToggleWire(w.id)}>
                      <path
                        d={`M ${w.badgeX} ${anchorY} C ${w.badgeX} ${(anchorY + py) / 2}, ${w.ux} ${(anchorY + py) / 2}, ${w.ux} ${py}`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeOpacity="0.92"
                      />
                      <path
                        d={`M ${w.badgeX} ${anchorY} C ${w.badgeX} ${(anchorY + py) / 2}, ${w.ux} ${(anchorY + py) / 2}, ${w.ux} ${py}`}
                        fill="none"
                        stroke={w.color}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                      />

                      {w.altUx && altPy && (
                        <>
                          <line
                            x1={w.ux}
                            y1={py + 20}
                            x2={w.altUx}
                            y2={altPy - 18}
                            stroke={w.color}
                            strokeWidth="3.2"
                            strokeDasharray="6 4"
                          />
                          <circle
                            cx={w.altUx}
                            cy={altPy}
                            r="18"
                            fill="#ffffff"
                            fillOpacity="0.95"
                            stroke={w.color}
                            strokeWidth="4.2"
                          />
                          <text
                            x={w.altUx}
                            y={altPy + 1}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="17"
                            fontWeight="900"
                            fill={w.color}>
                            地
                          </text>
                        </>
                      )}

                      {/* Crisp solid numbered circle on exact 3D pin tip */}
                      <circle
                        cx={w.ux}
                        cy={py}
                        r={activeId === w.id ? 24 : 20}
                        fill={w.color}
                        stroke="#ffffff"
                        strokeWidth="4"
                      />
                      <text
                        x={w.ux}
                        y={py + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="900"
                        fill="#ffffff"
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.num}
                      </text>

                      {/* Crisp top/bottom pill with solid number dot */}
                      <rect
                        x={w.badgeX - pillW / 2}
                        y={w.badgeY - pillH / 2}
                        width={pillW}
                        height={pillH}
                        rx="13"
                        fill={activeId === w.id ? w.color : '#ffffff'}
                        stroke={w.color}
                        strokeWidth="3"
                      />
                      <circle
                        cx={w.badgeX - pillW / 2 + 26}
                        cy={w.badgeY}
                        r="15"
                        fill={activeId === w.id ? '#ffffff' : w.color}
                      />
                      <text
                        x={w.badgeX - pillW / 2 + 26}
                        y={w.badgeY + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="20"
                        fontWeight="900"
                        fill={activeId === w.id ? w.color : '#ffffff'}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.num}
                      </text>
                      <text
                        x={w.badgeX + 16}
                        y={w.badgeY + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="23"
                        fontWeight="800"
                        fill={activeId === w.id ? '#ffffff' : w.color}
                        fontFamily="ui-monospace, Consolas, 'Microsoft YaHei', sans-serif">
                        {w.leftLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <svg
                className={styles.stageSvg}
                viewBox="0 0 974 565"
                role="img"
                aria-label="DshanPI USBToolBox 7 针 UART1 引脚定位 3D 渲染图">
                <image href={uartImgUrl} x="0" y="90" width="974" height="475" />

                {/* Pin 1 (3V3) explicitly marked unused */}
                <g style={{ opacity: activeId ? 0.25 : 0.9 }}>
                  <path
                    d="M 122 73 C 122 195, 479 195, 479 314"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeDasharray="7 5"
                  />
                  <circle cx="479" cy="314" r="17" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3.5" />
                  <text
                    x="479"
                    y="315"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="21"
                    fontWeight="900"
                    fill="#64748b">
                    ×
                  </text>
                  <rect
                    x="18"
                    y="20"
                    width="208"
                    height="54"
                    rx="13"
                    fill="#f8fafc"
                    stroke="#94a3b8"
                    strokeWidth="2.6"
                    strokeDasharray="6 4"
                  />
                  <text
                    x="122"
                    y="48"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                    fontWeight="800"
                    fill="#64748b"
                    fontFamily="ui-monospace, Consolas, 'Microsoft YaHei', sans-serif">
                    P1 3V3 不接
                  </text>
                </g>

                {UART_WIRES.map((w) => {
                  const isFocused = !activeId || activeId === w.id;
                  const op = isFocused ? 1 : 0.16;
                  const py = w.uy + 90;
                  const pillW = 216;
                  const pillH = 54;
                  const anchorY = w.badgeY + pillH / 2;

                  return (
                    <g
                      key={w.id}
                      className={styles.interactivePin}
                      style={{ opacity: op }}
                      onMouseEnter={() => setHoveredId(w.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleToggleWire(w.id)}>
                      <path
                        d={`M ${w.badgeX} ${anchorY} C ${w.badgeX} ${(anchorY + py) / 2}, ${w.ux} ${(anchorY + py) / 2}, ${w.ux} ${py}`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="7.5"
                        strokeLinecap="round"
                        strokeOpacity="0.92"
                      />
                      <path
                        d={`M ${w.badgeX} ${anchorY} C ${w.badgeX} ${(anchorY + py) / 2}, ${w.ux} ${(anchorY + py) / 2}, ${w.ux} ${py}`}
                        fill="none"
                        stroke={w.color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Crisp solid numbered circle on exact 3D UART pin tip */}
                      <circle
                        cx={w.ux}
                        cy={py}
                        r={activeId === w.id ? 24 : 20}
                        fill={w.color}
                        stroke="#ffffff"
                        strokeWidth="4"
                      />
                      <text
                        x={w.ux}
                        y={py + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="900"
                        fill="#ffffff"
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.num}
                      </text>

                      {/* Crisp top pill with solid number dot */}
                      <rect
                        x={w.badgeX - pillW / 2}
                        y={w.badgeY - pillH / 2}
                        width={pillW}
                        height={pillH}
                        rx="13"
                        fill={activeId === w.id ? w.color : '#ffffff'}
                        stroke={w.color}
                        strokeWidth="3"
                      />
                      <circle
                        cx={w.badgeX - pillW / 2 + 28}
                        cy={w.badgeY}
                        r="16"
                        fill={activeId === w.id ? '#ffffff' : w.color}
                      />
                      <text
                        x={w.badgeX - pillW / 2 + 28}
                        y={w.badgeY + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="21"
                        fontWeight="900"
                        fill={activeId === w.id ? w.color : '#ffffff'}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.num}
                      </text>
                      <text
                        x={w.badgeX + 18}
                        y={w.badgeY + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="800"
                        fill={activeId === w.id ? '#ffffff' : w.color}
                        fontFamily="ui-monospace, Consolas, 'Microsoft YaHei', sans-serif">
                        {w.leftLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Right Large Panel: HPM6E70 Coreboard Photo + Magnified Socket / USB-C Splitter */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>
              {isJtag ? '核心板端 · 白色 7 针 DAPLink 座' : '核心板端 · USB-C 串口分线器'}
            </span>
            <span className={styles.panelSub}>
              {isJtag
                ? 'USB-C 朝左摆放，认准白座左上角 ▼（前 2 孔留空）'
                : '白座朝上插核心板 USB-C 口，看靠近白座（左排）丝印交叉接 RX ↔ TX'}
            </span>
          </div>

          <div className={styles.svgWrap}>
            {isJtag ? (
              <svg
                className={styles.stageSvg}
                viewBox="0 0 1102 691"
                role="img"
                aria-label="HPM6E70 核心板白色 7 针 DAPLink 接口 1 至 7 孔放大定位图">
                <image href={coreboardImgUrl} x="0" y="0" width="1102" height="691" />

                <rect
                  x="560"
                  y="20"
                  width="526"
                  height="650"
                  rx="22"
                  fill="rgba(255, 255, 255, 0.95)"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />
                <text
                  x="588"
                  y="62"
                  fontSize="27"
                  fontWeight="800"
                  fill="#0f2942"
                  fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                  白座放大（从 ▼ 往下数 1～7）
                </text>

                <rect
                  x="430"
                  y="322"
                  width="82"
                  height="262"
                  rx="11"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="5"
                />
                <circle cx="420" cy="368" r="16" fill="none" stroke="#ef4444" strokeWidth="4.5" />
                <rect x="242" y="340" width="160" height="52" rx="12" fill="#ef4444" />
                <text
                  x="322"
                  y="367"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="26"
                  fontWeight="900"
                  fill="#ffffff">
                  ▼ 第 1 孔
                </text>

                {COREBOARD_J5_HOLES.map((item) => {
                  const wire = item.wireId ? wireById[item.wireId] : null;
                  const color = wire ? wire.color : '#94a3b8';
                  const isFocused = !activeId || (wire && activeId === wire.id);
                  const op = item.unused ? (activeId ? 0.24 : 0.78) : isFocused ? 1 : 0.18;
                  const rowActive = Boolean(wire && activeId === wire.id);
                  const rowH = 66;

                  return (
                    <g
                      key={item.hole}
                      className={wire ? styles.interactivePin : undefined}
                      style={{ opacity: op }}
                      onMouseEnter={wire ? () => setHoveredId(wire.id) : undefined}
                      onMouseLeave={wire ? () => setHoveredId(null) : undefined}
                      onClick={wire ? () => handleToggleWire(wire.id) : undefined}>
                      <path
                        d={`M 495 ${item.cy} C 535 ${item.cy}, 542 ${item.stripY + rowH / 2}, 584 ${item.stripY + rowH / 2}`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="6.5"
                        strokeOpacity="0.92"
                      />
                      <path
                        d={`M 495 ${item.cy} C 535 ${item.cy}, 542 ${item.stripY + rowH / 2}, 584 ${item.stripY + rowH / 2}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={rowActive ? 4.8 : 3.2}
                        strokeDasharray={item.unused ? '7 5' : undefined}
                      />

                      <circle
                        cx="481"
                        cy={item.cy}
                        r={rowActive ? 12.5 : 9.5}
                        fill={item.unused ? '#f1f5f9' : color}
                        stroke="#ffffff"
                        strokeWidth="3"
                      />

                      <rect
                        x="584"
                        y={item.stripY}
                        width="480"
                        height={rowH}
                        rx="14"
                        fill={rowActive ? color : item.unused ? '#f8fafc' : '#ffffff'}
                        stroke={color}
                        strokeWidth={rowActive ? 3.8 : 2.6}
                        strokeDasharray={item.unused ? '7 5' : undefined}
                      />

                      <rect
                        x="598"
                        y={item.stripY + 12}
                        width="92"
                        height="42"
                        rx="9"
                        fill={rowActive ? 'rgba(255,255,255,0.22)' : item.unused ? '#e2e8f0' : wire.softBg}
                      />
                      <text
                        x="644"
                        y={item.stripY + 34}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="800"
                        fill={rowActive ? '#ffffff' : color}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {item.hole === 1 ? '▼ 1' : `第 ${item.hole}`}
                      </text>

                      <text
                        x="710"
                        y={item.stripY + 34}
                        dominantBaseline="central"
                        fontSize="29"
                        fontWeight="900"
                        fill={rowActive ? '#ffffff' : item.unused ? '#64748b' : '#0f2942'}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {item.name}
                      </text>

                      {/* Crisp numbered badge on active rows */}
                      {wire && (
                        <>
                          <circle
                            cx="870"
                            cy={item.stripY + 33}
                            r="18"
                            fill={rowActive ? '#ffffff' : color}
                          />
                          <text
                            x="870"
                            y={item.stripY + 34}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="22"
                            fontWeight="900"
                            fill={rowActive ? color : '#ffffff'}
                            fontFamily="ui-monospace, Consolas, sans-serif">
                            {wire.num}
                          </text>
                        </>
                      )}

                      <text
                        x="1044"
                        y={item.stripY + 34}
                        textAnchor="end"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="800"
                        fill={rowActive ? '#ffffff' : color}
                        fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                        {item.tag}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <svg
                className={styles.stageSvg}
                viewBox="0 0 1240 691"
                role="img"
                aria-label="HPM6E70 核心板 USB-C 串口分线器连接示意图">
                <image href={coreboardImgUrl} x="360" y="70" width="860" height="539" />

                <rect
                  x="366"
                  y="274"
                  width="128"
                  height="148"
                  rx="14"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4.5"
                  strokeDasharray="9 5"
                />

                <g>
                  {/* Rear 5V USB-C power plug */}
                  <rect x="8" y="330" width="54" height="56" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
                  <rect x="0" y="346" width="16" height="24" rx="4" fill="#334155" />
                  <text
                    x="185"
                    y="556"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="700"
                    fill="#475569"
                    fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                    尾部母口接 5V USB 供电线
                  </text>

                  {/* Metal Type-C male plug */}
                  <rect x="320" y="322" width="52" height="66" rx="6" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
                  <line x1="332" y1="334" x2="362" y2="334" stroke="#cbd5e1" strokeWidth="2.5" />
                  <line x1="332" y1="376" x2="362" y2="376" stroke="#cbd5e1" strokeWidth="2.5" />

                  {/* Green splitter PCB */}
                  <rect x="58" y="246" width="266" height="226" rx="20" fill="#15803d" stroke="#166534" strokeWidth="4" />
                  <rect x="72" y="260" width="238" height="198" rx="14" fill="#16a34a" stroke="#86efac" strokeWidth="1.8" strokeOpacity="0.65" />

                  {/* Pin-1 dot on splitter */}
                  <circle cx="88" cy="276" r="6" fill="#ffffff" />

                  <text
                    x="191"
                    y="192"
                    textAnchor="middle"
                    fontSize="27"
                    fontWeight="900"
                    fill="#0f2942"
                    fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                    USB-C 分线器（白座朝上）
                  </text>
                  <text
                    x="191"
                    y="226"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill="#15803d"
                    fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                    看靠近白座（左排）丝印交叉接
                  </text>
                  <text
                    x="191"
                    y="514"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill="#b91c1c"
                    fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                    注意：以丝印为准，勿按红黑线色盲猜
                  </text>

                  {UART_WIRES.map((w) => {
                    const isFocused = !activeId || activeId === w.id;
                    const op = isFocused ? 1 : 0.22;
                    const rowActive = activeId === w.id;

                    return (
                      <g
                        key={w.id}
                        className={styles.interactivePin}
                        style={{ opacity: op }}
                        onMouseEnter={() => setHoveredId(w.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleToggleWire(w.id)}>
                        <rect
                          x="82"
                          y={w.padY - 25}
                          width="218"
                          height="50"
                          rx="11"
                          fill={rowActive ? w.color : '#ffffff'}
                          stroke={w.color}
                          strokeWidth="3.2"
                        />
                        <circle cx="108" cy={w.padY} r="16" fill={rowActive ? '#ffffff' : w.color} />
                        <text
                          x="108"
                          y={w.padY + 1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="21"
                          fontWeight="900"
                          fill={rowActive ? w.color : '#ffffff'}
                          fontFamily="ui-monospace, Consolas, sans-serif">
                          {w.num}
                        </text>
                        <text
                          x="134"
                          y={w.padY + 1}
                          dominantBaseline="central"
                          fontSize="24"
                          fontWeight="900"
                          fill={rowActive ? '#ffffff' : '#0f2942'}
                          fontFamily="ui-monospace, Consolas, sans-serif">
                          {w.dot ? '• ' : ''}
                          {w.padName}
                        </text>
                        <text
                          x="288"
                          y={w.padY + 1}
                          textAnchor="end"
                          dominantBaseline="central"
                          fontSize="20"
                          fontWeight="800"
                          fill={rowActive ? '#ffffff' : w.color}
                          fontFamily="ui-monospace, Consolas, sans-serif">
                          {w.leftLabel.split(' · ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g style={{ opacity: activeId ? 0.35 : 0.96 }}>
                  <circle cx="496" cy="199" r="24" fill="none" stroke="#f59e0b" strokeWidth="4.5" />
                  <path d="M 496 175 L 496 114 L 568 114" fill="none" stroke="#f59e0b" strokeWidth="3.8" />
                  <rect x="568" y="86" width="320" height="54" rx="13" fill="#fffbeb" stroke="#f59e0b" strokeWidth="3" />
                  <text
                    x="728"
                    y="114"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                    fontWeight="900"
                    fill="#b45309">
                    RESET 键（复位看日志）
                  </text>
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Wire Cards */}
      <div className={styles.wireStrip}>
        <div className={styles.wireColHint}>点击或悬停下方任意一根线，左右两张图同步高亮对应针脚：</div>
        <div className={isJtag ? styles.wireGridJtag : styles.wireGridUart}>
          {wires.map((w) => {
            const isActive = activeId === w.id;
            const isDim = Boolean(activeId && activeId !== w.id);
            return (
              <button
                key={w.id}
                type="button"
                className={`${styles.wireCard} ${isActive ? styles.wireCardActive : ''} ${isDim ? styles.wireCardDim : ''}`}
                style={{ '--wire-color': w.color, '--wire-bg': w.softBg }}
                onMouseEnter={() => setHoveredId(w.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleToggleWire(w.id)}>
                <div className={styles.wireCardTop}>
                  <span className={styles.numBadge}>{w.num}</span>
                  <span className={styles.wireSignal}>{w.signal}</span>
                </div>
                <div className={styles.wireMap}>
                  <span>{w.leftPin}</span>
                  <span className={styles.wireArrow}>↔</span>
                  <span>{w.rightHole}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Step-by-Step Plain-Chinese Guidance Strip */}
      <div className={styles.guideBar}>
        <div className={styles.guideCopy}>
          <span
            className={styles.guideStepBadge}
            style={{ background: activeWire ? activeWire.color : 'var(--ifm-color-primary)' }}>
            {activeWire ? activeWire.num : '总览'}
          </span>
          <span className={styles.guideText}>
            {activeWire
              ? activeWire.guide
              : isJtag
                ? '共接 5 根线（顶部 3.3V 与 RST 留空不接）。点击右侧「下一根 →」可以一根一根跟着插。'
                : '共接 3 根线（分线器白座朝上，看靠近白座一排丝印：第 1 脚 RX 接 P3 TXD1，第 2 脚 TX 接 P2 RXD1，第 3 脚 GND 接 P7；P1 3V3 不接）。'}
          </span>
        </div>

        <div className={styles.guideControls}>
          {selectedId && (
            <button type="button" className={styles.ctrlBtn} onClick={() => setSelectedId(null)}>
              显示全部
            </button>
          )}
          <button type="button" className={styles.ctrlBtn} onClick={() => handleStep(-1)}>
            ← 上一根
          </button>
          <button
            type="button"
            className={`${styles.ctrlBtn} ${styles.ctrlBtnPrimary}`}
            onClick={() => handleStep(1)}>
            下一根 →
          </button>
        </div>
      </div>

      {/* Collapsible Official Back-of-Case Pinout Sticker (JTAG only) */}
      {isJtag && showSticker && (
        <div className={styles.stickerDrawer}>
          <img
            src={backImgUrl}
            alt="DshanPI USBToolBox 机身背面 20 针丝印贴纸"
            width="1020"
            height="1541"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className={styles.stickerImg}
          />
          <div className={styles.stickerNotes}>
            <strong>对照调试器机身背面贴纸快速找针：</strong>
            <div>
              把白色 <code>DshanPI USBToolBox</code> 翻到背面，紫色 <strong>JTAG/SWD</strong> 区域就是本步用到的 5 根针：
            </div>
            <div>
              • 右列（对应 3D 图上排）：<strong>P13 / IO4（TCK）</strong>、<strong>P15 / IO5（TDO）</strong>、<strong>P17 / IO6（TDI）</strong>、<strong>P19（GND）</strong>
            </div>
            <div>
              • 左列（对应 3D 图下排）：<strong>P18 / IO7（TMS）</strong>、<strong>P20（GND）</strong>（<code>P14 IO3</code> 与 <code>P16 SRST</code> 留空不接）
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
