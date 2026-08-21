import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const browser = process.env.BROWSER;
assert.ok(browser, 'BROWSER must point to a Chromium-compatible executable');
assert.equal(typeof WebSocket, 'function', 'Node must provide the WebSocket client used for CDP');

const origin = process.env.AUTOMATIONS_TEST_ORIGIN || 'http://127.0.0.1:8000';
const url = `${origin}/lab/automations/`;
const port = Number(process.env.CDP_PORT || 9333);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'continuum-automations-mobile-'));

const chrome = spawn(browser, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--disable-background-networking',
  '--disable-default-apps',
  '--disable-extensions',
  '--disable-sync',
  '--no-first-run',
  `--remote-debugging-address=127.0.0.1`,
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--window-size=1440,900',
  url,
], { stdio: ['ignore', 'pipe', 'pipe'] });

let chromeErr = '';
chrome.stderr.on('data', (chunk) => { chromeErr += chunk.toString(); });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pageTarget() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const target = targets.find((item) => item.type === 'page' && item.url.includes('/lab/automations/'));
      if (target?.webSocketDebuggerUrl) return target;
    } catch {}
    await sleep(100);
  }
  throw new Error(`Chromium DevTools target did not become available. ${chromeErr.slice(-1200)}`);
}

class CDP {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.ws = new WebSocket(wsUrl);
  }

  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      const onOpen = () => { cleanup(); resolve(); };
      const onError = (event) => { cleanup(); reject(event.error || new Error('CDP WebSocket failed')); };
      const cleanup = () => {
        this.ws.removeEventListener('open', onOpen);
        this.ws.removeEventListener('error', onError);
      };
      this.ws.addEventListener('open', onOpen);
      this.ws.addEventListener('error', onError);
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const waiter = this.pending.get(message.id);
      if (!waiter) return;
      this.pending.delete(message.id);
      if (message.error) waiter.reject(new Error(`${message.error.code}: ${message.error.message}`));
      else waiter.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime.evaluate failed');
  }
  return result.result?.value;
}

async function waitFor(cdp, expression, label, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      if (await evaluate(cdp, expression)) return;
    } catch {}
    await sleep(120);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function setViewport(cdp, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    screenWidth: width,
    screenHeight: height,
    deviceScaleFactor: 1,
    mobile: width <= 760,
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: width <= 760, maxTouchPoints: 5 });
  await cdp.send('Page.reload', { ignoreCache: true });
  await waitFor(
    cdp,
    `Boolean(document.querySelector('.v3-dashboard[data-operations-v7="ready"] .v7-workspace-head [data-new]') && document.querySelector('.v4-workspace-nav.v7-workspace-nav') && document.querySelector('.v7-operations-bar') && document.querySelector('.v10-card-shell'))`,
    `Automations dashboard at ${width}x${height}`,
  );
  await sleep(250);
}

async function seedLongCard(cdp) {
  await evaluate(cdp, `(() => {
    const key = 'cmx-lab-automations-v1';
    const data = JSON.parse(localStorage.getItem(key) || 'null');
    if (!data?.automations?.length) return false;
    const item = data.automations[0];
    item.name = 'Continuity escalation for an unusually long protected workflow name that must wrap on a phone';
    item.nameAuto = false;
    item.description = 'A deliberately long acceptance description that verifies representative Automation card content wraps naturally instead of forcing the document wider than the mobile viewport.';
    if (item.actions?.[0]) {
      item.actions[0].targetLabel = 'Primary continuity contact with a deliberately long presentation label';
      item.actions[0].content = 'Long acceptance content used only inside this temporary browser profile to catch fixed-width children and horizontal card overflow.';
    }
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  })()`);
}

const geometryExpression = `(() => {
  const tolerance = 2;
  const issues = [];
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const rect = (node) => {
    if (!node) return null;
    const r = node.getBoundingClientRect();
    return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
  };
  const visible = (node) => {
    if (!node) return false;
    const style = getComputedStyle(node);
    const r = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && r.width > 0 && r.height > 0;
  };
  const insideViewport = (node) => {
    const r = rect(node);
    return Boolean(r && r.left >= -tolerance && r.right <= innerWidth + tolerance);
  };
  const inside = (child, parent) => {
    const c = rect(child); const p = rect(parent);
    return Boolean(c && p && c.left >= p.left - tolerance && c.right <= p.right + tolerance);
  };
  const intersects = (a, b) => {
    const x = rect(a); const y = rect(b);
    if (!x || !y) return false;
    return x.left < y.right - .5 && x.right > y.left + .5 && x.top < y.bottom - .5 && x.bottom > y.top + .5;
  };
  const need = (selector, label, root = document) => {
    const node = q(selector, root);
    if (!visible(node)) issues.push(label + ' missing or not visible');
    return node;
  };
  const requireInside = (node, label) => {
    if (node && !insideViewport(node)) issues.push(label + ' exceeds viewport');
  };
  const requireChildrenInside = (nodes, label) => nodes.forEach((node, index) => {
    if (!insideViewport(node)) issues.push(label + ' ' + (index + 1) + ' exceeds viewport');
  });

  const mobile = innerWidth <= 760;
  const heading = need('.v7-workspace-head h1', 'workspace heading');
  const create = need('.v7-workspace-head [data-new]', 'create control');
  requireInside(heading, 'workspace heading');
  requireInside(create, 'create control');
  if (heading && create && intersects(heading, create)) issues.push('workspace heading intersects create control');
  if (create && !create.textContent.toLowerCase().includes('new automation')) issues.push('create control lost New automation semantics');
  if (mobile && create && parseFloat(getComputedStyle(create).fontSize) < 9) issues.push('create control text is visually collapsed');
  if (mobile && create && rect(create).height < 40) issues.push('create control touch target is too short');
  if (mobile && create && getComputedStyle(create, '::after').content && !['none','normal','""'].includes(getComputedStyle(create, '::after').content)) issues.push('create control still depends on icon-only pseudo content');

  const topbar = need('.v3-topbar', 'top app header');
  const brand = need('.v3-topbar .v3-brand', 'Continuum brand');
  const topActions = need('.v3-topbar .v3-top-actions', 'top header actions');
  const labPill = need('.v3-topbar .v3-lab-pill', 'Lab execution status');
  const theme = need('.v3-topbar .v3-theme', 'theme control');
  [topbar, brand, topActions, labPill, theme].forEach((node, index) => requireInside(node, ['top app header','Continuum brand','top header actions','Lab status','theme control'][index]));
  if (brand && topActions && intersects(brand, topActions)) issues.push('Continuum brand intersects top header actions');
  if (labPill && theme && intersects(labPill, theme)) issues.push('Lab status intersects theme control');
  if (mobile && theme && (rect(theme).width < 40 || rect(theme).height < 40)) issues.push('theme control is not touch friendly');

  const workspaceTabs = need('.v4-workspace-tabs', 'primary workspace tabs');
  const workspaceButtons = workspaceTabs ? qa('button', workspaceTabs) : [];
  if (workspaceButtons.length !== 3) issues.push('expected three primary workspace tabs');
  requireChildrenInside(workspaceButtons, 'primary workspace tab');
  if (workspaceButtons.length && !workspaceButtons.some((button) => button.classList.contains('is-active'))) issues.push('primary workspace tabs lost active state');
  const runsButton = workspaceButtons.find((button) => button.textContent.includes('Runs'));
  const preview = runsButton?.querySelector('small');
  if (preview && !inside(preview, runsButton)) issues.push('PREVIEW badge exceeds Runs tab');
  if (mobile) workspaceButtons.forEach((button) => { if (rect(button).height < 40) issues.push('primary workspace tab touch target is too short'); });

  const tools = need('.v4-workspace-tools', 'search and capabilities tools');
  const search = need('.v4-workspace-tools .v4-search', 'Search Automations');
  const capabilities = need('.v4-workspace-tools .v4-catalog-button', 'Capabilities control');
  [tools, search, capabilities].forEach((node, index) => requireInside(node, ['search/capabilities tools','Search Automations','Capabilities control'][index]));
  if (search && capabilities && intersects(search, capabilities)) issues.push('Search Automations intersects Capabilities control');

  const summary = need('.v7-ops-summary', 'summary counters');
  const counters = summary ? [...summary.children] : [];
  if (counters.length !== 4) issues.push('expected four summary counters');
  requireChildrenInside(counters, 'summary counter');
  for (let i = 0; i < counters.length; i++) for (let j = i + 1; j < counters.length; j++) {
    if (intersects(counters[i], counters[j])) issues.push('summary counters overlap');
  }

  const opsActions = need('.v7-ops-actions', 'filter and management controls');
  const filter = need('.v7-filter-group', 'Automation filters');
  const filterButtons = filter ? qa('button', filter) : [];
  const planner = need('.v7-planner-button', 'Planner control');
  const manage = need('.v7-manage-button', 'Manage control');
  [opsActions, filter, planner, manage].forEach((node, index) => requireInside(node, ['filter/management controls','Automation filters','Planner control','Manage control'][index]));
  requireChildrenInside(filterButtons, 'Automation filter');
  if (filterButtons.length !== 4) issues.push('expected four Automation filters');
  if (filterButtons.length && !filterButtons.some((button) => button.classList.contains('is-active'))) issues.push('Automation filters lost active state');
  if (mobile) [...filterButtons, planner, manage].filter(Boolean).forEach((button) => { if (rect(button).height < 40) issues.push('filter/management touch target is too short'); });

  const lifecycleTabs = need('.v3-dashboard-bar .v3-tabs', 'Draft Published Archived segment');
  const lifecycleButtons = lifecycleTabs ? qa('button', lifecycleTabs) : [];
  if (lifecycleButtons.length !== 3) issues.push('expected Draft Published Archived controls');
  requireChildrenInside(lifecycleButtons, 'lifecycle segment');
  if (lifecycleButtons.length && !lifecycleButtons.some((button) => button.classList.contains('is-active'))) issues.push('lifecycle segment lost active state');

  const shell = need('.v10-card-shell', 'representative Automation card shell');
  const card = shell ? need('.v3-automation-card', 'representative Automation card', shell) : null;
  const menu = shell ? need('.v10-card-menu-button', 'Automation object menu', shell) : null;
  const title = card ? need('.v3-card-head strong', 'Automation card title', card) : null;
  [shell, card, menu].forEach((node, index) => requireInside(node, ['Automation card shell','Automation card','Automation object menu'][index]));
  if (title && menu && intersects(title, menu)) issues.push('Automation card title intersects object menu');
  if (card) {
    ['.v3-card-head','.v7-card-meta','.v3-mini-flow','.v3-card-foot'].forEach((selector) => {
      const node = q(selector, card);
      if (node && !inside(node, card)) issues.push(selector + ' exceeds representative card');
    });
    qa('.v7-card-meta>span,.v3-mini-flow>span', card).forEach((node) => {
      if (!inside(node, card)) issues.push('card pill/flow content exceeds representative card');
    });
  }

  const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (docWidth > innerWidth + tolerance) issues.push('document horizontal overflow: ' + docWidth + ' > ' + innerWidth);

  const groupOverflow = [
    ['top app header', topbar],
    ['primary workspace tabs', workspaceTabs],
    ['search/capabilities tools', tools],
    ['summary counters', summary],
    ['Automation filters', filter],
    ['Draft Published Archived segment', lifecycleTabs],
    ['representative Automation card', card],
  ];
  groupOverflow.forEach(([label, node]) => {
    if (mobile && node && node.scrollWidth > node.clientWidth + tolerance) issues.push(label + ' has unintended horizontal overflow');
  });

  return {
    viewport:{ width:innerWidth, height:innerHeight },
    documentWidth:docWidth,
    heading:rect(heading),
    create:rect(create),
    topbar:rect(topbar),
    tabs:workspaceButtons.map(rect),
    search:rect(search),
    capabilities:rect(capabilities),
    counters:counters.map(rect),
    filters:filterButtons.map(rect),
    card:rect(card),
    issues,
  };
})()`;

async function run() {
  const target = await pageTarget();
  const cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  await setViewport(cdp, 1440, 900);
  assert.ok(await seedLongCard(cdp), 'expected seeded LOCAL LAB Automation for long-content mobile coverage');

  const viewports = [
    [1440, 900],
    [360, 800],
    [390, 844],
    [412, 915],
    [430, 900],
  ];

  for (const [width, height] of viewports) {
    await setViewport(cdp, width, height);
    const result = await evaluate(cdp, geometryExpression);
    console.log(`Automations layout ${width}x${height}: document=${result.documentWidth}, issues=${result.issues.length}`);
    if (result.issues.length) {
      console.error(JSON.stringify(result, null, 2));
      throw new Error(`${width}x${height} mobile acceptance geometry failed: ${result.issues.join('; ')}`);
    }
  }

  cdp.close();
  console.log('Continuum Automations mobile acceptance geometry passed at desktop and 360/390/412/430px phone widths.');
}

try {
  await run();
} finally {
  chrome.kill('SIGTERM');
  await sleep(100);
  fs.rmSync(profile, { recursive: true, force: true });
}
