---
title: "字数统计"
description: "统计文本行数、字符数等"
slug: "/v2/xaction/modules/textcounter"
sidebar_label: "字数统计"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:textCounter"
comments: true
moduleKey: "sys:textCounter"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "c50ecd9ef8c1ff8cc891cba98d2756c98fcd8f14b2896a831543d9c704f870a5"
legacyDocId: 2115546
legacyContentUpdatedAt: "2019-07-15T00:53:30.000Z"
---

# 字数统计

统计文本行数、字符数等

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:textCounter`
- 分类：文本处理（`Text`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `content` | 文本 | `Text` |  | 是 | `UseVar` |  | 要统计的内容 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `line` | 行数 | `Integer` |  |  |
| `char` | 字符数 | `Integer` |  |  |
| `visableChar` | 可见字符数 | `Integer` |  |  |
| `cnChar` | 汉字数 | `Integer` |  |  |
{/* xaction-metadata:end */}

统计文本的字符数量、行数等信息。



![image.png](./img/textcounter-001-73eb8d5339.png "image.png")



## 参数

### 输入

【文本】要统计数据的原始文本内容。



### 输出

【行数】文本的行数。

【字符数】总字符数量，中文文字算作1个字符。

【可见字符数】去除空白字符之后的可见字符数量。
