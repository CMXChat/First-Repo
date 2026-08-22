'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const exact = fs.readFileSync('assets/continuum-exact-reference-v1.js', 'utf8');
const directoryInit = fs.readFileSync('assets/lab/directory-theme-init.js', 'utf8');
const libraryInit = fs.readFileSync('assets/lab/library-theme-init.js', 'utf8');
const control = fs.readFileSync('assets/control/control-runtime-history-v1.js', 'utf8');

assert.match(exact, /person_id/);
assert.match(exact, /content_id/);
assert.match(exact, /data-server-person/);
assert.match(exact, /data-library-content-id/);
assert.match(exact, /continuumExactReference = 'focused'/);
assert.match(exact, /continuumExactReference = 'missing'/);
assert.match(exact, /MutationObserver/);
assert.match(exact, /node\.click\(\)/);
assert.doesNotMatch(exact, /fetch\s*\(/);
assert.doesNotMatch(exact, /localStorage|sessionStorage/);

for (const init of [directoryInit, libraryInit]) {
  assert.match(init, /continuum-exact-reference-v1\.js\?v=20260822-1/);
  assert.match(init, /data-continuum-exact-reference/);
}

assert.match(control, /\/directory\/\?person_id=/);
assert.match(control, /\/library\/\?content_id=/);

console.log('Continuum cross-surface exact-reference navigation contract passed.');
