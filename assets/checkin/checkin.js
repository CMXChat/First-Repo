(() => {
  'use strict';

  const STORAGE_KEY = 'cmx-checkin-state-v2';
  const THEME_KEY = 'cmx-checkin-theme';
  const CIRCUMFERENCE = 477.52;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const els = {
    statusConsole: $('#statusConsole'),
    topStatus: $('#topStatus'),
    statePill: $('#statePill'),
    statusTitle: $('#statusTitle'),
    statusCopy: $('#statusCopy'),
    countdown: $('#countdown'),
    countdownUnit: $('#countdownUnit'),
    ringProgress: $('#ringProgress'),
    lastCheckin: $('#lastCheckin'),
    nextDue: $('#nextDue'),
    intervalValue: $('#intervalValue'),
    graceValue: $('#graceValue'),
    stageMetric: $('#stageMetric'),
    lastEventMetric: $('#lastEventMetric'),
    recentActivity: $('#recentActivity'),
    activityList: $('#activityList'),
    todayDate: $('#todayDate'),
    checkinButton: $('#checkinButton'),
    settingsDialog: $('#settingsDialog'),
    intervalSelect: $('#intervalSelect'),
    graceSelect: $('#graceSelect'),
    saveSettings: $('#saveSettings'),
    simulationDialog: $('#simulationDialog'),
    simulationCode: $('#simulationCode'),
    simulationTitle: $('#simulationTitle'),
    simulationCopy: $('#simulationCopy'),
    simulationProgress: $('#simulationProgress'),
    nextSimulation: $('#nextSimulation'),
    closeSimulation: $('#closeSimulation'),
    stopSimulation: $('#stopSimulation'),
    themeToggle: $('#themeToggle'),
    toast: $('#toast')
  };

  const defaultState = () => ({
    lastCheckin: Date.now(),
    intervalHours: 72,
    graceHours: 24,
    activity: [
      {
        type: 'Check-in',
        detail: 'Local timer initialized on this device.',
        time: Date.now()
      }
    ]
  });

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved.lastCheckin !== 'number') return defaultState();
      return {
        lastCheckin: saved.lastCheckin,
        intervalHours: Number(saved.intervalHours) || 72,
        graceHours: Number(saved.graceHours) || 24,
        activity: Array.isArray(saved.activity) ? saved.activity.slice(0, 60) : []
      };
    } catch {
      return defaultState();
    }
  }

  let state = loadState();
  let simulationIndex = 0;
  let toastTimer;

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function addActivity(type, detail) {
    state.activity.unshift({ type, detail, time: Date.now() });
    state.activity = state.activity.slice(0, 60);
    saveState();
    renderActivity();
  }

  function formatRelative(timestamp) {
    const diff = Date.now() - timestamp;
    const abs = Math.abs(diff);
    const mins = Math.floor(abs / 60000);
    const hours = Math.floor(abs / 3600000);
    const days = Math.floor(abs / 86400000);
    const suffix = diff >= 0 ? 'ago' : 'from now';
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ${suffix}`;
    if (hours < 24) return `${hours}h ${suffix}`;
    return `${days}d ${suffix}`;
  }

  function formatDateTime(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(new Date(timestamp));
  }

  function formatFullDate(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    }).format(new Date(timestamp));
  }

  function getStatus(now = Date.now()) {
    const intervalMs = state.intervalHours * 3600000;
    const graceMs = state.graceHours * 3600000;
    const dueAt = state.lastCheckin + intervalMs;
    const triggerAt = dueAt + graceMs;
    const remaining = dueAt - now;
    const soonWindow = Math.min(12 * 3600000, intervalMs * 0.2);

    if (now >= triggerAt) return { key: 'triggered', label: 'TRIGGERED', title: 'Trigger state', remaining: now - triggerAt, dueAt, triggerAt, intervalMs };
    if (now >= dueAt) return { key: 'grace', label: 'GRACE', title: 'Grace period', remaining: triggerAt - now, dueAt, triggerAt, intervalMs };
    if (remaining <= soonWindow) return { key: 'soon', label: 'DUE SOON', title: 'Check in soon', remaining, dueAt, triggerAt, intervalMs };
    return { key: 'safe', label: 'SAFE', title: 'Safe', remaining, dueAt, triggerAt, intervalMs };
  }

  function hms(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function statusCopy(status) {
    if (status.key === 'soon') return 'Your deadline is getting close. Check in to reset the timer.';
    if (status.key === 'grace') return 'Your check-in is overdue. You are inside the local grace period.';
    if (status.key === 'triggered') return 'The local timer reached trigger state. No external action was sent.';
    return "You're checked in. Nothing happens while this timer is active.";
  }

  function renderStatus() {
    const status = getStatus();
    const elapsed = Math.max(0, Date.now() - state.lastCheckin);
    const progress = Math.min(1, elapsed / status.intervalMs);

    els.statusConsole.dataset.state = status.key;
    els.topStatus.dataset.state = status.key;
    els.statePill.innerHTML = `<i></i>${status.label}`;
    els.topStatus.innerHTML = `<i></i><span>${status.label}</span>`;
    els.statusTitle.textContent = status.title;
    els.statusCopy.textContent = statusCopy(status);
    els.countdown.textContent = hms(status.remaining);
    els.countdownUnit.textContent = status.key === 'grace' ? 'grace time remaining' : status.key === 'triggered' ? 'past trigger state' : 'until check-in is due';
    els.ringProgress.style.strokeDashoffset = String(CIRCUMFERENCE * progress);
    els.lastCheckin.textContent = formatRelative(state.lastCheckin);
    els.nextDue.textContent = formatDateTime(status.dueAt);
    els.intervalValue.textContent = `${state.intervalHours} hours`;
    els.graceValue.textContent = `${state.graceHours} hours`;
    els.stageMetric.textContent = status.key === 'safe' ? 'Monitoring' : status.title;

    $$('.sequence-step').forEach(step => step.classList.toggle('is-current', step.dataset.stage === status.key));
  }

  function activityRow(item) {
    const row = document.createElement('div');
    row.className = 'activity-row';
    const type = document.createElement('strong');
    type.textContent = item.type;
    const detail = document.createElement('p');
    detail.textContent = item.detail;
    const time = document.createElement('time');
    time.dateTime = new Date(item.time).toISOString();
    time.textContent = formatDateTime(item.time);
    row.append(type, detail, time);
    return row;
  }

  function renderActivity() {
    els.activityList.replaceChildren();
    els.recentActivity.replaceChildren();

    if (!state.activity.length) {
      const empty = document.createElement('div');
      empty.className = 'activity-row';
      empty.innerHTML = '<strong>No local events</strong><p>Your next check-in will appear here.</p><time>—</time>';
      els.activityList.append(empty.cloneNode(true));
      els.recentActivity.append(empty);
      els.lastEventMetric.textContent = 'None';
      return;
    }

    state.activity.forEach(item => els.activityList.append(activityRow(item)));
    state.activity.slice(0, 3).forEach(item => els.recentActivity.append(activityRow(item)));
    els.lastEventMetric.textContent = state.activity[0].type;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    toastTimer = setTimeout(() => els.toast.classList.remove('is-visible'), 2600);
  }

  function doCheckin() {
    state.lastCheckin = Date.now();
    addActivity('Check-in', 'Manual check-in accepted. Timer reset.');
    renderStatus();
    showToast('Check-in recorded. Timer reset.');
    els.checkinButton.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(.985)' }, { transform: 'scale(1)' }],
      { duration: 220, easing: 'ease-out' }
    );
  }

  function setView(name) {
    $$('.view').forEach(panel => {
      const active = panel.dataset.viewPanel === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    $$('[data-view]').forEach(button => button.classList.toggle('is-active', button.dataset.view === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openSettings() {
    els.intervalSelect.value = String(state.intervalHours);
    els.graceSelect.value = String(state.graceHours);
    if (typeof els.settingsDialog.showModal === 'function') els.settingsDialog.showModal();
  }

  function applySettings() {
    const oldInterval = state.intervalHours;
    const oldGrace = state.graceHours;
    state.intervalHours = Number(els.intervalSelect.value);
    state.graceHours = Number(els.graceSelect.value);
    saveState();
    if (oldInterval !== state.intervalHours || oldGrace !== state.graceHours) {
      addActivity('Settings changed', `Interval ${state.intervalHours}h · grace ${state.graceHours}h.`);
    }
    renderStatus();
    els.settingsDialog.close();
    showToast('Check-in settings updated.');
  }

  const simulationStages = [
    { code: 'T+00:00', title: 'Check-in missed', copy: 'The deadline passes and the grace period starts.', progress: 25 },
    { code: 'T+06:00', title: 'Grace period active', copy: 'The system would continue waiting for a valid check-in.', progress: 50 },
    { code: 'T+18:00', title: 'Final verification window', copy: 'A future backend could send reminders or verification requests here.', progress: 75 },
    { code: 'T+24:00', title: 'Trigger state reached', copy: 'Preview stops here. This frontend has no external release actions connected.', progress: 100 }
  ];

  function renderSimulation() {
    const stage = simulationStages[simulationIndex];
    els.simulationCode.textContent = stage.code;
    els.simulationTitle.textContent = stage.title;
    els.simulationCopy.textContent = stage.copy;
    els.simulationProgress.style.width = `${stage.progress}%`;
    els.nextSimulation.textContent = simulationIndex === simulationStages.length - 1 ? 'Restart' : 'Next stage';
  }

  function openSimulation() {
    simulationIndex = 0;
    renderSimulation();
    if (typeof els.simulationDialog.showModal === 'function') els.simulationDialog.showModal();
  }

  function nextSimulation() {
    if (simulationIndex === simulationStages.length - 1) simulationIndex = 0;
    else simulationIndex += 1;
    renderSimulation();
  }

  function closeSimulation() {
    els.simulationDialog.close();
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#eef4fa' : '#07111f';
  }

  function toggleTheme() {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  }

  function initTheme() {
    let theme = 'dark';
    try { theme = localStorage.getItem(THEME_KEY) || 'dark'; } catch {}
    setTheme(theme === 'light' ? 'light' : 'dark');
  }

  function initEvents() {
    $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
    $$('[data-jump]').forEach(button => button.addEventListener('click', () => setView(button.dataset.jump)));
    els.checkinButton.addEventListener('click', doCheckin);
    $('#openSettings').addEventListener('click', openSettings);
    $('#mobileSettings').addEventListener('click', openSettings);
    $('#quickSettings').addEventListener('click', openSettings);
    els.saveSettings.addEventListener('click', event => { event.preventDefault(); applySettings(); });
    $('#simulateButton').addEventListener('click', openSimulation);
    $('#timelineSimulate').addEventListener('click', openSimulation);
    els.nextSimulation.addEventListener('click', nextSimulation);
    els.closeSimulation.addEventListener('click', closeSimulation);
    els.stopSimulation.addEventListener('click', closeSimulation);
    els.themeToggle.addEventListener('click', toggleTheme);
    $('#clearActivity').addEventListener('click', () => {
      state.activity = [];
      saveState();
      renderActivity();
      showToast('Local activity log cleared.');
    });
  }

  function init() {
    initTheme();
    els.todayDate.textContent = formatFullDate(Date.now());
    els.intervalSelect.value = String(state.intervalHours);
    els.graceSelect.value = String(state.graceHours);
    renderActivity();
    renderStatus();
    initEvents();
    saveState();
    setInterval(renderStatus, 1000);
    setInterval(renderActivity, 60000);
  }

  init();
})();