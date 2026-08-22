(() => {
  'use strict';

  const VERSION = '2026-08-22.3';
  const ROUTE = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const SUPPORTED = new Set(['/control/', '/directory/', '/library/', '/automations/', '/email/']);
  if (!SUPPORTED.has(ROUTE)) return;

  const DOMAIN = Object.freeze({
    '/control/': {
      label: 'FRONTEND STATUS',
      tone: 'blue',
      title: 'Control is a mixed protected-history and preview interface.',
      summary: 'The frontend has a read-only protected history/receipt lane where the backend contract is available, while Now, Upcoming, attention and simulation panels remain sample product UI.',
      facts: [
        ['WIRED', 'Protected execution-history / receipt projection'],
        ['WIRED', 'Exact links to Directory and Library objects'],
        ['PREVIEW', 'Now · Upcoming · attention · simulation panels'],
        ['BACKEND', 'Implementation and deployment truth lives in jay-app'],
      ],
    },
    '/directory/': {
      label: 'FRONTEND STATUS',
      tone: 'blue',
      title: 'Directory has a protected identity lane plus richer preview concepts.',
      summary: 'The frontend can use protected Person and email-contact operations where available. Organizations, Groups and richer relationship concepts remain browser/product previews until matching server contracts are available.',
      facts: [
        ['WIRED', 'Protected Person / email-contact frontend lane'],
        ['WIRED', 'Stable-ID navigation with ?person_id='],
        ['PREVIEW', 'Organizations · Groups · richer relationships'],
        ['BACKEND', 'Availability and implementation truth lives in jay-app'],
      ],
    },
    '/library/': {
      label: 'FRONTEND STATUS',
      tone: 'blue',
      title: 'Library separates protected content from local preview workspace concepts.',
      summary: 'The frontend has a protected content/version lane where the backend contract is available. Mixed-media, files, folders and import experiences remain explicitly separate preview behavior unless backed by a protected contract.',
      facts: [
        ['WIRED', 'Protected content / draft / version frontend lane'],
        ['WIRED', 'Revision-conflict and immutable-version presentation'],
        ['PREVIEW', 'Mixed media · files · folders · imports'],
        ['BACKEND', 'Schema and deployment truth lives in jay-app'],
      ],
    },
    '/automations/': {
      label: 'FRONTEND STATUS',
      tone: 'blue',
      title: 'Automations has a server-backed lane and a richer preview builder.',
      summary: 'The frontend can call protected Automation lifecycle/history contracts while retaining richer workflow-builder concepts as explicit preview behavior. Missing backend availability must be shown honestly rather than replaced with local server truth.',
      facts: [
        ['WIRED', 'Protected Automation lifecycle frontend lane'],
        ['WIRED', 'Protected execution-history projection where available'],
        ['PREVIEW', 'Richer workflow / Planner / advanced-flow concepts'],
        ['BACKEND', 'Runtime and Authority implementation truth lives in jay-app'],
      ],
    },
    '/email/': {
      label: 'FRONTEND STATUS',
      tone: 'blue',
      title: 'Email is a protected manual proving interface.',
      summary: 'The frontend coordinates protected recipient, sender, content, Automation and receipt requests through backend APIs where available. Provider implementation and release truth are intentionally not duplicated in this repository.',
      facts: [
        ['WIRED', 'Protected manual Email frontend orchestration'],
        ['WIRED', 'Typed receipt handoff to Control'],
        ['FRONTEND', 'Browser never speaks SMTP directly'],
        ['BACKEND', 'Provider and deployment truth lives in jay-app'],
      ],
    },
  });

  const data = DOMAIN[ROUTE];
  if (!data) return;

  function addStyle() {
    if (document.querySelector('link[data-continuum-source-truth]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/continuum-source-truth-v1.css?v=20260822-1';
    link.dataset.continuumSourceTruth = 'style';
    document.head.appendChild(link);
  }

  function canonicalizeLinks() {
    const routes = new Map([
      ['/lab/', '/directory/'],
      ['/lab/control/', '/control/'],
      ['/lab/automations/', '/automations/'],
      ['/lab/directory/', '/directory/'],
      ['/lab/library/', '/library/'],
      ['/lab/email/', '/email/'],
    ]);
    document.querySelectorAll('a[href]').forEach(link => {
      const current = link.getAttribute('href');
      const next = routes.get(current);
      if (next) link.setAttribute('href', next);
    });
  }

  function makeBadge() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cst-badge';
    button.dataset.cstOpen = 'true';
    button.dataset.tone = data.tone;
    button.setAttribute('aria-haspopup', 'dialog');
    button.innerHTML = `<span class="cst-dot"></span><span>${data.label}</span><b>FRONTEND</b>`;
    return button;
  }

  function installBadge() {
    if (document.querySelector('[data-cst-open]')) return true;
    const badge = makeBadge();
    const host = ROUTE === '/control/' ? document.querySelector('.cc-topbar')
      : ROUTE === '/directory/' ? document.querySelector('.dir-topbar')
      : ROUTE === '/library/' ? document.querySelector('.lib-topbar')
      : ROUTE === '/email/' ? document.querySelector('.email-topbar-right')
      : document.querySelector('.v3-app-top, .v3-topbar, .v3-app-header, .v3-header, .v3-brand')?.parentElement;
    if (!host) return false;

    if (ROUTE === '/control/') host.insertBefore(badge, host.querySelector('.cc-time'));
    else if (ROUTE === '/directory/') host.insertBefore(badge, host.querySelector('.dir-theme'));
    else if (ROUTE === '/library/') host.insertBefore(badge, host.querySelector('.lib-theme'));
    else if (ROUTE === '/email/') host.prepend(badge);
    else host.appendChild(badge);
    return true;
  }

  function patchControl() {
    const eyebrow = document.querySelector('.cc-eyebrow');
    if (eyebrow) eyebrow.innerHTML = '<span class="cc-lab-dot"></span> Continuum · Proving';
    const label = document.querySelector('.cc-now-label');
    if (label) label.textContent = 'Frontend workspace';
    const heading = document.getElementById('nowHeading');
    if (heading) heading.textContent = 'Protected history where available. Sample operations remain preview.';
    const copy = document.querySelector('.cc-now-copy > p');
    if (copy) copy.textContent = 'Control combines a protected read-only execution-history lane with sample operational panels. Backend release and implementation status are owned by jay-app, not this page.';
    const chips = document.querySelectorAll('.cc-now-meta .cc-chip');
    if (chips[0]) chips[0].innerHTML = '<i></i> history lane wired';
    if (chips[1]) chips[1].innerHTML = '<i></i> sample panels preview';
    if (chips[2]) chips[2].innerHTML = '<i></i> backend truth in jay-app';
    const autonomySmall = document.querySelector('.cc-autonomy-copy small');
    const autonomyStrong = document.querySelector('.cc-autonomy-copy strong');
    if (autonomySmall) autonomySmall.textContent = 'Authority · backend-owned';
    if (autonomyStrong) autonomyStrong.textContent = 'Frontend never decides permission';

    document.querySelectorAll('.cc-rail-link span').forEach(node => {
      if (node.textContent.includes('Directory · LAB')) node.textContent = 'Directory · PROVING';
      if (node.textContent.includes('Automations · LAB')) node.textContent = 'Automations · PROVING';
    });

    const sampleKicker = document.querySelector('#attentionHeading')?.closest('.cc-panel')?.querySelector('.cc-panel-kicker');
    if (sampleKicker) sampleKicker.textContent = 'Sample operational preview';
  }

  function patchDirectory() {
    const eyebrow = document.querySelector('.dir-eyebrow');
    if (eyebrow) eyebrow.innerHTML = '<span></span> Continuum · Proving';
    const kicker = document.querySelector('.dir-workspace-head .dir-kicker');
    if (kicker) kicker.textContent = 'Protected People · frontend wired';
    const copy = document.querySelector('.dir-workspace-head p');
    if (copy) copy.textContent = 'People and email-contact UI is wired to protected backend contracts where available. Organizations, Groups and richer relationship concepts remain local previews. Backend status lives in jay-app.';
    document.querySelectorAll('.dir-rail-link span').forEach(node => {
      if (node.textContent.includes('Automations · LAB')) node.textContent = 'Automations · PROVING';
      if (node.textContent.includes('Library · PREVIEW')) node.textContent = 'Library · PROVING';
    });
  }

  function patchLibrary() {
    const eyebrow = document.querySelector('.lib-eyebrow');
    if (eyebrow) eyebrow.innerHTML = '<span></span> Continuum · Proving';
    const kicker = document.getElementById('contextKicker');
    if (kicker && /browser-local|sample data/i.test(kicker.textContent)) kicker.textContent = 'Browser-local future concepts below the protected content lane';
    const storageTitle = document.querySelector('.lib-storage-note strong');
    const storageCopy = document.querySelector('.lib-storage-note small');
    if (storageTitle) storageTitle.textContent = 'LOCAL PREVIEW STORAGE';
    if (storageCopy) storageCopy.textContent = 'Only the preview workspace uses browser storage. Protected content requests use the backend contract where available and must never fall back to this local store.';
    const boundary = document.querySelector('.lib-boundary');
    if (boundary) boundary.innerHTML = '<b>LIBRARY · PROVING</b> — Canonical /library/ has a protected content/version frontend lane plus explicitly local preview concepts. Backend schema and deployment truth live in jay-app.';
    document.querySelectorAll('.lib-rail-link span').forEach(node => {
      if (node.textContent.includes('Directory · LAB')) node.textContent = 'Directory · PROVING';
      if (node.textContent.includes('Library · LAB')) node.textContent = 'Library · PROVING';
      if (node.textContent.includes('Automations · LAB')) node.textContent = 'Automations · PROVING';
    });
  }

  function patchAutomations() {
    const boundary = document.querySelector('.v3-lab-pill');
    if (boundary) boundary.innerHTML = '<i></i> PROVING · SERVER LANE WIRED · LOCAL PREVIEW';
    const hero = document.querySelector('.v7-workspace-head p, .v3-dashboard .v3-hero p');
    if (hero) hero.textContent = 'Build and inspect Automation definitions. The protected server lane is wired where available; richer workflow concepts remain preview. Backend implementation and deployment truth live in jay-app.';
  }

  function patchEmail() {
    const eyebrow = document.querySelector('.email-title .eyebrow');
    if (eyebrow) eyebrow.textContent = 'CONTINUUM · PROVING · MANUAL EMAIL';
    const summary = document.querySelector('.email-title p');
    if (summary) summary.textContent = 'Compose, review and request one exact message through the protected backend contract where available. Provider implementation and deployment truth live in jay-app.';
    const small = document.querySelector('.backend-summary small');
    if (small) small.textContent = 'Protected frontend transport · session · Origin · CSRF';
  }

  function patchRoute() {
    canonicalizeLinks();
    if (ROUTE === '/control/') patchControl();
    if (ROUTE === '/directory/') patchDirectory();
    if (ROUTE === '/library/') patchLibrary();
    if (ROUTE === '/automations/') patchAutomations();
    if (ROUTE === '/email/') patchEmail();
    document.documentElement.dataset.continuumSourceTruth = 'v1';
    document.documentElement.dataset.continuumSourceTruthVersion = VERSION;
  }

  function modalMarkup() {
    const facts = data.facts.map(([status, text]) => `<li><span>${status}</span><strong>${text}</strong></li>`).join('');
    return `<div class="cst-backdrop" data-cst-close="true" hidden>
      <section class="cst-dialog" role="dialog" aria-modal="true" aria-labelledby="cstTitle" tabindex="-1">
        <header><div><span>CONTINUUM · FRONTEND STATUS</span><h2 id="cstTitle">${data.title}</h2></div><button type="button" data-cst-close="true" aria-label="Close frontend status">×</button></header>
        <p>${data.summary}</p>
        <ul class="cst-facts">${facts}</ul>
        <section class="cst-checkpoint">
          <div><span>BACKEND AUTHORITY</span><strong>CMXChat/jay-app</strong></div>
          <p>Backend releases, migrations, PR/task state, Runtime/Authority internals, provider behavior and deployment status are intentionally not duplicated in First-Repo.</p>
        </section>
        <div class="cst-boundary"><b>Frontend boundary</b><span>This dialog describes browser wiring and preview behavior only. Actual API responses and jay-app documentation are authoritative for backend availability.</span></div>
        <footer><span>Frontend snapshot · Aug 22, 2026</span><a href="/doc/">Read Continuum overview</a></footer>
      </section>
    </div>`;
  }

  let lastFocus = null;

  function ensureModal() {
    if (document.querySelector('.cst-backdrop')) return document.querySelector('.cst-backdrop');
    document.body.insertAdjacentHTML('beforeend', modalMarkup());
    return document.querySelector('.cst-backdrop');
  }

  function openModal(trigger) {
    const layer = ensureModal();
    lastFocus = trigger || document.activeElement;
    layer.hidden = false;
    document.body.classList.add('cst-open');
    layer.querySelector('.cst-dialog')?.focus();
  }

  function closeModal() {
    const layer = document.querySelector('.cst-backdrop');
    if (!layer || layer.hidden) return;
    layer.hidden = true;
    document.body.classList.remove('cst-open');
    if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
  }

  function bind() {
    document.addEventListener('click', event => {
      const open = event.target.closest('[data-cst-open]');
      if (open) {
        event.preventDefault();
        openModal(open);
        return;
      }
      const close = event.target.closest('[data-cst-close]');
      if (close && (close === event.target || close.tagName === 'BUTTON')) closeModal();
    }, true);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.querySelector('.cst-backdrop')?.hidden) closeModal();
    });
  }

  function boot() {
    addStyle();
    patchRoute();
    bind();
    ensureModal();
    if (!installBadge() && ROUTE === '/automations/') {
      const app = document.getElementById('automationApp');
      if (app) {
        const observer = new MutationObserver(() => {
          patchRoute();
          if (installBadge()) observer.disconnect();
        });
        observer.observe(app, { childList: true, subtree: true });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();