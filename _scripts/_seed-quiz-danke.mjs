// Seeds the Zofingen Treuhand "Quiz – Vielen Dank" (result) page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 2055:1611) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-quiz-danke.mjs
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { HERO_IMAGE } from "./_shared-assets.mjs"

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
const img = (name) => `/img/quiz-danke/${name}`

const sections = [
  {
    title: "Vielen Dank für Ihre Antworten",
    image: HERO_IMAGE,
    _orbi: { component: "SectionPageHero" },
  },
  {
    body: "Ihre Angaben wurden gespeichert. Gerne besprechen wir Ihre Situation in einem persönlichen Gespräch und zeigen Ihnen, welche nächsten Schritte sinnvoll sein könnten.",
    question:
      "Möchten Sie direkt einen Beratungstermin vereinbaren oder ein weiteres Thema beantworten?",
    buttons: [
      { label: "Kontakt aufnehmen", href: "/kontakt" },
      { label: "Weiteres Thema beantworten", href: "/quiz" },
    ],
    _orbi: { component: "SectionQuizResult" },
  },
]

const title = {
  de: "Quiz – Vielen Dank",
  en: "Quiz – Thank you",
}
const keywords = [
  "Quiz",
  "Vielen Dank",
  "Beratungstermin",
  "Kontakt",
  "Zofingen Treuhand",
]

const slug = "quiz-danke"

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
