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

    const statusCopy = 'Check In is LIVE. Spaces and Automations are LAB. Durable private information and saved Automation definitions are NEXT. Long-running Runtime, outside actions and autonomous AI work are LATER.';
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
    setText('.hero-kicker', 'Your information, workflows and goals across time');

    const lead = qs('.continuum-hero .hero-lead');
    if (lead) {
      lead.innerHTML = '<span class="hero-lead-first">Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help with what you\'re doing now, and the same foundation is being built for workflows that react to changes and longer goals that may take several steps.</span><span class="hero-lead-second">An Automation is a saved workflow with something that starts it, conditions to check and rules for what it may do next. Check In is the live timer you use to show you\'re still responding, and Afterlife holds continuity plans for times when you can\'t respond, including after death. The AI model or tool can change without taking the underlying records, permissions or history with it.</span>';
    }

    const truths = qs('.hero-truth-row');
    if (truths) {
      truths.innerHTML = '<span><i></i>Keeps the right context current</span><span><i></i>Built for workflows + longer goals</span><span><i></i>Acts inside rules you set</span>';
    }
  }

  function refineOverview() {
    const section = document.getElementById('overview');
    if (!section) return;

    setText('.section-intro', 'Continuum takes in information and changes from sources you\'ve approved, keeps track of what matters now, checks what it\'s allowed to do, uses the right tools and records the result. A deadline can arrive, a reply can come in, Check In can reach a condition or an outside source can change. Any of those can make the next step ready, but the server still checks the rules before anything runs.', section);

    const steps = qsa('.process-step', section);
    const copy = [
      ['Receive information', 'Messages, files, calendars, account data, APIs and direct updates can arrive from sources you approved.'],
      ['Keep knowledge + current State', 'Continuum keeps a current picture of what is true now. That picture is called State, and it sits alongside saved people, files, dates, relationships and history.'],
      ['Check what is allowed', 'Before anything runs, the server checks the permissions, approvals, timing rules and limits that apply.'],
      ['Use the right capability', 'AI and connected services can use only the tools allowed for the job. If a workflow needs to keep going after you close the app, Runtime is the part that can later keep it alive in the background on the server.'],
      ['Record what happened', 'The result, timing and reason are kept so the next decision can start with current information.']
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

    setText('.presence-heading strong', 'One place for what matters now, work that continues later, and plans for when you can\'t respond.', presence);
    setText('.presence-heading > p', 'The same information and rules can help you understand what matters now, support workflows and longer goals over time, and carry continuity plans you prepared in advance.', presence);

    const stages = qsa('.presence-stage', presence);
    if (stages[1]) {
      setText('p', 'Use saved workflows and approved tools to follow up or carry the next step forward.', stages[1]);
    }
    if (stages[2]) {
      setText('p', 'Later, Runtime can keep work alive on the server even when the app isn\'t open, including waits, replies and retries.', stages[2]);
    }
    if (stages[3]) {
      setText('p', 'Use the instructions, people and permissions you set up ahead of time.', stages[3]);
    }

    setText('.presence-truth span', 'Check In timing is live today. Outside actions, long-running Runtime, Goals and automatic fallback based on your rules are later work.', presence);
  }

  function refineAI() {
    const section = document.getElementById('difference');
    if (!section) return;

    setText('.section-intro', 'An AI model can reason, write and use tools. Continuum keeps the information, current State, permissions and history around it, and the server decides what the model is actually allowed to see and do.', section);

    const principle = qs('.authority-principle', section);
    if (principle) {
      setText('b', 'Authority simply means permission to act.', principle);
      setText('span', 'A better model can improve the quality of a decision without gaining extra permission on its own.', principle);
    }
  }

  function refineInformation() {
    const section = document.getElementById('spaces');
    if (!section) return;

    setText('.section-intro', 'Library is where Continuum keeps documents, files, knowledge and version history, and Directory gives people and organizations stable records that can be connected to that information. A Space pulls the relevant pieces together when you want to focus on one part of your life or work.', section);

    const senses = qs('.continuum-senses-strip', section);
    if (senses) {
      setText('.continuum-senses-copy strong', 'Signals are the meaningful changes Continuum notices from sources you\'ve approved.', senses);
      setText('.continuum-senses-copy p', 'Continuum saves what a source showed at that moment as an Observation. If it shows a meaningful change, that can become a Signal and update the part of State that matters now.', senses);
    }

    const quality = qs('.continuum-knowledge-quality-note', section);
    if (quality) {
      setText('p', 'Something observed directly, something a person said, a conclusion drawn by AI and Continuum\'s current State can carry different weight. The source, time, freshness and conflicts stay attached so later decisions can see the difference.', quality);
    }
  }

  function refineAutomations() {
    const section = document.getElementById('action');
    if (!section) return;

    setText('.section-intro', 'You can describe the job normally, then Continuum turns the parts that matter into an Automation with a clear start, conditions, limits and actions for the server to check.', section);

    const primer = qs('.clarity-automation-copy', section);
    if (primer) {
      primer.innerHTML = '<strong>An Automation is a saved workflow with something that starts it, conditions to check and rules for what it may do.</strong> You can begin with the job in normal language, then make the important permissions, limits and actions clear. Runtime comes later and keeps published work moving after the app closes.';
    }

    const runtime = qs('.policy-runtime', section);
    if (runtime) {
      setText('strong', 'Runtime keeps published work alive in the background after you close the app.', runtime);
      setText('small', 'It runs on the server, where it can wait, retry when allowed, handle replies, use approved tools and record the result.', runtime);
    }

    const signals = qs('.continuum-signals-note', section);
    if (signals) {
      setText('strong', 'Changes can make the next step ready.', signals);
      setText('p', 'A deadline can arrive, a reply can come in, Check In can reach a condition or an approved source can change. That can update State or make a saved workflow ready to continue. The rules and permissions still decide whether the next action can run.', signals);
    }
  }

  function refineAfterlife() {
    const section = document.getElementById('afterlife');
    if (!section) return;

    setText('.section-intro', 'Afterlife is for continuity plans that may need to outlast a long period when you can\'t respond, including plans for after death. You choose the people, information, instructions and permissions ahead of time. Check In supplies the trigger, and future Runtime can follow the parts of the plan you already authorized.', section);

    const truth = qsa('.afterlife-truth > div', section);
    if (truth[0]) truth[0].innerHTML = '<b>LIVE</b> Check In already keeps its timing on the server, lets you pause or resume, supports allowed deadline changes and records an Incident if the timer reaches its trigger.';
    if (truth[1]) truth[1].innerHTML = '<b>LATER</b> Continuum can use prepared continuity rules to contact approved people, wait for replies, retry when allowed and carry the next approved step forward through Runtime.';
  }

  function refineFutureConcepts() {
    const planner = qs('.continuum-planner-note');
    if (planner) {
      setText('strong', 'Later, you\'ll be able to describe a setup in normal language and have Continuum prepare the changes for review.', planner);
      setText('p', 'Planner is the part that turns that request into a proposed set of changes, called a Change Plan. You can see what would change before the server applies anything.', planner);
      const small = qs('small', planner);
      if (small) small.textContent = 'Planner can propose changes. The server still decides what gets applied and what can execute.';
    }

    const goal = qs('.continuum-goal-note');
    if (goal) {
      setText('strong', 'A Goal is for something you want Continuum to work toward over several steps, even when the route changes.', goal);
      setText('p', 'It keeps the outcome, limits and required approvals in one place. A Goal can use more than one Automation or task as the situation changes, Planner can adjust the route, and Runtime can carry approved steps across waits and replies.', goal);
    }

    const continuity = qs('.continuum-authorized-continuity-note');
    if (continuity) {
      setText('p', 'You can choose the people, information, priorities, limits and permissions ahead of time. Future Runtime can use that prepared plan to check what is happening now, contact the right people, release approved information, wait for replies and carry the next allowed step forward.', continuity);
    }
  }

  function refineProductMap() {
    const intro = qs('.clarity-product-map-section .section-intro');
    if (!intro) return;

    intro.textContent = 'Directory and Library keep the people and information Continuum can work from, and Spaces bring the relevant context into focus. Automations handle saved workflows, and Goals can hold a larger outcome when the route may change. Connections link outside apps and tools. Runtime can later keep published work moving on the server. Signals can update what Continuum knows is happening now, and AI only gets the context and tools it\'s allowed to use.';
  }

  function refineRoadmap() {
    const section = document.getElementById('status');
    if (!section) return;

    setText('.section-intro', 'Check In already proves that important timing can live on the server instead of depending on an open browser. The next milestone is private information that survives across sessions and devices. From there, Runtime can keep approved work moving on the server, Goals can coordinate longer outcomes and more outside tools can connect as those parts become real.', section);
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
  refineProductMap();
  refineRoadmap();

  document.documentElement.dataset.continuumReaderFirst = 'ready';
  document.documentElement.dataset.continuumProductStory = 'complete-v1';
})();
