import type { TFormType } from "~/server/utils/formValidation"
import type { TMailerliteSubscriberFields } from "~/server/utils/mailerliteClient"

export type TMailerliteFailurePolicy = "contact" | "newsletter" | "mixed"

export type TMailerliteFormConfig = {
  groupId: string
  groupName?: string
  /** Form field key that holds the email (required). */
  emailField: string
  /**
   * Map form field keys → MailerLite field keys (defaults: name, last_name, phone, …).
   * Only listed fields are synced.
   */
  fieldMapping: Record<string, string>
  /**
   * When set, MailerLite runs only if this form field is a truthy consent value.
   * When omitted, submission itself is treated as sufficient for this lead-magnet form.
   */
  consentField?: string
  failurePolicy: TMailerliteFailurePolicy
}

/**
 * Allowlist of form types connected to MailerLite.
 * Forms not listed here never call MailerLite.
 */
const MAILERLITE_FORMS: Partial<Record<TFormType, TMailerliteFormConfig>> = {
  pdf_handbook: {
    groupId: "118335752483374916",
    groupName: "PDF Firmengründungshandbuch",
    emailField: "email",
    fieldMapping: {
      firstName: "name",
      lastName: "last_name",
      phone: "phone",
    },
    failurePolicy: "mixed",
  },
}

export function getMailerliteFormConfig(
  formType: TFormType,
): TMailerliteFormConfig | undefined {
  return MAILERLITE_FORMS[formType]
}

export function buildMailerliteFields(
  config: TMailerliteFormConfig,
  fields: Record<string, string>,
): TMailerliteSubscriberFields {
  const mapped: TMailerliteSubscriberFields = {}
  for (const [formKey, mailerliteKey] of Object.entries(config.fieldMapping)) {
    const value = fields[formKey]?.trim()
    if (value) mapped[mailerliteKey] = value
  }
  return mapped
}

export function hasMailerliteConsent(
  config: TMailerliteFormConfig,
  fields: Record<string, string>,
): boolean {
  if (!config.consentField) return true
  const raw = fields[config.consentField]?.trim().toLowerCase()
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on"
}
