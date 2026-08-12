---
title: "表格变量类型"
description: "表格是二维数据表；可预定义列来管理数据，或临时承接查询结果。"
slug: "/v2/xaction/concepts/tablevar"
sidebar_position: 80
quickerDocKey: "xaction/concepts/tablevar"
comments: true
docStatus: reviewed
legacyDocId: 62743624
legacyContentUpdatedAt: "2025-08-08T11:45:12.000Z"
---

# 表格变量类型

表格表示一张二维表，内部是 .NET `DataTable`。像带标题行的工作表：纵向是列，横向是一行记录。

本功能仍是预览，遇到问题欢迎反馈。

<TableDataPreview
  title="人员"
  columns={['姓名', '年龄', '地区']}
  rows={[
    ['张三', 20, '北京'],
    ['李四', 21, '上海'],
    ['王五', 22, '深圳'],
  ]}
/>

常见两种用法：

1. 在 Quicker 里管理表数据：预先定义列名、类型、编辑方式。
2. 从数据库、CSV、Excel 读进来临时用：不必先定义列。

相关模块：[表格数据操作](/v2/xaction/modules/tableoperation)、[数据库查询](/v2/xaction/modules/dboperation)。

## 管理表格数据

创建或编辑表格变量时，点「表格设置...」打开列设置。

<VariableDefPreview
  name="people"
  typeLabel="表格"
  remark="人员表"
/>

在字段窗口里添加、编辑或删除列：

<TableFieldPreview
  fields={[
    {key: 'Id', title: 'Id', type: '文本', unique: true, autoIncrement: true},
    {key: '名称', title: '名称', type: '文本'},
    {key: '说明', title: '说明', type: '文本'},
    {key: '图标', title: '图标', type: '文本'},
    {key: '注释', title: '注释', type: '文本'},
  ]}
/>

编辑单列：

<TableFieldPreview
  field={{
    key: '注释',
    title: '注释',
    type: '文本',
    allowNull: true,
    inputMode: '单行文本框',
    maxLength: 0,
  }}
/>

「基础信息」管类型和限制；「编辑设置」管添加/编辑行时的界面（类似表单）。

| 项 | 含义 |
| --- | --- |
| 列名 | 内部名，表达式里用这个。建议英文。 |
| 标题 | 界面上显示的名字 |
| 自动计算公式 | 按其它列生成本列。对应 `DataColumn.Expression`，直接写 `price * 0.0862` 或 `price + tax`，不要写 `$=`。 |

扩展设置（写在列的扩展参数里）：

- `image:50`：在查看/编辑数据窗口用缩略图显示该列（文件路径或网址），数字是宽度；双击看大图。
- `link:`：把单元格当路径或网址打开。
- `link:格式化字符串`：用 `{0}` 代表单元格值，如 `link:https://www.baidu.com/s?wd={0}`。
- `link:sp:子程序名`：点击后调子程序，单元格值进 `input`，当前行进 `row`（词典）。子程序尽量别再弹窗，以免死锁。

<PreviewMarks
  marks={[{key: 'image', label: '双击查看大图'}]}
>
  <TableDataPreview
    editable
    columns={['Name', 'Age', 'image']}
    rows={[
      [
        '张三',
        20,
        {
          image:
            'https://files.getquicker.net/_icons/3405578BB0D5022376C8A4D9DD6B9F92C28585C6.png',
          width: 50,
          alt: '示例图片',
        },
      ],
    ]}
  />
</PreviewMarks>

<StepProgramView example="8ad1e7b0-5ce8-4d57-fa45-08dcdc2c1d1a" />

<ShareLinkCard
  code="8ad1e7b0-5ce8-4d57-fa45-08dcdc2c1d1a"
  title="表格示例:图片和链接"
/>

## 临时存表

不管理数据时可以不定义列，只用来接查询结果。

加载：用表格数据操作读 Excel / CSV / JSON，或用数据库查询把结果写入表格变量。

遍历：用「每个」，列表参数写 `$= {表格}.Rows`。

<ModuleParamPreview
  moduleKey="sys:each"
  focusKeys={['input', 'item']}
  values={{input: '$={table1}.Rows'}}
  outputVars={{item: 'tableRow'}}
/>

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:each',
        inputs: {input: '$={table1}.Rows'},
        outputs: {item: 'tableRow'},
        note: '遍历表格行',
        ifSteps: [
          {
            key: 'sys:notify',
            inputs: {
              msg: '$= "表格行: " + {tableRow}["first_name"] + {tableRow}["last_name"]',
            },
          },
        ],
      },
    ],
  }}
/>

每次循环把一行放进「项」。变量可以是词典或对象：赋给词典会自动转换；赋给对象时内部是 `DataRow`。两种都能用 `行变量["列名"]` 取列。

不要在循环里改当前表。需要改原表时，用 `$= ({表格}.Copy()).Rows` 先复制再循环。

## 限制与排障

- 表格设计成读出来后只改内容，不能把别的值整体赋给表格变量，也不能靠状态存取整表写回去。
- 当状态存时用 JSON。
- 循环中改当前表会出错，先 `.Copy()`。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/tableoperation',
      label: '表格数据操作',
      description: '读 Excel / CSV / JSON，改行改列',
    },
    {
      href: '/v2/xaction/modules/dboperation',
      label: '数据库查询',
      description: '查询结果写入表格变量',
    },
    {
      href: '/v2/xaction/modules/each',
      label: '循环：每个',
      description: '按行遍历',
    },
    {
      href: '/v2/xaction/concepts/var-dict',
      label: '词典类型',
      description: '一行也可以当成词典用',
    },
  ]}
/>
