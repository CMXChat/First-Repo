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
      lead.innerHTML = '<span class="hero-lead-first">Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved while you are away, and follow plans you prepared for a time when you cannot respond.</span><span class="hero-lead-second">Continuum keeps those pieces connected: Library preserves the information, Directory ties it to people and relationships, and Spaces brings the relevant context into focus when you need it. Automations can use the same records and rules to carry approved work forward, with Check In and Afterlife extending the plan when you are away or unable to respond. The AI model or tool can change without taking the underlying records, permissions and history with it.</span>';
    }
  }

  function refineCoreSections() {
    const difference = document.getElementById('difference');
    if (difference) {
      setText('h2', 'The rules stay with Continuum when the AI changes', difference);
      setText('.section-intro', 'An AI model can reason, write and use tools, while Continuum keeps the information, current State, permissions and history that determine what the model can see and which actions are available to it.', difference);

      const capabilityHead = qs('.capability-layer-head', difference);
      if (capabilityHead) {
        setText('strong', 'New models and tools can be added under the rules already in place.', capabilityHead);
        setText('p', 'That lets Continuum gain useful abilities over time while access and permission continue to come from your policies.', capabilityHead);
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
        setText('span', 'AI can understand the goal and choose among allowed options, while protected server rules decide whether the action can actually run.', callout);
      }
    }

    const spaces = document.getElementById('spaces');
    if (spaces) {
      setText('.section-intro', 'Continuum keeps documents, people and current context connected across Library, Directory and Spaces. Library preserves documents, files, knowledge and version history, Directory gives people and organizations stable identities, and Spaces brings the relevant pieces together for one part of your life or work.', spaces);

      const directoryCard = qs('.people-map-card', spaces);
      if (directoryCard) setText('p', 'Directory keeps stable records of people and groups, so labels such as lawyer, family member or trusted contact can add useful context without granting permission by themselves.', directoryCard);

      const libraryCard = qs('.library-flow-card', spaces);
      if (libraryCard) setText('p', 'Library keeps documents, files and their versions, which means an Automation can continue using version 3 while you are already editing version 4.', libraryCard);
    }

    const action = document.getElementById('action');
    if (action) {
      setText('.section-intro', 'You can describe the job normally, while Continuum turns the people, timing, approvals, limits and actions that matter into structured rules the server can check before anything runs.', action);

      const policyHead = qs('.policy-translation-head', action);
      if (policyHead) setText('p', 'Natural language makes setup easier, and structured fields give Runtime exact rules for what it may do once execution exists.', policyHead);
    }

    const afterlife = document.getElementById('afterlife');
    if (afterlife) {
      setText('.section-intro', 'Afterlife extends the same Continuum foundation into long-term continuity: you prepare the people, information, instructions and permissions in advance, Check In records the trigger if you stop responding long enough, and future Runtime can follow the plan already in place.', afterlife);
    }

    const status = document.getElementById('status');
    if (status) {
      setText('.section-intro', 'Check In already proves protected server timing, so the next milestone is durable private information that survives across sessions and devices. From there, Runtime can keep approved work moving on the server while more outside capabilities connect over time.', status);
      setText('.closing-note', 'Continuum is meant to preserve the information, current situation, permissions, rules and history that matter even as the AI models, tools and interfaces around them change.', status);
    }
  }

  function refineInformationPanels() {
    const knowledge = qs('.continuum-kt-knowledge');
    if (knowledge) {
      setText('.continuum-kt-head strong', 'When you give Continuum text, Markdown, JSON, an AI handoff, a document or an image, it preserves the original source and shows what it found before anything is accepted as long-term knowledge.', knowledge);
      setText('.continuum-kt-copy', 'The same intake path can handle pasted text, batches, files and approved connected sources while keeping a clear record of where each piece came from.', knowledge);
      setText('.continuum-kt-foot span', 'New information starts private, its source stays attached, important findings remain reviewable, and AI only receives the information allowed for the job.', knowledge);
    }

    const time = qs('.continuum-kt-time');
    if (time) {
      setText('.continuum-kt-copy', 'Because elapsed time comes from server timestamps, the AI does not have to stay open for Continuum to know how much time passed.', time);
    }

    const state = qs('.continuum-state-strip');
    if (state) setText('p', 'Knowledge preserves useful history, while State describes the current condition that policy, AI and Runtime can use when deciding what happens next.', state);

    const senses = qs('.continuum-senses-strip');
    if (senses) {
      setText('.continuum-senses-copy strong', 'Signals help Continuum notice meaningful changes from approved sources.', senses);
      setText('.continuum-senses-copy p', 'Approved sources keep their timestamps and provenance, so an Observation can become a typed Signal when something meaningful changes and State can then reflect the part that matters now.', senses);
    }

    const quality = qs('.continuum-knowledge-quality-note');
    if (quality) {
      setText('strong', 'Continuum keeps different kinds of information distinct.', quality);
      setText('p', 'Observations, claims, AI-derived conclusions and Current State can carry different weight, with source, time, freshness and conflicts kept alongside them so later decisions can see the difference.', quality);
    }

    const routing = qs('.continuum-model-routing');
    if (routing) {
      setText('.continuum-routing-copy strong', 'Different approved models can be used where they fit best.', routing);
      setText('.continuum-routing-copy p', 'Coding, research, vision, sensitive local work and future tasks may use different models as privacy, cost, availability and policy allow, while the authority for the task stays the same until its policy changes.', routing);
    }
  }

  function refineFuturePanels() {
    const planner = qs('.continuum-planner-note');
    if (planner) {
      setText('strong', 'You can describe a setup in normal language, and the resulting Change Plan still has to pass the same server rules.', planner);
      setText('p', 'Continuum can eventually turn that description into typed changes across mature areas such as People, Library content, Sources, Watches, Automations, capability mappings and policy, then show you what would change before protected services apply it.', planner);
    }

    const signals = qs('.continuum-signals-note');
    if (signals) {
      setText('strong', 'When new evidence changes the situation, Continuum can update the State that later work relies on.', signals);
      setText('p', 'A Signal may satisfy a condition, change priority, wake a waiting Runtime or make a published policy eligible, with policy and authority still deciding whether consequential work may proceed.', signals);
    }

    const goal = qs('.continuum-goal-note');
    if (goal) {
      setText('strong', 'Goals can keep an outcome moving across multiple steps and changing conditions.', goal);
      setText('p', 'A Goal can define success, hard limits, required approvals, how long the effort may continue and when to stop. Planner can adjust the strategy as conditions change, while Runtime carries approved work across waits and replies under the same published continuity rules.', goal);
    }

    const capability = qs('.continuum-capability-extension-note');
    if (capability) {
      setText('strong', 'If work keeps getting blocked by a missing tool, Continuum can eventually identify what capability is missing.', capability);
      setText('p', 'When an API, MCP server, service or device can fill that gap, Continuum can inspect the interface, map it into a typed operation, test the mapping and simulate the effect before any approved setup is enabled.', capability);
    }

    const continuity = qs('.continuum-authorized-continuity-note');
    if (continuity) {
      setText('strong', 'Work you prepared in advance can continue when you cannot take part directly.', continuity);
      setText('p', 'You can set the people, information, priorities, limits and authority ahead of time, giving future Runtime a published plan it can use to check current State, contact the right people, release approved information, wait for replies and carry the next allowed step forward.', continuity);
    }

    const evolution = qs('.continuum-architecture-evolution-note');
    if (evolution) {
      setText('strong', 'A recurring problem can eventually show where Continuum itself needs to change.', evolution);
      setText('p', 'If the same work keeps failing because a data model, service or Runtime behavior is missing, Continuum can prepare a bounded architecture change with the migration, tests and release controls needed to evaluate it safely.', evolution);
    }

    const control = qs('.continuum-control-center-note');
    if (control) {
      setText('strong', 'The Control Center keeps background work visible and inspectable.', control);
      setText('p', 'A protected control surface can show what is active, what is waiting, what comes next and what already happened, while giving you a place to inspect why an action occurred and which policy and authority were in effect.', control);
    }
  }

  function refineProductMapAndOrigin() {
    const mapIntro = qs('.clarity-product-map-section .section-intro');
    if (mapIntro) {
      mapIntro.textContent = 'Directory, Library and Spaces cover identity, durable information and focused context; Automations describe work, Connections expose outside data and tools, and Runtime can eventually keep published work moving on the server. Signals can update State from approved observations, while AI reasons across only the context and capabilities it is allowed to use.';
    }

    const origin = qs('.continuum-origin-note');
    if (origin) {
      const paragraphs = qsa('.continuum-origin-copy > p:not(.continuum-origin-kicker)', origin);
      if (paragraphs[0]) paragraphs[0].textContent = 'Afterlife began with a practical problem: if you stop responding, the people, information and instructions you prepared still need somewhere reliable to live, and the Check In timer gives that situation a clear trigger.';
      if (paragraphs[1]) paragraphs[1].textContent = 'That same foundation is useful long before an emergency because you may be asleep, on a flight, in a meeting, traveling, offline or simply waiting on someone before a deadline, while the context, State and rules you chose still need to remain available.';
      if (paragraphs[2]) paragraphs[2].textContent = 'While you are actively using Continuum, Spaces and AI help you work with current context; Signals can later keep selected outside changes current, Automations define what should happen, and Runtime can keep approved work moving on the server. Afterlife uses the same foundation when direct approval is no longer available under the continuity plan you prepared.';
    }
  }

  refineHero();
  refineCoreSections();
  refineInformationPanels();
  refineFuturePanels();
  refineProductMapAndOrigin();

  document.documentElement.dataset.continuumHumanCadence = 'ready';
})();
