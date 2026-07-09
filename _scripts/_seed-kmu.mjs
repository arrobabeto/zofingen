// Seeds the Zofingen Treuhand "KMU" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 89:793) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-kmu.mjs
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
const img = (name) => `/img/kmu/${name}`
const CTA = "Rückruf vereinbaren"
const CTA_HREF = "https://calendly.com/ph-bally/rueckruf-termin"

const sections = [
  {
    title: "KMU Dienstleistungen",
    subtitle:
      "Optimieren Sie Ihre Buchhaltung mit unseren massgeschneiderten KMU-Dienstleistungen",
    body: "Ihre Bedürfnisse stehen im Mittelpunkt – Wir bieten Ihnen individuelle Lösungen für Ihre Buchhaltung, Finanzen und Personalmanagement unter Einbezug von automatisierten Buchungstools.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: HERO_IMAGE,
    align: "left",
    _orbi: { component: "SectionHero" },
  },
  {
    body: "Als Unternehmer sind Sie täglich mit einer Vielzahl von Aufgaben und Herausforderungen konfrontiert.\n\nFinanzverwaltung, Buchhaltung und Personaladministration können dabei zu zeitaufwändigen und komplexen Aufgaben werden. Bei Zofingen Treuhand verstehen wir Ihre Bedürfnisse als KMU und bieten Ihnen massgeschneiderte Lösungen, um Ihre Unternehmensfinanzen zu optimieren.\n\nDabei setzen wir erfolgreich automatisierte Tools für repetitive Buchungen ein, so dass wir uns Zeit für Ihre Bedürfnisse nehmen können.",
    image: img("intro-image.png"),
    _orbi: { component: "SectionTextMedia" },
  },
  {
    quote:
      "«Die Finanz- und Buchhaltungsprozesse können eine grosse Belastung für Ihr Unternehmen darstellen. Die Erstellung von Jahresabschlüssen, die Buchhaltungsunterstützung und die Liquiditätsplanung erfordern Fachwissen und Zeit, die Ihnen oft fehlt. Auch die Personaladministration und Lohnbuchhaltung können zu administrativen Herausforderungen führen.»",
    ctaLabel: "Jetzt kostenloses Beratungsgespräch vereinbaren",
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionQuoteCta" },
  },
  {
    title: "Unser Prozess",
    intro:
      "Unsere KMU-Dienstleistungen sind darauf ausgerichtet, Ihnen bei diesen Herausforderungen zu helfen und massgeschneiderte Lösungen für Sie zu finden. Wir übernehmen die Erstellung Ihrer Jahresabschlüsse und unterstützen Sie bei Ihrer Buchhaltung, inklusive der Liquiditätsplanung, Kalkulationsgrundlagen, Budgetierung und betriebswirtschaftlichen Auswertungen. Zudem bieten wir umfassende Dienstleistungen im Personalmanagement, von der Personaladministration über die Lohnbuchhaltung bis hin zu Quellensteuern, Arbeitsverträgen und Spesenreglementen.",
    steps: [
      {
        title: "Buchhaltung / Finanzen",
        items: [
          "Jahresabschlüsse",
          "Buchhaltungsunterstützung",
          "Liquiditätsplanung",
          "Kalkulationsgrundlagen",
          "Budgetierung",
          "Betriebswirtschaftliche\nAnalysen",
        ],
      },
      {
        title: "Personal",
        items: [
          "Personaladministration",
          "Lohnadministration",
          "Lohnbuchhaltung",
          "Quellensteuern",
          "Arbeitsverträge",
          "Spesenreglemente",
        ],
      },
      {
        title: "Unternehmenszyklus",
        items: [
          "Firmengründungen",
          "KMU-Beratung",
          "Business-Pläne",
          "Unternehmensbewertungen",
          "Unternehmensnachfolge",
          "Organisationsberatung",
        ],
      },
    ],
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionProcessCards" },
  },
  {
    wide: true,
    cards: [
      {
        title: "Individuelle Lösungen",
        body: "Wir verstehen, dass jedes KMU einzigartig ist. Daher bieten wir auf Ihr Unternehmen ausgerichtete Lösungen, die auf Ihre spezifischen Bedürfnisse zugeschnitten sind.",
      },
      {
        title: "Digitalisierung",
        body: "Durch den Einsatz von automatisierten Buchungstools im Rahmen einer Cloud-Lösung haben Sie jederzeit Zugriff zu den verbuchten Unterlagen.",
      },
      {
        title: "Zeitersparnis",
        body: "Durch unsere Unterstützung bei der Buchhaltung und Personaladministration können Sie wertvolle Zeit sparen und sich auf Ihr Kerngeschäft konzentrieren.",
      },
      {
        title: "Effizienzsteigerung",
        body: "Mit unserer Unterstützung bei der Budgetierung, Liquiditätsplanung und betriebswirtschaftlichen Auswertungen können Sie Ihre Unternehmensprozesse optimieren und effizienter gestalten.",
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
  de: "KMU Dienstleistungen",
  en: "SME Services",
}
const keywords = [
  "KMU",
  "Buchhaltung",
  "Personaladministration",
  "Lohnbuchhaltung",
  "Zofingen",
  "Treuhand",
]

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
  await sql("DELETE FROM pages WHERE slug = :slug", { slug: "kmu" })
  await sql(
    "INSERT INTO pages (title, slug, sections, keywords) VALUES (:title::json, :slug, :sections::json, :keywords::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      slug: "kmu",
    },
  )
}

run()
