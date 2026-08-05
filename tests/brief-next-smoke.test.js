const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('brief-next/index.html');
const briefHtml = read('brief/index.html');
const css = read('assets/brief-next/brief-demo.css');
const explainerCss = read('assets/brief-next/brief-demo-explainers.css');
const experienceCss = read('assets/brief-next/brief-demo-experience.css');
const visualsCss = read('assets/brief-next/brief-demo-visuals.css');
const dataJs = read('assets/brief-next/brief-demo-data.js');
const experienceJs = read('assets/brief-next/brief-demo-experience.js');
const visualsJs = read('assets/brief-next/brief-demo-visuals.js');
const mediaJs = read('assets/brief-next/brief-demo-media.js');
const appJs = read('assets/brief-next/brief-demo-app.js');
const explainersJs = read('assets/brief-next/brief-demo-explainers.js');
const routes = JSON.parse(read('assets/cmx-routes.json'));

assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /<meta name="theme-color" content="#edf3f8"/);
assert.match(html, /id="themeButton"[^>]+aria-label="Switch to dark theme"[^>]+aria-pressed="false"/);
assert.match(html, /<meta name="robots" content="noindex, nofollow/);
assert.match(html, /<link rel="canonical" href="https:\/\/db\.cmxchat\.com\/brief-next\/"/);
assert.match(html, /id="entryScenarioGrid"/);
assert.match(html, /id="entrySoundtrack" type="checkbox" checked/);
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
assert.equal((html.match(/<iframe\b/g) || []).length, 1, 'The new demo should have one provider iframe.');
assert.equal((html.match(/<script src=/g) || []).length, 5, 'The stable HTML should load data, experience, media, app and explainer scripts.');
assert.equal((html.match(/<link rel="stylesheet"/g) || []).length, 3, 'The stable HTML should load core, explainer and experience stylesheets.');
assert.ok(html.indexOf('brief-demo-experience.js') < html.indexOf('brief-demo-app.js'), 'Experience configuration must extend navigation before the app initializes.');

assert.match(briefHtml, /<html lang="en" data-theme="black">/);
assert.match(briefHtml, /<meta name="color-scheme" content="dark"/);
assert.match(briefHtml, /<meta name="theme-color" content="#000000"/);
assert.doesNotMatch(briefHtml, /<html[^>]+data-theme="light"/);

assert.doesNotThrow(() => new Function(dataJs));
assert.doesNotThrow(() => new Function(experienceJs));
assert.doesNotThrow(() => new Function(visualsJs));
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
assert.match(appJs, /state\.theme = 'light'/);
assert.match(appJs, /new CustomEvent\('briefdemo:scenariochange'/);
assert.match(appJs, /function selectView\(/);
assert.match(appJs, /function setScenario\(/);
assert.match(appJs, /function setWorkspaceTab\(/);
assert.match(appJs, /requestEntryPlayback\(selected, \$\('#entrySoundtrack'\)\?\.checked === true\)/);
assert.match(appJs, /\$\('#entrySoundtrack'\)\.checked = true/);
assert.doesNotMatch(appJs, /setTimeout|setInterval/);
assert.doesNotMatch(appJs, /terminal|command line/i);

assert.match(experienceJs, /data\.navigation\.push\(\{ id: 'everything', label: 'Everything' \}\)/);
assert.match(experienceJs, /brief-demo-visuals\.css/);
assert.match(experienceJs, /brief-demo-visuals\.js/);
assert.match(experienceJs, /briefdemo:everythingrender/);
assert.match(experienceJs, /STABLE SHELL, ADAPTIVE COMPOSITION/);
assert.match(experienceJs, /approved APIs, MCP tools/);
assert.match(experienceJs, /Wake up with music and the executive overview/);
assert.match(experienceJs, /connected Spotify account/);
assert.match(experienceJs, /briefdemo:scenariochange/);
assert.doesNotMatch(experienceJs, /setTimeout|setInterval/);

assert.match(visualsJs, /const goalProfiles = \{/);
assert.match(visualsJs, /const memoryProfiles = \{/);
assert.match(visualsJs, /const inputDefinitions = \[/);
assert.match(visualsJs, /Turn approved inputs on and watch the edition change/);
assert.match(visualsJs, /FastAPI, PostgreSQL, API, MCP and connector contract/);
assert.match(visualsJs, /Goal Pulse connects today’s information to movement/);
assert.match(visualsJs, /Continuity should preserve sources, freshness and correction/);
assert.match(visualsJs, /One record can support several contexts without exposing everything/);
assert.match(visualsJs, /See the full Personal OS overview/);
assert.match(visualsJs, /href="\/doc\//);
assert.match(visualsJs, /MutationObserver/);
assert.match(visualsJs, /IntersectionObserver/);
assert.doesNotMatch(visualsJs, /setTimeout|setInterval/);

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
assert.match(visualsCss, /\.weather-intelligence/);
assert.match(visualsCss, /\.workspace-visual/);
assert.match(visualsCss, /\.input-toggle-grid/);
assert.match(visualsCss, /\.goal-pulse-demo/);
assert.match(visualsCss, /\.memory-inspector/);
assert.match(visualsCss, /\.permission-table/);
assert.match(visualsCss, /\.doc-bridge-card/);
assert.match(visualsCss, /prefers-reduced-motion/);

const route = routes.routes.find(item => item.path === '/brief-next/');
assert.ok(route, '/brief-next/ must be registered.');
assert.equal(route.visibility, 'Direct-link-only');
assert.equal(route.status, 'Experimental');
assert.equal(route.gated, false);

console.log('Brief Next static smoke test passed.');
