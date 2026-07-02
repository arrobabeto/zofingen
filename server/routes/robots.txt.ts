import { appendResponseHeaders, defineEventHandler } from "h3"
import { dedent } from "ts-dedent"

export default defineEventHandler(async (event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl

  appendResponseHeaders(event, { "Content-Type": "text/plain" })
  return dedent`
    User-agent: *
    Allow: /

    Disallow: /errors/
    Disallow: /_nuxt/
    Disallow: /api/

    Allow: /robots.txt
    Allow: /sitemaps.xml
    Allow: /llms.txt

    Crawl-delay: 1

    Sitemap: ${baseUrl}/sitemaps.xml
    Sitemap: ${baseUrl}/en/sitemaps.xml
    Sitemap: ${baseUrl}/de/sitemaps.xml

    LLMs-Txt: ${baseUrl}/llms.txt
    LLMs-Full-Txt: ${baseUrl}/llms-full.txt
  `
})
