import { appendResponseHeaders, defineEventHandler } from "h3"
import { dedent } from "ts-dedent"
import { getSiteUrl } from "~/server/utils/siteUrl"

const dateToday = new Date().toISOString().split("T")[0]

export default defineEventHandler(async (event) => {
  const baseUrl = getSiteUrl()

  appendResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
  })
  return dedent`
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${baseUrl}/sitemaps/pages.xml</loc>
        <lastmod>${dateToday}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemaps/posts.xml</loc>
        <lastmod>${dateToday}</lastmod>
      </sitemap>
    </sitemapindex>
  `
})
