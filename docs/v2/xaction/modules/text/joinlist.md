---
title: "列表合并成文本"
description: "将列表拼接为一段文本"
slug: "/v2/xaction/modules/joinlist"
sidebar_label: "列表合并成文本"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:joinList"
comments: true
moduleKey: "sys:joinList"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113748
legacyContentUpdatedAt: "2020-04-02T03:01:27.000Z"
---

# 列表合并成文本

将列表拼接为一段文本

## 当前模块定义

<XActionModuleMeta moduleKey="sys:joinList" />

使用列表里的各项拼接成一段文本。

此操作的相反操作是“[文本拆分成列表](/v2/xaction/modules/splitstring)”。

<ModuleParamPreview moduleKey="sys:joinList" />

## 参数

【输入】要合并成文本的列表变量；

【分隔文本】拼接时两项中间插入的字符；如果要合并成多行文本每个一行，分隔文本可以直接输入一个回车换行。

【转义“分隔文本”】将“分隔文本”参数中的\\r、\\n、\\t转义处理成换行和tab字符。

### 输出

【结果】拼接成的文本。

## 示例

假设列表中各项为“AAA”“BBB”“CCC”，分隔符为“，”，则拼接的结果为：“AAA，BBB，CCC”。

## 更新历史

-   1.5.7 增加 转义“分隔文本” 参数。
