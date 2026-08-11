---
title: "打开网址"
description: "打开指定的网址"
slug: "/v2/xaction/modules/openurl"
sidebar_label: "打开网址"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:openUrl"
comments: true
moduleKey: "sys:openUrl"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1465706
legacyContentUpdatedAt: "2025-12-05T02:22:28.000Z"
---

# 打开网址

打开指定的网址

## 当前模块定义

<XActionModuleMeta moduleKey="sys:openUrl" />

使用浏览器打开指定的网址。

<ModuleParamPreview moduleKey="sys:openUrl" />

## 输入参数

网址：需要打开的网页地址。

浏览器：使用哪个浏览器打开网址。可选“系统默认浏览器”、“IE”、“Edge”、“Chrome App”模式等。点开下拉可查看当前全部选项。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  focusKeys={['browser']}
/>

Chrome APP模式可以参考[https://sspai.com/post/47718](https://sspai.com/post/47718)。

“本地窗口”使用Windows内置的IE内核浏览器，在Quicker软件内打开一个小的浏览器窗口，可以用于显示一些简单的信息。

## 常见问题

#### 问：如何使用非默认浏览器打开网页

答：

使用“运行或打开”模块。路径填浏览器程序，参数填要打开的网址。

<PreviewMarks
  marks={[
    {key: 'path', label: '浏览器软件应用程序.exe的完整路径'},
    {key: 'arg', label: '要打开的网址'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:run"
    scrollBody={false}
    focusKeys={['path', 'arg', 'setWorkingDir', 'windowStyle', 'runas']}
    values={{
      setWorkingDir: '',
      windowStyle: '0',
      runas: 'false',
    }}
  />
</PreviewMarks>
