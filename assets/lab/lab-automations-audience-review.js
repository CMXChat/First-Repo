(() => {
  "use strict";

  const CRM_KEY="cmx-lab-crm-v1";
  const AUDIENCE_KEY="cmx-lab-audience-links-v1";
  const STEP_KEY="cmx-lab-audience-last-steps-v1";

  function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}}
  function loadSteps(){try{return JSON.parse(sessionStorage.getItem(STEP_KEY))||[];}catch{return[];}}
  function saveSteps(ids){try{sessionStorage.setItem(STEP_KEY,JSON.stringify(ids));}catch{}}

  function captureSteps(){const ids=[...document.querySelectorAll("[data-action-content]")].map(el=>el.dataset.actionContent).filter(Boolean);if(ids.length)saveSteps(ids);}
  function peopleForRef(data,ref,seen=new Set()){
    const people=Array.isArray(data.people)?data.people:[];
    if(ref?.kind==="person")return people.filter(p=>p.id===ref.id);
    if(ref?.kind==="organization")return people.filter(p=>(p.organizationIds||[p.orgId]).filter(Boolean).includes(ref.id));
    if(ref?.kind==="label")return people.filter(p=>(p.labels||p.tags||[]).includes(ref.id));
    if(ref?.kind==="group"){
      if(seen.has(ref.id))return[];seen.add(ref.id);
      const group=(data.groups||[]).find(g=>g.id===ref.id);
      return(group?.members||[]).flatMap(member=>peopleForRef(data,member,new Set(seen)));
    }
    return[];
  }
  function refName(data,ref){if(ref.kind==="person")return data.people?.find(x=>x.id===ref.id)?.name||ref.id;if(ref.kind==="organization")return data.organizations?.find(x=>x.id===ref.id)?.name||ref.id;if(ref.kind==="group")return data.groups?.find(x=>x.id===ref.id)?.name||ref.id;if(ref.kind==="label")return `${data.labels?.find(x=>x.id===ref.id)?.name||ref.id} label`;return ref.id;}
  function summaryFor(data,link){const refs=link?.refs||[];const people=new Map();refs.flatMap(ref=>peopleForRef(data,ref)).forEach(person=>person?.id&&people.set(person.id,person));const names=refs.map(ref=>refName(data,ref));return refs.length?`${names.join(" + ")} · ${people.size} unique ${people.size===1?"person":"people"}`:"No audience selected";}

  function enhanceReview(){
    captureSteps();
    const review=document.querySelector(".review-details");if(!review)return;
    let row=review.querySelector("[data-audience-review-row]");
    const ids=loadSteps();const crm=load(CRM_KEY,{people:[],organizations:[],groups:[],labels:[]});const links=load(AUDIENCE_KEY,{links:{}}).links||{};
    const summaries=ids.map((id,index)=>`${index+1}. ${summaryFor(crm,links[id])}`);
    if(!row){row=document.createElement("div");row.className="review-row";row.dataset.audienceReviewRow="";const doRow=[...review.querySelectorAll(".review-row")].find(item=>item.querySelector("small")?.textContent?.trim()==="DO");if(doRow)doRow.after(row);else review.append(row);}
    row.innerHTML=`<small>AUDIENCE</small><span>${summaries.length?summaries.join(" · "):"Choose an audience in Actions"}</span>`;
  }

  document.addEventListener("click",()=>requestAnimationFrame(()=>requestAnimationFrame(enhanceReview)),true);
  window.addEventListener("pageshow",()=>requestAnimationFrame(()=>requestAnimationFrame(enhanceReview)));
  requestAnimationFrame(()=>requestAnimationFrame(enhanceReview));
})();