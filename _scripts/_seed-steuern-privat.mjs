// Seeds the Zofingen Treuhand "Steuern für Privatpersonen" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 107:879) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-steuern-privat.mjs
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { HERO_VIDEO } from "./_wordpress-videos.mjs"
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
const img = (name) => `/img/steuern-privat/${name}`
const CTA = "Jetzt Kontakt aufnehmen"
const CTA_HREF = "/kontakt"

const sections = [
  {
    title: "Steuern für Privatpersonen",
    subtitle:
      "Optimieren Sie Ihre Steuerangelegenheiten mit unserer professionellen Unterstützung für Privatpersonen",
    body: "Wir beraten Sie umfassend in allen steuerlichen Themen und bieten Lösungen für komplexe Sachverhalte und internationales Steuerrecht.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: HERO_IMAGE,
    _orbi: { component: "SectionHero" },
  },
  {
    body: "Wenn es um Ihre persönlichen Steuerangelegenheiten geht, ist es wichtig, einen verlässlichen Partner an Ihrer Seite zu haben.\n\nWir von Zofingen Treuhand verstehen die Komplexität des Steuerrechts und sind darauf spezialisiert, Privatpersonen bei ihren steuerlichen Themen zu unterstützen.\n\nUnser Team verfügt über umfangreiche Kompetenzen, um Sie auch in schwierigen und internationalen steuerlichen Sachverhalten zu beraten.",
    image: img("tm.png"),
    _orbi: { component: "SectionTextMedia" },
  },
  {
    intro:
      "Das Steuerrecht kann komplex und verwirrend sein, insbesondere wenn es um internationale Aspekte oder spezielle Steuererklärungen wie Grundstückgewinne, Erbschafts- und Schenkungssteuern geht. Als Privatperson möchten Sie sicherstellen, dass Sie alle steuerlichen Vorschriften einhalten und gleichzeitig die bestmöglichen steuerlichen Optimierungsmöglichkeiten nutzen.",
    image: img("services.png"),
    columns: [
      {
        title: "Steuern",
        items: [
          "Steuerberatungen",
          "Steuerplanungen",
          "Internationales Steuerrecht",
          "Steuererklärungen",
          "Sondersteuern (z. B. Steuererklärung für Grundstückgewinne, Erbschafts- und Schenkungssteuern)",
        ],
      },
      {
        title: "Grundstückgewinnsteuern",
        items: [
          "Ausfüllen Formular Steuererklärung für Grundstückgewinne",
          "Steuerberechnungen",
          "Qualifikation Abzugsfähigkeit der Anlagekosten",
          "Beurteilung Steueraufschub",
          "Berechnung Ersatzbeschaffung",
        ],
      },
      {
        title: "Vorsorgeplanung",
        body: "Wir beraten Sie im Bereich der Pensions- und Vorsorgeplanung. Mit unserer Beratung können wir Einkommen, Vermögen und Steuern optimieren und gleichzeitig Ihre Wünsche berücksichtigen.\n\nWir verkaufen keine Versicherungen oder Anlageprodukte! Wir beraten Sie neutral und skizzieren Ihre finanziellen Rahmenbedingungen für die Zukunft.",
      },
    ],
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionServiceColumns" },
  },
  {
    intro:
      "Unsere Steuerexperten bieten Ihnen umfassende Beratungen und Lösungen für Ihre steuerlichen Themen an. Wir unterstützen Sie bei der Erstellung Ihrer Steuererklärungen, bieten individuelle Steuerplanungen an und besitzen Expertise im internationalen Steuerrecht. Zudem helfen wir Ihnen bei speziellen Steuererklärungen wie Grundstückgewinnen, Erbschafts- und Schenkungssteuern.",
    wide: true,
    cards: [
      {
        title: "Umfassende Beratung",
        body: "Wir haben das Know-how und die Erfahrung, um Sie in allen steuerlichen Belangen kompetent zu beraten und individuelle Lösungen für Ihre spezifische Situation zu finden.",
      },
      {
        title: "Komplexitätsbewältigung",
        body: "Das internationale und interkantonale Steuerrecht kann komplex sein. Mit unserer Unterstützung behalten Sie den Überblick und können rechtliche Konsequenzen vermeiden.",
      },
      {
        title: "Steuerliche Optimierung",
        body: "Wir helfen Ihnen, steuerliche Optimierungsmöglichkeiten zu nutzen und Ihre Steuerlast nachhaltig zu reduzieren.",
      },
      {
        title: "Persönlicher Service",
        body: "Unser Team steht Ihnen mit professioneller Erfahrung und individueller Betreuung zur Seite, um Ihre steuerlichen Anliegen ideal zu lösen.",
      },
    ],
    _orbi: { component: "SectionFeatureCards" },
  },
  {
    background: img("cta-bg.png"),
    video: HERO_VIDEO,
    title: "Bereit loszulegen?",
    body: "Nach vielen Jahren Tätigkeit für Kanton und Gemeinden, habe ich es mir zur Aufgabe gemacht, meine Expertise direkt und persönlich in den Dienst von Menschen und Unternehmen zu stellen.\n\nMit dem Fokus auf die Zukunft biete ich Ihnen eine massgeschneiderte Treuhandberatung, die auf persönlicher Betreuung basiert – von Mensch zu Mensch.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionCtaBanner" },
  },
]

const title = {
  de: "Steuern für Privatpersonen",
  en: "Taxes for Individuals",
}
const keywords = [
  "Steuern",
  "Privatpersonen",
  "Steuerberatung",
  "Steuererklärung",
  "Grundstückgewinnsteuern",
  "Vorsorgeplanung",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "steuern-fuer-privatpersonen"

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
