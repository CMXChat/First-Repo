const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('directory/index.html', 'utf8');
const shared = fs.readFileSync('assets/continuum-operator-api-v1.js', 'utf8');
const transport = fs.readFileSync('assets/lab/directory-api-v1.js', 'utf8');
const session = fs.readFileSync('assets/lab/directory-session-v2.js', 'utf8');
const sessionCss = fs.readFileSync('assets/lab/directory-session-v2.css', 'utf8');
const bridge = fs.readFileSync('assets/lab/directory-server-proof-v1.js', 'utf8');

assert(index.includes('/assets/lab/directory-app-v1.js'), 'existing Directory app must stay loaded');
assert(index.includes('/assets/continuum-operator-api-v1.js'), 'Directory must load the shared protected operator API');
assert(index.includes('/assets/lab/directory-api-v1.js'), 'Directory adapter must load');
assert(index.includes('/assets/lab/directory-session-v2.js'), 'Directory session UX must load');
assert(index.includes('/assets/lab/directory-server-proof-v1.js'), 'server proof bridge must load');
assert(index.indexOf('/assets/continuum-operator-api-v1.js') < index.indexOf('/assets/lab/directory-api-v1.js'), 'shared operator API must load before Directory adapter');
assert(index.indexOf('/assets/lab/directory-api-v1.js') < index.indexOf('/assets/lab/directory-server-proof-v1.js'), 'Directory adapter must load before server projection');
assert(index.includes("connect-src 'self' https://*.cmxchat.com http://localhost:8000"), 'Directory CSP must allow protected CMX API and local backend development');

assert(index.includes('id="directoryServerAccess"'), 'Directory must show protected backend state');
assert(index.includes('id="directoryUnlockForm"'), 'Directory must support inline operator unlock');
assert(index.includes('id="directorySessionLogout"'), 'Directory must support ending the protected session');
assert(!index.includes('href="/lab/control/"'), 'Directory navigation must use canonical Control route');
assert(!index.includes('href="/lab/automations/"'), 'Directory navigation must use canonical Automations route');
assert(index.includes('href="/control/"'), 'Directory must link to canonical Control');
assert(index.includes('href="/automations/"'), 'Directory must link to canonical Automations');

assert(shared.includes('credentials: "include"'), 'shared operator API must use protected cookies');
assert(shared.includes('X-CSRF-Token'), 'shared operator API must send CSRF on protected mutations');
assert(shared.includes('async function unlock(operatorKey)'), 'shared operator API must own operator unlock');
assert(shared.includes('async function logout()'), 'shared operator API must own protected logout');
assert(shared.includes('updatePerson:'), 'shared operator API must expose Person update');
assert(shared.includes('setContactLifecycle:'), 'shared operator API must expose ContactMethod lifecycle update');
assert(!shared.includes('localStorage'), 'shared operator API must not persist protected session/domain truth locally');
assert(!shared.includes('sessionStorage'), 'shared operator API must not persist protected session/domain truth in sessionStorage');

assert(transport.includes('window.CMXOperatorApi'), 'Directory transport must delegate to shared operator API');
assert(transport.includes('shared.listPeople()'), 'Directory transport must use shared Person reads');
assert(transport.includes('shared.createPerson({ display_name: displayName })'), 'Directory Person create must stay typed');
assert(transport.includes('shared.updatePerson(personId, patch)'), 'Directory Person edits must use shared protected mutation');
assert(transport.includes("shared.createContact(personId, { channel: 'email', address })"), 'Directory email create must stay typed');
assert(transport.includes('shared.setContactLifecycle(contactId, lifecycle)'), 'Directory contact lifecycle must use shared protected mutation');
assert(!transport.includes('fetch('), 'Directory adapter must not create a second HTTP transport');
assert(!transport.includes('localStorage'), 'Directory adapter must not persist domain state locally');
assert(!transport.includes('/organizations'), 'Directory adapter must not invent Organization backend support');
assert(!transport.includes('/groups'), 'Directory adapter must not invent Group backend support');

assert(session.includes('api.session({ refresh: true })'), 'Directory session UX must verify the backend session');
assert(session.includes('await api.unlock(key)'), 'Directory unlock must call the shared backend unlock');
assert(session.includes("els.key.value = ''"), 'operator key must be cleared immediately from the input');
assert(session.includes('await api.logout()'), 'Directory session UX must use protected logout');
assert(session.includes("api.classify(error)"), 'Directory session UX must classify backend failures consistently');
assert(!session.includes('localStorage'), 'Directory session UX must not persist operator/session secrets');
assert(!session.includes('sessionStorage'), 'Directory session UX must not persist operator/session secrets');
assert(sessionCss.includes('.dir-server-access'), 'Directory session panel must have dedicated styling');
assert(sessionCss.includes('@media(max-width:760px)'), 'Directory session panel must have mobile styling');

assert(bridge.includes('data-server-person'), 'People rows must bind to backend Person IDs');
assert(bridge.includes('state.selectedId = created.id'), 'created Person identity must come from backend response');
assert(bridge.includes('Email saved · ${created.id}'), 'created ContactMethod identity must come from backend response');
assert(bridge.includes("display_name:String(form.get('displayName')"), 'Person edits must patch only supported display_name');
assert(bridge.includes("contact.lifecycle === 'active' ? 'disabled' : 'active'"), 'ContactMethod disable/reactivate must use backend lifecycle');
assert(bridge.includes('Backend 409/422'), 'duplicate/validation policy must remain backend-owned');
assert(bridge.includes('contactErrors: new Map()'), 'ContactMethod fetch errors must remain distinct from a real empty list');
assert(bridge.includes('state.contacts.delete(personId)'), 'failed ContactMethod reads must not preserve stale contact rows as current');
assert(bridge.includes('No empty server result is being inferred from this failed request.'), 'failed ContactMethod reads must render unavailable, not no-email');
assert(!bridge.includes('state.contacts.set(personId, []);'), 'ContactMethod request failure must never become a canonical empty list');
assert(!bridge.includes('localStorage.setItem'), 'server-backed Person/ContactMethod bridge must not write canonical domain state to localStorage');
assert(!bridge.includes('cmx-lab-crm-v1'), 'server-backed bridge must not read the legacy Directory store');
assert(bridge.includes('Organizations, Groups'), 'unsupported Directory concepts must remain explicitly local/unintegrated');
assert(bridge.includes('SERVER-BACKED Automations may reference those stable IDs'), 'Automations may truthfully consume stable Directory IDs');
assert(bridge.includes('does not fabricate reverse usage history or dependencies'), 'Directory Automations tab must avoid invented dependency data');

console.log('Continuum Directory shared-session protected persistence contract passed at /directory/.');
