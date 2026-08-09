---
title: "打开网址"
description: "打开指定的网址"
slug: "/v2/xaction/modules/openurl"
sidebar_label: "打开网址"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:openUrl"
comments: true
moduleKey: "sys:openUrl"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "1df4dddc11cf1dedb5815a80ac8869a08af75b6896866fd6ba023954e01702f4"
legacyDocId: 1465706
legacyContentUpdatedAt: "2025-12-05T02:22:28.000Z"
---

# 打开网址

打开指定的网址

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:openUrl`
- 分类：基础（`Basic`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `url` | 网址 | `Text` | https:// | 是 | `UseVarOrInput` |  | 要打开的网页地址 |
| `browser` | 浏览器 | `Enum` | default | 是 | `UseVarOrInput` |  | 使用什么浏览器打开网址 |
| `exePath` | 浏览器程序路径 | `Text` |  | 是 | `UseVarOrInput` | 仅：custom | 浏览器exe程序路径 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |

## 选项值

### `browser` 浏览器

| Value | 名称 | 说明 |
| --- | --- | --- |
| `default` | (系统默认浏览器) |  |
| `iexplore.exe` | IE浏览器 |  |
| `microsoft-edge:` | Edge |  |
| `msedgeApp` | Edge App模式 |  |
| `msedgeIncognito` | Edge InPrivate窗口 |  |
| `chrome` | Chrome |  |
| `chromeApp` | Chrome App模式 |  |
| `chromeIncognito` | Chrome 无痕窗口 |  |
| `local` | 本地浏览器窗口 |  |
| `custom` | *自定义浏览器程序* |  |
| `current` | *前台浏览器程序* |  |
{/* xaction-metadata:end */}

使用浏览器打开指定的网址。

![](./img/openurl-001-3470de43e3.png)



## 输入参数

网址：需要打开的网页地址。

浏览器：使用哪个浏览器打开网址。可选“系统默认浏览器”、“IE”、“Edge”、“Chrome App”模式等。

![](./img/openurl-002-18b61d90fe.png)

Chrome APP模式可以参考[https://sspai.com/post/47718](https://sspai.com/post/47718)。

“本地窗口”使用Windows内置的IE内核浏览器，在Quicker软件内打开一个小的浏览器窗口，可以用于显示一些简单的信息。



## 常见问题

#### 问：如何使用非默认浏览器打开网页

答：

使用“运行或打开”模块。


![](./img/openurl-003-dd155b96c7.png)
