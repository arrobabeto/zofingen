/** Production site origin — used when NUXT_PUBLIC_SITE_URL is unset. */
export const DEFAULT_SITE_URL = "https://www.zofingen-treuhand.ch"

export function getSiteUrl(): string {
  const raw = process.env.NUXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  return raw.endsWith("/") ? raw.slice(0, -1) : raw
}
