// Seeds the Zofingen Treuhand "Kontakt" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 109:1586) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-kontakt.mjs
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

const URL = env.ORBITYPE_API_SQL_URL
const KEY = env.ORBITYPE_API_SQL_KEY
const img = (name) => `/img/kontakt/${name}`

const sections = [
  {
    title: "Zofingen Treuhand AG",
    subtitle: "Kontaktieren Sie uns noch heute",
    image: img("hero-bg.png"),
    align: "left",
    compact: true,
    _orbi: { component: "SectionHero" },
  },
  {
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1353.1456362371514!2d7.943856908940439!3d47.28910729434361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479025e3fadc0e09%3A0x4ba232eb87d62197!2sZofingen%20Treuhand%20AG!5e0!3m2!1sen!2smx!4v1783410053211!5m2!1sen!2smx",
    office: "Kirchplatz 4 4800 Zofingen",
    phone: "062 745 70 30",
    email: "kontakt@zofingen-treuhand.ch",
    linkedin: "Vernetzen mit Philippe Bally auf LinkedIn",
    services: [
      "Steuerberatung",
      "Jahresabschluss",
      "KMU",
      "Firmengründung",
      "Externe Lohnbuchhaltung",
      "Steuern für Privatpersonen",
      "Vorsorge- und Pensionsplanung",
      "Immobilien",
      "Grundstückgewinnsteuern",
    ],
    _orbi: { component: "SectionContact" },
  },
]

const title = {
  de: "Kontakt",
  en: "Contact",
}
const keywords = [
  "Kontakt",
  "Zofingen Treuhand",
  "Anfrage",
  "Beratung",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "kontakt"

async function sql(query, bindings) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "X-API-KEY": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  console.log("status:", res.status, "->", text)
  return res
}

async function run() {
  await sql("DELETE FROM pages WHERE slug = :slug", { slug })
  await sql(
    "INSERT INTO pages (title, slug, sections, keywords) VALUES (:title::json, :slug, :sections::json, :keywords::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      slug,
    },
  )
}

run()
