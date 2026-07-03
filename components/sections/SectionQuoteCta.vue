<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  defineProps<{
    quote: string
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full px-6 pb-16 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center gap-[57px] border-y border-brand-blue py-[57px]"
    >
      <p
        class="text-center font-serif text-[24px] font-bold italic leading-[32px] text-brand-blue"
      >
        {{ quote }}
      </p>
      <SectionButton :label="ctaLabel" :href="ctaHref" />
    </div>
  </section>
</template>
