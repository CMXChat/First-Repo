'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const tocLinks = Array.from(document.querySelectorAll('.document-toc a'));
  const sections = Array.from(document.querySelectorAll('.document-section[id]'));
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'personal_os_doc_theme_v3';

  const baseCopy = new Map([
    ['Private personal intelligence', 'A private daily operating layer'],
    ['One operating layer for your life, relationships, family, and work.', 'One place to organize your personal life, shared Spaces, and work.'],
    ['Personal OS brings approved information, goals, memory, connected services, and chosen AI models into one controlled system. Spaces keep each part of life separate while allowing the right information to work together.', 'Personal OS brings approved information, goals, memory, connected services, and your chosen AI model into one place, with Spaces keeping personal, shared, and work records separate.'],
    ['Understand it in one minute', 'See how it works'],
    ['Your controlled context', 'Your approved context'],
    ['Where the system directs attention', 'What needs attention'],
    ['The product has one simple job: help a person or group understand the current situation, protect the right boundaries, and move the right thing forward.', 'Personal OS helps a person or group see what is happening, keep the right records private, and choose the next useful step.'],
    ['See the few things worth attention now.', 'See what needs attention now.'],
    ['A morning view, team operating brief, family plan, relationship check-in, or focused project update can come from the same underlying system.', 'The same product can prepare a morning Brief, team update, family plan, relationship check-in, or project review.'],
    ['Keep contexts separate and coordinate safely.', 'Keep each part of life separate while coordinating what needs to be shared.'],
    ['Personal, relationship, family, business, team, and project Spaces can each have their own people, memory, goals, data, rules, and daily view.', 'Each Space can have its own people, memory, goals, records, rules, and daily view.'],
    ['Preserve useful context without surrendering control.', 'Keep useful history under your control.'],
    ['Facts, self-reports, source records, preferences, decisions, and interpretations remain distinguishable, editable, exportable, and removable.', 'Facts, user reports, sources, preferences, decisions, and interpretations stay separate, and the user can edit, export, or remove them.'],
    ['Connect information to a direction.', 'Use goals to choose the next step.'],
    ['The system can identify blockers, ask one useful question, recommend one next action, record the result, and update the next Brief.', 'Personal OS can spot a blocker, ask one useful question, suggest the next step, record the result, and update the next Brief.'],
    ['A continuous intelligence loop', 'A simple working loop'],
    ['The loop matters more than any single dashboard, connector, model, or visual effect.', 'The product repeats the same six steps whenever it prepares a useful Brief.'],
    ['Reduce uncertainty', 'Ask when something is unclear'],
    ['Recommend the next useful action', 'Suggest the next useful step'],
    ['The shared architecture', 'How Spaces work'],
    ['Spaces make one system useful between people.', 'Spaces let people work together without sharing everything.'],
    ['A Space is a controlled environment for one part of life. It defines the people, information, memory, goals, tools, and permissions that belong together.', 'A Space covers one part of life and defines the people, records, memory, goals, tools, and permissions that belong there.'],
    ['Continuity with control', 'Memory and control'],
    ['Memory should be organized, inspectable, and correctable.', 'Memory should be easy to inspect, correct, and remove.'],
    ['Useful continuity requires more than saving chat history. The system needs clear memory types, sources, dates, permissions, and revision controls.', 'Useful memory needs more than old chat logs because each record needs a type, source, date, permission, and correction history.'],
    ['A pattern or interpretation labeled as analysis instead of confirmed fact.', 'A pattern or interpretation marked as analysis, not confirmed fact.'],
    ['The record can change when reality changes.', 'The user can update the record when reality changes.'],
    ['The system should understand what the person or Space is trying to accomplish, what changed, what remains blocked, and which action has the highest current value.', 'Personal OS looks at the goal, what changed, what remains blocked, and which step is most useful today.'],
    ['The answer changes the next action, effort, and success condition.', 'The answer changes the next step, the effort involved, and what success looks like.'],
    ['Protect continuity with one very small action.', 'Keep the goal alive with one very small action.'],
    ['Use a larger action and expose the necessary tradeoffs.', 'Take a larger step and show the tradeoffs clearly.'],
    ['A briefing can become part of the morning itself.', 'The morning Brief can become a simple routine.'],
    ['Personal OS can combine an alarm, selected music, voice, and a concise Brief into one user-controlled routine.', 'Personal OS can combine an alarm, selected music, voice, and a short Brief in one routine the user controls.'],
    ['Start with a selected song or playlist after a permitted user action.', 'Start a selected song or playlist after the user opens the Brief or taps play.'],
    ['Complex human coordination', 'Shared life and work'],
    ['The system can help people coordinate without collapsing their boundaries.', 'People can coordinate while keeping their private boundaries intact.'],
    ['The most important shared use cases involve context that belongs to more than one person and still requires careful privacy, consent, and interpretation.', 'Shared Spaces may involve several people, which makes privacy, consent, and clear records essential.'],
    ['One shared truth with role-specific access', 'One project record with role-based access'],
    ['Use stated information', 'Use what people actually said'],
    ['The system should not invent motives or treat an inference as a fact.', 'Personal OS should avoid invented motives and keep guesses separate from facts.'],
    ['Support human judgment', 'Leave the decision with people'],
    ['Model-independent intelligence', 'Model choice'],
    ['Your chosen AI works inside a controlled operating layer.', 'Use the AI model you choose inside clear limits.'],
    ['Turn authorized data into structured state that the user can inspect.', 'Put approved information into records the user can inspect.'],
    ['Identify the relevant change, blocker, question, or next action.', 'Find the change, blocker, question, or next step that matters.'],
    ['Use typed tools within a defined Space and permission scope.', 'Use approved tools inside the right Space and permission limit.'],
    ['Trust as product infrastructure', 'Trust and control'],
    ['Every important item should answer four questions.', 'Every important item should answer four simple questions.'],
    ['This noindex overview contains product explanation and fictional examples, so it does not need a client-side password prompt. Real Personal OS accounts and private records require edge or server enforcement, authenticated sessions, authorization, protected storage, connector scopes, encryption, audit logs, and revocable access.', 'This noindex page contains product notes and fictional examples, so it can remain public, while real accounts require secure sessions, server-side permission checks, protected storage, limited connector access, encryption, logs, and revocable access.'],
    ['The document separates what exists from what has been designed or planned so the product can be ambitious without overstating its current state.', 'This section separates the working demo from the planned production platform.'],
    ['Frontend demonstrations of Spaces, memory, connections, goals, media, and permissions', 'Frontend examples of Spaces, memory, connections, goals, media, and permissions'],
    ['A separate experimental `/brief-next/` direction', 'A matching `/brief-next/` route used for testing'],
    ['Deterministic Goal Intelligence engine', 'Rule-based goal scoring and next-step logic'],
    ['AI reasoning over limited structured context', 'AI reasoning over a limited set of approved records'],
    ['A product layer that remains understandable and controllable.', 'A technical plan that stays understandable and controllable.'],
    ['The technical plan keeps structured product state, AI reasoning, connectors, and user-facing interfaces separate enough to test, replace, and secure.', 'The plan keeps product records, AI reasoning, connections, and the interface separate so each part can be tested, replaced, and secured.'],
    ['Visible provenance', 'Clear sources'],
    ['The product can explain the information and evidence behind a recommendation.', 'The product can show the sources and evidence behind a recommendation.'],
    ['Each scenario uses a different Space, permission model, vocabulary, data mix, and daily output while preserving the same core architecture.', 'Each example uses different Spaces, permissions, records, and daily views while keeping the same product foundation.'],
    ['What readers usually need clarified', 'Common questions'],
    ['Explore the current Personal OS briefing demonstration.', 'Open the current Personal OS Brief demo.'],
    ['A private operating layer built around Spaces, memory, goals, and approved action.', 'A private operating layer for Spaces, memory, goals, and approved actions.']
  ]);

  function installStylesheet(href, dataAttribute) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[dataAttribute] = 'true';
    document.head.append(link);
  }

  function applyBaseCopy() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const raw = node.nodeValue || '';
      const text = raw.trim();
      const replacement = baseCopy.get(text);
      if (replacement) node.nodeValue = raw.replace(text, replacement);
    });
  }

  function loadCopyPolish() {
    if (document.querySelector('script[data-personal-os-copy-polish]')) return;
    const script = document.createElement('script');
    script.src = '/assets/personal-os-copy-polish.js?v=20260806-1';
    script.defer = true;
    script.dataset.personalOsCopyPolish = 'true';
    document.head.append(script);
  }

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(storageKey);
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
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const darkMode = nextTheme === 'dark';
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    themeButton?.setAttribute('aria-label', `Switch to ${darkMode ? 'light' : 'dark'} mode`);
    themeButton?.setAttribute('aria-pressed', String(darkMode));
    if (themeButton) themeButton.dataset.activeTheme = nextTheme;
    themeMeta?.setAttribute('content', darkMode ? '#060a12' : '#edf3f8');
    if (persist) storeTheme(nextTheme);
  }

  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    progressBar.style.width = `${progress}%`;
  }

  function setCurrentSection(id) {
    tocLinks.forEach((link) => {
      const current = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function installSectionTracking() {
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

  function installFaqBehavior() {
    const items = Array.from(document.querySelectorAll('.faq-list details'));
    items.forEach((item) => item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => { if (other !== item) other.open = false; });
    }));
  }

  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = 'A clear product overview of Personal OS, including Spaces, memory, goals, permissions, connected services, AI model choice, and approved actions.';

  applyBaseCopy();
  loadCopyPolish();
  installStylesheet('/assets/personal-os-doc-editorial.css?v=20260805-1', 'personalOsEditorial');
  installStylesheet('/assets/personal-os-doc-desktop-tuning.css?v=20260805-1', 'personalOsDesktopTuning');
  installStylesheet('/assets/personal-os-doc-mobile-fixes.css?v=20260805-1', 'personalOsMobileFixes');
  applyTheme(getRequestedTheme());

  themeButton?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  printButton?.addEventListener('click', () => window.print());
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('pageshow', updateProgress);

  updateProgress();
  installSectionTracking();
  installFaqBehavior();
})();
