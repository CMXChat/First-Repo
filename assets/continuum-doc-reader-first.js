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

  function refineHero() {
    const lead = qs('.continuum-hero .hero-lead');
    if (!lead) return;

    lead.innerHTML = '<span class="hero-lead-first">Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved when you are away, and follow plans you prepared for a time when you can\'t respond.</span><span class="hero-lead-second">Continuum keeps all of this connected. Your saved information lives in Library, and Directory keeps track of the people and organizations around it. When you want to focus on one part of your life or work, a Space brings the relevant context together, and Automations describe work you\'ve already approved to continue under set rules. Check In is the live timer you use to show you\'re still responding, and Afterlife is the longer-term continuity area for plans that may be needed when you can\'t respond, including after death. Changing the AI model or tool doesn\'t take the underlying records, permissions or history with it.</span>';
  }

  function refineOverview() {
    const section = document.getElementById('overview');
    if (!section) return;

    setText('.section-intro', 'Continuum takes in information from sources you\'ve approved, keeps track of what matters now, checks what it\'s allowed to do, uses the right tools and records the result.', section);

    const steps = qsa('.process-step', section);
    const copy = [
      ['Receive information', 'Messages, files, calendars, account data, APIs and direct updates can arrive from sources you approved.'],
      ['Keep knowledge + current State', 'Continuum keeps a current picture of what is true now. That picture is called State, and it sits alongside saved people, files, dates, relationships and history.'],
      ['Check what is allowed', 'Before anything runs, the server checks the permissions, approvals, timing rules and limits that apply.'],
      ['Use the right capability', 'AI and connected services can use only the tools allowed for the job. Later, Runtime is the server-side part that can keep approved work moving even after you close the app.'],
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

    setText('.presence-heading strong', 'One place for what matters now, later, and when you can\'t respond.', presence);

    const stages = qsa('.presence-stage', presence);
    if (stages[2]) {
      setText('p', 'Later, Runtime can keep approved work moving on the server even when the app isn\'t open, including waits, replies and retries.', stages[2]);
    }
    if (stages[3]) {
      setText('p', 'Use the instructions, people and permissions you set up ahead of time.', stages[3]);
    }

    setText('.presence-truth span', 'Check In timing is live today. Sending through outside providers, long-running Runtime and automatic fallback based on your rules are later work.', presence);
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

    setText('.section-intro', 'You can describe the job normally, then Continuum turns the parts that matter into an Automation with clear people, timing, approvals, limits and actions for the server to check.', section);

    const primer = qs('.clarity-automation-copy', section);
    if (primer) {
      primer.innerHTML = '<strong>An Automation is a saved definition of work and the rules around it.</strong> You can start with the outcome in normal language, then make the triggers, conditions, permissions and actions explicit. Runtime comes later and is the server-side part that carries published work forward and records what happened.';
    }

    const runtime = qs('.policy-runtime', section);
    if (runtime) {
      setText('strong', 'Runtime keeps published work moving on the server.', runtime);
      setText('small', 'It can wait, retry when allowed, use approved tools, react to changes and record the result even when the app isn\'t open.', runtime);
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

    const signals = qs('.continuum-signals-note');
    if (signals) {
      setText('p', 'A Signal may satisfy a condition, change priority, wake a waiting Runtime or make a saved rule ready to use. The published rules and permissions still decide whether the next action is allowed.', signals);
    }

    const goal = qs('.continuum-goal-note');
    if (goal) {
      setText('strong', 'A Goal is for an outcome that may take several steps and change along the way.', goal);
      setText('p', 'It keeps the result you\'re aiming for, the limits and the required approvals in one place. Planner can adjust the route as conditions change, and Runtime can carry approved steps across waits and replies.', goal);
    }

    const continuity = qs('.continuum-authorized-continuity-note');
    if (continuity) {
      setText('p', 'You can choose the people, information, priorities, limits and permissions ahead of time. Future Runtime can use that prepared plan to check what is happening now, contact the right people, release approved information, wait for replies and carry the next allowed step forward.', continuity);
    }
  }

  function refineProductMap() {
    const intro = qs('.clarity-product-map-section .section-intro');
    if (!intro) return;

    intro.textContent = 'Directory and Library keep the people and information Continuum needs, and Spaces turn that context into focused views. Automations describe work you\'ve approved, Connections link outside apps and tools, and Runtime can later keep published work moving on the server. Continuum can also watch approved sources for meaningful changes. Those changes become Signals and can update its current State. AI only works across the context and tools it\'s allowed to use.';
  }

  function refineRoadmap() {
    const section = document.getElementById('status');
    if (!section) return;

    setText('.section-intro', 'Check In already proves that important timing can live on the server instead of depending on an open browser. The next milestone is private information that survives across sessions and devices. From there, Runtime can keep approved work moving on the server and more outside tools can connect as they become useful.', section);
  }

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
})();
