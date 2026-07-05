// Re-apply empty list/paragraph cleanup on already-imported posts.
// Usage: node _scripts/_patch-post-html-cleanup.mjs
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
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

const SQL_URL = env.ORBITYPE_API_SQL_URL
const SQL_KEY = env.ORBITYPE_API_SQL_KEY

async function sql(query, bindings = {}) {
  const res = await fetch(SQL_URL, {
    method: "POST",
    headers: { "X-API-KEY": SQL_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`SQL ${res.status}: ${text}`)
  return JSON.parse(text)
}

function countIssues(html) {
  const emptyLi = (html.match(/<li[^>]*>\s*(<ul[^>]*>\s*<\/ul>\s*)?<\/li>/gi) || []).length
  const emptyUl = (html.match(/<ul[^>]*>\s*<\/ul>/gi) || []).length
  const emptyP = (html.match(/<p[^>]*>\s*<\/p>/gi) || []).length
  return { emptyLi, emptyUl, emptyP }
}

async function run() {
  const rows = await sql("SELECT id, title, sections FROM posts")
  let patched = 0

  for (const row of rows) {
    const sections =
      typeof row.sections === "string" ? JSON.parse(row.sections) : row.sections
    const block = sections?.[0]
    if (!block?.content?.de) continue

    const before = countIssues(block.content.de)
    if (!before.emptyLi && !before.emptyUl && !before.emptyP) continue

    block.content.de = stripEmptyHtmlElements(block.content.de)
    block.content.en = stripEmptyHtmlElements(block.content.en ?? block.content.de)

    const after = countIssues(block.content.de)
    await sql("UPDATE posts SET sections = :sections::json WHERE id = :id", {
      id: row.id,
      sections: JSON.stringify(sections),
    })

    const title = row.title?.de ?? row.id
    console.log(
      `  ${title.slice(0, 55)}… li ${before.emptyLi}→${after.emptyLi}, ul ${before.emptyUl}→${after.emptyUl}, p ${before.emptyP}→${after.emptyP}`,
    )
    patched++
  }

  console.log(`Done: ${patched} posts patched.`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
