<script setup lang="ts">
  import { onMounted, onUnmounted, watch } from "vue"

  const p = defineProps<{
    open: boolean
    src: string
    alt?: string
  }>()
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
    <Transition name="image-lightbox">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        @click="onOverlayClick"
      >
        <button
          type="button"
          aria-label="Schliessen"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded border border-white font-serif text-2xl text-white transition hover:bg-white/10"
          @click="emit('close')"
        >
          ×
        </button>
        <img
          :src="src"
          :alt="alt ?? ''"
          class="max-h-[90vh] max-w-full object-contain"
          @click.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .image-lightbox-enter-active,
  .image-lightbox-leave-active {
    transition: opacity 0.2s ease;
  }

  .image-lightbox-enter-from,
  .image-lightbox-leave-to {
    opacity: 0;
  }
</style>
