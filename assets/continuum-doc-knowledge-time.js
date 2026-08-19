'use strict';

(() => {
  if (document.documentElement.dataset.continuumKnowledgeTime === 'ready') return;

  const styleHref = '/assets/continuum-doc-knowledge-time.css?v=20260819-1';
  if (!document.querySelector(`link[href="${styleHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = styleHref;
    document.head.append(link);
  }

  function addKnowledgePanel() {
    const section = document.getElementById('spaces');
    if (!section || section.querySelector('.continuum-kt-knowledge')) return;

    const anchor = section.querySelector('.ingestion-map') || section.querySelector('.section-heading');
    if (!anchor) return;

    const panel = document.createElement('aside');
    panel.className = 'continuum-kt-panel continuum-kt-knowledge';
    panel.setAttribute('aria-label', 'Continuum knowledge ingestion direction');
    panel.innerHTML = `
      <div class="continuum-kt-head">
        <div>
          <span class="continuum-kt-eyebrow">BRING KNOWLEDGE IN</span>
          <strong>Give Continuum text, AI handoffs, files and images. It keeps the source and proposes what should become durable knowledge.</strong>
        </div>
        <span class="continuum-kt-status">NEXT + LATER</span>
      </div>
      <p class="continuum-kt-copy">The ingestion layer is designed for more than document upload. Direct text, bulk input, Markdown, JSON, AI context exports, files, OCR or vision and approved connected Sources can enter through one provenance-backed path.</p>
      <div class="continuum-kt-source-grid" aria-label="Examples of future Continuum knowledge inputs">
        <span>Paste + bulk text</span>
        <span>Markdown + JSON</span>
        <span>AI handoffs</span>
        <span>Files + OCR / vision</span>
        <span>Connected Sources</span>
      </div>
      <div class="continuum-kt-flow" aria-label="Knowledge ingestion review flow">
        <span>CAPTURE</span><i aria-hidden="true">→</i><span>UNDERSTAND</span><i aria-hidden="true">→</i><span>REVIEW</span><i aria-hidden="true">→</i><span>INTEGRATE</span>
      </div>
      <div class="continuum-kt-foot"><i aria-hidden="true"></i><span>New knowledge is private by default. Source provenance stays attached, permanent mappings are conservative and AI receives only the authorized context needed for the job.</span></div>`;

    anchor.after(panel);
  }

  function addTimePanel() {
    const section = document.getElementById('overview');
    if (!section || section.querySelector('.continuum-kt-time')) return;

    const anchor = section.querySelector('.continuum-state-strip') || section.querySelector('.process-map');
    if (!anchor) return;

    const panel = document.createElement('aside');
    panel.className = 'continuum-kt-panel continuum-kt-time';
    panel.setAttribute('aria-label', 'Continuum temporal awareness direction');
    panel.innerHTML = `
      <div class="continuum-kt-head">
        <div>
          <span class="continuum-kt-eyebrow">REAL TEMPORAL AWARENESS</span>
          <strong>Continuum should know what time actually passed instead of asking AI to guess.</strong>
        </div>
        <span class="continuum-kt-status">CORE RULE</span>
      </div>
      <p class="continuum-kt-copy">Backend timestamps and server-owned time can distinguish what happened two seconds ago from what happened two hours ago, even when no model stayed active between those moments.</p>
      <div class="continuum-kt-clock-grid" aria-label="Examples of time-aware Continuum behavior">
        <span><b>ELAPSED</b><small>You leave for two minutes and return two seconds later. Continuum knows roughly two seconds passed.</small></span>
        <span><b>STATE</b><small>Upcoming can become due, overdue or stale because real time advanced.</small></span>
        <span><b>CONTEXT</b><small>Deadlines, waits, freshness, history and local time zones use explicit temporal data.</small></span>
      </div>
      <div class="continuum-kt-foot"><i aria-hidden="true"></i><span>Check In already proves server-owned elapsed timing. General time-aware conversations, knowledge, Goals, Signals and Runtime remain architecture being built out over time.</span></div>`;

    anchor.after(panel);
  }

  addKnowledgePanel();
  addTimePanel();
  document.documentElement.dataset.continuumKnowledgeTime = 'ready';
})();
