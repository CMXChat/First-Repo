'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const index = read('lab/automations/index.html');
const api = read('assets/lab/lab-automations-api-v1.js');
const server = read('assets/lab/lab-automations-server-v1.js');
const lifecycle = read('assets/lab/lab-automations-server-lifecycle-v1.js');
const runtime = read('assets/lab/lab-automations-server-runtime-v1.js');

const has = (source, needle, message) => assert.ok(source.includes(needle), message);
const lacks = (source, needle, message) => assert.ok(!source.includes(needle), message);

// Existing route and load order remain the integration surface.
has(index, '/assets/lab/lab-automations-control-v10.js', 'accepted v10 control surface must remain loaded');
has(index, '/assets/lab/lab-automations-api-v1.js', 'thin server transport must load');
has(index, '/assets/lab/lab-automations-server-v1.js', 'server state controller must load');
has(index, '/assets/lab/lab-automations-server-lifecycle-v1.js', 'lifecycle controller must load');
has(index, '/assets/lab/lab-automations-server-runtime-v1.js', 'Runtime controller must load');
assert.ok(index.indexOf('lab-automations-control-v10.js') < index.indexOf('lab-automations-server-v1.js'), 'server integration must enhance the accepted Automations surface');
has(index, "connect-src 'self' https://*.cmxchat.com http://localhost:8000", 'CSP must permit protected CMX API and local development only');

// Transport stays intentionally thin and protected.
has(api, 'credentials: "include"', 'protected cookies are required');
has(api, '/checkin/operator/session', 'mutations must read protected operator session for CSRF');
has(api, 'headers["X-CSRF-Token"] = await csrfToken()', 'mutations must send X-CSRF-Token');
lacks(api, 'localStorage', 'transport must not persist domain state');
lacks(api, 'getContent:', 'unused convenience API must not widen the disposable transport');
[
  'listAutomations', 'createAutomation', 'getAutomation', 'updateDraft', 'preflight', 'review', 'publish', 'archive',
  'listPeople', 'listContacts', 'listConnections', 'listSenders', 'listLibrary', 'saveContentVersion',
  'listRuns', 'getRun', 'requestRun', 'processRun', 'cancelRun',
].forEach((method) => has(api, `${method}:`, `transport must expose only used operation ${method}`));

// Stable Automation identity and explicit LOCAL LAB separation.
has(server, 'data-server-automation="${esc(item.id)}"', 'server card identity must use backend automation_id');
has(server, 'No local Automation record is created.', 'server creation must not create a local canonical copy');
has(server, 'No browser-local Automation is being substituted for server truth.', 'auth/API failure must not fall back to local persistence');
has(server, 'cmx-lab-automations-v1', 'UI must explain the remaining local-store boundary');
lacks(server, 'localStorage.setItem("cmx-lab-automations-v1"', 'server Automation must never be written to local Automation storage');
lacks(lifecycle, 'localStorage', 'lifecycle/version controller must not persist canonical state locally');
lacks(runtime, 'localStorage', 'Runtime controller must not persist canonical state locally');

// Existing seven-section object model and WHEN → IF → DO → WAIT → TEST remain intact.
has(server, 'const SECTIONS = ["overview", "definition", "runs", "permissions", "related", "history", "settings"]', 'all seven Automation object sections must remain');
['WHEN', 'IF', 'DO', 'WAIT', 'TEST'].forEach((label) => has(server, `short: "${label}"`, `${label} stage must remain`));
has(server, 'data-server-move-up', 'server action reordering up must remain');
has(server, 'data-server-move-down', 'server action reordering down must remain');
has(server, 'data-server-duplicate-action', 'server action duplication must remain');
has(server, 'data-server-remove-action', 'server action removal must remain');

// Directory/Connection/Library selectors use protected stable IDs, never labels as identity.
has(server, 'PERSON · stable person_id', 'Person selector must expose stable person_id');
has(server, 'EMAIL CONTACT · stable contact_method_id', 'ContactMethod selector must expose stable contact_method_id');
has(server, 'data-field="recipient_person_id"', 'Draft must store recipient_person_id');
has(server, 'data-field="recipient_contact_method_id"', 'Draft must store recipient_contact_method_id');
has(server, 'data-field="connection_id"', 'Draft must store connection_id');
has(server, 'data-field="sender_identity_id"', 'Draft must store sender_identity_id');
has(server, 'data-field="content_asset_id"', 'Draft must store content_asset_id');
has(server, 'valueKey = "id"', 'selector canonical values must default to stable IDs');
has(server, 'state.resources.contacts = new Map()', 'resource reload must clear prior ContactMethod projection before protected reads');
has(server, 'await API.listContacts(person.id)', 'ContactMethod selector reads must stay protected and explicit');
has(server, 'await API.listSenders(connection.id)', 'SenderIdentity selector reads must stay protected and explicit');
lacks(server, 'API.listContacts(person.id).catch(() => [])', 'ContactMethod request failure must not become a false empty selector');
lacks(server, 'API.listSenders(connection.id).catch(() => [])', 'SenderIdentity request failure must not become a false empty selector');
has(server, 'No empty selector result is being treated as confirmed server absence.', 'selector failure must be explained truthfully');

// Progressive Draft, optimistic concurrency and truthful stale/write failure behavior.
has(server, 'An incomplete Draft is still editable and saveable.', 'incomplete Draft must remain editable/saveable');
has(server, 'expected_revision: revision', 'Draft save must send expected_revision');
has(server, 'error?.status === 409', 'stale-write HTTP 409 must be handled explicitly');
has(server, 'state.pendingDefinition = nextDefinition', 'conflicting local edit must be retained for truthful conflict state');
has(server, 'Draft changed elsewhere.', 'stale-write message must be visible');
has(server, 'Reload server Draft', 'stale conflict must require explicit server reload');
has(server, 'Draft save failed.', 'non-409 save failures must never render as Saved');
has(server, 'state.saveStatus === "error"', 'save-error state must have explicit presentation');
has(server, 'inert aria-busy="true"', 'definition mutations must be blocked while one Draft save is in flight');
has(server, 'definition.conditions = []', 'unsupported Conditions must remain empty instead of inventing backend support');
has(server, 'unattended Runtime is not enabled by this Lab', 'unattended execution must not be presented as available');
lacks(server, 'Backend preflight, Review and Publish are added in the next checkpoint.', 'TEST copy must describe current integration instead of stale checkpoint plans');

// Backend preflight is authoritative only when a backend result exists.
has(lifecycle, 'API.preflight(id)', 'backend preflight endpoint must be called');
has(lifecycle, 'preflightError: preflightResult.error', 'preflight transport failure must remain distinct from typed backend blockers');
has(lifecycle, 'BACKEND PREFLIGHT · AUTHORITATIVE', 'real backend preflight must be labeled authoritative');
has(lifecycle, 'BACKEND PREFLIGHT · UNAVAILABLE', 'failed preflight reads must render unavailable instead of synthetic backend blocker');
has(lifecycle, 'Review and Publish stay disabled until preflight can be read.', 'unavailable preflight must fail closed in the UI');
has(lifecycle, 'issue.code', 'typed issue code must be retained');
has(lifecycle, 'issue.description', 'typed issue description must be rendered');
has(lifecycle, 'issue.step_id', 'typed issue step metadata must be retained');
has(lifecycle, 'issue.resource_type', 'typed issue resource type must be retained');
has(lifecycle, 'issue.resource_id', 'typed issue resource ID must be retained');
has(lifecycle, 'if (currentId() !== id) return;', 'late lifecycle responses must not patch a different Automation');
lacks(lifecycle, 'CMXAutomationOperationsV7', 'local readiness engine must not override server preflight');

// Review, publication and immutable Version presentation are real backend operations.
has(lifecycle, 'API.review(id)', 'Review must use protected backend operation');
has(lifecycle, 'API.publish(id)', 'Publish must use protected backend operation');
has(lifecycle, 'PUBLISHED RECEIPT · READ ONLY', 'published AutomationVersion must render read-only');
has(lifecycle, 'Later Draft changes do not mutate this Version.', 'immutable Version semantics must be explicit');
has(lifecycle, 'AutomationVersion ID', 'AutomationVersion stable ID must be visible');
has(lifecycle, 'ContentVersion', 'frozen ContentVersion must be visible');
has(lifecycle, 'content_version_id', 'exact frozen content_version_id must be presented');
has(lifecycle, 'Fake-provider UI only', 'provider presentation must stay scoped to the current frontend instead of racing later backend work');

// Runtime request/list/read/process/cancel are all real protected API paths.
has(runtime, 'API.listRuns(id)', 'Run history must come from backend');
has(runtime, 'API.getRun(id, selectedRunId)', 'Run detail must come from backend');
has(runtime, 'API.requestRun(automationId', 'manual Run must use backend request');
has(runtime, 'API.processRun(automationId, runId', 'fake work processing must use backend operation');
has(runtime, 'API.cancelRun(automationId, runId)', 'pending Run cancellation must use backend operation');

// Current supported fake-provider scenarios remain visible and truthful.
['accepted', 'transient_once', 'permanent_failure'].forEach((behavior) => has(runtime, `value="${behavior}"`, `fake behavior ${behavior} must remain selectable`));
has(runtime, 'run.attempts', 'attempt list must render');
has(runtime, 'attempt.outcome', 'attempt outcome must render');
has(runtime, 'attempt.retryable', 'retryability must render');
has(runtime, 'attempt.worker_id', 'worker identity must render');
has(runtime, 'run.lease_owner', 'lease owner must render where available');
has(runtime, 'run.events', 'Why/RuntimeEvent history must render');
has(runtime, 'run.status === "pending"', 'pending state must gate process/cancel controls');
has(runtime, 'Cancel pending Run', 'cancellation state/control must remain visible');
has(runtime, 'FROZEN EXECUTION SNAPSHOT', 'Run must expose frozen execution references');
has(runtime, 'state.dataUnavailable = true', 'failed Runtime reload must explicitly mark server history unavailable');
has(runtime, 'state.runs = []', 'failed Runtime reload must clear stale Run list state');
has(runtime, 'No cached Runtime history is being presented as current.', 'Runtime failure must not display stale history as current');
has(runtime, 'root()?.dataset.serverEditor !== id', 'late Runtime loads must not patch a different Automation');

// Unsupported Runtime controls must remain disabled until endpoints exist.
has(runtime, '<button disabled>Pause · no endpoint</button>', 'Pause must stay disabled');
has(runtime, '<button disabled>Resume · no endpoint</button>', 'Resume must stay disabled');
has(runtime, '<button disabled>Retry failed step · no endpoint</button>', 'Retry failed step must stay disabled');
has(runtime, 'No local simulation fallback.', 'Runtime API failure must not create fake authoritative history');

console.log('Continuum Automations real-backend integration source contract passed.');
