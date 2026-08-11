---
title: "打开网址"
description: "用指定浏览器打开一个网页地址。"
slug: "/v2/xaction/modules/openurl"
sidebar_label: "打开网址"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:openUrl"
comments: true
moduleKey: "sys:openUrl"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1465706
legacyContentUpdatedAt: "2025-12-05T02:22:28.000Z"
---

# 打开网址

用浏览器打开一个网址。要顺带跑本地程序或打开文件，用 [运行或打开](/v2/xaction/modules/run)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:openUrl" />

## 概述

<ModuleParamPreview moduleKey="sys:openUrl" />

## 参数说明

**网址**：要打开的地址。

**浏览器**：系统默认、IE、Edge、Chrome，以及 App / 无痕等变体。点开下拉看当前全部选项。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  focusKeys={['browser']}
/>

Chrome App 模式可参考 [少数派说明](https://sspai.com/post/47718)。

**本地浏览器窗口**：用 Windows 内置 IE 内核，在 Quicker 里开一个小窗口，适合显示简单信息。

**浏览器程序路径**：仅 **\*自定义浏览器程序\***。填浏览器 exe 的完整路径。

**失败后停止**：打开失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否打开成功。

## 常见问题

要用列表里没有的浏览器时，改用「运行或打开」：路径填浏览器 exe，参数填网址。

<PreviewMarks
  marks={[
    {key: 'path', label: '浏览器 exe 的完整路径'},
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

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/run',
      label: '运行或打开',
      description: '自定义浏览器 exe，或打开本地文件。',
    },
  ]}
/>
