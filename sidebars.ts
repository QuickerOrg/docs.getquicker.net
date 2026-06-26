import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Quicker V2',
      link: {
        type: 'doc',
        id: 'v2/getting-started',
      },
      items: [
        'v2/getting-started',
        'v2/install/windows',
        'v2/update',
        'v2/migration/from-v1',
        'v2/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: '更新记录',
      link: {
        type: 'doc',
        id: 'release-notes/index',
      },
      items: ['release-notes/index'],
    },
    'contributing',
  ],
};

export default sidebars;
