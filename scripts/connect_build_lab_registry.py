from pathlib import Path
import re

path = Path('assets/cmx-build-lab.html')
html = path.read_text(encoding='utf-8')

html = html.replace('data-cmx-version="1.2"', 'data-cmx-version="1.3"')
html = html.replace('Build Lab v1.2', 'Build Lab v1.3')

if '/assets/cmx-route-registry.js' not in html:
    html = html.replace('</head>', '<script src="/assets/cmx-route-registry.js?v=20260731-1" defer></script>\n</head>')

html = re.sub(
    r"const ROUTES=\[.*?\];\nconst GATED=new Set\(\[.*?\]\);",
    "let ROUTES=[];\nlet GATED=new Set();",
    html,
    count=1,
    flags=re.S,
)

old_tail = "document.getElementById('checkAll').onclick=checkAll;document.getElementById('checkSide').onclick=checkAll;renderRoutes();renderApis();tick();setInterval(tick,1000);"
new_tail = "document.getElementById('checkAll').onclick=checkAll;document.getElementById('checkSide').onclick=checkAll;async function initializeBuildLab(){try{const registry=await window.CMXRouteRegistry.load();ROUTES=registry.routes.filter(route=>route.includeInBuildLab!==false).map(route=>[route.path,route.name,route.category,route.status,route.visibility]);GATED=new Set(registry.routes.filter(route=>route.gated).map(route=>route.path));system.lastElementChild.textContent='Registry connected';}catch(error){system.style.color='var(--red)';system.lastElementChild.textContent='Registry unavailable';routeRows.innerHTML='<tr><td colspan=\"8\">Route registry could not be loaded.</td></tr>';return}renderRoutes();renderApis();tick();setInterval(tick,1000)}initializeBuildLab();"

if old_tail not in html:
    raise SystemExit('Expected Build Lab initialization block not found')
html = html.replace(old_tail, new_tail, 1)

path.write_text(html, encoding='utf-8')
