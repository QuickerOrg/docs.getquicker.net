---
title: "跨运行计数与右键菜单"
description: "保存动作状态，并用菜单查看和重置计数。"
quickerDocKey: v2/script-action/tutorials/menu
comments: false
sidebar_position: 4
---

保存动作状态，并用菜单查看和重置计数。

## 准备

先保存动作，右键菜单来自已保存的源码。

## 完整源码

```csharp
int Main()
{
    var count = qk.State.Get("count", 0) + 1;
    qk.State.Set("count", count);
    qk.Ui.Notify("已运行 " + count + " 次");
    return count;
}

[ActionMenu("工具/查看计数")]
void ShowCount()
{
    qk.Ui.Alert("已运行 " + qk.State.Get("count", 0) + " 次");
}

[ActionMenu("工具/重置计数")]
void ResetCount()
{
    qk.State.Remove("count");
    qk.Ui.Notify("已重置");
}
```

[下载源码](/files/script-action/menu.cs)

## 运行与预期结果

连续运行 Main 两次，返回 1、2；右键“工具/查看计数”显示 2，“重置计数”后下次 Main 返回 1。菜单方法不会再调用 Main。

## 取消与失败

查看对话框关闭后结束；停止不会撤回已经写入的计数。

修改菜单后保存并重新打开右键菜单。状态访问失败时查看结果页。

## 相关 API

[State](../api/state.md)、[菜单](../menus.md)
