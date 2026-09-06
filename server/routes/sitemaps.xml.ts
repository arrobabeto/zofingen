import { appendResponseHeaders, defineEventHandler } from "h3"
import { buildSitemapIndexXml } from "~/server/utils/sitemapXml"
import { getSiteUrl } from "~/server/utils/siteUrl"

export default defineEventHandler(async (event) => {
  const baseUrl = getSiteUrl()
  const today = new Date().toISOString().slice(0, 10)

  appendResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  })

  return buildSitemapIndexXml(baseUrl, [
    { path: "sitemap-pages.xml", lastmod: today },
    { path: "sitemap-posts.xml", lastmod: today },
  ])
})
