---
title: "ReminderInfo"
description: "ReminderInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/reminderinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

待触发的一次性提醒（Quicker.ListReminders 返回）。

## 构造

```csharp
ReminderInfo(string Id, string Title, string? Text, DateTimeOffset At)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Id` | `string` | 提醒 Id，可传给 CancelReminder。 |
| `Title` | `string` | 提醒标题。 |
| `Text` | `string?` | 提醒正文；没有为 null。 |
| `At` | `DateTimeOffset` | 原定触发时刻（本机时区偏移）。 |

{/* script-api:end */}
