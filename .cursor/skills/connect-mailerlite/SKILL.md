---
name: connect-mailerlite
description: >-
  Connect a specific Nuxt form in this project to a MailerLite group via the
  server-side API. Use when wiring a selected formType to MailerLite, adding
  group sync, or extending mailerliteFormConfig. Does not replace SendGrid;
  only the form named by the user is connected; never expose API keys.
---

# Connect MailerLite

Wire **one** selected form to MailerLite (create/update subscriber + add to group).
SendGrid stays the transactional path. Other forms must not gain MailerLite as a side effect.

## When to use

- User asks to connect a form (component, URL, or `formType`) to a MailerLite group
- Extending or auditing an existing MailerLite form entry

## When not to use

- Global “connect all forms”
- Storing `MAILERLITE_API_KEY` in client, Orbitype, or `runtimeConfig.public`
- Putting group IDs in `.env` (they belong in the per-form registry)
- Pasting secrets into chat

## Prerequisites

- Read `CLAUDE.md` and existing form flow (`useFormSubmit` → `POST /api/forms/submit`)
- Read [references/mailerlite-nuxt.md](references/mailerlite-nuxt.md) for API + registry details
- Confirm `MAILERLITE_API_KEY` is set in env (check name only; never log the value)

## Resolve the target form

1. Identify by `formType`, component path, or page URL.
2. If zero matches → stop; list what the future form must provide; do not invent a form unless asked.
3. If multiple matches → stop and ask which one.
4. Inspect component fields, validation, and whether SendGrid already runs.

## Required decisions (ask only if unresolved)

- MailerLite **group ID** (dashboard URL `group=` query is fine) → store in registry, not env
- Purpose / failure policy: `contact` | `newsletter` | `mixed`
- Field whitelist + MailerLite field keys
- Consent field (or explicit “submission is consent” for lead magnets)
- No `resubscribe` / no forced `status: active` unless user explicitly authorizes

## Implementation checklist

1. Verify current MailerLite subscriber API docs.
2. Add or update entry in `server/utils/mailerliteFormConfig.ts` only for that `formType`.
3. Keep shared client in `server/utils/mailerliteClient.ts`.
4. Call MailerLite from `server/api/forms/submit.post.ts` only when config exists (+ consent).
5. Preserve SendGrid / webhook behavior; handle ML errors per failure policy.
6. Document `MAILERLITE_API_KEY` in `.env.example` (no group IDs).
7. Add/update unit tests with mocked `fetch` (no production writes).
8. Confirm other `formType`s are unchanged.
9. Summarize: files changed, Vercel env still needed (`MAILERLITE_API_KEY`), how to smoke-test.

## Current connected forms

| formType | Component | Group (registry) | Failure policy |
|----------|-----------|------------------|----------------|
| `pdf_handbook` | `components/forms/_PdfHandbookForm.vue` | PDF Firmengründungshandbuch | `mixed` |
