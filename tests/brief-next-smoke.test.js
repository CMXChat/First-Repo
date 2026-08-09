'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Keep the active/legacy/rollback smoke suite intact while advancing the
// exact cache-version assertion for the active Spaces runtime in this release.
const sourcePath = path.join(__dirname, 'brief-next-smoke.source.js');
let source = fs.readFileSync(sourcePath, 'utf8');
const previous = 'brief-spaces-runtime\\.js\\?v=20260806-1';
const current = 'brief-spaces-runtime\\.js\\?v=20260809-1';

if (!source.includes(previous)) {
  throw new Error('Spaces smoke source no longer contains the expected active runtime cache assertion.');
}

source = source.replace(previous, current);
const suite = new Module(sourcePath, module);
suite.filename = sourcePath;
suite.paths = Module._nodeModulePaths(__dirname);
suite._compile(source, sourcePath);
