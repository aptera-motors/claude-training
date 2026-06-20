---
name: aptera-training-page
description: >-
  Create or edit pages for the Aptera AI Academy training site (dark canvas +
  gold brand style). Use when adding a new training article/lesson, editing an
  existing page, or building a standalone page that should "match the training
  site" / "feel like the other trainings". This is the aptera-motors/claude-training repo.
---

# Aptera AI Academy — Page Builder & Maintainer Skill

This repo **is** the Aptera AI Academy — Aptera's internal AI-training site, live at
https://aptera-motors.github.io/claude-training/. This skill captures the design
system, page conventions, and deploy flow so new content matches and ships cleanly.
It loads automatically when you open this repo in Claude Code.

## Source of truth

- **Stack:** Astro 5 + Tailwind v4 + Pagefind. Repo: `aptera-motors/claude-training`.
- **Design tokens:** `src/styles/global.css`. **Layout, nav & social tags:**
  `src/layouts/BaseLayout.astro`. **Nav/curriculum order (single source of truth):**
  `src/lib/site.ts` (`NAV_GROUPS` / `PAGE_ORDER`). **Components:** `src/components/*.astro`
  (PageHeader, Callout, KeyTakeaways, Tldr, CopyPrompt, TryItNow).
- **Content collections:** `src/content/` — `usecases` (Modes cards, JSON), `faq`,
  `glossary`, `wins` (markdown).
- **Ready-to-edit standalone starter:** `assets/standalone-template.html` next to this skill.

Always glance at `global.css` and an existing page before building — tokens/components
may have changed since this skill was written.

## Decide the mode first

- **Integrated page** (the usual case) — a real Astro page at `src/pages/<slug>/index.astro`
  using `BaseLayout` + the shared components, added to `NAV_GROUPS`/`PAGE_ORDER` in
  `src/lib/site.ts`. It gets nav placement, prev/next, progress tracking, Pagefind search,
  and social tags automatically.
- **Standalone page** — self-contained single HTML file (inline CSS), not in nav/search.
  Put it in `public/<slug>/index.html`; the build copies it through verbatim. Use only when
  asked for something outside the curriculum.

## Design system (dark theme, `color-scheme: dark`)

```
--canvas:#0D0E11  --card:#16181D  --card-hover:#1E2129  --border:#2A2D36
--text:#E8EAF0    --muted:#7A7F8E  --dim:#4A4F5E
--gold:#F5C518  (brand)   --chat:#4ECDC4  --cowork:#A78BFA  --code:#F97316  (accents)
--radius:12px
font: system-ui stack; html font-size 17px; body line-height ~1.7
```

- Brand mark = gold dot with glow `box-shadow:0 0 10px 2px rgba(245,197,24,.6)`.
- Headings: extrabold, tight tracking. Links: gold, underlined, 2px offset.
- Mode accents: teal = Chat, purple = Cowork, orange = Code.
- **Voice:** practical, friendly, skimmable; real Aptera-flavored examples; short paragraphs.

### Component patterns (mirror these)

- **Page header** — `PageHeader` (emoji icon, optional `⏱ N min read`, extrabold `<h1>`, muted subtitle).
- **TL;DR** — `Tldr` ("⚡ In 30 seconds" gold box) at the top.
- **Pull quote** — gold left border, faint gold bg, italic, gold attribution (see looping/context pages). Use only verified, attributed quotes.
- **Callout** — `Callout` (variant gold/chat/cowork/code), dashed border, bold colored title.
- **Key takeaways** — `KeyTakeaways` (🔑 box with a `<ul>`) to close a page.
- **Copyable prompt** — `CopyPrompt` (italic prompt + 📋 Copy button).
- **Try it now** — `TryItNow` (teal exercise box).
- **Footer is automatic** via BaseLayout.

## Build & deploy (push-to-deploy via GitHub Actions)

**Deploy is automatic.** Pages `build_type=workflow`. `.github/workflows/deploy.yml` runs on
every push to `main`: `npm ci` → `npm run build` (Astro + Pagefind) → upload artifact →
deploy. Base path is `/claude-training` (in `astro.config.mjs`).

1. Edit source under `src/` (and `public/`), commit to `main`, `git push origin main`.
2. The Action builds & deploys (~1–2 min). Watch: `gh run watch` or `gh run list --limit 1`.
   (The PAT needs `repo` + `workflow` scopes and SSO authorization for the aptera-motors org.)
3. Verify `https://aptera-motors.github.io/claude-training/<slug>/` returns 200; the
   `_astro/*.css` hash changes after a real content edit.

Before pushing a visual change, preview locally: `preview_start` config `training-site-preview`
(port 4321, serves `dist/` after `npm run build`); screenshot at desktop (≥1024px) **and** mobile.

Notes:
- The artifact deploy does NOT run Jekyll, so `_astro/` assets serve fine (no `.nojekyll` needed).
- The old `gh-pages` branch is an unused rollback fallback (flip Pages `build_type` to `legacy`
  to serve it again). Don't hand-push to it.

## Gotchas

- Scope file searches to the repo; `Glob` over a huge home directory can time out — prefer the
  repo path or `Get-ChildItem -Path <repo> ...`.
- Keep the model lineup current everywhere (Haiku / Sonnet / Opus / Fable) — it appears in
  Tokenomics, Choosing Your Model, glossary, and FAQ.
- Don't add a standalone page to `NAV_GROUPS` unless it should appear in the nav.
- End git commit messages with the `Co-Authored-By:` trailer.
