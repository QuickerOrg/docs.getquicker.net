---
title: "ActionErrorCode"
description: "ActionErrorCode的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/actionerrorcode
comments: false
sidebar_position: 10
---

{/* script-api:start */}

qk 错误码。qk 调用可能报出的每个码都有同名常量（错误码的 PascalCase，如 ActionErrorCode.BrowserUnavailable）；也可用 e.Code.Value == "…" 比较。HOST_UNAVAILABLE 表示当前宿主没有提供该服务（与未获授权的 CAPABILITY_DENIED 不同）。

## 构造

```csharp
ActionErrorCode(string Value)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Value` | `string` | 见类型说明。 |

{/* script-api:end */}
