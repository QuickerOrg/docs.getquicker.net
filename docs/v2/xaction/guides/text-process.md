---
title: 文本的处理
description: 组合动作里文本从哪来、怎么处理、写到哪里：选区、剪贴板、文件，以及插值和常用模块。
slug: "/v2/xaction/guides/text-process"
sidebar_position: 50
quickerDocKey: "xaction/guides/text-process"
comments: true
docStatus: reviewed
legacyDocId: 1460424
legacyContentUpdatedAt: "2025-12-05T02:18:14.000Z"
---

# 文本的处理

处理文本时，先想清楚三件事：从哪取、做哪一种变换、写到哪。动手例子见 [第 2 课：把选中文字变成大写](./selected-text.md)。

<FlowChart
  layout="row"
  caption="文本在动作里走的路径"
  steps={['获取', '处理', '输出']}
/>

## 获取

| 模块 | 典型用途 |
| --- | --- |
| [获取选中的文本](/v2/xaction/modules/get_selected_text) | 当前窗口里的选区；拼网址时用它的 **URL 编码的内容** |
| [获取剪贴板文本](/v2/xaction/modules/getclipboardtext) | 已经在剪贴板里的文字 |
| [读取文件](/v2/xaction/modules/readfile) | 从文本文件读入变量 |
| [获取选择的文件(夹)](/v2/xaction/modules/getselectedfiles) | 资源管理器或桌面里选中的文件路径列表 |
| [用户输入](/v2/xaction/modules/userinput) | 运行时弹出输入框 |

## 处理

| 做法 | 何时用 |
| --- | --- |
| [文本插值](/v2/xaction/concepts/interpolation) `$$` | 把变量嵌进一段模板，例如搜索地址 |
| [组合成文本](/v2/xaction/modules/formatstring) | 多段、多变量拼成较长文本 |
| [文本处理](/v2/xaction/modules/stringprocess) | 大小写、截取、去空白、编解码 |
| [替换文本](/v2/xaction/modules/strreplace) | 只替换某段内容（字面量或正则） |
| [正则提取](/v2/xaction/modules/regexextract) | 从一段文本里抽出匹配部分 |
| [拆分文本为列表](/v2/xaction/modules/splitstring) | 按换行或分隔符拆开，再交给「每个」 |
| [比较文本](/v2/xaction/modules/strcompare) | 比较两个字符串 |
| [提取HTML内容](/v2/xaction/modules/htmlextract) | 从 HTML 里取正文或属性 |

## 输出

| 模块 | 典型用途 |
| --- | --- |
| [发送文本到窗口](/v2/xaction/modules/outputtext) | 写回当前输入框 |
| [写入剪贴板](/v2/xaction/modules/writeclipboard) | 供之后手动粘贴，或给其它程序用 |
| [写入文本文件](/v2/xaction/modules/writetextfile) | 保存到磁盘 |
| [提示消息](/v2/xaction/modules/notify) / [文本窗口](/v2/xaction/modules/showtext) | 只给自己看结果 |
| [状态存取](/v2/xaction/modules/statestorage) | 留给这个动作下次运行 |

## 一条完整的链

选中文字 → 转大写 → 写回窗口：

<StepProgramView
  caption="选中文字转大写"
  showVariables
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText'},
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

有选区才搜索、没有则打开首页，见 [第 3 课](./search-selected.md)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/guides/selected-text',
      label: '第 2 课：处理选中文字',
      description: '按步骤搭出上面这条链',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 把变量嵌进模板',
    },
    {
      href: '/v2/xaction/concepts/variables',
      label: '变量',
      description: '步骤之间怎么传数据',
    },
    {
      href: '/v2/xaction/modules',
      label: '模块参考',
      description: '全部步骤的参数表',
    },
  ]}
/>
