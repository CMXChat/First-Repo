(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const VALID_PRESETS = ['individual', 'couple', 'partners', 'trainer', 'team'];
  const PRESET_LABELS = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer',
    team: 'Team'
  };
  const PRESET_DESCRIPTIONS = {
    individual: 'One person, one organized day',
    couple: 'Two private profiles and one approved shared space',
    partners: 'A shared operating view for business partners',
    trainer: 'Training, habits, progress and coaching boundaries',
    team: 'Members, roles, projects, handoffs and procedures'
  };
  const TABS = {
    individual: [['overview', 'Overview'], ['day', 'Day'], ['work', 'Work'], ['money', 'Money'], ['wellness', 'Wellness'], ['intelligence', 'Intelligence']],
    couple: [['overview', 'Overview'], ['together', 'Together'], ['profiles', 'Profiles'], ['plans', 'Plans'], ['watch', 'Watch'], ['reflection', 'Reflection']],
    partners: [['overview', 'Executive'], ['finance', 'Finance'], ['projects', 'Projects'], ['decisions', 'Decisions'], ['markets', 'Markets'], ['partners', 'Partners']],
    trainer: [['overview', 'Overview'], ['today', 'Today'], ['habits', 'Habits'], ['progress', 'Progress'], ['recovery', 'Recovery'], ['coach', 'Coach']],
    team: [['overview', 'Overview'], ['mywork', 'My work'], ['project', 'Project'], ['handoffs', 'Handoffs'], ['procedure', 'Procedures'], ['finance', 'Finance'], ['spaces', 'Spaces']]
  };
  const CARD_TABS = {
    individual: { NEXT: 'day', WEATHER: 'day', PRIORITY: 'work', WORK: 'work', PERSONAL: 'wellness', MOVEMENT: 'wellness', BILLS: 'money', REVIEW: 'money', MEMORY: 'intelligence' },
    couple: { NEXT: 'together', WEATHER: 'plans', PRIORITY: 'plans', TOGETHER: 'together', REFLECTION: 'reflection', 'CHECK-IN': 'together', PROFILES: 'profiles', MEDIA: 'watch' },
    partners: { NEXT: 'projects', WEATHER: 'markets', PRIORITY: 'projects', DECISION: 'decisions', REVENUE: 'finance', MARGIN: 'finance', PIPELINE: 'finance', RECEIVABLES: 'finance', CASH: 'finance' },
    trainer: { NEXT: 'today', WEATHER: 'recovery', PRIORITY: 'today', WEEK: 'habits', COACH: 'coach', MOVEMENT: 'today', RECOVERY: 'recovery', PROGRESS: 'progress' },
    team: { NEXT: 'mywork', WEATHER: 'procedure', PRIORITY: 'mywork', PROJECT: 'project', HANDOFFS: 'handoffs', BLOCKERS: 'project', BLOCKER: 'project', BUDGET: 'finance', FINANCE: 'finance', PROCEDURE: 'procedure', SPACES: 'spaces' }
  };
  const FULL_TARGETS = {
    home: '#today',
    briefing: '#briefWorkspace',
    spaces: '#sharedSpace',
    plans: '#priorities',
    library: '#learning',
    connections: '#connections',
    music: '#music',
    schedule: '#schedule',
    examples: '#scenarioExplorer'
  };
  const LIBRARY = [
    {
      id: 'how-it-works',
      category: 'How it works',
      title: 'How the briefing prepares context before the answer',
      summary: 'The page combines approved sources, timing, memory and permissions before presenting the next useful view.',
      body: 'A normal chat begins with the current prompt. This briefing can prepare a bounded context first: the selected profile, current time, approved shared spaces, connected services, recent changes and the user’s preferred level of detail. The interface then shows a small useful surface before the deeper workspace.',
      target: '#difference',
      related: ['modules', 'memory', 'connections']
    },
    {
      id: 'private-shared',
      category: 'Privacy',
      title: 'Private profiles and approved shared spaces',
      summary: 'People can collaborate on selected plans without automatically exposing private notes or histories.',
      body: 'Private and shared information should be separate records with explicit visibility. A relationship, business partnership, training plan or team can have an approved shared space while each person keeps a private profile. Sharing is a deliberate action, not an assumption created by proximity.',
      target: '#sharedSpace',
      related: ['memory', 'security', 'faq']
    },
    {
      id: 'memory',
      category: 'Memory',
      title: 'Memory with source, confidence, expiry and correction',
      summary: 'Important conclusions become reviewable records instead of silent permanent assumptions.',
      body: 'A useful memory record can retain its source, confidence, sensitivity, expiry and sharing rule. The user should be able to remember, make temporary, correct, delete or share a record. Corrections should carry more weight than broad inferred patterns.',
      target: '#learning',
      related: ['private-shared', 'how-it-works', 'security']
    },
    {
      id: 'connections',
      category: 'Connections',
      title: 'What is connected, disconnected or only demonstrated',
      summary: 'Every provider and data source should state its real status instead of implying access.',
      body: 'A trustworthy briefing distinguishes live public information, fictional demo records, disconnected providers, planned integrations and approved connections. The connection library should also explain what the provider can contribute and which actions still require confirmation.',
      target: '#connections',
      related: ['security', 'modules', 'faq']
    },
    {
      id: 'modules',
      category: 'Modules',
      title: 'Briefing modules and when they deserve space',
      summary: 'Weather, work, money, health, media and messages appear only when they help the current decision.',
      body: 'The system can support many modules, but the daily surface should stay selective. A module belongs in Focus View only when it changes timing, risk, ownership or the next action. Everything else remains available through the workspace, library or Full View.',
      target: '#possibilities',
      related: ['how-it-works', 'connections', 'faq']
    },
    {
      id: 'security',
      category: 'Security',
      title: 'The backend boundary for protected data and actions',
      summary: 'Authentication, permissions, secrets, audit logs and approval gates belong behind the interface.',
      body: 'The public page can demonstrate interaction patterns, but protected records and actions require a backend with authentication, least-privilege permissions, secret management, encrypted transport, rate limits, logging, backups and explicit approval gates. The interface should never pretend public JavaScript is a secure database.',
      target: '#difference',
      related: ['connections', 'private-shared', 'memory']
    },
    {
      id: 'full-view',
      category: 'Navigation',
      title: 'Focus, Workspace and Full View',
      summary: 'Three levels of depth let the product stay calm without deleting the detailed story.',
      body: 'Focus View shows the hero and immediate operating picture. Workspace View uses stable navigation and scenario-specific tabs. Full View preserves the long-form visual demonstration, with jump links and a clear route back to the workspace.',
      target: '#briefWorkspace',
      related: ['how-it-works', 'modules', 'faq']
    },
    {
      id: 'faq',
      category: 'FAQ',
      title: 'Frequently asked questions',
      summary: 'A quick explanation of demo data, privacy, providers, memory and future actions.',
      body: 'Open the FAQ below for concise answers. The important rule is consistent: public information stays sourced, fictional records stay labeled, private data requires protected access, and consequential actions require approval.',
      target: '#explainPanel',
      related: ['connections', 'security', 'private-shared']
    }
  ];
  const FAQS = [
    ['Is the private-looking information real?', 'No. The current inbox, finances, health, relationship and company examples are fictional unless a module explicitly states that it uses current public information.'],
    ['Does choosing a shared view expose both profiles?', 'No. A shared space should contain only records each person or role approved for that space.'],
    ['Can the briefing take actions automatically?', 'The interface can demonstrate actions, but consequential changes should require authenticated access and explicit approval.'],
    ['Why keep Full View?', 'It preserves the detailed product story, charts and explanations without forcing every visitor to scroll through them by default.'],
    ['What does the terminal do today?', 'It navigates the front-end demonstration, changes briefing views and explains boundaries. A future backend could connect approved tools and actions.']
  ];

  const state = {
    initialized: false,
    mode: 'focus',
    primary: 'home',
    tab: 'overview',
    preset: 'individual',
    entryLockUntil: 0,
    entryTimer: 0,
    terminalOpen: false,
    moreOpen: false,
    switcherOpen: false,
    libraryCategory: 'All',
    libraryQuery: '',
    libraryArticle: null,
    tourStep: 0
  };

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return VALID_PRESETS.includes(value) ? value : 'individual';
  }

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function scenarioData() {
    return window.BRIEF_DATA?.scenarios?.[preset()] || window.BRIEF_DATA?.scenarios?.individual || {};
  }

  function focusTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const app = $('#briefApp');
    const main = $('#briefMain');
    if (app) app.scrollTop = 0;
    if (main) main.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function cleanUrlForEntry() {
    try {
      const url = new URL(window.location.href);
      url.hash = '';
      ['mode', 'section', 'tab', 'view', 'article'].forEach(key => url.searchParams.delete(key));
      history.replaceState({ briefSystem: true }, '', `${url.pathname}${url.search}`);
    } catch {}
  }

  function startEntryLock() {
    cleanUrlForEntry();
    state.mode = 'focus';
    state.primary = 'home';
    state.tab = 'overview';
    state.entryLockUntil = Date.now() + 3400;
    document.documentElement.classList.add('brief-system-entry-lock');
    document.body?.setAttribute('data-brief-system-mode', 'focus');
    window.clearInterval(state.entryTimer);
    focusTop();
    state.entryTimer = window.setInterval(() => {
      if (Date.now() > state.entryLockUntil) {
        window.clearInterval(state.entryTimer);
        state.entryTimer = 0;
        state.entryLockUntil = 0;
        document.documentElement.classList.remove('brief-system-entry-lock');
        focusTop();
        return;
      }
      focusTop();
    }, 40);
  }

  function installScrollSafety() {
    if (window.__BRIEF_SYSTEM_SCROLL_SAFETY__) return;
    window.__BRIEF_SYSTEM_SCROLL_SAFETY__ = true;
    const native = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function protectedScrollIntoView(options) {
      if (document.documentElement.classList.contains('brief-system-entry-lock')) {
        const safe = this.id === 'today' || this.id === 'briefMain' || Boolean(this.closest?.('#entryGate'));
        if (!safe) return;
      }
      return native.call(this, options);
    };
  }

  function scrollToElement(target, behavior = reducedMotion() ? 'auto' : 'smooth') {
    const element = typeof target === 'string' ? $(target) : target;
    if (!element) return;
    const header = $('#briefSystemHeader');
    const top = element.getBoundingClientRect().top + window.scrollY - ((header?.offsetHeight || 0) + 14);
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
  }

  function updateUrl(push = false) {
    if (document.body.classList.contains('is-locked') || state.entryLockUntil) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', preset());
      url.searchParams.set('mode', state.mode);
      url.searchParams.set('section', state.primary);
      url.searchParams.set('tab', state.tab);
      if (state.libraryArticle) url.searchParams.set('article', state.libraryArticle);
      else url.searchParams.delete('article');
      url.hash = state.mode === 'full' ? (FULL_TARGETS[state.primary] || '#today') : '';
      history[push ? 'pushState' : 'replaceState']({ briefSystem: true, ...state }, '', url);
    } catch {}
  }

  function currentTabButton(tab = state.tab) {
    return $(`[data-workspace-tab="${CSS.escape(tab)}"]`);
  }

  function selectWorkspaceTab(tab, focusPanel = false) {
    const allowed = new Set((TABS[preset()] || TABS.individual).map(([id]) => id));
    const next = allowed.has(tab) ? tab : 'overview';
    state.tab = next;
    const button = currentTabButton(next);
    if (button && button.getAttribute('aria-selected') !== 'true') button.click();
    renderSecondaryNav();
    if (focusPanel) {
      window.setTimeout(() => {
        const panel = $('#briefWorkspacePanel');
        panel?.focus?.({ preventScroll: true });
      }, 80);
    }
  }

  function setMode(mode, options = {}) {
    const next = ['focus', 'workspace', 'full'].includes(mode) ? mode : 'focus';
    state.mode = next;
    document.body.dataset.briefSystemMode = next;
    document.body.dataset.briefDepth = next === 'full' ? 'full' : 'quick';
    document.body.classList.toggle('brief-system-full', next === 'full');

    if (next === 'focus') {
      state.primary = 'home';
      selectWorkspaceTab('overview');
    } else if (next === 'workspace' && state.primary === 'home') {
      state.primary = options.primary || 'briefing';
    }

    syncModeButtons();
    renderPrimaryNav();
    renderSecondaryNav();
    renderPanelState();
    updateMasthead();
    updateUrl(options.push === true);

    if (options.scroll !== false) {
      window.setTimeout(() => {
        if (next === 'focus') focusTop();
        else if (next === 'workspace') scrollToElement('#briefSystemShell');
        else scrollToElement(options.target || FULL_TARGETS[state.primary] || '#today');
      }, 50);
    }
  }

  function setPrimary(primary, options = {}) {
    const next = ['home', 'briefing', 'spaces', 'plans', 'library'].includes(primary) ? primary : 'home';
    if (state.mode === 'focus' && next !== 'home') state.mode = 'workspace';
    state.primary = next;
    document.body.dataset.briefSystemMode = state.mode;
    document.body.dataset.briefSystemPrimary = next;

    if (next === 'home') selectWorkspaceTab('overview');
    if (next === 'briefing' && options.tab) selectWorkspaceTab(options.tab);
    if (next !== 'library') state.libraryArticle = null;

    renderPrimaryNav();
    renderSecondaryNav();
    renderPanelState();
    updateMasthead();
    syncModeButtons();
    updateUrl(options.push !== false);

    if (options.scroll !== false) window.setTimeout(() => scrollToElement('#briefSystemShell'), 40);
  }

  function navigate(primary, tab, options = {}) {
    if (state.mode === 'full' && options.keepFull !== true) state.mode = 'workspace';
    if (primary === 'full') {
      setMode('full', { target: options.target || FULL_TARGETS[tab] || '#today', push: options.push !== false });
      return;
    }
    setPrimary(primary, { tab, push: options.push !== false, scroll: options.scroll });
    if (tab && primary === 'briefing') selectWorkspaceTab(tab, options.focus === true);
  }

  function openFullTarget(target, primary = 'briefing') {
    state.primary = primary;
    setMode('full', { target, push: true });
  }

  function switchPreset(next) {
    if (!VALID_PRESETS.includes(next) || !window.BRIEF_APP?.setPreset) return;
    closeOverlays();
    state.preset = next;
    state.tab = 'overview';
    state.primary = 'home';
    state.mode = 'focus';
    window.BRIEF_APP.setPreset(next);
    window.setTimeout(() => {
      selectWorkspaceTab('overview');
      renderAll();
      setMode('focus', { scroll: true, push: true });
    }, 260);
  }

  function createHeader() {
    if ($('#briefSystemHeader')) return;
    const app = $('#briefApp');
    if (!app) return;
    const header = document.createElement('header');
    header.id = 'briefSystemHeader';
    header.className = 'brief-system-header';
    header.innerHTML = `
      <div class="brief-system-header-inner">
        <button id="briefSystemSwitcher" class="brief-system-profile" type="button" aria-haspopup="dialog" aria-expanded="false">
          <span class="brief-system-orb" aria-hidden="true"></span>
          <span><small>CURRENT BRIEFING</small><strong id="briefSystemProfileLabel">Personal</strong></span>
          <b aria-hidden="true">⌄</b>
        </button>
        <div class="brief-system-header-actions">
          <button id="briefSystemCommandButton" type="button" aria-label="Open briefing terminal"><span aria-hidden="true">⌘</span><small>Command</small></button>
          <button id="briefSystemTourButton" type="button" aria-label="Start guided tour"><span aria-hidden="true">?</span><small>Tour</small></button>
          <button id="briefSystemMoreButton" type="button" aria-label="Open more controls" aria-expanded="false"><span aria-hidden="true">•••</span><small>More</small></button>
        </div>
      </div>`;
    app.insertBefore(header, app.firstChild);
  }

  function createShell() {
    if ($('#briefSystemShell')) return;
    const workspace = $('#briefWorkspace');
    const main = $('#briefMain');
    if (!workspace || !main) return;
    const shell = document.createElement('section');
    shell.id = 'briefSystemShell';
    shell.className = 'brief-system-shell';
    shell.innerHTML = `
      <div class="brief-system-masthead">
        <div>
          <p class="micro-label">SYSTEM VIEW</p>
          <h2 id="briefSystemTitle">Today at a glance.</h2>
          <p id="briefSystemSubtitle">The useful version first. The complete briefing stays one tap away.</p>
        </div>
        <div id="briefSystemModeSwitch" class="brief-system-mode-switch" role="group" aria-label="Briefing depth">
          <button type="button" data-system-mode="focus" aria-pressed="true">Focus</button>
          <button type="button" data-system-mode="workspace" aria-pressed="false">Workspace</button>
          <button type="button" data-system-mode="full" aria-pressed="false">Full View</button>
        </div>
      </div>
      <nav id="briefSystemPrimary" class="brief-system-primary" aria-label="Primary briefing navigation"></nav>
      <nav id="briefSystemSecondary" class="brief-system-secondary" aria-label="Current briefing views"></nav>
      <div id="briefSystemHome" class="brief-system-panel" data-system-panel="home"></div>
      <div id="briefSystemSpaces" class="brief-system-panel" data-system-panel="spaces"></div>
      <div id="briefSystemPlans" class="brief-system-panel" data-system-panel="plans"></div>
      <div id="briefSystemLibrary" class="brief-system-panel" data-system-panel="library"></div>
      <div id="briefSystemFullBar" class="brief-system-full-bar" hidden>
        <div><span>FULL VIEW</span><strong>Every module in one continuous briefing.</strong></div>
        <nav aria-label="Full briefing jump links">
          <button type="button" data-full-jump="#today">Opening</button>
          <button type="button" data-full-jump="#briefWorkspace">Quick brief</button>
          <button type="button" data-full-jump="#weather">Weather</button>
          <button type="button" data-full-jump="#music">Music</button>
          <button type="button" data-full-jump="#scenarioExplorer">Examples</button>
          <button type="button" data-full-jump="#priorities">Actions</button>
          <button type="button" data-full-jump="#learning">Memory</button>
          <button type="button" data-full-jump="#connections">Connections</button>
        </nav>
        <button type="button" data-return-workspace>Return to Workspace</button>
      </div>`;
    workspace.insertAdjacentElement('beforebegin', shell);
  }

  function createSwitcher() {
    if ($('#briefSystemSwitcherLayer')) return;
    const layer = document.createElement('div');
    layer.id = 'briefSystemSwitcherLayer';
    layer.className = 'brief-system-overlay';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="brief-system-overlay-backdrop" type="button" data-system-close aria-label="Close briefing switcher"></button>
      <aside class="brief-system-drawer" role="dialog" aria-modal="true" aria-labelledby="briefSystemSwitcherTitle">
        <header><div><span>BRIEFING TYPE</span><h2 id="briefSystemSwitcherTitle">Choose the people and purpose.</h2></div><button type="button" data-system-close aria-label="Close">×</button></header>
        <div class="brief-system-switch-grid">
          ${VALID_PRESETS.map(id => `<button type="button" data-system-preset="${id}"><span>${PRESET_LABELS[id]}</span><small>${PRESET_DESCRIPTIONS[id]}</small><b>Open →</b></button>`).join('')}
        </div>
      </aside>`;
    document.body.appendChild(layer);
  }

  function createMoreMenu() {
    if ($('#briefSystemMoreLayer')) return;
    const layer = document.createElement('div');
    layer.id = 'briefSystemMoreLayer';
    layer.className = 'brief-system-popover';
    layer.hidden = true;
    layer.innerHTML = `
      <div class="brief-system-more-card" role="dialog" aria-modal="false" aria-label="More briefing controls">
        <header><strong>More controls</strong><button type="button" data-system-close aria-label="Close">×</button></header>
        <button type="button" data-system-action="theme"><span>Appearance</span><small>Switch between light and dark</small></button>
        <button type="button" data-system-action="music"><span>Today’s song</span><small>Play or pause the current media</small></button>
        <button type="button" data-system-action="read"><span>Read opening aloud</span><small>Use the device narration voice</small></button>
        <button type="button" data-system-action="connections"><span>Connection status</span><small>See what is live, demo or planned</small></button>
        <button type="button" data-system-action="reset"><span>Reset experience</span><small>Return to the briefing gate</small></button>
      </div>`;
    document.body.appendChild(layer);
  }

  function createTour() {
    if ($('#briefSystemTour')) return;
    const layer = document.createElement('div');
    layer.id = 'briefSystemTour';
    layer.className = 'brief-system-overlay brief-system-tour-layer';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="brief-system-overlay-backdrop" type="button" data-tour-close aria-label="Close guided tour"></button>
      <aside class="brief-system-tour" role="dialog" aria-modal="true" aria-labelledby="briefSystemTourTitle">
        <header><span id="briefSystemTourProgress">STEP 1 OF 5</span><button type="button" data-tour-close aria-label="Close tour">×</button></header>
        <div id="briefSystemTourBody"></div>
        <footer><button type="button" data-tour-back>Back</button><div id="briefSystemTourDots"></div><button type="button" data-tour-next>Next</button></footer>
      </aside>`;
    document.body.appendChild(layer);
  }

  function createTerminalDock() {
    if ($('#briefSystemTerminalDock')) return;
    const dock = document.createElement('div');
    dock.id = 'briefSystemTerminalDock';
    dock.className = 'brief-system-terminal-dock';
    dock.innerHTML = `<button type="button" data-terminal-open><span aria-hidden="true">›_</span><strong>Ask this briefing or type a command…</strong><small>Open terminal</small></button>`;
    document.body.appendChild(dock);
  }

  function ensureTerminalDrawer() {
    const terminal = $('#briefTerminal');
    if (!terminal) return false;
    if (!terminal.querySelector('[data-terminal-close]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.terminalClose = '';
      button.className = 'brief-terminal-system-close';
      button.setAttribute('aria-label', 'Close terminal');
      button.textContent = '×';
      terminal.prepend(button);
    }
    const details = $('.brief-terminal-panel', terminal);
    if (details) details.open = true;
    terminal.classList.add('brief-terminal-system-drawer');
    return true;
  }

  function openTerminal() {
    if (!ensureTerminalDrawer()) return;
    state.terminalOpen = true;
    document.body.classList.add('brief-terminal-open');
    const details = $('#briefTerminal details');
    if (details) details.open = true;
    window.setTimeout(() => $('#briefTerminalInput')?.focus(), 80);
  }

  function closeTerminal() {
    state.terminalOpen = false;
    document.body.classList.remove('brief-terminal-open');
  }

  function openSwitcher() {
    state.switcherOpen = true;
    const layer = $('#briefSystemSwitcherLayer');
    if (layer) layer.hidden = false;
    $('#briefSystemSwitcher')?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('brief-system-overlay-open');
  }

  function openMore() {
    state.moreOpen = true;
    const layer = $('#briefSystemMoreLayer');
    if (layer) layer.hidden = false;
    $('#briefSystemMoreButton')?.setAttribute('aria-expanded', 'true');
  }

  function closeOverlays() {
    state.switcherOpen = false;
    state.moreOpen = false;
    ['#briefSystemSwitcherLayer', '#briefSystemMoreLayer'].forEach(selector => {
      const node = $(selector);
      if (node) node.hidden = true;
    });
    $('#briefSystemSwitcher')?.setAttribute('aria-expanded', 'false');
    $('#briefSystemMoreButton')?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('brief-system-overlay-open');
  }

  function renderPrimaryNav() {
    const nav = $('#briefSystemPrimary');
    if (!nav) return;
    const items = [
      ['home', 'Home'],
      ['briefing', 'Briefing'],
      ['spaces', 'Spaces'],
      ['plans', 'Plans'],
      ['library', 'Library']
    ];
    nav.innerHTML = items.map(([id, label]) => `<button type="button" data-system-primary="${id}" aria-current="${state.primary === id ? 'page' : 'false'}"><span>${label}</span></button>`).join('');
  }

  function renderSecondaryNav() {
    const nav = $('#briefSystemSecondary');
    if (!nav) return;
    const visible = state.mode !== 'focus' && state.primary === 'briefing';
    nav.hidden = !visible;
    if (!visible) {
      nav.replaceChildren();
      return;
    }
    nav.innerHTML = (TABS[preset()] || TABS.individual).map(([id, label]) => `<button type="button" data-system-tab="${id}" aria-selected="${state.tab === id}">${label}</button>`).join('');
  }

  function renderHome() {
    const host = $('#briefSystemHome');
    if (!host) return;
    const data = scenarioData();
    const next = data.nextUp || {};
    const priority = data.priorities?.[0] || {};
    const weather = window.BRIEF_LIVE_DATA?.weather || data.weather || {};
    const sharedLabel = preset() === 'individual' ? 'Private profile' : preset() === 'team' ? 'Role-based space' : 'Approved shared space';
    host.innerHTML = `
      <div class="brief-system-home-grid">
        <article data-system-link="briefing:overview"><span>NOW</span><strong>${escapeHtml(next.title || 'Today’s briefing is ready')}</strong><p>${escapeHtml(next.time || next.prep?.[0] || 'Open the concise view')}</p><b>Open overview →</b></article>
        <article data-system-link="briefing:${preset() === 'individual' ? 'work' : preset() === 'couple' ? 'together' : preset() === 'partners' ? 'decisions' : preset() === 'trainer' ? 'today' : 'mywork'}"><span>PRIORITY</span><strong>${escapeHtml(priority.title || 'Choose the next useful action')}</strong><p>${escapeHtml(priority.detail || priority.due || 'The deeper view stays one tap away')}</p><b>Open related view →</b></article>
        <article data-system-link="full:weather"><span>CONTEXT</span><strong>${escapeHtml(weather.condition || 'Weather and timing')}</strong><p>${escapeHtml(weather.advice || weather.summary || 'Current context can change the plan')}</p><b>Open full module →</b></article>
        <article data-system-link="spaces"><span>BOUNDARY</span><strong>${sharedLabel}</strong><p>${escapeHtml(PRESET_DESCRIPTIONS[preset()])}</p><b>Review spaces →</b></article>
      </div>
      <div class="brief-system-home-actions">
        <button type="button" data-system-primary="briefing">Open today’s briefing</button>
        <button type="button" data-system-mode="full">View everything</button>
        <button type="button" data-tour-open>Show me how it works</button>
      </div>`;
  }

  function renderSpaces() {
    const host = $('#briefSystemSpaces');
    if (!host) return;
    const current = preset();
    const cards = {
      individual: [
        ['PRIVATE PROFILE', 'Alex', 'Goals, preferences, memories and personal records stay private by default.'],
        ['OPTIONAL SHARING', 'Selected plans', 'A person can share a specific plan without sharing their full profile.'],
        ['CONTROL', 'Memory review', 'Remember, correct, expire or delete important records.']
      ],
      couple: [
        ['PRIVATE PROFILE', 'Maya', 'Private processing stays separate until Maya approves a summary.'],
        ['APPROVED SHARED SPACE', 'Together', 'Promises, plans and rituals can be visible to both people.'],
        ['PRIVATE PROFILE', 'Jordan', 'Jordan controls which private conclusions move into the couple space.']
      ],
      partners: [
        ['PARTNER PRIVATE', 'Amina', 'Draft notes, personal calendar context and private judgments stay bounded.'],
        ['COMPANY SPACE', 'Northstar', 'Approved KPIs, decisions, projects and finance signals are shared.'],
        ['PARTNER PRIVATE', 'Eli', 'Private operating notes remain outside the company ledger.']
      ],
      trainer: [
        ['COACH SPACE', 'Nina', 'Programming notes and other clients remain private.'],
        ['SHARED PLAN', 'Training', 'Approved workouts, goals, pain flags and feedback stay visible.'],
        ['STUDENT SPACE', 'Sam', 'Journal, body-image notes and unshared health context remain private.']
      ],
      team: [
        ['MEMBER SPACE', 'My work', 'A person sees their assignments, notes and relevant project context.'],
        ['PROJECT SPACE', 'Atlas', 'Approved progress, handoffs and procedures are shared by role.'],
        ['LEADERSHIP SPACE', 'Operations', 'Sensitive finance and risk context follows permissions.']
      ]
    }[current];
    host.innerHTML = `
      <div class="brief-system-panel-heading"><div><p class="micro-label">SPACES</p><h3>Share the plan without sharing everything.</h3></div><p>Visibility follows the record, person and role. The selected briefing changes the boundaries.</p></div>
      <div class="brief-system-space-map">${cards.map(([label, title, text]) => `<article><span>${label}</span><strong>${title}</strong><p>${text}</p></article>`).join('')}</div>
      <div class="brief-system-inline-actions"><button type="button" data-full-target="#sharedSpace">Open the full spaces demonstration</button><button type="button" data-library-article="private-shared">Read the privacy guide</button></div>`;
  }

  function renderPlans() {
    const host = $('#briefSystemPlans');
    if (!host) return;
    const data = scenarioData();
    const priorities = (data.priorities || []).slice(0, 5);
    const schedule = (data.schedule || []).slice(0, 5);
    host.innerHTML = `
      <div class="brief-system-panel-heading"><div><p class="micro-label">PLANS</p><h3>Owners, timing and the next useful move.</h3></div><p>Daily actions and schedule context stay connected without forcing the entire report open.</p></div>
      <div class="brief-system-plan-layout">
        <section><header><span>PRIORITIES</span><button type="button" data-full-target="#priorities">Full action board</button></header>${priorities.map((item, index) => `<article><b>${String(index + 1).padStart(2, '0')}</b><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml([item.owner, item.due, item.status].filter(Boolean).join(' · '))}</small></div></article>`).join('') || '<p>No priority rows are available.</p>'}</section>
        <section><header><span>SCHEDULE</span><button type="button" data-full-target="#schedule">Full schedule</button></header>${schedule.map(item => `<article><time>${escapeHtml(item.time || '')}</time><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.meta || '')}</small></div></article>`).join('') || '<p>No schedule rows are available.</p>'}</section>
      </div>`;
  }

  function libraryCategories() {
    return ['All', ...new Set(LIBRARY.map(item => item.category))];
  }

  function filteredLibrary() {
    const query = state.libraryQuery.trim().toLowerCase();
    return LIBRARY.filter(item => {
      const categoryMatch = state.libraryCategory === 'All' || item.category === state.libraryCategory;
      const queryMatch = !query || `${item.title} ${item.summary} ${item.body} ${item.category}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }

  function renderLibrary() {
    const host = $('#briefSystemLibrary');
    if (!host) return;
    if (state.libraryArticle) {
      const article = LIBRARY.find(item => item.id === state.libraryArticle) || LIBRARY[0];
      host.innerHTML = `
        <article class="brief-library-article">
          <nav><button type="button" data-library-back>Library</button><span>/</span><span>${escapeHtml(article.category)}</span></nav>
          <span>${escapeHtml(article.category)}</span>
          <h3>${escapeHtml(article.title)}</h3>
          <p class="brief-library-lead">${escapeHtml(article.summary)}</p>
          <p>${escapeHtml(article.body)}</p>
          <div class="brief-system-inline-actions"><button type="button" data-full-target="${article.target}">Open the detailed source section</button></div>
          <footer><span>RELATED</span>${article.related.map(id => { const related = LIBRARY.find(item => item.id === id); return related ? `<button type="button" data-library-article="${related.id}">${escapeHtml(related.title)}</button>` : ''; }).join('')}</footer>
        </article>`;
      return;
    }

    const items = filteredLibrary();
    host.innerHTML = `
      <div class="brief-system-panel-heading"><div><p class="micro-label">INFO LIBRARY</p><h3>Understand the product without reading one endless page.</h3></div><p>Search the guides, open a topic, follow related links, or jump to its full visual section.</p></div>
      <div class="brief-library-tools">
        <label><span class="sr-only">Search the briefing library</span><input id="briefLibrarySearch" type="search" value="${escapeHtml(state.libraryQuery)}" placeholder="Search privacy, memory, connections…" /></label>
        <div>${libraryCategories().map(category => `<button type="button" data-library-category="${escapeHtml(category)}" aria-pressed="${state.libraryCategory === category}">${escapeHtml(category)}</button>`).join('')}</div>
      </div>
      <div class="brief-library-grid">${items.map(item => `<article><span>${escapeHtml(item.category)}</span><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.summary)}</p><button type="button" data-library-article="${item.id}">Read guide →</button></article>`).join('') || '<p class="brief-library-empty">No guides match this search.</p>'}</div>
      <section class="brief-library-faq"><div><p class="micro-label">FAQ</p><h3>Quick answers</h3></div>${FAQS.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</section>`;
  }

  function updateMasthead() {
    const title = $('#briefSystemTitle');
    const subtitle = $('#briefSystemSubtitle');
    if (!title || !subtitle) return;
    const copy = {
      home: ['Today at a glance.', 'The useful version first. The complete briefing stays one tap away.'],
      briefing: [`${PRESET_LABELS[preset()]} briefing`, 'Move between connected views without leaving the workspace.'],
      spaces: ['Profiles, roles and shared spaces.', 'Visibility follows approval, purpose and the selected record.'],
      plans: ['Plans with owners and timing.', 'Important work stays connected to the schedule and the next action.'],
      library: ['The briefing information library.', 'Guides, FAQs and related sections replace one giant explanation scroll.']
    }[state.primary] || ['Today at a glance.', 'The useful version first.'];
    title.textContent = copy[0];
    subtitle.textContent = copy[1];
  }

  function renderPanelState() {
    document.body.dataset.briefSystemPrimary = state.primary;
    const fullBar = $('#briefSystemFullBar');
    if (fullBar) fullBar.hidden = state.mode !== 'full';
    $$('[data-system-panel]').forEach(panel => {
      panel.hidden = state.mode === 'full' || panel.dataset.systemPanel !== state.primary;
    });
    const workspace = $('#briefWorkspace');
    if (workspace) {
      const showWorkspace = state.mode === 'full' || (state.mode === 'workspace' && state.primary === 'briefing');
      workspace.hidden = !showWorkspace;
    }
  }

  function syncModeButtons() {
    $$('[data-system-mode]').forEach(button => {
      const active = button.dataset.systemMode === state.mode;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
  }

  function updateProfileLabel() {
    const label = $('#briefSystemProfileLabel');
    if (label) label.textContent = PRESET_LABELS[preset()];
    $$('[data-system-preset]').forEach(button => button.classList.toggle('is-active', button.dataset.systemPreset === preset()));
  }

  function renderAll() {
    state.preset = preset();
    renderPrimaryNav();
    renderSecondaryNav();
    renderHome();
    renderSpaces();
    renderPlans();
    renderLibrary();
    updateMasthead();
    updateProfileLabel();
    renderPanelState();
    syncModeButtons();
  }

  function openTour(step = 0) {
    state.tourStep = Math.max(0, Math.min(4, step));
    const layer = $('#briefSystemTour');
    if (layer) layer.hidden = false;
    document.body.classList.add('brief-system-overlay-open');
    renderTour();
  }

  function closeTour() {
    const layer = $('#briefSystemTour');
    if (layer) layer.hidden = true;
    document.body.classList.remove('brief-system-overlay-open');
    $$('.brief-system-tour-highlight').forEach(node => node.classList.remove('brief-system-tour-highlight'));
  }

  function renderTour() {
    const steps = [
      {
        title: 'Start with Focus View',
        text: 'The opening stays calm: the hero, immediate context and one concise operating picture. Nothing else competes until you ask for it.',
        action: () => setMode('focus', { scroll: true }),
        highlight: '#today'
      },
      {
        title: 'Use stable primary navigation',
        text: 'Home, Briefing, Spaces, Plans and Library stay consistent across every briefing type.',
        action: () => setMode('workspace', { primary: 'briefing', scroll: true }),
        highlight: '#briefSystemPrimary'
      },
      {
        title: 'Use scenario-specific pill tabs',
        text: 'The secondary tabs change with Personal, Relationship, Business, Trainer and Team views while the main structure stays familiar.',
        action: () => { setMode('workspace', { scroll: false }); setPrimary('briefing', { scroll: true, push: false }); },
        highlight: '#briefSystemSecondary'
      },
      {
        title: 'Follow connected guides and related links',
        text: 'The Library explains privacy, memory, connections, modules and security without forcing those explanations into the daily briefing.',
        action: () => { setMode('workspace', { scroll: false }); setPrimary('library', { scroll: true, push: false }); },
        highlight: '#briefSystemLibrary'
      },
      {
        title: 'Use the terminal from anywhere',
        text: 'The bottom command bar can navigate the demonstration, switch briefings and explain boundaries. Full View remains available whenever you want the entire story.',
        action: () => { setMode('workspace', { primary: 'briefing', scroll: false }); closeTerminal(); },
        highlight: '#briefSystemTerminalDock'
      }
    ];
    const step = steps[state.tourStep];
    step.action();
    const body = $('#briefSystemTourBody');
    const progress = $('#briefSystemTourProgress');
    const dots = $('#briefSystemTourDots');
    if (body) body.innerHTML = `<span>GUIDED PRODUCT TOUR</span><h2 id="briefSystemTourTitle">${escapeHtml(step.title)}</h2><p>${escapeHtml(step.text)}</p>`;
    if (progress) progress.textContent = `STEP ${state.tourStep + 1} OF ${steps.length}`;
    if (dots) dots.innerHTML = steps.map((_, index) => `<i class="${index === state.tourStep ? 'is-active' : ''}"></i>`).join('');
    const back = $('[data-tour-back]');
    const next = $('[data-tour-next]');
    if (back) back.disabled = state.tourStep === 0;
    if (next) next.textContent = state.tourStep === steps.length - 1 ? 'Finish' : 'Next';
    $$('.brief-system-tour-highlight').forEach(node => node.classList.remove('brief-system-tour-highlight'));
    window.setTimeout(() => $(step.highlight)?.classList.add('brief-system-tour-highlight'), 100);
  }

  function patchHero() {
    const actions = $('.hero-actions');
    if (!actions || actions.dataset.systemPatched === 'true') return;
    actions.dataset.systemPatched = 'true';
    actions.innerHTML = `
      <button class="primary-action" type="button" data-hero-open>Open today’s briefing</button>
      <button class="secondary-action" type="button" data-tour-open>Take a guided tour</button>`;
  }

  function decorateWorkspaceCards() {
    const panel = $('#briefWorkspacePanel');
    if (!panel) return;
    $$('.quick-signal-card, .quick-compact-list article', panel).forEach(card => {
      const label = card.querySelector(':scope > span')?.textContent?.trim().toUpperCase();
      const tab = CARD_TABS[preset()]?.[label];
      if (!tab) return;
      card.dataset.systemTabLink = tab;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
    });
  }

  function handleSystemLink(value) {
    if (!value) return;
    const [kind, detail] = value.split(':');
    if (kind === 'briefing') navigate('briefing', detail || 'overview');
    else if (kind === 'full') openFullTarget(FULL_TARGETS[detail] || `#${detail}`, detail === 'weather' ? 'home' : 'briefing');
    else setPrimary(kind);
  }

  function handleMoreAction(action) {
    closeOverlays();
    if (action === 'theme') {
      const light = document.documentElement.dataset.theme === 'light';
      document.documentElement.dataset.theme = light ? 'black' : 'light';
      try { localStorage.setItem('cmxBriefDemo:appearance', light ? 'black' : 'light'); } catch {}
    } else if (action === 'music') {
      $('#audioButton')?.click();
    } else if (action === 'read') {
      $('#readButton')?.click();
    } else if (action === 'connections') {
      setMode('workspace', { scroll: false });
      setPrimary('library', { scroll: true });
      state.libraryArticle = 'connections';
      renderLibrary();
    } else if (action === 'reset') {
      $('#resetExperience')?.click();
    }
  }

  function terminalLine(text, type = 'success') {
    const output = $('#briefTerminalOutput');
    if (!output || !text) return;
    const line = document.createElement('div');
    line.className = `brief-terminal-line is-${type}`;
    line.textContent = text;
    output.appendChild(line);
    while (output.children.length > 12) output.firstElementChild?.remove();
    output.scrollTop = output.scrollHeight;
  }

  function handleSystemTerminalCommand(rawValue) {
    const original = String(rawValue || '').trim();
    if (!original) return false;
    const command = original.toLowerCase().replace(/^\s*(open|go)\s+/, '').trim();
    const normalized = command.replace(/[\s_-]+/g, '');
    const currentTabs = new Set((TABS[preset()] || []).map(([id]) => id));

    if (['focus', 'focusview', 'home'].includes(normalized)) {
      setMode('focus', { scroll: true, push: true });
      terminalLine('Focus View opened.');
      return true;
    }
    if (['workspace', 'workspaceview', 'briefing'].includes(normalized)) {
      setMode('workspace', { primary: 'briefing', scroll: false, push: true });
      setPrimary('briefing', { tab: state.tab, scroll: true, push: false });
      terminalLine('Workspace opened.');
      return true;
    }
    if (['full', 'fullview', 'everything', 'all'].includes(normalized)) {
      setMode('full', { target: '#today', push: true });
      terminalLine('Full View opened.');
      return true;
    }
    if (['library', 'info', 'guides', 'faq'].includes(normalized)) {
      setMode('workspace', { scroll: false, push: true });
      setPrimary('library', { scroll: true, push: false });
      if (normalized === 'faq') {
        state.libraryArticle = 'faq';
        renderLibrary();
      }
      terminalLine(normalized === 'faq' ? 'FAQ guide opened.' : 'Information Library opened.');
      return true;
    }
    if (['spaces', 'profiles', 'permissions', 'shared'].includes(normalized)) {
      setMode('workspace', { scroll: false, push: true });
      setPrimary('spaces', { scroll: true, push: false });
      terminalLine('Spaces and permission boundaries opened.');
      return true;
    }
    if (['plans', 'actions', 'schedule'].includes(normalized)) {
      setMode('workspace', { scroll: false, push: true });
      setPrimary('plans', { scroll: true, push: false });
      terminalLine('Plans opened.');
      return true;
    }
    if (['tour', 'walkthrough', 'guide'].includes(normalized)) {
      openTour(0);
      terminalLine('Guided tour opened.');
      return true;
    }
    if (normalized === 'connections') {
      setMode('workspace', { scroll: false, push: true });
      state.primary = 'library';
      state.libraryArticle = 'connections';
      renderAll();
      updateUrl(true);
      scrollToElement('#briefSystemShell');
      terminalLine('Connection status guide opened.');
      return true;
    }
    if (normalized === 'memory') {
      setMode('workspace', { scroll: false, push: true });
      state.primary = 'library';
      state.libraryArticle = 'memory';
      renderAll();
      updateUrl(true);
      scrollToElement('#briefSystemShell');
      terminalLine('Memory guide opened.');
      return true;
    }
    if (normalized === 'weather') {
      openFullTarget('#weather', 'home');
      terminalLine('Weather module opened in Full View.');
      return true;
    }
    if (normalized === 'music') {
      openFullTarget('#music', 'home');
      terminalLine('Music module opened in Full View.');
      return true;
    }
    if (currentTabs.has(normalized)) {
      navigate('briefing', normalized, { focus: true });
      terminalLine(`${normalized} view opened.`);
      return true;
    }
    return false;
  }

  function installEvents() {
    document.addEventListener('submit', event => {
      if (event.target?.id !== 'briefTerminalForm') return;
      const input = $('#briefTerminalInput');
      if (!handleSystemTerminalCommand(input?.value)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (input) input.value = '';
    }, true);

    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-hero-open]')) {
        event.preventDefault();
        setMode('workspace', { primary: 'briefing', scroll: false, push: true });
        setPrimary('briefing', { tab: 'overview', scroll: true, push: false });
        return;
      }

      const mode = event.target.closest?.('[data-system-mode]');
      if (mode) {
        event.preventDefault();
        setMode(mode.dataset.systemMode, { push: true });
        return;
      }

      const primary = event.target.closest?.('[data-system-primary]');
      if (primary) {
        event.preventDefault();
        setMode('workspace', { scroll: false });
        setPrimary(primary.dataset.systemPrimary, { scroll: true });
        return;
      }

      const tab = event.target.closest?.('[data-system-tab]');
      if (tab) {
        event.preventDefault();
        selectWorkspaceTab(tab.dataset.systemTab, true);
        updateUrl(true);
        return;
      }

      const tabCard = event.target.closest?.('[data-system-tab-link]');
      if (tabCard) {
        event.preventDefault();
        navigate('briefing', tabCard.dataset.systemTabLink, { focus: true });
        return;
      }

      const deep = event.target.closest?.('[data-open-deep]');
      if (deep) {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigate('briefing', deep.dataset.openDeep, { focus: true });
        return;
      }

      const systemLink = event.target.closest?.('[data-system-link]');
      if (systemLink) {
        event.preventDefault();
        handleSystemLink(systemLink.dataset.systemLink);
        return;
      }

      const fullTarget = event.target.closest?.('[data-full-target], [data-full-jump]');
      if (fullTarget) {
        event.preventDefault();
        const target = fullTarget.dataset.fullTarget || fullTarget.dataset.fullJump;
        if (state.mode !== 'full') openFullTarget(target, state.primary);
        else scrollToElement(target);
        return;
      }

      if (event.target.closest?.('[data-return-workspace]')) {
        event.preventDefault();
        setMode('workspace', { scroll: true, push: true });
        return;
      }

      if (event.target.closest?.('#briefSystemSwitcher')) { openSwitcher(); return; }
      if (event.target.closest?.('#briefSystemMoreButton')) { openMore(); return; }
      if (event.target.closest?.('#briefSystemCommandButton, [data-terminal-open]')) { openTerminal(); return; }
      if (event.target.closest?.('#briefSystemTourButton, [data-tour-open]')) { openTour(0); return; }
      if (event.target.closest?.('[data-system-close]')) { closeOverlays(); return; }
      if (event.target.closest?.('[data-terminal-close]')) { closeTerminal(); return; }

      const presetButton = event.target.closest?.('[data-system-preset]');
      if (presetButton) { switchPreset(presetButton.dataset.systemPreset); return; }

      const moreAction = event.target.closest?.('[data-system-action]');
      if (moreAction) { handleMoreAction(moreAction.dataset.systemAction); return; }

      const libraryArticle = event.target.closest?.('[data-library-article]');
      if (libraryArticle) {
        state.libraryArticle = libraryArticle.dataset.libraryArticle;
        setMode('workspace', { scroll: false });
        state.primary = 'library';
        renderPrimaryNav();
        renderSecondaryNav();
        renderPanelState();
        renderLibrary();
        updateMasthead();
        updateUrl(true);
        window.setTimeout(() => scrollToElement('#briefSystemShell'), 40);
        return;
      }

      if (event.target.closest?.('[data-library-back]')) {
        state.libraryArticle = null;
        renderLibrary();
        updateUrl(true);
        return;
      }

      const category = event.target.closest?.('[data-library-category]');
      if (category) {
        state.libraryCategory = category.dataset.libraryCategory;
        renderLibrary();
        return;
      }

      if (event.target.closest?.('[data-tour-close]')) { closeTour(); return; }
      if (event.target.closest?.('[data-tour-back]')) {
        state.tourStep = Math.max(0, state.tourStep - 1);
        renderTour();
        return;
      }
      if (event.target.closest?.('[data-tour-next]')) {
        if (state.tourStep >= 4) closeTour();
        else { state.tourStep += 1; renderTour(); }
      }
    }, true);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeOverlays();
        closeTour();
        closeTerminal();
      }
      const card = event.target.closest?.('[data-system-tab-link]');
      if (card && ['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        navigate('briefing', card.dataset.systemTabLink, { focus: true });
      }
    });

    document.addEventListener('input', event => {
      if (event.target?.id !== 'briefLibrarySearch') return;
      state.libraryQuery = event.target.value;
      renderLibrary();
      window.setTimeout(() => {
        const input = $('#briefLibrarySearch');
        if (input) {
          input.focus({ preventScroll: true });
          input.setSelectionRange(state.libraryQuery.length, state.libraryQuery.length);
        }
      }, 0);
    });

    window.addEventListener('brief:preset-change', () => {
      state.preset = preset();
      state.tab = 'overview';
      state.primary = state.mode === 'full' ? state.primary : 'home';
      window.setTimeout(() => {
        selectWorkspaceTab('overview');
        renderAll();
        decorateWorkspaceCards();
        ensureTerminalDrawer();
        if (state.mode !== 'full') setMode('focus', { scroll: true, push: false });
      }, 240);
    });

    window.addEventListener('popstate', event => {
      if (!event.state?.briefSystem) return;
      const url = new URL(window.location.href);
      state.mode = ['focus', 'workspace', 'full'].includes(url.searchParams.get('mode')) ? url.searchParams.get('mode') : 'focus';
      state.primary = ['home', 'briefing', 'spaces', 'plans', 'library'].includes(url.searchParams.get('section')) ? url.searchParams.get('section') : 'home';
      state.tab = url.searchParams.get('tab') || 'overview';
      state.libraryArticle = url.searchParams.get('article');
      renderAll();
      selectWorkspaceTab(state.tab);
      setMode(state.mode, { scroll: false, push: false });
    });
  }

  function initialize() {
    if (state.initialized || !window.BRIEF_APP || !$('#briefWorkspace') || !$('#briefTerminal')) return false;
    state.initialized = true;
    state.preset = preset();
    createHeader();
    createShell();
    createSwitcher();
    createMoreMenu();
    createTour();
    createTerminalDock();
    patchHero();
    ensureTerminalDrawer();
    installEvents();
    document.body.classList.add('brief-system-ready');
    document.body.dataset.briefSystemMode = 'focus';
    document.body.dataset.briefSystemPrimary = 'home';
    selectWorkspaceTab('overview');
    renderAll();
    decorateWorkspaceCards();
    [250, 700, 1500, 2600].forEach(delay => window.setTimeout(() => {
      patchHero();
      ensureTerminalDrawer();
      decorateWorkspaceCards();
      renderAll();
    }, delay));
    return true;
  }

  function tryInitialize() {
    if (initialize()) return;
    window.setTimeout(tryInitialize, 220);
  }

  installScrollSafety();
  document.addEventListener('click', event => {
    const enter = event.target.closest?.('#enterBrief');
    if (enter && !enter.disabled) startEntryLock();
  }, true);

  window.BRIEF_SYSTEM = {
    setMode,
    setPrimary,
    navigate,
    openTarget: openFullTarget,
    switchPreset,
    openTerminal,
    closeTerminal,
    openTour,
    getState: () => ({ ...state, preset: preset() })
  };

  window.addEventListener('brief:ready', tryInitialize, { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryInitialize, { once: true });
  else tryInitialize();
})();
