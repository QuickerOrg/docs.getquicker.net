---
title: "窗口界面控制(FlaUI)"
description: "触发Windows窗口的菜单/按钮等控件(通过FlaUI库实现)。"
slug: "/v2/xaction/modules/flauiautomation"
sidebar_label: "窗口界面控制(FlaUI)"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:flauiautomation"
comments: true
moduleKey: "sys:flauiautomation"
docStatus: "generated"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# 窗口界面控制(FlaUI)

用 FlaUI 库触发 Windows 窗口里的菜单、按钮等控件。和 [窗口界面控制](/v2/xaction/modules/uiautomation) 能力相近，实现库不同；参数以本页上方定义为准。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:flauiautomation" />

<ModuleParamPreview moduleKey="sys:flauiautomation" />

## 使用说明

本模块与 [窗口界面控制](/v2/xaction/modules/uiautomation) 共享基础使用说明；本页参数表是当前模块自身的定义。

2.1.28 起，本模块新增 **提取窗口界面信息** 和 **观察可交互元素** 能力，可批量返回控件树、定位信息和坐标范围，适合先观察目标窗口结构，再决定后续点击、取值或校验方式。当前 `data/xaction` 尚未同步这些新版操作的参数 Key，编辑动作时请以 Quicker 里的实际下拉选项和输出为准。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/uiautomation',
      label: '窗口界面控制',
      description: '同一类能力的另一套实现，说明更完整。',
    },
    {
      href: '/v2/xaction/modules/textselecttools',
      label: '辅助选择工具',
      description: '可用「选择窗口控件」拾取 XPath。',
    },
  ]}
/>
