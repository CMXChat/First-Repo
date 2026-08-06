import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function note(message) {
  notes.push(message);
}

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function extractAssets(html) {
  const refs = new Map();
  const pattern = /(?:src|href)=["'](\/assets\/[^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g;
  for (const match of html.matchAll(pattern)) {
    const url = match[1];
    const [pathname, query = ''] = url.split('?');
    refs.set(pathname, { url, query: new URLSearchParams(query), rawQuery: query });
  }
  return refs;
}

function sameEntries(left, right) {
  return JSON.stringify([...left.entries()]) === JSON.stringify([...right.entries()]);
}

function gitOutput(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    const detail = error?.stderr?.toString().trim();
    fail(`Git command failed: git ${args.join(' ')}${detail ? `\n${detail}` : ''}`);
    return '';
  }
}

function readAtCommit(commit, relativePath) {
  try {
    return execFileSync('git', ['show', `${commit}:${relativePath}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).replace(/\r\n/g, '\n');
  } catch {
    return '';
  }
}

function versionFor(refs, assetPath) {
  return refs.get(`/${assetPath}`)?.query.get('v') || '';
}

const brief = read('brief/index.html');
const briefNext = read('brief-next/index.html');
const doc = read('doc/index.html');
const routesRaw = read('assets/cmx-routes.json');

assert(brief === briefNext, '`/brief/` and `/brief-next/` are no longer byte-for-byte aligned. Document an intentional staging difference before allowing drift.');

const briefAssets = extractAssets(brief);
const briefNextAssets = extractAssets(briefNext);
assert(sameEntries(briefAssets, briefNextAssets), '`/brief/` and `/brief-next/` reference different assets or cache versions.');

for (const [assetUrl, metadata] of briefAssets) {
  if (!assetUrl.startsWith('/assets/brief/')) continue;
  assert(metadata.query.has('v'), `Active Brief asset is missing a cache version: ${assetUrl}`);
  const relativePath = assetUrl.slice(1);
  assert(fs.existsSync(path.join(root, relativePath)), `Active Brief asset does not exist: ${relativePath}`);
}

for (const [surface, html] of [
  ['/brief/', brief],
  ['/brief-next/', briefNext],
  ['/doc/', doc]
]) {
  assert(/<html\b[^>]*\bdata-theme=["']light["']/i.test(html), `${surface} must ship a light first-paint HTML theme.`);
  assert(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html), `${surface} must remain noindex.`);
}

assert(/<title>[^<]*Demo[^<]*<\/title>/i.test(brief), '`/brief/` title must identify the surface as a demo.');
assert(/fictional|sample|demonstration|demo records|working demo/i.test(brief), '`/brief/` must visibly distinguish demonstration data from a live connected product.');
assert(/What works now and what still needs building/i.test(doc), '`/doc/` must preserve the current-versus-planned product boundary.');
assert(/href=["']\/doc\/["']/i.test(brief), '`/brief/` must retain a product overview link.');
assert(/href=["']\/brief\/["']/i.test(doc), '`/doc/` must retain a demo link.');
assert(!/cmx-gate-black-prompt|data-cmx-gate|type=["']password["']/i.test(doc), '`/doc/` contains password-gate markup or assets.');

let routes = null;
try {
  routes = JSON.parse(routesRaw);
} catch (error) {
  fail(`assets/cmx-routes.json is invalid JSON: ${error.message}`);
}

if (routes?.routes) {
  for (const routePath of ['/brief/', '/brief-next/', '/doc/']) {
    const route = routes.routes.find(item => item.path === routePath);
    assert(Boolean(route), `Route registry is missing ${routePath}.`);
    if (route) assert(route.gated === false, `${routePath} must remain ungated in the route registry.`);
  }
}

const baseSha = process.env.BASE_SHA || process.argv.find(argument => argument.startsWith('--base='))?.slice(7) || '';
if (baseSha && !/^0+$/.test(baseSha)) {
  const changed = gitOutput(['diff', '--name-only', `${baseSha}...HEAD`]).split('\n').filter(Boolean);
  const changedActiveAssets = changed.filter(file => /^assets\/brief\/.*\.(?:js|css)$/.test(file) && briefAssets.has(`/${file}`));

  if (changedActiveAssets.length) {
    const baseBrief = readAtCommit(baseSha, 'brief/index.html');
    const baseRefs = extractAssets(baseBrief);

    for (const asset of changedActiveAssets) {
      const previousVersion = versionFor(baseRefs, asset);
      const currentVersion = versionFor(briefAssets, asset);
      assert(
        Boolean(currentVersion) && currentVersion !== previousVersion,
        `Cache version was not changed for modified active asset ${asset}. Previous: ${previousVersion || '(none)'}, current: ${currentVersion || '(none)'}.`
      );
    }
  } else {
    note('No active Brief runtime assets changed in this comparison.');
  }
} else {
  note('BASE_SHA was not supplied, so differential cache-version enforcement was skipped.');
}

if (notes.length) {
  console.log('Personal OS release notes:');
  for (const message of notes) console.log(`- ${message}`);
}

if (failures.length) {
  console.error('\nPersonal OS release validation failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Personal OS release validation passed with ${briefAssets.size} versioned local Brief assets.`);
