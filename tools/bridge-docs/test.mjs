import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateExample, validateEvidenceDate, check} from './check.mjs';

validateEvidenceDate('2026-09-05 22:23:16', '2026-09-27 13:34:42');
validateEvidenceDate('2026-09-05 22:23:16', '2026-09-05 22:23:16');
assert.throws(() => validateEvidenceDate('2026-09-27 13:34:42', '2026-09-05 22:23:16'));
assert.throws(() => validateEvidenceDate('invalid', '2026-09-27 13:34:42'));

const module = JSON.parse(fs.readFileSync(new URL('../../data/xaction/modules/sys_autocadcontrol.json', import.meta.url), 'utf8'));
const example = {command: 'bridge.ping', inputs: {connection: 'bridge', bridgeOperation: 'bridge.ping'}, outputKey: 'output'};
validateExample(example, module);
assert.throws(() => validateExample({...example, inputs: {...example.inputs, connection: 'agent'}}, module));
assert.throws(() => validateExample({...example, inputs: {...example.inputs, bridgeOperation: 'not-a-command'}}, module));
assert.throws(() => validateExample({...example, inputs: {...example.inputs, typo: 'value'}}, module));
assert.throws(() => validateExample({...example, outputKey: 'missing'}, module));
assert.equal(check(), 16);
console.log('Bridge 示例反例与整站映射检查通过。');
