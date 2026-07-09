// Seeds the Zofingen Treuhand "Externe Lohnbuchhaltung" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 107:556) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-lohnbuchhaltung.mjs
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
const img = (name) => `/img/lohnbuchhaltung/${name}`
const CTA = "Jetzt Kontakt aufnehmen"
const CTA_HREF = "/kontakt"

const sections = [
  {
    title: "Externe Lohnbuchhaltung",
    subtitle:
      "Entlasten Sie sich mit unserer professionellen externen Lohnbuchhaltung",
    body: "Wir rechnen Ihre Löhne gesetzeskonform ab. Maximieren Sie Ihre Effizienz und Genauigkeit bei der Lohnabrechnung durch unseren zuverlässigen Service.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: HERO_IMAGE,
    _orbi: { component: "SectionHero" },
  },
  {
    body: "Sie beschäftigen Mitarbeitende und möchten sicherstellen, dass die Lohnbuchhaltung korrekt ist?\n\nWir erledigen die Lohnabrechnungen für Sie, damit Sie sich um Ihr Kerngeschäft kümmern können.",
    image: img("intro.png"),
    _orbi: { component: "SectionIntroImage" },
  },
  {
    cards: [
      {
        title: "ohne Quellensteuern",
        currency: "CHF",
        price: "29",
        caption: "pro Mitarbeitende/-r pro Monat (exkl. MwSt)",
        ctaLabel: CTA,
        ctaHref: CTA_HREF,
      },
      {
        title: "inkl. Quellensteuern",
        currency: "CHF",
        price: "39",
        caption: "pro Mitarbeitende/-r pro Monat (exkl. MwSt)",
        ctaLabel: CTA,
        ctaHref: CTA_HREF,
      },
    ],
    _orbi: { component: "SectionPriceCards" },
  },
  {
    title: "Ihre Vorteile",
    wide: true,
    cards: [
      {
        title: "Kostentransparenz",
        body: "Keine bösen Überraschungen dank Fixkosten",
      },
      {
        title: "Fachkompetenz",
        body: "Wir rechnen gesetzeskonform ab",
      },
      {
        title: "Keine Software-Kosten",
        body: "Sie benötigen keine teure Lohnbuchhaltungs-Software",
      },
      {
        title: "Datensicherheit",
        body: "Die Daten werden laufend und in Echtzeit gesichert. Serverstandort Schweiz",
      },
    ],
    _orbi: { component: "SectionFeatureCards" },
  },
  {
    image: img("icons.png"),
    items: [
      {
        title: "Zeiteinsparung",
        body: "Sie können viel Zeit sparen mit der Auslagerung der Lohnbuchhaltung. Wir übernehmen die monatlichen Berechnungen und erstellen die Jahresdeklarationen.",
      },
      {
        title: "Sicherheit",
        body: "Die Löhne sind wichtige Ausgabepositionen und falsch berechnete Abzüge und Fehler in den Abrechnungen können teuer werden. Wir übernehmen diese Arbeiten zu Ihrer Sicherheit.",
      },
      {
        title: "Verantwortung",
        body: "Wir übernehmen die Verantwortung für die korrekte Erstellung der Lohnabrechnungen. Wir überprüfen zusätzlich die Einhaltung allfälliger Gesamtarbeitsverträge (branchenabhängig).",
      },
    ],
    _orbi: { component: "SectionIconList" },
  },
  {
    title: "Und so funktionerts",
    steps: [
      {
        title: "Mitarbeitende erfassen",
        body: "Sie übertragen uns einmalig Ihre Mitarbeitendendaten in digitaler Form.",
      },
      {
        title: "Monatliche Lohnabrechnung",
        body: "Am Ende des Monats erstellen wir die Lohnabrechnung für alle Mitarbeitenden unter Berücksichtigung aller Steuern und Abgaben. Wir schicken Ihnen oder direkt den Mitarbeitenden die monatliche Lohnabrechnung. Am Ende des Jahres erstellen wir zudem den jährlichen Lohnausweis.",
      },
      {
        title: "Sie zahlen die Löhne aus",
        body: "Sie führen die Zahlung des vorgegebenen Betrages aus. Hierzu übermitteln wir Ihnen die Daten, die Sie in Ihr Online-Banking-System hochladen können.",
      },
      {
        title: "Wir verwalten Ihre Mitarbeitendendaten",
        body: "Wir verwalten Ihre Mitarbeitendendaten. Sie können uns online Mitarbeitendeneintritte sowie -austritte mitteilen.",
      },
      {
        title: "Kommunikation mit den Behörden",
        body: "Wir übermitteln die Daten periodisch an die zuständigen Behörden und übernehmen auch die laufende Kommunikation.",
      },
    ],
    _orbi: { component: "SectionTimeline" },
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
  de: "Externe Lohnbuchhaltung",
  en: "External Payroll Accounting",
}
const keywords = [
  "Externe Lohnbuchhaltung",
  "Lohnbuchhaltung",
  "Lohnabrechnung",
  "Payroll",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "externe-lohnbuchhaltung"

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
