---
title: "ProcResult"
description: "ProcResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/procresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Process.Run 的结果：退出码与标准输出/错误文本。

## 构造

```csharp
ProcResult(int ExitCode, string StandardOutput, string StandardError)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `ExitCode` | `int` | 见类型说明。 |
| `StandardOutput` | `string` | 见类型说明。 |
| `StandardError` | `string` | 见类型说明。 |

{/* script-api:end */}
