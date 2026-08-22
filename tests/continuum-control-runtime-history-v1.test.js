'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('control/index.html', 'utf8');
const api = fs.readFileSync('assets/continuum-operator-api-v1.js', 'utf8');
const js = fs.readFileSync('assets/control/control-runtime-history-v1.js', 'utf8');
const css = fs.readFileSync('assets/control/control-runtime-history-v1.css', 'utf8');

assert.match(html, /connect-src 'self' https:\/\/api\.cmxchat\.com http:\/\/localhost:8000/);
assert.match(html, /assets\/continuum-operator-api-v1\.js/);
assert.match(html, /assets\/control\/control-runtime-history-v1\.js/);
assert.match(html, /assets\/control\/control-runtime-history-v1\.css/);
assert.match(html, /href="\/control\/"/);
assert.match(html, /href="\/directory\/"/);
assert.match(html, /href="\/library\/"/);
assert.match(html, /href="\/automations\/"/);
assert.doesNotMatch(html, /href="\/lab\/(?:control\/|automations\/|\")/);

assert.match(api, /listAutomations:/);
assert.match(api, /listRuns:/);
assert.match(api, /async function getReceipt\(/);
assert.match(api, /\n\s*getReceipt,\n/);
assert.match(js, /Runtime history & receipts/);
assert.match(js, /listAutomations\(\)/);
assert.match(js, /listRuns\(/);
assert.match(js, /getReceipt\(/);
assert.match(js, /frozen_email/);
assert.match(js, /automation_version_id/);
assert.match(js, /content_version_id/);
assert.match(js, /content_checksum_sha256/);
assert.match(js, /authority_mode/);
assert.match(js, /trigger_occurrence_id/);
assert.match(js, /reconciliation_status/);
assert.match(js, /Why \/ execution timeline/);
assert.match(js, /NOT DEPLOYED|not_deployed/i);
assert.match(js, /No browser-local Runtime substitute/);
assert.match(js, /read-only Control surface never retries or resends/i);
assert.doesNotMatch(js, /api\.requestRun\(/);
assert.doesNotMatch(js, /api\.processRun\(/);
assert.doesNotMatch(js, /api\.cancel/);
assert.doesNotMatch(js, /localStorage|sessionStorage/);
assert.doesNotMatch(js, /fetch\s*\(/);
assert.match(css, /\.cc-runtime-proof/);
assert.match(css, /@media\(max-width:580px\)/);

console.log('Continuum Control protected Runtime history source contract passed.');
