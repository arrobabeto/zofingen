/**
 * WordPress → Nuxt URL map for SEO recovery after migration.
 * Keys and values are stored without trailing slash.
 * Paths are matched after normalizePath().
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/sitemap.xml": "/sitemaps.xml",
  "/blog": "/artikel",
  "/posts": "/artikel",

  // High-traffic articles (old flat WP slugs → /posts/:id/:slug)
  "/auslandsimmobilien-steuern-schweiz-deutschland":
    "/posts/1kA8cC/immobilie-in-deutschland-wohnsitz-schweiz-steuern-richtig-verstehen",
  "/steuervorteile-in-der-schweiz-bei-einer-immobilie-in-deutschland":
    "/posts/1kA8cC/immobilie-in-deutschland-wohnsitz-schweiz-steuern-richtig-verstehen",
  "/grundstueckgewinnsteuer-aargau-berechnen":
    "/posts/rjzqhh/grundstuckgewinnsteuer-aargau-schweiz-berechnen-einfach-erklart",
  "/berechnung-der-grundstueckgewinnsteuern":
    "/posts/rjzqhh/grundstuckgewinnsteuer-aargau-schweiz-berechnen-einfach-erklart",
  "/lohn-oder-dividende-fuer-unternehmer":
    "/posts/EFNich/lohn-oder-dividende-in-der-schweiz-was-sich-fur-unternehmer-lohnt",
  "/krypto-steuern-praxis-beispiele":
    "/posts/gN9FBt/kryptogewinne-versteuern-schweiz-mining-staking-nft-und-defi-2026-praxis-beispiele",
  "/kryptowaehrungen-steuern-grundlagen":
    "/posts/nb5sbI/krypto-steuern-schweiz-2026-grundlagen-der-steuerlichen-behandlung-von-kryptowahrungen",
  "/steuerliche-behandlung-von-kryptowaehrungen-in-der-schweiz":
    "/posts/nb5sbI/krypto-steuern-schweiz-2026-grundlagen-der-steuerlichen-behandlung-von-kryptowahrungen",
  "/krypto-steuerpraxis":
    "/posts/nb5sbI/krypto-steuern-schweiz-2026-grundlagen-der-steuerlichen-behandlung-von-kryptowahrungen",
  "/steueroptimierung-unternehmen-schweiz":
    "/posts/QO1jro/steueroptimierung-fur-unternehmen-strategien-zur-senkung-der-steuerbelastung",
  "/familienstiftung-schweiz-trust-steuern":
    "/posts/QS1sQQ/familienstiftung-schweiz-und-trust-steuerplanung-nachfolge-und-vermogensschutz-2026",
  "/die-rolle-von-familienstiftungen-und-trusts-in-der-steuerplanung":
    "/posts/QS1sQQ/familienstiftung-schweiz-und-trust-steuerplanung-nachfolge-und-vermogensschutz-2026",
  "/mwst-saldosteuersatz-effektive-methode":
    "/posts/3XlWEj/mwst-saldosteuersatz-oder-effektive-methode-die-richtige-wahl-fur-ihr-unternehmen",
  "/mehrwertsteuer-handel-import-export-digital":
    "/posts/UzHazz/mwst-im-internationalen-handel-2026-import-export-und-digitale-leistungen",
  "/mehrwertsteuer-im-internationalen-handel":
    "/posts/UzHazz/mwst-im-internationalen-handel-2026-import-export-und-digitale-leistungen",
  "/kapitalgewinnsteuer-in-der-schweiz":
    "/posts/L79qSc/kapitalgewinnsteuer-schweiz-2026-was-privatpersonen-und-unternehmen-wissen-mussen",
  "/geballte-verwaltungs-power": "/posts/U7Tegm/geballte-verwaltungs-power",
  "/energetische-sanierungen-steuerlich-absetzen":
    "/posts/83d30W/energetische-sanierungen-steuerlich-absetzen-so-sparen-sie-steuern",
  "/immobilien-ag-oder-gmbh-gruenden":
    "/posts/4FLWqB/immobilien-ag-oder-immobilien-gmbh-grunden-und-steuern-sparen",
  "/soll-ich-eine-immobilien-ag-oder-immobilien-gmbh-gruenden":
    "/posts/4FLWqB/immobilien-ag-oder-immobilien-gmbh-grunden-und-steuern-sparen",
  "/unser-team-waechst": "/posts/UY7Jct/unser-team-wachst",

  // Service pages (WP /dienstleistungen/... → flat Nuxt slugs)
  "/dienstleistungen/externe-lohnbuchhaltung": "/externe-lohnbuchhaltung",
  "/dienstleistungen/firmengruendung": "/firmengruendung",
  "/dienstleistungen/grundstueckgewinnsteuern": "/grundstueckgewinnsteuern",
  "/dienstleistungen/steuern-fuer-privatpersonen":
    "/steuern-fuer-privatpersonen",

  // Assets, tags, feeds, missing pages
  "/wp-content/uploads/2025/02/Vorlageliste-Excel-Unterlagen-Jahresabschluss.xls":
    "/downloads/merkblaetter/Vorlageliste-Excel-Unterlagen-Jahresabschluss.xls",
  "/tag/steuererklarung": "/artikel",
  "/tag/sozialversicherung": "/artikel",
  "/feed": "/artikel",
  "/rechner": "/jahresabschluss",
  "/agbs": "/kontakt",
  "/teamleiter-treuhand-pensum-80-100": "/ueber-uns",
}

/** Strip query/hash and trailing slash; keep leading slash. */
export function normalizePath(pathname: string): string {
  const withoutQuery = pathname.split("?")[0]?.split("#")[0] ?? "/"
  if (!withoutQuery || withoutQuery === "/") return "/"
  const withLeading = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`
  return withLeading.length > 1 && withLeading.endsWith("/")
    ? withLeading.slice(0, -1)
    : withLeading
}

/**
 * Resolve a legacy request path to a 301 target.
 * Also matches /de-prefixed variants when the unprefixed path is mapped.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const path = normalizePath(pathname)
  if (path === "/") return null

  const direct = LEGACY_REDIRECTS[path]
  if (direct) return direct

  if (path.startsWith("/de/")) {
    const withoutLocale = path.slice(3)
    const target = LEGACY_REDIRECTS[withoutLocale]
    if (target) {
      if (target.startsWith("/posts/") || target.startsWith("/downloads/")) {
        return `/de${target}`
      }
      return `/de${target}`
    }
  }

  return null
}
