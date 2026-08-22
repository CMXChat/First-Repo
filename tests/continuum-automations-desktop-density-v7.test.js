'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('automations/index.html', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-operations-v7-desktop-density.css', 'utf8');

assert.match(index, /lab-automations-operations-v7-desktop-density\.css\?v=20260819-v7density1/);
assert.ok(index.indexOf('lab-automations-operations-v7-desktop-density.css') > index.indexOf('lab-automations-operations-v7-polish.css'), 'desktop density overrides must load after the accepted v7 polish layer');
assert.match(css, /@media \(min-width:980px\)/);
assert.match(css, /body:has\(\.v3-editor-page\) \.v3-topbar/);
assert.match(css, /min-height:52px/);
assert.match(css, /\.v7-editor-status/);
assert.match(css, /min-height:22px/);
assert.match(css, /\.v3-stage-rail/);
assert.match(css, /min-height:36px/);
assert.match(css, /grid-template-columns:minmax\(0,1fr\) 300px/);
assert.match(css, /\.v3-editor-main/);
assert.match(css, /max-width:none/);
assert.match(css, /\.v3-live-panel/);
assert.match(css, /top:151px/);
assert.match(css, /\.v3-editor-footer/);
assert.match(css, /min-height:42px/);
assert.doesNotMatch(css, /@media\s*\(max-width:/);

console.log('Continuum Automations desktop editor density contract passed.');
