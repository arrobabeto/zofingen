import { defineEventHandler, appendResponseHeaders } from "h3"
import { dedent } from "ts-dedent"
import { getSiteUrl } from "~/server/utils/siteUrl"

const dateToday = new Date().toISOString().split("T")[0]

// Google forbids nested sitemap indexes: this root index must point at urlsets only.
const sitemapEntriesConfig = [
  { name: "sitemaps/pages.xml", lastmod: dateToday },
  { name: "sitemaps/posts.xml", lastmod: dateToday },
]

export default defineEventHandler(async (event) => {
  const baseUrl = getSiteUrl()

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

  return dedent`
        <?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemapEntries}
        </sitemapindex>
    `
})
