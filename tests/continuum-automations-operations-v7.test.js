'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('lab/automations/index.html', 'utf8');
const modelSource = fs.readFileSync('assets/lab/lab-automations-model-v5.js', 'utf8');
const source = fs.readFileSync('assets/lab/lab-automations-operations-v7.js', 'utf8');
const polish = fs.readFileSync('assets/lab/lab-automations-operations-v7-polish.js', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-operations-v7.css', 'utf8');
const futureCss = fs.readFileSync('assets/lab/lab-automations-operations-v7-future.css', 'utf8');
const polishCss = fs.readFileSync('assets/lab/lab-automations-operations-v7-polish.css', 'utf8');

assert.match(index, /lab-automations-operations-v7\.css\?v=20260819-v7ops1/);
assert.match(index, /lab-automations-operations-v7-future\.css\?v=20260819-v7ops1/);
assert.match(index, /lab-automations-operations-v7-polish\.css\?v=20260819-v7ops2/);
assert.match(index, /lab-automations-operations-v7\.js\?v=20260819-v7ops2/);
assert.match(index, /lab-automations-operations-v7-polish\.js\?v=20260819-v7ops4/);
assert.ok(index.indexOf('lab-automations-operations-v7.js') > index.indexOf('lab-automations-action-stack-v6.js'), 'v7 must load after accepted authoring layers');
assert.ok(index.indexOf('lab-automations-operations-v7-polish.js') > index.indexOf('lab-automations-operations-v7.js'), 'v7 chrome polish must load last');

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

assert.match(polish, /LAB · AUTOMATIONS/);
assert.match(polish, /LAB · EXECUTION OFF/);
assert.match(polish, /PLANNER · LOCAL PREVIEW/);
assert.match(polish, /Create a local typed proposal before opening the Draft/);
assert.match(polish, /No model call or provider action occurs/);
assert.match(polish, /brand\.href = "\/lab\/control\/"/);
assert.match(polish, /Back to Continuum Control Center/);
assert.match(polish, /dataset\.v7OpenPlanner/);
assert.match(polish, /function openPlanner\(\)/);
assert.match(polish, /data-v4-start='planner'/);
assert.match(polish, /function patchDraftSummary\(\)/);
assert.match(polish, /filter\(item => \(item\.status \|\| "Draft"\) === "Draft"\)/);
assert.match(polish, /aria-labelledby/);
assert.match(polish, /\.v7-manage-backdrop/);
assert.match(polish, /function collapseStackedCatalogModals\(\)/);
assert.match(polish, /restoreManageFocus/);
assert.match(polish, /dataset\.labAutomationsOperationsPolish = "v7"/);

for (const checkedSource of [source, polish]) {
  assert.doesNotMatch(checkedSource, /fetch\s*\(/);
  assert.doesNotMatch(checkedSource, /XMLHttpRequest/);
  assert.doesNotMatch(checkedSource, /WebSocket\s*\(/);
  assert.doesNotMatch(checkedSource, /EventSource\s*\(/);
  assert.doesNotMatch(checkedSource, /eval\s*\(/);
  assert.doesNotMatch(checkedSource, /new Function\s*\(/);
  assert.doesNotMatch(checkedSource, /MutationObserver/);
}

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
assert.match(polishCss, /\.v7-planner-button/);
assert.match(polishCss, /grid-template-columns:minmax\(0,1fr\) auto auto/);
assert.match(polishCss, /@media\(max-width:760px\)/);
assert.match(polishCss, /@media\(max-width:420px\)/);

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
  querySelectorAll() { return []; },
  createElement() { return { dataset: {}, setAttribute() {}, append() {} }; }
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
vm.runInThisContext(polish);

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

console.log('Continuum Automations operations v7 readiness, management, capability, Planner, chrome and responsive contracts passed.');