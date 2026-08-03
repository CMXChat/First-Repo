(() => {
  'use strict';

  const prefix = 'cmxBriefDemo:experience:';
  const migrationKey = `${prefix}virgoPairDefault:v1`;
  const leftKey = `${prefix}sign:coupleLeftSign`;
  const rightKey = `${prefix}sign:coupleRightSign`;

  const compatibility = 'Two Virgos may notice every detail at once today. The strongest move is to choose one shared priority, say what needs to be clearer, and avoid turning care into criticism. Precision works best when both people leave room for warmth.';

  const horoscopes = window.BRIEF_LIVE_DATA?.horoscopes;
  if (horoscopes) {
    horoscopes.compatibility = compatibility;
    horoscopes.defaultCoupleSigns = ['virgo', 'virgo'];
  }

  const migrated = localStorage.getItem(migrationKey) === 'true';
  const savedRight = localStorage.getItem(rightKey);

  if (!migrated || savedRight === 'pisces') {
    localStorage.setItem(leftKey, 'virgo');
    localStorage.setItem(rightKey, 'virgo');
    localStorage.setItem(migrationKey, 'true');
  } else {
    if (!localStorage.getItem(leftKey)) localStorage.setItem(leftKey, 'virgo');
    if (!localStorage.getItem(rightKey)) localStorage.setItem(rightKey, 'virgo');
  }

  function updateCoupleLabel() {
    const heading = document.querySelector('.compatibility-card h4');
    if (heading && heading.textContent !== 'Virgo + Virgo example') {
      heading.textContent = 'Virgo + Virgo example';
    }
  }

  window.addEventListener('brief:preset-change', () => window.setTimeout(updateCoupleLabel, 140));
  document.addEventListener('DOMContentLoaded', () => window.setTimeout(updateCoupleLabel, 500), { once: true });

  const stage = document.getElementById('scenarioStage');
  if (stage) {
    new MutationObserver(updateCoupleLabel).observe(stage, { childList: true, subtree: true });
  }
})();
