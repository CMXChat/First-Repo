(() => {
  'use strict';

  const ACTIVE_CASE_KEY = 'cmx_active_case_v1';
  const ROUTES = {
    '/osint': {
      label: 'OSINT',
      schema: 'cmx-osint-session-v1',
      sourceSelector: '#caseJson',
      ready: (snapshot) => Boolean(snapshot?.entity?.value),
      emptyMessage: 'Analyze an entity before saving a case snapshot.',
      selectedMessage: 'Select an active case to persist the current OSINT entity and observations.',
      busyMessage: 'DNS collection is still running. Saving will unlock when the snapshot is complete.',
      busy: () => {
        const refresh = document.querySelector('#dnsRefresh');
        const section = document.querySelector('#dnsSection');
        return Boolean(refresh && section && !section.classList.contains('osint-hidden') && refresh.disabled);
      },
      watchSelectors: ['#caseJson', '#dnsRefresh']
    },
    '/phone': {
      label: 'Phone',
      schema: 'cmx-phone-session-v1',
      sourceSelector: '#phoneJson',
      ready: (snapshot) => Boolean(snapshot?.phone?.e164),
      emptyMessage: 'Normalize a phone number before saving a case snapshot.',
      selectedMessage: 'Select an active case to persist the normalized phone record and observation log.',
      watchSelectors: ['#phoneJson']
    },
    '/search': {
      label: 'Search',
      schema: 'cmx-search-session-v1',
      exportButtonSelector: '#exportLog',
      ready: (snapshot) => Array.isArray(snapshot?.entries) && snapshot.entries.length > 0,
      emptyMessage: 'Save at least one generated query to the session research log before saving.',
      selectedMessage: 'Select an active case to persist the saved search queries.',
      captureCancelledMessage: 'The Search export was cancelled or produced no valid session payload.',
      watchSelectors: ['#logBody', '#exportLog']
    },
    '/metadata': {
      label: 'Metadata',
      schema: 'cmx-metadata-session-v1',
      exportButtonSelector: '#exportAll',
      ready: (snapshot) => Array.isArray(snapshot?.entries) && snapshot.entries.length > 0,
      emptyMessage: 'Finish inspecting at least one file before saving metadata evidence.',
      selectedMessage: 'Select an active case to persist the current metadata registrations.',
      captureCancelledMessage: 'The Metadata export produced no valid session payload.',
      watchSelectors: ['#fileList', '#exportAll', '#progressLabel']
    },
    '/missing': {
      label: 'Missing Person',
      schema: 'cmx-missing-case-v1',
      sourceSelector: '#caseJson',
      ready: (snapshot) => Boolean(snapshot?.case?.subjectLabel && snapshot?.case?.authorizationBasis),
      emptyMessage: 'Save the case header and authorization basis before persisting this handoff.',
      selectedMessage: 'Select an active case to persist the missing-person header and records.',
      watchSelectors: ['#caseJson']
    }
  };

  const state = {
    backend: false,
    identity: null,
    cases: [],
    activeCaseId: '',
    lastSavedFingerprint: '',
    lastSaveMessage: '',
    saving: false
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  function boot() {
    const path = normalizePath(window.location.pathname);
    const config = ROUTES[path];
    const topbar = document.querySelector('.cmx-tool-topbar');
    if (!config || !topbar || document.querySelector('.cmx-case-context')) return;

    const shell = buildShell();
    topbar.insertAdjacentElement('afterend', shell.root);

    shell.select.addEventListener('change', selectCase);
    shell.save.addEventListener('click', saveSnapshot);
    shell.refresh.addEventListener('click', loadContext);
    shell.openCases.addEventListener('click', () => {
      window.location.href = state.activeCaseId
        ? `/cases?case=${encodeURIComponent(state.activeCaseId)}`
        : '/cases';
    });

    installObservers(config, updateSaveState);
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
      select.appendChild(option('', 'No persistent case selected'));
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
        setLocalOnly();
      } finally {
        shell.refresh.disabled = false;
        updateSaveState();
      }
    }

    function setLocalOnly() {
      state.backend = false;
      state.identity = null;
      state.cases = [];
      state.activeCaseId = '';
      state.lastSavedFingerprint = '';
      state.lastSaveMessage = '';
      shell.select.replaceChildren(option('', 'Local-only mode'));
      shell.select.disabled = true;
      shell.save.disabled = true;
      shell.badge.className = 'cmx-case-context-badge local';
      shell.badge.textContent = 'Local-only';
      shell.identity.textContent = 'FastAPI case persistence is unavailable on this hostname.';
      shell.message.textContent = 'Continue locally or export JSON. Nothing will be written to a case.';
    }

    function renderCases() {
      shell.select.replaceChildren(option('', 'Select a persistent case'));
      state.cases.forEach((record) => {
        shell.select.appendChild(option(record.id, `${record.title} · ${record.status}`));
      });

      const requested = new URLSearchParams(window.location.search).get('case') || '';
      const remembered = safeSessionGet(ACTIVE_CASE_KEY);
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
      if (!state.cases.length) shell.select.replaceChildren(option('', 'Create a case in CMX Cases'));
    }

    function selectCase() {
      state.activeCaseId = shell.select.value;
      state.lastSavedFingerprint = '';
      state.lastSaveMessage = '';
      if (state.activeCaseId) safeSessionSet(ACTIVE_CASE_KEY, state.activeCaseId);
      else safeSessionDelete(ACTIVE_CASE_KEY);
      updateSaveState();
    }

    function setProtected() {
      const identityLabel = state.identity?.email
        || state.identity?.name
        || state.identity?.subject
        || 'Authenticated operator';
      shell.badge.className = 'cmx-case-context-badge protected';
      shell.badge.textContent = 'Protected';
      shell.identity.textContent = identityLabel;
    }

    function setPending(message) {
      shell.badge.className = 'cmx-case-context-badge pending';
      shell.badge.textContent = 'Checking';
      shell.identity.textContent = message;
      shell.message.textContent = 'No research data is saved automatically.';
    }

    function updateSaveState() {
      const available = snapshotAvailable(config);
      const selected = Boolean(state.activeCaseId);
      const collecting = Boolean(config.busy?.());
      const fingerprint = currentFingerprint(config);
      const unsaved = fingerprint !== state.lastSavedFingerprint;

      shell.save.disabled = !state.backend
        || !selected
        || !available
        || collecting
        || state.saving
        || !unsaved;
      if (!state.backend) return;

      if (!selected) {
        shell.message.textContent = config.selectedMessage;
      } else if (!available) {
        shell.message.textContent = config.emptyMessage;
      } else if (collecting) {
        shell.message.textContent = config.busyMessage || `${config.label} collection is still running.`;
      } else if (!unsaved) {
        shell.message.textContent = state.lastSaveMessage || `The current ${config.label} snapshot is saved to the selected case.`;
      } else {
        shell.message.textContent = `Unsaved ${config.label} work is ready for the selected case.`;
      }
    }

    async function saveSnapshot() {
      if (!state.backend || !state.activeCaseId || state.saving || config.busy?.()) return;

      state.saving = true;
      shell.save.disabled = true;
      shell.save.textContent = 'Saving…';
      shell.message.textContent = `Preparing the complete ${config.label} snapshot for one case transaction.`;

      try {
        const snapshot = await readSnapshot(config);
        if (snapshot?.schema !== config.schema || !config.ready(snapshot)) {
          throw new Error(config.captureCancelledMessage || config.emptyMessage);
        }

        shell.message.textContent = `Writing the complete ${config.label} snapshot as one case transaction.`;
        const result = await postJson(
          `/api/cases/${encodeURIComponent(state.activeCaseId)}/imports`,
          { payload: snapshot }
        );
        const counts = [
          ['entity', result.entities_created],
          ['observation', result.observations_created],
          ['source', result.sources_created],
          ['query', result.queries_created],
          ['evidence item', result.evidence_created],
          ['note', result.notes_created]
        ]
          .filter(([, count]) => Number(count) > 0)
          .map(([label, count]) => `${count} ${label}${Number(count) === 1 ? '' : 's'}`);
        const warningCount = Array.isArray(result.warnings) ? result.warnings.length : 0;
        state.lastSavedFingerprint = currentFingerprint(config);
        state.lastSaveMessage = `Saved ${counts.join(', ') || 'the current snapshot'} to the active case${warningCount ? ` with ${warningCount} warning${warningCount === 1 ? '' : 's'}` : ''}.`;
      } catch (error) {
        state.lastSaveMessage = '';
        shell.message.textContent = error instanceof Error
          ? error.message
          : 'The case snapshot could not be saved.';
      } finally {
        state.saving = false;
        shell.save.textContent = 'Save current snapshot';
        updateSaveState();
      }
    }
  }

  function installObservers(config, callback) {
    const observer = new MutationObserver(callback);
    config.watchSelectors.forEach((selector) => {
      const target = document.querySelector(selector);
      if (!target) return;
      observer.observe(target, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    });
    document.addEventListener('input', callback, true);
    document.addEventListener('change', callback, true);
    document.addEventListener('cmx-case-snapshot-change', callback);
  }

  function snapshotAvailable(config) {
    if (config.sourceSelector) {
      const snapshot = parseJson(document.querySelector(config.sourceSelector)?.textContent || '');
      return snapshot?.schema === config.schema && config.ready(snapshot);
    }
    const button = document.querySelector(config.exportButtonSelector);
    return Boolean(button && !button.disabled);
  }

  async function readSnapshot(config) {
    if (config.sourceSelector) {
      return parseJson(document.querySelector(config.sourceSelector)?.textContent || '');
    }
    return captureExportPayload(document.querySelector(config.exportButtonSelector));
  }

  function currentFingerprint(config) {
    if (config.sourceSelector) {
      return document.querySelector(config.sourceSelector)?.textContent || '';
    }
    const button = document.querySelector(config.exportButtonSelector);
    const values = config.watchSelectors.map((selector) => {
      const element = document.querySelector(selector);
      return element?.textContent || '';
    });
    values.push(button?.disabled ? 'disabled' : 'enabled');
    return values.join('\n--cmx-case-state--\n');
  }

  async function captureExportPayload(button) {
    if (!button || button.disabled) return null;

    const originalCreateObjectUrl = URL.createObjectURL;
    const originalRevokeObjectUrl = URL.revokeObjectURL;
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    let capturedBlob = null;
    let capturedUrl = '';

    try {
      URL.createObjectURL = (blob) => {
        if (blob instanceof Blob) capturedBlob = blob;
        capturedUrl = `blob:cmx-case-capture-${Date.now()}`;
        return capturedUrl;
      };
      URL.revokeObjectURL = () => {};
      HTMLAnchorElement.prototype.click = function suppressCapturedDownload() {
        const href = this.getAttribute('href') || this.href || '';
        if (capturedUrl && href === capturedUrl) return;
        return originalAnchorClick.call(this);
      };

      button.click();
      await Promise.resolve();
    } finally {
      URL.createObjectURL = originalCreateObjectUrl;
      URL.revokeObjectURL = originalRevokeObjectUrl;
      HTMLAnchorElement.prototype.click = originalAnchorClick;
    }

    if (!(capturedBlob instanceof Blob)) return null;
    return parseJson(await capturedBlob.text());
  }

  async function postJson(path, payload) {
    const response = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw await responseError(response, 'Case snapshot could not be saved');
    return response.json();
  }

  async function responseError(response, fallback) {
    try {
      const payload = await response.json();
      const detail = typeof payload.detail === 'string'
        ? payload.detail
        : JSON.stringify(payload.detail || {});
      return new Error(`${fallback}: ${detail || `HTTP ${response.status}`}`);
    } catch {
      return new Error(`${fallback}: HTTP ${response.status}`);
    }
  }

  function parseJson(value) {
    try {
      return JSON.parse(value || '{}');
    } catch {
      return null;
    }
  }

  function option(value, label) {
    const item = document.createElement('option');
    item.value = value;
    item.textContent = label;
    return item;
  }

  function normalizePath(value) {
    if (!value) return '/';
    const path = value.replace(/\/index\.html$/i, '/');
    return path === '/' ? '/' : path.replace(/\/+$/, '');
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
