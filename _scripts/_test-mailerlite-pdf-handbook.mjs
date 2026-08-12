// Controlled MailerLite smoke test for the pdf_handbook group.
// Usage: node _scripts/_test-mailerlite-pdf-handbook.mjs
// Requires MAILERLITE_API_KEY in .env. Creates one disposable subscriber, verifies group membership.
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const env = Object.fromEntries(
  readFileSync(join(root, ".env"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]
    }),
)

const API_KEY = env.MAILERLITE_API_KEY
const GROUP_ID = "118335752483374916"
const GROUP_NAME = "PDF Firmengründungshandbuch"
const stamp = Date.now()
const testEmail = `mailerlite-smoke+${stamp}@zofingen-treuhand.ch`

if (!API_KEY) {
  console.error("FAIL: MAILERLITE_API_KEY is not set in .env")
  process.exit(1)
}

async function ml(path, { method = "GET", body } = {}) {
  const res = await fetch(`https://connect.mailerlite.com/api${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }
  return { status: res.status, ok: res.ok, json }
}

console.log("Target group:", GROUP_NAME, GROUP_ID)
console.log("Test email:", testEmail)

const upsert = await ml("/subscribers", {
  method: "POST",
  body: {
    email: testEmail,
    fields: {
      name: "Smoke",
      last_name: "Test",
      phone: "+41 00 000 00 00",
    },
    groups: [GROUP_ID],
  },
})

if (!upsert.ok) {
  console.error("FAIL upsert:", upsert.status, upsert.json)
  process.exit(1)
}

console.log("Upsert:", upsert.status, "subscriber", upsert.json?.data?.id)

const fetched = await ml(
  `/subscribers/${encodeURIComponent(testEmail)}?include=groups`,
)
if (!fetched.ok) {
  console.error("FAIL fetch:", fetched.status, fetched.json)
  process.exit(1)
}

const groupIds = (fetched.json?.data?.groups || []).map((g) => String(g.id))
const inGroup = groupIds.includes(GROUP_ID)

console.log("Groups:", groupIds)
if (!inGroup) {
  console.error("FAIL: subscriber not in target group")
  process.exit(1)
}

console.log("PASS: connection OK; subscriber is in the PDF handbook group.")
console.log(
  "Note: delete the smoke subscriber in MailerLite if you do not want to keep it.",
)
