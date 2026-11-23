# AI 动作 JSON 示例与语义规范补充

> 说明：`data/xaction/ai-action-json-guide.md` 由客户端仓库自动导出并在每次 `docs:xaction:sync` 时覆盖，请勿手工修改该文件。本文件保留在文档仓内供 AI、校验器与开发者对照使用，聚焦三种值语法区分及完整可校验示例。

## 三种值写法对比（切勿混淆）

| 语法形式 | JSON 结构 | 运行期语义 | 适用参数类型 |
| --- | --- | --- | --- |
| **直接变量绑定（`VarKey`）** | `{ "VarKey": "myText" }` | 直接把变量实体交给步骤读写，保留对象/列表/图片等原始类型 | `UseVar` 或 `UseVarOrInput` |
| **文本插值（`$$`）** | `{ "Value": "$$共 {count} 条：{name}" }` | 按字符串模板替换 `{变量名}` 为变量文本值 | `Input`（若支持文本模板）或 `UseVarOrInput` |
| **C# 表达式（`$=`）** | `{ "Value": "$= {count} > 0 && !string.IsNullOrEmpty({name})" }` | 编译执行 C# 表达式并返回求值结果（常用于条件判断与数值/对象计算） | 表达式参数或 `UseVarOrInput` |

> 注意：`UseVar` 模式参数（例如 `sys:writeClipboard` 的 `input`）只允许使用 `VarKey`；`Input` 模式参数（例如 `sys:notify` 的 `type`、`sys:MsgBox` 的 `operation`）只允许字面量 `Value`，不得使用 `VarKey`。

## 完整示例 1：条件分支 + `$=` 表达式 + `$$` 插值消息

```json
{
  "Id": "11111111-1111-4111-8111-111111111111",
  "Presentation": {
    "Title": "剪贴板文本字数检查与通知",
    "Description": "演示 OutputParams、$= 表达式与 $$ 文本插值的标准用法",
    "Icon": "fa:Light_Bolt:#6aaded"
  },
  "OperationType": "xAction",
  "OperationPayload": {
    "PayloadType": "xAction",
    "LimitSingleInstance": true,
    "SummaryExpression": "$$字数检查完成",
    "SubPrograms": [],
    "Variables": [
      { "Key": "clipText", "Type": 0, "DefaultValue": "" },
      { "Key": "readOk", "Type": 2, "DefaultValue": "false" }
    ],
    "Steps": [
      {
        "StepRunnerKey": "sys:getClipboardText",
        "InputParams": {
          "stopIfFail": { "Value": "false" }
        },
        "OutputParams": {
          "output": "clipText",
          "isSuccess": "readOk"
        }
      },
      {
        "StepRunnerKey": "sys:if",
        "InputParams": {
          "condition": { "Value": "$= {readOk} && !string.IsNullOrWhiteSpace({clipText})" }
        },
        "OutputParams": {},
        "IfSteps": [
          {
            "StepRunnerKey": "sys:notify",
            "InputParams": {
              "type": { "Value": "Success" },
              "placement": { "Value": "BottomCenter" },
              "msg": { "Value": "$$已读取剪贴板：{clipText}" }
            },
            "OutputParams": {}
          }
        ],
        "ElseSteps": [
          {
            "StepRunnerKey": "sys:notify",
            "InputParams": {
              "type": { "Value": "Warning" },
              "placement": { "Value": "BottomCenter" },
              "msg": { "Value": "剪贴板当前没有可用文本" }
            },
            "OutputParams": {}
          }
        ]
      }
    ]
  },
  "Options": {
    "EnableEvaluateVariable": false,
    "LimitSingleInstance": true
  }
}
```

## 完整示例 2：`VarKey` 直接绑定变量与弹窗确认

```json
{
  "Id": "22222222-2222-4222-8222-222222222222",
  "Presentation": {
    "Title": "变量写回剪贴板示例",
    "Description": "演示 UseVar 参数必须通过 VarKey 直接绑定",
    "Icon": "fa:Light_Clipboard:#39b54d"
  },
  "OperationType": "xAction",
  "OperationPayload": {
    "PayloadType": "xAction",
    "LimitSingleInstance": true,
    "SummaryExpression": "$$",
    "SubPrograms": [],
    "Variables": [
      { "Key": "targetText", "Type": 0, "DefaultValue": "Hello Quicker V2" },
      { "Key": "writeOk", "Type": 2, "DefaultValue": "false" },
      { "Key": "confirmed", "Type": 2, "DefaultValue": "false" }
    ],
    "Steps": [
      {
        "StepRunnerKey": "sys:MsgBox",
        "InputParams": {
          "operation": { "Value": "default" },
          "title": { "Value": "确认写入" },
          "icon": { "Value": "Question" },
          "buttons": { "Value": "OKCancel" },
          "message": { "Value": "$$即将把内容写入剪贴板：{targetText}" }
        },
        "OutputParams": {
          "okOrYes": "confirmed"
        }
      },
      {
        "StepRunnerKey": "sys:if",
        "InputParams": {
          "condition": { "VarKey": "confirmed" }
        },
        "OutputParams": {},
        "IfSteps": [
          {
            "StepRunnerKey": "sys:writeClipboard",
            "InputParams": {
              "type": { "Value": "auto" },
              "input": { "VarKey": "targetText" }
            },
            "OutputParams": {
              "isSuccess": "writeOk"
            }
          }
        ]
      }
    ]
  },
  "Options": {
    "EnableEvaluateVariable": false,
    "LimitSingleInstance": true
  }
}
```
