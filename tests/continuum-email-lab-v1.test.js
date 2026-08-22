const fs=require('fs');
const html=fs.readFileSync('email/index.html','utf8');
const legacyRedirect=fs.readFileSync('assets/continuum-legacy-route-redirect.js','utf8');
const api=fs.readFileSync('assets/lab/lab-email-api-v1.js','utf8');
const app=fs.readFileSync('assets/lab/lab-email-v1.js','utf8');
const workspace=fs.readFileSync('assets/lab/lab-email-workspace-v2.js','utf8');
const css=fs.readFileSync('assets/lab/lab-email-v1.css','utf8');
const must=(text,needle,label)=>{if(!text.includes(needle))throw new Error(`missing ${label}: ${needle}`)};
const forbid=(text,needle,label)=>{if(text.includes(needle))throw new Error(`forbidden ${label}: ${needle}`)};

must(html,'data-cmx-gate="black-prompt"','Black Prompt gate');
must(html,'data-email-lab="v1"','Email marker');
must(html,'CONTINUUM · MANUAL EMAIL','manual email boundary');
must(html,'contenteditable="true"','rich editor');
must(html,'data-email-editor','rich editor marker');
must(html,'Real manual SMTP','real mode label');
must(html,'Process now · development control','development process boundary');
must(html,'Scope: manual owner only.','authority boundary');
must(html,'href="/control/"','canonical Control navigation');
must(html,'href="/directory/"','canonical Directory navigation');
must(html,'href="/automations/"','canonical Automations navigation');
must(html,'href="/library/"','canonical Library navigation');
must(html,'lab-email-workspace-v2.js','workspace script');
must(legacyRedirect,"['/lab/email/', '/email/']",'retired Lab Email compatibility mapping');
if(fs.existsSync('lab/email/index.html'))throw new Error('retired /lab/email/ page must not exist');

must(api,'${op}/connections/${encodeURIComponent(connectionId)}/readiness','connection readiness');
must(api,'/receipt`','typed Run receipt');
must(api,'X-CSRF-Token','CSRF mutation contract');
must(api,'credentials:"include"','protected cookie');

must(app,'recipient_person_id','Person UUID');
must(app,'recipient_contact_method_id','ContactMethod UUID');
must(app,'sender_identity_id','SenderIdentity UUID');
must(app,'content_asset_id','ContentAsset UUID');
must(app,'expected_revision','optimistic draft revision');
must(app,'provider_mode:mode','typed provider mode');
must(app,'manual_owner','manual authority presentation');
must(app,'real_smtp','real SMTP mode');
must(app,'fake_behavior','fake behavior');
must(app,'crypto.randomUUID()','idempotency/step UUID generation');

must(workspace,'sanitizeHtml','rich editor sanitization');
must(workspace,'plainTextFromHtml','backend-safe text projection');
must(workspace,'document.execCommand','rich editor commands');
must(workspace,'source.value = plain','rich editor backend projection');
must(workspace,'MutationObserver','freeze-state lock');
must(workspace,'data-email-mode','write/preview modes');

must(css,'--bg:#f5f7fa','neutral light surface');
must(css,'--blue:#1674c5','Continuum blue accent');
must(css,'html[data-theme="dark"]','dark theme');
must(css,'@media(max-width:760px)','mobile layout');

forbid(app,'localStorage','canonical local storage');
forbid(app,'sessionStorage','canonical session storage');
forbid(workspace,'localStorage','private-content local storage');
forbid(workspace,'sessionStorage','private-content session storage');
forbid(api,'smtp_password','SMTP secret');
forbid(api,'smtp_username','SMTP secret');
forbid(html,'id="cc','unsupported CC control');
forbid(html,'id="bcc','unsupported BCC control');
forbid(html,'type="file"','unsupported attachment control');

console.log('Continuum Email canonical route + rich composer contract: PASS');
