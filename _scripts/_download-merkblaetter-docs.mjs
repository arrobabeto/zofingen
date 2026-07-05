// Download Merkblätter documents from WordPress → public/downloads/merkblaetter/
// Usage: node _scripts/_download-merkblaetter-docs.mjs
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs"
import { join } from "node:path"
import {
  MERKBLAETTER_SLUG,
  merkblaetterDir,
  parseMerkblaetterLinks,
  scriptRoot,
} from "./_merkblaetter-docs.mjs"

const root = scriptRoot()
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

const WP_BASE = (env.WP_API_URL ?? "https://www.zofingen-treuhand.ch").replace(
  /\/$/,
  "",
)
const WP_USER = env.WP_API_USERNAME
const WP_PASS = env.WP_API_PASSWORD
const OUT_DIR = merkblaetterDir(root)

const wpAuth =
  WP_USER && WP_PASS
    ? "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")
    : null

async function wpFetch(path) {
  const headers = { Accept: "application/json" }
  if (wpAuth) headers.Authorization = wpAuth

  const res = await fetch(`${WP_BASE}${path}`, { headers })
  if (!res.ok) throw new Error(`WP ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function fetchMerkblaetterLinks() {
  const pages = await wpFetch(
    `/wp-json/wp/v2/pages?slug=${MERKBLAETTER_SLUG}`,
  )
  const page = pages[0]
  if (!page?.content?.rendered) {
    throw new Error(`WordPress page "${MERKBLAETTER_SLUG}" not found`)
  }

  const items = parseMerkblaetterLinks(page.content.rendered)
  if (!items.length) throw new Error("No document links found on merkblaetter page")
  return items
}

async function downloadFile(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`  skip (exists): ${destPath.split("/").pop()}`)
    return "skip"
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`)

  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(destPath, buf)
  console.log(`  ok: ${destPath.split("/").pop()} (${buf.length} bytes)`)
  return "ok"
}

async function run() {
  console.log("Fetching merkblaetter page from WordPress…")
  const items = await fetchMerkblaetterLinks()
  console.log(`  ${items.length} document links found`)

  let failed = 0
  for (const item of items) {
    try {
      await downloadFile(item.url, join(OUT_DIR, item.filename))
    } catch (e) {
      console.error(`  error: ${item.filename} — ${e.message}`)
      failed++
    }
  }

  if (failed) {
    console.error(`Done with ${failed} error(s).`)
    process.exit(1)
  }

  console.log(`Done: ${items.length} documents in ${OUT_DIR}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
