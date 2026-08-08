(() => {
  'use strict';

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isVisible(node) {
    return Boolean(node && !node.hidden && node.getClientRects().length > 0);
  }

  function topInset() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || !isVisible(topbar)) return 18;
    const position = window.getComputedStyle(topbar).position;
    if (position !== 'sticky' && position !== 'fixed') return 18;
    const rect = topbar.getBoundingClientRect();
    return Math.max(18, Math.min(window.innerHeight * 0.45, rect.bottom + 14));
  }

  function scrollToTarget(target) {
    if (!isVisible(target)) return;
    const rect = target.getBoundingClientRect();
    const top = Math.max(0, window.scrollY + rect.top - topInset());
    window.scrollTo({
      top,
      left: 0,
      behavior: reducedMotion() ? 'auto' : 'smooth'
    });
  }

  function workspaceDetailTarget() {
    const panel = document.getElementById('workspacePanel');
    if (!panel || !isVisible(panel)) return null;

    const content = [...panel.children].find(child => {
      if (!isVisible(child)) return false;
      if (child.matches('.workspace-panel-heading, .workspace-section-progress, .workspace-related-links, .workspace-thread-links')) return false;
      return child.tagName !== 'HEADER' && child.tagName !== 'NAV';
    });

    return content || panel;
  }

  function scheduleLanding(resolveTarget) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = typeof resolveTarget === 'function' ? resolveTarget() : resolveTarget;
        scrollToTarget(target);
      });
    });
  }

  function todayTargetFor(trigger) {
    const explicit = trigger.dataset.deepTarget;
    if (explicit) return document.querySelector(explicit);

    const origin = trigger.closest('.full-section')?.id || '';
    if (origin === 'all-weather') return document.querySelector('[data-view-panel="today"] .weather-card');
    if (origin === 'all-signals') return document.querySelector('[data-view-panel="today"] .stats-panel');
    if (origin === 'all-flow') return document.querySelector('[data-view-panel="today"] .flow-card');
    if (origin === 'all-overview') return document.querySelector('[data-view-panel="today"] .hero-grid');
    return null;
  }

  function installDeepNavigation() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('button, a');
      if (!trigger) return;

      const opensWorkspaceDetail = trigger.matches([
        '[data-workspace-continue]',
        '[data-highlight-tab]',
        '[data-full-workspace-tab]',
        '[data-workspace-tab]',
        '[data-workspace-tab-step]',
        '#priorityReview',
        '[data-go-view="workspace"]'
      ].join(','));

      if (opensWorkspaceDetail) {
        scheduleLanding(workspaceDetailTarget);
        return;
      }

      if (trigger.matches('[data-go-view="today"]')) {
        const target = todayTargetFor(trigger);
        if (target) scheduleLanding(() => todayTargetFor(trigger));
        return;
      }

      if (trigger.matches('[data-go-view="spaces"]')) {
        scheduleLanding(() => document.querySelector('[data-view-panel="spaces"] .space-overview'));
        return;
      }

      if (trigger.matches('[data-go-view="how"]')) {
        scheduleLanding(() => document.querySelector('[data-view-panel="how"] .foundation-map'));
      }
    }, true);
  }

  installDeepNavigation();
})();
