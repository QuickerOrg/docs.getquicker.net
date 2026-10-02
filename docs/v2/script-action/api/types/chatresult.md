---
title: "ChatResult"
description: "ChatResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/chatresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

AI 对话窗口的结果（用户点“采用”时）。

## 构造

```csharp
ChatResult(string Answer, string ConversationId, int Rounds)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Answer` | `string` | 最后一轮回答。 |
| `ConversationId` | `string` | 会话 Id；传给 Chat 的 conversationId 可继续该会话。 |
| `Rounds` | `int` | 已进行的提问轮数。 |

{/* script-api:end */}
