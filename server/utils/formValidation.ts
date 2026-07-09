export type TFormType = "pdf_handbook" | "contact" | "jahresabschluss" | "callback"

const REQUIRED_FIELDS: Record<TFormType, string[]> = {
  pdf_handbook: ["salutation", "lastName", "firstName", "email", "phone"],
  contact: ["salutation", "lastName", "firstName", "email", "message"],
  jahresabschluss: ["salutation", "lastName", "firstName", "email", "phone"],
  callback: ["lastName", "firstName", "phone"],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateFormSubmission(
  formType: string,
  fields: Record<string, string>,
): { ok: true; formType: TFormType } | { ok: false; message: string } {
  if (!(formType in REQUIRED_FIELDS)) {
    return { ok: false, message: "Unknown form type." }
  }

  const typedFormType = formType as TFormType
  const required = REQUIRED_FIELDS[typedFormType]

  for (const key of required) {
    const value = fields[key]?.trim()
    if (!value) {
      return { ok: false, message: `Missing required field: ${key}` }
    }
  }

  const email = fields.email?.trim()
  if (email && !EMAIL_RE.test(email)) {
    return { ok: false, message: "Invalid email address." }
  }

  return { ok: true, formType: typedFormType }
}

export function normalizeFields(fields: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(fields)) {
    normalized[key] = value.trim()
  }
  return normalized
}
