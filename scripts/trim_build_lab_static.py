from pathlib import Path
import re

path = Path('assets/cmx-build-lab.html')
text = path.read_text(encoding='utf-8')

text = text.replace('<a href="#notes">Build Notes</a>', '')
text = text.replace('Operator access controls are active. Keep project notes focused on approved operational information.', 'Current tools focus on route visibility, structure, planning and deployment readiness.')
text = text.replace('<span class="label">This browser only</span>', '<span class="label">Current session</span>')
text = text.replace('<strong>HIGH · Real route protection</strong>', '<strong>HIGH · Route authorization</strong>')
text = text.replace('Cloudflare Access plus server-side sessions and authorization.', 'Cloudflare Access plus server-side sessions and permissions.')
text = text.replace('Route history, notes, projects and audit records.', 'Route history, projects and audit records.')
text = text.replace('data-cmx-version="1.1"', 'data-cmx-version="1.2"')
text = text.replace('Build Lab v1.1', 'Build Lab v1.2')

text = re.sub(r'\.notes-form\{.*?\.note-actions\{display:flex;gap:7px\}', '', text, flags=re.S)
text = text.replace('.notes-form{grid-template-columns:1fr}.notes-form textarea{grid-column:1}', '')
text = re.sub(r'\n<section class="card span2" id="notes">.*?</section>\n', '\n', text, count=1, flags=re.S)

security_html = '''<section class="card span2" id="security"><div class="head"><h3>Security Plan</h3><span class="badge gated">Current and planned</span></div><div class="body checklist">
<div class="check"><span class="mark">✓</span><span><strong>Repository scanning</strong><small>Automated checks for exposed credentials and configuration issues.</small></span></div>
<div class="check"><span class="mark">✓</span><span><strong>Restricted route presentation</strong><small>Operator authorization gate and direct-link route classifications.</small></span></div>
<div class="check pending"><span class="mark">○</span><span><strong>Cloudflare Access</strong><small>Identity policy at the edge after server deployment.</small></span></div>
<div class="check pending"><span class="mark">○</span><span><strong>Server authorization</strong><small>Protected sessions, permissions and audit records.</small></span></div>
<div class="check pending"><span class="mark">○</span><span><strong>Rate limits and logging</strong><small>Request controls and operational audit history.</small></span></div>
</div></section>'''

deploy_html = '''<section class="card span2" id="deployment"><div class="head"><h3>Deployment Plan</h3><span class="badge planned">Planned</span></div><div class="body checklist">
<div class="check pending"><span class="mark">01</span><span><strong>Linux host</strong><small>Provision the server and operator access.</small></span></div>
<div class="check pending"><span class="mark">02</span><span><strong>Docker runtime</strong><small>Package FastAPI and supporting services.</small></span></div>
<div class="check pending"><span class="mark">03</span><span><strong>PostgreSQL</strong><small>Create migrations, backups and restore procedures.</small></span></div>
<div class="check pending"><span class="mark">04</span><span><strong>Cloudflare Tunnel and Access</strong><small>Connect the private origin and enforce access policy.</small></span></div>
<div class="check pending"><span class="mark">05</span><span><strong>Staging</strong><small>Run tests and review changes before production.</small></span></div>
<div class="check pending"><span class="mark">06</span><span><strong>Production approval</strong><small>Deploy with health checks and rollback available.</small></span></div>
</div></section>'''

text = re.sub(r'<section class="card" id="security">.*?</section>\s*<section class="card span2" id="deployment">.*?</section>', security_html + '\n' + deploy_html, text, count=1, flags=re.S)

text = text.replace('.check{display:flex;gap:9px;align-items:flex-start;padding:9px;border:1px solid var(--line);border-radius:8px}.check input{margin-top:3px}.check small{display:block;color:var(--muted)}', '.check{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--line);border-radius:8px;background:#09100c}.check .mark{color:var(--green);font:800 12px var(--mono)}.check.pending .mark{color:var(--amber)}.check small{display:block;color:var(--muted)}')

text = re.sub(r"const APIS=\[(.*?)\];", lambda m: "const APIS=[" + re.sub(r",?\['(?:POST|GET|DELETE)','/api/build-notes[^']*'\]", '', m.group(1)) + "];", text, count=1, flags=re.S)
text = re.sub(r"\nconst SECURITY=\[.*?\];\nconst DEPLOY=\[.*?\];\nconst NOTE_KEY=.*?;let editing=null;", '', text, count=1, flags=re.S)
text = re.sub(r",noteForm=document\.getElementById\('noteForm'\).*?,securityList=document\.getElementById\('securityList'\),deploymentList=document\.getElementById\('deploymentList'\)", '', text, count=1, flags=re.S)
text = re.sub(r"\nconst esc=.*?;", '', text, count=1)
text = re.sub(r"\nfunction readNotes\(\).*?cancelEdit\.onclick=resetNote;", '', text, count=1, flags=re.S)
text = re.sub(r"\nfunction renderChecks\(\).*?\}\nfunction renderApis", '\nfunction renderApis', text, count=1, flags=re.S)
text = text.replace('renderRoutes();renderNotes();renderChecks();renderApis();', 'renderRoutes();renderApis();')

if 'Build Notes' in text or 'localStorage' in text or 'noteForm' in text or 'renderChecks' in text:
    raise SystemExit('cleanup incomplete')

path.write_text(text, encoding='utf-8')
print('Build Lab reduced to static-useful controls.')
