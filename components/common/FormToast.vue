<script setup lang="ts">
  import { FormToast } from "~/services/FormToast"
</script>

<template>
  <Transition name="form-toast">
    <div
      v-if="FormToast.visible"
      role="status"
      aria-live="polite"
      class="pointer-events-none fixed bottom-6 left-1/2 z-[100] w-[calc(100%-3rem)] max-w-lg -translate-x-1/2 rounded-[10px] bg-brand-blue px-6 py-4 text-center font-serif text-[18px] leading-[25px] text-white shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
    >
      {{ FormToast.message }}
    </div>
  </Transition>
</template>

<style scoped>
  .form-toast-enter-active,
  .form-toast-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  .form-toast-enter-from,
  .form-toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 12px);
  }
</style>
