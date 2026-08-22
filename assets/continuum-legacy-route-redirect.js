(() => {
  'use strict';

  const path = location.pathname.replace(/\/index\.html$/i, '/');
  const redirects = new Map([
    ['/lab/', '/control/'],
    ['/lab/automations/', '/automations/'],
    ['/lab/control/', '/control/'],
    ['/lab/directory/', '/directory/'],
    ['/lab/library/', '/library/'],
    ['/lab/email/', '/email/'],
    ['/lab/snapshot/', '/archive/continuum-lab/'],
  ]);

  const normalized = path.endsWith('/') ? path : `${path}/`;
  const target = redirects.get(normalized);
  if (!target) return;

  location.replace(`${target}${location.search}${location.hash}`);
})();
