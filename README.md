# Orbitype Headless CMS Template

Production-ready Nuxt starter for Orbitype-powered websites with section-driven pages, i18n (`en` + `de`), and server-rendered SEO metadata.

## Developer workflow (Figma → Cursor → Orbitype)

Typical flow for a new page or section:

1. **Figma** — Design layout, typography, and section structure.
2. **Inside Cursor** — Figma MCP (inspect frames), build `components/sections/Section*.vue`, publish `sections` JSON via Orbitype MCP (`sql_crud_execute`).
3. **Orbitype Intelligence** — Content operations in the Orbitype app (edit sections, review pages, manage CMS data).

Until the SQL API returns real rows, the welcome screen (`SectionWelcome`) explains setup and shows this CMS guide.

Full system reference for agents: [`.cursor/rules/10-architecture/03-orbitype-cms.mdc`](.cursor/rules/10-architecture/03-orbitype-cms.mdc). The onboarding welcome screen (`SectionWelcome`) repeats the workflow and CMS guide when `ORBITYPE_MOCK=true`, SQL env is missing, the API errors, or no CMS rows exist. Official Orbitype docs: [API Authentication](https://www.orbitype.com/docs/oQSPNY).

## 3-minute start

```bash
npm ci
npm run setup
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/de`

## Local CMS modes

Use one of these modes depending on your goal:

### Mock mode (frontend work, no CMS dependency)

```bash
ORBITYPE_MOCK=true npm run dev
```

When `ORBITYPE_MOCK=true`, the app always serves the built-in welcome page from `server/api/pages/index.get.ts`.

### Live Orbitype mode

Set environment variables in `.env`:

```bash
ORBITYPE_API_SQL_URL="https://core.orbitype.com/api/sql/v1"
ORBITYPE_API_SQL_KEY="your-api-key"
NUXT_PUBLIC_SITE_URL="https://your-client-domain.com"
NUXT_PUBLIC_GTM_ID=""
```

Then run:

```bash
npm run dev
```

If the SQL API is missing, invalid, or returns no rows, the same welcome/onboarding page is shown until CMS content is available.

## How the CMS works

This repository is a Nuxt marketing frontend that reads page content from PostgreSQL through internal API routes and the Orbitype SQL API.

Official Orbitype API and MCP docs: [Orbitype Docs - API Authentication](https://www.orbitype.com/docs/oQSPNY)

### Request flow

1. User opens a URL (for example `/`, `/platform`, `/docs/...`).
2. A Nuxt page in `pages/*` handles the route.
3. The page calls an internal endpoint in `server/api/*`.
4. The endpoint posts SQL to `ORBITYPE_API_SQL_URL` with `X-API-KEY: ORBITYPE_API_SQL_KEY` (see `server/api/pages/index.get.ts` and sibling handlers).
5. The database row is returned with a `sections` JSON array.
6. `components/sections/AnySection.vue` renders each section.

### Multiple websites in one setup

Orbitype supports multiple sites via separate connector-scoped API keys:

- One API key is scoped to one connector.
- Each connector can point to a different database/schema or content scope.
- In Cursor, define multiple MCP servers in `.cursor/mcp.json` (production site, marketing site, local, and so on).

Same section system and rendering code; different data per connector/key.

### Important files

| Area | Path |
|------|------|
| Generic pages | `pages/[[slug]].vue` → `server/api/pages/index.get.ts` |
| Detail routes | `pages/platform/[slug].vue`, `pages/solutions/[slug].vue`, `pages/vs/[slug].vue` |
| Posts / docs | `pages/posts/[id]/[[slug]].vue`, `pages/docs/[id]/[[slug]].vue` |
| API handlers | `server/api/*` |
| Section renderer | `components/sections/AnySection.vue` |
| Section type | `types/util/Section.d.ts` |
| Welcome fallback | `server/api/pages/index.get.ts` |

### Sections system

Each row includes metadata (`title`, `lead`, `keywords`, …) and `sections` (JSON array). Every section must include `_orbi.component` and should follow **key order for the CMS admin UI**:

1. **First key** — human-readable (`title`, `name`, `label`, …). The CMS uses this as the list label. Do not use `img` first (URLs are hard to skim).
2. **Middle keys** — section props (`content`, `variant`, …).
3. **Last key** — `_orbi` (component binding).

```json
{
  "title": { "en": "Feature callout", "de": "Feature-Highlight" },
  "content": { "en": "<p>...</p>", "de": "<p>...</p>" },
  "_orbi": { "component": "SectionFeatureCallout" }
}
```

`AnySection.vue` auto-loads all `components/sections/*.vue`. `_orbi.component` must match the Vue file name (for example `SectionFeatureCallout.vue` → `"SectionFeatureCallout"`). No registration file is needed.

Localized fields use `en` and `de` keys with `useTranslate()`.

### Cursor MCP for content editing

Create or update `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "orbitype-sql-prod-website": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": {
        "X-API-KEY": "${env:ORBITYPE_SQL_API_KEY_PROD_WEBSITE}"
      }
    },
    "orbitype-sql-prod-marketing": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": {
        "X-API-KEY": "${env:ORBITYPE_SQL_API_KEY_PROD_MARKETING}"
      }
    },
    "orbitype-s3-public-prod": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": {
        "X-API-KEY": "${env:ORBITYPE_S3_PUBLIC_API_KEY_PROD}"
      }
    }
  }
}
```

Recommended first call in each Cursor session: `orbitype_get_context`, then `sql_readonly_query` for reads and `sql_crud_execute` for writes.

### Example: add a new section

**1. Create** `components/sections/SectionFeatureCallout.vue` (see existing sections for `I18nString` props and `SafeHtml` usage).

**2. Append to a page** (for example `home`):

```sql
UPDATE pages
SET sections = (
  COALESCE(sections, '[]'::json)::jsonb
  || jsonb_build_array(
    jsonb_build_object(
      'title', jsonb_build_object(
        'en', '<p>Why teams switch to Orbitype</p>',
        'de', '<p>Warum Teams zu Orbitype wechseln</p>'
      ),
      'content', jsonb_build_object(
        'en', '<p>Run CRM, outreach, and automation in one place.</p>',
        'de', '<p>CRM, Outreach und Automatisierung an einem Ort.</p>'
      ),
      'variant', 'highlight',
      '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
    )
  )
)::json
WHERE slug = 'home';
```

**3. Verify**

```sql
SELECT slug, sections FROM pages WHERE slug = 'home';
```

Open `/` and confirm the section appears.

**Insert at a specific position** (second section, index `1`):

```sql
UPDATE pages
SET sections = jsonb_insert(
  COALESCE(sections, '[]'::json)::jsonb,
  '{1}',
  jsonb_build_object(
    'title', jsonb_build_object('en', 'Inserted section', 'de', 'Eingefuegter Abschnitt'),
    'content', jsonb_build_object('en', '<p>Inserted by SQL.</p>', 'de', '<p>Per SQL eingefuegt.</p>'),
    '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
  ),
  false
)::json
WHERE slug = 'home';
```

### Safe content workflow

1. Read current data with `sql_readonly_query`.
2. Save a backup copy of the current `sections` JSON.
3. Apply updates with `sql_crud_execute`.
4. Re-read the row and verify JSON.
5. Open the target URL and confirm rendering and SEO.

### Common pitfalls

- `_orbi` not last, or no human-readable first key (CMS list becomes hard to scan).
- Component name mismatch between `_orbi.component` and the `.vue` file name.
- Missing required section props.
- Invalid `sections` shape (must stay an array of objects).
- Missing `en` / `de` on localized fields.
- Editing the wrong connector — run `orbitype_get_context` first.

### Quick SQL snippets

```sql
SELECT id, slug, updated_at FROM pages ORDER BY updated_at DESC;

SELECT section->'_orbi'->>'component' AS component_name
FROM pages, json_array_elements(sections) AS section
WHERE slug = 'home';

SELECT p.slug
FROM pages p, json_array_elements(p.sections) AS section
WHERE section->'_orbi'->>'component' = 'SectionFeatureCallout';
```

For AI-assisted edits in this repo, see `.cursor/rules/10-architecture/03-orbitype-cms.mdc`.

## What to edit first

1. **Branding and shell layout**
   - `layouts/components/Navigation.vue`
   - `layouts/components/Footer.vue`
   - `app.vue`
2. **Welcome/fallback content**
   - `server/api/pages/index.get.ts`
   - `components/sections/SectionWelcome.vue`
3. **Page rendering**
   - `pages/[[slug]].vue`
   - `components/sections/AnySection.vue`
4. **Styles**
   - `assets/css/style.css`

## End-to-end smoke checks

First-time Playwright browser install:

```bash
npx playwright install
```

Run smoke tests:

```bash
npm run test:e2e
```

Optional custom base URL:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm run test:e2e
```

Current smoke coverage:

- homepage render on `/`
- locale route render on `/de`
- first welcome step expand/collapse behavior

## Common issues

- **Home page does not load CMS content**
  - Check `.env` values for `ORBITYPE_API_SQL_URL` and `ORBITYPE_API_SQL_KEY`.
  - Ensure the SQL connector/project is enabled on the Orbitype side for this key.
  - If you want local-only mode, set `ORBITYPE_MOCK=true`.
- **`/de` shows unexpected content**
  - Verify `@nuxtjs/i18n` is enabled in `nuxt.config.ts`.
  - Ensure route resolution is handled through `pages/[[slug]].vue`.
- **Playwright test fails because browser is missing**
  - Run `npx playwright install` once.
- **Port 3000 is already taken**
  - Start on another port: `npx nuxi dev --port 3001`.
