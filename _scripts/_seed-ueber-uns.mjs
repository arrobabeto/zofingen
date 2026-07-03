// Seeds the Zofingen Treuhand "Über uns" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 284:914) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-ueber-uns.mjs
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
const img = (name) => `/img/ueber-uns/${name}`

const sections = [
  {
    title: "Über uns – Zofingen Treuhand AG",
    body: "Die Zofingen Treuhand AG steht für zuverlässige Steuerberatung, Buchhaltung und Finanzplanung. Seit vielen Jahren unterstützen wir kleine und mittelständische Unternehmen dabei, ihre finanziellen Ziele effizient und rechtssicher zu erreichen. Unser Ziel ist es, komplexe Finanzprozesse zu vereinfachen und massgeschneiderte Lösungen zu bieten – von Mensch zu Mensch.",
    image: img("hero-bg.png"),
    align: "left",
    _orbi: { component: "SectionHero" },
  },
  {
    title: "Unsere Werte",
    items: [
      "Verlässlichkeit: Wir setzen auf höchste Präzision und Verlässlichkeit – für eine vertrauensvolle und langfristige Zusammenarbeit.",
      "Innovation: Mit modernen, digitalen Lösungen optimieren wir Ihre Finanzprozesse und sorgen für Effizienz und Transparenz.",
      "Persönliche Betreuung: Bei uns steht der Mensch im Mittelpunkt. Unsere Lösungen sind individuell auf Ihre Anforderungen und Ziele abgestimmt, von Mensch zu Mensch.",
    ],
    image: img("values.png"),
    _orbi: { component: "SectionValues" },
  },
  {
    title: "Unser Team",
    subtitle: "Persönlich, engagiert und immer für Sie da",
    round: true,
    intro:
      "Unser Team besteht aus erfahrenen Experten, die Sie in allen Belangen der Steuer- und Finanzberatung unterstützen. Bei der Zofingen Treuhand AG legen wir besonderen Wert auf eine persönliche und vertrauensvolle Zusammenarbeit, die durch unsere hohe fachliche Kompetenz und unser Engagement gestärkt wird – von Mensch zu Mensch.",
    members: [
      {
        name: "Philippe Bally",
        role: "Dipl. Treuhänder &\nSteuerexperte",
        description:
          "Mit über 20 Jahren Erfahrung in der Steuerberatung führt Philippe unser Team. Seine Expertise liegt in der Erstellung und Optimierung der Steuerstrategien für KMU’s sowie in der Vertretung der Kunden vor Steuerbehörden.",
        image: img("philippe.png"),
      },
      {
        name: "Kateryna Abegglen",
        role: "Treuhänderin mit eidg. FA",
        description:
          "Kateryna ist die Ansprechpartnerin für alle Fragen rund um Buchhaltung, MWST und Steuern. Sie berät Kunden mit fundierter Fachkenntnis und langjähriger Erfahrung und koordiniert das Team im Tagesgeschäft.",
        image: img("kateryna.png"),
      },
      {
        name: "Daniela Nadler",
        role: "Treuhänderin mit eidg. FA",
        description:
          "Daniela ist die Ansprechpartnerin für Jahresabschlüsse, Steuererklärungen und die laufende Mandatsbetreuung. Sie begleitet KMU mit fachlicher Genauigkeit und sorgt für klare Abläufe.",
        image: img("daniela.png"),
      },
      {
        name: "Emre Duman",
        role: "Fachspezialist\nBuchhaltung",
        description:
          "Emre führt Ausbildungskurse unserer Cloud-Software durch und er ist unser Garant für die vollständige und richtige Verbuchung von umfangreichen Kundenbuchhaltungen. Er stellt sicher, dass die Buchhaltungsprozesse reibungslos, effizient und nach höchsten Qualitätsstandards ablaufen.",
        image: img("emre.png"),
      },
      {
        name: "Aengi Kuoni",
        role: "Fachfrau\nSteuern",
        description:
          "Aengi ist die erste Ansprechperson für unsere Steuererklärungskunden. Sie stellt sicher, dass die Steuererklärungen vollständig vorbereitet und sämtliche Fristen eingehalten werden. Ebenfalls unterstützt sie unseren Fachspezialist Buchhaltung bei der korrekten Erfassung der Buchhaltungen.",
        image: img("aengi.png"),
      },
      {
        name: "Andrea Bally",
        role: "Fachfrau\nSozialversicherungen",
        description:
          "Andrea ist Ihre Ansprechpartnerin in allen Fragen rund um Löhne, Sozialversicherungen und Vorsorge und sorgt dafür, dass eine rechtlich korrekte und transparente Abrechnung gewährleistet ist. Dabei unterstützt sie Sie kompetent und zuverlässig bei administrativen Anliegen.",
        image: img("andrea.png"),
      },
    ],
    _orbi: { component: "SectionTeam" },
  },
  {
    image: img("careers.png"),
    title: "Arbeiten bei Zofingen Treuhand",
    body: "Bei der Zofingen Treuhand AG erwartet Sie ein modernes und dynamisches Arbeitsumfeld, das Eigenverantwortung, Kreativität und persönliche Weiterentwicklung fördert. Wir legen grossen Wert auf ein kollegiales Miteinander und eine offene Kommunikation. Unsere Arbeit erfolgt stets von Mensch zu Mensch, was sowohl die Zusammenarbeit im Team als auch die Beziehung zu unseren Kunden prägt. Als wachsendes Unternehmen bieten wir attraktive Karrierechancen und vielfältige Entwicklungsmöglichkeiten in den Bereichen Steuerberatung, Buchhaltung und Unternehmensberatung.",
    benefitsTitle: "Unsere Vorteile für Mitarbeiter:",
    benefits: [
      "Vielfältiger Aufgabenmix mit persönlichem und fachlichem Entwicklungspotenzial",
      "Ein modern eingerichteter Arbeitsplatz im Herzen der Altstadt von Zofingen und die Möglichkeit im Homeoffice zu arbeiten",
      "Attraktive Anstellungsbedingungen mit 27 Tagen Ferien und eine zeitgemässe Entlöhnung",
    ],
    _orbi: { component: "SectionCareers" },
  },
  {
    title: "Offene Stellen bei Zofingen Treuhand AG",
    body: "Aktuell haben wir keine offenen Stellen zu besetzen.",
    divider: false,
    _orbi: { component: "SectionCentered" },
  },
]

const title = {
  de: "Über uns",
  en: "About us",
}
const keywords = [
  "Über uns",
  "Zofingen Treuhand",
  "Team",
  "Werte",
  "Karriere",
  "Aargau",
  "Zofingen",
  "Treuhand",
]

const slug = "ueber-uns"

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
