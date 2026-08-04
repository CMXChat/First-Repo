const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const script = fs.readFileSync('assets/brief/brief-system.js', 'utf8');
const styles = fs.readFileSync('assets/brief/brief-system.css', 'utf8');
const bridge = fs.readFileSync('assets/brief/brief-terminal-bridge.js', 'utf8');

new vm.Script(script, { filename: 'brief-system.js' });
new vm.Script(bridge, { filename: 'brief-terminal-bridge.js' });

assert.match(script, /data-system-mode="focus"/);
assert.match(script, /data-system-mode="workspace"/);
assert.match(script, /data-system-mode="full"/);
assert.match(script, /Home/);
assert.match(script, /Briefing/);
assert.match(script, /Spaces/);
assert.match(script, /Plans/);
assert.match(script, /Library/);
assert.match(script, /briefSystemTerminalDock/);
assert.match(script, /briefSystemTour/);
assert.match(script, /startEntryLock/);
assert.match(script, /protectedScrollIntoView/);
assert.match(script, /handleSystemTerminalCommand/);
assert.match(styles, /brief-system-header/);
assert.match(styles, /brief-system-primary/);
assert.match(styles, /brief-system-secondary/);
assert.match(styles, /brief-system-full-bar/);
assert.match(styles, /brief-terminal-system-drawer/);
assert.match(styles, /@media \(max-width: 700px\)/);
assert.doesNotMatch(bridge, /brief-navigation\.js/);
assert.doesNotMatch(bridge, /brief-navigation-runtime\.js/);

console.log('Unified briefing system smoke test passed.');
