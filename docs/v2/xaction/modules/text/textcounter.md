---
title: "字数统计"
description: "统计文本的行数、字符数、可见字符数和汉字数。"
slug: "/v2/xaction/modules/textcounter"
sidebar_label: "字数统计"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:textCounter"
comments: true
moduleKey: "sys:textCounter"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2115546
legacyContentUpdatedAt: "2019-07-15T00:53:30.000Z"
---

# 字数统计

统计一段文本的行数、字符数、去掉空白后的可见字符数，以及汉字数。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:textCounter" />

## 概述

输入要绑变量。一个汉字算 1 个字符。

<ModuleParamPreview moduleKey="sys:textCounter" />

## 参数说明

**文本**：要统计的原文，必须使用变量。

## 输出

- **行数**：文本行数。
- **字符数**：总字符数，中文算 1 个。
- **可见字符数**：去掉空白后的字符数。
- **汉字数**：汉字个数。旧稿未写这一项，当前模块已提供。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '截取、去空白、排序等多行处理。',
    },
    {
      href: '/v2/xaction/modules/charinfo',
      label: '获取字符信息',
      description: '单个字符的 Unicode 和拼音。',
    },
  ]}
/>
