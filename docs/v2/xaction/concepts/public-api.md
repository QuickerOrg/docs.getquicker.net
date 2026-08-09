---
title: "公共API"
description: "公共API的 Quicker 2.0 使用说明。"
slug: "/v2/xaction/concepts/public-api"
sidebar_position: 170
quickerDocKey: "xaction/concepts/public-api"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 43701476
legacyContentUpdatedAt: "2023-12-02T08:18:32.000Z"
---

服务器资源有限，请勿频繁特别是不要循环调用API，否则您的IP可能会被屏蔽，导致无法正常使用Quicker。



## 最新更新的动作



【本日分享或更新的动作】

[https://getquicker.net/open/api/actions/today](https://getquicker.net/open/api/actions/today)



【昨日分享或更新的动作】

[https://getquicker.net/open/api/actions/yesterday](https://getquicker.net/open/api/actions/yesterday)



【最近24小时分享或更新的动作】

[https://getquicker.net/open/api/actions/last24hours](https://getquicker.net/open/api/actions/last24hours)



【检查某个动作的最新版本】

https://getquicker.net/open/api/actions/CheckVersion?id=动作库动作ID

【获取动作基本信息】

https://getquicker.net/open/api/actions/getactioninfo?id=动作库动作ID

## Quicker版本信息



【获取版本更新历史】

`https://getquicker.net/open/api/quicker/versionhistory?from=1.30.0.0&to=1.30.5.0`

其中to参数可选。

【当前各通道版本号】

`https://getquicker.net/open/api/quicker/versions`



## 工具API

接口索引：[https://tools.getquicker.cn/swagger/index.html](https://tools.getquicker.cn/swagger/index.html)

源代码：[https://github.com/cuiliang/tools.getquicker.cn](https://github.com/cuiliang/tools.getquicker.cn)

子程序：[https://getquicker.net/subprogram?id=0c79bde7-f7aa-4584-ee8b-08da63dc012d](https://getquicker.net/subprogram?id=0c79bde7-f7aa-4584-ee8b-08da63dc012d)



目前包含的功能：

-   中文相关

-   获取汉字的拼音
-   获取句子的拼音
-   获取句子的拼音首字母
-   获取一个汉字的所有拼音
-   繁体转换简体
-   简体转换繁体
-   半角转换为全角
-   全角转换为半角
-   中文金额转换为数字

-   IP地址

-   返回公网IP

-   Json

-   将json内容转换为csv

-   Markdown

-   Html转换为Markdown
-   Markdown转换为Html

-   Yaml

-   Yaml转换为Json
-   Json转换为Yaml



## 其它服务



#### 获取网站favicon

访问地址：`https://helperservice.getquicker.cn/favicon/get/域名`

返回格式：图片

例如：[https://helperservice.getquicker.cn/favicon/get/getquicker.net](https://helperservice.getquicker.cn/favicon/get/getquicker.net)

#### 获取常见程序的图标

访问地址：`https://helperservice.getquicker.cn/exeicon/get/exe文件名`

返回格式：图片

例如：[https://helperservice.getquicker.cn/exeicon/get/quicker.exe](https://helperservice.getquicker.cn/exeicon/get/quicker.exe)

注：仅支持常见程序，可能会返回早期版本或错误的程序图标。

#### SVG图标转png

访问地址：`https://helperservice.getquicker.cn/svg/topng?svg=svg图片网址的URL编码后的值(必须以.svg结尾)&size=可选，生成的图标大小边长像素数&defaultColor=可选，默认颜色的URL编码值`

例如：[齿轮图标](https://helperservice.getquicker.cn/svg/topng?svg=https%3a%2f%2ffiles.getquicker.net%2f_icons%2f7AA0148FB856A178C83BCC809A8EF06FA5FDCF9C.svg&size=128&defaultColor=%23FF0000)

注：svg需可直接从国内无登录访问下载，部分图标可能无法正常转换。

#### 内置矢量图标转png

访问地址：`https://helperservice.getquicker.cn/faicon/png/图标名称的URL编码结果`。其中图标名称的格式类似于`fa:Light_Cog:#FF0000`或`fa:Light_Cog`。

#### 词典

（1）查询一个单词：

支持英文和常用中文单词。

请求地址：`[https://helperservice.getquicker.cn/dict/word?word=](https://helperservice.getquicker.cn/dict/word?word=)单词`

例如：[https://helperservice.getquicker.cn/dict/word?word=Hello](https://helperservice.getquicker.cn/dict/word?word=Hello)

数据来源及返回数据内容请参考：[https://github.com/skywind3000/ECDICT](https://github.com/skywind3000/ECDICT)

（2）查询多个单词：

请求地址：`https://helperservice.getquicker.cn/dict/multi?wordList=逗号分隔的单词列表`

例如：[https://helperservice.getquicker.cn/dict/multi?wordList=Hello,China](https://helperservice.getquicker.cn/dict/multi?wordList=Hello,China)

（3）查询匹配某个前缀的单词列表

请求地址：`https://helperservice.getquicker.cn/dict/match?word=前缀&count=最多返回个数&trans=是否返回翻译内容&json=是否以json格式返回。`

例如：

-   [https://helperservice.getquicker.cn/dict/match?word=quick&count=50](https://helperservice.getquicker.cn/dict/match?word=quick&count=50)
-   [https://helperservice.getquicker.cn/dict/match?word=quick&count=50&json=true&trans=true](https://helperservice.getquicker.cn/dict/match?word=quick&count=50&json=true&trans=true)

## 更新历史

-   20230909 增加svg转png服务。
-   20231202 增加内置矢量图标转png服务，便于在网页中显示使用了内置图标的动作。[


    ](https://github.com/skywind3000/ECDICT)
