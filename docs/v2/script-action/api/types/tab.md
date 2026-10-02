---
title: "Tab"
description: "Tab的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/tab
comments: false
sidebar_position: 10
---

{/* script-api:start */}

浏览器标签页。

## 构造

```csharp
Tab(int Id, int WindowId, string Url, string Title, bool Active)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Id` | `int` | 标签页 Id（可交给 qk.Browser 的 tabId 参数）。 |
| `WindowId` | `int` | 见类型说明。 |
| `Url` | `string` | 见类型说明。 |
| `Title` | `string` | 见类型说明。 |
| `Active` | `bool` | 是否为所在窗口的当前标签页。 |

{/* script-api:end */}
