import { appendResponseHeaders, defineEventHandler } from "h3"
import {
  buildUrlsetXml,
  fetchCmsRows,
  postPathFromTitle,
  type TSitemapEntry,
} from "~/server/utils/sitemapXml"
import { getSiteUrl } from "~/server/utils/siteUrl"
import type { I18nString } from "~/types/util/I18nString"

type TPostRow = {
  id: string
  title: I18nString
  updated_at?: string
  created_at?: string
}

async function postsSitemapXml() {
  const baseUrl = getSiteUrl()
  const posts = await fetchCmsRows<TPostRow>(
    `SELECT id, title, updated_at, created_at FROM posts
     WHERE COALESCE("status"->>'value', 'published') = 'published'
     ORDER BY updated_at DESC NULLS LAST, id`,
  )
  const entries: TSitemapEntry[] = posts.map((p) => ({
    path: postPathFromTitle(p.id, p.title),
    lastmod: p.updated_at ?? p.created_at,
  }))
  return buildUrlsetXml(baseUrl, entries)
}

export default defineEventHandler(async (event) => {
  appendResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  })
  return postsSitemapXml()
})

export { postsSitemapXml }
