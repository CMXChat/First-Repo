import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];

const currentDocs = [
  'docs/README.md',
  'docs/spaces-demo-continuity.md',
  'docs/2026-08-05-repository-reconciliation.md',
  'docs/brief-recovery-handoff.md',
  'docs/cmx-brief-master-context.md',
  'docs/brief-interface-validation.md',
  'docs/brief-interface-failures.md'
];

const routeMigrationDoc = 'docs/2026-08-06-spaces-route-migration.md';

const staleClaims = [
  /main is damaged/i,
  /brief-workspace\.js must be restored first/i,
  /PR #35[\s\S]{0,80}(?:active|open|dependency)/i,
  /PR #37[\s\S]{0,80}(?:active|open|dependency)/i,
  /current production contract[\s\S]{0,80}brief-workspace\.js/i
];

function fail(message) {
  failures.push(message);
}

function git(args, { optional = false } = {}) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    if (!optional) fail(`Git command failed: git ${args.join(' ')}`);
    return '';
  }
}

for (const file of currentDocs) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    fail(`Missing current operational document: ${file}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.trim().length < 80) fail(`Operational document is unexpectedly short: ${file}`);
  for (const pattern of staleClaims) {
    if (pattern.test(content)) fail(`${file} contains a superseded operational claim matching ${pattern}.`);
  }
}

const migrationPath = path.join(root, routeMigrationDoc);
if (!fs.existsSync(migrationPath)) {
  fail(`Missing Spaces route migration document: ${routeMigrationDoc}`);
} else {
  const migration = fs.readFileSync(migrationPath, 'utf8');
  if (!migration.includes('Primary route: `/spaces/`')) fail(`${routeMigrationDoc} does not declare the canonical route.`);
  if (!/shared calendars/i.test(migration)) fail(`${routeMigrationDoc} does not define shared calendars.`);
  if (!/alarm and launch routine/i.test(migration)) fail(`${routeMigrationDoc} does not define the alarm routine.`);
  if (!/^## Voice$/mi.test(migration)) fail(`${routeMigrationDoc} does not define voice behavior.`);
}

const indexPath = path.join(root, 'docs/README.md');
if (fs.existsSync(indexPath)) {
  const index = fs.readFileSync(indexPath, 'utf8');
  for (const file of currentDocs.slice(1)) {
    const basename = path.basename(file);
    if (!index.includes(basename)) fail(`docs/README.md does not list ${basename}.`);
  }

  const baseline = index.match(/Verified code baseline:\s*`([0-9a-f]{7,40})`/i)?.[1] || '';
  if (!baseline) {
    fail('docs/README.md does not declare a verified code baseline.');
  } else {
    git(['cat-file', '-e', `${baseline}^{commit}`], { optional: true });
    const count = git(['rev-list', '--count', `${baseline}..HEAD`], { optional: true });
    if (count && Number(count) > 20) {
      fail(`Operational docs are ${count} commits beyond their verified baseline ${baseline}. Reconcile the docs before release.`);
    }
  }
}

const baseSha = process.env.BASE_SHA || process.argv.find(argument => argument.startsWith('--base='))?.slice(7) || '';
if (baseSha && !/^0+$/.test(baseSha)) {
  const changed = git(['diff', '--name-only', `${baseSha}...HEAD`]).split('\n').filter(Boolean);
  const materialProductFiles = new Set([
    'spaces/index.html',
    'brief/index.html',
    'brief-next/index.html',
    'doc/index.html',
    'assets/cmx-routes.json',
    'assets/spaces-legacy-redirect.js',
    'assets/brief/brief-demo-app.js',
    'assets/brief/brief-demo-advanced.js',
    'assets/brief/brief-demo-conversation.js',
    'assets/brief/brief-demo-data.js',
    'assets/brief/brief-demo-experience.js',
    'assets/brief/brief-demo-explainers.js',
    'assets/brief/brief-demo-media.js',
    'assets/personal-os-doc.js'
  ]);
  const materialChange = changed.some(file => materialProductFiles.has(file));
  const docsChanged = changed.some(file => currentDocs.includes(file) || file === 'docs/personal-os-release-safeguards.md' || file === routeMigrationDoc);

  if (materialChange && !docsChanged) {
    fail('Material Spaces product files changed without updating a current operational document.');
  }
}

if (failures.length) {
  console.error('Documentation freshness validation failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Documentation freshness validation passed for ${currentDocs.length + 1} operational documents.`);
