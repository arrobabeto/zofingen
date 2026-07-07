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
          class="relative mx-auto w-full max-w-[376px] pb-[69px]"
        >
          <div
            class="relative flex h-[277px] flex-col gap-6 rounded-[10px] border border-brand-blue px-8 pb-8 pt-8"
          >
            <p class="font-serif text-[24px] font-bold leading-normal text-brand-blue">
              {{ step.title }}
            </p>
            <ul
              class="list-disc space-y-0 pl-6 font-serif text-[18px] leading-[25px] text-brand-blue"
            >
              <li v-for="(it, j) of step.items" :key="j">{{ it }}</li>
            </ul>
          </div>

          <div
            class="pointer-events-none absolute right-[-27px] top-[144px] h-[202px] w-[103px]"
          >
            <div
              class="absolute bottom-0 right-0 h-[122px] w-[103px] bg-brand-card"
            />
            <span
              class="absolute left-1/2 top-[calc(50%-10px)] -translate-x-1/2 -translate-y-1/2 font-serif text-[128px] font-bold leading-[58px] text-brand-blue"
            >
              {{ i + 1 }}
            </span>
          </div>
        </div>
      </div>

      <SectionButton :label="ctaLabel" :href="ctaHref" size="medium" />
    </div>
  </section>
</template>
