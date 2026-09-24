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
<h2>Website-Betreiber</h2>
<p><strong>Bexolutions Marketing und Vertrieb AG</strong><br />Fabrikweg 1a<br />5502 Hunzenschwil<br />Schweiz<br />E-Mail: <a href="mailto:info@bexolutions.ch">info@bexolutions.ch</a><br />Tel.: <a href="tel:+41783313777">078 331 37 77</a></p>

<h2>Inhaltlich Verantwortlicher gemäß § 5 TMG</h2>
<p><strong>Zofingen Treuhand AG</strong><br />Kirchplatz 4<br />4800 Zofingen</p>

<h2>Kontakt</h2>
<p>Telefon: <a href="tel:+41627457030">062 745 70 30</a><br />E-Mail: <a href="mailto:kontakt@zofingen-treuhand.ch">kontakt@zofingen-treuhand.ch</a></p>

<h2>Haftung für Inhalte</h2>
<p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

<h2>Urheberrecht</h2>
<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
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
  de: "Impressum der Zofingen Treuhand AG – Website-Betreiber, Verantwortlicher und Kontakt.",
  en: "Impressum der Zofingen Treuhand AG – Website-Betreiber, Verantwortlicher und Kontakt.",
}
const keywords = [
  "Impressum",
  "Zofingen Treuhand",
  "Kontakt",
  "Haftung",
  "Urheberrecht",
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
