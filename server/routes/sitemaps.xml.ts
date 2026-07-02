import { defineEventHandler, appendResponseHeaders } from "h3"
import { dedent } from "ts-dedent"

const dateToday = new Date().toISOString().split("T")[0] // Example: current date

// Example static list of sitemap entries
const sitemapEntriesConfig = [
  { name: "en/sitemaps.xml", lastmod: dateToday },
  { name: "de/sitemaps.xml", lastmod: dateToday },
]

export default defineEventHandler(async (event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl

  // Generate <sitemap> entries from the static configuration
  const sitemapEntries = sitemapEntriesConfig
    .map(({ name, lastmod }) => {
      const sitemapUrl = `${baseUrl}/${name}`
      return dedent`
            <sitemap>
                <loc>${sitemapUrl}</loc>
                <lastmod>${lastmod}</lastmod>
            </sitemap>
        `
    })
    .join("\n")

  appendResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
  })

  // Return the compiled sitemap index
  return dedent`
        <?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemapEntries}
        </sitemapindex>
    `
})
