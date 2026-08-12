---
title: "运行C#代码"
description: "执行C#代码。普通模式可写纯脚本（末行表达式即返回值，可用 context 读写变量）；也可写完整 Exec(context)。"
slug: "/v2/xaction/modules/csscript"
sidebar_label: "运行C#代码"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:csscript"
comments: true
moduleKey: "sys:csscript"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2571327
legacyContentUpdatedAt: "2025-01-20T01:01:01.000Z"
---

# 运行C#代码

执行 C# 代码，实现模块覆盖不到的功能。请只给熟悉 C# 的人用。

**请勿编写可能侵犯 Quicker 或第三方权益的代码，以及其它恶意代码。违反将直接停用帐号。**

## 当前模块定义

<XActionModuleMeta moduleKey="sys:csscript" />

## 概述

当前引擎是 Roslyn。普通模式在 Quicker 进程里跑，可用 `context` 读写动作变量；低权限模式送到独立进程，只能传文本；生成程序集则编译并加载 Assembly。

内容相同会复用已编译程序集，内容不同会生成新的。不要用文本插值动态拼整段脚本。从网页复制的代码可能带不可见字符，遇到奇怪编译错误先查这一点。部分 Office Interop 在旧引擎上会失败，请用当前的普通 / 低权限模式。

<ModuleParamPreview moduleKey="sys:csscript" />

## 参数说明

**运行模式**：

- **普通模式**：在 Quicker 进程中执行，可访问动作变量。Quicker 会提权，可能无法用 COM 控制第三方程序。
- **低权限模式**：在单独的 LPAgent 进程中执行，可用于 COM。跨进程不能访问动作变量，只能传文本。
- **生成程序集**：编译并加载程序集。

**脚本内容**：要运行的 C#。三种模式各有一份输入（界面上仍叫「脚本内容」）。普通模式可写纯脚本或完整 `Exec`；低权限必须声明 `Exec(string paramValue)`；生成程序集按模板写命名空间和类。

**参数值**：仅低权限。传给 `Exec(string paramValue)` 的参数。

**引用DLL库**：要引用的 DLL，每行一个。也可在代码里用 `#r`。

**开启磁盘缓存**：仅普通 / 低权限。是否把编译结果写到磁盘。关闭后仍会按最终脚本在当前进程内复用；脚本用 `$=` 或 `$$` 动态生成时会自动关掉磁盘缓存。升级 Quicker 后磁盘缓存会丢弃。缓存目录在 Windows 临时目录。

**执行线程**：仅普通模式。

- **自动**：按规则判断。
- **UI线程**：主界面线程。不要在这里跑会停顿的代码。WPF 窗体请选这项。
- **后台线程(MTA)**：不涉及界面、COM 时优先，减少卡顿。
- **后台线程(STA)**：COM、剪贴板等可能需要 STA。用共享 STA 线程，适合很快结束的代码。
- **后台线程(STA独立线程)**：必须长时间等且必须在 STA 里时，会新建线程。

**等待返回**：仅低权限。是否等到方法结束并取返回值。不勾选时「返回内容」为空。

**最长等待时间(ms)**：仅低权限。等待返回的最长时间，默认 `10000`。

**失败后停止**：出错时是否停止当前动作。默认开启。

## 输出

- **是否成功**：是否正常执行完毕（未抛出异常）。
- **返回内容**（普通模式）：纯脚本末行表达式 / `return` 的值，或 `Exec` 的返回值。若返回 `Task` / `ValueTask`，则为等待完成后的解包结果。
- **返回内容**（低权限）：启用「等待返回」时，`Exec(string paramValue)` 的返回文本。
- **程序集对象** / **程序集路径**：仅生成程序集。已加载的 Assembly 及其路径。

## 普通模式：直接编写脚本

不必再写 `public static void Exec(...)`。在 **脚本内容** 里直接写语句即可；Quicker 会自动包一层入口，并注入名为 `context` 的步骤上下文。

低权限、生成程序集请继续用各自的完整入口。

### 最短示例

```csharp
//.cs  文件类型，便于外部编辑时使用
using System.Windows.Forms;

// 末行表达式即返回值，会出现在步骤输出「返回内容」
MessageBox.Show("Hello World!");
"done"
```

### 读写动作变量

```csharp
using System.Windows.Forms;

var oldValue = context.GetVarValue("varName");
MessageBox.Show(oldValue as string);
context.SetVarValue("varName", "从脚本输出的内容。");
```

### 末行表达式作为返回值

最后一行若是**表达式**（不是以分号结尾的普通语句），会当作返回值，写入 **返回内容**（`rtn`）。

```csharp
var name = context.GetVarValue("name") as string ?? "";
$"Hello, {name}"
```

也可以显式 `return`：

```csharp
return DateTime.Now.ToString("O");
```

若末行是 `MessageBox.Show(...)` 这类本身没有可用返回值的调用，编译器会按「无返回值」处理；需要同时弹窗并返回文本时，把返回值单独放在最后一行。

### 使用 await

脚本中出现 `await` 时，宿主会按异步方式编译并**等待完成**后再继续后续步骤。返回 `Task` / `ValueTask`（以及带结果的泛型形式）时，**返回内容** 取等待完成后的解包结果。

```csharp
await Task.Delay(200);
context.SetVarValue("ready", true);
"ok"
```

### 何时仍应写完整 Exec

以下情况不会按「纯脚本」包装：

- 已经声明了 `static Exec(...)` 或 `static Run(...)`；
- 代码里包含 `class` / `struct` / `namespace` 等类型声明；
- 使用了 `public` / `private` 等访问修饰符声明成员。

注释里写到 `Exec` 或 `public` **不会**妨碍纯脚本。

### 完整 Exec 写法

```csharp
using System.Windows.Forms;

public static void Exec(Quicker.Public.IStepContext context)
{
    var oldValue = context.GetVarValue("varName");
    MessageBox.Show(oldValue as string);
    context.SetVarValue("varName", "从脚本输出的内容。");
}
```

带返回值时，从 **返回内容** 取得结果：

```csharp
using System.Windows.Forms;
using System.Threading;

public static string Exec(Quicker.Public.IStepContext context)
{
    ApartmentState state = Thread.CurrentThread.GetApartmentState();
    return state == ApartmentState.STA ? "STA" : "MTA";
}
```

纯脚本中的 `context`，以及 `Exec` 的参数，类型均为 `IStepContext`：

```csharp
namespace Quicker.Public
{
    public interface IStepContext
    {
        object GetVarValue(string varName);
        void SetVarValue(string varName, object value);
    }
}
```

遇到错误时直接抛出异常即可。

### 引用外部 dll

```csharp
//css_reference office.dll;
//css_reference  C:\Program Files ((x86))\TestProj\PInvoke.Kernel32.dll
```

所有 `//css_*` 指令中，若路径含有 CS-Script 分隔符，需将分隔符加倍转义。例如对 `script(today).cs` 的 include，应将括号写成 `((today))`。

.NET 自带的库通常可直接 `using`。若找不到名称，可从系统 GAC 加载：

```csharp
//css_dir C:\Windows\Microsoft.NET\assembly\GAC_MSIL\**
//css_ref UIAutomationClient.dll
```

更多指令见 [CS-Script Directives](https://www.cs-script.net/cs-script/help-legacy/Directives.html)。

### 带界面的脚本

- WPF：选 **UI线程**。`ShowDialog()` 模态显示时，暂时无法操作其它 Quicker 窗口。
- WinForms：选后台线程。若在前台线程跑，可能出现输入框无法输入汉字。

## 低权限模式

代码送到 LPAgent 进程执行。不能访问动作里的其它变量，只能传递文本参数和返回值。

<PreviewMarks
  marks={[
    {key: 'paramValue', label: '「参数值」输入到 Exec() 的 paramValue'},
    {key: 'resp', label: 'Exec 的返回值，从「返回内容」输出'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:csscript"
    scrollBody={false}
    focusKeys={['mode', 'scriptForLp', 'paramValue', 'waitResp', 'resp']}
    values={{
      mode: 'low_permission_roslyn',
      scriptForLp:
        '//.cs  文件类型，便于外部编辑时使用\n// 引用必要的命名空间\n\n// Quicker将会调用的函数\npublic static string Exec(string paramValue)\n{\n    return paramValue;\n}',
      paramValue: 'Hello World!',
      waitResp: 'true',
    }}
    outputVars={{resp: 'output'}}
  />
</PreviewMarks>

必须声明 `public static string Exec(string paramValue)`。`paramValue` 来自 **参数值**，返回值写入 **返回内容**。

```csharp
//.cs  文件类型，便于外部编辑时使用

public static string Exec(string paramValue)
{
    return "要返回的内容";
}
```

## 生成程序集

编译 C# 并加载程序集。输出 **程序集对象** 和 **程序集路径**，供后续步骤使用。入口按模块默认模板编写（命名空间 + 静态类 + `Exec`）。

## 限制与排障

第一次用普通模式编译（冷启动）会较慢，之后走缓存。动态拼脚本会生成大量程序集，请避免。复制网页代码先清不可见字符。需要 COM 控制第三方程序时用低权限模式，不要用普通模式。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/file-based-apps',
      label: '运行C#文件应用',
      description: '用 .NET SDK 跑 file-based app，可引用 NuGet / WPF。',
    },
    {
      href: '/v2/xaction/modules/jsscript',
      label: '运行Javascript代码',
      description: '更轻量的脚本片段。',
    },
    {
      href: '/v2/xaction/modules/pythonscript',
      label: '运行Python代码',
      description: '本机已装 Python 时跑片段。',
    },
  ]}
/>

## 更新历史

- 早期普通 / 低权限还有 CodeDOM（v1）引擎；当前界面只保留 Roslyn 的普通模式、低权限模式，以及生成程序集。
- 20230406 增加 v2 / Roslyn 说明。
- 20230731 增加网页复制代码可能带不可见字符的说明。
- 20231130 执行线程增加 STA 选项；普通模式支持返回值。
- 20250120 更新文档标题，以匹配实际功能。
- 20260811 普通模式支持直接编写纯脚本：末行表达式作返回值、可用 `context`、支持 `await` / Task；完整 `Exec` 仍兼容。
