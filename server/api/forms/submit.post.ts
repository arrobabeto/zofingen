import { createError, defineEventHandler, readBody } from "h3"
import {
  normalizeFields,
  validateFormSubmission,
} from "~/server/utils/formValidation"

type TSubmitBody = {
  formType?: string
  fields?: Record<string, string>
}

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

  const webhookUrl = import.meta.env.ORBITYPE_FORM_WEBHOOK_URL
  if (!webhookUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: "Form webhook is not configured.",
    })
  }

  const payload = {
    formType: validation.formType,
    source: "zofingen-treuhand.ch",
    submittedAt: new Date().toISOString(),
    fields: normalizeFields(body.fields),
  }

  try {
    await $fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to submit form. Please try again later.",
    })
  }

  return { ok: true }
})
