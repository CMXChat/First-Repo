import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const assetDir = path.join(root, 'assets/brief');
const outArgument = process.argv.find(argument => argument.startsWith('--out-dir='));
const outDir = path.resolve(root, outArgument ? outArgument.slice('--out-dir='.length) : 'artifacts/personal-os');
const checkOnly = process.argv.includes('--check');
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function directReferences(html) {
  return new Set(
    [...html.matchAll(/(?:src|href)=["']\/assets\/brief\/([^"'?]+\.(?:js|css))(?:\?[^"']*)?["']/g)]
      .map(match => match[1])
  );
}

function fileReferences(content, knownFiles) {
  const refs = new Set();
  for (const match of content.matchAll(/\/assets\/brief\/([A-Za-z0-9._/-]+\.(?:js|css))/g)) refs.add(path.basename(match[1]));
  for (const candidate of knownFiles) {
    if (content.includes(candidate)) refs.add(candidate);
  }
  return refs;
}

if (!fs.existsSync(assetDir)) {
  console.error('Missing assets/brief directory.');
  process.exit(1);
}

const files = fs.readdirSync(assetDir)
  .filter(name => /\.(?:js|css)$/.test(name))
  .sort();
const known = new Set(files);
const briefDirect = directReferences(read('brief/index.html'));
const stagingDirect = directReferences(read('brief-next/index.html'));

if (JSON.stringify([...briefDirect]) !== JSON.stringify([...stagingDirect])) {
  failures.push('Production and staging routes have different direct Brief asset entrypoints.');
}

const graph = new Map();
for (const file of files) {
  const content = fs.readFileSync(path.join(assetDir, file), 'utf8');
  graph.set(file, fileReferences(content, known));
}

const reachable = new Set();
const queue = [...briefDirect];
while (queue.length) {
  const file = queue.shift();
  if (reachable.has(file)) continue;
  reachable.add(file);
  if (!known.has(file)) {
    failures.push(`Active asset reference is missing: assets/brief/${file}`);
    continue;
  }
  for (const dependency of graph.get(file) || []) {
    if (!reachable.has(dependency)) queue.push(dependency);
  }
}

const rows = files.map(file => {
  const stats = fs.statSync(path.join(assetDir, file));
  const direct = briefDirect.has(file);
  const active = reachable.has(file);
  const empty = stats.size === 0;
  const classification = direct
    ? 'active direct entry'
    : active
      ? 'active dependency'
      : empty
        ? 'empty legacy placeholder'
        : file.startsWith('brief-demo-')
          ? 'unreferenced demo-family asset'
          : 'unreferenced legacy candidate';

  if (active && empty) failures.push(`Active asset is empty: assets/brief/${file}`);
  return { file, bytes: stats.size, classification };
});

const summary = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  direct: rows.filter(row => row.classification === 'active direct entry').length,
  activeDependencies: rows.filter(row => row.classification === 'active dependency').length,
  unreferenced: rows.filter(row => row.classification.startsWith('unreferenced')).length,
  emptyLegacy: rows.filter(row => row.classification === 'empty legacy placeholder').length
};

const markdown = [
  '# Brief Asset Inventory',
  '',
  `Generated: ${summary.generatedAt}`,
  '',
  `- Total JS/CSS assets: ${summary.total}`,
  `- Direct route entries: ${summary.direct}`,
  `- Reachable dependencies: ${summary.activeDependencies}`,
  `- Unreferenced candidates: ${summary.unreferenced}`,
  `- Empty legacy placeholders: ${summary.emptyLegacy}`,
  '',
  '| Asset | Bytes | Classification |',
  '|---|---:|---|',
  ...rows.map(row => `| \`assets/brief/${row.file}\` | ${row.bytes} | ${row.classification} |`),
  '',
  'Unreferenced does not mean safe to delete. Search route HTML, tests, workflows, documentation, and Git history before removal.'
].join('\n');

if (!checkOnly) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'brief-asset-inventory.md'), `${markdown}\n`);
  fs.writeFileSync(path.join(outDir, 'brief-asset-inventory.json'), `${JSON.stringify({ summary, rows }, null, 2)}\n`);
}

console.log(markdown);

if (failures.length) {
  console.error('\nBrief asset inventory checks failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}
