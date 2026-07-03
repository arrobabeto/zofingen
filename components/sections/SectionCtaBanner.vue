<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    background: string
    title: string
    body: string
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="relative w-full overflow-hidden">
    <img
      :src="background"
      alt=""
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <div
      class="relative mx-auto flex max-w-[1400px] flex-col px-6 pb-[64px] lg:px-[100px]"
    >
      <div
        class="flex flex-col items-center gap-8 rounded-b-[10px] bg-white/90 px-6 py-[64px] text-center lg:px-[120px]"
      >
        <SectionHeading :title="title" />
        <p
          class="max-w-[788px] whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ body }}
        </p>
        <SectionButton :label="ctaLabel" :href="ctaHref" />
      </div>
    </div>
  </section>
</template>
