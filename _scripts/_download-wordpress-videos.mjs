// Download WordPress videos → temp, optimize with ffmpeg → public/videos/wp/, delete temp.
// Usage: node _scripts/_download-wordpress-videos.mjs
// Requires: ffmpeg (brew install ffmpeg)
import {
  createWriteStream,
  mkdirSync,
  rmSync,
  statSync,
  existsSync,
} from "node:fs"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import {
  WP_VIDEOS,
  scriptRoot,
  videosTempDir,
  videosPublicDir,
} from "./_wordpress-videos.mjs"

const root = scriptRoot()
const TEMP_DIR = videosTempDir(root)
const OUT_DIR = videosPublicDir(root)
const MAX_RETRIES = 3

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ensureFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" })
  if (r.status !== 0) {
    throw new Error("ffmpeg not found. Install with: brew install ffmpeg")
  }
}

async function download(url, destPath) {
  let lastError

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`)
      if (!res.body) throw new Error(`No response body: ${url}`)

      await pipeline(Readable.fromWeb(res.body), createWriteStream(destPath))
      return statSync(destPath).size
    } catch (e) {
      lastError = e
      rmSync(destPath, { force: true })
      if (attempt < MAX_RETRIES) {
        const wait = attempt * 2000
        console.log(`  retry ${attempt}/${MAX_RETRIES - 1} in ${wait / 1000}s…`)
        await sleep(wait)
      }
    }
  }

  throw lastError
}

function optimize(inputPath, outputPath, profile) {
  const scale =
    profile === "background"
      ? "scale='min(1920,iw)':-2"
      : "scale='min(1280,iw)':-2"

  const args = ["-y", "-i", inputPath, "-vf", scale, "-c:v", "libx264"]

  if (profile === "background") {
    args.push("-an", "-crf", "28", "-preset", "slow")
  } else {
    args.push("-c:a", "aac", "-b:a", "128k", "-crf", "26", "-preset", "slow")
  }

  args.push("-movflags", "+faststart", outputPath)

  const r = spawnSync("ffmpeg", args, { stdio: "inherit" })
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${inputPath}`)
}

async function run() {
  ensureFfmpeg()

  mkdirSync(TEMP_DIR, { recursive: true })
  mkdirSync(OUT_DIR, { recursive: true })

  console.log("Processing videos…")
  const results = []

  for (const item of WP_VIDEOS) {
    const tempPath = join(TEMP_DIR, item.filename)
    const outPath = join(OUT_DIR, item.filename)

    console.log(`\n→ ${item.filename} (${item.profile})`)

    if (existsSync(outPath) && statSync(outPath).size > 0) {
      const optSize = statSync(outPath).size
      console.log(`  skip (exists): ${formatSize(optSize)} in public/videos/wp/`)
      results.push({
        filename: item.filename,
        rawSize: 0,
        optSize,
        profile: item.profile,
        skipped: true,
      })
      continue
    }

    const rawSize = await download(item.url, tempPath)
    console.log(`  downloaded: ${formatSize(rawSize)}`)

    optimize(tempPath, outPath, item.profile)
    rmSync(tempPath, { force: true })

    const optSize = statSync(outPath).size
    console.log(`  optimized: ${formatSize(optSize)} → public/videos/wp/`)

    results.push({
      filename: item.filename,
      rawSize,
      optSize,
      profile: item.profile,
    })
  }

  rmSync(TEMP_DIR, { recursive: true, force: true })
  console.log("\nTemp folder removed.")

  const processed = results.filter((r) => !r.skipped)
  const totalRaw = processed.reduce((s, r) => s + r.rawSize, 0)
  const totalOpt = results.reduce((s, r) => s + r.optSize, 0)
  console.log(`\nDone: ${results.length} videos (${processed.length} processed, ${results.length - processed.length} skipped)`)
  if (totalRaw > 0) {
    console.log(`  before: ${formatSize(totalRaw)}`)
    console.log(`  after:  ${formatSize(totalOpt)}`)
    console.log(
      `  saved:  ${formatSize(totalRaw - totalOpt)} (${Math.round((1 - totalOpt / totalRaw) * 100)}%)`,
    )
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
