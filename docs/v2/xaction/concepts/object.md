---
title: "动态对象变量"
description: "动态对象可存任意 C# 对象，在表达式里按原类型调用属性和方法。"
slug: "/v2/xaction/concepts/object"
sidebar_position: 90
quickerDocKey: "xaction/concepts/object"
comments: true
docStatus: reviewed
legacyDocId: 4590697
legacyContentUpdatedAt: "2025-12-05T02:18:41.000Z"
---

# 动态对象变量

动态对象可以存任意类型：简单数字，或复杂的 class。Quicker 用 C# 编写，内部就是 `object`。C# 里所有类型都能赋给 `object`。

处理复杂结果时用它，例如从 JSON 里取出一个节点（`JToken`），放进动态对象，再在 [表达式](/v2/xaction/concepts/expression) 里用该类型的属性和方法。

<VariableDefPreview
  name="token"
  typeLabel="对象"
  remark="JSON 节点"
/>

<StepProgramView example="05d33931-477a-4c18-a917-08d7b30d7779" />

<ShareLinkCard
  code="05d33931-477a-4c18-a917-08d7b30d7779"
  title="示例：Json提取"
  description="需1.4.21版"
  author="CL"
/>

## 限制与排障

- 对象没有通用的「默认值」填写格式。需要的值在步骤里赋进去。
- 表达式里要用原类型的成员。不确定类型时，先 `.GetType()` 或转成文本看一眼。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '调用对象方法和属性',
    },
    {
      href: '/v2/xaction/concepts/var-dict',
      label: '词典类型',
      description: '键值对够用时不必上对象',
    },
    {
      href: '/v2/xaction/concepts/variables',
      label: '变量',
      description: '类型总览和创建对话框',
    },
  ]}
/>
