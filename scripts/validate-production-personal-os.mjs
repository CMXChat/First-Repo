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
          'user-agent': 'CMX-Spaces-Production-Smoke/2.0'
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
  assert(![301, 302, 303, 307, 308].includes(response.status), `${url} redirected unexpectedly at the HTTP layer.`);
  const text = await response.text();
  observations.push(`${pathname} ${response.status} ${response.headers.get('content-type') || 'unknown content type'}`);
  return { url, response, text };
}

function extractAssets(html) {
  return [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(match => match[1]);
}

const surfaces = {};
for (const pathname of ['/spaces/', '/brief/', '/brief-next/', '/doc/']) {
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

if (surfaces['/spaces/']) {
  const html = surfaces['/spaces/'].text;
  assert(/<title>[^<]*Demo[^<]*<\/title>/i.test(html), 'Deployed `/spaces/` title no longer identifies the demo.');
  assert(/fictional|sample|demonstration|working demo/i.test(html), 'Deployed `/spaces/` does not clearly preserve its demo boundary.');
  assert(/href=["']\/doc\/["']/i.test(html), 'Deployed `/spaces/` is missing its `/doc/` link.');
  assert(/https:\/\/db\.cmxchat\.com\/spaces\//i.test(html), 'Deployed `/spaces/` has the wrong canonical URL.');
  assert(/shared calendars/i.test(html), 'Deployed `/spaces/` lost the shared-calendar concept.');
  assert(/adaptive alarm/i.test(html), 'Deployed `/spaces/` lost the alarm concept.');
  assert(/<strong>Voice:<\/strong>/i.test(html), 'Deployed `/spaces/` lost the voice concept.');
  assert(/aria-live=["']polite["']/i.test(html), 'Deployed `/spaces/` media status is not an announcement region.');

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

if (surfaces['/brief/']) {
  const html = surfaces['/brief/'].text;
  assert(/https:\/\/db\.cmxchat\.com\/spaces\//i.test(html), 'Deployed `/brief/` does not canonicalize to `/spaces/`.');
  assert(/http-equiv=["']refresh["'][^>]*\/spaces\//i.test(html), 'Deployed `/brief/` is missing its no-JavaScript redirect fallback.');
  assert(/spaces-legacy-redirect\.js/i.test(html), 'Deployed `/brief/` is missing its compatibility redirect helper.');
  assert(/href=["']\/spaces\/["']/i.test(html), 'Deployed `/brief/` is missing its visible `/spaces/` fallback link.');

  try {
    const redirectAsset = extractAssets(html).find(asset => asset.includes('spaces-legacy-redirect.js'));
    assert(Boolean(redirectAsset), 'Deployed `/brief/` redirect asset could not be discovered.');
    if (redirectAsset) {
      const redirectResult = await fetchText(redirectAsset);
      assert(/window\.location\.replace/i.test(redirectResult.text), 'Deployed legacy redirect does not replace browser history.');
      assert(/window\.location\.search/i.test(redirectResult.text), 'Deployed legacy redirect does not preserve the query string.');
      assert(/window\.location\.hash/i.test(redirectResult.text), 'Deployed legacy redirect does not preserve the hash.');
    }
  } catch (error) {
    fail(`Unable to validate deployed legacy redirect: ${error.message}`);
  }
}

if (surfaces['/brief-next/']) {
  const html = surfaces['/brief-next/'].text;
  assert(/<title>[^<]*Demo[^<]*<\/title>/i.test(html), 'Deployed `/brief-next/` no longer identifies its demo snapshot.');
  assert(!/http-equiv=["']refresh["']/i.test(html), 'Deployed `/brief-next/` unexpectedly redirects instead of preserving the rollback snapshot.');
}

if (surfaces['/doc/']) {
  const html = surfaces['/doc/'].text;
  assert(!/cmx-gate-black-prompt|data-cmx-gate|type=["']password["']/i.test(html), 'Deployed `/doc/` contains gate markup or assets.');
  assert(/href=["']\/(?:spaces|brief)\/["']/i.test(html), 'Deployed `/doc/` is missing a working Spaces demo link.');
  assert(
    /id=["']status["']/i.test(html) &&
    /Current reality/i.test(html) &&
    /separates what exists from what has been designed or planned/i.test(html),
    'Deployed `/doc/` lost its current-versus-planned boundary.'
  );
  assert(/alarm/i.test(html) && /voice/i.test(html) && /calendar/i.test(html), 'Deployed `/doc/` lost calendar, alarm, or voice product context.');
}

try {
  const routeResult = await fetchText('/assets/cmx-routes.json');
  const registry = JSON.parse(routeResult.text);
  const expected = [
    ['/spaces/', 'Active'],
    ['/brief/', 'Legacy'],
    ['/brief-next/', 'Experimental'],
    ['/doc/', 'Active']
  ];

  for (const [pathname, status] of expected) {
    const route = registry.routes?.find(item => item.path === pathname);
    assert(Boolean(route), `Deployed route registry is missing ${pathname}.`);
    if (!route) continue;
    assert(route.status === status, `Deployed route registry marks ${pathname} as ${route.status}, expected ${status}.`);
    assert(route.gated === false, `Deployed route registry marks ${pathname} as gated.`);
  }
} catch (error) {
  fail(`Unable to validate deployed route registry: ${error.message}`);
}

console.log(`Production smoke target: ${baseUrl}`);
for (const observation of observations) console.log(`- ${observation}`);

if (failures.length) {
  console.error('\nProduction Spaces smoke failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Production Spaces smoke passed at ${new Date().toISOString()}.`);
