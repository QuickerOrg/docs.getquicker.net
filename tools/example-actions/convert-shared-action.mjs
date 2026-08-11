/**
 * Convert getquicker SharedActionDto.data (XAction JSON string) → StepWire.
 * Do not invent steps; omit empty params; keep source notes as-is.
 */

/** @typedef {{key: string, inputs?: Record<string,string>, outputs?: Record<string,string>, note?: string, disabled?: boolean, title?: string, ifSteps?: object[], elseSteps?: object[]}} StepWire */
/** @typedef {{name: string, type?: string, remark?: string}} ProgramVar */

const VAR_TYPE = {
  0: 'Text',
  1: 'Number',
  2: 'Boolean',
  3: 'Image',
  4: 'List',
  6: 'DateTime',
  7: 'Keyboard',
  8: 'Mouse',
  9: 'Enum',
  10: 'Dict',
  11: 'Form',
  12: 'Integer',
  13: 'Table',
  14: 'FormForDict',
  98: 'Object',
  99: 'Any',
};

const MAX_SIMPLE_STEPS = 50;

/**
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function extractSharedCode(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return '';
  try {
    const url = new URL(text);
    const code = url.searchParams.get('code')?.trim();
    if (code) return code;
  } catch {
    // not a URL
  }
  const guid = text.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  );
  return guid ? guid[0] : '';
}

/**
 * @param {string} code
 * @returns {string}
 */
export function sharedActionUrl(code) {
  return `https://getquicker.net/sharedaction?code=${code}`;
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
function typeLabel(raw) {
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (typeof raw === 'number' && VAR_TYPE[raw]) return VAR_TYPE[raw];
  return '';
}

/**
 * @param {unknown} raw
 * @returns {Record<string, string> | undefined}
 */
function compactInputs(raw) {
  if (!isRecord(raw)) return undefined;
  /** @type {Record<string, string>} */
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    const k = key.trim();
    if (!k) continue;
    if (typeof value === 'string') {
      if (value.trim()) out[k] = value;
      continue;
    }
    if (!isRecord(value)) {
      if (value != null && String(value).trim()) out[k] = String(value);
      continue;
    }
    const varKey =
      typeof value.VarKey === 'string'
        ? value.VarKey.trim()
        : typeof value.varKey === 'string'
          ? value.varKey.trim()
          : '';
    const text =
      typeof value.Value === 'string'
        ? value.Value
        : typeof value.value === 'string'
          ? value.value
          : value.Value == null && value.value == null
            ? ''
            : String(value.Value ?? value.value ?? '');
    if (varKey) out[k] = `{${varKey}}`;
    else if (text.trim()) out[k] = text;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * @param {unknown} raw
 * @returns {Record<string, string> | undefined}
 */
function compactOutputs(raw) {
  if (!isRecord(raw)) return undefined;
  /** @type {Record<string, string>} */
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    const k = key.trim();
    if (!k || value == null) continue;
    if (typeof value === 'string') {
      if (value.trim()) out[k] = value.trim();
      continue;
    }
    if (isRecord(value)) {
      const varKey =
        typeof value.VarKey === 'string'
          ? value.VarKey.trim()
          : typeof value.varKey === 'string'
            ? value.varKey.trim()
            : typeof value.value === 'string'
              ? value.value.trim()
              : '';
      if (varKey) out[k] = varKey;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * @param {unknown} raw
 * @returns {StepWire | null}
 */
export function convertStep(raw) {
  if (!isRecord(raw)) return null;
  const key =
    (typeof raw.key === 'string' && raw.key.trim()) ||
    (typeof raw.StepRunnerKey === 'string' && raw.StepRunnerKey.trim()) ||
    (typeof raw.stepRunnerKey === 'string' && raw.stepRunnerKey.trim()) ||
    '';
  if (!key) return null;

  /** @type {StepWire} */
  const step = {key};
  const inputs = compactInputs(raw.inputs ?? raw.inputParams ?? raw.InputParams);
  const outputs = compactOutputs(
    raw.outputs ?? raw.outputParams ?? raw.OutputParams,
  );
  const note =
    (typeof raw.note === 'string' && raw.note.trim()) ||
    (typeof raw.Note === 'string' && raw.Note.trim()) ||
    '';
  const title =
    (typeof raw.title === 'string' && raw.title.trim()) ||
    (typeof raw.Title === 'string' && raw.Title.trim()) ||
    '';
  if (inputs) step.inputs = inputs;
  if (outputs) step.outputs = outputs;
  if (note) step.note = note;
  if (title) step.title = title;
  if (raw.disabled === true || raw.Disabled === true) step.disabled = true;

  const ifSteps = convertStepList(raw.ifSteps ?? raw.IfSteps);
  const elseSteps = convertStepList(raw.elseSteps ?? raw.ElseSteps);
  if (ifSteps.length) step.ifSteps = ifSteps;
  if (elseSteps.length) step.elseSteps = elseSteps;
  return step;
}

/**
 * @param {unknown} raw
 * @returns {StepWire[]}
 */
export function convertStepList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(convertStep).filter((step) => step != null);
}

/**
 * @param {unknown} raw
 * @returns {ProgramVar[]}
 */
export function convertVariables(raw) {
  if (!Array.isArray(raw)) return [];
  /** @type {ProgramVar[]} */
  const out = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const name =
      (typeof item.Key === 'string' && item.Key.trim()) ||
      (typeof item.key === 'string' && item.key.trim()) ||
      (typeof item.name === 'string' && item.name.trim()) ||
      '';
    if (!name) continue;
    const type = typeLabel(item.Type ?? item.type);
    const remark =
      (typeof item.Desc === 'string' && item.Desc.trim()) ||
      (typeof item.remark === 'string' && item.remark.trim()) ||
      '';
    /** @type {ProgramVar} */
    const row = {name};
    if (type) row.type = type;
    if (remark) row.remark = remark;
    out.push(row);
  }
  return out;
}

/**
 * @param {unknown} data
 * @returns {{steps: unknown, variables: unknown} | null}
 */
function unwrapProgram(data) {
  if (!isRecord(data)) return null;
  if (Array.isArray(data.Steps) || Array.isArray(data.steps)) {
    return {
      steps: data.Steps ?? data.steps,
      variables: data.Variables ?? data.variables,
    };
  }
  const payload = data.OperationPayload ?? data.operationPayload;
  if (isRecord(payload) && (Array.isArray(payload.Steps) || Array.isArray(payload.steps))) {
    return {
      steps: payload.Steps ?? payload.steps,
      variables: payload.Variables ?? payload.variables,
    };
  }
  return null;
}

/**
 * @param {unknown} dto
 * @returns {{ok: true, simple: boolean, reason?: string, example: object} | {ok: false, simple: false, reason: string}}
 */
export function convertSharedActionDto(dto) {
  if (!isRecord(dto)) {
    return {ok: false, simple: false, reason: 'empty-dto'};
  }
  const code =
    extractSharedCode(typeof dto.id === 'string' ? dto.id : '') ||
    extractSharedCode(typeof dto.Id === 'string' ? dto.Id : '');
  if (!code) {
    return {ok: false, simple: false, reason: 'missing-id'};
  }

  const children = dto.children ?? dto.Children;
  if (Array.isArray(children) && children.length > 0) {
    return {
      ok: false,
      simple: false,
      reason: 'has-children',
    };
  }

  const dataRaw = dto.data ?? dto.Data;
  if (typeof dataRaw !== 'string' || !dataRaw.trim()) {
    return {ok: false, simple: false, reason: 'no-data'};
  }

  let parsed;
  try {
    parsed = JSON.parse(dataRaw);
  } catch {
    return {ok: false, simple: false, reason: 'data-not-json'};
  }

  const program = unwrapProgram(parsed);
  if (!program) {
    return {ok: false, simple: false, reason: 'no-steps'};
  }

  const steps = convertStepList(program.steps);
  if (steps.length === 0) {
    return {ok: false, simple: false, reason: 'empty-steps'};
  }
  if (steps.length > MAX_SIMPLE_STEPS) {
    return {
      ok: false,
      simple: false,
      reason: `too-many-steps:${steps.length}`,
    };
  }

  const title =
    (typeof dto.title === 'string' && dto.title.trim()) ||
    (typeof dto.Title === 'string' && dto.Title.trim()) ||
    code;
  const description =
    (typeof dto.description === 'string' && dto.description.trim()) ||
    (typeof dto.Description === 'string' && dto.Description.trim()) ||
    (typeof dto.note === 'string' && dto.note.trim()) ||
    '';
  const author =
    (typeof dto.userNickName === 'string' && dto.userNickName.trim()) ||
    (typeof dto.UserNickName === 'string' && dto.UserNickName.trim()) ||
    '';

  return {
    ok: true,
    simple: true,
    example: {
      code,
      title,
      description: description || undefined,
      author: author || undefined,
      revision: typeof dto.revision === 'number' ? dto.revision : dto.Revision,
      source: sharedActionUrl(code),
      pulledAt: new Date().toISOString(),
      variables: convertVariables(program.variables),
      steps,
    },
  };
}
