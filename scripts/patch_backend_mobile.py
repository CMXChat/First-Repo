from pathlib import Path

path = Path("backend/index.html")
text = path.read_text(encoding="utf-8")
needle = '  <link rel="stylesheet" href="/assets/cmx-terminal-backend.css?v=20260801-1" />'
mobile = '  <link rel="stylesheet" href="/assets/cmx-backend-mobile.css?v=20260802-1" />'

if mobile not in text:
    if needle not in text:
        raise SystemExit("Backend terminal stylesheet marker was not found.")
    text = text.replace(needle, needle + "\n" + mobile, 1)
    path.write_text(text, encoding="utf-8")

updated = path.read_text(encoding="utf-8")
if updated.count(mobile) != 1:
    raise SystemExit("Backend mobile stylesheet must appear exactly once.")

print("Backend mobile stylesheet is linked.")
