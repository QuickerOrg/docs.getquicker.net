---
title: "参数与返回值"
description: "Main 参数表单、输入绑定、quicker_in_param 和返回值。"
quickerDocKey: v2/script-action/parameters
comments: false
sidebar_position: 4
---

## `Main` 参数与参数表单

### 参数就是输入

`Main` 的参数就是动作的输入。支持的参数类型：`string`、`string?`、`bool`、`int`、`long`、`double`、`decimal`、`int?`、`bool?`、`string[]`、`int[]`、`object`、`DateTimeOffset`、`TimeSpan`，最多 64 个。

**必填规则**：

- 不带 `?`、也没有默认值的参数是**必填**的（如 `string text`、`int count`）；
- 带 `?`（如 `string? note`、`int? limit`）或有默认值（如 `string mode = "upper"`）的参数是**可选**的；
- 必填参数传入空值或空白文本时报“不能为空”。

### 用 `[ActionParameter]` 美化表单

```csharp
string Main(
    [ActionParameter("文本", Description = "要处理的内容", MultiLine = true)] string text,
    [ActionParameter("模式", Options = "大写|upper\n小写|lower")] string mode = "upper",
    [ActionParameter("最多字符数", Ask = true)] int limit = 100)
{
    var r = mode == "upper" ? text.ToUpperInvariant() : text.ToLowerInvariant();
    return r.Length > limit ? r[..limit] : r;
}
```

| 字段 | 含义 |
|---|---|
| 第一个参数（如 `"文本"`） | 表单中显示的标题 |
| `Description` | 说明文字 |
| `Options` | 下拉选项，每行“标题\|值”，多行用 `\n` 分隔（只用于 `string` 参数，值不能重复） |
| `MultiLine` | 多行输入框 |
| `Required` | 显式指定是否必填（优先于上面的自动推断） |
| `Ask` | 即使有默认值，也在每次交互运行时弹出表单让用户确认或修改 |

所有字段的值都必须是字符串或布尔常量。

### 表单什么时候弹出

- 只在**交互触发**时弹出：从面板、悬浮按钮、悬浮面板、搜索窗口或编辑器运行；
- 并且存在“没有默认值又没有传入”的参数，或存在标了 `Ask = true` 的参数；
- **所有参数都有默认值且都没有 `Ask` 时不会弹出表单**，直接使用默认值。希望用户每次都能改的选项，请加 `Ask = true`，或在 `Main` 里用 `qk.Ui.Form` 询问。编辑器的“检查”会对这种情况给出提示；
- 热键、手势等非交互触发时缺少必填参数会直接报错，不弹表单；
- 用户取消表单时不会执行 `Main`。

### `quicker_in_param`：动作收到的原始输入

`string quicker_in_param = ""` 是一个特殊参数，用来接收动作的**原始输入文本**：组合动作“运行动作”步骤传入的值、`qk.Actions.Call` 的 `input`、右键附加菜单项的值、文本指令等。它：

- 总是可选的，不会触发表单，也不能标 `Ask`；
- 不声明也可以，原始输入同样可以通过 `qk.Context.Input` 读取（没有输入时为 `null`）。

`qk.Context.Text` 是另一回事：它是触发时附带的上下文文本（如从文本工具栏触发时的文本），与 `Input` 互不代替。

### 在运行中询问：`qk.Ui.Form`

需要在运行中途收集多个值时，用表单：

```csharp
string Main()
{
    var r = qk.Ui.Form(new[]
    {
        new Field("name", "姓名", Required: true),
        new Field("age", "年龄", Kind: "number", Value: 18),
        new Field("vip", "会员", Kind: "check"),
    });
    if (r == null) return null;   // 用户取消

    var name = (string)r.Values["name"];
    var age = Convert.ToInt32(r.Values["age"]);   // number 字段为 double
    var vip = (bool)r.Values["vip"];
    return $"{name}，{age} 岁，{(vip ? "会员" : "非会员")}";
}
```

## 返回值

- `return` 的值就是动作的输出；`void Main()` 表示没有输出。返回 `null` 不算失败。
- 可以返回：字符串、数字、布尔、日期时间、数组、`List`、`Dictionary<string, T>`、匿名对象、元组、`JsonNode`，以及 `qk` 提供的数据类型（如 `WinInfo`、`SelectResult`）。结构化的值会被转换成 JSON（字段名为小驼峰，如 `title`、`statusCode`）。
- **不能返回**窗口引用 `Win`、图片 `Img`、界面元素 `El` 等“句柄”（报 `CODEC_UNSUPPORTED`）。需要窗口信息时返回 `qk.Window.Info(w)`；需要图片时返回 `img.ToBase64()` 或保存为文件后返回路径。
- 单个返回值最多 1 MiB、10,000 项、嵌套 32 层。LINQ 查询先 `.ToList()` 再返回。

```csharp
object Main()
{
    var w = qk.Window.GetForeground();
    if (w == null) return null;
    var info = qk.Window.Info(w);
    return new { info.Title, info.Process, info.Bounds.Width, info.Bounds.Height };
}
```
