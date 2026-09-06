import { defineEventHandler, sendRedirect } from "h3"
import { resolveLegacyRedirect } from "~/server/utils/legacyRedirects"

export default defineEventHandler((event) => {
  const requestUrlString = event.node.req.url || ""
  const host = event.node.req.headers.host || "localhost"
  const requestUrl = new URL(requestUrlString, `http://${host}`)
  const target = resolveLegacyRedirect(requestUrl.pathname)

  if (target) {
    return sendRedirect(event, target, 301)
  }
})
