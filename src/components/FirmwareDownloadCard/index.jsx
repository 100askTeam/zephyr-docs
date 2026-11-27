import React from 'react';
import styles from './styles.module.css';

const BASE_URL = 'https://dl.100ask.net/Hardware/MCU/AW-F101S3/firmware/';

export default function FirmwareDownloadCard({
  filename,
  size,
  href,
  label = '下载体验固件',
  meta = 'SPI NOR 整片镜像 · LYNX Imager 主线模式直接写入',
}) {
  const downloadUrl = href || `${BASE_URL}${filename}`;
  const metaLine = size ? `${size} · ${meta}` : meta;

  return (
    <div className={styles.wrap}>
      <article className={styles.card}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          width="42"
          height="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>

        <header className={styles.info}>
          <p className={styles.filename}>{filename}</p>
          <p className={styles.meta}>{metaLine}</p>
        </header>

        <footer className={styles.footer}>
          <a className={styles.downloadBtn} href={downloadUrl} download={filename}>
            <span>{label}</span>
            <span className={styles.srOnly}> {filename}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </footer>
      </article>
    </div>
  );
}
