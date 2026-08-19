'use strict';

(() => {
  const actions = document.querySelector('.continuum-hero .hero-actions');
  if (!actions || actions.querySelector('.continuum-automation-lab-top')) return;

  const link = document.createElement('a');
  link.className = 'button button-secondary continuum-automation-lab-top';
  link.href = '/lab/automations/';
  link.innerHTML = '<span>Automation Lab</span><small class="continuum-inline-status">LAB</small>';
  link.setAttribute('aria-label', 'Open Automation Lab, LAB');
  actions.append(link);

  document.documentElement.dataset.continuumTopRoutes = 'ready';
})();
