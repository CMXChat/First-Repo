from pathlib import Path
import re

source = Path("ai/index.html")
payload = Path("assets/cmx-ai-control-blueprint.html")
registry_path = Path("assets/cmx-routes.json")

original = source.read_text(encoding="utf-8")
if 'data-cmx-gated="true"' in original:
    raise SystemExit("AI route is already gated.")

payload.write_text(original, encoding="utf-8")

wrapper = '''<!DOCTYPE html>
<html lang="en" class="cmx-gate-pending" data-cmx-gated="true" data-cmx-visibility="Direct-link-only" data-cmx-load-url="/assets/cmx-ai-control-blueprint.html?v=20260802-1">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#000000" />
  <meta name="referrer" content="no-referrer" />
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <title>CMX AI Control Blueprint</title>
  <meta name="description" content="Authorization required to access the private CMX AI control blueprint." />
  <link rel="canonical" href="https://db.cmxchat.com/ai/" />
  <meta property="og:title" content="CMX AI Control Blueprint" />
  <meta property="og:description" content="Authorization required to access this private CMX technical resource." />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CMX Restricted Node" />
  <meta property="og:url" content="https://db.cmxchat.com/ai/" />
  <meta property="og:image" content="https://db.cmxchat.com/assets/cmx-restricted-node-social.png" />
  <meta property="og:image:secure_url" content="https://db.cmxchat.com/assets/cmx-restricted-node-social.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="CMX AI Control Blueprint restricted resource" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CMX AI Control Blueprint" />
  <meta name="twitter:description" content="Authorization required to access this private CMX technical resource." />
  <meta name="twitter:image" content="https://db.cmxchat.com/assets/cmx-restricted-node-social.png" />
  <meta name="twitter:image:alt" content="CMX AI Control Blueprint restricted resource" />
  <!-- Protected payload retains /assets/cmx-terminal-blueprint.css. -->
  <style>html,body{margin:0;min-height:100%;background:#000}html.cmx-gate-pending body>*{visibility:hidden}</style>
  <link rel="stylesheet" href="/assets/cmx-sensitive-gate.css?v=20260731-2" />
  <script src="/assets/cmx-sensitive-gate.js?v=20260731-2" defer></script>
</head>
<body>
  <noscript>This private resource requires JavaScript and authorization.</noscript>
</body>
</html>
'''
source.write_text(wrapper, encoding="utf-8")

registry = registry_path.read_text(encoding="utf-8")
version_match = re.search(r'"version"\s*:\s*(\d+)', registry)
if not version_match:
    raise SystemExit("Route registry version was not found.")
next_version = int(version_match.group(1)) + 1
registry = registry[:version_match.start(1)] + str(next_version) + registry[version_match.end(1):]

old_route = r'("path":"/ai/"[^\n]*"gated":)false'
registry, count = re.subn(old_route, r'\1true', registry, count=1)
if count != 1:
    raise SystemExit("AI route registry entry was not updated exactly once.")
registry_path.write_text(registry, encoding="utf-8")

print("AI page payload preserved, route gated, and registry updated.")
