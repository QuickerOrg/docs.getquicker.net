---
title: 日期时间的处理
description: 获取当前时间、格式化为文本，以及时间戳换算的常用做法。
slug: /v2/xaction/guides/date-time-process
sidebar_position: 40
quickerDocKey: xaction/guides/date-time-process
comments: true
docStatus: reviewed
legacyDocId: 1402276
legacyContentUpdatedAt: "2019-03-20T13:41:43.000Z"
---

# 日期时间的处理

组合动作里处理日期时间，最常用的是 [获取日期时间](/v2/xaction/modules/gettime)：取当前时间，或从文本 / Unix 时间戳转进来，再按格式输出文本。要算时间差、加减时长、本地与 UTC 互转，用 [计算时间](/v2/xaction/modules/computetime)。

## 获取当前时间

在工具箱打开 **获取日期时间**，把 **时间来源** 设为 **当前时间**。需要文本时，在 **输出文本值格式** 里写格式串，结果从 **文本值** 输出；同时还能拆出年、月、日和 Unix 时间戳等。

<ModuleParamPreview
  moduleKey="sys:getCurrentTime"
  values={{
    source: 'currTime',
    useUtc: 'false',
    format: 'yyyy-MM-dd HH:mm:ss, dddd',
  }}
  outputVars={{
    strValue: 'context',
    timeStamp: 'tmStamp',
    year: 'year',
    month: 'month',
    day: 'day',
    hour: 'hour',
    minute: 'minute',
    second: 'seconds',
    dayOfWeek: 'dayOfWeek',
    dayOfYear: 'dayOfYear',
  }}
  focusKeys={[
    'source',
    'useUtc',
    'format',
    'strValue',
    'timeStamp',
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'dayOfWeek',
    'dayOfYear',
  ]}
/>

**使用UTC时间**：关闭时用电脑本地时间；开启时用 UTC。标准 Unix 时间戳一般要开启，见模块页说明。

一条「取当前时间 → 弹出提示」的最小例子：

<StepProgramView
  caption="当前时间文本 → 提示"
  data={{
    steps: [
      {
        key: 'sys:getCurrentTime',
        inputs: {
          source: 'currTime',
          format: 'yyyy-MM-dd HH:mm:ss',
        },
        outputs: {strValue: 'nowText'},
      },
      {
        key: 'sys:notify',
        inputs: {msg: '{nowText}'},
      },
    ],
  }}
/>

## 把时间变成文本

### 方式一：在「获取日期时间」里直接格式化

设好 **输出文本值格式**，绑定 **文本值** 输出即可。上面预览里的 `yyyy-MM-dd HH:mm:ss, dddd` 就是这种用法。完整参数见 [获取日期时间](/v2/xaction/modules/gettime)。

### 方式二：用「组合成文本」

时间已在变量里（例如 `currTime`），要用 C# `String.Format` 拼进一段话时，用 [组合成文本](/v2/xaction/modules/formatstring)。`{0}` 对应 **参数0**，冒号后面写日期格式：

<PreviewMarks
  marks={[
    {key: 'formatString', label: '{0:格式} 对应参数0'},
    {key: 'p0', label: '日期时间变量'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:formatString"
    values={{
      formatString: '当前时间是: {0:yyyyMMdd-HH:mm:ss}',
    }}
    inputVars={{p0: 'currTime'}}
    outputVars={{output: 'context'}}
    focusKeys={['formatString', 'p0', 'output']}
  />
</PreviewMarks>

### 方式三：插值

文本参数最前面写 `$$`，中间用 `{变量名}` 插入日期时间变量，会按默认格式转成文本。写法见 [文本插值](/v2/xaction/concepts/interpolation)。表达式里也可以写 `{DateTime.Now.ToString("yyyy-MM-dd")=}`。

## 常用格式字符

内部用 C# `DateTime.ToString()`。常用符号：

| 符号 | 说明 |
| --- | --- |
| `yy` | 年份后两位 |
| `yyyy` | 四位年份 |
| `MM` | 两位月份（不足补 0） |
| `dd` | 日 |
| `ddd` | 周几（缩写） |
| `dddd` | 星期几（全称） |
| `hh` | 12 小时制小时 |
| `HH` | 24 小时制小时 |
| `mm` | 分钟 |
| `ss` | 秒 |
| `ff` / `fff` / `ffff` | 毫秒前 2 / 3 / 4 位 |
| `-` `/` `:` 等 | 非格式字符作分隔符 |

完整说明见 [.NET 自定义日期和时间格式字符串](https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/custom-date-and-time-format-strings)。

## 时间戳与时间计算

- **Unix 时间戳 → 时间**：在 [获取日期时间](/v2/xaction/modules/gettime) 把 **时间来源** 选成从 Unix 时间戳转换（秒或毫秒），填 **Unix时间戳值**，并按来源决定是否勾选 **使用UTC时间**。
- **时间差、加减天数、本地 ↔ UTC**：用 [计算时间](/v2/xaction/modules/computetime)，不要再用旧的「计算」模块自定义函数当主路径。

## 限制与排障

- 格式串写错时，文本输出可能异常或失败；打开 **失败后停止** 便于立刻定位。
- `ddd` / `dddd` 等依赖 **输出语言文化**；中英文星期文案不一致时检查该参数。
- 「组合成文本」最多 5 个参数；更多占位请拆步或用表达式 / 插值。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/gettime',
      label: '获取日期时间',
      description: '当前时间、文本与时间戳互转',
    },
    {
      href: '/v2/xaction/modules/computetime',
      label: '计算时间',
      description: '时间差、加减时长、时区',
    },
    {
      href: '/v2/xaction/modules/formatstring',
      label: '组合成文本',
      description: 'String.Format 拼日期格式',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 插入变量为文本',
    },
  ]}
/>
