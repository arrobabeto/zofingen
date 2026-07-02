import type { Ref } from "vue"
import { useEventListener } from "~/composables/useEventListener"

export function useClickOutside(el: Ref<HTMLElement | null>, fn: () => void) {
  useEventListener(window, "mousedown", (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!el.value?.contains(target)) fn()
  })
}
