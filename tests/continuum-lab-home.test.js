const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('lab/index.html', 'utf8');
const css = fs.readFileSync('assets/lab/lab-home-v1.css', 'utf8');
const js = fs.readFileSync('assets/lab/lab-home-v1.js', 'utf8');
const snapshot = fs.readFileSync('lab/snapshot/index.html', 'utf8');

for (const term of [
  '<title>Continuum · Lab</title>',
  'data-command="control"',
  'data-command="automations"',
  'data-command="directory-lab"',
  'data-command="library"',
  'data-command="email"',
  'data-command="snapshot"',
  'data-command="checkin"',
  'data-command="directory"',
  'data-command="spaces"',
  'data-command="doc"',
  '/lab/control/',
  '/lab/automations/',
  '/lab/directory/',
  '/lab/library/',
  '/lab/snapshot/',
  '/checkin/',
  '/directory/',
  '/spaces/',
  '/doc/',
  'manual Email action playground',
  'Focused routes own their own state; this page owns navigation only.',
  "connect-src 'none'",
]) assert(html.includes(term), `Lab home missing contract: ${term}`);

assert(!html.includes('/assets/lab/lab-loader.js'), 'Lab root must no longer boot the integrated snapshot');
assert(!html.includes('href="/lab/email/"'), 'Email NEXT marker must not pretend a route exists');
assert(html.includes('data-command="email" data-status="NEXT" data-route-row aria-disabled="true"'), 'Email NEXT item must remain non-navigable');
assert(snapshot.includes('/assets/lab/lab-loader.js?v=20260819-planner-signals-v3'), 'Preserved snapshot must keep the old integrated loader');

for (const term of [
  "location.hash.startsWith('#lab=')",
  'location.replace(`/lab/snapshot/${location.hash}`)',
  "open automations",
  "status",
  "tree",
  "email/ is NEXT, not a live route yet.",
  "document.documentElement.dataset.labHome = 'terminal-tree-v1'",
]) assert(js.includes(term), `Lab home behavior missing: ${term}`);

for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket(', 'EventSource(', 'localStorage', 'sessionStorage', 'eval(', 'new Function(']) {
  assert(!js.includes(forbidden), `Lab home launcher must stay navigation-only: ${forbidden}`);
}

for (const term of [
  '.lab-tree__row',
  '.lab-commandline',
  '@media(max-width:640px)',
  'grid-template-areas:"branch path status" "branch desc desc"',
  '.lab-home__status-grid',
]) assert(css.includes(term), `Lab home styling missing: ${term}`);

console.log('Continuum Lab terminal-tree home source contract passed.');
