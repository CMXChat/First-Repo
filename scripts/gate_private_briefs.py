from pathlib import Path

PAGES = {
    "logan": {
        "asset": "assets/cmx-logan-brief.html",
        "title": "Logan Terminal Brief",
        "description": "Authorization required to access Logan's private CMX briefing.",
        "canonical": "https://db.cmxchat.com/logan/",
        "theme": "#000000",
    },
    "debbie": {
        "asset": "assets/cmx-debbie-brief.html",
        "title": "Debbie's Brooklyn Brief",
        "description": "Authorization required to access Debbie's private CMX briefing.",
        "canonical": "https://db.cmxchat.com/debbie/",
        "theme": "#050912",
    },
}

for route, config in PAGES.items():
    source = Path(route) / "index.html"
    original = source.read_text(encoding="utf-8")
    if 'data-cmx-gated="true"' in original:
        raise SystemExit(f"{route} is already gated")

    Path(config["asset"]).write_text(original, encoding="utf-8")
    asset_url = "/" + config["asset"]
    title = config["title"]
    description = config["description"]
    canonical = config["canonical"]
    theme = config["theme"]

    wrapper = f'''<!DOCTYPE html>
<html lang="en" class="cmx-gate-pending" data-cmx-gated="true" data-cmx-visibility="Direct-link-only" data-cmx-load-url="{asset_url}?v=20260802-1">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="{theme}" />
  <meta name="referrer" content="no-referrer" />
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="Authorization required to access this private CMX briefing." />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CMX Restricted Node" />
  <meta property="og:url" content="{canonical}" />
  <meta name="twitter:card" content="summary" />
  <style>html,body{{margin:0;min-height:100%;background:{theme}}}html.cmx-gate-pending body>*{{visibility:hidden}}</style>
  <link rel="stylesheet" href="/assets/cmx-sensitive-gate.css?v=20260731-2" />
  <script src="/assets/cmx-sensitive-gate.js?v=20260731-2" defer></script>
</head>
<body>
  <noscript>This private resource requires JavaScript and authorization.</noscript>
</body>
</html>
'''
    source.write_text(wrapper, encoding="utf-8")
    print(f"Gated /{route}/ and preserved {config['asset']}")
