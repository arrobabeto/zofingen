import { onMounted, onUnmounted } from "vue"

export function useEventListener(
  target: EventTarget,
  type: keyof WindowEventMap,
  listener: (e?: any) => void,
) {
  onMounted(() => target.addEventListener(type, listener))
  onUnmounted(() => target.removeEventListener(type, listener))
}
