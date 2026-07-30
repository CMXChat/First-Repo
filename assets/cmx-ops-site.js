'use strict';

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
    try {
      printInspection(await inspectApproved(target));
    } catch (error) {
      line(`Inspection failed: ${error.message}`, 'error');
    } finally {
      endRequest();
    }
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
    } catch (error) {
      line(`Indexability check failed: ${error.message}`, 'error');
    } finally {
      endRequest();
    }
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
  } finally {
    endRequest();
  }
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
    return printRows([
      ['Command', key],
      ['Function', route.label],
      ['Access', 'approved']
    ], ['FIELD', 'VALUE']);
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
