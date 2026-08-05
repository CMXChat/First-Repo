const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('brief/index.html');
const stagingHtml = read('brief-next/index.html');
const css = read('assets/brief/brief-demo.css');
const experienceCss = read('assets/brief/brief-demo-experience.css');
const appJs = read('assets/brief/brief-demo-app.js');
const mediaJs = read('assets/brief/brief-demo-media.js');
const routes = JSON.parse(read('assets/cmx-routes.json'));

assert.match(html, /noindex, nofollow/);
assert.match(html, /id="entryScenarioGrid"/);
assert.match(html, /id="entrySoundtrack" type="checkbox" checked/);
assert.match(html, /id="openDemo"[^>]*disabled/);
assert.match(html, /id="themeButton"/);
assert.match(html, /id="mobileNav"/);
assert.match(html, /id="mediaDrawer"/);
assert.match(html, /class="doc-topbar-link" href="\/doc\/"/);
assert.match(html, /brief-demo-app\.js/);
assert.match(html, /brief-demo-media\.js/);
assert.doesNotMatch(html, /id="profileSelect"|id="musicOnEntry"|id="readOnEntry"|id="enterBrief"/);
assert.doesNotMatch(html, /brief-config\.js/);
assert.equal(stagingHtml, html, 'The staging and production Brief routes should use the same current interface.');

assert.doesNotThrow(() => new Function(appJs));
assert.doesNotThrow(() => new Function(mediaJs));
assert.match(appJs, /const THEME_STORAGE_KEY = 'personal_os_brief_theme_v2'/);
assert.match(appJs, /function readInitialTheme\(/);
assert.match(appJs, /return storedTheme === 'dark' \? 'dark' : 'light'/);
assert.match(appJs, /return 'light'/);
assert.match(appJs, /document\.documentElement\.dataset\.theme = initialTheme/);
assert.match(appJs, /localStorage\.removeItem\('briefNextTheme'\)/);
assert.match(appJs, /localStorage\.setItem\(THEME_STORAGE_KEY, state\.theme\)/);
assert.doesNotMatch(appJs, /localStorage\.getItem\('briefNextTheme'\)/);

assert.match(css, /:root\s*\{[\s\S]*--bg: #edf3f8/);
assert.match(css, /html\[data-theme="dark"\]/);
assert.match(css, /\.mobile-nav/);
assert.match(css, /safe-area-inset/);
assert.match(css, /@media \(max-width:/);
assert.match(css, /prefers-reduced-motion/);
assert.match(experienceCss, /\.everything-content/);
assert.match(experienceCss, /overflow-x/);

const route = routes.routes.find(item => item.path === '/brief/');
assert.ok(route, '/brief/ must remain registered.');
assert.equal(route.gated, false);
assert.equal(route.status, 'Active');

console.log('Current Brief device and light-theme smoke test passed.');