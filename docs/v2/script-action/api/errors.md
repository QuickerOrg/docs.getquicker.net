---
title: "错误码索引"
description: "错误码索引的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/errors
comments: false
sidebar_position: 10
---

{/* script-api:start */}

用 `e.Code.Value` 判断失败原因，不要解析中文消息。调用名见 `e.OperationId`，扩展信息见 `e.Detail`。排查步骤见[常见问题](../troubleshooting.md)。

| 错误码 | 常量名 |
|---|---|
| `ACCESS_DENIED` | `AccessDenied` |
| `AI_FAILED` | `AiFailed` |
| `AI_TIMEOUT` | `AiTimeout` |
| `APP_FAILED` | `AppFailed` |
| `APP_TIMEOUT` | `AppTimeout` |
| `APP_UNAVAILABLE` | `AppUnavailable` |
| `AUDIO_DEVICE_NOT_FOUND` | `AudioDeviceNotFound` |
| `BRIDGE_BUSY` | `BridgeBusy` |
| `BRIDGE_DISABLED` | `BridgeDisabled` |
| `BRIDGE_FAILED` | `BridgeFailed` |
| `BRIDGE_TARGET_AMBIGUOUS` | `BridgeTargetAmbiguous` |
| `BRIDGE_TARGET_NOT_FOUND` | `BridgeTargetNotFound` |
| `BRIDGE_TIMEOUT` | `BridgeTimeout` |
| `BRIGHTNESS_FAILED` | `BrightnessFailed` |
| `BRIGHTNESS_UNSUPPORTED` | `BrightnessUnsupported` |
| `BROWSER_FAILED` | `BrowserFailed` |
| `BROWSER_TIMEOUT` | `BrowserTimeout` |
| `BROWSER_UNAVAILABLE` | `BrowserUnavailable` |
| `CALL_DEPTH_LIMIT_EXCEEDED` | `CallDepthLimitExceeded` |
| `CALL_FAILED` | `CallFailed` |
| `CAPABILITY_DENIED` | `CapabilityDenied` |
| `CAPTURE_BUSY` | `CaptureBusy` |
| `CAPTURE_PRO_FAILED` | `CaptureProFailed` |
| `CAPTURE_UNAVAILABLE` | `CaptureUnavailable` |
| `CLIPBOARD_LIMIT_EXCEEDED` | `ClipboardLimitExceeded` |
| `CLIPBOARD_UNAVAILABLE` | `ClipboardUnavailable` |
| `CLOUD_FAILED` | `CloudFailed` |
| `CODEC_UNSUPPORTED` | `CodecUnsupported` |
| `CODEC_VALUE_INVALID` | `CodecValueInvalid` |
| `DIALOG_LIMIT_EXCEEDED` | `DialogLimitExceeded` |
| `ELEVATED_TARGET_DENIED` | `ElevatedTargetDenied` |
| `EVERYTHING_FAILED` | `EverythingFailed` |
| `EVERYTHING_UNAVAILABLE` | `EverythingUnavailable` |
| `EXPLORER_NOT_FOUND` | `ExplorerNotFound` |
| `FILE_FAILED` | `FileFailed` |
| `FILE_NOT_FOUND` | `FileNotFound` |
| `HOST_FAILED` | `HostFailed` |
| `HOST_UNAVAILABLE` | `HostUnavailable` |
| `HTTP_FAILED` | `HttpFailed` |
| `HTTP_STATUS_FAILED` | `HttpStatusFailed` |
| `HTTP_TIMEOUT` | `HttpTimeout` |
| `IMAGE_DECODE_FAILED` | `ImageDecodeFailed` |
| `IMAGE_ENCODE_FAILED` | `ImageEncodeFailed` |
| `IMAGE_REF_DISPOSED` | `ImageRefDisposed` |
| `IMAGE_REF_INVALID` | `ImageRefInvalid` |
| `INPUT_FAILED` | `InputFailed` |
| `INPUT_LIMIT_EXCEEDED` | `InputLimitExceeded` |
| `INPUT_MISSING` | `InputMissing` |
| `INPUT_UNAVAILABLE` | `InputUnavailable` |
| `INPUT_USER_ACTIVE` | `InputUserActive` |
| `INVALID_ARGUMENT` | `InvalidArgument` |
| `LIMIT_EXCEEDED` | `LimitExceeded` |
| `NOTIFY_FAILED` | `NotifyFailed` |
| `NOTIFY_LIMIT_EXCEEDED` | `NotifyLimitExceeded` |
| `OCR_FAILED` | `OcrFailed` |
| `OCR_TIMEOUT` | `OcrTimeout` |
| `OCR_UNAVAILABLE` | `OcrUnavailable` |
| `POWER_FAILED` | `PowerFailed` |
| `PROCESS_FAILED` | `ProcessFailed` |
| `PROCESS_TIMEOUT` | `ProcessTimeout` |
| `QR_FAILED` | `QrFailed` |
| `QR_UNAVAILABLE` | `QrUnavailable` |
| `QUICKER_COMMAND_FAILED` | `QuickerCommandFailed` |
| `SCREEN_CAPTURE_FAILED` | `ScreenCaptureFailed` |
| `SCREEN_CAPTURE_UNAVAILABLE` | `ScreenCaptureUnavailable` |
| `SECURE_DESKTOP` | `SecureDesktop` |
| `SELECTION_FAILED` | `SelectionFailed` |
| `SELECTION_UNAVAILABLE` | `SelectionUnavailable` |
| `SOUND_FAILED` | `SoundFailed` |
| `STATE_UNAVAILABLE` | `StateUnavailable` |
| `STEP_FAILED` | `StepFailed` |
| `STEP_TIMEOUT` | `StepTimeout` |
| `SUBPROGRAM_NOT_FOUND` | `SubprogramNotFound` |
| `TARGET_PERMISSION_UNKNOWN` | `TargetPermissionUnknown` |
| `TEMP_SHARE_FAILED` | `TempShareFailed` |
| `TRANSLATE_FAILED` | `TranslateFailed` |
| `TRANSLATE_TIMEOUT` | `TranslateTimeout` |
| `UI_REACT_FAILED` | `UiReactFailed` |
| `UI_THREAD_NOT_ALLOWED` | `UiThreadNotAllowed` |
| `UI_UNAVAILABLE` | `UiUnavailable` |
| `UIA_FAILED` | `UiaFailed` |
| `UIA_LIMIT_EXCEEDED` | `UiaLimitExceeded` |
| `UIA_NOT_FOUND` | `UiaNotFound` |
| `UIA_PATTERN_UNSUPPORTED` | `UiaPatternUnsupported` |
| `UIA_REF_INVALID` | `UiaRefInvalid` |
| `UIA_REF_STALE` | `UiaRefStale` |
| `UIA_TARGET_DENIED` | `UiaTargetDenied` |
| `UIA_TIMEOUT` | `UiaTimeout` |
| `VISION_LIMIT_EXCEEDED` | `VisionLimitExceeded` |
| `WINDOW_ACTIVATION_FAILED` | `WindowActivationFailed` |
| `WINDOW_ARRANGE_FAILED` | `WindowArrangeFailed` |
| `WINDOW_CAPTURE_FAILED` | `WindowCaptureFailed` |
| `WINDOW_CHANGED` | `WindowChanged` |
| `WINDOW_EDGE_HIDE_FAILED` | `WindowEdgeHideFailed` |
| `WINDOW_FAILED` | `WindowFailed` |
| `WINDOW_LIMIT_EXCEEDED` | `WindowLimitExceeded` |
| `WINDOW_MESSAGE_FAILED` | `WindowMessageFailed` |
| `WINDOW_MESSAGE_TIMEOUT` | `WindowMessageTimeout` |
| `WINDOW_NOT_FOUND` | `WindowNotFound` |
| `WINDOW_REF_INVALID` | `WindowRefInvalid` |
| `WINDOW_REF_STALE` | `WindowRefStale` |
| `WINDOW_UNAVAILABLE` | `WindowUnavailable` |
| `WINDOW_WAIT_FAILED` | `WindowWaitFailed` |
| `ZIP_FAILED` | `ZipFailed` |

{/* script-api:end */}
