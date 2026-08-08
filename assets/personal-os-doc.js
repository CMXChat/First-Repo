'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'spaces_doc_theme_v1';
  const legacyStorageKey = 'personal_os_doc_theme_v3';

  function installStylesheet(href, dataAttribute) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[dataAttribute] = 'true';
    document.head.append(link);
  }

  function text(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
    return element;
  }

  function html(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = value;
    return element;
  }

  function replaceVisibleProductName(scope = document.body) {
    if (!scope) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.nodeValue?.includes('Personal OS')) {
        node.nodeValue = node.nodeValue.split('Personal OS').join('Spaces');
      }
    }

    scope.querySelectorAll?.('[aria-label], [title]').forEach((element) => {
      for (const attribute of ['aria-label', 'title']) {
        const value = element.getAttribute(attribute);
        if (value?.includes('Personal OS')) {
          element.setAttribute(attribute, value.split('Personal OS').join('Spaces'));
        }
      }
    });
  }

  function applySpacesContent() {
    document.title = 'Spaces | Shared Briefings and Context-Driven Workspace';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', 'Spaces turns approved information into a current briefing for one person or a group, with shared context, private boundaries, memory, goals, and connected accounts.');

    const identity = document.querySelector('.document-identity');
    identity?.setAttribute('aria-label', 'Spaces product overview, return to top');
    text('.document-mark', 'SP');
    text('.document-identity-copy strong', 'Spaces');

    const toc = document.querySelector('.document-toc');
    const modelLink = toc?.querySelector('a[href="#model"]');
    if (modelLink) modelLink.textContent = 'How it works';
    if (toc && !toc.querySelector('a[href="#inputs"]')) {
      modelLink?.insertAdjacentHTML('afterend', '<a href="#inputs">How a Space learns</a>');
    }

    text('.hero-kicker', 'Briefings with clear permissions');
    text('#pageTitle', 'One briefing for the part of life you’re in');
    text('.hero-lead', 'Spaces turns approved information into a current view for you or the people sharing that Space. Shared details meet in one Brief, and private details stay with their owner.');
    text('.hero-disclosure', 'The current demo uses sourced public information and clearly fictional private-looking examples. Real accounts, connected services, durable memory, and server-side permissions belong to the secure platform still being built.');
    text('.hero-system-center span', 'Spaces');
    text('.hero-system-center strong', 'Your current Space');
    text('.hero-system .node-brief strong', 'What changed and what matters');
    text('.hero-system .node-spaces span', 'Permissions');
    text('.hero-system .node-spaces strong', 'Who can see which details');
    document.querySelector('.hero-system')?.setAttribute('aria-label', 'Spaces system overview');

    text('#overviewTitle', 'Spaces in one minute');
    text('#overview .section-intro', 'A person, family, pair, business partnership, adviser relationship, or team can open one current Brief built from the information that belongs there.');
    html('#overview .overview-statement', `
      <p>Most digital tools understand one slice of your life. A calendar knows time, email holds messages, task managers track assignments, and a new AI chat usually starts with whatever you explain again.</p>
      <p>Spaces organizes those slices around the person or group who needs the briefing. A Family Space can bring together approved calendars, chores, shopping, weather, and household decisions while each record keeps a clear owner and permission scope.</p>
      <p>The Brief shows what changed, what matters now, what needs a decision, and what can wait. Conversation remains available across the whole Space or from a focused section such as a weather card, cash sheet, calendar, or project board.</p>
    `);
    document.querySelector('#overview .overview-grid')?.setAttribute('aria-label', 'Spaces overview');
    text('#overview .core-difference h3', 'The model can change while the Space keeps its history');
    text('#overview .core-difference-copy > p:last-of-type', 'Spaces keeps permissions, memory, sources, goals, tools, approvals, and history outside the model. A default model can power the experience, while another cloud model or future local model can work from the same controlled foundation.');

    const spacesSection = document.getElementById('spaces');
    if (spacesSection && !document.getElementById('inputs')) {
      spacesSection.insertAdjacentHTML('beforebegin', `
        <section id="inputs" class="document-section" aria-labelledby="inputsTitle">
          <div class="section-heading section-heading-wide">
            <div>
              <p class="section-kicker">How the context builds</p>
              <h2 id="inputsTitle">A Space learns from connected accounts, direct input, and corrections</h2>
            </div>
            <p class="section-intro">Most of the work should happen after the user chooses what to connect and which Space can use it. Spaces asks a short question only when the answer could change the next step.</p>
          </div>
          <div class="architecture-principles">
            <article><h3>Connected accounts</h3><p>Calendar, email, files, project tools, finance, music, and other approved services can supply records within a clear read, write, sync, and Space scope.</p></article>
            <article><h3>Direct input</h3><p>A note, uploaded document, voice update, form, import, or conversation can add context through a short, focused path.</p></article>
            <article><h3>Focused questions</h3><p>The AI can ask one clear question when a missing answer would change a recommendation, deadline, permission, or decision.</p></article>
            <article><h3>Corrections</h3><p>A direct user correction replaces a weaker guess, keeps the earlier record in revision history, and updates the next Brief.</p></article>
          </div>
          <div class="prose-callout">
            <strong>Every connected account uses a specific Space, purpose, and permission scope.</strong>
            <p>The user chooses the service, purpose, permission, and Space. The connection stays visible in settings and can be limited, paused, or removed.</p>
          </div>
        </section>
      `);
    }

    text('#spacesTitle', 'Every meaningful part of life can have its own Space');
    text('#spaces .section-intro', 'A Space is the continuing context for one part of life. It can hold people, documents, conversations, memory, tasks, calendars, files, projects, research, decisions, history, goals, and the permissions that keep them in the right place.');
    if (spacesSection && !spacesSection.querySelector('[data-spaces-document-knowledge]')) {
      const callouts = spacesSection.querySelectorAll('.prose-callout');
      const anchor = callouts[callouts.length - 1];
      anchor?.insertAdjacentHTML('afterend', `
        <div class="prose-callout" data-spaces-document-knowledge>
          <strong>Documents become connected knowledge inside a Space.</strong>
          <p>Every document belongs to at least one Space and can relate to people, projects, decisions, meetings, research, memories, tasks, and Briefs. The relationship matters as much as the file itself.</p>
        </div>
      `);
    }

    text('#memoryTitle', 'Memory belongs to the Space and stays under the user’s control');
    text('#memory .section-intro', 'Useful continuity needs more than old chat history. Each record needs a source, date, type, Space, permission, and revision history that the user can inspect.');
    text('#memory .memory-controls-card .card-label', 'Planned Memory & Data settings');
    text('#memory .memory-controls-card h3', 'Review, correct, move, export, or delete what the Space remembers');
    const memoryList = document.querySelector('#memory .memory-controls-card ul');
    if (memoryList && !memoryList.querySelector('[data-spaces-memory-setting]')) {
      memoryList.insertAdjacentHTML('beforeend', `
        <li data-spaces-memory-setting>Change a connected source’s permissions</li>
        <li data-spaces-memory-setting>Disconnect an account from the Space</li>
      `);
    }

    text('#aiTitle', 'Use the AI model you choose inside the current Space');
    text('#ai-layer .section-intro', 'The model receives only the context, tools, and permissions needed for the current task. The Space keeps its long-term records, settings, and history outside the model.');
    text('#ai-layer .ai-foundation-card .card-label', 'Stable Spaces foundation');

    text('#status .section-intro', 'This section separates demonstrated work from planned platform work and keeps the current product status precise.');

    const experienceLayer = document.querySelector('#architecture .architecture-layer');
    if (experienceLayer) {
      text('#architecture .architecture-layer span', 'Experience');
      text('#architecture .architecture-layer strong', 'Brief · Documents · Projects · Research · Memory · Tasks · Calendar · Files · Settings');
      text('#architecture .architecture-layer p', 'Different modules, one shared Space context.');
    }

    const architecturePrinciples = document.querySelector('#architecture .architecture-principles');
    if (architecturePrinciples && !document.querySelector('[data-cloudflare-context]')) {
      architecturePrinciples.insertAdjacentHTML('afterend', `
        <div class="prose-callout" data-cloudflare-context>
          <strong>Cloudflare could become infrastructure beneath Spaces.</strong>
          <p>Cloudflare’s Agents SDK provides durable identity, local SQL state, real-time connections, scheduling, recoverable execution, tools, and human approval patterns. Spaces would remain the user-facing product for context, continuity, memory, and action.</p>
          <a class="button button-secondary" href="https://developers.cloudflare.com/agents/" target="_blank" rel="noopener noreferrer">View Cloudflare Agents <span aria-hidden="true">↗</span></a>
        </div>
      `);
    }

    text('#faqTitle', 'Common questions about Spaces');
    html('#faq .faq-list', `
      <details><summary>Is Spaces an AI model?</summary><p>Spaces is the product around the model. It keeps the contexts, permissions, memory, sources, goals, tools, approvals, and history that let a chosen model work inside clear limits.</p></details>
      <details><summary>Why is the product organized around Spaces?</summary><p>Each Space keeps one part of life coherent. Remote partners can share company operations, a family can coordinate household plans, and an accountant and client can review approved financial records without pulling unrelated context into those Spaces.</p></details>
      <details><summary>How does a Space get its information?</summary><p>Information can come from connected accounts, uploaded files, notes, voice updates, forms, imports, conversations, public sources, and short questions from the AI. Every source needs a purpose, permission, and Space.</p></details>
      <details><summary>Can users correct what a Space remembers?</summary><p>That is part of the planned Memory & Data settings. Users should be able to inspect sources, correct records, move information between Spaces, remove interpretations, change connector permissions, export data, delete records, and pause future learning.</p></details>
      <details><summary>How does the Brief decide what appears first?</summary><p>The current demo combines a user’s stated priorities with time, impact, risk, commitments, and recent changes. Engagement can help tune presentation over time, but important facts remain visible even when they are less interesting.</p></details>
      <details><summary>Can different AI models use the same Space?</summary><p>Yes. The Space is designed to keep its goals, memory, permissions, and history while the user or system selects a suitable model for the task.</p></details>
      <details><summary>What data does the current demo use?</summary><p>The public demo uses sourced public information and clearly fictional private-looking records. Real private data requires authentication, protected storage, server-side permissions, limited connector scopes, and revocable access.</p></details>
      <details><summary>Can Spaces help with family, relationship, or team decisions?</summary><p>Spaces can organize what people stated, expose schedule or responsibility conflicts, track approved agreements, and prepare practical options. People remain responsible for the relationship and the decision.</p></details>
      <details><summary>What makes the alarm, music, and voice experience useful?</summary><p>The routine can use the same approved context as the Brief, so music, voice, reminders, and spoken check-ins begin from the current Space with the needed context already available.</p></details>
    `);

    text('.final-cta h2', 'Explore the current Spaces Brief demo');
    text('.final-cta p:not(.section-kicker)', 'The demo previews the daily experience while secure accounts, connected services, durable memory, settings, and the backend continue moving toward the full product described here.');
    text('.document-footer strong', 'Spaces');
    text('.document-footer span', 'A context-driven workspace built around continuity, memory, clear boundaries, and useful action.');

    replaceVisibleProductName();
  }

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
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

  function setCurrentSection(id) {
    document.querySelectorAll('.document-toc a').forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function installSectionTracking() {
    const sections = Array.from(document.querySelectorAll('.document-section[id]'));
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

  installStylesheet('/assets/personal-os-doc-editorial.css?v=20260805-1', 'spacesEditorial');
  installStylesheet('/assets/personal-os-doc-desktop-tuning.css?v=20260805-1', 'spacesDesktopTuning');
  installStylesheet('/assets/personal-os-doc-mobile-fixes.css?v=20260808-1', 'spacesMobileFixes');
  applySpacesContent();
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
