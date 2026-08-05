(() => {
  'use strict';

  const memoryExamples = {
    continuity: {
      label: 'Continuity',
      regular: 'A regular AI mostly works from the current conversation. Important background may need to be explained again or may remain buried in old chats.',
      personal: 'Personal OS can prepare a reviewable record of goals, decisions, preferences, corrections, and recent outcomes before the next briefing or conversation begins.',
      record: ['Source: user correction', 'Confidence: confirmed', 'Scope: Personal Space', 'Review: available anytime']
    },
    correction: {
      label: 'Correction',
      regular: 'A stale assumption may continue shaping answers until the user notices and corrects it again.',
      personal: 'A direct correction can replace a weaker inference, preserve when it changed, and prevent the old assumption from quietly returning.',
      record: ['Previous belief: archived', 'Correction: user confirmed', 'Effective: immediately', 'History: preserved']
    },
    outcome: {
      label: 'Outcome',
      regular: 'The conversation may end after a recommendation, with no structured record of whether the advice worked.',
      personal: 'The result can become evidence. The next plan can respond to what was completed, skipped, changed, or learned.',
      record: ['Action: completed', 'Outcome: useful', 'Goal impact: positive', 'Next plan: adjusted']
    },
    preference: {
      label: 'Preference',
      regular: 'A preference may be remembered loosely without a clear setting, source, or place where it applies.',
      personal: 'Music, voice, briefing length, detail level, and presentation can become user-owned settings that differ by Space, routine, or device.',
      record: ['Morning music: enabled', 'Read aloud: disabled', 'Detail: concise first', 'Applies to: Personal Space']
    }
  };

  const spaceExamples = {
    relationship: {
      label: 'Relationship',
      title: 'Two private profiles and one approved shared Space',
      members: ['Maya: private profile', 'Jordan: private profile', 'Couple Space: approved context'],
      shared: ['Travel plan and booking owner', 'Shared calendar changes', 'Promises and decisions requiring both people'],
      protected: 'Private messages, personal reflections, individual financial context, and unshared memories stay outside the Couple Space.'
    },
    family: {
      label: 'Family',
      title: 'One household briefing without exposing every family member',
      members: ['Parent or guardian roles', 'Children or dependents by appropriate role', 'Family Space: household coordination'],
      shared: ['Current expenses and bills', 'Chores and ownership', 'Pickups, appointments, groceries, and calendar changes'],
      protected: 'Parent-private notes, member-private concerns, credentials, and unrelated personal accounts remain separate from the family briefing.'
    },
    team: {
      label: 'Team',
      title: 'One mission with role-based access',
      members: ['Member: assigned work', 'Lead: project-wide view', 'Project Space: approved operating truth'],
      shared: ['Goals, blockers, handoffs, owners, and deadlines', 'Approved decisions and release history', 'Relevant files and connected-tool updates'],
      protected: 'HR context, credentials, private preparation, leadership notes, and unrelated company systems remain restricted.'
    }
  };

  const outcomes = [
    ['Brief', 'Prepare what changed, what matters, and what should happen next.'],
    ['Alarm', 'Begin a routine with approved music, voice, and a short spoken briefing.'],
    ['Plan', 'Turn goals and current conditions into a realistic next step.'],
    ['Coordinate', 'Summarize shared plans, responsibilities, decisions, and missing approvals.'],
    ['Prepare', 'Draft a task, calendar block, message, report, or handoff for review.'],
    ['Automate', 'Run a scheduled check or watch a condition after the user closes the page.'],
    ['Learn', 'Record corrections and outcomes so the next recommendation improves.'],
    ['Act', 'Carry out an approved action only after the right confirmation and permission checks.']
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
          <p class="eyebrow">THE CORE DIFFERENCE</p>
          <h2>Memory and Spaces turn AI into a controlled personal intelligence layer.</h2>
        </div>
        <p>The examples below show continuity, correction, shared context, and useful action without pretending the public demo has private account access.</p>
      </header>

      <section class="memory-demo" aria-labelledby="memoryDemoTitle">
        <div class="explainer-title-row">
          <div><span>01</span><h3 id="memoryDemoTitle">What changes when memory is reviewable?</h3></div>
          <p>Choose a memory behavior to compare a normal chat with Personal OS.</p>
        </div>
        <div class="explainer-tabs" id="memoryExampleTabs" role="tablist" aria-label="Memory comparison examples"></div>
        <div class="memory-comparison" id="memoryComparison" aria-live="polite"></div>
      </section>

      <section class="spaces-demo" aria-labelledby="spacesDemoTitle">
        <div class="explainer-title-row">
          <div><span>02</span><h3 id="spacesDemoTitle">How can people share context without sharing everything?</h3></div>
          <p>People appear because they belong to an approved Space. This is not a social friends list.</p>
        </div>
        <div class="explainer-tabs" id="spaceExampleTabs" role="tablist" aria-label="People and Spaces examples"></div>
        <article class="space-example-panel" id="spaceExamplePanel" aria-live="polite"></article>
      </section>

      <section class="outcomes-demo" aria-labelledby="outcomesTitle">
        <div class="explainer-title-row">
          <div><span>03</span><h3 id="outcomesTitle">What can approved data become?</h3></div>
          <p>The dashboard is only one surface. The same structured context can support routines, coordination, preparation, and approved action.</p>
        </div>
        <div class="outcome-grid">${outcomes.map(([title, detail]) => `
          <article><span>${escapeHtml(title)}</span><p>${escapeHtml(detail)}</p></article>
        `).join('')}</div>
      </section>

      <aside class="privacy-callout">
        <span>PRIVATE FIRST</span>
        <strong>Each memory and connection needs a purpose, a Space, an access level, and a way to pause or revoke it.</strong>
        <p>Important actions should remain visible, logged, and confirmable. The frontend demonstrates the rules. Real protection belongs behind authentication and server-side permissions.</p>
      </aside>`;

    boundary.insertAdjacentElement('beforebegin', section);
    return section;
  }

  function renderMemory(id = 'continuity') {
    const selected = memoryExamples[id] || memoryExamples.continuity;
    document.querySelectorAll('[data-memory-example]').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.memoryExample === id));
    });
    const host = document.getElementById('memoryComparison');
    if (!host) return;
    host.innerHTML = `
      <article class="comparison-card regular-ai">
        <span>REGULAR AI CHAT</span>
        <h4>${escapeHtml(selected.label)}</h4>
        <p>${escapeHtml(selected.regular)}</p>
      </article>
      <article class="comparison-card personal-os-memory">
        <span>PERSONAL OS</span>
        <h4>Reviewable ${escapeHtml(selected.label.toLowerCase())}</h4>
        <p>${escapeHtml(selected.personal)}</p>
        <ul>${selected.record.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </article>`;
  }

  function renderSpace(id = 'relationship') {
    const selected = spaceExamples[id] || spaceExamples.relationship;
    document.querySelectorAll('[data-space-example]').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.spaceExample === id));
    });
    const host = document.getElementById('spaceExamplePanel');
    if (!host) return;
    host.innerHTML = `
      <header><span>${escapeHtml(selected.label)} SPACE</span><h4>${escapeHtml(selected.title)}</h4></header>
      <div class="space-example-columns">
        <section><strong>People and roles</strong><ul>${selected.members.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
        <section><strong>Shared briefing can include</strong><ul>${selected.shared.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
      </div>
      <p class="space-protection"><strong>Protected:</strong> ${escapeHtml(selected.protected)}</p>`;
  }

  function installDefaultSoundtrack() {
    const choice = document.getElementById('entrySoundtrack');
    if (choice) choice.checked = true;

    document.getElementById('resetDemo')?.addEventListener('click', () => {
      const resetChoice = document.getElementById('entrySoundtrack');
      if (resetChoice) resetChoice.checked = true;
    });
  }

  function init() {
    const section = createSection();
    if (section) {
      const memoryTabs = document.getElementById('memoryExampleTabs');
      memoryTabs.innerHTML = Object.entries(memoryExamples).map(([id, item], index) => `
        <button type="button" role="tab" data-memory-example="${escapeHtml(id)}" aria-selected="${index === 0}">${escapeHtml(item.label)}</button>
      `).join('');

      const spaceTabs = document.getElementById('spaceExampleTabs');
      spaceTabs.innerHTML = Object.entries(spaceExamples).map(([id, item], index) => `
        <button type="button" role="tab" data-space-example="${escapeHtml(id)}" aria-selected="${index === 0}">${escapeHtml(item.label)}</button>
      `).join('');

      section.addEventListener('click', event => {
        const memoryButton = event.target.closest('[data-memory-example]');
        if (memoryButton) {
          renderMemory(memoryButton.dataset.memoryExample);
          return;
        }
        const spaceButton = event.target.closest('[data-space-example]');
        if (spaceButton) renderSpace(spaceButton.dataset.spaceExample);
      });

      renderMemory();
      renderSpace();
    }

    installDefaultSoundtrack();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
