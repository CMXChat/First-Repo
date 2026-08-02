(() => {
  'use strict';
  const source = `/assets/daily-song.js?cb=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  document.write(`<script src="${source}"><\/script>`);
})();
