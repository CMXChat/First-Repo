(() => {
  'use strict';

  function syncWeatherView() {
    const personal = window.BRIEF_APP?.getPreset?.() === 'individual';
    const scenarioWeather = document.getElementById('weather');
    const weatherLink = [...document.querySelectorAll('.section-nav a')].find(link => link.getAttribute('href') === '#weather' || link.dataset.liveWeatherLink === 'true');

    if (scenarioWeather) scenarioWeather.hidden = personal;
    if (weatherLink) {
      weatherLink.dataset.liveWeatherLink = 'true';
      weatherLink.href = personal ? '#livePublicLayer' : '#weather';
      weatherLink.textContent = personal ? 'Live weather' : 'Weather';
    }
  }

  function init() {
    if (!window.BRIEF_APP) return;
    syncWeatherView();
    window.addEventListener('brief:preset-change', () => window.setTimeout(syncWeatherView, 80));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
})();
