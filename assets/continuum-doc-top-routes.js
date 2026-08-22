'use strict';

(() => {
  const actions = document.querySelector('.continuum-hero .hero-actions');
  if (!actions || actions.querySelector('.continuum-automation-lab-top')) return;

  const link = document.createElement('a');
  link.className = 'button button-secondary continuum-automation-lab-top';
  link.href = '/automations/';
  link.innerHTML = '<span>Automations</span><small class="continuum-inline-status">PROVING</small>';
  link.setAttribute('aria-label', 'Open Continuum Automations, proving');
  actions.append(link);

  document.documentElement.dataset.continuumTopRoutes = 'ready';
})();
