// Seeds the Zofingen Treuhand "Links" page into the Orbitype `pages` table.
// Content mirrors the Figma design (node 503:832) and maps to components/sections/*.vue.
// Usage: node _scripts/_seed-links.mjs
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
const img = (name) => `/img/links/${name}`

const sections = [
  {
    title: "Links",
    body: "Hier finden Sie alle wichtigen Links zu unseren Dienstleistungen, Beratungen und Ressourcen. Entdecken Sie alles, was Sie brauchen, an einem einzigen Ort.",
    image: HERO_IMAGE,
    align: "left",
    large: true,
    _orbi: { component: "SectionPageHero" },
  },
  {
    title: "Fachwissen - Fachthemen",
    columns: [
      {
        groups: [
          {
            title: "Treuhand und Steuern",
            links: [
              {
                label: "Verband Treuhand Suisse",
                href: "http://www.treuhandsuisse-zh.ch/",
                text: "www.treuhandsuisse-zh.ch",
              },
              {
                label: "Veb.ch Verband Rechnungslegung & Controlling",
                href: "http://www.veb.ch/",
                text: "www.veb.ch",
              },
              {
                label: "Treuhänder",
                href: "http://www.treuhaender.ch/",
                text: "www.treuhaender.ch",
              },
              {
                label: "AHV",
                href: "http://www.ahv.ch/",
                text: "www.ahv.ch",
              },
              {
                label: "BVG",
                href: "http://www.bvg.ch/",
                text: "www.zentralstelle.ch",
              },
              {
                label: "Handelsregister",
                href: "http://www.handelsregister.ch/",
                text: "www.handelsregister.ch",
              },
              {
                label: "schweiz. Eidgenossenschaft",
                href: "http://www.admin.ch/",
                text: "www.admin.ch",
              },
              {
                label: "Eidg. Steuerverwaltung",
                href: "http://www.estv.admin.ch/",
                text: "www.estv.admin.ch",
              },
              {
                label: "Steueramt Kanton Aargau",
                href: "http://www.ag.ch/steuern",
                text: "www.ag.ch/steuern",
              },
              {
                label: "Steueramt Kanton Zürich",
                href: "http://www.steueramt.zh.ch/",
                text: "www.steueramt.zh.ch",
              },
              {
                label: "Wirtschaft",
                href: "http://www.wirtschaft.ch/",
                text: "www.wirtschaft.ch",
              },
            ],
          },
          {
            title: "Partner und Verbände",
            links: [
              {
                label: "Verband Treuhand Suisse",
                href: "http://www.treuhandsuisse-zh.ch/",
                text: "www.treuhandsuisse-zh.ch",
              },
              {
                label: "Veb.ch Verband Rechnungslegung & Controlling",
                href: "http://www.veb.ch/",
                text: "www.veb.ch",
              },
              {
                label: "OPTEN AG",
                href: "http://www.opten.ch/",
                text: "www.opten.ch",
              },
              {
                label: "Gewerbeverein Lenzburg",
                href: "http://www.gewerbeverein-lenzburg.ch/",
                text: "www.gewerbeverein-lenzburg.ch",
              },
            ],
          },
        ],
      },
      {
        groups: [
          {
            title: "Buchhaltungssoftware und ERP-Lösungen",
            links: [
              {
                label: "Bexio Cloud- und Onlinebuchhaltung",
                href: "http://www.bexio.com/",
                text: "www.bexio.com",
              },
              {
                label: "Banana Buchhaltung",
                href: "http://www.banana.ch/",
                text: "www.banana.ch",
              },
              {
                label: "cashctrl.com Online-Buchhaltung",
                href: "http://www.cashctrl.com/",
                text: "www.cashctrl.com",
              },
              {
                label: "Comatic Buchhaltung",
                href: "http://www.comatic.ch/",
                text: "www.comatic.ch",
              },
              {
                label:
                  "Abacus, Aba-Ninja Cloud-Buchhaltung für Kleinunternehmer",
                href: "http://www.abacus.ch/",
                text: "www.abacus.ch",
              },
              {
                label: "Abacus, Aba-web, Digital Treuhand,",
                href: "http://www.abawebtreuhand.ch/",
                text: "www.abawebtreuhand.ch",
              },
              {
                label: "Topal Solutions AG",
                href: "https://www.topal.ch/de/startseite.html",
                text: "www.topal.ch/de/startseite.html",
              },
            ],
          },
          {
            title: "Zofingen und Umgebung",
            links: [
              {
                label: "Wirtschaft Region Zofingen",
                href: "https://www.wr-zofingen.ch",
                text: "www.wr-zofingen.ch",
              },
              {
                label: "Wirtschaftsförderung Region Zofingen",
                href: "https://www.wf-oftringen-zofingen.ch",
                text: "www.wf-oftringen-zofingen.ch",
              },
              {
                label: "Aargau Tourismus",
                href: "https://www.aargautourismus.ch/suchresultatesearchparam%5Bq%5D=Zofingen",
                text: "www.aargautourismus.ch/suchresultatesearchparam[q]=Zofingen",
              },
              {
                label: "Schweiz Tourismus",
                href: "https://www.myswitzerland.com/de-ch/reiseziele/aarburg/",
                text: "https://www.myswitzerland.com/de-ch/reiseziele/aarburg/",
              },
            ],
          },
        ],
      },
    ],
    _orbi: { component: "SectionLinks" },
  },
]

const title = {
  de: "Links",
  en: "Links",
}
const keywords = [
  "Links",
  "Ressourcen",
  "Treuhand",
  "Steuern",
  "Buchhaltung",
  "Zofingen Treuhand",
  "Fachwissen",
]

const slug = "links"

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
