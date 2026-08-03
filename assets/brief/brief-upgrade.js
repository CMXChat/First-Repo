(() => {
  'use strict';

  const OFFICIAL_YOUTUBE_ID = 'YF1R0hc5Q2I';
  const SPOTIFY_TRACK_ID = '1prZ0pr6XoRCxcrC3MCL0M';
  const labels = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer + student'
  };

  const state = {
    initialized: false,
    youtubePlaying: false,
    youtubeReady: false,
    youtubeVolume: 30,
    knowledgeScore: 24,
    adaptiveFocus: 'today',
    selectedVoice: 'calm',
    selectedModel: 'balanced'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function appReady() {
    return Boolean(window.BRIEF_APP && $('#entryGate') && $('#scenarioExplorer'));
  }

  function notify(message) {
    if (window.BRIEF_APP?.showToast) window.BRIEF_APP.showToast(message);
  }

  function selectedPreset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function officialVideoUrl(autoplay = false) {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: '1',
      playsinline: '1',
      enablejsapi: '1',
      loop: '1',
      playlist: OFFICIAL_YOUTUBE_ID,
      rel: '0',
      modestbranding: '1',
      origin: window.location.origin
    });
    return `https://www.youtube-nocookie.com/embed/${OFFICIAL_YOUTUBE_ID}?${params.toString()}`;
  }

  function spotifyUrl(trackId = SPOTIFY_TRACK_ID) {
    return `https://open.spotify.com/embed/track/${encodeURIComponent(trackId)}?utm_source=generator&theme=0`;
  }

  function youtubeCommand(func, args = []) {
    const frame = $('#youtubeFeaturedFrame');
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  }

  function listenToYoutube() {
    const frame = $('#youtubeFeaturedFrame');
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'youtubeFeaturedFrame' }), '*');
    youtubeCommand('setVolume', [state.youtubeVolume]);
  }

  function updateMusicButtons() {
    const icon = $('#musicPreviewButton span');
    const label = $('#musicPreviewButton b');
    if (icon) icon.textContent = state.youtubePlaying ? '❚❚' : '▶';
    if (label) label.textContent = state.youtubePlaying ? 'Pause official song' : 'Play official song';
    $('#musicPreviewButton')?.setAttribute('aria-pressed', String(state.youtubePlaying));
    $('#audioButton')?.classList.toggle('is-active', state.youtubePlaying);
    $('#audioButton')?.setAttribute('aria-label', state.youtubePlaying ? 'Pause today’s song' : 'Play today’s song');
  }

  function startOfficialSong() {
    ensureMusicProviders();
    const frame = $('#youtubeFeaturedFrame');
    if (!frame) return;

    if (!frame.dataset.started) {
      frame.dataset.started = 'true';
      frame.src = officialVideoUrl(true);
    } else {
      youtubeCommand('setVolume', [state.youtubeVolume]);
      youtubeCommand('playVideo');
    }

    state.youtubePlaying = true;
    updateMusicButtons();
    const note = $('#musicPreviewNote');
    if (note) note.textContent = 'Starting the official song player. If the browser refuses automatic sound, press play inside the visible video player below.';
  }

  function pauseOfficialSong() {
    youtubeCommand('pauseVideo');
    state.youtubePlaying = false;
    updateMusicButtons();
  }

  function toggleOfficialSong() {
    if (state.youtubePlaying) pauseOfficialSong();
    else startOfficialSong();
  }

  function duckForNarration() {
    state.youtubeVolume = 8;
    youtubeCommand('setVolume', [8]);
    window.setTimeout(() => {
      const timer = window.setInterval(() => {
        if (!('speechSynthesis' in window) || (!window.speechSynthesis.speaking && !window.speechSynthesis.pending)) {
          window.clearInterval(timer);
          state.youtubeVolume = 30;
          youtubeCommand('setVolume', [30]);
        }
      }, 400);
      window.setTimeout(() => {
        window.clearInterval(timer);
        state.youtubeVolume = 30;
        youtubeCommand('setVolume', [30]);
      }, 90000);
    }, 900);
  }

  function ensureMusicProviders() {
    const panel = $('.spotify-embed-panel');
    if (!panel || panel.dataset.upgraded === 'true') return;
    panel.dataset.upgraded = 'true';
    panel.classList.add('music-provider-host');
    panel.innerHTML = `
      <div class="spotify-panel-top">
        <div><span class="source-label source-connected">REAL PLAYERS</span><strong id="spotifyNowLabel">Everywhere · Fleetwood Mac</strong></div>
        <span class="micro-label">OFFICIAL VIDEO + SPOTIFY</span>
      </div>
      <div class="music-provider-grid">
        <article class="music-provider-card youtube">
          <header><strong>Official song player</strong><span>Reliable fallback</span></header>
          <iframe id="youtubeFeaturedFrame" title="Fleetwood Mac Everywhere official music video" loading="eager" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <p>This player is used for the actual song. Entry playback begins only after the user presses the button.</p>
        </article>
        <article class="music-provider-card spotify">
          <header><strong>Spotify player</strong><span>Provider demo</span></header>
          <iframe id="spotifyFeaturedFrame" title="Spotify featured track player" loading="eager" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="${spotifyUrl()}"></iframe>
          <p>The Spotify embed is always visible. Full playback depends on Spotify availability, account state and regional rules.</p>
        </article>
      </div>
      <p class="music-preview-fallback">The old external preview is no longer the only playback route. The official video remains playable even when a preview file expires or a browser blocks background audio.</p>
    `;

    const youtube = $('#youtubeFeaturedFrame');
    youtube.src = officialVideoUrl(false);
    youtube.addEventListener('load', () => {
      state.youtubeReady = true;
      listenToYoutube();
      window.setTimeout(listenToYoutube, 700);
    });

    const previewNote = $('#musicPreviewNote');
    if (previewNote) previewNote.textContent = 'Use the official player below. The Spotify embed is visible beside it.';
    const previewButton = $('#musicPreviewButton');
    if (previewButton) previewButton.disabled = false;
    updateMusicButtons();
  }

  function handleYoutubeMessage(event) {
    const frame = $('#youtubeFeaturedFrame');
    if (!frame || event.source !== frame.contentWindow) return;
    let payload = event.data;
    try {
      if (typeof payload === 'string') payload = JSON.parse(payload);
    } catch {
      return;
    }
    if (!payload || typeof payload !== 'object') return;
    const playerState = payload.info?.playerState ?? (typeof payload.info === 'number' ? payload.info : null);
    if (payload.event === 'onReady' || payload.event === 'initialDelivery') {
      state.youtubeReady = true;
      listenToYoutube();
    }
    if (typeof playerState === 'number') {
      if (playerState === 1) state.youtubePlaying = true;
      if ([0, 2, -1].includes(playerState)) state.youtubePlaying = false;
      updateMusicButtons();
    }
  }

  function requireScenarioChoice() {
    const select = $('#profileSelect');
    const enter = $('#enterBrief');
    const field = select?.closest('.profile-field');
    const copy = $('.gate-copy');
    if (!select || !enter || select.dataset.requiredChoice === 'true') return;
    select.dataset.requiredChoice = 'true';
    select.setAttribute('required', '');
    field?.classList.add('is-required');

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.textContent = 'Choose the briefing you want to explore';
    select.insertBefore(placeholder, select.firstChild);

    if (copy) {
      copy.textContent = 'This product demo shows how one private platform can organize personal life, support complex relationships, coordinate shared spaces, and turn approved data into timely guidance and action.';
    }

    const note = document.createElement('p');
    note.className = 'gate-selection-note';
    note.id = 'gateSelectionNote';
    note.textContent = 'Choose a version before continuing. You can switch between all four inside the briefing.';
    field?.appendChild(note);
    select.setAttribute('aria-describedby', 'gateSelectionNote');

    const reset = () => {
      select.value = '';
      enter.disabled = true;
      enter.setAttribute('aria-disabled', 'true');
    };
    window.setTimeout(reset, 0);

    select.addEventListener('change', () => {
      const valid = Boolean(select.value);
      enter.disabled = !valid;
      enter.setAttribute('aria-disabled', String(!valid));
      if (valid) note.textContent = `${labels[select.value] || 'Selected'} demo selected. You can change it at any time inside.`;
    });

    enter.addEventListener('click', event => {
      if (!select.value) {
        event.preventDefault();
        event.stopImmediatePropagation();
        note.textContent = 'Choose one of the four briefing examples first.';
        select.focus();
        return;
      }

      const musicOption = $('#musicOnEntry');
      const shouldStartMusic = Boolean(musicOption?.checked);
      if (shouldStartMusic) startOfficialSong();
      if (musicOption) {
        musicOption.checked = false;
        window.setTimeout(() => { musicOption.checked = shouldStartMusic; }, 0);
      }
      if ($('#readOnEntry')?.checked) duckForNarration();
    }, true);
  }

  function installMusicCapture() {
    const handler = event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleOfficialSong();
    };
    $('#audioButton')?.addEventListener('click', handler, true);
    $('#musicPreviewButton')?.addEventListener('click', handler, true);
    $('#readButton')?.addEventListener('click', () => duckForNarration(), true);
  }

  function createScenarioDock() {
    if ($('#scenarioDock')) return;
    const dock = document.createElement('aside');
    dock.className = 'scenario-dock';
    dock.id = 'scenarioDock';
    dock.setAttribute('aria-label', 'Switch briefing demonstration');
    dock.innerHTML = `
      <div class="scenario-dock-label"><span>Viewing demo</span><strong id="scenarioDockCurrent">${labels[selectedPreset()]}</strong></div>
      <div class="scenario-dock-buttons">
        ${Object.entries(labels).map(([id, label]) => `<button type="button" data-dock-preset="${id}">${escapeHtml(label)}</button>`).join('')}
      </div>
    `;
    document.body.appendChild(dock);

    const update = preset => {
      $('#scenarioDockCurrent').textContent = labels[preset] || 'Personal';
      $$('[data-dock-preset]').forEach(button => button.classList.toggle('is-active', button.dataset.dockPreset === preset));
    };

    $$('[data-dock-preset]').forEach(button => {
      button.addEventListener('click', () => {
        const preset = button.dataset.dockPreset;
        window.BRIEF_APP.setPreset(preset);
        $('#profileSelect').value = preset;
        update(preset);
        notify(`Switched the entire briefing to the ${labels[preset].toLowerCase()} example.`);
      });
    });

    window.addEventListener('brief:preset-change', event => update(event.detail?.preset || selectedPreset()));
    update(selectedPreset());
  }

  const strategyData = {
    individual: {
      title: 'Personal strategy from money, messages and current projects',
      note: 'Fictional personal data. A real version would require approved financial, email and task connections.',
      metrics: [
        ['Available cash', '$18,400', 'Personal demo'],
        ['Expected income', '$7,800', 'Next 30 days'],
        ['Bills due', '$2,160', 'Next 14 days'],
        ['Savings rate', '18%', 'Current pattern']
      ],
      seriesA: [4.6, 5.2, 5.8, 6.4, 7.1, 7.8],
      seriesB: [4.2, 4.5, 4.9, 5.1, 5.3, 5.6],
      legendA: 'Income',
      legendB: 'Spending',
      donut: [['Housing', '38%'], ['Business tools', '25%'], ['Living', '19%'], ['Flexible', '18%']],
      emails: [
        ['Reply', 'Client approved the revised scope', 'Acknowledge and confirm start date.', '12 min'],
        ['Review', 'Insurance renewal notice', 'Price increased by 11%.', 'Today'],
        ['Low', 'Weekly industry digest', 'No action required.', 'Later']
      ],
      projects: [
        ['Active', 'Portfolio refresh', '2 decisions remain', '72%'],
        ['Waiting', 'Client launch', 'Needs final assets', '58%'],
        ['Personal', 'Resume applications', 'Send one today', '25%']
      ],
      actions: [
        ['Cash', 'Invoice before polishing more', 'The next invoice has more immediate value than another design pass.'],
        ['Email', 'Answer the approved scope', 'A short confirmation closes an open loop.'],
        ['Project', 'Ship one visible result', 'Momentum improves when progress leaves the private workspace.']
      ]
    },
    couple: {
      title: 'Shared strategy without exposing either person’s private account',
      note: 'Fictional couple finances and messages. Only approved shared records belong here.',
      metrics: [
        ['Shared balance', '$6,850', 'Joint demo space'],
        ['Trip fund', '$3,200', '68% funded'],
        ['Shared bills', '$1,940', 'This month'],
        ['Unassigned plans', '3', 'Need an owner']
      ],
      seriesA: [1.8, 2.0, 2.3, 2.6, 2.9, 3.2],
      seriesB: [1.5, 1.7, 1.9, 2.2, 2.5, 2.7],
      legendA: 'Trip savings',
      legendB: 'Trip commitment',
      donut: [['Home', '38%'], ['Travel', '25%'], ['Food', '19%'], ['Shared fun', '18%']],
      emails: [
        ['Shared', 'Hotel price hold expires tonight', 'Both approved the destination.', '6 hours'],
        ['Maya', 'Vet appointment confirmation', 'Private until shared.', 'Tomorrow'],
        ['Jordan', 'Work travel changed', 'May affect Friday dinner.', 'New']
      ],
      projects: [
        ['Trip', 'Book weekend train', 'Choose by 8 PM', '70%'],
        ['Home', 'Call the landlord', 'Jordan owns next step', '45%'],
        ['Ritual', 'Sunday planning call', 'Recurring shared action', '100%']
      ],
      actions: [
        ['Mediator', 'Ask for reassurance before logistics', 'The shared history suggests emotional clarity should come before planning.'],
        ['Money', 'Agree on the trip ceiling', 'One number prevents the same argument from returning later.'],
        ['Memory', 'Confirm the promise before saving it', 'Both people should approve the wording and visibility.']
      ]
    },
    partners: {
      title: 'A fake operating strategy built from recent finances, inbox and delivery risk',
      note: 'All company names, transactions, projects and figures are fictional demonstrations.',
      metrics: [
        ['Revenue MTD', '£84,200', '+12.4% vs plan'],
        ['Gross margin', '42%', 'Target 45%'],
        ['Cash available', '£126,400', 'Before collections'],
        ['Overdue invoices', '£18,600', 'Three accounts']
      ],
      seriesA: [58, 63, 69, 72, 78, 84.2],
      seriesB: [49, 55, 57, 61, 67, 71],
      legendA: 'Revenue',
      legendB: 'Cash collected',
      donut: [['Delivery', '38%'], ['Payroll', '25%'], ['Acquisition', '19%'], ['Operations', '18%']],
      emails: [
        ['Urgent', 'Redwood renewal asks for revised terms', '£9,400 MRR is exposed.', '48 hours'],
        ['Cash', 'Three overdue invoice reminders', 'One has no assigned owner.', 'Today'],
        ['Decision', 'UK contractor requests conversion', 'Margin impact needs review.', 'Thursday']
      ],
      projects: [
        ['At risk', 'Apollo client launch', 'Scope changed twice', '61%'],
        ['Healthy', 'Northstar reporting rebuild', 'On plan', '82%'],
        ['Decision', 'London hire', 'Waiting on runway scenario', '35%']
      ],
      actions: [
        ['Collections', 'Assign the £18,600 today', 'Cash risk is operational until every overdue account has an owner and next contact.'],
        ['Margin', 'Price the Apollo scope change', 'The project is growing faster than the commercial agreement.'],
        ['Hiring', 'Delay the permanent hire one week', 'Collect first, then decide with a cleaner runway view.']
      ]
    },
    trainer: {
      title: 'A coaching strategy built from habits, messages and training evidence',
      note: 'Fictional wellness data. A real version would require explicit health and coach-sharing permissions.',
      metrics: [
        ['Sessions', '7 / 9', 'Past three weeks'],
        ['Sleep', '6.8 h', 'Rolling average'],
        ['Steps', '8,420', 'Daily average'],
        ['Strength trend', '+12%', 'Six-week demo']
      ],
      seriesA: [62, 65, 69, 72, 76, 79],
      seriesB: [58, 60, 64, 67, 71, 74],
      legendA: 'Training readiness',
      legendB: 'Session completion',
      donut: [['Strength', '38%'], ['Recovery', '25%'], ['Movement', '19%'], ['Nutrition', '18%']],
      emails: [
        ['Student', 'Knee felt fine during the walk', 'Specific correction to an old broad note.', 'New'],
        ['Coach', 'Reduce Thursday volume by one set', 'Draft programming change.', 'Review'],
        ['App', 'Sleep average improved', 'Pattern confidence increased.', 'This week']
      ],
      projects: [
        ['Habit', 'Three sessions weekly', 'Two completed', '67%'],
        ['Goal', 'Ten full pushups', 'Current best: seven', '70%'],
        ['Recovery', 'Seven-hour sleep floor', 'Four of seven nights', '57%']
      ],
      actions: [
        ['Training', 'Keep the next session simple', 'Consistency is the stronger signal than adding novelty.'],
        ['Correction', 'Remove the broad knee assumption', 'Keep only the movement-specific note the student confirmed.'],
        ['Coach', 'Ask before changing the plan', 'A pattern can suggest a change. The coach and student still approve it.']
      ]
    }
  };

  function points(values, width = 660, height = 220, pad = 24) {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return values.map((value, index) => {
      const x = pad + index * ((width - pad * 2) / Math.max(1, values.length - 1));
      const y = height - pad - ((value - min) / range) * (height - pad * 2);
      return [x, y];
    });
  }

  function linePath(values) {
    return points(values).map(([x, y], index) => `${index ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  }

  function dots(values, className) {
    return points(values).map(([x, y]) => `<circle class="${className}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"></circle>`).join('');
  }

  function renderStrategy(preset = selectedPreset()) {
    const root = $('#strategyLabContent');
    const data = strategyData[preset] || strategyData.individual;
    if (!root) return;

    root.innerHTML = `
      <div class="strategy-shell">
        <div class="section-heading">
          <div><p class="micro-label">SELECTED EXAMPLE · ${escapeHtml(labels[preset] || 'PERSONAL')}</p><h2>${escapeHtml(data.title)}</h2></div>
          <p>${escapeHtml(data.note)}</p>
        </div>
        <div class="strategy-summary-grid">
          ${data.metrics.map(([label, value, note]) => `<article class="strategy-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`).join('')}
        </div>
        <div class="strategy-grid">
          <article class="strategy-panel">
            <h3>Six-period direction</h3>
            <p>The briefing can explain movement and risk, not only display numbers.</p>
            <svg class="strategy-chart" viewBox="0 0 660 220" role="img" aria-label="Fictional trend chart">
              <line class="grid-line" x1="24" y1="55" x2="636" y2="55"></line>
              <line class="grid-line" x1="24" y1="110" x2="636" y2="110"></line>
              <line class="grid-line" x1="24" y1="165" x2="636" y2="165"></line>
              <path class="line-primary" d="${linePath(data.seriesA)}"></path>
              <path class="line-secondary" d="${linePath(data.seriesB)}"></path>
              ${dots(data.seriesA, 'dot-primary')}
              ${dots(data.seriesB, 'dot-secondary')}
            </svg>
            <div class="strategy-legend"><span><i></i>${escapeHtml(data.legendA)}</span><span class="violet"><i></i>${escapeHtml(data.legendB)}</span></div>
          </article>
          <article class="strategy-panel">
            <h3>Where attention is going</h3>
            <p>A visual split can expose imbalance before it becomes a surprise.</p>
            <div class="strategy-donut-wrap">
              <div class="strategy-donut" aria-hidden="true"></div>
              <div class="strategy-legend-list">${data.donut.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>
            </div>
            ${preset === 'partners' ? `
              <div class="scenario-controls">
                <label>Expected overdue collections this month <strong id="collectionValue">65%</strong><input id="collectionSlider" type="range" min="0" max="100" value="65"></label>
                <label class="scenario-toggle"><input id="hireToggle" type="checkbox"> Include a fictional £6,500 hiring cost this month</label>
              </div>
              <div class="strategy-result" id="strategyResult"></div>
            ` : '<div class="strategy-result"><strong>Interpretation:</strong> the system can combine current numbers with goals, commitments and risk tolerance to recommend the next useful decision.</div>'}
          </article>
        </div>
        <div class="inbox-project-grid">
          <article class="strategy-panel"><h3>Inbox intelligence</h3><p>Summaries stay linked to a source and never send without confirmation.</p><div class="compact-list">${data.emails.map(([tag, title, note, time]) => `<article class="compact-row"><span>${escapeHtml(tag)}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(note)}</p></div><small>${escapeHtml(time)}</small></article>`).join('')}</div></article>
          <article class="strategy-panel"><h3>Projects and commitments</h3><p>The briefing connects work to owners, deadlines and previous decisions.</p><div class="compact-list">${data.projects.map(([tag, title, note, progress]) => `<article class="compact-row"><span>${escapeHtml(tag)}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(note)}</p></div><small>${escapeHtml(progress)}</small></article>`).join('')}</div></article>
        </div>
        <div class="strategy-actions">${data.actions.map(([label, title, text]) => `<article class="strategy-action"><span>${escapeHtml(label)}</span><h4>${escapeHtml(title)}</h4><p>${escapeHtml(text)}</p></article>`).join('')}</div>
      </div>
    `;

    if (preset === 'partners') setupRunwayScenario();
  }

  function setupRunwayScenario() {
    const slider = $('#collectionSlider');
    const hire = $('#hireToggle');
    const output = $('#strategyResult');
    const update = () => {
      const percent = Number(slider.value);
      const collection = 18600 * (percent / 100);
      const hireCost = hire.checked ? 6500 : 0;
      const cash = 126400 + collection - hireCost;
      const monthlyOutflow = 42500;
      const runway = cash / monthlyOutflow;
      $('#collectionValue').textContent = `${percent}%`;
      output.innerHTML = `<strong>Fake scenario:</strong> collecting £${Math.round(collection).toLocaleString('en-GB')}${hire.checked ? ' and making the hire' : ''} leaves roughly <strong>${runway.toFixed(1)} months</strong> of cash at the current outflow. ${runway < 3.2 ? 'The safer move is to collect first and delay fixed cost.' : 'The hiring decision is more defensible, but margin and delivery capacity still need review.'}`;
    };
    slider.addEventListener('input', update);
    hire.addEventListener('change', update);
    update();
  }

  function insertStrategyLab() {
    if ($('#strategyLab')) return;
    const section = document.createElement('section');
    section.className = 'brief-section expansion-section';
    section.id = 'strategyLab';
    section.setAttribute('aria-labelledby', 'strategyLabTitle');
    section.innerHTML = `
      <div class="section-heading">
        <div><p class="micro-label">FAKE DATA · REAL PRODUCT POSSIBILITY</p><h2 id="strategyLabTitle">Strategy should emerge from the person’s current reality.</h2></div>
        <p>Switch examples to see finances, emails, projects, patterns and advice change together.</p>
      </div>
      <div id="strategyLabContent"></div>
    `;
    $('#scenarioExplorer').insertAdjacentElement('afterend', section);
    renderStrategy();
    window.addEventListener('brief:preset-change', event => renderStrategy(event.detail?.preset || selectedPreset()));
  }

  function adaptiveModules() {
    return [
      ['today', 'What changed now', 'A delayed meeting, payment, message or weather alert can become the largest module because it changes the next decision.', 'REAL-TIME DATA'],
      ['money', 'Money that needs attention', 'Cash, bills, revenue, subscriptions and risk can move forward only when they matter today.', 'FINANCES'],
      ['relationship', 'People and shared context', 'The page can give more space to a repair, promise, trip or family responsibility when that becomes the real priority.', 'SHARED SPACE'],
      ['health', 'Energy and physical reality', 'Sleep, weather, symptoms, training and recovery can change the schedule instead of sitting in a separate health tab.', 'HEALTH'],
      ['work', 'Projects, inbox and decisions', 'A critical email or project risk can become a briefing action with an owner and approval step.', 'WORK'],
      ['news', 'Research that fits the user', 'News selection can follow approved interests, profession, location, risk exposure and preferred depth.', 'RESEARCH']
    ];
  }

  function renderAdaptiveBoard(focus = state.adaptiveFocus) {
    const root = $('#adaptiveBoard');
    if (!root) return;
    state.adaptiveFocus = focus;
    root.innerHTML = adaptiveModules().map(([id, title, text, label]) => `
      <article class="adaptive-module ${id === focus ? 'is-primary' : ''}" data-adaptive-id="${id}">
        <span>${escapeHtml(label)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><small>${id === focus ? 'The page gives this more room because it matters most now.' : 'Still available, but visually quieter until it matters.'}</small>
      </article>
    `).join('');
    $$('[data-adaptive-focus]').forEach(button => button.classList.toggle('is-active', button.dataset.adaptiveFocus === focus));
  }

  function voicePreview(style) {
    state.selectedVoice = style;
    $$('.voice-lab button').forEach(button => button.classList.toggle('is-active', button.dataset.voiceStyle === style));
    if (!('speechSynthesis' in window)) {
      notify('This browser does not expose speech synthesis.');
      return;
    }
    const copy = {
      calm: ['Good morning. Your weather is clear, your first meeting starts at nine, and one invoice needs attention.', 0.92, 0.95],
      warm: ['Good morning. You have a manageable day ahead, and the first useful step is already waiting for you.', 0.9, 1.08],
      analyst: ['Operating brief. Revenue is ahead of plan. Collections and project margin require review.', 1.0, 0.9],
      coach: ['Today is simple. Finish the first set, protect recovery, and let consistency do the impressive part.', 1.03, 1.12]
    }[style] || [];
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(copy[0]);
    utterance.rate = copy[1];
    utterance.pitch = copy[2];
    window.speechSynthesis.speak(utterance);
  }

  function insertFutureSection() {
    if ($('#futurePlatform')) return;
    const section = document.createElement('section');
    section.className = 'brief-section expansion-section';
    section.id = 'futurePlatform';
    section.setAttribute('aria-labelledby', 'futurePlatformTitle');
    section.innerHTML = `
      <div class="expansion-hero">
        <span class="source-label source-analysis">WHAT THIS IS PREPARING FOR</span>
        <p class="micro-label">THE DASHBOARD FOLLOWS THE DAY</p>
        <h2 id="futurePlatformTitle">The content can design the briefing. The user should not have to design a dashboard first.</h2>
        <p>A mature version could assemble the right layout from real-time information, approved memory, current research and the user’s preferences. Today this remains a front-end product demonstration with fictional data and a few real media embeds.</p>
        <div class="reality-strip">
          <article><span>NOW</span><strong>Beautiful static concept</strong><p>Interactive examples, local preferences, real embeds and scheduled repository updates.</p></article>
          <article><span>NEXT BACKEND</span><strong>Approved live connections</strong><p>Python, FastAPI, databases, scheduled jobs, account permissions and confirmed actions.</p></article>
          <article><span>AT SCALE</span><strong>Adaptive personal interface</strong><p>The briefing can change structure, voice, depth and tools around the actual day.</p></article>
        </div>
      </div>

      <div class="section-heading">
        <div><p class="micro-label">INTERACTIVE LAYOUT EXAMPLE</p><h2>Choose what suddenly matters.</h2></div>
        <p>The same modules remain available, but the page can change hierarchy without losing the user’s preferred visual language.</p>
      </div>
      <div class="adaptive-controls">
        ${[['today','Breaking change'],['money','Money'],['relationship','Relationship'],['health','Health'],['work','Work'],['news','News']].map(([id,label]) => `<button type="button" data-adaptive-focus="${id}">${label}</button>`).join('')}
      </div>
      <div class="adaptive-board" id="adaptiveBoard"></div>

      <div class="future-details-grid">
        <details class="future-details" open>
          <summary>Voice, music, alarms and an app</summary>
          <div><p>A future app could wake the user with an approved Spotify song, then read the briefing using a high-quality licensed neural voice. Custom or recognizable voices would require consent and the provider’s rules.</p><div class="voice-lab">${[['calm','Calm guide'],['warm','Warm friend'],['analyst','Analyst'],['coach','Coach']].map(([id,label]) => `<button type="button" data-voice-style="${id}">${label}</button>`).join('')}</div></div>
        </details>
        <details class="future-details">
          <summary>Switching AI models without losing the person</summary>
          <div><p>The personalization layer can stay stable while different models handle different jobs. A fast model may summarize email, a deeper model may reason through strategy, and a private model may handle sensitive local work.</p><div class="model-lab">${[['fast','Fast daily'],['balanced','Balanced'],['deep','Deep reasoning'],['private','Private/local']].map(([id,label]) => `<button type="button" data-model-style="${id}">${label}</button>`).join('')}</div></div>
        </details>
        <details class="future-details">
          <summary>MCP, APIs, RAG and research in normal language</summary>
          <div><div class="tech-plain-grid">
            <article class="tech-plain-card"><span>MCP</span><h4>A standard plug shape</h4><p>It helps an AI discover approved tools and use them in a consistent way.</p></article>
            <article class="tech-plain-card"><span>API</span><h4>A service doorway</h4><p>Calendar, email, weather, music and business tools expose controlled ways to read or act.</p></article>
            <article class="tech-plain-card"><span>RAG</span><h4>Find the right records first</h4><p>The AI retrieves approved notes, documents and history before it answers.</p></article>
            <article class="tech-plain-card"><span>RESEARCH</span><h4>Check the outside world</h4><p>Current sources can be compared and labeled before information enters the briefing.</p></article>
            <article class="tech-plain-card"><span>MEMORY</span><h4>A labeled filing cabinet</h4><p>Facts keep their source, confidence, privacy, corrections and expiry.</p></article>
            <article class="tech-plain-card"><span>MODEL ROUTER</span><h4>Choose the right engine</h4><p>The platform can select a model based on speed, privacy, cost and task difficulty.</p></article>
          </div></div>
        </details>
        <details class="future-details">
          <summary>Users and spaces</summary>
          <div><p>Each person has a private profile. A space belongs to a relationship or purpose, such as a couple, family, business, class, training program or trip.</p><ul><li>Private facts do not enter a space automatically.</li><li>Shared memories can require approval from the affected people.</li><li>One person can belong to several spaces with different permissions.</li><li>The same user can receive a personal brief and a separate shared brief.</li></ul></div>
        </details>
        <details class="future-details">
          <summary>Why personalization matters while AI changes quickly</summary>
          <div><p>Models will continue to improve and change. The durable product is the organized profile, memory, permissions, history, connections and interface around the user. Better models can be swapped in without forcing the person to rebuild their life context from zero.</p></div>
        </details>
        <details class="future-details">
          <summary>A few high-impact possibilities</summary>
          <div><ul><li>A caregiver receives appointments, medication reminders, transport changes and family updates in one calm view.</li><li>A founder wakes up to cash risk, project ownership, client emails and one strategic recommendation.</li><li>A couple sees an approved promise, travel plan, shared budget and neutral repair suggestion without exposing private notes.</li><li>A student receives adaptive study blocks based on deadlines, energy patterns and past completion.</li><li>An accessibility-first briefing can change language, reading level, contrast, voice and interaction method for the user.</li></ul></div>
        </details>
      </div>

      <div class="schedule-update-card">
        <div class="schedule-clock"><div><strong>8:00</strong><span>AM NEW YORK</span></div></div>
        <div><p class="micro-label">CURRENT CONCEPT UPDATE</p><h3>This page is scheduled to refresh around 8 AM each day.</h3><p>The present task updates the GitHub concept, not private accounts. It preserves the permanent design and explanations while refreshing useful fictional examples and date-sensitive content.</p><div class="schedule-update-steps"><div><span>1</span><p>Read the latest source files and permanent design rules.</p></div><div><span>2</span><p>Refresh approved date-sensitive demo content without inventing live connections.</p></div><div><span>3</span><p>Validate scripts, structure, labels and noindex protection.</p></div><div><span>4</span><p>Publish the verified edition to the repository.</p></div></div></div>
      </div>
    `;
    $('#difference').insertAdjacentElement('afterend', section);

    $$('[data-adaptive-focus]').forEach(button => button.addEventListener('click', () => renderAdaptiveBoard(button.dataset.adaptiveFocus)));
    $$('[data-voice-style]').forEach(button => button.addEventListener('click', () => voicePreview(button.dataset.voiceStyle)));
    $$('[data-model-style]').forEach(button => button.addEventListener('click', () => {
      state.selectedModel = button.dataset.modelStyle;
      $$('[data-model-style]').forEach(item => item.classList.toggle('is-active', item === button));
      notify(`${button.textContent.trim()} model routing selected for this demonstration.`);
    }));
    renderAdaptiveBoard('today');
    $('[data-voice-style="calm"]')?.classList.add('is-active');
    $('[data-model-style="balanced"]')?.classList.add('is-active');
  }

  function installLearningLoop() {
    const learning = $('#learning');
    if (!learning || $('#inputLearningLab')) return;
    const block = document.createElement('div');
    block.id = 'inputLearningLab';
    block.innerHTML = `
      <div class="section-heading">
        <div><p class="micro-label">EVERY INPUT CAN IMPROVE THE NEXT BRIEFING</p><h2>The system learns from evidence, corrections and completed actions.</h2></div>
        <p>One click should never redefine a person. Inputs become labeled evidence that can be reviewed, corrected, kept temporary or deleted.</p>
      </div>
      <div class="learning-loop">
        <article class="learning-node"><span>1 · INPUT</span><strong>Something happens</strong><p>A message, correction, completed task, liked song or connected record.</p></article>
        <article class="learning-node"><span>2 · CHECK</span><strong>Source and confidence</strong><p>The system records where it came from and how certain it is.</p></article>
        <article class="learning-node"><span>3 · CONTROL</span><strong>User decides</strong><p>Remember, temporary, correct, delete or share.</p></article>
        <article class="learning-node"><span>4 · RETRIEVE</span><strong>Useful context returns</strong><p>RAG finds the relevant approved history for the next edition.</p></article>
        <article class="learning-node"><span>5 · IMPROVE</span><strong>Next brief gets better</strong><p>Selection, timing, tone and advice become more useful.</p></article>
      </div>
      <div class="input-lab">
        <div class="input-buttons">
          <button type="button" data-learning-input="liked">♥ I liked this song</button>
          <button type="button" data-learning-input="correction">Correct an assumption</button>
          <button type="button" data-learning-input="completed">Mark an action complete</button>
          <button type="button" data-learning-input="saved">Save this news topic</button>
          <button type="button" data-learning-input="temporary">Keep this note temporary</button>
          <button type="button" data-learning-input="shared">Approve a shared memory</button>
        </div>
        <aside class="knowledge-meter"><span class="micro-label">DEMO KNOWLEDGE QUALITY</span><strong id="knowledgeScore">24%</strong><div class="knowledge-track"><i id="knowledgeBar"></i></div><p id="knowledgeMessage">The profile has a few approved preferences, but it still needs corrections and real behavior over time.</p></aside>
      </div>
    `;
    $('#memoryRecordList').insertAdjacentElement('afterend', block);

    const messages = {
      liked: 'The next music selection can weigh this style slightly more, while still asking before making it permanent.',
      correction: 'The inaccurate assumption loses confidence immediately. The correction keeps its source and date.',
      completed: 'Completed behavior is stronger evidence than an intention. Timing suggestions can improve.',
      saved: 'The topic can appear more often, with the user’s preferred depth and source quality.',
      temporary: 'The note can help the next few briefings, then expire automatically.',
      shared: 'The approved record can enter the relevant space without exposing unrelated private context.'
    };

    $$('[data-learning-input]').forEach(button => button.addEventListener('click', () => {
      state.knowledgeScore = Math.min(92, state.knowledgeScore + 8);
      $('#knowledgeScore').textContent = `${state.knowledgeScore}%`;
      $('#knowledgeBar').style.width = `${state.knowledgeScore}%`;
      $('#knowledgeMessage').textContent = messages[button.dataset.learningInput];
    }));
    $('#knowledgeBar').style.width = `${state.knowledgeScore}%`;
  }

  function initialize() {
    if (state.initialized || !appReady()) return;
    state.initialized = true;
    requireScenarioChoice();
    ensureMusicProviders();
    installMusicCapture();
    createScenarioDock();
    insertStrategyLab();
    insertFutureSection();
    installLearningLoop();
    window.addEventListener('message', handleYoutubeMessage);
  }

  function waitForApp(attempt = 0) {
    if (appReady()) {
      initialize();
      return;
    }
    if (attempt < 120) window.setTimeout(() => waitForApp(attempt + 1), 100);
  }

  document.addEventListener('DOMContentLoaded', () => window.setTimeout(() => {
    requireScenarioChoice();
    waitForApp();
  }, 0), { once: true });
  window.addEventListener('brief:ready', () => window.setTimeout(initialize, 0));
})();
