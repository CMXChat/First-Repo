const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const config = read('assets/brief/brief-config.js');
const terminal = read('assets/brief/brief-terminal.js');
const styles = read('assets/brief/brief-terminal.css');

new vm.Script(terminal, { filename: 'brief-terminal.js' });

assert.match(config, /brief-terminal\.css/);
assert.match(config, /brief-terminal\.js/);
assert.match(config, /briefTerminalScript/);
assert.match(terminal, /Personal briefing terminal/);
assert.match(terminal, /Relationship briefing terminal/);
assert.match(terminal, /Business briefing terminal/);
assert.match(terminal, /Trainer briefing terminal/);
assert.match(terminal, /user@brief:~\/personal\$/);
assert.match(terminal, /pair@brief:~\/shared\$/);
assert.match(terminal, /partners@brief:~\/ops\$/);
assert.match(terminal, /coach@brief:~\/training\$/);
assert.match(terminal, /Nothing typed here leaves this page/);
assert.match(terminal, /private/);
assert.match(terminal, /shared/);
assert.match(terminal, /view personal\|relationship\|business\|trainer/);
assert.match(terminal, /brief:preset-change/);
assert.match(terminal, /briefingFooterSwitcher/);
assert.match(styles, /html\[data-theme='light'\]/);
assert.match(styles, /@media \(max-width: 680px\)/);
assert.match(styles, /font-size: 16px/);
assert.match(styles, /min-height: 44px/);

console.log('Brief terminal smoke test passed.');
