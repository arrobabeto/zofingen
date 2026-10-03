import { useRuntimeConfig } from "#app"

type TSeoLink = {
  rel: string
  href: string
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

/** Single-language (German) site: canonical only, no hreflang alternates. */
export function useCanonicalLinks(canonicalPath: string): TSeoLink[] {
  const config = useRuntimeConfig()
  const baseUrl = normalizeBaseUrl(config.public.siteUrl)

  return [
    {
      rel: "canonical",
      href: `${baseUrl}${normalizePath(canonicalPath)}`,
    },
  ]
}
