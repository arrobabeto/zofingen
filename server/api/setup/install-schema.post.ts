import { createError, defineEventHandler, readBody } from "h3"
import {
  CMS_SCHEMA_SQL_SAFE,
  type TCmsSchemaTable,
} from "~/server/utils/cmsSchema"

type TInstallBody = {
  table?: TCmsSchemaTable | "all"
}

type TInstallResult = {
  table: TCmsSchemaTable
  status: "ok" | "error"
  error?: string
}

const TABLES: TCmsSchemaTable[] = ["pages", "posts", "settings"]
const ORBITYPE_API_KEYS_URL = "https://app.orbitype.com/settings/api-keys"

function getTablesToInstall(table?: TInstallBody["table"]): TCmsSchemaTable[] {
  if (!table || table === "all") return TABLES
  return TABLES.includes(table) ? [table] : []
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as TInstallBody
  const requestedTables = getTablesToInstall(body.table)

  if (requestedTables.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unknown table selection.",
    })
  }

  if (
    !import.meta.env.ORBITYPE_API_SQL_URL ||
    !import.meta.env.ORBITYPE_API_SQL_KEY
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing ORBITYPE_API_SQL_URL or ORBITYPE_API_SQL_KEY in environment. Create/find your SQL API key at ${ORBITYPE_API_KEYS_URL}`,
    })
  }

  const results: TInstallResult[] = []

  for (const table of requestedTables) {
    try {
      await $fetch(import.meta.env.ORBITYPE_API_SQL_URL, {
        method: "POST",
        headers: { "X-API-KEY": import.meta.env.ORBITYPE_API_SQL_KEY },
        body: { sql: CMS_SCHEMA_SQL_SAFE[table], bindings: {} },
      })
      results.push({ table, status: "ok" })
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ??
        error?.statusMessage ??
        error?.message ??
        "Unknown error while creating table."
      results.push({ table, status: "error", error: String(errorMessage) })
    }
  }

  const hasErrors = results.some((x) => x.status === "error")

  return {
    ok: !hasErrors,
    message: hasErrors
      ? "Schema installation finished with errors."
      : "Schema installed successfully.",
    results,
  }
})
