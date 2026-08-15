"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const html = fs.readFileSync(path.join(root, "checkin/index.html"), "utf8");
const js = fs.readFileSync(path.join(root, "assets/checkin/checkin.js"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/checkin/checkin.css"), "utf8");

assert.match(html, /Primary weekly switch/);
assert.match(html, /every Saturday at 12:00 PM America\/New_York/);
assert.match(html, /Operator key/);
assert.doesNotMatch(html, /authEmail|authPassword|Sign in to Check In/);
assert.match(html, /data-view-panel="records"/);
assert.match(html, /DOCUMENTS/);
assert.match(html, /CONTACTS/);
assert.match(html, /ORGANIZATIONS/);
assert.match(html, /PRIVATE MARKDOWN NOTEBOOK/);
assert.match(html, /Insert Update/);
assert.match(html, /REVISION HISTORY/);
assert.match(html, /ORDERED TRIGGER PLAN/);
assert.match(html, /DATABASE AUDIT LOG/);
assert.match(html, /Run safe simulation/);

assert.match(js, /\/checkin\/public\/status/);
assert.match(js, /credentials: "include"/);
assert.match(js, /X-CSRF-Token/);
assert.match(js, /\/checkin\/operator\/unlock/);
assert.match(js, /\/checkin\/operator\/session/);
assert.doesNotMatch(js, /switchId|switch_id|owner_id|localStorage\.setItem\([^,]*operator/i);
assert.match(js, /Simulation stops\. No record, note, action, or deadline changed/);
assert.match(js, /THEME_KEY/);

assert.match(css, /\.record-columns/);
assert.match(css, /\.notebook/);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /html\[data-theme="dark"\]/);

console.log("Check-in operations smoke test passed.");
