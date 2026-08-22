(() => {
  'use strict';

  const api = window.CMXOperatorApi;
  if (!api) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    root: $('libraryServerProof'),
    badge: $('libraryServerBadge'),
    state: $('libraryServerState'),
    detail: $('libraryServerDetail'),
    unlockForm: $('libraryUnlockForm'),
    operatorKey: $('libraryOperatorKey'),
    unlockSubmit: $('libraryUnlockSubmit'),
    unlockError: $('libraryUnlockError'),
    retry: $('librarySessionRetry'),
    logout: $('librarySessionLogout'),
    unavailable: $('libraryServerUnavailable'),
    workspace: $('libraryServerWorkspace'),
    list: $('libraryServerList'),
    count: $('libraryServerCount'),
    refresh: $('libraryServerRefresh'),
    createForm: $('libraryServerCreateForm'),
    createTitle: $('libraryServerCreateTitle'),
    createKind: $('libraryServerCreateKind'),
    createSource: $('libraryServerCreateSource'),
    createSubmit: $('libraryServerCreateSubmit'),
    detailPane: $('libraryServerDetailPane'),
    selectedTitle: $('libraryServerSelectedTitle'),
    selectedMeta: $('libraryServerSelectedMeta'),
    editor: $('libraryServerEditor'),
    editorRevision: $('libraryServerEditorRevision'),
    editorStatus: $('libraryServerEditorStatus'),
    saveDraft: $('libraryServerSaveDraft'),
    freezeVersion: $('libraryServerFreezeVersion'),
    conflict: $('libraryServerConflict'),
    conflictCopy: $('libraryServerConflictCopy'),
    reloadDraft: $('libraryServerReloadDraft'),
    versions: $('libraryServerVersions'),
    immutableProof: $('libraryImmutableProof'),
  };

  if (!els.root) return;

  const state = {
    listing: null,
    details: null,
    selectedId: null,
    editorRevision: null,
    lastFrozen: null,
    busy: false,
    conflictLatest: null,
  };

  const esc = (value) => String(value ?? '').replace(/[&<>\'\"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));

  function classifyFailure(error) {
    const kind = api.classify(error);
    if (kind === 'locked') return ['locked', 'Backend locked', 'Enter the operator key to open the protected Library session.'];
    if (kind === 'forbidden') return ['denied', 'Browser Origin denied', 'The backend rejected this page Origin. Protected writes will not be bypassed.'];
    if (kind === 'network') return ['offline', 'Backend unreachable', 'This browser could not reach the protected API.'];
    if (kind === 'not_deployed_or_missing') return ['not-deployed', 'Library backend not deployed here', 'The protected Library contract exists in stacked source, but this environment did not expose the requested route.'];
    if (kind === 'unavailable') return ['unavailable', 'Protected Library unavailable', error?.message || 'The backend cannot serve this protected Library right now.'];
    return ['error', 'Library request failed', error?.message || 'The protected backend returned an unexpected error.'];
  }

  function setState(kind, headline, detail) {
    els.root.dataset.state = kind;
    els.badge.dataset.state = kind;
    els.badge.textContent = kind.replaceAll('-', ' ').toUpperCase();
    els.state.textContent = headline;
    els.detail.textContent = detail || '';
    const unlockable = kind === 'locked';
    els.unlockForm.hidden = !unlockable;
    els.logout.hidden = kind !== 'connected';
    els.retry.hidden = !['denied', 'offline', 'not-deployed', 'unavailable', 'error'].includes(kind);
    els.workspace.hidden = kind !== 'connected';
    els.unavailable.hidden = !['denied', 'offline', 'not-deployed', 'unavailable', 'error'].includes(kind);
    if (!els.unavailable.hidden) els.unavailable.textContent = detail || headline;
  }

  function expiryText(session) {
    const value = Date.parse(session?.expires_at || '');
    if (!Number.isFinite(value)) return 'Protected cookie session is active. Canonical content remains on the backend.';
    return `Protected cookie session active until ${new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}. Canonical content remains on the backend.`;
  }

  function contentItems() {
    const items = Array.isArray(state.listing?.items) ? state.listing.items : [];
    return items.filter((item) => item?.item_type === 'content');
  }

  function renderList() {
    const items = contentItems();
    els.count.textContent = String(items.length);
    els.list.innerHTML = items.map((item) => {
      const selected = item.stable_id === state.selectedId;
      const version = item.current_version_number ? `v${item.current_version_number}` : 'no frozen version';
      const revision = item.draft_revision ? `Draft r${item.draft_revision}` : 'Draft';
      return `<button type="button" class="lib-server-item" data-library-content-id="${esc(item.stable_id)}" aria-current="${selected}">
        <span class="lib-server-item-main"><strong>${esc(item.display_name)}</strong><small>${esc(item.kind)} · ${esc(revision)}</small></span>
        <span class="lib-server-item-side"><b>${esc(version)}</b><small>${Number(item.used_by_count || 0)} uses</small></span>
      </button>`;
    }).join('') || '<div class="lib-server-empty">No protected Library content exists yet. Create a note to prove durable memory.</div>';
  }

  function detailsVersion(version) {
    if (!version) return '';
    return `<details class="lib-server-version" data-version-id="${esc(version.id)}">
      <summary><span><strong>Version ${esc(version.version_number)}</strong><small>Draft r${esc(version.draft_revision)} · immutable</small></span><code>${esc(String(version.checksum_sha256 || '').slice(0, 12))}…</code></summary>
      <pre>${esc(version.source_text)}</pre>
      <footer><span>ContentVersion ${esc(version.id)}</span><span>${esc(version.created_by || 'operator')}</span></footer>
    </details>`;
  }

  function renderImmutableProof() {
    const frozen = state.lastFrozen;
    const current = state.details?.draft;
    if (!frozen || !current) {
      els.immutableProof.hidden = true;
      els.immutableProof.textContent = '';
      return;
    }
    const diverged = frozen.source_text !== current.source_text || Number(frozen.draft_revision) !== Number(current.revision);
    els.immutableProof.hidden = false;
    els.immutableProof.dataset.proof = diverged ? 'diverged' : 'frozen';
    els.immutableProof.innerHTML = diverged
      ? `<strong>Immutable proof</strong><span>Draft r${esc(current.revision)} changed after Version ${esc(frozen.version_number)} was frozen. Version ${esc(frozen.version_number)} still contains its original source and checksum.</span>`
      : `<strong>Frozen snapshot</strong><span>Version ${esc(frozen.version_number)} captured Draft r${esc(frozen.draft_revision)}. Change the Draft next; this Version must remain unchanged.</span>`;
  }

  function renderDetails({ keepEditor = false } = {}) {
    const details = state.details;
    if (!details) {
      els.detailPane.hidden = true;
      return;
    }
    els.detailPane.hidden = false;
    const asset = details.asset || {};
    const draft = details.draft || {};
    els.selectedTitle.textContent = asset.title || 'Untitled';
    els.selectedMeta.innerHTML = `<span>ContentAsset <code>${esc(asset.id)}</code></span><span>${esc(asset.kind)} · ${esc(asset.visibility)}</span><span>${Number(details.dependency_count || 0)} protected Automation reference${Number(details.dependency_count || 0) === 1 ? '' : 's'}</span>`;
    if (!keepEditor) {
      els.editor.value = draft.source_text || '';
      state.editorRevision = draft.revision || 1;
      state.conflictLatest = null;
      els.conflict.hidden = true;
    }
    els.editorRevision.textContent = `Editing from Draft r${state.editorRevision ?? draft.revision ?? '—'}`;
    els.editorStatus.textContent = `Server Draft r${draft.revision ?? '—'} · ${Array.isArray(details.versions) ? details.versions.length : 0} immutable version${Array.isArray(details.versions) && details.versions.length === 1 ? '' : 's'}`;
    const dirty = els.editor.value !== (draft.source_text || '') || Number(state.editorRevision) !== Number(draft.revision);
    els.freezeVersion.disabled = state.busy || dirty;
    els.saveDraft.disabled = state.busy || !els.editor.value.trim();
    els.versions.innerHTML = (Array.isArray(details.versions) ? details.versions : []).map(detailsVersion).join('') || '<div class="lib-server-empty">No immutable ContentVersion exists yet.</div>';
    renderImmutableProof();
  }

  async function loadDetails(contentId, { keepEditor = false } = {}) {
    const details = await api.getContent(contentId);
    state.details = details;
    state.selectedId = details?.asset?.id || contentId;
    renderList();
    renderDetails({ keepEditor });
    return details;
  }

  async function loadLibrary({ select = true } = {}) {
    const listing = await api.listLibrary();
    state.listing = listing;
    const ids = contentItems().map((item) => item.stable_id);
    if (!ids.includes(state.selectedId)) state.selectedId = ids[0] || null;
    renderList();
    if (select && state.selectedId) await loadDetails(state.selectedId);
    if (!state.selectedId) {
      state.details = null;
      renderDetails();
    }
  }

  async function bootProtectedLibrary() {
    setState('checking', 'Checking protected session…', 'Library uses the shared operator cookie and CSRF contract used by Email, Requests and Directory.');
    try {
      const session = await api.session({ refresh: true });
      setState('checking', 'Protected session connected', 'Checking whether this environment exposes the stacked Library routes…');
      await loadLibrary();
      setState('connected', 'Protected Library connected', expiryText(session));
    } catch (error) {
      const [kind, headline, detail] = classifyFailure(error);
      setState(kind, headline, detail);
    }
  }

  els.unlockForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const key = els.operatorKey.value;
    els.operatorKey.value = '';
    els.unlockError.textContent = '';
    if (!key) {
      els.unlockError.textContent = 'Enter the operator key.';
      els.operatorKey.focus();
      return;
    }
    els.unlockSubmit.disabled = true;
    setState('checking', 'Unlocking protected backend…', 'The operator key is sent directly to the backend and is not stored by this page.');
    try {
      const session = await api.unlock(key);
      await loadLibrary();
      setState('connected', 'Protected Library connected', expiryText(session));
    } catch (error) {
      const [kind, headline, detail] = classifyFailure(error);
      setState(kind, headline, detail);
      els.unlockError.textContent = error?.status === 401 ? 'Operator key was not accepted.' : (error?.message || 'Unlock failed.');
    } finally {
      els.unlockSubmit.disabled = false;
    }
  });

  els.retry.addEventListener('click', bootProtectedLibrary);

  els.logout.addEventListener('click', async () => {
    els.logout.disabled = true;
    try {
      await api.logout();
      state.listing = null;
      state.details = null;
      state.selectedId = null;
      setState('locked', 'Protected session ended', 'Unlock again before reading or changing protected Library content.');
    } catch (error) {
      if (api.classify(error) === 'locked') setState('locked', 'Protected session already ended', 'Unlock again before reading or changing protected Library content.');
      else {
        const [kind, headline, detail] = classifyFailure(error);
        setState(kind, headline, detail);
      }
    } finally {
      els.logout.disabled = false;
    }
  });

  els.refresh.addEventListener('click', async () => {
    els.refresh.disabled = true;
    try {
      await loadLibrary();
    } catch (error) {
      const [kind, headline, detail] = classifyFailure(error);
      setState(kind, headline, detail);
    } finally {
      els.refresh.disabled = false;
    }
  });

  els.list.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-library-content-id]');
    if (!button) return;
    try {
      await loadDetails(button.dataset.libraryContentId);
    } catch (error) {
      const [kind, headline, detail] = classifyFailure(error);
      setState(kind, headline, detail);
    }
  });

  els.createForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = els.createTitle.value.trim();
    const source = els.createSource.value;
    if (!title || !source.trim()) return;
    els.createSubmit.disabled = true;
    try {
      const created = await api.createContent({
        kind: els.createKind.value,
        title,
        source_text: source,
        visibility: 'library',
      });
      state.selectedId = created?.asset?.id;
      state.lastFrozen = null;
      els.createTitle.value = '';
      els.createSource.value = '';
      await loadLibrary();
    } catch (error) {
      const [kind, headline, detail] = classifyFailure(error);
      setState(kind, headline, detail);
    } finally {
      els.createSubmit.disabled = false;
    }
  });

  els.editor.addEventListener('input', () => renderDetails({ keepEditor: true }));

  els.saveDraft.addEventListener('click', async () => {
    if (!state.details?.asset?.id || state.busy) return;
    state.busy = true;
    renderDetails({ keepEditor: true });
    const source = els.editor.value;
    const expectedRevision = Number(state.editorRevision || 1);
    try {
      const updated = await api.updateContentDraft(state.details.asset.id, {
        expected_revision: expectedRevision,
        source_text: source,
      });
      state.editorRevision = updated.revision;
      state.conflictLatest = null;
      els.conflict.hidden = true;
      await loadDetails(state.details.asset.id);
      await loadLibrary({ select: false });
      els.editorStatus.textContent = `Saved protected Draft r${updated.revision}`;
    } catch (error) {
      if (api.classify(error) === 'conflict') {
        const latest = await api.getContent(state.details.asset.id);
        state.details = latest;
        state.conflictLatest = latest;
        els.conflict.hidden = false;
        els.conflictCopy.textContent = `Nothing was overwritten. Your editor is based on Draft r${expectedRevision}, while the server is now Draft r${latest?.draft?.revision ?? '—'}. Reload the server Draft before saving again, then re-apply any changes you still want.`;
        renderDetails({ keepEditor: true });
      } else {
        const [kind, headline, detail] = classifyFailure(error);
        setState(kind, headline, detail);
      }
    } finally {
      state.busy = false;
      renderDetails({ keepEditor: true });
    }
  });

  els.reloadDraft.addEventListener('click', () => {
    if (!state.conflictLatest) return;
    state.details = state.conflictLatest;
    state.editorRevision = state.details?.draft?.revision || 1;
    els.editor.value = state.details?.draft?.source_text || '';
    state.conflictLatest = null;
    els.conflict.hidden = true;
    renderDetails();
  });

  els.freezeVersion.addEventListener('click', async () => {
    if (!state.details?.asset?.id || state.busy) return;
    state.busy = true;
    renderDetails({ keepEditor: true });
    try {
      const frozen = await api.saveContentVersion(state.details.asset.id);
      state.lastFrozen = Object.freeze({ ...frozen });
      await loadDetails(state.details.asset.id);
      await loadLibrary({ select: false });
      els.editorStatus.textContent = `Frozen immutable Version ${frozen.version_number} from Draft r${frozen.draft_revision}`;
    } catch (error) {
      const [kind, headline, detail] = classifyFailure(error);
      setState(kind, headline, detail);
    } finally {
      state.busy = false;
      renderDetails({ keepEditor: true });
    }
  });

  bootProtectedLibrary();
})();
