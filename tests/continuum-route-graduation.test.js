'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const registry = JSON.parse(read('assets/cmx-routes.json'));
const routes = new Set(registry.routes.map((route) => route.path));

for (const path of [
  '/directory/',
  '/email/',
  '/automations/',
  '/control/',
  '/library/',
  '/archive/continuum-lab/',
]) assert.ok(routes.has(path), `Missing canonical Continuum route: ${path}`);

assert.equal([...routes].some((path) => path.startsWith('/lab/')), false, 'route registry must contain no /lab/ routes');
assert.equal(fs.existsSync('lab'), false, 'top-level lab directory must not exist');

for (const path of [
  'automations/index.html',
  'control/index.html',
  'library/index.html',
  'archive/continuum-lab/index.html',
]) assert.equal(fs.existsSync(path), true, `Graduated route file missing: ${path}`);

const redirect = read('assets/continuum-legacy-route-redirect.js');
for (const [oldPath, newPath] of [
  ['/lab/', '/control/'],
  ['/lab/automations/', '/automations/'],
  ['/lab/control/', '/control/'],
  ['/lab/directory/', '/directory/'],
  ['/lab/library/', '/library/'],
  ['/lab/email/', '/email/'],
  ['/lab/snapshot/', '/archive/continuum-lab/'],
]) {
  assert.ok(redirect.includes(`['${oldPath}', '${newPath}']`), `Missing compatibility redirect ${oldPath} → ${newPath}`);
}

const automationRoute = read('assets/lab/lab-automations-route-integration.js');
assert.ok(automationRoute.includes('const RETURN_TO_CONTROL = "/control/"'));
assert.equal(automationRoute.includes('RETURN_TO_LAB'), false);

const automationPolish = read('assets/lab/lab-automations-operations-v7-polish.js');
assert.ok(automationPolish.includes('brand.href = "/control/"'));
assert.ok(automationPolish.includes('PROVING · AUTOMATIONS'));

const docRoutes = read('assets/continuum-doc-top-routes.js');
assert.ok(docRoutes.includes("link.href = '/automations/'"));

const html404 = read('404.html');
assert.ok(html404.includes('/assets/continuum-legacy-route-redirect.js'));

console.log('Continuum route graduation contract passed: canonical routes are outside /lab/.');
