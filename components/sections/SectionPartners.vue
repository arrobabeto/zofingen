<script setup lang="ts">
  defineProps<{
    title: string
    partners: { src: string; href: string; alt: string }[]
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
      <div
        class="flex w-full max-w-[1100px] flex-wrap items-center justify-center gap-x-10 gap-y-10 lg:gap-x-11"
      >
        <a
          v-for="(p, i) of partners"
          :key="i"
          :href="p.href"
          :aria-label="p.alt"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-14 w-[150px] items-center justify-center sm:h-16 sm:w-[170px] lg:h-[64px] lg:w-[180px]"
        >
          <img
            :src="p.src"
            :alt="p.alt"
            class="partner-logo max-h-full max-w-full object-contain opacity-80 grayscale"
          />
        </a>
      </div>
    </div>
  </section>
</template>
