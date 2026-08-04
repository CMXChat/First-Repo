(() => {
  'use strict';

  if (window.__cmxCaseSaveGuard) return;
  window.__cmxCaseSaveGuard = true;

  const nativeFetch = window.fetch.bind(window);
  let enrichmentDraft = null;

  loadRoutingWorkspace();

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('#enrichmentSave');
    if (!button || button.disabled) return;
    enrichmentDraft = buildEnrichmentObservation();
  }, true);

  window.fetch = async (input, init = {}) => {
    const requestUrl = requestUrlFor(input);
    const method = requestMethodFor(input, init);
    const pathname = requestUrl?.pathname || '';
    const importMatch = pathname.match(/^\/api\/cases\/([^/]+)\/imports$/);
    const observationMatch = pathname.match(/^\/api\/cases\/([^/]+)\/observations$/);
    const detailMatch = pathname.match(/^\/api\/cases\/([^/]+)$/);

    if (method === 'GET' && detailMatch && enrichmentDraft) {
      const response = await nativeFetch(input, init);
      if (!response.ok) return response;
      try {
        const detail = await response.clone().json();
        detail.observations = (detail.observations || []).filter((record) => !(
          record.kind === enrichmentDraft.kind
          && record.value_text === enrichmentDraft.value_text
          && record.note !== enrichmentDraft.note
        ));
        return jsonResponseLike(response, detail);
      } catch {
        return response;
      }
    }

    const lock = method === 'POST' && importMatch
      ? beginSnapshotLock(decodeURIComponent(importMatch[1]))
      : method === 'POST' && observationMatch && enrichmentDraft
        ? beginEnrichmentLock(decodeURIComponent(observationMatch[1]))
        : null;

    try {
      const response = await nativeFetch(input, init);
      if (!lock) return response;
      return releaseAfterBody(response, () => finishLock(lock, response.ok));
    } catch (error) {
      if (lock) finishLock(lock, false);
      throw error;
    }
  };

  hydrateExactActiveCase();

  function loadRoutingWorkspace() {
    const path = window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
    if (path !== '/osint') return;
    if (!document.querySelector('link[href^="/assets/osint-routing.css"]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/assets/osint-routing.css?v=20260804-1';
      style.dataset.cmxOsintRouting = 'true';
      document.head.appendChild(style);
    }
    if (!document.querySelector('script[src^="/assets/osint-routing.js"]')) {
      const script = document.createElement('script');
      script.src = '/assets/osint-routing.js?v=20260804-1';
      script.async = false;
      script.dataset.cmxOsintRouting = 'true';
      document.head.appendChild(script);
    }
  }

  function beginSnapshotLock(caseId) {
    const select = document.querySelector('.cmx-case-context-select');
    const lock = {
      type: 'snapshot',
      caseId,
      select,
      selectedValue: select?.value || '',
      selectWasDisabled: Boolean(select?.disabled),
      fingerprint: researchFingerprint(),
      finished: false
    };
    if (select) select.disabled = true;
    return lock;
  }

  function beginEnrichmentLock(caseId) {
    const select = document.querySelector('.cmx-case-context-select');
    const controls = [
      select,
      document.querySelector('#enrichmentTarget'),
      document.querySelector('#enrichRdap'),
      document.querySelector('#enrichHttp'),
      document.querySelector('#enrichTls'),
      document.querySelector('#enrichCt')
    ].filter(Boolean);
    const lock = {
      type: 'enrichment',
      caseId,
      select,
      selectedValue: select?.value || '',
      controls: controls.map((control) => [control, control.disabled]),
      finished: false
    };
    lock.controls.forEach(([control]) => { control.disabled = true; });
    return lock;
  }

  function finishLock(lock, succeeded) {
    if (!lock || lock.finished) return;
    lock.finished = true;

    if (lock.type === 'snapshot') {
      if (lock.select) lock.select.disabled = lock.selectWasDisabled;
      const changed = researchFingerprint() !== lock.fingerprint
        || (lock.select?.value || '') !== lock.selectedValue;
      if (changed) {
        window.setTimeout(() => {
          lock.select?.dispatchEvent(new Event('change', { bubbles: true }));
        }, 0);
      }
      return;
    }

    lock.controls.forEach(([control, wasDisabled]) => { control.disabled = wasDisabled; });
    const activeCaseChanged = (lock.select?.value || '') !== lock.selectedValue;
    const status = document.querySelector('#enrichmentStatus');
    if (activeCaseChanged && succeeded && status) {
      window.setTimeout(() => {
        status.className = 'osint-enrichment-status warn';
        status.textContent = `The enrichment write completed for case ${lock.caseId}, but the active case changed. Open that case to review the saved observation.`;
      }, 0);
    }
    enrichmentDraft = null;
  }

  function releaseAfterBody(response, release) {
    let released = false;
    const finish = () => {
      if (released) return;
      released = true;
      window.setTimeout(release, 0);
    };
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

  function researchFingerprint() {
    const parts = [];
    ['#caseJson', '#phoneJson', '#logBody', '#fileList', '#progressLabel'].forEach((selector) => {
      const node = document.querySelector(selector);
      parts.push(`${selector}:${node?.textContent || ''}`);
    });
    document.querySelectorAll('input, textarea, select').forEach((control) => {
      if (control.classList.contains('cmx-case-context-select')) return;
      if (control.type === 'file') {
        parts.push(`${control.id}:files:${control.files?.length || 0}`);
      } else if (control.type === 'checkbox' || control.type === 'radio') {
        parts.push(`${control.id}:checked:${control.checked}`);
      } else {
        parts.push(`${control.id}:value:${control.value}`);
      }
    });
    return parts.join('\n');
  }

  function hydrateExactActiveCase(attempt = 0) {
    const select = document.querySelector('.cmx-case-context-select');
    const badge = document.querySelector('.cmx-case-context-badge');
    if (!select || !badge || !badge.classList.contains('protected')) {
      if (attempt < 160) window.setTimeout(() => hydrateExactActiveCase(attempt + 1), 25);
      return;
    }

    const requested = new URLSearchParams(window.location.search).get('case') || '';
    const remembered = safeSessionGet('cmx_active_case_v1');
    const candidate = (requested || remembered).slice(0, 36);
    if (!candidate || Array.from(select.options).some((option) => option.value === candidate)) return;

    nativeFetch(`/api/cases/${encodeURIComponent(candidate)}`, {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { accept: 'application/json' }
    }).then(async (response) => {
      if (!response.ok) return;
      const record = await response.json();
      if (Array.from(select.options).some((option) => option.value === record.id)) return;
      const option = document.createElement('option');
      option.value = record.id;
      option.textContent = `${record.title} · ${record.status}`;
      select.appendChild(option);
      select.disabled = false;
      select.value = record.id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }).catch(() => {
      // The visible active-case bar retains its normal error handling.
    });
  }

  function buildEnrichmentObservation() {
    const raw = document.querySelector('#enrichmentRaw')?.textContent || '';
    try {
      const payload = JSON.parse(raw);
      const adapter = String(payload.adapter || 'enrichment')
        .replace(/[^a-z0-9_-]+/gi, '_')
        .toLowerCase()
        .slice(0, 60);
      const notePayload = {
        provider: payload.provider || '',
        source_url: payload.source_url || '',
        target: payload.target || '',
        collected_at: payload.collected_at || '',
        cache_hit: payload.cache_hit === true,
        limitation: 'Provider output is public infrastructure evidence and is not automatically treated as a verified identity, ownership, causation, or current-service conclusion.',
        normalized_result: payload.result || {}
      };
      return {
        kind: `enrichment_${adapter}`.slice(0, 80),
        value_text: summarizeEnrichment(payload).slice(0, 20000),
        note: JSON.stringify(notePayload, null, 2).slice(0, 20000)
      };
    } catch {
      return null;
    }
  }

  function summarizeEnrichment(payload) {
    const result = payload.result || {};
    if (payload.adapter === 'rdap') {
      const status = Array.isArray(result.status) && result.status.length ? result.status.join(', ') : 'status not provided';
      const identifier = result.ldh_name || result.name || result.handle || payload.target;
      return `RDAP ${payload.target_type || 'record'} ${identifier} · ${status}`;
    }
    if (payload.adapter === 'http_headers') {
      return `HTTP ${payload.target} · ${result.status_code || 'unknown'} ${result.reason || ''} · resolved ${result.resolved_ip || 'unknown IP'}`.trim();
    }
    if (payload.adapter === 'tls_certificate') {
      const verified = result.verified ? 'verified certificate' : 'certificate verification failed';
      const fingerprint = result.sha256_fingerprint ? result.sha256_fingerprint.slice(0, 16) : 'fingerprint unavailable';
      return `TLS ${payload.target} · ${result.tls_version || 'unknown version'} · ${verified} · SHA-256 ${fingerprint}`;
    }
    const observed = result.observed_records ?? result.returned_records ?? 0;
    return `Certificate Transparency ${payload.target} · ${observed} unique certificate record${Number(observed) === 1 ? '' : 's'} observed`;
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

  function safeSessionGet(key) {
    try {
      return sessionStorage.getItem(key) || '';
    } catch {
      return '';
    }
  }
})();
