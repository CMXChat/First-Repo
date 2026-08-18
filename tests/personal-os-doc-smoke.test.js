'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const finalCssPath = path.join(root, 'assets/continuum-doc-final.css');
const promiseCssPath = path.join(root, 'assets/continuum-doc-promise.css');
const qaCssPath = path.join(root, 'assets/continuum-doc-qa.css');
const humanCssPath = path.join(root, 'assets/continuum-doc-human.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, finalCssPath, promiseCssPath, qaCssPath, humanCssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Continuum document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const bodySource = html.slice(html.indexOf('<body>'));
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const finalCss = fs.readFileSync(finalCssPath, 'utf8');
const promiseCss = fs.readFileSync(promiseCssPath, 'utf8');
const qaCss = fs.readFileSync(qaCssPath, 'utf8');
const humanCss = fs.readFileSync(humanCssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=|data-cmx-gated-content|cmx-black-prompt-locked/);
assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /<title>Continuum \| Product Overview<\/title>/);
assert.match(html, /personal-os-doc\.js\?v=20260818-5/);
assert.match(html, /continuum-doc-final\.css\?v=20260818-3/);
assert.match(html, /continuum-doc-promise\.css\?v=20260818-2/);
assert.match(html, /continuum-doc-qa\.css\?v=20260818-1/);
assert.match(html, /continuum-doc-human\.css\?v=20260818-2/);
assert.doesNotMatch(html, /continuum-doc(?:-v2|-mobile-v3)?\.css/);
assert.doesNotMatch(html, /style=/i, 'Strict /doc CSP should not depend on inline style attributes.');
assert.match(html, /<h1 id="pageTitle">Continuum<\/h1>/);

// Static copy and runtime copy use the fuller plain-language opening.
assert.match(html, /Information, people, rules and AI in one place/);
assert.match(html, /Continuum keeps useful context in one private place/);
assert.match(html, /Keeps useful history/);
assert.match(html, /Links people \+ information/);
assert.match(html, /Runs approved rules/);
assert.match(html, /Continuum in one minute/);
assert.match(js, /dataset\.continuumClarity = 'ready'/);
assert.match(js, /Continuum keeps useful context in one private place/);
assert.match(js, /What happens when something changes/);
assert.match(js, /How the pieces fit together/);
assert.doesNotMatch(js, /Start here/);

// Useful-across-time visual and capability truth remain with the Parts of Continuum section.
assert.match(html, /ACROSS TIME/);
assert.match(html, /Keep the information and rules you choose/);
assert.match(html, /WITH YOU/);
assert.match(html, /FOR YOU/);
assert.match(html, /WHEN YOU ARE AWAY/);
assert.match(html, /IF YOU CANNOT RESPOND/);
assert.match(html, /Brief, understand, plan/);
assert.match(html, /Coordinate, follow up, act/);
assert.match(html, /Wait, monitor, continue/);
assert.match(html, /Begin your continuity plan/);
assert.match(html, /The Check In trigger core works today/);
assert.match(html, /status-key/);
for (const label of ['LIVE','LAB','NEXT','LATER']) assert.match(html, new RegExp(`>${label}<`));
assert.match(js, /What works today/);
assert.match(js, /processMap\.after\(makeStatusSnapshot\(\)\)/);
assert.doesNotMatch(js, /makeStatusSnapshot\(statusKey\)/);

// Plain-English product story is prose-led with one compact path.
assert.match(html, /How information moves through Continuum/);
assert.match(html, /The basic loop is simple/);
assert.match(html, /See what is happening/);
assert.match(html, /Remember it/);
assert.match(html, /Check your rules/);
assert.match(html, /Do approved work/);
assert.match(html, /Remember the result/);
assert.match(js, /A real example/);
assert.match(js, /A client emails to say a payment was sent/);
assert.match(js, /clarity-story-copy/);
assert.match(js, /clarity-story-path/);
assert.match(js, /Business Space/);
assert.doesNotMatch(js, /clarity-story-flow/);

// AI section stays direct and avoids rhetorical contrast copy.
assert.match(html, /AI inside Continuum/);
assert.match(html, /AI can use saved context, rules and approved tools/);
assert.match(html, /What Continuum adds to AI/);
assert.match(html, /AI can reason with the information it receives/);
assert.match(html, /AI authority is set by server-side permissions/);
assert.doesNotMatch(html, /Why not just use AI by itself/);
assert.doesNotMatch(html, /An ordinary day, not an emergency/);
assert.doesNotMatch(js, /Why not just use AI by itself/);
assert.doesNotMatch(js, /An ordinary day, not an emergency/);
assert.match(html, /YOU SET THE RULES/);
assert.match(html, /The server enforces them/);
assert.match(html, /API[\s\S]*A doorway apps use to talk to each other/);
assert.match(html, /MCP[\s\S]*approved tools or information/);
assert.match(html, /Runtime[\s\S]*keeps a workflow moving after it starts/);
assert.match(html, /POSSIBLE LATER USES/);
assert.match(html, /Wake-up brief/);
assert.match(html, /Coordinate people/);
assert.match(html, /Understand money/);
assert.match(html, /Communicate anywhere/);
assert.match(html, /Use more tools/);
assert.match(html, /New AI models/);

// Directory, Library and the everyday Automation example remain visual.
assert.match(html, /people-map/);
assert.match(html, /Server Project/);
assert.match(html, /library-tree/);
assert.match(html, /continuity\.md/);
assert.match(html, /Draft[\s\S]*Version 1[\s\S]*Automation/);
assert.match(html, /everyday-workflow/);
assert.match(html, /Everyday workflow/);
assert.match(html, /A client payment arrives/);
assert.match(html, /Update the Money Space/);
assert.match(html, /Include it in tomorrow's brief/);
assert.match(js, /PEOPLE/);
assert.match(js, /SAVED INFORMATION/);
assert.match(js, /FOCUSED VIEWS/);
assert.match(js, /RULES \+ STEPS/);

// Connection statuses use the final status vocabulary.
assert.match(html, /connection-email[\s\S]*status-next">NEXT/);
assert.match(html, /connection-discord[\s\S]*status-later">LATER/);
assert.doesNotMatch(html, />MODELED<|>PLANNED<|>FUTURE<|>EXTENSIBLE<|>POLICY</);

// Automation definition and Runtime execution remain separate, with prose before the compact builder line.
assert.match(js, /clarity-automation-primer clarity-automation-explainer/);
assert.match(html, /Automations define the steps\. Runtime runs them\./);
assert.match(js, /Automations define the steps\. Runtime runs them\./);
assert.match(js, /Automations define what should happen/);
assert.match(js, /clarity-automation-copy/);
assert.doesNotMatch(js, /<strong>The plan<\/strong>/);
assert.doesNotMatch(js, /<strong>The execution<\/strong>/);
assert.match(js, /<b>WHEN<\/b>/);
assert.match(js, /<b>IF<\/b>/);
assert.match(js, /<b>DO<\/b>/);
assert.match(js, /<b>WAIT<\/b>/);
assert.match(js, /<b>REVIEW<\/b>/);
assert.match(js, /clarity-possibilities/);

// Afterlife current truth and customization.
assert.match(html, /Afterlife/);
assert.match(html, /The Dead Man Switch/);
assert.match(html, /72 \+ 24 is today's configuration\. You choose these periods\./);
assert.match(html, /72h check-in timer \+ 24h grace/);
assert.match(html, /Choose the interval/);
assert.match(html, /Choose the extra time/);
assert.match(html, /Pause or resume/);
assert.match(html, /Move one deadline/);
assert.match(html, /Continuity is triggered/);
assert.match(html, /Incident, a saved record/);
assert.match(html, /<b>LIVE:<\/b>/);
assert.match(html, /<b>LATER:<\/b>/);
assert.match(js, /afterlifeCallout\.before\(glance\)/);
assert.match(js, /Afterlife uses Continuum for continuity/);

// Build and long-term capability direction remain present, with technical depth optional by default.
assert.match(html, /\/lab\/automations\//);
assert.match(html, /Python \+ FastAPI/);
assert.match(html, /PostgreSQL/);
assert.match(html, /React and TypeScript/);
assert.match(html, /Codespaces/);
assert.match(html, /Alembic/);
assert.match(html, /OpenAPI client/);
assert.match(html, /APIs \+ MCP/);
assert.match(html, /WhatsApp Business/);
assert.match(html, /SMS \+ voice/);
assert.match(html, /Money analysis \+ supported actions/);
assert.match(html, /Database access goes through the backend/);
assert.match(js, /clarity-deep-dive/);
assert.match(js, /Open the architecture walkthrough/);
assert.match(js, /Open the build workflow/);

// Roadmap outcomes explain what each stage makes possible.
assert.match(html, /reliably know whether the owner checked in/);
assert.match(html, /safely remember real private information/);
assert.match(html, /keep a workflow alive on the server after you leave the page/);
assert.match(html, /work with more outside services through approved tools/);
assert.match(js, /Build the foundation, then add capability/);

// Core visual teaching components remain in the fallback document. The ordinary story itself is no longer a card diagram.
for (const className of [
  'network-lines',
  'continuum-presence',
  'presence-track',
  'status-key',
  'process-map',
  'ai-answer',
  'ai-compare',
  'ai-journey',
  'control-panel',
  'people-map',
  'library-tree',
  'term-guide',
  'everyday-workflow',
  'workflow-nodes',
  'possibility-board',
  'policy-ring',
  'afterlife-timeline',
  'stack-pipeline',
  'tech-detail',
  'roadmap-rich'
]) {
  assert.match(html, new RegExp(className), `Missing required visual: ${className}`);
}

// Editorial contract for public /doc copy and runtime-generated copy.
for (const source of [bodySource, js]) {
  assert.doesNotMatch(source, /\.\.\.|…|—/);
  assert.doesNotMatch(source, /\bit(?:'|’)s not\b/i);
  assert.doesNotMatch(source, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
  assert.doesNotMatch(source, /\bit(?:'|’)s\b[^<.!?]{0,90},\s*not\b/i);
  assert.doesNotMatch(source, /\brather than\b/i);
  assert.doesNotMatch(source, /\bdoes not need\b/i);
}

for (const id of ['overview','difference','spaces','action','afterlife','engineering','build','status']) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
}
assert.equal((html.match(/class="document-section continuum-section/g) || []).length, 8);

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false);
assert.equal(docRoute.name, 'Continuum Product & Architecture Overview');
assert.match(docRoute.description, /Afterlife: The Dead Man Switch/);

// JS keeps theme, print, concise contents, targeted section tracking and a deterministic clarity transform.
assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);
assert.match(js, /continuum_doc_theme_v1/);
assert.match(js, /actions\.insertBefore\(trigger/);
for (const label of ['01 · Overview','02 · AI','03 · Information','04 · Automations','05 · Afterlife','06 · Architecture','07 · Build','08 · Roadmap']) {
  assert.ok(js.includes(label), `Missing concise Contents label: ${label}`);
}
assert.doesNotMatch(js, /insertAdjacentElement\('afterend', trigger\)/);
assert.doesNotMatch(js, /MutationObserver/);
assert.doesNotMatch(js, /setInterval\(/);
assert.doesNotMatch(js, /plainCopy|createTreeWalker\(document\.body, NodeFilter\.SHOW_TEXT\)/);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(editorialCss, /classic light refinement/i);
assert.match(finalCss, /\.hero-network/);
assert.match(finalCss, /\.network-lines/);
assert.match(finalCss, /\.process-map/);
assert.match(finalCss, /\.ai-compare/);
assert.match(finalCss, /\.journey-step\{display:block/);
assert.match(finalCss, /\.people-map-card/);
assert.match(finalCss, /\.library-flow-card/);
assert.match(finalCss, /\.possibility-card/);
assert.match(finalCss, /\.policy-ring/);
assert.match(finalCss, /conic-gradient/);
assert.match(finalCss, /\.policy-config-grid/);
assert.match(finalCss, /\.afterlife-step\.is-trigger/);
assert.match(finalCss, /\.stack-pipeline/);
assert.match(finalCss, /\.tech-detail/);
assert.match(finalCss, /\.roadmap-rich/);
assert.match(finalCss, /\.document-rail \.rail-status\{display:none\}/);
assert.match(finalCss, /\.document-actions \.mobile-contents-trigger/);
assert.match(finalCss, /@media\(max-width:680px\)/);
assert.match(finalCss, /@media\(prefers-reduced-motion:reduce\)/);
assert.match(finalCss, /@media print/);

assert.match(promiseCss, /\.hero-lead-first/);
assert.match(promiseCss, /\.hero-lead-core/);
assert.match(promiseCss, /\.continuum-presence/);
assert.match(promiseCss, /\.status-key/);
assert.match(promiseCss, /\.ai-answer/);
assert.match(promiseCss, /\.control-panel/);
assert.match(promiseCss, /\.everyday-workflow/);
assert.match(promiseCss, /font-size:max\(\.74rem,12px\)/);
assert.match(promiseCss, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(promiseCss, /@media\(max-width:680px\)/);
assert.match(promiseCss, /@media print/);

// QA keeps the older visual safeguards; the human layer owns final scale and prose balance.
assert.match(qaCss, /\.clarity-hero/);
assert.match(qaCss, /\.clarity-story-section/);
assert.match(qaCss, /\.clarity-product-map-section/);
assert.match(qaCss, /\.clarity-automation-primer/);
assert.match(qaCss, /\.clarity-deep-dive/);
assert.match(qaCss, /font-size:max\(\.86rem,14px\)/);
assert.match(humanCss, /font-size:clamp\(3rem,5\.4vw,4\.4rem\)/);
assert.match(humanCss, /font-size:clamp\(1\.9rem,3\.15vw,2\.8rem\)/);
assert.match(humanCss, /clarity-story-copy/);
assert.match(humanCss, /clarity-story-path/);
assert.match(humanCss, /clarity-automation-copy/);
assert.match(humanCss, /@media\(max-width:680px\)/);

console.log('Continuum document, prose balance, human copy and clarity smoke test passed.');
