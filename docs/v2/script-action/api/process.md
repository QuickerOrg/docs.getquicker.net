---
title: "qk.Process：进程"
description: "qk.Process：进程的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/process
comments: false
sidebar_position: 10
---

{/* script-api:start */}

启动程序、用关联程序打开文件/网址、运行命令行并读取输出、列出进程、按 CPU/内存排名（ListUsage）与结束进程；在已打开的程序内部执行代码见 qk.Apps。以普通（非提升）权限启动。Run 被停止或 timeoutMs 到期时停止等待并尽力结束进程树。常见错误码：PROCESS_FAILED（启动失败）、PROCESS_TIMEOUT（Run 超时）、LIMIT_EXCEEDED（输出或列表超限）。

<a id="process-start" />

## Process.Start

```csharp
int Start(string executable, string[]? arguments = null, string workingDirectory = "")
```

以普通权限启动程序并返回 PID；不等待，停止脚本不会结束它。

| 参数声明 | 说明 |
|---|---|
| `string executable` | 见本成员和所在域的说明。 |
| `string[]? arguments = null` | 参数数组（逐项传递，无需自行加引号）。 |
| `string workingDirectory = ""` | 工作目录；空为默认。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

<a id="process-open" />

## Process.Open

```csharp
void Open(string target)
```

用关联程序打开文件、文件夹或网址。

| 参数声明 | 说明 |
|---|---|
| `string target` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="process-run" />

## Process.Run

```csharp
ProcResult Run(string executable, string[]? arguments = null, string workingDirectory = "", string encoding = "utf-8", int timeoutMs = 0)
```

以普通权限运行命令行程序并等待退出（隐藏窗口）；返回退出码与输出，输出每路最多 512K 字符。

| 参数声明 | 说明 |
|---|---|
| `string executable` | 见本成员和所在域的说明。 |
| `string[]? arguments = null` | 参数数组（逐项传递，无需自行加引号）。 |
| `string workingDirectory = ""` | 见本成员和所在域的说明。 |
| `string encoding = "utf-8"` | 输出编码，默认严格 UTF-8（如 gbk）。 |
| `int timeoutMs = 0` | 单次超时毫秒（默认 0 为只受动作超时约束）；超时报 PROCESS_TIMEOUT（已读输出不返回；尽力结束进程树）。 |

返回类型：`ProcResult`。空值、用户取消和异常行为以成员及域说明为准。

<a id="process-list" />

## Process.List

```csharp
ProcInfo[] List(string? name = null)
```

列出当前登录会话的进程（最多 4096 项）。

| 参数声明 | 说明 |
|---|---|
| `string? name = null` | 进程名（可省略 .exe）；null 为全部。 |

返回类型：`ProcInfo[]`。空值、用户取消和异常行为以成员及域说明为准。

<a id="process-listusage" />

## Process.ListUsage

```csharp
ProcUsage[] ListUsage(int limit = 10, string sort = "cpu", string? name = null)
```

当前登录会话中占用最高的进程（只读）：sort 为 cpu（默认）或 memory，limit 1–100（默认 10）；name 只统计该进程名（规则同 Process.List：不含路径，可省略 .exe，不区分大小写）。CPU 取约 0.5 秒内两次采样的差值（调用会阻塞约半秒，可被停止打断），按处理器数归一；MemoryBytes 为工作集。读不到的进程（提权/管理员进程、采样期间退出）直接跳过，不报错；采样期间新启动的进程不计入；同名多进程各算一项。

| 参数声明 | 说明 |
|---|---|
| `int limit = 10` | 返回条数，1–100。 |
| `string sort = "cpu"` | cpu（默认）&#124; memory；不区分大小写。 取值：`cpu`、`memory`。 |
| `string? name = null` | 见本成员和所在域的说明。 |

返回类型：`ProcUsage[]`。空值、用户取消和异常行为以成员及域说明为准。

<a id="process-kill" />

## Process.Kill

```csharp
int Kill(int pid)
```

结束进程（不含子进程），返回结束的进程数（没有在运行为 0，不报错）。Kill(pid) 结束指定进程（只能是当前登录会话中的进程）；Kill(name) 结束当前会话中全部同名进程（名称规则同 List）。拒绝其他会话的进程、Quicker 自身及辅助进程、资源管理器与关键系统进程（INVALID_ARGUMENT，一个都不结束）；无权限（如管理员进程）报 PROCESS_FAILED（按名称时全部失败才报）。可能丢失未保存数据。

| 参数声明 | 说明 |
|---|---|
| `int pid` | 进程 Id（如 Process.List 的 Pid、Process.Start 的返回值）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。


```csharp
int Kill(string name)
```

结束进程（不含子进程），返回结束的进程数（没有在运行为 0，不报错）。Kill(pid) 结束指定进程（只能是当前登录会话中的进程）；Kill(name) 结束当前会话中全部同名进程（名称规则同 List）。拒绝其他会话的进程、Quicker 自身及辅助进程、资源管理器与关键系统进程（INVALID_ARGUMENT，一个都不结束）；无权限（如管理员进程）报 PROCESS_FAILED（按名称时全部失败才报）。可能丢失未保存数据。

| 参数声明 | 说明 |
|---|---|
| `string name` | 进程名（不含路径，可省略 .exe）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

{/* script-api:end */}
