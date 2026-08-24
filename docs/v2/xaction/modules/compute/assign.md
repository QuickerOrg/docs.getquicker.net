---
title: "赋值"
description: "为变量赋值。"
slug: "/v2/xaction/modules/assign"
sidebar_label: "赋值"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:assign"
comments: true
moduleKey: "sys:assign"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2131959
legacyContentUpdatedAt: "2023-11-01T08:49:47.000Z"
---

# 赋值

把指定内容或另一个变量的值写进目标变量。也可以用来做类型转换。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:assign" />

## 概述

输入可以是纯文本、[插值](/v2/xaction/concepts/interpolation) 或 [表达式](/v2/xaction/concepts/expression)。输出选好目标变量即可。

<ModuleParamPreview moduleKey="sys:assign" />

## 参数说明

**输入**：要赋给变量的源数据。可以是纯文本、表达式（`$=`）或文本插值（`$$`）。

<PreviewMarks
  marks={[
    {key: 'input', label: '纯文本 / 表达式 / 文本插值'},
    {key: 'output', label: '结果输出到变量'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:assign"
    scrollBody={false}
    focusKeys={['input', 'output']}
    values={{input: '$= "Hello " + {title}'}}
    outputVars={{output: '_message'}}
  />
</PreviewMarks>

**失败后停止**：赋值失败是否中止动作。默认开启。旧稿未写。

## 输出

- **是否成功**：操作是否成功。旧稿未写。
- **输出**：写入的目标变量。

如果目标是列表或词典，赋值会新建对象再交给变量。输入也是列表或词典时，得到的是副本，改一边不会改另一边。

## 示例

**赋值给词典变量**

（另一种方式是使用 `json:xxxx`，其中 xxxx 为 JSON 数据）

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: 'aaa:AAA\nbbb:BBB'}}
  outputVars={{output: 'dict'}}
/>

**赋值给布尔变量**

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: '$= {count} > 30'}}
  outputVars={{output: 'boo'}}
/>

**文本拼接赋值**

（需要这个结果的地方也可以直接写插值，不必单独赋一次值）

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: '$$您成功点击了 {button}。\n谢谢，{title}!'}}
  outputVars={{output: '_message'}}
/>

**类型转换**

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: 'isTrue'}}
  outputVars={{output: 'context'}}
/>

## 限制与排障

表达式要以 `$=` 开头，插值用 `$$`。写错前缀会当成普通文本赋进去，后面步骤类型对不上。列表/词典赋值总是副本：改新变量不会改原来的对象。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '插值写法',
      description: '在文本里嵌入 `{变量}`。',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '`$=` 计算后再赋给变量。',
    },
    {
      href: '/v2/xaction/modules/compute',
      label: '计算',
      description: '专门算一长串公式，结果再赋出去。',
    },
    {
      href: '/v2/xaction/modules/dictoperations',
      label: '词典操作',
      description: '只改词典里的某一个键。',
    },
  ]}
/>

## 更新说明

- 20230901 增加赋值给列表和词典时会创建副本的说明。
