<script setup lang="ts">
  defineOptions({ inheritAttrs: false })

  const p = defineProps<{
    disabled?: boolean
    submit?: boolean
  }>()
</script>

<template>
  <button
    v-bind="$attrs"
    :type="submit ? 'submit' : 'button'"
    :disabled="disabled"
    class="h-10 rounded-xl border border-[#e0e0e0] bg-[#fefefe] px-3 text-center text-sm font-medium text-[#010101] transition hover:bg-[#f6f6f6] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#282a36] dark:bg-[#191a22] dark:text-[#fefefe] dark:hover:bg-[#22232b]"
  >
    <slot />
  </button>
</template>
