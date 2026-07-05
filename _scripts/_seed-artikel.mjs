// Seeds the Zofingen Treuhand "Artikel" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 520:1378) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-artikel.mjs
// Requires published posts in Orbitype (run _import-posts-from-wordpress.mjs or publish-blog skill).
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import slug from "slug"

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

function postHref(post) {
  const title = post.title?.de ?? post.title?.en ?? "artikel"
  return `/posts/${post.id}/${slug(title)}`
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString("de-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function mapPostToCard(post) {
  return {
    title: post.title?.de ?? post.title?.en ?? "",
    date: formatDate(post.created_at),
    excerpt: plainLead(post.lead).slice(0, 220),
    image: post.img || img("article-1.png"),
    href: postHref(post),
  }
}

async function fetchPublishedPosts(limit = 7) {
  return sql(
    `SELECT id, title, lead, img, created_at FROM posts
     WHERE status->>'value' = 'published'
     ORDER BY created_at DESC, id DESC
     LIMIT :limit`,
    { limit },
  )
}

function plainLead(lead) {
  if (!lead) return ""
  const html = typeof lead === "string" ? lead : lead.de ?? lead.en ?? ""
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

async function run() {
  const posts = await fetchPublishedPosts(7)
  const cards = Array.isArray(posts) ? posts.map(mapPostToCard) : []

  const featured = cards[0] ?? {
    title: "Artikel",
    date: "",
    excerpt: "",
    image: img("hero-bg.png"),
    href: "#",
  }

  const gridArticles =
    cards.length > 1
      ? [...cards.slice(1), ...cards.slice(1)].slice(0, 6)
      : [
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
      featured,
      articles: gridArticles,
      page: 1,
      pages: 4,
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
