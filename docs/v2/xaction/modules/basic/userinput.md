---
title: "用户输入"
description: "请用户输入内容。"
slug: "/v2/xaction/modules/userinput"
sidebar_label: "用户输入"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:userInput"
comments: true
moduleKey: "sys:userInput"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1460412
legacyContentUpdatedAt: "2024-10-29T00:17:04.000Z"
---

# 用户输入

弹出一个输入窗口，等用户填完再继续。一次只收一个值。要同时填多项，或用下拉等控件，请用 [多字段表单](/v2/xaction/modules/form)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:userInput" />

## 概述

<PreviewMarks
  marks={[
    {key: 'prompt', label: '提示文字'},
    {key: 'defaultValue', label: '默认值 / 用户输入的内容'},
    {key: 'texttools', label: '选择工具'},
    {key: 'help', label: '帮助按钮，Markdown 提示'},
  ]}
>
  <UserInputPreview
    title="test1234"
    prompt="请选择程序路径"
    value={"d:\\test.exe"}
    texttools="SelectProcessPath,SelectSingleFolder,ExtraSelectMenu"
    activeTool="SelectProcessPath"
    showHelp
    showToolTooltip
  />
</PreviewMarks>

<ModuleParamPreview
  moduleKey="sys:userInput"
  values={{
    type: 'text',
    prompt: '请选择程序路径',
    defaultValue: 'd:\\test.exe',
    isRequired: 'true',
    restoreFocus: 'true',
    stopIfFail: 'true',
    fontsize: '14',
  }}
  outputVars={{textValue: 'text'}}
/>

## 参数说明

**类型**：单行文本、多行文本、数字、日期时间。

**提示文字**：显示在输入框上方。

**默认值**：预先填进输入框。

**验证表达式**：正则。仅单行、多行、数字时可用。

**必填**：不填不能保存。非必填时允许空值保存（1.1.0+）。

**文本选择工具**：鼠标悬停输入框时，右侧出现选文件、进程路径等小按钮。仅单行、多行。

**扩展设置**：自定义文本选择工具时用。仅单行、多行。

**恢复活动窗口**：关掉输入窗后把焦点还给弹出前的窗口。后面还要对原窗口操作时请打开。

**失去焦点后关闭窗口**：点到窗外就关并取消。

**回车提交结果（Shift+回车换行）**：仅多行。回车保存，Shift+回车换行。

**失败后停止**：用户取消后是否中止动作。默认开启。

**置顶显示**：输入窗口是否总在最前。

**字体名称** / **字体大小**：输入框字体。多个字体名用逗号分隔。

**窗口位置**：跟随鼠标或屏幕各方位。

**输入法状态**：是否强制开/关中文输入。仅单行、多行。

**帮助按钮内容**：Markdown。两个空格换行；`[标题](网址)` 写链接。语法见 [MdXaml 扩展说明](https://github.com/whistyun/MdXaml/wiki/How-to-use-Enhanched-syntax)。

## 输出

- **是否成功**：是否拿到了输入。
- **文本值**：文字内容。
- **数字值**：仅类型为数字。
- **日期时间值**：仅类型为日期时间。
- **是否为空**：用户什么都没填。

## 示例动作

<StepProgramView example="c6da399c-c64f-468a-6d89-08d6bfa4ff29" />

<ShareLinkCard
  code="c6da399c-c64f-468a-6d89-08d6bfa4ff29"
  title="示例：用户输入"
  description="演示用户输入模块"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/form',
      label: '多字段表单',
      description: '一次收集多个字段，或用下拉等控件。',
    },
    {
      href: '/v2/xaction/modules/userselect',
      label: '用户选择',
      description: '从列表里选，而不是手打。',
    },
    {
      href: '/v2/xaction/modules/restoreactivewindow',
      label: '恢复活动窗口',
      description: '输入窗抢过焦点时再还回去。',
    },
  ]}
/>

## 更新历史

- 1.1.0：增加「必填」。
- 20241029：帮助按钮补充 Markdown 扩展语法链接。
