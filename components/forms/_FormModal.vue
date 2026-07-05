<script setup lang="ts">
  import { onMounted, onUnmounted, watch } from "vue"

  const p = defineProps<{ open: boolean }>()
  const emit = defineEmits<{ close: [] }>()

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && p.open) emit("close")
  }

  function onOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) emit("close")
  }

  watch(
    () => p.open,
    (open) => {
      if (process.client) {
        document.body.style.overflow = open ? "hidden" : ""
      }
    },
    { immediate: true },
  )

  onMounted(() => document.addEventListener("keydown", onKeydown))
  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown)
    if (process.client) document.body.style.overflow = ""
  })
</script>

<template>
  <Teleport to="body">
    <Transition name="form-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click="onOverlayClick"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="relative w-full max-w-[920px] rounded-[10px] bg-brand-light shadow-[2px_2px_5px_0px_rgba(0,0,0,0.15)]"
          @click.stop
        >
          <div class="flex items-start justify-end px-5 pb-2 pt-5 lg:px-8 lg:pt-6">
            <button
              type="button"
              aria-label="Schliessen"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-brand-blue font-serif text-[20px] leading-none text-brand-blue transition hover:bg-white/60"
              @click="emit('close')"
            >
              ×
            </button>
          </div>
          <div class="px-5 pb-8 pt-2 lg:px-10 lg:pb-10 lg:pt-0">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .form-modal-enter-active,
  .form-modal-leave-active {
    transition: opacity 0.2s ease;
  }

  .form-modal-enter-active > div:last-child,
  .form-modal-leave-active > div:last-child {
    transition: transform 0.2s ease;
  }

  .form-modal-enter-from,
  .form-modal-leave-to {
    opacity: 0;
  }

  .form-modal-enter-from > div:last-child,
  .form-modal-leave-to > div:last-child {
    transform: scale(0.97);
  }
</style>
