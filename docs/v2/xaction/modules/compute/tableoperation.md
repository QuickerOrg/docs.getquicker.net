---
title: "表格数据操作"
description: "表格变量的相关处理操作"
slug: "/v2/xaction/modules/tableoperation"
sidebar_label: "表格数据操作"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:tableoperation"
comments: true
moduleKey: "sys:tableoperation"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "86aa841e688a836d5db45a0028ad8278a24b2b6f394e06d6d64355d2b74c0ab4"
legacyDocId: 62743542
legacyContentUpdatedAt: "2024-05-14T08:26:31.000Z"
---

# 表格数据操作

表格变量的相关处理操作

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:tableoperation`
- 分类：计算与比较（`Compute`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `table` | 表格变量 | `Table` |  | 是 | `UseVarOnly` |  | 要操作的表格变量 |
| `type` | 操作类型 | `Enum` | info | 是 | `Input` |  |  |
| `rowData` | 行数据 | `Dict` |  | 否 | `UseVarOrInput` | 仅：addRow, update | 包含行数据的词典；更新行时，仅包含要更新的列的内容。 |
| `dataText` | 文本数据 | `Text` |  | 否 | `UseVarOrInput` | 仅：importCsv, importJson | CSV/Json格式的文本内容 |
| `filterExpression` | 筛选表达式 | `Text` |  | 否 | `UseVarOrInput` | 仅：select, exportExcel, export_text, deleteRows, update |  |
| `deleteColumns` | 要删除的列 | `Text` |  | 否 | `UseVarOrInput` | 仅：deleteColumns | 可选。逗号','或分号';'隔开的列名，"*"表示删除所有列，"!列1,列2..."表示保留指定的列，删除其余的。 |
| `sort` | 排序 | `Text` |  | 否 | `UseVarOrInput` | 仅：select, exportExcel, export_text, manage |  |
| `exportColumns` | 导出的列 | `Text` |  | 否 | `UseVarOrInput` | 仅：exportExcel, export_text | 可选。逗号','或分号';'隔开的列名。留空时导出所有列。 |
| `excelFilePath` | Excel文件路径 | `Text` |  | 否 | `UseVarOrInput` | 仅：importExcel, exportExcel |  |
| `sheetName` | Excel工作表名 | `Text` |  | 否 | `UseVarOrInput` | 仅：importExcel, exportExcel | 如果未指定，则取第一个工作表。工作表首行为标题行。 |
| `startRowNum` | 标题行号 | `Integer` | 1 | 是 | `UseVarOrInput` | 仅：importExcel | 标题行的行号（从1开始）。当前面有表头之类的内容时，行号会变大。 |
| `gridSelectionMode` | 选择模式 | `Enum` | Cells | 否 | `Input` | 仅：manage | 注：单元格模式不支持返回选择的行。 |
| `clearOldRows` | 清除已有的行 | `Boolean` | true | 否 | `Input` | 仅：importCsv, importJson | 加载数据之前是否清除现有的行数据 |
| `isReadOnly` | 只读模式 | `Boolean` | false | 否 | `Input` | 仅：manage | 是否以只读模式打开 |
| `windowTitle` | 窗口标题 | `Text` | 表格数据 | 否 | `Input` | 仅：manage |  |
| `helpText` | 帮助文本 | `Text` |  | 否 | `Input` | 仅：manage |  |
| `useColumnTitle` | 使用列标题而非列名作为导出数据的标题 | `Boolean` | false | 否 | `Input` | 仅：exportExcel, export_text |  |
| `csvDelimiter` | CSV分隔符 | `Text` | , | 否 | `Input` | 仅：export_text, importCsv | 导出或导入CSV数据时使用的字段分隔符。使用'\t'表示Tab。 |
| `winSize` | 窗口尺寸/位置 | `Text` |  | 否 | `Input` | 仅：manage | 设置选择窗口的最大尺寸，格式为：宽度,高度。支持像素数值或屏幕宽高百分比，详情请参考模块文档。 |
| `topMost` | 是否置顶显示 | `Boolean` | false | 否 | `UseVarOrInput` | 仅：manage | 是否置顶显示窗口 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `rowCount` | 行数 | `Integer` |  | 表格内的数据行数 |
| `affectedRowCount` | 影响行数 | `Integer` | 仅：exportExcel, export_text, deleteRows, update | 更新或删除、筛选的行数 |
| `rows` | 行列表 | `Object` | 仅：select, info | 符合条件的行的数组 |
| `columns` | 列的列表 | `Object` | 仅：info | 表格的列的信息列表(DataTable.Columns) |
| `firstRow` | 第一行/结果行 | `Object` | 仅：select, addRow | 第一个符合条件的行或新添加的行，可输出为词典对象 |
| `selectedRows` | 选择的行列表 | `Object` | 仅：manage | 选择的所有行的列表 |
| `csvExportData` | CSV格式文本 | `Text` | 仅：export_text |  |
| `jsonExportData` | Json格式文本 | `Text` | 仅：export_text |  |
| `isConfirmed` | 是否确认 | `Boolean` | 仅：manage | 是否点击了确认按钮 |

## 选项值

### `type` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `info` | 获取信息 |  |
| `addRow` | 添加行 |  |
| `update` | 更新行 |  |
| `manage` | 查看或编辑数据 |  |
| `select` | 查询或筛选行(Select) |  |
| `clear` | 清除所有行 |  |
| `deleteRows` | 删除符合条件的行 |  |
| `deleteColumns` | 删除列 |  |
| `importCsv` | 从CSV文本加载数据 |  |
| `importJson` | 从Json文本加载数据 |  |
| `importExcel` | 从Excel工作表加载数据 |  |
| `export_text` | 导出文本数据 |  |
| `exportExcel` | 导出Excel文件 |  |

### `gridSelectionMode` 选择模式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `Cells` | 单元格(类似Excel) |  |
| `OneRow` | 行：0行或1行 |  |
| `OneRowRequired` | 行：1行(必选) |  |
| `Rows` | 行：0、1或多行 |  |
| `RowsRequired` | 行：一行或多行(必选) |  |
{/* xaction-metadata:end */}

【本功能为预览状态，欢迎反馈问题】

对某个表格变量（[DataTable对象](https://docs.microsoft.com/en-us/dotnet/api/system.data.datatable?view=netframework-4.7.2)）进行读写或更新。

关于表格变量的相关说明，请参考文档《[表格变量类型](/v2/xaction/concepts/tablevar)》。

![](./img/tableoperation-001-64de37de97.png)



## 通用输入输出参数

输入参数：

【表格变量】选择要操作的目标表格变量。

【操作类型】对表格变量进行的操作种类。

【失败后停止】遇到异常情况时停止继续执行后续步骤。

输出参数：

【是否成功】操作是否没有遇到异常。



## 操作类型

### 获取信息

获取表格变量的数据信息。

输出参数：

-   行列表：表格的[Rows](https://docs.microsoft.com/en-us/dotnet/api/system.data.datatable.rows?view=netframework-4.7.2#System_Data_DataTable_Rows)数据。需输出到“对象”类型变量中。
-   列的列表：表格的[Columns](https://docs.microsoft.com/en-us/dotnet/api/system.data.datatable.columns?view=netframework-4.7.2)数据。需输出到“对象”类型变量中。
-   行数：表格数据的总行数。

### 添加行

向表格中添加一行数据。

![](./img/tableoperation-002-46e293470c.png)

【行数据】

新添加行的各列数据。为词典类型，每一项的Key为列名，Value为值。

注：不需要为自动生成值的列提供数据（如自增长的列等）。

### 更新行

更新符合条件的行的某些列的内容。1.42.38+支持。

![](./img/tableoperation-003-dba68f282d.png)

**输入**

【行数据】要更新的列和对应值的词典。可以同时更新多列。

【筛选表达式】用于确定更新哪些行。

**输出**

【行数】更新的行数。

### 查看或编辑数据

显示一个窗口，可用于查看或修改表格变量中的数据。

通过【只读模式】参数可以控制是否允许修改表格变量中的数据。

#### 只读模式

![](./img/tableoperation-004-27627e9b91.png)

如果需要复制内容，可以鼠标拖动选中一个或多个单元格后Ctrl+C或使用右键菜单。

#### 编辑模式

![](./img/tableoperation-005-fd2b319808.png)

**注：需要事先在表格变量里定义每列的编辑方式。**

点击“添加行”按钮，可以打开表单窗口添加新的行。

双击一行中的单元格或点击后面的“编辑”按钮，可以编辑该行内容。

点击“删除”按钮可以删除一行。

点击“还原”可以将数据恢复到打开窗口时的状态。

### 查询或筛选行(Select)

使用[DataTable对象的Select()](https://docs.microsoft.com/en-us/dotnet/api/system.data.datatable.select?view=netframework-4.7.2)方法获取符合条件的行。

【筛选表达式】查询条件，语法请参考《[DataView RowFilter Syntax](https://www.csharp-examples.net/dataview-rowfilter/)》。

示例：

-   `Id = 10` `Id > 20` `Id in (1,2,3)`
-   `Name = '张三'` `Name <> '李四'` `Name in ('张三','李四','王五')`
-   `Date = #2022-12-27#`
-   `Name LIKE '*str*'` (通配符\*可以在最前面或/和最后面，不能在中间)
-   布尔操作符支持`AND``OR``NOT` 如：`NOT City = 'Tokyo' AND NOT City = 'Paris'`
-   支持使用`CONVERT`方法在比较的时候转换数据类型，[参考来源](https://stackoverflow.com/a/56853222/3335415)。例如：动态加载的表格，数字类型的列可能会被当做文本类型，此时如果要按数字比较，可以通过这样的方式转换：`**CONVERT(序号, System.Int32) > 3**`

【排序】可选。设定查询结果的排序方式，例如：

-   `Birth DESC`（按Birth列从大到小倒序排序）
-   `Id` (按ID从小到大正序排序）

输出：

【行数】符合筛选条件的结果行数。

【行列表】符合条件的行列表(类型为DataRow\[\])，可通过“每个”模块循环访问各行信息。

【第一行】第一条符合条件的行。

### 清除所有行

清除表格中的所有数据。

### 删除符合条件的行

删掉匹配指定筛选条件的行。

![](./img/tableoperation-006-f1d366a553.png)

### 删除列

从表格删除掉指定的列。

![](./img/tableoperation-007-e8825215e9.png)

### 从CSV文本加载数据

从csv格式（逗号分隔）的文本加载数据到表格变量。可以在前面使用“[读取文件](/v2/xaction/modules/readfile)”模块将文件内如读取到文本变量中（csv文件在简体中文系统中通常使用GB2312编码保存），再在本模块中将变量输入到“文本数据”参数。

![](./img/tableoperation-008-73c96b2964.png)

【文本数据】csv文本内容。第一行应该为标题行，内容为各列的列名。

【清除已有的行】是否清除已有的数据。

### 从JSON文本加载数据

从JSON数组文本中加载数据。

其它参数同上。

根据json数据内容的不同，分两种情况：

-   Json数组：数组中对象的key作为表的列名，对象的值作为作为每一行的对应key列的数据。如： `[{"name":"张三","age":20,'City':'BeiJing'},{"name":"李四","age":21,'City':'ShangHai'}]`，得到的表格为：
    ![](./img/tableoperation-009-72f4b63757.png)
-   Json对象（1.35.38+版本）：自动生成Key和Value两列，存储json对象每个属性的名称和值。如： `{"name":"张三","age":20,'City':'BeiJing'}` ，得到的表格内容为：
    ![](./img/tableoperation-010-acf2d5bcd3.png)

### 从Excel工作表加载数据

从Excel工作表加载数据。

![](./img/tableoperation-011-aed2ab3c5b.png)

要读取的Excel工作表中应该有规范的二维表格数据。

![](./img/tableoperation-012-77a4f2e906.png)

【Excel文件路径】Excel文件的完整路径。此文件当前不能被锁定（如在Excel中打开）。

【Excel工作表名】工作表名称。留空时读取第一个工作表。

【标题行号】列名所在行的行号（从1开始的数字，当前面有表头之类的内容时，会大于1）

注：如果遇到错误提示“Wrong Local header signature: 0xE011CFD0”说明您的excel文件后缀名和实际格式不匹配。xslx和xls是两种excel版本，不能混用。

### 导出文本数据

将表格变量内容导出为文本格式（CSV或Json）。

### 导出Excel文件

将表格内容输出到一个新建的Excel文档中。

【Excel文件路径】文件的保存路径。

【Excel工作表名】工作表名，留空时为“Sheet1”。

## 更新说明

-   20240227 增加查询筛选时转换数据类型的说明。
-   20240514 增加更新行、删除行、清空表格、删除列操作类型的说明。
