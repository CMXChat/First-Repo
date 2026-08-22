const fs=require('fs');
const html=fs.readFileSync('requests/index.html','utf8');
const app=fs.readFileSync('assets/requests/requests-v1.js','utf8');
const api=fs.readFileSync('assets/continuum-operator-api-v1.js','utf8');
const css=fs.readFileSync('assets/requests/requests-v1.css','utf8');
const routes=JSON.parse(fs.readFileSync('assets/cmx-routes.json','utf8'));
const roadmap=fs.readFileSync('docs/continuum-frontend-roadmap-CURRENT.md','utf8');
const handoff=fs.readFileSync('docs/continuum-requests-CURRENT.md','utf8');
const must=(text,needle,label)=>{if(!text.includes(needle))throw new Error(`missing ${label}: ${needle}`)};
const forbid=(text,needle,label)=>{if(text.includes(needle))throw new Error(`forbidden ${label}: ${needle}`)};

must(html,'data-cmx-gate="black-prompt"','protected page gate');
must(html,'data-requests-version="v1"','Requests marker');
must(html,'CONTINUUM · OPERATOR DOORWAY','operator doorway boundary');
must(html,'id="backendUnlockForm"','unlock form');
must(html,'id="requestInput"','batch input');
must(html,'id="parseRequest"','preview action');
must(html,'id="approveRequest"','explicit approval action');
must(html,'Writes are sequential, not one database transaction','partial-write warning');
must(html,'Arbitrary natural-language planning','AI limitation');
must(html,'href="/email/"','Email navigation');
must(html,'href="/directory/"','Directory navigation');
must(html,'continuum-operator-api-v1.js','shared operator API');

must(api,'operator_key','operator unlock request');
must(api,'X-CSRF-Token','CSRF contract');
must(api,'createPerson','Person create adapter');
must(api,'createContact','ContactMethod create adapter');
forbid(api,'localStorage','operator local storage');
forbid(api,'sessionStorage','operator session storage');

must(app,'api.session({ refresh: true })','session check');
must(app,'api.unlock(key)','protected unlock');
must(app,'api.createPerson({ display_name: row.name })','Person mutation');
must(app,'api.createContact(person.id','ContactMethod mutation');
must(app,'duplicate email in this batch','batch duplicate protection');
must(app,'No automatic retry was attempted','retry safety');
must(app,'row.status = "partial"','partial durable result');
must(app,'Directory create API is not deployed','deployment-gap truth');
forbid(app,'fetch(','direct transport bypass');
forbid(app,'localStorage','canonical local storage');
forbid(app,'sessionStorage','canonical session storage');
forbid(app,'WebSocket','unapproved execution transport');

must(css,'.workspace','Requests workspace');
must(css,'.preview-wrap','review table');
must(css,'@media(max-width:640px)','mobile layout');

if(!routes.routes.some(route=>route.path==='/requests/'&&route.gated===true))throw new Error('Requests route must be registered and gated');
if(routes.version<38)throw new Error('route registry version must include Requests graduation');

must(roadmap,'Phase F2 — `/requests/` operator doorway','approved Requests roadmap');
must(roadmap,'One backend, many interfaces.','architecture principle');
must(handoff,'Preview-before-write invariant','Requests handoff');
must(handoff,'not a direct PostgreSQL console','database boundary');

console.log('Continuum Requests v1 protected preview/write contract: PASS');
