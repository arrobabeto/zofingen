const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api"
const DEFAULT_TIMEOUT_MS = 10_000

export type TMailerliteSubscriberFields = Record<string, string>

export type TUpsertSubscriberInput = {
  email: string
  fields?: TMailerliteSubscriberFields
  groupIds: string[]
}

export type TMailerliteResult =
  | { ok: true; status: number }
  | { ok: false; status?: number; message: string }

function getApiKey(): string | undefined {
  const fromImportMeta =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env.MAILERLITE_API_KEY === "string"
      ? import.meta.env.MAILERLITE_API_KEY
      : undefined
  const key = fromImportMeta || process.env.MAILERLITE_API_KEY
  return typeof key === "string" && key.trim() ? key.trim() : undefined
}

export function isMailerliteConfigured(): boolean {
  return Boolean(getApiKey())
}

/**
 * Create or update a subscriber and add them to the given groups.
 * Does not send `status`, `resubscribe`, or force reactivation.
 * @see https://developers.mailerlite.com/docs/subscribers
 */
export async function upsertSubscriberToGroups(
  input: TUpsertSubscriberInput,
  options?: { timeoutMs?: number },
): Promise<TMailerliteResult> {
  const apiKey = getApiKey()
  if (!apiKey) {
    return { ok: false, message: "MAILERLITE_API_KEY is not configured." }
  }

  if (!input.email.trim()) {
    return { ok: false, message: "email is required." }
  }

  if (!input.groupIds.length) {
    return { ok: false, message: "At least one group id is required." }
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: input.email.trim(),
        fields: input.fields,
        groups: input.groupIds,
      }),
      signal: controller.signal,
    })

    if (res.ok) {
      return { ok: true, status: res.status }
    }

    const bodyText = await res.text().catch(() => "")
    return {
      ok: false,
      status: res.status,
      message: bodyText
        ? `MailerLite failed (${res.status})`
        : `MailerLite failed (${res.status}) with empty body`,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "MailerLite request timed out."
        : err instanceof Error
          ? err.message
          : "MailerLite request failed."
    return { ok: false, message }
  } finally {
    clearTimeout(timer)
  }
}
