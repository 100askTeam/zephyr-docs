// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HPM6E70 Zephyr 教程',
  tagline: '从官方工作区到板级适配与板载外设验证',
  favicon: 'img/favicon.ico',
  url: 'https://zephyr.100ask.org',
  baseUrl: '/',
  organizationName: '100askTeam',
  projectName: 'zephyr-docs',
  onBrokenLinks: 'throw',
  future: {v4: true},
  i18n: {defaultLocale: 'zh-Hans', locales: ['zh-Hans']},
  presets: [[
    'classic',
    /** @type {import('@docusaurus/preset-classic').Options} */
    ({
      docs: {sidebarPath: './sidebars.js', routeBasePath: 'docs'},
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    }),
  ]],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {respectPrefersColorScheme: true},
      docs: {sidebar: {autoCollapseCategories: false, hideable: true}},
      navbar: {
        title: '东山Π',
        logo: {alt: '百问网 · 东山Π', src: 'img/logo.svg'},
        items: [
          {type: 'docSidebar', sidebarId: 'tutorialSidebar', label: 'HPM6E70 Zephyr 教程', position: 'left'},
          {href: 'https://github.com/100askTeam/zephyr-docs', label: 'GitHub', position: 'right'},
        ],
      },
      footer: {style: 'dark', copyright: `Copyright © ${new Date().getFullYear()} 百问网`},
      prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
    }),
  markdown: {
    mermaid: true,
    mdx1Compat: {comments: true, admonitions: true, headingIds: true},
    hooks: {onBrokenMarkdownImages: 'throw'},
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [[
    '@easyops-cn/docusaurus-search-local',
    {hashed: true, language: ['en', 'zh']},
  ]],
};

export default config;
