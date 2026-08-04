import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, normalize, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd());
const failures = [];
const requiredFiles = [
  'assets/cmx-page-standard.js',
  'assets/cmx-tool-hardening.js',
  'assets/cmx-tool-shell.css',
  'assets/cmx-case-context.js',
  'assets/cmx-case-context.css',
  'assets/cases-state-sync.js',
  'assets/cases-operator-workspace.js',
  'assets/cases-operator-workspace.css',
  'assets/cases-operator-responsive.css',
  'assets/cases-operator-records.js',
  'assets/search-workbench.js',
  'assets/metadata-workbench.js',
  'assets/metadata-workbench.css',
  'assets/osint-workbench.js',
  'assets/osint-workbench.css',
  'assets/phone-workbench.js',
  'assets/phone-workbench.css',
  'assets/missing-workbench.js',
  'assets/missing-workbench.css',
  'assets/cases-workbench.js',
  'assets/cases-workbench.css',
  'search/index.html',
  'metadata/index.html',
  'osint/index.html',
  'phone/index.html',
  'missing/index.html',
  'cases/index.html',
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
  'assets/cmx-case-context.js',
  'assets/cases-state-sync.js',
  'assets/cases-operator-workspace.js',
  'assets/cases-operator-records.js',
  'assets/search-workbench.js',
  'assets/metadata-workbench.js',
  'assets/osint-workbench.js',
  'assets/phone-workbench.js',
  'assets/missing-workbench.js',
  'assets/cases-workbench.js'
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

const migratedPages = [
  'search/index.html',
  'metadata/index.html',
  'osint/index.html',
  'phone/index.html',
  'missing/index.html',
  'cases/index.html'
];
for (const file of migratedPages) {
  if (!existsSync(join(root, file))) continue;
  const source = readFileSync(join(root, file), 'utf8');
  for (const { pattern, label } of bannedPatterns) {
    if (pattern.test(source)) failures.push(`${file} contains ${label}`);
  }
  if (!/data-cmx-modern="true"/.test(source)) failures.push(`${file} must declare data-cmx-modern="true"`);
  checkLocalReferences(file, source);
}

checkPageModule('search/index.html', 'assets/search-workbench.js', [
  '/assets/search-workbench.js',
  '/assets/cmx-tool-shell.css'
]);
checkPageModule('metadata/index.html', 'assets/metadata-workbench.js', [
  '/assets/metadata-workbench.js',
  '/assets/metadata-workbench.css',
  '/assets/cmx-tool-shell.css'
]);
checkPageModule('osint/index.html', 'assets/osint-workbench.js', [
  '/assets/osint-workbench.js',
  '/assets/osint-workbench.css',
  '/assets/cmx-tool-shell.css'
]);
checkPageModule('osint/index.html', 'assets/cmx-case-context.js', [
  '/assets/cmx-case-context.js',
  '/assets/cmx-case-context.css'
]);
checkPageModule('phone/index.html', 'assets/phone-workbench.js', [
  '/assets/phone-workbench.js',
  '/assets/phone-workbench.css',
  '/assets/cmx-tool-shell.css'
]);
checkPageModule('missing/index.html', 'assets/missing-workbench.js', [
  '/assets/missing-workbench.js',
  '/assets/missing-workbench.css',
  '/assets/cmx-tool-shell.css'
]);
checkPageModule('cases/index.html', 'assets/cases-workbench.js', [
  '/assets/cases-workbench.js',
  '/assets/cases-workbench.css',
  '/assets/cmx-tool-shell.css'
]);
checkSafeModule('assets/cases-state-sync.js');
checkSafeModule('assets/cases-operator-workspace.js');
checkSafeModule('assets/cases-operator-records.js');
checkCasesOperatorLoader();

function checkPageModule(page, module, requiredReferences) {
  const pagePath = join(root, page);
  const modulePath = join(root, module);
  if (!existsSync(pagePath) || !existsSync(modulePath)) return;

  const pageSource = readFileSync(pagePath, 'utf8');
  requiredReferences.forEach((reference) => {
    if (!pageSource.includes(reference)) failures.push(`${page} must reference ${reference}`);
  });
  checkSafeModule(module);
}

function checkCasesOperatorLoader() {
  const loaderPath = join(root, 'assets/cases-state-sync.js');
  if (!existsSync(loaderPath)) return;
  const source = readFileSync(loaderPath, 'utf8');
  [
    '/assets/cases-operator-workspace.js',
    '/assets/cases-operator-workspace.css',
    '/assets/cases-operator-responsive.css',
    '/assets/cases-operator-records.js'
  ].forEach((reference) => {
    if (!source.includes(reference)) failures.push(`assets/cases-state-sync.js must load ${reference}`);
  });
}

function checkSafeModule(module) {
  const modulePath = join(root, module);
  if (!existsSync(modulePath)) return;
  const moduleSource = readFileSync(modulePath, 'utf8');
  const unsafeSinks = [
    /\.innerHTML\s*=/,
    /insertAdjacentHTML\s*\(/,
    /document\.write\s*\(/
  ];
  unsafeSinks.forEach((pattern) => {
    if (pattern.test(moduleSource)) failures.push(`${module} contains unsafe HTML sink: ${pattern}`);
  });
  if (/localStorage\./.test(moduleSource)) failures.push(`${module} must not persist research data in localStorage`);
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

console.log(`OSINT platform checks passed for ${migratedPages.length} migrated tool pages.`);
