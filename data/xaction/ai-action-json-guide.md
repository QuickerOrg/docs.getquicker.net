# AI 动作 JSON 生成规则

默认生成完整 V2 `ActionItem2`，不要走旧版 `ActionItem.Data/Data2/Data3` 保存路径。

## 外层结构

```json
{
  "Id": "00000000-0000-0000-0000-000000000000",
  "Presentation": { "Title": "动作名称", "Description": "动作说明", "Icon": "fa:Light_Bolt:#6aaded" },
  "OperationType": "xAction",
  "OperationPayload": {
    "PayloadType": "xAction",
    "LimitSingleInstance": true,
    "SummaryExpression": "$$",
    "SubPrograms": [],
    "Variables": [],
    "Steps": []
  },
  "Options": { "EnableEvaluateVariable": false, "LimitSingleInstance": true }
}
```

## ActionStep

- `StepRunnerKey` 必须使用 `catalog.json` 中的模块 `key`。
- `InputParams` 的键必须使用模块输入参数 `key`。
- 字面量、表达式、数字、布尔和枚举选项都写成 `{ "Value": "..." }`，值保持字符串。
- 从动作变量读取时写成 `{ "VarKey": "变量名" }`。
- `OutputParams` 是模块输出参数 `key` 到动作变量 `key` 的映射。
- 只有流程模块才使用 `IfSteps` / `ElseSteps`。普通模块可设为 `null` 或省略。

## 变量类型

动作变量的 `Type` 建议使用数值，常用值如下：

| 名称 | 数值 |
| --- | ---: |
| `Text` | 0 |
| `Number` | 1 |
| `Boolean` | 2 |
| `Image` | 3 |
| `List` | 4 |
| `DateTime` | 6 |
| `Keyboard` | 7 |
| `Mouse` | 8 |
| `Enum` | 9 |
| `Dict` | 10 |
| `Form` | 11 |
| `Integer` | 12 |
| `Table` | 13 |
| `FormForDict` | 14 |
| `Object` | 98 |
| `Any` | 99 |
| `NA` | 100 |
| `CreateVar` | 101 |
