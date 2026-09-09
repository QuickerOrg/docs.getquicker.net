---
title: "读取图片信息"
description: "获取图片的尺寸或exif信息"
slug: "/v2/xaction/modules/imageinfo"
sidebar_label: "读取图片信息"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:imageinfo"
comments: true
moduleKey: "sys:imageinfo"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 5711058
legacyContentUpdatedAt: "2020-03-31T00:36:08.000Z"
---

# 读取图片信息

读取图片的宽高、旋转角度、拍摄时间和 Exif。来源可以是图片变量，也可以是文件路径。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:imageinfo" />

## 概述

<ModuleParamPreview moduleKey="sys:imageinfo" />

## 参数说明

**图片来源**：图片变量，或图片文件。

**图片变量**：来源为图片变量时，从哪个变量读图。

**文件路径**：来源为图片文件时，图片的完整路径。

**计算旋转后的宽高**：Exif 里有旋转信息时，输出旋转后的宽高。默认关闭。旧稿未写。

**失败后停止**：读取失败是否中止动作。默认开启。旧稿未写。

### 无 EXIF 日期时

2.2.9 起，当 Exif 拍摄时间和普通日期都缺失时，可选择回退方式（仅文件来源有意义；图片变量仍返回时间最小值）：

- **使用文件创建时间**
- **使用创建、修改时间的较早值**（新建步骤的默认）
- **使用文件修改时间**
- **返回时间最小值**

旧动作若尚未保存该选项，仍按文件创建时间回退，避免直接改变已有行为。文件日期只是估算，复制后的创建时间可能晚于真实拍摄时间。

## 输出

- **是否成功**：是否读到了信息。旧稿未写。
- **宽度** / **高度**：像素数。
- **旋转角度**：Exif 中的旋转角度。旧稿未写。
- **拍摄时间**：优先读取 Exif 拍摄时间（DateTimeOriginal），其次 Exif 普通日期；两者都没有时，按下方「无 EXIF 日期时」处理。图片变量没有文件日期，或日期解析失败时，返回时间最小值（公元 1 年 1 月 1 日 0 时）。
- **拍摄时间为空**：（2.2.9）Exif 拍摄时间缺失或无法解析时为 true。此时「拍摄时间」输出可能仍是普通日期或文件日期回退值；不要把回退值当成真实拍摄时间。
- **Exif数据**：词典。键是转换后的属性名，值是文本。不支持的属性会直接用数字当键。
- **原始属性数据**：C# 词典。键是 Exif 属性数字，值是 [`PropertyItem`](https://docs.microsoft.com/en-us/dotnet/api/system.drawing.imaging.propertyitem)。
- **内容图片格式**：仅来源为文件。按文件内容判断的格式（可能不准），扩展名不可靠时用。旧稿未写。

Exif 词典示例（节选）：

```json
{
  "EquipMake": "SONY",
  "EquipModel": "DSC-RX10M4",
  "Orientation": "1",
  "DateTime": "2017:09:25 12:18:21",
  "ExifExposureTime": "1/250",
  "ExifFNumber": "40/10",
  "ExifISOSpeed": "1250",
  "ExifFocalLength": "22000/100",
  "ExifPixXDim": "5472",
  "ExifPixYDim": "3648",
  "ThumbnailData": "NOT_SUPPORTED"
}
```

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/imgprocess',
      label: '图片处理',
      description: '按 Exif 方向自动旋转，或做缩放、灰度等变换。',
    },
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '先把文件读成图片变量，再查信息。',
    },
  ]}
/>

## 更改历史

- 2.2.9：增加「无 EXIF 日期时」回退选项与「拍摄时间为空」输出；旧动作缺省仍用文件创建时间，新建步骤默认取创建与修改时间的较早值。
- 1.4.7：开始提供。
