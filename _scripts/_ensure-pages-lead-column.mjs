// Ensures pages.lead exists (required for SEO meta descriptions).
// Safe to re-run. Usage: node _scripts/_ensure-pages-lead-column.mjs
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

async function run() {
  const res = await fetch(env.ORBITYPE_API_SQL_URL, {
    method: "POST",
    headers: {
      "X-API-KEY": env.ORBITYPE_API_SQL_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql: `ALTER TABLE pages ADD COLUMN IF NOT EXISTS lead json DEFAULT '{"en":"...","de":"..."}'::json`,
    }),
  })
  const text = await res.text()
  console.log("status:", res.status, "->", text)
}

run()
