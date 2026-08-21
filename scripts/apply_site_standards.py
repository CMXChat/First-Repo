from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://db.cmxchat.com"
SOCIAL = f"{BASE}/assets/cmx-restricted-node-social.png"

PAGES = {
    "index.html": ("CMX Restricted Node", "Private private access to CMX research and operational tools.", "User", "Active", False),
    "menu/index.html": ("CMX Operations Menu", "Private menu for CMX research and operational tools.", "Operations", "Active", True),
    "directory/index.html": ("Continuum Directory", "Protected Continuum Directory preview for durable People and email ContactMethods.", "Product Preview", "Active", False),
    "build/index.html": ("CMX Build Lab", "Private project control dashboard for db.cmxchat.com routes, standards and planned infrastructure.", "Operations", "Active", False),
    "entry/index.html": ("CMX Workspace", "Private legacy workspace entry for CMX internal pages and operational resources.", "Legacy", "Review", True),
    "osint/index.html": ("CMX OSINT Console", "Private CMX workspace for approved open-source intelligence research and public-source pivots.", "OSINT", "Active", True),
    "phone/index.html": ("CMX Phone Intelligence", "Private CMX tool for phone-number parsing, normalization and approved public-source research pivots.", "OSINT", "Active", True),
    "metadata/index.html": ("CMX Metadata Inspector", "Private CMX tool for inspecting file metadata, EXIF information and technical file details.", "OSINT", "Active", True),
    "search/index.html": ("CMX Search Workbench", "Private CMX workbench for building focused public-source searches and research queries.", "OSINT", "Active", True),
    "missing/index.html": ("CMX Missing-Person Research", "Private CMX workflow for structured, lawful and source-based missing-person research.", "OSINT", "Active", True),
    "resources/index.html": ("CMX OSINT Resources", "Private CMX library of approved open-source intelligence tools, references and research resources.", "OSINT", "Active", True),
    "seo/index.html": ("CMX Pricing Calculator", "Private CMX pricing calculator for estimating digital service project costs.", "Business", "Legacy", True),
    "services/index.html": ("CMX Services Hub", "Private CMX services reference covering websites, SEO, content and operational systems.", "Business", "Active", True),
    "ovaro/index.html": ("Ovaro Project Workspace", "Private CMX workspace for Ovaro strategy, planning and internal project resources.", "Project", "Active", True),
    "internal/index.html": ("CMX and Ovaro Vision Map", "Private structural overview of the CMX and Ovaro ecosystem and long-term direction.", "Internal", "Active", True),
    "collab1/index.html": ("CMX Agency Concept 1", "Private CMX website concept for a digital agency serving creators and startups.", "Experimental", "Experimental", True),
    "collab2/index.html": ("CMX Agency Concept 2", "Private CMX website concept focused on web, SEO and systems for creators and teams.", "Experimental", "Experimental", True),
    "collab3/index.html": ("CMX Agency Concept 3", "Private CMX website concept for a digital agency serving creators and startups.", "Experimental", "Experimental", True),
    "404.html": ("CMX Restricted Route", "The requested CMX resource is unavailable.", "Restricted", "Unavailable", False),
}

META_PATTERNS = [
    r"\s*<title\b[^>]*>.*?</title>",
    r"\s*<meta\s+name=[\"']description[\"'][^>]*>",
    r"\s*<meta\s+name=[\"']robots[\"'][^>]*>",
    r"\s*<meta\s+name=[\"']googlebot[\"'][^>]*>",
    r"\s*<meta\s+property=[\"']og:(?:title|description|type|site_name|url|image|image:secure_url|image:type|image:width|image:height|image:alt)[\"'][^>]*>",
    r"\s*<meta\s+name=[\"']twitter:(?:card|title|description|image|image:alt)[\"'][^>]*>",
    r"\s*<link\s+rel=[\"']canonical[\"'][^>]*>",
]


def route_for(path: str) -> str:
    if path == "index.html":
        return "/"
    if path == "404.html":
        return "/404.html"
    return "/" + path.removesuffix("index.html")


def metadata_block(path: str, title: str, description: str) -> str:
    route = route_for(path)
    url = BASE + route
    escaped_title = html.escape(title, quote=True)
    escaped_description = html.escape(description, quote=True)
    return f"""
  <!-- CMX SITE STANDARD: START -->
  <title>{escaped_title}</title>
  <meta name="description" content="{escaped_description}" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <link rel="canonical" href="{url}" />
  <meta property="og:title" content="{escaped_title}" />
  <meta property="og:description" content="{escaped_description}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CMX Restricted Node" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{SOCIAL}" />
  <meta property="og:image:secure_url" content="{SOCIAL}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="{escaped_title} private CMX interface" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{escaped_title}" />
  <meta name="twitter:description" content="{escaped_description}" />
  <meta name="twitter:image" content="{SOCIAL}" />
  <meta name="twitter:image:alt" content="{escaped_title} private CMX interface" />
  <!-- CMX SITE STANDARD: END -->"""


def strip_old_standard(text: str) -> str:
    text = re.sub(r"\s*<!-- CMX SITE STANDARD: START -->.*?<!-- CMX SITE STANDARD: END -->", "", text, flags=re.I | re.S)
    for pattern in META_PATTERNS:
        text = re.sub(pattern, "", text, flags=re.I | re.S)
    text = re.sub(r"\s*<link\s+rel=[\"']/assets/cmx-page-standard\.css[\"'][^>]*>", "", text, flags=re.I)
    text = re.sub(r"\s*<script\s+src=[\"']/assets/cmx-page-standard\.js[\"'][^>]*>\s*</script>", "", text, flags=re.I)
    return text


def add_html_data(text: str, title: str, category: str, status: str, standard_ui: bool) -> str:
    match = re.search(r"<html\b([^>]*)>", text, flags=re.I)
    if not match:
        return text
    attrs = match.group(1)
    attrs = re.sub(r"\sdata-cmx-(?:title|category|status|version|standard)=[\"'][^\"']*[\"']", "", attrs, flags=re.I)
    values = {
        "title": title,
        "category": category,
        "status": status,
        "version": "1.0",
        "standard": "on" if standard_ui else "off",
    }
    additions = "".join(f' data-cmx-{key}="{html.escape(value, quote=True)}"' for key, value in values.items())
    return text[:match.start()] + f"<html{attrs}{additions}>" + text[match.end():]


def normalize_links(text: str) -> str:
    replacements = {
        'href="/collab6"': 'href="/collab2/"',
        "href='/collab6'": "href='/collab2/'",
        'href="/collab7"': 'href="/collab3/"',
        "href='/collab7'": "href='/collab3/'",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def unlink_root_anchors(text: str) -> str:
    replacements = {
        'href="/"': 'data-cmx-unlinked="/"',
        "href='/'": "data-cmx-unlinked='/'",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def improve_404(text: str) -> str:
    if "requested resource is unavailable" not in text.lower():
        return text
    body = """
  <main id="gate">
    <section class="gate-shell" aria-labelledby="deniedTitle">
      <div class="window-bar"><span class="dot red"></span><span class="dot amber"></span><span class="dot blue"></span><span class="window-title">restricted node</span></div>
      <div class="gate-body">
        <header class="gate-brand"><div class="gate-emblem" aria-hidden="true">CMX</div><div class="gate-brand-copy"><div class="gate-kicker">Policy boundary</div><div class="gate-host">route unavailable</div></div></header>
        <h1 id="deniedTitle" class="gate-title">Resource unavailable</h1>
        <p class="gate-copy">The requested resource is unavailable or access is not permitted.</p>
              </div>
    </section>
  </main>
"""
    return re.sub(r"<body\b[^>]*>.*?</body>", f"<body>{body}</body>", text, flags=re.I | re.S)


def process(path: str, config: tuple[str, str, str, str, bool]) -> bool:
    file = ROOT / path
    if not file.exists():
        print(f"skip missing: {path}")
        return False
    title, description, category, status, standard_ui = config
    original = file.read_text(encoding="utf-8")
    text = strip_old_standard(original)
    text = normalize_links(text)
    text = unlink_root_anchors(text)
    text = add_html_data(text, title, category, status, standard_ui)

    block = metadata_block(path, title, description)
    text = re.sub(r"</head>", block + "\n</head>", text, count=1, flags=re.I)

    if standard_ui:
        text = re.sub(r"</head>", '  <link rel="stylesheet" href="/assets/cmx-page-standard.css?v=20260731-1" />\n</head>', text, count=1, flags=re.I)
        text = re.sub(r"</body>", '  <script src="/assets/cmx-page-standard.js?v=20260731-1" defer></script>\n</body>', text, count=1, flags=re.I)

    if path == "404.html":
        text = improve_404(text)

    if text != original:
        file.write_text(text, encoding="utf-8")
        print(f"updated: {path}")
        return True
    return False


def main() -> None:
    changed = 0
    for path, config in PAGES.items():
        changed += int(process(path, config))
    print(f"files changed: {changed}")


if __name__ == "__main__":
    main()
