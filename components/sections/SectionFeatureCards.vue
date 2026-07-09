<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    cards: { title: string; body: string }[]
    wide?: boolean
    title?: string
    intro?: string
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
      <SectionHeading v-if="title" :title="title" />
      <p
        v-if="intro"
        class="max-w-[1160px] whitespace-pre-line text-center font-serif text-[18px] leading-[25px] text-brand-blue"
      >
        {{ intro }}
      </p>
      <div
        class="flex flex-wrap items-stretch justify-center gap-9"
        :class="wide ? 'max-w-[994px]' : 'max-w-[1200px]'"
      >
        <div
          v-for="(c, i) of cards"
          :key="i"
          class="flex max-w-full flex-col items-center gap-6 rounded-[10px] border border-brand-blue p-5 text-center lg:gap-8 lg:p-8"
          :class="wide ? 'w-[479px]' : 'w-[376px]'"
        >
          <p class="whitespace-pre-line font-serif text-[20px] font-bold text-brand-blue lg:text-[24px]">
            {{ c.title }}
          </p>
          <p
            class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-grey"
          >
            {{ c.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
