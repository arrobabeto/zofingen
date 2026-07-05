---
name: orbitype-cms
description: >-
  Orbitype headless CMS workflow for Zofingen Treuhand. Use when adding or
  editing sections, pages JSON, Orbitype MCP SQL, components/sections/*.vue,
  or debugging CMS content rendering.
---

# Orbitype Headless CMS

Official API auth: [Orbitype Docs - API Authentication](https://www.orbitype.com/docs/oQSPNY)

## When to use

- Adding or changing `components/sections/*.vue`
- Editing `pages` / `posts` content or `sections` JSON
- Configuring MCP for Orbitype SQL or S3
- Building marketing pages from Figma designs
- Debugging welcome/fallback when SQL API is not configured

## When not to use

- Pure layout/shell changes (`Navigation`, `Footer`) with no CMS sections
- Local mock-only work (`ORBITYPE_MOCK=true`) when DB writes are out of scope

## Workflow

1. **Design** — Pages and sections in Figma (`FIGMA_FILE_KEY` in `.env`).
2. **Implement** — Figma MCP for specs; build `components/sections/Section*.vue`.
3. **Persist** — Orbitype MCP or seed script to write `sections` JSON to PostgreSQL.
4. **Verify** — Browser check on target URL; validate i18n and SEO fields.

Do not hand-edit production JSON without a read-first backup of the current `sections` array.

## Request flow

1. User opens a URL (`/`, `/kmu`, `/quiz`, …).
2. `pages/[[slug]].vue` handles the route.
3. Page calls `server/api/pages`.
4. Handler POSTs SQL to `ORBITYPE_API_SQL_URL` with `X-API-KEY: ORBITYPE_API_SQL_KEY`.
5. Row returns with `sections` JSON array.
6. `components/sections/AnySection.vue` renders each entry by `_orbi.component`.

Welcome content is served from `server/api/pages/index.get.ts` when `ORBITYPE_MOCK=true`, SQL env is missing, the API errors, or no rows exist.

## Codebase map

| Area | Path |
|------|------|
| Generic pages | `pages/[[slug]].vue` → `server/api/pages/index.get.ts` |
| Posts | `pages/posts/[id]/[[slug]].vue` |
| API handlers | `server/api/*` |
| Section renderer | `components/sections/AnySection.vue` |
| Section type | `types/util/Section.d.ts` |
| Welcome fallback | `server/api/pages/index.get.ts`, `components/sections/SectionWelcome.vue` |

## Sections contract

Each page row has metadata (`title`, `lead`, `keywords`, …) and `sections` (JSON array).

### JSON key order (required for CMS admin)

Orbitype renders sections from JSON key order. The **first key** is the skimmable list title in the CMS.

1. **First** — human-readable field: `title`, `name`, `label` (`I18nString` with `en`/`de` when applicable).
2. **Middle** — remaining section props.
3. **Last** — `_orbi` with `component`.

Do **not** put `_orbi` or `img` first.

```json
{
  "title": { "en": "Feature callout", "de": "Feature-Highlight" },
  "content": { "en": "<p>...</p>", "de": "<p>...</p>" },
  "variant": "highlight",
  "_orbi": { "component": "SectionFeatureCallout" }
}
```

`_orbi.component` must match the Vue file name in `components/sections/` (e.g. `SectionHero.vue` → `"SectionHero"`).

Localized fields use `en` and `de` keys; render with `useTranslate()`.

## MCP setup (Cursor + Claude Code)

MCP config is generated from `agent/mcp.template.json`:

- **Cursor**: `.cursor/mcp.json`
- **Claude Code**: `.mcp.json` (repo root)

Run `npm run sync:agent` after changing the template.

**Every session:** `orbitype_get_context` → `sql_readonly_query` (reads) → `sql_crud_execute` (writes). Confirm connector before mutating data.

## Add a section (checklist)

1. Create `components/sections/SectionName.vue` with typed props (`I18nString`, optional variants).
2. Add section JSON to seed script or via SQL. Put `title` first, `_orbi` last. Props must match Vue `defineProps`.
3. `SELECT slug, sections FROM pages WHERE slug = '...'` to verify.
4. Open the URL; check layout, i18n, and SEO.

## Safe content workflow

1. `sql_readonly_query` — read current row.
2. Copy backup of `sections` JSON.
3. `sql_crud_execute` — apply change.
4. Re-read row; validate JSON shape (array of objects).
5. Browser check on target URL.

## Common pitfalls

- `_orbi` or `img` placed first — CMS list labels become useless.
- `_orbi.component` does not match the `.vue` filename.
- Missing required section props → blank UI.
- `sections` not a JSON array of objects.
- Missing `en` / `de` on translated fields.
- Wrong connector — always run `orbitype_get_context` first.
- Seed scripts without `DELETE` before `INSERT` → duplicate rows, stale API data.

## Quick SQL snippets

```sql
SELECT id, slug, updated_at FROM pages ORDER BY updated_at DESC;

SELECT section->'_orbi'->>'component' AS component_name
FROM pages, json_array_elements(sections) AS section
WHERE slug = 'home';

SELECT p.slug
FROM pages p, json_array_elements(p.sections) AS section
WHERE section->'_orbi'->>'component' = 'SectionFeatureCallout';
```
