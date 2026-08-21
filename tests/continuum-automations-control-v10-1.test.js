'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('lab/automations/index.html', 'utf8');
const source = fs.readFileSync('assets/lab/lab-automations-control-v10-1.js', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-control-v10-1.css', 'utf8');

assert.match(index, /lab-automations-control-v10-1\.css\?v=20260821-v101control1/);
assert.match(index, /lab-automations-control-v10-1\.js\?v=20260821-v101control1/);
assert.ok(index.indexOf('lab-automations-control-v10-1.js') > index.indexOf('lab-automations-history-v1.js'));

for (const term of [
  'AI INVOLVEMENT · LAB PREVIEW',
  'Participation is not authority',
  'Per-step exceptions',
  'cmx-lab-automation-ai-participation-v1',
  'data-v101-ai-mode',
  'DEPENDENCY CHECK · LAB LOCAL',
  'Remove anyway in Lab',
  'Trigger is structural',
  'CMXAutomationControlV101',
  'dependenciesFor',
]) assert.ok(source.includes(term), `Missing v10.1 source contract: ${term}`);

for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket(', 'EventSource(', 'eval(', 'new Function(', 'MutationObserver']) {
  assert.doesNotMatch(source, new RegExp(forbidden.replace('(', '\\(')));
}

for (const selector of [
  '.v101-ai-mode-list',
  '.v101-ai-boundary',
  '.v101-structural-note',
  '.v101-dependency-layer',
  '.v101-dependency-dialog',
  '.v101-dependency-actions',
]) assert.ok(css.includes(selector), `Missing v10.1 style: ${selector}`);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /safe-area-inset-bottom/);
assert.match(css, /prefers-reduced-motion:reduce/);

const noop = () => {};
global.document = {
  documentElement: { dataset: {} },
  addEventListener: noop,
  dispatchEvent: noop,
  querySelector: () => null,
  body: { append: noop },
};
global.window = { addEventListener: noop };
global.history = { state: null };
global.localStorage = { getItem: () => null, setItem: noop };
global.requestAnimationFrame = noop;
global.CustomEvent = function CustomEvent() {};
vm.runInThisContext(source);

const api = window.CMXAutomationControlV101;
assert.ok(api, 'v10.1 helper API should be exposed');
assert.deepEqual(api.modes.map(item => item.value), ['off','writing','advisory','planning','explicit','preauthorized']);

const automation = {
  conditions: [
    { id: 'condition-1', source: { sourceType: 'step', sourceId: 'step-1', path: 'output.priority' } },
  ],
  actions: [
    { id: 'step-1', type: 'ai_task' },
    { id: 'step-2', type: 'email', inputBindings: [{ targetField: 'body', source: { sourceType: 'step', sourceId: 'step-1', path: 'output.summary' } }] },
  ],
  flowControls: [
    { id: 'wait-1', type: 'wait', afterActionId: 'step-1' },
    { id: 'condition-2', type: 'condition', afterActionId: 'step-1', source: { sourceType: 'step', sourceId: 'step-1', path: 'output.status' } },
  ],
};

const dependencies = api.dependenciesFor(automation, 'step-1');
assert.ok(dependencies.length >= 4, 'dependent step should expose multiple impact findings');
assert.ok(dependencies.some(item => /IF condition 1/.test(item.label)));
assert.ok(dependencies.some(item => /WAIT is anchored/.test(item.label)));
assert.ok(dependencies.some(item => /Step 2 uses this step through inputBindings/.test(item.label)));
assert.deepEqual(api.dependenciesFor({ actions: [{ id: 'step-1' }] }, 'step-1'), []);

console.log('Continuum Automations control v10.1 contracts passed.');
