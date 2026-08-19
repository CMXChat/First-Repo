'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const init = fs.readFileSync('assets/lab/control-center-theme-init.js', 'utf8');
const focus = fs.readFileSync('assets/lab/control-center-focus-v4.js', 'utf8');
const css = fs.readFileSync('assets/lab/control-center-focus-v4.css', 'utf8');

assert.match(init, /control-center-focus-v4\.css\?v=20260819-1/);
assert.match(init, /control-center-focus-v4\.js\?v=20260819-2/);
assert.match(init, /data-cc-focus-v4/);

assert.match(focus, /function bootFocusLayer\(\)/);
assert.match(focus, /DOMContentLoaded/);
assert.match(focus, /node\.inert = true/);
assert.match(focus, /aria-hidden/);
assert.match(focus, /function trapTab\(event\)/);
assert.match(focus, /MutationObserver/);
assert.match(focus, /aria-modal/);
assert.match(focus, /aria-haspopup/);
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

console.log('Continuum Control Center v4 focus containment contract passed.');
