import { defineNuxtRouteMiddleware, navigateTo } from "#app"

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: "PageView",
    page: to.fullPath, // Der vollständige Pfad der neuen Route
    page_title: document.title, // Seitentitel nach Aktualisierung
    referrer: from.fullPath || document.referrer, // Referrer-Pfad
  })
})
