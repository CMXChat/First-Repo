import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd());
const failures = [];
const requiredFiles = [
  'assets/cmx-page-standard.js',
  'assets/cmx-tool-hardening.js',
  'assets/cmx-tool-shell.css',
  'assets/search-workbench.js',
  'search/index.html',
  'SECURITY.md',
  'docs/OSINT_PLATFORM_ROADMAP.md'
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) failures.push(`Missing required file: ${file}`);
}

const javascriptFiles = [
  'assets/cmx-page-standard.js',
  'assets/cmx-tool-hardening.js',
  'assets/cmx-ops-core.js',
  'assets/cmx-ops-runtime.js',
  'assets/search-workbench.js'
];

for (const file of javascriptFiles) {
  if (!existsSync(join(root, file))) continue;
  try {
    execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'pipe' });
  } catch (error) {
    failures.push(`JavaScript syntax check failed: ${file}\n${String(error.stderr || error.message)}`);
  }
}

const bannedPatterns = [
  { pattern: /site:forums\.\*/i, label: 'wildcard forums site operator' },
  { pattern: /site:boards\.\*/i, label: 'wildcard boards site operator' },
  { pattern: /site:discourse\.\*/i, label: 'wildcard Discourse site operator' },
  { pattern: /site:\.edu\b/i, label: 'unsupported generic .edu site operator' },
  { pattern: /site:\.gov(?:\.\*)?\b/i, label: 'unsupported generic .gov site operator' },
  { pattern: /\bcache:/i, label: 'retired cache operator' },
  { pattern: /\brelated:/i, label: 'retired related operator' },
  { pattern: /```||/, label: 'trailing editor artifact' }
];

const checkedPages = [
  'search/index.html',
  'missing/index.html'
];

for (const file of checkedPages) {
  if (!existsSync(join(root, file))) continue;
  const source = readFileSync(join(root, file), 'utf8');
  for (const { pattern, label } of bannedPatterns) {
    if (pattern.test(source)) failures.push(`${file} contains ${label}`);
  }
}

const searchHtmlPath = join(root, 'search/index.html');
if (existsSync(searchHtmlPath)) {
  const searchHtml = readFileSync(searchHtmlPath, 'utf8');
  if (!/data-cmx-modern="true"/.test(searchHtml)) failures.push('search/index.html must declare data-cmx-modern="true"');
  if (!/\/assets\/search-workbench\.js/.test(searchHtml)) failures.push('search/index.html must load the modular search workbench');
  if (!/\/assets\/cmx-tool-shell\.css/.test(searchHtml)) failures.push('search/index.html must load the modular tool shell stylesheet');
  checkLocalReferences('search/index.html', searchHtml);
}

const searchModulePath = join(root, 'assets/search-workbench.js');
if (existsSync(searchModulePath)) {
  const searchModule = readFileSync(searchModulePath, 'utf8');
  const unsafeSinks = [
    /\.innerHTML\s*=/,
    /insertAdjacentHTML\s*\(/,
    /document\.write\s*\(/
  ];
  unsafeSinks.forEach((pattern) => {
    if (pattern.test(searchModule)) failures.push(`assets/search-workbench.js contains unsafe HTML sink: ${pattern}`);
  });
  if (/localStorage\./.test(searchModule)) failures.push('assets/search-workbench.js must not persist research identifiers in localStorage');
}

function checkLocalReferences(file, source) {
  const referencePattern = /(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g;
  for (const match of source.matchAll(referencePattern)) {
    const urlPath = match[1];
    if (urlPath === '/' || urlPath.endsWith('/')) continue;
    const localPath = normalize(urlPath.replace(/^\//, ''));
    if (!existsSync(join(root, localPath))) failures.push(`${file} references missing local asset: ${urlPath}`);
  }
}

if (failures.length) {
  console.error('\nOSINT platform checks failed:\n');
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exit(1);
}

console.log('OSINT platform checks passed.');
