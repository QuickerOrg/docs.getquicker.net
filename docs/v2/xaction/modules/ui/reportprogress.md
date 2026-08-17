---
title: "显示进度条"
description: "在桌面右下角创建、更新或去掉进度条。"
slug: "/v2/xaction/modules/reportprogress"
sidebar_label: "显示进度条"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:reportProgress"
comments: true
moduleKey: "sys:reportProgress"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 12796417
legacyContentUpdatedAt: "2025-12-05T02:25:20.000Z"
---

# 显示进度条

在桌面右下角显示操作进度。1.10.8+ 提供。下载模块和 Http 模块也可以往同一个窗口里堆进度条。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:reportProgress" />

## 概述

窗口默认半透明，鼠标移上去变不透明，可同时叠多条。每条由标题、进度、说明文字组成。

<ReportProgressPreview
  items={[
    {title: '测试进度条', percent: 42, text: '第 42/100 项'},
    {title: '下载文件', percent: 68, text: '正在写入缓存…'},
  ]}
/>

![](./img/reportprogress-002-1351e8abb3.png)

典型用法：先创建拿到 ID，循环里更新，结束后去掉。

<StepProgramView example="9a2970fd-14a5-4428-9b2a-08d852fc39cc" />

<ShareLinkCard
  code="9a2970fd-14a5-4428-9b2a-08d852fc39cc"
  title="进度条测试"
  description="测试进度条功能"
  author="CL"
/>

## 参数说明

### 创建进度条

只生成 ID，不会立刻显示。把 **进度条ID** 输出到变量，后面更新和去除都用同一个 ID。

<ModuleParamPreview
  moduleKey="sys:reportProgress"
  focusKeys={['type', 'progressId']}
  values={{type: 'REQUEST_ID'}}
  outputVars={{progressId: 'progressId'}}
/>

### 更新进度

真正把进度条画出来。

<ModuleParamPreview
  moduleKey="sys:reportProgress"
  focusKeys={['type', 'progressId', 'title', 'percentage', 'text']}
  values={{
    type: 'UPDATE_PROGRESS',
    progressId: 'progressId',
    title: '测试进度条',
    percentage: '$= 100.0 * ({count} + 1) / 10.0',
    text: '$$count = {count}',
  }}
/>

**进度条ID**：创建时拿到的编号。

**进度条标题**：进度条上方的深色粗体文字。

**进度百分比**：0 到 100 的数字。7 件完成 3 件可写 `$= 100.0 * 3 / 7`。

**说明文字**：进度条下方的浅色文字。

### 去除进度条

<ModuleParamPreview
  moduleKey="sys:reportProgress"
  focusKeys={['type', 'progressId']}
  values={{type: 'REMOVE', progressId: 'progressId'}}
/>

忘了去除或动作中途停掉时，进度条会一直留着。点窗口上的垃圾桶可清掉。

![](./img/reportprogress-007-0a60ada33f.png)

## 输出

- **进度条ID**：仅「创建进度条」。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/showwaitwin',
      label: '显示等待窗口',
      description: '带按钮、可中止的进度提示。',
    },
    {
      href: '/v2/xaction/modules/download',
      label: '下载文件',
      description: '下载进度和本模块共用一个窗口。',
    },
  ]}
/>
