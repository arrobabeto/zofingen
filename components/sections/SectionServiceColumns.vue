<script setup lang="ts">
  import SectionButton from "./_SectionButton.vue"

  defineProps<{
    intro: string
    image: string
    columns: { title: string; items?: string[]; body?: string }[]
    ctaLabel: string
    ctaHref?: string
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
      <p
        class="max-w-[994px] whitespace-pre-line text-center font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ intro }}
      </p>

      <img
        :src="image"
        alt=""
        class="h-[391px] w-full max-w-[993px] rounded-[10px] object-cover"
      />

      <div class="flex w-full flex-wrap items-stretch justify-center gap-9">
        <div
          v-for="(col, i) of columns"
          :key="i"
          class="flex w-[376px] max-w-full flex-col items-center gap-8 rounded-[10px] border border-brand-blue px-8 pb-16 pt-8"
        >
          <p
            class="w-full text-center font-serif text-[24px] font-bold text-brand-blue"
          >
            {{ col.title }}
          </p>
          <ul
            v-if="col.items"
            class="list-disc space-y-2 self-start pl-6 font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            <li v-for="(it, j) of col.items" :key="j">{{ it }}</li>
          </ul>
          <p
            v-else
            class="text-center font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            {{ col.body }}
          </p>
        </div>
      </div>

      <SectionButton :label="ctaLabel" :href="ctaHref" />
    </div>
  </section>
</template>
