const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const script = fs.readFileSync('assets/brief/brief-lite-ui.js', 'utf8');
const styles = fs.readFileSync('assets/brief/brief-lite-ui.css', 'utf8');

new vm.Script(script, { filename: 'brief-lite-ui.js' });

assert.match(script, /installSafeScrollIntoView/);
assert.match(script, /#briefStickyRoutes/);
assert.match(script, /brief-entry-top-guard/);
assert.match(script, /startEntryGuard/);
assert.match(script, /activateLiteMode/);
assert.match(script, /data-brief-entry-opening/);
assert.match(script, /brief-lite-ui\.css\?v=20260804-2/);

assert.match(styles, /data-brief-depth='quick'.*#briefNavigatorBar/s);
assert.match(styles, /brief-section:not\(#briefWorkspace\)/);
assert.match(styles, /html\[data-theme='light'\] \.scenario-choice/);
assert.match(styles, /html\[data-theme='light'\] \.friend-panel li/);
assert.match(styles, /quick-signal-grid/);
assert.match(styles, /polish-kpi-grid/);
assert.match(styles, /@media \(max-width: 760px\)/);

console.log('Brief Lite Mode and hero-entry smoke test passed.');
