// Seeds the Zofingen Treuhand "Firmengründung" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 89:2) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-firmengruendung.mjs
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
const img = (name) => `/img/firmengruendung/${name}`
const CTA = "Jetzt Kontakt aufnehmen"
const CTA_HREF = "/kontakt"

const sections = [
  {
    title: "Firmengründung",
    subtitle:
      "Professionelle Unterstützung für den erfolgreichen Start Ihres Unternehmens",
    body: "Von der Wahl der Rechtsform bis zur Handelsregistereintragung – Wir begleiten Sie auf dem Weg in die Selbständigkeit.",
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    image: img("hero-bg.png"),
    _orbi: { component: "SectionHero" },
  },
  {
    title: "Der Schritt in die\nberufliche Selbständigkeit",
    body: "Die Firmengründung ist ein wichtiger Schritt in die berufliche Selbständigkeit und erfordert fundierte Kenntnisse sowie eine klare Strategie. Zofingen Treuhand AG ist Ihr verlässlicher Partner, der Sie von Anfang an bei allen Prozessen unterstützt.\n\nUnser umfassendes Pauschalangebot für die Firmengründung beinhaltet alles, was Sie für einen erfolgreichen Start benötigen. Vertrauen Sie auf unsere langjährige Erfahrung und machen Sie sich die professionelle Expertise von Zofingen Treuhand zu Nutze.",
    image: img("step-image.png"),
    _orbi: { component: "SectionTextMedia" },
  },
  {
    title: "Pauschalangebote",
    intro:
      "Die Gründung eines eigenen Unternehmens kann eine komplexe und verwirrende Aufgabe sein. Von der Auswahl der Rechtsform bis zur Formulierung des Firmenzwecks gibt es viele Entscheidungen zu treffen. Ohne die richtige Unterstützung besteht die Gefahr, wichtige Schritte zu übersehen oder rechtliche Probleme zu verursachen.",
    plans: [
      {
        name: "Standard",
        currency: "CHF",
        price: "790",
        ctaLabel: CTA,
        ctaHref: CTA_HREF,
        features: [
          "Beratung 30 Min.",
          "Unterstützung Wahl Rechtsform",
          "Prüfung Firmennamen",
          "Formulierung Firmenzweck",
          "Erstellen der Gründungsdokumente *",
          "Anmeldung beim Handelsregisteramt",
          "Zusätzlich fallen Handelsregistergebühren zwischen CHF 700 und CHF 900 an.",
        ],
        footnoteTitle: "* Erstellen der Gründungsdokumente",
        footnoteItems: [
          "Statuten",
          "Gründungsurkunde",
          "Lex Friedrich-Erklärung (Lex Koller)",
          "Erklärung Opting Out (Verzicht Revisionsstelle)",
          "Erstellen Anteilbuch",
        ],
      },
      {
        name: "Premium",
        currency: "CHF",
        price: "990",
        featured: true,
        badge: "BELIEBT",
        ctaLabel: CTA,
        ctaHref: CTA_HREF,
        features: [
          "Beratung 60 Min.",
          "Unterstützung Wahl Rechtsform",
          "Prüfung Firmennamen",
          "Formulierung Firmenzweck",
          "Erstellen der Gründungsdokumente *",
          "Anmeldung beim Handelsregisteramt",
          "Anmeldung bei der MwSt",
          "Anmeldung bei der AHV-Ausgleichskasse",
          "Bestellungen Offerten für Personal- und Sachversicherungen (z. B. BVG, UVG, Krankentaggeld, Haftpflicht etc.)",
          "Einrichten Buchhaltung",
          "Berechnung Sozialversicherungsbeiträge und Einrichten Lohnbuchhaltung",
          "Zusätzlich fallen Handelsregistergebühren zwischen CHF 700 und CHF 900 an.",
        ],
      },
    ],
    _orbi: { component: "SectionPricing" },
  },
  {
    body: "Unsere Pauschalangebote für die Firmengründung bieten Ihnen eine umfassende Unterstützung auf dem Weg in die Selbstständigkeit.\n\nEgal, ob Sie das Standard- oder Premium-Paket wählen, wir begleiten Sie bei der Wahl der Rechtsform, der Prüfung des Firmennamens, der Formulierung des Firmenzwecks und beim Erstellen aller erforderlichen Gründungsdokumente.\n\nDarüber hinaus übernehmen wir für Sie die Anmeldung beim Handelsregisteramt und bieten zusätzliche Leistungen wie die Anmeldung bei der MwSt und der AHV-Ausgleichskasse oder das Einholen und Prüfen von Offerten für den Abschluss der notwendigen Personenversicherungen.",
    image: img("packages-image.png"),
    reverse: true,
    ctaLabel: CTA,
    ctaHref: CTA_HREF,
    _orbi: { component: "SectionTextMedia" },
  },
  {
    wide: true,
    cards: [
      {
        title: "Expertise",
        body: "Unsere erfahrenen Experten haben umfangreiche Kenntnisse und Erfahrung in der Firmengründung. Um Ihre Ziele und Bedürfnisse bestmöglich zu berücksichtigen, bauen wir auf individuelle und auf Ihr Unternehmen abgestimmte Beratung.",
      },
      {
        title: "Ganzheitlicher Service",
        body: "Neben der Firmengründung bieten wir Ihnen auch Unterstützung bei der Einrichtung der Buchhaltung, der Anmeldung bei Versicherungen und der Berechnung von Sozialversicherungsbeiträgen. Dadurch sind Sie bestens gerüstet, um erfolgreich in die Selbständigkeit zu starten.",
      },
      {
        title: "Pauschal-angebote",
        body: "Unsere Pauschalangebote bieten Ihnen Transparenz und Kostensicherheit. Sie wissen von Anfang an, welche Leistungen Sie erhalten und welche Gebühren anfallen.",
      },
      {
        title: "Zeitersparnis",
        body: "Mit unserer Unterstützung können Sie Zeit und Energie sparen. Wir kümmern uns um alle administrativen Aufgaben, sodass Sie sich auf Ihr Kerngeschäft konzentrieren können.",
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
  de: "Firmengründung",
  en: "Company Formation",
}
const keywords = [
  "Firmengründung",
  "Unternehmensgründung",
  "Rechtsform",
  "Handelsregister",
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
  await sql("DELETE FROM pages WHERE slug = :slug", { slug: "firmengruendung" })
  await sql(
    "INSERT INTO pages (title, slug, sections, keywords) VALUES (:title::json, :slug, :sections::json, :keywords::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      slug: "firmengruendung",
    },
  )
}

run()
