---
name: aptera-training-page
description: >-
  Create a webpage that matches the Aptera AI Academy training continuum
  (dark canvas + gold brand style). Use when the user wants a new training
  article, tips page, or standalone page that should "match the training
  site", "feel like the other trainings", or be published to the Aptera
  AI Academy / claude-training GitHub Pages site.
---

# Aptera AI Academy — Training Page Builder

Build pages that match Aptera's internal AI-training continuum: the **Aptera AI
Academy** site, live at https://aptera-motors.github.io/claude-training/.

## Source of truth

- **Repo / source:** `C:\Users\jacob\claude-training-site\` (Astro 5 + Tailwind
  v4 + Pagefind), pushed to `aptera-motors/claude-training`.
- **Design tokens:** `src/styles/global.css` — dark values in the `@theme` block,
  **light-theme overrides under `[data-theme="light"]`** (site has a theme toggle,
  system-preference default). **Layout & nav:** `src/layouts/BaseLayout.astro`.
  **Components:** `src/components/*.astro` (PageHeader, Callout, KeyTakeaways,
  Tldr, CopyPrompt, TryItNow, ModelCard, StatCard, BarRow, Badge, Quote,
  FeatureCard, ComparisonPair, LastReviewed, GlossaryLink).
- **Worked example built with this skill:** `public/looping/index.html`
  (standalone) → served at `/claude-training/looping/`. Copy it as a starting point.
- A ready-to-edit standalone starter lives next to this skill at
  `assets/standalone-template.html`.

Always glance at `global.css` and an existing component before building — tokens
may have changed since this skill was written.

## Decide the mode first

Ask (or infer) which the user wants:

- **Standalone page** — self-contained single HTML file, inline CSS, no nav, not
  in site search. Best when the user says "don't add it to the site yet" but
  wants matching style. This is what the looping article used. Put it in
  `public/<slug>/index.html` so the Astro build copies it through verbatim and it
  survives future deploys.
- **Integrated page** — a real Astro page at `src/pages/<slug>/index.astro` using
  `BaseLayout` + the shared components, added to `NAV_GROUPS`/`PAGE_ORDER` in
  `src/lib/site.ts`, indexed by Pagefind. Use when it should live in the nav and
  search of the training tool.

## Design system (dual-theme since July 2026 — dark default + light)

Dark tokens (light-theme overrides live under `[data-theme="light"]` in global.css):

```
--canvas:#0D0E11  --card:#16181D  --card-hover:#1E2129  --border:#2A2D36
--text:#E8EAF0    --muted:#A6ABB8  --dim:#868B99
--gold:#F5C518 (text/accent)  --gold-bright:#F5C518 (dot/glow, vivid in BOTH themes)
--chat:#4ECDC4  --cowork:#A78BFA  --code:#F97316  (accents)
--radius:12px
font: system-ui stack; html font-size 17px; body line-height ~1.7
```

- **NEVER hardcode hex/rgba in pages or components** — everything goes through
  the tokens so both themes render correctly. (Light gold is a deep amber
  #8A6A00; accents darken too.)
- Brand mark = gold dot with glow via `color-mix(in srgb, var(--color-gold-bright) 60%, transparent)`.
- Headings: extrabold, tight tracking. Links: gold, underlined, 2px offset.
- Mode accents: teal = Chat, purple = Co-Work, orange = Code.
- Motion utilities (integrated pages): `.reveal` scroll fade-up (needs BaseLayout's
  observer; gated by `html.reveal-ready`), `.hover-lift` on cards, `.bar-animate`,
  `.table-shell` + `.data-table` for tables. All reduced-motion-safe.
- **Editorial rules:** version-less model names in prose (versions only in dated
  pricing facts with `<LastReviewed>`); "Co-Work" hyphenated; "orchestrator" not
  "conductor"; model choice = "first dial", effort = "second dial"; link jargon
  first-mentions with `<GlossaryLink term="<glossary-filename>">`.
- New nav entries in `site.ts` need a `readMinutes` field (feeds total-course time).

### Component patterns (mirror these)

- **Page header** — big emoji icon + optional `⏱ N min read` pill, then
  extrabold `<h1>`, muted subtitle (max ~60ch), bottom border.
- **Pull quote** — gold left border, faint gold bg, italic, gold `<cite>`.
- **Callout** — `2px dashed` border (gold by default; or chat/cowork/code), faint
  card bg, bold colored title.
- **Key-takeaway / "Bottom line" box** — solid border, card bg, gold uppercase
  eyebrow (`🔑`, or `⚡ In 30 seconds` for a TL;DR).
- **Copyable prompt** — card box, italic prompt text, `📋 Copy` button that
  flips to `✅ Copied!` for 1.5s. Include the clipboard JS (with execCommand
  fallback for non-secure contexts).
- **Sidebar** (when asked for one) — card with a colored left border; on
  `min-width:1024px` `float:right; width:~290px` so body text wraps around it; on
  narrow screens it collapses to a full-width inline block. Place it in source
  order where it's contextually relevant so mobile reading order stays correct.
- **Footer:** `Aptera AI Academy · Built for the crew that builds the sun-powered future.`

## Build & deploy (GitHub Pages — push-to-deploy via Actions)

**As of 2026-06-19, deploy is automatic.** Pages `build_type=workflow` (GitHub
Actions). The workflow `.github/workflows/deploy.yml` runs on every push to
`main`: `npm ci` → `npm run build` (Astro + Pagefind) → `upload-pages-artifact`
→ `deploy-pages`. Base path is `/claude-training` (set in `astro.config.mjs`).

Deploy steps:

1. Edit source under `src/` (and `public/`), commit to `main`, `git push origin main`.
2. That's it — the Action builds and deploys. Watch it:
   ```
   gh run watch        # or: gh run list --limit 1
   ```
   (PAT in the `origin` remote has `repo` + `workflow` scopes; org uses SAML SSO,
   token is SSO-authorized.)
3. Verify the live URL `https://aptera-motors.github.io/claude-training/<slug>/`
   returns 200; the `_astro/*.css` hash should change after a real content edit.

Before pushing, sanity-check locally if the change is visual: `preview_start`
config `training-site-preview` (port 4321, serves `dist/` after `npm run build`),
navigate to `http://localhost:4321/claude-training/<slug>/`, screenshot at desktop
(≥1024px) **and** mobile to confirm any sidebar float collapses correctly.

Notes:
- The **artifact deploy does NOT run Jekyll**, so the old `_astro/` 404 problem is
  gone. `public/.nojekyll` still exists (harmless) but is no longer required.
- The old **`gh-pages` branch** is now unused (kept as a manual-rollback fallback:
  `PUT /repos/aptera-motors/claude-training/pages {"build_type":"legacy"}` would
  switch serving back to it). Don't hand-push to it anymore.
- `.github/` used to be git-ignored; that line was removed so the workflow is
  tracked. Pushing workflow changes requires the PAT's `workflow` scope.

## Gotchas

- `Glob` over `C:\Users\jacob` times out (huge home dir) — scope file searches to
  the repo path or use PowerShell `Get-ChildItem` with an explicit `-Path`.
- End git commit messages with the `Co-Authored-By:` trailer.
- Don't add a standalone page to `NAV_GROUPS` unless the user wants it in the nav.
