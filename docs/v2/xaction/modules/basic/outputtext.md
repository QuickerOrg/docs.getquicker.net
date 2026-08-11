---
title: "发送文本到窗口"
description: "把一段文字发到当前活动窗口：粘贴或模拟键入。"
slug: "/v2/xaction/modules/outputtext"
sidebar_label: "发送文本到窗口"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:outputText"
comments: true
moduleKey: "sys:outputText"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1530559
legacyContentUpdatedAt: "2025-01-20T02:53:53.000Z"
---

# 发送文本到窗口

把指定文本发到当前活动窗口。典型用法：取出选中文字、处理完，再写回原处。流程说明见 [文本处理](/v2/xaction/guides/text-process)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:outputText" />

## 概述

<ModuleParamPreview moduleKey="sys:outputText" />

## 参数说明

**内容**：要发送的文字。

**方法**：

- **复制到剪贴板后粘贴(Ctrl+V)**：先写入剪贴板再 Ctrl+V。适合大段文字，更快。
- **模拟输入**：一个个键入，较慢，可能受输入法影响，不适合长文。

**在末尾添加回车**：发完后再回车，用于换行或在聊天窗口发送。

**粘贴前延时** / **粘贴后延时**：仅粘贴方式。Ctrl+V 前后各等多少毫秒，用来提高稳定性。

**字符间延迟**：仅模拟输入。每个字符之间再等一会儿。目标软件跟不上或顺序乱了就加大。

**从剪贴板历史中隐藏**：仅粘贴方式。Win+V 历史里不出现这一条。

**失败后停止**：发送失败是否中止动作。默认开启。

## 输出

- **步骤是否成功**：这一步是否完成。

## 限制与排障

Excel / WPS 表格里，单元格若处于编辑态（虚线框），粘贴会进这个单元格。先模拟 `Esc` 退出编辑，再发送文本。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/get_selected_text',
      label: '获取选中的文本',
      description: '先取出再处理，最后用本模块写回。',
    },
    {
      href: '/v2/xaction/modules/sendkeys',
      label: '模拟按键B',
      description: '表格里先发 Esc 退出编辑。',
    },
    {
      href: '/v2/xaction/guides/text-process',
      label: '文本处理',
      description: '取词 → 处理 → 写回的完整流程。',
    },
  ]}
/>

## 更新历史

- 20230116：增加注意事项。
- 20250120：按实际功能完善文档。
