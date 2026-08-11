---
title: "数字转换与处理"
description: "数字转换为文本等相关处理"
slug: "/v2/xaction/modules/numberprocess"
sidebar_label: "数字转换与处理"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:numberprocess"
comments: true
moduleKey: "sys:numberprocess"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 67836513
legacyContentUpdatedAt: "2022-03-01T01:54:50.000Z"
---

# 数字转换与处理

数字转换为文本等相关处理

## 当前模块定义

<XActionModuleMeta moduleKey="sys:numberprocess" />

【模块开发完善中...】

将数字转换为保留指定小数位的文本、取整或进行进制转换。

## 数字转换为文本

根据设定的保留小数位数和舍入方式转换为文本值。

<ModuleParamPreview moduleKey="sys:numberprocess" />

【原始数字】需要转换的数字值。

【保留位数】小数点后需要保留的位数，0表示仅保留整数部分。

【舍入方式】

-   奇进偶舍：即四舍六入五取偶。四舍五入到最接近的数字的策略，当一个数字在其他两个数字之间时，它会向最接近的偶数四舍五入。例如在保留1位小数时，1.25 → 1.2， 1.35 → 1.4。
-   四舍五入：常规的四舍五入方式。

-   截断：直接去除后面的小数位，不进行舍入操作。例如在保留1位小数时，1.49 → 1.4。

**输出**

【结果文本（不含逗号）】格式类似 `123456.78`

【结果文本（含逗号）】整数部分每3个数字之间使用逗号隔开，如：`123,456.78`

【结果文本（百分比）】转换为百分比数字，如 0.728 -&gt; 72.8%

## 取整

将小数数字转换为整数。

<ModuleParamPreview
  moduleKey="sys:numberprocess"
  focusKeys={['operation', 'srcNumber', 'toIntegerMethod', 'rtnInteger']}
  values={{operation: 'toInteger', srcNumber: '0', toIntegerMethod: 'Round45'}}
  outputVars={{rtnInteger: 'rtnInteger'}}
/>

【原始数字】待处理的数字。

【取整方式】

-   奇进偶舍：参考上一节中的说明。
-   四舍五入：参考上一节中的说明。

-   向上取整：取大于等于原始数字的最小整数。
-   向下取整：取小于等于原始数字的最小整数。

## 进制转换

根据指定的进制解析原始数字文本，转换为整数、十六进制和二进制文本。

<ModuleParamPreview
  moduleKey="sys:numberprocess"
  focusKeys={['operation', 'srcNumberStr', 'srcBase', 'rtnInteger', 'resultHex', 'resultBin']}
  values={{operation: 'baseConversion', srcNumberStr: '1001', srcBase: '2'}}
  outputVars={{rtnInteger: 'rtnInteger', resultHex: 'resultHex', resultBin: 'resultBin'}}
/>

【原始数字】表示原始数字的文本。（这里传入的是文本类型），支持 普通数字，十六进制0xAB12、带有逗号的数字123,456等。

【原始数字进制】原始数字的进制数。 可选0/2/8/16。为0时根据传入的原始数字文本格式尝试自动识别。

-   包含逗号时判断为10进制
-   0x开始或者包含大于等于A的字符，判断为16进制

-   只包含0/1，判断为二进制
-   其它情况判断为10进制。

输出

【结果整数】解析出的数字10进制值。

【十六进制数】值的16进制文本。

【二进制值】值的二进制文本。
