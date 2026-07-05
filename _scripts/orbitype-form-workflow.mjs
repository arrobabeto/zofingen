/**
 * Orbitype Workflow: "Zofingen — Form Submissions"
 *
 * Setup in Orbitype dashboard:
 * 1. Create workflow with Webhook trigger
 * 2. Copy webhook URL → ORBITYPE_FORM_WEBHOOK_URL in .env
 * 3. Paste node code below into Code nodes
 * 4. Configure SMTP credentials in workspace Settings → Credentials
 * 5. Activate workflow after manual test
 *
 * Test payload:
 * {
 *   "formType": "pdf_handbook",
 *   "source": "zofingen-treuhand.ch",
 *   "submittedAt": "2026-07-05T17:00:00Z",
 *   "fields": {
 *     "salutation": "Herr",
 *     "lastName": "Muster",
 *     "firstName": "Max",
 *     "email": "max@example.com",
 *     "phone": "+41 79 000 00 00"
 *   }
 * }
 */

export const ORBITYPE_WORKFLOW_NODES = {
  FormatSubmission: `
async ({ input }) => {
  const fields = input.fields || {}
  const formType = input.formType || "unknown"
  const source = input.source || "zofingen-treuhand.ch"
  const submittedAt = input.submittedAt || new Date().toISOString()

  const lines = Object.entries(fields).map(([key, value]) => \`\${key}: \${value}\`)
  const formatted = [
    \`Formular: \${formType}\`,
    \`Quelle: \${source}\`,
    \`Eingegangen: \${submittedAt}\`,
    "",
    ...lines,
  ].join("\\n")

  const notifySender = formType === "contact" || formType === "jahresabschluss"

  return {
    output: {
      formatted,
      formType,
      email: fields.email || "",
      notifySender,
      fields,
      source,
      submittedAt,
    },
  }
}
`,

  NotifyAdmin: `
async ({ input, config, nodemailer }) => {
  const adminEmail = config.adminEmail || "it@bexolutions.ch"
  const subject = \`[Zofingen] Neue Anfrage: \${input.formType}\`

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort || 587),
    secure: config.smtpSecure === "true",
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  await transporter.sendMail({
    from: config.smtpFrom || config.smtpUser,
    to: adminEmail,
    subject,
    text: input.formatted,
  })

  return { output: { sent: true, to: adminEmail } }
}
`,

  NotifySender: `
async ({ input, config, nodemailer }) => {
  if (!input.notifySender || !input.email) {
    return { output: { skipped: true } }
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort || 587),
    secure: config.smtpSecure === "true",
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  await transporter.sendMail({
    from: config.smtpFrom || config.smtpUser,
    to: input.email,
    subject: "Vielen Dank für Ihre Anfrage — Zofingen Treuhand AG",
    text: "Vielen Dank, wir haben Ihre Nachricht erhalten! Wir melden uns in Kürze bei Ihnen.",
  })

  return { output: { sent: true, to: input.email } }
}
`,
}
