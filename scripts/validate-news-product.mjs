import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = path => readFileSync(resolve(root, path), 'utf8');
const checks = [];
const expect = (condition, message) => {
  checks.push({ condition: Boolean(condition), message });
};

const loader = read('assets/news-loader.js');
const workspace = read('assets/news-workspace.js');
const media = read('assets/news-media.js');
const polish = read('assets/news-polish.js');
const polishCss = read('assets/news-polish.css');
const navigation = read('assets/news-navigation.js');
const navigationState = read('assets/news-navigation-state.js');
const navigationCss = read('assets/news-navigation.css');
const resilience = read('assets/news-resilience.js');
const resilienceCss = read('assets/news-resilience.css');
const browserSpec = read('tests/news-browser-e2e.spec.cjs');
const browserConfig = read('tests/news-playwright.config.cjs');
const index = read('news/index.html');

expect(loader.includes('/assets/news-polish.js'), 'loader includes news-polish.js');
expect(loader.includes('/assets/news-navigation.js'), 'loader includes news-navigation.js');
expect(loader.includes('/assets/news-navigation-state.js'), 'loader includes news-navigation-state.js');
expect(loader.includes('/assets/news-resilience.js'), 'loader includes news-resilience.js');
expect(loader.indexOf('/assets/news-workspace.js') < loader.indexOf('/assets/news-polish.js'), 'polish loads after workspace');
expect(loader.indexOf('/assets/news-polish.js') < loader.indexOf('/assets/news-navigation.js'), 'navigation loads after polish');
expect(loader.indexOf('/assets/news-navigation.js') < loader.indexOf('/assets/news-navigation-state.js'), 'state guard loads after navigation');
expect(loader.indexOf('/assets/news-navigation-state.js') < loader.indexOf('/assets/news-resilience.js'), 'resilience loads after navigation state');
expect(workspace.includes("readStorage('depth', 'quick')"), 'Quick/Full depth persists with a Quick default');
expect(workspace.includes('stopImmediatePropagation'), 'hidden Next move navigation is intercepted before scrolling');
expect(workspace.includes('ArrowLeft') && workspace.includes('ArrowRight'), 'workspace tabs support keyboard navigation');
expect(media.includes('news:media-refresh'), 'media responds to the global refresh event');
expect(media.includes('Still loading. Refresh the player'), 'media includes a load timeout and recovery message');
expect(polish.includes('setRailPaused') && polish.includes("animationPlayState = paused ? 'paused' : 'running'"), 'moving signal rail can pause and resume');
expect(polish.includes('newsPulseGrid'), 'top visual pulse is rendered');
expect(polishCss.includes('@media (max-width: 560px)'), 'phone breakpoint is present');
expect(polishCss.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion behavior is present');
expect(!polishCss.includes('.news-personal-view #newsPersonalView'), 'build-note toggle remains available after notes are hidden');
expect(workspace.includes("reducedMotion ? 'auto' : 'smooth'"), 'workspace scrolling respects reduced-motion preferences');

expect(navigation.includes('newsSectionMap'), 'sticky briefing map is created');
expect(navigation.includes('newsSectionDrawer'), 'all-sections drawer is created');
expect(navigation.includes('newsSharedPath'), 'shared Today-to-Together path is created');
expect(navigation.includes('news-section-context'), 'full sections receive contextual related links');
expect(navigation.includes('news-section-guide'), 'full sections receive previous and next controls');
expect(navigation.includes('urlForSection') && navigation.includes('urlForTab'), 'sections and Quick tabs have direct URL state');
expect(navigation.includes("window.addEventListener('popstate'"), 'browser back and forward restore navigation state');
expect(navigation.includes('navigator.clipboard.writeText'), 'section links can be copied');
expect(navigation.includes('trapFocus') && navigation.includes("'inert' in shell"), 'section drawer protects keyboard and background focus');
expect(navigationState.includes('selectQuickBeforeTab'), 'Quick tab clicks force the matching Quick visual state');
expect(navigationState.includes('correctBareFullUrl'), 'bare Full URLs open the full edition at Start');
expect(navigationState.includes('refreshDrawerCurrent'), 'drawer restores the active destination state');
expect(navigationCss.includes('position: sticky'), 'section map stays available while reading');
expect(navigationCss.includes('max-height: min(820px, calc(100dvh - 28px))'), 'drawer has a baseline viewport bound');
expect(navigationCss.includes('overscroll-behavior: contain'), 'drawer contains overscroll');
expect(navigationCss.includes('@media (max-width: 520px)'), 'navigation has a phone layout');
expect(navigationCss.includes('@media (prefers-reduced-motion: reduce)'), 'navigation respects reduced motion');

expect(resilience.includes('visualViewport'), 'resilience tracks the visual viewport');
expect(resilience.includes('--news-viewport-height'), 'resilience publishes viewport dimensions to CSS');
expect(resilience.includes('newsHelpButton') && resilience.includes('newsHelpLayer'), 'quiet question-mark help is available');
expect(resilience.includes('closeDrawerForHelp') && resilience.includes('closeHelpForDrawer'), 'help and section drawer coordinate as one overlay at a time');
expect(resilience.includes("window.addEventListener('offline'"), 'offline changes are detected');
expect(resilience.includes('The written briefing is still available'), 'offline state explains what remains usable');
expect(resilience.includes('speechSynthesis'), 'read-aloud capability is checked');
expect(resilience.includes('MutationObserver') && resilience.includes('prepareFrames'), 'dynamic media receives device preparation');
expect(resilienceCss.includes('var(--news-viewport-height'), 'help and drawer use visible viewport bounds');
expect(resilienceCss.includes('position: sticky') && resilienceCss.includes('bottom: -20px'), 'overlay actions remain reachable in a sticky footer');
expect(resilienceCss.includes('@media (forced-colors: active)'), 'resilience supports forced colors');
expect(resilienceCss.includes('@media (prefers-reduced-motion: reduce)'), 'resilience respects reduced motion');

expect(browserSpec.includes('quiet help and section drawer never overlap'), 'browser tests cover overlay coordination');
expect(browserSpec.includes('remain inside the visible viewport'), 'browser tests cover visible viewport bounds');
expect(browserSpec.includes('offline state keeps the written briefing available'), 'browser tests cover offline behavior');
expect(browserSpec.includes('read aloud is disabled cleanly'), 'browser tests cover missing speech capability');
expect(browserConfig.includes("devices['iPhone 13']") && browserConfig.includes("devices['Pixel 5']"), 'browser matrix includes iPhone and Android emulation');
expect(index.includes('news-16'), 'entry page cache version was bumped');

const failed = checks.filter(check => !check.condition);
for (const check of checks) console.log(`${check.condition ? 'PASS' : 'FAIL'} ${check.message}`);
if (failed.length) {
  console.error(`\n${failed.length} validation check(s) failed.`);
  process.exit(1);
}
console.log(`\n${checks.length} validation checks passed.`);
