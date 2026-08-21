'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const root = fs.readFileSync('index.html', 'utf8');
const menu = fs.readFileSync('menu/index.html', 'utf8');
const directory = fs.readFileSync('directory/index.html', 'utf8');
const routes = JSON.parse(fs.readFileSync('assets/cmx-routes.json', 'utf8'));
const opsCore = fs.readFileSync('assets/cmx-ops-core.js', 'utf8');
const opsRuntime = fs.readFileSync('assets/cmx-ops-runtime.js', 'utf8');
const standards = fs.readFileSync('scripts/apply_site_standards.py', 'utf8');

assert.match(root, /cmx-ops-core\.js\?v=20260821-1/);
assert.match(root, /cmx-ops-runtime\.js\?v=20260821-1/);

assert.match(menu, /<title>CMX Operations Menu<\/title>/);
assert.match(menu, /https:\/\/db\.cmxchat\.com\/menu\//);
assert.match(menu, /data-cmx-gate="black-prompt"/);
assert.match(menu, /data-cmx-gate-id="continuum-private-pages"/);
assert.match(menu, /cmx-gate-black-prompt\.js/);
assert.match(menu, /Operations Menu/);
assert.match(menu, /CMXRouteRegistry\.directoryRoutes/);
assert.doesNotMatch(menu, /canonical" href="https:\/\/db\.cmxchat\.com\/directory\//);

assert.match(directory, /<title>Continuum · Directory<\/title>/);
assert.match(directory, /data-cmx-gate="black-prompt"/);
assert.match(directory, /data-cmx-gate-id="continuum-private-pages"/);
assert.match(directory, /href="\/directory\/" aria-current="page"/);
assert.match(directory, /Directory · PREVIEW/);
assert.match(directory, /Protected People · local Organizations\/Groups/);
assert.match(directory, /directory-api-v1\.js/);
assert.match(directory, /directory-server-proof-v1\.js/);
assert.match(directory, /backend session, Origin and CSRF remain the real protection/);
assert.match(directory, /href="\/menu\/"/);
assert.doesNotMatch(directory, /CMX Operations Directory/);

const menuRoute = routes.routes.find((route) => route.path === '/menu/');
const directoryRoute = routes.routes.find((route) => route.path === '/directory/');
const labDirectoryRoute = routes.routes.find((route) => route.path === '/lab/directory/');
assert.ok(menuRoute, '/menu/ must be registered');
assert.equal(menuRoute.name, 'Operations Menu');
assert.equal(menuRoute.gated, true);
assert.ok(directoryRoute, '/directory/ must be registered');
assert.equal(directoryRoute.name, 'Continuum Directory');
assert.equal(directoryRoute.gated, true);
assert.ok(labDirectoryRoute, '/lab/directory/ must remain registered as the proof route');

assert.match(opsCore, /menu:\s*\{ path: '\/menu', label: 'Operations Menu' \}/);
assert.match(opsCore, /directory:\s*\{ path: '\/directory', label: 'Continuum Directory' \}/);
assert.match(opsRuntime, /\['Open Operations Menu', 'menu'\]/);
assert.match(opsRuntime, /\['Open Continuum Directory', 'directory'\]/);
assert.match(opsRuntime, /if \(action === 'open'\) return openRoute\('menu'\)/);

assert.match(standards, /"menu\/index\.html": \("CMX Operations Menu"/);
assert.match(standards, /"directory\/index\.html": \("Continuum Directory"/);
assert.doesNotMatch(standards, /href=\\"\/menu\\".*href=\\"\/directory\//s);
assert.doesNotMatch(standards, /unlink_root_directory_anchors/);
assert.match(standards, /def unlink_root_anchors/);

assert.doesNotThrow(() => new Function(opsCore), 'CMX operations core must parse');
assert.doesNotThrow(() => new Function(opsRuntime), 'CMX operations runtime must parse');

console.log('Continuum route graduation contract passed: /menu owns operations cards and /directory owns the protected Directory preview.');
