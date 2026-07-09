/**
 * Orbitype Workflow: "Website form to SendGrid email"
 *
 * Workflow ID: becbdc8b-cd2a-4d16-aac7-0a764650b30a
 * Credential: sendgrid (stored in Orbitype project credentials)
 *
 * IMPORTANT — recipient routing:
 * - `submitterEmail` = person who filled the form (confirmation only)
 * - `notifyTo` = admin inboxes (form details notification)
 * - `email` = legacy alias for first admin address (do NOT use for submitter)
 *
 * Setup in Orbitype dashboard:
 * 1. Open workflow "Website form to SendGrid email"
 * 2. Add/configure Webhook trigger → copy URL to ORBITYPE_FORM_WEBHOOK_URL
 * 3. Wire: Webhook → ReceiveFormSubmission → NotifyAdmins → SendConfirmationToSubmitter
 * 4. Manual test, then enable workflow
 *
 * Preferred (Vercel): set SENDGRID_API_KEY — site sends mail directly, skip webhook.
 *
 * Test payload:
 * {
 *   "submitterEmail": "max@example.com",
 *   "notifyTo": ["kontakt@zofingen-treuhand.ch", "alberto.bexolutions@gmail.com"],
 *   "email": "kontakt@zofingen-treuhand.ch",
 *   "name": "Herr Max Muster",
 *   "phone": "+41 79 000 00 00",
 *   "subject": "Anfrage: Firmengründungshandbuch (PDF)",
 *   "message": "Formular: pdf_handbook\n...",
 *   "formType": "pdf_handbook",
 *   "source": "zofingen-treuhand.ch",
 *   "submittedAt": "2026-07-09T12:00:00.000Z",
 *   "fields": { "salutation": "Herr", "lastName": "Muster", ... }
 * }
 */

export const ORBITYPE_WORKFLOW_NODES = {
  ReceiveFormSubmission: `
// Node 1 — "Receive form submission" (entry)
async ({ input }) => {
  const submitterEmail = (input.submitterEmail || input.email || "").trim()
  const notifyTo = Array.isArray(input.notifyTo) && input.notifyTo.length
    ? input.notifyTo
    : ["kontakt@zofingen-treuhand.ch", "alberto.bexolutions@gmail.com"]

  if (!submitterEmail && !notifyTo.length) {
    return { output: { ok: false, error: "Missing submitterEmail / notifyTo" } }
  }

  return {
    output: {
      ok: true,
      name: input.name || input.fullName || "(not provided)",
      submitterEmail: submitterEmail || notifyTo[0],
      notifyTo,
      email: notifyTo[0],
      phone: input.phone || "(not provided)",
      subject: input.subject || "New website form submission",
      message: input.message || input.text || "(no message)",
      formType: input.formType || "unknown",
      source: input.source || "zofingen-treuhand.ch",
      submittedAt: input.submittedAt || new Date().toISOString(),
      fields: input.fields || {},
    },
  }
}
`,

  NotifyAdmins: `
// Node 2 — "Notify admins" (SendGrid) — form details to office inboxes
async ({ input, orbi }) => {
  if (!input.ok) return { output: input }

  const apiKey = orbi.project.credentials.find((c) => c.name === "sendgrid")?.value
  if (!apiKey) throw new Error("SendGrid credential not found")

  const recipients = input.notifyTo || ["kontakt@zofingen-treuhand.ch", "alberto.bexolutions@gmail.com"]
  const html = [
    "<h2>Neue Website-Anfrage</h2>",
    "<p><strong>Formular:</strong> " + (input.formType || "unknown") + "</p>",
    "<p><strong>Name:</strong> " + input.name + "</p>",
    "<p><strong>E-Mail:</strong> " + input.submitterEmail + "</p>",
    "<p><strong>Telefon:</strong> " + input.phone + "</p>",
    "<p><strong>Betreff:</strong> " + input.subject + "</p>",
    "<pre>" + (input.message || "").replace(/</g, "&lt;") + "</pre>",
  ].join("")

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{
        to: recipients.map((email) => ({ email, name: "Zofingen Admin" })),
      }],
      from: { email: "kontakt@zofingen-treuhand.ch", name: "Zofingen Treuhand" },
      subject: "[Zofingen] " + (input.subject || "Neue Anfrage"),
      content: [{ type: "text/html", value: html }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("SendGrid admin notify failed:", err)
    return { output: { ...input, ownerNotified: false } }
  }

  return { output: { ...input, ownerNotified: true } }
}
`,

  SendConfirmationToSubmitter: `
// Node 3 — "Send confirmation to submitter" (SendGrid) — short thank-you only
async ({ input, orbi }) => {
  if (!input.ok) return { output: input }

  const submitter = (input.submitterEmail || "").trim()
  const adminSet = new Set(input.notifyTo || ["kontakt@zofingen-treuhand.ch", "alberto.bexolutions@gmail.com"])
  if (!submitter || adminSet.has(submitter)) {
    return { output: { ...input, confirmationSent: false } }
  }

  const apiKey = orbi.project.credentials.find((c) => c.name === "sendgrid")?.value
  if (!apiKey) throw new Error("SendGrid credential not found")

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: submitter, name: input.name }] }],
      from: { email: "kontakt@zofingen-treuhand.ch", name: "Zofingen Treuhand" },
      subject: "Wir haben Ihre Anfrage erhalten",
      content: [{
        type: "text/html",
        value: "<p>Vielen Dank, wir haben Ihre Nachricht erhalten. Wir melden uns in Kürze bei Ihnen.</p>",
      }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("SendGrid confirmation failed:", err)
    return { output: { ...input, confirmationSent: false } }
  }

  return { output: { ...input, confirmationSent: true } }
}
`,
}

export const ORBITYPE_SETUP_CHECKLIST = [
  "Preferred: set SENDGRID_API_KEY on Vercel (site sends admin + confirmation mail directly)",
  "Fallback: enable Webhook trigger on workflow becbdc8b-cd2a-4d16-aac7-0a764650b30a",
  "Set ORBITYPE_FORM_WEBHOOK_URL only when not using SENDGRID_API_KEY",
  "Wire: Webhook → ReceiveFormSubmission → NotifyAdmins → SendConfirmationToSubmitter",
  "Do NOT send form details to input.submitterEmail — only to notifyTo / admin addresses",
  "Verify SendGrid sender kontakt@zofingen-treuhand.ch is verified",
  "Test PDF form on site + Kontakt form on /kontakt",
]
