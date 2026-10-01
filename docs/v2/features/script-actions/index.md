---
title: 脚本动作
description: 用 C# 语法编写 Quicker 动作，通过 qk 处理文本、文件、网络、窗口与键鼠，并调用其他动作与公共子程序。
sidebar_position: 1
quickerDocKey: v2/features/script-actions
comments: true
---

# 脚本动作

**2.3.0 或更高版本**可用。新建动作时选择 **Quicker脚本动作**，即可打开脚本编辑器。无需安装 Visual Studio 或 .NET SDK，也不必设置环境变量。

脚本动作用 **C# 语法**编写：`Main` 的参数是输入，`return` 的值是输出；读取选中文本、弹对话框、操作窗口、读写文件、访问网络等，通过名为 `qk` 的对象调用（例如 `qk.Selection.GetText()`、`qk.Ui.Notify("完成")`）。

相关说明：[安全与授权](./security)、[API 参考](./api)。编写时也可在编辑器里输入 `qk.` 查看补全与中文说明，或按 `Ctrl+J` 打开 AI 助手。

:::warning[真实执行、无回滚]
在编辑器中运行脚本就是真实执行。窗口、剪贴板、键鼠、文件、网络等操作都会真正发生，不会自动撤销。测试会删除或覆盖文件的脚本时请格外小心。
:::

## 什么是脚本动作

```csharp
string Main(string quicker_in_param = "")
{
    qk.Ui.Notify("你好，脚本动作！");
    return "完成";
}
```

几个要点：

- 脚本由 Quicker 内置解释器在后台执行，**不需要**安装 Visual Studio 或 .NET SDK，也不会生成 exe。
- 支持大部分常用 C# 写法：变量、`if`/`switch`、循环、LINQ、字符串插值、模式匹配、`try/catch/finally`、局部函数、元组、匿名类型、`List`/`Dictionary`、`Regex`、`JsonNode` 等。
- **不支持**：`async`/`await`、`yield`、`lock`、`goto`、声明 `class`/`record`/`struct`/`enum`/命名空间、泛型局部函数等。需要自定义数据结构时，用元组、匿名类型或 `Dictionary<string, object>`。
- **系统能力只能通过 `qk` 使用**：`File`、`Directory`、`HttpClient`、`Process`、`Thread`、`Console`、`MessageBox`、反射等不可用。对应写法见下表。

| 习惯写法 | 在脚本动作中改用 |
|---|---|
| `File.ReadAllText(path)` | `qk.Files.ReadText(path)` |
| `File.WriteAllText(path, text)` | `qk.Files.WriteText(path, text, overwrite: true)` |
| `new HttpClient()` | `qk.Http.GetText(url)` / `qk.Http.PostJson(url, json)` / `qk.Http.Send(...)` |
| `Process.Start(...)` | `qk.Process.Start(...)` / `qk.Process.Open(...)` / `qk.Process.Run(...)` |
| `Thread.Sleep(ms)` | `qk.Wait(ms)` |
| `MessageBox.Show(...)` | `qk.Ui.Alert(...)` / `qk.Ui.Confirm(...)` |
| `Console.WriteLine(...)` | `qk.Log(...)` |

`qk` 的全部成员见 [API 参考](./api)。

### 适合做什么

- **文本处理**：读取选中文本或剪贴板，清洗、转换、统计后粘贴回去或复制出来。
- **有条件分支、循环较多的逻辑**：用几行 C# 代替组合动作里层层嵌套的「如果 / 循环」步骤。
- **数据处理**：JSON 解析、正则提取、表格 / 列表整理、哈希、拼音匹配等纯计算。
- **窗口与键鼠自动化**：查找 / 激活 / 排列窗口，按键、输入、点击。
- **文件与网络**：批量改名、压缩解压、下载文件、调用 Web API。
- **与用户交互**：选择列表、输入框、表单、文本窗口、进度窗口、通知。

### 不适合做什么

- **需要大量现成步骤能力、但脚本还没有对应 `qk` 方法的场景**：优先用组合动作，或把相关步骤做成**公共子程序**，在脚本里用 `qk.Actions.CallSubprogram` 调用。
- **需要自定义窗口 / 面板设计器、长期常驻监控**：组合动作的自定义窗口、文件监视等能力脚本暂不提供。脚本每次运行有运行时限和次数限额（见 [API 参考·每次运行的限额](./api#每次运行的限额)）。
- **想调用任意 .NET 库、执行任意系统命令而不经确认**：脚本运行在受限环境中，这是有意的设计（见 [安全与授权](./security)）。

### 与组合动作的关系

| | 组合动作 | 脚本动作 |
|---|---|---|
| 编写方式 | 图形化拼接步骤 | 编写 C# 源码 |
| 输入 | 动作参数 / 变量 | `Main` 的参数（自动生成参数表单） |
| 输出 | 返回值变量 | `Main` 的 `return` |
| 右键菜单 | 自定义菜单 | `[ActionMenu]` 菜单方法 |
| 状态存储 | 「状态存储」步骤 | `qk.State`（文本状态与组合动作**互通**） |

二者可以互相调用：

- 组合动作用「运行动作」步骤调用脚本动作，传入的文本会进入脚本的 `quicker_in_param` 参数（以及 `qk.Context.Input`）。
- 脚本用 `qk.Actions.Call("动作名或 Id", "输入")` 调用其他动作（包括组合动作），用 `qk.Actions.CallSubprogram("子程序名", inputs)` 调用本机公共子程序。
- 调用链（脚本与组合动作混合）最多 16 层。

## 如何使用

新建动作时选择「Quicker脚本动作」即可。新建、编辑、复制、导出、导入以及 AI 助手中与脚本动作相关的能力都直接可用。

脚本动作可以发布到分享平台（包括内嵌了脚本动作的多操作动作）；含无法识别的 `qk` 用法的脚本会被拒绝，规则见 [安全与授权·分享规则](./security#6-分享规则)。

`qk` API 随 Quicker 版本演进；个别成员调整时，编辑器的「检查」会指出旧写法并给出新写法。文档与实际行为不一致时，以编辑器补全说明和实际行为为准。

## 第一个脚本

新建脚本动作后，编辑器会预填一个模板：

```csharp
void Main(string quicker_in_param = "")
{
    qk.Ui.Notify("你好");
}
```

把它改成「把选中的文本转成大写并复制到剪贴板」：

```csharp
string Main(string quicker_in_param = "")
{
    // 先读取当前窗口里选中的文字；没有选中时使用动作收到的输入文本。
    var text = qk.Selection.GetText() ?? quicker_in_param;
    if (string.IsNullOrWhiteSpace(text))
    {
        qk.Ui.Notify("没有选中文本", "warn");
        return null;
    }

    var result = text.Trim().ToUpperInvariant();
    qk.Clipboard.SetText(result);
    qk.Ui.Notify("已复制：" + result, "success");
    return result;
}
```

编辑器的基本用法：

| 区域 / 按钮 | 作用 |
|---|---|
| 顶部信息栏 | 图标、标题、说明 |
| **运行**（F5） | 运行当前源码。右侧 ▾ 可选「直接运行」或「最小化后延迟运行」 |
| **检查** | 不执行代码，只检查语法、入口、已知错误用法，并给出修复建议 |
| 超时 | 本次动作最长运行时间，默认 30 秒；可设 0.1 秒–24 小时，或勾选「不限制」 |
| 底部测试面板（Ctrl+\`） | 「输入」「结果」「日志」「问题」等页签 |
| 保存 | 保存并关闭编辑器；按 Ctrl+S（或按住 Ctrl 点击「保存」）只保存，编辑器保持打开 |
| 历史版本 / 保存版本 | 查看并载入旧版本；把当前内容存成带备注的版本（见下文「备份与恢复」） |

:::caution[测试读取选中文本或操作其他窗口]
请选择「最小化后延迟运行」。直接运行时前台窗口是编辑器本身，读到的选中文本会是空的。最小化后延迟运行会先最小化编辑器、回到你之前使用的窗口，等约 2 秒再运行，结束后自动还原编辑器。
:::

保存后，把动作放到面板上，点击即可运行。

## Main 参数与参数表单

### 参数就是输入

`Main` 的参数就是动作的输入。支持的参数类型：`string`、`string?`、`bool`、`int`、`long`、`double`、`decimal`、`int?`、`bool?`、`string[]`、`int[]`、`object`、`DateTimeOffset`、`TimeSpan`，最多 64 个。

**必填规则**：

- 不带 `?`、也没有默认值的参数是**必填**的（如 `string text`、`int count`）；
- 带 `?`（如 `string? note`、`int? limit`）或有默认值（如 `string mode = "upper"`）的参数是**可选**的；
- 必填参数传入空值或空白文本时报「不能为空」。

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
| `Options` | 下拉选项，每行「标题\|值」，多行用 `\n` 分隔（只用于 `string` 参数，值不能重复） |
| `MultiLine` | 多行输入框 |
| `Required` | 显式指定是否必填（优先于上面的自动推断） |
| `Ask` | 即使有默认值，也在每次交互运行时弹出表单让用户确认或修改 |

所有字段的值都必须是字符串或布尔常量。

### 表单什么时候弹出

- 只在**交互触发**时弹出：从面板、悬浮按钮、悬浮面板、搜索窗口或编辑器运行；
- 并且存在「没有默认值又没有传入」的参数，或存在标了 `Ask = true` 的参数；
- **所有参数都有默认值且都没有 `Ask` 时不会弹出表单**，直接使用默认值。希望用户每次都能改的选项，请加 `Ask = true`，或在 `Main` 里用 `qk.Ui.Form` 询问。编辑器的「检查」会对这种情况给出提示；
- 热键、手势等非交互触发时缺少必填参数会直接报错，不弹表单；
- 用户取消表单时不会执行 `Main`。

### `quicker_in_param`：动作收到的原始输入

`string quicker_in_param = ""` 是一个特殊参数，用来接收动作的**原始输入文本**：组合动作「运行动作」步骤传入的值、`qk.Actions.Call` 的 `input`、右键附加菜单项的值、文本指令等。它：

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
- **不能返回**窗口引用 `Win`、图片 `Img`、界面元素 `El` 等「句柄」（报 `CODEC_UNSUPPORTED`）。需要窗口信息时返回 `qk.Window.Info(w)`；需要图片时返回 `img.ToBase64()` 或保存为文件后返回路径。
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
- 菜单按**已保存的源码**生成。修改源码并保存后，请重新打开右键菜单；点击旧菜单会提示「源码已更新」。
- 编辑器里可在运行入口下拉中选择某个菜单方法单独试运行。
- 菜单项需要随数据动态变化（如「最近使用」列表）时，才改用 `qk.Actions.SetContextMenu`（点击后重新运行 `Main`，菜单项的值从 `qk.Context.Input` 读取）。

右键菜单中的顺序：`[ActionMenu]` 项在最前，其后是动作自身的自定义菜单，最后是 `SetContextMenu` 设置的附加项。

## 调试

### 编辑器里的调试手段

- **检查**：不执行代码，提示语法错误、不支持的写法（例如用了 `File.ReadAllText`）及修复建议。问题页双击或回车可跳到出错位置。检查通过**不代表**运行一定成功。
- **断点与单步调试**：可在源码中设断点，并单步执行，便于逐步核对逻辑。
- **运行轨迹和变量变化**：调试时可查看运行轨迹以及变量变化，配合日志定位问题。
- **日志**：`qk.Log("消息")` 输出到测试面板「日志」页；可指定级别 `qk.Log("详情", "debug")`，级别为 `debug`、`info`、`warn`、`error`，单条最多 4096 字符。
- **结果**：运行结束后在「结果」页显示返回值或错误信息。
- **输入**：测试面板「输入」页可以填写原始输入文本，或按 `Main` 签名填写各参数。
- **停止**：运行中可点停止（Shift+F5）。
- **最小化后延迟运行**：适合测试读取选中文本、操作其他窗口的脚本（见上文提示）。

编辑器中的运行是**真实执行**，不会回滚（见文首注意）。

### 编辑器 AI 助手

脚本编辑器标题栏有 AI 按钮（`Ctrl+J` 开关），打开右侧助手面板：

- 用自然语言描述需求，AI 会直接修改编辑器里的源码，也可以顺手填写标题与说明；
- 运行失败或检查有问题时，「结果」页、状态栏或「问题」页会出现「让 AI 修复」入口，AI 会结合运行记录和诊断信息分析；
- 可以选中一段代码「引用给 AI」，让它只改这部分；
- 每轮修改后会显示改动摘要，可「撤销本轮」，也可用 Ctrl+Z 撤销；
- **AI 助手只修改代码，不会替你运行脚本。** 运行与保存始终由你自己决定；
- 当一轮修改**新增了高风险能力**（如键盘监听、外部脚本）或出现无法识别的 `qk` 用法时，完成卡片会给出提醒。

AI 助手需要先保存动作（有动作 Id）才能使用。**AI 写的脚本保存后被视为「你自己编写的动作」，运行前不会弹出授权确认**，请在运行前读一遍代码，尤其是涉及文件删除、网络上传、键盘监听的部分。详见 [安全与授权](./security)。

### 备份与恢复

- **历史版本**：新建的动作需先保存一次才能使用。每次保存都会自动留一份本地版本（保留约 1 个月）。点信息栏「历史版本」可查看本地与服务器上的版本，选中后载入到编辑器——只是载入，**不会自动保存**；源码可按 Ctrl+Z 撤回，确认后再保存。载入只替换源码和超时，标题、图标、选项不变。
- **保存版本**：点信息栏「保存版本」，填写备注即可把编辑器当前内容存成一个长期保留的版本（可选同时备份到服务器）。它不会改动已保存的动作；源码有错误时也能保存，备注里会注明「含未通过检查的源码」。也可以在动作右键菜单「导出或备份」中备份。
- **未保存内容的恢复**：编辑时，编辑器会在后台保留一份未保存内容（停止输入约 3 秒后、连续编辑时至少每 15 秒、每次运行前、AI 每轮结束时更新）。如果 Quicker 意外退出，再次打开该动作（新建的动作则是再次新建脚本动作）时，编辑器顶部会提示「发现 HH:mm 未保存的编辑」，可选择「恢复」或「丢弃」。保存成功或关闭时选择「不保存」后，这份内容会被删除；超过 30 天的自动清理。
- 历史版本与「保存版本」需要相应的会员权益；专业版开启「修改动作后，自动将其备份到服务器」后，每次保存还会自动备份到服务器。

## 常见错误与排查

### 读懂错误：错误码与 OperationId

`qk` 调用失败时抛出 `ActionApiException`（不需要 `using`）。它有四个关键信息：

| 属性 | 含义 | 示例 |
|---|---|---|
| `e.Code.Value` | **错误码**，稳定的英文大写字符串，用来判断失败原因 | `FILE_NOT_FOUND`、`CAPABILITY_DENIED` |
| `e.OperationId` | 出错的**调用名**，与源码中的写法对应 | `Files.ReadText`、`Img.Crop` |
| `e.Detail` | 扩展错误码（可能为 `null`），如浏览器扩展、被调动作返回的具体原因 | `URL_PATTERN_MISMATCH` |
| `e.Message` | 中文错误说明，只用于阅读 | 「文件不存在：…」 |

`OperationId` 的取值：

- `域.方法`：如 `Files.ReadText`、`Window.Activate`；根方法为 `Log`、`Wait`；
- `类型.成员`：图片、文本窗口、进度窗口等句柄上的方法，如 `Img.Crop`、`TextWin.Append`、`ProgressWin.Update`；
- `input`：绑定 `Main` 参数时出错（如缺少必填参数，错误码 `INPUT_MISSING`）；
- `return`：转换返回值时出错（如返回了 `Win`）；
- `run`：运行前的准备阶段出错（如用户拒绝了授权，错误码 `CAPABILITY_DENIED`）。

在脚本里按错误码处理：

```csharp
string Main(string path = @"C:\temp\不存在.txt")
{
    try
    {
        return qk.Files.ReadText(path);
    }
    catch (ActionApiException e) when (e.Code == ActionErrorCode.FileNotFound)
    {
        return null;   // 文件不存在就返回空
    }
    catch (ActionApiException e)
    {
        // 其他失败：把错误码、调用名和扩展码写进日志，便于排查
        qk.Log($"{e.Code.Value} @ {e.OperationId}，Detail={e.Detail ?? "无"}：{e.Message}", "error");
        return null;
    }
}
```

- 每个错误码都有同名的静态成员（错误码的帕斯卡写法，如 `ActionErrorCode.FileNotFound`），也可以写 `e.Code.Value == "FILE_NOT_FOUND"`。
- **不要解析 `e.Message`**：消息文字可能随版本调整，错误码用于程序判断，不随消息文字变化。
- 没有捕获的错误会让动作运行失败，「结果」页只显示错误说明文字，不单独显示错误码与 OperationId；需要时按上面的写法记录到日志。
- 全部错误码见 [API 参考·错误码表](./api#错误码表)。

### 用户取消与停止

- **用户取消对话框不是错误**：`qk.Ui.Select`、`Prompt`、`Form`、`PickFile` 等取消时返回 `null`，`Confirm` 返回 `false`。
- **停止不是错误**：用户点停止、超过动作超时、被调用的动作被取消时，脚本会被停止，`catch` 捕获不到（包括 `catch (Exception)`），只会执行 `finally`。停止后的 `finally` 里只能做有限的清理（如写日志、恢复剪贴板、松开按键、清除角标），其他 `qk` 调用会报 `CAPABILITY_DENIED`。

### 常见问题速查

| 现象 / 错误 | 可能原因 | 处理 |
|---|---|---|
| 检查提示「不能声明类 / 命名空间」 | 写了 `class`、`record`、`namespace` | 改用元组、匿名类型或字典；只写方法 |
| 检查提示 `File`/`HttpClient`/`Thread.Sleep` 等不可用 | 使用了有副作用的 .NET 类型 | 按上文对照表改用 `qk` |
| 检查提示 `async`/`await` 不支持 | 脚本是同步执行的 | 去掉 `async`/`await`，`qk` 调用本身就是同步的 |
| 编辑器里运行时选中文本为空 | 直接运行时前台是编辑器 | 改用「最小化后延迟运行」 |
| 「脚本执行超时（30000 毫秒…）」 | 超过动作超时；等待对话框、按键的时间也计入 | 在编辑器调大超时，交互式脚本建议 ≥ 300 秒；计时 / 监视类可设为不限制 |
| `CAPABILITY_DENIED` | 未获授权；在停止后的 `finally` 中调用了不允许的方法；`qk` 写法无法识别 | 见 [安全与授权](./security)；**直接写 `qk.域.方法(...)`**，不要把 `qk` 或 `qk.Files` 赋给变量、当参数传递或写 `qk?.` |
| 「请先保存动作；只有动作编辑器中的临时调试运行可以逐次确认权限。」 | 需要授权确认的动作（如导入的动作）还没有保存，且不是从编辑器运行 | 先保存动作再运行 |
| `INPUT_MISSING`（OperationId 为 `input`） | 非交互触发且缺少必填参数 | 给参数加默认值，或从面板等交互方式触发 |
| `CODEC_UNSUPPORTED`（OperationId 为 `return`） | 返回或写入状态的值里含 `Win`、`Img` 等句柄 | 返回 `qk.Window.Info(w)`、`img.ToBase64()` 等数据 |
| `CODEC_VALUE_INVALID` | `qk.State.Get<T>` 读回的数据与类型不符 | 检查写入与读取的类型是否一致；文本状态用 `GetText` |
| `INPUT_LIMIT_EXCEEDED` | 键盘输入超出本次运行的限额（如 `Type` 累计超过 2000 字符） | 之后本次运行的键鼠输入全部失败；长文本改用 `qk.Keyboard.Paste` |
| `WINDOW_LIMIT_EXCEEDED` | 窗口查询 / 操作次数超限 | 用 `FindAllInfo` 一次取回多个窗口信息，避免循环里逐个 `Info` |
| `ELEVATED_TARGET_DENIED` | 目标是管理员权限运行的程序 | 普通权限下无法操作管理员窗口 |
| 右键菜单点击提示「源码已更新」 | 保存了新源码，菜单还是旧的 | 重新打开右键菜单 |
| 检查提示「`qk.X.Y` 在当前 Quicker 中不存在」 | 成员名写错，或当前 Quicker 版本没有它 | 按补全列表改正，或更新 Quicker |

排查的一般顺序：先点「检查」→ 看「问题」页；再运行 → 看「结果」页和「日志」页；仍不明白时点「让 AI 修复」，或用 `try/catch` 把 `e.Code.Value`、`e.OperationId`、`e.Detail` 记到日志里。反馈时可附上脚本源码（去掉敏感信息）、结果 / 日志页内容，以及错误码与 OperationId，到社区或反馈入口说明。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/features/script-actions/security',
      label: '脚本动作安全与授权',
      description: '沙箱、能力确认与分享规则',
    },
    {
      href: '/v2/features/script-actions/api',
      label: '脚本动作 API 参考',
      description: 'qk 成员、限额与错误码',
    },
    {
      href: '/v2/migration/upgrade-and-rollback#230-脚本动作',
      label: '升级与回退',
      description: '2.3.0 脚本动作的版本与回退注意',
    },
    {
      href: '/v2/xaction/concepts/xaction-intro',
      label: '组合动作',
      description: '图形化步骤动作入门',
    },
    {
      href: '/v2/features/ai-and-agent',
      label: 'AI 与 Agent',
      description: '设计器与脚本编辑器中的 AI 助手',
    },
  ]}
/>
