(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = {
    backend: false,
    activeCaseId: '',
    result: null,
    runId: 0,
    controller: null,
    saving: false,
    duplicateSignature: '',
    contextObserver: null,
    contextAttempts: 0
  };

  const els = {
    section: $('#enrichmentSection'),
    target: $('#enrichmentTarget'),
    rdap: $('#enrichRdap'),
    http: $('#enrichHttp'),
    tls: $('#enrichTls'),
    ct: $('#enrichCt'),
    cancel: $('#enrichCancel'),
    status: $('#enrichmentStatus'),
    result: $('#enrichmentResult'),
    provenance: $('#enrichmentProvenance'),
    summary: $('#enrichmentSummary'),
    records: $('#enrichmentRecords'),
    raw: $('#enrichmentRaw'),
    saveBox: $('#enrichmentSaveBox'),
    disclosure: $('#enrichmentSaveDisclosure'),
    duplicate: $('#enrichmentDuplicate'),
    duplicateText: $('#enrichmentDuplicateText'),
    duplicateReview: $('#enrichmentDuplicateReview'),
    save: $('#enrichmentSave'),
    summaryType: $('#summaryType'),
    summaryValue: $('#summaryValue')
  };

  if (!els.section) return;
  initialize();

  function initialize() {
    els.rdap.addEventListener('click', () => runAdapter('rdap'));
    els.http.addEventListener('click', () => runAdapter('http'));
    els.tls.addEventListener('click', () => runAdapter('tls'));
    els.ct.addEventListener('click', () => runAdapter('ct'));
    els.cancel.addEventListener('click', cancelRun);
    els.save.addEventListener('click', saveFinding);
    els.duplicateReview.addEventListener('change', updateSaveState);
    els.target.addEventListener('input', () => {
      clearResult('Target changed. Run an enrichment adapter to collect a new bounded result.');
      updateAdapterState();
    });

    const entityObserver = new MutationObserver(syncTargetFromEntity);
    [els.summaryType, els.summaryValue].forEach((node) => {
      if (node) entityObserver.observe(node, { childList: true, characterData: true, subtree: true });
    });

    syncTargetFromEntity();
    connectCaseContext();
    updateAdapterState();
  }

  function connectCaseContext() {
    const select = $('.cmx-case-context-select');
    const badge = $('.cmx-case-context-badge');
    if (!select || !badge) {
      state.contextAttempts += 1;
      if (state.contextAttempts < 160) window.setTimeout(connectCaseContext, 25);
      return;
    }

    const sync = () => {
      const nextBackend = badge.classList.contains('protected');
      const nextCaseId = nextBackend ? select.value : '';
      if (nextCaseId !== state.activeCaseId) clearDuplicate();
      state.backend = nextBackend;
      state.activeCaseId = nextCaseId;
      updateAdapterState();
      updateSaveDisclosure();
      updateSaveState();
    };

    select.addEventListener('change', sync);
    state.contextObserver = new MutationObserver(sync);
    state.contextObserver.observe(select, { attributes: true, childList: true, subtree: true });
    state.contextObserver.observe(badge, { attributes: true, childList: true, characterData: true, subtree: true });
    sync();
  }

  function syncTargetFromEntity() {
    const type = (els.summaryType?.textContent || '').trim().toLowerCase();
    const value = (els.summaryValue?.textContent || '').trim();
    if (!value || document.activeElement === els.target) return;

    let target = value;
    if (type === 'email') target = value.split('@')[1] || value;
    els.target.value = target;
    clearResult('Current entity updated. Choose a bounded enrichment adapter.');
    updateAdapterState();
  }

  async function runAdapter(adapter) {
    if (!state.backend) {
      setStatus('Protected FastAPI enrichment is unavailable on this hostname.', 'failed');
      return;
    }

    let request;
    try {
      request = adapterRequest(adapter, els.target.value);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The target is not valid for this adapter.', 'failed');
      return;
    }

    cancelRun(false);
    const runId = ++state.runId;
    const controller = new AbortController();
    state.controller = controller;
    state.result = null;
    clearDuplicate();
    renderEmptyResult();
    setBusy(true);
    setStatus(`Running ${adapterLabel(adapter)} through the protected CMX gateway…`, 'pending');
    const timeout = window.setTimeout(() => controller.abort('timeout'), 22000);

    try {
      const response = await fetch(request.url, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw await responseError(response);
      const payload = await response.json();
      if (runId !== state.runId) return;
      state.result = payload;
      renderResult(payload);
      setStatus(
        `${adapterLabel(adapter)} completed through ${payload.provider || 'the configured provider'}${payload.cache_hit ? ' using a cached result' : ''}.`,
        'good'
      );
    } catch (error) {
      if (runId !== state.runId) return;
      if (controller.signal.aborted) {
        setStatus(controller.signal.reason === 'timeout'
          ? 'The enrichment request reached the browser timeout and was cancelled.'
          : 'The enrichment request was cancelled.', 'warn');
      } else {
        setStatus(error instanceof Error ? error.message : 'The enrichment request failed.', 'failed');
      }
    } finally {
      window.clearTimeout(timeout);
      if (runId === state.runId) {
        state.controller = null;
        setBusy(false);
        updateAdapterState();
      }
    }
  }

  function adapterRequest(adapter, rawTarget) {
    const target = rawTarget.trim();
    if (!target) throw new Error('Enter a domain, public IP, ASN, or URL.');

    if (adapter === 'rdap') {
      return {
        url: `/api/enrichment/rdap?${new URLSearchParams({ target }).toString()}`
      };
    }
    if (adapter === 'http') {
      const url = /^https?:\/\//i.test(target) ? target : `https://${target}/`;
      return {
        url: `/api/enrichment/http?${new URLSearchParams({ url }).toString()}`
      };
    }
    if (adapter === 'tls') {
      const host = hostFromTarget(target);
      if (!host) throw new Error('TLS inspection requires a public domain or IP address.');
      return {
        url: `/api/enrichment/tls?${new URLSearchParams({ host, port: '443' }).toString()}`
      };
    }
    const domain = domainFromTarget(target);
    if (!domain) throw new Error('Certificate Transparency requires a public domain name.');
    return {
      url: `/api/enrichment/ct?${new URLSearchParams({ domain, include_subdomains: 'true' }).toString()}`
    };
  }

  function hostFromTarget(value) {
    const candidate = value.trim();
    if (/^AS\d+$/i.test(candidate)) return '';
    if (/^https?:\/\//i.test(candidate)) {
      try {
        return new URL(candidate).hostname;
      } catch {
        return '';
      }
    }
    if (candidate.includes('@')) return candidate.split('@').pop() || '';
    return candidate.replace(/^\[|\]$/g, '').split(/[/?#]/)[0];
  }

  function domainFromTarget(value) {
    const host = hostFromTarget(value).toLowerCase().replace(/\.$/, '');
    if (!host || host.includes(':') || /^\d+(?:\.\d+){3}$/.test(host)) return '';
    if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(host)) return '';
    return host;
  }

  function cancelRun(showMessage = true) {
    if (state.controller) state.controller.abort('operator');
    state.controller = null;
    state.runId += 1;
    setBusy(false);
    if (showMessage) setStatus('The active enrichment request was cancelled.', 'warn');
  }

  function setBusy(busy) {
    [els.rdap, els.http, els.tls, els.ct].forEach((button) => {
      button.disabled = busy || !state.backend;
    });
    els.cancel.disabled = !busy;
    els.target.disabled = busy;
  }

  function updateAdapterState() {
    const target = els.target.value.trim();
    const busy = Boolean(state.controller);
    const domain = domainFromTarget(target);
    const host = hostFromTarget(target);
    els.rdap.disabled = busy || !state.backend || !target;
    els.http.disabled = busy || !state.backend || !target || /^AS\d+$/i.test(target);
    els.tls.disabled = busy || !state.backend || !host || /^AS\d+$/i.test(target);
    els.ct.disabled = busy || !state.backend || !domain;
    els.cancel.disabled = !busy;
    if (!state.backend && !busy) {
      setStatus('Server enrichment requires the protected FastAPI origin. Local analysis and external pivots remain available.', 'warn');
    }
  }

  function renderResult(payload) {
    els.result.classList.remove('osint-hidden');
    renderProvenance(payload);
    renderSummary(payload.result || {});
    renderRecords(payload.result?.records || []);
    els.raw.textContent = JSON.stringify(payload, null, 2);
    els.saveBox.classList.remove('osint-hidden');
    updateSaveDisclosure();
    updateSaveState();
  }

  function renderProvenance(payload) {
    els.provenance.replaceChildren();
    provenanceItem('Adapter', adapterLabel(payload.adapter || 'enrichment'));
    provenanceItem('Provider', payload.provider || 'Unknown provider');
    provenanceItem('Collected', formatDate(payload.collected_at));
    provenanceItem('Cache', payload.cache_hit ? 'Cache hit' : 'Fresh collection');
    provenanceItem('Target', payload.target || 'Unknown target');
    provenanceItem('Requested by', payload.requested_by || 'Authenticated operator');

    const source = document.createElement('div');
    const label = document.createElement('span');
    label.textContent = 'Provider source';
    const link = document.createElement('a');
    link.textContent = payload.source_url || 'Not provided';
    if (safeExternalUrl(payload.source_url)) {
      link.href = payload.source_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    source.append(label, link);
    els.provenance.appendChild(source);
  }

  function provenanceItem(labelText, value) {
    const item = document.createElement('div');
    const label = document.createElement('span');
    label.textContent = labelText;
    const strong = document.createElement('strong');
    strong.textContent = String(value || 'Not provided');
    item.append(label, strong);
    els.provenance.appendChild(item);
  }

  function renderSummary(result) {
    els.summary.replaceChildren();
    const entries = Object.entries(result).filter(([key]) => key !== 'records');
    if (!entries.length) {
      els.summary.appendChild(summaryCard('Result', 'No normalized fields were returned.'));
      return;
    }

    entries.slice(0, 40).forEach(([key, value]) => {
      els.summary.appendChild(summaryCard(humanize(key), displayValue(value)));
    });
  }

  function renderRecords(records) {
    els.records.replaceChildren();
    if (!Array.isArray(records) || !records.length) return;

    const heading = document.createElement('h3');
    heading.textContent = `Returned records (${records.length})`;
    els.records.appendChild(heading);

    records.slice(0, 20).forEach((record, index) => {
      const card = document.createElement('article');
      card.className = 'osint-enrichment-record';
      const title = document.createElement('strong');
      title.textContent = record.common_name || record.name || record.handle || `Record ${index + 1}`;
      const copy = document.createElement('span');
      copy.textContent = displayValue(record);
      card.append(title, copy);
      els.records.appendChild(card);
    });

    if (records.length > 20) {
      const note = document.createElement('p');
      note.className = 'cmx-muted';
      note.textContent = `${records.length - 20} additional normalized records remain in the JSON view.`;
      els.records.appendChild(note);
    }
  }

  function summaryCard(label, value) {
    const card = document.createElement('article');
    card.className = 'osint-enrichment-summary-card';
    const title = document.createElement('h3');
    title.textContent = label;
    const copy = document.createElement('pre');
    copy.textContent = value;
    card.append(title, copy);
    return card;
  }

  function displayValue(value) {
    if (value == null || value === '') return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) {
      if (!value.length) return 'None returned';
      if (value.every((item) => ['string', 'number', 'boolean'].includes(typeof item))) {
        return value.map(String).join('\n');
      }
    }
    return JSON.stringify(value, null, 2);
  }

  function clearResult(message) {
    if (state.controller) cancelRun(false);
    state.result = null;
    clearDuplicate();
    renderEmptyResult();
    if (message) setStatus(message, '');
  }

  function renderEmptyResult() {
    els.result.classList.add('osint-hidden');
    els.provenance.replaceChildren();
    els.summary.replaceChildren();
    els.records.replaceChildren();
    els.raw.textContent = '';
    els.saveBox.classList.add('osint-hidden');
    updateSaveState();
  }

  function updateSaveDisclosure() {
    els.disclosure.replaceChildren();
    if (!state.result) return;
    const draft = buildObservation(state.result);
    const activeCase = selectedCaseLabel();
    [
      ['Active case', activeCase],
      ['Record kind', draft.kind],
      ['Observed value', draft.value_text],
      ['Confidence', draft.confidence],
      ['Observed at', draft.observed_at || 'Collection time unavailable'],
      ['Analyst note', draft.note]
    ].forEach(([labelText, value]) => {
      const term = document.createElement('dt');
      term.textContent = labelText;
      const description = document.createElement('dd');
      description.textContent = truncate(value, 1200);
      els.disclosure.append(term, description);
    });
  }

  function buildObservation(payload) {
    const adapter = String(payload.adapter || 'enrichment').replace(/[^a-z0-9_-]+/gi, '_').toLowerCase().slice(0, 60);
    const valueText = summarizeResult(payload).slice(0, 20000);
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
      value_text: valueText,
      note: JSON.stringify(notePayload, null, 2).slice(0, 20000),
      confidence: 'unrated',
      observed_at: payload.collected_at || undefined
    };
  }

  function summarizeResult(payload) {
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

  async function saveFinding() {
    if (!state.result || state.saving || !state.backend || !state.activeCaseId) return;
    const caseId = state.activeCaseId;
    const draft = buildObservation(state.result);
    state.saving = true;
    updateSaveState();
    setStatus('Checking the latest case observations for an exact duplicate…', 'pending');

    try {
      const detailResponse = await fetch(`/api/cases/${encodeURIComponent(caseId)}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!detailResponse.ok) throw await responseError(detailResponse, 'Case detail could not be loaded');
      const detail = await detailResponse.json();
      if (caseId !== state.activeCaseId) throw new Error('The active case changed during duplicate review.');

      const duplicate = (detail.observations || []).find((record) =>
        record.kind === draft.kind && record.value_text === draft.value_text
      );
      const signature = duplicate ? `${duplicate.id}:${draft.kind}:${draft.value_text}` : '';
      if (duplicate && (state.duplicateSignature !== signature || !els.duplicateReview.checked)) {
        state.duplicateSignature = signature;
        els.duplicate.hidden = false;
        els.duplicateReview.checked = false;
        els.duplicateText.textContent = `An existing ${draft.kind} observation has the same normalized summary. Review it before creating another record.`;
        setStatus('Potential duplicate found. Explicit acknowledgement is required before another write.', 'warn');
        return;
      }

      const response = await fetch(`/api/cases/${encodeURIComponent(caseId)}/observations`, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(draft)
      });
      if (!response.ok) throw await responseError(response, 'Enrichment finding could not be saved');
      const saved = await response.json();
      clearDuplicate();
      setStatus(`Saved ${saved.kind} observation to ${selectedCaseLabel()}.`, 'good');
      document.dispatchEvent(new CustomEvent('cmx-case-record-saved', {
        detail: { caseId, kind: 'finding', recordId: saved.id || '' }
      }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The enrichment finding could not be saved.', 'failed');
    } finally {
      state.saving = false;
      updateSaveState();
    }
  }

  function clearDuplicate() {
    state.duplicateSignature = '';
    els.duplicate.hidden = true;
    els.duplicateReview.checked = false;
    els.duplicateText.textContent = '';
  }

  function updateSaveState() {
    const duplicateNeedsReview = !els.duplicate.hidden && !els.duplicateReview.checked;
    els.save.disabled = !state.result
      || !state.backend
      || !state.activeCaseId
      || state.saving
      || duplicateNeedsReview;
    els.save.textContent = state.saving ? 'Saving…' : 'Save finding to active case';
    els.duplicateReview.disabled = state.saving;
  }

  function selectedCaseLabel() {
    const select = $('.cmx-case-context-select');
    const option = select?.selectedOptions?.[0];
    return state.activeCaseId && option ? option.textContent || state.activeCaseId : 'No active case selected';
  }

  function setStatus(message, tone) {
    els.status.className = 'osint-enrichment-status';
    if (tone) els.status.classList.add(tone);
    els.status.textContent = message;
  }

  async function responseError(response, fallback = 'Enrichment request failed') {
    try {
      const payload = await response.json();
      const detail = typeof payload.detail === 'string' ? payload.detail : JSON.stringify(payload.detail || {});
      return new Error(`${fallback}: ${detail || `HTTP ${response.status}`}`);
    } catch {
      return new Error(`${fallback}: HTTP ${response.status}`);
    }
  }

  function adapterLabel(value) {
    const labels = {
      rdap: 'RDAP',
      http: 'HTTP headers',
      http_headers: 'HTTP headers',
      tls: 'TLS certificate',
      tls_certificate: 'TLS certificate',
      ct: 'Certificate Transparency',
      certificate_transparency: 'Certificate Transparency'
    };
    return labels[value] || humanize(value);
  }

  function humanize(value) {
    return String(value || '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function safeExternalUrl(value) {
    if (!value) return false;
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function formatDate(value) {
    if (!value) return 'Not provided';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }

  function truncate(value, limit) {
    const text = String(value || '');
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
  }
})();
