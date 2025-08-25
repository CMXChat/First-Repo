// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

// Allow CORS only if you need to test from a different origin.
// Comment this out if serving index.html from /public on the same server.
// import cors from 'cors'; app.use(cors());

/* ---------- Helpers ---------- */
const ok = (res, data) => res.json(data);
const bad = (res, status=502, msg='Upstream error') => res.status(status).json({ error: msg });

/* ---------- Email ---------- */
app.get('/api/email', async (req, res) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if(!email) return bad(res, 400, 'email required');
    const domain = email.split('@')[1] || '';

    // provider guess
    const provider =
      /gmail\.com$/.test(domain) ? 'Gmail' :
      /(outlook|hotmail|live)\.com$/.test(domain) ? 'Outlook/Microsoft' :
      /yahoo\.(com|co\.\w+)$/.test(domain) ? 'Yahoo' :
      /proton\.me$/.test(domain) ? 'Proton' :
      /icloud\.com$/.test(domain) ? 'iCloud' :
      /yandex\.(ru|com)$/.test(domain) ? 'Yandex' : null;

    // md5 (lightweight)
    const md5 = await (async () => {
      const { createHash } = await import('crypto');
      return createHash('md5').update(email).digest('hex');
    })();

    const gravatar = `https://www.gravatar.com/avatar/${md5}?d=404&s=160`;

    // curated link groups for UI
    const groups = [
      { title: 'Breach & Reputation', items: [
        { label:'Have I Been Pwned', url:`https://haveibeenpwned.com/account/${encodeURIComponent(email)}` },
        { label:'EmailRep',          url:`https://emailrep.io/${encodeURIComponent(email)}` },
        { label:'IntelX',            url:`https://intelx.io/?s=${encodeURIComponent(email)}` },
      ]},
      { title: 'Search', items: [
        { label:'Google exact',     url:`https://www.google.com/search?q="%22${encodeURIComponent(email)}%22"` },
        { label:'Bing exact',       url:`https://www.bing.com/search?q="%22${encodeURIComponent(email)}%22"` },
      ]}
    ];

    return ok(res, { provider, md5, gravatar, groups });
  } catch (e) { return bad(res); }
});

/* ---------- Username (just builds links for now) ---------- */
app.get('/api/username', async (req, res) => {
  try {
    const u = String(req.query.u || '').trim();
    if(!u) return bad(res, 400, 'u required');
    const enc = encodeURIComponent(u);
    const groups = [
      { title:'Profiles', items:[
        { label:'GitHub',   url:`https://github.com/${enc}` },
        { label:'Reddit',   url:`https://www.reddit.com/user/${enc}` },
        { label:'X (Twitter)', url:`https://twitter.com/${enc}` },
        { label:'Instagram', url:`https://www.instagram.com/${enc}/` },
      ]},
      { title:'Search', items:[
        { label:'Google',   url:`https://www.google.com/search?q=${enc}` },
        { label:'Bing',     url:`https://www.bing.com/search?q=${enc}` },
      ]},
    ];
    return ok(res, { groups });
  } catch (e) { return bad(res); }
});

/* ---------- DNS over HTTPS via Google ---------- */
app.get('/api/dns', async (req, res) => {
  try {
    const domain = String(req.query.domain || '').trim();
    if(!domain) return bad(res, 400, 'domain required');
    const types = ['A','AAAA','MX','NS','TXT'];
    const all = await Promise.all(types.map(async t=>{
      const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${t}`, { cache:'no-store' });
      if(!r.ok) return { Answer: [] };
      return r.json();
    }));
    const records = {};
    types.forEach((t,i)=>{
      const ans = all[i]?.Answer || [];
      records[t] = ans.map(a => t==='TXT' ? String(a.data).replaceAll('"','') : a.data);
    });
    return ok(res, { records });
  } catch (e) { return bad(res); }
});

/* ---------- IP info via ipapi.co ---------- */
app.get('/api/ip', async (req, res) => {
  try {
    const ip = String(req.query.ip || '').trim();
    if(!ip) return bad(res, 400, 'ip required');
    const r = await fetch(`https://ipapi.co/${ip}/json/`, { cache:'no-store' });
    if(!r.ok) return bad(res);
    const data = await r.json();
    return ok(res, data);
  } catch (e) { return bad(res); }
});

/* ---------- RDAP passthrough (domain or ip) ---------- */
app.get('/api/rdap', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if(!q) return bad(res, 400, 'q required');
    const domain = /[a-z]/i.test(q) && !/^\d+\.\d+\.\d+\.\d+$/.test(q);
    const url = domain ? `https://rdap.org/domain/${encodeURIComponent(q)}` :
                         `https://rdap.org/ip/${encodeURIComponent(q)}`;
    const r = await fetch(url, { cache:'no-store' });
    if(!r.ok) return bad(res);
    const data = await r.json();
    return ok(res, data);
  } catch (e) { return bad(res); }
});

/* ---------- PTR (reverse DNS) ---------- */
app.get('/api/ptr', async (req, res) => {
  try {
    const ip = String(req.query.ip || '').trim();
    if(!ip) return bad(res, 400, 'ip required');
    const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if(!m) return bad(res, 400, 'invalid ip');
    const [a,b,c,d] = m.slice(1).map(Number);
    if([a,b,c,d].some(n=>n<0||n>255)) return bad(res, 400, 'invalid ip');
    const ptr = `${d}.${c}.${b}.${a}.in-addr.arpa`;
    const r = await fetch(`https://dns.google/resolve?name=${ptr}&type=PTR`, { cache:'no-store' });
    const j = r.ok ? await r.json() : { Answer: [] };
    const names = (j.Answer||[]).map(x=>x.data.replace(/\.$/, ''));
    return ok(res, { ptr, names });
  } catch (e) { return bad(res); }
});

/* ---------- Hash helper (text → md5/sha256) ---------- */
app.post('/api/hash', async (req, res) => {
  try {
    const text = String(req.body?.text || '');
    const { createHash } = await import('crypto');
    const md5 = createHash('md5').update(text).digest('hex');
    const sha256 = createHash('sha256').update(text).digest('hex');
    return ok(res, { md5, sha256 });
  } catch (e) { return bad(res); }
});

/* ---------- Static ---------- */
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`CMX server on http://localhost:${PORT}`));