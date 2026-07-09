// Seeds the Zofingen Treuhand "Ressourcen" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 505:886) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-ressourcen.mjs
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
const img = (name) => `/img/ressourcen/${name}`

const sections = [
  {
    title: "Ressourcen",
    body: "Hier finden Sie alle wichtigen Ressourcen zu unseren Dienstleistungen. Entdecken Sie alles, was Sie brauchen, an einem einzigen Ort.",
    image: HERO_IMAGE,
    align: "left",
    _orbi: { component: "SectionPageHero" },
  },
  {
    groups: [
      {
        title: "Arbeitshilfen / Merkblätter Steuern",
        items: [
          {
            label: "Merkblatt Unterlagen Private Steuererklärung Deutsch",
            href: "/downloads/merkblaetter/Merkblatt-Unterlagen-Private-Steuererklarung-Deutsch.pdf",
          },
          {
            label: "Checkliste Dokumente Steuererklärung Englisch",
            href: "/downloads/merkblaetter/Checkliste-Dokumente-Steuererklarung-Englisch.pdf",
          },
          {
            label: "Checkliste Unterlagen für Grundstückgewinnsteuer",
            href: "/downloads/merkblaetter/Checkliste-Unterlagen-fur-Grundstuckgewinnsteuer.pdf",
          },
          {
            label: "Fristerstreckungsgesuch private Steuern",
            href: "/downloads/merkblaetter/Fristerstreckungsgesuch-private-Steuern.doc",
          },
          {
            label: "Faktenblatt Steuern Kanton Aargau",
            href: "/downloads/merkblaetter/Faktenblatt-Steuern-Kanton-Aargau.pdf",
          },
          {
            label: "Faktenblatt Immobilien und Liegenschaften Kanton Aargau",
            href: "/downloads/merkblaetter/Faktenblatt-Immobilien-und-Liegenschaften-Kanton-Aargau.pdf",
          },
        ],
      },
      {
        title: "Arbeitshilfen Buchhaltung / Rechnungswesen",
        items: [
          {
            label: "Checkliste Belege für Jahresabschluss",
            href: "/downloads/merkblaetter/Checkliste-Belege-fur-Jahresabschluss.pdf",
          },
          {
            label: "Vorlageliste Excel Unterlagen Jahresabschluss",
            href: "/downloads/merkblaetter/Vorlageliste-Excel-Unterlagen-Jahresabschluss.xls",
          },
          {
            label: "Unterlagen Belege Nachweise für Revision",
            href: "/downloads/merkblaetter/Unterlagen-Belege-Nachweise-fur-Revision.pdf",
          },
        ],
      },
      {
        title: "Arbeitshilfen Lohn & Personal",
        items: [
          {
            label: "Sozialversicherungsbeiträge- und Leistungen 2025",
            href: "/downloads/merkblaetter/Sozialversicherungsbeitrage-und-Leistungen-2021-15.31.11.pdf",
          },
          {
            label: "Personalstammblatt neue Mitarbeiter Deutsch",
            href: "/downloads/merkblaetter/Personalstammblatt-neue-Mitarbeiter-Deutsch.pdf",
          },
          {
            label: "Personalstammblatt neue Mitarbeiter Englisch",
            href: "/downloads/merkblaetter/Personalstammblatt-neue-Mitarbeiter-Englisch.pdf",
          },
          {
            label: "Merkblatt für austretende Mitarbeiter",
            href: "/downloads/merkblaetter/Merkblatt-fur-austretende-Mitarbeiter.pdf",
          },
        ],
      },
    ],
    _orbi: { component: "SectionResources" },
  },
]

const title = {
  de: "Ressourcen",
  en: "Resources",
}
const keywords = [
  "Ressourcen",
  "Merkblätter",
  "Arbeitshilfen",
  "Steuern",
  "Buchhaltung",
  "Lohn",
  "Zofingen Treuhand",
]

const slug = "ressourcen"

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
