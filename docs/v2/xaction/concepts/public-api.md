---
title: "公共API"
description: "Quicker 开放的动作、版本和工具 HTTP 接口；不要循环高频调用。"
slug: "/v2/xaction/concepts/public-api"
sidebar_position: 170
quickerDocKey: "xaction/concepts/public-api"
comments: true
docStatus: reviewed
legacyDocId: 43701476
legacyContentUpdatedAt: "2023-12-02T08:18:32.000Z"
---

# 公共API

服务器资源有限，不要频繁、尤其不要循环调用这些接口。否则 IP 可能被屏蔽，Quicker 也会受影响。

## 动作

| 说明 | 地址 |
| --- | --- |
| 本日分享或更新 | [https://getquicker.net/open/api/actions/today](https://getquicker.net/open/api/actions/today) |
| 昨日分享或更新 | [https://getquicker.net/open/api/actions/yesterday](https://getquicker.net/open/api/actions/yesterday) |
| 最近 24 小时 | [https://getquicker.net/open/api/actions/last24hours](https://getquicker.net/open/api/actions/last24hours) |
| 检查某动作最新版本 | `https://getquicker.net/open/api/actions/CheckVersion?id=动作库动作ID` |
| 获取动作基本信息 | `https://getquicker.net/open/api/actions/getactioninfo?id=动作库动作ID` |

## 版本

| 说明 | 地址 |
| --- | --- |
| 版本更新历史 | `https://getquicker.net/open/api/quicker/versionhistory?from=1.30.0.0&to=1.30.5.0`（`to` 可选） |
| 当前各通道版本号 | `https://getquicker.net/open/api/quicker/versions` |

## 工具 API

接口索引：[https://tools.getquicker.cn/swagger/index.html](https://tools.getquicker.cn/swagger/index.html)

源代码：[https://github.com/cuiliang/tools.getquicker.cn](https://github.com/cuiliang/tools.getquicker.cn)

封装子程序：[https://getquicker.net/subprogram?id=0c79bde7-f7aa-4584-ee8b-08da63dc012d](https://getquicker.net/subprogram?id=0c79bde7-f7aa-4584-ee8b-08da63dc012d)

目前包括：汉字拼音 / 简繁与全半角、公网 IP、JSON↔CSV、Markdown↔HTML、YAML↔JSON。

## 其它服务

| 说明 | 地址 |
| --- | --- |
| 网站 favicon | `https://helperservice.getquicker.cn/favicon/get/域名` |
| 常见程序图标 | `https://helperservice.getquicker.cn/exeicon/get/exe文件名`（仅常见程序，可能是旧版或错图标） |
| SVG 转 PNG | `https://helperservice.getquicker.cn/svg/topng?svg=URL编码的.svg地址&size=边长&defaultColor=颜色` |
| 内置矢量图标转 PNG | `https://helperservice.getquicker.cn/faicon/png/` + `fa:Light_Cog:#FF0000` 的 URL 编码 |
| 查一个词 | `https://helperservice.getquicker.cn/dict/word?word=单词` |
| 查多个词 | `https://helperservice.getquicker.cn/dict/multi?wordList=Hello,China` |
| 前缀匹配 | `https://helperservice.getquicker.cn/dict/match?word=quick&count=50` |

词典数据来源见 [ECDICT](https://github.com/skywind3000/ECDICT)。SVG 需能在国内免登录下载。

## 限制与排障

- 循环或高频调用会被封 IP。
- 程序图标接口不是完整图标库。
- 工具域名是 `tools.getquicker.cn` / `helperservice.getquicker.cn`，和文档站不是同一个。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/use-icon-in-actions',
      label: '在动作中使用图标',
      description: 'fa: / icon: / url: 写法',
    },
    {
      href: '/v2/xaction/concepts/subprogram',
      label: '子程序',
      description: '工具 API 有现成封装子程序',
    },
  ]}
/>
