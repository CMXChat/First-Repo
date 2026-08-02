(() => {
  'use strict';

  function applyDailyGateCopy() {
    const gate = document.getElementById('cmx-sensitive-gate');
    const copy = gate?.querySelector('.cmx-gate-copy');
    if (!gate || !copy) return;

    const song = window.CMX_DAILY_SONG || {};
    const mood = String(song.loginMood || 'hopeful, honest, and still building.').trim();

    copy.textContent = 'Welcome to today’s brief. This private space belongs to Jay and Crystal.';

    gate.querySelector('.cmx-gate-mood')?.remove();
    if (!mood) return;

    const moodLine = document.createElement('p');
    moodLine.className = 'cmx-gate-copy cmx-gate-mood';
    moodLine.textContent = `Today’s mood: ${mood}`;
    copy.insertAdjacentElement('afterend', moodLine);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDailyGateCopy, { once: true });
  } else {
    applyDailyGateCopy();
  }
})();
