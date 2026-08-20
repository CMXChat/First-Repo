const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('lab/automations/index.html');
const integration = read('assets/lab/lab-automations-route-integration.js');

new vm.Script(integration, { filename: 'lab-automations-route-integration.js' });

assert.match(integration, /cmxLabAutomationsNavigation/);
assert.match(integration, /history\[method\]/);
assert.match(integration, /pushState/);
assert.match(integration, /replaceState/);
assert.match(integration, /popstate/);
assert.match(integration, /readNavigationSnapshot/);
assert.match(integration, /restoreNavigationSnapshot/);
assert.match(integration, /data-v4-surface/);
assert.match(integration, /data-stage/);
assert.match(integration, /data-v4-modal-close/);
assert.match(integration, /data-v7-manage-close/);
assert.match(integration, /history\.back\(\)/);
assert.match(integration, /history\.go\(/);
assert.match(index, /lab-automations-route-integration\.js\?v=20260820-history1/);

console.log('Lab Automations browser-history smoke test passed.');
