import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const STEPS = [
  {
    id: 1,
    target: 'usb',
    title: '拔线断电',
    desc: '拔掉分线器尾部的 USB-C 数据线',
    isKey: false,
  },
  {
    id: 2,
    target: 'fel',
    title: '按住 FEL 不放',
    desc: '持续按住正面 FEL 键不要松开',
    isKey: true,
  },
  {
    id: 3,
    target: 'usb',
    title: '插回通电',
    desc: '保持按住 FEL，重新插回 USB-C 线',
    isKey: false,
  },
  {
    id: 4,
    target: 'fel',
    title: '1 秒后松手',
    desc: '约 1 秒后松开按键，即进入 FEL',
    isKey: false,
  },
];

export default function FelModeGuide() {
  const photoUrl = useBaseUrl('/img/wiring/yuzuki-fel-front.webp');
  const [activeStepId, setActiveStepId] = useState(null);

  const activeStep = STEPS.find((s) => s.id === activeStepId) || null;
  const activeTarget = activeStep ? activeStep.target : null;

  const usbClass = [
    styles.calloutGroup,
    activeTarget === 'fel' ? styles.calloutDimmed : styles.calloutFocused,
  ].join(' ');

  const felClass = [
    styles.calloutGroup,
    activeTarget === 'usb' ? styles.calloutDimmed : styles.calloutFocused,
  ].join(' ');

  return (
    <section className={styles.wrapper} aria-label="进入 FEL 烧录模式操作示意图">
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}>必做操作</span>
            <p className={styles.title}>让开发板进入 FEL 烧录模式</p>
          </div>
          <span className={styles.hint}>按 1 → 2 → 3 → 4 顺序操作</span>
        </div>

        <div className={styles.photoStage}>
          <svg
            className={styles.svg}
            viewBox="0 0 1024 399"
            role="img"
            aria-label="YuzukiNeko 正面实拍标注图：左侧标注分线器尾部 USB-C 数据线用于步骤 1 拔出与步骤 3 插回，右侧红圈标注正面 FEL 按键用于步骤 2 按住与步骤 4 约 1 秒后松开"
          >
            <image
              href={photoUrl}
              x="0"
              y="0"
              width="1024"
              height="399"
              preserveAspectRatio="xMidYMid slice"
            />

            {/* Callout A: USB-C cable plug (Steps 1 & 3) */}
            <g className={usbClass}>
              {/* Highlight box around black USB-C plug */}
              <rect
                x="180"
                y="133"
                width="148"
                height="108"
                rx="14"
                fill="rgba(2, 132, 199, 0.14)"
                stroke="#ffffff"
                strokeWidth="7"
              />
              <rect
                x="180"
                y="133"
                width="148"
                height="108"
                rx="14"
                fill="none"
                stroke="#0369a1"
                strokeWidth="4"
                strokeDasharray="10 6"
              />

              {/* Leader line up to top pill */}
              <line
                x1="254"
                y1="133"
                x2="254"
                y2="76"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="254"
                y1="133"
                x2="254"
                y2="76"
                stroke="#0369a1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="254" cy="133" r="6" fill="#0369a1" stroke="#ffffff" strokeWidth="2.5" />

              {/* Top pill label */}
              <rect
                x="62"
                y="18"
                width="384"
                height="56"
                rx="28"
                fill="#0369a1"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <text
                x="254"
                y="54"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="22"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
              >
                ① 拔出 / ③ 插回 USB-C 线
              </text>

              {/* Bottom direction cue */}
              <rect
                x="98"
                y="266"
                width="312"
                height="42"
                rx="21"
                fill="rgba(15, 23, 42, 0.88)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x="254"
                y="293"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="18"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
              >
                ← ① 拔出断电  |  ③ 插回通电 →
              </text>
            </g>

            {/* Callout B: Front FEL tactile switch (Steps 2 & 4) */}
            <g className={felClass}>
              {/* Soft outer emphasis ring */}
              <circle
                cx="846"
                cy="152"
                r="34"
                fill="rgba(220, 38, 38, 0.16)"
                stroke="#ffffff"
                strokeWidth="6"
              />
              {/* Crisp target ring around FEL button */}
              <circle
                cx="846"
                cy="152"
                r="24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
              />
              <circle
                cx="846"
                cy="152"
                r="24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="4.5"
              />

              {/* Leader line up to top red pill */}
              <line
                x1="846"
                y1="126"
                x2="846"
                y2="76"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="846"
                y1="126"
                x2="846"
                y2="76"
                stroke="#b91c1c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="846" cy="126" r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />

              {/* Top red pill label */}
              <rect
                x="560"
                y="18"
                width="444"
                height="56"
                rx="28"
                fill="#b91c1c"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <text
                x="782"
                y="54"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="22"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
              >
                ② 按住正面 FEL 键 → ④ 1 秒后松开
              </text>
            </g>
          </svg>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((step) => {
            const isActive = activeStepId === step.id;
            const btnClass = [
              styles.stepBtn,
              step.isKey ? styles.stepKey : '',
              isActive ? styles.stepActive : '',
            ]
              .filter(Boolean)
              .join(' ');
            const numClass = [
              styles.stepNum,
              step.target === 'fel' ? styles.stepNumFel : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li key={step.id} className={styles.stepItem}>
                <button
                  type="button"
                  className={btnClass}
                  aria-pressed={isActive}
                  onMouseEnter={() => setActiveStepId(step.id)}
                  onMouseLeave={() => setActiveStepId(null)}
                  onFocus={() => setActiveStepId(step.id)}
                  onBlur={() => setActiveStepId(null)}
                  onClick={() =>
                    setActiveStepId((prev) => (prev === step.id ? null : step.id))
                  }
                >
                  <span className={styles.stepHead}>
                    <span className={numClass}>{step.id}</span>
                    <span className={styles.stepTitle}>{step.title}</span>
                  </span>
                  <span className={styles.stepDesc}>{step.desc}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
