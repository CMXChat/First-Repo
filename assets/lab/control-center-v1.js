(() => {
  'use strict';

  const THEME_KEY = 'continuum-control-center-theme-v1';
  const root = document.documentElement;
  const tabs = [...document.querySelectorAll('[data-cc-tab]')];
  const views = [...document.querySelectorAll('[data-cc-view]')];
  const whyDrawer = document.getElementById('whyDrawer');
  const simDrawer = document.getElementById('simDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const whyTitle = document.getElementById('whyTitle');
  const whyIntro = document.getElementById('whyIntro');
  const causal = document.getElementById('causalChain');
  const simResult = document.getElementById('simResult');
  const simResultTitle = document.getElementById('simResultTitle');
  const simResultText = document.getElementById('simResultText');
  const nowHeading = document.getElementById('nowHeading');

  function ensureInteractionStyle() {
    if (document.querySelector('link[data-cc-interaction-v3]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/lab/control-center-interaction-v3.css?v=20260819-1';
    link.dataset.ccInteractionV3 = 'true';
    document.head.appendChild(link);
  }

  ensureInteractionStyle();

  const detailData = {
    'attention-connection': {
      title: 'GitHub connection needs attention',
      intro: 'This Lab example shows how the Control Center should explain a blocked dependency without inventing provider state.',
      status: 'Blocked', tone: 'red', domain: 'Connection', when: '8m ago',
      next: 'Owner repair or re-authentication would be required before dependent work could continue. This Lab cannot repair or reconnect the provider.',
      action: { type: 'view', value: 'activity', label: 'View related activity' },
      chain: [
        ['Trigger', 'Connection health check'],
        ['State', 'Authentication refresh required'],
        ['Policy', 'Observation allowed · automatic repair blocked'],
        ['Authority', 'Owner action required'],
        ['Capability', 'GitHub connection'],
        ['Result', 'Dependent work remains waiting']
      ]
    },
    'attention-review': {
      title: 'Continuity instruction needs review',
      intro: 'A high-impact instruction can remain preserved while its owner-intent freshness requires attention.',
      status: 'Review due', tone: 'amber', domain: 'Continuity', when: 'Today',
      next: 'Where reconfirmation is required, the exact instruction version would need authenticated owner review before it becomes eligible again. This sample does not mutate policy.',
      action: { type: 'view', value: 'activity', label: 'View continuity activity' },
      chain: [
        ['Trigger', 'Revalidation deadline reached'],
        ['State', 'Instruction preserved · review due'],
        ['Policy', 'Health impact only'],
        ['Authority', 'No new authority created'],
        ['Capability', 'Continuity review'],
        ['Result', 'Owner attention requested']
      ]
    },
    'event-checkin': {
      title: 'Check In state refreshed',
      intro: 'The live Check In product is the current protected timing foundation. This Control Center row remains a sample projection.',
      status: 'Refreshed', tone: 'green', domain: 'Check In', when: '4:48 PM',
      next: 'No sample action is required. The live protected Check In route remains the source to open for current Check In behavior.',
      action: { type: 'href', value: '/checkin/', label: 'Open Check In' },
      chain: [
        ['Trigger', 'Protected status refresh'],
        ['State', 'Current Check In state'],
        ['Policy', 'Published timing policy'],
        ['Authority', 'Read-only status projection'],
        ['Capability', 'Check In API'],
        ['Result', 'Control Center state refreshed']
      ]
    },
    'event-draft': {
      title: 'Automation draft changed',
      intro: 'Draft edits remain configuration work. They do not perform provider side effects.',
      status: 'Saved', tone: 'green', domain: 'Automations', when: '3:31 PM',
      next: 'Continue editing in the Automation Lab. A Draft would still require protected validation and Publish semantics before future Runtime could use it.',
      action: { type: 'href', value: '/lab/automations/', label: 'Open Automations' },
      chain: [
        ['Trigger', 'Owner edited Draft'],
        ['State', 'Draft updated'],
        ['Policy', 'Protected mutation rules'],
        ['Authority', 'Authenticated owner session'],
        ['Capability', 'Automation definition service'],
        ['Result', 'Draft saved · no execution']
      ]
    },
    'event-simulation': {
      title: 'Continuity scenario simulated',
      intro: 'Simulation uses hypothetical state and stays visibly separate from real execution.',
      status: 'Simulation', tone: 'blue', domain: 'Simulation', when: '1:12 PM',
      next: 'The sample can be rerun with another hypothetical scenario. No real State, authority or external provider is changed.',
      action: { type: 'simulation', label: 'Run another simulation' },
      chain: [
        ['Trigger', 'Owner ran saved scenario'],
        ['State', 'Frozen sample state + hypothetical override'],
        ['Policy', 'Simulation only'],
        ['Authority', 'No real grant activation'],
        ['Capability', 'Dry-run evaluator'],
        ['Result', 'Predicted path shown · zero side effects']
      ]
    },
    'autonomy-mode': {
      title: 'Autonomy is observe-only in this Lab',
      intro: 'The Control Center prototype can demonstrate operational state and safe local interactions while consequential execution remains off.',
      status: 'Execution off', tone: 'blue', domain: 'Authority', when: 'Current Lab',
      next: 'Nothing in this route can turn on production autonomy. Future autonomous execution must pass protected policy, authority and Runtime checks on the server.',
      chain: [
        ['Mode', 'Observe only'],
        ['State', 'Sample/prototype projections'],
        ['Policy', 'No production execution'],
        ['Authority', 'No standing grant activated'],
        ['Capability', 'Local Lab interactions'],
        ['Result', 'Zero consequential side effects']
      ]
    },
    'work-migration': {
      title: 'Website migration follow-up',
      intro: 'This is a sample future Goal/work item showing how waiting work can stay visible beside ordinary Automations.',
      status: 'Waiting', tone: 'amber', domain: 'Goal / work', when: 'Now',
      next: 'The sample is waiting for access. A future server-backed Goal could observe the blocker, preserve the wait and continue only when State changes or owner policy allows a follow-up.',
      action: { type: 'href', value: '/lab/automations/', label: 'Open Automations Lab' },
      chain: [
        ['Objective', 'Complete migration follow-up'],
        ['State', 'Required access missing'],
        ['Constraint', 'Do not invent credentials'],
        ['Authority', 'No autonomous send in Lab'],
        ['Capability', 'Future typed follow-up'],
        ['Result', 'Waiting']
      ]
    },
    'work-briefing': {
      title: 'Morning briefing',
      intro: 'This sample shows a prepared briefing as operational work without claiming a production scheduler or Runtime.',
      status: 'Ready', tone: 'green', domain: 'Spaces', when: 'Tomorrow 7:00 AM',
      next: 'The current route can only preview this state. Future server-owned scheduling would determine when a briefing is actually prepared and surfaced.',
      action: { type: 'href', value: '/spaces/', label: 'Open Spaces' },
      chain: [
        ['Trigger', 'Sample schedule'],
        ['State', 'Briefing context prepared'],
        ['Policy', 'Read/presentation only'],
        ['Authority', 'No external side effect'],
        ['Capability', 'Spaces briefing'],
        ['Result', 'Ready sample']
      ]
    },
    'work-trusted': {
      title: 'Trusted-person role setup',
      intro: 'This sample represents unfinished continuity configuration where the owner still needs to choose a backup person.',
      status: 'Draft', tone: 'blue', domain: 'Continuity', when: 'Now',
      next: 'The owner would choose the exact person, role and scope. Relationship labels alone must never create trusted-person authority.',
      action: { type: 'href', value: '/lab/', label: 'Open Directory Lab' },
      chain: [
        ['Objective', 'Prepare a backup trusted role'],
        ['State', 'Backup person not selected'],
        ['Policy', 'Least privilege required'],
        ['Authority', 'No role granted yet'],
        ['Capability', 'Directory + continuity setup'],
        ['Result', 'Draft remains incomplete']
      ]
    }
  };

  const scenarios = {
    disappear: {
      title: 'Owner unavailable for 7 days',
      text: 'Sample path: Check In condition changes → contingency policy is evaluated → only pre-authorized deterministic actions become eligible. AI availability is irrelevant to essential steps.'
    },
    email: {
      title: 'Primary email connection unavailable',
      text: 'Sample path: the primary connection fails readiness → the action remains blocked unless an exact preconfigured fallback connection is authorized. No improvised provider switch occurs.'
    },
    approver: {
      title: 'Trusted approver does not respond',
      text: 'Sample path: the approval request waits through the configured response window → escalation follows the published policy → silence alone never creates permission.'
    }
  };

  function setView(name) {
    tabs.forEach((tab) => {
      const active = tab.dataset.ccTab === name;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });
    views.forEach((view) => {
      view.hidden = view.dataset.ccView !== name;
    });
  }

  function jumpToView(name) {
    setView(name);
    tabs.find((item) => item.dataset.ccTab === name)?.focus({ preventScroll: true });
    document.querySelector('.cc-view-tabs')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function openDrawer(drawer) {
    closeCommandPalette();
    [whyDrawer, simDrawer].forEach((item) => {
      if (!item) return;
      const active = item === drawer;
      item.dataset.open = active ? 'true' : 'false';
      item.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    backdrop.dataset.open = 'true';
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cc-drawer-open');
    drawer.querySelector('button, [href], [tabindex="0"]')?.focus();
  }

  function closeDrawers() {
    [whyDrawer, simDrawer].forEach((drawer) => {
      if (!drawer) return;
      drawer.dataset.open = 'false';
      drawer.setAttribute('aria-hidden', 'true');
    });
    backdrop.dataset.open = 'false';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cc-drawer-open');
  }

  let detailStatus;
  let detailDomain;
  let detailWhen;
  let detailNext;
  let detailActionButton;
  let currentDetailAction = null;

  function ensureDetailSurface() {
    if (!whyDrawer || detailStatus) return;
    const summary = document.createElement('div');
    summary.className = 'cc-detail-summary';
    summary.innerHTML = `
      <span class="cc-detail-status" id="detailStatus">Sample</span>
      <div class="cc-detail-facts">
        <div class="cc-detail-fact"><small>Domain</small><strong id="detailDomain">Continuum</strong></div>
        <div class="cc-detail-fact"><small>When</small><strong id="detailWhen">Sample</strong></div>
      </div>`;
    const next = document.createElement('section');
    next.className = 'cc-detail-next';
    next.innerHTML = `<small>What happens next</small><p id="detailNext"></p><button class="cc-detail-action" id="detailActionButton" type="button" hidden></button>`;
    const separator = document.createElement('div');
    separator.className = 'cc-detail-separator';
    separator.textContent = 'Why this state exists';
    whyIntro.after(summary);
    summary.after(next);
    causal.before(separator);
    detailStatus = summary.querySelector('#detailStatus');
    detailDomain = summary.querySelector('#detailDomain');
    detailWhen = summary.querySelector('#detailWhen');
    detailNext = next.querySelector('#detailNext');
    detailActionButton = next.querySelector('#detailActionButton');
    detailActionButton.addEventListener('click', () => {
      const action = currentDetailAction;
      if (!action) return;
      closeDrawers();
      if (action.type === 'href') window.location.href = action.value;
      if (action.type === 'view') jumpToView(action.value);
      if (action.type === 'simulation') openDrawer(simDrawer);
    });
  }

  function renderWhy(key) {
    ensureDetailSurface();
    const item = detailData[key] || detailData['event-checkin'];
    whyTitle.textContent = item.title;
    whyIntro.textContent = item.intro;
    detailStatus.textContent = item.status || 'Sample';
    detailStatus.dataset.tone = item.tone || '';
    detailDomain.textContent = item.domain || 'Continuum';
    detailWhen.textContent = item.when || 'Sample';
    detailNext.textContent = item.next || 'No additional sample step is defined.';
    currentDetailAction = item.action || null;
    detailActionButton.hidden = !currentDetailAction;
    if (currentDetailAction) detailActionButton.textContent = currentDetailAction.label;
    causal.innerHTML = item.chain.map(([label, value]) => `
      <div class="cc-causal-row">
        <small>${label}</small>
        <strong>${value}</strong>
      </div>`).join('');
    openDrawer(whyDrawer);
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#060708' : '#f5f7fa');
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Use light theme' : 'Use dark theme';
  }

  const attentionPanel = document.getElementById('attentionHeading')?.closest('.cc-panel');
  const attentionChip = document.querySelector('.cc-chip[data-tone="attention"]');
  let quietPanel;
  let quietPreview = false;
  const normalHeading = nowHeading?.textContent || 'Stable. 2 things need review.';
  const normalAttentionChip = attentionChip?.innerHTML || '<i></i> 2 need you';

  function ensureQuietPanel() {
    if (quietPanel || !attentionPanel) return;
    quietPanel = document.createElement('section');
    quietPanel.className = 'cc-panel cc-quiet-panel';
    quietPanel.hidden = true;
    quietPanel.setAttribute('aria-live', 'polite');
    quietPanel.innerHTML = `<div class="cc-quiet-inner"><span class="cc-quiet-icon" aria-hidden="true"></span><div class="cc-quiet-copy"><small>Quiet state preview · Lab</small><strong>Nothing needs you right now.</strong><span>Waiting work can continue to stay visible without manufacturing an attention item.</span></div></div>`;
    attentionPanel.before(quietPanel);
  }

  function toggleQuietPreview() {
    ensureQuietPanel();
    quietPreview = !quietPreview;
    document.body.classList.toggle('cc-quiet-preview', quietPreview);
    if (attentionPanel) attentionPanel.hidden = quietPreview;
    if (quietPanel) quietPanel.hidden = !quietPreview;
    if (nowHeading) nowHeading.textContent = quietPreview ? 'Quiet. Nothing needs you right now.' : normalHeading;
    if (attentionChip) attentionChip.innerHTML = quietPreview ? '<i></i> 0 need you' : normalAttentionChip;
    jumpToView('now');
  }

  const commandItems = [
    { group: 'Control Center', title: 'Now', desc: 'Current attention and active work', key: 'N', action: () => jumpToView('now') },
    { group: 'Control Center', title: 'Upcoming', desc: 'Scheduled and due work', key: 'U', action: () => jumpToView('upcoming') },
    { group: 'Control Center', title: 'History', desc: 'Completed and resolved sample work', key: 'H', action: () => jumpToView('history') },
    { group: 'Control Center', title: 'All activity', desc: 'Chronological sample activity', key: 'A', action: () => jumpToView('activity') },
    { group: 'Control Center', title: 'Run simulation', desc: 'Open the safe Lab scenario runner', key: 'S', action: () => openDrawer(simDrawer) },
    { group: 'Preview', title: 'Toggle quiet-state preview', desc: 'See Now with zero owner-attention items', key: 'Q', action: toggleQuietPreview },
    { group: 'Open', title: 'Check In', desc: 'Open the live protected Check In route', href: '/checkin/' },
    { group: 'Open', title: 'Directory', desc: 'Open the current Directory Lab', href: '/lab/' },
    { group: 'Open', title: 'Automations', desc: 'Open the focused Automation Lab', href: '/lab/automations/' },
    { group: 'Open', title: 'Spaces', desc: 'Open the Spaces Lab experience', href: '/spaces/' },
    { group: 'Open', title: 'Continuum document', desc: 'Read the current Continuum product document', href: '/doc/' },
    { group: 'Appearance', title: 'Toggle theme', desc: 'Switch between light and rich-black dark mode', key: 'T', action: () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark') }
  ];

  let commandOverlay;
  let commandInput;
  let commandResults;
  let commandFiltered = [...commandItems];
  let commandActiveIndex = 0;

  function commandIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M12 5v14"/></svg>';
  }

  function createCommandPalette() {
    if (commandOverlay) return;
    commandOverlay = document.createElement('div');
    commandOverlay.className = 'cc-command-overlay';
    commandOverlay.dataset.open = 'false';
    commandOverlay.setAttribute('aria-hidden', 'true');
    commandOverlay.innerHTML = `
      <section class="cc-command-palette" role="dialog" aria-modal="true" aria-label="Continuum command palette">
        <div class="cc-command-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
          <input class="cc-command-input" type="search" autocomplete="off" spellcheck="false" placeholder="Jump, open, or find an action" aria-label="Search Control Center commands" />
        </div>
        <div class="cc-command-results"></div>
        <div class="cc-command-footer"><span><kbd>↑↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span><span>Lab navigation only</span></div>
      </section>`;
    document.body.appendChild(commandOverlay);
    commandInput = commandOverlay.querySelector('.cc-command-input');
    commandResults = commandOverlay.querySelector('.cc-command-results');
    commandOverlay.addEventListener('mousedown', (event) => {
      if (event.target === commandOverlay) closeCommandPalette();
    });
    commandInput.addEventListener('input', () => {
      const query = commandInput.value.trim().toLowerCase();
      commandFiltered = commandItems.filter((item) => `${item.group} ${item.title} ${item.desc}`.toLowerCase().includes(query));
      commandActiveIndex = 0;
      renderCommandResults();
    });
    commandInput.addEventListener('keydown', handleCommandKeys);
    renderCommandResults();
  }

  function renderCommandResults() {
    if (!commandResults) return;
    if (!commandFiltered.length) {
      commandResults.innerHTML = '<div class="cc-command-empty">No matching Control Center command.</div>';
      return;
    }
    let lastGroup = '';
    commandResults.innerHTML = commandFiltered.map((item, index) => {
      const group = item.group !== lastGroup ? `<div class="cc-command-group">${item.group}</div>` : '';
      lastGroup = item.group;
      return `${group}<button class="cc-command-item" type="button" data-command-index="${index}" data-active="${index === commandActiveIndex ? 'true' : 'false'}"><span class="cc-command-item-icon">${commandIcon()}</span><span><strong>${item.title}</strong><span>${item.desc}</span></span><span class="cc-command-key">${item.key || '↗'}</span></button>`;
    }).join('');
    commandResults.querySelectorAll('[data-command-index]').forEach((button) => {
      button.addEventListener('mouseenter', () => {
        commandActiveIndex = Number(button.dataset.commandIndex);
        syncCommandActive();
      });
      button.addEventListener('click', () => runCommand(Number(button.dataset.commandIndex)));
    });
  }

  function syncCommandActive() {
    commandResults?.querySelectorAll('[data-command-index]').forEach((button) => {
      button.dataset.active = Number(button.dataset.commandIndex) === commandActiveIndex ? 'true' : 'false';
    });
    commandResults?.querySelector(`[data-command-index="${commandActiveIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }

  function runCommand(index) {
    const item = commandFiltered[index];
    if (!item) return;
    closeCommandPalette();
    if (item.href) {
      window.location.href = item.href;
      return;
    }
    item.action?.();
  }

  function handleCommandKeys(event) {
    if (!commandFiltered.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      commandActiveIndex = (commandActiveIndex + delta + commandFiltered.length) % commandFiltered.length;
      syncCommandActive();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(commandActiveIndex);
    }
  }

  function openCommandPalette() {
    closeDrawers();
    createCommandPalette();
    commandFiltered = [...commandItems];
    commandActiveIndex = 0;
    commandInput.value = '';
    renderCommandResults();
    commandOverlay.dataset.open = 'true';
    commandOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cc-command-open');
    window.requestAnimationFrame(() => commandInput.focus());
  }

  function closeCommandPalette() {
    if (!commandOverlay) return;
    commandOverlay.dataset.open = 'false';
    commandOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cc-command-open');
  }

  function wireDetailTriggers() {
    const workKeys = ['work-migration', 'work-briefing', 'work-trusted'];
    document.querySelectorAll('.cc-work-row').forEach((row, index) => {
      if (!workKeys[index]) return;
      row.dataset.detail = workKeys[index];
      row.setAttribute('role', 'button');
      row.tabIndex = 0;
      row.setAttribute('aria-label', `Open details for ${row.querySelector('strong')?.textContent || 'work item'}`);
    });

    document.querySelectorAll('[data-why], [data-detail]').forEach((trigger) => {
      const key = trigger.dataset.detail || trigger.dataset.why;
      trigger.addEventListener('click', () => renderWhy(key));
      if (trigger.tagName !== 'BUTTON') {
        trigger.addEventListener('keydown', (event) => {
          if (!['Enter', ' '].includes(event.key)) return;
          event.preventDefault();
          renderWhy(key);
        });
      }
    });
  }

  function setupActivityFilters() {
    const activityView = document.querySelector('[data-cc-view="activity"]');
    const card = activityView?.querySelector('.cc-list-card');
    const list = card?.querySelector('.cc-activity');
    const header = card?.querySelector('.cc-panel-head');
    if (!list || !header || card.querySelector('.cc-activity-toolbar')) return;

    const tagMap = {
      'event-checkin': ['checkin'],
      'attention-connection': ['attention', 'connection'],
      'event-draft': ['automations'],
      'attention-review': ['attention', 'continuity'],
      'event-simulation': ['continuity', 'simulation']
    };
    list.querySelectorAll('.cc-event').forEach((event) => {
      const key = event.dataset.why;
      event.dataset.activityTags = (tagMap[key] || []).join(' ');
    });

    const filters = [
      ['all', 'All', 5],
      ['attention', 'Needs you', 2],
      ['continuity', 'Continuity', 2],
      ['automations', 'Automations', 1],
      ['checkin', 'Check In', 1]
    ];
    const toolbar = document.createElement('div');
    toolbar.className = 'cc-activity-toolbar';
    toolbar.innerHTML = `<div class="cc-activity-filter-row" role="group" aria-label="Filter sample activity">${filters.map(([value, label, count], index) => `<button class="cc-activity-filter" type="button" data-activity-filter="${value}" aria-pressed="${index === 0 ? 'true' : 'false'}">${label}<span>${count}</span></button>`).join('')}</div>`;
    header.after(toolbar);

    const empty = document.createElement('div');
    empty.className = 'cc-filter-empty';
    empty.hidden = true;
    empty.textContent = 'Nothing in this sample matches that activity filter.';
    list.after(empty);

    function applyFilter(filter) {
      let visible = 0;
      toolbar.querySelectorAll('[data-activity-filter]').forEach((button) => button.setAttribute('aria-pressed', button.dataset.activityFilter === filter ? 'true' : 'false'));
      list.querySelectorAll('.cc-event').forEach((event) => {
        const show = filter === 'all' || event.dataset.activityTags.split(' ').includes(filter);
        event.hidden = !show;
        if (show) visible += 1;
      });
      empty.hidden = visible > 0;
    }

    toolbar.querySelectorAll('[data-activity-filter]').forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.activityFilter)));
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setView(tab.dataset.ccTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const index = tabs.indexOf(tab);
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + delta + tabs.length) % tabs.length];
      setView(next.dataset.ccTab);
      next.focus();
    });
  });

  document.querySelectorAll('[data-cc-tab-link]').forEach((trigger) => {
    trigger.addEventListener('click', () => jumpToView(trigger.dataset.ccTabLink));
  });

  document.querySelectorAll('[data-close-drawer]').forEach((button) => button.addEventListener('click', closeDrawers));
  backdrop?.addEventListener('click', closeDrawers);
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandOverlay?.dataset.open === 'true' ? closeCommandPalette() : openCommandPalette();
      return;
    }
    if (event.key === 'Escape') {
      if (commandOverlay?.dataset.open === 'true') closeCommandPalette();
      else closeDrawers();
    }
  });

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  document.getElementById('openSimulation')?.addEventListener('click', () => openDrawer(simDrawer));
  document.getElementById('openSimulationSecondary')?.addEventListener('click', () => openDrawer(simDrawer));

  let selectedScenario = 'disappear';
  document.querySelectorAll('[data-scenario]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedScenario = button.dataset.scenario;
      document.querySelectorAll('[data-scenario]').forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
      simResult.hidden = true;
    });
  });

  document.getElementById('runSimulation')?.addEventListener('click', () => {
    const item = scenarios[selectedScenario];
    simResultTitle.textContent = item.title;
    simResultText.textContent = item.text;
    simResult.hidden = false;
    simResult.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  document.getElementById('autonomyInfo')?.addEventListener('click', () => renderWhy('autonomy-mode'));
  document.getElementById('commandButton')?.addEventListener('click', openCommandPalette);

  function updateClock() {
    const now = new Date();
    const time = document.getElementById('localTime');
    const date = document.getElementById('localDate');
    if (time) time.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (date) date.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  wireDetailTriggers();
  setupActivityFilters();
  closeDrawers();
  updateClock();
  window.setInterval(updateClock, 30000);
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
})();
