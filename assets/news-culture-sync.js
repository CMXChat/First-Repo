(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF;
  const daily = window.CMX_DAILY_CULTURE;
  if (!brief || !daily || !Array.isArray(daily.items)) return;

  brief.culture = daily.items.filter(item => item && item.title && item.text);
})();
