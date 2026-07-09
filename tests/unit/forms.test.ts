import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { toOrbitypeWebhookBody } from "../../server/utils/orbitypeFormPayload.ts"
import { validateFormSubmission } from "../../server/utils/formValidation.ts"

const meta = {
  source: "zofingen-treuhand.ch",
  submittedAt: "2026-07-09T12:00:00.000Z",
}

describe("toOrbitypeWebhookBody", () => {
  it("maps pdf_handbook fields to Orbitype contract", () => {
    const body = toOrbitypeWebhookBody(
      "pdf_handbook",
      {
        salutation: "Herr",
        firstName: "Max",
        lastName: "Muster",
        email: "max@example.com",
        phone: "+41 79 000 00 00",
      },
      meta,
    )

    assert.equal(body.email, "max@example.com")
    assert.equal(body.name, "Herr Max Muster")
    assert.equal(body.phone, "+41 79 000 00 00")
    assert.equal(body.subject, "Anfrage: Firmengründungshandbuch (PDF)")
    assert.match(body.message, /Formular: pdf_handbook/)
    assert.match(body.message, /salutation: Herr/)
    assert.equal(body.formType, "pdf_handbook")
    assert.equal(body.source, meta.source)
  })

  it("maps contact fields with optional company and service", () => {
    const body = toOrbitypeWebhookBody(
      "contact",
      {
        salutation: "Frau",
        firstName: "Anna",
        lastName: "Beispiel",
        email: "anna@example.com",
        company: "Beispiel AG",
        phone: "+41 62 000 00 00",
        service: "Jahresabschluss",
        message: "Bitte um Rückruf",
      },
      meta,
    )

    assert.equal(body.subject, "Kontaktanfrage")
    assert.match(body.message, /company: Beispiel AG/)
    assert.match(body.message, /message: Bitte um Rückruf/)
  })

  it("maps jahresabschluss form type", () => {
    const body = toOrbitypeWebhookBody(
      "jahresabschluss",
      {
        salutation: "Herr",
        firstName: "Tom",
        lastName: "Test",
        email: "tom@example.com",
        phone: "+41 79 111 11 11",
      },
      meta,
    )

    assert.equal(body.subject, "Anfrage: Jahresabschluss")
  })

  it("maps callback without email using fallback address", () => {
    const body = toOrbitypeWebhookBody(
      "callback",
      {
        firstName: "Lea",
        lastName: "Rückruf",
        phone: "+41 79 222 22 22",
      },
      meta,
    )

    assert.equal(body.subject, "Rückruf-Anfrage")
    assert.equal(body.email, "kontakt@zofingen-treuhand.ch")
    assert.equal(body.name, "Lea Rückruf")
  })
})

describe("validateFormSubmission", () => {
  it("requires message for contact form", () => {
    const result = validateFormSubmission("contact", {
      salutation: "Herr",
      lastName: "Muster",
      firstName: "Max",
      email: "max@example.com",
      message: "",
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.message, /message/)
  })

  it("accepts valid contact submission", () => {
    const result = validateFormSubmission("contact", {
      salutation: "Herr",
      lastName: "Muster",
      firstName: "Max",
      email: "max@example.com",
      message: "Hallo",
      company: "Test AG",
    })
    assert.equal(result.ok, true)
  })

  it("rejects invalid email", () => {
    const result = validateFormSubmission("pdf_handbook", {
      salutation: "Herr",
      lastName: "Muster",
      firstName: "Max",
      email: "not-an-email",
      phone: "+41 79 000 00 00",
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.message, /email/i)
  })

  it("rejects unknown form type", () => {
    const result = validateFormSubmission("newsletter", {
      email: "a@b.com",
    })
    assert.equal(result.ok, false)
  })
})
