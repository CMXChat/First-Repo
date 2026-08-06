from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, text):
    (ROOT / path).write_text(text, encoding="utf-8", newline="\n")
    print(f"updated {path}")


def required_replace(text, old, new, label, expected=1):
    count = text.count(old)
    if count != expected:
        raise RuntimeError(f"{label}: expected {expected} occurrence(s) of {old!r}, found {count}")
    return text.replace(old, new)


def insert_before(text, marker, addition, label):
    count = text.count(marker)
    if count != 1:
        raise RuntimeError(f"{label}: expected one insertion marker, found {count}")
    return text.replace(marker, addition + marker, 1)


# Active Brief source
brief = read("brief/index.html").replace("Personal OS", "Spaces")
brief_replacements = [
    ("<title>Spaces Briefing Demo</title>", "<title>Spaces Brief Demo</title>"),
    (
        '<meta name="description" content="A working demo of a private daily briefing built around goals, Spaces, approved connections, and clear permissions." />',
        '<meta name="description" content="A working demo of Spaces, showing how one context can bring together a Brief, memory, goals, connected information, permissions, and next steps." />',
    ),
    ('<div class="entry-mark" aria-hidden="true">OS</div>', '<div class="entry-mark" aria-hidden="true">SP</div>'),
    ('<p class="eyebrow">PERSONAL OS DEMO</p>', '<p class="eyebrow">SPACES DEMO</p>'),
    ('<h1 id="entryTitle">Choose a briefing to explore</h1>', '<h1 id="entryTitle">Choose the Space you want to open</h1>'),
    (
        '<p class="entry-copy">The layout stays familiar, but the people, permissions, priorities, numbers, Spaces, and next steps change based on the briefing you choose.</p>',
        '<p class="entry-copy">Each Space changes the people, permissions, priorities, records, and next steps while the product stays familiar.</p>',
    ),
    ('aria-label="Demo contexts"', 'aria-label="Demo Spaces"'),
    ('disabled>Choose a context first</button>', 'disabled>Choose a Space first</button>'),
    ('<span class="identity-mark" aria-hidden="true">OS</span>', '<span class="identity-mark" aria-hidden="true">SP</span>'),
    (
        '<span class="identity-copy"><strong>Spaces</strong><small>Daily briefing demo</small></span>',
        '<span class="identity-copy"><strong>Spaces</strong><small>Context-driven briefing demo</small></span>',
    ),
    ('aria-label="Switch demonstration context"', 'aria-label="Switch Space"'),
    ('<button class="rail-reset" id="resetDemo" type="button">Choose another demo</button>', '<button class="rail-reset" id="resetDemo" type="button">Choose another Space</button>'),
    ('<h1 id="workspaceTitle">Open the part of the briefing you need</h1>', '<h1 id="workspaceTitle">Open the part of this Space you need</h1>'),
    (
        '<h1 id="howTitle">The Brief shows what matters now, and Spaces keeps the context behind it</h1>',
        '<h1 id="howTitle">The Brief shows what matters now, and the Space keeps the context behind it</h1>',
    ),
    (
        '<p>Goals provide direction, Spaces set boundaries, approved connections bring in data, memory keeps useful history, and automations handle repeat work.</p>',
        '<p>Goals provide direction, each Space sets the boundary, approved connections bring in data, memory keeps useful history, and automations handle repeat work.</p>',
    ),
    ('brief-demo-data.js?v=20260806-1', 'brief-demo-data.js?v=20260806-2'),
    ('brief-demo-experience.js?v=20260806-1', 'brief-demo-experience.js?v=20260806-2'),
    ('brief-demo-explainers.js?v=20260806-1', 'brief-demo-explainers.js?v=20260806-2'),
    ('brief-demo-doc-links.css?v=20260806-2', 'brief-demo-doc-links.css?v=20260806-3'),
]
for old, new in brief_replacements:
    brief = required_replace(brief, old, new, "brief/index.html")
write("brief/index.html", brief)
write("brief-next/index.html", brief)

# Active Brief JavaScript
for path in [
    "assets/brief/brief-demo-data.js",
    "assets/brief/brief-demo-experience.js",
    "assets/brief/brief-demo-explainers.js",
]:
    text = read(path).replace("Personal OS", "Spaces")
    if path.endswith("brief-demo-data.js"):
        text = required_replace(
            text,
            "description: 'A working daily briefing that organizes approved information around clear Spaces, permissions, goals, and next steps.'",
            "description: 'A context-driven workspace that organizes approved information around a Space, its permissions, goals, memory, and next steps.'",
            path,
        )
    if "Personal OS" in text:
        raise RuntimeError(f"{path}: visible legacy product name remains")
    write(path, text)

# Dark-mode selector repair, shared by desktop and mobile.
topbar_path = "assets/brief/brief-demo-topbar-polish.css"
topbar = read(topbar_path)
selector_block = '''

/* Keep the native Space selector readable in both themes and on mobile. */
.topbar-context select {
  color-scheme: light;
}

.topbar-context select option {
  color: #081426;
  background-color: #ffffff;
}

html[data-theme="dark"] .topbar-context {
  border-color: var(--line-strong);
  background: #0d1827;
}

html[data-theme="dark"] .topbar-context select {
  color: #f7fbff;
  -webkit-text-fill-color: #f7fbff;
  background-color: #0d1827;
  color-scheme: dark;
}

html[data-theme="dark"] .topbar-context select option {
  color: #f7fbff;
  background-color: #0d1827;
}
'''
if "Keep the native Space selector readable" not in topbar:
    topbar = topbar.rstrip() + selector_block + "\n"
write(topbar_path, topbar)

links_path = "assets/brief/brief-demo-doc-links.css"
links = read(links_path)
links = required_replace(
    links,
    "@import url('/assets/brief/brief-demo-topbar-polish.css?v=20260806-2');",
    "@import url('/assets/brief/brief-demo-topbar-polish.css?v=20260806-3');",
    links_path,
)
write(links_path, links)

# Product overview
doc = read("doc/index.html").replace("Personal OS", "Spaces")
doc_replacements = [
    ("<title>Spaces | Product Overview</title>", "<title>Spaces | Context-Driven Workspace and Daily Brief</title>"),
    (
        '<meta name="description" content="A product overview of Spaces, a private operating layer built around Spaces, structured memory, goals, briefings, permissions, connected services, and approved action." />',
        '<meta name="description" content="Spaces is a context-driven workspace that organizes memory, documents, tasks, calendars, people, and connected accounts around the parts of life that matter." />',
    ),
    ('<span class="document-mark" aria-hidden="true">OS</span>', '<span class="document-mark" aria-hidden="true">SP</span>'),
    ('<a href="#model">The operating model</a>', '<a href="#model">How it works</a>\n            <a href="#inputs">How a Space learns</a>'),
    ('<p class="hero-kicker">Private personal intelligence</p>', '<p class="hero-kicker">Context-driven workspace</p>'),
    ('<h1 id="pageTitle">One operating layer for your life, relationships, family, and work.</h1>', '<h1 id="pageTitle">Open the part of your life you’re working in</h1>'),
    (
        '<p class="hero-lead">Spaces brings approved information, goals, memory, connected services, and chosen AI models into one controlled system. Spaces keep each part of life separate while allowing the right information to work together.</p>',
        '<p class="hero-lead">Spaces brings the people, files, conversations, memory, goals, and connected accounts for that part of life into one continuing context.</p>',
    ),
    (
        '<p class="hero-disclosure">The current demo uses sourced public information and clearly fictional private-looking examples because real accounts, secure connectors, durable memory, and server-side permissions are still part of the planned platform.</p>',
        '<p class="hero-disclosure">The current demo uses sourced public information and clearly fictional private-looking examples. Real accounts, connected services, durable memory, and server-side permissions belong to the secure platform still being built.</p>',
    ),
    ('<span>Spaces</span>\n              <strong>Your controlled context</strong>', '<span>Spaces</span>\n              <strong>Your current context</strong>'),
    ('<div class="hero-system-node node-spaces"><span>Spaces</span><strong>Who can use what</strong></div>', '<div class="hero-system-node node-spaces"><span>Context</span><strong>Who and what belongs</strong></div>'),
    (
        '<p class="section-intro">The product has one simple job: help a person or group understand the current situation, protect the right boundaries, and move the right thing forward.</p>',
        '<p class="section-intro">Spaces helps a person or group open the right context, understand what changed, protect the right boundaries, and move the next useful thing forward.</p>',
    ),
    (
        '<p>Most digital tools understand only one slice of your life: the calendar knows your time, email holds your messages, task managers track assignments, and an AI chat knows only the context placed into that conversation.</p>\n            <p>Spaces creates a stable layer above those tools. It organizes authorized information into Spaces, keeps useful memory with sources and correction controls, connects current reality to goals, and produces a focused Brief with actions that remain under human control.</p>',
        '<p>Most digital tools understand one slice of your life. A calendar knows time, email holds messages, task managers track assignments, and a new AI chat usually starts with whatever you explain again.</p>\n            <p>Spaces begins with the part of life you are working in. The people, documents, conversations, memory, goals, deadlines, and connected accounts for that Space are already organized, so you can continue without rebuilding the context.</p>\n            <p>Chat remains available when it helps, alongside Brief, Documents, Research, Projects, Memory, Tasks, Calendar, Files, and Notes. Every module works from the same approved context.</p>',
    ),
    ('<h3>The AI can change while your operating context remains yours</h3>', '<h3>The model can change while the Space keeps its history</h3>'),
    (
        '<p>Spaces owns the structure around the model: Spaces, permissions, memory, sources, goals, tools, approvals, and history. A default model can power the experience, while another cloud model or future local model can use the same controlled foundation.</p>',
        '<p>Spaces keeps the permissions, memory, sources, goals, tools, approvals, and history outside the model. A default model can power the experience, while another cloud model or future local model can work from the same controlled foundation.</p>',
    ),
    ('<h2 id="spacesTitle">Spaces let one system work across different people and contexts</h2>', '<h2 id="spacesTitle">Every meaningful part of life can have its own Space</h2>'),
    (
        '<p class="section-intro">A Space is a controlled environment for one part of life. It defines the people, information, memory, goals, tools, and permissions that belong together.</p>',
        '<p class="section-intro">A Space is the continuing context for one part of life. It can hold people, documents, conversations, memory, tasks, calendars, files, projects, research, decisions, history, goals, and the permissions that keep them in the right place.</p>',
    ),
    ('<h2 id="memoryTitle">Memory needs to stay organized, inspectable, and correctable</h2>', '<h2 id="memoryTitle">Memory belongs to the Space and stays under the user’s control</h2>'),
    (
        '<p class="section-intro">Useful continuity requires more than saving chat history. The system needs clear memory types, sources, dates, permissions, and revision controls.</p>',
        '<p class="section-intro">Useful continuity needs more than old chat history. Each record needs a source, date, type, Space, permission, and revision history that the user can inspect.</p>',
    ),
    ('<p class="card-label">User controls</p>', '<p class="card-label">Planned Memory &amp; Data settings</p>'),
    ('<h3>The record should change when reality changes</h3>', '<h3>Review, correct, move, export, or delete what the Space remembers</h3>'),
    ('<li>Pause future learning</li>', '<li>Pause future learning</li>\n                <li>Change a connected source’s permissions</li>\n                <li>Disconnect an account from the Space</li>'),
    ('<h2 id="aiTitle">Your chosen AI works inside a controlled operating layer.</h2>', '<h2 id="aiTitle">Use the AI model you choose inside the current Space</h2>'),
    (
        '<p class="section-intro">The model receives the context, tools, and permissions needed for the current task, while Spaces keeps the long-term product state outside the model.</p>',
        '<p class="section-intro">The model receives only the context, tools, and permissions needed for the current task. The Space keeps its long-term records, settings, and history outside the model.</p>',
    ),
    (
        '<p class="section-intro">The document separates what exists from what has been designed or planned so the product can be ambitious without overstating its current state.</p>',
        '<p class="section-intro">This section separates what exists from what has been designed or planned, so the product direction stays clear without overstating the current demo.</p>',
    ),
    (
        '<article class="architecture-layer"><span>Experience</span><strong>Brief · Goals · Spaces · Memory · Settings</strong><p>Responsive interfaces for individuals and shared groups.</p></article>',
        '<article class="architecture-layer"><span>Experience</span><strong>Brief · Documents · Projects · Research · Memory · Tasks · Calendar · Files · Settings</strong><p>Different modules, one shared Space context.</p></article>',
    ),
    ('<h2 id="faqTitle">Common questions about the product</h2>', '<h2 id="faqTitle">Common questions about Spaces</h2>'),
    ('<h2 id="finalCtaTitle">Explore the current Spaces briefing demo</h2>', '<h2 id="finalCtaTitle">Explore the current Spaces Brief demo</h2>'),
    (
        '<p>The demo is an active-development preview of the daily experience, and its interface, data structure, connections, goals, memory, and backend will continue changing as the product moves toward the full system described here.</p>',
        '<p>The demo previews the daily experience while the secure accounts, connected services, durable memory, settings, and backend continue moving toward the full product described here.</p>',
    ),
    (
        '<div><strong>Spaces</strong><span>A private operating layer built around Spaces, memory, goals, and approved action.</span></div>',
        '<div><strong>Spaces</strong><span>A context-driven workspace built around continuity, memory, clear boundaries, and useful action.</span></div>',
    ),
    ('personal-os-doc.js?v=20260805-2', 'personal-os-doc.js?v=20260806-1'),
]
for old, new in doc_replacements:
    doc = required_replace(doc, old, new, "doc/index.html")

inputs_section = '''        <section id="inputs" class="document-section" aria-labelledby="inputsTitle">
          <div class="section-heading section-heading-wide">
            <div>
              <p class="section-kicker">How the context builds</p>
              <h2 id="inputsTitle">A Space learns from connected accounts, direct input, and corrections</h2>
            </div>
            <p class="section-intro">Most of the work should happen after the user chooses what to connect and which Space can use it. Spaces asks a short question only when the answer could change the next step.</p>
          </div>

          <div class="architecture-principles">
            <article><h3>Connected accounts</h3><p>Calendar, email, files, project tools, finance, music, and other approved services can supply records within a clear read, write, sync, and Space scope.</p></article>
            <article><h3>Direct input</h3><p>A note, uploaded document, voice update, form, import, or conversation can add context without forcing the user through a long setup process.</p></article>
            <article><h3>Focused questions</h3><p>The AI can ask one clear question when a missing answer would change a recommendation, deadline, permission, or decision.</p></article>
            <article><h3>Corrections</h3><p>A direct user correction replaces a weaker guess, keeps the earlier record in revision history, and updates the next Brief.</p></article>
          </div>

          <div class="prose-callout">
            <strong>Connecting an account does not give every Space access to everything.</strong>
            <p>The user chooses the service, purpose, permission, and Space. The connection stays visible in settings and can be limited, paused, or removed.</p>
          </div>
        </section>

'''
doc = insert_before(doc, '        <section id="spaces"', inputs_section, "doc/index.html inputs")

existing_space_callout = '''          <div class="prose-callout">
            <strong>One fact may appear in several places only when the permission allows it.</strong>
            <p>A calendar event may be relevant to a personal Brief, a family plan, and a project deadline. Spaces can reference the same event across those contexts without exposing unrelated private information.</p>
          </div>
'''
expanded_space_callout = existing_space_callout + '''
          <div class="prose-callout">
            <strong>Documents become connected knowledge inside a Space.</strong>
            <p>Every document belongs to at least one Space and can relate to people, projects, decisions, meetings, research, memories, tasks, and Briefs. The relationship matters as much as the file itself.</p>
          </div>
'''
doc = required_replace(doc, existing_space_callout, expanded_space_callout, "doc/index.html document knowledge")

architecture_principles = '''          <div class="architecture-principles">
            <article><h3>Human approval</h3><p>Meaningful writes, external actions, and production changes remain approval controlled.</p></article>
            <article><h3>Structured records</h3><p>Critical facts, identities, permissions, dates, tasks, and goals belong in typed records.</p></article>
            <article><h3>Replaceable components</h3><p>Models, connectors, and interfaces can change without erasing the user’s operating context.</p></article>
            <article><h3>Visible provenance</h3><p>The product can explain the information and evidence behind a recommendation.</p></article>
          </div>
'''
cloudflare_callout = architecture_principles + '''
          <div class="prose-callout">
            <strong>Cloudflare could become infrastructure beneath Spaces.</strong>
            <p>Cloudflare OS is aimed at developers building agent runtimes, sandboxes, tools, and orchestration. Spaces is the user-facing product built around context, continuity, memory, and action. They operate at different layers, and Cloudflare could power part of the backend without changing the experience people use.</p>
            <a class="button button-secondary" href="https://os.cloudflare.app/" target="_blank" rel="noopener noreferrer">View Cloudflare OS <span aria-hidden="true">↗</span></a>
          </div>
'''
doc = required_replace(doc, architecture_principles, cloudflare_callout, "doc/index.html Cloudflare")

faq_start = doc.index('          <div class="faq-list">')
faq_end = doc.index('        </section>\n\n        <section class="final-cta"', faq_start)
faq = '''          <div class="faq-list">
            <details>
              <summary>Is Spaces an AI model?</summary>
              <p>Spaces is the product around the model. It keeps the contexts, permissions, memory, sources, goals, tools, approvals, and history that let a chosen model work inside clear limits.</p>
            </details>
            <details>
              <summary>Why is the product organized around Spaces?</summary>
              <p>Each Space keeps one part of life coherent. A Business Space can understand clients and projects, while a Family Space uses family plans and responsibilities without pulling unrelated work records into the conversation.</p>
            </details>
            <details>
              <summary>How does a Space get its information?</summary>
              <p>Information can come from connected accounts, uploaded files, notes, voice updates, forms, imports, conversations, public sources, and short questions from the AI. Every source needs a purpose, permission, and Space.</p>
            </details>
            <details>
              <summary>Can users correct what a Space remembers?</summary>
              <p>That is part of the planned Memory &amp; Data settings. Users should be able to inspect sources, correct records, move information between Spaces, remove interpretations, change connector permissions, export data, delete records, and pause future learning.</p>
            </details>
            <details>
              <summary>Can different AI models use the same Space?</summary>
              <p>Yes. The Space is designed to keep its goals, memory, permissions, and history while the user or system selects a suitable model for the task.</p>
            </details>
            <details>
              <summary>Does the current demo use real private data?</summary>
              <p>No. The public demo uses sourced public information and clearly fictional private-looking records. Real private data requires authentication, protected storage, server-side permissions, limited connector scopes, and revocable access.</p>
            </details>
            <details>
              <summary>Can Spaces help with family, relationship, or team decisions?</summary>
              <p>Spaces can organize what people stated, expose schedule or responsibility conflicts, track approved agreements, and prepare practical options. People remain responsible for the relationship and the decision.</p>
            </details>
            <details>
              <summary>What makes the alarm, music, and voice experience useful?</summary>
              <p>The routine can use the same approved context as the Brief, so music, voice, reminders, and spoken check-ins begin from the current Space instead of a blank screen.</p>
            </details>
          </div>
'''
doc = doc[:faq_start] + faq + "\n" + doc[faq_end:]

if "Personal OS" in doc:
    raise RuntimeError("doc/index.html: visible legacy product name remains")
write("doc/index.html", doc)

# Keep the document controller focused on behavior, not post-load copy mutation.
doc_js = ''''use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const tocLinks = Array.from(document.querySelectorAll('.document-toc a'));
  const sections = Array.from(document.querySelectorAll('.document-section[id]'));
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
    const progress = scrollable > 0
      ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
      : 0;
    progressBar.style.width = `${progress}%`;
  }

  function setCurrentSection(id) {
    tocLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
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

  installStylesheet('/assets/personal-os-doc-editorial.css?v=20260805-1', 'spacesEditorial');
  installStylesheet('/assets/personal-os-doc-desktop-tuning.css?v=20260805-1', 'spacesDesktopTuning');
  installStylesheet('/assets/personal-os-doc-mobile-fixes.css?v=20260805-1', 'spacesMobileFixes');
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
'''
write("assets/personal-os-doc.js", doc_js)

# Route registry
routes_path = "assets/cmx-routes.json"
registry = json.loads(read(routes_path))
registry["version"] = max(int(registry.get("version", 0)) + 1, 28)
registry["updated"] = "2026-08-06"
updates = {
    "/plans/": (
        "CMX Plans",
        "Dated private product and platform plan entries, including the Spaces context-driven workspace direction.",
    ),
    "/doc/": (
        "Spaces Product Overview",
        "Public noindex product narrative explaining Spaces as a context-driven workspace for memory, documents, tasks, calendars, people, connected accounts, clear permissions, and useful action.",
    ),
    "/brief/": (
        "Spaces Brief Demo",
        "Primary public noindex demonstration of Spaces with focused Brief views, weather, stats, memory, media, permissions, and scenario-specific workspaces.",
    ),
    "/brief-next/": (
        "Spaces Brief Staging Copy",
        "Noindex staging and rollback copy of the active Spaces Brief interface.",
    ),
}
for route in registry["routes"]:
    if route["path"] in updates:
        route["name"], route["description"] = updates[route["path"]]
write(routes_path, json.dumps(registry, ensure_ascii=False, separators=(",", ":")) + "\n")

# Current product direction
direction = '''# Spaces Product Direction

Date: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Status: Current product doctrine

## Decision

The user-facing product is named **Spaces**.

Avoid positioning it as an AI operating system, Personal OS, Life OS, Agent OS, or Intelligence OS. Those names are becoming broad infrastructure language and do not describe the experience we are building.

Spaces is a context-driven workspace and personal intelligence platform. The product begins with the part of life or work the user is entering.

## Core concept

Every meaningful context can have its own Space, including:

- Personal
- Business
- Family
- Health
- Finance
- Travel
- CMX
- Research
- Relationship
- Startup

A Space can contain documents, conversations, memory, tasks, calendars, people, files, projects, research, decisions, history, goals, and approved connected data.

The user opens the Space and continues. The product should already understand who is involved, what happened, what remains unfinished, which records matter, and where the work is going.

## Product center

Chat is one interface inside Spaces. It is not the product center.

The same context can support:

- Brief
- Documents
- Projects
- Research
- Memory
- Tasks
- Calendar
- Files
- Notes
- Conversations

Every module should use the same Space context and permission boundary.

## Brief

Brief remains a flagship experience. It brings together the current information that affects the next decision or action.

A future Brief may use approved calendar, email, deadlines, tasks, projects, documents, finances, weather, habits, health, people, conversations, and long-term goals. Its job is to help the user decide what deserves attention next.

## Documents

Every document belongs to at least one Space. Documents can connect to people, projects, decisions, meetings, research, memory, tasks, and Briefs. The relationship between records is part of the product.

## Input and learning

A Space can build context from:

- connected accounts with explicit scopes
- uploaded files and imports
- notes and forms
- voice updates
- conversations
- sourced public information
- focused questions from the AI
- direct user corrections

Most setup should happen through simple account connections and clear Space choices. The AI should ask a short question only when the answer could change a decision, permission, deadline, or next action.

## Memory and settings

Memory belongs to the Space. It needs a source, date, type, freshness state, visibility rule, and revision history.

Planned Memory & Data settings should let the user inspect, correct, move, restrict, export, or delete records; remove interpretations; change connector permissions; disconnect accounts; and pause future learning.

## Model independence

The model can change while the Space keeps its context. Models, runtimes, agent frameworks, and orchestration tools are replaceable. The durable advantage is the experience of continuing inside a Space without re-explaining everything.

## Cloudflare

Cloudflare OS is developer infrastructure for agents, runtimes, sandboxes, tools, and orchestration. Spaces is the user-facing experience for context, continuity, memory, and action.

Cloudflare could power part of the backend in the future without becoming the product itself.

Reference: https://os.cloudflare.app/

## Product test

Every feature should improve at least one of these:

- the intelligence of a Space
- the quality of its context
- continuity over time
- the user’s ability to take useful action

A feature that does none of these should be reconsidered.

## Product doctrine

The goal is to build software that wakes up with the user, understands the current state of the important parts of life, and helps each part move forward naturally.

The experience should feel like opening the current state of a Space, not starting over with an AI.
'''
write("docs/spaces-product-direction-2026-08-06.md", direction)

# Canonical documentation index
readme = '''# CMX Documentation Index

Last reconciled: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `c7674a5ff108b3b8633060ebbb821e48c7bcd537`

## Read this first

Current code, tests, workflows, route policy, and current operational documents take priority over older notes. Dated concept documents remain useful as decision history.

Use this order when starting Spaces work:

1. `docs/spaces-product-direction-2026-08-06.md`
2. `docs/2026-08-05-repository-reconciliation.md`
3. `docs/personal-os-release-safeguards.md`
4. `docs/brief-recovery-handoff.md`
5. `docs/cmx-brief-master-context.md`
6. `docs/brief-interface-validation.md`
7. `docs/brief-interface-failures.md`
8. Current source, tests, workflows, and `assets/cmx-routes.json`

## Current operational documents

| File | Purpose |
|---|---|
| `spaces-product-direction-2026-08-06.md` | Current product name, category, doctrine, input model, memory settings, and Cloudflare relationship. |
| `2026-08-05-repository-reconciliation.md` | Comparison between the August 4 notes and the August 5 repository. |
| `personal-os-release-safeguards.md` | Release gate, production smoke, accessibility, cache, parity, inventory, and documentation-freshness safeguards. The filename is retained for continuity. |
| `brief-recovery-handoff.md` | Safe continuity handoff for `/brief/`, `/brief-next/`, and `/doc/`. |
| `cmx-brief-master-context.md` | Current product, architecture, trust, and roadmap context. |
| `brief-interface-validation.md` | Active validation contract for the shipping interface. |
| `brief-interface-failures.md` | Resolved failures, remaining risks, and known constraints. |
| `concepts/brief-program-status-and-roadmap-2026-08-05.md` | Current dated snapshot from before the Spaces rename. |

## Naming contract

- The user-facing product name is **Spaces**.
- Describe it as a context-driven workspace, personal intelligence platform, or platform built around Spaces.
- Avoid AI OS, Personal OS, Life OS, Agent OS, and Intelligence OS in current user-facing copy.
- Older dated documents may preserve the former name as history.
- Legacy internal filenames, storage keys, test names, and workflow names can remain until a separate safe migration removes them.

## Current routes

- `/brief/`: public noindex Spaces Brief demo, light in the initial HTML, with manual dark mode.
- `/brief-next/`: public noindex staging and rollback copy, kept byte-for-byte aligned with `/brief/`.
- `/doc/`: public noindex Spaces product overview, light by default, without a password gate.

## Brief contract

- Every entry, reset, and Space switch returns to Today.
- `/brief/` and `/brief-next/` remain aligned unless a staging difference is documented.
- The Space selector must remain readable and operable in light and dark mode on desktop and mobile.
- The live topbar contains the soundtrack and theme controls.
- Product documentation remains available from entry and How it works.
- Scenario buttons use native button semantics with `aria-pressed`.
- Secondary text remains WCAG AA compliant.
- Spotify preparation never blocks the Brief.
- Provider limits and direct-tap fallback copy remain honest.

## Copy standard

- Write plain, direct, connected sentences.
- Keep labels, controls, metrics, and navigation concise.
- Avoid stacked slogan fragments and generated-sounding symmetry.
- Keep current, fictional, and planned capabilities clearly separated.
- Put final product wording in source files, not a runtime text-replacement layer.

## Required safeguards

Do not remove or weaken:

- `Personal OS Production Smoke`, retained as a legacy internal workflow name
- `Personal OS Release Gate`, retained as a legacy internal workflow name
- Brief and Brief Next parity enforcement
- cache-version enforcement
- demo-versus-live boundary checks
- documentation freshness checks
- Spotify lifecycle tests
- desktop and mobile Chromium accessibility workflows
- active and legacy Brief asset inventory checks

## Historical records

Older Personal OS references describe the same project before the August 6, 2026 Spaces rename. Do not rewrite dated concept files to hide that decision history.

## Documentation rules

- Record a verified commit SHA in current operational documents.
- Recheck GitHub before describing an open branch, failure, or check as current.
- Treat static browser demos as demonstrations. They do not prove a backend, authentication layer, memory service, connector, or live private data pipeline exists.
- Update this index whenever a current document is added, superseded, or archived.
'''
write("docs/README.md", readme)

master_path = "docs/cmx-brief-master-context.md"
master = read(master_path).replace("Personal OS", "Spaces")
master = master.replace("Last reconciled: **August 5, 2026**", "Last reconciled: **August 6, 2026**")
master = master.replace("Verified product baseline: `5c7eef899f3357854492e2d3918f5915eb536b6b`", "Verified product baseline: `c7674a5ff108b3b8633060ebbb821e48c7bcd537`")
authority = '\n> **August 6 naming update:** The user-facing product is now **Spaces**. Read `docs/spaces-product-direction-2026-08-06.md` first. Legacy filenames and older dated records may still use the former name until a separate cleanup can change them safely.\n'
marker = "Primary deployment: `https://db.cmxchat.com/`\n"
if authority.strip() not in master:
    master = required_replace(master, marker, marker + authority, master_path)
write(master_path, master)

# Documentation freshness recognizes the new doctrine as current.
freshness_path = "scripts/validate-docs-freshness.mjs"
freshness = read(freshness_path)
freshness = required_replace(
    freshness,
    "const currentDocs = [\n  'docs/README.md',",
    "const currentDocs = [\n  'docs/README.md',\n  'docs/spaces-product-direction-2026-08-06.md',",
    freshness_path,
)
freshness = freshness.replace("Material Personal OS product files changed", "Material Spaces product files changed")
write(freshness_path, freshness)

# Product overview smoke contract
doc_test = ''''use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Spaces document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=/);
assert.doesNotMatch(html, /data-cmx-gated-content/);
assert.doesNotMatch(html, /cmx-black-prompt-locked/);
assert.doesNotMatch(html, /cmx-gate-black-prompt\.(?:css|js)/);
assert.match(html, /<body>\s*<main>/);
assert.match(html, /meta name="referrer" content="no-referrer"/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /Public overview/);
assert.match(html, /This noindex overview contains product explanation and fictional examples/);
assert.match(html, /<title>Spaces \| Context-Driven Workspace and Daily Brief<\/title>/);
assert.doesNotMatch(html, /Personal OS/);

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.name, 'Spaces Product Overview');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false, '/doc/ must remain public and must not require a password.');
assert.match(docRoute.description, /context-driven workspace/i);

for (const id of [
  'overview',
  'model',
  'inputs',
  'spaces',
  'memory',
  'goals',
  'ritual',
  'relationships',
  'ai-layer',
  'trust',
  'status',
  'architecture',
  'scenarios',
  'faq'
]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
  assert.match(html, new RegExp(`href="#${id}"`), `Missing table-of-contents link: ${id}`);
}

const demoLinks = html.match(/href="\/brief\/"/g) || [];
assert.ok(demoLinks.length >= 3, 'Expected prominent /brief/ demo links at the top and bottom of the document.');
assert.match(html, /Concept \+ working demo/);
assert.match(html, /sourced public information and clearly fictional private-looking examples/i);
assert.match(html, /Spaces in one minute/);
assert.match(html, /Every meaningful part of life can have its own Space/);
assert.match(html, /A Space learns from connected accounts, direct input, and corrections/);
assert.match(html, /Memory belongs to the Space and stays under the user’s control/);
assert.match(html, /Planned Memory &amp; Data settings/);
assert.match(html, /The model can change while the Space keeps its history/);
assert.match(html, /Cloudflare could become infrastructure beneath Spaces/);
assert.match(html, /href="https:\/\/os\.cloudflare\.app\/"/);
assert.match(html, /Brief · Documents · Projects · Research · Memory · Tasks · Calendar · Files · Settings/);
assert.match(html, /Current reality/);

assert.doesNotMatch(html, /…/u, 'Use full sentences instead of Unicode ellipses.');
assert.doesNotMatch(html, /—/u, 'Use punctuation other than em dashes.');

const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual(duplicates, [], `Duplicate HTML ids found: ${duplicates.join(', ')}`);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(css, /@media \(max-width: 680px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media print/);

assert.match(editorialCss, /classic light refinement/i);
assert.match(editorialCss, /html\[data-theme="light"\] \.document-paper/);
assert.match(editorialCss, /font-family: inherit/);
assert.match(editorialCss, /border-radius: 32px/);
assert.match(editorialCss, /linear-gradient\(135deg, #087bd6, #5164df/);
assert.match(editorialCss, /font-size: clamp\(2\.8rem, 5\.2vw, 4\.65rem\)/);
assert.match(editorialCss, /linear-gradient\(145deg, #f5f8fc, #eef3fb\)/);
assert.match(editorialCss, /html\[data-theme="light"\] \.final-cta \.button-primary/);
assert.doesNotMatch(editorialCss, /#0f2740|#153c62|#223d78/);
assert.doesNotMatch(editorialCss, /font-family: Georgia/);
assert.match(editorialCss, /@media \(max-width: 680px\)/);
assert.match(editorialCss, /@media print/);

assert.match(js, /spaces_doc_theme_v1/);
assert.match(js, /personal_os_doc_theme_v3/);
assert.match(js, /personal-os-doc-editorial\.css/);
assert.match(js, /return getStoredTheme\(\) \|\| 'light'/);
assert.match(js, /nextTheme = theme === 'dark' \? 'dark' : 'light'/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);
assert.doesNotMatch(js, /plainCopy|MutationObserver|createTreeWalker/);

console.log('Spaces document smoke test passed.');
'''
write("tests/personal-os-doc-smoke.test.js", doc_test)

# Browser expectations and dark selector regression.
browser_path = "tests/brief-next.spec.cjs"
browser = read(browser_path).replace("Personal OS", "Spaces")
browser = browser.replace("The layout can adapt and still feel familiar", "The layout can adapt without becoming confusing")
browser = browser.replace("More information should come with more control", "More information requires more control")
dark_test = '''

test('dark Space selector remains readable on desktop and mobile', async ({ page }) => {
  await openScenario(page, 'business');
  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const styles = await page.locator('#scenarioSelect').evaluate((select) => {
    const selectStyle = getComputedStyle(select);
    const optionStyle = getComputedStyle(select.options[0]);
    return {
      color: selectStyle.color,
      backgroundColor: selectStyle.backgroundColor,
      colorScheme: selectStyle.colorScheme,
      optionColor: optionStyle.color,
      optionBackgroundColor: optionStyle.backgroundColor
    };
  });

  expect(styles.colorScheme).toContain('dark');
  expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.optionColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.optionBackgroundColor).not.toBe('rgba(0, 0, 0, 0)');

  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('#railContextTitle')).toHaveText('Team and project');
});
'''
if "dark Space selector remains readable" not in browser:
    browser = browser.rstrip() + dark_test + "\n"
write(browser_path, browser)

accessibility_path = "tests/personal-os-accessibility.spec.cjs"
accessibility = read(accessibility_path).replace("Personal OS document", "Spaces document")
write(accessibility_path, accessibility)

# Validate the visible rename in source.
visible_files = [
    "brief/index.html",
    "brief-next/index.html",
    "doc/index.html",
    "assets/brief/brief-demo-data.js",
    "assets/brief/brief-demo-experience.js",
    "assets/brief/brief-demo-explainers.js",
    "assets/brief/brief-demo-app.js",
    "assets/brief/brief-demo-media.js",
    "assets/cmx-routes.json",
]
for path in visible_files:
    if "Personal OS" in read(path):
        raise RuntimeError(f"{path}: Personal OS remains in active user-facing source")

if read("brief/index.html") != read("brief-next/index.html"):
    raise RuntimeError("Brief route parity failed after Spaces rewrite")

# Remove temporary implementation files from the final commit.
for temporary in [
    ROOT / "scripts/apply-spaces-product-release.py",
    ROOT / ".github/workflows/apply-spaces-product-release.yml",
]:
    if temporary.exists():
        temporary.unlink()
        print(f"removed {temporary.relative_to(ROOT)}")
