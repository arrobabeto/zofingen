import { defineEventHandler, getQuery } from "h3"
import type { IPage } from "~/types/dto/IPage"
import {
  CREATE_PAGES_TABLE_SQL,
  CREATE_POSTS_TABLE_SQL,
  CREATE_SETTINGS_TABLE_SQL,
} from "~/server/utils/cmsSchema"

type QueryValue = string | string[] | null | undefined
type QueryBindings = Record<string, QueryValue>
const ORBITYPE_API_KEYS_URL = "https://app.orbitype.com/settings/api-keys"

function buildWelcomePage(): IPage {
  const sqlKeyConfigured = hasSqlKeyConfigured()

  return {
    id: "orbitype-headless-cms-template-welcome",
    title: {
      en: "Orbitype Headless CMS Template",
      de: "Orbitype Headless CMS Template",
    },
    slug: "home",
    img: "",
    keywords: ["orbitype", "headless", "cms", "template"],
    lead: {
      en: "A production-ready starter for Orbitype-powered websites.",
      de: "A production-ready starter for Orbitype-powered websites.",
    },
    sections: [
      {
        title: {
          en: "Welcome to the Orbitype Headless CMS Template",
          de: "Welcome to the Orbitype Headless CMS Template",
        },
        lead: welcomePageLead(),
        workflow: welcomeDeveloperWorkflow(),
        capabilities: welcomeCapabilities(),
        cmsGuide: welcomeCmsGuide(),
        steps: welcomePageSteps(sqlKeyConfigured),
        hasSqlKeyConfigured: sqlKeyConfigured,
        apiKeysUrl: ORBITYPE_API_KEYS_URL,
        _orbi: { component: "SectionWelcome" },
      },
    ],
    head: {},
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  }
}

function welcomePageLead() {
  return {
    en: "Start here after cloning. Design in Figma (Figma MCP), build sections in Cursor, then publish page JSON with Orbitype MCP. This welcome page stays visible until live CMS rows are returned.",
    de: "Start here after cloning. Design in Figma (Figma MCP), build sections in Cursor, then publish page JSON with Orbitype MCP. This welcome page stays visible until live CMS rows are returned.",
  }
}

function welcomePageSteps(sqlKeyConfigured: boolean) {
  return [
    {
      title: { en: "Install dependencies" },
      text: { en: "Install dependencies exactly as this starter expects." },
      code: "npm ci\nnpm run setup",
    },
    {
      title: { en: "Create an Orbitype workspace" },
      text: {
        en: "Create a new Orbitype workspace for this cloned project, and make sure you are in the correct workspace and database before installing schema.",
      },
    },
    {
      title: { en: "Create a SQL API key in Orbitype" },
      text: {
        en: "Create or copy your SQL API key from Orbitype settings: https://app.orbitype.com/settings/api-keys",
      },
    },
    {
      title: { en: "Add SQL API credentials to this repo" },
      text: {
        en: sqlKeyConfigured
          ? "Your SQL key is already detected in .env. Continue with the wizard."
          : "Add ORBITYPE_API_SQL_URL and ORBITYPE_API_SQL_KEY to .env. The wizard is visible only when the key is present.",
      },
      code: 'ORBITYPE_API_SQL_URL="https://core.orbitype.com/api/sql/v1"\nORBITYPE_API_SQL_KEY="your-api-key"',
    },
    {
      title: { en: "Start the app" },
      text: {
        en: "Run Nuxt so you can use the guided schema installer on the welcome page.",
      },
      code: "npm run dev",
    },
    {
      title: { en: "Use the guided schema installer" },
      kind: "wizard",
      text: {
        en: "Choose Install all tables (recommended) or install tables one by one (pages, posts, settings).",
      },
    },
    {
      title: { en: "Confirm and execute safely" },
      text: {
        en: "The installer asks for confirmation before execution and then shows per-table success or error results.",
      },
    },
    {
      title: { en: "Manual SQL (optional fallback)" },
      text: {
        en: "If you prefer manual setup, run these SQL statements directly in your workspace.",
      },
      code: `${CREATE_PAGES_TABLE_SQL}\n\n${CREATE_POSTS_TABLE_SQL}\n\n${CREATE_SETTINGS_TABLE_SQL}`,
    },
  ]
}

function welcomeDeveloperWorkflow() {
  return {
    figma: {
      label: { en: "Figma", de: "Figma" },
      detail: {
        en: "Design page layout, typography, and section content structure.",
        de: "Design page layout, typography, and section content structure.",
      },
    },
    inCursor: {
      label: { en: "Inside Cursor", de: "Inside Cursor" },
      steps: [
        {
          label: { en: "Figma MCP", de: "Figma MCP" },
          detail: {
            en: "Pull frames, spacing, and copy into the editor.",
            de: "Pull frames, spacing, and copy into the editor.",
          },
        },
        {
          label: { en: "Cursor build", de: "Cursor build" },
          detail: {
            en: "Ship components/sections/Section*.vue\nAnySection auto-loads them.",
            de: "Ship components/sections/Section*.vue\nAnySection auto-loads them.",
          },
        },
        {
          label: { en: "Orbitype MCP", de: "Orbitype MCP" },
          detail: {
            en: "Publish pages.sections JSON to PostgreSQL\nvia sql_crud_execute.",
            de: "Publish pages.sections JSON to PostgreSQL\nvia sql_crud_execute.",
          },
        },
      ],
    },
    orbitypeIntelligence: {
      label: { en: "Orbitype Intelligence", de: "Orbitype Intelligence" },
      detail: {
        en: "Content operations in Orbitype — edit sections, review pages, and manage CMS data in the app.",
        de: "Content operations in Orbitype — edit sections, review pages, and manage CMS data in the app.",
      },
    },
  }
}

function welcomeCmsGuide() {
  return {
    title: {
      en: "CMS system guide",
      de: "CMS system guide",
    },
    lead: {
      en: "Nuxt components + JSON in pages.sections. Content is always a Vue section file plus matching database JSON, editable via Orbitype SQL MCP.",
      de: "Nuxt components + JSON in pages.sections. Content is always a Vue section file plus matching database JSON, editable via Orbitype SQL MCP.",
    },
    docsUrl: "https://www.orbitype.com/docs/oQSPNY",
    items: [
      {
        title: { en: "Request flow" },
        text: {
          en: "User URL → pages/* → server/api/* → Orbitype SQL API → row with sections JSON array → AnySection.vue maps _orbi.component to components/sections/*.vue.",
        },
      },
      {
        title: { en: "Codebase map" },
        text: {
          en: "pages/[[slug]].vue (generic pages), platform/solutions/vs detail routes, posts/docs routes, server/api/* handlers, components/sections/AnySection.vue, types/util/Section.d.ts.",
        },
      },
      {
        title: { en: "Multiple websites" },
        text: {
          en: "One Orbitype API key per connector. Same section system; different .env keys and .cursor/mcp.json entries per site or environment.",
        },
      },
      {
        title: { en: "Sections contract" },
        text: {
          en: 'Put a human-readable field first (title, name, label — not img URLs). _orbi must be the last key so the CMS list shows a skimmable title. Match _orbi.component to the Vue filename. Use en/de with useTranslate().',
        },
        code: `{
  "title": { "en": "...", "de": "..." },
  "content": { "en": "...", "de": "..." },
  "_orbi": { "component": "SectionFeatureCallout" }
}`,
      },
      {
        title: { en: "Cursor MCP setup" },
        text: {
          en: "Add orbitype-sql (and optional s3) servers to .cursor/mcp.json. Every session: orbitype_get_context first, then sql_readonly_query or sql_crud_execute.",
        },
        code: `{
  "mcpServers": {
    "orbitype-sql-prod-website": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": { "X-API-KEY": "\${env:ORBITYPE_SQL_API_KEY_PROD_WEBSITE}" }
    },
    "orbitype-s3-public-prod": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": { "X-API-KEY": "\${env:ORBITYPE_S3_PUBLIC_API_KEY_PROD}" }
    }
  }
}`,
      },
      {
        title: { en: "Append a section (SQL)" },
        text: {
          en: "Create the Vue section first, then append to pages.sections. Verify with SELECT and open the URL.",
        },
        code: `UPDATE pages
SET sections = (
  COALESCE(sections, '[]'::json)::jsonb
  || jsonb_build_array(
    jsonb_build_object(
      'title', jsonb_build_object('en', '<p>Title</p>', 'de', '<p>Titel</p>'),
      'content', jsonb_build_object('en', '<p>Body</p>', 'de', '<p>Text</p>'),
      'variant', 'highlight',
      '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
    )
  )
)::json
WHERE slug = 'home';`,
      },
      {
        title: { en: "Insert at position (SQL)" },
        text: {
          en: "Use jsonb_insert to place a section at a specific index (example: second section at index 1).",
        },
        code: `UPDATE pages
SET sections = jsonb_insert(
  COALESCE(sections, '[]'::json)::jsonb,
  '{1}',
  jsonb_build_object(
    'title', jsonb_build_object('en', 'Inserted', 'de', 'Eingefuegt'),
    '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
  ),
  false
)::json
WHERE slug = 'home';`,
      },
      {
        title: { en: "Safe content workflow" },
        text: {
          en: "sql_readonly_query → backup sections JSON → sql_crud_execute → re-read row → verify in browser and SEO fields.",
        },
      },
      {
        title: { en: "Quick SQL snippets" },
        text: {
          en: "List slugs, list components on a page, or find all pages using a given section component.",
        },
        code: `SELECT id, slug, updated_at FROM pages ORDER BY updated_at DESC;

SELECT section->'_orbi'->>'component' AS component_name
FROM pages, json_array_elements(sections) AS section
WHERE slug = 'home';

SELECT p.slug FROM pages p, json_array_elements(p.sections) AS section
WHERE section->'_orbi'->>'component' = 'SectionFeatureCallout';`,
      },
      {
        title: { en: "Common pitfalls" },
        text: {
          en: "Wrong connector, _orbi not last (or no title/name first), component name mismatch, invalid sections array, missing en/de, or missing Vue props. Avoid img as first key — URLs are hard to skim.",
        },
      },
    ],
  }
}

function welcomeCapabilities() {
  return [
    {
      title: { en: "CMS request flow" },
      text: {
        en: "Routes call server/api handlers that query Orbitype SQL and render sections through AnySection.vue.",
      },
      badge: "CMS",
    },
    {
      title: { en: "SEO & metadata" },
      text: {
        en: "Rich useHead setup with canonical URLs, Open Graph, Twitter cards, and JSON-LD on dynamic pages.",
      },
      badge: "SEO",
    },
    {
      title: { en: "Sitemap & robots" },
      text: {
        en: "Built-in Nitro routes for robots.txt, sitemap index, and split pages/posts sitemap files.",
      },
      badge: "Nitro",
    },
    {
      title: { en: "Dynamic CMS pages" },
      text: {
        en: "Catch-all slug routing with section rendering and a fallback welcome page when API data is unavailable.",
      },
      badge: "Pages",
    },
    {
      title: { en: "Posts & comments" },
      text: {
        en: "Ready-made post listing, post detail route, and comments API examples for content-heavy projects.",
      },
      badge: "Content",
    },
    {
      title: { en: "Section system" },
      text: {
        en: "Composable page sections with component auto-discovery for scalable CMS-driven page building.",
      },
      badge: "UI",
    },
    {
      title: { en: "I18n ready" },
      text: {
        en: "English and German locale support with translation helper utilities for CMS and UI strings.",
      },
      badge: "i18n",
    },
    {
      title: { en: "Cookie consent & GTM" },
      text: {
        en: "Consent banner with persisted choices plus Google Tag Manager and page-view tracking hooks.",
      },
      badge: "Analytics",
    },
    {
      title: { en: "API & redirects" },
      text: {
        en: "Structured server/api endpoints for pages, posts, comments, contacts, and route redirects middleware.",
      },
      badge: "Backend",
    },
  ]
}

function queryValueMatches(value: QueryValue, expected: string) {
  return Array.isArray(value) ? value.includes(expected) : value === expected
}

function getFallbackPage(bindings: QueryBindings) {
  const welcomePage = buildWelcomePage()
  const id = bindings["id"]
  const slug = bindings["slug"]

  if (id && !queryValueMatches(id, welcomePage.id)) return null
  if (slug && !queryValueMatches(slug, welcomePage.slug)) return null

  return id || slug ? welcomePage : [welcomePage]
}

function isMockModeEnabled() {
  const rawValue = import.meta.env.ORBITYPE_MOCK
  if (!rawValue) return false
  const normalizedValue = String(rawValue).trim().toLowerCase()
  return (
    normalizedValue === "true" ||
    normalizedValue === "1" ||
    normalizedValue === "yes"
  )
}

function hasSqlKeyConfigured() {
  const raw = import.meta.env.ORBITYPE_API_SQL_KEY
  if (!raw) return false
  const normalized = String(raw).trim()
  if (!normalized) return false
  if (normalized.toLowerCase() === "your-api-key") return false
  return true
}

export default defineEventHandler(async (event) => {
  const bindings = getQuery(event) as QueryBindings

  if (isMockModeEnabled()) return getFallbackPage(bindings)

  if (
    !import.meta.env.ORBITYPE_API_SQL_URL ||
    !import.meta.env.ORBITYPE_API_SQL_KEY
  )
    return getFallbackPage(bindings)

  let sql = "SELECT * FROM pages"
  if (bindings.id) sql += " WHERE id = :id"
  if (bindings.slug) sql += " WHERE slug = :slug"

  let rows: IPage[]
  try {
    rows = await $fetch(import.meta.env.ORBITYPE_API_SQL_URL, {
      method: "POST",
      headers: { "X-API-KEY": import.meta.env.ORBITYPE_API_SQL_KEY },
      body: { sql, bindings },
    })
  } catch {
    return getFallbackPage(bindings)
  }

  if (!Array.isArray(rows) || rows.length === 0)
    return getFallbackPage(bindings)

  return bindings.id || bindings.slug ? rows[0] : rows
})
