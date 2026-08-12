---
title: "复杂动作的编程约定"
description: "用户数据放在「文档\\Quicker\\动作名」下，用获取系统路径拿到文档目录。"
slug: "/v2/xaction/concepts/standard"
sidebar_position: 180
quickerDocKey: "xaction/concepts/standard"
comments: true
docStatus: reviewed
legacyDocId: 30775973
legacyContentUpdatedAt: "2021-01-27T03:04:42.000Z"
---

# 复杂动作的编程约定

动作若要保存用户产生的数据，请放到：

**Windows 个人文档目录 `\Quicker\动作名\`**

需要时再分子目录。文件夹名不必和动作标题完全一样，可以加后缀避免冲突。

用 [获取系统路径](/v2/xaction/modules/getfolderpath) 拿「我的文档」的实际路径：

<ModuleParamPreview
  moduleKey="sys:getFolderPath"
  values={{folder: 'MyDocuments'}}
  outputVars={{path: 'docsRoot'}}
  focusKeys={['folder', 'path']}
/>

然后拼 `$$\Quicker\你的动作名\`。

## 限制与排障

- 不要把用户数据写进 Quicker 安装目录，更新或重装会丢。
- 动作名做文件夹时避开 `\ / : * ? " < > |`。
- 分享动作时提醒用户：数据在他们自己的文档目录里，不会跟着动作走。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getfolderpath',
      label: '获取系统路径',
      description: 'MyDocuments 等特殊目录',
    },
    {
      href: '/v2/xaction/concepts/store-settings',
      label: '在动作中存储用户设置',
      description: '少量选项用状态，而不是文件',
    },
  ]}
/>
