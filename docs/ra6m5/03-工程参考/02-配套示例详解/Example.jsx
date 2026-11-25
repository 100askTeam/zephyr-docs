import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './examples.module.css';

export default function Example({name, title, description, hardware, notice, apis, children}) {
  const buildAndFlashCmd =
    `.\\.venv\\Scripts\\python.exe -m west build -b dshan_ra6m5 applications\\${name} -d build\\${name}\n` +
    `.\\.venv\\Scripts\\python.exe -m west flash -d build\\${name}`;

  return (
    <details className={styles.example} id={name}>
      <summary>
        <span className={styles.identity}>
          <code>{name}</code>
          <span className={styles.hardware}>{hardware}</span>
        </span>
        <span className={styles.intro}>
          <strong>{title}</strong>
          <span>{description}</span>
          {notice && <span className={styles.notice}>{notice}</span>}
        </span>
        <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>
      <div className={styles.body}>
        {children}
        <dl className={styles.technical}>
          <div><dt>Zephyr 接口</dt><dd>{apis}</dd></div>
          <div><dt>源码入口</dt><dd><code>applications/{name}/src/main.c</code></dd></div>
        </dl>
        <div className={styles.cmdBlock}>
          <div className={styles.cmdLabel}>编译与烧录命令（工程根目录 PowerShell）：</div>
          <CodeBlock language="powershell">{buildAndFlashCmd}</CodeBlock>
        </div>
      </div>
    </details>
  );
}
