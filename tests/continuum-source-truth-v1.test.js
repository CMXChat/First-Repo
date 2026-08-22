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
  requireText(truth, `'${route}'`, `${route} frontend-status registration`);
}

for (const loader of [control, directory, automations, email]) {
  requireText(loader, '/assets/continuum-source-truth-v1.js?v=20260822-1', 'shared frontend-status loader');
  requireText(loader, 'dataset.continuumSourceTruth', 'shared frontend-status marker');
}
requireText(library, '/assets/continuum-source-truth-v1.js?v=20260822-2', 'Library frontend-status cache revision');
requireText(library, 'dataset.continuumSourceTruth', 'Library frontend-status marker');

requireText(truth, 'CONTINUUM · FRONTEND STATUS', 'frontend-only status dialog');
requireText(truth, 'CMXChat/jay-app', 'backend authority pointer');
requireText(truth, 'Backend releases, migrations, PR/task state', 'backend duplication boundary');
requireText(truth, 'WIRED', 'wired frontend status');
requireText(truth, 'PREVIEW', 'preview frontend status');
requireText(truth, "['/lab/control/', '/control/']", 'Control canonical route');
requireText(truth, "['/lab/automations/', '/automations/']", 'Automations canonical route');
requireText(truth, "['/lab/directory/', '/directory/']", 'Directory canonical route');
requireText(truth, "['/lab/library/', '/library/']", 'Library canonical route');
requireText(truth, 'Sample operational preview', 'Control sample-state separation');
requireText(truth, 'LOCAL PREVIEW STORAGE', 'Library local-preview separation');
requireText(truth, 'protected content/version frontend lane', 'Library protected-lane truth');
requireText(css, '.cst-badge', 'frontend-status badge styling');
requireText(css, '.cst-dialog', 'frontend-status dialog styling');
requireText(css, '.cst-boundary', 'frontend-boundary styling');

for (const forbidden of ['c0d1e2f3a4b5', '170 backend tests', '89% coverage', 'PR ${SNAPSHOT.backendPr}', 'T001–T006 complete']) {
  if (truth.includes(forbidden)) throw new Error(`Frontend status must not duplicate backend checkpoint detail: ${forbidden}`);
}

console.log('Continuum cross-surface frontend-status contract passed.');