---
title: 开始使用 Quicker V2
description: 认识动作和面板，完成首次启动，并开始编写组合动作。
sidebar_position: 1
quickerDocKey: v2/getting-started
comments: true
---

# 开始使用 Quicker V2

Quicker 把一件重复的事做成一个**动作**。动作可以出现在面板里，也可以绑快捷键、场景或其它触发规则。组合动作则是用多个步骤按顺序完成这件事。

:::caution 先确认 V2 Preview 范围

Quicker V2 目前是 Preview，官方 V2 页面标注为「仅专业版」；免费账号数据迁移仍在进行，当前不能登录 2.0。请不要把 V2 当作关键 1.x 环境的直接替换，体验前先阅读 [体验前必读](/important-notice)。

:::

## 先记住三个词

| 词 | 含义 |
| --- | --- |
| **动作** | 可重复运行的功能。点一下、按一个快捷键，或满足触发条件时执行。 |
| **面板** | 动作入口。V2 按「场景 → 分组 → 动作」组织，同一动作可以出现在多个位置。 |
| **组合动作** | 从工具箱拖入模块、用变量传递数据的多步骤动作。 |

动作**内容**和动作**出现在哪里**是两回事：从某个场景移除入口，不会删除动作本身。整理面板时优先移动或「从此场景移除」，不要误删本体。说明见 [新面板窗口](/v2/what's-new/new-main-win/usage.md)。

## 第一次使用

1. 按 [安装说明](./install/windows.md) 装好，并用仍受支持的 64 位 Windows。
2. 启动后登录账号，便于同步；也可以先用本机离线账号。账号与数据边界见 [数据存储与同步](/v2/what's-new/data-and-sync.md)。
3. 默认用**鼠标中键**弹出面板。可在 **设置 → 基础设置 → 弹出面板** 里改成其它方式。
4. 已登录账号若仍是旧面板，可在面板右上角菜单选 **切换至新版主窗口**，或在 **设置 → 基础设置 → 新版面板窗口** 开启 **弹出面板时使用新版面板窗口**。

面板打开后：

- **全局区**：不依赖当前程序、希望随时能用的动作。
- **上下文区**：随前台程序或网址变化，例如在资源管理器里会看到对应场景。
- 单击动作即可运行；在面板上直接键入名称或拼音可以筛选。

从 1.x 过来的，先看 [从 V1 迁移](./migration/from-v1.md) 和 [V2 重要变化](/v2/what's-new/)。1.x 与 V2 不建议同时安装；按迁移清单先备份和卸载 1.x，再安装 V2。

## 自己写一个动作

最常见的做法是新建**组合动作**：左边拖模块，中间排步骤，右边看变量。

<FlowChart
  layout="row"
  caption="组合动作在做什么"
  steps={['取出数据', '处理', '写回窗口 / 打开网址 / 提示']}
/>

建议按下面三条课动手做，每课都能得到一个能跑的动作：

1. [弹出一条提示](./xaction/guides/helloworld.md)
2. [把选中文字变成大写](./xaction/guides/selected-text.md)
3. [选中文字就搜索](./xaction/guides/search-selected.md)

完整顺序见 [怎样学会组合动作](./xaction/guides/how-to-learn.md)。查某个模块的参数时，用 [模块参考](./xaction/modules)。

练习动作建议先放到**全局区**或上下文里的 **通用**，这样在哪个程序里都能点到。还没想好放哪，可以先放进左侧 [暂存区](/v2/what's-new/new-main-win/action-drafts.md)，确认后再保留到场景。

## 还可以先用这些

- [截图 Pro](./features/screenshot/capture-pro.md)：选区、标注、复制、贴图。
- [快速触发概览](./features/triggers/index.md)：手势、轮盘、快捷键、选中文本工具条等入口怎么选。
- [选中文本工具条](./features/triggers/text-selection-toolbar.md)：划词后出现一排动作。
- [动作与动作面板](./features/actions.md)：运行、整理和引用关系。

## 限制与排障

- 中键被其它软件占用时，面板不会出现。到设置里换一种弹出方式，或关掉占用中键的程序。
- 点面板上的按钮只是运行该位置的入口。要改步骤，请右键动作选 **编辑**。
- 组合动作跑到一半停住，先看该步骤是否勾了 **失败后中止动作**（不少模块默认勾上）。

更多见 [常见问题](./troubleshooting.md)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/install/windows',
      label: '安装',
      description: '下载、系统要求和首次启动',
    },
    {
      href: '/v2/xaction/guides/how-to-learn',
      label: '怎样学会组合动作',
      description: '三条动手课和后续阅读',
    },
    {
      href: "/v2/what's-new/new-main-win/usage",
      label: '新面板窗口',
      description: '场景、分组、创建和整理动作',
    },
    {
      href: '/v2/troubleshooting',
      label: '常见问题',
      description: '面板、选中文本和插值',
    },
  ]}
/>
