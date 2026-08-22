(() => {
  "use strict";
  const API_BASE = location.hostname === "db.cmxchat.com" ? "https://api.cmxchat.com/api/v1" : "http://localhost:8000/api/v1";
  async function readJson(response){if(response.status===204)return null;try{return await response.json()}catch{return null}}
  function detailMessage(body,status){const d=body?.detail;if(typeof d==="string")return d;if(Array.isArray(d))return d.map(x=>x?.msg||JSON.stringify(x)).join("; ");return body?.message||`Request failed with ${status}`}
  async function csrfToken(){const r=await fetch(`${API_BASE}/checkin/operator/session`,{credentials:"include",cache:"no-store",headers:{Accept:"application/json"}});const b=await readJson(r);if(!r.ok)throw Object.assign(new Error(detailMessage(b,r.status)),{status:r.status,body:b});if(!b?.csrf_token)throw Object.assign(new Error("Private session is missing its CSRF token"),{status:401});return b.csrf_token}
  async function request(path,options={}){const{mutation=false,headers:oh={},...rest}=options;const headers={Accept:"application/json",...oh};if(mutation)headers["X-CSRF-Token"]=await csrfToken();const r=await fetch(`${API_BASE}${path}`,{credentials:"include",cache:"no-store",...rest,headers});const b=await readJson(r);if(!r.ok)throw Object.assign(new Error(detailMessage(b,r.status)),{status:r.status,body:b});return b}
  const json=(method,body)=>({method,mutation:true,headers:{"Content-Type":"application/json"},body:JSON.stringify(body??{})});
  const mutation=(method="POST")=>({method,mutation:true});
  const op="/checkin/operator";
  async function getReceipt(automationId,runId){
    const receipt=await request(`${op}/automations/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}/receipt`);
    window.dispatchEvent(new CustomEvent("cmx:runtime-receipt-read",{detail:{automationId:String(automationId||""),runId:String(runId||"")}}));
    return receipt;
  }
  window.CMXEmailLabApi=Object.freeze({
    apiBase:API_BASE,
    session:()=>request(`${op}/session`),
    listPeople:()=>request(`${op}/directory/people`),
    listContacts:(personId)=>request(`${op}/directory/people/${encodeURIComponent(personId)}/contact-methods`),
    listConnections:()=>request(`${op}/connections`),
    listSenders:(connectionId)=>request(`${op}/connections/${encodeURIComponent(connectionId)}/sender-identities`),
    connectionReadiness:(connectionId)=>request(`${op}/connections/${encodeURIComponent(connectionId)}/readiness`),
    createContent:(payload)=>request(`${op}/library/content`,json("POST",payload)),
    getContent:(contentId)=>request(`${op}/library/content/${encodeURIComponent(contentId)}`),
    updateContentDraft:(contentId,payload)=>request(`${op}/library/content/${encodeURIComponent(contentId)}/draft`,json("PUT",payload)),
    saveContentVersion:(contentId)=>request(`${op}/library/content/${encodeURIComponent(contentId)}/versions`,mutation()),
    createAutomation:(payload)=>request(`${op}/automations`,json("POST",payload)),
    getAutomation:(id)=>request(`${op}/automations/${encodeURIComponent(id)}`),
    updateAutomationDraft:(id,payload)=>request(`${op}/automations/${encodeURIComponent(id)}/draft`,json("PUT",payload)),
    preflight:(id)=>request(`${op}/automations/${encodeURIComponent(id)}/preflight`),
    review:(id)=>request(`${op}/automations/${encodeURIComponent(id)}/review`,mutation()),
    publish:(id)=>request(`${op}/automations/${encodeURIComponent(id)}/publish`,mutation()),
    requestRun:(id,payload)=>request(`${op}/automations/${encodeURIComponent(id)}/runs`,json("POST",payload)),
    processRun:(id,runId,payload)=>request(`${op}/automations/${encodeURIComponent(id)}/runs/${encodeURIComponent(runId)}/process`,json("POST",payload)),
    getRun:(id,runId)=>request(`${op}/automations/${encodeURIComponent(id)}/runs/${encodeURIComponent(runId)}`),
    getReceipt,
  });

  if (!document.querySelector('script[data-continuum-source-truth]')) {
    const script = document.createElement('script');
    script.src = '/assets/continuum-source-truth-v1.js?v=20260822-1';
    script.defer = true;
    script.dataset.continuumSourceTruth = 'loader';
    document.head.appendChild(script);
  }
})();
