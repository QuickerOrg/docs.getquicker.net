---
title: "临时图床"
description: "将图片上传到临时（1分钟后删除）的图床，用以搜图等场景。勿上传非法内容。"
slug: "/v2/xaction/modules/tempimgbed"
sidebar_label: "临时图床"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:tempImgBed"
comments: true
moduleKey: "sys:tempImgBed"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 7612384
legacyContentUpdatedAt: "2023-04-30T04:24:10.000Z"
---

# 临时图床

把图片上传到临时图床，换一段公网网址。适合以图搜图等「只要几秒钟能被别人访问」的场景。不要上传可能违法的内容。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:tempImgBed" />

## 概述

网址会带上你的用户编号。若被云厂商或第三方警告，Quicker 会停用你的本服务权限。

普通用户约 1 分钟后自动删除。专业版可能走阿里云 + CDN，保留更久。目前对所有用户开放，但会限制图片大小、分辨率和调用频率；资源紧张时服务范围可能再收。

<ModuleParamPreview
  moduleKey="sys:tempImgBed"
  values={{stopIfFail: 'true'}}
  inputVars={{imgVar: 'imgVar'}}
  outputVars={{isSuccess: 'isSuccess', url: 'url'}}
/>

## 参数说明

**图片变量**：要上传的图片。

**失败后停止**：上传失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否上传成功。
- **网址**：临时公网地址。

## 限制与排障

本服务只解决「临时可访问」。要长期存图，请用自己的网盘、对象存储或 [写入图片文件](/v2/xaction/modules/writeimagefile)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '常见的上传来源。',
    },
    {
      href: '/v2/xaction/modules/getclipboardimage',
      label: '获取剪贴板图片',
      description: '从剪贴板取出后再上传。',
    },
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '需要长期保存时走本地文件。',
    },
  ]}
/>
