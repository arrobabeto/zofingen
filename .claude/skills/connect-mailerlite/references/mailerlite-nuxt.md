# MailerLite + Nuxt forms (Zofingen)

Reference for `connect-mailerlite`. Keep `SKILL.md` short; put API/registry detail here.

## Architecture

```
Vue form → useFormSubmit → POST /api/forms/submit
  → validate + normalize
  → SendGrid (or Orbitype webhook fallback)   // transactional
  → if formType in mailerliteFormConfig (+ consent)
       → upsertSubscriberToGroups (MailerLite API)
```

- **API key:** `MAILERLITE_API_KEY` only (server env). Never `NUXT_PUBLIC_*`.
- **Group ID:** per-form entry in `server/utils/mailerliteFormConfig.ts`. Not in `.env`.
- **Unlisted formTypes:** zero MailerLite calls.

## Official API (verify before each implementation)

Docs: [Subscribers](https://developers.mailerlite.com/docs/subscribers)

- Base: `https://connect.mailerlite.com/api`
- Auth: `Authorization: Bearer <MAILERLITE_API_KEY>`
- Upsert: `POST /subscribers` with `{ email, fields?, groups? }`
- Upsert is non-destructive; omitting groups does not remove existing ones; listing groups adds the subscriber to them
- Do **not** send `resubscribe: true` or force `status: "active"` unless explicitly approved
- Success: `201` created, `200` updated

Default field keys often include: `name`, `last_name`, `phone`, `company`. Custom fields must use MailerLite internal keys.

## Registry shape

```ts
pdf_handbook: {
  groupId: "118335752483374916",
  groupName: "PDF Firmengründungshandbuch",
  emailField: "email",
  fieldMapping: {
    firstName: "name",
    lastName: "last_name",
    phone: "phone",
  },
  // consentField: "marketingConsent", // optional
  failurePolicy: "mixed",
}
```

Extract group ID from dashboard URLs: `...&group=118335752483374916`.

## Failure policies

| Policy | Primary | MailerLite fails | SendGrid fails |
|--------|---------|------------------|----------------|
| `contact` / `mixed` | SendGrid | Log; still return `{ ok: true }` to user | 502 to user |
| `newsletter` | MailerLite | Do not claim success | Usually N/A |

`pdf_handbook` uses `mixed`: PDF lead email is primary; ML powers the group/automation.

## Logging

Log `formType`, `groupName`, status code, safe message. Never log API keys, full payloads, or emails in production logs if avoidable.

## Tests

- Mock `globalThis.fetch`; assert URL, Bearer header, body has `groups`, no `resubscribe`/`status`
- Assert `getMailerliteFormConfig("contact") === undefined`
- CI must not call real MailerLite (no key or mocked fetch)

## Vercel

Set `MAILERLITE_API_KEY` in the environments where sync should run. Group IDs ship with the code registry.
