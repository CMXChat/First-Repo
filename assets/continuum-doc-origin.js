'use strict';

(() => {
  const qs = (selector, scope = document) => scope?.querySelector(selector) || null;
  const qsa = (selector, scope = document) => Array.from(scope?.querySelectorAll(selector) || []);

  function setText(selector, text, scope = document) {
    const node = qs(selector, scope);
    if (node) node.textContent = text;
    return node;
  }

  function restoreArchitectureCopy() {
    const tocLabels = {
      overview: '01 · Overview',
      difference: '02 · AI + Authority',
      spaces: '03 · Information',
      action: '04 · Automations',
      afterlife: '05 · Continuity',
      engineering: '06 · Architecture',
      build: '07 · Build',
      status: '08 · Roadmap'
    };

    qsa('.document-toc a').forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      if (tocLabels[id]) link.textContent = tocLabels[id];
    });

    const toolbar = qs('.toolbar-links');
    if (toolbar) {
      toolbar.innerHTML = '<a href="#overview">Overview</a><a href="#difference">AI + Authority</a><a href="#action">Automations</a><a href="#afterlife">Continuity</a>';
    }

    const toolbarPrimary = qs('.document-action-primary');
    if (toolbarPrimary) {
      toolbarPrimary.href = '/checkin/';
      toolbarPrimary.innerHTML = '<span>Open Check In</span><span aria-hidden="true">↗</span>';
    }

    setText('.hero-kicker', 'Your information, people, tools and AI in one private operating layer');
    const heroLead = qs('.continuum-hero .hero-lead');
    if (heroLead) {
      heroLead.innerHTML = '<span class="hero-lead-first">Continuum brings your information, people, files, messages, services, automations and AI into one private environment that can keep track of what is happening, remember useful history and understand what is true right now.</span><span class="hero-lead-second">It can brief you, follow rules you set, use approved tools and eventually carry approved work on your behalf across hours, days and changing conditions. As more services, APIs, MCP servers and devices connect, Continuum can see more of what is happening and take on more work while keeping authority, policy and history coherent.</span>';
    }

    const heroTruth = qs('.hero-truth-row');
    if (heroTruth) {
      heroTruth.innerHTML = '<span><i></i>Keeps context + current State</span><span><i></i>Grows with new tools + intelligence</span><span><i></i>Acts inside authority you set</span>';
    }

    const heroActions = qs('.continuum-hero .hero-actions');
    if (heroActions) {
      heroActions.innerHTML = '<a class="button button-primary" href="/checkin/"><span>Open Check In</span><small class="continuum-inline-status">LIVE</small></a><a class="button button-secondary" href="#overview">See how Continuum works</a>';
    }

    setText('#overview .section-kicker', 'Continuum in one minute');
    setText('#overview h2', 'A continuous loop from change to useful action');
    setText('#overview .section-intro', 'Continuum sees approved changes, remembers what matters, applies authority and policy, carries out allowed work and keeps the result for the next decision.');

    const processCopy = [
      ['See what is happening', 'Messages, files, calendars, money data, APIs, MCP and direct updates can arrive from approved sources.', 'INPUT'],
      ['Maintain knowledge + state', 'People, files, dates, history, relationships and current conditions remain available later.', 'STATE'],
      ['Apply authority + policy', 'What may be read, prepared, approved, executed, escalated or prohibited is checked before action.', 'POLICY'],
      ['Use available capability', 'AI and Runtime can use the tools enabled for that job as connections expand over time.', 'ACTION'],
      ['Keep the result', 'Continuum records what happened, why it happened and what changed so future work starts current.', 'AUDIT']
    ];
    qsa('#overview .process-step').forEach((step, index) => {
      const copy = processCopy[index];
      if (!copy) return;
      setText('h3', copy[0], step);
      setText('p', copy[1], step);
      setText('.process-tag', copy[2], step);
    });

    const statusCopy = 'Check In is LIVE. Spaces and Automations are LAB. Validated private information and Automation definition source is NEXT for production migration. Runtime, live Signals monitoring, provider execution and autonomous AI remain LATER.';
    setText('.rail-status p', statusCopy);
    setText('.clarity-status-frame .clarity-mini-heading p', statusCopy);

    const mapIntro = qs('.clarity-product-map-section .section-intro');
    if (mapIntro) {
      mapIntro.textContent = 'Directory identifies people and organizations. Library holds what should persist. Spaces focus the context that matters now. Signals can later update State from approved observations. Automations define work. Connections bring in outside data and tools. Runtime carries published work forward. AI reasons across whatever it is allowed to use.';
    }

    const nodeCopy = {
      '.node-directory small': 'Who people and organizations are',
      '.node-library small': 'What you want to keep',
      '.node-spaces small': 'What matters right now',
      '.node-ai small': 'Reasons with approved context and tools',
      '.node-connections small': 'How outside apps, tools and devices connect',
      '.node-automations small': 'Objectives, conditions and authority',
      '.node-runtime small': 'Keeps work moving and records results'
    };
    Object.entries(nodeCopy).forEach(([selector, copy]) => setText(selector, copy));

    setText('.presence-heading > div > span', 'ACROSS TIME');
    setText('.presence-heading strong', 'Keep your context, rules and approved intent available across time.');
    setText('.presence-heading > p', 'Continuum can help while you are using it, keep defined work ready and later carry specific work forward under continuity rules you prepared.');

    const presenceStages = qsa('.presence-stage');
    if (presenceStages[3]) {
      setText('span', 'IF YOU CANNOT RESPOND', presenceStages[3]);
      setText('h3', 'Carry approved intent forward', presenceStages[3]);
      setText('p', 'Use the people, information, priorities and fallback rules you prepared when direct approval is unavailable.', presenceStages[3]);
      setText('small', 'CONTINUITY', presenceStages[3]);
    }

    setText('#difference .section-kicker', 'AI, capability and authority');
    setText('#difference h2', 'The intelligence can change while the control layer stays durable');
    setText('#difference .section-intro', 'An AI model works with the context and tools it receives. Continuum keeps the durable knowledge, current State, authority, policy and history around it.');
    setText('#difference .ai-answer strong', 'What Continuum adds to AI');
    setText('#difference .ai-answer p', 'AI provides reasoning. Continuum gives that reasoning memory, live State, senses, tools, rules and continuity.');
    setText('#difference .model-swap-note > div:first-child span', 'MODEL CHOICE CAN CHANGE');
    setText('#difference .model-swap-note > div:first-child strong', 'Continuum keeps the approved context, authority, policy and history around the model.');
    setText('#difference .capability-layer-head p', 'New tools can be added without rewriting the rules around them.');
    setText('#difference .rule-callout strong', 'Server-side policy remains the enforcement point.');
    setText('#difference .rule-callout span', 'AI can interpret objectives and choose among allowed capabilities. Protected server rules still decide whether an action may run.');

    setText('#spaces .section-kicker', 'Knowledge, state and focused views');
    setText('#spaces h2', 'Keep people, saved information and current context connected');
    setText('#spaces .section-intro', 'Continuum keeps identities, relationships, records and recent changes connected. Spaces turn the relevant pieces into focused Personal, Family, Business or Afterlife views.');
    setText('#spaces .ingestion-map .visual-label', 'THINGS YOU ALREADY USE');

    setText('#action .section-kicker', 'Automations and Runtime');
    setText('#action h2', 'Natural language can express intent. Structured policy controls execution.');
    setText('#action .section-intro', 'You can describe the outcome and boundaries in normal language. Continuum can turn the important parts into structured triggers, authority and execution rules the server can enforce.');

    const primer = qs('#action .clarity-automation-copy');
    if (primer) {
      primer.innerHTML = '<strong>Automations define durable work.</strong> Natural language can describe the objective. Typed triggers, conditions, authority, policy and Actions give the server something exact to validate. Runtime later executes published work and records what happened.';
    }

    setText('#action .connections-panel .panel-head strong', 'Each connection adds specific abilities');
    setText('#action .ceiling-note span', 'CAPABILITY CAN KEEP EXPANDING');
    setText('#action .ceiling-note strong', 'New tools and models can be added as they become useful.');
    setText('#action .ceiling-note p', 'Software, APIs, MCP servers, infrastructure, financial systems, operating systems, vehicles, wearables, smart devices and future technology can become Sources or capabilities when suitable interfaces exist. Adding capability expands what Continuum can potentially do. Permission remains separate.');

    setText('#afterlife .section-kicker', 'Continuity');
    setText('#afterlife .section-intro', 'Afterlife uses Continuum for continuity. You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can use the people, information, instructions and authority you prepared to carry specific work forward on your behalf.');
    setText('#afterlife .continuity-authority-head span', 'CONTINUITY OF AUTHORIZED INTENT');
    setText('#afterlife .continuity-authority-head strong', 'Prepare what should continue before you need it.');
    setText('#afterlife .continuity-authority-head p', 'A continuity policy can tie saved instructions, selected people, approved information and fallback authority to the State that determines what happens next.');

    const laterTruth = qs('#afterlife .afterlife-truth div:last-child');
    if (laterTruth) {
      laterTruth.innerHTML = '<b>LATER:</b> outside-provider delivery, server-side waits, retries, replies, acknowledgements, fallback authority, live multi-source availability evidence and approved AI coordination through Runtime.';
    }

    setText('#engineering .section-kicker', 'Architecture');
    const postgresNode = qsa('#engineering .stack-node').find((node) => (qs('strong', node)?.textContent || '').trim() === 'PostgreSQL');
    if (postgresNode) {
      setText('small', 'Keeps durable knowledge, operational State, policy, incidents, authority and future Runtime records.', postgresNode);
    }

    setText('#build .section-kicker', 'Build process');
    setText('#build h2', 'Design quickly, then make the authority and state real');
    setText('#build .section-intro', 'The Lab lets us test an experience quickly. Once it feels right, we define the durable data and rules, build the backend behavior, then connect the accepted interface to protected APIs.');

    setText('#status .section-kicker', 'Roadmap');
    setText('#status h2', 'Build the durable foundation, then keep expanding capability');
    setText('#status .section-intro', 'New apps, communication channels, data sources, models and future tools can use the same knowledge, policy, authority and audit model as each stage becomes real.');
    setText('#status .roadmap-later strong', 'Expandable capability');
    setText('#status .roadmap-later p', 'Continuum can work with more outside services, models, tools and future devices through the same control layer.');
    setText('#status .closing-note', 'Continuum is a durable operating layer around changing intelligence. Better models, new tools and better architecture can expand what it can see and do while knowledge, State, authority, policy and history stay coherent across time.');

    setText('.document-footer h2', 'Start with what is live. Explore what Continuum is becoming.');

    const footerActions = qs('.document-footer .footer-actions');
    if (footerActions) {
      footerActions.classList.add('continuum-product-actions');
      footerActions.innerHTML = `
        <a class="continuum-route-link continuum-route-live" href="/checkin/">
          <span class="continuum-route-status">LIVE</span>
          <strong>Open Check In</strong>
          <small>Protected proof of life, timing and activity</small>
        </a>
        <a class="continuum-route-link" href="/spaces/">
          <span class="continuum-route-status">LAB</span>
          <strong>Explore Spaces</strong>
          <small>Context and briefing experience</small>
        </a>
        <a class="continuum-route-link" href="/lab/automations/">
          <span class="continuum-route-status">LAB</span>
          <strong>Open Automation Lab</strong>
          <small>Build and test workflow definitions</small>
        </a>`;
    }
  }

  function addCheckInContextLink() {
    const callout = qs('#afterlife .afterlife-simple-callout');
    if (!callout || qs('.continuum-checkin-context-link', callout)) return;
    const link = document.createElement('a');
    link.className = 'continuum-checkin-context-link';
    link.href = '/checkin/';
    link.innerHTML = '<span>Open the live Check In app</span><b aria-hidden="true">↗</b>';
    callout.append(link);
  }

  function addStateStrip() {
    const overview = document.getElementById('overview');
    if (!overview || qs('.continuum-state-strip', overview)) return;
    const anchor = qs('.clarity-status-frame', overview) || qs('.process-map', overview);
    if (!anchor) return;

    const strip = document.createElement('aside');
    strip.className = 'continuum-state-strip';
    strip.setAttribute('aria-label', 'Examples of Continuum operational State');
    strip.innerHTML = `
      <div class="continuum-state-head">
        <span>STATE IS WHAT IS TRUE NOW</span>
        <strong>Continuum can carry current conditions forward.</strong>
      </div>
      <div class="continuum-state-chips">
        <span>Waiting for reply</span>
        <span>Approval pending</span>
        <span>Deadline tomorrow</span>
        <span>Connection unavailable</span>
        <span>Payment received</span>
        <span>Incident active</span>
      </div>
      <p>Knowledge keeps useful history. State keeps the current condition that policy, AI and Runtime can use for the next decision.</p>`;
    anchor.after(strip);
  }

  function strengthenRuntimeStory() {
    const story = qs('.clarity-story-section');
    if (!story) return;

    setText('.section-kicker', 'One real workflow', story);
    setText('h2', 'What it feels like when Continuum keeps work moving', story);
    setText('.section-intro', 'A project can keep moving across hours, replies and changing conditions without making you remember every next step.', story);

    const copy = qs('.clarity-story-copy', story);
    if (!copy) return;
    copy.innerHTML = `
      <p>A website migration is due Friday and server access is still missing. Continuum can see that from approved project sources, resolve who owns the access, check whether follow-up is permitted and contact them when policy allows.</p>
      <p>Runtime can later wait on the server after the app is closed, pick up the reply when it arrives, update the project State and continue the next approved step. You only need to come back in when the policy requires your decision.</p>
      <div class="clarity-story-path" aria-label="Example long-running Continuum workflow"><span>Access missing</span><i>→</i><span>State updated</span><i>→</i><span>Policy checked</span><i>→</i><span>Contact</span><i>→</i><span>Wait</span><i>→</i><span>Reply</span><i>→</i><span>Continue</span></div>
      <div class="continuum-why-receipt" aria-label="Example Continuum action explanation">
        <div class="continuum-receipt-head"><span>WHY DID CONTINUUM DO THAT?</span><strong>Every consequential step should be explainable.</strong></div>
        <div class="continuum-receipt-grid">
          <span><b>Trigger</b><small>Access still missing</small></span>
          <span><b>State</b><small>Waiting 19 hours</small></span>
          <span><b>Policy</b><small>Project Follow-up v3</small></span>
          <span><b>Authority</b><small>Standing</small></span>
          <span><b>Capability</b><small>Approved email</small></span>
          <span><b>Result</b><small>Reply received</small></span>
        </div>
      </div>`;
  }

  function addSensesStrip() {
    const spaces = document.getElementById('spaces');
    if (!spaces || qs('.continuum-senses-strip', spaces)) return;
    const anchor = qs('.source-proof', spaces) || qs('.spaces-stage', spaces);
    if (!anchor) return;

    const strip = document.createElement('aside');
    strip.className = 'continuum-senses-strip';
    strip.setAttribute('aria-label', 'How Continuum can sense changes from approved sources');
    strip.innerHTML = `
      <div class="continuum-senses-copy">
        <span>LATER · SENSES</span>
        <strong>Signals let Continuum notice when something changes.</strong>
        <p>Approved Sources keep timestamps and provenance. An Observation becomes a typed Signal when something meaningful changes, and State records what matters now.</p>
      </div>
      <div class="continuum-senses-flow" aria-label="Source to State flow"><b>Source</b><i>→</i><b>Observation</b><i>→</i><b>Signal</b><i>→</i><b>State</b></div>`;
    anchor.after(strip);
  }

  function addKnowledgeQualityNote() {
    const spaces = document.getElementById('spaces');
    const anchor = qs('.continuum-senses-strip', spaces) || qs('.source-proof', spaces);
    if (!spaces || !anchor || qs('.continuum-knowledge-quality-note', spaces)) return;

    const note = document.createElement('aside');
    note.className = 'continuum-forward-note continuum-knowledge-quality-note';
    note.setAttribute('aria-label', 'How Continuum distinguishes information quality');
    note.innerHTML = `
      <span class="continuum-forward-kicker">HOW CONTINUUM TREATS INFORMATION</span>
      <strong>Different kinds of information carry different weight.</strong>
      <p>Continuum should keep the difference between something it observed, something a person said, a conclusion AI derived and the Current State it is willing to rely on. Source, time, freshness and conflicts stay attached.</p>
      <div class="continuum-boundary-grid" aria-label="Continuum information classes">
        <span><b>Observation</b><small>What an approved source showed at a specific time.</small></span>
        <span><b>Claim</b><small>What a person or source says is true.</small></span>
        <span><b>Derived conclusion</b><small>What reasoning inferred from supporting evidence.</small></span>
        <span><b>Current State</b><small>What the protected system currently treats as operational truth.</small></span>
      </div>
      <div class="continuum-capability-example"><b>Example</b><span>“Client says payment will arrive Friday” stays a claim. A verified account event showing the payment posted can update Current State.</span></div>
      <small>Old or conflicting information stays traceable instead of being silently rewritten.</small>`;
    anchor.after(note);
  }

  function addModelRouting() {
    const section = document.getElementById('difference');
    const modelStrip = qs('.model-swap-note', section);
    if (!section || !modelStrip || qs('.continuum-model-routing', section)) return;

    const routing = document.createElement('aside');
    routing.className = 'continuum-model-routing';
    routing.setAttribute('aria-label', 'Continuum model routing and capability boundaries');
    routing.innerHTML = `
      <div class="continuum-routing-copy">
        <span>MODEL ROUTING</span>
        <strong>Different approved models can handle different jobs.</strong>
        <p>Coding, research, vision, sensitive local work and future tasks can use different models when privacy, cost, availability and policy allow. Authority stays fixed unless policy changes.</p>
      </div>
      <div class="continuum-boundary-grid">
        <span><b>Model</b><small>Can this intelligence handle the task?</small></span>
        <span><b>Provider</b><small>Is the service available for this context?</small></span>
        <span><b>Capability</b><small>Does Continuum have the required tool?</small></span>
        <span><b>Policy</b><small>Is that tool allowed to run here?</small></span>
      </div>`;
    modelStrip.after(routing);
  }

  function addPlannerAndSignalsNotes() {
    const aiSection = document.getElementById('difference');
    const aiAnswer = qs('.ai-answer', aiSection);
    let planner = qs('.continuum-planner-note', aiSection);
    if (aiAnswer && !planner) {
      planner = document.createElement('aside');
      planner.className = 'continuum-forward-note continuum-planner-note';
      planner.setAttribute('aria-label', 'Future Continuum Planner');
      aiAnswer.after(planner);
    }
    if (planner) {
      planner.innerHTML = `
        <span class="continuum-forward-kicker">LATER · PLANNER</span>
        <strong>Describe the setup in normal language. The result still has to pass the same server rules.</strong>
        <p>Continuum can eventually turn that description into a typed Change Plan across mature areas such as People, Library content, Sources, Watches, Automations, capability mappings and policy, then show exactly what would change before protected services apply it.</p>
        <div class="continuum-forward-flow" aria-label="Future Planner change flow"><span>INTENT</span><i>→</i><span>CHANGE PLAN</span><i>→</i><span>PREFLIGHT</span><i>→</i><span>REVIEW</span><i>→</i><span>APPLY</span></div>
        <small>Planner can propose configuration and policy. Executable capability and authority remain protected server decisions.</small>`;
    }

    const actionSection = document.getElementById('action');
    const everyday = qs('.everyday-workflow', actionSection);
    let signals = qs('.continuum-signals-note', actionSection);
    if (everyday && !signals) {
      signals = document.createElement('aside');
      signals.className = 'continuum-forward-note continuum-signals-note';
      signals.setAttribute('aria-label', 'Future Signals, State and observed changes');
      everyday.after(signals);
    }
    if (signals) {
      signals.innerHTML = `
        <span class="continuum-forward-kicker">LATER · SIGNALS + STATE</span>
        <strong>A new observation can change what Continuum believes is happening now.</strong>
        <p>A Signal can update State, satisfy a condition, change priority, wake a waiting Runtime or make a published policy eligible. Policy and authority still decide whether consequential work may proceed.</p>
        <div class="continuum-forward-flow continuum-signal-flow" aria-label="Future Signal to execution flow"><span>SIGNAL</span><i>→</i><span>STATE</span><i>→</i><span>POLICY</span><i>→</i><span>AUTHORITY</span><i>→</i><span>RUNTIME</span><i>→</i><span>RESULT</span></div>
        <small>Evidence can change the situation Continuum understands. Published authority still controls execution.</small>`;
    }
  }

  function addGoalMissionNote() {
    const actionSection = document.getElementById('action');
    const anchor = qs('.policy-translation', actionSection);
    if (!actionSection || !anchor || qs('.continuum-goal-note', actionSection)) return;

    const goal = document.createElement('aside');
    goal.className = 'continuum-forward-note continuum-goal-note';
    goal.setAttribute('aria-label', 'Future Continuum Goals and Missions');
    goal.innerHTML = `
      <span class="continuum-forward-kicker">LATER · GOALS / MISSIONS</span>
      <strong>Automations handle repeatable rules. Goals keep an outcome alive.</strong>
      <p>A Goal can define what success means, what must never happen, which approvals are required, how long the effort may continue and when to stop. Planner can revise the strategy while Runtime carries approved work across waits, replies and changing State. A Goal can keep moving during your unavailability when its published continuity policy allows it, with the same success criteria, limits and stop conditions.</p>
      <div class="continuum-forward-flow" aria-label="Future Goal orchestration flow"><span>GOAL</span><i>→</i><span>PLAN</span><i>→</i><span>ACT</span><i>→</i><span>OBSERVE</span><i>→</i><span>REPLAN</span><i>→</i><span>SUCCESS / STOP</span></div>
      <div class="continuum-capability-example"><b>Example</b><span>Help an authorized person pursue a suitable job within 60 days. Never misrepresent qualifications, respect the allowed locations and require approval before anything is sent in that person's name.</span></div>
      <small>Replanning can change strategy. It cannot silently change hard constraints, success criteria or authority.</small>`;
    anchor.after(goal);
  }

  function addCapabilityExtensionNote() {
    const capabilityLayer = qs('#difference .capability-layer');
    if (!capabilityLayer) return;
    let note = qs('.continuum-capability-extension-note', capabilityLayer.parentElement);
    if (!note) {
      note = document.createElement('aside');
      note.className = 'continuum-forward-note continuum-capability-extension-note';
      note.setAttribute('aria-label', 'Future live capability extension');
      capabilityLayer.after(note);
    }
    note.innerHTML = `
      <span class="continuum-forward-kicker">LATER · LIVE CAPABILITY</span>
      <strong>When work keeps getting blocked by a missing tool, Continuum can eventually identify the gap.</strong>
      <p>A new API, MCP server, service or device may provide what is missing. Continuum can inspect the available interface, map it into a typed operation, test it, simulate the effect and prepare the setup allowed by policy.</p>
      <div class="continuum-forward-flow" aria-label="Future capability adoption flow"><span>DISCOVER</span><i>→</i><span>MAP</span><i>→</i><span>TEST</span><i>→</i><span>SIMULATE</span><i>→</i><span>POLICY</span><i>→</i><span>ENABLE</span></div>
      <div class="continuum-capability-example"><b>Example</b><span>A workflow keeps stopping because deployment access is missing. Continuum could identify a compatible GitHub or deployment capability, prepare the mapping and tests, simulate what would change and surface the setup for approval or an already-authorized adoption policy.</span></div>
      <small>Capability growth and permission growth stay separate.</small>`;
  }

  function addAuthorizedContinuityNote() {
    const afterlife = document.getElementById('afterlife');
    const anchor = qs('.continuity-authority', afterlife);
    if (!afterlife || !anchor || qs('.continuum-authorized-continuity-note', afterlife)) return;

    const note = document.createElement('aside');
    note.className = 'continuum-forward-note continuum-authorized-continuity-note';
    note.setAttribute('aria-label', 'Future continuity of authorized intent');
    note.innerHTML = `
      <span class="continuum-forward-kicker">LATER · AUTHORIZED CONTINUITY</span>
      <strong>Specific work can continue on your behalf when you cannot take part directly.</strong>
      <p>You can prepare the people, information, priorities, limits and authority ahead of time. Future Runtime can check current State, follow that policy, contact the right people, release approved information, wait for replies and carry the next allowed step forward.</p>
      <div class="continuum-forward-flow" aria-label="Future continuity of authorized intent flow"><span>PREPARED INTENT</span><i>→</i><span>CURRENT STATE</span><i>→</i><span>CONTINUITY POLICY</span><i>→</i><span>AUTHORIZED ACTION</span><i>→</i><span>WAIT / REPLY</span><i>→</i><span>CONTINUE</span><i>→</i><span>AUDIT</span></div>
      <div class="continuum-capability-example"><b>Across time</b><span>The same model can cover a flight, hospitalization, extended incapacity or long-term continuity after death. What happens in each case comes from the policy you chose beforehand.</span></div>
      <small>Your absence never expands the authority already published.</small>`;
    anchor.after(note);
  }

  function addArchitectureEvolutionNote() {
    const build = document.getElementById('build');
    const anchor = qs('.build-stage-final', build) || qs('.section-intro', build);
    if (!build || !anchor || qs('.continuum-architecture-evolution-note', build)) return;

    const note = document.createElement('aside');
    note.className = 'continuum-forward-note continuum-architecture-evolution-note';
    note.setAttribute('aria-label', 'Future goal-driven architecture evolution');
    note.innerHTML = `
      <span class="continuum-forward-kicker">LATER · ARCHITECTURE EVOLUTION</span>
      <strong>A Goal can expose a limitation in Continuum itself.</strong>
      <p>If the same kind of work keeps failing because the current data model, service or Runtime behavior is missing, Continuum can eventually prepare the smallest architecture change that would solve the recurring problem.</p>
      <div class="continuum-forward-flow" aria-label="Future architecture evolution flow"><span>GOAL BLOCKED</span><i>→</i><span>GAP</span><i>→</i><span>CHANGE PLAN</span><i>→</i><span>CODE + TESTS</span><i>→</i><span>SIMULATE</span><i>→</i><span>AUTHORIZE</span><i>→</i><span>RELEASE</span><i>→</i><span>MEASURE</span></div>
      <div class="continuum-capability-example"><b>Example</b><span>A long-running hiring Goal keeps forcing interview stages into generic notes. Continuum could propose a typed interview-stage model, migration, service changes and tests, then measure whether the change makes that Goal more reliable.</span></div>
      <small>Architecture changes use versioning, migration checks, tests, release authority and rollback. Permission stays governed separately.</small>`;
    anchor.after(note);
  }

  function addControlCenterNote() {
    const engineering = document.getElementById('engineering');
    const anchor = qs('.concept-architecture', engineering);
    if (!engineering || !anchor || qs('.continuum-control-center-note', engineering)) return;

    const note = document.createElement('aside');
    note.className = 'continuum-forward-note continuum-control-center-note';
    note.setAttribute('aria-label', 'Future Continuum Control Center');
    note.innerHTML = `
      <span class="continuum-forward-kicker">LATER · CONTROL CENTER</span>
      <strong>Background work should never become invisible.</strong>
      <p>One protected control surface can show what is active now, what is waiting, what is coming next and what already happened. You should be able to inspect why an action happened, manage supported work and see which policy and authority are in effect.</p>
      <div class="continuum-forward-flow" aria-label="Future Control Center views"><span>NOW</span><i>·</i><span>WAITING</span><i>·</i><span>UPCOMING</span><i>·</i><span>HISTORY</span></div>
      <div class="continuum-capability-example"><b>Pause Autonomy</b><span>Block new autonomous consequential Actions while approved observation, State maintenance, drafting and briefings can continue.</span></div>
      <div class="continuum-capability-example"><b>Simulation</b><span>Test what a policy, Goal or continuity situation would do using current or hypothetical State without performing real side effects.</span></div>
      <small>The activity view can stay simple while consequential Audit remains durable server truth.</small>`;
    anchor.after(note);
  }

  function addOriginNote() {
    const mapSection = qs('.clarity-product-map-section');
    const presence = qs('.continuum-presence', mapSection);
    if (!mapSection || !presence) return;

    let origin = qs('.continuum-origin-note', mapSection);
    if (!origin) {
      origin = document.createElement('section');
      origin.className = 'continuum-origin-note';
      origin.setAttribute('aria-labelledby', 'continuumOriginTitle');
      presence.before(origin);
    }

    origin.innerHTML = `
      <div class="continuum-origin-copy">
        <p class="continuum-origin-kicker">WHERE CONTINUUM CAME FROM</p>
        <h2 id="continuumOriginTitle">The idea started with the Dead Man Switch</h2>
        <p>Afterlife began with a practical problem: if you stop responding, the people, information and instructions you prepared still need somewhere reliable to live. The Check In timer gives that problem a trigger.</p>
        <p>The same foundation matters before an emergency. You can be asleep, on a flight, in a meeting, traveling, working, offline or waiting on someone before a deadline. Continuum keeps the context, State and policy you chose available so approved work can continue over time.</p>
        <p>Spaces and AI help while you are here. Signals can later keep selected outside changes current. Automations define work and policy. Runtime can later keep that work moving on the server. Afterlife uses the same durable control layer when normal approval cannot be obtained.</p>
      </div>`;
  }

  function neutralizeExampleNames() {
    const firstJourneyCopy = qs('#difference .journey-step small');
    if (firstJourneyCopy && /Directory knows who/i.test(firstJourneyCopy.textContent || '')) {
      firstJourneyCopy.textContent = 'Directory gives people and organizations stable identities.';
    }

    const people = qsa('#spaces .person-node');
    if (people[0]) {
      setText('strong', 'Project lead', people[0]);
      setText('small', 'Operational contact', people[0]);
    }
    if (people[1]) {
      setText('strong', 'Advisor', people[1]);
      setText('small', 'Trusted contact', people[1]);
    }
  }

  restoreArchitectureCopy();
  addCheckInContextLink();
  addStateStrip();
  strengthenRuntimeStory();
  neutralizeExampleNames();
  addSensesStrip();
  addKnowledgeQualityNote();
  addModelRouting();
  addPlannerAndSignalsNotes();
  addGoalMissionNote();
  addCapabilityExtensionNote();
  addAuthorizedContinuityNote();
  addArchitectureEvolutionNote();
  addControlCenterNote();
  addOriginNote();

  document.documentElement.dataset.continuumOrigin = 'ready';
  document.documentElement.dataset.continuumSignalsPlanner = 'ready';
  document.documentElement.dataset.continuumPowerClarity = '20260819';
  document.documentElement.dataset.continuumArchitectureAligned = '20260819';
  document.documentElement.dataset.continuumGoals = 'ready';
  document.documentElement.dataset.continuumControlCenter = 'ready';
  document.documentElement.dataset.continuumCheckInRoute = 'ready';
  document.documentElement.dataset.continuumKnowledgeQuality = 'ready';
  document.documentElement.dataset.continuumAuthorizedContinuity = 'ready';
  document.documentElement.dataset.continuumArchitectureEvolution = 'ready';
})();