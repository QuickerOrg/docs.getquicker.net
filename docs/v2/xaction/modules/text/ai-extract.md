---
title: "AI 结构化提取"
description: "使用全局 AI 设置按 JSON Schema 从文本中提取结构化数据"
slug: "/v2/xaction/modules/ai-extract"
sidebar_label: "AI 结构化提取"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:aiExtract"
comments: true
moduleKey: "sys:aiExtract"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-12 20:29:09"
---

# AI 结构化提取

按照 JSON Schema 从邮件、订单、日志等文本中提取结构化对象，供后续步骤按字段继续处理。

使用前，请先在 Quicker 的 **设置 → AI** 中配置文本任务场景，并选择明确支持结构化输出的模型。配置方式见[统一 AI 服务与模型设置](/v2/what's-new/ai-services-and-models)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:aiExtract" />

## 基本用法

1. 将原始内容传给“文本”。
2. 在“JSON Schema”中定义需要的字段、类型和必填项。
3. 在“提取要求”中补充字段含义、单位或格式规则。
4. 使用“结果对象”继续读取字段，或使用“结果 JSON”保存、传输完整结果。

下面的 Schema 可从订单文本中提取订单号、金额和商品列表：

```json
{
  "type": "object",
  "properties": {
    "orderId": { "type": "string" },
    "amount": { "type": "number" },
    "items": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["orderId", "amount", "items"],
  "additionalProperties": false
}
```

## Schema 与结果限制

- JSON Schema 必须是合法 JSON，根节点必须为对象。建议明确填写 `required` 和 `additionalProperties`，减少字段缺失或意外扩展。
- 所选模型必须明确支持结构化输出。Schema 过于复杂或包含服务商不支持的关键字时，请根据该服务商的结构化输出限制简化定义。
- “结果对象”只会在模型返回符合要求的 JSON 对象后产生；无效 Schema、非对象结果或服务错误都会使步骤失败。
- AI 提取并不等同于确定性解析。金额、账号、日期等关键字段在用于付款、写库或删除操作前应再次校验。
- 原始文本、Schema 和提取要求会发送给实际选中的 AI 服务商。
