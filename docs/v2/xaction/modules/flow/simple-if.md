---
title: "如果"
description: "依据条件执行操作"
slug: "/v2/xaction/modules/simple-if"
sidebar_label: "如果"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:simpleIf"
comments: true
moduleKey: "sys:simpleIf"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
---

# 如果

条件成立时执行一组步骤；不成立就跳过。没有「否则」分支。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:simpleIf" />

## 概述

只有一个条件。要在不成立时走另一组步骤，用[如果/否则](/v2/xaction/modules/if)。本页参数表是当前模块自己的定义；写法与「如果/否则」相同。

<ModuleParamPreview moduleKey="sys:simpleIf" />

**如果**：要判断的条件。成立才执行组内步骤。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/if',
      label: '如果/否则',
      description: '需要「否则」分支，或查看条件写法时用这一页。',
    },
  ]}
/>
