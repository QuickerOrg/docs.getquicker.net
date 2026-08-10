import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Quicker 文档',
  tagline: 'Quicker V2 使用说明与迁移指南',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.getquicker.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'QuickerOrg', // Usually your GitHub org/user name.
  projectName: 'docs.getquicker.net', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl:
            'https://github.com/QuickerOrg/docs.getquicker.net/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Quicker 文档',
      logo: {
        alt: 'Quicker 文档',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '文档',
        },
        {to: '/release-notes', label: '更新记录', position: 'left'},
        {
          href: 'https://getquicker.net',
          label: 'Quicker 官网',
          position: 'right',
        },
        {
          href: 'https://github.com/QuickerOrg/docs.getquicker.net',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Quicker V2',
              to: '/v2/getting-started',
            },
            {
              label: '更新记录',
              to: '/release-notes',
            },
          ],
        },
        {
          title: 'Quicker',
          items: [
            {
              label: '官网',
              href: 'https://getquicker.net',
            },
            {
              label: '文档中心',
              href: 'https://getquicker.net/KC',
            },
            {
              label: '讨论区',
              href: 'https://getquicker.net/QA',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/QuickerOrg/docs.getquicker.net',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Quicker. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      // Languages beyond prism-react-renderer defaults (TS/TSX already included).
      // Requires the `prismjs` package (Docusaurus peer / transitive).
      additionalLanguages: ['csharp', 'powershell'],
    },
  } satisfies Preset.ThemeConfig,
  customFields: {
    // 后续 QuickerWeb 提供评论挂载页后，填入例如：
    // https://getquicker.net/V2Docs/Comments
    quickerCommentsBaseUrl: '',
  },
};

export default config;
