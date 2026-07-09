import type { TFormType } from "~/server/utils/formValidation"

export type TOrbitypeFormMeta = {
  source: string
  submittedAt: string
}

export type TOrbitypeWebhookBody = {
  email: string
  name: string
  phone: string
  subject: string
  message: string
  formType: TFormType
  source: string
  submittedAt: string
  fields: Record<string, string>
}

const SUBJECTS: Record<TFormType, string> = {
  pdf_handbook: "Anfrage: Firmengründungshandbuch (PDF)",
  contact: "Kontaktanfrage",
  jahresabschluss: "Anfrage: Jahresabschluss",
  callback: "Rückruf-Anfrage",
}

function buildDisplayName(fields: Record<string, string>): string {
  const parts = [fields.salutation, fields.firstName, fields.lastName].filter(
    Boolean,
  )
  const joined = parts.join(" ").trim()
  if (joined) return joined
  const legacy = fields.fullName?.trim() || fields.name?.trim()
  return legacy || "(not provided)"
}

function buildMessage(
  formType: TFormType,
  fields: Record<string, string>,
  meta: TOrbitypeFormMeta,
): string {
  const lines = [
    `Formular: ${formType}`,
    `Quelle: ${meta.source}`,
    `Eingegangen: ${meta.submittedAt}`,
    "",
    ...Object.entries(fields).map(([key, value]) => `${key}: ${value}`),
  ]
  return lines.join("\n")
}

export function toOrbitypeWebhookBody(
  formType: TFormType,
  fields: Record<string, string>,
  meta: TOrbitypeFormMeta,
): TOrbitypeWebhookBody {
  const email = fields.email?.trim()
  const phone = fields.phone?.trim() || "(not provided)"

  return {
    email: email || "kontakt@zofingen-treuhand.ch",
    name: buildDisplayName(fields),
    phone,
    subject: SUBJECTS[formType],
    message: buildMessage(formType, fields, meta),
    formType,
    source: meta.source,
    submittedAt: meta.submittedAt,
    fields,
  }
}
