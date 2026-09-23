// Seeds the Zofingen Treuhand "AGB" page into the Orbitype `pages` table.
// Usage: node _scripts/_seed-agb.mjs
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
<h2>Geltungsbereich</h2>
<p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die zwischen der Zofingen Treuhand AG («Wir») und unseren Kunden («Sie») abgeschlossen werden.</p>

<h2>Dienstleistungen</h2>
<p>Zofingen Treuhand AG bietet eine Reihe von Dienstleistungen an:</p>
<ul>
  <li>Firmengründungen</li>
  <li>Jahresabschluss und Steueroptimierungen</li>
  <li>PayRoll Service und Personaladministration</li>
  <li>Steuerberatung und -planung</li>
  <li>Internationales Steuerrecht</li>
  <li>Steuererklärungen und Sondersteuern</li>
  <li>Beratung zu Pensions- und Vorsorgeplanung</li>
  <li>Immobilienverwaltungen</li>
</ul>
<p>Es handelt sich um eine beispielhafte, nicht abschliessende Aufzählung. Details zu unseren Dienstleistungen finden Sie auf unserer Website.</p>

<h2>Vertragsabschluss</h2>
<p>Ein Vertrag zwischen Ihnen und uns kommt zustande, wenn Sie uns schriftlich, per E-Mail oder telefonisch einen Auftrag erteilen und wir diesen Auftrag annehmen.</p>

<h2>Preise und Zahlungsbedingungen</h2>
<p>Die Preise für unsere Dienstleistungen richten sich nach dem jeweiligen Angebot oder der jeweiligen Vereinbarung. Sofern nichts anderes vereinbart ist, sind alle Rechnungen innerhalb von 30 Tagen nach Rechnungsdatum ohne Abzug zur Zahlung fällig.</p>

<h2>Vertraulichkeit und Datenschutz</h2>
<p>Wir verpflichten uns zur strikten Einhaltung aller geltenden Datenschutzbestimmungen und zur Wahrung der Vertraulichkeit Ihrer Daten. Details zu unseren Datenschutzpraktiken finden Sie in unserer <a href="/datenschutz">Datenschutzerklärung</a>.</p>

<h2>Haftung</h2>
<p>Wir haften für Schäden nur, soweit uns Vorsatz oder grobe Fahrlässigkeit zur Last fällt. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.</p>

<h2>Schlussbestimmungen</h2>
<p>Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, so wird dadurch die Gültigkeit der übrigen Bestimmungen nicht berührt.</p>
<p>Für diese AGB und alle Verträge, die unter ihrer Geltung abgeschlossen werden, gilt ausschliesslich das Recht der Schweiz.</p>
`.trim()

const sections = [
  {
    title: "AGB's",
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
  de: "AGB's",
  en: "AGB's",
}
const lead = {
  de: "Allgemeine Geschäftsbedingungen der Zofingen Treuhand AG.",
  en: "Allgemeine Geschäftsbedingungen der Zofingen Treuhand AG.",
}
const keywords = [
  "AGB",
  "Allgemeine Geschäftsbedingungen",
  "Zofingen Treuhand",
  "Vertrag",
  "Haftung",
]

const slug = "agb"

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
