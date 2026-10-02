---
title: "参数表单与文本转换"
description: "用 Main 参数自动生成表单，通过下拉项选择转换方式。"
quickerDocKey: v2/script-action/tutorials/parameters
comments: false
sidebar_position: 3
---

用 Main 参数自动生成表单，通过下拉项选择转换方式。

## 准备

从面板交互触发；需要输入文本，模式有默认值。

## 完整源码

```csharp
string Main(
    [ActionParameter("文本", MultiLine = true)] string text,
    [ActionParameter("模式", Options = "大写|upper\n小写|lower")] string mode = "upper")
{
    return mode == "upper" ? text.ToUpperInvariant() : text.ToLowerInvariant();
}
```

[下载源码](/files/script-action/parameters.cs)

## 运行与预期结果

输入“Hello”，选择小写，结果应为“hello”。调用方传入参数时的规则见[参数与返回值](../parameters.md)。

## 取消与失败

关闭参数表单会取消本次交互运行，不会修改剪贴板或文件。

非交互调用缺少必填参数会失败，不会自动弹表单。

## 相关 API

[参数与返回值](../parameters.md)、[语言与脚本结构](../language.md)
