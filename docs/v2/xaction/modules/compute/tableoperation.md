---
title: "表格数据操作"
description: "对表格变量做读写、筛选、导入导出。"
slug: "/v2/xaction/modules/tableoperation"
sidebar_label: "表格数据操作"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:tableoperation"
comments: true
moduleKey: "sys:tableoperation"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 62743542
legacyContentUpdatedAt: "2024-05-14T08:26:31.000Z"
---

# 表格数据操作

对表格变量做读写或更新。表格变量本身见 [表格变量类型](/v2/xaction/concepts/tablevar)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:tableoperation" />

## 概述

先选 **表格变量** 和 **操作类型**，再按类型填写附加参数。输出随类型变化。

<ModuleParamPreview moduleKey="sys:tableoperation" />

![](./img/tableoperation-001-64de37de97.png)

## 参数说明

**表格变量**：要操作的表格变量。

**操作类型**：对表格做哪一种。点开下拉看当前全部选项。下面按类型说明。

**失败后停止**：遇到异常是否中止后续步骤。默认开启。

### 获取信息

输出：

- **行列表**：表格的 [Rows](https://learn.microsoft.com/dotnet/api/system.data.datatable.rows)。需输出到对象类型变量。
- **列的列表**：表格的 [Columns](https://learn.microsoft.com/dotnet/api/system.data.datatable.columns)。需输出到对象类型变量。
- **行数**：表格里的数据行数。

### 添加行

向表格添加一行。

<ModuleParamPreview
  moduleKey="sys:tableoperation"
  focusKeys={['table', 'type', 'rowData', 'stopIfFail', 'isSuccess', 'rowCount']}
  values={{
    type: 'addRow',
    rowData: `名称:测试条目
说明:这是一条测试数据
图标:fa:Light_Icon
注释:注释信息`,
  }}
  inputVars={{table: 'table'}}
  outputVars={{isSuccess: 'isSuccess', rowCount: 'rowCount'}}
/>

**行数据**：新行各列的词典，键是列名。不必给自动生成的列（如自增列）填值。

输出 **第一行/结果行**：新添加的行，可输出为词典。

### 更新行

更新符合条件的行的某些列。1.42.38+。

![](./img/tableoperation-003-dba68f282d.png)

**行数据**：要更新的列和值的词典，可同时改多列。

**筛选表达式**：决定更新哪些行。

输出 **影响行数**：实际更新的行数。

### 查看或编辑数据

弹出窗口查看或修改表格。

**只读模式**：是否禁止修改。默认关闭。

**窗口标题**：默认「表格数据」。旧稿未写。

**帮助文本**：旧稿未写。

**窗口尺寸/位置**：可选。格式 `宽度,高度`，可用像素或屏幕宽高百分比。旧稿未写。

**是否置顶显示**：旧稿未写。

**选择模式**：单元格类似 Excel；也可按行单选/多选，部分模式必选。单元格模式不支持返回选择的行。旧稿未写。

**排序**：可选。查看时的排序。旧稿未写。

#### 只读模式

<TableDataPreview
  columns={['Id', '名称', '说明', '图标', '注释']}
  rows={[
    [0, '测试条目', '这是一条测试数据', 'fa:Light_Icon', '注释信息'],
    [1, '测试条目1', '这是一条测试数据', 'fa:Light_Icon', '注释信息'],
  ]}
/>

要复制内容：拖选单元格后 Ctrl+C，或用右键菜单。

#### 编辑模式

<TableDataPreview
  editable={true}
  columns={['Id', '名称', '说明', '图标', '注释']}
  rows={[
    [0, '测试条目', '这是一条测试数据', 'fa:Light_Icon', '注释信息'],
    [1, '测试条目1', '这是一条测试数据', 'fa:Light_Icon', '注释信息'],
  ]}
/>

需要事先在表格变量里定义每列的编辑方式。

- 「添加行」打开表单加新行。
- 双击单元格或点「编辑」改该行。
- 「删除」删一行。
- 「还原」恢复到打开窗口时的数据。

输出：

- **选择的行列表**：当前选中的行。旧稿未写。
- **是否确认**：是否点了确认。旧稿未写。

### 查询或筛选行(Select)

用 [DataTable.Select()](https://learn.microsoft.com/dotnet/api/system.data.datatable.select) 取出符合条件的行。

**筛选表达式**：查询条件，语法见 [DataView RowFilter Syntax](https://www.csharp-examples.net/dataview-rowfilter/)。例如：

- `Id = 10` `Id > 20` `Id in (1,2,3)`
- `Name = '张三'` `Name <> '李四'` `Name in ('张三','李四','王五')`
- `Date = #2022-12-27#`
- `Name LIKE '*str*'`（通配符 `*` 只能在最前或最后，不能在中间）
- 布尔：`AND` `OR` `NOT`，如 `NOT City = 'Tokyo' AND NOT City = 'Paris'`
- 可用 `CONVERT` 改类型后再比。动态加载的表里数字列有时是文本，要按数字比可以写：`CONVERT(序号, System.Int32) > 3`

**排序**：可选。如 `Birth DESC`、`Id`。

输出：

- **行数**：表格内的数据行数。
- **行列表**：符合条件的行（`DataRow[]`），可用 [循环：每个](/v2/xaction/modules/each) 遍历。
- **第一行/结果行**：第一条符合条件的行。

### 清除所有行

清掉表格里的全部数据。

### 删除符合条件的行

按筛选条件删行。

<ModuleParamPreview
  moduleKey="sys:tableoperation"
  focusKeys={['table', 'type', 'filterExpression', 'stopIfFail']}
  values={{type: 'deleteRows', filterExpression: "Name='王五'"}}
  inputVars={{table: 'table'}}
/>

输出 **影响行数**。

### 删除列

<ModuleParamPreview
  moduleKey="sys:tableoperation"
  focusKeys={['table', 'type', 'deleteColumns', 'stopIfFail']}
  values={{type: 'deleteColumns', deleteColumns: 'Age,Name'}}
  inputVars={{table: 'table'}}
/>

**要删除的列**：用逗号 `,` 或分号 `;` 分隔列名。`*` 表示删全部列；`!列1,列2` 表示保留这些列、删掉其余的。

### 从CSV文本加载数据

从逗号分隔文本加载到表格。可先用 [读取文件](/v2/xaction/modules/readfile) 读入文本（简体中文系统里 CSV 常用 GB2312），再交给 **文本数据**。

<ModuleParamPreview
  moduleKey="sys:tableoperation"
  focusKeys={[
    'table',
    'type',
    'dataText',
    'clearOldRows',
    'stopIfFail',
    'isSuccess',
    'rowCount',
  ]}
  values={{type: 'importCsv', clearOldRows: 'true'}}
  inputVars={{table: 'table', dataText: 'text'}}
  outputVars={{rowCount: 'rowCount'}}
/>

**文本数据**：CSV 文本。第一行应是列名。

**清除已有的行**：加载前是否清空现有行。默认开启。

**CSV分隔符**：字段分隔符，`\t` 表示 Tab。旧稿未写。

### 从JSON文本加载数据

从 JSON 加载。其它参数与 CSV 相同（无 CSV 分隔符）。

按 JSON 形状分两种：

- 数组：对象的 key 当列名。例如 `[{"name":"张三","age":20,"City":"BeiJing"},{"name":"李四","age":21,"City":"ShangHai"}]`：

  <TableDataPreview
    compact={true}
    columns={['name', 'age', 'City']}
    rows={[
      ['张三', 20, 'BeiJing'],
      ['李四', 21, 'ShangHai'],
    ]}
  />

- 对象（1.35.38+）：自动生成 Key、Value 两列。例如 `{"name":"张三","age":20,"City":"BeiJing"}`：

  <TableDataPreview
    compact={true}
    columns={['Key', 'Value']}
    rows={[
      ['name', '张三'],
      ['age', 20],
      ['City', 'BeiJing'],
    ]}
  />

### 从Excel工作表加载数据

<ModuleParamPreview
  moduleKey="sys:tableoperation"
  focusKeys={[
    'table',
    'type',
    'excelFilePath',
    'sheetName',
    'startRowNum',
    'stopIfFail',
    'isSuccess',
    'rowCount',
  ]}
  values={{type: 'importExcel', startRowNum: '1'}}
  inputVars={{table: 'table'}}
  outputVars={{rowCount: 'rowCount'}}
/>

工作表里应是规范的二维表。

![](./img/tableoperation-012-77a4f2e906.png)

**Excel文件路径**：完整路径。文件当前不能被占用（例如正用 Excel 打开）。

**Excel工作表名**：留空则读第一个工作表。

**标题行号**：列名所在行，从 1 计。前面有表头时会大于 1。

### 导出文本数据

把表格导出为 CSV 或 JSON 文本。

**筛选表达式** / **排序** / **导出的列**：可选。导出的列用逗号或分号分隔，留空则全部列。旧稿未写「导出的列」。

**使用列标题而非列名作为导出数据的标题**：旧稿未写。

**CSV分隔符**：导出 CSV 时的分隔符。

输出 **CSV格式文本**、**Json格式文本**、**影响行数**。

### 导出Excel文件

把表格写到一个新的 Excel 文件。

**Excel文件路径**：保存路径。

**Excel工作表名**：留空则为 `Sheet1`。

同样可填筛选、排序、导出的列、是否用列标题。

## 输出

- **是否成功**：是否没有遇到异常。
- **行数**：表格内的数据行数。
- 其余输出随操作类型变化，见上一节。

## 限制与排障

Excel 报错 `Wrong Local header signature: 0xE011CFD0` 时，多半是后缀和实际格式不一致：`.xlsx` 与 `.xls` 不能混用。导入 Excel 时文件不能被 Excel 打开占用。筛选表达式里的字符串要用单引号，日期用 `#2022-12-27#`。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/tablevar',
      label: '表格变量类型',
      description: '列定义、编辑方式、和本模块的关系。',
    },
    {
      href: '/v2/xaction/modules/each',
      label: '循环：每个',
      description: '遍历查询得到的行列表。',
    },
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '先读出 CSV/JSON 文本再导入。',
    },
  ]}
/>

## 更新说明

- 20240227 增加查询筛选时转换数据类型的说明。
- 20240514 增加更新行、删除行、清空表格、删除列操作类型的说明。
