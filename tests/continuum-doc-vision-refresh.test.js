const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');
const refresh = fs.readFileSync(path.join(root, 'assets/continuum-doc-vision-refresh.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'assets/continuum-doc-vision-refresh.css'), 'utf8');

assert.match(loader, /continuum-doc-vision-refresh\.js\?v=20260822-1/);
assert.match(loader, /loadFinalVoice[\s\S]*loadVisionRefresh/);

assert.match(refresh, /Think of Continuum as a private map of the people, information, rules, tools and ongoing work that matter to you\./);
assert.match(refresh, /KNOWLEDGE IS NOT PERMISSION/);
assert.match(refresh, /ONE CONNECTED BACKEND PROOF/);
assert.match(refresh, /NOT PRODUCTION-LIVE/);
assert.match(refresh, /Directory → Library → Automation → Authority → Runtime|DIRECTORY[\s\S]*LIBRARY[\s\S]*AUTOMATION[\s\S]*AUTHORITY[\s\S]*RUNTIME/);
assert.match(refresh, /data(?:set)?\.continuumVisionRefresh|dataset\.continuumVisionRefresh/);

for (const route of ['/checkin/', '/spaces/', '/directory/', '/library/', '/automations/', '/email/', '/control/']) {
  assert.ok(refresh.includes(`href="${route}"`), `missing canonical footer route ${route}`);
}

assert.ok(!refresh.includes('/lab/automations/'), 'vision refresh must not link back to /lab/automations/');
assert.match(refresh, /Check In is LIVE\./);
assert.match(refresh, /backend foundations in development/);
assert.match(refresh, /Signals, Goals/);

assert.match(styles, /\.continuum-knowledge-authority/);
assert.match(styles, /\.continuum-proof-chain/);
assert.match(styles, /@media \(max-width: 680px\)/);
assert.match(styles, /html\[data-theme='dark'\]/);

console.log('Continuum doc vision refresh contract passed.');
