---
title: "HttpResult"
description: "HttpResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/httpresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

HTTP 响应：状态码、文本正文、响应头（同名多值以 ", " 合并，按头名查询不区分大小写）与 SetCookies；IsSuccess 表示 2xx。

## 构造

```csharp
HttpResult(int StatusCode, string Text, IReadOnlyDictionary<string, string> Headers, string[] SetCookies)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `StatusCode` | `int` | 见类型说明。 |
| `Text` | `string` | 见类型说明。 |
| `Headers` | `IReadOnlyDictionary<string, string>` | 见类型说明。 |
| `SetCookies` | `string[]` | 每条 Set-Cookie 响应头的完整原值（不合并、不解析）；没有为空数组。 |
| `IsSuccess` | `bool` | 见类型说明。 |

{/* script-api:end */}
