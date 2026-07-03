<script setup lang="ts">
  defineProps<{
    title: string
    body: string
    items: string[]
  }>()
</script>

<template>
  <section class="w-full bg-brand-card px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-start gap-8">
      <div class="flex flex-col items-start gap-4 lg:w-[490px]">
        <h2
          class="font-serif text-[42px] font-bold leading-[58px] text-brand-blue"
        >
          {{ title }}
        </h2>
        <span class="block h-[4px] w-[67px] bg-brand-blue" />
      </div>
      <div
        class="flex w-full flex-col gap-10 lg:flex-row lg:gap-[139px]"
      >
        <p
          class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue lg:w-[479px]"
        >
          {{ body }}
        </p>
        <ul
          class="list-disc space-y-4 pl-6 font-serif text-[18px] leading-[22px] text-brand-blue lg:w-[540px]"
        >
          <li v-for="(it, i) of items" :key="i">{{ it }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
