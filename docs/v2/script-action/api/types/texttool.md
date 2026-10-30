---
title: "TextTool"
description: "TextTool的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/texttool
comments: false
sidebar_position: 10
---

{/* script-api:start */}

自定义文本工具：同步 Handler 在原脚本线程处理 TextToolInput，返回 string 替换或 null 不修改；宜仅做短时间文本处理。Replace 固定为 all/selection，关闭窗口后后续 qk 被拒绝，纯计算继续至返回、停止或超时。

## 构造

```csharp
TextTool(string Title, Func<TextToolInput, string?> Handler, string Replace = "all", string? Icon = null, string? Help = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string` | 见类型说明。 |
| `Handler` | `Func<TextToolInput, string?>` | 见类型说明。 |
| `Replace` | `string` | 见类型说明。 |
| `Icon` | `string?` | 见类型说明。 |
| `Help` | `string?` | 见类型说明。 |

{/* script-api:end */}
