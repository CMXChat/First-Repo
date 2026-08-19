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

  const whyData = {
    'attention-connection': {
      title: 'GitHub connection needs attention',
      intro: 'This Lab example shows how the Control Center should explain a problem without inventing authority or provider state.',
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
      intro: 'The live Check In product is the current protected timing foundation. This Control Center row is sample projection only.',
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
      title: 'Simulation completed',
      intro: 'Simulation uses hypothetical state and must stay visibly separate from real execution.',
      chain: [
        ['Trigger', 'Owner ran saved scenario'],
        ['State', 'Frozen sample state + hypothetical override'],
        ['Policy', 'Simulation only'],
        ['Authority', 'No real grant activation'],
        ['Capability', 'Dry-run evaluator'],
        ['Result', 'Predicted path shown · zero side effects']
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

  function renderWhy(key) {
    const item = whyData[key] || whyData['event-checkin'];
    whyTitle.textContent = item.title;
    whyIntro.textContent = item.intro;
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

  const commandItems = [
    { group: 'Control Center', title: 'Now', desc: 'Current attention and active work', key: 'N', action: () => jumpToView('now') },
    { group: 'Control Center', title: 'Upcoming', desc: 'Scheduled and due work', key: 'U', action: () => jumpToView('upcoming') },
    { group: 'Control Center', title: 'History', desc: 'Completed and resolved sample work', key: 'H', action: () => jumpToView('history') },
    { group: 'Control Center', title: 'All activity', desc: 'Chronological sample activity', key: 'A', action: () => jumpToView('activity') },
    { group: 'Control Center', title: 'Run simulation', desc: 'Open the safe Lab scenario runner', key: 'S', action: () => openDrawer(simDrawer) },
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

  document.querySelectorAll('[data-why]').forEach((trigger) => {
    trigger.addEventListener('click', () => renderWhy(trigger.dataset.why));
    if (trigger.tagName !== 'BUTTON') {
      trigger.addEventListener('keydown', (event) => {
        if (!['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        renderWhy(trigger.dataset.why);
      });
    }
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

  document.getElementById('autonomyInfo')?.addEventListener('click', () => renderWhy('event-simulation'));
  document.getElementById('commandButton')?.addEventListener('click', openCommandPalette);

  function updateClock() {
    const now = new Date();
    const time = document.getElementById('localTime');
    const date = document.getElementById('localDate');
    if (time) time.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (date) date.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  closeDrawers();
  updateClock();
  window.setInterval(updateClock, 30000);
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
})();
