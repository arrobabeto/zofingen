// Seeds the Zofingen Treuhand "Artikel" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 520:1378) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-artikel.mjs
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
const img = (name) => `/img/artikel/${name}`

const gridArticles = [
  {
    title:
      "Nachhaltigkeit und Steuern: Steuerliche Vorteile durch grüne Investitionen",
    date: "14 Aug 2023",
    image: img("article-1.png"),
    href: "#",
  },
  {
    title: "Indirekte Steuern und deren Einfluss auf Unternehmen",
    date: "14 Aug 2023",
    image: img("article-2.png"),
    href: "#",
  },
  {
    title:
      "Die Rolle von Familienstiftungen und Trusts in der Steuerplanung",
    date: "14 Aug 2023",
    image: img("article-3.png"),
    href: "#",
  },
  {
    title:
      "Nachhaltigkeit und Steuern: Steuerliche Vorteile durch grüne Investitionen",
    date: "14 Aug 2023",
    image: img("article-1.png"),
    href: "#",
  },
  {
    title: "Indirekte Steuern und deren Einfluss auf Unternehmen",
    date: "14 Aug 2023",
    image: img("article-2.png"),
    href: "#",
  },
  {
    title:
      "Die Rolle von Familienstiftungen und Trusts in der Steuerplanung",
    date: "14 Aug 2023",
    image: img("article-3.png"),
    href: "#",
  },
]

const sections = [
  {
    title: "Artikel",
    image: img("hero-bg.png"),
    _orbi: { component: "SectionPageHero" },
  },
  {
    featured: {
      title: "Mitarbeiterbeteiliung und ihre steuerlichen Aspekte",
      date: "October 16, 2024",
      excerpt:
        "Mitarbeiterbeteiligung gewinnt zunehmend an Bedeutung, da sie eine effektive Möglichkeit bietet, die Ziele der Unternehmensführung mit denen der Mitarbeiter zu verbinden.",
      image: img("featured.png"),
      href: "#",
    },
    articles: gridArticles,
    page: 1,
    pages: 4,
    _orbi: { component: "SectionArtikelFeed" },
  },
]

const title = {
  de: "Artikel",
  en: "Articles",
}
const keywords = [
  "Artikel",
  "News",
  "Blog",
  "Zofingen Treuhand",
  "Steuern",
  "Treuhand",
  "Wissenswertes",
]

const slug = "artikel"

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
