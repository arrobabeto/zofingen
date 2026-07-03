<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    subtitle?: string
    steps: { title: string; body?: string; items?: string[] }[]
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
      <div class="flex flex-col items-center gap-6">
        <SectionHeading :title="title" align="center" />
        <p
          v-if="subtitle"
          class="text-center font-serif text-[18px] leading-[25px] text-brand-blue"
        >
          {{ subtitle }}
        </p>
      </div>

      <div class="flex w-[602px] max-w-full flex-col items-end gap-8">
        <div
          v-for="(s, i) of steps"
          :key="i"
          class="relative w-[582px] max-w-full"
        >
          <div
            class="flex min-h-[202px] flex-col justify-center gap-6 rounded-[10px] border border-brand-blue py-8 pl-[150px] pr-8"
          >
            <p class="font-serif text-[24px] font-bold text-brand-blue">
              {{ s.title }}
            </p>
            <ol
              v-if="s.items"
              class="list-decimal pl-6 font-serif text-[18px] leading-[25px] text-brand-blue"
            >
              <li v-for="(it, j) of s.items" :key="j">{{ it }}</li>
            </ol>
            <p
              v-else
              class="font-serif text-[18px] leading-[25px] text-brand-blue"
            >
              {{ s.body }}
            </p>
          </div>
          <span
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-white px-2 font-serif text-[128px] font-bold leading-none text-brand-light"
          >
            {{ i + 1 }}
          </span>
        </div>
      </div>

      <a
        :href="ctaHref || '#'"
        class="flex h-16 w-[376px] max-w-full items-center justify-center rounded-[10px] bg-brand-blue text-center font-serif text-[18px] font-bold text-white transition hover:bg-brand-blue2"
      >
        {{ ctaLabel }}
      </a>
    </div>
  </section>
</template>
