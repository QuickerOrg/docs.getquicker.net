---
title: "语言与脚本结构"
description: "Main 入口、辅助方法、支持的 C# 语法和 .NET 类型环境。"
quickerDocKey: v2/script-action/language
comments: false
sidebar_position: 3
---

脚本动作使用 C# 语法，由 Quicker 内置解释器执行。源码由一个 Main 入口与可选辅助方法组成。2.3.23 起可使用 .NET 类型；Quicker 与桌面操作也可通过 qk 完成。

```csharp
string Main(
    [ActionParameter("文本", MultiLine = true)] string text,
    [ActionParameter("模式", Options = "大写|upper\n小写|lower")] string mode = "upper")
{
    return mode == "upper" ? text.ToUpperInvariant() : text.ToLowerInvariant();
}
```

## 支持与限制

常用变量、条件、循环、字符串插值、LINQ、模式匹配、try/catch/finally、局部函数、元组、匿名类型、List、Dictionary、Regex 和 JsonNode 可用。

不支持 async/await、yield、lock、goto、声明 class/record/struct/enum/命名空间及泛型局部函数。2.3.23 起，方法和局部函数声明中的 public、private、protected、internal、static 会在分析和执行时自动忽略，无需为此删改原文；这不会开放类声明、异步方法或泛型入口。想组织数据时可使用元组、匿名类型或字典。

当前也不支持 catch 中不带异常表达式的 `throw;`。从旧 CLR 脚本复制错误处理时，应先检查受控语法，再选择返回失败结果或使用产品支持的异常处理写法。

## .NET 类型环境

2.3.23 起，脚本与组合动作共享 .NET 类型环境，可以直接使用 File、Directory、HttpClient、Process、Thread、Console 等类型。常用类型可用短名；发生同名歧义时使用完整类型名。可用类型来自当前产品及其已提供的程序集，并不表示可以原样运行任意 C# 项目或自动引用所有第三方库。

qk API 继续提供适合动作的参数、目标窗口、取消和结果处理。下面是常用替代方式，可按任务选择 .NET 或 qk；两者的默认值、权限、超时及异常行为需要分别核对。

| 常见写法 | 脚本动作中的写法 |
|---|---|
| File.ReadAllText | qk.Files.ReadText |
| File.WriteAllText | qk.Files.WriteText，注意 overwrite 默认 false |
| HttpClient | qk.Http.GetText / PostJson / Send |
| Process.Start | qk.Process.Start / Open / Run |
| Thread.Sleep | qk.Wait |
| MessageBox | qk.Ui.Alert / Confirm |
| Console.WriteLine | qk.Log |

## 源码中的 qk 调用

建议直接写 qk.域.方法(...)，例如 qk.Clipboard.GetText()，辅助方法也可以直接访问 qk。2.3.23 起不再按旧的能力识别规则限制分享，但入口、类型和实际调用仍需通过编辑器检查。执行权限与停止边界见[安全与授权](./security.md)。

窗口、图片和界面元素等句柄只属于本次运行；不要返回这些句柄或写进动作状态。需要保存数据时，使用对应的信息快照或纯数据类型。坐标与尺寸的具体语义见各 API 域与公共类型。
