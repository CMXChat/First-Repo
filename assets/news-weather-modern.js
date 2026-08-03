(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const root = document.getElementById('weatherCards');
  const weatherItems = Array.isArray(brief.weather) ? brief.weather.filter(Boolean) : [];
  if (!root || !weatherItems.length) return;

  const escapeHtml = value => {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };

  const state = { cityIndex: 0, view: 'hourly', hourIndex: 0 };

  function unit(item) {
    return String(item.unit || (item.audience === 'crystal' ? 'C' : 'F'));
  }

  function degree(value, item) {
    return `${escapeHtml(value)}°${escapeHtml(unit(item))}`;
  }

  function sourceLinks(item) {
    return (Array.isArray(item.sources) ? item.sources : [])
      .filter(source => /^https:\/\//.test(String(source?.url || '')))
      .map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label || 'Open forecast')}</a>`)
      .join('');
  }

  function metric(label, value) {
    return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  function hourlyMarkup(item) {
    const values = Array.isArray(item.hourly) ? item.hourly : [];
    return values.map((hour, index) => `
      <button class="news-weather-hour ${index === state.hourIndex ? 'is-active' : ''}" type="button" data-weather-hour="${index}">
        <span>${escapeHtml(hour.time)}</span>
        <i aria-hidden="true"></i>
        <strong>${escapeHtml(hour.temp)}°</strong>
        <small>${escapeHtml(hour.condition)}</small>
      </button>
    `).join('');
  }

  function outlookMarkup(item) {
    const values = Array.isArray(item.outlook) ? item.outlook : [];
    return values.map(day => `
      <article class="news-weather-day">
        <span>${escapeHtml(day.day)}</span>
        <strong>${escapeHtml(day.high)}°</strong>
        <small>${escapeHtml(day.low)}° · ${escapeHtml(day.rain)}% rain</small>
        <em>${escapeHtml(day.condition)}</em>
      </article>
    `).join('');
  }

  function render() {
    const item = weatherItems[state.cityIndex] || weatherItems[0];
    const selectedHour = (Array.isArray(item.hourly) ? item.hourly[state.hourIndex] : null) || null;
    const displayTemp = selectedHour?.temp ?? item.temperature ?? item.high ?? '--';
    const displayCondition = selectedHour?.condition || item.condition || item.title || 'Forecast';
    const displayNote = selectedHour
      ? `${selectedHour.note || item.advice || item.text || ''} · ${selectedHour.rain ?? item.rain ?? '--'}% rain · ${selectedHour.wind || item.wind || 'light wind'}`
      : item.advice || item.text || '';

    root.className = 'news-weather-experience';
    root.style.setProperty('--weather-accent', item.audience === 'crystal' ? 'var(--crystal)' : 'var(--jay)');
    root.innerHTML = `
      <div class="news-weather-city-switcher" role="tablist" aria-label="Weather locations">
        ${weatherItems.map((city, index) => `
          <button type="button" role="tab" aria-selected="${index === state.cityIndex}" data-weather-city="${index}">
            <span>${escapeHtml(city.shortLabel || city.label || city.location)}</span>
            <small>${escapeHtml(city.period || '')}</small>
          </button>
        `).join('')}
      </div>

      <article class="news-weather-stage weather-${escapeHtml(item.visual || 'mixed')} audience-${escapeHtml(item.audience || 'shared')}">
        <div class="news-weather-art" aria-hidden="true">
          <div class="news-weather-orb"></div>
          <div class="news-weather-cloud cloud-a"></div>
          <div class="news-weather-cloud cloud-b"></div>
          <div class="news-weather-stars"></div>
        </div>

        <div class="news-weather-primary">
          <div class="news-weather-topline">
            <span class="content-status status-forecast">${escapeHtml(item.status || 'FORECAST')}</span>
            <span>${escapeHtml(item.location || item.label)}</span>
          </div>
          <strong class="news-weather-temperature">${degree(displayTemp, item)}</strong>
          <h3>${escapeHtml(displayCondition)}</h3>
          <p>${escapeHtml(displayNote)}</p>
          <div class="news-weather-best-window"><span>Best useful window</span><strong>${escapeHtml(item.bestWindow || 'Check the hourly view')}</strong></div>
        </div>

        <div class="news-weather-metrics">
          ${metric('Feels like', degree(item.feelsLike ?? displayTemp, item))}
          ${metric('High / low', `${item.high ?? '--'}° / ${item.low ?? '--'}°`)}
          ${metric('Rain', `${item.rain ?? '--'}%`)}
          ${metric('Wind', item.wind || '--')}
          ${metric('Sunset', item.sunset || '--')}
        </div>
      </article>

      <div class="news-weather-viewbar" role="tablist" aria-label="Forecast views">
        <button type="button" role="tab" aria-selected="${state.view === 'hourly'}" data-weather-view="hourly">Hourly</button>
        <button type="button" role="tab" aria-selected="${state.view === 'outlook'}" data-weather-view="outlook">Outlook</button>
      </div>

      <div class="news-weather-strip ${state.view === 'hourly' ? '' : 'is-hidden'}" data-weather-panel="hourly">
        ${hourlyMarkup(item)}
      </div>
      <div class="news-weather-outlook ${state.view === 'outlook' ? '' : 'is-hidden'}" data-weather-panel="outlook">
        ${outlookMarkup(item)}
      </div>

      <div class="news-weather-practical">
        <div>
          <p class="path-label">practical read</p>
          <h3>${escapeHtml(item.title || 'Weather plan')}</h3>
          <p>${escapeHtml(item.text || '')}</p>
        </div>
        <ul>${(Array.isArray(item.items) ? item.items : []).map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>
      </div>

      <div class="news-weather-sources">${sourceLinks(item)}</div>
    `;

    root.querySelectorAll('[data-weather-city]').forEach(button => {
      button.addEventListener('click', () => {
        state.cityIndex = Number(button.dataset.weatherCity);
        state.hourIndex = 0;
        render();
      });
    });

    root.querySelectorAll('[data-weather-view]').forEach(button => {
      button.addEventListener('click', () => {
        state.view = button.dataset.weatherView === 'outlook' ? 'outlook' : 'hourly';
        render();
      });
    });

    root.querySelectorAll('[data-weather-hour]').forEach(button => {
      button.addEventListener('click', () => {
        state.hourIndex = Number(button.dataset.weatherHour);
        render();
      });
    });
  }

  render();
})();
