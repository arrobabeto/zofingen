// Seeds the Zofingen Treuhand "Immobilien" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 107:1302) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-immobilien.mjs
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { HERO_VIDEO } from "./_wordpress-videos.mjs"

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
const img = (name) => `/img/immobilien/${name}`
const CTA = "Jetzt Kontakt aufnehmen"
const CTA_HREF = "/kontakt"

const sections = [
  {
    title: "Immobilien Verwaltung",
    subtitle:
      "Professionelle Liegenschaftsverwaltung und kompetente Beratung für Immobilienbesitzer",
    body: "Wir übernehmen Ihre Liegenschafts-Buchhaltung, erstellen Nebenkostenabrechnungen und bieten Ihnen umfassende Unterstützung bei Immobilien-Finanzierungen und rechtlichen Fragen.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: img("hero-bg.png"),
    video: HERO_VIDEO,
    align: "right",
    _orbi: { component: "SectionHero" },
  },
  {
    image: img("city.png"),
    body: "Als Immobilienbesitzer kennen Sie die vielfältigen Aufgaben und Herausforderungen, die mit der Verwaltung einer Liegenschaft einhergehen. Wir von Zofingen Treuhand AG bieten Ihnen eine professionelle Liegenschaftsverwaltung und umfangreiche Beratungsdienstleistungen, um Ihnen dabei zu helfen, Ihre Immobilieninvestition optimal zu nutzen.\n\nWir führen Ihre Liegenschaftsbuchhaltung und erstellen die Nebenkostenabrechnungen. Ebenfalls unterstützen wir Sie bei Immobilien-Finanzierungen und wir können allfällige steuerrechtliche, erbrechtliche- bzw. familienrechtliche Fragen beantworten.",
    items: [
      "Liegenschafts-Buchhaltung",
      "Mietzinsinkasso",
      "Nebenkostenabrechnungen",
      "Mithilfe bei Finanzierungen",
      "Beurteilung steuerrechtliche Fragen",
      "Beantwortung erbrechtliche Fragen",
      "Verkauf von Immobilien",
    ],
    _orbi: { component: "SectionTextMediaList" },
  },
  {
    quote:
      "«Die Verwaltung von Liegenschaften kann zeitaufwendig und komplex sein. Viele Immobilienbesitzer haben Schwierigkeiten bei der Liegenschaftsbuchhaltung und der Erstellung von Nebenkostenabrechnungen. Darüber hinaus können steuerrechtliche, erbrechtliche und familienrechtliche Fragen Unsicherheit und Herausforderungen mit sich bringen.»",
    ctaLabel: "Beratungsgespräch vereinbaren",
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionQuoteCta" },
  },
  {
    intro:
      "Unsere erfahrenen Experten übernehmen die Liegenschafts-Buchhaltung und erstellen professionelle Nebenkostenabrechnungen für Sie. Wir unterstützen Sie auch bei Immobilien-Finanzierungen und beantworten allfällige steuerrechtliche, erbrechtliche und familienrechtliche Fragen. Mit unserer umfassenden Fachkompetenz und langjährigen Erfahrung stehen wir Ihnen als verlässlicher Partner zur Seite.",
    wide: true,
    cards: [
      {
        title: "Professionelle Liegenschaftsverwaltung",
        body: "Wir übernehmen die komplette Liegenschafts-Buchhaltung und stellen sicher, dass Ihre Nebenkostenabrechnungen präzise und korrekt erstellt werden.",
      },
      {
        title: "Finanzielle\nUnterstützung",
        body: "Wir bieten Ihnen Beratung und Unterstützung bei Immobilien-Finanzierungen, um Ihnen dabei zu helfen, die besten finanziellen Entscheidungen für Ihre Immobilieninvestitionen zu treffen.",
      },
      {
        title: "Fachkundige Beratung",
        body: "Unsere Experten beantworten Ihre steuerrechtlichen, erbrechtlichen und familienrechtlichen Fragen und helfen Ihnen, mögliche rechtliche Fallstricke zu vermeiden.",
      },
      {
        title: "Effizienz und Entlastung",
        body: "Durch die Auslagerung Ihrer Liegenschaftsverwaltung können Sie sich auf Ihre Kernkompetenzen konzentrieren und Zeit und Ressourcen sparen.",
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
  de: "Immobilien",
  en: "Real Estate",
}
const keywords = [
  "Immobilien",
  "Liegenschaftsverwaltung",
  "Liegenschafts-Buchhaltung",
  "Nebenkostenabrechnung",
  "Immobilien-Finanzierung",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "immobilien"

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
