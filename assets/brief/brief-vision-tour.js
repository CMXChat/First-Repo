(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  const STEPS = [
    {
      kicker: '01 · MORNING',
      title: 'You wake up. The day is already sorted.',
      body: 'Weather, plans, priorities, public changes and the one thing most likely to throw the day off are already condensed before you start moving.',
      note: 'You start with a clearer day.',
      visual: 'morning'
    },
    {
      kicker: '02 · SOUND',
      title: 'Your morning can have its own sound.',
      body: 'Your Spotify favorites can shape the mood. An approved voice can read the briefing. Music, narration and silence stay under your control.',
      note: 'A briefing can feel personal without pretending to be a person.',
      visual: 'sound'
    },
    {
      kicker: '03 · CONTEXT',
      title: 'Context turns reminders into strategy.',
      body: 'A calendar reminder says what happens next. A contextual briefing can connect the meeting to the project risk, the cash position, the relationship promise or the workout you keep postponing.',
      note: 'The useful question is usually: what changes because of this?',
      visual: 'context'
    },
    {
      kicker: '04 · SPACES',
      title: 'Different people see different truths.',
      body: 'A private profile stays private. A couple shares only approved items. A teammate sees their work and handoffs. Leadership sees the operating picture without inheriting everyone’s personal notes.',
      note: 'One platform can hold many views without flattening every boundary.',
      visual: 'spaces'
    },
    {
      kicker: '05 · GROWTH',
      title: 'Corrections teach it what matters.',
      body: 'Lessons, quizzes, workouts, habits and accountability can improve with approved history. A correction should outweigh an old guess, and temporary context should be allowed to expire.',
      note: 'Useful memory should stay revisable.',
      visual: 'growth'
    },
    {
      kicker: '06 · ACTION',
      title: 'When you approve it, the briefing can act.',
      body: 'A protected backend could accept files, connected accounts and structured input, then prepare actions through the dashboard or terminal. Sensitive changes still require permissions, logs and approval gates.',
      note: 'The briefing should earn trust before it earns authority.',
      visual: 'action'
    }
  ];

  const state = {
    open: false,
    current: 0,
    returnFocus: null,
    attempts: 0,
    timer: 0,
    appAriaHidden: null
  };

  function focusable(root) {
    return $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', root)
      .filter(node => node.offsetParent !== null && !node.hidden);
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const panel = $('#briefVisionPanel');
    const items = focusable(panel);
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

  function setAppInert(enabled) {
    const app = $('#briefApp');
    if (!app) return;
    if (enabled) {
      state.appAriaHidden = app.getAttribute('aria-hidden');
      if ('inert' in app) app.inert = true;
      else app.setAttribute('aria-hidden', 'true');
    } else {
      if ('inert' in app) app.inert = false;
      if (state.appAriaHidden === null) app.removeAttribute('aria-hidden');
      else app.setAttribute('aria-hidden', state.appAriaHidden);
      state.appAriaHidden = null;
    }
  }

  function visual(type) {
    if (type === 'morning') return `<div class="vision-morning"><div class="vision-time">7:12</div><div class="vision-chip">48° · rain after 7</div><article><span>FIRST MOVE</span><strong>Protect 45 quiet minutes</strong><small>Before the project review</small></article><article><span>WATCH</span><strong>One deadline slipped overnight</strong><small>Owner and next step already attached</small></article></div>`;
    if (type === 'sound') return `<div class="vision-sound"><div class="vision-wave" aria-hidden="true">${'<i></i>'.repeat(18)}</div><div class="vision-track"><span>♫</span><div><small>YOUR MORNING SOUND</small><strong>Favorites, focus or silence</strong></div></div><div class="vision-voice"><span>VOICE</span><button type="button" tabindex="-1">Calm</button><button type="button" tabindex="-1">Direct</button><button type="button" tabindex="-1">Off</button></div></div>`;
    if (type === 'context') return `<div class="vision-context"><div class="vision-node">Meeting</div><div class="vision-link">changes</div><div class="vision-node">Project risk</div><div class="vision-link">affects</div><div class="vision-node">Cash timing</div><article><span>STRATEGY</span><strong>Delay the contractor decision until collection clears.</strong><small>One recommendation, with the evidence beside it.</small></article></div>`;
    if (type === 'spaces') return `<div class="vision-spaces"><article><span>PRIVATE</span><strong>Alex</strong><small>Personal notes and corrections</small></article><article><span>SHARED</span><strong>Together</strong><small>Only approved plans and promises</small></article><article><span>ROLE</span><strong>Designer</strong><small>Tasks, blockers and handoffs</small></article><article><span>LEADERSHIP</span><strong>Launch room</strong><small>Risk, readiness and approvals</small></article></div>`;
    if (type === 'growth') return `<div class="vision-growth"><article><span>WORKOUT</span><strong>3 of 4 sessions</strong><div><i style="width:75%"></i></div></article><article><span>LEARNING</span><strong>Recall improves after correction</strong><div><i style="width:86%"></i></div></article><article><span>ACCOUNTABILITY</span><strong>Did you do the planned set?</strong><small>Yes · No · Adjust tomorrow</small></article></div>`;
    return `<div class="vision-action"><div class="vision-action-flow"><span>File or connector</span><i>→</i><span>Prepared action</span><i>→</i><span>Human approval</span></div><article><small>TERMINAL OR DASHBOARD</small><strong>Ready to schedule the approved launch update.</strong><button type="button" tabindex="-1">Review action</button></article><div class="vision-security">Permissions · encrypted transport · audit log · approval gate</div></div>`;
  }

  function createLayer() {
    if ($('#briefVisionLayer')) return;
    const layer = document.createElement('div');
    layer.id = 'briefVisionLayer';
    layer.className = 'brief-vision-layer';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="brief-vision-backdrop" type="button" data-vision-close aria-label="Close vision walkthrough"></button>
      <section id="briefVisionPanel" class="brief-vision-panel" role="dialog" aria-modal="true" aria-labelledby="briefVisionTitle" aria-describedby="briefVisionBody">
        <header class="brief-vision-head"><div><span>THE BIGGER IDEA</span><small id="briefVisionCount">1 / ${STEPS.length}</small></div><button type="button" data-vision-close aria-label="Close vision walkthrough">×</button></header>
        <div class="brief-vision-layout">
          <div class="brief-vision-copy"><p id="briefVisionKicker"></p><h2 id="briefVisionTitle"></h2><p id="briefVisionBody"></p><blockquote id="briefVisionNote"></blockquote></div>
          <div id="briefVisionVisual" class="brief-vision-visual" aria-hidden="true"></div>
        </div>
        <div id="briefVisionProgress" class="brief-vision-progress" aria-label="Vision walkthrough progress"></div>
        <footer><button id="briefVisionBack" type="button">Back</button><button id="briefVisionSkip" type="button">Close</button><button id="briefVisionNext" type="button">Next</button></footer>
      </section>`;
    document.body.appendChild(layer);

    $$('[data-vision-close]', layer).forEach(button => button.addEventListener('click', close));
    $('#briefVisionBack', layer)?.addEventListener('click', () => show(state.current - 1));
    $('#briefVisionSkip', layer)?.addEventListener('click', close);
    $('#briefVisionNext', layer)?.addEventListener('click', () => {
      if (state.current >= STEPS.length - 1) close();
      else show(state.current + 1);
    });
    layer.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
      else trapFocus(event);
    });
  }

  function show(index) {
    const next = Math.max(0, Math.min(STEPS.length - 1, index));
    const step = STEPS[next];
    state.current = next;
    $('#briefVisionCount').textContent = `${next + 1} / ${STEPS.length}`;
    $('#briefVisionKicker').textContent = step.kicker;
    $('#briefVisionTitle').textContent = step.title;
    $('#briefVisionBody').textContent = step.body;
    $('#briefVisionNote').textContent = step.note;
    $('#briefVisionVisual').innerHTML = visual(step.visual);
    $('#briefVisionBack').disabled = next === 0;
    $('#briefVisionNext').textContent = next === STEPS.length - 1 ? 'Finish' : 'Next';
    $('#briefVisionProgress').innerHTML = STEPS.map((_, position) => `<button type="button" data-vision-step="${position}" aria-label="Open vision step ${position + 1}" aria-current="${position === next ? 'step' : 'false'}"></button>`).join('');
    $$('[data-vision-step]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.visionStep))));
    const panel = $('#briefVisionPanel');
    if (panel) panel.scrollTop = 0;
    window.setTimeout(() => $('#briefVisionNext')?.focus(), reducedMotion() ? 0 : 180);
  }

  function open() {
    createLayer();
    if (state.open || document.body.classList.contains('is-locked')) return;
    state.open = true;
    state.returnFocus = document.activeElement || $('#explainButton');
    window.BRIEF_ONBOARDING?.closeHelp?.(false);
    const layer = $('#briefVisionLayer');
    layer.hidden = false;
    document.body.classList.add('brief-vision-open');
    setAppInert(true);
    show(0);
    window.requestAnimationFrame(() => layer.classList.add('is-visible'));
    window.dispatchEvent(new CustomEvent('brief:vision-open'));
  }

  function close() {
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
    }, reducedMotion() ? 0 : 160);
  }

  function installHelpEntry() {
    const actions = $('.brief-help-actions');
    if (!actions || $('#briefStartVision')) return false;
    const button = document.createElement('button');
    button.id = 'briefStartVision';
    button.className = 'brief-help-vision';
    button.type = 'button';
    button.innerHTML = '<span>VISION WALKTHROUGH</span><strong>Imagine the full day</strong><small>Six scenes showing what this becomes when your context, music, voice and approved connections are real.</small>';
    const tips = $('#briefTipsToggle', actions);
    if (tips) actions.insertBefore(button, tips);
    else actions.appendChild(button);
    button.addEventListener('click', open);

    const title = $('#briefHelpCenterTitle');
    if (title) title.textContent = 'Learn the controls or see the bigger idea.';
    const intro = $('#briefHelpCenterIntro');
    if (intro) intro.textContent = 'Take the short product tour, walk through the vision, control future tips, or review what is real and what still needs the protected backend.';
    return true;
  }

  function scheduleInstall(delay = 0) {
    window.clearTimeout(state.timer);
    state.timer = window.setTimeout(() => {
      if (installHelpEntry()) return;
      state.attempts += 1;
      if (state.attempts < 24) scheduleInstall(250);
    }, delay);
  }

  function init() {
    createLayer();
    scheduleInstall(80);
    document.addEventListener('click', event => {
      if (event.target.closest?.('#explainButton, #interactionHint')) window.setTimeout(() => scheduleInstall(40), 80);
    }, true);
    window.addEventListener('brief:ready', () => scheduleInstall(120), { once: true });
  }

  window.BRIEF_VISION_TOUR = { open, close, show };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
