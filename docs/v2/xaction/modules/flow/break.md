---
title: "跳出循环(break)"
description: "跳出循环（\"每个\" 或 \"重复\" 模块）"
slug: "/v2/xaction/modules/break"
sidebar_label: "跳出循环(break)"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:break"
comments: true
moduleKey: "sys:break"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "6f298440cb4d034d3f98cb96017679fb203c2fa4e0cb5fa4990110f929794d14"
legacyDocId: 2133164
legacyContentUpdatedAt: "2020-02-07T14:39:25.000Z"
---

# 跳出循环(break)

跳出循环（"每个" 或 "重复" 模块）

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:break`
- 分类：程序流程（`Flow`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

无。

## 输出参数

无。
{/* xaction-metadata:end */}

在循环模块（如“[每个](/v2/xaction/modules/each)”，“[重复](/v2/xaction/modules/repeat)”等）中，**跳过后面的步骤** 并 **结束循环**。

类似于编程语言中的**break**语句。



如：总共需要循环100次，在第10次时跳出循环，则后面的90次不会再执行。



![image.png](./img/break-001-c1acb1ec04.png "image.png")





## 示例

-   示例：跳出循环 [https://getquicker.net/sharedaction?code=0a14cda4-a4e6-4b50-75b9-08d709af9122](https://getquicker.net/sharedaction?code=0a14cda4-a4e6-4b50-75b9-08d709af9122)
