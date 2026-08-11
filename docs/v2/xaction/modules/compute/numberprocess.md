---
title: "数字转换与处理"
description: "把数字转成文本、取整，或做进制转换。"
slug: "/v2/xaction/modules/numberprocess"
sidebar_label: "数字转换与处理"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:numberprocess"
comments: true
moduleKey: "sys:numberprocess"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 67836513
legacyContentUpdatedAt: "2022-03-01T01:54:50.000Z"
---

# 数字转换与处理

把数字转成保留指定小数位的文本、取整，或做进制转换。要写完整算式用 [计算](/v2/xaction/modules/compute)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:numberprocess" />

## 概述

先选 **操作**，再按类型填写附加参数。

<ModuleParamPreview moduleKey="sys:numberprocess" />

## 参数说明

**操作**：数字转换为文本、取整、进制转换。

**失败后停止**：处理失败是否中止动作。默认开启。旧稿未写。

### 数字转换为文本

按保留小数位和舍入方式转成文本。

**原始数字**：要转换的数字。

**保留小数位**：小数点后保留几位，`0` 表示只留整数。

**舍入方式**：

- **舍入：奇进偶舍**：四舍六入五取偶。保留 1 位时 `1.25` → `1.2`，`1.35` → `1.4`。
- **舍入：四舍五入**：常规四舍五入。
- **截断**：直接去掉后面的小数，不舍入。保留 1 位时 `1.49` → `1.4`。

输出：

- **结果文本(不含逗号)**：如 `123456.78`
- **结果文本(含逗号)**：如 `123,456.78`
- **结果文本(百分比)**：如 `0.728` → `72.8%`

### 取整

把小数变成整数。

<ModuleParamPreview
  moduleKey="sys:numberprocess"
  focusKeys={['operation', 'srcNumber', 'toIntegerMethod', 'rtnInteger']}
  values={{operation: 'toInteger', srcNumber: '0', toIntegerMethod: 'Round45'}}
  outputVars={{rtnInteger: 'rtnInteger'}}
/>

**原始数字**：待处理的数字。

**取整方式**：

- **舍入：奇进偶舍** / **舍入：四舍五入**：同上。
- **向上取整**：不小于原数的最小整数。
- **向下取整**：不大于原数的最大整数。

输出 **结果整数**。

### 进制转换

按指定进制解析数字文本，再给出十进制、十六进制、八进制、二进制。

<ModuleParamPreview
  moduleKey="sys:numberprocess"
  focusKeys={['operation', 'srcNumberStr', 'srcBase', 'rtnInteger', 'resultHex', 'resultOctal', 'resultBin']}
  values={{operation: 'baseConversion', srcNumberStr: '1001', srcBase: '2'}}
  outputVars={{rtnInteger: 'rtnInteger', resultHex: 'resultHex', resultOctal: 'resultOctal', resultBin: 'resultBin'}}
/>

**原始数字(文本)**：表示数字的文本。支持普通数字、`0xAB12`、带逗号的 `123,456`。

**原始数字进制**：`0` / `2` / `8` / `16`。为 `0` 时按文本自动识别：

- 含逗号 → 十进制
- `0x` 开头或含 A–D → 十六进制
- 只含 `0` / `1` → 二进制
- 其它 → 十进制

输出：

- **结果整数**：十进制值
- **十六进制** / **八进制** / **二进制**：对应文本。八进制为旧稿未写。

## 输出

- **是否成功**：操作是否成功。旧稿未写。
- 其余输出随 **操作** 变化，见上一节。

## 限制与排障

进制转换的输入是文本，不是数字类型。自动识别时，只含 `0` / `1` 的文本会当成二进制；这类文本若要按十进制解析，请改用 [赋值](/v2/xaction/modules/assign) 或 [计算](/v2/xaction/modules/compute)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/compute',
      label: '计算',
      description: '写完整算式，或做类型转换。',
    },
    {
      href: '/v2/xaction/modules/randomnum',
      label: '生成随机数',
      description: '先得到整数再格式化。',
    },
  ]}
/>
