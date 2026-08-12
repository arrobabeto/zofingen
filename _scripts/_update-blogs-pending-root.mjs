// Update Orbitype posts from repo-root blogs-pending/*.docx + new featured images.
// Usage: node _scripts/_update-blogs-pending-root.mjs
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import mammoth from "mammoth"
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

const SQL_URL = env.ORBITYPE_API_SQL_URL
const SQL_KEY = env.ORBITYPE_API_SQL_KEY
const PENDING_DIR = join(root, "blogs-pending")

const FILE_MAP = {
  "ZT_Nachhaltige-Investitionen-Steuern-Aargau_v2_mit-Quellen.docx": {
    wpSlug: "nachhaltige-investitionen-steuern-aargau",
    img: "/img/artikel/nachhaltige-investitionen-steuern-aargau.avif",
    match: (p) =>
      (p.img || "").includes("nachhaltige-investitionen-steuern-aargau") ||
      (p.title_de || "").toLowerCase().includes("nachhaltige investitionen"),
  },
  "ZT_Nachhaltigkeit-Steuern-Schweiz_SEO-Optimiert.docx": {
    wpSlug: "nachhaltigkeit-und-steuern-schweiz",
    img: "/img/artikel/nachhaltigkeit-und-steuern-schweiz.avif",
    match: (p) =>
      (p.img || "").includes("nachhaltigkeit-und-steuern-schweiz") ||
      ((p.title_de || "").toLowerCase().includes("nachhaltigkeit") &&
        (p.title_de || "").toLowerCase().includes("schweiz") &&
        !(p.title_de || "").toLowerCase().includes("investitionen")),
  },
}

const PAGE_SLUG_ALIASES = {
  "externe-lohnbuchhaltung": "/externe-lohnbuchhaltung",
  jahresabschluss: "/jahresabschluss",
  kontakt: "/kontakt",
  immobilien: "/immobilien",
  kmu: "/kmu",
  firmengruendung: "/firmengruendung",
  grundstueckgewinnsteuern: "/grundstueckgewinnsteuern",
  "steuern-fuer-privatpersonen": "/steuern-fuer-privatpersonen",
  artikel: "/artikel",
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/\s+/g, " ")
    .trim()
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
}

async function sql(query, bindings = {}) {
  const res = await fetch(SQL_URL, {
    method: "POST",
    headers: { "X-API-KEY": SQL_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`SQL ${res.status}: ${text.slice(0, 500)}`)
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function extractMeta(html) {
  const pick = (label) => {
    const re = new RegExp(`<strong>${label}[^<]*</strong>\\s*([^<]+)`, "i")
    const m = html.match(re)
    return m ? decodeEntities(m[1].trim()) : ""
  }
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const auf = html.match(
    /Auf einen Blick<\/strong><\/p><\/td><\/tr><tr><td><p>([\s\S]*?)<\/p>/i,
  )
  return {
    seoTitle: pick("SEO Title"),
    metaDescription: pick("Meta Description"),
    wpSlug: pick("URL-Slug")
      .replace(/\(.*?\)/g, "")
      .replace(/unverändert.*/i, "")
      .trim(),
    primaryKeyword: pick("Primäres Keyword") || pick("Primäre Keywords"),
    secondaryKeywords: pick("Sekundäre Keywords"),
    title: h1 ? stripTags(h1[1]) : pick("SEO Title"),
    updatedLabel:
      html.match(/Zuletzt aktualisiert:\s*([^|<]+)/i)?.[1]?.trim() ||
      "Juni 2026",
    publishedLabel:
      html.match(/Erstpublikation:\s*([^|<]+)/i)?.[1]?.trim() || "",
    aufEinenBlick: auf ? stripTags(auf[1]) : "",
  }
}

function extractBodyHtml(html) {
  const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
  const firstArticle = headings.find((m) =>
    /^\d+[a-z]?\./i.test(stripTags(m[1])),
  )
  if (!firstArticle) throw new Error("No numbered article h2 found")

  const endMarkers = [
    "INTERNE VERLINKUNG",
    "EXTERNE VERLINKUNG",
    "SCHEMA MARKUP",
    "VERSION 2:",
    "VERSION 3:",
    "VOR-PUBLIKATION",
    "LINKEDIN-POST",
    "ÄNDERUNGSTABELLE",
  ]
  let end = html.length
  for (const marker of endMarkers) {
    const i = html.indexOf(marker, firstArticle.index)
    if (i !== -1 && i < end) end = i
  }

  let body = html.slice(firstArticle.index, end)
  const closes = ["</table>", "</p>", "</ul>", "</ol>", "</h3>", "</h2>"]
  let cut = -1
  for (const c of closes) {
    const i = body.lastIndexOf(c)
    if (i > cut) cut = i + c.length
  }
  if (cut > 0) body = body.slice(0, cut)
  return body.trim()
}

function cleanHeadingHtml(html) {
  return html.replace(
    /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, tag, inner) => `<${tag}>${stripTags(inner)}</${tag}>`,
  )
}

function rewriteLinks(html, wpSlugToPath) {
  let out = html
  out = out.replace(
    /https?:\/\/(?:www\.)?zofingen-treuhand\.ch(\/[^"'<\s]*)/gi,
    (_, path) => path.replace(/\/$/, "") || "/",
  )
  out = out.replace(
    /<p><strong>→\s*zofingen-treuhand\.ch\/kontakt<\/strong><\/p>/gi,
    '<p><a href="/kontakt">Kontaktieren Sie uns</a></p>',
  )
  out = out.replace(/href="(\/[^"]+)"/gi, (full, path) => {
    const clean = path.replace(/\/$/, "").replace(/^\//, "")
    const first = clean.split("/")[0]
    if (wpSlugToPath[first]) return `href="${wpSlugToPath[first]}"`
    if (PAGE_SLUG_ALIASES[clean]) return `href="${PAGE_SLUG_ALIASES[clean]}"`
    if (PAGE_SLUG_ALIASES[first]) return `href="${PAGE_SLUG_ALIASES[first]}"`
    if (
      path.startsWith("/posts/") ||
      path.startsWith("/kontakt") ||
      path.startsWith("/artikel")
    ) {
      return full
    }
    return `href="/${clean}"`
  })
  out = out.replace(
    /\/nachhaltige-investitionen-steuern-aargau\/?/gi,
    wpSlugToPath["nachhaltige-investitionen-steuern-aargau"] ||
      "/nachhaltige-investitionen-steuern-aargau",
  )
  out = out.replace(
    /\/nachhaltigkeit-und-steuern-schweiz\/?/gi,
    wpSlugToPath["nachhaltigkeit-und-steuern-schweiz"] ||
      "/nachhaltigkeit-und-steuern-schweiz",
  )
  return out
}

function polishContent({ body, aufEinenBlick, updatedLabel, wpSlugToPath }) {
  const intro = [`<p><em>Zuletzt aktualisiert: ${updatedLabel}</em></p>`]
  if (aufEinenBlick) {
    intro.push(`<p><strong>Auf einen Blick</strong> — ${aufEinenBlick}</p>`)
  }
  let content = [...intro, body].join("\n")
  content = cleanHeadingHtml(content)
  content = rewriteLinks(content, wpSlugToPath)
  content = content.replace(
    /<p><strong>→\s*([^<]+)<\/strong><\/p>/gi,
    (_, target) => {
      const t = target.trim()
      if (/kontakt/i.test(t))
        return '<p><a href="/kontakt">Kontaktieren Sie uns</a></p>'
      return `<p>${t}</p>`
    },
  )
  return content
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function buildKeywords(meta) {
  const parts = []
  if (meta.primaryKeyword) {
    parts.push(
      ...meta.primaryKeyword
        .split(/,|·|\|/)
        .map((s) => s.trim())
        .filter(Boolean),
    )
  }
  if (meta.secondaryKeywords) {
    parts.push(
      ...meta.secondaryKeywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
  }
  parts.push("Zofingen Treuhand", "Steuern", "Nachhaltigkeit")
  return [...new Set(parts)].slice(0, 12)
}

function parseSwissDate(label) {
  const months = {
    januar: 0,
    februar: 1,
    märz: 2,
    marz: 2,
    april: 3,
    mai: 4,
    juni: 5,
    juli: 6,
    august: 7,
    september: 8,
    oktober: 9,
    november: 10,
    dezember: 11,
  }
  const m = label.match(/(\d{1,2})\.\s*([A-Za-zäöüÄÖÜ]+)\s+(\d{4})/)
  if (!m) return null
  const month = months[m[2].toLowerCase()]
  if (month == null) return null
  return new Date(
    Date.UTC(Number(m[3]), month, Number(m[1]), 9, 0, 0),
  ).toISOString()
}

async function main() {
  const posts = await sql(
    `SELECT id, title->>'de' as title_de, img, created_at, status FROM posts`,
  )
  if (!Array.isArray(posts)) throw new Error("Failed to load posts")

  const wpSlugToPath = {}
  for (const p of posts) {
    const img = p.img || ""
    const m = img.match(/\/(?:img\/artikel\/(?:wp\/)?)([^.\/]+)\./)
    if (m) wpSlugToPath[m[1]] = `/posts/${p.id}/${slug(p.title_de)}`
  }

  const files = readdirSync(PENDING_DIR).filter((f) => f.endsWith(".docx"))
  const updated = []

  for (const file of files) {
    const cfg = FILE_MAP[file]
    if (!cfg) {
      console.warn("Skip unknown file:", file)
      continue
    }

    const post = posts.find(cfg.match)
    if (!post) {
      console.error("MISSING post for", cfg.wpSlug)
      continue
    }

    console.log(`\n=== ${cfg.wpSlug} → ${post.id} ===`)
    const { value: rawHtml } = await mammoth.convertToHtml({
      path: join(PENDING_DIR, file),
    })
    const meta = extractMeta(rawHtml)
    const body = extractBodyHtml(rawHtml)
    const titleDe = meta.title
    wpSlugToPath[cfg.wpSlug] = `/posts/${post.id}/${slug(titleDe)}`

    const contentDe = polishContent({
      body,
      aufEinenBlick: meta.aufEinenBlick,
      updatedLabel: meta.updatedLabel,
      wpSlugToPath,
    })
    const leadDe = `<p>${meta.metaDescription || meta.aufEinenBlick.slice(0, 160)}</p>`
    const keywords = buildKeywords(meta)
    const publishedAt = parseSwissDate(meta.publishedLabel) || post.created_at
    const now = new Date().toISOString()
    const title = { de: titleDe, en: titleDe }
    const lead = { de: leadDe, en: leadDe }
    const sections = [
      {
        title: { de: "Inhalt", en: "Content" },
        content: { de: contentDe, en: contentDe },
        _orbi: { component: "SectionArtikelContent" },
      },
    ]
    const status = post.status?.value
      ? post.status
      : { options: ["draft", "review", "published"], value: "published" }
    if (!status.value) status.value = "published"

    const result = await sql(
      `UPDATE posts
       SET title = :title::json,
           lead = :lead::json,
           img = :img,
           sections = :sections::json,
           keywords = :keywords::json,
           status = :status::json,
           created_at = :created_at::timestamptz,
           updated_at = :updated_at::timestamptz
       WHERE id = :id
       RETURNING id, title->>'de' as title_de, img`,
      {
        id: post.id,
        title: JSON.stringify(title),
        lead: JSON.stringify(lead),
        img: cfg.img,
        sections: JSON.stringify(sections),
        keywords: JSON.stringify(keywords),
        status: JSON.stringify(status),
        created_at: publishedAt,
        updated_at: now,
      },
    )

    const row = Array.isArray(result) ? result[0] : result
    const path = `/posts/${post.id}/${slug(titleDe)}`
    console.log("updated:", row?.title_de)
    console.log("img:", row?.img)
    console.log("content chars:", contentDe.length)
    console.log("url:", path)
    updated.push({ id: post.id, wpSlug: cfg.wpSlug, title: titleDe, path, img: cfg.img })
  }

  console.log("\n===== UPDATED URLS =====")
  for (const u of updated) console.log(u.path)
  console.log(JSON.stringify(updated, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
