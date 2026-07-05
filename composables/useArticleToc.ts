export type ArticleTocItem = {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function parseArticleToc(html: string): ArticleTocItem[] {
  const items: ArticleTocItem[] = []
  const regex = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3
    const attrs = match[2] ?? ""
    const rawText = (match[3] ?? "").replace(/<[^>]+>/g, "").trim()
    if (!rawText) continue

    const idMatch = attrs.match(/\bid=["']([^"']+)["']/i)
    const id = idMatch?.[1] ?? slugify(rawText)
    items.push({ id, text: rawText, level })
  }

  return items
}

export function injectArticleHeadingIds(html: string): string {
  const used = new Set<string>()

  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, level: string, attrs: string, inner: string) => {
      if (/\bid=["']/i.test(attrs)) return _full

      const text = inner.replace(/<[^>]+>/g, "").trim()
      let id = slugify(text) || "section"
      let n = 2
      while (used.has(id)) {
        id = `${slugify(text)}-${n++}`
      }
      used.add(id)

      const space = attrs.startsWith(" ") || attrs === "" ? "" : " "
      return `<h${level} id="${id}"${space}${attrs}>${inner}</h${level}>`
    },
  )
}

export function useArticleToc(html: string) {
  const enrichedHtml = injectArticleHeadingIds(html)
  const items = parseArticleToc(enrichedHtml)
  return { enrichedHtml, items }
}
