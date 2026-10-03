import { defineEventHandler, sendRedirect } from "h3"
import { resolveRequestRedirect } from "~/server/utils/legacyRedirects"
import { getSiteUrl } from "~/server/utils/siteUrl"

export default defineEventHandler((event) => {
  const requestUrlString = event.node.req.url || ""
  const host = event.node.req.headers.host || "localhost"
  const requestUrl = new URL(requestUrlString, `http://${host}`)
  const location = resolveRequestRedirect(
    host,
    requestUrl.pathname,
    requestUrl.search,
    getSiteUrl(),
  )

  if (location) {
    return sendRedirect(event, location, 301)
  }
})
