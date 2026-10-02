---
title: "qk.Steps：组合动作步骤"
description: "qk.Steps：组合动作步骤的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/steps
comments: false
sidebar_position: 10
---

{/* script-api:start */}

通用步骤入口：执行没有 qk 对应方法的长尾 XAction 步骤（如 Windows 服务/注册表、PDF、Excel 区域、CorelDRAW/Revit 等软件控制）；已有 qk 方法时优先用 qk。需要“【高风险】执行 XAction 步骤”能力，按步骤键逐项确认（确认中显示步骤名称；可运行任意程序/命令的高风险步骤——sys:run、sys:shelloperation、sys:openUrl、sys:officehelper、sys:inputScript/sendKeys、sys:sendMessage、浏览器与各软件控制步骤等——另起一行警示，需用户额外确认，能用 qk 方法时不要用它们）：步骤键请写成字符串字面量（计算出的步骤键需要“任意步骤”授权，否则运行时报 CAPABILITY_DENIED）。调用前先查步骤的参数 key、类型与选项值（Agent/MCP：grep @knowledge/catalog 后 read_file 模块 yaml，或 steps.resolve('sys:xxx')），不要猜；先读模块卡（sys.&lt;key>.yaml），受第二个控制字段门控的参数（如 virtualDesktop 的 moveWindow + target=id → desktopId）在那里以“when … & target=…”列出（steps.resolve 的逐分支说明中也在对应分支下列出）。只有经过审计的步骤可调用：流程控制、变量类、执行代码/表达式、调用动作/子程序/控制 Quicker、依赖 XAction 运行时的步骤，以及未经审计的（新增）步骤被拒绝（INVALID_ARGUMENT）。

<a id="steps-run" />

## Steps.Run

```csharp
IReadOnlyDictionary<string, object?> Run(string key, object? inputs = null, int timeoutMs = 0)
```

执行一个 XAction 步骤并返回其输出（键为输出参数 key；未写出的为 null；图片为 Img，表格为行字典列表；原始 C# 对象类型的输出不返回；不含 isSuccess/errMessage）。参数一律按字面值注入（"$="、"$$"、&#123;变量&#125; 都按原文传入），按参数类型转换，类型不符、未知参数、stopIfFail 与“仅变量”参数报 INVALID_ARGUMENT。所选分支用到的控制字段（operation/type/target 等）必须显式给出，否则报 INVALID_ARGUMENT 并列出可选值；传入所选分支不读取的参数也报 INVALID_ARGUMENT 并指出它属于哪个分支；其余未提供的参数取步骤默认值。文本参数不接受集合（不会自动拼接或转 JSON），请先 string.Join；窗口句柄参数（hwnd 等）可传 Win（与 qk.Window 同样拒绝提权窗口与 Quicker 自身窗口）。步骤失败报 STEP_FAILED（附步骤的错误信息，e.Detail 为步骤的错误码或异常类型名，副作用可能已发生），超时报 STEP_TIMEOUT；停止脚本会停止步骤。

| 参数声明 | 说明 |
|---|---|
| `string key` | 步骤键，如 "sys:winservice"；可省略 "sys:" 前缀，不区分大小写。须为字符串字面量才能在运行前识别并确认。 |
| `object? inputs = null` | 匿名对象或字典，键为输入参数 key（与 catalog yaml 中的字段名相同），值为字面值；控制字段须显式给出，文本参数传集合前先 string.Join，窗口句柄参数可传 Win。 |
| `int timeoutMs = 0` | 0（默认）只受动作运行时限约束；1–86400000 毫秒，到期报 STEP_TIMEOUT 并请求步骤停止。 |

返回类型：`IReadOnlyDictionary<string, object?>`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用组合动作步骤（按步骤确认，高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
