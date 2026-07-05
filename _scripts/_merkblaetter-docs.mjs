// Shared helpers for Merkblätter document import (WP → public/downloads/merkblaetter/).
import { fileURLToPath } from "node:url"
import { dirname, join, basename } from "node:path"

export const MERKBLAETTER_SLUG = "merkblaetter"
export const PUBLIC_PREFIX = "/downloads/merkblaetter"

export function merkblaetterDir(root) {
  return join(root, "public/downloads/merkblaetter")
}

export function localHref(filename) {
  return `${PUBLIC_PREFIX}/${filename}`
}

export function parseMerkblaetterLinks(html) {
  const items = []
  const re =
    /<a[^>]+href=["']([^"']+wp-content\/uploads[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match

  while ((match = re.exec(html)) !== null) {
    const url = match[1].trim()
    const label = match[2].replace(/<[^>]+>/g, "").trim()
    const filename = basename(new URL(url).pathname)
    if (!label || !filename) continue
    items.push({ label, url, filename, href: localHref(filename) })
  }

  return items
}

export function scriptRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..")
}
