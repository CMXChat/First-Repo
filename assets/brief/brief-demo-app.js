(() => {
  'use strict';

  const THEME_STORAGE_KEY = 'personal_os_brief_theme_v2';

  function readInitialTheme() {
    try {
      const urlTheme = new URL(window.location.href).searchParams.get('theme');
      if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme;
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  const initialTheme = readInitialTheme();
  document.documentElement.dataset.theme = initialTheme;
  document.documentElement.style.colorScheme = initialTheme;
  const initialThemeMeta = document.querySelector('meta[name="theme-color"]');
  if (initialThemeMeta) initialThemeMeta.content = initialTheme === 'dark' ? '#05070b' : '#edf3f8';

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const validViews = new Set(data.navigation.map(item => item.id));
  const validScenarios = new Set(Object.keys(data.scenarios));

  const state = {
    entered: false,
    entrySelection: '',
    scenarioId: data.meta.defaultScenario,
    view: 'today',
    tab: '',
    theme: initialTheme
  };

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenario() {
    return data.scenarios[state.scenarioId] || data.scenarios[data.meta.defaultScenario];
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value ?? '';
  }

  function readUrlState() {
    try {
      const url = new URL(window.location.href);
      const scenario = url.searchParams.get('scenario');
      const view = url.searchParams.get('view');
      return {
        scenario: validScenarios.has(scenario) ? scenario : '',
        view: validViews.has(view) ? view : 'today'
      };
    } catch {
      return { scenario: '', view: 'today' };
    }
  }

  function updateUrl(push = false) {
    if (!state.entered) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', state.scenarioId);
      url.searchParams.set('view', state.view);
      if (state.view === 'workspace' && state.tab) url.searchParams.set('tab', state.tab);
      else url.searchParams.delete('tab');
      url.hash = '';
      history[push ? 'pushState' : 'replaceState']({ briefDemo: true, scenario: state.scenarioId, view: state.view, tab: state.tab }, '', url);
    } catch {}
  }

  function formatDate() {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(new Date());
  }

  function renderEntry() {
    const host = $('#entryScenarioGrid');
    if (!host) return;
    host.innerHTML = Object.values(data.scenarios).map((item, index) => `
      <button class="entry-option" type="button" role="listitem" data-entry-scenario="${escapeHtml(item.id)}" aria-pressed="${item.id === state.entrySelection}">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.short)}</small>
      </button>
    `).join('');
  }

  function setEntrySelection(id) {
    state.entrySelection = validScenarios.has(id) ? id : '';
    $$('[data-entry-scenario]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.entryScenario === state.entrySelection));
    });
    const open = $('#openDemo');
    if (!open) return;
    const selected = data.scenarios[state.entrySelection];
    open.disabled = !selected;
    open.textContent = selected ? `Open ${selected.label} demo` : 'Choose a context first';
  }

  function renderScenarioSelect() {
    const select = $('#scenarioSelect');
    if (!select) return;
    select.innerHTML = Object.values(data.scenarios).map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join('');
    select.value = state.scenarioId;
  }

  function renderNavigation() {
    const markup = data.navigation.map(item => `
      <button type="button" data-primary-view="${escapeHtml(item.id)}" aria-current="${item.id === state.view ? 'page' : 'false'}">${escapeHtml(item.label)}</button>
    `).join('');
    const primary = $('#primaryNav');
    const mobile = $('#mobileNav');
    if (primary) primary.innerHTML = markup;
    if (mobile) mobile.innerHTML = markup;
  }

  function renderWeather(item) {
    setText('#weatherLocation', item.location);
    setText('#weatherTemperature', item.temperature);
    setText('#weatherCondition', item.condition);
    setText('#weatherAdvice', item.advice);
    setText('#weatherHigh', item.high);
    setText('#weatherLow', item.low);

    const host = $('#hourlyStrip');
    if (!host) return;
    host.innerHTML = item.hourly.map(hour => `
      <article class="hourly-item">
        <span>${escapeHtml(hour.time)}</span>
        <strong>${escapeHtml(hour.temp)}°</strong>
        <small>${escapeHtml(hour.rain)}% rain</small>
      </article>
    `).join('');
  }

  function renderStats(items) {
    const host = $('#statsGrid');
    if (!host) return;
    host.innerHTML = items.map(item => `
      <article class="stat-card">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>${escapeHtml(item.note)}</small>
      </article>
    `).join('');
  }

  function renderFlow(items) {
    const host = $('#flowList');
    if (!host) return;
    host.innerHTML = items.map(item => `
      <li>
        <time>${escapeHtml(item.time)}</time>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.meta)}</span>
      </li>
    `).join('');
  }

  function renderToday() {
    const item = currentScenario();
    setText('#greeting', item.greeting);
    setText('#heroTitle', item.headline);
    setText('#heroSummary', item.summary);
    setText('#nextTime', item.next.time);
    setText('#nextTitle', item.next.title);
    setText('#nextDetail', item.next.detail);
    setText('#recommendationLabel', item.recommendation.label);
    setText('#recommendationTitle', item.recommendation.title);
    setText('#recommendationDetail', item.recommendation.detail);
    renderWeather(item.weather);
    renderStats(item.stats);
    renderFlow(item.flow);
  }

  function allowedTabs() {
    return currentScenario().tabs || [];
  }

  function normalizeTab(tab) {
    const tabs = allowedTabs();
    return tabs.some(item => item.id === tab) ? tab : tabs[0]?.id || '';
  }

  function renderWorkspaceTabs() {
    const host = $('#workspaceTabs');
    if (!host) return;
    state.tab = normalizeTab(state.tab);
    host.innerHTML = allowedTabs().map(item => `
      <button type="button" role="tab" id="brief-next-tab-${escapeHtml(item.id)}" data-workspace-tab="${escapeHtml(item.id)}" aria-selected="${item.id === state.tab}" aria-controls="workspacePanel">${escapeHtml(item.label)}</button>
    `).join('');
  }

  function renderWorkspacePanel() {
    const host = $('#workspacePanel');
    if (!host) return;
    const detail = currentScenario().details[state.tab];
    if (!detail) {
      host.innerHTML = '<p>No detail view is available for this category.</p>';
      return;
    }
    host.setAttribute('aria-labelledby', `brief-next-tab-${state.tab}`);
    host.innerHTML = `
      <header>
        <p class="eyebrow">${escapeHtml(currentScenario().label)} WORKSPACE</p>
        <h2>${escapeHtml(detail.title)}</h2>
        <p>${escapeHtml(detail.summary)}</p>
      </header>
      <div class="detail-grid">
        ${detail.cards.map(card => `
          <article class="detail-card">
            <span>${escapeHtml(card.label)}</span>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.detail)}</p>
          </article>
        `).join('')}
      </div>
    `;
  }

  function setWorkspaceTab(tab, options = {}) {
    state.tab = normalizeTab(tab);
    $$('[data-workspace-tab]').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.workspaceTab === state.tab));
    });
    renderWorkspacePanel();
    updateUrl(options.push === true);
    if (options.focus) $('#workspacePanel')?.focus({ preventScroll: true });
  }

  function renderSpaces() {
    const item = currentScenario().space;
    setText('#privateSpaceTitle', `${currentScenario().label} private context`);
    setText('#sharedSpaceTitle', item.title);
    const privateList = $('#privateSpaceList');
    const sharedList = $('#sharedSpaceList');
    if (privateList) privateList.innerHTML = item.private.map(value => `<li>${escapeHtml(value)}</li>`).join('');
    if (sharedList) sharedList.innerHTML = item.shared.map(value => `<li>${escapeHtml(value)}</li>`).join('');
  }

  function renderContextLabels() {
    const item = currentScenario();
    setText('#railContextTitle', item.label);
    setText('#railContextCopy', item.short);
    const select = $('#scenarioSelect');
    if (select) select.value = item.id;
  }

  function setScenario(id, options = {}) {
    if (!validScenarios.has(id)) return;
    state.scenarioId = id;
    state.tab = normalizeTab('');
    document.body.dataset.scenario = id;
    renderContextLabels();
    renderToday();
    renderWorkspaceTabs();
    renderWorkspacePanel();
    renderSpaces();
    window.BRIEF_DEMO_MEDIA?.setScenario(id);
    updateUrl(options.push === true);
    document.dispatchEvent(new CustomEvent('briefdemo:scenariochange', { detail: { scenarioId: id } }));
  }

  function selectView(view, options = {}) {
    const next = validViews.has(view) ? view : 'today';
    state.view = next;
    document.body.dataset.view = next;

    $$('[data-view-panel]').forEach(panel => {
      const active = panel.dataset.viewPanel === next;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    $$('[data-primary-view]').forEach(button => {
      button.setAttribute('aria-current', button.dataset.primaryView === next ? 'page' : 'false');
    });

    if (next === 'workspace') {
      renderWorkspaceTabs();
      renderWorkspacePanel();
    }
    updateUrl(options.push === true);

    if (options.focus !== false) {
      $('#demoMain')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }

  function setTheme(theme, persist = true) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.style.colorScheme = state.theme;
    const button = $('#themeButton');
    button?.setAttribute('aria-pressed', String(state.theme === 'dark'));
    button?.setAttribute('aria-label', state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = state.theme === 'dark' ? '#05070b' : '#edf3f8';
    if (persist) {
      try { localStorage.setItem(THEME_STORAGE_KEY, state.theme); } catch {}
    }
  }

  function openDemo() {
    const selected = state.entrySelection;
    if (!validScenarios.has(selected)) return;

    window.BRIEF_DEMO_MEDIA?.requestEntryPlayback(selected, $('#entrySoundtrack')?.checked === true);

    state.entered = true;
    document.body.dataset.entered = 'true';
    $('#demoApp')?.setAttribute('aria-hidden', 'false');
    setScenario(selected, { push: false });
    selectView(state.view, { push: false, focus: true });
    updateUrl(false);
  }

  function resetDemo() {
    state.entered = false;
    state.entrySelection = '';
    document.body.dataset.entered = 'false';
    $('#demoApp')?.setAttribute('aria-hidden', 'true');
    $('#entrySoundtrack').checked = true;
    window.BRIEF_DEMO_MEDIA?.reset();
    renderEntry();
    setEntrySelection('');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function installEvents() {
    $('#entryScenarioGrid')?.addEventListener('click', event => {
      const button = event.target.closest('[data-entry-scenario]');
      if (button) setEntrySelection(button.dataset.entryScenario);
    });

    $('#openDemo')?.addEventListener('click', openDemo);
    $('#scenarioSelect')?.addEventListener('change', event => setScenario(event.target.value, { push: true }));
    $('#homeButton')?.addEventListener('click', () => selectView('today', { push: true }));
    $('#resetDemo')?.addEventListener('click', resetDemo);

    document.addEventListener('click', event => {
      const viewButton = event.target.closest('[data-primary-view]');
      if (viewButton) {
        selectView(viewButton.dataset.primaryView, { push: true });
        return;
      }

      const goButton = event.target.closest('[data-go-view]');
      if (goButton) {
        selectView(goButton.dataset.goView, { push: true });
        return;
      }

      const tabButton = event.target.closest('[data-workspace-tab]');
      if (tabButton) {
        setWorkspaceTab(tabButton.dataset.workspaceTab, { push: true, focus: true });
        return;
      }

      if (event.target.closest('[data-close-media]')) window.BRIEF_DEMO_MEDIA?.close();
    });

    $('#mediaButton')?.addEventListener('click', () => window.BRIEF_DEMO_MEDIA?.open());
    $('#previewButton')?.addEventListener('click', () => window.BRIEF_DEMO_MEDIA?.togglePreview());
    $('#themeButton')?.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') window.BRIEF_DEMO_MEDIA?.close();
    });

    window.addEventListener('popstate', event => {
      if (!state.entered) return;
      const urlState = readUrlState();
      const nextScenario = event.state?.scenario || urlState.scenario || state.scenarioId;
      const nextView = event.state?.view || urlState.view;
      const nextTab = event.state?.tab || new URL(window.location.href).searchParams.get('tab') || '';
      setScenario(nextScenario, { push: false });
      state.tab = normalizeTab(nextTab);
      selectView(nextView, { push: false, focus: false });
      if (nextView === 'workspace') setWorkspaceTab(state.tab, { push: false, focus: false });
    });
  }

  function init() {
    const urlState = readUrlState();
    state.scenarioId = urlState.scenario || data.meta.defaultScenario;
    state.view = urlState.view;
    state.tab = normalizeTab(new URL(window.location.href).searchParams.get('tab') || '');

    try { localStorage.removeItem('briefNextTheme'); } catch {}

    setTheme(state.theme, false);
    setText('#todayLabel', formatDate());
    setText('#heroDate', formatDate());
    renderEntry();
    renderScenarioSelect();
    renderNavigation();
    setScenario(state.scenarioId, { push: false });
    selectView(state.view, { push: false, focus: false });
    if (urlState.scenario) setEntrySelection(urlState.scenario);
    installEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();