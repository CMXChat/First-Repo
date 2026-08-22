'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const convergence = fs.readFileSync('assets/lab/continuum-library-shell-convergence-v1.js','utf8');
const controlInit = fs.readFileSync('assets/lab/control-center-theme-init.js','utf8');
const directoryInit = fs.readFileSync('assets/lab/directory-theme-init.js','utf8');
const shell = fs.readFileSync('docs/continuum-shared-app-shell-CURRENT.md','utf8');

assert.doesNotThrow(() => new Function(convergence), 'Library shell convergence JS must parse');
assert.match(convergence, /const LIBRARY_PATH = '\/library\/'/);
assert.match(convergence, /\.cc-rail-nav/);
assert.match(convergence, /\.dir-rail-nav/);
assert.match(convergence, /data-library-command/);
assert.match(convergence, /Open documents, files, media and imported knowledge/);
assert.match(convergence, /window\.location\.href = LIBRARY_PATH/);
assert.match(convergence, /Library · PREVIEW/);
assert.doesNotMatch(convergence, /window\.location\.href = '\/lab\/library\/'/);
assert.doesNotMatch(convergence, /fetch\s*\(/);
assert.doesNotMatch(convergence, /XMLHttpRequest/);

assert.match(controlInit, /continuum-library-shell-convergence-v1\.js\?v=20260819-1/);
assert.match(directoryInit, /continuum-library-shell-convergence-v1\.js\?v=20260819-1/);
assert.match(shell, /The shared shell owns:/);
assert.match(shell, /\/library\//);
assert.match(shell, /Control\nCheck In\nDirectory\nLibrary\nMore/);

console.log('Continuum Library shared-shell convergence contract passed at /library/.');
