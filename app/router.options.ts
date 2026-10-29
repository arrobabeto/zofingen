import type { RouterConfig } from "@nuxt/schema"

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(max-width: 1023px)").matches
}

function scrollToTop() {
  if (typeof window === "undefined") return
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export default {
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 96,
        behavior: "smooth",
      }
    }

    // Browser back/forward: restore position (desktop UX). On mobile always reset.
    if (savedPosition && !isMobileViewport()) {
      return savedPosition
    }

    // Mobile Safari often ignores the returned position — force sync scroll.
    if (import.meta.client && isMobileViewport()) {
      scrollToTop()
      requestAnimationFrame(scrollToTop)
    }

    return { top: 0, left: 0 }
  },
} satisfies RouterConfig
