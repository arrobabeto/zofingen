// DEPRECATED: Replaced by _import-posts-from-wordpress.mjs (WordPress → Orbitype).
// Seeds the demo Artikel detail post (Figma node 522:1752) into the Orbitype `posts` table.
// Usage: node _scripts/_seed-post-mitarbeiterbeteiligung.mjs
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
const img = (name) => `/img/artikel/${name}`

const DE_TITLE = "Mitarbeiterbeteiligung und ihre steuerlichen Aspekte"

const contentDe = `
<p>Mitarbeiterbeteiligung gewinnt zunehmend an Bedeutung, da sie eine effektive Möglichkeit bietet, die Ziele der Unternehmensführung mit denen der Mitarbeiter zu verbinden. Durch gezielte Mitarbeiterbeteiligungsprogramme können nicht nur Motivation und Bindung von Schlüsselmitarbeitern gesteigert werden, sondern auch steuerliche Vorteile realisiert werden.</p>
<p>Die steuerliche Behandlung solcher Programme, wie Aktienoptionen und -pläne, ist jedoch komplex und erfordert ein fundiertes Verständnis der gesetzlichen Rahmenbedingungen. In diesem Artikel beleuchten wir die wichtigsten steuerlichen Aspekte der Mitarbeiterbeteiligung und geben wertvolle Einblicke für Unternehmen und Mitarbeiter.</p>
<h2>Grundlagen der Mitarbeiterbeteiligung</h2>
<p>Die Mitarbeiterbeteiligung umfasst eine Vielzahl von Instrumenten, die es Mitarbeitern ermöglichen, am Erfolg ihres Unternehmens teilzuhaben:</p>
<ul>
<li>Aktienoptionen: Das Recht, Aktien zu einem festen Preis zu erwerben.</li>
<li>Phantomaktien: Beteiligung an der Unternehmenswertsteigerung ohne Aktienbesitz.</li>
<li>Aktienkaufpläne: Erwerb von Aktien zu vergünstigten Konditionen.</li>
<li>Gewinnbeteiligungen: Direkte Teilhabe am finanziellen Erfolg des Unternehmens.</li>
</ul>
<p>Mit der richtigen steuerlichen Planung wird die Mitarbeiterbeteiligung zu einem effektiven Mittel, um Mitarbeiter langfristig an das Unternehmen zu binden.</p>
<h2>Steuerliche Behandlung von Aktienoptionen</h2>
<p>Aktienoptionen geben dem Mitarbeiter das Recht, Aktien des Unternehmens zu einem vorher festgelegten Preis zu erwerben. Die steuerliche Behandlung dieser Optionen hängt von verschiedenen Faktoren ab, einschließlich des Zeitpunkts der Ausübung und des Verkaufs der Aktien.</p>
<h2>Phantomaktien und Aktienkaufpläne</h2>
<p>Phantomaktien sind eine Alternative zu echten Aktien und bieten Mitarbeitern die Möglichkeit, an der Wertsteigerung des Unternehmens teilzuhaben, ohne tatsächliche Anteile zu halten. Aktienkaufpläne ermöglichen es Mitarbeitern, Aktien ihres Unternehmens oft zu einem ermässigten Preis zu erwerben.</p>
<h2>Besteuerung und Reporting in der Mitarbeiterbeteiligung</h2>
<p>Die korrekte steuerliche Erfassung und Berichterstattung von Mitarbeiterbeteiligungsprogrammen ist entscheidend, um steuerliche Nachteile zu vermeiden. Unternehmen müssen sicherstellen, dass alle notwendigen Informationen korrekt an die Steuerbehörden übermittelt werden.</p>
<h2>Strategische Überlegungen bei der Mitarbeiterbeteiligung</h2>
<p>Bei der Implementierung von Mitarbeiterbeteiligungsprogrammen sollten Unternehmen die steuerlichen Auswirkungen sowohl für sich selbst als auch für ihre Mitarbeiter berücksichtigen. Eine sorgfältige Planung und Beratung mit Steuerexperten kann dabei helfen, steuerliche Vorteile zu maximieren.</p>
<h2>Unsere Unterstützung bei der steuerlichen Optimierung</h2>
<p>Die steuerlichen Regelungen zu Mitarbeiterbeteiligungsprogrammen sind ein zentraler Punkt bei der Planung solcher Initiativen. Damit Sie sich nicht selbst mit diesen komplexen Vorgaben auseinandersetzen müssen, steht Ihnen die Zofingen Treuhand AG zur Seite.</p>
<p><a href="/kontakt">Kontaktieren Sie uns</a> noch heute für eine individuelle Beratung und profitieren Sie von unserer Expertise in steuerlichen Fragen rund um Mitarbeiterbeteiligung.</p>
`.trim()

const contentEn = `
<p>Employee participation is gaining importance as an effective way to align company leadership goals with those of employees. Through targeted employee participation programs, companies can increase motivation and retention of key staff while realizing tax advantages.</p>
<p>However, the tax treatment of such programs, such as stock options and plans, is complex and requires a solid understanding of the legal framework. This article highlights the most important tax aspects of employee participation.</p>
<h2>Basics of employee participation</h2>
<p>Employee participation encompasses a variety of instruments that allow employees to share in the success of their company:</p>
<ul>
<li>Stock options: The right to acquire shares at a fixed price.</li>
<li>Phantom shares: Participation in company value growth without share ownership.</li>
<li>Share purchase plans: Acquisition of shares at preferential terms.</li>
<li>Profit sharing: Direct participation in the company's financial success.</li>
</ul>
<h2>Tax treatment of stock options</h2>
<p>Stock options give employees the right to acquire company shares at a predetermined price. Tax treatment depends on various factors, including the timing of exercise and sale.</p>
<h2>Phantom shares and share purchase plans</h2>
<p>Phantom shares offer an alternative to real shares. Share purchase plans allow employees to acquire company shares at discounted prices.</p>
<h2>Taxation and reporting</h2>
<p>Correct tax recording and reporting of employee participation programs is essential to avoid tax disadvantages.</p>
<h2>Strategic considerations</h2>
<p>When implementing employee participation programs, companies should consider tax implications for both the company and employees.</p>
<h2>Our support for tax optimization</h2>
<p>Zofingen Treuhand AG supports you in designing and optimizing employee participation programs. <a href="/kontakt">Contact us</a> today for individual advice.</p>
`.trim()

const title = {
  de: DE_TITLE,
  en: "Employee participation and its tax aspects",
}

const lead = {
  de: "<p>Mitarbeiterbeteiligung gewinnt zunehmend an Bedeutung, da sie eine effektive Möglichkeit bietet, die Ziele der Unternehmensführung mit denen der Mitarbeiter zu verbinden.</p>",
  en: "<p>Employee participation is gaining importance as an effective way to align leadership goals with those of employees.</p>",
}

const sections = [
  {
    title: { de: "Inhalt", en: "Content" },
    content: { de: contentDe, en: contentEn },
    _orbi: { component: "SectionArtikelContent" },
  },
]

const keywords = [
  "Mitarbeiterbeteiligung",
  "Steuern",
  "Aktienoptionen",
  "Treuhand",
  "Zofingen",
]

const status = {
  options: ["draft", "review", "published"],
  value: "published",
}

async function sql(query, bindings) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "X-API-KEY": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: query, bindings }),
  })
  const text = await res.text()
  console.log("status:", res.status, "->", text)
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = null
  }
  return { res, parsed }
}

async function run() {
  await sql("DELETE FROM posts WHERE title->>'de' = :deTitle", {
    deTitle: DE_TITLE,
  })

  const { parsed } = await sql(
    `INSERT INTO posts (title, lead, img, sections, keywords, status, created_at, updated_at)
     VALUES (:title::json, :lead::json, :img, :sections::json, :keywords::json, :status::json, :created_at::timestamptz, :updated_at::timestamptz)
     RETURNING id, title`,
    {
      title: JSON.stringify(title),
      lead: JSON.stringify(lead),
      img: img("featured.png"),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      status: JSON.stringify(status),
      created_at: "2024-10-16T12:00:00Z",
      updated_at: "2024-10-16T12:00:00Z",
    },
  )

  const row = Array.isArray(parsed) ? parsed[0] : parsed
  if (row?.id) {
    console.log("Post id:", row.id)
    console.log("URL: /posts/" + row.id + "/mitarbeiterbeteiligung-und-ihre-steuerlichen-aspekte")
  }
}

run()
