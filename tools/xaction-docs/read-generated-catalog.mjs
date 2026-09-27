// JSON 是参数事实源；Markdown 只供阅读，不能可靠承载原文和多级条件。
export function parseGeneratedCatalog(catalog) {
  if (catalog.SchemaVersion != null && catalog.SchemaVersion !== 1) {
    throw new Error(`不支持的导出 SchemaVersion：${catalog.SchemaVersion}`);
  }
  if (!Array.isArray(catalog.Steps) || catalog.Steps.length === 0 ||
      catalog.StepCount !== catalog.Steps.length || !catalog.GeneratedAt ||
      !Array.isArray(catalog.ExportErrors) || catalog.ExportErrors.length > 0) {
    throw new Error('模块导出不完整或包含错误，停止同步；请重新导出 catalog.json。');
  }
  return catalog.Steps.map((step) => {
    if (!step.Key || !step.Name || !step.Category ||
        !Array.isArray(step.Inputs) || !Array.isArray(step.Outputs)) {
      throw new Error(`模块定义不完整：${step.Key ?? '(未知模块)'}`);
    }
    for (const params of [step.Inputs, step.Outputs]) {
      const keys = params.map((param) => param.Key);
      if (keys.some((key) => !key) || new Set(keys).size !== keys.length) {
        throw new Error(`模块参数 Key 缺失或重复：${step.Key}`);
      }
    }
    const helpLink = step.HelpLink ?? '';
    const slug = (helpLink.match(/\/([^/?#]+)\/?(?:[?#].*)?$/)?.[1] ||
      step.Key.replace(/^[^:]+:/, '')).toLowerCase();
    return {
      key: step.Key,
      slug,
      legacySlug: slug,
      ownsLegacyContent: true,
      name: step.Name,
      description: step.Description ?? '',
      category: step.Category,
      categoryName: step.CategoryName,
      stepType: step.StepType,
      isRisky: step.IsRisky,
      isProOnly: step.IsProOnly,
      helpLink,
      inputs: step.Inputs.map((param) => ({
        ...parameter(param),
        defaultValue: valueText(param.DefaultValueText, param.DefaultValue),
        ...(Object.hasOwn(param, 'DefaultValue') ? {defaultValueRaw: param.DefaultValue} : {}),
        ...(Object.hasOwn(param, 'NewStepDefaultValue') ? {
          newStepDefaultValue: valueText(param.NewStepDefaultValueText, param.NewStepDefaultValue),
        } : {}),
        required: param.IsRequired,
        variableMode: param.VariableMode,
        isControlField: param.IsControlField,
      })),
      outputs: step.Outputs.map(parameter),
      selections: Object.fromEntries(step.Inputs
        .filter((param) => param.SelectionItems?.length)
        .map((param) => [param.Key, {
          name: param.Name,
          items: param.SelectionItems.map((item) => ({
            value: item.Value, name: item.Name, description: item.Description ?? '',
          })),
        }])),
      sourceFileName: 'catalog.json',
    };
  });
}

function valueText(text, value) {
  return text ?? (value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value));
}

function parameter(param) {
  const visibleWhen = param.VisibleWhen ? condition(param.VisibleWhen) : undefined;
  const validForList = param.ValidForList ?? [];
  const invalidForList = param.InvalidForList ?? [];
  return {
    key: param.Key,
    name: param.Name,
    type: param.Type,
    description: param.Description ?? '',
    isAdvanced: param.IsAdvanced,
    validForList,
    invalidForList,
    ...(visibleWhen ? {visibleWhen} : {}),
    ...(param.VisibleExpression ? {visibleExpression: param.VisibleExpression} : {}),
    condition: visibleWhen ? describeCondition(visibleWhen) : param.VisibleExpression
      ? `表达式：${param.VisibleExpression}`
      : [validForList.length ? `仅：${validForList.join(', ')}` : '',
        invalidForList.length ? `排除：${invalidForList.join(', ')}` : ''].filter(Boolean).join('; '),
  };
}

function condition(source) {
  if (!['Field', 'All', 'Any', 'Not'].includes(source.Kind)) {
    throw new Error(`未知显示条件：${source.Kind}`);
  }
  if (source.Kind === 'Field') {
    if (!source.FieldKey || !['In', 'NotIn', 'IsEmpty', 'IsNotEmpty'].includes(source.Operator)) {
      throw new Error('显示条件缺少控制字段或操作符。');
    }
    return {kind: 'Field', fieldKey: source.FieldKey, operator: source.Operator, values: source.Values ?? []};
  }
  const children = (source.Conditions ?? []).map(condition);
  if (source.Kind === 'Not' && children.length !== 1) throw new Error('Not 条件必须包含一个子条件。');
  return {kind: source.Kind, conditions: children};
}

function describeCondition(rule) {
  if (rule.kind === 'Field') {
    const op = {In: '为', NotIn: '不为', IsEmpty: '为空', IsNotEmpty: '不为空'}[rule.operator];
    return `${rule.fieldKey} ${op}${rule.values.length ? ` ${rule.values.map(JSON.stringify).join('、')}` : ''}`;
  }
  if (rule.kind === 'Not') return `非 (${describeCondition(rule.conditions[0])})`;
  return `(${rule.conditions.map(describeCondition).join(rule.kind === 'All' ? ' 且 ' : ' 或 ')})`;
}
