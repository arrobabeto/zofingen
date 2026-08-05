// One-shot: update Orbitype posts from public/blogs-pending/*.docx
// Omits SEO notes, LinkedIn copy, schema/checklist blocks — keeps Artikel contract only.
// Usage: node _scripts/_update-blogs-from-pending.mjs
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
const PENDING_DIR = join(root, "public/blogs-pending")

const FILE_TO_WP_SLUG = {
  "ZT_Auslandsimmobilien-Steuern-Schweiz-Deutschland_SEO-Optimiert.docx":
    "auslandsimmobilien-steuern-schweiz-deutschland",
  "ZT_Familienstiftung-Schweiz-Trust-Steuern_SEO-Optimiert.docx":
    "familienstiftung-schweiz-trust-steuern",
  "ZT_Kapitalgewinnsteuer-Schweiz_SEO-Optimiert.docx":
    "kapitalgewinnsteuer-in-der-schweiz",
  "ZT_Krypto-Steuern-Praxis-Beispiele_SEO-Optimiert.docx":
    "krypto-steuern-praxis-beispiele",
  "ZT_Kryptowaehrungen-Steuern-Grundlagen_SEO-Optimiert.docx":
    "kryptowaehrungen-steuern-grundlagen",
  "ZT_MWST-Import-Export-Digital_SEO-Optimiert.docx":
    "mehrwertsteuer-handel-import-export-digital",
  "ZT_Mitarbeiterbeteiligung-Steuern_SEO-Optimiert (1).docx":
    "mitarbeiterbeteiligung-steuern",
  "ZT_Umstrukturierung-Unternehmen-Steuern_SEO-Optimiert.docx":
    "umstrukturierung-unternehmen-steuern",
}

const PAGE_SLUG_ALIASES = {
  "externe-lohnbuchhaltung": "/externe-lohnbuchhaltung",
  "dienstleistungen/externe-lohnbuchhaltung": "/externe-lohnbuchhaltung",
  jahresabschluss: "/jahresabschluss",
  kontakt: "/kontakt",
  immobilien: "/immobilien",
  kmu: "/kmu",
  "firmengruendung": "/firmengruendung",
  "grundstueckgewinnsteuern": "/grundstueckgewinnsteuern",
  "steuern-fuer-privatpersonen": "/steuern-fuer-privatpersonen",
  artikel: "/artikel",
  rechner: "/rechner",
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
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
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
  const meta = {}
  const pick = (label) => {
    const re = new RegExp(
      `<strong>${label}[^<]*</strong>\\s*([^<]+)`,
      "i",
    )
    const m = html.match(re)
    return m ? decodeEntities(m[1].trim()) : ""
  }

  meta.seoTitle = pick("SEO Title")
  meta.metaDescription = pick("Meta Description")
  const slugRaw = pick("URL-Slug")
  meta.wpSlug = slugRaw
    .replace(/\(.*?\)/g, "")
    .replace(/unverändert.*/i, "")
    .trim()
  meta.primaryKeyword = pick("Primäres Keyword") || pick("Primäre Keywords")
  meta.secondaryKeywords = pick("Sekundäre Keywords")

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  meta.title = h1 ? stripTags(h1[1]) : meta.seoTitle

  const updated = html.match(
    /Zuletzt aktualisiert:\s*([^|<]+)/i,
  )
  meta.updatedLabel = updated ? updated[1].trim() : "Juni 2026"

  const published = html.match(/Erstpublikation:\s*([^|<]+)/i)
  meta.publishedLabel = published ? published[1].trim() : ""

  const auf = html.match(
    /Auf einen Blick<\/strong><\/p><\/td><\/tr><tr><td><p>([\s\S]*?)<\/p>/i,
  )
  meta.aufEinenBlick = auf ? stripTags(auf[1]) : ""

  return meta
}

function extractBodyHtml(html) {
  const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
  const firstArticle = headings.find((m) => {
    const text = stripTags(m[1])
    return /^\d+[a-z]?\./i.test(text)
  })
  if (!firstArticle) throw new Error("No numbered article h2 found")

  const endMarkers = [
    "INTERNE VERLINKUNG",
    "EXTERNE VERLINKUNG",
    "SCHEMA MARKUP",
    "VERSION 2:",
    "VERSION 3:",
    "VOR-PUBLIKATION",
    "LINKEDIN-POST",
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
    /→\s*(?:https?:\/\/(?:www\.)?zofingen-treuhand\.ch)?\/?kontakt/gi,
    '→ <a href="/kontakt">Kontakt</a>',
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
    if (path.startsWith("/posts/") || path.startsWith("/kontakt") || path.startsWith("/artikel")) {
      return full
    }
    // bare WP post slug path
    if (wpSlugToPath[first]) return `href="${wpSlugToPath[first]}"`
    return `href="/${clean}"`
  })

  // Plain-text WP paths in paragraphs: /slug/
  out = out.replace(
    /(^|>)(\/(?:[a-z0-9äöü-]+\/)+)(?=<|$)/gim,
    (full, prefix, path) => {
      const first = path.replace(/^\/|\/$/g, "").split("/")[0]
      if (wpSlugToPath[first]) return `${prefix}${wpSlugToPath[first]}`
      if (PAGE_SLUG_ALIASES[first]) return `${prefix}${PAGE_SLUG_ALIASES[first]}`
      return full
    },
  )

  // Explicit broken crypto link from notes
  out = out.replace(
    /\/steuerliche-behandlung-von-kryptowaehrungen-in-der-schweiz\/?/gi,
    wpSlugToPath["kryptowaehrungen-steuern-grundlagen"] ||
      "/kryptowaehrungen-steuern-grundlagen",
  )
  out = out.replace(
    /\/kryptowaehrungen-steuern-grundlagen\/?/gi,
    wpSlugToPath["kryptowaehrungen-steuern-grundlagen"] ||
      "/kryptowaehrungen-steuern-grundlagen",
  )

  return out
}

function polishContent({ body, aufEinenBlick, updatedLabel, wpSlugToPath }) {
  const intro = []
  intro.push(`<p><em>Zuletzt aktualisiert: ${updatedLabel}</em></p>`)
  if (aufEinenBlick) {
    intro.push(`<p><strong>Auf einen Blick</strong> — ${aufEinenBlick}</p>`)
  }

  let content = [...intro, body].join("\n")
  content = cleanHeadingHtml(content)
  content = rewriteLinks(content, wpSlugToPath)

  // Normalize CTA arrow lines inside tables to links
  content = content.replace(
    /<p><strong>→\s*([^<]+)<\/strong><\/p>/gi,
    (_, target) => {
      const t = target.trim()
      if (/kontakt/i.test(t)) return '<p><a href="/kontakt">Kontaktieren Sie uns</a></p>'
      return `<p>${t}</p>`
    },
  )

  content = content
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  return content
}

function buildKeywords(meta) {
  const parts = []
  if (meta.primaryKeyword) {
    parts.push(
      ...meta.primaryKeyword.split(/,|·|\|/).map((s) => s.trim()).filter(Boolean),
    )
  }
  if (meta.secondaryKeywords) {
    parts.push(
      ...meta.secondaryKeywords.split(",").map((s) => s.trim()).filter(Boolean),
    )
  }
  parts.push("Zofingen Treuhand", "Steuern")
  return [...new Set(parts)].slice(0, 12)
}

function parseSwissDate(label) {
  // e.g. "14. Januar 2026" or "3. September 2025"
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
  const d = new Date(Date.UTC(Number(m[3]), month, Number(m[1]), 9, 0, 0))
  return d.toISOString()
}

function findPostForSlug(posts, wpSlug) {
  const byImg = posts.find((p) => (p.img || "").includes(`/${wpSlug}.`))
  if (byImg) return byImg
  if (wpSlug === "mitarbeiterbeteiligung-steuern") {
    return posts.find((p) =>
      (p.title_de || "").toLowerCase().includes("mitarbeiterbeteiligung"),
    )
  }
  return null
}

async function main() {
  const posts = await sql(
    `SELECT id, title->>'de' as title_de, img, created_at, status
     FROM posts`,
  )
  if (!Array.isArray(posts)) throw new Error("Failed to load posts")

  const wpSlugToPath = {}
  for (const p of posts) {
    const img = p.img || ""
    const m = img.match(/\/img\/artikel\/wp\/([^.\/]+)\./)
    if (m) {
      wpSlugToPath[m[1]] = `/posts/${p.id}/${slug(p.title_de)}`
    }
  }
  // Demo mitarbeiter post uses featured.png
  const mitarbeiter = posts.find((p) =>
    (p.title_de || "").toLowerCase().includes("mitarbeiterbeteiligung"),
  )
  if (mitarbeiter) {
    wpSlugToPath["mitarbeiterbeteiligung-steuern"] =
      `/posts/${mitarbeiter.id}/${slug(mitarbeiter.title_de)}`
  }

  const files = readdirSync(PENDING_DIR).filter((f) => f.endsWith(".docx"))
  const updated = []

  for (const file of files) {
    const wpSlug = FILE_TO_WP_SLUG[file]
    if (!wpSlug) {
      console.warn("Skip unknown file:", file)
      continue
    }

    const post = findPostForSlug(posts, wpSlug)
    if (!post) {
      console.error("MISSING post for slug:", wpSlug, file)
      continue
    }

    console.log(`\n=== ${wpSlug} → post ${post.id} ===`)
    console.log("existing:", post.title_de)

    const { value: rawHtml } = await mammoth.convertToHtml({
      path: join(PENDING_DIR, file),
    })
    const meta = extractMeta(rawHtml)
    if (meta.wpSlug && meta.wpSlug !== wpSlug) {
      console.warn("Slug mismatch in doc:", meta.wpSlug, "vs", wpSlug)
    }

    const body = extractBodyHtml(rawHtml)
    const titleDe = meta.title
    // Prefer new title slug for self/sibling links after this update
    wpSlugToPath[wpSlug] = `/posts/${post.id}/${slug(titleDe)}`

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
           sections = :sections::json,
           keywords = :keywords::json,
           status = :status::json,
           created_at = :created_at::timestamptz,
           updated_at = :updated_at::timestamptz
       WHERE id = :id
       RETURNING id, title->>'de' as title_de`,
      {
        id: post.id,
        title: JSON.stringify(title),
        lead: JSON.stringify(lead),
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
    console.log("content chars:", contentDe.length)
    console.log("url:", path)
    updated.push({ id: post.id, wpSlug, title: titleDe, path })
  }

  console.log("\n===== UPDATED URLS =====")
  for (const u of updated) console.log(u.path)
  console.log(JSON.stringify(updated, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
