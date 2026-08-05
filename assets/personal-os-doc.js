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
  const editorialStylesheet = '/assets/personal-os-doc-editorial.css?v=20260805-1';
  const desktopTuningStylesheet = '/assets/personal-os-doc-desktop-tuning.css?v=20260805-1';
  const mobileFixStylesheet = '/assets/personal-os-doc-mobile-fixes.css?v=20260805-1';

  const plainCopy = new Map([
    ['Private personal intelligence', 'A private daily operating layer'],
    ['One operating layer for your life, relationships, family, and work.', 'One place to organize your personal life, shared Spaces, and work.'],
    ['Personal OS brings approved information, goals, memory, connected services, and chosen AI models into one controlled system. Spaces keep each part of life separate while allowing the right information to work together.', 'Personal OS brings approved information, goals, memory, connected services, and your chosen AI model into one place. Spaces keep personal, shared, and work records separate.'],
    ['Understand it in one minute', 'See how it works'],
    ['The current demo uses sourced public information and clearly fictional private-looking examples. Real accounts, secure connectors, durable memory, and server-side permissions are part of the planned platform.', 'The demo uses public information and clearly labeled fictional records. Real accounts, private memory, secure connections, and server permissions still need to be built.'],
    ['Your controlled context', 'Your approved context'],
    ['Where the system directs attention', 'What needs attention'],
    ['The product has one simple job: help a person or group understand the current situation, protect the right boundaries, and move the right thing forward.', 'Personal OS helps a person or group see what is happening, keep the right records private, and choose the next useful step.'],
    ['Most digital tools hold one slice of your life. A calendar knows time. Email knows messages. A task manager knows assignments. An AI chat knows the context placed into that conversation.', 'Most tools know one part of your life. A calendar knows time. Email knows messages. A task manager knows assignments. An AI chat knows what was placed in that conversation.'],
    ['Personal OS creates a stable layer above those tools. It organizes authorized information into Spaces, keeps useful memory with sources and correction controls, connects current reality to goals, and produces a focused Brief with actions that remain under human control.', 'Personal OS sits above those tools. It puts approved records into Spaces, keeps memory with sources and corrections, connects the current situation to goals, and prepares a focused Brief. The user stays in control of every important action.'],
    ['See the few things worth attention now.', 'See what needs attention now.'],
    ['A morning view, team operating brief, family plan, relationship check-in, or focused project update can come from the same underlying system.', 'The same product can prepare a morning Brief, team update, family plan, relationship check-in, or project review.'],
    ['Keep contexts separate and coordinate safely.', 'Keep each part of life separate.'],
    ['Personal, relationship, family, business, team, and project Spaces can each have their own people, memory, goals, data, rules, and daily view.', 'Each Space can have its own people, memory, goals, records, rules, and daily view.'],
    ['Preserve useful context without surrendering control.', 'Keep useful history under your control.'],
    ['Facts, self-reports, source records, preferences, decisions, and interpretations remain distinguishable, editable, exportable, and removable.', 'Facts, user reports, sources, preferences, decisions, and interpretations stay separate. The user can edit, export, or remove them.'],
    ['Connect information to a direction.', 'Use goals to choose the next step.'],
    ['The system can identify blockers, ask one useful question, recommend one next action, record the result, and update the next Brief.', 'Personal OS can spot a blocker, ask one useful question, suggest the next step, record the result, and update the next Brief.'],
    ['The AI can change. Your operating context stays yours.', 'Your data and settings stay in Personal OS, even when the AI model changes.'],
    ['Personal OS owns the structure around the model: Spaces, permissions, memory, sources, goals, tools, approvals, and history. A default model can power the experience, while another cloud model or future local model can use the same controlled foundation.', 'Personal OS keeps the Spaces, permissions, memory, sources, goals, tools, approvals, and history. A default AI model can run the product, and the user can choose another model later without rebuilding everything.'],
    ['A continuous intelligence loop', 'A simple working loop'],
    ['The loop matters more than any single dashboard, connector, model, or visual effect.', 'The product repeats the same six steps each time it prepares a useful Brief.'],
    ['Reduce uncertainty', 'Ask when something is unclear'],
    ['Ask one question when the answer can change the decision', 'Ask one question when the answer could change the decision'],
    ['Recommend the next useful action', 'Suggest the next useful step'],
    ['Explain the reason, effort, expected result, evidence, and confidence', 'Show the reason, effort, expected result, evidence, and confidence'],
    ['The shared architecture', 'How Spaces work'],
    ['Spaces make one system useful between people.', 'Spaces let people work together without sharing everything.'],
    ['A Space is a controlled environment for one part of life. It defines the people, information, memory, goals, tools, and permissions that belong together.', 'A Space covers one part of life. It defines the people, records, memory, goals, tools, and permissions that belong there.'],
    ['One fact may appear in several places only when the permission allows it.', 'The same event can appear in more than one Space when permission allows it.'],
    ['A calendar event may be relevant to a personal Brief, a family plan, and a project deadline. Personal OS can reference the same event across those contexts without exposing unrelated private information.', 'One calendar event may matter to a personal Brief, family plan, and project deadline. Personal OS can use that event in each approved Space without exposing unrelated records.'],
    ['Continuity with control', 'Memory and control'],
    ['Memory should be organized, inspectable, and correctable.', 'Memory should be easy to inspect, correct, and remove.'],
    ['Useful continuity requires more than saving chat history. The system needs clear memory types, sources, dates, permissions, and revision controls.', 'Useful memory needs more than old chat logs. Each record needs a type, source, date, permission, and correction history.'],
    ['A pattern or interpretation labeled as analysis instead of confirmed fact.', 'A pattern or interpretation marked as analysis, not confirmed fact.'],
    ['The record can change when reality changes.', 'The user can update the record when reality changes.'],
    ['Goals turn context into movement.', 'Goals help choose the next step.'],
    ['The system should understand what the person or Space is trying to accomplish, what changed, what remains blocked, and which action has the highest current value.', 'Personal OS looks at the goal, what changed, what is blocked, and which step is most useful today.'],
    ['The answer changes the next action, effort, and success condition.', 'The answer changes the next step, the effort, and what success looks like.'],
    ['Protect continuity with one very small action.', 'Keep the goal alive with one very small action.'],
    ['Use a larger action and expose the necessary tradeoffs.', 'Take a larger step and show the tradeoffs.'],
    ['A briefing can become part of the morning itself.', 'The morning Brief can become a simple routine.'],
    ['Personal OS can combine an alarm, selected music, voice, and a concise Brief into one user-controlled routine.', 'Personal OS can combine an alarm, selected music, voice, and a short Brief in one routine the user controls.'],
    ['Start with a selected song or playlist after a permitted user action.', 'Start a selected song or playlist after the user opens the Brief or taps play.'],
    ['Use different routines for weekdays, weekends, travel, recovery, or a shared household.', 'Set different routines for weekdays, weekends, travel, recovery, or a shared home.'],
    ['Complex human coordination', 'Shared life and work'],
    ['The system can help people coordinate without collapsing their boundaries.', 'People can coordinate while keeping private boundaries.'],
    ['The most important shared use cases involve context that belongs to more than one person and still requires careful privacy, consent, and interpretation.', 'Shared Spaces may involve several people, so privacy, consent, and clear records matter.'],
    ['One shared truth with role-specific access', 'One project record with role-based access'],
    ['A Team Space can hold the project state, responsibilities, handoffs, procedures, risks, decisions, and approved financial signals. Leadership may see broader operating context while each member sees relevant work and the information needed to complete it.', 'A Team Space can hold project status, responsibilities, handoffs, procedures, risks, decisions, and approved financial details. Leaders may see the wider view while each member sees the work and records needed for their role.'],
    ['Use stated information', 'Use what people actually said'],
    ['The system should not invent motives or treat an inference as a fact.', 'Personal OS should avoid invented motives and keep guesses separate from facts.'],
    ['Support human judgment', 'Leave the decision with people'],
    ['The system can prepare context and options. People remain responsible for the relationship and the decision.', 'Personal OS can prepare the facts and options. People still make the decision.'],
    ['Model-independent intelligence', 'Model choice'],
    ['Your chosen AI works inside a controlled operating layer.', 'Use the AI model you choose inside clear limits.'],
    ['The model receives the context, tools, and permissions needed for the current task. Personal OS keeps the long-term product state outside the model.', 'The model receives only the context, tools, and permissions needed for the task. Personal OS keeps the long-term records outside the model.'],
    ['Turn authorized data into structured state that the user can inspect.', 'Put approved information into records the user can inspect.'],
    ['Identify the relevant change, blocker, question, or next action.', 'Find the change, blocker, question, or next step that matters.'],
    ['Use typed tools within a defined Space and permission scope.', 'Use approved tools inside the right Space and permission limit.'],
    ['Trust as product infrastructure', 'Trust and control'],
    ['Every important item should answer four questions.', 'Every important item should answer four simple questions.'],
    ['The product narrative is open. Private product data still requires real protection.', 'This overview is public. Real private data needs real protection.'],
    ['This noindex overview contains product explanation and fictional examples, so it does not need a client-side password prompt. Real Personal OS accounts and private records require edge or server enforcement, authenticated sessions, authorization, protected storage, connector scopes, encryption, audit logs, and revocable access.', 'This noindex page contains product notes and fictional examples, so it can stay public. Real accounts need secure sessions, server-side permission checks, protected storage, limited connector access, encryption, logs, and a way to revoke access.'],
    ['A strong demonstration with a clear path to the real platform.', 'What works now and what still needs building.'],
    ['The document separates what exists from what has been designed or planned so the product can be ambitious without overstating its current state.', 'This section separates the working demo from the planned production platform.'],
    ['Frontend demonstrations of Spaces, memory, connections, goals, media, and permissions', 'Frontend examples of Spaces, memory, connections, goals, media, and permissions'],
    ['A separate experimental `/brief-next/` direction', 'A matching `/brief-next/` route used for testing'],
    ['Deterministic Goal Intelligence engine', 'Rule-based goal scoring and next-step logic'],
    ['AI reasoning over limited structured context', 'AI reasoning over a limited set of approved records'],
    ['A product layer that remains understandable and controllable.', 'A technical plan that stays understandable and controllable.'],
    ['The technical plan keeps structured product state, AI reasoning, connectors, and user-facing interfaces separate enough to test, replace, and secure.', 'The plan keeps product records, AI reasoning, connections, and the interface separate so each part can be tested, replaced, and secured.'],
    ['Visible provenance', 'Clear sources'],
    ['The product can explain the information and evidence behind a recommendation.', 'The product can show the sources and evidence behind a recommendation.'],
    ['The same foundation can serve very different lives.', 'The same foundation can support different people and groups.'],
    ['Each scenario uses a different Space, permission model, vocabulary, data mix, and daily output while preserving the same core architecture.', 'Each example uses different Spaces, permissions, records, and daily views while keeping the same product foundation.'],
    ['What readers usually need clarified', 'Common questions'],
    ['Personal OS is the product layer around AI models. It manages Spaces, permissions, structured memory, sources, goals, tools, approvals, and history. A model provides reasoning and generation within that controlled context.', 'Personal OS is the product around the AI model. It manages Spaces, permissions, memory, sources, goals, tools, approvals, and history. The model helps reason and write inside those limits.'],
    ['That is the intended direction. The operating context remains stable while the user or system selects an appropriate model. Provider changes should not require rebuilding the user’s goals, memory, permissions, and Spaces.', 'Yes. The user can change the AI model while keeping the same goals, memory, permissions, and Spaces.'],
    ['It can organize stated information, expose conflicts, compare schedules, summarize approved positions, track agreements, and suggest practical options. It should not diagnose people, invent motives, take sides, or replace professional judgment.', 'It can organize what people said, show schedule or responsibility conflicts, track agreements, and suggest practical options. It should avoid diagnosis, invented motives, taking sides, or replacing professional help.'],
    ['The routine can be built from the same approved context that powers the Brief. A selected alarm can begin a user-controlled music and voice experience, then allow spoken check-ins, reminders, and updates without forcing the user through a full dashboard.', 'The alarm can use the same approved records as the Brief. It can start music and voice, then accept a spoken check-in, reminder, or update without opening the full dashboard.'],
    ['Explore the current Personal OS briefing demonstration.', 'Open the current Personal OS Brief demo.'],
    ['The demo is an active-development preview of the daily experience. Its interface, data structure, connections, Goals, memory, and backend will continue changing as the product moves toward the full system described here.', 'The demo shows the current daily experience. The interface, records, connections, goals, memory, and backend will keep changing as the real product is built.'],
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

  function applyPlainCopy() {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = 'A plain-language overview of Personal OS, including Spaces, memory, goals, permissions, connected services, AI model choice, and approved actions.';
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const raw = node.nodeValue || '';
      const text = raw.trim();
      const replacement = plainCopy.get(text);
      if (!replacement) return;
      node.nodeValue = raw.replace(text, replacement);
    });
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
    } catch {
      return;
    }
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

    if (themeMeta) {
      themeMeta.setAttribute('content', darkMode ? '#060a12' : '#edf3f8');
    }

    if (persist) storeTheme(nextTheme);
  }

  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0
      ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
      : 0;
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
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setCurrentSection(visible.target.id);
      }, {
        rootMargin: '-18% 0px -66% 0px',
        threshold: [0.04, 0.15, 0.35]
      });

      sections.forEach((section) => observer.observe(section));
      return;
    }

    const updateFromScroll = () => {
      const target = sections
        .map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 130) }))
        .sort((a, b) => a.top - b.top)[0];
      if (target?.id) setCurrentSection(target.id);
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    updateFromScroll();
  }

  function installFaqBehavior() {
    const faqItems = Array.from(document.querySelectorAll('.faq-list details'));
    faqItems.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  applyPlainCopy();
  installStylesheet(editorialStylesheet, 'personalOsEditorial');
  installStylesheet(desktopTuningStylesheet, 'personalOsDesktopTuning');
  installStylesheet(mobileFixStylesheet, 'personalOsMobileFixes');
  applyTheme(getRequestedTheme());

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  printButton?.addEventListener('click', () => window.print());

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('pageshow', updateProgress);

  updateProgress();
  installSectionTracking();
  installFaqBehavior();
})();