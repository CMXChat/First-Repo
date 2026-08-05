const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('brief-next/index.html');
const css = read('assets/brief-next/brief-demo.css');
const dataJs = read('assets/brief-next/brief-demo-data.js');
const mediaJs = read('assets/brief-next/brief-demo-media.js');
const appJs = read('assets/brief-next/brief-demo-app.js');
const routes = JSON.parse(read('assets/cmx-routes.json'));

assert.match(html, /<meta name="robots" content="noindex, nofollow/);
assert.match(html, /<link rel="canonical" href="https:\/\/db\.cmxchat\.com\/brief-next\/"/);
assert.match(html, /id="entryScenarioGrid"/);
assert.match(html, /data-view-panel="today"/);
assert.match(html, /data-view-panel="workspace"/);
assert.match(html, /data-view-panel="spaces"/);
assert.match(html, /data-view-panel="how"/);
assert.match(html, /id="weatherTemperature"/);
assert.match(html, /id="statsGrid"/);
assert.match(html, /id="spotifyFrame"/);
assert.doesNotMatch(html, /terminal|command line|brief-system/i);
assert.equal((html.match(/<iframe\b/g) || []).length, 1, 'The new demo should have one provider iframe.');
assert.equal((html.match(/<script src=/g) || []).length, 3, 'The new demo should load only data, media and app scripts.');
assert.equal((html.match(/<link rel="stylesheet"/g) || []).length, 1, 'The new demo should load one product stylesheet.');

assert.doesNotThrow(() => new Function(dataJs));
assert.doesNotThrow(() => new Function(mediaJs));
assert.doesNotThrow(() => new Function(appJs));

const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataJs, context);
const data = context.window.BRIEF_DEMO_DATA;
assert.ok(data);
assert.deepEqual(Object.keys(data.scenarios), ['personal', 'relationship', 'business', 'trainer', 'team']);
for (const scenario of Object.values(data.scenarios)) {
  assert.ok(scenario.weather.hourly.length >= 4, `${scenario.id} should include useful weather movement.`);
  assert.equal(scenario.stats.length, 4, `${scenario.id} should include four compact stats.`);
  assert.ok(scenario.tabs.length >= 5, `${scenario.id} should include selective workspace navigation.`);
  assert.ok(scenario.soundtrack.spotifyTrackId, `${scenario.id} should include one Spotify provider track.`);
  assert.ok(scenario.space.private.length >= 3);
  assert.ok(scenario.space.shared.length >= 3);
}

assert.match(appJs, /const state = \{/);
assert.match(appJs, /function selectView\(/);
assert.match(appJs, /function setScenario\(/);
assert.match(appJs, /function setWorkspaceTab\(/);
assert.match(appJs, /requestEntryPlayback\(selected, \$\('#entrySoundtrack'\)\?\.checked === true\)/);
assert.doesNotMatch(appJs, /setTimeout|setInterval/);
assert.doesNotMatch(appJs, /terminal|command line/i);

assert.match(mediaJs, /function requestEntryPlayback\(/);
assert.match(mediaJs, /function setScenario\(/);
assert.match(mediaJs, /if \(frame\.getAttribute\('src'\) !== nextSource\) frame\.src = nextSource/);
assert.doesNotMatch(mediaJs, /createElement\(['"]iframe/);

assert.match(css, /\.weather-card/);
assert.match(css, /\.stats-grid/);
assert.match(css, /\.primary-nav/);
assert.match(css, /\.mobile-nav/);
assert.match(css, /@media \(max-width: 620px\)/);
assert.match(css, /prefers-reduced-motion/);

const route = routes.routes.find(item => item.path === '/brief-next/');
assert.ok(route, '/brief-next/ must be registered.');
assert.equal(route.visibility, 'Direct-link-only');
assert.equal(route.status, 'Experimental');
assert.equal(route.gated, false);

console.log('Brief Next static smoke test passed.');
