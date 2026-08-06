const baseUrl = (process.env.PERSONAL_OS_BASE_URL || 'https://db.cmxchat.com').replace(/\/$/, '');
const failures = [];
const observations = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

async function sleep(milliseconds) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function fetchResponse(pathname, attempts = 3) {
  const url = new URL(pathname, `${baseUrl}/`).toString();
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'manual',
        headers: {
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'user-agent': 'CMX-Personal-OS-Production-Smoke/1.0'
        }
      });
      return { url, response };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(1000 * attempt);
    }
  }

  throw new Error(`Unable to fetch ${url}: ${lastError?.message || 'unknown error'}`);
}

async function fetchText(pathname) {
  const { url, response } = await fetchResponse(pathname);
  assert(response.status === 200, `${url} returned HTTP ${response.status}.`);
  assert(![301, 302, 303, 307, 308].includes(response.status), `${url} redirected unexpectedly.`);
  const text = await response.text();
  observations.push(`${pathname} ${response.status} ${response.headers.get('content-type') || 'unknown content type'}`);
  return { url, response, text };
}

function extractAssets(html) {
  return [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(match => match[1]);
}

function normalizeHtml(html) {
  return html.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

const surfaces = {};
for (const pathname of ['/brief/', '/brief-next/', '/doc/']) {
  try {
    surfaces[pathname] = await fetchText(pathname);
  } catch (error) {
    fail(error.message);
  }
}

for (const [pathname, result] of Object.entries(surfaces)) {
  const html = result.text;
  assert(/<html\b[^>]*\bdata-theme=["']light["']/i.test(html), `${pathname} is not light in its deployed HTML.`);
  assert(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html), `${pathname} is missing deployed noindex policy.`);
}

if (surfaces['/brief/'] && surfaces['/brief-next/']) {
  assert(
    normalizeHtml(surfaces['/brief/'].text) === normalizeHtml(surfaces['/brief-next/'].text),
    'Deployed `/brief/` and `/brief-next/` HTML are not aligned.'
  );
}

if (surfaces['/brief/']) {
  const html = surfaces['/brief/'].text;
  assert(/<title>[^<]*Demo[^<]*<\/title>/i.test(html), 'Deployed `/brief/` title no longer identifies the demo.');
  assert(/fictional|sample|demonstration|working demo/i.test(html), 'Deployed `/brief/` does not clearly preserve its demo boundary.');
  assert(/href=["']\/doc\/["']/i.test(html), 'Deployed `/brief/` is missing its `/doc/` link.');

  for (const asset of new Set(extractAssets(html))) {
    if (asset.startsWith('/assets/brief/')) {
      assert(/[?&]v=[^&]+/.test(asset), `Deployed active asset lacks a version query: ${asset}`);
    }
    try {
      const { response, url } = await fetchResponse(asset);
      assert(response.status === 200, `${url} returned HTTP ${response.status}.`);
      observations.push(`${asset} ${response.status}`);
    } catch (error) {
      fail(error.message);
    }
  }
}

if (surfaces['/doc/']) {
  const html = surfaces['/doc/'].text;
  assert(!/cmx-gate-black-prompt|data-cmx-gate|type=["']password["']/i.test(html), 'Deployed `/doc/` contains gate markup or assets.');
  assert(/href=["']\/brief\/["']/i.test(html), 'Deployed `/doc/` is missing its `/brief/` link.');
  assert(/What works now and what still needs building/i.test(html), 'Deployed `/doc/` lost its current-versus-planned boundary.');
}

try {
  const routeResult = await fetchText('/assets/cmx-routes.json');
  const registry = JSON.parse(routeResult.text);
  for (const pathname of ['/brief/', '/brief-next/', '/doc/']) {
    const route = registry.routes?.find(item => item.path === pathname);
    assert(Boolean(route), `Deployed route registry is missing ${pathname}.`);
    if (route) assert(route.gated === false, `Deployed route registry marks ${pathname} as gated.`);
  }
} catch (error) {
  fail(`Unable to validate deployed route registry: ${error.message}`);
}

console.log(`Production smoke target: ${baseUrl}`);
for (const observation of observations) console.log(`- ${observation}`);

if (failures.length) {
  console.error('\nProduction Personal OS smoke failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Production Personal OS smoke passed at ${new Date().toISOString()}.`);
