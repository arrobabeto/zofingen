<script setup lang="ts">
  defineProps<{
    services: { title: string; body: string; image: string }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-9">
      <article
        v-for="(s, i) of services"
        :key="i"
        class="flex w-[376px] max-w-full flex-col"
      >
        <div class="h-[210px] overflow-hidden rounded-t-[10px]">
          <img :src="s.image" alt="" class="h-full w-full object-cover" />
        </div>
        <div
          class="flex flex-1 flex-col items-center gap-8 rounded-b-[10px] bg-brand-card px-4 py-8 text-center text-brand-blue"
        >
          <p class="whitespace-pre-line font-serif text-[24px] font-bold">
            {{ s.title }}
          </p>
          <p class="font-serif text-[18px] leading-[25px]">
            {{ s.body }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
