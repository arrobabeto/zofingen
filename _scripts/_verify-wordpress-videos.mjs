// Verify optimized videos on disk, seed references, and HTTP availability.
// Usage: node _scripts/_verify-wordpress-videos.mjs [baseUrl]
import { readFileSync, statSync, existsSync } from "node:fs"
import { join } from "node:path"
import {
  WP_VIDEOS,
  HERO_VIDEO,
  CORPORATE_VIDEO,
  RELIABILITY_VIDEO,
  FIRMENGRUENDUNG_VIDEO,
  scriptRoot,
  videosPublicDir,
} from "./_wordpress-videos.mjs"

const root = scriptRoot()
const baseUrl = process.argv[2] ?? "http://localhost:3000"
const OUT_DIR = videosPublicDir(root)

const SEED_EXPECTATIONS = [
  { file: "_seed-home.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "home hero" },
  { file: "_seed-home.mjs", href: CORPORATE_VIDEO, const: "CORPORATE_VIDEO", label: "home corporate" },
  { file: "_seed-home.mjs", href: RELIABILITY_VIDEO, const: "RELIABILITY_VIDEO", label: "home reliability" },
  { file: "_seed-firmengruendung.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "firmengruendung hero" },
  {
    file: "_seed-firmengruendung.mjs",
    href: FIRMENGRUENDUNG_VIDEO,
    const: "FIRMENGRUENDUNG_VIDEO",
    label: "firmengruendung service",
  },
  { file: "_seed-kmu.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "kmu hero" },
  { file: "_seed-jahresabschluss.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "jahresabschluss hero" },
  { file: "_seed-lohnbuchhaltung.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "lohnbuchhaltung hero" },
  { file: "_seed-steuern-privat.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "steuern-privat hero" },
  { file: "_seed-vorsorge.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "vorsorge hero" },
  { file: "_seed-immobilien.mjs", href: HERO_VIDEO, const: "HERO_VIDEO", label: "immobilien hero" },
  {
    file: "_seed-grundstueckgewinnsteuern.mjs",
    href: HERO_VIDEO,
    const: "HERO_VIDEO",
    label: "grundstueckgewinnsteuern hero",
  },
]

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
  let ok = 0
  console.log(`\nWordPress videos verification (base: ${baseUrl})\n`)

  for (let i = 0; i < WP_VIDEOS.length; i++) {
    const item = WP_VIDEOS[i]
    const path = join(OUT_DIR, item.filename)
    const href = `/videos/wp/${item.filename}`
    const onDisk = existsSync(path)
    const size = onDisk ? statSync(path).size : 0
    const http = onDisk ? await checkHttp(href) : 0

    let status = "OK"
    if (!onDisk || size === 0) status = "MISSING"
    else if (http && http !== 200) status = `HTTP_${http}`
    else ok++

    console.log(
      `${i + 1}. ${item.filename} | ${item.profile} | ${onDisk ? formatSize(size) : "—"} | HTTP ${http || "—"} | ${status}`,
    )
  }

  console.log("\nSeed references:")
  let seedOk = 0
  for (const exp of SEED_EXPECTATIONS) {
    const seed = readFileSync(join(root, "_scripts", exp.file), "utf8")
    const found = seed.includes(exp.href) || seed.includes(`video: ${exp.const}`)
    if (found) seedOk++
    console.log(`  ${found ? "OK" : "MISSING"} ${exp.label} in ${exp.file}`)
  }

  console.log(
    `\nSummary: ${ok}/${WP_VIDEOS.length} files OK, ${seedOk}/${SEED_EXPECTATIONS.length} seed refs OK`,
  )

  if (ok !== WP_VIDEOS.length || seedOk !== SEED_EXPECTATIONS.length) process.exit(1)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
