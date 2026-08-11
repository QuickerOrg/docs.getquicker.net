---
title: "正则提取"
description: "用正则从文本里取出匹配项或捕获组。"
slug: "/v2/xaction/modules/regexextract"
sidebar_label: "正则提取"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:regexExtract"
comments: true
moduleKey: "sys:regexExtract"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2115456
legacyContentUpdatedAt: "2023-05-25T23:24:40.000Z"
---

# 正则提取

用正则从文本里取出匹配。需要先熟悉正则；只要替换不要提取，用 [替换文本](/v2/xaction/modules/strreplace)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:regexExtract" />

## 概述

<ModuleParamPreview moduleKey="sys:regexExtract" />

## 参数说明

**提取方式**：决定输出长什么样。

- **各匹配项的值**：每个完整匹配一项。
- **第一个匹配项的组**：只看第一处匹配的捕获组。
- **各匹配项的组**：每个匹配的对应组收成列表。

<ModuleParamPreview
  moduleKey="sys:regexExtract"
  focusKeys={['getGroup', 'matches', 'match1', 'match2', 'matchObj', 'matchesCollection']}
  values={{getGroup: '0'}}
/>

**输入**：原文。

**正则表达式**：用来匹配的模式。

**忽略大小写**：不区分英文大小写。

**单行模式**：`.` 匹配含换行在内的任意字符；否则不匹配 `\n`。可与多行同时开。

**多行模式**：`^` / `$` 匹配行首行尾；否则只匹配整段开头和结尾。

**从右向左**：从右边开始找。旧稿未写。

**失败后中止动作**：匹配失败是否停下。默认开启。

## 输出

- **是否成功**：是否匹配到。
- **所有匹配列表**：各匹配项的值，或「第一个匹配项的组」时该匹配的各组。
- **匹配1**～**匹配5**：前 5 个匹配，或第一处匹配的前 5 个组，或「各匹配项的组」时各组列表。
- **Match对象**：仅「第一个匹配项的组」，.NET `Match`。
- **Matches集合**：仅「各匹配项的值 / 各匹配项的组」，.NET `MatchCollection`。

## 提取方式对照

输入：

```text
a1 b2 c3 d4
e5 f6 g7 h8
```

正则：`([a-z])([0-9])`

| 提取方式 | 所有匹配列表 | 匹配1～5 |
| --- | --- | --- |
| 各匹配项的值 | `a1` … `h8` | 前 5 个完整匹配 |
| 第一个匹配项的组 | `a`、`1` | 第一处的组：`a`、`1` |
| 各匹配项的组 | 各完整匹配 | 匹配1 是各组第 1 组列表，匹配2 是第 2 组列表 |

## 限制与排障

匹配不到时若开了失败中止，后面步骤不会跑。调试先关掉，看 **是否成功**。单行 / 多行含义和常见「多行」口语不一样，按上面说明选。

## 示例动作

步骤较多，用卡片打开。速查手册也是分享动作，只保留安装入口。

<ShareLinkCard
  items={[
    {
      code: '318b29ef-4bba-4d0c-a918-08d7b30d7779',
      title: '示例：正则提取',
      description: '三种提取方式对照',
    },
    {
      code: '65a5ee04-29bc-42f0-3962-08db5c50a3af',
      title: '正则速查手册',
      author: '咿呀杀杀',
    },
  ]}
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/strreplace',
      label: '替换文本',
      description: '按正则或字面量替换。',
    },
    {
      href: '/v2/xaction/modules/jsonextract',
      label: '提取JSON内容',
      description: '结构化数据用路径取，不必写正则。',
    },
  ]}
/>

## 更改历史

- 1.4.20 增加提取方式。
