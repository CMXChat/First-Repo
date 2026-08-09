(() => {
  'use strict';

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const PREFS_KEY = 'spaces_demo_briefing_preferences_v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function applyCopyRefinements() {
    const business = data.scenarios.business;
    if (business) {
      business.short = 'Two time zones, one shared company view';
      if (business.entryPreview) {
        business.entryPreview.title = 'New York and Sydney share one company view';
        business.entryPreview.copy = 'Priorities, teams, deals, concerns, and prepared decisions stay together across both workdays.';
      }
      business.summary = 'Two remote partners see the same company picture, the concerns each partner approved for sharing, and the work their teams need to move next.';
      if (business.next) business.next.title = 'Partner review';
      if (business.recommendation) business.recommendation.label = 'Shared priority';
      if (business.priority) business.priority.label = 'Cash buffer';
      if (business.space?.shared) business.space.shared = business.space.shared.map(item => item.replace('operating history', 'shared history'));
      if (business.soundtrack) business.soundtrack.note = 'Bright energy for a focused partner review.';
    }

    const accounting = data.scenarios.accounting;
    if (accounting?.weather) {
      accounting.weather = {
        ...accounting.weather,
        location: 'New York, New York',
        temperature: 82,
        condition: 'Warm and mostly clear',
        high: 86,
        low: 72,
        advice: 'The 3:30 PM review stays clear of weather delays, so the financial plan can stay focused on the records that need approval.',
        hourly: [
          { time: 'Now', temp: 82, label: 'Mostly clear' },
          { time: '3 PM', temp: 84, label: 'Warm' },
          { time: '5 PM', temp: 83, label: 'Light clouds' },
          { time: '7 PM', temp: 79, label: 'Clearer' }
        ]
      };
    }

    const team = data.scenarios.team;
    if (team?.weather) {
      team.weather.condition = 'Warm with late clouds';
      team.weather.advice = 'The release review stays inside a dry afternoon window. Keep the handoff owner clear before the later commute.';
    }
  }

  applyCopyRefinements();

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenario() {
    const id = document.body.dataset.scenario || data.meta.defaultScenario;
    return data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
  }

  function renderFallbackCards(detail) {
    const cards = Array.isArray(detail?.cards) ? detail.cards : [];
    if (!cards.length) return '<p class="workspace-overview-empty">More detail will appear here as this part of the demo develops.</p>';

    return `<div class="detail-grid">
      ${cards.map(card => `
        <article class="detail-card">
          <div class="detail-card-label-row">
            <span class="detail-card-label">${escapeHtml(card.label || 'Briefing item')}</span>
            ${card.scope ? `<small class="scope-pill">${escapeHtml(card.scope)}</small>` : ''}
          </div>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.detail)}</p>
        </article>
      `).join('')}
    </div>`;
  }

  function renderDetail(detail) {
    const advancedMarkup = window.BRIEF_DEMO_ADVANCED?.renderDetail?.(detail);
    return advancedMarkup || renderFallbackCards(detail);
  }

  function activeTabId(tabs) {
    const selected = $('[data-workspace-tab][aria-selected="true"]');
    if (selected?.dataset.workspaceTab) return selected.dataset.workspaceTab;
    return tabs[0]?.id || '';
  }

  function updateExploreHeading(scenario, count) {
    const panel = $('[data-view-panel="workspace"]');
    const eyebrow = $('.view-heading .eyebrow', panel);
    const title = $('#workspaceTitle');
    const copy = $('.view-heading-tools p', panel);
    if (eyebrow) eyebrow.textContent = 'EXPLORE THIS SPACE';
    if (title) title.textContent = `Explore the ${scenario.label} briefing`;
    if (copy) copy.textContent = `The selected category stays open while the other ${Math.max(0, count - 1)} stay easy to scan.`;
  }

  function updateExploreHint(tabs, activeId) {
    window.requestAnimationFrame(() => {
      const hint = $('#workspaceTabHint');
      if (!hint) return;
      const activeIndex = Math.max(0, tabs.findIndex(tab => tab.id === activeId));
      hint.hidden = false;
      hint.textContent = `Section ${activeIndex + 1} of ${tabs.length} is open. Choose another category above or open a preview below.`;
    });
  }

  function renderExplore() {
    const workspaceView = $('[data-view-panel="workspace"]');
    const selectedPanel = $('#workspacePanel');
    if (!workspaceView || !selectedPanel) return;

    const scenario = currentScenario();
    const tabs = Array.isArray(scenario.tabs) ? scenario.tabs : [];
    const activeId = activeTabId(tabs);
    updateExploreHeading(scenario, tabs.length);

    let host = $('#workspaceExploreOverview');
    if (!host) {
      host = document.createElement('section');
      host.id = 'workspaceExploreOverview';
      host.className = 'workspace-explore-overview';
      host.setAttribute('aria-label', 'More briefing categories');
      selectedPanel.after(host);
    }

    host.innerHTML = `
      <header class="workspace-preview-intro">
        <div><p class="eyebrow">MORE IN THIS BRIEFING</p><h2>Open another category when you need it</h2></div>
        <p>The current category keeps the full detail. These previews keep the rest of the briefing close without turning the page into one long stack.</p>
      </header>
      <div class="workspace-preview-grid">
        ${tabs.filter(tab => tab.id !== activeId).map(tab => {
          const detail = scenario.details?.[tab.id];
          if (!detail) return '';
          const originalIndex = tabs.findIndex(item => item.id === tab.id);
          return `
            <article class="workspace-preview-card" data-workspace-preview="${escapeHtml(tab.id)}">
              <div class="workspace-preview-number">${String(originalIndex + 1).padStart(2, '0')}</div>
              <div class="workspace-preview-copy">
                <p class="eyebrow">${escapeHtml(tab.label)}</p>
                <h3>${escapeHtml(detail.title)}</h3>
                <p>${escapeHtml(detail.summary)}</p>
              </div>
              <button class="workspace-preview-open" type="button" data-workspace-continue="${escapeHtml(tab.id)}">Open ${escapeHtml(tab.label)} <span aria-hidden="true">→</span></button>
            </article>`;
        }).join('')}
      </div>`;

    selectedPanel.hidden = false;
    selectedPanel.removeAttribute('aria-hidden');
    updateExploreHint(tabs, activeId);
  }

  function readPreferences() {
    const defaults = {
      scheduledOpen: false,
      scheduledTime: '07:00',
      briefStyle: 'focused',
      calendarContext: true,
      musicOnOpen: true
    };
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      return { ...defaults, ...saved };
    } catch {
      return defaults;
    }
  }

  let preferences = readPreferences();
  let settingsRestoreFocus = null;

  function savePreferences() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(preferences)); } catch {}
    document.body.dataset.briefStyle = preferences.briefStyle === 'full' ? 'full' : 'focused';
  }

  function switchMarkup(id, label, detail, checked) {
    return `
      <div class="brief-setting-row">
        <div><strong>${escapeHtml(label)}</strong><small>${escapeHtml(detail)}</small></div>
        <button type="button" class="brief-setting-switch" id="${escapeHtml(id)}" role="switch" aria-checked="${checked}"><span aria-hidden="true"></span></button>
      </div>`;
  }

  function createSettingsDialog() {
    if ($('#briefingSettingsDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'briefing-settings-dialog';
    dialog.id = 'briefingSettingsDialog';
    dialog.setAttribute('aria-labelledby', 'briefingSettingsTitle');
    dialog.innerHTML = `
      <section class="briefing-settings-shell">
        <header class="briefing-settings-heading">
          <div><p class="eyebrow">BRIEFING SETTINGS</p><h2 id="briefingSettingsTitle">Choose how this Space opens</h2></div>
          <button class="round-button" id="closeBriefingSettings" type="button" aria-label="Close briefing settings">×</button>
        </header>
        <p class="briefing-settings-intro">These controls preview how a real account could work. Settings stay in this browser and nothing is sent.</p>
        <div class="briefing-settings-list">
          ${switchMarkup('briefSettingSchedule', 'Open on a schedule', 'Preview a regular time for this briefing to be ready.', preferences.scheduledOpen)}
          <label class="brief-setting-time" for="briefSettingTime"><span>Opening time</span><input id="briefSettingTime" type="time" value="${escapeHtml(preferences.scheduledTime)}" /></label>
          <label class="brief-setting-select" for="briefSettingStyle"><span><strong>Brief style</strong><small>Focused keeps phones shorter. Full keeps the main Today sections open.</small></span><select id="briefSettingStyle"><option value="focused">Focused</option><option value="full">Full review</option></select></label>
          ${switchMarkup('briefSettingCalendar', 'Calendar context', 'Use approved schedule details when timing changes the day.', preferences.calendarContext)}
          ${switchMarkup('briefSettingMusic', 'Music on open', 'Use the selected soundtrack as part of the opening routine.', preferences.musicOnOpen)}
          <div class="brief-setting-action-row">
            <div><strong>Priority alerts</strong><small id="briefSettingAlertSummary">Review where an approved urgent notice could go.</small></div>
            <button type="button" class="secondary-button" id="briefSettingRouting">Routing</button>
          </div>
          <div class="brief-setting-action-row">
            <div><strong>People and sharing</strong><small id="briefSettingPeopleSummary">Review which details belong in this Space.</small></div>
            <button type="button" class="secondary-button" id="briefSettingSharing">Review</button>
          </div>
          <div class="brief-setting-action-row">
            <div><strong>Soundtrack</strong><small>Choose the music used by this briefing.</small></div>
            <button type="button" class="secondary-button" id="briefSettingSoundtrack">Choose music</button>
          </div>
        </div>
        <p class="briefing-settings-note">Demo preview only. A connected version would require account permissions, recipient consent, and clear controls for changing or stopping access.</p>
        <div class="briefing-settings-actions"><button type="button" class="primary-button" id="doneBriefingSettings">Done</button></div>
      </section>`;
    document.body.append(dialog);

    const style = $('#briefSettingStyle', dialog);
    if (style) style.value = preferences.briefStyle;
    const time = $('#briefSettingTime', dialog);
    if (time) time.disabled = !preferences.scheduledOpen;

    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeSettings();
    });
    dialog.addEventListener('close', () => {
      settingsRestoreFocus?.focus({ preventScroll: true });
      settingsRestoreFocus = null;
    });

    $('#closeBriefingSettings', dialog)?.addEventListener('click', closeSettings);
    $('#doneBriefingSettings', dialog)?.addEventListener('click', closeSettings);
    $('#briefSettingSchedule', dialog)?.addEventListener('click', event => {
      preferences.scheduledOpen = event.currentTarget.getAttribute('aria-checked') !== 'true';
      event.currentTarget.setAttribute('aria-checked', String(preferences.scheduledOpen));
      const input = $('#briefSettingTime', dialog);
      if (input) input.disabled = !preferences.scheduledOpen;
      savePreferences();
    });
    $('#briefSettingCalendar', dialog)?.addEventListener('click', event => {
      preferences.calendarContext = event.currentTarget.getAttribute('aria-checked') !== 'true';
      event.currentTarget.setAttribute('aria-checked', String(preferences.calendarContext));
      savePreferences();
    });
    $('#briefSettingMusic', dialog)?.addEventListener('click', event => {
      preferences.musicOnOpen = event.currentTarget.getAttribute('aria-checked') !== 'true';
      event.currentTarget.setAttribute('aria-checked', String(preferences.musicOnOpen));
      savePreferences();
    });
    $('#briefSettingTime', dialog)?.addEventListener('change', event => {
      preferences.scheduledTime = event.target.value || '07:00';
      savePreferences();
    });
    $('#briefSettingStyle', dialog)?.addEventListener('change', event => {
      preferences.briefStyle = event.target.value === 'full' ? 'full' : 'focused';
      savePreferences();
    });
    $('#briefSettingRouting', dialog)?.addEventListener('click', () => {
      closeSettings({ restoreFocus: false });
      window.setTimeout(() => $('#priorityRoutingButton')?.click(), 0);
    });
    $('#briefSettingSharing', dialog)?.addEventListener('click', () => {
      closeSettings({ restoreFocus: false });
      window.setTimeout(() => $('#primaryNav [data-primary-view="spaces"], #mobileNav [data-primary-view="spaces"]')?.click(), 0);
    });
    $('#briefSettingSoundtrack', dialog)?.addEventListener('click', () => {
      closeSettings({ restoreFocus: false });
      window.setTimeout(() => $('#mediaButton')?.click(), 0);
    });
  }

  function updateSettingsContext() {
    const scenario = currentScenario();
    const people = $('#briefSettingPeopleSummary');
    const alerts = $('#briefSettingAlertSummary');
    const route = data.alertRoutes?.[scenario.id];
    if (people) {
      people.textContent = scenario.id === 'personal'
        ? 'This demo starts with a private profile. Sharing can be reviewed in the Spaces view.'
        : `Review which approved details the ${scenario.label} Space can use.`;
    }
    if (alerts) alerts.textContent = route?.label || 'Review where an approved urgent notice could go.';
  }

  function openSettings(event) {
    createSettingsDialog();
    const dialog = $('#briefingSettingsDialog');
    if (!dialog) return;
    settingsRestoreFocus = event?.currentTarget || $('#briefingSettingsButton');
    updateSettingsContext();
    const style = $('#briefSettingStyle', dialog);
    if (style) style.value = preferences.briefStyle;
    const time = $('#briefSettingTime', dialog);
    if (time) {
      time.value = preferences.scheduledTime;
      time.disabled = !preferences.scheduledOpen;
    }
    $('#briefSettingSchedule', dialog)?.setAttribute('aria-checked', String(preferences.scheduledOpen));
    $('#briefSettingCalendar', dialog)?.setAttribute('aria-checked', String(preferences.calendarContext));
    $('#briefSettingMusic', dialog)?.setAttribute('aria-checked', String(preferences.musicOnOpen));
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    queueMicrotask(() => $('#briefSettingSchedule', dialog)?.focus({ preventScroll: true }));
  }

  function closeSettings({ restoreFocus = true } = {}) {
    const dialog = $('#briefingSettingsDialog');
    if (!dialog?.open) return;
    if (!restoreFocus) settingsRestoreFocus = null;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      if (restoreFocus) settingsRestoreFocus?.focus({ preventScroll: true });
      settingsRestoreFocus = null;
    }
  }

  function installSettingsButton() {
    const actions = $('[data-view-panel="today"] .hero-actions');
    if (!actions || $('#briefingSettingsButton')) return;
    const button = document.createElement('button');
    button.className = 'secondary-button briefing-settings-button';
    button.id = 'briefingSettingsButton';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'briefingSettingsDialog');
    button.textContent = 'Briefing settings';
    const scrollCue = $('[data-scroll-today]', actions);
    actions.insertBefore(button, scrollCue || null);
    button.addEventListener('click', openSettings);
  }

  function setTodayFocus(id) {
    const next = ['weather', 'numbers', 'flow'].includes(id) ? id : 'weather';
    document.body.dataset.todayFocus = next;
    $$('button[data-today-focus]').forEach(button => {
      const active = button.dataset.todayFocus === next;
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function installTodayFocus() {
    const grid = $('.today-grid');
    if (!grid || $('#todayFocusNav')) return;
    const nav = document.createElement('nav');
    nav.className = 'today-focus-nav';
    nav.id = 'todayFocusNav';
    nav.setAttribute('aria-label', 'Choose a Today section');
    nav.innerHTML = `
      <button type="button" data-today-focus="weather" aria-pressed="true">Weather</button>
      <button type="button" data-today-focus="numbers" aria-pressed="false">Numbers</button>
      <button type="button" data-today-focus="flow" aria-pressed="false">Flow</button>`;
    grid.before(nav);
    nav.addEventListener('click', event => {
      const button = event.target.closest('[data-today-focus]');
      if (button) setTodayFocus(button.dataset.todayFocus);
    });
    setTodayFocus(document.body.dataset.todayFocus || 'weather');
  }

  function polishEverythingCopy() {
    const section = $('#all-signals');
    if (!section) return;
    const replacements = new Map([
      ['Useful numbers, read as one signal', 'Useful numbers and what they mean'],
      ['DECISION SIGNALS', 'WHAT THE NUMBERS SHOW']
    ]);
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let value = node.nodeValue || '';
      replacements.forEach((replacement, original) => { value = value.split(original).join(replacement); });
      value = value.replace(/(\d+) signals in view/gi, '$1 numbers in view');
      node.nodeValue = value;
    });
  }

  function scheduleEverythingPolish() {
    window.requestAnimationFrame(() => window.requestAnimationFrame(polishEverythingCopy));
  }

  function install() {
    savePreferences();
    installSettingsButton();
    installTodayFocus();
    createSettingsDialog();

    document.addEventListener('briefdemo:viewchange', event => {
      if (event.detail?.view === 'workspace') renderExplore();
      if (event.detail?.view === 'everything') scheduleEverythingPolish();
    });

    document.addEventListener('briefdemo:scenariochange', () => {
      updateSettingsContext();
      if (document.body.dataset.view === 'workspace') renderExplore();
      if (document.body.dataset.view === 'everything') scheduleEverythingPolish();
    });

    document.addEventListener('briefdemo:tabchange', () => {
      if (document.body.dataset.view === 'workspace') renderExplore();
    });

    if (document.body.dataset.view === 'workspace') renderExplore();
    if (document.body.dataset.view === 'everything') scheduleEverythingPolish();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
