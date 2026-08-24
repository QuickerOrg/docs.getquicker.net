---
title: "计算时间"
description: "时间相关的计算操作"
slug: "/v2/xaction/modules/computetime"
sidebar_label: "计算时间"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:computeTime"
comments: true
moduleKey: "sys:computeTime"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 3981717
legacyContentUpdatedAt: "2023-04-03T01:29:56.000Z"
---

# 计算时间

对日期时间做计算。要先拿到当前时间，用 [获取日期时间](/v2/xaction/modules/gettime)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:computeTime" />

## 概述

先选 **类型**，再填 **日期时间** 和该类型需要的附加参数。

<ModuleParamPreview moduleKey="sys:computeTime" />

## 参数说明

**类型**：点开下拉看当前全部选项。

**日期时间**：要计算的时间。

**失败后停止**：失败是否中止动作。默认开启。旧稿未写。

### 取日期值（去除当天的时间部分）

例如 `2020-1-1 12:34:00` 去掉时分秒，得到当天 0 点 `2020-1-1 0:0:0`。结果写入 **结果时间**。

### 计算时间差（日期时间2 减 日期时间）

用 **日期时间2** 减去 **日期时间**。

<ModuleParamPreview
  moduleKey="sys:computeTime"
  focusKeys={['type', 'time1', 'time2', 'formatString', 'totalDays', 'totalHours', 'totalMinutes', 'totalSeconds', 'textValue']}
  values={{type: 'timespan', time1: 'currTime', time2: 'endDay', formatString: 'd\\.hh\\:mm\\:ss'}}
  outputVars={{
    totalDays: 'totalDays',
    totalHours: 'totalHours',
    totalMinutes: 'totalMinutes',
    totalSeconds: 'totalSeconds',
    textValue: 'timeDiff',
  }}
/>

**日期时间2**：第二个时间。

**格式化字符串**：把时间差转成 **文本值** 时的格式。`d` 天数、`hh` 小时、`mm` 分钟、`ss` 秒；点号 `.` 要写成 `\.`。代号见 [自定义 TimeSpan 格式](https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/custom-timespan-format-strings)。

输出 **总天数**、**总小时数**、**总分钟数**、**总秒数**、**文本值**。

### 计算结束时间

在 **日期时间** 上增加年、月、天、小时、分钟、秒，得到结束时间。一般只填其中一个；可以为负。

<ModuleParamPreview
  moduleKey="sys:computeTime"
  focusKeys={['type', 'time1', 'addDays', 'resultTime']}
  values={{type: 'endtime', time1: 'currTime', addDays: '700'}}
  outputVars={{resultTime: 'currTime'}}
/>

**添加年数**：整数。

**添加月数**：整数。结果不跨月，如 1 月 31 日加 1 个月是 2 月 28 日。

**添加天数** / **添加小时数** / **添加分钟数** / **添加秒数**：可以为小数。

输出 **结果时间**。

### 本地时间转换为UTC时间 / UTC时间转换为本地时间

在本地时间和 UTC 之间转换。结果写入 **结果时间**。

<ModuleParamPreview
  moduleKey="sys:computeTime"
  focusKeys={['type', 'time1', 'resultTime']}
  values={{type: 'localToUtc', time1: 'currTime'}}
  outputVars={{resultTime: 'currTime'}}
/>

## 输出

- **是否成功**：操作是否成功。旧稿未写。
- **结果时间**：取日期、计算结束时间、时区转换时的结果。
- **总天数** / **总小时数** / **总分钟数** / **总秒数** / **文本值**：仅计算时间差。

## 限制与排障

时间差是「日期时间2 减 日期时间」，填反了会得到负数。格式化字符串里的 `:`、`.` 常要转义，照默认值 `d\.hh\:mm\:ss` 改最稳。加月遇到月末会收成当月最后一天，不要按「固定 30 天」去对。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/gettime',
      label: '获取日期时间',
      description: '先拿到当前时间或从文本解析。',
    },
    {
      href: '/v2/xaction/guides/date-time-process',
      label: '日期时间处理',
      description: '组合动作里怎么处理时间。',
    },
  ]}
/>
