(() => {
  'use strict';

  if (window.__cmxOsintRoutingSaveGuard) return;
  window.__cmxOsintRoutingSaveGuard = true;

  const nativeFetch = window.fetch.bind(window);
  const preflightTtlMs = 5000;
  let preflight = null;

  window.fetch = async (input, init = {}) => {
    const url = requestUrlFor(input);
    const method = requestMethodFor(input, init);
    const path = url?.pathname || '';
    const detailMatch = path.match(/^\/api\/cases\/([^/]+)$/);
    const observationMatch = path.match(/^\/api\/cases\/([^/]+)\/observations$/);

    if (method === 'GET' && detailMatch) {
      const response = await nativeFetch(input, init);
      if (!response.ok) {
        preflight = null;
        return response;
      }
      try {
        const detail = await response.clone().json();
        preflight = {
          caseId: decodeURIComponent(detailMatch[1]),
          observations: Array.isArray(detail.observations) ? detail.observations : [],
          checkedAt: Date.now()
        };
      } catch {
        preflight = null;
      }
      return response;
    }

    if (method === 'POST' && observationMatch) {
      const caseId = decodeURIComponent(observationMatch[1]);
      const payload = requestJsonBody(input, init);
      if (payload?.kind?.startsWith('routing_')) {
        const fresh = preflight
          && preflight.caseId === caseId
          && Date.now() - preflight.checkedAt <= preflightTtlMs;
        if (!fresh) {
          preflight = null;
          return jsonError(409, 'A fresh duplicate review of the selected case is required before saving routing evidence.');
        }
        const exactDuplicate = preflight.observations.some((record) => (
          record.kind === payload.kind
          && record.value_text === payload.value_text
          && (record.note || '') === (payload.note || '')
        ));
        const acknowledged = Boolean(document.getElementById('routingDuplicateReview')?.checked);
        preflight = null;
        if (exactDuplicate && !acknowledged) {
          return jsonError(409, 'An exact routing observation already exists. Review and acknowledge it before creating another record.');
        }
      }
    }

    return nativeFetch(input, init);
  };

  document.addEventListener('change', (event) => {
    if (event.target?.classList?.contains('cmx-case-context-select')) preflight = null;
  });

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

  function requestJsonBody(input, init) {
    const body = init?.body;
    if (typeof body !== 'string') return null;
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  function jsonError(status, detail) {
    return new Response(JSON.stringify({ detail }), {
      status,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff'
      }
    });
  }
})();
