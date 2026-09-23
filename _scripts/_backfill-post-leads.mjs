// Backfill posts.lead from the first body paragraph (140–160 chars).
// Does not change titles (protects /posts/:id/:slug canonicals).
// Usage: node _scripts/_backfill-post-leads.mjs
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

const SQL_URL = env.ORBITYPE_API_SQL_URL
const SQL_KEY = env.ORBITYPE_API_SQL_KEY
const MIN_LEN = 140
const MAX_LEN = 160

async function sql(query, bindings = {}) {
  const res = await fetch(SQL_URL, {
    method: "POST",
    headers: { "X-API-KEY": SQL_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`SQL ${res.status}: ${text.slice(0, 300)}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

function stripHtml(html) {
  return String(html || "")
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

function firstParagraphPlain(html) {
  const paragraphs = [...String(html || "").matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(
    (m) => stripHtml(m[1]),
  )
  const substantial = paragraphs.find((p) => {
    if (!p || p.length < 80) return false
    if (/^zuletzt aktualisiert/i.test(p)) return false
    return true
  })
  return substantial || paragraphs.find((p) => p.length >= 40) || paragraphs[0] || stripHtml(html)
}

function trimToMetaDescription(text) {
  const plain = String(text || "").trim()
  if (!plain) return ""
  if (plain.length <= MAX_LEN) return plain
  const slice = plain.slice(0, MAX_LEN)
  const lastSpace = slice.lastIndexOf(" ")
  const cut = lastSpace >= MIN_LEN ? lastSpace : MAX_LEN
  return slice.slice(0, cut).trim().replace(/[.,;:!?–-]+$/, "")
}

function contentHtml(post) {
  const sections = Array.isArray(post.sections) ? post.sections : []
  const contentSection = sections.find(
    (s) => s?._orbi?.component === "SectionArtikelContent",
  )
  const content = contentSection?.content
  if (content && typeof content === "object") {
    return content.de || content.en || ""
  }
  if (typeof content === "string") return content
  const lead = post.lead
  if (lead && typeof lead === "object") return lead.de || lead.en || ""
  return ""
}

async function run() {
  const posts = await sql(
    `SELECT id, title, lead, sections, status
     FROM posts
     WHERE ("status"->>'value') = 'published'
        OR ("status"->>'value') IS NULL
     ORDER BY updated_at DESC NULLS LAST`,
  )

  if (!Array.isArray(posts) || posts.length === 0) {
    console.log("No posts found.")
    return
  }

  let updated = 0
  let skipped = 0

  for (const post of posts) {
    const html = contentHtml(post)
    const meta = trimToMetaDescription(firstParagraphPlain(html))
    if (!meta) {
      console.log(`skip ${post.id}: no paragraph text`)
      skipped++
      continue
    }

    // Prefer 140–160; if shorter, still store (better than empty/English junk).
    const lead = { de: meta, en: meta }
    await sql(
      `UPDATE posts
       SET lead = :lead::json, updated_at = CURRENT_TIMESTAMP
       WHERE id = :id
       RETURNING id`,
      { id: post.id, lead: JSON.stringify(lead) },
    )
    const titleDe =
      typeof post.title === "object" ? post.title?.de || post.title?.en : post.title
    console.log(
      `ok ${post.id} (${meta.length} chars): ${String(titleDe || "").slice(0, 60)}`,
    )
    updated++
  }

  console.log(`Done. updated=${updated} skipped=${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
