'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('lab/automations/index.html', 'utf8');
const modelSource = fs.readFileSync('assets/lab/lab-automations-model-v5.js', 'utf8');
const source = fs.readFileSync('assets/lab/lab-automations-operations-v7.js', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-operations-v7.css', 'utf8');
const futureCss = fs.readFileSync('assets/lab/lab-automations-operations-v7-future.css', 'utf8');

assert.match(index, /lab-automations-operations-v7\.css\?v=20260819-v7ops1/);
assert.match(index, /lab-automations-operations-v7-future\.css\?v=20260819-v7ops1/);
assert.match(index, /lab-automations-operations-v7\.js\?v=20260819-v7ops2/);
assert.ok(index.indexOf('lab-automations-operations-v7.js') > index.indexOf('lab-automations-action-stack-v6.js'), 'v7 must load after accepted authoring layers');

for (const copy of [
  'Automation workspace',
  'READY TO TEST',
  'NEEDS SETUP',
  'RUNTIME LATER',
  'Manage Automations',
  'No Runtime history yet',
  'Local simulations never appear here as fake Runs',
  'Signal observed',
  'Current State matches',
  'Update Goal progress',
  'Wait for a State change'
]) assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

for (const boundary of [
  'These controls only change browser-local Lab definitions. They do not publish, execute or touch production.',
  'This is architectural discoverability only.',
  'Definition preview only',
  'EXECUTION',
  'OFF'
]) assert.match(source, new RegExp(boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.match(source, /CMXAutomationModelV5\.validate/);
assert.match(source, /CMXAutomationOperationsV7 = Object\.freeze/);
assert.match(source, /location\.reload\(\)/);
assert.match(source, /idMap\.get\(control\.afterActionId\)/);
assert.match(source, /sourceId: idMap\.get\(control\.source\.sourceId\)/);
assert.doesNotMatch(source, /fetch\s*\(/);
assert.doesNotMatch(source, /XMLHttpRequest/);
assert.doesNotMatch(source, /WebSocket\s*\(/);
assert.doesNotMatch(source, /EventSource\s*\(/);
assert.doesNotMatch(source, /eval\s*\(/);
assert.doesNotMatch(source, /new Function\s*\(/);

for (const selector of [
  '.v7-workspace-head',
  '.v7-operations-bar',
  '.v7-filter-group',
  '.v7-automation-row',
  '.v7-editor-status',
  '.v7-review-readiness',
  '.v7-manage-modal'
]) assert.ok(css.includes(selector), `Missing operations style ${selector}`);
assert.match(css, /\.v3-system-deck\{\s*display:none!important/);
assert.match(css, /@media\(max-width:760px\)/);
assert.match(css, /@media\(max-width:420px\)/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
assert.match(futureCss, /\.v7-future-capability/);
assert.match(futureCss, /@media\(max-width:680px\)/);

const memory = new Map();
global.localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null; },
  setItem(key, value) { memory.set(key, String(value)); },
  removeItem(key) { memory.delete(key); }
};
global.document = {
  documentElement: { dataset: {} },
  addEventListener() {},
  dispatchEvent() {},
  querySelector() { return null; },
  querySelectorAll() { return []; }
};
global.window = {
  addEventListener() {},
  dispatchEvent() {}
};
global.CustomEvent = function CustomEvent(type, init) { this.type = type; this.detail = init?.detail; };
global.requestAnimationFrame = function requestAnimationFrame() {};
global.location = { reload() {}, search: '' };

global.setTimeout = function setTimeoutStub() { return 1; };
global.clearTimeout = function clearTimeoutStub() {};

vm.runInThisContext(modelSource);
vm.runInThisContext(source);

const ops = window.CMXAutomationOperationsV7;
assert.ok(ops, 'v7 operations API should be exposed');
assert.equal(ops.futureCapabilities.length, 4);

const base = {
  id: 'auto-readiness',
  trigger: 'manual',
  conditions: [],
  ruleMode: 'all',
  actions: [{ id: 'step-notify', type: 'notify', content: 'Notify the selected person', enabled: true }],
  flowControls: [],
  timing: { mode: 'none', delay: { days: 0, hours: 0, minutes: 0 }, at: { date: '', time: '', timezone: 'UTC' } },
  repeatConfig: { mode: 'none', every: 1, unit: 'days', timezone: 'UTC' },
  outcome: 'end'
};

const needsAudience = ops.assess(base);
assert.equal(needsAudience.readiness, 'needs-setup');
assert(needsAudience.blockers.includes('Choose an audience'));

const ready = ops.assess({ ...base, actions: [{ ...base.actions[0], targetLabel: 'Primary contact' }] });
assert.equal(ready.readiness, 'ready');
assert.equal(ready.valid, true);

const needsSchedule = ops.assess({ ...base, trigger: 'calendar', actions: [{ ...base.actions[0], targetLabel: 'Primary contact' }] });
assert(needsSchedule.blockers.includes('Confirm schedule timing'));

const runtimeLater = ops.assess({
  ...base,
  actions: [
    { ...base.actions[0], id: 'step-one', targetLabel: 'Primary contact' },
    { id: 'step-two', type: 'manual_review', content: 'Review', enabled: true }
  ],
  flowControls: [{ id: 'wait-one', type: 'wait', afterActionId: 'step-one', duration: { days: 0, hours: 2, minutes: 0 }, enabled: true }]
});
assert.equal(runtimeLater.runtimeLater, true);
assert.equal(runtimeLater.waits, 1);

console.log('Continuum Automations operations v7 readiness, management, capability and responsive contracts passed.');