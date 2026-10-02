---
title: "qk.Process：进程"
description: "qk.Process：进程的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/process
comments: false
sidebar_position: 10
---

{/* script-api:start */}

启动程序、用关联程序打开文件/网址、运行命令行并读取输出、列出与结束进程；在已打开的程序内部执行代码见 qk.Apps。以普通（非提升）权限启动。Run 被停止或 timeoutMs 到期时停止等待并尽力结束进程树。常见错误码：PROCESS_FAILED（启动失败）、PROCESS_TIMEOUT（Run 超时）、LIMIT_EXCEEDED（输出或列表超限）。

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

基础能力：启动程序或打开文件/网址。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

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

基础能力：启动程序或打开文件/网址。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

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

基础能力：启动程序或打开文件/网址。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

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

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="process-kill" />

## Process.Kill

```csharp
int Kill(int pid)
```

结束进程（不含子进程），返回结束的进程数（没有在运行为 0，不报错）。Kill(pid) 结束指定进程（只能是当前登录会话中的进程）；Kill(name) 结束当前会话中全部同名进程（名称规则同 List）。拒绝其他会话的进程、Quicker 自身及辅助进程、资源管理器与关键系统进程（INVALID_ARGUMENT，一个都不结束）；无权限（如管理员进程）报 PROCESS_FAILED（按名称时全部失败才报）。需要“强制结束程序”能力（可能丢失未保存数据）。

| 参数声明 | 说明 |
|---|---|
| `int pid` | 进程 Id（如 Process.List 的 Pid、Process.Start 的返回值）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：强制结束程序。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。


```csharp
int Kill(string name)
```

结束进程（不含子进程），返回结束的进程数（没有在运行为 0，不报错）。Kill(pid) 结束指定进程（只能是当前登录会话中的进程）；Kill(name) 结束当前会话中全部同名进程（名称规则同 List）。拒绝其他会话的进程、Quicker 自身及辅助进程、资源管理器与关键系统进程（INVALID_ARGUMENT，一个都不结束）；无权限（如管理员进程）报 PROCESS_FAILED（按名称时全部失败才报）。需要“强制结束程序”能力（可能丢失未保存数据）。

| 参数声明 | 说明 |
|---|---|
| `string name` | 进程名（不含路径，可省略 .exe）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：强制结束程序。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
