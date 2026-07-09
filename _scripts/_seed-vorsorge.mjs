// Seeds the Zofingen Treuhand "Unabhängige Vorsorge und Pensionsplanung" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 107:1072) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-vorsorge.mjs
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
const img = (name) => `/img/vorsorge/${name}`
const CTA = "Beratungsgespräch vereinbaren"
const CTA_HREF = "https://calendly.com/ph-bally/30min"

const sections = [
  {
    title: "Unabhängige Pensionsplanung",
    subtitle:
      "Planen Sie Ihre finanzielle Zukunft mit unserer unabhängigen Vorsorge- und Pensionsplanung",
    body: "Wir skizzieren Ihre finanziellen Rahmenbedingungen für eine sichere Zukunft.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: HERO_IMAGE,
    align: "left",
    _orbi: { component: "SectionHero" },
  },
  {
    body: "Die Vorsorge- und Pensionsplanung ist ein entscheidender Schritt, um Ihre finanzielle Zukunft abzusichern.\n\nBei Zofingen Treuhand AG bieten wir Ihnen unabhängige Beratung und helfen Ihnen dabei, Ihre Einkommen, Vermögenswerte und Steuern zu optimieren, während wir Ihre individuellen Wünsche berücksichtigen.",
    image: img("tm.png"),
    reverse: true,
    _orbi: { component: "SectionTextMedia" },
  },
  {
    quote:
      "«Die Fragen rund um die Altersvorsorge und Pensionsplanung können verwirrend und komplex sein. Sie möchten sicherstellen, dass Sie die richtigen Entscheidungen treffen, um Ihre finanziellen Ziele zu erreichen und Ihre Liebsten abzusichern. Es ist wichtig, unabhängige Beratung zu erhalten und Ihre individuellen Rahmenbedingungen zu berücksichtigen.«",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionQuoteCta" },
  },
  {
    cards: [
      {
        title: "Wir beantworten folgende Fragen",
        items: [
          "Welche Leistungen erhalte ich von der AHV und der Pensionskasse?",
          "Kann ich eine vorzeitige Pensionierung finanzieren?",
          "Wie plane ich den Bezug der Vorsorgebeiträge aus der Pensionskasse und/oder Säule 3a?",
          "Soll ich bei der Pensionskasse eine Rentenlösung oder ein Kapitalbezug vorziehen?",
          "Soll ich meine Hypotheken amortisieren?",
          "Wie kann ich meine Liebsten finanziell absichern?",
          "Was passiert mit meiner Liegenschaft wenn ich ins Altersheim muss?",
          "Muss ich erbrechtliche Bestimmungen beachten?",
        ],
      },
      {
        title: "Wir bieten folgende Dienstleistungen",
        items: [
          "Simulationsberechnungen zur zukünftigen Entwicklung Ihres Einkommens, Ausgaben und Vermögen",
          "Berechnungen von vorzeitigen Pensionierungen Modellberechnungen",
          "Kapitalbezug oder Rentenbezug BVG / Vorbezug AHV",
          "Detaillierte Pensionsplanung mit mehreren Variantenvergleichen",
          "Modellberechnungen für die Finanzierung des Wohneigentums nach der Pensionierung",
        ],
      },
    ],
    _orbi: { component: "SectionListCards" },
  },
  {
    intro:
      "Unsere unabhängige Vorsorge- und Pensionsplanung ermöglicht es Ihnen, Ihre finanzielle Zukunft zu planen und zu optimieren. Wir bieten Ihnen eine ganzheitliche Beratung, die Simulationen zur zukünftigen Entwicklung Ihres Einkommens, Ihrer Ausgaben und Ihres Vermögens beinhaltet. Wir beantworten Ihre Fragen zur AHV und Pensionskasse, unterstützen Sie bei der Finanzierung einer vorzeitigen Pensionierung, helfen Ihnen bei der Planung des Versorgungsbezüge und vieles mehr.",
    wide: true,
    cards: [
      {
        title: "Unabhängige Beratung",
        body: "Wir verkaufen keine Versicherungen oder Anlageprodukte, sondern bieten Ihnen eine objektive und unabhängige Beratung, um Ihre individuellen finanziellen Bedürfnisse zu erfüllen.",
      },
      {
        title: "Individuelle Lösungen",
        body: "Wir berücksichtigen Ihre persönlichen Wünsche und Rahmenbedingungen, um massgeschneiderte Vorsorge- und Pensionspläne zu entwickeln, die Ihren Zielen entsprechen.",
      },
      {
        title: "Finanzielle Sicherheit",
        body: "Mit unseren detaillierten Pensionsplanungen und Simulationen können Sie Ihre finanzielle Zukunft besser planen und mögliche Risiken frühzeitig erkennen",
      },
      {
        title: "Fachkompetenz",
        body: "Unsere Experten verfügen über umfangreiches Wissen und langjährige Erfahrung im Bereich der Vorsorge- und Pensionsplanung, um Ihnen fundierte Empfehlungen zu geben.",
      },
    ],
    _orbi: { component: "SectionFeatureCards" },
  },
  {
    background: img("cta-bg.png"),
    video: HERO_VIDEO,
    title: "Bereit loszulegen?",
    body: "Nach vielen Jahren Tätigkeit für Kanton und Gemeinden, habe ich es mir zur Aufgabe gemacht, meine Expertise direkt und persönlich in den Dienst von Menschen und Unternehmen zu stellen.\n\nMit dem Fokus auf die Zukunft biete ich Ihnen eine massgeschneiderte Treuhandberatung, die auf persönlicher Betreuung basiert – von Mensch zu Mensch.",
    ctaLabel: "Rückruf vereinbaren",
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionCtaBanner" },
  },
]

const title = {
  de: "Unabhängige Vorsorge und Pensionsplanung",
  en: "Independent Pension Planning",
}
const keywords = [
  "Vorsorge",
  "Pensionsplanung",
  "Altersvorsorge",
  "AHV",
  "Pensionskasse",
  "Säule 3a",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "unabhaengige-vorsorge-und-pensionsplanung"

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
