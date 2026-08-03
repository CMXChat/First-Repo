(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storage = key => `cmxBriefDemo:experience:${key}`;
  let initialized = false;
  let switchRequested = false;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function ready() {
    return Boolean(window.BRIEF_APP && window.BRIEF_DAILY_CONTENT && window.BRIEF_LIVE_DATA);
  }

  function openHelp() {
    const modal = $('#briefHelpModal');
    if (!modal) return;
    modal.classList.remove('is-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('help-open');
    $('#briefHelpClose')?.focus();
  }

  function closeHelp() {
    const modal = $('#briefHelpModal');
    if (!modal) return;
    modal.classList.add('is-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('help-open');
    $('#explainButton')?.focus();
  }

  function createHelpModal() {
    if ($('#briefHelpModal')) return;
    const modal = document.createElement('div');
    modal.id = 'briefHelpModal';
    modal.className = 'brief-help-modal is-hidden';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="brief-help-backdrop" data-close-help></div>
      <section class="brief-help-dialog" role="dialog" aria-modal="true" aria-labelledby="briefHelpTitle">
        <div class="brief-help-head">
          <div><span>HOW THIS DEMO WORKS</span><h2 id="briefHelpTitle">Tap, switch, compare and ask what the data could become.</h2></div>
          <button id="briefHelpClose" type="button" aria-label="Close help">×</button>
        </div>
        <div class="brief-help-grid">
          <article><strong>1. Switch briefing</strong><p>Use the top switcher, the large scenario cards or the final cards. The page returns to the beginning and rebuilds around the selected people and purpose.</p></article>
          <article><strong>2. Compare private and shared</strong><p>The lock control changes between a private profile view and an approved shared space. A real account would only reveal information permitted for that person and space.</p></article>
          <article><strong>3. Interact with the modules</strong><p>Tap charts, horoscope signs, habit answers, memory choices, weather hours and Spotify players. These controls demonstrate how actions could improve the next briefing.</p></article>
          <article><strong>4. Know what is real</strong><p>Brooklyn weather and labeled public stories can be current. Private-looking finances, inboxes, health notes and relationship details remain fictional in this public demo.</p></article>
        </div>
        <details open>
          <summary>Why build a platform around AI instead of using one ordinary AI chat?</summary>
          <p>An ordinary chat usually begins with the current prompt. This platform prepares approved profiles, structured memory, permissions, shared spaces, current public research and connected service data before the model answers. The AI model can change while the user’s organized context and boundaries remain dependable.</p>
        </details>
        <details>
          <summary>What could become possible as the backend and integrations grow?</summary>
          <p>A phone alarm could begin with music and a licensed natural voice. The same briefing could continue in a car, smart home, wearable, office display or work environment. Approved connectors could update calendars, inboxes, finances, projects, workouts, lessons, home devices and reminders. Future media models could prepare visual explainers or short private video summaries when appropriate.</p>
        </details>
        <details>
          <summary>How do MCP, APIs, RAG, memory and model switching fit together?</summary>
          <p>APIs and MCP connectors provide controlled access to approved services. RAG retrieves the right records and sources before an answer. Structured memory keeps facts, corrections, confidence and sharing rules organized. A model router can choose a fast model, a private model or a deeper reasoning model without rebuilding the user’s profile.</p>
        </details>
        <p class="brief-help-reality"><strong>Current reality:</strong> this is a front-end product demonstration with public data and fictional private examples. Authentication, protected databases, account integrations and real actions require the planned backend.</p>
      </section>`;
    document.body.appendChild(modal);
    $('#briefHelpClose')?.addEventListener('click', closeHelp);
    $$('[data-close-help]', modal).forEach(node => node.addEventListener('click', closeHelp));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !modal.classList.contains('is-hidden')) closeHelp();
    });
  }

  function wireHelpButton() {
    const button = $('#explainButton');
    if (!button || button.dataset.experienceHelp === 'true') return;
    button.dataset.experienceHelp = 'true';
    button.title = 'Open interactive help';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openHelp();
    }, true);
  }

  function createInteractionHint() {
    if ($('#interactionHint')) return;
    const nav = $('.section-nav');
    if (!nav) return;
    const hint = document.createElement('button');
    hint.id = 'interactionHint';
    hint.className = 'interaction-hint';
    hint.type = 'button';
    hint.innerHTML = '<span>Interactive demo</span><strong>Tap cards, charts, locks, signs and players</strong><b>?</b>';
    hint.addEventListener('click', openHelp);
    nav.insertAdjacentElement('afterend', hint);
  }

  function enhanceThemeToggle() {
    const button = $('#themeToggleButton');
    if (!button) return;
    button.classList.add('neon-theme-toggle');
    button.title = 'Try the light or dark experience';
    button.setAttribute('data-tooltip', 'Switch appearance');
  }

  function syncSpaceButtons() {
    const privateButton = $('#viewModeButton');
    const insideButton = $('#sharedToggleInside');
    if (!privateButton) return;
    const shared = privateButton.getAttribute('aria-pressed') === 'true';
    document.body.dataset.spaceMode = shared ? 'shared' : 'private';
    privateButton.classList.toggle('is-shared-mode', shared);
    privateButton.innerHTML = `<span class="space-lock">${shared ? '↗' : '⌁'}</span><span>${shared ? 'Shared space' : 'Private profile'}</span>`;
    if (insideButton) {
      insideButton.classList.toggle('is-shared-mode', shared);
      insideButton.innerHTML = `<span class="space-lock">${shared ? '↙' : '↗'}</span><span>${shared ? 'Return to private profile' : 'Open approved shared space'}</span>`;
    }
  }

  function wireSpaceButtons() {
    ['#viewModeButton', '#sharedToggleInside'].forEach(selector => {
      const button = $(selector);
      if (!button || button.dataset.experienceSpace === 'true') return;
      button.dataset.experienceSpace = 'true';
      button.addEventListener('click', () => window.setTimeout(() => {
        syncSpaceButtons();
        renderScenarioEnhancement();
      }, 40));
    });
    syncSpaceButtons();
  }

  function wireSwitchToTop() {
    document.addEventListener('click', event => {
      const control = event.target.closest('[data-scenario-choice], [data-footer-preset], [data-quick-preset]');
      if (!control) return;
      switchRequested = true;
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        switchRequested = false;
      }, 100);
    }, true);
    window.addEventListener('brief:preset-change', () => {
      if (switchRequested) window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    });
  }

  function signOptions(selected) {
    const signs = window.BRIEF_LIVE_DATA.horoscopes?.signs || {};
    return Object.entries(signs).map(([id, sign]) => `<option value="${escapeHtml(id)}" ${id === selected ? 'selected' : ''}>${escapeHtml(sign.name)}</option>`).join('');
  }

  function horoscopeCard(signId, tone, selectId) {
    const h = window.BRIEF_LIVE_DATA.horoscopes;
    const sign = h?.signs?.[signId] || h?.signs?.virgo;
    return `
      <article class="horoscope-card tone-${tone}" data-horoscope-card="${escapeHtml(selectId)}">
        <div class="horoscope-card-head"><div><span>${escapeHtml(h?.date || '')}</span><strong>${escapeHtml(sign.name)}</strong></div>
          <select id="${escapeHtml(selectId)}" aria-label="Choose horoscope sign">${signOptions(signId)}</select>
        </div>
        <p>${escapeHtml(sign.summary)}</p>
        <small>Today’s reflection: ${escapeHtml(sign.focus)}</small>
      </article>`;
  }

  function bindHoroscopeSelect(id, tone) {
    const select = $(`#${id}`);
    if (!select) return;
    select.addEventListener('change', () => {
      localStorage.setItem(storage(`sign:${id}`), select.value);
      const wrapper = select.closest('[data-horoscope-card]');
      if (!wrapper) return;
      const replacement = document.createElement('div');
      replacement.innerHTML = horoscopeCard(select.value, tone, id).trim();
      wrapper.replaceWith(replacement.firstElementChild);
      bindHoroscopeSelect(id, tone);
    });
  }

  function renderPersonalAddon() {
    const selected = localStorage.getItem(storage('sign:personalHoroscopeSign')) || 'virgo';
    const quote = window.BRIEF_DAILY_CONTENT.personalDashboard.quote;
    return `
      <section class="experience-addon personal-experience-addon">
        <div class="experience-addon-heading"><div><p class="micro-label">DAILY REFLECTION · ENTERTAINMENT</p><h3>A personal horoscope that can follow your chosen sign.</h3></div><p>${escapeHtml(window.BRIEF_LIVE_DATA.horoscopes.disclaimer)}</p></div>
        <div class="horoscope-quote-grid">
          ${horoscopeCard(selected, 'blue', 'personalHoroscopeSign')}
          <blockquote class="daily-quote"><span>QUOTE FOR THE DAY</span><p>${escapeHtml(quote)}</p><small>Original briefing reflection</small></blockquote>
        </div>
      </section>`;
  }

  function profileList(items, shared = false) {
    return `<ul class="${shared ? 'profile-approved-list' : 'profile-private-list'}">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function renderRelationshipAddon() {
    const d = window.BRIEF_DAILY_CONTENT.relationshipSpace;
    const live = window.BRIEF_LIVE_DATA;
    const leftSign = localStorage.getItem(storage('sign:coupleLeftSign')) || 'virgo';
    const rightSign = localStorage.getItem(storage('sign:coupleRightSign')) || 'virgo';
    return `
      <section class="experience-addon">
        <div class="experience-addon-heading"><div><p class="micro-label">PROFILES + APPROVED COUPLE SPACE</p><h3>Two accounts can stay private while selected updates become shared.</h3></div><p>Blue and pink are demonstration labels only. Names, colors, language, roles and relationship terms would be customizable.</p></div>
        <div class="profile-space-demo relationship-profile-space">
          <article class="profile-account tone-blue">
            <div class="profile-account-head"><span>${escapeHtml(d.labels.left)}</span><strong>${escapeHtml(d.left.name)}</strong><b>PRIVATE PROFILE</b></div>
            <h4>Visible only to this account</h4>${profileList(d.left.privateUpdates)}
            <h4>Approved for the couple space</h4>${profileList(d.left.approvedShared, true)}
          </article>
          <article class="shared-space-account">
            <div class="profile-account-head"><span>${escapeHtml(d.labels.shared)}</span><strong>Approved together</strong><b>SHARED SPACE</b></div>
            ${d.shared.map(item => `<div class="shared-space-row"><span>${escapeHtml(item.label)}</span><p>${escapeHtml(item.text)}</p></div>`).join('')}
          </article>
          <article class="profile-account tone-pink">
            <div class="profile-account-head"><span>${escapeHtml(d.labels.right)}</span><strong>${escapeHtml(d.right.name)}</strong><b>PRIVATE PROFILE</b></div>
            <h4>Visible only to this account</h4>${profileList(d.right.privateUpdates)}
            <h4>Approved for the couple space</h4>${profileList(d.right.approvedShared, true)}
          </article>
        </div>
        <div class="couple-horoscope-grid">
          ${horoscopeCard(leftSign, 'blue', 'coupleLeftSign')}
          <article class="compatibility-card"><span>TODAY’S COUPLE REFLECTION</span><h4>Virgo + Virgo example</h4><p>${escapeHtml(live.horoscopes.compatibility)}</p><small>${escapeHtml(live.horoscopes.disclaimer)}</small></article>
          ${horoscopeCard(rightSign, 'pink', 'coupleRightSign')}
        </div>
        <section class="culture-stream">
          <div><p class="micro-label">LIGHTER SHARED INTERESTS</p><h3>Celebrity and culture updates can have their own lane.</h3><p>Fun stories stay separate from mediation, promises and serious decisions.</p></div>
          <div class="culture-story-grid">${(live.entertainment || []).map(story => `<article><span>${escapeHtml(story.status)}</span><h4>${escapeHtml(story.title)}</h4><p>${escapeHtml(story.summary)}</p><small>${escapeHtml(story.why)}</small><a href="${escapeHtml(story.url)}" target="_blank" rel="noopener noreferrer">Open source</a></article>`).join('')}</div>
        </section>
      </section>`;
  }

  function allocationBars(values) {
    return values.map(item => `<div class="allocation-row"><span>${escapeHtml(item.label)}</span><div><i style="width:${Number(item.value)}%"></i></div><strong>${Number(item.value)}%</strong></div>`).join('');
  }

  function renderBusinessAddon() {
    const d = window.BRIEF_DAILY_CONTENT.businessSpace;
    const markets = window.BRIEF_LIVE_DATA.markets || [];
    const partnerCard = (side, tone, labelKey) => `
      <article class="business-partner-account tone-${tone}">
        <div class="profile-account-head"><span>${escapeHtml(d.labels[labelKey])}</span><strong>${escapeHtml(side.name)}</strong><b>PARTNER-PRIVATE</b></div>
        <div class="partner-private-metrics">${side.private.map(item => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><small>${escapeHtml(item.note)}</small></div>`).join('')}</div>
        <h4>Approved into the operating space</h4>${profileList(side.approved, true)}
      </article>`;
    return `
      <section class="experience-addon business-experience-addon">
        <div class="experience-addon-heading"><div><p class="micro-label">PARTNER ACCOUNTS + SHARED OPERATING SPACE</p><h3>Each partner can receive a private interpretation before approving the shared company view.</h3></div><p>Company facts can be shared while personal money, private notes and individual concerns stay inside each partner’s account.</p></div>
        <div class="business-profile-grid">
          ${partnerCard(d.left, 'blue', 'left')}
          <article class="business-shared-ledger">
            <div class="profile-account-head"><span>${escapeHtml(d.labels.shared)}</span><strong>Shared ledger</strong><b>APPROVED COMPANY DATA</b></div>
            ${d.shared.map(item => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><small>${escapeHtml(item.note)}</small></div>`).join('')}
          </article>
          ${partnerCard(d.right, 'pink', 'right')}
        </div>
        <div class="business-visual-grid">
          <section class="allocation-panel"><p class="micro-label">FICTIONAL COST ALLOCATION</p><h3>Where the month’s operating cash is going</h3>${allocationBars(d.allocation)}</section>
          <section class="process-map-panel"><p class="micro-label">DECISION PROCESS MAP</p><h3>How information becomes accountable action</h3><div class="process-map">${d.process.map((step, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(step)}</strong></div>${index < d.process.length - 1 ? '<i>→</i>' : ''}`).join('')}</div></section>
        </div>
        <div class="advice-visual-grid">${d.advice.map(item => `<article><span>${escapeHtml(item.kind)}</span><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.text)}</p></article>`).join('')}</div>
        <section class="market-impact-stream">
          <div><p class="micro-label">CURRENT MARKET CONTEXT</p><h3>Public stock news becomes useful only when it connects to company exposure.</h3></div>
          <div>${markets.map(story => `<article><span>${escapeHtml(story.status)}</span><h4>${escapeHtml(story.title)}</h4><p>${escapeHtml(story.summary)}</p><small>${escapeHtml(story.impact)}</small><a href="${escapeHtml(story.url)}" target="_blank" rel="noopener noreferrer">Open source</a></article>`).join('')}</div>
        </section>
      </section>`;
  }

  function trackerState() {
    try { return JSON.parse(localStorage.getItem(storage('trainerAnswers')) || '{}'); }
    catch { return {}; }
  }

  function renderTrainerAddon() {
    const d = window.BRIEF_DAILY_CONTENT.trainerAccountability;
    const answers = trackerState();
    return `
      <section class="experience-addon trainer-accountability">
        <div class="experience-addon-heading"><div><p class="micro-label">DAILY ACCOUNTABILITY</p><h3>Simple yes-or-no inputs can adapt the next recommendation.</h3></div><p>The trainer’s rules, the student’s answers and the evidence remain separately labeled.</p></div>
        <blockquote class="trainer-quote"><span>TRAINING REFLECTION</span><p>${escapeHtml(d.quote)}</p></blockquote>
        <div class="habit-calendar">${d.week.map(day => `<article class="${day.done === true ? 'is-done' : day.done === false ? 'is-missed' : 'is-open'}"><span>${escapeHtml(day.day)}</span><strong>${day.done === true ? 'YES' : day.done === false ? 'NO' : '—'}</strong><small>${day.done === true ? 'Completed' : day.done === false ? 'Missed' : 'Upcoming'}</small></article>`).join('')}</div>
        <div class="accountability-layout">
          <div class="accountability-questions">${d.questions.map(item => `
            <article data-accountability="${escapeHtml(item.id)}">
              <p>${escapeHtml(item.question)}</p>
              <div><button type="button" data-answer-id="${escapeHtml(item.id)}" data-answer-value="yes" class="${answers[item.id] === 'yes' ? 'is-selected' : ''}">Yes</button><button type="button" data-answer-id="${escapeHtml(item.id)}" data-answer-value="no" class="${answers[item.id] === 'no' ? 'is-selected' : ''}">No</button></div>
            </article>`).join('')}</div>
          <aside class="adaptive-coach-note"><span>ADAPTED COACH NOTE</span><h4 id="adaptiveCoachTitle">Answer a question</h4><p id="adaptiveCoachText">The demonstration will show how a single input can change today’s advice without redefining the person.</p><small>Fictional coaching logic. Health concerns require appropriate professional guidance.</small></aside>
        </div>
      </section>`;
  }

  function bindTrainerAnswers() {
    $$('[data-answer-id]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.answerId;
        const value = button.dataset.answerValue;
        const answers = trackerState();
        answers[id] = value;
        localStorage.setItem(storage('trainerAnswers'), JSON.stringify(answers));
        $$(`[data-answer-id="${CSS.escape(id)}"]`).forEach(item => item.classList.toggle('is-selected', item === button));
        const question = window.BRIEF_DAILY_CONTENT.trainerAccountability.questions.find(item => item.id === id);
        $('#adaptiveCoachTitle').textContent = value === 'yes' ? 'Keep what worked' : 'Adapt the plan';
        $('#adaptiveCoachText').textContent = question?.[value] || 'The next briefing can use this answer after the user approves it.';
      });
    });
  }

  function bindAddonInteractions(preset) {
    if (preset === 'individual') bindHoroscopeSelect('personalHoroscopeSign', 'blue');
    if (preset === 'couple') {
      bindHoroscopeSelect('coupleLeftSign', 'blue');
      bindHoroscopeSelect('coupleRightSign', 'pink');
    }
    if (preset === 'trainer') bindTrainerAnswers();
  }

  function renderScenarioEnhancement() {
    const stage = $('#scenarioStage');
    if (!stage || !window.BRIEF_APP) return;
    $('#scenarioExperienceAddon', stage)?.remove();
    const preset = window.BRIEF_APP.getPreset();
    const wrapper = document.createElement('div');
    wrapper.id = 'scenarioExperienceAddon';
    wrapper.innerHTML = preset === 'couple' ? renderRelationshipAddon()
      : preset === 'partners' ? renderBusinessAddon()
      : preset === 'trainer' ? renderTrainerAddon()
      : renderPersonalAddon();
    stage.appendChild(wrapper);
    bindAddonInteractions(preset);
    syncSpaceButtons();
  }

  function styleInternalActions() {
    $$('button[data-concept-action], .text-action').forEach(button => {
      if (button.closest('.brief-help-dialog')) return;
      button.classList.add('internal-demo-action');
      if (!button.title) button.title = 'Interactive concept action';
    });
  }

  function init() {
    if (initialized || !ready()) return;
    initialized = true;
    createHelpModal();
    wireHelpButton();
    createInteractionHint();
    enhanceThemeToggle();
    wireSpaceButtons();
    wireSwitchToTop();
    renderScenarioEnhancement();
    styleInternalActions();
    window.addEventListener('brief:preset-change', () => window.setTimeout(() => {
      renderScenarioEnhancement();
      styleInternalActions();
      enhanceThemeToggle();
    }, 100));
    [0, 120, 420, 900].forEach(delay => window.setTimeout(() => {
      styleInternalActions();
      enhanceThemeToggle();
      syncSpaceButtons();
    }, delay));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (ready()) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 500), { once: true });
})();
