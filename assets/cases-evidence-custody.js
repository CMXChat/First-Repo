(() => {
  'use strict';

  const path = window.location.pathname
    .replace(/\/index\.html$/i, '/')
    .replace(/\/+$/, '') || '/';
  if (path !== '/cases') return;

  const EVENT_LABELS = {
    received: 'Received',
    transferred: 'Transferred',
    stored: 'Stored',
    accessed: 'Accessed',
    verified: 'Hash verified',
    released: 'Released',
    returned: 'Returned',
    disposed: 'Disposed',
    note: 'Custody note'
  };

  const state = {
    detail: null,
    evidenceId: '',
    manifest: null,
    requestId: 0,
    busy: false,
    connected: false
  };

  window.setTimeout(() => waitForWorkspace(0), 0);

  function waitForWorkspace(attempt) {
    const panel = document.querySelector('[data-case-panel="evidence"]');
    const raw = document.getElementById('caseRawJson');
    if (!panel || !raw) {
      if (attempt < 40) window.setTimeout(() => waitForWorkspace(attempt + 1), 100);
      return;
    }
    if (panel.dataset.custodyWorkspace === 'true') return;
    panel.dataset.custodyWorkspace = 'true';
    buildWorkspace(panel);
    bindWorkspace(raw);
    synchronize();
  }

  function buildWorkspace(panel) {
    const section = document.createElement('section');
    section.className = 'cases-operator-section cases-custody-workspace';
    section.id = 'evidenceCustodyWorkspace';

    const heading = document.createElement('div');
    heading.className = 'cases-operator-section-head';
    const headingCopy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = 'Evidence custody and manifest';
    const description = document.createElement('p');
    description.textContent = 'Append-only custody events, server-calculated hash checks, and a deterministic evidence manifest.';
    headingCopy.append(title, description);

    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'cmx-button';
    refresh.id = 'custodyRefresh';
    refresh.textContent = 'Refresh custody';
    heading.append(headingCopy, refresh);

    const notice = document.createElement('p');
    notice.className = 'cmx-notice';
    notice.textContent = 'Custody entries document what an operator records. They do not independently prove source truth, identity, ownership, authorization, or uninterrupted physical control.';

    const selectorRow = document.createElement('div');
    selectorRow.className = 'cases-custody-selector';
    selectorRow.append(
      labeled('Evidence item', select('custodyEvidence', [['', 'No evidence selected']])),
      actionButton('custodyExport', 'Export manifest')
    );

    const summary = document.createElement('div');
    summary.className = 'cases-counts cases-custody-summary';
    summary.append(
      summaryBox('Manifest SHA-256', 'custodyManifestHash', '—'),
      summaryBox('Custody events', 'custodyEventCount', '0'),
      summaryBox('Latest integrity', 'custodyIntegrity', 'Not checked'),
      summaryBox('Evidence hash', 'custodyEvidenceHash', '—')
    );

    const form = document.createElement('div');
    form.className = 'cases-custody-form';
    form.append(
      labeled('Event type', select('custodyEventType', Object.entries(EVENT_LABELS))),
      labeled('Custodian', input('custodyCustodian', 'text', 'Person, team, or controlled location')),
      labeled('Location', input('custodyLocation', 'text', 'Optional physical or logical location')),
      labeled('Occurred at', input('custodyOccurredAt', 'datetime-local', '')),
      labeled('Observed SHA-256', input('custodyObservedHash', 'text', 'Required for hash verification')),
      labeled('Custody note', textarea('custodyNote', 'Transfer method, access reason, packaging, storage, or exception'))
    );

    const actions = document.createElement('div');
    actions.className = 'cmx-actions';
    const add = actionButton('custodyAddEvent', 'Add custody event');
    add.classList.add('primary');
    actions.append(add);

    const message = document.createElement('p');
    message.id = 'custodyMessage';
    message.className = 'cmx-notice cases-hidden';
    message.setAttribute('role', 'status');

    const columns = document.createElement('div');
    columns.className = 'cases-operator-columns cases-custody-columns';
    const ledger = document.createElement('div');
    ledger.className = 'cases-record-list cases-operator-tall';
    ledger.id = 'custodyLedger';
    const manifest = document.createElement('details');
    manifest.className = 'cmx-details';
    const manifestSummary = document.createElement('summary');
    manifestSummary.textContent = 'Manifest JSON';
    const manifestPreview = document.createElement('pre');
    manifestPreview.id = 'custodyManifestPreview';
    manifestPreview.className = 'cases-raw';
    manifestPreview.textContent = 'Select an evidence item to load its manifest.';
    manifest.append(manifestSummary, manifestPreview);
    columns.append(ledger, manifest);

    section.append(heading, notice, selectorRow, summary, form, actions, message, columns);
    panel.appendChild(section);
  }

  function bindWorkspace(raw) {
    raw.addEventListener('DOMCharacterDataModified', synchronize);
    new MutationObserver(synchronize).observe(raw, {
      childList: true,
      characterData: true,
      subtree: true
    });
    document.getElementById('custodyEvidence')?.addEventListener('change', (event) => {
      state.evidenceId = event.target.value;
      state.manifest = null;
      loadManifest(true);
    });
    document.getElementById('custodyRefresh')?.addEventListener('click', () => loadManifest(true));
    document.getElementById('custodyExport')?.addEventListener('click', exportManifest);
    document.getElementById('custodyAddEvent')?.addEventListener('click', createEvent);
    document.getElementById('custodyEventType')?.addEventListener('change', updateHashRequirement);

    const badge = document.getElementById('backendBadge');
    if (badge) {
      new MutationObserver(updateConnection).observe(badge, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    updateConnection();
    updateHashRequirement();
  }

  function synchronize() {
    const raw = document.getElementById('caseRawJson');
    let detail = null;
    try {
      const parsed = JSON.parse(raw?.textContent || '{}');
      if (parsed?.id) detail = parsed;
    } catch {
      detail = null;
    }

    const changedCase = state.detail?.id !== detail?.id;
    state.detail = detail;
    if (changedCase) {
      state.evidenceId = '';
      state.manifest = null;
      state.requestId += 1;
    }
    populateEvidence();
    updateControls();
  }

  function populateEvidence() {
    const selectElement = document.getElementById('custodyEvidence');
    if (!selectElement) return;
    const evidence = Array.isArray(state.detail?.evidence_items) ? state.detail.evidence_items : [];
    const prior = state.evidenceId;
    selectElement.replaceChildren();

    if (!evidence.length) {
      selectElement.append(new Option('No evidence registered in this case', ''));
      state.evidenceId = '';
      renderEmpty('No evidence is available for custody records.');
      return;
    }

    evidence.forEach((item) => {
      const shortHash = String(item.sha256 || '').slice(0, 12);
      selectElement.append(new Option(`${item.filename} · ${shortHash}`, item.id));
    });
    state.evidenceId = evidence.some((item) => item.id === prior) ? prior : evidence[0].id;
    selectElement.value = state.evidenceId;
    if (!state.manifest || state.manifest.evidence?.id !== state.evidenceId) loadManifest(false);
  }

  async function loadManifest(announce) {
    const caseId = state.detail?.id;
    const evidenceId = state.evidenceId;
    if (!caseId || !evidenceId || !state.connected) {
      updateControls();
      return;
    }

    const requestId = ++state.requestId;
    if (announce) showMessage('Loading the latest custody ledger and manifest.');
    setBusy(true);
    try {
      const manifest = await api(`/api/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceId)}/manifest`);
      if (requestId !== state.requestId || state.detail?.id !== caseId || state.evidenceId !== evidenceId) return;
      state.manifest = manifest;
      renderManifest();
      if (announce) showMessage('Custody ledger refreshed.');
    } catch (error) {
      if (requestId !== state.requestId) return;
      state.manifest = null;
      renderEmpty(error.message);
      showMessage(error.message, true);
    } finally {
      if (requestId === state.requestId) setBusy(false);
    }
  }

  async function createEvent() {
    const caseId = state.detail?.id;
    const evidenceId = state.evidenceId;
    if (!caseId || !evidenceId) return showMessage('Select an evidence item first.', true);
    if (!state.connected) return showMessage('The protected case service is unavailable.', true);

    const eventType = value('custodyEventType');
    const custodian = value('custodyCustodian').trim();
    const location = value('custodyLocation').trim();
    const note = value('custodyNote').trim();
    const observed = value('custodyObservedHash').trim().toLowerCase();
    const occurredLocal = value('custodyOccurredAt');

    if (!custodian) return showMessage('Custodian is required.', true);
    if (eventType === 'verified' && !/^[a-f0-9]{64}$/.test(observed)) {
      return showMessage('Hash verification requires a complete 64-character SHA-256 value.', true);
    }
    if (observed && !/^[a-f0-9]{64}$/.test(observed)) {
      return showMessage('Observed SHA-256 must contain exactly 64 hexadecimal characters.', true);
    }

    const body = {
      event_type: eventType,
      custodian,
      location,
      note,
      observed_sha256: observed || null,
      occurred_at: occurredLocal ? new Date(occurredLocal).toISOString() : null
    };

    setBusy(true);
    showMessage('Recording append-only custody event.');
    try {
      const created = await api(
        `/api/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceId)}/custody`,
        { method: 'POST', body }
      );
      if (state.detail?.id !== caseId || state.evidenceId !== evidenceId) return;
      clearEventForm();
      const integrity = humanIntegrity(created.integrity_state);
      showMessage(`Custody event recorded. Integrity: ${integrity}.`, created.integrity_state === 'mismatch');
      await loadManifest(false);
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      setBusy(false);
    }
  }

  function renderManifest() {
    const manifest = state.manifest;
    if (!manifest) return renderEmpty('No manifest loaded.');
    text('custodyManifestHash', manifest.manifest_sha256 || '—');
    text('custodyEventCount', String(manifest.custody_events?.length || 0));
    text('custodyEvidenceHash', manifest.evidence?.sha256 || '—');

    const events = Array.isArray(manifest.custody_events) ? manifest.custody_events : [];
    const latestChecked = [...events].reverse().find((event) => event.integrity_state !== 'not_checked');
    const integrityElement = document.getElementById('custodyIntegrity');
    if (integrityElement) {
      integrityElement.textContent = latestChecked ? humanIntegrity(latestChecked.integrity_state) : 'Not checked';
      integrityElement.classList.toggle('warn', latestChecked?.integrity_state === 'mismatch');
      integrityElement.classList.toggle('good', latestChecked?.integrity_state === 'match');
    }

    const preview = document.getElementById('custodyManifestPreview');
    if (preview) preview.textContent = JSON.stringify(manifest, null, 2);
    renderLedger(events);
    updateControls();
  }

  function renderLedger(events) {
    const ledger = document.getElementById('custodyLedger');
    if (!ledger) return;
    ledger.replaceChildren();
    if (!events.length) {
      const empty = document.createElement('div');
      empty.className = 'cmx-empty';
      empty.textContent = 'No custody events recorded. The evidence registration remains the starting manifest record.';
      ledger.appendChild(empty);
      return;
    }

    [...events].reverse().forEach((event) => {
      const card = document.createElement('article');
      card.className = `cases-record cases-custody-event integrity-${event.integrity_state || 'not_checked'}`;
      const title = document.createElement('strong');
      title.textContent = `${EVENT_LABELS[event.event_type] || event.event_type} · ${event.custodian}`;
      const copy = document.createElement('p');
      copy.textContent = [event.location, event.note].filter(Boolean).join(' · ') || 'No additional custody note.';
      const meta = document.createElement('small');
      meta.textContent = `${formatTime(event.occurred_at)} · recorded by ${event.recorded_by} · ${humanIntegrity(event.integrity_state)}`;
      card.append(title, copy, meta);
      if (event.observed_sha256) {
        const hash = document.createElement('code');
        hash.textContent = `Observed SHA-256 ${event.observed_sha256}`;
        card.appendChild(hash);
      }
      ledger.appendChild(card);
    });
  }

  function renderEmpty(message) {
    text('custodyManifestHash', '—');
    text('custodyEventCount', '0');
    text('custodyIntegrity', 'Not checked');
    text('custodyEvidenceHash', '—');
    const ledger = document.getElementById('custodyLedger');
    if (ledger) {
      ledger.replaceChildren();
      const empty = document.createElement('div');
      empty.className = 'cmx-empty';
      empty.textContent = message;
      ledger.appendChild(empty);
    }
    const preview = document.getElementById('custodyManifestPreview');
    if (preview) preview.textContent = message;
  }

  function exportManifest() {
    if (!state.manifest || state.manifest.evidence?.id !== state.evidenceId) {
      return showMessage('Load the latest manifest before exporting it.', true);
    }
    const blob = new Blob([JSON.stringify(state.manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cmx-evidence-manifest-${state.evidenceId}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showMessage('Evidence manifest exported.');
  }

  function updateHashRequirement() {
    const verified = value('custodyEventType') === 'verified';
    const field = document.getElementById('custodyObservedHash');
    if (!field) return;
    field.required = verified;
    field.setAttribute('aria-required', verified ? 'true' : 'false');
  }

  function updateConnection() {
    const badge = document.getElementById('backendBadge');
    state.connected = Boolean(badge?.classList.contains('good') && /connected/i.test(badge.textContent || ''));
    updateControls();
  }

  function updateControls() {
    const hasEvidence = Boolean(state.detail?.id && state.evidenceId);
    const disabled = state.busy || !state.connected || !hasEvidence;
    ['custodyEvidence', 'custodyRefresh', 'custodyEventType', 'custodyCustodian', 'custodyLocation', 'custodyOccurredAt', 'custodyObservedHash', 'custodyNote', 'custodyAddEvent']
      .forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.disabled = disabled;
      });
    const exportButton = document.getElementById('custodyExport');
    if (exportButton) exportButton.disabled = disabled || !state.manifest;
  }

  function setBusy(value) {
    state.busy = value;
    updateControls();
  }

  function clearEventForm() {
    ['custodyLocation', 'custodyOccurredAt', 'custodyObservedHash', 'custodyNote'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.value = '';
    });
    const type = document.getElementById('custodyEventType');
    if (type) type.value = 'received';
    updateHashRequirement();
  }

  async function api(pathname, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(pathname, {
        method: options.method || 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          accept: 'application/json',
          ...(options.body ? { 'content-type': 'application/json' } : {}),
          'X-CMX-Requested-With': 'evidence-custody-workspace'
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json() : null;
      if (!response.ok) {
        const detail = payload?.detail;
        if (Array.isArray(detail)) throw new Error(detail.map((item) => item.msg).join('; '));
        throw new Error(typeof detail === 'string' ? detail : `Request failed with HTTP ${response.status}.`);
      }
      if (!contentType.includes('application/json')) throw new Error('The custody API returned a non-JSON response.');
      return payload;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('The custody service timed out.');
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function labeled(labelText, control) {
    const label = document.createElement('label');
    label.className = 'cmx-field';
    const span = document.createElement('span');
    span.textContent = labelText;
    label.append(span, control);
    return label;
  }

  function input(id, type, placeholder) {
    const element = document.createElement('input');
    element.id = id;
    element.type = type;
    element.placeholder = placeholder;
    element.autocomplete = 'off';
    return element;
  }

  function textarea(id, placeholder) {
    const element = document.createElement('textarea');
    element.id = id;
    element.rows = 3;
    element.placeholder = placeholder;
    return element;
  }

  function select(id, entries) {
    const element = document.createElement('select');
    element.id = id;
    entries.forEach(([value, label]) => element.append(new Option(label, value)));
    return element;
  }

  function actionButton(id, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cmx-button';
    button.id = id;
    button.textContent = label;
    return button;
  }

  function summaryBox(label, id, initial) {
    const box = document.createElement('div');
    box.className = 'cases-count';
    const valueElement = document.createElement('strong');
    valueElement.id = id;
    valueElement.textContent = initial;
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    box.append(valueElement, labelElement);
    return box;
  }

  function value(id) {
    return document.getElementById(id)?.value || '';
  }

  function text(id, content) {
    const element = document.getElementById(id);
    if (element) element.textContent = content;
  }

  function showMessage(message, warning = false) {
    const element = document.getElementById('custodyMessage');
    if (!element) return;
    element.textContent = message;
    element.className = `cmx-notice${warning ? ' warn' : ''}`;
  }

  function humanIntegrity(value) {
    if (value === 'match') return 'Hash match';
    if (value === 'mismatch') return 'Hash mismatch';
    return 'Not checked';
  }

  function formatTime(value) {
    const date = new Date(value || 0);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : 'Unknown time';
  }
})();
