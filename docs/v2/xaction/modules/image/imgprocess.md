---
title: "图片处理"
description: "图片处理和变换"
slug: "/v2/xaction/modules/imgprocess"
sidebar_label: "图片处理"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:imgProcess"
comments: true
moduleKey: "sys:imgProcess"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2213317
legacyContentUpdatedAt: "2024-08-26T12:05:06.000Z"
---

# 图片处理

对图片做缩放、复制、反色、灰度、旋转，或按命令做组合处理；也可以生成 `.ico`。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:imgProcess" />

## 概述

组合处理封装了 [ImageProcessor](https://github.com/JimBobSquarePants/ImageProcessor)，命令较多，需要一点图像处理基础。该能力仍标为测试，遇到问题请反馈。

<ModuleParamPreview moduleKey="sys:imgProcess" />

## 参数说明

**图片**：要处理的图片变量。组合处理时也可以不填，改在处理参数里用 `Load:` 从磁盘读。

**操作类型**：

- 缩放图片(指定比例)
- 缩小图片(指定像素)
- 复制图片：先复制一份再改，避免动到原图。
- 反色
- 灰度
- 旋转
- 组合处理
- 生成图标文件(.ico)

**缩放比例**：仅指定比例。相对原图的百分比，如 `50` 表示边长缩到一半。也可以大于 100 放大。

**最大宽度** / **最大高度**：仅指定像素。`0` 表示按另一边自动。保持长宽比。两边都填时，按不超过这两边来缩。

**旋转方式**：仅旋转。顺时针。`0` 不转，`1` 90°，`2` 180°，`3` 270°，`99` 按 Exif 方向自动转。其它值见下表。

**处理参数**：仅组合处理。每行一条命令。

**图标文件保存路径** / **图标大小** / **缩放采样**：仅生成 ico。见后文。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否处理成功。
- **结果图片**：仅复制、按比例缩放、按像素缩小、组合处理。反色、灰度、旋转没有这项，表示直接改原图。

### 旋转方式取值

度数均为顺时针。同一数字对应两种等价写法：

| 值 | 旋转和翻转 |
| --- | --- |
| 0 | 不旋转；或旋转 180° 后再水平和垂直翻转 |
| 1 | 顺时针 90°；或旋转 270° 后再水平和垂直翻转 |
| 2 | 旋转 180°；或直接水平和垂直翻转 |
| 3 | 旋转 270°；或旋转 90° 后再水平和垂直翻转 |
| 4 | 旋转 180° 后再垂直翻转；或水平翻转 |
| 5 | 旋转 270° 后再垂直翻转；或旋转 90° 后再水平翻转 |
| 6 | 垂直翻转；或旋转 180° 后再水平翻转 |
| 7 | 旋转 90° 后再垂直翻转；或旋转 270° 后再水平翻转 |
| 99 | 按 Exif 方向自动旋转 |

## 组合处理

处理参数每行一条，格式为 `命令:参数1;参数2;...`（半角冒号、半角分号）。`//` 开头是注释。

图片参数不是必须的，可用 `Load:` 从磁盘读；结果图片也可以不接，改用 `Save:` 直接写文件。

节约打印机墨粉的示例（先加亮、再把浅色底变成白）：

<ModuleParamPreview
  moduleKey="sys:imgProcess"
  focusKeys={['type', 'filterParams']}
  values={{
    type: 'Filters',
    filterParams: '$$\nLoad:{path}\nBrightness:30\nContrast:30\n//GaussianSharpen:3\n//Filter:3\nAutoRotate:\nWhiteThreshold:220\n//ReplaceColor:#edeae1;#FFFFFF;40\nSave:{savePath}',
  }}
/>

```text
$$
Load:{path}
Brightness:30
Contrast:30
//GaussianSharpen:3
//Filter:3
AutoRotate:
WhiteThreshold:220
//ReplaceColor:#edeae1;#FFFFFF;40
Save:{savePath}
```

含义：从 path 变量加载 → 亮度 +30% → 对比度 +30% → 自动旋转 → 高于指定亮度的像素改成白 → 存到 savePath。注释掉的行用来生成灰度或换色，需要时去掉 `//`。

<StepProgramView example="1a7f485b-bf5d-42f4-6452-08d8ba8b34b3" />

<ShareLinkCard
  code="1a7f485b-bf5d-42f4-6452-08d8ba8b34b3"
  title="节约墨水"
  description="将老师拍摄的作业图片加亮"
  author="CL"
/>

处理效果：

![](./img/imgprocess-003-a8856c088e.png)

### 命令列表

| 处理 | 命令及说明 |
| --- | --- |
| 更改透明度 | `Alpha:图片透明度`（0–100） |
| 自动旋转 | `AutoRotate:` 按 Exif，无额外参数。`AutoRotate:0` 表示不执行 |
| 更改背景颜色 | `BackgroundColor:颜色`。先 `Format:png` 才能用透明色 |
| 调整亮度 | `Brightness:值`（-100 到 100）。`Brightness:30` 表示亮度 +30% |
| 限制图片大小 | `Constrain:宽度,高度`。较小的图也会放大到这个尺寸，缩小时保持比例 |
| 调整对比度 | `Contrast:值`（-100 到 100） |
| 裁切 | `Crop:左边像素,顶边像素,宽度,高度` |
| 倾斜校正 | `Deskew:` 校正扫描文档方向 |
| 边界检测 | `DetectEdges:滤镜序号;是否转灰度`。序号 0 Kayyali、1 Kirsch、2 Laplacian3X3、3 Laplacian5X5、4 LaplacianOfGaussian、5 Prewitt、6 RobertsCross、7 Scharr、8 Sobel。灰度 `true`/`false`。例：`DetectEdges:0;true` |
| EntropyCrop | `EntropyCrop:阈值`（0–255）。[原始文档](https://imageprocessor.org/imageprocessor/imagefactory/entropycrop/)。四周大面积单色时较好 |
| 滤镜 | `Filter:序号`。0 黑白、1 漫画、2 Gotham、3 灰度、4 HiSatch、5 反转、6 Lomograph、7 LoSatch、8 宝丽来、9 棕褐。[原始文档](https://imageprocessor.org/imageprocessor/imagefactory/filter/) |
| 翻转 | `Flip:true` 垂直；`Flip:false` 水平 |
| 设置保存格式 | `Format:png\|jpg\|tiff\|bmp\|gif`（1.22.29+）。透明色请先 `Format:png` |
| Gamma | `Gamma:值`，通常 0.2–0.5 |
| 高斯模糊 | `GaussianBlur:像素数`，越大越糊 |
| 高斯锐化 | `GaussianSharpen:像素数` |
| 色调 | `Hue:度数;是否旋转`。度数 0–360；rotate 默认 false |
| 加载图片 | `Load:路径`。支持 bmp / jpg / png / tiff |
| 遮罩 | `Mask:遮罩路径;坐标(可空)`。遮罩里透明的区域会从原图去掉。遮罩更大时会缩到原图尺寸。坐标 `x,y`，空则居中 |
| 叠加层（图片水印） | `Overlay:路径;坐标(可空);尺寸(可空);不透明度`。坐标 `x,y`，空则居中；尺寸 `宽,高`；不透明度 0–100 |
| 像素化 | `Pixelate:像素数`。[参考](https://imageprocessor.org/imageprocessor/imagefactory/pixelate/) |
| 替换颜色 | `ReplaceColor:旧颜色;新颜色;容差`。颜色支持 `#RRGGBB`、`#AARRGGBB`、`rgb(...)`、`rgba(...)`。容差 0–128。透明色请先 `Format:png` |
| 重置 | `Reset:` 回到初始状态，便于一次动作里存多种结果 |
| 调整大小 | `Resize:宽度,高度`。某一边填 `0` 则忽略该边 |
| 调整大小（高级） | `ResizeEx:宽,高;缩放模式;锚点;是否放大`（1.22.40+）。宽高用逗号，其余用分号。模式：`0`/`Pad` 填充、`1`/`Stretch` 拉伸、`2`/`Crop` 裁切铺满、`3`/`Max` 限制最长边、`4`/`Min` 限制最短边、`5`/`BoxPad` 小图只填充不放大。锚点：`0` Center、`1` Top、`2` Bottom、`3` Left、`4` Right、`5` TopLeft、`6` TopRight、`7` BottomRight、`8` BottomLeft。是否放大仅非 Stretch 时有效 |
| 调整分辨率 | `Resolution:水平,垂直`。改的是分辨率元数据，不是像素尺寸 |
| 旋转角度 | `Rotate:角度`，可为小数 |
| 圆角 | `RoundedCorners:半径` 或 `RoundedCorners:半径;左上;右上;左下;右下`。透明效果请先 `Format:png` 和 `BackgroundColor:#00000000` |
| 饱和度 | `Saturation:比例`（-100 到 100） |
| 保存 | `Save:路径` |
| 色调 | `Tint:颜色` |
| 暗角 | `Vignette:颜色`。[参考](https://imageprocessor.org/imageprocessor/imagefactory/vignette/) |
| 文字水印 | `Watermark:字体;字号;颜色;风格;透明度;位置;阴影;垂直;RTL;文字`。风格可用 Bold / Italic / Underline / Strikeout，逗号分隔。位置 `x,y`，或 `x,y,锚点`（1.39.35+），或 `x,y,锚点,顺时针角度`（1.40.5+）；空则居中。锚点含义同 ResizeEx。文字可用 `\r\n` 换行。垂直、RTL 官方文档无对应参数，可能无效 |
| 二值化 | `Threshold:亮度`（0–255）。高于变白，低于变黑 |
| 底色过滤 | `WhiteThreshold:亮度`。高于变白，其余不变。常用于扫描件去纸色 |
| 输出质量 | `Quality:0-100`。只对 Save 到 jpg 有效 |
| 清除 Exif | `ClearMetaData:` |

### 参考图片

滤镜效果、边界检测滤镜效果（库文档配图，不是 Quicker 界面）：

![](./img/imgprocess-004-ef8b3abb54.png)

![](./img/imgprocess-005-dc437ffe22.png)

## 生成图标文件

<ModuleParamPreview
  moduleKey="sys:imgProcess"
  focusKeys={['img', 'type', 'iconFilePath', 'iconSize', 'iconScaling', 'stopIfFail', 'isSuccess']}
  values={{
    img: 'C:\\Pictures\\puffin.jpg',
    type: 'GenerateIco',
    iconFilePath: 'D:\\test2.ico',
    iconSize: '256,48,32,16',
    iconScaling: 'HighQualityBicubic',
    stopIfFail: 'true',
  }}
/>

**图片**：源图变量或文件路径。

**图标文件保存路径**：`.ico` 的完整路径。

**图标大小**：图标里包含的位图边长。可以是一个，如 `32`；也可以多个，逗号分隔，如 `256,48,32,16`。Quicker 会按这些尺寸缩放。

**缩放采样**：自动（整数倍放大用邻近，大比例缩小用 Lanczos，其余用高质量双三次）、像素化（邻近）、清晰（高质量双线性）、平滑（高质量双三次）、锐利（Lanczos）、区域平均（Box）。旧稿未写。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '不走组合命令时，直接把结果存盘。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '常见的处理来源。',
    },
    {
      href: '/v2/xaction/modules/imageinfo',
      label: '读取图片信息',
      description: '先看宽高和 Exif，再决定怎么转。',
    },
  ]}
/>

## 更新历史

- 1.0.6：增加此模块。
- 1.5.7：增加反色、灰度、旋转。
- 1.22.24：增加组合图片处理。
- 1.33.22：增加生成图标。
- 20230712：说明 ResizeEx「是否放大」仅对非 Stretch 生效。
- 20230817：补充 Watermark 位置格式。
- 20231008：水印支持锚点。
- 20231029：1.40.5 水印支持旋转角度。
- 20240611：修正 Constrain（小图会放大，感谢 @Moy）。
- 20240826：水印文字支持 `\r\n` 换行。
