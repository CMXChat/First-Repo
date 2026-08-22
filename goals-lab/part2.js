(() => {
  'use strict';

  const STORAGE_KEY = 'cmx_goal_intelligence_lab_v1';
  const RESTORE_SCROLL_KEY = 'cmx_goal_intelligence_restore_scroll_v1';
  const PART3_SCRIPT_ID = 'goalsLabPart3Script';

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  function answerLabel(answer) {
    const labels = {
      install: 'a package or installation failure',
      command: 'a failed run command',
      environment: 'an unclear local environment',
      access: 'missing access or credentials',
      decision: 'a missing technical decision',
      developer: 'developer work or review',
      too_large: 'an action that was too large',
      unclear: 'an unclear first step',
      other_work: 'other work taking priority',
      understand: 'understanding each line',
      prove: 'getting one route working',
      handoff: 'a developer-ready handoff',
      proceed: 'proceeding with the revised action',
      more_detail: 'capturing one more detail',
      blocker_changed: 'a changed blocker'
    };
    return labels[answer] || String(answer || 'the latest answer');
  }

  function distinctFollowUp(state) {
    const latest = state.answers?.[0];
    const label = answerLabel(latest?.answer);
    return {
      id: uid('question_followup'),
      prompt: `You identified ${label}. What should happen next?`,
      reason: 'The system should use the answer and advance the loop instead of asking the same blocker question again.',
      options: [
        { value: 'proceed', label: 'Proceed with the revised action' },
        { value: 'more_detail', label: 'Capture one more useful detail first' },
        { value: 'blocker_changed', label: 'The blocker has changed' }
      ],
      priority: 'medium',
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  function advanceRepeatedQuestion() {
    const state = readState();
    if (!state?.activeQuestion || !Array.isArray(state.answers) || !state.answers.length) return;

    const answeredPrompts = new Set(state.answers.map(item => item.question).filter(Boolean));
    if (!answeredPrompts.has(state.activeQuestion.prompt)) return;

    const repeatedPrompt = state.activeQuestion.prompt;
    state.activeQuestion = distinctFollowUp(state);
    state.history = Array.isArray(state.history) ? state.history : [];
    state.history.unshift({
      id: uid('history'),
      type: 'question_advanced',
      title: 'Question loop advanced',
      detail: `The answered prompt was not repeated: ${repeatedPrompt}`,
      createdAt: new Date().toISOString()
    });
    state.history = state.history.slice(0, 80);

    if (!writeState(state)) return;
    sessionStorage.setItem(RESTORE_SCROLL_KEY, String(window.scrollY || 0));
    window.location.reload();
  }

  function restoreScroll() {
    const stored = sessionStorage.getItem(RESTORE_SCROLL_KEY);
    if (stored === null) return;
    sessionStorage.removeItem(RESTORE_SCROLL_KEY);
    const top = Number(stored);
    window.requestAnimationFrame(() => window.scrollTo({ top: Number.isFinite(top) ? top : 0, behavior: 'auto' }));
  }

  function loadPart3() {
    if (document.getElementById(PART3_SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = PART3_SCRIPT_ID;
    script.src = './part3.js?v=20260804-1';
    script.defer = true;
    document.head.append(script);
  }

  function finishSetup() {
    restoreScroll();
    loadPart3();
  }

  document.addEventListener('click', event => {
    if (!event.target.closest?.('#submitQuestionAnswer')) return;
    window.setTimeout(advanceRepeatedQuestion, 80);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finishSetup, { once: true });
  } else {
    finishSetup();
  }
})();
