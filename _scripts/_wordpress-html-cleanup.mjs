// Shared HTML cleanup helpers for WordPress → Orbitype blog import.

export function stripEmptyHtmlElements(html) {
  let out = html
  let prev

  do {
    prev = out

    out = out.replace(
      /<li[^>]*>(\s|&nbsp;|&#160;|<ul[^>]*>\s*<\/ul>|<ol[^>]*>\s*<\/ol>)*<\/li>/gi,
      "",
    )
    out = out.replace(/<ul[^>]*>\s*<\/ul>/gi, "")
    out = out.replace(/<ol[^>]*>\s*<\/ol>/gi, "")
    out = out.replace(/<p[^>]*>\s*<\/p>/gi, "")
  } while (prev !== out)

  return out
}
