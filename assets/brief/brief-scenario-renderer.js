(() => {
  'use strict';

  const scenarios = window.BRIEF_SCENARIOS;
  const presets = window.BRIEF_PRESETS;
  const memory = window.BRIEF_MEMORY;
  if (!scenarios || !presets) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function spotifyFrame(track) {
    return `https://open.spotify.com/embed/track/${encodeURIComponent(track.spotify)}?utm_source=generator&theme=0`;
  }

  function scenarioButtons(active) {
    return Object.values(presets).map(preset => `
      <button type="button" class="scenario-choice ${preset.id === active ? 'is-active' : ''}" data-scenario-choice="${escapeHtml(preset.id)}" aria-pressed="${preset.id === active}">
        <span>${escapeHtml(preset.label)}</span>
        <small>${preset.id === 'individual' ? 'One person' : preset.id === 'couple' ? 'Two private profiles + shared space' : preset.id === 'partners' ? 'UK + US operating view' : 'Coach + student progress'}</small>
      </button>
    `).join('');
  }

  function songLane(songs, heading) {
    const first = songs[0];
    return `
      <section class="scenario-music">
        <div class="scenario-subheading">
          <div><p class="micro-label">PERSONALIZED MUSIC</p><h3>${escapeHtml(heading)}</h3></div>
          <p>A connected version could choose from approved favorites, shared playlists, workout tracks or the mood the user asks for.</p>
        </div>
        <div class="scenario-song-layout">
          <div class="scenario-song-list">
            ${songs.map((song, index) => `
              <button type="button" class="scenario-song ${index === 0 ? 'is-active' : ''}" data-scenario-song="${index}">
                <span>${escapeHtml(song.note)}</span>
                <strong>${escapeHtml(song.title)}</strong>
                <small>${escapeHtml(song.artist)}</small>
              </button>
            `).join('')}
          </div>
          <iframe class="scenario-spotify-frame" title="Scenario Spotify player" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="${spotifyFrame(first)}"></iframe>
        </div>
      </section>
    `;
  }

  function renderIndividual(item) {
    return `
      <div class="scenario-intro">
        <span class="source-label source-demo">FICTIONAL PERSONAL PROFILE</span>
        <p class="micro-label">${escapeHtml(item.kicker)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
      </div>

      <div class="daily-cycle">
        ${item.dayCycle.map((phase, index) => `
          <button type="button" class="cycle-card ${index === 0 ? 'is-active' : ''}" data-cycle-index="${index}">
            <span>${escapeHtml(phase.time)}</span>
            <strong>${escapeHtml(phase.title)}</strong>
            <small>${escapeHtml(phase.text)}</small>
          </button>
        `).join('')}
      </div>

      <div class="intelligence-grid">
        ${item.intelligence.map(card => `
          <article class="intelligence-card">
            <span>${escapeHtml(card.label)}</span>
            <h3>${escapeHtml(card.title)}</h3>
            <strong>${escapeHtml(card.value)}</strong>
            <p>${escapeHtml(card.note)}</p>
          </article>
        `).join('')}
      </div>

      ${songLane(item.songs, 'A different soundtrack for focus, movement and reset.')}
    `;
  }

  function renderCouple(item) {
    return `
      <div class="scenario-intro">
        <span class="source-label source-shared">COUPLE SPACE DEMO</span>
        <p class="micro-label">${escapeHtml(item.kicker)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
      </div>

      <div class="perspective-grid">
        ${item.perspectives.map((view, index) => `
          <article class="perspective-card perspective-${index + 1}">
            <span>${escapeHtml(view.label)}</span>
            <h3>${escapeHtml(view.person)}</h3>
            <blockquote>${escapeHtml(view.text)}</blockquote>
            <small>${escapeHtml(view.privacy)}</small>
          </article>
        `).join('')}
      </div>

      <section class="mediator-panel">
        <div class="scenario-subheading">
          <div><p class="micro-label">NEUTRAL CONVERSATION GUIDE</p><h3>What the AI could do next</h3></div>
          <p>It reflects, checks, and suggests. It does not diagnose either person or decide who is morally right.</p>
        </div>
        <div class="mediator-steps">
          ${item.mediator.map(step => `
            <article>
              <span>${escapeHtml(step.step)}</span>
              <div><h4>${escapeHtml(step.title)}</h4><p>${escapeHtml(step.text)}</p></div>
            </article>
          `).join('')}
        </div>
      </section>

      <div class="relationship-columns">
        <section class="promise-panel">
          <p class="micro-label">APPROVED SHARED MEMORY</p>
          <h3>Promises that do not disappear into chat history</h3>
          ${item.promises.map(promise => `
            <article><div><strong>${escapeHtml(promise.title)}</strong><span>${escapeHtml(promise.status)}</span></div><small>${escapeHtml(promise.review)}</small></article>
          `).join('')}
        </section>
        <section class="friend-panel">
          <p class="micro-label">MEDIATOR + FRIEND POSSIBILITIES</p>
          <h3>Helpful without becoming invasive</h3>
          <ul>${item.friendActions.map(action => `<li>${escapeHtml(action)}</li>`).join('')}</ul>
        </section>
      </div>

      ${songLane(item.songs, 'Shared songs and personal favorites can live together.')}
    `;
  }

  function chartSvg(chart) {
    const width = 640;
    const height = 250;
    const padding = 26;
    const values = chart.values;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(1, max - min);
    const points = values.map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(1, values.length - 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return { x, y, value, label: chart.labels[index] };
    });
    const line = points.map(point => `${point.x},${point.y}`).join(' ');
    const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(chart.label)}">
        <defs>
          <linearGradient id="businessChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#57a8ff" stop-opacity=".34"></stop>
            <stop offset="100%" stop-color="#57a8ff" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <polyline class="chart-area" points="${area}"></polyline>
        <polyline class="chart-line" points="${line}"></polyline>
        ${points.map(point => `
          <g class="chart-point">
            <circle cx="${point.x}" cy="${point.y}" r="5"></circle>
            <text x="${point.x}" y="${point.y - 13}" text-anchor="middle">${escapeHtml(chart.prefix)}${escapeHtml(point.value)}${escapeHtml(chart.suffix)}</text>
            <text class="chart-label" x="${point.x}" y="${height - 5}" text-anchor="middle">${escapeHtml(point.label)}</text>
          </g>
        `).join('')}
      </svg>
    `;
  }

  function renderBusiness(item) {
    return `
      <div class="scenario-intro">
        <span class="source-label source-analysis">BUSINESS OPERATING DEMO</span>
        <p class="micro-label">${escapeHtml(item.kicker)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
      </div>

      <div class="dual-clock-grid">
        ${item.clocks.map(clock => `
          <article class="world-clock" data-timezone="${escapeHtml(clock.zone)}">
            <span>${escapeHtml(clock.note)}</span>
            <h3>${escapeHtml(clock.city)}</h3>
            <strong>--:--</strong>
            <small>${escapeHtml(clock.person)} · loading local date</small>
          </article>
        `).join('')}
      </div>

      <div class="kpi-grid">
        ${item.kpis.map(kpi => `
          <article class="kpi-card kpi-${escapeHtml(kpi.tone)}">
            <span>${escapeHtml(kpi.label)}</span>
            <strong>${escapeHtml(kpi.value)}</strong>
            <small>${escapeHtml(kpi.delta)}</small>
          </article>
        `).join('')}
      </div>

      <section class="business-chart-panel">
        <div class="business-chart-head">
          <div><p class="micro-label">FAKE FINANCIAL DATA · CLEARLY LABELED</p><h3 id="businessChartTitle">${escapeHtml(item.charts.revenue.label)}</h3></div>
          <div class="chart-switcher">
            <button type="button" data-business-chart="revenue" class="is-active">Revenue</button>
            <button type="button" data-business-chart="cash">Cash collected</button>
          </div>
        </div>
        <div class="business-chart" id="businessChart">${chartSvg(item.charts.revenue)}</div>
      </section>

      <div class="business-columns">
        <section class="action-register">
          <p class="micro-label">DAILY ACTION REGISTER</p>
          <h3>Every important item gets an owner</h3>
          ${item.actions.map(action => `
            <article><span>${escapeHtml(action.owner)}</span><div><strong>${escapeHtml(action.title)}</strong><small>${escapeHtml(action.due)}</small></div><em>${escapeHtml(action.status)}</em></article>
          `).join('')}
        </section>
        <section class="advice-stack">
          <p class="micro-label">OPERATING ADVICE</p>
          <h3>Explain the numbers like a partner, not a spreadsheet</h3>
          ${item.advice.map(advice => `<article><strong>${escapeHtml(advice.title)}</strong><p>${escapeHtml(advice.text)}</p></article>`).join('')}
        </section>
      </div>

      <section class="business-news">
        <div class="scenario-subheading">
          <div><p class="micro-label">PERSONALIZED BUSINESS NEWS</p><h3>News includes external events and internal changes</h3></div>
          <p>These examples are fictional. A live version would use verified public sources and approved internal records.</p>
        </div>
        <div>${item.news.map((story, index) => `<article><span>0${index + 1}</span><div><small>${escapeHtml(story.label)}</small><h4>${escapeHtml(story.title)}</h4><p>${escapeHtml(story.text)}</p></div></article>`).join('')}</div>
      </section>

      ${songLane(item.songs, 'Music can match an operating review, deep work or the reset afterward.')}
    `;
  }

  function renderTrainer(item) {
    return `
      <div class="scenario-intro">
        <span class="source-label source-connected">COACHING SPACE DEMO</span>
        <p class="micro-label">${escapeHtml(item.kicker)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
      </div>

      <div class="people-space-grid">
        ${item.people.map(person => `
          <article>
            <span>${escapeHtml(person.role)}</span>
            <h3>${escapeHtml(person.name)}</h3>
            <p><strong>Can see:</strong> ${escapeHtml(person.sees)}</p>
            <p><strong>Stays private:</strong> ${escapeHtml(person.private)}</p>
          </article>
        `).join('')}
      </div>

      <section class="habit-panel">
        <div class="scenario-subheading">
          <div><p class="micro-label">GOALS + HABITS + PATTERNS</p><h3>Tap a habit to see what the AI actually inferred</h3></div>
          <p>Patterns are suggestions with evidence. The student can correct or reject them.</p>
        </div>
        <div class="habit-grid">
          ${item.habits.map((habit, index) => `
            <button type="button" class="habit-card ${index === 0 ? 'is-active' : ''}" data-habit-index="${index}">
              <span>${escapeHtml(habit.label)}</span>
              <strong>${escapeHtml(habit.display)}</strong>
              <div><i style="width:${Math.max(0, Math.min(100, Number(habit.value)))}%"></i></div>
            </button>
          `).join('')}
        </div>
        <p class="habit-insight" id="habitInsight">${escapeHtml(item.habits[0].insight)}</p>
      </section>

      <div class="trainer-columns">
        <section class="pattern-list">
          <p class="micro-label">AI PATTERN REVIEW</p>
          <h3>Evidence before confidence</h3>
          ${item.patterns.map(pattern => `
            <article><span>${escapeHtml(pattern.status)}</span><h4>${escapeHtml(pattern.title)}</h4><p>${escapeHtml(pattern.evidence)}</p><small>${escapeHtml(pattern.action)}</small></article>
          `).join('')}
        </section>
        <section class="note-stream">
          <p class="micro-label">TRACKING + NOTES + AI INPUT</p>
          <h3>Different sources stay labeled</h3>
          ${item.notes.map(note => `
            <article><div><strong>${escapeHtml(note.source)}</strong><span>${escapeHtml(note.state)}</span></div><p>${escapeHtml(note.text)}</p></article>
          `).join('')}
        </section>
      </div>

      ${songLane(item.songs, 'A trainer can recommend energy without controlling the student’s whole library.')}
    `;
  }

  function renderScenario(id) {
    const item = scenarios[id] || scenarios.individual;
    const stage = $('#scenarioStage');
    if (!stage) return;
    stage.innerHTML = id === 'couple' ? renderCouple(item) : id === 'partners' ? renderBusiness(item) : id === 'trainer' ? renderTrainer(item) : renderIndividual(item);
    $('#scenarioSelector').innerHTML = scenarioButtons(id);
    bindScenarioInteractions(id, item, stage);
    updateScenarioClocks();
  }

  function bindSongLane(root, songs) {
    const frame = $('.scenario-spotify-frame', root);
    $$('[data-scenario-song]', root).forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.scenarioSong);
        const track = songs[index];
        $$('[data-scenario-song]', root).forEach(item => item.classList.remove('is-active'));
        button.classList.add('is-active');
        frame.src = spotifyFrame(track);
      });
    });
  }

  function bindScenarioInteractions(id, item, stage) {
    $$('[data-scenario-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const next = button.dataset.scenarioChoice;
        if (window.BRIEF_APP?.setPreset) window.BRIEF_APP.setPreset(next);
        else renderScenario(next);
      });
    });

    if (id === 'individual') {
      $$('[data-cycle-index]', stage).forEach(button => {
        button.addEventListener('click', () => {
          $$('[data-cycle-index]', stage).forEach(card => card.classList.remove('is-active'));
          button.classList.add('is-active');
        });
      });
    }

    if (id === 'partners') {
      $$('[data-business-chart]', stage).forEach(button => {
        button.addEventListener('click', () => {
          const key = button.dataset.businessChart;
          $$('[data-business-chart]', stage).forEach(item => item.classList.remove('is-active'));
          button.classList.add('is-active');
          $('#businessChartTitle').textContent = item.charts[key].label;
          $('#businessChart').innerHTML = chartSvg(item.charts[key]);
        });
      });
    }

    if (id === 'trainer') {
      $$('[data-habit-index]', stage).forEach(button => {
        button.addEventListener('click', () => {
          const index = Number(button.dataset.habitIndex);
          $$('[data-habit-index]', stage).forEach(card => card.classList.remove('is-active'));
          button.classList.add('is-active');
          $('#habitInsight').textContent = item.habits[index].insight;
        });
      });
    }

    bindSongLane(stage, item.songs || []);
  }

  function updateScenarioClocks() {
    $$('.world-clock[data-timezone]').forEach(card => {
      const zone = card.dataset.timezone;
      const now = new Date();
      card.querySelector('strong').textContent = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit' }).format(now);
      const small = card.querySelector('small');
      const person = small.textContent.split(' · ')[0];
      const date = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' }).format(now);
      small.textContent = `${person} · ${date}`;
    });
  }

  function renderEducation() {
    const education = scenarios.education;

    $('#dailyRhythmGrid').innerHTML = education.dailyRhythm.map(item => `
      <article><span>${escapeHtml(item.label)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>
    `).join('');

    $('#learningSteps').innerHTML = education.learning.map((item, index) => `
      <button type="button" class="learning-step ${index === 0 ? 'is-active' : ''}" data-learning-index="${index}">
        <span>${escapeHtml(item.label)}</span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)}</small></div>
      </button>
    `).join('');
    $('#learningExplanation').textContent = education.learning[0].text;

    $$('[data-learning-index]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.learningIndex);
        $$('[data-learning-index]').forEach(item => item.classList.remove('is-active'));
        button.classList.add('is-active');
        $('#learningExplanation').textContent = education.learning[index].text;
      });
    });

    $('#memoryChoiceGrid').innerHTML = education.memoryChoices.map(choice => `
      <button type="button" data-memory-choice="${escapeHtml(choice.action)}"><strong>${escapeHtml(choice.action)}</strong><span>${escapeHtml(choice.text)}</span></button>
    `).join('');
    $('#memoryChoiceResult').textContent = 'Choose what should happen to a suggested memory.';
    $$('[data-memory-choice]').forEach(button => {
      button.addEventListener('click', () => {
        $('#memoryChoiceResult').textContent = `${button.dataset.memoryChoice}: ${button.querySelector('span').textContent}`;
      });
    });

    const groups = ['all', ...new Set(education.capabilities.map(item => item.group))];
    $('#capabilityFilters').innerHTML = groups.map((group, index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}" data-capability-filter="${escapeHtml(group)}">${group === 'all' ? 'Everything' : escapeHtml(group)}</button>`).join('');
    renderCapabilities('all');

    $$('[data-capability-filter]').forEach(button => {
      button.addEventListener('click', () => {
        $$('[data-capability-filter]').forEach(item => item.classList.remove('is-active'));
        button.classList.add('is-active');
        renderCapabilities(button.dataset.capabilityFilter);
      });
    });

    $('#comparisonGrid').innerHTML = education.comparison.map(side => `
      <article><span>${escapeHtml(side.side)}</span><ul>${side.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
    `).join('');

    $('#backendFlow').innerHTML = education.backendFlow.map((item, index) => `
      <div><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item)}</strong></div>${index < education.backendFlow.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
    `).join('');

    $('#memoryRecordList').innerHTML = (memory?.records || []).map(record => `
      <article>
        <span>${escapeHtml(record.category)}</span>
        <strong>${escapeHtml(record.key.replaceAll('_', ' '))}</strong>
        <p>${escapeHtml(record.value)}</p>
        <small>${escapeHtml(record.confidence)} · ${escapeHtml(record.visibility)} · ${escapeHtml(record.retention)}</small>
      </article>
    `).join('');
  }

  function renderCapabilities(filter) {
    const values = scenarios.education.capabilities.filter(item => filter === 'all' || item.group === filter);
    $('#capabilityGrid').innerHTML = values.map(item => `
      <article><span>${escapeHtml(item.group)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>
    `).join('');
  }

  function init() {
    const storagePrefix = window.BRIEF_CONFIG?.storagePrefix || 'cmxBriefDemo';
    const current = window.BRIEF_APP?.getPreset?.() || localStorage.getItem(`${storagePrefix}:preset`) || 'individual';
    renderScenario(current);
    renderEducation();
    window.addEventListener('brief:preset-change', event => renderScenario(event.detail.preset));
    window.setInterval(updateScenarioClocks, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();