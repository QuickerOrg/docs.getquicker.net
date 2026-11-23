#!/usr/bin/env node
/**
 * Semantic validator for Quicker V2 ActionItem2 JSON against data/xaction/catalog.json.
 *
 * Usage:
 *   node tools/xaction-docs/validate-action-json.mjs --examples
 *   node tools/xaction-docs/validate-action-json.mjs path/to/action.json
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const BUILTIN_VARS = new Set(['quicker_in_param', '_context']);

export function loadCatalog(catalogPath = path.join(repoRoot, 'data', 'xaction', 'catalog.json')) {
  const raw = fs.readFileSync(catalogPath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

export function extractTemplateVarRefs(valueStr) {
  if (typeof valueStr !== 'string') return [];
  const isExpr = valueStr.startsWith('$=');
  const isInterp = valueStr.startsWith('$$');
  if (!isExpr && !isInterp) return [];
  const refs = [];
  for (const m of valueStr.slice(2).matchAll(/\{([A-Za-z_\u4e00-\u9fff][A-Za-z0-9_\u4e00-\u9fff]*)\}/g)) {
    refs.push(m[1]);
  }
  return refs;
}

export function validateActionJson(action, catalog) {
  const errors = [];
  const warnings = [];
  const fail = (msg) => errors.push(msg);

  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    fail('根节点必须为 JSON 对象。');
    return {valid: false, errors, warnings};
  }
  if (action.OperationType !== 'xAction') {
    fail(`OperationType 必须为 "xAction"，当前为 ${JSON.stringify(action.OperationType)}`);
  }
  const payload = action.OperationPayload;
  if (!payload || typeof payload !== 'object') {
    fail('缺少 OperationPayload 对象。');
    return {valid: false, errors, warnings};
  }
  if (payload.PayloadType !== 'xAction') {
    fail(`OperationPayload.PayloadType 必须为 "xAction"，当前为 ${JSON.stringify(payload.PayloadType)}`);
  }
  if (!Array.isArray(payload.Variables)) {
    fail('OperationPayload.Variables 必须为数组。');
  }
  if (!Array.isArray(payload.Steps)) {
    fail('OperationPayload.Steps 必须为数组。');
  }
  if (errors.length) return {valid: false, errors, warnings};

  const modulesByKey = new Map((catalog.modules ?? []).map((m) => [m.key, m]));
  const varKeys = new Set();
  for (const [idx, v] of payload.Variables.entries()) {
    if (!v || typeof v.Key !== 'string' || !v.Key.trim()) {
      fail(`Variables[${idx}] 缺少有效 Key。`);
    } else if (varKeys.has(v.Key)) {
      fail(`Variables 存在重复变量 Key: "${v.Key}"`);
    } else {
      varKeys.add(v.Key);
    }
  }

  const checkVarExists = (name, loc) => {
    if (!varKeys.has(name) && !BUILTIN_VARS.has(name)) {
      fail(`${loc}: 引用了未在 Variables 中声明的变量 "{${name}}" / VarKey "${name}"`);
    }
  };

  const walkSteps = (steps, trace) => {
    if (!Array.isArray(steps)) return;
    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      const stepLoc = `${trace}[${i}]`;
      if (!step || typeof step !== 'object') {
        fail(`${stepLoc}: 步骤必须为对象`);
        continue;
      }
      const modKey = step.StepRunnerKey;
      const mod = modulesByKey.get(modKey);
      if (!mod) {
        fail(`${stepLoc}: 未知 StepRunnerKey "${modKey}"（不在 catalog.json 中）`);
        continue;
      }
      const inputMap = new Map((mod.inputs ?? []).map((p) => [p.key, p]));
      const outputMap = new Map((mod.outputs ?? []).map((o) => [o.key, o]));

      const inputs = step.InputParams ?? {};
      if (typeof inputs !== 'object' || Array.isArray(inputs)) {
        fail(`${stepLoc} (${modKey}): InputParams 必须为对象`);
      } else {
        for (const [paramKey, entry] of Object.entries(inputs)) {
          const paramDef = inputMap.get(paramKey);
          const pLoc = `${stepLoc} (${modKey}).InputParams.${paramKey}`;
          if (!paramDef) {
            fail(`${pLoc}: 模块 ${modKey} 不存在输入参数 "${paramKey}"`);
            continue;
          }
          if (!entry || typeof entry !== 'object') {
            fail(`${pLoc}: 参数值条目必须为对象 ({ "Value": "..." } 或 { "VarKey": "..." })`);
            continue;
          }
          const hasValue = entry.Value !== undefined;
          const hasVarKey = typeof entry.VarKey === 'string' && entry.VarKey.length > 0;
          if (!hasValue && !hasVarKey) {
            fail(`${pLoc}: 必须提供 Value 或 VarKey`);
            continue;
          }
          if (hasValue && typeof entry.Value !== 'string') {
            fail(`${pLoc}: Value 必须保持字符串格式`);
          }
          if (paramDef.variableMode === 'Input' && hasVarKey) {
            fail(`${pLoc}: 参数为 Input 模式，禁止使用 VarKey`);
          }
          if (paramDef.variableMode === 'UseVar' && hasValue) {
            fail(`${pLoc}: 参数为 UseVar 模式，禁止使用字面量 Value，请改用 VarKey`);
          }
          if (hasVarKey) {
            checkVarExists(entry.VarKey, pLoc);
          }
          if (hasValue && typeof entry.Value === 'string') {
            for (const ref of extractTemplateVarRefs(entry.Value)) {
              checkVarExists(ref, pLoc);
            }
            const isDynamic = entry.Value.startsWith('$=') || entry.Value.startsWith('$$');
            const sel = mod.selections?.[paramKey];
            if (!isDynamic && paramDef.type === 'Enum' && sel?.items?.length) {
              const allowed = new Set(sel.items.map((it) => it.value));
              if (!allowed.has(entry.Value)) {
                fail(`${pLoc}: 枚举值 "${entry.Value}" 不在模块可选列表中（可选：${[...allowed].join(', ')}）`);
              }
            }
          }
        }
      }

      const outputs = step.OutputParams ?? {};
      if (typeof outputs !== 'object' || Array.isArray(outputs)) {
        fail(`${stepLoc} (${modKey}): OutputParams 必须为对象`);
      } else {
        for (const [outKey, varName] of Object.entries(outputs)) {
          const oLoc = `${stepLoc} (${modKey}).OutputParams.${outKey}`;
          if (!outputMap.has(outKey)) {
            fail(`${oLoc}: 模块 ${modKey} 不存在输出参数 "${outKey}"`);
          }
          if (typeof varName !== 'string' || !varName) {
            fail(`${oLoc}: 输出目标变量名必须为非空字符串`);
          } else {
            checkVarExists(varName, oLoc);
          }
        }
      }

      if (step.IfSteps != null) {
        if (!Array.isArray(step.IfSteps)) fail(`${stepLoc}: IfSteps 必须为数组`);
        else walkSteps(step.IfSteps, `${stepLoc}.IfSteps`);
      }
      if (step.ElseSteps != null) {
        if (!Array.isArray(step.ElseSteps)) fail(`${stepLoc}: ElseSteps 必须为数组`);
        else walkSteps(step.ElseSteps, `${stepLoc}.ElseSteps`);
      }
    }
  };

  walkSteps(payload.Steps, 'Steps');
  if (Array.isArray(payload.SubPrograms)) {
    for (const [i, sub] of payload.SubPrograms.entries()) {
      if (Array.isArray(sub?.Steps)) walkSteps(sub.Steps, `SubPrograms[${i}].Steps`);
    }
  }

  return {valid: errors.length === 0, errors, warnings};
}

export function extractMarkdownJsonExamples(mdPath = path.join(repoRoot, 'data', 'xaction', 'ai-action-json-examples.md')) {
  const md = fs.readFileSync(mdPath, 'utf8');
  const blocks = [];
  for (const m of md.matchAll(/```json\s*\r?\n([\s\S]*?)\r?\n```/g)) {
    blocks.push(JSON.parse(m[1]));
  }
  return blocks;
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
  const catalog = loadCatalog();
  const arg = process.argv[2];
  if (arg === '--examples') {
    const blocks = extractMarkdownJsonExamples();
    if (!blocks.length) {
      console.error('ai-action-json-examples.md 未找到任何 ```json 代码块。');
      process.exit(1);
    }
    let failed = 0;
    blocks.forEach((doc, idx) => {
      const res = validateActionJson(doc, catalog);
      if (!res.valid) {
        failed++;
        console.error(`示例 #${idx + 1} 校验失败：\n` + res.errors.map((e) => `  - ${e}`).join('\n'));
      }
    });
    if (failed > 0) process.exit(1);
    console.log(`AI 动作 JSON 示例语义校验通过：共验证 ${blocks.length} 份完整示例。`);
  } else if (arg) {
    const target = JSON.parse(fs.readFileSync(path.resolve(arg), 'utf8').replace(/^\uFEFF/, ''));
    const res = validateActionJson(target, catalog);
    if (!res.valid) {
      console.error('校验失败：\n' + res.errors.map((e) => `- ${e}`).join('\n'));
      process.exit(1);
    }
    console.log('校验通过。');
  } else {
    console.error('用法：node tools/xaction-docs/validate-action-json.mjs --examples | <action.json>');
    process.exit(2);
  }
}
