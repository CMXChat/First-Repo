'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('lab/directory/index.html', 'utf8');
const css = fs.readFileSync('assets/lab/directory-app-v1.css', 'utf8');
const js = fs.readFileSync('assets/lab/directory-app-v1.js', 'utf8');
const theme = fs.readFileSync('assets/lab/directory-theme-init.js', 'utf8');

assert.match(html, /<title>Continuum · Directory<\/title>/);
assert.match(html, /Identity &amp; relationships · sample data/);
assert.match(html, /People/);
assert.match(html, /Organizations/);
assert.match(html, /Groups/);
assert.match(html, /Plan changes/);
assert.match(html, /AI setup · Preview only/);
assert.match(html, /Browser-local sample identity data only/);
assert.match(html, /href="\/lab\/control\/"/);
assert.match(html, /href="\/lab\/directory\/" aria-current="page"/);
assert.match(html, /href="\/lab\/automations\/"/);
assert.match(html, /href="\/checkin\/"/);
assert.match(html, /directory-theme-init\.js\?v=20260819-1/);
assert.match(html, /directory-app-v1\.css\?v=20260819-1/);
assert.match(html, /directory-app-v1\.js\?v=20260819-1/);
assert.doesNotMatch(html, /https:\/\/api\.cmxchat\.com/);
assert.doesNotMatch(html, /<script(?![^>]*src=)[^>]*>/i);
assert.doesNotMatch(html, /<style[\s>]/i);

assert.match(css, /--bg:#060708/);
assert.match(css, /\.dir-grid/);
assert.match(css, /\.dir-mobile-nav/);
assert.match(css, /\.dir-command-overlay/);
assert.match(css, /\.dir-dialog/);
assert.match(css, /@media\(max-width:880px\)/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(css, /url\(https?:/i);

assert.doesNotThrow(() => new Function(js), 'Directory app JS must parse');
assert.match(js, /cmx-lab-crm-v1/);
assert.match(js, /continuum-directory-ui-v1/);
assert.match(js, /function normalizeStore/);
assert.match(js, /function resolveGroup/);
assert.match(js, /function readiness/);
assert.match(js, /function duplicateCount/);
assert.match(js, /function automationUsage/);
assert.match(js, /function renderPerson/);
assert.match(js, /function renderOrganization/);
assert.match(js, /function renderGroup/);
assert.match(js, /Relationship ≠ permission/);
assert.match(js, /No model call occurred/);
assert.match(js, /No record, Group, authority grant, Automation, or server state was changed/);
assert.match(js, /window\.location\.href/);
assert.doesNotMatch(js, /fetch\s*\(/);
assert.doesNotMatch(js, /XMLHttpRequest/);
assert.doesNotMatch(js, /WebSocket\s*\(/);
assert.doesNotMatch(js, /EventSource\s*\(/);
assert.match(theme, /continuum-directory-theme-v1/);

console.log('Continuum standalone Directory v1 structure, safety, parse and responsive contracts passed.');
