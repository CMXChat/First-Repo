(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VALID = new Set(['individual', 'couple', 'partners', 'trainer', 'team']);
  let initialized = false;
  let retries = 0;
  let retryTimer = 0;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return VALID.has(value) ? value : 'individual';
  }

  function selectedTab() {
    return $('[data-workspace-tab][aria-selected="true"]')?.dataset.workspaceTab || 'overview';
  }

  function clamp(value, min = 0, max = 100) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(min, Math.min(max, numeric)) : min;
  }

  function parsePercent(value) {
    const match = String(value ?? '').match(/-?\d+(?:\.\d+)?/);
    return match ? clamp(Number(match[0])) : 0;
  }

  function sparkline(values, labels = []) {
    const safe = values.map(Number).filter(Number.isFinite);
    if (!safe.length) return '';
    const width = 620;
    const height = 210;
    const padX = 26;
    const padY = 28;
    const min = Math.min(...safe);
    const max = Math.max(...safe);
    const range = Math.max(1, max - min);
    const points = safe.map((value, index) => {
      const x = padX + (index * (width - padX * 2)) / Math.max(1, safe.length - 1);
      const y = height - padY - ((value - min) / range) * (height - padY * 2);
      return { x, y, value, label: labels[index] || String(index + 1) };
    });
    const line = points.map(point => `${point.x},${point.y}`).join(' ');
    const area = `${padX},${height - padY} ${line} ${width - padX},${height - padY}`;
    return `<svg class="polish-sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Trend chart">
      <polyline class="polish-chart-area" points="${area}"></polyline>
      <polyline class="polish-chart-line" points="${line}"></polyline>
      ${points.map(point => `<g><circle cx="${point.x}" cy="${point.y}" r="5"></circle><text x="${point.x}" y="${point.y - 13}" text-anchor="middle">${escapeHtml(point.value)}</text><text class="polish-axis-label" x="${point.x}" y="${height - 7}" text-anchor="middle">${escapeHtml(point.label)}</text></g>`).join('')}
    </svg>`;
  }

  function ring(value, label, note) {
    const safe = clamp(value);
    return `<article class="polish-ring-card"><div class="polish-ring" style="--ring-value:${safe}" role="img" aria-label="${escapeHtml(label)} ${safe} percent"><span>${safe}%</span></div><div><small>${escapeHtml(label)}</small><strong>${escapeHtml(note)}</strong></div></article>`;
  }

  function kpiCard(label, value, detail, tone = 'blue') {
    return `<article class="polish-kpi tone-${escapeHtml(tone)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></article>`;
  }

  function businessVisuals() {
    const scenario = window.BRIEF_SCENARIOS?.partners || {};
    const space = window.BRIEF_DAILY_CONTENT?.businessSpace || {};
    const kpis = scenario.kpis || [];
    const revenue = scenario.charts?.revenue || { values: [], labels: [] };
    const cash = scenario.charts?.cash || { values: [], labels: [] };
    const shared = space.shared || [];
    const cashNow = Number(cash.values?.at?.(-1) ?? cash.values?.[cash.values.length - 1] ?? 0);

    return `<div class="polish-visual-head"><div><p class="micro-label">EXECUTIVE PULSE · FICTIONAL COMPANY DATA</p><h3>Numbers and decisions belong near the top.</h3></div><p>The concise briefing shows the operating picture immediately. The original ledger, partner views and detailed charts remain in the full workspace.</p></div>
      <div class="polish-kpi-grid">${kpis.slice(0, 5).map((item, index) => kpiCard(item.label, item.value, item.delta, index < 2 ? 'green' : index === 3 ? 'amber' : 'blue')).join('')}</div>
      <div class="polish-business-grid">
        <article class="polish-chart-card"><div><span>SIX-MONTH REVENUE</span><strong>${escapeHtml(revenue.prefix || '')}${escapeHtml(revenue.values?.at?.(-1) ?? '')}${escapeHtml(revenue.suffix || '')}</strong></div>${sparkline(revenue.values || [], revenue.labels || [])}</article>
        <div class="polish-business-side">
          ${ring(cashNow, 'Cash collected', cashNow >= 75 ? 'At or above the operating target' : 'Below the fictional 75% operating target')}
          <article class="polish-decision-card"><span>NEXT DECISION</span><strong>${escapeHtml(shared[2]?.value || 'Review the contractor decision')}</strong><p>${escapeHtml(shared[2]?.note || 'Connect the decision to collected cash and an owner.')}</p><button type="button" data-polish-open="business-finance">Open detailed finance</button></article>
        </div>
      </div>`;
  }

  function teamBoardColumns(timeline) {
    const groups = [
      ['Complete', timeline.filter(item => item.state === 'Complete')],
      ['In progress', timeline.filter(item => item.state === 'In progress')],
      ['Waiting', timeline.filter(item => item.state === 'Waiting')],
      ['Scheduled', timeline.filter(item => item.state === 'Scheduled')]
    ];
    return `<div class="polish-team-board">${groups.map(([name, items]) => `<section><div class="polish-board-title"><span>${escapeHtml(name)}</span><b>${items.length}</b></div>${items.length ? items.map(item => `<article><small>${escapeHtml(item.owner)}</small><strong>${escapeHtml(item.phase)}</strong><p>${escapeHtml(item.detail)}</p></article>`).join('') : '<p class="polish-empty">No items</p>'}</section>`).join('')}</div>`;
  }

  function workloadBars(members) {
    const demo = [72, 61, 84, 56, 68, 47];
    return `<div class="polish-workload-list">${members.map((member, index) => { const value = demo[index % demo.length]; return `<article><div><span>${escapeHtml(member.name)}</span><small>${escapeHtml(member.role)}</small></div><div class="polish-workload-track"><i style="width:${value}%"></i></div><strong>${value}%</strong></article>`; }).join('')}</div>`;
  }

  function teamVisuals() {
    const team = window.BRIEF_SCENARIOS?.team || {};
    const timeline = team.timeline || [];
    const handoffs = team.handoffs || [];
    const finance = team.finance || [];
    const complete = timeline.filter(item => item.state === 'Complete').length;
    const readiness = timeline.length ? Math.round((complete / timeline.length) * 100) : 0;
    const blockers = (team.procedure || []).filter(item => item.state === 'Blocked').length;
    const waiting = handoffs.filter(item => /waiting|needs/i.test(item.status)).length;
    const budget = parsePercent(finance[0]?.value);

    return `<div class="polish-visual-head"><div><p class="micro-label">LIVE TEAM OPERATING BOARD · FICTIONAL PROJECT DATA</p><h3>A role-aware workspace with the clarity of a project board.</h3></div><p>Members see their work and dependencies. Leads see readiness, workload, handoffs, finance and approvals without exposing unrelated private records.</p></div>
      <div class="polish-kpi-grid">${[
        kpiCard('Readiness', `${readiness}%`, `${complete} of ${timeline.length} phases complete`, 'green'),
        kpiCard('Active blockers', String(blockers), blockers ? 'Approval required before release' : 'No blocked readiness checks', blockers ? 'amber' : 'green'),
        kpiCard('Handoffs at risk', String(waiting), 'Waiting or missing evidence', waiting ? 'amber' : 'green'),
        kpiCard('Budget used', `${budget}%`, finance[1]?.note || 'Fictional project budget', 'blue'),
        kpiCard('Role views', String((team.members || []).length), 'Private, role, project and leadership spaces', 'violet')
      ].join('')}</div>
      <div class="polish-team-summary-grid">
        ${ring(readiness, 'Project readiness', blockers ? 'One approval is holding the release' : 'Readiness checks are clear')}
        <article class="polish-workload-card"><div><span>ROLE WORKLOAD</span><strong>Capacity by member</strong></div>${workloadBars(team.members || [])}</article>
      </div>
      <div class="polish-full-only">
        <div class="polish-team-flow" aria-label="Project flow">${timeline.map((item, index) => `<div class="is-${escapeHtml(item.state.toLowerCase().replaceAll(' ', '-'))}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item.phase)}</strong><small>${escapeHtml(item.state)}</small></div>${index < timeline.length - 1 ? '<i aria-hidden="true">→</i>' : ''}`).join('')}</div>
        ${teamBoardColumns(timeline)}
        <div class="polish-team-bottom">
          <section class="polish-handoff-visual"><div><span>HANDOFF WATCH</span><strong>Sender, receiver, evidence</strong></div>${handoffs.map(item => `<article><b>${escapeHtml(item.from)}</b><i>→</i><b>${escapeHtml(item.to)}</b><span>${escapeHtml(item.item)}</span><small>${escapeHtml(item.status)}</small></article>`).join('')}</section>
          <section class="polish-finance-bars"><div><span>APPROVED FINANCE SIGNALS</span><strong>Enough context for the role</strong></div>${finance.map(item => { const value = parsePercent(item.value); return `<article><span>${escapeHtml(item.label)}</span><div><i style="width:${value || 8}%"></i></div><strong>${escapeHtml(item.value)}</strong><small>${escapeHtml(item.note)}</small></article>`; }).join('')}</section>
        </div>
      </div>`;
  }

  function createPriorityVisuals() {
    let section = $('#briefPriorityVisuals');
    if (section) return section;
    const tabs = $('#briefWorkspaceTabs');
    if (!tabs) return null;
    section = document.createElement('section');
    section.id = 'briefPriorityVisuals';
    section.className = 'brief-priority-visuals';
    section.hidden = true;
    tabs.insertAdjacentElement('afterend', section);
    return section;
  }

  function renderPriorityVisuals() {
    const section = createPriorityVisuals();
    if (!section) return;
    const current = preset();
    const tab = selectedTab();
    const showBusiness = current === 'partners' && ['overview', 'finance', 'projects', 'decisions'].includes(tab);
    const showTeam = current === 'team' && ['overview', 'mywork', 'project', 'handoffs', 'procedure', 'finance'].includes(tab);
    section.hidden = !(showBusiness || showTeam);
    section.dataset.visualPreset = current;
    if (showBusiness) section.innerHTML = businessVisuals();
    else if (showTeam) section.innerHTML = teamVisuals();
    else section.replaceChildren();

    $('[data-polish-open="business-finance"]', section)?.addEventListener('click', () => {
      $('[data-depth-choice="full"]')?.click();
      window.setTimeout(() => ($('#scenarioStage .business-chart-panel') || $('#scenarioExperienceAddon .business-visual-grid'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 180);
    });
  }

  function fixRailControl() {
    const button = $('#briefSignalPause');
    const strip = $('#briefSignalStrip');
    if (!button || !strip || button.dataset.polishBound === 'true') return;
    button.dataset.polishBound = 'true';
    button.addEventListener('click', () => {
      window.requestAnimationFrame(() => {
        const paused = button.getAttribute('aria-pressed') === 'true';
        strip.style.animationPlayState = paused ? 'paused' : 'running';
        button.setAttribute('aria-label', paused ? 'Play moving briefing signals' : 'Pause moving briefing signals');
        const status = $('#briefSignalStatus');
        if (status) status.textContent = paused ? 'Moving signals paused.' : 'Moving signals playing.';
      });
    });

    if (!$('#briefSignalStatus')) {
      const status = document.createElement('span');
      status.id = 'briefSignalStatus';
      status.className = 'sr-only';
      status.setAttribute('role', 'status');
      status.textContent = 'Moving signals playing.';
      button.insertAdjacentElement('afterend', status);
    }
    button.setAttribute('aria-label', 'Pause moving briefing signals');
  }

  function refreshQuickPreview(button) {
    const card = $('.quick-watch-card');
    const image = $('img', card);
    if (!image) return;
    const url = new URL(image.src, window.location.href);
    url.searchParams.set('refresh', String(Date.now()));
    image.src = url.toString();
    button.textContent = 'Preview refreshed';
    window.setTimeout(() => { button.textContent = 'Refresh preview'; }, 1400);
  }

  function decorateQuickWatch() {
    const card = $('.quick-watch-card');
    if (!card || $('#quickWatchTools')) return;
    const tools = document.createElement('div');
    tools.id = 'quickWatchTools';
    tools.className = 'quick-watch-tools';
    tools.innerHTML = '<button type="button">Refresh preview</button><small>If the image is blank, refresh it or open the full player.</small>';
    card.insertAdjacentElement('afterend', tools);
    $('button', tools)?.addEventListener('click', event => refreshQuickPreview(event.currentTarget));
  }

  function scheduleRefresh() {
    window.setTimeout(() => {
      fixRailControl();
      renderPriorityVisuals();
      decorateQuickWatch();
    }, 30);
  }

  function installEvents() {
    document.addEventListener('click', event => {
      if (event.target.closest('[data-workspace-tab], [data-depth-choice]')) scheduleRefresh();
    });
    window.addEventListener('brief:preset-change', () => window.setTimeout(scheduleRefresh, 250));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(scheduleRefresh, 220));
  }

  function initialize() {
    if (initialized || !window.BRIEF_APP || !$('#briefWorkspace')) return false;
    initialized = true;
    installEvents();
    scheduleRefresh();
    return true;
  }

  function tryInitialize() {
    if (initialize()) return;
    retries += 1;
    if (retries < 20) retryTimer = window.setTimeout(tryInitialize, 250);
  }

  window.addEventListener('brief:ready', tryInitialize, { once: true });
  if (window.BRIEF_APP) tryInitialize();
  else document.addEventListener('DOMContentLoaded', tryInitialize, { once: true });
})();
