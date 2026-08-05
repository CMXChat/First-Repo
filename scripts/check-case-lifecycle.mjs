import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, normalize, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd());
const failures = [];
const required = [
  'cases/lifecycle/index.html',
  'assets/case-lifecycle.js',
  'assets/case-lifecycle.css',
  'backend/app/platform.py',
  'backend/app/hardened.py',
  'backend/app/write_security.py',
  'backend/app/api/lifecycle.py',
  'backend/compose.platform.yml',
  'backend/tests/test_platform.py',
  'backend/tests/test_lifecycle.py',
  'backend/tests/test_write_security.py'
];

for (const file of required) {
  if (!existsSync(join(root, file))) failures.push(`Missing required lifecycle file: ${file}`);
}

const htmlPath = join(root, 'cases/lifecycle/index.html');
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');
  if (!html.includes('data-cmx-modern="true"')) failures.push('Lifecycle page must declare data-cmx-modern="true".');
  for (const reference of ['/assets/case-lifecycle.js', '/assets/case-lifecycle.css', '/assets/cmx-tool-shell.css']) {
    if (!html.includes(reference)) failures.push(`Lifecycle page must reference ${reference}.`);
  }
  const referencePattern = /(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g;
  for (const match of html.matchAll(referencePattern)) {
    const urlPath = match[1];
    if (urlPath === '/' || urlPath.endsWith('/')) continue;
    const localPath = normalize(urlPath.replace(/^\//, ''));
    if (!existsSync(join(root, localPath))) failures.push(`Lifecycle page references missing asset: ${urlPath}`);
  }
}

const jsPath = join(root, 'assets/case-lifecycle.js');
if (existsSync(jsPath)) {
  try {
    execFileSync(process.execPath, ['--check', jsPath], { stdio: 'pipe' });
  } catch (error) {
    failures.push(`Lifecycle JavaScript syntax failed: ${String(error.stderr || error.message)}`);
  }
  const source = readFileSync(jsPath, 'utf8');
  for (const pattern of [/\.innerHTML\s*=/, /insertAdjacentHTML\s*\(/, /document\.write\s*\(/, /localStorage\./]) {
    if (pattern.test(source)) failures.push(`Lifecycle JavaScript contains prohibited pattern: ${pattern}`);
  }
  if (!source.includes('/api/cases/retention-due')) failures.push('Lifecycle client must load retention-due cases.');
  if (!source.includes('/api/cases/deleted')) failures.push('Lifecycle client must load soft-deleted cases.');
  if (!source.includes('/audit')) failures.push('Lifecycle client must expose audit history.');
  if (!/openDialog\(['"]restore['"]/.test(source)) failures.push('Lifecycle client must expose restore.');
  if (!/openDialog\(['"]purge['"]/.test(source)) failures.push('Lifecycle client must expose purge.');
  if (!source.includes('${state.pendingAction}')) failures.push('Lifecycle mutations must use the reviewed pending action path.');
}

const lifecycleApiPath = join(root, 'backend/app/api/lifecycle.py');
if (existsSync(lifecycleApiPath)) {
  const source = readFileSync(lifecycleApiPath, 'utf8');
  for (const route of ['@router.get("/deleted"', '@router.get("/retention-due"', '@router.get("/{case_id}/audit"', '@router.post("/{case_id}/restore"', '@router.post("/{case_id}/purge"']) {
    if (!source.includes(route)) failures.push(`Lifecycle API must expose ${route}.`);
  }
}

const platformPath = join(root, 'backend/app/platform.py');
if (existsSync(platformPath)) {
  const source = readFileSync(platformPath, 'utf8');
  if (!source.includes('WriteSecurityMiddleware')) failures.push('Platform entry point must wrap FastAPI with write security.');
  if (!source.includes('/cases/lifecycle')) failures.push('Platform entry point must register the lifecycle route.');
}

if (failures.length) {
  console.error('\nCase lifecycle checks failed:\n');
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exit(1);
}

console.log('Case lifecycle source checks passed.');