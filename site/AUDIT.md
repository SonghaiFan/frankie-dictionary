# Blue Dictionary introduction audit

Audited 2026-11-06. Scope: standalone `site/` only. No app behavior, README, package, lockfile, repository setting or saved favorite changed.

## Real app opened

Opened https://blue-dictionary.vercel.app in Ego. Captured empty home and a live `晚安` search result. Opened its actual shared-word route, waited for the card animation and fonts, and captured the actual Good night card. Pressed Right Arrow and verified the next entry was 礼物 / Present. Four genuine current screenshots are stored under `site/assets/*-current.png`. No generated UI is passed off as a screenshot. Did not send share messages, export files, modify favorites or turn on audio.

## Source code examined

- `public/data/data.js`: poetic reinterpretations with 中文, 英文, 释义, 英文释义, 出处. Examples include 晚安 as 每天聊天的存档点. This is not a standard Chinese reference dictionary. Duplicate Chinese names exist, so examples and direct sharing select the first matching entry.
- `app/page.jsx`: random placeholder, selected word state, shared `?word=` route, previous/next index and keyboard handling.
- `hooks/useFuseSearch.js`: Fuse searches 中文, 英文 and 出处 at threshold0.2, not meanings, pinyin or an external AI service.
- `components/SearchInput.jsx`: result selection, arrows/Tab/Enter, empty-query exploration and clearing.
- `components/BlueCard.jsx`: the actual word-card fields, touch and keyboard navigation, browser-local favorites, PNG export using html2canvas and Web Share/clipboard fallback.
- `components/Vinyl.jsx`: local looping lo-fi music and circular photo; no word-pronunciation feature.
- `components/Title.jsx`, `app/globals.css`, `tailwind.config.js`: #130f94 Klein blue, large Chinese serif words, quiet white home, handwritten English within cards.
- `components/About.jsx` and `Footer.jsx`: creator/contributor acknowledgement and music attribution. Intro explains source credits as the collection’s supplied attribution rather than independently verified quotations.

## Design and explanation

Reading this as an introduction to a personal literary word collection, with its actual blue card and Chinese serif identity. Variance5, motion1, density3. Preserve app palette and physical card shape; no forced family-wide color palette. Shared structure: overview, concept/sample, real functions, first visit, screens, runtime/setup, maintenance.

The sample is a small real-data adaptation of BlueCard’s fields, not a mock screenshot or full search component. Build extracts first matching source records and fails if the selected examples disappear. It stores nothing. Original local Noto Serif SC is subset to216KB with OFL attribution, without adding font requests/dependencies to CI.

[Official Fuse.js introduction](https://www.fusejs.io/) was consulted to confirm fuzzy search means approximate matching. App-specific searchable fields and threshold are supported directly by its hook. No external linguistic or scientific claims are made.

## Checks

- Python standard-library build: EN root and Chinese `zh/`.
- Local asset/link checker: two pages, zero issues.
- `node --check site/sample.js`; `git diff --check`.
- Browser review and sample/mobile checks recorded after final rendering below.

- Browser-tested all three reading sample buttons: each changed word, interpretation and attribution together; exactly one button remained selected.
- Both EN and zh at actual390×844 target emulation had `scrollWidth === innerWidth ===390`. All gallery images loaded after being brought into test loading scope. Desktop and mobile screenshots visually inspected; per-page emulation cleared afterward.
- Root local server preview: http://127.0.0.1:8320/dictionary-intro-preview/ .
