'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('lab/automations/index.html', 'utf8');
const source = fs.readFileSync('assets/lab/lab-automations-duplicate-guard-v9.js', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-duplicate-guard-v9.css', 'utf8');

assert.match(index, /lab-automations-duplicate-guard-v9\.css\?v=20260819-v9guard1/);
assert.match(index, /lab-automations-duplicate-guard-v9\.js\?v=20260819-v9guard2/);
assert.ok(index.indexOf('lab-automations-duplicate-guard-v9.js') > index.indexOf('lab-automations-editor-focus-v8.js'), 'duplicate guard must load after accepted v8 editor focus');

for (const copy of [
  'already in flow',
  'Add another',
  'Repeating the same capability is fine when it serves a different person, stage or instruction.',
  'Possible duplicate',
  'Keep it only if you mean to repeat the same step.'
]) assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.match(source, /data-choose-inline/);
assert.match(source, /v9DuplicateBypass/);
assert.match(source, /event\.stopImmediatePropagation\(\)/);
assert.match(source, /dataset\.v9ExactDuplicate/);
assert.match(source, /Email \$\{target\}/);
assert.match(source, /Notify \$\{target\}/);
assert.match(source, /v5 rebuilds its ordered sequence three animation frames after editor changes/);
assert.match(source, /requestAnimationFrame\(\(\) => requestAnimationFrame\(\(\) => requestAnimationFrame\(\(\) => requestAnimationFrame\(patch\)\)\)\)/);
assert.match(source, /dataset\.labAutomationsDuplicateGuard = "v9"/);
assert.match(source, /CMXAutomationDuplicateGuardV9 = Object\.freeze/);

for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket(', 'EventSource(', 'eval(', 'new Function(', 'MutationObserver']) {
  assert.doesNotMatch(source, new RegExp(forbidden.replace('(', '\\(')));
}

for (const selector of [
  '.v9-existing-count',
  '.v9-exact-duplicate',
  '.v9-duplicate-backdrop',
  '.v9-duplicate-dialog',
  '.v9-duplicate-actions'
]) assert.ok(css.includes(selector), `Missing duplicate guard style ${selector}`);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /@media\(max-width:390px\)/);
assert.match(css, /env\(safe-area-inset-bottom\)/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);

const noop = () => {};
global.document = {
  documentElement: { dataset: {} },
  addEventListener: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: { append: noop }
};
global.window = { addEventListener: noop };
global.requestAnimationFrame = noop;
vm.runInThisContext(source);

const api = window.CMXAutomationDuplicateGuardV9;
assert.ok(api, 'duplicate guard helper API should be exposed');
assert.equal(api.kindFromLabel('Send email'), 'email');
assert.equal(api.kindFromLabel('Email'), 'email');
assert.equal(api.kindFromLabel('Notify a person'), 'notify');
assert.equal(api.describe('email', 'Hassan'), 'Email Hassan');
assert.equal(api.describe('notify', 'Primary contact'), 'Notify Primary contact');
assert.equal(api.describe('manual_review'), 'Manual review');
assert.equal(api.normalize('  Same   Instruction  '), 'same instruction');

console.log('Continuum Automations duplicate guard v9 contracts passed.');