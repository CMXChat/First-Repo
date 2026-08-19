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

    setText('.hero-kicker', 'Knowledge, authority, rules and AI in one private layer');
    const heroLead = qs('.continuum-hero .hero-lead');
    if (heroLead) {
      heroLead.innerHTML = '<span class="hero-lead-first">Continuum keeps useful context, current state, authority and policy connected over time.</span> It can brief you while you are here, carry approved work forward when you leave, and follow a continuity plan if you cannot respond.';
    }

    const heroTruth = qs('.hero-truth-row');
    if (heroTruth) {
      heroTruth.innerHTML = '<span><i></i>Keeps durable context</span><span><i></i>Expands with new capabilities</span><span><i></i>Acts inside published authority</span>';
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
      mapIntro.textContent = 'Directory keeps durable identity. Library keeps saved knowledge. Spaces focus current context. Signals can later turn approved observations into evidence and State changes. Automations define policy-driven work. Connections add outside Sources and capabilities. Runtime executes published work. AI reasons across the parts it is allowed to use.';
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
    setText('.presence-heading strong', 'Keep the context and rules that should survive the moment.');
    setText('.presence-heading > p', 'Continuum can help while you are using it, keep Automation definitions ready for execution and support a continuity policy when direct approval cannot be obtained.');

    setText('#difference .section-kicker', 'AI, capability and authority');
    setText('#difference h2', 'The intelligence can change while the control layer stays durable');
    setText('#difference .section-intro', 'An AI model can reason with the context and tools it receives. Continuum keeps the durable knowledge, current state, authority, policy and history that determine how that intelligence may operate.');
    setText('#difference .ai-answer strong', 'What Continuum adds to AI');
    setText('#difference .ai-answer p', 'AI provides reasoning. Continuum gives that reasoning memory, live state, senses, tools, rules and continuity.');
    setText('#difference .model-swap-note > div:first-child span', 'MODEL CHOICE CAN CHANGE');
    setText('#difference .model-swap-note > div:first-child strong', 'Continuum keeps the approved context, authority, policy and history around the model.');
    setText('#difference .rule-callout strong', 'Server-side policy remains the enforcement point.');
    setText('#difference .rule-callout span', 'AI can interpret objectives and choose among allowed capabilities, while protected server rules decide whether the action may actually run.');

    setText('#spaces .section-kicker', 'Knowledge, state and focused views');
    setText('#spaces h2', 'Keep people, saved information and current context connected');
    setText('#spaces .section-intro', 'Continuum can keep track of identities, relationships, records and recent changes. Spaces can turn that durable context into focused Personal, Family, Business or Afterlife views.');
    setText('#spaces .ingestion-map .visual-label', 'THINGS YOU ALREADY USE');

    setText('#action .section-kicker', 'Automations and Runtime');
    setText('#action h2', 'Natural language can express intent. Structured policy controls execution.');
    setText('#action .section-intro', 'A person should be able to describe the outcome and boundaries naturally. Continuum can turn that into structured triggers, authority and execution rules that the server can enforce.');

    const primer = qs('#action .clarity-automation-copy');
    if (primer) {
      primer.innerHTML = '<strong>Automations define durable intent.</strong> Natural language can help express the objective, while typed triggers, conditions, authority, policy and Actions give the server something deterministic to validate. Runtime later executes published work and records what happened.';
    }

    setText('#action .connections-panel .panel-head strong', 'Each connection adds specific abilities');
    setText('#action .ceiling-note span', 'EXAMPLES, NOT A CAPABILITY CEILING');
    setText('#action .ceiling-note strong', "Continuum's useful abilities can expand as new models, services, tools and devices become available.");
    setText('#action .ceiling-note p', 'Software, APIs, MCP servers, infrastructure, financial systems, operating systems, vehicles, wearables, smart devices and future technology can become Sources or capabilities when suitable interfaces exist. Adding capability expands what Continuum can potentially do. Permission remains separate.');

    setText('#afterlife .section-kicker', 'Continuity');
    setText('#afterlife .section-intro', 'Afterlife uses Continuum for continuity. You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can follow the authority and steps prepared in advance.');
    setText('#afterlife .continuity-authority-head p', 'Direct approval can be unavailable because you are asleep, on a flight, in a meeting, offline, unreachable before a deadline or in a serious continuity event. The applicable fallback path still comes from authority established beforehand.');

    const laterTruth = qs('#afterlife .afterlife-truth div:last-child');
    if (laterTruth) {
      laterTruth.innerHTML = '<b>LATER:</b> outside-provider delivery, server-side waits, retries, replies, acknowledgements, fallback authority, live multi-source availability evidence and approved AI coordination through Runtime.';
    }

    setText('#engineering .section-kicker', 'Architecture');
    setText('#build .section-kicker', 'Build process');
    setText('#build h2', 'Design quickly, then make the authority and state real');
    setText('#build .section-intro', 'The Lab lets us test an experience quickly. Once it feels right, we define durable data, authority and policy, build the backend behavior, then connect the accepted interface to protected APIs.');

    setText('#status .section-kicker', 'Roadmap');
    setText('#status h2', 'Build the durable foundation, then keep expanding capability');
    setText('#status .section-intro', 'New apps, communication channels, data sources, models and future tools can use the same knowledge, policy, authority and audit model as each stage becomes real.');
    setText('#status .roadmap-later strong', 'Expandable capability');
    setText('#status .roadmap-later p', 'Continuum can work with more outside services, models, tools and future devices through the same control layer.');
    setText('#status .closing-note', 'Continuum is a durable operating layer around changing intelligence. As models gain new abilities and new tools become available, it can gain new ways to perceive and act while keeping knowledge, State, authority, policy and history coherent.');

    setText('.document-footer h2', 'A durable operating layer for changing intelligence and expanding capability.');
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
      <p>A website migration is due Friday and server access is still missing. Continuum can see the missing-access state from approved project sources, resolve the person who owns the access, check whether follow-up is permitted and contact them when policy allows.</p>
      <p>Runtime can later wait on the server after the app is closed, see the reply when it arrives, update the project state, continue the next approved step and bring you in only when the policy requires your decision.</p>
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
        <strong>Signals are how Continuum can notice that the world changed.</strong>
        <p>Approved Sources produce evidence with timestamps and provenance. Observations become typed Signals when something meaningful changes, then State records what matters now.</p>
      </div>
      <div class="continuum-senses-flow" aria-label="Source to State flow"><b>Source</b><i>→</i><b>Observation</b><i>→</i><b>Signal</b><i>→</i><b>State</b></div>`;
    anchor.after(strip);
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
        <strong>Different approved intelligence can fit different jobs.</strong>
        <p>Coding, research, vision, sensitive local work and future tasks can use different models when privacy, cost, availability and policy allow. Changing the model does not change the authority.</p>
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
        <strong>Natural language can configure the control layer without becoming authority.</strong>
        <p>You can eventually describe the setup you want in normal language. Continuum can turn that into a typed Change Plan across mature domains such as People, Library content, Sources, Watches, Automations, capability mappings and policy, then show what would change before protected services apply anything.</p>
        <div class="continuum-forward-flow" aria-label="Future Planner change flow"><span>INTENT</span><i>→</i><span>CHANGE PLAN</span><i>→</i><span>PREFLIGHT</span><i>→</i><span>REVIEW</span><i>→</i><span>APPLY</span></div>
        <small>Planner can propose new configuration and policy. Executable capability and authority remain protected server decisions.</small>`;
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
        <strong>Observed change can alter what Continuum understands about the current situation.</strong>
        <p>A Signal can update State, satisfy a condition, change priority, wake a waiting Runtime or make a published policy eligible. Policy and authority still decide whether consequential work may proceed.</p>
        <div class="continuum-forward-flow continuum-signal-flow" aria-label="Future Signal to execution flow"><span>SIGNAL</span><i>→</i><span>STATE</span><i>→</i><span>POLICY</span><i>→</i><span>AUTHORITY</span><i>→</i><span>RUNTIME</span><i>→</i><span>RESULT</span></div>
        <small>Evidence changes understanding. Published authority controls execution.</small>`;
    }
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
      <strong>Continuum can notice how its environment could become more capable.</strong>
      <p>A new API, MCP server, service or device can expose useful data or tools. Continuum can eventually discover that metadata, classify what the capability reads or changes, map it into a typed operation, test it, simulate the effect and prepare the setup that your policy allows.</p>
      <div class="continuum-forward-flow" aria-label="Future capability adoption flow"><span>DISCOVER</span><i>→</i><span>MAP</span><i>→</i><span>TEST</span><i>→</i><span>SIMULATE</span><i>→</i><span>POLICY</span><i>→</i><span>ENABLE</span></div>
      <div class="continuum-capability-example"><b>Example</b><span>A workflow keeps stopping because deployment access is missing. Continuum could identify a compatible GitHub or deployment capability, prepare the integration mapping and tests, simulate what would change and surface the setup for approval or an already-authorized adoption policy.</span></div>
      <small>Capability growth and permission growth stay separate.</small>`;
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
  addStateStrip();
  strengthenRuntimeStory();
  neutralizeExampleNames();
  addSensesStrip();
  addModelRouting();
  addPlannerAndSignalsNotes();
  addCapabilityExtensionNote();
  addOriginNote();

  document.documentElement.dataset.continuumOrigin = 'ready';
  document.documentElement.dataset.continuumSignalsPlanner = 'ready';
  document.documentElement.dataset.continuumPowerClarity = '20260819';
  document.documentElement.dataset.continuumArchitectureAligned = '20260819';
})();