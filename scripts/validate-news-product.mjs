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
const css = read('assets/news-polish.css');
const index = read('news/index.html');

expect(loader.includes('/assets/news-polish.js'), 'loader includes news-polish.js');
expect(loader.indexOf('/assets/news-workspace.js') < loader.indexOf('/assets/news-polish.js'), 'polish loads after workspace');
expect(workspace.includes("readStorage('depth', 'quick')"), 'Quick/Full depth persists with a Quick default');
expect(workspace.includes('stopImmediatePropagation'), 'hidden Next move navigation is intercepted before scrolling');
expect(workspace.includes('ArrowLeft') && workspace.includes('ArrowRight'), 'workspace tabs support keyboard navigation');
expect(media.includes('news:media-refresh'), 'media responds to the global refresh event');
expect(media.includes('Still loading. Refresh the player'), 'media includes a load timeout and recovery message');
expect(polish.includes('setRailPaused') && polish.includes("animationPlayState = paused ? 'paused' : 'running'"), 'moving signal rail can pause and resume');
expect(polish.includes('newsPulseGrid'), 'top visual pulse is rendered');
expect(css.includes('@media (max-width: 560px)'), 'phone breakpoint is present');
expect(css.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion behavior is present');
expect(!css.includes('.news-personal-view #newsPersonalView'), 'build-note toggle remains available after notes are hidden');
expect(workspace.includes("reducedMotion ? 'auto' : 'smooth'"), 'workspace scrolling respects reduced-motion preferences');
expect(index.includes('news-14'), 'entry page cache version was bumped');

const failed = checks.filter(check => !check.condition);
for (const check of checks) console.log(`${check.condition ? 'PASS' : 'FAIL'} ${check.message}`);
if (failed.length) {
  console.error(`\n${failed.length} validation check(s) failed.`);
  process.exit(1);
}
console.log(`\n${checks.length} validation checks passed.`);
