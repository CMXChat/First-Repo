const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('brief/index.html');
const config = read('assets/brief/brief-config.js');
const navigation = read('assets/brief/brief-navigation.js');
const styles = read('assets/brief/brief-navigation.css');

new vm.Script(navigation, { filename: 'brief-navigation.js' });

assert.match(navigation, /const ROUTES = \{/);
assert.match(navigation, /individual:/);
assert.match(navigation, /couple:/);
assert.match(navigation, /partners:/);
assert.match(navigation, /trainer:/);
assert.match(navigation, /team:/);
assert.match(navigation, /Briefing map/);
assert.match(navigation, /YOU ARE HERE/);
assert.match(navigation, /Recently viewed/);
assert.match(navigation, /Switch briefing/);
assert.match(navigation, /Quick briefing/);
assert.match(navigation, /Full workspace/);
assert.match(navigation, /data-quick-route/);
assert.match(navigation, /data-related-route/);
assert.match(navigation, /data-context-route/);
assert.match(navigation, /pushState/);
assert.match(navigation, /replaceState/);
assert.match(navigation, /popstate/);
assert.match(navigation, /hashchange/);
assert.match(navigation, /searchParams\.set\('view'/);
assert.match(navigation, /searchParams\.set\('tab'/);
assert.match(navigation, /searchParams\.set\('depth'/);
assert.match(navigation, /IntersectionObserver/);
assert.match(navigation, /prefers-reduced-motion/);
assert.match(navigation, /sessionStorage/);
assert.match(navigation, /window\.BRIEF_NAVIGATION/);
assert.doesNotMatch(navigation, /new MutationObserver/);

assert.match(styles, /position: sticky/);
assert.match(styles, /brief-navigator-bar/);
assert.match(styles, /brief-navigation-drawer/);
assert.match(styles, /brief-context-nav/);
assert.match(styles, /brief-related-routes/);
assert.match(styles, /scrollbar-width: none/);
assert.match(styles, /-webkit-overflow-scrolling: touch/);
assert.match(styles, /env\(safe-area-inset-top\)/);
assert.match(styles, /@media \(max-width: 700px\)/);
assert.match(styles, /@media \(pointer: coarse\)/);
assert.match(styles, /prefers-reduced-motion: reduce/);
assert.match(styles, /forced-colors: active/);
assert.match(styles, /@supports not \(\(-webkit-backdrop-filter/);

assert.match(index, /brief-config\.js\?v=20260803-\d+/);
assert.ok(config.includes('brief-navigation.css') || !config.includes('briefNavigationStyle'));

console.log('Brief interconnected navigation smoke test passed.');
