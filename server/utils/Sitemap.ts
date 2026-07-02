import type { I18nString } from "~/types/util/I18nString"
import toSlug from "slug"
import { dedent } from "ts-dedent"

type TLang = keyof I18nString
type TIndexable = {
  id: string
  slug?: string
  updated_at?: string
  created_at?: string
}

export class Sitemap {
  baseUrl = ""
  langs: TLang[] = ["de", "en"]
  folder = ""
  indexables: TIndexable[] = []

  private encode(indexable: TIndexable) {
    const lastmod = indexable.updated_at ?? indexable.created_at ?? ""

    const href = (lang: TLang) => {
      const id = indexable.slug ? null : indexable.id
      const slug =
        indexable.slug ?? toSlug(indexable[Object.keys(indexable)[1]][lang])

      const parts = [this.baseUrl]
      if (lang !== this.langs[0]) parts.push(lang)
      if (this.folder) parts.push(this.folder)
      if (id) parts.push(id)
      if (slug) parts.push(slug)
      return parts.join("/")
    }

    let xml = ""
    for (const lang of this.langs) {
      // prettier-ignore
      xml += dedent`
        <url>
          <loc>${href(lang)}</loc>
          <lastmod>${lastmod}</lastmod>
          ${this.langs.map((l) => dedent`
            <xhtml:link
              rel="alternate"
              hreflang="${l}"
              href="${href(l)}"
            />`).join("\n")}
        </url>\n
      `
    }
    return xml
  }

  toXml() {
    return dedent`
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${this.indexables.map((x) => this.encode(x)).join("\n")}
      </urlset>
    `
  }
}
