---
title: "右键菜单与附加菜单"
description: "用 ActionMenu 定义菜单方法，以及动态菜单的使用场景。"
quickerDocKey: v2/script-action/menus
comments: false
sidebar_position: 5
---

## 右键菜单：`[ActionMenu]`

给动作按钮加固定的右键菜单项，只需在 `Main` 旁边写一个**无参数、返回 `void`** 的方法，并标上 `[ActionMenu]`：

```csharp
void Main()
{
    var n = qk.State.Get("count", 0) + 1;
    qk.State.Set("count", n);
    qk.Ui.Notify($"第 {n} 次运行");
}

[ActionMenu("查看次数", Description = "显示已运行的次数", Icon = "fa:Light_Cog")]
void ShowCount()
{
    qk.Ui.Alert("已运行 " + qk.State.Get("count", 0) + " 次");
}

[ActionMenu("工具/重置计数", Icon = "fa:Light_Trash")]
void Reset()
{
    qk.State.Remove("count");
    qk.Ui.Notify("已重置");
}
```

- 点击菜单项时**只运行该方法，不运行 `Main`**，也不弹参数表单；此时 `qk.Context.Trigger` 为 `"contextMenu"`。
- 标题中的 `/` 生成子菜单（如 `"工具/重置计数"`）；完整路径不能重复，某一路径不能既是菜单项又是父菜单。
- `Description`（悬停提示）和 `Icon`（`fa:` 字体图标）可选；标题、说明、图标都必须是字符串常量。
- 不能标在 `Main` 上；每个方法最多一个 `[ActionMenu]`；方法不能带修饰符、泛型或重载。
- 菜单按**已保存的源码**生成。修改源码并保存后，请重新打开右键菜单；点击旧菜单会提示“源码已更新”。
- 编辑器里可在运行入口下拉中选择某个菜单方法单独试运行。
- 菜单项需要随数据动态变化（如“最近使用”列表）时，才改用 `qk.Actions.SetContextMenu`（点击后重新运行 `Main`，菜单项的值从 `qk.Context.Input` 读取）。

右键菜单中的顺序：`[ActionMenu]` 项在最前，其后是动作自身的自定义菜单，最后是 `SetContextMenu` 设置的附加项。
