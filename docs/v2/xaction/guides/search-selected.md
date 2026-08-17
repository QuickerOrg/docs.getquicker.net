---
title: 选中文字就搜索
description: 用如果/否则和文本插值：选中了文字则搜索，否则打开搜索引擎首页；网址使用 URL 编码后的内容。
slug: "/v2/xaction/guides/search-selected"
sidebar_label: 第 3 课：按条件搜索
sidebar_position: 22
quickerDocKey: "xaction/guides/search-selected"
comments: true
docStatus: reviewed
---

# 选中文字就搜索

这一课把上一课的「取词」接上分支：选中了文字就打开搜索结果，没选中就打开搜索引擎首页。会用到 **如果/否则**、`$$` 插值和 **URL 编码的内容**。

<FlowChart
  layout="branch"
  start="开始"
  end="结束"
  before={['获取选中的文本']}
  decision="成功？"
  yes={['打开搜索结果']}
  no={['打开搜索首页']}
/>

请先完成 [第 2 课](./selected-text.md)。本课新建动作，标题可用 `选中即搜索`。搜索引擎以 Google 为例，换成 Bing 或百度只改网址。

## 完成后的步骤

<StepProgramView
  caption="选中文字则搜索，否则打开首页"
  showVariables
  selectedIndexes={[1]}
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        inputs: {stopIfFail: 'false'},
        outputs: {
          output: 'selectedText',
          isSuccess: 'selectSuccess',
          outputEncoded: 'encodedText',
        },
      },
      {
        key: 'sys:if',
        inputs: {condition: '{selectSuccess}'},
        ifSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: '$$https://www.google.com/search?q={encodedText}'},
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

## 第 1 步：关掉「失败后中止」

拖入 **获取选中的文本**，输出：

| 输出 | 变量 | 用途 |
| --- | --- | --- |
| **内容** | `selectedText` | 原文，调试时可以看 |
| **是否成功** | `selectSuccess` | 给「如果」当条件 |
| **URL 编码的内容** | `encodedText` | 拼进搜索地址 |

关键：把 **失败后中止动作** 取消勾选。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  values={{stopIfFail: 'false'}}
  outputVars={{
    output: 'selectedText',
    isSuccess: 'selectSuccess',
    outputEncoded: 'encodedText',
  }}
  focusKeys={['stopIfFail', 'output', 'isSuccess', 'outputEncoded']}
/>

这一项默认是开启的。不关掉的话，没选中文字时动作在第一步就结束，「如果」根本不会执行，首页也打不开。

## 第 2 步：如果 / 否则

在 **流程** 分类拖入 **如果/否则**（不要和旁边的 **如果** 搞混：后者没有「否则」分支）。

**判断条件** 绑布尔变量 `selectSuccess`。也可以在输入框里写 `{selectSuccess}`，或按 **F1** 切到表达式后写 `$= {selectSuccess}`。绑变量最省事。

<ModuleParamPreview
  moduleKey="sys:if"
  inputVars={{condition: 'selectSuccess'}}
  focusKeys={['condition']}
/>

两个模块的差别见 [如果/否则](/v2/xaction/modules/if)。

## 第 3 步：用插值拼网址

在「如果」成立的一侧拖入 **打开网址**，在「否则」一侧再拖一个 **打开网址**。

成立时，**网址** 不要写死，也不要直接把原文拼进去。选「固定值或使用插值、表达式」，整段最前面加 `$$`：

```text
$$https://www.google.com/search?q={encodedText}
```

<ModuleParamPreview
  moduleKey="sys:openUrl"
  values={{url: '$$https://www.google.com/search?q={encodedText}'}}
  focusKeys={['url']}
/>

否则一侧写普通地址即可，不必加 `$$`：

```text
https://www.google.com
```

`$$` 表示对后面的文本做 [插值](/v2/xaction/concepts/interpolation)：把 `{encodedText}` 换成变量值。忘了写 `$$` 时，浏览器会打开字面量 `{encodedText}`，而不是搜索词。输入框里按 **F1** 可在原始值、插值、表达式之间切换，见 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param)。

## 为什么要用 URL 编码

搜索词里常有空格、中文或 `&`、`+` 这类符号。把原文直接拼进 `?q=` 时，浏览器可能截断或搜错。

「获取选中的文本」已经提供 **URL 编码的内容**。拼网址时用 `{encodedText}`，不要用 `{selectedText}`。

换成其它引擎时，只改模板，变量不变：

| 引擎 | 成立时的网址 |
| --- | --- |
| Google | `$$https://www.google.com/search?q={encodedText}` |
| Bing | `$$https://www.bing.com/search?q={encodedText}` |
| 百度 | `$$https://www.baidu.com/s?wd={encodedText}` |

## 运行

1. 保存动作。
2. 在任意窗口选中 `Quicker 文档`，运行动作：应打开对应搜索结果。
3. 取消选区后再运行：应打开搜索引擎首页。

编辑器里也可以点 **运行**。若焦点在编辑器里，第一步可能拿不到你以为选中的那串字，这时改用面板或快捷键触发更准。

## 限制与排障

- 没选中却什么都没发生：检查第一步是否已取消 **失败后中止动作**。
- 打开了带 `{encodedText}` 的奇怪地址：网址前面少了 `$$`。
- 中文或带符号的词搜不准：确认打开网址用的是 **URL 编码的内容**，不是 **内容**。
- 想先看取到了什么：在「如果」前加一条 [提示消息](/v2/xaction/modules/notify)，消息内容写成 `$${selectedText}`。

原理对照见 [组合动作基础](/v2/xaction/concepts/xaction-intro)。做完这三条课，可以按 [学习路径](./how-to-learn.md) 去浏览模块分类，或看 [更多示例](./samples.md)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/if',
      label: '如果/否则',
      description: '条件成立走一侧，否则走另一侧',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 和 {变量名}',
    },
    {
      href: '/v2/xaction/modules/openurl',
      label: '打开网址',
      description: '用指定浏览器打开地址',
    },
    {
      href: '/v2/xaction/concepts/xaction-intro',
      label: '组合动作基础',
      description: '用同一个例子讲步骤和变量',
    },
  ]}
/>
