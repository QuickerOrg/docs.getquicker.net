---
title: "可见性表达式"
description: "可见性表达式的 Quicker 2.0 使用说明。"
slug: "/v2/xaction/concepts/visibility-expression"
sidebar_position: 190
quickerDocKey: "xaction/concepts/visibility-expression"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 43411179
legacyContentUpdatedAt: "2021-04-12T01:12:16.000Z"
---

可见性表达式用于根据一个字段（或变量）的值，控制另一个字段（或变量）在输入表单上的可见性。



主要用于：

-   子程序的参数
-   多字段表单模块







## 子程序参数中的可见性表达式使用

下面的例子（[动作网址](https://getquicker.net/Sharedaction?code=6a2257de-0666-4365-79e7-08d8fd4af535)）是一个用于计算面积的子程序。

-   形状类型为“正方形”时，显示的参数为“边长”
-   形状类型为“长方形”时，显示的参数为“宽度”和“高度”

![可见性表达式\_子程序.gif](./img/visibility-expression-001-a2ad45e573.gif "可见性表达式_子程序.gif")



当子程序的一个参数需要根据另一个参数的值显示或隐藏的时候，可以通过“可见性”表达式实现。



在本例中，子程序定义了4个输入参数：

![image.png](./img/visibility-expression-002-97e38c5544.png "image.png")

【type】：形状类型，可选正方形和长方形，值分别为 `square` 和 `rect` 

【width、height】：长方形的宽度和高度。当形状类型为 `rect` 时显示，对应的可见性表达式为： `$= {type} == "rect"` 

【side】：正方形的边长。当形状类型为 `square` 时显示，对应的可见性表达式为： `$= {type} == "square"` 





## 表单中的可见性表达式

表单中也有类似的情况。

下面的例子是在运行动作时通过表单选择形状并输入尺寸信息：

![可见性表达式\_表单.gif](./img/visibility-expression-003-dae8a727c3.gif "可见性表达式_表单.gif")

可以看到，根据选择的形状不同，显示了不同的尺寸参数。



在定义表单时，“宽度”和“高度”字段，在“形状”选择“长方形”时显示。对应的可见性表达式如下图所示：



![image.png](./img/visibility-expression-004-21c006aa72.png "image.png")



## 注意事项

💡 目前仅支持根据下拉选择类型的字段更新其它字段的可见性。

💡 子程序中的可见性表达式在设计动作时使用，表单中的可见性表达式在运行动作时使用。
