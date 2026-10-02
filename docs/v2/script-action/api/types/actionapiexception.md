---
title: "ActionApiException"
description: "ActionApiException的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/actionapiexception
comments: false
sidebar_position: 10
---

{/* script-api:start */}

qk 调用失败时抛出；错误码读取 e.Code.Value，扩展错误码读取 e.Detail（没有为 null），e.OperationId 为所调用的 qk 方法（如 "Files.ReadText"）。消息为中文，外部原文附在“：”之后；判断请用 Code/Detail，不要解析 Message。

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Code` | `ActionErrorCode` | 见类型说明。 |
| `OperationId` | `string` | 见类型说明。 |
| `Detail` | `string?` | 扩展错误码（可为 null）：BROWSER_FAILED 为浏览器扩展返回的码（如 URL_PATTERN_MISMATCH），BRIDGE_FAILED 为插件返回的码，CALL_FAILED 为被调脚本动作的错误码，STEP_FAILED 为步骤的错误码或异常类型名；INPUT_FAILED、WINDOW_CHANGED、SELECTION_FAILED 等通用码为宿主的内部原码。用 e.Detail == "…" 判断，不要解析 Message。 |

{/* script-api:end */}
