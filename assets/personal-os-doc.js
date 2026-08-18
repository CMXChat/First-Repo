'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'continuum_doc_theme_v1';
  const legacyStorageKeys = ['spaces_doc_theme_v1', 'personal_os_doc_theme_v3'];
  const tocLabels = {
    overview: '01 · Overview',
    difference: '02 · AI',
    spaces: '03 · Information',
    action: '04 · Automations',
    afterlife: '05 · Afterlife',
    engineering: '06 · Architecture',
    build: '07 · Build',
    status: '08 · Roadmap'
  };

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(storageKey)
        || legacyStorageKeys.map((key) => localStorage.getItem(key)).find(Boolean);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  }

  function getRequestedTheme() {
    const queryTheme = new URLSearchParams(window.location.search).get('theme');
    if (queryTheme === 'light' || queryTheme === 'dark') return queryTheme;
    return getStoredTheme() || 'light';
  }

  function storeTheme(theme) {
    try { localStorage.setItem(storageKey, theme); } catch {}
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const darkMode = nextTheme === 'dark';
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${darkMode ? 'light' : 'dark'} mode`);
      themeButton.setAttribute('aria-pressed', String(darkMode));
      themeButton.dataset.activeTheme = nextTheme;
    }
    themeMeta?.setAttribute('content', darkMode ? '#060a12' : '#edf3f8');
    if (persist) storeTheme(nextTheme);
  }

  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    progressBar.style.width = `${progress}%`;
  }

  function updateCurrentLabels() {
    const active = qs('.document-toc a[aria-current="location"]') || qs('.document-toc a');
    const label = active?.textContent?.trim() || '01 · Overview';
    const triggerCurrent = document.getElementById('mobileContentsTriggerCurrent');
    const drawerCurrent = document.getElementById('mobileContentsCurrent');
    if (triggerCurrent) triggerCurrent.textContent = label;
    if (drawerCurrent) drawerCurrent.textContent = label;
  }

  function setCurrentSection(id) {
    qsa('.document-toc a').forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updateCurrentLabels();
  }

  function syncTocCopy() {
    qsa('.document-toc a').forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      if (tocLabels[id]) link.textContent = tocLabels[id];
    });
  }

  function addConceptLabels(network) {
    const concepts = [
      ['.node-directory', 'PEOPLE'],
      ['.node-library', 'SAVED INFORMATION'],
      ['.node-spaces', 'FOCUSED VIEWS'],
      ['.node-automations', 'RULES + STEPS'],
      ['.node-connections', 'OUTSIDE TOOLS'],
      ['.node-runtime', 'LONG-RUNNING WORK'],
      ['.node-ai', 'REASONING']
    ];
    concepts.forEach(([selector, label]) => {
      const card = qs(selector, network);
      const copy = card?.querySelector('div');
      if (!copy || copy.querySelector('.clarity-concept')) return;
      const marker = document.createElement('span');
      marker.className = 'clarity-concept';
      marker.textContent = label;
      copy.prepend(marker);
    });
  }

  function makeStatusSnapshot() {
    const frame = document.createElement('section');
    frame.className = 'clarity-status-frame';
    frame.setAttribute('aria-labelledby', 'clarityStatusTitle');
    frame.innerHTML = `
      <div class="clarity-mini-heading">
        <div><span>WHERE IT STANDS TODAY</span><strong id="clarityStatusTitle">What works today</strong></div>
        <p>Check In is LIVE. Spaces and Automations are LAB. Private information and Automation definitions are NEXT. Runtime and provider execution are LATER.</p>
      </div>`;
    return frame;
  }

  function makeStorySection() {
    const section = document.createElement('section');
    section.className = 'clarity-story-section clarity-story-prose';
    section.setAttribute('aria-labelledby', 'clarityStoryTitle');
    section.innerHTML = `
      <div class="section-heading clarity-section-heading">
        <div><p class="section-kicker">A real example</p><h2 id="clarityStoryTitle">What happens when something changes</h2></div>
        <p class="section-intro">A single update can stay connected to the person, the saved information, the briefing and the Automation that uses it.</p>
      </div>
      <div class="clarity-story-copy">
        <p>A client emails to say a payment was sent. Continuum can match that message to the client, keep the useful details with their source, show the update in a Business Space and let an Automation use that information for the next approved step.</p>
        <p>When Runtime is built, it can keep the published workflow running on the server, handle waits or replies that belong to that workflow and record the result.</p>
        <div class="clarity-story-path" aria-label="Example Continuum information path"><span>Message</span><i>→</i><span>Directory</span><i>→</i><span>Library</span><i>→</i><span>Business Space</span><i>→</i><span>Automation</span><i>→</i><span>Runtime</span></div>
      </div>`;
    return section;
  }

  function makeProductMapSection(network, presence) {
    const section = document.createElement('section');
    section.className = 'clarity-product-map-section';
    section.setAttribute('aria-labelledby', 'clarityMapTitle');
    section.innerHTML = `
      <div class="section-heading clarity-section-heading">
        <div><p class="section-kicker">The parts of Continuum</p><h2 id="clarityMapTitle">How the pieces fit together</h2></div>
        <p class="section-intro">Directory keeps people and organizations. Library keeps saved information. Spaces show focused views. Automations define rules and steps. Connections reach outside services. Runtime later runs longer workflows. AI can use the parts allowed for a task.</p>
      </div>`;
    addConceptLabels(network);
    section.append(network, presence);
    return section;
  }

  function makeAutomationPrimer(actionSection) {
    if (qs('.clarity-automation-primer', actionSection)) return;
    const primer = document.createElement('div');
    primer.className = 'clarity-automation-primer clarity-automation-explainer';
    primer.innerHTML = `
      <p class="clarity-automation-copy"><strong>Automations define what should happen.</strong> The builder saves the trigger, rules, actions, timing and finish behavior. Runtime is the server layer that will later run a published Automation and record what happened.</p>
      <div class="clarity-builder-sentence" aria-label="Automation builder model">
        <span><b>WHEN</b><small>what starts it</small></span><i>→</i>
        <span><b>IF</b><small>which rules apply</small></span><i>→</i>
        <span><b>DO</b><small>approved actions</small></span><i>→</i>
        <span><b>WAIT</b><small>timing or repeat</small></span><i>→</i>
        <span><b>REVIEW</b><small>test before publish</small></span>
      </div>`;
    const heading = qs('.section-heading', actionSection);
    heading?.after(primer);
  }

  function collapsePossibilities(actionSection) {
    const heading = qs('.possibility-heading', actionSection);
    const board = qs('.possibility-board', actionSection);
    if (!heading || !board || qs('.clarity-possibilities', actionSection)) return;
    const details = document.createElement('details');
    details.className = 'clarity-possibilities';
    const summary = document.createElement('summary');
    summary.innerHTML = '<span><b>Possible later uses</b><small>Examples that become possible as more services and provider capabilities are added.</small></span><strong>Open</strong>';
    details.append(summary, heading, board);
    actionSection.append(details);
  }

  function makeOptionalSection(sectionId, label, summaryCopy) {
    const section = document.getElementById(sectionId);
    if (!section || qs('.clarity-deep-dive', section)) return;
    const heading = qs('.section-heading', section);
    const kicker = qs('.section-kicker', heading);
    if (kicker) kicker.textContent = sectionId === 'engineering' ? 'Architecture' : 'Build process';
    const details = document.createElement('details');
    details.className = 'clarity-deep-dive';
    const summary = document.createElement('summary');
    summary.innerHTML = `<span><b>${label}</b><small>${summaryCopy}</small></span><strong>Open</strong>`;
    qsa(':scope > *', section).filter((child) => child !== heading).forEach((child) => details.append(child));
    details.prepend(summary);
    section.append(details);
  }

  function cleanStaticCopy() {
    const difference = document.getElementById('difference');
    const differenceKicker = qs('.section-kicker', difference);
    const differenceTitle = qs('h2', difference);
    const differenceIntro = qs('.section-intro', difference);
    const aiAnswerTitle = qs('.ai-answer strong', difference);
    const aiAnswerCopy = qs('.ai-answer p', difference);
    const aiModelTitle = qs('.model-swap-note > div:first-child span', difference);
    const aiModelCopy = qs('.model-swap-note > div:first-child strong', difference);
    const ruleTitle = qs('.rule-callout strong', difference);
    const ruleCopy = qs('.rule-callout span', difference);

    if (differenceKicker) differenceKicker.textContent = 'AI inside Continuum';
    if (differenceTitle) differenceTitle.textContent = 'AI can use saved context, rules and approved tools';
    if (differenceIntro) differenceIntro.textContent = 'An AI conversation uses the information available to that conversation. Continuum can provide saved people, files, history, timers and approved tools for a specific task.';
    if (aiAnswerTitle) aiAnswerTitle.textContent = 'What Continuum adds to AI';
    if (aiAnswerCopy) aiAnswerCopy.textContent = 'AI can reason with the information it receives. Continuum keeps the people, records, rules, timing, tools and history around that work.';
    if (aiModelTitle) aiModelTitle.textContent = 'MODEL CHOICE CAN CHANGE';
    if (aiModelCopy) aiModelCopy.textContent = 'Continuum keeps the approved data, rules and history around the model.';
    if (ruleTitle) ruleTitle.textContent = 'AI authority is set by server-side permissions.';
    if (ruleCopy) ruleCopy.textContent = 'Permission changes require an authorized server-side update.';

    const everydayTitle = qs('.everyday-workflow-copy strong');
    const everydayCopy = qs('.everyday-workflow-copy small');
    if (everydayTitle) everydayTitle.textContent = 'Everyday workflow';
    if (everydayCopy) everydayCopy.textContent = 'A payment update can feed the next approved step.';

    const possibilityHeading = qs('.possibility-heading span');
    const possibilityCopy = qs('.possibility-heading strong');
    const aiPossibilityTitle = qs('.possibility-ai strong');
    const aiPossibilityCopy = qs('.possibility-ai small');
    if (possibilityHeading) possibilityHeading.textContent = 'POSSIBLE LATER USES';
    if (possibilityCopy) possibilityCopy.textContent = 'More connected services add more things Continuum can read, track or do under your rules.';
    if (aiPossibilityTitle) aiPossibilityTitle.textContent = 'New AI models';
    if (aiPossibilityCopy) aiPossibilityCopy.textContent = 'New models can use the same approved information and tools already connected to Continuum.';

    const techDetailCopy = qs('.tech-detail p');
    if (techDetailCopy) techDetailCopy.textContent = 'Database access goes through the backend. The backend owns business rules, permissions and PostgreSQL access.';

    const statusIntro = qs('#status .section-intro');
    const laterRoadmapCopy = qs('.roadmap-later p');
    const closingNote = qs('.closing-note');
    if (statusIntro) statusIntro.textContent = 'New apps, communication channels, data sources and AI models can use the same information, rules and permission model as each stage is built.';
    if (laterRoadmapCopy) laterRoadmapCopy.textContent = 'Continuum can work with more outside services through approved tools and supported AI models.';
    if (closingNote) closingNote.innerHTML = 'Continuum keeps people, saved information, rules, tools, timing, conversations and results connected. New AI models can use the same approved context and tools.';
  }

  function installClarityPass() {
    if (root.dataset.continuumClarity === 'ready') return;

    const identitySub = qs('.document-identity-copy span');
    if (identitySub) identitySub.textContent = 'Overview';

    const toolbarLinks = qs('.toolbar-links');
    if (toolbarLinks) toolbarLinks.innerHTML = '<a href="#overview">Overview</a><a href="#difference">AI</a><a href="#action">Automations</a><a href="#afterlife">Afterlife</a>';

    syncTocCopy();
    const railStatus = qs('.rail-status');
    if (railStatus) railStatus.innerHTML = '<span class="status-dot" aria-hidden="true"></span><div><strong>Where it stands</strong><p>Check In is LIVE. Spaces and Automations are LAB. Private information and Automation definitions are NEXT. Runtime and provider execution are LATER.</p></div>';

    const hero = qs('.continuum-hero');
    const heroKicker = qs('.hero-kicker', hero);
    const heroLead = qs('.hero-lead', hero);
    const heroTruth = qs('.hero-truth-row', hero);
    const heroDisclosure = qs('.hero-disclosure', hero);
    if (hero) hero.classList.add('clarity-hero');
    if (heroKicker) heroKicker.textContent = 'Information, people, rules and AI in one place';
    if (heroLead) heroLead.innerHTML = '<span class="hero-lead-first">Continuum keeps useful context in one private place so your information, people, rules and AI stay connected over time.</span> It can brief you while you’re here, follow approved Automations when work needs to continue, and support a continuity plan if you cannot respond.';
    if (heroTruth) heroTruth.innerHTML = '<span><i></i>Keeps useful history</span><span><i></i>Links people + information</span><span><i></i>Runs approved rules</span>';
    heroDisclosure?.remove();

    const overview = document.getElementById('overview');
    const overviewKicker = qs('.section-kicker', overview);
    const overviewIntro = qs('.section-intro', overview);
    if (overviewKicker) overviewKicker.textContent = 'Continuum in one minute';
    if (overviewIntro) overviewIntro.textContent = 'The basic loop is simple: see what changed, save the useful part, check your rules, do approved work and keep the result for next time.';

    const network = qs('.hero-network', hero);
    const presence = qs('.continuum-presence', hero);
    const processMap = qs('.process-map', overview);
    if (processMap) processMap.after(makeStatusSnapshot());

    const glance = qs('.glance-grid', overview);
    const afterlife = document.getElementById('afterlife');
    const afterlifeCallout = qs('.afterlife-simple-callout', afterlife);
    if (glance && afterlifeCallout) afterlifeCallout.before(glance);

    if (overview && !qs('.clarity-story-section')) {
      const story = makeStorySection();
      overview.after(story);
      if (network && presence) story.after(makeProductMapSection(network, presence));
    }

    const presenceHeading = qs('.presence-heading');
    const presenceEyebrow = qs('.presence-heading span');
    const presenceCopy = qs('.presence-heading p');
    if (presenceEyebrow) presenceEyebrow.textContent = 'ACROSS TIME';
    if (presenceHeading && qs('strong', presenceHeading)) qs('strong', presenceHeading).textContent = 'Keep the information and rules you choose.';
    if (presenceCopy) presenceCopy.textContent = 'Continuum can help while you are using it, keep Automation definitions ready for later execution and support the Check In trigger when you cannot respond.';

    const spaces = document.getElementById('spaces');
    const spacesKicker = qs('.section-kicker', spaces);
    const spacesTitle = qs('h2', spaces);
    if (spacesKicker) spacesKicker.textContent = 'People, information and briefs';
    if (spacesTitle) spacesTitle.textContent = 'Keep people, saved information and focused views connected';

    const action = document.getElementById('action');
    const actionKicker = qs('.section-kicker', action);
    const actionTitle = qs('h2', action);
    const actionIntro = qs('.section-intro', action);
    if (actionKicker) actionKicker.textContent = 'Automations and Runtime';
    if (actionTitle) actionTitle.textContent = 'Automations define the steps. Runtime runs them.';
    if (actionIntro) actionIntro.textContent = 'The builder defines the trigger, rules, actions and timing. Connections reach approved outside services. Future Runtime runs published workflows on the server and records the result.';
    makeAutomationPrimer(action);
    collapsePossibilities(action);

    const afterlifeIntro = qs('.section-intro', afterlife);
    if (afterlifeIntro) afterlifeIntro.textContent = 'Afterlife uses Continuum for continuity. You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can run the approved steps that follow.';

    makeOptionalSection('engineering', 'Open the architecture walkthrough', 'See the browser, FastAPI, PostgreSQL and the supporting development tools.');
    makeOptionalSection('build', 'Open the build workflow', 'See how a Lab idea becomes a protected server-backed feature and how continuity.md proves the first private-data slice.');

    const status = document.getElementById('status');
    const statusKicker = qs('.section-kicker', status);
    const statusTitle = qs('h2', status);
    if (statusKicker) statusKicker.textContent = 'Roadmap';
    if (statusTitle) statusTitle.textContent = 'Build the foundation, then add capability';

    cleanStaticCopy();
    syncTocCopy();
    root.dataset.continuumClarity = 'ready';
  }

  function installSectionTracking() {
    const sections = qsa('.document-section[id]');
    if (!sections.length) return;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setCurrentSection(visible.target.id);
      }, { rootMargin: '-18% 0px -66% 0px', threshold: [0.04, 0.15, 0.35] });
      sections.forEach((section) => observer.observe(section));
      return;
    }
    const updateFromScroll = () => {
      const target = sections.map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 130) })).sort((a, b) => a.top - b.top)[0];
      if (target?.id) setCurrentSection(target.id);
    };
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    updateFromScroll();
  }

  function installMobileContents() {
    if (document.getElementById('mobileContentsDrawer')) return;
    const sourceToc = qs('.document-rail .document-toc');
    const toolbar = qs('.document-toolbar');
    const actions = qs('.document-actions', toolbar);
    if (!sourceToc || !toolbar || !actions) return;

    const trigger = document.createElement('button');
    trigger.id = 'mobileContentsTrigger';
    trigger.className = 'mobile-contents-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Open document contents');
    trigger.setAttribute('aria-controls', 'mobileContentsDrawer');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span class="mobile-contents-trigger-mark" aria-hidden="true"></span><span class="mobile-contents-trigger-copy"><strong>Contents</strong><small id="mobileContentsTriggerCurrent">01 · Overview</small></span><span class="mobile-contents-trigger-arrow" aria-hidden="true">›</span>';
    actions.insertBefore(trigger, printButton || themeButton || null);

    const backdrop = document.createElement('div');
    backdrop.id = 'mobileContentsBackdrop';
    backdrop.className = 'mobile-contents-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    const drawer = document.createElement('aside');
    drawer.id = 'mobileContentsDrawer';
    drawer.className = 'mobile-contents-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', 'mobileContentsTitle');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    drawer.innerHTML = '<header class="mobile-contents-drawer-header"><div><p class="mobile-contents-drawer-eyebrow">Jump to a section</p><h2 class="mobile-contents-drawer-title" id="mobileContentsTitle">Contents</h2></div><button class="mobile-contents-close" type="button" aria-label="Close document contents">×</button></header><div class="mobile-contents-current"><span>You are reading</span><strong id="mobileContentsCurrent">01 · Overview</strong></div><nav class="document-toc mobile-document-toc" aria-label="Mobile document contents"></nav><div class="mobile-contents-drawer-footer"><i aria-hidden="true"></i><span>8 sections · Swipe left or tap outside to close</span></div>';
    const mobileToc = qs('.mobile-document-toc', drawer);
    qsa('a', sourceToc).forEach((link) => mobileToc.append(link.cloneNode(true)));
    document.body.append(backdrop, drawer);

    const closeButton = qs('.mobile-contents-close', drawer);
    const mobileQuery = window.matchMedia('(max-width: 920px)');
    let savedFocus = null;
    let touchStartX = null;
    let touchStartY = null;

    const closeDrawer = ({ restoreFocus = true } = {}) => {
      if (!root.classList.contains('doc-mobile-contents-open')) return;
      root.classList.remove('doc-mobile-contents-open');
      trigger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      backdrop.setAttribute('aria-hidden', 'true');
      if (restoreFocus && savedFocus?.isConnected) savedFocus.focus({ preventScroll: true });
    };

    const openDrawer = () => {
      if (!mobileQuery.matches || root.classList.contains('doc-mobile-contents-open')) return;
      savedFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
      root.classList.add('doc-mobile-contents-open');
      trigger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.removeAttribute('inert');
      backdrop.setAttribute('aria-hidden', 'false');
      updateCurrentLabels();
      requestAnimationFrame(() => (qs('a[aria-current="location"]', mobileToc) || qs('a', mobileToc) || closeButton)?.focus({ preventScroll: true }));
    };

    trigger.addEventListener('click', openDrawer);
    closeButton?.addEventListener('click', () => closeDrawer());
    backdrop.addEventListener('click', () => closeDrawer());
    mobileToc.addEventListener('click', (event) => {
      if (event.target.closest('a[href^="#"]')) closeDrawer({ restoreFocus: false });
    });
    drawer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closeDrawer(); return; }
      if (event.key !== 'Tab') return;
      const items = qsa('a[href], button:not([disabled])', drawer).filter((element) => element.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    drawer.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });
    drawer.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      if (!touch || touchStartX === null || touchStartY === null) return;
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;
      if (deltaX < -64 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) closeDrawer();
    }, { passive: true });
    const handleViewportChange = () => { if (!mobileQuery.matches) closeDrawer({ restoreFocus: false }); };
    if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', handleViewportChange);
    else mobileQuery.addListener(handleViewportChange);
  }

  installClarityPass();
  applyTheme(getRequestedTheme());
  installMobileContents();
  installSectionTracking();
  setCurrentSection('overview');

  themeButton?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  printButton?.addEventListener('click', () => window.print());
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('pageshow', updateProgress);
  updateProgress();
})();