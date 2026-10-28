---
title: 表格筛选条件
description: 表格管理窗口的筛选使用 DataView 表达式，支持比较、逻辑运算、LIKE 和空值判断。
quickerDocKey: v2/xaction/concepts/table-filter
comments: true
---

# 表格筛选条件

表格管理窗口顶部的筛选框使用 .NET `DataView.RowFilter` 表达式，按下 `Enter` 后应用。它不是 Quicker 的 C# 表达式，也不是一条完整 SQL 查询；不需要写 `SELECT` 或 `WHERE`。

假设表格有“名称”“数量”“备注”三列：

| 条件 | 含义 |
| --- | --- |
| `[数量] >= 10` | 数量不少于 10 |
| `[名称] = '示例'` | 名称完全匹配 |
| `[名称] LIKE '%示例%'` | 名称包含“示例” |
| `[数量] >= 10 AND [数量] < 20` | 同时满足两个条件 |
| `[名称] = '甲' OR [名称] = '乙'` | 满足其中一个条件 |
| `[备注] IS NULL` | 备注为空值 |

## 名称、文本与类型

- 列名必须在表格中存在；含空格或特殊字符时用方括号包住。
- 文本用单引号包住，文本中的单引号写成两个单引号，例如 `[名称] = 'O''Brien'`。
- 数值列与文本列的比较规则不同；看起来像数字的文本列不要直接当作数值列使用。
- 空字符串 `''` 和空值 `NULL` 不相同，可按需要组合判断。
- 多条件混用时加括号，明确逻辑优先级。

清空筛选框并按 `Enter` 可显示全部记录。条件语法出错时，窗口会提示错误并取消筛选；筛选只影响当前显示，不删除表格数据。

更完整的运算符、通配符和函数规则见 Microsoft 的 [DataColumn.Expression 说明](https://learn.microsoft.com/dotnet/api/system.data.datacolumn.expression)。
