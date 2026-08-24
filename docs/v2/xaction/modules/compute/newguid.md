---
title: "生成Guid"
description: "生成一个新的Guid(全局唯一ID标示符)，并转换为文本格式。"
slug: "/v2/xaction/modules/newguid"
sidebar_label: "生成Guid"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:newGuid"
comments: true
moduleKey: "sys:newGuid"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2132850
legacyContentUpdatedAt: "2019-07-17T00:36:55.000Z"
---

# 生成Guid

生成一个新的 Guid（全局唯一标识符），并转成文本。常用来当临时文件名、记录 ID。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:newGuid" />

## 概述

每次运行都会得到一个新值，不会重复。

<ModuleParamPreview moduleKey="sys:newGuid" />

## 参数说明

**格式**：转成文本时的样子。点开下拉看当前全部选项。

| 选项 | 示例 |
| --- | --- |
| 默认：00000000-0000-0000-0000-000000000000 | 带连字符 |
| 去除连字符：00000000000000000000000000000000 | 32 位十六进制 |
| 大括号包围：`{00000000-0000-0000-0000-000000000000}` | `{…}` |
| 小括号包围：(00000000-0000-0000-0000-000000000000) | `(…)` |
| 十六进制 | `{0x…,{0x00,…}}` |

**大写**：字母是否大写。默认关闭。

## 输出

- **内容**：生成的 Guid 文本。

## 限制与排障

Guid 只保证足够稀有，不要把它当成加密随机数。需要数字随机请用 [生成随机数](/v2/xaction/modules/randomnum)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/randomnum',
      label: '生成随机数',
      description: '要的是范围内的整数，不是唯一 ID。',
    },
    {
      href: '/v2/xaction/modules/assign',
      label: '赋值',
      description: '把生成的文本写进别的变量。',
    },
  ]}
/>
