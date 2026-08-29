---
title: "窗口界面控制(FlaUI)"
description: "触发Windows窗口的菜单/按钮等控件(通过FlaUI库实现)。"
slug: "/v2/xaction/modules/flauiautomation"
sidebar_label: "窗口界面控制(FlaUI)"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:flauiautomation"
comments: true
moduleKey: "sys:flauiautomation"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-29 16:36:01"
---

# 窗口界面控制(FlaUI)

用 FlaUI 库触发 Windows 窗口里的菜单、按钮等控件。和 [窗口界面控制](/v2/xaction/modules/uiautomation) 能力相近，实现库不同；参数以本页上方定义为准。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:flauiautomation" />

<ModuleParamPreview moduleKey="sys:flauiautomation" />

## 使用说明

本模块与 [窗口界面控制](/v2/xaction/modules/uiautomation) 共享基础使用说明；本页参数表是当前模块自身的定义。

窗口句柄留空时使用前台窗口。**控件XPath或Name** 可以填写 XPath、Name 或 AutomationId；可写多行候选，前一个找不到时继续尝试下一行。**控件类型** 用于区分名称相同但类型不同的控件。

### 触发控件

选择 **触发窗口控件** 后，可对目标执行自动操作、鼠标单击 / 双击、调用、展开 / 折叠、选中、切换、聚焦、滚动到可见区域、滚动、设置值等操作。优先使用“自动操作”或控件自身支持的模式；自绘控件、游戏、远程桌面等无法暴露 UI Automation 信息时，再改用坐标点击。

### 提取窗口界面信息

选择 **提取窗口界面信息**（`GetControlTree`）可从窗口或指定起始控件向下遍历：

- **最大深度**：根控件深度为 0，默认 12。
- **最大节点数**：默认 512。
- **超时时间**：定位起始控件和遍历共用的软超时，默认 6000 毫秒。
- **控件树JSON**：紧凑的嵌套树，适合脚本或 JSONPath 按层级提取。
- **控件树表格**：同一次采集的平铺节点表格，适合筛选、排序和循环处理。

### 观察可交互元素

选择 **观察可交互元素**（`ObserveInteractiveControls`）使用同样的窗口、起始控件和遍历限制，但只返回精简的可交互元素列表。输出 **可交互元素JSON** 中的 `locator` 可直接传给后续 **触发窗口控件** 的“控件XPath或Name”，同时保留名称、类型、可见范围等观察信息。

推荐流程是：先观察目标窗口，把 `interactiveElementsJson` 保存到文本变量并检查候选；再选定一个 `locator` 传给触发步骤。不要仅按坐标长期绑定，因为窗口布局变化后坐标更容易失效。

### 遍历结果是否完整

两个遍历操作都会输出 **节点数**、**是否完整** 和 **截断原因**。达到最大深度、最大节点数、软超时或 JSON 大小限制时，步骤仍可成功并返回已经采集的数据，但“是否完整”为否；此时应根据“截断原因”缩小起始控件或提高对应限制，而不是把部分结果当作完整窗口结构。

FlaUI 依赖目标程序公开 Windows UI Automation 信息。权限高于 Quicker 的窗口可能无法读取或操作；窗口在遍历期间频繁刷新时，部分节点也可能消失。遇到这种情况可缩小起始范围、增加候选定位，或以与目标相同的权限运行 Quicker。

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
