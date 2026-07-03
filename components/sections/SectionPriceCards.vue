<script setup lang="ts">
  defineProps<{
    cards: {
      title: string
      currency: string
      price: string
      caption: string
      ctaLabel: string
      ctaHref?: string
    }[]
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-24 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-stretch justify-center gap-9 lg:flex-row"
    >
      <div
        v-for="(c, i) of cards"
        :key="i"
        class="relative flex w-full flex-col items-center gap-6 rounded-[10px] bg-brand-blue px-8 pb-16 pt-8 text-white lg:w-[582px]"
      >
        <p class="text-center font-serif text-[24px] font-bold">
          {{ c.title }}
        </p>
        <div class="flex items-end gap-3">
          <span class="font-serif text-[24px] font-bold leading-none">
            {{ c.currency }}
          </span>
          <span class="font-serif text-[96px] font-bold leading-[0.85]">
            {{ c.price }}
          </span>
        </div>
        <p class="text-center font-serif text-[18px] leading-[25px]">
          {{ c.caption }}
        </p>
        <a
          :href="c.ctaHref || '#'"
          class="absolute -bottom-8 inline-flex items-center justify-center rounded-[12px] bg-white px-8 py-5 text-center font-serif text-[18px] font-bold text-brand-blue transition hover:bg-brand-card"
        >
          {{ c.ctaLabel }}
        </a>
      </div>
    </div>
  </section>
</template>
