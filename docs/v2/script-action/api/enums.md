---
title: "字符串取值"
description: "字符串取值的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/enums
comments: false
sidebar_position: 10
---

{/* script-api:start */}

| 成员或类型 | 参数或字段 | 取值 | 是否接受其他值 |
|---|---|---|---|
| `Log` | `level` | `debug`、`info`、`warn`、`error` | 否 |
| `UiOptions` | `Position` | `mouse`、`mouse2`、`center`、`topLeft`、`topCenter`、`topRight`、`leftCenter`、`rightCenter`、`bottomLeft`、`bottomCenter`、`bottomRight`、`last` | 否 |
| `UiOptions` | `Ime` | `on`、`off` | 否 |
| `Ui.Notify` | `kind` | `info`、`success`、`warn`、`error`、`toast` | 否 |
| `Ui.Notify` | `position` | `bottomCenter`、`bottomLeft`、`bottomRight`、`topCenter`、`topLeft`、`topRight` | 否 |
| `Ui.Notify` | `duplicate` | `replace`、`count`、`ignore` | 否 |
| `Ui.Alert` | `icon` | `none`、`info`、`question`、`warn`、`error` | 否 |
| `Ui.Confirm` | `icon` | `none`、`info`、`question`、`warn`、`error` | 否 |
| `Ui.Ask` | `icon` | `none`、`info`、`question`、`warn`、`error` | 是，见成员说明 |
| `Ui.Pin` | `kind` | `auto`、`image`、`text`、`html`、`latex` | 否 |
| `Field` | `Kind` | `text`、`multiline`、`number`、`slider`、`check`、`dropdown`、`combo`、`autocomplete`、`multi`、`radio`、`date`、`dateTime`、`color`、`password`、`font`、`dict`、`label`、`separator` | 否 |
| `Window.SetState` | `state` | `normal`、`minimized`、`maximized` | 否 |
| `WinInfo` | `State` | `normal`、`minimized`、`maximized` | 否 |
| `Window.WaitFor` | `state` | `exists`、`visible`、`foreground` | 否 |
| `Window.ToScreen` | `anchor` | `topLeft`、`topRight`、`bottomLeft`、`bottomRight`、`center` | 否 |
| `Window.SetEdgeHide` | `edge` | `auto`、`left`、`top`、`right`、`bottom` | 否 |
| `Mouse.Click` | `button` | `left`、`right`、`middle` | 否 |
| `Mouse.Down` | `button` | `left`、`right`、`middle` | 否 |
| `Mouse.Up` | `button` | `left`、`right`、`middle` | 否 |
| `Mouse.GetCursor` | `return` | `arrow`、`iBeam`、`hand`、`wait`、`appStarting`、`cross`、`no`、`help`、`sizeAll`、`sizeNs`、`sizeWe`、`sizeNwse`、`sizeNesw`、`upArrow`、`hidden`、`unknown` | 否 |
| `Selection.GetText` | `format` | `text`、`html`、`rtf`、`csv` | 否 |
| `Clipboard.Get` | `format` | `rtf`、`csv` | 是，见成员说明 |
| `Clipboard.Set` | `format` | `rtf`、`csv`、`html`、`text` | 是，见成员说明 |
| `Files.GetKnownFolder` | `name` | `desktop`、`documents`、`pictures`、`music`、`videos`、`appData`、`localAppData`、`programData`、`userProfile`、`startup`、`downloads`、`temp` | 是，见成员说明 |
| `Files.Search` | `sort` | `name`、`path`、`size`、`extension`、`created`、`modified` | 否 |
| `Files.Hash` | `algorithm` | `md5`、`sha1`、`sha256`、`sha384`、`sha512` | 否 |
| `Files.Hash` | `output` | `hex`、`base64` | 否 |
| `Text.Hash` | `algorithm` | `md5`、`sha1`、`sha256`、`sha384`、`sha512` | 否 |
| `Text.Hash` | `output` | `hex`、`base64` | 否 |
| `Img.ToBytes` | `format` | `png`、`jpg`、`bmp` | 否 |
| `Img.ToBase64` | `format` | `png`、`jpg`、`bmp` | 否 |
| `Screen.Capture` | `screen` | `all`、`primary`、`mouse` | 否 |
| `Screen.CapturePro` | `mode` | `capture`、`captureNow`、`copy`、`pin`、`ocr`、`ocrCopy`、`table`、`formula`、`translate`、`imageTranslate`、`quickSave` | 否 |
| `Vision.Ocr` | `model` | `tiny`、`small` | 否 |
| `Vision.FindText` | `model` | `tiny`、`small` | 否 |
| `Browser.Open` | `browser` | `default`、`edge`、`chrome`、`current`、`edgeApp`、`edgeIncognito`、`chromeApp`、`chromeIncognito` | 是，见成员说明 |
| `Browser.Act` | `action` | `click`、`fill`、`type`、`paste`、`clear`、`select`、`check`、`uncheck`、`hover`、`scroll` | 否 |
| `Browser.Fill` | `failOn` | `required`、`any`、`never` | 否 |
| `FillField` | `Status` | `filled`、`unchanged`、`matched`、`failed`、`skipped` | 否 |
| `Apps.Run` | `app` | `word`、`excel`、`ppt`、`wps`、`et`、`wpp`、`visio`、`wordOrWps`、`excelOrEt`、`pptOrWpp`、`photoshop`、`illustrator`、`autocad`、`rhino` | 是，见成员说明 |
| `Apps.RunOfficeCommand` | `app` | `word`、`excel`、`ppt`、`wps`、`et`、`wpp`、`visio`、`wordOrWps`、`excelOrEt`、`pptOrWpp` | 否 |
| `BridgeTarget` | `Kind` | `wps`、`et`、`wpp` | 否 |
| `Ai.Translate` | `targetLanguage` | `zh`、`en`、`ja`、`ko` | 否 |
| `Ai.Translate` | `sourceLanguage` | `zh`、`en`、`ja`、`ko` | 否 |
| `ChatMessage` | `Role` | `user`、`assistant` | 否 |
| `Uia.Act` | `action` | `invoke`、`click`、`toggle`、`check`、`uncheck`、`expand`、`collapse`、`select`、`focus`、`scroll` | 否 |
| `Uia.Find` | `controlType` |  | 是，见成员说明 |
| `Quicker.Command` | `command` | `showPanel`、`showSearch`、`showCircleMenu`、`showToolbar`、`editAction`、`editSubprogram`、`runLast`、`togglePause`、`stopAll`、`loadProfile`、`restart` | 否 |
| `QuickerInfo` | `Theme` | `light`、`dark`、`autoLight`、`autoDark` | 否 |
| `Text.QueryHtml` | `output` | `text`、`innerHtml`、`outerHtml` | 否 |
| `Sys.PlaySound` | `sound` | `info`、`snip`、`succeed`、`warning`、`wrong`、`dim` | 是，见成员说明 |
| `Sys.Power` | `action` | `lock`、`sleep`、`hibernate`、`screenOff`、`signOut`、`shutdown`、`restart` | 否 |
| `Sys.GetBrightness` | `screen` | `mouse`、`primary`、`all` | 是，见成员说明 |
| `Sys.SetBrightness` | `screen` | `mouse`、`primary`、`all` | 是，见成员说明 |
| `Sys.GetVolume` | `device` | `output`、`input` | 否 |
| `Sys.SetVolume` | `device` | `output`、`input` | 否 |
| `Sys.ListAudioDevices` | `device` | `output`、`input` | 否 |
| `Sys.SetDefaultAudioDevice` | `device` | `output`、`input` | 否 |
| `Sys.SetDarkMode` | `scope` | `apps`、`system`、`all` | 否 |
| `Ctx` | `Trigger` | `panel`、`floatButton`、`floatPanel`、`dashboard`、`editor`、`circleMenu`、`search`、`searchInput`、`searchCallback`、`searchContextMenu`、`hotkey`、`hotkeyWatcher`、`mouse`、`leftButtonPlus`、`scrollOnButton`、`advancedMouseAction`、`mobileApp`、`external`、`androidRemote`、`event`、`screenshot`、`textToolbar`、`triggerKey`、`gesture`、`textCommand`、`autoRun`、`contextMenu`、`association`、`browserContextMenu`、`webpageButton`、`other` | 否 |

{/* script-api:end */}
