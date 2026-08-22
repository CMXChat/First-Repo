'use strict';

const fs = require('node:fs');

const truth = fs.readFileSync('assets/continuum-source-truth-v1.js', 'utf8');
const css = fs.readFileSync('assets/continuum-source-truth-v1.css', 'utf8');
const control = fs.readFileSync('assets/lab/control-center-theme-init.js', 'utf8');
const directory = fs.readFileSync('assets/lab/directory-theme-init.js', 'utf8');
const library = fs.readFileSync('assets/lab/library-theme-init.js', 'utf8');
const automations = fs.readFileSync('assets/lab/lab-automations-theme-init.js', 'utf8');
const email = fs.readFileSync('assets/lab/lab-email-api-v1.js', 'utf8');

function requireText(haystack, needle, label) {
  if (!haystack.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
}

for (const route of ['/control/', '/directory/', '/library/', '/automations/', '/email/']) {
  requireText(truth, `'${route}'`, `${route} source-truth registration`);
}

for (const loader of [control, directory, automations, email]) {
  requireText(loader, '/assets/continuum-source-truth-v1.js?v=20260822-1', 'shared source-truth loader');
  requireText(loader, 'dataset.continuumSourceTruth', 'shared source-truth marker');
}
requireText(library, '/assets/continuum-source-truth-v1.js?v=20260822-2', 'Library source-truth cache revision');
requireText(library, 'dataset.continuumSourceTruth', 'Library source-truth marker');

requireText(truth, 'PR ${SNAPSHOT.backendPr} · T001–T006 complete', 'completed trigger-consumption checkpoint');
requireText(truth, '170 backend tests · 89% coverage', 'backend validation truth');
requireText(truth, 'c0d1e2f3a4b5', 'migration truth');
requireText(truth, 'not merged, migrated or deployed', 'production boundary');
requireText(truth, 'FAKE ONLY', 'unattended fake-only boundary');
requireText(truth, 'MANUAL ONLY', 'manual SMTP boundary');
requireText(truth, "['/lab/control/', '/control/']", 'Control canonical route');
requireText(truth, "['/lab/automations/', '/automations/']", 'Automations canonical route');
requireText(truth, "['/lab/directory/', '/directory/']", 'Directory canonical route');
requireText(truth, "['/lab/library/', '/library/']", 'Library canonical route');
requireText(truth, 'Sample operational preview', 'Control sample-state separation');
requireText(truth, 'LOCAL PREVIEW STORAGE', 'Library local-preview separation');
requireText(truth, 'protected ContentAsset / ContentDraft / ContentVersion lane', 'Library protected-lane truth');
requireText(css, '.cst-badge', 'source-truth badge styling');
requireText(css, '.cst-dialog', 'source-truth dialog styling');
requireText(css, '.cst-boundary', 'production-boundary styling');

if (/Directory[^\n]{0,80}PRODUCTION LIVE/i.test(truth)) throw new Error('Directory source truth must not claim production live.');
if (/Library[^\n]{0,80}PRODUCTION LIVE/i.test(truth)) throw new Error('Library source truth must not claim production live.');
if (/Automations[^\n]{0,80}PRODUCTION LIVE/i.test(truth)) throw new Error('Automations source truth must not claim production live.');

console.log('Continuum cross-surface source-truth contract passed.');
