---
title: "CaptureResult"
description: "CaptureResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/captureresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

截图结果。

## 构造

```csharp
CaptureResult(Img? Image, Rect Area, string? Text = null, string? Path = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Image` | `Img?` | 截到的图片（句柄；返回或写入 State 时编码为 null）；CapturePro 未产出图片时为 null。 |
| `Area` | `Rect` | 所截区域（屏幕物理像素）。 |
| `Text` | `string?` | 识别的文字；仅 CapturePro 的 ocrCopy 模式有值。 |
| `Path` | `string?` | 保存的文件路径；仅 quickSave 等保存时有值。 |

{/* script-api:end */}
