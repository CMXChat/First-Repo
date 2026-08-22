'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('library/index.html','utf8');
const css = fs.readFileSync('assets/lab/library-app-v1.css','utf8');
const js = fs.readFileSync('assets/lab/library-app-v1.js','utf8');
const qa = fs.readFileSync('assets/lab/library-app-v1-qa.js','utf8');
const theme = fs.readFileSync('assets/lab/library-theme-init.js','utf8');

assert.match(html, /<title>Continuum · Library<\/title>/);
assert.match(html, /LIBRARY · PROVING/);
assert.match(html, /Local preview lane/);
assert.match(html, /Only this preview lane uses browser storage/);
assert.match(html, /mixed-media\/file\/folder workspace remains explicitly browser-local preview/);
assert.match(html, /Recent/);
assert.match(html, /Favorites/);
assert.match(html, /Templates/);
assert.match(html, /Imports/);
assert.match(html, /KNOWLEDGE INGESTION · LOCAL PREVIEW/);
assert.match(html, /STORE → UNDERSTAND → INTEGRATE/);
assert.match(html, /Upload file/);
assert.match(html, /Video, audio, images, PDFs, Office files/);
assert.match(html, /href="\/checkin\/"/);
assert.match(html, /href="\/control\/"/);
assert.match(html, /href="\/directory\/"/);
assert.match(html, /href="\/library\/"/);
assert.match(html, /href="\/automations\/"/);
assert.doesNotMatch(html, /href="\/lab\//);
assert.match(theme, /patchCanonicalRoutes/);
assert.match(theme, /\['\/lab\/control\/', '\/control\/'\]/);
assert.match(theme, /\['\/lab\/directory\/', '\/directory\/'\]/);
assert.match(theme, /\['\/lab\/library\/', '\/library\/'\]/);
assert.match(theme, /\['\/lab\/automations\/', '\/automations\/'\]/);
assert.doesNotMatch(html, /https:\/\/api\.cmxchat\.com/);
assert.match(html, /connect-src 'self' https:\/\/\*\.cmxchat\.com http:\/\/localhost:8000/);
assert.doesNotMatch(html, /<script(?![^>]*src=)[^>]*>/i);
assert.doesNotMatch(html, /<style[\s>]/i);

assert.match(css, /--bg:#060708/);
assert.match(css, /\.lib-workspace/);
assert.match(css, /\.lib-folder-pane/);
assert.match(css, /\.lib-inspector/);
assert.match(css, /\.lib-video-stage/);
assert.match(css, /\.lib-audio-stage/);
assert.match(css, /\.lib-mobile-nav/);
assert.match(css, /@media\(max-width:880px\)/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(css, /url\(https?:/i);

assert.doesNotThrow(() => new Function(js), 'Library local preview JS must parse');
assert.doesNotThrow(() => new Function(qa), 'Library QA JS must parse');
assert.match(js, /cmx-lab-content-assets-v1/);
assert.match(js, /cmx-lab-file-assets-v1/);
assert.match(js, /cmx-lab-library-meta-v1/);
assert.match(js, /cmx-lab-library-ui-v1/);
assert.match(js, /content-continuity-md/);
assert.match(js, /file-continuity-video/);
assert.match(js, /file-voice-note/);
assert.match(js, /function createFolder/);
assert.match(js, /function createContent/);
assert.match(js, /function persistEditor/);
assert.match(js, /function storeImport/);
assert.match(js, /function computedUses/);
assert.match(js, /Source stays separate/);
assert.match(js, /Authority stays separate/);
assert.match(js, /Exact-version rule/);
assert.match(js, /Transcript representation preview/);
assert.match(js, /no audio bytes stored in Lab/);
assert.match(qa, /data-save-version/);
assert.match(qa, /Saved from standalone Library detail rail/);
assert.match(theme, /library-app-v1-qa\.js\?v=20260819-1/);

for (const source of [js,qa]) {
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.doesNotMatch(source, /XMLHttpRequest/);
  assert.doesNotMatch(source, /WebSocket\s*\(/);
  assert.doesNotMatch(source, /EventSource\s*\(/);
}

console.log('Continuum local Library preview remains explicit and isolated beside the protected server lane.');
