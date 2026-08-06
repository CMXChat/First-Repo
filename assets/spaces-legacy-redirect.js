'use strict';

(() => {
  const target = new URL('/spaces/', window.location.origin);
  target.search = window.location.search;
  target.hash = window.location.hash;
  window.location.replace(target.href);
})();
