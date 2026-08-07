(() => {
  'use strict';

  /*
   * This module owns two focused interaction layers:
   * 1. the entry carousel that introduces practical Spaces ideas;
   * 2. the section-aware conversation preview.
   *
   * The conversation preview never calls a model or reads connected records.
   * It demonstrates the context and permission handoff a signed-in product
   * would use. Keep production model calls and tools outside this static file.
   */

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const carouselState = {
    index: 0,
    timer: 0,
    paused: false
  };

  const conversationState = {
    trigger: null,
    scenario: null,
    title: '',
    kind: '',
    restoreFocus: true
  };

  function currentScenario() {
    const id = document.body.dataset.scenario || data.meta.defaultScenario;
    return data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
  }

  function clearCarouselTimer() {
    if (!carouselState.timer) return;
    window.clearTimeout(carouselState.timer);
    carouselState.timer = 0;
  }

  function scheduleCarousel() {
    clearCarouselTimer();
    if (carouselState.paused || reduceMotion.matches || document.hidden) return;
    carouselState.timer = window.setTimeout(() => {
      showTip(carouselState.index + 1);
    }, 6200);
  }

  function showTip(nextIndex, options = {}) {
    const track = $('#entryTipTrack');
    const tips = $$('[data-entry-tip]');
    if (!track || !tips.length) return;

    carouselState.index = (nextIndex + tips.length) % tips.length;
    track.style.transform = `translateX(-${carouselState.index * 100}%)`;
    tips.forEach((tip, index) => {
      const active = index === carouselState.index;
      tip.setAttribute('aria-hidden', String(!active));
      tip.toggleAttribute('data-active', active);
    });

    const position = $('#entryTipPosition');
    if (position) position.textContent = `${carouselState.index + 1} / ${tips.length}`;
    if (options.focus === true) tips[carouselState.index]?.focus({ preventScroll: true });
    scheduleCarousel();
  }

  function pauseCarousel() {
    carouselState.paused = true;
    clearCarouselTimer();
  }

  function resumeCarousel() {
    carouselState.paused = false;
    scheduleCarousel();
  }

  function promptOptions(kind, scenario, title) {
    const prompts = {
      overview: [
        `Why is “${scenario.recommendation.title}” the recommended next move?`,
        `What changed most in this ${scenario.label} Space?`,
        'What can wait until later?'
      ],
      next: [
        `What should I prepare before ${scenario.next.title}?`,
        'Which source supports this timing?',
        'What could block this next step?'
      ],
      priority: [
        'Why did this notice earn the top position?',
        'What happens if I leave this unresolved?',
        'What action can Spaces prepare for review?'
      ],
      weather: [
        'How do these conditions change the plan?',
        'Which event is most affected?',
        'What should I prepare before leaving?'
      ],
      numbers: [
        'Which number needs attention first?',
        'Explain the change behind these figures.',
        'Show the source and freshness for each number.'
      ],
      flow: [
        'Where is the tightest handoff today?',
        'Which item can move safely?',
        'Prepare a shorter plan for this day.'
      ],
      recommendation: [
        'Show the evidence behind this recommendation.',
        'What other choice did Spaces consider?',
        'Prepare the next step for my review.'
      ],
      workspace: [
        `What changed in ${title}?`,
        'What needs my approval in this section?',
        'Show the records and sources behind this view.'
      ],
      permissions: [
        'Who can see the records in this Space?',
        'Which details remain private?',
        'How would I review or change access?'
      ],
      how: [
        'How did this Brief choose the order?',
        'Which parts adapt to the current context?',
        'What would require sign-in and approval?'
      ],
      everything: [
        'Summarize only the items that need a decision.',
        'What changed across the complete Brief?',
        'Which sections can wait until later?'
      ],
      section: [
        `Explain what matters in ${title}.`,
        'Show the source and permission scope.',
        'What useful next step can Spaces prepare?'
      ]
    };

    return prompts[kind] || prompts.section;
  }

  function renderPrompts(prompts) {
    const host = $('#spacesAiPrompts');
    if (!host) return;
    host.replaceChildren(...prompts.map(prompt => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.aiPrompt = prompt;
      button.textContent = prompt;
      return button;
    }));
  }

  function resetConversationPreview() {
    const preview = $('#spacesAiPreview');
    const input = $('#spacesAiInput');
    if (preview) {
      preview.hidden = true;
      preview.replaceChildren();
    }
    if (input) input.value = '';
  }

  function openConversation(trigger) {
    const dialog = $('#spacesAiDialog');
    if (!dialog || dialog.open) return;

    const scenario = currentScenario();
    const title = trigger.dataset.aiTitle || 'Current section';
    const kind = trigger.dataset.aiKind || 'section';
    conversationState.trigger = trigger;
    conversationState.scenario = scenario;
    conversationState.title = title;
    conversationState.kind = kind;
    conversationState.restoreFocus = true;

    trigger.setAttribute('aria-expanded', 'true');
    const context = $('#spacesAiContext');
    if (context) context.textContent = `${scenario.label} · ${title}`;
    renderPrompts(promptOptions(kind, scenario, title));
    resetConversationPreview();

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    queueMicrotask(() => $('[data-ai-prompt]', dialog)?.focus({ preventScroll: true }));
  }

  function closeConversation(options = {}) {
    const dialog = $('#spacesAiDialog');
    if (!dialog?.open) return;
    conversationState.restoreFocus = options.restoreFocus !== false;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      finishConversationClose(conversationState.restoreFocus);
    }
  }

  function finishConversationClose(restoreFocus = true) {
    conversationState.trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus && document.body.dataset.entered === 'true') {
      conversationState.trigger?.focus({ preventScroll: true });
    }
    conversationState.trigger = null;
    conversationState.restoreFocus = true;
  }

  function choosePrompt(button) {
    const input = $('#spacesAiInput');
    if (!input) return;
    input.value = button.dataset.aiPrompt || '';
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function buildConversationPreview(prompt) {
    const preview = $('#spacesAiPreview');
    const scenario = conversationState.scenario || currentScenario();
    if (!preview) return;
    preview.replaceChildren();

    const user = document.createElement('article');
    user.className = 'spaces-ai-user-message';
    const userLabel = document.createElement('span');
    userLabel.textContent = 'YOUR PROMPT';
    const userCopy = document.createElement('p');
    userCopy.textContent = prompt;
    user.append(userLabel, userCopy);

    const handoff = document.createElement('article');
    handoff.className = 'spaces-ai-handoff';
    const handoffLabel = document.createElement('span');
    handoffLabel.textContent = 'DEMO HANDOFF';
    const handoffTitle = document.createElement('strong');
    handoffTitle.textContent = 'Conversation context prepared';
    const handoffCopy = document.createElement('p');
    handoffCopy.textContent = `A signed-in ${scenario.label} Space would send this prompt with the approved records in “${conversationState.title},” show the source scope, and keep external actions behind confirmation.`;
    handoff.append(handoffLabel, handoffTitle, handoffCopy);

    preview.append(user, handoff);
    preview.hidden = false;
    preview.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  function installCarousel() {
    const carousel = $('#entryTipCarousel');
    if (!carousel) return;
    $('[data-entry-tip-previous]', carousel)?.addEventListener('click', () => showTip(carouselState.index - 1));
    $('[data-entry-tip-next]', carousel)?.addEventListener('click', () => showTip(carouselState.index + 1));
    carousel.addEventListener('pointerenter', pauseCarousel);
    carousel.addEventListener('pointerleave', resumeCarousel);
    carousel.addEventListener('focusin', pauseCarousel);
    carousel.addEventListener('focusout', event => {
      if (!carousel.contains(event.relatedTarget)) resumeCarousel();
    });
    document.addEventListener('visibilitychange', scheduleCarousel);
    reduceMotion.addEventListener?.('change', scheduleCarousel);
    showTip(0);
  }

  function installConversation() {
    const dialog = $('#spacesAiDialog');
    if (!dialog) return;

    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-ai-trigger]');
      if (trigger) {
        openConversation(trigger);
        return;
      }
      const prompt = event.target.closest('[data-ai-prompt]');
      if (prompt) choosePrompt(prompt);
    });

    $('#closeSpacesAi')?.addEventListener('click', () => closeConversation());
    $('#spacesAiForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const input = $('#spacesAiInput');
      const prompt = input?.value.trim() || '';
      if (!prompt) {
        input?.focus({ preventScroll: true });
        input?.setAttribute('aria-invalid', 'true');
        return;
      }
      input.removeAttribute('aria-invalid');
      buildConversationPreview(prompt);
    });

    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeConversation();
    });
    dialog.addEventListener('close', () => finishConversationClose(conversationState.restoreFocus));

    for (const eventName of ['briefdemo:scenariochange', 'briefdemo:viewchange', 'briefdemo:tabchange']) {
      document.addEventListener(eventName, () => closeConversation({ restoreFocus: false }));
    }
  }

  function init() {
    installCarousel();
    installConversation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
