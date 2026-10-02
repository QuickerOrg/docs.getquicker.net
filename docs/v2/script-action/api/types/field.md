---
title: "Field"
description: "Field的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/field
comments: false
sidebar_position: 10
---

{/* script-api:start */}

表单字段。

## 构造

```csharp
Field(string Key, string Label, string Kind = "text", object? Value = null, string? Options = null, bool Required = false, string? Help = null, string? Group = null, string? Visible = null, string? Pattern = null, double? Min = null, double? Max = null, bool ReadOnly = false, int Width = 0)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Key` | `string` | 字段键（FormResult.Values 的键）；label/separator 的键被忽略，其余字段须唯一且为字母、数字或下划线。 |
| `Label` | `string` | 见类型说明。 |
| `Kind` | `string` | text&#124;multiline&#124;number&#124;slider&#124;check&#124;dropdown&#124;combo&#124;autocomplete&#124;multi&#124;radio&#124;date&#124;dateTime&#124;color&#124;password&#124;font&#124;dict&#124;label&#124;separator。 |
| `Value` | `object?` | 初值；dropdown/radio 等选项字段填选项的值。 |
| `Options` | `string?` | 选项，每行 "[fa:icon]标题&#124;值"；图标只支持 fa:，不支持 &#124;= 自定义分隔符。 |
| `Required` | `bool` | 见类型说明。 |
| `Help` | `string?` | 字段帮助；以 MD: 开头按 Markdown 显示（不支持图片与 HTML 标签）。 |
| `Group` | `string?` | 分组名（分页显示）。 |
| `Visible` | `string?` | 条件显示，如 "kind == 'md' &#124;&#124; kind == 'html'"：子句为 key == 值、key != 值、key / !key（仅 check 字段），以 && 或 &#124;&#124; 连接（不支持括号）；key 为其他字段的 Key。值为数字、true/false、'文本' 或 "文本"，或不含空格与符号的裸词（按字符串处理：kind == md 等同 kind == 'md'）。check 字段只能与 true/false 比较，number/slider 只能与数字比较，multi/dict/date/dateTime 不能比较；引号内不能含引号、\、$、&#123;、&#125;；不支持 $= / $$ 表达式。语法错误在 Form 运行时报 INVALID_ARGUMENT。 |
| `Pattern` | `string?` | 正则校验（匹配超过 1 秒视为不符合）。 |
| `Min` | `double?` | 数值下限（number/slider）。 |
| `Max` | `double?` | 数值上限（number/slider）。 |
| `ReadOnly` | `bool` | 见类型说明。 |
| `Width` | `int` | 字段宽度；0 为默认。 |

{/* script-api:end */}
