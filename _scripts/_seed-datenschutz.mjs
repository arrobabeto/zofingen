// Seeds the Zofingen Treuhand "Datenschutz" page into the Orbitype `pages` table.
// Usage: node _scripts/_seed-datenschutz.mjs
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
<p>Datenschutz ist Vertrauenssache und Ihr Vertrauen ist uns wichtig. Obwohl wir den Umgang mit unseren Personendaten nicht geändert haben, veröffentlichen wir auf unserer Website aufgrund des Inkrafttretens des revidierten Datenschutzgesetzes per 1. September 2023 nicht nur eine Datenschutzerklärung für unsere Websitebesucher, sondern auch für unsere Kunden und Mitarbeitenden.</p>
<p>Es ist uns ein Anliegen, dass Sie über die Bearbeitung Ihrer Personendaten umfassend informiert sind. Es ist uns wichtig, dass Sie verstehen:</p>
<ul>
  <li>welche Personendaten wir über Sie bearbeiten;</li>
  <li>zu welchem Zweck wir Ihre Personendaten verwenden;</li>
  <li>wer Zugang zu Ihren Personendaten hat;</li>
  <li>wie lange wir Ihre Personendaten aufbewahren;</li>
  <li>was mit Ihren Personendaten nach Ablauf unserer Geschäftsbeziehung resp. nach der gesetzlichen Aufbewahrungsfrist geschieht.</li>
</ul>
<p>Diese Datenschutzerklärung gilt für alle unsere Dienstleistungen und Aktivitäten, soweit wir Ihnen dafür nicht eigene Datenschutzerklärungen zur Verfügung stellen.</p>

<h2>2 Wer ist für die Bearbeitung Ihrer Daten verantwortlich?</h2>
<p>Für die Datenbearbeitungen nach dieser Datenschutzerklärung ist ein bestimmtes Unternehmen datenschutzrechtlich verantwortlich. Das heisst, dieses Unternehmen legt fest, wie die Bearbeitung erfolgt, zu welchem Zweck sie erfolgt und welche Grundsätze dafür gelten sollen. Für die Datenbearbeitung nach dieser Datenschutzerklärung ist grundsätzlich das folgende Unternehmen verantwortlich:</p>
<p><strong>Zofingen Treuhand AG</strong><br />Kirchplatz 4<br />4800 Zofingen</p>
<p>Für datenschutzrechtliche Anfragen können Sie uns wie folgt erreichen:</p>
<p>Herr Philippe Bally, Geschäftsführer<br /><a href="mailto:kontakt@zofingen-treuhand.ch">kontakt@zofingen-treuhand.ch</a><br />Tel.: <a href="tel:+41627457030">062 745 70 30</a></p>

<h2>3 Was sind «Personendaten» und was heisst «Bearbeitung»</h2>
<p>Mit «Personendaten» sind Daten gemeint, die sich auf eine bestimmte oder bestimmbare Person beziehen, d.h. die Rückschlüsse auf deren Identität zulassen.</p>
<p>«Besonders schützenswerte Personendaten» sind Kategorien von Personendaten, die besonders heikel sind, weshalb deren Bearbeitung besonderen Anforderungen unterstehen kann. Als besonders schützenswerte Personendaten gelten z.B. Daten, die über die Religion oder politische Einstellung Aufschluss geben, Gesundheitsdaten und Daten über strafrechtliche oder verwaltungsrechtliche Sanktionen sowie über die soziale Hilfe.</p>
<p>In Ziff. 5 finden Sie Angaben zu den Daten, die wir im Rahmen dieser Datenschutzerklärung bearbeiten.</p>
<p>Mit «Bearbeiten» ist jeder Umgang mit Personendaten gemeint, insbesondere das Beschaffen, Speichern, Verwenden, Bekanntgeben und Löschen.</p>

<h2>4 Wer ist von einer Datenbearbeitung durch uns betroffen?</h2>
<p>Unsere Datenbearbeitungen können insbesondere die folgenden Personen («betroffene Personen») betreffen:</p>
<ul>
  <li>Personen, die eine Dienstleistung von uns in Anspruch nehmen;</li>
  <li>Drittpersonen (wie Familienmitglieder bei Steuererklärung, Lieferanten der Kunden bei FiBu etc.), die mit denjenigen Personen, welche eine Dienstleistung von uns in Anspruch nehmen, rechtlich verbunden sind;</li>
  <li>Kontaktpersonen unserer Geschäftspartner;</li>
  <li>Mitarbeitende.</li>
</ul>

<h2>5 Welche Daten bearbeiten wir über Sie zu welchem Zweck?</h2>
<p>Welche Daten wir über Sie bearbeiten, hängt von Ihrer Beziehung zu uns ab. Je nach Anlass und Zweck bearbeiten wir unterschiedliche Daten aus unterschiedlichen Quellen. Wir erheben diese Daten in erster Linie direkt von Ihnen, z.B. wenn Sie uns einen Auftrag für unsere Dienstleistungen erteilen oder wenn Sie mit uns kommunizieren.</p>
<p>Wir bearbeiten Personendaten ausschliesslich zur Vertragserfüllung und halten dabei die gesetzlichen Anforderungen ein.</p>
<p>Wir bearbeiten vor allem die im folgenden beschriebenen Kategorien von Daten, wobei diese Aufzählung nicht abschliessend ist. Wenn sich Daten im Lauf der Zeit ändern (z.B. bei einer Adressänderung oder einer anderen Mutation), können wir neben dem aktuellen auch den früheren Stand aufbewahren.</p>

<h3>a) Stammdaten</h3>
<p>Als Stammdaten bezeichnen wir die Grunddaten, die wir nebst den Vertragsdaten (Name, Adresse, E-Mail-Adresse, Telefonnummer) für die Abwicklung unserer vertraglichen und sonstigen geschäftlichen Beziehungen oder gegebenenfalls für Marketing und Werbezwecke benötigen (Einladung zu Anlässen, Newsletter etc.).</p>
<p>Bei Kunden und weiteren Vertragspartnern, die Unternehmen sind, bearbeiten wir Daten über unsere Kontaktpersonen, z.B. Name und Adresse, Angaben zu Titeln, zur Funktion im Unternehmen, Qualifikationen und ggf. Angaben über Vorgesetzte und Mitarbeitende.</p>

<h3>b) Steuerdaten</h3>
<p>Wir erstellen Steuererklärungen für Privatpersonen, Einzelunternehmen und juristische Personen. Die dafür benötigten Informationen erhalten wir ausschliesslich von Ihnen.</p>

<h3>c) Finanzbuchhaltungsdaten</h3>
<p>Unsere Dienstleistungen umfassen auch das Führen der Finanzbuchhaltung. Zu diesem Zweck bearbeiten wir Daten über Ihre Debitoren und Kreditoren, allfällige Angestellte und Organe. Die dafür benötigten Informationen erhalten wir von Ihnen, Ihren Zulieferern und Dienstleistern etc.</p>

<h3>d) Lohnbuchhaltungsdaten</h3>
<p>Wir führen für unsere Kunden auch die Lohnbuchhaltung durch. Zu diesem Zweck bearbeiten wir Daten über die Mitarbeiter, die auch Daten betreffen können, die Auskunft über sozialversicherungsrechtliche Vorgänge geben oder allfällige verwaltungsrechtliche Sanktionen oder Massnahmen der sozialen Hilfe beinhalten.</p>
<p>Die Informationen für die Abwicklung der Lohnbuchhaltung Ihrer Mitarbeiter erhalten wir ausschliesslich von Ihnen sowie den zuständigen Behörden.</p>

<h3>e) Lieferanten</h3>
<p>Bei Vertragsabwicklungen mit unseren Lieferanten verfügen wir über Kontaktdaten, wie insbesondere Vor- und Nachnamen sowie Kontaktangaben der Ansprechpersonen, Daten zu Verträgen und Lieferungen, Angaben über die erbrachten und abgerechneten Leistungen, Rechnungsdaten, Leistungsnachweise, Rechnungen, Zahlungen, Zahlungsinformationen, Bankverbindungen.</p>

<h3>f) Mitarbeiterdaten</h3>
<p>Informationen im Zusammenhang mit unseren Mitarbeitenden (inkl. Bewerbungen) bearbeiten wir ausschliesslich für die Erfüllung des Arbeitsverhältnisses. Wir bearbeiten Daten wie Namen, Adresse, Kontaktdaten, Nationalität, Geburtsdatum, AHV-Nummer, Sozialversicherungsangaben, berufliche Qualifikationen, Referenzen, Zivilstand und Angaben zu Familienangehörigen und anderen Dritten (z.B. Notfallkontakt, Kinder für Familienzulagen etc.), Lohndaten, Beschäftigungsgrad, Leistungsnachweise, Zeiterfassung, Finanzinformationen, Bankverbindungen, Mitarbeiterbeurteilungen, Daten über Arbeitszeit und Ferien, Anstellungsdatum, Funktion, Bewerbungsinformationen, Gesundheitsdaten (Krankheiten, Krankentaggelder, Arztzeugnisse, Unfallmeldungen etc.), Zugriffsrechte IT, Abwicklung von Arbeitsverträgen. Bei Bewerbungen bearbeiten wir die Daten für die Klärung der Eignung von offenen Stellen.</p>

<h3>g) Sonstige Daten</h3>
<p>Wir erheben auch Daten von Ihnen in anderen Situationen, die wir in dieser Datenschutzerklärung nicht abschliessend umschreiben können. Im Zusammenhang mit behördlichen oder gerichtlichen Verfahren etwa fallen Daten an (wie z.B. Aktenanforderung von Steuerbehörden).</p>
<p>Die Daten, die wir gemäss dieser Datenschutzerklärung bearbeiten, beziehen sich nicht nur auf unsere Kunden, sondern teilweise auch auf Dritte (Lohnbuchhaltung, Steuererklärungen von Verheirateten und Personen mit Kindern etc.). Wenn Sie uns Daten über Dritte übermitteln, gehen wir davon aus, dass Sie dazu befugt und dass diese Daten richtig sind und dass Sie die entsprechenden Personen darüber informiert haben. Mit der Übermittlung von Daten über Dritte bestätigen Sie dies.</p>

<h2>6 Wem werden Ihre Daten bekanntgegeben?</h2>
<p>Unsere Mitarbeiter haben Zugriff auf Ihre Personendaten, handeln nach Weisung und sind im Umgang mit Ihren Personendaten zur Vertraulichkeit und Verschwiegenheit verpflichtet.</p>
<p>Im Weiteren können folgende Institutionen Kenntnis von Ihren Daten erlangen:</p>
<h3>Behörden</h3>
<p>Wo zur Auftragserfüllung nötig, werden Daten an Behörden weitergegeben.</p>
<h3>Dienstleister</h3>
<p>Wir arbeiten vorwiegend mit Dienstleistern im Inland zusammen, um unsere Dienstleistungen erbringen zu können. Diese Dienstleistungen betreffen z.B. IT-Dienstleistungen und Marketingdienstleistungen.</p>
<p>Wir geben Dienstleistern jeweils die für ihre Leistungen erforderlichen Daten bekannt und stellen durch unsere vertraglichen Vereinbarungen sowie geeignete Instruktionen sicher, dass der Datenschutz während der gesamten Bearbeitungszeit auch durch die Dienstleister eingehalten wird.</p>

<h2>7 Werden Ihre Daten ins Ausland bekanntgegeben?</h2>
<p>Wie in Ziff. 6 erläutert, bearbeiten nicht nur wir Ihre Personendaten, sondern gegebenenfalls auch unsere Dienstleister, die sich jedoch grundsätzlich in der Schweiz befinden.</p>
<p>Aufgrund der Verwendung neuster Technologien (z.B. Cloudlösung), kann nicht ausgeschlossen werden, dass Ihre Daten ins Ausland, und auch ausserhalb der EU bzw. des EWR gelangen.</p>
<p>Die entsprechenden Länder verfügen möglicherweise nicht über Gesetze, die Ihre Personendaten im gleichen Umfang schützen wie in der Schweiz oder in der EU bzw. dem EWR-Raum (z.B. USA). Wir treffen deshalb vertragliche Vorkehrungen (oder verpflichten unsere Dienstleister diese zu treffen), um den schwächeren gesetzlichen Schutz vertraglich auszugleichen. Dazu verwenden wir i.d.R. die von der Europäischen Kommission und dem schweizerischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) ausgestellten oder anerkannten Standardvertragsklauseln (weitere Angaben dazu und eine Kopie dieser Klauseln finden Sie unter <a href="https://commission.europa.eu/publications/standard-contractual-clauses-controllers-and-processors-eueea_en" target="_blank" rel="noopener noreferrer">Standard contractual clauses for controllers and processors in the EU/EEA</a>).</p>

<h2>8 Wie lange werden Ihre Daten gespeichert?</h2>
<p>Die gesetzliche Aufbewahrungspflicht für unsere Unterlagen beträgt grundsätzlich zehn Jahre. In gewissen gesetzlich vorgeschriebenen Fällen auch länger (z.B. Steuerunterlagen, Dokumente im Zusammenhang mit Grundstücken).</p>

<h2>9 Welche Rechte haben Sie?</h2>
<p>Im Zusammenhang mit unserer Datenbearbeitung haben Sie das Recht:</p>
<ul>
  <li>Auskunft zu verlangen, ob und welche Daten wir von Ihnen bearbeiten;</li>
  <li>Korrekturen zu verlangen, wenn Daten unrichtig sind;</li>
  <li>Widerspruch zu erheben und die Einschränkung oder Löschung von Daten zu verlangen, sofern wir nicht zur weiteren Bearbeitung verpflichtet oder berechtigt sind;</li>
  <li>die Herausgabe bestimmter Personendaten in einem gängigen elektronischen Format oder die Übertragung an einen anderen Verantwortlichen zu verlangen;</li>
  <li>die Einwilligung zu widerrufen, soweit unsere Bearbeitung auf Ihrer Einwilligung beruht.</li>
</ul>
<p>Beachten Sie bitte, dass für die Ausübung dieser Rechte bestimmte Voraussetzungen erfüllt sein müssen und dass Ausnahmen oder Einschränkungen gelten können (z.B. zum Schutz von Dritten oder von Geschäftsgeheimnissen). Wir werden Sie ggf. entsprechend informieren.</p>
<p>Wenn Sie uns gegenüber Rechte ausüben wollen, wenden Sie sich bitte schriftlich an uns (vgl. Ziff. 2).</p>

<h2>10 Kann diese Datenschutzerklärung geändert werden?</h2>
<p>Diese Datenschutzerklärung kann jederzeit angepasst werden. Wir würden Sie in gleicher Form informieren, wie Ihnen diese Datenschutzerklärung zur Kenntnis gebracht wurde. Die auf dieser Website veröffentlichte Version ist jeweils die aktuelle Fassung.</p>
`.trim()

const sections = [
  {
    title: "Datenschutz",
    image: HERO_IMAGE,
    _orbi: { component: "SectionPageHero" },
  },
  {
    subtitle: "Gemäss revidiertem Datenschutzgesetz vom 1. September 2023 (revDSG)",
    content: {
      de: `<h2>1 Worum geht es in dieser Datenschutzerklärung?</h2>${contentHtml}`,
      en: `<h2>1 Worum geht es in dieser Datenschutzerklärung?</h2>${contentHtml}`,
    },
    _orbi: { component: "SectionLegalContent" },
  },
]

const title = {
  de: "Datenschutzinformationen",
  en: "Datenschutzinformationen",
}
const lead = {
  de: "Datenschutzerklärung der Zofingen Treuhand AG gemäss revidiertem Datenschutzgesetz (revDSG).",
  en: "Datenschutzerklärung der Zofingen Treuhand AG gemäss revidiertem Datenschutzgesetz (revDSG).",
}
const keywords = [
  "Datenschutz",
  "Datenschutzerklärung",
  "revDSG",
  "Zofingen Treuhand",
  "Personendaten",
]

const slug = "datenschutz"

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
