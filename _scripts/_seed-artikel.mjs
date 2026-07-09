// Seeds the Zofingen Treuhand "Artikel" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 520:1378) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-artikel.mjs
// SectionArtikelFeed loads published posts from /api/posts at runtime.
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { HERO_IMAGE } from "./_shared-assets.mjs"

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

async function sql(query, bindings = {}) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "X-API-KEY": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  console.log("status:", res.status, "->", text.slice(0, 200))
  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

async function run() {
  const sections = [
    {
      title: "Artikel",
      image: HERO_IMAGE,
      _orbi: { component: "SectionPageHero" },
    },
    {
      _orbi: { component: "SectionArtikelFeed" },
    },
  ]

  const title = { de: "Artikel", en: "Articles" }
  const keywords = [
    "Artikel",
    "News",
    "Blog",
    "Zofingen Treuhand",
    "Steuern",
    "Treuhand",
    "Wissenswertes",
  ]
  const pageSlug = "artikel"

  await sql("DELETE FROM pages WHERE slug = :slug", { slug: pageSlug })
  await sql(
    "INSERT INTO pages (title, slug, sections, keywords) VALUES (:title::json, :slug, :sections::json, :keywords::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      slug: pageSlug,
    },
  )
}

run()
