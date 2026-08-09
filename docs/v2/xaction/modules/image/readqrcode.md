---
title: "识别二维码"
description: "识别图片中的二维码"
slug: "/v2/xaction/modules/readqrcode"
sidebar_label: "识别二维码"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:readQrCode"
comments: true
moduleKey: "sys:readQrCode"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "f5191ea256e9f5b42c82f413af74d1b96bdce759c3ba98599281bc8d6bf3d86c"
legacyDocId: 2115777
legacyContentUpdatedAt: "2025-10-20T12:43:43.000Z"
---

# 识别二维码

识别图片中的二维码

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:readQrCode`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `img` | 输入图片 | `Image` |  | 是 | `UseVar` |  | 要识别二维码的图片 |
| `tryNetwork` | 本地识别失败后尝试在线识别服务 | `Boolean` | false | 否 | `Input` |  | 在线服务拥有更强识别能力（频率限制2秒/次，仅专业版提供）。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `code` | 值 | `Text` |  | 识别出的二维码内容 |
| `codeList` | 全部二维码值 | `List` |  | 当一个图片含有多个二维码，且需要返回所有结果时使用。 |
| `barcodFormat` | 条码类型 | `Text` |  | 识别出的条码类型，如"EAN-13" |
{/* xaction-metadata:end */}

识别图片中的二维码。



![](./img/readqrcode-001-54a151a6ee.png)





## 参数

### 输入

【输入图片】包含二维码的图片。

【本地识别失败后尝试在线识别服务】本地引擎识别失败后，使用Quicker提供的在线服务进行识别。此功能仅面向专业版用户免费使用。



### 输出

【值】识别结果。

【全部二维码值】当图片中有多个二维码时，返回所有识别出的二维码的值的列表。

【条码类型】返回条码的类型，如“EAN-13”等。（1.44.27+版本增加）

## 更新历史

-   20251020 增加条码类型返回说明。
