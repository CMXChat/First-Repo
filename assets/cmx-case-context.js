(() => {
  'use strict';

  const ACTIVE_CASE_KEY = 'cmx_active_case_v1';
  const MAX_SESSION_OBSERVATIONS = 50;
  const state = {
    backend: false,
    identity: null,
    cases: [],
    activeCaseId: '',
    lastSavedFingerprint: '',
    saving: false
  };

  const shell = buildShell();
  const source = document.querySelector('#caseJson');
  const topbar = document.querySelector('.cmx-tool-topbar');
  if (!source || !topbar) return;
  topbar.insertAdjacentElement('afterend', shell.root);

  shell.select.addEventListener('change', selectCase);
  shell.save.addEventListener('click', saveSnapshot);
  shell.refresh.addEventListener('click', loadContext);
  shell.openCases.addEventListener('click', () => {
    window.location.href = state.activeCaseId ? `/cases?case=${encodeURIComponent(state.activeCaseId)}` : '/cases';
  });

  new MutationObserver(updateSaveState).observe(source, {
    childList: true,
    characterData: true,
    subtree: true
  });

  loadContext();

  function buildShell() {
    const root = document.createElement('section');
    root.className = 'cmx-case-context';
    root.setAttribute('aria-label', 'Active case context');

    const statusBox = document.createElement('div');
    statusBox.className = 'cmx-case-context-status';
    const badge = document.createElement('span');
    badge.className = 'cmx-case-context-badge pending';
    badge.textContent = 'Checking protection';
    const identity = document.createElement('span');
    identity.className = 'cmx-case-context-identity';
    identity.textContent = 'Persistent case service is being checked.';
    statusBox.append(badge, identity);

    const controls = document.createElement('div');
    controls.className = 'cmx-case-context-controls';

    const label = document.createElement('label');
    label.className = 'cmx-case-context-field';
    const labelText = document.createElement('span');
    labelText.textContent = 'Active case';
    const select = document.createElement('select');
    select.className = 'cmx-case-context-select';
    select.disabled = true;
    const initial = document.createElement('option');
    initial.value = '';
    initial.textContent = 'No persistent case selected';
    select.appendChild(initial);
    label.append(labelText, select);

    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'cmx-case-context-button primary';
    save.textContent = 'Save current snapshot';
    save.disabled = true;

    const openCases = document.createElement('button');
    openCases.type = 'button';
    openCases.className = 'cmx-case-context-button';
    openCases.textContent = 'Open Cases';

    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'cmx-case-context-button quiet';
    refresh.textContent = 'Refresh';

    controls.append(label, save, openCases, refresh);

    const message = document.createElement('p');
    message.className = 'cmx-case-context-message';
    message.textContent = 'No research data is saved automatically.';

    root.append(statusBox, controls, message);
    return { root, badge, identity, select, save, openCases, refresh, message };
  }

  async function loadContext() {
    setPending('Checking protected case service…');
    shell.refresh.disabled = true;

    try {
      const identityResponse = await fetch('/api/whoami', {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!identityResponse.ok) throw new Error(`Identity service returned HTTP ${identityResponse.status}`);

      state.identity = await identityResponse.json();
      const casesResponse = await fetch('/api/cases?limit=100', {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!casesResponse.ok) throw new Error(`Case service returned HTTP ${casesResponse.status}`);

      state.cases = await casesResponse.json();
      state.backend = true;
      renderCases();
      setProtected();
    } catch {
      state.backend = false;
      state.identity = null;
      state.cases = [];
      state.activeCaseId = '';
      shell.select.replaceChildren(option('', 'Local-only mode'));
      shell.select.disabled = true;
      shell.save.disabled = true;
      shell.badge.className = 'cmx-case-context-badge local';
      shell.badge.textContent = 'Local-only';
      shell.identity.textContent = 'FastAPI case persistence is unavailable on this hostname.';
      shell.message.textContent = 'Continue locally or export JSON. Nothing will be written to a case.';
    } finally {
      shell.refresh.disabled = false;
      updateSaveState();
    }
  }

  function renderCases() {
    shell.select.replaceChildren(option('', 'Select a persistent case'));
    state.cases.forEach((record) => {
      const item = option(record.id, `${record.title} · ${record.status}`);
      item.dataset.status = record.status;
      shell.select.appendChild(item);
    });

    const remembered = safeSessionGet(ACTIVE_CASE_KEY);
    const requested = new URLSearchParams(window.location.search).get('case') || '';
    const candidate = requested || remembered;
    if (candidate && state.cases.some((record) => record.id === candidate)) {
      state.activeCaseId = candidate;
      shell.select.value = candidate;
      safeSessionSet(ACTIVE_CASE_KEY, candidate);
    } else {
      state.activeCaseId = '';
      safeSessionDelete(ACTIVE_CASE_KEY);
    }

    shell.select.disabled = state.cases.length === 0;
    if (!state.cases.length) {
      shell.select.replaceChildren(option('', 'Create a case in CMX Cases'));
    }
  }

  function selectCase() {
    state.activeCaseId = shell.select.value;
    state.lastSavedFingerprint = '';
    if (state.activeCaseId) safeSessionSet(ACTIVE_CASE_KEY, state.activeCaseId);
    else safeSessionDelete(ACTIVE_CASE_KEY);
    updateSaveState();
  }

  function setProtected() {
    const label = state.identity?.email || state.identity?.name || state.identity?.subject || 'Authenticated operator';
    shell.badge.className = 'cmx-case-context-badge protected';
    shell.badge.textContent = 'Protected';
    shell.identity.textContent = label;
    shell.message.textContent = state.activeCaseId
      ? 'Current work remains unsaved until you choose Save current snapshot.'
      : 'Select an active case to persist the current OSINT entity and observations.';
  }

  function setPending(message) {
    shell.badge.className = 'cmx-case-context-badge pending';
    shell.badge.textContent = 'Checking';
    shell.identity.textContent = message;
    shell.message.textContent = 'No research data is saved automatically.';
  }

  function updateSaveState() {
    const snapshot = readSnapshot();
    const fingerprint = source.textContent || '';
    const hasEntity = Boolean(snapshot?.entity?.value);
    const selected = Boolean(state.activeCaseId);
    const unsaved = fingerprint !== state.lastSavedFingerprint;

    shell.save.disabled = !state.backend || !selected || !hasEntity || state.saving || !unsaved;
    if (!state.backend) return;

    if (!selected) {
      shell.message.textContent = 'Select an active case to persist the current OSINT entity and observations.';
    } else if (!hasEntity) {
      shell.message.textContent = 'Analyze an entity before saving a case snapshot.';
    } else if (!unsaved) {
      shell.message.textContent = 'The current OSINT snapshot is saved to the selected case.';
    } else {
      shell.message.textContent = 'Unsaved OSINT work is ready for the selected case.';
    }
  }

  async function saveSnapshot() {
    const snapshot = readSnapshot();
    if (!state.backend || !state.activeCaseId || !snapshot?.entity?.value || state.saving) return;

    state.saving = true;
    shell.save.disabled = true;
    shell.save.textContent = 'Saving…';
    shell.message.textContent = 'Creating or linking the entity and writing case observations.';

    try {
      const entity = await ensureEntity(snapshot.entity);
      let written = 0;

      if (Array.isArray(snapshot.dns) && snapshot.dns.length) {
        await postJson(`/api/cases/${encodeURIComponent(state.activeCaseId)}/observations`, {
          entity_id: entity.id,
          kind: 'dns_snapshot',
          value_text: boundedJson(buildDnsSnapshot(snapshot), 19000),
          note: `Resolver path: ${snapshot.dnsSource || 'unspecified'}`,
          confidence: 'high',
          observed_at: new Date().toISOString()
        });
        written += 1;
      }

      const observations = Array.isArray(snapshot.observations)
        ? snapshot.observations.slice(0, MAX_SESSION_OBSERVATIONS)
        : [];
      for (const observation of observations) {
        await postJson(`/api/cases/${encodeURIComponent(state.activeCaseId)}/observations`, {
          entity_id: entity.id,
          kind: normalizeKind(`osint_${observation.kind || 'observation'}`),
          value_text: String(observation.value || snapshot.entity.value).slice(0, 20000),
          note: `${observation.source ? `Source: ${observation.source}. ` : ''}${observation.note || ''}`.slice(0, 20000),
          confidence: normalizeConfidence(snapshot.entity.confidence),
          observed_at: observation.timestamp || new Date().toISOString()
        });
        written += 1;
      }

      state.lastSavedFingerprint = source.textContent || '';
      shell.message.textContent = `Saved the current entity and ${written} observation${written === 1 ? '' : 's'} to the active case.`;
    } catch (error) {
      shell.message.textContent = error instanceof Error ? error.message : 'The case snapshot could not be saved.';
    } finally {
      state.saving = false;
      shell.save.textContent = 'Save current snapshot';
      updateSaveState();
    }
  }

  async function ensureEntity(entity) {
    const path = `/api/cases/${encodeURIComponent(state.activeCaseId)}/entities`;
    const payload = {
      entity_type: normalizeKind(entity.type || 'unknown'),
      normalized_value: String(entity.value).slice(0, 5000),
      display_value: String(entity.input || entity.value).slice(0, 5000),
      confidence: normalizeConfidence(entity.confidence),
      attributes: {
        inference_scope: String(entity.scope || '').slice(0, 2000),
        analyzed_at: entity.analyzedAt || null,
        analyst_context: String(entity.notes || '').slice(0, 2000),
        origin_tool: 'cmx-osint'
      }
    };

    const response = await fetch(path, writeOptions(payload));
    if (response.status === 201) return response.json();
    if (response.status !== 409) throw await responseError(response, 'Entity could not be saved');

    const existingResponse = await fetch(`${path}?limit=500`, {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { accept: 'application/json' }
    });
    if (!existingResponse.ok) throw await responseError(existingResponse, 'Existing entity could not be resolved');
    const records = await existingResponse.json();
    const existing = records.find((record) =>
      record.entity_type === payload.entity_type
      && record.normalized_value === payload.normalized_value
    );
    if (!existing) throw new Error('The entity already exists but could not be matched safely.');
    return existing;
  }

  function buildDnsSnapshot(snapshot) {
    return {
      schema: 'cmx-dns-snapshot-v1',
      captured_at: new Date().toISOString(),
      entity: snapshot.entity?.value || '',
      resolver_path: snapshot.dnsSource || '',
      questions: snapshot.dns.map((record) => ({
        query: record.query,
        source: record.source,
        queried_at: record.queriedAt,
        cache_hit: record.cacheHit === true,
        status: record.statusLabel,
        authenticated_data: record.authenticatedData === true,
        truncated: record.truncated === true,
        answers: record.answers
      }))
    };
  }

  async function postJson(path, payload) {
    const response = await fetch(path, writeOptions(payload));
    if (!response.ok) throw await responseError(response, 'Case observation could not be saved');
    return response.json();
  }

  function writeOptions(payload) {
    return {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  }

  async function responseError(response, fallback) {
    try {
      const payload = await response.json();
      return new Error(`${fallback}: ${payload.detail || `HTTP ${response.status}`}`);
    } catch {
      return new Error(`${fallback}: HTTP ${response.status}`);
    }
  }

  function readSnapshot() {
    try {
      return JSON.parse(source.textContent || '{}');
    } catch {
      return null;
    }
  }

  function normalizeKind(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80) || 'unknown';
  }

  function normalizeConfidence(value) {
    const normalized = String(value || '').toLowerCase();
    const allowed = new Set(['unrated', 'low', 'limited', 'medium', 'strong', 'high', 'confirmed']);
    return allowed.has(normalized) ? normalized : 'unrated';
  }

  function boundedJson(value, limit) {
    const serialized = JSON.stringify(value);
    if (serialized.length <= limit) return serialized;
    return JSON.stringify({
      schema: value.schema,
      captured_at: value.captured_at,
      entity: value.entity,
      resolver_path: value.resolver_path,
      truncated: true,
      original_character_count: serialized.length,
      questions: value.questions.slice(0, 6)
    }).slice(0, limit);
  }

  function option(value, label) {
    const item = document.createElement('option');
    item.value = value;
    item.textContent = label;
    return item;
  }

  function safeSessionGet(key) {
    try {
      return sessionStorage.getItem(key) || '';
    } catch {
      return '';
    }
  }

  function safeSessionSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Session continuity is optional.
    }
  }

  function safeSessionDelete(key) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Session continuity is optional.
    }
  }
})();
