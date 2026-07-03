<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  defineProps<{
    title?: string
    body: string
    image: string
    reverse?: boolean
    ctaLabel?: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:gap-[71px]"
      :class="reverse ? 'lg:flex-row-reverse' : ''"
    >
      <div class="flex w-full flex-col items-start gap-8 lg:w-[547px]">
        <template v-if="title">
          <h2
            class="whitespace-pre-line font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
          >
            {{ title }}
          </h2>
          <span class="block h-[4px] w-[67px] bg-brand-blue" />
        </template>
        <div
          class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ body }}
        </div>
        <SectionButton
          v-if="ctaLabel"
          :label="ctaLabel"
          :href="ctaHref"
        />
      </div>
      <div class="w-full shrink-0 lg:h-[413px] lg:w-[582px]">
        <img
          :src="image"
          alt=""
          class="h-[260px] w-full rounded-[10px] object-cover lg:h-full"
        />
      </div>
    </div>
  </section>
</template>
