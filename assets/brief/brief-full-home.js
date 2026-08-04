(() => {
  'use strict';

  const VERSION = '20260804-1';
  const DEPTH_KEY = 'cmxBriefDemo:personalOS:viewDepth';
  const TASK_KEY_PREFIX = 'cmxBriefDemo:personalOS:homeTask';
  const VALID_DEPTHS = new Set(['full', 'quick']);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const state = {
    depth: readDepth(),
    initialized: false,
    renderQueued: false,
    observer: null
  };

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return window.BRIEF_DATA?.scenarios?.[value] ? value : 'individual';
  }

  function scenario() {
    return window.BRIEF_DATA?.scenarios?.[preset()] || window.BRIEF_DATA?.scenarios?.individual || {};
  }

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function compactText(value, max = 92) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (text.length <= max) return text;
    return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
  }

  function readDepth() {
    try {
      const stored = localStorage.getItem(DEPTH_KEY);
      return VALID_DEPTHS.has(stored) ? stored : 'full';
    } catch {
      return 'full';
    }
  }

  function saveDepth(depth) {
    try { localStorage.setItem(DEPTH_KEY, depth); } catch {}
  }

  function taskKey(id) {
    return `${TASK_KEY_PREFIX}:${preset()}:${id}`;
  }

  function taskDone(id) {
    try { return localStorage.getItem(taskKey(id)) === '1'; } catch { return false; }
  }

  function setTaskDone(id, done) {
    try {
      if (done) localStorage.setItem(taskKey(id), '1');
      else localStorage.removeItem(taskKey(id));
    } catch {}
  }

  function riskPriority(priorities) {
    return priorities.find(item => /risk|block|unassigned|review|decision|overdue|concern/i.test(`${item.status || ''} ${item.detail || ''}`)) || priorities[1] || priorities[0] || {};
  }

  function goalItems(data) {
    const privateItems = data.shared?.private || [];
    const matched = privateItems.filter(item => /goal|plan|progress|target|session|finish|protect|improve|decide/i.test(`${item.label || ''} ${item.title || ''}`));
    const source = matched.length ? matched : privateItems;
    const goals = source.slice(0, 3).map((item, index) => ({
      id: `goal-${index}`,
      title: item.title || 'Active goal',
      meta: item.label || 'Current direction',
      detail: item.note || ''
    }));
    if (!goals.length && data.priorities?.[0]) {
      goals.push({ id: 'goal-priority', title: data.priorities[0].title, meta: 'Current goal', detail: data.priorities[0].detail });
    }
    return goals;
  }

  function messageItems(data) {
    const sharedItems = data.shared?.shared || [];
    return sharedItems.slice(0, 4).map((item, index) => ({
      id: `message-${index}`,
      title: item.title || 'Shared update',
      meta: item.label || 'Approved shared space',
      detail: item.note || ''
    }));
  }

  function taskItems(data) {
    const prep = data.nextUp?.prep || [];
    const tasks = prep.slice(0, 4).map((item, index) => ({
      id: `prep-${index}`,
      title: item,
      meta: index === 0 ? 'Prepare next event' : 'Next event prep',
      detail: data.nextUp?.title || ''
    }));
    if (tasks.length < 4) {
      (data.priorities || []).slice(0, 4 - tasks.length).forEach((item, index) => {
        tasks.push({
          id: `priority-task-${index}`,
          title: item.title || 'Priority task',
          meta: [item.owner, item.due].filter(Boolean).join(' · '),
          detail: item.detail || ''
        });
      });
    }
    return tasks;
  }

  function updateItems(data) {
    const priorities = data.priorities || [];
    const schedule = data.schedule || [];
    const shared = data.shared?.shared || [];
    return [
      { title: `${priorities.length} active priorities`, meta: priorities[0]?.status || 'Current briefing', detail: priorities[0]?.title || 'No urgent priority' },
      { title: `${schedule.length} calendar blocks`, meta: data.nextUp?.time || 'Today', detail: data.nextUp?.title || 'No scheduled event' },
      { title: `${shared.length} approved shared records`, meta: 'Spaces', detail: shared[0]?.title || 'No shared update' }
    ];
  }

  function summaryList(items, limit = 2, options = {}) {
    if (!items.length) return '<p class="brief-os-home-empty">Nothing needs attention here.</p>';
    return `<ul class="brief-os-home-list">${items.slice(0, limit).map((item, index) => {
      const id = item.id || `${options.prefix || 'item'}-${index}`;
      const done = options.checkable ? taskDone(id) : false;
      const control = options.checkable
        ? `<button type="button" class="brief-os-home-check" data-brief-home-task="${escapeHtml(id)}" aria-pressed="${done}"><span>${done ? '✓' : ''}</span></button>`
        : '<i aria-hidden="true"></i>';
      return `<li class="${done ? 'is-complete' : ''}">${control}<div><strong>${escapeHtml(item.title || '')}</strong>${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ''}</div></li>`;
    }).join('')}</ul>`;
  }

  function detailList(items, start = 2) {
    const remaining = items.slice(start);
    if (!remaining.length) return '<p>No additional items in this briefing.</p>';
    return `<ul>${remaining.map(item => `<li><strong>${escapeHtml(item.title || '')}</strong>${item.detail ? `<span>${escapeHtml(compactText(item.detail, 120))}</span>` : ''}</li>`).join('')}</ul>`;
  }

  function moduleCard(config) {
    const items = config.items || [];
    const count = config.count ?? items.length;
    return `
      <article class="brief-os-home-module ${config.className || ''}" data-home-module="${escapeHtml(config.id)}" data-quick="${config.quick ? 'true' : 'false'}">
        <header>
          <div class="brief-os-home-module-icon" aria-hidden="true">${escapeHtml(config.icon || '•')}</div>
          <div><span>${escapeHtml(config.eyebrow || 'MODULE')}</span><h3>${escapeHtml(config.title)}</h3></div>
          <b>${escapeHtml(String(count))}</b>
        </header>
        ${config.lead ? `<p class="brief-os-home-lead">${escapeHtml(config.lead)}</p>` : ''}
        ${summaryList(items, config.limit || 2, { checkable: config.checkable, prefix: config.id })}
        <details>
          <summary><span>Show more</span><span>Hide details</span></summary>
          <div class="brief-os-home-detail">
            ${config.detail || detailList(items, config.limit || 2)}
            ${config.action ? `<button type="button" ${config.action.attribute}="${escapeHtml(config.action.value)}">${escapeHtml(config.action.label)}</button>` : ''}
          </div>
        </details>
      </article>`;
  }

  function buildModules(data) {
    const priorities = data.priorities || [];
    const schedule = data.schedule || [];
    const messages = messageItems(data);
    const tasks = taskItems(data);
    const goals = goalItems(data);
    const updates = updateItems(data);
    const risk = riskPriority(priorities);
    const weather = data.weather || {};
    const next = data.nextUp || {};

    return [
      moduleCard({
        id: 'executive', icon: '◎', eyebrow: 'EXECUTIVE SUMMARY', title: 'What matters now', count: 'NOW', quick: true, className: 'is-executive',
        lead: compactText(priorities[0]?.detail || next.prep?.[0] || 'The briefing is organized around the next useful move.', 148),
        items: [
          { title: priorities[0]?.title || 'Choose the next useful move', meta: priorities[0]?.due || 'Highest priority' },
          { title: next.title || 'No immediate event', meta: next.time || 'Calendar clear' },
          { title: weather.condition || 'Current context', meta: weather.location || '' }
        ],
        limit: 3,
        detail: `<p>${escapeHtml(compactText(weather.advice || 'Timing and current conditions are included when they can change the plan.', 180))}</p>`,
        action: { attribute: 'data-os-open', value: 'actions', label: 'Open work queue →' }
      }),
      moduleCard({
        id: 'priorities', icon: '01', eyebrow: 'PRIORITIES', title: 'Ranked outcomes', quick: true,
        items: priorities.map(item => ({ title: item.title, meta: [item.rank, item.due, item.owner].filter(Boolean).join(' · '), detail: item.detail })),
        action: { attribute: 'data-os-open', value: 'actions', label: 'View all priorities →' }
      }),
      moduleCard({
        id: 'calendar', icon: '◷', eyebrow: 'CALENDAR', title: 'Today’s sequence', quick: true,
        items: schedule.map(item => ({ title: item.title, meta: item.time, detail: item.meta })),
        action: { attribute: 'data-os-open', value: 'day', label: 'Open day timeline →' }
      }),
      moduleCard({
        id: 'messages', icon: '↗', eyebrow: 'MESSAGES', title: 'Coordination needing attention',
        items: messages,
        action: { attribute: 'data-os-open', value: 'spaces', label: 'Review approved spaces →' }
      }),
      moduleCard({
        id: 'tasks', icon: '✓', eyebrow: 'TASKS', title: 'Execution checklist',
        items: tasks, checkable: true,
        action: { attribute: 'data-os-open', value: 'actions', label: 'Open work app →' }
      }),
      moduleCard({
        id: 'goals', icon: '◇', eyebrow: 'GOALS', title: 'Current direction',
        items: goals,
        action: { attribute: 'data-os-detail', value: '#learning', label: 'View goal and memory context ↗' }
      }),
      moduleCard({
        id: 'updates', icon: '↻', eyebrow: 'UPDATES', title: 'What changed in the picture',
        items: updates,
        detail: '<p>Updates summarize the active scenario records already available to the briefing. No generation or backend behavior changes here.</p>',
        action: { attribute: 'data-os-open', value: 'system', label: 'Open system directory →' }
      }),
      moduleCard({
        id: 'insights', icon: '⌁', eyebrow: 'INSIGHTS', title: 'Signals that change a decision',
        items: [
          { title: risk.title || 'No major risk surfaced', meta: risk.status || 'Current analysis', detail: risk.detail || '' },
          { title: weather.advice || 'No timing adjustment needed', meta: weather.condition || 'Context', detail: weather.location || '' },
          { title: next.title || 'No next event', meta: next.time || 'Schedule', detail: next.prep?.join(' · ') || '' }
        ],
        action: { attribute: 'data-os-open', value: 'intelligence', label: 'Open insight board →' }
      })
    ].join('');
  }

  function ensureDepthSwitch() {
    const actions = $('.brief-os-commandbar-actions');
    if (!actions || $('#briefOsDepthSwitch')) return;
    const group = document.createElement('div');
    group.id = 'briefOsDepthSwitch';
    group.className = 'brief-os-depth-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Briefing depth');
    group.innerHTML = `
      <button type="button" data-brief-home-depth="full" aria-pressed="false">Full</button>
      <button type="button" data-brief-home-depth="quick" aria-pressed="false">Quick</button>`;
    actions.prepend(group);
  }

  function updateDepthControls() {
    document.body.dataset.briefOsDepth = state.depth;
    $$('[data-brief-home-depth]').forEach(button => {
      const active = button.dataset.briefHomeDepth === state.depth;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
  }

  function renderHome() {
    const screen = $('[data-os-screen="today"]');
    if (!screen) return false;
    ensureDepthSwitch();
    const data = scenario();
    screen.classList.add('brief-os-screen-home');
    screen.dataset.homeDepth = state.depth;
    screen.innerHTML = `
      <div class="brief-os-home-shell">
        <header class="brief-os-home-heading">
          <div>
            <span>${state.depth === 'full' ? 'FULL OPERATING PICTURE' : 'QUICK BRIEF'}</span>
            <h2>${state.depth === 'full' ? 'The whole day, compressed.' : 'Only the next useful signals.'}</h2>
          </div>
          <p>${state.depth === 'full'
            ? 'Every applicable section is visible as a concise module. Expand only what needs more attention.'
            : 'A shorter daytime lens. Switch back to Full whenever you need the complete picture.'}</p>
        </header>
        <div class="brief-os-home-grid">${buildModules(data)}</div>
      </div>`;

    updateDepthControls();
    const active = window.BRIEF_PERSONAL_OS?.getState?.().active === 'today';
    if (active) {
      const eyebrow = $('#briefOsEyebrow');
      const hint = $('#briefOsFlowHint');
      if (eyebrow) eyebrow.textContent = state.depth === 'full' ? 'OPERATING PICTURE' : 'QUICK VIEW';
      if (hint) hint.textContent = state.depth === 'full'
        ? 'Scan every section here, expand a module, or open a function app.'
        : 'Use the short lens now, or return to Full for the complete picture.';
    }
    return true;
  }

  function setDepth(depth, persist = true) {
    if (!VALID_DEPTHS.has(depth)) return;
    state.depth = depth;
    if (persist) saveDepth(depth);
    renderHome();
  }

  function queueRender() {
    if (state.renderQueued) return;
    state.renderQueued = true;
    window.requestAnimationFrame(() => {
      state.renderQueued = false;
      const screen = $('[data-os-screen="today"]');
      if (screen && !$('.brief-os-home-shell', screen)) renderHome();
      else updateDepthControls();
    });
  }

  function installEvents() {
    document.addEventListener('click', event => {
      const depth = event.target.closest?.('[data-brief-home-depth]');
      if (depth) {
        event.preventDefault();
        event.stopPropagation();
        setDepth(depth.dataset.briefHomeDepth);
        return;
      }

      const task = event.target.closest?.('[data-brief-home-task]');
      if (task) {
        event.preventDefault();
        event.stopPropagation();
        const id = task.dataset.briefHomeTask;
        setTaskDone(id, !taskDone(id));
        renderHome();
      }
    }, true);

    document.addEventListener('toggle', event => {
      const details = event.target.closest?.('.brief-os-home-module details');
      if (!details) return;
      details.closest('.brief-os-home-module')?.classList.toggle('is-expanded', details.open);
    }, true);

    window.addEventListener('brief:preset-change', () => window.setTimeout(renderHome, 340));
    window.addEventListener('popstate', () => window.setTimeout(queueRender, 60));
  }

  function observeTrack() {
    const track = $('#briefOsTrack');
    if (!track || state.observer) return;
    state.observer = new MutationObserver(queueRender);
    state.observer.observe(track, { childList: true, subtree: false });
  }

  function initialize() {
    if (state.initialized || !window.BRIEF_PERSONAL_OS || !$('#briefOsTrack')) return false;
    state.initialized = true;
    ensureDepthSwitch();
    renderHome();
    installEvents();
    observeTrack();
    document.body.classList.add('brief-full-home-ready');
    window.BRIEF_FULL_HOME = {
      version: VERSION,
      getState: () => ({ depth: state.depth, preset: preset() }),
      setDepth,
      refresh: renderHome
    };
    return true;
  }

  function waitForOs() {
    if (initialize()) return;
    window.setTimeout(waitForOs, 140);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForOs, { once: true });
  else waitForOs();
})();
