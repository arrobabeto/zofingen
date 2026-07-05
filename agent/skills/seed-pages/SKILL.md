---
name: seed-pages
description: >-
  Create or update Orbitype page seed scripts (_scripts/_seed-*.mjs). Use when
  seeding CMS content, updating CTA links, fixing duplicate page rows, or
  publishing sections JSON to the pages table.
---

# Seed pages into Orbitype

Seed scripts write page content directly to the Orbitype `pages` table via the SQL API.

## Existing seeds

```
_scripts/_seed-home.mjs
_scripts/_seed-kmu.mjs
_scripts/_seed-firmengruendung.mjs
_scripts/_seed-jahresabschluss.mjs
_scripts/_seed-lohnbuchhaltung.mjs
_scripts/_seed-steuern-privat.mjs
_scripts/_seed-vorsorge.mjs
_scripts/_seed-immobilien.mjs
_scripts/_seed-grundstueckgewinnsteuern.mjs
_scripts/_seed-ueber-uns.mjs
_scripts/_seed-kontakt.mjs
_scripts/_seed-faq.mjs
_scripts/_seed-artikel.mjs
_scripts/_seed-links.mjs
_scripts/_seed-ressourcen.mjs
_scripts/_seed-quiz.mjs
_scripts/_seed-quiz-danke.mjs
```

## Run a seed

```bash
node _scripts/_seed-<slug>.mjs
```

Requires `.env` with `ORBITYPE_API_SQL_URL` and `ORBITYPE_API_SQL_KEY`.

## Script template

```javascript
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const env = Object.fromEntries(
  readFileSync(join(root, ".env"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]
    }),
)

const URL = env.ORBITYPE_API_SQL_URL
const KEY = env.ORBITYPE_API_SQL_KEY
const img = (name) => `/img/<slug>/${name}`

const sections = [
  {
    title: "Page title",
    subtitle: "Subtitle",
    image: img("hero-bg.png"),
    _orbi: { component: "SectionPageHero" },
  },
  // ... more sections
]

const title = { de: "German title", en: "English title" }
const keywords = ["keyword1", "keyword2"]

async function sql(query, bindings) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "X-API-KEY": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  console.log("status:", res.status, "->", text)
  return res
}

async function run() {
  const slug = "<slug>"

  // REQUIRED: delete before insert to avoid duplicate rows
  await sql("DELETE FROM pages WHERE slug = :slug", { slug })

  await sql(
    "INSERT INTO pages (title, slug, sections, keywords) VALUES (:title::json, :slug, :sections::json, :keywords::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      slug,
    },
  )
}

run()
```

## Required patterns

### DELETE before INSERT

Always delete the existing row by slug before inserting. Without this, duplicate rows accumulate and the API may serve stale data.

```javascript
await sql("DELETE FROM pages WHERE slug = :slug", { slug: "kmu" })
await sql("INSERT INTO pages (...) VALUES (...)", { ... })
```

### Section JSON key order

1. Human-readable field first (`title`, `name`, `label`)
2. Content props in the middle
3. `_orbi` last

### Link conventions

```javascript
const KONTAKT = "/kontakt"
const RECHNER = "/rechner"
const CALENDLY_30 = "https://calendly.com/ph-bally/30min"
const CALENDLY_CALLBACK = "https://calendly.com/ph-bally/rueckruf-termin"
```

Internal links: relative paths. External links: full URLs.

### Image paths

Use `/img/<slug>/<filename>` matching files in `public/img/<slug>/`.

## CTA mapping (from Figma comments)

| Pages | Typical CTA destination |
|-------|-------------------------|
| Home hero, Vorsorge | Calendly 30min |
| KMU, Jahresabschluss | Calendly callback |
| Firmengründung, Lohnbuchhaltung, Steuern Privat, Immobilien, Grundstückgewinnsteuern | `/kontakt` |
| Quiz-danke | `/kontakt` |
| Home calculator | `/rechner` |

## Verify after seeding

1. Check script output: `status: 200`
2. Query: `SELECT slug, updated_at FROM pages WHERE slug = '<slug>'`
3. Open page in browser at `/<slug>`
4. Confirm CTAs and section order match design

## Common pitfalls

- Forgetting `DELETE` → duplicate rows, stale content
- `_orbi.component` mismatch → blank section
- Hardcoded domain in internal links → breaks across environments
- Missing `::json` casts in SQL bindings for JSON columns
