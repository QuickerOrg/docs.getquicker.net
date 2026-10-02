---
title: "Hit"
description: "Hit的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/hit
comments: false
sidebar_position: 10
---

{/* script-api:start */}

找图/找字命中：区域、中心点与分数。可写入 State 并用 qk.State.Get&lt;List&lt;Hit>> 读回。

## 构造

```csharp
Hit(Rect Bounds, Pt Center, double Score)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Bounds` | `Rect` | 见类型说明。 |
| `Center` | `Pt` | 见类型说明。 |
| `Score` | `double` | 找图为相似度 0–1；找字为所在行的 OCR 置信度 0–1。 |

{/* script-api:end */}
