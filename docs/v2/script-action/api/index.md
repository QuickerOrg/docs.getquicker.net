---
title: "API 参考"
description: "API 参考的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/index
comments: false
sidebar_position: 1
---

{/* script-api:start */}

通过 `qk` 调用 Quicker 能力。方法签名、默认值和下列说明来自当前产品 API；未提供独立说明的参数应结合域与成员说明查阅。

- [qk：根成员与运行上下文](./qk.md)
- [qk.Selection：选区](./selection.md)
- [qk.State：动作状态](./state.md)
- [qk.Actions：动作与子程序](./actions.md)
- [qk.Ui：对话框与界面](./ui.md)
- [qk.Window：窗口](./window.md)
- [qk.Keyboard：键盘](./keyboard.md)
- [qk.Mouse：鼠标](./mouse.md)
- [qk.Clipboard：剪贴板](./clipboard.md)
- [qk.Files：文件](./files.md)
- [qk.Http：HTTP 请求](./http.md)
- [qk.Process：进程](./process.md)
- [qk.Image：图片](./image.md)
- [qk.Screen：截屏](./screen.md)
- [qk.Vision：找图与 OCR](./vision.md)
- [qk.Browser：浏览器](./browser.md)
- [qk.Apps：外部程序](./apps.md)
- [qk.Ai：AI 与翻译](./ai.md)
- [qk.Uia：界面自动化](./uia.md)
- [qk.Quicker：Quicker 服务](./quicker.md)
- [qk.Text：文本工具](./text.md)
- [qk.Sys：系统](./sys.md)
- [qk.Steps：组合动作步骤](./steps.md)

- [公共类型](./types/index.md)
- [字符串取值](./enums.md)
- [错误码索引](./errors.md)
- [运行限额](../limits.md)

## 可用的纯计算类型

```csharp
Action, Action<T>, ArgumentException, ArgumentNullException, ArgumentOutOfRangeException, Array, ArrayEnumerator, ASCIIEncoding, bool, byte, Capture, CaptureCollection, Char, CompareInfo, CompareOptions, Convert, CultureInfo, DateTime, DateTimeFormatInfo, DateTimeKind, DateTimeOffset, DateTimeStyles, DayOfWeek, Decimal, DecoderFallback, Dictionary<TKey, TValue>, DivideByZeroException, double, EncoderFallback, Encoding, Enumerable, Exception, FormatException, Func<T, TResult>, Func<T1, T2, T3, TResult>, Func<T1, T2, TResult>, Func<TResult>, Group, GroupCollection, Guid, HashSet<T>, IDictionary<TKey, TValue>, IEnumerable<T>, IndexOutOfRangeException, int, Int16, InvalidOperationException, IReadOnlyDictionary<TKey, TValue>, IReadOnlyList<T>, JavaScriptEncoder, JsonArray, JsonCommentHandling, JsonDocument, JsonDocumentOptions, JsonElement, JsonException, JsonIgnoreCondition, JsonNamingPolicy, JsonNode, JsonNodeOptions, JsonNumberHandling, JsonObject, JsonProperty, JsonSerializer, JsonSerializerDefaults, JsonSerializerOptions, JsonValue, JsonValueKind, KeyNotFoundException, KeyValuePair<TKey, TValue>, LinkedList<T>, LinkedListNode<T>, List<T>, long, Match, MatchCollection, MatchEvaluator, Math, MidpointRounding, NotImplementedException, NotSupportedException, Nullable<T>, NullReferenceException, NumberFormatInfo, NumberStyles, object, ObjectEnumerator, OperationCanceledException, OverflowException, Path, PriorityQueue<TElement, TPriority>, Queue<T>, Random, Regex, RegexMatchTimeoutException, RegexOptions, SByte, Single, SortedDictionary<TKey, TValue>, SortedList<TKey, TValue>, SortedSet<T>, Stack<T>, string, StringBuilder, StringComparer, StringComparison, StringSplitOptions, TextInfo, TimeoutException, TimeSpan, Tuple, Tuple<T1, T2, T3, T4, T5, T6, T7, TRest>, Tuple<T1, T2, T3, T4, T5, T6, T7>, Tuple<T1, T2, T3, T4, T5, T6>, Tuple<T1, T2, T3, T4, T5>, Tuple<T1, T2, T3, T4>, Tuple<T1, T2, T3>, Tuple<T1, T2>, Tuple<T1>, UInt16, UInt32, UInt64, UnicodeEncoding, Uri, UriBuilder, UriComponents, UriFormat, UriFormatException, UriKind, UriPartial, UTF32Encoding, UTF8Encoding, ValueTuple, ValueTuple<T1, T2, T3, T4, T5, T6, T7, TRest>, ValueTuple<T1, T2, T3, T4, T5, T6, T7>, ValueTuple<T1, T2, T3, T4, T5, T6>, ValueTuple<T1, T2, T3, T4, T5>, ValueTuple<T1, T2, T3, T4>, ValueTuple<T1, T2, T3>, ValueTuple<T1, T2>, ValueTuple<T1>, WebUtility
```

{/* script-api:end */}
