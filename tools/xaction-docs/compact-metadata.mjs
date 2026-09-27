// 只省略约定为默认值的元数据，不能递归删除实际参数值或枚举选项中的 false / 0 / 空字符串。
function compactFields(source) {
  const result = {...source};
  for (const key of ['isRisky', 'isProOnly', 'isAdvanced', 'required', 'isControlField']) {
    if (result[key] === false) delete result[key];
  }
  for (const key of ['description', 'condition', 'visibleExpression', 'helpLink']) {
    if (result[key] === '') delete result[key];
  }
  for (const key of ['validForList', 'invalidForList']) {
    if (result[key]?.length === 0) delete result[key];
  }
  for (const key of Object.keys(result)) {
    if (result[key] === undefined) delete result[key];
  }
  return result;
}

export function compactParameter(parameter) {
  const result = compactFields(parameter);
  // 字符串本身已经无损保存在 defaultValue 中；非字符串原值继续保留类型。
  if (typeof result.defaultValueRaw === 'string' &&
      result.defaultValueRaw === (result.defaultValue ?? '')) delete result.defaultValueRaw;
  return result;
}

export function compactModule(module) {
  const result = compactFields(module);
  result.inputs = (module.inputs ?? []).map(compactParameter);
  result.outputs = (module.outputs ?? []).map(compactParameter);
  if (Object.keys(module.selections ?? {}).length) {
    result.selections = Object.fromEntries(Object.entries(module.selections).map(([key, selection]) =>
      [key, {...selection, items: selection.items.map(compactFields)}]));
  } else {
    delete result.selections;
  }
  return result;
}
