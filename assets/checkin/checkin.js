(() => {
  'use strict';

  const STORAGE_KEY = 'cmx.checkin.prototype.v1';
  const THEME_KEY = 'cmx.checkin.theme';
  const RING_LENGTH = 678.58;
  const SOON_HOURS = 6;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const elements = {
    root: document.documentElement,
    statusChip: $('#statusChip'),
    heroTitle: $('#heroTitle'),
    heroSummary: $('#heroSummary'),
    lastCheckInText: $('#lastCheckInText'),
    nextCheckInText: $('#nextCheckInText'),
    intervalLabel: $('#intervalLabel'),
    countdownLabel: $('#countdownLabel'),
    countdownValue: $('#countdownValue'),
    countdownSub: $('#countdownSub'),
    ringProgress: $('#ringProgress'),
    console: $('.checkin-console'),
    consoleFoot: $('#consoleFoot'),
    checkInButton: $('#checkInButton'),
    checkInButtonText: $('#checkInButtonText'),
    activityList: $('#activityList'),
    themeToggle: $('#themeToggle'),
    settingsButton: $('#settingsButton'),
    settingsDialog: $('#settingsDialog'),
    settingsForm: $('#settingsForm'),
    intervalSelect: $('#intervalSelect'),
    graceSelect: $('#graceSelect'),
    settingsSummary: $('#settingsSummary'),
    resetLocalButton: $('#resetLocalButton'),
    simulateButton: $('#simulateButton'),
    simulationDialog: $('#simulationDialog'),
    simulationClose: $('#simulationClose'),
    simTime: $('#simTime'),
    simEvent: $('#simEvent'),
    simProgress: $('#simProgress'),
    simRestart: $('#simRestart'),
    simNext: $('#simNext'),
    toast: $('#toast'),
    toastTitle: $('#toastTitle'),
    toastText: $('#toastText')
  };

  const defaultState = () => ({
    lastCheckIn: Date.now(),
    intervalHours: 72,
    graceHours: 24,
    history: [
      {
        time: Date.now(),
        event: 'Local prototype initialized',
        detail: 'First check-in window started on this browser.',
        state: 'LOCAL'
      }
    ]
  });

  let state = loadState();
  let toastTimer = null;
  let recordTimer = null;
  let simIndex = 0;

  const simulationStages = [
    {
      time: 'T+00:00',
      code: '01',
      label: 'SAFE STATE',
      title: 'Last valid check-in loaded',
      text: 'The switch begins from a known safe state.'
    },
    {
      time: `T+${String(state.intervalHours).padStart(2, '0')}:00`,
      code: '02',
      label: 'MISSED CHECK-IN',
      title: 'Required check-in passes',
      text: 'No confirmation was received by the scheduled deadline.'
    },
    {
      time: `T+${String(state.intervalHours + state.graceHours).padStart(2, '0')}:00`,
      code: '03',
      label: 'GRACE WINDOW',
      title: 'Final confirmation window closes',
      text: 'A real backend would make one last verification decision here.'
    },
    {
      time: 'TRIGGER',
      code: '04',
      label: 'ELIGIBLE ACTIONS',
      title: 'Configured actions become eligible',
      text: 'This prototype stops here. It cannot contact anyone or release anything.'
    }
  ];

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Number.isFinite(saved.lastCheckIn)) return defaultState();
      return {
        lastCheckIn: saved.lastCheckIn,
        intervalHours: Number(saved.intervalHours) || 72,
        graceHours: Number(saved.graceHours) || 24,
        history: Array.isArray(saved.history) ? saved.history.slice(0, 12) : []
      };
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      showToast('Could not save locally', 'Your browser blocked local storage for this page.', false);
    }
  }

  function hoursToMs(hours) {
    return hours * 60 * 60 * 1000;
  }

  function getTiming(now = Date.now()) {
    const intervalMs = hoursToMs(state.intervalHours);
    const graceMs = hoursToMs(state.graceHours);
    const due = state.lastCheckIn + intervalMs;
    const graceEnd = due + graceMs;
    const untilDue = due - now;
    const untilGraceEnd = graceEnd - now;

    let stage = 'safe';
    if (untilDue > 0 && untilDue <= hoursToMs(SOON_HOURS)) stage = 'soon';
    if (untilDue <= 0 && untilGraceEnd > 0) stage = 'grace';
    if (untilGraceEnd <= 0) stage = 'triggered';

    return { intervalMs, graceMs, due, graceEnd, untilDue, untilGraceEnd, stage };
  }

  function formatCountdown(ms) {
    const safeMs = Math.max(0, ms);
    const totalSeconds = Math.floor(safeMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return days > 0 ? `${days}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
  }

  function formatDateTime(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(timestamp));
  }

  function formatRelative(timestamp) {
    const diff = Date.now() - timestamp;
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} hr ago`;
    return formatDateTime(timestamp);
  }

  function render() {
    const timing = getTiming();
    const { stage } = timing;
    const labelMap = {
      safe: 'SAFE',
      soon: 'DUE SOON',
      grace: 'GRACE PERIOD',
      triggered: 'TRIGGERED'
    };

    elements.statusChip.dataset.state = stage;
    $('b', elements.statusChip).textContent = labelMap[stage];
    elements.console.dataset.state = stage;
    elements.intervalLabel.textContent = `${state.intervalHours} HOURS`;
    elements.lastCheckInText.textContent = formatRelative(state.lastCheckIn);
    elements.nextCheckInText.textContent = formatDateTime(timing.due);

    let remaining = timing.untilDue;
    let ratio = Math.max(0, Math.min(1, timing.untilDue / timing.intervalMs));

    if (stage === 'safe') {
      elements.heroTitle.textContent = 'You’re checked in.';
      elements.heroSummary.textContent = 'Nothing happens while your check-ins stay current.';
      elements.countdownLabel.textContent = 'TIME REMAINING';
      elements.countdownSub.textContent = 'until check-in is due';
      elements.consoleFoot.textContent = 'Manual confirmation only · saved on this device';
    }

    if (stage === 'soon') {
      elements.heroTitle.textContent = 'Check in soon.';
      elements.heroSummary.textContent = 'Your current check-in window is almost over.';
      elements.countdownLabel.textContent = 'CHECK-IN DUE SOON';
      elements.countdownSub.textContent = 'until the deadline';
      elements.consoleFoot.textContent = 'No action is triggered before the deadline';
    }

    if (stage === 'grace') {
      remaining = timing.untilGraceEnd;
      ratio = Math.max(0, Math.min(1, timing.untilGraceEnd / timing.graceMs));
      elements.heroTitle.textContent = 'Your check-in is overdue.';
      elements.heroSummary.textContent = 'The local prototype is inside the grace period. Checking in now returns it to safe.';
      elements.countdownLabel.textContent = 'GRACE PERIOD';
      elements.countdownSub.textContent = 'until the simulated trigger point';
      elements.consoleFoot.textContent = 'Prototype only · no external actions are armed';
    }

    if (stage === 'triggered') {
      remaining = 0;
      ratio = 0;
      elements.heroTitle.textContent = 'The local timer reached trigger state.';
      elements.heroSummary.textContent = 'This frontend does not release anything. Check in to reset the prototype.';
      elements.countdownLabel.textContent = 'LOCAL STATUS';
      elements.countdownSub.textContent = 'prototype trigger state reached';
      elements.consoleFoot.textContent = 'No messages, files, or external actions were released';
    }

    elements.countdownValue.textContent = stage === 'triggered' ? 'TRIGGERED' : formatCountdown(remaining);
    elements.ringProgress.style.strokeDashoffset = String(RING_LENGTH * (1 - ratio));
    renderTimeline(stage);
    renderActivity();
  }

  function renderTimeline(stage) {
    const steps = $$('.timeline-step');
    steps.forEach((step) => step.classList.remove('is-current', 'is-complete'));

    const order = ['safe', 'due', 'grace', 'triggered'];
    let current = 0;
    if (stage === 'soon') current = 0;
    if (stage === 'grace') current = 2;
    if (stage === 'triggered') current = 3;

    steps.forEach((step, index) => {
      if (index < current) step.classList.add('is-complete');
      if (index === current) step.classList.add('is-current');
    });

    if (stage === 'grace') {
      const dueStep = $('.timeline-step[data-stage="due"]');
      if (dueStep) dueStep.classList.add('is-complete');
    }
  }

  function renderActivity() {
    if (!state.history.length) {
      elements.activityList.innerHTML = '<div class="empty-activity">No local activity yet.</div>';
      return;
    }

    elements.activityList.innerHTML = state.history.map((item) => `
      <div class="activity-row">
        <span class="activity-time">${escapeHtml(formatDateTime(item.time))}</span>
        <div class="activity-event">
          <i aria-hidden="true">✓</i>
          <div><strong>${escapeHtml(item.event)}</strong><small>${escapeHtml(item.detail)}</small></div>
        </div>
        <span class="activity-state">${escapeHtml(item.state)}</span>
      </div>
    `).join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function recordCheckIn() {
    if (recordTimer) return;

    elements.checkInButton.classList.add('is-recording');
    elements.checkInButtonText.textContent = 'RECORDING';

    recordTimer = window.setTimeout(() => {
      const now = Date.now();
      state.lastCheckIn = now;
      state.history.unshift({
        time: now,
        event: 'Manual check-in recorded',
        detail: `Timer reset for another ${state.intervalHours}-hour window.`,
        state: 'SAFE'
      });
      state.history = state.history.slice(0, 12);
      saveState();
      elements.checkInButton.classList.remove('is-recording');
      elements.checkInButtonText.textContent = 'CHECKED IN';
      render();
      showToast('Check-in recorded', `Next check-in: ${formatDateTime(getTiming().due)}.`);

      window.setTimeout(() => {
        elements.checkInButtonText.textContent = 'CHECK IN NOW';
      }, 1300);

      recordTimer = null;
    }, 650);
  }

  function addHistory(event, detail, status = 'LOCAL') {
    state.history.unshift({ time: Date.now(), event, detail, state: status });
    state.history = state.history.slice(0, 12);
    saveState();
    renderActivity();
  }

  function openSettings() {
    elements.intervalSelect.value = String(state.intervalHours);
    elements.graceSelect.value = String(state.graceHours);
    updateSettingsSummary();
    if (typeof elements.settingsDialog.showModal === 'function') elements.settingsDialog.showModal();
  }

  function updateSettingsSummary() {
    const interval = Number(elements.intervalSelect.value);
    const grace = Number(elements.graceSelect.value);
    const intervalText = interval === 168 ? '7 days' : `${interval} hours`;
    elements.settingsSummary.textContent = `Check in every ${intervalText} · ${grace}-hour grace period`;
  }

  function saveSettings() {
    const oldInterval = state.intervalHours;
    const oldGrace = state.graceHours;
    state.intervalHours = Number(elements.intervalSelect.value) || 72;
    state.graceHours = Number(elements.graceSelect.value) || 24;

    if (oldInterval !== state.intervalHours || oldGrace !== state.graceHours) {
      state.history.unshift({
        time: Date.now(),
        event: 'Local schedule changed',
        detail: `Check in every ${state.intervalHours} hours with a ${state.graceHours}-hour grace period.`,
        state: 'UPDATED'
      });
      state.history = state.history.slice(0, 12);
    }

    saveState();
    render();
    showToast('Schedule updated', 'The local countdown was recalculated from your last check-in.');
  }

  function resetLocalData() {
    state = defaultState();
    saveState();
    render();
    elements.intervalSelect.value = String(state.intervalHours);
    elements.graceSelect.value = String(state.graceHours);
    updateSettingsSummary();
    showToast('Local data reset', 'A fresh 72-hour prototype window has started.');
  }

  function showToast(title, text, positive = true) {
    window.clearTimeout(toastTimer);
    elements.toastTitle.textContent = title;
    elements.toastText.textContent = text;
    $('.toast-icon', elements.toast).textContent = positive ? '✓' : '!';
    elements.toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => elements.toast.classList.remove('is-visible'), 3200);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setTheme(theme, false);
  }

  function setTheme(theme, persist = true) {
    elements.root.dataset.theme = theme;
    elements.themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    elements.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    $('meta[name="theme-color"]').setAttribute('content', theme === 'light' ? '#eef4fa' : '#07111f');
    if (persist) localStorage.setItem(THEME_KEY, theme);
  }

  function renderSimulation() {
    const stage = simulationStages[simIndex];
    elements.simTime.textContent = stage.time;
    elements.simEvent.innerHTML = `
      <span class="sim-code">${escapeHtml(stage.code)}</span>
      <div><small>${escapeHtml(stage.label)}</small><strong>${escapeHtml(stage.title)}</strong><p>${escapeHtml(stage.text)}</p></div>
    `;
    elements.simProgress.style.width = `${((simIndex + 1) / simulationStages.length) * 100}%`;
    elements.simNext.innerHTML = simIndex === simulationStages.length - 1 ? 'End preview' : 'Next stage <span>→</span>';
  }

  function openSimulation() {
    simIndex = 0;
    renderSimulation();
    if (typeof elements.simulationDialog.showModal === 'function') elements.simulationDialog.showModal();
  }

  function nextSimulationStage() {
    if (simIndex >= simulationStages.length - 1) {
      elements.simulationDialog.close();
      return;
    }
    simIndex += 1;
    renderSimulation();
  }

  elements.checkInButton.addEventListener('click', recordCheckIn);
  elements.settingsButton.addEventListener('click', openSettings);
  elements.intervalSelect.addEventListener('change', updateSettingsSummary);
  elements.graceSelect.addEventListener('change', updateSettingsSummary);

  elements.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (event.submitter && event.submitter.value === 'cancel') {
      elements.settingsDialog.close();
      return;
    }
    saveSettings();
    elements.settingsDialog.close();
  });

  elements.resetLocalButton.addEventListener('click', resetLocalData);

  elements.themeToggle.addEventListener('click', () => {
    setTheme(elements.root.dataset.theme === 'light' ? 'dark' : 'light');
  });

  elements.simulateButton.addEventListener('click', openSimulation);
  elements.simulationClose.addEventListener('click', () => elements.simulationDialog.close());
  elements.simRestart.addEventListener('click', () => { simIndex = 0; renderSimulation(); });
  elements.simNext.addEventListener('click', nextSimulationStage);

  $$('[data-unavailable]').forEach((button) => {
    button.addEventListener('click', () => {
      const feature = button.dataset.unavailable;
      showToast(`${feature} needs the backend`, 'The frontend is leaving this unarmed on purpose.', false);
    });
  });

  [elements.settingsDialog, elements.simulationDialog].forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  });

  initTheme();
  saveState();
  render();
  window.setInterval(render, 1000);
})();
