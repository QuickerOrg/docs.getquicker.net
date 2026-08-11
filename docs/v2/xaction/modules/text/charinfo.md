---
title: "获取字符信息"
description: "取一个字符的 Unicode 编码和汉字拼音。"
slug: "/v2/xaction/modules/charinfo"
sidebar_label: "获取字符信息"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:charInfo"
comments: true
moduleKey: "sys:charInfo"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113737
legacyContentUpdatedAt: "2023-02-07T00:57:07.000Z"
---

# 获取字符信息

取单个字符的 Unicode 和汉字拼音。输入多个字符时只用第一个。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:charInfo" />

## 概述

以「曾」为例：数字编码 `26366`，十六进制 `66FE`，常用读音 `ceng`，全部读音 `ceng zeng`。

<ModuleParamPreview
  moduleKey="sys:charInfo"
  values={{char: '曾'}}
  outputVars={{
    unicodeNum: 'unicodeNum',
    unicodeHex: 'unicodeHex',
    pinyinFirstChar: 'pinyinFirstChar',
    pinyin: 'pinyin',
    pinyinFirstCharAll: 'pinyinFirstCharAll',
    pinyinAll: 'pinyinAll',
  }}
/>

## 参数说明

**字符**：要查的字。多字时取第一个。

## 输出

- **Unicode编码(数字)**：十进制编码。
- **Unicode编码(十六进制)**：如「中」为 `4E2D`。
- **拼音首字母**：常用读音的首字母（大写）。
- **拼音**：常用读音。
- **拼音首字母(全部)**：多音字全部首字母。
- **拼音(全部)**：多音字全部读音，空格分隔。

多音字只覆盖常用字。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/textcounter',
      label: '字数统计',
      description: '统计整段文本的字数和汉字数。',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '中文数字互转等。',
    },
  ]}
/>

## 更新历史

- 20230207 增加拼音输出（1.36.28+）。
