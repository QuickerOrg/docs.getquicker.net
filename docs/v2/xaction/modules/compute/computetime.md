---
title: "计算时间"
description: "时间相关的计算操作"
slug: "/v2/xaction/modules/computetime"
sidebar_label: "计算时间"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:computeTime"
comments: true
moduleKey: "sys:computeTime"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 3981717
legacyContentUpdatedAt: "2023-04-03T01:29:56.000Z"
---

# 计算时间

时间相关的计算操作

## 当前模块定义

<XActionModuleMeta moduleKey="sys:computeTime" />

时间相关的计算操作。

## 操作类型

### 取日期值

比如 2020-1-1 12:34:00 ，去除时间值12:34:00，返回当天0点的时间值 2020-1-1 0:0:0

<ModuleParamPreview moduleKey="sys:computeTime" />

### 计算时间差

计算“日期时间”和“日期时间2”两个时间的差值。

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

格式化字符串所支持的代号请参考：[https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/custom-timespan-format-strings](https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/custom-timespan-format-strings)

### 计算结束时间

根据“日期时间”指定的开始时间，增加相应的年、月、天、小时、分钟、秒数后，计算结果时间。

一般仅指定一个参数，如添加700天后的时间等。可以为负值。

<ModuleParamPreview
  moduleKey="sys:computeTime"
  focusKeys={['type', 'time1', 'addDays', 'resultTime']}
  values={{type: 'endtime', time1: 'currTime', addDays: '700'}}
  outputVars={{resultTime: 'currTime'}}
/>

### 本地时间转换为UTC时间、UTC时间转换为本地时间

本地时间和UTC时间之间进行转换。

<ModuleParamPreview
  moduleKey="sys:computeTime"
  focusKeys={['type', 'time1', 'resultTime']}
  values={{type: 'localToUtc', time1: 'currTime'}}
  outputVars={{resultTime: 'currTime'}}
/>
