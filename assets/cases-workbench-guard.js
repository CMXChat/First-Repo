(() => {
  'use strict';

  if (window.__cmxCasesWorkbenchGuard) return;
  window.__cmxCasesWorkbenchGuard = true;

  const nativeFetch = window.fetch.bind(window);
  const requestedCaseId = (new URLSearchParams(window.location.search).get('case') || '').slice(0, 36);
  let detailQueue = Promise.resolve();

  window.fetch = async (input, init = {}) => {
    const url = requestUrlFor(input);
    const method = requestMethodFor(input, init);
    const path = url?.pathname || '';

    if (method === 'GET' && path === '/api/cases') {
      const response = await nativeFetch(input, init);
      return hydrateRequestedCase(response);
    }

    if (method === 'GET' && /^\/api\/cases\/[^/]+$/.test(path)) {
      const run = () => nativeFetch(input, init);
      const queued = detailQueue.then(run, run);
      detailQueue = queued.then(() => undefined, () => undefined);
      return queued;
    }

    const mutationRefresh = (
      (method === 'POST' && path === '/api/cases')
      || (['PATCH', 'DELETE'].includes(method) && /^\/api\/cases\/[^/]+$/.test(path))
    );
    const identityCheck = method === 'GET' && path === '/api/whoami';

    const response = await nativeFetch(input, init);
    if (mutationRefresh || identityCheck) {
      return releaseAfterBody(response, () => scheduleVisibleRefresh());
    }
    return response;
  };

  async function hydrateRequestedCase(response) {
    if (!requestedCaseId || !response.ok) return response;
    try {
      const records = await response.clone().json();
      if (!Array.isArray(records) || records.some((record) => record.id === requestedCaseId)) return response;
      const exact = await nativeFetch(`/api/cases/${encodeURIComponent(requestedCaseId)}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!exact.ok) return response;
      records.push(await exact.json());
      return jsonResponseLike(response, records);
    } catch {
      return response;
    }
  }

  function scheduleVisibleRefresh(attempt = 0) {
    window.setTimeout(() => {
      const refresh = document.querySelector('#refreshCases');
      const badge = document.querySelector('#backendBadge');
      if (refresh && badge?.classList.contains('good') && !refresh.disabled) {
        refresh.click();
        return;
      }
      if (attempt < 80) scheduleVisibleRefresh(attempt + 1);
    }, attempt ? 50 : 0);
  }

  function releaseAfterBody(response, release) {
    let released = false;
    const finish = () => {
      if (released) return;
      released = true;
      window.setTimeout(release, 0);
    };
    if (response.status === 204) {
      finish();
      return response;
    }
    const originalJson = response.json.bind(response);
    const originalText = response.text.bind(response);
    response.json = async () => {
      try {
        return await originalJson();
      } finally {
        finish();
      }
    };
    response.text = async () => {
      try {
        return await originalText();
      } finally {
        finish();
      }
    };
    window.setTimeout(finish, 30000);
    return response;
  }

  function jsonResponseLike(response, payload) {
    const headers = new Headers(response.headers);
    headers.set('content-type', 'application/json');
    headers.delete('content-length');
    return new Response(JSON.stringify(payload), {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  function requestUrlFor(input) {
    try {
      const value = typeof input === 'string' || input instanceof URL ? input : input.url;
      return new URL(value, window.location.href);
    } catch {
      return null;
    }
  }

  function requestMethodFor(input, init) {
    return String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
  }
})();
