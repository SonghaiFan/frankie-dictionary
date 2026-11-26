#!/usr/bin/env python3
"""Build the independent bilingual Blue Dictionary introduction, without app deps or env files."""
import argparse,html,json,re,shutil
from pathlib import Path
H=html.escape

def samples(repo):
    # Read original string fields directly; never evaluate JavaScript during site builds.
    records=[]
    for block in re.findall(r'\{([^{}]+)\}',(repo/'public/data/data.js').read_text()):
        fields={key:json.loads(value) for key,value in re.findall(r'(\w+)\s*:\s*("(?:[^"\\]|\\.)*")',block)}
        if fields.get('中文') in ['晚安','梦','欣赏'] and not any(x['中文']==fields['中文'] for x in records):records.append(fields)
    assert len(records)==3,'Update the intro sample selection after changing the bundled collection.'
    return sorted(records,key=lambda x:['晚安','梦','欣赏'].index(x['中文']))

def build(repo,out):
    cfg=json.loads((repo/'site/project.json').read_text());content=json.loads((repo/'site/content.json').read_text());words=samples(repo)
    out.mkdir(parents=True,exist_ok=True);(out/'media').mkdir(exist_ok=True)
    for name in ['style.css','sample.js']:shutil.copy(repo/'site'/name,out/name)
    for a in cfg['media']:shutil.copy(repo/a['src'],out/'media'/Path(a['src']).name)
    for src,dest in [('docs/readme/banner.png','banner.png'),('docs/readme/assets/frankie.svg','signature.svg'),('site/assets/noto-intro.woff2','noto-intro.woff2'),('public/font/Noto_Serif_SC/OFL.txt','OFL.txt')]:shutil.copy(repo/src,out/'media'/dest)
    (out/'.nojekyll').touch()
    for lang,c in content.items():
        zh=lang=='zh';pre='../' if zh else './';dest=out/'zh' if zh else out;dest.mkdir(exist_ok=True)
        rows=lambda items:''.join('<article><h3>'+H(a)+'</h3><p>'+H(b)+'</p></article>' for a,b in items)
        gallery=''.join(f'<figure><a href="{pre}media/{a}"><img src="{pre}media/{a}" alt="{H(b)}" loading="lazy" width="1468" height="1247"></a><figcaption>{H(b)}</figcaption></figure>' for a,b in c['gallery'])
        title='蓝色词典 | 词语的另一种解释' if zh else 'Blue Dictionary | A game of words'
        first=words[0];buttons=''.join(f'<button type="button" data-word="{i}" aria-pressed="{"true" if i==0 else "false"}">{H(w["中文"])}</button>' for i,w in enumerate(words))
        body=f'''<!doctype html><html lang="{'zh-CN' if zh else 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><meta name="description" content="{H(c['intro'])}"><link rel="stylesheet" href="{pre}style.css"><link rel="canonical" href="{cfg['pages_url']+('zh/' if zh else '')}"><link rel="alternate" hreflang="en" href="{cfg['pages_url']}"><link rel="alternate" hreflang="zh-CN" href="{cfg['pages_url']}zh/"><meta name="theme-color" content="#130f94"><meta property="og:type" content="website"><meta property="og:url" content="{cfg['pages_url']+('zh/' if zh else '')}"><meta property="og:title" content="{title}"><meta property="og:description" content="{H(c['intro'])}"><meta property="og:image" content="{cfg['pages_url']}media/banner.png"></head><body>
<a class="skip" href="#main">{'跳至内容' if zh else 'Skip to content'}</a><header class="shell"><a class="brand" href="{pre}"><span lang="zh-CN">蓝色词典</span><small>Blue Dictionary</small></a><nav aria-label="{'页面导航' if zh else 'Page navigation'}"><a href="#idea">{H(c['nav_concept'])}</a><a href="#use">{H(c['nav_use'])}</a><a href="#screens">{H(c['nav_screens'])}</a><a href="{pre}" lang="en" {'aria-current="page"' if not zh else ''}>EN</a><a href="{pre}zh/" lang="zh-CN" {'aria-current="page"' if zh else ''}>中文</a></nav></header>
<main id="main" class="shell"><section class="hero"><div><p class="eyebrow">{'文字游戏' if zh else 'A game of words'}</p><h1>{'<br>'.join(H(x) for x in c['headline'].split(chr(10)))}</h1><p class="intro">{H(c['intro'])}</p><div class="actions"><a class="button" href="{cfg['app_url']}">{H(c['open'])} ↗</a><a href="#sample">{H(c['try'])}</a></div></div><figure class="hero-image"><img src="{pre}media/card-current.png" width="1468" height="1247" alt="{'当前应用中“晚安”的真实卡片' if zh else 'The actual Good night card in the current app'}" fetchpriority="high"></figure></section>
<section id="idea" class="section idea"><div><h2>{H(c['concept_title'])}</h2><p class="lead">{H(c['concept'])}</p><p>{H(c['concept_note'])}</p></div><div class="word-shelf" id="sample"><h3>{H(c['shelf_title'])}</h3><div class="word-buttons" aria-label="{'选择示例词条' if zh else 'Choose a sample entry'}">{buttons}</div><article class="sample-card" lang="zh-CN" aria-live="polite"><div><h4 id="word-cn">{H(first['中文'])}</h4><p id="word-en" lang="en">{H(first['英文'])}</p></div><div><p><span>{H(c['definition'])}</span><strong id="word-definition">{H(first['释义'])}</strong></p><p class="english"><span>{H(c['paraphrase'])}</span><i id="word-paraphrase" lang="en">{H(first.get('英文释义',''))}</i></p></div><p class="attribution"><span>{H(c['credit'])}</span><span id="word-credit">{H(first['出处'])}</span></p></article><p class="small">{H(c['shelf_note'])}</p><noscript><p>{'其他示例需要 JavaScript；第一个词仍可阅读。' if zh else 'Enable JavaScript to switch entries. The first remains readable.'}</p></noscript></div></section>
<section class="section"><h2>{H(c['features_title'])}</h2><div class="features">{rows(c['features'])}</div></section>
<section id="use" class="section"><h2>{H(c['workflow_title'])}</h2><ol class="steps">{''.join('<li><h3>'+H(a)+'</h3><p>'+H(b)+'</p></li>' for a,b in c['steps'])}</ol><p class="keyline"><kbd>←</kbd><kbd>→</kbd> / <kbd>Space</kbd> / <kbd>H</kbd> / <kbd>E</kbd> / <kbd>S</kbd> / <kbd>Esc</kbd></p></section>
<section id="screens" class="section"><h2>{H(c['gallery_title'])}</h2><p>{H(c['gallery_note'])}</p><div class="gallery">{gallery}</div></section>
<section id="start" class="section runtime"><div><h2>{H(c['start_title'])}</h2><p>{H(c['runtime'])}</p><p>{H(c['limits'])}</p><h3>{H(c['credit_title'])}</h3><p class="small">{H(c['credit_note'])}</p></div><div class="local"><h3>{H(c['local'])}</h3><pre><code>npm ci\nnpm run dev</code></pre><p>{H(c['local_note'])}</p><a href="https://github.com/{cfg['repository']}/blob/main/site/GUIDE.md">{H(c['guide'])} ↗</a></div></section></main>
<footer class="shell"><a href="https://github.com/SonghaiFan"><img src="{pre}media/signature.svg" alt="Frankie" width="90" height="38"></a><span>{H(c['footer'])}</span><a href="https://github.com/{cfg['repository']}">{H(c['source'])} ↗</a></footer><script id="word-data" type="application/json">{json.dumps(words,ensure_ascii=False).replace('<','&lt;')}</script><script src="{pre}sample.js" defer></script></body></html>'''
        (dest/'index.html').write_text(body)
    print(out)

def _sync_brand_assets(repo, out):
    import shutil, re
    public = repo / "public"
    for filename in ["favicon.svg", "apple-touch-icon.png", "frankie-dictionary-lockup.svg", "frankie-dictionary-lockup-dark.svg"]:
        shutil.copyfile(public / filename, out / filename)
    for page in out.rglob("*.html"):
        prefix = "../" * (len(page.relative_to(out).parts) - 1)
        content = page.read_text()
        content = re.sub(r'<link[^>]+rel=["\'](?:icon|apple-touch-icon)["\'][^>]*>', '', content)
        links = f'<link rel="icon" type="image/svg+xml" href="{prefix}favicon.svg"><link rel="apple-touch-icon" href="{prefix}apple-touch-icon.png">'
        content = content.replace("</head>", links + "</head>")
        page.write_text(content)

_build_content = build
def build(repo, out):
    _build_content(repo, out)
    _sync_brand_assets(repo, out)


def _add_family_navigation(repo, out):
    import shutil
    series = out / "series"
    series.mkdir(exist_ok=True)
    for icon in (repo / ".github/brand/series").glob("*.svg"):
        shutil.copyfile(icon, series / icon.name)
    for page in out.rglob("*.html"):
        prefix = "../" * (len(page.relative_to(out).parts) - 1)
        nav = '<nav aria-label="Frankie projects" style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;padding:28px 20px;max-width:100%;border-top:1px solid #8883"><a href="https://songhaifan.github.io/frankie-brain/" title="Frankie Brain" style="display:inline-flex;padding:6px"><img src="{prefix}series/brain.svg" width="28" height="28" alt="Frankie Brain" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-brain-ios/" title="Frankie Brain · iOS" style="display:inline-flex;padding:6px"><img src="{prefix}series/brain-ios.svg" width="28" height="28" alt="Frankie Brain · iOS" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-cards/" title="Frankie Cards" style="display:inline-flex;padding:6px"><img src="{prefix}series/cards.svg" width="28" height="28" alt="Frankie Cards" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-generative-art/" title="Frankie Generative Art Gallery" style="display:inline-flex;padding:6px"><img src="{prefix}series/generative-art.svg" width="28" height="28" alt="Frankie Generative Art Gallery" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-goal/" title="Frankie Goal" style="display:inline-flex;padding:6px"><img src="{prefix}series/goal.svg" width="28" height="28" alt="Frankie Goal" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-guitar/" title="Frankie Guitar" style="display:inline-flex;padding:6px"><img src="{prefix}series/guitar.svg" width="28" height="28" alt="Frankie Guitar" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-list/" title="Frank’s Life List" style="display:inline-flex;padding:6px"><img src="{prefix}series/list.svg" width="28" height="28" alt="Frank’s Life List" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-mbti/" title="Frankie MBTI" style="display:inline-flex;padding:6px"><img src="{prefix}series/mbti.svg" width="28" height="28" alt="Frankie MBTI" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-onitama/" title="Frankie Onitama" style="display:inline-flex;padding:6px"><img src="{prefix}series/onitama.svg" width="28" height="28" alt="Frankie Onitama" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-poker/" title="Frankie Poker" style="display:inline-flex;padding:6px"><img src="{prefix}series/poker.svg" width="28" height="28" alt="Frankie Poker" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-stocks/" title="Frankie Stocks" style="display:inline-flex;padding:6px"><img src="{prefix}series/stocks.svg" width="28" height="28" alt="Frankie Stocks" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-tarot/" title="Frankie Tarot" style="display:inline-flex;padding:6px"><img src="{prefix}series/tarot.svg" width="28" height="28" alt="Frankie Tarot" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-tarot-api/" title="Frankie Tarot API" style="display:inline-flex;padding:6px"><img src="{prefix}series/tarot-api.svg" width="28" height="28" alt="Frankie Tarot API" style="object-fit:contain;border:0;max-width:none"></a><a href="https://songhaifan.github.io/frankie-werewolf/" title="Werewolf Local" style="display:inline-flex;padding:6px"><img src="{prefix}series/werewolf.svg" width="28" height="28" alt="Werewolf Local" style="object-fit:contain;border:0;max-width:none"></a></nav>'
        nav = nav.replace("{prefix}", prefix)
        content = page.read_text().replace("</body>", nav + "</body>")
        page.write_text(content)

_build_native_intro = build
def build(repo, out):
    _build_native_intro(repo, out)
    _add_family_navigation(repo, out)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--out',default='_site');a=ap.parse_args();build(Path(__file__).resolve().parents[1],Path(a.out).resolve())
