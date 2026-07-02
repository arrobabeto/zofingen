import { useRuntimeConfig } from "#app"

type TCanonicalLinksInput = {
  canonicalPath: string
  enPath: string
  dePath: string
  xDefaultPath?: string
}

type TSeoLink = {
  rel: string
  href: string
  hreflang?: string
}

function normalizePath(path: string): string {
  if (!path) return "/"
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1)
  }
  return withLeadingSlash
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export function useCanonicalLinks(input: TCanonicalLinksInput): TSeoLink[] {
  const config = useRuntimeConfig()
  const baseUrl = normalizeBaseUrl(config.public.siteUrl)
  const absoluteUrl = (path: string) => `${baseUrl}${normalizePath(path)}`

  return [
    {
      rel: "canonical",
      href: absoluteUrl(input.canonicalPath),
    },
    {
      rel: "alternate",
      hreflang: "en",
      href: absoluteUrl(input.enPath),
    },
    {
      rel: "alternate",
      hreflang: "de",
      href: absoluteUrl(input.dePath),
    },
    {
      rel: "alternate",
      hreflang: "x-default",
      href: absoluteUrl(input.xDefaultPath ?? input.enPath),
    },
  ]
}
