---
title: "Excel对象操作"
description: "打开、创建、保存 Excel 工作簿，并取出 Application / 工作簿 / 工作表对象。"
slug: "/v2/xaction/modules/excelobjects"
sidebar_label: "Excel对象操作"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:excelObjects"
comments: true
moduleKey: "sys:excelObjects"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 9257561
legacyContentUpdatedAt: "2023-02-16T07:33:45.000Z"
---

# Excel对象操作

打开、创建、保存已由本模块启动的 Excel 工作簿，并取出 Application、工作簿、工作表对象，供后续步骤或表达式使用。只读写文件、不启动 Excel 用 [Excel文件读写](/v2/xaction/modules/excelreadwrite)；对已打开窗口里的区域赋值用 [Excel区域操作](/v2/xaction/modules/excelrange)。两边的工作簿 / 工作表对象互不通用。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:excelObjects" />

## 概述

本模块仍是预览状态。权限原因下，不能操作从资源管理器或开始菜单打开的 Excel 窗口，必须先用「打开工作簿」或「创建工作簿」得到窗口。编程改过的内容无法撤销。熟悉 C# / VBA 会更好用。

<ModuleParamPreview moduleKey="sys:excelObjects" />

## 参数说明

**操作类型**：获取当前 Excel 应用信息；打开 / 保存 / 关闭 / 创建工作簿；选择工作表。

**工作簿对象**：保存、关闭、选择工作表时指定目标工作簿。留空表示当前活动工作簿。

**参数**：按操作类型填写，每行一条 `名称=值`。各操作支持的键见下文。

**文件/模板路径**：打开、保存时的完整路径；创建工作簿时用来指定模板文件。

**失败后停止**：出错后是否中止动作。默认开启。

## 获取当前Excel应用信息

获取当前打开的 Excel 窗口信息。内部用 `(Excel.Application)Marshal.GetActiveObject("Excel.Application")`。只能访问到由本模块打开的窗口。

<ModuleParamPreview
  moduleKey="sys:excelObjects"
  focusKeys={['operation', 'params', 'stopIfFail', 'isSuccess', 'application', 'activeWorkbook', 'activeSheet', 'worksheets', 'worksheetNames', 'workbookPath']}
  values={{operation: 'ApplicationInfo', stopIfFail: 'true'}}
/>

**参数**：本操作不使用。

### 输出

- **是否成功**
- **活动工作簿**：[Application.ActiveWorkbook](https://docs.microsoft.com/en-us/dotnet/api/microsoft.office.interop.excel._application.activeworkbook?view=excel-pia)
- **活动工作表**：[Application.ActiveSheet](https://docs.microsoft.com/en-us/dotnet/api/microsoft.office.interop.excel._application.activesheet?view=excel-pia)
- **工作表对象列表**：[Application.Worksheets](https://docs.microsoft.com/en-us/dotnet/api/microsoft.office.interop.excel._application.worksheets)
- **工作表名称的列表**：各工作表名称
- **工作簿路径**：`ActiveWorkbook.FullName`
- **Application对象**：`GetActiveObject("Excel.Application")` 得到的对象本身

## 打开工作簿

打开指定的 Excel 文件。浏览器未启动时，Quicker 会尝试启动 Excel。

<ModuleParamPreview
  moduleKey="sys:excelObjects"
  focusKeys={['operation', 'path', 'params', 'stopIfFail', 'isSuccess', 'activeWorkbook', 'activeSheet', 'worksheets', 'worksheetNames', 'application']}
  values={{operation: 'OpenFile'}}
  outputVars={{activeSheet: 'sheet'}}
/>

**文件/模板路径**：要打开的完整路径。

**参数**：可选，每行一个，只写需要的项：

- `Visible=true/false`：窗口是否可见
- `Password=`：文件密码
- `Readonly=true/false`：是否只读打开
- `Format=`：打开文本文件时的分隔字符，数字：`1` Tab、`2` 逗号、`3` 空格、`4` 分号、`5` 无

### 输出

与「获取当前 Excel 应用信息」相同，另输出 **Application对象**：打开此文件的 Application。若已有实例则复用，否则新建。通常每个 Application 对应一个 Excel 进程。本操作不输出 **工作簿路径**。

## 保存工作簿

保存当前或指定的工作簿。

<ModuleParamPreview
  moduleKey="sys:excelObjects"
  focusKeys={['operation', 'workbook', 'path', 'params', 'stopIfFail', 'isSuccess']}
  values={{operation: 'SaveWorkbook'}}
  outputVars={{isSuccess: 'isSuccess'}}
/>

**工作簿对象**（1.9.5+）：要保存的工作簿。未指定则保存当前活动工作簿。

**文件/模板路径**：保存位置。留空相当于按 Excel 的保存按钮。

**参数**：每行 `名称=值`：

- `SaveCopy=true/false`：是否保存副本。保存副本时不支持其他参数。
- `CloseWorkbook=true/false`：是否关闭工作簿。
- `CloseApplication=true/false`：是否关闭 Excel。
- `Password=`：密码。
- `FileFormat=`：保存格式，见 [XlFileFormat](https://docs.microsoft.com/en-us/dotnet/api/microsoft.office.interop.excel.xlfileformat?view=excel-pia)。

## 关闭工作簿

关闭指定或当前活动工作簿。若该 Excel 进程里已经没有其他工作簿，会一并退出 Excel。

<ModuleParamPreview
  moduleKey="sys:excelObjects"
  focusKeys={['operation', 'workbook', 'stopIfFail', 'isSuccess']}
  values={{operation: 'CloseWorkbook'}}
/>

**工作簿对象**：要关闭的工作簿。留空表示当前活动工作簿。

## 创建工作簿

创建一个新的工作簿。

<ModuleParamPreview
  moduleKey="sys:excelObjects"
  focusKeys={['operation', 'path', 'params', 'stopIfFail', 'isSuccess', 'activeWorkbook', 'activeSheet']}
  values={{operation: 'CreateWorkbook'}}
  outputVars={{isSuccess: 'isSuccess', activeSheet: 'worksheet'}}
/>

**文件/模板路径**：可选。需要时填写模板文件的完整路径。

**参数**（1.9.5+）：不指定模板时，设定初始工作表名称。每行一条 `+:工作表名称`，例如：

```text
+:工作表1
+:工作表2
```

## 选择工作表

（1.9.5+）激活某个工作表。请确保工作表存在。

<ModuleParamPreview
  moduleKey="sys:excelObjects"
  focusKeys={['operation', 'workbook', 'params']}
  values={{operation: 'SelectWorksheet', params: 'name=工作表2'}}
/>

**工作簿对象**：要操作的工作簿。留空表示当前活动工作簿。

**参数**：任选一种：

- `index=` 工作表序号（从 1 开始）
- `name=` 工作表名称

## 示例动作

这些动作步骤较多，用卡片打开即可。

<ShareLinkCard
  code="efa8a4af-4a87-4d52-d718-08d827485760"
  title="用Excel打开"
  description="选择 Excel 文件并用 Quicker 打开，以便后续模块控制"
  author="CL"
/>

<ShareLinkCard
  code="8a38e78c-2edf-4c8b-1506-08d8255d6cc9"
  title="自动生成乘法口诀"
  description="写入 d:\\test.xlsx"
  author="CL"
/>

<ShareLinkCard
  code="5a3e75ce-5a1c-4d1d-d71a-08d827485760"
  title="选择工作表"
  author="CL"
/>

## 限制与排障

- 只能操作本模块打开或创建的 Excel 窗口，不能操作资源管理器 / 开始菜单启动的窗口。
- 编程修改无法撤销，改之前先保存。
- 本模块为预览状态，欢迎反馈。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/excelrange',
      label: 'Excel区域操作',
      description: '对已打开窗口里的区域赋值、设格式。',
    },
    {
      href: '/v2/xaction/modules/excelreadwrite',
      label: 'Excel文件读写',
      description: '不启动 Excel，用 NPOI 读写文件。',
    },
    {
      href: '/v2/xaction/modules/officehelper',
      label: 'Office软件辅助',
      description: 'VBA 和功能区命令。',
    },
  ]}
/>
