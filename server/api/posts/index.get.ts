import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const bindings = getQuery(event)
  const orderBy = String(bindings.orderBy ?? "created_at")
  const allowedOrderBy = new Set(["created_at", "updated_at", "id"])
  const safeOrderBy = allowedOrderBy.has(orderBy) ? orderBy : "created_at"
  const desc = bindings.desc === "true"
  const sortDirection = desc ? "DESC" : "ASC"

  let sql = "SELECT * FROM posts"
  const where: string[] = []
  if (bindings.id) where.push("id = :id")
  if (bindings.status) where.push(`"status"->>'value' = :status`)
  if (where.length > 0) sql += ` WHERE ${where.join(" AND ")}`

  // Keep ordering deterministic so offset pagination does not repeat rows.
  sql += ` ORDER BY ${safeOrderBy} ${sortDirection}, id ${sortDirection}`
  if (bindings.limit) sql += " LIMIT :limit"
  if (bindings.offset) sql += " OFFSET :offset"

  if (
    !import.meta.env.ORBITYPE_API_SQL_URL ||
    !import.meta.env.ORBITYPE_API_SQL_KEY
  ) {
    return bindings.id ? null : []
  }

  try {
    const rows: any = await $fetch(import.meta.env.ORBITYPE_API_SQL_URL, {
      method: "POST",
      headers: { "X-API-KEY": import.meta.env.ORBITYPE_API_SQL_KEY },
      body: { sql, bindings },
    })
    return bindings.id ? rows[0] : rows
  } catch {
    return bindings.id ? null : []
  }
})
