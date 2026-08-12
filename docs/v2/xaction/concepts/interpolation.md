---
title: "文本插值"
description: "参数以 $$ 开头时，用变量值替换 {变量名}，得到一段新文本。"
slug: "/v2/xaction/concepts/interpolation"
sidebar_position: 110
quickerDocKey: "xaction/concepts/interpolation"
comments: true
docStatus: reviewed
legacyDocId: 1402273
legacyContentUpdatedAt: "2025-12-05T02:20:08.000Z"
---

# 文本插值

插值用变量的内容替换文本里的 `{变量名}`，结果仍是一段文本。

参数输入框**整段最前面**写 `$$` 时（不是每一行前面），对后面的内容做插值，并去掉开头的 `$$`。

<ModuleParamPreview
  moduleKey="sys:notify"
  values={{msg: '$$你好，{Text}！'}}
  focusKeys={['msg']}
/>

若 `{Text}` 是 `Quicker`，结果是 `你好，Quicker！`。

插值后可能还会再处理一次，见 [参数传递](/v2/xaction/concepts/parameters)。

## 写法

| 场景 | 写法 |
| --- | --- |
| 普通变量 | `$$你好，{Text}！` |
| 词典 | `$${词典变量["key1"]}` 或 `$${词典变量.key1}` |
| 列表（序号从 0） | `$${列表变量[0]}` 或 `$${列表变量.0}` |
| 剪贴板文本 | `$${[cliptext]}` |

列表、词典用 `.序号` / `.键` 时，中间不能有空格。

## 变量表达式（1.9.5+）

输出前对变量做一点处理：

- `{变量.方法()}`，如 `{文本变量.UrlEncode()}`。文本类型额外支持 `UrlEncode()` / `UrlDecode()`，其它方法跟对应的 C# 类型走。
- `{变量[下标或键]...}`，如 `{列表变量[0].ToUpper().UrlEncode()}`、`{词典变量["key1"].ToString().ToUpper()}`。
- `{表达式=}` 会先算表达式（里面尽量不要再套动作变量，否则改名时找不到）：`{3+3=}` → `6`；`{DateTime.Now.ToString("yyyy-MM-dd")=}`。

<StepProgramView example="aa38d2b9-f95b-4a91-d713-08d827485760" />

<ShareLinkCard
  code="aa38d2b9-f95b-4a91-d713-08d827485760"
  title="插值测试"
/>

## 嵌套（1.4.22+）

插值结果若以 `$$` 或 `$=` 开头，会再处理一次：

- `$$$$…`：插值后再插值。
- `$$$=…`：插值后再做表达式。
- 不支持先表达式再插值（不要写 `$="$${变量}"`）。

更长的拼接可用 [组合成文本](/v2/xaction/modules/formatstring)。

## 限制与排障

- `{}` 里前后不能有空格：`{ xxx}`、`{xxx }` 都不会替换。
- `{}` 里不能再出现 `{` 或 `}`。
- 变量名必须紧跟 `{`，后面只能是 `}`、`.` 或 `[`。一对 `{}` 里只用一个变量。
- 若要输出以 `$$` 开头的纯文本，改用表达式，例如 `$="$$" + {name} + "你好！"`。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/parameters',
      label: '参数传递',
      description: '插值之后还会怎样计算',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '要计算或比较时用 $=',
    },
    {
      href: '/v2/xaction/concepts/edit-step-param',
      label: '选择或输入步骤参数',
      description: 'F1 切到 $$',
    },
    {
      href: '/v2/xaction/modules/formatstring',
      label: '组合成文本',
      description: '多段文本拼在一起',
    },
  ]}
/>
