(() => {
  'use strict';

  /*
   * Explore keeps one rich category in focus and turns every remaining
   * category into a compact preview. The same file also adds the briefing
   * clarity layer used by Today, Everything, and Space controls. Core routing,
   * URL state, tab semantics, and advanced renderers remain owned by the
   * existing demo controller.
   */

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const CONTROL_STORAGE_KEY = 'spaces_demo_controls_v1';
  const defaultFocus = {
    personal: 'weather',
    relationship: 'flow',
    family: 'flow',
    business: 'numbers',
    accounting: 'numbers',
    trainer: 'flow',
    team: 'flow'
  };
  const scenarioTimes = {
    personal: '7:15 AM',
    relationship: '8:00 AM',
    family: '7:00 AM',
    business: '3:45 PM ET',
    accounting: '8:30 AM',
    trainer: '7:00 AM',
    team: '9:00 AM'
  };
  const scenarioPeople = {
    personal: ['Alex'],
    relationship: ['Maya', 'Jordan'],
    family: ['Elena', 'Marcus', 'Leo', 'Zoe'],
    business: ['Amina', 'Eli'],
    accounting: ['Daniel', 'Priya'],
    trainer: ['Coach', 'Student'],
    team: ['Project lead', 'Design', 'Development', 'Operations']
  };

  let controlsRestoreFocus = null;
  let lastEnteredState = document.body.dataset.entered === 'true';

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenario() {
    const id = document.body.dataset.scenario || data.meta.defaultScenario;
    return data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
  }

  function currentScenarioId() {
    return currentScenario().id;
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
    if (eyebrow) eyebrow.textContent = 'FOCUSED EXPLORER';
    if (title) title.textContent = `Explore the ${scenario.label} briefing`;
    if (copy) copy.textContent = `One category stays fully open at the top. The other ${Math.max(0, count - 1)} stay compact below so you can scan the whole Space without repeating every visual.`;
  }

  function updateExploreHint(count) {
    window.requestAnimationFrame(() => {
      const hint = $('#workspaceTabHint');
      if (!hint) return;
      hint.hidden = false;
      hint.textContent = `All ${count} categories are open below as compact previews. Use the arrows or choose one to bring its full view to the top.`;
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
      host = document.createElement('div');
      host.id = 'workspaceExploreOverview';
      host.className = 'workspace-explore-overview';
      selectedPanel.after(host);
    }

    host.innerHTML = tabs
      .filter(tab => tab.id !== activeId)
      .map(tab => {
        const detail = scenario.details?.[tab.id];
        if (!detail) return '';
        const originalIndex = tabs.findIndex(item => item.id === tab.id);
        return `
          <section class="workspace-overview-section" id="workspace-overview-${escapeHtml(tab.id)}" data-workspace-overview-section="${escapeHtml(tab.id)}">
            <button class="workspace-overview-open" type="button" data-workspace-continue="${escapeHtml(tab.id)}" aria-label="Open ${escapeHtml(tab.label)}: ${escapeHtml(detail.title)}">
              <span class="workspace-overview-number">${String(originalIndex + 1).padStart(2, '0')}</span>
              <span class="workspace-overview-copy">
                <small>${escapeHtml(tab.label)}</small>
                <strong>${escapeHtml(detail.title)}</strong>
                <span>${escapeHtml(detail.summary)}</span>
              </span>
              <i aria-hidden="true">→</i>
            </button>
          </section>`;
      }).join('');

    selectedPanel.hidden = false;
    selectedPanel.removeAttribute('aria-hidden');
    updateExploreHint(tabs.length);
  }

  function readControlStore() {
    try {
      const value = JSON.parse(localStorage.getItem(CONTROL_STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function writeControlStore(store) {
    try { localStorage.setItem(CONTROL_STORAGE_KEY, JSON.stringify(store)); } catch {}
  }

  function controlDefaults(id) {
    return {
      scheduled: true,
      musicOnOpen: false,
      calendar: true,
      style: 'focused',
      invitePending: false,
      time: scenarioTimes[id] || '8:00 AM'
    };
  }

  function currentControls() {
    const id = currentScenarioId();
    const store = readControlStore();
    return { ...controlDefaults(id), ...(store[id] || {}) };
  }

  function saveCurrentControls(settings) {
    const id = currentScenarioId();
    const store = readControlStore();
    store[id] = settings;
    writeControlStore(store);
  }

  function createControlsDialog() {
    if ($('#briefControlsDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'briefControlsDialog';
    dialog.className = 'brief-controls-dialog';
    dialog.setAttribute('aria-labelledby', 'briefControlsTitle');
    dialog.innerHTML = `
      <section class="brief-controls-sheet">
        <header class="brief-controls-heading">
          <div>
            <p class="eyebrow">SPACE CONTROLS</p>
            <h2 id="briefControlsTitle">Briefing controls</h2>
            <p id="briefControlsIntro">Choose how this Space should open, share, and alert.</p>
          </div>
          <button class="round-button" id="closeBriefControls" type="button" aria-label="Close briefing controls">×</button>
        </header>

        <div class="brief-controls-grid">
          <section class="brief-control-group" aria-labelledby="briefRoutineTitle">
            <header><span>OPENING ROUTINE</span><strong id="briefRoutineTitle">How this Brief starts</strong></header>
            <button class="brief-control-switch" type="button" role="switch" data-brief-control="scheduled" aria-checked="true">
              <span><strong>Scheduled Brief</strong><small id="briefScheduleCopy"></small></span><i aria-hidden="true"><b></b></i>
            </button>
            <button class="brief-control-switch" type="button" role="switch" data-brief-control="musicOnOpen" aria-checked="false">
              <span><strong>Music on open</strong><small>Use the current Space soundtrack when the Brief opens.</small></span><i aria-hidden="true"><b></b></i>
            </button>
          </section>

          <section class="brief-control-group" aria-labelledby="briefStyleTitle">
            <header><span>BRIEF STYLE</span><strong id="briefStyleTitle">How much appears first</strong></header>
            <div class="brief-style-options" role="group" aria-label="Brief style">
              <button type="button" data-brief-style="focused" aria-pressed="true"><strong>Focused first</strong><small>One useful view at a time</small></button>
              <button type="button" data-brief-style="full" aria-pressed="false"><strong>Full review</strong><small>Keep Everything one tap away</small></button>
            </div>
          </section>

          <section class="brief-control-group" aria-labelledby="briefSharingTitle">
            <header><span>PEOPLE AND SHARING</span><strong id="briefSharingTitle">Who belongs in this Space</strong></header>
            <div class="brief-member-row" id="briefMemberRow"></div>
            <button class="secondary-button brief-add-person" id="briefAddPerson" type="button">Add someone</button>
            <button class="brief-control-switch" type="button" role="switch" data-brief-control="calendar" aria-checked="true">
              <span><strong id="briefCalendarTitle">Calendar context</strong><small id="briefCalendarCopy"></small></span><i aria-hidden="true"><b></b></i>
            </button>
          </section>

          <section class="brief-control-group" aria-labelledby="briefDeliveryTitle">
            <header><span>DELIVERY</span><strong id="briefDeliveryTitle">Where useful updates can go</strong></header>
            <button class="brief-control-action" id="briefAlertRouteAction" type="button"><span><strong>Priority alert routing</strong><small id="briefAlertRouteCopy">Review WhatsApp, text, push, and email.</small></span><i aria-hidden="true">→</i></button>
            <button class="brief-control-action" id="briefSoundtrackAction" type="button"><span><strong>Current soundtrack</strong><small id="briefSoundtrackCopy"></small></span><i aria-hidden="true">♪</i></button>
          </section>
        </div>

        <footer class="brief-controls-footer">
          <div><span class="brief-control-status-dot" aria-hidden="true"></span><p id="briefControlsStatus" aria-live="polite">Demo settings save on this device. No invite or alert is sent.</p></div>
          <button class="primary-button" id="doneBriefControls" type="button">Done</button>
        </footer>
      </section>`;
    document.body.append(dialog);
  }

  function renderControlsDialog(status = '') {
    createControlsDialog();
    const scenario = currentScenario();
    const settings = currentControls();
    const people = scenarioPeople[scenario.id] || ['You'];
    const shared = scenario.id !== 'personal';

    const title = $('#briefControlsTitle');
    const intro = $('#briefControlsIntro');
    if (title) title.textContent = `${scenario.label} controls`;
    if (intro) intro.textContent = shared
      ? 'Choose how this shared Space opens, coordinates, and delivers updates.'
      : 'Choose how your private Space opens and which details can support another Space.';

    const schedule = $('#briefScheduleCopy');
    if (schedule) schedule.textContent = `Prepared for ${settings.time}. This is a demo schedule.`;

    $$('[data-brief-control]').forEach(button => {
      const key = button.dataset.briefControl;
      button.setAttribute('aria-checked', String(Boolean(settings[key])));
    });

    $$('[data-brief-style]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.briefStyle === settings.style));
    });

    const memberHost = $('#briefMemberRow');
    if (memberHost) {
      const chips = people.slice(0, 4).map((person, index) => `<span><i aria-hidden="true">${escapeHtml(person.charAt(0))}</i><b>${escapeHtml(person)}</b>${index === 0 ? '<small>Owner</small>' : ''}</span>`);
      if (settings.invitePending) chips.push('<span class="is-pending"><i aria-hidden="true">+</i><b>Guest</b><small>Pending</small></span>');
      memberHost.innerHTML = chips.join('');
    }

    const addPerson = $('#briefAddPerson');
    if (addPerson) addPerson.textContent = settings.invitePending ? 'Invite prepared' : 'Add someone';

    const calendarTitle = $('#briefCalendarTitle');
    const calendarCopy = $('#briefCalendarCopy');
    if (calendarTitle) calendarTitle.textContent = shared ? 'Shared calendar context' : 'Calendar context';
    if (calendarCopy) calendarCopy.textContent = shared
      ? 'Use approved events and availability for coordination.'
      : 'Use your calendar to shape timing inside this private Space.';

    const routeSummary = $('#priorityRouteSummary')?.textContent?.trim();
    const routeCopy = $('#briefAlertRouteCopy');
    if (routeCopy) routeCopy.textContent = routeSummary ? `Current route: ${routeSummary}.` : 'Review WhatsApp, text, push, and email.';

    const soundtrackCopy = $('#briefSoundtrackCopy');
    if (soundtrackCopy) soundtrackCopy.textContent = `${scenario.soundtrack?.title || 'Current Space track'} · ${scenario.soundtrack?.artist || 'Soundtrack'}`;

    const statusNode = $('#briefControlsStatus');
    if (statusNode) statusNode.textContent = status || 'Demo settings save on this device. No invite or alert is sent.';
  }

  function openControls(trigger) {
    createControlsDialog();
    controlsRestoreFocus = trigger || document.activeElement;
    renderControlsDialog();
    const dialog = $('#briefControlsDialog');
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    queueMicrotask(() => $('#closeBriefControls')?.focus({ preventScroll: true }));
  }

  function closeControls({ restoreFocus = true } = {}) {
    const dialog = $('#briefControlsDialog');
    if (!dialog?.open) return;
    const target = controlsRestoreFocus;
    if (!restoreFocus) controlsRestoreFocus = null;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (restoreFocus) queueMicrotask(() => target?.focus?.({ preventScroll: true }));
  }

  function toggleControl(button) {
    const key = button.dataset.briefControl;
    const settings = currentControls();
    if (!(key in settings)) return;
    settings[key] = !settings[key];
    saveCurrentControls(settings);
    renderControlsDialog(`${button.querySelector('strong')?.textContent || 'Setting'} ${settings[key] ? 'enabled' : 'paused'} for this demo.`);
    queueMicrotask(() => $(`[data-brief-control="${CSS.escape(key)}"]`)?.focus({ preventScroll: true }));
  }

  function setBriefStyle(button) {
    const style = button.dataset.briefStyle === 'full' ? 'full' : 'focused';
    const settings = currentControls();
    settings.style = style;
    saveCurrentControls(settings);
    renderControlsDialog(style === 'focused' ? 'Focused first saved for this demo.' : 'Full review saved for this demo.');
    queueMicrotask(() => $(`[data-brief-style="${style}"]`)?.focus({ preventScroll: true }));
  }

  function prepareInvite() {
    const settings = currentControls();
    if (!settings.invitePending) {
      settings.invitePending = true;
      saveCurrentControls(settings);
      renderControlsDialog('Demo invite prepared. Nothing was sent.');
    } else {
      renderControlsDialog('The demo invite is already waiting for review.');
    }
    queueMicrotask(() => $('#briefAddPerson')?.focus({ preventScroll: true }));
  }

  function openAlertRoutingFromControls() {
    closeControls({ restoreFocus: false });
    controlsRestoreFocus = null;
    queueMicrotask(() => $('#priorityRoutingButton')?.click());
  }

  function openSoundtrackFromControls() {
    closeControls({ restoreFocus: false });
    controlsRestoreFocus = null;
    queueMicrotask(() => $('#mediaButton')?.click());
  }

  function installHeroControls() {
    const heroActions = $('.hero-actions');
    if (!heroActions) return;
    const spacesButton = $('[data-go-view="spaces"]', heroActions);
    if (spacesButton) {
      spacesButton.removeAttribute('data-go-view');
      spacesButton.id = 'briefControlsButton';
      spacesButton.textContent = 'Briefing controls';
    }
  }

  function updateDeckSelection(shell, id, { scroll = false, focus = false } = {}) {
    if (!shell) return;
    const viewport = $('.clarity-deck-viewport', shell);
    const target = $(`[data-clarity-panel="${CSS.escape(id)}"]`, shell);
    if (!viewport || !target) return;

    $$('[data-clarity-deck-target]', shell).forEach(button => {
      const active = button.dataset.clarityDeckTarget === id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });

    $$('[data-clarity-panel]', shell).forEach(panel => {
      const active = panel === target;
      panel.setAttribute('aria-hidden', String(!active));
      if ('inert' in panel) panel.inert = !active;
    });

    const live = $('.clarity-deck-status', shell);
    const selectedButton = $(`[data-clarity-deck-target="${CSS.escape(id)}"]`, shell);
    if (live && selectedButton) live.textContent = `${selectedButton.textContent.trim()} is open. Swipe or choose another view.`;

    if (scroll) viewport.scrollTo({ left: target.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (focus) selectedButton?.focus({ preventScroll: true });
  }

  function createTodayFocusDeck() {
    if ($('#todayFocusSwitcher')) return;
    const today = $('[data-view-panel="today"]');
    const grid = $('.today-grid', today);
    const weather = $('.weather-card', today);
    const numbers = $('.stats-panel', today);
    const flow = $('.flow-card', today);
    if (!today || !grid || !weather || !numbers || !flow) return;

    const shell = document.createElement('section');
    shell.id = 'todayFocusSwitcher';
    shell.className = 'clarity-deck-shell today-focus-shell';
    shell.setAttribute('aria-labelledby', 'todayFocusTitle');
    shell.innerHTML = `
      <header class="clarity-deck-heading">
        <div><p class="eyebrow">BRIEFING FOCUS</p><h2 id="todayFocusTitle">One useful view at a time</h2></div>
        <p class="clarity-deck-status" aria-live="polite"></p>
      </header>
      <div class="clarity-deck-tabs" role="tablist" aria-label="Choose a briefing focus">
        <button id="today-focus-tab-weather" type="button" role="tab" data-clarity-deck-target="weather" aria-selected="false" tabindex="-1">Weather</button>
        <button id="today-focus-tab-numbers" type="button" role="tab" data-clarity-deck-target="numbers" aria-selected="false" tabindex="-1">Numbers</button>
        <button id="today-focus-tab-flow" type="button" role="tab" data-clarity-deck-target="flow" aria-selected="false" tabindex="-1">Flow</button>
      </div>
      <div class="clarity-deck-viewport today-focus-viewport"></div>`;
    grid.before(shell);

    const viewport = $('.clarity-deck-viewport', shell);
    [
      [weather, 'weather', 'today-focus-tab-weather'],
      [numbers, 'numbers', 'today-focus-tab-numbers'],
      [flow, 'flow', 'today-focus-tab-flow']
    ].forEach(([panel, id, labelledBy]) => {
      panel.dataset.clarityPanel = id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', labelledBy);
      viewport.append(panel);
    });

    shell.addEventListener('click', event => {
      const button = event.target.closest('[data-clarity-deck-target]');
      if (!button) return;
      updateDeckSelection(shell, button.dataset.clarityDeckTarget, { scroll: true, focus: true });
    });

    shell.addEventListener('keydown', event => {
      const current = event.target.closest('[data-clarity-deck-target]');
      if (!current || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = $$('[data-clarity-deck-target]', shell);
      const index = tabs.indexOf(current);
      if (index < 0) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      const next = tabs[nextIndex];
      updateDeckSelection(shell, next.dataset.clarityDeckTarget, { scroll: true, focus: true });
    });

    let scrollFrame = 0;
    viewport.addEventListener('scroll', () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const panels = $$('[data-clarity-panel]', shell);
        const nearest = panels.reduce((best, panel) => Math.abs(panel.offsetLeft - viewport.scrollLeft) < Math.abs(best.offsetLeft - viewport.scrollLeft) ? panel : best, panels[0]);
        if (nearest) updateDeckSelection(shell, nearest.dataset.clarityPanel);
      });
    }, { passive: true });

    const selected = defaultFocus[currentScenarioId()] || 'weather';
    requestAnimationFrame(() => updateDeckSelection(shell, selected, { scroll: false }));
  }

  function resetTodayFocus() {
    const shell = $('#todayFocusSwitcher');
    if (!shell) return;
    const selected = defaultFocus[currentScenarioId()] || 'weather';
    requestAnimationFrame(() => updateDeckSelection(shell, selected, { scroll: true }));
  }

  function installWorkspaceCarousel() {
    const section = $('#all-workspace');
    const stack = $('.full-workspace-stack', section);
    if (!section || !stack || stack.dataset.clarityCarousel === 'true') return;
    const groups = $$('.full-workspace-group', stack);
    if (!groups.length) return;

    stack.dataset.clarityCarousel = 'true';
    stack.classList.add('clarity-workspace-carousel');
    const controls = document.createElement('div');
    controls.className = 'clarity-workspace-carousel-tabs';
    controls.setAttribute('role', 'tablist');
    controls.setAttribute('aria-label', 'Choose a full briefing category');
    controls.innerHTML = groups.map((group, index) => {
      const label = $('header span', group)?.textContent?.trim() || `Section ${index + 1}`;
      group.dataset.clarityWorkspacePanel = String(index);
      return `<button type="button" role="tab" data-clarity-workspace-target="${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHtml(label)}</button>`;
    }).join('');
    stack.before(controls);

    controls.addEventListener('click', event => {
      const button = event.target.closest('[data-clarity-workspace-target]');
      if (!button) return;
      const index = Number(button.dataset.clarityWorkspaceTarget);
      const target = groups[index];
      if (!target) return;
      groups.forEach((group, groupIndex) => group.setAttribute('aria-hidden', String(groupIndex !== index)));
      $$('[data-clarity-workspace-target]', controls).forEach((tab, tabIndex) => {
        tab.setAttribute('aria-selected', String(tabIndex === index));
        tab.tabIndex = tabIndex === index ? 0 : -1;
      });
      stack.scrollTo({ left: target.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });

    groups.forEach((group, index) => group.setAttribute('aria-hidden', String(index !== 0)));
  }

  function addSectionDetailToggle(sectionId, selectors, label) {
    const section = document.getElementById(sectionId);
    if (!section || section.querySelector('[data-clarity-detail-toggle]')) return;
    const anchor = selectors.map(selector => $(selector, section)).find(Boolean);
    if (!anchor) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'clarity-detail-toggle';
    button.dataset.clarityDetailToggle = sectionId;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = label;
    anchor.before(button);
    section.dataset.clarityExpanded = 'false';
  }

  function addSpaceQuickControls(root = document) {
    const section = $('#all-spaces', root) || $('[data-view-panel="spaces"]', root);
    if (!section || $('.space-quick-controls', section)) return;
    const map = $('.full-space-map', section) || $('.space-overview', section);
    if (!map) return;
    const controls = document.createElement('div');
    controls.className = 'space-quick-controls';
    controls.innerHTML = `
      <button type="button" data-open-brief-controls><span>Controls</span><small>Opening, sharing, brief style</small><i aria-hidden="true">⚙</i></button>
      <button type="button" data-clarity-add-person><span>Add someone</span><small>Prepare a demo invite</small><i aria-hidden="true">+</i></button>
      <button type="button" data-open-alert-routing><span>Alerts</span><small>Review delivery routes</small><i aria-hidden="true">!</i></button>
      <button type="button" data-open-media-clarity><span>Soundtrack</span><small>Open this Space music</small><i aria-hidden="true">♪</i></button>`;
    map.insertAdjacentElement('afterend', controls);
  }

  function compactEverything() {
    if (document.body.dataset.view !== 'everything') return;
    const host = $('#everythingContent');
    if (!host) return;
    const title = $('#everythingTitle');
    const copy = $('[data-view-panel="everything"] .view-heading-tools p');
    if (title) title.textContent = 'Review the whole briefing in a tighter view';
    if (copy) copy.textContent = 'Core sections stay visible. Rich category views share one carousel, and deeper product logic opens only when you ask for it.';

    installWorkspaceCarousel();
    addSectionDetailToggle('all-adaptive', ['.adaptive-process', '.component-choice-grid'], 'Show the step by step logic');
    addSectionDetailToggle('all-alarm', ['.alarm-flow', '.future-boundary'], 'Show the full morning sequence');
    addSpaceQuickControls(host);
  }

  function installSpaceViewControls() {
    addSpaceQuickControls(document);
  }

  function handleClarityClick(event) {
    const controlsButton = event.target.closest('#briefControlsButton, [data-open-brief-controls]');
    if (controlsButton) {
      openControls(controlsButton);
      return;
    }

    const switchButton = event.target.closest('[data-brief-control]');
    if (switchButton) {
      toggleControl(switchButton);
      return;
    }

    const styleButton = event.target.closest('[data-brief-style]');
    if (styleButton) {
      setBriefStyle(styleButton);
      return;
    }

    if (event.target.closest('#briefAddPerson, [data-clarity-add-person]')) {
      if ($('#briefControlsDialog')?.open) prepareInvite();
      else {
        openControls(event.target.closest('[data-clarity-add-person]'));
        prepareInvite();
      }
      return;
    }

    if (event.target.closest('#briefAlertRouteAction, [data-open-alert-routing]')) {
      if ($('#briefControlsDialog')?.open) openAlertRoutingFromControls();
      else $('#priorityRoutingButton')?.click();
      return;
    }

    if (event.target.closest('#briefSoundtrackAction, [data-open-media-clarity]')) {
      if ($('#briefControlsDialog')?.open) openSoundtrackFromControls();
      else $('#mediaButton')?.click();
      return;
    }

    const detailToggle = event.target.closest('[data-clarity-detail-toggle]');
    if (detailToggle) {
      const section = document.getElementById(detailToggle.dataset.clarityDetailToggle);
      if (!section) return;
      const expanded = section.dataset.clarityExpanded === 'true';
      section.dataset.clarityExpanded = String(!expanded);
      detailToggle.setAttribute('aria-expanded', String(!expanded));
      detailToggle.textContent = !expanded ? 'Hide extra detail' : (section.id === 'all-adaptive' ? 'Show the step by step logic' : 'Show the full morning sequence');
    }
  }

  function installControlEvents() {
    createControlsDialog();
    $('#closeBriefControls')?.addEventListener('click', () => closeControls());
    $('#doneBriefControls')?.addEventListener('click', () => closeControls());
    $('#briefControlsDialog')?.addEventListener('click', event => {
      if (event.target === $('#briefControlsDialog')) closeControls();
    });
    $('#briefControlsDialog')?.addEventListener('close', () => {
      const target = controlsRestoreFocus;
      controlsRestoreFocus = null;
      queueMicrotask(() => target?.focus?.({ preventScroll: true }));
    });
    document.addEventListener('click', handleClarityClick);
  }

  function installMusicOnOpenObserver() {
    const observer = new MutationObserver(() => {
      const entered = document.body.dataset.entered === 'true';
      if (entered && !lastEnteredState) {
        const settings = currentControls();
        if (settings.musicOnOpen) window.setTimeout(() => $('#mediaButton')?.click(), 350);
      }
      lastEnteredState = entered;
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-entered'] });
  }

  function install() {
    installHeroControls();
    createTodayFocusDeck();
    installControlEvents();
    installMusicOnOpenObserver();
    installSpaceViewControls();

    document.addEventListener('briefdemo:viewchange', event => {
      if (event.detail?.view === 'workspace') renderExplore();
      if (event.detail?.view === 'everything') requestAnimationFrame(compactEverything);
      if (event.detail?.view === 'spaces') requestAnimationFrame(installSpaceViewControls);
    });

    document.addEventListener('briefdemo:scenariochange', () => {
      resetTodayFocus();
      if ($('#briefControlsDialog')?.open) renderControlsDialog();
      if (document.body.dataset.view === 'workspace') renderExplore();
      if (document.body.dataset.view === 'everything') requestAnimationFrame(compactEverything);
    });

    document.addEventListener('briefdemo:tabchange', () => {
      if (document.body.dataset.view === 'workspace') renderExplore();
    });

    if (document.body.dataset.view === 'workspace') renderExplore();
    if (document.body.dataset.view === 'everything') requestAnimationFrame(compactEverything);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
