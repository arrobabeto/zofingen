import { createError, defineEventHandler, readBody } from "h3"
import { sendFormEmails } from "~/server/utils/formMailer"
import {
  buildMailerliteFields,
  getMailerliteFormConfig,
  hasMailerliteConsent,
} from "~/server/utils/mailerliteFormConfig"
import {
  isMailerliteConfigured,
  upsertSubscriberToGroups,
} from "~/server/utils/mailerliteClient"
import { toOrbitypeWebhookBody } from "~/server/utils/orbitypeFormPayload"
import {
  normalizeFields,
  validateFormSubmission,
} from "~/server/utils/formValidation"

type TSubmitBody = {
  formType?: string
  fields?: Record<string, string>
}

const SOURCE = "zofingen-treuhand.ch"

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as TSubmitBody

  if (!body.formType || typeof body.formType !== "string") {
    throw createError({ statusCode: 400, statusMessage: "formType is required." })
  }

  if (!body.fields || typeof body.fields !== "object") {
    throw createError({ statusCode: 400, statusMessage: "fields is required." })
  }

  const validation = validateFormSubmission(body.formType, body.fields)
  if (!validation.ok) {
    throw createError({ statusCode: 400, statusMessage: validation.message })
  }

  const submittedAt = new Date().toISOString()
  const fields = normalizeFields(body.fields)
  const payload = toOrbitypeWebhookBody(validation.formType, fields, {
    source: SOURCE,
    submittedAt,
  })

  const sendgridKey =
    import.meta.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY
  const webhookUrl =
    import.meta.env.ORBITYPE_FORM_WEBHOOK_URL ||
    process.env.ORBITYPE_FORM_WEBHOOK_URL

  if (!sendgridKey && !webhookUrl) {
    throw createError({
      statusCode: 503,
      statusMessage:
        "Form mailing is not configured. Set SENDGRID_API_KEY in the environment.",
    })
  }

  try {
    if (sendgridKey) {
      await sendFormEmails(payload, sendgridKey)
    } else if (webhookUrl) {
      await $fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })
    }
  } catch (err: unknown) {
    const fetchErr = err as {
      statusCode?: number
      statusMessage?: string
      data?: unknown
      message?: string
    }
    console.error("[forms/submit] Form mailing failed:", {
      via: sendgridKey ? "sendgrid" : "orbitype-webhook",
      formType: validation.formType,
      status: fetchErr.statusCode,
      message: fetchErr.statusMessage || fetchErr.message,
      data: fetchErr.data,
    })
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to submit form. Please try again later.",
    })
  }

  const mailerliteConfig = getMailerliteFormConfig(validation.formType)
  if (mailerliteConfig && hasMailerliteConsent(mailerliteConfig, fields)) {
    if (!isMailerliteConfigured()) {
      console.error("[forms/submit] MailerLite skipped: API key missing.", {
        formType: validation.formType,
        groupName: mailerliteConfig.groupName,
      })
    } else {
      const email = fields[mailerliteConfig.emailField]?.trim() || ""
      const result = await upsertSubscriberToGroups({
        email,
        fields: buildMailerliteFields(mailerliteConfig, fields),
        groupIds: [mailerliteConfig.groupId],
      })

      if (!result.ok) {
        // mixed / contact: lead already delivered via SendGrid — do not fail the request
        console.error("[forms/submit] MailerLite sync failed:", {
          formType: validation.formType,
          groupName: mailerliteConfig.groupName,
          status: result.status,
          message: result.message,
        })
      }
    }
  }

  return { ok: true }
})
