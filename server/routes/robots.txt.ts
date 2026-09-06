import { appendResponseHeaders, defineEventHandler } from "h3"
import { dedent } from "ts-dedent"
import { getSiteUrl } from "~/server/utils/siteUrl"

export default defineEventHandler(async (event) => {
  const baseUrl = getSiteUrl()

  appendResponseHeaders(event, { "Content-Type": "text/plain" })
  return dedent`
    User-agent: *
    Allow: /

    Disallow: /errors/
    Disallow: /_nuxt/
    Disallow: /api/

    Allow: /robots.txt
    Allow: /sitemaps.xml
    Allow: /sitemap-pages.xml
    Allow: /sitemap-posts.xml
    Allow: /sitemaps/
    Allow: /llms.txt

    Sitemap: ${baseUrl}/sitemaps.xml
  `
})
