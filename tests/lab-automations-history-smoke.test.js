const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('lab/automations/index.html');
const historyLayer = read('assets/lab/lab-automations-history-v1.js');
const routeIntegration = read('assets/lab/lab-automations-route-integration.js');
const editorBootstrap = read('assets/lab/lab-automations-control-v10-editor-bootstrap.js');

new vm.Script(historyLayer, { filename: 'lab-automations-history-v1.js' });
new vm.Script(routeIntegration, { filename: 'lab-automations-route-integration.js' });
new vm.Script(editorBootstrap, { filename: 'lab-automations-control-v10-editor-bootstrap.js' });

assert.match(historyLayer, /cmxLabAutomationsNavigation/);
assert.match(historyLayer, /pushState/);
assert.match(historyLayer, /replaceState/);
assert.match(historyLayer, /popstate/);
assert.match(historyLayer, /snapshot\(\)/);
assert.match(historyLayer, /restore\(target\)/);
assert.match(historyLayer, /data-v4-surface/);
assert.match(historyLayer, /data-stage/);
assert.match(historyLayer, /data-v7-manage/);
assert.match(historyLayer, /controlView/);
assert.match(historyLayer, /data-v10-tab/);
assert.doesNotMatch(historyLayer, /preventDefault\(/);
assert.doesNotMatch(historyLayer, /stopImmediatePropagation\(/);
assert.doesNotMatch(historyLayer, /history\.back\(/);
assert.doesNotMatch(historyLayer, /history\.go\(/);

assert.match(routeIntegration, /labAutomationsRouteIntegration/);
assert.match(routeIntegration, /new MutationObserver/);
assert.match(routeIntegration, /if \(!target\) return false;/);
assert.match(routeIntegration, /target\.click\(\);\s*cleanOneShotQuery\(\);/s);
assert.doesNotMatch(routeIntegration, /if \(automationId \|\| wantsNew\) cleanOneShotQuery\(\)/);

assert.match(editorBootstrap, /document\.getElementById\("automationApp"\)/);
assert.match(editorBootstrap, /new MutationObserver\(schedule\)\.observe\(app, \{ childList: true, subtree: true \}\)/);
assert.match(editorBootstrap, /queueMicrotask\(patch\)/);
assert.doesNotMatch(editorBootstrap, /requestAnimationFrame\(\(\) => requestAnimationFrame/);
assert.match(editorBootstrap, /patchEditorChrome/);
assert.match(editorBootstrap, /data-v10-tab/);

assert.match(index, /lab-automations-route-integration\.js\?v=20260818-1/);
assert.match(index, /lab-automations-control-v10-editor-bootstrap\.js\?v=20260821-v10control1/);
assert.match(index, /lab-automations-history-v1\.js\?v=20260821-history2/);
assert.ok(index.indexOf('lab-automations-history-v1.js') > index.indexOf('lab-automations-control-v10.js'));

console.log('Lab Automations browser-history isolation smoke test passed.');
