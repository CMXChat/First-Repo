(() => {
  'use strict';

  const data = window.SARA_BRIEF_DATA;
  if (!data) return;

  const $ = selector => document.querySelector(selector);
  const audio = window.SARA_BRIEF_AUDIO || null;
  let speech = null;
  let musicVolumeBeforeSpeech = 0.24;

  function escapeHtml(value = '') {
    const node = document.createElement('div');
    node.textContent = String(value);
    return node.innerHTML;
  }

  function safeUrl(url = '') {
    return /^https:\/\//.test(String(url)) ? String(url) : '#';
  }

  function cardMarkup(item) {
    return `
      <article class="brief-card">
        <span class="card-icon" aria-hidden="true">${escapeHtml(item.icon || '•')}</span>
        ${item.kicker ? `<p class="card-kicker">${escapeHtml(item.kicker)}</p>` : ''}
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>`;
  }

  function renderPriority() {
    const container = $('#priorityCards');
    if (container) container.innerHTML = data.priority.map(cardMarkup).join('');
  }

  function renderWeather() {
    const container = $('#weatherCards');
    if (!container) return;
    container.innerHTML = data.weather.map(item => `
      <article class="weather-card ${escapeHtml(item.className)}">
        <div class="weather-place"><h3>${escapeHtml(item.city)}</h3><span aria-hidden="true">${escapeHtml(item.icon)}</span></div>
        <strong class="weather-temp">${escapeHtml(item.temp)}</strong>
        <p>${escapeHtml(item.headline)}</p>
        <div class="weather-details">${item.details.map(detail => `<span>${escapeHtml(detail)}</span>`).join('')}</div>
        <a class="weather-source" href="${safeUrl(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.sourceLabel)}</a>
      </article>`).join('');
  }

  function storedExerciseIds() {
    try {
      return JSON.parse(localStorage.getItem('saraCompletedExercises') || '[]');
    } catch {
      return [];
    }
  }

  function renderExercises() {
    const container = $('#exerciseCards');
    if (!container) return;
    const completed = new Set(storedExerciseIds());
    container.innerHTML = data.exercises.map(item => `
      <label class="exercise-card">
        <input class="exercise-check" type="checkbox" value="${escapeHtml(item.id)}" ${completed.has(item.id) ? 'checked' : ''} />
        <span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></span>
      </label>`).join('');

    container.querySelectorAll('.exercise-check').forEach(check => {
      check.addEventListener('change', () => {
        const ids = [...container.querySelectorAll('.exercise-check:checked')].map(node => node.value);
        try { localStorage.setItem('saraCompletedExercises', JSON.stringify(ids)); } catch {}
      });
    });

    const safety = $('.safety-note');
    if (safety && data.healthSource) {
      const link = document.createElement('a');
      link.href = safeUrl(data.healthSource.url);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = data.healthSource.label;
      safety.append(' ');
      safety.appendChild(link);
    }
  }

  function stepMessage(steps) {
    if (!steps) return 'כל תנועה נחשבת.';
    if (steps < 2000) return 'התחלה טובה. אפשר להוסיף הליכה קצרה בקצב נוח.';
    if (steps < 5000) return 'את בתנועה. המשיכי לפי ההרגשה והיכולת שלך.';
    if (steps < 8000) return 'יום פעיל מאוד. מים ומנוחה חשובים גם הם.';
    return 'הרבה תנועה היום. אין צורך לרדוף אחרי מספר נוסף.';
  }

  function updateStepDisplay(steps) {
    const input = $('#stepInput');
    const progress = $('#stepProgress');
    const message = $('#stepMessage');
    const clean = Math.max(0, Number(steps) || 0);
    if (input) input.value = clean || '';
    if (progress) progress.style.width = `${Math.min(100, (clean / 5000) * 100)}%`;
    if (message) message.textContent = stepMessage(clean);
  }

  function setupSteps() {
    let saved = 0;
    try { saved = Number(localStorage.getItem('saraSteps') || 0); } catch {}
    updateStepDisplay(saved);
    const button = $('#saveSteps');
    const input = $('#stepInput');
    if (!button || !input) return;
    button.addEventListener('click', () => {
      const value = Math.max(0, Number(input.value) || 0);
      try { localStorage.setItem('saraSteps', String(value)); } catch {}
      updateStepDisplay(value);
    });
  }

  function renderFood() {
    const container = $('#foodCards');
    if (container) container.innerHTML = data.food.map(cardMarkup).join('');
  }

  function renderBeach() {
    const container = $('#beachCard');
    if (!container) return;
    const item = data.beach;
    container.innerHTML = `
      <article class="beach-card">
        <span class="card-icon" aria-hidden="true">🏖️</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
        <div class="beach-forecast">${item.forecast.map(value => `<span>${escapeHtml(value)}</span>`).join('')}</div>
        <ul class="beach-list">${item.checklist.map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>
        <div class="hero-actions">${item.sourceLinks.map(link => `<a href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join('')}</div>
      </article>`;
  }

  function renderNews() {
    const container = $('#newsCards');
    if (!container) return;
    container.innerHTML = data.news.map(item => `
      <article class="news-card">
        <div class="news-date">${escapeHtml(item.date)}</div>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          <a class="news-source" href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.source)}</a>
        </div>
      </article>`).join('');
  }

  function renderConnections() {
    const container = $('#connectionCards');
    if (!container) return;
    container.innerHTML = data.connections.map(item => `
      <article class="brief-card">
        <span class="card-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
        <span class="connection-status">${escapeHtml(item.status)}</span>
      </article>`).join('');
  }

  function renderProject() {
    const container = $('#projectCards');
    if (!container) return;
    container.innerHTML = data.project.map((item, index) => `
      <article class="project-card">
        <p class="card-kicker">חלק ${String(index + 1).padStart(2, '0')}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>`).join('');
  }

  function renderQuestion() {
    const question = $('#dailyQuestion');
    if (question) question.textContent = data.question;
    const date = $('#editionDate');
    const generated = $('#generatedLine');
    if (date) date.textContent = data.edition.displayDate;
    if (generated) generated.textContent = data.edition.generated;
  }

  function updateClocks() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const nyTime = new Intl.DateTimeFormat('he-IL', { ...timeOptions, timeZone: 'America/New_York' }).format(now);
    const nyDate = new Intl.DateTimeFormat('he-IL', { ...dateOptions, timeZone: 'America/New_York' }).format(now);
    const jerusalemTime = new Intl.DateTimeFormat('he-IL', { ...timeOptions, timeZone: 'Asia/Jerusalem' }).format(now);
    const jerusalemDate = new Intl.DateTimeFormat('he-IL', { ...dateOptions, timeZone: 'Asia/Jerusalem' }).format(now);
    if ($('#newYorkTime')) $('#newYorkTime').textContent = nyTime;
    if ($('#newYorkDate')) $('#newYorkDate').textContent = nyDate;
    if ($('#jerusalemTime')) $('#jerusalemTime').textContent = jerusalemTime;
    if ($('#jerusalemDate')) $('#jerusalemDate').textContent = jerusalemDate;

    const hour = Number(new Intl.DateTimeFormat('en-US', { hour: '2-digit', hourCycle: 'h23', timeZone: 'America/New_York' }).format(now));
    const greeting = hour < 12 ? 'בוקר טוב, שרה' : hour < 18 ? 'אחר צהריים טובים, שרה' : 'ערב טוב, שרה';
    if ($('#greetingLine')) $('#greetingLine').textContent = greeting;
  }

  function updateMusicButton() {
    const button = $('#musicToggle');
    if (!button) return;
    if (!audio) {
      button.textContent = 'המוזיקה אינה זמינה';
      button.disabled = true;
      return;
    }
    button.textContent = audio.paused ? 'נגני מוזיקה' : 'השהי מוזיקה';
    button.setAttribute('aria-pressed', String(!audio.paused));
  }

  function setupMusic() {
    const button = $('#musicToggle');
    if (!button || !audio) {
      updateMusicButton();
      return;
    }
    button.addEventListener('click', async () => {
      if (audio.paused) {
        audio.volume = 0.24;
        try { await audio.play(); } catch {}
      } else {
        audio.pause();
      }
      updateMusicButton();
    });
    audio.addEventListener('play', updateMusicButton);
    audio.addEventListener('pause', updateMusicButton);
    audio.addEventListener('ended', updateMusicButton);
    updateMusicButton();
  }

  function preferredHebrewVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices.find(voice => /^he(-|_)/i.test(voice.lang)) || voices.find(voice => /Hebrew/i.test(voice.name)) || null;
  }

  function stopReading() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speech = null;
    if (audio && !audio.paused) audio.volume = musicVolumeBeforeSpeech;
    if ($('#readBrief')) $('#readBrief').hidden = false;
    if ($('#stopReading')) $('#stopReading').hidden = true;
  }

  function setupReading() {
    const read = $('#readBrief');
    const stop = $('#stopReading');
    if (!read || !stop || !('speechSynthesis' in window)) {
      if (read) read.hidden = true;
      return;
    }

    read.addEventListener('click', () => {
      window.speechSynthesis.cancel();
      const content = $('#briefContent');
      const text = [$('#greetingLine')?.textContent, $('.hero-copy')?.textContent, content?.innerText]
        .filter(Boolean)
        .join('. ')
        .replace(/\s+/g, ' ')
        .slice(0, 12000);

      speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'he-IL';
      speech.rate = 0.93;
      speech.pitch = 1;
      const voice = preferredHebrewVoice();
      if (voice) speech.voice = voice;

      if (audio && !audio.paused) {
        musicVolumeBeforeSpeech = audio.volume || 0.24;
        audio.volume = 0.06;
      }

      speech.onend = stopReading;
      speech.onerror = stopReading;
      read.hidden = true;
      stop.hidden = false;
      window.speechSynthesis.speak(speech);
    });

    stop.addEventListener('click', stopReading);
  }

  function init() {
    renderPriority();
    renderWeather();
    renderExercises();
    setupSteps();
    renderFood();
    renderBeach();
    renderNews();
    renderConnections();
    renderProject();
    renderQuestion();
    updateClocks();
    setupMusic();
    setupReading();
    setInterval(updateClocks, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();