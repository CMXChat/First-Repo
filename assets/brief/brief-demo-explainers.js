(() => {
  'use strict';

  const data = window.BRIEF_DEMO_DATA;

  const memoryExamples = {
    continuity: {
      label: 'Continuity',
      regular: 'A normal chat usually depends on the current conversation, so important background may need to be explained again.',
      personal: 'Spaces can prepare a record of goals, decisions, preferences, corrections, and recent results before the next Brief starts.',
      record: ['Source: user correction', 'Confidence: confirmed', 'Scope: Personal Space', 'Review: available anytime']
    },
    correction: {
      label: 'Correction',
      regular: 'An old assumption can keep shaping replies until the user notices it and corrects it again.',
      personal: 'A direct correction can replace a weaker guess, record when it changed, and stop the old assumption from returning.',
      record: ['Previous belief: archived', 'Correction: user confirmed', 'Effective: immediately', 'History: preserved']
    },
    outcome: {
      label: 'Outcome',
      regular: 'A chat can end after giving advice while the outcome remains outside the conversation.',
      personal: 'The result becomes useful evidence, allowing the next plan to respond to what was completed, skipped, changed, or learned.',
      record: ['Action: completed', 'Outcome: useful', 'Goal impact: positive', 'Next plan: adjusted']
    },
    preference: {
      label: 'Preference',
      regular: 'A preference may be remembered loosely, leaving its setting and scope unclear.',
      personal: 'Music, voice, Brief length, detail, and layout can become settings that belong to the user and can differ by Space or device.',
      record: ['Morning music: enabled', 'Read aloud: disabled', 'Detail: concise first', 'Applies to: Personal Space']
    }
  };

  const spaceExamples = {
    relationship: {
      label: 'Relationship',
      scenarioId: 'relationship',
      title: 'Two private profiles and one shared Space',
      members: ['Maya: private profile', 'Jordan: private profile', 'Couple Space: approved records'],
      shared: ['Travel plan and booking owner', 'Shared calendar changes', 'Promises and decisions approved by both people'],
      protected: 'Private messages, personal reflections, individual finances, and unshared memories stay outside the Couple Space.'
    },
    family: {
      label: 'Family',
      scenarioId: 'family',
      title: 'One household Brief with separate private records',
      members: ['Parent or guardian roles', 'Children or dependents with suitable access', 'Family Space: household plans'],
      shared: ['Current expenses and bills', 'Chores and owners', 'Pickups, appointments, groceries, and calendar changes'],
      protected: 'Parent notes, private concerns, passwords, and unrelated accounts stay outside the family Brief.'
    },
    accounting: {
      label: 'Accountant + client',
      scenarioId: 'accounting',
      title: 'One shared financial review with professional boundaries',
      members: ['Daniel: client and final decision-maker', 'Priya: accountant and professional reviewer', 'Shared Space: approved records and questions'],
      shared: ['Income, expenses, bills, tax preparation, asset summaries, and goals', 'Accountant notes, client corrections, decision rules, and deadlines', 'Prepared actions that wait for the client’s approval'],
      protected: 'Credentials, unrelated personal records, firm-only notes, and every other client record stay outside this Space.'
    },
    team: {
      label: 'Team',
      scenarioId: 'team',
      title: 'One project goal with role-based access',
      members: ['Member: assigned work', 'Lead: project-wide view', 'Project Space: approved project record'],
      shared: ['Goals, blockers, handoffs, owners, and deadlines', 'Approved decisions and release history', 'Relevant files and tool updates'],
      protected: 'HR records, passwords, private preparation, leadership notes, and unrelated company tools stay restricted.'
    }
  };

  const outcomes = [
    ['Brief', 'Show what changed, what matters, and what should happen next.'],
    ['Alarm', 'Start a routine with approved music, voice, and a short spoken Brief.'],
    ['Plan', 'Turn goals and current conditions into a realistic next step.'],
    ['Coordinate', 'Summarize shared plans, owners, decisions, and missing approvals.'],
    ['Prepare', 'Draft a task, calendar block, message, report, or handoff for review.'],
    ['Automate', 'Run a scheduled check or watch a condition after the user closes the page.'],
    ['Learn', 'Save corrections and results so the next recommendation uses better information.'],
    ['Act', 'Carry out an approved action after the right permission and confirmation checks.']
  ];

  const escapeHtml = value => {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };

  function createSection() {
    const boundary = document.querySelector('.boundary-card');
    const howPanel = document.querySelector('[data-view-panel="how"]');
    if (!boundary || !howPanel || document.getElementById('intelligenceExplainers')) return null;

    const section = document.createElement('section');
    section.id = 'intelligenceExplainers';
    section.className = 'intelligence-explainers';
    section.innerHTML = `
      <header class="explainer-heading">
        <div>
          <p class="eyebrow">THE MAIN DIFFERENCE</p>
          <h2>Memory and Spaces give AI useful context inside clear limits</h2>
        </div>
        <p>These examples show how Spaces can keep context, accept corrections, share selected records, and prepare useful work.</p>
      </header>

      <section class="memory-demo" aria-labelledby="memoryDemoTitle">
        <div class="explainer-title-row">
          <div><span>01</span><h3 id="memoryDemoTitle">What changes when memory can be reviewed?</h3></div>
          <p>Choose an example to compare normal chat with Spaces.</p>
        </div>
        <div class="explainer-tabs" id="memoryExampleTabs" role="tablist" aria-label="Memory comparison examples"></div>
        <div class="memory-comparison" id="memoryComparison" role="tabpanel" tabindex="0" aria-live="polite"></div>
      </section>

      <section class="spaces-demo" aria-labelledby="spacesDemoTitle">
        <div class="explainer-title-row">
          <div><span>02</span><h3 id="spacesDemoTitle">How can people share context and keep private boundaries?</h3></div>
          <p>People appear only when they belong to an approved Space.</p>
        </div>
        <div class="explainer-tabs" id="spaceExampleTabs" role="tablist" aria-label="People and Spaces examples"></div>
        <article class="space-example-panel" id="spaceExamplePanel" role="tabpanel" tabindex="0" aria-live="polite"></article>
      </section>

      <section class="outcomes-demo" aria-labelledby="outcomesTitle">
        <div class="explainer-title-row">
          <div><span>03</span><h3 id="outcomesTitle">What can approved information help create?</h3></div>
          <p>The same records can support a Brief, routine, plan, handoff, or approved action.</p>
        </div>
        <div class="outcome-grid">${outcomes.map(([title, detail]) => `
          <article><span>${escapeHtml(title)}</span><p>${escapeHtml(detail)}</p></article>
        `).join('')}</div>
      </section>

      <aside class="privacy-callout">
        <span>PRIVATE FIRST</span>
        <strong>Every memory and connection needs a purpose, a Space, an access level, and a clear off switch.</strong>
        <p>Important actions remain visible and require confirmation, while the demo explains the rules and leaves real protection to secure sign-in and server-side permissions.</p>
      </aside>`;

    boundary.insertAdjacentElement('beforebegin', section);
    return section;
  }

  function selectTab(groupSelector, selectedId, dataName) {
    const tabs = [...document.querySelectorAll(groupSelector)];
    tabs.forEach(button => {
      const active = button.dataset[dataName] === selectedId;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
  }

  function renderMemory(id = 'continuity') {
    const selected = memoryExamples[id] || memoryExamples.continuity;
    selectTab('[data-memory-example]', id, 'memoryExample');
    const host = document.getElementById('memoryComparison');
    if (!host) return;
    host.setAttribute('aria-labelledby', `memory-tab-${id}`);
    host.innerHTML = `
      <article class="comparison-card regular-ai">
        <span>NORMAL CHAT</span>
        <h4>${escapeHtml(selected.label)}</h4>
        <p>${escapeHtml(selected.regular)}</p>
      </article>
      <article class="comparison-card personal-os-memory">
        <span>SPACES</span>
        <h4>Reviewable ${escapeHtml(selected.label.toLowerCase())}</h4>
        <p>${escapeHtml(selected.personal)}</p>
        <ul>${selected.record.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </article>`;
  }

  function renderSpace(id = 'relationship') {
    const selected = spaceExamples[id] || spaceExamples.relationship;
    selectTab('[data-space-example]', id, 'spaceExample');
    const host = document.getElementById('spaceExamplePanel');
    if (!host) return;
    host.setAttribute('aria-labelledby', `space-tab-${id}`);
    host.innerHTML = `
      <header><span>${escapeHtml(selected.label)} SPACE</span><h4>${escapeHtml(selected.title)}</h4></header>
      <div class="space-example-columns">
        <section><strong>People and roles</strong><ul>${selected.members.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
        <section><strong>The shared Brief can include</strong><ul>${selected.shared.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
      </div>
      <p class="space-protection"><strong>Protected:</strong> ${escapeHtml(selected.protected)}</p>
      <button class="secondary-button space-example-open" type="button" data-open-space-scenario="${escapeHtml(selected.scenarioId)}">Open the ${escapeHtml(selected.label)} briefing</button>`;
  }

  function moveTabFocus(event, selector) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = [...document.querySelectorAll(selector)];
    const currentIndex = tabs.indexOf(event.target);
    if (currentIndex < 0) return;

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
    tabs[nextIndex]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function installDefaultSoundtrack() {
    const choice = document.getElementById('entrySoundtrack');
    if (choice) choice.checked = false;

    document.getElementById('resetDemo')?.addEventListener('click', () => {
      const resetChoice = document.getElementById('entrySoundtrack');
      if (resetChoice) resetChoice.checked = false;
    });
  }

  function loadSectionNavigation() {
    if (document.querySelector('script[data-brief-section-navigation-loader]')) return;
    const script = document.createElement('script');
    script.src = '/assets/brief/brief-demo-section-navigation.js?v=20260805-1';
    script.async = false;
    script.dataset.briefSectionNavigationLoader = 'true';
    document.head.append(script);
  }

  function init() {
    const section = createSection();
    if (section) {
      const memoryTabs = document.getElementById('memoryExampleTabs');
      memoryTabs.innerHTML = Object.entries(memoryExamples).map(([id, item], index) => `
        <button id="memory-tab-${escapeHtml(id)}" type="button" role="tab" data-memory-example="${escapeHtml(id)}" aria-controls="memoryComparison" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHtml(item.label)}</button>
      `).join('');

      const spaceTabs = document.getElementById('spaceExampleTabs');
      spaceTabs.innerHTML = Object.entries(spaceExamples).map(([id, item], index) => `
        <button id="space-tab-${escapeHtml(id)}" type="button" role="tab" data-space-example="${escapeHtml(id)}" aria-controls="spaceExamplePanel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHtml(item.label)}</button>
      `).join('');

      section.addEventListener('click', event => {
        const memoryButton = event.target.closest('[data-memory-example]');
        if (memoryButton) {
          renderMemory(memoryButton.dataset.memoryExample);
          memoryButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          return;
        }
        const spaceButton = event.target.closest('[data-space-example]');
        if (spaceButton) {
          renderSpace(spaceButton.dataset.spaceExample);
          spaceButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          return;
        }
        const scenarioButton = event.target.closest('[data-open-space-scenario]');
        if (scenarioButton) {
          const select = document.getElementById('scenarioSelect');
          if (!select || !data.scenarios[scenarioButton.dataset.openSpaceScenario]) return;
          select.value = scenarioButton.dataset.openSpaceScenario;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      memoryTabs.addEventListener('keydown', event => moveTabFocus(event, '[data-memory-example]'));
      spaceTabs.addEventListener('keydown', event => moveTabFocus(event, '[data-space-example]'));

      renderMemory();
      renderSpace();
    }

    installDefaultSoundtrack();
    loadSectionNavigation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
