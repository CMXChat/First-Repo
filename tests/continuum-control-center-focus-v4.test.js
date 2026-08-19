'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('lab/control/index.html', 'utf8');
const init = fs.readFileSync('assets/lab/control-center-theme-init.js', 'utf8');
const focus = fs.readFileSync('assets/lab/control-center-focus-v4.js', 'utf8');
const css = fs.readFileSync('assets/lab/control-center-focus-v4.css', 'utf8');

assert.match(html, /control-center-focus-v4\.css\?v=20260819-1/);
assert.match(html, /control-center-focus-v4\.js\?v=20260819-3/);
assert.ok(
  html.indexOf('control-center-focus-v4.js') > html.indexOf('control-center-v1.js'),
  'focus containment must load after the Control Center interaction layer'
);
assert.match(init, /continuum-control-center-theme-v1/);
assert.doesNotMatch(init, /control-center-focus-v4/);

assert.match(focus, /function bootFocusLayer\(\)/);
assert.match(focus, /DOMContentLoaded/);
assert.match(focus, /node\.inert = true/);
assert.match(focus, /aria-hidden/);
assert.match(focus, /function trapTab\(event\)/);
assert.match(focus, /MutationObserver/);
assert.match(focus, /aria-modal/);
assert.match(focus, /aria-haspopup/);
assert.match(focus, /currentIsUseful/);
assert.match(focus, /cc-focus-return-pulse/);
assert.match(focus, /dataset\.controlCenterFocus = 'v4'/);
assert.doesNotMatch(focus, /fetch\s*\(/);
assert.doesNotMatch(focus, /XMLHttpRequest/);
assert.doesNotMatch(focus, /WebSocket\s*\(/);
assert.doesNotMatch(focus, /EventSource\s*\(/);

assert.match(css, /:focus-visible/);
assert.match(css, /body\.cc-drawer-open/);
assert.match(css, /body\.cc-command-open/);
assert.match(css, /safe-area-inset-bottom/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(css, /url\(https?:/i);

console.log('Continuum Control Center v4 explicit focus containment contract passed.');