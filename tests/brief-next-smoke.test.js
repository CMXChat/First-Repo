const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('brief/index.html');
const stagingHtml = read('brief-next/index.html');
const css = read('assets/brief/brief-demo.css');
const explainerCss = read('assets/brief/brief-demo-explainers.css');
const experienceCss = read('assets/brief/brief-demo-experience.css');
const dataJs = read('assets/brief/brief-demo-data.js');
const experienceJs = read('assets/brief/brief-demo-experience.js');
const mediaJs = read('assets/brief/brief-demo-media.js');
const appJs = read('assets/brief/brief-demo-app.js');
const explainersJs = read('assets/brief/brief-demo-explainers.js');
const routes = JSON.parse(read('assets/cmx-routes.json'));

assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /<meta name="theme-color" content="#edf3f8"/);
assert.match(html, /<meta name="robots" content="noindex, nofollow/);
assert.match(html, /<link rel="canonical" href="https:\/\/db\.cmxchat\.com\/brief\/"/);
assert.match(html, /id="entryScenarioGrid"/);
assert.match(html, /id="entrySoundtrack" type="checkbox" checked/);
assert.match(html, /id="entryDocLink" href="\/doc\/"/);
assert.match(html, /id="briefDocLink" href="\/doc\/"/);
assert.doesNotMatch(html, /readOnEntry|read aloud/i);
assert.match(html, /data-view-panel="today"/);
assert.match(html, /data-view-panel="workspace"/);
assert.match(html, /data-view-panel="spaces"/);
assert.match(html, /data-view-panel="how"/);
assert.match(html, /data-view-panel="everything"/);
assert.match(html, /id="everythingJumpNav"/);
assert.match(html, /id="everythingContent"/);
assert.match(html, /id="weatherTemperature"/);
assert.match(html, /id="statsGrid"/);
assert.match(html, /id="spotifyFrame"/);
assert.doesNotMatch(html, /terminal|command line|brief-system/i);
assert.equal((html.match(/<iframe\b/g) || []).length, 1, 'The briefing should have one provider iframe.');
assert.equal((html.match(/<script src=/g) || []).length, 5, 'The briefing should load data, experience, media, app and explainer scripts.');
assert.equal((html.match(/<link rel="stylesheet"/g) || []).length, 3, 'The briefing should load core, explainer and experience stylesheets.');
assert.ok(html.indexOf('brief-demo-experience.js') < html.indexOf('brief-demo-app.js'), 'Experience configuration must extend navigation before the app initializes.');

assert.doesNotMatch(stagingHtml, /http-equiv="refresh"/i);
assert.match(stagingHtml, /id="entryScenarioGrid"/);
assert.match(stagingHtml, /data-view-panel="everything"/);
assert.match(stagingHtml, /\/assets\/brief\/brief-demo-app\.js/);
assert.equal(stagingHtml, html, 'The staging route should render the same standalone briefing interface as /brief/.');

assert.doesNotThrow(() => new Function(dataJs));
assert.doesNotThrow(() => new Function(experienceJs));
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

assert.match(appJs, /theme: 'light'/);
assert.match(appJs, /localStorage\.getItem\('briefNextTheme'\) \|\| 'light'/);
assert.match(appJs, /new CustomEvent\('briefdemo:scenariochange'/);
assert.match(appJs, /function selectView\(/);
assert.match(appJs, /function setScenario\(/);
assert.match(appJs, /function setWorkspaceTab\(/);
assert.match(appJs, /requestEntryPlayback\(selected, \$\('#entrySoundtrack'\)\?\.checked === true\)/);
assert.match(appJs, /\$\('#entrySoundtrack'\)\.checked = true/);
assert.doesNotMatch(appJs, /setTimeout|setInterval/);
assert.doesNotMatch(appJs, /terminal|command line/i);

assert.match(experienceJs, /data\.navigation\.push\(\{ id: 'everything', label: 'Everything' \}\)/);
assert.match(experienceJs, /STABLE SHELL, ADAPTIVE COMPOSITION/);
assert.match(experienceJs, /approved APIs, MCP tools/);
assert.match(experienceJs, /Chart/);
assert.match(experienceJs, /Timeline/);
assert.match(experienceJs, /Wake up with music and the executive overview/);
assert.match(experienceJs, /connected Spotify account/);
assert.match(experienceJs, /id="everythingDocLink" href="\/doc\/"/);
assert.match(experienceJs, /briefdemo:scenariochange/);
assert.doesNotMatch(experienceJs, /setTimeout|setInterval/);

assert.match(mediaJs, /function requestEntryPlayback\(/);
assert.match(mediaJs, /function setScenario\(/);
assert.match(mediaJs, /if \(frame\.getAttribute\('src'\) !== nextSource\) frame\.src = nextSource/);
assert.doesNotMatch(mediaJs, /createElement\(['"]iframe/);

assert.match(explainersJs, /const memoryExamples = \{/);
assert.match(explainersJs, /const spaceExamples = \{/);
assert.match(explainersJs, /family: \{/);
assert.match(explainersJs, /This is not a social friends list/);
assert.match(explainersJs, /PRIVATE FIRST/);
assert.doesNotMatch(explainersJs, /setTimeout|setInterval/);

assert.match(css, /\.weather-card/);
assert.match(css, /\.stats-grid/);
assert.match(css, /\.primary-nav/);
assert.match(css, /\.mobile-nav/);
assert.match(css, /prefers-reduced-motion/);
assert.match(explainerCss, /\.memory-comparison/);
assert.match(explainerCss, /font-size: clamp\(1\.5rem, 6\.8vw, 2rem\)/);
assert.match(explainerCss, /font-size: clamp\(1\.75rem, 7\.8vw, 2\.2rem\)/);
assert.match(experienceCss, /--bg: #05070b/);
assert.match(experienceCss, /\.everything-jump-nav/);
assert.match(experienceCss, /\.everything-content/);
assert.match(experienceCss, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);

const route = routes.routes.find(item => item.path === '/brief/');
assert.ok(route, '/brief/ must be registered.');
assert.equal(route.visibility, 'Direct-link-only');
assert.equal(route.status, 'Active');
assert.equal(route.gated, false);

const stagingRoute = routes.routes.find(item => item.path === '/brief-next/');
assert.ok(stagingRoute, '/brief-next/ staging copy must remain registered.');
assert.equal(stagingRoute.status, 'Experimental');
assert.equal(stagingRoute.visibility, 'Direct-link-only');
assert.equal(stagingRoute.gated, false);

const docRoute = routes.routes.find(item => item.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false);

console.log('Brief static smoke test passed.');
