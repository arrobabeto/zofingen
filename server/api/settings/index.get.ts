import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const bindings = getQuery(event)

  const sql = "SELECT data FROM settings WHERE id = :id"

  const rows: any = await $fetch(import.meta.env.ORBITYPE_API_SQL_URL, {
    method: "POST",
    headers: { "X-API-KEY": import.meta.env.ORBITYPE_API_SQL_KEY },
    body: { sql, bindings },
  })
  return rows[0].data
})
