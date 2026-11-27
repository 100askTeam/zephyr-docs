import React, { useId, useState } from 'react';
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

export default function HardwareWiringGuide({ mode = 'jtag', board = 'hpm6e70' }) {
  const isJtag = mode !== 'uart';
  const isYuzuki = board === 'yuzukineko';
  const shadowFilterId = useId();
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showSticker, setShowSticker] = useState(false);
  const [yuzukiSide, setYuzukiSide] = useState('back');

  const jtagImgUrl = useBaseUrl('/img/wiring/usbtoolbox-jtag-3d.png');
  const uartImgUrl = useBaseUrl('/img/wiring/usbtoolbox-uart-3d.png');
  const backImgUrl = useBaseUrl('/img/wiring/usbtoolbox-back-pinout.webp');
  const coreboardImgUrl = useBaseUrl(
    isYuzuki ? '/img/wiring/yuzukineko-coreboard-horiz.webp' : '/img/wiring/hpm6e70-coreboard-tight.webp',
  );
  const yuzukiBackImgUrl = useBaseUrl('/img/wiring/yuzukineko-coreboard-back-horiz.webp');
  const splitterUartImgUrl = useBaseUrl('/img/wiring/avaota-splitter-uart-3d.webp');
  const splitterUsbcImgUrl = useBaseUrl('/img/wiring/avaota-splitter-usbc-3d.webp');

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
      aria-label={
        isJtag
          ? 'JTAG 5 线 3D 交互引脚定位图'
          : isYuzuki
            ? 'YuzukiNeko UART1 3 线 3D 交互引脚定位图'
            : 'UART0 3 线 3D 交互引脚定位图'
      }>
      {/* Focused Single-Purpose Header */}
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.modePill}>
            {isJtag ? 'JTAG · 5 根线' : isYuzuki ? 'UART1 · 3 根线' : 'UART0 · 3 根线'}
          </span>
          <span className={styles.headerTitle}>
            {isJtag
              ? '3D 引脚精准定位图（点「下一根 →」逐根照着插）'
              : isYuzuki
                ? '3D 正反定位与接线图（支持切换正反面，按白座 1/2/3 交叉接 RX ↔ TX）'
                : '3D 引脚精准定位图（看分线器左排丝印交叉接 RX ↔ TX）'}
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
              {isJtag
                ? '调试器端 · 20 针调试口'
                : isYuzuki
                  ? '串口工具端 · USBToolBox 演示（可选购）'
                  : '调试器端 · 7 针 UART1 排针'}
            </span>
            <span className={styles.panelSub}>
              {isJtag
                ? '正对 20 针排针、文字朝上，只插最右侧 1～4 列'
                : isYuzuki
                  ? '以 USBToolBox UART1 作演示，任意 3.3V USB 转串口模块同理（不接 3V3）'
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
            <div className={styles.panelHeadRow}>
              <span className={styles.panelTitle}>
                {isJtag
                  ? '核心板端 · 白色 7 针 DAPLink 座'
                  : isYuzuki
                    ? 'YuzukiNeko 端 · 3D 分线器正反定位'
                    : '核心板端 · 3D USB-C 串口分线器'}
              </span>
              {!isJtag && isYuzuki && (
                <div className={styles.flipSwitch} role="group" aria-label="切换 YuzukiNeko 正反面视图">
                  <button
                    type="button"
                    aria-pressed={yuzukiSide === 'back'}
                    className={`${styles.flipBtn} ${yuzukiSide === 'back' ? styles.flipBtnActive : ''}`}
                    onClick={() => setYuzukiSide('back')}>
                    背面 · 白座接线
                  </button>
                  <button
                    type="button"
                    aria-pressed={yuzukiSide === 'front'}
                    className={`${styles.flipBtn} ${yuzukiSide === 'front' ? styles.flipBtnActive : ''}`}
                    onClick={() => setYuzukiSide('front')}>
                    正面 · FEL / 母口
                  </button>
                </div>
              )}
            </div>
            <span className={styles.panelSub}>
              {isJtag
                ? 'USB-C 朝左摆放，认准白座左上角 ▼（前 2 孔留空）'
                : isYuzuki
                  ? yuzukiSide === 'back'
                    ? '背面猫咪面朝上 ↔ 分线器白座朝上，按 1/2/3 丝印交叉接 RX ↔ TX'
                    : '正面芯片面朝上 ↔ 分线器 AvaotaUART / USB-C 母口朝上（白座朝下）'
                  : '白座朝上直插核心板 USB-C 口，按 1 / 2 / 3 丝印交叉接 RX ↔ TX'}
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
            ) : isYuzuki ? (
              <svg
                className={styles.stageSvg}
                viewBox="0 0 1240 691"
                role="img"
                aria-label={
                  yuzukiSide === 'back'
                    ? 'YuzukiNeko 背面与 3D USB-C 分线器白座朝上接线示意图'
                    : 'YuzukiNeko 正面与 3D AvaotaUART USB-C 母口朝上及 FEL 键示意图'
                }>
                <defs>
                  <filter id={shadowFilterId} x="-8%" y="-14%" width="116%" height="136%">
                    <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0f2942" floodOpacity="0.18" />
                  </filter>
                </defs>

                {yuzukiSide === 'back' ? (
                  <>
                    {/* 3D Green Splitter (white 3-pin socket side UP), plugged into YuzukiNeko USB-C */}
                    <image
                      href={splitterUartImgUrl}
                      x="266"
                      y="256"
                      width="330"
                      height="167"
                      filter={`url(#${shadowFilterId})`}
                    />
                    {/* 3D YuzukiNeko Back View (Cat illustration UP) */}
                    <image
                      href={yuzukiBackImgUrl}
                      x="532"
                      y="200"
                      width="684"
                      height="280"
                      filter={`url(#${shadowFilterId})`}
                    />

                    {/* Top orientation badges */}
                    <g style={{ opacity: activeId ? 0.45 : 0.96 }}>
                      <rect x="256" y="76" width="266" height="54" rx="13" fill="#ecfdf5" stroke="#059669" strokeWidth="3" />
                      <text
                        x="389"
                        y="104"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="900"
                        fill="#047857">
                        分线器：白座朝上
                      </text>
                      <line
                        x1="389"
                        y1="130"
                        x2="389"
                        y2="248"
                        stroke="#059669"
                        strokeWidth="3.2"
                        strokeDasharray="7 5"
                      />

                      <rect x="688" y="76" width="388" height="54" rx="13" fill="#eff6ff" stroke="#0284c7" strokeWidth="3" />
                      <text
                        x="882"
                        y="104"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="900"
                        fill="#0369a1">
                        YuzukiNeko：背面朝上（猫咪面）
                      </text>
                      <line
                        x1="882"
                        y1="130"
                        x2="882"
                        y2="194"
                        stroke="#0284c7"
                        strokeWidth="3.2"
                        strokeDasharray="7 5"
                      />
                    </g>

                    {/* 3 Interactive pin badges wired smoothly to Pins 1, 2, 3 on the 3D white socket */}
                    {UART_WIRES.map((w, idx) => {
                      const isFocused = !activeId || activeId === w.id;
                      const op = isFocused ? 1 : 0.2;
                      const rowActive = activeId === w.id;
                      const pillY = [218, 312, 406][idx];
                      const pillCy = pillY + 27;
                      const pinY = [308, 339, 370][idx];

                      return (
                        <g
                          key={w.id}
                          className={styles.interactivePin}
                          style={{ opacity: op }}
                          onMouseEnter={() => setHoveredId(w.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => handleToggleWire(w.id)}>
                          <path
                            d={`M 222 ${pillCy} C 248 ${pillCy}, 244 ${pinY}, 270 ${pinY}`}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeOpacity="0.92"
                          />
                          <path
                            d={`M 222 ${pillCy} C 248 ${pillCy}, 244 ${pinY}, 270 ${pinY}`}
                            fill="none"
                            stroke={w.color}
                            strokeWidth={rowActive ? 5 : 3.8}
                            strokeLinecap="round"
                          />
                          <circle
                            cx="270"
                            cy={pinY}
                            r={rowActive ? 11 : 8.5}
                            fill={w.color}
                            stroke="#ffffff"
                            strokeWidth="3"
                          />

                          <rect
                            x="14"
                            y={pillY}
                            width="208"
                            height="54"
                            rx="12"
                            fill={rowActive ? w.color : '#ffffff'}
                            stroke={w.color}
                            strokeWidth="3.2"
                          />
                          <circle cx="42" cy={pillCy} r="16" fill={rowActive ? '#ffffff' : w.color} />
                          <text
                            x="42"
                            y={pillCy + 1}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="21"
                            fontWeight="900"
                            fill={rowActive ? w.color : '#ffffff'}
                            fontFamily="ui-monospace, Consolas, sans-serif">
                            {w.num}
                          </text>
                          <text
                            x="68"
                            y={pillCy + 1}
                            dominantBaseline="central"
                            fontSize="24"
                            fontWeight="900"
                            fill={rowActive ? '#ffffff' : '#0f2942'}
                            fontFamily="ui-monospace, Consolas, sans-serif">
                            {w.dot ? '• ' : ''}
                            {w.padName}
                          </text>
                          <text
                            x="208"
                            y={pillCy + 1}
                            textAnchor="end"
                            dominantBaseline="central"
                            fontSize="21"
                            fontWeight="800"
                            fill={rowActive ? '#ffffff' : w.color}
                            fontFamily="ui-monospace, Consolas, sans-serif">
                            {w.leftLabel.split(' · ')[0]}
                          </text>
                        </g>
                      );
                    })}

                    <text
                      x="620"
                      y="580"
                      textAnchor="middle"
                      fontSize="23"
                      fontWeight="800"
                      fill="#0f2942"
                      fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                      背面（猫咪面）朝上 ↔ 分线器白座朝上（插反 180° 串口无输出）
                    </text>
                    <text
                      x="620"
                      y="626"
                      textAnchor="middle"
                      fontSize="22"
                      fontWeight="700"
                      fill="#0284c7"
                      fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                      照图按白座 1 / 2 / 3 脚依次接入 TXD / RXD / GND（红线为 GND）
                    </text>
                  </>
                ) : (
                  <>
                    {/* 3D Green Splitter (AvaotaUART / USB-C female port UP), plugged into YuzukiNeko */}
                    <image
                      href={splitterUsbcImgUrl}
                      x="248"
                      y="262"
                      width="360"
                      height="152"
                      filter={`url(#${shadowFilterId})`}
                    />
                    {/* 3D YuzukiNeko Front View (F101 chip + FEL button UP) */}
                    <image
                      href={coreboardImgUrl}
                      x="524"
                      y="200"
                      width="692"
                      height="277"
                      filter={`url(#${shadowFilterId})`}
                    />

                    {/* Top splitter orientation badge */}
                    <rect x="190" y="76" width="388" height="54" rx="13" fill="#ecfdf5" stroke="#059669" strokeWidth="3" />
                    <text
                      x="384"
                      y="104"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="23"
                      fontWeight="900"
                      fill="#047857">
                      分线器：AvaotaUART / 母口朝上
                    </text>
                    <line
                      x1="384"
                      y1="130"
                      x2="384"
                      y2="254"
                      stroke="#059669"
                      strokeWidth="3.2"
                      strokeDasharray="7 5"
                    />

                    {/* Left USB-C female port callout */}
                    <rect x="16" y="284" width="194" height="106" rx="14" fill="#eff6ff" stroke="#0284c7" strokeWidth="3" />
                    <text
                      x="113"
                      y="320"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="23"
                      fontWeight="900"
                      fill="#0369a1">
                      尾部 USB-C 母口
                    </text>
                    <text
                      x="113"
                      y="358"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="20"
                      fontWeight="700"
                      fill="#0284c7">
                      接数据线（供电+FEL）
                    </text>
                    <line x1="210" y1="338" x2="246" y2="338" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="246" cy="338" r="7" fill="#0284c7" />

                    {/* FEL button highlight */}
                    <circle cx="1012" cy="284" r="32" fill="none" stroke="#f59e0b" strokeWidth="4.5" />
                    <path d="M 1012 252 L 1012 132" fill="none" stroke="#f59e0b" strokeWidth="3.8" />
                    <rect x="774" y="76" width="424" height="54" rx="13" fill="#fffbeb" stroke="#f59e0b" strokeWidth="3" />
                    <text
                      x="986"
                      y="104"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="24"
                      fontWeight="900"
                      fill="#b45309">
                      FEL 键（按住插线进烧录模式）
                    </text>

                    <text
                      x="620"
                      y="580"
                      textAnchor="middle"
                      fontSize="23"
                      fontWeight="800"
                      fill="#0f2942"
                      fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                      正面（F101 芯片面）朝上 ↔ 分线器 AvaotaUART / USB-C 母口朝上（白座朝下）
                    </text>
                    <text
                      x="620"
                      y="626"
                      textAnchor="middle"
                      fontSize="22"
                      fontWeight="700"
                      fill="#0284c7"
                      fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                      提示：点击右上角「背面 · 白座接线」即可翻面核对 3 根串口线
                    </text>
                  </>
                )}
              </svg>
            ) : (
              <svg
                className={styles.stageSvg}
                viewBox="0 0 1240 691"
                role="img"
                aria-label="HPM6E70 核心板与 3D USB-C 串口分线器白座朝上连接示意图">
                <defs>
                  <filter id={shadowFilterId} x="-8%" y="-14%" width="116%" height="136%">
                    <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0f2942" floodOpacity="0.18" />
                  </filter>
                </defs>

                {/* 3D Green Splitter (white 3-pin socket side UP), plugged straight into HPM6E70 USB-C */}
                <image
                  href={splitterUartImgUrl}
                  x="266"
                  y="250"
                  width="330"
                  height="167"
                  filter={`url(#${shadowFilterId})`}
                />
                {/* HPM6E70 Coreboard Photo (USB-C receptacle overlaps male plug cleanly) */}
                <image
                  href={coreboardImgUrl}
                  x="500"
                  y="114"
                  width="716"
                  height="449"
                  filter={`url(#${shadowFilterId})`}
                />

                {/* Top splitter orientation badge */}
                <g style={{ opacity: activeId ? 0.45 : 0.96 }}>
                  <rect x="248" y="34" width="256" height="52" rx="13" fill="#ecfdf5" stroke="#059669" strokeWidth="3" />
                  <text
                    x="376"
                    y="61"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                    fontWeight="900"
                    fill="#047857">
                    分线器：白座朝上
                  </text>
                  <line
                    x1="376"
                    y1="86"
                    x2="376"
                    y2="244"
                    stroke="#059669"
                    strokeWidth="3.2"
                    strokeDasharray="7 5"
                  />
                </g>

                {/* Underside 5V USB-C power port callout */}
                <g style={{ opacity: activeId ? 0.35 : 0.95 }}>
                  <line
                    x1="354"
                    y1="458"
                    x2="354"
                    y2="420"
                    stroke="#0284c7"
                    strokeWidth="3.2"
                    strokeDasharray="6 4"
                  />
                  <circle cx="354" cy="420" r="6" fill="#0284c7" />
                  <rect x="226" y="458" width="260" height="78" rx="13" fill="#eff6ff" stroke="#0284c7" strokeWidth="3" />
                  <text
                    x="356"
                    y="486"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="23"
                    fontWeight="900"
                    fill="#0369a1">
                    背面尾部 USB-C 母口
                  </text>
                  <text
                    x="356"
                    y="518"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="21"
                    fontWeight="700"
                    fill="#0284c7">
                    接 5V USB 供电线
                  </text>
                </g>

                {/* 3 Interactive pin badges wired smoothly to Pins 1, 2, 3 on the 3D white socket */}
                {UART_WIRES.map((w, idx) => {
                  const isFocused = !activeId || activeId === w.id;
                  const op = isFocused ? 1 : 0.2;
                  const rowActive = activeId === w.id;
                  const pillY = [212, 306, 400][idx];
                  const pillCy = pillY + 27;
                  const pinY = [302, 333, 364][idx];

                  return (
                    <g
                      key={w.id}
                      className={styles.interactivePin}
                      style={{ opacity: op }}
                      onMouseEnter={() => setHoveredId(w.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleToggleWire(w.id)}>
                      <path
                        d={`M 222 ${pillCy} C 248 ${pillCy}, 244 ${pinY}, 270 ${pinY}`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeOpacity="0.92"
                      />
                      <path
                        d={`M 222 ${pillCy} C 248 ${pillCy}, 244 ${pinY}, 270 ${pinY}`}
                        fill="none"
                        stroke={w.color}
                        strokeWidth={rowActive ? 5 : 3.8}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="270"
                        cy={pinY}
                        r={rowActive ? 11 : 8.5}
                        fill={w.color}
                        stroke="#ffffff"
                        strokeWidth="3"
                      />

                      <rect
                        x="14"
                        y={pillY}
                        width="208"
                        height="54"
                        rx="12"
                        fill={rowActive ? w.color : '#ffffff'}
                        stroke={w.color}
                        strokeWidth="3.2"
                      />
                      <circle cx="42" cy={pillCy} r="16" fill={rowActive ? '#ffffff' : w.color} />
                      <text
                        x="42"
                        y={pillCy + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="21"
                        fontWeight="900"
                        fill={rowActive ? w.color : '#ffffff'}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.num}
                      </text>
                      <text
                        x="68"
                        y={pillCy + 1}
                        dominantBaseline="central"
                        fontSize="24"
                        fontWeight="900"
                        fill={rowActive ? '#ffffff' : '#0f2942'}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.dot ? '• ' : ''}
                        {w.padName}
                      </text>
                      <text
                        x="208"
                        y={pillCy + 1}
                        textAnchor="end"
                        dominantBaseline="central"
                        fontSize="21"
                        fontWeight="800"
                        fill={rowActive ? '#ffffff' : w.color}
                        fontFamily="ui-monospace, Consolas, sans-serif">
                        {w.leftLabel.split(' · ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* RESET tactile button highlight */}
                <g style={{ opacity: activeId ? 0.35 : 0.96 }}>
                  <circle cx="617" cy="217" r="23" fill="none" stroke="#f59e0b" strokeWidth="4.5" />
                  <path d="M 617 194 L 617 60 L 672 60" fill="none" stroke="#f59e0b" strokeWidth="3.8" />
                  <rect x="672" y="34" width="328" height="52" rx="13" fill="#fffbeb" stroke="#f59e0b" strokeWidth="3" />
                  <text
                    x="836"
                    y="61"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                    fontWeight="900"
                    fill="#b45309">
                    RESET 键（复位看日志）
                  </text>
                </g>

                <text
                  x="620"
                  y="608"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="800"
                  className={styles.svgNotePrimary}
                  fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                  分线器白座朝上直插核心板 USB-C 口，按 1 / 2 / 3 脚交叉接 RX ↔ TX
                </text>
                <text
                  x="620"
                  y="652"
                  textAnchor="middle"
                  fontSize="23"
                  fontWeight="700"
                  className={styles.svgNoteWarn}
                  fontFamily="Inter, 'Microsoft YaHei', sans-serif">
                  注意：以白座 1 / 2 / 3 位置与丝印为准，切勿按红黑线色盲猜（红线常为 GND）
                </text>
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
                aria-pressed={selectedId === w.id}
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
                : isYuzuki
                  ? '共接 3 根线（背面猫咪面朝上时分线器白座朝上：第 1 脚 RX 接 TXD，第 2 脚 TX 接 RXD，第 3 脚 GND 接 GND；3V3 不接）。'
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
