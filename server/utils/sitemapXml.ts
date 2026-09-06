import toSlug from "slug"
import type { I18nString } from "~/types/util/I18nString"

type TLang = "en" | "de"

export type TSitemapEntry = {
  /** Path without locale prefix, e.g. "" | "kontakt" | "posts/abc/slug" */
  path: string
  lastmod?: string
}

const LANGS: TLang[] = ["en", "de"]

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function absoluteUrl(baseUrl: string, lang: TLang, path: string): string {
  const normalized = path.replace(/^\/+|\/+$/g, "")
  const parts = [baseUrl.replace(/\/$/, "")]
  if (lang === "de") parts.push("de")
  if (normalized) parts.push(normalized)
  return parts.join("/")
}

function lastmodDate(value?: string): string {
  if (!value) return new Date().toISOString().slice(0, 10)
  return value.includes("T") ? value.slice(0, 10) : value
}

/** Compact urlset — single-line tags for reliable GSC parsing. */
export function buildUrlsetXml(
  baseUrl: string,
  entries: TSitemapEntry[],
  stylesheetHref = "/sitemaps.xsl",
): string {
  const urls = entries
    .map((entry) => {
      const lastmod = lastmodDate(entry.lastmod)
      return LANGS.map((lang) => {
        const loc = absoluteUrl(baseUrl, lang, entry.path)
        const alternates = LANGS.map(
          (l) =>
            `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(absoluteUrl(baseUrl, l, entry.path))}"/>`,
        ).join("")
        const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(baseUrl, "en", entry.path))}"/>`
        return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod>${alternates}${xDefault}</url>`
      }).join("")
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${stylesheetHref}"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>\n`
}

export function buildSitemapIndexXml(
  baseUrl: string,
  sitemaps: { path: string; lastmod?: string }[],
  stylesheetHref = "/sitemaps.xsl",
): string {
  const today = new Date().toISOString().slice(0, 10)
  const body = sitemaps
    .map((s) => {
      const loc = `${baseUrl.replace(/\/$/, "")}/${s.path.replace(/^\//, "")}`
      return `<sitemap><loc>${escapeXml(loc)}</loc><lastmod>${lastmodDate(s.lastmod) || today}</lastmod></sitemap>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${stylesheetHref}"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>\n`
}

export function pagePathFromSlug(slug: string): string {
  return slug === "home" ? "" : slug
}

export function postPathFromTitle(
  id: string,
  title: I18nString | string,
): string {
  const text =
    typeof title === "string" ? title : (title.de || title.en || id)
  return `posts/${id}/${toSlug(text)}`
}

export async function fetchCmsRows<T>(sql: string): Promise<T[]> {
  const url = import.meta.env.ORBITYPE_API_SQL_URL
  const key = import.meta.env.ORBITYPE_API_SQL_KEY
  if (!url || !key) return []

  try {
    const rows = await $fetch<T[]>(url, {
      method: "POST",
      headers: { "X-API-KEY": key },
      body: { sql },
    })
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}
