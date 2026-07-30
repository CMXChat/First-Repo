'use strict';

const RUNBOOKS = {
  'website-audit': [
    '1. Confirm the exact approved production target.',
    '2. Check availability, title, description, canonical, robots directives, and H1.',
    '3. Review only authorized routes.',
    '4. Record failures with timestamps and HTTP responses.',
    '5. Recheck after deployment and cache expiry.'
  ],
  domain: [
    '1. Normalize the domain and confirm spelling.',
    '2. Retrieve public DNS, registration, certificate, and web-response data.',
    '3. Separate verified facts from infrastructure inference.',
    '4. Preserve timestamps and source references.'
  ],
  phone: [
    '1. Normalize the number to international E.164 format.',
    '2. Identify country and numbering-plan validity.',
    '3. Treat carrier fields as routing data, not owner identity.',
    '4. Never claim subscriber identity, live location, or message access.'
  ],
  username: [
    '1. Preserve the username exactly.',
    '2. Search exact matches and platform variants.',
    '3. Compare public profile indicators across independent sources.',
    '4. Classify results as found, absent, blocked, or unknown.',
    '5. Do not merge identities without multiple matching indicators.'
  ],
  'evidence-handling': [
    '1. Preserve the original source before modification.',
    '2. Record source, date, time, timezone, and collection method.',
    '3. Generate a cryptographic hash for downloaded files.',
    '4. Work from copies and retain the original unchanged.',
    '5. Document transformations and interpretations.'
  ],
  'incident-response': [
    '1. Confirm scope and affected assets.',
    '2. Preserve logs and volatile evidence.',
    '3. Contain active exposure without destroying evidence.',
    '4. Identify the initial access path.',
    '5. Recover, validate, and document lessons learned.'
  ]
};

function toolRows() {
  return Object.entries(ROUTES).map(([name, route]) => [name, route.label]);
}

function approvedTarget(target = 'root') {
  const key = String(target || 'root').toLowerCase();
  if (key === '/' || key === 'root' || key === 'home') return { key: 'root', path: '/', label: 'Root interface' };
  const route = ROUTES[key];
  return route ? { key, path: route.path, label: route.label } : null;
}

function parseHtmlFacts(html, headers = null) {
  const documentNode = new DOMParser().parseFromString(html, 'text/html');
  const title = documentNode.querySelector('title')?.textContent?.trim() || '(missing)';
  const description = documentNode.querySelector('meta[name="description"]')?.content?.trim() || '(missing)';
  const robotsMeta = documentNode.querySelector('meta[name="robots"]')?.content?.trim() || '(none)';
  const canonical = documentNode.querySelector('link[rel="canonical"]')?.href || '(missing)';
  const xRobots = headers?.get('x-robots-tag') || '(none)';
  return {
    title,
    description,
    robotsMeta,
    xRobots,
    canonical,
    h1Count: documentNode.querySelectorAll('h1').length,
    indexable: !/noindex/i.test(`${robotsMeta} ${xRobots}`)
  };
}

async function inspectApproved(target) {
  const approved = approvedTarget(target);
  if (!approved) throw new Error('Target is outside the approved route registry.');
  const started = performance.now();
  const response = await fetchWithTimeout(approved.path);
  const elapsed = Math.round(performance.now() - started);
  const contentType = response.headers.get('content-type') || '(unknown)';
  let facts = null;
  if (/text\/html/i.test(contentType)) facts = parseHtmlFacts(await response.text(), response.headers);
  return { approved, status: response.status, ok: response.ok, elapsed, contentType, facts };
}

function printInspection(result) {
  line('APPROVED ROUTE INSPECTION', 'success');
  printRows([
    ['Target', result.approved.label],
    ['Status', `${result.status} ${result.ok ? 'OK' : 'FAILED'}`],
    ['Response time', `${result.elapsed} ms`],
    ['Content type', result.contentType]
  ], ['FIELD', 'VALUE']);
  if (!result.facts) return;
  printRows([
    ['Title', result.facts.title],
    ['Description', result.facts.description],
    ['Canonical', result.facts.canonical],
    ['Robots', result.facts.robotsMeta],
    ['Indexable', result.facts.indexable ? 'yes' : 'no'],
    ['H1 count', String(result.facts.h1Count)]
  ], ['PAGE FIELD', 'VALUE']);
}

async function siteCommand(args) {
  const action = (args[0] || 'check').toLowerCase();
  const target = args[1] || 'root';
  if (action === 'check' || action === 'status' || action === 'inspect') {
    startRequest(`route check: ${target}`);
    try { printInspection(await inspectApproved(target)); }
    catch (error) { line(`Inspection failed: ${error.message}`, 'error'); }
    finally { endRequest(); }
    return;
  }
  if (action === 'indexability') {
    startRequest(`indexability: ${target}`);
    try {
      const result = await inspectApproved(target);
      if (!result.facts) return line('Target did not return HTML.', 'warning');
      printRows([
        ['Target', result.approved.label],
        ['Status', String(result.status)],
        ['Robots', result.facts.robotsMeta],
        ['X-Robots-Tag', result.facts.xRobots],
        ['Indexable', result.facts.indexable ? 'YES' : 'NO']
      ], ['FIELD', 'VALUE']);
    } catch (error) { line(`Indexability check failed: ${error.message}`, 'error'); }
    finally { endRequest(); }
    return;
  }
  return line('Usage: site <check|indexability> [approved-tool]', 'error');
}

async function checkAllRoutes() {
  startRequest('approved route health');
  const rows = [];
  try {
    for (const [name, route] of Object.entries(ROUTES)) {
      try {
        const result = await inspectApproved(name);
        rows.push([name, route.label, String(result.status), `${result.elapsed} ms`, result.facts?.title || result.contentType]);
      } catch {
        rows.push([name, route.label, 'ERROR', '-', 'unavailable']);
      }
    }
    printRows(rows, ['TOOL', 'FUNCTION', 'STATUS', 'TIME', 'RESULT']);
  } finally { endRequest(); }
}

async function toolsCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return printRows(toolRows(), ['TOOL', 'FUNCTION']);
  if (action === 'status' || action === 'check') return checkAllRoutes();
  if (action === 'open') return openRoute(args[1]);
  if (action === 'describe') {
    const key = (args[1] || '').toLowerCase();
    const route = ROUTES[key];
    if (!route) return line('Tool not found.', 'error');
    return printRows([['Command', key], ['Function', route.label], ['Access', 'approved']], ['FIELD', 'VALUE']);
  }
  return line('Usage: tools <list|status|open|describe> [tool]', 'error');
}

function openRoute(name) {
  const key = (name || '').toLowerCase();
  const route = ROUTES[key];
  if (!route) return line(`Unknown tool: ${name || '(missing)'}`, 'error');
  line(`Opening approved tool: ${route.label}`, 'info');
  setTimeout(() => { location.href = route.path; }, 180);
}

function runbookCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return printRows(Object.keys(RUNBOOKS).map((name) => [name, `${RUNBOOKS[name].length} steps`]), ['RUNBOOK', 'SIZE']);
  const name = action === 'show' ? (args[1] || '').toLowerCase() : action;
  const book = RUNBOOKS[name];
  if (!book) return line('Runbook not found.', 'error');
  line(`RUNBOOK // ${name.toUpperCase()}`, 'success');
  book.forEach((step) => line(step));
}
