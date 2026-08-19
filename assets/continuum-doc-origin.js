'use strict';

(() => {
  function restoreFullHeroIntroduction() {
    const heroLead = document.querySelector('.continuum-hero .hero-lead');
    if (!heroLead) return;

    heroLead.innerHTML = `<span class="hero-lead-first">Continuum brings your information, people, files, messages, services, Automations and AI into one private environment that can understand what is happening, remember useful history, build briefings from connected sources, follow rules you set, use approved tools and keep important work moving over time.</span> As more outside services connect, including APIs and MCP tools, Continuum can coordinate people, follow up on projects, watch important changes, analyze financial information, communicate through email, messaging and future voice, and work with whichever AI models are most useful over time. Your context, priorities and instructions stay in one place, so Continuum can still be useful while you are busy, offline or unavailable. Afterlife, the Dead Man Switch, uses the same setup if you stop responding: Continuum can record the trigger and begin the continuity steps you prepared in advance, including contacting trusted people, releasing approved information and continuing bounded work you authorized beforehand.`;
  }

  function addPlannerAndSignalsNotes() {
    const aiSection = document.getElementById('difference');
    const aiAnswer = aiSection?.querySelector('.ai-answer');
    if (aiAnswer && !aiSection.querySelector('.continuum-planner-note')) {
      const planner = document.createElement('aside');
      planner.className = 'continuum-forward-note continuum-planner-note';
      planner.setAttribute('aria-label', 'Future Continuum Planner');
      planner.innerHTML = `
        <span class="continuum-forward-kicker">LATER · PLANNER</span>
        <strong>AI can help configure Continuum too.</strong>
        <p>You can eventually describe the setup you want in normal language. Continuum can turn that request into a typed Change Plan for things such as People, Groups, Library content and Automation Drafts, show exactly what would change, run preflight checks and keep protected changes behind the same permissions used by the normal product.</p>
        <div class="continuum-forward-flow" aria-label="Future Planner change flow"><span>INTENT</span><i>→</i><span>CHANGE PLAN</span><i>→</i><span>PREFLIGHT</span><i>→</i><span>REVIEW</span><i>→</i><span>APPLY</span></div>
        <small>AI proposes typed changes. Protected domain services remain the authority.</small>`;
      aiAnswer.after(planner);
    }

    const actionSection = document.getElementById('action');
    const everyday = actionSection?.querySelector('.everyday-workflow');
    if (everyday && !actionSection.querySelector('.continuum-signals-note')) {
      const signals = document.createElement('aside');
      signals.className = 'continuum-forward-note continuum-signals-note';
      signals.setAttribute('aria-label', 'Future Signals and observed changes');
      signals.innerHTML = `
        <span class="continuum-forward-kicker">LATER · SIGNALS</span>
        <strong>Something Continuum observes can start real work.</strong>
        <p>Continuum can later watch approved sources, keep each observation with its source, turn a meaningful change into a typed Signal and let an Automation decide what should happen next. Your rules can keep a Signal observe-only, require approval, or allow specific Actions inside published limits.</p>
        <div class="continuum-forward-flow continuum-signal-flow" aria-label="Future Signal to Action flow"><span>APPROVED SOURCE</span><i>→</i><span>OBSERVATION</span><i>→</i><span>SIGNAL</span><i>→</i><span>AUTOMATION</span><i>→</i><span>RUNTIME</span><i>→</i><span>ACTION</span></div>
        <small>Outside information provides evidence. It never grants permission by itself.</small>`;
      everyday.after(signals);
    }
  }

  function clarifyFirstTimeReaderCopy() {
    const earlyStatusCopy = 'Check In (the live Dead Man Switch trigger) is LIVE. Spaces (focused briefings) and Automations (saved rules and steps) are LAB. Private information and Automation definitions are NEXT. Runtime, Signals monitoring and outside-service delivery are LATER.';

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
      overviewIntro.textContent = 'The flow is simple: information comes in from approved sources, Continuum keeps the useful context, your rules decide what may happen, approved work goes back out, and the result becomes part of the context for next time.';
    }

    const processSteps = document.querySelectorAll('#overview .process-step');
    const processCopy = [
      ['See what is happening', 'Email, calendars, messages, files, money data, APIs, MCP and direct updates can come in from approved outside sources. Signals can later watch selected sources for meaningful changes.'],
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
      mapIntro.textContent = 'Connections are the bridges to outside services: they can bring approved information in and later carry approved actions back out. Directory keeps track of people and organizations. Library keeps saved content and files. Spaces turn approved information into focused briefings. Signals can later turn meaningful changes from approved sources into typed inputs. AI can reason with the context allowed for a task. Automations define what should happen. Runtime will later execute published work on the server and save the result back into Continuum.';
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

    const presenceTitle = document.querySelector('.presence-heading strong');
    if (presenceTitle) presenceTitle.textContent = 'What Continuum can do over time';

    const presenceCopy = document.querySelector('.presence-heading > p');
    if (presenceCopy) {
      presenceCopy.textContent = 'While you are using it, Continuum can help you understand current information. It can also keep saved rules ready for later work and support the Check In trigger if you stop responding.';
    }

    const spacesTitle = document.querySelector('#spaces h2');
    if (spacesTitle) spacesTitle.textContent = 'How people, saved information and Spaces connect';

    const spacesIntro = document.querySelector('#spaces .section-intro');
    if (spacesIntro) {
      spacesIntro.textContent = 'A Space is a focused brief built from approved information already connected to Continuum. Directory keeps track of the people and organizations involved. Library keeps saved content and files. Personal, Family, Business and Afterlife Spaces can each show the part that matters in that context.';
    }

    const ingestionLabel = document.querySelector('#spaces .ingestion-map .visual-label');
    if (ingestionLabel) ingestionLabel.textContent = 'INFORMATION COMING IN FROM THINGS YOU ALREADY USE';

    const actionIntro = document.querySelector('#action .section-intro');
    if (actionIntro) {
      actionIntro.textContent = 'Automations define the trigger, rules, approved actions and timing. A trigger can come from information already in Continuum, an approved Connection or later a typed Signal. Future Runtime will run published workflows on the server, use approved Connections for allowed actions and record the result back in Continuum.';
    }

    const primer = document.querySelector('#action .clarity-automation-copy');
    if (primer) {
      primer.innerHTML = '<strong>Automations define what should happen.</strong> They can use information already in Continuum, events coming through approved Connections and later typed Signals from approved observations. The builder saves the trigger, rules, actions, timing and finish behavior. Runtime is the future server layer that will carry out a published Automation and record what happened.';
    }

    const connectionsHead = document.querySelector('#action .connections-panel .panel-head strong');
    if (connectionsHead) connectionsHead.textContent = 'Connections can bring information in and carry approved actions out';

    const afterlifeIntro = document.querySelector('#afterlife .section-intro');
    if (afterlifeIntro) {
      afterlifeIntro.textContent = 'Afterlife is the Dead Man Switch part of Continuum. You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can run the approved steps that follow.';
    }

    const laterTruth = document.querySelector('#afterlife .afterlife-truth div:last-child');
    if (laterTruth) {
      laterTruth.innerHTML = '<b>LATER:</b> sending through outside services, server-side waits, retries, replies, acknowledgements and approved AI tasks through Runtime.';
    }

    const buildTitle = document.querySelector('#build h2');
    if (buildTitle) buildTitle.textContent = 'How a Lab idea becomes a real feature';

    const statusTitle = document.querySelector('#status h2');
    if (statusTitle) statusTitle.textContent = 'What gets built next';

    const statusIntro = document.querySelector('#status .section-intro');
    if (statusIntro) {
      statusIntro.textContent = 'The plan is to add private information first, then server-run workflows, then more outside services, Signals and AI tools.';
    }

    const laterRoadmapTitle = document.querySelector('#status .roadmap-later strong');
    if (laterRoadmapTitle) laterRoadmapTitle.textContent = 'More connected services';

    const closingNote = document.querySelector('#status .closing-note');
    if (closingNote) {
      closingNote.textContent = 'The result is one connected flow: information comes in, Continuum keeps the useful context, Signals can later identify meaningful changes, Spaces and AI help make sense of what matters, Automations define what should happen, Runtime can carry approved actions out, and the result is saved for next time.';
    }

    const footerTitle = document.querySelector('.document-footer h2');
    if (footerTitle) footerTitle.textContent = 'Each part of Continuum uses the same saved people, information, rules and history.';
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
  addPlannerAndSignalsNotes();

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
      <p>The same setup is useful before an emergency. You can be asleep, traveling, working, waiting on someone or simply away from the screen. Continuum keeps the context and rules you chose available so approved work can continue over time.</p>
      <p>Spaces turn current information into focused briefs while you are here, and AI can use the context you allow. Automations define work that should happen. Runtime can later keep that work moving on the server and use Connections for approved outside actions. Signals can later make selected outside changes part of that same flow. Afterlife uses the same pieces when you cannot respond.</p>
    </div>`;

  presence.before(origin);
  document.documentElement.dataset.continuumOrigin = 'ready';
  document.documentElement.dataset.continuumSignalsPlanner = 'ready';
})();