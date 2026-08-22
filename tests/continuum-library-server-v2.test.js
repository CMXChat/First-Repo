'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('library/index.html', 'utf8');
const shared = fs.readFileSync('assets/continuum-operator-api-v1.js', 'utf8');
const server = fs.readFileSync('assets/library/library-server-v2.js', 'utf8');
const css = fs.readFileSync('assets/library/library-server-v2.css', 'utf8');

assert.doesNotThrow(() => new Function(shared), 'shared operator API must parse');
assert.doesNotThrow(() => new Function(server), 'Library protected lane JS must parse');

assert.match(html, /id="libraryServerProof"/);
assert.match(html, /DURABLE MEMORY · PROTECTED CONTENT/);
assert.match(html, /id="libraryUnlockForm"/);
assert.match(html, /id="libraryServerWorkspace"/);
assert.match(html, /id="libraryServerCreateForm"/);
assert.match(html, /id="libraryServerEditor"/);
assert.match(html, /id="libraryServerConflict"/);
assert.match(html, /id="libraryServerVersions"/);
assert.match(html, /id="libraryImmutableProof"/);
assert.match(html, /assets\/continuum-operator-api-v1\.js/);
assert.match(html, /assets\/library\/library-server-v2\.js/);
assert.match(html, /assets\/library\/library-server-v2\.css/);
assert(html.indexOf('/assets/continuum-operator-api-v1.js') < html.indexOf('/assets/library/library-server-v2.js'), 'shared operator API must load before Library protected lane');
assert.doesNotMatch(html, /href="\/lab\//);

assert.match(shared, /listLibrary: \(\) => request\(`\$\{OP\}\/library`\)/);
assert.match(shared, /createContent:/);
assert.match(shared, /getContent:/);
assert.match(shared, /updateContentDraft:/);
assert.match(shared, /saveContentVersion:/);
assert.match(shared, /credentials: "include"/);
assert.match(shared, /X-CSRF-Token/);
assert.doesNotMatch(shared, /localStorage/);
assert.doesNotMatch(shared, /sessionStorage/);

assert.match(server, /api\.session\(\{ refresh: true \}\)/);
assert.match(server, /await api\.unlock\(key\)/);
assert.match(server, /els\.operatorKey\.value = ''/);
assert.match(server, /await api\.listLibrary\(\)/);
assert.match(server, /await api\.createContent\(/);
assert.match(server, /expected_revision: expectedRevision/);
assert.match(server, /api\.classify\(error\) === 'conflict'/);
assert.match(server, /Nothing was overwritten/);
assert.match(server, /await api\.saveContentVersion/);
assert.match(server, /Object\.freeze\(\{ \.\.\.frozen \}\)/);
assert.match(server, /Immutable proof/);
assert.match(server, /frozen\.source_text !== current\.source_text/);
assert.doesNotMatch(server, /localStorage/);
assert.doesNotMatch(server, /sessionStorage/);
assert.doesNotMatch(server, /real_smtp/);
assert.doesNotMatch(server, /provider_mode/);
assert.doesNotMatch(server, /automations\/.*runs/);

assert.match(css, /\.lib-server-proof/);
assert.match(css, /\.lib-server-conflict/);
assert.match(css, /\.lib-immutable-proof/);
assert.match(css, /@media\(max-width:900px\)/);
assert.match(css, /html\[data-theme="dark"\]/);

console.log('Continuum protected Library ContentAsset/Draft/Version source contract passed.');
