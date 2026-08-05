(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VERSION = '20260804-1';
  const STORAGE_PREFIX = 'cmxBriefDemo:personalOS';

  const APP_MAP = {
    individual: [
      ['today', 'Today', 'Command'],
      ['day', 'Day', 'Timeline'],
      ['actions', 'Work', 'Actions'],
      ['spaces', 'Private', 'Spaces'],
      ['intelligence', 'Insight', 'Intelligence'],
      ['system', 'System', 'Directory']
    ],
    couple: [
      ['today', 'Today', 'Command'],
      ['day', 'Together', 'Timeline'],
      ['actions', 'Plans', 'Actions'],
      ['spaces', 'Profiles', 'Spaces'],
      ['intelligence', 'Reflection', 'Intelligence'],
      ['system', 'System', 'Directory']
    ],
    partners: [
      ['today', 'Today', 'Command'],
      ['day', 'Operating', 'Timeline'],
      ['actions', 'Decisions', 'Actions'],
      ['spaces', 'Partners', 'Spaces'],
      ['intelligence', 'Signals', 'Intelligence'],
      ['system', 'System', 'Directory']
    ],
    trainer: [
      ['today', 'Today', 'Command'],
      ['day', 'Session', 'Timeline'],
      ['actions', 'Training', 'Actions'],
      ['spaces', 'Coach', 'Spaces'],
      ['intelligence', 'Progress', 'Intelligence'],
      ['system', 'System', 'Directory']
    ],
    team: [
      ['today', 'Today', 'Command'],
      ['day', 'Project', 'Timeline'],
      ['actions', 'My Work', 'Actions'],
      ['spaces', 'Spaces', 'Spaces'],
      ['intelligence', 'Handoffs', 'Intelligence'],
      ['system', 'System', 'Directory']
    ]
  };

  const ICONS = {
    today: '◉',
    day: '◷',
    actions: '✓',
    spaces: '◇',
    intelligence: '⌁',
    system: '⌘'
  };

  const state = {
    initialized: false,
    active: 'today',
    previous: 'today',
    autoTimer: 0,
    autoRunning: false,
    clockTimer: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchActive: false
  };

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return APP_MAP[value] ? value : 'individual';
  }

  function apps() {
    return (APP_MAP[preset()] || APP_MAP.individual).map(([id, label, eyebrow]) => ({ id, label, eyebrow }));
  }

  function data() {
    return window.BRIEF_DATA?.scenarios?.[preset()] || window.BRIEF_DATA?.scenarios?.individual || {};
  }

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function compactText(value, max = 108) {
    const text = String(value || '').trim();
    return text.length > max ? text.slice(0, max).trim() : text;
  }

  function currentApp() {
    return apps().find(app => app.id === state.active) || apps()[0];
  }

  function activeIndex() {
    return Math.max(0, apps().findIndex(app => app.id === state.active));
  }

  function completedKey(id) {
    return `${STORAGE_PREFIX}:done:${preset()}:${id}`;
  }

  function isCompleted(id) {
    try { return localStorage.getItem(completedKey(id)) === '1'; } catch { return false; }
  }

  function setCompleted(id, completed) {
    try {
      if (completed) localStorage.setItem(completedKey(id), '1');
      else localStorage.removeItem(completedKey(id));
    } catch {}
  }

  function createShell() {
    if ($('#briefPersonalOS')) return;
    const app = $('#briefApp');
    const header = $('#briefSystemHeader');
    if (!app || !header) return;

    const shell = document.createElement('section');
    shell.id = 'briefPersonalOS';
    shell.className = 'brief-personal-os';
    shell.setAttribute('aria-label', 'Personal briefing operating system');
    shell.innerHTML = `
      <aside class="brief-os-rail" aria-label="Briefing applications">
        <div class="brief-os-identity">
          <button type="button" data-os-switcher aria-label="Switch briefing">
            <span class="brief-os-identity-orb" aria-hidden="true"></span>
            <span><small>PERSONAL OS</small><strong id="briefOsIdentityLabel">Personal</strong></span>
          </button>
        </div>
        <nav id="briefOsNav" class="brief-os-nav"></nav>
        <div class="brief-os-rail-footer">
          <button type="button" data-os-command><span>›_</span><small>Command</small></button>
          <button type="button" data-os-detail="#today"><span>↗</span><small>Full report</small></button>
        </div>
      </aside>

      <div class="brief-os-main">
        <header class="brief-os-commandbar">
          <div>
            <span id="briefOsEyebrow">COMMAND</span>
            <h1 id="briefOsTitle">Today</h1>
          </div>
          <div class="brief-os-commandbar-meta">
            <span id="briefOsPosition">1 / 6</span>
            <time id="briefOsClock"></time>
          </div>
          <div class="brief-os-commandbar-actions">
            <button type="button" data-os-auto aria-pressed="false">Guided flow</button>
            <button type="button" data-os-prev aria-label="Previous application">←</button>
            <button type="button" data-os-next aria-label="Next application">→</button>
          </div>
        </header>

        <div class="brief-os-viewport" id="briefOsViewport">
          <div class="brief-os-track" id="briefOsTrack"></div>
        </div>

        <footer class="brief-os-flowbar">
          <div id="briefOsDots" aria-label="Application position"></div>
          <p id="briefOsFlowHint">Move through the day by priority, or open any app directly.</p>
          <button type="button" data-os-next-label>Next: Day →</button>
        </footer>
      </div>
    `;

    header.insertAdjacentElement('afterend', shell);

    const returnButton = document.createElement('button');
    returnButton.id = 'briefOsReturn';
    returnButton.className = 'brief-os-return';
    returnButton.type = 'button';
    returnButton.dataset.osReturn = '';
    returnButton.innerHTML = '<span>←</span><strong>Return to Personal OS</strong>';
    document.body.appendChild(returnButton);
  }

  function renderToday(app) {
    const scenario = data();
    const next = scenario.nextUp || {};
    const priority = scenario.priorities?.[0] || {};
    const weather = scenario.weather || {};
    const schedule = scenario.schedule || [];
    const second = scenario.priorities?.[1] || {};
    return `
      <article class="brief-os-screen brief-os-screen-today" data-os-screen="${app.id}">
        <div class="brief-os-screen-grid is-command">
          <section class="brief-os-command-card">
            <div class="brief-os-card-label"><span>NOW</span><small>${escapeHtml(window.BRIEF_DATA?.edition?.date || 'Today')}</small></div>
            <p class="brief-os-greeting">${escapeHtml($('#greeting')?.textContent || 'Your briefing is ready.')}</p>
            <h2>${escapeHtml(priority.title || next.title || 'Choose the next useful move.')}</h2>
            <p>${escapeHtml(compactText(priority.detail || 'Your highest-value action is ready. The rest of the system stays one step away.'))}</p>
            <div class="brief-os-primary-actions">
              <button type="button" data-os-open="actions">Open priority</button>
              <button type="button" data-os-open="day">See today’s flow</button>
            </div>
          </section>

          <section class="brief-os-next-card">
            <span>NEXT UP</span>
            <h3>${escapeHtml(next.title || 'No scheduled event')}</h3>
            <p>${escapeHtml(next.time || schedule[0]?.time || 'Open the Day app')}</p>
            <ul>${(next.prep || []).slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            <button type="button" data-os-open="day">Open timeline →</button>
          </section>

          <section class="brief-os-mini-card">
            <span>CONTEXT</span>
            <strong>${escapeHtml(weather.condition || 'Current context')}</strong>
            <p>${escapeHtml(compactText(weather.advice || 'Timing and context can change the plan.', 92))}</p>
          </section>

          <section class="brief-os-mini-card">
            <span>AFTER THAT</span>
            <strong>${escapeHtml(second.title || schedule[1]?.title || 'Review the next decision')}</strong>
            <p>${escapeHtml(compactText(second.due || second.detail || schedule[1]?.meta || 'The system will keep the sequence clear.', 92))}</p>
          </section>
        </div>
      </article>`;
  }

  function renderDay(app) {
    const scenario = data();
    const schedule = scenario.schedule || [];
    const hourly = scenario.weather?.hourly || [];
    const weather = scenario.weather || {};
    return `
      <article class="brief-os-screen" data-os-screen="${app.id}">
        <div class="brief-os-screen-heading">
          <div><span>${escapeHtml(app.eyebrow)}</span><h2>${escapeHtml(app.label)} flow</h2></div>
          <p>${escapeHtml(compactText(weather.advice || 'Time, conditions and commitments are arranged into one useful sequence.', 126))}</p>
        </div>
        <div class="brief-os-day-layout">
          <section class="brief-os-timeline-panel">
            <header><span>SEQUENCE</span><button type="button" data-os-detail="#schedule">Detailed schedule ↗</button></header>
            <div class="brief-os-timeline">
              ${schedule.slice(0, 6).map((item, index) => `
                <article class="${index === 0 ? 'is-next' : ''}">
                  <time>${escapeHtml(item.time || '')}</time>
                  <i></i>
                  <div><strong>${escapeHtml(item.title || '')}</strong><small>${escapeHtml(item.meta || '')}</small></div>
                </article>`).join('') || '<p>No schedule rows are available.</p>'}
            </div>
          </section>
          <aside class="brief-os-context-panel">
            <div><span>WEATHER WINDOW</span><strong>${escapeHtml(weather.condition || 'Current conditions')}</strong><p>${escapeHtml(weather.location || '')}</p></div>
            <div class="brief-os-hour-strip">
              ${hourly.slice(0, 4).map(item => `<span><small>${escapeHtml(item.time || '')}</small><strong>${escapeHtml(item.temp ?? '')}°</strong><em>${escapeHtml(item.condition || '')}</em></span>`).join('')}
            </div>
            <button type="button" data-os-open="actions">Continue to priorities →</button>
          </aside>
        </div>
      </article>`;
  }

  function renderActions(app) {
    const priorities = data().priorities || [];
    return `
      <article class="brief-os-screen" data-os-screen="${app.id}">
        <div class="brief-os-screen-heading">
          <div><span>${escapeHtml(app.eyebrow)}</span><h2>${escapeHtml(app.label)} queue</h2></div>
          <p>One owner, one next move, one visible outcome. Large cards have been replaced with a compact operating queue.</p>
        </div>
        <div class="brief-os-action-layout">
          <section class="brief-os-action-list">
            ${priorities.slice(0, 6).map((item, index) => {
              const done = isCompleted(item.id || String(index));
              return `<article class="${done ? 'is-complete' : ''}">
                <button type="button" data-os-complete="${escapeHtml(item.id || String(index))}" aria-pressed="${done}">
                  <span>${done ? '✓' : String(index + 1).padStart(2, '0')}</span>
                </button>
                <div><strong>${escapeHtml(item.title || '')}</strong><p>${escapeHtml(compactText(item.detail || '', 130))}</p><small>${escapeHtml([item.owner, item.due, item.status].filter(Boolean).join(' · '))}</small></div>
                <button type="button" data-os-detail="#priorities">Open ↗</button>
              </article>`;
            }).join('') || '<p>No priorities are available.</p>'}
          </section>
          <aside class="brief-os-decision-card">
            <span>NEXT DECISION</span>
            <strong>${escapeHtml(priorities.find(item => !isCompleted(item.id))?.title || 'Queue cleared')}</strong>
            <p>${escapeHtml(compactText(priorities.find(item => !isCompleted(item.id))?.detail || 'Review the system or move to the next operating space.', 120))}</p>
            <button type="button" data-os-open="spaces">Continue to ${escapeHtml(apps().find(item => item.id === 'spaces')?.label || 'Spaces')} →</button>
          </aside>
        </div>
      </article>`;
  }

  function renderSpaces(app) {
    const shared = data().shared || {};
    const privateItems = shared.private || [];
    const sharedItems = shared.shared || [];
    return `
      <article class="brief-os-screen" data-os-screen="${app.id}">
        <div class="brief-os-screen-heading">
          <div><span>${escapeHtml(app.eyebrow)}</span><h2>${escapeHtml(app.label)} boundaries</h2></div>
          <p>Private context and approved collaboration are separated into two clear panes instead of another long explanation section.</p>
        </div>
        <div class="brief-os-space-layout">
          <section>
            <header><span>PRIVATE</span><small>Only this profile</small></header>
            ${privateItems.slice(0, 4).map(item => `<article><span>${escapeHtml(item.label || 'Private')}</span><strong>${escapeHtml(item.title || '')}</strong><p>${escapeHtml(compactText(item.note || '', 115))}</p></article>`).join('') || '<p>No private examples are available.</p>'}
          </section>
          <section class="is-shared">
            <header><span>APPROVED SPACE</span><small>Deliberately shared</small></header>
            ${sharedItems.slice(0, 4).map(item => `<article><span>${escapeHtml(item.label || 'Shared')}</span><strong>${escapeHtml(item.title || '')}</strong><p>${escapeHtml(compactText(item.note || '', 115))}</p></article>`).join('') || '<p>No shared examples are available.</p>'}
          </section>
        </div>
      </article>`;
  }

  function renderIntelligence(app) {
    const scenario = data();
    const priorities = scenario.priorities || [];
    const metrics = scenario.weather?.metrics || [];
    const schedule = scenario.schedule || [];
    const risks = priorities.filter(item => /risk|block|unassigned|review|decision/i.test(`${item.status} ${item.detail}`));
    return `
      <article class="brief-os-screen" data-os-screen="${app.id}">
        <div class="brief-os-screen-heading">
          <div><span>${escapeHtml(app.eyebrow)}</span><h2>${escapeHtml(app.label)} board</h2></div>
          <p>The OS compresses the page into signals that change timing, ownership, risk or the next action.</p>
        </div>
        <div class="brief-os-intelligence-grid">
          <section class="brief-os-signal is-strong"><span>TRAJECTORY</span><strong>${escapeHtml(priorities[0]?.status || 'READY')}</strong><p>${escapeHtml(compactText(priorities[0]?.detail || 'The highest-priority item has a clear next move.', 105))}</p></section>
          <section class="brief-os-signal"><span>RISK</span><strong>${risks.length ? `${risks.length} item${risks.length === 1 ? '' : 's'} need attention` : 'No urgent risk flagged'}</strong><p>${escapeHtml(compactText(risks[0]?.title || 'The current fictional data shows no immediate escalation.', 105))}</p></section>
          <section class="brief-os-signal"><span>TIME</span><strong>${escapeHtml(schedule[0]?.time || 'Open')}</strong><p>${escapeHtml(compactText(schedule[0]?.title || 'The next scheduled block is available in Day.', 105))}</p></section>
          <section class="brief-os-signal"><span>CONTEXT</span><strong>${escapeHtml(metrics[0]?.value || scenario.weather?.condition || 'Current')}</strong><p>${escapeHtml(compactText(metrics[0]?.label ? `${metrics[0].label}. ${scenario.weather?.advice || ''}` : scenario.weather?.advice || 'Context is available.', 105))}</p></section>
          <section class="brief-os-signal is-wide"><span>WHY THIS SCREEN EXISTS</span><strong>Only useful signals earn default space.</strong><p>Deep explanations, historical records and every possible module remain available through System or the optional full report.</p><button type="button" data-os-open="system">Open System directory →</button></section>
        </div>
      </article>`;
  }

  function renderSystem(app) {
    const list = apps();
    return `
      <article class="brief-os-screen" data-os-screen="${app.id}">
        <div class="brief-os-screen-heading">
          <div><span>${escapeHtml(app.eyebrow)}</span><h2>Personal OS directory</h2></div>
          <p>Each function behaves like an application. The continuous report is retained as an optional deep-detail layer.</p>
        </div>
        <div class="brief-os-directory-grid">
          ${list.map(item => `<button type="button" data-os-open="${item.id}" class="${item.id === state.active ? 'is-active' : ''}"><span>${ICONS[item.id]}</span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.eyebrow)}</small></button>`).join('')}
          <button type="button" data-os-command><span>›_</span><strong>Terminal</strong><small>Commands and questions</small></button>
          <button type="button" data-os-detail="#connections"><span>◎</span><strong>Connections</strong><small>Status and permissions</small></button>
          <button type="button" data-os-detail="#learning"><span>◫</span><strong>Memory</strong><small>Structured records</small></button>
          <button type="button" data-os-detail="#today"><span>↗</span><strong>Full report</strong><small>Optional continuous view</small></button>
        </div>
        <div class="brief-os-system-note">
          <span>DESIGN DECISION</span>
          <p>The OS does not auto-advance by default because surprise movement is poor operating software. Guided flow is available when you want a hands-off walkthrough, while normal use stays deliberate.</p>
        </div>
      </article>`;
  }

  function renderScreen(app) {
    if (app.id === 'today') return renderToday(app);
    if (app.id === 'day') return renderDay(app);
    if (app.id === 'actions') return renderActions(app);
    if (app.id === 'spaces') return renderSpaces(app);
    if (app.id === 'intelligence') return renderIntelligence(app);
    return renderSystem(app);
  }

  function render() {
    const shell = $('#briefPersonalOS');
    if (!shell) return;
    const list = apps();
    if (!list.some(app => app.id === state.active)) state.active = 'today';

    const nav = $('#briefOsNav');
    const track = $('#briefOsTrack');
    const dots = $('#briefOsDots');
    if (nav) {
      nav.innerHTML = list.map(app => `
        <button type="button" data-os-open="${app.id}" aria-current="${state.active === app.id ? 'page' : 'false'}">
          <span aria-hidden="true">${ICONS[app.id]}</span><strong>${escapeHtml(app.label)}</strong><small>${escapeHtml(app.eyebrow)}</small>
        </button>`).join('');
    }
    if (track) track.innerHTML = list.map(renderScreen).join('');
    if (dots) dots.innerHTML = list.map(app => `<button type="button" data-os-open="${app.id}" aria-label="Open ${escapeHtml(app.label)}" aria-current="${state.active === app.id ? 'step' : 'false'}"></button>`).join('');

    const identity = $('#briefOsIdentityLabel');
    if (identity) identity.textContent = ({ individual: 'Personal', couple: 'Relationship', partners: 'Business', trainer: 'Trainer', team: 'Team' })[preset()] || 'Personal';

    updateActive(false);
  }

  function updateActive(animate = true) {
    const list = apps();
    const index = activeIndex();
    const app = currentApp();
    const track = $('#briefOsTrack');
    if (track) {
      track.classList.toggle('is-no-animation', !animate);
      track.style.transform = `translate3d(-${index * 100}%,0,0)`;
      if (!animate) requestAnimationFrame(() => track.classList.remove('is-no-animation'));
    }

    $$('#briefOsNav [data-os-open]').forEach(button => button.setAttribute('aria-current', button.dataset.osOpen === state.active ? 'page' : 'false'));
    $$('#briefOsDots [data-os-open]').forEach(button => button.setAttribute('aria-current', button.dataset.osOpen === state.active ? 'step' : 'false'));
    $$('#briefOsTrack [data-os-screen]').forEach(screen => {
      const active = screen.dataset.osScreen === state.active;
      screen.setAttribute('aria-hidden', String(!active));
      screen.toggleAttribute('inert', !active);
      screen.classList.toggle('is-active', active);
      if (active) screen.scrollTop = 0;
    });

    const title = $('#briefOsTitle');
    const eyebrow = $('#briefOsEyebrow');
    const position = $('#briefOsPosition');
    if (title) title.textContent = app.label;
    if (eyebrow) eyebrow.textContent = app.eyebrow.toUpperCase();
    if (position) position.textContent = `${index + 1} / ${list.length}`;

    const next = list[(index + 1) % list.length];
    const nextButton = $('[data-os-next-label]');
    if (nextButton) nextButton.textContent = index === list.length - 1 ? 'Back to Today →' : `Next: ${next.label} →`;

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('os', state.active);
      history.replaceState({ ...(history.state || {}), briefPersonalOS: true, os: state.active }, '', url);
    } catch {}
  }

  function goTo(id, options = {}) {
    const list = apps();
    if (!list.some(app => app.id === id)) return;
    if (options.manual !== false) stopAutoFlow();
    state.previous = state.active;
    state.active = id;
    updateActive(options.animate !== false);
  }

  function step(direction, options = {}) {
    const list = apps();
    const index = activeIndex();
    let next = index + direction;
    if (next < 0) next = list.length - 1;
    if (next >= list.length) next = 0;
    goTo(list[next].id, options);
  }

  function startAutoFlow() {
    stopAutoFlow();
    state.autoRunning = true;
    document.body.classList.add('brief-os-auto-running');
    const button = $('[data-os-auto]');
    if (button) {
      button.setAttribute('aria-pressed', 'true');
      button.textContent = 'Stop flow';
    }
    state.autoTimer = window.setInterval(() => {
      const index = activeIndex();
      if (index >= apps().length - 1) {
        stopAutoFlow();
        return;
      }
      step(1, { manual: false });
    }, 4200);
  }

  function stopAutoFlow() {
    window.clearInterval(state.autoTimer);
    state.autoTimer = 0;
    state.autoRunning = false;
    document.body.classList.remove('brief-os-auto-running');
    const button = $('[data-os-auto]');
    if (button) {
      button.setAttribute('aria-pressed', 'false');
      button.textContent = 'Guided flow';
    }
  }

  function openDetail(target) {
    stopAutoFlow();
    document.body.classList.add('brief-personal-os-detail-open');
    window.BRIEF_SYSTEM?.setMode?.('full', { scroll: false, push: true });
    window.setTimeout(() => {
      const node = $(target || '#today');
      if (!node) return;
      const top = node.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 140);
  }

  function closeDetail() {
    document.body.classList.remove('brief-personal-os-detail-open');
    window.BRIEF_SYSTEM?.setMode?.('focus', { scroll: false, push: false });
    window.scrollTo({ top: 0, behavior: 'auto' });
    updateActive(false);
  }

  function updateClock() {
    const clock = $('#briefOsClock');
    if (!clock) return;
    const timezone = data().timezone || window.BRIEF_DATA?.edition?.timezone || 'America/New_York';
    try {
      clock.textContent = new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit', timeZone: timezone }).format(new Date());
      clock.dateTime = new Date().toISOString();
    } catch {
      clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
  }

  function installEvents() {
    document.addEventListener('click', event => {
      const open = event.target.closest?.('[data-os-open]');
      if (open) { goTo(open.dataset.osOpen); return; }

      if (event.target.closest?.('[data-os-prev]')) { step(-1); return; }
      if (event.target.closest?.('[data-os-next], [data-os-next-label]')) { step(1); return; }

      if (event.target.closest?.('[data-os-auto]')) {
        state.autoRunning ? stopAutoFlow() : startAutoFlow();
        return;
      }

      if (event.target.closest?.('[data-os-command]')) {
        stopAutoFlow();
        window.BRIEF_SYSTEM?.openTerminal?.();
        return;
      }

      if (event.target.closest?.('[data-os-switcher]')) {
        $('#briefSystemSwitcher')?.click();
        return;
      }

      const detail = event.target.closest?.('[data-os-detail]');
      if (detail) { openDetail(detail.dataset.osDetail); return; }

      if (event.target.closest?.('[data-os-return]')) { closeDetail(); return; }

      const complete = event.target.closest?.('[data-os-complete]');
      if (complete) {
        const id = complete.dataset.osComplete;
        setCompleted(id, !isCompleted(id));
        render();
      }
    }, true);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.body.classList.contains('brief-personal-os-detail-open')) {
        event.preventDefault();
        closeDetail();
        return;
      }
      if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    });

    const viewport = $('#briefOsViewport');
    viewport?.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      state.touchActive = true;
      state.touchStartX = event.clientX;
      state.touchStartY = event.clientY;
    });
    viewport?.addEventListener('pointerup', event => {
      if (!state.touchActive) return;
      state.touchActive = false;
      const dx = event.clientX - state.touchStartX;
      const dy = event.clientY - state.touchStartY;
      if (Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      step(dx < 0 ? 1 : -1);
    });

    window.addEventListener('brief:preset-change', () => {
      stopAutoFlow();
      state.active = 'today';
      window.setTimeout(render, 280);
    });

    window.addEventListener('popstate', () => {
      try {
        const requested = new URL(window.location.href).searchParams.get('os');
        if (requested && apps().some(app => app.id === requested)) goTo(requested, { animate: false, manual: false });
      } catch {}
    });
  }

  function initialize() {
    if (state.initialized || !window.BRIEF_SYSTEM || !$('#briefSystemHeader') || !$('#briefApp')) return false;
    state.initialized = true;
    createShell();
    try {
      const requested = new URL(window.location.href).searchParams.get('os');
      if (requested && apps().some(app => app.id === requested)) state.active = requested;
    } catch {}
    installEvents();
    render();
    updateClock();
    state.clockTimer = window.setInterval(updateClock, 30000);
    document.body.classList.add('brief-personal-os-ready');
    window.BRIEF_PERSONAL_OS = {
      version: VERSION,
      open: id => goTo(id),
      next: () => step(1),
      previous: () => step(-1),
      startGuidedFlow: startAutoFlow,
      stopGuidedFlow: stopAutoFlow,
      openDetail,
      closeDetail,
      getState: () => ({ active: state.active, autoRunning: state.autoRunning, preset: preset() })
    };
    return true;
  }

  function waitForSystem() {
    if (initialize()) return;
    window.setTimeout(waitForSystem, 180);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForSystem, { once: true });
  else waitForSystem();
})();