'use strict';

(() => {
  if (document.documentElement.dataset.continuumVisionRefresh === 'ready') return;

  const qs = (selector, scope = document) => scope?.querySelector(selector) || null;
  const qsa = (selector, scope = document) => Array.from(scope?.querySelectorAll(selector) || []);

  function setText(selector, text, scope = document) {
    const node = qs(selector, scope);
    if (node) node.textContent = text;
    return node;
  }

  function loadStyles() {
    if (document.querySelector('link[data-continuum-vision-refresh]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/continuum-doc-vision-refresh.css?v=20260822-1';
    link.dataset.continuumVisionRefresh = 'style';
    document.head.append(link);
  }

  function refreshStatusTruth() {
    const statusCopy = 'Check In is LIVE. Directory, Library, Automations, Email, Runtime and Authority now have real backend foundations in development, with canonical product surfaces being connected and deployed. Signals, Goals, broader provider actions and more autonomous coordination remain LATER.';
    setText('.rail-status p', statusCopy);
    setText('.clarity-status-frame .clarity-mini-heading p', statusCopy);

    const presence = qs('.continuum-presence');
    if (presence) {
      setText('.presence-truth span', 'Check In timing is live today. Backend proofs now cover durable information, Automation versions, Runtime, Email and exact Authority, but those stacks are not production-deployed yet. Longer-running coordination, broader outside actions and Goals remain later.', presence);
    }

    const statusItems = qsa('.status-key-item');
    const statusText = [
      'Working with real server-backed data in production now',
      'Interactive product or proving surface',
      'Built or being connected through protected backend work',
      'Planned after the current foundation is in place'
    ];
    statusItems.forEach((item, index) => {
      const spans = qsa('span', item);
      if (spans[1] && statusText[index]) spans[1].textContent = statusText[index];
    });

    const email = qs('.connection-email');
    if (email) {
      setText('small', 'Typed Email definitions, protected manual Runtime and bounded provider proof exist in backend development.', email);
      const status = qs('.status-pill', email);
      if (status) status.textContent = 'BACKEND PROOF';
    }
  }

  function strengthenMapFraming() {
    const intro = qs('.clarity-product-map-section .section-intro');
    if (intro) {
      intro.textContent = 'Think of Continuum as a private map of the people, information, rules, tools and ongoing work that matter to you. Directory and Library keep stable people and information, Spaces focus the context you need, Automations hold repeatable work, and Goals can hold a larger outcome when the route changes. Connections bring in outside tools and data, Runtime can keep approved work alive on the server, Signals update Continuum\'s picture of what is happening now, and AI only gets the context and capabilities the job allows.';
    }

    const ceiling = qs('.ceiling-note');
    if (ceiling) {
      setText('strong', 'The map can keep expanding as new models, services, sensors, APIs, MCP servers and devices become useful.', ceiling);
      setText('p', 'New capability expands what Continuum may be able to perceive, understand or do. It does not silently expand permission. The same context, policy, authority and history stay connected as the capability ceiling moves.', ceiling);
    }
  }

  function addKnowledgeVsAuthority() {
    const section = document.getElementById('difference');
    if (!section || qs('.continuum-knowledge-authority', section)) return;

    const anchor = qs('.authority-principle', section) || qs('.section-heading', section);
    if (!anchor) return;

    const block = document.createElement('section');
    block.className = 'continuum-knowledge-authority';
    block.setAttribute('aria-label', 'What Continuum knows compared with what it is allowed to do');
    block.innerHTML = `
      <div class="continuum-knowledge-authority-head">
        <div>
          <span>KNOWLEDGE IS NOT PERMISSION</span>
          <strong>Knowing something and being allowed to act on it stay separate.</strong>
          <p>Continuum can understand a situation without automatically gaining the right to change it. That separation is what lets the system become more capable without making every new capability automatically powerful.</p>
        </div>
      </div>
      <div class="continuum-knowledge-authority-grid">
        <article class="continuum-knowledge-authority-card">
          <span>WHAT CONTINUUM CAN KNOW</span>
          <strong>Context and current State</strong>
          <ul>
            <li>Who a person is and how they are connected</li>
            <li>Which document version matters</li>
            <li>Whether a reply arrived or a deadline passed</li>
            <li>What happened earlier and what is true now</li>
          </ul>
        </article>
        <article class="continuum-knowledge-authority-card">
          <span>WHAT CONTINUUM MAY DO</span>
          <strong>Explicit authority and policy</strong>
          <ul>
            <li>Read or prepare information for an approved purpose</li>
            <li>Ask before a consequential action</li>
            <li>Use a specific tool inside exact limits</li>
            <li>Wait, prohibit or follow prepared fallback authority</li>
          </ul>
        </article>
      </div>`;

    anchor.insertAdjacentElement('afterend', block);
  }

  function addRealChain() {
    const section = document.getElementById('action');
    if (!section || qs('.continuum-proof-chain', section)) return;

    const primer = qs('.clarity-automation-copy', section) || qs('.section-heading', section);
    if (!primer) return;

    const block = document.createElement('section');
    block.className = 'continuum-proof-chain';
    block.setAttribute('aria-label', 'How current backend foundations connect');
    block.innerHTML = `
      <div class="continuum-proof-chain-head">
        <div>
          <span>ONE CONNECTED BACKEND PROOF</span>
          <strong>An email example shows how the pieces are meant to work as one system.</strong>
          <p>The full stack is still being connected and deployed, but the important backend boundaries already exist as real development proofs instead of only interface concepts.</p>
        </div>
        <span class="continuum-proof-badge">NOT PRODUCTION-LIVE</span>
      </div>
      <div class="continuum-proof-steps">
        <article class="continuum-proof-step"><b>DIRECTORY</b><strong>Know the person</strong><small>A stable Person and exact email ContactMethod identify who the action concerns.</small></article>
        <article class="continuum-proof-step"><b>LIBRARY</b><strong>Freeze the information</strong><small>A saved ContentVersion preserves the exact message or document the Automation refers to.</small></article>
        <article class="continuum-proof-step"><b>AUTOMATION</b><strong>Freeze the intended work</strong><small>An immutable AutomationVersion records the trigger, action and exact dependencies.</small></article>
        <article class="continuum-proof-step"><b>AUTHORITY</b><strong>Decide whether it is allowed</strong><small>Exact permission can be evaluated without letting prompts or new tools silently widen it.</small></article>
        <article class="continuum-proof-step"><b>RUNTIME</b><strong>Record what happened</strong><small>Runs, attempts and Why history preserve execution truth and provider results.</small></article>
      </div>`;

    primer.insertAdjacentElement('afterend', block);
  }

  function refreshBuildAndRoadmap() {
    const build = document.getElementById('build');
    if (build) {
      qsa('.build-item', build).forEach((item) => {
        const strong = qs('strong', item);
        if (strong?.textContent.includes('/lab/automations/')) strong.textContent = 'Try it in /automations/';
      });
    }

    const cards = qsa('.roadmap-card');
    const content = [
      {
        label: 'NOW',
        title: 'Protected Check In',
        body: 'The live product already proves server-owned timing, policy history, Incidents, sessions and Audit.',
        points: ['Changeable timer + grace', 'Pause, resume + one-time override', 'Server truth + recorded Incidents']
      },
      {
        label: 'BUILT',
        title: 'Durable backend foundations',
        body: 'Development branches now prove real Directory, Library, Automation versions, Runtime, Email, Authority and durable trigger-consumption foundations. They are not all production-deployed yet.',
        points: ['People + exact saved content', 'Runs, attempts + provider proof', 'Exact Authority + trigger history']
      },
      {
        label: 'CONNECTING',
        title: 'Turn the map into one product',
        body: 'Canonical Directory, Library, Automations, Email and Control surfaces are being moved onto protected server truth so the browser becomes a view of the durable system.',
        points: ['Protected API integration', 'Canonical product routes', 'Server truth in every surface']
      },
      {
        label: 'EXPANDING',
        title: 'More senses, tools and longer goals',
        body: 'Signals, Goals, broader communications, model routing, MCP, devices and longer-running coordination can grow on top of the same knowledge, policy, authority and Audit foundation.',
        points: ['Signals + live-world State', 'Goals, planning + replanning', 'New models, tools + devices']
      }
    ];

    cards.forEach((card, index) => {
      const next = content[index];
      if (!next) return;
      setText(':scope > span', next.label, card);
      setText(':scope > strong', next.title, card);
      setText(':scope > p', next.body, card);
      qsa('.roadmap-points b', card).forEach((point, pointIndex) => {
        if (next.points[pointIndex]) point.textContent = next.points[pointIndex];
      });
    });

    const status = document.getElementById('status');
    if (status) {
      setText('.section-intro', 'The goal is not to freeze Continuum around today\'s tools. The durable core should let new apps, data sources, models, communication channels, sensors and future devices become useful without losing the context, permission rules and history that make those capabilities trustworthy.', status);
    }
  }

  function refreshFooterLauncher() {
    const footer = qs('.document-footer');
    if (!footer) return;

    setText('h2', 'Start with what is live, then explore the map as the rest of Continuum becomes real.', footer);

    const actions = qs('.continuum-product-actions', footer);
    if (!actions) return;

    actions.innerHTML = `
      <a class="continuum-route-link continuum-route-live" href="/checkin/"><span class="continuum-route-status">LIVE</span><strong>Check In</strong><small>Protected timing, policy and continuity trigger</small></a>
      <a class="continuum-route-link" href="/spaces/"><span class="continuum-route-status">LAB</span><strong>Spaces</strong><small>Focused context and briefing experience</small></a>
      <a class="continuum-route-link continuum-route-building" href="/directory/"><span class="continuum-route-status">IN BUILD</span><strong>Directory</strong><small>People, organizations and contact methods</small></a>
      <a class="continuum-route-link continuum-route-building" href="/library/"><span class="continuum-route-status">IN BUILD</span><strong>Library</strong><small>Durable information, content and versions</small></a>
      <a class="continuum-route-link continuum-route-building" href="/automations/"><span class="continuum-route-status">IN BUILD</span><strong>Automations</strong><small>Repeatable work, triggers, policy and runs</small></a>
      <a class="continuum-route-link continuum-route-building" href="/email/"><span class="continuum-route-status">IN BUILD</span><strong>Email</strong><small>Concrete communication and provider proving surface</small></a>
      <a class="continuum-route-link continuum-route-building" href="/control/"><span class="continuum-route-status">LAB</span><strong>Control</strong><small>Activity, state and future coordination surface</small></a>`;
  }

  loadStyles();
  refreshStatusTruth();
  strengthenMapFraming();
  addKnowledgeVsAuthority();
  addRealChain();
  refreshBuildAndRoadmap();
  refreshFooterLauncher();

  document.documentElement.dataset.continuumVisionRefresh = 'ready';
})();