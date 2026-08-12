---
title: "选择或输入步骤参数"
description: "参数可写固定值、$$ 插值或 $= 表达式；F1 在三种模式间切换。"
slug: "/v2/xaction/concepts/edit-step-param"
sidebar_position: 40
quickerDocKey: "xaction/concepts/edit-step-param"
comments: true
docStatus: reviewed
legacyDocId: 44569803
legacyContentUpdatedAt: "2021-06-08T03:30:30.000Z"
---

# 选择或输入步骤参数

步骤参数可以绑变量，也可以在输入框里写三种内容。在输入框里按 **F1**，会在这三种模式之间循环切换：

| 模式 | 开头 | 用途 |
| --- | --- | --- |
| 原始值 | 无 | 把框里的字原样交给参数 |
| 插值 | `$$` | 把 `{变量}` 嵌进文本，见 [文本插值](/v2/xaction/concepts/interpolation) |
| 表达式 | `$=` | 用表达式计算结果，见 [表达式](/v2/xaction/concepts/expression) |

**Ctrl+Shift+C**：连同 `$$` / `$=` 标记一起复制框里的全部内容。

## 原始值

直接写网址、毫秒数、消息文本等。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  values={{url: 'https://www.google.com'}}
  focusKeys={['url']}
/>

## 插值

以 `$$` 开头，用 `{变量名}` 拼进文本。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  values={{url: '$$https://www.google.com/search?q={selectedText}'}}
  focusKeys={['url']}
/>

## 表达式

以 `$=` 开头，写判断或计算。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {count} > 2'}}
  focusKeys={['condition']}
/>

布尔类型参数也可以直接绑一个布尔变量，不必写 `$=`。

<ModuleParamPreview
  moduleKey="sys:if"
  inputVars={{condition: 'selectSuccess'}}
  focusKeys={['condition']}
/>

## 限制与排障

- 忘了加 `$$` 或 `$=` 时，`{变量名}` 会当普通文字送出去，不会替换。用 F1 切到对应模式。
- 复制到别处时若丢掉了开头标记，用 **Ctrl+Shift+C**，不要只用普通复制。
- 输入框里的右键「在编辑器中修改」、外部编辑器和插入变量，见 [模块和步骤](/v2/xaction/concepts/basic)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/basic',
      label: '模块和步骤',
      description: '输入绑变量还是写固定值',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 的替换规则和转义',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '$= 运算符、方法和补全',
    },
    {
      href: '/v2/xaction/concepts/parameters',
      label: '参数传递',
      description: '步骤之间数据怎么流',
    },
  ]}
/>
