import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const problems = [];
const warnings = [];
const requiredPages = [
  'study/index.html',
  'study/python/index.html',
  'study/environment/index.html',
  'study/environment/handbook/index.html',
  'study/index/index.html',
];
const exists = p => fs.existsSync(path.join(root, p));
for (const p of requiredPages) if (!exists(p)) problems.push(`Missing required Study page: ${p}`);

const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});

const htmlFiles = exists('study') ? walk(path.join(root,'study')).filter(p=>p.endsWith('.html')) : [];
for (const file of htmlFiles) {
  const rel = path.relative(root,file).replaceAll('\\','/');
  const text = fs.readFileSync(file,'utf8');
  const ids = [...text.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) problems.push(`${rel}: duplicate id #${id}`); seen.add(id); }
  const idSet = new Set(ids);
  for (const m of text.matchAll(/\bhref=["']#([^"']+)["']/g)) {
    const id = m[1]; if (id && !idSet.has(id)) problems.push(`${rel}: same-page link points to missing #${id}`);
  }
  for (const m of text.matchAll(/(?:src|href)=["'](\/assets\/[^"'?]+\.(?:js|css))/g)) {
    const asset = m[1].slice(1); if (!exists(asset)) problems.push(`${rel}: missing referenced asset ${asset}`);
  }
}

const assetsDir = path.join(root,'assets');
const jsFiles = exists('assets') ? fs.readdirSync(assetsDir).filter(n=>/^study-.*\.js$/.test(n)).map(n=>path.join(assetsDir,n)) : [];
if (!jsFiles.length) problems.push('No assets/study-*.js files found');

const navPath = path.join(root,'assets','study-course-nav.js');
if (fs.existsSync(navPath)) {
  const nav = fs.readFileSync(navPath,'utf8');
  for (const route of ['/study/','/study/python/','/study/environment/','/study/environment/handbook/','/study/index/']) {
    if (!nav.includes(route)) problems.push(`study-course-nav.js does not mention ${route}`);
  }
  if (!nav.includes("localStorage.setItem(k,'light')")) warnings.push('Course nav no longer appears to set light as the first-time default.');
  for (const m of nav.matchAll(/['"](\/assets\/study-[^'"?]+\.(?:js|css))/g)) {
    const asset=m[1].slice(1); if(!exists(asset)) problems.push(`study-course-nav.js references missing ${asset}`);
  }
}

const currentLoaded = [
  'assets/study-deep-labs.js','assets/study-focus-nav.js','assets/study-handbook-sync.js',
  'assets/study-handbook-config.js','assets/study-handbook-corrections.js','assets/study-handbook-current.js',
  'assets/study-docker-v2.js','assets/study-self-check.js'
];
for (const p of currentLoaded) if (!exists(p)) problems.push(`Missing current enhancement asset: ${p}`);

// Visible Study copy should not contain the old developer shorthand as a standalone word.
for (const file of [...htmlFiles, ...jsFiles]) {
  const rel = path.relative(root,file).replaceAll('\\','/');
  const text = fs.readFileSync(file,'utf8');
  if (/\bCR\b/.test(text)) warnings.push(`${rel}: contains standalone "CR"; confirm it is not user-visible.`);
}

console.log(`Study QA scanned ${htmlFiles.length} HTML pages and ${jsFiles.length} Study JS assets.`);
if (warnings.length) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log(`  - ${w}`);
}
if (problems.length) {
  console.error('\nFailures:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('\n✓ Study structural validation passed.');
