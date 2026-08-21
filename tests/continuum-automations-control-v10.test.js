'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('lab/automations/index.html', 'utf8');
const source = fs.readFileSync('assets/lab/lab-automations-control-v10.js', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-control-v10.css', 'utf8');
const history = fs.readFileSync('assets/lab/lab-automations-history-v1.js', 'utf8');

assert.match(index, /lab-automations-control-v10\.css\?v=20260821-v10control1/);
assert.match(index, /lab-automations-control-v10\.js\?v=20260821-v10control1/);
assert.match(index, /lab-automations-history-v1\.js\?v=20260821-history2/);
assert.ok(index.indexOf('lab-automations-control-v10.js') > index.indexOf('lab-automations-duplicate-guard-v9.js'));
assert.ok(index.indexOf('lab-automations-control-v10.js') < index.indexOf('lab-automations-history-v1.js'));

for (const text of [
  'overview','definition','runs','permissions','related','history','settings',
  'data-v10-card-menu','data-v10-exit','data-v10-tab','Delete local copy',
  'Runtime later','No execution authority in Lab','CMXAutomationControlV10',
  'labAutomationsControl="v10"','control-v10-duplicate','control-v10-lifecycle',
  'sourceId:map.get(c.source.sourceId)||c.source.sourceId'
]) assert.ok(source.includes(text), `Missing v10 source contract: ${text}`);

for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket(', 'EventSource(', 'eval(', 'new Function(', 'MutationObserver']) {
  assert.doesNotMatch(source, new RegExp(forbidden.replace('(', '\\(')));
}

for (const selector of [
  '.v10-card-shell','.v10-card-menu-button','.v10-object-bar','.v10-control-nav',
  '.v10-control-panel','.v10-popover','.v10-confirm-dialog','.v10-undo-toast',
  '[data-v10-view]:not([data-v10-view="definition"])'
]) assert.ok(css.includes(selector), `Missing v10 style: ${selector}`);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /@media\(max-width:390px\)/);
assert.match(css, /safe-area-inset-bottom/);
assert.match(css, /prefers-reduced-motion:reduce/);

assert.match(history, /controlView: editor \? editor\.dataset\.v10View \|\| "definition" : null/);
assert.match(history, /data-v10-tab/);
assert.match(history, /target\.controlView \|\| "definition"/);

const noop = () => {};
global.document = {
  documentElement: { dataset: {} },
  addEventListener: noop,
  dispatchEvent: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: { append: noop },
  activeElement: null
};
global.window = { addEventListener: noop, dispatchEvent: noop, CMXAutomationModelV5: null, CMXAutomationOperationsV7: null };
global.history = { state: null };
global.localStorage = { getItem: () => null, setItem: noop };
global.sessionStorage = { getItem: () => null, setItem: noop, removeItem: noop };
global.requestAnimationFrame = noop;
global.CustomEvent = function CustomEvent() {};
global.innerWidth = 1200;
global.innerHeight = 900;
vm.runInThisContext(source);

const api = window.CMXAutomationControlV10;
assert.ok(api, 'v10 helper API should be exposed');
assert.deepEqual(api.sections, ['overview','definition','runs','permissions','related','history','settings']);
assert.equal(api.triggerLabel({ trigger: 'calendar' }), 'Calendar time');
assert.equal(api.timingSummary({ timing: { mode: 'delay', delay: { days: 0, hours: 6, minutes: 30 } } }), 'Wait 6h 30m');
assert.equal(api.lifecycleLabel({ status: 'Archived' }), 'Archived');
assert.equal(api.deletionMeaning({ status: 'Draft' }).includes('browser-local draft copy'), true);
assert.deepEqual(api.relatedItems({ actions: [
  { targetRef: { kind: 'person', id: 'person-1' }, targetLabel: 'Jane' },
  { targetRef: { kind: 'person', id: 'person-1' }, targetLabel: 'Jane' },
  { type: 'action_ref', actionId: 'act-1', actionLabel: 'Send briefing' }
] }), [
  { kind: 'person', id: 'person-1', label: 'Jane' },
  { kind: 'action', id: 'act-1', label: 'Send briefing' }
]);

console.log('Continuum Automations control surface v10 contracts passed.');
