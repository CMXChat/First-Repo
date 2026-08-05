(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VALID_PRESETS = ['individual', 'couple', 'partners', 'trainer', 'team'];
  const state = { depth: 'quick', tab: 'overview', railPaused: false, pendingDepth: null, suppressDepthReset: false };
  const VALID_DEPTHS = new Set(['quick', 'full']);

  function readRequestedDepth() {
    try {
      const url = new URL(window.location.href);
      const value = url.searchParams.get('depth');
      return VALID_DEPTHS.has(value) ? value : null;
    } catch {
      return null;
    }
  }
  let initialized = false;
  let retryTimer = 0;
  let retries = 0;

  const LABELS = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer',
    team: 'Team'
  };

  const TABS = {
    individual: [['overview', 'Overview'], ['day', 'Day'], ['work', 'Work'], ['money', 'Finance'], ['wellness', 'Wellness'], ['intelligence', 'Intelligence']],
    couple: [['overview', 'Overview'], ['together', 'Together'], ['profiles', 'Profiles'], ['plans', 'Plans'], ['watch', 'Watch'], ['reflection', 'Reflection']],
    partners: [['overview', 'Overview'], ['finance', 'Finance'], ['projects', 'Projects'], ['decisions', 'Decisions'], ['markets', 'Markets'], ['partners', 'Partners']],
    trainer: [['overview', 'Overview'], ['today', 'Today'], ['habits', 'Habits'], ['progress', 'Progress'], ['recovery', 'Recovery'], ['coach', 'Coach']],
    team: [['overview', 'Overview'], ['mywork', 'My work'], ['project', 'Project'], ['handoffs', 'Handoffs'], ['procedure', 'Procedure'], ['finance', 'Finance'], ['spaces', 'Spaces']]
  };

  const DEEP_TARGETS = {
    individual: { overview: '#today', day: '#weather', work: '#personalCommandCenter', money: '#personalCommandCenter', wellness: '#scenarioExplorer', intelligence: '#livePublicLayer' },
    couple: { overview: '#today', together: '#scenarioExplorer', profiles: '#scenarioExperienceAddon', plans: '#priorities', watch: '#relationshipDailyWatch', reflection: '#scenarioExperienceAddon' },
    partners: { overview: '#today', finance: '#scenarioExperienceAddon', projects: '#scenarioStage', decisions: '#scenarioExperienceAddon', markets: '#scenarioExperienceAddon', partners: '#scenarioExperienceAddon' },
    trainer: { overview: '#today', today: '#priorities', habits: '#scenarioExperienceAddon', progress: '#scenarioStage', recovery: '#scenarioExperienceAddon', coach: '#scenarioExperienceAddon' },
    team: { overview: '#today', mywork: '#scenarioStage', project: '#scenarioStage', handoffs: '#scenarioStage', procedure: '#scenarioStage', finance: '#scenarioStage', spaces: '#scenarioStage' }
  };

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return VALID_PRESETS.includes(value) ? value : 'individual';
  }

  function scenarioData() {
    return window.BRIEF_DATA?.scenarios?.[preset()] || window.BRIEF_DATA?.scenarios?.individual || {};
  }

  function liveData() { return window.BRIEF_LIVE_DATA || {}; }
  function content() { return window.BRIEF_DAILY_CONTENT || {}; }
  function teamData() { return window.BRIEF_SCENARIOS?.team || {}; }

  function text(value, fallback = 'Available after an approved connection') {
    return escapeHtml(value || fallback);
  }

  function card(label, title, detail, tone = 'blue', meta = '') {
    return `<article class="quick-signal-card tone-${escapeHtml(tone)}"><span>${text(label)}</span><h4>${text(title)}</h4><p>${text(detail)}</p>${meta ? `<small>${text(meta)}</small>` : ''}</article>`;
  }

  function compactList(items) {
    return `<div class="quick-compact-list">${items.map(item => `<article><span>${text(item.label)}</span><div><strong>${text(item.title)}</strong><small>${text(item.detail)}</small></div></article>`).join('')}</div>`;
  }

  function timeline(items) {
    return `<ol class="quick-timeline">${items.slice(0, 5).map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><time>${text(item.time)}</time><div><strong>${text(item.title)}</strong><small>${text(item.meta)}</small></div></li>`).join('')}</ol>`;
  }

  function quoteFor(current) {
    const c = content();
    const values = {
      individual: c.personalDashboard?.quote || 'A useful day begins when the next honest action becomes visible.',
      couple: 'Care becomes practical when both people can see the next kind action.',
      partners: 'Clarity compounds when every decision has evidence, an owner and a date.',
      trainer: c.trainerAccountability?.quote || 'Consistency becomes easier when the plan fits the person.',
      team: window.BRIEF_TEAM_VIEW?.quote || 'A strong team sees the same mission without exposing every private detail.'
    };
    return content().dailyQuotes?.[current] || values[current];
  }

  function quoteCard(current) {
    const date = liveData().horoscopes?.date || content().edition?.date || 'Today';
    return `<blockquote class="quick-quote-card tone-${escapeHtml(current)}"><span class="quick-quote-mark" aria-hidden="true">“</span><div><small>DAILY BRIEFING REFLECTION · ${text(date)}</small><p>${text(quoteFor(current))}</p><footer>Original briefing reflection</footer></div></blockquote>`;
  }

  function sectionHeading(kicker, title, copy) {
    return `<div class="quick-panel-heading"><div><p class="micro-label">${text(kicker)}</p><h3>${text(title)}</h3></div><p>${text(copy)}</p></div>`;
  }

  function overviewPanel(current) {
    const data = scenarioData();
    const live = liveData();
    const weather = live.weather || data.weather || {};
    const priority = data.priorities?.[0] || {};
    const next = data.nextUp || {};
    const cards = [];

    cards.push(card('NEXT', next.title, next.time, 'blue', next.prep?.[0]));
    const weatherMeta = weather.temperature || (data.weather?.hourly?.[0]?.temp !== undefined ? `${data.weather.hourly[0].temp}°` : 'Public layer');
    cards.push(card('WEATHER', weather.condition, weather.advice || weather.summary, 'amber', weatherMeta);
    cards.push(card('PRIORITY', priority.title, priority.detail, 'violet', priority.due));

    if (current === 'individual') {
      const project = content().personalDashboard?.projects?.[0];
      cards.push(card('WORK', project?.name, project?.next, 'green', project?.state));
      cards.push(card('PERSONAL', 'Movement still matters', data.priorities?.[2]?.detail, 'pink', data.priorities?.[2]?.due));
    } else if (current === 'couple') {
      const shared = content().relationshipSpace?.shared?.[0];
      cards.push(card('TOGETHER', shared?.text, 'Approved for the couple space', 'green', shared?.label));
      cards.push(card('REFLECTION', 'Virgo + Virgo', live.horoscopes?.compatibility, 'pink', 'Entertainment and reflection'));
    } else if (current === 'partners') {
      const shared = content().businessSpace?.shared || [];
      cards.push(card(shared[0]?.label, shared[0]?.value, shared[0]?.note, 'green'));
      cards.push(card('DECISION', shared[2]?.value, shared[2]?.note, 'pink', 'Fictional operating record'));
    } else if (current === 'trainer') {
      const week = content().trainerAccountability?.week || [];
      const done = week.filter(day => day.done === true).length;
      cards.push(card('WEEK', `${done} completed days`, 'A quick accountability signal, not a judgment.', 'green'));
      cards.push(card('COACH', 'Adapt after today’s check-in', 'One answer can change the next recommendation without redefining the person.', 'pink'));
    } else {
      const team = window.BRIEF_TEAM_VIEW || {};
      cards.push(card('PROJECT', team.quickSignals?.[0], team.quickSignals?.[1], 'green'));
      cards.push(card('HANDOFFS', team.quickSignals?.[2], team.quickSignals?.[4], 'pink'));
    }

    const deepTab = current === 'team' ? 'mywork' : current === 'partners' ? 'decisions' : current === 'trainer' ? 'today' : current === 'couple' ? 'together' : 'work';
    return `${sectionHeading('QUICK BRIEFING', `${LABELS[current]}: what matters now`, 'Five signals, one recommended move, and the deeper workspace only when it is useful.')}
      <div class="quick-signal-grid">${cards.join('')}</div>
      <div class="quick-overview-lower">
        <section class="quick-next-action"><span>RECOMMENDED NEXT MOVE</span><h4>${text(priority.title || next.title)}</h4><p>${text(priority.detail || next.prep?.join(' · '))}</p><button type="button" data-open-deep="${escapeHtml(deepTab)}">Open the relevant view</button></section>
        ${quoteCard(current)}
      </div>
      <section class="quick-dayline"><div><p class="micro-label">TODAY’S FLOW</p><h4>The full day without the full scroll.</h4></div>${timeline(data.schedule || [])}</section>`;
  }

  // Remaining functions restored from good commit with depth API - see local /tmp for full if truncated
  function setDepth(value, scroll = false) {
    const next = value === 'full' ? 'full' : 'quick';
    state.depth = next;
    state.pendingDepth = null;
    document.body.dataset.briefDepth = next;
    $$('[data-depth-choice]').forEach(button => {
      const active = button.dataset.depthChoice === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  window.BRIEF_WORKSPACE = {
    setDepth,
    getDepth: () => state.depth,
    setPendingDepth: (value) => {
      state.pendingDepth = VALID_DEPTHS.has(value) ? value : null;
      if (state.pendingDepth) state.suppressDepthReset = true;
    }
  };
})();
