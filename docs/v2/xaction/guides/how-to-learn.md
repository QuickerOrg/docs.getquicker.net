---
title: 怎样学会组合动作
description: 组合动作的学习顺序：步骤与变量、三条动手课，以及之后该读哪些概念和模块。
slug: "/v2/xaction/guides/how-to-learn"
sidebar_label: 学习路径
sidebar_position: 10
quickerDocKey: "xaction/guides/how-to-learn"
comments: true
docStatus: reviewed
legacyDocId: 142296918
legacyContentUpdatedAt: "2023-12-26T07:01:11.000Z"
---

# 怎样学会组合动作

组合动作不是先把一百个模块背完再动手。先搞清三件事，再跟着三条课各做一个能跑的动作，之后按需要查模块即可。

## 三件事

1. 步骤从上到下执行。每一步调用一个**模块**，用输入参数做事，把结果写入**变量**。
2. 后面的步骤读这些变量，继续处理、判断或输出。
3. 输入可以绑变量，也可以写固定值、以 `$$` 开头的 [插值](/v2/xaction/concepts/interpolation)，或以 `$=` 开头的 [表达式](/v2/xaction/concepts/expression)。

把选中文字变成大写、再写回窗口，就是这三件事：

<StepProgramView
  caption="取词 → 处理 → 写回"
  showVariables
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'ok'},
      },
      {
        key: 'sys:stringProcess',
        inputs: {data: '{selectedText}', method: 'toUpper'},
        outputs: {output: 'resultText'},
      },
      {
        key: 'sys:outputText',
        inputs: {content: '{resultText}'},
      },
    ],
  }}
/>

- 「获取选中的文本」把内容写入 `selectedText`。
- 「文本处理」做 **英文转大写**，结果写入 `resultText`。
- 「发送文本到窗口」把 `resultText` 发回当前窗口。

窗口、工具箱和保存见 [动作编辑器](/v2/xaction/concepts/xaction-editor)。步骤和参数写法见 [模块和步骤](/v2/xaction/concepts/basic)。

## 动手课

按顺序做。每一课都在上一课的编辑习惯上多引入一个概念。

| 课 | 你会做成 | 新概念 |
| --- | --- | --- |
| [第 1 课：弹出提示](./helloworld.md) | 桌面上出现 Hello, World! | 新建组合动作、拖入模块、保存并运行 |
| [第 2 课：处理选中文字](./selected-text.md) | 选中文字变成大写并写回 | 输出变量、模块参数、发送文本到窗口 |
| [第 3 课：按条件搜索](./search-selected.md) | 有选区就搜索，没有就打开首页 | 失败后中止、如果/否则、`$$` 插值、URL 编码 |

做完这三条，再读 [组合动作基础](/v2/xaction/concepts/xaction-intro) 会轻松很多：那一页用同一个搜索例子讲原理，课里已经亲手搭过。

## 之后怎么学

1. 浏览 [模块参考](/v2/xaction/modules) 的分类标题，知道大概有哪些能力。不必逐页精读。
2. 需要计算、拼接、判断时，再看 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param)、[文本插值](/v2/xaction/concepts/interpolation) 和 [表达式](/v2/xaction/concepts/expression)。
3. 动作跑不通时，用编辑器工具条的运行 / 调试。V2 的断点和单步见 [组合动作执行与调试](/v2/what's-new/actions/xaction-steps.md)。
4. 按自己的需求写动作，用到哪个模块再打开那一页。

专题练习（网页、浏览器配置文件、FlaUI 等）在 [教程与实践](/v2/xaction/guides) 其它页面；社区视频和动作单见 [更多示例](./samples.md)。

## 组合动作与代码方式怎么选

在 Quicker 里编写自动化，先选**动作类型**，再按需在组合动作内部嵌入**代码步骤**：

1. **先选动作类型**：大部分桌面操作、网页、截图与软件连接流程适合用 **组合动作** 图形化编排；如果核心逻辑主要是复杂文本/JSON/文件处理、多分支循环或复用 C# 项目，直接选择 **[脚本动作（C#）](/v2/script-action)**，用 `qk` API 编码与调试会更清晰。
2. **组合动作内部按需加代码步骤**：主体流程仍用组合动作，只有某一步需要脚本补充时，可以嵌入以下模块：

| 层次与方式 | 定位 | 适合场景 | 入口 |
| --- | --- | --- | --- |
| **组合动作** | 动作类型 | 图形化串联步骤、复用 170+ 现成桌面/软件/AI 模块 | [模块参考](/v2/xaction/modules) |
| **脚本动作（C#）** | 动作类型 | 整套动作以现代 C# 与 `qk` API 编写为主，支持多文件与调试 | [脚本动作](/v2/script-action) |
| **运行 C# 代码** | 组合动作步骤 | 在组合动作局部复用既有 C# 代码片段，读写组合动作变量 | [运行C#代码](/v2/xaction/modules/csscript) |
| **运行 C# 文件应用** | 组合动作步骤 | 在组合动作中调用单文件 .NET 应用处理独立任务或依赖包 | [运行C#文件应用](/v2/xaction/modules/file-based-apps) |
| **自动化脚本（JS）** | 组合动作步骤 | 在组合动作内用轻量 JS 编排按键鼠标、窗口控制与图像定位 | [自动化脚本](/v2/xaction/modules/automationscript) |

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/guides/helloworld',
      label: '第 1 课：弹出提示',
      description: '从空白动作到桌面提示',
    },
    {
      href: '/v2/xaction/concepts/xaction-intro',
      label: '组合动作基础',
      description: '步骤、变量和分支的原理',
    },
    {
      href: '/v2/xaction/concepts/xaction-editor',
      label: '动作编辑器',
      description: '工具箱、步骤列表和保存',
    },
    {
      href: '/v2/xaction/modules',
      label: '模块参考',
      description: '当前全部步骤的参数表',
    },
  ]}
/>
