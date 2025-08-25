// server.js
import express from "express";
import fetch from "node-fetch";            // if on Node < 18, else use global fetch
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
app.use(cors());                           // allow your domain or tighten as needed
app.use(express.json());

// basic rate limit
app.use("/api/", rateLimit({ windowMs: 60_000, max: 60 }));

// DNS over HTTPS (Google)
app.get("/api/dns", async (req, res) => {
  const { name, type = "A" } = req.query;
  if (!name) return res.status(400).json({ error: "Missing name" });
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
  const r = await fetch(url, { headers: { "user-agent": "cmx-osint/1.0" }});
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// IP intel (ipapi.co) – free tier OK for demo; consider ipinfo/ipdata/etc
app.get("/api/ip", async (req, res) => {
  const { ip } = req.query;
  if (!ip) return res.status(400).json({ error: "Missing ip" });
  const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// RDAP (domain or ip)
app.get("/api/rdap", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing q" });
  const isIPv4 = /^\d+\.\d+\.\d+\.\d+$/.test(q);
  const url = `https://rdap.org/${isIPv4 ? "ip" : "domain"}/${encodeURIComponent(q)}`;
  const r = await fetch(url);
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// EmailRep (needs key for high volume; works anonymous w/ limits)
app.get("/api/emailrep", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });
  const r = await fetch(`https://emailrep.io/${encodeURIComponent(email)}`, {
    headers: {
      "User-Agent": "cmx-osint/1.0",
      // 'Key': process.env.EMAILREP_KEY   // uncomment if you have one
    }
  });
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// Simple proxy for HEAD/metadata when CORS blocks (whitelist hosts!)
app.get("/api/head", async (req, res) => {
  const { url } = req.query;
  try {
    const u = new URL(url);
    // BASIC allow-list (expand safely)
    const allowed = ["http:", "https:"].includes(u.protocol);
    if (!allowed) return res.status(400).json({ error: "Blocked scheme" });
    const r = await fetch(u, { method: "HEAD" });
    const headers = {};
    r.headers.forEach((v, k) => headers[k] = v);
    res.json({ status: r.status, headers });
  } catch {
    res.status(400).json({ error: "Bad url" });
  }
});

app.listen(process.env.PORT || 8787, () => console.log("CMX API up"));