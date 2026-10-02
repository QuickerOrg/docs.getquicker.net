---
title: "qk.Image：图片"
description: "qk.Image：图片的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/image
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Img 图片的读取、生成二维码、处理与保存为文件（路径规则与 qk.Files 相同）；截屏见 qk.Screen，找图/OCR/识别二维码见 qk.Vision。Img 仅本次运行有效（不能返回或写入 State）；每次运行最多同时存活 32 个、累计创建 1024 个，单图最多 4000 万像素、单边 32768，存活像素 512 MiB。

<a id="image-load" />

## Image.Load

```csharp
Img Load(object source)
```

读取图片（png/jpg/gif/bmp/tif/ico，不支持 webp；取第一帧，按 EXIF 方向转正）。路径规则与 qk.Files 相同（可用 UNC），需要读文件能力；网址需要网络能力（最多 32 MiB、30 秒）；数据（含 Base64/data URI）最多 64 MiB；ftp:/file: 等其他协议报 INVALID_ARGUMENT，无法解码报 IMAGE_DECODE_FAILED。

| 参数声明 | 说明 |
|---|---|
| `object source` | 文件路径、http(s) 网址、byte[]、Base64 或 data URI。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="image-save" />

## Image.Save

```csharp
string Save(Img image, string path, int quality = 90, bool overwrite = false)
```

保存为文件并返回完整路径；格式按扩展名（png|jpg|jpeg|bmp|gif|tif|tiff）。路径规则与 qk.Files 相同，需要写文件能力；写同目录临时文件后替换，已存在且未 overwrite 报 FILE_FAILED，编码失败报 IMAGE_ENCODE_FAILED。

| 参数声明 | 说明 |
|---|---|
| `Img image` | 见本成员和所在域的说明。 |
| `string path` | 见本成员和所在域的说明。 |
| `int quality = 90` | JPEG 质量 1–100。 |
| `bool overwrite = false` | 覆盖已有文件（默认不覆盖，已存在则报错）。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="image-createqr" />

## Image.CreateQr

```csharp
Img CreateQr(string text, int size = 256, Img? icon = null, string darkColor = "#000000", string lightColor = "#FFFFFF", bool quietZone = true)
```

生成二维码图片（纠错级别 Q）；文本超出容量报 INVALID_ARGUMENT。识别二维码见 qk.Vision.ReadQr。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `int size = 256` | 边长像素 64–4096，且不小于二维码的模块数。 |
| `Img? icon = null` | 中心图标（Img，占 15%）。 |
| `string darkColor = "#000000"` | 见本成员和所在域的说明。 |
| `string lightColor = "#FFFFFF"` | 见本成员和所在域的说明。 |
| `bool quietZone = true` | 是否保留白边。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
