(() => {
  'use strict';

  const STORAGE_KEY = 'cmx_goal_intelligence_lab_v1';
  const PART3_STYLE_ID = 'goalsLabPart3Styles';
  const $ = (selector, root = document) => root.querySelector(selector);

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function loadStyles() {
    if (document.getElementById(PART3_STYLE_ID)) return;
    const link = document.createElement('link');
    link.id = PART3_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = './part3.css?v=20260804-1';
    document.head.append(link);
  }

  function buildSummary(title, hint) {
    const summary = document.createElement('summary');

    const titleNode = document.createElement('span');
    titleNode.className = 'drawer-summary-title';
    titleNode.textContent = title;

    const hintNode = document.createElement('span');
    hintNode.className = 'drawer-summary-hint';
    hintNode.textContent = hint;

    summary.append(titleNode, hintNode);
    return summary;
  }

  function buildDetails(id, title, hint, className = 'progressive-details') {
    const details = document.createElement('details');
    details.id = id;
    details.className = className;
    details.append(buildSummary(title, hint));

    const body = document.createElement('div');
    body.className = 'drawer-body';
    details.append(body);
    return { details, body };
  }

  function labelFor(id) {
    return document.getElementById(id)?.closest('label') || null;
  }

  function addFormIntro(form, text) {
    if (!form || form.querySelector('.form-intro')) return;
    const intro = document.createElement('p');
    intro.className = 'form-intro';
    intro.textContent = text;
    form.prepend(intro);
  }

  function simplifyMasthead() {
    const masthead = $('.masthead');
    if (!masthead || masthead.dataset.part3Ready === 'true') return;
    masthead.dataset.part3Ready = 'true';
    masthead.classList.add('product-reviewed');

    const eyebrow = masthead.querySelector('.eyebrow');
    const title = $('#pageTitle');
    const lead = masthead.querySelector('.lead');
    const boundaryStrong = masthead.querySelector('.boundary-card strong');
    const boundaryCopy = masthead.querySelector('.boundary-card p');

    if (eyebrow) eyebrow.textContent = 'STEP 3 · PRODUCT REVIEW PROTOTYPE';
    if (title) title.textContent = 'Move one goal forward today.';
    if (lead) lead.textContent = 'Check reality, answer one useful question, and leave with one action sized to the time and energy you actually have.';
    if (boundaryStrong) boundaryStrong.textContent = 'Local goal lab';
    if (boundaryCopy) boundaryCopy.textContent = 'Browser-only sample data. No live briefing, connected account, backend, or model integration.';
  }

  function simplifyNavigation() {
    const nav = $('.section-nav');
    if (!nav || nav.dataset.part3Ready === 'true') return;
    nav.dataset.part3Ready = 'true';
    nav.classList.add('product-nav');
    nav.innerHTML = `
      <button type="button" data-scroll-target="goalPulse">Pulse</button>
      <button type="button" data-scroll-target="checkIn">Update</button>
      <button type="button" data-scroll-target="questionPanel">Question</button>
      <button type="button" data-scroll-target="goalSetup">Goal</button>
      <button type="button" data-scroll-target="recordsDrawer">Records</button>
    `;
  }

  function reorderDailyFlow() {
    const layout = $('.two-column-layout:not(.lower-layout)');
    const goal = $('#goalSetup');
    const stack = layout?.querySelector('.stacked-column');
    if (!layout || !goal || !stack || layout.dataset.part3Ready === 'true') return;

    layout.dataset.part3Ready = 'true';
    layout.classList.add('main-flow-layout');
    layout.insertBefore(stack, goal);

    const checkNumber = $('#checkIn .section-number');
    const questionNumber = $('#questionPanel .section-number');
    const goalNumber = $('#goalSetup .section-number');
    if (checkNumber) checkNumber.textContent = '01';
    if (questionNumber) questionNumber.textContent = '02';
    if (goalNumber) goalNumber.textContent = '03';
  }

  function addSprintWindow(form, difficultyFieldset) {
    if (!form || !difficultyFieldset || $('#sprintEndDate')) return;

    const wrapper = document.createElement('label');
    wrapper.className = 'sprint-date-field';
    wrapper.hidden = true;
    wrapper.innerHTML = `
      <span>Sprint ends</span>
      <input id="sprintEndDate" name="sprintEndDate" type="date" aria-describedby="sprintEndHelp sprintEndError">
      <small id="sprintEndHelp">Sprint mode is temporary. Choose the date when the pressure level returns to normal.</small>
      <p id="sprintEndError" class="sprint-date-error" role="alert"></p>
    `;
    difficultyFieldset.insertAdjacentElement('afterend', wrapper);

    const range = $('#difficultyRange');
    const input = $('#sprintEndDate');
    const state = readState();
    if (state?.goal?.sprintEndDate) input.value = state.goal.sprintEndDate;

    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    input.min = localToday;

    function syncVisibility() {
      const isSprint = Number(range?.value || 3) === 5;
      wrapper.hidden = !isSprint;
      input.required = isSprint;
      if (!isSprint) $('#sprintEndError').textContent = '';
    }

    range?.addEventListener('input', syncVisibility);
    range?.addEventListener('change', syncVisibility);
    syncVisibility();

    form.addEventListener('submit', event => {
      const isSprint = Number(range?.value || 3) === 5;
      const value = input.value;
      const error = $('#sprintEndError');

      if (isSprint && (!value || value < localToday)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        error.textContent = value ? 'Choose today or a future date.' : 'Choose an end date before saving Sprint mode.';
        $('#goalEditorDetails').open = true;
        input.focus();
        const saveStatus = $('#saveStatus');
        if (saveStatus) saveStatus.textContent = 'Sprint needs an end date';
        return;
      }

      error.textContent = '';
      window.setTimeout(() => {
        const nextState = readState();
        if (!nextState?.goal) return;

        const nextDate = isSprint ? value : null;
        const previousDate = nextState.goal.sprintEndDate || null;
        nextState.goal.sprintEndDate = nextDate;
        nextState.goal.updatedAt = new Date().toISOString();

        if (previousDate !== nextDate) {
          nextState.history = Array.isArray(nextState.history) ? nextState.history : [];
          nextState.history.unshift({
            id: uid('history'),
            type: 'sprint_window_updated',
            title: isSprint ? 'Sprint window set' : 'Sprint window cleared',
            detail: isSprint ? `Sprint mode ends on ${nextDate}.` : 'The goal returned to a non-Sprint difficulty.',
            createdAt: new Date().toISOString()
          });
          nextState.history = nextState.history.slice(0, 80);
        }

        if (writeState(nextState)) renderSprintPulse(nextState);
      }, 0);
    }, true);
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  function renderSprintPulse(state = readState()) {
    const detail = $('#difficultyDetail');
    if (!detail || !state?.goal) return;
    if (Number(state.goal.difficulty) === 5 && state.goal.sprintEndDate) {
      detail.textContent = `Sprint ends ${formatDate(state.goal.sprintEndDate)}`;
    }
  }

  function simplifyGoalEditor() {
    const section = $('#goalSetup');
    const form = $('#goalForm');
    if (!section || !form || section.dataset.part3Ready === 'true') return;
    section.dataset.part3Ready = 'true';
    section.classList.add('product-secondary');

    const eyebrow = section.querySelector('.eyebrow');
    const heading = section.querySelector('h2');
    if (eyebrow) eyebrow.textContent = 'GOAL SETTINGS';
    if (heading) heading.textContent = 'Keep direction current';

    addFormIntro(form, 'The daily loop uses the current goal. Open planning context only when the direction, constraints, or privacy need to change.');

    const editor = buildDetails(
      'goalEditorDetails',
      'Edit goal definition',
      'Title, outcome, milestone, difficulty, and optional planning context',
      'editor-drawer'
    );
    section.append(editor.details);
    editor.body.append(form);

    const milestoneLabel = labelFor('goalMilestone');
    const difficultyFieldset = form.querySelector('.difficulty-fieldset');
    const planning = buildDetails(
      'goalPlanningContext',
      'Planning context',
      'Motivation, baseline, success definition, priority, and visibility'
    );

    const advancedNodes = [
      labelFor('goalWhy'),
      labelFor('goalBaseline'),
      labelFor('goalSuccess'),
      $('#goalPriority')?.closest('.form-grid') || null
    ].filter(Boolean);

    if (milestoneLabel) form.insertBefore(planning.details, milestoneLabel);
    else form.append(planning.details);
    advancedNodes.forEach(node => planning.body.append(node));

    addSprintWindow(form, difficultyFieldset);
    renderSprintPulse();
  }

  function simplifyCheckIn() {
    const section = $('#checkIn');
    const form = $('#checkInForm');
    if (!section || !form || section.dataset.part3Ready === 'true') return;
    section.dataset.part3Ready = 'true';

    const eyebrow = section.querySelector('.eyebrow');
    const heading = section.querySelector('h2');
    if (eyebrow) eyebrow.textContent = 'TODAY\'S UPDATE';
    if (heading) heading.textContent = 'Update reality';

    const note = document.createElement('p');
    note.className = 'daily-priority-note';
    note.textContent = 'Use the four quick fields first. Add written context only when it would change the next recommendation.';
    form.before(note);

    const context = buildDetails(
      'checkInContextDetails',
      'Add context',
      'Optional changes or details that could alter the next action'
    );
    const submit = form.querySelector('button[type="submit"]');
    const changeLabel = labelFor('checkInChange');
    const noteLabel = labelFor('checkInNote');

    if (submit) form.insertBefore(context.details, submit);
    else form.append(context.details);
    if (changeLabel) context.body.append(changeLabel);
    if (noteLabel) context.body.append(noteLabel);
  }

  function simplifyQuestion() {
    const section = $('#questionPanel');
    if (!section || section.dataset.part3Ready === 'true') return;
    section.dataset.part3Ready = 'true';
    const eyebrow = section.querySelector('.eyebrow');
    const heading = section.querySelector('h2');
    if (eyebrow) eyebrow.textContent = 'ONE USEFUL QUESTION';
    if (heading) heading.textContent = 'Remove uncertainty';
  }

  function simplifyRecords() {
    const lower = $('.lower-layout');
    if (!lower || $('#recordsDrawer')) return;

    const records = buildDetails(
      'recordsDrawer',
      'Evidence and history',
      'Open when you need to verify claims or review how the goal changed',
      'records-drawer'
    );
    lower.parentNode.insertBefore(records.details, lower);
    records.details.append(lower);
  }

  function installNavigationOpeners() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest?.('[data-scroll-target]');
      if (!trigger) return;
      if (trigger.dataset.scrollTarget === 'recordsDrawer') {
        const records = $('#recordsDrawer');
        if (records) records.open = true;
      }
      if (trigger.dataset.scrollTarget === 'goalSetup') {
        const editor = $('#goalEditorDetails');
        if (editor) editor.open = true;
      }
    }, true);
  }

  function install() {
    if (document.documentElement.dataset.goalPart3 === 'ready') return;
    document.documentElement.dataset.goalPart3 = 'ready';
    loadStyles();
    simplifyMasthead();
    simplifyNavigation();
    reorderDailyFlow();
    simplifyGoalEditor();
    simplifyCheckIn();
    simplifyQuestion();
    simplifyRecords();
    installNavigationOpeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
