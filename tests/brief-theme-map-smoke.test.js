const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('brief/index.html');
const bridge = read('assets/brief/brief-terminal-bridge.js');
const topMap = read('assets/brief/brief-map-top.js');
const mapCss = read('assets/brief/brief-map-top.css');
const theme = read('assets/brief/brief-theme-integrity.js');
const css = read('assets/brief/brief-theme-integrity.css');

new vm.Script(bridge, { filename: 'brief-terminal-bridge.js' });
new vm.Script(topMap, { filename: 'brief-map-top.js' });
new vm.Script(theme, { filename: 'brief-theme-integrity.js' });

assert.match(index, /brief-terminal-bridge\.js\?v=20260803-\d+/);
assert.match(bridge, /brief-theme-integrity\.css/);
assert.match(bridge, /brief-theme-integrity\.js/);
assert.match(bridge, /brief-map-top\.js/);
assert.match(bridge, /NAVIGATION_VERSION = '20260803-6'/);
assert.match(bridge, /INTERFACE_VERSION = '20260803-2'/);
assert.match(bridge, /FINAL_VERSION = '20260803-2'/);

assert.match(topMap, /briefTopMapButton/);
assert.match(topMap, /brief-map-top\.css/);
assert.match(topMap, /Open \$\{label\} briefing map/);
assert.match(topMap, /individual: 'Personal'/);
assert.match(topMap, /couple: 'Relationship'/);
assert.match(topMap, /partners: 'Business'/);
assert.match(topMap, /trainer: 'Trainer'/);
assert.match(topMap, /team: 'Team'/);
assert.match(topMap, /viewMode/);
assert.match(topMap, /aria-haspopup/);
assert.match(topMap, /aria-controls/);
assert.match(topMap, /aria-expanded/);
assert.match(topMap, /window\.BRIEF_NAVIGATION\?\.open/);
assert.doesNotMatch(topMap, /new MutationObserver/);
assert.match(mapCss, /brief-top-map-button/);
assert.match(mapCss, /html\[data-theme='light'\]/);
assert.match(mapCss, /forced-colors: active/);

assert.match(theme, /meta\[name=/);
assert.match(theme, /theme-color/);
assert.match(theme, /color-scheme/);
assert.match(theme, /attributeFilter: \['data-theme'\]/);
assert.match(theme, /Switch to dark mode/);
assert.match(theme, /Switch to light mode/);
assert.match(theme, /scheduleSync/);

assert.match(css, /--brief-ui-page/);
assert.match(css, /html\[data-theme='light'\]/);
assert.match(css, /html:not\(\[data-theme='light'\]\)/);
assert.match(css, /brief-top-map-button/);
assert.match(css, /polish-team-flow > div/);
assert.match(css, /polish-team-board article/);
assert.match(css, /brief-priority-visuals/);
assert.match(css, /brief-navigation-panel/);
assert.match(css, /brief-terminal-panel/);
assert.match(css, /relationship-watch-card/);
assert.match(css, /polish-sparkline text/);
assert.match(css, /brand > span:last-child/);
assert.match(css, /overflow-x: auto/);
assert.match(css, /prefers-contrast: more/);
assert.match(css, /forced-colors: active/);

console.log('Brief map and theme integrity smoke test passed.');
