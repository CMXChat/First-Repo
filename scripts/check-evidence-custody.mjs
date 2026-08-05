import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd());
const failures = [];
const required = [
  'assets/cases-evidence-custody.js',
  'assets/cases-evidence-custody.css',
  'backend/app/custody_models.py',
  'backend/app/custody_schemas.py',
  'backend/app/api/custody.py',
  'backend/app/services/custody.py',
  'backend/alembic/versions/20260804_0002_evidence_custody.py',
  'backend/tests/test_custody.py',
  'tests/browser/evidence-custody.spec.mjs'
];
for (const file of required) if (!existsSync(join(root, file))) failures.push(`Missing custody file: ${file}`);

for (const file of ['assets/cases-evidence-custody.js', 'tests/browser/evidence-custody.spec.mjs']) {
  if (!existsSync(join(root, file))) continue;
  try {
    execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'pipe' });
  } catch (error) {
    failures.push(`JavaScript syntax check failed: ${file}\n${String(error.stderr || error.message)}`);
  }
}

const clientPath = join(root, 'assets/cases-evidence-custody.js');
const apiPath = join(root, 'backend/app/api/custody.py');
const servicePath = join(root, 'backend/app/services/custody.py');
const loaderPath = join(root, 'assets/cases-state-sync.js');
const browserPath = join(root, 'tests/browser/evidence-custody.spec.mjs');
if ([clientPath, apiPath, servicePath, loaderPath, browserPath].every(existsSync)) {
  const client = readFileSync(clientPath, 'utf8');
  const api = readFileSync(apiPath, 'utf8');
  const service = readFileSync(servicePath, 'utf8');
  const loader = readFileSync(loaderPath, 'utf8');
  const browser = readFileSync(browserPath, 'utf8');

  ['Add custody event', 'Export manifest', 'Hash mismatch', 'textContent']
    .forEach((marker) => {
      if (!client.includes(marker)) failures.push(`Custody client missing marker: ${marker}`);
    });
  ['/custody', '/manifest', 'evidence.custody_recorded', 'integrity_state']
    .forEach((marker) => {
      if (!api.includes(marker)) failures.push(`Custody API missing marker: ${marker}`);
    });
  ['cmx-evidence-manifest-v1', 'sort_keys=True', 'separators=(",", ":")', 'manifest_sha256', 'uninterrupted physical control']
    .forEach((marker) => {
      if (!service.includes(marker)) failures.push(`Custody service missing marker: ${marker}`);
    });
  ['/assets/cases-evidence-custody.js', '/assets/cases-evidence-custody.css']
    .forEach((marker) => {
      if (!loader.includes(marker)) failures.push(`Cases loader missing custody asset: ${marker}`);
    });
  ['Hash match', 'Hash mismatch', 'waitForEvent(\'download\')', 'cmx-evidence-manifest-v1']
    .forEach((marker) => {
      if (!browser.includes(marker)) failures.push(`Custody browser test missing marker: ${marker}`);
    });

  if (/\.innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=/.test(client)) failures.push('Custody client must not use unsafe HTML sinks');
  if (/localStorage/.test(client)) failures.push('Custody client must not persist evidence data in localStorage');
  if (/fetch\(\s*[`'\"]https?:\/\//i.test(client)) failures.push('Custody client must use same-origin API routes only');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Evidence custody source policy passed.');
