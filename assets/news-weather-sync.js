(() => {
  'use strict';

  const daily = window.CMX_DAILY_WEATHER;
  const brief = window.CMX_NEWS_BRIEF;
  if (!daily || !brief) return;

  brief.weather = [daily.brooklyn, daily.waikato].filter(Boolean);
})();
