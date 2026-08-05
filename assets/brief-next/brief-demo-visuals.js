(() => {
  'use strict';

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const goalProfiles = {
    personal: {
      goal: 'Build a calmer, financially stable operating rhythm.',
      difficulty: 'Focused',
      trajectory: 'Improving',
      blocker: 'Client scope still needs a clean decision.',
      confidence: 'Moderate',
      question: 'Does clearing the client blocker create more value today than starting another task?',
      action: 'Send the revised scope before the protected focus window.'
    },
    relationship: {
      goal: 'Protect connection while making shared plans easier to keep.',
      difficulty: 'Sustainable',
      trajectory: 'Steady',
      blocker: 'The next shared decision still lacks a confirmed time.',
      confidence: 'High',
      question: 'Which plan needs both people present before it can move?',
      action: 'Confirm one shared time and leave private processing outside the shared Space.'
    },
    business: {
      goal: 'Turn active opportunities into predictable delivery and cash flow.',
      difficulty: 'Stretch',
      trajectory: 'Watch',
      blocker: 'One proposal and one invoice are holding the operating picture open.',
      confidence: 'Moderate',
      question: 'Which follow-up changes near-term cash or delivery risk the most?',
      action: 'Close the highest-value proposal follow-up before adding new pipeline work.'
    },
    trainer: {
      goal: 'Increase training consistency without creating avoidable recovery debt.',
      difficulty: 'Focused',
      trajectory: 'Improving',
      blocker: 'The next session needs a clear intensity decision.',
      confidence: 'High',
      question: 'Is the next session building capacity or testing a limit?',
      action: 'Use today’s readiness signal to set the session target before training begins.'
    },
    team: {
      goal: 'Keep the project moving with clear ownership and fewer hidden blockers.',
      difficulty: 'Sprint',
      trajectory: 'At risk',
      blocker: 'Two handoffs depend on the same reviewer.',
      confidence: 'Moderate',
      question: 'Which blocked handoff has the largest downstream effect?',
      action: 'Reassign or sequence the review queue before the next team checkpoint.'
    }
  };

  const memoryProfiles = {
    personal: [
      ['Preference', 'Short morning briefing', 'Confirmed by user', 'Personal', 'Today'],
      ['Outcome', 'Scope sent before focus block', 'Task result', 'Personal', 'Yesterday'],
      ['Correction', 'Evening workouts work better', 'Direct correction', 'Wellness', '3 days ago']
    ],
    relationship: [
      ['Shared decision', 'Saturday plan needs both approvals', 'Relationship Space', 'Shared', 'Today'],
      ['Private boundary', 'Personal reflection stays private', 'Permission rule', 'Private', 'Current'],
      ['Outcome', 'Weekly check-in completed', 'Both confirmed', 'Shared', '6 days ago']
    ],
    business: [
      ['Source record', 'Proposal value and next step', 'CRM example', 'Business', 'Today'],
      ['Decision', 'Protect delivery before new sales work', 'Leadership note', 'Leadership', 'Yesterday'],
      ['Outcome', 'Invoice reminder received', 'Connected account demo', 'Finance', '2 days ago']
    ],
    trainer: [
      ['Self-report', 'Energy is 7 of 10', 'Student check-in', 'Training', 'Today'],
      ['Evidence', 'Three sessions completed', 'Workout log demo', 'Training', 'This week'],
      ['Preference', 'Short cues during sets', 'Direct preference', 'Coach + student', 'Current']
    ],
    team: [
      ['Project truth', 'Review queue blocks two handoffs', 'Project board demo', 'Team', 'Today'],
      ['Decision', 'Release owner changed', 'Approved update', 'Project', 'Yesterday'],
      ['Derived insight', 'Reviewer load may affect launch', 'Analysis', 'Leadership', 'Today']
    ]
  };

  const inputDefinitions = [
    ['calendar', 'Calendar', 'Read schedule and availability'],
    ['email', 'Email', 'Find replies and commitments'],
    ['weather', 'Weather', 'Adjust timing and travel'],
    ['files', 'Files', 'Read approved project context'],
    ['finance', 'Finance', 'Surface balances and obligations'],
    ['spotify', 'Spotify', 'Select approved music'],
    ['goals', 'Goals', 'Direct attention and effort'],
    ['memory', 'Memory', 'Use corrections and outcomes'],
    ['public', 'Public research', 'Verify current external facts'],
    ['shared', 'Shared Space', 'Coordinate approved context']
  ];

  const activeInputs = new Set(['calendar', 'weather', 'goals', 'memory', 'public']);

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenarioId() {
    const id = document.body?.dataset.scenario;
    return data.scenarios[id] ? id : data.meta.defaultScenario;
  }

  function currentScenario() {
    return data.scenarios[currentScenarioId()] || data.scenarios[data.meta.defaultScenario];
  }

  function pointsFor(values, width = 420, height = 112, padding = 12) {
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;
    const range = Math.max(1, max - min);
    return values.map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(1, values.length - 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return [Number(x.toFixed(1)), Number(y.toFixed(1))];
    });
  }

  function weatherChartMarkup(scenario) {
    const temps = scenario.weather.hourly.map(item => Number(item.temp));
    const rain = scenario.weather.hourly.map(item => Number(item.rain));
    const points = pointsFor(temps);
    const line = points.map(point => point.join(',')).join(' ');
    const area = `${points[0][0]},112 ${line} ${points.at(-1)[0]},112`;
    const rainBars = rain.map((value, index) => {
      const x = 28 + index * 100;
      const barHeight = Math.max(5, Math.round(value * 0.38));
      return `<rect class="chart-rain" x="${x}" y="${110 - barHeight}" width="28" height="${barHeight}" rx="5"></rect>`;
    }).join('');
    const circles = points.map(([x, y]) => `<circle class="chart-point" cx="${x}" cy="${y}" r="4"></circle>`).join('');

    return `
      <div class="weather-chart-card">
        <div class="visual-source-row"><span>Demo weather</span><span>Freshness: current edition</span></div>
        <svg viewBox="0 0 420 120" role="img" aria-label="Temperature trend and rain probability across the next four weather periods">
          <line class="chart-grid-line" x1="12" y1="30" x2="408" y2="30"></line>
          <line class="chart-grid-line" x1="12" y1="70" x2="408" y2="70"></line>
          <line class="chart-grid-line" x1="12" y1="110" x2="408" y2="110"></line>
          ${rainBars}
          <polygon class="chart-area" points="${area}"></polygon>
          <polyline class="chart-line" points="${line}"></polyline>
          ${circles}
        </svg>
        <div class="chart-labels">${scenario.weather.hourly.map(item => `<span>${escapeHtml(item.time)} · ${escapeHtml(item.temp)}°</span>`).join('')}</div>
      </div>
      <aside class="best-window-card">
        <div><span>Recommended timing</span><strong>${escapeHtml(scenario.weather.advice)}</strong><p>The briefing combines conditions with the selected Space and today’s schedule.</p></div>
        <div class="best-window-meter" aria-label="Recommended window confidence"><i></i></div>
      </aside>`;
  }

  function ensureDocLinks() {
    const actions = $('.topbar-actions');
    if (actions && !$('#briefDocLink')) {
      const link = document.createElement('a');
      link.id = 'briefDocLink';
      link.className = 'doc-cta';
      link.href = '/doc/';
      link.textContent = 'Read the full system';
      actions.insertBefore(link, $('#mediaButton'));
    }

    const howPanel = $('[data-view-panel="how"]');
    if (howPanel && !$('#howDocBridge')) {
      const card = document.createElement('section');
      card.id = 'howDocBridge';
      card.className = 'doc-bridge-card visual-reveal';
      card.innerHTML = `
        <div><p class="eyebrow">FULL PRODUCT OVERVIEW</p><h2>The demo shows the experience. The document explains the operating model.</h2><p>Read the complete Spaces, memory, Goal Pulse, model independence, trust, backend and development-status explanation.</p></div>
        <div class="doc-bridge-actions"><a class="primary-button" href="/doc/">See the full Personal OS overview</a></div>`;
      howPanel.append(card);
    }
  }

  function mountTodayVisual() {
    const weatherCard = $('.weather-card');
    if (!weatherCard) return;
    let host = $('#todayVisualIntelligence');
    if (!host) {
      host = document.createElement('section');
      host.id = 'todayVisualIntelligence';
      host.className = 'visual-intelligence-shell visual-reveal';
      weatherCard.append(host);
    }
    host.innerHTML = `<div class="weather-intelligence">${weatherChartMarkup(currentScenario())}</div>`;
    installReveal(host);
  }

  function selectedWorkspaceLabel() {
    return $('[data-workspace-tab][aria-selected="true"]')?.textContent?.trim() || 'Current category';
  }

  function workspaceRows(scenario, label) {
    const selected = scenario.tabs.find(tab => tab.label === label) || scenario.tabs[0];
    const detail = scenario.details[selected?.id] || Object.values(scenario.details)[0];
    return (detail?.cards || []).map((card, index) => ({
      item: card.title,
      state: index === 0 ? 'Needs action' : (index === 1 ? 'Ready' : 'Review'),
      value: index === 0 ? 'High' : (index === 1 ? 'Medium' : 'Watch')
    }));
  }

  function workspaceMode(label) {
    const value = label.toLowerCase();
    if (/money|finance|cash|revenue|budget/.test(value)) return 'ledger';
    if (/well|fitness|health|training|progress|goal/.test(value)) return 'progress';
    if (/people|connection|communication|team|client|shared/.test(value)) return 'matrix';
    return 'operating';
  }

  function tableMarkup(rows) {
    return `<table class="data-table"><thead><tr><th>Item</th><th>Status</th><th>Priority</th></tr></thead><tbody>${rows.map(row => `<tr><td>${escapeHtml(row.item)}</td><td class="${row.state === 'Ready' ? 'status-ready' : 'status-review'}">${escapeHtml(row.state)}</td><td>${escapeHtml(row.value)}</td></tr>`).join('')}</tbody></table>`;
  }

  function workspaceVisualMarkup(scenario, label) {
    const rows = workspaceRows(scenario, label);
    const mode = workspaceMode(label);
    const stat = scenario.stats[0];

    if (mode === 'progress') {
      return `
        <div class="ring-visual">
          <small>Progress signal</small>
          <div class="ring-wrap">
            <svg class="progress-ring-svg" viewBox="0 0 120 120" width="116" height="116" role="img" aria-label="Seventy two percent progress">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" stroke-width="10"></circle>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue)" stroke-width="10" stroke-linecap="round" stroke-dasharray="226 314" transform="rotate(-90 60 60)"></circle>
              <text x="60" y="66" text-anchor="middle" fill="var(--ink-strong)" font-size="21" font-weight="800">72%</text>
            </svg>
            <div class="ring-copy"><strong>${escapeHtml(label)} trajectory</strong><p>Evidence, outcomes and recent check-ins can update this signal without turning one day into a permanent identity.</p></div>
          </div>
        </div>
        <div class="table-visual"><small>Recent evidence</small>${tableMarkup(rows)}</div>`;
    }

    if (mode === 'matrix') {
      return `
        <div class="matrix-visual"><small>Permission-aware ownership</small>${tableMarkup(rows)}</div>
        <div class="metric-visual"><small>${escapeHtml(stat.label)}</small><strong>${escapeHtml(stat.value)}</strong><div class="mini-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>${escapeHtml(stat.note)}</small></div>`;
    }

    if (mode === 'ledger') {
      return `
        <div class="table-visual"><small>Structured ledger example</small>${tableMarkup(rows)}</div>
        <div class="metric-visual"><small>Projected position</small><strong>${escapeHtml(scenario.stats.find(item => /cash|revenue|budget|money/i.test(item.label))?.value || scenario.stats[2].value)}</strong><div class="mini-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>Fictional values remain labeled until a protected finance connection exists.</small></div>`;
    }

    return `
      <div class="metric-visual"><small>${escapeHtml(stat.label)}</small><strong>${escapeHtml(stat.value)}</strong><div class="mini-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>${escapeHtml(stat.note)}</small></div>
      <div class="table-visual"><small>Operating details</small>${tableMarkup(rows)}</div>`;
  }

  function mountWorkspaceVisual() {
    const panel = $('#workspacePanel');
    if (!panel || panel.querySelector('.workspace-visual')) return;
    const scenario = currentScenario();
    const label = selectedWorkspaceLabel();
    const visual = document.createElement('section');
    visual.className = 'workspace-visual visual-reveal';
    visual.innerHTML = `
      <div class="workspace-visual-heading">
        <div><p class="eyebrow">DATA VIEW EXAMPLE</p><h3>${escapeHtml(label)} can use the component that fits its data.</h3><p>The future edition may select a chart, ledger, progress view, matrix or table after the relevant records are verified.</p></div>
        <div class="visual-source-row"><span>Demo data</span><span>Space scoped</span></div>
      </div>
      <div class="workspace-visual-grid">${workspaceVisualMarkup(scenario, label)}</div>`;
    panel.append(visual);
    installReveal(visual);
  }

  function visualStoryMarkup(scenario) {
    const bars = scenario.stats.map((item, index) => `<rect x="${22 + index * 58}" y="${88 - (index + 2) * 11}" width="32" height="${(index + 2) * 11}" rx="6" class="chart-rain"></rect>`).join('');
    return `
      <section class="full-section visual-story-section visual-reveal" id="all-visuals">
        <div class="full-section-heading"><div><p class="eyebrow">VISUAL INTELLIGENCE</p><h2>The interface chooses visuals when they clarify a decision.</h2></div><button class="text-button" type="button" data-go-view="workspace">Open the focused data view <span aria-hidden="true">→</span></button></div>
        <p class="full-lead">Charts, ledgers, timelines and structured records appear when they explain movement, ownership, evidence or risk. They remain quiet when a sentence is enough.</p>
        <div class="visual-story-grid">
          <article><span class="data-badge">Trend</span><h3>Movement over time</h3><svg viewBox="0 0 250 105" role="img" aria-label="Example changing signal bars">${bars}<line class="chart-grid-line" x1="12" y1="90" x2="238" y2="90"></line></svg><p>Use a graph when direction changes the next action.</p></article>
          <article><span class="data-badge">Structured data</span><h3>Spreadsheet-like operating view</h3>${tableMarkup(workspaceRows(scenario, scenario.tabs[0].label))}<p>Use a table when values, status and ownership need comparison.</p></article>
          <article><span class="data-badge">Decision</span><h3>Goal Pulse</h3><p>${escapeHtml(goalProfiles[currentScenarioId()].goal)}</p><div class="goal-metric-grid"><div><span>Trajectory</span><strong>${escapeHtml(goalProfiles[currentScenarioId()].trajectory)}</strong></div><div><span>Confidence</span><strong>${escapeHtml(goalProfiles[currentScenarioId()].confidence)}</strong></div></div></article>
        </div>
      </section>`;
  }

  function goalPulseMarkup() {
    const profile = goalProfiles[currentScenarioId()];
    return `
      <section class="full-section goal-pulse-demo visual-reveal" id="all-goal-pulse">
        <div class="goal-pulse-heading"><div><p class="eyebrow">GOALS GIVE DIRECTION</p><h2>Goal Pulse connects today’s information to movement.</h2><p>The system can expose the current goal, difficulty, blocker, useful question, evidence and next action without turning the Brief into a full project manager.</p></div><a class="text-button" href="/doc/#goals">See the complete Goal Pulse model <span aria-hidden="true">→</span></a></div>
        <div class="goal-pulse-board">
          <article class="goal-pulse-main"><span class="data-badge">Current goal</span><h3>${escapeHtml(profile.goal)}</h3><div class="goal-metric-grid"><div><span>Difficulty</span><strong>${escapeHtml(profile.difficulty)}</strong></div><div><span>Trajectory</span><strong>${escapeHtml(profile.trajectory)}</strong></div><div><span>Blocker</span><strong>${escapeHtml(profile.blocker)}</strong></div><div><span>Confidence</span><strong>${escapeHtml(profile.confidence)}</strong></div></div></article>
          <article class="goal-pulse-question"><span>One useful question</span><strong>${escapeHtml(profile.question)}</strong><p>The answer can alter the action, effort and success condition.</p></article>
          <article class="goal-pulse-action"><span>Recommended next action</span><strong>${escapeHtml(profile.action)}</strong><p>Any external write or consequential action remains approval controlled.</p></article>
        </div>
      </section>`;
  }

  function memoryMarkup() {
    const records = memoryProfiles[currentScenarioId()];
    return `
      <section class="full-section memory-inspector visual-reveal" id="all-memory">
        <div class="memory-inspector-heading"><div><p class="eyebrow">STRUCTURED MEMORY</p><h2>Continuity should preserve sources, freshness and correction.</h2><p>These fictional records demonstrate how session, daily, short-term, long-term, shared, source and derived memory remain distinguishable.</p></div><a class="text-button" href="/doc/#memory">Read the seven-layer memory model <span aria-hidden="true">→</span></a></div>
        <div class="memory-record-grid">${records.map(([type, title, source, visibility, freshness]) => `<article class="memory-record"><span>${escapeHtml(type)}</span><h3>${escapeHtml(title)}</h3><p>A user can inspect, correct, restrict, export or remove this record.</p><div class="memory-meta"><div><span>Source</span><strong>${escapeHtml(source)}</strong></div><div><span>Freshness</span><strong>${escapeHtml(freshness)}</strong></div><div><span>Visibility</span><strong>${escapeHtml(visibility)}</strong></div><div><span>Action</span><strong>Reviewable</strong></div></div></article>`).join('')}</div>
      </section>`;
  }

  function permissionMarkup(scenario) {
    return `
      <section class="full-section permission-matrix visual-reveal" id="all-permissions">
        <div class="memory-inspector-heading"><div><p class="eyebrow">SPACE BOUNDARIES</p><h2>One record can support several contexts without exposing everything.</h2><p>The permission matrix demonstrates source, freshness, visibility and action scope across private and shared use.</p></div><button class="text-button" type="button" data-go-view="spaces">Open the focused Spaces view <span aria-hidden="true">→</span></button></div>
        <div class="permission-table-wrap"><table class="permission-table"><thead><tr><th>Record</th><th>Source</th><th>Freshness</th><th>Visibility</th><th>Action scope</th></tr></thead><tbody><tr><td>${escapeHtml(scenario.next.title)}</td><td>Calendar demo</td><td>Current edition</td><td>Private + approved Space</td><td>Read, draft, ask first</td></tr><tr><td>${escapeHtml(scenario.recommendation.title)}</td><td>Goal + analysis</td><td>Generated today</td><td>${escapeHtml(scenario.label)} context</td><td>Suggestion only</td></tr><tr><td>${escapeHtml(scenario.space.shared[0])}</td><td>Shared Space record</td><td>Member confirmed</td><td>Approved members</td><td>Update after approval</td></tr><tr><td>${escapeHtml(scenario.space.private[0])}</td><td>Private profile</td><td>User controlled</td><td>Private</td><td>Excluded from sharing</td></tr></tbody></table></div>
      </section>`;
  }

  function inputLabMarkup() {
    return `
      <section class="full-section input-lab visual-reveal" id="all-inputs">
        <div class="input-lab-heading"><div><p class="eyebrow">HOW THE BACKEND EVENTUALLY FEEDS THE BRIEF</p><h2>Turn approved inputs on and watch the edition change.</h2><p>This interaction demonstrates the intended FastAPI, PostgreSQL, API, MCP and connector contract without claiming those private services are active here.</p></div><a class="text-button" href="/doc/#architecture">See the full architecture <span aria-hidden="true">→</span></a></div>
        <div class="input-toggle-grid" id="inputToggleGrid">${inputDefinitions.map(([id, label, detail]) => `<button class="input-toggle" type="button" data-input-toggle="${id}" aria-pressed="${activeInputs.has(id)}"><span>${escapeHtml(label)}</span><small>${escapeHtml(detail)}</small></button>`).join('')}</div>
        <div class="pipeline-grid">
          <div class="pipeline-steps"><ol><li><span>1</span><div><strong>Authorize and gather</strong><p>Read only the sources approved for this user and Space.</p></div></li><li><span>2</span><div><strong>Normalize records</strong><p>Convert events, messages, files and facts into typed product state.</p></div></li><li><span>3</span><div><strong>Apply permissions</strong><p>Separate private, shared, role-based and excluded context.</p></div></li><li><span>4</span><div><strong>Research and verify</strong><p>Compare current sources and label uncertainty or missing information.</p></div></li><li><span>5</span><div><strong>Compose the edition</strong><p>Select the smallest useful modules, charts, questions and actions.</p></div></li><li><span>6</span><div><strong>Confirm and learn</strong><p>Ask before consequential action and record the confirmed outcome.</p></div></li></ol></div>
          <div class="pipeline-preview" id="pipelinePreview" aria-live="polite"></div>
        </div>
      </section>`;
  }

  function modulesForInputs() {
    const modules = [['Executive overview', 'Always present', 'Goals + current state']];
    const candidates = {
      calendar: ['Timeline', 'Schedule and availability', 'Calendar'],
      email: ['Reply watch', 'Commitments needing attention', 'Email'],
      weather: ['Weather timing', 'Conditions that change the plan', 'Weather'],
      files: ['Project evidence', 'Relevant approved documents', 'Files'],
      finance: ['Cash watch', 'Balances and obligations', 'Finance'],
      spotify: ['Morning soundtrack', 'Approved daily music', 'Spotify'],
      goals: ['Goal Pulse', 'Blocker, question and next action', 'Goals'],
      memory: ['Continuity', 'Corrections, preferences and outcomes', 'Memory'],
      public: ['Research update', 'Verified current external information', 'Public sources'],
      shared: ['Shared coordination', 'Approved people, plans and ownership', 'Space records']
    };
    activeInputs.forEach(id => {
      if (candidates[id]) modules.push(candidates[id]);
    });
    return modules.slice(0, 6);
  }

  function renderPipelinePreview() {
    const host = $('#pipelinePreview');
    if (!host) return;
    const modules = modulesForInputs();
    host.innerHTML = `
      <div class="pipeline-preview-top"><strong>Generated interactive edition</strong><span>${activeInputs.size} approved inputs</span></div>
      <div class="pipeline-module-grid">${modules.map(([title, detail, source]) => `<article><span>${escapeHtml(source)}</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></article>`).join('')}</div>
      <div class="pipeline-trust-row"><div><span>Source</span><strong>Visible per module</strong></div><div><span>Freshness</span><strong>Checked before use</strong></div><div><span>Visibility</span><strong>Space scoped</strong></div><div><span>Action</span><strong>Approval gated</strong></div></div>`;
  }

  function statusMarkup() {
    return `
      <section class="full-section status-demo visual-reveal" id="all-status">
        <div class="status-demo-heading"><div><p class="eyebrow">CURRENT REALITY</p><h2>The demo and production platform are deliberately separated.</h2><p>The experience can be ambitious while every private connection, memory and action stays honestly labeled.</p></div><a class="text-button" href="/doc/#status">Read the complete status and roadmap <span aria-hidden="true">→</span></a></div>
        <div class="status-demo-columns"><article class="status-demo-column"><span class="data-badge">Demonstrated</span><ul><li>Five adaptive briefing contexts</li><li>Focused and Everything views</li><li>Weather, stats, music and structured demo records</li><li>Spaces, memory and permission examples</li><li>Visual component selection and backend-input simulation</li></ul></article><article class="status-demo-column"><span class="data-badge">Planned</span><ul><li>Secure accounts and server sessions</li><li>FastAPI services and PostgreSQL product state</li><li>Protected private memory and connectors</li><li>Scheduled research and briefing jobs</li><li>Approval-gated external actions and audit history</li></ul></article></div>
      </section>`;
  }

  function documentBridgeMarkup() {
    return `
      <section class="doc-bridge-card visual-reveal" id="everythingDocBridge">
        <div><p class="eyebrow">THE COMPLETE OPERATING MODEL</p><h2>Go deeper into Spaces, memory, goals, models, trust and architecture.</h2><p>The briefing demonstrates how the product feels. The Personal OS overview explains why the layers exist and what remains planned.</p></div>
        <div class="doc-bridge-actions"><a class="primary-button" href="/doc/">See the full Personal OS overview</a><button class="secondary-button" type="button" data-go-view="today">Return to Today</button></div>
      </section>`;
  }

  function updateEverythingJumpNav() {
    const host = $('#everythingJumpNav');
    if (!host) return;
    const items = [
      ['all-overview', 'Overview'],
      ['all-weather', 'Weather'],
      ['all-signals', 'Signals'],
      ['all-visuals', 'Visuals'],
      ['all-flow', 'Flow'],
      ['all-goal-pulse', 'Goals'],
      ['all-workspace', 'Workspace'],
      ['all-spaces', 'Spaces'],
      ['all-memory', 'Memory'],
      ['all-permissions', 'Permissions'],
      ['all-adaptive', 'Adaptive brief'],
      ['all-inputs', 'Inputs'],
      ['all-alarm', 'Alarm'],
      ['all-status', 'Status'],
      ['all-privacy', 'Privacy']
    ];
    host.innerHTML = items.map(([id, label]) => `<a href="#${id}">${escapeHtml(label)}</a>`).join('');
  }

  function enhanceEverything() {
    const content = $('#everythingContent');
    if (!content || !$('#all-overview', content)) return;
    const scenario = currentScenario();

    $('#all-visuals')?.remove();
    $('#all-goal-pulse')?.remove();
    $('#all-memory')?.remove();
    $('#all-permissions')?.remove();
    $('#all-inputs')?.remove();
    $('#all-status')?.remove();
    $('#everythingDocBridge')?.remove();

    $('#all-signals')?.insertAdjacentHTML('afterend', visualStoryMarkup(scenario));
    $('#all-flow')?.insertAdjacentHTML('afterend', goalPulseMarkup());
    $('#all-spaces')?.insertAdjacentHTML('afterend', `${memoryMarkup()}${permissionMarkup(scenario)}`);
    $('#all-adaptive')?.insertAdjacentHTML('afterend', inputLabMarkup());
    $('#all-alarm')?.insertAdjacentHTML('afterend', statusMarkup());
    $('.full-end-nav')?.insertAdjacentHTML('beforebegin', documentBridgeMarkup());

    updateEverythingJumpNav();
    renderPipelinePreview();
    $$('.visual-reveal', content).forEach(installReveal);
  }

  function installReveal(node) {
    if (!node || node.classList.contains('is-visible')) return;
    if (!('IntersectionObserver' in window) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    observer.observe(node);
  }

  function installEvents() {
    document.addEventListener('briefdemo:scenariochange', () => {
      mountTodayVisual();
      queueMicrotask(() => {
        mountWorkspaceVisual();
        enhanceEverything();
      });
    });

    document.addEventListener('briefdemo:everythingrender', () => queueMicrotask(enhanceEverything));

    document.addEventListener('click', event => {
      const inputButton = event.target.closest('[data-input-toggle]');
      if (inputButton) {
        const id = inputButton.dataset.inputToggle;
        if (activeInputs.has(id)) activeInputs.delete(id);
        else activeInputs.add(id);
        inputButton.setAttribute('aria-pressed', String(activeInputs.has(id)));
        renderPipelinePreview();
        return;
      }

      if (event.target.closest('[data-workspace-tab]') || event.target.closest('[data-primary-view="workspace"]')) {
        queueMicrotask(mountWorkspaceVisual);
      }

      if (event.target.closest('[data-primary-view="everything"]')) {
        queueMicrotask(enhanceEverything);
      }
    });

    const workspacePanel = $('#workspacePanel');
    if (workspacePanel && 'MutationObserver' in window) {
      const observer = new MutationObserver(() => queueMicrotask(mountWorkspaceVisual));
      observer.observe(workspacePanel, { childList: true });
    }
  }

  function init() {
    ensureDocLinks();
    mountTodayVisual();
    mountWorkspaceVisual();
    enhanceEverything();
    installEvents();
    $$('.visual-reveal').forEach(installReveal);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
