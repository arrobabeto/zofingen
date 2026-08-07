import assert from "node:assert/strict"
import { describe, it, mock } from "node:test"
import {
  buildMailerliteFields,
  getMailerliteFormConfig,
  hasMailerliteConsent,
} from "../../server/utils/mailerliteFormConfig.ts"
import { upsertSubscriberToGroups } from "../../server/utils/mailerliteClient.ts"

describe("mailerliteFormConfig", () => {
  it("registers only pdf_handbook", () => {
    const pdf = getMailerliteFormConfig("pdf_handbook")
    assert.ok(pdf)
    assert.equal(pdf.groupId, "118335752483374916")
    assert.equal(pdf.failurePolicy, "mixed")

    assert.equal(getMailerliteFormConfig("contact"), undefined)
    assert.equal(getMailerliteFormConfig("jahresabschluss"), undefined)
    assert.equal(getMailerliteFormConfig("callback"), undefined)
  })

  it("maps only whitelisted fields to MailerLite keys", () => {
    const config = getMailerliteFormConfig("pdf_handbook")!
    const mapped = buildMailerliteFields(config, {
      firstName: "Max",
      lastName: "Muster",
      phone: "+41 79 000 00 00",
      email: "max@example.com",
      salutation: "Herr",
    })

    assert.deepEqual(mapped, {
      name: "Max",
      last_name: "Muster",
      phone: "+41 79 000 00 00",
    })
    assert.equal("email" in mapped, false)
    assert.equal("salutation" in mapped, false)
  })

  it("treats missing consentField as consented", () => {
    const config = getMailerliteFormConfig("pdf_handbook")!
    assert.equal(hasMailerliteConsent(config, {}), true)
  })

  it("requires consent field when configured", () => {
    const config = {
      ...getMailerliteFormConfig("pdf_handbook")!,
      consentField: "marketingConsent",
    }
    assert.equal(hasMailerliteConsent(config, {}), false)
    assert.equal(hasMailerliteConsent(config, { marketingConsent: "true" }), true)
  })
})

describe("upsertSubscriberToGroups", () => {
  it("posts subscriber with groups and does not send resubscribe or status", async () => {
    process.env.MAILERLITE_API_KEY = "test-key"

    const calls: { url: string; init?: RequestInit }[] = []
    const originalFetch = globalThis.fetch
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init })
      return new Response(JSON.stringify({ data: { id: "1" } }), { status: 201 })
    }) as typeof fetch

    try {
      const result = await upsertSubscriberToGroups({
        email: "max@example.com",
        fields: { name: "Max", last_name: "Muster" },
        groupIds: ["118335752483374916"],
      })

      assert.equal(result.ok, true)
      assert.equal(calls.length, 1)
      assert.match(calls[0].url, /connect\.mailerlite\.com\/api\/subscribers/)

      const headers = calls[0].init?.headers as Record<string, string>
      assert.equal(headers.Authorization, "Bearer test-key")

      const body = JSON.parse(String(calls[0].init?.body))
      assert.equal(body.email, "max@example.com")
      assert.deepEqual(body.groups, ["118335752483374916"])
      assert.deepEqual(body.fields, { name: "Max", last_name: "Muster" })
      assert.equal("resubscribe" in body, false)
      assert.equal("status" in body, false)
    } finally {
      globalThis.fetch = originalFetch
      delete process.env.MAILERLITE_API_KEY
    }
  })

  it("returns failure when API key is missing", async () => {
    delete process.env.MAILERLITE_API_KEY
    const result = await upsertSubscriberToGroups({
      email: "max@example.com",
      groupIds: ["118335752483374916"],
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.message, /MAILERLITE_API_KEY/)
  })
})
