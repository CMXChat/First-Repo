(() => {
  'use strict';

  const live = window.BRIEF_LIVE_DATA;
  if (!live) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKey = 'cmxBriefDemo:appearance';
  let initialized = false;
  let speaking = false;
  let entryShouldSpeak = false;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function addThemeToggle() {
    const actions = $('.top-actions');
    if (!actions || $('#themeToggleButton')) return;
    const button = document.createElement('button');
    button.id = 'themeToggleButton';
    button.className = 'icon-button theme-toggle-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Switch to light mode');
    button.textContent = '☀';
    actions.insertBefore(button, actions.firstChild);

    const apply = value => {
      const light = value === 'light';
      document.documentElement.dataset.theme = light ? 'light' : 'black';
      button.textContent = light ? '☾' : '☀';
      button.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      button.setAttribute('aria-pressed', String(light));
    };

    apply(localStorage.getItem(storageKey) || 'black');
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'black' : 'light';
      localStorage.setItem(storageKey, next);
      apply(next);
    });
  }

  function addScenarioMenu() {
    const actions = $('.top-actions');
    if (!actions || $('#scenarioMenuButton')) return;
    const button = document.createElement('button');
    button.id = 'scenarioMenuButton';
    button.className = 'quiet-button scenario-menu-button';
    button.type = 'button';
    button.textContent = 'Switch briefing';
    button.setAttribute('aria-expanded', 'false');
    actions.insertBefore(button, actions.firstChild);

    const menu = document.createElement('div');
    menu.id = 'scenarioQuickMenu';
    menu.className = 'scenario-quick-menu is-hidden';
    menu.setAttribute('aria-label', 'Switch briefing type');
    menu.innerHTML = `
      <div class="scenario-quick-head"><div><span>BRIEFING VIEWS</span><strong>Same platform, different people and purpose.</strong></div><button type="button" aria-label="Close briefing switcher">×</button></div>
      <div class="scenario-quick-grid">
        <button type="button" data-quick-preset="individual"><span>Personal</span><small>Public Brooklyn updates, private goals and daily intelligence</small></button>
        <button type="button" data-quick-preset="couple"><span>Relationship</span><small>Two private profiles and one approved shared space</small></button>
        <button type="button" data-quick-preset="partners"><span>Business</span><small>KPIs, finances, projects, messages and ownership</small></button>
        <button type="button" data-quick-preset="trainer"><span>Trainer + student</span><small>Habits, evidence, goals, notes and consent</small></button>
      </div>`;
    document.body.appendChild(menu);

    const close = () => {
      menu.classList.add('is-hidden');
      button.setAttribute('aria-expanded', 'false');
    };
    button.addEventListener('click', () => {
      const opening = menu.classList.contains('is-hidden');
      menu.classList.toggle('is-hidden', !opening);
      button.setAttribute('aria-expanded', String(opening));
    });
    $('.scenario-quick-head button', menu).addEventListener('click', close);
    $$('[data-quick-preset]', menu).forEach(option => {
      option.addEventListener('click', () => {
        window.BRIEF_APP?.setPreset?.(option.dataset.quickPreset);
        close();
        $('#today')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function requireScenarioChoice() {
    const select = $('#profileSelect');
    const enter = $('#enterBrief');
    if (!select || !enter || select.dataset.liveRequired === 'true') return;
    select.dataset.liveRequired = 'true';
    if (!select.querySelector('option[value=""]')) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Choose the briefing you want to explore';
      option.disabled = true;
      option.selected = true;
      select.prepend(option);
    }
    select.value = '';
    enter.disabled = true;
    enter.textContent = 'Choose a briefing first';
    select.addEventListener('change', () => {
      const chosen = Boolean(select.value);
      enter.disabled = !chosen;
      enter.textContent = chosen ? 'Open this briefing' : 'Choose a briefing first';
    });
  }

  function renderLivePublicLayer() {
    if ($('#livePublicLayer')) return;
    const anchor = $('.section-nav');
    if (!anchor) return;
    const section = document.createElement('section');
    section.id = 'livePublicLayer';
    section.className = 'brief-section live-public-layer';
    section.innerHTML = `
      <div class="section-heading">
        <div><p class="micro-label">REAL PUBLIC INFORMATION · BROOKLYN EXAMPLE</p><h2>Live enough to change the day. Private enough for a public demo.</h2></div>
        <p>${escapeHtml(live.privacy)}</p>
      </div>
      <div class="live-refresh-banner">
        <div><span>PUBLIC REFRESH</span><strong>${escapeHtml(live.generated)}</strong></div>
        <p>${escapeHtml(live.refreshSchedule)}</p>
      </div>
      <article class="live-weather-card">
        <div>
          <span class="source-label source-connected">${escapeHtml(live.weather.status)}</span>
          <p class="micro-label">${escapeHtml(live.location)}</p>
          <strong>${escapeHtml(live.weather.temperature)}</strong>
          <h3>${escapeHtml(live.weather.condition)}</h3>
          <p>${escapeHtml(live.weather.summary)}</p>
          <p class="live-weather-advice">${escapeHtml(live.weather.advice)}</p>
        </div>
        <div class="live-weather-metrics">${live.weather.metrics.map(item => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('')}</div>
        <div class="live-source-links">${live.weather.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>`).join('')}</div>
      </article>
      <div class="live-news-grid">${live.news.map(story => `
        <article>
          <div><span>${escapeHtml(story.group)}</span><small>${escapeHtml(story.status)}</small></div>
          <h3>${escapeHtml(story.title)}</h3>
          <p>${escapeHtml(story.summary)}</p>
          <details><summary>Why this briefing selected it</summary><p>${escapeHtml(story.why)}</p></details>
          <a href="${escapeHtml(story.url)}" target="_blank" rel="noopener noreferrer">Open public source</a>
        </article>`).join('')}</div>`;
    anchor.insertAdjacentElement('afterend', section);
  }

  function applyLiveWeatherToPersonal() {
    if (window.BRIEF_APP?.getPreset?.() !== 'individual') return;
    const label = $('#weatherNow .source-label');
    if (label) {
      label.textContent = 'LIVE PUBLIC WEATHER';
      label.className = 'source-label source-connected';
    }
    if ($('#weatherLocation')) $('#weatherLocation').textContent = live.location;
    if ($('#weatherTemp')) $('#weatherTemp').textContent = live.weather.temperature;
    if ($('#weatherCondition')) $('#weatherCondition').textContent = live.weather.condition;
    if ($('#weatherAdvice')) $('#weatherAdvice').textContent = live.weather.advice;
    if ($('#weatherMetrics')) $('#weatherMetrics').innerHTML = live.weather.metrics.map(item => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('');
  }

  function enhanceSpotifyPlayers() {
    const song = window.CMX_DAILY_SONG;
    const recommendations = Array.isArray(song?.recommendations) ? song.recommendations : [];
    $$('.favorite-track').forEach((card, index) => {
      if (card.querySelector('.favorite-spotify-frame')) return;
      const url = String(recommendations[index]?.spotifyUrl || '');
      const match = url.match(/open\.spotify\.com\/track\/([A-Za-z0-9]{22})/);
      if (!match) return;
      const oldButton = card.querySelector('button');
      if (oldButton) oldButton.hidden = true;
      const frame = document.createElement('iframe');
      frame.className = 'favorite-spotify-frame';
      frame.title = `Play ${recommendations[index]?.title || 'favorite track'} on Spotify`;
      frame.loading = 'lazy';
      frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      frame.src = `https://open.spotify.com/embed/track/${encodeURIComponent(match[1])}?utm_source=generator&theme=0`;
      card.appendChild(frame);
    });
    $$('.scenario-song').forEach(button => {
      button.setAttribute('aria-label', `Play ${button.querySelector('strong')?.textContent || 'this track'} in the Spotify player`);
    });
  }

  function chooseDeviceVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find(voice => /^en(-|_)/i.test(voice.lang) && /natural|samantha|ava|serena|google|microsoft/i.test(voice.name)) || voices.find(voice => /^en(-|_)/i.test(voice.lang)) || null;
  }

  function quickNarration() {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      $('#readButton')?.classList.remove('is-active');
      return;
    }
    const greeting = $('#greeting')?.textContent || 'Good morning.';
    const summary = $('#heroSummary')?.textContent || 'Your briefing is ready.';
    const weather = window.BRIEF_APP?.getPreset?.() === 'individual' ? `${live.weather.condition}. ${live.weather.advice}` : '';
    const text = `${greeting} ${summary} ${weather} Today this demonstration uses a built-in device voice. More natural licensed voices and app alarm voices can be added as the platform grows.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    const voice = chooseDeviceVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = utterance.onerror = () => {
      speaking = false;
      $('#readButton')?.classList.remove('is-active');
    };
    speaking = true;
    $('#readButton')?.classList.add('is-active');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function overrideNarration() {
    const enter = $('#enterBrief');
    const readButton = $('#readButton');
    if (enter && enter.dataset.liveNarration !== 'true') {
      enter.dataset.liveNarration = 'true';
      enter.addEventListener('click', () => {
        const checkbox = $('#readOnEntry');
        entryShouldSpeak = Boolean(checkbox?.checked);
        if (checkbox) checkbox.checked = false;
        if (entryShouldSpeak) window.setTimeout(quickNarration, 1100);
      }, true);
    }
    if (readButton && readButton.dataset.liveNarration !== 'true') {
      readButton.dataset.liveNarration = 'true';
      readButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        quickNarration();
      }, true);
    }
    const copy = $('#readOnEntry')?.closest('.option-row')?.querySelector('small');
    if (copy) copy.textContent = 'Reads only a greeting, quick day summary and a short note about future natural voice options.';
  }

  function addPossibilityDetails() {
    if ($('#expandedPossibilities')) return;
    const anchor = $('#possibilities');
    if (!anchor) return;
    const panel = document.createElement('div');
    panel.id = 'expandedPossibilities';
    panel.className = 'expanded-possibilities';
    panel.innerHTML = `
      <div class="scenario-subheading"><div><p class="micro-label">MORE EXPERIENCES THAT BECOME POSSIBLE</p><h3>The dashboard follows the data. The person does not have to fit a fixed dashboard.</h3></div><p>As approved data, memory and research improve, the page can change its modules, ordering, tone and actions around what is useful that day.</p></div>
      <div class="possibility-details">${live.learningPossibilities.map(item => `<details><summary>${escapeHtml(item.title)}</summary><p>${escapeHtml(item.text)}</p></details>`).join('')}</div>
      <details class="possibility-wide"><summary>How real-time data, MCP, APIs, RAG and model choice fit together</summary><p>APIs and MCP connectors can bring approved service data into the backend. RAG can retrieve the right records, notes and sources before an AI answers. Research can verify changing public information. A model router can choose a fast model, a private model or a deeper reasoning model. The interface can then emphasize the information that matters now, while permissions and memory rules remain stable.</p></details>`;
    anchor.appendChild(panel);
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    addThemeToggle();
    addScenarioMenu();
    requireScenarioChoice();
    renderLivePublicLayer();
    overrideNarration();
    addPossibilityDetails();
    enhanceSpotifyPlayers();
    applyLiveWeatherToPersonal();
    window.addEventListener('brief:preset-change', () => {
      window.setTimeout(() => {
        applyLiveWeatherToPersonal();
        enhanceSpotifyPlayers();
      }, 60);
    });
    [120, 420, 900].forEach(delay => window.setTimeout(enhanceSpotifyPlayers, delay));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 300), { once: true });
})();
