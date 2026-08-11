---
title: "公式识别"
description: "数学公式识别"
slug: "/v2/xaction/modules/mathocr"
sidebar_label: "公式识别"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:mathocr"
comments: true
moduleKey: "sys:mathocr"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 49850606
legacyContentUpdatedAt: "2026-03-20T00:32:28.000Z"
---

# 公式识别

调用 Mathpix 识别图片或手写板里的公式，得到 LaTeX、MathML 等格式。普通文字请用 [基础OCR](/v2/xaction/modules/basic-ocr)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:mathocr" />

## 概述

本功能消耗 Q豆，每次 **0.015** 豆（价格可能随汇率波动）。[什么是 Q豆？](https://getquicker.net/KC/Kb/Article/933)

Mathpix 自 2022-09-01 起提高了前 1000 次 API [请求费用](https://mathpix.com/pricing)。考虑到使用者多为学生，CL 在能力范围内补贴。2026-03-21 起每次从 0.028 Q豆下调为 0.015 Q豆。

<ModuleParamPreview moduleKey="sys:mathocr" />

## 参数说明

**厂商接口**：

- **图片识别(Mathpix)**：识别已有图片。
- **手写并识别(Mathpix)**：先出手写板，确认后再识别。

**公式图片**：仅图片识别。可以是图片变量、图片文件路径或图片网址。路径和网址要用表达式传入。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

手写识别的部分格式可能为空，以实际输出为准。

- **是否成功**
- **Mathpix MD**：Mathpix Markdown。
- **Latex**
- **MathML**
- **AsciiMath**
- **Latex附加格式1**：两侧加 `$$`。
- **Latex附加格式2**：两侧加 `\begin{equation}` 与 `\end{equation}`。
- **原始响应**：Mathpix 返回的原始内容。

## 示例动作

<StepProgramView example="1bdedee6-4774-42d3-7697-08d950c2afd2" />

<ShareLinkCard
  code="1bdedee6-4774-42d3-7697-08d950c2afd2"
  title="公式识别"
  description="截图后识别公式"
  author="CL"
/>

## 限制与排障

每次调用都计费。图片变量为空、路径写错或网络不通时会失败。手写板取消也算失败。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/basic-ocr',
      label: '基础OCR',
      description: '识别普通文字或表格，不是公式。',
    },
  ]}
/>
