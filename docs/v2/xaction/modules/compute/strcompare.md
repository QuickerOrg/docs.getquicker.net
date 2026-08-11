---
title: "比较文本"
description: "文本比较"
slug: "/v2/xaction/modules/strcompare"
sidebar_label: "比较文本"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:strCompare"
comments: true
moduleKey: "sys:strCompare"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113504
legacyContentUpdatedAt: "2019-07-14T10:39:54.000Z"
---

# 比较文本

文本比较

## 当前模块定义

<XActionModuleMeta moduleKey="sys:strCompare" />

比较两段文本是否符合指定的关系。

<ModuleParamPreview moduleKey="sys:strCompare" />

## 参数

【文本1】【文本2】参与比较的两个文本。

【类型】比较方式，可选值：

-   \&gt; ：文本1是否在字母顺序的角度大于文本2。比如“def”&gt; “abc”。
-   \= ：文本1是否等于文本2；
-   &lt; ：文本1是否小于文本2；
-   包含：文本1是否包含文本2；比如“This is China”包含“China”
-   以指定的内容开始：文本1是否以文本2的内容开始，比如“This is China”以“This”开始。
-   以指定的内容结束：文本1是否以文本2的内容结束。
-   正则匹配：文本1的内容是否能够匹配文本2中指定的正则表达式。

【区分大小写】比较时是否区分大小写字母。

### 输出

【值】比较的结果是否为“真”。
