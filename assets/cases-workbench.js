(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = {
    backend: false,
    identity: null,
    cases: [],
    selectedId: null,
    detail: null,
    importPayload: null,
    busy: false
  };

  const els = {
    session: $('#sessionId'),
    backendBadge: $('#backendBadge'),
    backendTitle: $('#backendTitle'),
    backendCopy: $('#backendCopy'),
    refresh: $('#refreshCases'),
    title: $('#caseTitle'),
    type: $('#caseType'),
    urgency: $('#caseUrgency'),
    authorization: $('#caseAuthorization'),
    summary: $('#caseSummaryInput'),
    retention: $('#caseRetention'),
    create: $('#createCase'),
    formMessage: $('#caseFormMessage'),
    list: $('#caseList'),
    listEmpty: $('#caseListEmpty'),
    count: $('#caseCount'),
    detailEmpty: $('#caseDetailEmpty'),
    detail: $('#caseDetail'),
    detailTitle: $('#detailTitle'),
    detailId: $('#detailId'),
    detailStatus: $('#detailStatus'),
    detailUrgency: $('#detailUrgency'),
    detailType: $('#detailType'),
    detailUpdated: $('#detailUpdated'),
    detailRetention: $('#detailRetention'),
    detailAuthorization: $('#detailAuthorization'),
    detailSummary: $('#detailSummary'),
    saveState: $('#saveCaseState'),
    archive: $('#archiveCase'),
    export: $('#exportCase'),
    countEntities: $('#countEntities'),
    countObservations: $('#countObservations'),
    countSources: $('#countSources'),
    countQueries: $('#countQueries'),
    countEvidence: $('#countEvidence'),
    countRelationships: $('#countRelationships'),
    countNotes: $('#countNotes'),
    entities: $('#entityRecords'),
    observations: $('#observationRecords'),
    sources: $('#sourceRecords'),
    queries: $('#queryRecords'),
    evidence: $('#evidenceRecords'),
    relationships: $('#relationshipRecords'),
    notes: $('#noteRecords'),
    noteInput: $('#noteInput'),
    addNote: $('#addNote'),
    importDrop: $('#importDrop'),
    importFile: $('#importFile'),
    importPreview: $('#importPreview'),
    importButton: $('#importSession'),
    importClear: $('#clearImport'),
    importResult: $('#importResult'),
    rawJson: $('#caseRawJson'),
    toast: $('#toast')
  };

  initialize();

  function initialize() {
    els.session.textContent = randomId();
    bindEvents();
    checkBackend();
  }

  function bindEvents() {
    els.refresh.addEventListener('click', loadCases);
    els.create.addEventListener('click', createCase);
    els.saveState.addEventListener('click', updateSelectedCase);
    els.archive.addEventListener('click', archiveSelectedCase);
    els.export.addEventListener('click', exportSelectedCase);
    els.addNote.addEventListener('click', addNote);
    els.importDrop.addEventListener('click', () => els.importFile.click());
    els.importDrop.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        els.importFile.click();
      }
    });
    ['dragenter', 'dragover'].forEach((name) => {
      els.importDrop.addEventListener(name, (event) => {
        event.preventDefault();
        els.importDrop.classList.add('over');
      });
    });
    ['dragleave', 'drop'].forEach((name) => {
      els.importDrop.addEventListener(name, (event) => {
        event.preventDefault();
        els.importDrop.classList.remove('over');
      });
    });
    els.importDrop.addEventListener('drop', (event) => loadImportFile(event.dataTransfer?.files?.[0]));
    els.importFile.addEventListener('change', () => loadImportFile(els.importFile.files?.[0]));
    els.importButton.addEventListener('click', importSession);
    els.importClear.addEventListener('click', clearImport);
  }

  async function checkBackend() {
    setBusy(true);
    try {
      const response = await fetch('/api/whoami', {
        headers: { accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) throw new Error('FastAPI origin unavailable');
      state.identity = await response.json();
      state.backend = true;
      els.backendBadge.className = 'cases-badge good';
      els.backendBadge.textContent = 'Backend connected';
      els.backendTitle.textContent = 'Persistent case service ready';
      els.backendCopy.textContent = `Authenticated as ${state.identity.email || state.identity.subject}. Records are scoped to this Access identity.`;
      enableWorkspace(true);
      await loadCases();
    } catch {
      state.backend = false;
      els.backendBadge.className = 'cases-badge warn';
      els.backendBadge.textContent = 'Static transition mode';
      els.backendTitle.textContent = 'FastAPI case service is not active on this host';
      els.backendCopy.textContent = 'The case workspace becomes available on the protected FastAPI staging origin. Existing tool JSON exports remain usable until then.';
      enableWorkspace(false);
      renderCases();
      renderDetail();
    } finally {
      setBusy(false);
    }
  }

  function enableWorkspace(enabled) {
    [els.refresh, els.create, els.saveState, els.archive, els.export, els.addNote]
      .forEach((element) => { element.disabled = !enabled; });
    els.importDrop.tabIndex = enabled ? 0 : -1;
    els.importFile.disabled = !enabled;
    syncImportButton();
  }

  async function loadCases() {
    if (!state.backend || state.busy) return;
    setBusy(true);
    try {
      state.cases = await api('/api/cases?limit=200');
      if (state.selectedId && !state.cases.some((item) => item.id === state.selectedId)) {
        state.selectedId = null;
        state.detail = null;
      }
      renderCases();
      if (state.selectedId) await selectCase(state.selectedId);
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function createCase() {
    if (!state.backend || state.busy) return;
    const title = els.title.value.trim();
    const authorization = els.authorization.value.trim();
    if (!title) return formMessage('Add a case title.', true);
    if (!authorization) return formMessage('Record the authorization or legitimate basis.', true);

    setBusy(true);
    formMessage('Creating case…');
    try {
      const payload = {
        title,
        case_type: slug(els.type.value || 'general'),
        urgency: els.urgency.value,
        authorization_basis: authorization,
        summary: els.summary.value.trim(),
        retention_until: els.retention.value ? new Date(els.retention.value).toISOString() : null
      };
      const created = await api('/api/cases', { method: 'POST', body: payload });
      resetCreateForm();
      formMessage('Case created.');
      await loadCases();
      await selectCase(created.id);
    } catch (error) {
      formMessage(error.message, true);
    } finally {
      setBusy(false);
    }
  }

  async function selectCase(caseId) {
    if (!state.backend) return;
    state.selectedId = caseId;
    renderCases();
    try {
      state.detail = await api(`/api/cases/${encodeURIComponent(caseId)}`);
      renderDetail();
    } catch (error) {
      notify(error.message);
      state.detail = null;
      renderDetail();
    }
  }

  async function updateSelectedCase() {
    if (!state.detail || state.busy) return;
    setBusy(true);
    try {
      await api(`/api/cases/${encodeURIComponent(state.detail.id)}`, {
        method: 'PATCH',
        body: {
          status: els.detailStatus.value,
          urgency: els.detailUrgency.value
        }
      });
      notify('Case state updated.');
      await loadCases();
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function archiveSelectedCase() {
    if (!state.detail || state.busy) return;
    if (!window.confirm(`Archive case “${state.detail.title}”? The API uses soft deletion.`)) return;
    setBusy(true);
    try {
      await api(`/api/cases/${encodeURIComponent(state.detail.id)}`, { method: 'DELETE' });
      state.selectedId = null;
      state.detail = null;
      clearImport();
      notify('Case archived.');
      await loadCases();
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function addNote() {
    if (!state.detail || state.busy) return;
    const note = els.noteInput.value.trim();
    if (!note) return notify('Add an analyst note.');
    setBusy(true);
    try {
      await api(`/api/cases/${encodeURIComponent(state.detail.id)}/notes`, {
        method: 'POST',
        body: { note }
      });
      els.noteInput.value = '';
      notify('Analyst note added.');
      await selectCase(state.detail.id);
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function loadImportFile(file) {
    if (!state.backend || !file) return;
    if (file.size > 2_000_000) return notify('Import files are limited to 2 MB.');
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') return notify('Choose a CMX JSON export.');
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('JSON root must be an object.');
      state.importPayload = payload;
      const count = Array.isArray(payload.entries)
        ? payload.entries.length
        : ['observations', 'dns', 'sources', 'facts', 'leads', 'timeline'].reduce((total, key) => total + (Array.isArray(payload[key]) ? payload[key].length : 0), 0);
      els.importPreview.textContent = `File: ${file.name}\nSchema: ${String(payload.schema || 'missing')}\nTop-level records: ${count}\nSize: ${formatBytes(file.size)}`;
      els.importResult.replaceChildren();
      syncImportButton();
    } catch (error) {
      clearImport();
      notify(error instanceof Error ? error.message : 'Unable to parse the import file.');
    }
  }

  async function importSession() {
    if (!state.detail || !state.importPayload || state.busy) return notify('Select a case and choose a CMX JSON export.');
    setBusy(true);
    try {
      const caseId = state.detail.id;
      const result = await api(`/api/cases/${encodeURIComponent(caseId)}/imports`, {
        method: 'POST',
        body: { payload: state.importPayload }
      });
      renderImportResult(result);
      notify(`Imported ${result.schema}.`);
      await selectCase(caseId);
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  function renderCases() {
    els.list.replaceChildren();
    els.count.textContent = String(state.cases.length);
    els.listEmpty.classList.toggle('cases-hidden', state.cases.length > 0);

    state.cases.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cases-item${item.id === state.selectedId ? ' active' : ''}`;
      button.addEventListener('click', () => selectCase(item.id));

      const title = document.createElement('span');
      title.className = 'cases-item-title';
      title.textContent = item.title;
      const meta = document.createElement('span');
      meta.className = 'cases-item-meta';
      meta.append(
        badge(item.case_type),
        badge(item.status),
        badge(item.urgency),
        badge(new Date(item.updated_at).toLocaleDateString())
      );
      button.append(title, meta);
      els.list.appendChild(button);
    });
  }

  function renderDetail() {
    const item = state.detail;
    els.detailEmpty.classList.toggle('cases-hidden', Boolean(item));
    els.detail.classList.toggle('cases-hidden', !item);
    if (!item) {
      els.rawJson.textContent = '';
      syncImportButton();
      return;
    }

    els.detailTitle.textContent = item.title;
    els.detailId.textContent = item.id;
    els.detailStatus.value = item.status;
    els.detailUrgency.value = item.urgency;
    els.detailType.textContent = item.case_type;
    els.detailUpdated.textContent = new Date(item.updated_at).toLocaleString();
    els.detailRetention.textContent = item.retention_until ? new Date(item.retention_until).toLocaleString() : 'No date set';
    els.detailAuthorization.textContent = item.authorization_basis;
    els.detailSummary.textContent = item.summary || 'No summary recorded.';

    const collections = {
      entities: item.entities || [],
      observations: item.observations || [],
      sources: item.sources || [],
      queries: item.queries || [],
      evidence: item.evidence_items || [],
      relationships: item.relationships || [],
      notes: item.notes || []
    };
    els.countEntities.textContent = String(collections.entities.length);
    els.countObservations.textContent = String(collections.observations.length);
    els.countSources.textContent = String(collections.sources.length);
    els.countQueries.textContent = String(collections.queries.length);
    els.countEvidence.textContent = String(collections.evidence.length);
    els.countRelationships.textContent = String(collections.relationships.length);
    els.countNotes.textContent = String(collections.notes.length);

    renderRecords(els.entities, collections.entities, (record) => ({
      title: `${record.entity_type}: ${record.display_value || record.normalized_value}`,
      copy: `${record.confidence} confidence · ${new Date(record.created_at).toLocaleString()}`
    }));
    renderRecords(els.observations, collections.observations, (record) => ({
      title: `${record.kind}: ${record.value_text}`,
      copy: `${record.confidence} confidence${record.note ? ` · ${record.note}` : ''}`
    }));
    renderRecords(els.sources, collections.sources, (record) => ({
      title: record.label,
      copy: [record.source_type, record.url, record.notes].filter(Boolean).join(' · ')
    }));
    renderRecords(els.queries, collections.queries, (record) => ({
      title: `${record.provider}: ${record.query_text}`,
      copy: [record.purpose, record.result_url].filter(Boolean).join(' · ')
    }));
    renderRecords(els.evidence, collections.evidence, (record) => ({
      title: record.filename,
      copy: `${record.media_type} · ${formatBytes(record.size_bytes)} · SHA-256 ${record.sha256.slice(0, 16)}…`
    }));
    renderRecords(els.relationships, collections.relationships, (record) => ({
      title: record.relationship_type,
      copy: `${record.from_entity_id} → ${record.to_entity_id} · ${record.confidence}`
    }));
    renderRecords(els.notes, collections.notes, (record) => ({
      title: record.note,
      copy: new Date(record.created_at).toLocaleString()
    }));

    els.rawJson.textContent = JSON.stringify(item, null, 2);
    syncImportButton();
  }

  function renderRecords(container, records, describe) {
    container.replaceChildren();
    if (!records.length) {
      const empty = document.createElement('div');
      empty.className = 'cmx-empty';
      empty.textContent = 'No records.';
      container.appendChild(empty);
      return;
    }
    records.slice(0, 100).forEach((record) => {
      const description = describe(record);
      const card = document.createElement('div');
      card.className = 'cases-record';
      const title = document.createElement('strong');
      title.textContent = truncate(description.title, 700);
      const copy = document.createElement('p');
      copy.textContent = truncate(description.copy, 1200);
      card.append(title, copy);
      container.appendChild(card);
    });
    if (records.length > 100) {
      const note = document.createElement('p');
      note.className = 'cmx-muted';
      note.textContent = `Showing 100 of ${records.length} records.`;
      container.appendChild(note);
    }
  }

  function renderImportResult(result) {
    els.importResult.replaceChildren();
    const fields = [
      ['Schema', result.schema],
      ['Entities', result.entities_created],
      ['Observations', result.observations_created],
      ['Sources', result.sources_created],
      ['Queries', result.queries_created],
      ['Evidence', result.evidence_created],
      ['Warnings', result.warnings.length]
    ];
    fields.forEach(([label, value]) => {
      const box = document.createElement('div');
      box.className = 'cases-kv';
      const key = document.createElement('div');
      key.className = 'cases-kv-label';
      key.textContent = label;
      const data = document.createElement('div');
      data.className = 'cases-kv-value';
      data.textContent = String(value);
      box.append(key, data);
      els.importResult.appendChild(box);
    });
    result.warnings.forEach((warning) => {
      const notice = document.createElement('p');
      notice.className = 'cmx-notice warn';
      notice.textContent = warning;
      els.importResult.appendChild(notice);
    });
  }

  function clearImport() {
    state.importPayload = null;
    els.importFile.value = '';
    els.importPreview.textContent = 'No CMX session export selected.';
    els.importResult.replaceChildren();
    syncImportButton();
  }

  function exportSelectedCase() {
    if (!state.detail) return;
    const blob = new Blob([JSON.stringify(state.detail, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cmx-case-${state.detail.id}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('Case JSON exported.');
  }

  async function api(path, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(path, {
        method: options.method || 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          accept: 'application/json',
          ...(options.body ? { 'content-type': 'application/json' } : {}),
          'X-CMX-Requested-With': 'cases-workbench'
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      if (response.status === 204) return null;
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json() : null;
      if (!response.ok) {
        const detail = payload?.detail;
        if (Array.isArray(detail)) throw new Error(detail.map((item) => item.msg).join('; '));
        throw new Error(typeof detail === 'string' ? detail : `Request failed with HTTP ${response.status}.`);
      }
      if (!contentType.includes('application/json')) throw new Error('The FastAPI JSON service is unavailable on this host.');
      return payload;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('The case service timed out.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function setBusy(busy) {
    state.busy = busy;
    document.querySelectorAll('button').forEach((button) => {
      if (button.id === 'clearImport') return;
      if (busy) button.dataset.wasDisabled = button.disabled ? 'true' : 'false';
      button.disabled = busy || button.dataset.wasDisabled === 'true';
      if (!busy) delete button.dataset.wasDisabled;
    });
    syncImportButton();
  }

  function syncImportButton() {
    els.importButton.disabled = !(
      state.backend &&
      !state.busy &&
      state.selectedId &&
      state.detail &&
      state.importPayload
    );
  }

  function resetCreateForm() {
    els.title.value = '';
    els.type.value = 'general';
    els.urgency.value = 'standard';
    els.authorization.value = '';
    els.summary.value = '';
    els.retention.value = '';
  }

  function formMessage(message, error = false) {
    els.formMessage.textContent = message;
    els.formMessage.className = `cmx-notice${error ? ' warn' : ''}`;
  }

  function badge(text) {
    const element = document.createElement('span');
    element.className = 'cases-badge';
    element.textContent = String(text);
    return element;
  }

  function slug(value) {
    const result = String(value).toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
    return result || 'general';
  }

  function truncate(value, limit) {
    const text = String(value || '');
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function formatBytes(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = number;
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index += 1;
    }
    return `${size.toFixed(index && size < 10 ? 1 : 0)} ${units[index]}`;
  }

  function randomId() {
    return crypto.getRandomValues(new Uint32Array(2)).reduce((value, number) => value + number.toString(36), '').slice(0, 10).toUpperCase();
  }

  let toastTimer;
  function notify(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }
})();
