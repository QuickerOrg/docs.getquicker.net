---
title: "qk.Vision：找图与 OCR"
description: "qk.Vision：找图与 OCR的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/vision
comments: false
sidebar_position: 10
---

{/* script-api:start */}

在屏幕或图片中识别内容（找图、找色、找字、OCR、识别二维码）；截图本身见 qk.Screen，生成二维码见 qk.Image.CreateQr。结果为屏幕坐标（传入 Img 时为图内坐标）；area 与 window 都为 null 时搜索全部显示器，给出 window 时只在窗口内搜索（找字/OCR 在 area 与 window 都为 null 时逐块显示器识别再合并）；没找到返回空数组。每次运行最多 1000 次截图（与 qk.Screen.Capture/CaptureWindow 共用）：FindImage/FindColor/FindText/Ocr(Rect 或 null) 每次调用计 1 次，timeoutMs 重试的每一轮（每 300 毫秒）再计 1 次，FindText（area 与 window 都为 null）与 Ocr(null) 每块显示器各计 1 次；Ocr(Img)、ReadQr 与 qk.Screen.GetPixel 不计。长时间监视请先调大动作超时（默认 30 秒墙钟；如设为 40 分钟或 0=不限制），再控制总次数在约 950 次内（如 30 分钟每 2 秒查一次；每秒一次约 16 分钟就会 LIMIT_EXCEEDED），或先用 GetPixel 轮询已知点，变化后再搜索。另限 100 次二维码。OCR 只用本机 OCR Agent（不联网、不自动下载模型；不限 OCR 次数、像素与行数），错误码：OCR_UNAVAILABLE（未安装，消息附安装方法）、OCR_TIMEOUT、OCR_FAILED。

<a id="vision-findimage" />

## Vision.FindImage

```csharp
Hit[] FindImage(Img template, Rect? area = null, Win? window = null, double similarity = 0.9, int limit = 1, int timeoutMs = 0)
```

在屏幕中找模板图，按相似度降序返回命中；没找到返回空数组。按 RGB 比较，忽略模板与屏幕的透明度（透明像素按其 RGB 参与比较）。

| 参数声明 | 说明 |
|---|---|
| `Img template` | 见本成员和所在域的说明。 |
| `Rect? area = null` | 见本成员和所在域的说明。 |
| `Win? window = null` | 见本成员和所在域的说明。 |
| `double similarity = 0.9` | 最低相似度 0–1。 |
| `int limit = 1` | 最多返回数（1–100）。 |
| `int timeoutMs = 0` | 大于 0 时找不到会每 300 毫秒重试直到超时（最长 600000）；每轮重新截图，计入每次运行 1000 次截图。 |

返回类型：`Hit[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="vision-findcolor" />

## Vision.FindColor

```csharp
Pt[] FindColor(string color, Rect? area = null, Win? window = null, int tolerance = 0, int limit = 1)
```

找颜色，返回命中点；没找到返回空数组。每次调用计 1 次截图。

| 参数声明 | 说明 |
|---|---|
| `string color` | "#RRGGBB"。 |
| `Rect? area = null` | 见本成员和所在域的说明。 |
| `Win? window = null` | 只在该窗口内找（area 仍为屏幕坐标，与窗口取交集）；null 为不限窗口。 |
| `int tolerance = 0` | 逐通道容差 0–255。 |
| `int limit = 1` | 最多返回数（1–64）；从左上角按行扫描。 |

返回类型：`Pt[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="vision-findtext" />

## Vision.FindText

```csharp
Hit[] FindText(string text, Rect? area = null, Win? window = null, int timeoutMs = 0, string model = "small", bool detectOrientation = false)
```

用本机 OCR 在屏幕上找文字（行内包含、忽略大小写，每行取第一处）；没找到返回空数组。命中的 Bounds/Center 按子串在行内的字符位置比例估算（不等宽字体有偏差），Score 为该行的 OCR 置信度。area/window 都为 null 时逐块显示器识别；每轮识别单次超时 30 秒（OCR_TIMEOUT）。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `Rect? area = null` | 见本成员和所在域的说明。 |
| `Win? window = null` | 见本成员和所在域的说明。 |
| `int timeoutMs = 0` | 大于 0 时找不到会每 300 毫秒重试直到超时（最长 600000）；每轮重新截图并识别，计入截图次数。 |
| `string model = "small"` | 同 Ocr 的 model。 取值：`tiny`、`small`。 |
| `bool detectOrientation = false` | 同 Ocr 的 detectOrientation。 |

返回类型：`Hit[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像；本机文字识别。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="vision-ocr" />

## Vision.Ocr

```csharp
OcrResult Ocr(object? source = null, string model = "small", bool detectOrientation = false, int timeoutMs = 30000)
```

用本机 OCR Agent 识别文字（不联网、不自动下载模型），返回全部行（返回值经编码最多 10000 项 / 1 MiB，大结果请自行截取）。超时报 OCR_TIMEOUT，未安装报 OCR_UNAVAILABLE（消息附安装方法），其他失败报 OCR_FAILED。识别表格用 OcrTable。

| 参数声明 | 说明 |
|---|---|
| `object? source = null` | Img（图内坐标）、Rect（屏幕区域）或 null（全部显示器：逐块显示器识别后合并，坐标为屏幕坐标）。 |
| `string model = "small"` | tiny&#124;small 文字模型档位：small（默认，更准）、tiny（更快）；只对本次调用覆盖全局 OCR 设置，不修改设置。 取值：`tiny`、`small`。 |
| `bool detectOrientation = false` | 同时识别旋转/倒置的文字（较慢）；只对本次调用覆盖全局 OCR 设置。 |
| `int timeoutMs = 30000` | 本次调用超时毫秒（默认 30000，最大 90000；0 为不另设）；始终受动作总超时约束（默认 30 秒墙钟）。超时报 OCR_TIMEOUT，OCR Agent 可能仍在后台算完，结果丢弃。单次识别请求另有约 90 秒上限，超出报 OCR_FAILED；timeoutMs 只能缩短不能延长这一上限。 |

返回类型：`OcrResult`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像；本机文字识别。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="vision-ocrtable" />

## Vision.OcrTable

```csharp
OcrTableResult OcrTable(object? source = null, bool detectOrientation = false, int timeoutMs = 30000)
```

本机表格识别（不会自动下载模型）：返回 TSV、HTML、行列数、单元格（含合并跨度与位置）与表头行数；表格文字模型固定，没有 model 参数。错误码同 Ocr。

| 参数声明 | 说明 |
|---|---|
| `object? source = null` | Img、Rect（屏幕区域）或 null（整块虚拟屏）。 |
| `bool detectOrientation = false` | 同 Ocr 的 detectOrientation。 |
| `int timeoutMs = 30000` | 同 Ocr 的 timeoutMs。 |

返回类型：`OcrTableResult`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像；本机文字识别。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="vision-readqr" />

## Vision.ReadQr

```csharp
string[] ReadQr(Img image)
```

识别图中的二维码；没有返回空数组。单图最多 1600 万像素，每次运行最多 100 次。生成二维码见 qk.Image.CreateQr。

| 参数声明 | 说明 |
|---|---|
| `Img image` | 见本成员和所在域的说明。 |

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
