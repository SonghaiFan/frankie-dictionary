# Blue Dictionary introduction maintenance / 介绍页维护

English is served at https://songhaifan.github.io/frankie-dictionary/ and Chinese at `zh/`. The actual app remains https://blue-dictionary.vercel.app. The introduction is built independently with Python’s standard library; it does not build Next.js or read env files.

英文默认，中文位于 `zh/`。介绍页独立构建，不构建 Next.js，也不读取环境变量文件。

## Content and source / 内容与来源

- `site/content.json`: all bilingual visitor explanations, gallery captions, runtime and limitations. Update both language objects together. The intro no longer parses README paragraphs. / 所有双语说明与图片说明在此维护，不再从 README 推断结构。
- `site/project.json`: app/Pages URLs and the source media manifest. / 维护链接与素材登记。
- `site/build.py` → `samples()`: directly extracts the **first** bundled entries named `晚安`, `梦`, `欣赏` from `public/data/data.js`. This intentionally matches the app’s first-match shared-word lookup; duplicate word names can exist. It never evaluates JavaScript. If a selected word disappears, build fails so the sample cannot silently show invented text. / 从真实词库提取指定词名的第一条记录；词名可能重复，行为与应用分享链接首次匹配保持一致。词条消失时构建会报错。
- `site/sample.js`: small reading sample of real data fields, adapted from `components/BlueCard.jsx`. It has no search, favorites, export or storage. Do not label it the complete app. / 只是一段真实词条阅读样例，不要当作完整应用。
- For functional changes, reread `app/page.jsx`, `hooks/useFuseSearch.js`, `components/SearchInput.jsx`, `components/BlueCard.jsx` and `components/Vinyl.jsx`. Music is background lo-fi, not word pronunciation. The collection contains creative reinterpretations, not standard dictionary definitions. / 行为更新后核对这些文件；背景音乐不是发音，词条是创作重释而非标准释义。

## Screenshot replacement / 截图替换

All four files below were captured from the current live app on 2026-11-06 at 1468×1247. Replace them after relevant UI changes; wait for card animation and fonts to settle. Use only public bundled words. Never screenshot private local data. Hero uses CSS cropping of the unchanged card screenshot.

以下均为真实线上截图；界面变化后重新采集，等待卡片动画和字体加载完成。主图仅使用 CSS 裁切，保留原始截图。

| Asset | Capture flow / 采集步骤 |
| --- | --- |
| `site/assets/home-current.png` | Open app fresh, music paused, empty search. / 首页空搜索，暂停音乐。 |
| `site/assets/search-current.png` | Type `晚安` and leave result list visible. / 搜索“晚安”，保留结果列表。 |
| `site/assets/card-current.png` | Open `https://blue-dictionary.vercel.app/?word=晚安`, wait for fully visible card. / 打开分享链接并等待卡片完整显示。 |
| `site/assets/browse-current.png` | From the open 晚安 card, press Right Arrow to 礼物. / 从“晚安”按右方向键进入“礼物”。 |

The hero and gallery filenames are referenced in `site/build.py`; captions live in `site/content.json` and the manifest. Keep all three in agreement. The old `site/assets/search.png` and README banner assets are retained; this intro refresh does not rewrite approved banners. OG image is copied from `docs/readme/banner.png`.

文件名在构建器引用，图片说明与素材登记需同步。旧截图与已确认 banner 保留；Open Graph 使用现有 banner。

## Typography / 字体

`site/assets/noto-intro.woff2` is a subset of the app’s actual `public/font/Noto_Serif_SC/NotoSerifSC-Regular.otf`. The build copies the original `OFL.txt` into `media/`. No Google Fonts request is added. Regenerate after adding Chinese copy/words (requires optional fonttools + Brotli only on the maintenance machine, not in Pages CI):

使用应用已有 Noto Serif SC 字体的子集，新增中文后重新生成；Pages 构建不依赖字体工具。

```sh
cat site/content.json site/build.py public/data/data.js > /tmp/blue-intro-font-text.txt
pyftsubset public/font/Noto_Serif_SC/NotoSerifSC-Regular.otf \
  --text-file=/tmp/blue-intro-font-text.txt --flavor=woff2 \
  --output-file=site/assets/noto-intro.woff2
```

## Preview and publish / 预览与发布

```sh
python3 site/build.py --out _site
python3 -m http.server 8080 --directory _site --bind 127.0.0.1
```

Open root and `/zh/` at desktop and 390px mobile width. Test all three sample buttons: the word, English label, interpretation, paraphrase and attribution must change together. Check all image links, `#use`, `#start`, app link, browser keyboard focus and narrow-screen overflow. The first sample stays readable without JavaScript.

检查双语、手机布局和三个样例切换，词名、释义、转述、出处应一起更新。检查所有图片和入口，无 JavaScript 时第一条样例仍可读。

Commit only reviewed `site/` changes and any deliberately changed Pages configuration. Push `main`; `.github/workflows/pages.yml` builds `_site/` and publishes GitHub Pages. Do not commit generated `_site/`, env files or unrelated application edits. App deployment on Vercel is separate.

只提交本次介绍页文件。GitHub Pages 与 Vercel 应用部署互相独立，不提交生成目录、环境变量或其他代码修改。

The app’s existing Frankie signature is `public/frankie-signature.svg`; it links to this introduction. / 应用内已有签名链接到此介绍页。
