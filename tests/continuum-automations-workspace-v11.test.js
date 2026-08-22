const fs = require('fs');

const html = fs.readFileSync('automations/index.html', 'utf8');
const js = fs.readFileSync('assets/lab/lab-automations-workspace-v11.js', 'utf8');
const css = fs.readFileSync('assets/lab/lab-automations-workspace-v11.css', 'utf8');

function requireText(haystack, needle, label) {
  if (!haystack.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
}

requireText(html, '/assets/lab/lab-automations-workspace-v11.css?v=20260822-workspace1', 'workspace stylesheet');
requireText(html, '/assets/lab/lab-automations-workspace-v11.js?v=20260822-workspace1', 'workspace script');

requireText(js, 'v11-builder-layout', 'builder layout');
requireText(js, 'v11-stage-shell', 'vertical stage shell');
requireText(js, 'data-v11-manage', 'on-demand management navigation');
requireText(js, 'dataset.workspaceV11', 'workspace-ready marker');
requireText(js, 'cmx:v10-editor-bootstrap', 'v10 integration hook');

requireText(css, 'grid-template-columns:var(--v11-stage-width) minmax(0,1fr)', 'desktop stage/content split');
requireText(css, '.v7-editor-status', 'readiness-strip compaction');
requireText(css, '[data-v11-manage-open="true"] .v10-control-nav', 'management navigation reveal');
requireText(css, 'grid-template-columns:minmax(0,1fr) 268px', 'supporting Flow Preview column');
requireText(css, '[data-flow-preview-collapsed="true"]', 'Flow Preview collapse support');
requireText(css, '@media (max-width:1099px)', 'smaller-screen preservation');

if (html.indexOf('lab-automations-workspace-v11.js') < html.indexOf('lab-automations-control-v10-editor-bootstrap.js')) {
  throw new Error('Workspace v11 must load after Control v10 bootstrap.');
}

console.log('Continuum Automations workspace v11 contract passed.');
