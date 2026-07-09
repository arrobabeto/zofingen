# Zofingen Treuhand — Claude Code context

Nuxt 3 marketing site for Zofingen Treuhand AG. Content is stored in Orbitype (PostgreSQL) as JSON sections rendered by Vue components.

## Stack

- **Framework**: Nuxt 3, Vue 3 Composition API, TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Orbitype headless (sections JSON in `pages` table)
- **i18n**: `@nuxtjs/i18n` (`de` / `en`)
- **Deploy**: Vercel

## Git workflow

- Work on `develop`, open PRs to `main`
- Do not force-push to `main`

## Figma

- File key: `6Y050apOpdpZ3ZeVFdjunk`
- Env: `FIGMA_API_KEY`, `FIGMA_FILE_KEY`

## Project skills

Invoke with `/skill-name` or let Claude auto-load when relevant:

| Skill | Use for |
|-------|---------|
| `/orbitype-cms` | Sections, CMS JSON, Orbitype MCP |
| `/build-figma-page` | New page from Figma design |
| `/seed-pages` | `_scripts/_seed-*.mjs` patterns |
| `/zofingen-rules` | All coding standards and patterns |

After editing `agent/skills/` or `.cursor/rules/`, run `npm run sync:agent`.

## Key paths

| Area | Path |
|------|------|
| Pages | `pages/[[slug]].vue` |
| Sections | `components/sections/` |
| Navigation | `layouts/components/Navigation.vue` |
| Footer | `layouts/components/Footer.vue` |
| API | `server/api/` |
| Seeds | `_scripts/_seed-*.mjs` |
| Agent docs | `agent/` (canonical skills source) |
| Cursor rules | `.cursor/rules/` |

## Conventions

### Navigation

- Use `navigateTo` from `#app`, not `router.push`
- Import Nuxt composables explicitly from `#app`
- Internal links: relative paths (`/kontakt`, `/rechner`, `/ressourcen`)
- External links: full URLs (Calendly, Kundenportal BAYO)

### Vue templates

- `v-for="x of items"` (not `in`)
- Short loop variable names: `v-for="s of sections"`

### TypeScript

- Route params: `route.params["id"]` (bracket notation)

### API

- Pass identifiers in body/query params, not URL path segments

### Error handling

- Do not handle 404 in components when handled globally
- Use `const item = ref({} as Item)` instead of optional types

### CMS sections

- JSON key order: human-readable field first (`title`), `_orbi` last
- `_orbi.component` must match Vue filename in `components/sections/`
- Localized fields: `{ en: "...", de: "..." }` via `useTranslate()`

### Seeds

- Always `DELETE FROM pages WHERE slug = :slug` before `INSERT`
- Run: `node _scripts/_seed-<slug>.mjs`

## Known fix: i18n hydration

`@nuxtjs/i18n@8.5.6` imports `getActiveHead` from `unhead`, removed in Nuxt 3.21 / unhead v2. Fixed via:

- `shims/unhead-compat.mjs`
- Vite alias in `nuxt.config.ts`: `{ find: /^unhead$/, replacement: unheadShim }`

## MCP configuration

Generated from `agent/mcp.template.json`:

- Claude Code: `.mcp.json` (repo root)
- Cursor: `.cursor/mcp.json`

Orbitype session flow: `orbitype_get_context` → `sql_readonly_query` → `sql_crud_execute`.

## Commands

```bash
npm run dev          # Dev server
npm run sync:agent   # Sync rules + skills for Cursor and Claude
node _scripts/_seed-<slug>.mjs   # Seed a page
npm run test:unit    # Form payload + validation unit tests
npm run test:e2e     # Playwright tests
```

## Form submissions (SendGrid via Orbitype)

- UI: footer PDF popup (`_PdfHandbookForm.vue`), `/kontakt` (`SectionContact.vue`)
- API: `POST /api/forms/submit` → `ORBITYPE_FORM_WEBHOOK_URL` (server-only env)
- Orbitype workflow setup: `_scripts/orbitype-form-workflow.mjs`

## CTA destinations (reference)

| Context | Destination |
|---------|-------------|
| Home hero, Vorsorge | `https://calendly.com/ph-bally/30min` |
| KMU, Jahresabschluss | `https://calendly.com/ph-bally/rueckruf-termin` |
| Most service pages | `/kontakt` |
| Calculator | `/rechner` |
| Kundenportal | `https://portalv2.bayo.ch/zofingentreuhand/auth/signin` |
