import {spawn, execSync} from 'node:child_process';

const sleep = ms => new Promise(r=>setTimeout(r,ms));
const findChrome = () => execSync('command -v google-chrome || command -v chromium || command -v chromium-browser', {shell:'/bin/bash',encoding:'utf8'}).trim();
const chrome = findChrome();
console.log(`Using Chrome: ${chrome}`);

const server = spawn('python3',['-m','http.server','8787','--bind','127.0.0.1'],{stdio:'ignore'});
const browser = spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=9222','--remote-debugging-address=127.0.0.1','--user-data-dir=/tmp/study-lab-chrome','about:blank'],{stdio:'ignore'});

const cleanup=()=>{try{server.kill('SIGTERM')}catch{}try{browser.kill('SIGTERM')}catch{}};
process.on('exit',cleanup);process.on('SIGINT',()=>{cleanup();process.exit(130)});

async function waitOk(url,tries=40){for(let i=0;i<tries;i++){try{const r=await fetch(url);if(r.ok)return true}catch{}await sleep(200)}throw new Error(`Timed out waiting for ${url}`)}
async function waitJson(url,tries=40){for(let i=0;i<tries;i++){try{const r=await fetch(url);if(r.ok)return await r.json()}catch{}await sleep(200)}throw new Error(`Timed out waiting for ${url}`)}
await waitOk('http://127.0.0.1:8787/study/');
const targets=await waitJson('http://127.0.0.1:9222/json/list');
const target=targets.find(x=>x.type==='page');if(!target)throw new Error('No Chrome page target found');
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.addEventListener('open',res,{once:true});ws.addEventListener('error',rej,{once:true})});
let seq=0;const pending=new Map();let routeLabel='startup';const exceptions=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);return}if(m.method==='Runtime.exceptionThrown'){exceptions.push(`${routeLabel}: ${m.params.exceptionDetails?.exception?.description||m.params.exceptionDetails?.text||'runtime exception'}`)}});
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Log.enable');

const routes=[
  {path:'/study/',required:['.study-universe-bar','.course-dock','.react-playground','.request-mail-stage','.backend-mission','.db-query-grid','.fullstack-code-bridge','.study-teacher-card']},
  {path:'/study/python/',required:['.study-universe-bar','.course-dock','.code-conveyor','.study-teacher-card']},
  {path:'/study/environment/',required:['.study-universe-bar','.course-dock','[data-hb-reality]','.network-map','.debug-shell','.docker-v2','[data-config-vault]','.study-teacher-card']},
  {path:'/study/environment/handbook/',required:['.study-universe-bar','.course-dock','.hb-current','.study-teacher-card']},
  {path:'/study/index/',required:['#indexSearch','#termGrid .index-term','.index-term-long','.project-playground']},
];
const viewports=[['desktop',1440,1000],['phone',390,844]];
const failures=[];

function evalExpr(expression){return cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}).then(r=>r.result?.value)}
for(const [vp,width,height] of viewports){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:vp==='phone'});
  for(const route of routes){
    routeLabel=`${vp} ${route.path}`;
    const url=`http://127.0.0.1:8787${route.path}`;
    await cdp('Page.navigate',{url});await sleep(1800);
    const check=await evalExpr(`(()=>{const toolbar=document.querySelector('.toolbar');const universe=document.querySelector('.study-universe-bar');return {
      theme:document.documentElement.dataset.theme||'',
      width:document.documentElement.scrollWidth,
      viewport:innerWidth,
      missing:${JSON.stringify(route.required)}.filter(s=>!document.querySelector(s)),
      title:document.title,
      toolbarH:toolbar?toolbar.getBoundingClientRect().height:0,
      universeH:universe?universe.getBoundingClientRect().height:0,
      easyText:document.querySelector('.study-easy-button')?.textContent||''
    }})()`);
    if(!check)failures.push(`${routeLabel}: no browser result`);
    else{
      if(check.theme!=='light')failures.push(`${routeLabel}: expected default light theme, got ${check.theme||'unset'}`);
      if(check.width>check.viewport+2)failures.push(`${routeLabel}: document horizontally overflows (${check.width}px > ${check.viewport}px)`);
      if(check.missing.length)failures.push(`${routeLabel}: missing runtime UI ${check.missing.join(', ')}`);
      if(route.path!=='/study/index/'&&check.universeH>(vp==='phone'?46:50))failures.push(`${routeLabel}: Study Universe bar is too tall (${check.universeH}px)`);
      if(route.path!=='/study/index/'&&check.easyText&&check.easyText!=='🧠')failures.push(`${routeLabel}: simple-explanation button should be 🧠, got ${check.easyText}`);
    }
    if(route.path!=='/study/index/'){
      const term=await evalExpr(`(()=>{const t=document.querySelector('.term.study-definition-ready,.term');if(!t)return null;t.click();const c=getComputedStyle(t).backgroundColor;const m=c.match(/rgba?\\((\\d+)[, ]+(\\d+)[, ]+(\\d+)/);return {bg:c,lum:m?(.2126*+m[1]+.7152*+m[2]+.0722*+m[3]):255,expanded:t.getAttribute('aria-expanded')}})()`);
      if(term&&term.expanded==='true'&&term.lum<100)failures.push(`${routeLabel}: expanded definition surface is suspiciously dark in light mode (${term.bg})`);
      const guide=await evalExpr(`(()=>{const b=document.querySelector('.guide-launch');const p=document.querySelector('.guide-panel');const d=document.querySelector('.course-dock');if(!b||!p||!d)return null;b.click();const a=p.getBoundingClientRect(),z=d.getBoundingClientRect();const overlap=!(a.right<z.left||a.left>z.right||a.bottom<z.top||a.top>z.bottom);return {open:p.classList.contains('open'),overlap,right:a.right,left:a.left,top:a.top,bottom:a.bottom,vw:innerWidth,vh:innerHeight}})()`);
      if(guide?.open&&guide.overlap)failures.push(`${routeLabel}: Study Guide overlaps course dock`);
      if(guide?.open&&(guide.right>guide.vw+2||guide.left<-2||guide.bottom>guide.vh+2||guide.top<-2))failures.push(`${routeLabel}: Study Guide escapes viewport`);
      const dock=await evalExpr(`(async()=>{const d=document.querySelector('.course-dock');const x=document.querySelector('.course-dismiss');const p=document.querySelector('.course-dock-peek');if(!d||!x||!p)return null;x.click();await new Promise(r=>setTimeout(r,260));const hidden=d.hidden&&p.classList.contains('show');p.click();await new Promise(r=>setTimeout(r,30));return {hiddenWorked:hidden,restored:!d.hidden&&!p.classList.contains('show')}})()`);
      if(dock&&!dock.hiddenWorked)failures.push(`${routeLabel}: course tracker did not hide cleanly`);
      if(dock&&!dock.restored)failures.push(`${routeLabel}: course tracker did not restore cleanly`);
    }
    console.log(`✓ checked ${routeLabel}`);
  }
}

if(exceptions.length){for(const e of exceptions)failures.push(`Runtime exception: ${e}`)}
ws.close();cleanup();
if(failures.length){console.error('\nBrowser QA failures:');for(const f of failures)console.error(`  - ${f}`);process.exit(1)}
console.log('\n✓ Study browser QA passed at desktop and phone widths.');
