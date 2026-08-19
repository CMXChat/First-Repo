'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('lab/control/index.html', 'utf8');
const css = fs.readFileSync('assets/lab/control-center-v1.css', 'utf8');
const polish = fs.readFileSync('assets/lab/control-center-mobile-polish-v2.css', 'utf8');
const js = fs.readFileSync('assets/lab/control-center-v1.js', 'utf8');
const theme = fs.readFileSync('assets/lab/control-center-theme-init.js', 'utf8');

assert.match(html, /<title>Continuum · Control Center<\/title>/);
assert.match(html, /CONTROL CENTER · LAB/);
assert.match(html, /sample and prototype state/i);
assert.match(html, /does not claim production Runtime/i);
assert.match(html, /Observe only · execution off/);
assert.match(html, /Now · Sample state/);
assert.match(html, /Stable\. 2 things need review\./);
assert.match(html, /2 need you/);
assert.match(html, /Attention/);
assert.match(html, /Running &amp; waiting/);
assert.match(html, /Continuity · Sample projection/);
assert.match(html, /Connections &amp; sources/);
assert.match(html, /Why did Continuum do that\?/);
assert.match(html, /Simulation · Lab only/);
assert.match(html, /I disappear for 7 days/);
assert.match(html, /data-cc-tab="now"/);
assert.match(html, /data-cc-tab="upcoming"/);
assert.match(html, /data-cc-tab="history"/);
assert.match(html, /data-cc-tab="activity"/);
assert.match(html, /data-cc-tab-link="activity"/);
assert.match(html, /href="\/checkin\/"/);
assert.match(html, /href="\/lab\/automations\/"/);
assert.match(html, /control-center-theme-init\.js\?v=20260819-1/);
assert.match(html, /control-center-v1\.css\?v=20260819-1/);
assert.match(html, /control-center-mobile-polish-v2\.css\?v=20260819-2/);
assert.match(html, /control-center-v1\.js\?v=20260819-2/);
assert.ok(
  html.indexOf('control-center-mobile-polish-v2.css') > html.indexOf('control-center-v1.css'),
  'device-review polish must load after base Control Center styles'
);
assert.doesNotMatch(html, /https:\/\/api\.cmxchat\.com/);
assert.doesNotMatch(html, /<script(?![^>]*src=)[^>]*>/i);
assert.doesNotMatch(html, /<style[\s>]/i);

assert.match(css, /html\[data-theme="dark"\]/);
assert.match(css, /--bg:#060708/);
assert.match(css, /\.cc-status-strip/);
assert.match(css, /\.cc-dashboard/);
assert.match(css, /\.cc-drawer/);
assert.match(css, /@media\(max-width:880px\)/);
assert.match(css, /\.cc-mobile-nav\{display:grid/);
assert.match(css, /@media\(max-width:580px\)/);
assert.match(css, /@media\(max-width:380px\)/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(css, /url\(https?:/i);

assert.match(polish, /\.cc-dashboard>\.cc-stack:first-child/);
assert.match(polish, /position:sticky/);
assert.match(polish, /top:60px/);
assert.match(polish, /height:auto/);
assert.match(polish, /max-height:min\(86dvh,760px\)/);
assert.match(polish, /\.cc-drawer\[data-open="true"\]/);
assert.match(polish, /@media\(min-width:1181px\)/);
assert.match(polish, /Flagship refinement pass/);
assert.match(polish, /\.cc-command-overlay/);
assert.match(polish, /\.cc-command-palette/);
assert.match(polish, /\.cc-command-input/);
assert.match(polish, /@media\(max-width:580px\)/);
assert.match(polish, /@media\(max-width:380px\)/);
assert.doesNotMatch(polish, /url\(https?:/i);

assert.match(theme, /continuum-control-center-theme-v1/);
assert.match(js, /continuum-control-center-theme-v1/);
assert.match(js, /function setView/);
assert.match(js, /function jumpToView/);
assert.match(js, /function renderWhy/);
assert.match(js, /function openDrawer/);
assert.match(js, /function closeDrawers/);
assert.match(js, /data-cc-tab-link/);
assert.match(js, /runSimulation/);
assert.match(js, /scrollIntoView/);
assert.match(js, /function createCommandPalette/);
assert.match(js, /function openCommandPalette/);
assert.match(js, /function renderCommandResults/);
assert.match(js, /metaKey \|\| event\.ctrlKey/);
assert.match(js, /Jump, open, or find an action/);
assert.match(js, /Lab navigation only/);
assert.match(js, /silence alone never creates permission/i);
assert.match(js, /AI availability is irrelevant to essential steps/i);
assert.doesNotMatch(js, /fetch\s*\(/);
assert.doesNotMatch(js, /XMLHttpRequest/);

console.log('Continuum Control Center standalone Lab + device and flagship refinement contracts passed.');
