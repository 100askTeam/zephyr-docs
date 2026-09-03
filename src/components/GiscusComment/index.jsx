import React, { useEffect, useState } from 'react';
import Giscus from "@giscus/react";

export default function GiscusComment() {
  const [colorMode, setColorMode] = useState('preferred_color_scheme');

  useEffect(() => {
    const root = document.documentElement;
    const syncColorMode = () => {
      setColorMode(root.dataset.theme === 'dark' ? 'dark' : 'light');
    };

    syncColorMode();
    const observer = new MutationObserver(syncColorMode);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
        repo="dshanpi/Docs"
        repoId="R_kgDOPa6K2A"
        category="Q&A"
        categoryId="DIC_kwDOPa6K2M4CuHAB"
        mapping="title"
        strict="0"
        reactionsEnabled="0"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode}
        data-lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"
        async
    />
  );
}
