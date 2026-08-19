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
    if (event.key === 'Escape') closeDrawers();
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

  const autonomyButton = document.getElementById('autonomyInfo');
  autonomyButton?.addEventListener('click', () => renderWhy('event-simulation'));

  const command = document.getElementById('commandButton');
  command?.addEventListener('click', () => {
    const label = command.querySelector('span');
    if (!label) return;
    label.textContent = 'Command surface is a Lab placeholder';
    window.setTimeout(() => {
      label.textContent = 'Search, jump or ask Continuum';
    }, 1800);
  });

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
