'use strict';

const RUNBOOKS = {
  'website-audit': [
    '1. Confirm the exact production URL and expected canonical host.',
    '2. Check status, redirects, title, description, canonical, robots, and H1.',
    '3. Inspect robots.txt and sitemap.xml.',
    '4. Test every known tool route and identify broken internal links.',
    '5. Verify noindex rules on private or utility pages.',
    '6. Record failures with the affected route and HTTP response.',
    '7. Recheck after deployment and cache expiry.'
  ],
  domain: [
    '1. Normalize the domain and confirm spelling.',
    '2. Retrieve DNS, registration, certificate, and web-response data.',
    '3. Review nameservers, mail records, TXT policy records, and related hosts.',
    '4. Separate verified facts from infrastructure inferences.',
    '5. Preserve timestamps and source URLs for every finding.'
  ],
  phone: [
    '1. Normalize the number to international E.164 format.',
    '2. Identify country and numbering-plan validity.',
    '3. Use a protected carrier lookup service for line type and carrier.',
    '4. Treat portability and carrier fields as current-routing data, not owner identity.',
    '5. Never claim subscriber identity, live location, or message access.'
  ],
  username: [
    '1. Preserve the username exactly, including punctuation and capitalization.',
    '2. Search exact matches and platform-specific variants.',
    '3. Compare reused avatars, bios, links, posting dates, and writing patterns.',
    '4. Classify each platform result as found, absent, blocked, or unknown.',
    '5. Do not merge profiles without multiple independent matching indicators.'
  ],
  'missing-person': [
    '1. Confirm legal authority, urgency, and last-known information.',
    '2. Preserve source material before analysis.',
    '3. Build a verified timeline and relationship map.',
    '4. Separate public facts, witness statements, and analyst inference.',
    '5. Escalate immediate safety concerns to appropriate authorities.'
  ],
  'evidence-handling': [
    '1. Preserve the original file or page before modification.',
    '2. Record source, date, time, timezone, and collection method.',
    '3. Generate a cryptographic hash for downloaded files.',
    '4. Work from copies and retain the original unchanged.',
    '5. Document every transformation, screenshot, export, and interpretation.'
  ],
  'incident-response': [
    '1. Confirm scope and affected assets.',
    '2. Preserve logs and volatile evidence.',
    '3. Contain active exposure without destroying evidence.',
    '4. Identify the initial access path and persistence mechanisms.',
    '5. Eradicate, recover, validate, and document lessons learned.'
  ]
};

function routeRows() {
  return Object.entries(ROUTES).map(([name, route]) => [name, route.path, route.label]);
}

function normalizeRouteTarget(target = '/') {
  if (!target) return '/';
  if (ROUTES[target.toLowerCase()]) return ROUTES[target.toLowerCase()].path;
  try {
    const url = new URL(target, location.origin);
    if (url.origin !== location.origin) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return target.startsWith('/') ? target : `/${target}`;
  }
}

function parseHtmlFacts(html, responseUrl, headers = null) {
  const documentNode = new DOMParser().parseFromString(html, 'text/html');
  const title = documentNode.querySelector('title')?.textContent?.trim() || '(missing)';
  const description = documentNode.querySelector('meta[name="description"]')?.content?.trim() || '(missing)';
  const robotsMeta = documentNode.querySelector('meta[name="robots"]')?.content?.trim() || '(none)';
  const canonical = documentNode.querySelector('link[rel="canonical"]')?.href || '(missing)';
  const h1Count = documentNode.querySelectorAll('h1').length;
  const links = [...documentNode.querySelectorAll('a[href]')].map((node) => node.href);
  const internalLinks = [...new Set(links.filter((href) => {
    try { return new URL(href, responseUrl).origin === location.origin; } catch { return false; }
  }).map((href) => new URL(href, responseUrl).pathname))];
  const xRobots = headers?.get('x-robots-tag') || '(none)';
  const indexable = !/noindex/i.test(`${robotsMeta} ${xRobots}`);
  return {
    title,
    description,
    robotsMeta,
    xRobots,
    canonical,
    h1Count,
    scriptCount: documentNode.scripts.length,
    styleCount: documentNode.querySelectorAll('link[rel="stylesheet"], style').length,
    linkCount: links.length,
    internalLinks,
    indexable
  };
}

async function inspectRoute(target) {
  const path = normalizeRouteTarget(target);
  if (!path) throw new Error('Only same-origin routes can be inspected by the browser console.');
  const started = performance.now();
  const response = await fetchWithTimeout(path);
  const elapsed = Math.round(performance.now() - started);
  const contentType = response.headers.get('content-type') || '(unknown)';
  const result = {
    target: path,
    finalUrl: response.url,
    status: response.status,
    ok: response.ok,
    elapsed,
    contentType,
    facts: null
  };
  if (/text\/html/i.test(contentType)) {
    const html = await response.text();
    result.facts = parseHtmlFacts(html, response.url, response.headers);
  }
  return result;
}

function printInspection(result) {
  line('SITE INSPECTION', 'success');
  printRows([
    ['Target', result.target],
    ['Final URL', result.finalUrl],
    ['Status', `${result.status} ${result.ok ? 'OK' : 'FAILED'}`],
    ['Response time', `${result.elapsed} ms`],
    ['Content type', result.contentType]
  ], ['FIELD', 'VALUE']);
  if (!result.facts) return;
  printRows([
    ['Title', result.facts.title],
    ['Description', result.facts.description],
    ['Canonical', result.facts.canonical],
    ['Meta robots', result.facts.robotsMeta],
    ['X-Robots-Tag', result.facts.xRobots],
    ['Indexable', result.facts.indexable ? 'yes' : 'no'],
    ['H1 count', String(result.facts.h1Count)],
    ['Links', String(result.facts.linkCount)],
    ['Scripts', String(result.facts.scriptCount)],
    ['Styles', String(result.facts.styleCount)]
  ], ['PAGE FIELD', 'VALUE']);
}

async function siteCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (action === 'routes') return printRows(routeRows(), ['COMMAND', 'ROUTE', 'FUNCTION']);
  if (action === 'status' || action === 'check' || action === 'inspect') {
    const target = args[1] || '/';
    if (target.toLowerCase() === 'all') return checkAllRoutes();
    startRequest(`site ${action} ${target}`);
    try {
      printInspection(await inspectRoute(target));
    } catch (error) {
      line(`Site inspection failed: ${error.message}`, 'error');
    } finally {
      endRequest();
    }
    return;
  }
  if (action === 'indexability') {
    const target = args[1] || '/';
    startRequest(`indexability ${target}`);
    try {
      const result = await inspectRoute(target);
      if (!result.facts) return line('The target did not return an HTML document.', 'warning');
      printRows([
        ['Target', result.target],
        ['HTTP status', String(result.status)],
        ['Meta robots', result.facts.robotsMeta],
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
  if (action === 'robots') return fetchTextResource('/robots.txt', 'ROBOTS.TXT');
  if (action === 'sitemap') return inspectSitemap(args[1] || '/sitemap.xml');
  if (action === 'broken-links') return brokenLinks(args[1] || '/');
  return line('Usage: site <status|routes|check|inspect|indexability|robots|sitemap|broken-links> [target]', 'error');
}

async function checkAllRoutes() {
  startRequest('checking all known routes');
  const rows = [];
  try {
    for (const [name, route] of Object.entries(ROUTES)) {
      try {
        const result = await inspectRoute(route.path);
        rows.push([name, route.path, String(result.status), `${result.elapsed} ms`, result.facts?.title || result.contentType]);
      } catch (error) {
        rows.push([name, route.path, 'ERROR', '-', error.message]);
      }
    }
    printRows(rows, ['TOOL', 'ROUTE', 'STATUS', 'TIME', 'TITLE / ERROR']);
  } finally {
    endRequest();
  }
}

async function fetchTextResource(path, heading) {
  startRequest(`fetching ${path}`);
  try {
    const response = await fetchWithTimeout(path);
    line(`${heading} // HTTP ${response.status}`, response.ok ? 'success' : 'warning');
    const text = await response.text();
    text.split(/\r?\n/).slice(0, 120).forEach((item) => line(item));
    if (text.split(/\r?\n/).length > 120) line('[output truncated]', 'dim');
  } catch (error) {
    line(`${heading} failed: ${error.message}`, 'error');
  } finally {
    endRequest();
  }
}

async function inspectSitemap(path) {
  startRequest(`sitemap ${path}`);
  try {
    const response = await fetchWithTimeout(path);
    const text = await response.text();
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    const parserError = xml.querySelector('parsererror');
    if (parserError) {
      line(`Sitemap returned HTTP ${response.status}, but the response was not valid XML.`, 'warning');
      return;
    }
    const locations = [...xml.querySelectorAll('loc')].map((node) => node.textContent.trim()).filter(Boolean);
    line(`SITEMAP // HTTP ${response.status}`, response.ok ? 'success' : 'warning');
    line(`URLs discovered: ${locations.length}`, 'info');
    locations.slice(0, 60).forEach((url) => line(url));
    if (locations.length > 60) line(`[${locations.length - 60} additional URLs omitted]`, 'dim');
  } catch (error) {
    line(`Sitemap inspection failed: ${error.message}`, 'error');
  } finally {
    endRequest();
  }
}

async function brokenLinks(target) {
  const basePath = normalizeRouteTarget(target);
  if (!basePath) return line('Only same-origin pages can be checked.', 'error');
  startRequest(`broken links ${basePath}`);
  try {
    const page = await inspectRoute(basePath);
    if (!page.facts) return line('The target did not return HTML.', 'warning');
    const paths = page.facts.internalLinks.slice(0, 40);
    if (!paths.length) return line('No internal links found.', 'dim');
    const rows = [];
    for (const path of paths) {
      try {
        const started = performance.now();
        const response = await fetchWithTimeout(path, {}, 8000);
        rows.push([path, String(response.status), `${Math.round(performance.now() - started)} ms`, response.ok ? 'OK' : 'BROKEN']);
      } catch (error) {
        rows.push([path, 'ERROR', '-', error.name === 'AbortError' ? 'TIMEOUT' : 'FAILED']);
      }
    }
    printRows(rows, ['INTERNAL PATH', 'STATUS', 'TIME', 'RESULT']);
    const failures = rows.filter((row) => row[3] !== 'OK').length;
    line(`Checked ${rows.length} internal links. Failures: ${failures}.`, failures ? 'warning' : 'success');
  } catch (error) {
    line(`Broken-link check failed: ${error.message}`, 'error');
  } finally {
    endRequest();
  }
}

async function toolsCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return printRows(routeRows(), ['TOOL', 'ROUTE', 'FUNCTION']);
  if (action === 'status' || action === 'check') return checkAllRoutes();
  if (action === 'open') return openRoute(args[1]);
  if (action === 'describe') {
    const route = ROUTES[(args[1] || '').toLowerCase()];
    if (!route) return line('Tool not found.', 'error');
    return printRows([
      ['Command', args[1].toLowerCase()],
      ['Route', route.path],
      ['Function', route.label],
      ['Group', route.group]
    ], ['FIELD', 'VALUE']);
  }
  return line('Usage: tools <list|status|check|open|describe> [tool]', 'error');
}

function openRoute(name) {
  const route = ROUTES[(name || '').toLowerCase()];
  if (!route) return line(`Unknown tool: ${name || '(missing)'}`, 'error');
  line(`Opening ${route.label}: ${route.path}`, 'info');
  setTimeout(() => { location.href = route.path; }, 220);
}

function runbookCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return printRows(Object.keys(RUNBOOKS).map((name) => [name, `${RUNBOOKS[name].length} steps`]), ['RUNBOOK', 'SIZE']);
  const name = action === 'show' ? (args[1] || '').toLowerCase() : action;
  const book = RUNBOOKS[name];
  if (!book) return line(`Runbook not found. Available: ${Object.keys(RUNBOOKS).join(', ')}`, 'error');
  line(`RUNBOOK: ${name.toUpperCase()}`, 'success');
  book.forEach((step) => line(step));
}
