(() => {
  'use strict';

  const API_BASE = location.hostname === 'db.cmxchat.com'
    ? 'https://api.cmxchat.com/api/v1'
    : 'http://localhost:8000/api/v1';
  const THEME_KEY = 'cmx-checkin-theme';
  const CIRCUMFERENCE = 477.52;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const els = {
    statusConsole: $('#statusConsole'), topStatus: $('#topStatus'), statePill: $('#statePill'),
    statusTitle: $('#statusTitle'), statusCopy: $('#statusCopy'), countdown: $('#countdown'),
    countdownUnit: $('#countdownUnit'), ringProgress: $('#ringProgress'), lastCheckin: $('#lastCheckin'),
    nextDue: $('#nextDue'), intervalValue: $('#intervalValue'), graceValue: $('#graceValue'),
    stageMetric: $('#stageMetric'), lastEventMetric: $('#lastEventMetric'),
    recentActivity: $('#recentActivity'), activityList: $('#activityList'), todayDate: $('#todayDate'),
    checkinButton: $('#checkinButton'), settingsDialog: $('#settingsDialog'),
    intervalSelect: $('#intervalSelect'), graceSelect: $('#graceSelect'), saveSettings: $('#saveSettings'),
    simulationDialog: $('#simulationDialog'), simulationCode: $('#simulationCode'),
    simulationTitle: $('#simulationTitle'), simulationCopy: $('#simulationCopy'),
    simulationProgress: $('#simulationProgress'), nextSimulation: $('#nextSimulation'),
    closeSimulation: $('#closeSimulation'), stopSimulation: $('#stopSimulation'),
    themeToggle: $('#themeToggle'), toast: $('#toast'), authDialog: $('#authDialog'),
    authForm: $('#authForm'), authError: $('#authError'), authSubmit: $('#authSubmit')
  };

  let state = {
    switchId: null, enabled: false, serverOffsetMs: 0, lastCheckin: null, dueAt: null,
    triggerAt: null, intervalHours: 72, graceHours: 24, activity: []
  };
  let authenticated = false;
  let simulationIndex = 0;
  let toastTimer;

  const serverNow = () => Date.now() + state.serverOffsetMs;

  async function api(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...options,
      headers: { Accept: 'application/json', ...(options.headers || {}) }
    });
    if (!response.ok) {
      const error = new Error('API request failed');
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }

  function acceptStatus(data) {
    const receivedAt = Date.now();
    state.switchId = data.switch_id;
    state.enabled = data.enabled;
    state.serverOffsetMs = Date.parse(data.server_time) - receivedAt;
    state.lastCheckin = data.last_checkin_at ? Date.parse(data.last_checkin_at) : null;
    state.dueAt = data.next_due_at ? Date.parse(data.next_due_at) : null;
    state.triggerAt = data.grace_expires_at ? Date.parse(data.grace_expires_at) : null;
    state.intervalHours = data.interval_hours;
    state.graceHours = data.grace_hours;
    authenticated = true;
    els.intervalSelect.value = String(state.intervalHours);
    els.graceSelect.value = String(state.graceHours);
    renderStatus();
  }

  async function syncStatus({ promptOnAuth = true } = {}) {
    try {
      acceptStatus(await api('/checkin/status'));
      if (els.authDialog.open) els.authDialog.close();
    } catch (error) {
      if (error.status === 401) {
        authenticated = false;
        renderStatus();
        if (promptOnAuth && !els.authDialog.open) els.authDialog.showModal();
      } else {
        showToast('Could not reach the check-in API. No local deadline was changed.');
      }
    }
  }

  function getStatus(now = serverNow()) {
    if (!authenticated) return { key: 'disabled', label: 'SIGN IN', title: 'Sign in required', remaining: 0 };
    if (!state.enabled || !state.dueAt) return { key: 'disabled', label: 'DISABLED', title: 'Not started', remaining: 0 };
    const intervalMs = state.intervalHours * 3600000;
    const soonWindow = Math.min(12 * 3600000, intervalMs * 0.2);
    if (now >= state.triggerAt) return { key: 'triggered', label: 'TRIGGERED', title: 'Trigger state', remaining: now - state.triggerAt, intervalMs };
    if (now >= state.dueAt) return { key: 'grace', label: 'GRACE', title: 'Grace period', remaining: state.triggerAt - now, intervalMs };
    if (state.dueAt - now <= soonWindow) return { key: 'soon', label: 'DUE SOON', title: 'Check in soon', remaining: state.dueAt - now, intervalMs };
    return { key: 'safe', label: 'SAFE', title: 'Safe', remaining: state.dueAt - now, intervalMs };
  }

  function hms(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  function formatRelative(timestamp) {
    if (!timestamp) return 'Never';
    const diff = serverNow() - timestamp;
    const mins = Math.floor(Math.abs(diff) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(Math.abs(diff) / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(Math.abs(diff) / 86400000)}d ago`;
  }

  const formatDateTime = timestamp => timestamp
    ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp))
    : '—';
  const formatFullDate = timestamp => new Intl.DateTimeFormat(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(timestamp));

  function statusCopy(status) {
    if (!authenticated) return 'Sign in with your existing account to read or record a server-backed check-in.';
    if (status.key === 'disabled') return 'No switch exists yet. Check in to create your server-backed deadline.';
    if (status.key === 'soon') return 'Your deadline is getting close. Check in to reset the server timer.';
    if (status.key === 'grace') return 'Your check-in is overdue. You can still check in during this grace period.';
    if (status.key === 'triggered') return 'The server deadline reached trigger state. No external action was sent.';
    return "You're checked in. The API is the source of truth for this deadline.";
  }

  function renderStatus() {
    const status = getStatus();
    const elapsed = state.lastCheckin ? Math.max(0, serverNow() - state.lastCheckin) : 0;
    const progress = status.intervalMs ? Math.min(1, elapsed / status.intervalMs) : 0;
    els.statusConsole.dataset.state = status.key === 'disabled' ? 'safe' : status.key;
    els.topStatus.dataset.state = status.key === 'disabled' ? 'safe' : status.key;
    els.statePill.innerHTML = `<i></i>${status.label}`;
    els.topStatus.innerHTML = `<i></i><span>${status.label}</span>`;
    els.statusTitle.textContent = status.title;
    els.statusCopy.textContent = statusCopy(status);
    els.countdown.textContent = status.key === 'disabled' ? '--:--:--' : hms(status.remaining);
    els.countdownUnit.textContent = status.key === 'grace' ? 'grace time remaining' : status.key === 'triggered' ? 'past trigger state' : 'until check-in is due';
    els.ringProgress.style.strokeDashoffset = String(CIRCUMFERENCE * progress);
    els.lastCheckin.textContent = formatRelative(state.lastCheckin);
    els.nextDue.textContent = formatDateTime(state.dueAt);
    els.intervalValue.textContent = `${state.intervalHours} hours`;
    els.graceValue.textContent = `${state.graceHours} hours`;
    els.stageMetric.textContent = status.key === 'safe' ? 'Monitoring' : status.title;
    els.checkinButton.disabled = !authenticated;
    $$('.sequence-step').forEach(step => step.classList.toggle('is-current', step.dataset.stage === status.key));
  }

  function activityRow(item) {
    const row = document.createElement('div');
    row.className = 'activity-row';
    const type = document.createElement('strong'); type.textContent = item.type;
    const detail = document.createElement('p'); detail.textContent = item.detail;
    const time = document.createElement('time'); time.dateTime = new Date(item.time).toISOString(); time.textContent = formatDateTime(item.time);
    row.append(type, detail, time);
    return row;
  }

  function renderActivity() {
    els.activityList.replaceChildren(); els.recentActivity.replaceChildren();
    if (!state.activity.length) {
      const empty = document.createElement('div'); empty.className = 'activity-row';
      empty.innerHTML = '<strong>No session events</strong><p>Server activity retrieval comes in a later milestone.</p><time>—</time>';
      els.activityList.append(empty.cloneNode(true)); els.recentActivity.append(empty);
      els.lastEventMetric.textContent = 'None'; return;
    }
    state.activity.forEach(item => els.activityList.append(activityRow(item)));
    state.activity.slice(0, 3).forEach(item => els.recentActivity.append(activityRow(item)));
    els.lastEventMetric.textContent = state.activity[0].type;
  }

  function addActivity(type, detail) {
    state.activity.unshift({ type, detail, time: Date.now() });
    state.activity = state.activity.slice(0, 60);
    renderActivity();
  }

  function showToast(message) {
    clearTimeout(toastTimer); els.toast.textContent = message; els.toast.classList.add('is-visible');
    toastTimer = setTimeout(() => els.toast.classList.remove('is-visible'), 3200);
  }

  async function doCheckin() {
    if (!authenticated) { els.authDialog.showModal(); return; }
    els.checkinButton.disabled = true;
    try {
      acceptStatus(await api('/checkin', { method: 'POST', headers: { 'X-CMX-Client': 'checkin' } }));
      addActivity('Check-in', 'Server accepted the check-in and reset the deadline.');
      showToast('Server check-in recorded. Timer reset.');
      els.checkinButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(.985)' }, { transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' });
    } catch (error) {
      if (error.status === 401) { authenticated = false; renderStatus(); els.authDialog.showModal(); }
      showToast('Check-in failed. The server deadline was not changed.');
    } finally {
      els.checkinButton.disabled = !authenticated;
    }
  }

  async function signIn(event) {
    event.preventDefault(); els.authSubmit.disabled = true; els.authError.textContent = '';
    const body = new URLSearchParams(new FormData(els.authForm));
    try {
      await api('/login/checkin-session', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      await syncStatus({ promptOnAuth: false });
      els.authForm.reset();
      showToast('Secure check-in session started.');
    } catch {
      els.authError.textContent = 'Sign-in failed. Check your email and password, then try again.';
    } finally {
      els.authSubmit.disabled = false;
    }
  }

  function setView(name) {
    $$('.view').forEach(panel => { const active = panel.dataset.viewPanel === name; panel.classList.toggle('is-active', active); panel.hidden = !active; });
    $$('[data-view]').forEach(button => button.classList.toggle('is-active', button.dataset.view === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openSettings() {
    els.intervalSelect.value = String(state.intervalHours); els.graceSelect.value = String(state.graceHours);
    els.intervalSelect.disabled = true; els.graceSelect.disabled = true;
    els.settingsDialog.showModal();
  }

  const simulationStages = [
    { code: 'T+00:00', title: 'Check-in missed', copy: 'The deadline passes and the grace period starts.', progress: 25 },
    { code: 'T+06:00', title: 'Grace period active', copy: 'The system would continue waiting for a valid check-in.', progress: 50 },
    { code: 'T+18:00', title: 'Final verification window', copy: 'A future monitor could verify state here.', progress: 75 },
    { code: 'T+24:00', title: 'Trigger state reached', copy: 'Preview stops here. No server state or action is changed.', progress: 100 }
  ];
  function renderSimulation() { const stage = simulationStages[simulationIndex]; els.simulationCode.textContent = stage.code; els.simulationTitle.textContent = stage.title; els.simulationCopy.textContent = stage.copy; els.simulationProgress.style.width = `${stage.progress}%`; els.nextSimulation.textContent = simulationIndex === 3 ? 'Restart' : 'Next stage'; }
  function openSimulation() { simulationIndex = 0; renderSimulation(); els.simulationDialog.showModal(); }
  function nextSimulation() { simulationIndex = simulationIndex === 3 ? 0 : simulationIndex + 1; renderSimulation(); }
  function closeSimulation() { els.simulationDialog.close(); }

  function setTheme(theme) { document.documentElement.dataset.theme = theme; try { localStorage.setItem(THEME_KEY, theme); } catch {} const meta = $('meta[name="theme-color"]'); if (meta) meta.content = theme === 'light' ? '#eef4fa' : '#07111f'; }
  function initTheme() { let theme = 'dark'; try { theme = localStorage.getItem(THEME_KEY) || 'dark'; } catch {} setTheme(theme === 'light' ? 'light' : 'dark'); }

  function initEvents() {
    $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
    $$('[data-jump]').forEach(button => button.addEventListener('click', () => setView(button.dataset.jump)));
    els.checkinButton.addEventListener('click', doCheckin);
    ['#openSettings', '#mobileSettings', '#quickSettings'].forEach(selector => $(selector).addEventListener('click', openSettings));
    els.saveSettings.addEventListener('click', event => { event.preventDefault(); els.settingsDialog.close(); showToast('Server settings are read-only in this milestone.'); });
    $('#simulateButton').addEventListener('click', openSimulation); $('#timelineSimulate').addEventListener('click', openSimulation);
    els.nextSimulation.addEventListener('click', nextSimulation); els.closeSimulation.addEventListener('click', closeSimulation); els.stopSimulation.addEventListener('click', closeSimulation);
    els.themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
    $('#clearActivity').addEventListener('click', () => { state.activity = []; renderActivity(); showToast('Session activity cleared.'); });
    els.authForm.addEventListener('submit', signIn);
  }

  function init() {
    initTheme(); els.todayDate.textContent = formatFullDate(Date.now()); renderActivity(); renderStatus(); initEvents();
    syncStatus();
    setInterval(renderStatus, 1000);
    setInterval(() => { if (authenticated) syncStatus({ promptOnAuth: false }); }, 60000);
  }

  init();
})();