// Verify Merkblätter documents on disk and optional HTTP availability.
// Usage: node _scripts/_verify-merkblaetter-docs.mjs [baseUrl]
import { readFileSync, statSync, existsSync } from "node:fs"
import { join } from "node:path"
import {
  merkblaetterDir,
  parseMerkblaetterLinks,
  scriptRoot,
} from "./_merkblaetter-docs.mjs"

const root = scriptRoot()
const baseUrl = process.argv[2] ?? "http://localhost:3000"
const OUT_DIR = merkblaetterDir(root)

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

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function extractSeedItems() {
  const seed = readFileSync(join(root, "_scripts/_seed-ressourcen.mjs"), "utf8")
  const items = []
  const re =
    /label:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"/g
  let m
  while ((m = re.exec(seed))) {
    items.push({ label: m[1], href: m[2] })
  }
  return items
}

async function fetchWpLinks() {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages?slug=merkblaetter`)
  const pages = await res.json()
  return parseMerkblaetterLinks(pages[0].content.rendered)
}

async function checkHttp(href) {
  try {
    const res = await fetch(`${baseUrl}${href}`, { method: "HEAD" })
    if (res.status === 405) {
      const getRes = await fetch(`${baseUrl}${href}`)
      return getRes.status
    }
    return res.status
  } catch {
    return 0
  }
}

async function run() {
  const wpItems = await fetchWpLinks()
  const seedItems = extractSeedItems()
  const rows = []
  let ok = 0

  console.log(`\nMerkblätter verification (base: ${baseUrl})\n`)
  console.log(
    "| # | Label | Archivo | href | Tamaño | HTTP | Estado |",
  )
  console.log("|---|-------|---------|------|--------|------|--------|")

  for (let i = 0; i < wpItems.length; i++) {
    const wp = wpItems[i]
    const seed = seedItems.find((s) => s.label === wp.label)
    const filePath = join(OUT_DIR, wp.filename)
    const onDisk = existsSync(filePath)
    const size = onDisk ? statSync(filePath).size : 0
    const href = seed?.href ?? wp.href
    const http = onDisk ? await checkHttp(href) : 0

    let status = "OK"
    if (!onDisk || size === 0) status = "MISSING"
    else if (!seed?.href) status = "NO_SEED_HREF"
    else if (seed.href !== wp.href) status = "HREF_MISMATCH"
    else if (http && http !== 200) status = `HTTP_${http}`
    else ok++

    rows.push({ i: i + 1, wp, seed, href, size, http, status })
    console.log(
      `| ${i + 1} | ${wp.label.slice(0, 40)}… | ${wp.filename} | ${href} | ${onDisk ? formatSize(size) : "—"} | ${http || "—"} | ${status} |`,
    )
  }

  console.log(`\nSummary: ${ok}/${wpItems.length} OK`)
  console.log("Mapping: WordPress /merkblaetter → site /ressourcen\n")

  if (ok !== wpItems.length) process.exit(1)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
