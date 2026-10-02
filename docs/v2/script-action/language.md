---
title: "语言与脚本结构"
description: "Main 入口、辅助方法、支持的 C# 语法和受控类型。"
quickerDocKey: v2/script-action/language
comments: false
sidebar_position: 3
---

脚本动作使用 C# 语法，由 Quicker 内置解释器执行。源码由一个 Main 入口与可选辅助方法组成，系统操作通过 qk 完成。

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

不支持 async/await、yield、lock、goto、声明 class/record/struct/enum/命名空间及泛型局部函数。不要在入口前添加 public、static 等修饰符。想组织数据时可使用元组、匿名类型或字典。

当前也不支持 catch 中不带异常表达式的 `throw;`。从旧 CLR 脚本复制错误处理时，应先检查受控语法，再选择返回失败结果或使用产品支持的异常处理写法。

脚本不自动拥有所有 .NET 类型。[API 参考](./api/index.md)列出了可用的纯计算类型。Path 的路径拼接等字符串计算可用；File、Directory、HttpClient、Process、Thread、Console、反射和窗口框架不能直接使用。

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

直接写 qk.域.方法(...)，例如 qk.Clipboard.GetText()。不要把 qk 或某个域赋给变量，也不要把 qk 传给辅助方法；这会使能力识别失去精度，并影响[分享](./sharing.md)。辅助方法可以直接访问 qk。

窗口、图片和界面元素等句柄只属于本次运行；不要返回这些句柄或写进动作状态。需要保存数据时，使用对应的信息快照或纯数据类型。坐标与尺寸的具体语义见各 API 域与公共类型。
