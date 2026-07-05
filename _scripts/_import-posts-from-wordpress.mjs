// One-shot import: WordPress published posts → Orbitype `posts` table.
// Replaces all existing posts. Downloads featured images to public/img/artikel/wp/
// Usage: node _scripts/_import-posts-from-wordpress.mjs
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, extname } from "node:path"
import { spawn } from "node:child_process"
import slug from "slug"
import { stripEmptyHtmlElements } from "./_wordpress-html-cleanup.mjs"

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

const WP_BASE = env.WP_API_URL?.replace(/\/$/, "")
const WP_USER = env.WP_API_USERNAME
const WP_PASS = env.WP_API_PASSWORD
const SQL_URL = env.ORBITYPE_API_SQL_URL
const SQL_KEY = env.ORBITYPE_API_SQL_KEY
const IMG_DIR = join(root, "public/img/artikel/wp")
const FALLBACK_IMG = "/img/artikel/hero-bg.png"

const wpAuth =
  WP_USER && WP_PASS
    ? "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")
    : null

function decodeHtml(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
}

function extractElementorContent(html) {
  const parts = []
  const re =
    /elementor-widget-text-editor[\s\S]*?elementor-widget-container">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/gi
  let m
  while ((m = re.exec(html))) parts.push(m[1].trim())
  return parts.length ? parts.join("\n") : html
}

function cleanHtml(html) {
  let out = extractElementorContent(html)

  out = out.replace(/<!--[\s\S]*?-->/g, "")
  out = out.replace(
    /<div[^>]*id="ez-toc-container"[\s\S]*?<\/nav>\s*<\/div>/gi,
    "",
  )

  out = out.replace(/<span class="ez-toc-section"[^>]*><\/span>/gi, "")
  out = out.replace(/<span class="ez-toc-section-end"><\/span>/gi, "")

  out = out.replace(/<pre>\s*<em([^>]*)>([\s\S]*?)<\/em>\s*<\/pre>/gi, "<p><em$1>$2</em></p>")

  out = out.replace(/\sclass="wp-block-heading"/gi, "")

  out = stripEmptyHtmlElements(out)

  out = out.replace(/\n{3,}/g, "\n\n").trim()
  return out
}

function rewriteDomainLinks(html, wpSlugToPath = {}) {
  let out = html

  out = out.replace(
    /https?:\/\/(?:www\.)?zofingen-treuhand\.ch(\/[^"'>\s]*)/gi,
    (_, path) => {
      const clean = path.replace(/\/$/, "")
      const slugPart = clean.replace(/^\//, "").split("/")[0]
      if (wpSlugToPath[slugPart]) return wpSlugToPath[slugPart]
      return clean || "/"
    },
  )

  return out
}

async function wpFetch(path) {
  const headers = { Accept: "application/json" }
  if (wpAuth) headers.Authorization = wpAuth

  const res = await fetch(`${WP_BASE}${path}`, { headers })
  if (!res.ok) throw new Error(`WP ${path}: ${res.status} ${await res.text()}`)
  return res
}

async function fetchAllPosts() {
  const posts = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const res = await wpFetch(
      `/wp-json/wp/v2/posts?status=publish&per_page=100&page=${page}&_embed=1`,
    )
    totalPages = Number(res.headers.get("x-wp-totalpages") || 1)
    posts.push(...(await res.json()))
    page++
  }

  return posts
}

async function sql(query, bindings = {}) {
  const res = await fetch(SQL_URL, {
    method: "POST",
    headers: { "X-API-KEY": SQL_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  if (!res.ok) console.error("SQL error:", res.status, text)
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) return
  mkdirSync(dirname(destPath), { recursive: true })
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image download failed: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(destPath, buf)
}

function featuredUrl(post) {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null
}

function buildLead(post) {
  const excerpt = post.excerpt?.rendered?.trim()
  if (excerpt && stripTags(excerpt).length > 20) return excerpt
  const yoast = post.yoast_head_json?.description
  if (yoast) return `<p>${decodeHtml(yoast)}</p>`
  const plain = stripTags(cleanHtml(post.content?.rendered ?? "")).slice(0, 200)
  return `<p>${plain}…</p>`
}

function buildKeywords(post, tagNames) {
  const keywords = [...tagNames]
  const yoast = post.yoast_head_json?.description ?? ""
  for (const word of ["Steuern", "Treuhand", "Zofingen", "KMU"]) {
    if (yoast.toLowerCase().includes(word.toLowerCase()) && !keywords.includes(word)) {
      keywords.push(word)
    }
  }
  if (!keywords.length) keywords.push("Artikel", "Zofingen Treuhand")
  return [...new Set(keywords)]
}

async function transformPost(post, tagMap) {
  const wpSlug = post.slug
  const titleText = decodeHtml(post.title?.rendered ?? "")
  const tagNames = (post.tags ?? []).map((id) => tagMap.get(id)).filter(Boolean)

  let contentHtml = cleanHtml(post.content?.rendered ?? "")
  contentHtml = rewriteDomainLinks(contentHtml)

  const leadHtml = buildLead(post)
  const i18n = (de) => ({ de, en: de })

  let imgPath = FALLBACK_IMG
  const remote = featuredUrl(post)
  if (remote) {
    const ext = extname(new URL(remote).pathname) || ".jpg"
    const localName = `${wpSlug}${ext}`
    imgPath = `/img/artikel/wp/${localName}`
    await downloadImage(remote, join(IMG_DIR, localName))
  }

  const sections = [
    {
      title: i18n("Inhalt"),
      content: i18n(contentHtml),
      _orbi: { component: "SectionArtikelContent" },
    },
  ]

  return {
    wpSlug,
    titleText,
    row: {
      title: i18n(titleText),
      lead: i18n(leadHtml),
      img: imgPath,
      sections,
      keywords: buildKeywords(post, tagNames),
      status: { options: ["draft", "review", "published"], value: "published" },
      created_at: post.date,
      updated_at: post.modified,
    },
  }
}

async function run() {
  if (!WP_BASE || !SQL_URL || !SQL_KEY) {
    throw new Error("Missing WP_API_URL or ORBITYPE SQL env vars in .env")
  }

  console.log("Fetching WordPress posts…")
  const wpPosts = await fetchAllPosts()
  console.log(`  ${wpPosts.length} published posts`)

  const allTagIds = wpPosts.flatMap((p) => p.tags ?? [])
  const tagMap = new Map(
    (
      await wpFetch(
        `/wp-json/wp/v2/tags?include=${[...new Set(allTagIds)].join(",")}&per_page=100`,
      ).then((r) => r.json())
    ).map((t) => [t.id, t.name]),
  )

  console.log("Transforming and downloading images…")
  mkdirSync(IMG_DIR, { recursive: true })
  const transformed = []
  for (const post of wpPosts) {
    transformed.push(await transformPost(post, tagMap))
  }

  console.log("Deleting all existing posts…")
  await sql("DELETE FROM posts")

  console.log("Inserting imported posts…")
  const slugToPath = {}
  const inserted = []

  for (const item of transformed) {
    const result = await sql(
      `INSERT INTO posts (title, lead, img, sections, keywords, status, created_at, updated_at)
       VALUES (:title::json, :lead::json, :img, :sections::json, :keywords::json, :status::json, :created_at::timestamptz, :updated_at::timestamptz)
       RETURNING id, title`,
      {
        title: JSON.stringify(item.row.title),
        lead: JSON.stringify(item.row.lead),
        img: item.row.img,
        sections: JSON.stringify(item.row.sections),
        keywords: JSON.stringify(item.row.keywords),
        status: JSON.stringify(item.row.status),
        created_at: item.row.created_at,
        updated_at: item.row.updated_at,
      },
    )

    const row = Array.isArray(result) ? result[0] : result
    if (!row?.id) {
      console.warn("  skip insert (no id):", item.titleText)
      continue
    }

    const titleDe = item.row.title.de
    slugToPath[item.wpSlug] = `/posts/${row.id}/${slug(titleDe)}`
    inserted.push({ id: row.id, wpSlug: item.wpSlug, title: titleDe })
    console.log(`  + ${titleDe.slice(0, 60)}… → ${slugToPath[item.wpSlug]}`)
  }

  console.log("Rewriting inter-post links…")
  for (const item of inserted) {
    const current = await sql(
      "SELECT id, sections FROM posts WHERE id = :id",
      { id: item.id },
    )
    const row = Array.isArray(current) ? current[0] : current
    if (!row?.sections) continue

    const sections = typeof row.sections === "string" ? JSON.parse(row.sections) : row.sections
    const block = sections[0]
    if (!block?.content) continue

    const rewrite = (html) => rewriteDomainLinks(html, slugToPath)
    block.content.de = rewrite(block.content.de)
    block.content.en = rewrite(block.content.en)

    await sql("UPDATE posts SET sections = :sections::json WHERE id = :id", {
      id: item.id,
      sections: JSON.stringify(sections),
    })
  }

  console.log(`Done: ${inserted.length} posts imported.`)

  console.log("Refreshing /artikel listing…")
  await new Promise((resolve, reject) => {
    const child = spawn("node", ["_scripts/_seed-artikel.mjs"], {
      cwd: root,
      stdio: "inherit",
    })
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`seed-artikel exit ${code}`))))
  })
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
