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
metadataHash: "0c24fae0d8eb3b9130f65d5635bf41ecfd8df665bf5e4b26170584f185a5d398"
legacyDocId: 3981717
legacyContentUpdatedAt: "2023-04-03T01:29:56.000Z"
---

# 计算时间

时间相关的计算操作

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:computeTime`
- 分类：计算与比较（`Compute`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 类型 | `Enum` | getdate | 是 | `Input` |  | 比较方式 |
| `time1` | 日期时间 | `DateTime` |  | 是 | `UseVarOrInput` |  | 要计算的时间值 |
| `time2` | 日期时间2 | `DateTime` |  | 是 | `UseVarOrInput` | 仅：timespan | 要计算的第二个时间值 |
| `formatString` | 格式化字符串 | `Text` | d\.hh\:mm\:ss | 是 | `UseVarOrInput` | 仅：timespan | 时间差转换为文本时的格式化字符串。d:天数,hh:小时,mm:分钟,ss:秒。符号.:需要使用\转义 |
| `addYears` | 添加年数 | `Number` | 0 | 否 | `UseVarOrInput` | 仅：endtime | 添加指定的年数（整数） |
| `addMonths` | 添加月数 | `Number` | 0 | 否 | `UseVarOrInput` | 仅：endtime | 添加指定的月数（整数）结果不跨月，如1月31日增加1个月等于2月28日。 |
| `addDays` | 添加天数 | `Number` | 0 | 否 | `UseVarOrInput` | 仅：endtime | 添加指定的天数（可以为小数） |
| `addHours` | 添加小时数 | `Number` | 0 | 否 | `UseVarOrInput` | 仅：endtime | 添加指定的小时数（可以为小数） |
| `addMinutes` | 添加分钟数 | `Number` | 0 | 否 | `UseVarOrInput` | 仅：endtime | 添加指定的分钟数（可以为小数） |
| `addSeconds` | 添加秒数 | `Number` | 0 | 否 | `UseVarOrInput` | 仅：endtime | 添加指定的秒数（可以为小数） |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `resultTime` | 结果时间 | `DateTime` | 仅：endtime, getdate, utcToLocal, localToUtc | 计算的结果时间 |
| `totalDays` | 总天数 | `Number` | 仅：timespan | 间隔的总天数值 |
| `totalHours` | 总小时数 | `Number` | 仅：timespan | 间隔的总小时数 |
| `totalMinutes` | 总分钟数 | `Number` | 仅：timespan | 间隔的总分钟数值 |
| `totalSeconds` | 总秒数 | `Number` | 仅：timespan | 间隔的总秒数数值 |
| `textValue` | 文本值 | `Text` | 仅：timespan | 时间间隔的文本结果 |

## 选项值

### `type` 类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `getdate` | 取日期值（去除当天的时间部分） |  |
| `timespan` | 计算时间差（日期时间2 减 日期时间） |  |
| `endtime` | 计算结束时间 |  |
| `localToUtc` | 本地时间转换为UTC时间 |  |
| `utcToLocal` | UTC时间转换为本地时间 |  |
{/* xaction-metadata:end */}

时间相关的计算操作。



## 操作类型

### 取日期值

比如 2020-1-1 12:34:00 ，去除时间值12:34:00，返回当天0点的时间值 2020-1-1 0:0:0

![](./img/computetime-001-96bc28002f.png)



### 计算时间差

计算“日期时间”和“日期时间2”两个时间的差值。

![](./img/computetime-002-a96e2853c9.png)



格式化字符串所支持的代号请参考：[https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/custom-timespan-format-strings](https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/custom-timespan-format-strings)



### 计算结束时间

根据“日期时间”指定的开始时间，增加相应的年、月、天、小时、分钟、秒数后，计算结果时间。

一般仅指定一个参数，如添加700天后的时间等。可以为负值。

![](./img/computetime-003-df3bd1555f.png)



### 本地时间转换为UTC时间、UTC时间转换为本地时间

本地时间和UTC时间之间进行转换。

![](./img/computetime-004-e8be5a408e.png)
