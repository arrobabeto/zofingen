<script setup lang="ts">
  defineProps<{
    cards: { title: string; items?: string[]; body?: string }[]
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-wrap items-stretch justify-center gap-9"
    >
      <div
        v-for="(c, i) of cards"
        :key="i"
        class="flex w-[582px] max-w-full flex-col items-center gap-8 rounded-[10px] bg-brand-blue px-8 py-8 text-white"
      >
        <p class="w-full text-center font-serif text-[24px] font-bold">
          {{ c.title }}
        </p>
        <ul
          v-if="c.items"
          class="list-disc space-y-2 self-start pl-6 font-serif text-[18px] leading-[25px]"
        >
          <li v-for="(it, j) of c.items" :key="j">{{ it }}</li>
        </ul>
        <p
          v-else
          class="self-start font-serif text-[18px] leading-[25px]"
        >
          {{ c.body }}
        </p>
      </div>
    </div>
  </section>
</template>
