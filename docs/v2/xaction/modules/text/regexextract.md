---
title: "正则提取"
description: "使用正则表达式提取指定内容"
slug: "/v2/xaction/modules/regexextract"
sidebar_label: "正则提取"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:regexExtract"
comments: true
moduleKey: "sys:regexExtract"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2115456
legacyContentUpdatedAt: "2023-05-25T23:24:40.000Z"
---

# 正则提取

使用正则表达式提取指定内容

## 当前模块定义

<XActionModuleMeta moduleKey="sys:regexExtract" />

使用正则表达式从文本中提取方式。

本模块需要您了解正则表达式相关知识之后才可以使用。

<ModuleParamPreview moduleKey="sys:regexExtract" />

## 参数

### 输入

【提取方式】要提取的内容类型。

【输入】要从中提取内容的原始文本。

【正则表达式】要匹配的正则表达式。

【忽略大小写】正则选项，不区分英文大小写。

【单行模式】此模式下“.”能匹配任意字符，包括换行符。否则匹配除了\\n外的任意字符。单行模式和多行模式相互兼容，可以选择一个、同时选择两个或都不选择。

【多行模式】此模式下^和$可以分别匹配行首和行尾。否则匹配输入内容的开始和结束。

【失败后中止动作】如果匹配失败则停止后续步骤的执行。

### 输出

据提取方式的不同，输出的内容也不太相同。

**【所有匹配列表】**

-   提取方式为“各匹配项的值”和“各匹配项的组”时，返回所有匹配项的值的列表。
-   提取方式为“第一个匹配项的组”时，返回该匹配项所有组（Group）的值的列表。

**【匹配1】-【匹配5】**

-   提取方式为“各匹配项的值”时，返回前5个匹配项的值。
-   提取方式为“第一个匹配项的组”时，返回第一个匹配项前5个匹配组（Group）的值。
-   提取方式为“所有匹配项的组”时，返回的是所有匹配项的**对应位置**匹配组的值的**列表**。

**【Matches集合】** 提取方式为“各匹配项的值”和“各匹配项的组”时，返回表示所有匹配项的 [**MatchCollection**](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.matchcollection) 对象。可以在表达式中使用此对象。

**【Match对象】** 提取方式为“第一个匹配项的组”时，返回该匹配项的 [**Match**](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.match) 对象。可以在表达式中使用此对象。

### 示例

假设**输入**内容为：

a1 b2 c3 d4
e5 f6 g7 h8

正则表达式为：

(\[a-z\])(\[0-9\])

在各提取方式类型下，输出的值为：

| **提取方式** | **输出：所有匹配列表** | **匹配1-5** |
| --- | --- | --- |
| 各匹配项的值 | 所有匹配项的值列表。<br />*a1*<br />*b2*<br />*c3*<br />*d4*<br />*e5*<br />*f6*<br />*g7*<br />*h8* | 前5个匹配项：<br />*匹配1:a1*<br />*匹配2:b2*<br />*匹配3:c3*<br />*匹配4:d4*<br />*匹配5:e5* |
| 第一个匹配项的组 | 第一个匹配项的所有组的值列表。<br />*a*<br />*1* | 第一个匹配项前5个Group的值：<br />*匹配1:a*<br />*匹配2:1*<br />*匹配3:*<br />*匹配4:*<br />*匹配5:* |
| 所有匹配项的组 | 所有匹配项的值列表。<br />*a1*<br />*b2*<br />*c3*<br />*d4*<br />*e5*<br />*f6*<br />*g7*<br />*h8* | 所有匹配项对应位置匹配组的值列表。<br />*匹配1:a*<br />*b*<br />*c*<br />*d*<br />*e*<br />*匹配2:1*<br />*2*<br />*3*<br />*4*<br />*5*<br />*匹配3:*<br />*匹配4:*<br />*匹配5:* |

### 示例动作

-   [https://getquicker.net/Sharedaction?code=318b29ef-4bba-4d0c-a918-08d7b30d7779](https://getquicker.net/Sharedaction?code=318b29ef-4bba-4d0c-a918-08d7b30d7779)

## 更改历史

-   1.4.20 增加提取方式类型支持。

## 参考资料

-   \[动作\] [正则速查手册](https://getquicker.net/Sharedaction?code=65a5ee04-29bc-42f0-3962-08db5c50a3af) 作者 @[咿呀杀杀](https://getquicker.net/User/Actions/19337-%E5%92%BF%E5%91%80%E6%9D%80%E6%9D%80)
-   正则表达式教程：[https://deerchao.net/tutorials/regex/regex.htm](https://deerchao.net/tutorials/regex/regex.htm)
-   [https://www.runoob.com/csharp/csharp-regular-expressions.html](https://www.runoob.com/csharp/csharp-regular-expressions.html)
