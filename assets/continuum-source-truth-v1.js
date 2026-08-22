(() => {
  'use strict';

  const VERSION = '2026-08-22.1';
  const ROUTE = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const SUPPORTED = new Set(['/control/', '/directory/', '/library/', '/automations/', '/email/']);
  if (!SUPPORTED.has(ROUTE)) return;

  const SNAPSHOT = Object.freeze({
    asOf: 'Aug 22, 2026',
    backendPr: '#24',
    backendHead: '753e55e',
    migration: 'c0d1e2f3a4b5',
    validation: '170 backend tests · 89% coverage · mypy / ty / Ruff / OpenAPI client green',
    production: 'Production still runs the older Phase 1 boundary. The stacked backend source below is not merged, migrated or deployed.',
  });

  const DOMAIN = Object.freeze({
    '/control/': {
      label: 'BUILD STATE',
      tone: 'blue',
      title: 'Source stack validated. Production deployment still pending.',
      summary: 'Check In is live today. Directory, Library, Automations, Runtime, Email, reconciliation, exact Authority and durable Check In trigger consumption are implemented and validated in stacked backend source. PR #24 T001–T006 is complete, but that stack is not production-deployed.',
      facts: [
        ['LIVE', 'Check In + protected operator foundation'],
        ['SOURCE BUILT', 'Directory · Library · Automations · Runtime · Email'],
        ['SOURCE BUILT', 'Reconciliation · Authority · durable trigger consumption'],
        ['FAKE ONLY', 'Unattended triggered execution through exact Authority'],
        ['PENDING', 'Merge · production migration · backend deployment'],
      ],
    },
    '/directory/': {
      label: 'DIRECTORY SOURCE',
      tone: 'blue',
      title: 'Protected People persistence is built in source.',
      summary: 'Stable Person and email ContactMethod APIs, lifecycle rules, protected session handling and frontend wiring are implemented. Organizations, Groups and richer relationship concepts remain preview concepts. The stacked Directory backend is not production-deployed yet.',
      facts: [
        ['BUILT', 'Person stable IDs + lifecycle'],
        ['BUILT', 'Email ContactMethod + normalization/conflict rules'],
        ['WIRED', 'Canonical /directory/ protected frontend lane'],
        ['PREVIEW', 'Organizations · Groups · richer relationships'],
        ['PENDING', 'Production backend deployment'],
      ],
    },
    '/library/': {
      label: 'LIBRARY SOURCE',
      tone: 'blue',
      title: 'Durable content versions are built in source.',
      summary: 'The backend model already owns ContentAsset → mutable ContentDraft → immutable ContentVersion, protected revision conflicts and Library references used by published Automations. This static Library surface is still a browser preview until the stacked backend is deployed and connected here.',
      facts: [
        ['BUILT', 'ContentAsset + mutable ContentDraft'],
        ['BUILT', 'Immutable ContentVersion + exact references'],
        ['BUILT', 'Protected revision / conflict semantics'],
        ['PREVIEW', 'Current browser Library workspace'],
        ['PENDING', 'Production persistence + binary object storage'],
      ],
    },
    '/automations/': {
      label: 'AUTOMATIONS SOURCE',
      tone: 'blue',
      title: 'Definition, Runtime and triggered fake execution are built in source.',
      summary: 'Protected Automation Drafts, typed preflight, Review, immutable Publish, Runtime Runs, Attempts, Why and cancellation are implemented. PR #24 now adds durable occurrence/consumption history plus a separately invoked fake-only consumer that rechecks exact Authority before using the same frozen Runtime. Production execution remains off.',
      facts: [
        ['BUILT', 'Draft → preflight → Review → immutable AutomationVersion'],
        ['BUILT', 'Runtime Runs · Attempts · Why · cancellation'],
        ['BUILT', 'TriggerOccurrence · Consumption · leases · recovery'],
        ['FAKE ONLY', 'Exact Authority → existing Runtime unattended proof'],
        ['PENDING', 'Production backend deployment'],
      ],
    },
    '/email/': {
      label: 'EMAIL SOURCE',
      tone: 'blue',
      title: 'The exact manual Email path is implemented in stacked source.',
      summary: 'Recipient identity, sender readiness, frozen content, Automation publication, Runtime, receipts and provider reconciliation are all defined behind the protected backend boundary. Fake mode is the preferred proof. Real SMTP remains tightly bounded to direct manual owner initiation only and is not part of unattended Authority.',
      facts: [
        ['BUILT', 'Person → ContactMethod → Connection → SenderIdentity'],
        ['BUILT', 'ContentVersion → AutomationVersion → Runtime receipt'],
        ['BUILT', 'Provider reconciliation without resend'],
        ['MANUAL ONLY', 'Bounded real SMTP'],
        ['PENDING', 'Production backend deployment'],
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
    button.innerHTML = `<span class="cst-dot"></span><span>${data.label}</span><b>NOT DEPLOYED</b>`;
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
    if (label) label.textContent = 'Current build state';
    const heading = document.getElementById('nowHeading');
    if (heading) heading.textContent = 'Validated source. Deployment is the next boundary.';
    const copy = document.querySelector('.cc-now-copy > p');
    if (copy) copy.textContent = 'Check In is live. The broader Continuum backend stack now includes durable Directory, Library, Automations, Runtime, Email, reconciliation, exact Authority and crash-safe trigger consumption in validated source. Those stacked services are not production-deployed yet.';
    const chips = document.querySelectorAll('.cc-now-meta .cc-chip');
    if (chips[0]) chips[0].innerHTML = '<i></i> Check In live';
    if (chips[1]) chips[1].innerHTML = '<i></i> backend stack validated';
    if (chips[2]) chips[2].innerHTML = '<i></i> deployment pending';
    const autonomySmall = document.querySelector('.cc-autonomy-copy small');
    const autonomyStrong = document.querySelector('.cc-autonomy-copy strong');
    if (autonomySmall) autonomySmall.textContent = 'Authority · source proof';
    if (autonomyStrong) autonomyStrong.textContent = 'Exact fake-only trigger path proven';

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
    if (kicker) kicker.textContent = 'Protected People · backend source built';
    const copy = document.querySelector('.dir-workspace-head p');
    if (copy) copy.textContent = 'People and email ContactMethods are wired to protected backend contracts. Organizations, Groups and richer relationship concepts remain local previews. The stacked backend is validated but not production-deployed yet.';
    document.querySelectorAll('.dir-rail-link span').forEach(node => {
      if (node.textContent.includes('Automations · LAB')) node.textContent = 'Automations · PROVING';
      if (node.textContent.includes('Library · PREVIEW')) node.textContent = 'Library · PROVING';
    });
  }

  function patchLibrary() {
    const eyebrow = document.querySelector('.lib-eyebrow');
    if (eyebrow) eyebrow.innerHTML = '<span></span> Continuum · Proving';
    const kicker = document.getElementById('contextKicker');
    if (kicker && /sample data/i.test(kicker.textContent)) kicker.textContent = 'Protected information · browser preview over built backend model';
    const storageTitle = document.querySelector('.lib-storage-note strong');
    const storageCopy = document.querySelector('.lib-storage-note small');
    if (storageTitle) storageTitle.textContent = 'LOCAL PREVIEW STORAGE';
    if (storageCopy) storageCopy.textContent = 'This page still stores preview content in this browser. The real ContentAsset → Draft → immutable Version backend model is implemented in stacked source but not deployed here yet.';
    const boundary = document.querySelector('.lib-boundary');
    if (boundary) boundary.innerHTML = '<b>LIBRARY · PROVING</b> — The protected ContentAsset / ContentDraft / ContentVersion backend exists in stacked source. This static surface still uses browser-local preview data until the backend stack is deliberately merged, migrated and deployed.';
    document.querySelectorAll('.lib-rail-link span').forEach(node => {
      if (node.textContent.includes('Directory · LAB')) node.textContent = 'Directory · PROVING';
      if (node.textContent.includes('Library · LAB')) node.textContent = 'Library · PROVING';
      if (node.textContent.includes('Automations · LAB')) node.textContent = 'Automations · PROVING';
    });
  }

  function patchAutomations() {
    const boundary = document.querySelector('.v3-lab-pill');
    if (boundary) boundary.innerHTML = '<i></i> PROVING · BACKEND SOURCE BUILT · PROD OFF';
    const hero = document.querySelector('.v7-workspace-head p, .v3-dashboard .v3-hero p');
    if (hero) hero.textContent = 'Build and inspect Automation definitions. Protected Draft/Publish/Runtime and fake-only triggered execution are validated in stacked backend source; production deployment remains off.';
  }

  function patchEmail() {
    const eyebrow = document.querySelector('.email-title .eyebrow');
    if (eyebrow) eyebrow.textContent = 'CONTINUUM · PROVING · MANUAL EMAIL';
    const summary = document.querySelector('.email-title p');
    if (summary) summary.textContent = 'Compose, freeze, review and run one exact message through the protected backend contract. The full stacked backend is validated in source but not production-deployed yet.';
    const small = document.querySelector('.backend-summary small');
    if (small) small.textContent = 'Protected session · Origin · CSRF · stacked source validated';
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
        <header><div><span>CONTINUUM · SOURCE TRUTH</span><h2 id="cstTitle">${data.title}</h2></div><button type="button" data-cst-close="true" aria-label="Close build status">×</button></header>
        <p>${data.summary}</p>
        <ul class="cst-facts">${facts}</ul>
        <section class="cst-checkpoint">
          <div><span>BACKEND CHECKPOINT</span><strong>jay-app PR ${SNAPSHOT.backendPr} · T001–T006 complete</strong></div>
          <dl>
            <div><dt>Head</dt><dd>${SNAPSHOT.backendHead}</dd></div>
            <div><dt>Migration</dt><dd>${SNAPSHOT.migration}</dd></div>
            <div><dt>Validation</dt><dd>${SNAPSHOT.validation}</dd></div>
          </dl>
        </section>
        <div class="cst-boundary"><b>Production boundary</b><span>${SNAPSHOT.production}</span></div>
        <footer><span>Source snapshot · ${SNAPSHOT.asOf}</span><a href="/doc/">Read Continuum overview</a></footer>
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
