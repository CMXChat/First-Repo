'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('automations/index.html', 'utf8');
const mobile = fs.readFileSync('assets/lab/lab-automations-mobile-focus-v8.css', 'utf8');
const desktop = fs.readFileSync('assets/lab/lab-automations-editor-focus-v8.css', 'utf8');

assert.match(index, /lab-automations-editor-focus-v8\.css\?v=20260819-v8focus1/);
assert.match(index, /lab-automations-mobile-focus-v8\.css\?v=20260819-v8mobile1/);
assert.ok(
  index.indexOf('lab-automations-mobile-focus-v8.css') > index.indexOf('lab-automations-editor-focus-v8.css'),
  'mobile focus overrides must load after desktop focus'
);

assert.match(mobile, /@media \(max-width:760px\)/);
assert.match(mobile, /\.v3-editor-head\{\s*position:static/);
assert.match(mobile, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(mobile, /content:"LAB · OFF"/);
assert.match(mobile, /\.v3-step-context\{\s*display:none/);
assert.match(mobile, /\.v3-stage-rail button\{[\s\S]*?min-height:44px/);
assert.match(mobile, /\.v3-editor-footer button\{[\s\S]*?min-height:48px/);
assert.match(mobile, /@media \(max-width:390px\)/);

assert.match(desktop, /@media \(min-width:980px\)/);
assert.match(desktop, /@media \(max-width:979px\)\{[\s\S]*?\.v8-flow-toggle\{display:none!important\}/);

console.log('Continuum Automations v8 mobile-first editor chrome contract passed.');
