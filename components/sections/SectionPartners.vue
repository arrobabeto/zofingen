<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"

  defineProps<{
    title: string
    logos: string[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-12">
      <SectionHeading :title="title" align="center" />
      <div class="flex flex-wrap items-center justify-center gap-x-11 gap-y-8">
        <img
          v-for="(src, i) of logos"
          :key="i"
          :src="src"
          alt=""
          class="h-[45px] w-auto object-contain opacity-70 grayscale"
        />
      </div>
    </div>
  </section>
</template>
