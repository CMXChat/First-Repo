'use strict';

(() => {
  if (document.documentElement.dataset.continuumKnowledgeTime === 'ready') return;

  const styleHref = '/assets/continuum-doc-knowledge-time.css?v=20260819-2';
  if (!document.querySelector(`link[href="${styleHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = styleHref;
    document.head.append(link);
  }

  const qs = (selector, scope = document) => scope?.querySelector(selector) || null;
  const qsa = (selector, scope = document) => Array.from(scope?.querySelectorAll(selector) || []);

  function setText(selector, text, scope = document) {
    const node = qs(selector, scope);
    if (node) node.textContent = text;
    return node;
  }

  function refineHero() {
    setText('.hero-kicker', 'Your information, intent and authority across time');

    const lead = qs('.continuum-hero .hero-lead');
    if (lead) {
      lead.innerHTML = '<span class="hero-lead-first">Continuum keeps the information, people, rules and authority that should survive the moment. It can help while you are here, carry approved work when you are away and preserve the continuity plan you prepared for a time when you can no longer respond.</span><span class="hero-lead-second">Spaces, Automations, AI, Check In and Afterlife use that same durable foundation. Models and tools can change. Continuum keeps the context, current State, policy and history that make the next decision coherent.</span>';
    }

    const truths = qs('.hero-truth-row');
    if (truths) {
      truths.innerHTML = '<span><i></i>Understands what changed + when</span><span><i></i>Carries approved intent forward</span><span><i></i>Keeps authority + history coherent</span>';

      if (!qs('.continuum-continuity-line')) {
        const line = document.createElement('div');
        line.className = 'continuum-continuity-line';
        line.setAttribute('aria-label', 'Continuum across presence and continuity');
        line.innerHTML = '<span>WITH YOU</span><i aria-hidden="true">→</i><span>FOR YOU</span><i aria-hidden="true">→</i><span>WHEN AWAY</span><i aria-hidden="true">→</i><span>IF YOU CANNOT RESPOND</span>';
        truths.after(line);
      }
    }

    const principle = qs('.capability-principle');
    if (principle) {
      setText('span', 'BUILT TO CARRY INTENT FORWARD', principle);
      setText('strong', 'The same control layer can support today\'s decisions, long-running work and the continuity plan you prepared in advance.', principle);
    }

    setText('.node-spaces small', 'Focused views from the wider Continuum context');
    setText('.node-library small', 'Knowledge and files that persist');
    setText('.node-runtime small', 'Keeps approved work alive across time');
  }

  function refinePresence() {
    const presence = qs('.continuum-presence');
    if (!presence) return;

    setText('.presence-heading > div > span', 'ACROSS TIME', presence);
    setText('.presence-heading strong', 'One operating layer across presence, absence and continuity.', presence);
    setText('.presence-heading > p', 'The same foundation can support a morning brief, a project that runs for days, a period when you are unreachable and the Afterlife path you prepared in advance.', presence);

    const stages = qsa('.presence-stage', presence);
    const copy = [
      ['WITH YOU', 'Understand what matters now', 'Bring the right context together for the decision in front of you.', 'SPACES + AI'],
      ['FOR YOU', 'Carry approved work forward', 'Use the people, information and tools already allowed for the job.', 'AUTOMATIONS'],
      ['WHEN YOU ARE AWAY', 'Wait, monitor, resume', 'Runtime can later keep longer work alive through time, replies and retries.', 'LATER · RUNTIME'],
      ['IF YOU CANNOT RESPOND', 'Follow prepared continuity', 'Use the instructions, people and authority you established in advance.', 'CONTINUITY']
    ];

    stages.forEach((stage, index) => {
      if (!copy[index]) return;
      setText('span', copy[index][0], stage);
      setText('h3', copy[index][1], stage);
      setText('p', copy[index][2], stage);
      setText('small', copy[index][3], stage);
    });

    setText('.presence-truth span', 'Check In timing is live today. Provider actions, long-running Runtime and policy-driven fallback remain later work.', presence);
  }

  function refineOverview() {
    setText('#overview .section-intro', 'Continuum keeps track of change, time, authority and results so each decision can start from current State and durable history.');
  }

  function refineSpaces() {
    setText('#spaces .section-kicker', 'Knowledge, identity and focused views');
    setText('#spaces h2', 'Bring information in, keep it durable, use it where it belongs');
    setText('#spaces .section-intro', 'Library keeps durable knowledge and source history. Directory keeps people and relationships. Spaces presents a focused view of the pieces relevant to one part of your life or work.');
    setText('#spaces .ingestion-map .visual-label', 'APPROVED INFORMATION SOURCES');
  }

  function refineAfterlife() {
    const section = document.getElementById('afterlife');
    if (!section) return;

    setText('.section-intro', 'Afterlife is the continuity edge of Continuum. You prepare the people, information, instructions and authority while you can. Check In records the trigger if you stop responding long enough. Future Runtime can carry the approved continuity plan forward.', section);

    const head = qs('.continuity-authority-head', section);
    if (head) {
      setText('span', 'PREPARED AUTHORITY', head);
      setText('strong', 'Decide the fallback path while you can still decide it.', head);
      setText('p', 'The policy records what may happen during ordinary use, temporary unavailability and long-term continuity.', head);
    }

    const guardrail = qs('.continuity-guardrail', section);
    if (guardrail) {
      guardrail.innerHTML = '<strong>Silence and urgency never create authority.</strong> Fallback steps come from the policy you published earlier.';
    }
  }

  function refineClose() {
    setText('#status .closing-note', 'Continuum carries durable knowledge, current State, authority, policy and history across time. New models, tools and interfaces can expand what it can see and do while those foundations stay coherent.');
  }

  function addKnowledgePanel() {
    const section = document.getElementById('spaces');
    if (!section || qs('.continuum-kt-knowledge', section)) return;

    const anchor = qs('.ingestion-map', section) || qs('.section-heading', section);
    if (!anchor) return;

    const panel = document.createElement('aside');
    panel.className = 'continuum-kt-panel continuum-kt-knowledge';
    panel.setAttribute('aria-label', 'Continuum knowledge ingestion direction');
    panel.innerHTML = `
      <div class="continuum-kt-head">
        <div>
          <span class="continuum-kt-eyebrow">BRING KNOWLEDGE IN</span>
          <strong>Paste text, hand Continuum an AI export, drop in files or share an image. It keeps the source and shows what it found before durable changes are applied.</strong>
        </div>
        <span class="continuum-kt-status">NEXT + LATER</span>
      </div>
      <p class="continuum-kt-copy">Direct text, bulk input, Markdown, JSON, AI handoffs, files, OCR or vision and approved connected Sources use one provenance-backed ingestion path.</p>
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
      <div class="continuum-kt-foot"><i aria-hidden="true"></i><span>New knowledge starts private. Source provenance stays attached. Permanent mappings stay conservative. AI receives the authorized slice needed for the job.</span></div>`;

    anchor.after(panel);
  }

  function addTimePanel() {
    const section = document.getElementById('overview');
    if (!section || qs('.continuum-kt-time', section)) return;

    const anchor = qs('.continuum-state-strip', section) || qs('.process-map', section);
    if (!anchor) return;

    const panel = document.createElement('aside');
    panel.className = 'continuum-kt-panel continuum-kt-time';
    panel.setAttribute('aria-label', 'Continuum temporal awareness direction');
    panel.innerHTML = `
      <div class="continuum-kt-head">
        <div>
          <span class="continuum-kt-eyebrow">REAL TEMPORAL AWARENESS</span>
          <strong>Continuum uses a real clock, so time comes from backend state and timestamps.</strong>
        </div>
        <span class="continuum-kt-status">CORE RULE</span>
      </div>
      <p class="continuum-kt-copy">Two seconds, two hours and two weeks remain different even when no AI model stayed active between events.</p>
      <div class="continuum-kt-clock-grid" aria-label="Examples of time-aware Continuum behavior">
        <span><b>ELAPSED</b><small>You leave for two minutes and return two seconds later. Continuum knows roughly two seconds passed.</small></span>
        <span><b>STATE</b><small>Upcoming can become due, overdue or stale because real time advanced.</small></span>
        <span><b>CONTEXT</b><small>Deadlines, waits, freshness, history and local time zones use explicit temporal data.</small></span>
      </div>
      <div class="continuum-kt-foot"><i aria-hidden="true"></i><span>Check In already proves server-owned elapsed timing. The same temporal model extends to conversations, knowledge, Goals, Signals and Runtime as those layers become real.</span></div>`;

    anchor.after(panel);
  }

  refineHero();
  refinePresence();
  refineOverview();
  refineSpaces();
  refineAfterlife();
  refineClose();
  addKnowledgePanel();
  addTimePanel();

  document.documentElement.dataset.continuumKnowledgeTime = 'ready';
  document.documentElement.dataset.continuumPositioning = 'continuity-first';
})();
