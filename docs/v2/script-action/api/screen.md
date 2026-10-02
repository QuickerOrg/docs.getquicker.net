---
title: "qk.Screen：截屏"
description: "qk.Screen：截屏的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/screen
comments: false
sidebar_position: 10
---

{/* script-api:start */}

获取屏幕图像：截屏、截窗口、框选截图、截图 Pro、取色与显示器信息（屏幕物理像素）；只要坐标不要图像见 qk.Ui.PickArea。PickCapture 与 CapturePro 合计每次运行 64 次；截屏计入每次运行 1000 次截图；停止脚本会关闭框选界面。

<a id="screen-capture" />

## Screen.Capture

```csharp
Img Capture(Rect? area = null, string screen = "all")
```

截取屏幕。

| 参数声明 | 说明 |
|---|---|
| `Rect? area = null` | 区域（屏幕物理像素）；null 时按 screen。 |
| `string screen = "all"` | all（全部显示器）&#124;primary（主屏）&#124;mouse（鼠标所在屏）。 取值：`all`、`primary`、`mouse`。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="screen-capturewindow" />

## Screen.CaptureWindow

```csharp
Img CaptureWindow(Win window, bool background = false)
```

截取窗口。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool background = false` | 后台截图（PrintWindow）：窗口被遮挡也能截，部分程序为黑图；最小化窗口不可截。 |

返回类型：`Img`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="screen-pickcapture" />

## Screen.PickCapture

```csharp
CaptureResult? PickCapture(bool detect = true, int delayMs = 0)
```

由用户框选区域并截图；取消返回 null。脚本被停止时框选界面随之关闭。

| 参数声明 | 说明 |
|---|---|
| `bool detect = true` | 自动识别窗口/控件区域。 |
| `int delayMs = 0` | 开始框选前的延迟毫秒。 |

返回类型：`CaptureResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：交互式截图。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="screen-capturepro" />

## Screen.CapturePro

```csharp
CaptureResult? CapturePro(string mode = "capture")
```

打开截图 Pro；取消返回 null；截图不写入截图历史。capture/captureNow 在用户确认后以 CaptureResult.Image 返回截图。

| 参数声明 | 说明 |
|---|---|
| `string mode = "capture"` | capture&#124;captureNow&#124;copy&#124;pin&#124;ocr&#124;ocrCopy&#124;table&#124;formula&#124;translate&#124;imageTranslate&#124;quickSave（不区分大小写）；仅 ocrCopy 返回文字（识别失败报 CAPTURE_PRO_FAILED），ocr/table/formula/translate/imageTranslate 打开结果界面。copy/ocrCopy 需要写剪贴板能力，quickSave 需要写文件能力，pin/ocr/ocrCopy/table/formula/translate/imageTranslate 需要网络能力（识别可能回退在线或自动下载模型）。 取值：`capture`、`captureNow`、`copy`、`pin`、`ocr`、`ocrCopy`、`table`、`formula`、`translate`、`imageTranslate`、`quickSave`。 |

返回类型：`CaptureResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：交互式截图。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="screen-getpixel" />

## Screen.GetPixel

```csharp
string GetPixel(Pt point)
```

读取屏幕点（Pt，物理像素）的颜色，返回 "#RRGGBB"；不计入 1000 次截图（适合轮询）；点不在屏幕上报 INVALID_ARGUMENT。

| 参数声明 | 说明 |
|---|---|
| `Pt point` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取屏幕图像。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="screen-list" />

## Screen.List

```csharp
ScreenInfo[] List()
```

全部显示器信息（主屏在前）；ScreenInfo.Id 可传给 qk.Sys.GetBrightness/SetBrightness 的 screen。

返回类型：`ScreenInfo[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
