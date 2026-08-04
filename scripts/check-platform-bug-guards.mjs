import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd());
const failures = [];
const javascriptFiles = [
  'assets/cmx-case-save-guard.js',
  'assets/cases-workbench-guard.js',
  'assets/case-lifecycle-guard.js'
];

for (const file of javascriptFiles) {
  const path = join(root, file);
  if (!existsSync(path)) {
    failures.push(`Missing platform bug guard: ${file}`);
    continue;
  }
  try {
    execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
  } catch (error) {
    failures.push(`JavaScript syntax check failed: ${file}\n${String(error.stderr || error.message)}`);
  }
  const source = readFileSync(path, 'utf8');
  if (/\.innerHTML\s*=|insertAdjacentHTML\s*\(|document\.write\s*\(/.test(source)) {
    failures.push(`${file} contains an unsafe HTML sink`);
  }
  if (/localStorage\./.test(source)) failures.push(`${file} must not use localStorage`);
}

requireMarker('assets/cmx-page-standard.js', '/assets/cmx-case-save-guard.js');
requireMarker('assets/cases-state-sync.js', '/assets/cases-workbench-guard.js');
requireMarker('cases/lifecycle/index.html', '/assets/case-lifecycle-guard.js');
requireMarker('backend/app/hardened.py', 'buffer_request_messages');
requireMarker('backend/app/hardened.py', 'API request body exceeds the 2.5 MB transport limit');
requireMarker('backend/app/api/imports.py', 'link_missing_import_sources');
requireMarker('backend/app/api/enrichment.py', 'bounded_network_call');
requireMarker('backend/app/api/enrichment.py', 'canonicalize_http_url');
requireMarker('backend/tests/test_write_security.py', 'actual_oversized_write');
requireMarker('backend/tests/test_imports.py', 'linked_observations');
requireMarker('backend/tests/test_enrichment.py', 'canonicalizes_unicode_path');
requireMarker('backend/tests/test_enrichment.py', 'end_to_end_timeout');

function requireMarker(file, marker) {
  const path = join(root, file);
  if (!existsSync(path)) {
    failures.push(`Missing required file: ${file}`);
    return;
  }
  if (!readFileSync(path, 'utf8').includes(marker)) {
    failures.push(`${file} must include bug-audit marker: ${marker}`);
  }
}

if (failures.length) {
  console.error('\nPlatform bug-guard checks failed:\n');
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exit(1);
}

console.log('Platform bug-guard checks passed.');
