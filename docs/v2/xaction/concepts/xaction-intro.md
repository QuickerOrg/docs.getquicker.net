---
title: 组合动作基础
description: 组合动作把多个步骤按顺序执行，用变量传递数据，用如果/否则做分支。
slug: "/v2/xaction/concepts/xaction-intro"
sidebar_label: 组合动作基础
sidebar_position: 10
quickerDocKey: xaction/concepts/xaction-intro
comments: true
docStatus: reviewed
legacyDocId: 1461646
legacyContentUpdatedAt: "2023-10-14T02:18:19.000Z"
---

# 组合动作基础

组合动作通过按顺序执行一系列步骤，完成一件具体的事。每一步调用一个模块，步骤之间用变量传递数据。

例如做一个「谷歌搜索」动作：选中了文字就搜索这些文字，否则打开谷歌首页。流程如下：

<FlowChart
  layout="branch"
  start="开始"
  end="结束"
  before={['获取选中的文本']}
  decision="成功？"
  yes={['搜索选中文字']}
  no={['打开谷歌首页']}
/>

用组合动作写出来是这样：

<StepProgramView
  caption="选中文字搜索"
  showVariables
  selectedIndexes={[1]}
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'selectSuccess'},
      },
      {
        key: 'sys:if',
        inputs: {condition: '{selectSuccess}'},
        ifSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: '$$https://www.google.com/search?q={selectedText}'},
          },
        ],
        elseSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: 'https://www.google.com'},
          },
        ],
      },
    ],
  }}
/>

## 步骤

每一步对应一个模块。模块决定这一步能做什么、有哪些参数。

- 按添加顺序从上到下执行。
- 分支、循环会改变后续走哪一步，见 [如果/否则](/v2/xaction/modules/if)。
- 步骤可以停用，停用后跳过。

## 变量

步骤的输出写入变量，后面的步骤用 `{变量名}` 读取。

上例里，「获取选中的文本」把内容写入 `selectedText`，是否成功写入 `selectSuccess`。「如果」判断 `{selectSuccess}`，「打开网址」用 `$$` 把 `{selectedText}` 嵌进搜索地址。

需要 URL 编码时，用该模块的「URL编码的内容」输出，而不是直接拼原文。插值写法见 [文本插值](/v2/xaction/concepts/interpolation)。

## 限制与排障

- 「获取选中的文本」默认在失败后中止动作。若勾了这项，取不到文字时不会走到后面的「如果」。
- 搜索词含空格、中文或符号时，应使用「URL编码的内容」输出再拼进网址，否则浏览器可能打不开正确结果。
- 本页只说明步骤和变量怎么串起来。改参数、调试入口见 [组合动作设计窗口](/v2/xaction/concepts/xaction-editor)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/xaction-editor',
      label: '组合动作设计窗口',
      description: '步骤列表、参数区和调试入口',
    },
    {
      href: '/v2/xaction/concepts/basic',
      label: '模块和步骤',
      description: '模块从哪来、步骤怎么加',
    },
    {
      href: '/v2/xaction/concepts/variables',
      label: '变量',
      description: '类型、作用域和引用写法',
    },
    {
      href: '/v2/xaction/modules/get_selected_text',
      label: '获取选中的文本',
      description: '上例第一步用的模块',
    },
    {
      href: '/v2/xaction/modules/if',
      label: '如果/否则',
      description: '按条件走不同分支',
    },
    {
      href: '/v2/xaction/modules/openurl',
      label: '打开网址',
      description: '上例里打开搜索或首页',
    },
  ]}
/>
