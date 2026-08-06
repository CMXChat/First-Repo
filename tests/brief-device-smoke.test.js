const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('brief/index.html');
const stagingHtml = read('brief-next/index.html');
const css = read('assets/brief/brief-demo.css');
const experienceCss = read('assets/brief/brief-demo-experience.css');
const docLinksCss = read('assets/brief/brief-demo-doc-links.css');
const topbarPolishCss = read('assets/brief/brief-demo-topbar-polish.css');
const appJs = read('assets/brief/brief-demo-app.js');
const mediaJs = read('assets/brief/brief-demo-media.js');
const spacesRuntimeJs = read('assets/brief/brief-spaces-runtime.js');
const docJs = read('assets/personal-os-doc.js');
const docMobileCss = read('assets/personal-os-doc-mobile-fixes.css');
const routes = JSON.parse(read('assets/cmx-routes.json'));

assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /<title>Spaces Brief Demo<\/title>/);
assert.match(html, /<meta name="theme-color" content="#edf3f8"/);
assert.match(html, /noindex, nofollow/);
assert.match(html, /id="entryScenarioGrid" role="group" aria-label="Demo Spaces"/);
assert.match(html, /id="entrySoundtrack" type="checkbox" checked/);
assert.match(html, /id="openDemo"[^>]*disabled/);
assert.match(html, /id="themeButton"[^>]*aria-label="Switch to dark theme"[^>]*aria-pressed="false"/);
assert.match(html, /id="mobileNav"/);
assert.match(html, /id="mediaDrawer"/);
assert.doesNotMatch(html, /class="doc-topbar-link" href="\/doc\/"/);
assert.match(html, /class="secondary-button doc-entry-link" href="\/doc\/"/);
assert.match(html, /class="primary-button doc-cta-button" href="\/doc\/"/);
assert.match(html, /brief-demo-app\.js\?v=20260806-1/);
assert.match(html, /brief-demo-media\.js\?v=20260806-2/);
assert.match(html, /brief-demo-doc-links\.css\?v=20260806-3/);
assert.match(html, /brief-demo-topbar-polish\.css\?v=20260806-3/);
assert.match(html, /brief-spaces-runtime\.js\?v=20260806-1/);
assert.match(html, /Choose the Space you want to open/);
assert.match(html, /Play the soundtrack when the demo opens/);
assert.doesNotMatch(html, /Loading Spotify player\.\.\.|Preparing Spotify[^<]*\.\.\./);
assert.doesNotMatch(html, /id="profileSelect"|id="musicOnEntry"|id="readOnEntry"|id="enterBrief"/);
assert.equal(stagingHtml, html, 'The staging and production Brief routes should use the same current interface.');

for (const source of [appJs, mediaJs, spacesRuntimeJs, docJs]) {
  assert.doesNotThrow(() => new Function(source));
}

assert.match(appJs, /const THEME_STORAGE_KEY = 'personal_os_brief_theme_v2'/);
assert.match(appJs, /function readInitialTheme\(/);
assert.match(appJs, /return storedTheme === 'dark' \? 'dark' : 'light'/);
assert.match(appJs, /document\.documentElement\.dataset\.theme = initialTheme/);
assert.match(appJs, /function moveWorkspaceTab\(/);
assert.match(appJs, /ArrowLeft/);
assert.match(appJs, /button\.tabIndex = active \? 0 : -1/);
assert.match(appJs, /<button class="entry-option" type="button" data-entry-scenario=/);
assert.doesNotMatch(appJs, /role="listitem"/);
assert.match(appJs, /<time>\$\{escapeHtml\(hour\.time\)\}<\/time>/);

assert.match(spacesRuntimeJs, /const productName = 'Spaces'/);
assert.match(spacesRuntimeJs, /updateObject\(window\.BRIEF_DEMO_DATA\)/);
assert.match(spacesRuntimeJs, /MutationObserver/);

assert.match(mediaJs, /const API_TIMEOUT_MS = 4000/);
assert.match(mediaJs, /const TRACK_SETTLE_DELAY_MS = 350/);
assert.match(mediaJs, /pendingEntryPlayback/);
assert.match(mediaJs, /function syncEntryButton\(/);
assert.match(mediaJs, /function setDrawerInert\(/);
assert.match(mediaJs, /state\.controller\.play\(\)/);
assert.match(mediaJs, /function playPendingEntryRequest\(/);
assert.match(mediaJs, /function enableSoundtrackForScenarioChoice\(/);
assert.match(mediaJs, /document\.addEventListener\('pointerdown'/);
assert.match(mediaJs, /Spotify needs one direct tap on this device/);
assert.match(mediaJs, /Spotify is ready in direct tap mode/);
assert.match(mediaJs, /Prepare Spotify while the entry screen is visible/);
assert.doesNotMatch(mediaJs, /event\.stopImmediatePropagation\(\)/);
assert.doesNotMatch(mediaJs, /queueMicrotask\(open\)/);

assert.match(css, /:root\s*\{[\s\S]*--bg: #edf3f8/);
assert.match(css, /html\[data-theme="dark"\]/);
assert.match(css, /\.mobile-nav/);
assert.match(css, /safe-area-inset/);
assert.match(css, /@media \(max-width:/);
assert.match(css, /prefers-reduced-motion/);
assert.match(experienceCss, /\.everything-content/);
assert.match(experienceCss, /overflow-x/);
assert.match(docLinksCss, /brief-demo-topbar-polish\.css\?v=20260806-2/);
assert.match(docLinksCss, /\.media-drawer \{[\s\S]*display: block/);
assert.match(docLinksCss, /body\s*\{[\s\S]*overflow-x: clip/);
assert.match(docLinksCss, /@media \(max-width: 620px\)/);
assert.match(topbarPolishCss, /\.doc-topbar-link\s*\{[\s\S]*display: none !important/);
assert.match(topbarPolishCss, /#themeButton\s*\{[\s\S]*linear-gradient/);
assert.match(topbarPolishCss, /html\[data-theme="dark"\] #themeButton/);
assert.match(topbarPolishCss, /html\[data-theme="dark"\] \.topbar-context select/);
assert.match(topbarPolishCss, /-webkit-text-fill-color: #f7fbff/);
assert.match(topbarPolishCss, /color-scheme: dark/);
assert.match(topbarPolishCss, /safe-area-inset-top/);

assert.match(docJs, /personal-os-doc-mobile-fixes\.css/);
assert.match(docJs, /spacesMobileFixes/);
assert.match(docJs, /Spaces \| Context-Driven Workspace and Daily Brief/);
assert.match(docJs, /Planned Memory & Data settings/);
assert.doesNotMatch(docJs, /const plainCopy = new Map/);
assert.match(docMobileCss, /\.final-cta \{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
assert.match(docMobileCss, /overflow-wrap: anywhere/);
assert.match(docMobileCss, /@media \(max-width: 680px\)/);

const route = routes.routes.find(item => item.path === '/brief/');
assert.ok(route, '/brief/ must remain registered.');
assert.equal(route.name, 'Spaces Brief Demo');
assert.equal(route.gated, false);
assert.equal(route.status, 'Active');

console.log('Spaces Brief device, topbar, soundtrack, accessibility, and light-theme smoke test passed.');
