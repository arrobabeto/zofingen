<script setup lang="ts">
  defineProps<{
    label: string
    href?: string
    block?: boolean
    narrow?: boolean
    invert?: boolean
  }>()
</script>

<template>
  <a
    :href="href || '#'"
    class="inline-flex items-center justify-center rounded-[10px] px-8 py-5 text-center font-serif text-[18px] font-bold transition"
    :class="[
      invert
        ? 'border border-brand-blue bg-white text-brand-blue hover:bg-brand-card'
        : 'bg-brand-blue text-white hover:bg-brand-blue2',
      block ? 'w-[376px] max-w-full py-4' : '',
      narrow ? 'w-[271px] max-w-full py-4' : '',
    ]"
  >
    {{ label }}
  </a>
</template>
