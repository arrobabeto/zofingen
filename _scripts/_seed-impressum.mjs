// Seeds the Zofingen Treuhand "Impressum" page into the Orbitype `pages` table.
// Usage: node _scripts/_seed-impressum.mjs
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
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

const contentHtml = `
<h2>Verantwortlich für diese Website</h2>
<p><strong>Zofingen Treuhand AG</strong><br />Kirchplatz 4<br />4800 Zofingen<br />Schweiz</p>
<p>Telefon: <a href="tel:+41627457030">062 745 70 30</a><br />E-Mail: <a href="mailto:kontakt@zofingen-treuhand.ch">kontakt@zofingen-treuhand.ch</a></p>
<p>Vertretungsberechtigte Person: Philippe Bally, Inhaber und Geschäftsführer</p>
<p>UID-Nummer: CHE-434.979.980<br />Eingetragen im Handelsregister des Kantons Aargau</p>

<h2>Mitgliedschaften</h2>
<p>Mitglied von TREUHAND|SUISSE, Schweizerischer Treuhänderverband<br />Anerkannter Lehrbetrieb</p>

<h2>Haftung für Inhalte</h2>
<p>Wir erstellen die Inhalte dieser Website mit grösstmöglicher Sorgfalt und bemühen uns, sie aktuell und vollständig zu halten. Für die Richtigkeit, Vollständigkeit und Aktualität der Informationen können wir jedoch keine Gewähr übernehmen. Die Inhalte stellen keine verbindliche Beratung dar. Für eine verbindliche Auskunft zu Ihrer konkreten Situation kontaktieren Sie uns bitte direkt.</p>
<p>Haftungsansprüche wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff auf diese Website oder aus deren Nutzung entstehen, sind ausgeschlossen, soweit kein Vorsatz oder keine grobe Fahrlässigkeit vorliegt.</p>

<h2>Haftung für Links</h2>
<p>Diese Website enthält Verweise auf Websites Dritter. Für deren Inhalte sind ausschliesslich die jeweiligen Anbieter verantwortlich. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Werden uns Rechtsverletzungen bekannt, entfernen wir die entsprechenden Links umgehend.</p>

<h2>Urheberrecht</h2>
<p>Die auf dieser Website veröffentlichten Inhalte, Texte, Bilder und Grafiken unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung oder jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedarf der schriftlichen Zustimmung der Zofingen Treuhand AG. Downloads und Kopien dieser Website sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Inhalte Dritter sind als solche gekennzeichnet.</p>

<h2>Datenschutz</h2>
<p>Informationen zur Bearbeitung von Personendaten finden Sie in unserer <a href="/datenschutz">Datenschutzerklärung</a>.</p>

<h2>Realisierung</h2>
<p>Bexolutions Marketing und Vertrieb AG, Hunzenschwil</p>
`.trim()

const sections = [
  {
    title: "Impressum",
    image: HERO_IMAGE,
    _orbi: { component: "SectionPageHero" },
  },
  {
    content: {
      de: contentHtml,
      en: contentHtml,
    },
    _orbi: { component: "SectionLegalContent" },
  },
]

const title = {
  de: "Impressum",
  en: "Impressum",
}
const lead = {
  de: "Impressum der Zofingen Treuhand AG – Verantwortlicher, Haftung, Urheberrecht und Kontakt.",
  en: "Impressum der Zofingen Treuhand AG – Verantwortlicher, Haftung, Urheberrecht und Kontakt.",
}
const keywords = [
  "Impressum",
  "Zofingen Treuhand",
  "Kontakt",
  "Haftung",
  "Urheberrecht",
  "Handelsregister",
]

const slug = "impressum"

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
    "INSERT INTO pages (title, slug, sections, keywords, lead) VALUES (:title::json, :slug, :sections::json, :keywords::json, :lead::json) RETURNING id, slug",
    {
      title: JSON.stringify(title),
      sections: JSON.stringify(sections),
      keywords: JSON.stringify(keywords),
      lead: JSON.stringify(lead),
      slug,
    },
  )
}

run()
