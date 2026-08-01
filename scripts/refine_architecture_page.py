from pathlib import Path

path = Path('architecture/index.html')
text = path.read_text(encoding='utf-8')

text = text.replace('data-cmx-version="1.0"', 'data-cmx-version="1.1"')
text = text.replace('See the whole system. Open the lesson only when you need it.', 'CMX platform architecture, from interface to infrastructure.')
text = text.replace(
    'This page documents how CMX moves from static HTML tools into a controlled Python platform. Technical readers can scan the architecture, while learning panels explain the same system through practical CMX examples.',
    'A working blueprint for how CMX pages, Python services, databases, AI tools and deployment controls connect. The main architecture stays concise, with practical implementation examples available throughout.'
)

replacements = {
    '.content{max-width:1440px;margin:auto;padding:22px}': '.content{max-width:1320px;margin:auto;padding:24px}',
    '.hero{padding:clamp(24px,5vw,54px);border:1px solid var(--line);border-radius:20px;background:linear-gradient(145deg,rgba(13,29,45,.96),rgba(5,13,23,.96));box-shadow:var(--shadow)}': '.hero{position:relative;overflow:hidden;padding:clamp(24px,4vw,40px);border:1px solid var(--line2);border-radius:18px;background:linear-gradient(145deg,rgba(13,29,45,.98),rgba(5,13,23,.98));box-shadow:var(--shadow),inset 0 1px 0 rgba(255,255,255,.035)}.hero:after{content:"";position:absolute;width:320px;height:320px;right:-120px;top:-150px;border-radius:50%;background:radial-gradient(circle,rgba(31,155,255,.16),transparent 68%);pointer-events:none}',
    '.hero h2{max-width:900px;margin:12px 0 16px;font:850 clamp(36px,7vw,72px)/.98 var(--mono);letter-spacing:-.06em}': '.hero h2{position:relative;z-index:1;max-width:860px;margin:10px 0 14px;font:850 clamp(30px,4.8vw,52px)/1.04 var(--mono);letter-spacing:-.05em}',
    '.hero p{max-width:850px;margin:0;color:var(--soft);font-size:clamp(15px,2vw,19px)}': '.hero p{position:relative;z-index:1;max-width:820px;margin:0;color:var(--soft);font-size:clamp(14px,1.6vw,17px);line-height:1.7}',
    '.hero-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:28px}': '.hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:24px}',
    '.metric{padding:14px;border:1px solid var(--line);border-radius:12px;background:rgba(2,9,16,.55)}': '.metric{padding:13px 14px;border:1px solid var(--line);border-radius:11px;background:linear-gradient(180deg,rgba(9,25,40,.72),rgba(2,9,16,.62));transition:border-color .18s ease,transform .18s ease}.metric:hover{transform:translateY(-2px);border-color:var(--line2)}',
    '.metric b{display:block;color:var(--cyan);font:800 22px var(--mono)}': '.metric b{display:block;color:var(--cyan);font:800 17px var(--mono)}',
    '.section{margin-top:18px;padding:20px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,rgba(13,29,45,.9),rgba(7,17,28,.92))}': '.section{margin-top:16px;padding:22px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(180deg,rgba(13,29,45,.88),rgba(7,17,28,.94));box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}',
    '.section h3{margin:0;font:800 clamp(22px,4vw,32px) var(--mono);letter-spacing:-.04em}': '.section h3{margin:0;font:800 clamp(20px,3vw,28px) var(--mono);letter-spacing:-.035em}',
    '.card{padding:17px;border:1px solid var(--line);border-radius:13px;background:#07121e}': '.card{padding:17px;border:1px solid var(--line);border-radius:12px;background:linear-gradient(180deg,#081725,#06111c);transition:border-color .18s ease,transform .18s ease,background .18s ease}.card:hover{transform:translateY(-2px);border-color:var(--line2);background:linear-gradient(180deg,#0a1b2b,#07131f)}',
    'details{border:1px solid var(--line);border-radius:12px;background:#06101b;overflow:hidden}': 'details{border:1px solid var(--line);border-radius:11px;background:linear-gradient(180deg,#07131f,#050e18);overflow:hidden;transition:border-color .18s ease}details:hover{border-color:rgba(94,215,255,.42)}',
    'summary{cursor:pointer;padding:15px 17px;color:var(--text);font:800 13px var(--mono);list-style:none}': 'summary{cursor:pointer;padding:14px 16px;color:var(--text);font:800 12px var(--mono);list-style:none}',
    '.code{position:relative;margin:12px 0;padding:15px;overflow:auto;border:1px solid var(--line);border-radius:10px;background:#020810;color:#b9e7ff;font:12px/1.65 var(--mono);white-space:pre}': '.code{position:relative;margin:12px 0;padding:16px;overflow:auto;border:1px solid rgba(94,215,255,.22);border-radius:10px;background:#02070d;color:#b9e7ff;font:12px/1.68 var(--mono);white-space:pre;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}',
    '.node{position:relative;min-height:120px;padding:13px;border:1px solid var(--line);border-radius:12px;background:#07121e}': '.node{position:relative;min-height:116px;padding:13px;border:1px solid var(--line);border-radius:11px;background:linear-gradient(180deg,#081725,#06111c)}',
    '.top{position:sticky;top:0;z-index:8;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid var(--line);background:rgba(5,11,20,.88);backdrop-filter:blur(18px)}': '.top{position:sticky;top:0;z-index:8;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 22px;border-bottom:1px solid var(--line);background:rgba(5,11,20,.9);backdrop-filter:blur(18px)}',
    '.top h1{margin:0;font:800 20px var(--mono)}': '.top h1{margin:0;font:800 17px var(--mono);letter-spacing:.01em}',
    '@media(max-width:760px){.app{display:block}.side{position:fixed;left:-270px;z-index:20;width:250px;transition:.2s}.side.open{left:0}.mobile{display:inline-flex}.top{padding:11px 12px}.top h1{font-size:15px}.content{padding:12px}.hero-grid,.cards,.example,.decision{grid-template-columns:1fr}.section-head{display:block}.pill{margin-top:10px}.hero h2{font-size:42px}}': '@media(max-width:760px){.app{display:block}.side{position:fixed;left:-270px;z-index:20;width:250px;transition:.2s}.side.open{left:0}.mobile{display:inline-flex}.top{padding:10px 12px}.top h1{font-size:13px}.status{display:none}.content{padding:12px}.hero{padding:24px 18px}.hero-grid,.cards,.example,.decision{grid-template-columns:1fr}.section{padding:18px}.section-head{display:block}.pill{margin-top:10px}.hero h2{font-size:32px}.hero p{font-size:14px}}'
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Missing expected CSS fragment: {old[:80]}')
    text = text.replace(old, new)

path.write_text(text, encoding='utf-8')
