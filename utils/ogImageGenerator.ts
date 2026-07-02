import { useRuntimeConfig } from "#app"

type TOgImageParams = {
  title?: string
  description?: string
  image?: string
  type?: "page" | "post"
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

function truncate(input: string, limit: number): string {
  if (input.length <= limit) return input
  return `${input.slice(0, limit - 3)}...`
}

export function generateOGImageUrl(params: TOgImageParams): string {
  const config = useRuntimeConfig()
  const baseUrl = normalizeBaseUrl(config.public.siteUrl)
  const type = params.type ?? "page"
  const searchParams = new URLSearchParams()

  if (params.title) searchParams.set("title", truncate(params.title, 60))
  if (params.description) {
    searchParams.set("description", truncate(params.description, 160))
  }
  if (params.image) searchParams.set("image", params.image)

  return `${baseUrl}/api/og/${type}?${searchParams.toString()}`
}
