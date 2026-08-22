const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('directory/index.html', 'utf8');
const transport = fs.readFileSync('assets/lab/directory-api-v1.js', 'utf8');
const bridge = fs.readFileSync('assets/lab/directory-server-proof-v1.js', 'utf8');

assert(index.includes('/assets/lab/directory-app-v1.js'), 'existing Directory app must stay loaded');
assert(index.includes('/assets/lab/directory-api-v1.js'), 'thin Directory transport must load');
assert(index.includes('/assets/lab/directory-server-proof-v1.js'), 'server proof bridge must load');
assert(index.indexOf('/assets/lab/directory-app-v1.js') < index.indexOf('/assets/lab/directory-server-proof-v1.js'), 'server proof must enhance the existing Directory app');
assert(index.includes("connect-src 'self' https://*.cmxchat.com http://localhost:8000"), 'Directory CSP must allow the existing protected CMX API origin without hardcoding a second client endpoint into the page contract');

assert(transport.includes("credentials: 'include'"), 'transport must use protected cookies');
assert(transport.includes('/checkin/operator/session'), 'mutations must retrieve the operator CSRF session');
assert(transport.includes("headers['X-CSRF-Token']"), 'mutations must send X-CSRF-Token');
assert(transport.includes('/checkin/operator/directory/people'), 'transport must use protected Person endpoints');
assert(transport.includes('/contact-methods'), 'transport must use protected ContactMethod endpoints');
assert(transport.includes('Array.isArray(detail)'), 'structured 422 validation detail must remain readable');
assert(!transport.includes('localStorage'), 'transport must not persist domain state locally');
assert(!transport.includes('/organizations'), 'transport must not invent Organization backend support');
assert(!transport.includes('/groups'), 'transport must not invent Group backend support');

assert(bridge.includes('data-server-person'), 'People rows must bind to backend Person IDs');
assert(bridge.includes('state.selectedId = created.id'), 'created Person identity must come from the backend response');
assert(bridge.includes('Email saved · ${created.id}'), 'created ContactMethod identity must come from the backend response');
assert(bridge.includes("display_name:String(form.get('displayName')"), 'Person edits must patch only supported display_name');
assert(transport.includes("{ channel: 'email', address }"), 'email ContactMethod creation must stay typed');
assert(bridge.includes("contact.lifecycle === 'active' ? 'disabled' : 'active'"), 'ContactMethod disable/reactivate must use backend lifecycle');
assert(bridge.includes('Backend 409/422'), 'duplicate/validation policy must remain backend-owned');
assert(bridge.includes('contactErrors: new Map()'), 'ContactMethod fetch errors must remain distinct from a real empty list');
assert(bridge.includes('state.contacts.delete(personId)'), 'failed ContactMethod reads must not preserve stale contact rows as current');
assert(bridge.includes('No empty server result is being inferred from this failed request.'), 'failed ContactMethod reads must render unavailable, not no-email');
assert(!bridge.includes('state.contacts.set(personId, []);'), 'ContactMethod request failure must never become a canonical empty list');
assert(!bridge.includes('localStorage.setItem'), 'server-backed Person/ContactMethod bridge must not write canonical domain state to localStorage');
assert(!bridge.includes('cmx-lab-crm-v1'), 'server-backed bridge must not read the legacy Directory store');
assert(bridge.includes('Organizations, Groups'), 'unsupported Directory concepts must remain explicitly local/unintegrated');
assert(bridge.includes('SERVER-BACKED Automations may reference those stable IDs'), 'server-backed Automations may truthfully consume stable Directory IDs');
assert(bridge.includes('does not fabricate reverse usage history or dependencies'), 'Directory Automations tab must avoid invented dependency data');

console.log('Continuum Directory server persistence source contract passed at /directory/.');
