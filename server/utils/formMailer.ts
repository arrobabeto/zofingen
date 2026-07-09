import type { TOrbitypeWebhookBody } from "~/server/utils/orbitypeFormPayload"

const FROM = {
  email: "kontakt@zofingen-treuhand.ch",
  name: "Zofingen Treuhand",
} as const

export const FORM_NOTIFY_EMAILS = [
  "kontakt@zofingen-treuhand.ch",
  "alberto.bexolutions@gmail.com",
] as const

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function buildAdminHtml(payload: TOrbitypeWebhookBody): string {
  return [
    "<h2>Neue Website-Anfrage</h2>",
    `<p><strong>Formular:</strong> ${escapeHtml(payload.formType)}</p>`,
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>E-Mail:</strong> ${escapeHtml(payload.submitterEmail)}</p>`,
    `<p><strong>Telefon:</strong> ${escapeHtml(payload.phone)}</p>`,
    `<p><strong>Betreff:</strong> ${escapeHtml(payload.subject)}</p>`,
    `<pre>${escapeHtml(payload.message)}</pre>`,
  ].join("")
}

async function sendGridMail(
  apiKey: string,
  options: {
    to: { email: string; name?: string }[]
    subject: string
    html: string
  },
): Promise<void> {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: options.to }],
      from: FROM,
      subject: options.subject,
      content: [{ type: "text/html", value: options.html }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SendGrid failed (${res.status}): ${err}`)
  }
}

export async function sendAdminFormNotification(
  payload: TOrbitypeWebhookBody,
  apiKey: string,
): Promise<void> {
  await sendGridMail(apiKey, {
    to: payload.notifyTo.map((email) => ({ email, name: "Zofingen Admin" })),
    subject: `[Zofingen] ${payload.subject}`,
    html: buildAdminHtml(payload),
  })
}

export async function sendSubmitterConfirmation(
  payload: TOrbitypeWebhookBody,
  apiKey: string,
): Promise<void> {
  const submitter = payload.submitterEmail.trim()
  const adminEmails = new Set<string>(FORM_NOTIFY_EMAILS)
  if (!submitter || adminEmails.has(submitter)) {
    return
  }

  await sendGridMail(apiKey, {
    to: [{ email: submitter, name: payload.name }],
    subject: "Wir haben Ihre Anfrage erhalten",
    html: "<p>Vielen Dank, wir haben Ihre Nachricht erhalten. Wir melden uns in Kürze bei Ihnen.</p>",
  })
}

export async function sendFormEmails(
  payload: TOrbitypeWebhookBody,
  apiKey: string,
): Promise<void> {
  await sendAdminFormNotification(payload, apiKey)
  await sendSubmitterConfirmation(payload, apiKey)
}
