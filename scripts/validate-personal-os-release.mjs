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

const spaces = read('spaces/index.html');
const legacyBrief = read('brief/index.html');
const briefNext = read('brief-next/index.html');
const doc = read('doc/index.html');
const routesRaw = read('assets/cmx-routes.json');
const migrationDoc = read('docs/2026-08-06-spaces-route-migration.md');

const spacesAssets = extractAssets(spaces);

for (const [assetUrl, metadata] of spacesAssets) {
  if (!assetUrl.startsWith('/assets/brief/')) continue;
  assert(metadata.query.has('v'), `Active Spaces asset is missing a cache version: ${assetUrl}`);
  const relativePath = assetUrl.slice(1);
  assert(fs.existsSync(path.join(root, relativePath)), `Active Spaces asset does not exist: ${relativePath}`);
}

for (const [surface, html] of [
  ['/spaces/', spaces],
  ['/brief/', legacyBrief],
  ['/brief-next/', briefNext],
  ['/doc/', doc]
]) {
  assert(/<html\b[^>]*\bdata-theme=["']light["']/i.test(html), `${surface} must ship a light first-paint HTML theme.`);
  assert(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html), `${surface} must remain noindex.`);
}

assert(/<title>[^<]*Demo[^<]*<\/title>/i.test(spaces), '`/spaces/` title must identify the surface as a demo.');
assert(/fictional|sample|demonstration|demo records|working demo/i.test(spaces), '`/spaces/` must visibly distinguish demonstration data from a live connected product.');
assert(/href=["']\/doc\/["']/i.test(spaces), '`/spaces/` must retain a product overview link.');
assert(/https:\/\/db\.cmxchat\.com\/spaces\//i.test(spaces), '`/spaces/` must use the canonical Spaces URL.');
assert(/shared calendars/i.test(spaces), '`/spaces/` must retain the shared-calendar coordination concept.');
assert(/adaptive alarm/i.test(spaces), '`/spaces/` must retain the adaptive alarm concept.');
assert(/<strong>Voice:<\/strong>/i.test(spaces), '`/spaces/` must retain the bounded voice concept.');
assert(/aria-live=["']polite["']/i.test(spaces), '`/spaces/` must announce asynchronous media status changes.');
assert(/id=["']spotifyFrame["'][^>]*role=["']region["']/i.test(spaces), '`/spaces/` Spotify container must have an explicit region role.');

assert(/https:\/\/db\.cmxchat\.com\/spaces\//i.test(legacyBrief), '`/brief/` must canonicalize to `/spaces/`.');
assert(/http-equiv=["']refresh["'][^>]*\/spaces\//i.test(legacyBrief), '`/brief/` must include a no-JavaScript redirect fallback to `/spaces/`.');
assert(/spaces-legacy-redirect\.js/i.test(legacyBrief), '`/brief/` must preserve query strings and hashes through the external redirect helper.');
assert(/window\.location\.replace/i.test(read('assets/spaces-legacy-redirect.js')), 'Legacy redirect helper must replace browser history instead of adding a redirect hop.');

assert(
  /id=["']status["']/i.test(doc) &&
  /Current reality/i.test(doc) &&
  /separates what exists from what has been designed or planned/i.test(doc),
  '`/doc/` must preserve the current-versus-planned product boundary.'
);
assert(/href=["']\/(?:spaces|brief)\/["']/i.test(doc), '`/doc/` must retain a working demo link during the compatibility migration.');
assert(!/cmx-gate-black-prompt|data-cmx-gate|type=["']password["']/i.test(doc), '`/doc/` contains password-gate markup or assets.');
assert(/alarm/i.test(doc) && /voice/i.test(doc) && /calendar/i.test(doc), '`/doc/` must retain calendar, alarm, and voice concepts.');

assert(/Shared calendars/i.test(migrationDoc), 'Migration documentation must define shared calendars explicitly.');
assert(/Alarm and launch routine/i.test(migrationDoc), 'Migration documentation must define the alarm and launch routine.');
assert(/^## Voice$/mi.test(migrationDoc), 'Migration documentation must define bounded voice behavior.');

let routes = null;
try {
  routes = JSON.parse(routesRaw);
} catch (error) {
  fail(`assets/cmx-routes.json is invalid JSON: ${error.message}`);
}

if (routes?.routes) {
  const expected = [
    ['/spaces/', 'Active', false],
    ['/brief/', 'Legacy', false],
    ['/brief-next/', 'Experimental', false],
    ['/doc/', 'Active', false]
  ];

  for (const [routePath, status, gated] of expected) {
    const route = routes.routes.find(item => item.path === routePath);
    assert(Boolean(route), `Route registry is missing ${routePath}.`);
    if (!route) continue;
    assert(route.status === status, `${routePath} must have status ${status}, found ${route.status}.`);
    assert(route.gated === gated, `${routePath} must remain ungated in the route registry.`);
  }

  const spacesRoute = routes.routes.find(item => item.path === '/spaces/');
  assert(/shared-calendar|shared calendar/i.test(spacesRoute?.description || ''), 'The `/spaces/` route description must mention shared-calendar coordination.');
}

const baseSha = process.env.BASE_SHA || process.argv.find(argument => argument.startsWith('--base='))?.slice(7) || '';
if (baseSha && !/^0+$/.test(baseSha)) {
  const changed = gitOutput(['diff', '--name-only', `${baseSha}...HEAD`]).split('\n').filter(Boolean);
  const changedActiveAssets = changed.filter(file => /^assets\/brief\/.*\.(?:js|css)$/.test(file) && spacesAssets.has(`/${file}`));

  if (changedActiveAssets.length) {
    const baseSpaces = readAtCommit(baseSha, 'spaces/index.html') || readAtCommit(baseSha, 'brief/index.html');
    const baseRefs = extractAssets(baseSpaces);

    for (const asset of changedActiveAssets) {
      const previousVersion = versionFor(baseRefs, asset);
      const currentVersion = versionFor(spacesAssets, asset);
      assert(
        Boolean(currentVersion) && currentVersion !== previousVersion,
        `Cache version was not changed for modified active asset ${asset}. Previous: ${previousVersion || '(none)'}, current: ${currentVersion || '(none)'}.`
      );
    }
  } else {
    note('No active Spaces runtime assets changed in this comparison.');
  }
} else {
  note('BASE_SHA was not supplied, so differential cache-version enforcement was skipped.');
}

note('`/brief-next/` is intentionally a pre-migration rollback snapshot and is no longer required to match the active route byte-for-byte.');

if (notes.length) {
  console.log('Spaces release notes:');
  for (const message of notes) console.log(`- ${message}`);
}

if (failures.length) {
  console.error('\nSpaces release validation failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Spaces release validation passed with ${spacesAssets.size} versioned local active assets.`);
