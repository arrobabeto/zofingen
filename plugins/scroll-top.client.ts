import { defineNuxtPlugin } from "#app"

/** Mobile Safari often keeps scroll after NuxtLink navigation — force top on page finish. */
export default defineNuxtPlugin((nuxtApp) => {
  function isMobile(): boolean {
    return window.matchMedia("(max-width: 1023px)").matches
  }

  function scrollToTop() {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  nuxtApp.hook("page:finish", () => {
    if (!isMobile()) return
    scrollToTop()
    requestAnimationFrame(() => {
      scrollToTop()
      // Layout/menu close can shift after first paint
      setTimeout(scrollToTop, 50)
    })
  })
})
