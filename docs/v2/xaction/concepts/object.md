---
title: "动态对象变量"
description: "动态对象变量的 Quicker 2.0 使用说明。"
slug: "/v2/xaction/concepts/object"
sidebar_position: 90
quickerDocKey: "xaction/concepts/object"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 4590697
legacyContentUpdatedAt: "2025-12-05T02:18:41.000Z"
---

## 使用说明

动态对象可以用于存储任何一个类型的值。无论是简单的数字，还是复杂的类型（class）。





Quicker使用C#语言编写，动态对象在内部表示为一个Object类型的变量。

在C#语言中，所有对象都可以看做Object类型的派生类型，所以任何对象都可以赋值给Object类型的变量。



在需要处理复杂对象类型的时候（如从json数据中提取一个复杂节点，此时返回JToken对象类型），可以使用动态对象变量来保存它们，并在[表达式](/v2/xaction/concepts/expression)中使用其原始对象类型（如JToken）的属性、方法函数等获取信息。



请参考示例动作：[https://getquicker.net/Sharedaction?code=05d33931-477a-4c18-a917-08d7b30d7779](https://getquicker.net/Sharedaction?code=05d33931-477a-4c18-a917-08d7b30d7779)
