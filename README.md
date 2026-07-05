# Zofingen Treuhand

Marketing website for **Zofingen Treuhand AG** — Treuhand, tax advisory, and KMU services in Zofingen, Switzerland.

Built with **Nuxt 3**, **Vue 3**, **TypeScript**, and **Tailwind CSS**. Content is section-driven and bilingual (`de` / `en`), with server-rendered SEO metadata.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Nuxt 3, Vue 3 Composition API |
| Styling | Tailwind CSS |
| i18n | `@nuxtjs/i18n` |
| Content | PostgreSQL via headless CMS (see [Orbitype](#orbitype-cms) below) |
| Testing | Playwright |
| Deploy | Vercel |

## Quick start

```bash
npm ci
npm run setup
cp .env.example .env   # then fill in values
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/de`

For frontend-only work without a live CMS connection, set `ORBITYPE_MOCK=true` in `.env`.

## Project structure

```
pages/                    # Routes (generic CMS pages + blog detail)
components/sections/      # Section components (SectionHero, SectionFaq, …)
layouts/components/       # Navigation, Footer
server/api/               # Nitro API handlers
_scripts/                 # Setup, page seeds, WordPress import
agent/                    # Agent skills (Cursor + Claude Code)
public/img/               # Static assets per page/slug
```

### Routing

| Route | Purpose |
|-------|---------|
| `/` / `/{slug}` | CMS marketing pages (`home`, `kmu`, `kontakt`, `artikel`, …) |
| `/posts/{id}/{slug}` | Blog article detail (Artikel) |
| `/de/...` | German locale prefix |

### Key pages

Service pages, company info, resources, and lead flows — for example: Home, KMU, Firmengründung, Jahresabschluss, Lohnbuchhaltung, Steuern Privat, Vorsorge, Immobilien, Über uns, Kontakt, FAQ, Artikel (blog listing), Quiz, Ressourcen, Links.

## Content workflow

### Marketing pages

1. Design in Figma.
2. Implement or extend `components/sections/Section*.vue`.
3. Seed content via `_scripts/_seed-{slug}.mjs` or CMS SQL.
4. Verify at `/{slug}`.

```bash
node _scripts/_seed-home.mjs
node _scripts/_seed-kmu.mjs
# … see _scripts/_seed-*.mjs
```

### Blog (Artikel)

Blog posts live in the `posts` table with a fixed detail template (hero, TOC, body, related articles).

**Import from legacy WordPress** (one-shot):

```bash
node _scripts/_import-posts-from-wordpress.mjs
```

Requires `WP_API_*` vars in `.env`. Downloads featured images to `public/img/artikel/wp/`, replaces all posts, and refreshes `/artikel`.

**Refresh listing after post changes:**

```bash
node _scripts/_seed-artikel.mjs
```

Agent skill reference: `agent/skills/publish-blog/SKILL.md` (sync with `npm run sync:agent`).

## Development

### Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run typecheck    # TypeScript check
npm run eslint       # Lint
npm run test:e2e     # Playwright smoke tests
npm run sync:agent   # Sync Cursor + Claude agent skills
```

### First-time Playwright setup

```bash
npx playwright install
npm run test:e2e
```

Optional custom base URL:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm run test:e2e
```

### Environment variables

Copy `.env.example` to `.env`. Never commit `.env` — it may contain API keys and credentials.

Main groups:

- **Site** — `NUXT_PUBLIC_SITE_URL`, branding, GTM
- **CMS** — `ORBITYPE_API_SQL_URL`, `ORBITYPE_API_SQL_KEY`, `ORBITYPE_MOCK`
- **Figma** — `FIGMA_API_KEY`, `FIGMA_FILE_KEY` (design workflow)
- **WordPress** — `WP_API_URL`, `WP_API_USERNAME`, `WP_API_PASSWORD` (blog import only)

### Agent documentation

Dual IDE support (Cursor + Claude Code):

- [`CLAUDE.md`](CLAUDE.md) — always-on context for Claude Code
- [`agent/README.md`](agent/README.md) — skills, sync workflow
- `.cursor/rules/` — Cursor project rules

## Git workflow

- **`develop`** — active development branch
- **`main`** — production; changes land via pull request

## Common issues

- **Page shows welcome/onboarding instead of content**
  - Check CMS env vars in `.env`, or use `ORBITYPE_MOCK=true` for local UI work.
- **`/de` locale issues**
  - i18n is configured in `nuxt.config.ts`; routes resolve through `pages/[[slug]].vue`.
- **Blog listing links broken**
  - Run `node _scripts/_seed-artikel.mjs` after importing or publishing posts.
- **Port 3000 in use**
  - `npx nuxi dev --port 3001`
- **Playwright browser missing**
  - `npx playwright install`

---

## Orbitype CMS

Content is stored in PostgreSQL and edited through **Orbitype**, a headless CMS. The Nuxt app reads pages and posts via internal API routes that query the Orbitype SQL API.

This is an implementation detail — day-to-day work happens in Vue sections, seed scripts, and Figma. Orbitype matters when adding or changing CMS data directly.

### How it works (short)

1. User opens a URL.
2. Nuxt page calls `server/api/*`.
3. Handler queries the database; row includes a `sections` JSON array.
4. `components/sections/AnySection.vue` renders each section by `_orbi.component`.

### Sections contract

Each section object should have a human-readable field first (`title`, `name`, …), props in the middle, and `_orbi` last:

```json
{
  "title": { "en": "…", "de": "…" },
  "content": { "en": "<p>…</p>", "de": "<p>…</p>" },
  "_orbi": { "component": "SectionFeatureCards" }
}
```

Localized fields use `en` / `de` and render with `useTranslate()`.

### Live CMS mode

Set in `.env` (see `.env.example`):

```bash
ORBITYPE_MOCK=false
ORBITYPE_API_SQL_URL="https://core.orbitype.com/api/sql/v1"
ORBITYPE_API_SQL_KEY="your-api-key"
```

MCP config for Cursor / Claude is generated from `agent/mcp.template.json` via `npm run sync:agent`.

### Further reference

- Agent rule: [`.cursor/rules/10-architecture/03-orbitype-cms.mdc`](.cursor/rules/10-architecture/03-orbitype-cms.mdc)
- Skill: [`agent/skills/orbitype-cms/SKILL.md`](agent/skills/orbitype-cms/SKILL.md)
- Official docs: [Orbitype API Authentication](https://www.orbitype.com/docs/oQSPNY)
