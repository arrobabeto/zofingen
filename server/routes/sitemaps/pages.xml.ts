import { appendResponseHeaders, defineEventHandler } from "h3"
import toSlug from "slug"
import { dedent } from "ts-dedent"
import type { IPage } from "~/types/dto/IPage"
import type { I18nString } from "~/types/util/I18nString"

type TLang = keyof I18nString
type TIndexable = {
  id: string
  slug?: string
  updated_at?: string
  created_at?: string
}

const langs: TLang[] = ["en", "de"]

export default defineEventHandler(async (event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl

  const pages: IPage[] = await $fetch(baseUrl + "/api/pages", {
    query: {
      status: "published",
    },
  })

  // const dateToday = new Date().toISOString().split("T")[0] // Example: current date

  // Custom pages which come from Nuxt not Orbitype
  const customPages: TIndexable[] = [
    // { id: "xxx", slug: "support", updated_at: dateToday },
    // Add more custom pages here
  ]

  function toUrl(obj: TIndexable | IPage, folder = "", lang: TLang) {
    const code = lang !== langs[0] ? lang : null
    const id = "id" in obj && obj.slug ? null : (obj as TIndexable).id // Handle the case where 'id' is not in IPage
    let slug = obj.slug ?? toSlug((obj as any)[Object.keys(obj)[1]][lang])
    if (slug === "home") slug = ""
    return [baseUrl, code, folder, id, slug].filter((x) => x).join("/")
  }

  function toXml(obj: TIndexable | IPage, folder = "") {
    const lastmod = obj.updated_at ?? obj.created_at ?? ""
    let xml = ""
    for (const lang of langs) {
      // prettier-ignore
      xml += dedent`
        <url>
          <loc>${toUrl(obj, folder, lang)}</loc>
          <lastmod>${lastmod}</lastmod>
          ${langs.map((l) => dedent`
            <xhtml:link
              rel="alternate"
              hreflang="${l}"
              href="${toUrl(obj, folder, l)}"
            />`).join("\n")}
        </url>\n
      `
    }
    return xml
  }

  const allPages: (IPage | TIndexable)[] = [...pages, ...customPages]

  appendResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
  })
  return dedent`
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">
      ${allPages.map((x) => toXml(x)).join("\n")}
    </urlset>
  `
})
