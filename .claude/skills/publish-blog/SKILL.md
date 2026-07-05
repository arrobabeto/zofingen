---
name: publish-blog
description: >-
  Publish a Zofingen Treuhand blog post (Artikel) to the Orbitype posts table.
  Use when creating or updating blog articles, seeding post content, or
  ensuring posts follow the SectionArtikelContent contract and fixed template.
---

# Publish blog post

Publishes an Artikel to the `posts` table. The visual template is fixed in
[`pages/posts/[id]/[[slug]].vue`](pages/posts/[id]/[[slug]].vue) — only data changes.

## Prerequisites

- `.env` with `ORBITYPE_API_SQL_URL` and `ORBITYPE_API_SQL_KEY`
- Hero/featured images in `public/img/artikel/`
- Run listing refresh after publish: `node _scripts/_seed-artikel.mjs`

## Post row contract

| Field | Type | Purpose |
|-------|------|---------|
| `title` | `{ de, en }` | H1 on detail page |
| `lead` | `{ de, en }` HTML | Short excerpt (~160 chars plain) for cards + SEO |
| `img` | string | Hero + OG image, e.g. `/img/artikel/featured.png` |
| `sections` | array | Exactly one `SectionArtikelContent` block |
| `keywords` | string[] | SEO keywords |
| `status` | `{ value: "published" }` | Required for listing + related posts |
| `created_at` | ISO timestamp | Display date |

## Sections contract (required shape)

```json
{
  "title": { "de": "Inhalt", "en": "Content" },
  "content": {
    "de": "<h2>Grundlagen</h2><p>...</p>",
    "en": "<h2>Basics</h2><p>...</p>"
  },
  "_orbi": { "component": "SectionArtikelContent" }
}
```

Rules:

1. **`title` first, `_orbi` last** in JSON key order.
2. **`content`** = full article HTML (not `lead`).
3. Use **`h2`** / **`h3`** for sections — TOC is auto-generated from headings.
4. Optional `id` on headings; missing ids are slugified at render time.
5. Internal links: relative (`/kontakt`). External: full URLs.

## Checklist

1. Write `title`, `lead` (excerpt), and full `content` HTML (`de` + `en`).
2. Place featured image at `public/img/artikel/<name>`.
3. Build `sections` with single `SectionArtikelContent` entry.
4. Set `status.value` to `"published"`.
5. **DELETE** existing row by German title, then **INSERT**:

```javascript
await sql("DELETE FROM posts WHERE title->>'de' = :deTitle", { deTitle })
await sql(
  `INSERT INTO posts (title, lead, img, sections, keywords, status, created_at, updated_at)
   VALUES (:title::json, :lead::json, :img, :sections::json, :keywords::json, :status::json, :created_at::timestamptz, :updated_at::timestamptz)
   RETURNING id`,
  { ... }
)
```

6. Verify detail URL: `/posts/{id}/{slugified-title}`
7. Refresh listing links: `node _scripts/_seed-artikel.mjs`
8. Browser check: TOC appears when 2+ headings exist

## WordPress import (one-shot)

Migrate all published blogs from the legacy WordPress site:

```bash
node _scripts/_import-posts-from-wordpress.mjs
```

Requires `WP_API_URL`, `WP_API_USERNAME`, `WP_API_PASSWORD` in `.env`. Replaces all rows in `posts`, downloads featured images to `public/img/artikel/wp/`, and refreshes `/artikel`.

## Reference seed

Manual single-post seed (deprecated demo):

```bash
# node _scripts/_seed-post-mitarbeiterbeteiligung.mjs  # use import instead
node _scripts/_seed-artikel.mjs
```

## Template components (do not change per post)

| Component | Role |
|-----------|------|
| `SectionPageHero` | "Artikel" hero |
| `SectionArtikelHeader` | Title + date |
| `SectionArtikelToc` | Auto TOC from headings |
| `SectionArtikelContent` | Article body |
| `SectionArtikelRelated` | Latest 3 published posts |

## Common pitfalls

- Putting full article in `lead` instead of `sections[0].content`
- Forgetting `DELETE` before `INSERT` → duplicate rows
- `status` not `"published"` → post hidden from listing/related
- No `h2`/`h3` in content → TOC hidden (needs 2+ headings)
