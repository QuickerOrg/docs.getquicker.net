---
title: "选择或输入步骤参数"
description: "参数可写固定值、$$ 插值或 $= 表达式；F1 在三种模式间切换。"
slug: "/v2/xaction/concepts/edit-step-param"
sidebar_position: 40
quickerDocKey: "xaction/concepts/edit-step-param"
comments: true
docStatus: reviewed
legacyDocId: 44569803
legacyContentUpdatedAt: "2021-06-08T03:30:30.000Z"
---

# 选择或输入步骤参数

步骤参数可以绑变量，也可以在输入框里写三种内容。在输入框里按 **F1**，会在这三种模式之间循环切换：

| 模式 | 开头 | 用途 |
| --- | --- | --- |
| 原始值 | 无 | 把框里的字原样交给参数 |
| 插值 | `$$` | 把 `{变量}` 嵌进文本，见 [文本插值](/v2/xaction/concepts/interpolation) |
| 表达式 | `$=` | 用表达式计算结果，见 [表达式](/v2/xaction/concepts/expression) |

**Ctrl+Shift+C**：连同 `$$` / `$=` 标记一起复制框里的全部内容。

## 原始值

直接写网址、毫秒数、消息文本等。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  values={{url: 'https://www.google.com'}}
  focusKeys={['url']}
/>

## 插值

以 `$$` 开头，用 `{变量名}` 拼进文本。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  values={{url: '$$https://www.google.com/search?q={selectedText}'}}
  focusKeys={['url']}
/>

## 表达式

以 `$=` 开头，写判断或计算。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {count} > 2'}}
  focusKeys={['condition']}
/>

布尔类型参数也可以直接绑一个布尔变量，不必写 `$=`。

<ModuleParamPreview
  moduleKey="sys:if"
  inputVars={{condition: 'selectSuccess'}}
  focusKeys={['condition']}
/>

## 不离开步骤窗口编辑变量

2.2.11 起，可从步骤编辑窗口的变量菜单新增或修改定义，改名同步更新程序内引用。网页步骤弹层中，Escape 会优先关闭类型下拉并恢复焦点。

变量确认与步骤确认是两次独立操作：已保存的变量修改不会随取消步骤而撤销。详细规则见 [在步骤窗口中编辑变量](/v2/xaction/concepts/variables#在步骤窗口中编辑变量)。

<a id="开发中旧参数与子程序接口" />

## 2.3.6 · 旧参数与子程序接口

以下功能从 **2.3.6** 起可用。

编辑「运行子程序」步骤并确认时，如果已成功读取子程序定义，会清理已不存在的输入或输出接口所留下的参数；仍在定义中、只是被显示条件隐藏的参数不会因此删除。无法读取定义时，不会按未知接口清理旧内容。更新子程序后，请检查每个调用步骤的输入值与输出绑定，再试运行并保存动作。

旧动作中，普通模块参数键名若只有大小写与当前定义不同，编辑器会兼容显示旧值；明确修改该输入或输出并确认后，才改用当前定义的准确键名，未编辑项保留原数据。**子程序的变量名按准确名称匹配**，不能把大小写变化或改名当作普通模块的兼容规则；更改接口名称后仍需重新绑定调用步骤，见[子程序定义与参数](/v2/xaction/concepts/subprogram#定义与参数)。

这些处理发生在相应步骤的编辑与保存流程中，不会批量迁移其他动作，也不表示可以删除所有隐藏参数或默认值。

## 限制与排障

- 忘了加 `$$` 或 `$=` 时，`{变量名}` 会当普通文字送出去，不会替换。用 F1 切到对应模式。
- 复制到别处时若丢掉了开头标记，用 **Ctrl+Shift+C**，不要只用普通复制。
- 输入框里的右键「在编辑器中修改」、外部编辑器和插入变量，见 [模块和步骤](/v2/xaction/concepts/basic)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/basic',
      label: '模块和步骤',
      description: '输入绑变量还是写固定值',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 的替换规则和转义',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '$= 运算符、方法和补全',
    },
    {
      href: '/v2/xaction/concepts/parameters',
      label: '参数传递',
      description: '步骤之间数据怎么流',
    },
  ]}
/>
