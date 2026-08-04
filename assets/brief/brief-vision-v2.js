(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  const MISSIONS = [
    {
      kicker: 'MISSION 01 · OPENING',
      title: 'Build the opening you would actually use.',
      body: 'The first screen should remove uncertainty fast. Choose what deserves the first position before weather, messages or background detail compete for attention.',
      prompt: 'What should the opening protect?',
      choices: [
        ['focus', 'A quiet focus block', 'The briefing protects the next useful window.'],
        ['risk', 'The biggest risk', 'The briefing leads with what could change the day.'],
        ['agenda', 'The complete agenda', 'The briefing begins with time and sequence.']
      ],
      scene: 'opening'
    },
    {
      kicker: 'MISSION 02 · SOUND',
      title: 'Give the morning a sound and a voice.',
      body: 'Spotify favorites, a focus playlist or silence can shape the mood. Narration can stay calm, direct or completely off. The user keeps control of both.',
      prompt: 'Choose the morning style.',
      choices: [
        ['favorites', 'Favorites + direct voice', 'Personal music with a concise spoken briefing.'],
        ['focus', 'Focus playlist + calm voice', 'Steadier energy with softer narration.'],
        ['silent', 'Silence + text only', 'No audio starts without permission.']
      ],
      scene: 'sound'
    },
    {
      kicker: 'MISSION 03 · CONTEXT',
      title: 'Turn scattered facts into one strategic move.',
      body: 'A calendar item becomes useful when it connects to project risk, cash timing, a promise, recovery or another real dependency. The briefing should show why the connection matters.',
      prompt: 'Which connection should drive the recommendation?',
      choices: [
        ['cash', 'Meeting → cash timing', 'Delay the decision until collection clears.'],
        ['project', 'Meeting → launch risk', 'Use the meeting to remove the blocker.'],
        ['personal', 'Meeting → personal promise', 'Protect the commitment before adding more work.']
      ],
      scene: 'context'
    },
    {
      kicker: 'MISSION 04 · SPACES',
      title: 'Choose what each space is allowed to know.',
      body: 'Private profiles, couple spaces, role views and leadership views can share a platform while keeping different boundaries. Visibility follows purpose and approval.',
      prompt: 'Open one boundary.',
      choices: [
        ['private', 'Private profile', 'Personal notes and corrections stay with the person.'],
        ['shared', 'Approved shared space', 'Only chosen plans, promises and records cross over.'],
        ['role', 'Role-based workspace', 'Tasks, blockers and handoffs appear without private notes.']
      ],
      scene: 'spaces'
    },
    {
      kicker: 'MISSION 05 · LEARNING',
      title: 'Correct the record and improve tomorrow.',
      body: 'Workouts, lessons, habits and accountability can improve through approved history. Corrections should outweigh stale guesses, and temporary context should be able to expire.',
      prompt: 'How should the memory change?',
      choices: [
        ['correct', 'Replace the old guess', 'The correction becomes the stronger record.'],
        ['expire', 'Let it expire', 'Temporary context leaves the active profile.'],
        ['review', 'Ask again later', 'The briefing keeps uncertainty visible.']
      ],
      scene: 'learning'
    },
    {
      kicker: 'MISSION 06 · ACTION',
      title: 'Approve the action or keep it a draft.',
      body: 'A protected backend could prepare updates from files, connected accounts and structured input. Permissions, logs and approval gates stay visible before anything sensitive changes.',
      prompt: 'What happens next?',
      choices: [
        ['approve', 'Review and approve', 'The action moves forward with an audit record.'],
        ['draft', 'Keep it as a draft', 'Nothing changes until a person approves it.'],
        ['cancel', 'Cancel the action', 'The prepared action is discarded.']
      ],
      scene: 'action'
    }
  ];

  const state = {
    open: false,
    opening: false,
    current: 0,
    selections: {},
    returnFocus: null,
    appAriaHidden: null,
    openTimer: 0
  };

  function focusable(root) {
    if (!root) return [];
    return $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', root)
      .filter(node => node.offsetParent !== null && !node.hidden);
  }

  function setAppInert(enabled) {
    const app = $('#briefApp');
    if (!app) return;
    if (enabled) {
      state.appAriaHidden = app.getAttribute('aria-hidden');
      if ('inert' in app) app.inert = true;
      else app.setAttribute('aria-hidden', 'true');
      return;
    }
    if ('inert' in app) app.inert = false;
    if (state.appAriaHidden === null) app.removeAttribute('aria-hidden');
    else app.setAttribute('aria-hidden', state.appAriaHidden);
    state.appAriaHidden = null;
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const items = focusable($('#briefVisionPanel'));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function completedCount() {
    return Object.keys(state.selections).length;
  }

  function xp() {
    return completedCount() * 100;
  }

  function sceneMarkup(type) {
    if (type === 'opening') return '<div class="vision-v2-opening"><time>7:12</time><span>48° · rain after 7</span><article><small>FIRST MOVE</small><strong>Protect 45 quiet minutes</strong><p>Before the project review</p></article><article><small>WATCH</small><strong>One deadline moved overnight</strong><p>Owner and next step attached</p></article></div>';
    if (type === 'sound') return `<div class="vision-v2-sound"><div class="vision-v2-wave">${'<i></i>'.repeat(16)}</div><article><small>SPOTIFY FAVORITES</small><strong>Your rotation can shape the opening.</strong><p>Favorites, focus music or silence stay selectable.</p></article><div class="vision-v2-pills"><span>Direct voice</span><span>Calm voice</span><span>Text only</span></div></div>`;
    if (type === 'context') return '<div class="vision-v2-context"><span>Meeting</span><i>changes</i><span>Project risk</span><i>affects</i><span>Cash timing</span><article><small>RECOMMENDATION</small><strong>Delay the contractor decision until collection clears.</strong></article></div>';
    if (type === 'spaces') return '<div class="vision-v2-spaces"><article><small>PRIVATE</small><strong>Personal profile</strong><p>Notes and corrections</p></article><article><small>SHARED</small><strong>Together</strong><p>Approved plans only</p></article><article><small>ROLE</small><strong>Designer</strong><p>Tasks and handoffs</p></article><article><small>LEADERSHIP</small><strong>Launch room</strong><p>Risk and approvals</p></article></div>';
    if (type === 'learning') return '<div class="vision-v2-learning"><article><small>OLD GUESS</small><strong>Morning workouts work best.</strong></article><b>↓ corrected by user</b><article class="is-active"><small>ACTIVE RECORD</small><strong>Evening sessions are more consistent.</strong></article><div><span style="width:86%"></span></div></div>';
    return '<div class="vision-v2-action"><div><span>Connected input</span><i>→</i><span>Prepared action</span><i>→</i><span>Human approval</span></div><article><small>READY FOR REVIEW</small><strong>Schedule the approved launch update.</strong><p>Permissions · audit log · approval gate</p></article></div>';
  }

  function createLayer() {
    $('#briefVisionLayer')?.remove();
    const layer = document.createElement('div');
    layer.id = 'briefVisionLayer';
    layer.className = 'brief-vision-layer brief-vision-v2';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="brief-vision-backdrop" type="button" data-vision-close aria-label="Close Vision walkthrough"></button>
      <section id="briefVisionPanel" class="brief-vision-panel" role="dialog" aria-modal="true" aria-labelledby="briefVisionTitle" aria-describedby="briefVisionBody">
        <header class="brief-vision-head">
          <div><span>VISION MISSIONS</span><small id="briefVisionCount"></small></div>
          <div class="vision-v2-score"><span id="briefVisionXp">0 XP</span><button type="button" data-vision-close aria-label="Close Vision walkthrough">×</button></div>
        </header>
        <div class="vision-v2-mission-rail" id="briefVisionMissionRail" aria-label="Vision missions"></div>
        <div class="brief-vision-layout">
          <div class="brief-vision-copy">
            <p id="briefVisionKicker"></p>
            <h2 id="briefVisionTitle"></h2>
            <p id="briefVisionBody"></p>
            <div class="vision-v2-challenge"><span id="briefVisionPrompt"></span><div id="briefVisionChoices"></div></div>
            <blockquote id="briefVisionNote">Choose a card to see how the briefing responds.</blockquote>
          </div>
          <div id="briefVisionVisual" class="brief-vision-visual"></div>
        </div>
        <footer>
          <button id="briefVisionBack" type="button">Back</button>
          <button id="briefVisionSkip" type="button">Close</button>
          <button id="briefVisionNext" type="button">Next mission</button>
        </footer>
      </section>`;
    document.body.appendChild(layer);

    $$('[data-vision-close]', layer).forEach(button => button.addEventListener('click', close));
    $('#briefVisionBack', layer)?.addEventListener('click', () => show(state.current - 1));
    $('#briefVisionSkip', layer)?.addEventListener('click', close);
    $('#briefVisionNext', layer)?.addEventListener('click', () => {
      if (state.current >= MISSIONS.length - 1) close();
      else show(state.current + 1);
    });
    layer.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
      else trapFocus(event);
    });
  }

  function updateMissionRail() {
    const host = $('#briefVisionMissionRail');
    if (!host) return;
    host.innerHTML = MISSIONS.map((mission, index) => {
      const complete = Boolean(state.selections[index]);
      return `<button type="button" data-vision-step="${index}" aria-current="${index === state.current ? 'step' : 'false'}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${mission.kicker.split(' · ')[1]}</strong><small>${complete ? 'Complete' : 'Open'}</small></button>`;
    }).join('');
    $$('[data-vision-step]', host).forEach(button => button.addEventListener('click', () => show(Number(button.dataset.visionStep))));
  }

  function choose(value) {
    const mission = MISSIONS[state.current];
    const selected = mission.choices.find(choice => choice[0] === value);
    if (!selected) return;
    state.selections[state.current] = value;
    $$('[data-vision-choice]').forEach(button => {
      const active = button.dataset.visionChoice === value;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#briefVisionNote').textContent = selected[2];
    $('#briefVisionXp').textContent = `${xp()} XP`;
    updateMissionRail();
  }

  function show(index) {
    const next = Math.max(0, Math.min(MISSIONS.length - 1, index));
    const mission = MISSIONS[next];
    state.current = next;
    $('#briefVisionCount').textContent = `MISSION ${next + 1} OF ${MISSIONS.length}`;
    $('#briefVisionKicker').textContent = mission.kicker;
    $('#briefVisionTitle').textContent = mission.title;
    $('#briefVisionBody').textContent = mission.body;
    $('#briefVisionPrompt').textContent = mission.prompt;
    $('#briefVisionVisual').innerHTML = sceneMarkup(mission.scene);
    const selectedValue = state.selections[next];
    $('#briefVisionChoices').innerHTML = mission.choices.map(choice => `<button type="button" data-vision-choice="${choice[0]}" aria-pressed="${choice[0] === selectedValue}"><strong>${choice[1]}</strong><small>${choice[2]}</small></button>`).join('');
    $$('[data-vision-choice]').forEach(button => button.addEventListener('click', () => choose(button.dataset.visionChoice)));
    const selected = mission.choices.find(choice => choice[0] === selectedValue);
    $('#briefVisionNote').textContent = selected ? selected[2] : 'Choose a card to see how the briefing responds.';
    $('#briefVisionXp').textContent = `${xp()} XP`;
    $('#briefVisionBack').disabled = next === 0;
    $('#briefVisionNext').textContent = next === MISSIONS.length - 1 ? 'Finish walkthrough' : 'Next mission';
    updateMissionRail();
    const panel = $('#briefVisionPanel');
    if (panel) panel.scrollTop = 0;
    window.setTimeout(() => $('#briefVisionNext')?.focus(), reducedMotion() ? 0 : 140);
  }

  function beginOpen() {
    if (!state.opening || state.open) return;
    state.opening = false;
    state.open = true;
    const layer = $('#briefVisionLayer');
    if (!layer) return;
    layer.hidden = false;
    document.body.classList.add('brief-vision-open');
    setAppInert(true);
    show(0);
    window.requestAnimationFrame(() => layer.classList.add('is-visible'));
    window.dispatchEvent(new CustomEvent('brief:vision-open'));
  }

  function open(launcher = null) {
    if (!$('#briefVisionLayer')) createLayer();
    if (state.open || state.opening || document.body.classList.contains('is-locked')) return;
    state.opening = true;
    state.returnFocus = launcher || document.activeElement || $('#explainButton');
    const help = $('#briefHelpCenter');
    const helpVisible = Boolean(help && !help.hidden && help.classList.contains('is-visible'));
    window.clearTimeout(state.openTimer);
    if (helpVisible) {
      window.BRIEF_ONBOARDING?.closeHelp?.(false);
      state.openTimer = window.setTimeout(beginOpen, reducedMotion() ? 0 : 190);
      return;
    }
    beginOpen();
  }

  function close() {
    window.clearTimeout(state.openTimer);
    state.opening = false;
    const layer = $('#briefVisionLayer');
    if (!layer || !state.open) return;
    state.open = false;
    layer.classList.remove('is-visible');
    window.setTimeout(() => {
      layer.hidden = true;
      document.body.classList.remove('brief-vision-open');
      setAppInert(false);
      state.returnFocus?.focus?.();
      window.dispatchEvent(new CustomEvent('brief:vision-close'));
    }, reducedMotion() ? 0 : 150);
  }

  function install() {
    createLayer();
    window.BRIEF_VISION_TOUR = { open, close, show, choose };
    document.addEventListener('click', event => {
      const launcher = event.target.closest?.('#briefStartVision, [data-start-vision]');
      if (!launcher) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open(launcher.id === 'briefStartVision' ? $('#explainButton') : launcher);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
