---
name: build-figma-page
description: >-
  Build a Zofingen Treuhand marketing page from a Figma design. Use when
  implementing a new page, translating Figma nodes to Vue sections, downloading
  assets, or running visual fidelity checks against Figma.
---

# Build page from Figma

End-to-end workflow for adding a marketing page to the Zofingen Treuhand site.

## Prerequisites

- Figma file key: `6Y050apOpdpZ3ZeVFdjunk` (also in `FIGMA_FILE_KEY` env)
- Figma MCP or REST API access (`FIGMA_API_KEY`)
- Orbitype SQL credentials in `.env` for seeding
- Dev server: `npm run dev`

## Checklist

### 1. Extract design context

- Get `nodeId` from Figma URL (convert `-` to `:` in node-id param).
- Call Figma MCP `get_design_context` with `fileKey` + `nodeId`.
- Capture screenshot for later fidelity comparison.
- Read Figma comments for CTA URLs if present (`GET /v1/files/{fileKey}/comments`).

### 2. Research existing components

Before creating new sections, search `components/sections/` for reusable components:

- `SectionPageHero` — inner pages with hero background
- `SectionHero` — home-style hero
- `SectionFeatureCards`, `SectionTextMedia`, `SectionQuoteCta`, `SectionFaq`, etc.
- Local sub-components: `_SectionButton.vue`, `_SectionHeading.vue`

Follow the `zofingen-rules` skill for UI research guidelines.

### 3. Download assets

- Save images to `public/img/<slug>/` (e.g. `public/img/quiz/hero-bg.png`).
- Reference in seed JSON as `/img/<slug>/<filename>`.
- Prefer `.webp` or `.png` as in existing pages.

### 4. Build or extend section components

- New sections go in `components/sections/Section*.vue`.
- Local-only components: prefix with `_` (e.g. `_SectionButton.vue`).
- Use Composition API, TypeScript, Tailwind utility classes.
- Localized strings: `I18nString` with `en`/`de`; render via `useTranslate()`.
- Keep files under ~150 lines; extract sub-components when needed.

### 5. Create seed script

Create `_scripts/_seed-<slug>.mjs` following the `seed-pages` skill.

- Map each Figma section to a `sections` array entry.
- `_orbi.component` must match Vue filename.
- Put human-readable field (`title`, `name`) first; `_orbi` last.

### 6. Wire CTAs and links

| Link type | Format | Examples |
|-----------|--------|----------|
| Internal pages | Relative path | `/kontakt`, `/rechner`, `/ressourcen` |
| Calendly | Full URL | `https://calendly.com/ph-bally/30min` |
| Calendly callback | Full URL | `https://calendly.com/ph-bally/rueckruf-termin` |
| Kundenportal | Full URL | `https://portalv2.bayo.ch/zofingentreuhand/auth/signin` |

Do not hardcode the production domain for internal links.

### 7. Seed and verify

```bash
node _scripts/_seed-<slug>.mjs
npm run dev
```

Open `http://localhost:3000/<slug>` (or `http://localhost:3000/de/<slug>` with i18n).

### 8. Visual fidelity check

1. Screenshot rendered page (Playwright or browser).
2. Compare against Figma MCP screenshot.
3. Fix spacing, typography, colors, missing assets.
4. Repeat until layout matches design intent.

### 9. Navigation (if new top-level page)

Update `layouts/components/Navigation.vue` and `layouts/components/Footer.vue` if the page needs nav links.

## Existing pages reference

| Slug | Figma node (approx) | Seed script |
|------|---------------------|-------------|
| home | 7:234 | `_seed-home.mjs` |
| kmu | 89:793 | `_seed-kmu.mjs` |
| quiz | 2054:1121 | `_seed-quiz.mjs` |
| quiz-danke | 2055:1611 | `_seed-quiz-danke.mjs` |
| ressourcen | 505:886 | `_seed-ressourcen.mjs` |

Use these as templates for structure and conventions.

## Common issues

- **Sticky nav overlay**: Main nav uses `-mb-[76px]` to overlay hero; do not wrap in a collapsing container.
- **i18n hydration**: `@nuxtjs/i18n` requires unhead shim — see `CLAUDE.md` / `nuxt.config.ts`.
- **Stale content after seed**: Ensure `DELETE FROM pages WHERE slug = :slug` runs before `INSERT`.
