// server.js
import express from "express";
import fetch from "node-fetch";                // If Node >=18 you can remove this import
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());                               // tighten to your domain in production
app.use(express.json());
app.use("/api/", rateLimit({ windowMs: 60_000, max: 60 }));

// Health
app.get("/api/health", (_,res)=>res.json({ok:true}));

// DNS over HTTPS
app.get("/api/dns", async (req,res) => {
  const { name, type = "A" } = req.query;
  if (!name) return res.status(400).json({ error: "Missing name" });
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
  const r = await fetch(url);
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// IP intel
app.get("/api/ip", async (req,res) => {
  const { ip } = req.query;
  if (!ip) return res.status(400).json({ error: "Missing ip" });
  const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// RDAP domain/IP
app.get("/api/rdap", async (req,res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing q" });
  const isIPv4 = /^\d+\.\d+\.\d+\.\d+$/.test(q);
  const url = `https://rdap.org/${isIPv4 ? "ip" : "domain"}/${encodeURIComponent(q)}`;
  const r = await fetch(url);
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// EmailRep (anonymous is rate-limited; add Key header if you have one)
app.get("/api/emailrep", async (req,res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });
  const r = await fetch(`https://emailrep.io/${encodeURIComponent(email)}`, {
    headers: {
      "User-Agent": "cmx-osint/1.0",
      // "Key": process.env.EMAILREP_KEY
    }
  });
  res.status(r.ok ? 200 : r.status).json(await r.json().catch(()=>({})));
});

// HEAD proxy (CORS-safe) – very basic allow-listing
app.get("/api/head", async (req,res) => {
  try {
    const { url } = req.query;
    const u = new URL(url);
    if (!["http:", "https:"].includes(u.protocol)) {
      return res.status(400).json({ error: "Blocked scheme" });
    }
    const r = await fetch(u, { method: "HEAD" });
    const headers = {};
    r.headers.forEach((v,k)=>headers[k]=v);
    res.json({ status: r.status, headers });
  } catch {
    res.status(400).json({ error: "Bad url" });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, ()=>console.log(`CMX API listening on :${PORT}`));