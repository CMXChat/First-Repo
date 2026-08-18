'use strict';

(() => {
  function restoreFullHeroIntroduction() {
    const heroLead = document.querySelector('.continuum-hero .hero-lead');
    if (!heroLead) return;

    heroLead.innerHTML = `<span class="hero-lead-first">Continuum brings your information, people, files, messages, services, Automations and AI into one private environment that can understand what is happening, remember useful history, build briefings from connected sources, follow rules you set, use approved tools and keep important work moving over time.</span> As more services connect through APIs, MCP and other providers, it can grow into something that helps coordinate people, follow up on projects, watch important changes, analyze financial information, communicate through email, messaging and future voice, and work with whichever AI models are most useful over time. The deeper idea is that your context, priorities and instructions have somewhere durable to live, so Continuum can remain useful while you are busy, offline or unavailable. Afterlife, the Dead Man Switch, carries that idea further: if you stop checking in for the period you chose, Continuum can record the trigger and begin the continuity steps you prepared in advance, including contacting trusted people, releasing approved information and continuing bounded work you authorized beforehand.`;
  }

  function clarifyFirstTimeReaderCopy() {
    const earlyStatusCopy = 'Check In is LIVE. Spaces (focused briefings) and Automations (saved rules and steps) are LAB. Private information and Automation definitions are NEXT. Runtime (server-side execution) and provider actions are LATER.';

    const railStatus = document.querySelector('.rail-status p');
    if (railStatus) railStatus.textContent = earlyStatusCopy;

    const statusSnapshot = document.querySelector('.clarity-status-frame .clarity-mini-heading p');
    if (statusSnapshot) statusSnapshot.textContent = earlyStatusCopy;

    document.querySelectorAll('a[href="/spaces/"]').forEach((link) => {
      const label = link.querySelector('span:first-child');
      if (label) label.textContent = 'Explore Spaces briefings';
      else link.textContent = 'Explore Spaces briefings';
    });

    const overviewIntro = document.querySelector('#overview .section-intro');
    if (overviewIntro) {
      overviewIntro.textContent = 'Think of Continuum as a loop: information comes in from approved sources, Continuum keeps the useful context, rules decide what may happen, approved work goes back out, and the result becomes part of the context for next time.';
    }

    const processSteps = document.querySelectorAll('#overview .process-step');
    const processCopy = [
      ['See what is happening', 'Email, calendars, messages, files, money data, APIs, MCP and direct updates can come in from approved outside sources.'],
      ['Remember the useful part', 'Continuum keeps the people, content, files, dates, source history and saved versions that matter later.'],
      ['Check your rules', 'Continuum checks who may use the information, which tools are allowed, whether approval is needed and whether a trigger or condition has been reached.'],
      ['Produce or carry out approved work', 'Spaces can produce focused briefings, AI can help reason and write, and future Runtime can send messages, call APIs or use other approved tools.'],
      ['Bring the result back', 'Continuum records what happened so the next briefing, decision or workflow begins with current information instead of starting over.']
    ];
    processSteps.forEach((step, index) => {
      const [title, copy] = processCopy[index] || [];
      if (!title) return;
      const heading = step.querySelector('h3');
      const paragraph = step.querySelector('p');
      if (heading) heading.textContent = title;
      if (paragraph) paragraph.textContent = copy;
    });

    const mapIntro = document.querySelector('.clarity-product-map-section .section-intro');
    if (mapIntro) {
      mapIntro.textContent = 'Connections are the bridges to outside services: they can bring approved information in and later carry approved actions back out. Directory keeps track of people and organizations. Library keeps saved content and files. Spaces turn approved information into focused briefings. AI can reason with the context allowed for a task. Automations define what should happen. Runtime will later execute published work on the server and save the result back into Continuum.';
    }

    const nodeCopy = {
      '.node-directory small': 'People, organizations and contact details',
      '.node-library small': 'Saved content, files and versions',
      '.node-spaces small': 'Focused briefings from approved information',
      '.node-ai small': 'Uses approved context to reason, write and plan',
      '.node-connections small': 'Bring outside information in and carry approved actions out',
      '.node-automations small': 'Rules for what should happen and when',
      '.node-runtime small': 'Later executes published work and records results'
    };
    Object.entries(nodeCopy).forEach(([selector, copy]) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = copy;
    });

    const presenceCopy = document.querySelector('.presence-heading > p');
    if (presenceCopy) {
      presenceCopy.textContent = 'Continuum can help you understand current information, keep approved rules ready for later work and support the Check In trigger when you cannot respond.';
    }

    const spacesIntro = document.querySelector('#spaces .section-intro');
    if (spacesIntro) {
      spacesIntro.textContent = 'A Space is a focused brief built from approved information already connected to Continuum. Directory keeps track of the people and organizations involved. Library keeps saved content and files. Personal, Family, Business and Afterlife Spaces can each show the slice that matters in that context.';
    }

    const ingestionLabel = document.querySelector('#spaces .ingestion-map .visual-label');
    if (ingestionLabel) ingestionLabel.textContent = 'INFORMATION COMING IN FROM THINGS YOU ALREADY USE';

    const actionIntro = document.querySelector('#action .section-intro');
    if (actionIntro) {
      actionIntro.textContent = 'Automations define the trigger, rules, approved actions and timing. Connections are the approved bridges to outside apps and services. Future Runtime will run published workflows on the server, carry allowed actions out through those Connections and record the result back in Continuum.';
    }

    const primer = document.querySelector('#action .clarity-automation-copy');
    if (primer) {
      primer.innerHTML = '<strong>Automations define what should happen.</strong> They use information already in Continuum or events coming in through approved Connections. The builder saves the trigger, rules, actions, timing and finish behavior. Runtime is the future server layer that will carry out a published Automation and record what happened.';
    }

    const connectionsHead = document.querySelector('#action .connections-panel .panel-head strong');
    if (connectionsHead) connectionsHead.textContent = 'Connections can bring information in and carry approved actions out';

    const closingNote = document.querySelector('#status .closing-note');
    if (closingNote) {
      closingNote.textContent = 'Continuum keeps a continuous loop around your work: approved information comes in, people and saved context stay connected, Spaces and AI help make sense of it, Automations define what should happen, Runtime can later carry approved actions out, and the result becomes part of the history used next time.';
    }
  }

  function neutralizeExampleNames() {
    const firstJourneyCopy = document.querySelector('#difference .journey-step small');
    if (firstJourneyCopy && /Directory knows who/i.test(firstJourneyCopy.textContent || '')) {
      firstJourneyCopy.textContent = 'Directory knows which people belong to the project.';
    }

    const people = document.querySelectorAll('#spaces .person-node');
    if (people[0]) {
      const name = people[0].querySelector('strong');
      const role = people[0].querySelector('small');
      if (name) name.textContent = 'Project lead';
      if (role) role.textContent = 'Primary contact';
    }
    if (people[1]) {
      const name = people[1].querySelector('strong');
      const role = people[1].querySelector('small');
      if (name) name.textContent = 'Technical lead';
      if (role) role.textContent = 'Technical contact';
    }
  }

  restoreFullHeroIntroduction();
  clarifyFirstTimeReaderCopy();
  neutralizeExampleNames();

  const mapSection = document.querySelector('.clarity-product-map-section');
  const presence = mapSection?.querySelector('.continuum-presence');
  if (!mapSection || !presence || mapSection.querySelector('.continuum-origin-note')) return;

  const origin = document.createElement('section');
  origin.className = 'continuum-origin-note';
  origin.setAttribute('aria-labelledby', 'continuumOriginTitle');
  origin.innerHTML = `
    <div class="continuum-origin-copy">
      <p class="continuum-origin-kicker">WHERE CONTINUUM CAME FROM</p>
      <h2 id="continuumOriginTitle">The idea started with the Dead Man Switch</h2>
      <p>Afterlife began with a practical problem: if you stop responding, the people, information and instructions you prepared still need somewhere reliable to live. The Check In timer gives that problem a trigger.</p>
      <p>That led to a broader idea. The same foundation matters before an emergency. You can be asleep, traveling, working, waiting on someone or simply away from the screen. Continuum keeps the context and rules you chose available so approved work can continue over time.</p>
      <p>That is the line running through the product. Spaces are focused briefings that help show what matters while you are here, and AI can reason with approved context. Automations define work that should happen. Runtime can later keep that work moving on the server and carry approved actions through Connections. Afterlife uses the same foundation when you cannot respond.</p>
    </div>`;

  presence.before(origin);
  document.documentElement.dataset.continuumOrigin = 'ready';
})();
