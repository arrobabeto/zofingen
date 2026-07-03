// Seeds the Zofingen Treuhand "Grundstückgewinnsteuern" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 107:1460) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-grundstueckgewinnsteuern.mjs
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
const img = (name) => `/img/grundstueckgewinnsteuern/${name}`
const CTA = "Jetzt Kontakt aufnehmen"
const CTA_HREF = "#kontakt"

const sections = [
  {
    title: "Grundstückgewinnsteuern",
    subtitle:
      "Professionelle Unterstützung bei Grundstückgewinnsteuern – Maximieren Sie Ihren Verkaufsgewinn",
    body: "Vertrauen Sie auf unsere langjährige Erfahrung im Bereich der Grundstückgewinnsteuern und lassen Sie sich umfassend beraten.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: img("hero-bg.png"),
    align: "left",
    _orbi: { component: "SectionHero" },
  },
  {
    image: img("tm.png"),
    body: "Der Verkauf von Grundeigentum kann steuerliche Herausforderungen mit sich bringen.\n\nBei Zofingen Treuhand AG verfügen wir über langjährige Erfahrung und Expertenwissen im Bereich der Grundstückgewinnsteuern.\n\nWir bieten Ihnen professionelle Unterstützung und umfassende Beratungsdienstleistungen, um Ihren Verkaufsgewinn zu maximieren und steuerliche Belastungen zu minimieren.",
    reverse: true,
    _orbi: { component: "SectionTextMedia" },
  },
  {
    quote:
      "«Beim Verkauf von Grundeigentum werden Grundstückgewinnsteuern fällig. Die Höhe der Besteuerung hängt von der Besitzesdauer ab, wobei eine kürzere Besitzesdauer zu einer höheren Besteuerung führt. Zudem gibt es steuerrechtliche Regelungen wie den Steueraufschub und die Ersatzbeschaffung, die in der Steuerberechnung berücksichtigt werden muss.»",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionQuoteCta" },
  },
  {
    cards: [
      {
        title: "Wir beantworten folgende Fragen",
        body: "Sie erhalten Antworten auf steuerliche Fragen im Zusammenhang mit dem Verkauf von Grundeigentum",
      },
      {
        title: "Unsere Leistungen",
        items: [
          "Wir bieten verschiedene steuerliche Dienstleistungen an:",
          "Ausfüllen der Steuererklärung",
          "Steuerberatung zum Steueraufschub",
          "Berechnung der steuerlich anrechenbaren Besitzesdauer",
          "Qualifikation von Investitionen, Unterhalt und anderen Kosten",
          "Steuerliche Beurteilung von Wohnrecht und Nutzniessung",
          "Vertretung gegenüber Steuerbehörden",
        ],
      },
    ],
    _orbi: { component: "SectionListCards" },
  },
  {
    intro:
      "Unsere erfahrenen Steuerexperten unterstützen Sie bei allen steuerlichen Fragen rund um den Verkauf von Grundeigentum. Wir helfen Ihnen beim Ausfüllen der Steuererklärung, bieten Beratung zum Steueraufschub, berechnen die steuerlich anrechenbare Besitzesdauer und beurteilen Investitionen, Unterhalt und andere Kosten. Zudem können wir Sie bei Fragen zu Wohnrechten und Nutzniessungen beraten und vertreten Sie gegenüber den Steuerbehörden.",
    wide: true,
    cards: [
      {
        title: "Fachkundige Beratung",
        body: "Unsere Experten stehen Ihnen zur Seite und beantworten Ihre Fragen im Zusammenhang mit dem Verkauf von Grundeigentum.",
      },
      {
        title: "Maximierung des Verkaufsgewinns",
        body: "Wir helfen Ihnen dabei, steuerliche Belastungen zu minimieren und Ihren Verkaufsgewinn zu maximieren.",
      },
      {
        title: "Steuerrechtliche Expertise",
        body: "Mit unserem umfassenden Fachwissen in den steuerrechtlichen Regelungen können wir Ihnen zu Entlastungen und Reduzierung der Grundstückgewinnsteuern verhelfen.",
      },
      {
        title: "Vertretung gegenüber Steuerbehörden",
        body: "Wir unterstützen Sie bei der Kommunikation mit den Steuerbehörden und vertreten Ihre Interessen professionell.",
      },
    ],
    _orbi: { component: "SectionFeatureCards" },
  },
  {
    background: img("cta-bg.png"),
    title: "Bereit loszulegen?",
    body: "Nach vielen Jahren Tätigkeit für Kanton und Gemeinden, habe ich es mir zur Aufgabe gemacht, meine Expertise direkt und persönlich in den Dienst von Menschen und Unternehmen zu stellen.\n\nMit dem Fokus auf die Zukunft biete ich Ihnen eine massgeschneiderte Treuhandberatung, die auf persönlicher Betreuung basiert – von Mensch zu Mensch.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionCtaBanner" },
  },
]

const title = {
  de: "Grundstückgewinnsteuern",
  en: "Real Estate Capital Gains Tax",
}
const keywords = [
  "Grundstückgewinnsteuern",
  "Grundstückgewinn",
  "Steueraufschub",
  "Ersatzbeschaffung",
  "Verkauf Grundeigentum",
  "Steuererklärung",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "grundstueckgewinnsteuern"

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
