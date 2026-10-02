---
title: "调用组合动作并传入文本"
description: "通过动作名称或 Id 调用其他动作，取得其返回值。"
quickerDocKey: v2/script-action/tutorials/action-call
comments: false
sidebar_position: 8
---

通过动作名称或 Id 调用其他动作，取得其返回值。

## 准备

准备一个可信、可运行的组合动作，让它接收输入文本并返回结果。需要调用其他动作的能力。

## 完整源码

```csharp
object? Main(
    [ActionParameter("动作名称或 Id")] string action,
    [ActionParameter("传入文本", Ask = true)] string input = "")
{
    return qk.Actions.Call(action, input);
}
```

[下载源码](/files/script-action/action-call.cs)

## 运行与预期结果

输入目标动作名称或 Id，再输入文本；脚本返回目标动作的输出。输入文本会按目标动作的输入规则绑定。

## 取消与失败

目标动作可能弹出自己的界面或修改数据；停止行为由调用链处理，已生效操作不会回滚。

找不到动作、目标运行失败或超过调用链层数时会失败。调用公共子程序改用 qk.Actions.CallSubprogram，并按其变量名提供输入字典。

## 相关 API

[Actions](../api/actions.md)、[运行生命周期](../runtime.md)
