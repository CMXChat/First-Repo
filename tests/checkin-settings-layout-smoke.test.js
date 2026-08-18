"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const css = fs.readFileSync(path.join(root, "assets/checkin/checkin-phase1-controls.css"), "utf8");

assert.match(css, /#settingsDialog\{width:min\(680px/);
assert.match(css, /max-width:680px/);
assert.match(css, /overflow-y:auto;overflow-x:hidden/);
assert.match(css, /#settingsDialog \.phase1-settings-form\{width:100%;max-width:100%;min-width:0/);
assert.match(css, /#settingsDialog \.phase1-current[^\n]*min-width:0|max-width:100%/);
assert.match(css, /@media\(max-width:700px\)[\s\S]*#settingsDialog\{width:calc\(100vw - 16px\)/);

console.log("Check In Settings layout smoke test passed.");
