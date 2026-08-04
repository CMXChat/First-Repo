(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = {
    connected: false,
    busy: false,
    activeCases: [],
    retentionDue: [],
    deletedCases: [],
    audit: [],
    pendingAction: null,
    pendingCase: null
  };

  const els = {
    status: $('#lifecycleStatus'),
    statusCopy: $('#lifecycleStatusCopy'),
    refresh: $('#refreshLifecycle'),
    retentionCount: $('#retentionCount'),
    retentionList: $('#retentionList'),
    deletedCount: $('#deletedCount'),
    deletedList: $('#deletedList'),
    auditCase: $('#auditCase'),
    loadAudit: $('#loadAudit'),
    auditList: $('#auditList'),
    dialog: $('#lifecycleDialog'),
    dialogTitle: $('#dialogTitle'),
    dialogCopy: $('#dialogCopy'),
    confirmation: $('#lifecycleConfirmation'),
    reason: $('#lifecycleReason'),
    confirmAction: $('#confirmLifecycleAction'),
    cancelAction: $('#cancelLifecycleAction'),
    toast: $('#toast')
  };

  initialize();

  function initialize() {
    bindEvents();
    checkBackend();
  }

  function bindEvents() {
    els.refresh.addEventListener('click', refreshAll);
    els.loadAudit.addEventListener('click', loadAudit);
    els.cancelAction.addEventListener('click', closeDialog);
    els.confirmAction.addEventListener('click', submitLifecycleAction);
    els.dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog();
    });
  }

  async function checkBackend() {
    setBusy(true);
    try {
      const identity = await api('/api/whoami');
      state.connected = true;
      els.status.className = 'life-badge good';
      els.status.textContent = 'Backend connected';
      els.statusCopy.textContent = `Lifecycle records are scoped to ${identity.email || identity.subject}.`;
    } catch {
      state.connected = false;
      els.status.className = 'life-badge warn';
      els.status.textContent = 'Protected backend unavailable';
      els.statusCopy.textContent = 'This lifecycle workspace requires the FastAPI platform entry point.';
    } finally {
      setBusy(false);
    }
    if (state.connected) await refreshAll();
  }

  async function refreshAll() {
    if (!state.connected || state.busy) return;
    setBusy(true);
    try {
      const [activeCases, retentionDue, deletedCases] = await Promise.all([
        api('/api/cases?limit=200'),
        api('/api/cases/retention-due?limit=500'),
        api('/api/cases/deleted?limit=200')
      ]);
      state.activeCases = activeCases;
      state.retentionDue = retentionDue;
      state.deletedCases = deletedCases;
      renderActiveCaseOptions();
      renderRetention();
      renderDeleted();
      if (els.auditCase.value) await loadAudit(false);
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  function renderActiveCaseOptions() {
    const selected = els.auditCase.value;
    els.auditCase.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select an active case';
    els.auditCase.appendChild(placeholder);
    state.activeCases.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = `${item.title} · ${item.status}`;
      els.auditCase.appendChild(option);
    });
    if (state.activeCases.some((item) => item.id === selected)) els.auditCase.value = selected;
  }

  function renderRetention() {
    els.retentionList.replaceChildren();
    els.retentionCount.textContent = String(state.retentionDue.length);
    if (!state.retentionDue.length) return appendEmpty(els.retentionList, 'No active cases are currently due for retention review.');

    state.retentionDue.forEach((item) => {
      const card = caseCard(item, 'Retention review due');
      const actions = card.querySelector('.life-actions');
      const open = button('Open case workspace', 'cmx-button');
      open.addEventListener('click', () => window.location.assign('/cases'));
      actions.appendChild(open);
      els.retentionList.appendChild(card);
    });
  }

  function renderDeleted() {
    els.deletedList.replaceChildren();
    els.deletedCount.textContent = String(state.deletedCases.length);
    if (!state.deletedCases.length) return appendEmpty(els.deletedList, 'No soft-deleted cases are awaiting restore or purge.');

    state.deletedCases.forEach((item) => {
      const card = caseCard(item, 'Soft deleted');
      const actions = card.querySelector('.life-actions');
      const restore = button('Restore', 'cmx-button good');
      restore.addEventListener('click', () => openDialog('restore', item));
      const purge = button('Permanently purge', 'cmx-button danger');
      purge.addEventListener('click', () => openDialog('purge', item));
      actions.append(restore, purge);
      els.deletedList.appendChild(card);
    });
  }

  async function loadAudit(manageBusy = true) {
    const caseId = els.auditCase.value;
    if (!caseId || !state.connected) {
      state.audit = [];
      renderAudit();
      return;
    }
    if (manageBusy && state.busy) return;
    if (manageBusy) setBusy(true);
    try {
      state.audit = await api(`/api/cases/${encodeURIComponent(caseId)}/audit?limit=500`);
      renderAudit();
    } catch (error) {
      notify(error.message);
    } finally {
      if (manageBusy) setBusy(false);
    }
  }

  function renderAudit() {
    els.auditList.replaceChildren();
    if (!state.audit.length) return appendEmpty(els.auditList, 'Select a case to review its operational audit events.');

    state.audit.forEach((event) => {
      const item = document.createElement('article');
      item.className = 'life-audit-item';
      const title = document.createElement('strong');
      title.textContent = event.action;
      const meta = document.createElement('p');
      meta.textContent = `${new Date(event.created_at).toLocaleString()} · ${event.object_type} · ${event.object_id || 'case'} · request ${event.request_id || '—'}`;
      const details = document.createElement('p');
      details.textContent = Object.keys(event.details || {}).length
        ? JSON.stringify(event.details)
        : 'No additional operational details.';
      item.append(title, meta, details);
      els.auditList.appendChild(item);
    });
  }

  function caseCard(item, label) {
    const card = document.createElement('article');
    card.className = 'life-item';
    const head = document.createElement('div');
    head.className = 'life-item-head';
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.title;
    const id = document.createElement('p');
    id.textContent = item.id;
    copy.append(title, id);
    const badge = document.createElement('span');
    badge.className = `life-badge ${label.includes('due') ? 'warn' : 'bad'}`;
    badge.textContent = label;
    head.append(copy, badge);

    const badges = document.createElement('div');
    badges.className = 'life-badges';
    badges.append(
      smallBadge(item.case_type),
      smallBadge(item.status),
      smallBadge(item.urgency),
      smallBadge(item.retention_until ? `Retention ${new Date(item.retention_until).toLocaleString()}` : 'No retention date')
    );
    const actions = document.createElement('div');
    actions.className = 'life-actions';
    card.append(head, badges, actions);
    return card;
  }

  function openDialog(action, item) {
    state.pendingAction = action;
    state.pendingCase = item;
    els.confirmation.value = '';
    els.reason.value = '';
    els.dialogTitle.textContent = action === 'restore' ? 'Restore soft-deleted case' : 'Permanently purge case';
    els.dialogCopy.textContent = action === 'restore'
      ? `Type the exact case ID to restore “${item.title}”.`
      : `Type the exact case ID to permanently delete “${item.title}” and all linked records. This cannot be undone.`;
    els.confirmAction.textContent = action === 'restore' ? 'Restore case' : 'Permanently purge';
    els.confirmAction.className = action === 'restore' ? 'cmx-button good' : 'cmx-button danger';
    els.dialog.showModal();
    els.confirmation.focus();
  }

  function closeDialog() {
    state.pendingAction = null;
    state.pendingCase = null;
    if (els.dialog.open) els.dialog.close();
  }

  async function submitLifecycleAction() {
    if (!state.pendingAction || !state.pendingCase || state.busy) return;
    const confirmation = els.confirmation.value.trim();
    const reason = els.reason.value.trim();
    if (confirmation !== state.pendingCase.id) return notify('Confirmation must exactly match the case ID.');
    if (!reason) return notify('Record a reason for this lifecycle action.');
    if (state.pendingAction === 'purge' && !window.confirm('Final confirmation: permanently purge this soft-deleted case?')) return;

    setBusy(true);
    try {
      await api(`/api/cases/${encodeURIComponent(state.pendingCase.id)}/${state.pendingAction}`, {
        method: 'POST',
        body: { confirmation, reason }
      });
      const completed = state.pendingAction;
      closeDialog();
      notify(completed === 'restore' ? 'Case restored.' : 'Case permanently purged.');
      await refreshAllAfterMutation();
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function refreshAllAfterMutation() {
    const [activeCases, retentionDue, deletedCases] = await Promise.all([
      api('/api/cases?limit=200'),
      api('/api/cases/retention-due?limit=500'),
      api('/api/cases/deleted?limit=200')
    ]);
    state.activeCases = activeCases;
    state.retentionDue = retentionDue;
    state.deletedCases = deletedCases;
    state.audit = [];
    renderActiveCaseOptions();
    renderRetention();
    renderDeleted();
    renderAudit();
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
          ...(options.body ? { 'content-type': 'application/json' } : {})
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
      if (!contentType.includes('application/json')) throw new Error('The lifecycle API is unavailable on this host.');
      return payload;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('The lifecycle API timed out.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function setBusy(busy) {
    state.busy = busy;
    els.refresh.disabled = busy || !state.connected;
    els.loadAudit.disabled = busy || !state.connected;
    els.confirmAction.disabled = busy;
    els.cancelAction.disabled = busy;
    document.querySelectorAll('.life-actions button').forEach((item) => { item.disabled = busy; });
  }

  function appendEmpty(container, message) {
    const empty = document.createElement('div');
    empty.className = 'life-empty';
    empty.textContent = message;
    container.appendChild(empty);
  }

  function smallBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'life-badge';
    badge.textContent = String(text);
    return badge;
  }

  function button(text, className) {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    element.textContent = text;
    return element;
  }

  let toastTimer;
  function notify(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2600);
  }
})();
