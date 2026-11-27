import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const DEMO_CATEGORIES = [
  { id: 'all', label: '全部应用', count: 17 },
  { id: 'cast', label: '无线投屏', count: 4 },
  { id: 'media', label: '音视频媒体', count: 3 },
  { id: 'ui', label: 'UI 与脚本', count: 4 },
  { id: 'emu', label: '复古模拟', count: 5 },
  { id: 'ai', label: '端侧 AI', count: 1 },
];

const DEMOS = [
  {
    key: 'android_mirror',
    firmware: '01_android_mirror-full.img',
    category: 'cast',
    categoryLabel: '无线投屏',
    accentClass: styles.catCast,
    mode: 'RAM',
    title: '安卓无线投屏',
    desc: '无线调试扫码投屏，H.264 硬件解码并支持电容触摸回传控制手机。',
    to: '/docs/yuzukineko/demos/android-mirror',
  },
  {
    key: 'miracast',
    firmware: '02_miracast-full.img',
    category: 'cast',
    categoryLabel: '无线投屏',
    accentClass: styles.catCast,
    mode: 'RAM',
    title: 'Miracast 无线显示',
    desc: 'Wi-Fi Direct 点对点直连，实测 1280×720p30 流畅无线投屏，免装 App。',
    to: '/docs/yuzukineko/demos/miracast',
  },
  {
    key: 'ios_mirror',
    firmware: '03_ios_mirror-full.img',
    category: 'cast',
    categoryLabel: '无线投屏',
    accentClass: styles.catCast,
    mode: 'RAM',
    title: 'iOS 投屏 · AirPlay',
    desc: '960×720 专用解码内存池，支持竖横屏反复切换与画面自动居中裁剪。',
    to: '/docs/yuzukineko/demos/ios-mirror',
  },
  {
    key: 'usb_display',
    firmware: '04_usb_display-full.img',
    category: 'cast',
    categoryLabel: '扩展副屏',
    accentClass: styles.catCast,
    mode: 'RAM',
    title: 'USB 电脑扩展副屏',
    desc: '一根 USB-C 线将开发板彩屏变为带多点触控的 Windows 扩展副屏。',
    to: '/docs/yuzukineko/demos/usb-display',
  },
  {
    key: 'nekobox',
    firmware: '05_nekobox-full.img',
    category: 'media',
    categoryLabel: '音视频媒体',
    accentClass: styles.catMedia,
    mode: 'XIP',
    title: 'NekoBox 综合媒体盒',
    desc: 'LVGL 触摸桌面集成视频播放器、照片、复古游戏、副屏与 Miracast。',
    to: '/docs/yuzukineko/demos/nekobox',
  },
  {
    key: 'bilibili',
    firmware: '06_bilibili-full.img',
    category: 'media',
    categoryLabel: '音视频媒体',
    accentClass: styles.catMedia,
    mode: 'XIP',
    title: 'Bilibili 在线视频',
    desc: '支持触屏配网、热门浏览、拼音搜索、H.264 硬解与实时滚动弹幕。',
    to: '/docs/yuzukineko/demos/bilibili',
  },
  {
    key: 'mp4_player',
    firmware: '07_mp4_player-full.img',
    category: 'media',
    categoryLabel: '音视频媒体',
    accentClass: styles.catMedia,
    mode: 'RAM',
    title: 'MP4 本地播放器',
    desc: 'TF 卡 MP4 解封装 + H.264 硬解 + AAC 软解，音画同步并支持循环播放。',
    to: '/docs/yuzukineko/demos/mp4-player',
  },
  {
    key: 'lvgl',
    firmware: '08_lvgl-full.img',
    category: 'ui',
    categoryLabel: 'UI 与脚本',
    accentClass: styles.catUi,
    mode: 'RAM',
    title: 'LVGL 9.6 图形界面',
    desc: '免 TF 卡免联网，开箱体验彩屏显示、电容触摸与音乐播放器交互演示。',
    to: '/docs/yuzukineko/demos/lvgl',
  },
  {
    key: 'pocketjs',
    firmware: '09_pocketjs-full.img',
    category: 'ui',
    categoryLabel: 'UI 与脚本',
    accentClass: styles.catUi,
    mode: 'RAM',
    title: 'PocketJS · TSX 界面',
    desc: 'QuickJS-ng 脚本引擎结合 Rust UI 核心与 G2D/RVV 加速渲染界面。',
    to: '/docs/yuzukineko/demos/pocketjs',
  },
  {
    key: 'litehtml',
    firmware: '10_litehtml-full.img',
    category: 'ui',
    categoryLabel: 'UI 与脚本',
    accentClass: styles.catUi,
    mode: 'RAM',
    title: 'LiteHTML 渲染器',
    desc: '轻量级 HTML / CSS 排版解析，直接向彩屏渲染内置页或 TF 卡本地网页。',
    to: '/docs/yuzukineko/demos/litehtml',
  },
  {
    key: 'micropython',
    firmware: '11_micropython-full.img',
    category: 'ui',
    categoryLabel: 'UI 与脚本',
    accentClass: styles.catUi,
    mode: 'RAM',
    title: 'MicroPython REPL',
    desc: '串口交互式 Python 解释器与屏幕终端，内置 F101 G2D、音频等扩展模块。',
    to: '/docs/yuzukineko/demos/micropython',
  },
  {
    key: 'doom',
    firmware: '12_doom-full.img',
    category: 'emu',
    categoryLabel: '复古模拟',
    accentClass: styles.catEmu,
    mode: 'RAM',
    title: 'Doom 毁灭战士',
    desc: '从 TF 卡加载 WAD 数据，支持全屏缩放、多点触控虚拟按键与 8 声道音效。',
    to: '/docs/yuzukineko/demos/doom',
  },
  {
    key: 'nes',
    firmware: '13_nes-full.img',
    category: 'emu',
    categoryLabel: '复古模拟',
    accentClass: styles.catEmu,
    mode: 'RAM',
    title: 'NES 红白机模拟器',
    desc: '支持全屏缩放画面、5 点触控虚拟手柄与 48 kHz 实时音频输出。',
    to: '/docs/yuzukineko/demos/nes',
  },
  {
    key: 'mgba',
    firmware: '14_mgba-full.img',
    category: 'emu',
    categoryLabel: '复古模拟',
    accentClass: styles.catEmu,
    mode: 'RAM',
    title: 'mGBA 掌机模拟器',
    desc: '免 BIOS 运行 GB / GBC / GBA 游戏，带硬件缩放、虚拟手柄与自动存档。',
    to: '/docs/yuzukineko/demos/mgba',
  },
  {
    key: 'gpsp',
    firmware: '15_gpsp-full.img',
    category: 'emu',
    categoryLabel: '复古模拟',
    accentClass: styles.catEmu,
    mode: 'RAM',
    title: 'gpSP 动态重编译模拟',
    desc: 'RISC-V 动态重编译加速 GBA，支持最大 32 MiB ROM 满速流畅运行。',
    to: '/docs/yuzukineko/demos/gpsp',
  },
  {
    key: 'win95_bochs',
    firmware: '16_win95_bochs-full.img',
    category: 'emu',
    categoryLabel: '系统模拟',
    accentClass: styles.catEmu,
    mode: 'RAM',
    title: 'Win95 · Bochs x86',
    desc: '在 16 MiB PSRAM 上运行 Bochs 486 模拟器并启动经典 Windows 95 桌面。',
    to: '/docs/yuzukineko/demos/win95',
  },
  {
    key: 'ncnn',
    firmware: '17_ncnn-full.img',
    category: 'ai',
    categoryLabel: '端侧 AI',
    accentClass: styles.catAi,
    mode: 'RAM',
    title: 'ncnn 神经网络推理',
    desc: '单板接串口即跑，实测玄铁 C907 RVV 向量扩展下的经典 CNN 推理耗时。',
    to: '/docs/yuzukineko/demos/ncnn',
  },
];

export default function DemoShowcase() {
  const [activeCat, setActiveCat] = useState('all');
  const visibleDemos = activeCat === 'all' ? DEMOS : DEMOS.filter((d) => d.category === activeCat);

  return (
    <div className={styles.demoShowcase}>
      <div className={styles.demoFilterBar} role="tablist" aria-label="按类别筛选 17 个实测应用">
        {DEMO_CATEGORIES.map((cat) => {
          const isActive = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              <span>{cat.label}</span>
              <span className={styles.filterCount}>{cat.count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.demoGrid}>
        {visibleDemos.map((demo) => (
          <Link key={demo.key} to={demo.to} className={`${styles.demoCard} ${demo.accentClass}`}>
            <div className={styles.demoCardTop}>
              <span className={styles.demoCatTag}>
                <span className={styles.demoCatDot} aria-hidden="true" />
                {demo.categoryLabel}
              </span>
              <span className={`${styles.modeBadge} ${demo.mode === 'XIP' ? styles.modeBadgeXip : ''}`}>
                {demo.mode}
              </span>
            </div>
            <h3 className={styles.demoTitle}>{demo.title}</h3>
            <p className={styles.demoDesc}>{demo.desc}</p>
            <div className={styles.demoFooter}>
              <code className={styles.demoCmd}>{demo.firmware}</code>
              <span className={styles.demoArrow} aria-hidden="true">快速体验 →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
