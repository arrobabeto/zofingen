// Rewrite internal links inside post content so they point to final URLs:
// legacy WordPress paths → LEGACY_REDIRECTS target, /posts/:id/<wrong-slug> → canonical slug.
// Does not change titles or slugs (protects /posts/:id/:slug canonicals).
// Usage: node _scripts/_fix-post-internal-links.mjs          (dry-run)
//        node _scripts/_fix-post-internal-links.mjs --apply  (write to CMS)
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import slug from "slug"
import { resolveLegacyRedirect } from "../server/utils/legacyRedirects.ts"

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
const SITE_HOST_PATTERN = /^https?:\/\/(www\.)?zofingen-treuhand\.ch/i
const APPLY = process.argv.includes("--apply")

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

function titleFor(title, locale) {
  if (!title) return ""
  if (typeof title === "string") return title
  return locale === "de" ? title.de ?? title.en : title.en ?? title.de
}

function buildCanonicalPostSlugs(posts) {
  const slugs = {}
  for (const p of posts) {
    slugs[p.id] = {
      en: slug(titleFor(p.title, "en") || ""),
      de: slug(titleFor(p.title, "de") || ""),
    }
  }
  return slugs
}

/** Returns the final internal path for an href, or null if it needs no change. */
function resolveFinalHref(href, canonicalSlugs) {
  if (!href.startsWith("/") && !SITE_HOST_PATTERN.test(href)) return null

  const relative = href.replace(SITE_HOST_PATTERN, "") || "/"
  const hashIndex = relative.indexOf("#")
  const hash = hashIndex === -1 ? "" : relative.slice(hashIndex)
  const pathname = (hashIndex === -1 ? relative : relative.slice(0, hashIndex)).split("?")[0]

  const legacyTarget = resolveLegacyRedirect(pathname)
  if (legacyTarget) return legacyTarget + hash

  const postMatch = pathname.match(/^(\/de)?\/posts\/([^/]+)(?:\/([^/]*))?\/?$/)
  if (postMatch) {
    const [, dePrefix, id, currentSlug] = postMatch
    const expected = canonicalSlugs[id]?.[dePrefix ? "de" : "en"]
    if (expected && currentSlug !== expected) {
      return `${dePrefix ?? ""}/posts/${id}/${expected}${hash}`
    }
  }

  return null
}

function rewriteHtml(html, canonicalSlugs, changes) {
  return html.replace(/href=(["'])([^"']+)\1/gi, (match, quote, href) => {
    const finalHref = resolveFinalHref(href, canonicalSlugs)
    if (!finalHref || finalHref === href) return match
    changes.push(`${href} → ${finalHref}`)
    return `href=${quote}${finalHref}${quote}`
  })
}

function rewriteContent(content, canonicalSlugs, changes) {
  if (typeof content === "string") return rewriteHtml(content, canonicalSlugs, changes)
  if (!content || typeof content !== "object") return content
  const next = { ...content }
  for (const locale of Object.keys(next)) {
    if (typeof next[locale] === "string") {
      next[locale] = rewriteHtml(next[locale], canonicalSlugs, changes)
    }
  }
  return next
}

async function run() {
  const posts = await sql(
    `SELECT id, title, sections, status
     FROM posts
     WHERE ("status"->>'value') = 'published'
        OR ("status"->>'value') IS NULL
     ORDER BY updated_at DESC NULLS LAST`,
  )

  if (!Array.isArray(posts) || posts.length === 0) {
    console.log("No posts found.")
    return
  }

  const canonicalSlugs = buildCanonicalPostSlugs(posts)
  let changedPosts = 0
  let changedLinks = 0

  for (const post of posts) {
    const sections = Array.isArray(post.sections) ? post.sections : []
    const changes = []
    const nextSections = sections.map((s) => {
      if (s?._orbi?.component !== "SectionArtikelContent") return s
      return { ...s, content: rewriteContent(s.content, canonicalSlugs, changes) }
    })

    if (changes.length === 0) continue

    changedPosts++
    changedLinks += changes.length
    console.log(`\n${post.id} — ${titleFor(post.title, "de").slice(0, 70)}`)
    for (const c of changes) console.log(`  ${c}`)

    if (APPLY) {
      await sql(
        `UPDATE posts
         SET sections = :sections::json, updated_at = CURRENT_TIMESTAMP
         WHERE id = :id
         RETURNING id`,
        { id: post.id, sections: JSON.stringify(nextSections) },
      )
      console.log("  saved")
    }
  }

  console.log(
    `\n${APPLY ? "Applied" : "Dry-run"}: posts=${changedPosts} links=${changedLinks} (scanned ${posts.length})`,
  )
  if (!APPLY && changedLinks > 0) console.log("Re-run with --apply to write changes.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
