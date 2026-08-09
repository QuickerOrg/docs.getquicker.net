---
title: "注释"
description: "使用注释将步骤分组，描述后续步骤的目的。"
slug: "/v2/xaction/modules/comment"
sidebar_label: "注释"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:comment"
comments: true
moduleKey: "sys:comment"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "2414e08cf88e0bd7bdd3e011d13bdfea50b3e66fac79d372d91ed7f4bebfa840"
legacyDocId: 1530519
legacyContentUpdatedAt: "2023-04-02T13:16:49.000Z"
---

# 注释

使用注释将步骤分组，描述后续步骤的目的。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:comment`
- 分类：基础（`Basic`）
- 类型：`Comment`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `note` | 注释内容 | `Text` |  | 否 | `Input` |  | 注释内容。若想设置注释步骤的背景色，请参考模块文档。 |

## 输出参数

无。
{/* xaction-metadata:end */}

## 概述

用于在步骤列表中插入一段注释文字，给予自己或其他人必要的信息。如：

-   后续一组步骤的功能用途；
-   如何根据自身需求定制动作；
-   方便以后修改动作的信息等...



![](./img/comment-001-351d29a6a6.png)



## 参数

![](./img/comment-002-0927e4219c.png)

**内容：**显示在注释模块上的文字。

（版本1.37.24+）如果注释中包含网址，可以点击右键，选择“运行”直接打开注释中的每个网址。

![](./img/comment-003-eb164a0324.png)
