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
- 普通字面量写成 `{ "Value": "普通文本" }`；数字、布尔和枚举选项也使用 `Value`，值保持字符串。
- 表达式使用 `$=` 前缀，例如 `{ "Value": "$=1 + 2" }`；文本插值使用 `$$` 前缀，例如 `{ "Value": "$$你好，{name}" }`。没有前缀的 `{name}` 只是普通字面量。
- 直接读取动作变量写成 `{ "VarKey": "name" }`，变量必须在当前作用域中定义；同一参数不要同时填写 `VarKey` 和 `Value`。
- 仅 `Enum` 类型的字面量按 `SelectionItems` 做封闭枚举约束，使用选项 `Value` 而非显示名称。带预设下拉的 `Text` / `Number` 仍允许自由文本或表达式，不能仅因值不在预设列表中就拒绝；输入来源仍须遵守参数声明的限制。
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
| `Specified` | 97 |
| `Object` | 98 |
| `Any` | 99 |
| `NA` | 100 |
| `CreateVar` | 101 |
