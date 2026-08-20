'use strict';

(() => {
  if (document.documentElement.dataset.continuumHumanCadence === 'ready') return;

  const qs = (selector, scope = document) => scope?.querySelector(selector) || null;
  const qsa = (selector, scope = document) => Array.from(scope?.querySelectorAll(selector) || []);

  function setText(selector, text, scope = document) {
    const node = qs(selector, scope);
    if (node) node.textContent = text;
    return node;
  }

  function refineHero() {
    const lead = qs('.continuum-hero .hero-lead');
    if (lead) {
      lead.innerHTML = '<span class="hero-lead-first">Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved when you are away, and follow plans you prepared for a time when you can\'t respond.</span><span class="hero-lead-second">Continuum keeps all of this connected. Library preserves the information and Directory ties it to people and relationships, which gives Spaces the context it needs to focus on one part of your life or work. Automations can use those same records and rules to carry approved work forward. Check In and Afterlife extend the plan when you are away or unable to respond, and changing the AI model or tool doesn\'t take the underlying records, permissions or history with it.</span>';
    }
  }

  function refineCoreSections() {
    const difference = document.getElementById('difference');
    if (difference) {
      setText('h2', 'The rules stay with Continuum when the AI changes', difference);
      setText('.section-intro', 'An AI model can reason, write and use tools. The information, current State, permissions and history stay with Continuum, which determines what the model can see and which actions are available to it.', difference);

      const answer = qs('.ai-answer', difference);
      if (answer) {
        setText('strong', 'What Continuum gives the model', answer);
        setText('p', 'The model gets only the context and tools allowed for the job, and Continuum keeps the records and server rules that decide what happens next.', answer);
      }

      const capabilityHead = qs('.capability-layer-head', difference);
      if (capabilityHead) {
        setText('strong', 'New models and tools can be added under the rules already in place.', capabilityHead);
        setText('p', 'That lets Continuum add useful abilities over time without changing who or what is allowed to act.', capabilityHead);
      }

      setText('.capability-layer-note', 'As technology improves, permission to use it still comes from the rules you set.', difference);

      const principle = qs('.authority-principle', difference);
      if (principle) {
        setText('b', 'Authority is the permission to act.', principle);
        setText('span', 'A better model can improve the quality of a decision without gaining extra permission on its own.', principle);
      }

      const callout = qs('.rule-callout', difference);
      if (callout) {
        setText('strong', 'The server makes the final permission check.', callout);
        setText('span', 'AI can understand the goal and choose among allowed options. Protected server rules decide whether the action can actually run.', callout);
      }
    }

    const spaces = document.getElementById('spaces');
    if (spaces) {
      setText('.section-intro', 'Library, Directory and Spaces each handle a different part of the same context. Library preserves documents, files, knowledge and version history, and Directory connects that information to stable records for people and organizations. Spaces can then bring the pieces you need into one focused view.', spaces);

      const directoryCard = qs('.people-map-card', spaces);
      if (directoryCard) setText('p', 'Directory keeps stable records of people and groups, so a label such as lawyer, family member or trusted contact can add useful context without granting permission by itself.', directoryCard);

      const libraryCard = qs('.library-flow-card', spaces);
      if (libraryCard) setText('p', 'Library keeps documents, files and their versions. An Automation can keep using version 3 even after you start editing version 4.', libraryCard);
    }

    const action = document.getElementById('action');
    if (action) {
      setText('.section-intro', 'You can describe the job normally. Continuum pulls out the people, timing, approvals, limits and actions that matter so the server has clear rules to check before anything runs.', action);

      const policyHead = qs('.policy-translation-head', action);
      if (policyHead) setText('p', 'Natural language makes setup easier, then structured fields give Runtime the exact rules it needs once execution exists.', policyHead);

      const primer = qs('.clarity-automation-copy', action);
      if (primer) {
        primer.innerHTML = '<strong>Automations describe work the server can validate.</strong> You can start with the outcome in normal language, then turn the important parts into clear triggers, conditions, permissions and actions. Runtime comes later and is responsible for carrying published work forward and recording what happened.';
      }

      const ceiling = qs('.ceiling-note', action);
      if (ceiling) {
        setText('strong', 'More useful tools can be added as Continuum grows.', ceiling);
        setText('p', 'Software, APIs, MCP servers, infrastructure, financial systems, devices and future technology can become sources or capabilities when there is a suitable way to connect them. Adding a capability expands what Continuum can do. The rules still decide when it may be used.', ceiling);
      }
    }

    const afterlife = document.getElementById('afterlife');
    if (afterlife) {
      setText('.section-intro', 'Afterlife carries the same Continuum foundation into long-term continuity. You prepare the people, information, instructions and permissions ahead of time. If you stop responding long enough, Check In records the trigger and future Runtime can follow the plan that is already in place.', afterlife);

      const authorityHead = qs('.continuity-authority-head', afterlife);
      if (authorityHead) {
        setText('strong', 'Decide what may happen before the situation ever occurs.', authorityHead);
        setText('p', 'The plan can cover ordinary use, a period when you are temporarily unreachable and long-term continuity, with the allowed actions set in advance.', authorityHead);
      }

      const truth = qsa('.afterlife-truth > div', afterlife);
      if (truth[0]) truth[0].innerHTML = '<b>LIVE</b> Protected Check In, changeable timing, policy history, pause and resume, one-time deadline changes, recorded Incidents, protected sessions, server state repair and Audit.';
      if (truth[1]) truth[1].innerHTML = '<b>LATER</b> Outside-provider delivery, server-side waits, retries, replies, acknowledgements, fallback authority and approved AI coordination through Runtime.';
    }

    const engineering = document.getElementById('engineering');
    if (engineering) {
      const concept = qs('.concept-architecture-head', engineering);
      if (concept) setText('p', 'Sources, saved information, current State, permissions, tools and results stay connected even when the model changes.', concept);
    }

    const build = document.getElementById('build');
    if (build) {
      setText('.section-intro', 'The Lab is where we work out how a feature should feel. Once the behavior is clear, we define the server data and permission rules, build and test the backend, then connect the accepted interface to protected APIs.', build);
    }

    const status = document.getElementById('status');
    if (status) {
      setText('.section-intro', 'Check In already proves protected server timing. The next milestone is private information that survives across sessions and devices. From there, Runtime can keep approved work moving on the server and more outside capabilities can connect as they become useful.', status);
      setText('.closing-note', 'Continuum is meant to preserve the information, current situation, permissions, rules and history that matter even as the AI models, tools and interfaces around them change.', status);
    }
  }

  function refineInformationPanels() {
    const knowledge = qs('.continuum-kt-knowledge');
    if (knowledge) {
      setText('.continuum-kt-head strong', 'Give Continuum text, Markdown, JSON, an AI handoff, a document or an image and it keeps the original source. It can then show you what it found before anything is accepted as long-term knowledge.', knowledge);
      setText('.continuum-kt-copy', 'The same intake path can handle pasted text, batches, files and approved connected sources and still keep a clear record of where each piece came from.', knowledge);
      setText('.continuum-kt-foot span', 'New information starts private. Its source stays attached, important findings remain reviewable and AI only receives the information allowed for the job.', knowledge);
    }

    const time = qs('.continuum-kt-time');
    if (time) {
      setText('.continuum-kt-copy', 'Elapsed time comes from server timestamps, so the AI doesn\'t have to stay open for Continuum to know how much time passed.', time);
    }

    const state = qs('.continuum-state-strip');
    if (state) setText('p', 'Knowledge preserves useful history. State describes the current condition that policy, AI and Runtime can use when deciding what happens next.', state);

    const senses = qs('.continuum-senses-strip');
    if (senses) {
      setText('.continuum-senses-copy strong', 'Signals help Continuum notice meaningful changes from approved sources.', senses);
      setText('.continuum-senses-copy p', 'Approved sources keep their timestamps and provenance. When an Observation shows that something meaningful changed, it can become a Signal and update the part of State that matters now.', senses);
    }

    const quality = qs('.continuum-knowledge-quality-note');
    if (quality) {
      setText('strong', 'Continuum keeps different kinds of information separate.', quality);
      setText('p', 'Something observed directly, something a person said, a conclusion drawn by AI and the Current State can carry different weight. The source, time, freshness and conflicts stay attached so later decisions can see the difference.', quality);
    }

    const routing = qs('.continuum-model-routing');
    if (routing) {
      setText('.continuum-routing-copy strong', 'Different jobs can use different approved models.', routing);
      setText('.continuum-routing-copy p', 'Coding, research, vision, sensitive local work and future tasks may use different models depending on privacy, cost, availability and policy. Changing the model doesn\'t change the authority already set for the task.', routing);
    }
  }

  function refineFuturePanels() {
    const planner = qs('.continuum-planner-note');
    if (planner) {
      setText('strong', 'You can describe a setup in normal language and still get a Change Plan the server can check.', planner);
      setText('p', 'Later, Continuum can turn that description into proposed changes across mature parts of the product, show you what would change and send approved changes through the same protected services used by the rest of the app.', planner);
      const small = qs('small', planner);
      if (small) small.textContent = 'Planner can propose changes, and the server still decides what gets applied and what can execute.';
    }

    const signals = qs('.continuum-signals-note');
    if (signals) {
      setText('strong', 'New evidence can change the State that later work relies on.', signals);
      setText('p', 'A Signal may satisfy a condition, change priority, wake a waiting Runtime or make a published policy eligible. Policy and authority still decide whether the next action is allowed.', signals);
    }

    const goal = qs('.continuum-goal-note');
    if (goal) {
      setText('strong', 'A Goal can keep an outcome moving across several steps and changing conditions.', goal);
      setText('p', 'A Goal can define what success looks like, the limits that must hold, which approvals are needed, how long the effort may continue and when to stop. Planner can adjust the strategy as conditions change, and Runtime can carry the approved work across waits and replies under the same continuity rules.', goal);
      const small = qs('small', goal);
      if (small) small.textContent = 'A new plan can change the strategy. It can\'t quietly change the limits, success criteria or authority you already set.';
    }

    const capability = qs('.continuum-capability-extension-note');
    if (capability) {
      setText('strong', 'If work keeps getting blocked by a missing tool, Continuum can identify the gap.', capability);
      setText('p', 'A compatible API, MCP server, service or device may fill that gap. Continuum can inspect the interface, map the useful operation, test it and simulate the effect before the new capability is enabled.', capability);
      const small = qs('small', capability);
      if (small) small.textContent = 'Adding a tool doesn\'t add permission because the existing rules still apply.';
    }

    const continuity = qs('.continuum-authorized-continuity-note');
    if (continuity) {
      setText('strong', 'Work you prepared in advance can continue when you can\'t take part directly.', continuity);
      setText('p', 'You can set the people, information, priorities, limits and authority ahead of time. Future Runtime can use that plan to check the current State, contact the right people, release approved information, wait for replies and carry the next allowed step forward.', continuity);
    }

    const evolution = qs('.continuum-architecture-evolution-note');
    if (evolution) {
      setText('strong', 'If the same problem keeps coming up, Continuum may need a new data model or backend feature.', evolution);
      setText('p', 'Later, Continuum could prepare the smallest backend change needed and include the migration, tests and release checks required to see whether it actually solves the recurring problem.', evolution);
      const small = qs('small', evolution);
      if (small) small.textContent = 'Architecture changes still go through versioning, migration checks, tests, release controls and rollback.';
    }

    const control = qs('.continuum-control-center-note');
    if (control) {
      setText('strong', 'The Control Center gives you one place to see what Continuum is doing in the background.', control);
      setText('p', 'It can show what is active, what is waiting, what comes next and what already happened. You can also inspect why an action occurred and which policy and authority were in effect at the time.', control);
      const small = qs('small', control);
      if (small) small.textContent = 'The activity view can stay simple even though the server keeps a deeper Audit record for important actions.';
    }
  }

  function refineProductMapAndOrigin() {
    const mapIntro = qs('.clarity-product-map-section .section-intro');
    if (mapIntro) {
      mapIntro.textContent = 'Directory, Library and Spaces cover identity, durable information and focused context. Automations describe work, Connections expose outside data and tools, and Runtime can later keep published work moving on the server. Signals can update State from approved observations, and AI only reasons across the context and capabilities it is allowed to use.';
    }

    const origin = qs('.continuum-origin-note');
    if (origin) {
      const paragraphs = qsa('.continuum-origin-copy > p:not(.continuum-origin-kicker)', origin);
      if (paragraphs[0]) paragraphs[0].textContent = 'Afterlife started with a practical question. If you stop responding, where do the people, information and instructions you prepared live, and what tells the system when they are needed? Check In gives that situation a clear trigger.';
      if (paragraphs[1]) paragraphs[1].textContent = 'The same foundation is useful long before an emergency. You might be asleep, on a flight, in a meeting, traveling, offline or simply waiting on someone before a deadline, and the context, State and rules you chose still need to be there when the next step becomes possible.';
      if (paragraphs[2]) paragraphs[2].textContent = 'Spaces and AI help you work with the context in front of you. Signals can later keep selected outside changes current, Automations define what should happen, and Runtime can keep approved work moving on the server. Afterlife uses that same foundation when direct approval is no longer available under the continuity plan you prepared.';
    }
  }

  refineHero();
  refineCoreSections();
  refineInformationPanels();
  refineFuturePanels();
  refineProductMapAndOrigin();

  document.documentElement.dataset.continuumHumanCadence = 'ready';
  document.documentElement.dataset.continuumVoice = 'natural-v3';
})();
