---
title: "屏幕取色/颜色转换与计算"
description: "转换颜色值及相关计算处理"
slug: "/v2/xaction/modules/color"
sidebar_label: "屏幕取色/颜色转换与计算"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:color"
comments: true
moduleKey: "sys:color"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "989c524933f727d948b35b367fcdfaa9b1e9cc47d15abb7faa0067ce5e715395"
legacyDocId: 3996714
legacyContentUpdatedAt: "2020-04-02T03:19:32.000Z"
---

# 屏幕取色/颜色转换与计算

转换颜色值及相关计算处理

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:color`
- 分类：计算与比较（`Compute`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 类型 | `Enum` | fromString | 是 | `Input` |  | 比较方式 |
| `colorStr` | 颜色 | `Text` |  | 是 | `UseVarOrInput` | 仅：fromString, editOrSelectColor | 颜色的文本值, 格式支持：#223344, #FF223344(ARGB顺序), Red, rgb(200,200,200), rgba(200,200,200,0.5), CMYK(0,0,0,0)或CMYK:0,0,0,0 |
| `location` | 坐标 | `Text` | 0,0 | 是 | `UseVarOrInput` | 仅：fromScreenPosition | 格式为:"横坐标X,纵坐标Y" |
| `format` | 输出文本格式 | `Enum` | HEX_RGB | 是 | `UseVarOrInput` |  | 输出的颜色文本值格式，用以转换颜色值的格式 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `A` | 透明度值 | `Number` |  | Alpha值（0-255）0表示透明 |
| `R` | 红色值 | `Number` |  | R值（0-255） |
| `G` | 绿色值 | `Number` |  | G值（0-255） |
| `B` | 蓝色值 | `Number` |  | B值（0-255） |
| `Hue` | 色相 | `Number` |  | Hue值（0-360） |
| `HslS` | HSL.S | `Number` |  | HSL颜色空间的饱和度S |
| `HslL` | HSL.L | `Number` |  | HSL颜色空间的亮度值L |
| `HsvS` | HSV.S | `Number` |  | HSV颜色空间的饱和度S |
| `HsvV` | HSV.V | `Number` |  | HSV颜色空间的明度V |
| `textValue` | 文本值 | `Text` |  | 输出颜色的文本值，格式请在输入参数中选择 |

## 选项值

### `type` 类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `fromString` | 通过文本指定颜色 |  |
| `selectFromScreen` | 从屏幕选取颜色 |  |
| `fromScreenPosition` | 取屏幕指定位置颜色 |  |
| `editOrSelectColor` | 编辑/选择颜色 |  |

### `format` 输出文本格式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `HEX_RGB` | 十六进制RGB: #6496C8 |  |
| `HEX_ARGB` | 十六进制ARGB: #FF6496C8 |  |
| `rgba` | HTML: rgba(100,150,200,1) |  |
| `rgb` | HTML: rgb(100,150,200) |  |
| `DOT_RGB` | RGB: 100,150,200 |  |
| `DOT_RGBA` | RGBA: 100,150,200,255 |  |
| `DOT_ARGB` | ARGB: 255,100,150,200 |  |
| `float_rgba` | 浮点: 0.39f, 0.59f, 0.78f, 1.00f |  |
| `Swift` | Swift: UIColor(red:0.39, green:0.59, blue:0.78, alpha:1.00) |  |
| `CMYK` | CMYK: 50,25,0,22 |  |
| `HSL` | hsl(210,47.6%,58.8%) |  |
| `hsla` | hsla(210,47.6%,58.8%,1) |  |
| `HSV_HSB` | HSV/HSB: 210°,50,78.4 |  |
{/* xaction-metadata:end */}

注：子1.3.10版本提供。



获取或编辑颜色，并返回颜色信息中各通道颜色的值。



![image.png](./img/color-001-0c4aa52350.png "image.png")

支持的操作类型：

-   通过文本指定颜色：根据指定的颜色文本（如“#223444”等）获取颜色信息；
-   取屏幕指定位置颜色：根据指定的坐标位置，取屏幕颜色；
-   从屏幕选取颜色：手动选择屏幕位置获取颜色；
-   编辑/选择颜色：从颜色选择器中选择颜色；







## 参数

【颜色】通过文本方式指定的颜色的**当前值**。支持的格式有：

-   HTML颜色格式：#RGB 、 #RRGGBB
-   ARGB格式：#AARRGGBB
-   rgb(10,20,30)
-   rgba(10,20,30,0.5)



【坐标】在“取屏幕指定位置颜色”操作模式下，设定要获取颜色的屏幕坐标。



【输出文本格式】用于控制“文本值”输出参数中输出的文本格式。



### 编辑/选择颜色

弹出颜色选择窗口，并预先选择当前的颜色值。可以在此窗口中调整颜色或使用吸管工具从其他位置选择颜色。

![编辑或选择颜色操作.gif](./img/color-002-efae8e7c2b.gif "编辑或选择颜色操作.gif")



### 从屏幕选择颜色

显示一个小方框，按下后开始从屏幕上选择颜色。

![从屏幕选择颜色.gif](./img/color-003-6bd4fc7342.gif "从屏幕选择颜色.gif")







## 输出

颜色的各种参数数据。

【文本值】用于将颜色使用指定的格式输出，通常用于转换颜色的格式。具体格式由输入参数“输出文本格式”指定。





## 示例动作

-   [https://getquicker.net/sharedaction?code=a6aaa916-9fea-4355-fbd4-08d7cd418588](https://getquicker.net/sharedaction?code=a6aaa916-9fea-4355-fbd4-08d7cd418588)
