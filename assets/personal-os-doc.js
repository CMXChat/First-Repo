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

  function makeStatusSnapshot(statusKey) {
    const frame = document.createElement('section');
    frame.className = 'clarity-status-frame';
    frame.setAttribute('aria-labelledby', 'clarityStatusTitle');
    frame.innerHTML = `
      <div class="clarity-mini-heading">
        <div><span>WHERE IT STANDS TODAY</span><strong id="clarityStatusTitle">Current product truth</strong></div>
        <p>The labels stay simple so you can separate working backend capability from Lab design and later Runtime work.</p>
      </div>`;
    frame.append(statusKey);
    return frame;
  }

  function makeStorySection() {
    const section = document.createElement('section');
    section.className = 'clarity-story-section';
    section.setAttribute('aria-labelledby', 'clarityStoryTitle');
    section.innerHTML = `
      <div class="section-heading clarity-section-heading">
        <div><p class="section-kicker">One example, end to end</p><h2 id="clarityStoryTitle">Follow one update through Continuum</h2></div>
        <p class="section-intro">A client says a payment was sent. One piece of information can move through the same people, memory, rules, views and future execution layer.</p>
      </div>
      <div class="clarity-story-flow" aria-label="Example Continuum information flow">
        <article><b>01</b><div><span>INPUT</span><strong>The message arrives</strong><small>An approved email or message source provides the update.</small></div></article>
        <i aria-hidden="true">→</i>
        <article><b>02</b><div><span>DIRECTORY</span><strong>Continuum knows who sent it</strong><small>The person and company resolve to stable identities.</small></div></article>
        <i aria-hidden="true">→</i>
        <article><b>03</b><div><span>LIBRARY</span><strong>The useful fact can be kept</strong><small>Important information can have source, history and allowed use.</small></div></article>
        <i aria-hidden="true">→</i>
        <article><b>04</b><div><span>SPACE</span><strong>Your Business view can reflect it</strong><small>The next briefing can show what changed and why it matters.</small></div></article>
        <i aria-hidden="true">→</i>
        <article><b>05</b><div><span>AUTOMATION</span><strong>Your rules decide what follows</strong><small>A defined workflow can prepare the next approved step.</small></div></article>
        <i aria-hidden="true">→</i>
        <article><b>06</b><div><span>RUNTIME · LATER</span><strong>The server can keep it moving</strong><small>Future Runtime can wait, retry, receive replies and record the result.</small></div></article>
      </div>
      <p class="clarity-story-note"><strong>The point:</strong> the same update can stay connected to the person, the saved context, the briefing, the rule that uses it and the result that comes later.</p>`;
    return section;
  }

  function makeProductMapSection(network, presence) {
    const section = document.createElement('section');
    section.className = 'clarity-product-map-section';
    section.setAttribute('aria-labelledby', 'clarityMapTitle');
    section.innerHTML = `
      <div class="section-heading clarity-section-heading">
        <div><p class="section-kicker">What those pieces are called</p><h2 id="clarityMapTitle">The product names follow the simple idea</h2></div>
        <p class="section-intro">People become Directory. Saved knowledge belongs in Library. Focused views are Spaces. Automations define the plan. Connections reach outside services. Runtime later carries long-running work. AI can reason across the parts it is allowed to use.</p>
      </div>`;
    addConceptLabels(network);
    section.append(network, presence);
    return section;
  }

  function makeAutomationPrimer(actionSection) {
    if (qs('.clarity-automation-primer', actionSection)) return;
    const primer = document.createElement('div');
    primer.className = 'clarity-automation-primer';
    primer.innerHTML = `
      <div class="clarity-builder-sentence" aria-label="Automation builder model">
        <span><b>WHEN</b><small>what starts it</small></span><i>→</i>
        <span><b>IF</b><small>which rules apply</small></span><i>→</i>
        <span><b>DO</b><small>approved actions</small></span><i>→</i>
        <span><b>WAIT</b><small>timing or repeat</small></span><i>→</i>
        <span><b>REVIEW</b><small>test before publish</small></span>
      </div>
      <div class="clarity-automation-split">
        <article><span>AUTOMATION</span><strong>The plan</strong><p>Defines the trigger, rules, actions, timing and finish behavior.</p></article>
        <i aria-hidden="true">→</i>
        <article><span>RUNTIME</span><strong>The execution</strong><p>Later keeps a published workflow moving on the server and records what actually happened.</p></article>
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
    summary.innerHTML = '<span><b>Longer-term possibilities</b><small>See what the same foundation could unlock as more services connect.</small></span><strong>Open</strong>';
    details.append(summary, heading, board);
    actionSection.append(details);
  }

  function makeOptionalSection(sectionId, label, summaryCopy) {
    const section = document.getElementById(sectionId);
    if (!section || qs('.clarity-deep-dive', section)) return;
    const heading = qs('.section-heading', section);
    const kicker = qs('.section-kicker', heading);
    if (kicker) kicker.textContent = sectionId === 'engineering' ? 'Optional architecture' : 'Optional build process';
    const details = document.createElement('details');
    details.className = 'clarity-deep-dive';
    const summary = document.createElement('summary');
    summary.innerHTML = `<span><b>${label}</b><small>${summaryCopy}</small></span><strong>Open</strong>`;
    qsa(':scope > *', section).filter((child) => child !== heading).forEach((child) => details.append(child));
    details.prepend(summary);
    section.append(details);
  }

  function installClarityPass() {
    if (root.dataset.continuumClarity === 'ready') return;

    const identitySub = qs('.document-identity-copy span');
    if (identitySub) identitySub.textContent = 'Product overview';

    const toolbarLinks = qs('.toolbar-links');
    if (toolbarLinks) toolbarLinks.innerHTML = '<a href="#overview">Overview</a><a href="#difference">AI</a><a href="#action">Automations</a><a href="#afterlife">Afterlife</a>';

    syncTocCopy();
    const railStatus = qs('.rail-status');
    if (railStatus) railStatus.innerHTML = '<span class="status-dot" aria-hidden="true"></span><div><strong>Where it stands</strong><p>Check In is LIVE. Spaces and Automations are LAB. Real private information and Automation definitions are NEXT. Runtime and provider execution are LATER.</p></div>';

    const hero = qs('.continuum-hero');
    const heroKicker = qs('.hero-kicker', hero);
    const heroLead = qs('.hero-lead', hero);
    const heroTruth = qs('.hero-truth-row', hero);
    const heroDisclosure = qs('.hero-disclosure', hero);
    if (hero) hero.classList.add('clarity-hero');
    if (heroKicker) heroKicker.textContent = 'Your information, people, rules and AI, connected over time';
    if (heroLead) heroLead.innerHTML = '<span class="hero-lead-first">Continuum keeps useful context in one private place so your information, people, rules and AI can work from the same picture over time.</span> It can brief you while you are here, follow approved Automations when work needs to continue, and support a continuity plan if you cannot respond.';
    if (heroTruth) heroTruth.innerHTML = '<span><i></i>Remembers context</span><span><i></i>Connects the pieces</span><span><i></i>Follows your rules</span>';
    if (heroDisclosure) heroDisclosure.textContent = 'Start with the five-step loop below. Product names and architecture come after the idea.';

    const overview = document.getElementById('overview');
    const overviewKicker = qs('.section-kicker', overview);
    const overviewIntro = qs('.section-intro', overview);
    if (overviewKicker) overviewKicker.textContent = 'Start here';
    if (overviewIntro) overviewIntro.textContent = 'The simple loop is the foundation: see what changed, remember the useful part, check your rules, do approved work and keep the result for next time.';

    const network = qs('.hero-network', hero);
    const presence = qs('.continuum-presence', hero);
    const statusKey = qs('.status-key', presence);
    const processMap = qs('.process-map', overview);
    if (statusKey && processMap) processMap.after(makeStatusSnapshot(statusKey));

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
    if (presenceEyebrow) presenceEyebrow.textContent = 'USEFUL ACROSS TIME';
    if (presenceHeading && qs('strong', presenceHeading)) qs('strong', presenceHeading).textContent = 'Your intent has somewhere durable to live.';
    if (presenceCopy) presenceCopy.textContent = 'Continuum can help while you are actively using it, carry defined work forward through Automations, and support continuity when you are unavailable.';

    const spaces = document.getElementById('spaces');
    const spacesKicker = qs('.section-kicker', spaces);
    const spacesTitle = qs('h2', spaces);
    if (spacesKicker) spacesKicker.textContent = 'How Continuum organizes what it knows';
    if (spacesTitle) spacesTitle.textContent = 'People, saved information and focused views stay connected';

    const action = document.getElementById('action');
    const actionKicker = qs('.section-kicker', action);
    const actionTitle = qs('h2', action);
    const actionIntro = qs('.section-intro', action);
    if (actionKicker) actionKicker.textContent = 'When information needs to become work';
    if (actionTitle) actionTitle.textContent = 'Automations define the plan. Runtime carries it through.';
    if (actionIntro) actionIntro.textContent = 'The builder turns a workflow into a readable sequence. Connections provide approved ways to reach outside services, and future Runtime keeps published work moving after you leave the page.';
    makeAutomationPrimer(action);
    collapsePossibilities(action);

    const afterlifeIntro = qs('.section-intro', afterlife);
    if (afterlifeIntro) afterlifeIntro.textContent = 'Afterlife is Continuum applied to continuity. You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can carry the approved steps that follow.';

    makeOptionalSection('engineering', 'Open the architecture walkthrough', 'See what happens between the browser, FastAPI and PostgreSQL, plus the tools used to build it.');
    makeOptionalSection('build', 'Open the build workflow', 'See how a Lab idea becomes a protected server-backed feature and why continuity.md is the first real private-data slice.');

    const status = document.getElementById('status');
    const statusKicker = qs('.section-kicker', status);
    const statusTitle = qs('h2', status);
    if (statusKicker) statusKicker.textContent = 'Roadmap';
    if (statusTitle) statusTitle.textContent = 'Build the durable foundation, then add capability';

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
