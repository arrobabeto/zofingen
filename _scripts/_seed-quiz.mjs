// Seeds the Zofingen Treuhand "Quiz" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 2054:1121) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-quiz.mjs
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
const img = (name) => `/img/quiz/${name}`

const sections = [
  {
    title: "Wie gut sind Sie vorbereitet?",
    image: img("hero-bg.png"),
    align: "left",
    _orbi: { component: "SectionPageHero" },
  },
  {
    intro:
      "Wählen Sie ein Thema aus, mit dem Sie beginnen möchten. Nach Abschluss des Kurztests können Sie bei Bedarf weitere Themen beantworten oder direkt einen Beratungstermin vereinbaren.",
    cards: [
      {
        title: "Pensionsplanung",
        duration: "Dauer: ca. 2 Minuten",
        body: "Prüfen Sie, ob Ihre Vorsorge auf Ihre persönlichen Ziele, Ihre finanzielle Zukunft und Ihre Lebenssituation abgestimmt ist.",
      },
      {
        title: "Buchhaltung & Jahresabschluss",
        duration: "Dauer: ca. 2 Minuten",
        body: "Finden Sie heraus, ob Ihre Buchhaltung effizient organisiert ist und ob Ihre Jahresabschlüsse strukturiert vorbereitet werden.",
        highlight: true,
      },
      {
        title: "Steuerberatung",
        duration: "Dauer: ca. 2 Minuten",
        body: "Erkennen Sie, ob Sie steuerliche Möglichkeiten bereits optimal nutzen und ob sich eine vorausschauende Steuerplanung für Sie lohnt.",
      },
    ],
    ctaLabel: "Starten",
    _orbi: { component: "SectionQuiz" },
  },
]

const title = {
  de: "Quiz",
  en: "Quiz",
}
const keywords = [
  "Quiz",
  "Kurztest",
  "Pensionsplanung",
  "Buchhaltung",
  "Jahresabschluss",
  "Steuerberatung",
  "Zofingen Treuhand",
]

const slug = "quiz"

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
