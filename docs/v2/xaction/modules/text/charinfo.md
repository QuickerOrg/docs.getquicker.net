---
title: "获取字符信息"
description: "获取字符信息"
slug: "/v2/xaction/modules/charinfo"
sidebar_label: "获取字符信息"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:charInfo"
comments: true
moduleKey: "sys:charInfo"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113737
legacyContentUpdatedAt: "2023-02-07T00:57:07.000Z"
---

# 获取字符信息

获取字符信息

## 当前模块定义

<XActionModuleMeta moduleKey="sys:charInfo" />

用于获取某个字符的Unicode编码信息/汉字的拼音信息。

![](./img/charinfo-001-df6405de7e.png)

## 参数

【字符】要获取信息的字符。如果输入的是多个字符，则自动获取第一个字符的信息。

### 输出

【Unicode编码（数字）】字符的Unicode编码的数值

【Unicode编码（数字）】字符的Unicode编码的十六进制字串。

【拼音首字母】汉字的拼音首字母（大写），多音字时只输出第一个。

【拼音】汉字的拼音，多音字时只输出第一个。

【拼音首字母（全部）】汉字的拼音首字母（大写），多音字时输出全部。注意：只能处理常用多音字。

【拼音（全部）】汉字的拼音，多音字时只输出全部拼音（空格分隔）。注意：只能处理常用多音字。

示例：“曾”字的信息输出：

![](./img/charinfo-002-b3a1d422d8.png)

## 更新历史

-   20230207 增加输出拼音参数（需版本1.36.28+）
