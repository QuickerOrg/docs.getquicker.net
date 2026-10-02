---
title: "ChatMessage"
description: "ChatMessage的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/chatmessage
comments: false
sidebar_position: 10
---

{/* script-api:start */}

AI 对话历史消息。

## 构造

```csharp
ChatMessage(string Role, string Text)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Role` | `string` | user&#124;assistant（system 提示请用 system 参数）。 |
| `Text` | `string` | 见类型说明。 |

{/* script-api:end */}
