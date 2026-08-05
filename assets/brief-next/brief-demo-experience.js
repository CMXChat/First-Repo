(() => {
  'use strict';

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  if (!data.navigation.some(item => item.id === 'everything')) {
    data.navigation.push({ id: 'everything', label: 'Everything' });
  }

  const adaptiveSteps = [
    ['Gather', 'Read only the approved APIs, MCP tools, calendars, files, accounts, public sources and Space records needed for this update.'],
    ['Research', 'Check what changed, compare sources, resolve conflicts and identify missing context before presenting conclusions.'],
    ['Interpret', 'Use goals, permissions, memory, corrections, preferences and recent outcomes to decide what matters now.'],
    ['Compose', 'Select the clearest modules for the available data while keeping navigation, privacy controls and core locations stable.'],
    ['Interact', 'Let the user open evidence, change a view, correct memory, approve an action or ask the system to go deeper.'],
    ['Learn', 'Record the confirmed outcome so tomorrow’s briefing can become more useful without hiding how it changed.']
  ];

  const componentChoices = [
    ['Trend', 'Chart', 'Use a graph when movement over time changes the decision.'],
    ['Schedule', 'Timeline', 'Use a timeline when sequence, timing or ownership matters.'],
    ['Choice', 'Comparison', 'Use a comparison when the user needs to choose between real options.'],
    ['Location', 'Map', 'Use a map when travel, weather, proximity or routing affects the plan.'],
    ['Risk', 'Alert', 'Use a focused alert when something needs review, confirmation or escalation.'],
    ['Coordination', 'Shared actions', 'Use an ownership list for couples, families, teams and project Spaces.']
  ];

  const alarmSteps = [
    ['Wake', 'Begin at the user’s selected time with quiet controls for snooze, skip and privacy.'],
    ['Soundtrack', 'Rotate approved music from the connected Spotify account using listening history, saved preferences and the day’s context.'],
    ['Executive overview', 'Read a short summary of what changed, what matters and the first useful action.'],
    ['Continue', 'Move directly into the interactive briefing, calendar, route, message or task that deserves attention.']
  ];

  const escapeHtml = value => {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };

  const selectedScenarioId = () => {
    const selectValue = document.getElementById('scenarioSelect')?.value;
    const bodyValue = document.body?.dataset.scenario;
    return data.scenarios[selectValue] ? selectValue : (data.scenarios[bodyValue] ? bodyValue : data.meta.defaultScenario);
  };

  const sectionButton = (view, label) => `<button class="text-button" type="button" data-go-view="${escapeHtml(view)}">${escapeHtml(label)} <span aria-hidden="true">→</span></button>`;

  function renderJumpNav() {
    const host = document.getElementById('everythingJumpNav');
    if (!host) return;
    const items = [
      ['all-overview', 'Overview'],
      ['all-weather', 'Weather'],
      ['all-signals', 'Signals'],
      ['all-flow', 'Flow'],
      ['all-workspace', 'Workspace'],
      ['all-spaces', 'Spaces'],
      ['all-adaptive', 'Adaptive brief'],
      ['all-alarm', 'Alarm concept'],
      ['all-privacy', 'Privacy']
    ];
    host.innerHTML = items.map(([id, label]) => `<a href="#${id}">${escapeHtml(label)}</a>`).join('');
  }

  function renderEverything(id = selectedScenarioId()) {
    const scenario = data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
    const host = document.getElementById('everythingContent');
    if (!host) return;

    host.innerHTML = `
      <section class="full-section full-overview" id="all-overview">
        <div class="full-section-heading">
          <div><p class="eyebrow">EXECUTIVE OVERVIEW</p><h2>${escapeHtml(scenario.headline)}</h2></div>
          ${sectionButton('today', 'Open focused Today view')}
        </div>
        <p class="full-lead">${escapeHtml(scenario.summary)}</p>
        <div class="full-overview-grid">
          <article><span>Next</span><strong>${escapeHtml(scenario.next.time)} · ${escapeHtml(scenario.next.title)}</strong><p>${escapeHtml(scenario.next.detail)}</p></article>
          <article><span>${escapeHtml(scenario.recommendation.label)}</span><strong>${escapeHtml(scenario.recommendation.title)}</strong><p>${escapeHtml(scenario.recommendation.detail)}</p></article>
        </div>
      </section>

      <section class="full-section" id="all-weather">
        <div class="full-section-heading">
          <div><p class="eyebrow">CONDITION</p><h2>Weather and timing</h2></div>
          ${sectionButton('today', 'Open weather in Today')}
        </div>
        <div class="full-weather-grid">
          <article class="full-weather-now"><span>${escapeHtml(scenario.weather.location)}</span><strong>${escapeHtml(scenario.weather.temperature)}°</strong><h3>${escapeHtml(scenario.weather.condition)}</h3><p>${escapeHtml(scenario.weather.advice)}</p></article>
          <div class="full-hourly">${scenario.weather.hourly.map(hour => `<article><span>${escapeHtml(hour.time)}</span><strong>${escapeHtml(hour.temp)}°</strong><small>${escapeHtml(hour.rain)}% rain</small></article>`).join('')}</div>
        </div>
      </section>

      <section class="full-section" id="all-signals">
        <div class="full-section-heading"><div><p class="eyebrow">AT A GLANCE</p><h2>Signals worth seeing</h2></div></div>
        <div class="full-stat-grid">${scenario.stats.map(item => `<article><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><small>${escapeHtml(item.note)}</small></article>`).join('')}</div>
      </section>

      <section class="full-section" id="all-flow">
        <div class="full-section-heading"><div><p class="eyebrow">SEQUENCE</p><h2>The day in motion</h2></div></div>
        <ol class="full-flow">${scenario.flow.map(item => `<li><time>${escapeHtml(item.time)}</time><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.meta)}</span></li>`).join('')}</ol>
      </section>

      <section class="full-section" id="all-workspace">
        <div class="full-section-heading">
          <div><p class="eyebrow">ALL WORKSPACE CATEGORIES</p><h2>Every category for this ${escapeHtml(scenario.label.toLowerCase())} briefing</h2></div>
          ${sectionButton('workspace', 'Use focused Workspace')}
        </div>
        <div class="full-workspace-stack">${scenario.tabs.map(tab => {
          const detail = scenario.details[tab.id];
          if (!detail) return '';
          return `<article class="full-workspace-group">
            <header><div><span>${escapeHtml(tab.label)}</span><h3>${escapeHtml(detail.title)}</h3><p>${escapeHtml(detail.summary)}</p></div><button type="button" class="secondary-button compact-action" data-full-workspace-tab="${escapeHtml(tab.id)}">Open ${escapeHtml(tab.label)}</button></header>
            <div>${detail.cards.map(card => `<section><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></section>`).join('')}</div>
          </article>`;
        }).join('')}</div>
      </section>

      <section class="full-section" id="all-spaces">
        <div class="full-section-heading">
          <div><p class="eyebrow">PEOPLE AND PERMISSIONS</p><h2>${escapeHtml(scenario.space.title)}</h2></div>
          ${sectionButton('spaces', 'Open Spaces view')}
        </div>
        <div class="full-space-grid">
          <article><span>PRIVATE CONTEXT</span><ul>${scenario.space.private.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
          <article><span>APPROVED SHARED SPACE</span><ul>${scenario.space.shared.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
        </div>
      </section>

      <section class="full-section adaptive-section" id="all-adaptive">
        <div class="full-section-heading">
          <div><p class="eyebrow">STABLE SHELL, ADAPTIVE COMPOSITION</p><h2>The full dashboard can be composed again for every interactive update.</h2></div>
          ${sectionButton('how', 'See the Personal OS foundation')}
        </div>
        <p class="full-lead">After approved data is gathered, researched and checked, the AI can choose the clearest presentation for that day. Navigation, privacy controls and familiar locations stay stable. The useful modules, charts and explanations adapt to the actual content.</p>
        <ol class="adaptive-process">${adaptiveSteps.map(([title, detail], index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></div></li>`).join('')}</ol>
        <div class="component-choice-grid">${componentChoices.map(([input, component, reason]) => `<article><span>${escapeHtml(input)}</span><strong>${escapeHtml(component)}</strong><p>${escapeHtml(reason)}</p></article>`).join('')}</div>
        <aside class="adaptive-note"><strong>Personalized does not mean unpredictable.</strong><p>The system can redesign the information layer while preserving user control, accessibility, source visibility and a familiar way back to focused views.</p></aside>
      </section>

      <section class="full-section alarm-section" id="all-alarm">
        <div class="full-section-heading"><div><p class="eyebrow">FUTURE APP CONCEPT</p><h2>Wake up with music and the executive overview.</h2></div><button class="text-button" type="button" data-open-media-from-full>Open today’s soundtrack <span aria-hidden="true">→</span></button></div>
        <p class="full-lead">A future Personal OS app could rotate music each morning from the user’s connected Spotify account, then read the concise executive overview before opening the interactive briefing.</p>
        <div class="alarm-flow">${alarmSteps.map(([title, detail], index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></article>`).join('')}</div>
        <p class="future-boundary">Concept only: real playback, voice, alarms and account access require native-device permissions, provider rules, explicit controls and protected authentication.</p>
      </section>

      <section class="full-section full-privacy" id="all-privacy">
        <div><p class="eyebrow">PRIVATE FIRST</p><h2>More data should create more control, not more exposure.</h2></div>
        <p>Connections stay purpose-scoped. Memories stay reviewable. Shared Spaces receive only approved context. Important actions remain confirmable, logged and revocable.</p>
      </section>

      <nav class="full-end-nav" aria-label="Continue exploring the briefing">
        ${sectionButton('today', 'Return to Today')}
        ${sectionButton('workspace', 'Open Workspace')}
        ${sectionButton('spaces', 'Review Spaces')}
        ${sectionButton('how', 'Understand the system')}
      </nav>`;
  }

  function openWorkspaceTab(tab) {
    document.querySelector('[data-primary-view="workspace"]')?.click();
    queueMicrotask(() => document.querySelector(`[data-workspace-tab="${CSS.escape(tab)}"]`)?.click());
  }

  function installEvents() {
    document.getElementById('scenarioSelect')?.addEventListener('change', event => renderEverything(event.target.value));
    document.getElementById('openDemo')?.addEventListener('click', () => queueMicrotask(() => renderEverything(selectedScenarioId())));
    window.addEventListener('popstate', () => queueMicrotask(() => renderEverything(selectedScenarioId())));

    document.addEventListener('click', event => {
      const workspaceButton = event.target.closest('[data-full-workspace-tab]');
      if (workspaceButton) {
        openWorkspaceTab(workspaceButton.dataset.fullWorkspaceTab);
        return;
      }
      if (event.target.closest('[data-open-media-from-full]')) document.getElementById('mediaButton')?.click();
    });
  }

  renderJumpNav();
  renderEverything();
  installEvents();
})();
