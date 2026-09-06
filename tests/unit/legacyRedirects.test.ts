import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  normalizePath,
  resolveLegacyRedirect,
} from "../../server/utils/legacyRedirects.ts"

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

  it("maps de-prefixed legacy paths", () => {
    assert.equal(
      resolveLegacyRedirect("/de/dienstleistungen/firmengruendung/"),
      "/de/firmengruendung",
    )
  })

  it("returns null for current valid pages", () => {
    assert.equal(resolveLegacyRedirect("/ueber-uns"), null)
    assert.equal(resolveLegacyRedirect("/kontakt/"), null)
    assert.equal(resolveLegacyRedirect("/"), null)
  })
})
