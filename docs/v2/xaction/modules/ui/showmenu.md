---
title: "显示菜单"
description: "在指针位置弹出纵向菜单，点选后执行操作或返回数据。"
slug: "/v2/xaction/modules/showmenu"
sidebar_label: "显示菜单"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:showmenu"
comments: true
moduleKey: "sys:showmenu"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 55509182
legacyContentUpdatedAt: "2024-12-02T01:31:54.000Z"
---

# 显示菜单

在鼠标指针处弹出纵向菜单（类似右键菜单），用来执行操作或让用户选一项。要从列表里选且支持键盘，用 [用户选择](/v2/xaction/modules/userselect)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:showmenu" />

## 概述

默认不占用焦点，只能鼠标点。打开「占用焦点」后可以用键盘选。网友 @Ceastld 的 [显示菜单子程序](https://getquicker.net/subprogram?id=b68fab2f-7004-4373-9242-08d982821308) 还支持焦点和水平排列。

<ContextMenuPreview
  galleryCover={true}
  openPath={['二级菜单']}
  items={[
    {label: '无图标菜单'},
    {label: '带Tooltip的菜单', tooltip: 'tooltip内容'},
    {label: '带图标的菜单', icon: 'fa:Light_Flag', tooltip: 'tooltip内容'},
    {
      label: '二级菜单',
      icon: 'fa:Light_Cog',
      children: [{label: '子菜单', icon: 'fa:Light_UserCircle'}],
    },
    {label: '危险动作菜单', icon: 'fa:Light_Wrench:#f57e42', danger: true, tooltip: 'tooltip内容'},
  ]}
/>

鼠标或键盘抬起会自动关菜单。若动作是点出来的，显示菜单前先等一会儿，避免抬起鼠标时菜单立刻被关掉。（[讨论](https://getquicker.net/QA/Question/10669)）

## 参数说明

<ModuleParamPreview
  moduleKey="sys:showmenu"
  values={{
    menuData: '////注释内容\n无图标菜单|_qk_menu_no_icon\n带Tooltip的菜单(tooltip内容)|_qk_menu_tooltip\n[fa:Light_Flag]带图标的菜单(tooltip内容)|_qk_menu_icon_menu\n[+][fa:Light_Cog]二级菜单(提示内容...)\n[-][fa:Light_UserCircle]子菜单|_qk_menu_submenu\n[fa:Light_Wrench:#f57e42]危险动作菜单(tooltip内容)|_qk_menu_sample',
    fontsize: '16',
    waitMenuClose: 'true',
  }}
  outputVars={{
    isSuccess: 'isSuccess',
    selectedItemData: 'selectedItemData',
    selectedItem: 'selectedItem',
  }}
/>

**菜单数据**：菜单定义，支持下面四种格式。

支持四种类型的数据：

**（1）文本格式**（与 [动作右键菜单定义](/v2/xaction/concepts/action-custom-context-menu) 相近）：

与动作右键菜单不同的是，动作右键菜单仅支持返回一个文本数据作为参数返回给动作。

这种方式只支持一级子菜单。

```text
////注释内容。
Ping百度|operation=run&data=ping baidu.com
//// ----表示分隔符
----
只有Data的菜单(返回结果后使用)|只有data数据
[fa:Light_Paste]粘贴内容(tooltip内容)|operation=paste&data=要粘贴的内容
[+][fa:Light_Cog]二级菜单(提示内容...)
[-][fa:Light_Save]发送按键Ctrl+S(模拟保存)|operation=sendkeys&data=^s
[-][fa:Light_Paste]发送按键Ctrl+V(模拟粘贴)|operation=sendkeys&data=^v
[fa:Light_Wrench:#f57e42]运行一个Quicker动作(tooltip内容)|operation=action&action=动作名称
```

说明：

-   //// 开始的内容为注释；
-   \---- 为分隔符；
-   \[+\]开始的行为父菜单；
-   \[-\]开始的行为子菜单项；
-   每一项通过分隔符（默认为“|”，可以在首行使用“|=新分隔符”的方式更改）分为标题部分和值部分。
-   标题部分：遵循格式“\[图标\]标题(Tooltip内容)”，其中“\[图标\]”和“(Tooltip)”内容是可选的。
-   内容部分：如果不需要执行操作，可以直接写菜单项的数据（分隔符|后面的内容整体作为模块输出）。如果需要执行操作，使用这样的格式：`operation=操作类型&data=数据内容&action=要执行的动作`。对于包含特殊字符的内容，需要进行URL编码才能正常传递。
-   支持的operation类型请参考CommonOperationItem对象的文档说明。

**（2）文本缩进格式**

使用空格或tab缩进表示菜单层级。需Quicker版本1.34.27+

-   只能使用空格或tab中的一种。
-   可以使用一个或多个空格或tab表示缩进。

```text
[fa:Light_Paste]粘贴内容(tooltip内容)|operation=paste&data=要粘贴的内容
[fa:Light_Cog]二级菜单(提示内容...)
  [fa:Light_Save]发送按键Ctrl+S(模拟保存)|operation=sendkeys&data=^s
  [fa:Light_Paste]发送按键Ctrl+V(模拟粘贴)|operation=sendkeys&data=^v
  三级菜单
    [fa:Light_Cog]菜单1(提示内容...)
[fa:Light_Wrench:#f57e42]运行一个Quicker动作(tooltip内容)|operation=action&action=动作名称
```

<ContextMenuPreview
  openPath={['二级菜单', '三级菜单']}
  items={[
    {label: '粘贴内容', icon: 'fa:Light_Paste'},
    {
      label: '二级菜单',
      icon: 'fa:Light_Cog',
      children: [
        {label: '发送按键Ctrl+S', icon: 'fa:Light_Save'},
        {label: '发送按键Ctrl+V', icon: 'fa:Light_Paste'},
        {label: '三级菜单', children: [{label: '菜单1', icon: 'fa:Light_Cog'}]},
      ],
    },
    {label: '运行一个Quicker动作', icon: 'fa:Light_Wrench:#f57e42'},
  ]}
/>

注意：当`data`的参数值中包含特殊字符，如`+`时，必须对参数值进行URL编码。 参考：[讨论话题](https://getquicker.net/Common/Topics/ViewTopic/29658)

**（3）CommonOperationItem对象列表的JSON序列化文本。**

-   支持多级菜单。

-   IsSeparator=true时，表示是一条分割线。
-   子菜单存放在Children属性中。

示例：

```json
[{
  "Title": "Ping baidu",
  "Description": "屏Ping百度",
  "Icon": "fa:Light_Pen",
  "Data": "ping baidu.com",
  "DataType": null,
  "Operation": "run",
  "Action": null,
  "IsSeparator": false,
  "OriginText": null,
  "ExtraData": null,
  "Children": null
}, {
  "Title": null,
  "Description": null,
  "Icon": null,
  "Data": null,
  "DataType": null,
  "Operation": null,
  "Action": null,
  "IsSeparator": true,
  "OriginText": null,
  "ExtraData": null,
  "Children": null
}, {
  "Title": "快搜",
  "Description": "屏Ping百度",
  "Icon": "fa:Light_Search",
  "Data": "",
  "DataType": null,
  "Operation": "action",
  "Action": "快搜",
  "IsSeparator": false,
  "OriginText": null,
  "ExtraData": null,
  "Children": null
}, {
  "Title": "多级菜单",
  "Description": null,
  "Icon": "fa:Light_Search",
  "Data": "",
  "DataType": null,
  "Operation": null,
  "Action": null,
  "IsSeparator": false,
  "OriginText": null,
  "ExtraData": null,
  "Children": [{
    "Title": "Ping baidu",
    "Description": "屏Ping百度",
    "Icon": "fa:Light_Pen",
    "Data": "ping baidu.com",
    "DataType": null,
    "Operation": "run",
    "Action": null,
    "IsSeparator": false,
    "OriginText": null,
    "ExtraData": null,
    "Children": null
  }, {
    "Title": null,
    "Description": null,
    "Icon": null,
    "Data": null,
    "DataType": null,
    "Operation": null,
    "Action": null,
    "IsSeparator": true,
    "OriginText": null,
    "ExtraData": null,
    "Children": null
  }, {
    "Title": "快搜",
    "Description": "屏Ping百度",
    "Icon": "fa:Light_Search",
    "Data": "",
    "DataType": null,
    "Operation": "action",
    "Action": "快搜",
    "IsSeparator": false,
    "OriginText": null,
    "ExtraData": null,
    "Children": null
  }, {
    "Title": "多级菜单",
    "Description": null,
    "Icon": "fa:Light_Search",
    "Data": "",
    "DataType": null,
    "Operation": null,
    "Action": null,
    "IsSeparator": false,
    "OriginText": null,
    "ExtraData": null,
    "Children": [{
      "Title": "Ping baidu",
      "Description": "屏Ping百度",
      "Icon": "fa:Light_Pen",
      "Data": "ping baidu.com",
      "DataType": null,
      "Operation": "run",
      "Action": null,
      "IsSeparator": false,
      "OriginText": null,
      "ExtraData": null,
      "Children": null
    }, {
      "Title": null,
      "Description": null,
      "Icon": null,
      "Data": null,
      "DataType": null,
      "Operation": null,
      "Action": null,
      "IsSeparator": true,
      "OriginText": null,
      "ExtraData": null,
      "Children": null
    }, {
      "Title": "快搜",
      "Description": "屏Ping百度",
      "Icon": "fa:Light_Search",
      "Data": "",
      "DataType": null,
      "Operation": "action",
      "Action": "快搜",
      "IsSeparator": false,
      "OriginText": null,
      "ExtraData": null,
      "Children": null
    }, {
      "Title": "多级菜单",
      "Description": null,
      "Icon": "fa:Light_Search",
      "Data": "",
      "DataType": null,
      "Operation": null,
      "Action": null,
      "IsSeparator": false,
      "OriginText": null,
      "ExtraData": null,
      "Children": []
    }]
  }]
}]
```

**（4）CommonOperationItem列表对象。**

例如，通过表达式生成操作菜单的列表。

```csharp
$=
  var items =  new List<CommonOperationItem>(){
  new CommonOperationItem(){
    Title = "Ping baidu",
    Data="ping baidu.com",
    Icon="fa:Light_Pen",
    Operation="run",
    Description="屏Ping百度"},
  new CommonOperationItem(){ IsSeparator = true},
  new CommonOperationItem(){
    Title = "快搜",
    Data="",
    Icon="fa:Light_Search",
    Operation="action",
    Action="快搜",
    Description="屏Ping百度"},
  new CommonOperationItem(){
    Title = "多级菜单",
    Data="",
    Icon="fa:Light_Search",
    Children = new List<CommonOperationItem>(){
      new CommonOperationItem(){
        Title = "Ping baidu",
        Data="ping baidu.com",
        Icon="fa:Light_Pen",
        Operation="run",
        Description="屏Ping百度"},
      new CommonOperationItem(){ IsSeparator = true},
      new CommonOperationItem(){
        Title = "快搜",
        Data="",
        Icon="fa:Light_Search",
        Operation="action",
        Action="快搜",
        Description="屏Ping百度"},
      new CommonOperationItem(){
        Title = "多级菜单",
        Data="",
        Icon="fa:Light_Search",
        Children = new List<CommonOperationItem>(){
          new CommonOperationItem(){
            Title = "Ping baidu",
            Data="ping baidu.com",
            Icon="fa:Light_Pen",
            Operation="run",
            Description="屏Ping百度"},
          new CommonOperationItem(){ IsSeparator = true},
          new CommonOperationItem(){
            Title = "快搜",
            Data="",
            Icon="fa:Light_Search",
            Operation="action",
            Action="快搜",
            Description="屏Ping百度"},
          new CommonOperationItem(){
            Title = "多级菜单",
            Data="",
            Icon="fa:Light_Search",
            Children = new List<CommonOperationItem>(){

            }}

        }}
    }}

};

return items;
```

**字体大小**：菜单文字大小。默认 12。

**图标大小**：图标宽高像素。默认 16。

**最大高度**：百分比（如 `50%`）或固定像素（如 `500`）。`0` 不限制。

**等待菜单关闭**：是否等菜单关掉再跑后面的步骤。默认开启。

**占用焦点**：是否让菜单占用焦点，从而可用键盘选择。默认关闭。

**失败后停止**：在「等待菜单关闭」时，用户没点菜单是否中止动作。默认开启。

## 输出

- **是否成功**：在「等待菜单关闭」时，用户是否点了菜单项。
- **选择的菜单项数据**：该项的 data。第一种文本格式若没写 data，则返回标题。
- **选择的菜单项**：对应的 CommonOperationItem 对象。
- **点击按钮**：`Left` 或 `Right`。

## 示例动作

<StepProgramView example="a2933deb-ebe7-4895-69d4-08d992b19cae" />

<ShareLinkCard
  code="a2933deb-ebe7-4895-69d4-08d992b19cae"
  title="菜单模块测试"
  description="显示菜单模块示例"
  author="CL"
/>

<StepProgramView example="186c9f3f-46d4-4f63-00b9-08db56e12efe" />

<ShareLinkCard
  code="186c9f3f-46d4-4f63-00b9-08db56e12efe"
  title="示例：菜单调用子程序传递参数"
  description="通过显示菜单调用子程序并传递参数"
  author="CL"
/>

## CommonOperationItem 对象

在Quicker内部用于表示一个通用的操作条目。其定义如下：

```csharp
 public class CommonOperationItem
 {

        /// <summary>
        /// 标题文字，用于显示
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 描述文字，通常显示为tooltip
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 图标，格式请参考文档说明。
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// 数据内容
        /// </summary>
        public string Data { get; set; }

        /// <summary>
        /// 内部数据类型
        /// </summary>
        public string DataType { get; set; }

        /// <summary>
        /// 通常用于保存对Data内容的操作类型。
        /// <see cref="CommonOperationTypes">通用操作类型</see>
        /// </summary>
        public string Operation { get; set; }

        /// <summary>
        /// 要触发的动作id或名称
        /// </summary>
        public string Action { get; set; }

        /// <summary>
        /// 是否是分隔线
        /// </summary>
        public bool IsSeparator { get; set; }

        /// <summary>
        /// 从文本解析操作项时，被解析的原始文本
        /// </summary>
        public string OriginText { get; set; }

        /// <summary>
        /// 扩展数据
        /// </summary>
        public IDictionary<string, object> ExtraData { get; set; }

        /// <summary>
        /// 子项，也可做子菜单使用
        /// </summary>
        public IList<CommonOperationItem> Children { get; set; }
 }
```

### 支持的Operation类型

-   copy：复制，将data中的内容复制到剪贴板。
-   paste：粘贴，将data中的内容复制到剪贴板后粘贴到当前窗口（模拟Ctrl+V）。
-   pastefile：粘贴文件，data作为文件路径，将文件复制到剪贴板后，粘贴到当前窗口（模拟Ctrl+V）。
-   pasteimage：粘贴图片，data作为图片路径，读取图片并放入剪贴板后，粘贴到当前窗口（模拟Ctrl+V）。
-   run：运行，将data作为命令执行。可以为文件、网址、命令等可以在Win+R窗口中运行的命令。
-   sendkeys：将data作为模拟按键B的内容模拟输入。
-   inputtext：模拟输入文本内容。
-   action：运行动作。此时通过Action参数给出动作ID或（没有重复的）名称，1.36.22版本后，也可以使用`_this_`表示当前动作。data中的内容作为参数传递给动作。
-   selectfile：在资源管理器中选择文件。
-   open: 打开文件或网址（通过data参数指定）；
-   sp: 执行子程序。此时通过spname参数传入要执行的子程序名称。
-   none：不执行任何操作。
-   inputscript: 多步骤输入。 如果无法使用多行方式传入data内容，也可以在一行中填写，并使用`;;`表示换行。(1.36.17+)

CommonOperationItem 支持如下的静态方法：

-   ParseLine：解析一行文本数据“\[图标\]标题(Tooltip)|operation=run&data=内容”，返回一个ComonOperationItem对象。
-   ParseLines：解析多行文本数据，返回CommonOperationItem的列表。不支持子项。
-   ParseLinesWithSubItems：解析多行文本数据，支持\[+\]\[-\]前缀声明父项和子项。请参考本文档中菜单数据的第一种格式。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/userselect',
      label: '用户选择',
      description: '列表选择，支持键盘。',
    },
    {
      href: '/v2/xaction/concepts/action-custom-context-menu',
      label: '动作右键菜单',
      description: '第一种文本格式与这里相近。',
    },
  ]}
/>

## 更新说明

- 20221229：增加 operation 类型：open / sp / none / inputscript。
- 20230106：1.36.22 `operation=action` 时可用 `action=_this_` 表示当前动作。
- 20230426：增加 pastefile 和 pasteimage 的说明。
- 20230518：增加调用子程序示例动作。
