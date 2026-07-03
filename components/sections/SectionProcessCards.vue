<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    intro: string
    steps: { title: string; items: string[] }[]
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-11">
      <div class="flex w-full max-w-[994px] flex-col items-center gap-6">
        <SectionHeading :title="title" />
        <p
          class="text-center font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ intro }}
        </p>
      </div>

      <div class="flex w-full flex-wrap justify-center gap-9">
        <div
          v-for="(step, i) of steps"
          :key="i"
          class="relative flex min-h-[277px] w-[376px] max-w-full flex-col gap-6 overflow-hidden rounded-[10px] border border-brand-blue px-[40px] py-[32px]"
        >
          <p class="font-serif text-[24px] font-bold text-brand-blue">
            {{ step.title }}
          </p>
          <ul
            class="list-disc space-y-0 pl-6 font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            <li v-for="(it, j) of step.items" :key="j">{{ it }}</li>
          </ul>
          <span
            class="pointer-events-none absolute -bottom-2 right-4 bg-brand-card px-1 font-serif text-[110px] font-bold leading-none text-brand-blue"
          >
            {{ i + 1 }}
          </span>
        </div>
      </div>

      <SectionButton :label="ctaLabel" :href="ctaHref" />
    </div>
  </section>
</template>
