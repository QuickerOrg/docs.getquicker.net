export type StepVisibilityCondition = {
  kind: 'Field' | 'All' | 'Any' | 'Not';
  fieldKey?: string;
  operator?: 'In' | 'NotIn' | 'IsEmpty' | 'IsNotEmpty';
  values?: string[];
  conditions?: StepVisibilityCondition[];
};

type VisibilityParam = {
  condition?: string;
  visibleWhen?: StepVisibilityCondition;
  visibleExpression?: string;
  validForList?: string[];
  invalidForList?: string[];
};

type ModuleContext = {
  inputs: readonly {key: string; type: string; isControlField?: boolean}[];
  selections?: Record<string, {items: readonly {value: string}[]}>;
};

// null 表示变量、表达式或未知字段；与程序保持一致，无法判断时不隐藏参数。
type Result = boolean | null;
const equal = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

export function isStepParamVisible(
  param: VisibilityParam,
  currentValues: Readonly<Record<string, string>>,
  showHidden = false,
  module?: ModuleContext,
): boolean {
  if (showHidden) return true;
  function valueOf(fieldKey: string): string | undefined {
    const key = Object.keys(currentValues).find((key) => equal(key, fieldKey));
    const value = key == null ? undefined : currentValues[key];
    return value == null || /^\s*\$(?:=|\$)/.test(value) ? undefined : value;
  }
  function normalize(value: string, fieldKey: string): string {
    if (module?.inputs.find((input) => equal(input.key, fieldKey))?.type === 'Boolean') {
      if (equal(value, 'true') || value === '1') return '1';
      if (equal(value, 'false') || value === '0') return '0';
    }
    return value;
  }
  function evaluate(rule: StepVisibilityCondition): Result {
    if (rule.kind === 'Field') {
      const key = rule.fieldKey;
      if (!key) return null;
      const value = valueOf(key);
      if (value == null) return null;
      const matches = (rule.values ?? []).some((expected) => equal(normalize(expected, key), normalize(value, key)));
      switch (rule.operator) {
        case 'In': return matches;
        case 'NotIn': return !matches;
        case 'IsEmpty': return value.length === 0;
        case 'IsNotEmpty': return value.length > 0;
        default: return null;
      }
    }
    const children = (rule.conditions ?? []).map(evaluate);
    switch (rule.kind) {
      case 'All': return children.includes(false) ? false : children.includes(null) ? null : true;
      case 'Any': return children.includes(true) ? true : children.includes(null) ? null : false;
      case 'Not': return children.length === 1 && children[0] != null ? !children[0] : null;
      default: return null;
    }
  }
  if (param.visibleWhen) return evaluate(param.visibleWhen) !== false;
  // 文档页不执行程序的表达式；保留原式供阅读，不用旧条件覆盖它。
  if (param.visibleExpression) return true;

  const parts = (param.condition ?? '').split(';').map((part) => part.trim());
  const parseList = (label: string): string[] => {
    const match = parts.map((part) => new RegExp(`^${label}[：:]\\s*(.+)$`).exec(part)).find(Boolean);
    return match?.[1].split(/[,，]/).map((value) => value.trim()).filter(Boolean) ?? [];
  };
  const only = param.validForList ?? parseList('仅');
  const exclude = param.invalidForList ?? parseList('排除');
  function matchesList(wanted: string[]): Result {
    if (!module) {
      return Object.values(currentValues).some((value) => wanted.some((item) => equal(item, value)));
    }
    // 旧条件没有字段 Key，只在选项集合能唯一识别控制字段时判断。
    const candidates = module.inputs.filter((input) => {
      const options = module.selections?.[input.key]?.items ?? [];
      return options.length > 0 && wanted.every((item) => options.some((option) => equal(option.value, item)));
    });
    const controls = module.inputs.filter((input) => input.isControlField);
    const field = candidates.length === 1 ? candidates[0]
      : candidates.length === 0 && controls.length === 1 ? controls[0] : undefined;
    if (!field) return null;
    const value = valueOf(field.key);
    return value == null ? null : wanted.some((item) => equal(normalize(item, field.key), normalize(value, field.key)));
  }
  return !(only.length > 0 && matchesList(only) === false) &&
    !(exclude.length > 0 && matchesList(exclude) === true);
}
