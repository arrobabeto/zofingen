<script setup lang="ts">
  withDefaults(
    defineProps<{
      title: string
      subtitle?: string
      align?: "center" | "left"
      invert?: boolean
      divider?: boolean
    }>(),
    { divider: true },
  )
</script>

<template>
  <div
    class="flex flex-col gap-4"
    :class="align === 'left' ? 'items-start' : 'items-center text-center'"
  >
    <h2
      class="whitespace-pre-line font-serif text-[42px] font-bold leading-[58px]"
      :class="invert ? 'text-white' : 'text-brand-blue'"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="font-serif text-[32px] leading-[42px]"
      :class="invert ? 'text-white' : 'text-brand-blue'"
    >
      {{ subtitle }}
    </p>
    <span
      v-if="divider"
      class="mt-1 block h-[4px] w-[67px]"
      :class="invert ? 'bg-white' : 'bg-brand-blue'"
    />
  </div>
</template>
