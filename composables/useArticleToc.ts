export type ArticleTocItem = {
  id: string
  text: string
  level: 2 | 3
}

const TOC_EXCLUDED_TITLES = /^(quellen|sources)$/i
const LEADING_SECTION_NUMBER = /^\d+[a-z]?\.\s+/i

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

/** Promote bare Quellen/Sources paragraphs to titled headings for spacing + hierarchy. */
export function normalizeArticleQuellen(html: string): string {
  return html.replace(
    /<p>\s*<strong>\s*(Quellen|Sources)\s*<\/strong>\s*<\/p>/gi,
    '<h2 id="quellen">$1</h2>',
  )
}

/**
 * Wrap bare tables in a horizontal scroll container for touch / narrow viewports.
 * Skips tables already inside `.table-scroll`.
 */
export function wrapArticleTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table, offset, full) => {
    const before = full.slice(Math.max(0, offset - 80), offset)
    if (/table-scroll[^>]*>\s*$/i.test(before)) return table
    return `<div class="table-scroll">${table}</div>`
  })
}

/** Strip manual "1. " / "9a. " prefixes so TOC numbering is not doubled. */
export function tocDisplayText(text: string): string {
  return text.replace(LEADING_SECTION_NUMBER, "").trim() || text
}

export function parseArticleToc(html: string): ArticleTocItem[] {
  const items: ArticleTocItem[] = []
  // Main sections only — subheadings (h3) stay in the body, not the TOC
  const regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1] ?? ""
    const rawText = (match[2] ?? "").replace(/<[^>]+>/g, "").trim()
    if (!rawText) continue
    if (TOC_EXCLUDED_TITLES.test(rawText)) continue

    const idMatch = attrs.match(/\bid=["']([^"']+)["']/i)
    const id = idMatch?.[1] ?? slugify(rawText)
    if (id === "quellen") continue

    items.push({ id, text: tocDisplayText(rawText), level: 2 })
  }

  return items
}

export function injectArticleHeadingIds(html: string): string {
  const used = new Set<string>()

  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, level: string, attrs: string, inner: string) => {
      if (/\bid=["']/i.test(attrs)) {
        const existing = attrs.match(/\bid=["']([^"']+)["']/i)?.[1]
        if (existing) used.add(existing)
        return _full
      }

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
  const withQuellen = normalizeArticleQuellen(html)
  const withTables = wrapArticleTables(withQuellen)
  const enrichedHtml = injectArticleHeadingIds(withTables)
  const items = parseArticleToc(enrichedHtml)
  return { enrichedHtml, items }
}
