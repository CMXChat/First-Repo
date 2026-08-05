const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('brief-next/index.html');
const css = read('assets/brief-next/brief-demo.css');
const explainerCss = read('assets/brief-next/brief-demo-explainers.css');
const dataJs = read('assets/brief-next/brief-demo-data.js');
const mediaJs = read('assets/brief-next/brief-demo-media.js');
const appJs = read('assets/brief-next/brief-demo-app.js');
const explainersJs = read('assets/brief-next/brief-demo-explainers.js');
const routes = JSON.parse(read('assets/cmx-routes.json'));

assert.match(html, /<meta name="robots" content="noindex, nofollow/);
assert.match(html, /<link rel="canonical" href="https:\/\/db\.cmxchat\.com\/brief-next\/"/);
assert.match(html, /id="entryScenarioGrid"/);
assert.match(html, /id="entrySoundtrack" type="checkbox" checked/);
assert.doesNotMatch(html, /readOnEntry|read aloud/i);
assert.match(html, /data-view-panel="today"/);
assert.match(html, /data-view-panel="workspace"/);
assert.match(html, /data-view-panel="spaces"/);
assert.match(html, /data-view-panel="how"/);
assert.match(html, /id="weatherTemperature"/);
assert.match(html, /id="statsGrid"/);
assert.match(html, /id="spotifyFrame"/);
assert.doesNotMatch(html, /terminal|command line|brief-system/i);
assert.equal((html.match(/<iframe\b/g) || []).length, 1, 'The new demo should have one provider iframe.');
assert.equal((html.match(/<script src=/g) || []).length, 4, 'The demo should load data, media, app and explainer scripts.');
assert.equal((html.match(/<link rel="stylesheet"/g) || []).length, 2, 'The demo should load the core and explainer stylesheets.');

assert.doesNotThrow(() => new Function(dataJs));
assert.doesNotThrow(() => new Function(mediaJs));
assert.doesNotThrow(() => new Function(appJs));
assert.doesNotThrow(() => new Function(explainersJs));

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

assert.match(explainersJs, /const memoryExamples = \{/);
assert.match(explainersJs, /const spaceExamples = \{/);
assert.match(explainersJs, /family: \{/);
assert.match(explainersJs, /This is not a social friends list/);
assert.match(explainersJs, /resetChoice\.checked = true/);
assert.match(explainersJs, /PRIVATE FIRST/);
assert.doesNotMatch(explainersJs, /setTimeout|setInterval/);

assert.match(css, /\.weather-card/);
assert.match(css, /\.stats-grid/);
assert.match(css, /\.primary-nav/);
assert.match(css, /\.mobile-nav/);
assert.match(css, /@media \(max-width: 620px\)/);
assert.match(css, /prefers-reduced-motion/);
assert.match(explainerCss, /\.memory-comparison/);
assert.match(explainerCss, /\.space-example-panel/);
assert.match(explainerCss, /\.hero-copy h1/);
assert.match(explainerCss, /font-size: clamp\(1\.95rem, 9\.5vw, 2\.75rem\)/);

const route = routes.routes.find(item => item.path === '/brief-next/');
assert.ok(route, '/brief-next/ must be registered.');
assert.equal(route.visibility, 'Direct-link-only');
assert.equal(route.status, 'Experimental');
assert.equal(route.gated, false);

console.log('Brief Next static smoke test passed.');
