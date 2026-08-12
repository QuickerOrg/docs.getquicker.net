---
title: "在动作中存储用户设置"
description: "把设置变量勾成「作为状态使用」，用右键菜单打开表单修改。"
slug: "/v2/xaction/concepts/store-settings"
sidebar_position: 200
quickerDocKey: "xaction/concepts/store-settings"
comments: true
docStatus: reviewed
legacyDocId: 65285988
legacyContentUpdatedAt: "2024-03-03T23:43:18.000Z"
---

# 在动作中存储用户设置

有的动作要让使用者自己填：依赖程序的路径、API 凭据、个人习惯等。

相关：[状态存取](/v2/xaction/modules/statestorage)、[表单](/v2/xaction/modules/form)、[自定义右键菜单](/v2/xaction/concepts/action-custom-context-menu)、[动作参数](/v2/xaction/concepts/quicker_in_param)。

## 做法

1. 给这些变量勾上 **作为状态使用**。改过之后，下次运行会用保存的值当初始值。

<VariableDefPreview
  name="vendor"
  typeLabel="文本"
  remark="翻译引擎"
  defaultValue="default"
  asState
/>

2. 需要改的时候弹出表单：值不合法、用户点了设置菜单、或启动时按住了 `Ctrl` 等。

## 示例：一译

[一译](https://getquicker.net/Sharedaction?code=3b4e1cbc-9fbc-4686-764f-08d950c2afd2) 用选定引擎翻译选区，再按设置写入剪贴板或发回窗口。

<StepProgramView example="3b4e1cbc-9fbc-4686-764f-08d950c2afd2" />

<ShareLinkCard
  code="3b4e1cbc-9fbc-4686-764f-08d950c2afd2"
  title="一译"
/>

自定义项存在这些变量里：`vendor`（厂商）、`srcLang` / `dstLang`（语言）、`autoPaste`（是否自动粘贴）。

右键菜单一行：

```text
[fa:Light_Cog:#FF0000]动作设置|settings
```

<ContextMenuPreview
  openPath={['动作设置']}
  items={[
    {label: '动作设置', icon: 'fa:Light_Cog:#FF0000'},
    {type: 'separator'},
    {label: '运行', icon: 'fa:Light_Play:#39b54d'},
  ]}
/>

动作里判断 `{quicker_in_param}` 是不是 `settings`：是就弹出表单改这四个变量然后结束；不是就走「获取选中文本 → 翻译 → 输出」。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {quicker_in_param} == "settings"'}}
  focusKeys={['condition']}
/>

## 限制与排障

- 「作为状态使用」只在动作**正常结束**后写入。长期挂着的动作不要靠它存设置。
- 菜单参数要用不容易撞车的值，如 `settings`。
- 表单字段名要和变量名一致，否则改完存不回去。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/statestorage',
      label: '状态存取',
      description: '显式读写状态',
    },
    {
      href: '/v2/xaction/modules/form',
      label: '多字段表单',
      description: '设置界面',
    },
    {
      href: '/v2/xaction/concepts/action-custom-context-menu',
      label: '自定义右键菜单',
      description: '入口做成「动作设置」',
    },
    {
      href: '/v2/xaction/concepts/variables',
      label: '变量',
      description: '作为状态使用',
    },
  ]}
/>
