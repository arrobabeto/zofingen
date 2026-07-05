// Seeds the Zofingen Treuhand "Jahresabschluss" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 89:1378) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-jahresabschluss.mjs
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
const img = (name) => `/img/jahresabschluss/${name}`
const CTA = "Rückruf vereinbaren"
const CTA_HREF = "https://calendly.com/ph-bally/rueckruf-termin"
const PRICE_CTA = "Zum Preisrechner"
const PRICE_HREF = "/rechner"

const sections = [
  {
    title: "Jahresabschluss",
    subtitle:
      "Machen Sie sich die Vorteile eines professionellen Jahresabschlusses mit Zofingen Treuhand AG zu Nutze",
    body: "Mit einer cloudbasierten Software und mit Automatisierung in der Verbuchung der Belegstruktur und Bankbewegungen erstellen wir Ihren Jahresabschluss.\n\nVon der Erstellung der Buchhaltung bis zur Vertretung vor Behörden – wir bieten Ihnen einen reibungslosen und effizienten Jahresabschluss zu einem attraktiven Preis.\n\nZu unserem Leistungsumfang gehört auch eine durch uns erstellte Liquiditätsplanung wie auch die Auswertung der Kostenstruktur und die vereinfachte Kostenkalkulation anhand einer Berechnung der fixen und variablen Kosten.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: img("hero-bg.png"),
    video: HERO_VIDEO,
    _orbi: { component: "SectionHero" },
  },
  {
    title: "Unsere Dienstleistungen rund um den Jahresabschluss",
    body: "Mit unseren massgeschneiderten Buchhaltungsdienstleistungen ab nur CHF 265 pro Monat ist es einfacher und kostengünstiger als je zuvor, Ihren Jahresabschluss zu optimieren.\n\nDie Zofingen Treuhand AG bietet Ihnen eine Reihe von Dienstleistungen an, die speziell darauf ausgerichtet sind, Ihnen einen reibungslosen und effizienten Jahresabschluss zu ermöglichen:",
    items: [
      "Erstellung von Debitorenbuchhaltungen",
      "Verbuchung von Abschreibungen und Abgrenzungen",
      "Erstellen von Steuerabschlüssen",
      "Berechnung von Kennzahlen und finanziellen Abhängigkeiten",
      "Erarbeiten von Organisations- und Nachfolgelösungen",
      "Vertretung vor Behörden in finanziellen Belangen",
    ],
    _orbi: { component: "SectionServiceList" },
  },
  {
    title: "Berechnen Sie Ihre monatlichen\nBuchhaltungskosten",
    body: "Möchten Sie Ihre Lohnabrechnung optimieren und von unserem professionellen Service profitieren? Buchen Sie jetzt Ihr persönliches Beratungsgespräch und machen Sie sich die Expertise von Zofingen Treuhand AG zu Nutze.",
    ctaLabel: PRICE_CTA,
    ctaHref: PRICE_HREF,
    dividers: false,
    _orbi: { component: "SectionCalculator" },
  },
  {
    title: "Warum ein professioneller Jahresabschluss wichtig ist",
    body: "Der Jahresabschluss ist mehr als eine gesetzliche Pflicht. Er ist das Spiegelbild Ihrer Unternehmensfinanzen, ein wichtiger Faktor für die strategische Planung und ein Muss für die Compliance.\n\nEin professionell erstellter Jahresabschluss kann Ihnen einen klaren Überblick über Ihre finanzielle Situation verschaffen und begründete Entscheidungen erleichtern. Er kann auch dazu beitragen, rechtliche Konsequenzen zu vermeiden und Ihren Seelenfrieden zu bewahren.\n\nSind Sie bereit für den Unterschied? Fordern Sie noch heute eine unverbindliche Offerte an!",
    image: img("tm-a.png"),
    reverse: true,
    ctaLabel: PRICE_CTA,
    ctaHref: PRICE_HREF,
    _orbi: { component: "SectionTextMedia" },
  },
  {
    title: "Kundenorientiert und massgeschneidert",
    body: "Jedes Unternehmen ist einzigartig, so auch die finanziellen Bedürfnisse und Herausforderungen. Wir von der Zofingen Treuhand AG glauben an einen kundenorientierten Ansatz. Wir nehmen uns Zeit, Ihre spezifischen Bedürfnisse zu verstehen und bieten Ihnen massgeschneiderte Lösungen an, die auf Ihre Situation zugeschnitten sind. Unser Financial Services Experte und sein Team stehen Ihnen jederzeit für Fragen und Anliegen zur Verfügung.",
    image: img("tm-b.png"),
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionTextMedia" },
  },
  {
    title: "Über Uns",
    body: "Zofingen Treuhand AG steht für vollkommene und persönliche Zuverlässigkeit. Mit über 15 Jahren Erfahrung im Steuer- und Finanzbereich und zahlreichen renommierten Abschlüssen im Bildungswesen ist unser Inhaber Philippe Bally Ihr vertrauenswürdiger Partner für einen für Sie stressfreien Jahresabschluss.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    photo: img("philippe.png"),
    name: "Inhaber Philippe Bally",
    _orbi: { component: "SectionAbout" },
  },
  {
    title: "Unser Prozess",
    subtitle:
      "Wir wissen, dass der Jahresabschluss eine komplexe Aufgabe ist, deshalb haben wir zur Vereinfachung und Klärung der Bedürfnisse einen dreistufigen Prozess entwickelt",
    steps: [
      {
        title: "Phase 1",
        items: ["Kennenlernen", "Problemerfassung", "Zieldefinition"],
      },
      {
        title: "Phase 2",
        items: ["Priorisieren", "Prüfen", "Ausführen", "Kontrollieren"],
      },
      {
        title: "Phase 3",
        items: ["Berichterstattung", "Blick in die Zukunft"],
      },
    ],
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionProcess" },
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
  de: "Jahresabschluss",
  en: "Annual Financial Statements",
}
const keywords = [
  "Jahresabschluss",
  "Buchhaltung",
  "Steuerabschluss",
  "Liquiditätsplanung",
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
  await sql("DELETE FROM pages WHERE slug = :slug", { slug: "jahresabschluss" })
  await sql(
    "INSERT INTO pages (title, slug, sections, keywords) VALUES (:title::json, :slug, :sections::json, :keywords::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      slug: "jahresabschluss",
    },
  )
}

run()
