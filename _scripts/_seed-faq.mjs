// Seeds the Zofingen Treuhand "FAQ" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 532:1100) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-faq.mjs
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
const img = (name) => `/img/faq/${name}`

const sections = [
  {
    title: "FAQ",
    image: img("hero-bg.png"),
    _orbi: { component: "SectionPageHero" },
  },
  {
    title: "Lohnbuchhaltung für KMU",
    items: [
      {
        question: "Was kostet die Lohnbuchhaltung pro Mitarbeiter?",
        answer:
          "Die Kosten für die Lohnbuchhaltung pro Mitarbeiter variieren je nach Dienstleister und dem Umfang der erbrachten Leistungen. Bei der Zofingen Treuhand AG bieten wir beispielsweise eine Monatspauschale von CHF 29 für monatliche Fixlöhne und CHF 39 für Stundenlöhne inklusive Quellensteuerberechnung an. Diese Preise dienen als Orientierungshilfe und können sich je nach spezifischen Anforderungen und Dienstleistungen ändern.",
      },
      {
        question: "Kann man die Lohnbuchhaltung selber machen?",
        answer:
          "Grundsätzlich können Sie die Lohnbuchhaltung selbst führen. Sie erfordert jedoch fundiertes Wissen über Sozialversicherungen, Quellensteuer und laufende gesetzliche Änderungen. Viele KMU lagern diese Aufgabe aus, um Fehler zu vermeiden und Zeit zu sparen.",
      },
      {
        question:
          "Was ist der Unterschied zwischen Buchhaltung und Lohnbuchhaltung?",
        answer:
          "Die Buchhaltung erfasst sämtliche Geschäftsvorfälle eines Unternehmens, während sich die Lohnbuchhaltung ausschliesslich auf die Abrechnung der Löhne, Sozialversicherungsbeiträge und Quellensteuern der Mitarbeitenden konzentriert.",
      },
      {
        question: "Wie kann ich prüfen ob meine Lohnabrechnung korrekt ist?",
        answer:
          "Prüfen Sie, ob Bruttolohn, Abzüge für Sozialversicherungen (AHV/IV/EO, ALV, BVG) und allfällige Quellensteuern korrekt ausgewiesen sind. Der Nettolohn muss dem ausbezahlten Betrag entsprechen. Bei Unsicherheiten unterstützen wir Sie gerne bei der Kontrolle.",
      },
      {
        question: "Wer haftet für Fehler in der Lohnbuchhaltung?",
        answer:
          "Die Verantwortung liegt grundsätzlich beim Arbeitgeber. Wird die Lohnbuchhaltung an einen Treuhänder ausgelagert, haftet dieser im Rahmen des Mandatsvertrags für die korrekte fachliche Ausführung.",
      },
      {
        question: "Welche Aufgaben hat ein Lohnbuchhalter?",
        answer:
          "Ein Lohnbuchhalter erstellt Lohnabrechnungen, berechnet Sozialversicherungsbeiträge und Quellensteuern, meldet Ein- und Austritte, erstellt Lohnausweise und übernimmt die Kommunikation mit Ausgleichskassen und Versicherungen.",
      },
      {
        question: "Auf welches Konto werden Löhne gebucht?",
        answer:
          "Löhne werden in der Regel auf das Aufwandskonto «Lohnaufwand» (z. B. Konto 5000) gebucht. Die Gegenbuchung erfolgt über das Konto «Bank» sowie über Verbindlichkeitskonten für Sozialversicherungen und Quellensteuern.",
      },
      {
        question: "Woher weiß ich was Soll und was Haben ist?",
        answer:
          "Im doppelten Buchhaltungssystem steht «Soll» links und «Haben» rechts. Aufwände und Aktivzunahmen werden im Soll gebucht, Erträge und Passivzunahmen im Haben. Jede Buchung hat immer eine Soll- und eine Haben-Seite in gleicher Höhe.",
      },
    ],
    _orbi: { component: "SectionFaq" },
  },
]

const title = {
  de: "FAQ",
  en: "FAQ",
}
const keywords = [
  "FAQ",
  "Häufige Fragen",
  "Lohnbuchhaltung",
  "KMU",
  "Zofingen Treuhand",
  "Treuhand",
  "Buchhaltung",
]

const slug = "faq"

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
