---
title: "OpenAssistantOptions"
description: "OpenAssistantOptions的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/openassistantoptions
comments: false
sidebar_position: 10
---

{/* script-api:start */}

字段与构造方法如下。

## 构造

```csharp
OpenAssistantOptions()
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Prompt` | `string` | 见类型说明。 |
| `Materials` | `IEnumerable<AiMaterial>?` | 见类型说明。 |
| `AutoSend` | `bool` | 见类型说明。 |
| `TimeoutMs` | `int` | 见类型说明。 |

{/* script-api:end */}

## 默认值与发送方式

- `Prompt` 默认为空字符串，用于本轮问题，不是系统提示词。
- `Materials` 可为空；材料由 [AiMaterial](./aimaterial.md) 的工厂方法创建。
- `AutoSend` 默认为 `false`：准备好材料后交给用户确认。设为 `true` 会直接提交，可能产生模型费用；调用只等待助手接受本轮，不等待回答。
- `TimeoutMs` 默认为 `120000` 毫秒，控制准备和交付的等待时间，不是 AI 生成回答的时长限制。

提交结果不明时先检查会话，不要立即重复调用。含图会话及旧版兼容限制见[升级与回退](/v2/migration/upgrade-and-rollback#ai-images-2345)。
