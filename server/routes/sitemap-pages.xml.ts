import { appendResponseHeaders, defineEventHandler } from "h3"
import {
  buildUrlsetXml,
  fetchCmsRows,
  pagePathFromSlug,
  type TSitemapEntry,
} from "~/server/utils/sitemapXml"
import { getSiteUrl } from "~/server/utils/siteUrl"

type TPageRow = {
  slug: string
  updated_at?: string
  created_at?: string
}

async function pagesSitemapXml() {
  const baseUrl = getSiteUrl()
  const pages = await fetchCmsRows<TPageRow>(
    "SELECT slug, updated_at, created_at FROM pages ORDER BY slug",
  )
  const entries: TSitemapEntry[] = pages.map((p) => ({
    path: pagePathFromSlug(p.slug),
    lastmod: p.updated_at ?? p.created_at,
  }))
  return buildUrlsetXml(baseUrl, entries)
}

export default defineEventHandler(async (event) => {
  appendResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  })
  return pagesSitemapXml()
})

export { pagesSitemapXml }
