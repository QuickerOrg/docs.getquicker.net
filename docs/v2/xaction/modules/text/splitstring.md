---
title: "拆分文本为列表"
description: "将文本拆分为列表"
slug: "/v2/xaction/modules/splitstring"
sidebar_label: "拆分文本为列表"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:splitString"
comments: true
moduleKey: "sys:splitString"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113554
legacyContentUpdatedAt: "2022-12-29T05:29:28.000Z"
---

# 拆分文本为列表

将文本拆分为列表

## 当前模块定义

<XActionModuleMeta moduleKey="sys:splitString" />

将文本变量拆分成列表变量。

例如：将一个包含多个文件路径的文本拆分成列表，列表的每一项是一个文件路径，然后就可以使用“每个”模块对列表中的每个文件路径进行处理了。

<ModuleParamPreview moduleKey="sys:splitString" />

## 参数

【输入】要拆分的文本；

【分隔】根据什么内容拆分。比如“AAA;BBB;CCC;”，可以使用“;”作为分隔符拆分。

如果需要拆分多行文本，可以使用换行符作为分隔符。可以用两种方式输入换行符：

-   直接在“分隔”参数中按下回车输入一个换行；
-   使用“\\r\\n”并且选中【转意分隔符】参数。

注意：Windows和Linux的换行习惯不同，Windows通常使用"\\r\\n"，Linux等通常使用 "\\n\\r"。如果发现拆分不成功，可以尝试更改一下，或者直接使用"\\n"。

【转义分隔符】是否转换“分隔”参数中的\\r、\\n、\\t为对应的字符。

【滤除空值】如果拆分出来的某一项内容为空，是否丢弃。

## 示例动作

-   [排序多行](https://getquicker.net/sharedaction?code=d59d0507-ad21-4783-a83a-08d6d0f9e36e)
