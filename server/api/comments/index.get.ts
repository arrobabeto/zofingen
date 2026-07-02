import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const bindings = getQuery(event)

  let sql = "SELECT * FROM comments"
  if (bindings.post_id) sql += " WHERE post_id = :post_id"
  sql += " ORDER BY created_at DESC"

  return await $fetch(import.meta.env.ORBITYPE_API_SQL_URL, {
    method: "POST",
    headers: { "X-API-KEY": import.meta.env.ORBITYPE_API_SQL_KEY },
    body: { sql, bindings },
  })
})
