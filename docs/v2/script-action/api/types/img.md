---
title: "Img"
description: "Img的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/img
comments: false
sidebar_position: 10
---

{/* script-api:start */}

图片句柄：仅本次运行有效，不能返回或写入 State；带出时用 ToBase64/ToBytes 或 qk.Image.Save。变换返回新图，不改原图；结果单边最多 32768、最多 4000 万像素（否则 LIMIT_EXCEEDED）。

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Width` | `int` | 宽（像素）。 |
| `Height` | `int` | 高（像素）。 |

<a id="img-crop" />

## Img.Crop

```csharp
Img Crop(Rect area)
```

裁剪（图内像素坐标），返回新图；超出范围报 INVALID_ARGUMENT。

| 参数声明 | 说明 |
|---|---|
| `Rect area` | 见本成员和所在域的说明。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-resize" />

## Img.Resize

```csharp
Img Resize(int width, int height = 0)
```

缩放到指定尺寸，返回新图。

| 参数声明 | 说明 |
|---|---|
| `int width` | 见本成员和所在域的说明。 |
| `int height = 0` | 高；0 为按宽等比。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-scale" />

## Img.Scale

```csharp
Img Scale(double factor)
```

按比例缩放（如 0.5），返回新图。

| 参数声明 | 说明 |
|---|---|
| `double factor` | 见本成员和所在域的说明。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-rotate" />

## Img.Rotate

```csharp
Img Rotate(int degrees)
```

顺时针旋转，返回新图。

| 参数声明 | 说明 |
|---|---|
| `int degrees` | 角度（90 的倍数）。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-grayscale" />

## Img.Grayscale

```csharp
Img Grayscale()
```

灰度，返回新图。

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-invert" />

## Img.Invert

```csharp
Img Invert()
```

反色，返回新图。

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-tobytes" />

## Img.ToBytes

```csharp
byte[] ToBytes(string format = "png", int quality = 90)
```

编码为字节（可返回或写入文件）；编码结果最多 256 MiB，编码失败报 IMAGE_ENCODE_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string format = "png"` | png&#124;jpg&#124;bmp。 取值：`png`、`jpg`、`bmp`。 |
| `int quality = 90` | JPEG 质量 1–100（只用于 jpg）。 |

返回类型：`byte[]`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-tobase64" />

## Img.ToBase64

```csharp
string ToBase64(bool dataUri = false, string format = "png", int quality = 90)
```

编码为 Base64 文本（可返回）；默认 PNG。

| 参数声明 | 说明 |
|---|---|
| `bool dataUri = false` | 带 data URI 前缀（如 data:image/png;base64,）。 |
| `string format = "png"` | png&#124;jpg&#124;bmp。 取值：`png`、`jpg`、`bmp`。 |
| `int quality = 90` | JPEG 质量 1–100（只用于 jpg）。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

<a id="img-dispose" />

## Img.Dispose

```csharp
void Dispose()
```

提前释放像素（循环中大量取图时使用）；之后再用本句柄报错。停止后的 finally 中也可调用。

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

{/* script-api:end */}
