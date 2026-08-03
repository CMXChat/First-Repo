(() => {
  'use strict';

  const config = window.BRIEF_CONFIG;
  const presets = window.BRIEF_PRESETS;
  const data = window.BRIEF_DATA;
  const connections = window.BRIEF_CONNECTIONS;
  if (!config || !presets || !data || !connections) return;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const storageKey = key => `${config.storagePrefix}:${key}`;
  const state = {
    preset: localStorage.getItem(storageKey('preset')) || config.preset,
    shared: false,
    explaining: false,
    soundtrack: null,
    narrationActive: false
  };

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function applyPreset(id) {
    const preset = presets[id] || presets.individual;
    state.preset = preset.id;
    localStorage.setItem(storageKey('preset'), preset.id);
    $('#greeting').textContent = preset.greeting;
    $('#heroTitle').textContent = preset.heroTitle;
    $('#heroSummary').textContent = preset.summary;
  }

  function renderWeather() {
    $('#weatherLocation').textContent = data.weather.location;
    $('#weatherCondition').textContent = data.weather.condition;
    $('#weatherAdvice').textContent = data.weather.advice;
    $('#weatherMetrics').innerHTML = data.weather.metrics.map(item => `
      <div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>
    `).join('');

    $('#hourlyWeather').innerHTML = data.weather.hourly.map((item, index) => `
      <button class="forecast-item ${index === 0 ? 'is-active' : ''}" type="button" data-weather-index="${index}">
        <span>${escapeHtml(item.time)}</span>
        <i aria-hidden="true"></i>
        <strong>${escapeHtml(item.temp)}°</strong>
        <small>${escapeHtml(item.condition)}</small>
      </button>
    `).join('');

    $('#dailyWeather').innerHTML = data.weather.daily.map(item => `
      <button class="forecast-item" type="button" data-day-label="${escapeHtml(item.time)}">
        <span>${escapeHtml(item.time)}</span>
        <i aria-hidden="true"></i>
        <strong>${escapeHtml(item.temp)}°</strong>
        <small>${escapeHtml(item.low)}° · ${escapeHtml(item.rain)}% rain</small>
      </button>
    `).join('');

    $$('[data-weather-index]').forEach(button => {
      button.addEventListener('click', () => {
        const item = data.weather.hourly[Number(button.dataset.weatherIndex)];
        $$('[data-weather-index]').forEach(card => card.classList.remove('is-active'));
        button.classList.add('is-active');
        $('#weatherTemp').textContent = `${item.temp}°`;
        $('#weatherCondition').textContent = item.condition;
        $('#weatherAdvice').textContent = `${item.rain}% rain chance · ${item.wind} mph wind. Select another hour to compare.`;
      });
    });
  }

  function renderPriorities() {
    const completed = JSON.parse(localStorage.getItem(storageKey('completed')) || '[]');
    $('#priorityBoard').innerHTML = data.priorities.map(item => `
      <article class="priority-card ${completed.includes(item.id) ? 'is-complete' : ''}" data-priority-id="${escapeHtml(item.id)}">
        <div class="priority-rank">${escapeHtml(item.rank)}</div>
        <div class="priority-content">
          <span class="source-label">${escapeHtml(item.status)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
          <div class="priority-meta"><span>${escapeHtml(item.due)}</span><span>${escapeHtml(item.owner)}</span></div>
        </div>
        <button class="complete-button" type="button" aria-label="Toggle ${escapeHtml(item.title)} complete">✓</button>
      </article>
    `).join('');

    $$('.complete-button').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.priority-card');
        const id = card.dataset.priorityId;
        const values = new Set(JSON.parse(localStorage.getItem(storageKey('completed')) || '[]'));
        if (values.has(id)) values.delete(id); else values.add(id);
        localStorage.setItem(storageKey('completed'), JSON.stringify([...values]));
        card.classList.toggle('is-complete');
        showToast(card.classList.contains('is-complete') ? 'Marked complete on this device.' : 'Moved back to active priorities.');
      });
    });
  }

  function renderSchedule() {
    $('#scheduleTimeline').innerHTML = data.schedule.map(item => `
      <article class="timeline-item">
        <time>${escapeHtml(item.time)}</time>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.meta)}</p></div>
      </article>
    `).join('');
  }

  function renderShared() {
    const items = state.shared ? data.shared.shared : data.shared.private;
    $('#sharedGrid').innerHTML = items.map(item => `
      <article class="shared-card">
        <span>${escapeHtml(item.label)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.note)}</p>
      </article>
    `).join('');
    $('#viewModeButton').textContent = state.shared ? 'Shared view' : 'Private view';
    $('#viewModeButton').setAttribute('aria-pressed', String(state.shared));
    $('#sharedToggleInside').textContent = state.shared ? 'Return to private view' : 'Preview shared view';
  }

  function renderConnections() {
    const labels = {
      connected: 'CONNECTED',
      demo: 'DEMO',
      planned: 'PLANNED',
      'not-connected': 'NOT CONNECTED',
      'requires-approval': 'REQUIRES APPROVAL'
    };
    $('#connectionGrid').innerHTML = connections.map(item => `
      <article class="connection-card">
        <div class="connection-heading"><h3>${escapeHtml(item.label)}</h3><span class="connection-status status-${escapeHtml(item.status)}">${labels[item.status] || escapeHtml(item.status)}</span></div>
        <p>${escapeHtml(item.description)}</p>
        <small>Permission: ${escapeHtml(item.permission)}</small>
      </article>
    `).join('');
  }

  function setupWeatherTabs() {
    const hourlyTab = $('#hourlyTab');
    const dailyTab = $('#dailyTab');
    const hourly = $('#hourlyWeather');
    const daily = $('#dailyWeather');
    const switchTo = mode => {
      const isHourly = mode === 'hourly';
      hourlyTab.setAttribute('aria-selected', String(isHourly));
      dailyTab.setAttribute('aria-selected', String(!isHourly));
      hourly.classList.toggle('is-hidden', !isHourly);
      daily.classList.toggle('is-hidden', isHourly);
    };
    hourlyTab.addEventListener('click', () => switchTo('hourly'));
    dailyTab.addEventListener('click', () => switchTo('daily'));
  }

  function startSoundtrack() {
    if (state.soundtrack) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast('This browser does not support the demo soundtrack.');
      return;
    }
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.035;
    master.connect(context.destination);
    const frequencies = [110, 164.81, 220, 329.63];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index % 2 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.55 : 0.2;
      oscillator.connect(gain).connect(master);
      oscillator.start();
      return oscillator;
    });
    state.soundtrack = { context, oscillators };
    $('#audioButton').classList.add('is-active');
    $('#audioButton').setAttribute('aria-label', 'Stop soundtrack');
  }

  function stopSoundtrack() {
    if (!state.soundtrack) return;
    state.soundtrack.oscillators.forEach(oscillator => oscillator.stop());
    state.soundtrack.context.close();
    state.soundtrack = null;
    $('#audioButton').classList.remove('is-active');
    $('#audioButton').setAttribute('aria-label', 'Start soundtrack');
  }

  function readOpening() {
    if (!('speechSynthesis' in window)) {
      showToast('Read aloud is not available in this browser.');
      return;
    }
    if (state.narrationActive) {
      window.speechSynthesis.cancel();
      state.narrationActive = false;
      $('#readButton').classList.remove('is-active');
      return;
    }
    const words = [$('#greeting').textContent, $('#heroTitle').textContent, $('#heroSummary').textContent, ...data.priorities.map(item => `${item.title}. ${item.detail}`)].join(' ');
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onend = () => {
      state.narrationActive = false;
      $('#readButton').classList.remove('is-active');
    };
    state.narrationActive = true;
    $('#readButton').classList.add('is-active');
    window.speechSynthesis.speak(utterance);
  }

  function unlock() {
    const profile = $('#profileSelect').value;
    applyPreset(profile);
    document.body.classList.remove('is-locked');
    $('#entryGate').classList.add('is-hidden');
    $('#briefApp').setAttribute('aria-hidden', 'false');
    sessionStorage.setItem(storageKey('entered'), 'true');
    if ($('#musicOnEntry').checked) startSoundtrack();
    if ($('#readOnEntry').checked) setTimeout(readOpening, 300);
    $('#briefMain').focus({ preventScroll: true });
  }

  function setupInteractions() {
    $('#enterBrief').addEventListener('click', unlock);
    $('#profileSelect').value = state.preset;
    $('#viewModeButton').addEventListener('click', () => { state.shared = !state.shared; renderShared(); });
    $('#sharedToggleInside').addEventListener('click', () => { state.shared = !state.shared; renderShared(); $('#sharedSpace').scrollIntoView({ behavior: 'smooth' }); });
    $('#audioButton').addEventListener('click', () => state.soundtrack ? stopSoundtrack() : startSoundtrack());
    $('#readButton').addEventListener('click', readOpening);
    $('#explainButton').addEventListener('click', () => {
      state.explaining = !state.explaining;
      $('#explainButton').setAttribute('aria-pressed', String(state.explaining));
      $('#explainPanel').classList.toggle('is-hidden', !state.explaining);
      document.body.classList.toggle('explain-mode', state.explaining);
    });
    $('#openConnections').addEventListener('click', () => $('#connections').scrollIntoView({ behavior: 'smooth' }));
    $('#resetExperience').addEventListener('click', () => {
      Object.keys(localStorage).filter(key => key.startsWith(config.storagePrefix)).forEach(key => localStorage.removeItem(key));
      sessionStorage.removeItem(storageKey('entered'));
      stopSoundtrack();
      window.speechSynthesis?.cancel();
      window.location.reload();
    });
    $$('[data-concept-action]').forEach(button => {
      button.addEventListener('click', () => showToast(`${button.dataset.conceptAction}: concept action only. A connected account would be required.`));
    });
  }

  function updateClock() {
    const value = new Intl.DateTimeFormat('en-US', { timeZone: data.edition.timezone, hour: 'numeric', minute: '2-digit' }).format(new Date());
    $('#currentTime').textContent = value;
  }

  function init() {
    $('#editionDate').textContent = data.edition.date;
    applyPreset(state.preset);
    renderWeather();
    renderPriorities();
    renderSchedule();
    renderShared();
    renderConnections();
    setupWeatherTabs();
    setupInteractions();
    updateClock();
    setInterval(updateClock, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
