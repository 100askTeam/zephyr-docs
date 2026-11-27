import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function SourceRefBar({ sourcePath, to, linkLabel = '查看二期源码解析' }) {
  return (
    <div className={styles.wrap}>
      <aside className={styles.bar} aria-label="对应工程源码与二期解析入口">
        <span className={styles.left}>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className={styles.label}>对应源码</span>
          <code className={styles.path}>{sourcePath}</code>
        </span>

        <Link className={styles.link} to={to}>
          <span>{linkLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </aside>
    </div>
  );
}
