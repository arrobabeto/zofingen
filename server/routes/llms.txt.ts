import { appendResponseHeaders, defineEventHandler } from "h3"
import toSlug from "slug"
import sanitizeHtml from "sanitize-html"
import type { IPage } from "~/types/dto/IPage"
import type { IPost } from "~/types/dto/IPost"
import type { I18nString } from "~/types/util/I18nString"

type TLang = keyof I18nString

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

function localize(value: string | I18nString, lang: TLang): string {
  if (typeof value === "string") return value
  return value[lang] ?? value.en ?? ""
}

function normalizeText(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim()
}

function toPageUrl(baseUrl: string, page: IPage): string {
  if (page.slug === "home") return baseUrl
  return `${baseUrl}/${page.slug}`
}

function toPostUrl(baseUrl: string, post: IPost): string {
  const slug = toSlug(localize(post.title, "en"))
  return `${baseUrl}/posts/${post.id}/${slug}`
}

export default defineEventHandler(async (event) => {
  const baseUrl = normalizeBaseUrl(
    process.env.NUXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  )

  const [pages, posts] = await Promise.all([
    $fetch<IPage[]>("/api/pages").catch(() => []),
    $fetch<IPost[]>("/api/posts", {
      query: { orderBy: "created_at", desc: "true", limit: "100" },
    }).catch(() => []),
  ])

  const lines: string[] = []
  lines.push(
    `# ${process.env.NUXT_PUBLIC_SITE_NAME ?? "Orbitype Headless CMS Template"}`,
  )
  lines.push("")
  lines.push(
    `> ${process.env.NUXT_PUBLIC_SITE_DESCRIPTION ?? "A production-ready starter for Orbitype-powered websites."}`,
  )
  lines.push("")

  if (pages.length > 0) {
    lines.push("## Pages")
    lines.push("")
    for (const page of pages) {
      const title = localize(page.title, "en")
      const lead = localize(page.lead, "en")
      const url = toPageUrl(baseUrl, page)
      lines.push(
        lead ? `- [${title}](${url}): ${lead}` : `- [${title}](${url})`,
      )
    }
    lines.push("")
  }

  if (posts.length > 0) {
    lines.push("## Posts")
    lines.push("")
    for (const post of posts) {
      const title = localize(post.title, "en")
      const url = toPostUrl(baseUrl, post)
      const lead = normalizeText(localize(post.lead as any, "en"))
      lines.push(
        lead ? `- [${title}](${url}): ${lead}` : `- [${title}](${url})`,
      )
    }
    lines.push("")
  }

  appendResponseHeaders(event, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control":
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  })

  return lines.join("\n")
})
