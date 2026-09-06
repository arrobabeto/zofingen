import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  buildSitemapIndexXml,
  buildUrlsetXml,
  pagePathFromSlug,
  postPathFromTitle,
} from "../../server/utils/sitemapXml.ts"

describe("sitemapXml", () => {
  it("maps home slug to root path", () => {
    assert.equal(pagePathFromSlug("home"), "")
    assert.equal(pagePathFromSlug("kontakt"), "kontakt")
  })

  it("builds post paths from title", () => {
    assert.equal(
      postPathFromTitle("1kA8cC", {
        de: "Immobilie in Deutschland",
        en: "Immobilie in Deutschland",
      }),
      "posts/1kA8cC/immobilie-in-deutschland",
    )
  })

  it("builds compact urlset with en/de and x-default", () => {
    const xml = buildUrlsetXml("https://www.zofingen-treuhand.ch", [
      { path: "kontakt", lastmod: "2026-09-06T12:00:00.000Z" },
    ])
    assert.match(xml, /xml-stylesheet/)
    assert.match(xml, /<loc>https:\/\/www\.zofingen-treuhand\.ch\/kontakt<\/loc>/)
    assert.match(xml, /<loc>https:\/\/www\.zofingen-treuhand\.ch\/de\/kontakt<\/loc>/)
    assert.match(xml, /hreflang="x-default"/)
    assert.doesNotMatch(xml, /localhost/)
  })

  it("builds index pointing at flat child sitemaps", () => {
    const xml = buildSitemapIndexXml("https://www.zofingen-treuhand.ch", [
      { path: "sitemap-pages.xml" },
      { path: "sitemap-posts.xml" },
    ])
    assert.match(xml, /sitemap-pages\.xml/)
    assert.match(xml, /sitemap-posts\.xml/)
    assert.doesNotMatch(xml, /en\/sitemaps/)
  })
})
