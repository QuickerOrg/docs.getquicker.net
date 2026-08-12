---
title: "AI 文本分类"
description: "使用全局 AI 设置从给定分类中选择一个稳定 Key"
slug: "/v2/xaction/modules/ai-classify"
sidebar_label: "AI 文本分类"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:aiClassify"
comments: true
moduleKey: "sys:aiClassify"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-12 20:29:09"
---

# AI 文本分类

让 AI 从预先定义的分类中选择一个稳定 Key，适合邮件分流、反馈归类、意图识别和后续条件分支。

使用前，请先在 Quicker 的 **设置 → AI** 中配置文本任务场景，并选择明确支持结构化输出的模型。配置方式见[统一 AI 服务与模型设置](/v2/what's-new/ai-services-and-models)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:aiClassify" />

## 基本用法

1. 在“分类项”字典中填写稳定 Key 及其说明。
2. 将待判断内容传给“文本”，按需补充“判断标准”。
3. 使用“分类 Key”连接条件判断或分支步骤；需要解释时读取“分类理由”。

例如，可定义以下分类项：

- `Urgent`：需要当天处理的紧急事项；
- `Normal`：普通待办；
- `Spam`：广告、群发或无关内容。

后续流程应判断 `Urgent`、`Normal`、`Spam` 这些 Key，而不要依赖模型生成的自然语言描述。

## 默认 Key

模型若返回未定义的 Key，模块会使用“无法判断时的默认 Key”；该值必须是分类项中已经存在的 Key。留空时，遇到未知 Key 会让步骤失败。Key 匹配不区分大小写，但输出会恢复为分类项中填写的形式。

## 注意事项

- 至少需要一个分类项，Key 不能为空且不能重复。建议使用简短、长期稳定的英文 Key，把易变的业务说明写在 Value 中。
- 所选模型必须明确支持结构化输出。只在服务商侧支持、但未在 Quicker 模型能力中正确标记时，模块可能找不到可用模型。
- 分类结果仍可能受输入质量和模型能力影响。对付款、删除、外发等高风险操作，应增加人工确认或其它确定性校验。
- 输入文本和分类说明会发送给实际选中的 AI 服务商。
