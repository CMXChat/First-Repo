(() => {
  'use strict';

  const root = document.documentElement;
  const tolerance = 2;
  const deadline = performance.now() + 12000;
  let seeded = false;

  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const box = (node) => {
    if (!node) return null;
    const r = node.getBoundingClientRect();
    return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
  };
  const visible = (node) => {
    if (!node) return false;
    const style = getComputedStyle(node);
    const r = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && r.width > 0 && r.height > 0;
  };
  const intersects = (a, b) => {
    const x = box(a); const y = box(b);
    if (!x || !y) return false;
    return x.left < y.right - .5 && x.right > y.left + .5 && x.top < y.bottom - .5 && x.bottom > y.top + .5;
  };
  const insideViewport = (node) => {
    const r = box(node);
    return Boolean(r && r.left >= -tolerance && r.right <= innerWidth + tolerance);
  };
  const inside = (child, parent) => {
    const c = box(child); const p = box(parent);
    return Boolean(c && p && c.left >= p.left - tolerance && c.right <= p.right + tolerance);
  };

  function ready() {
    return Boolean(
      q('.v3-dashboard[data-operations-v7="ready"] .v7-workspace-head [data-new]') &&
      q('.v4-workspace-nav.v7-workspace-nav') &&
      q('.v7-operations-bar') &&
      q('.v7-planner-button') &&
      q('.v7-manage-button') &&
      q('.v3-dashboard-bar .v3-tabs') &&
      q('.v10-card-shell')
    );
  }

  function seedLongRepresentativeCard() {
    if (seeded) return;
    seeded = true;
    const card = q('.v10-card-shell .v3-automation-card');
    if (!card) return;
    const title = q('.v3-card-head strong', card);
    const description = q(':scope > p', card);
    const flowLabels = qa('.v3-mini-flow b', card);
    if (title) title.textContent = 'Continuity escalation for an unusually long protected workflow name that must wrap on a phone';
    if (description) description.textContent = 'A deliberately long acceptance description verifies that representative Automation card content wraps naturally instead of forcing the mobile document wider than the viewport.';
    if (flowLabels[0]) flowLabels[0].textContent = 'Grace begins after a deliberately long protected trigger description';
    if (flowLabels[1]) flowLabels[1].textContent = 'Continue only when a deliberately long rule description remains true';
    if (flowLabels[2]) flowLabels[2].textContent = 'Notify a protected continuity contact with a deliberately long display label';
  }

  function measure() {
    const issues = [];
    const mobile = innerWidth <= 760;
    const need = (selector, label, scope = document) => {
      const node = q(selector, scope);
      if (!visible(node)) issues.push(`${label} missing or not visible`);
      return node;
    };
    const requireInsideViewport = (node, label) => {
      if (node && !insideViewport(node)) issues.push(`${label} exceeds viewport`);
    };
    const requireChildrenInsideViewport = (nodes, label) => nodes.forEach((node, index) => {
      if (!insideViewport(node)) issues.push(`${label} ${index + 1} exceeds viewport`);
    });

    const heading = need('.v7-workspace-head h1', 'workspace heading');
    const create = need('.v7-workspace-head [data-new]', 'create control');
    requireInsideViewport(heading, 'workspace heading');
    requireInsideViewport(create, 'create control');
    if (heading && create && intersects(heading, create)) issues.push('workspace heading intersects create control');
    if (create && !create.textContent.toLowerCase().includes('new automation')) issues.push('create control lost New automation semantics');
    if (mobile && create && parseFloat(getComputedStyle(create).fontSize) < 9) issues.push('create control text is visually collapsed');
    if (mobile && create && box(create).height < 40) issues.push('create control touch target is too short');
    const createAfter = create ? getComputedStyle(create, '::after').content : 'none';
    if (mobile && create && !['none', 'normal', '""'].includes(createAfter)) issues.push('create control still depends on icon-only pseudo content');

    const topbar = need('.v3-topbar', 'top app header');
    const brand = need('.v3-topbar .v3-brand', 'Continuum brand');
    const topActions = need('.v3-topbar .v3-top-actions', 'top header actions');
    const labPill = need('.v3-topbar .v3-lab-pill', 'Lab execution status');
    const theme = need('.v3-topbar .v3-theme', 'theme control');
    [topbar, brand, topActions, labPill, theme].forEach((node, index) => requireInsideViewport(node, ['top app header','Continuum brand','top header actions','Lab status','theme control'][index]));
    if (brand && topActions && intersects(brand, topActions)) issues.push('Continuum brand intersects top header actions');
    if (labPill && theme && intersects(labPill, theme)) issues.push('Lab status intersects theme control');
    if (mobile && theme && (box(theme).width < 40 || box(theme).height < 40)) issues.push('theme control is not touch friendly');

    const workspaceTabs = need('.v4-workspace-tabs', 'primary workspace tabs');
    const workspaceButtons = workspaceTabs ? qa('button', workspaceTabs) : [];
    if (workspaceButtons.length !== 3) issues.push('expected three primary workspace tabs');
    requireChildrenInsideViewport(workspaceButtons, 'primary workspace tab');
    if (workspaceButtons.length && !workspaceButtons.some((button) => button.classList.contains('is-active'))) issues.push('primary workspace tabs lost active state');
    const runsButton = workspaceButtons.find((button) => button.textContent.includes('Runs'));
    const preview = runsButton?.querySelector('small');
    if (preview && !inside(preview, runsButton)) issues.push('PREVIEW badge exceeds Runs tab');
    if (mobile) workspaceButtons.forEach((button) => { if (box(button).height < 40) issues.push('primary workspace tab touch target is too short'); });

    const tools = need('.v4-workspace-tools', 'search and capabilities tools');
    const search = need('.v4-workspace-tools .v4-search', 'Search Automations');
    const capabilities = need('.v4-workspace-tools .v4-catalog-button', 'Capabilities control');
    [tools, search, capabilities].forEach((node, index) => requireInsideViewport(node, ['search/capabilities tools','Search Automations','Capabilities control'][index]));
    if (search && capabilities && intersects(search, capabilities)) issues.push('Search Automations intersects Capabilities control');

    const summary = need('.v7-ops-summary', 'summary counters');
    const counters = summary ? [...summary.children] : [];
    if (counters.length !== 4) issues.push('expected four summary counters');
    requireChildrenInsideViewport(counters, 'summary counter');
    for (let i = 0; i < counters.length; i++) for (let j = i + 1; j < counters.length; j++) {
      if (intersects(counters[i], counters[j])) issues.push('summary counters overlap');
    }

    const opsActions = need('.v7-ops-actions', 'filter and management controls');
    const filter = need('.v7-filter-group', 'Automation filters');
    const filterButtons = filter ? qa('button', filter) : [];
    const planner = need('.v7-planner-button', 'Planner control');
    const manage = need('.v7-manage-button', 'Manage control');
    [opsActions, filter, planner, manage].forEach((node, index) => requireInsideViewport(node, ['filter/management controls','Automation filters','Planner control','Manage control'][index]));
    requireChildrenInsideViewport(filterButtons, 'Automation filter');
    if (filterButtons.length !== 4) issues.push('expected four Automation filters');
    if (filterButtons.length && !filterButtons.some((button) => button.classList.contains('is-active'))) issues.push('Automation filters lost active state');
    if (mobile) [...filterButtons, planner, manage].filter(Boolean).forEach((button) => { if (box(button).height < 40) issues.push('filter/management touch target is too short'); });

    const lifecycleTabs = need('.v3-dashboard-bar .v3-tabs', 'Draft Published Archived segment');
    const lifecycleButtons = lifecycleTabs ? qa('button', lifecycleTabs) : [];
    if (lifecycleButtons.length !== 3) issues.push('expected Draft Published Archived controls');
    requireChildrenInsideViewport(lifecycleButtons, 'lifecycle segment');
    if (lifecycleButtons.length && !lifecycleButtons.some((button) => button.classList.contains('is-active'))) issues.push('lifecycle segment lost active state');

    const shell = need('.v10-card-shell', 'representative Automation card shell');
    const card = shell ? need('.v3-automation-card', 'representative Automation card', shell) : null;
    const menu = shell ? need('.v10-card-menu-button', 'Automation object menu', shell) : null;
    const title = card ? need('.v3-card-head strong', 'Automation card title', card) : null;
    [shell, card, menu].forEach((node, index) => requireInsideViewport(node, ['Automation card shell','Automation card','Automation object menu'][index]));
    if (title && menu && intersects(title, menu)) issues.push('Automation card title intersects object menu');
    if (card) {
      ['.v3-card-head','.v7-card-meta','.v3-mini-flow','.v3-card-foot'].forEach((selector) => {
        const node = q(selector, card);
        if (node && !inside(node, card)) issues.push(`${selector} exceeds representative card`);
      });
      qa('.v7-card-meta>span,.v3-mini-flow>span', card).forEach((node) => {
        if (!inside(node, card)) issues.push('card pill/flow content exceeds representative card');
      });
    }

    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    if (documentWidth > innerWidth + tolerance) issues.push(`document horizontal overflow: ${documentWidth} > ${innerWidth}`);

    [
      ['top app header', topbar],
      ['primary workspace tabs', workspaceTabs],
      ['search/capabilities tools', tools],
      ['summary counters', summary],
      ['Automation filters', filter],
      ['Draft Published Archived segment', lifecycleTabs],
      ['representative Automation card', card],
    ].forEach(([label, node]) => {
      if (mobile && node && node.scrollWidth > node.clientWidth + tolerance) issues.push(`${label} has unintended horizontal overflow`);
    });

    root.dataset.mobileAcceptance = issues.length ? 'fail' : 'pass';
    root.dataset.mobileAcceptanceWidth = String(innerWidth);
    root.dataset.mobileAcceptanceHeight = String(innerHeight);
    root.dataset.mobileAcceptanceDocumentWidth = String(documentWidth);
    root.dataset.mobileAcceptanceHeadingCreateOverlap = String(Boolean(heading && create && intersects(heading, create)));
    root.dataset.mobileAcceptanceIssues = issues.join(' | ');
  }

  function start() {
    if (!ready()) {
      if (performance.now() >= deadline) {
        root.dataset.mobileAcceptance = 'fail';
        root.dataset.mobileAcceptanceWidth = String(innerWidth);
        root.dataset.mobileAcceptanceIssues = 'dashboard controls did not become ready before probe deadline';
        return;
      }
      requestAnimationFrame(start);
      return;
    }
    seedLongRepresentativeCard();
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }

  requestAnimationFrame(start);
})();
