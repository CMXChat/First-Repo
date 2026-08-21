(() => {
  'use strict';

  const API = window.CMXDirectoryLabApi;
  if (!API) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  const initials = (name) => String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
  const relative = (iso) => {
    const value = Date.parse(iso || '');
    if (!Number.isFinite(value)) return '—';
    const age = Math.max(0, Date.now() - value);
    if (age < 60000) return 'now';
    if (age < 3600000) return `${Math.floor(age / 60000)}m`;
    if (age < 86400000) return `${Math.floor(age / 3600000)}h`;
    if (age < 604800000) return `${Math.floor(age / 86400000)}d`;
    return new Intl.DateTimeFormat(undefined, { month:'short', day:'numeric' }).format(new Date(value));
  };

  const state = {
    people: [],
    contacts: new Map(),
    selectedId: null,
    query: '',
    view: 'all',
    tab: 'overview',
    loading: true,
    contactsLoading: false,
    error: null,
    ready: false,
  };

  function peopleMode() {
    return $('[data-mode="people"]')?.getAttribute('aria-selected') === 'true';
  }

  function personById(id) {
    return state.people.find((person) => person.id === id) || null;
  }

  function contactsFor(id) {
    return state.contacts.get(id) || [];
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 3200);
  }

  function errorMessage(error) {
    if (error?.status === 401) return 'Private operator access is required. Unlock Check In, then reload Directory.';
    if (error?.status === 403) return error.message || 'This protected Directory mutation was rejected.';
    if (error?.status === 404) return 'The protected Directory API is not available in this environment yet.';
    return error?.message || 'Directory request failed.';
  }

  async function loadContacts(personId) {
    if (!personId) return;
    state.contactsLoading = true;
    if (peopleMode()) renderPeopleProjection();
    try {
      const contacts = await API.listContactMethods(personId);
      state.contacts.set(personId, Array.isArray(contacts) ? contacts : []);
    } catch (error) {
      state.contacts.set(personId, []);
      toast(errorMessage(error));
    } finally {
      state.contactsLoading = false;
    }
  }

  async function refreshPeople({ keepSelection = true } = {}) {
    state.loading = true;
    state.error = null;
    if (peopleMode()) renderPeopleProjection();
    try {
      const people = await API.listPeople();
      state.people = Array.isArray(people) ? people : [];
      state.ready = true;
      const selectedStillExists = keepSelection && personById(state.selectedId);
      if (!selectedStillExists) state.selectedId = state.people[0]?.id || null;
      if (state.selectedId) await loadContacts(state.selectedId);
    } catch (error) {
      state.error = error;
      state.ready = false;
      state.people = [];
      state.selectedId = null;
    } finally {
      state.loading = false;
      if (peopleMode()) renderPeopleProjection();
    }
  }

  async function selectPerson(personId) {
    if (!personById(personId)) return;
    state.selectedId = personId;
    state.tab = 'overview';
    $('#directoryGrid')?.setAttribute('data-mobile-detail', 'true');
    await loadContacts(personId);
    renderPeopleProjection();
  }

  function filteredPeople() {
    const q = state.query.trim().toLowerCase();
    return state.people.filter((person) => {
      const viewMatch = state.view === 'all' || person.lifecycle === state.view;
      const searchMatch = !q || `${person.display_name} ${person.lifecycle} ${person.id}`.toLowerCase().includes(q);
      return viewMatch && searchMatch;
    });
  }

  function renderViewBar() {
    const bar = $('#viewBar');
    if (!bar) return;
    const counts = {
      all: state.people.length,
      active: state.people.filter((person) => person.lifecycle === 'active').length,
      disabled: state.people.filter((person) => person.lifecycle === 'disabled').length,
    };
    bar.innerHTML = ['all', 'active', 'disabled'].map((key) => `<button type="button" data-server-view="${key}" aria-pressed="${state.view === key}">${key === 'all' ? 'All people' : key[0].toUpperCase() + key.slice(1)} <span>${counts[key]}</span></button>`).join('');
  }

  function renderList() {
    const list = $('#recordList');
    const visible = $('#visibleCount');
    const peopleCount = $('#peopleCount');
    const listTitle = $('#listTitle');
    if (peopleCount) peopleCount.textContent = String(state.people.length);
    if (listTitle) listTitle.textContent = 'People';

    if (!list || !visible) return;
    if (state.loading && !state.ready) {
      visible.textContent = '—';
      list.innerHTML = '<div class="dir-empty-list">Loading protected People…</div>';
      return;
    }
    if (state.error) {
      visible.textContent = '0';
      list.innerHTML = `<div class="dir-empty-list"><strong>Protected People unavailable</strong><br>${esc(errorMessage(state.error))}</div>`;
      return;
    }

    const rows = filteredPeople();
    visible.textContent = String(rows.length);
    list.innerHTML = rows.map((person) => `<button class="dir-record" type="button" data-server-person="${person.id}" aria-current="${person.id === state.selectedId}"><span class="dir-avatar">${esc(initials(person.display_name))}</span><span class="dir-record-copy"><strong>${esc(person.display_name)}</strong><span>Server-backed Person</span></span><span class="dir-record-meta"><small class="${person.lifecycle === 'disabled' ? 'warn' : ''}">${esc(person.lifecycle.toUpperCase())}</small><span>${esc(relative(person.updated_at))}</span></span></button>`).join('') || '<div class="dir-empty-list">No protected People match this view.</div>';

    const footer = list.closest('.dir-list-pane')?.querySelector('footer');
    if (footer) footer.innerHTML = '<span>Protected server People</span><button id="resetSample" type="button">Reload server</button>';
  }

  function profileHeader(person) {
    return `<button class="dir-mobile-back" id="mobileBack" type="button">← Back to Directory</button><header class="dir-profile-head"><span class="dir-profile-avatar">${esc(initials(person.display_name))}</span><div class="dir-profile-copy"><span>PERSON · SERVER</span><h3>${esc(person.display_name)}</h3><p>Durable protected identity</p><div class="dir-profile-chips"><span class="dir-chip" data-tone="${person.lifecycle === 'active' ? 'green' : 'amber'}">${esc(person.lifecycle)}</span><span class="dir-chip">Persisted</span></div></div><div class="dir-profile-actions"><button class="dir-icon-action" type="button" id="editRecord">Edit person</button></div></header>`;
  }

  function personTabs() {
    const tabs = [['overview','Overview'],['relationships','Relationships'],['activity','Activity'],['automation','Automations']];
    return `<nav class="dir-profile-tabs" role="tablist">${tabs.map(([key, label]) => `<button type="button" data-server-tab="${key}" role="tab" aria-selected="${state.tab === key}">${label}</button>`).join('')}</nav>`;
  }

  function renderContacts(person) {
    if (state.contactsLoading) return '<p>Loading contact methods…</p>';
    const contacts = contactsFor(person.id);
    const rows = contacts.map((contact) => {
      const nextLifecycle = contact.lifecycle === 'active' ? 'disabled' : 'active';
      return `<div class="dir-method"><span class="dir-method-icon">@</span><span class="dir-method-copy"><strong>Email</strong><span>${esc(contact.address)}</span></span><span class="dir-method-state">${esc(contact.lifecycle.toUpperCase())}</span><button class="dir-secondary" type="button" data-contact-lifecycle="${nextLifecycle}" data-contact-id="${contact.id}" title="ContactMethod ${contact.id}">${nextLifecycle === 'active' ? 'Reactivate' : 'Disable'}</button></div>`;
    }).join('');
    return rows || '<p>No email contact methods saved yet.</p>';
  }

  function renderOverview(person) {
    const contacts = contactsFor(person.id);
    const preferred = contacts.find((contact) => contact.lifecycle === 'active') || contacts[0] || null;
    return `<div class="dir-facts"><div class="dir-fact"><span>Display name</span><strong>${esc(person.display_name)}</strong></div><div class="dir-fact"><span>Email</span><strong>${esc(preferred?.address || 'Not set')}</strong></div><div class="dir-fact"><span>Person state</span><strong>${esc(person.lifecycle)}</strong></div><div class="dir-fact"><span>Source</span><strong>Protected server</strong></div></div><section class="dir-panel"><header><strong>Contact methods</strong><small>SERVER EMAIL · ${contacts.length}</small></header><div class="dir-methods">${renderContacts(person)}</div><div class="dir-head-actions"><button class="dir-secondary" type="button" data-add-server-email>＋ Add email</button></div></section><section class="dir-panel"><header><strong>Persistence boundary</strong><small>REAL IDS</small></header><p>This Person and these email ContactMethods are loaded from the protected backend on every page load. Display names and addresses may change; their backend IDs remain canonical identity.</p></section>`;
  }

  function renderPersonBody(person) {
    if (state.tab === 'overview') return renderOverview(person);
    if (state.tab === 'relationships') return '<section class="dir-panel"><header><strong>Relationships</strong><small>LOCAL CONCEPTS NOT ATTACHED</small></header><p>Organizations, Groups and relationship labels remain browser-local Lab concepts in this slice. They are not attached to this server Person.</p></section>';
    if (state.tab === 'activity') return `<section class="dir-panel"><header><strong>Server record timestamps</strong><small>NOT AUDIT HISTORY</small></header><div class="dir-activity-list"><div class="dir-activity-item"><span class="dir-activity-icon">•</span><span class="dir-activity-copy"><strong>Created</strong><span>${esc(new Date(person.created_at).toLocaleString())}</span></span></div><div class="dir-activity-item"><span class="dir-activity-icon">•</span><span class="dir-activity-copy"><strong>Updated</strong><span>${esc(new Date(person.updated_at).toLocaleString())}</span></span></div></div></section><section class="dir-panel"><header><strong>Audit boundary</strong><small>SEPARATE</small></header><p>This proof does not fabricate user-facing history from local events. Consequential Audit remains backend-owned.</p></section>`;
    return '<section class="dir-panel"><header><strong>Automation usage</strong><small>NEXT FRONTEND SLICE</small></header><p>This real Person is intentionally not wired into Automations yet. That integration starts only after this Directory proof is reviewed.</p></section>';
  }

  function renderDetail() {
    const pane = $('#detailPane');
    if (!pane) return;
    if (state.loading && !state.ready) {
      pane.innerHTML = '<div class="dir-empty-list">Loading protected Person data…</div>';
      return;
    }
    if (state.error) {
      pane.innerHTML = `<div class="dir-empty-list"><strong>Server-backed People are unavailable.</strong><br>${esc(errorMessage(state.error))}</div>`;
      return;
    }
    const person = personById(state.selectedId);
    if (!person) {
      pane.innerHTML = '<div class="dir-empty-list">Create or select a server-backed Person.</div>';
      return;
    }
    pane.innerHTML = profileHeader(person) + personTabs() + `<div class="dir-profile-body">${renderPersonBody(person)}</div>`;
  }

  function renderContext() {
    const pane = $('#contextPane');
    if (!pane) return;
    const person = personById(state.selectedId);
    if (!person || state.error) {
      pane.innerHTML = state.error ? '<header class="dir-context-head"><span>Context</span><b>SERVER</b></header><div class="dir-context-body"><section class="dir-context-card" data-tone="amber"><span>Data source</span><strong>Unavailable</strong><p>No browser-local Person fallback is being presented as canonical.</p></section></div>' : '';
      return;
    }
    const contacts = contactsFor(person.id);
    const active = contacts.filter((contact) => contact.lifecycle === 'active').length;
    pane.innerHTML = `<header class="dir-context-head"><span>Context</span><b>SERVER PERSON</b></header><div class="dir-context-body"><div class="dir-context-grid"><div class="dir-context-stat"><strong>${contacts.length}</strong><span>Email methods</span></div><div class="dir-context-stat"><strong>${active}</strong><span>Active</span></div></div><section class="dir-context-card" data-tone="green"><span>Durable identity</span><strong>Backend UUID</strong><p>${esc(person.id)}</p></section><section class="dir-context-card"><span>Duplicate policy</span><strong>Backend enforced</strong><p>The Lab does not pre-normalize or auto-merge email addresses. Backend 409/422 responses are shown directly.</p></section><section class="dir-context-card"><span>Canonical storage</span><strong>Server</strong><p>localStorage is not read or written by the protected Person/ContactMethod integration.</p></section></div>`;
  }

  function renderBoundary() {
    const boundary = $('.dir-boundary');
    const kicker = $('.dir-kicker');
    if (peopleMode()) {
      if (boundary) boundary.innerHTML = '<b>DIRECTORY · LAB</b> — People and email ContactMethods use the protected Directory API in this proof. Organizations, Groups, relationships, audiences and Automations remain local or unintegrated.';
      if (kicker) kicker.textContent = 'People · protected persistence proof';
    } else {
      if (boundary) boundary.innerHTML = '<b>DIRECTORY · LAB</b> — Organizations, Groups, relationships and saved audiences remain browser-local sample concepts. No protected backend support is claimed for them in this slice.';
      if (kicker) kicker.textContent = 'Organizations & groups · browser-local sample data';
    }
  }

  function renderPeopleProjection() {
    if (!peopleMode()) {
      renderBoundary();
      return;
    }
    renderBoundary();
    renderViewBar();
    renderList();
    renderDetail();
    renderContext();
    document.documentElement.dataset.directoryPeopleSource = state.ready ? 'server' : 'server-unavailable';
  }

  function showDialog({ title, mode, personId = '', value = '', note = '' }) {
    const dialog = $('#recordDialog');
    const body = $('#recordFormBody');
    if (!dialog || !body) return;
    dialog.dataset.serverMode = mode;
    $('#recordDialogTitle').textContent = title;
    const field = mode === 'contact-create'
      ? `<div class="dir-field full"><label for="server-email">Email</label><input id="server-email" name="email" type="email" autocomplete="email" value="${esc(value)}" required></div>`
      : `<div class="dir-field full"><label for="server-display-name">Display name</label><input id="server-display-name" name="displayName" value="${esc(value)}" required maxlength="255"></div>`;
    body.innerHTML = `<input type="hidden" name="serverPersonId" value="${esc(personId)}"><div class="dir-form-grid">${field}</div><p class="dir-plan-note">${esc(note)}</p><p class="dir-plan-note" data-server-form-error role="alert" hidden></p>`;
    dialog.showModal();
    body.querySelector('input:not([type="hidden"])')?.focus();
  }

  function openCreatePerson() {
    showDialog({ title:'New person', mode:'person-create', note:'REUSED dialog. Only display name is persisted because that is the current Person backend contract. Email is added after the Person receives a stable backend ID.' });
  }

  function openEditPerson() {
    const person = personById(state.selectedId);
    if (!person) return;
    showDialog({ title:'Edit person', mode:'person-edit', personId:person.id, value:person.display_name, note:'Display name is presentation data. The Person UUID stays canonical identity.' });
  }

  function openAddEmail() {
    const person = personById(state.selectedId);
    if (!person) return;
    showDialog({ title:'Add email', mode:'contact-create', personId:person.id, note:'Email is persisted as a separate ContactMethod with its own backend UUID. Duplicate and validation rules come from the backend.' });
  }

  function setFormError(message) {
    const node = $('[data-server-form-error]');
    if (!node) return;
    node.textContent = message;
    node.hidden = !message;
  }

  async function handleServerSubmit(event) {
    const dialog = $('#recordDialog');
    const mode = dialog?.dataset.serverMode;
    if (!mode) return false;
    event.preventDefault();
    event.stopImmediatePropagation();
    const form = new FormData(event.currentTarget);
    const submit = event.currentTarget.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setFormError('');
    try {
      if (mode === 'person-create') {
        const created = await API.createPerson(String(form.get('displayName') || '').trim());
        state.selectedId = created.id;
        state.tab = 'overview';
        await refreshPeople({ keepSelection:true });
        toast('Person saved to server');
      } else if (mode === 'person-edit') {
        const personId = String(form.get('serverPersonId') || '');
        await API.updatePerson(personId, { display_name:String(form.get('displayName') || '').trim() });
        state.selectedId = personId;
        await refreshPeople({ keepSelection:true });
        toast('Person name updated on server');
      } else if (mode === 'contact-create') {
        const personId = String(form.get('serverPersonId') || '');
        const created = await API.createEmailContactMethod(personId, String(form.get('email') || '').trim());
        state.selectedId = personId;
        await loadContacts(personId);
        renderPeopleProjection();
        toast(`Email saved · ${created.id}`);
      }
      dialog.dataset.serverMode = '';
      dialog.close();
      renderPeopleProjection();
    } catch (error) {
      const message = errorMessage(error);
      setFormError(message);
      toast(message);
    } finally {
      if (submit) submit.disabled = false;
    }
    return true;
  }

  async function changeContactLifecycle(contactId, lifecycle) {
    try {
      await API.setContactMethodLifecycle(contactId, lifecycle);
      await loadContacts(state.selectedId);
      renderPeopleProjection();
      toast(`Email ${lifecycle === 'active' ? 'reactivated' : 'disabled'} on server`);
    } catch (error) {
      toast(errorMessage(error));
    }
  }

  document.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-mode]');
    if (modeButton) {
      setTimeout(() => {
        renderBoundary();
        if (modeButton.dataset.mode === 'people') renderPeopleProjection();
      }, 0);
      return;
    }
    if (!peopleMode()) return;

    const newButton = event.target.closest('#newRecord');
    if (newButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openCreatePerson();
      return;
    }

    const reload = event.target.closest('#resetSample');
    if (reload) {
      event.preventDefault();
      event.stopImmediatePropagation();
      refreshPeople({ keepSelection:true });
      return;
    }

    const row = event.target.closest('[data-server-person]');
    if (row) {
      event.preventDefault();
      event.stopImmediatePropagation();
      selectPerson(row.dataset.serverPerson);
      return;
    }

    const tab = event.target.closest('[data-server-tab]');
    if (tab) {
      event.preventDefault();
      event.stopImmediatePropagation();
      state.tab = tab.dataset.serverTab;
      renderDetail();
      return;
    }

    if (event.target.closest('#editRecord')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openEditPerson();
      return;
    }

    if (event.target.closest('[data-add-server-email]')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openAddEmail();
      return;
    }

    const lifecycleButton = event.target.closest('[data-contact-lifecycle]');
    if (lifecycleButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      changeContactLifecycle(lifecycleButton.dataset.contactId, lifecycleButton.dataset.contactLifecycle);
    }
  }, true);

  document.addEventListener('click', (event) => {
    const view = event.target.closest('[data-server-view]');
    if (!view || !peopleMode()) return;
    event.preventDefault();
    state.view = view.dataset.serverView;
    renderViewBar();
    renderList();
  });

  document.addEventListener('input', (event) => {
    if (!peopleMode() || event.target.id !== 'directorySearch') return;
    event.stopImmediatePropagation();
    state.query = event.target.value;
    renderList();
  }, true);

  $('#recordForm')?.addEventListener('submit', (event) => {
    if ($('#recordDialog')?.dataset.serverMode) handleServerSubmit(event);
  }, true);

  $('#recordDialog')?.addEventListener('close', () => {
    const dialog = $('#recordDialog');
    if (dialog) dialog.dataset.serverMode = '';
  });

  window.addEventListener('pageshow', () => {
    if (peopleMode()) refreshPeople({ keepSelection:true });
  });

  refreshPeople({ keepSelection:false });
  document.documentElement.dataset.continuumDirectoryServerProof = 'v1';
})();
