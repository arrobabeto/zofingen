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
      <div class="flex flex-col items-center gap-4 text-center">
        <h2
          class="whitespace-normal font-serif text-[32px] font-bold leading-tight text-brand-blue sm:whitespace-nowrap lg:text-[36px]"
        >
          {{ title }}
        </h2>
        <span class="block h-[4px] w-[67px] bg-brand-blue" />
      </div>
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 lg:gap-x-11">
        <img
          v-for="(src, i) of logos"
          :key="i"
          :src="src"
          alt=""
          class="partner-logo h-8 w-auto max-w-[100px] object-contain opacity-70 grayscale lg:h-9"
        />
      </div>
    </div>
  </section>
</template>
