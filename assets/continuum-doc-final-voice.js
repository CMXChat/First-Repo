'use strict';

(() => {
  if (document.documentElement.dataset.continuumFinalVoice === 'ready') return;

  const qs = (selector, scope = document) => scope?.querySelector(selector) || null;
  const qsa = (selector, scope = document) => Array.from(scope?.querySelectorAll(selector) || []);

  function setText(selector, text, scope = document) {
    const node = qs(selector, scope);
    if (node) node.textContent = text;
    return node;
  }

  function polishHero() {
    const lead = qs('.continuum-hero .hero-lead');
    if (!lead) return;

    lead.innerHTML = '<span class="hero-lead-first">AI can reason, write and help make decisions, but by itself it doesn\'t reliably remember your life and work, know what changed while you were away, keep track of the people and documents that matter, respect the permission rules you set or keep a process going after the chat closes. Continuum is the private layer around the AI that keeps those things connected over time.</span><span class="hero-lead-second">When something changes, Continuum can update what it knows and use the rules you already set to decide what should happen next. That might mean acting, waiting, asking you, contacting someone or doing nothing. The Dead Man Switch is one example of that, and the same setup is useful every day when you\'re asleep, busy, offline, waiting on someone or working toward something that takes several steps. If you switch to a better AI later, the memory, context, permissions and history stay with Continuum.</span>';
  }

  function polishOverviewAndAI() {
    const overview = document.getElementById('overview');
    if (overview) {
      setText('.section-intro', 'From there the flow is simple. A deadline can arrive, someone can reply, a check-in timer can reach a condition or an approved source can change. Continuum updates what it knows, checks the rules and permissions you set, and decides whether the next step is to act, wait, ask you or do nothing. The sections below put the technical names on each part of that flow.', overview);

      const state = qs('.continuum-state-strip', overview);
      if (state) setText('p', 'State is the part Continuum keeps current. It reflects what is true now, so policy, AI and Runtime can work from the latest situation and still keep the older history available.', state);
    }

    const ai = document.getElementById('difference');
    if (ai) {
      setText('.section-intro', 'AI can handle the reasoning, writing and tool use. Continuum keeps the context, current situation, permissions and history around that work, and only gives the model the information and tools you have allowed for the job. The server still makes the final call on whether an action can run.', ai);
    }
  }

  function polishInformationAndWork() {
    const information = document.getElementById('spaces');
    if (information) {
      setText('.section-intro', 'Continuum needs a stable way to remember information and know who or what it belongs to. Documents, files, knowledge and versions live in Library, people and organizations have stable records in Directory, and a Space can pull the relevant pieces together when you want to focus on one part of your life or work.', information);
    }

    const action = document.getElementById('action');
    if (action) {
      const primer = qs('.clarity-automation-copy', action);
      if (primer) {
        primer.innerHTML = '<strong>An Automation is a saved piece of work that can run again or start when something happens.</strong> It can begin at a certain time, after a reply, when Check In reaches a condition or when another approved change happens. Runtime is the server-side part that will later keep that work going after you close the app.';
      }
    }
  }

  function polishFuturePanels() {
    const capability = qs('.continuum-capability-extension-note');
    if (capability) {
      setText('strong', 'If Continuum keeps running into the same missing capability, it should be able to show you what is missing.', capability);
      setText('p', 'An API, MCP server, service or device may fill that gap. Continuum can inspect what it exposes, map the useful operation and test the expected effect before you enable it.', capability);
      const small = qs('small', capability);
      if (small) small.textContent = 'The new capability still follows the permissions already in place.';
    }

    const evolution = qs('.continuum-architecture-evolution-note');
    if (evolution) {
      setText('strong', 'If the same limitation keeps getting in the way, Continuum may need a new backend feature or data model.', evolution);
      setText('p', 'A future development loop could prepare the smallest change needed, along with the migration, tests and release checks required to prove it works.', evolution);
    }
  }

  function polishMapOriginAndArchitecture() {
    const mapIntro = qs('.clarity-product-map-section .section-intro');
    if (mapIntro) {
      mapIntro.textContent = 'The product map shows how those pieces fit together. Directory and Library hold stable people and information, Spaces pull together the context you need, Automations save repeatable work, and Goals keep a larger outcome in view when the route changes. Connections bring in outside tools and data. Runtime can later keep work going on the server, Signals update what Continuum knows about the current situation, and AI only gets the context and capabilities allowed for the job.';
    }

    const origin = qs('.continuum-origin-note');
    if (origin) {
      const paragraphs = qsa('.continuum-origin-copy > p:not(.continuum-origin-kicker)', origin);
      if (paragraphs[1]) paragraphs[1].textContent = 'That same setup is useful long before anything goes wrong. You might be asleep, traveling, offline, waiting on someone or moving through a longer project, and the context and rules still need to be there when the next step becomes possible.';
      if (paragraphs[2]) paragraphs[2].textContent = 'That\'s where Continuum becomes bigger than the Dead Man Switch. It keeps context, current State, permissions and history together so AI and connected tools can help when you\'re here, approved work can continue when you\'re away, and continuity plans can still be followed when you can\'t respond.';
    }

    const engineering = document.getElementById('engineering');
    if (engineering) {
      setText('.section-intro', 'At the technical level, the browser, backend and database show how a request moves through the app. Above that, Continuum\'s architecture connects the information, current State, permissions, AI, tools and results that need to stay together as the product grows.', engineering);
    }
  }

  polishHero();
  polishOverviewAndAI();
  polishInformationAndWork();
  polishFuturePanels();
  polishMapOriginAndArchitecture();

  document.documentElement.dataset.continuumFinalVoice = 'ready';
  document.documentElement.dataset.continuumVoice = 'natural-v4';
})();
