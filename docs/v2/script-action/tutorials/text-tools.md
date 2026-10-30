---
title: "输入框与表单的文本工具"
description: "为脚本输入框和表单添加内置或自定义文本工具，处理全文或选区。"
quickerDocKey: v2/script-action/tutorials/text-tools
comments: false
sidebar_position: 4
---

**2.3.24 起**，脚本动作可为 `qk.Ui.Prompt` 和表单的可编辑文本字段添加自定义文本工具。已有的输入框内置工具继续使用 `tools` 参数；表单现在也可通过 `Field.Tools` 配置它们。

## 完整源码

下面的例子在输入框中添加“去除首尾空白”和“选区转大写”。从面板交互触发，输入含空格的文字，使用工具后再确认，返回处理后的文本；不会写文件或修改剪贴板。

```csharp
string Main()
{
    var trim = new TextTool("去除首尾空白", input => input.Text.Trim());
    var upper = new TextTool("选区转大写",
        input => input.SelectedText.ToUpperInvariant(), Replace: "selection");
    return qk.Ui.Prompt("输入内容后点击文本工具", value: "  Hello  ",
        tools: "EditInCodeWindow", customTools: new[] { trim, upper }) ?? "已取消";
}
```

[下载源码](/files/script-action/text-tools.cs)

## 全文与选区替换

- `Replace: "all"` 是默认方式，用返回值替换全文。
- `Replace: "selection"` 替换点击工具时的选区；没有选区时在光标处插入。
- 处理器返回 `null` 表示保持原文；返回空字符串表示用空文本替换目标。
- `TextToolInput` 提供全文 `Text`、选中文字 `SelectedText`、选区位置和长度，以及表单的 `FieldKey`。选区位置以 UTF-16 字符计，普通输入框的 `FieldKey` 为 `null`。

每个输入框或字段最多配置 16 个自定义工具。标题须为 1–100 字符的单行文本；可设置纯文本 `Help` 和 `Icon`。前两个工具显示为图标按钮，其余放入“更多”菜单，悬停可见标题。

## 在表单中使用

为传给 `qk.Ui.Form` 的 `Field` 设置 `Tools` 或 `CustomTools`：

```csharp
var field = new Field("content", "内容", "multiline")
{
    Tools = "EditInCodeWindow,SelectSingleFile",
    CustomTools = new[] { new TextTool("去除首尾空白", input => input.Text.Trim()) }
};
```

仅非只读的 `text`、`multiline`、`combo`、`autocomplete` 字段支持文本工具。只读字段或其它类型配置工具会报参数错误；普通输入框和表单都可组合内置工具与自定义工具。

内置工具名用逗号分隔，可选 `EditInCodeWindow`、`SelectSingleFile`、`SelectMultiFile`、`SelectSingleFolder`、`SelectSavePath`、`ColorPicker`、`ColorPickerArgb`、`SelectFontFamily`。

## 取消、停止与处理时间

处理器同步运行在原脚本线程，应只做短时间处理。处理期间当前窗口暂停编辑和提交，取消仍可用；工具打开的子窗口关联当前输入窗口。

关闭父输入窗口后不再回填文本，处理器后续新的 qk 调用会被拒绝。已经开始的操作不能回滚，纯计算也不会因窗口关闭立即结束；主脚本需等处理器返回后才收到取消结果。长计算应使用可停止的写法，必要时停止动作；不限时动作需要手动停止。

正常取消子窗口沿用该 API 的取消返回值；因父窗口关闭而取消正在等待的子 UI 时，对应调用会抛出 `CAPABILITY_DENIED`。工具停止和窗口关闭不提供外部操作回滚。

示例会经过产品静态编译检查，但不代表已经验证所有窗口焦点、取消和真实交互场景。分享给旧版本用户前，需注明 **2.3.24** 的最低版本要求。

## 相关 API

[qk.Ui](../api/ui.md)、[Field](../api/types/field.md)、[TextTool](../api/types/texttool.md)、[TextToolInput](../api/types/texttoolinput.md)
