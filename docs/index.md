---
id: index
slug: /
title: Quicker 文档
description: Quicker V2 使用说明：安装、面板、组合动作教程、功能说明和迁移指南。
sidebar_position: 1
quickerDocKey: docs/home
comments: false
hide_title: true
hide_table_of_contents: true
---

<div className="docs-landing">

# Quicker 文档

<p className="docs-landing__lead">从第一次运行动作，到把重复操作变成自己的工具。</p>

Quicker 是 Windows 上的效率工具。你可以从面板运行动作，也可以用快捷键、鼠标手势等方式随时调用。

## 从这里开始

<RelatedDocs layout="cards" className="docs-start-paths" items={[
  {href: '/v2/getting-started', label: '第一次使用 Quicker', description: '安装、打开面板，运行第一个动作。'},
  {href: '/v2/xaction/guides/how-to-learn', label: '自己编写动作', description: '跟着三个小练习，学会步骤、变量和分支。'},
  {href: '/v2/migration', label: '从 1.x 升级', description: '看 2.x 的提升、升级前排雷、迁移清单和习惯变化。'},
]} />

## 常用内容

<RelatedDocs layout="cards" items={[
  {href: '/v2/features/action-panel/usage', label: '动作面板', description: '呼出面板、查找动作，用场景和分组整理入口。'},
  {href: '/v2/features/triggers/', label: '快捷键与鼠标触发', description: '选择合适的快捷键、手势、轮盘或划词入口。'},
  {href: '/v2/features/screenshot/', label: '截图与贴图', description: '截图、标注、滚动截图，以及将图片贴在桌面上。'},
  {href: '/v2/xaction/modules', label: '组合动作模块参考', description: '按分类查找步骤，查看参数、输出和使用说明。'},
  {href: '/v2/script-action', label: '脚本动作', description: '用 C# 语法与 qk API 编写、调试和分享动作。'},
  {href: '/v2/features/software-connections', label: '软件连接', description: '通过 Bridge 连接设计、建模和办公软件。'},
  {href: '/v2/features/ai-and-agent', label: 'AI 与 Agent', description: '配置模型，用 AI 编写动作，连接外部助手。'},
]} />

<div className="docs-landing__more">

[浏览全部功能](/v2/features) · [安装与系统要求](./v2/install/windows.md) · [常见问题](./v2/troubleshooting.md) · [更新记录](/release-notes)

</div>

## 跟着做一个组合动作

<ol className="docs-landing__lessons">
  <li><a href="/v2/xaction/guides/helloworld"><span className="docs-landing__lesson-number" aria-hidden="true">01</span><strong>弹出一条提示</strong><span>认识动作编辑器和步骤</span></a></li>
  <li><a href="/v2/xaction/guides/selected-text"><span className="docs-landing__lesson-number" aria-hidden="true">02</span><strong>把选中文字变成大写</strong><span>用变量传递和处理文本</span></a></li>
  <li><a href="/v2/xaction/guides/search-selected"><span className="docs-landing__lesson-number" aria-hidden="true">03</span><strong>选中文字就搜索</strong><span>加入条件，打开搜索网址</span></a></li>
</ol>

## 选择编写自动化的方法

| 方式 | 适合什么任务 | 入口 |
| --- | --- | --- |
| **组合动作** | 图形化搭步骤、复用现成桌面与软件模块 | [入门教程](/v2/xaction/guides/how-to-learn) · [模块参考](/v2/xaction/modules) |
| **脚本动作（C#）** | 文本/JSON/文件处理、多分支循环与现代 C# 代码 | [脚本动作](/v2/script-action) |
| **运行 C# 步骤** | 在组合动作中复用原有 C# 代码块或 .NET 文件应用 | [运行C#代码](/v2/xaction/modules/csscript) · [运行C#文件应用](/v2/xaction/modules/file-based-apps) |
| **自动化脚本（JS）** | 在组合动作中用轻量 JS 编排键鼠、窗口和图像定位 | [自动化脚本](/v2/xaction/modules/automationscript) |

</div>
