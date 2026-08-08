(() => {
  'use strict';

  const THEME_STORAGE_KEY = 'personal_os_brief_theme_v2';

  function readInitialTheme() {
    try {
      const urlTheme = new URL(window.location.href).searchParams.get('theme');
      if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme;
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  const initialTheme = readInitialTheme();
  document.documentElement.dataset.theme = initialTheme;
  document.documentElement.style.colorScheme = initialTheme;
  const initialThemeMeta = document.querySelector('meta[name="theme-color"]');
  if (initialThemeMeta) initialThemeMeta.content = initialTheme === 'dark' ? '#05070b' : '#edf3f8';

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const validViews = new Set(data.navigation.map(item => item.id));
  const validScenarios = new Set(Object.keys(data.scenarios));

  const state = {
    entered: false,
    entryChoiceMade: false,
    entrySelection: data.meta.defaultScenario,
    scenarioId: data.meta.defaultScenario,
    view: 'today',
    tab: '',
    theme: initialTheme,
    checkInChoice: '',
    alertRoutes: Object.create(null),
    alertRestoreFocus: null
  };

  const alertChannelIcons = { whatsapp: 'W', sms: 'TXT', push: '●', email: '@' };
  const alertChannelNames = { whatsapp: 'WhatsApp', sms: 'text', push: 'push', email: 'email' };

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenario() {
    return data.scenarios[state.scenarioId] || data.scenarios[data.meta.defaultScenario];
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value ?? '';
  }

  function preferredScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function scrollBelowTopbar(target, gap = 14) {
    if (!target) return;
    const topbarBottom = Math.max(0, $('.topbar')?.getBoundingClientRect().bottom || 0);
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topbarBottom - gap);
    window.scrollTo({ top, left: 0, behavior: preferredScrollBehavior() });
  }

  function alignWorkspaceDestination({ focus = true } = {}) {
    window.requestAnimationFrame(() => {
      scrollBelowTopbar($('#workspaceTabNavigation') || $('#workspacePanel'));
      if (focus) $('#workspacePanel')?.focus({ preventScroll: true });
    });
  }

  function readUrlState() {
    try {
      const url = new URL(window.location.href);
      const scenario = url.searchParams.get('scenario');
      const view = url.searchParams.get('view');
      return {
        scenario: validScenarios.has(scenario) ? scenario : '',
        view: validViews.has(view) ? view : 'today'
      };
    } catch {
      return { scenario: '', view: 'today' };
    }
  }

  function updateUrl(push = false) {
    if (!state.entered) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', state.scenarioId);
      url.searchParams.set('view', state.view);
      if (state.view === 'workspace' && state.tab) url.searchParams.set('tab', state.tab);
      else url.searchParams.delete('tab');
      url.hash = '';
      history[push ? 'pushState' : 'replaceState']({ briefDemo: true, scenario: state.scenarioId, view: state.view, tab: state.tab }, '', url);
    } catch {}
  }

  function clearBriefUrlState() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('scenario');
      url.searchParams.delete('view');
      url.searchParams.delete('tab');
      url.hash = '';
      history.replaceState(null, '', url);
    } catch {}
  }

  function formatDate() {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(new Date());
  }

  function renderEntry() {
    const host = $('#entryScenarioGrid');
    if (!host) return;
    const previewControl = $('#entrySpacePreview') ? ' aria-controls="entrySpacePreview"' : '';
    host.innerHTML = Object.values(data.scenarios).map((item, index) => `
      <button class="entry-option" type="button" data-entry-scenario="${escapeHtml(item.id)}" aria-pressed="${item.id === state.entrySelection}"${previewControl}>
        <span class="entry-option-topline"><b>${String(index + 1).padStart(2, '0')}</b><em>${escapeHtml(item.entryPreview?.badge || 'Briefing')}</em></span>
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.short)}</small>
      </button>
    `).join('');
  }

  function renderEntryPreview(item) {
    const host = $('#entrySpacePreview');
    if (!host || !item) return;
    const preview = item.entryPreview || {};
    const metrics = Array.isArray(preview.metrics) && preview.metrics.length
      ? preview.metrics
      : item.stats.slice(0, 3).map(metric => ({ label: metric.label, value: metric.value }));

    host.dataset.entryPreview = item.id;
    setText('#entryPreviewKicker', preview.kicker || `${item.label.toUpperCase()} BRIEF`);
    setText('#entryPreviewTitle', preview.title || item.headline);
    setText('#entryPreviewCopy', preview.copy || item.summary);
    setText('#entryPreviewPrivate', preview.privateLabel || 'Private records keep their current scope');
    setText('#entryPreviewShared', preview.sharedLabel || 'Approved details can support this Space');

    const metricHost = $('#entryPreviewMetrics');
    if (metricHost) {
      metricHost.innerHTML = metrics.map(metric => `
        <span><small>${escapeHtml(metric.label)}</small><strong>${escapeHtml(metric.value)}</strong></span>
      `).join('');
    }
  }

  function keepEntryChoiceVisible(trigger) {
    if (!(trigger instanceof HTMLElement) || !window.matchMedia('(max-width: 620px)').matches) return;
    window.requestAnimationFrame(() => {
      const entry = $('#entry');
      const open = $('#openDemoSticky');
      if (!entry || !open) return;
      const choiceRect = trigger.getBoundingClientRect();
      const actionRect = open.getBoundingClientRect();
      const overlap = choiceRect.bottom - (actionRect.top - 14);
      if (overlap <= 0) return;
      entry.scrollBy({
        top: overlap,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  function confirmEntryChoice(selected, trigger) {
    state.entryChoiceMade = true;
    document.body.dataset.entryChoiceMade = 'true';
    setText('#entryMobileChoiceHint', `${selected.label} selected`);

    const actions = [$('#openDemo'), $('#openDemoSticky')].filter(Boolean);
    if (!actions.length) return;
    actions.forEach(open => open.classList.remove('is-selection-ready'));
    void actions[0].offsetWidth;
    actions.forEach(open => open.classList.add('is-selection-ready'));
    keepEntryChoiceVisible(trigger);
    window.setTimeout(() => keepEntryChoiceVisible(trigger), 360);
  }

  function setEntrySelection(id, options = {}) {
    state.entrySelection = validScenarios.has(id) ? id : '';
    $$('[data-entry-scenario]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.entryScenario === state.entrySelection));
    });
    const actions = [$('#openDemo'), $('#openDemoSticky')].filter(Boolean);
    if (!actions.length) return;
    const selected = data.scenarios[state.entrySelection];
    const waitsForMobileChoice = window.matchMedia('(max-width: 620px)').matches
      && !state.entryChoiceMade
      && options.userInitiated !== true;
    actions.forEach(open => { open.disabled = !selected || waitsForMobileChoice; });
    const actionLabel = selected && !waitsForMobileChoice ? `Open ${selected.label} Briefing` : 'Choose a Briefing';
    setText('#openDemoLabel', actionLabel);
    setText('#openDemoStickyLabel', actionLabel);
    if (selected) renderEntryPreview(selected);
    if (selected && options.userInitiated === true) confirmEntryChoice(selected, options.trigger);
  }

  function renderScenarioSelect() {
    const select = $('#scenarioSelect');
    if (!select) return;
    select.innerHTML = Object.values(data.scenarios).map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join('');
    select.value = state.scenarioId;
  }

  function renderNavigation() {
    const markup = data.navigation.map(item => `
      <button type="button" data-primary-view="${escapeHtml(item.id)}" aria-current="${item.id === state.view ? 'page' : 'false'}">${escapeHtml(item.label)}</button>
    `).join('');
    const primary = $('#primaryNav');
    const mobile = $('#mobileNav');
    if (primary) primary.innerHTML = `${markup}<a class="primary-guide-link" href="/doc/"><span>Concept guide</span><i aria-hidden="true">↗</i></a>`;
    if (mobile) mobile.innerHTML = markup;
  }

  function renderWeather(item) {
    setText('#weatherLocation', item.location);
    setText('#weatherTemperature', item.temperature);
    setText('#weatherCondition', item.condition);
    setText('#weatherAdvice', item.advice);
    setText('#weatherHigh', item.high);
    setText('#weatherLow', item.low);

    const host = $('#hourlyStrip');
    if (!host) return;
    host.innerHTML = item.hourly.map(hour => `
      <article class="hourly-item">
        <time>${escapeHtml(hour.time)}</time>
        <strong>${escapeHtml(hour.temp)}°</strong>
        <small>${escapeHtml(hour.label || `${hour.rain}% rain`)}</small>
      </article>
    `).join('');
  }

  function renderStats(items) {
    const host = $('#statsGrid');
    if (!host) return;
    host.innerHTML = items.map(item => `
      <article class="stat-card">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>${escapeHtml(item.note)}</small>
      </article>
    `).join('');
  }

  function renderFlow(items) {
    const host = $('#flowList');
    if (!host) return;
    host.innerHTML = items.map(item => `
      <li>
        <time>${escapeHtml(item.time)}</time>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.meta)}</span>
      </li>
    `).join('');
  }

  function renderHighlights(items = []) {
    const host = $('#spaceHighlights');
    if (!host) return;
    host.innerHTML = items.map((item, index) => `
      <button class="space-highlight" type="button" data-highlight-tab="${escapeHtml(item.tab)}">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.detail)}</small>
        <b>Open module <i aria-hidden="true">→</i></b>
      </button>
    `).join('');
  }

  function renderPriority(item) {
    const host = $('#priorityNotice');
    const button = $('#priorityReview');
    if (!host) return;
    if (!item) {
      host.hidden = true;
      if (button) button.dataset.priorityTab = '';
      return;
    }

    host.hidden = false;
    host.dataset.priorityTone = item.tone || 'warning';
    setText('#priorityLabel', item.label);
    setText('#priorityTitle', item.title);
    setText('#priorityDetail', item.detail);
    if (button) button.dataset.priorityTab = item.targetTab || '';
    renderPriorityRouteSummary();
  }

  function currentAlertRoute() {
    return data.alertRoutes?.[state.scenarioId] || null;
  }

  function alertSelection(route = currentAlertRoute()) {
    if (!route) return new Set();
    if (!state.alertRoutes[state.scenarioId]) {
      state.alertRoutes[state.scenarioId] = new Set(route.channels.filter(channel => channel.active).map(channel => channel.id));
    }
    return state.alertRoutes[state.scenarioId];
  }

  function activeAlertChannels(route = currentAlertRoute()) {
    if (!route) return [];
    const selected = alertSelection(route);
    return route.channels.filter(channel => selected.has(channel.id));
  }

  function alertRouteSummary(route = currentAlertRoute()) {
    const active = activeAlertChannels(route);
    if (!active.length) return 'Delivery paused';
    const names = active.map(channel => alertChannelNames[channel.id] || channel.label.toLowerCase());
    if (names.length === 1) return names[0][0].toUpperCase() + names[0].slice(1);
    if (names.length === 2) return `${names[0][0].toUpperCase() + names[0].slice(1)} + ${names[1]}`;
    return `${names[0][0].toUpperCase() + names[0].slice(1)} + ${names.length - 1} more`;
  }

  function renderPriorityRouteSummary() {
    const button = $('#priorityRoutingButton');
    const route = currentAlertRoute();
    if (button) button.hidden = !route;
    setText('#priorityRouteSummary', alertRouteSummary(route));
  }

  function renderPriorityRoutingDialog() {
    const route = currentAlertRoute();
    const scenario = currentScenario();
    const priority = scenario.priority;
    const list = $('#priorityChannelList');
    if (!route || !list) return;
    const selected = alertSelection(route);
    const active = activeAlertChannels(route);
    const preview = active[0] || route.channels[0];

    setText('#priorityRoutingContext', `${scenario.label.toUpperCase()} BRIEFING`);
    setText('#priorityRoutingLabel', route.label);
    setText('#priorityRoutingRule', route.rule);
    setText('#priorityChannelCount', `${active.length} active`);
    setText('#priorityFirstRoute', active.length ? `${active[0].label} · ${active[0].destination}` : 'All delivery paused');
    setText('#priorityFallback', route.fallback);
    setText('#priorityQuietHours', route.quietHours);
    setText('#priorityPreviewChannel', active.length ? preview.label : 'Delivery paused');
    setText('#priorityPreviewIcon', active.length ? (alertChannelIcons[preview.id] || '•') : 'Ⅱ');
    setText('#priorityPreviewDestination', active.length ? preview.destination : 'No active destination');
    setText('#priorityPreviewScope', active.length ? preview.scope.toUpperCase() : 'PREVIEW PAUSED');
    setText('#priorityPreviewTitle', priority?.title || 'Priority update ready for review');
    setText('#priorityRoutingStatus', '');

    list.innerHTML = route.channels.map(channel => {
      const enabled = selected.has(channel.id);
      return `
        <button class="priority-channel" type="button" role="switch" aria-checked="${enabled}" data-alert-channel="${escapeHtml(channel.id)}">
          <span class="priority-channel-icon" data-channel="${escapeHtml(channel.id)}" aria-hidden="true">${escapeHtml(alertChannelIcons[channel.id] || '•')}</span>
          <span class="priority-channel-copy"><strong>${escapeHtml(channel.label)}</strong><small>${escapeHtml(channel.destination)} · ${escapeHtml(channel.timing)}</small><em>${escapeHtml(channel.scope)}</em></span>
          <span class="priority-channel-switch" aria-hidden="true"><i></i></span>
        </button>`;
    }).join('');
  }

  function openPriorityRouting(event) {
    const dialog = $('#priorityRoutingDialog');
    if (!dialog || !currentAlertRoute()) return;
    state.alertRestoreFocus = event?.currentTarget || $('#priorityRoutingButton');
    renderPriorityRoutingDialog();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    queueMicrotask(() => $('[data-alert-channel]', dialog)?.focus({ preventScroll: true }));
  }

  function finishPriorityRoutingClose() {
    const trigger = state.alertRestoreFocus;
    state.alertRestoreFocus = null;
    trigger?.focus({ preventScroll: true });
  }

  function closePriorityRouting({ restoreFocus = true } = {}) {
    const dialog = $('#priorityRoutingDialog');
    if (!dialog?.open) return;
    if (!restoreFocus) state.alertRestoreFocus = null;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      finishPriorityRoutingClose();
    }
  }

  function togglePriorityChannel(button) {
    const route = currentAlertRoute();
    const id = button.dataset.alertChannel;
    if (!route?.channels.some(channel => channel.id === id)) return;
    const selected = alertSelection(route);
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    renderPriorityRoutingDialog();
    renderPriorityRouteSummary();
    queueMicrotask(() => $(`[data-alert-channel="${id}"]`, $('#priorityRoutingDialog'))?.focus({ preventScroll: true }));
  }

  function savePriorityRouting() {
    renderPriorityRouteSummary();
    setText('#priorityRoutingStatus', 'Demo routing saved. No message was sent.');
    $('#savePriorityRouting')?.setAttribute('data-routing-saved', 'true');
  }

  function renderToday() {
    const item = currentScenario();
    setText('#greeting', item.greeting);
    setText('#heroTitle', item.headline);
    setText('#heroSummary', item.summary);
    setText('#nextTime', item.next.time);
    setText('#nextTitle', item.next.title);
    setText('#nextDetail', item.next.detail);
    setText('#recommendationLabel', item.recommendation.label);
    setText('#recommendationTitle', item.recommendation.title);
    setText('#recommendationDetail', item.recommendation.detail);
    const recommendationButton = $('#recommendationViewButton');
    const recommendationTab = normalizeTab(item.recommendation.targetTab || item.highlights?.[0]?.tab || '');
    const recommendationTabLabel = item.tabs.find(tab => tab.id === recommendationTab)?.label || 'related module';
    if (recommendationButton) recommendationButton.dataset.goTab = recommendationTab;
    setText('#recommendationViewLabel', `Open ${recommendationTabLabel}`);
    renderPriority(item.priority);
    renderWeather(item.weather);
    renderStats(item.stats);
    renderFlow(item.flow);
    renderHighlights(item.highlights);
  }

  function allowedTabs() {
    return currentScenario().tabs || [];
  }

  function normalizeTab(tab) {
    const tabs = allowedTabs();
    return tabs.some(item => item.id === tab) ? tab : tabs[0]?.id || '';
  }

  function renderDetailCards(cards = []) {
    return `<div class="detail-grid">
      ${cards.map(card => `
        <article class="detail-card">
          <div class="detail-card-label-row">
            <span class="detail-card-label">${escapeHtml(card.label)}</span>
            ${card.scope ? `<small class="scope-pill">${escapeHtml(card.scope)}</small>` : ''}
          </div>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.detail)}</p>
        </article>
      `).join('')}
    </div>`;
  }

  function renderHabitTracker(detail) {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return `<div class="habit-tracker" aria-label="Fictional habit progress">
      ${detail.habits.map(habit => `
        <article class="habit-tracker-row">
          <header>
            <div><span>PRIVATE HABIT</span><h3>${escapeHtml(habit.name)}</h3></div>
            <strong>${escapeHtml(habit.current)}</strong>
          </header>
          <div class="habit-week" aria-label="${escapeHtml(habit.name)} weekly completion">
            ${habit.days.map((complete, index) => `
              <span class="${complete ? 'is-complete' : ''}" aria-label="${dayLabels[index]} ${complete ? 'complete' : 'open'}">
                <b>${dayLabels[index]}</b><i aria-hidden="true">${complete ? '✓' : ''}</i>
              </span>
            `).join('')}
          </div>
          <footer><span>${escapeHtml(habit.target)} target</span><span>${escapeHtml(habit.best)}</span><strong>${escapeHtml(habit.note)}</strong></footer>
        </article>
      `).join('')}
      <p class="workspace-boundary-note"><strong>Sharing rule:</strong> a Personal habit remains private unless the user approves a specific result, plan, or time for another Space.</p>
    </div>`;
  }

  function renderFamilyCalendar(detail) {
    return `<div class="family-calendar" aria-label="Fictional approved family calendar">
      ${detail.days.map(day => `
        <article class="family-calendar-day">
          <header><span>${escapeHtml(day.day)}</span><strong>${escapeHtml(day.date)}</strong></header>
          <ol>${day.events.map(event => `
            <li class="${event.kind === 'Availability only' ? 'is-private-block' : ''}">
              <time>${escapeHtml(event.time)}</time>
              <div><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.owner)}</small></div>
              <span>${escapeHtml(event.kind)}</span>
            </li>
          `).join('')}</ol>
        </article>
      `).join('')}
      <p class="workspace-boundary-note"><strong>Calendar boundary:</strong> private titles, notes, attendees, and locations stay hidden. The Family Space can use an approved event or a simple busy block for coordination.</p>
    </div>`;
  }

  function renderHouseholdBoard(detail) {
    return `<div class="household-board" aria-label="Fictional family chore board">
      ${detail.columns.map(column => `
        <section class="household-column" data-board-tone="${escapeHtml(column.tone)}">
          <header><span aria-hidden="true"></span><h3>${escapeHtml(column.title)}</h3><small>${column.items.length}</small></header>
          <div>${column.items.map(item => `
            <article><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.owner)}</p><small>${escapeHtml(item.due)}</small></article>
          `).join('')}</div>
        </section>
      `).join('')}
    </div>`;
  }

  function renderShoppingList(detail) {
    return `<div class="shopping-groups" aria-label="Fictional shared family shopping list">
      ${detail.groups.map(group => `
        <section>
          <header><h3>${escapeHtml(group.title)}</h3><span>${group.items.filter(item => item.checked).length}/${group.items.length}</span></header>
          <ul>${group.items.map(item => `
            <li class="${item.checked ? 'is-checked' : ''}">
              <span class="shopping-check" aria-hidden="true">${item.checked ? '✓' : ''}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.owner)}</small>
            </li>
          `).join('')}</ul>
        </section>
      `).join('')}
    </div>`;
  }

  function renderDetailBody(detail) {
    const advancedMarkup = window.BRIEF_DEMO_ADVANCED?.renderDetail(detail);
    if (advancedMarkup) return advancedMarkup;
    if (detail.layout === 'habits') return renderHabitTracker(detail);
    if (detail.layout === 'calendar') return renderFamilyCalendar(detail);
    if (detail.layout === 'board') return renderHouseholdBoard(detail);
    if (detail.layout === 'checklist') return renderShoppingList(detail);
    return renderDetailCards(detail.cards);
  }

  function keepDocumentAligned() {
    const scrollingElement = document.scrollingElement;
    if (scrollingElement && Math.abs(scrollingElement.scrollLeft) > 0) scrollingElement.scrollLeft = 0;
    if (document.body && Math.abs(document.body.scrollLeft) > 0) document.body.scrollLeft = 0;
  }

  function revealWorkspaceTab(button) {
    const host = $('#workspaceTabs');
    if (!host || !button) return;
    const hostRect = host.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const inset = 10;
    if (buttonRect.left < hostRect.left + inset) host.scrollBy({ left: buttonRect.left - hostRect.left - inset, behavior: 'smooth' });
    if (buttonRect.right > hostRect.right - inset) host.scrollBy({ left: buttonRect.right - hostRect.right + inset, behavior: 'smooth' });
    requestAnimationFrame(() => {
      keepDocumentAligned();
      updateWorkspaceTabNavigation();
    });
  }

  function updateWorkspaceTabNavigation() {
    const host = $('#workspaceTabs');
    const previous = $('[data-workspace-tab-step="previous"]');
    const next = $('[data-workspace-tab-step="next"]');
    const hint = $('#workspaceTabHint');
    if (!host || !previous || !next || !hint) return;

    const tabs = allowedTabs();
    const activeIndex = Math.max(0, tabs.findIndex(item => item.id === state.tab));
    const active = tabs[activeIndex];
    const previousSection = tabs[activeIndex - 1];
    const nextSection = tabs[activeIndex + 1];
    const overflowing = host.scrollWidth > host.clientWidth + 6;
    previous.hidden = tabs.length < 2;
    next.hidden = tabs.length < 2;
    previous.disabled = !previousSection;
    next.disabled = !nextSection;
    previous.dataset.targetTab = previousSection?.id || '';
    next.dataset.targetTab = nextSection?.id || '';
    previous.setAttribute('aria-label', previousSection ? `Open previous section: ${previousSection.label}` : 'No previous briefing section');
    next.setAttribute('aria-label', nextSection ? `Open next section: ${nextSection.label}` : 'No more briefing sections');
    previous.title = previousSection ? `Previous: ${previousSection.label}` : '';
    next.title = nextSection ? `Next: ${nextSection.label}` : '';
    hint.hidden = false;
    hint.textContent = `Section ${activeIndex + 1} of ${tabs.length}: ${active?.label || 'Briefing section'}. Use the arrows or choose a section.`;
    host.dataset.overflowing = String(overflowing);
  }

  function moveWorkspaceTabs(direction) {
    const tabs = allowedTabs();
    const activeIndex = Math.max(0, tabs.findIndex(item => item.id === state.tab));
    const targetIndex = direction === 'previous' ? activeIndex - 1 : activeIndex + 1;
    const target = tabs[targetIndex];
    if (!target) return;
    setWorkspaceTab(target.id, { push: true, focus: true });
  }

  function scrollThroughToday() {
    const target = ['#priorityNotice', '.space-discovery', '.today-grid', '.today-lower']
      .map(selector => $(selector))
      .find(node => node && !node.hidden && node.getClientRects().length > 0);
    if (!target) return;
    target.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  function renderWorkspaceTabs() {
    const host = $('#workspaceTabs');
    if (!host) return;
    state.tab = normalizeTab(state.tab);
    host.innerHTML = allowedTabs().map(item => {
      const active = item.id === state.tab;
      return `
        <button type="button" role="tab" id="brief-next-tab-${escapeHtml(item.id)}" data-workspace-tab="${escapeHtml(item.id)}" aria-selected="${active}" aria-controls="workspacePanel" tabindex="${active ? 0 : -1}">${escapeHtml(item.label)}</button>
      `;
    }).join('');
    window.requestAnimationFrame(updateWorkspaceTabNavigation);
  }

  function renderWorkspacePanel() {
    const host = $('#workspacePanel');
    if (!host) return;
    const detail = currentScenario().details[state.tab];
    if (!detail) {
      host.innerHTML = '<p>No detail view is available for this category.</p>';
      return;
    }
    const tabs = allowedTabs();
    const activeIndex = Math.max(0, tabs.findIndex(item => item.id === state.tab));
    const previous = tabs[activeIndex - 1];
    const next = tabs[activeIndex + 1];
    const sectionLinks = tabs;
    const connectedSections = [...tabs.slice(activeIndex + 1), ...tabs.slice(0, activeIndex)]
      .filter(item => item.id !== state.tab)
      .slice(0, 2);
    host.setAttribute('aria-labelledby', `brief-next-tab-${state.tab}`);
    host.innerHTML = `
      <header class="workspace-panel-heading">
        <div>
          <p class="eyebrow">${escapeHtml(currentScenario().label)} WORKSPACE</p>
          <h2>${escapeHtml(detail.title)}</h2>
          <p>${escapeHtml(detail.summary)}</p>
        </div>
        <button class="section-ai-button" type="button" data-ai-trigger data-ai-kind="workspace" data-ai-title="${escapeHtml(detail.title)}" aria-label="Open a conversation about ${escapeHtml(detail.title)}" aria-haspopup="dialog" title="Use this section as conversation context"><span aria-hidden="true">✦</span></button>
      </header>
      <nav class="workspace-section-progress" aria-label="Move through briefing sections">
        <span><b>${activeIndex + 1}</b> of ${tabs.length}</span>
        <div>
          ${previous ? `<button class="workspace-previous-section" type="button" data-workspace-continue="${escapeHtml(previous.id)}"><span aria-hidden="true">←</span> ${escapeHtml(previous.label)}</button>` : ''}
          ${next ? `<button class="workspace-next-section" type="button" data-workspace-continue="${escapeHtml(next.id)}"><span>Continue to ${escapeHtml(next.label)}</span><i aria-hidden="true">→</i></button>` : '<span class="workspace-section-complete">Final section</span>'}
        </div>
      </nav>
      ${sectionLinks.length ? `
        <nav class="workspace-related-links" aria-label="Explore more briefing sections">
          <header><div><span>Explore the full picture</span><small>Five connected views. Each one changes what the briefing can tell you.</small></div><b>${tabs.length} views</b></header>
          <div>${sectionLinks.map(item => {
            const relatedDetail = currentScenario().details[item.id];
            const isCurrent = item.id === state.tab;
            const sectionNumber = tabs.findIndex(tab => tab.id === item.id) + 1;
            return `<button type="button" ${isCurrent ? 'class="is-current" aria-current="page" disabled' : `data-workspace-continue="${escapeHtml(item.id)}"`}><em aria-hidden="true">0${sectionNumber}</em><small>${isCurrent ? 'Viewing now' : 'Discover next'}</small><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(relatedDetail?.summary || 'Open the records and decisions connected to this part of the briefing.')}</span><i aria-hidden="true">${isCurrent ? '✓' : '→'}</i></button>`;
          }).join('')}</div>
        </nav>
      ` : ''}
      ${renderDetailBody(detail)}
      ${connectedSections.length ? `
        <nav class="workspace-thread-links" aria-label="Continue into connected briefing sections">
          <header><div><span>Continue the thread</span><small>The next useful context is already connected.</small></div><i aria-hidden="true">↗</i></header>
          <div>${connectedSections.map((item, index) => {
            const connectedDetail = currentScenario().details[item.id];
            return `<button type="button" data-workspace-continue="${escapeHtml(item.id)}"><small>${index === 0 ? 'Recommended next' : 'Another angle'}</small><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(connectedDetail?.summary || 'See the related records and decisions in this view.')}</span><i aria-hidden="true">→</i></button>`;
          }).join('')}</div>
        </nav>
      ` : ''}
    `;
  }

  function setWorkspaceTab(tab, options = {}) {
    state.tab = normalizeTab(tab);
    $$('[data-workspace-tab]').forEach(button => {
      const active = button.dataset.workspaceTab === state.tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    renderWorkspacePanel();
    revealWorkspaceTab($(`[data-workspace-tab="${CSS.escape(state.tab)}"]`));
    updateUrl(options.push === true);
    document.dispatchEvent(new CustomEvent('briefdemo:tabchange', { detail: { scenarioId: state.scenarioId, view: state.view, tab: state.tab } }));
    if (options.align) alignWorkspaceDestination({ focus: options.focus !== false });
    else if (options.focus) $('#workspacePanel')?.focus({ preventScroll: true });
  }

  function moveWorkspaceTab(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = $$('[data-workspace-tab]');
    const currentIndex = tabs.indexOf(event.target);
    if (currentIndex < 0 || !tabs.length) return;

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    const next = tabs[nextIndex];
    setWorkspaceTab(next.dataset.workspaceTab, { push: true, focus: false });
    next.focus();
  }

  function renderSpaces() {
    const item = currentScenario().space;
    setText('#privateSpaceTitle', `${currentScenario().label} private context`);
    setText('#sharedSpaceTitle', item.title);
    const privateList = $('#privateSpaceList');
    const sharedList = $('#sharedSpaceList');
    if (privateList) privateList.innerHTML = item.private.map(value => `<li>${escapeHtml(value)}</li>`).join('');
    if (sharedList) sharedList.innerHTML = item.shared.map(value => `<li>${escapeHtml(value)}</li>`).join('');
  }

  function renderContextLabels() {
    const item = currentScenario();
    setText('#railContextTitle', item.label);
    setText('#railContextCopy', item.short);
    const select = $('#scenarioSelect');
    if (select) select.value = item.id;
  }

  function renderBriefUpdate() {
    const item = currentScenario().checkIn;
    const choices = $('#briefUpdateChoices');
    state.checkInChoice = '';
    setText('#briefUpdateQuestion', item?.question || 'What should this Brief know for the next update?');
    setText('#briefUpdateStatus', '');
    if (choices) {
      choices.innerHTML = (item?.choices || ['Confirmed', 'Needs a change', 'Ask later']).map(choice => `
        <button type="button" data-check-in-choice="${escapeHtml(choice)}" aria-pressed="false">${escapeHtml(choice)}</button>
      `).join('');
    }
    const input = $('#briefCorrectionInput');
    if (input) {
      input.value = '';
      input.placeholder = item?.placeholder || 'Add one short correction';
    }
  }

  function openBriefUpdate() {
    const dialog = $('#briefUpdateDialog');
    if (!dialog) return;
    renderBriefUpdate();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    queueMicrotask(() => $('[data-check-in-choice]', dialog)?.focus({ preventScroll: true }));
  }

  function closeBriefUpdate() {
    const dialog = $('#briefUpdateDialog');
    if (!dialog?.open) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    $('#briefUpdateButton')?.focus({ preventScroll: true });
  }

  function chooseBriefUpdate(button) {
    const host = $('#briefUpdateChoices');
    if (!host) return;
    state.checkInChoice = button.dataset.checkInChoice || '';
    $$('[data-check-in-choice]', host).forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice === button));
    });
  }

  function saveBriefUpdate() {
    const correction = $('#briefCorrectionInput')?.value.trim() || '';
    if (!state.checkInChoice && !correction) {
      setText('#briefUpdateStatus', 'Choose one answer or add a short correction first.');
      $('#briefUpdateChoices [data-check-in-choice]')?.focus({ preventScroll: true });
      return;
    }

    const summary = [state.checkInChoice, correction].filter(Boolean).join(' · ');
    setText('#briefUpdateStatus', `Saved inside this demo: ${summary}. A production Space would show the source and revision before using it in the next Brief.`);
    $('#saveBriefUpdate')?.setAttribute('data-update-saved', 'true');
  }

  function setScenario(id, options = {}) {
    if (!validScenarios.has(id)) return;
    closePriorityRouting({ restoreFocus: false });
    state.scenarioId = id;
    state.tab = normalizeTab('');
    state.checkInChoice = '';
    closeBriefUpdate();
    document.body.dataset.scenario = id;
    renderContextLabels();
    renderToday();
    renderWorkspaceTabs();
    renderWorkspacePanel();
    renderSpaces();
    window.BRIEF_DEMO_MEDIA?.setScenario(id);
    updateUrl(options.push === true);
    document.dispatchEvent(new CustomEvent('briefdemo:scenariochange', { detail: { scenarioId: id } }));
  }

  function selectView(view, options = {}) {
    const next = validViews.has(view) ? view : 'today';
    state.view = next;
    document.body.dataset.view = next;

    $$('[data-view-panel]').forEach(panel => {
      const active = panel.dataset.viewPanel === next;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    $$('[data-primary-view]').forEach(button => {
      button.setAttribute('aria-current', button.dataset.primaryView === next ? 'page' : 'false');
    });

    if (next === 'workspace') {
      renderWorkspaceTabs();
      renderWorkspacePanel();
    }
    updateUrl(options.push === true);
    document.dispatchEvent(new CustomEvent('briefdemo:viewchange', { detail: { scenarioId: state.scenarioId, view: next, tab: state.tab } }));

    if (options.focus !== false) {
      $('#demoMain')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }

  function startScenario(id, options = {}) {
    if (!validScenarios.has(id)) return;
    state.view = 'today';
    setScenario(id, { push: options.push === true });
    selectView('today', { push: false, focus: options.focus !== false });
  }

  function setTheme(theme, persist = true) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.style.colorScheme = state.theme;
    const button = $('#themeButton');
    button?.setAttribute('aria-pressed', String(state.theme === 'dark'));
    button?.setAttribute('aria-label', state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = state.theme === 'dark' ? '#05070b' : '#edf3f8';
    if (persist) {
      try { localStorage.setItem(THEME_STORAGE_KEY, state.theme); } catch {}
    }
  }

  function installEntryBottomActionObserver() {
    const entry = $('#entry');
    const bottomAction = $('#openDemo');
    if (!entry || !bottomAction) return;
    const updateVisibility = () => {
      const entryRect = entry.getBoundingClientRect();
      const actionRect = bottomAction.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(entryRect.bottom, actionRect.bottom) - Math.max(entryRect.top, actionRect.top));
      const visible = actionRect.height > 0 && visibleHeight / actionRect.height >= 0.7;
      document.body.dataset.entryBottomActionVisible = String(visible);
    };
    entry.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    if (typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(updateVisibility, { root: entry, threshold: [0, 0.7, 1] });
      observer.observe(bottomAction);
    }
    window.requestAnimationFrame(updateVisibility);
  }

  function openDemo() {
    const selected = state.entrySelection;
    if (!validScenarios.has(selected)) return;

    state.entered = true;
    document.body.dataset.entered = 'true';
    $('#demoApp')?.setAttribute('aria-hidden', 'false');
    startScenario(selected, { push: false, focus: true });
    updateUrl(false);
  }

  function resetDemo() {
    state.entered = false;
    state.entryChoiceMade = false;
    state.entrySelection = data.meta.defaultScenario;
    state.view = 'today';
    state.tab = '';
    document.body.dataset.entered = 'false';
    document.body.dataset.entryChoiceMade = 'false';
    $('#demoApp')?.setAttribute('aria-hidden', 'true');
    window.BRIEF_DEMO_MEDIA?.reset();
    closeBriefUpdate();
    closePriorityRouting({ restoreFocus: false });
    selectView('today', { push: false, focus: false });
    renderEntry();
    setEntrySelection(data.meta.defaultScenario);
    setText('#entryMobileChoiceHint', 'Tap one to continue');
    clearBriefUrlState();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    queueMicrotask(() => $(`[data-entry-scenario="${data.meta.defaultScenario}"]`)?.focus({ preventScroll: true }));
  }

  function installEvents() {
    $('#entryScenarioGrid')?.addEventListener('click', event => {
      const button = event.target.closest('[data-entry-scenario]');
      if (button) setEntrySelection(button.dataset.entryScenario, { userInitiated: true, trigger: button });
    });

    $('#openDemo')?.addEventListener('click', openDemo);
    $('#openDemoSticky')?.addEventListener('click', openDemo);
    $('#scenarioSelect')?.addEventListener('change', event => startScenario(event.target.value, { push: true, focus: true }));
    $('#homeButton')?.addEventListener('click', () => selectView('today', { push: true }));
    $('#resetDemo')?.addEventListener('click', resetDemo);
    $('#workspaceTabs')?.addEventListener('keydown', moveWorkspaceTab);
    $('#workspaceTabs')?.addEventListener('scroll', updateWorkspaceTabNavigation, { passive: true });
    $('[data-workspace-tab-step="previous"]')?.addEventListener('click', () => moveWorkspaceTabs('previous'));
    $('[data-workspace-tab-step="next"]')?.addEventListener('click', () => moveWorkspaceTabs('next'));
    $('#briefUpdateButton')?.addEventListener('click', openBriefUpdate);
    $('#closeBriefUpdate')?.addEventListener('click', closeBriefUpdate);
    $('#cancelBriefUpdate')?.addEventListener('click', closeBriefUpdate);
    $('#saveBriefUpdate')?.addEventListener('click', saveBriefUpdate);
    $('#priorityRoutingButton')?.addEventListener('click', openPriorityRouting);
    $('#closePriorityRouting')?.addEventListener('click', () => closePriorityRouting());
    $('#cancelPriorityRouting')?.addEventListener('click', () => closePriorityRouting());
    $('#savePriorityRouting')?.addEventListener('click', savePriorityRouting);
    $('#priorityChannelList')?.addEventListener('click', event => {
      const button = event.target.closest('[data-alert-channel]');
      if (button) togglePriorityChannel(button);
    });
    const priorityRoutingDialog = $('#priorityRoutingDialog');
    priorityRoutingDialog?.addEventListener('click', event => {
      if (event.target === priorityRoutingDialog) closePriorityRouting();
    });
    priorityRoutingDialog?.addEventListener('close', finishPriorityRoutingClose);
    $('#briefUpdateChoices')?.addEventListener('click', event => {
      const button = event.target.closest('[data-check-in-choice]');
      if (button) chooseBriefUpdate(button);
    });
    $('#priorityReview')?.addEventListener('click', event => {
      const targetTab = event.currentTarget.dataset.priorityTab;
      selectView('workspace', { push: true, focus: !targetTab });
      if (targetTab) setWorkspaceTab(targetTab, { push: false, focus: true, align: true });
    });

    document.addEventListener('click', event => {
      const viewButton = event.target.closest('[data-primary-view]');
      if (viewButton) {
        selectView(viewButton.dataset.primaryView, { push: true });
        return;
      }

      if (event.target.closest('[data-scroll-today]')) {
        scrollThroughToday();
        return;
      }

      const goButton = event.target.closest('[data-go-view]');
      if (goButton) {
        const targetTab = goButton.dataset.goTab;
        selectView(goButton.dataset.goView, { push: true, focus: !targetTab });
        if (targetTab) setWorkspaceTab(targetTab, { push: false, focus: true, align: true });
        return;
      }

      const highlightButton = event.target.closest('[data-highlight-tab]');
      if (highlightButton) {
        selectView('workspace', { push: true, focus: false });
        setWorkspaceTab(highlightButton.dataset.highlightTab, { push: false, focus: true, align: true });
        return;
      }

      const tabButton = event.target.closest('[data-workspace-tab]');
      if (tabButton) {
        setWorkspaceTab(tabButton.dataset.workspaceTab, {
          push: true,
          focus: true,
          align: tabButton.dataset.alignDestination === 'true'
        });
        return;
      }

      const continueButton = event.target.closest('[data-workspace-continue]');
      if (continueButton) {
        setWorkspaceTab(continueButton.dataset.workspaceContinue, { push: true, focus: true, align: true });
        return;
      }

      if (event.target.closest('[data-close-media]')) window.BRIEF_DEMO_MEDIA?.close();
    });

    $('#mediaButton')?.addEventListener('click', () => window.BRIEF_DEMO_MEDIA?.open());
    $('#previewButton')?.addEventListener('click', () => window.BRIEF_DEMO_MEDIA?.togglePreview());
    $('#themeButton')?.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') window.BRIEF_DEMO_MEDIA?.close();
    });

    window.addEventListener('popstate', event => {
      if (!state.entered) return;
      const urlState = readUrlState();
      const nextScenario = event.state?.scenario || urlState.scenario || state.scenarioId;
      const nextView = event.state?.view || urlState.view;
      const nextTab = event.state?.tab || new URL(window.location.href).searchParams.get('tab') || '';
      setScenario(nextScenario, { push: false });
      state.tab = normalizeTab(nextTab);
      selectView(nextView, { push: false, focus: false });
      if (nextView === 'workspace') setWorkspaceTab(state.tab, { push: false, focus: false });
    });

    window.addEventListener('scroll', keepDocumentAligned, { passive: true });
    window.addEventListener('resize', updateWorkspaceTabNavigation, { passive: true });
  }

  function init() {
    const urlState = readUrlState();
    state.scenarioId = urlState.scenario || data.meta.defaultScenario;
    state.view = 'today';
    state.tab = normalizeTab(new URL(window.location.href).searchParams.get('tab') || '');

    try { localStorage.removeItem('briefNextTheme'); } catch {}

    setTheme(state.theme, false);
    setText('#todayLabel', formatDate());
    setText('#heroDate', formatDate());
    renderEntry();
    renderScenarioSelect();
    renderNavigation();
    setScenario(state.scenarioId, { push: false });
    selectView('today', { push: false, focus: false });
    setEntrySelection(urlState.scenario || data.meta.defaultScenario);
    document.body.dataset.entryChoiceMade = 'false';
    installEntryBottomActionObserver();
    installEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
