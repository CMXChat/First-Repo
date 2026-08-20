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
    setText('.hero-kicker', 'Your information, plans and permissions across time');

    const lead = qs('.continuum-hero .hero-lead');
    if (lead) {
      lead.innerHTML = '<span class="hero-lead-first">Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved while you are away, and follow plans you prepared for a time when you cannot respond.</span><span class="hero-lead-second">Library holds your information. Directory keeps track of people and relationships. Spaces brings the relevant pieces into focus. Automations define approved work. Check In and Afterlife support continuity plans prepared in advance. AI models and tools can change while those records and rules stay with Continuum.</span>';
    }

    const truths = qs('.hero-truth-row');
    if (truths) {
      truths.innerHTML = '<span><i></i>Knows what changed and when</span><span><i></i>Can continue work you approved</span><span><i></i>Keeps track of what is allowed and why</span>';

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
      setText('span', 'BUILT TO CARRY YOUR PLAN FORWARD', principle);
      setText('strong', 'The same information and rules can support what you do now, work that continues later, and continuity plans prepared in advance.', principle);
    }

    setText('.node-spaces small', 'Focused views of the information you need');
    setText('.node-library small', 'Documents, files and knowledge you keep');
    setText('.node-runtime small', 'Keeps approved work moving over time');
    setText('.node-automations small', 'What should happen and under which rules');
  }

  function refinePresence() {
    const presence = qs('.continuum-presence');
    if (!presence) return;

    setText('.presence-heading > div > span', 'ACROSS TIME', presence);
    setText('.presence-heading strong', 'One place for what matters now, later, and when you cannot respond.', presence);
    setText('.presence-heading > p', 'The same information and rules can support a morning brief, work that lasts for days, a period when you are unreachable, and the continuity plan you prepared in advance.', presence);

    const stages = qsa('.presence-stage', presence);
    const copy = [
      ['WITH YOU', 'Understand what matters now', 'Bring together the information you need for the decision in front of you.', 'SPACES + AI'],
      ['FOR YOU', 'Continue work you approved', 'Use the people, information and tools already allowed for the job.', 'AUTOMATIONS'],
      ['WHEN YOU ARE AWAY', 'Wait, monitor and resume', 'Runtime can later keep work moving on the server through waits, replies and retries.', 'LATER · RUNTIME'],
      ['IF YOU CANNOT RESPOND', 'Follow the plan you prepared', 'Use the instructions, people and permissions you set up in advance.', 'CONTINUITY']
    ];

    stages.forEach((stage, index) => {
      if (!copy[index]) return;
      setText('span', copy[index][0], stage);
      setText('h3', copy[index][1], stage);
      setText('p', copy[index][2], stage);
      setText('small', copy[index][3], stage);
    });

    setText('.presence-truth span', 'Check In timing is live today. Sending through outside providers, long-running Runtime and policy-driven fallback are later work.', presence);
  }

  function refineOverview() {
    const section = document.getElementById('overview');
    if (!section) return;

    setText('.section-kicker', 'Continuum in one minute', section);
    setText('h2', 'From new information to a recorded result', section);
    setText('.section-intro', 'Continuum takes in approved information, keeps track of what is true now, checks what is allowed, uses available tools, and records what happened.', section);

    const steps = qsa('.process-step', section);
    const copy = [
      ['Receive information', 'Messages, files, calendars, account data, APIs and direct updates can arrive from sources you approved.', 'INPUT'],
      ['Keep knowledge + current State', 'State is Continuum\'s current picture of what is true now. It sits beside saved people, files, dates, relationships and history.', 'STATE'],
      ['Check what is allowed', 'Before an action runs, Continuum checks the permissions, approvals, timing rules and limits that apply to it.', 'POLICY'],
      ['Use the right capability', 'AI, connected services and future Runtime can use only the tools available and allowed for that job.', 'ACTION'],
      ['Record what happened', 'The result, timing and reason are kept so the next decision can start with current information.', 'AUDIT']
    ];

    steps.forEach((step, index) => {
      if (!copy[index]) return;
      setText('h3', copy[index][0], step);
      setText('p', copy[index][1], step);
      setText('.process-tag', copy[index][2], step);
    });
  }

  function refineDifference() {
    const section = document.getElementById('difference');
    if (!section) return;

    setText('.section-kicker', 'AI and permissions', section);
    setText('h2', 'AI can change. Continuum keeps the rules around it.', section);
    setText('.section-intro', 'An AI model can reason, write and use tools. Continuum keeps the information, current State, permissions, rules and history that decide what the model can see and what it can do.', section);

    const answer = qs('.ai-answer', section);
    if (answer) {
      setText('strong', 'What Continuum gives AI', answer);
      setText('p', 'The model gets the context and tools allowed for the job, while Continuum keeps the lasting records and server-side rules.', answer);
    }

    const capabilityHead = qs('.capability-layer-head', section);
    if (capabilityHead) {
      setText('span', 'CAPABILITY CAN GROW', capabilityHead);
      setText('strong', 'New models and tools can plug into the same rules.', capabilityHead);
      setText('p', 'Continuum can gain new abilities over time without giving those abilities permission automatically.', capabilityHead);
    }

    const controlTitle = qs('.control-core-title', section);
    if (controlTitle) {
      setText('span', 'CONTINUUM CONTROL LAYER', controlTitle);
      setText('strong', 'The lasting part around changing AI and tools', controlTitle);
    }

    setText('.capability-layer-note', 'Technology can improve. Permission still comes from the rules you set.', section);
    const principle = qs('.authority-principle', section);
    if (principle) {
      setText('b', 'Authority means permission to act.', principle);
      setText('span', 'A better model can make better decisions without gaining extra permission on its own.', principle);
    }
    const callout = qs('.rule-callout', section);
    if (callout) {
      setText('strong', 'The server makes the final permission check.', callout);
      setText('span', 'AI can understand the goal and choose among allowed options. Protected server rules decide whether the action can actually run.', callout);
    }
  }

  function refineSpaces() {
    const section = document.getElementById('spaces');
    if (!section) return;

    setText('.section-kicker', 'Information, people and focused views', section);
    setText('h2', 'Keep what matters, know who it belongs to, and bring the right parts into view', section);
    setText('.section-intro', 'Library keeps documents, files, knowledge and version history. Directory keeps people, organizations and relationships. Spaces brings the relevant pieces together for one part of your life or work.', section);
    setText('.ingestion-map .visual-label', 'APPROVED INFORMATION SOURCES', section);

    const normalize = qs('.normalize-core', section);
    if (normalize) {
      setText('strong', 'Continuum keeps track of where information belongs', normalize);
      setText('small', 'Where did it come from? When did it change? Who can use it? Which person, file, project or rule does it relate to?', normalize);
    }

    const directoryCard = qs('.people-map-card', section);
    if (directoryCard) setText('p', 'Directory keeps stable records of people and groups. Calling someone a lawyer, family member or trusted contact adds context and does not give them permission by itself.', directoryCard);

    const libraryCard = qs('.library-flow-card', section);
    if (libraryCard) setText('p', 'Library keeps documents, files and their versions. An Automation can keep using version 3 even while you are editing version 4.', libraryCard);
  }

  function refineAction() {
    const section = document.getElementById('action');
    if (!section) return;

    setText('.section-kicker', 'Automations and Runtime', section);
    setText('h2', 'Describe what should happen, then make the rules clear', section);
    setText('.section-intro', 'You should be able to describe the job normally. Before anything runs, the important people, timing, approvals, limits and actions become structured rules the server can check.', section);

    const head = qs('.policy-translation-head', section);
    if (head) {
      setText('span', 'PLAIN REQUEST + CLEAR RULES', head);
      setText('strong', 'Say what you want done, then make the important boundaries explicit.', head);
      setText('p', 'Natural language makes setup easier. Structured fields give Runtime exact rules for what it may do.', head);
    }

    const runtime = qs('.policy-runtime', section);
    if (runtime) {
      setText('strong', 'Continue the job inside those rules.', runtime);
      setText('small', 'Wait on the server, retry when allowed, use approved tools, react to changes and record the result.', runtime);
    }

    const ceiling = qs('.ceiling-note', section);
    if (ceiling) {
      setText('span', 'EXAMPLES OF WHERE THIS CAN GO', ceiling);
      setText('strong', 'Continuum can gain more useful abilities as new services, tools, models and devices become available.', ceiling);
      setText('p', 'The examples below show possible uses of the same information, permission and execution layer.', ceiling);
    }
  }

  function refineAfterlife() {
    const section = document.getElementById('afterlife');
    if (!section) return;

    setText('.section-intro', 'Afterlife is Continuum\'s long-term continuity path. You choose the people, information, instructions and permissions in advance. Check In records the trigger if you stop responding long enough. Future Runtime can then follow the plan you already prepared.', section);

    const head = qs('.continuity-authority-head', section);
    if (head) {
      setText('span', 'PERMISSION PREPARED IN ADVANCE', head);
      setText('strong', 'Decide what may happen before the situation ever occurs.', head);
      setText('p', 'Your policy can say what happens while you are available, while you are temporarily unreachable, and during long-term continuity.', head);
    }

    const guardrail = qs('.continuity-guardrail', section);
    if (guardrail) {
      guardrail.innerHTML = '<strong>Silence and urgency never create permission.</strong> Any fallback action has to come from rules you approved earlier.';
    }
  }

  function refineEngineering() {
    const section = document.getElementById('engineering');
    if (!section) return;

    setText('.section-kicker', 'Architecture', section);
    setText('h2', 'How the pieces fit together', section);
    setText('.section-intro', 'There are two useful ways to look at Continuum: how a browser request moves through the code, and how information, permissions, AI, tools and results stay connected as the product grows.', section);

    const head = qs('.concept-architecture-head', section);
    if (head) {
      setText('span', 'CONTINUUM ARCHITECTURE', head);
      setText('strong', 'AI is one part of a larger system.', head);
      setText('p', 'Sources, saved information, current State, permissions, tools and results stay connected even when the model changes.', head);
    }

    setText('.concept-principle', 'A new tool or model can be added without changing the core rules that control access and action.', section);
  }

  function refineBuild() {
    const section = document.getElementById('build');
    if (!section) return;

    setText('.section-kicker', 'How ideas become real', section);
    setText('h2', 'Prototype the experience, then connect it to real server data', section);
    setText('.section-intro', 'The Lab lets us work out how a feature should feel. Once the behavior is clear, we define the server data and permission rules, build the backend, test it, and connect the accepted interface to protected APIs.', section);
  }

  function refineStatus() {
    const section = document.getElementById('status');
    if (!section) return;

    setText('.section-kicker', 'Roadmap', section);
    setText('h2', 'Make the information layer real, then add long-running execution', section);
    setText('.section-intro', 'Check In proves protected server timing today. The next step is durable private information. After that, Runtime can keep approved work moving on the server and more outside capabilities can connect over time.', section);
    setText('.closing-note', 'Continuum is meant to keep the important information, current situation, permissions, rules and history even as AI models, tools and interfaces change.', section);
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
          <span class="continuum-kt-eyebrow">BRING INFORMATION IN</span>
          <strong>Give Continuum text, Markdown, JSON, an AI handoff, a document or an image. It keeps the original and shows what it found before anything becomes long-term knowledge.</strong>
        </div>
        <span class="continuum-kt-status">NEXT + LATER</span>
      </div>
      <p class="continuum-kt-copy">The same intake path can handle pasted text, batches, files and approved connected sources while keeping where each piece came from.</p>
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
      <div class="continuum-kt-foot"><i aria-hidden="true"></i><span>New information starts private. Continuum keeps where it came from. Important findings stay reviewable. AI only receives the information allowed for the job.</span></div>`;

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
          <span class="continuum-kt-eyebrow">REAL CLOCK</span>
          <strong>Continuum uses server time and timestamps, so elapsed time comes from a real clock.</strong>
        </div>
        <span class="continuum-kt-status">CORE RULE</span>
      </div>
      <p class="continuum-kt-copy">The AI does not have to stay open for Continuum to know how much time passed.</p>
      <div class="continuum-kt-clock-grid" aria-label="Examples of time-aware Continuum behavior">
        <span><b>ELAPSED</b><small>You say you are leaving for two minutes and return two seconds later. Continuum knows roughly two seconds passed.</small></span>
        <span><b>STATE</b><small>Something can become due, overdue or stale because the real clock moved forward.</small></span>
        <span><b>CONTEXT</b><small>Deadlines, waits, freshness, history and local time zones use explicit timestamps.</small></span>
      </div>
      <div class="continuum-kt-foot"><i aria-hidden="true"></i><span>Check In already uses server-owned elapsed timing. The same approach can support conversations, knowledge, Goals, Signals and Runtime as those parts become real.</span></div>`;

    anchor.after(panel);
  }

  refineHero();
  refinePresence();
  refineOverview();
  refineDifference();
  refineSpaces();
  refineAction();
  refineAfterlife();
  refineEngineering();
  refineBuild();
  refineStatus();
  addKnowledgePanel();
  addTimePanel();

  document.documentElement.dataset.continuumKnowledgeTime = 'ready';
  document.documentElement.dataset.continuumPositioning = 'continuity-first';
  document.documentElement.dataset.continuumClarity = 'plain-english-v1';
})();
