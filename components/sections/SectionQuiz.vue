<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  defineProps<{
    intro: string
    cards: {
      title: string
      duration: string
      body: string
      highlight?: boolean
    }[]
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1272px] flex-col items-center gap-16">
      <p
        class="w-full max-w-[982px] self-start font-serif text-[28px] leading-[32px] text-brand-blue"
      >
        {{ intro }}
      </p>

      <div class="flex w-full flex-wrap justify-center gap-9">
        <div
          v-for="(c, i) of cards"
          :key="i"
          class="flex h-[342px] w-[355px] max-w-full flex-col items-center gap-3 rounded-[28px] px-4 pb-[86px] pt-[63px] text-center"
          :class="
            c.highlight ? 'bg-[#1b426b] text-white' : 'bg-[#c4d2e0] text-brand-blue'
          "
        >
          <p class="font-serif text-[28px] font-bold leading-[32px]">
            {{ c.title }}
          </p>
          <p class="font-serif text-[24px] leading-[25px]">
            {{ c.duration }}
          </p>
          <p class="max-w-[322px] font-serif text-[20px] leading-[25px]">
            {{ c.body }}
          </p>
        </div>
      </div>

      <SectionButton :label="ctaLabel" :href="ctaHref" block />
    </div>
  </section>
</template>
