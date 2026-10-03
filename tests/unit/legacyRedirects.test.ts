import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  normalizePath,
  resolveLegacyRedirect,
  resolveRequestRedirect,
} from "../../server/utils/legacyRedirects.ts"

const SITE_URL = "https://www.zofingen-treuhand.ch"
const GRUNDSTUECK_POST =
  "/posts/rjzqhh/grundstuckgewinnsteuer-aargau-schweiz-berechnen-einfach-erklart"

describe("normalizePath", () => {
  it("strips trailing slash and query", () => {
    assert.equal(normalizePath("/foo/"), "/foo")
    assert.equal(normalizePath("/foo/?x=1"), "/foo")
    assert.equal(normalizePath("/"), "/")
  })
})

describe("resolveLegacyRedirect", () => {
  it("maps top article URL with trailing slash", () => {
    assert.equal(
      resolveLegacyRedirect("/auslandsimmobilien-steuern-schweiz-deutschland/"),
      "/posts/1kA8cC/immobilie-in-deutschland-wohnsitz-schweiz-steuern-richtig-verstehen",
    )
  })

  it("maps 2025-generation article URL with and without trailing slash", () => {
    const target =
      "/posts/DTFmb1/mitarbeiterbeteiligung-und-steuern-in-der-schweiz-der-vollstandige-leitfaden-fur-kmu"
    assert.equal(resolveLegacyRedirect("/mitarbeiterbeteiligung-steuern/"), target)
    assert.equal(resolveLegacyRedirect("/mitarbeiterbeteiligung-steuern"), target)
  })

  it("maps dienstleistungen service pages", () => {
    assert.equal(
      resolveLegacyRedirect("/dienstleistungen/firmengruendung/"),
      "/firmengruendung",
    )
  })

  it("maps blog listing aliases to artikel", () => {
    assert.equal(resolveLegacyRedirect("/blog"), "/artikel")
    assert.equal(resolveLegacyRedirect("/feed/"), "/artikel")
  })

  it("maps de-prefixed legacy paths to the unprefixed target in one hop", () => {
    assert.equal(
      resolveLegacyRedirect("/de/dienstleistungen/firmengruendung/"),
      "/firmengruendung",
    )
    assert.equal(
      resolveLegacyRedirect("/de/auslandsimmobilien-steuern-schweiz-deutschland/"),
      "/posts/1kA8cC/immobilie-in-deutschland-wohnsitz-schweiz-steuern-richtig-verstehen",
    )
  })

  it("strips the /de prefix from current pages and posts", () => {
    assert.equal(resolveLegacyRedirect("/de"), "/")
    assert.equal(resolveLegacyRedirect("/de/"), "/")
    assert.equal(resolveLegacyRedirect("/de/kontakt/"), "/kontakt")
    assert.equal(
      resolveLegacyRedirect("/de/posts/1kA8cC/x"),
      "/posts/1kA8cC/x",
    )
  })

  it("keeps legacy /de sitemaps serving XML", () => {
    assert.equal(resolveLegacyRedirect("/de/sitemaps.xml"), null)
  })

  it("maps /rechner to the Grundstückgewinnsteuer article", () => {
    assert.equal(resolveLegacyRedirect("/rechner/"), GRUNDSTUECK_POST)
  })
})

describe("resolveRequestRedirect", () => {
  const apex = "zofingen-treuhand.ch"
  const www = "www.zofingen-treuhand.ch"

  it("sends apex legacy paths to the final www URL in one hop", () => {
    assert.equal(
      resolveRequestRedirect(apex, "/rechner/", "", SITE_URL),
      `${SITE_URL}${GRUNDSTUECK_POST}`,
    )
  })

  it("sends apex pages to www keeping the query string", () => {
    assert.equal(
      resolveRequestRedirect(apex, "/kontakt", "?x=1", SITE_URL),
      `${SITE_URL}/kontakt?x=1`,
    )
    assert.equal(resolveRequestRedirect(apex, "/", "", SITE_URL), `${SITE_URL}/`)
  })

  it("serves canonical www and preview hosts without redirect", () => {
    assert.equal(resolveRequestRedirect(www, "/kontakt", "", SITE_URL), null)
    assert.equal(
      resolveRequestRedirect("foo.vercel.app", "/kontakt", "", SITE_URL),
      null,
    )
  })

  it("uses an absolute location for legacy paths on www", () => {
    assert.equal(
      resolveRequestRedirect(www, "/rechner", "", SITE_URL),
      `${SITE_URL}${GRUNDSTUECK_POST}`,
    )
  })

  it("returns null for current valid pages", () => {
    assert.equal(resolveLegacyRedirect("/ueber-uns"), null)
    assert.equal(resolveLegacyRedirect("/kontakt/"), null)
    assert.equal(resolveLegacyRedirect("/"), null)
  })
})
