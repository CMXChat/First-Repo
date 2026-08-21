'use strict';

(() => {
  if (document.documentElement.dataset.continuumDurableIdentity === 'ready') return;

  function ensureStyle() {
    if (document.querySelector('link[data-continuum-durable-identity-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/continuum-doc-durable-identity.css?v=20260821-2';
    link.dataset.continuumDurableIdentityStyle = 'loader';
    document.head.append(link);
  }

  function install() {
    const section = document.getElementById('difference');
    if (!section) return false;

    ensureStyle();

    let note = section.querySelector('.continuum-durable-identity-note');
    if (!note) {
      note = document.createElement('aside');
      note.className = 'continuum-durable-identity-note';
      note.setAttribute('aria-label', 'AI continuity across model changes');
      note.innerHTML = `
        <span class="continuum-durable-identity-kicker">AI CONTINUITY · LATER</span>
        <strong>Keep a consistent AI identity and way of working even when the model changes.</strong>
        <p>Continuum can later keep a versioned identity for an AI: its principles, communication character, selected long-term memories and learned ways of working. A compatible model can load that identity in a new context instead of starting from zero.</p>
        <p class="continuum-ai-continuity-grounding">Later, Continuum can also learn from corrections and real outcomes so recommendations improve over time, while keeping track of what changed, what it is waiting on and what needs attention next.</p>
        <small>Identity can shape judgment, strategy and communication. The server still controls facts, AI participation, permissions and authority.</small>`;

      const anchor = section.querySelector('.rule-callout') || section.querySelector('.authority-principle') || section.querySelector('.section-intro');
      if (anchor) anchor.insertAdjacentElement('afterend', note);
      else section.append(note);
    }

    document.documentElement.dataset.continuumDurableIdentity = 'ready';
    document.documentElement.dataset.continuumIdentityPortability = 'model-agnostic-v1';
    document.documentElement.dataset.continuumAiContinuity = 'grounded-v2';
    return true;
  }

  if (!install()) {
    window.addEventListener('DOMContentLoaded', install, { once: true });
  }
})();
