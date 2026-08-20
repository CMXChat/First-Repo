'use strict';

(() => {
  if (document.documentElement.dataset.continuumReaderFirst === 'ready') return;

  const qs = (selector, scope = document) => scope?.querySelector(selector) || null;
  const qsa = (selector, scope = document) => Array.from(scope?.querySelectorAll(selector) || []);

  function setText(selector, text, scope = document) {
    const node = qs(selector, scope);
    if (node) node.textContent = text;
    return node;
  }

  function refineNavigationAndStatus() {
    setText('.document-toc a[href="#difference"]', '02 · AI + Permissions');
    setText('.toolbar-links a[href="#difference"]', 'AI + Permissions');

    const statusCopy = 'Check In is LIVE. Spaces and Automations are LAB. Durable private information and saved Automation definitions are NEXT. Long-running Runtime, outside actions, Goals and autonomous AI work are LATER.';
    setText('.rail-status p', statusCopy);
    setText('.clarity-status-frame .clarity-mini-heading p', statusCopy);

    const statusItems = qsa('.status-key-item');
    const statusText = [
      'Working with real server-backed data now',
      'Interactive design or proving surface',
      'Next part being connected to the real backend',
      'Planned after the foundation is in place'
    ];
    statusItems.forEach((item, index) => {
      const copy = statusText[index];
      if (!copy) return;
      const spans = qsa('span', item);
      if (spans[1]) spans[1].textContent = copy;
    });
  }

  function refineHero() {
    setText('.hero-kicker', 'Think of AI as the brain and Continuum as the nervous system around it');

    const lead = qs('.continuum-hero .hero-lead');
    if (lead) {
      lead.innerHTML = '<span class="hero-lead-first">An AI model can reason, write and help make decisions. What it still needs around it is a reliable way to carry your life and work context across time, know what changed while you were away, remember the people and documents that matter, enforce your permission rules, and keep a process going after the chat closes. Continuum is that private layer.</span><span class="hero-lead-second">It keeps the information, people, documents, current situation and history around the AI so a change can update what Continuum knows and the rules you set can decide what should happen next. That might mean acting, waiting, asking you, contacting someone or doing nothing. The Dead Man Switch is one example, and the same foundation can help with everyday work when you\'re asleep, busy or offline and later with bigger goals that take several steps. If you switch to a better AI later, the memory, context, permissions and history stay with Continuum.</span>';
    }

    const truths = qs('.hero-truth-row');
    if (truths) {
      truths.innerHTML = '<span><i></i>Carries context across time</span><span><i></i>Keeps up with real changes</span><span><i></i>Works inside rules you set</span>';
    }

    const principle = qs('.capability-principle');
    if (principle) {
      setText('span', 'BUILT TO CARRY YOUR PLAN FORWARD', principle);
      setText('strong', 'You can change the AI without losing the memory, permissions and history Continuum keeps.', principle);
    }
  }

  function refineOverview() {
    const section = document.getElementById('overview');
    if (!section) return;

    setText('h2', 'From something changing to the next allowed step', section);
    setText('.section-intro', 'That basic idea becomes a loop. A deadline can arrive, someone can reply, a check-in timer can reach a condition or an approved source can change. Continuum updates what it knows about the situation, checks the rules and permissions you set, and then the next step may be to act, wait, ask you or do nothing. The pieces below give those jobs their technical names.', section);

    const steps = qsa('.process-step', section);
    const copy = [
      ['Take in what changed', 'Messages, files, calendars, account data, APIs and direct updates can arrive from sources you approved.'],
      ['Understand what is true now', 'Continuum keeps a current picture of the situation. That picture is called State, and it sits alongside saved people, files, dates, relationships and history.'],
      ['Check the rules', 'Before anything runs, the server checks the permissions, approvals, timing rules and limits that apply.'],
      ['Use an allowed tool', 'AI and connected services use only the capabilities allowed for the job. Later, Runtime can keep approved work moving after you close the app.'],
      ['Keep the result', 'Continuum keeps the result, timing and reason so the next decision can start from the latest information.']
    ];

    steps.forEach((step, index) => {
      if (!copy[index]) return;
      setText('h3', copy[index][0], step);
      setText('p', copy[index][1], step);
    });
  }

  function refinePresence() {
    const presence = qs('.continuum-presence');
    if (!presence) return;

    setText('.presence-heading strong', 'Useful now, built to keep going later.', presence);
    setText('.presence-heading > p', 'Continuum can help you understand what needs attention when you are present, keep approved work moving when you are away, and follow plans you prepared for times when you can\'t respond.', presence);

    const stages = qsa('.presence-stage', presence);
    const copy = [
      ['Understand what needs attention', 'Bring together the context for the decision in front of you.'],
      ['Carry the next step forward', 'Use saved rules and approved tools to keep work moving.'],
      ['Keep going after you leave', 'Later, Runtime can wait for time, replies and other changes on the server.'],
      ['Follow a plan you prepared', 'Use the people, information and permissions you chose ahead of time.']
    ];

    stages.forEach((stage, index) => {
      if (!copy[index]) return;
      setText('h3', copy[index][0], stage);
      setText('p', copy[index][1], stage);
    });

    setText('.presence-truth span', 'Check In timing is live today. Outside actions, long-running Runtime, Goals and automatic fallback based on your rules are later work.', presence);
  }

  function refineAI() {
    const section = document.getElementById('difference');
    if (!section) return;

    setText('h2', 'AI works inside the context and permissions Continuum keeps', section);
    setText('.section-intro', 'AI can help with reasoning, writing and tool use, but Continuum keeps the context, current situation, permissions and history around the work. The model only gets the information and abilities the job allows, and the server checks whether an action is actually permitted.', section);

    const principle = qs('.authority-principle', section);
    if (principle) {
      setText('b', 'Authority is the permission to act.', principle);
      setText('span', 'A stronger model may make a better decision, but it doesn\'t gain extra permission on its own.', principle);
    }

    const callout = qs('.rule-callout', section);
    if (callout) {
      setText('strong', 'The server makes the final permission check.', callout);
      setText('span', 'AI can understand the goal and choose among allowed options. Protected server rules decide whether the action can run.', callout);
    }
  }

  function refineInformation() {
    const section = document.getElementById('spaces');
    if (!section) return;

    setText('h2', 'Keep information connected to the people and situations it belongs to', section);
    setText('.section-intro', 'Continuum needs a stable way to remember information and connect it to the people and situations it belongs to. Library keeps the documents, files, knowledge and versions you want to preserve. Directory keeps stable records for people and organizations, and a Space can pull the relevant pieces together when you want to focus on one part of your life or work.', section);

    const senses = qs('.continuum-senses-strip', section);
    if (senses) {
      setText('.continuum-senses-copy strong', 'Continuum can notice when an approved source changes.', senses);
      setText('.continuum-senses-copy p', 'It can save what the source showed at that moment and compare it with what came before. A meaningful change becomes a Signal, which can update its current State and make later work aware of the new situation.', senses);
    }

    const quality = qs('.continuum-knowledge-quality-note', section);
    if (quality) {
      setText('strong', 'The source and level of certainty stay attached.', quality);
      setText('p', 'A direct observation, something a person said, an AI conclusion and Continuum\'s current State may carry different weight. Time, freshness and conflicts stay with the record so later decisions can judge the difference.', quality);
    }
  }

  function refineAutomations() {
    const section = document.getElementById('action');
    if (!section) return;

    setText('h2', 'Describe the work normally, then make the important rules clear', section);
    setText('.section-intro', 'You can describe what should start the work and what should happen next in normal language. Continuum turns the important parts into a saved Automation with clear conditions, limits, permissions and actions that the server can check.', section);

    const primer = qs('.clarity-automation-copy', section);
    if (primer) {
      primer.innerHTML = '<strong>An Automation is how Continuum remembers a repeatable or triggered piece of work.</strong> It can start from a time, a reply, a Check In condition or another approved change, then follow the steps and limits you set. Runtime is the later server-side part that keeps published work going after you close the app.';
    }

    const runtime = qs('.policy-runtime', section);
    if (runtime) {
      setText('strong', 'Runtime lets approved work continue after you leave.', runtime);
      setText('small', 'It runs on the server, so it can wait, handle replies, retry when allowed, use approved tools and keep a record of what happened.', runtime);
    }

    const signals = qs('.continuum-signals-note', section);
    if (signals) {
      setText('strong', 'Changes can move the work forward.', signals);
      setText('p', 'A deadline, reply, Check In condition or approved outside change can make the next step ready. Continuum still checks the rules and permissions before that step can run.', signals);
    }
  }

  function refineAfterlife() {
    const section = document.getElementById('afterlife');
    if (!section) return;

    setText('.section-intro', 'Afterlife is for continuity plans that may need to last through a long period when you can\'t respond, including plans for after death. You choose the people, information, instructions and permissions ahead of time. Check In provides the trigger, and future Runtime can follow only the parts of the plan you already authorized.', section);

    const truth = qsa('.afterlife-truth > div', section);
    if (truth[0]) truth[0].innerHTML = '<b>LIVE</b> Check In keeps its timing on the server, lets you pause or resume, supports allowed deadline changes and records an Incident if the timer reaches its trigger.';
    if (truth[1]) truth[1].innerHTML = '<b>LATER</b> Continuum can use prepared continuity rules to contact approved people, wait for replies, retry when allowed and carry the next approved step forward through Runtime.';
  }

  function refineFutureConcepts() {
    const planner = qs('.continuum-planner-note');
    if (planner) {
      setText('strong', 'You will be able to describe a setup or change normally and review what Continuum proposes before anything is applied.', planner);
      setText('p', 'Planner turns the request into a Change Plan, which is the proposed set of edits across the product. You can inspect it before the server applies anything.', planner);
      const small = qs('small', planner);
      if (small) small.textContent = 'Planner proposes changes. The server still controls what gets applied and what may execute.';
    }

    const goal = qs('.continuum-goal-note');
    if (goal) {
      setText('strong', 'When one outcome takes several steps, a Goal gives Continuum something larger to work toward.', goal);
      setText('p', 'It keeps the outcome, limits and required approvals together even if the route changes. Planner can later suggest a new route, and Runtime can carry approved steps across waits, replies and other changes.', goal);
      const small = qs('small', goal);
      if (small) small.textContent = 'A new route still has to stay inside the limits and authority you set.';
    }

    const capability = qs('.continuum-capability-extension-note');
    if (capability) {
      setText('strong', 'When Continuum keeps reaching the edge of what a connected tool can do, that gap should be visible.', capability);
      setText('p', 'A compatible API, MCP server, service or device could fill it. Before a new capability is enabled, Continuum can inspect what it exposes, map the useful operation and test the expected effect.', capability);
      const small = qs('small', capability);
      if (small) small.textContent = 'The new capability still works under the permissions already in place.';
    }

    const continuity = qs('.continuum-authorized-continuity-note');
    if (continuity) {
      setText('strong', 'A plan you prepared can still matter when you can\'t take part directly.', continuity);
      setText('p', 'You can choose the people, information, priorities, limits and permissions ahead of time. Future Runtime can use that plan to check the current situation, contact the right people, release approved information, wait for replies and carry the next allowed step forward.', continuity);
    }

    const evolution = qs('.continuum-architecture-evolution-note');
    if (evolution) {
      setText('strong', 'If the same limitation keeps blocking useful work, the product itself may need to grow.', evolution);
      setText('p', 'A future development loop could prepare the smallest backend change needed, along with the migration, tests and release checks required to prove it works.', evolution);
      const small = qs('small', evolution);
      if (small) small.textContent = 'Architecture changes still go through versioning, migration checks, tests, release controls and rollback.';
    }

    const control = qs('.continuum-control-center-note');
    if (control) {
      setText('strong', 'Control Center is where you see what Continuum is doing across time.', control);
      setText('p', 'It can show what is active, waiting, coming next and already finished, with enough detail to understand why an important action happened and which rules were in effect.', control);
      const small = qs('small', control);
      if (small) small.textContent = 'The main activity view can stay simple even when the server keeps a deeper Audit record.';
    }
  }

  function refineProductMapAndOrigin() {
    const intro = qs('.clarity-product-map-section .section-intro');
    if (intro) {
      intro.textContent = 'By this point the parts have names. Directory and Library keep stable people and information, Spaces focus the context you need, Automations hold repeatable work, and Goals can hold a larger outcome when the route changes. Connections bring in outside tools and data, Runtime can later keep approved work alive on the server, and Signals update Continuum\'s picture of what is happening now. AI only gets the context and capabilities the job allows.';
    }

    const origin = qs('.continuum-origin-note');
    if (origin) {
      const paragraphs = qsa('.continuum-origin-copy > p:not(.continuum-origin-kicker)', origin);
      if (paragraphs[0]) paragraphs[0].textContent = 'Continuum grew out of a simple continuity problem. If you stop responding, the people, information and instructions you prepared still need somewhere durable to live, and the system needs a reliable way to know when that plan matters. Check In gives that situation a clear trigger.';
      if (paragraphs[1]) paragraphs[1].textContent = 'Once that problem is solved, the same foundation becomes useful every day. You might be asleep, traveling, offline, waiting on someone or moving through a longer project, and the context and rules still need to survive until the next step becomes possible.';
      if (paragraphs[2]) paragraphs[2].textContent = 'That is the broader Continuum idea. It keeps context, current State, permissions and history together so AI and connected tools can help when you are present, approved work can continue when you are away, and continuity plans can still be followed when you can\'t respond.';
    }
  }

  function refineEngineeringAndBuild() {
    const engineering = document.getElementById('engineering');
    if (engineering) {
      setText('h2', 'How Continuum is put together', engineering);
      setText('.section-intro', 'The browser, backend and database explain how the app runs. The Continuum architecture explains how information, current State, permissions, AI, tools and results stay connected as the product grows.', engineering);
    }

    const build = document.getElementById('build');
    if (build) {
      setText('h2', 'Start in the Lab, then connect the real backend', build);
      setText('.section-intro', 'The Lab is where an idea can be tried quickly enough to understand how it should feel. Once the behavior makes sense, we define the durable data and permission rules, build and test the backend, then connect the accepted interface to protected APIs.', build);
    }
  }

  function refineRoadmap() {
    const section = document.getElementById('status');
    if (!section) return;

    setText('h2', 'Make private information durable, then let approved work keep going', section);
    setText('.section-intro', 'Check In already proves that important timing can live on the server without an open browser. The next milestone is private information that survives across sessions and devices. Once that foundation is real, Runtime can start carrying approved work across time, and later pieces such as Goals and outside actions can build on the same model.', section);
    setText('.closing-note', 'Continuum is meant to keep the context, current situation, permissions and history that matter as AI models, tools and interfaces change around it.', section);
  }

  refineNavigationAndStatus();
  refineHero();
  refineOverview();
  refinePresence();
  refineAI();
  refineInformation();
  refineAutomations();
  refineAfterlife();
  refineFutureConcepts();
  refineProductMapAndOrigin();
  refineEngineeringAndBuild();
  refineRoadmap();

  document.documentElement.dataset.continuumReaderFirst = 'ready';
  document.documentElement.dataset.continuumProductStory = 'balanced-v2';
})();
