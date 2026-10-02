---
title: "查找并激活窗口"
description: "检查查找结果再激活窗口，避免直接操作空引用。"
quickerDocKey: v2/script-action/tutorials/window
comments: false
sidebar_position: 7
---

检查查找结果再激活窗口，避免直接操作空引用。

## 准备

打开一个普通权限的测试窗口，准备其标题中的一段唯一文本。

## 完整源码

```csharp
string Main([ActionParameter("窗口标题包含")] string title)
{
    var window = qk.Window.Find(title: title);
    if (window == null)
    {
        qk.Ui.Notify("没有找到匹配窗口", kind: "warn");
        return "未找到";
    }
    qk.Window.Activate(window);
    return window.Title;
}
```

[下载源码](/files/script-action/window.cs)

## 运行与预期结果

输入标题片段，找到后窗口激活，结果为窗口标题。匹配多个窗口时应收紧条件；本例没有发送按键。

## 取消与失败

激活前停止不会执行后续操作；激活完成后停止不会自动切回原窗口。

窗口不存在会通知并返回“未找到”；目标关闭、权限不匹配或无法激活可能导致失败。断点暂停与继续的前台切换见[调试](../debugging.md)。

## 相关 API

[Window](../api/window.md)、[Win](../api/types/win.md)
