<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    articles: { title: string; image: string }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-start gap-16">
      <SectionHeading :title="title" align="left" />
      <div class="flex w-full flex-wrap justify-center gap-9">
        <article
          v-for="(a, i) of articles"
          :key="i"
          class="flex w-[376px] max-w-full flex-col"
        >
          <div class="h-[210px] overflow-hidden rounded-t-[10px]">
            <img :src="a.image" alt="" class="h-full w-full object-cover" />
          </div>
          <div
            class="flex flex-1 items-center justify-center rounded-b-[10px] bg-brand-blue px-4 py-8"
          >
            <p class="text-center font-serif text-[24px] font-bold text-white">
              {{ a.title }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
