---
title: 把选中文字变成大写
description: 用获取选中的文本、文本处理和发送文本到窗口，把当前选区变成英文大写并写回。
slug: "/v2/xaction/guides/selected-text"
sidebar_label: 第 2 课：处理选中文字
sidebar_position: 21
quickerDocKey: "xaction/guides/selected-text"
comments: true
docStatus: reviewed
---

# 把选中文字变成大写

上一课只显示固定文字。这一课让动作去处理**当前窗口里选中的内容**：取出 → 转成英文大写 → 写回原处。这是组合动作最常见的一条链。

<FlowChart
  layout="row"
  caption="取词、处理、写回"
  steps={['获取选中的文本', '英文转大写', '发送文本到窗口']}
/>

请先完成 [第 1 课](./helloworld.md)，会新建组合动作即可。本课新建一个动作，标题可用 `选中转大写`。

## 完成后的步骤

<StepProgramView
  caption="选中文字转大写"
  showVariables
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'ok'},
      },
      {
        key: 'sys:stringProcess',
        inputs: {data: '{selectedText}', method: 'toUpper'},
        outputs: {output: 'resultText'},
      },
      {
        key: 'sys:outputText',
        inputs: {content: '{resultText}'},
      },
    ],
  }}
/>

在输出框里填写新变量名即可，不必先在右侧手动创建。保存步骤后，变量会出现在右侧列表。

## 第 1 步：获取选中的文本

工具箱搜索「选中」，拖入 **获取选中的文本**。

把 **内容** 输出到变量 `selectedText`。**是否成功** 可输出到 `ok`（本课可以不用它，留着方便以后加判断）。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  outputVars={{output: 'selectedText', isSuccess: 'ok'}}
  focusKeys={['output', 'isSuccess']}
/>

这个模块默认向当前窗口发送 **Ctrl+C**，再从剪贴板读取。因此：

- 运行前要先在目标窗口里选中文字，再点动作（或给动作设快捷键）。
- 会短暂改写剪贴板。不想动剪贴板时，可勾 **尝试不通过剪贴板的方式获取**，兼容性较差，见 [获取选中的文本](/v2/xaction/modules/get_selected_text)。

**失败后中止动作** 默认开启。本课保持默认即可：没选中文字时，后面两步不会跑。

## 第 2 步：英文转大写

再拖入 **文本处理**（**文本处理** 分类，模块名也叫「文本处理」）。

- **待处理内容**：绑变量 `selectedText`（在变量下拉里选，不要把 `{selectedText}` 当普通字填进去却忘了切换模式）。
- **处理**：选 **英文转大写**。
- **结果**：输出到 `resultText`。

<ModuleParamPreview
  moduleKey="sys:stringProcess"
  inputVars={{data: 'selectedText'}}
  values={{method: 'toUpper'}}
  outputVars={{output: 'resultText'}}
  focusKeys={['data', 'method', 'output']}
/>

这一步只改英文字母大小写，中文、数字一般原样保留。其它截取、去空白、编解码见 [文本处理](/v2/xaction/modules/stringprocess)。

## 第 3 步：发回窗口

在 **基础** 分类拖入 **发送文本到窗口**，把要发送的内容绑到 `resultText`。

<ModuleParamPreview
  moduleKey="sys:outputText"
  inputVars={{content: 'resultText'}}
  focusKeys={['content', 'method']}
/>

**方法** 默认是复制后 **Ctrl+V**，适合大多数软件。目标窗口要处于可输入状态。Excel / WPS 若正在编辑单元格，先退出编辑再发送，见模块页说明。

## 运行

1. 保存动作。
2. 在记事本、浏览器地址栏或任意文本框里选中一段英文，例如 `hello quicker`。
3. 弹出面板，运行这个动作。

选区应变为 `HELLO QUICKER`。若没变化，看下一节。

## 限制与排障

- 没选中文字：默认会在第一步中止。先选中再运行。
- 选中了但结果不对：确认文本处理的 **待处理内容** 绑的是 `selectedText`，发送模块绑的是 `resultText`，而不是仍发送原文。
- 某些软件吃不下模拟的 Ctrl+C：加大 **等待剪贴板时间**，或改用 UI Automation 方式。PDF、远程桌面里更常见。
- 写回时焦点已经不在原窗口：用快捷键触发通常比先点面板更稳，因为点面板可能抢走焦点。也可先看 [恢复活动窗口](/v2/xaction/modules/restoreactivewindow)。

取词、处理和输出的其它模块，见 [文本的处理](./text-process.md)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/guides/search-selected',
      label: '第 3 课：按条件搜索',
      description: '有选区就搜索，没有就打开首页',
    },
    {
      href: '/v2/xaction/modules/get_selected_text',
      label: '获取选中的文本',
      description: 'Ctrl+C、等待时间和失败后中止',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '大小写、截取、编解码',
    },
    {
      href: '/v2/xaction/modules/outputtext',
      label: '发送文本到窗口',
      description: '粘贴或模拟键入',
    },
  ]}
/>
