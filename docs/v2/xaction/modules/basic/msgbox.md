---
title: "弹窗提示或确认"
description: "弹窗显示提示或确认对话框"
slug: "/v2/xaction/modules/msgbox"
sidebar_label: "弹窗提示或确认"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:MsgBox"
comments: true
moduleKey: "sys:MsgBox"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1529960
legacyContentUpdatedAt: "2024-10-29T00:01:11.000Z"
---

# 弹窗提示或确认

显示一个占用焦点的提示或确认对话框。关闭前会一直停在屏幕上，动作也停在这一步，等用户点完再继续。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:MsgBox" />

<MsgBoxPreview
  title="Quicker"
  icon="question"
  message={"Hello. 你好，这是一条弹窗提示消息。\n两个结果选一个哦~"}
  buttons={['确定', '取消']}
/>

两种模式：

- **标准**：类似 Windows 内置弹窗，图标和按钮是固定组合。
- **自定义**：可自定图标和按钮；内容更灵活，也支持 Markdown。

## 标准模式

<PreviewMap
  links={[
    {from: 'title', to: 'title'},
    {from: 'message', to: 'message'},
    {from: 'icon', to: 'icon'},
    {from: 'buttons', to: 'buttons'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:MsgBox"
    scrollBody={false}
    values={{
      operation: 'default',
      message: '这是一个提示消息。',
      title: '提示',
      icon: 'Warning',
      buttons: 'OKCancel',
      restoreFocus: 'true',
    }}
    outputVars={{result: 'ABC result'}}
  />
  <MsgBoxPreview
    title="提示"
    icon="warning"
    message="这是一个提示消息。"
    buttons={['确定', '取消']}
  />
</PreviewMap>

**恢复活动窗口**：关闭后是否把焦点还给弹窗前的窗口。

输出：

- **选择的按钮**：`OK`、`Cancel`、`Yes`、`No`
- **是否确认**：点的是「确定」或「是」

## 自定义模式

<PreviewMap
  links={[
    {from: 'actionIcon', to: 'actionIcon'},
    {from: 'title', to: 'title'},
    {from: 'message', to: 'message'},
    {from: 'customIcon', to: 'icon'},
    {from: 'customButtons', to: 'buttons'},
    {from: 'defaultButton', to: 'primaryButton'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:MsgBox"
    actionIcon="fa:Light_CommentAltLines"
    scrollBody={false}
    values={{
      operation: 'custom',
      message: '你好，这是一条自定义弹窗提示消息。第二行。',
      title: '保存信息',
      customIcon: 'fa:Solid_InfoCircle:#FF0000',
      customButtons: '[fa:Light_Check:#28a745]是(_Y)|Yes\n[fa:Light_Times:#dc3545]否(_N)|No\n[fa:Light_Undo:#28a745]取消(_C)|Cancel',
      defaultButton: 'Yes',
    }}
    outputVars={{result: 'ABC result'}}
  />
  <MsgBoxPreview
    title="保存信息"
    actionIcon="fa:Light_CommentAltLines"
    icon="fa:Solid_InfoCircle:#FF0000"
    message={"你好，这是一条自定义弹窗提示消息。第二行。"}
    buttonDefs={'[fa:Light_Check:#28a745]是(_Y)|Yes\n[fa:Light_Times:#dc3545]否(_N)|No\n[fa:Light_Undo:#28a745]取消(_C)|Cancel'}
    defaultButton="Yes"
  />
</PreviewMap>

自定义模式下，消息内容以 `MD:`（半角冒号）开头可写 Markdown（1.39.20+）。语法见 [MdXaml 扩展说明](https://github.com/whistyun/MdXaml/wiki/How-to-use-Enhanched-syntax)。

**图标**：可选预定义名称，或直接输入 Quicker [自定义图标](/v2/xaction/concepts/use-icon-in-actions)（不要加中括号）。

<PreviewMarks
  marks={[
    {key: 'customIcon', label: '可选预定义特殊图标，或直接输入图标定义'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:MsgBox"
    scrollBody={false}
    focusKeys={['customIcon']}
    values={{
      operation: 'custom',
      customIcon: 'fa:Solid_InfoCircle:#FF0000',
    }}
  />
</PreviewMarks>

**按钮**：每行一个，格式与[用户选择](/v2/xaction/modules/userselect)的选项类似：

- `标题`：值与标题相同
- `标题|值`
- `[图标]标题(_X)(提示文字)|值`

`_C` 表示快捷键 `Alt+C`。

**默认按钮**：填按钮的**值**（会高亮，回车即选）。

输出 **选择的按钮** 为所点按钮的值；未选则为空。

## 示例动作

<StepProgramView example="b6098426-6fda-4db9-6d88-08d6bfa4ff29" />

<ShareLinkCard
  code="b6098426-6fda-4db9-6d88-08d6bfa4ff29"
  title="示例：弹窗消息"
  description="用于演示弹窗消息模块"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/notify',
      label: '提示消息',
      description: '不打断动作、自动消失的轻提示。',
    },
    {
      href: '/v2/xaction/modules/userselect',
      label: '用户选择',
      description: '自定义按钮的格式和这里类似。',
    },
    {
      href: '/v2/xaction/concepts/use-icon-in-actions',
      label: '在动作中使用图标',
      description: '自定义模式的图标写法。',
    },
  ]}
/>

## 更新历史

- 20230617 v1.38.21：增加自定义模式。
- 20230713：补充图标格式无需中括号的说明。
- 20230904 1.39.20：自定义模式支持 Markdown 内容。
- 20241029：增加 Markdown 扩展语法文档链接。
